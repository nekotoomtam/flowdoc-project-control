import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-first-delivery-round";
const DOC_ID = "doc-flowdoc-first-delivery-backend-pdf-boundary-pre-admission-smoke-2026-09-02";
const DOC_PATH = "docs/domains/flowdoc-first-delivery-backend-pdf-boundary-pre-admission-smoke-2026-09-02.md";
const PHASE_ID = "phase-flowdoc-first-delivery-round-backend-pdf-boundary-pre-admission-smoke";
const CHECKLIST_ID = "checklist-flowdoc-first-delivery-round-backend-pdf-boundary-pre-admission-smoke";
const EVIDENCE_ID = "evidence-flowdoc-backend-pdf-boundary-pre-admission-smoke-2026-09-02";
const BACKEND_COMMIT = "5427ebc12bfe52e0961fbdc35544e476ee0fd484";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc first delivery Backend pre-admission product-edit return smoke", () => {
  it("records PLAN acceptance of the automatically returned Backend WORK room handoff", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);

    const acceptanceDocText = normalize(documents.get(DOC_ID)?.content);
    const firstRoundPlanText = normalize(documents.get("doc-flowdoc-first-delivery-round-plan")?.content);
    const orchestrationRulesText = normalize(documents.get("doc-flowdoc-plan-room-orchestration-rules")?.content);

    expect(work).toMatchObject({
      activeRole: "planning-partner",
      contextDocumentIds: expect.arrayContaining([DOC_ID]),
      nodeId: "flowdoc",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      repositoryIds: expect.arrayContaining(["repo-project-control", "repo-backend", "repo-core"]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      workState: "in-progress",
    });
    expect(work?.summary).toContain("Backend PDF boundary pre-admission");
    expect(work?.expectedOutput).toContain("automatic WORK-to-PLAN return");
    expect(work?.riskSummary).toContain("gateway behavior remains unknown");

    expect(phase).toMatchObject({
      activeRole: "evidence-reviewer",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-backend"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("automatic WORK-to-PLAN return");
    expect(phase?.verificationTarget).toContain(BACKEND_COMMIT);

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "stage-backend-handoff-inbox-candidate",
      "verify-backend-room-run-locator",
      "review-backend-work-room-output",
      "run-backend-owner-repository-gates",
      "accept-backend-pre-admission-smoke-handoff",
      "record-backend-pre-admission-smoke-evidence",
      "preserve-backend-gateway-boundary",
      "verify-project-control-backend-smoke-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

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
        pathOrContractId: expect.stringContaining("pdfExportPublishedStructurePreAdmission.ts"),
        repositoryId: "repo-backend",
      }),
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-first-delivery-backend-pre-admission-smoke.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));

    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: BACKEND_COMMIT,
      nodeIds: [],
      pathOrContractId: expect.stringContaining("src/pdfExport/pdfExportPublishedStructurePreAdmission.ts"),
      repositoryId: "repo-backend",
    });
    expect(evidence.get(EVIDENCE_ID)?.pathOrContractId).toContain("01a06166-428a-75e3-8cee-911d4d4c53f2");
    expect(evidence.get(EVIDENCE_ID)?.pathOrContractId).toContain("handoff-backend-pdf-boundary-pre-admission-smoke-2026-09-02-01");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("automatic-returned");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("createFlowDocBackendPdfExportPublishedStructurePreAdmissionV1");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("npm run check");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("91 passed / 1 skipped test file");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("2 high severity audit findings");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not prove Backend gateway readiness");

    expect(acceptanceDocText).toContain("# FlowDoc First Delivery Backend PDF Boundary Pre-Admission Smoke");
    expect(acceptanceDocText).toContain("flowdoc-product-development-resumption > flowdoc-first-delivery-round");
    expect(acceptanceDocText).toContain("handoffInbox");
    expect(acceptanceDocText).toContain("acceptanceGate");
    expect(acceptanceDocText).toContain("automatic-returned");
    expect(acceptanceDocText).toContain("lane-backend-pdf-boundary-pre-admission-smoke");
    expect(acceptanceDocText).toContain(BACKEND_COMMIT);
    expect(acceptanceDocText).toContain("createFlowDocBackendPdfExportPublishedStructurePreAdmissionV1");
    expect(acceptanceDocText).toContain("No Backend route");
    expect(acceptanceDocText).toContain("No API key exposure");
    expect(acceptanceDocText).toContain("No storage writes");
    expect(acceptanceDocText).toContain("No PDF bytes");
    expect(acceptanceDocText).toContain("No renderer execution");
    expect(acceptanceDocText).toContain("gateway behavior remains unknown");
    expect(acceptanceDocText).toContain("does not promote FlowDoc product truth or map truth");

    expect(firstRoundPlanText).toContain("Backend product-edit active return smoke");
    expect(firstRoundPlanText).toContain("lane-backend-pdf-boundary-pre-admission-smoke");
    expect(firstRoundPlanText).toContain(BACKEND_COMMIT);
    expect(firstRoundPlanText).toContain("automatic-returned");

    expect(orchestrationRulesText).toContain("Backend product-edit active return smoke");
    expect(orchestrationRulesText).toContain("lane-backend-pdf-boundary-pre-admission-smoke");
    expect(orchestrationRulesText).toContain(BACKEND_COMMIT);
    expect(orchestrationRulesText).toContain("automatic-returned");
  });
});
