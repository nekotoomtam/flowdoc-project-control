import { describe, expect, it } from "vitest"
import { buildProjectReadModel } from "../tools/lib/build-read-model.js"
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js"

const editorCommit = "58f3002363b29662bb02042fdb1021236844cbc1"
const workId = "editor-paper-smooth-zoom-surface"
const phaseId = "phase-editor-paper-smooth-zoom-surface"
const checklistId = "checklist-editor-paper-smooth-zoom-surface"
const documentId = "doc-editor-paper-smooth-zoom-surface-2026-08-29"
const evidenceId = "evidence-editor-paper-smooth-zoom-surface-2026-08-29"
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim()

describe("Editor paper smooth zoom surface lane", () => {
  it("records the bounded smooth viewport zoom lane without promoting Editor truth", async () => {
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
      "doc-editor-workspace-toolbar-foundation-2026-08-28",
      "doc-editor-read-source-authoring-status-2026-08-29",
      documentId,
    ]))
    expect(work?.expectedOutput).toContain("smooth viewport zoom")
    expect(work?.expectedOutput).toContain("50%, 85%, 100%, and 125%")
    expect(work?.expectedOutput).toContain("no Backend mutation")
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
      "capture-smooth-zoom-context",
      "define-viewport-only-zoom-boundary",
      "add-paper-zoom-control-surface",
      "add-smooth-paper-motion",
      "keep-selection-overlay-aligned-after-motion",
      "verify-live-backend-mode-zoom-path",
      "keep-map-truth-unpromoted",
      "prepare-editor-gate",
    ])
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true)
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true)

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-paper-smooth-zoom-surface-2026-08-29.md",
      role: "decision",
    })
    expect(normalize(document?.content)).toContain("smooth viewport zoom")
    expect(normalize(document?.content)).toContain("viewport-only")
    expect(normalize(document?.content)).toContain("50%, 85%, 100%, and 125%")
    expect(normalize(document?.content)).toContain("selection overlay")
    expect(normalize(document?.content)).toContain("does not enable WYSIWYG")
    expect(normalize(document?.content)).toContain(evidenceId)
    expect(normalize(document?.content)).toContain(editorCommit)
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/shell/PaperZoomControls.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/canvas/CanvasOverlayLayer.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/tests/paperSmoothZoomSurface.test.ts",
      },
    ]))

    expect(evidence).toMatchObject({
      commit: editorCommit,
      nodeIds: [],
      pathOrContractId: "src/tests/paperSmoothZoomSurface.test.ts",
      repositoryId: "repo-editor",
    })
    expect(evidence?.verificationSummary).toContain("smooth viewport zoom")
    expect(evidence?.verificationSummary).toContain("85%")
    expect(evidence?.verificationSummary).toContain("95%")
    expect(evidence?.verificationSummary).toContain("no Backend mutation")
    expect(evidence?.verificationSummary).toContain("302 passed")
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
