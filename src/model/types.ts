export type TruthState = "current" | "planned" | "risk" | "unknown";
export type WorkState = "queued" | "in-progress" | "blocked" | "in-review";
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
  repositoryIds: string[];
  workState: WorkState;
  summary: string;
  blockedBy?: string;
  unblockOwner?: string;
  requiredEvidence: string[];
  createdAt: string;
  updatedAt: string;
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
