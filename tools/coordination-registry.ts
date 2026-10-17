import { execFile as execFileCallback } from "node:child_process";
import { open, readFile, realpath, rm, type FileHandle } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { isAbsolute, join, relative, resolve } from "node:path";
import { promisify } from "node:util";
import {
  CoordinationTransitionError,
  applyCoordinationCommand,
} from "../src/model/coordination.js";
import type { CoordinationCommandV2 } from "../src/model/coordination-v2.js";
import { packetDigest, type CoordinationCommandV3 } from "../src/model/coordination-v3.js";
import { evaluateScopeLock } from "../src/model/scope-lock.js";
import type { CoordinationRegistry, CoordinationRegistryV3, ScopeLockVerification, WorkRecord } from "../src/model/types.js";
import { ProjectValidationError } from "./lib/errors.js";
import {
  loadProjectSources,
  validateCanonicalRecordValue,
  type LoadedProjectSources,
} from "./lib/load-sources.js";
import { validateProjectSemantics } from "./lib/validate-semantics.js";
import { writeFileAtomically } from "./lib/write-atomic.js";
import { inspectGitScope } from "./lib/git-scope-verifier.js";

const execFile = promisify(execFileCallback);

export class CoordinationPersistenceError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = "CoordinationPersistenceError";
  }
}

export interface ApplyCoordinationCommandOptions {
  rootDir: string;
  workFile: string;
  expectedRevision: number;
  command: unknown;
}

export async function applyCoordinationCommandToWorkFile(
  options: ApplyCoordinationCommandOptions,
): Promise<CoordinationRegistry> {
  const rootDir = await realpath(resolve(options.rootDir));
  const workPath = await resolveConfinedWorkPath(rootDir, options.workFile);
  const relativePath = normalizeRelativePath(relative(rootDir, workPath));
  const guardPath = join(rootDir, "data", ".coordination-writer.lock");
  let guard: FileHandle | undefined;

  try {
    try {
      guard = await open(guardPath, "wx");
      await guard.writeFile(`${JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString() })}\n`, "utf8");
      await guard.sync();
    } catch (error: unknown) {
      if (isNodeError(error) && error.code === "EEXIST") {
        throw new CoordinationPersistenceError(
          "WRITER_GUARD_HELD",
          "Another cooperating local writer holds the coordination guard; it was not force-unlocked.",
        );
      }
      throw error;
    }

    const source = await readFile(workPath, "utf8");
    const work = parseWorkRecord(source, relativePath);
    if (work.coordination === undefined) {
      throw new CoordinationPersistenceError("COORDINATION_MISSING", "The Work record has no coordination registry.");
    }
    if (work.coordination.version !== 3) {
      throw new CoordinationTransitionError(
        "HISTORICAL_REGISTRY_READ_ONLY",
        `Version ${work.coordination.version} coordination is historical and cannot be mutated.`,
      );
    }
    if (work.coordination.revision !== options.expectedRevision) {
      throw new CoordinationPersistenceError(
        "REVISION_CONFLICT",
        `Expected coordination revision ${options.expectedRevision}, found ${work.coordination.revision}. Reload before retrying.`,
      );
    }

    const loaded = await loadProjectSources(rootDir);
    const command = parseCommand(options.command, work.coordination.version);
    const scopeLockVerification = await createScopeLockVerification(work.coordination, command);
    try {
      await validateProjectSemantics(loaded);
    } catch (error: unknown) {
      if (error instanceof ProjectValidationError) {
        throw new CoordinationPersistenceError(
          "CANDIDATE_INVALID",
          `Stored Work failed semantic validation: ${error.diagnostics.map(({ code }) => code).join(", ")}.`,
        );
      }
      throw error;
    }
    const evidenceById = new Map(loaded.evidence.map(({ value }) => [
      value.id,
      { repositoryId: value.repositoryId, commit: value.commit },
    ]));
    const coordination = applyCoordinationCommand(work.coordination, command, {
      evidenceById,
      ...(scopeLockVerification === undefined ? {} : { scopeLockVerification }),
    });
    const candidate: WorkRecord = { ...work, coordination };
    const schemaDiagnostics = await validateCanonicalRecordValue("work", relativePath, candidate);
    if (schemaDiagnostics.length > 0) {
      throw new CoordinationPersistenceError(
        "CANDIDATE_INVALID",
        `Candidate Work failed schema validation: ${schemaDiagnostics.map(({ code }) => code).join(", ")}.`,
      );
    }

    try {
      await validateProjectSemantics(replaceLoadedWork(loaded, relativePath, candidate));
    } catch (error: unknown) {
      if (error instanceof ProjectValidationError) {
        throw new CoordinationPersistenceError(
          "CANDIDATE_INVALID",
          `Candidate Work failed semantic validation: ${error.diagnostics.map(({ code }) => code).join(", ")}.`,
        );
      }
      throw error;
    }

    await writeFileAtomically(workPath, `${JSON.stringify(candidate, null, 2)}\n`);
    return coordination;
  } finally {
    if (guard !== undefined) {
      await guard.close();
      await rm(guardPath, { force: true });
    }
  }
}

