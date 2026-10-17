import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

describe("doc-flowdoc-work-type-routing-model historical contract", () => {
  it("remains readable but resolves to the current workflow economy authority", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const document = model.documents.find((item) => item.id === "doc-flowdoc-work-type-routing-model");
    expect(document).toMatchObject({
      lifecycle: "superseded",
      contextClass: "historical",
      supersededBy: "doc-flowdoc-workflow-economy-policy",
      path: "docs/domains/flowdoc-work-type-routing-model.md",
    });
    expect((await readFile("docs/domains/flowdoc-work-type-routing-model.md", "utf8")).trim().length).toBeGreaterThan(100);
    expect(model.documents.find((item) => item.id === "doc-flowdoc-workflow-economy-policy"))
      .toMatchObject({
        lifecycle: "active",
        contextClass: "current",
        supersedes: expect.arrayContaining(["doc-flowdoc-work-type-routing-model"]),
      });
  });
});
