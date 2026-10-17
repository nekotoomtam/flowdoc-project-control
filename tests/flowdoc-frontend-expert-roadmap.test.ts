import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-frontend-expert-roadmap";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-frontend-expert-roadmap-2026-09-03";
const DOC_PATH = "docs/domains/flowdoc-frontend-expert-roadmap-2026-09-03.md";
const PHASE_ID = "phase-flowdoc-frontend-expert-roadmap-v1";
const CHECKLIST_ID = "checklist-flowdoc-frontend-expert-roadmap-v1";
const EVIDENCE_ID = "evidence-flowdoc-frontend-expert-roadmap-2026-09-03";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Frontend Expert Roadmap", () => {
  it("records a bounded frontend roadmap without promoting Editor readiness", async () => {
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
        "doc-flowdoc-system-map",
        "doc-document-map-operating-rules",
        "doc-flowdoc-role-catalog",
        "doc-agent-skill-operating-model",
        "doc-flowdoc-round-workflow",
        "doc-flowdoc-workflow-economy-policy",
        "doc-flowdoc-documentation-authority-policy",
        "doc-flowdoc-agent-documentation-authority-operating-rules",
        "doc-flowdoc-product-terminology",
        "doc-flowdoc-product-terminology-th",
        "doc-flowdoc-first-delivery-owner-lanes-acceptance-2026-09-03",
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
    expect(work?.expectedOutput).toContain("Frontend Expert Roadmap v1");
    expect(work?.riskSummary).toContain("frontend readiness");
    expect(work?.riskSummary).toContain("design artifact is not product truth");

    expect(phase).toMatchObject({
      activeRole: "planning-partner",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Library, Design, Preview, Publish");
    expect(phase?.verificationTarget).toContain("lane-ready");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-frontend-roadmap-context",
      "write-red-frontend-roadmap-guard",
      "define-frontend-north-star",
      "map-frontend-phases",
      "define-first-lane-sequence",
      "preserve-frontend-truth-boundary",
      "verify-frontend-roadmap-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("Frontend Expert Roadmap v1"),
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

    expect(docText).toContain("# FlowDoc Frontend Expert Roadmap v1");
    expect(docText).toContain("Work Type: `planning-coordination` plus `ux-design-exploration`");
    expect(docText).toContain("North Star");
    expect(docText).toContain("Library, Design, Preview, and Publish");
    expect(docText).toContain("Design authoring surface");
    expect(docText).toContain("Preview confidence");
    expect(docText).toContain("Publish flow binding");
    expect(docText).toContain("WYSIWYG gate decision");
    expect(docText).toContain("lane-frontend-product-map");
    expect(docText).toContain("lane-design-workspace-usability");
    expect(docText).toContain("lane-progressive-authoring");
    expect(docText).toContain("lane-preview-confidence");
    expect(docText).toContain("lane-publish-flow-binding");
    expect(docText).toContain("lane-frontend-polish-and-accessibility");
    expect(docText).toContain("lane-wysiwyg-gate-decision");
    expect(docText).toContain("The design artifact is not product truth");
    expect(docText).toContain("No product repository files change in this roadmap phase");
    expect(docText).not.toMatch(/\bfrontend readiness: current\b/iu);
  });
});
