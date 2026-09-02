import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-lean-dispatch-operating-rules";
const DOC_PATH = "docs/domains/flowdoc-lean-dispatch-operating-rules.md";
const PHASE_ID = "phase-agent-and-skill-design-lean-dispatch-operating-rules";
const CHECKLIST_ID = "checklist-agent-and-skill-design-lean-dispatch-operating-rules";
const EVIDENCE_ID = "evidence-flowdoc-lean-dispatch-operating-rules-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc lean PLAN/WORK dispatch operating rules", () => {
  it("registers a Project Control contract for reducing PLAN/WORK resource cost", async () => {
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
        "doc-flowdoc-plan-room-orchestration-rules",
        "doc-flowdoc-work-type-routing-model",
        "doc-flowdoc-first-delivery-round-plan",
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
    expect(work?.summary).toContain("Lean Dispatch");
    expect(work?.expectedOutput).toContain("contextBudget");
    expect(work?.riskSummary).toContain("token");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Lean Dispatch");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-lean-dispatch-context",
      "write-red-lean-dispatch-guard",
      "define-resource-budget-fields",
      "define-lean-kickoff-packet",
      "define-reference-pack-and-escalation",
      "define-verification-and-evidence-tiers",
      "route-lean-mode-to-plan-and-work-type-docs",
      "verify-lean-dispatch-gate",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.verificationNote !== undefined)).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("Lean Dispatch"),
      lifecycle: "active",
      nodeIds: ["project-control"],
      path: DOC_PATH,
      role: "contract",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-lean-dispatch-operating-rules.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining(DOC_PATH),
      repositoryId: "repo-project-control",
    });
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("Lean Dispatch");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not open WORK rooms");

    expect(docText).toContain("# FlowDoc Lean Dispatch Operating Rules");
    expect(docText).toContain("Work path: `flowdoc-product-development-resumption > agent-and-skill-design`");
    expect(docText).toContain("Lean Dispatch");
    expect(docText).toContain("Resource Budget");
    expect(docText).toContain("contextBudget");
    expect(docText).toContain("verificationTier");
    expect(docText).toContain("reviewTier");
    expect(docText).toContain("evidenceMode");
    expect(docText).toContain("handoffDetail");
    expect(docText).toContain("docReadPolicy");
    expect(docText).toContain("Lean Kickoff Packet");
    expect(docText).toContain("Reference Pack");
    expect(docText).toContain("Verification Tiers");
    expect(docText).toContain("Evidence Batching");
    expect(docText).toContain("Escalation Triggers");
    expect(docText).toContain("automatic WORK-to-PLAN return");
    expect(docText).toContain("completionQueue");
    expect(docText).toContain("arrivalSequence");
    expect(docText).toContain("acceptanceGate");
    expect(docText).toContain("must not remove automatic return, liveness, retrievable locator, or acceptanceGate");
    expect(docText).toContain("`product-implementation`");
    expect(docText).toContain("`ux-design-exploration`");
    expect(docText).toContain("`evidence-review`");
    expect(docText).toContain("does not prove FlowDoc product truth or map truth");
  });

  it("routes future dispatch packets to Lean Dispatch without weakening return or acceptance", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const agentOnboarding = normalize(documents.get("doc-project-control-agent-onboarding")?.content);
    const agentSkillModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);
    const deliveryModel = normalize(documents.get("doc-flowdoc-delivery-operating-model")?.content);
    const orchestrationRules = normalize(documents.get("doc-flowdoc-plan-room-orchestration-rules")?.content);
    const workTypeModel = normalize(documents.get("doc-flowdoc-work-type-routing-model")?.content);
    const firstRoundPlan = normalize(documents.get("doc-flowdoc-first-delivery-round-plan")?.content);

    for (const content of [agentOnboarding, agentSkillModel, deliveryModel, orchestrationRules, workTypeModel]) {
      expect(content).toContain(DOC_PATH);
      expect(content).toContain("Lean Dispatch");
    }

    expect(orchestrationRules).toContain("lean mode is a budget profile, not a weaker orchestration mode");
    expect(orchestrationRules).toContain("must not remove automatic return, liveness, retrievable locator, or acceptanceGate");
    expect(orchestrationRules).toContain("compact Terminal Handoff");
    expect(workTypeModel).toContain("Lean Dispatch Defaults By Work Type");
    expect(workTypeModel).toContain("`ux-design-exploration`");
    expect(workTypeModel).toContain("mockup");
    expect(firstRoundPlan).toContain("next multi-product-WORK dispatch should use Lean Dispatch");
    expect(firstRoundPlan).toContain("compact handoff");
  });
});
