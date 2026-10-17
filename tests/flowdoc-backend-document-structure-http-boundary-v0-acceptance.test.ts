import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const DOC_ID = "doc-flowdoc-backend-document-structure-http-boundary-v0-acceptance-2026-09-04";
const DOC_PATH = "docs/domains/flowdoc-backend-document-structure-http-boundary-v0-acceptance-2026-09-04.md";
const EVIDENCE_ID = "evidence-flowdoc-backend-document-structure-http-boundary-v0-accepted-2026-09-04";
const BACKEND_COMMIT = "eddf727fabef035862c91d3af9eb04b884c8ac6d";
const INITIAL_REVIEWED_COMMIT = "89fd5b68e009b1064be5234d959b65b0ffd902cc";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc Backend document-structure HTTP boundary v0 acceptance", () => {
  it("records the automatic WORK return, review repair, Backend verification, and unpromoted boundaries", async () => {
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
    expect(document?.authority).toContain("code-review repair");
    expect(document?.repositoryRefs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
        pathOrContractId: expect.stringContaining("tests/flowdoc-backend-document-structure-http-boundary-v0-acceptance.test.ts"),
        repositoryId: "repo-project-control",
      }),
      expect.objectContaining({
        commit: BACKEND_COMMIT,
        pathOrContractId: expect.stringContaining("src/routes/documentStructureRoute.ts"),
        repositoryId: "repo-backend",
      }),
    ]));

    expect(entry).toMatchObject({
      commit: expect.stringMatching(/^[a-f0-9]{40}$/u),
      nodeIds: [],
      pathOrContractId: expect.stringContaining("dispatch-backend-document-structure-http-boundary-v0-2026-09-04-01"),
      repositoryId: "repo-project-control",
    });
    expect(entry?.verificationSummary).toContain("automatic Return Channel");
    expect(entry?.verificationSummary).toContain(BACKEND_COMMIT);
    expect(entry?.verificationSummary).toContain(INITIAL_REVIEWED_COMMIT);
    expect(entry?.verificationSummary).toContain("non-atomic stale gates");
    expect(entry?.verificationSummary).toContain("malformed JSON envelope gaps");
    expect(entry?.verificationSummary).toContain("351 tests passed");
    expect(entry?.verificationSummary).toContain("does not promote FlowDoc product truth or map truth");

    expect(docText).toContain("dispatch-backend-document-structure-http-boundary-v0-2026-09-04-01");
    expect(docText).toContain("01a0637c-bc37-7cb1-8655-362695c4c6f7");
    expect(docText).toContain("`parallelLimit`: `1`");
    expect(docText).toContain("client-new-thread:39c8dcec-6561-4b92-b009-5806803c2d73");
    expect(docText).toContain("01a06d2c-b5d5-77b1-b189-f66a152b4153");
    expect(docText).toContain("C:\\Users\\nekot\\.codex\\worktrees\\cf3a\\flowdoc-vnext-backend");
    expect(docText).toContain("handoff-backend-document-structure-http-boundary-v0-2026-09-04-01");
    expect(docText).toContain("Automatic return status: `automatic-returned`");
    expect(docText).toContain("Terminal status: `PASS`");
    expect(docText).toContain(BACKEND_COMMIT);
    expect(docText).toContain("src/routes/documentStructureRoute.ts");
    expect(docText).toContain("repository-level conditional write methods");
    expect(docText).toContain("Malformed document-structure JSON returns the document-structure status/error envelope");
    expect(docText).toContain("94 files passed / 1 skipped");
    expect(docText).toContain("351 tests passed / 27 skipped");
    expect(docText).toContain("2 high severity audit findings");
    expect(docText).toContain("No generated PDF file");
    expect(docText).toContain("No FlowDoc product truth or map truth promoted");
    expect(docText).not.toMatch(/\bAPI-key readiness: current\b/iu);
    expect(docText).not.toMatch(/\bmap truth: current\b/iu);
    expect(docText).not.toMatch(/\bPDF readiness: current\b/iu);
  });
});
