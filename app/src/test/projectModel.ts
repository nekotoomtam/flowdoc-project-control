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
    phases: [],
    checklists: [],
    documents: [],
    repositories: [],
    evidence: [],
    currentSnapshot: {
      generatedAt: "2026-09-24T00:00:00.000Z",
      currentGoal: null,
      currentBlocker: null,
      activeWork: [],
      acceptedTruth: [],
      criticalUnknowns: [],
      deferredWork: [],
      nextDecision: null,
      repositoryIds: [],
      authorityDocumentIds: [],
    },
    governanceCost: {
      approximateContextTokens: 0,
      contextDocumentCount: 0,
      evidenceCreated: 0,
      durableDocumentsCreated: 0,
      implementationCommitCount: 0,
      reviewCycleCount: 0,
      reopenCount: 0,
    },
    ...overrides,
  };
}
