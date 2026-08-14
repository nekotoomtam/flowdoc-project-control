# Core Documentation Consolidation Foundation and CORE_ROUTE Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deterministic Core-document migration foundation, inventory all 470 captured Core Markdown files, and complete one reversible `CORE_ROUTE_*` family migration into Project Control.

**Architecture:** Project Control owns typed migration manifests, canonical documents, provenance, and the deletion gate. A read-only Git snapshot adapter reads Core content at one immutable commit, while stored validators close coverage and references without committing machine-local checkout paths. The pilot publishes canonical truth first, repairs Core references second, and deletes only the four frozen source documents after independent readiness review.

**Tech Stack:** TypeScript 7, Node.js 26, JSON Schema 2020-12, Ajv 8, Vitest 4, Git CLI through `execFile`, existing Project Control generator, Core Vitest/type-check gates.

**Approved design:** `docs/superpowers/specs/2026-08-13-core-documentation-consolidation-design.md`

**Roadmap boundary:** This plan implements design Phases 0–2 only. Editing, layout, rendering/export, long-tail, Core synthesis/closure, Editor/Backend adoption, and Agent/Skill architecture each require a later plan after this pilot is accepted.

## Global Constraints

- The inventory source is FlowDoc Core commit `76a2f2311a898e781f53773390d47b05812911e4`; abort if that commit is unavailable or the four pilot blobs differ.
- The release line is exactly `V0_1_0a_1` and canonical Core documents live under `docs/versions/V0_1_0a_1/core/`.
- Project Control owns migration manifests, design/current-state documents, risks, unknowns, work, Evidence, and history.
- Core retains only code-adjacent documentation and must receive no runtime behavior change in this plan.
- Prefix grouping proposes a family; it never proves authority or deletion eligibility.
- Every captured Markdown file is assigned exactly once in the inventory/family map, but only `CORE_ROUTE_*` reaches deletion in this plan.
- Useful historical reasoning is summarized under `Historical Design Notes`; full source files are not copied into Project Control.
- No machine-local absolute path, checkout path, timestamp generated from wall-clock time, or uncommitted hash may enter a tracked artifact.
- Project Control publication precedes Core deletion; both repositories use explicit, independently revertible commits.
- The deletion gate fails closed on source drift, missing coverage, duplicate assignment, unresolved active reference, missing canonical destination, missing Evidence, or unexpected file count.
- No source file is removed before an independent content/architecture review reports zero Critical and zero Important findings.
- Editor, Backend, runtime migration, public Doc API, GUI write operations, Agent roles, and Skills remain out of scope.
- Run each task in isolated linked worktrees created with `superpowers:using-git-worktrees`; never implement directly in a dirty primary checkout.
- Do not push, merge, tag, or mutate an existing stash while executing this plan.

## Repository and File Structure

Project Control worktree:

```text
src/migration/types.ts
schemas/document-migration.schema.json
tools/migration/inventory-core-docs.ts
tools/migration/check-core-docs.ts
tools/migration/lib/git-snapshot.ts
tools/migration/lib/markdown-references.ts
tools/migration/lib/inventory.ts
tools/migration/lib/validate-migration.ts
tests/fixtures/core-doc-repository.ts
tests/migration-schema.test.ts
tests/core-doc-inventory.test.ts
tests/core-doc-migration.test.ts
migrations/V0_1_0a_1/core/inventory.json
migrations/V0_1_0a_1/core/family-map.json
migrations/V0_1_0a_1/core/families/core-route/coverage.json
docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md
docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md
docs/versions/V0_1_0a_1/core/core-route/route-ownership-and-retained-contracts.md
docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md
data/nodes/core-route.json
data/documents/core-v0-1-0a-1-document-map.json
data/documents/core-route-overview.json
data/documents/core-route-retained-contracts.json
data/documents/core-route-migration-review.json
data/evidence/core-route-generation-contracts.json
data/evidence/core-route-artifact-contracts.json
data/evidence/core-route-public-boundary.json
data/evidence/core-route-cleanup.json
```

Core worktree:

```text
README.md
docs/PHASE_LEDGER.md
tests/coreRouteCanonicalMigrationGuard.test.ts
tests/canonicalDocumentationSpine.test.ts                 # separate test-only ancestry correction
docs/CORE_ROUTE_DEEXPORT_PLAN.md                         # delete
docs/CORE_ROUTE_DEPRECATION_WINDOW.md                   # delete
docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md       # delete
docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md        # delete
tests/coreRouteDeexportPlan.test.ts                      # replace/delete
tests/coreRouteDeprecationWindow.test.ts                 # replace/delete
tests/coreRouteRetainedContractRewrite.test.ts           # replace/delete
tests/coreRouteWindowCPublicExportRemoval.test.ts         # replace/delete
```

`src/migration/types.ts` owns persisted migration shapes. `git-snapshot.ts` is the only Git-process boundary. `inventory.ts` turns immutable Git entries into deterministic inventory/family data. `validate-migration.ts` owns stored closure checks and the external Core deletion preflight. Canonical Markdown contains human-readable truth; JSON records only register and prove it.

---

### Task 1: Define the Migration Contract

**Files:**
- Create: `src/migration/types.ts`
- Create: `schemas/document-migration.schema.json`
- Create: `tests/migration-schema.test.ts`

**Interfaces:**
- Consumes: existing `SCHEMA_VERSION` conventions and Ajv 2020 setup from `tools/lib/load-sources.ts`.
- Produces: `CoreMarkdownInventory`, `CoreFamilyMap`, `FamilyCoverage`, `CoverageDisposition`, and a strict JSON schema with definitions `inventory`, `familyMap`, and `familyCoverage`.

- [ ] **Step 1: Write schema tests before the contract exists**

Create fixtures in `tests/migration-schema.test.ts` with the exact discriminators below. Assert that Ajv accepts one complete instance of each kind and an alternate uppercase 40-hex `sourceCommit`, and rejects: an absolute path, a 39-character blob, a short or nonhex `sourceCommit`, duplicate scalar document IDs, `ready-for-deletion` with an empty canonical document list, and `closed` without a Core cleanup commit. The persisted schema validates commit structure only; the Task 3 production CLI owns the policy that the published inventory must use the frozen Core snapshot commit. Duplicate object paths are rejected semantically in Task 4.

```ts
const validInventory = {
  kind: "core-document-inventory",
  schemaVersion: 1,
  releaseLine: "V0_1_0a_1",
  repositoryId: "repo-core",
  sourceCommit: "76a2f2311a898e781f53773390d47b05812911e4",
  expectedFileCount: 1,
  sourceDigest: "a".repeat(64),
  files: [{
    path: "docs/CORE_ROUTE_DEEXPORT_PLAN.md",
    blobId: "b".repeat(40),
    title: "Core Route De-export Plan",
    candidateFamily: "core-route",
    outboundMarkdownLinks: [],
    inboundMarkdownReferences: [],
    repositoryReferences: [],
  }],
};
```

- [ ] **Step 2: Run the focused test and preserve the RED**

Run: `npm test -- tests/migration-schema.test.ts`

Expected: FAIL because `schemas/document-migration.schema.json` does not exist.

- [ ] **Step 3: Add exact persisted TypeScript shapes**

Implement these public shapes in `src/migration/types.ts`:

```ts
export type MigrationReleaseLine = "V0_1_0a_1";
export type FamilyReviewState = "candidate" | "pilot-reviewed";
export type CoreDocumentClass =
  | "design"
  | "plan"
  | "decision"
  | "risk"
  | "unknown"
  | "status-or-closeout"
  | "migration"
  | "verification-or-audit"
  | "contract-or-code-adjacent-reference"
  | "operational-readme"
  | "historical-working-record";
export type ProvisionalDisposition =
  | "candidate-current"
  | "historical-input"
  | "duplicate"
  | "repo-local-keep"
  | "needs-review";
export type CoverageStatus = "draft" | "content-reviewed" | "ready-for-deletion" | "closed";
export type CoverageDisposition =
  | "canonical-section"
  | "historical-note"
  | "repo-local-keep"
  | "discarded-duplicate";

export interface InventoryLink {
  rawTarget: string;
  resolvedPath: string | null;
}

export interface InventoryRepositoryReference {
  kind: "code" | "test" | "contract";
  target: string;
}

export interface CoreInventoryFile {
  path: string;
  blobId: string;
  title: string;
  candidateFamily: string;
  outboundMarkdownLinks: InventoryLink[];
  inboundMarkdownReferences: string[];
  repositoryReferences: InventoryRepositoryReference[];
}

export interface CoreMarkdownInventory {
  kind: "core-document-inventory";
  schemaVersion: 1;
  releaseLine: MigrationReleaseLine;
  repositoryId: "repo-core";
  sourceCommit: string;
  expectedFileCount: number;
  sourceDigest: string;
  files: CoreInventoryFile[];
}

export interface CoreFamilyAssignment {
  familyId: string;
  reviewState: FamilyReviewState;
  sources: Array<{
    path: string;
    documentClass: CoreDocumentClass;
    authorityAssessment: string;
    provisionalDisposition: ProvisionalDisposition;
    canonicalDestination: string | null;
    migrationStatus: "classified" | "migrated" | "removed-from-core";
  }>;
}

export interface CoreFamilyMap {
  kind: "core-document-family-map";
  schemaVersion: 1;
  releaseLine: MigrationReleaseLine;
  inventoryDigest: string;
  families: CoreFamilyAssignment[];
}

export interface FamilyCoverageSource {
  path: string;
  blobId: string;
  disposition: CoverageDisposition;
  destinationPath: string | null;
  destinationSection: string | null;
  rationale: string;
}

export interface HistoricalReferenceAllowance {
  sourcePath: string;
  line: number;
  targetPath: string;
  lineSha256: string;
  rationale: string;
}

export interface FamilyCoverage {
  kind: "core-document-family-coverage";
  schemaVersion: 1;
  releaseLine: MigrationReleaseLine;
  familyId: string;
  sourceCommit: string;
  inventoryDigest: string;
  status: CoverageStatus;
  canonicalDocumentIds: string[];
  sources: FamilyCoverageSource[];
  activeReferences: Array<{ sourcePath: string; line: number; targetPath: string }>;
  retainedHistoricalReferences: HistoricalReferenceAllowance[];
  projectControlPublicationCommit: string | null;
  coreCleanupCommit: string | null;
}
```

- [ ] **Step 4: Implement strict JSON Schema conditions**

Use `additionalProperties: false` at every object level. Use relative-path rejection matching the existing Project Control schema. Validate every `sourceCommit`, blob ID, and publication/cleanup commit structurally as exactly 40 hexadecimal characters using the existing Git object convention; do not encode the frozen Core snapshot commit as a schema `const`. Add `if/then` conditions so both `ready-for-deletion` and `closed` require nonempty `canonicalDocumentIds`, empty `activeReferences`, and a 40-character `projectControlPublicationCommit`; `closed` additionally requires a 40-character `coreCleanupCommit`. Historical allowances require positive line numbers, a 64-character lowercase SHA-256 line hash, and nonempty rationale. Add `uniqueItems: true` where scalar arrays must be unique; semantic duplicate path checks remain in Task 4 because JSON Schema cannot enforce object-key uniqueness.

- [ ] **Step 5: Run focused and existing schema tests**

Run: `npm test -- tests/migration-schema.test.ts tests/schema.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit the migration contract**

```powershell
git add src/migration/types.ts schemas/document-migration.schema.json tests/migration-schema.test.ts
git diff --cached --check
git commit -m "feat(docs): define Core migration records"
```

### Task 2: Capture an Immutable Core Markdown Inventory

**Files:**
- Create: `tools/migration/lib/git-snapshot.ts`
- Create: `tools/migration/lib/markdown-references.ts`
- Create: `tools/migration/lib/inventory.ts`
- Create: `tests/fixtures/core-doc-repository.ts`
- Create: `tests/core-doc-inventory.test.ts`

**Interfaces:**
- Consumes: `CoreMarkdownInventory` and `CoreFamilyMap` from Task 1.
- Produces: `readGitMarkdownSnapshot(repositoryRoot, commit)`, `extractMarkdownLinks(sourcePath, markdown)`, `buildCoreMarkdownInventory(input)`, and `buildCandidateFamilyMap(inventory)`.

- [ ] **Step 1: Build a disposable Git fixture and write failing tests**

`tests/fixtures/core-doc-repository.ts` must create a temporary repository, configure a local test identity, commit two Markdown files plus one TypeScript file, and return `{ root, commit }`. Tests must prove:

```ts
const inventory = await buildCoreMarkdownInventory({
  repositoryRoot: fixture.root,
  repositoryId: "repo-core",
  releaseLine: "V0_1_0a_1",
  sourceCommit: fixture.commit,
});

expect(inventory.files.map((file) => file.path)).toEqual([
  "README.md",
  "docs/CORE_ROUTE_SAMPLE.md",
]);
expect(inventory.files[1]?.candidateFamily).toBe("core-route");
expect(inventory.expectedFileCount).toBe(2);
```

After the commit, mutate a worktree file and assert the returned blob/content still comes from the captured commit. Add a Markdown link with a fragment, query, external URL, image, reference definition, and code fence; assert only resolvable local Markdown destinations become `resolvedPath` values. Add `src/generation/runtime.ts`, `tests/runtime.test.ts`, and `schemas/runtime.schema.json` in visible inline code and assert they become code, test, and contract repository references. Assert the linked destination receives the source path in `inboundMarkdownReferences`.

- [ ] **Step 2: Run the inventory test and preserve the RED**

Run: `npm test -- tests/core-doc-inventory.test.ts`

Expected: FAIL because the three migration libraries do not exist.

- [ ] **Step 3: Implement the single Git boundary**

In `git-snapshot.ts`, call Git only through promisified `execFile`; never use a shell command string. Export:

```ts
export interface GitMarkdownBlob {
  path: string;
  blobId: string;
  content: string;
}

