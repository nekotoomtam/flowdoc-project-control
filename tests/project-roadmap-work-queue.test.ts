import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const timestamp = "2026-08-24T00:00:00.000Z";

const expectedWork = [
  {
    kind: "work",
    id: "agent-and-skill-design",
    title: "Agent and Skill Design",
    nodeId: "project-control",
    repositoryIds: ["repo-project-control"],
    workState: "queued",
    summary: "Define FlowDoc agent roles, capabilities, handoffs, and reusable skills after the documentation baseline is under control.",
    requiredEvidence: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    kind: "work",
    id: "core-documentation-family-closure",
    title: "Core Documentation Family Closure",
    nodeId: "core",
    repositoryIds: ["repo-core", "repo-project-control"],
    workState: "in-progress",
    summary: "Close migration coverage, repair references, review publication readiness, and decide cleanup for the four synthesized Core documentation families.",
    requiredEvidence: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    kind: "work",
    id: "core-remaining-documentation-synthesis",
    title: "Remaining Core Documentation Synthesis",
    nodeId: "core",
    repositoryIds: ["repo-core", "repo-project-control"],
    workState: "queued",
    summary: "Synthesize the remaining 293 Core source documents by identifying overview groups before producing bounded subject documents.",
    requiredEvidence: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    kind: "work",
    id: "flowdoc-product-development-resumption",
    title: "FlowDoc Product Development Resumption",
    nodeId: "flowdoc",
    repositoryIds: ["repo-project-control", "repo-core", "repo-editor", "repo-backend"],
    workState: "queued",
    summary: "Resume coordinated FlowDoc product development after the control and documentation baseline is usable across repositories.",
    requiredEvidence: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    kind: "work",
    id: "lane-worktree-reconciliation",
    title: "Lane Worktree Reconciliation",
    nodeId: "project-control",
    repositoryIds: ["repo-project-control"],
    workState: "in-review",
    summary: "Review the six lane branches that still contain separate commits, reconcile any retained value, and only then remove their worktrees.",
    requiredEvidence: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
] as const;

describe("project roadmap Work Queue", () => {
  it("publishes the five active roadmap cards without changing node truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));

    expect(model.work).toEqual(expectedWork);
    expect(model.nodes.find((node) => node.id === "core")).toMatchObject({
      truthState: "unknown",
      workIds: [
        "core-documentation-family-closure",
        "core-remaining-documentation-synthesis",
      ],
    });
    expect(model.nodes.find((node) => node.id === "project-control")).toMatchObject({
      truthState: "current",
      workIds: ["agent-and-skill-design", "lane-worktree-reconciliation"],
    });
    expect(model.nodes.find((node) => node.id === "flowdoc")).toMatchObject({
      truthState: "planned",
      workIds: [
        "flowdoc-product-development-resumption",
      ],
    });

    for (const work of model.work) {
      expect(work).not.toHaveProperty("blockedBy");
      expect(work).not.toHaveProperty("unblockOwner");
    }
  });

  it("anchors the cross-repository Project Control rollout to committed AGENTS.md pointers", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const flowdoc = model.nodes.find((node) => node.id === "flowdoc");
    const evidence = new Map(model.evidence.map((item) => [item.id, item]));

    expect(flowdoc?.truthState).toBe("planned");
    expect(model.work.some((item) => item.id === "cross-repository-project-control-rollout"))
      .toBe(false);
    expect(flowdoc?.evidenceIds).toEqual([
      "evidence-core-project-control-entrypoint",
      "evidence-editor-project-control-entrypoint",
      "evidence-backend-project-control-entrypoint",
    ]);
    expect(evidence.get("evidence-core-project-control-entrypoint")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-core",
      commit: "e7b848e657f8e08278780a663e868e88d54c59d6",
      pathOrContractId: "AGENTS.md",
    });
    expect(evidence.get("evidence-editor-project-control-entrypoint")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-editor",
      commit: "baa871c378a313e8f0c402ea33e3aa480953ce1f",
      pathOrContractId: "AGENTS.md",
    });
    expect(evidence.get("evidence-backend-project-control-entrypoint")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-backend",
      commit: "7ebb973b07962c35c627fb5bc2f2f7eafda2ea8a",
      pathOrContractId: "AGENTS.md",
    });
    for (const item of evidence.values()) {
      if (item.id.includes("project-control-entrypoint")) {
        expect(item.verificationSummary).toContain("Project Control entrypoint");
        expect(item.verificationSummary).toContain("BLOCKER stop condition");
      }
    }
  });
});