async function createScopeLockVerification(
  registry: CoordinationRegistryV3,
  command: CoordinationCommandV2 | CoordinationCommandV3,
): Promise<ScopeLockVerification | undefined> {
  if (command.type !== "accept-handoff") return undefined;
  const handoff = registry.handoffs.find(({ handoffId }) => handoffId === command.handoffId);
  if (handoff === undefined) return undefined;
  const room = registry.roomRuns.find((candidate) =>
    candidate.roomRunId === handoff.payload.roomRunId &&
    candidate.revisionAttempt === handoff.payload.revisionAttempt);
  if (room === undefined || room.packet.policyId !== "flowdoc-workflow-economy-v2") return undefined;
  if (handoff.payload.exactCommit === undefined) {
    throw new CoordinationTransitionError("EXACT_COMMIT_REQUIRED", "Current-profile acceptance requires an exact terminal commit.");
  }
  const manifest = await inspectGitScope({
    worktree: room.locator.worktree ?? room.packet.scopeLock.worktree,
    baseCommit: room.packet.scopeLock.baseCommit,
    expectedHead: handoff.payload.exactCommit,
  });
  const evaluation = evaluateScopeLock({
    packet: room.packet,
    manifest,
    payloadChangedFiles: handoff.payload.changedFiles,
    completionChangedFiles: handoff.payload.completion.changedFiles,
    terminalCommit: handoff.payload.exactCommit,
    packetDigest: packetDigest(room.packet),
    expectedPacketDigest: room.packetDigest,
    verifiedAt: command.reviewedAt,
  });
  const issue = evaluation.issues[0];
  if (issue !== undefined) throw new CoordinationTransitionError(issue.code, issue.message);
  if (evaluation.verification === undefined) {
    throw new CoordinationTransitionError("SCOPE_VERIFICATION_REQUIRED", "Scope Lock evaluation did not produce a passing verification.");
  }
  return evaluation.verification;
}

export async function validateCoordinationRoot(rootDir: string): Promise<void> {
  await validateProjectSemantics(await loadProjectSources(await realpath(resolve(rootDir))));
}

