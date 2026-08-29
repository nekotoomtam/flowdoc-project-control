import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const editorCommit = "2b711c87e4bb036fa2c172550093dbd4fddc91ac";
const workId = "editor-structure-panel-narrow-width-visibility";
const phaseId = "phase-editor-structure-panel-narrow-width-visibility";
const checklistId = "checklist-editor-structure-panel-narrow-width-visibility";
const documentId = "doc-editor-structure-panel-narrow-width-visibility-2026-08-29";
const evidenceId = "evidence-editor-structure-panel-narrow-width-visibility-2026-08-29";
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("Editor Structure panel narrow-width visibility lane", () => {
  it("records the narrow desktop Structure panel fix without promoting Editor truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const work = model.work.find((item) => item.id === workId);
    const phase = model.phases.find((item) => item.id === phaseId);
    const checklist = model.checklists.find((item) => item.id === checklistId);
    const document = model.documents.find((item) => item.id === documentId);
    const evidence = model.evidence.find((item) => item.id === evidenceId);

    expect(work).toMatchObject({
      activeRole: "product-implementation-agent",
      nodeId: "editor",
      parentWorkId: "flowdoc-product-development-resumption",
      phaseIds: [phaseId],
      repositoryIds: ["repo-editor", "repo-project-control", "repo-backend", "repo-core"],
      requiredEvidence: [evidenceId],
      workKind: "task",
      workPathIds: ["flowdoc-product-development-resumption", workId],
      workState: "in-review",
    });
    expect(work?.contextDocumentIds).toEqual(expect.arrayContaining([
      "doc-project-control-agent-onboarding",
      "doc-flowdoc-system-map",
      "doc-document-map-operating-rules",
      "doc-flowdoc-round-workflow",
      "doc-flowdoc-role-catalog",
      "doc-work-tree-operating-rules",
      "doc-flowdoc-product-terminology",
      "doc-flowdoc-product-terminology-th",
      "doc-editor-local-loopback-dev-runner-2026-08-28",
      "doc-editor-outline-scannability-foundation-2026-08-29",
      "doc-editor-creator-structure-add-affordance-foundation-2026-08-29",
      documentId,
    ]));
    expect(work?.expectedOutput).toContain("704px");
    expect(work?.expectedOutput).toContain("Structure panel");
    expect(work?.expectedOutput).toContain(editorCommit);
    expect(work?.expectedOutput).toContain(evidenceId);
    expect(work?.riskSummary).toContain("does not enable WYSIWYG");
    expect(work?.riskSummary).toContain("behavior remains intentionally unclaimed");

    expect(phase).toMatchObject({
      activeRole: "product-implementation-agent",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workId,
    });
    expect(phase?.verificationTarget).toContain(evidenceId);
    expect(phase?.summary).toContain("narrow desktop");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-narrow-structure-panel-scope",
      "reproduce-hidden-structure-panel",
      "add-narrow-width-red-test",
      "keep-structure-panel-visible",
      "verify-editor-narrow-live-backend-path",
      "keep-editor-truth-unpromoted",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true);

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-structure-panel-narrow-width-visibility-2026-08-29.md",
      role: "verification",
    });
    expect(normalize(document?.content)).toContain("Structure panel");
    expect(normalize(document?.content)).toContain("narrow desktop");
    expect(normalize(document?.content)).toContain("display: none");
    expect(normalize(document?.content)).toContain("workspaceGridColumns");
    expect(normalize(document?.content)).toContain("does not enable WYSIWYG");
    expect(normalize(document?.content)).toContain("behavior remains intentionally unclaimed");
    expect(normalize(document?.content)).toContain(evidenceId);
    expect(normalize(document?.content)).toContain(editorCommit);
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/styles/editor.css",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/tests/workspaceFrame.test.ts",
      },
    ]));

    expect(evidence).toMatchObject({
      commit: editorCommit,
      nodeIds: [],
      pathOrContractId: "src/tests/workspaceFrame.test.ts",
      repositoryId: "repo-editor",
    });
    expect(evidence?.verificationSummary).toContain("outlineDisplay grid");
    expect(evidence?.verificationSummary).toContain("workspaceGridColumns 280px 424px");
    expect(evidence?.verificationSummary).toContain("313 passed");
    expect(evidence?.verificationSummary).toContain("does not promote");

    expect(model.nodes.find((node) => node.id === "editor")).toMatchObject({
      documentIds: [],
      evidenceIds: [],
      repositoryIds: ["repo-editor"],
      truthState: "unknown",
    });
  });
});
