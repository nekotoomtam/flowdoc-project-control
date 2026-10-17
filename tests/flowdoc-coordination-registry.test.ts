import { describe, expect, it } from "vitest";
import {
  CoordinationTransitionError,
  applyCoordinationCommand as applyVersionedCoordinationCommand,
  applyLegacyCoordinationCommand as applyCoordinationCommand,
  assessCleanupEligibility,
  canonicalPayloadDigest,
  collectExecutionIdentityIssues,
  validateCoordinationRegistries,
} from "../src/model/coordination.js";
import type {
  CoordinationCleanupState,
  CoordinationRegistryV1 as CoordinationRegistry,
  CoordinationTerminalPayload,
} from "../src/model/types.js";
import { loadProjectSources } from "../tools/lib/load-sources.js";
import { validateProjectSemantics } from "../tools/lib/validate-semantics.js";
import { createProjectFixture } from "./fixtures/project-source.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";
import { createCoordinationRegistryV3Fixture } from "./fixtures/coordination-registry-v3.js";

const timestamp = "2026-09-10T07:00:00.000Z";
const nextTimestamp = "2026-09-10T07:01:00.000Z";

function makeRegistry(): CoordinationRegistry {
  return {
    version: 1,
    revision: 0,
    scopeOwnership: {
      scopeId: "agent-and-skill-design-coordination-six",
      scopeKeys: ["flowdoc:coordination-six"],
      allowedFiles: ["schemas", "src/model", "tools", "tests", "package.json"],
      planTaskId: "plan-1",
      generation: 1,
      state: "active",
      transfers: [],
    },
    integrationClaims: [{
      repositoryId: "repo-project-control",
      planTaskId: "plan-1",
      generation: 1,
      baseCommit: "a".repeat(40),
      state: "active",
    }],
    returnOrderPolicy: "severity-then-arrival",
    roomRuns: [{
      roomRunId: "coordination-registry-01",
      dispatchSetId: "coordination-six-code-20260910",
      laneId: "coordination-registry",
      workType: "product-implementation",
      ownerRepositoryId: "repo-project-control",
      activeRole: "product-implementation-agent",
      phaseId: "phase-coordination",
      checklistId: "checklist-coordination",
      evidenceTarget: "evidence-coordination",
      ownershipGeneration: 1,
      revisionAttempt: 0,
      expectedHandoffId: "coordination-registry-01-r0",
      status: "active",
      locator: {
        threadId: "thread-work-1",
        worktree: "C:/repo/.worktrees/coordination-six",
        branch: "codex/coordination-six",
      },
      contextAcknowledgement: { status: "acknowledged", acknowledgedAt: timestamp },
      returnRoute: {
        planTaskId: "plan-1",
        automaticChannel: "send_message_to_thread",
        activeCommand: "mcp__codex_app__send_message_to_thread",
        monitorOwner: "plan-1",
        livenessDeadline: "2026-09-10T07:20:00.000Z",
        maxSendAttempts: 3,
      },
      modelDecision: {
        modelId: "gpt-5.6-sol",
        reasoningEffort: "high",
        taskComplexity: "nontrivial transition logic",
        scopeSize: "one repository",
        uncertainty: "bounded schema alignment",
        missingContext: "none known",
        failureImpact: "invalid coordination acceptance",
        recoverability: "revert code-only commit",
        reason: "bounded implementation with explicit invariants",
        smallerOptionAssessment: "smaller option not selected for transition complexity",
        availabilitySource: "host create_thread schema",
        availabilityObservedAt: timestamp,
        availableModelEfforts: [{ modelId: "gpt-5.6-sol", reasoningEfforts: ["high"] }],
        escalationTriggers: ["two reasoning-attributable revisions fail"],
      },
      ux: {
        visibleChange: false,
        applicability: "not-applicable",
        reason: "internal record tooling only",
      },
      requiredEvidence: ["evidence-code"],
    }],
    handoffs: [],
    completionQueue: [],
    cleanup: [],
  };
}

function makePayload(
  overrides: Partial<Omit<CoordinationTerminalPayload, "exactCommit">> & { exactCommit?: string | undefined } = {},
): CoordinationTerminalPayload {
  const payload: CoordinationTerminalPayload = {
    planTaskId: "plan-1",
    roomRunId: "coordination-registry-01",
    laneId: "coordination-registry",
    ownerRepositoryId: "repo-project-control",
    ownershipGeneration: 1,
    revisionAttempt: 0,
    status: "PASS",
    behaviorChanged: true,
    behaviorSummary: "Adds the Project Control coordination registry.",
    exactCommit: "b".repeat(40),
    changedFiles: ["src/model/coordination.ts"],
    tests: ["vitest coordination registry"],
    evidenceIds: ["evidence-code"],
    risks: [],
    unknowns: ["distributed writers remain outside this local guard"],
  };
  Object.assign(payload, overrides);
  if ("exactCommit" in overrides && overrides.exactCommit === undefined) {
    delete payload.exactCommit;
  }
  return payload;
}

function evidenceMap(
  entries: Array<[string, { repositoryId: string; commit: string }]> = [
    ["evidence-code", { repositoryId: "repo-project-control", commit: "b".repeat(40) }],
  ],
): ReadonlyMap<string, { repositoryId: string; commit: string }> {
  return new Map(entries);
}