export async function readGitMarkdownSnapshot(
  repositoryRoot: string,
  commit: string,
): Promise<GitMarkdownBlob[]>;
```

Resolve `commit^{commit}`, require exact equality with the requested 40-character commit, parse `git ls-tree -r -z --full-tree`, filter `.md`/`.markdown` with code-unit ordering, and read each blob with `git show commit:path`. Reject symlink entries, non-blob entries, duplicate normalized paths, invalid UTF-8, and Git errors with sanitized repository-independent diagnostics.

- [ ] **Step 4: Implement deterministic Markdown link extraction**

`extractMarkdownLinks` must ignore fenced code, inline code, images, and external schemes. Resolve relative `.md`/`.markdown` targets against the source directory, remove query/fragment for path comparison, normalize `/`, and return `resolvedPath: null` for anchors, mail, HTTP(S), and repository-external paths. Sort by raw target then resolved path using the existing code-unit comparator. Export `extractRepositoryReferences(markdown)`: inspect visible inline-code tokens and link destinations for normalized paths beginning `src/`, `tests/`, `packages/`, `schemas/`, `contracts/`, or `fixtures/`; classify `tests/` and `.test.ts` as test, `schemas/`, `contracts/`, and `fixtures/` as contract, and remaining `src/`/`packages/` paths as code. Deduplicate by kind and target.

- [ ] **Step 5: Implement inventory and candidate-family builders**

Derive title from the first ATX H1, falling back to the filename without extension. Strip the extension, then match `^([A-Z0-9]+_[A-Z0-9]+)(?:_|$)`; lowercase the captured two segments and replace `_` with `-`. This produces `core-route`, `template-builder`, `text-engine`, `pdf-canonical`, and the other approved two-segment candidates. Use `long-tail` when the basename does not match. Every semantic exception is an explicit path-to-family override with a regression test. After all outbound links are known, derive inbound references by reversing only destinations that exist in the captured inventory. Hash framed UTF-8 path/blob/title/inbound/outbound/repository-reference fields with SHA-256 so concatenation cannot collide.

`buildCandidateFamilyMap` must assign every inventory path exactly once, sort families and paths by code unit, and initialize every source as `documentClass: "historical-working-record"`, `authorityAssessment: "Unreviewed candidate; executable evidence is required before authority or deletion decisions."`, `provisionalDisposition: "needs-review"`, `canonicalDestination: null`, and `migrationStatus: "classified"`. Set only `core-route` to `pilot-reviewed`; every other family is `candidate`. These are safe starter values, not final authority claims.

- [ ] **Step 6: Run focused tests and type-check**

Run: `npm test -- tests/core-doc-inventory.test.ts tests/migration-schema.test.ts`

Run: `npm run type-check`

Expected: PASS.

- [ ] **Step 7: Commit the immutable inventory engine**

```powershell
git add tools/migration/lib tests/fixtures/core-doc-repository.ts tests/core-doc-inventory.test.ts
git diff --cached --check
git commit -m "feat(docs): inventory Core Markdown at a Git commit"
```

### Task 3: Publish the 470-File Inventory and Candidate Family Map

**Files:**
- Create: `tools/migration/inventory-core-docs.ts`
- Create: `migrations/V0_1_0a_1/core/inventory.json`
- Create: `migrations/V0_1_0a_1/core/family-map.json`
- Modify: `package.json`
- Modify: `tests/core-doc-inventory.test.ts`

**Interfaces:**
- Consumes: inventory builders from Task 2, an execution-only `--source-root` argument, and an injectable expected-source-commit policy for disposable test repositories.
- Produces: `runInventoryCli(args, expectedSourceCommit?)`, deterministic tracked inventory/family-map JSON, and a production CLI entrypoint whose default expected commit is exactly `76a2f2311a898e781f53773390d47b05812911e4`; no checkout path is serialized.

- [ ] **Step 1: Write the CLI RED**

Add a fixture test that invokes:

```ts
await runInventoryCli([
  "--source-root", fixture.root,
  "--source-commit", fixture.commit,
  "--output-root", outputRoot,
], fixture.commit);
```

Assert two newline-terminated JSON files, byte-identical output on a second run, no fixture absolute path, and failure if `--source-commit` is not 40 hexadecimal characters. Also invoke `runInventoryCli` with a different valid 40-hex `--source-commit` than the injected expected commit and assert rejection. Finally, invoke it without an injected expected commit and assert that any 40-hex commit other than `76a2f2311a898e781f53773390d47b05812911e4` is rejected by the production policy before Git access.

- [ ] **Step 2: Run the focused RED**

Run: `npm test -- tests/core-doc-inventory.test.ts`

Expected: FAIL because `runInventoryCli` is unavailable.

- [ ] **Step 3: Implement the CLI and scripts**

Export `runInventoryCli(args: string[], expectedSourceCommit = FROZEN_CORE_COMMIT): Promise<void>` and define `FROZEN_CORE_COMMIT` as exactly `76a2f2311a898e781f53773390d47b05812911e4`. Parse only the three named flags, reject duplicates/unknown flags, structurally validate both commit arguments as exactly 40 hexadecimal characters, reject when `--source-commit` differs from `expectedSourceCommit`, build both artifacts in memory, validate them against `document-migration.schema.json`, and atomically replace outputs only after both validate. The production module entrypoint calls `runInventoryCli(process.argv.slice(2))`, so only the exact frozen commit is authorized outside an explicitly injected test policy. Add:

```json
{
  "scripts": {
    "inventory:core-docs": "tsx tools/migration/inventory-core-docs.ts"
  }
}
```

Preserve every existing script exactly.

- [ ] **Step 4: Capture the approved Core snapshot**

Run from Project Control:

```powershell
$coreRoot = $env:FLOWDOC_CORE_ROOT
if ([string]::IsNullOrWhiteSpace($coreRoot)) { throw 'FLOWDOC_CORE_ROOT is required.' }
npm run inventory:core-docs -- --source-root $coreRoot --source-commit 76a2f2311a898e781f53773390d47b05812911e4 --output-root migrations/V0_1_0a_1/core
```

This path is execution input only. Inspect the artifacts and require:

```powershell
$inventory = Get-Content -Raw migrations/V0_1_0a_1/core/inventory.json | ConvertFrom-Json
if ($inventory.expectedFileCount -ne 470) { throw 'Captured Core Markdown count drifted.' }
if (($inventory.files | Where-Object candidateFamily -eq 'core-route').Count -ne 4) { throw 'CORE_ROUTE pilot membership drifted.' }
```

- [ ] **Step 5: Review all candidate assignments without claiming authority**

Inspect all 470 family-map source entries against filename, first heading, directory, and immediate references. Correct demonstrably misgrouped candidates by adding an explicit deterministic path override in `inventory.ts`; each override needs a regression test. Assign the best supported document class. Mark operational READMEs, package/example instructions, license/security/contribution files, and machine-required reference documents as `repo-local-keep` only when their code-adjacent need is explicit in `authorityAssessment`. Leave ambiguous authority as `needs-review`; use `candidate-current`, `historical-input`, or `duplicate` only when the source itself supports that provisional label. Keep `canonicalDestination: null` outside the pilot and do not change non-pilot `reviewState` from `candidate`.

- [ ] **Step 6: Run pre-review determinism and final leakage/closure gates**

Before Step 5 edits, hash both output files, run the inventory command a second time, hash them again, and require the two SHA-256 pairs to match. After review edits, do not regenerate over the reviewed map; run schema and semantic closure checks instead. Use:

```powershell
$before = Get-FileHash migrations/V0_1_0a_1/core/inventory.json,migrations/V0_1_0a_1/core/family-map.json -Algorithm SHA256
npm run inventory:core-docs -- --source-root $coreRoot --source-commit 76a2f2311a898e781f53773390d47b05812911e4 --output-root migrations/V0_1_0a_1/core
$after = Get-FileHash migrations/V0_1_0a_1/core/inventory.json,migrations/V0_1_0a_1/core/family-map.json -Algorithm SHA256
if (Compare-Object $before.Hash $after.Hash) { throw 'Inventory generation is not deterministic.' }
```

Then run:

```powershell
rg -n '[A-Za-z]:\\|AppData|[/\\]Temp[/\\]' migrations/V0_1_0a_1/core
```

Expected: no matches.

- [ ] **Step 7: Commit the captured Phase 1 artifacts**

```powershell
git add package.json tools/migration/inventory-core-docs.ts tests/core-doc-inventory.test.ts migrations/V0_1_0a_1/core/inventory.json migrations/V0_1_0a_1/core/family-map.json
git diff --cached --check
git commit -m "docs: capture Core Markdown inventory"
```

### Task 4: Add Stored Closure and External Deletion-Readiness Checks

**Files:**
- Create: `tools/migration/lib/validate-migration.ts`
- Create: `tools/migration/check-core-docs.ts`
- Create: `tests/core-doc-migration.test.ts`
- Modify: `tools/check.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: inventory, family map, coverage, Project Control records, canonical Markdown, and optional external Core checkout.
- Produces: `validateStoredCoreMigration(projectRoot)`, `evaluateFamilyDeletionReadiness(input)`, `verifyFamilyCleanup(input)`, and CLI `runCoreDocsCheck(args)`.

```ts
export interface DeletionReadiness {
  familyId: string;
  sourceCommit: string;
  sourcePaths: string[];
  ready: boolean;
  diagnostics: ProjectDiagnostic[];
}
```

- [ ] **Step 1: Write the closure matrix before implementation**

Build tests from copied fixture objects, never by weakening the real schema. Require deterministic diagnostics for:

- inventory path duplicated or missing from family map;
- inventory digest mismatch;
- coverage source missing, duplicated, or blob-changed;
- `needs-review` equivalent represented by coverage status `draft`;
- canonical destination file absent;
- canonical document ID absent from `data/documents`;
- unresolved active reference;
- an exact old-path mention not covered by a matching historical-reference line hash;
- a stale historical allowance after its Core line changes;
- unexpected source deletion before `ready-for-deletion`;
- a repo-local keep presented for deletion;
- cleanup verification while one covered source still exists.

Positive fixture result:

```ts
expect(await evaluateFamilyDeletionReadiness(input)).toEqual({
  familyId: "core-route",
  sourceCommit: fixture.commit,
  sourcePaths: ["docs/CORE_ROUTE_SAMPLE.md"],
  ready: true,
  diagnostics: [],
});
```

- [ ] **Step 2: Run the closure RED**

Run: `npm test -- tests/core-doc-migration.test.ts`

Expected: FAIL because `validate-migration.ts` does not exist.

- [ ] **Step 3: Implement stored validation**

`validateStoredCoreMigration` must validate all three JSON kinds, verify `inventory.sourceDigest === familyMap.inventoryDigest`, prove exact one-family assignment for every inventory path, validate coverage source/blob membership, verify every destination and registered `DocumentRecord`, and return no object containing an absolute local path. If `migrations/V0_1_0a_1/core/` is wholly absent (temporary unit fixtures), return without diagnostics; if the directory or any one canonical artifact exists, require the complete stored set and fail on partial presence.

- [ ] **Step 4: Implement external readiness and cleanup checks**

`evaluateFamilyDeletionReadiness` reuses `readGitMarkdownSnapshot` for the captured commit, compares current working-tree source bytes to the captured blobs, and scans every tracked UTF-8 Core text file outside the deletion set for literal mentions of covered paths. Markdown links, README navigation, source/test strings, and code spans are active unless an exact mention matches a `retainedHistoricalReferences` entry by source path, target path, one-based line, normalized line SHA-256, and rationale. Export `collectCoveredPathMentions(sourceRoot, targetPaths)` so Task 8 can obtain those exact values without duplicating scanning logic. It checks `git status --porcelain` is empty before reporting ready and must not mutate either repository.

`verifyFamilyCleanup` requires every covered non-keep source to be absent at `HEAD`, the coverage `coreCleanupCommit` to equal that HEAD, all active references to remain zero, and the Core worktree to be clean.

- [ ] **Step 5: Wire stored checks into normal Project Control validation**

Call `validateStoredCoreMigration` from `checkProjectIndex` after index freshness succeeds. Add scripts:

```json
{
  "scripts": {
    "check:migrations": "tsx tools/migration/check-core-docs.ts --stored-only",
    "check:migration:core": "tsx tools/migration/check-core-docs.ts"
  }
}
```

The external mode requires explicit `--source-root` and `--family core-route`; stored-only mode never discovers a checkout from the machine. Define three exclusive external phases: normal readiness requires a clean tree with all sources present, `--cleanup-candidate` permits only the exact four staged deletions, and `--closed` requires a clean Core HEAD equal to `coverage.coreCleanupCommit` with all covered non-keep sources absent. Add `--report-mentions` to print the deterministic `collectCoveredPathMentions` JSON without changing readiness state; it may be combined only with normal readiness.

- [ ] **Step 6: Run focused and Project Control regression gates**

Run: `npm test -- tests/core-doc-migration.test.ts tests/core-doc-inventory.test.ts tests/generation.test.ts`

Run: `npm run type-check`

Expected: PASS.

- [ ] **Step 7: Commit fail-closed validation**

```powershell
git add tools/migration tools/check.ts package.json tests/core-doc-migration.test.ts
git diff --cached --check
git commit -m "feat(docs): gate Core document deletion"
```

