# FlowDoc Project Control Foundation and GUI V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the file-first validation/index foundation and a read-only local React GUI that lets the user explore FlowDoc project Nodes through a focus stack, concise inspector, and full-detail modal.

**Architecture:** Canonical JSON records and Markdown are loaded and validated by Node-side tooling, then compiled deterministically into `generated/project-index.json`. The React application reads only that generated read model; it never infers status, authority, or relationships from Markdown. Each layer exposes a small typed interface so storage can later move behind the same read-model boundary.

**Tech Stack:** Node.js 24.15.0, npm 11.12.1, TypeScript 7.0.2, React 19.2.8, Vite 8.2.1, Vitest 4.1.10, Testing Library, AJV 8.20.0, react-markdown 10.1.0, Playwright 1.62.1, CSS/SVG.

## Global Constraints

- Scope is Phase 1 Foundation plus Phase 2 GUI V1 only; `CORE_ROUTE_*` migration and AGENTS/Skills redesign are separate future specs.
- The GUI is read-only and binds to `127.0.0.1`; it has no database, cloud service, account system, telemetry, or write action.
- Canonical structured records are one JSON record per file. Long-form prose stays in Markdown.
- Node, Work, Document, Repository, and Evidence remain distinct record types in source, schema, validator, and generated index.
- Truth states are exactly `current | planned | risk | unknown`.
- Work states are exactly `queued | in-progress | blocked | in-review`.
- A `current` Node must reference at least one valid Evidence record.
- Cross-repository Evidence must use a registered repository ID, a 40-character commit hash, and a stable path or contract ID.
- Absolute checkout paths never enter tracked source data. A gitignored `.flowdoc.local.json` maps `checkoutAlias` to machine-local paths.
- The generated index contains no timestamp and must be byte-identical for identical inputs.
- A failed validation/generation must not overwrite the last valid generated index.
- A failed `generate` writes only ignored `generated/project-diagnostics.json`; while it exists, the GUI shows diagnostics instead of the retained old map. A successful `generate` removes it after publishing the valid index.
- The GUI reads only `/project-diagnostics.json` and `/project-index.json`; Markdown content reaches the UI only through validated Document metadata embedded in the index.
- React Markdown must not enable raw HTML. No Markdown script or HTML is executed.
- Status is never communicated by color alone. Keyboard navigation, visible focus, and reduced motion are acceptance requirements.
- Use test-driven development for every behavior change: preserve RED output, make the minimum GREEN change, rerun the focused test, then run the task gate.
- Every task ends in one focused commit. Do not push, tag, or alter Core/Editor/Backend.
- Before Task 1, require a clean tracked tree, capture `git rev-parse HEAD` once as `implementationBase`, and retain that exact value for final scope/review; do not recompute it after commits.
- Before Task 1, record the exact HEAD and clean status of `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-core`, `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-editor`, and `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-backend`; these absolute paths are execution-only and never enter canonical source data. Final verification must match the recorded values.
- Execute the plan on branch `feature/foundation-gui-v1` in the external worktree `C:\Users\nekot\Documents\Codex\worktrees\flowdoc-project-control-foundation-gui-v1`; do not add a repo-local worktree directory or broaden Task 1 `.gitignore` for worktree storage.
- User-approved TDD exception: Task 1 may create only the test runner/configuration bootstrap (`package.json`, lockfile, TypeScript/Vitest configuration, `.gitignore`, installed dependencies) before the first RED so the RED tests schema behavior rather than a missing test runner. No canonical contract or schema production behavior may be written before that RED.
- V1 uses only the primary parent tree. Do not invent a cross-branch Relation format before the pilot produces a concrete use case.

## File and Boundary Map

### Project and tooling

- `package.json` — exact scripts and pinned dependencies.
- `package-lock.json` — npm dependency lock.
- `tsconfig.json` — shared strict TypeScript configuration.
- `vitest.config.ts` — Node and jsdom test projects.
- `.gitignore` — local config, build output, dependencies, and transient test output.
- `schemas/project-control.schema.json` — one versioned JSON Schema with `$defs` for all five record types.
- `src/model/types.ts` — canonical record/read-model TypeScript types.
- `src/model/constants.ts` — allowed states, roles, lifecycle values, ID and commit patterns.

### Foundation

- `src/model/diagnostics.ts` — shared serializable diagnostic contract used by tools and GUI.
- `tools/lib/errors.ts` — structured diagnostics and formatting.
- `tools/lib/discover.ts` — sorted discovery of canonical source paths.
- `tools/lib/load-sources.ts` — JSON/Markdown loading and AJV record validation.
- `tools/lib/validate-semantics.ts` — cross-record, hierarchy, path, and evidence rules.
- `tools/lib/build-read-model.ts` — deterministic read-model assembly.
- `tools/lib/write-atomic.ts` — temp-write and replace only after complete success.
- `tools/generate.ts` — CLI that validates and writes the index.
- `tools/check.ts` — CLI that validates and compares generated bytes without modifying tracked files.

### Canonical seed source

- `data/nodes/*.json`, `data/work/*.json`, `data/repositories/*.json`, `data/documents/*.json`, `data/evidence/*.json` — small truthful seed records.
- `docs/GLOSSARY.md`, `docs/GLOSSARY_TH.md` — canonical terminology.
- `docs/domains/project-control.md` — approved current architecture summary.
- `generated/project-index.json` — deterministic committed read model.

### GUI

- `app/index.html`, `app/vite.config.ts`, `app/src/main.tsx` — local application entry.
- `app/src/data/loadProjectState.ts` — diagnostics-first fetch and structural guard for generated index.
- `app/src/navigation/nodeRoute.ts` — URL parsing/building and path resolution.
- `app/src/App.tsx` — top-level loading/diagnostic/shell state.
- `app/src/components/FocusStackMap.tsx` — ancestor/current/child navigation.
- `app/src/components/NodeSearch.tsx` — search and direct navigation.
- `app/src/components/SummaryInspector.tsx` — intentionally short right summary.
- `app/src/components/FullDetailModal.tsx` — detailed tabbed overlay.
- `app/src/components/DiagnosticView.tsx` — honest failure state.
- `app/src/components/StatusBadge.tsx` — text-plus-color state rendering.
- `app/src/styles/*.css` — light theme, layout, focus, responsive, reduced motion.

### Tests

- `tests/fixtures/project-source.ts` — isolated filesystem fixture factory.
- `tests/schema.test.ts`, `tests/load-sources.test.ts`, `tests/semantic-validation.test.ts`, `tests/generation.test.ts` — Foundation behavior.
- `app/src/**/*.test.tsx` — GUI component and navigation behavior.
- `tests/e2e/project-control.spec.ts` — local end-to-end path.

---

## Execution Preflight

- [ ] From the approved `main` commit, create the external worktree at `C:\Users\nekot\Documents\Codex\worktrees\flowdoc-project-control-foundation-gui-v1` on new branch `feature/foundation-gui-v1`; verify `git rev-parse --git-dir` differs from `git rev-parse --git-common-dir` and the checkout is not a submodule.
- [ ] Verify Project Control has no tracked or staged changes, capture `implementationBase = git rev-parse HEAD`, and append that exact hash to ignored `.superpowers/sdd/2026-08-12-foundation-and-gui-v1/implementation-report.md`.
- [ ] Capture the exact HEAD and `git status --short` output for the three execution-only paths `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-core`, `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-editor`, and `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-backend` in the same ignored report. Stop if any product repo is dirty; this plan does not authorize touching or hiding those changes.
- [ ] Verify runtime evidence is Node `v24.15.0` and npm `11.12.1`. If either differs, stop and reassess dependency compatibility rather than silently changing the pinned stack.

