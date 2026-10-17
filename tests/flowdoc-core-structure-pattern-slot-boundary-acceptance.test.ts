import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const DOC_ID = "doc-flowdoc-core-structure-pattern-slot-boundary-acceptance-2026-09-05";
const DOC_PATH = "docs/domains/flowdoc-core-structure-pattern-slot-boundary-acceptance-2026-09-05.md";
const EVIDENCE_ID = "evidence-flowdoc-core-structure-pattern-slot-boundary-accepted-2026-09-05";
const WORK_COMMIT = "0de05a3fe3502847d1179c1d2debb2f4c02e514f";
const CORE_MAIN_COMMIT = "e3b988806ebaa4fdbda4b426924543605e539c2f";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Core Structure Pattern Slot boundary acceptance", () => {
  it("records the automatic WORK return, Core main merge, verification, and unpromoted boundaries", async () => {
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
    expect(document?.authority).toContain("RISK-FD-008 closure for the known dirty Core slice");
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-core-structure-pattern-slot-boundary-acceptance.test.ts"),
        repositoryId: "repo-project-control",
      }),
      expect.objectContaining({
        commit: CORE_MAIN_COMMIT,
        pathOrContractId: expect.stringContaining("src/lifecycle/structurePatternSlots.ts"),
        repositoryId: "repo-core",
      }),
    ]));

    expect(entry).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining("dispatch-core-dirty-risk-0905"),
      repositoryId: "repo-project-control",
    });
    expect(entry?.verificationSummary).toContain("automatic Return Channel");
    expect(entry?.verificationSummary).toContain(WORK_COMMIT);
    expect(entry?.verificationSummary).toContain(CORE_MAIN_COMMIT);
    expect(entry?.verificationSummary).toContain("Structure Pattern Slot semantic boundary");
    expect(entry?.verificationSummary).toContain("2 files and 5 tests");
    expect(entry?.verificationSummary).toContain("432 files and 2791 tests passed");
    expect(entry?.verificationSummary).toContain("does not promote FlowDoc product truth or map truth");

    expect(docText).toContain("dispatch-core-dirty-risk-0905");
    expect(docText).toContain("01a0637c-bc37-7cb1-8655-362695c4c6f7");
    expect(docText).toContain("`parallelLimit`: `1`");
    expect(docText).toContain("client-new-thread:d1961338-a2c6-41e8-ab5b-e7a098b5409c");
    expect(docText).toContain("01a07040-3005-7ad0-9bb4-988098e24aa5");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\8faf\\flowdoc-vnext-core");
    expect(docText).toContain("handoff-core-structure-pattern-slot-boundary-acceptance-2026-09-05-01");
    expect(docText).toContain("Automatic return status: `automatic-returned`");
    expect(docText).toContain("Terminal status: `PASS`");
    expect(docText).toContain(WORK_COMMIT);
    expect(docText).toContain(CORE_MAIN_COMMIT);
    expect(docText).toContain("src/lifecycle/structurePatternSlots.ts");
    expect(docText).toContain("Published-structure slots must pin a Structure Pattern version");
    expect(docText).toContain("full Core main gate passed with 432 files and 2791 tests");
    expect(docText).toContain("2 high-severity audit findings");
    expect(docText).toContain("stash@{0}");
    expect(docText).toContain("No FlowDoc product truth or map truth promoted");
    expect(docText).not.toMatch(/\bBackend persistence: current\b/iu);
    expect(docText).not.toMatch(/\bEditor Preview behavior: current\b/iu);
    expect(docText).not.toMatch(/\bmap truth: current\b/iu);
  });
});
