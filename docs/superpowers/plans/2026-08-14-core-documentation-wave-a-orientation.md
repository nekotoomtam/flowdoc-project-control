# Core Documentation Wave A Orientation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce one reviewed Wave A orientation artifact that assigns all 173 frozen `template-builder`, `live-draft`, `text-engine`, and `text-block` sources to bounded semantic leaf batches without modifying Core or publishing canonical truth.

**Architecture:** A project-local JSON artifact holds orientation sources, provisional family models, semantic subgroups, source assignments, evidence needs, and synthesis order. One focused Vitest file owns this planning-data contract and compares it directly with the frozen inventory and family map; generic migration schemas and tools remain unchanged.

**Tech Stack:** JSON, TypeScript 7, Vitest 4, Node.js file APIs, existing Project Control migration inventory.

## Global Constraints

- Governing spec: `docs/superpowers/specs/2026-08-14-core-documentation-wave-a-orientation-design.md`.
- Frozen Core inventory commit: `76a2f2311a898e781f53773390d47b05812911e4`.
- Frozen inventory digest: `36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b`.
- Family counts are exact: `template-builder` 73, `live-draft` 64, `text-engine` 26, `text-block` 10, total 173.
- Implementation changes exactly two tracked paths: `migrations/V0_1_0a_1/core/wave-a-orientation.json` and `tests/core-doc-wave-a-orientation.test.ts`.
- Do not modify Core, inventory, family map, coverage, canonical documents, schemas, generic migration tools, package files, generated index, or application/runtime code.
- Do not run broad unit, build, E2E, Project Control `check`, or Core suites. Run only the named focused test, Project Control type-check once at closure, and diff/scope checks.
- Old overview-like records guide grouping but are not current authority.
- Every source has exactly one primary subgroup assignment. Use cross-references instead of duplicate assignment.
- Normal subgroup size is 15–25 sources. More than 25 requires a non-empty cohesion rationale.
- No leaf synthesis, canonical publication, source deletion, merge, push, tag, or stash operation is authorized.
- If a focused command gives no verdict within ten minutes, stop it, record `NO VERDICT`, preserve the exact diff, and diagnose only that focused command.
- Record performance-only and Minor findings for later work; fix only Critical or Important findings about coverage, source ownership, or boundary correctness.

## File Structure

### Create: `migrations/V0_1_0a_1/core/wave-a-orientation.json`

Owns the approved Wave A planning data:

```ts
type WaveAFamilyId =
  | "template-builder"
  | "live-draft"
  | "text-engine"
  | "text-block";

type FamilyReviewState = "orientation-selected" | "mapped";

interface OrientationSource {
  path: string;
  rationale: string;
}

interface EvidenceCheck {
  question: string;
  anchors: string[];
}

interface OrientationConflict {
  summary: string;
  owningSubgroupId: string;
  evidenceNeeded: string[];
}

interface SemanticSubgroup {
  subgroupId: string;
  title: string;
  responsibility: string;
  boundary: string;
  proposedLeafPath: string;
  sourcePaths: string[];
  dependsOn: string[];
  crossReferences: string[];
  evidenceChecks: EvidenceCheck[];
  oversizedCohesionRationale: string | null;
}

interface FamilyOrientation {
  familyId: WaveAFamilyId;
  sourceCount: number;
  reviewState: FamilyReviewState;
  orientationSources: OrientationSource[];
  provisionalModel: string | null;
  subgroups: SemanticSubgroup[];
  conflicts: OrientationConflict[];
}

interface WaveAOrientation {
  kind: "core-document-wave-a-orientation";
  schemaVersion: 1;
  releaseLine: "V0_1_0a_1";
  repositoryId: "repo-core";
  sourceCommit: string;
  inventoryDigest: string;
  reviewState: "draft" | "reviewed";
  families: FamilyOrientation[];
  synthesisOrder: string[];
}
```

Subgroup references use `<familyId>/<subgroupId>`. Proposed leaves stay beneath `docs/versions/V0_1_0a_1/core/<familyId>/` and end in `.md`.