---

### Task 1: Establish the strict TypeScript workspace and canonical contracts

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/model/constants.ts`
- Create: `src/model/types.ts`
- Create: `schemas/project-control.schema.json`
- Create: `tests/schema.test.ts`

**Interfaces:**
- Produces: `ProjectRecord`, `NodeRecord`, `WorkRecord`, `DocumentRecord`, `RepositoryRecord`, `EvidenceRecord`, `ProjectReadModel`, `IndexNode`, `IndexDocument`, and `SCHEMA_VERSION`.
- Produces: JSON Schema ID `https://flowdoc.local/schemas/project-control-v1.json` with `$defs.node`, `$defs.work`, `$defs.document`, `$defs.repository`, and `$defs.evidence`.

- [ ] **Step 1: Create only the approved test-runner bootstrap**

Create `package.json`, install the exact dependency versions below to produce `package-lock.json`, create strict `tsconfig.json` and `vitest.config.ts`, and add only the listed transient paths to `.gitignore`. This step is the user-approved configuration exception to TDD; it must not create `src/model/*`, `schemas/*`, or any canonical application behavior.

Use exact dependency versions:

```json
{
  "name": "flowdoc-project-control",
  "version": "0.1.0-a.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --config app/vite.config.ts --host 127.0.0.1",
    "build": "npm run generate && vite build --config app/vite.config.ts",
    "generate": "tsx tools/generate.ts",
    "check:data": "tsx tools/check.ts",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "check": "npm run check:data && npm run type-check && npm test && npm run build"
  },
  "dependencies": {
    "ajv": "8.20.0",
    "ajv-formats": "3.0.1",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-markdown": "10.1.0",
    "remark-gfm": "4.0.1"
  },
  "devDependencies": {
    "@playwright/test": "1.62.1",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.2",
    "@testing-library/user-event": "14.6.4",
    "@types/node": "26.2.0",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.4",
    "@vitejs/plugin-react": "6.0.5",
    "jsdom": "30.0.1",
    "tsx": "4.23.12",
    "typescript": "7.0.2",
    "vite": "8.2.1",
    "vitest": "4.1.10"
  }
}
```

Run `npm install`, then configure strict ESM TypeScript with `resolveJsonModule`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and JSX `react-jsx`. Configure Vitest to use Node by default and jsdom for `app/src/**/*.test.tsx`.

`.gitignore` must contain exactly the transient categories needed by this plan: `node_modules/`, `dist/`, `coverage/`, `test-results/`, `playwright-report/`, `generated/project-diagnostics.json`, `.flowdoc.local.json`, and `.superpowers/`.

- [ ] **Step 2: Write the failing schema contract test**

```ts
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("project-control schema", () => {
  it("defines all five records and keeps truth/work states separate", async () => {
    const schema = JSON.parse(
      await readFile("schemas/project-control.schema.json", "utf8"),
    );

    expect(Object.keys(schema.$defs).sort()).toEqual([
      "document",
      "evidence",
      "node",
      "repository",
      "work",
    ]);
    expect(schema.$defs.node.properties.truthState.enum).toEqual([
      "current",
      "planned",
      "risk",
      "unknown",
    ]);
    expect(schema.$defs.work.properties.workState.enum).toEqual([
      "queued",
      "in-progress",
      "blocked",
      "in-review",
    ]);
    expect(schema.$defs.node.properties).not.toHaveProperty("workState");
    expect(schema.$defs.work.properties).not.toHaveProperty("truthState");
  });
});
```

- [ ] **Step 3: Run the test and preserve RED**

Run: `npm test -- tests/schema.test.ts`

Expected: FAIL because `schemas/project-control.schema.json` does not exist; the Vitest runner itself must start successfully.

- [ ] **Step 4: Define canonical TypeScript contracts**

```ts
export type TruthState = "current" | "planned" | "risk" | "unknown";
export type WorkState = "queued" | "in-progress" | "blocked" | "in-review";
export type DocumentRole =
  | "current-state" | "contract" | "verification" | "risk"
  | "unknown" | "decision" | "historical-note" | "glossary" | "version";
export type DocumentLifecycle = "active" | "superseded" | "retired";

export interface NodeRecord {
  kind: "node";
  id: string;
  title: string;
  parentId: string | null;
  summary: string;
  truthState: TruthState;
  order: number;
  documentIds: string[];
  evidenceIds: string[];
  repositoryIds: string[];
}

export interface WorkRecord {
  kind: "work";
  id: string;
  title: string;
  nodeId: string;
  repositoryIds: string[];
  workState: WorkState;
  summary: string;
  blockedBy?: string;
  unblockOwner?: string;
  requiredEvidence: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  kind: "document";
  id: string;
  title: string;
  path: string;
  nodeIds: string[];
  role: DocumentRole;
  authority: string;
  lifecycle: DocumentLifecycle;
  repositoryRefs: Array<{
    repositoryId: string;
    commit: string;
    pathOrContractId: string;
  }>;
}

export interface RepositoryRecord {
  kind: "repository";
  id: string;
  name: string;
  remote: string;
  checkoutAlias: string;
  defaultBranch: string;
  ownershipSummary: string;
}

export interface EvidenceRecord {
  kind: "evidence";
  id: string;
  nodeIds: string[];
  repositoryId: string;
  commit: string;
  pathOrContractId: string;
  verificationSummary: string;
  verifiedAt: string;
}

export type ProjectRecord =
  | NodeRecord | WorkRecord | DocumentRecord | RepositoryRecord | EvidenceRecord;

export interface IndexNode extends NodeRecord {
  childIds: string[];
  workIds: string[];
}

export interface IndexDocument extends DocumentRecord {
  content: string;
}

export interface ProjectReadModel {
  schemaVersion: 1;
  sourceDigest: string;
  rootNodeIds: string[];
  nodes: IndexNode[];
  work: WorkRecord[];
  documents: IndexDocument[];
  repositories: RepositoryRecord[];
  evidence: EvidenceRecord[];
}
```

- [ ] **Step 5: Create the JSON Schema and make the test GREEN**

The root schema must set `additionalProperties: false` in every record definition, use the ID pattern `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`, require a 40-hex commit, validate ISO date-time strings through `ajv-formats`, require repository remotes to start with `https://`, and encode the exact enums above. `path`, `pathOrContractId`, and repository reference targets must be non-empty relative values: reject drive prefixes, leading `/`, backslashes, and any `..` segment. Use `if/then` so `workState: blocked` requires non-empty `blockedBy` and `unblockOwner`.

Run: `npm test -- tests/schema.test.ts`

Expected: PASS, 1 test.

- [ ] **Step 6: Run Task 1 gate and commit**

Run: `npm run type-check && npm test -- tests/schema.test.ts`

Expected: both commands exit 0.

```bash
git add .gitignore package.json package-lock.json tsconfig.json vitest.config.ts src/model schemas tests/schema.test.ts
git commit -m "feat: define project control contracts"
```

---

### Task 2: Load canonical files and return actionable diagnostics

**Files:**
- Create: `src/model/diagnostics.ts`
- Create: `tools/lib/errors.ts`
- Create: `tools/lib/discover.ts`
- Create: `tools/lib/load-sources.ts`
- Create: `tests/fixtures/project-source.ts`
- Create: `tests/load-sources.test.ts`

