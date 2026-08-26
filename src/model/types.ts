export type TruthState = "current" | "planned" | "risk" | "unknown";
export type WorkState = "queued" | "in-progress" | "blocked" | "in-review";
export type WorkKind = "topic" | "task";
export type PhaseState = "queued" | "in-progress" | "blocked" | "in-review" | "done";
export type ChecklistItemState =
  | "pending"
  | "in-progress"
  | "passed"
  | "failed"
  | "blocked"
  | "risk"
  | "unknown";
export type DocumentRole =
  | "current-state"
  | "contract"
  | "verification"
  | "risk"
  | "unknown"
  | "decision"
  | "historical-note"
  | "glossary"
  | "version";
export type DocumentLifecycle = "active" | "superseded" | "retired";

export interface NodeRecord {
  kind: "node";
  id: string;
  title: string;
  parentId: string | null;
  summary: string;
  truthState: TruthState;
  order: number;
  documentIds: string[];
  evidenceIds: string[];
  repositoryIds: string[];
}

export interface WorkRecord {
  kind: "work";
  id: string;
  title: string;
  nodeId: string;
  parentWorkId?: string;
  workKind?: WorkKind;
  repositoryIds: string[];
  workState: WorkState;
  summary: string;
  contextDocumentIds?: string[];
  activeRole?: string;
  expectedOutput?: string;
  riskSummary?: string;
  blockedBy?: string;
  unblockOwner?: string;
  requiredEvidence: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PhaseRecord {
  kind: "phase";
  id: string;
  workId: string;
  title: string;
  phaseState: PhaseState;
  order: number;
  repositoryIds: string[];
  activeRole: string;
  stopConditions: string[];
  verificationTarget: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistRecord {
  kind: "checklist";
  id: string;
  phaseId: string;
  title: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  state: ChecklistItemState;
  evidenceTarget: string;
  evidenceIds?: string[];
  verificationNote?: string;
}

export interface DocumentRecord {
  kind: "document";
  id: string;
  title: string;
  path: string;
  nodeIds: string[];
  role: DocumentRole;
  authority: string;
  lifecycle: DocumentLifecycle;
  repositoryRefs: Array<{
    repositoryId: string;
    commit: string;
    pathOrContractId: string;
  }>;
}

export interface RepositoryRecord {
  kind: "repository";
  id: string;
  name: string;
  remote: string;
  checkoutAlias: string;
  defaultBranch: string;
  ownershipSummary: string;
}

export interface EvidenceRecord {
  kind: "evidence";
  id: string;
  nodeIds: string[];
  repositoryId: string;
  commit: string;
  pathOrContractId: string;
  verificationSummary: string;
  verifiedAt: string;
}

export type ProjectRecord =
  | NodeRecord
  | WorkRecord
  | PhaseRecord
  | ChecklistRecord
  | DocumentRecord
  | RepositoryRecord
  | EvidenceRecord;

export interface IndexNode extends NodeRecord {
  childIds: string[];
  workIds: string[];
}

export interface IndexDocument extends DocumentRecord {
  content: string;
}

export interface IndexWork extends WorkRecord {
  childWorkIds: string[];
  phaseIds: string[];
  workPathIds: string[];
}

export interface ProjectReadModel {
  schemaVersion: 1;
  sourceDigest: string;
  rootNodeIds: string[];
  nodes: IndexNode[];
  work: WorkRecord[];
  documents: IndexDocument[];
  repositories: RepositoryRecord[];
  evidence: EvidenceRecord[];
}
