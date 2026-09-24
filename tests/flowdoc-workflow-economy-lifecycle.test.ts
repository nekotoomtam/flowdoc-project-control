import { describe, expect, it } from "vitest";
import {
  applyCoordinationV3Command,
  packetDigest,
  validateCoordinationV3Registry,
  validateWorkflowCompletion,
  validateWorkflowPacket,
} from "../src/model/coordination-v3.js";
import type {
  CoordinationHandoffV3,
  CoordinationRegistryV3,
} from "../src/model/types.js";
import type {
  RiskTier,
  WorkflowCompletionReport,
  WorkflowEconomyPacket,
  WorkflowUnknown,
  WorkAuthority,
} from "../src/model/workflow-economy.js";
import { createCoordinationRegistryV3Fixture } from "./fixtures/coordination-registry-v3.js";

interface CompletionFixtureOverrides {
  workAuthority?: WorkAuthority;
  riskTier?: RiskTier;
  escalationReason?: string;
  closeForm?: WorkflowEconomyPacket["proofBudget"]["closeForm"];
  changedFiles?: string[];
  createdEvidenceIds?: string[];
  createdDocumentIds?: string[];
  reviewCyclesUsed?: number;
  unknowns?: WorkflowUnknown[];
  fallback?: WorkflowEconomyPacket["fallback"];
}

function completionFixture(overrides: CompletionFixtureOverrides = {}): {
  packet: WorkflowEconomyPacket;
  completion: WorkflowCompletionReport;
} {
  const registry = createCoordinationRegistryV3Fixture();
  const packet = structuredClone(registry.roomRuns[0]!.packet);
  packet.workAuthority = overrides.workAuthority ?? packet.workAuthority;
  packet.risk = {
    tier: overrides.riskTier ?? packet.risk.tier,
    ...(overrides.escalationReason === undefined
      ? (packet.risk.escalationReason === undefined ? {} : { escalationReason: packet.risk.escalationReason })
      : { escalationReason: overrides.escalationReason }),
  };
  packet.proofBudget.closeForm = overrides.closeForm ?? packet.proofBudget.closeForm;
  packet.unknowns = structuredClone(overrides.unknowns ?? packet.unknowns);
  if (overrides.fallback !== undefined) packet.fallback = structuredClone(overrides.fallback);

  return {
    packet,
    completion: {
      behaviorChanged: "Implemented the bounded workflow behavior.",
      proof: [{ kind: "test", reference: "tests/workflow.test.ts" }],
      remainingUnknowns: structuredClone(packet.unknowns),
      downstreamInformation: "No downstream action is required.",
      changedFiles: [...(overrides.changedFiles ?? [])],
      createdEvidenceIds: [...(overrides.createdEvidenceIds ?? [])],
      createdDocumentIds: [...(overrides.createdDocumentIds ?? [])],
      reviewCyclesUsed: overrides.reviewCyclesUsed ?? 0,
      implementationCommitCount: 1,
    },
  };
}

const criticalWithoutReason = () => completionFixture({ riskTier: "critical" });
const routineFormalAudit = () => completionFixture({ closeForm: "formal-audit" });
const undisclosedEvidence = () => completionFixture({ createdEvidenceIds: ["evidence-extra"] });
const twoReviewsOnOneReviewBudget = () => {
  const fixture = completionFixture({ reviewCyclesUsed: 2 });
  fixture.packet.proofBudget.maxReviewCycles = 1;
  return fixture;
};
const unknownWithoutDisposition = () => {
  const fixture = completionFixture({
    unknowns: [{ id: "unknown-1", summary: "Unclassified state", disposition: "blocking" }],
  });
  delete (fixture.completion.remainingUnknowns[0] as Partial<WorkflowUnknown>).disposition;
  return fixture;
};

function expectIssue(
  fixture: { packet: WorkflowEconomyPacket; completion: WorkflowCompletionReport },
  code: string,
): void {
  expect(validateWorkflowCompletion(fixture.packet, fixture.completion)).toContainEqual(
    expect.objectContaining({ code }),
  );
}