### Create: `tests/core-doc-wave-a-orientation.test.ts`

Owns only the Wave A planning contract. It reads the orientation artifact, `inventory.json`, and `family-map.json`; it does not import or modify generic migration validation.

---

### Task 1: Freeze the Wave A contract and orientation sets

**Files:**
- Create: `migrations/V0_1_0a_1/core/wave-a-orientation.json`
- Create: `tests/core-doc-wave-a-orientation.test.ts`

**Interfaces:**
- Consumes: stored Core inventory and family-map JSON.
- Produces: draft `WaveAOrientation` identity, four family rows, and reviewed orientation-source selections.

- [ ] **Step 1: Capture clean bases**

Capture the clean Project Control head once as `$orientationBase`. Require Core clean at `c503a45c03e0ce3b7a6efba2b029ca842017faa0`. Stop on drift.

```powershell
$orientationBase = git rev-parse HEAD
git status --short
```

- [ ] **Step 2: Write the failing identity test**

Create the test file with the interfaces above and these helpers:

```ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

interface InventoryFile {
  path: string;
  candidateFamily: string;
}

interface CoreMarkdownInventory {
  sourceCommit: string;
  sourceDigest: string;
  expectedFileCount: number;
  files: InventoryFile[];
}

interface FamilySource { path: string }
interface FamilyAssignment { familyId: string; sources: FamilySource[] }
interface CoreFamilyMap { inventoryDigest: string; families: FamilyAssignment[] }

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

function sorted(values: string[]): string[] {
  return [...values].sort();
}
```

Read the three JSON files and require the exact top-level identity, `reviewState: "draft"`, empty `synthesisOrder`, inventory count 470, matching digest, and ordered family/count pairs `template-builder`/73, `live-draft`/64, `text-engine`/26, `text-block`/10.

Add a second test requiring each family to have 3–8 distinct orientation sources, each with non-empty rationale and exact membership in that family-map row.

- [ ] **Step 3: Run RED**

```powershell
npm test -- tests/core-doc-wave-a-orientation.test.ts
```

Expected: FAIL because `wave-a-orientation.json` is absent.

- [ ] **Step 4: Read the exact orientation candidates**

Use these candidates; replace one only when its content is not orienting, and record the reason.

`template-builder`:

```text
docs/TEMPLATE_BUILDER_WYSIWYG_DRAFT_DESIGN_LOCK.md
docs/TEMPLATE_BUILDER_WYSIWYG_CLOSE_AUDIT.md
docs/TEMPLATE_BUILDER_WYSIWYG_EXECUTION_CLOSE_AUDIT.md
docs/TEMPLATE_BUILDER_STRUCTURAL_RUNTIME_CLOSE_AUDIT.md
docs/TEMPLATE_BUILDER_VIEWPORT_LARGE_DOCUMENT_AUDIT.md
examples/template-builder-sandbox/README.md
```

`live-draft`:

```text
docs/superpowers/specs/2026-07-28-unified-incremental-live-draft-product-readiness-design.md
docs/LIVE_DRAFT_MR1_UNIFIED_INCREMENTAL_ROOT_5B.md
docs/LIVE_DRAFT_MR1_UNIFIED_TEXT_BLOCK_ROOT_5A.md
docs/LIVE_DRAFT_MR1_PERSISTENT_FLOW_FOUNDATION.md
docs/LIVE_DRAFT_CROSS_RUNTIME_PARITY_HANDOFF.md
.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/final-review-verdict.md
.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/source-envelope-verification.md
docs/superpowers/specs/2026-08-11-source-commit-transaction-seam-review-amendment-design.md
```

`text-engine`:

```text
docs/TEXT_ENGINE_ADAPTER_LANE_CLOSE_AUDIT.md
docs/TEXT_ENGINE_ADAPTER_SPI_BOUNDARY.md
docs/TEXT_ENGINE_RUNTIME_IDENTITY_BOUNDARY.md
docs/TEXT_ENGINE_EVIDENCE_ACCEPTANCE_BOUNDARY.md
docs/TEXT_ENGINE_WASM_ARTIFACT_PRODUCTION_GATE.md
packages/text-engine-rust-wasm/README.md
```

