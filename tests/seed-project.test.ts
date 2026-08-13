import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const execFileAsync = promisify(execFile);
const frozenCoreCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const approvedDesignCommit = "d79b88c23a307e7ec49437a015804d7a4d2de4bf";

describe("truthful seed project", () => {
  it("loads the truthful seed without claiming unverified product state", async () => {
    const validated = await loadAndValidateProject(process.cwd());
    const model = await buildProjectReadModel(validated);

    expect(model.rootNodeIds).toEqual(["flowdoc"]);
    expect(model.nodes.find((node) => node.id === "project-control")).toMatchObject({
      truthState: "current",
      evidenceIds: ["evidence-project-control-design"],
    });
    for (const id of ["core", "editor", "backend"]) {
      expect(model.nodes.find((node) => node.id === id)?.truthState).toBe("unknown");
    }

    const evidence = model.evidence.find((entry) => entry.id === "evidence-project-control-design");
    expect(evidence).toBeDefined();
    await expect(execFileAsync("git", [
      "cat-file",
      "-e",
      `${evidence!.commit}:${evidence!.pathOrContractId}`,
    ], { cwd: process.cwd() })).resolves.toBeDefined();
  });

  it("registers reviewed Core route truth without promoting the parent Core node", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const core = model.nodes.find((node) => node.id === "core");
    const coreRoute = model.nodes.find((node) => node.id === "core-route");
    const pilot = model.work.find((item) => item.id === "work-core-route-pilot");

    expect(coreRoute).toMatchObject({
      parentId: "core",
      truthState: "current",
      documentIds: ["doc-core-route-overview", "doc-core-route-retained-contracts"],
      evidenceIds: [
        "evidence-core-route-artifact-contracts",
        "evidence-core-route-generation-contracts",
        "evidence-core-route-public-boundary",
      ],
    });
    expect(core).toMatchObject({
      truthState: "unknown",
      documentIds: ["doc-core-v0-1-0a-1-document-map"],
    });
    expect(pilot).toMatchObject({
      workState: "in-review",
      requiredEvidence: [],
    });
    expect(pilot?.summary).toMatch(/Core cleanup Evidence is still pending/iu);
  });

  it("registers the version map and canonical family documents with frozen provenance", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const frozenCoreSourceAndTestRefs = [
      {
        repositoryId: "repo-core",
        commit: frozenCoreCommit,
        pathOrContractId: "src/generation/apiRoute.ts",
      },
      {
        repositoryId: "repo-core",
        commit: frozenCoreCommit,
        pathOrContractId: "src/generation/artifactApiRoute.ts",
      },
      {
        repositoryId: "repo-core",
        commit: frozenCoreCommit,
        pathOrContractId: "src/generation/artifactJob.ts",
      },
      {
        repositoryId: "repo-core",
        commit: frozenCoreCommit,
        pathOrContractId: "src/generation/artifactManifest.ts",
      },
      {
        repositoryId: "repo-core",
        commit: frozenCoreCommit,
        pathOrContractId: "src/generation/runtime.ts",
      },
      {
        repositoryId: "repo-core",
        commit: frozenCoreCommit,
        pathOrContractId: "src/index.ts",
      },
      {
        repositoryId: "repo-core",
        commit: frozenCoreCommit,
        pathOrContractId: "tests/artifactRetainedContract.test.ts",
      },
      {
        repositoryId: "repo-core",
        commit: frozenCoreCommit,
        pathOrContractId: "tests/coreRouteRetainedContractRewrite.test.ts",
      },
      {
        repositoryId: "repo-core",
        commit: frozenCoreCommit,
        pathOrContractId: "tests/generationRuntimeRetainedContract.test.ts",
      },
    ];

    expect(documents.get("doc-core-v0-1-0a-1-document-map")).toMatchObject({
      path: "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md",
      nodeIds: ["core"],
      role: "version",
      lifecycle: "active",
      repositoryRefs: [
        ...frozenCoreSourceAndTestRefs,
        {
          repositoryId: "repo-project-control",
          commit: approvedDesignCommit,
          pathOrContractId: "docs/superpowers/specs/2026-08-13-core-documentation-consolidation-design.md",
        },
      ],
    });
    expect(documents.get("doc-core-route-overview")).toMatchObject({
      path: "docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md",
      nodeIds: ["core-route"],
      role: "current-state",
      lifecycle: "active",
      repositoryRefs: frozenCoreSourceAndTestRefs,
    });
    expect(documents.get("doc-core-route-retained-contracts")).toMatchObject({
      path: "docs/versions/V0_1_0a_1/core/core-route/route-ownership-and-retained-contracts.md",
      nodeIds: ["core-route"],
      role: "contract",
      lifecycle: "active",
      repositoryRefs: frozenCoreSourceAndTestRefs,
    });
  });

  it("anchors Core route truth to three frozen executable Evidence records", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const evidence = new Map(model.evidence.map((item) => [item.id, item]));

    expect(evidence.get("evidence-core-route-generation-contracts")).toEqual({
      kind: "evidence",
      id: "evidence-core-route-generation-contracts",
      nodeIds: ["core-route"],
      repositoryId: "repo-core",
      commit: frozenCoreCommit,
      pathOrContractId: "tests/generationRuntimeRetainedContract.test.ts",
      verificationSummary: "Direct tests verify retained generation request parsing and readiness behavior without public route-helper ownership.",
      verifiedAt: "2026-08-13T00:00:00.000Z",
    });
    expect(evidence.get("evidence-core-route-artifact-contracts")).toEqual({
      kind: "evidence",
      id: "evidence-core-route-artifact-contracts",
      nodeIds: ["core-route"],
      repositoryId: "repo-core",
      commit: frozenCoreCommit,
      pathOrContractId: "tests/artifactRetainedContract.test.ts",
      verificationSummary: "Direct tests verify retained artifact manifest and job planning plus valid and invalid job transitions without Backend route execution.",
      verifiedAt: "2026-08-13T00:00:00.000Z",
    });
    expect(evidence.get("evidence-core-route-public-boundary")).toEqual({
      kind: "evidence",
      id: "evidence-core-route-public-boundary",
      nodeIds: ["core-route"],
      repositoryId: "repo-core",
      commit: frozenCoreCommit,
      pathOrContractId: "src/index.ts",
      verificationSummary: "The public entrypoint omits route-shaped modules while retained generation runtime, artifact manifest, and artifact job modules remain exported.",
      verifiedAt: "2026-08-13T00:00:00.000Z",
    });
  });
});
