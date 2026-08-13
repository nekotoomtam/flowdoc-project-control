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

### Task 7: Repair Core References and Replace Document-Coupled Tests

**Files:**
- Create: `tests/coreRouteCanonicalMigrationGuard.test.ts` in Core
- Modify: `README.md` in Core
- Modify: `docs/PHASE_LEDGER.md` in Core
- Delete: `tests/coreRouteDeexportPlan.test.ts` in Core
- Delete: `tests/coreRouteDeprecationWindow.test.ts` in Core
- Delete: `tests/coreRouteRetainedContractRewrite.test.ts` in Core
- Delete: `tests/coreRouteWindowCPublicExportRemoval.test.ts` in Core

**Interfaces:**
- Consumes: the active canonical Project Control paths and retained Core source/tests.
- Produces: no active Core navigation to the four source documents and one code-focused guard independent of Project Control checkout availability.

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

Also prove retained tests name `assessVNextGenerationReadiness`, `createVNextArtifactManifestPlan`, `createVNextArtifactJobPlan`, and `advanceVNextArtifactJob`, with no named import of route response helpers.

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
$coreReferenceRepairCommit = (git rev-parse HEAD).Trim()
if ($coreReferenceRepairCommit -notmatch '^[0-9a-f]{40}$') { throw "Core reference-repair commit is not a 40-character Git commit." }
if (git status --short) { throw "Core worktree is not clean after the Task 7 commit." }
```

Record `$coreReferenceRepairCommit` in the ignored Task 7 report. From Project Control, rerun the normal external check against that exact clean Core commit:

```powershell
npm run check:migration:core -- --source-root $coreWorktree --family core-route
```

Expected exit code: `1`.

Expected diagnostics, and no others:

- exactly four `MIGRATION_ACTIVE_PATH_MENTION` diagnostics for the four `docs/PHASE_LEDGER.md` former-source rows;
- exactly one `MIGRATION_COVERAGE_NOT_READY` because coverage remains `content-reviewed`.

`MIGRATION_SOURCE_TREE_DIRTY` must be absent after the commit. This five-diagnostic RED is the stable Task 7 handoff to Task 8; Task 7 does not grant deletion authority.

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
- Consumes: the exact `$projectControlPublicationCommit` from Task 6 and the exact clean `$coreReferenceRepairCommit` recorded by Task 7.
- Produces: `ready-for-deletion` coverage and a durable human review record; it performs no Core deletion.

- [ ] **Step 1: Run the external preflight as a RED**

First prove Core still points to the exact clean Task 7 commit:

```powershell
if ((git -C $coreWorktree rev-parse HEAD).Trim() -ne $coreReferenceRepairCommit) { throw "Core HEAD drifted after Task 7." }
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
- Core reference-repair diff;
- retained source/test anchors;
- Task 6 and Task 7 gate output.

Require explicit answers for coverage closure, authority honesty, reference closure, guard preservation, rollback, and exact deletion scope. Critical and Important findings block readiness.

- [ ] **Step 3: Write the review record from actual evidence**

`MIGRATION_REVIEW.md` records the literal `$projectControlPublicationCommit` and `$coreReferenceRepairCommit`, exact four source paths/blobs, tests run, reference-scan result, reviewer verdict, rollback procedure, remaining risks/unknowns, and the statement “ready for source deletion” only after the verdict passes. Do not write simulated command output.

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
git add docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md data migrations/V0_1_0a_1/core/families/core-route/coverage.json tests generated/project-index.json
git diff --cached --check
git commit -m "docs: authorize Core route source cleanup"
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
git diff --cached --check
git commit -m "docs: remove migrated Core route records"
```

Capture the resulting 40-character commit as `$coreCleanupCommit`.

### Task 10: Close the Pilot Transaction and Verify Both Repositories

**Files:**
- Create: `data/evidence/core-route-cleanup.json`
- Modify: `data/nodes/core-route.json`
- Delete: `data/work/core-route-pilot.json`
- Modify: `migrations/V0_1_0a_1/core/families/core-route/coverage.json`
- Modify: `docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md`
- Modify: `tests/core-doc-migration.test.ts`
- Modify: `tests/seed-project.test.ts`
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

- [ ] **Step 2: Finalize coverage and Evidence with the real commit**

Set `coreCleanupCommit` to `$coreCleanupCommit`, set status `closed`, add `evidence-core-route-cleanup` to the Node, and remove the pilot Work record. The cleanup Evidence summary must name the exact four removed paths and the passing Core gate. Update `MIGRATION_REVIEW.md` with post-cleanup verification without rewriting the earlier readiness verdict.

- [ ] **Step 3: Regenerate and run Project Control gates**

Run:

```powershell
npm run generate
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
git add data migrations/V0_1_0a_1/core/families/core-route/coverage.json docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md tests generated/project-index.json
git diff --cached --check
git commit -m "docs: close Core route migration pilot"
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

Request one contract/factual-honesty review and one documentation-architecture/provenance review. Both review the exact Project Control range for Tasks 1–10, the exact Core range for Tasks 7–9, generated artifacts, all gate outputs, deletion allowlist, and rollback commits. Any Critical or Important finding requires a new RED, correction, complete affected gates, and fresh verdict from both reviewers.

- [ ] **Step 8: Record the next planning boundary**

The final report recommends a separate `TEMPLATE_BUILDER_*` family implementation plan using the reviewed pilot contract. It must not automatically mark any Template Builder source authoritative or deletable. Phase 3 begins only after the pilot review is READY.

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
- [ ] Two final reviewers report Critical = 0 and Important = 0.
- [ ] No Editor, Backend, Agent, Skill, public Doc API, database, or GUI-write scope entered the diff.
