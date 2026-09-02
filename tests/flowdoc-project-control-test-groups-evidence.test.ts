import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-project-control-test-groups";
const CHECKLIST_ID = "checklist-agent-and-skill-design-project-control-test-groups";
const EVIDENCE_ID = "evidence-flowdoc-project-control-test-groups-2026-09-02";
const IMPLEMENTATION_COMMIT = "75c4d43732972f233ac37362d7ecf06a8feca5d8";

describe("FlowDoc Project Control test groups evidence", () => {
  it("records the grouped gate as the stable default without weakening verification", async () => {
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
    expect(work?.summary).toContain("Project Control grouped test gate");
    expect(work?.expectedOutput).toContain("check:grouped");
    expect(work?.riskSummary).toContain("default parallel full Project Control unit gate");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("test:unit");
    expect(phase?.verificationTarget).toContain("check:grouped");
    expect(phase?.summary).toContain("records, source-docs, and app");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-test-gate-timeout-context",
      "write-red-test-group-guard",
      "add-grouped-unit-test-scripts",
      "preserve-parallel-fast-path",
      "verify-grouped-unit-gate",
      "record-test-group-evidence",
      "verify-test-group-evidence",
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
    expect(evidence?.pathOrContractId).toContain("tools/run-test-groups.ts");
    expect(evidence?.pathOrContractId).toContain("tools/lib/test-groups.ts");
    expect(evidence?.pathOrContractId).toContain("tests/project-control-test-groups.test.ts");
    expect(evidence?.pathOrContractId).toContain("package.json#scripts.check");

    expect(evidence?.verificationSummary).toContain("RED");
    expect(evidence?.verificationSummary).toContain("49 files / 135 tests");
    expect(evidence?.verificationSummary).toContain("21 files / 182 tests");
    expect(evidence?.verificationSummary).toContain("9 files / 60 tests");
    expect(evidence?.verificationSummary).toContain("79 files / 377 tests");
    expect(evidence?.verificationSummary).toContain("npm run check passed");
    expect(evidence?.verificationSummary).toContain("does not lower verification");
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");
  });
});
