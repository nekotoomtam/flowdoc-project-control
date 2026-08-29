import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("Editor WorkspaceViewTabs foundation lane", () => {
  it("opens the bounded WorkspaceViewTabs component lane without promoting Editor truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const work = model.work.find((item) => item.id === "editor-workspace-view-tabs-foundation");
    const phase = model.phases.find((item) => item.id === "phase-editor-workspace-view-tabs-foundation");
    const checklist = model.checklists.find((item) => item.id === "checklist-editor-workspace-view-tabs-foundation");
    const document = model.documents.find((item) => item.id === "doc-editor-workspace-view-tabs-foundation-2026-08-28");
    const evidence = model.evidence.find((item) => item.id === "evidence-editor-workspace-view-tabs-foundation-2026-08-28");

    expect(work).toMatchObject({
      workKind: "task",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "editor",
      repositoryIds: ["repo-editor", "repo-project-control"],
      workState: "in-review",
      activeRole: "product-implementation-agent",
      phaseIds: ["phase-editor-workspace-view-tabs-foundation"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "editor-workspace-view-tabs-foundation",
      ],
      requiredEvidence: ["evidence-editor-workspace-view-tabs-foundation-2026-08-28"],
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
      "doc-editor-workspace-view-tabs-foundation-2026-08-28",
    ]));
    expect(work?.expectedOutput).toContain("WorkspaceViewTabs");
    expect(work?.expectedOutput).toContain("a72ae5e5fd8556e4ced63e481390432546eb3f35");
    expect(work?.expectedOutput).toContain("evidence-editor-workspace-view-tabs-foundation-2026-08-28");
    expect(work?.riskSummary).toContain("does not promote");

    expect(phase).toMatchObject({
      workId: "editor-workspace-view-tabs-foundation",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor"],
      activeRole: "product-implementation-agent",
    });
    expect(phase?.verificationTarget).toContain("evidence-editor-workspace-view-tabs-foundation-2026-08-28");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-header-context",
      "define-view-tabs-boundary",
      "split-view-tabs-component",
      "lock-view-intent-boundary",
      "preserve-header-ownership",
      "keep-map-truth-unpromoted",
      "prepare-editor-gate",
    ]);
    expect(checklist?.items.map((item) => item.state)).toEqual([
      "passed",
      "passed",
      "passed",
      "passed",
      "passed",
      "passed",
      "passed",
    ]);
    expect(checklist?.items.every((item) =>
      item.evidenceTarget.includes("evidence-editor-workspace-view-tabs-foundation-2026-08-28"),
    )).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes("evidence-editor-workspace-view-tabs-foundation-2026-08-28"),
    )).toBe(true);

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-workspace-view-tabs-foundation-2026-08-28.md",
      role: "decision",
    });
    expect(normalize(document?.content)).toContain("WorkspaceViewTabs");
    expect(normalize(document?.content)).toContain("UI component");
    expect(normalize(document?.content)).toContain("active view");
    expect(normalize(document?.content)).toContain("does not promote Editor truth");
    expect(normalize(document?.content)).toContain("evidence-editor-workspace-view-tabs-foundation-2026-08-28");
    expect(normalize(document?.content)).toContain("Implementation Evidence");
    expect(normalize(document?.content)).toContain("a72ae5e5fd8556e4ced63e481390432546eb3f35");
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: "a72ae5e5fd8556e4ced63e481390432546eb3f35",
        pathOrContractId: "src/components/shell/WorkspaceViewTabs.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: "a72ae5e5fd8556e4ced63e481390432546eb3f35",
        pathOrContractId: "src/tests/workspaceViewTabs.test.ts",
      },
      {
        repositoryId: "repo-editor",
        commit: "a72ae5e5fd8556e4ced63e481390432546eb3f35",
        pathOrContractId: "src/components/shell/AppHeader.tsx",
      },
    ]));

    expect(evidence).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-editor",
      commit: "a72ae5e5fd8556e4ced63e481390432546eb3f35",
      pathOrContractId: "src/tests/workspaceViewTabs.test.ts",
    });
    expect(evidence?.verificationSummary).toContain("WorkspaceViewTabs");
    expect(evidence?.verificationSummary).toContain("82 passed");
    expect(evidence?.verificationSummary).toContain("289 passed");
    expect(evidence?.verificationSummary).toContain("does not promote");
    expect(model.nodes.find((node) => node.id === "editor")).toMatchObject({
      truthState: "unknown",
      documentIds: [],
      evidenceIds: [],
      repositoryIds: ["repo-editor"],
      workIds: [
        "editor-backend-unavailable-honesty-review",
        "editor-local-loopback-dev-runner",
        "editor-read-source-authoring-status",
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