`text-block`:

```text
docs/TEXT_BLOCK_V1_VERSION_MIGRATION_DECISION.md
docs/TEXT_BLOCK_V4_AUTHORING_CONTRACT.md
docs/TEXT_BLOCK_V4_READINESS_CLOSE_AUDIT.md
docs/TEXT_BLOCK_V4_MEASUREMENT_SOURCE_RANGES.md
```

- [ ] **Step 5: Create the minimal draft artifact**

Add the exact identity and four ordered family rows. Set each family to `orientation-selected`, include the selected paths with content-specific rationales, and set `provisionalModel: null`, `subgroups: []`, `conflicts: []`. Set top-level state to `draft` and order to `[]`.

- [ ] **Step 6: Run GREEN and commit**

```powershell
npm test -- tests/core-doc-wave-a-orientation.test.ts
git diff --check
git add -- migrations/V0_1_0a_1/core/wave-a-orientation.json tests/core-doc-wave-a-orientation.test.ts
git commit -m "docs: select Wave A orientation sources"
```

### Task 2: Map `template-builder`

**Files:**
- Modify: `migrations/V0_1_0a_1/core/wave-a-orientation.json`
- Modify: `tests/core-doc-wave-a-orientation.test.ts`

**Interfaces:**
- Consumes: Task 1 artifact and exact 73-source family-map row.
- Produces: stable Template Builder subgroup IDs, proposed leaves, source assignments, and evidence questions.

- [ ] **Step 1: Add the failing family-closure helper**

Add this reusable contract and call it for `template-builder`, 73:

```ts
function expectMappedFamily(
  orientation: WaveAOrientation,
  familyMap: CoreFamilyMap,
  familyId: WaveAFamilyId,
  expectedCount: number,
): void
```

It asserts:

- `reviewState` is `mapped` and `provisionalModel` is non-empty;
- flattened `sourcePaths` are distinct and equal the sorted family-map paths;
- the assigned count equals `expectedCount`;
- each subgroup has a slug ID, title, responsibility, boundary, sources, unique proposed leaf beneath the correct family directory, and at least one evidence check;
- dependency and cross-reference values use `<familyId>/<subgroupId>`;
- a subgroup over 25 sources has a non-empty cohesion rationale and all other groups have `null`;
- every conflict names an existing local subgroup and non-empty evidence needs.

- [ ] **Step 2: Run RED**

Run the focused test. Expected: FAIL because Template Builder is not mapped.

- [ ] **Step 3: Map from overview to detail**

Read the six selected orientation sources first. Enumerate all 73 family-map rows, inspect each H1 and opening contract sections, and read a full source only when ownership is ambiguous or claims conflict.

Test, rather than assume, these starting hypotheses:

```text
runtime-and-store
draft-selection-and-contenteditable
rich-inline-and-history
structural-editing
viewport-and-rendering
sandbox-and-integration
```

Split, merge, or rename a hypothesis when the sources prove a cleaner responsibility. Assign every path once. Put disputed current-state claims under `conflicts` and name concrete code/test/contract anchors in `evidenceChecks`.

- [ ] **Step 4: Run GREEN and commit**

```powershell
npm test -- tests/core-doc-wave-a-orientation.test.ts
git diff --check
git add -- migrations/V0_1_0a_1/core/wave-a-orientation.json tests/core-doc-wave-a-orientation.test.ts
git commit -m "docs: map Template Builder orientation"
```

### Task 3: Map `live-draft`

**Files:**
- Modify: `migrations/V0_1_0a_1/core/wave-a-orientation.json`
- Modify: `tests/core-doc-wave-a-orientation.test.ts`

**Interfaces:**
- Consumes: Task 1 orientation sources and exact 64-source family-map row.
- Produces: mapped product-truth, layout, retained-flow, root-transition, and corrective-evidence boundaries.

