import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const execFileAsync = promisify(execFile);
const frozenCoreCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const approvedDesignCommit = "d79b88c23a307e7ec49437a015804d7a4d2de4bf";
const projectControlPublicationCommit = "bd588e336bd466e3c49e0d593ec6296293ef28bb";
const coreCleanupCommit = "8aa0be4f662708fa75d4eb8f0f99b4784da2371c";
const removedCoreRoutePaths = [
  "docs/CORE_ROUTE_DEEXPORT_PLAN.md",
  "docs/CORE_ROUTE_DEPRECATION_WINDOW.md",
  "docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md",
  "docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md",
];

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

  it("registers the FlowDoc system map and keeps plan documents separate from truth maps", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));

    expect(model.nodes.find((node) => node.id === "flowdoc")).toMatchObject({
      truthState: "planned",
      documentIds: [
        "doc-flowdoc-system-map",
        "doc-glossary-en",
        "doc-glossary-th",
      ],
    });
    expect(model.nodes.find((node) => node.id === "project-control")?.documentIds)
      .toContain("doc-document-map-operating-rules");

    expect(documents.get("doc-flowdoc-system-map")).toMatchObject({
      path: "docs/domains/flowdoc-system-map.md",
      nodeIds: ["flowdoc"],
      role: "current-state",
      lifecycle: "active",
    });
    expect(documents.get("doc-flowdoc-system-map")?.content).toContain("## System inventory");
    expect(documents.get("doc-flowdoc-system-map")?.content).toContain("Core");
    expect(documents.get("doc-flowdoc-system-map")?.content).toContain("Editor");
    expect(documents.get("doc-flowdoc-system-map")?.content).toContain("Backend");

    expect(documents.get("doc-document-map-operating-rules")).toMatchObject({
      path: "docs/domains/document-map-operating-rules.md",
      nodeIds: ["project-control"],
      role: "contract",
      lifecycle: "active",
    });
    expect(documents.get("doc-document-map-operating-rules")?.content)
      .toContain("Plan / Work records intent");
    expect(documents.get("doc-document-map-operating-rules")?.content)
      .toContain("DOCUMENT_MAP records verified system truth");

    for (const id of ["core", "editor", "backend"]) {
      expect(model.nodes.find((node) => node.id === id)?.truthState).toBe("unknown");
    }
  });

  it("publishes the new-agent onboarding entrypoint as a Project Control contract", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const projectControl = model.nodes.find((node) => node.id === "project-control");

    expect(projectControl?.documentIds).toContain("doc-project-control-agent-onboarding");
    expect(documents.get("doc-project-control-agent-onboarding")).toMatchObject({
      path: "AGENTS.md",
      nodeIds: ["project-control"],
      role: "contract",
      lifecycle: "active",
    });
    expect(documents.get("doc-project-control-agent-onboarding")?.content)
      .toContain("Start here");
    expect(documents.get("doc-project-control-agent-onboarding")?.content)
      .toContain("docs/domains/flowdoc-system-map.md");
    expect(documents.get("doc-project-control-agent-onboarding")?.content)
      .toContain("Do not update DOCUMENT_MAP");
    expect(documents.get("doc-project-control-agent-onboarding")?.content)
      .toContain("PASS / FAIL / BLOCKER / RISK / UNKNOWN");
  });

  it("registers closed Core route truth without retaining pilot Work or promoting the parent Core node", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const core = model.nodes.find((node) => node.id === "core");
    const coreRoute = model.nodes.find((node) => node.id === "core-route");

    expect(coreRoute).toMatchObject({
      parentId: "core",
      truthState: "current",
      documentIds: [
        "doc-core-route-migration-review",
        "doc-core-route-overview",
        "doc-core-route-retained-contracts",
      ],
      evidenceIds: [
        "evidence-core-route-artifact-contracts",
        "evidence-core-route-cleanup",
        "evidence-core-route-generation-contracts",
        "evidence-core-route-public-boundary",
      ],
    });
    expect(core).toMatchObject({
      truthState: "unknown",
      documentIds: ["doc-core-v0-1-0a-1-document-map"],
    });
    expect(core?.summary).toMatch(/broader\s+Core[^.]*unknown/iu);
    expect(core?.summary).toMatch(/bounded\s+core-route\s+child[^.]*closed/iu);
    expect(core?.summary).not.toMatch(/pending|queued|future\s+work|does\s+not\s+exist|no\s+artifact/iu);
    const coreRepository = model.repositories.find((repository) => repository.id === "repo-core");
    expect(coreRepository?.ownershipSummary).toMatch(/broader\s+Core[^.]*unknown/iu);
    expect(coreRepository?.ownershipSummary).toMatch(/bounded\s+core-route\s+child[^.]*closed/iu);
    expect(coreRepository?.ownershipSummary)
      .not.toMatch(/pending|queued|future\s+work|does\s+not\s+exist|no\s+artifact/iu);
    expect(model.work.some((item) => item.id === "work-core-route-pilot")).toBe(false);
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
    expect(documents.get("doc-core-route-migration-review")).toMatchObject({
      path: "docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md",
      nodeIds: ["core-route"],
      role: "verification",
      lifecycle: "active",
      repositoryRefs: [
        {
          repositoryId: "repo-project-control",
          commit: projectControlPublicationCommit,
          pathOrContractId: "docs/versions/V0_1_0a_1/core/core-route/route-ownership-and-retained-contracts.md",
        },
      ],
    });
  });

  it("anchors Core route truth to three frozen executable records and reciprocal cleanup Evidence", async () => {
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
    const cleanup = evidence.get("evidence-core-route-cleanup");
    expect(cleanup).toMatchObject({
      kind: "evidence",
      id: "evidence-core-route-cleanup",
      nodeIds: ["core-route"],
      repositoryId: "repo-core",
      commit: coreCleanupCommit,
      pathOrContractId: "docs/",
    });
    for (const path of removedCoreRoutePaths) {
      expect(cleanup?.verificationSummary).toContain(path);
    }
    expect(cleanup?.verificationSummary).toContain("464 test files / 3,080 tests");
    expect(model.evidence
      .filter((item) => item.nodeIds.includes("core-route"))
      .map((item) => item.id)
      .sort())
      .toEqual([
        "evidence-core-route-artifact-contracts",
        "evidence-core-route-cleanup",
        "evidence-core-route-generation-contracts",
        "evidence-core-route-public-boundary",
      ]);
  });
});
