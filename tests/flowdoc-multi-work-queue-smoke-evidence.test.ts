import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-multi-work-queue-smoke-test";
const CHECKLIST_ID = "checklist-agent-and-skill-design-multi-work-queue-smoke-test";
const EVIDENCE_ID = "evidence-flowdoc-multi-work-queue-smoke-test-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc multi-WORK return queue smoke evidence", () => {
  it("records bounded two-room automatic return queue processing", async () => {
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
    expect(work?.riskSummary).toContain("product WORK active return remains unproven");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("two projectless WORK tasks");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "dispatch-two-return-channel-queue-work-rooms",
      "receive-alpha-active-return",
      "receive-beta-active-return",
      "assign-completion-queue-arrival-sequence",
      "run-two-room-acceptance-gate",
      "preserve-product-work-unknowns",
      "record-multi-work-queue-smoke-evidence",
      "verify-multi-work-queue-smoke-evidence",
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
    expect(evidence?.pathOrContractId).toContain("dispatch-return-channel-queue-2026-09-02-01");
    expect(evidence?.pathOrContractId).toContain("handoff-return-channel-queue-alpha-2026-09-02-01");
    expect(evidence?.pathOrContractId).toContain("handoff-return-channel-queue-beta-2026-09-02-01");
    expect(evidence?.verificationSummary).toContain("arrivalSequence 1");
    expect(evidence?.verificationSummary).toContain("arrivalSequence 2");
    expect(evidence?.verificationSummary).toContain("completionQueue");
    expect(evidence?.verificationSummary).toContain("does not prove product WORK");
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");

    expect(orchestrationRules).toContain("two-room projectless return-channel queue smoke test");
    expect(orchestrationRules).toContain("product WORK active return remains unproven");
    expect(firstRoundPlan).toContain("two-room active return queue smoke test");
    expect(firstRoundPlan).toContain("Next recommended product-return test");
  });
});