function acceptedRegistry(): CoordinationRegistryV3 {
  const registry = createCoordinationRegistryV3Fixture();
  const room = registry.roomRuns[0]!;
  room.status = "accepted";
  room.packet.ownerDecisions = [{
    id: "decision-stop",
    kind: "stop-investigation",
    reason: "Acceptance passed.",
    decidedBy: "owner",
    decidedAt: "2026-09-24T00:10:00.000Z",
  }];
  room.packet.escalationTriggers = ["permission boundary changed"];
  room.packetDigest = packetDigest(room.packet);
  const completion = completionFixture().completion;
  const payload = {
    planTaskId: registry.round.planTaskId,
    roundId: registry.round.roundId,
    roomRunId: room.roomRunId,
    laneId: room.laneId,
    ownerRepositoryId: room.ownerRepositoryId,
    revisionAttempt: room.revisionAttempt,
    status: "PASS" as const,
    behaviorChanged: false,
    behaviorSummary: "No product behavior changed.",
    changedFiles: [],
    tests: ["focused"],
    evidenceIds: [],
    risks: [],
    unknowns: [],
    completion,
  };
  registry.handoffs.push({
    handoffId: room.expectedHandoffId,
    payloadDigest: "stored-digest",
    payload,
    transport: { status: "sent", attempts: 1, attemptHistory: [] },
    receipt: { status: "received", acknowledgedAt: "2026-09-24T00:09:00.000Z" },
    acceptance: {
      status: "accepted",
      reviewer: registry.round.planTaskId,
      reviewedAt: "2026-09-24T00:10:00.000Z",
      evidenceIds: [],
      requiredChecks: [{ name: "focused", status: "passed" }],
      remainingScope: [],
    },
  } satisfies CoordinationHandoffV3);
  return registry;
}

describe("workflow economy validation", () => {
  it.each([
    ["critical without a reason", criticalWithoutReason(), "CRITICAL_REASON_REQUIRED"],
    ["routine formal audit", routineFormalAudit(), "CLOSE_FORM_EXCEEDS_TIER"],
    ["unauthorized proof artifact", undisclosedEvidence(), "PROOF_ARTIFACT_UNAUTHORIZED"],
    ["review budget exceeded", twoReviewsOnOneReviewBudget(), "REVIEW_BUDGET_EXCEEDED"],
    ["unclassified unknown", unknownWithoutDisposition(), "UNKNOWN_DISPOSITION_REQUIRED"],
  ])("rejects %s", (_name, fixture, code) => expectIssue(fixture, code));

  it.each(["discovery", "verification"] as const)("rejects changed files for %s", (workAuthority) => {
    expectIssue(completionFixture({ workAuthority, changedFiles: ["src/changed.ts"] }), "WORK_AUTHORITY_READ_ONLY");
  });

  it("keeps implementation edits inside allowed scope and outside forbidden scope", () => {
    const allowed = completionFixture({ changedFiles: ["src/model/changed.ts"] });
    expect(validateWorkflowCompletion(allowed.packet, allowed.completion)).toEqual([]);
    expectIssue(completionFixture({ changedFiles: ["outside/changed.ts"] }), "CHANGED_FILE_OUTSIDE_SCOPE");
    const forbidden = completionFixture({ changedFiles: ["src/model/private/changed.ts"] });
    forbidden.packet.forbiddenScope = ["src/model/private/"];
    expectIssue(forbidden, "CHANGED_FILE_FORBIDDEN");
  });

  it("blocks only blocking unknowns and requires a return trigger for deferred unknowns", () => {
    for (const disposition of ["accepted", "irrelevant"] as const) {
      const fixture = completionFixture({ unknowns: [{ id: disposition, summary: disposition, disposition }] });
      expect(validateWorkflowCompletion(fixture.packet, fixture.completion)).toEqual([]);
    }
    expectIssue(completionFixture({
      unknowns: [{ id: "blocking", summary: "Must resolve", disposition: "blocking", ownerAction: "PLAN decides" }],
    }), "BLOCKING_UNKNOWN_REMAINS");
    expectIssue(completionFixture({
      unknowns: [{ id: "deferred", summary: "Return later", disposition: "deferred" }],
    }), "DEFERRED_UNKNOWN_TRIGGER_REQUIRED");
    const deferred = completionFixture({
      unknowns: [{ id: "deferred", summary: "Return later", disposition: "deferred", returnTrigger: "API changes" }],
    });
    expect(validateWorkflowCompletion(deferred.packet, deferred.completion)).toEqual([]);
  });

  it("requires correctness and performance verification before using a fallback", () => {
    const incomplete = completionFixture({
      fallback: { behavior: "Recompute", performanceBudget: "50 ms", verification: " " },
    });
    expect(validateWorkflowPacket(incomplete.packet)).toContainEqual(
      expect.objectContaining({ code: "FALLBACK_VERIFICATION_REQUIRED" }),
    );
    const complete = completionFixture({
      fallback: { behavior: "Recompute", performanceBudget: "50 ms", verification: "unit and budget tests" },
    });
    expect(validateWorkflowPacket(complete.packet)).toEqual([]);
  });

  it("reports an unknown without mutating the packet or synthesizing a Gate", () => {
    const fixture = unknownWithoutDisposition();
    const before = structuredClone(fixture.packet);
    validateWorkflowCompletion(fixture.packet, fixture.completion);
    expect(fixture.packet).toEqual(before);
    expect(fixture.packet.proofBudget.authorizedArtifacts).toEqual([]);
  });
});

