import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const timestamp = "2026-08-24T00:00:00.000Z";
const resumptionTimestamp = "2026-08-26T00:00:00.000Z";
const editorVisibleTextBlockTypingCommit = "6f59f7269322abfe3428d4df6f4ba0ee6ab0078f";
const editorTextBlockEditingUxCommit = "a42409a31cb855331e5114a52bc3d07d75cb67e6";
const editorTextBearingNodeCoverageCommit = "3cc2cf9e008fa43bd0be491f4dc6ba83b041faf2";
const editorCanvasTextDescendantSelectionCommit = "940b4dfc5f61fa551993c9c853c5c8aed0a986c5";
const editorCompositePreviewChildVisualSelectionCommit = "7730a543fb572680144ed8252d9a20d28ce44b7d";
const editorStructureLargeDocumentNavigationPerformanceCommit = "e1a2a9dc2d5b2a1557aa8838dc03aecece26d102";

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
    id: "core-consumer-surface-freeze",
    nodeId: "core",
    workState: "in-review",
    activeRole: "cross-repo-boundary-reviewer",
    phaseId: "phase-core-consumer-surface-freeze",
    phaseState: "done",
    checklistId: "checklist-core-consumer-surface-freeze",
    checklistLength: 6,
  },
  {
    id: "backend-core-version-contract-consumer-hardening",
    nodeId: "backend",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-backend-core-version-contract-consumer-hardening",
    phaseState: "done",
    checklistId: "checklist-backend-core-version-contract-consumer-hardening",
    checklistLength: 7,
  },
  {
    id: "backend-service-contract-hardening",
    nodeId: "backend",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-backend-service-contract-hardening",
    phaseState: "done",
    checklistId: "checklist-backend-service-contract-hardening",
    checklistLength: 6,
  },
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
    id: "editor-creator-structure-add-affordance-foundation",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-creator-structure-add-affordance-foundation",
    phaseState: "done",
    checklistId: "checklist-editor-creator-structure-add-affordance-foundation",
    checklistLength: 7,
  },
  {
    id: "editor-structure-panel-narrow-width-visibility",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-structure-panel-narrow-width-visibility",
    phaseState: "done",
    checklistId: "checklist-editor-structure-panel-narrow-width-visibility",
    checklistLength: 6,
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
    id: "editor-live-backend-rich-inline-harness",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-live-backend-rich-inline-harness",
    phaseState: "done",
    checklistId: "checklist-editor-live-backend-rich-inline-harness",
    checklistLength: 7,
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
    id: "editor-paper-smooth-zoom-surface",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-paper-smooth-zoom-surface",
    phaseState: "done",
    checklistId: "checklist-editor-paper-smooth-zoom-surface",
    checklistLength: 8,
  },
  {
    id: "editor-paper-smooth-zoom-anchor-fix",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-paper-smooth-zoom-anchor-fix",
    phaseState: "done",
    checklistId: "checklist-editor-paper-smooth-zoom-anchor-fix",
    checklistLength: 6,
  },
  {
    id: "editor-selection-overlay-zoom-motion-sync",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-selection-overlay-zoom-motion-sync",
    phaseState: "done",
    checklistId: "checklist-editor-selection-overlay-zoom-motion-sync",
    checklistLength: 7,
  },
  {
    id: "editor-selection-context-summary-foundation",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-selection-context-summary-foundation",
    phaseState: "done",
    checklistId: "checklist-editor-selection-context-summary-foundation",
    checklistLength: 7,
  },
  {
    id: "editor-inspector-detail-navigation-foundation",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-inspector-detail-navigation-foundation",
    phaseState: "done",
    checklistId: "checklist-editor-inspector-detail-navigation-foundation",
    checklistLength: 7,
  },
  {
    id: "editor-outline-scannability-foundation",
    nodeId: "editor",
    workState: "in-review",
    activeRole: "product-implementation-agent",
    phaseId: "phase-editor-outline-scannability-foundation",
    phaseState: "done",
    checklistId: "checklist-editor-outline-scannability-foundation",
    checklistLength: 7,
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
  {
    id: "flowdoc-core-backend-readiness-matrix",
    nodeId: "flowdoc",
    workState: "in-review",
    activeRole: "cross-repo-boundary-reviewer",
    phaseId: "phase-flowdoc-core-backend-readiness-matrix",
    phaseState: "done",
    checklistId: "checklist-flowdoc-core-backend-readiness-matrix",
    checklistLength: 6,
  },
  {
    id: "flowdoc-core-backend-editor-readiness-pass-8h",
    nodeId: "flowdoc",
    workState: "in-progress",
    activeRole: "cross-repo-boundary-reviewer",
    phases: [
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-core-backend-gate",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-core-backend-gate",
        checklistLength: 6,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-text-block-authoring-boundary",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-text-block-authoring-boundary",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-active-text-block-island-runtime",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-active-text-block-island-runtime",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-active-text-block-island-backend-lifecycle",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-active-text-block-island-backend-lifecycle",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-active-text-block-island-commit-runner",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-active-text-block-island-commit-runner",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-node-placement-readiness",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-node-placement-readiness",
        checklistLength: 8,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-add-node-contract",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-add-node-contract",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-backend-add-node-transport-gate",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-backend-add-node-transport-gate",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-editor-add-node-activation-harness",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-editor-add-node-activation-harness",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-editor-add-node-visible-ui",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-editor-add-node-visible-ui",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-editor-visible-text-block-typing",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-editor-visible-text-block-typing",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-editor-text-block-editing-ux",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-editor-text-block-editing-ux",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-editor-text-bearing-node-coverage",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-editor-text-bearing-node-coverage",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-editor-canvas-text-descendant-selection",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-editor-canvas-text-descendant-selection",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-editor-composite-preview-child-visual-selection",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-editor-composite-preview-child-visual-selection",
        checklistLength: 7,
      },
      {
        phaseId: "phase-flowdoc-core-backend-editor-readiness-pass-editor-structure-large-document-navigation-performance",
        phaseState: "done",
        checklistId: "checklist-flowdoc-core-backend-editor-readiness-pass-editor-structure-large-document-navigation-performance",
        checklistLength: 7,
      },
    ],
  },
  {
    id: "flowdoc-product-terminology-foundation",
    nodeId: "flowdoc",
    workState: "in-review",
    activeRole: "documentation-synthesizer",
    phaseId: "phase-flowdoc-product-terminology-foundation",
    phaseState: "done",
    checklistId: "checklist-flowdoc-product-terminology-foundation",
    checklistLength: 6,
  },
] as const;

