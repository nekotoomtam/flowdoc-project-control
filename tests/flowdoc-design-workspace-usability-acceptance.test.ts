import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-design-workspace-usability";
const PARENT_WORK_ID = "flowdoc-frontend-product-map";
const DOC_ID = "doc-flowdoc-design-workspace-usability-acceptance-2026-09-03";
const DOC_PATH = "docs/domains/flowdoc-design-workspace-usability-acceptance-2026-09-03.md";
const PHASE_ID = "phase-flowdoc-design-workspace-usability-acceptance-v1";
const CHECKLIST_ID = "checklist-flowdoc-design-workspace-usability-acceptance-v1";
const EVIDENCE_ID = "evidence-editor-design-workspace-usability-2026-09-03";
const EDITOR_COMMIT = "e78ae4160d1ab1759961dbeb3d646beb3490ec46";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc design workspace usability acceptance", () => {
  it("records PLAN acceptance for the bounded Editor Design workspace lane", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);

    expect(model.work.find((item) => item.id === PARENT_WORK_ID)?.childWorkIds).toContain(WORK_ID);
    expect(model.nodes.find((node) => node.id === "flowdoc")).toMatchObject({
      truthState: "planned",
      workIds: expect.arrayContaining([WORK_ID]),
    });
    expect(model.nodes.find((node) => node.id === "flowdoc")?.evidenceIds).not.toContain(EVIDENCE_ID);
    expect(model.nodes.find((node) => node.id === "flowdoc")?.documentIds).not.toContain(DOC_ID);

    expect(work).toMatchObject({
      activeRole: "product-implementation-agent",
      contextDocumentIds: expect.arrayContaining([
        "doc-flowdoc-frontend-expert-roadmap-2026-09-03",
        "doc-flowdoc-frontend-product-map-2026-09-03",
        "doc-flowdoc-wysiwyg-gate-decision-2026-09-03",
        DOC_ID,
      ]),
      nodeId: "flowdoc",
      parentWorkId: PARENT_WORK_ID,
      phaseIds: expect.arrayContaining([PHASE_ID]),
      repositoryIds: ["repo-editor", "repo-project-control"],
      requiredEvidence: [EVIDENCE_ID],
      workKind: "task",
      workPathIds: [
        "flowdoc-product-development-resumption",
        "flowdoc-frontend-expert-roadmap",
        PARENT_WORK_ID,
        WORK_ID,
      ],
      workState: "in-review",
    });
    expect(work?.expectedOutput).toContain(EDITOR_COMMIT);
    expect(work?.expectedOutput).toContain("Preview unavailable");
    expect(work?.expectedOutput).toContain("Publish blocked");
    expect(work?.riskSummary).toContain("does not promote frontend readiness");

    expect(phase).toMatchObject({
      activeRole: "evidence-reviewer",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain("automatic return");
    expect(phase?.verificationTarget).toContain("revision");
    expect(phase?.verificationTarget).toContain("review:browser");

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "stage-design-workspace-handoff",
      "send-revision-for-dirty-agents",
      "verify-clean-revision-return",
      "run-editor-main-gates",
      "accept-design-workspace-usability",
      "preserve-wysiwyg-preview-publish-boundaries",
      "record-project-control-evidence",
      "verify-design-workspace-records",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(EVIDENCE_ID))).toBe(true);

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("PLAN acceptance"),
      lifecycle: "active",
      nodeIds: [],
      path: DOC_PATH,
      role: "verification",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: EDITOR_COMMIT,
        pathOrContractId: expect.stringContaining("EditorToolbar.tsx"),
        repositoryId: "repo-editor",
      }),
    ]));

    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: EDITOR_COMMIT,
      nodeIds: [],
      pathOrContractId: expect.stringContaining("lane-design-workspace-usability"),
      repositoryId: "repo-editor",
    });
    expect(evidence.get(EVIDENCE_ID)?.pathOrContractId).toContain("01a066b4-6040-7e42-95d6-ac09d36a385f");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("automatic WORK-to-PLAN Return Channel");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("revisionAttempt 1");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("Preview unavailable");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("Publish blocked");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("review:gate");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("review:browser");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not prove FlowDoc product truth");

    expect(docText).toContain("# FlowDoc Design Workspace Usability Acceptance");
    expect(docText).toContain("dispatch-frontend-design-and-wysiwyg-2026-09-03-01");
    expect(docText).toContain("lane-design-workspace-usability");
    expect(docText).toContain(EDITOR_COMMIT);
    expect(docText).toContain("automatic Return Channel");
    expect(docText).toContain("Revision Packet");
    expect(docText).toContain("Preview as unavailable");
    expect(docText).toContain("Publish as blocked");
    expect(docText).toContain("PLAN did not patch the Editor product lane");
    expect(docText).toContain("does not promote");
    expect(docText).not.toMatch(/\bfrontend readiness: current\b/iu);
    expect(docText).not.toMatch(/\bWYSIWYG readiness: current\b/iu);
    expect(docText).not.toMatch(/\bpublish readiness: current\b/iu);
    expect(docText).not.toMatch(/\bmap truth: current\b/iu);
  });
});
