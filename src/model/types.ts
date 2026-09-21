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

export type CoordinationTerminalStatus = "PASS" | "FAIL" | "BLOCKER" | "RISK" | "UNKNOWN";
export type CoordinationCheckStatus = "pending" | "passed" | "failed";

export interface LegacyCoordinationScopeOwnership {
  scopeId: string;
  scopeKeys: string[];
  allowedFiles: string[];
  planTaskId: string;
  generation: number;
  state: "active" | "released" | "cancelled";
  transfers: CoordinationOwnershipTransfer[];
}

export interface CoordinationRegistryV1 {
  version: 1;
  revision: number;
  scopeOwnership: LegacyCoordinationScopeOwnership;
  integrationClaims: CoordinationIntegrationClaim[];
  returnOrderPolicy: "severity-then-arrival";
  roomRuns: CoordinationRoomRun[];
  handoffs: CoordinationHandoff[];
  completionQueue: CoordinationQueueItem[];
  cleanup: CoordinationCleanupState[];
}

export interface CoordinationRegistryV2 {
  version: 2;
  revision: number;
  round: {
    planTaskId: string;
    roundId: string;
    workId: string;
    scopeId: string;
    scopeKeys: string[];
    allowedFiles: string[];
    state: "active" | "released" | "cancelled";
  };
  integrationClaims: CoordinationIntegrationClaimV2[];
  returnOrderPolicy: "severity-then-arrival";
  roomRuns: CoordinationRoomRunV2[];
  handoffs: CoordinationHandoffV2[];
  completionQueue: CoordinationQueueItem[];
  cleanup: CoordinationCleanupStateV2[];
}

export type CoordinationRegistry = CoordinationRegistryV1 | CoordinationRegistryV2;

export interface CoordinationOwnershipTransfer {
  fromPlanTaskId: string;
  toPlanTaskId: string;
  fromGeneration: number;
  newGeneration: number;
  reason: string;
  affectedRoomRunIds: string[];
  transferredAt: string;
}

export interface CoordinationIntegrationClaim {
  repositoryId: string;
  planTaskId: string;
  generation: number;
  baseCommit: string;
  state: "active" | "released" | "frozen";
}

export interface CoordinationIntegrationClaimV2 {
  repositoryId: string;
  planTaskId: string;
  roundId: string;
  baseCommit: string;
  state: "active" | "released" | "frozen";
}

export interface CoordinationRoomRun {
  roomRunId: string;
  dispatchSetId: string;
  laneId: string;
  workType: string;
  ownerRepositoryId: string;
  activeRole: string;
  phaseId: string;
  checklistId: string;
  evidenceTarget: string;
  ownershipGeneration: number;
  revisionAttempt: number;
  expectedHandoffId: string;
  status: "prepared" | "active" | "superseded" | "returned" | "accepted" | "closed";
  locator: {
    threadId: string;
    worktree?: string;
    branch?: string;
    handoffPath?: string;
  };
  contextAcknowledgement: {
    status: "pending" | "acknowledged" | "rejected";
    acknowledgedAt?: string;
  };
  returnRoute: {
    planTaskId: string;
    automaticChannel: string;
    activeCommand: string;
    monitorOwner: string;
    livenessDeadline: string;
    maxSendAttempts: 3;
  };
  modelDecision: CoordinationModelDecision;
  ux: CoordinationUxGate;
  requiredEvidence: string[];
}

export interface CoordinationRoomRunV2 {
  roomRunId: string;
  dispatchSetId: string;
  laneId: string;
  workType: string;
  ownerRepositoryId: string;
  activeRole: string;
  phaseId: string;
  checklistId: string;
  evidenceTarget: string;
  roundId: string;
  revisionAttempt: number;
  expectedHandoffId: string;
  status: "prepared" | "active" | "superseded" | "returned" | "accepted" | "closed";
  locator: {
    threadId: string;
    worktree?: string;
    branch?: string;
    handoffPath?: string;
  };
  contextAcknowledgement: {
    status: "pending" | "acknowledged" | "rejected";
    acknowledgedAt?: string;
  };
  returnRoute: {
    planTaskId: string;
    automaticChannel: string;
    activeCommand: string;
    monitorOwner: string;
    livenessDeadline: string;
    maxSendAttempts: 3;
  };
  modelDecision: CoordinationModelDecision;
  ux: CoordinationUxGate;
  requiredEvidence: string[];
}

export interface CoordinationModelDecision {
  modelId: string;
  reasoningEffort: string;
  taskComplexity: string;
  scopeSize: string;
  uncertainty: string;
  missingContext: string;
  failureImpact: string;
  recoverability: string;
  reason: string;
  smallerOptionAssessment: string;
  availabilitySource: string;
  availabilityObservedAt: string;
  availableModelEfforts: Array<{
    modelId: string;
    reasoningEfforts: string[];
  }>;
  escalationTriggers: string[];
}

export type CoordinationUxGate = CoordinationUxNotApplicable | CoordinationUxApplicable;

export interface CoordinationUxNotApplicable {
  visibleChange: false;
  applicability: "not-applicable";
  reason: string;
}

