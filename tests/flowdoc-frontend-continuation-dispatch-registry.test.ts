import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const DOC_ID = "doc-flowdoc-frontend-continuation-dispatch-registry-2026-09-03";
const DOC_PATH = "docs/domains/flowdoc-frontend-continuation-dispatch-registry-2026-09-03.md";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc frontend continuation dispatch registry", () => {
  it("records monitorable locators for the active two-room frontend dispatch set", async () => {
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
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-frontend-continuation-dispatch-registry.test.ts"),
        repositoryId: "repo-project-control",
      }),
    ]));

    expect(docText).toContain("dispatch-frontend-continuation-2026-09-03-01");
    expect(docText).toContain("01a0637c-bc37-7cb1-8655-362695c4c6f7");
    expect(docText).toContain("parallelLimit");
    expect(docText).toContain("completionQueue.arrivalSequence");
    expect(docText).toContain("PLAN must not repair WORK output itself");
    expect(docText).toContain("needs-revision");
    expect(docText).toContain("same WORK room");

    expect(docText).toContain("room-design-selected-region-cleanup-2026-09-03-01");
    expect(docText).toContain("lane-design-selected-region-command-affordance-cleanup");
    expect(docText).toContain("01a06786-74da-73e2-a852-64e9c7351aef");
    expect(docText).toContain("client-new-thread:d74a80b7-0797-4f81-bdd6-599f4a46fe54");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\e543\\FlowDocEditor");
    expect(docText).toContain("handoff-design-selected-region-command-affordance-cleanup-2026-09-03-01");

    expect(docText).toContain("room-preview-confidence-probe-2026-09-03-01");
    expect(docText).toContain("lane-preview-confidence-probe");
    expect(docText).toContain("01a06786-7d05-7be3-b939-8ff6e7917e61");
    expect(docText).toContain("client-new-thread:edf48cb6-c459-408c-97de-1e7395b11283");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\758f\\flowdoc-project-control");
    expect(docText).toContain("handoff-preview-confidence-probe-2026-09-03-01");

    expect(docText).toContain("automatic Terminal Handoff not yet received");
    expect(docText).toContain("does not satisfy automatic return");
    expect(docText).not.toMatch(/\bfrontend readiness: current\b/iu);
    expect(docText).not.toMatch(/\bPreview readiness: current\b/iu);
    expect(docText).not.toMatch(/\bmap truth: current\b/iu);
  });
});
