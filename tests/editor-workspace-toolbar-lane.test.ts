import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("Editor WorkspaceToolbar foundation lane", () => {
  it("records the bounded WorkspaceToolbar component lane without promoting Editor truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const work = model.work.find((item) => item.id === "editor-workspace-toolbar-foundation");
    const phase = model.phases.find((item) => item.id === "phase-editor-workspace-toolbar-foundation");
    const checklist = model.checklists.find((item) => item.id === "checklist-editor-workspace-toolbar-foundation");
    const document = model.documents.find((item) => item.id === "doc-editor-workspace-toolbar-foundation-2026-08-28");
    const evidence = model.evidence.find((item) => item.id === "evidence-editor-workspace-toolbar-foundation-2026-08-28");

    expect(work).toMatchObject({
      workKind: "task",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "editor",
      repositoryIds: ["repo-editor", "repo-project-control"],
      workState: "in-review",
      activeRole: "product-implementation-agent",
      phaseIds: ["phase-editor-workspace-toolbar-foundation"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "editor-workspace-toolbar-foundation",
      ],
      requiredEvidence: ["evidence-editor-workspace-toolbar-foundation-2026-08-28"],
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
      "doc-editor-workspace-header-foundation-2026-08-28",
      "doc-editor-workspace-status-strip-foundation-2026-08-28",
      "doc-editor-workspace-toolbar-foundation-2026-08-28",
    ]));
    expect(work?.expectedOutput).toContain("WorkspaceToolbar");
    expect(work?.expectedOutput).toContain("9e9d0deaa957297419f34ed4e2a8b53344a9273e");
    expect(work?.expectedOutput).toContain("evidence-editor-workspace-toolbar-foundation-2026-08-28");
    expect(work?.riskSummary).toContain("does not promote");

    expect(phase).toMatchObject({
      workId: "editor-workspace-toolbar-foundation",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor"],
      activeRole: "product-implementation-agent",
    });
    expect(phase?.verificationTarget).toContain("evidence-editor-workspace-toolbar-foundation-2026-08-28");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-toolbar-context",
      "define-workspace-toolbar-boundary",
      "split-toolbar-shell-component",
      "preserve-editor-toolbar-adapter-ownership",
      "lock-toolbar-action-boundary",
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
      item.evidenceTarget.includes("evidence-editor-workspace-toolbar-foundation-2026-08-28"),
    )).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes("evidence-editor-workspace-toolbar-foundation-2026-08-28"),
    )).toBe(true);

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-workspace-toolbar-foundation-2026-08-28.md",
      role: "decision",
    });
    expect(normalize(document?.content)).toContain("WorkspaceToolbar");
    expect(normalize(document?.content)).toContain("UI component");
    expect(normalize(document?.content)).toContain("toolbar sections");
    expect(normalize(document?.content)).toContain("EditorToolbar adapter");
    expect(normalize(document?.content)).toContain("does not promote Editor truth");
    expect(normalize(document?.content)).toContain("evidence-editor-workspace-toolbar-foundation-2026-08-28");
    expect(normalize(document?.content)).toContain("Implementation Evidence");
    expect(normalize(document?.content)).toContain("9e9d0deaa957297419f34ed4e2a8b53344a9273e");
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: "9e9d0deaa957297419f34ed4e2a8b53344a9273e",
        pathOrContractId: "src/components/shell/WorkspaceToolbar.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: "9e9d0deaa957297419f34ed4e2a8b53344a9273e",
        pathOrContractId: "src/components/shell/EditorToolbar.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: "9e9d0deaa957297419f34ed4e2a8b53344a9273e",
        pathOrContractId: "src/tests/workspaceToolbar.test.ts",
      },
    ]));

    expect(evidence).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-editor",
      commit: "9e9d0deaa957297419f34ed4e2a8b53344a9273e",
      pathOrContractId: "src/tests/workspaceToolbar.test.ts",
    });
    expect(evidence?.verificationSummary).toContain("WorkspaceToolbar");
    expect(evidence?.verificationSummary).toContain("86 passed");
    expect(evidence?.verificationSummary).toContain("296 passed");
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
