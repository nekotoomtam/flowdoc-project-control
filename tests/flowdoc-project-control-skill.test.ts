import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const DOC_ID = "doc-flowdoc-project-control-skill-installation-2026-09-01";
const DOC_PATH = "docs/domains/flowdoc-project-control-skill-installation-2026-09-01.md";
const PHASE_ID = "phase-agent-and-skill-design-flowdoc-project-control-skill";
const CHECKLIST_ID = "checklist-agent-and-skill-design-flowdoc-project-control-skill";
const EVIDENCE_ID = "evidence-flowdoc-project-control-skill-2026-09-01";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Project Control Codex skill", () => {
  it("records the FlowDoc skill packaging phase without promoting product truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      repositoryIds: ["repo-project-control"],
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      workState: "in-progress",
    });
    expect(work?.contextDocumentIds).toEqual(expect.arrayContaining([DOC_ID]));
    expect(work?.riskSummary).toContain("does not prove future agent compliance");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("FlowDoc Project Control Codex skill");
    expect(phase?.summary).toContain("bounded pressure validation");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-flowdoc-skill-context",
      "record-flowdoc-skill-red-pressure",
      "install-flowdoc-project-control-skill",
      "register-flowdoc-skill-evidence",
      "validate-flowdoc-project-control-skill",
      "verify-flowdoc-skill-gate",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("personal Codex skill installation and validation record"),
      lifecycle: "active",
      nodeIds: ["project-control"],
      path: DOC_PATH,
      role: "verification",
    });
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-project-control",
      pathOrContractId: expect.stringContaining(DOC_PATH),
    });
    expect(evidence.get(EVIDENCE_ID)?.commit).toMatch(/^[a-f0-9]{40}$/u);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("flowdoc-project-control");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("bounded pressure validation");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not promote Core, Backend, Editor");
  });

  it("documents the installed skill trigger, gate, and limits", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const docText = normalize(model.documents.find((document) => document.id === DOC_ID)?.content);
    const operatingModel = normalize(model.documents.find((document) => document.id === "doc-agent-skill-operating-model")?.content);

    expect(docText).toContain("# FlowDoc Project Control Skill Installation - 2026-09-01");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\skills\\flowdoc-project-control\\SKILL.md");
    expect(docText).toContain("Use when working on FlowDoc");
    expect(docText).toContain("Project Control override wins");
    expect(docText).toContain("BLOCKER: FlowDoc Project Control unavailable or unresolved.");
    expect(docText).toContain("bounded validation");
    expect(docText).toContain("does not prove future agent compliance");
    expect(docText).toContain("does not promote Core, Backend, Editor, compatibility, release readiness, frontend readiness, FlowDoc product truth, or map truth");

    expect(operatingModel).toContain("flowdoc-project-control");
    expect(operatingModel).toContain("first local Codex skill package");
    expect(operatingModel).not.toContain("does not complete the broader Work item, create Codex skill files");
  });
});
