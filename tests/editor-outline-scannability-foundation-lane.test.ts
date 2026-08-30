import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const editorCommit = "f45512f2667d066553b7ffaedfdc85d2c6e1392f";
const workId = "editor-outline-scannability-foundation";
const phaseId = "phase-editor-outline-scannability-foundation";
const checklistId = "checklist-editor-outline-scannability-foundation";
const documentId = "doc-editor-outline-scannability-foundation-2026-08-29";
const evidenceId = "evidence-editor-outline-scannability-foundation-2026-08-29";
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("Editor Outline scannability foundation lane", () => {
  it("records the bounded Outline scannability layer without promoting Editor truth", async () => {
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
      "doc-editor-inspector-detail-navigation-foundation-2026-08-29",
      documentId,
    ]));
    expect(work?.expectedOutput).toContain("Outline summary");
    expect(work?.expectedOutput).toContain("data-outline-type");
    expect(work?.expectedOutput).toContain("summary-columns");
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
      "capture-outline-scannability-scope",
      "define-outline-presentation-boundary",
      "add-outline-scannability-red-tests",
      "add-outline-summary-and-cues",
      "verify-editor-live-backend-outline-path",
      "keep-map-truth-unpromoted",
      "record-risk-and-unknowns",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true);

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-outline-scannability-foundation-2026-08-29.md",
      role: "verification",
    });
    expect(normalize(document?.content)).toContain("Outline summary");
    expect(normalize(document?.content)).toContain("Text 1");
    expect(normalize(document?.content)).toContain("Columns 1");
    expect(normalize(document?.content)).toContain("Table 1");
    expect(normalize(document?.content)).toContain("summary-columns");
    expect(normalize(document?.content)).toContain("does not enable WYSIWYG");
    expect(normalize(document?.content)).toContain(".worktrees/editor-outline-scannability-foundation");
    expect(normalize(document?.content)).toContain("could not be removed");
    expect(normalize(document?.content)).toContain(evidenceId);
    expect(normalize(document?.content)).toContain(editorCommit);
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/outline/OutlinePanel.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/styles/editor.css",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/tests/outlineScannability.test.ts",
      },
    ]));

    expect(evidence).toMatchObject({
      commit: editorCommit,
      nodeIds: [],
      pathOrContractId: "src/tests/outlineScannability.test.ts",
      repositoryId: "repo-editor",
    });
    expect(evidence?.verificationSummary).toContain("Outline summary");
    expect(evidence?.verificationSummary).toContain("Focused RED");
    expect(evidence?.verificationSummary).toContain("310 passed");
    expect(evidence?.verificationSummary).toContain("summary-columns");
    expect(evidence?.verificationSummary).toContain("does not promote");

    expect(model.nodes.find((node) => node.id === "editor")).toMatchObject({
      documentIds: [],
      evidenceIds: [],
      repositoryIds: ["repo-editor"],
      truthState: "unknown",
      workIds: [
        "editor-backend-unavailable-honesty-review",
        "editor-creator-structure-add-affordance-foundation",
        "editor-inspector-detail-navigation-foundation",
        "editor-live-backend-rich-inline-harness",
        "editor-local-loopback-dev-runner",
        "editor-outline-scannability-foundation",
        "editor-paper-smooth-zoom-anchor-fix",
        "editor-paper-smooth-zoom-surface",
        "editor-read-source-authoring-status",
        "editor-selection-context-summary-foundation",
        "editor-selection-overlay-zoom-motion-sync",
        "editor-structure-panel-narrow-width-visibility",
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
