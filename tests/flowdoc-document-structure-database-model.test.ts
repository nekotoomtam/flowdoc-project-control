import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-document-structure-database-model";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-document-structure-database-model-2026-09-04";
const DOC_PATH = "docs/domains/flowdoc-document-structure-database-model-2026-09-04.md";
const PHASE_ID = "phase-flowdoc-document-structure-database-model-v0-0-1";
const CHECKLIST_ID = "checklist-flowdoc-document-structure-database-model-v0-0-1";
const EVIDENCE_ID = "evidence-flowdoc-document-structure-database-model-2026-09-04";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Document Structure Database Model", () => {
  it("records the v0.0.1 structure database model without implementing product database behavior", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);
    const productDomainText = normalize(documents.get("doc-flowdoc-product-domain-relationship-2026-09-04")?.content);
    const systemMapText = normalize(documents.get("doc-flowdoc-system-map")?.content);

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
        "doc-flowdoc-document-structure-north-star-2026-09-04",
        "doc-flowdoc-product-domain-relationship-2026-09-04",
      ]),
      nodeId: "flowdoc",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      requiredEvidence: expect.arrayContaining([
        EVIDENCE_ID,
        "evidence-flowdoc-backend-document-structure-database-v0-0-1-2026-09-04",
      ]),
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workKind: "task",
      workPathIds: [PARENT_WORK_ID, WORK_ID],
      workState: "in-progress",
    });
    expect(work?.expectedOutput).toContain("FlowDoc Document Structure Database Model v0.0.1");
    expect(work?.riskSummary).toContain("not a SQL migration");
    expect(work?.riskSummary).toContain("not a product database implementation");

    expect(phase).toMatchObject({
      activeRole: "planning-partner",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("draft tables");
    expect(phase?.verificationTarget).toContain("version tables");
    expect(phase?.verificationTarget).toContain("publication pointer");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-document-structure-database-context",
      "write-red-document-structure-database-guard",
      "define-draft-and-component-library-tables",
      "define-version-freeze-tables",
      "define-publication-pointer-and-cache-boundary",
      "define-field-type-master-boundary",
      "exclude-runtime-and-implementation-scope",
      "verify-document-structure-database-model-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("FlowDoc Document Structure Database Model v0.0.1"),
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

    expect(docText).toContain("# FlowDoc Document Structure Database Model v0.0.1");
    expect(docText).toContain("not a SQL migration");
    expect(docText).toContain("not a product database implementation");
    expect(docText).toContain("DocumentDefinition");
    expect(docText).toContain("DocumentDraft");
    expect(docText).toContain("Structure Pattern Terminology Clarification");
    expect(docText).toContain("Structure Pattern Slots");
    expect(docText).toContain("Structure Pattern Entries");
    expect(docText).toContain("not runtime repeated entries");
    expect(docText).toContain("draft_sections");
    expect(docText).toContain("parent_draft_section_id");
    expect(docText).toContain("component_definitions");
    expect(docText).toContain("component_drafts");
    expect(docText).toContain("component_fields");
    expect(docText).toContain("component_versions");
    expect(docText).toContain("component_version_fields");
    expect(docText).toContain("document_versions");
    expect(docText).toContain("document_version_sections");
    expect(docText).toContain("parent_version_section_id");
    expect(docText).toContain("document_version_component_instances");
    expect(docText).toContain("document_version_fields");
    expect(docText).toContain("document_version_bindings");
    expect(docText).toContain("document_publications");
    expect(docText).toContain("field_types");
    expect(docText).toContain("text");
    expect(docText).toContain("number");
    expect(docText).toContain("date");
    expect(docText).toContain("boolean");
    expect(docText).toContain("no format_types");
    expect(docText).toContain("no validation_rule_types");
    expect(docText).toContain("Publication is a pointer");
    expect(docText).toContain("published snapshot/cache");
    expect(docText).toContain("actual submitted values");
    expect(docText).toContain("Runtime Submission");
    expect(docText).toContain("prepared_component_relations");
    expect(docText).toContain("inactive");
    expect(docText).toContain("page width and height");
    expect(docText).toContain("style_defaults");
    expect(docText).toContain("field_type_id");
    expect(docText).toContain("field_type_snapshot");
    expect(docText).not.toMatch(/\bfull\s+SQL\s+schema\b.*\bcomplete\b/iu);
    expect(docText).not.toMatch(/\bFlowDoc product truth: current\b/iu);
    expect(docText).not.toMatch(/\bproduction readiness\b.*\bready\b/iu);

    expect(productDomainText).toContain("FlowDoc Document Structure Database Model v0.0.1");
    expect(systemMapText).toContain("FlowDoc Document Structure Database Model");
    expect(systemMapText).toContain("not a SQL migration");
  });
});
