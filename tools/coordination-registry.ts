import { open, readFile, realpath, rm, type FileHandle } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { isAbsolute, join, relative, resolve } from "node:path";
import {
  CoordinationTransitionError,
  applyLegacyCoordinationCommand,
  type CoordinationCommand,
} from "../src/model/coordination.js";
import type { CoordinationRegistry, CoordinationRegistryV1, WorkRecord } from "../src/model/types.js";
import { ProjectValidationError } from "./lib/errors.js";
import {
  loadProjectSources,
  validateCanonicalRecordValue,
  type LoadedProjectSources,
} from "./lib/load-sources.js";
import { validateProjectSemantics } from "./lib/validate-semantics.js";
import { writeFileAtomically } from "./lib/write-atomic.js";

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
  command: CoordinationCommand;
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
    if (work.coordination.revision !== options.expectedRevision) {
      throw new CoordinationPersistenceError(
        "REVISION_CONFLICT",
        `Expected coordination revision ${options.expectedRevision}, found ${work.coordination.revision}. Reload before retrying.`,
      );
    }

    const loaded = await loadProjectSources(rootDir);
    const evidenceById = new Map(loaded.evidence.map(({ value }) => [
      value.id,
      { repositoryId: value.repositoryId, commit: value.commit },
    ]));
    const coordination = applyLegacyCoordinationCommand(
      work.coordination as CoordinationRegistryV1,
      options.command,
      { evidenceById },
    );
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

export async function validateCoordinationRoot(rootDir: string): Promise<void> {
  await validateProjectSemantics(await loadProjectSources(await realpath(resolve(rootDir))));
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

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function readOption(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
}

function parseCommand(value: unknown): CoordinationCommand {
  if (typeof value !== "object" || value === null || !("type" in value) || typeof value.type !== "string") {
    throw new CoordinationPersistenceError("MALFORMED_COMMAND", "Command JSON must contain a string type.");
  }
  const requiredKeys: Record<string, string[]> = {
    "activate-room": ["roomRunId", "ownershipGeneration", "revisionAttempt"],
    "supersede-attempt": ["roomRunId", "ownershipGeneration", "revisionAttempt"],
    "authorize-revision": ["roomRunId", "priorAttempt", "expectedHandoffId", "livenessDeadline"],
    "transfer-ownership": ["fromPlanTaskId", "toPlanTaskId", "fromGeneration", "newGeneration", "reason", "affectedRoomRunIds", "transferredAt"],
    "record-send": ["handoffId", "payload", "outcome", "attemptedAt"],
    "receive-handoff": ["handoffId", "payload", "senderThreadId", "receivedAt"],
    "acknowledge-receipt": ["handoffId", "planTaskId", "acknowledgedAt"],
    "accept-handoff": ["handoffId", "reviewer", "reviewedAt", "evidenceIds", "requiredChecks", "remainingScope"],
    "resolve-handoff": ["handoffId", "reviewer", "reviewedAt", "decision", "reviewNote", "remainingScope"],
    "release-round": ["planTaskId"],
  };
  const keys = requiredKeys[value.type];
  if (keys === undefined) {
    throw new CoordinationTransitionError("UNKNOWN_COMMAND", `Unknown coordination command: ${value.type}.`);
  }
  if (keys.some((key) => !(key in value))) {
    throw new CoordinationPersistenceError("MALFORMED_COMMAND", `Command ${value.type} is missing required fields.`);
  }
  return value as CoordinationCommand;
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
      const command = parseCommand(await readConfinedCommandJson(rootDir, commandFile));
      const next = await applyCoordinationCommandToWorkFile({ rootDir, workFile, expectedRevision, command });
      process.stdout.write(`Coordination revision ${next.revision} persisted.\n`);
      return;
    }
    throw new CoordinationPersistenceError("CLI_ARGUMENTS_INVALID", "Use coordination validate or coordination apply.");
  } catch (error: unknown) {
    const message = error instanceof Error ? `${"code" in error ? `${String(error.code)}: ` : ""}${error.message}` : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void runCli();
}
