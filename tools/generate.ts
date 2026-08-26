import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import type { ProjectDiagnosticsFile } from "../src/model/diagnostics.js";
import { formatProjectDiagnostics, ProjectValidationError } from "./lib/errors.js";
import { buildProjectReadModel, serializeProjectReadModel } from "./lib/build-read-model.js";
import { generateProjectSqlite } from "./lib/build-sqlite-projection.js";
import { loadAndValidateProject } from "./lib/validate-semantics.js";
import { writeFileAtomically } from "./lib/write-atomic.js";

export async function generateToString(rootDir: string): Promise<string> {
  const model = await buildProjectReadModel(await loadAndValidateProject(rootDir));
  return serializeProjectReadModel(model);
}

export async function generateProjectIndex(rootDir: string, outputPath?: string): Promise<void> {
  const indexPath = outputPath ?? join(rootDir, "generated", "project-index.json");
  const diagnosticsPath = join(dirname(indexPath), "project-diagnostics.json");

  try {
    const contents = await generateToString(rootDir);
    await writeFileAtomically(indexPath, contents);
    await rm(diagnosticsPath, { force: true });
    await generateProjectSqlite(rootDir, join(dirname(indexPath), "project-control.sqlite"));
  } catch (error: unknown) {
    if (error instanceof ProjectValidationError) {
      await writeFileAtomically(diagnosticsPath, serializeDiagnostics(error));
    } else {
      await writeFileAtomically(diagnosticsPath, serializeUnexpectedFailureDiagnostics());
    }
    throw error;
  }
}

function serializeDiagnostics(error: ProjectValidationError): string {
  const diagnostics: ProjectDiagnosticsFile = {
    schemaVersion: 1,
    diagnostics: error.diagnostics,
  };
  return `${JSON.stringify(diagnostics, null, 2)}\n`;
}

function serializeUnexpectedFailureDiagnostics(): string {
  const diagnostics: ProjectDiagnosticsFile = {
    schemaVersion: 1,
    diagnostics: [{
      code: "PROJECT_GENERATION_FAILED",
      message: "Project data could not be published safely.",
      file: "generated/project-index.json",
      hint: "Check the local filesystem, then run npm run generate again.",
    }],
  };
  return `${JSON.stringify(diagnostics, null, 2)}\n`;
}

async function runCli(): Promise<void> {
  try {
    await generateProjectIndex(resolve(process.cwd()));
  } catch (error: unknown) {
    if (error instanceof ProjectValidationError) {
      process.stderr.write(`${formatProjectDiagnostics(error.diagnostics)}\n`);
    } else {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    }
    process.exitCode = 1;
  }
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void runCli();
}
