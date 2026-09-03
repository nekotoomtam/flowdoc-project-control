import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const DOC_ID = "doc-flowdoc-plan-work-continuation-guardrails-2026-09-03";
const DOC_PATH = "docs/domains/flowdoc-plan-work-continuation-guardrails-2026-09-03.md";
const PHASE_ID = "phase-agent-and-skill-design-plan-work-continuation-guardrails";
const CHECKLIST_ID = "checklist-agent-and-skill-design-plan-work-continuation-guardrails";
const EVIDENCE_ID = "evidence-flowdoc-plan-work-continuation-guardrails-2026-09-03";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc PLAN/WORK continuation guardrails", () => {
  it("records the continuation feedback before returning to drafted frontend lanes", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = model.evidence.find((entry) => entry.id === EVIDENCE_ID);
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      contextDocumentIds: expect.arrayContaining([DOC_ID]),
      nodeId: "project-control",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      repositoryIds: ["repo-project-control"],
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      workState: "in-progress",
    });
    expect(work?.summary).toContain("PLAN/WORK continuation guardrails");
    expect(work?.expectedOutput).toContain("Room Run Registry continuation note");
    expect(work?.riskSummary).toContain("conversation-only room state");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("before returning to drafted frontend lanes");
    expect(phase?.verificationTarget).toContain("PLAN must not repair WORK output itself");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-plan-work-continuation-context",
      "write-red-plan-work-continuation-guard",
      "record-room-registry-feedback",
      "preserve-drafted-lane-plan-boundary",
      "verify-plan-work-continuation-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("Project Control continuation guardrail"),
      lifecycle: "active",
      nodeIds: [],
      path: DOC_PATH,
      role: "decision",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-plan-work-continuation-guardrails.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));

    expect(evidence).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining("flowdoc-plan-work-continuation-guardrails-2026-09-03.md"),
      repositoryId: "repo-project-control",
    });
    expect(evidence?.verificationSummary).toContain("PLAN/WORK continuation feedback");
    expect(evidence?.verificationSummary).toContain("Room Run Registry");
    expect(evidence?.verificationSummary).toContain("Revision Packet back to the same WORK room");
    expect(evidence?.verificationSummary).toContain("does not open the next frontend lane");
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");

    expect(docText).toContain("# FlowDoc PLAN/WORK Continuation Guardrails");
    expect(docText).toContain("before returning to drafted frontend lanes");
    expect(docText).toContain("Room Run Registry");
    expect(docText).toContain("same WORK room");
    expect(docText).toContain("PLAN must not repair WORK output itself");
    expect(docText).toContain("does not change the drafted frontend lane plan");
    expect(docText).toContain("does not open the next frontend lane");
    expect(docText).not.toMatch(/\bfrontend readiness: current\b/iu);
    expect(docText).not.toMatch(/\bmap truth: current\b/iu);
  });
});
