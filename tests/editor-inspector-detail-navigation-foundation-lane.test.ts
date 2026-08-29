import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const editorCommit = "6ae950600949ec5c868b86cd0db140c9a9bb5780";
const workId = "editor-inspector-detail-navigation-foundation";
const phaseId = "phase-editor-inspector-detail-navigation-foundation";
const checklistId = "checklist-editor-inspector-detail-navigation-foundation";
const documentId = "doc-editor-inspector-detail-navigation-foundation-2026-08-29";
const evidenceId = "evidence-editor-inspector-detail-navigation-foundation-2026-08-29";
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("Editor Inspector detail navigation foundation lane", () => {
  it("records the bounded Inspector Details layer without promoting Editor truth", async () => {
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
      "doc-editor-read-source-authoring-status-2026-08-29",
      "doc-editor-selection-overlay-zoom-motion-sync-2026-08-29",
      "doc-editor-selection-context-summary-foundation-2026-08-29",
      documentId,
    ]));
    expect(work?.expectedOutput).toContain("Details");
    expect(work?.expectedOutput).toContain("display: none");
    expect(work?.expectedOutput).toContain("Columns");
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
      "capture-inspector-detail-navigation-scope",
      "define-inspector-details-boundary",
      "add-inspector-details-red-tests",
      "add-inspector-details-disclosure",
      "verify-editor-live-backend-details-path",
      "keep-map-truth-unpromoted",
      "record-risk-and-unknowns",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true);

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-inspector-detail-navigation-foundation-2026-08-29.md",
      role: "verification",
    });
    expect(normalize(document?.content)).toContain("Inspector Details layer");
    expect(normalize(document?.content)).toContain("display: none");
    expect(normalize(document?.content)).toContain("Source: Backend read");
    expect(normalize(document?.content)).toContain("Authoring: limited");
    expect(normalize(document?.content)).toContain(".worktrees/editor-inspector-detail-navigation-foundation");
    expect(normalize(document?.content)).toContain("could not be removed");
    expect(normalize(document?.content)).toContain("does not enable WYSIWYG");
    expect(normalize(document?.content)).toContain(evidenceId);
    expect(normalize(document?.content)).toContain(editorCommit);
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/inspector/InspectorPanel.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/styles/editor.css",
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
    expect(evidence?.verificationSummary).toContain("Inspector Details layer");
    expect(evidence?.verificationSummary).toContain("Focused RED");
    expect(evidence?.verificationSummary).toContain("display: none");
    expect(evidence?.verificationSummary).toContain("308 passed");
    expect(evidence?.verificationSummary).toContain("Source: Backend read");
    expect(evidence?.verificationSummary).toContain("Authoring: limited");
    expect(evidence?.verificationSummary).toContain(".worktrees/editor-inspector-detail-navigation-foundation");
    expect(evidence?.verificationSummary).toContain("could not be removed");
    expect(evidence?.verificationSummary).toContain("does not promote");

    expect(model.nodes.find((node) => node.id === "editor")).toMatchObject({
      documentIds: [],
      evidenceIds: [],
      repositoryIds: ["repo-editor"],
      truthState: "unknown",
      workIds: [
        "editor-backend-unavailable-honesty-review",
        "editor-inspector-detail-navigation-foundation",
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
