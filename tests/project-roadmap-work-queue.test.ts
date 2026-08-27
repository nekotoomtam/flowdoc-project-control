import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const timestamp = "2026-08-24T00:00:00.000Z";
const resumptionTimestamp = "2026-08-26T00:00:00.000Z";

const expectedLegacyWork = [
  {
    kind: "work",
    id: "agent-and-skill-design",
    title: "Agent and Skill Design",
    nodeId: "project-control",
    repositoryIds: ["repo-project-control"],
    workState: "queued",
    summary: "Define FlowDoc agent roles, capabilities, handoffs, and reusable skills after the documentation baseline is under control.",
    requiredEvidence: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    kind: "work",
    id: "core-documentation-family-closure",
    title: "Core Documentation Family Closure",
    nodeId: "core",
    repositoryIds: ["repo-core", "repo-project-control"],
    workState: "in-progress",
    summary: "Close migration coverage, repair references, review publication readiness, and decide cleanup for the four synthesized Core documentation families.",
    requiredEvidence: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    kind: "work",
    id: "core-remaining-documentation-synthesis",
    title: "Remaining Core Documentation Synthesis",
    nodeId: "core",
    repositoryIds: ["repo-core", "repo-project-control"],
    workState: "queued",
    summary: "Synthesize the remaining 293 Core source documents by identifying overview groups before producing bounded subject documents.",
    requiredEvidence: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    kind: "work",
    id: "flowdoc-product-development-resumption",
    title: "FlowDoc Product Development Resumption",
    nodeId: "flowdoc",
    repositoryIds: ["repo-project-control", "repo-core", "repo-editor", "repo-backend"],
    workState: "in-progress",
    summary: "Resume coordinated FlowDoc product development after the control and documentation baseline is usable across repositories, starting with a bounded product evidence refresh.",
    requiredEvidence: [],
    createdAt: timestamp,
    updatedAt: resumptionTimestamp,
  },
] as const;

const remediationTasks = [
  {
    id: "backend-service-readiness-boundary-review",
    nodeId: "backend",
    workState: "in-review",
    activeRole: "evidence-reviewer",
    phaseId: "phase-backend-service-readiness-boundary-review",
    phaseState: "done",
    checklistId: "checklist-backend-service-readiness-boundary-review",
    checklistLength: 5,
  },
  {
    id: "core-default-gate-stability-review",
    nodeId: "core",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-core-default-gate-stability-review",
    phaseState: "done",
    checklistId: "checklist-core-default-gate-stability-review",
    checklistLength: 5,
  },
  {
    id: "core-public-export-boundary-review",
    nodeId: "core",
    workState: "in-review",
    activeRole: "cross-repo-boundary-reviewer",
    phaseId: "phase-core-public-export-boundary-review",
    phaseState: "done",
    checklistId: "checklist-core-public-export-boundary-review",
    checklistLength: 5,
  },
  {
    id: "core-runtime-version-contract-hardening",
    nodeId: "core",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-core-runtime-version-contract-hardening",
    phaseState: "done",
    checklistId: "checklist-core-runtime-version-contract-hardening",
    checklistLength: 8,
  },
  {
    id: "cross-repository-compatibility-evidence-review",
    nodeId: "flowdoc",
    workState: "in-review",
    activeRole: "cross-repo-boundary-reviewer",
    phaseId: "phase-cross-repository-compatibility-evidence-review",
    phaseState: "done",
    checklistId: "checklist-cross-repository-compatibility-evidence-review",
    checklistLength: 6,
  },
  {
    id: "editor-backend-unavailable-honesty-review",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "evidence-reviewer",
    phaseId: "phase-editor-backend-unavailable-honesty-review",
    phaseState: "done",
    checklistId: "checklist-editor-backend-unavailable-honesty-review",
    checklistLength: 5,
  },
  {
    id: "editor-backend-core-live-compatibility-harness",
    nodeId: "flowdoc",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-backend-core-live-compatibility-harness",
    phaseState: "done",
    checklistId: "checklist-editor-backend-core-live-compatibility-harness",
    checklistLength: 6,
  },
  {
    id: "editor-browser-live-backend-smoke",
    nodeId: "flowdoc",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-browser-live-backend-smoke",
    phaseState: "done",
    checklistId: "checklist-editor-browser-live-backend-smoke",
    checklistLength: 6,
  },
  {
    id: "editor-browser-live-backend-corpus-smoke",
    nodeId: "flowdoc",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-browser-live-backend-corpus-smoke",
    phaseState: "done",
    checklistId: "checklist-editor-browser-live-backend-corpus-smoke",
    checklistLength: 6,
  },
  {
    id: "flowdoc-bounded-browser-compatibility-promotion",
    nodeId: "flowdoc-browser-compatibility",
    workState: "in-review",
    activeRole: "evidence-reviewer",
    phaseId: "phase-flowdoc-bounded-browser-compatibility-promotion",
    phaseState: "done",
    checklistId: "checklist-flowdoc-bounded-browser-compatibility-promotion",
    checklistLength: 6,
  },
] as const;

