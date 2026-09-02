import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-first-delivery-round";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-first-delivery-round-plan";
const DOC_PATH = "docs/domains/flowdoc-first-delivery-round-plan.md";
const PHASE_ID = "phase-flowdoc-first-delivery-round-plan";
const CHECKLIST_ID = "checklist-flowdoc-first-delivery-round-plan";
const EVIDENCE_ID = "evidence-flowdoc-first-delivery-round-plan-2026-09-01";
const PLAN_COMMIT = "99488f37bc590af57819c3beab823936e8dd2038";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc First Delivery Round Plan", () => {
  it("records the first delivery round as a Project Control plan before WORK rooms open", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);

    expect(model.work.find((item) => item.id === PARENT_WORK_ID)?.childWorkIds).toContain(WORK_ID);
    expect(model.nodes.find((node) => node.id === "flowdoc")?.documentIds).toContain(DOC_ID);

    expect(work).toMatchObject({
      activeRole: "planning-partner",
      contextDocumentIds: expect.arrayContaining([
        "doc-flowdoc-system-map",
        "doc-document-map-operating-rules",
        "doc-flowdoc-role-catalog",
        "doc-agent-skill-operating-model",
        "doc-flowdoc-round-workflow",
        "doc-flowdoc-delivery-operating-model",
        "doc-work-tree-operating-rules",
        "doc-flowdoc-documentation-authority-policy",
        "doc-flowdoc-agent-documentation-authority-operating-rules",
        "doc-flowdoc-product-terminology",
        "doc-flowdoc-product-terminology-th",
      ]),
      nodeId: "flowdoc",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      repositoryIds: expect.arrayContaining([
        "repo-project-control",
        "repo-editor",
        "repo-backend",
        "repo-core",
      ]),
      workKind: "task",
      workPathIds: [PARENT_WORK_ID, WORK_ID],
      workState: "in-progress",
    });
    expect(work?.expectedOutput).toContain("Lane Cards");
    expect(work?.riskSummary).toContain("product truth");

    expect(phase).toMatchObject({
      activeRole: "planning-partner",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("First Delivery Round Plan");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-first-delivery-context",
      "write-red-first-delivery-round-guard",
      "draft-first-delivery-round-plan",
      "define-first-delivery-lane-cards",
      "define-work-room-kickoff-packets",
      "record-first-delivery-round-records",
      "verify-first-delivery-round-gate",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.verificationNote !== undefined)).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("first delivery round plan"),
      lifecycle: "active",
      nodeIds: ["flowdoc"],
      path: DOC_PATH,
      role: "contract",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: PLAN_COMMIT,
        pathOrContractId: expect.stringContaining("tests/flowdoc-first-delivery-round-plan.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: PLAN_COMMIT,
      nodeIds: [],
      pathOrContractId: expect.stringContaining(DOC_PATH),
      repositoryId: "repo-project-control",
    });
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("first delivery round plan");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("No real WORK room");

    expect(docText).toContain("# FlowDoc First Delivery Round Plan");
    expect(docText).toContain("Work path: `flowdoc-product-development-resumption > flowdoc-first-delivery-round`");
    expect(docText).toContain("PLAN room");
    expect(docText).toContain("WORK room");
    expect(docText).toContain("Structure creation -> API/key exposure -> data input -> PDF output");
    expect(docText).toContain("First Delivery Slice");
    expect(docText).toContain("Project Control SQLite");
    expect(docText).toContain("lane-project-control-round-records");
    expect(docText).toContain("lane-editor-structure-publish");
    expect(docText).toContain("lane-backend-gateway-database");
    expect(docText).toContain("lane-core-document-pdf-boundary");
    expect(docText).toContain("lane-integration-evidence");
    expect(docText).toContain("Room Mode: `WORK`");
    expect(docText).toContain("Contract Change Request");
    expect(docText).toContain("No real WORK room has been opened by this plan");
    expect(docText).not.toMatch(/\bmvp\b/iu);
  });
});
