import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-structure-pattern-build-preview-integration-v0";
const PARENT_WORK_ID = "flowdoc-document-structure-database-model";
const DOC_ID = "doc-flowdoc-structure-pattern-build-preview-integration-v0-2026-09-04";
const DOC_PATH = "docs/domains/flowdoc-structure-pattern-build-preview-integration-v0-2026-09-04.md";
const PHASE_ID = "phase-flowdoc-structure-pattern-build-preview-integration-v0";
const CHECKLIST_ID = "checklist-flowdoc-structure-pattern-build-preview-integration-v0";
const EVIDENCE_ID = "evidence-flowdoc-structure-pattern-build-preview-integration-v0-2026-09-04";
const EDITOR_COMMIT = "65ab5b149c5aad10b36bbaa23650b9fce7070dff";
const BACKEND_COMMIT = "9da58214e087d2f15afd43855bfd1febec882037";
const CORE_COMMIT = "8411f26763d81743ba9d44a59fd5ad4942e5601a";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Structure Pattern Build/Preview integration acceptance", () => {
  it("records PLAN acceptance of the returned Editor, Backend, and Core lanes after main integration gates", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const parentWork = model.work.find((item) => item.id === PARENT_WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);

    expect(parentWork?.childWorkIds).toContain(WORK_ID);
    expect(parentWork?.requiredEvidence).toContain(EVIDENCE_ID);
    expect(parentWork?.contextDocumentIds).toContain(DOC_ID);

    expect(work).toMatchObject({
      activeRole: "evidence-reviewer",
      contextDocumentIds: expect.arrayContaining([
        "doc-flowdoc-creator-ux-contract-v0-2026-09-04",
        "doc-flowdoc-document-structure-database-model-v0-0-2-2026-09-04",
        "doc-flowdoc-fast-delivery-risk-register-2026-09-04",
        DOC_ID,
      ]),
      nodeId: "flowdoc",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      requiredEvidence: [EVIDENCE_ID],
      workKind: "task",
      workPathIds: ["flowdoc-product-development-resumption", PARENT_WORK_ID, WORK_ID],
      workState: "in-review",
    });
    expect(work?.summary).toContain("Structure Pattern Build/Preview");
    expect(work?.riskSummary).toContain("not FlowDoc product readiness");

    expect(phase).toMatchObject({
      activeRole: "evidence-reviewer",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain(EDITOR_COMMIT);
    expect(phase?.verificationTarget).toContain(BACKEND_COMMIT);
    expect(phase?.verificationTarget).toContain(CORE_COMMIT);

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "stage-structure-pattern-work-returns",
      "accept-structure-pattern-work-returns",
      "merge-core-main-and-run-gate",
      "merge-backend-main-and-run-gate",
      "merge-editor-main-and-run-gate",
      "record-structure-pattern-integration-evidence",
      "preserve-structure-pattern-product-boundaries",
      "verify-project-control-structure-pattern-integration-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("PLAN integration acceptance"),
      lifecycle: "active",
      nodeIds: [],
      path: DOC_PATH,
      role: "verification",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({ commit: EDITOR_COMMIT, repositoryId: "repo-editor" }),
      expect.objectContaining({ commit: BACKEND_COMMIT, repositoryId: "repo-backend" }),
      expect.objectContaining({ commit: CORE_COMMIT, repositoryId: "repo-core" }),
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-structure-pattern-build-preview-integration.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));

    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining("dispatch-structure-pattern-build-preview-v0-2026-09-04-01"),
      repositoryId: "repo-project-control",
    });
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("automatic-returned");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(EDITOR_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(BACKEND_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(CORE_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("432 passed");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("346 passed / 27 skipped");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("1155 passed");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not promote FlowDoc product truth");

    expect(docText).toContain("# FlowDoc Structure Pattern Build/Preview Integration v0 Acceptance");
    expect(docText).toContain("acceptanceGate");
    expect(docText).toContain("automatic-returned");
    expect(docText).toContain("lane-editor-build-preview-structure-pattern-v0");
    expect(docText).toContain("lane-backend-structure-pattern-v0-0-2-alignment");
    expect(docText).toContain("lane-core-structure-pattern-boundary-probe");
    expect(docText).toContain(EDITOR_COMMIT);
    expect(docText).toContain(BACKEND_COMMIT);
    expect(docText).toContain(CORE_COMMIT);
    expect(docText).toContain("Build defines Structure Pattern Slots");
    expect(docText).toContain("Preview simulates Structure Pattern Entries");
    expect(docText).toContain("Backend freezes only Structure Patterns referenced by slots");
    expect(docText).toContain("Core rejects runtime entries and submitted values");
    expect(docText).toContain("No runtime submission model");
    expect(docText).toContain("No generated PDF files");
    expect(docText).toContain("does not promote FlowDoc product truth or map truth");
  });
});