describe("workflow economy lifecycle", () => {
  it("keeps ownership transfer removed for version 3", () => {
    const registry = createCoordinationRegistryV3Fixture();
    expect(() => applyCoordinationV3Command(registry, {
      type: "transfer-ownership",
    } as never)).toThrowError(expect.objectContaining({ code: "OWNERSHIP_TRANSFER_REMOVED" }));
  });

  it("rejects a packet profile changed after activation", () => {
    const registry = createCoordinationRegistryV3Fixture();
    registry.roomRuns[0]!.status = "active";
    registry.roomRuns[0]!.packet.risk.tier = "bounded";
    expect(() => applyCoordinationV3Command(registry, {
      type: "supersede-attempt",
      planTaskId: registry.round.planTaskId,
      roundId: registry.round.roundId,
      roomRunId: registry.roomRuns[0]!.roomRunId,
      revisionAttempt: 0,
    })).toThrowError(expect.objectContaining({ code: "PACKET_PROFILE_CHANGED" }));
  });

  it("permanently stops accepted work without a matching blocker-grade trigger", () => {
    const registry = acceptedRegistry();
    expect(() => applyCoordinationV3Command(registry, {
      type: "authorize-revision",
      planTaskId: registry.round.planTaskId,
      roundId: registry.round.roundId,
      roomRunId: registry.roomRuns[0]!.roomRunId,
      priorAttempt: 0,
      expectedHandoffId: "workflow-economy-handoff-1",
      livenessDeadline: "2026-09-24T01:00:00.000Z",
    })).toThrowError(expect.objectContaining({ code: "ACCEPTED_WORK_MUST_STOP" }));
    expect(() => applyCoordinationV3Command(registry, {
      type: "supersede-attempt",
      planTaskId: registry.round.planTaskId,
      roundId: registry.round.roundId,
      roomRunId: registry.roomRuns[0]!.roomRunId,
      revisionAttempt: 0,
    })).toThrowError(expect.objectContaining({ code: "ACCEPTED_WORK_MUST_STOP" }));
  });

  it("rejects an undeclared blocker kind even when its text matches an escalation trigger", () => {
    const registry = acceptedRegistry();
    expect(() => applyCoordinationV3Command(registry, {
      type: "authorize-revision",
      planTaskId: registry.round.planTaskId,
      roundId: registry.round.roundId,
      roomRunId: registry.roomRuns[0]!.roomRunId,
      priorAttempt: 0,
      expectedHandoffId: "workflow-economy-handoff-1",
      livenessDeadline: "2026-09-24T01:00:00.000Z",
      reopenTrigger: {
        kind: "ordinary-risk",
        fact: "Repository permission boundary changed.",
        matchedEscalationTrigger: "permission boundary changed",
      },
    } as never)).toThrowError(expect.objectContaining({ code: "REOPEN_TRIGGER_KIND_INVALID" }));
  });

  it("reopens an owner-closed result only for a matching blocker-grade fact", () => {
    const registry = acceptedRegistry();
    const reopened = applyCoordinationV3Command(registry, {
      type: "authorize-revision",
      planTaskId: registry.round.planTaskId,
      roundId: registry.round.roundId,
      roomRunId: registry.roomRuns[0]!.roomRunId,
      priorAttempt: 0,
      expectedHandoffId: "workflow-economy-handoff-1",
      livenessDeadline: "2026-09-24T01:00:00.000Z",
      reopenTrigger: {
        kind: "authority-violation",
        fact: "Repository permission boundary changed.",
        matchedEscalationTrigger: "permission boundary changed",
      },
    });
    expect(reopened.roomRuns.at(-1)).toMatchObject({ revisionAttempt: 1, status: "prepared" });
    expect(registry.roomRuns[0]!.status).toBe("accepted");
  });

  it("rejects acceptance while completion still contains a blocking unknown", () => {
    const registry = createCoordinationRegistryV3Fixture();
    const room = registry.roomRuns[0]!;
    const fixture = completionFixture({
      unknowns: [{ id: "blocking", summary: "Must resolve", disposition: "blocking", ownerAction: "PLAN decides" }],
    });
    room.status = "returned";
    room.requiredEvidence = [];
    room.packet = fixture.packet;
    room.packetDigest = packetDigest(room.packet);
    const payload = {
      planTaskId: registry.round.planTaskId,
      roundId: registry.round.roundId,
      roomRunId: room.roomRunId,
      laneId: room.laneId,
      ownerRepositoryId: room.ownerRepositoryId,
      revisionAttempt: 0,
      status: "PASS" as const,
      behaviorChanged: false,
      behaviorSummary: "No product behavior changed.",
      changedFiles: [], tests: ["focused"], evidenceIds: [], risks: [], unknowns: [],
      completion: fixture.completion,
    };
    registry.handoffs.push({
      handoffId: room.expectedHandoffId,
      payloadDigest: "stored-digest",
      payload,
      transport: { status: "sent", attempts: 1, attemptHistory: [] },
      receipt: { status: "received", acknowledgedAt: "2026-09-24T00:09:00.000Z", arrivalSequence: 1 },
      acceptance: { status: "pending", evidenceIds: [], requiredChecks: [], remainingScope: [] },
    });
    registry.completionQueue = [{ handoffId: room.expectedHandoffId, arrivalSequence: 1 }];

    expect(() => applyCoordinationV3Command(registry, {
      type: "accept-handoff",
      planTaskId: registry.round.planTaskId,
      roundId: registry.round.roundId,
      handoffId: room.expectedHandoffId,
      reviewer: registry.round.planTaskId,
      reviewedAt: "2026-09-24T00:10:00.000Z",
      evidenceIds: [],
      requiredChecks: [{ name: "focused", status: "passed" }],
      remainingScope: [],
    })).toThrowError(expect.objectContaining({ code: "BLOCKING_UNKNOWN_REMAINS" }));
  });

  it("rejects active rooms after their round is released", () => {
    const registry = createCoordinationRegistryV3Fixture();
    registry.round.state = "released";
    registry.roomRuns[0]!.status = "active";
    expect(validateCoordinationV3Registry("workflow-economy-schema-test", registry, new Map()))
      .toContainEqual(expect.objectContaining({ code: "WORKFLOW_ACTIVE_ROOM_ROUND_INACTIVE" }));
  });
});
