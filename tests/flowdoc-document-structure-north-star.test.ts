import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-document-structure-north-star";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-document-structure-north-star-2026-09-04";
const DOC_PATH = "docs/domains/flowdoc-document-structure-north-star-2026-09-04.md";
const PHASE_ID = "phase-flowdoc-document-structure-north-star-v1";
const CHECKLIST_ID = "checklist-flowdoc-document-structure-north-star-v1";
const EVIDENCE_ID = "evidence-flowdoc-document-structure-north-star-2026-09-04";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Document Structure North Star", () => {
  it("records the document-structure product north star without promoting implementation truth", async () => {
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
        "doc-flowdoc-frontend-expert-roadmap-2026-09-03",
        "doc-flowdoc-frontend-product-map-2026-09-03",
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
    expect(work?.expectedOutput).toContain("Document Structure North Star v1");
    expect(work?.riskSummary).toContain("not a Word or Google Docs style editor");
    expect(work?.riskSummary).toContain("not PDF-only");

    expect(phase).toMatchObject({
      activeRole: "planning-partner",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("document structure relationship");
    expect(phase?.verificationTarget).toContain("Draft, Version, and Publication");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-document-structure-context",
      "write-red-document-structure-north-star-guard",
      "define-document-structure-north-star",
      "define-structure-relationship-boundary",
      "define-draft-version-publication-boundary",
      "exclude-runtime-data-and-log-scope",
      "verify-document-structure-north-star-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("Document Structure North Star v1"),
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

    expect(docText).toContain("# FlowDoc Document Structure North Star v1");
    expect(docText).toContain("FlowDoc is a document-structure definition system");
    expect(docText).toContain("not a Word or Google Docs style editor");
    expect(docText).toContain("not a PDF-only system");
    expect(docText).toContain("Structure Relationship Model v0");
    expect(docText).toContain("DocumentDefinition");
    expect(docText).toContain("Section");
    expect(docText).toContain("StructurePatternDefinition");
    expect(docText).toContain("StructurePatternSlot");
    expect(docText).toContain("StructurePatternEntry");
    expect(docText).toContain("FieldDefinition");
    expect(docText).toContain("DataBinding");
    expect(docText).toContain("PageProfile");
    expect(docText).toContain("StyleDefaults");
    expect(docText).toContain("Build, Preview, Version, And Published Flow");
    expect(docText).toContain("Build defines the slot");
    expect(docText).toContain("Preview is a separate simulation surface");
    expect(docText).toContain("Draft, Version, And Publication");
    expect(docText).toContain("DocumentVersion is a frozen baseline");
    expect(docText).toContain("Publication is a pointer");
    expect(docText).toContain("PDF is the first renderer target");
    expect(docText).toContain("Runtime data, submissions, logs, audit trails, generated files, and permissions are out of scope");
    expect(docText).not.toMatch(/\bFlowDoc product truth: current\b/iu);
    expect(docText).not.toMatch(/\bPDF generation: ready\b/iu);
  });
});
