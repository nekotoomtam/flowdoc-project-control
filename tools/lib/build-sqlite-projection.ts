import { mkdir, mkdtemp, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { ProjectReadModel } from "../../src/model/types.js";
import { buildProjectReadModel } from "./build-read-model.js";
import { loadAndValidateProject } from "./validate-semantics.js";

export async function generateProjectSqlite(
  rootDir: string,
  outputPath = join(rootDir, "generated", "project-control.sqlite"),
): Promise<void> {
  const model = await buildProjectReadModel(await loadAndValidateProject(rootDir));
  await mkdir(dirname(outputPath), { recursive: true });
  const tempDir = await mkdtemp(join(tmpdir(), "flowdoc-project-control-sqlite-"));
  const tempPath = join(tempDir, "project-control.sqlite");

  try {
    writeProjection(tempPath, model);
    await rename(tempPath, outputPath);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

export async function checkSqliteProjection(rootDir: string): Promise<void> {
  const tempDir = await mkdtemp(join(tmpdir(), "flowdoc-project-control-sqlite-check-"));

  try {
    await generateProjectSqlite(rootDir, join(tempDir, "project-control.sqlite"));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function writeProjection(outputPath: string, model: ProjectReadModel): void {
  const db = new DatabaseSync(outputPath);
  try {
    db.exec(`
      pragma foreign_keys = on;
      create table projection_meta(schema_version integer not null, source_digest text not null, generated_at text not null);
      create table nodes(id text primary key, parent_id text, truth_state text not null, node_order real not null, title text not null, summary text not null);
      create table work(id text primary key, parent_work_id text, node_id text not null, work_kind text, work_state text not null, title text not null, summary text not null);
      create table work_closure(ancestor_work_id text not null, descendant_work_id text not null, depth integer not null, primary key(ancestor_work_id, descendant_work_id));
      create table phases(id text primary key, work_id text not null, phase_state text not null, phase_order real not null, title text not null, verification_target text not null, summary text not null);
      create table checklists(id text primary key, phase_id text not null, title text not null);
      create table checklist_items(checklist_id text not null, id text not null, item_order integer not null, label text not null, state text not null, evidence_target text not null, verification_note text, primary key(checklist_id, id));
      create table documents(id text primary key, path text not null, role text not null, lifecycle text not null, title text not null, authority text not null);
      create table repositories(id text primary key, name text not null, remote text not null, checkout_alias text not null, default_branch text not null, ownership_summary text not null);
      create table evidence(id text primary key, repository_id text not null, commit_sha text not null, path_or_contract_id text not null, verification_summary text not null, verified_at text not null);
      create table work_context_documents(work_id text not null, document_id text not null, primary key(work_id, document_id));
      create table work_repositories(work_id text not null, repository_id text not null, primary key(work_id, repository_id));
      create table phase_repositories(phase_id text not null, repository_id text not null, primary key(phase_id, repository_id));
      create table work_required_evidence(work_id text not null, evidence_id text not null, primary key(work_id, evidence_id));
      create table checklist_item_evidence(checklist_id text not null, item_id text not null, evidence_id text not null, primary key(checklist_id, item_id, evidence_id));
      create table diagnostics(code text not null, message text not null, file text not null, record_id text, hint text not null);
    `);

    db.exec("begin immediate");
    try {
      insertMeta(db, model);
      insertNodes(db, model);
      insertWork(db, model);
      insertWorkClosure(db, model);
      insertPhases(db, model);
      insertChecklists(db, model);
      insertDocuments(db, model);
      insertRepositories(db, model);
      insertEvidence(db, model);
      db.exec("commit");
    } catch (error) {
      db.exec("rollback");
      throw error;
    }
  } finally {
    db.close();
  }
}

function insertMeta(db: DatabaseSync, model: ProjectReadModel): void {
  const insert = db.prepare(
    "insert into projection_meta(schema_version, source_digest, generated_at) values (?, ?, ?)",
  );
  insert.run(model.schemaVersion, model.sourceDigest, new Date().toISOString());
}

function insertNodes(db: DatabaseSync, model: ProjectReadModel): void {
  const insert = db.prepare(
    "insert into nodes(id, parent_id, truth_state, node_order, title, summary) values (?, ?, ?, ?, ?, ?)",
  );
  for (const node of model.nodes) {
    insert.run(node.id, node.parentId, node.truthState, node.order, node.title, node.summary);
  }
}

function insertWork(db: DatabaseSync, model: ProjectReadModel): void {
  const insertWork = db.prepare(
    "insert into work(id, parent_work_id, node_id, work_kind, work_state, title, summary) values (?, ?, ?, ?, ?, ?, ?)",
  );
  const insertContextDocument = db.prepare(
    "insert into work_context_documents(work_id, document_id) values (?, ?)",
  );
  const insertRepository = db.prepare(
    "insert into work_repositories(work_id, repository_id) values (?, ?)",
  );
  const insertEvidence = db.prepare(
    "insert into work_required_evidence(work_id, evidence_id) values (?, ?)",
  );

  for (const work of model.work) {
    insertWork.run(
      work.id,
      work.parentWorkId ?? null,
      work.nodeId,
      work.workKind ?? null,
      work.workState,
      work.title,
      work.summary,
    );
    for (const documentId of work.contextDocumentIds ?? []) {
      insertContextDocument.run(work.id, documentId);
    }
    for (const repositoryId of work.repositoryIds) {
      insertRepository.run(work.id, repositoryId);
    }
    for (const evidenceId of work.requiredEvidence) {
      insertEvidence.run(work.id, evidenceId);
    }
  }
}

function insertWorkClosure(db: DatabaseSync, model: ProjectReadModel): void {
  const insert = db.prepare(
    "insert into work_closure(ancestor_work_id, descendant_work_id, depth) values (?, ?, ?)",
  );
  for (const work of model.work) {
    for (const [index, ancestorId] of work.workPathIds.entries()) {
      insert.run(ancestorId, work.id, work.workPathIds.length - index - 1);
    }
  }
}

function insertPhases(db: DatabaseSync, model: ProjectReadModel): void {
  const insertPhase = db.prepare(
    "insert into phases(id, work_id, phase_state, phase_order, title, verification_target, summary) values (?, ?, ?, ?, ?, ?, ?)",
  );
  const insertRepository = db.prepare(
    "insert into phase_repositories(phase_id, repository_id) values (?, ?)",
  );

  for (const phase of model.phases) {
    insertPhase.run(
      phase.id,
      phase.workId,
      phase.phaseState,
      phase.order,
      phase.title,
      phase.verificationTarget,
      phase.summary,
    );
    for (const repositoryId of phase.repositoryIds) {
      insertRepository.run(phase.id, repositoryId);
    }
  }
}

function insertChecklists(db: DatabaseSync, model: ProjectReadModel): void {
  const insertChecklist = db.prepare(
    "insert into checklists(id, phase_id, title) values (?, ?, ?)",
  );
  const insertItem = db.prepare(
    "insert into checklist_items(checklist_id, id, item_order, label, state, evidence_target, verification_note) values (?, ?, ?, ?, ?, ?, ?)",
  );
  const insertEvidence = db.prepare(
    "insert into checklist_item_evidence(checklist_id, item_id, evidence_id) values (?, ?, ?)",
  );

  for (const checklist of model.checklists) {
    insertChecklist.run(checklist.id, checklist.phaseId, checklist.title);
    checklist.items.forEach((item, index) => {
      insertItem.run(
        checklist.id,
        item.id,
        index,
        item.label,
        item.state,
        item.evidenceTarget,
        item.verificationNote ?? null,
      );
      for (const evidenceId of item.evidenceIds ?? []) {
        insertEvidence.run(checklist.id, item.id, evidenceId);
      }
    });
  }
}

function insertDocuments(db: DatabaseSync, model: ProjectReadModel): void {
  const insert = db.prepare(
    "insert into documents(id, path, role, lifecycle, title, authority) values (?, ?, ?, ?, ?, ?)",
  );
  for (const document of model.documents) {
    insert.run(
      document.id,
      document.path,
      document.role,
      document.lifecycle,
      document.title,
      document.authority,
    );
  }
}

function insertRepositories(db: DatabaseSync, model: ProjectReadModel): void {
  const insert = db.prepare(
    "insert into repositories(id, name, remote, checkout_alias, default_branch, ownership_summary) values (?, ?, ?, ?, ?, ?)",
  );
  for (const repository of model.repositories) {
    insert.run(
      repository.id,
      repository.name,
      repository.remote,
      repository.checkoutAlias,
      repository.defaultBranch,
      repository.ownershipSummary,
    );
  }
}

function insertEvidence(db: DatabaseSync, model: ProjectReadModel): void {
  const insert = db.prepare(
    "insert into evidence(id, repository_id, commit_sha, path_or_contract_id, verification_summary, verified_at) values (?, ?, ?, ?, ?, ?)",
  );
  for (const evidence of model.evidence) {
    insert.run(
      evidence.id,
      evidence.repositoryId,
      evidence.commit,
      evidence.pathOrContractId,
      evidence.verificationSummary,
      evidence.verifiedAt,
    );
  }
}
