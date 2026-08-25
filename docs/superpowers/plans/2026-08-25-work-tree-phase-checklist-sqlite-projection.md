# Work Tree Phase Checklist SQLite Projection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Project Control Work tree, Phase, Checklist, and generated SQLite projection flow while preserving file-first canonical records.

**Architecture:** JSON and Markdown remain canonical. The loader learns two new canonical record directories, semantic validation enforces Work/Phase/Checklist relationships, the JSON read model exposes execution context, and a disposable SQLite projection is generated from the same validated sources. The GUI stays read-only and displays the Work execution model without editing it.

**Tech Stack:** TypeScript 7, Node.js 24.15.0, `node:sqlite` `DatabaseSync`, Ajv 8, Vitest 4, React 19, Vite 8, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-25-work-tree-phase-checklist-design.md`

## Global Constraints

- Keep the Node tree and Work tree separate.
- Let Work form a topic/task tree before execution starts.
- Keep phases and checklists out of both trees.
- Make executable tasks explicit and measurable.
- Make evidence targets visible before implementation starts.
- Preserve file-first reviewability for humans and agents.
- Add SQLite as a generated query/index layer, not the first canonical store.
- Preserve existing V1 records while allowing staged migration.
- Do not build GUI editing.
- Do not infer Node `truthState` from Work completion, Phase completion, Checklist completion, or SQLite query results.
- Do not require every existing Work record to become a fully planned task in one migration.
- Do not make SQLite the canonical authoring surface in the first implementation.
- Do not add multi-agent scheduling, locking, or an event log in this design.
- Do not touch FlowDoc Core, Editor, or Backend product repositories in this plan.

---

## File Structure

- `src/model/types.ts`: Owns TypeScript record and read-model contracts for Work, Phase, Checklist, and indexed Work fields.
- `schemas/project-control.schema.json`: Owns canonical JSON shape validation for Work, Phase, and Checklist records.
- `tools/lib/discover.ts`: Owns canonical data directory discovery.
- `tools/lib/load-sources.ts`: Owns source loading, kind checks, schema validator selection, and loaded source grouping.
- `tools/lib/validate-semantics.ts`: Owns cross-record semantic validation.
- `tools/lib/build-read-model.ts`: Owns deterministic JSON read model and source digest generation.
- `tools/lib/build-sqlite-projection.ts`: New focused SQLite projection builder from a validated read model.
- `tools/generate.ts`: Owns publishing generated artifacts.
- `tools/check.ts`: Owns generated artifact verification.
- `tests/fixtures/project-source.ts`: Owns compact canonical record fixtures used by validation and generation tests.
- `tests/schema.test.ts`, `tests/load-sources.test.ts`, `tests/semantic-validation.test.ts`, `tests/generation.test.ts`, `tests/sqlite-projection.test.ts`: Own focused test coverage for the data pipeline.
- `data/work/`, `data/phases/`, `data/checklists/`: Own canonical execution records.
- `docs/domains/work-tree-operating-rules.md`: New agent-facing workflow contract.
- `data/documents/work-tree-operating-rules.json`, `data/nodes/project-control.json`, `docs/GLOSSARY.md`, `docs/GLOSSARY_TH.md`, `AGENTS.md`, `docs/domains/flowdoc-round-workflow.md`, `docs/domains/flowdoc-global-codex-guidance.md`, `README.md`: Own the human and agent documentation updates.
- `app/src/components/ControlRoom.tsx`, `app/src/styles/control-room.css`, `app/src/App.test.tsx`, `app/src/test/projectModel.ts`: Own the read-only GUI work/phase/checklist readout.

---

### Task 1: Add Canonical Phase and Checklist Record Support

**Files:**
- Modify: `src/model/types.ts`
- Modify: `schemas/project-control.schema.json`
- Modify: `tools/lib/discover.ts`
- Modify: `tools/lib/load-sources.ts`
- Modify: `tests/fixtures/project-source.ts`
- Modify: `tests/schema.test.ts`
- Modify: `tests/load-sources.test.ts`
- Modify: `app/src/test/projectModel.ts`

**Interfaces:**
- Produces: `WorkKind`, `PhaseState`, `ChecklistItemState`, `PhaseRecord`, `ChecklistRecord`, `IndexWork`.
- Produces: `LoadedProjectSources.phases` and `LoadedProjectSources.checklists`.
- Produces: canonical directories `data/phases` and `data/checklists`.
- Consumes: existing `ProjectRecord`, `LoadedRecord`, and Ajv schema selection flow.

- [ ] **Step 1: Write failing schema tests**

Update `tests/schema.test.ts` so the first test expects seven canonical record definitions and checks that execution state does not enter Node records.

```ts
expect(Object.keys(schema.$defs).sort()).toEqual([
  "checklist",
  "document",
  "evidence",
  "node",
  "phase",
  "repository",
  "work",
]);
expect(schema.$defs.phase.properties.phaseState.enum).toEqual([
  "queued",
  "in-progress",
  "blocked",
  "in-review",
  "done",
]);
expect(schema.$defs.checklist.properties.items.items.properties.state.enum).toEqual([
  "pending",
  "in-progress",
  "passed",
  "failed",
  "blocked",
  "risk",
  "unknown",
]);
expect(schema.$defs.node.properties).not.toHaveProperty("phaseState");
expect(schema.$defs.node.properties).not.toHaveProperty("items");
```

- [ ] **Step 2: Write failing loader tests**

Add a new test to `tests/load-sources.test.ts` using a fixture with one task, one phase, and one checklist.

```ts
it("discovers phase and checklist records as canonical execution sources", async () => {
  const root = await createProjectFixture({ valid: true, newContractTask: true });

  const loaded = await loadProjectSources(root);

  expect(loaded.records.map((entry) => entry.relativePath)).toEqual([
    "data/checklists/checklist-contract.json",
    "data/documents/doc-overview.json",
    "data/evidence/evidence-design.json",
    "data/nodes/flowdoc.json",
    "data/phases/phase-contract.json",
    "data/repositories/project-control.json",
    "data/work/pilot-task.json",
    "data/work/pilot.json",
  ]);
  expect(loaded.phases.map((entry) => entry.value.id)).toEqual(["phase-contract"]);
  expect(loaded.checklists.map((entry) => entry.value.id)).toEqual(["checklist-contract"]);
});
```

Run: `npm test -- --maxWorkers=1 tests/schema.test.ts tests/load-sources.test.ts`

Expected: FAIL because `phase`, `checklist`, `loaded.phases`, and `loaded.checklists` do not exist.

- [ ] **Step 3: Extend TypeScript model contracts**

Update `src/model/types.ts` with these exact public shapes.

```ts
export type WorkKind = "topic" | "task";
export type PhaseState = "queued" | "in-progress" | "blocked" | "in-review" | "done";
export type ChecklistItemState =
  | "pending"
  | "in-progress"
  | "passed"
  | "failed"
  | "blocked"
  | "risk"
  | "unknown";