export async function verifyAcceptedIntegrationCandidate(options: {
  rootDir: string;
  workFile: string;
  handoffId: string;
  repository: string;
  baseRef: string;
}): Promise<void> {
  const rootDir = await realpath(resolve(options.rootDir));
  const workPath = await resolveConfinedWorkPath(rootDir, options.workFile);
  const work = parseWorkRecord(await readFile(workPath, "utf8"), normalizeRelativePath(relative(rootDir, workPath)));
  if (work.coordination?.version !== 3) {
    throw new CoordinationTransitionError("HISTORICAL_REGISTRY_READ_ONLY", "Integration preflight requires a current version 3 registry.");
  }
  const registry = work.coordination;
  const handoff = registry.handoffs.find(({ handoffId }) => handoffId === options.handoffId);
  if (handoff === undefined || handoff.acceptance.status !== "accepted") {
    throw new CoordinationTransitionError("INTEGRATION_HANDOFF_NOT_ACCEPTED", "Integration preflight requires an accepted handoff.");
  }
  const verification = handoff.acceptance.scopeLockVerification;
  if (verification === undefined) {
    throw new CoordinationTransitionError("SCOPE_VERIFICATION_REQUIRED", "The accepted handoff has no persisted Scope Lock verification.");
  }
  const room = registry.roomRuns.find((candidate) =>
    candidate.roomRunId === handoff.payload.roomRunId &&
    candidate.revisionAttempt === handoff.payload.revisionAttempt);
  if (room === undefined || room.packet.policyId !== "flowdoc-workflow-economy-v2") {
    throw new CoordinationTransitionError("CURRENT_SCOPE_PACKET_REQUIRED", "Integration preflight requires a current Scope Lock packet.");
  }
  const repository = await realpath(resolve(options.repository));
  const packetWorktree = await realpath(resolve(room.packet.scopeLock.worktree));
  if (comparableFilesystemPath(repository) !== comparableFilesystemPath(packetWorktree)) {
    throw new CoordinationTransitionError("SCOPE_WORKTREE_MISMATCH", "Integration repository differs from the accepted Scope Lock worktree.");
  }
  const claim = registry.integrationClaims.find(({ repositoryId }) => repositoryId === room.ownerRepositoryId);
  if (claim === undefined) {
    throw new CoordinationTransitionError("INTEGRATION_CLAIM_MISSING", "The accepted room has no integration claim.");
  }
  let resolvedBaseRef: string;
  try {
    const { stdout } = await execFile("git", ["rev-parse", "--verify", `${options.baseRef}^{commit}`], {
      cwd: repository,
      encoding: "utf8",
      windowsHide: true,
    });
    resolvedBaseRef = stdout.trim();
  } catch {
    throw new CoordinationTransitionError("INTEGRATION_BASE_REF_MISMATCH", "The requested integration base ref does not resolve.");
  }
  if (
    resolvedBaseRef !== claim.baseCommit ||
    resolvedBaseRef !== room.packet.scopeLock.baseCommit ||
    resolvedBaseRef !== verification.baseCommit
  ) {
    throw new CoordinationTransitionError("INTEGRATION_BASE_REF_MISMATCH", "The integration base ref changed after acceptance.");
  }
  const manifest = await inspectGitScope({
    worktree: repository,
    baseCommit: verification.baseCommit,
    expectedHead: verification.terminalCommit,
  });
  if (manifest.dirty) {
    throw new CoordinationTransitionError("SCOPE_WORKTREE_DIRTY", "The accepted candidate became dirty after acceptance.");
  }
  const evaluation = evaluateScopeLock({
    packet: room.packet,
    manifest,
    payloadChangedFiles: handoff.payload.changedFiles,
    completionChangedFiles: handoff.payload.completion.changedFiles,
    terminalCommit: verification.terminalCommit,
    packetDigest: packetDigest(room.packet),
    expectedPacketDigest: room.packetDigest,
    verifiedAt: new Date().toISOString(),
  });
  const issue = evaluation.issues[0];
  if (issue !== undefined) throw new CoordinationTransitionError(issue.code, issue.message);
  const current = evaluation.verification;
  if (
    current === undefined ||
    current.baseCommit !== verification.baseCommit ||
    current.terminalCommit !== verification.terminalCommit ||
    current.packetDigest !== verification.packetDigest ||
    current.manifestDigest !== verification.manifestDigest ||
    !sameStringSet(current.changedFiles, verification.changedFiles)
  ) {
    throw new CoordinationTransitionError("SCOPE_VERIFICATION_STALE", "The accepted Scope Lock verification no longer matches the candidate.");
  }
}

async function resolveConfinedWorkPath(rootDir: string, workFile: string): Promise<string> {
  if (isAbsolute(workFile)) {
    throw new CoordinationPersistenceError("WORK_PATH_OUTSIDE_ROOT", "Work path must be relative to the Project Control root.");
  }
  const workRoot = await realpath(join(rootDir, "data", "work"));
  const requested = resolve(rootDir, workFile);
  ensureInsideWorkRoot(workRoot, requested);
  let target: string;
  try {
    target = await realpath(requested);
  } catch {
    throw new CoordinationPersistenceError("WORK_FILE_NOT_FOUND", "The requested Work record does not exist.");
  }
  ensureInsideWorkRoot(workRoot, target);
  return target;
}

