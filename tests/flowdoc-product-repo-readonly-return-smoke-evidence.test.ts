import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-product-repo-readonly-return-smoke-test";
const CHECKLIST_ID = "checklist-agent-and-skill-design-product-repo-readonly-return-smoke-test";
const EVIDENCE_ID = "evidence-flowdoc-product-repo-readonly-return-smoke-test-2026-09-02";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc product-repo read-only return smoke evidence", () => {
  it("records bounded Core worktree active return and local fallback diagnostics", async () => {
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
    expect(work?.riskSummary).toContain("product-repository read-only active return smoke test");
    expect(work?.riskSummary).toContain("actual product edits remain unproven");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Core worktree task");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "dispatch-core-worktree-readonly-smoke",
      "resolve-client-thread-to-task",
      "receive-core-worktree-active-return",
      "run-product-repo-readonly-acceptance-gate",
      "record-local-fallback-diagnostic",
      "preserve-product-implementation-unknowns",
      "record-product-repo-readonly-smoke-evidence",
      "verify-product-repo-readonly-smoke-evidence",
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
    expect(evidence?.pathOrContractId).toContain("client-new-thread:a8a7a22f-152e-46d3-9ab9-d45482469c47");
    expect(evidence?.pathOrContractId).toContain("01a06146-4c7a-7ca3-9f36-475df0f7ba99");
    expect(evidence?.pathOrContractId).toContain("handoff-core-readonly-return-smoke-2026-09-02-01");
    expect(evidence?.pathOrContractId).toContain("01a06147-82e3-71e1-add6-d7d702b6c406");
    expect(evidence?.verificationSummary).toContain("worktree path C:\\Users\\nekot\\.codex\\worktrees\\c89e\\flowdoc-vnext-core");
    expect(evidence?.verificationSummary).toContain("detached HEAD at da5011ceeac6e0b72b152a9a5029d684af978581");
    expect(evidence?.verificationSummary).toContain("local fallback diagnostic");
    expect(evidence?.verificationSummary).toContain("does not prove product WORK implementation return with actual edits");
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");

    expect(orchestrationRules).toContain("product-repository read-only active return smoke test");
    expect(orchestrationRules).toContain("worktree-created Core task");
    expect(firstRoundPlan).toContain("product-repository read-only active return smoke test");
    expect(firstRoundPlan).toContain("Next recommended implementation-return test");
  });
});
