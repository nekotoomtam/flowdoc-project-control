import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-first-delivery-round";
const DOC_ID = "doc-flowdoc-first-delivery-core-pdf-boundary-acceptance-2026-09-02";
const DOC_PATH = "docs/domains/flowdoc-first-delivery-core-pdf-boundary-acceptance-2026-09-02.md";
const PHASE_ID = "phase-flowdoc-first-delivery-core-pdf-boundary-acceptance";
const CHECKLIST_ID = "checklist-flowdoc-first-delivery-core-pdf-boundary-acceptance";
const EVIDENCE_ID = "evidence-flowdoc-first-delivery-core-pdf-boundary-accepted-2026-09-02";
const CORE_COMMIT = "da5011ceeac6e0b72b152a9a5029d684af978581";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc first delivery Core PDF boundary acceptance", () => {
  it("records the PLAN acceptance of the returned Core WORK room handoff", async () => {
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
      repositoryIds: expect.arrayContaining(["repo-project-control", "repo-core"]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      workState: "in-progress",
    });
    expect(work?.summary).toContain("Core PDF boundary handoff");
    expect(work?.expectedOutput).toContain("accepted Core boundary");
    expect(work?.riskSummary).toContain("Backend and Editor");

    expect(phase).toMatchObject({
      activeRole: "evidence-reviewer",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-core"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Core WORK room handoff");
    expect(phase?.verificationTarget).toContain("acceptanceGate");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "stage-core-handoff-inbox-candidate",
      "verify-core-room-run-locator",
      "run-core-owner-repository-gates",
      "accept-core-pdf-boundary-handoff",
      "record-core-acceptance-evidence",
      "preserve-first-delivery-map-boundary",
      "verify-project-control-acceptance-records",
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
        commit: CORE_COMMIT,
        pathOrContractId: expect.stringContaining("publishedStructurePdfBoundaryV1.ts"),
        repositoryId: "repo-core",
      }),
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-first-delivery-core-boundary-acceptance.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));

    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: CORE_COMMIT,
      nodeIds: [],
      pathOrContractId: expect.stringContaining("src/generation/publishedStructurePdfBoundaryV1.ts"),
      repositoryId: "repo-core",
    });
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("PLAN acceptanceGate accepted");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("lane-core-document-pdf-boundary");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("createVNextPublishedStructurePdfBoundaryPlanV1");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("462 files / 2,957 tests");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not prove Backend or Editor adoption");

    expect(acceptanceDocText).toContain("# FlowDoc First Delivery Core PDF Boundary Acceptance");
    expect(acceptanceDocText).toContain("flowdoc-product-development-resumption > flowdoc-first-delivery-round");
    expect(acceptanceDocText).toContain("handoffInbox");
    expect(acceptanceDocText).toContain("acceptanceGate");
    expect(acceptanceDocText).toContain("accepted");
    expect(acceptanceDocText).toContain("lane-core-document-pdf-boundary");
    expect(acceptanceDocText).toContain(CORE_COMMIT);
    expect(acceptanceDocText).toContain("createVNextPublishedStructurePdfBoundaryPlanV1");
    expect(acceptanceDocText).toContain("No Backend route");
    expect(acceptanceDocText).toContain("No API key exposure");
    expect(acceptanceDocText).toContain("No storage writes");
    expect(acceptanceDocText).toContain("No PDF bytes");
    expect(acceptanceDocText).toContain("No renderer execution");
    expect(acceptanceDocText).toContain("Backend and Editor have not adopted");
    expect(acceptanceDocText).toContain("does not promote FlowDoc product truth or map truth");
    expect(acceptanceDocText).toContain("Next recommended lanes");

    expect(firstRoundPlanText).toContain("Core WORK room handoff has now been accepted by PLAN");
    expect(firstRoundPlanText).toContain("lane-core-document-pdf-boundary");
    expect(firstRoundPlanText).toContain(CORE_COMMIT);
    expect(firstRoundPlanText).toContain("Next recommended lanes");
    expect(firstRoundPlanText).not.toContain("No accepted Core room locator is recorded yet");

    expect(orchestrationRulesText).toContain("Core WORK room handoff has now been accepted by PLAN");
    expect(orchestrationRulesText).toContain(CORE_COMMIT);
    expect(orchestrationRulesText).not.toContain("No accepted Core room locator is recorded yet");
  });
});
