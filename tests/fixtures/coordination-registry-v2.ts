import type { CoordinationRegistryV2, CoordinationRoomRunV2 } from "../../src/model/types.js";

function createV2Room(): CoordinationRoomRunV2 {
  return {
    roomRunId: "pilot-v2-room",
    dispatchSetId: "pilot-v2-dispatch",
    laneId: "pilot-v2-lane",
    workType: "product-implementation",
    ownerRepositoryId: "project-control",
    activeRole: "product-implementation-agent",
    phaseId: "phase-contract",
    checklistId: "checklist-contract",
    evidenceTarget: "evidence-design",
    roundId: "round-2",
    revisionAttempt: 0,
    expectedHandoffId: "pilot-v2-room-r0",
    status: "prepared",
    locator: { threadId: "pilot-v2-thread" },
    contextAcknowledgement: {
      status: "acknowledged",
      acknowledgedAt: "2026-09-21T07:00:00.000Z",
    },
    returnRoute: {
      planTaskId: "plan-2",
      automaticChannel: "send_message_to_thread",
      activeCommand: "mcp__codex_app__send_message_to_thread",
      monitorOwner: "plan-2",
      livenessDeadline: "2026-09-21T07:20:00.000Z",
      maxSendAttempts: 3,
    },
    modelDecision: {
      modelId: "gpt-5.6-sol",
      reasoningEffort: "high",
      taskComplexity: "typed state transition",
      scopeSize: "one repository",
      uncertainty: "bounded",
      missingContext: "none",
      failureImpact: "invalid coordination",
      recoverability: "fixture reset",
      reason: "verified transition logic",
      smallerOptionAssessment: "not selected for transition complexity",
      availabilitySource: "host schema",
      availabilityObservedAt: "2026-09-21T07:00:00.000Z",
      availableModelEfforts: [{ modelId: "gpt-5.6-sol", reasoningEfforts: ["high"] }],
      escalationTriggers: ["two reasoning failures"],
    },
    ux: {
      visibleChange: false,
      applicability: "not-applicable",
      reason: "internal fixture",
    },
    requiredEvidence: ["evidence-design"],
  };
}

export function createCoordinationRegistryV2Fixture(): CoordinationRegistryV2 {
  return {
    version: 2,
    revision: 0,
    round: {
      planTaskId: "plan-2",
      roundId: "round-2",
      workId: "work-v2",
      scopeId: "pilot-v2",
      scopeKeys: ["flowdoc:pilot-v2"],
      allowedFiles: ["src/model/", "tools/", "tests/"],
      state: "active",
    },
    integrationClaims: [{
      repositoryId: "project-control",
      planTaskId: "plan-2",
      roundId: "round-2",
      baseCommit: "b".repeat(40),
      state: "active",
    }],
    returnOrderPolicy: "severity-then-arrival",
    roomRuns: [createV2Room()],
    handoffs: [],
    completionQueue: [],
    cleanup: [],
  };
}
