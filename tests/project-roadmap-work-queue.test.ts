import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const timestamp = "2026-08-24T00:00:00.000Z";

const expectedLegacyWork = [
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
] as const;

describe("project roadmap Work Queue", () => {
  it("publishes roadmap cards and the first executable Work path without changing node truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));

    expect(model.work).toHaveLength(expectedLegacyWork.length + 2);
    for (const work of expectedLegacyWork) {
      expect(model.work.find((item) => item.id === work.id)).toEqual(expect.objectContaining(work));
    }
    expect(model.work.find((item) => item.id === "project-control-hardening")).toMatchObject({
      workKind: "topic",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "project-control",
      childWorkIds: ["work-tree-phase-checklist-sqlite-contract"],
    });
    expect(model.work.find((item) => item.id === "work-tree-phase-checklist-sqlite-contract")).toMatchObject({
      workKind: "task",
      parentWorkId: "project-control-hardening",
      nodeId: "project-control",
      phaseIds: ["phase-work-tree-contract-validation"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "project-control-hardening",
        "work-tree-phase-checklist-sqlite-contract",
      ],
    });
    expect(model.phases.find((item) => item.id === "phase-work-tree-contract-validation")).toMatchObject({
      workId: "work-tree-phase-checklist-sqlite-contract",
      phaseState: "in-progress",
    });
    expect(model.checklists.find((item) => item.id === "checklist-work-tree-contract-validation")?.items)
      .toHaveLength(5);
    expect(model.nodes.find((node) => node.id === "core")).toMatchObject({
      truthState: "unknown",
      workIds: [
        "core-documentation-family-closure",
        "core-remaining-documentation-synthesis",
      ],
    });
    expect(model.nodes.find((node) => node.id === "project-control")).toMatchObject({
      truthState: "current",
      workIds: [
        "agent-and-skill-design",
        "project-control-hardening",
        "work-tree-phase-checklist-sqlite-contract",
      ],
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
    const indexedWork = model.work as Array<(typeof model.work)[number] & {
      phaseIds: string[];
      workPathIds: string[];
    }>;
    for (const work of indexedWork.filter((item) =>
      expectedLegacyWork.some((expected) => expected.id === item.id),
    )) {
      expect(work.workKind).toBeUndefined();
      expect(work.phaseIds).toEqual([]);
      expect(work.workPathIds).toEqual([work.id]);
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
