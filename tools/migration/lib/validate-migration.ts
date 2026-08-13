import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

import { Ajv2020, type ValidateFunction } from "ajv/dist/2020.js";

import type { ProjectDiagnostic } from "../../../src/model/diagnostics.js";
import type {
  CoreFamilyMap,
  CoreMarkdownInventory,
  FamilyCoverage,
} from "../../../src/migration/types.js";
import { compareCodeUnits, sortProjectDiagnostics } from "../../lib/errors.js";
import { readGitMarkdownSnapshot } from "./git-snapshot.js";

const execFile = promisify(execFileCallback);
const migrationDirectory = "migrations/V0_1_0a_1/core";

export interface DeletionReadiness {
  familyId: string;
  sourceCommit: string;
  sourcePaths: string[];
  ready: boolean;
  diagnostics: ProjectDiagnostic[];
}

export interface CoveredPathMention {
  sourcePath: string;
  line: number;
  targetPath: string;
  lineSha256: string;
}

export interface FamilyDeletionReadinessInput {
  projectRoot: string;
  sourceRoot: string;
  inventory: CoreMarkdownInventory;
  familyMap: CoreFamilyMap;
  coverage: FamilyCoverage;
  phase?: "normal" | "cleanup-candidate";
}

let migrationValidatorPromise: Promise<ValidateFunction> | undefined;

function diagnostic(
  code: string,
  message: string,
  file: string,
  hint: string,
): ProjectDiagnostic {
  return { code, message, file, hint };
}

function coverageFile(familyId: string): string {
  return `${migrationDirectory}/families/${familyId}/coverage.json`;
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function migrationValidator(): Promise<ValidateFunction> {
  migrationValidatorPromise ??= (async () => {
    const schema = JSON.parse(
      await readFile(new URL("../../../schemas/document-migration.schema.json", import.meta.url), "utf8"),
    ) as object;
    return new Ajv2020({ allErrors: true, strict: true }).compile(schema);
  })();
  return migrationValidatorPromise;
}

async function loadArtifact(
  projectRoot: string,
  relativePath: string,
  required: boolean,
): Promise<{ value?: unknown; diagnostics: ProjectDiagnostic[] }> {
  const absolutePath = join(projectRoot, ...relativePath.split("/"));
  if (!(await pathExists(absolutePath))) {
    return {
      diagnostics: required
        ? [diagnostic(
            "MIGRATION_ARTIFACT_MISSING",
            "A required Core migration artifact is missing.",
            relativePath,
            "Restore the complete inventory, family map, and reviewed-family coverage set.",
          )]
        : [],
    };
  }
  let value: unknown;
  try {
    value = JSON.parse(await readFile(absolutePath, "utf8"));
  } catch {
    return {
      diagnostics: [diagnostic(
        "MIGRATION_ARTIFACT_INVALID_JSON",
        "The Core migration artifact is not valid readable JSON.",
        relativePath,
        "Repair the artifact before using migration readiness checks.",
      )],
    };
  }
  const validate = await migrationValidator();
  if (!validate(value)) {
    return {
      diagnostics: [diagnostic(
        "MIGRATION_ARTIFACT_SCHEMA_INVALID",
        "The Core migration artifact does not match the migration schema.",
        relativePath,
        "Update the complete artifact to match schemas/document-migration.schema.json.",
      )],
    };
  }
  return { value, diagnostics: [] };
}

function uniqueCounts(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

async function loadDocumentRecords(projectRoot: string): Promise<Map<string, string>> {
  const directory = join(projectRoot, "data", "documents");
  if (!(await pathExists(directory))) {
    return new Map();
  }
  const records = new Map<string, string>();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }
    try {
      const value = JSON.parse(await readFile(join(directory, entry.name), "utf8")) as {
        kind?: unknown;
        id?: unknown;
        path?: unknown;
      };
      if (value.kind === "document" && typeof value.id === "string" && typeof value.path === "string") {
        records.set(value.id, value.path);
      }
    } catch {
      // Canonical Project Control validation reports malformed source records.
    }
  }
  return records;
}

