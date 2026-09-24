import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { loadProjectState } from "./loadProjectState.js";

async function generatedModel(): Promise<any> {
  return JSON.parse(await readFile("generated/project-index.json", "utf8"));
}

function fetchModel(model: unknown): typeof fetch {
  return (async (input: string | URL | Request) => {
    const path = String(input);
    if (path.endsWith("project-diagnostics.json")) return new Response("", { status: 404 });
    return Response.json(model);
  }) as typeof fetch;
}

describe("loadProjectState workflow metadata", () => {
  it("rejects an invalid document context class", async () => {
    const model = await generatedModel();
    model.documents[0].contextClass = "archive-ish";
    expect(await loadProjectState(fetchModel(model))).toMatchObject({ kind: "diagnostic" });
  });

  it("rejects incomplete Evidence validity metadata", async () => {
    const model = await generatedModel();
    model.evidence[0].validity = { claim: "Incomplete" };
    expect(await loadProjectState(fetchModel(model))).toMatchObject({ kind: "diagnostic" });
  });
});
