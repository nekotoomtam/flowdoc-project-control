import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { formatProjectDiagnostics, ProjectValidationError } from "./lib/errors.js";
import { generateToString } from "./generate.js";
import { validateStoredCoreMigration } from "./migration/lib/validate-migration.js";

export class ProjectIndexCheckError extends Error {
  readonly code: "PROJECT_INDEX_STALE" | "PROJECT_DIAGNOSTICS_PRESENT";

  constructor(code: "PROJECT_INDEX_STALE" | "PROJECT_DIAGNOSTICS_PRESENT") {
    super(code);
    this.name = "ProjectIndexCheckError";
    this.code = code;
  }
}

export async function checkProjectIndex(rootDir: string, indexPath?: string): Promise<void> {
  const targetPath = indexPath ?? join(rootDir, "generated", "project-index.json");
  const diagnosticsPath = join(dirname(targetPath), "project-diagnostics.json");

  if (await pathExists(diagnosticsPath)) {
    throw new ProjectIndexCheckError("PROJECT_DIAGNOSTICS_PRESENT");
  }

  const expected = await generateToString(rootDir);
  let current: string;
  try {
    current = await readFile(targetPath, "utf8");
  } catch {
    throw new ProjectIndexCheckError("PROJECT_INDEX_STALE");
  }
  if (current !== expected) {
    throw new ProjectIndexCheckError("PROJECT_INDEX_STALE");
  }

  const migrationDiagnostics = await validateStoredCoreMigration(rootDir);
  if (migrationDiagnostics.length > 0) {
    throw new ProjectValidationError(migrationDiagnostics);
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function runCli(): Promise<void> {
  try {
    await checkProjectIndex(resolve(process.cwd()));
  } catch (error: unknown) {
    if (error instanceof ProjectValidationError) {
      process.stderr.write(`${formatProjectDiagnostics(error.diagnostics)}\n`);
    } else if (error instanceof ProjectIndexCheckError) {
      process.stderr.write(`${error.code}\nRun: npm run generate\n`);
    } else {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    }
    process.exitCode = 1;
  }
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void runCli();
}