- [ ] **Step 1: Add RED**

Call `expectMappedFamily(orientation, familyMap, "live-draft", 64)` and run the focused test.

Expected: FAIL because Live Draft is not mapped.

- [ ] **Step 2: Review all 64 sources**

Start from the eight orientation sources and test these hypotheses:

```text
product-readiness-and-authority
layout-geometry-and-display-lists
persistent-flow-and-retained-ranges
incremental-root-and-source-envelope
cross-runtime-evidence-and-corrections
```

Plans, specs, and SDD reports describing the same transition retain their different document-class meaning. A newer plan does not outrank executable Evidence by date. Record source-authority and fallback-topology disagreements for later leaf verification.

- [ ] **Step 3: Run GREEN and commit**

```powershell
npm test -- tests/core-doc-wave-a-orientation.test.ts
git diff --check
git add -- migrations/V0_1_0a_1/core/wave-a-orientation.json tests/core-doc-wave-a-orientation.test.ts
git commit -m "docs: map Live Draft orientation"
```

### Task 4: Map `text-engine`

**Files:**
- Modify: `migrations/V0_1_0a_1/core/wave-a-orientation.json`
- Modify: `tests/core-doc-wave-a-orientation.test.ts`

**Interfaces:**
- Consumes: Task 1 orientation sources and exact 26-source family-map row.
- Produces: mapped adapter/provider, runtime Evidence, shaping, and WASM delivery boundaries.

- [ ] **Step 1: Add RED**

Call `expectMappedFamily(orientation, familyMap, "text-engine", 26)` and run the focused test.

Expected: FAIL because Text Engine is not mapped.

- [ ] **Step 2: Review all 26 sources**

Test these hypotheses:

```text
adapter-and-provider
runtime-identity-and-evidence
rustybuzz-shaping
wasm-toolchain-and-artifacts
```

Treat the package README as an operational-boundary candidate, not automatically migratable prose. Record its repo-local status as an evidence question; orientation does not change its existing disposition.

- [ ] **Step 3: Run GREEN and commit**

```powershell
npm test -- tests/core-doc-wave-a-orientation.test.ts
git diff --check
git add -- migrations/V0_1_0a_1/core/wave-a-orientation.json tests/core-doc-wave-a-orientation.test.ts
git commit -m "docs: map Text Engine orientation"
```

### Task 5: Map `text-block`

**Files:**
- Modify: `migrations/V0_1_0a_1/core/wave-a-orientation.json`
- Modify: `tests/core-doc-wave-a-orientation.test.ts`

**Interfaces:**
- Consumes: Task 1 orientation sources and exact 10-source family-map row.
- Produces: mapped V1 history/migration and V4 current-contract boundaries.

- [ ] **Step 1: Add RED**

Call `expectMappedFamily(orientation, familyMap, "text-block", 10)` and run the focused test.

Expected: FAIL because Text Block is not mapped.

- [ ] **Step 2: Review all 10 sources**

Test these hypotheses:

```text
v1-grammar-and-migration
v4-authoring-and-inline
v4-measurement-and-pagination
```

Do not rewrite V1 history as a V4 current contract. Record the V1-to-V4 relationship and any still-executable compatibility requirement as later evidence checks.

- [ ] **Step 3: Run GREEN and commit**

```powershell
npm test -- tests/core-doc-wave-a-orientation.test.ts
git diff --check
git add -- migrations/V0_1_0a_1/core/wave-a-orientation.json tests/core-doc-wave-a-orientation.test.ts
git commit -m "docs: map Text Block orientation"
```

### Task 6: Close cross-family coverage and freeze synthesis order

**Files:**
- Modify: `migrations/V0_1_0a_1/core/wave-a-orientation.json`
- Modify: `tests/core-doc-wave-a-orientation.test.ts`

**Interfaces:**
- Consumes: four mapped families from Tasks 2–5.
- Produces: top-level `reviewState: "reviewed"` and a dependency-valid `synthesisOrder` containing every qualified subgroup ID exactly once.

