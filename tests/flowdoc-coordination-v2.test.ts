import { describe, expect, it } from "vitest";
import {
  CoordinationTransitionError,
  applyCoordinationCommand,
  assessCleanupEligibility,
} from "../src/model/coordination.js";
import type { CoordinationCleanupStateV2 } from "../src/model/types.js";
import { createCoordinationRegistryFixture } from "./fixtures/coordination-registry.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";

describe("self-contained coordination registry v2", () => {
  it("rejects every mutation against version 1", () => {
    expect(() => applyCoordinationCommand(createCoordinationRegistryFixture(), {
      type: "release-round",
      planTaskId: "plan-1",
      roundId: "legacy-round",
    })).toThrowError(expect.objectContaining({ code: "LEGACY_REGISTRY_READ_ONLY" }));
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

  it("rejects the removed ownership-transfer command", () => {
    expect(() => applyCoordinationCommand(createCoordinationRegistryV2Fixture(), {
      type: "transfer-ownership",
    } as never)).toThrowError(expect.objectContaining({ code: "OWNERSHIP_TRANSFER_REMOVED" }));
  });

  it("rejects unknown commands with a stable code", () => {
    expect(() => applyCoordinationCommand(createCoordinationRegistryV2Fixture(), {
      type: "resume-old-plan",
      planTaskId: "plan-2",
      roundId: "round-2",
    } as never)).toThrowError(expect.objectContaining({ code: "UNKNOWN_COMMAND" }));
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