describe("project roadmap Work Queue", () => {
  it("publishes roadmap cards and the first executable Work path without changing node truth", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));

    expect(model.work).toHaveLength(expectedLegacyWork.length + 37);
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
        "backend-core-version-contract-consumer-hardening",
        "backend-service-contract-hardening",
        "backend-service-readiness-boundary-review",
        "core-consumer-surface-freeze",
        "core-default-gate-stability-review",
        "core-public-export-boundary-review",
        "core-runtime-version-contract-hardening",
        "cross-repository-compatibility-evidence-review",
        "editor-backend-core-live-compatibility-harness",
        "editor-backend-unavailable-honesty-review",
        "editor-browser-live-backend-corpus-smoke",
        "editor-browser-live-backend-smoke",
        "editor-creator-structure-add-affordance-foundation",
        "editor-inspector-detail-navigation-foundation",
        "editor-live-backend-rich-inline-harness",
        "editor-local-loopback-dev-runner",
        "editor-outline-scannability-foundation",
        "editor-paper-smooth-zoom-anchor-fix",
        "editor-paper-smooth-zoom-surface",
        "editor-read-source-authoring-status",
        "editor-selection-context-summary-foundation",
        "editor-selection-overlay-zoom-motion-sync",
        "editor-structure-panel-narrow-width-visibility",
        "editor-workspace-editing-command-group-foundation",
        "editor-workspace-header-foundation",
        "editor-workspace-shell-redesign-foundation",
        "editor-workspace-status-strip-foundation",
        "editor-workspace-toolbar-foundation",
        "editor-workspace-view-tabs-foundation",
        "flowdoc-bounded-browser-compatibility-promotion",
        "flowdoc-core-backend-editor-readiness-pass-8h",
        "flowdoc-core-backend-readiness-matrix",
        "flowdoc-product-evidence-refresh",
        "flowdoc-product-terminology-foundation",
        "project-control-hardening",
        "project-control-overview-history-gui",
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
      const phases = "phases" in task ? task.phases : [
        {
          phaseId: task.phaseId,
          phaseState: task.phaseState,
          checklistId: task.checklistId,
          checklistLength: task.checklistLength,
        },
      ];
      expect(model.work.find((item) => item.id === task.id)).toMatchObject({
        workKind: "task",
        workState: task.workState,
        parentWorkId: "flowdoc-product-development-resumption",
        nodeId: task.nodeId,
        activeRole: task.activeRole,
        phaseIds: phases.map((phase) => phase.phaseId),
        workPathIds: [
          "flowdoc-product-development-resumption",
          task.id,
        ],
      });
      for (const phase of phases) {
        expect(model.phases.find((item) => item.id === phase.phaseId)).toMatchObject({
          workId: task.id,
          phaseState: phase.phaseState,
        });
        expect(model.checklists.find((item) => item.id === phase.checklistId)?.items)
          .toHaveLength(phase.checklistLength);
      }
    }
    expect(model.work.find((item) => item.id === "flowdoc-core-backend-editor-readiness-pass-8h")?.requiredEvidence)
      .toContain("evidence-editor-structure-large-document-navigation-performance-2026-08-31");
    expect(model.work.find((item) => item.id === "flowdoc-core-backend-editor-readiness-pass-8h")?.expectedOutput)
      .toContain(editorStructureLargeDocumentNavigationPerformanceCommit);
    expect(model.nodes.find((node) => node.id === "core")).toMatchObject({
      truthState: "unknown",
      workIds: [
        "core-consumer-surface-freeze",
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
        "editor-creator-structure-add-affordance-foundation",
        "editor-inspector-detail-navigation-foundation",
        "editor-live-backend-rich-inline-harness",
        "editor-local-loopback-dev-runner",
        "editor-outline-scannability-foundation",
        "editor-paper-smooth-zoom-anchor-fix",
        "editor-paper-smooth-zoom-surface",
        "editor-read-source-authoring-status",
        "editor-selection-context-summary-foundation",
        "editor-selection-overlay-zoom-motion-sync",
        "editor-structure-panel-narrow-width-visibility",
        "editor-workspace-editing-command-group-foundation",
        "editor-workspace-header-foundation",
        "editor-workspace-shell-redesign-foundation",
        "editor-workspace-status-strip-foundation",
        "editor-workspace-toolbar-foundation",
        "editor-workspace-view-tabs-foundation",
      ],
    });
    expect(model.nodes.find((node) => node.id === "backend")).toMatchObject({
      truthState: "unknown",
      workIds: [
        "backend-core-version-contract-consumer-hardening",
        "backend-service-contract-hardening",
        "backend-service-readiness-boundary-review",
      ],
    });
    expect(model.nodes.find((node) => node.id === "project-control")).toMatchObject({
      truthState: "current",
      workIds: [
        "agent-and-skill-design",
        "project-control-hardening",
        "project-control-overview-history-gui",
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
        "flowdoc-core-backend-editor-readiness-pass-8h",
        "flowdoc-core-backend-readiness-matrix",
        "flowdoc-product-development-resumption",
        "flowdoc-product-evidence-refresh",
        "flowdoc-product-terminology-foundation",
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
    expect(model.checklists.find((item) => item.id === "checklist-flowdoc-product-terminology-foundation")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-flowdoc-core-backend-readiness-matrix")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-core-runtime-version-contract-hardening")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-core-consumer-surface-freeze")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-backend-core-version-contract-consumer-hardening")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.checklists.find((item) => item.id === "checklist-backend-service-contract-hardening")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(model.documents.find((item) => item.id === "doc-backend-core-version-contract-consumer-hardening-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        path: "docs/domains/backend-core-version-contract-consumer-hardening-2026-08-27.md",
        role: "verification",
      });
    expect(model.evidence.find((item) => item.id === "evidence-backend-core-version-contract-consumer-hardening-2026-08-27"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-backend",
        commit: "6c3331217b509fc635ad25b71fba503ff066cd72",
        pathOrContractId: "src/contracts/versionCapability.ts#BACKEND_CORE_VERSION_CONSUMER_INVENTORY",
      });
    expect(model.evidence.find((item) => item.id === "evidence-backend-core-version-contract-consumer-hardening-2026-08-27")?.verificationSummary)
      .toContain("wraps the Core-owned version capability contract");
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
    expect(model.documents.find((item) => item.id === "doc-flowdoc-product-terminology"))
      .toMatchObject({
        nodeIds: ["flowdoc"],
        path: "docs/domains/flowdoc-product-terminology.md",
        role: "glossary",
      });
    expect(model.documents.find((item) => item.id === "doc-flowdoc-product-terminology-th"))
      .toMatchObject({
        nodeIds: ["flowdoc"],
        path: "docs/domains/flowdoc-product-terminology-th.md",
        role: "glossary",
      });
    expect(model.documents.find((item) => item.id === "doc-flowdoc-core-backend-readiness-matrix-2026-08-27"))
      .toMatchObject({
        nodeIds: ["flowdoc"],
        path: "docs/domains/flowdoc-core-backend-readiness-matrix-2026-08-27.md",
        role: "verification",
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
    expect(model.evidence.find((item) => item.id === "evidence-editor-live-backend-rich-inline-harness-2026-08-30"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "3b592b48765337efdbd6da539130d2daae1349bc",
        pathOrContractId: "src/tests/liveCompatibilityHarness.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-live-backend-rich-inline-harness-2026-08-30")?.verificationSummary)
      .toContain("bounded live Backend rich-inline mutation harness");
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-block-authoring-boundary-2026-08-30"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "e67a67f8c7dfa703ada43428a366d0db56bd4393",
        pathOrContractId: "src/editor/draft/textBlockAuthoringBoundary.ts#TEXT_BLOCK_AUTHORING_BOUNDARY_ID",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-block-authoring-boundary-2026-08-30")?.verificationSummary)
      .toContain("tested text-block authoring boundary");
    expect(model.evidence.find((item) => item.id === "evidence-editor-active-text-block-island-runtime-2026-08-30"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "24219dc0d6e5ec79368c82b159b37e3f9a0b9ed5",
        pathOrContractId: "src/editor/draft/activeTextBlockIsland.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-active-text-block-island-runtime-2026-08-30")?.verificationSummary)
      .toContain("memory-only active text-block island runtime state");
    expect(model.evidence.find((item) => item.id === "evidence-project-control-phase-order-read-model-2026-08-30"))
      .toMatchObject({
        nodeIds: ["project-control"],
        repositoryId: "repo-project-control",
        commit: "0e0c5fd617ac4618a4a03066a0dd719ce658380c",
        pathOrContractId: "tools/lib/build-read-model.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-project-control-phase-order-read-model-2026-08-30")?.verificationSummary)
      .toContain("ordered by phase.order");
    expect(model.evidence.find((item) => item.id === "evidence-editor-active-text-block-island-backend-lifecycle-2026-08-30"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "7dc118a23a993c5fb7ca6168ee77027dc9324cfa",
        pathOrContractId: "src/editor/runtime/runtimeBackendMutation.ts; src/editor/draft/activeTextBlockIsland.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-active-text-block-island-backend-lifecycle-2026-08-30")?.verificationSummary)
      .toContain("active text-block island Backend lifecycle");
    expect(model.evidence.find((item) => item.id === "evidence-editor-active-text-block-island-commit-runner-2026-08-30"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "747a7269838d457b940251be33cd275d80f9c3b4",
        pathOrContractId: "src/editor/draft/activeTextBlockIslandCommitRunner.ts; src/tests/liveCompatibilityHarness.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-active-text-block-island-commit-runner-2026-08-30")?.verificationSummary)
      .toContain("active text-block island commit runner");
    expect(model.evidence.find((item) => item.id === "evidence-editor-node-placement-readiness-2026-08-30"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "2be3145210eac74ecc6b82d547f6471456b36114",
        pathOrContractId: "src/editor/commands/nodePlacementReadiness.ts; src/tests/nodePlacementReadiness.test.ts; src/core/coreRuntimeSeedMapper.ts; src/editor/coreBinding/capabilityMirror.ts; src/editor/coreBinding/readModel.ts; src/core/coreTypes.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-node-placement-readiness-2026-08-30")?.verificationSummary)
      .toContain("node placement readiness matrix");
    expect(model.evidence.find((item) => item.id === "evidence-editor-add-node-contract-2026-08-30"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "d2290b47a37adc8aee2067ed4e094c6f39350b6c",
        pathOrContractId: "src/editor/commands/addNodeContract.ts; src/tests/addNodeContract.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-add-node-contract-2026-08-30")?.verificationSummary)
      .toContain("add-node contract builder");
    expect(model.evidence.find((item) => item.id === "evidence-editor-add-node-activation-harness-2026-08-30"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: "ae6978e3646e6ac4bbedc6ec15e6e38343bf0585",
        pathOrContractId: "src/editor/backend/backendTransport.ts; src/editor/backend/backendMutationRunner.ts; src/tests/addNodeActivationHarness.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-add-node-activation-harness-2026-08-30")?.verificationSummary)
      .toContain("bounded add-node activation harness");
    expect(model.evidence.find((item) => item.id === "evidence-editor-visible-text-block-typing-2026-08-30"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: editorVisibleTextBlockTypingCommit,
        pathOrContractId: "src/app/useActiveTextBlockEditing.ts; src/components/paper/PaperTextBlockEditor.tsx; src/editor/draft/textBlockInlineDraftAdapter.ts; scripts/run-editor-browser-live-backend-smoke.mjs; src/fixtures/editor-browser-live-backend-smoke.v1.json; src/tests/textBlockInlineDraftAdapter.test.ts; src/tests/activeTextBlockEditingHook.test.ts; src/tests/paperTextBlockEditor.test.ts; src/tests/canvasInteractiveTarget.test.ts; src/tests/editorBrowserLiveBackendSmokeEvidence.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-visible-text-block-typing-2026-08-30")?.verificationSummary)
      .toContain("visible text-block textarea island");
    expect(model.evidence.find((item) => item.id === "evidence-editor-visible-text-block-typing-2026-08-30")?.verificationSummary)
      .toContain("text-block.rich-inline.replace");
    expect(model.evidence.find((item) => item.id === "evidence-editor-visible-text-block-typing-2026-08-30")?.verificationSummary)
      .toContain("does not enable WYSIWYG");
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-block-editing-ux-2026-08-31"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: editorTextBlockEditingUxCommit,
        pathOrContractId: "src/editor/draft/textBlockInlineDraftAdapter.ts; src/app/useActiveTextBlockEditing.ts; src/editor/draft/activeTextBlockIsland.ts; src/components/paper/PaperTextBlockEditor.tsx; scripts/run-editor-browser-live-backend-smoke.mjs; src/fixtures/editor-browser-live-backend-smoke.v1.json; src/tests/textBlockInlineDraftAdapter.test.ts; src/tests/activeTextBlockEditingHook.test.ts; src/tests/activeTextBlockIsland.test.ts; src/tests/paperTextBlockEditor.test.ts; src/tests/editorBrowserLiveBackendSmokeEvidence.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-block-editing-ux-2026-08-31")?.verificationSummary)
      .toContain("line-break inline atomics");
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-block-editing-ux-2026-08-31")?.verificationSummary)
      .toContain("draft returns to the Backend value");
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-block-editing-ux-2026-08-31")?.verificationSummary)
      .toContain("does not enable WYSIWYG");
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-bearing-node-coverage-2026-08-31"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: editorTextBearingNodeCoverageCommit,
        pathOrContractId: "src/editor/presentation/nodePresentationProjector.ts; src/editor/presentation/nodePresentationTypes.ts; src/editor/render/renderProjector.ts; src/editor/render/renderTypes.ts; src/editor/runtime/editorView.ts; src/editor/runtime/editorState.ts; src/editor/runtime/runtimeBackendMutation.ts; src/editor/commands/commandExecutor.ts; src/components/paper/PaperBlock.tsx; src/components/paper/PaperTextBlockEditor.tsx; src/styles/editor.css; scripts/run-editor-browser-live-backend-smoke.mjs; src/fixtures/editor-browser-live-backend-smoke.v1.json; src/tests/nodePresentation.test.ts; src/tests/commands.test.ts; src/tests/backendIntegration.test.ts; src/tests/paperTextBlockEditor.test.ts; src/tests/editorBrowserLiveBackendSmokeEvidence.test.ts; src/tests/smoke.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-bearing-node-coverage-2026-08-31")?.verificationSummary)
      .toContain("editable text-block descendants");
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-bearing-node-coverage-2026-08-31")?.verificationSummary)
      .toContain("summary-left-text");
    expect(model.evidence.find((item) => item.id === "evidence-editor-text-bearing-node-coverage-2026-08-31")?.verificationSummary)
      .toContain("does not enable WYSIWYG");
    expect(model.evidence.find((item) => item.id === "evidence-editor-canvas-text-descendant-selection-2026-08-31"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: editorCanvasTextDescendantSelectionCommit,
        pathOrContractId: "scripts/run-editor-browser-live-backend-smoke.mjs; src/components/canvas/CanvasStage.tsx; src/components/canvas/CanvasSurface.tsx; src/components/paper/PaperBlock.tsx; src/components/paper/PaperPageStack.tsx; src/editor/backend/backendMutationRequests.ts; src/editor/commands/addNodeContract.ts; src/editor/commands/commandTypes.ts; src/editor/runtime/editorView.ts; src/editor/selection/hitTest.ts; src/fixtures/editor-browser-live-backend-smoke.v1.json; src/tests/backendIntegration.test.ts; src/tests/commands.test.ts; src/tests/editorBrowserLiveBackendSmokeEvidence.test.ts; src/tests/paperTextBlockEditor.test.ts; src/tests/selectionHitTest.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-canvas-text-descendant-selection-2026-08-31")?.verificationSummary)
      .toContain("canvas text-descendant selection");
    expect(model.evidence.find((item) => item.id === "evidence-editor-canvas-text-descendant-selection-2026-08-31")?.verificationSummary)
      .toContain("selectedOutlineNodeIds");
    expect(model.evidence.find((item) => item.id === "evidence-editor-canvas-text-descendant-selection-2026-08-31")?.verificationSummary)
      .toContain("does not enable WYSIWYG");
    expect(model.evidence.find((item) => item.id === "evidence-editor-composite-preview-child-visual-selection-2026-08-31"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: editorCompositePreviewChildVisualSelectionCommit,
        pathOrContractId: "scripts/run-editor-browser-live-backend-smoke.mjs; src/components/paper/PaperBlock.tsx; src/components/paper/PaperPage.tsx; src/fixtures/editor-browser-live-backend-smoke.v1.json; src/styles/editor.css; src/tests/editorBrowserLiveBackendSmokeEvidence.test.ts; src/tests/paperTextBlockEditor.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-composite-preview-child-visual-selection-2026-08-31")?.verificationSummary)
      .toContain("data-canvas-text-descendant-selected");
    expect(model.evidence.find((item) => item.id === "evidence-editor-composite-preview-child-visual-selection-2026-08-31")?.verificationSummary)
      .toContain("computed visual style");
    expect(model.evidence.find((item) => item.id === "evidence-editor-composite-preview-child-visual-selection-2026-08-31")?.verificationSummary)
      .toContain("does not enable WYSIWYG");
    expect(model.evidence.find((item) => item.id === "evidence-editor-structure-large-document-navigation-performance-2026-08-31"))
      .toMatchObject({
        nodeIds: [],
        repositoryId: "repo-editor",
        commit: editorStructureLargeDocumentNavigationPerformanceCommit,
        pathOrContractId: "scripts/run-editor-browser-live-backend-smoke.mjs; src/components/outline/OutlinePanel.tsx; src/fixtures/editor-browser-live-backend-smoke.v1.json; src/styles/editor.css; src/tests/editorBrowserLiveBackendSmokeEvidence.test.ts; src/tests/outlineScannability.test.ts",
      });
    expect(model.evidence.find((item) => item.id === "evidence-editor-structure-large-document-navigation-performance-2026-08-31")?.verificationSummary)
      .toContain("Structure panel");
    expect(model.evidence.find((item) => item.id === "evidence-editor-structure-large-document-navigation-performance-2026-08-31")?.verificationSummary)
      .toContain("data-outline-windowed");
    expect(model.evidence.find((item) => item.id === "evidence-editor-structure-large-document-navigation-performance-2026-08-31")?.verificationSummary)
      .toContain("367 tests");
    expect(model.evidence.find((item) => item.id === "evidence-editor-structure-large-document-navigation-performance-2026-08-31")?.verificationSummary)
      .toContain("does not enable WYSIWYG");
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
    expect(model.evidence.find((item) => item.id === "evidence-flowdoc-product-terminology-foundation-2026-08-27"))
      .toMatchObject({
        nodeIds: ["flowdoc"],
        repositoryId: "repo-project-control",
        pathOrContractId: "docs/domains/flowdoc-product-terminology.md",
      });
    expect(model.evidence.find((item) => item.id === "evidence-flowdoc-product-terminology-foundation-2026-08-27")?.verificationSummary)
      .toContain("does not promote product readiness");
    expect(model.evidence.find((item) => item.id === "evidence-flowdoc-core-backend-readiness-matrix-2026-08-27"))
      .toMatchObject({
        nodeIds: ["flowdoc"],
        repositoryId: "repo-project-control",
        pathOrContractId: "docs/domains/flowdoc-core-backend-readiness-matrix-2026-08-27.md",
      });
    expect(model.evidence.find((item) => item.id === "evidence-flowdoc-core-backend-readiness-matrix-2026-08-27")?.verificationSummary)
      .toContain("NO-GO for frontend implementation that assumes production Backend readiness");
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
      "evidence-flowdoc-product-terminology-foundation-2026-08-27",
      "evidence-flowdoc-core-backend-readiness-matrix-2026-08-27",
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
