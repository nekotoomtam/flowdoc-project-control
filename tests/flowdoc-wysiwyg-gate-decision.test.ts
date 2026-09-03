import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-wysiwyg-gate-decision";
const PARENT_WORK_ID = "flowdoc-frontend-product-map";
const DOC_ID = "doc-flowdoc-wysiwyg-gate-decision-2026-09-03";
const DOC_PATH = "docs/domains/flowdoc-wysiwyg-gate-decision-2026-09-03.md";
const PHASE_ID = "phase-flowdoc-wysiwyg-gate-decision-v1";
const CHECKLIST_ID = "checklist-flowdoc-wysiwyg-gate-decision-v1";
const EVIDENCE_ID = "evidence-flowdoc-wysiwyg-gate-decision-2026-09-03";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc WYSIWYG Gate Decision", () => {
  it("records a closed gate decision with prerequisites before direct page editing", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);

    expect(model.work.find((item) => item.id === PARENT_WORK_ID)?.childWorkIds).toContain(WORK_ID);
    expect(model.nodes.find((node) => node.id === "flowdoc")?.documentIds).toContain(DOC_ID);
    expect(model.nodes.find((node) => node.id === "flowdoc")?.truthState).toBe("planned");

    expect(work).toMatchObject({
      activeRole: "planning-partner",
      contextDocumentIds: expect.arrayContaining([
        "doc-flowdoc-frontend-expert-roadmap-2026-09-03",
        "doc-flowdoc-frontend-product-map-2026-09-03",
        "doc-flowdoc-delivery-operating-model",
        "doc-flowdoc-plan-room-orchestration-rules",
        "doc-flowdoc-work-type-routing-model",
        "doc-flowdoc-lean-dispatch-operating-rules",
        "doc-flowdoc-documentation-authority-policy",
        "doc-flowdoc-agent-documentation-authority-operating-rules",
        "doc-flowdoc-product-terminology",
        "doc-flowdoc-product-terminology-th",
        "doc-template-builder-wysiwyg-draft-guards",
      ]),
      nodeId: "flowdoc",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: [EVIDENCE_ID],
      repositoryIds: ["repo-project-control", "repo-editor", "repo-core", "repo-backend"],
      workKind: "task",
      workPathIds: [
        "flowdoc-product-development-resumption",
        "flowdoc-frontend-expert-roadmap",
        PARENT_WORK_ID,
        WORK_ID,
      ],
      workState: "in-progress",
    });
    expect(work?.expectedOutput).toContain("WYSIWYG Gate Decision v1");
    expect(work?.riskSummary).toContain("contenteditable shortcuts");

    expect(phase).toMatchObject({
      activeRole: "planning-partner",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("WYSIWYG gate remains closed");
    expect(phase?.verificationTarget).toContain("managed editable cards");
    expect(phase?.verificationTarget).toContain("bounded text islands");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-wysiwyg-gate-context",
      "write-red-wysiwyg-gate-guard",
      "review-existing-wysiwyg-boundaries",
      "define-closed-gate-decision",
      "record-prerequisite-checklist",
      "block-unsupported-shortcuts",
      "preserve-product-truth-boundary",
      "verify-wysiwyg-gate-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("WYSIWYG Gate Decision v1"),
      lifecycle: "active",
      nodeIds: ["flowdoc"],
      path: DOC_PATH,
      role: "decision",
    });
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining(DOC_PATH),
      repositoryId: "repo-project-control",
    });

    expect(docText).toContain("# FlowDoc WYSIWYG Gate Decision v1");
    expect(docText).toContain("Lane ID: `lane-wysiwyg-gate-decision`");
    expect(docText).toContain("Work ID: `flowdoc-wysiwyg-gate-decision`");
    expect(docText).toContain("`lane-wysiwyg-gate-decision` is the dispatch lane ID");
    expect(docText).toContain("`flowdoc-wysiwyg-gate-decision` is the durable Project Control Work ID");
    expect(docText).toContain("WYSIWYG gate remains closed");
    expect(docText).toContain("Managed Editable Cards");
    expect(docText).toContain("Bounded Text Islands");
    expect(docText).toContain("A bounded textarea active text-block island is not WYSIWYG");
    expect(docText).toContain("Full-document contenteditable remains blocked");
    expect(docText).toContain("Rich editor package adoption remains blocked");
    expect(docText).toContain("Prerequisite Checklist");
    expect(docText).toContain("data model");
    expect(docText).toContain("selection");
    expect(docText).toContain("measurement");
    expect(docText).toContain("save");
    expect(docText).toContain("undo/redo");
    expect(docText).toContain("preview");
    expect(docText).toContain("compatibility");
    expect(docText).toContain("accessibility");
    expect(docText).toContain("This decision is planning context, not product truth");
    expect(docText).toContain("No product repository files change in this decision lane");
    expect(docText).not.toMatch(/\bWYSIWYG readiness: current\b/iu);
    expect(docText).not.toMatch(/\bfrontend readiness: current\b/iu);
    expect(docText).not.toMatch(/\bpublish readiness: current\b/iu);
  });
});