### Task 5: Synthesize the CORE_ROUTE Canonical Family

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`
- Create: `docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md`
- Create: `docs/versions/V0_1_0a_1/core/core-route/route-ownership-and-retained-contracts.md`
- Create: `migrations/V0_1_0a_1/core/families/core-route/coverage.json`
- Modify: `tests/core-doc-migration.test.ts`

**Interfaces:**
- Consumes: the four exact inventory rows at Core commit `76a2f2311a898e781f53773390d47b05812911e4`, current Core source/tests, and the approved historical-note policy.
- Produces: one bounded canonical leaf, one family overview, an honest partial release map, and draft one-to-one coverage for all four source blobs.

- [ ] **Step 1: Add real-root tests for the four-source pilot**

Test the tracked Project Control root. Require the coverage source paths to equal exactly:

```ts
const coreRouteSources = [
  "docs/CORE_ROUTE_DEEXPORT_PLAN.md",
  "docs/CORE_ROUTE_DEPRECATION_WINDOW.md",
  "docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md",
  "docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md",
];
```

Require every coverage blob to match `inventory.json`, require one destination leaf, and require the leaf headings:

```ts
const requiredHeadings = [
  "## Purpose and Scope",
  "## Current Ownership Boundary",
  "## Retained Core Contracts",
  "## Public Export State",
  "## Verification Anchors",
  "## Risks and Unknowns",
  "## Historical Design Notes",
  "## Provenance",
];
```

Also assert `DOCUMENT_MAP.md` says Core consolidation is incomplete and does not link a nonexistent `CORE_OVERVIEW.md`.

- [ ] **Step 2: Run the real-root RED**

Run: `npm test -- tests/core-doc-migration.test.ts`

Expected: FAIL because the coverage and canonical documents are absent.

- [ ] **Step 3: Resolve current truth from executable anchors**

Before writing prose, inspect and record exact evidence from:

```text
src/index.ts
src/generation/runtime.ts
src/generation/artifactManifest.ts
src/generation/artifactJob.ts
src/generation/apiRoute.ts
src/generation/artifactApiRoute.ts
tests/generationRuntimeRetainedContract.test.ts
tests/artifactRetainedContract.test.ts
tests/coreRouteRetainedContractRewrite.test.ts
```

The leaf must state only what these files prove: route-shaped helpers are not public exports; retained readiness/manifest/job contracts remain public; deprecated route source remains internal; Backend owns HTTP-shaped route envelopes. External-consumer uncertainty remains an explicit unknown.

- [ ] **Step 4: Write the canonical leaf and historical notes**

Summarize Window A/B/C as historical design context, not current steps. Preserve the reasons for the compatibility window and retained-contract rewrite. Do not copy old task lists, PASS/FAIL boilerplate, or four full source documents. In `Provenance`, link to the coverage record and list the captured Core commit.

- [ ] **Step 5: Write the family overview and partial document map**

`OVERVIEW.md` explains the route boundary and links only the canonical leaf. `DOCUMENT_MAP.md` lists the completed `core-route` family, labels `CORE_OVERVIEW.md` as intentionally unpublished until Core synthesis, links `docs/GLOSSARY.md` and `docs/GLOSSARY_TH.md`, and states that all other Core families remain candidate/inventory state.

- [ ] **Step 6: Write draft coverage**

Map all four sources to specific sections of `route-ownership-and-retained-contracts.md`. Use `canonical-section` for active ownership/export facts and `historical-note` for compatibility-window reasoning. Because one source cannot have two dispositions, choose the section that carries its material contribution and describe secondary coverage in `rationale`. Set:

```json
{
  "status": "draft",
  "canonicalDocumentIds": [],
  "activeReferences": [],
  "retainedHistoricalReferences": [],
  "projectControlPublicationCommit": null,
  "coreCleanupCommit": null
}
```

- [ ] **Step 7: Run the content and closure tests**

Run: `npm test -- tests/core-doc-migration.test.ts`

Run: `npm run check:migrations`

Expected: PASS for draft stored closure; external deletion readiness must still report not ready.

- [ ] **Step 8: Commit the canonical draft**

```powershell
git add docs/versions/V0_1_0a_1/core migrations/V0_1_0a_1/core/families/core-route/coverage.json tests/core-doc-migration.test.ts
git diff --cached --check
git commit -m "docs: synthesize Core route ownership"
```

### Task 6: Register the Reviewed Family in Project Control

**Files:**
- Create: `data/nodes/core-route.json`
- Create: `data/documents/core-v0-1-0a-1-document-map.json`
- Create: `data/documents/core-route-overview.json`
- Create: `data/documents/core-route-retained-contracts.json`
- Create: `data/evidence/core-route-generation-contracts.json`
- Create: `data/evidence/core-route-artifact-contracts.json`
- Create: `data/evidence/core-route-public-boundary.json`
- Modify: `data/nodes/core.json`
- Modify: `data/work/core-route-pilot.json`
- Modify: `migrations/V0_1_0a_1/core/families/core-route/coverage.json`
- Modify: `tests/seed-project.test.ts`
- Modify: `generated/project-index.json`

**Interfaces:**
- Consumes: reviewed Task 5 Markdown and current Core test/source anchors at the frozen Core commit.
- Produces: a current `core-route` Node with reciprocal Documents/Evidence, while the parent Core Node remains honestly `unknown` and pilot Work remains `in-review`.

- [ ] **Step 1: Request content review before changing truth records**

Provide the reviewer the four source blobs, canonical leaf, family overview, coverage mapping, Core source/tests, and design. The reviewer must answer:

1. Does every current claim have executable support?
2. Is any plan/history presented as current behavior?
3. Is all material historical reasoning preserved once, without duplication?
4. Does each source blob have one honest destination/disposition?
5. Are risks and unknowns explicit?

Do not continue until Critical = 0 and Important = 0. Apply every accepted finding with a new focused RED where machine-checkable, rerun Task 5 gates, and request a fresh verdict.

- [ ] **Step 2: Write the Project Control registration RED**

Extend `tests/seed-project.test.ts` to require:

```ts
expect(model.nodes.find((node) => node.id === "core-route")).toMatchObject({
  parentId: "core",
  truthState: "current",
  documentIds: ["doc-core-route-overview", "doc-core-route-retained-contracts"],
  evidenceIds: [
    "evidence-core-route-artifact-contracts",
    "evidence-core-route-generation-contracts",
    "evidence-core-route-public-boundary",
  ],
});
expect(model.nodes.find((node) => node.id === "core")?.truthState).toBe("unknown");
expect(model.work.find((work) => work.id === "work-core-route-pilot")?.workState).toBe("in-review");
```

- [ ] **Step 3: Run the seed RED**

Run: `npm test -- tests/seed-project.test.ts`

Expected: FAIL because `core-route` is not registered.

- [ ] **Step 4: Add reciprocal Node and Document records**

Use these exact IDs:

```text
core-route
doc-core-v0-1-0a-1-document-map
doc-core-route-overview
doc-core-route-retained-contracts
evidence-core-route-generation-contracts
evidence-core-route-artifact-contracts
evidence-core-route-public-boundary
```

The three Evidence records reference Core commit `76a2f2311a898e781f53773390d47b05812911e4` and respectively:

```text
tests/generationRuntimeRetainedContract.test.ts
tests/artifactRetainedContract.test.ts
src/index.ts
```

Use this exact Node shape and the same deterministic timestamp for the three Evidence records:

```json
{
  "kind": "node",
  "id": "core-route",
  "title": "Core Route Ownership",
  "parentId": "core",
  "summary": "Core retains readiness, artifact manifest, and artifact job contracts; Backend owns HTTP-shaped route envelopes.",
  "truthState": "current",
  "order": 10,
  "documentIds": ["doc-core-route-overview", "doc-core-route-retained-contracts"],
  "evidenceIds": ["evidence-core-route-artifact-contracts", "evidence-core-route-generation-contracts", "evidence-core-route-public-boundary"],
  "repositoryIds": ["repo-core", "repo-project-control"]
}
```

```json
{
  "kind": "evidence",
  "id": "evidence-core-route-generation-contracts",
  "nodeIds": ["core-route"],
  "repositoryId": "repo-core",
  "commit": "76a2f2311a898e781f53773390d47b05812911e4",
  "pathOrContractId": "tests/generationRuntimeRetainedContract.test.ts",
  "verificationSummary": "Direct tests verify retained generation request parsing and readiness behavior without public route-helper ownership.",
  "verifiedAt": "2026-08-13T00:00:00.000Z"
}
```

The artifact Evidence uses `tests/artifactRetainedContract.test.ts` and names manifest/job planning and transitions. The public-boundary Evidence uses `src/index.ts` and states only that route-shaped modules are absent while retained generation modules remain exported. Register the map as role `version`, the overview as `current-state`, and the leaf as `contract`. Each Document `repositoryRefs` lists the relevant frozen Core source/test paths; the map additionally references approved design commit `d79b88c23a307e7ec49437a015804d7a4d2de4bf`.

Add the document map to parent `core.documentIds`, but keep `core.truthState` as `unknown`. Set pilot Work to `in-review`, keep `requiredEvidence: []`, and state that Core cleanup evidence is still pending.

- [ ] **Step 5: Mark coverage content-reviewed**

Set `status` to `content-reviewed`, add the overview and leaf Document IDs, and keep both commit fields null. This status proves content review only; it must not unlock deletion.

- [ ] **Step 6: Generate and run Project Control gates**

Run: `npm run generate`

Run: `npm run check:data`

Run: `npm test -- tests/seed-project.test.ts tests/core-doc-migration.test.ts tests/generation.test.ts`

Run: `npm run type-check`

Expected: PASS.

- [ ] **Step 7: Commit reviewed registration**

```powershell
git add data migrations/V0_1_0a_1/core/families/core-route/coverage.json tests/seed-project.test.ts generated/project-index.json
git diff --cached --check
git commit -m "docs: register reviewed Core route truth"
```

Record this commit as `$projectControlPublicationCommit`; do not write it into coverage yet because reference repair and deletion readiness are not complete.

### Task 7: Repair Core References, Restore the Guard Contract, and Stabilize the Core Handoff

**Files:**
- Create: `tests/coreRouteCanonicalMigrationGuard.test.ts` in Core
- Modify: `README.md` in Core
- Modify: `docs/PHASE_LEDGER.md` in Core
- Delete: `tests/coreRouteDeexportPlan.test.ts` in Core
- Delete: `tests/coreRouteDeprecationWindow.test.ts` in Core
- Delete: `tests/coreRouteRetainedContractRewrite.test.ts` in Core
- Delete: `tests/coreRouteWindowCPublicExportRemoval.test.ts` in Core
- Modify in a separate correction commit: `tests/canonicalDocumentationSpine.test.ts` in Core

**Interfaces:**
- Consumes: the active canonical Project Control paths and retained Core source/tests.
- Produces: `$coreTask7GuardCommit`, the amended seven-path reference-repair/guard commit; `$coreBaselineTestCorrectionCommit`, a separate one-path test correction; and `$coreReferenceRepairCommit`, the final clean Core handoff commit captured only after both commits pass fresh scoped review.
- Preserves: deletion authority remains exclusively owned by Task 8. Neither Task 7 commit creates historical allowances, changes coverage, deletes a source document, or claims readiness.

- [ ] **Step 1: Write the consolidated guard before deleting old tests**

The new Core test must prove:

```ts
expect(index).not.toContain("./generation/apiRoute.js");
expect(index).not.toContain("./generation/artifactApiRoute.js");
expect(index).toContain("./generation/runtime.js");
expect(index).toContain("./generation/artifactManifest.js");
expect(index).toContain("./generation/artifactJob.js");
expect(generationRoute).toContain("@deprecated Window B compatibility export");
expect(artifactRoute).toContain("@deprecated Window B compatibility export");
```

Also prove retained tests name `assessVNextGenerationReadiness`, `safeParseVNextGenerationRequest`, `createVNextArtifactManifestPlan`, `createVNextArtifactJobPlan`, and `advanceVNextArtifactJob`. Parse every named-import block whose module specifier is exactly `../src/index.js`; normalize `type` imports and aliases to their imported names. For each of the two retained tests independently, reject every member of this exact set:

```ts
const FORBIDDEN_ROUTE_RESPONSE_HELPERS = [
  "createVNextGenerationApiRouteResponse",
  "createVNextArtifactGenerationApiRouteResponse",
  "createVNextArtifactStatusApiRouteResponse",
  "createVNextSessionArtifactListApiRouteResponse",
  "createVNextArtifactDownloadMetadataApiRouteResponse",
] as const
```

Restore the remaining code-focused assertions formerly owned by the four deleted tests:

- `tests/generationApiRoute.test.ts` and `tests/artifactApiRoute.test.ts` are absent;
- neither `src/generation/apiRoute.ts` nor `src/generation/artifactApiRoute.ts` contains an import whose specifier names `flowdoc-vnext-backend`;
- the generation route source names the exact Backend owner `flowdoc-vnext-backend/src/routes/generationRoute.ts`, retained owner `src/generation/runtime.ts`, and retained helper `assessVNextGenerationReadiness`; `src/generation/runtime.ts` and its retained test keep both `assessVNextGenerationReadiness` and `safeParseVNextGenerationRequest`;
- the artifact route source names the exact Backend owner `flowdoc-vnext-backend/src/routes/artifactRoute.ts` and retained owners `src/generation/artifactManifest.ts` and `src/generation/artifactJob.ts`; those retained owner files and their retained test keep `createVNextArtifactManifestPlan`, `createVNextArtifactJobPlan`, and `advanceVNextArtifactJob`;
- `@deprecated Window B compatibility export` is attached to the exported route constants and the five route response helper functions that actually carry the marker. Do not assert that the route types or interfaces are deprecated.

- [ ] **Step 2: Run the new guard alongside the four old tests**

Run from Core: `npm test -- tests/coreRouteCanonicalMigrationGuard.test.ts tests/coreRouteDeexportPlan.test.ts tests/coreRouteDeprecationWindow.test.ts tests/coreRouteRetainedContractRewrite.test.ts tests/coreRouteWindowCPublicExportRemoval.test.ts`

Expected: PASS before replacement, proving the new guard retains executable assertions.

- [ ] **Step 3: Repair active navigation**

Replace README navigation entries for the four source documents with one canonical Project Control link:

```text
https://github.com/nekotoomtam/flowdoc-project-control/blob/main/docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md
```

In `PHASE_LEDGER.md`, retain phase history but mark the four paths as former source paths migrated to Project Control; use plain code-form provenance, not active Markdown links. These literal historical path mentions must later be allowlisted in coverage with their one-based lines and normalized line hashes. Do not rewrite unrelated phases.

- [ ] **Step 4: Remove document-coupled tests**

Delete only the four listed tests after the consolidated guard passes. Do not remove retained-contract tests or change runtime source.

- [ ] **Step 5: Run reference and Core gates**

Run the Project Control external check against the still-uncommitted exact Task 7 Core worktree:

```powershell
npm run check:migration:core -- --source-root $coreWorktree --family core-route
```

Expected exit code: `1`.

Expected diagnostics, and no others:

- exactly four `MIGRATION_ACTIVE_PATH_MENTION` diagnostics, one for each plain-code former-source row in `docs/PHASE_LEDGER.md` naming the four covered Core source paths;
- exactly one `MIGRATION_COVERAGE_NOT_READY` because coverage remains `content-reviewed`;
- exactly one `MIGRATION_SOURCE_TREE_DIRTY` because the exact Task 7 repair has not been committed yet.

Any mention outside those four `docs/PHASE_LEDGER.md` rows, any source drift, any missing destination, or any additional diagnostic is a blocker. Do not create historical allowances in Task 7; Task 8 owns the mention report and the exact reviewed allowances.

Run from Core: `npm test -- tests/coreRouteCanonicalMigrationGuard.test.ts tests/generationRuntimeRetainedContract.test.ts tests/artifactRetainedContract.test.ts`

Run from Core: `npm run check`

Expected: PASS.

- [ ] **Step 6: Commit reference repair separately in Core**

```powershell
git add README.md docs/PHASE_LEDGER.md tests
git diff --cached --check
git commit -m "test: detach Core route guards from historical docs"
$coreTask7GuardCommit = (git rev-parse HEAD).Trim()
if ($coreTask7GuardCommit -notmatch '^[0-9a-f]{40}$') { throw "Core Task 7 guard commit is not a 40-character Git commit." }
if (git status --short) { throw "Core worktree is not clean after the Task 7 guard commit." }
```

Do not capture `$coreReferenceRepairCommit` yet. The seven-path commit is not the final Task 8 handoff until the review findings below are corrected and both resulting commits are independently reviewed.

- [ ] **Step 7: Reproduce the retained-import review finding as a RED**

Task 7 already has an unpushed seven-path commit at the start of this correction round. Require its exact execution state before editing:

```powershell
$coreTask7OriginalCommit = (git rev-parse HEAD).Trim()
if ($coreTask7OriginalCommit -ne '1b6945e76f39fe59f4660246601df460501f5cf9') { throw "Unexpected Core Task 7 review-finding base." }
$coreTask7BaseCommit = (git rev-parse "$coreTask7OriginalCommit^").Trim()
if ($coreTask7BaseCommit -ne '76a2f2311a898e781f53773390d47b05812911e4') { throw "Unexpected Core Task 7 parent." }
if (git status --short) { throw "Core worktree must be clean before the Task 7 fix round." }
```

First add table-driven mutation tests inside `tests/coreRouteCanonicalMigrationGuard.test.ts`. Keep the actual original named-import block from each retained test, including every original imported name. Add one distinct sentinel named-import block and one block containing the injected forbidden helper, then place the helper block first, middle, and last across equivalent three-block fixtures. Cover both retained tests × all five forbidden helpers × all three placements.

For every case, compare the complete sorted imported-name union, not mere membership of the injected helper. The expected union is the original first-block names below plus the sentinel name plus the injected helper:

```ts
const EXPECTED_RETAINED_IMPORTS = {
  "tests/generationRuntimeRetainedContract.test.ts": [
    "assessVNextGenerationReadiness",
    "safeParseVNextGenerationRequest",
  ],
  "tests/artifactRetainedContract.test.ts": [
    "advanceVNextArtifactJob",
    "createVNextArtifactJobPlan",
    "createVNextArtifactManifestPlan",
    "VNextArtifactJobRecord",
    "VNextArtifactManifestRecord",
  ],
} as const
const MULTI_BLOCK_SENTINEL = "VNextGenerationReadinessResult"
```

Normalize `type` and `imported as local` syntax before union comparison. Require exact equality with no missing or unexpected imported name. This matrix must fail an implementation that reads only the first block, only the last block, or overwrites earlier results with a later block. Run:

```powershell
npm test -- tests/coreRouteCanonicalMigrationGuard.test.ts
```

Expected: FAIL because the current `source.match(...)` implementation inspects only one matching import block and cannot return the complete expected union. Preserve this RED output in the ignored Task 7 report. Then add the direct assertions from Step 1 before changing the parser; these assertions may already pass, but the first/middle/last union matrix must remain RED until all matching blocks are collected.

- [ ] **Step 8: Make the consolidated guard complete and amend only the unpushed Task 7 commit**

Replace the single-match parser with global collection over all exact `../src/index.js` named-import blocks. Flatten all imported names, strip a leading `type`, normalize `imported as local` to `imported`, and keep both retained test files under the same five-symbol forbidden set. Add the absence, no-Backend-import, exact retained-owner/helper, and factual deprecation-anchor assertions from Step 1.

Run from Core:

```powershell
npm test -- tests/coreRouteCanonicalMigrationGuard.test.ts tests/generationRuntimeRetainedContract.test.ts tests/artifactRetainedContract.test.ts
```

Expected: PASS. Before amending, prove the correction delta contains only the consolidated guard:

```powershell
$fixPaths = @(git diff --name-only)
if ($fixPaths.Count -ne 1 -or $fixPaths[0] -ne 'tests/coreRouteCanonicalMigrationGuard.test.ts') { throw "Task 7 fix round changed more than the consolidated guard." }
git add tests/coreRouteCanonicalMigrationGuard.test.ts
git diff --cached --check
git commit --amend --no-edit
$coreTask7GuardCommit = (git rev-parse HEAD).Trim()
if ($coreTask7GuardCommit -eq $coreTask7OriginalCommit) { throw "Task 7 amendment did not create a corrected commit." }
if ($coreTask7GuardCommit -notmatch '^[0-9a-f]{40}$') { throw "Amended Task 7 guard commit is invalid." }
if ((git rev-parse HEAD).Trim() -ne $coreTask7GuardCommit) { throw "Core HEAD does not equal the recaptured Task 7 guard commit." }
if (git status --short) { throw "Core worktree is not clean after the amended Task 7 commit." }
if ((git rev-parse "$coreTask7GuardCommit^").Trim() -ne $coreTask7BaseCommit) { throw "Amended Task 7 guard parent drifted." }
$expectedTask7Paths = @(
  'README.md',
  'docs/PHASE_LEDGER.md',
  'tests/coreRouteCanonicalMigrationGuard.test.ts',
  'tests/coreRouteDeexportPlan.test.ts',
  'tests/coreRouteDeprecationWindow.test.ts',
  'tests/coreRouteRetainedContractRewrite.test.ts',
  'tests/coreRouteWindowCPublicExportRemoval.test.ts'
) | Sort-Object
$task7Paths = @(git diff --name-only $coreTask7BaseCommit $coreTask7GuardCommit) | Sort-Object
if (Compare-Object $expectedTask7Paths $task7Paths) { throw "Amended Task 7 range is not the exact seven-path change." }
```

Immediately regenerate the ignored review package with the updated hashes by running the required `review-package` helper from `superpowers:subagent-driven-development` with Core as the Git working directory. Before changing directories, resolve the tracked Project Control path `docs/superpowers/plans/2026-08-13-core-documentation-consolidation-pilot.md` to its runtime absolute path and pass that value as the plan argument; pass `$coreTask7BaseCommit` as BASE, `$coreTask7GuardCommit` as HEAD, and an ignored output filename containing both recaptured short hashes. Verify its header is exactly `# Review package: $coreTask7BaseCommit..$coreTask7GuardCommit`. Never reuse a package generated for `$coreTask7OriginalCommit`.

