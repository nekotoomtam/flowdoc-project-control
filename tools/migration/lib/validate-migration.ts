import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { access, lstat, readFile, readdir, realpath } from "node:fs/promises";
import { isAbsolute, join, relative } from "node:path";
import { promisify } from "node:util";

import { Ajv2020, type ValidateFunction } from "ajv/dist/2020.js";

import type { ProjectDiagnostic } from "../../../src/model/diagnostics.js";
import type {
  CoreFamilyMap,
  CoreMarkdownInventory,
  FamilyCoverage,
} from "../../../src/migration/types.js";
import { compareCodeUnits, ProjectValidationError, sortProjectDiagnostics } from "../../lib/errors.js";
import { loadProjectSources } from "../../lib/load-sources.js";
import { readGitMarkdownSnapshot } from "./git-snapshot.js";

const execFile = promisify(execFileCallback);
const migrationDirectory = "migrations/V0_1_0a_1/core";
const gitInspectionMaxBuffer = 64 * 1024 * 1024;

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

interface StoredCoverageArtifact {
  relativePath: string;
  storageFamilyId: string;
  value: FamilyCoverage;
}

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

function duplicateFamilyDiagnostics(familyMap: CoreFamilyMap): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = [];
  const counts = uniqueCounts(familyMap.families.map((family) => family.familyId));
  for (const [familyId, count] of [...counts.entries()].sort(([left], [right]) => compareCodeUnits(left, right))) {
    if (count > 1) {
      diagnostics.push(diagnostic(
        "MIGRATION_FAMILY_ID_DUPLICATE",
        `Family ID ${familyId} appears ${count} times.`,
        `${migrationDirectory}/family-map.json`,
        "Keep exactly one family assignment object for every family ID.",
      ));
    }
  }
  return diagnostics;
}

async function loadDocumentRecords(projectRoot: string): Promise<{
  records: Map<string, string[]>;
  pathCounts: Map<string, number>;
  diagnostics: ProjectDiagnostic[];
}> {
  try {
    const loaded = await loadProjectSources(projectRoot);
    const records = new Map<string, string[]>();
    const pathCounts = new Map<string, number>();
    for (const document of loaded.documents) {
      const paths = records.get(document.value.id) ?? [];
      paths.push(document.value.path);
      records.set(document.value.id, paths);
      pathCounts.set(document.value.path, (pathCounts.get(document.value.path) ?? 0) + 1);
    }
    return { records, pathCounts, diagnostics: [] };
  } catch (error: unknown) {
    if (error instanceof ProjectValidationError) {
      return { records: new Map(), pathCounts: new Map(), diagnostics: error.diagnostics };
    }
    return {
      records: new Map(),
      pathCounts: new Map(),
      diagnostics: [diagnostic(
        "MIGRATION_DOCUMENT_RECORD_INVALID",
        "Canonical Document records could not be validated.",
        "data/documents",
        "Repair canonical Project Control records before validating migration closure.",
      )],
    };
  }
}

async function destinationState(
  projectRoot: string,
  destinationPath: string,
): Promise<"missing" | "invalid" | "valid"> {
  const destination = join(projectRoot, ...destinationPath.split("/"));
  let status;
  try {
    status = await lstat(destination);
  } catch {
    return "missing";
  }
  if (
    !/\.(?:md|markdown)$/iu.test(destinationPath) ||
    !status.isFile() ||
    status.isSymbolicLink()
  ) {
    return "invalid";
  }
  try {
    const [rootPath, resolvedDestination] = await Promise.all([
      realpath(projectRoot),
      realpath(destination),
    ]);
    const containedPath = relative(rootPath, resolvedDestination);
    if (
      containedPath === "" ||
      containedPath === ".." ||
      containedPath.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) ||
      isAbsolute(containedPath)
    ) {
      return "invalid";
    }
  } catch {
    return "invalid";
  }
  return "valid";
}