function sendAndReceive(registry = makeRegistry(), payload = makePayload()): CoordinationRegistry {
  const sent = applyCoordinationCommand(registry, {
    type: "record-send",
    handoffId: "coordination-registry-01-r0",
    payload,
    outcome: "sent",
    attemptedAt: timestamp,
  });
  const received = applyCoordinationCommand(sent, {
    type: "receive-handoff",
    handoffId: "coordination-registry-01-r0",
    payload,
    senderThreadId: "thread-work-1",
    receivedAt: nextTimestamp,
  });
  return applyCoordinationCommand(received, {
    type: "acknowledge-receipt",
    handoffId: "coordination-registry-01-r0",
    planTaskId: payload.planTaskId,
    acknowledgedAt: "2026-09-10T07:01:30.000Z",
  });
}

describe("coordination registry transitions", () => {
  it("requires the referenced current-host model snapshot before activating policy v2", () => {
    const missing = createCoordinationRegistryV3Fixture();
    delete missing.modelAvailabilitySnapshots;
    expect(() => applyVersionedCoordinationCommand(missing, {
      type: "activate-room",
      planTaskId: missing.round.planTaskId,
      roundId: missing.round.roundId,
      roomRunId: missing.roomRuns[0]!.roomRunId,
      revisionAttempt: 0,
    })).toThrowError(expect.objectContaining({ code: "MODEL_SNAPSHOT_MISSING" }));

    const wrongHost = createCoordinationRegistryV3Fixture();
    wrongHost.roomRuns[0]!.locator.hostId = "remote";
    expect(() => applyVersionedCoordinationCommand(wrongHost, {
      type: "activate-room",
      planTaskId: wrongHost.round.planTaskId,
      roundId: wrongHost.round.roundId,
      roomRunId: wrongHost.roomRuns[0]!.roomRunId,
      revisionAttempt: 0,
    })).toThrowError(expect.objectContaining({ code: "MODEL_SNAPSHOT_HOST_MISMATCH" }));
  });
  it.each([
    ["2026-09-10T07:03:00.000Z", false],
    ["2026-09-10T07:01:45.000Z", true],
  ])("validates accepted priority against receipt history at %s", (receivedAt, violatesPriority) => {
    const accepted = applyCoordinationCommand(sendAndReceive(), {
      type: "accept-handoff", handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1", reviewedAt: "2026-09-10T07:02:00.000Z",
      evidenceIds: ["evidence-code"], requiredChecks: [{ name: "checks", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: evidenceMap() });
    const room = structuredClone(makeRegistry().roomRuns[0]!);
    room.roomRunId = "later-room";
    room.expectedHandoffId = "later-handoff";
    room.locator.threadId = "later-thread";
    accepted.roomRuns.push(room);
    const payload = makePayload({ roomRunId: room.roomRunId, status: "BLOCKER" });
    const sent = applyCoordinationCommand(accepted, {
      type: "record-send", handoffId: room.expectedHandoffId, payload,
      outcome: "sent", attemptedAt: receivedAt,
    });
    const received = applyCoordinationCommand(sent, {
      type: "receive-handoff", handoffId: room.expectedHandoffId, payload,
      senderThreadId: room.locator.threadId, receivedAt,
    });
    const issues = validateCoordinationRegistries([{ id: "work", coordination: received }], evidenceMap());
    expect(issues.some(({ code }) => code === "COORDINATION_QUEUE_PRIORITY_VIOLATION")).toBe(violatesPriority);
    if (!violatesPriority) expect(issues).toEqual([]);
  });

  it("rejects an active room with a blank model rationale without mutating input", () => {
    const registry = makeRegistry();
    registry.roomRuns[0]!.status = "prepared";
    registry.roomRuns[0]!.modelDecision.reason = "   ";
    const before = structuredClone(registry);

    expect(() => applyCoordinationCommand(registry, {
      type: "activate-room",
      roomRunId: "coordination-registry-01",
      ownershipGeneration: 1,
      revisionAttempt: 0,
    })).toThrowError(expect.objectContaining({ code: "MODEL_RATIONALE_MISSING" }));
    expect(registry).toEqual(before);
  });

  it("keeps a failed send unreceived and rejects receipt", () => {
    const payload = makePayload();
    const failed = applyCoordinationCommand(makeRegistry(), {
      type: "record-send",
      handoffId: "coordination-registry-01-r0",
      payload,
      outcome: "failed",
      attemptedAt: timestamp,
    });

    expect(failed.handoffs[0]?.transport).toMatchObject({ status: "pending", attempts: 1 });
    expect(failed.handoffs[0]?.receipt.status).toBe("pending");
    expect(() => applyCoordinationCommand(failed, {
      type: "receive-handoff",
      handoffId: "coordination-registry-01-r0",
      payload,
      senderThreadId: "thread-work-1",
      receivedAt: nextTimestamp,
    })).toThrowError(expect.objectContaining({ code: "HANDOFF_NOT_SENT" }));
  });

  it("enforces 10-second and 30-second retry spacing with persisted attempt history", () => {
    const payload = makePayload();
    const first = applyCoordinationCommand(makeRegistry(), {
      type: "record-send",
      handoffId: "coordination-registry-01-r0",
      payload,
      outcome: "failed",
      attemptedAt: "2026-09-10T07:00:00.000Z",
    });
    expect(first.handoffs[0]?.transport.attemptHistory).toEqual([
      { attemptedAt: "2026-09-10T07:00:00.000Z", outcome: "failed" },
    ]);

    expect(() => applyCoordinationCommand(first, {
      type: "record-send",
      handoffId: "coordination-registry-01-r0",
      payload,
      outcome: "failed",
      attemptedAt: "2026-09-10T07:00:09.999Z",
    })).toThrowError(expect.objectContaining({ code: "RETRY_TOO_EARLY" }));
    const second = applyCoordinationCommand(first, {
      type: "record-send",
      handoffId: "coordination-registry-01-r0",
      payload,
      outcome: "failed",
      attemptedAt: "2026-09-10T07:00:10.000Z",
    });
    expect(() => applyCoordinationCommand(second, {
      type: "record-send",
      handoffId: "coordination-registry-01-r0",
      payload,
      outcome: "failed",
      attemptedAt: "2026-09-10T07:00:39.999Z",
    })).toThrowError(expect.objectContaining({ code: "RETRY_TOO_EARLY" }));
    const exhausted = applyCoordinationCommand(second, {
      type: "record-send",
      handoffId: "coordination-registry-01-r0",
      payload,
      outcome: "failed",
      attemptedAt: "2026-09-10T07:00:40.000Z",
    });
    expect(exhausted.handoffs[0]?.transport).toMatchObject({
      status: "return-channel-failed",
      attempts: 3,
    });
  });

  it("deduplicates canonical payload semantics and rejects changed content under the stable ID", () => {
    const payload = makePayload();
    const received = sendAndReceive(makeRegistry(), payload);
    const reordered = {
      ...payload,
      unknowns: [...payload.unknowns],
      risks: [...payload.risks],
    };
    const duplicate = applyCoordinationCommand(received, {
      type: "receive-handoff",
      handoffId: "coordination-registry-01-r0",
      payload: reordered,
      senderThreadId: "thread-work-1",
      receivedAt: "2026-09-10T07:02:00.000Z",
    });

    expect(duplicate).toEqual(received);
    expect(duplicate.completionQueue).toHaveLength(1);
    expect(canonicalPayloadDigest(reordered)).toBe(canonicalPayloadDigest(payload));

    const before = structuredClone(received);
    expect(() => applyCoordinationCommand(received, {
      type: "receive-handoff",
      handoffId: "coordination-registry-01-r0",
      payload: { ...payload, behaviorSummary: "different" },
      senderThreadId: "thread-work-1",
      receivedAt: "2026-09-10T07:03:00.000Z",
    })).toThrowError(expect.objectContaining({ code: "HANDOFF_PAYLOAD_MISMATCH" }));
    expect(received).toEqual(before);
  });

  it("rejects a wrong sender and a different handoff ID for the same attempt", () => {
    const payload = makePayload();
    const sent = applyCoordinationCommand(makeRegistry(), {
      type: "record-send",
      handoffId: "coordination-registry-01-r0",
      payload,
      outcome: "sent",
      attemptedAt: timestamp,
    });

    expect(() => applyCoordinationCommand(sent, {
      type: "receive-handoff",
      handoffId: "coordination-registry-01-r0",
      payload,
      senderThreadId: "wrong-thread",
      receivedAt: nextTimestamp,
    })).toThrowError(expect.objectContaining({ code: "HANDOFF_SENDER_MISMATCH" }));
    expect(() => applyCoordinationCommand(makeRegistry(), {
      type: "record-send",
      handoffId: "coordination-registry-01-other",
      payload,
      outcome: "sent",
      attemptedAt: timestamp,
    })).toThrowError(expect.objectContaining({ code: "UNEXPECTED_HANDOFF_ID" }));
  });

  it("retains a superseded attempt while authorizing a new attempt in the same room", () => {
    const superseded = applyCoordinationCommand(makeRegistry(), {
      type: "supersede-attempt",
      roomRunId: "coordination-registry-01",
      ownershipGeneration: 1,
      revisionAttempt: 0,
    });
    const revised = applyCoordinationCommand(superseded, {
      type: "authorize-revision",
      roomRunId: "coordination-registry-01",
      priorAttempt: 0,
      expectedHandoffId: "coordination-registry-01-r1",
      livenessDeadline: "2026-09-10T07:40:00.000Z",
    });

    expect(revised.roomRuns).toHaveLength(2);
    expect(revised.roomRuns.map(({ revisionAttempt, status, locator }) => ({
      revisionAttempt,
      status,
      threadId: locator.threadId,
    }))).toEqual([
      { revisionAttempt: 0, status: "superseded", threadId: "thread-work-1" },
      { revisionAttempt: 1, status: "prepared", threadId: "thread-work-1" },
    ]);
  });

  it("resumes from serialized state instead of conversation state", () => {
    const payload = makePayload();
    const sent = applyCoordinationCommand(makeRegistry(), {
      type: "record-send",
      handoffId: "coordination-registry-01-r0",
      payload,
      outcome: "sent",
      attemptedAt: timestamp,
    });
    const restarted = JSON.parse(JSON.stringify(sent)) as CoordinationRegistry;

    const received = applyCoordinationCommand(restarted, {
      type: "receive-handoff",
      handoffId: "coordination-registry-01-r0",
      payload,
      senderThreadId: "thread-work-1",
      receivedAt: nextTimestamp,
    });

    expect(received.handoffs[0]?.receipt.status).toBe("received");
    expect(received.completionQueue).toEqual([
      { handoffId: "coordination-registry-01-r0", arrivalSequence: 1 },
    ]);
  });

  it("requires canonical evidence and an exact commit before accepting changed behavior", () => {
    const noCommit = sendAndReceive(makeRegistry(), makePayload({ exactCommit: undefined }));
    expect(() => applyCoordinationCommand(noCommit, {
      type: "accept-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code"],
      requiredChecks: [{ name: "focused tests", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: evidenceMap() })).toThrowError(
      expect.objectContaining({ code: "EXACT_COMMIT_REQUIRED" }),
    );

    const received = sendAndReceive();
    expect(() => applyCoordinationCommand(received, {
      type: "accept-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code"],
      requiredChecks: [{ name: "focused tests", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: new Map() })).toThrowError(
      expect.objectContaining({ code: "EVIDENCE_NOT_CANONICAL" }),
    );
  });

  it("does not accept mechanism PASS while measurable UX or user acceptance remains pending", () => {
    const registry = makeRegistry();
    registry.roomRuns[0]!.ux = {
      visibleChange: true,
      applicability: "applicable",
      scenario: {
        userAction: "type Enter",
        expectedVisibleBehavior: "text appears without perceptible lag",
        fixture: "large document fixture",
        inputMethod: "keyboard",
        browser: "Chromium",
        device: "Windows workstation",
        environment: "local production build",
      },
      criteria: [{
        id: "typing-latency",
        criterion: "p95 key-to-visible latency below agreed threshold",
        measurementMethod: "performance trace",
        evidenceTarget: "evidence-typing-latency",
        inspector: "user",
        status: "pending",
        evidenceIds: [],
      }],
      mechanismChecks: [{ name: "input event test", status: "passed" }],
      regressionChecks: [{ name: "no loss or reordering", status: "passed" }],
      userAcceptance: { required: true, status: "pending", evidenceIds: [] },
    };
    const received = sendAndReceive(registry);

    expect(() => applyCoordinationCommand(received, {
      type: "accept-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code"],
      requiredChecks: [{ name: "mechanism", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: evidenceMap([
      ["evidence-code", { repositoryId: "repo-project-control", commit: "b".repeat(40) }],
      ["evidence-ux", { repositoryId: "repo-project-control", commit: "b".repeat(40) }],
    ]) })).toThrowError(
      expect.objectContaining({ code: "UX_ACCEPTANCE_INCOMPLETE" }),
    );
  });

  it("resolves a higher-severity return so later PASS review can continue", () => {
    const registry = makeRegistry();
    registry.roomRuns[0]!.expectedHandoffId = "blocker-room-r0";
    const payload = makePayload({
      status: "BLOCKER",
      behaviorChanged: false,
      behaviorSummary: "Blocked before changes.",
      exactCommit: undefined,
      changedFiles: [],
    });
    let state = applyCoordinationCommand(registry, {
      type: "record-send",
      handoffId: "blocker-room-r0",
      payload,
      outcome: "sent",
      attemptedAt: timestamp,
    });
    state = applyCoordinationCommand(state, {
      type: "receive-handoff",
      handoffId: "blocker-room-r0",
      payload,
      senderThreadId: "thread-work-1",
      receivedAt: nextTimestamp,
    });
    state = applyCoordinationCommand(state, {
      type: "acknowledge-receipt",
      handoffId: "blocker-room-r0",
      planTaskId: "plan-1",
      acknowledgedAt: nextTimestamp,
    });

    const resolved = applyCoordinationCommand(state, {
      type: "resolve-handoff",
      handoffId: "blocker-room-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      decision: "needs-revision",
      reviewNote: "Resolve blocker before retry.",
      remainingScope: ["bounded revision"],
    });

    expect(resolved.handoffs[0]?.acceptance.status).toBe("needs-revision");
    expect(resolved.roomRuns[0]?.status).toBe("superseded");
    expect(resolved.completionQueue).toEqual([]);
    expect(resolved.handoffs[0]?.receipt.status).toBe("received");
  });

  it("requires selected model and effort to exist in the observed host snapshot", () => {
    const registry = makeRegistry();
    registry.roomRuns[0]!.status = "prepared";
    const decision = registry.roomRuns[0]!.modelDecision;
    if (!("availableModelEfforts" in decision)) throw new Error("Expected a legacy model decision fixture.");
    decision.availableModelEfforts = [
      { modelId: "gpt-5.6-sol", reasoningEfforts: ["medium"] },
    ];

    expect(() => applyCoordinationCommand(registry, {
      type: "activate-room",
      roomRunId: "coordination-registry-01",
      ownershipGeneration: 1,
      revisionAttempt: 0,
    })).toThrowError(expect.objectContaining({ code: "MODEL_EFFORT_UNAVAILABLE" }));
  });

  it("requires the current PLAN owner to review acceptance", () => {
    const received = sendAndReceive();

    expect(() => applyCoordinationCommand(received, {
      type: "accept-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "different-plan",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code"],
      requiredChecks: [{ name: "focused tests", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: evidenceMap() })).toThrowError(
      expect.objectContaining({ code: "ACCEPTANCE_REVIEWER_NOT_OWNER" }),
    );
  });

  it("does not accept ordinary PASS while a higher-severity return is queued", () => {
    const registry = makeRegistry();
    const second = structuredClone(registry.roomRuns[0]!);
    second.roomRunId = "blocker-room";
    second.laneId = "blocker-lane";
    second.expectedHandoffId = "blocker-room-r0";
    second.locator.threadId = "thread-work-2";
    second.requiredEvidence = ["evidence-blocker"];
    registry.roomRuns.push(second);

    const passPayload = makePayload();
    let state = sendAndReceive(registry, passPayload);
    const blockerPayload = makePayload({
      roomRunId: "blocker-room",
      laneId: "blocker-lane",
      status: "BLOCKER",
      behaviorChanged: false,
      behaviorSummary: "Blocked before changes.",
      exactCommit: undefined,
      changedFiles: [],
      evidenceIds: ["evidence-blocker"],
    });
    state = applyCoordinationCommand(state, {
      type: "record-send",
      handoffId: "blocker-room-r0",
      payload: blockerPayload,
      outcome: "sent",
      attemptedAt: timestamp,
    });
    state = applyCoordinationCommand(state, {
      type: "receive-handoff",
      handoffId: "blocker-room-r0",
      payload: blockerPayload,
      senderThreadId: "thread-work-2",
      receivedAt: nextTimestamp,
    });

    expect(() => applyCoordinationCommand(state, {
      type: "accept-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code"],
      requiredChecks: [{ name: "focused tests", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: evidenceMap([
      ["evidence-code", { repositoryId: "repo-project-control", commit: "b".repeat(40) }],
      ["evidence-blocker", { repositoryId: "repo-project-control", commit: "c".repeat(40) }],
    ]) })).toThrowError(
      expect.objectContaining({ code: "QUEUE_PRIORITY_VIOLATION" }),
    );
  });

  it("requires UX evidence to be canonical and required user acceptance to name actor and evidence", () => {
    const registry = makeRegistry();
    registry.roomRuns[0]!.ux = {
      visibleChange: true,
      applicability: "applicable",
      scenario: {
        userAction: "choose an action",
        expectedVisibleBehavior: "the visible state updates",
        fixture: "fixture",
        inputMethod: "mouse",
        browser: "Chromium",
        device: "Windows workstation",
        environment: "local production build",
      },
      criteria: [{
        id: "visible-result",
        criterion: "visible result matches expected state",
        measurementMethod: "screenshot inspection",
        evidenceTarget: "evidence-ux",
        inspector: "user",
        status: "passed",
        evidenceIds: ["evidence-ux"],
      }],
      mechanismChecks: [{ name: "state transition", status: "passed" }],
      regressionChecks: [{ name: "existing action", status: "passed" }],
      userAcceptance: {
        required: true,
        status: "accepted",
        actor: { kind: "agent", id: "plan-agent" },
        evidenceIds: ["evidence-ux"],
      },
    };
    const received = sendAndReceive(registry);

    expect(() => applyCoordinationCommand(received, {
      type: "accept-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code", "evidence-ux"],
      requiredChecks: [{ name: "focused tests", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: evidenceMap([
      ["evidence-code", { repositoryId: "repo-project-control", commit: "b".repeat(40) }],
      ["evidence-ux", { repositoryId: "repo-project-control", commit: "b".repeat(40) }],
    ]) })).toThrowError(
      expect.objectContaining({ code: "UX_ACCEPTANCE_INCOMPLETE" }),
    );
  });

  it("records receipt acknowledgement separately from receipt and acceptance", () => {
    const payload = makePayload();
    const sent = applyCoordinationCommand(makeRegistry(), {
      type: "record-send",
      handoffId: "coordination-registry-01-r0",
      payload,
      outcome: "sent",
      attemptedAt: timestamp,
    });
    const received = applyCoordinationCommand(sent, {
      type: "receive-handoff",
      handoffId: "coordination-registry-01-r0",
      payload,
      senderThreadId: "thread-work-1",
      receivedAt: nextTimestamp,
    });
    expect(received.handoffs[0]?.receipt).not.toHaveProperty("acknowledgedAt");
    expect(received.handoffs[0]?.receipt).toMatchObject({
      senderThreadId: "thread-work-1",
      channel: "send_message_to_thread",
    });
    expect(received.handoffs[0]?.acceptance.status).toBe("pending");

    expect(() => applyCoordinationCommand(received, {
      type: "acknowledge-receipt",
      handoffId: "coordination-registry-01-r0",
      planTaskId: "wrong-plan",
      acknowledgedAt: "2026-09-10T07:01:30.000Z",
    })).toThrowError(expect.objectContaining({ code: "RECEIPT_ACKNOWLEDGER_NOT_OWNER" }));

    const acknowledged = applyCoordinationCommand(received, {
      type: "acknowledge-receipt",
      handoffId: "coordination-registry-01-r0",
      planTaskId: "plan-1",
      acknowledgedAt: "2026-09-10T07:01:30.000Z",
    });
    expect(acknowledged.handoffs[0]?.receipt.acknowledgedAt).toBe("2026-09-10T07:01:30.000Z");
    expect(acknowledged.handoffs[0]?.acceptance.status).toBe("pending");
  });

  it("keeps arrivalSequence monotonic after an older attempt leaves the queue", () => {
    const first = sendAndReceive();
    const superseded = applyCoordinationCommand(first, {
      type: "supersede-attempt",
      roomRunId: "coordination-registry-01",
      ownershipGeneration: 1,
      revisionAttempt: 0,
    });
    const revised = applyCoordinationCommand(superseded, {
      type: "authorize-revision",
      roomRunId: "coordination-registry-01",
      priorAttempt: 0,
      expectedHandoffId: "coordination-registry-01-r1",
      livenessDeadline: "2026-09-10T07:40:00.000Z",
    });
    revised.roomRuns[1]!.contextAcknowledgement = { status: "acknowledged", acknowledgedAt: timestamp };
    const active = applyCoordinationCommand(revised, {
      type: "activate-room",
      roomRunId: "coordination-registry-01",
      ownershipGeneration: 1,
      revisionAttempt: 1,
    });
    const payload = makePayload({ revisionAttempt: 1 });
    const sent = applyCoordinationCommand(active, {
      type: "record-send",
      handoffId: "coordination-registry-01-r1",
      payload,
      outcome: "sent",
      attemptedAt: timestamp,
    });
    const received = applyCoordinationCommand(sent, {
      type: "receive-handoff",
      handoffId: "coordination-registry-01-r1",
      payload,
      senderThreadId: "thread-work-1",
      receivedAt: nextTimestamp,
    });

    expect(received.handoffs.map(({ receipt }) => receipt.arrivalSequence)).toEqual([1, 2]);
    expect(received.completionQueue).toEqual([
      { handoffId: "coordination-registry-01-r1", arrivalSequence: 2 },
    ]);
  });

  it("ties accepted behavior evidence to the payload owner repository and exact commit", () => {
    const received = sendAndReceive();

    expect(() => applyCoordinationCommand(received, {
      type: "accept-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code"],
      requiredChecks: [{ name: "focused tests", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: evidenceMap([
      ["evidence-code", { repositoryId: "repo-other", commit: "c".repeat(40) }],
    ]) })).toThrowError(expect.objectContaining({ code: "EVIDENCE_OWNER_COMMIT_MISMATCH" }));
  });

  it("does not resolve a handoff after it has already been accepted", () => {
    const received = sendAndReceive();
    const accepted = applyCoordinationCommand(received, {
      type: "accept-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code"],
      requiredChecks: [{ name: "focused tests", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: evidenceMap() });

    expect(() => applyCoordinationCommand(accepted, {
      type: "resolve-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      decision: "rejected",
      reviewNote: "too late",
      remainingScope: [],
    })).toThrowError(expect.objectContaining({ code: "HANDOFF_ALREADY_REVIEWED" }));
  });

  it("closes a resolved round, releases ownership, and reloads accepted history", () => {
    const received = sendAndReceive();
    const accepted = applyCoordinationCommand(received, {
      type: "accept-handoff",
      handoffId: "coordination-registry-01-r0",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code"],
      requiredChecks: [{ name: "focused tests", status: "passed" }],
      remainingScope: [],
    }, { evidenceById: evidenceMap() });
    const released = applyCoordinationCommand(accepted, {
      type: "release-round",
      planTaskId: "plan-1",
    });
    const restarted = JSON.parse(JSON.stringify(released)) as CoordinationRegistry;

    expect(restarted.scopeOwnership.state).toBe("released");
    expect(restarted.integrationClaims[0]?.state).toBe("released");
    expect(restarted.roomRuns[0]?.status).toBe("closed");
    expect(validateCoordinationRegistries([
      { id: "work-1", coordination: restarted },
    ], evidenceMap())).toEqual([]);
  });

  it("refuses to release ownership while a room or handoff remains pending", () => {
    expect(() => applyCoordinationCommand(makeRegistry(), {
      type: "release-round",
      planTaskId: "plan-1",
    })).toThrowError(expect.objectContaining({ code: "ROUND_NOT_RESOLVED" }));
  });
});

describe("stored coordination validation", () => {
  it("rejects competing active scope and integration owners across Work records", () => {
    const first = createCoordinationRegistryV3Fixture();
    const second = createCoordinationRegistryV3Fixture();
    first.roomRuns = [];
    second.roomRuns = [];
    second.round.planTaskId = "plan-2";
    second.round.roundId = "round-2";
    second.integrationClaims[0]!.roundId = "round-2";
    second.integrationClaims[0]!.planTaskId = "plan-2";
    first.round.workId = "work-1";
    second.round.workId = "work-2";

    const issues = validateCoordinationRegistries([
      { id: "work-1", coordination: first },
      { id: "work-2", coordination: second },
    ], new Map());

    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "COORDINATION_SCOPE_CONFLICT",
      "COORDINATION_INTEGRATION_OWNER_CONFLICT",
    ]));
  });

  it("rejects ancestor and descendant allowed-file overlap even when scope keys differ", () => {
    const first = createCoordinationRegistryV3Fixture();
    first.round.allowedFiles = ["schemas/"];
    const second = createCoordinationRegistryV3Fixture();
    second.round.scopeKeys = ["different-scope"];
    second.round.allowedFiles = ["schemas/project-control.schema.json"];
    first.roomRuns = [];
    second.roomRuns = [];
    second.round.planTaskId = "plan-2";
    second.round.roundId = "round-2";
    second.integrationClaims[0]!.roundId = "round-2";
    second.integrationClaims[0]!.planTaskId = "plan-2";
    second.integrationClaims[0]!.state = "released";
    first.round.workId = "work-1";
    second.round.workId = "work-2";

    const issues = validateCoordinationRegistries([
      { id: "work-1", coordination: first },
      { id: "work-2", coordination: second },
    ], new Map());

    expect(issues.map((issue) => issue.code)).toContain("COORDINATION_FILE_SCOPE_CONFLICT");
  });

  it("rejects stored accepted state when payload, evidence, attempt, or UX prerequisites mismatch", () => {
    const accepted = sendAndReceive();
    accepted.handoffs[0]!.acceptance = {
      status: "accepted",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["missing-evidence"],
      requiredChecks: [{ name: "focused tests", status: "failed" }],
      remainingScope: [],
    };
    accepted.roomRuns[0]!.status = "accepted";
    accepted.completionQueue = [];
    accepted.handoffs[0]!.payload.ownershipGeneration = 99;

    const issues = validateCoordinationRegistries([
      { id: "work-1", coordination: accepted },
    ], evidenceMap());

    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "COORDINATION_HANDOFF_IDENTITY_MISMATCH",
      "COORDINATION_ACCEPTANCE_CHECK_FAILED",
      "COORDINATION_EVIDENCE_NOT_CANONICAL",
    ]));
  });

  it("rejects hand-edited accepted UX state with pending measurements and user trial", () => {
    const registry = makeRegistry();
    registry.roomRuns[0]!.ux = {
      visibleChange: true,
      applicability: "applicable",
      scenario: {
        userAction: "type",
        expectedVisibleBehavior: "text is responsive",
        fixture: "large document",
        inputMethod: "keyboard",
        browser: "Chromium",
        device: "Windows workstation",
        environment: "production build",
      },
      criteria: [{
        id: "latency",
        criterion: "p95 below threshold",
        measurementMethod: "trace",
        evidenceTarget: "evidence-ux",
        inspector: "user",
        status: "pending",
        evidenceIds: [],
      }],
      mechanismChecks: [{ name: "input event", status: "passed" }],
      regressionChecks: [{ name: "no loss", status: "passed" }],
      userAcceptance: { required: true, status: "pending", evidenceIds: [] },
    };
    const accepted = sendAndReceive(registry);
    accepted.roomRuns[0]!.status = "accepted";
    accepted.handoffs[0]!.acceptance = {
      status: "accepted",
      reviewer: "plan-1",
      reviewedAt: nextTimestamp,
      evidenceIds: ["evidence-code"],
      requiredChecks: [{ name: "focused tests", status: "passed" }],
      remainingScope: [],
    };
    accepted.completionQueue = [];

    expect(validateCoordinationRegistries([
      { id: "work-1", coordination: accepted },
    ], evidenceMap()).map(({ code }) => code)).toContain(
      "COORDINATION_UX_ACCEPTANCE_INCOMPLETE",
    );
  });

  it("rejects hand-edited lifecycle links and receipt provenance", () => {
    const registry = sendAndReceive();
    registry.completionQueue = [];
    registry.handoffs[0]!.receipt.senderThreadId = "wrong-thread";

    const codes = validateCoordinationRegistries([
      { id: "work-1", coordination: registry },
    ], evidenceMap()).map(({ code }) => code);

    expect(codes).toEqual(expect.arrayContaining([
      "COORDINATION_RECEIVED_HANDOFF_NOT_QUEUED",
      "COORDINATION_RECEIPT_SENDER_MISMATCH",
    ]));
  });

  it("rejects an active integration claim whose owner or generation differs from scope ownership", () => {
    const registry = makeRegistry();
    registry.integrationClaims[0]!.planTaskId = "other-plan";
    registry.integrationClaims[0]!.generation = 2;

    expect(validateCoordinationRegistries([
      { id: "work-1", coordination: registry },
    ], evidenceMap()).map(({ code }) => code)).toContain(
      "COORDINATION_INTEGRATION_CLAIM_MISMATCH",
    );
  });

  it("runs cross-Work coordination validation in the standard semantic gate", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const loaded = await loadProjectSources(root);
    const first = createCoordinationRegistryV3Fixture();
    first.integrationClaims[0]!.repositoryId = "project-control";
    first.roomRuns = [];
    const second = structuredClone(first);
    second.round.planTaskId = "plan-2";
    second.round.roundId = "round-2";
    second.integrationClaims[0]!.roundId = "round-2";
    second.integrationClaims[0]!.planTaskId = "plan-2";
    first.round.workId = loaded.work[0]!.value.id;
    second.round.workId = loaded.work[1]!.value.id;
    loaded.work[0]!.value.coordination = first;
    loaded.work[1]!.value.coordination = second;

    await expect(validateProjectSemantics(loaded)).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ code: "COORDINATION_SCOPE_CONFLICT" }),
      ]),
    });
  });
});

