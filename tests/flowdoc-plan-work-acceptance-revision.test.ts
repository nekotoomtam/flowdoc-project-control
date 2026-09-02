import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-plan-work-acceptance-revision";
const CHECKLIST_ID = "checklist-agent-and-skill-design-plan-work-acceptance-revision";
const EVIDENCE_ID = "evidence-flowdoc-plan-work-acceptance-revision-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc PLAN and WORK acceptance revision loop", () => {
  it("records that PLAN owns Project Control reporting and WORK revisions stay lane-bounded", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const evidence = model.evidence.find((entry) => entry.id === EVIDENCE_ID);
    const documents = new Map(model.documents.map((document) => [document.id, document]));

    const orchestrationRules = normalize(documents.get("doc-flowdoc-plan-room-orchestration-rules")?.content);
    const workTypeModel = normalize(documents.get("doc-flowdoc-work-type-routing-model")?.content);
    const deliveryModel = normalize(documents.get("doc-flowdoc-delivery-operating-model")?.content);
    const firstRoundPlan = normalize(documents.get("doc-flowdoc-first-delivery-round-plan")?.content);
    const agentSkillModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);
    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      repositoryIds: ["repo-project-control"],
      workState: "in-progress",
    });
    expect(work?.summary).toContain("PLAN-owned reporting");
    expect(work?.expectedOutput).toContain("Revision Packet");
    expect(work?.riskSummary).toContain("self-promote");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("PLAN-owned reporting");
    expect(phase?.verificationTarget).toContain("Revision Packet");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-plan-work-acceptance-revision-context",
      "write-red-plan-work-acceptance-revision-guard",
      "define-plan-owned-project-control-reporting",
      "define-revision-packet-loop",
      "route-revision-loop-to-entrypoints",
      "record-plan-work-acceptance-revision-records",
      "verify-plan-work-acceptance-revision-gate",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

    expect(evidence).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      repositoryId: "repo-project-control",
    });
    expect(evidence?.verificationSummary).toContain("PLAN-owned reporting");
    expect(evidence?.verificationSummary).toContain("Revision Packet");
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");

    for (const content of [orchestrationRules, workTypeModel, deliveryModel, firstRoundPlan, agentSkillModel, globalGuidance]) {
      expect(content).toContain("PLAN-owned reporting");
      expect(content).toContain("evidence candidate");
      expect(content).toContain("must not self-promote");
      expect(content).toContain("Revision Packet");
      expect(content).toContain("same WORK room");
      expect(content).toContain("needs-revision");
      expect(content).toContain("Contract Change Request");
    }

    expect(orchestrationRules).toContain("If acceptanceGate rejects or cannot accept a returned handoff");
    expect(orchestrationRules).toContain("revisionAttempt");
    expect(orchestrationRules).toContain("original retrievable locator");
    expect(orchestrationRules).toContain("If the same WORK room is unavailable");

    expect(workTypeModel).toContain("Product WORK rooms return evidence candidates");
    expect(workTypeModel).toContain("PLAN or a Project Control records lane writes Project Control records");

    expect(firstRoundPlan).toContain("Product WORK rooms for Core, Backend, and Editor must not write Project Control acceptance records");
    expect(firstRoundPlan).toContain("PLAN sends a Revision Packet back to the same WORK room");
  });
});
