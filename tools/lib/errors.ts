import type { ProjectDiagnostic } from "../../src/model/diagnostics.js";

export class ProjectValidationError extends Error {
  readonly diagnostics: ProjectDiagnostic[];

  constructor(diagnostics: ProjectDiagnostic[]) {
    super("Project source validation failed.");
    this.name = "ProjectValidationError";
    this.diagnostics = sortProjectDiagnostics(diagnostics);
  }
}

export function sortProjectDiagnostics(
  diagnostics: ProjectDiagnostic[],
): ProjectDiagnostic[] {
  return [...diagnostics].sort((left, right) => compareCodeUnits(left.file, right.file));
}

export function compareCodeUnits(left: string, right: string): number {
  if (left === right) {
    return 0;
  }
  return left < right ? -1 : 1;
}

export function formatProjectDiagnostics(
  diagnostics: ProjectDiagnostic[],
): string {
  return sortProjectDiagnostics(diagnostics)
    .map((diagnostic) => {
      const record = diagnostic.recordId === undefined ? "" : ` (${diagnostic.recordId})`;
      return `${diagnostic.file}${record}: ${diagnostic.code} — ${diagnostic.message} ${diagnostic.hint}`;
    })
    .join("\n");
}