function ensureInsideWorkRoot(workRoot: string, target: string): void {
  const fromWorkRoot = relative(workRoot, target);
  if (
    fromWorkRoot === ".." ||
    fromWorkRoot.startsWith("../") ||
    fromWorkRoot.startsWith("..\\") ||
    isAbsolute(fromWorkRoot) ||
    !target.toLowerCase().endsWith(".json")
  ) {
    throw new CoordinationPersistenceError("WORK_PATH_OUTSIDE_ROOT", "Work path must resolve inside root data/work.");
  }
}

function parseWorkRecord(source: string, relativePath: string): WorkRecord {
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch {
    throw new CoordinationPersistenceError("WORK_JSON_INVALID", `${relativePath} is not valid JSON.`);
  }
  if (typeof value !== "object" || value === null || !("kind" in value) || value.kind !== "work") {
    throw new CoordinationPersistenceError("WORK_RECORD_INVALID", `${relativePath} is not a Work record.`);
  }
  return value as WorkRecord;
}

function replaceLoadedWork(
  loaded: LoadedProjectSources,
  relativePath: string,
  candidate: WorkRecord,
): LoadedProjectSources {
  const replace = <T extends { relativePath: string; value: unknown }>(record: T): T =>
    record.relativePath === relativePath ? { ...record, value: candidate } : record;
  return {
    ...loaded,
    records: loaded.records.map(replace),
    work: loaded.work.map((record) =>
      record.relativePath === relativePath ? { ...record, value: candidate } : record),
  };
}

function normalizeRelativePath(value: string): string {
  return value.replaceAll("\\", "/");
}

