import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-backend-document-structure-database-v0-0-1";
const PARENT_WORK_ID = "flowdoc-document-structure-database-model";
const DOC_ID = "doc-flowdoc-backend-document-structure-database-v0-0-1-2026-09-04";
const DOC_PATH = "docs/domains/flowdoc-backend-document-structure-database-v0-0-1-2026-09-04.md";
const PHASE_ID = "phase-flowdoc-backend-document-structure-database-v0-0-1";
const CHECKLIST_ID = "checklist-flowdoc-backend-document-structure-database-v0-0-1";
const EVIDENCE_ID = "evidence-flowdoc-backend-document-structure-database-v0-0-1-2026-09-04";
const BACKEND_COMMIT = "619dd32decf68ec7f1c3d1e68b64619beeb702c3";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Backend document structure database v0.0.1 acceptance", () => {
  it("records PLAN acceptance of the Backend document-structure database implementation lane", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const parentWork = model.work.find((item) => item.id === PARENT_WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);

    const docText = normalize(documents.get(DOC_ID)?.content);
    const modelDocText = normalize(documents.get("doc-flowdoc-document-structure-database-model-2026-09-04")?.content);

    expect(parentWork?.childWorkIds).toContain(WORK_ID);
    expect(parentWork?.requiredEvidence).toContain(EVIDENCE_ID);
    expect(parentWork?.contextDocumentIds).toContain(DOC_ID);

    expect(work).toMatchObject({
      activeRole: "evidence-reviewer",
      contextDocumentIds: expect.arrayContaining([
        "doc-flowdoc-document-structure-database-model-2026-09-04",
        DOC_ID,
      ]),
      nodeId: "flowdoc",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      repositoryIds: ["repo-project-control", "repo-backend"],
      requiredEvidence: [EVIDENCE_ID],
      workKind: "task",
      workPathIds: ["flowdoc-product-development-resumption", PARENT_WORK_ID, WORK_ID],
      workState: "in-review",
    });
    expect(work?.summary).toContain("Backend document-structure database v0.0.1");
    expect(work?.riskSummary).toContain("HTTP gateway routes remain unknown");

    expect(phase).toMatchObject({
      activeRole: "evidence-reviewer",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-backend"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain(BACKEND_COMMIT);
    expect(phase?.verificationTarget).toContain("component version create-or-select");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "stage-backend-document-structure-handoff",
      "review-and-return-backend-document-structure-revision",
      "verify-backend-document-structure-locator",
      "run-backend-document-structure-owner-gates",
      "accept-backend-document-structure-database-handoff",
      "record-backend-document-structure-evidence",
      "preserve-backend-document-structure-boundaries",
      "record-backend-document-structure-cleanup-risk",
      "verify-project-control-backend-document-structure-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("PLAN acceptance"),
      lifecycle: "active",
      nodeIds: [],
      path: DOC_PATH,
      role: "verification",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: BACKEND_COMMIT,
        pathOrContractId: expect.stringContaining("src/documentStructure/documentStructureRepository.ts"),
        repositoryId: "repo-backend",
      }),
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-backend-document-structure-database-acceptance.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));

    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: BACKEND_COMMIT,
      nodeIds: [],
      pathOrContractId: expect.stringContaining("src/documentStructure/documentStructureRepository.ts"),
      repositoryId: "repo-backend",
    });
    expect(evidence.get(EVIDENCE_ID)?.pathOrContractId).toContain("01a06a8a-8e11-74c3-9b42-c94afd60ae3a");
    expect(evidence.get(EVIDENCE_ID)?.pathOrContractId).toContain("handoff-backend-document-structure-database-v0-0-1-2026-09-04-01-revision-1");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("automatic-returned");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("needs-revision");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("component version create-or-select");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("343 passed / 27 skipped");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not prove HTTP gateway routes");

    expect(docText).toContain("# FlowDoc Backend Document Structure Database v0.0.1 Acceptance");
    expect(docText).toContain("acceptanceGate");
    expect(docText).toContain("automatic-returned");
    expect(docText).toContain("needs-revision");
    expect(docText).toContain("lane-backend-document-structure-database-v0-0-1");
    expect(docText).toContain(BACKEND_COMMIT);
    expect(docText).toContain("document structure database v0.0.1 foundations");
    expect(docText).toContain("section parent tree validation");
    expect(docText).toContain("component version create-or-select");
    expect(docText).toContain("No HTTP gateway route");
    expect(docText).toContain("No runtime submitted values");
    expect(docText).toContain("No generated PDF files");
    expect(docText).toContain("does not promote FlowDoc product truth or map truth");
    expect(docText).toContain("residual directory");

    expect(modelDocText).toContain("auto-create or select component_versions");
  });
});
