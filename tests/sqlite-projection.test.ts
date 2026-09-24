import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { checkSqliteProjection, generateProjectSqlite } from "../tools/lib/build-sqlite-projection.js";
import { generateToString } from "../tools/generate.js";
import { createProjectFixture } from "./fixtures/project-source.js";

describe("SQLite projection", () => {
  async function addSupersessionAndValidity(root: string): Promise<void> {
    const documentPath = join(root, "data", "documents", "doc-overview.json");
    const evidencePath = join(root, "data", "evidence", "evidence-design.json");
    const current = JSON.parse(await readFile(documentPath, "utf8"));
    const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
    current.contextClass = "current";
    current.supersedes = ["doc-old"];
    const old = {
      ...current,
      id: "doc-old",
      title: "Old",
      path: "docs/old.md",
      nodeIds: [],
      contextClass: "historical",
      lifecycle: "superseded",
      supersedes: [],
      supersededBy: "doc-overview",
    };
    evidence.validity = {
      claim: "Design is reviewed.",
      repositoryId: "project-control",
      pathScope: ["docs/overview.md"],
      sourceRevision: evidence.commit,
      verificationMethod: "review",
      freshnessTriggers: ["document changes"],
    };
    await writeFile(documentPath, JSON.stringify(current));
    await writeFile(join(root, "data", "documents", "doc-old.json"), JSON.stringify(old));
    await writeFile(join(root, "docs", "old.md"), "# Old\n");
    await writeFile(evidencePath, JSON.stringify(evidence));
  }

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
    await addSupersessionAndValidity(root);
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
        { name: "current_truth_snapshot" },
        { name: "diagnostics" },
        { name: "document_supersession" },
        { name: "documents" },
        { name: "evidence" },
        { name: "governance_cost_snapshot" },
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
      expect(db.prepare("select id, path from documents order by id").all()).toEqual([
        { id: "doc-old", path: "docs/old.md" },
        { id: "doc-overview", path: "docs/overview.md" },
      ]);
      expect(db.prepare("select successor_document_id, superseded_document_id from document_supersession").all())
        .toEqual([{ successor_document_id: "doc-overview", superseded_document_id: "doc-old" }]);
      expect(db.prepare("select id, context_class, superseded_by from documents order by id").all()).toEqual([
        { id: "doc-old", context_class: "historical", superseded_by: "doc-overview" },
        { id: "doc-overview", context_class: "current", superseded_by: null },
      ]);
      expect(db.prepare("select id, name from repositories").all()).toEqual([
        { id: "project-control", name: "Project Control" },
      ]);
      expect(db.prepare("select id, repository_id from evidence").all()).toEqual([
        { id: "evidence-design", repository_id: "project-control" },
      ]);
      expect(JSON.parse(String(db.prepare("select validity_json from evidence where id = ?").get("evidence-design")!.validity_json)))
        .toMatchObject({ claim: "Design is reviewed.", sourceRevision: "0123456789abcdef0123456789abcdef01234567" });
      expect(db.prepare("select current_goal, current_blocker, active_work_json from current_truth_snapshot").get())
        .toMatchObject({ current_goal: "A validated pilot task.", current_blocker: null });
      expect(db.prepare("select context_document_count, reopen_count from governance_cost_snapshot").get())
        .toEqual({ context_document_count: 1, reopen_count: 0 });
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
