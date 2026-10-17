import type {
  DocumentRecord,
  EvidenceValidity,
  IndexDocument,
  WorkRecord,
} from "./types.js";

export type ContextLoadMode = "default" | "audit" | "conflict" | "evidence-recovery" | "reconciliation";

export class ContextRoutingError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = "ContextRoutingError";
  }
}

export function resolveCurrentDocument(
  documentId: string,
  documentsById: ReadonlyMap<string, DocumentRecord>,
): DocumentRecord {
  const visited = new Set<string>();
  let current = requireDocument(documentId, documentsById);

  while (current.supersededBy !== undefined) {
    if (visited.has(current.id)) {
      throw new ContextRoutingError(
        "DOCUMENT_SUPERSESSION_CYCLE",
        `Document supersession contains a cycle at ${current.id}.`,
      );
    }
    visited.add(current.id);
    const successor = documentsById.get(current.supersededBy);
    if (successor === undefined) {
      throw new ContextRoutingError(
        "DOCUMENT_SUCCESSOR_MISSING",
        `Document ${current.id} names missing successor ${current.supersededBy}.`,
      );
    }
    if (!(successor.supersedes ?? []).includes(current.id)) {
      throw new ContextRoutingError(
        "DOCUMENT_SUPERSESSION_ASYMMETRIC",
        `Document ${successor.id} does not reciprocally supersede ${current.id}.`,
      );
    }
    current = successor;
  }

  if (visited.has(current.id)) {
    throw new ContextRoutingError(
      "DOCUMENT_SUPERSESSION_CYCLE",
      `Document supersession contains a cycle at ${current.id}.`,
    );
  }
  if (current.contextClass === "historical" || current.lifecycle === "superseded") {
    throw new ContextRoutingError(
      "DOCUMENT_SUCCESSOR_MISSING",
      `Historical or superseded document ${current.id} has no current successor.`,
    );
  }
  if (current.contextClass !== undefined && (current.contextClass !== "current" || current.lifecycle !== "active")) {
    throw new ContextRoutingError(
      "SUPERSESSION_SUCCESSOR_NOT_ACTIVE",
      `Document ${current.id} is not an active current successor.`,
    );
  }
  return current;
}

export function selectDefaultContext(
  work: Pick<WorkRecord, "contextDocumentIds">,
  documentsById: ReadonlyMap<string, IndexDocument>,
  mode: ContextLoadMode = "default",
): IndexDocument[] {
  const includeHistorical = mode !== "default";
  const selected: IndexDocument[] = [];
  const seen = new Set<string>();
  for (const id of work.contextDocumentIds ?? []) {
    const document = documentsById.get(id);
    if (document === undefined) continue;
    if (!includeHistorical && document.contextClass === "historical") continue;
    if (!seen.has(document.id)) {
      selected.push(document);
      seen.add(document.id);
    }
  }
  return selected;
}

export function isEvidenceReusable(
  expected: EvidenceValidity,
  actual: EvidenceValidity,
  firedFreshnessTriggers: ReadonlySet<string>,
): boolean {
  return expected.claim === actual.claim
    && expected.repositoryId === actual.repositoryId
    && equalStringSets(expected.pathScope, actual.pathScope)
    && expected.sourceRevision === actual.sourceRevision
    && expected.verificationMethod === actual.verificationMethod
    && equalStringSets(expected.freshnessTriggers, actual.freshnessTriggers)
    && expected.supersedesEvidenceId === actual.supersedesEvidenceId
    && !actual.freshnessTriggers.some((trigger) => firedFreshnessTriggers.has(trigger));
}

function requireDocument(
  documentId: string,
  documentsById: ReadonlyMap<string, DocumentRecord>,
): DocumentRecord {
  const document = documentsById.get(documentId);
  if (document === undefined) {
    throw new ContextRoutingError("DOCUMENT_NOT_FOUND", `Document ${documentId} does not exist.`);
  }
  return document;
}

function equalStringSets(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const rightSet = new Set(right);
  return left.every((item) => rightSet.has(item));
}