The exact seven-path invariant applies only to `$coreTask7BaseCommit..$coreTask7GuardCommit`; it does not describe the later final handoff range.

- [ ] **Step 9: Obtain a fresh scoped review of the amended seven-path Task 7 commit**

Give a fresh reviewer the approved design, this amended plan, the original two Important findings, the complete-union RED mutation evidence, focused GREEN output, and the freshly generated package for exactly `$coreTask7BaseCommit..$coreTask7GuardCommit`. Require explicit verification that every named import block is inspected, all five forbidden helpers are rejected in both retained tests, every restored code-focused assertion is factual, only the consolidated guard changed during the fix round, and the full seven-path Task 7 scope remains exact.

Critical or Important findings require a new RED and another guard-only amendment. For every such review-driven amendment, run the complete focused gates and then immediately execute this identity refresh before requesting the next review:

```powershell
$previousCoreTask7GuardCommit = $coreTask7GuardCommit
git add tests/coreRouteCanonicalMigrationGuard.test.ts
git diff --cached --check
git commit --amend --no-edit
$coreTask7GuardCommit = (git rev-parse HEAD).Trim()
if ($coreTask7GuardCommit -notmatch '^[0-9a-f]{40}$') { throw "Review-amended Task 7 guard commit is invalid." }
if ($coreTask7GuardCommit -eq $previousCoreTask7GuardCommit) { throw "Review amendment did not change the Task 7 guard commit." }
if ((git rev-parse HEAD).Trim() -ne $coreTask7GuardCommit) { throw "Core HEAD does not equal the review-amended guard commit." }
if ((git rev-parse "$coreTask7GuardCommit^").Trim() -ne $coreTask7BaseCommit) { throw "Review-amended guard parent drifted." }
if (git status --short) { throw "Core must be clean after the review-driven guard amendment." }
$reviewFixPaths = @(git diff --name-only $previousCoreTask7GuardCommit $coreTask7GuardCommit)
if ($reviewFixPaths.Count -ne 1 -or $reviewFixPaths[0] -ne 'tests/coreRouteCanonicalMigrationGuard.test.ts') { throw "Review-driven guard correction changed another path." }
$expectedTask7Paths = @(
  'README.md',
  'docs/PHASE_LEDGER.md',
  'tests/coreRouteCanonicalMigrationGuard.test.ts',
  'tests/coreRouteDeexportPlan.test.ts',
  'tests/coreRouteDeprecationWindow.test.ts',
  'tests/coreRouteRetainedContractRewrite.test.ts',
  'tests/coreRouteWindowCPublicExportRemoval.test.ts'
) | Sort-Object
$task7Paths = @(git diff --name-only $coreTask7BaseCommit $coreTask7GuardCommit) | Sort-Object
if (Compare-Object $expectedTask7Paths $task7Paths) { throw "Review-amended Task 7 range drifted from its exact paths." }
```

Regenerate the review package immediately from the recaptured `$coreTask7GuardCommit`, verify the exact range header, and give only that updated package to the next fresh reviewer. Repeat this recapture/validation/package sequence after every guard review amendment. Do not proceed until the verdict is Critical = 0 and Important = 0.

- [ ] **Step 10: Preserve the baseline-publication ancestry failure as a separate RED**

Keep Core at the exact clean `$coreTask7GuardCommit`. Run the real full gate before editing the baseline test:

```powershell
npm run check
```

Expected: nonzero because `tests/canonicalDocumentationSpine.test.ts` derives published baseline content from topology-dependent `HEAD^`; at this descendant HEAD it expects `76a2f2311a898e781f53773390d47b05812911e4`, while `docs/coordination/DEVELOPMENT_BASELINE.json` remains correctly anchored to `732793d9bfc11a374121181a2efaaa78a110d7bc`. Preserve the real full-check RED. If an unrelated load-only timeout also occurs, rerun the named timeout test in isolation and record it separately; it does not replace the reproducible baseline mismatch.

In `tests/canonicalDocumentationSpine.test.ts`, add fixture-first tests for a history resolver with this contract:

```ts
function baselinePublicationContentCommit(repositoryRoot: string): string
```

The resolver must derive the unique reachable commit that added `docs/coordination/DEVELOPMENT_BASELINE.json`, validate it as one lowercase 40-hex commit with exactly one valid 40-hex parent, prove the path exists at the add commit and is absent at its parent, and return that parent. Tests must prove:

1. a fixture with content commit → baseline-publication commit → one later unrelated descendant returns the original content commit both immediately after publication and at the later descendant;
2. zero add commits fail closed;
3. add → remove → re-add, which yields multiple add commits, fails closed;
4. a root commit that adds the baseline but has no parent fails closed;
5. malformed, ambiguous, or non-commit history output is rejected rather than accepted as a content commit.

Keep malformed-output coverage deterministic with small pure parsers in the same test file: one parser requires exactly one lowercase 40-hex addition line, and one parser requires exactly `<addition-commit> <single-parent-commit>` with both commits lowercase 40-hex and no extra parent. Feed them empty, duplicate, short, nonhex, and multi-parent strings directly; fixture repositories prove the real Git behavior.

Run the focused test before implementing the resolver:

```powershell
npm test -- tests/canonicalDocumentationSpine.test.ts
```

Expected: FAIL for the new history behavior and for the two real-root baseline assertions. Do not change the baseline JSON, manifest, canonical documents, generator, checker, or runtime.

- [ ] **Step 11: Implement the history-derived baseline test correction and commit one path**

Implement the minimum resolver using argument-array Git invocations and the tested strict parsers. Use `git log --diff-filter=A --format=%H -- docs/coordination/DEVELOPMENT_BASELINE.json` to obtain additions, require exactly one nonempty result, use `git rev-list --parents -n 1 <add-commit>` to require one and only one parent, verify both hashes resolve as commits, and prove path presence at the addition plus path absence at its parent with `git cat-file -e`. Replace `task5ContentCommit()` and all `HEAD^` selection with the new resolver; no repository-topology assumption may remain.

Run from Core:

```powershell
npm test -- tests/canonicalDocumentationSpine.test.ts
npm run check
git diff --check
```

Expected: PASS. Prove the correction scope and commit it separately:

```powershell
$baselineFixPaths = @(git diff --name-only)
if ($baselineFixPaths.Count -ne 1 -or $baselineFixPaths[0] -ne 'tests/canonicalDocumentationSpine.test.ts') { throw "Baseline ancestry correction changed more than its one test file." }
git add tests/canonicalDocumentationSpine.test.ts
git diff --cached --check
git commit -m "test(docs): stabilize baseline publication ancestry"
$coreBaselineTestCorrectionCommit = (git rev-parse HEAD).Trim()
if ($coreBaselineTestCorrectionCommit -notmatch '^[0-9a-f]{40}$') { throw "Core baseline-test correction commit is invalid." }
if ((git rev-parse HEAD).Trim() -ne $coreBaselineTestCorrectionCommit) { throw "Core HEAD does not equal the baseline-test correction commit." }
if ((git rev-parse "$coreBaselineTestCorrectionCommit^").Trim() -ne $coreTask7GuardCommit) { throw "Baseline-test correction parent is not the reviewed Task 7 guard commit." }
if (git status --short) { throw "Core worktree is not clean after the baseline-test correction." }
$baselineCorrectionPaths = @(git diff --name-only $coreTask7GuardCommit $coreBaselineTestCorrectionCommit)
if ($baselineCorrectionPaths.Count -ne 1 -or $baselineCorrectionPaths[0] -ne 'tests/canonicalDocumentationSpine.test.ts') { throw "Committed baseline correction is not the exact one-path range." }
```

Immediately regenerate a distinct ignored review package from `$coreTask7GuardCommit..$coreBaselineTestCorrectionCommit`, name it from both recaptured short hashes, and verify its exact range header before review.

