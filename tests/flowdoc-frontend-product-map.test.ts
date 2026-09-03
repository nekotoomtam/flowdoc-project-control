import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-frontend-product-map";
const PARENT_WORK_ID = "flowdoc-frontend-expert-roadmap";
const DOC_ID = "doc-flowdoc-frontend-product-map-2026-09-03";
const DOC_PATH = "docs/domains/flowdoc-frontend-product-map-2026-09-03.md";
const PHASE_ID = "phase-flowdoc-frontend-product-map-v1";
const CHECKLIST_ID = "checklist-flowdoc-frontend-product-map-v1";
const EVIDENCE_ID = "evidence-flowdoc-frontend-product-map-2026-09-03";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Frontend Product Map", () => {
  it("records a screen and action map without promoting frontend readiness", async () => {
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
        "doc-flowdoc-delivery-operating-model",
        "doc-flowdoc-plan-room-orchestration-rules",
        "doc-flowdoc-work-type-routing-model",
        "doc-flowdoc-lean-dispatch-operating-rules",
        "doc-flowdoc-documentation-authority-policy",
        "doc-flowdoc-agent-documentation-authority-operating-rules",
        "doc-flowdoc-product-terminology",
        "doc-flowdoc-product-terminology-th",
      ]),
      nodeId: "flowdoc",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: [EVIDENCE_ID],
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workKind: "task",
      workPathIds: ["flowdoc-product-development-resumption", PARENT_WORK_ID, WORK_ID],
      workState: "in-progress",
    });
    expect(work?.expectedOutput).toContain("Frontend Product Map v1");
    expect(work?.expectedOutput).toContain("lane-design-workspace-usability");
    expect(work?.riskSummary).toContain("map is planning context");

    expect(phase).toMatchObject({
      activeRole: "planning-partner",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Library, Design, Preview, Publish");
    expect(phase?.verificationTarget).toContain("screen and action map");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-product-map-context",
      "write-red-product-map-guard",
      "map-library-design-preview-publish-screens",
      "map-frontend-actions-and-state-boundaries",
      "package-design-workspace-usability-lane",
      "preserve-product-truth-boundary",
      "verify-product-map-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("Frontend Product Map v1"),
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

    expect(docText).toContain("# FlowDoc Frontend Product Map v1");
    expect(docText).toContain("Screen And State Map");
    expect(docText).toContain("Library");
    expect(docText).toContain("Design");
    expect(docText).toContain("Preview");
    expect(docText).toContain("Publish");
    expect(docText).toContain("Document Detail");
    expect(docText).toContain("Action Inventory");
    expect(docText).toContain("Truth Boundary Matrix");
    expect(docText).toContain("Lane-Ready Package");
    expect(docText).toContain("lane-design-workspace-usability");
    expect(docText).toContain("The product map is planning context, not product truth");
    expect(docText).toContain("No product repository files change in this phase");
    expect(docText).not.toMatch(/\bfrontend readiness: current\b/iu);
    expect(docText).not.toMatch(/\bpublish readiness: current\b/iu);
    expect(docText).not.toMatch(/\bWYSIWYG readiness: current\b/iu);
  });
});
