import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-delivery-operating-model";
const DOC_PATH = "docs/domains/flowdoc-delivery-operating-model.md";
const PHASE_ID = "phase-agent-and-skill-design-delivery-operating-model";
const CHECKLIST_ID = "checklist-agent-and-skill-design-delivery-operating-model";
const EVIDENCE_ID = "evidence-flowdoc-delivery-operating-model-2026-09-01";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Delivery Operating Model", () => {
  it("records the shared PLAN and WORK room contract in Project Control", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);

    expect(model.work.find((item) => item.id === PARENT_WORK_ID)?.childWorkIds).toContain(WORK_ID);
    expect(model.nodes.find((node) => node.id === "project-control")?.documentIds).toContain(DOC_ID);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      contextDocumentIds: expect.arrayContaining([DOC_ID]),
      nodeId: "project-control",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      repositoryIds: ["repo-project-control"],
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      workKind: "task",
      workPathIds: [PARENT_WORK_ID, WORK_ID],
      workState: "in-progress",
    });
    expect(work?.riskSummary).toContain("room");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Delivery Operating Model");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-delivery-operating-context",
      "write-red-delivery-operating-guard",
      "draft-delivery-operating-model",
      "route-delivery-operating-entrypoints",
      "record-delivery-operating-model-records",
      "verify-delivery-operating-model-gate",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.verificationNote !== undefined)).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("PLAN and WORK room delivery operating contract"),
      lifecycle: "active",
      nodeIds: ["project-control"],
      path: DOC_PATH,
      role: "contract",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual([
      expect.objectContaining({
        commit: "8dcb483f99ffa5e6c7195b5ac16774f155ca77dc",
        pathOrContractId: expect.stringContaining("tests/flowdoc-delivery-operating-model.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]);
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: "8dcb483f99ffa5e6c7195b5ac16774f155ca77dc",
      nodeIds: [],
      pathOrContractId: expect.stringContaining(DOC_PATH),
      repositoryId: "repo-project-control",
    });
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("PLAN and WORK room delivery operating contract");

    expect(docText).toContain("# FlowDoc Delivery Operating Model");
    expect(docText).toContain("Work path: `flowdoc-product-development-resumption > agent-and-skill-design`");
    expect(docText).toContain("User name: `ตูม`");
    expect(docText).toContain("Assistant name: `โค`");
    expect(docText).toContain("Room Mode Model");
    expect(docText).toContain("A real opened room means a separate Codex task/chat visible to `ตูม`");
    expect(docText).toContain("First Delivery Slice");
    expect(docText).toContain("Structure creation -> API/key exposure -> data input -> PDF output");
    expect(docText).toContain("generated SQLite is only a local projection");
    expect(docText).toContain("Room Mode: `WORK`");
    expect(docText).toContain("Contract Change Request");
    expect(docText).not.toContain("# FlowDoc MVP");
  });

  it("routes future FlowDoc rooms to the delivery operating model", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const agentOnboarding = normalize(documents.get("doc-project-control-agent-onboarding")?.content);
    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);
    const agentSkillModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);

    expect(agentOnboarding).toContain(DOC_PATH);
    expect(agentOnboarding).toContain("PLAN room");
    expect(agentOnboarding).toContain("WORK room");
    expect(globalGuidance).toContain(DOC_PATH);
    expect(globalGuidance).toContain("delivery operating model");
    expect(agentSkillModel).toContain(DOC_PATH);
    expect(agentSkillModel).toContain("real separate Codex task/chat");
  });
});
