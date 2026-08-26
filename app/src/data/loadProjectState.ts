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
    || !Array.isArray(value.phases)
    || !Array.isArray(value.checklists)
    || !Array.isArray(value.documents)
    || !Array.isArray(value.repositories)
    || !Array.isArray(value.evidence)) {
    return false;
  }

  return isUniqueStringArray(value.rootNodeIds)
    && isProjectRecords(value.nodes, isIndexNode)
    && isProjectRecords(value.work, isIndexWork)
    && isProjectRecords(value.phases, isPhaseRecord)
    && isProjectRecords(value.checklists, isChecklistRecord)
    && isProjectRecords(value.documents, isIndexDocument)
    && isProjectRecords(value.repositories, isRepositoryRecord)
    && isProjectRecords(value.evidence, isEvidenceRecord)
    && hasValidReadModelReferences(value as unknown as ProjectReadModel);
}

function isProjectRecords<T extends { id: string }>(values: unknown[], predicate: (value: unknown) => value is T): values is T[] {
  return values.every(predicate) && new Set(values.map((value) => value.id)).size === values.length;
}

function hasValidWorkPath(
  work: ProjectReadModel["work"][number],
  workById: Map<string, ProjectReadModel["work"][number]>,
): boolean {
  if (work.workKind === undefined) {
    return work.workPathIds.length === 1 && work.workPathIds[0] === work.id;
  }

  const path: string[] = [];
  let current: ProjectReadModel["work"][number] | undefined = work;
  while (current !== undefined) {
    path.unshift(current.id);
    current = current.parentWorkId === undefined ? undefined : workById.get(current.parentWorkId);
  }
  return path.length === work.workPathIds.length
    && path.every((id, index) => work.workPathIds[index] === id);
}

function hasValidReadModelReferences(model: ProjectReadModel): boolean {
  const nodeIds = new Set(model.nodes.map((node) => node.id));
  const workIds = new Set(model.work.map((work) => work.id));
  const workById = new Map(model.work.map((work) => [work.id, work]));
  const phaseIds = new Set(model.phases.map((phase) => phase.id));
  const phaseById = new Map(model.phases.map((phase) => [phase.id, phase]));
  const documentIds = new Set(model.documents.map((document) => document.id));
  const repositoryIds = new Set(model.repositories.map((repository) => repository.id));
  const evidenceIds = new Set(model.evidence.map((evidence) => evidence.id));
  return model.rootNodeIds.every((id) => nodeIds.has(id))
    && model.nodes.every((node) => (node.parentId === null || nodeIds.has(node.parentId))
      && node.childIds.every((id) => nodeIds.has(id))
      && node.workIds.every((id) => workIds.has(id))
      && node.documentIds.every((id) => documentIds.has(id))
      && node.repositoryIds.every((id) => repositoryIds.has(id))
      && node.evidenceIds.every((id) => evidenceIds.has(id)))
    && model.work.every((work) => nodeIds.has(work.nodeId)
      && (work.parentWorkId === undefined || workIds.has(work.parentWorkId))
      && work.repositoryIds.every((id) => repositoryIds.has(id))
      && work.requiredEvidence.every((id) => evidenceIds.has(id))
      && (work.contextDocumentIds ?? []).every((id) => documentIds.has(id))
      && work.childWorkIds.every((id) => workById.get(id)?.parentWorkId === work.id)
      && work.phaseIds.every((id) => phaseById.get(id)?.workId === work.id)
      && (work.workKind !== undefined || work.phaseIds.length === 0)
      && (work.parentWorkId === undefined || workById.get(work.parentWorkId)?.childWorkIds.includes(work.id) === true)
      && hasValidWorkPath(work, workById))
    && model.phases.every((phase) => workIds.has(phase.workId)
      && phase.repositoryIds.every((id) => repositoryIds.has(id)))
    && model.checklists.every((checklist) => phaseIds.has(checklist.phaseId)
      && checklist.items.every((item) => (item.evidenceIds ?? []).every((id) => evidenceIds.has(id))))
    && model.documents.every((document) => document.nodeIds.every((id) => nodeIds.has(id))
      && document.repositoryRefs.every((reference) => repositoryIds.has(reference.repositoryId)))
    && model.evidence.every((evidence) => nodeIds.has(evidence.nodeIds[0] ?? "")
      && evidence.nodeIds.every((id) => nodeIds.has(id))
      && repositoryIds.has(evidence.repositoryId));
}

function isIndexNode(value: unknown): value is ProjectReadModel["nodes"][number] {
  return isRecord(value) && value.kind === "node" && isNonEmptyString(value.id)
    && isNonEmptyString(value.title) && (value.parentId === null || isNonEmptyString(value.parentId))
    && typeof value.summary === "string" && isTruthState(value.truthState) && typeof value.order === "number"
    && isUniqueStringArray(value.documentIds) && isUniqueStringArray(value.evidenceIds)
    && isUniqueStringArray(value.repositoryIds) && isUniqueStringArray(value.childIds)
    && isUniqueStringArray(value.workIds);
}