- [ ] **Step 12: Review the one-path correction, verify the final handoff, then capture it**

Give a fresh reviewer the newly generated separate package for exactly `$coreTask7GuardCommit..$coreBaselineTestCorrectionCommit`. Require confirmation that the range contains only `tests/canonicalDocumentationSpine.test.ts`, derives the unique baseline-add commit and its parent, fails closed on zero/multiple/invalid history, remains invariant under later descendant commits, and does not change baseline JSON, manifest, documents, runtime, or deletion authority.

Critical or Important findings require a new RED, correction in the same one-path scope, amendment of the still-unpushed correction commit, and full Core gates. After every such review-driven amendment, immediately execute:

```powershell
$previousCoreBaselineTestCorrectionCommit = $coreBaselineTestCorrectionCommit
git add tests/canonicalDocumentationSpine.test.ts
git diff --cached --check
git commit --amend --no-edit
$coreBaselineTestCorrectionCommit = (git rev-parse HEAD).Trim()
if ($coreBaselineTestCorrectionCommit -notmatch '^[0-9a-f]{40}$') { throw "Review-amended baseline correction commit is invalid." }
if ($coreBaselineTestCorrectionCommit -eq $previousCoreBaselineTestCorrectionCommit) { throw "Review amendment did not change the baseline correction commit." }
if ((git rev-parse HEAD).Trim() -ne $coreBaselineTestCorrectionCommit) { throw "Core HEAD does not equal the review-amended baseline correction." }
if ((git rev-parse "$coreBaselineTestCorrectionCommit^").Trim() -ne $coreTask7GuardCommit) { throw "Review-amended baseline correction parent drifted." }
if (git status --short) { throw "Core must be clean after the review-driven baseline amendment." }
$reviewBaselineFixPaths = @(git diff --name-only $previousCoreBaselineTestCorrectionCommit $coreBaselineTestCorrectionCommit)
if ($reviewBaselineFixPaths.Count -ne 1 -or $reviewBaselineFixPaths[0] -ne 'tests/canonicalDocumentationSpine.test.ts') { throw "Review-driven baseline correction changed another path." }
$baselineCorrectionPaths = @(git diff --name-only $coreTask7GuardCommit $coreBaselineTestCorrectionCommit)
if ($baselineCorrectionPaths.Count -ne 1 -or $baselineCorrectionPaths[0] -ne 'tests/canonicalDocumentationSpine.test.ts') { throw "Review-amended baseline range drifted from its exact path." }
```

Regenerate the baseline review package immediately from the updated hash pair, verify its exact header, and give only that updated package to the next fresh reviewer. Repeat after every baseline review amendment.

Only after both scoped reviews pass, rerun `npm run check` at the exact committed HEAD and require PASS and a clean Core worktree. Then capture and validate all identities:

```powershell
$coreReferenceRepairCommit = (git rev-parse HEAD).Trim()
if ($coreReferenceRepairCommit -ne $coreBaselineTestCorrectionCommit) { throw "Final Core handoff does not include both reviewed commits." }
if (git status --short) { throw "Core worktree must be clean at final Task 7 handoff." }
```

Record in the ignored Task 7 report: `$coreTask7BaseCommit`, `$coreTask7GuardCommit`, `$coreBaselineTestCorrectionCommit`, `$coreReferenceRepairCommit`, the exact seven-path range `$coreTask7BaseCommit..$coreTask7GuardCommit`, the exact one-path range `$coreTask7GuardCommit..$coreBaselineTestCorrectionCommit`, both review verdicts, and post-commit full-check evidence. Review packages must never collapse these two ranges into one alleged one-commit or exact-seven-path final handoff.

From Project Control, run the external check against the final exact clean `$coreReferenceRepairCommit`:

```powershell
npm run check:migration:core -- --source-root $coreWorktree --family core-route
```

Expected exit code: `1`.

Expected diagnostics, and no others:

- exactly four `MIGRATION_ACTIVE_PATH_MENTION` diagnostics for the four `docs/PHASE_LEDGER.md` former-source rows;
- exactly one `MIGRATION_COVERAGE_NOT_READY` because coverage remains `content-reviewed`.

`MIGRATION_SOURCE_TREE_DIRTY` must be absent. The exact diagnostic multiset must remain unchanged from the amended seven-path commit: the same four `MIGRATION_ACTIVE_PATH_MENTION` source/target/line identities plus one `MIGRATION_COVERAGE_NOT_READY`, and no others. This unchanged five-diagnostic RED is the stable final Task 7 handoff to Task 8; neither reviewed Core commit grants deletion authority.

### Task 8: Prove Deletion Readiness and Publish the Review Record

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md`
- Create: `data/documents/core-route-migration-review.json`
- Modify: `data/nodes/core-route.json`
- Modify: `data/work/core-route-pilot.json`
- Modify: `migrations/V0_1_0a_1/core/families/core-route/coverage.json`
- Modify: `tests/core-doc-migration.test.ts`
- Modify: `tests/seed-project.test.ts`
- Modify: `generated/project-index.json`

**Interfaces:**
- Consumes: the exact `$projectControlPublicationCommit` from Task 6; the reviewed seven-path `$coreTask7GuardCommit`; the reviewed one-path `$coreBaselineTestCorrectionCommit`; and the exact final clean `$coreReferenceRepairCommit`, which equals the latter commit and includes both reviewed commits in history.
- Produces: `ready-for-deletion` coverage and a durable human review record; it performs no Core deletion.

- [ ] **Step 1: Run the external preflight as a RED**

First prove Core still points to the final clean Task 7 handoff after both reviewed commits:

```powershell
if ((git -C $coreWorktree rev-parse HEAD).Trim() -ne $coreReferenceRepairCommit) { throw "Core HEAD drifted after the two-commit Task 7 handoff." }
if (git -C $coreWorktree status --short) { throw "Core worktree must be clean before Task 8." }
```

Then run:

```powershell
npm run check:migration:core -- --source-root $coreWorktree --family core-route
```

Expected exit code: `1`.

Expected diagnostics, and no others:

- exactly four `MIGRATION_ACTIVE_PATH_MENTION` diagnostics for the four `docs/PHASE_LEDGER.md` former-source rows;
- exactly one `MIGRATION_COVERAGE_NOT_READY` because coverage is still `content-reviewed`.

`MIGRATION_SOURCE_TREE_DIRTY` must be absent. Any non-ledger mention, source drift, missing destination, changed Core commit, or additional diagnostic is a separate blocker and must be corrected before continuing. This RED intentionally remains identical to the clean post-commit Task 7 gate until Task 8 publishes reviewed historical allowances.

- [ ] **Step 2: Conduct independent readiness review**

Give a fresh reviewer:

- approved design and this plan;
- exact inventory/family/coverage artifacts;
- all canonical documents and Project Control records;
- the separate Core review packages for `$coreTask7BaseCommit..$coreTask7GuardCommit` and `$coreTask7GuardCommit..$coreBaselineTestCorrectionCommit`, plus both zero-Critical/zero-Important verdicts;
- retained source/test anchors;
- Task 6 output and the final Task 7 full-check/five-diagnostic handoff output.

Require explicit answers for coverage closure, authority honesty, reference closure, guard preservation, rollback, and exact deletion scope. Critical and Important findings block readiness.

- [ ] **Step 3: Write the review record from actual evidence**

`MIGRATION_REVIEW.md` records the literal `$projectControlPublicationCommit`, `$coreTask7GuardCommit`, `$coreBaselineTestCorrectionCommit`, and final `$coreReferenceRepairCommit`; identifies the seven-path and one-path review ranges separately; records the exact four source paths/blobs, tests run, reference-scan result, reviewer verdict, rollback procedure, remaining risks/unknowns; and uses the statement “ready for source deletion” only after the verdict passes. Do not write simulated command output.

- [ ] **Step 4: Register review and update coverage**

Task 8 is the sole owner of mention reporting, historical-allowance creation, and the transition to `ready-for-deletion`. Before changing coverage, run the mention report against the exact clean `$coreReferenceRepairCommit`:

```powershell
npm run check:migration:core -- --source-root $coreWorktree --family core-route --report-mentions
```

Expected exit code: `1`; `--report-mentions` reports exactly four mentions, all in the four `docs/PHASE_LEDGER.md` former-source rows, while readiness diagnostics remain exactly four `MIGRATION_ACTIVE_PATH_MENTION` plus one `MIGRATION_COVERAGE_NOT_READY`. There must be no README mention, test mention, dirty-tree diagnostic, source drift, missing destination, or other diagnostic.

Add `doc-core-route-migration-review` reciprocally to `core-route`. Update Work summary to say deletion is authorized but cleanup Evidence remains outstanding. Convert each of the four reported `docs/PHASE_LEDGER.md` mentions to one concrete `HistoricalReferenceAllowance` using its returned source path, target path, one-based line, normalized line SHA-256, and the fixed rationale `Preserves a completed Core phase's former source path at the captured Core commit.` Do not allowlist any README or test mention. Set `status` to `ready-for-deletion`, `activeReferences` to `[]`, `projectControlPublicationCommit` to the literal value held in `$projectControlPublicationCommit`, and `coreCleanupCommit` to `null`. Apply the concrete line numbers, hashes, and commit to JSON with `apply_patch`; the tracked file must contain no shell variables or inferred placeholders.

- [ ] **Step 5: Run the readiness GREEN**

Run: `npm run generate`

Run: `npm run check:data`

Run: `npm test -- tests/core-doc-migration.test.ts tests/seed-project.test.ts`

Run the external check again:

```powershell
npm run check:migration:core -- --source-root $coreWorktree --family core-route
```

Expected exit code: `0`, `ready: true`, `diagnostics: []`, and the exact four covered source paths. This is the first zero-diagnostic readiness result; no earlier Task 7 or Task 8 step may claim zero active mentions before the four exact historical allowances exist.

- [ ] **Step 6: Commit deletion authorization in Project Control**

```powershell
$projectControlTask8BaseCommit = (git rev-parse HEAD).Trim()
if ($projectControlTask8BaseCommit -notmatch '^[0-9a-f]{40}$') { throw "Project Control Task 8 base commit is invalid." }
git add docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md data migrations/V0_1_0a_1/core/families/core-route/coverage.json tests generated/project-index.json
git diff --cached --check
git commit -m "docs: authorize Core route source cleanup"
$projectControlDeletionAuthorizationCommit = (git rev-parse HEAD).Trim()
if ($projectControlDeletionAuthorizationCommit -notmatch '^[0-9a-f]{40}$') { throw "Project Control deletion-authorization commit is invalid." }
if ((git rev-parse "$projectControlDeletionAuthorizationCommit^").Trim() -ne $projectControlTask8BaseCommit) { throw "Project Control Task 8 commit parent drifted." }
if (git status --short) { throw "Project Control must be clean after Task 8." }
```

### Task 9: Delete Only the Four Authorized Core Sources

**Files:**
- Delete: `docs/CORE_ROUTE_DEEXPORT_PLAN.md` in Core
- Delete: `docs/CORE_ROUTE_DEPRECATION_WINDOW.md` in Core
- Delete: `docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md` in Core
- Delete: `docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md` in Core

**Interfaces:**
- Consumes: the passing Task 8 deletion-readiness result.
- Produces: one Core cleanup commit containing exactly four document deletions and no runtime/source change.

- [ ] **Step 1: Reconfirm immutable targets immediately before deletion**

Run the external readiness check and save its stdout in the ignored task report. Then run:

```powershell
git status --short
git diff --name-only HEAD
```

Expected: clean Core worktree and exact captured blobs for all four paths. Stop if another process changed either repository.

- [ ] **Step 2: Delete the exact allowlist**

Use `git rm --` with the four literal paths. Do not use a wildcard, recursive delete, prefix search, or generated list.

- [ ] **Step 3: Verify staged scope before tests**

```powershell
$expected = @(
  'docs/CORE_ROUTE_DEEXPORT_PLAN.md',
  'docs/CORE_ROUTE_DEPRECATION_WINDOW.md',
  'docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md',
  'docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md'
) | Sort-Object
$actual = @(git diff --cached --name-only) | Sort-Object
if (Compare-Object $expected $actual) { throw 'Unexpected Core cleanup scope.' }
```

- [ ] **Step 4: Run Core and cross-repository closure gates**

Run from Core: `npm run check`

Run from Project Control against the staged Core worktree using a cleanup-candidate mode that validates absent covered sources while reading the captured base from coverage:

```powershell
npm run check:migration:core -- --source-root $coreWorktree --family core-route --cleanup-candidate
```

Expected: PASS; no active reference and no uncovered deletion.

- [ ] **Step 5: Commit exact Core cleanup**

```powershell
$coreCleanupBaseCommit = (git rev-parse HEAD).Trim()
if ($coreCleanupBaseCommit -ne $coreReferenceRepairCommit) { throw "Core cleanup base is not the final reviewed Task 7 handoff." }
git diff --cached --check
git commit -m "docs: remove migrated Core route records"
$coreCleanupCommit = (git rev-parse HEAD).Trim()
if ($coreCleanupCommit -notmatch '^[0-9a-f]{40}$') { throw "Core cleanup commit is invalid." }
if ((git rev-parse "$coreCleanupCommit^").Trim() -ne $coreCleanupBaseCommit) { throw "Core cleanup commit parent drifted." }
if (git status --short) { throw "Core must be clean after Task 9." }
$expectedCleanupPaths = @(
  'docs/CORE_ROUTE_DEEXPORT_PLAN.md',
  'docs/CORE_ROUTE_DEPRECATION_WINDOW.md',
  'docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md',
  'docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md'
) | Sort-Object
$cleanupPaths = @(git diff --name-only $coreCleanupBaseCommit $coreCleanupCommit) | Sort-Object
if (Compare-Object $expectedCleanupPaths $cleanupPaths) { throw "Committed Task 9 range is not the exact four-source deletion." }
```

Record `$coreCleanupBaseCommit..$coreCleanupCommit` as the exact Task 9 four-deletion review range. It is distinct from both Task 7 Core ranges.

### Task 10: Close the Pilot Transaction and Verify Both Repositories

