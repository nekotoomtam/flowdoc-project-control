import type { ProjectReadModel } from "../../../src/model/types.js";

export function makeProjectReadModel(
  overrides: Partial<ProjectReadModel> = {},
): ProjectReadModel {
  return {
    schemaVersion: 1,
    sourceDigest: "test-digest",
    rootNodeIds: ["flowdoc"],
    nodes: [
      {
        kind: "node",
        id: "flowdoc",
        title: "Flowdoc",
        parentId: null,
        summary: "Test project root.",
        truthState: "planned",
        order: 0,
        documentIds: [],
        evidenceIds: [],
        repositoryIds: [],
        childIds: [],
        workIds: [],
      },
    ],
    work: [],
    documents: [],
    repositories: [],
    evidence: [],
    ...overrides,
  };
}