async function validateClosure(
  projectRoot: string,
  inventory: CoreMarkdownInventory,
  familyMap: CoreFamilyMap,
  coverages: FamilyCoverage[],
): Promise<ProjectDiagnostic[]> {
  const diagnostics: ProjectDiagnostic[] = [];
  const familyPath = `${migrationDirectory}/family-map.json`;
  const inventoryPath = `${migrationDirectory}/inventory.json`;
  if (inventory.sourceDigest !== familyMap.inventoryDigest) {
    diagnostics.push(diagnostic(
      "MIGRATION_INVENTORY_DIGEST_MISMATCH",
      "The family map does not bind the stored inventory digest.",
      familyPath,
      "Regenerate or repair the family map from the exact stored inventory.",
    ));
  }

  const inventoryPaths = new Set(inventory.files.map((file) => file.path));
  const inventoryCounts = uniqueCounts(inventory.files.map((file) => file.path));
  for (const [path, count] of [...inventoryCounts.entries()].sort(([left], [right]) => compareCodeUnits(left, right))) {
    if (count > 1) {
      diagnostics.push(diagnostic(
        "MIGRATION_INVENTORY_SOURCE_DUPLICATE",
        `Inventory source ${path} appears ${count} times.`,
        inventoryPath,
        "Keep exactly one captured inventory row for every source path.",
      ));
    }
  }
  const assignmentCounts = uniqueCounts(
    familyMap.families.flatMap((family) => family.sources.map((source) => source.path)),
  );
  for (const path of [...inventoryPaths].sort(compareCodeUnits)) {
    const count = assignmentCounts.get(path) ?? 0;
    if (count === 0) {
      diagnostics.push(diagnostic(
        "MIGRATION_SOURCE_UNASSIGNED",
        `Inventory source ${path} is not assigned to a family.`,
        familyPath,
        "Assign every inventory source to exactly one family.",
      ));
    } else if (count > 1) {
      diagnostics.push(diagnostic(
        "MIGRATION_SOURCE_ASSIGNED_MULTIPLE_TIMES",
        `Inventory source ${path} is assigned ${count} times.`,
        familyPath,
        "Keep exactly one family assignment for every inventory source.",
      ));
    }
  }
  for (const path of [...assignmentCounts.keys()].sort(compareCodeUnits)) {
    if (!inventoryPaths.has(path)) {
      diagnostics.push(diagnostic(
        "MIGRATION_FAMILY_SOURCE_UNKNOWN",
        `Family source ${path} is absent from the inventory.`,
        familyPath,
        "Remove the assignment or capture the source in the bound inventory.",
      ));
    }
  }

  const inventoryByPath = new Map(inventory.files.map((file) => [file.path, file]));
  const familiesById = new Map(familyMap.families.map((family) => [family.familyId, family]));
  const documents = await loadDocumentRecords(projectRoot);
  for (const coverage of coverages) {
    const file = coverageFile(coverage.familyId);
    const family = familiesById.get(coverage.familyId);
    if (family === undefined) {
      diagnostics.push(diagnostic(
        "MIGRATION_COVERAGE_FAMILY_UNKNOWN",
        `Coverage names unknown family ${coverage.familyId}.`,
        file,
        "Bind coverage to one family from the stored family map.",
      ));
      continue;
    }
    if (
      coverage.inventoryDigest !== inventory.sourceDigest ||
      coverage.sourceCommit.toLowerCase() !== inventory.sourceCommit.toLowerCase()
    ) {
      diagnostics.push(diagnostic(
        "MIGRATION_COVERAGE_SNAPSHOT_MISMATCH",
        "Coverage does not bind the stored inventory snapshot.",
        file,
        "Use the inventory digest and source commit captured by the stored inventory.",
      ));
    }
    const coverageCounts = uniqueCounts(coverage.sources.map((source) => source.path));
    for (const source of family.sources) {
      const count = coverageCounts.get(source.path) ?? 0;
      if (count === 0) {
        diagnostics.push(diagnostic(
          "MIGRATION_COVERAGE_SOURCE_MISSING",
          `Coverage omits family source ${source.path}.`,
          file,
          "Cover every assigned family source exactly once.",
        ));
      } else if (count > 1) {
        diagnostics.push(diagnostic(
          "MIGRATION_COVERAGE_SOURCE_DUPLICATE",
          `Coverage repeats family source ${source.path}.`,
          file,
          "Keep one coverage row for every assigned family source.",
        ));
      }
    }
    for (const source of coverage.sources) {
      if (!family.sources.some((candidate) => candidate.path === source.path)) {
        diagnostics.push(diagnostic(
          "MIGRATION_COVERAGE_SOURCE_UNKNOWN",
          `Coverage source ${source.path} is not assigned to ${coverage.familyId}.`,
          file,
          "Remove the row or correct the family assignment.",
        ));
      }
      const inventoryFile = inventoryByPath.get(source.path);
      if (inventoryFile !== undefined && source.blobId.toLowerCase() !== inventoryFile.blobId.toLowerCase()) {
        diagnostics.push(diagnostic(
          "MIGRATION_COVERAGE_BLOB_MISMATCH",
          `Coverage source ${source.path} does not bind its captured inventory blob.`,
          file,
          "Use the exact blob ID from the stored inventory.",
        ));
      }
      if (source.destinationPath !== null) {
        const destination = join(projectRoot, ...source.destinationPath.split("/"));
        if (!(await pathExists(destination))) {
          diagnostics.push(diagnostic(
            "MIGRATION_DESTINATION_MISSING",
            `Canonical destination ${source.destinationPath} is absent.`,
            file,
            "Publish the named canonical Markdown destination before closing coverage.",
          ));
        }
      }
    }
    for (const documentId of coverage.canonicalDocumentIds) {
      const documentPath = documents.get(documentId);
      if (documentPath === undefined) {
        diagnostics.push(diagnostic(
          "MIGRATION_DOCUMENT_RECORD_MISSING",
          `Canonical Document ${documentId} is not registered in data/documents.`,
          file,
          "Register every canonical Document ID before authorizing deletion.",
        ));
      } else {
        const destinations = new Set(
          coverage.sources.flatMap((source) => source.destinationPath === null ? [] : [source.destinationPath]),
        );
        if (!destinations.has(documentPath)) {
          diagnostics.push(diagnostic(
            "MIGRATION_DOCUMENT_DESTINATION_MISMATCH",
            `Canonical Document ${documentId} does not register a covered destination.`,
            file,
            "Point every named canonical Document at one destination in this family coverage.",
          ));
        }
      }
    }
  }

  if (inventory.expectedFileCount !== inventory.files.length) {
    diagnostics.push(diagnostic(
      "MIGRATION_INVENTORY_COUNT_MISMATCH",
      "The inventory file count does not match its captured file rows.",
      inventoryPath,
      "Restore the complete inventory before validating closure.",
    ));
  }
  return diagnostics;
}

