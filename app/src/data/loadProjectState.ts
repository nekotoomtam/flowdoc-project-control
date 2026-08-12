import type { ProjectDiagnostic } from "../../../src/model/diagnostics.js";
import type { ProjectReadModel } from "../../../src/model/types.js";

export type ProjectState =
  | { kind: "ready"; model: ProjectReadModel }
  | { kind: "diagnostic"; diagnostics: ProjectDiagnostic[] };

const GENERATE_AND_CHECK_HINT = "Run npm run generate, then npm run check:data.";

export async function loadProjectState(
  fetcher: typeof fetch = fetch,
): Promise<ProjectState> {
  let diagnosticsResponse: Response;

  try {
    diagnosticsResponse = await fetcher("/project-diagnostics.json");
  } catch {
    return unavailableDiagnostics("generated/project-diagnostics.json");
  }

  if (diagnosticsResponse.status !== 404) {
    if (!diagnosticsResponse.ok) {
      return unavailableDiagnostics("generated/project-diagnostics.json");
    }

    let diagnosticsPayload: unknown;
    try {
      diagnosticsPayload = await diagnosticsResponse.json();
    } catch {
      return invalidDiagnosticsFile();
    }

    if (!isDiagnosticsFile(diagnosticsPayload)) {
      return invalidDiagnosticsFile();
    }

    if (diagnosticsPayload.diagnostics.length > 0) {
      return { kind: "diagnostic", diagnostics: diagnosticsPayload.diagnostics };
    }
  }

  let indexResponse: Response;
  try {
    indexResponse = await fetcher("/project-index.json");
  } catch {
    return unavailableDiagnostics("generated/project-index.json");
  }

  if (!indexResponse.ok) {
    return unavailableDiagnostics("generated/project-index.json");
  }

  let indexPayload: unknown;
  try {
    indexPayload = await indexResponse.json();
  } catch {
    return invalidIndexDiagnostics();
  }

  if (!isProjectReadModel(indexPayload)) {
    return invalidIndexDiagnostics();
  }

  return { kind: "ready", model: indexPayload };
}

function isDiagnosticsFile(value: unknown): value is { diagnostics: ProjectDiagnostic[] } {
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.diagnostics)) {
    return false;
  }

  return value.diagnostics.every(isProjectDiagnostic);
}

function isProjectDiagnostic(value: unknown): value is ProjectDiagnostic {
  return isRecord(value)
    && typeof value.code === "string"
    && typeof value.message === "string"
    && typeof value.file === "string"
    && (value.recordId === undefined || typeof value.recordId === "string")
    && typeof value.hint === "string";
}

function isProjectReadModel(value: unknown): value is ProjectReadModel {
  if (!isRecord(value)
    || value.schemaVersion !== 1
    || !Array.isArray(value.rootNodeIds)
    || !Array.isArray(value.nodes)
    || !Array.isArray(value.work)
    || !Array.isArray(value.documents)
    || !Array.isArray(value.repositories)
    || !Array.isArray(value.evidence)) {
    return false;
  }

  const nodeIds = new Set<string>();
  for (const node of value.nodes) {
    if (!isRecord(node) || typeof node.id !== "string" || nodeIds.has(node.id)) {
      return false;
    }
    nodeIds.add(node.id);
  }

  return value.rootNodeIds.every((rootNodeId) => (
    typeof rootNodeId === "string" && nodeIds.has(rootNodeId)
  ));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unavailableDiagnostics(file: string): ProjectState {
  return {
    kind: "diagnostic",
    diagnostics: [{
      code: "PROJECT_DATA_UNAVAILABLE",
      message: "Could not load project data from the local server.",
      file,
      hint: GENERATE_AND_CHECK_HINT,
    }],
  };
}

function invalidDiagnosticsFile(): ProjectState {
  return {
    kind: "diagnostic",
    diagnostics: [{
      code: "PROJECT_DIAGNOSTICS_INVALID",
      message: "Generated project diagnostics are invalid or incomplete.",
      file: "generated/project-diagnostics.json",
      hint: GENERATE_AND_CHECK_HINT,
    }],
  };
}

function invalidIndexDiagnostics(): ProjectState {
  return {
    kind: "diagnostic",
    diagnostics: [{
      code: "PROJECT_INDEX_INVALID",
      message: "Generated project index is invalid or incomplete.",
      file: "generated/project-index.json",
      hint: GENERATE_AND_CHECK_HINT,
    }],
  };
}
