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
    id: "cross-repository-project-control-rollout",
    title: "Cross-repository Project Control Rollout",
    nodeId: "flowdoc",
    repositoryIds: ["repo-project-control", "repo-core", "repo-editor", "repo-backend"],
    workState: "queued",
    summary: "Connect Core, Editor, and Backend to Project Control so this repository becomes the shared control surface and points to repository-owned implementation truth.",
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
  it("publishes the six approved roadmap cards without changing node truth", async () => {
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
        "cross-repository-project-control-rollout",
        "flowdoc-product-development-resumption",
      ],
    });

    for (const work of model.work) {
      expect(work).not.toHaveProperty("blockedBy");
      expect(work).not.toHaveProperty("unblockOwner");
    }
  });
});