**Files:**
- Create: `data/evidence/core-route-cleanup.json`
- Modify: `data/nodes/core-route.json`
- Delete: `data/work/core-route-pilot.json`
- Modify: `migrations/V0_1_0a_1/core/families/core-route/coverage.json`
- Modify: `docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md`
- Modify: `tests/core-doc-migration.test.ts`
- Modify: `tests/seed-project.test.ts`
- Modify: `tests/e2e/project-control.spec.ts`
- Modify: `generated/project-index.json`

**Interfaces:**
- Consumes: actual Core cleanup commit from Task 9.
- Produces: closed coverage, cleanup Evidence, no unfinished pilot Work, clean repositories, and a reviewed template for the next family-specific plan.

- [ ] **Step 1: Write final-state REDs**

Require:

```ts
expect(coverage.status).toBe("closed");
expect(coverage.coreCleanupCommit).toMatch(/^[a-f0-9]{40}$/);
expect(model.work.some((work) => work.id === "work-core-route-pilot")).toBe(false);
expect(model.evidence.find((item) => item.id === "evidence-core-route-cleanup")).toMatchObject({
  repositoryId: "repo-core",
  commit: coverage.coreCleanupCommit,
  pathOrContractId: "docs/",
});
```

Run: `npm test -- tests/core-doc-migration.test.ts tests/seed-project.test.ts`

Expected: FAIL because the transaction is still `ready-for-deletion`.

The non-technical UI lifecycle contract is also exact: after closure, opening Core's full-detail dialog and selecting the Work tab must visibly render the durable empty state `No active work is recorded.` and must not render the retired `CORE_ROUTE` pilot Work entry. Keep this as an interaction-level Playwright assertion in `tests/e2e/project-control.spec.ts`; an internal JSON-only assertion does not satisfy the contract. Do not redesign the UI or alter any other E2E behavior.

- [ ] **Step 2: Finalize coverage and Evidence with the real commit**

Set `coreCleanupCommit` to `$coreCleanupCommit`, set status `closed`, add `evidence-core-route-cleanup` to the Node, and remove the pilot Work record. The cleanup Evidence summary must name the exact four removed paths and the passing Core gate. Update `MIGRATION_REVIEW.md` with post-cleanup verification without rewriting the earlier readiness verdict.

- [ ] **Step 3: Regenerate and run Project Control gates**

First regenerate the closure candidate, then preserve the existing E2E assertion as the test-first RED:

```powershell
npm run generate
npm run test:e2e -- --grep "explores a node, reads its summary, and opens separated details"
```

Expected RED: the Work tab visibly contains `No active work is recorded.`, so the stale assertion expecting `CORE_ROUTE` fails.

Then change only that Work-tab assertion in `tests/e2e/project-control.spec.ts`:

```ts
const workPanel = page.getByRole("tabpanel");
await expect(workPanel).toContainText("No active work is recorded.");
await expect(workPanel).not.toContainText("CORE_ROUTE");
```

Run the same focused Playwright command again. Expected GREEN: PASS, proving the visible closed lifecycle rather than only the generated JSON state.

Run all Project Control gates:

Run:

```powershell
npm run check:data
npm run type-check
npm test
npm run build
npm run test:e2e
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 4: Verify the closed family against Core HEAD**

Run:

```powershell
npm run check:migration:core -- --source-root $coreWorktree --family core-route --closed
```

Expected: exact cleanup commit match, all four sources absent, active references zero, both worktrees clean apart from the intended Project Control finalization diff.

- [ ] **Step 5: Commit Project Control closure**

```powershell
$projectControlTask10BaseCommit = (git rev-parse HEAD).Trim()
if ($projectControlTask10BaseCommit -notmatch '^[0-9a-f]{40}$') { throw "Project Control Task 10 base commit is invalid." }
$expectedTask10Paths = @(
  'data/evidence/core-route-cleanup.json',
  'data/nodes/core-route.json',
  'data/work/core-route-pilot.json',
  'docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md',
  'generated/project-index.json',
  'migrations/V0_1_0a_1/core/families/core-route/coverage.json',
  'tests/core-doc-migration.test.ts',
  'tests/e2e/project-control.spec.ts',
  'tests/seed-project.test.ts'
) | Sort-Object
git add -- $expectedTask10Paths
$actualTask10Paths = @(git diff --cached --name-only) | Sort-Object
if (Compare-Object $expectedTask10Paths $actualTask10Paths) { throw "Staged Task 10 scope is not the exact nine paths." }
git diff --cached --check
git commit -m "docs: close Core route migration pilot"
$projectControlClosureCommit = (git rev-parse HEAD).Trim()
if ($projectControlClosureCommit -notmatch '^[0-9a-f]{40}$') { throw "Project Control closure commit is invalid." }
if ((git rev-parse "$projectControlClosureCommit^").Trim() -ne $projectControlTask10BaseCommit) { throw "Project Control Task 10 commit parent drifted." }
if (git status --short) { throw "Project Control must be clean after Task 10 commit." }
```

- [ ] **Step 6: Run post-commit verification from clean trees**

Project Control:

```powershell
npm run check
git status --short
```

Core:

```powershell
npm run check
git status --short
```

Expected: both checks pass and both status outputs are empty.

- [ ] **Step 7: Request two independent final reviews**

Request one contract/factual-honesty review and one documentation-architecture/provenance review. Generate and give both reviewers separate packages for every mutation boundary below:

Core packages, never collapsed into a singular “Tasks 7–9” range:

1. `$coreTask7BaseCommit..$coreTask7GuardCommit` — the exact seven-path Task 7 reference-repair/guard commit;
2. `$coreTask7GuardCommit..$coreBaselineTestCorrectionCommit` — the exact one-path baseline ancestry test correction;
3. `$coreCleanupBaseCommit..$coreCleanupCommit` — the exact four-document Task 9 deletion commit.

Project Control packages:

1. `c488cb412cd6b64808a1a5616299bfce6af25af2..$projectControlPublicationCommit` — Tasks 1–6 implementation and corrections;
2. `$projectControlPublicationCommit..$projectControlTask8BaseCommit` — governing-plan/handoff amendments before deletion authorization;
3. `$projectControlTask8BaseCommit..$projectControlDeletionAuthorizationCommit` — exact Task 8 readiness and deletion-authorization commit;
4. `$projectControlDeletionAuthorizationCommit..$projectControlTask10BaseCommit` — exact governing-plan correction that binds the closed lifecycle to the visible Work-tab empty state;
5. `$projectControlTask10BaseCommit..$projectControlClosureCommit` — exact nine-path Task 10 closure commit, including the interaction-level E2E assertion.

Also provide the complete Project Control provenance range `c488cb412cd6b64808a1a5616299bfce6af25af2..$projectControlClosureCommit` as context, but never use it as a substitute for the scoped packages. Every package must be regenerated from the final recaptured hashes and its header must name the exact base/head pair. Both reviewers also receive generated artifacts, all gate outputs, the deletion allowlist, review verdicts from Tasks 7–8, and rollback commits. Any Critical or Important finding requires a new RED, correction, complete affected gates, refreshed hashes/packages for every affected range, and fresh verdict from both reviewers.

- [ ] **Step 8: Record the next planning boundary**

The final report recommends a separate `TEMPLATE_BUILDER_*` family implementation plan using the reviewed pilot contract. It must not automatically mark any Template Builder source authoritative or deletable. Phase 3 begins only after the pilot review is READY.

### Task 11: Correct the Closed Verifier for Descendant Core Commits

The first two final reviews did not approve the pilot. The contract reviewer
reported Critical = 0, Important = 2, Minor = 1; the documentation-architecture
reviewer reported Critical = 0, Important = 2, Minor = 2. Tasks 11–14 are the
only authorized correction sequence. They do not reopen deletion scope, add a
runtime change, or authorize another family.

**Files:**
- Modify: `tools/migration/lib/validate-migration.ts`
- Modify: `tests/core-doc-migration.test.ts`

**Interfaces:**
- Consumes: closed coverage whose immutable `coreCleanupCommit` is
  `8aa0be4f662708fa75d4eb8f0f99b4784da2371c`, the exact four covered source
  paths/blobs, the clean Core checkout, and the stored historical-reference
  allowances.
- Produces: `verifyFamilyCleanup(input): Promise<DeletionReadiness>` whose
  cleanup authority remains bound to the exact recorded commit while the clean
  checkout may be that commit or a descendant; `$closedVerifierCorrectionCommit`.

- [ ] **Step 1: Freeze the correction base and reproduce the exact-head defect**

Start from clean Project Control commit
`$projectControlClosureCommit = 126e505a3cf347e974e0ac3127ccc558fc6d7e27`
and clean Core commit
`$coreCleanupCommit = 8aa0be4f662708fa75d4eb8f0f99b4784da2371c`.
Record the plan-only correction commit as `$finalCorrectionsPlanCommit`; require
it to be the exact Project Control HEAD and require its parent to be
`$projectControlClosureCommit`. Do not edit Core in this task.

In `tests/core-doc-migration.test.ts`, retain the passing exact-cleanup-HEAD
case. Extend the same fixture by committing an unrelated non-covered file after
the cleanup commit, leave `coverage.coreCleanupCommit` unchanged, and assert:

```ts
expect(await verifyFamilyCleanup(fixture)).toMatchObject({
  ready: true,
  diagnostics: [],
});
```

Run:

```powershell
npm test -- tests/core-doc-migration.test.ts -t "accepts closed cleanup at the exact recorded commit or a clean descendant"
```

Expected RED: the exact cleanup commit case passes, then the descendant case
fails with `MIGRATION_CLEANUP_COMMIT_MISMATCH`. This proves that the existing
HEAD-equality rule, rather than deletion drift, blocks later Core documentation
commits.

- [ ] **Step 2: Add adversarial cleanup, HEAD-tree, and reference-closure REDs**

Use fixture Git commits, never mocked command output, to require all of these
behaviors:

```ts
expect(await verifyFamilyCleanup(exactCleanupFixture)).toMatchObject({ ready: true, diagnostics: [] });
expect(await verifyFamilyCleanup(cleanDescendantFixture)).toMatchObject({ ready: true, diagnostics: [] });
expect(diagnosticCodes(await verifyFamilyCleanup(nonAncestorFixture)))
  .toContain("MIGRATION_CLEANUP_COMMIT_NOT_ANCESTOR");
expect(diagnosticCodes(await verifyFamilyCleanup(extraDeltaFixture)))
  .toContain("MIGRATION_CLEANUP_SCOPE_INVALID");
expect(diagnosticCodes(await verifyFamilyCleanup(missingDeletionFixture)))
  .toContain("MIGRATION_CLEANUP_SCOPE_INVALID");
expect(diagnosticCodes(await verifyFamilyCleanup(wrongPreimageFixture)))
  .toContain("MIGRATION_CLEANUP_PREIMAGE_MISMATCH");
expect(diagnosticCodes(await verifyFamilyCleanup(mergeCleanupFixture)))
  .toContain("MIGRATION_CLEANUP_COMMIT_TOPOLOGY_INVALID");
expect(diagnosticCodes(await verifyFamilyCleanup(cleanupTreeRetainsSourceFixture)))
  .toContain("MIGRATION_CLEANUP_SCOPE_INVALID");
expect(diagnosticCodes(await verifyFamilyCleanup(skipWorktreeReintroductionFixture)))
  .toContain("MIGRATION_CLEANUP_INCOMPLETE");
```

The extra-delta fixture adds or modifies one unrelated path in the recorded
cleanup commit. The missing-deletion fixture omits one covered non-keep source.
The wrong-preimage fixture commits different bytes for one covered source in
the cleanup parent before deleting it. The merge fixture records a two-parent
cleanup commit. The cleanup-tree fixture leaves one covered path in the cleanup
commit tree, independently of the current worktree check.

Build `skipWorktreeReintroductionFixture` only in a disposable fixture
repository: start from an exact cleanup, commit a descendant that restores one
covered source, mark that path `skip-worktree`, remove only its working-tree
copy, and prove both `git status --porcelain` is empty and `git cat-file -e
HEAD:$sourcePath` succeeds. The filesystem path is absent while the Git HEAD
tree still contains the source. `verifyFamilyCleanup` must fail with
`MIGRATION_CLEANUP_INCOMPLETE`; never apply `skip-worktree`, sparse-checkout, or
index flags to the real Core worktree.

The fixture owns cleanup with `try/finally`. Create it only with `mkdtemp` under
Node's `tmpdir()`, resolve both paths with `realpath`, and reject cleanup unless
the resolved repository is a nonempty descendant of the resolved temp root:

```ts
const relativeFixturePath = relative(resolvedTempRoot, resolvedFixtureRoot);
if (
  relativeFixturePath.length === 0 ||
  relativeFixturePath.startsWith("..") ||
  isAbsolute(relativeFixturePath)
) {
  throw new Error("Refusing to clean a non-temporary fixture repository.");
}

