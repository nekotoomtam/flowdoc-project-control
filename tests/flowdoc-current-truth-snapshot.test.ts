import { describe, expect, it } from "vitest";
import {
  buildCompletionMilestones,
  buildCurrentTruthSnapshot,
  buildGovernanceCostSnapshot,
} from "../src/model/current-truth-snapshot.js";
import type { CoordinationHandoffV3 } from "../src/model/types.js";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";
import { createProjectFixture } from "./fixtures/project-source.js";
import { planningOnlyFixture, projectFixture } from "./fixtures/project-source.js";

describe("completion milestones", () => {
  it("does not label planning-only completion as implementation complete", () => {
    expect(buildCompletionMilestones(planningOnlyFixture())).toEqual({
      planning: "complete",
      implementation: "not-required",
      verification: "not-required",
      truthPromotion: "pending",
    });
  });
});

describe("Current Truth Snapshot", () => {
  it("builds the eight-field snapshot without historical authority", () => {
    const snapshot = buildCurrentTruthSnapshot(projectFixture());
    expect(snapshot).toMatchObject({
      generatedAt: "2026-09-24T01:00:00.000Z",
      currentGoal: "Resolve the blocked delivery safely.",
      currentBlocker: "Required authority is missing.",
      activeWork: expect.any(Array),
      acceptedTruth: [{ nodeId: "flowdoc", evidenceIds: ["evidence-current"] }],
      criticalUnknowns: [expect.objectContaining({ id: "unknown-blocking" })],
      deferredWork: [expect.objectContaining({ id: "unknown-deferred" })],
      nextDecision: "Choose the authority owner.",
      repositoryIds: ["repo-project-control"],
    });
    expect(snapshot.authorityDocumentIds).toEqual(["doc-current"]);
  });

  it("orders active Work by state, updated time, and ID", () => {
    expect(buildCurrentTruthSnapshot(projectFixture()).activeWork.map(({ workId }) => workId))
      .toEqual(["blocked-delivery", "active-a", "active-b"]);
  });

  it("returns a truthful empty snapshot when no Work is active", () => {
    const source = projectFixture();
    source.work = [];
    expect(buildCurrentTruthSnapshot(source)).toMatchObject({
      currentGoal: null,
      currentBlocker: null,
      activeWork: [],
      nextDecision: null,
      repositoryIds: [],
    });
  });

  it("keeps the generated entrypoint bounded while detailed Work remains available", () => {
    const source = projectFixture();
    const template = source.work[2]!;
    source.work.push(
      { ...template, id: "queued-a", title: "Queued A", workState: "queued" },
      { ...template, id: "queued-b", title: "Queued B", workState: "queued" },
      { ...template, id: "queued-c", title: "Queued C", workState: "queued" },
    );

    const snapshot = buildCurrentTruthSnapshot(source);
    expect(snapshot.activeWork).toHaveLength(5);
    expect(snapshot.activeWork.map(({ workId }) => workId)).not.toContain("queued-c");
  });
});

describe("governance cost snapshot", () => {
  it("derives informational cost from selected context and accepted V3 completion", () => {
    const source = projectFixture();
    const registry = source.work[0]!.coordination!;
    if (registry.version !== 3) throw new Error("expected version 3 fixture");
    const room = registry.roomRuns[0]!;
    room.status = "accepted";
    const completion = {
      behaviorChanged: "Built the cockpit.",
      proof: [{ kind: "test" as const, reference: "focused" }],
      remainingUnknowns: [],
      downstreamInformation: "Read the snapshot first.",
      changedFiles: ["src/model/current-truth-snapshot.ts"],
      createdEvidenceIds: ["evidence-a", "evidence-b"],
      createdDocumentIds: ["doc-a"],
      reviewCyclesUsed: 2,
      implementationCommitCount: 3,
    };
    registry.handoffs.push({
      handoffId: room.expectedHandoffId,
      payloadDigest: "digest",
      payload: {
        planTaskId: registry.round.planTaskId,
        roundId: registry.round.roundId,
        roomRunId: room.roomRunId,
        laneId: room.laneId,
        ownerRepositoryId: room.ownerRepositoryId,
        revisionAttempt: 0,
        status: "PASS",
        behaviorChanged: true,
        behaviorSummary: "Built the cockpit.",
        exactCommit: "b".repeat(40),
        changedFiles: completion.changedFiles,
        tests: ["focused"],
        evidenceIds: completion.createdEvidenceIds,
        risks: [],
        unknowns: [],
        completion,
      },
      transport: { status: "sent", attempts: 1, attemptHistory: [] },
      receipt: { status: "received", receivedAt: "2026-09-24T00:45:00.000Z" },
      acceptance: {
        status: "accepted",
        reviewer: registry.round.planTaskId,
        reviewedAt: "2026-09-24T00:50:00.000Z",
        evidenceIds: [],
        requiredChecks: [{ name: "focused", status: "passed" }],
        remainingScope: [],
      },
    } satisfies CoordinationHandoffV3);
    registry.roomRuns.push({
      ...structuredClone(room),
      revisionAttempt: 1,
      expectedHandoffId: "reopened-handoff",
      status: "prepared",
    });

    expect(buildGovernanceCostSnapshot(source)).toEqual({
      approximateContextTokens: 5,
      contextDocumentCount: 1,
      evidenceCreated: 2,
      durableDocumentsCreated: 1,
      implementationCommitCount: 3,
      reviewCycleCount: 2,
      reopenCount: 1,
    });
  });
});

describe("generated read model", () => {
  it("embeds a generated snapshot and governance metrics", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const model = await buildProjectReadModel(
      await loadAndValidateProject(root),
      "2026-09-24T02:00:00.000Z",
    );

    expect(model.currentSnapshot.generatedAt).toBe("2026-09-24T02:00:00.000Z");
    expect(model.currentSnapshot.activeWork.map(({ workId }) => workId)).toEqual(["pilot-task", "pilot"]);
    expect(model.governanceCost).toMatchObject({
      contextDocumentCount: 1,
      evidenceCreated: 0,
      reopenCount: 0,
    });
  });
});
