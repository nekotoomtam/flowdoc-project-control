import { createRoutineWorkflowPacket } from "../../src/model/workflow-economy.js";
import type {
  CoordinationModelDecision,
  CoordinationRegistryV3,
} from "../../src/model/types.js";
import type { RiskTier, WorkSize } from "../../src/model/workflow-economy.js";

export interface V3FixtureOptions {
  workSize?: WorkSize;
  riskTier?: RiskTier;
  escalationReason?: string;
}

function modelDecision(): CoordinationModelDecision {
  return {
    modelId: "gpt-6-sol",
    reasoningEffort: "high",
    taskComplexity: "typed workflow contract",
    scopeSize: "one repository",
    uncertainty: "bounded",
    missingContext: "none",
    failureImpact: "invalid workflow dispatch",
    recoverability: "fixture reset",
    reason: "contract implementation requires exact schema behavior",
    smallerOptionAssessment: "not selected for cross-contract change",
    availabilitySource: "host schema",
    availabilityObservedAt: "2026-09-24T00:00:00.000Z",
    availableModelEfforts: [{ modelId: "gpt-6-sol", reasoningEfforts: ["high"] }],
    escalationTriggers: ["schema contract conflict"],
  };
}

export function createCoordinationRegistryV3Fixture(
  options: V3FixtureOptions = {},
): CoordinationRegistryV3 {
  const configuredRisk = options.riskTier === undefined && options.escalationReason === undefined
    ? undefined
    : {
        tier: options.riskTier ?? "routine",
        ...(options.escalationReason === undefined
          ? {}
          : { escalationReason: options.escalationReason }),
      };
  const workflowPacket = createRoutineWorkflowPacket({
    policyId: "flowdoc-workflow-economy-v1",
    goal: "Implement the version 3 workflow packet contract.",
    ownerRepositoryId: "repo-project-control",
    allowedScope: ["src/model/", "schemas/", "tests/"],
    forbiddenScope: ["../flowdoc-core/", "../flowdoc-backend/", "../flowdoc-editor/"],
    acceptanceCriteria: ["The version 3 schema accepts a complete routine packet."],
    workAuthority: "implementation",
    workSize: options.workSize ?? "small",
    relevantEvidenceIds: ["evidence-workflow-economy-design"],
    unknowns: [],
    ownerDecisions: [],
    modelDecision: modelDecision(),
    escalationTriggers: ["schema contract conflict"],
    returnRoute: {
      planTaskId: "plan-economy-1",
      automaticChannel: "send_message_to_thread",
      activeCommand: "mcp__codex_app__send_message_to_thread",
    },
    ...(configuredRisk === undefined ? {} : { risk: configuredRisk }),
  });

  return {
    version: 3,
    revision: 0,
    round: {
      planTaskId: "plan-economy-1",
      roundId: "round-economy-1",
      workId: "workflow-economy-schema-test",
      scopeId: "workflow-economy",
      scopeKeys: ["flowdoc:workflow-economy"],
      allowedFiles: ["src/model/", "schemas/", "tests/"],
      state: "active",
      policyId: "flowdoc-workflow-economy-v1",
    },
    integrationClaims: [{
      repositoryId: "repo-project-control",
      planTaskId: "plan-economy-1",
      roundId: "round-economy-1",
      baseCommit: "c".repeat(40),
      state: "active",
    }],
    returnOrderPolicy: "severity-then-arrival",
    roomRuns: [{
      roomRunId: "workflow-economy-room",
      dispatchSetId: "workflow-economy-dispatch",
      laneId: "workflow-economy-lane",
      workType: "implementation",
      ownerRepositoryId: "repo-project-control",
      activeRole: "project-control-steward",
      phaseId: "phase-workflow-economy-clean-cutover-implementation",
      checklistId: "checklist-workflow-economy-clean-cutover-implementation",
      evidenceTarget: "tests/flowdoc-workflow-economy-schema.test.ts",
      roundId: "round-economy-1",
      revisionAttempt: 0,
      expectedHandoffId: "workflow-economy-handoff-0",
      status: "prepared",
      locator: { threadId: "workflow-economy-thread" },
      contextAcknowledgement: {
        status: "acknowledged",
        acknowledgedAt: "2026-09-24T00:00:00.000Z",
      },
      returnRoute: {
        planTaskId: "plan-economy-1",
        automaticChannel: "send_message_to_thread",
        activeCommand: "mcp__codex_app__send_message_to_thread",
        monitorOwner: "plan-economy-1",
        livenessDeadline: "2026-09-24T00:20:00.000Z",
        maxSendAttempts: 3,
      },
      modelDecision: modelDecision(),
      ux: {
        visibleChange: false,
        applicability: "not-applicable",
        reason: "schema fixture",
      },
      requiredEvidence: ["evidence-workflow-economy-design"],
      packet: workflowPacket,
    }],
    handoffs: [],
    completionQueue: [],
    cleanup: [],
  };
}

export function createInvalidLargeCoordinationRegistryV3Fixture(): Record<string, unknown> {
  const registry = createCoordinationRegistryV3Fixture();
  registry.roomRuns[0]!.packet.workSize = "large" as WorkSize;
  return registry as unknown as Record<string, unknown>;
}