let skipWorktreeSet = false;
try {
  await git(resolvedFixtureRoot, ["update-index", "--skip-worktree", "--", sourcePath]);
  skipWorktreeSet = true;
  await rm(join(resolvedFixtureRoot, ...sourcePath.split("/")));
  expect(await git(resolvedFixtureRoot, ["status", "--porcelain"])).toBe("");
  await expect(git(resolvedFixtureRoot, ["cat-file", "-e", `HEAD:${sourcePath}`]))
    .resolves.toBe("");
  await expect(access(join(resolvedFixtureRoot, ...sourcePath.split("/"))))
    .rejects.toMatchObject({ code: "ENOENT" });
  expect(diagnosticCodes(await verifyFamilyCleanup({
    ...fixture,
    sourceRoot: resolvedFixtureRoot,
  }))).toContain("MIGRATION_CLEANUP_INCOMPLETE");
} finally {
  try {
    if (await fixturePathExists(join(resolvedFixtureRoot, ".git"))) {
      if (skipWorktreeSet) {
        await git(resolvedFixtureRoot, ["update-index", "--no-skip-worktree", "--", sourcePath]);
      }
      await git(resolvedFixtureRoot, ["restore", "--staged", "--worktree", "--source=HEAD", "--", sourcePath]);
    }
  } finally {
    await rm(resolvedFixtureRoot, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 100,
    });
  }
}
```

Define `fixturePathExists` as the same small `access`-based boolean helper used
by the fixture test. The `.git` guard handles setup failure, but never redirects
cleanup to another checkout. On Windows, clear the
`skip-worktree` bit and restore the disposable index/worktree before recursive
removal so open/index state does not cause a partial delete. Resolve and compare
the exact target before removal; do not use a glob, `$HOME`, repository parent,
primary checkout, or real Core path.

Add a separate closed-fixture reference matrix. Commit an allowed historical
mention outside the deletion set, complete the exact cleanup, and invoke
`verifyFamilyCleanup` for each row:

| Closed fixture mutation | Required diagnostic |
| --- | --- |
| nonempty `activeReferences` | `MIGRATION_ACTIVE_REFERENCE` |
| mention present but allowance missing | `MIGRATION_ACTIVE_PATH_MENTION` |
| allowance line changed | `MIGRATION_ACTIVE_PATH_MENTION` and `MIGRATION_HISTORICAL_ALLOWANCE_STALE` |
| allowance SHA-256 changed | `MIGRATION_ACTIVE_PATH_MENTION` and `MIGRATION_HISTORICAL_ALLOWANCE_STALE` |
| allowance target changed | `MIGRATION_ACTIVE_PATH_MENTION` and `MIGRATION_HISTORICAL_ALLOWANCE_STALE` |
| extra allowance with no matching mention | `MIGRATION_HISTORICAL_ALLOWANCE_STALE` |
| stale allowance after its tracked line changes | `MIGRATION_ACTIVE_PATH_MENTION` and `MIGRATION_HISTORICAL_ALLOWANCE_STALE` |

Rationale integrity remains structural and family-neutral: stored validation
requires a nonempty rationale, while external verification binds allowance
source path, target path, line, and normalized line SHA-256 to an actual retained
mention. Do not add a Core-route rationale constant or require one sentence in
generic `verifyFamilyCleanup`; future families may have different reviewed
rationales. The untouched closed fixture with a structurally valid rationale
and exact mention binding must remain `ready: true` with zero diagnostics.

The existing dirty-tree and ordinary filesystem reintroduction cases are
retained negative controls, not new RED evidence. Run them before the
implementation and require their existing diagnostics to remain GREEN:

```ts
expect(diagnosticCodes(await verifyFamilyCleanup(dirtyDescendantFixture)))
  .toContain("MIGRATION_SOURCE_TREE_DIRTY");
expect(diagnosticCodes(await verifyFamilyCleanup(reintroducedSourceFixture)))
  .toContain("MIGRATION_CLEANUP_INCOMPLETE");
```

Run:

```powershell
npm test -- tests/core-doc-migration.test.ts -t "closed cleanup ancestry and tree proof|closed cleanup reference closure|retains closed cleanup negative controls"
```

Expected RED: the descendant/topology/ancestor/delta/preimage/cleanup-tree and
skip-worktree-HEAD-tree cases fail for the asserted reason.
The dirty and ordinary reintroduction controls already pass and must stay
passing. Every reference/allowance matrix row must fail closed with exactly the
named diagnostics and no `ready: true` result.

- [ ] **Step 3: Implement the minimum descendant-safe verifier**

Replace cleanup HEAD equality with exact recorded-commit verification:

1. Set `$cleanupCommitSpec` to the recorded cleanup hash plus the literal
   `^{commit}` suffix, pass it as one argument to
   `git rev-parse --verify $cleanupCommitSpec`, and require the returned
   lowercase 40-hex commit to equal the recorded value.
2. Run `git merge-base --is-ancestor <cleanup> HEAD`. Exit 0 means reachable;
   exit 1 emits `MIGRATION_CLEANUP_COMMIT_NOT_ANCESTOR`; any other failure emits
   `MIGRATION_CLEANUP_COMMIT_UNAVAILABLE`. Never invoke a shell or concatenate
   user-controlled Git syntax.
3. Parse `git rev-list --parents -n 1 <cleanup>` and require exactly one parent.
   Zero or multiple parents emit `MIGRATION_CLEANUP_COMMIT_TOPOLOGY_INVALID`;
   the verifier does not guess a merge mainline.
4. Parse the NUL-delimited result of
   `git diff-tree --no-commit-id --name-status -r -z <parent> <cleanup> --`.
   Require exactly one `D` entry for every covered non-keep source and no other
   addition, modification, rename, copy, type change, or deletion. Any extra or
   missing delta emits `MIGRATION_CLEANUP_SCOPE_INVALID`.
5. For each deletion, require the blob addressed by
   `$cleanupParent + ':' + $sourcePath` to equal the coverage blob, inventory
   blob, and captured `sourceCommit` snapshot blob; require the same source path
   at `$cleanupCommit` to be absent by a direct Git-tree query. A preimage
   mismatch emits `MIGRATION_CLEANUP_PREIMAGE_MISMATCH`; a path retained by the
   cleanup tree emits `MIGRATION_CLEANUP_SCOPE_INVALID`.
6. At current clean `HEAD`, prove every covered non-keep source is absent twice:
   a Git-tree query such as `git cat-file -e HEAD:$sourcePath` must report the
   path absent (or an exact `ls-tree` lookup must return no entry), and the
   filesystem path must also be absent. If either view contains the source,
   emit `MIGRATION_CLEANUP_INCOMPLETE`. This prevents sparse checkout or
   `skip-worktree` state from masquerading as committed deletion.
7. Require every `repo-local-keep` present, no active reference, and only exact
   stored historical allowances. Match allowance source path, target path,
   one-based line, and normalized line SHA-256 to current tracked mentions;
   require rationale to remain structurally nonempty through stored validation.
   Missing/changed/stale/extra records emit the matrix diagnostics from Step 2.
   Keep the current dirty-tree failure.

Factor only small private parsers/helpers inside
`tools/migration/lib/validate-migration.ts`; do not add a public API, schema,
phase, allowance, or deletion class.

- [ ] **Step 4: Run Task 11 gates**

```powershell
npm test -- tests/core-doc-migration.test.ts
npm run check:migrations
npm run check:data
npm run type-check
npm test
git diff --check
```

Expected: every command exits 0. Then run the real closed gate first at exact
Core cleanup HEAD. The fixture RED/GREEN proves descendant behavior without
mutating Core during this Project Control-only task; Task 13 supplies the real
clean descendant acceptance check. The coverage file must continue to contain
the literal cleanup commit `8aa0be4f662708fa75d4eb8f0f99b4784da2371c`.

- [ ] **Step 5: Commit and independently review Task 11**

```powershell
$expectedTask11Paths = @(
  'tests/core-doc-migration.test.ts',
  'tools/migration/lib/validate-migration.ts'
) | Sort-Object
git add -- $expectedTask11Paths
if (Compare-Object $expectedTask11Paths (@(git diff --cached --name-only) | Sort-Object)) { throw "Task 11 staged scope drifted." }
git diff --cached --check
git commit -m "fix(migration): verify closed cleanup ancestry"
$closedVerifierCorrectionCommit = (git rev-parse HEAD).Trim()
if ((git rev-parse "$closedVerifierCorrectionCommit^").Trim() -ne $finalCorrectionsPlanCommit) { throw "Task 11 parent drifted." }
if (git status --short) { throw "Project Control must be clean after Task 11." }
```

Generate an exact `$finalCorrectionsPlanCommit..$closedVerifierCorrectionCommit`
review package. A fresh contract reviewer must report Critical = 0 and Important
= 0 before Task 12 starts. Require explicit review of the closed reference/
allowance matrix, exact cleanup-commit tree absence, separate current HEAD-tree
and filesystem absence, the clean disposable `skip-worktree` fixture, and the
retained dirty/ordinary-reintroduction controls. A finding starts fix round 1/5:
add a RED, amend only the same two-path unpushed commit, rerun all Task 11 gates,
recapture the commit hash, regenerate the exact package, and obtain a fresh
verdict. Stop after five failed rounds and return `BLOCKED` rather than
broadening scope.

### Task 12: Publish Closure-Current Project Control Truth

**Files:**
- Modify: `README.md`
- Modify: `docs/domains/project-control.md`
- Modify: `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`
- Modify: `docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md`
- Modify: `docs/versions/V0_1_0a_1/core/core-route/route-ownership-and-retained-contracts.md`
- Modify: `docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md`
- Modify: `data/nodes/core.json`
- Modify: `data/repositories/core.json`
- Modify: `tests/core-doc-migration.test.ts`
- Modify: `tests/seed-project.test.ts`
- Modify: `generated/project-index.json`

**Interfaces:**
- Consumes: reviewed `$closedVerifierCorrectionCommit`, closed coverage, cleanup
  Evidence, absent pilot Work, exact Core cleanup commit, and the immutable four
  source/blob deletion set.
- Produces: `$projectControlClosedTruthCommit`, the frozen Project Control commit
  that Core navigation will cite literally in Task 13.

- [ ] **Step 1: Write lifecycle-aware truth REDs**

Add a small test helper that evaluates canonical/current-state wording against
the actual coverage lifecycle. For `draft`, `content-reviewed`, and
`ready-for-deletion`, pending wording is allowed only when it matches that
phase. For `closed`, require exact cleanup Evidence and commit and reject stale
claims matching `pending`, `queued`, `future work`, `does not exist`, or `no
artifact` in active current-state/canonical status passages.

The real closed-pilot assertions must require:

```ts
expect(coverage.status).toBe("closed");
expect(coverage.coreCleanupCommit).toBe(coreCleanupCommit);
expect(cleanupEvidence.commit).toBe(coreCleanupCommit);
expect(model.work.some(({ id }) => id === "work-core-route-pilot")).toBe(false);
expect(coreNode.truthState).toBe("unknown");
expect(coreRouteNode.truthState).toBe("current");
expect(coverage.retainedHistoricalReferences.map(({ rationale }) => rationale))
  .toEqual(Array(4).fill(
    "Preserves a completed Core phase's former source path at the captured Core commit.",
  ));
expect(currentStateText).not.toMatch(/pending|queued|future\s+work|does\s+not\s+exist|no\s+artifact/iu);
```

This literal rationale assertion is specific to the real reviewed Core-route
coverage in Project Control. It does not become a generic cleanup-verifier
policy and does not constrain rationale text for another family.

Also require all of these facts:

- `docs/domains/project-control.md` describes the pilot as closed, says there is
  no active `CORE_ROUTE` Work, and names Template Builder only as a separate
  unregistered plan whose sources are not authoritative or deletable;
- `DOCUMENT_MAP.md`, `OVERVIEW.md`, and the canonical leaf say exactly the four
  covered documents were removed at Core
  `8aa0be4f662708fa75d4eb8f0f99b4784da2371c`, coverage is closed, cleanup
  Evidence is recorded, and no other deletion is authorized;
- the leaf links to `MIGRATION_REVIEW.md`, and `MIGRATION_REVIEW.md` links back
  to `route-ownership-and-retained-contracts.md`;
- `MIGRATION_REVIEW.md` says the deprecated internal route vocabulary remains
  guarded **until runtime route-source removal is separately authorized and
  completed**, not “until cleanup”;
- the parent Core Node and repository summary say broader Core remains unknown
  while the bounded `core-route` child is closed;
- `README.md` no longer says `CORE_ROUTE_*` migration execution is deferred;
  only GUI/product-repository mutation and AGENTS/Skill redesign remain deferred.

Run:

```powershell
npm test -- tests/core-doc-migration.test.ts tests/seed-project.test.ts
```

Expected RED: the current files positively assert pending/queued/future/no-
artifact state and omit reciprocal review navigation.

- [ ] **Step 2: Correct only closure-current prose and summaries**

Replace the registered active Project Control overview's `Queued pilot`
section with `Closed pilot`. State that the exact four-document cleanup is
closed at `8aa0be4f662708fa75d4eb8f0f99b4784da2371c`, Evidence is recorded, and no
pilot Work remains. Describe Template Builder as the next separate planning
candidate only; do not create a Template Builder Node, Document, Work,
coverage, authority, or deletion claim.

Update the map, overview, leaf, review, README, parent Node, and repository
summary to the exact facts asserted in Step 1. Preserve parent `core.truthState`
as `unknown`; do not promote the provisional family map. Add the two relative
Markdown links without changing `data/nodes/core-route.json` or its sorted
`documentIds`, because navigation records already contain review, overview, and
leaf as a set. Do not alter runtime ownership, schemas, GUI behavior, Evidence,
coverage, or deletion scope.

- [ ] **Step 3: Generate and run Task 12 gates**

```powershell
npm run generate
npm test -- tests/core-doc-migration.test.ts tests/seed-project.test.ts
npm run check:data
npm run check:migrations
npm run type-check
npm test
npm run build
npm run test:e2e
npm run check:migration:core -- --source-root $coreWorktree --family core-route --closed
git diff --check
```

Expected: every command exits 0; the closed gate passes at exact clean Core
cleanup HEAD; generation is deterministic; no active Work reappears.

- [ ] **Step 4: Commit, freeze, and review Project Control truth**

```powershell
$expectedTask12Paths = @(
  'README.md',
  'data/nodes/core.json',
  'data/repositories/core.json',
  'docs/domains/project-control.md',
  'docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md',
  'docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md',
  'docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md',
  'docs/versions/V0_1_0a_1/core/core-route/route-ownership-and-retained-contracts.md',
  'generated/project-index.json',
  'tests/core-doc-migration.test.ts',
  'tests/seed-project.test.ts'
) | Sort-Object
git add -- $expectedTask12Paths
if (Compare-Object $expectedTask12Paths (@(git diff --cached --name-only) | Sort-Object)) { throw "Task 12 staged scope drifted." }
git diff --cached --check
git commit -m "docs: publish closed Core route truth"
$projectControlClosedTruthCommit = (git rev-parse HEAD).Trim()
if ((git rev-parse "$projectControlClosedTruthCommit^").Trim() -ne $closedVerifierCorrectionCommit) { throw "Task 12 parent drifted." }
if (git status --short) { throw "Project Control must be clean after Task 12." }
```

Generate an exact
`$closedVerifierCorrectionCommit..$projectControlClosedTruthCommit` package. A
fresh documentation/factual-honesty reviewer must report Critical = 0 and
Important = 0. Each finding begins the same maximum-five RED/amend/full-gate/
recapture/package/fresh-review loop within the exact eleven paths. Task 13 is
blocked until this commit is frozen and reviewed. Any later amendment of this
commit invalidates the Task 13 URL and forces Task 13 to be updated and reviewed
again.

### Task 13: Pin Core Navigation to Immutable Project Control Truth

**Files:**
- Modify: Core `README.md`
- Modify: Core `tests/coreRouteCanonicalMigrationGuard.test.ts`

**Interfaces:**
- Consumes: frozen reviewed `$projectControlClosedTruthCommit` and the locally
  verified canonical path
  `docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md` at that commit.
- Produces: `$coreImmutableNavigationCommit`, a documentation/test-only Core
  descendant of cleanup commit `8aa0be4f662708fa75d4eb8f0f99b4784da2371c`.

- [ ] **Step 1: Verify the immutable coordinate locally**

From PowerShell, avoid the `^{commit}` expression-parsing ambiguity by passing
each revision as one quoted Git argument:

Carry `$projectControlClosedTruthCommit` from the reviewed Task 12 report/brief
as the frozen value. Never derive it from current HEAD and never overwrite it
with an observed value; HEAD is an independently observed assertion target.

```powershell
if ($projectControlClosedTruthCommit -notmatch '^[0-9a-f]{40}$') { throw "Closed-truth commit is not lowercase 40-hex." }
$observedProjectControlHead = (git -C $projectControlWorktree rev-parse HEAD).Trim()
if ($observedProjectControlHead -notmatch '^[0-9a-f]{40}$') { throw "Observed Project Control HEAD is not lowercase 40-hex." }
if ($observedProjectControlHead -ne $projectControlClosedTruthCommit) { throw "Project Control HEAD drifted from frozen reviewed truth." }
if (git -C $projectControlWorktree status --short) { throw "Project Control must be clean before Core navigation is written." }
$truthCommitSpec = '{0}^{{commit}}' -f $projectControlClosedTruthCommit
$resolvedTruthCommit = (git -C $projectControlWorktree rev-parse --verify $truthCommitSpec).Trim()
if ($resolvedTruthCommit -ne $projectControlClosedTruthCommit) { throw "Closed-truth commit does not resolve exactly." }
$truthPathSpec = '{0}:{1}' -f $projectControlClosedTruthCommit, 'docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md'
git -C $projectControlWorktree cat-file -e $truthPathSpec
if ($LASTEXITCODE -ne 0) { throw "Canonical overview is absent at the immutable commit." }
```

This proves the local Git object/path only. Do not claim the GitHub URL is
network-resolvable until the commit is integrated and published; do not push,
merge, tag, or publicize either repository in this plan.

- [ ] **Step 2: Write the immutable-link RED**

In the Core guard, read only Core `README.md`; do not require a Project Control
checkout or network. Extract canonical URLs matching:

```ts
const immutableOverviewUrl =
  `https://github.com/nekotoomtam/flowdoc-project-control/blob/${projectControlClosedTruthCommit}/docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md`;