describe("cleanup eligibility", () => {
  it.each([
    ["dirty worktree", { worktreeClean: false }, "WORKTREE_DIRTY"],
    ["unmerged branch", { merged: false }, "BRANCH_UNMERGED"],
    ["failed main gate", { mainGate: "failed" as const }, "MAIN_GATE_NOT_PASSED"],
    ["historical lane", { currentRound: false }, "NOT_CURRENT_ROUND"],
  ])("refuses cleanup for %s", (_name, mutation, reason) => {
    const candidate: CoordinationCleanupState = {
      repositoryId: "repo-project-control",
      worktreePath: "C:/repo/.worktrees/lane",
      branch: "codex/lane",
      planTaskId: "plan-1",
      ownershipGeneration: 1,
      executor: "plan-1",
      preflightEvidenceIds: ["evidence-cleanup"],
      preflightSources: {
        cleanliness: "git status --short",
        merge: "git merge-base --is-ancestor",
        worktreeGate: "worktree gate log",
        mainGate: "main gate log",
        liveProcess: "process inspection",
      },
      currentRound: true,
      worktreeClean: true,
      merged: true,
      worktreeGate: "passed",
      mainGate: "passed",
      liveProcessClear: true,
      disposition: "retain",
      ...mutation,
    };

    expect(assessCleanupEligibility(candidate, {
      planTaskId: "plan-1",
      generation: 1,
      scopeState: "active",
      integrationClaims: [{
        repositoryId: "repo-project-control",
        planTaskId: "plan-1",
        generation: 1,
        baseCommit: "a".repeat(40),
        state: "active",
      }],
      evidenceById: new Map([
        ["evidence-cleanup", { repositoryId: "repo-project-control", commit: "d".repeat(40) }],
      ]),
    })).toEqual({ eligible: false, reasons: [reason] });
  });

  it("refuses an otherwise clean target without current owner authority and linked preflight evidence", () => {
    const candidate: CoordinationCleanupState = {
      repositoryId: "repo-project-control",
      worktreePath: "C:/repo/.worktrees/lane",
      branch: "codex/lane",
      planTaskId: "old-plan",
      ownershipGeneration: 1,
      executor: "agent-1",
      preflightEvidenceIds: ["missing-evidence"],
      preflightSources: {
        cleanliness: "git status --short",
        merge: "git merge-base --is-ancestor",
        worktreeGate: "worktree gate log",
        mainGate: "main gate log",
        liveProcess: "process inspection",
      },
      currentRound: true,
      worktreeClean: true,
      merged: true,
      worktreeGate: "passed",
      mainGate: "passed",
      liveProcessClear: true,
      disposition: "eligible",
    };

    expect(assessCleanupEligibility(candidate, {
      planTaskId: "plan-1",
      generation: 2,
      scopeState: "active",
      integrationClaims: [],
      evidenceById: new Map(),
    })).toEqual({
      eligible: false,
      reasons: ["CLEANUP_OWNER_MISMATCH", "CLEANUP_GENERATION_MISMATCH", "CLEANUP_EXECUTOR_UNAUTHORIZED", "CLEANUP_EVIDENCE_MISSING", "CLEANUP_INTEGRATION_CLAIM_MISSING"],
    });
  });

  it.each(["released", "frozen"] as const)("refuses cleanup when the repository integration claim is %s", (state) => {
    const candidate: CoordinationCleanupState = {
      repositoryId: "repo-project-control",
      worktreePath: "C:/repo/.worktrees/lane",
      branch: "codex/lane",
      planTaskId: "plan-1",
      ownershipGeneration: 1,
      executor: "plan-1",
      preflightEvidenceIds: ["evidence-cleanup"],
      preflightSources: {
        cleanliness: "git status --short",
        merge: "git merge-base --is-ancestor",
        worktreeGate: "worktree gate log",
        mainGate: "main gate log",
        liveProcess: "process inspection",
      },
      currentRound: true,
      worktreeClean: true,
      merged: true,
      worktreeGate: "passed",
      mainGate: "passed",
      liveProcessClear: true,
      disposition: "eligible",
    };
    const result = assessCleanupEligibility(candidate, {
      planTaskId: "plan-1",
      generation: 1,
      scopeState: "active",
      integrationClaims: [{
        repositoryId: "repo-project-control",
        planTaskId: "plan-1",
        generation: 1,
        baseCommit: "a".repeat(40),
        state,
      }],
      evidenceById: new Map([
        ["evidence-cleanup", { repositoryId: "repo-project-control", commit: "d".repeat(40) }],
      ]),
    });
    expect(result.reasons).toContain("CLEANUP_INTEGRATION_CLAIM_MISSING");
  });
});

