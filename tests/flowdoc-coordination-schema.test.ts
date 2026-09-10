import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("coordination registry schema", () => {
  it("keeps coordination optional for historical Work while defining the typed registry", async () => {
    const schema = JSON.parse(await readFile("schemas/project-control.schema.json", "utf8")) as {
      $defs: { work: { required: string[]; properties: Record<string, unknown>; $defs?: Record<string, unknown> } };
    };

    expect(schema.$defs.work.required).not.toContain("coordination");
    expect(schema.$defs.work.properties).toHaveProperty("coordination");
    expect(schema.$defs.work.$defs).toMatchObject({ coordination: expect.any(Object) });
    expect(schema.$defs.work.$defs?.modelDecision).toMatchObject({
      properties: { availableModelEfforts: expect.any(Object) },
    });
  });
});
