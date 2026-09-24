import type { CoordinationModelDecision } from "./types.js";

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

export interface WorkflowEconomyPacket {
  policyId: "flowdoc-workflow-economy-v1";
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
  modelDecision: CoordinationModelDecision;
  escalationTriggers: string[];
  returnRoute: {
    planTaskId: string;
    automaticChannel: string;
    activeCommand: string;
  };
}

export interface WorkflowCompletionReport {
  behaviorChanged: string;
  proof: Array<{ kind: "test" | "evidence"; reference: string }>;
  remainingUnknowns: WorkflowUnknown[];
  downstreamInformation: string;
  changedFiles: string[];
  createdEvidenceIds: string[];
  createdDocumentIds: string[];
  reviewCyclesUsed: number;
  implementationCommitCount: number;
}

export type CreateRoutineWorkflowPacketInput = Omit<
  WorkflowEconomyPacket,
  "risk" | "proofBudget"
> & {
  risk?: WorkflowEconomyPacket["risk"];
  proofBudget?: ProofBudget;
};

export function createRoutineWorkflowPacket(
  input: CreateRoutineWorkflowPacketInput,
): WorkflowEconomyPacket {
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
  };
}
