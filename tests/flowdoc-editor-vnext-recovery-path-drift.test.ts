import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "flowdoc-design-workspace-usability";
const DOC_ID = "doc-flowdoc-editor-vnext-recovery-path-drift-2026-09-05";
const DOC_PATH = "docs/domains/flowdoc-editor-vnext-recovery-path-drift-2026-09-05.md";
const EVIDENCE_ID = "evidence-flowdoc-editor-vnext-recovery-path-drift-2026-09-05";
const EDITOR_SELECTED_REGION_MAIN_COMMIT = "8bcc17563daa91780dc01fbb8a7bf90eedc0cbea";
const EDITOR_MAIN_COMMIT = "12d3ebe0a9b69d054d66cf7752c836651c7ec2f2";
const RECOVERED_STATUS_COMMIT = "9e0097d87e91923218825021d4b7f0f9c60b7930";
const RECOVERED_SELECTED_REGION_COMMIT = "8b966ee30f6a978a3c20d8b2abf640d3d3eac86e";
const RECOVERED_STRUCTURE_PATTERN_COMMIT = "7a99bd0f959de8671f5e0fe5bf59fad1e98d4151";
const OLD_STATUS_COMMIT = "e78ae4160d1ab1759961dbeb3d646beb3490ec46";
const OLD_SELECTED_REGION_COMMIT = "cb3c1ca4e35973c3bd4f89d969826911e109e55c";
const OLD_STRUCTURE_PATTERN_COMMIT = "65ab5b149c5aad10b36bbaa23650b9fce7070dff";
const OLD_INTEGRATION_COMMIT = "715dd2e7edf0e7a3592ab7ff7e55cced361c836a";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Editor vNext recovery from old repo path drift", () => {
  it("records old FlowDocEditor evidence as suspect and points recovery to vNext Editor commits", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const docText = normalize(documents.get(DOC_ID)?.content);

    expect(work?.contextDocumentIds).toContain(DOC_ID);
    expect(work?.requiredEvidence).toContain(EVIDENCE_ID);
    expect(work?.expectedOutput).toContain("Wrong-repository evidence");
    expect(work?.expectedOutput).toContain(OLD_STATUS_COMMIT);
    expect(work?.expectedOutput).toContain(OLD_SELECTED_REGION_COMMIT);
    expect(work?.expectedOutput).toContain(RECOVERED_STATUS_COMMIT);
    expect(work?.expectedOutput).toContain(RECOVERED_STRUCTURE_PATTERN_COMMIT);
    expect(work?.expectedOutput).toContain(EDITOR_MAIN_COMMIT);
    expect(work?.riskSummary).toContain("path-drifted into old FlowDocEditor");
    expect(work?.riskSummary).toContain("superseded for canonical vNext purposes");
    expect(work?.riskSummary).toContain("pre-existing local Core dependency state");

    expect(documents.get(DOC_ID)).toMatchObject({
      authority: expect.stringContaining("Project Control recovery"),
      lifecycle: "active",
      nodeIds: [],
      path: DOC_PATH,
      role: "verification",
    });
    expect(documents.get(DOC_ID)?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: EDITOR_MAIN_COMMIT,
        repositoryId: "repo-editor",
      }),
    ]));

    expect(evidence.get(EVIDENCE_ID)).toMatchObject({
      commit: EDITOR_MAIN_COMMIT,
      nodeIds: [],
      pathOrContractId: expect.stringContaining(RECOVERED_SELECTED_REGION_COMMIT),
      repositoryId: "repo-editor",
    });
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("earliest confirmed drift");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(OLD_STATUS_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(OLD_SELECTED_REGION_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(OLD_STRUCTURE_PATTERN_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(OLD_INTEGRATION_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(RECOVERED_STATUS_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(RECOVERED_SELECTED_REGION_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(RECOVERED_STRUCTURE_PATTERN_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain(EDITOR_SELECTED_REGION_MAIN_COMMIT);
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("111 test files and 403 tests");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("5 test files and 15 tests");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("pre-existing local Core dependency state");
    expect(evidence.get(EVIDENCE_ID)?.verificationSummary).toContain("does not promote FlowDoc product truth");

    expect(docText).toContain("# FlowDoc Editor vNext Recovery From Old Repo Path Drift");
    expect(docText).toContain("earliest confirmed drift is 2026-09-03 17:46 +0700");
    expect(docText).toContain("wrong-repo evidence");
    expect(docText).toContain(OLD_STATUS_COMMIT);
    expect(docText).toContain(OLD_SELECTED_REGION_COMMIT);
    expect(docText).toContain(OLD_STRUCTURE_PATTERN_COMMIT);
    expect(docText).toContain(OLD_INTEGRATION_COMMIT);
    expect(docText).toContain(RECOVERED_STATUS_COMMIT);
    expect(docText).toContain(RECOVERED_SELECTED_REGION_COMMIT);
    expect(docText).toContain(RECOVERED_STRUCTURE_PATTERN_COMMIT);
    expect(docText).toContain(EDITOR_MAIN_COMMIT);
    expect(docText).toContain("Build/Preview usability records after the Structure Pattern foundation remain pending recovery");
    expect(docText).toContain("Full Editor `npm run check` did not pass");
    expect(docText).toContain("No system map changed");
    expect(docText).not.toMatch(/\bfrontend readiness: current\b/iu);
    expect(docText).not.toMatch(/\bPreview readiness: current\b/iu);
    expect(docText).not.toMatch(/\bPublish readiness: current\b/iu);
    expect(docText).not.toMatch(/\bWYSIWYG readiness: current\b/iu);
    expect(docText).not.toMatch(/\bmap truth: current\b/iu);
  });
});