function comparableFilesystemPath(value: string): string {
  const normalized = value.replaceAll("\\", "/").replace(/\/+$/, "");
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

function sameStringSet(left: readonly string[], right: readonly string[]): boolean {
  const sortedLeft = [...new Set(left)].sort();
  const sortedRight = [...new Set(right)].sort();
  return sortedLeft.length === sortedRight.length && sortedLeft.every((value, index) => value === sortedRight[index]);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function readOption(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
}

function parseCommand(value: unknown, registryVersion: 2 | 3): CoordinationCommandV2 | CoordinationCommandV3 {
  if (typeof value !== "object" || value === null || !("type" in value) || typeof value.type !== "string") {
    throw new CoordinationPersistenceError("MALFORMED_COMMAND", "Command JSON must contain a string type.");
  }
  const requiredKeys: Record<string, string[]> = {
    "activate-room": ["planTaskId", "roundId", "roomRunId", "revisionAttempt"],
    "supersede-attempt": ["planTaskId", "roundId", "roomRunId", "revisionAttempt"],
    "authorize-revision": ["planTaskId", "roundId", "roomRunId", "priorAttempt", "expectedHandoffId", "livenessDeadline"],
    "record-send": ["planTaskId", "roundId", "handoffId", "payload", "outcome", "attemptedAt"],
    "receive-handoff": ["planTaskId", "roundId", "handoffId", "payload", "senderThreadId", "receivedAt"],
    "acknowledge-receipt": ["planTaskId", "roundId", "handoffId", "acknowledgedAt"],
    "accept-handoff": ["planTaskId", "roundId", "handoffId", "reviewer", "reviewedAt", "evidenceIds", "requiredChecks", "remainingScope"],
    "resolve-handoff": ["planTaskId", "roundId", "handoffId", "reviewer", "reviewedAt", "decision", "reviewNote", "remainingScope"],
    "release-round": ["planTaskId", "roundId"],
  };
  if (value.type === "transfer-ownership") {
    throw new CoordinationTransitionError(
      "OWNERSHIP_TRANSFER_REMOVED",
      "A PLAN round cannot transfer execution authority to another PLAN.",
    );
  }
  const keys = requiredKeys[value.type];
  if (keys === undefined) {
    throw new CoordinationTransitionError("UNKNOWN_COMMAND", `Unknown coordination command: ${value.type}.`);
  }
  if (keys.some((key) => !(key in value))) {
    throw new CoordinationPersistenceError("MALFORMED_COMMAND", `Command ${value.type} is missing required fields.`);
  }
  if (registryVersion === 3) return value as CoordinationCommandV3;
  return value as CoordinationCommandV2;
}

export async function readConfinedCommandJson(rootDir: string, path: string): Promise<unknown> {
  const canonicalRoot = await realpath(resolve(rootDir));
  if (isAbsolute(path)) {
    throw new CoordinationPersistenceError("COMMAND_PATH_OUTSIDE_ROOT", "Command path must be relative to root.");
  }
  const requested = resolve(canonicalRoot, path);
  const fromRoot = relative(canonicalRoot, requested);
  if (fromRoot === ".." || fromRoot.startsWith("../") || fromRoot.startsWith("..\\") || isAbsolute(fromRoot)) {
    throw new CoordinationPersistenceError("COMMAND_PATH_OUTSIDE_ROOT", "Command path must resolve inside root.");
  }
  const target = await realpath(requested);
  const resolvedFromRoot = relative(canonicalRoot, target);
  if (
    resolvedFromRoot === ".." ||
    resolvedFromRoot.startsWith("../") ||
    resolvedFromRoot.startsWith("..\\") ||
    isAbsolute(resolvedFromRoot)
  ) {
    throw new CoordinationPersistenceError("COMMAND_PATH_OUTSIDE_ROOT", "Command path must resolve inside root.");
  }
  return JSON.parse(await readFile(target, "utf8"));
}

async function runCli(): Promise<void> {
  const args = process.argv.slice(2);
  const action = args[0];
  const rootDir = resolve(readOption(args, "--root") ?? process.cwd());
  try {
    if (action === "validate") {
      await validateCoordinationRoot(rootDir);
      process.stdout.write("Coordination registry valid.\n");
      return;
    }
    if (action === "apply") {
      const workFile = readOption(args, "--work");
      const revisionText = readOption(args, "--expected-revision");
      const commandFile = readOption(args, "--command");
      if (workFile === undefined || revisionText === undefined || commandFile === undefined) {
        throw new CoordinationPersistenceError(
          "CLI_ARGUMENTS_INVALID",
          "Usage: coordination apply --work <data/work/file.json> --expected-revision <n> --command <command.json> [--root <dir>]",
        );
      }
      const expectedRevision = Number(revisionText);
      if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0) {
        throw new CoordinationPersistenceError("CLI_ARGUMENTS_INVALID", "Expected revision must be a non-negative integer.");
      }
      const command = await readConfinedCommandJson(rootDir, commandFile);
      const next = await applyCoordinationCommandToWorkFile({ rootDir, workFile, expectedRevision, command });
      process.stdout.write(`Coordination revision ${next.revision} persisted.\n`);
      return;
    }
    if (action === "preflight-integration") {
      const workFile = readOption(args, "--work");
      const handoffId = readOption(args, "--handoff");
      const repository = readOption(args, "--repository");
      const baseRef = readOption(args, "--base-ref");
      if (workFile === undefined || handoffId === undefined || repository === undefined || baseRef === undefined) {
        throw new CoordinationPersistenceError(
          "CLI_ARGUMENTS_INVALID",
          "Usage: coordination preflight-integration --work <data/work/file.json> --handoff <id> --repository <path> --base-ref <ref> [--root <dir>]",
        );
      }
      await verifyAcceptedIntegrationCandidate({ rootDir, workFile, handoffId, repository, baseRef });
      process.stdout.write("Accepted integration candidate verified.\n");
      return;
    }
    throw new CoordinationPersistenceError("CLI_ARGUMENTS_INVALID", "Use coordination validate, coordination apply, or coordination preflight-integration.");
  } catch (error: unknown) {
    const message = error instanceof Error ? `${"code" in error ? `${String(error.code)}: ` : ""}${error.message}` : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void runCli();
}
