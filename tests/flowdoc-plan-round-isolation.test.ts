import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc PLAN round isolation", () => {
  it("routes current entrypoints to the version 3 isolation policy", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const current = normalize(documents.get("doc-flowdoc-workflow-economy-policy")?.content);
    expect(documents.get("doc-flowdoc-workflow-economy-policy")).toMatchObject({
      lifecycle: "active",
      contextClass: "current",
    });
    expect(current).toContain("one current PLAN owns one execution round");
    expect(current).toContain("new PLAN creates a fresh round");
    expect(current).toContain("Registry versions 1 and 2 are historical and read-only");
    expect(current).toContain("Cross-PLAN ownership transfer is not supported");
    expect(current).toContain("Historical Recovery Work");
    expect(current).toContain("immutable input");

    for (const id of [
      "doc-project-control-agent-onboarding",
      "doc-flowdoc-global-codex-guidance",
      "doc-agent-skill-operating-model",
      "doc-flowdoc-round-workflow",
    ]) {
      expect(normalize(documents.get(id)?.content), id)
        .toContain("flowdoc-workflow-economy-policy.md");
    }
  });
});
