export interface ProjectDiagnostic {
  code: string;
  message: string;
  file: string;
  recordId?: string;
  hint: string;
}

export interface ProjectDiagnosticsFile {
  schemaVersion: 1;
  diagnostics: ProjectDiagnostic[];
}
