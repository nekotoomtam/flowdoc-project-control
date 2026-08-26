import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("project-control schema", () => {
  it("defines all seven records and keeps execution state out of Nodes", async () => {
    const schema = JSON.parse(
      await readFile("schemas/project-control.schema.json", "utf8"),
    );

    expect(Object.keys(schema.$defs).sort()).toEqual([
      "checklist",
      "document",
      "evidence",
      "node",
      "phase",
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
    expect(schema.$defs.phase.properties.phaseState.enum).toEqual([
      "queued",
      "in-progress",
      "blocked",
      "in-review",
      "done",
    ]);
    expect(schema.$defs.checklist.properties.items.items.properties.state.enum).toEqual([
      "pending",
      "in-progress",
      "passed",
      "failed",
      "blocked",
      "risk",
      "unknown",
    ]);
    expect(schema.$defs.node.properties).not.toHaveProperty("workState");
    expect(schema.$defs.work.properties).not.toHaveProperty("truthState");
    expect(schema.$defs.node.properties).not.toHaveProperty("phaseState");
    expect(schema.$defs.node.properties).not.toHaveProperty("items");
  });
});