**Interfaces:**
- Consumes: record types and schema from Task 1.
- Produces: `loadProjectSources(rootDir: string): Promise<LoadedProjectSources>`.
- Produces: shared `ProjectDiagnostic { code, message, file, recordId?, hint }` and `ProjectValidationError` with stable ordered diagnostics.
- Produces test support `createProjectFixture(options: ProjectFixtureOptions): Promise<string>`; later Foundation tasks extend its options in the same focused fixture file.

- [ ] **Step 1: Write failing loader tests**

Define the shared wire contract in `src/model/diagnostics.ts`:

```ts
export interface ProjectDiagnostic {
  code: string;
  message: string;
  file: string;
  recordId?: string;
  hint: string;
}

export interface ProjectDiagnosticsFile {
  schemaVersion: 1;
  diagnostics: ProjectDiagnostic[];
}
```

```ts
it("discovers one record per file in stable path order", async () => {
  const root = await createProjectFixture({ valid: true });
  const loaded = await loadProjectSources(root);
  expect(loaded.records.map((entry) => entry.relativePath)).toEqual([
    "data/documents/doc-overview.json",
    "data/evidence/evidence-design.json",
    "data/nodes/flowdoc.json",
    "data/repositories/project-control.json",
    "data/work/pilot.json",
  ]);
});

it("reports malformed JSON with file and repair hint", async () => {
  const root = await createProjectFixture({ malformedNodeJson: true });
  await expect(loadProjectSources(root)).rejects.toMatchObject({
    diagnostics: [expect.objectContaining({
      code: "JSON_PARSE_ERROR",
      file: "data/nodes/flowdoc.json",
      hint: "Fix the JSON syntax before generating the project index.",
    })],
  });
});

it.each([
  ["unknown property", { unknownNodeProperty: true }, "SCHEMA_ADDITIONAL_PROPERTY"],
  ["wrong directory kind", { nodeFileContainsWork: true }, "RECORD_KIND_MISMATCH"],
  ["unsupported truth state", { invalidTruthState: true }, "SCHEMA_ENUM"],
  ["tracked localPath field", { repositoryLocalPath: "C:/private/core" }, "SCHEMA_ADDITIONAL_PROPERTY"],
])("rejects %s", async (_name, mutation, code) => {
  const root = await createProjectFixture({ valid: true, ...mutation });
  await expect(loadProjectSources(root)).rejects.toMatchObject({
    diagnostics: expect.arrayContaining([expect.objectContaining({ code })]),
  });
});
```

- [ ] **Step 2: Run tests and preserve RED**

Run: `npm test -- tests/load-sources.test.ts`

Expected: FAIL because loader modules do not exist.

- [ ] **Step 3: Implement stable discovery and diagnostics**

Discover only regular, non-symlink `*.json` files directly below the five canonical directories, sort by normalized `/` relative path, reject nested, symlinked, or unexpected JSON files, and never traverse product repositories. Parse each file once, validate it with the matching AJV `$def` plus `ajv-formats`, and retain `{ relativePath, value }`.

```ts
export interface LoadedRecord<T extends ProjectRecord = ProjectRecord> {
  relativePath: string;
  value: T;
}

export interface LoadedProjectSources {
  rootDir: string;
  records: LoadedRecord[];
  nodes: LoadedRecord<NodeRecord>[];
  work: LoadedRecord<WorkRecord>[];
  documents: LoadedRecord<DocumentRecord>[];
  repositories: LoadedRecord<RepositoryRecord>[];
  evidence: LoadedRecord<EvidenceRecord>[];
}
```

Convert AJV errors to stable messages sorted by `file`, `instancePath`, then keyword. Never print machine-local absolute root paths in diagnostics.

- [ ] **Step 4: Run focused GREEN and Task 2 gate**

Run: `npm test -- tests/load-sources.test.ts tests/schema.test.ts && npm run type-check`

Expected: all tests and type-check pass.

- [ ] **Step 5: Commit**

```bash
git add src/model/diagnostics.ts tools/lib tests/fixtures tests/load-sources.test.ts
git commit -m "feat: load canonical project records"
```

---

### Task 3: Enforce hierarchy, reference, evidence, and path semantics

**Files:**
- Create: `tools/lib/validate-semantics.ts`
- Create: `tests/semantic-validation.test.ts`

**Interfaces:**
- Consumes: `LoadedProjectSources`.
- Produces: `validateProjectSemantics(loaded: LoadedProjectSources): Promise<ValidatedProjectSources>`.
- Produces: `loadAndValidateProject(rootDir: string): Promise<ValidatedProjectSources>` as the only convenience composition of loader plus semantic validator.
- `ValidatedProjectSources` is branded so the index builder cannot accept unvalidated input.

- [ ] **Step 1: Write the failing semantic matrix**

```ts
it.each([
  ["duplicate ID", { duplicateId: true }, "DUPLICATE_ID"],
  ["missing parent", { missingParent: true }, "MISSING_NODE_PARENT"],
  ["hierarchy cycle", { nodeCycle: true }, "NODE_CYCLE"],
  ["missing document", { missingDocumentRef: true }, "MISSING_DOCUMENT"],
  ["missing repository", { missingRepositoryRef: true }, "MISSING_REPOSITORY"],
  ["missing evidence", { missingEvidenceRef: true }, "MISSING_EVIDENCE"],
  ["document ownership mismatch", { documentOwnershipMismatch: true }, "DOCUMENT_OWNERSHIP_MISMATCH"],
  ["evidence ownership mismatch", { evidenceOwnershipMismatch: true }, "EVIDENCE_OWNERSHIP_MISMATCH"],
  ["current without evidence", { currentWithoutEvidence: true }, "CURRENT_WITHOUT_EVIDENCE"],
  ["document outside repo", { escapingDocumentPath: true }, "DOCUMENT_PATH_ESCAPE"],
])("rejects %s", async (_name, mutation, code) => {
  const root = await createProjectFixture({ valid: true, ...mutation });
  const loaded = await loadProjectSources(root);
  await expect(validateProjectSemantics(loaded)).rejects.toMatchObject({
    diagnostics: expect.arrayContaining([expect.objectContaining({ code })]),
  });
});

it.each([
  ["planned", "in-progress"],
  ["current", "blocked"],
])("does not derive %s truth from %s work", async (truthState, workState) => {
  const root = await createProjectFixture({ valid: true, truthState, workState });
  const validated = await validateProjectSemantics(await loadProjectSources(root));
  expect(validated.nodes[0]?.value.truthState).toBe(truthState);
  expect(validated.work[0]?.value.workState).toBe(workState);
});

it("does not derive node truth from document lifecycle", async () => {
  const root = await createProjectFixture({
    valid: true,
    truthState: "planned",
    documentLifecycle: "retired",
  });
  const validated = await validateProjectSemantics(await loadProjectSources(root));
  expect(validated.nodes[0]?.value.truthState).toBe("planned");
});
```

- [ ] **Step 2: Run tests and preserve RED**

Run: `npm test -- tests/semantic-validation.test.ts`

Expected: FAIL because semantic validation is absent.

- [ ] **Step 3: Implement semantic validation as independent passes**

Implement these pure checks and combine diagnostics only after all have run:

```ts
checkGlobalIds(loaded);
checkNodeHierarchy(loaded.nodes);
checkNodeReferences(loaded);
checkWorkReferences(loaded);
checkDocumentPathsAndReferences(loaded);
checkEvidenceReferences(loaded);
checkReciprocalOwnership(loaded);
checkCurrentEvidence(loaded);
```