async function validateClosure(
  projectRoot: string,
  inventory: CoreMarkdownInventory,
  familyMap: CoreFamilyMap,
  coverages: StoredCoverageArtifact[],
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
  const documentResult = await loadDocumentRecords(projectRoot);
  diagnostics.push(...documentResult.diagnostics);
  for (const artifact of coverages) {
    const coverage = artifact.value;
    const file = artifact.relativePath;
    if (coverage.familyId !== artifact.storageFamilyId) {
      diagnostics.push(diagnostic(
        "MIGRATION_COVERAGE_STORAGE_FAMILY_MISMATCH",
        `Coverage stored for ${artifact.storageFamilyId} declares family ${coverage.familyId}.`,
        file,
        "Make the coverage familyId exactly match its families/<familyId>/ storage directory.",
      ));
    }
    const family = familiesById.get(artifact.storageFamilyId);
    if (family === undefined) {
      diagnostics.push(diagnostic(
        "MIGRATION_COVERAGE_FAMILY_UNKNOWN",
        `Coverage is stored for unknown family ${artifact.storageFamilyId}.`,
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
        const state = await destinationState(projectRoot, source.destinationPath);
        if (state === "missing") {
          diagnostics.push(diagnostic(
            "MIGRATION_DESTINATION_MISSING",
            `Canonical destination ${source.destinationPath} is absent.`,
            file,
            "Publish the named canonical Markdown destination before closing coverage.",
          ));
        } else if (state === "invalid") {
          diagnostics.push(diagnostic(
            "MIGRATION_DESTINATION_INVALID",
            `Canonical destination ${source.destinationPath} is not a regular in-root Markdown file.`,
            file,
            "Use a real .md or .markdown file inside the Project Control root, never a directory or symlink escape.",
          ));
        }
      }
    }
    const destinations = new Set(
      coverage.sources.flatMap((source) => source.destinationPath === null ? [] : [source.destinationPath]),
    );
    const listedDocumentPaths: string[] = [];
    for (const documentId of coverage.canonicalDocumentIds) {
      const documentPaths = documentResult.records.get(documentId) ?? [];
      if (documentPaths.length === 0) {
        diagnostics.push(diagnostic(
          "MIGRATION_DOCUMENT_RECORD_MISSING",
          `Canonical Document ${documentId} is not registered in data/documents.`,
          file,
          "Register every canonical Document ID before authorizing deletion.",
        ));
      } else if (documentPaths.length > 1) {
        diagnostics.push(diagnostic(
          "MIGRATION_DOCUMENT_RECORD_AMBIGUOUS",
          `Canonical Document ${documentId} is registered more than once.`,
          file,
          "Keep exactly one schema-valid data/documents record for every canonical Document ID.",
        ));
      } else {
        const documentPath = documentPaths[0]!;
        listedDocumentPaths.push(documentPath);
      }
    }
    if (coverage.status !== "draft") {
      const listedPathCounts = uniqueCounts(listedDocumentPaths);
      for (const destinationPath of [...destinations].sort(compareCodeUnits)) {
        const listedCount = listedPathCounts.get(destinationPath) ?? 0;
        const registeredCount = documentResult.pathCounts.get(destinationPath) ?? 0;
        if (listedCount === 0) {
          diagnostics.push(diagnostic(
            "MIGRATION_DESTINATION_DOCUMENT_MISSING",
            `Canonical destination ${destinationPath} has no listed Document record.`,
            file,
            "List exactly one canonical Document ID for every covered destination.",
          ));
        } else if (listedCount > 1 || registeredCount > 1) {
          diagnostics.push(diagnostic(
            "MIGRATION_DESTINATION_DOCUMENT_AMBIGUOUS",
            `Canonical destination ${destinationPath} does not have exactly one unambiguous Document record.`,
            file,
            "List exactly one canonical Document ID for every covered destination.",
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
  const duplicateDiagnostics = duplicateFamilyDiagnostics(familyMap);
  if (duplicateDiagnostics.length > 0) {
    return sortProjectDiagnostics([...diagnostics, ...duplicateDiagnostics]);
  }
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
  const coverages: StoredCoverageArtifact[] = [];
  for (const relativePath of [...coveragePaths].sort(compareCodeUnits)) {
    const required = reviewedFamilies.some((family) => coverageFile(family.familyId) === relativePath);
    const result = await loadArtifact(projectRoot, relativePath, required);
    diagnostics.push(...result.diagnostics);
    if (result.value !== undefined) {
      const segments = relativePath.split("/");
      coverages.push({
        relativePath,
        storageFamilyId: segments[segments.length - 2]!,
        value: result.value as FamilyCoverage,
      });
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

interface GitResult {
  exitCode: number;
  stdout: Buffer;
}

async function runGitResult(repositoryRoot: string, args: string[]): Promise<GitResult> {
  try {
    const { stdout } = await execFile("git", args, {
      cwd: repositoryRoot,
      encoding: "buffer",
      maxBuffer: gitInspectionMaxBuffer,
    });
    return { exitCode: 0, stdout: stdout as Buffer };
  } catch (error) {
    const candidate = error as { code?: unknown; stdout?: unknown };
    return {
      exitCode: typeof candidate.code === "number" ? candidate.code : -1,
      stdout: Buffer.isBuffer(candidate.stdout) ? candidate.stdout : Buffer.alloc(0),
    };
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

type CommitMentionResult =
  | { kind: "ok"; mentions: CoveredPathMention[] }
  | { kind: "error" };

async function collectCoveredPathMentionsAtCommit(
  sourceRoot: string,
  commit: string,
  targetPaths: string[],
): Promise<CommitMentionResult> {
  const tree = await runGitResult(sourceRoot, ["ls-tree", "-r", "-z", "--name-only", commit, "--"]);
  if (tree.exitCode !== 0) {
    return { kind: "error" };
  }
  const tracked = tree.stdout.toString("utf8")
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
    const shown = await runGitResult(sourceRoot, ["show", `${commit}:${sourcePath}`]);
    if (shown.exitCode !== 0) {
      return { kind: "error" };
    }
    const content = decodeUtf8(shown.stdout);
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
  return { kind: "ok", mentions };
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

type GitStatusResult =
  | { kind: "ok"; entries: Array<{ status: string; path: string }> }
  | { kind: "error" };

async function inspectGitStatus(sourceRoot: string): Promise<GitStatusResult> {
  const result = await runGitResult(sourceRoot, [
    "status", "--porcelain=v1", "-z", "--untracked-files=all",
  ]);
  if (result.exitCode !== 0) {
    return { kind: "error" };
  }
  return {
    kind: "ok",
    entries: result.stdout.toString("utf8")
      .split("\0")
      .filter((record) => record.length > 0)
      .map((record) => ({ status: record.slice(0, 2), path: record.slice(3) })),
  };
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

function externalFamilyDiagnostics(input: FamilyDeletionReadinessInput): ProjectDiagnostic[] {
  const diagnostics = duplicateFamilyDiagnostics(input.familyMap);
  const counts = uniqueCounts(input.familyMap.families.map((family) => family.familyId));
  const selected = counts.get(input.coverage.familyId) ?? 0;
  if (selected === 0) {
    diagnostics.push(diagnostic(
      "MIGRATION_COVERAGE_FAMILY_UNKNOWN",
      `Coverage names unknown family ${input.coverage.familyId}.`,
      coverageFile(input.coverage.familyId),
      "Bind external readiness to exactly one family from the stored family map.",
    ));
  }
  return diagnostics;
}

async function cleanupPreimageMatches(
  input: FamilyDeletionReadinessInput,
  source: FamilyCoverage["sources"][number],
  captured: { blobId: string; content: string } | undefined,
): Promise<boolean> {
  const inventory = input.inventory.files.find((candidate) => candidate.path === source.path);
  if (
    captured === undefined ||
    inventory === undefined ||
    captured.blobId.toLowerCase() !== source.blobId.toLowerCase() ||
    inventory.blobId.toLowerCase() !== source.blobId.toLowerCase()
  ) {
    return false;
  }
  try {
    const [headBlob, headContent] = await Promise.all([
      runGit(input.sourceRoot, ["rev-parse", `HEAD:${source.path}`]),
      runGit(input.sourceRoot, ["show", `HEAD:${source.path}`]),
    ]);
    return (
      headBlob.toString("utf8").trim().toLowerCase() === source.blobId.toLowerCase() &&
      headContent.equals(Buffer.from(captured.content, "utf8"))
    );
  } catch {
    return false;
  }
}

export async function evaluateFamilyDeletionReadiness(
  input: FamilyDeletionReadinessInput,
): Promise<DeletionReadiness> {
  const diagnostics: ProjectDiagnostic[] = externalFamilyDiagnostics(input);
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
    if (
      phase === "cleanup-candidate" &&
      source.disposition !== "repo-local-keep" &&
      !(await cleanupPreimageMatches(input, source, snapshotByPath.get(source.path)))
    ) {
      diagnostics.push(diagnostic(
        "MIGRATION_CLEANUP_PREIMAGE_MISMATCH",
        `Staged deletion ${source.path} does not remove the captured source blob.`,
        source.path,
        "Restore the captured blob at HEAD before staging the authorized deletion.",
      ));
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

interface CleanupDelta {
  status: string;
  paths: string[];
}

function parseCleanupDelta(bytes: Buffer): CleanupDelta[] | null {
  const fields = bytes.toString("utf8").split("\0");
  if (fields.at(-1) === "") {
    fields.pop();
  }
  const entries: CleanupDelta[] = [];
  for (let index = 0; index < fields.length;) {
    const status = fields[index++];
    if (status === undefined || status.length === 0) {
      return null;
    }
    const pathCount = status.startsWith("R") || status.startsWith("C") ? 2 : 1;
    const paths = fields.slice(index, index + pathCount);
    if (paths.length !== pathCount || paths.some((path) => path.length === 0)) {
      return null;
    }
    entries.push({ status, paths });
    index += pathCount;
  }
  return entries;
}

type GitTreeEntryResult =
  | { kind: "absent" }
  | { kind: "blob"; blobId: string }
  | { kind: "nonblob"; objectType: string }
  | { kind: "error" };

async function inspectGitTreeEntry(
  sourceRoot: string,
  commit: string,
  sourcePath: string,
): Promise<GitTreeEntryResult> {
  const result = await runGitResult(sourceRoot, [
    "ls-tree", "-z", "--full-tree", commit, "--", sourcePath,
  ]);
  if (result.exitCode !== 0) {
    return { kind: "error" };
  }
  const records = result.stdout.toString("utf8").split("\0").filter((record) => record.length > 0);
  for (const record of records) {
    const tab = record.indexOf("\t");
    if (tab === -1 || record.slice(tab + 1) !== sourcePath) {
      continue;
    }
    const metadata = record.slice(0, tab).split(" ");
    if (metadata.length !== 3 || !/^[0-9a-f]{40}$/u.test(metadata[2]!)) {
      return { kind: "error" };
    }
    if (metadata[1] === "blob") {
      return { kind: "blob", blobId: metadata[2]! };
    }
    return { kind: "nonblob", objectType: metadata[1]! };
  }
  return { kind: "absent" };
}

function cleanupCommitUnavailable(
  file: string,
): ProjectDiagnostic {
  return diagnostic(
    "MIGRATION_CLEANUP_COMMIT_UNAVAILABLE",
    "The recorded Core cleanup commit is not an available exact commit object.",
    file,
    "Restore the exact recorded cleanup commit before verifying closure.",
  );
}

export async function verifyFamilyCleanup(
  input: FamilyDeletionReadinessInput,
): Promise<DeletionReadiness> {
  const diagnostics: ProjectDiagnostic[] = externalFamilyDiagnostics(input);
  const file = coverageFile(input.coverage.familyId);
  const deletionCoverage = input.coverage.sources
    .filter((source) => source.disposition !== "repo-local-keep");
  const deletionSources = deletionCoverage.map((source) => source.path).sort(compareCodeUnits);
  if (input.coverage.status !== "closed" || input.coverage.coreCleanupCommit === null) {
    diagnostics.push(diagnostic(
      "MIGRATION_COVERAGE_NOT_CLOSED",
      "Cleanup verification requires closed coverage with a cleanup commit.",
      file,
      "Record closed coverage only after the exact cleanup commit exists.",
    ));
  }
  const headInspection = await runGitResult(input.sourceRoot, ["rev-parse", "--verify", "HEAD^{commit}"]);
  const resolvedHead = headInspection.stdout.toString("utf8").trim().toLowerCase();
  const head = headInspection.exitCode === 0 && /^[0-9a-f]{40}$/u.test(resolvedHead)
    ? resolvedHead
    : undefined;
  if (head === undefined) {
    diagnostics.push(diagnostic(
      "MIGRATION_CLEANUP_SCOPE_INVALID",
      "The current Core commit tree is unavailable for closed cleanup verification.",
      file,
      "Restore a readable clean Core checkout before verifying closure.",
    ));
  }
  const status = await inspectGitStatus(input.sourceRoot);
  if (status.kind === "error") {
    diagnostics.push(diagnostic(
      "MIGRATION_CLEANUP_SCOPE_INVALID",
      "The current Core worktree status is unavailable for closed cleanup verification.",
      file,
      "Restore a readable clean Core checkout before verifying closure.",
    ));
  } else if (status.entries.length > 0) {
    diagnostics.push(diagnostic(
      "MIGRATION_SOURCE_TREE_DIRTY",
      "Closed cleanup verification requires a clean Core worktree.",
      file,
      "Commit, restore, or remove every Core worktree change before verifying closure.",
    ));
  }

  let cleanupCommit: string | undefined;
  let cleanupParent: string | undefined;
  const recordedCleanup = input.coverage.coreCleanupCommit;
  if (recordedCleanup !== null) {
    const cleanupCommitSpec = `${recordedCleanup}^{commit}`;
    const verified = await runGitResult(input.sourceRoot, ["rev-parse", "--verify", cleanupCommitSpec]);
    const resolved = verified.stdout.toString("utf8").trim().toLowerCase();
    if (
      verified.exitCode !== 0 ||
      !/^[0-9a-f]{40}$/u.test(resolved) ||
      resolved !== recordedCleanup.toLowerCase()
    ) {
      diagnostics.push(cleanupCommitUnavailable(file));
    } else {
      cleanupCommit = resolved;
      const ancestor = await runGitResult(input.sourceRoot, [
        "merge-base", "--is-ancestor", cleanupCommit, "HEAD",
      ]);
      if (ancestor.exitCode === 1) {
        diagnostics.push(diagnostic(
          "MIGRATION_CLEANUP_COMMIT_NOT_ANCESTOR",
          "The recorded Core cleanup commit is not an ancestor of the current Core HEAD.",
          file,
          "Use the recorded cleanup commit or a clean descendant that retains the verified deletion.",
        ));
      } else if (ancestor.exitCode !== 0) {
        diagnostics.push(cleanupCommitUnavailable(file));
      }

      const topology = await runGitResult(input.sourceRoot, [
        "rev-list", "--parents", "-n", "1", cleanupCommit,
      ]);
      const commits = topology.stdout.toString("utf8").trim().split(/\s+/u).filter(Boolean);
      if (topology.exitCode !== 0) {
        diagnostics.push(cleanupCommitUnavailable(file));
      } else if (commits.length !== 2 || commits[0]?.toLowerCase() !== cleanupCommit) {
        diagnostics.push(diagnostic(
          "MIGRATION_CLEANUP_COMMIT_TOPOLOGY_INVALID",
          "The recorded Core cleanup commit must have exactly one parent.",
          file,
          "Record a one-parent cleanup commit; the verifier does not guess a merge mainline.",
        ));
      } else {
        cleanupParent = commits[1]!.toLowerCase();
      }
    }
  }

  if (cleanupCommit !== undefined && cleanupParent !== undefined) {
    const deltaResult = await runGitResult(input.sourceRoot, [
      "diff-tree", "--no-commit-id", "--name-status", "-r", "-z",
      cleanupParent, cleanupCommit, "--",
    ]);
    const delta = deltaResult.exitCode === 0 ? parseCleanupDelta(deltaResult.stdout) : null;
    const expected = new Set(deletionSources);
    const seen = new Set<string>();
    const exactDelta = delta !== null && delta.every((entry) => {
      const path = entry.paths[0];
      if (entry.status !== "D" || entry.paths.length !== 1 || path === undefined || !expected.has(path) || seen.has(path)) {
        return false;
      }
      seen.add(path);
      return true;
    }) && seen.size === expected.size;
    if (!exactDelta) {
      diagnostics.push(diagnostic(
        "MIGRATION_CLEANUP_SCOPE_INVALID",
        "The recorded cleanup commit is not the exact covered deletion set.",
        file,
        "Use a one-parent commit containing every covered non-keep deletion and no other delta.",
      ));
    }

    for (const source of deletionCoverage) {
      const inventory = input.inventory.files.find((candidate) => candidate.path === source.path);
      const [parentEntry, capturedEntry] = await Promise.all([
        inspectGitTreeEntry(input.sourceRoot, cleanupParent, source.path),
        inspectGitTreeEntry(input.sourceRoot, input.coverage.sourceCommit.toLowerCase(), source.path),
      ]);
      if (
        parentEntry.kind !== "blob" ||
        capturedEntry.kind !== "blob" ||
        inventory === undefined ||
        parentEntry.blobId.toLowerCase() !== source.blobId.toLowerCase() ||
        capturedEntry.blobId.toLowerCase() !== source.blobId.toLowerCase() ||
        inventory.blobId.toLowerCase() !== source.blobId.toLowerCase()
      ) {
        diagnostics.push(diagnostic(
          "MIGRATION_CLEANUP_PREIMAGE_MISMATCH",
          `Cleanup parent ${source.path} does not match every captured source identity.`,
          source.path,
          "Delete only the exact blob bound by coverage, inventory, and the captured source commit.",
        ));
      }
    }
    // An exact D entry from cleanupParent to cleanupCommit is Git's direct
    // proof that the path is absent from the cleanup tree. A second ls-tree
    // query cannot describe an independently possible state.
  }

  for (const source of input.coverage.sources) {
    const existsInWorktree = await pathExists(join(input.sourceRoot, ...source.path.split("/")));
    const headEntry = head === undefined
      ? { kind: "error" } as const
      : await inspectGitTreeEntry(input.sourceRoot, head, source.path);
    if (headEntry.kind === "error") {
      diagnostics.push(diagnostic(
        "MIGRATION_CLEANUP_SCOPE_INVALID",
        `The current Core tree entry for ${source.path} is unavailable.`,
        source.path,
        "Restore a readable clean Core commit tree before verifying closure.",
      ));
      continue;
    }
    const existsInHead = headEntry.kind !== "absent";
    if (source.disposition === "repo-local-keep" && (!existsInWorktree || !existsInHead)) {
      diagnostics.push(diagnostic(
        "MIGRATION_REPO_LOCAL_KEEP_DELETED",
        `Repository-local keep ${source.path} is absent.`,
        source.path,
        "Restore every repository-local keep.",
      ));
    } else if (source.disposition !== "repo-local-keep" && (existsInWorktree || existsInHead)) {
      diagnostics.push(diagnostic(
        "MIGRATION_CLEANUP_INCOMPLETE",
        `Covered source ${source.path} still exists in the current Core tree or worktree.`,
        source.path,
        "Remove every covered non-keep source from both the current Git tree and filesystem.",
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
  if (head !== undefined) {
    const mentions = await collectCoveredPathMentionsAtCommit(input.sourceRoot, head, deletionSources);
    if (mentions.kind === "error") {
      diagnostics.push(diagnostic(
        "MIGRATION_CLEANUP_SCOPE_INVALID",
        "Tracked Core references could not be inspected at the current commit.",
        file,
        "Restore a readable clean Core commit tree before verifying closure.",
      ));
    } else {
      diagnostics.push(...mentionDiagnostics(input, mentions.mentions));
    }
  }
  return readinessResult(input, deletionSources, diagnostics);
}
