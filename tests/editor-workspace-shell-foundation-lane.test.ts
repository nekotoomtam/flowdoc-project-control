import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim();

describe("Editor Workspace Shell foundation lane", () => {
  it("opens the first Editor frontend component lane without promoting Editor truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const work = model.work.find((item) => item.id === "editor-workspace-shell-redesign-foundation");
    const phase = model.phases.find((item) => item.id === "phase-editor-workspace-shell-foundation");
    const checklist = model.checklists.find((item) => item.id === "checklist-editor-workspace-shell-foundation");
    const document = model.documents.find((item) => item.id === "doc-editor-workspace-shell-foundation-2026-08-28");
    const evidence = model.evidence.find((item) => item.id === "evidence-editor-workspace-shell-foundation-2026-08-28");

    expect(work).toMatchObject({
      workKind: "task",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "editor",
      repositoryIds: ["repo-editor", "repo-project-control"],
      workState: "in-review",
      activeRole: "product-implementation-agent",
      phaseIds: ["phase-editor-workspace-shell-foundation"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "editor-workspace-shell-redesign-foundation",
      ],
      requiredEvidence: ["evidence-editor-workspace-shell-foundation-2026-08-28"],
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
      "doc-flowdoc-core-backend-readiness-matrix-2026-08-27",
      "doc-editor-workspace-shell-foundation-2026-08-28",
    ]));
    expect(work?.expectedOutput).toContain("Editor Workspace Shell");
    expect(work?.expectedOutput).toContain("evidence-editor-workspace-shell-foundation-2026-08-28");
    expect(work?.riskSummary).toContain("does not promote");

    expect(phase).toMatchObject({
      workId: "editor-workspace-shell-redesign-foundation",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor"],
      activeRole: "product-implementation-agent",
    });
    expect(phase?.verificationTarget).toContain("evidence-editor-workspace-shell-foundation-2026-08-28");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-editor-context",
      "define-shell-boundary",
      "split-shell-components",
      "lock-data-boundary",
      "preserve-runtime-ownership",
      "keep-map-truth-unpromoted",
      "prepare-editor-implementation-gate",
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
      item.evidenceTarget.includes("evidence-editor-workspace-shell-foundation-2026-08-28"),
    )).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes("evidence-editor-workspace-shell-foundation-2026-08-28"),
    )).toBe(true);

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-workspace-shell-foundation-2026-08-28.md",
      role: "decision",
    });
    expect(normalize(document?.content)).toContain("Editor Workspace Shell");
    expect(normalize(document?.content)).toContain("UI component");
    expect(normalize(document?.content)).toContain("does not promote Editor truth");
    expect(normalize(document?.content)).toContain("evidence-editor-workspace-shell-foundation-2026-08-28");
    expect(normalize(document?.content)).toContain("WorkspaceFrame");
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: "aef34d9b0b38521dac361abd95d61db7a1c061ee",
        pathOrContractId: "src/components/shell/WorkspaceFrame.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: "aef34d9b0b38521dac361abd95d61db7a1c061ee",
        pathOrContractId: "src/tests/workspaceFrame.test.ts",
      },
    ]));

    expect(evidence).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-editor",
      commit: "aef34d9b0b38521dac361abd95d61db7a1c061ee",
      pathOrContractId: "src/tests/workspaceFrame.test.ts",
    });
    expect(evidence?.verificationSummary).toContain("WorkspaceFrame");
    expect(evidence?.verificationSummary).toContain("81 passed");
    expect(evidence?.verificationSummary).toContain("287 passed");

    expect(model.nodes.find((node) => node.id === "editor")).toMatchObject({
      truthState: "unknown",
      documentIds: [],
      evidenceIds: [],
      repositoryIds: ["repo-editor"],
      workIds: [
        "editor-backend-unavailable-honesty-review",
        "editor-local-loopback-dev-runner",
        "editor-paper-smooth-zoom-anchor-fix",
        "editor-paper-smooth-zoom-surface",
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