Hierarchy cycle diagnostics must print the complete stable cycle, such as `node-a -> node-b -> node-a`. Resolve Document paths with `path.resolve(rootDir, record.path)`, then compare `realpath` results for the root and target to reject symlink escapes; verify the file exists and is Markdown. `checkReciprocalOwnership` requires Node `documentIds` ↔ Document `nodeIds` and Node `evidenceIds` ↔ Evidence `nodeIds` to agree in both directions. Evidence commit/path constraints are schema-owned, while repository and Node existence are semantic-owned.

Return a branded result only when diagnostics are empty:

```ts
declare const validatedProject: unique symbol;
export type ValidatedProjectSources = LoadedProjectSources & {
  readonly [validatedProject]: true;
};

export async function loadAndValidateProject(rootDir: string) {
  return validateProjectSemantics(await loadProjectSources(rootDir));
}
```

- [ ] **Step 4: Run focused GREEN and Task 3 gate**

Run: `npm test -- tests/semantic-validation.test.ts tests/load-sources.test.ts && npm run type-check`

Expected: all tests and type-check pass.

- [ ] **Step 5: Commit**

```bash
git add tools/lib/validate-semantics.ts tests/semantic-validation.test.ts tests/fixtures/project-source.ts
git commit -m "feat: validate project relationships"
```

---

### Task 4: Build and check the deterministic index atomically

**Files:**
- Create: `tools/lib/build-read-model.ts`
- Create: `tools/lib/write-atomic.ts`
- Create: `tools/generate.ts`
- Create: `tools/check.ts`
- Modify: `tests/fixtures/project-source.ts`
- Create: `tests/generation.test.ts`

**Interfaces:**
- Consumes: `ValidatedProjectSources`.
- Produces: `buildProjectReadModel(validated): Promise<ProjectReadModel>`.
- Produces: `serializeProjectReadModel(model): string` ending with one LF.
- Produces: `generateToString(rootDir: string): Promise<string>` and `generateProjectIndex(rootDir: string, outputPath?: string): Promise<void>`.
- Produces: `checkProjectIndex(rootDir: string, indexPath?: string): Promise<void>`; rejection code is `PROJECT_INDEX_STALE`.
- Produces: CLI exit 0 on valid/current, exit 1 with diagnostics on invalid/stale.

- [ ] **Step 1: Write failing deterministic and atomicity tests**

```ts
it("produces byte-identical output for identical sources", async () => {
  const root = await createProjectFixture({ valid: true });
  const first = await generateToString(root);
  const second = await generateToString(root);
  expect(second).toBe(first);
  expect(JSON.parse(first)).not.toHaveProperty("generatedAt");
});

it("preserves the last valid index when later validation fails", async () => {
  const root = await createProjectFixture({ valid: true });
  await generateProjectIndex(root);
  const before = await readFile(join(root, "generated/project-index.json"), "utf8");
  await mutateNodeIntoCycle(root);
  await expect(generateProjectIndex(root)).rejects.toThrow();
  expect(await readFile(join(root, "generated/project-index.json"), "utf8")).toBe(before);
  expect(JSON.parse(
    await readFile(join(root, "generated/project-diagnostics.json"), "utf8"),
  ).diagnostics).toEqual(expect.arrayContaining([
    expect.objectContaining({ code: "NODE_CYCLE" }),
  ]));
});

it("sorts records, embeds Markdown, and changes digest only when source changes", async () => {
  const root = await createProjectFixture({ valid: true, shuffledCreationOrder: true });
  const first = JSON.parse(await generateToString(root));
  expect(first.nodes.map((node: { id: string }) => node.id)).toEqual(["flowdoc"]);
  expect(first.documents[0].content).toContain("# Overview");
  await appendFile(join(root, "docs/overview.md"), "\nChanged.\n");
  const second = JSON.parse(await generateToString(root));
  expect(second.sourceDigest).not.toBe(first.sourceDigest);
});

it("detects a stale byte without rewriting it", async () => {
  const root = await createProjectFixture({ valid: true });
  await generateProjectIndex(root);
  const target = join(root, "generated/project-index.json");
  await appendFile(target, " ");
  const stale = await readFile(target, "utf8");
  await expect(checkProjectIndex(root)).rejects.toMatchObject({ code: "PROJECT_INDEX_STALE" });
  expect(await readFile(target, "utf8")).toBe(stale);
});

it("clears diagnostics only after a valid index is published", async () => {
  const root = await createProjectFixture({ valid: true });
  await mkdir(join(root, "generated"), { recursive: true });
  await writeFile(join(root, "generated/project-diagnostics.json"), JSON.stringify({
    schemaVersion: 1,
    diagnostics: [{
      code: "NODE_CYCLE",
      message: "cycle",
      file: "data/nodes/flowdoc.json",
      hint: "Break the cycle.",
    }],
  }));
  await generateProjectIndex(root);
  await expect(access(join(root, "generated/project-diagnostics.json"))).rejects.toThrow();
  await expect(checkProjectIndex(root)).resolves.toBeUndefined();
});
```

- [ ] **Step 2: Run tests and preserve RED**

Run: `npm test -- tests/generation.test.ts`

Expected: FAIL because generator functions do not exist.

- [ ] **Step 3: Build the read model deterministically**

Sort Nodes by `(parentId ?? "", order, id)`, and all other records by `id`. Build `rootNodeIds`, `childIds`, and linked Work IDs without mutating source records. Embed Markdown as plain source text only for validated Documents. Normalize source text line endings to LF, calculate `sourceDigest` from ordered `relativePath + NUL + canonical JSON/Markdown bytes`, and serialize with `JSON.stringify(model, null, 2) + "\n"`.

```ts
export interface ProjectReadModel {
  schemaVersion: 1;
  sourceDigest: string;
  rootNodeIds: string[];
  nodes: IndexNode[];
  work: WorkRecord[];
  documents: IndexDocument[];
  repositories: RepositoryRecord[];
  evidence: EvidenceRecord[];
}
```

- [ ] **Step 4: Implement atomic generate and read-only check CLIs**

`writeFileAtomically` writes a sibling temporary file, flushes/closes it, then replaces the target only after serialization succeeds. Always clean the temp file in `finally`. On known load/semantic failure, `tools/generate.ts` atomically writes a deterministic `generated/project-diagnostics.json` and leaves the valid index byte-identical. On success it publishes the index first, then removes the diagnostic sidecar. `tools/check.ts` builds expected bytes in memory, compares with the tracked index, and prints `PROJECT_INDEX_STALE` plus `Run: npm run generate` without writing index or diagnostics. If a diagnostic sidecar remains, `check` fails with `PROJECT_DIAGNOSTICS_PRESENT` even when source bytes have been fixed, requiring a successful generate to clear the visible failure state.

- [ ] **Step 5: Run focused GREEN and Task 4 gate**

Run: `npm test -- tests/generation.test.ts tests/semantic-validation.test.ts && npm run type-check`

Expected: all tests and type-check pass.

- [ ] **Step 6: Commit**

```bash
git add tools tests/generation.test.ts package.json
git commit -m "feat: generate deterministic project index"
```

---

### Task 5: Add a conservative truthful seed project

