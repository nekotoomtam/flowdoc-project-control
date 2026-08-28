import { describe, expect, it } from "vitest"
import { buildProjectReadModel } from "../tools/lib/build-read-model.js"
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js"

const normalize = (value: string | undefined) => value?.replace(/\s+/gu, " ").trim()

describe("Editor local loopback dev runner lane", () => {
  it("records the bounded dev runner without promoting Editor or FlowDoc readiness", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()))
    const work = model.work.find((item) => item.id === "editor-local-loopback-dev-runner")
    const phase = model.phases.find((item) => item.id === "phase-editor-local-loopback-dev-runner")
    const checklist = model.checklists.find((item) => item.id === "checklist-editor-local-loopback-dev-runner")
    const document = model.documents.find((item) => item.id === "doc-editor-local-loopback-dev-runner-2026-08-28")
    const evidence = model.evidence.find((item) => item.id === "evidence-editor-local-loopback-dev-runner-2026-08-28")

    expect(work).toMatchObject({
      activeRole: "product-implementation-agent",
      nodeId: "editor",
      parentWorkId: "flowdoc-product-development-resumption",
      phaseIds: ["phase-editor-local-loopback-dev-runner"],
      repositoryIds: ["repo-editor", "repo-project-control", "repo-backend", "repo-core"],
      requiredEvidence: ["evidence-editor-local-loopback-dev-runner-2026-08-28"],
      workKind: "task",
      workPathIds: [
        "flowdoc-product-development-resumption",
        "editor-local-loopback-dev-runner",
      ],
      workState: "in-review",
    })
    expect(work?.contextDocumentIds).toEqual(expect.arrayContaining([
      "doc-project-control-agent-onboarding",
      "doc-flowdoc-system-map",
      "doc-flowdoc-round-workflow",
      "doc-flowdoc-product-terminology",
      "doc-flowdoc-product-terminology-th",
      "doc-editor-browser-live-backend-corpus-smoke-2026-08-27",
      "doc-editor-local-loopback-dev-runner-2026-08-28",
    ]))
    expect(work?.expectedOutput).toContain("dev:local-loopback")
    expect(work?.expectedOutput).toContain("live Backend mode")
    expect(work?.riskSummary).toContain("does not prove product readiness")

    expect(phase).toMatchObject({
      activeRole: "product-implementation-agent",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workId: "editor-local-loopback-dev-runner",
    })
    expect(phase?.verificationTarget).toContain("evidence-editor-local-loopback-dev-runner-2026-08-28")

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-existing-loopback-context",
      "define-dev-runner-boundary",
      "add-editor-runner",
      "smoke-local-loopback-readiness",
      "record-bounded-evidence",
      "keep-map-truth-unpromoted",
    ])
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true)
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes("evidence-editor-local-loopback-dev-runner-2026-08-28"),
    )).toBe(true)

    expect(document).toMatchObject({
      nodeIds: [],
      path: "docs/domains/editor-local-loopback-dev-runner-2026-08-28.md",
      role: "decision",
    })
    expect(normalize(document?.content)).toContain("dev:local-loopback")
    expect(normalize(document?.content)).toContain("Core is dependency-only")
    expect(normalize(document?.content)).toContain("Backend runs as a loopback server process")
    expect(normalize(document?.content)).toContain("does not prove product readiness")

    expect(evidence).toMatchObject({
      nodeIds: [],
      pathOrContractId: "src/tests/localLoopbackDevRunner.test.ts",
      repositoryId: "repo-editor",
    })
    expect(evidence?.commit).toMatch(/^[0-9a-f]{40}$/u)
    expect(evidence?.verificationSummary).toContain("dev:local-loopback")
    expect(evidence?.verificationSummary).toContain("local loopback only")
    expect(evidence?.verificationSummary).toContain("does not promote")

    expect(model.nodes.find((node) => node.id === "editor")).toMatchObject({
      documentIds: [],
      evidenceIds: [],
      truthState: "unknown",
    })
  })
})
