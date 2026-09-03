import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-source-docs-subgroups";
const CHECKLIST_ID = "checklist-agent-and-skill-design-source-docs-subgroups";
const EVIDENCE_ID = "evidence-flowdoc-source-docs-subgroups-2026-09-03";
const IMPLEMENTATION_COMMIT = "292a123561dc0bdec779e2d8c76b0c1bf82f9235";

describe("FlowDoc source-docs subgroup evidence", () => {
  it("records focused source-docs gates for PLAN and WORK lane selection", async () => {
    const model = await buildProjectReadModel(
      await loadAndValidateProject(process.cwd()),
    );
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
    expect(work?.summary).toContain("source-docs subgroup gate");
    expect(work?.expectedOutput).toContain("test:source-docs:core-migration");
    expect(work?.riskSummary).toContain("source-docs core-migration remains the heaviest subgroup");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("source-docs:core-migration");
    expect(phase?.verificationTarget).toContain("source-docs:text-engine");
    expect(phase?.summary).toContain("semantic source-docs subgroups");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-source-docs-subgroup-boundary",
      "write-red-source-docs-subgroup-guard",
      "add-source-docs-subgroup-scripts",
      "verify-each-source-docs-subgroup",
      "verify-source-docs-umbrella-and-unit-gate",
      "record-source-docs-subgroup-evidence",
      "verify-source-docs-subgroup-evidence",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(
      true,
    );
    expect(
      checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID)),
    ).toBe(true);

    expect(evidence).toMatchObject({
      commit: IMPLEMENTATION_COMMIT,
      nodeIds: [],
      repositoryId: "repo-project-control",
    });
    expect(evidence?.pathOrContractId).toContain("test:source-docs:core-migration");
    expect(evidence?.pathOrContractId).toContain("test:source-docs:live-draft");
    expect(evidence?.pathOrContractId).toContain("test:source-docs:template-builder");
    expect(evidence?.pathOrContractId).toContain("test:source-docs:text-block");
    expect(evidence?.pathOrContractId).toContain("test:source-docs:text-engine");

    expect(evidence?.verificationSummary).toContain("RED");
    expect(evidence?.verificationSummary).toContain("5 files / 66 tests");
    expect(evidence?.verificationSummary).toContain("4 files / 22 tests");
    expect(evidence?.verificationSummary).toContain("4 files / 28 tests");
    expect(evidence?.verificationSummary).toContain("4 files / 18 tests");
    expect(evidence?.verificationSummary).toContain("4 files / 49 tests");
    expect(evidence?.verificationSummary).toContain("21 files / 183 tests");
    expect(evidence?.verificationSummary).toContain("npm run check passed");
    expect(evidence?.verificationSummary).toContain("does not lower verification");
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");
  });
});
