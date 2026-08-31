import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-documentation-authority-cleanup";
const PHASE_ID = "phase-flowdoc-documentation-authority-policy-foundation";
const CHECKLIST_ID = "checklist-flowdoc-documentation-authority-policy-foundation";
const POLICY_DOC_ID = "doc-flowdoc-documentation-authority-policy";
const EVIDENCE_ID = "evidence-flowdoc-documentation-authority-policy-foundation-2026-08-31";
const POLICY_FOUNDATION_COMMIT = "98bcec99d905c95feb765c1d630bda2f225bd998";
const EDITOR_ROADMAP_RETIRE_PHASE_ID = "phase-flowdoc-documentation-authority-cleanup-editor-node-authoring-roadmap-retirement";
const EDITOR_ROADMAP_RETIRE_CHECKLIST_ID = "checklist-flowdoc-documentation-authority-cleanup-editor-node-authoring-roadmap-retirement";
const EDITOR_ROADMAP_RETIRE_EVIDENCE_ID = "evidence-editor-node-authoring-roadmap-docs-retired-2026-08-31";
const EDITOR_ROADMAP_RETIRE_COMMIT = "04daeeaaac04317508b5cf8e93de61249255d477";
const MARKDOWN_INVENTORY_DOC_ID = "doc-flowdoc-repository-markdown-inventory-2026-08-31";
const MARKDOWN_INVENTORY_PHASE_ID = "phase-flowdoc-documentation-authority-cleanup-repository-markdown-inventory";
const MARKDOWN_INVENTORY_CHECKLIST_ID = "checklist-flowdoc-documentation-authority-cleanup-repository-markdown-inventory";
const MARKDOWN_INVENTORY_EVIDENCE_ID = "evidence-flowdoc-repository-markdown-inventory-2026-08-31";
const MARKDOWN_INVENTORY_RECORD_COMMIT = "e11ce1a9989eb7c46c6e8a2cd8ef3640cecd339c";
const MARKDOWN_INVENTORY_PROJECT_CONTROL_SOURCE_COMMIT = "d2f2a6ed22d90639c19e103c9bcc6fa5b82a2541";
const MARKDOWN_INVENTORY_CORE_SOURCE_COMMIT = "5892df6e542a02b25ae3b18ee02a55842b83d48f";
const MARKDOWN_INVENTORY_BACKEND_SOURCE_COMMIT = "fd6bd6a2c35c2f0bc7a0245b17beadf86ce39e08";
const MARKDOWN_INVENTORY_EDITOR_SOURCE_COMMIT = "04daeeaaac04317508b5cf8e93de61249255d477";
const BACKEND_SERVICE_PLAN_RETIRE_PHASE_ID = "phase-flowdoc-documentation-authority-cleanup-backend-service-plan-retirement";
const BACKEND_SERVICE_PLAN_RETIRE_CHECKLIST_ID = "checklist-flowdoc-documentation-authority-cleanup-backend-service-plan-retirement";
const BACKEND_SERVICE_PLAN_RETIRE_EVIDENCE_ID = "evidence-backend-service-plan-doc-retired-2026-08-31";
const BACKEND_SERVICE_PLAN_RETIRE_COMMIT = "c24f7f000a8b8e9a181434dd95d7611afa026a75";
const CORE_SUPERPOWERS_RETIRE_PHASE_ID = "phase-flowdoc-documentation-authority-cleanup-core-superpowers-text-block-retirement";
const CORE_SUPERPOWERS_RETIRE_CHECKLIST_ID = "checklist-flowdoc-documentation-authority-cleanup-core-superpowers-text-block-retirement";
const CORE_SUPERPOWERS_RETIRE_EVIDENCE_ID = "evidence-core-superpowers-text-block-docs-retired-2026-09-01";
const CORE_SUPERPOWERS_RETIRE_COMMIT = "6c1b53796802772467bf715b83764ac1ef613e52";
const EDITOR_SUPERPOWERS_FINAL_RETIRE_PHASE_ID = "phase-flowdoc-documentation-authority-cleanup-editor-superpowers-final-retirement";
const EDITOR_SUPERPOWERS_FINAL_RETIRE_CHECKLIST_ID = "checklist-flowdoc-documentation-authority-cleanup-editor-superpowers-final-retirement";
const EDITOR_SUPERPOWERS_FINAL_RETIRE_EVIDENCE_ID = "evidence-editor-superpowers-docs-retired-2026-09-01";
const EDITOR_SUPERPOWERS_FINAL_RETIRE_COMMIT = "4927a0022dc8170b8cb386ede0129a69508a1d29";

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
      requiredEvidence: expect.arrayContaining([EVIDENCE_ID]),
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
    expect(work?.riskSummary).toContain("Repo-local Markdown is not deleted wholesale by this cleanup Work");

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

    const roleCatalog = normalize(documents.get("doc-flowdoc-role-catalog")?.content);
    expect(roleCatalog).toContain("Documentation Authority For Roles");
    expect(roleCatalog).toContain("Product Implementation Agent must not create product-repository `docs/superpowers/plans` or `docs/superpowers/specs` files for FlowDoc-wide truth");
    expect(roleCatalog).toContain("Planning Partner must put broad plans in Project Control Work, Phase, Checklist, and Evidence targets before implementation");
    expect(roleCatalog).toContain("Documentation Synthesizer writes shared summaries in Project Control, not in product-repository superpowers files");
    expect(roleCatalog).toContain("agent handoff must name the Work path, owner repository, active role, Phase target, Checklist target, Evidence target, risks, and unknown state");

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

  it("records the Editor node-authoring roadmap docs retirement as work-scoped cleanup evidence", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === EDITOR_ROADMAP_RETIRE_PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === EDITOR_ROADMAP_RETIRE_CHECKLIST_ID);

    expect(work?.requiredEvidence).toEqual(expect.arrayContaining([
      EVIDENCE_ID,
      EDITOR_ROADMAP_RETIRE_EVIDENCE_ID,
    ]));
    expect(work?.expectedOutput).toContain(EDITOR_ROADMAP_RETIRE_COMMIT);
    expect(work?.riskSummary).toContain("fd-ed-doc-retire-0831");
    expect(work?.riskSummary).toContain("tracked Core deletions under packages/text-engine-rust-wasm were restored from Core HEAD");

    expect(phase).toMatchObject({
      activeRole: "documentation-synthesizer",
      phaseState: "done",
      repositoryIds: ["repo-editor", "repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.summary).toContain("retired exactly two Editor docs/superpowers node-authoring roadmap files");
    expect(phase?.summary).toContain("without deleting WYSIWYG or Overview/History docs");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-authority-and-owner",
      "write-red-editor-doc-authority-test",
      "retire-node-authoring-roadmap-pair",
      "bound-surviving-superpowers-docs",
      "verify-editor-main",
      "record-project-control-evidence",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EDITOR_ROADMAP_RETIRE_EVIDENCE_ID),
    )).toBe(true);

    expect(evidence.get(EDITOR_ROADMAP_RETIRE_EVIDENCE_ID)).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-editor",
      commit: EDITOR_ROADMAP_RETIRE_COMMIT,
      pathOrContractId: "AGENTS.md; src/tests/editorDocumentationAuthority.test.ts; docs/superpowers/plans/2026-08-30-editor-overview-history.md; docs/superpowers/specs/2026-08-30-editor-wysiwyg-gate-design.md",
    });
    const verificationSummary = evidence.get(EDITOR_ROADMAP_RETIRE_EVIDENCE_ID)?.verificationSummary ?? "";
    expect(verificationSummary).toContain("RED evidence");
    expect(verificationSummary).toContain("retired exactly two Editor docs/superpowers node-authoring roadmap files");
    expect(verificationSummary).toContain("3 files and 8 tests");
    expect(verificationSummary).toContain("110 test files, 396 tests");
    expect(verificationSummary).toContain("Filename too long");
    expect(verificationSummary).toContain("tracked Core deletions under packages/text-engine-rust-wasm");
    expect(verificationSummary).toContain("Core status returned clean");
    expect(verificationSummary).toContain("does not promote Core, Backend, Editor, compatibility, frontend readiness, or FlowDoc product truth");
  });

  it("records the repository-wide Markdown inventory before broader cleanup", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === MARKDOWN_INVENTORY_PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === MARKDOWN_INVENTORY_CHECKLIST_ID);

    expect(work?.requiredEvidence).toEqual(expect.arrayContaining([
      EVIDENCE_ID,
      EDITOR_ROADMAP_RETIRE_EVIDENCE_ID,
      MARKDOWN_INVENTORY_EVIDENCE_ID,
    ]));
    expect(work?.contextDocumentIds).toEqual(expect.arrayContaining([MARKDOWN_INVENTORY_DOC_ID]));
    expect(work?.expectedOutput).toContain("repository Markdown inventory snapshot");
    expect(work?.expectedOutput).toContain("Project Control 92, Core 347, Backend 40, Editor 57");
    expect(work?.riskSummary).toContain("Core docs/superpowers");
    expect(work?.riskSummary).toContain("Backend docs/superpowers");
    expect(work?.riskSummary).toContain("Editor docs/superpowers");

    expect(phase).toMatchObject({
      activeRole: "documentation-synthesizer",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("repository Markdown inventory snapshot");
    expect(phase?.summary).toContain("Project Control 92, Core 347, Backend 40, Editor 57");
    expect(phase?.summary).toContain("without deleting product-repository Markdown");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-source-commits",
      "scan-tracked-markdown",
      "classify-authority-buckets",
      "identify-product-repo-superpowers-risk",
      "preserve-no-delete-boundary",
      "verify-project-control-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(MARKDOWN_INVENTORY_EVIDENCE_ID),
    )).toBe(true);

    const projectControl = model.nodes.find((node) => node.id === "project-control");
    expect(projectControl?.documentIds).toContain(MARKDOWN_INVENTORY_DOC_ID);
    expect(projectControl?.evidenceIds).not.toContain(MARKDOWN_INVENTORY_EVIDENCE_ID);

    const inventory = documents.get(MARKDOWN_INVENTORY_DOC_ID);
    expect(inventory).toMatchObject({
      path: "docs/domains/flowdoc-repository-markdown-inventory-2026-08-31.md",
      nodeIds: ["project-control"],
      role: "verification",
      lifecycle: "active",
    });
    expect(inventory?.authority).toContain("Project Control canonical Markdown inventory snapshot");
    expect(inventory?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        repositoryId: "repo-project-control",
        commit: MARKDOWN_INVENTORY_PROJECT_CONTROL_SOURCE_COMMIT,
        pathOrContractId: "rg --files -g '*.md'",
      }),
      expect.objectContaining({
        repositoryId: "repo-core",
        commit: MARKDOWN_INVENTORY_CORE_SOURCE_COMMIT,
        pathOrContractId: "rg --files -g '*.md'",
      }),
      expect.objectContaining({
        repositoryId: "repo-backend",
        commit: MARKDOWN_INVENTORY_BACKEND_SOURCE_COMMIT,
        pathOrContractId: "rg --files -g '*.md'",
      }),
      expect.objectContaining({
        repositoryId: "repo-editor",
        commit: MARKDOWN_INVENTORY_EDITOR_SOURCE_COMMIT,
        pathOrContractId: "rg --files -g '*.md'",
      }),
    ]));

    const inventoryText = normalize(inventory?.content);
    expect(inventoryText).toContain("Source Snapshot");
    expect(inventoryText).toContain("Project Control 92 tracked Markdown files");
    expect(inventoryText).toContain("Core 347 tracked Markdown files");
    expect(inventoryText).toContain("Backend 40 tracked Markdown files");
    expect(inventoryText).toContain("Editor 57 tracked Markdown files");
    expect(inventoryText).toContain("Project Control docs/superpowers: 21");
    expect(inventoryText).toContain("Core docs/superpowers: 4");
    expect(inventoryText).toContain("Backend docs/superpowers: 1");
    expect(inventoryText).toContain("Editor docs/superpowers: 3");
    expect(inventoryText).toContain("Product repositories were read-only in this inventory phase");
    expect(inventoryText).toContain("No product-repository Markdown is deleted by this inventory");
    expect(inventoryText).toContain("docs/superpowers files in Core and Backend do not yet carry Authority Boundary wording");
    expect(inventoryText).toContain("not product evidence");
    expect(inventoryText).toContain("does not promote Core, Backend, Editor, compatibility, frontend readiness, FlowDoc product truth, or map truth");

    expect(evidence.get(MARKDOWN_INVENTORY_EVIDENCE_ID)).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-project-control",
      commit: MARKDOWN_INVENTORY_RECORD_COMMIT,
      pathOrContractId: "docs/domains/flowdoc-repository-markdown-inventory-2026-08-31.md; data/work/flowdoc-documentation-authority-cleanup.json; tests/documentation-authority-policy.test.ts",
    });
    const verificationSummary = evidence.get(MARKDOWN_INVENTORY_EVIDENCE_ID)?.verificationSummary ?? "";
    expect(verificationSummary).toContain("RED evidence");
    expect(verificationSummary).toContain("repository Markdown inventory snapshot");
    expect(verificationSummary).toContain("rg --files -g '*.md'");
    expect(verificationSummary).toContain("Project Control 92, Core 347, Backend 40, Editor 57");
    expect(verificationSummary).toContain("Product repositories were read-only");
    expect(verificationSummary).toContain("Core and Backend docs/superpowers Authority Boundary gap");
    expect(verificationSummary).toContain("does not promote Core, Backend, Editor, compatibility, frontend readiness, FlowDoc product truth, or map truth");
  });

  it("records the Backend service hardening plan docs/superpowers retirement", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === BACKEND_SERVICE_PLAN_RETIRE_PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === BACKEND_SERVICE_PLAN_RETIRE_CHECKLIST_ID);

    expect(work?.requiredEvidence).toEqual(expect.arrayContaining([
      BACKEND_SERVICE_PLAN_RETIRE_EVIDENCE_ID,
      MARKDOWN_INVENTORY_EVIDENCE_ID,
    ]));
    expect(work?.expectedOutput).toContain(BACKEND_SERVICE_PLAN_RETIRE_COMMIT);
    expect(work?.expectedOutput).toContain("Backend docs/superpowers is now empty");
    expect(work?.riskSummary).toContain("Core docs/superpowers cleanup is recorded");
    expect(work?.riskSummary).toContain("Editor docs/superpowers final cleanup is recorded");
    expect(work?.riskSummary).toContain("Backend docs/superpowers cleanup is recorded");

    expect(phase).toMatchObject({
      activeRole: "documentation-synthesizer",
      phaseState: "done",
      repositoryIds: ["repo-backend", "repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Backend docs/superpowers is empty");
    expect(phase?.summary).toContain("retired the one Backend docs/superpowers plan");
    expect(phase?.summary).toContain("without changing Backend service behavior");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-backend-owner",
      "write-red-backend-doc-authority-test",
      "retire-backend-service-plan",
      "preserve-backend-readiness-boundary",
      "verify-backend-main",
      "record-project-control-evidence",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(BACKEND_SERVICE_PLAN_RETIRE_EVIDENCE_ID),
    )).toBe(true);

    expect(evidence.get(BACKEND_SERVICE_PLAN_RETIRE_EVIDENCE_ID)).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-backend",
      commit: BACKEND_SERVICE_PLAN_RETIRE_COMMIT,
      pathOrContractId: "AGENTS.md; docs/BACKEND_SERVICE_READINESS_BOUNDARY.md; src/tests/backendDocumentationAuthority.test.ts",
    });
    const verificationSummary = evidence.get(BACKEND_SERVICE_PLAN_RETIRE_EVIDENCE_ID)?.verificationSummary ?? "";
    expect(verificationSummary).toContain("RED evidence");
    expect(verificationSummary).toContain("docs/superpowers/plans/2026-08-27-backend-service-contract-hardening.md still existed");
    expect(verificationSummary).toContain("Backend docs/superpowers is empty");
    expect(verificationSummary).toContain("3 files and 7 tests");
    expect(verificationSummary).toContain("90 passed test files, 1 skipped file, 325 passed tests, 24 skipped tests");
    expect(verificationSummary).toContain("temporary Core junction");
    expect(verificationSummary).toContain("removed before the accepted main gate");
    expect(verificationSummary).toContain("does not promote Core, Backend, Editor, compatibility, frontend readiness, FlowDoc product truth, or map truth");
  });

  it("records the Core text block docs/superpowers retirement", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === CORE_SUPERPOWERS_RETIRE_PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CORE_SUPERPOWERS_RETIRE_CHECKLIST_ID);

    expect(work?.requiredEvidence).toEqual(expect.arrayContaining([
      CORE_SUPERPOWERS_RETIRE_EVIDENCE_ID,
      BACKEND_SERVICE_PLAN_RETIRE_EVIDENCE_ID,
      MARKDOWN_INVENTORY_EVIDENCE_ID,
    ]));
    expect(work?.expectedOutput).toContain(CORE_SUPERPOWERS_RETIRE_COMMIT);
    expect(work?.expectedOutput).toContain("Core docs/superpowers is now absent");
    expect(work?.riskSummary).toContain("Core docs/superpowers cleanup is recorded");
    expect(work?.riskSummary).toContain("fd-core-doc-superpowers-retire-0831");
    expect(work?.riskSummary).toContain("Filename too long");

    expect(phase).toMatchObject({
      activeRole: "documentation-synthesizer",
      phaseState: "done",
      repositoryIds: ["repo-core", "repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Core docs/superpowers is absent");
    expect(phase?.summary).toContain("retired all four Core docs/superpowers plan/spec files");
    expect(phase?.summary).toContain("without changing Core runtime behavior");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-core-owner",
      "write-red-core-doc-authority-test",
      "preserve-core-text-block-live-draft-context",
      "retire-core-superpowers-sources",
      "verify-core-main",
      "record-project-control-evidence",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(CORE_SUPERPOWERS_RETIRE_EVIDENCE_ID),
    )).toBe(true);

    expect(evidence.get(CORE_SUPERPOWERS_RETIRE_EVIDENCE_ID)).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-core",
      commit: CORE_SUPERPOWERS_RETIRE_COMMIT,
      pathOrContractId: "AGENTS.md; docs/LIVE_DRAFT_CROSS_RUNTIME_PARITY_HANDOFF.md; tests/coreDocumentationAuthority.test.ts; tests/liveDraftMr1CompleteGeometryBoundary.test.ts; tests/liveDraftMr1AuthoredBoxGeometry4a.test.ts; tests/liveDraftMr1InlineImageGeometry4b.test.ts",
    });
    const verificationSummary = evidence.get(CORE_SUPERPOWERS_RETIRE_EVIDENCE_ID)?.verificationSummary ?? "";
    expect(verificationSummary).toContain("RED evidence");
    expect(verificationSummary).toContain("docs/superpowers/plans/2026-07-21-text-block-complete-geometry-boundary.md still existed");
    expect(verificationSummary).toContain("Core docs/superpowers is absent");
    expect(verificationSummary).toContain("4 files and 25 tests");
    expect(verificationSummary).toContain("461 files and 2946 tests");
    expect(verificationSummary).toContain("Filename too long");
    expect(verificationSummary).toContain("does not promote Core, Backend, Editor, compatibility, frontend readiness, FlowDoc product truth, or map truth");
  });

  it("records the remaining Editor docs/superpowers retirement", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === EDITOR_SUPERPOWERS_FINAL_RETIRE_PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === EDITOR_SUPERPOWERS_FINAL_RETIRE_CHECKLIST_ID);

    expect(work?.requiredEvidence).toEqual(expect.arrayContaining([
      EDITOR_SUPERPOWERS_FINAL_RETIRE_EVIDENCE_ID,
      CORE_SUPERPOWERS_RETIRE_EVIDENCE_ID,
      EDITOR_ROADMAP_RETIRE_EVIDENCE_ID,
    ]));
    expect(work?.expectedOutput).toContain(EDITOR_SUPERPOWERS_FINAL_RETIRE_COMMIT);
    expect(work?.expectedOutput).toContain("Editor docs/superpowers is now absent");
    expect(work?.riskSummary).toContain("Editor docs/superpowers final cleanup is recorded");
    expect(work?.riskSummary).toContain("fd-ed-superpowers-retire-0901");
    expect(work?.riskSummary).toContain("Directory not empty");

    expect(phase).toMatchObject({
      activeRole: "documentation-synthesizer",
      phaseState: "done",
      repositoryIds: ["repo-editor", "repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Editor docs/superpowers is absent");
    expect(phase?.summary).toContain("retired the remaining three Editor docs/superpowers files");
    expect(phase?.summary).toContain("without changing Editor UI behavior");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-editor-owner",
      "write-red-editor-final-doc-authority-test",
      "preserve-editor-shared-context-in-project-control",
      "move-wysiwyg-boundary-to-code-contract",
      "retire-editor-superpowers-survivors",
      "verify-editor-main",
      "record-project-control-evidence",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(EDITOR_SUPERPOWERS_FINAL_RETIRE_EVIDENCE_ID),
    )).toBe(true);

    expect(evidence.get(EDITOR_SUPERPOWERS_FINAL_RETIRE_EVIDENCE_ID)).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-editor",
      commit: EDITOR_SUPERPOWERS_FINAL_RETIRE_COMMIT,
      pathOrContractId: "AGENTS.md; src/editor/draft/textBlockAuthoringBoundary.ts; src/tests/editorDocumentationAuthority.test.ts; src/tests/wysiwygGate.test.ts",
    });
    const verificationSummary = evidence.get(EDITOR_SUPERPOWERS_FINAL_RETIRE_EVIDENCE_ID)?.verificationSummary ?? "";
    expect(verificationSummary).toContain("RED evidence");
    expect(verificationSummary).toContain("docs/superpowers/plans/2026-08-30-editor-overview-history.md still existed");
    expect(verificationSummary).toContain("Editor docs/superpowers is absent");
    expect(verificationSummary).toContain("4 files and 13 tests");
    expect(verificationSummary).toContain("109 test files and 393 tests");
    expect(verificationSummary).toContain("Directory not empty");
    expect(verificationSummary).toContain("does not promote Core, Backend, Editor, compatibility, frontend readiness, FlowDoc product truth, or map truth");
  });
});
