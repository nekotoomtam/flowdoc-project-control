import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { loadProjectState } from "./loadProjectState.js";

async function generatedModel(): Promise<any> {
  return JSON.parse(await readFile("generated/project-index.json", "utf8"));
}

function fetchModel(model: unknown): typeof fetch {
  return (async (input: string | URL | Request) => {
    const path = String(input);
    if (path.endsWith("project-diagnostics.json")) return new Response("", { status: 404 });
    return Response.json(model);
  }) as typeof fetch;
}

describe("loadProjectState workflow metadata", () => {
  it("rejects an invalid document context class", async () => {
    const model = await generatedModel();
    model.documents[0].contextClass = "archive-ish";
    expect(await loadProjectState(fetchModel(model))).toMatchObject({ kind: "diagnostic" });
  });

  it("rejects incomplete Evidence validity metadata", async () => {
    const model = await generatedModel();
    model.evidence[0].validity = { claim: "Incomplete" };
    expect(await loadProjectState(fetchModel(model))).toMatchObject({ kind: "diagnostic" });
  });

  it("rejects an ambiguous completion milestone", async () => {
    const model = await generatedModel();
    model.currentSnapshot = validSnapshot();
    model.governanceCost = validGovernanceCost();
    model.currentSnapshot.activeWork = [{
      workId: model.work[0].id,
      title: model.work[0].title,
      milestones: {
        planning: "complete",
        implementation: "done",
        verification: "pending",
        truthPromotion: "pending",
      },
    }];
    expect(await loadProjectState(fetchModel(model))).toMatchObject({ kind: "diagnostic" });
  });

  it("rejects negative governance metrics", async () => {
    const model = await generatedModel();
    model.currentSnapshot = validSnapshot();
    model.governanceCost = { ...validGovernanceCost(), reopenCount: -1 };
    expect(await loadProjectState(fetchModel(model))).toMatchObject({ kind: "diagnostic" });
  });

  it("rejects a non-blocking unknown in the critical list", async () => {
    const model = await generatedModel();
    model.currentSnapshot = {
      ...validSnapshot(),
      criticalUnknowns: [{ id: "accepted-risk", summary: "Known risk.", disposition: "accepted" }],
    };
    model.governanceCost = validGovernanceCost();
    expect(await loadProjectState(fetchModel(model))).toMatchObject({ kind: "diagnostic" });
  });
});

function validSnapshot() {
  return {
    generatedAt: "2026-09-24T00:00:00.000Z",
    currentGoal: null,
    currentBlocker: null,
    activeWork: [],
    acceptedTruth: [],
    criticalUnknowns: [],
    deferredWork: [],
    nextDecision: null,
    repositoryIds: [],
    authorityDocumentIds: [],
  };
}

function validGovernanceCost() {
  return {
    approximateContextTokens: 0,
    contextDocumentCount: 0,
    evidenceCreated: 0,
    durableDocumentsCreated: 0,
    implementationCommitCount: 0,
    reviewCycleCount: 0,
    reopenCount: 0,
  };
}
