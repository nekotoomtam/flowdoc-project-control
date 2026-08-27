import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

describe("Core consumer surface freeze lane", () => {
  it("opens a Core-owned Work path before implementation without promoting broad Core truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));

    expect(model.work.find((item) => item.id === "core-consumer-surface-freeze"))
      .toMatchObject({
        workKind: "task",
        parentWorkId: "flowdoc-product-development-resumption",
        nodeId: "core",
        repositoryIds: ["repo-core", "repo-project-control"],
        workState: "in-progress",
        activeRole: "cross-repo-boundary-reviewer",
        phaseIds: ["phase-core-consumer-surface-freeze"],
        workPathIds: [
          "flowdoc-product-development-resumption",
          "core-consumer-surface-freeze",
        ],
        requiredEvidence: [],
      });

    expect(model.work.find((item) => item.id === "core-consumer-surface-freeze")?.contextDocumentIds)
      .toEqual(expect.arrayContaining([
        "doc-flowdoc-system-map",
        "doc-flowdoc-round-workflow",
        "doc-work-tree-operating-rules",
        "doc-flowdoc-product-terminology",
        "doc-flowdoc-product-terminology-th",
        "doc-flowdoc-core-backend-readiness-matrix-2026-08-27",
      ]));

    expect(model.phases.find((item) => item.id === "phase-core-consumer-surface-freeze"))
      .toMatchObject({
        workId: "core-consumer-surface-freeze",
        phaseState: "in-progress",
        repositoryIds: ["repo-core", "repo-project-control"],
        activeRole: "cross-repo-boundary-reviewer",
      });

    expect(model.checklists.find((item) => item.id === "checklist-core-consumer-surface-freeze")?.items
      .map((item) => item.id))
      .toEqual([
        "capture-work-context",
        "read-core-agreement",
        "write-core-red-test",
        "freeze-consumer-surface",
        "verify-core-gates",
        "record-project-control-evidence",
      ]);
    expect(model.checklists.find((item) => item.id === "checklist-core-consumer-surface-freeze")?.items
      .map((item) => item.state))
      .toEqual(["passed", "pending", "pending", "pending", "pending", "pending"]);

    expect(model.nodes.find((node) => node.id === "core")).toMatchObject({
      truthState: "unknown",
      workIds: expect.arrayContaining(["core-consumer-surface-freeze"]),
    });
  });
});
