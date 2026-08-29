import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const editorCommit = "2538c2af02f2bda7aa6eafb8d621eec33bc28cc0";
const workId = "editor-creator-structure-add-affordance-foundation";
const phaseId = "phase-editor-creator-structure-add-affordance-foundation";
const checklistId = "checklist-editor-creator-structure-add-affordance-foundation";
const documentId = "doc-editor-creator-structure-add-affordance-foundation-2026-08-29";
const evidenceId = "evidence-editor-creator-structure-add-affordance-foundation-2026-08-29";
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("Editor creator Structure add affordance foundation lane", () => {
  it("records disabled add-block affordances and large-structure risk without promoting Editor truth", async () => {
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
      documentId,
    ]));
    expect(work?.expectedOutput).toContain("Structure");
    expect(work?.expectedOutput).toContain("disabled");
    expect(work?.expectedOutput).toContain("1200-item synthetic guard");
    expect(work?.expectedOutput).toContain(editorCommit);
    expect(work?.expectedOutput).toContain(evidenceId);
    expect(work?.riskSummary).toContain("does not enable WYSIWYG");
    expect(work?.riskSummary).toContain("real large-document authoring performance readiness");

    expect(phase).toMatchObject({
      activeRole: "product-implementation-agent",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workId,
    });
    expect(phase?.verificationTarget).toContain(evidenceId);
    expect(phase?.summary).toContain("selected-row affordance count");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-structure-add-affordance-scope",
      "define-structure-add-terminology-boundary",
      "add-structure-add-affordance-red-tests",
      "add-disabled-structure-add-affordances",
      "verify-editor-live-backend-structure-path",
      "keep-authoring-and-map-truth-unpromoted",
      "record-structure-performance-risks",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true);

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-creator-structure-add-affordance-foundation-2026-08-29.md",
      role: "verification",
    });
    expect(normalize(document?.content)).toContain("Structure panel");
    expect(normalize(document?.content)).toContain("Add block affordance");
    expect(normalize(document?.content)).toContain("Document structure");
    expect(normalize(document?.content)).toContain("1200-item synthetic outline");
    expect(normalize(document?.content)).toContain("does not enable WYSIWYG");
    expect(normalize(document?.content)).toContain("Real text-block typing performance remains untested");
    expect(normalize(document?.content)).toContain("Project Control record gate");
    expect(normalize(document?.content)).toContain(".worktrees/editor-creator-structure-add-affordance-foundation");
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
    expect(evidence?.verificationSummary).toContain("Structure panel");
    expect(evidence?.verificationSummary).toContain("Focused RED");
    expect(evidence?.verificationSummary).toContain("312 passed");
    expect(evidence?.verificationSummary).toContain("329 passed");
    expect(evidence?.verificationSummary).toContain("1200 Outline items");
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
        "editor-local-loopback-dev-runner",
        "editor-outline-scannability-foundation",
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
