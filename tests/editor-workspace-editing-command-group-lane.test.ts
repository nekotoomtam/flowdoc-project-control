import { describe, expect, it } from "vitest"
import { buildProjectReadModel } from "../tools/lib/build-read-model.js"
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js"

const editorCommit = "aca56f18b4e3e41ca514684fdf47478ce0e9ea00"
const workId = "editor-workspace-editing-command-group-foundation"
const phaseId = "phase-editor-workspace-editing-command-group-foundation"
const checklistId = "checklist-editor-workspace-editing-command-group-foundation"
const documentId = "doc-editor-workspace-editing-command-group-foundation-2026-08-29"
const evidenceId = "evidence-editor-workspace-editing-command-group-foundation-2026-08-29"
const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim()

describe("Editor WorkspaceEditingCommandGroup foundation lane", () => {
  it("records the bounded editing command group component lane without promoting Editor truth", async () => {
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
      repositoryIds: ["repo-editor", "repo-project-control"],
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
      "doc-editor-workspace-shell-foundation-2026-08-28",
      "doc-editor-workspace-view-tabs-foundation-2026-08-28",
      "doc-editor-workspace-header-foundation-2026-08-28",
      "doc-editor-workspace-status-strip-foundation-2026-08-28",
      "doc-editor-workspace-toolbar-foundation-2026-08-28",
      documentId,
    ]))
    expect(work?.expectedOutput).toContain("WorkspaceEditingCommandGroup")
    expect(work?.expectedOutput).toContain(editorCommit)
    expect(work?.expectedOutput).toContain(evidenceId)
    expect(work?.riskSummary).toContain("does not promote")

    expect(phase).toMatchObject({
      activeRole: "product-implementation-agent",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor"],
      workId,
    })
    expect(phase?.verificationTarget).toContain(evidenceId)

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-editing-command-context",
      "define-workspace-editing-command-group-boundary",
      "split-editing-command-group-component",
      "preserve-editor-toolbar-adapter-ownership",
      "lock-command-readiness-boundary",
      "keep-map-truth-unpromoted",
      "prepare-editor-gate",
    ])
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true)
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(evidenceId),
    )).toBe(true)

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-workspace-editing-command-group-foundation-2026-08-29.md",
      role: "decision",
    })
    expect(normalize(document?.content)).toContain("WorkspaceEditingCommandGroup")
    expect(normalize(document?.content)).toContain("UI component")
    expect(normalize(document?.content)).toContain("toolbar action")
    expect(normalize(document?.content)).toContain("EditorToolbar adapter")
    expect(normalize(document?.content)).toContain("does not promote Editor truth")
    expect(normalize(document?.content)).toContain(evidenceId)
    expect(normalize(document?.content)).toContain("Implementation Evidence")
    expect(normalize(document?.content)).toContain(editorCommit)
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/shell/WorkspaceEditingCommandGroup.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/components/shell/EditorToolbar.tsx",
      },
      {
        repositoryId: "repo-editor",
        commit: editorCommit,
        pathOrContractId: "src/tests/workspaceEditingCommandGroup.test.ts",
      },
    ]))

    expect(evidence).toMatchObject({
      commit: editorCommit,
      nodeIds: [],
      pathOrContractId: "src/tests/workspaceEditingCommandGroup.test.ts",
      repositoryId: "repo-editor",
    })
    expect(evidence?.verificationSummary).toContain("WorkspaceEditingCommandGroup")
    expect(evidence?.verificationSummary).toContain("87 passed")
    expect(evidence?.verificationSummary).toContain("298 passed")
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