describe("project roadmap Work Queue", () => {
  it("publishes roadmap cards and the first executable Work path without changing node truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));

    expect(model.work).toHaveLength(expectedLegacyWork.length + 13);
    for (const work of expectedLegacyWork) {
      expect(model.work.find((item) => item.id === work.id)).toEqual(expect.objectContaining(work));
    }
    expect(model.work.find((item) => item.id === "project-control-hardening")).toMatchObject({
      workKind: "topic",
      workState: "in-review",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "project-control",
      childWorkIds: ["work-tree-phase-checklist-sqlite-contract"],
    });
    expect(model.work.find((item) => item.id === "work-tree-phase-checklist-sqlite-contract")).toMatchObject({
      workKind: "task",
      workState: "in-review",
      parentWorkId: "project-control-hardening",
      nodeId: "project-control",
      phaseIds: ["phase-work-tree-contract-validation"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "project-control-hardening",
        "work-tree-phase-checklist-sqlite-contract",
      ],
    });
    expect(model.work.find((item) => item.id === "flowdoc-product-development-resumption")).toMatchObject({
      childWorkIds: [
        "backend-service-readiness-boundary-review",
        "core-default-gate-stability-review",
        "core-public-export-boundary-review",
        "core-runtime-version-contract-hardening",
        "cross-repository-compatibility-evidence-review",
        "editor-backend-core-live-compatibility-harness",
        "editor-backend-unavailable-honesty-review",
        "editor-browser-live-backend-corpus-smoke",
        "editor-browser-live-backend-smoke",
        "flowdoc-bounded-browser-compatibility-promotion",
        "flowdoc-product-evidence-refresh",
        "project-control-hardening",
      ],
    });
    expect(model.work.find((item) => item.id === "flowdoc-product-evidence-refresh")).toMatchObject({
      workKind: "task",
      workState: "in-review",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "flowdoc",
      activeRole: "evidence-reviewer",
      phaseIds: ["phase-flowdoc-product-evidence-refresh-readiness"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "flowdoc-product-evidence-refresh",
      ],
    });
    expect(model.phases.find((item) => item.id === "phase-work-tree-contract-validation")).toMatchObject({
      workId: "work-tree-phase-checklist-sqlite-contract",
      phaseState: "done",
    });
    expect(model.phases.find((item) => item.id === "phase-flowdoc-product-evidence-refresh-readiness")).toMatchObject({
      workId: "flowdoc-product-evidence-refresh",
      phaseState: "done",
    });
    expect(model.checklists.find((item) => item.id === "checklist-work-tree-contract-validation")?.items)
      .toHaveLength(5);
    expect(model.checklists.find((item) => item.id === "checklist-work-tree-contract-validation")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-flowdoc-product-evidence-refresh-readiness")?.items
      .map((item) => item.id))
      .toEqual([
        "capture-current-heads",
        "run-current-gates",
        "classify-promotion-blockers",
        "preserve-map-truth",
        "split-remediation-work",
      ]);
    expect(model.checklists.find((item) => item.id === "checklist-flowdoc-product-evidence-refresh-readiness")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed"]);
    for (const task of remediationTasks) {
      expect(model.work.find((item) => item.id === task.id)).toMatchObject({
        workKind: "task",
        workState: task.workState,
        parentWorkId: "flowdoc-product-development-resumption",
        nodeId: task.nodeId,
        activeRole: task.activeRole,
        phaseIds: [task.phaseId],
        workPathIds: [
          "flowdoc-product-development-resumption",
          task.id,
        ],
      });
      expect(model.phases.find((item) => item.id === task.phaseId)).toMatchObject({
        workId: task.id,
        phaseState: task.phaseState,
      });
      expect(model.checklists.find((item) => item.id === task.checklistId)?.items)
        .toHaveLength(task.checklistLength);
    }
    expect(model.nodes.find((node) => node.id === "core")).toMatchObject({
      truthState: "unknown",
      workIds: [
        "core-default-gate-stability-review",
        "core-documentation-family-closure",
        "core-public-export-boundary-review",
        "core-remaining-documentation-synthesis",
        "core-runtime-version-contract-hardening",
      ],
    });
    expect(model.nodes.find((node) => node.id === "editor")).toMatchObject({
      truthState: "unknown",
      workIds: [
        "editor-backend-unavailable-honesty-review",
      ],
    });
    expect(model.nodes.find((node) => node.id === "backend")).toMatchObject({
      truthState: "unknown",
      workIds: [
        "backend-service-readiness-boundary-review",
      ],
    });
    expect(model.nodes.find((node) => node.id === "project-control")).toMatchObject({
      truthState: "current",
      workIds: [
        "agent-and-skill-design",
        "project-control-hardening",
        "work-tree-phase-checklist-sqlite-contract",
      ],
    });
    expect(model.nodes.find((node) => node.id === "flowdoc")).toMatchObject({
      truthState: "planned",
      childIds: [
        "backend",
        "core",
        "editor",
        "flowdoc-browser-compatibility",
        "project-control",
      ],
      workIds: [
        "cross-repository-compatibility-evidence-review",
        "editor-backend-core-live-compatibility-harness",
        "editor-browser-live-backend-corpus-smoke",
        "editor-browser-live-backend-smoke",
        "flowdoc-product-development-resumption",
        "flowdoc-product-evidence-refresh",
      ],
    });
    expect(model.nodes.find((node) => node.id === "flowdoc-browser-compatibility")).toMatchObject({
      truthState: "current",
      documentIds: [
        "doc-editor-browser-live-backend-corpus-smoke-2026-08-27",
        "doc-flowdoc-bounded-browser-compatibility-promotion-2026-08-27",
      ],
      evidenceIds: [
        "evidence-editor-browser-live-backend-corpus-smoke-2026-08-27",
        "evidence-flowdoc-bounded-browser-compatibility-promotion-2026-08-27",
      ],
      repositoryIds: ["repo-project-control", "repo-editor", "repo-backend", "repo-core"],
      workIds: ["flowdoc-bounded-browser-compatibility-promotion"],
    });
    expect(model.checklists.find((item) => item.id === "checklist-core-public-export-boundary-review")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-editor-backend-unavailable-honesty-review")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-backend-service-readiness-boundary-review")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-cross-repository-compatibility-evidence-review")?.items
      .map((item) => item.state))
      .toEqual(["passed", "blocked", "passed", "passed", "unknown", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-core-default-gate-stability-review")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-editor-backend-core-live-compatibility-harness")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-editor-browser-live-backend-smoke")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-editor-browser-live-backend-corpus-smoke")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-flowdoc-bounded-browser-compatibility-promotion")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-core-runtime-version-contract-hardening")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.documents.find((item) => item.id === "doc-core-runtime-version-contract-hardening-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        path: "docs/domains/core-runtime-version-contract-hardening-2026-08-27.md",
        role: "verification",
      });
    expect(model.evidence.find((item) => item.id === "evidence-core-runtime-version-contract-hardening-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-core",
        commit: "992dbbbd6b6ac8f921d3dd98bd3515b77728868f",
        pathOrContractId: "src/schema/versionCapability.ts#VNEXT_CORE_VERSION_SURFACE_RETIREMENT_INVENTORY",
      });
    expect(model.evidence.find((item) => item.id === "evidence-core-runtime-version-contract-hardening-2026-08-27")?.verificationSummary)
      .toContain("version-surface retirement inventory");
    expect(model.documents.find((item) => item.id === "doc-editor-backend-core-live-compatibility-harness-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        path: "docs/domains/editor-backend-core-live-compatibility-harness-2026-08-27.md",
        role: "verification",
      });
    expect(model.documents.find((item) => item.id === "doc-editor-browser-live-backend-smoke-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        path: "docs/domains/editor-browser-live-backend-smoke-2026-08-27.md",
        role: "verification",
      });
    expect(model.documents.find((item) => item.id === "doc-editor-browser-live-backend-corpus-smoke-2026-08-27"))
      .toMatchObject({
        nodeIds: ["flowdoc-browser-compatibility"],
        path: "docs/domains/editor-browser-live-backend-corpus-smoke-2026-08-27.md",
        role: "verification",
      });
    expect(model.documents.find((item) => item.id === "doc-flowdoc-bounded-browser-compatibility-promotion-2026-08-27"))
      .toMatchObject({
        nodeIds: ["flowdoc-browser-compatibility"],
        path: "docs/domains/flowdoc-bounded-browser-compatibility-promotion-2026-08-27.md",
        role: "current-state",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-backend-core-live-compatibility-harness-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "16a8fde628b887624249d50a162241ef2d96a415",
        pathOrContractId: "src/tests/liveCompatibilityHarness.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-backend-core-live-compatibility-harness-2026-08-27")?.verificationSummary)
      .toContain("accepted live Editor client to Backend server to Core harness");
    expect(model.evidence.find((item) => item.id === "evidence-editor-browser-live-backend-smoke-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "ad0dbf7b81f483cb73c19ed28c3fd8fcbd68c6e4",
        pathOrContractId: "src/fixtures/editor-browser-live-backend-smoke.v1.json",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-browser-live-backend-smoke-2026-08-27")?.verificationSummary)
      .toContain("accepted bounded browser-app live Backend smoke");
    expect(model.evidence.find((item) => item.id === "evidence-editor-browser-live-backend-corpus-smoke-2026-08-27"))
      .toMatchObject({
        nodeIds: ["flowdoc-browser-compatibility"],
        repositoryId: "repo-editor",
        commit: "5cdd092265eb036be56a2d8f06e3987d0b6199d6",
        pathOrContractId: "src/fixtures/editor-browser-live-backend-corpus-smoke.v1.json",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-browser-live-backend-corpus-smoke-2026-08-27")?.verificationSummary)
      .toContain("default loopback Backend corpus");
    expect(model.evidence.find((item) => item.id === "evidence-flowdoc-bounded-browser-compatibility-promotion-2026-08-27"))
      .toMatchObject({
        nodeIds: ["flowdoc-browser-compatibility"],
        repositoryId: "repo-project-control",
        commit: "739d19d452bdb5151ec030db96a9247da0a29ae5",
        pathOrContractId: "docs/domains/editor-browser-live-backend-smoke-2026-08-27.md",
      });
    expect(model.evidence.find((item) => item.id === "evidence-flowdoc-bounded-browser-compatibility-promotion-2026-08-27")?.verificationSummary)
      .toContain("promotes only the bounded local loopback browser compatibility child claim");
    expect(model.evidence.find((item) => item.id === "evidence-core-default-gate-stability-review-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-core",
        commit: "77b9e181d1fb43bf69d725108ede664578a07a45",
        pathOrContractId: "package.json#scripts.check",
      });
    expect(model.evidence.find((item) => item.id === "evidence-core-default-gate-stability-review-2026-08-27")?.verificationSummary)
      .toContain("supports only the bounded Core default owner gate result");
    expect(model.evidence.find((item) => item.id === "evidence-core-public-export-boundary-review-2026-08-26"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-core",
        commit: "969a21ae66a3a1d6a92e5df608d23e08acb9a563",
        pathOrContractId: "docs/CORE_PUBLIC_EXPORT_BOUNDARY_REVIEW.md",
      });
    expect(model.evidence.find((item) => item.id === "evidence-core-public-export-boundary-review-2026-08-26")?.verificationSummary)
      .toContain("bounded no-go export-boundary decision");
    expect(model.evidence.find((item) => item.id === "evidence-editor-backend-unavailable-honesty-review-2026-08-26"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "3eb382b6c0c891481b1bada0827e0f92f21d18e2",
        pathOrContractId: "docs/EDITOR_BACKEND_UNAVAILABLE_HONESTY_REVIEW.md",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-backend-unavailable-honesty-review-2026-08-26")?.verificationSummary)
      .toContain("bounded Editor backend-unavailable Preview honesty lane");
    expect(model.evidence.find((item) => item.id === "evidence-backend-service-readiness-boundary-review-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-backend",
        commit: "42cc1040c959a16647b7e797929358c401ccfa38",
        pathOrContractId: "docs/BACKEND_SERVICE_READINESS_BOUNDARY.md",
      });
    expect(model.evidence.find((item) => item.id === "evidence-backend-service-readiness-boundary-review-2026-08-27")?.verificationSummary)
      .toContain("bounded Backend service-readiness boundary lane");
    expect(model.evidence.find((item) => item.id === "evidence-cross-repo-compatibility-core-gate-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-core",
        commit: "969a21a4e888d836ae62164b206cb2dd34d5d702",
        pathOrContractId: "package.json#scripts.check",
      });
    expect(model.evidence.find((item) => item.id === "evidence-cross-repo-compatibility-core-gate-2026-08-27")?.verificationSummary)
      .toContain("blocks accepted default-gate compatibility promotion");
    expect(model.evidence.find((item) => item.id === "evidence-cross-repo-compatibility-editor-gate-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "3eb382b6c0c891481b1bada0827e0f92f21d18e2",
        pathOrContractId: "package.json#scripts.check",
      });
    expect(model.evidence.find((item) => item.id === "evidence-cross-repo-compatibility-editor-gate-2026-08-27")?.verificationSummary)
      .toContain("bounded Editor/Core and Editor/Backend transport-shape compatibility only");
    expect(model.evidence.find((item) => item.id === "evidence-cross-repo-compatibility-backend-gate-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-backend",
        commit: "42cc1040c959a16647b7e797929358c401ccfa38",
        pathOrContractId: "package.json#scripts.check",
      });
    expect(model.evidence.find((item) => item.id === "evidence-cross-repo-compatibility-backend-gate-2026-08-27")?.verificationSummary)
      .toContain("bounded Backend/Core and Backend HTTP contract compatibility only");

    for (const work of model.work) {
      expect(work).not.toHaveProperty("blockedBy");
      expect(work).not.toHaveProperty("unblockOwner");
    }
    const indexedWork = model.work as Array<(typeof model.work)[number] & {
      phaseIds: string[];
      workPathIds: string[];
    }>;
    for (const work of indexedWork.filter((item) =>
      expectedLegacyWork.some((expected) => expected.id === item.id),
    )) {
      expect(work.workKind).toBeUndefined();
      expect(work.phaseIds).toEqual([]);
      expect(work.workPathIds).toEqual([work.id]);
    }
  });

  it("anchors the cross-repository Project Control rollout to committed AGENTS.md pointers", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const flowdoc = model.nodes.find((node) => node.id === "flowdoc");
    const evidence = new Map(model.evidence.map((item) => [item.id, item]));

    expect(flowdoc?.truthState).toBe("planned");
    expect(model.work.some((item) => item.id === "cross-repository-project-control-rollout"))
      .toBe(false);
    expect(flowdoc?.evidenceIds).toEqual([
      "evidence-core-project-control-entrypoint",
      "evidence-editor-project-control-entrypoint",
      "evidence-backend-project-control-entrypoint",
      "evidence-project-control-product-evidence-refresh-path-2026-08-26",
      "evidence-flowdoc-product-refresh-core-2026-08-26",
      "evidence-flowdoc-product-refresh-editor-2026-08-26",
      "evidence-flowdoc-product-refresh-backend-2026-08-26",
    ]);
    expect(evidence.get("evidence-core-project-control-entrypoint")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-core",
      commit: "e7b848e657f8e08278780a663e868e88d54c59d6",
      pathOrContractId: "AGENTS.md",
    });
    expect(evidence.get("evidence-editor-project-control-entrypoint")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-editor",
      commit: "baa871c378a313e8f0c402ea33e3aa480953ce1f",
      pathOrContractId: "AGENTS.md",
    });
    expect(evidence.get("evidence-backend-project-control-entrypoint")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-backend",
      commit: "7ebb973b07962c35c627fb5bc2f2f7eafda2ea8a",
      pathOrContractId: "AGENTS.md",
    });
    expect(evidence.get("evidence-project-control-product-evidence-refresh-path-2026-08-26")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-project-control",
      commit: "3cfab24a85d1335033105b3d8c12d9a84ae88509",
      pathOrContractId: "data/work/flowdoc-product-evidence-refresh.json",
    });
    expect(evidence.get("evidence-flowdoc-product-refresh-core-2026-08-26")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-core",
      commit: "501caec1fe3317309d0f6c18c2dec118fb6994e7",
      pathOrContractId: "package.json#scripts.type-check,test",
    });
    expect(evidence.get("evidence-flowdoc-product-refresh-editor-2026-08-26")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-editor",
      commit: "baa871c378a313e8f0c402ea33e3aa480953ce1f",
      pathOrContractId: "package.json#scripts.type-check,test",
    });
    expect(evidence.get("evidence-flowdoc-product-refresh-backend-2026-08-26")).toMatchObject({
      nodeIds: ["flowdoc"],
      repositoryId: "repo-backend",
      commit: "7ebb973b07962c35c627fb5bc2f2f7eafda2ea8a",
      pathOrContractId: "package.json#scripts.type-check,test",
    });
    for (const item of evidence.values()) {
      if (item.id.includes("project-control-entrypoint")) {
        expect(item.verificationSummary).toContain("Project Control entrypoint");
        expect(item.verificationSummary).toContain("BLOCKER stop condition");
      }
    }
  });
});
