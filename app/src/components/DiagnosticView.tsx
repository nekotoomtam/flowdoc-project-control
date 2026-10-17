import type { ProjectDiagnostic } from "../../../src/model/diagnostics.js";

interface DiagnosticViewProps {
  diagnostics: ProjectDiagnostic[];
}

export function DiagnosticView({ diagnostics }: DiagnosticViewProps) {
  return (
    <main>
      <h1>Project data needs attention</h1>
      <p>The project map cannot be shown safely. Resolve the diagnostics below before using it.</p>
      <p>Run npm run generate, then npm run check:data.</p>
      <ul>
        {diagnostics.map((diagnostic, index) => (
          <li key={`${diagnostic.file}:${diagnostic.recordId ?? ""}:${diagnostic.code}:${index}`}>
            <p><strong>{diagnostic.code}</strong>: {diagnostic.message}</p>
            <dl>
              <dt>File</dt>
              <dd>{diagnostic.file}</dd>
              {diagnostic.recordId !== undefined ? <><dt>Record ID</dt><dd>{diagnostic.recordId}</dd></> : null}
              <dt>How to fix</dt>
              <dd>{diagnostic.hint}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </main>
  );
}
