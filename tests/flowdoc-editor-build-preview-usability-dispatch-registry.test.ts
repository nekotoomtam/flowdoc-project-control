import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const DOC_ID = "doc-flowdoc-editor-build-preview-usability-dispatch-registry-2026-09-04";
const DOC_PATH = "docs/domains/flowdoc-editor-build-preview-usability-dispatch-registry-2026-09-04.md";
const EVIDENCE_ID = "evidence-flowdoc-editor-build-preview-usability-dispatch-accepted-2026-09-04";
const BUILD_COMMIT = "78dbae50e234487e64c58eae5480d8a8f1c16f97";
const PREVIEW_R1_COMMIT = "76e32076a6588fb48def07daaf08825c41afa334";
const EDITOR_MAIN_COMMIT = "715dd2e7edf0e7a3592ab7ff7e55cced361c836a";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Editor Build Preview usability dispatch registry", () => {
  it("records accepted Build, accepted-after-revision Preview, and read-only Backend context without promoting readiness", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((item) => [item.id, item]));
    const evidence = new Map(model.evidence.map((item) => [item.id, item]));
    const document = documents.get(DOC_ID);
    const entry = evidence.get(EVIDENCE_ID);
    const docText = normalize(document?.content);

    expect(document).toMatchObject({
      lifecycle: "active",
      nodeIds: [],
      path: DOC_PATH,
      role: "decision",
    });
    expect(document?.authority).toContain("PLAN-owned Room Run Registry and acceptance note");
    expect(document?.authority).toContain("one same-room Preview revision");
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-editor-build-preview-usability-dispatch-registry.test.ts"),
        repositoryId: "repo-project-control",
      }),
      expect.objectContaining({
        commit: EDITOR_MAIN_COMMIT,
        repositoryId: "repo-editor",
      }),
    ]));

    expect(entry).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining("dispatch-editor-build-preview-usability-v0-2026-09-04-01"),
      repositoryId: "repo-project-control",
    });
    expect(entry?.verificationSummary).toContain("automatic Return Channel");
    expect(entry?.verificationSummary).toContain("revisionAttempt 1");
    expect(entry?.verificationSummary).toContain(BUILD_COMMIT);
    expect(entry?.verificationSummary).toContain(PREVIEW_R1_COMMIT);
    expect(entry?.verificationSummary).toContain(EDITOR_MAIN_COMMIT);
    expect(entry?.verificationSummary).toContain("1160 passed");
    expect(entry?.verificationSummary).toContain("smoke:editor passed");
    expect(entry?.verificationSummary).toContain("does not promote FlowDoc product truth or map truth");

    expect(docText).toContain("dispatch-editor-build-preview-usability-v0-2026-09-04-01");
    expect(docText).toContain("01a0637c-bc37-7cb1-8655-362695c4c6f7");
    expect(docText).toContain("parallelLimit");
    expect(docText).toContain("completionQueue.arrivalSequence");
    expect(docText).toContain("`clientThreadId` alone is not a monitorable retrievable locator");
    expect(docText).toContain("PLAN must not repair WORK output itself");
    expect(docText).toContain("same WORK room");

    expect(docText).toContain("room-editor-build-surface-creator-usability-2026-09-04-01");
    expect(docText).toContain("lane-editor-build-surface-creator-usability");
    expect(docText).toContain("01a06c2b-3211-7621-9ba8-ff9eb5021dcc");
    expect(docText).toContain("client-new-thread:466055b5-ac7f-4e09-b749-84daf8c2f86a");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\e698\\FlowDocEditor");
    expect(docText).toContain("Status: `accepted`");
    expect(docText).toContain(BUILD_COMMIT);

    expect(docText).toContain("room-editor-preview-entry-simulation-contract-2026-09-04-01");
    expect(docText).toContain("lane-editor-preview-entry-simulation-contract");
    expect(docText).toContain("01a06c2b-322a-7b43-85a7-ef732195b723");
    expect(docText).toContain("client-new-thread:0f116be2-678a-4c59-991e-df9eb7973222");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\91c3\\FlowDocEditor");
    expect(docText).toContain("Status: `accepted-after-revision`");
    expect(docText).toContain("First acceptance decision: `needs-revision`");
    expect(docText).toContain("revision-editor-preview-entry-simulation-contract-2026-09-04-01");
    expect(docText).toContain("handoff-editor-preview-entry-simulation-contract-2026-09-04-01-r1");
    expect(docText).toContain(PREVIEW_R1_COMMIT);

    expect(docText).toContain("room-backend-document-structure-gateway-probe-2026-09-04-01");
    expect(docText).toContain("lane-backend-document-structure-gateway-probe");
    expect(docText).toContain("01a06c2b-3230-7c40-9ca7-2f827328c2ee");
    expect(docText).toContain("client-new-thread:7b177161-5005-4809-98f1-18849bb388c8");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\1044\\flowdoc-vnext-backend");
    expect(docText).toContain("Status: `accepted-readonly-context`");
    expect(docText).toContain("Terminal status: `PASS / RISK`");

    expect(docText).toContain("getByLabel(/Customer name/)");
    expect(docText).toContain("npm run review:gate");
    expect(docText).toContain("npm run smoke:editor");
    expect(docText).toContain("app tests 129 files / 1160 passed");
    expect(docText).toContain(EDITOR_MAIN_COMMIT);
    expect(docText).toContain("No Backend behavior changed in this dispatch");
    expect(docText).toContain("No persistent Structure Pattern Entry storage added");
    expect(docText).not.toMatch(/\bBuild readiness: current\b/iu);
    expect(docText).not.toMatch(/\bPreview readiness: current\b/iu);
    expect(docText).not.toMatch(/\bmap truth: current\b/iu);
  });
});
