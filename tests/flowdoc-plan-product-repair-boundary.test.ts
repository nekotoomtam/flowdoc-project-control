import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PHASE_ID = "phase-agent-and-skill-design-plan-product-repair-boundary";
const CHECKLIST_ID = "checklist-agent-and-skill-design-plan-product-repair-boundary";
const EVIDENCE_ID = "evidence-flowdoc-plan-product-repair-boundary-2026-09-03";
const PRODUCT_REPAIR_RULE =
  "PLAN must not patch Core, Backend, or Editor product repositories after dispatch";
const REVISION_RULE =
  "product-repository repair goes back to the same WORK room as a Revision Packet";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc PLAN product-repository repair boundary", () => {
  it("keeps PLAN from repairing product repository failures that belong to WORK", async () => {
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
    const firstDeliveryOwnerAcceptance = normalize(
      documents.get("doc-flowdoc-first-delivery-owner-lanes-acceptance-2026-09-03")?.content,
    );

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      repositoryIds: ["repo-project-control"],
      workState: "in-progress",
    });
    expect(work?.summary).toContain("PLAN product-repository repair boundary");
    expect(work?.expectedOutput).toContain("product-repository repair goes back");
    expect(work?.riskSummary).toContain("PLAN room may over-carry product repair");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain(PRODUCT_REPAIR_RULE);
    expect(phase?.verificationTarget).toContain(REVISION_RULE);

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-plan-product-repair-boundary-context",
      "write-red-plan-product-repair-boundary-guard",
      "define-plan-product-repair-boundary",
      "route-product-repair-boundary-to-entrypoints",
      "record-plan-product-repair-boundary",
      "verify-plan-product-repair-boundary-gate",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

    expect(evidence).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining("tests/flowdoc-plan-product-repair-boundary.test.ts"),
      repositoryId: "repo-project-control",
    });
    expect(evidence?.verificationSummary).toContain(PRODUCT_REPAIR_RULE);
    expect(evidence?.verificationSummary).toContain("does not edit Core, Backend, or Editor behavior");

    for (const content of [
      agentOnboarding,
      globalGuidance,
      agentSkillModel,
      deliveryModel,
      orchestrationRules,
      firstDeliveryOwnerAcceptance,
    ]) {
      expect(content).toContain(PRODUCT_REPAIR_RULE);
      expect(content).toContain(REVISION_RULE);
      expect(content).toContain("diagnose and attach failure evidence");
      expect(content).toContain("merge, verification, Project Control records, and cleanup");
    }

    expect(orchestrationRules).toContain("test-only, fixture-only, configuration-only");
    expect(orchestrationRules).toContain("must not commit a product repository repair directly");
    expect(firstDeliveryOwnerAcceptance).toContain("boundary breach risk");
  });
});
