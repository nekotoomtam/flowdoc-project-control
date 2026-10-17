import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-first-delivery-round";
const DOC_ID = "doc-flowdoc-first-delivery-owner-lanes-acceptance-2026-09-03";
const DOC_PATH = "docs/domains/flowdoc-first-delivery-owner-lanes-acceptance-2026-09-03.md";
const PHASE_ID = "phase-flowdoc-first-delivery-owner-lanes-acceptance";
const CHECKLIST_ID = "checklist-flowdoc-first-delivery-owner-lanes-acceptance";
const BACKEND_EVIDENCE_ID = "evidence-flowdoc-backend-gateway-database-accepted-2026-09-03";
const EDITOR_EVIDENCE_ID = "evidence-flowdoc-editor-structure-publish-accepted-2026-09-03";
const BACKEND_COMMIT = "d20b905bf7da33d93d7f4b05117fd1a3ad0bb47a";
const EDITOR_COMMIT = "15c956d5c887f938a828c80dc45ababe08c7569d";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc first delivery owner lane acceptance", () => {
  it("records PLAN acceptance for Backend gateway/database and Editor structure/publish", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);

    const acceptanceDocText = normalize(documents.get(DOC_ID)?.content);
    const firstRoundPlanText = normalize(documents.get("doc-flowdoc-first-delivery-round-plan")?.content);

    expect(work).toMatchObject({
      activeRole: "planning-partner",
      contextDocumentIds: expect.arrayContaining([DOC_ID]),
      nodeId: "flowdoc",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      repositoryIds: expect.arrayContaining(["repo-project-control", "repo-backend", "repo-editor", "repo-core"]),
      requiredEvidence: expect.arrayContaining([BACKEND_EVIDENCE_ID, EDITOR_EVIDENCE_ID]),
      workState: "in-progress",
    });
    expect(work?.summary).toContain("Backend gateway/database handoff");
    expect(work?.summary).toContain("Editor structure/publish handoff");
    expect(work?.expectedOutput).toContain("accepted Backend gateway/database evidence");
    expect(work?.expectedOutput).toContain("accepted Editor structure/publish evidence");
    expect(work?.riskSummary).toContain("integration evidence remains held");

    expect(phase).toMatchObject({
      activeRole: "evidence-reviewer",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-backend", "repo-editor"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("lane-backend-gateway-database");
    expect(phase?.verificationTarget).toContain("lane-editor-structure-publish");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "stage-owner-lane-handoffs",
      "verify-backend-gateway-database-locator",
      "verify-editor-structure-publish-locator",
      "run-owner-repository-main-gates",
      "accept-backend-gateway-database-handoff",
      "accept-editor-structure-publish-handoff",
      "preserve-integration-and-map-boundary",
      "record-owner-lane-evidence",
      "verify-project-control-owner-lane-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);

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
        pathOrContractId: expect.stringContaining("firstDeliveryGatewayRoute.ts"),
        repositoryId: "repo-backend",
      }),
      expect.objectContaining({
        commit: EDITOR_COMMIT,
        pathOrContractId: expect.stringContaining("PublishBoundaryView.tsx"),
        repositoryId: "repo-editor",
      }),
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-first-delivery-owner-lanes-acceptance.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));

    expect(evidence.get(BACKEND_EVIDENCE_ID)).toMatchObject({
      commit: BACKEND_COMMIT,
      nodeIds: [],
      pathOrContractId: expect.stringContaining("lane-backend-gateway-database"),
      repositoryId: "repo-backend",
    });
    expect(evidence.get(BACKEND_EVIDENCE_ID)?.pathOrContractId).toContain("01a06519-c3a4-70c0-9993-8264cc0418ac");
    expect(evidence.get(BACKEND_EVIDENCE_ID)?.verificationSummary).toContain("automatic-returned");
    expect(evidence.get(BACKEND_EVIDENCE_ID)?.verificationSummary).toContain("POST /first-delivery/pdf-exports");
    expect(evidence.get(BACKEND_EVIDENCE_ID)?.verificationSummary).toContain("does not run renderer");

    expect(evidence.get(EDITOR_EVIDENCE_ID)).toMatchObject({
      commit: EDITOR_COMMIT,
      nodeIds: [],
      pathOrContractId: expect.stringContaining("lane-editor-structure-publish"),
      repositoryId: "repo-editor",
    });
    expect(evidence.get(EDITOR_EVIDENCE_ID)?.pathOrContractId).toContain("01a06519-c810-77d1-9382-b50f2bca2a18");
    expect(evidence.get(EDITOR_EVIDENCE_ID)?.verificationSummary).toContain("automatic-returned");
    expect(evidence.get(EDITOR_EVIDENCE_ID)?.verificationSummary).toContain("/documents/:documentId/publish");
    expect(evidence.get(EDITOR_EVIDENCE_ID)?.verificationSummary).toContain("publish submission unavailable");

    expect(acceptanceDocText).toContain("# FlowDoc First Delivery Owner Lane Acceptance");
    expect(acceptanceDocText).toContain("dispatch-first-delivery-owner-lanes-2026-09-03-01");
    expect(acceptanceDocText).toContain("lane-backend-gateway-database");
    expect(acceptanceDocText).toContain("lane-editor-structure-publish");
    expect(acceptanceDocText).toContain(BACKEND_COMMIT);
    expect(acceptanceDocText).toContain(EDITOR_COMMIT);
    expect(acceptanceDocText).toContain("automatic-returned");
    expect(acceptanceDocText).toContain("integration evidence remains held");
    expect(acceptanceDocText).toContain("does not promote FlowDoc product truth or map truth");

    expect(firstRoundPlanText).toContain("Backend gateway/database handoff");
    expect(firstRoundPlanText).toContain("Editor structure/publish handoff");
    expect(firstRoundPlanText).toContain(BACKEND_COMMIT);
    expect(firstRoundPlanText).toContain(EDITOR_COMMIT);
    expect(firstRoundPlanText).toContain("lane-integration-evidence");
  });
});
