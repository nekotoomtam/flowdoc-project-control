import { describe, expect, it } from "vitest"
import { buildProjectReadModel } from "../tools/lib/build-read-model.js"
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js"

const editorCommit = "a11db59634873d309a0fb469a6479a099705a28e"
const workId = "editor-selection-overlay-zoom-motion-sync"
const phaseId = "phase-editor-selection-overlay-zoom-motion-sync"
const checklistId = "checklist-editor-selection-overlay-zoom-motion-sync"
const documentId = "doc-editor-selection-overlay-zoom-motion-sync-2026-08-29"
const evidenceId = "evidence-editor-selection-overlay-zoom-motion-sync-2026-08-29"
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim()

describe("Editor selection overlay zoom motion sync lane", () => {
  it("records the bounded selection overlay zoom bugfix without promoting Editor truth", async () => {
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
      "doc-editor-paper-smooth-zoom-surface-2026-08-29",
      "doc-editor-paper-smooth-zoom-anchor-fix-2026-08-29",
      documentId,
    ]))
    expect(work?.expectedOutput).toContain("selection overlay")
    expect(work?.expectedOutput).toContain("zoom motion")
    expect(work?.expectedOutput).toContain("max overlay delta")
    expect(work?.expectedOutput).toContain("0.011px")
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
      "capture-selection-overlay-zoom-context",
      "define-overlay-zoom-boundary",
      "add-frame-sync-regression",
      "sync-overlay-during-motion",
      "verify-editor-main-browser-overlay-delta",
      "keep-map-truth-unpromoted",
      "record-cleanup-risk",
    ])
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true)
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true)

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-selection-overlay-zoom-motion-sync-2026-08-29.md",
      role: "verification",
    })
    expect(normalize(document?.content)).toContain("selection overlay zoom motion sync")
    expect(normalize(document?.content)).toContain("viewport-only")
    expect(normalize(document?.content)).toContain("60.47px")
    expect(normalize(document?.content)).toContain("0.011px")
    expect(normalize(document?.content)).toContain("does not enable WYSIWYG")
    expect(normalize(document?.content)).toContain(evidenceId)
    expect(normalize(document?.content)).toContain(editorCommit)
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/canvas/CanvasOverlayLayer.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/editor/selection/selectionOverlay.ts",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/tests/selectionOverlay.test.ts",
      },
    ]))

    expect(evidence).toMatchObject({
      commit: editorCommit,
      nodeIds: [],
      pathOrContractId: "src/tests/selectionOverlay.test.ts",
      repositoryId: "repo-editor",
    })
    expect(evidence?.verificationSummary).toContain("selection overlay")
    expect(evidence?.verificationSummary).toContain("85%")
    expect(evidence?.verificationSummary).toContain("95%")
    expect(evidence?.verificationSummary).toContain("305 passed")
    expect(evidence?.verificationSummary).toContain("max overlay delta 0.011px")
    expect(evidence?.verificationSummary).toContain("does not promote")

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
