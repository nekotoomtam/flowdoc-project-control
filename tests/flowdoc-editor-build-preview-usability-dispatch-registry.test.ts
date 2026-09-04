import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const DOC_ID = "doc-flowdoc-editor-build-preview-usability-dispatch-registry-2026-09-04";
const DOC_PATH = "docs/domains/flowdoc-editor-build-preview-usability-dispatch-registry-2026-09-04.md";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Editor Build Preview usability dispatch registry", () => {
  it("records the current multi-room liveness and keeps pending Editor rooms unaccepted", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const document = model.documents.find((item) => item.id === DOC_ID);
    const docText = normalize(document?.content);

    expect(document).toMatchObject({
      lifecycle: "active",
      nodeIds: [],
      path: DOC_PATH,
      role: "decision",
    });
    expect(document?.authority).toContain("PLAN-owned Room Run Registry note");
    expect(document?.authority).toContain("awaiting terminal handoff");
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-editor-build-preview-usability-dispatch-registry.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));

    expect(docText).toContain("dispatch-editor-build-preview-usability-v0-2026-09-04-01");
    expect(docText).toContain("01a0637c-bc37-7cb1-8655-362695c4c6f7");
    expect(docText).toContain("parallelLimit");
    expect(docText).toContain("completionQueue.arrivalSequence");
    expect(docText).toContain("`clientThreadId` alone is not a monitorable retrievable locator");
    expect(docText).toContain("PLAN must not repair WORK output itself");
    expect(docText).toContain("same WORK room");

    expect(docText).toContain("room-editor-build-surface-creator-usability-2026-09-04-01");
    expect(docText).toContain("lane-editor-build-surface-creator-usability");
    expect(docText).toContain("client-new-thread:466055b5-ac7f-4e09-b749-84daf8c2f86a");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\e698\\FlowDocEditor");
    expect(docText).toContain("codex/editor-build-surface-creator-usability");
    expect(docText).toContain("Status: `needs-terminal-return`");

    expect(docText).toContain("room-editor-preview-entry-simulation-contract-2026-09-04-01");
    expect(docText).toContain("lane-editor-preview-entry-simulation-contract");
    expect(docText).toContain("client-new-thread:0f116be2-678a-4c59-991e-df9eb7973222");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\91c3\\FlowDocEditor");
    expect(docText).toContain("codex/editor-preview-entry-simulation-contract");
    expect(docText).toContain("src/app/editor/_components/__tests__/structurePatternWorkflow.test.ts");

    expect(docText).toContain("room-backend-document-structure-gateway-probe-2026-09-04-01");
    expect(docText).toContain("lane-backend-document-structure-gateway-probe");
    expect(docText).toContain("01a06c2b-3230-7c40-9ca7-2f827328c2ee");
    expect(docText).toContain("client-new-thread:7b177161-5005-4809-98f1-18849bb388c8");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\1044\\flowdoc-vnext-backend");
    expect(docText).toContain("handoff-backend-document-structure-gateway-probe-2026-09-04-01");
    expect(docText).toContain("Status: `accepted-readonly-context`");
    expect(docText).toContain("Terminal status: `PASS / RISK`");

    expect(docText).toContain("No Editor Build surface result accepted yet");
    expect(docText).toContain("No Editor Preview simulation result accepted yet");
    expect(docText).toContain("No Backend implementation lane opened from the probe");
    expect(docText).not.toMatch(/\bBuild readiness: current\b/iu);
    expect(docText).not.toMatch(/\bPreview readiness: current\b/iu);
    expect(docText).not.toMatch(/\bmap truth: current\b/iu);
  });
});
