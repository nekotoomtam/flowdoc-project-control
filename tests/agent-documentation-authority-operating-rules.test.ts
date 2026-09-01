import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-agent-documentation-authority-operating-rules";
const DOC_PATH = "docs/domains/flowdoc-agent-documentation-authority-operating-rules.md";
const PHASE_ID = "phase-agent-and-skill-design-documentation-authority-operating-rules";
const CHECKLIST_ID = "checklist-agent-and-skill-design-documentation-authority-operating-rules";
const EVIDENCE_ID = "evidence-flowdoc-agent-documentation-authority-operating-rules-2026-09-01";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc agent documentation authority operating rules", () => {
  it("opens agent-and-skill-design with a bounded Project Control phase", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);

    expect(model.work.find((item) => item.id === PARENT_WORK_ID)?.childWorkIds).toContain(WORK_ID);
    expect(model.nodes.find((node) => node.id === "project-control")?.documentIds).toContain(DOC_ID);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: [PHASE_ID],
      repositoryIds: ["repo-project-control"],
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
      workKind: "task",
      workPathIds: [PARENT_WORK_ID, WORK_ID],
      workState: "in-progress",
    });
    expect(work?.contextDocumentIds).toEqual(expect.arrayContaining([
      "doc-project-control-agent-onboarding",
      "doc-flowdoc-documentation-authority-policy",
      "doc-flowdoc-role-catalog",
      "doc-agent-skill-operating-model",
      DOC_ID,
    ]));
    expect(work?.summary).toContain("after the documentation authority cleanup evidence");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Markdown Authority Pre-Action Gate");
    expect(phase?.summary).toContain("root cause");
    expect(phase?.summary).toContain("Project Control override");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-agent-doc-root-cause",
      "write-red-agent-doc-authority-guard",
      "draft-agent-documentation-authority-rules",
      "update-agent-entrypoints-and-role-catalog",
      "record-agent-doc-operating-evidence",
      "verify-agent-doc-rule-gate",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EVIDENCE_ID),
    )).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("agent-facing FlowDoc documentation authority operating rules"),
      lifecycle: "active",
      nodeIds: ["project-control"],
      path: DOC_PATH,
      role: "contract",
    });
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-project-control",
      pathOrContractId: expect.stringContaining(DOC_PATH),
    });
    expect(evidence.get(EVIDENCE_ID)?.commit).toMatch(/^[a-f0-9]{40}$/u);
  });

  it("records why prior agents wrote Markdown outside Project Control", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const docText = normalize(model.documents.find((document) => document.id === DOC_ID)?.content);
    const lowerDocText = docText.toLowerCase();

    expect(docText).toContain("Why The Drift Happened");
    expect(docText).toContain("generic `writing-plans` skill default");
    expect(docText).toContain("docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md");
    expect(docText).toContain("Project Control documentation authority policy arrived after many product-repository plans and specs");
    expect(lowerDocText).toContain("guard coverage was late and uneven");
    expect(lowerDocText).toContain("visible-only scans missed hidden tracked markdown");
    expect(docText).toContain("git ls-files -- '*.md'");
  });

  it("defines the Markdown gate and role overlays that prevent recurrence", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const docText = normalize(model.documents.find((document) => document.id === DOC_ID)?.content);
    const roleCatalog = normalize(model.documents.find((document) => document.id === "doc-flowdoc-role-catalog")?.content);

    expect(docText).toContain("Markdown Authority Pre-Action Gate");
    expect(docText).toContain("Project Control override wins");
    expect(docText).toContain("Classify the target writing before creating or editing it");
    expect(docText).toContain("Do not create product-repository `docs/superpowers/plans` or `docs/superpowers/specs` files for FlowDoc-wide truth");
    expect(docText).toContain("Work path, owner repository, active role, Phase, Checklist, Evidence, risks, and unknown state");
    expect(docText).toContain("BLOCKER: FlowDoc Project Control unavailable or unresolved.");
    expect(docText).toContain("does not promote Core, Backend, Editor, compatibility, release readiness, frontend readiness, FlowDoc product truth, or map truth");

    expect(roleCatalog).toContain("Documentation Authority Steward");
    expect(roleCatalog).toContain("Repo Documentation Curator");
    expect(roleCatalog).toContain("Evidence Registrar");
    expect(roleCatalog).toContain("Documentation Cleanup Reviewer");
    expect(roleCatalog).toContain("role overlays");
  });

  it("routes future agent entrypoints to the operating rules", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const agentOnboarding = normalize(documents.get("doc-project-control-agent-onboarding")?.content);
    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);
    const operatingModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);

    expect(agentOnboarding).toContain(DOC_PATH);
    expect(agentOnboarding).toContain("Markdown Authority Pre-Action Gate");
    expect(globalGuidance).toContain(DOC_PATH);
    expect(globalGuidance).toContain("Project Control override wins");
    expect(operatingModel).toContain(DOC_PATH);
    expect(operatingModel).toContain("Agent role revisions for documentation cleanup are now captured");
    expect(operatingModel).not.toContain("Agent role revisions for documentation cleanup should wait until cleanup evidence shows which roles are needed.");
  });
});
