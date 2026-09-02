import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-active-return-channel-hardening";
const CHECKLIST_ID = "checklist-agent-and-skill-design-active-return-channel-hardening";
const EVIDENCE_ID = "evidence-flowdoc-active-return-channel-hardening-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc active WORK-to-PLAN return channel hardening", () => {
  it("records that automatic return requires active push and a monitorable PLAN locator", async () => {
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

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      repositoryIds: ["repo-project-control"],
      workState: "in-progress",
    });
    expect(work?.summary).toContain("active WORK-to-PLAN return push");
    expect(work?.expectedOutput).toContain("PLAN task/chat ID");
    expect(work?.riskSummary).toContain("clientThreadId-only dispatch");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("active WORK-to-PLAN return push");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-return-channel-failure",
      "write-red-active-return-channel-guard",
      "define-active-return-push",
      "define-client-thread-id-locator-boundary",
      "route-active-return-to-kickoff-packets",
      "record-active-return-channel-hardening",
      "verify-active-return-channel-hardening",
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
    expect(evidence?.verificationSummary).toContain("active WORK-to-PLAN return push");
    expect(evidence?.verificationSummary).toContain("clientThreadId-only dispatch");
    expect(evidence?.verificationSummary).toContain("does not prove future Codex automatic room wakeups");

    for (const content of [
      agentOnboarding,
      globalGuidance,
      agentSkillModel,
      deliveryModel,
      orchestrationRules,
      workTypeModel,
    ]) {
      expect(content).toContain("active WORK-to-PLAN return push");
      expect(content).toContain("PLAN task/chat ID");
      expect(content).toContain("Return Event ID");
      expect(content).toContain("send_message_to_thread");
      expect(content).toContain("`clientThreadId` alone");
      expect(content).toContain("not a monitorable retrievable locator");
      expect(content).toContain("return-channel-failed-then-recovered");
    }

    expect(orchestrationRules).toContain("WORK room final answer alone is not an active Return Channel");
    expect(orchestrationRules).toContain("must not open a scalable multi-WORK dispatch set");
    expect(workTypeModel).toContain("Active Return Command");
    expect(workTypeModel).toContain("PLAN can enqueue it without manual locator discovery");
    expect(firstRoundPlan).toContain("clientThreadId-only dispatch did not satisfy automatic return");
    expect(firstRoundPlan).toContain("return-channel-failed-then-recovered");
  });
});
