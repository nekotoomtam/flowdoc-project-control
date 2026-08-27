import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("Core consumer surface freeze lane", () => {
  it("records the Core-owned consumer surface freeze without promoting broad Core truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));

    expect(model.work.find((item) => item.id === "core-consumer-surface-freeze"))
      .toMatchObject({
        workKind: "task",
        parentWorkId: "flowdoc-product-development-resumption",
        nodeId: "core",
        repositoryIds: ["repo-core", "repo-project-control"],
        workState: "in-review",
        activeRole: "cross-repo-boundary-reviewer",
        phaseIds: ["phase-core-consumer-surface-freeze"],
        workPathIds: [
          "flowdoc-product-development-resumption",
          "core-consumer-surface-freeze",
        ],
        requiredEvidence: ["evidence-core-consumer-surface-freeze-2026-08-27"],
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
        phaseState: "done",
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
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);

    expect(documents.get("doc-core-consumer-surface-freeze-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        path: "docs/domains/core-consumer-surface-freeze-2026-08-27.md",
        role: "verification",
      });
    expect(normalize(documents.get("doc-core-consumer-surface-freeze-2026-08-27")?.content))
      .toContain("VNEXT_CORE_CONSUMER_SURFACE_FREEZE");
    expect(normalize(documents.get("doc-core-consumer-surface-freeze-2026-08-27")?.content))
      .toContain("Future frontend redesign work must consume Backend document records or an Editor-owned adapter boundary");
    expect(normalize(documents.get("doc-core-consumer-surface-freeze-2026-08-27")?.content))
      .toContain("does not promote broad Core truth");

    expect(evidence.get("evidence-core-consumer-surface-freeze-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-core",
        commit: "5892df6e542a02b25ae3b18ee02a55842b83d48f",
        pathOrContractId: "src/schema/consumerSurface.ts#VNEXT_CORE_CONSUMER_SURFACE_FREEZE",
      });
    expect(evidence.get("evidence-core-consumer-surface-freeze-2026-08-27")?.verificationSummary)
      .toContain("supported-current-private-root");
    expect(evidence.get("evidence-core-consumer-surface-freeze-2026-08-27")?.verificationSummary)
      .toContain("does not promote broad Core truth");

    expect(model.nodes.find((node) => node.id === "core")).toMatchObject({
      truthState: "unknown",
      workIds: expect.arrayContaining(["core-consumer-surface-freeze"]),
    });
  });
});
