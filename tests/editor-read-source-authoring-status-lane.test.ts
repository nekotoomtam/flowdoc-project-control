import { describe, expect, it } from "vitest"
import { buildProjectReadModel } from "../tools/lib/build-read-model.js"
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js"

const editorCommit = "b34fa44a25113359004706f32ecdd1d694dbf3e3"
const workId = "editor-read-source-authoring-status"
const phaseId = "phase-editor-read-source-authoring-status"
const checklistId = "checklist-editor-read-source-authoring-status"
const documentId = "doc-editor-read-source-authoring-status-2026-08-29"
const evidenceId = "evidence-editor-read-source-authoring-status-2026-08-29"
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim()

describe("Editor read source authoring status lane", () => {
  it("records the bounded live Backend read source and limited authoring status lane without promoting Editor truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()))
    const work = model.work.find((item) => item.id === workId)
    const phase = model.phases.find((item) => item.id === phaseId)
    const checklist = model.checklists.find((item) => item.id === checklistId)
    const document = model.documents.find((item) => item.id === documentId)
    const evidence = model.evidence.find((item) => item.id === evidenceId)

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
    })
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
      "doc-editor-workspace-status-strip-foundation-2026-08-28",
      "doc-editor-workspace-editing-command-group-foundation-2026-08-29",
      documentId,
    ]))
    expect(work?.expectedOutput).toContain("Source: Backend read")
    expect(work?.expectedOutput).toContain("Authoring: limited")
    expect(work?.expectedOutput).toContain(editorCommit)
    expect(work?.expectedOutput).toContain(evidenceId)
    expect(work?.riskSummary).toContain("does not enable")

    expect(phase).toMatchObject({
      activeRole: "product-implementation-agent",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workId,
    })
    expect(phase?.verificationTarget).toContain(evidenceId)

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-read-source-authoring-context",
      "define-honesty-status-boundary",
      "add-source-and-authoring-status",
      "clarify-disabled-editing-controls",
      "verify-live-backend-mode-read-path",
      "keep-map-truth-unpromoted",
      "prepare-editor-gate",
    ])
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true)
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true)

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-read-source-authoring-status-2026-08-29.md",
      role: "decision",
    })
    expect(normalize(document?.content)).toContain("Source: Backend read")
    expect(normalize(document?.content)).toContain("Authoring: limited")
    expect(normalize(document?.content)).toContain("authoring not enabled")
    expect(normalize(document?.content)).toContain("live Backend mode")
    expect(normalize(document?.content)).toContain("does not promote Editor truth")
    expect(normalize(document?.content)).toContain(evidenceId)
    expect(normalize(document?.content)).toContain(editorCommit)
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/shell/StatusBar.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/shell/WorkspaceEditingCommandGroup.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/tests/workspaceStatusStrip.test.ts",
      },
    ]))

    expect(evidence).toMatchObject({
      commit: editorCommit,
      nodeIds: [],
      pathOrContractId: "src/tests/workspaceStatusStrip.test.ts",
      repositoryId: "repo-editor",
    })
    expect(evidence?.verificationSummary).toContain("Source: Backend read")
    expect(evidence?.verificationSummary).toContain("Authoring: limited")
    expect(evidence?.verificationSummary).toContain("299 passed")
    expect(evidence?.verificationSummary).toContain("live Backend mode")
    expect(evidence?.verificationSummary).toContain("does not promote")

    expect(model.nodes.find((node) => node.id === "editor")).toMatchObject({
      documentIds: [],
      evidenceIds: [],
      repositoryIds: ["repo-editor"],
      truthState: "unknown",
      workIds: [
        "editor-backend-unavailable-honesty-review",
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
    })
  })
})