export async function validateStoredCoreMigration(projectRoot: string): Promise<ProjectDiagnostic[]> {
  const coreRoot = join(projectRoot, ...migrationDirectory.split("/"));
  if (!(await pathExists(coreRoot))) {
    return [];
  }
  const inventoryResult = await loadArtifact(projectRoot, `${migrationDirectory}/inventory.json`, true);
  const familyMapResult = await loadArtifact(projectRoot, `${migrationDirectory}/family-map.json`, true);
  const diagnostics = [...inventoryResult.diagnostics, ...familyMapResult.diagnostics];
  if (inventoryResult.value === undefined || familyMapResult.value === undefined) {
    return sortProjectDiagnostics(diagnostics);
  }
  const inventory = inventoryResult.value as CoreMarkdownInventory;
  const familyMap = familyMapResult.value as CoreFamilyMap;
  const reviewedFamilies = familyMap.families
    .filter((family) => family.reviewState === "pilot-reviewed")
    .sort((left, right) => compareCodeUnits(left.familyId, right.familyId));
  const coveragePaths = new Set(reviewedFamilies.map((family) => coverageFile(family.familyId)));
  const familiesRoot = join(coreRoot, "families");
  if (await pathExists(familiesRoot)) {
    for (const entry of await readdir(familiesRoot, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const relativePath = `${migrationDirectory}/families/${entry.name}/coverage.json`;
        if (await pathExists(join(familiesRoot, entry.name, "coverage.json"))) {
          coveragePaths.add(relativePath);
        }
      }
    }
  }
  const coverages: FamilyCoverage[] = [];
  for (const relativePath of [...coveragePaths].sort(compareCodeUnits)) {
    const required = reviewedFamilies.some((family) => coverageFile(family.familyId) === relativePath);
    const result = await loadArtifact(projectRoot, relativePath, required);
    diagnostics.push(...result.diagnostics);
    if (result.value !== undefined) {
      coverages.push(result.value as FamilyCoverage);
    }
  }
  if (reviewedFamilies.length === 0) {
    diagnostics.push(diagnostic(
      "MIGRATION_COVERAGE_SET_MISSING",
      "The stored Core migration has no reviewed family coverage artifact.",
      migrationDirectory,
      "Add schema-valid coverage for a reviewed family or remove the partial migration directory.",
    ));
  }
  diagnostics.push(...await validateClosure(projectRoot, inventory, familyMap, coverages));
  return sortProjectDiagnostics(diagnostics);
}

