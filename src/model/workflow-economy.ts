import type {
  CompactCoordinationModelDecision,
  LegacyCoordinationModelDecision,
} from "./types.js";

export type WorkAuthority = "discovery" | "implementation" | "verification";
export type WorkSize = "small" | "medium";
export type RiskTier = "routine" | "bounded" | "critical";
export type UnknownDisposition = "blocking" | "accepted" | "deferred" | "irrelevant";
export type CloseForm = "none" | "acceptance-summary" | "formal-audit";
export type OwnerDecisionKind = "accept-risk" | "defer-proof" | "freeze-scope" | "stop-investigation";

export interface WorkflowUnknown {
  id: string;
  summary: string;
  disposition: UnknownDisposition;
  ownerAction?: string;
  returnTrigger?: string;
}

export interface OwnerDecision {
  id: string;
  kind: OwnerDecisionKind;
  reason: string;
  decidedBy: string;
  decidedAt: string;
  returnTrigger?: string;
}

export interface ProofBudget {
  maxNewEvidence: number;
  maxDurableDocuments: number;
  maxReviewCycles: number;
  closeForm: CloseForm;
  authorizedArtifacts: Array<{
    kind: "evidence" | "gate" | "audit" | "document";
    failurePrevented: string;
    existingProofInsufficient: string;
  }>;
}

interface WorkflowEconomyPacketBase {
  goal: string;
  ownerRepositoryId: string;
  allowedScope: string[];
  forbiddenScope: string[];
  acceptanceCriteria: string[];
  workAuthority: WorkAuthority;
  workSize: WorkSize;
  risk: { tier: RiskTier; escalationReason?: string };
  proofBudget: ProofBudget;
  relevantEvidenceIds: string[];
  unknowns: WorkflowUnknown[];
  ownerDecisions: OwnerDecision[];
  fallback?: { behavior: string; performanceBudget: string; verification: string };
  escalationTriggers: string[];
  returnRoute: {
    planTaskId: string;
    automaticChannel: string;
    activeCommand: string;
  };
}

export interface ScopeLockProfileV1 {
  version: 1;
  enforcement: "git-worktree";
  baseCommit: string;
  worktree: string;
}

export interface WorkflowEconomyPacketV1 extends WorkflowEconomyPacketBase {
  policyId: "flowdoc-workflow-economy-v1";
  modelDecision: LegacyCoordinationModelDecision;
}

export interface WorkflowEconomyPacketV2 extends WorkflowEconomyPacketBase {
  policyId: "flowdoc-workflow-economy-v2";
  scopeLock: ScopeLockProfileV1;
  modelDecision: CompactCoordinationModelDecision;
}

export type WorkflowEconomyPacket = WorkflowEconomyPacketV1 | WorkflowEconomyPacketV2;

export interface WorkflowCompletionReport {
  behaviorChanged: string;
  proof: Array<{
    kind: "test" | "evidence";
    reference: string;
    criterionRefs?: string[];
  }>;
  remainingUnknowns: WorkflowUnknown[];
  downstreamInformation: string;
  changedFiles: string[];
  createdEvidenceIds: string[];
  createdDocumentIds: string[];
  reviewCyclesUsed: number;
  implementationCommitCount: number;
}

export type CreateRoutineWorkflowPacketInput = Omit<
  WorkflowEconomyPacketV1,
  "risk" | "proofBudget"
> & {
  risk?: WorkflowEconomyPacketV1["risk"];
  proofBudget?: ProofBudget;
};

export function createRoutineWorkflowPacket(
  input: CreateRoutineWorkflowPacketInput,
): WorkflowEconomyPacketV1 {
  return withRoutineDefaults(input);
}

export type CreateRoutineWorkflowPacketV2Input = Omit<
  WorkflowEconomyPacketV2,
  "risk" | "proofBudget"
> & {
  risk?: WorkflowEconomyPacketV2["risk"];
  proofBudget?: ProofBudget;
};

export function createRoutineWorkflowPacketV2(
  input: CreateRoutineWorkflowPacketV2Input,
): WorkflowEconomyPacketV2 {
  return withRoutineDefaults(input);
}

function withRoutineDefaults<T extends CreateRoutineWorkflowPacketInput | CreateRoutineWorkflowPacketV2Input>(
  input: T,
): T & { risk: NonNullable<T["risk"]>; proofBudget: ProofBudget } {
  return {
    ...input,
    risk: input.risk ?? { tier: "routine" },
    proofBudget: input.proofBudget ?? {
      maxNewEvidence: 0,
      maxDurableDocuments: 0,
      maxReviewCycles: 0,
      closeForm: "none",
      authorizedArtifacts: [],
    },
  } as T & { risk: NonNullable<T["risk"]>; proofBudget: ProofBudget };
}
