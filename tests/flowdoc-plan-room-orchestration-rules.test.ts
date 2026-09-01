import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-plan-room-orchestration-rules";
const DOC_PATH = "docs/domains/flowdoc-plan-room-orchestration-rules.md";
const PHASE_ID = "phase-agent-and-skill-design-plan-room-orchestration-rules";
const CHECKLIST_ID = "checklist-agent-and-skill-design-plan-room-orchestration-rules";
const EVIDENCE_ID = "evidence-flowdoc-plan-room-orchestration-rules-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc PLAN room orchestration rules", () => {
  it("records the N WORK room orchestration contract in Project Control", async () => {
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
    expect(work?.summary).toContain("N WORK rooms");
    expect(work?.riskSummary).toContain("handoff");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("PLAN Room Orchestration Rules");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-plan-orchestration-context",
      "write-red-plan-orchestration-guard",
      "define-n-work-room-assessment",
      "define-room-run-registry",
      "define-handoff-inbox-and-completion-queue",
      "route-plan-orchestration-entrypoints",
      "record-plan-orchestration-records",
      "verify-plan-orchestration-gate",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.verificationNote !== undefined)).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("PLAN room orchestration"),
      lifecycle: "active",
      nodeIds: ["project-control"],
      path: DOC_PATH,
      role: "contract",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual([
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-plan-room-orchestration-rules.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]);
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining(DOC_PATH),
      repositoryId: "repo-project-control",
    });
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("N WORK rooms");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not open WORK rooms");

    expect(docText).toContain("# FlowDoc PLAN Room Orchestration Rules");
    expect(docText).toContain("Work path: `flowdoc-product-development-resumption > agent-and-skill-design`");
    expect(docText).toContain("N WORK rooms");
    expect(docText).toContain("parallelLimit");
    expect(docText).toContain("laneDependencyGraph");
    expect(docText).toContain("Room Run Registry");
    expect(docText).toContain("handoffInbox");
    expect(docText).toContain("completionQueue");
    expect(docText).toContain("acceptanceGate");
    expect(docText).toContain("If multiple WORK rooms finish before the PLAN room processes them, enqueue every returned handoff");
    expect(docText).toContain("If a WORK room does not push a final handoff back to the PLAN room");
    expect(docText).toContain("A real WORK room is still a separate Codex task/chat visible to `ตูม`");
    expect(docText).toContain("This document does not open WORK rooms");
  });

  it("routes future PLAN rooms from agent entrypoints to the orchestration rules", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const agentOnboarding = normalize(documents.get("doc-project-control-agent-onboarding")?.content);
    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);
    const agentSkillModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);
    const deliveryModel = normalize(documents.get("doc-flowdoc-delivery-operating-model")?.content);
    const firstRoundPlan = normalize(documents.get("doc-flowdoc-first-delivery-round-plan")?.content);

    for (const content of [agentOnboarding, globalGuidance, agentSkillModel, deliveryModel]) {
      expect(content).toContain(DOC_PATH);
      expect(content).toContain("PLAN Room Orchestration Rules");
    }

    expect(firstRoundPlan).toContain(DOC_PATH);
    expect(firstRoundPlan).toContain("dispatch set");
    expect(firstRoundPlan).toContain("Core WORK room returned a handoff candidate outside automatic PLAN-room push");
  });
});
