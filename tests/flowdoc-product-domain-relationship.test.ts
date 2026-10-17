import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-product-domain-relationship";
const PARENT_WORK_ID = "flowdoc-product-development-resumption";
const DOC_ID = "doc-flowdoc-product-domain-relationship-2026-09-04";
const DOC_PATH = "docs/domains/flowdoc-product-domain-relationship-2026-09-04.md";
const PHASE_ID = "phase-flowdoc-product-domain-relationship-v0";
const CHECKLIST_ID = "checklist-flowdoc-product-domain-relationship-v0";
const EVIDENCE_ID = "evidence-flowdoc-product-domain-relationship-2026-09-04";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Product Domain Relationship", () => {
  it("records a domain-level reading map without turning it into a full schema", async () => {
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
        "doc-document-map-operating-rules",
        "doc-flowdoc-role-catalog",
        "doc-agent-skill-operating-model",
        "doc-flowdoc-documentation-authority-policy",
        "doc-flowdoc-agent-documentation-authority-operating-rules",
        "doc-flowdoc-product-terminology",
        "doc-flowdoc-product-terminology-th",
        "doc-flowdoc-document-structure-north-star-2026-09-04",
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
    expect(work?.expectedOutput).toContain("FlowDoc Product Domain Relationship v0");
    expect(work?.riskSummary).toContain("not a full database schema");
    expect(work?.riskSummary).toContain("reading router");

    expect(phase).toMatchObject({
      activeRole: "planning-partner",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("domain-level relationship map");
    expect(phase?.verificationTarget).toContain("follow-up domain documents");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "capture-product-domain-relationship-context",
      "write-red-product-domain-relationship-guard",
      "define-domain-map-boundary",
      "list-major-product-domains",
      "define-cross-domain-reading-rules",
      "route-document-structure-next",
      "verify-product-domain-relationship-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("FlowDoc Product Domain Relationship v0"),
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

    expect(docText).toContain("# FlowDoc Product Domain Relationship v0");
    expect(docText).toContain("domain-level relationship map");
    expect(docText).toContain("reading router");
    expect(docText).toContain("not a full database schema");
    expect(docText).toContain("Document Structure");
    expect(docText).toContain("Component Library");
    expect(docText).toContain("Dataset / Data Contract");
    expect(docText).toContain("Version / Publication");
    expect(docText).toContain("Runtime Submission");
    expect(docText).toContain("Rendering / Generation Job");
    expect(docText).toContain("Generated Artifact / File Storage");
    expect(docText).toContain("Workflow / Approval");
    expect(docText).toContain("Permission / Access Control");
    expect(docText).toContain("Audit Trail");
    expect(docText).toContain("Activity Feed / Notification");
    expect(docText).toContain("Billing / Usage Metering");
    expect(docText).toContain("Integration / External Consumption");
    expect(docText).toContain("FlowDoc Document Structure Database Model v0.0.1");
    expect(docText).toContain("Publication / Version Lifecycle");
    expect(docText).toContain("Runtime Submission And Rendering Flow");
    expect(docText).toContain("Permission Scope Model");
    expect(docText).toContain("Audit Trail observes important events");
    expect(docText).toContain("Activity Feed summarizes selected events");
    expect(docText).not.toMatch(/\bfull\s+schema\b.*\bcomplete\b/iu);
    expect(docText).not.toMatch(/\bFlowDoc product truth: current\b/iu);
    expect(docText).not.toMatch(/\bproduction readiness\b.*\bready\b/iu);
    expect(systemMapText).toContain("FlowDoc Product Domain Relationship");
    expect(systemMapText).toContain("product-domain relationship map and reading router");
    expect(systemMapText).toContain("does not promote database schema completeness");
  });
});