function isIndexWork(value: unknown): value is ProjectReadModel["work"][number] {
  return isRecord(value) && value.kind === "work" && isNonEmptyString(value.id) && isNonEmptyString(value.title)
    && isNonEmptyString(value.nodeId) && (value.parentWorkId === undefined || isNonEmptyString(value.parentWorkId))
    && (value.workKind === undefined || isWorkKind(value.workKind))
    && isUniqueStringArray(value.repositoryIds) && isWorkState(value.workState)
    && typeof value.summary === "string" && isUniqueStringArray(value.requiredEvidence)
    && isNonEmptyString(value.createdAt) && isNonEmptyString(value.updatedAt)
    && (value.contextDocumentIds === undefined || isUniqueStringArray(value.contextDocumentIds))
    && (value.activeRole === undefined || isNonEmptyString(value.activeRole))
    && (value.expectedOutput === undefined || isNonEmptyString(value.expectedOutput))
    && (value.riskSummary === undefined || isNonEmptyString(value.riskSummary))
    && (value.blockedBy === undefined || isNonEmptyString(value.blockedBy))
    && (value.unblockOwner === undefined || isNonEmptyString(value.unblockOwner))
    && isUniqueStringArray(value.childWorkIds)
    && isUniqueStringArray(value.phaseIds)
    && isUniqueStringArray(value.workPathIds);
}

function isPhaseRecord(value: unknown): value is ProjectReadModel["phases"][number] {
  return isRecord(value) && value.kind === "phase" && isNonEmptyString(value.id) && isNonEmptyString(value.workId)
    && isNonEmptyString(value.title) && isPhaseState(value.phaseState) && typeof value.order === "number"
    && isNonEmptyUniqueStringArray(value.repositoryIds) && isNonEmptyString(value.activeRole)
    && isNonEmptyStringArray(value.stopConditions) && isNonEmptyString(value.verificationTarget)
    && typeof value.summary === "string" && isNonEmptyString(value.createdAt) && isNonEmptyString(value.updatedAt);
}

function isChecklistRecord(value: unknown): value is ProjectReadModel["checklists"][number] {
  return isRecord(value) && value.kind === "checklist" && isNonEmptyString(value.id)
    && isNonEmptyString(value.phaseId) && isNonEmptyString(value.title) && Array.isArray(value.items) && value.items.length > 0
    && value.items.every(isChecklistItem)
    && new Set(value.items.map((item) => item.id)).size === value.items.length
    && isNonEmptyString(value.createdAt) && isNonEmptyString(value.updatedAt);
}

function isChecklistItem(value: unknown): value is ProjectReadModel["checklists"][number]["items"][number] {
  return isRecord(value) && isNonEmptyString(value.id) && isNonEmptyString(value.label)
    && isChecklistItemState(value.state) && typeof value.evidenceTarget === "string"
    && value.evidenceTarget.trim().length > 0
    && (value.evidenceIds === undefined || isUniqueStringArray(value.evidenceIds))
    && (value.verificationNote === undefined || isNonEmptyString(value.verificationNote));
}

function isIndexDocument(value: unknown): value is ProjectReadModel["documents"][number] {
  return isRecord(value) && value.kind === "document" && isNonEmptyString(value.id) && isNonEmptyString(value.title)
    && isNonEmptyString(value.path) && isUniqueStringArray(value.nodeIds) && isDocumentRole(value.role)
    && isNonEmptyString(value.authority) && isDocumentLifecycle(value.lifecycle) && typeof value.content === "string"
    && Array.isArray(value.repositoryRefs) && value.repositoryRefs.every(isRepositoryReference);
}

function isRepositoryRecord(value: unknown): value is ProjectReadModel["repositories"][number] {
  return isRecord(value) && value.kind === "repository" && isNonEmptyString(value.id) && isNonEmptyString(value.name)
    && isNonEmptyString(value.remote) && isNonEmptyString(value.checkoutAlias) && isNonEmptyString(value.defaultBranch)
    && isNonEmptyString(value.ownershipSummary);
}

function isEvidenceRecord(value: unknown): value is ProjectReadModel["evidence"][number] {
  return isRecord(value) && value.kind === "evidence" && isNonEmptyString(value.id) && isUniqueStringArray(value.nodeIds)
    && isNonEmptyString(value.repositoryId) && isNonEmptyString(value.commit) && isNonEmptyString(value.pathOrContractId)
    && isNonEmptyString(value.verificationSummary) && isNonEmptyString(value.verifiedAt);
}

function isRepositoryReference(value: unknown): boolean {
  return isRecord(value) && isNonEmptyString(value.repositoryId) && isNonEmptyString(value.commit)
    && isNonEmptyString(value.pathOrContractId);
}

function isUniqueStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString) && new Set(value).size === value.length;
}

function isNonEmptyUniqueStringArray(value: unknown): value is string[] {
  return isUniqueStringArray(value) && value.length > 0;
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isTruthState(value: unknown): boolean {
  return value === "current" || value === "planned" || value === "risk" || value === "unknown";
}

function isWorkKind(value: unknown): boolean {
  return value === "topic" || value === "task";
}

function isWorkState(value: unknown): boolean {
  return value === "queued" || value === "in-progress" || value === "blocked" || value === "in-review";
}

function isPhaseState(value: unknown): boolean {
  return value === "queued" || value === "in-progress" || value === "blocked" || value === "in-review" || value === "done";
}

function isChecklistItemState(value: unknown): boolean {
  return value === "pending" || value === "in-progress" || value === "passed" || value === "failed"
    || value === "blocked" || value === "risk" || value === "unknown";
}

function isDocumentRole(value: unknown): boolean {
  return value === "current-state" || value === "contract" || value === "verification" || value === "risk"
    || value === "unknown" || value === "decision" || value === "historical-note" || value === "glossary" || value === "version";
}

function isDocumentLifecycle(value: unknown): boolean {
  return value === "active" || value === "superseded" || value === "retired";
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
