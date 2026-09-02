import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-return-channel-smoke-test";
const CHECKLIST_ID = "checklist-agent-and-skill-design-return-channel-smoke-test";
const EVIDENCE_ID = "evidence-flowdoc-return-channel-smoke-test-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc return-channel smoke evidence", () => {
  it("records the bounded single-room active return-channel smoke test", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const evidence = model.evidence.find((entry) => entry.id === EVIDENCE_ID);
    const documents = new Map(model.documents.map((document) => [document.id, document]));

    const orchestrationRules = normalize(documents.get("doc-flowdoc-plan-room-orchestration-rules")?.content);
    const firstRoundPlan = normalize(documents.get("doc-flowdoc-first-delivery-round-plan")?.content);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      repositoryIds: ["repo-project-control"],
      workState: "in-progress",
    });
    expect(work?.riskSummary).toContain("multi-WORK active return");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("single-room active Return Channel");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "dispatch-return-channel-smoke-work-room",
      "receive-active-return-channel-handoff",
      "accept-single-room-smoke-handoff",
      "preserve-multi-work-unknown",
      "record-return-channel-smoke-evidence",
      "verify-return-channel-smoke-evidence",
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
    expect(evidence?.pathOrContractId).toContain("handoff-return-channel-smoke-2026-09-02-01");
    expect(evidence?.verificationSummary).toContain("WORK RETURN EVENT: handoff-return-channel-smoke-2026-09-02-01");
    expect(evidence?.verificationSummary).toContain("mcp__codex_app.send_message_to_thread");
    expect(evidence?.verificationSummary).toContain("does not prove multi-WORK");
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");

    expect(orchestrationRules).toContain("single-room projectless return-channel smoke test");
    expect(orchestrationRules).toContain("does not prove multi-WORK");
    expect(firstRoundPlan).toContain("single-room active return smoke test");
    expect(firstRoundPlan).toContain("Next recommended return test");
  });
});