export interface CoordinationUxApplicable {
  visibleChange: boolean;
  applicability: "applicable";
  scenario: {
    userAction: string;
    expectedVisibleBehavior: string;
    fixture: string;
    inputMethod: string;
    browser: string;
    device: string;
    environment: string;
  };
  criteria: CoordinationUxCriterion[];
  mechanismChecks: CoordinationNamedCheck[];
  regressionChecks: CoordinationNamedCheck[];
  userAcceptance: {
    required: boolean;
    status: "not-required" | "pending" | "accepted" | "rejected";
    actor?: {
      kind: "user" | "agent";
      id: string;
    };
    evidenceIds: string[];
  };
}

export interface CoordinationUxCriterion {
  id: string;
  criterion: string;
  measurementMethod: string;
  evidenceTarget: string;
  inspector: string;
  status: CoordinationCheckStatus;
  evidenceIds: string[];
}

export interface CoordinationNamedCheck {
  name: string;
  status: CoordinationCheckStatus;
}

export interface CoordinationTerminalPayload {
  planTaskId: string;
  roomRunId: string;
  laneId: string;
  ownerRepositoryId: string;
  ownershipGeneration: number;
  revisionAttempt: number;
  status: CoordinationTerminalStatus;
  behaviorChanged: boolean;
  behaviorSummary: string;
  exactCommit?: string;
  changedFiles: string[];
  tests: string[];
  evidenceIds: string[];
  risks: string[];
  unknowns: string[];
  contractChangeRequest?: string;
}

export interface CoordinationTerminalPayloadV2 {
  planTaskId: string;
  roundId: string;
  roomRunId: string;
  laneId: string;
  ownerRepositoryId: string;
  revisionAttempt: number;
  status: CoordinationTerminalStatus;
  behaviorChanged: boolean;
  behaviorSummary: string;
  exactCommit?: string;
  changedFiles: string[];
  tests: string[];
  evidenceIds: string[];
  risks: string[];
  unknowns: string[];
  contractChangeRequest?: string;
}

export interface CoordinationHandoff {
  handoffId: string;
  payloadDigest: string;
  payload: CoordinationTerminalPayload;
  transport: {
    status: "pending" | "sent" | "return-channel-failed";
    attempts: number;
    attemptHistory: Array<{
      attemptedAt: string;
      outcome: "sent" | "failed";
    }>;
    lastAttemptAt?: string;
  };
  receipt: {
    status: "pending" | "received";
    receivedAt?: string;
    senderThreadId?: string;
    channel?: string;
    acknowledgedAt?: string;
    arrivalSequence?: number;
  };
  acceptance: {
    status: "pending" | "accepted" | "needs-revision" | "rejected" | "blocked";
    reviewer?: string;
    reviewedAt?: string;
    reviewNote?: string;
    evidenceIds: string[];
    requiredChecks: CoordinationNamedCheck[];
    remainingScope: string[];
  };
}

export interface CoordinationHandoffV2 {
  handoffId: string;
  payloadDigest: string;
  payload: CoordinationTerminalPayloadV2;
  transport: {
    status: "pending" | "sent" | "return-channel-failed";
    attempts: number;
    attemptHistory: Array<{
      attemptedAt: string;
      outcome: "sent" | "failed";
    }>;
    lastAttemptAt?: string;
  };
  receipt: {
    status: "pending" | "received";
    receivedAt?: string;
    senderThreadId?: string;
    channel?: string;
    acknowledgedAt?: string;
    arrivalSequence?: number;
  };
  acceptance: {
    status: "pending" | "accepted" | "needs-revision" | "rejected" | "blocked";
    reviewer?: string;
    reviewedAt?: string;
    reviewNote?: string;
    evidenceIds: string[];
    requiredChecks: CoordinationNamedCheck[];
    remainingScope: string[];
  };
}

export interface CoordinationQueueItem {
  handoffId: string;
  arrivalSequence: number;
}

export interface CoordinationCleanupState {
  repositoryId: string;
  worktreePath: string;
  branch: string;
  planTaskId: string;
  ownershipGeneration: number;
  executor: string;
  delegatedBy?: string;
  preflightEvidenceIds: string[];
  preflightSources: {
    cleanliness: string;
    merge: string;
    worktreeGate: string;
    mainGate: string;
    liveProcess: string;
  };
  currentRound: boolean;
  worktreeClean: boolean;
  merged: boolean;
  worktreeGate: CoordinationCheckStatus;
  mainGate: CoordinationCheckStatus;
  liveProcessClear: boolean;
  disposition: "retain" | "eligible" | "removed";
}

export interface CoordinationCleanupStateV2 {
  repositoryId: string;
  worktreePath: string;
  branch: string;
  planTaskId: string;
  roundId: string;
  executor: string;
  delegatedBy?: string;
  preflightEvidenceIds: string[];
  preflightSources: {
    cleanliness: string;
    merge: string;
    worktreeGate: string;
    mainGate: string;
    liveProcess: string;
  };
  currentRound: boolean;
  worktreeClean: boolean;
  merged: boolean;
  worktreeGate: CoordinationCheckStatus;
  mainGate: CoordinationCheckStatus;
  liveProcessClear: boolean;
  disposition: "retain" | "eligible" | "removed";
}

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
  coordination?: CoordinationRegistry;
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
  work: IndexWork[];
  phases: PhaseRecord[];
  checklists: ChecklistRecord[];
  documents: IndexDocument[];
  repositories: RepositoryRecord[];
  evidence: EvidenceRecord[];
}