async function runGit(repositoryRoot: string, args: string[]): Promise<Buffer> {
  try {
    const { stdout } = await execFile("git", args, { cwd: repositoryRoot, encoding: "buffer" });
    return stdout as Buffer;
  } catch {
    throw new Error("Unable to inspect the Core Git repository.");
  }
}

function decodeUtf8(bytes: Buffer): string | null {
  if (bytes.includes(0)) {
    return null;
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

function normalizedLineHash(line: string): string {
  return createHash("sha256").update(line.normalize("NFC"), "utf8").digest("hex");
}

export async function collectCoveredPathMentions(
  sourceRoot: string,
  targetPaths: string[],
): Promise<CoveredPathMention[]> {
  const tracked = (await runGit(sourceRoot, ["ls-files", "-z"]))
    .toString("utf8")
    .split("\0")
    .filter((path) => path.length > 0)
    .sort(compareCodeUnits);
  const excluded = new Set(targetPaths);
  const targets = [...new Set(targetPaths)].sort(compareCodeUnits);
  const mentions: CoveredPathMention[] = [];
  for (const sourcePath of tracked) {
    if (excluded.has(sourcePath)) {
      continue;
    }
    let bytes: Buffer;
    try {
      bytes = await readFile(join(sourceRoot, ...sourcePath.split("/")));
    } catch {
      continue;
    }
    const content = decodeUtf8(bytes);
    if (content === null) {
      continue;
    }
    const lines = content.split(/\r?\n/u);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]!;
      for (const targetPath of targets) {
        if (line.includes(targetPath)) {
          mentions.push({
            sourcePath,
            line: index + 1,
            targetPath,
            lineSha256: normalizedLineHash(line),
          });
        }
      }
    }
  }
  return mentions;
}

function readinessResult(
  input: FamilyDeletionReadinessInput,
  sourcePaths: string[],
  diagnostics: ProjectDiagnostic[],
): DeletionReadiness {
  const sortedDiagnostics = sortProjectDiagnostics(diagnostics);
  return {
    familyId: input.coverage.familyId,
    sourceCommit: input.coverage.sourceCommit,
    sourcePaths: [...sourcePaths].sort(compareCodeUnits),
    ready: sortedDiagnostics.length === 0,
    diagnostics: sortedDiagnostics,
  };
}

async function gitStatus(sourceRoot: string): Promise<Array<{ status: string; path: string }>> {
  const records = (await runGit(sourceRoot, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]))
    .toString("utf8")
    .split("\0")
    .filter((record) => record.length > 0);
  return records.map((record) => ({ status: record.slice(0, 2), path: record.slice(3) }));
}

function mentionDiagnostics(
  input: FamilyDeletionReadinessInput,
  mentions: CoveredPathMention[],
): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = [];
  const allowanceKeys = new Map(
    input.coverage.retainedHistoricalReferences.map((allowance) => [
      `${allowance.sourcePath}\0${allowance.line}\0${allowance.targetPath}\0${allowance.lineSha256}`,
      allowance,
    ]),
  );
  const matched = new Set<string>();
  for (const mention of mentions) {
    const key = `${mention.sourcePath}\0${mention.line}\0${mention.targetPath}\0${mention.lineSha256}`;
    const allowance = allowanceKeys.get(key);
    if (allowance !== undefined && allowance.rationale.trim().length > 0) {
      matched.add(key);
      continue;
    }
    diagnostics.push(diagnostic(
      "MIGRATION_ACTIVE_PATH_MENTION",
      `${mention.sourcePath}:${mention.line} mentions covered source ${mention.targetPath}.`,
      mention.sourcePath,
      "Remove the active mention or add an exact reviewed historical allowance.",
    ));
  }
  for (const allowance of input.coverage.retainedHistoricalReferences) {
    const key = `${allowance.sourcePath}\0${allowance.line}\0${allowance.targetPath}\0${allowance.lineSha256}`;
    if (!matched.has(key)) {
      diagnostics.push(diagnostic(
        "MIGRATION_HISTORICAL_ALLOWANCE_STALE",
        `${allowance.sourcePath}:${allowance.line} no longer matches its historical allowance.`,
        allowance.sourcePath,
        "Remove or update the allowance after reviewing the exact current line.",
      ));
    }
  }
  return diagnostics;
}

