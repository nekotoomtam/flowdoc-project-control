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
  it("keeps inline delivery pending without inventing a WORK room", () => {
    const source = inlineDeliveryFixture();
    expect(buildCompletionMilestones(source)).toMatchObject({ implementation: "pending", verification: "pending" });
  });

  it("completes inline implementation and verification from a done phase and supported acceptance", () => {
    const source = inlineDeliveryFixture();
    source.phases[0]!.phaseState = "done";
    source.checklists[0]!.items[0]!.state = "passed";
    expect(buildCompletionMilestones(source)).toMatchObject({ implementation: "complete", verification: "complete" });
  });

  it.each(["missing-checklist", "empty-checklist", "unsupported-pass"])("does not claim inline verification with %s", (gap) => {
    const source = inlineDeliveryFixture();
    source.phases[0]!.phaseState = "done";
    source.checklists[0]!.items[0]!.state = "passed";
    if (gap === "missing-checklist") source.checklists = [];
    if (gap === "empty-checklist") source.checklists[0]!.items = [];
    if (gap === "unsupported-pass") delete source.checklists[0]!.items[0]!.verificationNote;
    expect(buildCompletionMilestones(source).verification).toBe("pending");
  });

  it("does not infer completed implementation from an unclassified review phase", () => {
    const source = inlineDeliveryFixture();
    source.phases[0]!.activeRole = "cross-repo-boundary-reviewer";
    source.phases[0]!.phaseState = "done";
    source.checklists[0]!.items[0]!.state = "passed";
    expect(buildCompletionMilestones(source)).toMatchObject({ implementation: "pending", verification: "pending" });
  });

  it("separates completed inline implementation from outstanding verification", () => {
    const source = inlineDeliveryFixture();
    source.phases[0]!.phaseState = "done";
    source.checklists[0]!.items[0]!.state = "passed";
    source.phases.push({ ...source.phases[0]!, id: "verify", activeRole: "evidence-reviewer", phaseState: "blocked" });
    source.checklists.push({ ...structuredClone(source.checklists[0]!), id: "verify-checklist", phaseId: "verify" });
    source.checklists[1]!.items[0]!.state = "blocked";
    expect(buildCompletionMilestones(source)).toMatchObject({ implementation: "complete", verification: "pending" });
    source.phases[1]!.phaseState = "done";
    source.checklists[1]!.items[0]!.state = "passed";
    expect(buildCompletionMilestones(source)).toMatchObject({ implementation: "complete", verification: "complete" });
  });

  it("keeps the canonical released integration delivery pending without rewriting its history", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    expect(buildCompletionMilestones({ ...model, generatedAt: model.currentSnapshot.generatedAt }, "flowdoc-editor-core-integration-20260928"))
      .toMatchObject({ implementation: "pending", verification: "pending" });
  });
  it("does not label planning-only completion as implementation complete", () => {
    expect(buildCompletionMilestones(planningOnlyFixture())).toEqual({
      planning: "complete",
      implementation: "not-required",
      verification: "not-required",
      truthPromotion: "pending",
    });
  });
});

function inlineDeliveryFixture() {
  const source = planningOnlyFixture();
  source.phases[0]!.title = "Implement bounded change";
  source.phases[0]!.activeRole = "product-implementation-agent";
  source.phases[0]!.phaseState = "blocked";
  source.checklists[0]!.items[0]!.state = "blocked";
  source.checklists[0]!.items[0]!.verificationNote = "Focused behavior and acceptance verified.";
  return source;
}

