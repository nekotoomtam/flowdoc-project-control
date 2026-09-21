import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { generateProjectSqlite } from "../tools/lib/build-sqlite-projection.js";
import { generateToString } from "../tools/generate.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";
import { createProjectFixture } from "./fixtures/project-source.js";

describe("coordination registry projections", () => {
  it("survives the generated read model and SQLite Work projection", async () => {
    const root = process.cwd();
    const model = JSON.parse(await generateToString(root)) as {
      work: Array<{ id: string; coordination?: { revision: number } }>;
    };
    const canonical = model.work.find(({ id }) => id === "agent-and-skill-design")?.coordination;
    expect(canonical).toBeDefined();

    const outputPath = join(await mkdtemp(join(tmpdir(), "flowdoc-coordination-sqlite-")), "project-control.sqlite");
    await generateProjectSqlite(root, outputPath);
    const db = new DatabaseSync(outputPath, { readOnly: true });
    try {
      const row = db.prepare("select coordination_json, coordination_version, coordination_authority from work where id = ?").get("agent-and-skill-design") as {
        coordination_json: string;
        coordination_version: number;
        coordination_authority: string;
      };
      expect(JSON.parse(row.coordination_json)).toEqual(canonical);
      expect(row).toMatchObject({
        coordination_version: 1,
        coordination_authority: "legacy-read-only",
      });
    } finally {
      db.close();
    }
  });

  it.each([
    ["active", "current-round"],
    ["released", "historical-read-only"],
    ["cancelled", "historical-read-only"],
  ] as const)("projects version 2 %s authority as %s", async (state, authority) => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const workPath = join(root, "data", "work", "pilot-task.json");
    const work = JSON.parse(await readFile(workPath, "utf8")) as Record<string, unknown>;
    const registry = createCoordinationRegistryV2Fixture();
    registry.round.workId = "pilot-task";
    registry.round.state = state;
    registry.integrationClaims[0]!.state = state === "active" ? "active" : "released";
    if (state !== "active") registry.roomRuns[0]!.status = "closed";
    work.executionMode = "standard";
    work.coordination = registry;
    await writeFile(workPath, JSON.stringify(work));

    const outputPath = join(await mkdtemp(join(tmpdir(), "flowdoc-coordination-v2-sqlite-")), "project-control.sqlite");
    await generateProjectSqlite(root, outputPath);
    const db = new DatabaseSync(outputPath, { readOnly: true });
    try {
      const row = db.prepare(
        "select execution_mode, coordination_version, coordination_authority from work where id = ?",
      ).get("pilot-task");
      expect(row).toMatchObject({
        execution_mode: "standard",
        coordination_version: 2,
        coordination_authority: authority,
      });
    } finally {
      db.close();
    }
  });
});
