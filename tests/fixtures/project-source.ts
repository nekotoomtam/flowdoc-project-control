import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface ProjectFixtureOptions {
  valid: true;
  malformedNodeJson?: boolean;
  unknownNodeProperty?: boolean;
  nodeFileContainsWork?: boolean;
  invalidTruthState?: boolean;
  repositoryLocalPath?: string;
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
    parentId: null,
    summary: "Project root.",
    truthState: options.invalidTruthState ? "unsupported" : "planned",
    order: 0,
    documentIds: ["doc-overview"],
    evidenceIds: ["evidence-design"],
    repositoryIds: ["project-control"],
  };

  if (options.unknownNodeProperty) {
    node.unexpected = true;
  }

  const work = {
    kind: "work",
    id: "pilot",
    title: "Pilot",
    nodeId: "flowdoc",
    repositoryIds: ["project-control"],
    workState: "queued",
    summary: "Pilot work.",
    requiredEvidence: [],
    createdAt: "2026-08-12T00:00:00.000Z",
    updatedAt: "2026-08-12T00:00:00.000Z",
  };

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

  await Promise.all([
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
      JSON.stringify({
        kind: "document",
        id: "doc-overview",
        title: "Overview",
        path: "docs/overview.md",
        nodeIds: ["flowdoc"],
        role: "current-state",
        authority: "Project Control",
        lifecycle: "active",
        repositoryRefs: [],
      }),
    ),
    writeFile(
      join(root, "data", "repositories", "project-control.json"),
      JSON.stringify(repository),
    ),
    writeFile(
      join(root, "data", "evidence", "evidence-design.json"),
      JSON.stringify({
        kind: "evidence",
        id: "evidence-design",
        nodeIds: ["flowdoc"],
        repositoryId: "project-control",
        commit: "0123456789abcdef0123456789abcdef01234567",
        pathOrContractId: "docs/overview.md",
        verificationSummary: "Design reviewed.",
        verifiedAt: "2026-08-12T00:00:00.000Z",
      }),
    ),
  ]);

  return root;
}