it("exposes transition failures as stable coded errors", () => {
  expect(new CoordinationTransitionError("TEST", "message")).toMatchObject({
    name: "CoordinationTransitionError",
    code: "TEST",
    message: "message",
  });
});

describe("self-contained execution identities", () => {
  it.each([
    "roomRunId",
    "dispatchSetId",
    "threadId",
    "worktree",
    "branch",
    "expectedHandoffId",
  ] as const)("rejects reused historical %s in a mutable version 2 round", (identity) => {
    const legacy = makeRegistry();
    legacy.roomRuns[0]!.locator.worktree = "C:/worktrees/legacy";
    legacy.roomRuns[0]!.locator.branch = "codex/legacy";
    const current = createCoordinationRegistryV2Fixture();
    const legacyRoom = legacy.roomRuns[0]!;
    const currentRoom = current.roomRuns[0]!;
    if (identity === "roomRunId" || identity === "dispatchSetId" || identity === "expectedHandoffId") {
      currentRoom[identity] = legacyRoom[identity];
    } else {
      currentRoom.locator[identity] = legacyRoom.locator[identity]!;
    }

    expect(collectExecutionIdentityIssues([
      { id: "historical-work", coordination: legacy },
      { id: "current-work", coordination: current },
    ])).toContainEqual(expect.objectContaining({
      code: "COORDINATION_EXECUTION_IDENTITY_REUSED",
    }));
  });

  it("permits locator reuse only for revisions in the same PLAN/round room lineage", () => {
    const registry = createCoordinationRegistryV2Fixture();
    const first = registry.roomRuns[0]!;
    first.locator.worktree = "C:/worktrees/current";
    first.locator.branch = "codex/current";
    first.status = "superseded";
    registry.roomRuns.push({
      ...structuredClone(first),
      revisionAttempt: 1,
      expectedHandoffId: "pilot-v2-room-r1",
      status: "prepared",
    });

    expect(collectExecutionIdentityIssues([
      { id: "current-work", coordination: registry },
    ])).toEqual([]);
  });

  it("never permits a handoff ID to be reused by another revision attempt", () => {
    const registry = createCoordinationRegistryV2Fixture();
    const first = registry.roomRuns[0]!;
    first.status = "superseded";
    registry.roomRuns.push({
      ...structuredClone(first),
      revisionAttempt: 1,
      status: "prepared",
    });

    expect(collectExecutionIdentityIssues([
      { id: "current-work", coordination: registry },
    ])).toContainEqual(expect.objectContaining({
      code: "COORDINATION_EXECUTION_IDENTITY_REUSED",
    }));
  });

  it("rejects the same PLAN and round identity on another Work record", () => {
    const first = createCoordinationRegistryV2Fixture();
    first.round.workId = "work-one";
    const second = createCoordinationRegistryV2Fixture();
    second.round.workId = "work-two";
    second.round.scopeId = "other-scope";
    second.round.scopeKeys = ["flowdoc:other-scope"];
    second.round.allowedFiles = ["other/"];
    second.integrationClaims[0]!.repositoryId = "other-repository";
    second.roomRuns[0]!.roomRunId = "other-room";
    second.roomRuns[0]!.dispatchSetId = "other-dispatch";
    second.roomRuns[0]!.expectedHandoffId = "other-handoff";
    second.roomRuns[0]!.locator.threadId = "other-thread";

    expect(validateCoordinationRegistries([
      { id: "work-one", coordination: first },
      { id: "work-two", coordination: second },
    ], new Map())).toContainEqual(expect.objectContaining({
      code: "COORDINATION_PLAN_ROUND_REUSED",
    }));
  });
});
