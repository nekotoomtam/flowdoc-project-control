import { describe, expect, it } from "vitest"
import { buildProjectReadModel } from "../tools/lib/build-read-model.js"
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js"

const editorCommit = "7a2a62579a02074e7fdf391f4c56a558740dfbf0"
const workId = "editor-paper-smooth-zoom-anchor-fix"
const phaseId = "phase-editor-paper-smooth-zoom-anchor-fix"
const checklistId = "checklist-editor-paper-smooth-zoom-anchor-fix"
const documentId = "doc-editor-paper-smooth-zoom-anchor-fix-2026-08-29"
const evidenceId = "evidence-editor-paper-smooth-zoom-anchor-fix-2026-08-29"
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim()

describe("Editor paper smooth zoom anchor fix lane", () => {
  it("records the bounded zoom-anchor bugfix without promoting Editor truth", async () => {
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
      documentId,
    ]))
    expect(work?.expectedOutput).toContain("zoom anchor")
    expect(work?.expectedOutput).toContain("footprintDelta 0")
    expect(work?.expectedOutput).toContain("0.16s/ease")
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
      "capture-zoom-anchor-context",
      "define-zoom-anchor-boundary",
      "add-footprint-motion-regression",
      "synchronize-zoom-footprint-motion",
      "verify-editor-main-browser-path",
      "keep-map-truth-unpromoted",
    ])
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true)
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true)

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-paper-smooth-zoom-anchor-fix-2026-08-29.md",
      role: "verification",
    })
    expect(normalize(document?.content)).toContain("zoom anchor")
    expect(normalize(document?.content)).toContain("viewport-only")
    expect(normalize(document?.content)).toContain("footprintDelta 0")
    expect(normalize(document?.content)).toContain("0.16s/ease")
    expect(normalize(document?.content)).toContain("does not enable WYSIWYG")
    expect(normalize(document?.content)).toContain(evidenceId)
    expect(normalize(document?.content)).toContain(editorCommit)
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/paper/PaperPage.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/paper/PaperPageStack.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/styles/editor.css",
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
    expect(evidence?.verificationSummary).toContain("zoom anchor")
    expect(evidence?.verificationSummary).toContain("85%")
    expect(evidence?.verificationSummary).toContain("95%")
    expect(evidence?.verificationSummary).toContain("303 passed")
    expect(evidence?.verificationSummary).toContain("0 console errors")
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
