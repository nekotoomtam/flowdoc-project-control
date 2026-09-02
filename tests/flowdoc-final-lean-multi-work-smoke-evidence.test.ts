import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-final-lean-multi-work-smoke-test";
const CHECKLIST_ID = "checklist-agent-and-skill-design-final-lean-multi-work-smoke-test";
const EVIDENCE_ID = "evidence-flowdoc-final-lean-multi-work-smoke-test-2026-09-02";

describe("FlowDoc final Lean Dispatch multi-WORK smoke evidence", () => {
  it("records automatic return, queued acceptance, and same-room revision without product truth promotion", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const evidence = model.evidence.find((entry) => entry.id === EVIDENCE_ID);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      repositoryIds: ["repo-project-control"],
      workState: "in-progress",
    });
    expect(work?.summary).toContain("final Lean Dispatch multi-WORK smoke");
    expect(work?.riskSummary).toContain("same-room Revision Packet smoke");
    expect(work?.riskSummary).toContain("multi-product-WORK close-together return remains unproven");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("two projectless Lean Dispatch WORK rooms");
    expect(phase?.summary).toContain("same-room revision loop");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "dispatch-final-lean-two-work-rooms",
      "receive-alpha-automatic-pass-return",
      "receive-beta-initial-needs-revision-return",
      "send-beta-same-room-revision-packet",
      "receive-beta-revised-automatic-pass-return",
      "run-final-lean-acceptance-gate",
      "preserve-final-smoke-boundaries",
      "record-final-lean-smoke-evidence",
      "verify-final-lean-smoke-evidence",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

    expect(evidence).toMatchObject({
      commit: "4782d1b1a7b634a46de5885306bb8415ef94d45f",
      nodeIds: [],
      repositoryId: "repo-project-control",
    });
    expect(evidence?.pathOrContractId).toContain("dispatch-final-lean-multi-work-smoke-2026-09-02-01");
    expect(evidence?.pathOrContractId).toContain("01a061ef-080d-7842-895b-81e553d2a522");
    expect(evidence?.pathOrContractId).toContain("01a061ef-12a4-7612-8461-e3bf381e1ec4");
    expect(evidence?.pathOrContractId).toContain("revision-final-lean-beta-revision-smoke-2026-09-02-01");

    expect(evidence?.verificationSummary).toContain("arrivalSequence 1");
    expect(evidence?.verificationSummary).toContain("arrivalSequence 2");
    expect(evidence?.verificationSummary).toContain("needs-revision");
    expect(evidence?.verificationSummary).toContain("same beta task");
    expect(evidence?.verificationSummary).toContain("revisionAttempt 1");
    expect(evidence?.verificationSummary).toContain("tests/checks run");
    expect(evidence?.verificationSummary).toContain("does not prove product WORK implementation with edits");
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");
  });
});