export interface WorkRecord {
  kind: "work";
  id: string;
  title: string;
  nodeId: string;
  parentWorkId?: string;
  workKind?: WorkKind;
  repositoryIds: string[];
  workState: WorkState;
  summary: string;
  contextDocumentIds?: string[];
  activeRole?: string;
  expectedOutput?: string;
  riskSummary?: string;
  blockedBy?: string;
  unblockOwner?: string;
  requiredEvidence: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PhaseRecord {
  kind: "phase";
  id: string;
  workId: string;
  title: string;
  phaseState: PhaseState;
  order: number;
  repositoryIds: string[];
  activeRole: string;
  stopConditions: string[];
  verificationTarget: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistRecord {
  kind: "checklist";
  id: string;
  phaseId: string;
  title: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  state: ChecklistItemState;
  evidenceTarget: string;
  evidenceIds?: string[];
  verificationNote?: string;
}

export interface IndexWork extends WorkRecord {
  childWorkIds: string[];
  phaseIds: string[];
  workPathIds: string[];
}
```

Extend `ProjectRecord` with `PhaseRecord | ChecklistRecord` and change `ProjectReadModel.work` to `IndexWork[]` with new `phases: PhaseRecord[]` and `checklists: ChecklistRecord[]` arrays.

- [ ] **Step 4: Extend JSON schema**

Update `schemas/project-control.schema.json`:

```json
"oneOf": [
  { "$ref": "#/$defs/node" },
  { "$ref": "#/$defs/work" },
  { "$ref": "#/$defs/phase" },
  { "$ref": "#/$defs/checklist" },
  { "$ref": "#/$defs/document" },
  { "$ref": "#/$defs/repository" },
  { "$ref": "#/$defs/evidence" }
]
```

Add optional Work properties:

```json
"parentWorkId": { "$ref": "#/$defs/node/$defs/id" },
"workKind": { "enum": ["topic", "task"] },
"contextDocumentIds": {
  "type": "array",
  "items": { "$ref": "#/$defs/node/$defs/id" }
},
"activeRole": { "type": "string", "minLength": 1 },
"expectedOutput": { "type": "string", "minLength": 1 },
"riskSummary": { "type": "string", "minLength": 1 }
```

Add `phase` and `checklist` definitions matching the TypeScript interfaces. Use `minItems: 1` for `PhaseRecord.repositoryIds`, `PhaseRecord.stopConditions`, and `ChecklistRecord.items`.

- [ ] **Step 5: Extend discovery and loading**

Update `tools/lib/discover.ts`:

```ts
export const CANONICAL_RECORD_DIRECTORIES = [
  "checklists",
  "documents",
  "evidence",
  "nodes",
  "phases",
  "repositories",
  "work",
] as const;
```

Update `unexpectedJsonDiagnostic` hint to list all seven directories:

```ts
hint: "Keep JSON records directly in data/nodes, data/work, data/phases, data/checklists, data/documents, data/repositories, or data/evidence.",
```

Update `tools/lib/load-sources.ts` with `phase` and `checklist` expected kinds, schema definition names, loaded arrays, and type guards:

```ts
const expectedKinds: Record<CanonicalRecordDirectory, ProjectRecord["kind"]> = {
  checklists: "checklist",
  documents: "document",
  evidence: "evidence",
  nodes: "node",
  phases: "phase",
  repositories: "repository",
  work: "work",
};
```

- [ ] **Step 6: Extend fixtures and app test model defaults**

Update `tests/fixtures/project-source.ts` with `newContractTask?: boolean`. Always create `data/phases` and `data/checklists` directories. When `newContractTask` is true, write:

```ts
const taskWork = {
  kind: "work",
  id: "pilot-task",
  title: "Pilot Task",
  nodeId: "flowdoc",
  parentWorkId: "pilot",
  workKind: "task",
  repositoryIds: ["project-control"],
  workState: "in-progress",
  summary: "Pilot executable task.",
  contextDocumentIds: ["doc-overview"],
  activeRole: "planning-partner",
  expectedOutput: "A validated pilot task.",
  requiredEvidence: [],
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
};
const phase = {
  kind: "phase",
  id: "phase-contract",
  workId: "pilot-task",
  title: "Contract Phase",
  phaseState: "in-progress",
  order: 10,
  repositoryIds: ["project-control"],
  activeRole: "planning-partner",
  stopConditions: ["The pilot task contract is ambiguous."],
  verificationTarget: "The pilot task has a phase and checklist.",
  summary: "Define the pilot contract.",
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
};
const checklist = {
  kind: "checklist",
  id: "checklist-contract",
  phaseId: "phase-contract",
  title: "Contract Checklist",
  items: [{
    id: "define-contract",
    label: "Define the execution contract.",
    state: "pending",
    evidenceTarget: "A checklist item records the target before Evidence exists.",
  }],
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
};
```

Update `app/src/test/projectModel.ts` defaults:

```ts
work: [],
phases: [],
checklists: [],
```

- [ ] **Step 7: Run targeted checks**

Run: `npm test -- --maxWorkers=1 tests/schema.test.ts tests/load-sources.test.ts`

Expected: PASS.

Run: `npm run type-check`

Expected: PASS after model defaults and exported types are aligned.

- [ ] **Step 8: Commit Task 1**

```bash
git add src/model/types.ts schemas/project-control.schema.json tools/lib/discover.ts tools/lib/load-sources.ts tests/fixtures/project-source.ts tests/schema.test.ts tests/load-sources.test.ts app/src/test/projectModel.ts
git commit -m "feat: add phase and checklist record contracts"
```

---

### Task 2: Enforce Work, Phase, and Checklist Semantics

**Files:**
- Modify: `tools/lib/validate-semantics.ts`
- Modify: `tests/semantic-validation.test.ts`
- Modify: `tests/fixtures/project-source.ts`

**Interfaces:**
- Consumes: `LoadedProjectSources.work`, `LoadedProjectSources.phases`, `LoadedProjectSources.checklists`.
- Produces diagnostics: `MISSING_WORK`, `MISSING_WORK_PARENT`, `WORK_CYCLE`, `MISSING_DOCUMENT`, `TASK_MISSING_CONTEXT_DOCUMENT`, `TASK_MISSING_ACTIVE_ROLE`, `TASK_MISSING_EXPECTED_OUTPUT`, `TASK_WITHOUT_PHASE`, `MULTIPLE_ACTIVE_PHASES`, `MISSING_PHASE`, `CHECKLIST_ITEM_MISSING_EVIDENCE_TARGET`, `CHECKLIST_PASSED_WITHOUT_SUPPORT`.

- [ ] **Step 1: Write failing semantic tests**

Add cases to `tests/semantic-validation.test.ts`:

```ts
it.each([
  ["missing Work parent", { missingWorkParent: true }, "MISSING_WORK_PARENT"],
  ["Work hierarchy cycle", { workCycle: true }, "WORK_CYCLE"],
  ["task without context document", { taskMissingContextDocument: true }, "TASK_MISSING_CONTEXT_DOCUMENT"],
  ["task without active role", { taskMissingActiveRole: true }, "TASK_MISSING_ACTIVE_ROLE"],
  ["task without expected output", { taskMissingExpectedOutput: true }, "TASK_MISSING_EXPECTED_OUTPUT"],
  ["task without Phase", { taskWithoutPhase: true }, "TASK_WITHOUT_PHASE"],
  ["Phase with missing Work", { phaseMissingWork: true }, "MISSING_WORK"],
  ["two active Phases under one Work", { duplicateActivePhase: true }, "MULTIPLE_ACTIVE_PHASES"],
  ["Checklist with missing Phase", { checklistMissingPhase: true }, "MISSING_PHASE"],
  ["Checklist item without evidence target", { checklistMissingEvidenceTarget: true }, "CHECKLIST_ITEM_MISSING_EVIDENCE_TARGET"],
  ["passed Checklist item without support", { checklistPassedWithoutSupport: true }, "CHECKLIST_PASSED_WITHOUT_SUPPORT"],
] as const)("rejects %s", async (_name, mutation, code) => {
  const root = await createProjectFixture({ valid: true, newContractTask: true, ...mutation });

  await expect(validateProjectSemantics(await loadProjectSources(root))).rejects.toMatchObject({
    diagnostics: expect.arrayContaining([expect.objectContaining({ code })]),
  });
});
```

Add a truth-boundary check:

```ts
it("does not derive current Node truth from passed Checklist state", async () => {
  const root = await createProjectFixture({
    valid: true,
    newContractTask: true,
    truthState: "planned",
    checklistPassedWithVerificationNote: true,
  });

  const validated = await validateProjectSemantics(await loadProjectSources(root));

  expect(validated.nodes[0]?.value.truthState).toBe("planned");
  expect(validated.checklists[0]?.value.items[0]?.state).toBe("passed");
});
```

Run: `npm test -- --maxWorkers=1 tests/semantic-validation.test.ts`

Expected: FAIL because the new diagnostics do not exist.

- [ ] **Step 2: Add fixture mutations**

Extend `ProjectFixtureOptions` with the mutation names from Step 1. Apply them when writing `taskWork`, `phase`, and `checklist`:

```ts
if (options.missingWorkParent) taskWork.parentWorkId = "missing-work";
if (options.workCycle) {
  work.parentWorkId = "pilot-task";
  taskWork.parentWorkId = "pilot";
}
if (options.taskMissingContextDocument) delete taskWork.contextDocumentIds;
if (options.taskMissingActiveRole) delete taskWork.activeRole;
if (options.taskMissingExpectedOutput) delete taskWork.expectedOutput;
if (options.phaseMissingWork) phase.workId = "missing-work";
if (options.checklistMissingPhase) checklist.phaseId = "missing-phase";
if (options.checklistMissingEvidenceTarget) delete checklist.items[0].evidenceTarget;
if (options.checklistPassedWithoutSupport) checklist.items[0].state = "passed";
if (options.checklistPassedWithVerificationNote) {
  checklist.items[0].state = "passed";
  checklist.items[0].verificationNote = "Verified by read-only fixture review.";
}
```

When `taskWithoutPhase` is true, do not write `phase-contract.json` or `checklist-contract.json`. When `duplicateActivePhase` is true, write a second phase with `id: "phase-contract-duplicate"`, `workId: "pilot-task"`, and `phaseState: "in-progress"`.

- [ ] **Step 3: Implement Work tree validation**

In `tools/lib/validate-semantics.ts`, add `checkWorkTree` and call it after `checkWorkReferences`.

```ts
function checkWorkTree(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const workById = recordMap(loaded.work);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const work of loaded.work) {
    const parentWorkId = work.value.parentWorkId;
    if (parentWorkId !== undefined && !workById.has(parentWorkId)) {
      diagnostics.push(recordDiagnostic(
        "MISSING_WORK_PARENT",
        `Parent Work "${parentWorkId}" does not exist.`,
        work,
        "Set parentWorkId to an existing Work ID or remove it for a root Work item.",
      ));
    }
  }

  const reportedCycles = new Set<string>();
  for (const startId of [...workById.keys()].sort(compareCodeUnits)) {
    const positions = new Map<string, number>();
    const chain: string[] = [];
    let currentId: string | undefined = startId;
    while (currentId !== undefined) {
      const position = positions.get(currentId);
      if (position !== undefined) {
        const cycle = canonicalCycle(chain.slice(position));
        const cycleText = [...cycle, cycle[0] ?? ""].join(" -> ");
        if (!reportedCycles.has(cycleText)) {
          reportedCycles.add(cycleText);
          diagnostics.push(recordDiagnostic(
            "WORK_CYCLE",
            `Work hierarchy contains a cycle: ${cycleText}.`,
            workById.get(cycle[0] ?? startId) ?? workById.get(startId)!,
            "Set parentWorkId values so every Work item eventually reaches a root Work item.",
          ));
        }
        break;
      }
      const current = workById.get(currentId);
      if (current === undefined) break;
      positions.set(currentId, chain.length);
      chain.push(currentId);
      currentId = current.value.parentWorkId;
    }
  }

  return diagnostics;
}
```

- [ ] **Step 4: Implement task contract validation**

Add `checkTaskContracts` and call it after `checkWorkTree`.

```ts
function checkTaskContracts(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const documents = recordMap(loaded.documents);
  const phaseCountByWorkId = new Map<string, number>();
  for (const phase of loaded.phases) {
    phaseCountByWorkId.set(phase.value.workId, (phaseCountByWorkId.get(phase.value.workId) ?? 0) + 1);
  }

  return loaded.work.flatMap((work) => {
    if (work.value.workKind !== "task") return [];
    const diagnostics: ProjectDiagnostic[] = [];
    const contextDocumentIds = work.value.contextDocumentIds ?? [];
    if (contextDocumentIds.length === 0) {
      diagnostics.push(recordDiagnostic(
        "TASK_MISSING_CONTEXT_DOCUMENT",
        "A task Work record must list at least one context document.",
        work,
        "Add contextDocumentIds with existing Document IDs before execution starts.",
      ));
    }
    diagnostics.push(...missingReferences(work, contextDocumentIds, documents, "MISSING_DOCUMENT", "Document"));
    if (work.value.activeRole === undefined) {
      diagnostics.push(recordDiagnostic("TASK_MISSING_ACTIVE_ROLE", "A task Work record must declare activeRole.", work, "Set activeRole to the current FlowDoc role for this task."));
    }
    if (work.value.expectedOutput === undefined) {
      diagnostics.push(recordDiagnostic("TASK_MISSING_EXPECTED_OUTPUT", "A task Work record must declare expectedOutput.", work, "Set expectedOutput to the bounded deliverable for this task."));
    }
    if ((phaseCountByWorkId.get(work.value.id) ?? 0) === 0) {
      diagnostics.push(recordDiagnostic("TASK_WITHOUT_PHASE", "A task Work record must have at least one Phase.", work, "Add a Phase record with workId set to this task ID."));
    }
    return diagnostics;
  });
}
```

- [ ] **Step 5: Implement Phase validation**

Add `checkPhaseReferences` and `checkSingleActivePhase`.

```ts
function checkPhaseReferences(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const work = recordMap(loaded.work);
  const repositories = recordMap(loaded.repositories);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const phase of loaded.phases) {
    if (!work.has(phase.value.workId)) {
      diagnostics.push(recordDiagnostic("MISSING_WORK", `Work "${phase.value.workId}" does not exist.`, phase, "Set workId to an existing Work ID."));
    }
    diagnostics.push(...missingReferences(phase, phase.value.repositoryIds, repositories, "MISSING_REPOSITORY", "Repository"));
  }
  return diagnostics;
}