**Files:**
- Create: `data/repositories/project-control.json`
- Create: `data/repositories/core.json`
- Create: `data/repositories/editor.json`
- Create: `data/repositories/backend.json`
- Create: `data/nodes/flowdoc.json`
- Create: `data/nodes/project-control.json`
- Create: `data/nodes/core.json`
- Create: `data/nodes/editor.json`
- Create: `data/nodes/backend.json`
- Create: `data/work/core-route-pilot.json`
- Create: `data/documents/project-control-design.json`
- Create: `data/documents/project-control-overview.json`
- Create: `data/documents/glossary-en.json`
- Create: `data/documents/glossary-th.json`
- Create: `data/evidence/project-control-design.json`
- Create: `docs/GLOSSARY.md`
- Create: `docs/GLOSSARY_TH.md`
- Create: `docs/domains/project-control.md`
- Create: `generated/project-index.json`
- Create: `tests/seed-project.test.ts`

**Interfaces:**
- Consumes: Foundation CLIs from Tasks 2–4.
- Produces: the first real root Node graph and committed deterministic index.

- [ ] **Step 1: Write the failing real-root test**

```ts
const execFileAsync = promisify(execFile);

it("loads the truthful seed without claiming unverified product state", async () => {
  const validated = await loadAndValidateProject(process.cwd());
  const model = await buildProjectReadModel(validated);
  expect(model.rootNodeIds).toEqual(["flowdoc"]);
  expect(model.nodes.find((node) => node.id === "project-control")).toMatchObject({
    truthState: "current",
    evidenceIds: ["project-control-design"],
  });
  for (const id of ["core", "editor", "backend"]) {
    expect(model.nodes.find((node) => node.id === id)?.truthState).toBe("unknown");
  }
  const evidence = model.evidence.find((entry) => entry.id === "project-control-design")!;
  await expect(execFileAsync("git", [
    "cat-file",
    "-e",
    `${evidence.commit}:${evidence.pathOrContractId}`,
  ], { cwd: process.cwd() })).resolves.toBeDefined();
});
```

- [ ] **Step 2: Run the test and preserve RED**

Run: `npm test -- tests/seed-project.test.ts`

Expected: FAIL because canonical seed files do not exist.

- [ ] **Step 3: Add exact repository records**

Use these verified remotes and checkout aliases:

```text
project-control → https://github.com/nekotoomtam/flowdoc-project-control.git
core            → https://github.com/nekotoomtam/flowdoc-vnext-core.git
editor          → https://github.com/nekotoomtam/flowdoc-vnext-editor.git
backend         → https://github.com/nekotoomtam/flowdoc-vnext-backend.git
```

Use default branch `main`. Do not record `C:\Users\...` paths.

- [ ] **Step 4: Add conservative Nodes, Work, Documents, and Evidence**

Make `flowdoc` planned, `project-control` current only because the approved design commit exists, and Core/Editor/Backend unknown until pilot migration brings their cross-repo truth into this system. Evidence `project-control-design` must point to repository `project-control`, commit `bc2e1efb60c7391b2d4b0978cf7c4b1105ef7444`, and `docs/superpowers/specs/2026-08-12-flowdoc-project-control-design.md`.

Use this exact initial hierarchy and display order:

| ID | Parent | Order | Truth | Durable documents | Active work |
|---|---|---:|---|---|---|
| `flowdoc` | `null` | 0 | `planned` | English/Thai glossaries | none |
| `backend` | `flowdoc` | 10 | `unknown` | none | none |
| `core` | `flowdoc` | 20 | `unknown` | none | `core-route-pilot` |
| `editor` | `flowdoc` | 30 | `unknown` | none | none |
| `project-control` | `flowdoc` | 40 | `current` | overview + approved design | none |

The Project Control overview is role `current-state`; the approved design is role `decision`; both are active. Glossary records use role `glossary` and belong to `flowdoc`. Only `project-control` lists Evidence `project-control-design`.

Add one queued Work item for the future `CORE_ROUTE_*` pilot. Its required evidence must state: consolidated document commit, migrated reference/test result, and Project Control evidence record. This Work entry does not execute migration in this plan.

Define both glossaries with the exact canonical terms: Node, Truth State, Work State, Document, Evidence, Repository Registry, Focus Stack Map, Summary Inspector, and Full Detail Modal. The Thai glossary explains the same IDs rather than inventing separate Thai term identities.

- [ ] **Step 5: Generate and verify the committed index**

Run: `npm run generate && npm run check:data && npm test -- tests/seed-project.test.ts`

Expected: generation exits 0, check reports current, and the seed test passes.

- [ ] **Step 6: Prove no machine-local path leaked and commit**

Run: `rg -n "C:\\\\Users|Documents\\\\GitHub" data docs/GLOSSARY.md docs/GLOSSARY_TH.md docs/domains generated`

Expected: no matches.

```bash
git add data docs/GLOSSARY.md docs/GLOSSARY_TH.md docs/domains generated tests/seed-project.test.ts
git commit -m "docs: seed project control truth"
```

---

### Task 6: Bootstrap the local read-only React shell and diagnostic boundary

**Files:**
- Create: `app/index.html`
- Create: `app/vite.config.ts`
- Create: `app/src/main.tsx`
- Create: `app/src/App.tsx`
- Create: `app/src/data/loadProjectState.ts`
- Create: `app/src/components/DiagnosticView.tsx`
- Create: `app/src/test/setup.ts`
- Create: `app/src/test/projectModel.ts`
- Create: `app/src/App.test.tsx`
- Create: `app/src/styles/base.css`

**Interfaces:**
- Consumes: optional `/project-diagnostics.json`, then `/project-index.json` conforming to `ProjectReadModel` when no diagnostics exist.
- Produces: `loadProjectState(fetcher?: typeof fetch): Promise<{ kind: "ready"; model: ProjectReadModel } | { kind: "diagnostic"; diagnostics: ProjectDiagnostic[] }>`.
- Produces: shell states `loading | ready | diagnostic`.
- Produces: `AppProps { initialModel?: ProjectReadModel }`; `initialModel` is the deterministic component-test seam and production calls `<App />` without it.
- Produces test support `makeProjectReadModel(overrides?): ProjectReadModel` used by later component tests instead of hand-copied model objects.

- [ ] **Step 1: Write failing shell and loader tests**

```tsx
it("shows a diagnostic instead of a partial map when the index is invalid", async () => {
  vi.stubGlobal("fetch", vi.fn()
    .mockResolvedValueOnce({ ok: false, status: 404 })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ schemaVersion: 99 }),
    }));
  render(<App />);
  expect(await screen.findByRole("heading", { name: "Project data needs attention" }))
    .toBeVisible();
  expect(screen.queryByTestId("focus-stack-map")).not.toBeInTheDocument();
});

it("reports a network failure without rendering the map", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  render(<App />);
  expect(await screen.findByText(/Could not load project data/)).toBeVisible();
  expect(screen.queryByTestId("focus-stack-map")).not.toBeInTheDocument();
});

it("prefers source diagnostics and does not fetch the retained old index", async () => {
  const fetcher = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      schemaVersion: 1,
      diagnostics: [{ code: "NODE_CYCLE", message: "cycle", file: "data/nodes/a.json", hint: "Break the cycle." }],
    }),
  });
  await expect(loadProjectState(fetcher)).resolves.toMatchObject({ kind: "diagnostic" });
  expect(fetcher).toHaveBeenCalledTimes(1);
});

it("loads the valid index after diagnostics return 404", async () => {
  const fetcher = vi.fn()
    .mockResolvedValueOnce({ ok: false, status: 404 })
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => model });
  await expect(loadProjectState(fetcher)).resolves.toEqual({ kind: "ready", model });
});

it("renders the shell from a valid injected read model", () => {
  render(<App initialModel={model} />);
  expect(screen.getByTestId("focus-stack-map")).toBeVisible();
});
```

- [ ] **Step 2: Run tests and preserve RED**

