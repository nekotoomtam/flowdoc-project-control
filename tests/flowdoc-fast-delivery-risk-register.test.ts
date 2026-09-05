import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-fast-delivery-risk-register";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-fast-delivery-risk-register-2026-09-04";
const DOC_PATH = "docs/domains/flowdoc-fast-delivery-risk-register-2026-09-04.md";
const PHASE_ID = "phase-flowdoc-fast-delivery-risk-register";
const CHECKLIST_ID = "checklist-flowdoc-fast-delivery-risk-register";
const EVIDENCE_ID = "evidence-flowdoc-fast-delivery-risk-register-2026-09-04";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Fast Delivery Risk Register", () => {
  it("records a compact risk register for fast movement without promoting product truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);
    const systemMapText = normalize(documents.get("doc-flowdoc-system-map")?.content);

    expect(model.work.find((item) => item.id === PARENT_WORK_ID)?.childWorkIds).toContain(WORK_ID);
    expect(model.nodes.find((node) => node.id === "flowdoc")?.documentIds).toContain(DOC_ID);
    expect(model.nodes.find((node) => node.id === "flowdoc")?.truthState).toBe("planned");

    expect(work).toMatchObject({
      activeRole: "planning-partner",
      contextDocumentIds: expect.arrayContaining([
        "doc-flowdoc-system-map",
        "doc-flowdoc-delivery-operating-model",
        "doc-flowdoc-plan-room-orchestration-rules",
        "doc-flowdoc-work-type-routing-model",
        "doc-flowdoc-lean-dispatch-operating-rules",
        "doc-flowdoc-product-terminology",
        "doc-flowdoc-product-terminology-th",
        "doc-flowdoc-creator-ux-contract-v0-2026-09-04",
        "doc-flowdoc-document-structure-database-model-v0-0-2-2026-09-04",
      ]),
      nodeId: "flowdoc",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: [EVIDENCE_ID],
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workKind: "task",
      workPathIds: [PARENT_WORK_ID, WORK_ID],
      workState: "in-progress",
    });
    expect(work?.expectedOutput).toContain("fast delivery risk register");
    expect(work?.riskSummary).toContain("not product implementation");

    expect(phase).toMatchObject({
      activeRole: "planning-partner",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Terminology risk");
    expect(phase?.verificationTarget).toContain("Speed risk");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-fast-delivery-risk-context",
      "write-red-fast-delivery-risk-guard",
      "record-terminology-and-db-drift-risks",
      "record-ux-scope-and-truth-promotion-risks",
      "record-speed-and-dependency-risks",
      "define-kickoff-risk-gate",
      "verify-fast-delivery-risk-register",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("fast delivery risk register"),
      lifecycle: "active",
      nodeIds: ["flowdoc"],
      path: DOC_PATH,
      role: "risk",
    });
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining(DOC_PATH),
      repositoryId: "repo-project-control",
    });

    expect(docText).toContain("# FlowDoc Fast Delivery Risk Register");
    for (const riskId of [
      "RISK-FD-001",
      "RISK-FD-002",
      "RISK-FD-003",
      "RISK-FD-004",
      "RISK-FD-005",
      "RISK-FD-006",
      "RISK-FD-007",
    ]) {
      expect(docText).toContain(riskId);
    }
    expect(docText).toContain("Terminology risk");
    expect(docText).toContain("Database drift risk");
    expect(docText).toContain("UX scope risk");
    expect(docText).toContain("Truth promotion risk");
    expect(docText).toContain("Speed risk");
    expect(docText).toContain("Dependency risk");
    expect(docText).toContain("Local workspace health risk");
    expect(docText).toContain("operational sweep A");
    expect(docText).toContain("operational sweep B");
    expect(docText).toContain("Structure Pattern / Slot / Entry");
    expect(docText).toContain("legacy component_*");
    expect(docText).toContain("Build and Preview");
    expect(docText).toContain("Kickoff Packet");
    expect(docText).toContain("Revision Packet");
    expect(docText).toContain("automatic return");
    expect(docText).toContain("acceptanceGate");
    expect(docText).toContain("npm audit");
    expect(docText).toContain("112 test files and 405 tests");
    expect(docText).toContain("112 test files and 406 tests");
    expect(docText).toContain("text-engine-rust-wasm");
    expect(docText).toContain("detached worktrees");
    expect(docText).toContain("stale branch refs");
    expect(docText).toContain("filename-too-long");
    expect(docText).toContain("local workspace health");
    expect(docText).toContain("must not patch Core, Backend, or Editor product repositories");
    expect(docText).toContain("must not promote frontend readiness");
    expect(docText).toContain("must not promote product database implementation");
    expect(docText).not.toMatch(/\bFlowDoc product truth: current\b/iu);
    expect(docText).not.toMatch(/\bfrontend readiness\b.*\bready\b/iu);

    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("RISK-FD-007 Local workspace health risk");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("112 test files and 405 tests");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("112 test files and 406 tests");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("codex/backend-document-structure-http-boundary-v0 had no unique commits over main");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("detached Backend commit 9da5821 was already contained by main");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("git worktree list now shows only the Backend main checkout");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("filename-too-long cleanup blockers");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not edit Core, Backend, or Editor product behavior");

    expect(systemMapText).toContain("FlowDoc Fast Delivery Risk Register");
    expect(systemMapText).toContain("fast-delivery risk register");
  });
});
