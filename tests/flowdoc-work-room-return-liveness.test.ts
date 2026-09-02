import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-work-room-return-liveness";
const CHECKLIST_ID = "checklist-agent-and-skill-design-work-room-return-liveness";
const EVIDENCE_ID = "evidence-flowdoc-work-room-return-liveness-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc WORK room return and liveness contract", () => {
  it("records that every WORK room must return a terminal state to PLAN", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const evidence = model.evidence.find((entry) => entry.id === EVIDENCE_ID);
    const documents = new Map(model.documents.map((document) => [document.id, document]));

    const workTypeModel = normalize(documents.get("doc-flowdoc-work-type-routing-model")?.content);
    const orchestrationRules = normalize(documents.get("doc-flowdoc-plan-room-orchestration-rules")?.content);
    const firstRoundPlan = normalize(documents.get("doc-flowdoc-first-delivery-round-plan")?.content);
    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      repositoryIds: ["repo-project-control"],
      workState: "in-progress",
    });
    expect(work?.summary).toContain("mandatory WORK room return");
    expect(work?.expectedOutput).toContain("liveness");
    expect(work?.riskSummary).toContain("silent");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("WORK Room Return Liveness Contract");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-work-room-return-liveness-context",
      "write-red-work-room-return-liveness-guard",
      "define-mandatory-terminal-return",
      "define-liveness-monitoring",
      "define-silent-room-handling",
      "route-return-contract-to-plan-and-kickoff",
      "record-work-room-return-liveness-records",
      "verify-work-room-return-liveness-gate",
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
    expect(evidence?.verificationSummary).toContain("mandatory WORK room return");
    expect(evidence?.verificationSummary).toContain("does not prove future Codex room wakeups");

    for (const content of [workTypeModel, orchestrationRules, firstRoundPlan, globalGuidance]) {
      expect(content).toContain("mandatory WORK room return");
      expect(content).toContain("liveness");
      expect(content).toContain("silent room");
      expect(content).toContain("terminal return");
      expect(content).toContain("PASS / FAIL / BLOCKER / RISK / UNKNOWN");
      expect(content).toContain("must not be accepted");
    }

    expect(workTypeModel).toContain("Return Channel");
    expect(workTypeModel).toContain("Liveness Signal");
    expect(workTypeModel).toContain("Death Signal");
    expect(workTypeModel).toContain("the PLAN room can continue without guessing");

    expect(orchestrationRules).toContain("livenessDeadline");
    expect(orchestrationRules).toContain("lastHeartbeatAt");
    expect(orchestrationRules).toContain("deathSignal");
    expect(orchestrationRules).toContain("returned-silent");
    expect(orchestrationRules).toContain("If a WORK room disappears");

    expect(firstRoundPlan).toContain("Return Channel");
    expect(firstRoundPlan).toContain("Liveness Signal");
    expect(firstRoundPlan).toContain("Death Signal");
  });
});
