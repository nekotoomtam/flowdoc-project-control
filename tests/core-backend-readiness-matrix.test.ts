import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("FlowDoc Core Backend readiness matrix", () => {
  it("publishes a bounded readiness decision before frontend redesign without promoting product truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));

    expect(model.work.find((item) => item.id === "flowdoc-core-backend-readiness-matrix")).toMatchObject({
      workKind: "task",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "flowdoc",
      repositoryIds: ["repo-project-control", "repo-core", "repo-backend", "repo-editor"],
      workState: "in-review",
      activeRole: "cross-repo-boundary-reviewer",
      phaseIds: ["phase-flowdoc-core-backend-readiness-matrix"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "flowdoc-core-backend-readiness-matrix",
      ],
      requiredEvidence: ["evidence-flowdoc-core-backend-readiness-matrix-2026-08-27"],
    });
    expect(model.phases.find((item) => item.id === "phase-flowdoc-core-backend-readiness-matrix"))
      .toMatchObject({
        workId: "flowdoc-core-backend-readiness-matrix",
        phaseState: "done",
      });
    expect(model.checklists.find((item) => item.id === "checklist-flowdoc-core-backend-readiness-matrix")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);

    expect(model.nodes.find((node) => node.id === "flowdoc")?.truthState).toBe("planned");
    expect(model.nodes.find((node) => node.id === "core")?.truthState).toBe("unknown");
    expect(model.nodes.find((node) => node.id === "backend")?.truthState).toBe("unknown");
    expect(model.nodes.find((node) => node.id === "editor")?.truthState).toBe("unknown");

    const matrix = documents.get("doc-flowdoc-core-backend-readiness-matrix-2026-08-27");
    expect(matrix).toMatchObject({
      path: "docs/domains/flowdoc-core-backend-readiness-matrix-2026-08-27.md",
      nodeIds: ["flowdoc"],
      role: "verification",
      lifecycle: "active",
    });
    expect(normalize(matrix?.content)).toContain("NO-GO for frontend implementation that assumes production Backend readiness");
    expect(normalize(matrix?.content)).toContain("Backend document record");
    expect(normalize(matrix?.content)).toContain("Document package");
    expect(normalize(matrix?.content)).toContain("Core runtime node");
    expect(normalize(matrix?.content)).toContain("Core consumer surface freeze");
    expect(normalize(matrix?.content)).toContain("Backend service contract hardening");
    expect(normalize(matrix?.content)).toContain("Editor integration boundary before redesign");

    expect(evidence.get("evidence-flowdoc-core-backend-readiness-matrix-2026-08-27"))
      .toMatchObject({
        nodeIds: ["flowdoc"],
        repositoryId: "repo-project-control",
        pathOrContractId: "docs/domains/flowdoc-core-backend-readiness-matrix-2026-08-27.md",
      });
    expect(evidence.get("evidence-flowdoc-core-backend-readiness-matrix-2026-08-27")?.verificationSummary)
      .toContain("does not promote FlowDoc, Core, Backend, or Editor truth");
  });
});
