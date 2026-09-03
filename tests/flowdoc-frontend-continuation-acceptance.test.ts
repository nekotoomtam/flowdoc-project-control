import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const DISPATCH_DOC_ID = "doc-flowdoc-frontend-continuation-dispatch-registry-2026-09-03";
const SELECTED_REGION_DOC_ID = "doc-flowdoc-design-selected-region-command-affordance-acceptance-2026-09-03";
const PREVIEW_DOC_ID = "doc-flowdoc-preview-confidence-probe-2026-09-03";
const SELECTED_REGION_EVIDENCE_ID = "evidence-editor-design-selected-region-command-affordance-cleanup-2026-09-03";
const PREVIEW_EVIDENCE_ID = "evidence-flowdoc-preview-confidence-probe-2026-09-03";
const SELECTED_REGION_PHASE_ID = "phase-flowdoc-design-selected-region-command-affordance-acceptance-v1";
const PREVIEW_PHASE_ID = "phase-flowdoc-frontend-product-map-preview-confidence-probe-v1";
const SELECTED_REGION_CHECKLIST_ID = "checklist-flowdoc-design-selected-region-command-affordance-acceptance-v1";
const PREVIEW_CHECKLIST_ID = "checklist-flowdoc-frontend-product-map-preview-confidence-probe-v1";
const EDITOR_COMMIT = "cb3c1ca4e35973c3bd4f89d969826911e109e55c";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc frontend continuation acceptance", () => {
  it("records accepted Editor selected-region work and bounded Preview probe output", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const phases = new Map(model.phases.map((phase) => [phase.id, phase]));
    const checklists = new Map(model.checklists.map((checklist) => [checklist.id, checklist]));
    const designWork = model.work.find((item) => item.id === "flowdoc-design-workspace-usability");
    const productMapWork = model.work.find((item) => item.id === "flowdoc-frontend-product-map");

    const dispatchDocText = normalize(documents.get(DISPATCH_DOC_ID)?.content);
    const selectedRegionDocText = normalize(documents.get(SELECTED_REGION_DOC_ID)?.content);
    const previewDocText = normalize(documents.get(PREVIEW_DOC_ID)?.content);

    expect(designWork?.phaseIds).toContain(SELECTED_REGION_PHASE_ID);
    expect(designWork?.contextDocumentIds).toContain(SELECTED_REGION_DOC_ID);
    expect(designWork?.requiredEvidence).toEqual(expect.arrayContaining([
      "evidence-editor-design-workspace-usability-2026-09-03",
      SELECTED_REGION_EVIDENCE_ID,
    ]));
    expect(designWork?.expectedOutput).toContain(EDITOR_COMMIT);
    expect(designWork?.expectedOutput).toContain("selected-region command summary");

    expect(productMapWork?.phaseIds).toContain(PREVIEW_PHASE_ID);
    expect(productMapWork?.contextDocumentIds).toEqual(expect.arrayContaining([
      DISPATCH_DOC_ID,
      PREVIEW_DOC_ID,
    ]));
    expect(productMapWork?.requiredEvidence).toEqual(expect.arrayContaining([
      "evidence-flowdoc-frontend-product-map-2026-09-03",
      PREVIEW_EVIDENCE_ID,
    ]));
    expect(productMapWork?.expectedOutput).toContain("lane-preview-confidence-validation");

    expect(phases.get(SELECTED_REGION_PHASE_ID)).toMatchObject({
      activeRole: "evidence-reviewer",
      phaseState: "done",
      repositoryIds: ["repo-project-control", "repo-editor"],
      workId: "flowdoc-design-workspace-usability",
    });
    expect(phases.get(PREVIEW_PHASE_ID)).toMatchObject({
      activeRole: "evidence-reviewer",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: "flowdoc-frontend-product-map",
    });

    expect(checklists.get(SELECTED_REGION_CHECKLIST_ID)?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklists.get(PREVIEW_CHECKLIST_ID)?.items.every((item) => item.state === "passed")).toBe(true);

    expect(documents.get(SELECTED_REGION_DOC_ID)).toMatchObject({
      lifecycle: "active",
      nodeIds: [],
      role: "verification",
    });
    expect(documents.get(PREVIEW_DOC_ID)).toMatchObject({
      lifecycle: "active",
      nodeIds: [],
      role: "decision",
    });

    expect(evidence.get(SELECTED_REGION_EVIDENCE_ID)).toMatchObject({
      commit: EDITOR_COMMIT,
      nodeIds: [],
      repositoryId: "repo-editor",
    });
    expect(evidence.get(SELECTED_REGION_EVIDENCE_ID)?.verificationSummary).toContain("automatic WORK-to-PLAN Return Channel");
    expect(evidence.get(SELECTED_REGION_EVIDENCE_ID)?.verificationSummary).toContain("review:gate");
    expect(evidence.get(SELECTED_REGION_EVIDENCE_ID)?.verificationSummary).toContain("review:browser");
    expect(evidence.get(SELECTED_REGION_EVIDENCE_ID)?.verificationSummary).toContain("does not prove Preview readiness");

    expect(evidence.get(PREVIEW_EVIDENCE_ID)).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-project-control",
    });
    expect(evidence.get(PREVIEW_EVIDENCE_ID)?.verificationSummary).toContain("Preview vocabulary");
    expect(evidence.get(PREVIEW_EVIDENCE_ID)?.verificationSummary).toContain("lane-preview-confidence-validation");
    expect(evidence.get(PREVIEW_EVIDENCE_ID)?.verificationSummary).toContain("does not prove Preview readiness");

    expect(dispatchDocText).toContain("`arrivalSequence: 1`");
    expect(dispatchDocText).toContain("`arrivalSequence: 2`");
    expect(dispatchDocText).toContain("Status: `accepted`");
    expect(dispatchDocText).toContain(EDITOR_COMMIT);

    expect(selectedRegionDocText).toContain("selected-region command summary");
    expect(selectedRegionDocText).toContain("PLAN did not patch Editor product files");
    expect(selectedRegionDocText).toContain(EDITOR_COMMIT);
    expect(selectedRegionDocText).not.toMatch(/\bfrontend readiness: current\b/iu);
    expect(selectedRegionDocText).not.toMatch(/\bPreview readiness: current\b/iu);
    expect(selectedRegionDocText).not.toMatch(/\bPublish readiness: current\b/iu);

    expect(previewDocText).toContain("Preview Confidence Probe");
    expect(previewDocText).toContain("Draft Preview");
    expect(previewDocText).toContain("Published Preview");
    expect(previewDocText).toContain("lane-preview-confidence-validation");
    expect(previewDocText).toContain("Progressive Authoring can proceed independently");
    expect(previewDocText).not.toMatch(/\bPreview readiness: current\b/iu);
    expect(previewDocText).not.toMatch(/\bfrontend readiness: current\b/iu);
    expect(previewDocText).not.toMatch(/\bmap truth: current\b/iu);
  });
});
