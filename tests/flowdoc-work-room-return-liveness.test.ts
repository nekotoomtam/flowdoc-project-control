import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc WORK return liveness", () => {
  it("is governed by the current workflow policy with coordination as supporting detail", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const policy = normalize(documents.get("doc-flowdoc-workflow-economy-policy")?.content);
    const controls = normalize(documents.get("doc-flowdoc-coordination-controls")?.content);
    expect(policy).toContain("liveness");
    expect(policy).toContain("must not be accepted");
    expect(documents.get("doc-flowdoc-workflow-economy-policy")).toMatchObject({
      lifecycle: "active",
      contextClass: "current",
    });
    expect(documents.get("doc-flowdoc-coordination-controls")).toMatchObject({
      lifecycle: "active",
      contextClass: "supporting",
    });
    expect(controls).toContain("supporting contract");
  });
});