- [ ] **Step 1: Write cross-family RED**

Add tests that flatten all assignments and require:

```ts
expect(orientation.reviewState).toBe("reviewed");
expect(assignedPaths).toHaveLength(173);
expect(new Set(assignedPaths).size).toBe(173);
expect(sorted(assignedPaths)).toEqual(sorted(expectedWaveAPaths));
expect(new Set(orientation.synthesisOrder)).toEqual(
  new Set(allQualifiedSubgroupIds),
);
```

Derive `expectedWaveAPaths` from the exact four family-map rows. Build an order index and require every `dependsOn` target to exist and appear earlier. Reject self-dependencies and cycles. Require every cross-reference target to exist without imposing order.

Run the focused test. Expected: FAIL because the artifact remains `draft` and has no synthesis order.

- [ ] **Step 2: Resolve cross-family dependencies**

Compare all four provisional models. Add a dependency only when a downstream leaf cannot be understood or verified first. Use cross-references for related concepts that do not block synthesis. Populate a topological `synthesisOrder` and set the top-level state to `reviewed`.

Do not force the old prefix order when the reviewed dependency graph proves a different leaf order.

- [ ] **Step 3: Run the final narrow gates**

Run exactly:

```powershell
npm test -- tests/core-doc-wave-a-orientation.test.ts
npm run type-check
git diff --check
```

Expected: focused PASS, type-check PASS, diff check clean. Do not run broad suites.

- [ ] **Step 4: Verify scope and Core immutability**

Require the Project Control range from `$orientationBase` to contain only the exact two authorized paths. Require Core clean and still at `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.

- [ ] **Step 5: Commit closure**

```powershell
git add -- migrations/V0_1_0a_1/core/wave-a-orientation.json tests/core-doc-wave-a-orientation.test.ts
git commit -m "docs: freeze Wave A leaf batches"
```

Capture `$orientationCommit = git rev-parse HEAD`. Do not amend it while review is active.

### Task 7: One focused orientation review and handoff

**Files:**
- Review: `migrations/V0_1_0a_1/core/wave-a-orientation.json`
- Review: `tests/core-doc-wave-a-orientation.test.ts`
- Optional ignored report: `.superpowers/sdd/2026-08-14-core-documentation-wave-a-orientation/task-7-report.md`

**Interfaces:**
- Consumes: exact `$orientationBase..$orientationCommit` two-path range and focused gate output.
- Produces: READY evidence and an ordered list for subsequent leaf-batch plans.

- [ ] **Step 1: Prepare one exact review package**

Record base/head hashes, exact two-path diff, frozen inventory identity, focused test count, type-check result, family/subgroup counts, and synthesis order. Do not claim broad tests ran.

- [ ] **Step 2: Request one independent review**

The reviewer checks:

- 173/173 exact one-owner closure;
- orientation-source quality and family membership;
- coherent subgroup responsibilities and non-overlap;
- honest conflict and evidence recording;
- proposed leaf paths and batch sizes;
- dependency and synthesis-order validity;
- no claim of current authority;
- exact two-path Project Control scope and zero Core changes.

READY requires Critical 0 and Important 0. Record Minor findings for later leaf work unless they affect coverage or boundary correctness.

- [ ] **Step 3: Handle valid blocking findings narrowly**

For a valid Critical or Important finding, add one focused RED to the orientation test, correct only the artifact/test, rerun the three narrow gates, commit a correction, and request one fresh review. Do not modify generic tooling or run broad suites.

- [ ] **Step 4: Publish the handoff**

When READY, record:

- exact final commit and two-path range;
- family and subgroup counts;
- ordered qualified subgroup IDs;
- first recommended leaf batch and exact source count;
- deferred conflicts and evidence checks;
- focused test/type-check results;
- confirmation that Core and canonical truth remain unchanged.

The next work item is a separate leaf-batch implementation plan derived from the first `synthesisOrder` entry. It must not repeat orientation or enlarge the frozen batch.
