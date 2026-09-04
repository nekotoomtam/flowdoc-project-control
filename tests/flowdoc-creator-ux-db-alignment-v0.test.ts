import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-creator-ux-db-alignment-v0";
const PARENT_WORK_ID = "flowdoc-document-structure-database-model";
const UX_DOC_ID = "doc-flowdoc-creator-ux-contract-v0-2026-09-04";
const UX_DOC_PATH = "docs/domains/flowdoc-creator-ux-contract-v0-2026-09-04.md";
const DB_DOC_ID = "doc-flowdoc-document-structure-database-model-v0-0-2-2026-09-04";
const DB_DOC_PATH = "docs/domains/flowdoc-document-structure-database-model-v0-0-2-2026-09-04.md";
const PHASE_ID = "phase-flowdoc-creator-ux-db-alignment-v0";
const CHECKLIST_ID = "checklist-flowdoc-creator-ux-db-alignment-v0";
const EVIDENCE_ID = "evidence-flowdoc-creator-ux-db-alignment-v0-2026-09-04";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Creator UX and DB Alignment v0", () => {
  it("records the Structure Pattern slot/entry contract without promoting product implementation truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const parentWork = model.work.find((item) => item.id === PARENT_WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const uxDocText = normalize(documents.get(UX_DOC_ID)?.content);
    const dbDocText = normalize(documents.get(DB_DOC_ID)?.content);
    const systemMapText = normalize(documents.get("doc-flowdoc-system-map")?.content);
    const domainMapText = normalize(documents.get("doc-flowdoc-product-domain-relationship-2026-09-04")?.content);

    expect(parentWork?.childWorkIds).toContain(WORK_ID);
    expect(parentWork?.requiredEvidence).toEqual(expect.arrayContaining([EVIDENCE_ID]));
    expect(model.nodes.find((node) => node.id === "flowdoc")?.documentIds).toEqual(expect.arrayContaining([
      UX_DOC_ID,
      DB_DOC_ID,
    ]));
    expect(model.nodes.find((node) => node.id === "flowdoc")?.truthState).toBe("planned");

    expect(work).toMatchObject({
      activeRole: "planning-partner",
      contextDocumentIds: expect.arrayContaining([
        "doc-flowdoc-system-map",
        "doc-flowdoc-product-domain-relationship-2026-09-04",
        "doc-flowdoc-document-structure-north-star-2026-09-04",
        "doc-flowdoc-document-structure-database-model-2026-09-04",
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
    expect(work?.expectedOutput).toContain("Creator UX Contract v0");
    expect(work?.expectedOutput).toContain("Database Model v0.0.2");
    expect(work?.riskSummary).toContain("not a product database implementation");
    expect(work?.riskSummary).toContain("not frontend readiness");

    expect(phase).toMatchObject({
      activeRole: "planning-partner",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("Structure Pattern Slot");
    expect(phase?.verificationTarget).toContain("Structure Pattern Entry");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-creator-ux-db-alignment-context",
      "write-red-creator-ux-db-alignment-guard",
      "define-creator-ux-flow-contract",
      "define-structure-pattern-slot-entry-boundary",
      "define-database-model-v0-0-2",
      "exclude-runtime-and-product-implementation-scope",
      "verify-creator-ux-db-alignment-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(UX_DOC_ID)).toMatchObject({
      authority: expect.stringContaining("Creator UX Contract v0"),
      lifecycle: "active",
      nodeIds: ["flowdoc"],
      path: UX_DOC_PATH,
      role: "decision",
    });
    expect(documents.get(DB_DOC_ID)).toMatchObject({
      authority: expect.stringContaining("Document Structure Database Model v0.0.2"),
      lifecycle: "active",
      nodeIds: ["flowdoc"],
      path: DB_DOC_PATH,
      role: "decision",
    });
    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining(DB_DOC_PATH),
      repositoryId: "repo-project-control",
    });

    expect(uxDocText).toContain("Document Structure Library -> Build -> Preview -> Versions -> Published/API");
    expect(uxDocText).toContain("Build is draft authoring");
    expect(uxDocText).toContain("Document Surface");
    expect(uxDocText).toContain("Document");
    expect(uxDocText).toContain("Fields");
    expect(uxDocText).toContain("Structure Patterns");
    expect(uxDocText).toContain("Settings");
    expect(uxDocText).toContain("Build defines the slot");
    expect(uxDocText).toContain("Preview or runtime creates the entries");
    expect(uxDocText).toContain("Version freezes");
    expect(uxDocText).toContain("Publication points");

    expect(dbDocText).toContain("draft_structure_pattern_slots");
    expect(dbDocText).toContain("document_version_structure_pattern_slots");
    expect(dbDocText).toContain("structure_pattern_definitions");
    expect(dbDocText).toContain("structure_pattern_versions");
    expect(dbDocText).toContain("draft_fields");
    expect(dbDocText).toContain("document_version_fields");
    expect(dbDocText).toContain("document_version_bindings");
    expect(dbDocText).toContain("repeat_mode");
    expect(dbDocText).toContain("min_entries");
    expect(dbDocText).toContain("max_entries");
    expect(dbDocText).toContain("layout_region_key");
    expect(dbDocText).toContain("flow_mode");
    expect(dbDocText).toContain("overflow_behavior");
    expect(dbDocText).toContain("slot-driven freeze");
    expect(dbDocText).toContain("only Structure Patterns referenced by slots");
    expect(dbDocText).toContain("record_json must not become canonical truth");
    expect(dbDocText).toContain("Runtime Structure Pattern Entries are out of scope");
    expect(dbDocText).not.toMatch(/\bSQL\s+migration\s+complete\s+and\s+ready\b/iu);
    expect(dbDocText).not.toMatch(/\bfrontend readiness\b.*\bready\b/iu);

    expect(systemMapText).toContain("FlowDoc Creator UX Contract v0");
    expect(systemMapText).toContain("FlowDoc Document Structure Database Model v0.0.2");
    expect(domainMapText).toContain("FlowDoc Document Structure Database Model v0.0.2");
  });
});