function checkSingleActivePhase(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const activeByWorkId = new Map<string, LoadedRecord[]>();
  for (const phase of loaded.phases) {
    if (phase.value.phaseState !== "in-progress") continue;
    const phases = activeByWorkId.get(phase.value.workId) ?? [];
    phases.push(phase);
    activeByWorkId.set(phase.value.workId, phases);
  }
  return [...activeByWorkId.values()].flatMap((phases) =>
    phases.length <= 1 ? [] : phases.map((phase) =>
      recordDiagnostic("MULTIPLE_ACTIVE_PHASES", `Work "${phase.value.workId}" has more than one in-progress Phase.`, phase, "Keep only one in-progress Phase per Work record."),
    ),
  );
}
```

- [ ] **Step 6: Implement Checklist validation**

Add `checkChecklistReferences`.

```ts
function checkChecklistReferences(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const phases = recordMap(loaded.phases);
  const evidence = recordMap(loaded.evidence);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const checklist of loaded.checklists) {
    if (!phases.has(checklist.value.phaseId)) {
      diagnostics.push(recordDiagnostic("MISSING_PHASE", `Phase "${checklist.value.phaseId}" does not exist.`, checklist, "Set phaseId to an existing Phase ID."));
    }
    for (const item of checklist.value.items) {
      if (item.evidenceTarget.trim().length === 0) {
        diagnostics.push(recordDiagnostic("CHECKLIST_ITEM_MISSING_EVIDENCE_TARGET", `Checklist item "${item.id}" must describe an evidence target.`, checklist, "Add evidenceTarget text before the item can guide execution."));
      }
      diagnostics.push(...missingReferences(checklist, item.evidenceIds ?? [], evidence, "MISSING_EVIDENCE", "Evidence"));
      if (item.state === "passed" && (item.evidenceIds ?? []).length === 0 && item.verificationNote === undefined) {
        diagnostics.push(recordDiagnostic("CHECKLIST_PASSED_WITHOUT_SUPPORT", `Checklist item "${item.id}" is passed without Evidence or verificationNote.`, checklist, "Add an Evidence ID or a bounded verificationNote."));
      }
    }
  }
  return diagnostics;
}
```

- [ ] **Step 7: Run targeted checks**

Run: `npm test -- --maxWorkers=1 tests/semantic-validation.test.ts`

Expected: PASS.

Run: `npm run type-check`

Expected: PASS.

- [ ] **Step 8: Commit Task 2**

```bash
git add tools/lib/validate-semantics.ts tests/semantic-validation.test.ts tests/fixtures/project-source.ts
git commit -m "feat: validate work phase checklist semantics"
```

---

### Task 3: Extend the Generated JSON Read Model

**Files:**
- Modify: `tools/lib/build-read-model.ts`
- Modify: `tests/generation.test.ts`
- Modify: `tests/project-roadmap-work-queue.test.ts`
- Modify: `generated/project-index.json`

**Interfaces:**
- Consumes: validated Work, Phase, and Checklist sources.
- Produces: `ProjectReadModel.work` as `IndexWork[]`.
- Produces: `ProjectReadModel.phases` and `ProjectReadModel.checklists`.
- Produces: deterministic `childWorkIds`, `phaseIds`, and `workPathIds` on each Work item.

- [ ] **Step 1: Write failing generation tests**

Update `tests/generation.test.ts` with a new fixture-backed test.

```ts
it("indexes Work tree, Phase, and Checklist records without changing Node truth", async () => {
  const root = await createProjectFixture({ valid: true, newContractTask: true });
  const model = JSON.parse(await generateToString(root));

  expect(model.work.find((work: { id: string }) => work.id === "pilot")).toMatchObject({
    id: "pilot",
    childWorkIds: ["pilot-task"],
    phaseIds: [],
    workPathIds: ["pilot"],
  });
  expect(model.work.find((work: { id: string }) => work.id === "pilot-task")).toMatchObject({
    id: "pilot-task",
    parentWorkId: "pilot",
    workKind: "task",
    childWorkIds: [],
    phaseIds: ["phase-contract"],
    workPathIds: ["pilot", "pilot-task"],
  });
  expect(model.phases.map((phase: { id: string }) => phase.id)).toEqual(["phase-contract"]);
  expect(model.checklists.map((checklist: { id: string }) => checklist.id)).toEqual(["checklist-contract"]);
  expect(model.nodes[0].truthState).toBe("planned");
});
```

Update `tests/project-roadmap-work-queue.test.ts` so legacy records are checked with `expect.objectContaining` and the indexed fields are asserted separately:

```ts
for (const work of model.work.filter((item) => expectedWorkIds.includes(item.id))) {
  expect(work.workKind).toBeUndefined();
  expect(work.phaseIds).toEqual([]);
  expect(work.workPathIds).toEqual([work.id]);
}
```

Run: `npm test -- --maxWorkers=1 tests/generation.test.ts tests/project-roadmap-work-queue.test.ts`

Expected: FAIL because the read model has no Phase/Checklist arrays or indexed Work fields.

- [ ] **Step 2: Implement indexed Work construction**

Update `tools/lib/build-read-model.ts`:

```ts
const workValues = sortById(validated.work).map(({ value }) => ({ ...value }));
const phases = sortById(validated.phases).map(({ value }) => ({ ...value }));
const checklists = sortById(validated.checklists).map(({ value }) => ({ ...value }));
const childWorkIdsByParentId = groupIds(workValues, (work) => work.parentWorkId);
const phaseIdsByWorkId = groupIds(phases, (phase) => phase.workId);
const indexedWork = workValues.map((work) => ({
  ...work,
  childWorkIds: childWorkIdsByParentId.get(work.id) ?? [],
  phaseIds: phaseIdsByWorkId.get(work.id) ?? [],
  workPathIds: collectWorkPathIds(work, workValues),
}));
```

Add helpers:

```ts
function groupIds<T extends { id: string }>(
  values: T[],
  readParentId: (value: T) => string | undefined,
): Map<string, string[]> {
  const grouped = new Map<string, string[]>();
  for (const value of values) {
    const parentId = readParentId(value);
    if (parentId === undefined) continue;
    const ids = grouped.get(parentId) ?? [];
    ids.push(value.id);
    grouped.set(parentId, ids.sort(compareCodeUnits));
  }
  return grouped;
}

