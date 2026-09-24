import { describe, expect, it } from "vitest";
import {
  CoordinationTransitionError,
  applyCoordinationCommand as applyVersionedCoordinationCommand,
  assessCleanupEligibility,
  canonicalPayloadDigest,
} from "../src/model/coordination.js";
import { applyCoordinationV2Command as applyCoordinationCommand } from "../src/model/coordination-v2.js";
import type {
  CoordinationCleanupStateV2,
  CoordinationTerminalPayloadV2,
} from "../src/model/types.js";
import { createCoordinationRegistryFixture } from "./fixtures/coordination-registry.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";

describe("self-contained coordination registry v2", () => {
  const payload = (roundId = "round-2"): CoordinationTerminalPayloadV2 => ({
    planTaskId: "plan-2",
    roundId,
    roomRunId: "pilot-v2-room",
    laneId: "pilot-v2-lane",
    ownerRepositoryId: "project-control",
    revisionAttempt: 0,
    status: "PASS",
    behaviorChanged: false,
    behaviorSummary: "No behavior change.",
    changedFiles: [],
    tests: ["focused"],
    evidenceIds: [],
    risks: [],
    unknowns: [],
  });

  it("rejects every mutation against version 1", () => {
    expect(() => applyVersionedCoordinationCommand(createCoordinationRegistryFixture(), {
      type: "release-round",
      planTaskId: "plan-1",
      roundId: "legacy-round",
    })).toThrowError(expect.objectContaining({ code: "HISTORICAL_REGISTRY_READ_ONLY" }));
  });

  it("rejects a command from another PLAN or round without mutation", () => {
    const registry = createCoordinationRegistryV2Fixture();
    expect(() => applyCoordinationCommand(registry, {
      type: "activate-room",
      planTaskId: "wrong-plan",
      roundId: "wrong-round",
      roomRunId: "pilot-v2-room",
      revisionAttempt: 0,
    })).toThrowError(expect.objectContaining({ code: "PLAN_ROUND_MISMATCH" }));
    expect(registry.revision).toBe(0);
    expect(registry.roomRuns[0]!.status).toBe("prepared");
  });

  it("allows revision only inside the same active PLAN round", () => {
    const registry = createCoordinationRegistryV2Fixture();
    registry.roomRuns[0]!.status = "superseded";
    const revised = applyCoordinationCommand(registry, {
      type: "authorize-revision",
      planTaskId: "plan-2",
      roundId: "round-2",
      roomRunId: "pilot-v2-room",
      priorAttempt: 0,
      expectedHandoffId: "pilot-v2-room-r1",
      livenessDeadline: "2026-09-21T16:30:00.000Z",
    });
    expect(revised.roomRuns.at(-1)).toMatchObject({
      roundId: "round-2",
      revisionAttempt: 1,
      status: "prepared",
    });
  });

  it("rejects unknown commands with a stable code", () => {
    expect(() => applyCoordinationCommand(createCoordinationRegistryV2Fixture(), {
      type: "resume-old-plan",
      planTaskId: "plan-2",
      roundId: "round-2",
    } as never)).toThrowError(expect.objectContaining({ code: "UNKNOWN_COMMAND" }));
  });

  it("rejects a terminal payload from another round without rewriting it", () => {
    const registry = createCoordinationRegistryV2Fixture();
    registry.roomRuns[0]!.status = "active";
    const wrongRoundPayload = payload("old-round");
    expect(() => applyCoordinationCommand(registry, {
      type: "record-send",
      planTaskId: "plan-2",
      roundId: "round-2",
      handoffId: "pilot-v2-room-r0",
      payload: wrongRoundPayload,
      outcome: "sent",
      attemptedAt: "2026-09-21T07:01:00.000Z",
    })).toThrowError(expect.objectContaining({ code: "PLAN_ROUND_MISMATCH" }));
    expect(wrongRoundPayload.roundId).toBe("old-round");
    expect(registry.handoffs).toEqual([]);
  });

  it("stores the digest of the actual version 2 payload", () => {
    const registry = createCoordinationRegistryV2Fixture();
    registry.roomRuns[0]!.status = "active";
    const terminalPayload = payload();
    const sent = applyCoordinationCommand(registry, {
      type: "record-send",
      planTaskId: "plan-2",
      roundId: "round-2",
      handoffId: "pilot-v2-room-r0",
      payload: terminalPayload,
      outcome: "sent",
      attemptedAt: "2026-09-21T07:01:00.000Z",
    });
    expect(sent.handoffs[0]!.payloadDigest).toBe(canonicalPayloadDigest(terminalPayload));
  });

  it("never reactivates a released round", () => {
    const registry = createCoordinationRegistryV2Fixture();
    registry.roomRuns[0]!.status = "closed";
    const released = applyCoordinationCommand(registry, {
      type: "release-round",
      planTaskId: "plan-2",
      roundId: "round-2",
    });
    expect(released.round.state).toBe("released");
    expect(() => applyCoordinationCommand(released, {
      type: "activate-room",
      planTaskId: "plan-2",
      roundId: "round-2",
      roomRunId: "pilot-v2-room",
      revisionAttempt: 0,
    })).toThrowError(CoordinationTransitionError);
  });

  it("keeps cleanup authority inside the same PLAN round", () => {
    const candidate: CoordinationCleanupStateV2 = {
      repositoryId: "project-control",
      worktreePath: "C:/worktrees/current-round",
      branch: "codex/current-round",
      planTaskId: "plan-2",
      roundId: "round-2",
      executor: "plan-2",
      preflightEvidenceIds: ["evidence-cleanup"],
      preflightSources: {
        cleanliness: "git status --short",
        merge: "git merge-base --is-ancestor",
        worktreeGate: "npm run check",
        mainGate: "npm run check",
        liveProcess: "no live process",
      },
      currentRound: true,
      worktreeClean: true,
      merged: true,
      worktreeGate: "passed",
      mainGate: "passed",
      liveProcessClear: true,
      disposition: "eligible",
    };
    const context = {
      planTaskId: "plan-2",
      roundId: "round-2",
      roundState: "active" as const,
      integrationClaims: createCoordinationRegistryV2Fixture().integrationClaims,
      evidenceById: new Map([[
        "evidence-cleanup",
        { repositoryId: "project-control", commit: "b".repeat(40) },
      ]]),
    };

    expect(assessCleanupEligibility(candidate, context)).toEqual({ eligible: true, reasons: [] });
    expect(assessCleanupEligibility({ ...candidate, roundId: "old-round" }, context).reasons)
      .toContain("CLEANUP_ROUND_MISMATCH");
  });
});
