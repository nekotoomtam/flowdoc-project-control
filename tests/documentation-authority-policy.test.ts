import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-documentation-authority-cleanup";
const PHASE_ID = "phase-flowdoc-documentation-authority-policy-foundation";
const CHECKLIST_ID = "checklist-flowdoc-documentation-authority-policy-foundation";
const POLICY_DOC_ID = "doc-flowdoc-documentation-authority-policy";
const EVIDENCE_ID = "evidence-flowdoc-documentation-authority-policy-foundation-2026-08-31";
const POLICY_FOUNDATION_COMMIT = "98bcec99d905c95feb765c1d630bda2f225bd998";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc documentation authority policy", () => {
  it("starts cleanup from Project Control before product-repo Markdown changes", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      nodeId: "project-control",
      parentWorkId: "flowdoc-product-development-resumption",
      repositoryIds: ["repo-project-control", "repo-core", "repo-backend", "repo-editor"],
      workKind: "task",
      workPathIds: ["flowdoc-product-development-resumption", WORK_ID],
      workState: "in-progress",
      requiredEvidence: [EVIDENCE_ID],
    });
    expect(work?.contextDocumentIds).toEqual(expect.arrayContaining([
      "doc-project-control-agent-onboarding",
      "doc-flowdoc-system-map",
      "doc-document-map-operating-rules",
      "doc-agent-skill-operating-model",
      "doc-flowdoc-round-workflow",
      "doc-work-tree-operating-rules",
      POLICY_DOC_ID,
    ]));
    expect(work?.expectedOutput).toContain("Project Control documentation authority policy");
    expect(work?.expectedOutput).toContain("Authority Boundary");
    expect(work?.riskSummary).toContain("Repo-local Markdown is not deleted by this foundation phase");

    expect(phase).toMatchObject({
      activeRole: "project-control-steward",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("policy document");
    expect(phase?.summary).toContain("without deleting product-repository Markdown");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-current-inventory",
      "define-authority-boundary",
      "separate-allowed-repo-docs",
      "define-cleanup-sequence",
      "guard-future-agents",
      "verify-project-control-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.verificationNote !== undefined)).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    const projectControl = model.nodes.find((node) => node.id === "project-control");
    expect(projectControl?.documentIds).toContain(POLICY_DOC_ID);
    expect(projectControl?.evidenceIds).not.toContain(EVIDENCE_ID);

    const policy = documents.get(POLICY_DOC_ID);
    expect(policy).toMatchObject({
      path: "docs/domains/flowdoc-documentation-authority-policy.md",
      nodeIds: ["project-control"],
      role: "contract",
      lifecycle: "active",
    });
    expect(policy?.authority).toContain("canonical FlowDoc documentation authority");
    expect(policy?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        repositoryId: "repo-project-control",
        commit: POLICY_FOUNDATION_COMMIT,
        pathOrContractId: "docs/domains/flowdoc-documentation-authority-policy.md",
      }),
      expect.objectContaining({
        repositoryId: "repo-project-control",
        commit: POLICY_FOUNDATION_COMMIT,
        pathOrContractId: "AGENTS.md",
      }),
    ]));

    const policyText = normalize(policy?.content);
    expect(policyText).toContain("Project Control is the canonical home for FlowDoc-wide shared understanding");
    expect(policyText).toContain("Repo-local Markdown may remain only when it is code-adjacent, repository-owned, or historical");
    expect(policyText).toContain("Every repo-local Markdown file that survives cleanup must declare an Authority Boundary");
    expect(policyText).toContain("Do not create product-repository `docs/superpowers/plans` or `docs/superpowers/specs` files for FlowDoc-wide truth");
    expect(policyText).toContain("Inventory -> classify -> summarize or register -> retire");
    expect(policyText).toContain("Agent role revisions come after the cleanup evidence is recorded");
    expect(policyText).toContain("This policy does not promote Core, Backend, Editor, compatibility, frontend readiness, or FlowDoc product truth");

    const agentOnboarding = normalize(documents.get("doc-project-control-agent-onboarding")?.content);
    expect(agentOnboarding).toContain("docs/domains/flowdoc-documentation-authority-policy.md");
    expect(agentOnboarding).toContain("Do not create product-repository `docs/superpowers/plans` or `docs/superpowers/specs` files for FlowDoc-wide truth");

    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);
    expect(globalGuidance).toContain("flowdoc-documentation-authority-policy.md");
    expect(globalGuidance).toContain("Every repo-local Markdown file that survives cleanup must carry an Authority Boundary");

    const operatingModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);
    expect(operatingModel).toContain("Documentation authority boundary");
    expect(operatingModel).toContain("Project Control remains the canonical home for FlowDoc-wide shared understanding");

    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-project-control",
      commit: POLICY_FOUNDATION_COMMIT,
      pathOrContractId: "docs/domains/flowdoc-documentation-authority-policy.md; AGENTS.md; docs/domains/flowdoc-global-codex-guidance.md; docs/domains/agent-and-skill-operating-model.md; data/work/flowdoc-documentation-authority-cleanup.json; tests/documentation-authority-policy.test.ts",
    });
    const verificationSummary = evidence.get(EVIDENCE_ID)?.verificationSummary ?? "";
    expect(verificationSummary).toContain("RED evidence");
    expect(verificationSummary).toContain("npx vitest run tests/documentation-authority-policy.test.ts --maxWorkers=1");
    expect(verificationSummary).toContain("npm run check:data");
    expect(verificationSummary).toContain("does not delete product-repository Markdown");
    expect(verificationSummary).toContain("does not promote Core, Backend, Editor, compatibility, frontend readiness, or FlowDoc product truth");
  });
});