Run: `npm test -- app/src/App.test.tsx`

Expected: FAIL because the app shell does not exist.

- [ ] **Step 3: Configure Vite as a local-only app**

Set Vite root to `app`, `publicDir` to `../generated`, build output to `../dist`, and preview/dev host to `127.0.0.1`. Do not set `host: true` or `0.0.0.0`. Add a response header for the dev server: `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'`.

- [ ] **Step 4: Implement the loader and honest diagnostic shell**

The loader requests `/project-diagnostics.json` first. A 404 means no source diagnostic; a valid non-empty diagnostic response stops before requesting/rendering the map. Other diagnostic-fetch failures become an honest network Diagnostic View. When diagnostics are absent, the index loader checks HTTP success, `schemaVersion === 1`, required arrays, unique Node IDs, and that every `rootNodeId` exists before returning. This is a defensive runtime guard, not a second source validator. Diagnostic messages include file, record ID when present, rule code, hint, and `Run npm run generate, then npm run check:data.`

- [ ] **Step 5: Run focused GREEN and Task 6 gate**

Run: `npm test -- app/src/App.test.tsx && npm run type-check && npm run build`

Expected: tests, type-check, data generation, and Vite production build pass.

- [ ] **Step 6: Commit**

```bash
git add app package.json tsconfig.json vitest.config.ts
git commit -m "feat: add local project control shell"
```

---

### Task 7: Implement URL-driven Focus Stack navigation and search

**Files:**
- Create: `app/src/navigation/nodeRoute.ts`
- Create: `app/src/navigation/nodeRoute.test.ts`
- Create: `app/src/components/FocusStackMap.tsx`
- Create: `app/src/components/FocusStackMap.test.tsx`
- Create: `app/src/components/NodeSearch.tsx`
- Create: `app/src/components/NodeSearch.test.tsx`
- Modify: `app/src/App.tsx`
- Create: `app/src/styles/map.css`

**Interfaces:**
- Produces: `resolveNodePath(model, nodeId): IndexNode[]`.
- Produces: `readNodeId(location: Location): string | null` and `nodeUrl(id): string` using `?node=<id>`.
- `FocusStackMap` receives `{ model, currentNodeId, onNavigate }`.

- [ ] **Step 1: Write failing route and focus-stack tests**

```tsx
it("promotes a child and keeps all ancestors visible", async () => {
  const user = userEvent.setup();
  render(<FocusStackMap model={model} currentNodeId="flowdoc" onNavigate={onNavigate} />);
  await user.click(screen.getByRole("button", { name: "Project Control" }));
  expect(onNavigate).toHaveBeenCalledWith("project-control");
});

it("resolves the complete ancestor path", () => {
  expect(resolveNodePath(model, "project-control").map((node) => node.id))
    .toEqual(["flowdoc", "project-control"]);
});

it("jumps to an ancestor and keeps children sorted", async () => {
  const user = userEvent.setup();
  render(<FocusStackMap model={model} currentNodeId="project-control" onNavigate={onNavigate} />);
  await user.click(screen.getByRole("button", { name: /FlowDoc, Ancestor/ }));
  expect(onNavigate).toHaveBeenCalledWith("flowdoc");
  expect(screen.getAllByTestId("child-node").map((node) => node.textContent))
    .toEqual(["Backend", "Core", "Editor", "Project Control"]);
});

it("falls back honestly from an unknown URL and follows popstate", async () => {
  history.replaceState(null, "", "/?node=missing");
  render(<App initialModel={model} />);
  expect(screen.getByText(/Node “missing” was not found/)).toBeVisible();
  expect(screen.getByRole("button", { name: /FlowDoc, Current/ })).toBeVisible();
  history.pushState(null, "", "/?node=project-control");
  dispatchEvent(new PopStateEvent("popstate"));
  expect(await screen.findByRole("button", { name: /Project Control, Current/ })).toBeVisible();
});

it("searches by title and navigates through the shared callback", async () => {
  const user = userEvent.setup();
  render(<NodeSearch nodes={model.nodes} onNavigate={onNavigate} />);
  await user.type(screen.getByRole("searchbox"), "project con");
  await user.click(screen.getByRole("option", { name: "Project Control" }));
  expect(onNavigate).toHaveBeenCalledWith("project-control");
});
```

- [ ] **Step 2: Run tests and preserve RED**

Run: `npm test -- app/src/navigation/nodeRoute.test.ts app/src/components/FocusStackMap.test.tsx app/src/components/NodeSearch.test.tsx`

Expected: FAIL because navigation components do not exist.

- [ ] **Step 3: Implement pure path resolution and URL state**

Resolve parents iteratively with a visited set; a cycle at runtime returns a diagnostic rather than looping. `App` owns current Node ID, initializes it from the URL, calls `history.pushState` on user navigation, and listens for `popstate`. Search matches normalized title and ID, shows at most eight results, and navigates through the same callback.

- [ ] **Step 4: Render the Focus Stack Map**

Use semantic buttons connected by decorative SVG lines with `aria-hidden="true"`. Ancestors, current, and children must have textual level labels. Do not infer Truth/Work color from position.

- [ ] **Step 5: Run focused GREEN and Task 7 gate**

Run: `npm test -- app/src/navigation app/src/components/FocusStackMap.test.tsx app/src/components/NodeSearch.test.tsx app/src/App.test.tsx && npm run type-check`

Expected: all tests and type-check pass.

- [ ] **Step 6: Commit**

```bash
git add app/src/navigation app/src/components/FocusStackMap* app/src/components/NodeSearch* app/src/App.tsx app/src/styles/map.css
git commit -m "feat: navigate the focus stack map"
```

---

### Task 8: Add the concise Summary Inspector and status semantics

**Files:**
- Create: `app/src/components/StatusBadge.tsx`
- Create: `app/src/components/StatusBadge.test.tsx`
- Create: `app/src/components/SummaryInspector.tsx`
- Create: `app/src/components/SummaryInspector.test.tsx`
- Modify: `app/src/App.tsx`
- Create: `app/src/styles/inspector.css`

**Interfaces:**
- `StatusBadge` receives `{ kind: "truth" | "work", value }` and always renders visible text.
- `SummaryInspector` receives `{ node, childCount, work, documents, onOpenDetails }`.
- Work priority for the single inspector headline is `blocked`, `in-review`, `in-progress`, `queued`.
- The one issue callout priority is first blocked Work summary, then the first active `risk` Document by ID, then the first active `unknown` Document by ID; otherwise render no issue callout.

- [ ] **Step 1: Write failing inspector contract tests**

```tsx
it("keeps queue and documents as separate summaries", () => {
  render(<SummaryInspector {...props} />);
  expect(screen.getByText("Work queue").nextSibling).toHaveTextContent("3");
  expect(screen.getByText("Documents").nextSibling).toHaveTextContent("2");
  expect(screen.queryByRole("list", { name: "All work" })).not.toBeInTheDocument();
  expect(screen.queryByText(longMarkdownParagraph)).not.toBeInTheDocument();
});

it("shows status in text, not color alone", () => {
  render(<StatusBadge kind="truth" value="planned" />);
  expect(screen.getByText("Planned")).toBeVisible();
});

it("shows only the highest-priority blocker and invokes View all", async () => {
  const user = userEvent.setup();
  render(<SummaryInspector {...props} work={blockedAndQueuedWork} />);
  expect(screen.getByText("Blocked")).toBeVisible();
  expect(screen.queryByText("Second queued detail")).not.toBeInTheDocument();
  expect(screen.getByTestId("node-summary")).toHaveClass("summary-clamp");
  expect(screen.getByText("Child nodes").nextSibling).toHaveTextContent("4");
  await user.click(screen.getByRole("button", { name: "View all" }));
  expect(props.onOpenDetails).toHaveBeenCalledOnce();
});
```