export async function evaluateFamilyDeletionReadiness(
  input: FamilyDeletionReadinessInput,
): Promise<DeletionReadiness> {
  const diagnostics: ProjectDiagnostic[] = [];
  const file = coverageFile(input.coverage.familyId);
  const deletionSources = input.coverage.sources
    .filter((source) => source.disposition !== "repo-local-keep")
    .map((source) => source.path)
    .sort(compareCodeUnits);
  if (input.coverage.status !== "ready-for-deletion") {
    diagnostics.push(diagnostic(
      "MIGRATION_COVERAGE_NOT_READY",
      `Coverage status ${input.coverage.status} does not authorize source deletion.`,
      file,
      "Complete review and publish ready-for-deletion coverage before cleanup.",
    ));
  }
  for (const reference of input.coverage.activeReferences) {
    diagnostics.push(diagnostic(
      "MIGRATION_ACTIVE_REFERENCE",
      `${reference.sourcePath}:${reference.line} retains an active reference to ${reference.targetPath}.`,
      reference.sourcePath,
      "Resolve every recorded active reference before deletion.",
    ));
  }

  let snapshot: Awaited<ReturnType<typeof readGitMarkdownSnapshot>> = [];
  try {
    snapshot = await readGitMarkdownSnapshot(input.sourceRoot, input.coverage.sourceCommit.toLowerCase());
  } catch {
    diagnostics.push(diagnostic(
      "MIGRATION_SOURCE_SNAPSHOT_UNAVAILABLE",
      "The captured Core source commit cannot be read.",
      file,
      "Use the exact available source checkout and captured coverage commit.",
    ));
  }
  const snapshotByPath = new Map(snapshot.map((entry) => [entry.path, entry]));
  const phase = input.phase ?? "normal";
  const status = await gitStatus(input.sourceRoot);
  if (phase === "normal" && status.length > 0) {
    diagnostics.push(diagnostic(
      "MIGRATION_SOURCE_TREE_DIRTY",
      "Normal readiness requires a clean Core worktree.",
      file,
      "Commit, restore, or remove every Core worktree change before checking readiness.",
    ));
  }
  if (phase === "cleanup-candidate") {
    const expected = new Set(deletionSources);
    const exact = status.length === expected.size && status.every(
      (entry) => entry.status === "D " && expected.has(entry.path),
    );
    if (!exact) {
      diagnostics.push(diagnostic(
        "MIGRATION_CLEANUP_SCOPE_INVALID",
        "Cleanup-candidate mode permits only the exact staged covered deletions.",
        file,
        "Stage every covered non-keep deletion and no other Core change.",
      ));
    }
  }

  for (const source of input.coverage.sources) {
    const absolutePath = join(input.sourceRoot, ...source.path.split("/"));
    const exists = await pathExists(absolutePath);
    if (source.disposition === "repo-local-keep" && !exists) {
      diagnostics.push(diagnostic(
        "MIGRATION_REPO_LOCAL_KEEP_DELETED",
        `Repository-local keep ${source.path} is absent.`,
        source.path,
        "Restore every repository-local keep; it is never in deletion scope.",
      ));
      continue;
    }
    if (phase === "normal" && !exists) {
      diagnostics.push(diagnostic(
        "MIGRATION_SOURCE_DELETED_EARLY",
        `Covered source ${source.path} is absent before authorized cleanup.`,
        source.path,
        "Restore the captured source before running normal readiness.",
      ));
      continue;
    }
    if (phase === "cleanup-candidate" && source.disposition !== "repo-local-keep" && exists) {
      diagnostics.push(diagnostic(
        "MIGRATION_CLEANUP_INCOMPLETE",
        `Covered source ${source.path} still exists during cleanup candidate verification.`,
        source.path,
        "Delete every covered non-keep source in the exact staged cleanup.",
      ));
      continue;
    }
    if (exists) {
      const captured = snapshotByPath.get(source.path);
      const inventory = input.inventory.files.find((candidate) => candidate.path === source.path);
      const current = await readFile(absolutePath);
      if (
        captured === undefined ||
        inventory === undefined ||
        captured.blobId.toLowerCase() !== source.blobId.toLowerCase() ||
        inventory.blobId.toLowerCase() !== source.blobId.toLowerCase() ||
        !current.equals(Buffer.from(captured.content, "utf8"))
      ) {
        diagnostics.push(diagnostic(
          "MIGRATION_SOURCE_BLOB_DRIFT",
          `Covered source ${source.path} differs from its captured blob.`,
          source.path,
          "Restore the exact captured bytes or restart migration review from a new inventory.",
        ));
      }
    }
  }
  const mentions = await collectCoveredPathMentions(input.sourceRoot, deletionSources);
  diagnostics.push(...mentionDiagnostics(input, mentions));
  return readinessResult(input, deletionSources, diagnostics);
}

