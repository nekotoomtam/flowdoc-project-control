import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc product terminology foundation", () => {
  it("publishes terminology as governed Work context before Editor redesign", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));

    const work = model.work.find((item) => item.id === "flowdoc-product-terminology-foundation");
    expect(work).toMatchObject({
      workKind: "task",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "flowdoc",
      repositoryIds: ["repo-project-control"],
      workState: "in-review",
      activeRole: "documentation-synthesizer",
      phaseIds: ["phase-flowdoc-product-terminology-foundation"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "flowdoc-product-terminology-foundation",
      ],
      requiredEvidence: ["evidence-flowdoc-product-terminology-foundation-2026-08-27"],
    });
    expect(work?.contextDocumentIds).toEqual(expect.arrayContaining([
      "doc-flowdoc-global-codex-guidance",
      "doc-flowdoc-round-workflow",
      "doc-flowdoc-product-terminology",
      "doc-flowdoc-product-terminology-th",
    ]));

    expect(model.phases.find((item) => item.id === "phase-flowdoc-product-terminology-foundation"))
      .toMatchObject({
        workId: "flowdoc-product-terminology-foundation",
        phaseState: "done",
        activeRole: "documentation-synthesizer",
      });
    expect(model.checklists.find((item) => item.id === "checklist-flowdoc-product-terminology-foundation")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);

    expect(documents.get("doc-flowdoc-product-terminology")).toMatchObject({
      path: "docs/domains/flowdoc-product-terminology.md",
      nodeIds: ["flowdoc"],
      role: "glossary",
      lifecycle: "active",
    });
    expect(documents.get("doc-flowdoc-product-terminology-th")).toMatchObject({
      path: "docs/domains/flowdoc-product-terminology-th.md",
      nodeIds: ["flowdoc"],
      role: "glossary",
      lifecycle: "active",
    });

    const productTerminology = normalize(documents.get("doc-flowdoc-product-terminology")?.content);
    expect(productTerminology).toContain("Ambiguity disposition");
    expect(productTerminology).toContain("Do not promote FlowDoc product truth from terminology alone");
    expect(productTerminology).toContain("Document package");
    expect(productTerminology).toContain("Backend document record");
    expect(productTerminology).toContain("Editor draft");
    expect(productTerminology).toContain("Core runtime node");

    expect(evidence.get("evidence-flowdoc-product-terminology-foundation-2026-08-27"))
      .toMatchObject({
        nodeIds: ["flowdoc"],
        repositoryId: "repo-project-control",
        pathOrContractId: "docs/domains/flowdoc-product-terminology.md",
      });
    expect(evidence.get("evidence-flowdoc-product-terminology-foundation-2026-08-27")?.verificationSummary)
      .toContain("does not promote product readiness");

    const flowdoc = model.nodes.find((node) => node.id === "flowdoc");
    expect(flowdoc?.truthState).toBe("planned");
    expect(flowdoc?.documentIds).toEqual(expect.arrayContaining([
      "doc-flowdoc-product-terminology",
      "doc-flowdoc-product-terminology-th",
    ]));
    expect(flowdoc?.workIds).toContain("flowdoc-product-terminology-foundation");
    expect(flowdoc?.evidenceIds).toContain("evidence-flowdoc-product-terminology-foundation-2026-08-27");

    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);
    expect(globalGuidance).toContain("docs/domains/flowdoc-product-terminology.md");
    expect(globalGuidance).toContain("define, split, rename, deprecated, context-only, or blocked");
  });
});