- [ ] **Step 2: Run tests and preserve RED**

Run: `npm test -- app/src/components/StatusBadge.test.tsx app/src/components/SummaryInspector.test.tsx`

Expected: FAIL because inspector components do not exist.

- [ ] **Step 3: Implement concise aggregation and rendering**

Derive Work and Document arrays from explicit IDs in the read model. Active Documents count excludes `retired`; detail history may include them later. Inspector must not render Markdown or full lists. Use CSS line-clamp for summary but keep the complete short summary in `title`/accessible description.

- [ ] **Step 4: Run focused GREEN and Task 8 gate**

Run: `npm test -- app/src/components/StatusBadge.test.tsx app/src/components/SummaryInspector.test.tsx app/src/App.test.tsx && npm run type-check`

Expected: all tests and type-check pass.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/StatusBadge* app/src/components/SummaryInspector* app/src/App.tsx app/src/styles/inspector.css
git commit -m "feat: summarize node truth and work"
```

---

### Task 9: Add the full-detail modal with separated work, documents, risks, and evidence

**Files:**
- Create: `app/src/components/FullDetailModal.tsx`
- Create: `app/src/components/FullDetailModal.test.tsx`
- Modify: `app/src/App.tsx`
- Create: `app/src/styles/modal.css`

**Interfaces:**
- `FullDetailModal` receives `{ open, node, work, documents, evidence, repositories, onClose }`.
- Tabs are exactly `overview | work | documents | risks | evidence`.

- [ ] **Step 1: Write failing modal behavior tests**

```tsx
it("opens details without changing the selected node and restores focus on close", async () => {
  const user = userEvent.setup();
  render(<App initialModel={model} />);
  const trigger = screen.getByRole("button", { name: "View all" });
  await user.click(trigger);
  expect(screen.getByRole("dialog", { name: "Project Control details" })).toBeVisible();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  expect(window.location.search).toBe("?node=project-control");
});

it("separates work, documents, risks, and evidence", async () => {
  const user = userEvent.setup();
  render(<FullDetailModal open {...modalProps} />);
  await user.click(screen.getByRole("tab", { name: "Work" }));
  expect(screen.getByRole("tabpanel")).toContainElement(screen.getByText("CORE_ROUTE pilot"));
  expect(screen.queryByText("Architecture and GUI Design")).not.toBeInTheDocument();
  await user.click(screen.getByRole("tab", { name: "Documents" }));
  expect(screen.getByText("Architecture and GUI Design")).toBeVisible();
  expect(screen.getByText("Retired note")).toHaveAccessibleDescription(/Historical/);
  await user.click(screen.getByRole("tab", { name: "Risks" }));
  expect(screen.getByText("Unknown migration scope")).toBeVisible();
  await user.click(screen.getByRole("tab", { name: "Evidence" }));
  expect(screen.getByText("bc2e1ef")).toHaveAccessibleDescription(/bc2e1efb60c7391b2d4b0978cf7c4b1105ef7444/);
});

it("traps focus, locks scroll, and closes on Escape", async () => {
  const user = userEvent.setup();
  render(<FullDetailModal open {...modalProps} />);
  expect(document.body).toHaveClass("modal-open");
  await user.tab({ shift: true });
  expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement);
  await user.keyboard("{Escape}");
  expect(document.body).not.toHaveClass("modal-open");
});
```

- [ ] **Step 2: Run tests and preserve RED**

Run: `npm test -- app/src/components/FullDetailModal.test.tsx`

Expected: FAIL because the modal does not exist.

- [ ] **Step 3: Implement accessible modal and tabs**

Use native `<dialog>` where supported with a tested fallback wrapper for jsdom. On open, record the trigger, focus the heading/first tab, trap Tab within the dialog, close on Escape/backdrop/close button, restore focus, and leave URL/current Node unchanged.

Render Markdown with:

```tsx
<ReactMarkdown skipHtml remarkPlugins={[remarkGfm]}>
  {document.content}
</ReactMarkdown>
```

Override links so only `https:` URLs and validated internal Document links render as clickable anchors. Other schemes render as text. Never use `rehype-raw` or `dangerouslySetInnerHTML`.

An internal Markdown link is clickable only when its normalized repository-relative path exactly equals the `path` of a Document passed to the modal. The renderer must not infer or traverse arbitrary filesystem paths.

The Risks tab contains active Documents with role `risk` or `unknown` plus blocked Work. The Evidence tab contains only Evidence IDs owned reciprocally by the current Node and resolves repository names through the registry. The Documents tab groups active, superseded, and retired records and labels the latter two as history.

- [ ] **Step 4: Run focused GREEN and Task 9 gate**

Run: `npm test -- app/src/components/FullDetailModal.test.tsx app/src/App.test.tsx && npm run type-check`

Expected: all tests and type-check pass.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/FullDetailModal* app/src/App.tsx app/src/styles/modal.css package.json package-lock.json
git commit -m "feat: inspect complete node details"
```

---

### Task 10: Finish the light visual system, responsive layout, and accessibility behavior

**Files:**
- Create: `app/src/styles/tokens.css`
- Create: `app/src/styles/layout.css`
- Create: `app/src/styles/accessibility.css`
- Modify: `app/src/styles/base.css`
- Modify: `app/src/styles/map.css`
- Modify: `app/src/styles/inspector.css`
- Modify: `app/src/styles/modal.css`
- Create: `app/src/accessibility.test.tsx`

**Interfaces:**
- Produces: CSS custom properties for surface/text/border and separate Truth/Work semantic colors.
- Produces: desktop center-map/right-inspector layout and narrow-screen stacked layout.

- [ ] **Step 1: Write failing accessibility and structural style tests**

```tsx
it("exposes map levels and current selection without relying on color", () => {
  render(<App initialModel={model} />);
  expect(screen.getByText("Current node")).toBeVisible();
  expect(screen.getByText("Child nodes")).toBeVisible();
  expect(screen.getByRole("button", { name: /Project Control, Current/ })).toBeVisible();
});

it("marks the current node and active tab semantically", async () => {
  render(<App initialModel={model} />);
  expect(screen.getByRole("button", { name: /FlowDoc/ })).toHaveAttribute("aria-current", "page");
});

it("ships visible focus and reduced-motion rules", async () => {
  const css = await readFile("app/src/styles/accessibility.css", "utf8");
  expect(css).toContain(":focus-visible");
  expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  expect(css).not.toMatch(/:focus-visible[^}]*outline:\s*none/);
});
```

- [ ] **Step 2: Run tests and preserve RED**

Run: `npm test -- app/src/accessibility.test.tsx`

Expected: FAIL until semantic labels and the final style system exist.

- [ ] **Step 3: Implement the approved light visual system**

Use neutral white/light surfaces. Ancestor/current/child position uses size, border weight, labels, and connectors. Truth colors and Work overlays use different token families. Keep the inspector width bounded and line lengths readable; at narrow widths, place the inspector below the map without moving full details out of the modal.

For reduced motion, remove map/modal transitions rather than merely shortening them. For forced-colors/high contrast, retain visible borders and current/selected indicators.

- [ ] **Step 4: Run focused GREEN and Task 10 gate**

Run: `npm test -- app/src/accessibility.test.tsx app/src && npm run type-check && npm run build`