describe("Current Truth Snapshot", () => {
  it("builds the snapshot without historical authority", () => {
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

  it("keeps closed unresolved rounds discoverable without letting them own the active goal", () => {
    const source = projectFixture();
    const registry = source.work[0]!.coordination!;
    if (registry.version !== 3) throw new Error("expected V3");
    registry.round.state = "released";
    const snapshot = buildCurrentTruthSnapshot(source);
    expect(snapshot.activeWork.map(({ workId }) => workId)).toEqual(["active-a", "active-b"]);
    expect(snapshot).toMatchObject({
      currentGoal: "First deterministic tie.",
      nextDecision: null,
      unresolvedWork: [expect.objectContaining({ workId: "blocked-delivery", roundState: "released" })],
    });
    expect(snapshot.criticalUnknowns).toContainEqual(expect.objectContaining({ id: "unknown-blocking" }));
    expect(buildGovernanceCostSnapshot(source)).toMatchObject({ selectedWorkId: "active-a" });
  });

  it("does not use a different Work's unknown to steer the primary decision", () => {
    const source = projectFixture();
    source.work[0]!.workState = "queued";
    const snapshot = buildCurrentTruthSnapshot(source);
    expect(snapshot.currentGoal).toBe("First deterministic tie.");
    expect(snapshot.currentBlocker).toBeNull();
    expect(snapshot.nextDecision).toBeNull();
    expect(snapshot.criticalUnknowns).toHaveLength(1);
  });

  it("uses reviewed BLOCKER dispositions but never accepts a rejected return's unknown claims", () => {
    const source = returnedWorkFixture();
    const registry = source.work[0]!.coordination!;
    if (registry.version !== 3) throw new Error("expected V3");
    registry.roomRuns = registry.roomRuns.slice(0, 1);
    const handoff = registry.handoffs[0]!;
    handoff.payload.status = "BLOCKER";
    handoff.payload.completion.remainingUnknowns = [{ id: "unknown-blocking", summary: "Scoped out after review", disposition: "irrelevant" }];
    handoff.acceptance.status = "rejected";
    expect(buildCurrentTruthSnapshot(source).criticalUnknowns).toHaveLength(1);
    handoff.acceptance.status = "blocked";
    expect(buildCurrentTruthSnapshot(source).criticalUnknowns).toHaveLength(0);
    registry.roomRuns.push({ ...structuredClone(registry.roomRuns[0]!), revisionAttempt: 1,
      packet: { ...structuredClone(registry.roomRuns[0]!.packet), unknowns: [{ id: "unknown-blocking", summary: "New attempt needs authority", disposition: "blocking" }] } });
    expect(buildCurrentTruthSnapshot(source).criticalUnknowns).toEqual([
      { id: "unknown-blocking", summary: "New attempt needs authority", disposition: "blocking" },
    ]);
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
    source.phases.push(
      { ...source.phases[1]!, id: "phase-queued-a", workId: "queued-a" },
      { ...source.phases[1]!, id: "phase-queued-b", workId: "queued-b" },
      { ...source.phases[1]!, id: "phase-queued-c", workId: "queued-c" },
    );

    const snapshot = buildCurrentTruthSnapshot(source);
    expect(snapshot.activeWork).toHaveLength(5);
    expect(snapshot.activeWork.map(({ workId }) => workId)).not.toContain("queued-c");
  });

  it("omits legacy Work whose phases and checklist obligations are complete", () => {
    const source = projectFixture();
    source.phases.find(({ id }) => id === "phase-active-a")!.phaseState = "done";
    source.checklists.push({
      kind: "checklist",
      id: "checklist-active-a-complete",
      phaseId: "phase-active-a",
      title: "Completed planning checklist",
      items: [{
        id: "accepted",
        label: "Record the accepted plan.",
        state: "passed",
        evidenceTarget: "Owner acceptance.",
        verificationNote: "Accepted.",
      }],
      createdAt: "2026-09-23T00:00:00.000Z",
      updatedAt: "2026-09-24T00:00:00.000Z",
    });

    expect(buildCurrentTruthSnapshot(source).activeWork.map(({ workId }) => workId))
      .toEqual(["blocked-delivery", "active-b"]);
  });

  it("surfaces a blocked phase from the primary active Work as the current blocker", () => {
    const source = projectFixture();
    source.work = source.work.filter(({ id }) => id !== "blocked-delivery");
    const phase = source.phases.find(({ id }) => id === "phase-active-a")!;
    phase.phaseState = "blocked";
    phase.summary = "Required upstream proof is unavailable.";

    expect(buildCurrentTruthSnapshot(source)).toMatchObject({
      currentGoal: "First deterministic tie.",
      currentBlocker: "Required upstream proof is unavailable.",
      nextDecision: "Resolve: Required upstream proof is unavailable.",
    });
  });

  it("omits phase-less containers from the active Work list", () => {
    const source = projectFixture();
    source.work.push({
      kind: "work",
      id: "historical-container",
      title: "Historical Container",
      nodeId: "flowdoc",
      workKind: "topic",
      repositoryIds: ["repo-project-control"],
      workState: "in-progress",
      summary: "Groups completed child Work.",
      requiredEvidence: [],
      createdAt: "2026-09-23T00:00:00.000Z",
      updatedAt: "2026-09-24T01:00:00.000Z",
    });

    expect(buildCurrentTruthSnapshot(source).activeWork.map(({ workId }) => workId))
      .not.toContain("historical-container");
  });
});

describe("governance cost snapshot", () => {
  it("derives informational cost from selected context and accepted V3 completion", () => {
    const source = returnedWorkFixture();

    expect(buildGovernanceCostSnapshot(source)).toMatchObject({
      approximateContextTokens: 5,
      contextDocumentCount: 1,
      evidenceCreated: 2,
      durableDocumentsCreated: 1,
      implementationCommitCount: 3,
      reviewCycleCount: 2,
      reopenCount: 1,
    });
  });
  it("counts received BLOCKER work and deduplicates artifacts across review attempts", () => {
    const source = returnedWorkFixture();
    const registry = source.work[0]!.coordination!;
    if (registry.version !== 3) throw new Error("expected V3");
    const handoff = registry.handoffs[0]!;
    handoff.payload.status = "BLOCKER";
    handoff.acceptance.status = "blocked";
    registry.handoffs.push(structuredClone(handoff), { ...structuredClone(handoff), handoffId: "second-attempt", payload: { ...structuredClone(handoff.payload), revisionAttempt: 1 } });
    expect(buildGovernanceCostSnapshot(source)).toMatchObject({
      evidenceCreated: 2, durableDocumentsCreated: 1,
      implementationCommitCount: 6, reviewCycleCount: 4,
      attribution: expect.objectContaining({ declaredEvidenceIds: ["evidence-a", "evidence-b"] }),
    });
  });

  it("reports commit-matched PLAN receipts as a proxy, excluding input evidence", () => {
    const source = returnedWorkFixture();
    const work = source.work[0]!;
    const registry = work.coordination!;
    if (registry.version !== 3) throw new Error("expected V3");
    const handoff = registry.handoffs[0]!;
    handoff.payload.completion.createdEvidenceIds = [];
    const receipt = { ...source.evidence[0]!, id: "plan-receipt", commit: handoff.payload.exactCommit! };
    source.evidence.push(receipt, { ...receipt, id: "input-proof" });
    work.requiredEvidence.push("plan-receipt", "input-proof");
    registry.roomRuns[0]!.packet.relevantEvidenceIds.push("input-proof");
    expect(buildGovernanceCostSnapshot(source)).toMatchObject({
      evidenceCreated: 1,
      attribution: { commitMatchedEvidenceIds: ["plan-receipt"], reusedEvidenceIds: expect.arrayContaining(["input-proof"]) },
    });
  });

  it("does not reclassify round-produced evidence as inherited when a later room reuses it", () => {
    const source = returnedWorkFixture();
    const work = source.work[0]!;
    const registry = work.coordination!;
    if (registry.version !== 3) throw new Error("expected V3");
    const handoff = registry.handoffs[0]!;
    handoff.payload.completion.createdEvidenceIds = [];
    const receipt = { ...source.evidence[0]!, id: "plan-receipt", commit: handoff.payload.exactCommit! };
    source.evidence.push(receipt);
    work.requiredEvidence.push(receipt.id);
    registry.roomRuns.push({ ...structuredClone(registry.roomRuns[0]!), roomRunId: "later-room",
      packet: { ...structuredClone(registry.roomRuns[0]!.packet), relevantEvidenceIds: [receipt.id] } });
    expect(buildGovernanceCostSnapshot(source)).toMatchObject({ evidenceCreated: 1,
      attribution: { commitMatchedEvidenceIds: [receipt.id] } });
  });

});

describe("generated read model", () => {
  it("attributes canonical lifecycle/ordinary receipts and the blocked Stage6 return", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const source = { ...model, generatedAt: model.currentSnapshot.generatedAt };
    expect(buildGovernanceCostSnapshot(source, "flowdoc-core-lifecycle-20260928"))
      .toMatchObject({ evidenceCreated: 2, attribution: { reusedEvidenceIds: expect.any(Array) } });
    expect(buildGovernanceCostSnapshot(source, "flowdoc-core-stage6-ordinary-complete-20260927"))
      .toMatchObject({ evidenceCreated: 3, attribution: { reusedEvidenceIds: [
        "evidence-core-stage6-ordinary-tail-20260927", "evidence-core-stage6-seam-repair-20260927",
      ] } });
    expect(buildGovernanceCostSnapshot(source, "flowdoc-core-stage6-20260927"))
      .toMatchObject({ evidenceCreated: 1, implementationCommitCount: 1, reviewCycleCount: 2 });
  });

  it("embeds a generated snapshot and governance metrics", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const model = await buildProjectReadModel(
      await loadAndValidateProject(root),
      "2026-09-24T02:00:00.000Z",
    );

    expect(model.currentSnapshot.generatedAt).toBe("2026-09-24T02:00:00.000Z");
    expect(model.currentSnapshot.activeWork.map(({ workId }) => workId)).toEqual(["pilot-task"]);
    expect(model.governanceCost).toMatchObject({
      contextDocumentCount: 1,
      evidenceCreated: 0,
      reopenCount: 0,
    });
  });
});

function returnedWorkFixture() {
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

  return source;
}