const canonicalOverviewLinks = Array.from(readme.matchAll(
  /https:\/\/github\.com\/nekotoomtam\/flowdoc-project-control\/blob\/(?<commit>[^/\s)]+)\/docs\/versions\/V0_1_0a_1\/core\/core-route\/OVERVIEW\.md[^\s)]*/g,
));
expect(canonicalOverviewLinks).toHaveLength(2);
expect(canonicalOverviewLinks.map((match) => match[0])).toEqual([
  immutableOverviewUrl,
  immutableOverviewUrl,
]);
expect(canonicalOverviewLinks.map((match) => match.groups?.commit)).toEqual([
  projectControlClosedTruthCommit,
  projectControlClosedTruthCommit,
]);
expect(readme).not.toContain("flowdoc-project-control/blob/main/");
for (const commit of canonicalOverviewLinks.map((match) => match.groups?.commit)) {
  expect(commit).toMatch(/^[0-9a-f]{40}$/);
}
for (const oldPath of coreRouteSources) {
  expect(readme).not.toContain(oldPath);
}
```

Define the frozen literal `projectControlClosedTruthCommit`, a small
`canonicalOverviewLinks(source)` collector, and the four literal old paths in
the same guard file. The collector must scan the entire README, not stop after
the first two matches. Add pure mutation rows proving the assertion rejects a
third canonical URL, one link at a different 40-hex commit, `blob/main`, a URL
suffix/query, and an old removed source path; these rows do not read Project
Control or use the network. Run:

```powershell
npm test -- tests/coreRouteCanonicalMigrationGuard.test.ts
```

Expected RED: both current links use mutable `blob/main`. The mutation rows
also prove that count two plus “each commit is 40-hex” cannot accidentally
accept two different immutable commits or ignore a third canonical link.

- [ ] **Step 3: Replace exactly two README links and run Core gates**

Replace both occurrences with the exact literal URL containing the final
`$projectControlClosedTruthCommit`. Do not use a branch, tag, abbreviated hash,
redirect, relative cross-repository path, or symbolic placeholder.

Run:

```powershell
npm test -- tests/coreRouteCanonicalMigrationGuard.test.ts
npm run type-check
npm run check
git diff --check
```

Expected: focused guard and full Core gate pass. The diff contains only README
and the guard; no `src/`, package, configuration, removed source, or runtime
file changes.

- [ ] **Step 4: Commit and independently review Task 13**

```powershell
$expectedTask13Paths = @('README.md', 'tests/coreRouteCanonicalMigrationGuard.test.ts') | Sort-Object
git add -- $expectedTask13Paths
if (Compare-Object $expectedTask13Paths (@(git diff --cached --name-only) | Sort-Object)) { throw "Task 13 staged scope drifted." }
git diff --cached --check
git commit -m "docs: pin Core route canonical navigation"
$coreImmutableNavigationCommit = (git rev-parse HEAD).Trim()
if ((git rev-parse "$coreImmutableNavigationCommit^").Trim() -ne $coreCleanupCommit) { throw "Task 13 is not the direct cleanup descendant." }
if (git status --short) { throw "Core must be clean after Task 13." }
```

Generate an exact `$coreCleanupCommit..$coreImmutableNavigationCommit` package.
A fresh navigation/provenance reviewer must report Critical = 0 and Important =
0. Require explicit verification that the frozen Task 12 hash is never assigned
from observed HEAD; every matching canonical URL is collected; exactly two
links contain the one frozen hash; and the third-link, different-hash,
`blob/main`, suffix/query, and old-source mutation rows fail. Each finding begins
the same maximum-five RED/amend/full-Core-gate/recapture/package/fresh-review
loop within the exact two paths.

Then prove Task 11's descendant contract from Project Control without changing
coverage:

```powershell
npm run check:migration:core -- --source-root $coreWorktree --family core-route --closed
```

Expected: PASS with `coverage.coreCleanupCommit` still exactly
`8aa0be4f662708fa75d4eb8f0f99b4784da2371c`, Core HEAD exactly
`$coreImmutableNavigationCommit`, both worktrees clean, and all four sources
absent. Capture that HEAD as the final Core handoff; it contains no source or
runtime change.

### Task 14: Refresh Final Evidence and Re-run Both Acceptance Reviews

**Files:**
- Modify only ignored SDD brief/report/ledger and ignored review packages.
- Do not modify a tracked file unless a reviewer finding reopens Task 11, 12, or
  13 within that task's exact scope.

**Interfaces:**
- Consumes: three independently reviewed correction commits and all earlier
  mutation packages.
- Produces: fresh dual final verdicts, exact final handoff hashes, and an honest
  publication-boundary statement.

- [ ] **Step 1: Recapture all immutable identities from clean worktrees**

Record and validate:

```powershell
$finalCorrectionsPlanCommit = (git -C $projectControlWorktree rev-parse "$closedVerifierCorrectionCommit^").Trim()
$projectControlFinalCommit = (git -C $projectControlWorktree rev-parse HEAD).Trim()
$coreFinalCommit = (git -C $coreWorktree rev-parse HEAD).Trim()
if ($projectControlFinalCommit -ne $projectControlClosedTruthCommit) { throw "Project Control final HEAD drifted." }
if ($coreFinalCommit -ne $coreImmutableNavigationCommit) { throw "Core final HEAD drifted." }
if (git -C $projectControlWorktree status --short) { throw "Project Control is dirty." }
if (git -C $coreWorktree status --short) { throw "Core is dirty." }
```

Verify the complete topology: closure → plan-only correction → Task 11 → Task
12 in Project Control; cleanup → Task 13 in Core. Verify the literal README URL
hash equals `$projectControlClosedTruthCommit`, and verify that commit/path
locally again.

- [ ] **Step 2: Regenerate the three new scoped implementation packages**

Use the required `review-package` helper and require exact full-hash headers:

1. `$finalCorrectionsPlanCommit..$closedVerifierCorrectionCommit` — exact
   two-path descendant-safe closed-verifier correction;
2. `$closedVerifierCorrectionCommit..$projectControlClosedTruthCommit` — exact
   eleven-path closure-current Project Control truth correction;
3. `$coreCleanupCommit..$coreImmutableNavigationCommit` — exact two-path Core
   immutable-navigation correction.

Also regenerate the plan-governance context
`$projectControlClosureCommit..$finalCorrectionsPlanCommit`; it is not a
substitute for any of the three implementation packages. Refresh every earlier
package whose head is used as final context and regenerate the complete Project
Control provenance package through `$projectControlClosedTruthCommit`. Do not
reuse a package after an amend.

- [ ] **Step 3: Run the final gates from exact committed heads**

Project Control:

```powershell
npm run check
npm run check:migration:core -- --source-root $coreWorktree --family core-route --closed
git status --short
```

Core:

```powershell
npm run check
git status --short
```

Expected: all commands pass; both statuses are empty; closed coverage still
records the exact cleanup commit while accepting the clean Core descendant.
Do not turn a timeout into a passing claim: record a timing-sensitive failure,
run the unchanged exact row in isolation, and rerun the strict full gate; a
product or test workaround requires a new approved scope.

- [ ] **Step 4: Re-run both independent final reviews**

Give both reviewers the approved design, amended governing plan, original
verdicts, all scoped packages, complete provenance context, generated index,
closed coverage/Evidence, exact source/blob allowlist, gate output, and local
immutable-link verification.

The contract/factual-honesty reviewer must explicitly verify descendant-safe
cleanup ancestry and exact cleanup-tree/preimage proof; no authority or deletion
scope broadening; phase-aware closed truth; no stale active Work; exact Evidence
and commit; and parent Core remains unknown.

The documentation-architecture/provenance reviewer must explicitly verify
map → overview → leaf ↔ migration-review navigation; exactly two immutable Core
README links pinned to `$projectControlClosedTruthCommit`; no `blob/main` or old
source link; no Project Control checkout dependency in the Core guard; and the
publication boundary is stated as local Git provenance until later integration,
not as a public availability claim.

Any Critical or Important finding reopens only its owning task and starts or
continues that task's maximum-five fix loop. After every amend, recapture hashes,
rerun affected full gates, regenerate every affected package, and obtain fresh
task plus dual-final verdicts. If Task 12 changes after Task 13 exists, update
both literal Core README URLs and the guard to the new
`$projectControlClosedTruthCommit`, amend/review Task 13, rerun the descendant
closed gate, and refresh both final reviews. Never leave a stale immutable URL.

Task 11 is no longer the Project Control tip after Task 12. If a dual-final
review finds a new Task 11 defect, do not rewrite the reviewed Task 12 commit or
use an interactive rebase. Add one new exact-two-path Task 11 correction commit
on top of the current Project Control HEAD, run/review the full Task 11 gate,
count it as the next Task 11 fix round, and add its exact scoped package. That
new Project Control HEAD becomes the recaptured
`$projectControlClosedTruthCommit` because the canonical path is unchanged and
present there; Task 13 must then be amended to cite it and must repeat its full
review. This preserves linear, recoverable history while keeping every fix
boundary explicit.

- [ ] **Step 5: Record accepted and deferred boundaries honestly**

READY requires both final reviewers to report Critical = 0 and Important = 0.
The final report records Minor findings and these explicit residual risks:
external/deep imports remain unknown; Backend behavior was not independently
revalidated; timing-sensitive rows remain operational risks; the provisional
family map remains `classified` while authoritative coverage is `closed`; and
internal route-vocabulary comments can still misstate public compatibility.

The Core source-comment Minor at `src/generation/apiRoute.ts:7-9,103-108` and
`src/generation/artifactApiRoute.ts:8-10` is deliberately deferred to a separate
runtime route-source plan. That future plan must decide the runtime vocabulary
and source-removal boundary with tests; Tasks 11–14 must not edit `src/`.

No merge, push, tag, stash mutation, or network publication occurs here. The
immutable GitHub URL is a provenance coordinate whose commit and path are
verified in the local Git object database; it may remain network-unpublished
until the reviewed branches are integrated and pushed by a separately
authorized action. Do not report the pilot final-ready before both fresh verdicts
pass.

## Final Acceptance Checklist

- [ ] The captured inventory contains exactly 470 Core Markdown paths at commit `76a2f2311a898e781f53773390d47b05812911e4`.
- [ ] Every inventory path appears exactly once in the candidate family map.
- [ ] Only the four exact `CORE_ROUTE_*` sources are closed/deleted.
- [ ] Canonical truth descends `DOCUMENT_MAP.md` → `core-route/OVERVIEW.md` → canonical leaf.
- [ ] Coverage maps every pilot source blob to one reviewed disposition/destination.
- [ ] Historical notes preserve the compatibility-window reasoning without copying working documents.
- [ ] Active references to removed sources are zero.
- [ ] Core runtime and public retained contracts are unchanged.
- [ ] Project Control records, generated index, GUI build, and E2E remain green.
- [ ] Core type-check and tests remain green.
- [ ] Project Control and Core each have explicit reversible commits and clean worktrees.
- [ ] Closed verification accepts the exact cleanup commit and clean descendants while proving the recorded cleanup commit's one-parent exact deletion tree and captured preimages.
- [ ] Active Project Control prose and generated state describe the pilot as closed, with exact cleanup Evidence and no active pilot Work or pending/queued/future-artifact claim.
- [ ] The canonical leaf links to the migration review and the review links back to the leaf.
- [ ] Both Core README links use the exact lowercase 40-hex Project Control closed-truth commit; no mutable `blob/main` link or removed source path remains.
- [ ] The immutable Project Control commit/path resolves locally, and the handoff states that network publication remains outside this plan.
- [ ] Two final reviewers report Critical = 0 and Important = 0.
- [ ] No Editor, Backend, Agent, Skill, public Doc API, database, or GUI-write scope entered the diff.