function collectWorkPathIds(work: WorkRecord, workValues: WorkRecord[]): string[] {
  const byId = new Map(workValues.map((item) => [item.id, item]));
  const path: string[] = [];
  let current: WorkRecord | undefined = work;
  while (current !== undefined) {
    path.unshift(current.id);
    current = current.parentWorkId === undefined ? undefined : byId.get(current.parentWorkId);
  }
  return path;
}
```

Return `work: indexedWork`, `phases`, and `checklists` from the read model.

- [ ] **Step 3: Include new sources in digest**

`calculateSourceDigest` already consumes `validated.records`. Confirm with this assertion in the new generation test:

```ts
const first = JSON.parse(await generateToString(root));
await writeFile(join(root, "data", "phases", "phase-contract.json"), JSON.stringify({
  ...first.phases[0],
  summary: "Changed phase summary.",
}));
const second = JSON.parse(await generateToString(root));
expect(second.sourceDigest).not.toBe(first.sourceDigest);
```

- [ ] **Step 4: Regenerate committed JSON index**

Run: `npm run generate`

Expected: `generated/project-index.json` is updated and `generated/project-diagnostics.json` is absent.

- [ ] **Step 5: Run targeted checks**

Run: `npm test -- --maxWorkers=1 tests/generation.test.ts tests/project-roadmap-work-queue.test.ts`

Expected: PASS.

Run: `npm run check:data`

Expected: PASS.

- [ ] **Step 6: Commit Task 3**

```bash
git add tools/lib/build-read-model.ts tests/generation.test.ts tests/project-roadmap-work-queue.test.ts generated/project-index.json
git commit -m "feat: index work execution records"
```

---

### Task 4: Add Generated SQLite Projection

**Files:**
- Create: `tools/lib/build-sqlite-projection.ts`
- Create: `tests/sqlite-projection.test.ts`
- Modify: `tools/generate.ts`
- Modify: `tools/check.ts`
- Modify: `.gitignore`
- Modify: `package.json`

**Interfaces:**
- Produces: `generateProjectSqlite(rootDir: string, outputPath?: string): Promise<void>`.
- Produces: `checkSqliteProjection(rootDir: string): Promise<void>`.
- Consumes: `buildProjectReadModel(await loadAndValidateProject(rootDir))`.
- Writes: ignored local file `generated/project-control.sqlite`.

- [ ] **Step 1: Write failing SQLite projection tests**

Create `tests/sqlite-projection.test.ts`:

```ts
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { generateProjectSqlite, checkSqliteProjection } from "../tools/lib/build-sqlite-projection.js";
import { createProjectFixture } from "./fixtures/project-source.js";