export async function verifyFamilyCleanup(
  input: FamilyDeletionReadinessInput,
): Promise<DeletionReadiness> {
  const diagnostics: ProjectDiagnostic[] = [];
  const file = coverageFile(input.coverage.familyId);
  const deletionSources = input.coverage.sources
    .filter((source) => source.disposition !== "repo-local-keep")
    .map((source) => source.path)
    .sort(compareCodeUnits);
  if (input.coverage.status !== "closed" || input.coverage.coreCleanupCommit === null) {
    diagnostics.push(diagnostic(
      "MIGRATION_COVERAGE_NOT_CLOSED",
      "Cleanup verification requires closed coverage with a cleanup commit.",
      file,
      "Record closed coverage only after the exact cleanup commit exists.",
    ));
  }
  const head = (await runGit(input.sourceRoot, ["rev-parse", "HEAD"])).toString("utf8").trim();
  if (input.coverage.coreCleanupCommit?.toLowerCase() !== head.toLowerCase()) {
    diagnostics.push(diagnostic(
      "MIGRATION_CLEANUP_COMMIT_MISMATCH",
      "Core HEAD does not equal the recorded cleanup commit.",
      file,
      "Check out the exact recorded cleanup commit before verifying closure.",
    ));
  }
  if ((await gitStatus(input.sourceRoot)).length > 0) {
    diagnostics.push(diagnostic(
      "MIGRATION_SOURCE_TREE_DIRTY",
      "Closed cleanup verification requires a clean Core worktree.",
      file,
      "Commit, restore, or remove every Core worktree change before verifying closure.",
    ));
  }
  for (const source of input.coverage.sources) {
    const exists = await pathExists(join(input.sourceRoot, ...source.path.split("/")));
    if (source.disposition === "repo-local-keep" && !exists) {
      diagnostics.push(diagnostic(
        "MIGRATION_REPO_LOCAL_KEEP_DELETED",
        `Repository-local keep ${source.path} is absent.`,
        source.path,
        "Restore every repository-local keep.",
      ));
    } else if (source.disposition !== "repo-local-keep" && exists) {
      diagnostics.push(diagnostic(
        "MIGRATION_CLEANUP_INCOMPLETE",
        `Covered source ${source.path} still exists at the cleanup commit.`,
        source.path,
        "Remove every covered non-keep source in the authorized cleanup commit.",
      ));
    }
  }
  for (const reference of input.coverage.activeReferences) {
    diagnostics.push(diagnostic(
      "MIGRATION_ACTIVE_REFERENCE",
      `${reference.sourcePath}:${reference.line} retains an active reference to ${reference.targetPath}.`,
      reference.sourcePath,
      "Resolve every active reference before closing migration coverage.",
    ));
  }
  const mentions = await collectCoveredPathMentions(input.sourceRoot, deletionSources);
  diagnostics.push(...mentionDiagnostics(input, mentions));
  return readinessResult(input, deletionSources, diagnostics);
}
