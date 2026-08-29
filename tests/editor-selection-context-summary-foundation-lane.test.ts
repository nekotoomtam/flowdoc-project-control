import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const editorCommit = "011debfbcf55891ff142302bbfdf301cee5160b5";
const workId = "editor-selection-context-summary-foundation";
const phaseId = "phase-editor-selection-context-summary-foundation";
const checklistId = "checklist-editor-selection-context-summary-foundation";
const documentId = "doc-editor-selection-context-summary-foundation-2026-08-29";
const evidenceId = "evidence-editor-selection-context-summary-foundation-2026-08-29";
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("Editor selection context summary foundation lane", () => {
  it("records the bounded Inspector summary UI without promoting Editor truth", async () => {
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
      "doc-editor-workspace-shell-foundation-2026-08-28",
      "doc-editor-read-source-authoring-status-2026-08-29",
      "doc-editor-selection-overlay-zoom-motion-sync-2026-08-29",
      documentId,
    ]));
    expect(work?.expectedOutput).toContain("selection context summary");
    expect(work?.expectedOutput).toContain("Heading");
    expect(work?.expectedOutput).toContain("Columns");
    expect(work?.expectedOutput).toContain("Authoring: limited");
    expect(work?.expectedOutput).toContain(editorCommit);
    expect(work?.expectedOutput).toContain(evidenceId);
    expect(work?.riskSummary).toContain("does not enable");

    expect(phase).toMatchObject({
      activeRole: "product-implementation-agent",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workId,
    });
    expect(phase?.verificationTarget).toContain(evidenceId);

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-selection-context-summary-scope",
      "define-selection-context-summary-boundary",
      "add-selection-summary-red-tests",
      "add-inspector-summary-component",
      "verify-editor-live-backend-summary-path",
      "keep-map-truth-unpromoted",
      "record-cleanup-risk",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true);

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-selection-context-summary-foundation-2026-08-29.md",
      role: "verification",
    });
    expect(normalize(document?.content)).toContain("selection context summary");
    expect(normalize(document?.content)).toContain("Selected block context");
    expect(normalize(document?.content)).toContain("Heading");
    expect(normalize(document?.content)).toContain("summary-columns");
    expect(normalize(document?.content)).toContain("does not enable WYSIWYG");
    expect(normalize(document?.content)).toContain(evidenceId);
    expect(normalize(document?.content)).toContain(editorCommit);
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/inspector/SelectionContextSummary.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/inspector/InspectorPanel.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/tests/selectionContextSummary.test.ts",
      },
    ]));

    expect(evidence).toMatchObject({
      commit: editorCommit,
      nodeIds: [],
      pathOrContractId: "src/tests/selectionContextSummary.test.ts",
      repositoryId: "repo-editor",
    });
    expect(evidence?.verificationSummary).toContain("selection context summary");
    expect(evidence?.verificationSummary).toContain("Focused RED");
    expect(evidence?.verificationSummary).toContain("307 passed");
    expect(evidence?.verificationSummary).toContain("Source: Backend read");
    expect(evidence?.verificationSummary).toContain("Authoring: limited");
    expect(evidence?.verificationSummary).toContain("does not promote");

    expect(model.nodes.find((node) => node.id === "editor")).toMatchObject({
      documentIds: [],
      evidenceIds: [],
      repositoryIds: ["repo-editor"],
      truthState: "unknown",
      workIds: [
        "editor-backend-unavailable-honesty-review",
        "editor-local-loopback-dev-runner",
        "editor-paper-smooth-zoom-anchor-fix",
        "editor-paper-smooth-zoom-surface",
        "editor-read-source-authoring-status",
        "editor-selection-context-summary-foundation",
        "editor-selection-overlay-zoom-motion-sync",
        "editor-workspace-editing-command-group-foundation",
        "editor-workspace-header-foundation",
        "editor-workspace-shell-redesign-foundation",
        "editor-workspace-status-strip-foundation",
        "editor-workspace-toolbar-foundation",
        "editor-workspace-view-tabs-foundation",
      ],
    });
  });
});
