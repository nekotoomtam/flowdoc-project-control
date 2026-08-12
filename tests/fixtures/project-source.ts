import { mkdtemp, mkdir, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DocumentLifecycle, TruthState, WorkState } from "../../src/model/types.js";

export interface ProjectFixtureOptions {
  valid: true;
  malformedNodeJson?: boolean;
  unknownNodeProperty?: boolean;
  nodeFileContainsWork?: boolean;
  invalidTruthState?: boolean;
  repositoryLocalPath?: string;
  duplicateId?: boolean;
  missingParent?: boolean;
  nodeCycle?: boolean;
  missingDocumentRef?: boolean;
  missingRepositoryRef?: boolean;
  missingEvidenceRef?: boolean;
  documentOwnershipMismatch?: boolean;
  evidenceOwnershipMismatch?: boolean;
  currentWithoutEvidence?: boolean;
  escapingDocumentPath?: boolean;
  missingDocumentFile?: boolean;
  nonMarkdownDocument?: boolean;
  documentPathDirectory?: boolean;
  truthState?: TruthState;
  workState?: WorkState;
  documentLifecycle?: DocumentLifecycle;
}

export async function createProjectFixture(
  options: ProjectFixtureOptions,
): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "flowdoc-project-source-"));

  await Promise.all(
    ["documents", "evidence", "nodes", "repositories", "work"].map((directory) =>
      mkdir(join(root, "data", directory), { recursive: true }),
    ),
  );

  const node: Record<string, unknown> = {
    kind: "node",
    id: "flowdoc",
    title: "FlowDoc",
    parentId: options.missingParent ? "missing-node" : options.nodeCycle ? "child-node" : null,
    summary: "Project root.",
    truthState: options.invalidTruthState
      ? "unsupported"
      : (options.truthState ?? (options.currentWithoutEvidence ? "current" : "planned")),
    order: 0,
    documentIds: [options.missingDocumentRef ? "missing-document" : "doc-overview"],
    evidenceIds: options.currentWithoutEvidence
      ? []
      : [options.missingEvidenceRef ? "missing-evidence" : "evidence-design"],
    repositoryIds: [options.missingRepositoryRef ? "missing-repository" : "project-control"],
  };

  if (options.unknownNodeProperty) {
    node.unexpected = true;
  }

  const work: Record<string, unknown> = {
    kind: "work",
    id: "pilot",
    title: "Pilot",
    nodeId: "flowdoc",
    repositoryIds: ["project-control"],
    workState: options.workState ?? "queued",
    summary: "Pilot work.",
    requiredEvidence: [],
    createdAt: "2026-08-12T00:00:00.000Z",
    updatedAt: "2026-08-12T00:00:00.000Z",
  };

  if (options.workState === "blocked") {
    work.blockedBy = "Awaiting a dependency.";
    work.unblockOwner = "Project Control";
  }

  const repository: Record<string, unknown> = {
    kind: "repository",
    id: "project-control",
    name: "Project Control",
    remote: "https://github.com/example/project-control.git",
    checkoutAlias: "project-control",
    defaultBranch: "main",
    ownershipSummary: "Project Control source.",
  };

  if (options.repositoryLocalPath !== undefined) {
    repository.localPath = options.repositoryLocalPath;
  }

  const documentPath = options.nonMarkdownDocument
    ? "docs/overview.txt"
    : (options.escapingDocumentPath ? "docs/escape.md" : "docs/overview.md");
  const document = {
    kind: "document",
    id: "doc-overview",
    title: "Overview",
    path: documentPath,
    nodeIds: options.documentOwnershipMismatch ? [] : ["flowdoc"],
    role: "current-state",
    authority: "Project Control",
    lifecycle: options.documentLifecycle ?? "active",
    repositoryRefs: [],
  };
  const evidence = {
    kind: "evidence",
    id: options.duplicateId ? "flowdoc" : "evidence-design",
    nodeIds: options.evidenceOwnershipMismatch || options.currentWithoutEvidence ? [] : ["flowdoc"],
    repositoryId: "project-control",
    commit: "0123456789abcdef0123456789abcdef01234567",
    pathOrContractId: "docs/overview.md",
    verificationSummary: "Design reviewed.",
    verifiedAt: "2026-08-12T00:00:00.000Z",
  };

  await mkdir(join(root, "docs"), { recursive: true });
  if (!options.missingDocumentFile && !options.escapingDocumentPath) {
    if (options.documentPathDirectory) {
      await mkdir(join(root, documentPath), { recursive: true });
    } else {
      await writeFile(join(root, documentPath), "# Overview\n");
    }
  }
  if (options.escapingDocumentPath) {
    const externalPath = join(tmpdir(), `flowdoc-project-source-escape-${Date.now()}`);
    await mkdir(externalPath, { recursive: true });
    await symlink(externalPath, join(root, "docs", "escape.md"), "junction");
  }

  const records = [
    writeFile(
      join(root, "data", "nodes", "flowdoc.json"),
      options.malformedNodeJson
        ? '{"kind":"node"'
        : JSON.stringify(options.nodeFileContainsWork ? work : node),
    ),
    writeFile(
      join(root, "data", "work", "pilot.json"),
      JSON.stringify(work),
    ),
    writeFile(
      join(root, "data", "documents", "doc-overview.json"),
      JSON.stringify(document),
    ),
    writeFile(
      join(root, "data", "repositories", "project-control.json"),
      JSON.stringify(repository),
    ),
    writeFile(
      join(root, "data", "evidence", "evidence-design.json"),
      JSON.stringify(evidence),
    ),
  ];

  if (options.nodeCycle) {
    records.push(
      writeFile(
        join(root, "data", "nodes", "child-node.json"),
        JSON.stringify({
          ...node,
          id: "child-node",
          parentId: "flowdoc",
          documentIds: [],
          evidenceIds: [],
        }),
      ),
    );
  }

  await Promise.all(records);

  return root;
}