Expected: component suite, type-check, and production build pass.

- [ ] **Step 5: Commit**

```bash
git add app/src/styles app/src/accessibility.test.tsx app/src/components app/src/App.tsx
git commit -m "feat: finish accessible light interface"
```

---

### Task 11: Prove the local end-to-end workflow and document operation

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/project-control.spec.ts`
- Create: `README.md`
- Create: `.flowdoc.local.example.json`
- Modify: `.gitignore`
- Modify: `package.json`

**Interfaces:**
- Produces: one-command `npm run check` gate.
- Produces: local commands `npm run dev`, `npm run generate`, `npm run check:data`, and `npm run test:e2e`.

- [ ] **Step 1: Write the failing browser path**

```ts
test("explores a node, reads its summary, and opens separated details", async ({ page }) => {
  await page.goto("/?node=flowdoc");
  await page.getByRole("button", { name: /Project Control/ }).click();
  await expect(page).toHaveURL(/\?node=project-control$/);
  await expect(page.getByRole("complementary")).toContainText("Project Control");
  await page.getByRole("button", { name: "View all" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("tab", { name: "Documents" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Architecture and GUI Design");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /FlowDoc, Ancestor/ }).click();
  await page.getByRole("button", { name: /Core/ }).click();
  await page.getByRole("button", { name: "View all" }).click();
  await page.getByRole("tab", { name: "Work" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("CORE_ROUTE");
});

test("keeps URL and map synchronized with browser history", async ({ page }) => {
  await page.goto("/?node=flowdoc");
  await page.getByRole("button", { name: /Core/ }).click();
  await page.goBack();
  await expect(page).toHaveURL(/\?node=flowdoc$/);
  await expect(page.getByRole("button", { name: /FlowDoc, Current/ })).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\?node=core$/);
});

test("shows diagnostics for a malformed served index", async ({ page }) => {
  await page.route("**/project-index.json", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ schemaVersion: 99 }),
  }));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Project data needs attention" })).toBeVisible();
  await expect(page.getByTestId("focus-stack-map")).toHaveCount(0);
});

test("keeps the map primary and the inspector concise at desktop and mobile widths", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?node=flowdoc");
  const map = await page.getByTestId("focus-stack-map").boundingBox();
  const inspector = await page.getByRole("complementary").boundingBox();
  expect(map).not.toBeNull();
  expect(inspector).not.toBeNull();
  expect(map!.x + map!.width).toBeLessThanOrEqual(inspector!.x);
  expect(inspector!.width).toBeLessThanOrEqual(420);
  await page.screenshot({ path: testInfo.outputPath("desktop-light.png"), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileMap = await page.getByTestId("focus-stack-map").boundingBox();
  const mobileInspector = await page.getByRole("complementary").boundingBox();
  expect(mobileInspector!.y).toBeGreaterThan(mobileMap!.y + mobileMap!.height - 1);
  await page.screenshot({ path: testInfo.outputPath("mobile-light.png"), fullPage: true });
});

test("opens full detail as a centered overlay", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?node=project-control");
  await page.getByRole("button", { name: "View all" }).click();
  const dialog = await page.getByRole("dialog").boundingBox();
  expect(dialog).not.toBeNull();
  expect(dialog!.width).toBeLessThan(1296);
  expect(Math.abs(dialog!.x + dialog!.width / 2 - 720)).toBeLessThan(4);
});
```

- [ ] **Step 2: Run E2E and preserve RED**

Run: `npx playwright install chromium && npm run test:e2e`

Expected: FAIL because Playwright config/server orchestration is absent.

- [ ] **Step 3: Configure the browser gate**

Configure Playwright `webServer.command` as `npm run dev -- --port 4173`, URL `http://127.0.0.1:4173`, reuse disabled in CI, and Chromium only. Assert the actual page URL host is `127.0.0.1`; do not bind a LAN interface.

Update the final package gate to:

```json
"check": "npm run check:data && npm run type-check && npm test && npm run build && npm run test:e2e"
```

- [ ] **Step 4: Document the exact operator workflow**

README must state:

1. `npm install`
2. `npm run generate`
3. `npm run dev`
4. Open `http://127.0.0.1:5173`
5. Edit only canonical files, never `generated/project-index.json`
6. Run `npm run check` before committing

Explain the authority split, data directories, read-only GUI, local config example, and explicit non-goals. `.flowdoc.local.example.json` maps the four checkout aliases to illustrative relative paths such as `../flowdoc-vnext-core`; `.flowdoc.local.json` remains ignored.

- [ ] **Step 5: Run complete pre-commit verification**

Run in this order:

```bash
npm run generate
npm run check:data
npm run type-check
npm test
npm run build
npm run test:e2e
npm run check
git diff --check
git status --short
git -C C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core status --short
git -C C:/Users/nekot/Documents/GitHub/flowdoc-vnext-editor status --short
git -C C:/Users/nekot/Documents/GitHub/flowdoc-vnext-backend status --short
```

Expected:

- Every command exits 0.
- `npm run generate` followed by `git status --short` produces no generated drift.
- All unit/component tests pass.
- All Playwright tests pass in Chromium.
- `dist/` and `.flowdoc.local.json` are untracked/ignored.
- No Core/Editor/Backend worktree is modified.

- [ ] **Step 6: Perform requirement scans**

Run:

```bash
rg -n "0\.0\.0\.0|dangerouslySetInnerHTML|rehype-raw|telemetry" app src tools package.json
rg -n "C:\\\\Users|Documents\\\\GitHub" data docs/GLOSSARY.md docs/GLOSSARY_TH.md docs/domains generated README.md
git diff --name-only $implementationBase..HEAD
```

Expected:

- First scan has no unsafe/network implementation matches; README may describe absence of telemetry outside this scan scope.
- Second scan has no machine-local absolute path.
- Changed paths from the once-captured implementation base are confined to this repository's Foundation/GUI/test/docs files.
- All three product repository status outputs are empty and their HEADs match the preflight records.

- [ ] **Step 7: Commit**

```bash
git add README.md .flowdoc.local.example.json .gitignore package.json package-lock.json playwright.config.ts tests/e2e
git commit -m "test: verify local project control workflow"
```

---

## Final Review Gate

After Task 11, request two read-only reviews against the complete implementation range:

1. **Contract review** — data separation, authority boundaries, truth/evidence rules, deterministic generation, and no false seed claims.
2. **GUI/operations review** — focus-stack behavior, inspector brevity, modal separation, accessibility, local-only operation, and diagnostic honesty.

Every Critical or Important finding requires a new behavior RED, minimum fix, focused GREEN, full `npm run check`, Playwright rerun, and fresh review of the corrected range. Do not call the implementation complete until both reviewers return READY with no Critical or Important findings.

Final evidence must report:

- implementation base and final commit hashes
- exact changed path set
- schema/semantic negative matrix result
- deterministic and stale-index result
- unit/component test counts
- production build result
- Playwright result
- local-only/unsafe-render/path scans
- final clean tracked working tree
- confirmation that Core/Editor/Backend were not modified

## Deferred Work

The following remain explicitly outside this implementation range:

- `CORE_ROUTE_*` migration execution
- migration tooling that edits product repositories
- AGENTS.md redesign
- custom Skills and context-package generator
- GUI write/edit operations
- database or network-hosted service
- public Doc API
- release/package orchestration
- cross-branch graph relations beyond the V1 primary parent tree; add a versioned Relation record only after a concrete pilot use case proves its shape

Each deferred area requires its own design review after evidence from the GUI and pilot migration exists.