describe("SQLite projection", () => {
  it("projects Work, Phase, Checklist, and source digest into SQLite", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const outputPath = join(await mkdtemp(join(tmpdir(), "flowdoc-sqlite-")), "project-control.sqlite");

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
      expect(db.prepare("select schema_version from projection_meta").get()).toEqual({ schema_version: 1 });
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
```

Run: `npm test -- --maxWorkers=1 tests/sqlite-projection.test.ts`

Expected: FAIL because the SQLite projection builder does not exist.

- [ ] **Step 2: Implement SQLite schema and inserts**

Create `tools/lib/build-sqlite-projection.ts`:

```ts
import { mkdtemp, mkdir, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { buildProjectReadModel } from "./build-read-model.js";
import { loadAndValidateProject } from "./validate-semantics.js";

export async function generateProjectSqlite(rootDir: string, outputPath = join(rootDir, "generated", "project-control.sqlite")): Promise<void> {
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
```

In `writeProjection`, create the tables named in the spec and insert from the read model. Use snake_case column names:

```ts
db.exec(`
  create table projection_meta(schema_version integer not null, source_digest text not null, generated_at text not null);
  create table work(id text primary key, parent_work_id text, node_id text not null, work_kind text, work_state text not null, title text not null, summary text not null);
  create table phases(id text primary key, work_id text not null, phase_state text not null, phase_order real not null, title text not null, verification_target text not null, summary text not null);
  create table checklists(id text primary key, phase_id text not null, title text not null);
  create table checklist_items(checklist_id text not null, id text not null, item_order integer not null, label text not null, state text not null, evidence_target text not null, verification_note text, primary key(checklist_id, id));
  create table work_context_documents(work_id text not null, document_id text not null, primary key(work_id, document_id));
  create table work_repositories(work_id text not null, repository_id text not null, primary key(work_id, repository_id));
  create table phase_repositories(phase_id text not null, repository_id text not null, primary key(phase_id, repository_id));
  create table work_required_evidence(work_id text not null, evidence_id text not null, primary key(work_id, evidence_id));
  create table checklist_item_evidence(checklist_id text not null, item_id text not null, evidence_id text not null, primary key(checklist_id, item_id, evidence_id));
  create table diagnostics(code text not null, message text not null, file text not null, record_id text, hint text not null);
`);
```

Also create compact `nodes`, `documents`, `repositories`, `evidence`, and `work_closure` tables so query targets can join across model areas.

- [ ] **Step 3: Wire generate and check commands**

Update `tools/generate.ts`:

```ts
import { generateProjectSqlite } from "./lib/build-sqlite-projection.js";
```

After JSON generation succeeds in `generateProjectIndex`, call:

```ts
await generateProjectSqlite(rootDir, join(dirname(indexPath), "project-control.sqlite"));
```

Update `tools/check.ts`:

```ts
import { checkSqliteProjection } from "./lib/build-sqlite-projection.js";
```

After `validateStoredCoreMigration(rootDir)` passes, call:

```ts
await checkSqliteProjection(rootDir);
```

Update `package.json` scripts:

```json
"generate:sqlite": "tsx -e \"import('./tools/lib/build-sqlite-projection.ts').then((m) => m.generateProjectSqlite(process.cwd()))\""
```

- [ ] **Step 4: Ignore generated SQLite**

Update `.gitignore`:

```text
generated/*.sqlite
```

- [ ] **Step 5: Run targeted checks**

Run: `npm test -- --maxWorkers=1 tests/sqlite-projection.test.ts`

Expected: PASS.

Run: `npm run generate`

Expected: `generated/project-control.sqlite` exists locally and is ignored by git.

Run: `git status --short --ignored generated`

Expected: `generated/project-control.sqlite` appears as ignored, while `generated/project-index.json` remains tracked.

Run: `npm run check:data`

Expected: PASS.

- [ ] **Step 6: Commit Task 4**

```bash
git add tools/lib/build-sqlite-projection.ts tests/sqlite-projection.test.ts tools/generate.ts tools/check.ts .gitignore package.json package-lock.json generated/project-index.json
git commit -m "feat: generate sqlite project projection"
```

---

### Task 5: Add First Executable Project Control Work Path and Agent Rules

**Files:**
- Create: `data/work/project-control-hardening.json`
- Create: `data/work/work-tree-phase-checklist-sqlite-contract.json`
- Create: `data/phases/phase-work-tree-contract-validation.json`
- Create: `data/checklists/checklist-work-tree-contract-validation.json`
- Create: `docs/domains/work-tree-operating-rules.md`
- Create: `data/documents/work-tree-operating-rules.json`
- Modify: `data/nodes/project-control.json`
- Modify: `docs/GLOSSARY.md`
- Modify: `docs/GLOSSARY_TH.md`
- Modify: `AGENTS.md`
- Modify: `docs/domains/flowdoc-round-workflow.md`
- Modify: `docs/domains/flowdoc-global-codex-guidance.md`
- Modify: `README.md`
- Modify: `tests/project-roadmap-work-queue.test.ts`
- Modify: `tests/seed-project.test.ts`
- Modify: `generated/project-index.json`

**Interfaces:**
- Consumes: Work/Phase/Checklist schema and validation from Tasks 1-4.
- Produces: one topic Work, one executable task Work, one Phase, one Checklist, and one agent-facing operating document.

- [ ] **Step 1: Write failing canonical data tests**

Update `tests/project-roadmap-work-queue.test.ts` to expect the new Work path:

```ts
expect(model.work.find((item) => item.id === "project-control-hardening")).toMatchObject({
  workKind: "topic",
  parentWorkId: "flowdoc-product-development-resumption",
  nodeId: "project-control",
  childWorkIds: ["work-tree-phase-checklist-sqlite-contract"],
});
expect(model.work.find((item) => item.id === "work-tree-phase-checklist-sqlite-contract")).toMatchObject({
  workKind: "task",
  parentWorkId: "project-control-hardening",
  nodeId: "project-control",
  phaseIds: ["phase-work-tree-contract-validation"],
  workPathIds: [
    "flowdoc-product-development-resumption",
    "project-control-hardening",
    "work-tree-phase-checklist-sqlite-contract",
  ],
});
expect(model.phases.find((item) => item.id === "phase-work-tree-contract-validation")).toMatchObject({
  workId: "work-tree-phase-checklist-sqlite-contract",
  phaseState: "in-progress",
});
expect(model.checklists.find((item) => item.id === "checklist-work-tree-contract-validation")?.items)
  .toHaveLength(5);
```

Update `tests/seed-project.test.ts` with a document registration assertion:

```ts
const workTreeRules = documents.get("doc-work-tree-operating-rules");
expect(workTreeRules).toMatchObject({
  path: "docs/domains/work-tree-operating-rules.md",
  role: "contract",
  lifecycle: "active",
});
expect(normalize(workTreeRules?.content)).toContain("Work tree");
expect(normalize(workTreeRules?.content)).toContain("BLOCKER: FlowDoc Project Control unavailable or unresolved.");
```

Run: `npm test -- --maxWorkers=1 tests/project-roadmap-work-queue.test.ts tests/seed-project.test.ts`

Expected: FAIL because the records and document do not exist.

- [ ] **Step 2: Add Work topic and task records**

Create `data/work/project-control-hardening.json`:

```json
{
  "kind": "work",
  "id": "project-control-hardening",
  "title": "Project Control Hardening",
  "nodeId": "project-control",
  "parentWorkId": "flowdoc-product-development-resumption",
  "workKind": "topic",
  "repositoryIds": ["repo-project-control"],
  "workState": "in-progress",
  "summary": "Harden Project Control so future FlowDoc rooms can identify work position, execution phase, checklist target, and evidence target before editing product repositories.",
  "contextDocumentIds": ["doc-project-control-agent-onboarding", "doc-flowdoc-round-workflow", "doc-project-control-design"],
  "riskSummary": "The Work execution model must not merge with Node truth or make SQLite canonical too early.",
  "requiredEvidence": [],
  "createdAt": "2026-08-25T00:00:00.000Z",
  "updatedAt": "2026-08-25T00:00:00.000Z"
}
```

Create `data/work/work-tree-phase-checklist-sqlite-contract.json`:

```json
{
  "kind": "work",
  "id": "work-tree-phase-checklist-sqlite-contract",
  "title": "Work Tree Phase Checklist SQLite Contract",
  "nodeId": "project-control",
  "parentWorkId": "project-control-hardening",
  "workKind": "task",
  "repositoryIds": ["repo-project-control"],
  "workState": "in-progress",
  "summary": "Implement the approved Project Control contract for Work tree, Phase, Checklist, agent workflow, and generated SQLite projection.",
  "contextDocumentIds": ["doc-project-control-agent-onboarding", "doc-flowdoc-round-workflow", "doc-flowdoc-role-catalog", "doc-agent-skill-operating-model", "doc-work-tree-operating-rules"],
  "activeRole": "planning-partner",
  "expectedOutput": "Project Control can show one executable Work path with Phase and Checklist targets while preserving JSON/Markdown authority.",
  "riskSummary": "Checklist progress must remain execution state and must not promote Project Control or product Nodes to current.",
  "requiredEvidence": [],
  "createdAt": "2026-08-25T00:00:00.000Z",
  "updatedAt": "2026-08-25T00:00:00.000Z"
}
```

- [ ] **Step 3: Add Phase and Checklist records**

Create `data/phases/phase-work-tree-contract-validation.json`:

```json
{
  "kind": "phase",
  "id": "phase-work-tree-contract-validation",
  "workId": "work-tree-phase-checklist-sqlite-contract",
  "title": "Define Contract and Validation Targets",
  "phaseState": "in-progress",
  "order": 10,
  "repositoryIds": ["repo-project-control"],
  "activeRole": "planning-partner",
  "stopConditions": [
    "Node tree and Work tree semantics conflict.",
    "SQLite becomes the canonical authoring surface.",
    "A checklist item claims product truth without Evidence."
  ],
  "verificationTarget": "Project Control records can identify Work hierarchy, context documents, current Phase, Checklist targets, and SQLite projection status without promoting Node truth.",
  "summary": "Define and validate the first execution contract for Project Control itself.",
  "createdAt": "2026-08-25T00:00:00.000Z",
  "updatedAt": "2026-08-25T00:00:00.000Z"
}
```

Create `data/checklists/checklist-work-tree-contract-validation.json` with five pending items:

```json
{
  "kind": "checklist",
  "id": "checklist-work-tree-contract-validation",
  "phaseId": "phase-work-tree-contract-validation",
  "title": "Work Tree Contract Validation Checklist",
  "items": [
    {
      "id": "define-glossary",
      "label": "Define Work Tree, Phase, Checklist, Context Document, and Evidence Target without conflicting with Node and Truth State.",
      "state": "pending",
      "evidenceTarget": "Glossary and operating rules describe the terms with separate responsibilities."
    },
    {
      "id": "schema-contract",
      "label": "Add schema support for Work, Phase, and Checklist records.",
      "state": "pending",
      "evidenceTarget": "Schema and loader tests reject malformed Phase and Checklist records."
    },
    {
      "id": "semantic-validation",
      "label": "Add semantic validation for references, cycles, active phase conflicts, and missing checklist targets.",
      "state": "pending",
      "evidenceTarget": "Semantic validation tests fail on missing or conflicting Work, Phase, and Checklist relationships."
    },
    {
      "id": "sqlite-projection",
      "label": "Generate a SQLite projection without making SQLite canonical.",
      "state": "pending",
      "evidenceTarget": "SQLite projection tests verify table content and .gitignore keeps the database untracked."
    },
    {
      "id": "read-only-ui",
      "label": "Expose Work task, Phase, and Checklist status in the read-only control room.",
      "state": "pending",
      "evidenceTarget": "Component tests show task phase and checklist targets without providing GUI editing."
    }
  ],
  "createdAt": "2026-08-25T00:00:00.000Z",
  "updatedAt": "2026-08-25T00:00:00.000Z"
}
```

- [ ] **Step 4: Add operating rules document and register it**

Create `docs/domains/work-tree-operating-rules.md` with these headings:

```md
# Work Tree Operating Rules

## Purpose

Project Control separates durable system knowledge from work execution. New FlowDoc rooms use these rules to identify the current Work path, Phase, Checklist target, and Evidence target before editing product repositories.

## Required Reading Order

1. `AGENTS.md`
2. `docs/domains/flowdoc-system-map.md`
3. `docs/domains/document-map-operating-rules.md`
4. `docs/domains/flowdoc-role-catalog.md`
5. `docs/domains/flowdoc-round-workflow.md`
6. `docs/domains/work-tree-operating-rules.md`

## Resolution Gate

Before execution, identify one Work item, one owner repository or bounded repository set, one active role, one current Phase, one Checklist item or Checklist group, and one Evidence target. If Project Control cannot identify owner repository and evidence target, stop with:

```text
BLOCKER: FlowDoc Project Control unavailable or unresolved.
```

## Truth Boundary

Work, Phase, Checklist, and SQLite projection state do not establish Node truth. Durable `current` claims still require Evidence records or repository-owned verification.

## Handoff

End with PASS, FAIL/BLOCKER, RISK, UNKNOWN, Work ID, Phase ID, Checklist item IDs, files changed, tests run, evidence or map updates, intentionally not changed, and next recommended work.
```

Create `data/documents/work-tree-operating-rules.json`:

```json
{
  "kind": "document",
  "id": "doc-work-tree-operating-rules",
  "title": "Work Tree Operating Rules",
  "path": "docs/domains/work-tree-operating-rules.md",
  "nodeIds": ["project-control"],
  "role": "contract",
  "authority": "Agent-facing Project Control contract for resolving Work tree, Phase, Checklist, and Evidence target before execution.",
  "lifecycle": "active",
  "repositoryRefs": []
}
```

Append `doc-work-tree-operating-rules` to `data/nodes/project-control.json.documentIds` after `doc-flowdoc-round-workflow`.

- [ ] **Step 5: Update glossary and entrypoint docs**

Update `docs/GLOSSARY.md` with sections `Work Tree`, `Phase`, `Checklist`, `Context Document`, and `Evidence Target`. Update `docs/GLOSSARY_TH.md` with matching Thai explanations.

Update `AGENTS.md` reading order so `docs/domains/work-tree-operating-rules.md` appears after `docs/domains/flowdoc-round-workflow.md`.

Update `docs/domains/flowdoc-round-workflow.md` to mention Work path, Phase, Checklist, and Evidence target in Round intake and Handoff.

Update `docs/domains/flowdoc-global-codex-guidance.md` to mention Work path, Phase, Checklist target, and Evidence target before owner repo editing.

Update `README.md` source-of-truth list with:

```md
- `data/phases/` and `data/checklists/` — execution gates for Work tasks; these do not establish Node truth.
- `generated/project-control.sqlite` — ignored local SQLite projection generated from canonical sources.
```

- [ ] **Step 6: Regenerate and run targeted checks**

Run: `npm run generate`

Expected: `generated/project-index.json` updates and local ignored `generated/project-control.sqlite` updates.

Run: `npm test -- --maxWorkers=1 tests/project-roadmap-work-queue.test.ts tests/seed-project.test.ts`

Expected: PASS.

Run: `npm run check:data`

Expected: PASS.

- [ ] **Step 7: Commit Task 5**

```bash
git add data/work/project-control-hardening.json data/work/work-tree-phase-checklist-sqlite-contract.json data/phases/phase-work-tree-contract-validation.json data/checklists/checklist-work-tree-contract-validation.json docs/domains/work-tree-operating-rules.md data/documents/work-tree-operating-rules.json data/nodes/project-control.json docs/GLOSSARY.md docs/GLOSSARY_TH.md AGENTS.md docs/domains/flowdoc-round-workflow.md docs/domains/flowdoc-global-codex-guidance.md README.md tests/project-roadmap-work-queue.test.ts tests/seed-project.test.ts generated/project-index.json
git commit -m "docs: add work tree operating contract"
```

---

### Task 6: Show Work Execution Context in the Read-Only GUI

**Files:**
- Modify: `app/src/components/ControlRoom.tsx`
- Modify: `app/src/styles/control-room.css`
- Modify: `app/src/App.test.tsx`
- Modify: `app/src/test/projectModel.ts`

**Interfaces:**
- Consumes: `ProjectReadModel.work`, `ProjectReadModel.phases`, `ProjectReadModel.checklists`.
- Produces: read-only Work hierarchy with topic/task distinction, Phase status, Checklist count, and missing-target/passed-without-support risk text.

- [ ] **Step 1: Write failing GUI tests**

Add an App test that injects one topic, one task, one phase, and one checklist:

```ts
it("shows task phase and checklist context without GUI editing", () => {
  const executionModel = makeProjectReadModel({
    rootNodeIds: ["flowdoc"],
    nodes: [appNode("flowdoc", "FlowDoc", null, [], ["project-control-hardening", "work-tree-phase-checklist-sqlite-contract"])],
    work: [
      {
        ...appWork("project-control-hardening", "Project Control Hardening", "flowdoc", "in-progress", "Harden Project Control."),
        workKind: "topic",
        childWorkIds: ["work-tree-phase-checklist-sqlite-contract"],
        phaseIds: [],
        workPathIds: ["project-control-hardening"],
      },
      {
        ...appWork("work-tree-phase-checklist-sqlite-contract", "Work Tree Contract", "flowdoc", "in-progress", "Implement execution contract."),
        parentWorkId: "project-control-hardening",
        workKind: "task",
        activeRole: "planning-partner",
        expectedOutput: "Readable execution contract.",
        contextDocumentIds: ["doc-work-tree-operating-rules"],
        childWorkIds: [],
        phaseIds: ["phase-contract"],
        workPathIds: ["project-control-hardening", "work-tree-phase-checklist-sqlite-contract"],
      },
    ],
    phases: [{
      kind: "phase",
      id: "phase-contract",
      workId: "work-tree-phase-checklist-sqlite-contract",
      title: "Define Contract",
      phaseState: "in-progress",
      order: 10,
      repositoryIds: ["project-control"],
      activeRole: "planning-partner",
      stopConditions: ["Contract conflict."],
      verificationTarget: "The task has visible phase context.",
      summary: "Define contract.",
      createdAt: "2026-08-25T00:00:00.000Z",
      updatedAt: "2026-08-25T00:00:00.000Z",
    }],
    checklists: [{
      kind: "checklist",
      id: "checklist-contract",
      phaseId: "phase-contract",
      title: "Contract Checklist",
      items: [{
        id: "define-contract",
        label: "Define contract.",
        state: "pending",
        evidenceTarget: "Evidence target is visible.",
      }],
      createdAt: "2026-08-25T00:00:00.000Z",
      updatedAt: "2026-08-25T00:00:00.000Z",
    }],
  });

  render(<App initialModel={executionModel} />);

  const workTree = screen.getByRole("region", { name: "Work tree" });
  expect(within(workTree).getByText("Project Control Hardening")).toBeVisible();
  expect(within(workTree).getByText("Topic")).toBeVisible();
  expect(within(workTree).getByText("Work Tree Contract")).toBeVisible();
  expect(within(workTree).getByText("Task")).toBeVisible();
  expect(within(workTree).getByText("Define Contract")).toBeVisible();
  expect(within(workTree).getByText("1 checklist item")).toBeVisible();
  expect(within(workTree).queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
});
```

Run: `npm test -- --maxWorkers=1 app/src/App.test.tsx`

Expected: FAIL because the GUI does not render Phase or Checklist context.

- [ ] **Step 2: Build Work execution view data**

In `ControlRoom.tsx`, add maps in `buildControlRoomView`:

```ts
const workById = new Map(model.work.map((work) => [work.id, work]));
const phasesByWorkId = groupRecords(model.phases, (phase) => phase.workId);
const checklistsByPhaseId = groupRecords(model.checklists, (checklist) => checklist.phaseId);
const branchWorkTree = buildBranchWorkTree(branchWork, workById);
```

Add helpers:

```ts
function groupRecords<T>(records: T[], readKey: (record: T) => string): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const record of records) {
    const key = readKey(record);
    const items = grouped.get(key) ?? [];
    items.push(record);
    grouped.set(key, items);
  }
  return grouped;
}

function buildBranchWorkTree(work: WorkRecord[], workById: Map<string, WorkRecord>): WorkRecord[] {
  const branchIds = new Set(work.map((item) => item.id));
  return work
    .filter((item) => item.parentWorkId === undefined || !branchIds.has(item.parentWorkId) || !workById.has(item.parentWorkId))
    .sort(compareWork);
}
```

- [ ] **Step 3: Render nested Work cards with Phase summary**

Change `WorkTree` so it renders root Work records and recursively renders children from `childWorkIds`. Pass `phasesByWorkId`, `checklistsByPhaseId`, and `workById` into `WorkCard`.

Inside `WorkCard`, show:

```tsx
<span className="control-room__work-kind">
  {work.workKind === "task" ? "Task" : "Topic"}
</span>
```

For each phase:

```tsx
<section className="control-room__phase" aria-label={`${phase.title} phase`}>
  <h5>{phase.title}</h5>
  <p>{phase.summary}</p>
  <span>{phase.phaseState}</span>
  <span>{checklistItemCount} {checklistItemCount === 1 ? "checklist item" : "checklist items"}</span>
</section>
```

Keep existing fallback checklist lines for legacy Work records without phases.

- [ ] **Step 4: Add risk labels for invalid checklist visibility**

Add a pure helper:

```ts
function checklistIssueLabel(checklists: ChecklistRecord[]): string | null {
  for (const checklist of checklists) {
    for (const item of checklist.items) {
      if (item.evidenceTarget.trim().length === 0) return "Evidence target missing";
      if (item.state === "passed" && (item.evidenceIds ?? []).length === 0 && item.verificationNote === undefined) {
        return "Passed item lacks support";
      }
    }
  }
  return null;
}
```

Render the returned text with class `control-room__phase-risk`.

- [ ] **Step 5: Style without nested cards**

Update `app/src/styles/control-room.css` using compact nested list styling, not new card-inside-card surfaces:

```css
.control-room__work-kind {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.1rem 0.45rem;
  font-size: 0.75rem;
}

.control-room__phase {
  border-top: 1px solid var(--color-border);
  margin-top: 0.75rem;
  padding-top: 0.75rem;
}

.control-room__phase-risk {
  color: var(--color-danger);
  font-weight: 600;
}
```

- [ ] **Step 6: Run UI checks**

Run: `npm test -- --maxWorkers=1 app/src/App.test.tsx app/src/components/StatusBadge.test.tsx`

Expected: PASS.

Run: `npm run type-check`

Expected: PASS.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 7: Commit Task 6**

```bash
git add app/src/components/ControlRoom.tsx app/src/styles/control-room.css app/src/App.test.tsx app/src/test/projectModel.ts
git commit -m "feat: show work execution context"
```

---

### Task 7: Final Integration Gate

**Files:**
- Verify: whole repository
- Modify only if stale generation is detected: `generated/project-index.json`

**Interfaces:**
- Consumes: all previous task outputs.
- Produces: verified Project Control implementation ready for user review.

- [ ] **Step 1: Regenerate canonical outputs**

Run: `npm run generate`

Expected: `generated/project-index.json` is current and `generated/project-control.sqlite` exists as an ignored local projection.

- [ ] **Step 2: Run full gate**

Run: `npm run check`

Expected: PASS for data check, type-check, unit/component tests, production build, and Chromium end-to-end flow.

- [ ] **Step 3: Inspect git status**

Run: `git status --short --ignored generated`

Expected:

```text
!! generated/project-control.sqlite
```

No tracked file should be modified after a clean final `npm run generate`.

- [ ] **Step 4: Commit stale generated JSON only when present**

If `git status --short generated/project-index.json` shows a tracked modification after Step 1, commit it:

```bash
git add generated/project-index.json
git commit -m "chore: refresh project index"
```

If `generated/project-index.json` is clean, do not create a commit in this step.

- [ ] **Step 5: Final handoff**

Report:

```text
PASS / FAIL / BLOCKER / RISK / UNKNOWN
Files changed
Behavior changed
Tests run
Evidence or map updates
Intentionally not changed
Next recommended work
```

The handoff must explicitly state that SQLite remains generated and ignored, and that Work/Phase/Checklist state does not promote Node truth.
