import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { checkSqliteProjection, generateProjectSqlite } from "../tools/lib/build-sqlite-projection.js";
import { generateToString } from "../tools/generate.js";
import { createProjectFixture } from "./fixtures/project-source.js";

describe("SQLite projection", () => {
  it("projects Work, Phase, Checklist, and source digest into SQLite", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const outputPath = join(await mkdtemp(join(tmpdir(), "flowdoc-sqlite-")), "project-control.sqlite");
    const model = JSON.parse(await generateToString(root)) as { sourceDigest: string };

    await generateProjectSqlite(root, outputPath);

    const db = new DatabaseSync(outputPath, { readOnly: true });
    try {
      expect(db.prepare("select id, parent_work_id from work order by id").all()).toEqual([
        { id: "pilot", parent_work_id: null },
        { id: "pilot-task", parent_work_id: "pilot" },
      ]);
      expect(db.prepare("select id, work_id from phases").all()).toEqual([
        { id: "phase-contract", work_id: "pilot-task" },
      ]);
      expect(db.prepare("select id, checklist_id, evidence_target from checklist_items").all()).toEqual([
        {
          id: "define-contract",
          checklist_id: "checklist-contract",
          evidence_target: "A checklist item records the target before Evidence exists.",
        },
      ]);
      expect(db.prepare("select schema_version, source_digest from projection_meta").get()).toEqual({
        schema_version: 1,
        source_digest: model.sourceDigest,
      });
    } finally {
      db.close();
    }
  });

  it("includes compact join tables for query consumers", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const outputPath = join(await mkdtemp(join(tmpdir(), "flowdoc-sqlite-")), "project-control.sqlite");

    await generateProjectSqlite(root, outputPath);

    const db = new DatabaseSync(outputPath, { readOnly: true });
    try {
      expect(
        db
          .prepare("select name from sqlite_master where type = 'table' and name not like 'sqlite_%' order by name")
          .all(),
      ).toEqual([
        { name: "checklist_item_evidence" },
        { name: "checklist_items" },
        { name: "checklists" },
        { name: "diagnostics" },
        { name: "documents" },
        { name: "evidence" },
        { name: "nodes" },
        { name: "phase_repositories" },
        { name: "phases" },
        { name: "projection_meta" },
        { name: "repositories" },
        { name: "work" },
        { name: "work_closure" },
        { name: "work_context_documents" },
        { name: "work_repositories" },
        { name: "work_required_evidence" },
      ]);
      expect(db.prepare("select id, title, truth_state from nodes").all()).toEqual([
        { id: "flowdoc", title: "FlowDoc", truth_state: "planned" },
      ]);
      expect(db.prepare("select id, path from documents").all()).toEqual([
        { id: "doc-overview", path: "docs/overview.md" },
      ]);
      expect(db.prepare("select id, name from repositories").all()).toEqual([
        { id: "project-control", name: "Project Control" },
      ]);
      expect(db.prepare("select id, repository_id from evidence").all()).toEqual([
        { id: "evidence-design", repository_id: "project-control" },
      ]);
      expect(
        db
          .prepare("select ancestor_work_id, descendant_work_id, depth from work_closure order by ancestor_work_id, descendant_work_id")
          .all(),
      ).toEqual([
        { ancestor_work_id: "pilot", descendant_work_id: "pilot", depth: 0 },
        { ancestor_work_id: "pilot", descendant_work_id: "pilot-task", depth: 1 },
        { ancestor_work_id: "pilot-task", descendant_work_id: "pilot-task", depth: 0 },
      ]);
    } finally {
      db.close();
    }
  });

  it("builds a disposable projection during data checks", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });

    await expect(checkSqliteProjection(root)).resolves.toBeUndefined();
  });

  it("keeps generated sqlite ignored instead of committed", async () => {
    const gitignore = await readFile(".gitignore", "utf8");

    expect(gitignore.split(/\r?\n/u)).toContain("generated/*.sqlite");
  });
});
