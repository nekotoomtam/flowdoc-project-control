import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { generateProjectSqlite } from "../tools/lib/build-sqlite-projection.js";
import { generateToString } from "../tools/generate.js";

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
      const row = db.prepare("select coordination_json from work where id = ?").get("agent-and-skill-design") as {
        coordination_json: string;
      };
      expect(JSON.parse(row.coordination_json)).toEqual(canonical);
    } finally {
      db.close();
    }
  });
});
