import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("project-control schema", () => {
  it("defines all five records and keeps truth/work states separate", async () => {
    const schema = JSON.parse(
      await readFile("schemas/project-control.schema.json", "utf8"),
    );

    expect(Object.keys(schema.$defs).sort()).toEqual([
      "document",
      "evidence",
      "node",
      "repository",
      "work",
    ]);
    expect(schema.$defs.node.properties.truthState.enum).toEqual([
      "current",
      "planned",
      "risk",
      "unknown",
    ]);
    expect(schema.$defs.work.properties.workState.enum).toEqual([
      "queued",
      "in-progress",
      "blocked",
      "in-review",
    ]);
    expect(schema.$defs.node.properties).not.toHaveProperty("workState");
    expect(schema.$defs.work.properties).not.toHaveProperty("truthState");
  });
});
