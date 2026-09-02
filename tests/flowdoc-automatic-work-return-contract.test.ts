import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-automatic-work-return-contract";
const CHECKLIST_ID = "checklist-agent-and-skill-design-automatic-work-return-contract";
const EVIDENCE_ID = "evidence-flowdoc-automatic-work-return-contract-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc automatic WORK-to-PLAN return contract", () => {
  it("requires automatic returns, manual recovery boundaries, and queued multi-WORK fan-in", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const evidence = model.evidence.find((entry) => entry.id === EVIDENCE_ID);
    const documents = new Map(model.documents.map((document) => [document.id, document]));

    const agentOnboarding = normalize(documents.get("doc-project-control-agent-onboarding")?.content);
    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);
    const agentSkillModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);
    const deliveryModel = normalize(documents.get("doc-flowdoc-delivery-operating-model")?.content);
    const orchestrationRules = normalize(documents.get("doc-flowdoc-plan-room-orchestration-rules")?.content);
    const workTypeModel = normalize(documents.get("doc-flowdoc-work-type-routing-model")?.content);
    const firstRoundPlan = normalize(documents.get("doc-flowdoc-first-delivery-round-plan")?.content);
    const coreAcceptance = normalize(documents.get("doc-flowdoc-first-delivery-core-pdf-boundary-acceptance-2026-09-02")?.content);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      repositoryIds: ["repo-project-control"],
      workState: "in-progress",
    });
    expect(work?.summary).toContain("automatic WORK-to-PLAN return");
    expect(work?.expectedOutput).toContain("completionQueue");
    expect(work?.riskSummary).toContain("manual recovery");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("automatic WORK-to-PLAN return");
    expect(phase?.verificationTarget).toContain("multi-WORK completionQueue");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-automatic-return-context",
      "write-red-automatic-return-guard",
      "define-automatic-work-to-plan-return",
      "define-multi-work-completion-queue-ordering",
      "define-manual-recovery-boundary",
      "route-automatic-return-to-entrypoints",
      "record-automatic-return-contract-records",
      "verify-automatic-return-contract-gate",
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
    expect(evidence?.verificationSummary).toContain("automatic WORK-to-PLAN return");
    expect(evidence?.verificationSummary).toContain("manual recovery fallback");
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");

    for (const content of [
      agentOnboarding,
      globalGuidance,
      agentSkillModel,
      deliveryModel,
      orchestrationRules,
      workTypeModel,
      firstRoundPlan,
    ]) {
      expect(content).toContain("Automatic WORK-to-PLAN return is mandatory");
      expect(content).toContain("must not require `ตูม` to copy/paste Terminal Handoffs");
      expect(content).toContain("manual recovery fallback");
      expect(content).toContain("does not satisfy automatic return");
      expect(content).toContain("multiple active WORK rooms");
      expect(content).toContain("completionQueue");
      expect(content).toContain("returnOrderPolicy");
      expect(content).toContain("arrivalSequence");
      expect(content).toContain("one queued handoff at a time");
      expect(content).toContain("duplicate handoff");
      expect(content).toContain("manual-recovered");
      expect(content).toContain("return-channel-failed");
      expect(content).not.toContain("PLAN receives or pulls");
    }

    expect(orchestrationRules).toContain("BLOCKER, FAIL, Contract Change Request, then ordinary PASS");
    expect(orchestrationRules).toContain("PLAN may pull by retrievable locator only to recover or classify the room");
    expect(orchestrationRules).toContain("must not open dependent lanes from a manual-recovered handoff until PLAN records the automatic-return gap");
    expect(workTypeModel).toContain("Automatic Return Channel");
    expect(workTypeModel).toContain("Return Event ID");
    expect(deliveryModel).toContain("A dispatch set is not accepted as scalable until every active WORK room has a direct Return Channel");

    expect(firstRoundPlan).toContain("The first Core WORK-room trial did not satisfy automatic return");
    expect(firstRoundPlan).toContain("manual-recovered");
    expect(coreAcceptance).toContain("manual-recovered");
    expect(coreAcceptance).toContain("does not prove automatic WORK-to-PLAN return");
  });
});
