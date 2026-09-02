import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-work-type-routing-model";
const DOC_PATH = "docs/domains/flowdoc-work-type-routing-model.md";
const PHASE_ID = "phase-agent-and-skill-design-work-type-routing-model";
const CHECKLIST_ID = "checklist-agent-and-skill-design-work-type-routing-model";
const EVIDENCE_ID = "evidence-flowdoc-work-type-routing-model-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc work type routing model", () => {
  it("registers the Work Type and Context Capsule contract in Project Control", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);

    expect(model.work.find((item) => item.id === PARENT_WORK_ID)?.childWorkIds).toContain(WORK_ID);
    expect(model.nodes.find((node) => node.id === "project-control")?.documentIds).toContain(DOC_ID);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      contextDocumentIds: expect.arrayContaining([
        DOC_ID,
        "doc-flowdoc-delivery-operating-model",
        "doc-flowdoc-plan-room-orchestration-rules",
        "doc-flowdoc-first-delivery-round-plan",
        "doc-agent-skill-operating-model",
      ]),
      nodeId: "project-control",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      repositoryIds: ["repo-project-control"],
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      workKind: "task",
      workPathIds: [PARENT_WORK_ID, WORK_ID],
      workState: "in-progress",
    });
    expect(work?.summary).toContain("Work Type");
    expect(work?.expectedOutput).toContain("Context Capsule");
    expect(work?.riskSummary).toContain("context");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Work Type Routing Model");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-work-type-routing-context",
      "write-red-work-type-routing-guard",
      "define-work-type-taxonomy",
      "define-context-capsule",
      "require-context-acknowledgement",
      "route-plan-and-kickoff-packets",
      "record-work-type-routing-records",
      "verify-work-type-routing-gate",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.verificationNote !== undefined)).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("Work Type"),
      lifecycle: "active",
      nodeIds: ["project-control"],
      path: DOC_PATH,
      role: "contract",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-work-type-routing-model.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining(DOC_PATH),
      repositoryId: "repo-project-control",
    });
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("Context Capsule");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not create packaged Codex skills");

    expect(docText).toContain("# FlowDoc Work Type Routing Model");
    expect(docText).toContain("Work path: `flowdoc-product-development-resumption > agent-and-skill-design`");
    expect(docText).toContain("Work Type Taxonomy");
    expect(docText).toContain("`planning-coordination`");
    expect(docText).toContain("`product-implementation`");
    expect(docText).toContain("`evidence-review`");
    expect(docText).toContain("`documentation-authority`");
    expect(docText).toContain("`ux-design-exploration`");
    expect(docText).toContain("`lane-reconciliation`");
    expect(docText).toContain("Context Capsule");
    expect(docText).toContain("Context Acknowledgement");
    expect(docText).toContain("skill candidate");
    expect(docText).toContain("design artifact is not product truth");
    expect(docText).toContain("exact commit");
    expect(docText).toContain("retrievable locator");
  });

  it("routes PLAN rules and first delivery lanes through Work Type context", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const agentOnboarding = normalize(documents.get("doc-project-control-agent-onboarding")?.content);
    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);
    const agentSkillModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);
    const deliveryModel = normalize(documents.get("doc-flowdoc-delivery-operating-model")?.content);
    const planOrchestration = normalize(documents.get("doc-flowdoc-plan-room-orchestration-rules")?.content);
    const firstRoundPlan = normalize(documents.get("doc-flowdoc-first-delivery-round-plan")?.content);

    for (const content of [agentOnboarding, globalGuidance, agentSkillModel, deliveryModel, planOrchestration]) {
      expect(content).toContain(DOC_PATH);
      expect(content).toContain("Work Type Routing Model");
    }

    expect(planOrchestration).toContain("Work Type");
    expect(planOrchestration).toContain("Context Capsule");
    expect(planOrchestration).toContain("Context Acknowledgement");
    expect(planOrchestration).toContain("task/chat ID, worktree/branch, or handoff location");
    expect(planOrchestration).toContain("changed behavior requires exact commit");
    expect(planOrchestration).toContain("retrievable locator");

    expect(firstRoundPlan).toContain("Work Type: `documentation-authority`");
    expect(firstRoundPlan).toContain("Work Type: `product-implementation`");
    expect(firstRoundPlan).toContain("Work Type: `evidence-review`");
    expect(firstRoundPlan).toContain("Context Capsule");
    expect(firstRoundPlan).toContain("Context Acknowledgement");
    expect(firstRoundPlan).toContain("Core WORK room handoff has now been accepted by PLAN");
    expect(firstRoundPlan).toContain("Next recommended lanes");
  });
});
