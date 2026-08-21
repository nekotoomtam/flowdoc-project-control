# Template Builder Documentation Wave 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate 73 frozen Template Builder sources into five canonical leaves and one family overview, register the complete documentation set once, and retain `unknown` truth with no migration or cleanup authority.

**Architecture:** Three read-only source-audit lanes run in parallel and feed one serialized canonical integration lane. The overview is created first as a bounded navigation frame, leaf writing is grouped by responsibility, and registration occurs only after all five leaves pass focused review.

**Tech Stack:** TypeScript 7, Node.js 26, Vitest 4, Ajv 8, Markdown, JSON, Git, PowerShell 7.

**Spec:** `docs/superpowers/specs/2026-08-21-template-builder-documentation-wave-1-design.md`

## Global Constraints

- Frozen Core source commit is exactly `76a2f2311a898e781f53773390d47b05812911e4`.
- Read-only current Core evidence head is exactly `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.
- Orientation inventory digest is exactly `36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b`.
- Template Builder owns exactly 73 declared and 73 unique source paths across five subgroups.
- Core is read-only: no Core source, test, package, fixture, documentation, branch, tag, or working-tree mutation.
- Project Control creates exactly one overview, five leaves, six active Documents, twelve completed Evidence records, and one `template-builder` Node.
- Template Builder and parent Core remain `unknown`.
- Do not create migration coverage, cleanup Evidence, deletion Work, or source deletion.
- Historical phase order and `PASS` labels are not current authority; current code, fixtures, and focused tests govern current claims.
- Former source paths must not appear in canonical leaves, leaf tests, records, Node summaries, document map, or generated output.
- Mutable Core references such as `main`, `master`, `develop`, `HEAD`, tags, short hashes, and arbitrary branches are forbidden.
- Canonical truth paths remain LF through the repository `.gitattributes` contract.
- Shared registration files have one writer. Parallel workers may write only their assigned ignored matrices or disjoint candidate leaf/test files and must not commit concurrently.

---

## Planned file structure

### Canonical documents

- Create: `docs/versions/V0_1_0a_1/core/template-builder/OVERVIEW.md`
- Create: `docs/versions/V0_1_0a_1/core/template-builder/sandbox-runtime-and-store.md`
- Create: `docs/versions/V0_1_0a_1/core/template-builder/viewport-and-virtualized-rendering.md`
- Create: `docs/versions/V0_1_0a_1/core/template-builder/structural-runtime-and-navigation.md`
- Create: `docs/versions/V0_1_0a_1/core/template-builder/wysiwyg-draft-input-and-guards.md`
- Create: `docs/versions/V0_1_0a_1/core/template-builder/rich-inline-commit-and-session-lifecycle.md`

### Focused tests

- Create: `tests/template-builder-documentation-wave-1.test.ts`
- Create: `tests/template-builder-sandbox-structural-docs.test.ts`
- Create: `tests/template-builder-viewport-doc.test.ts`
- Create: `tests/template-builder-wysiwyg-rich-inline-docs.test.ts`
- Modify only when stale assumptions are proven by RED: `tests/seed-project.test.ts`
- Modify only when stale assumptions are proven by RED: `tests/core-doc-migration.test.ts`
- Modify only when stale assumptions are proven by RED: `tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts`
- Modify only when stale assumptions are proven by RED: `tests/text-engine-runtime-identity-evidence-leaf.test.ts`
- Modify only when stale assumptions are proven by RED: `tests/text-engine-adapter-provider-leaf.test.ts`
- Modify only when stale assumptions are proven by RED: `tests/text-engine-rustybuzz-family-closeout.test.ts`

### Registration and current truth

- Create: `data/nodes/template-builder.json`
- Create: six `data/documents/template-builder-*.json` records.
- Create: twelve `data/evidence/template-builder-*.json` records.
- Modify: `data/nodes/core.json`
- Modify: `data/repositories/core.json`
- Modify: `docs/domains/project-control.md`
- Modify: `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`
- Regenerate only: `generated/project-index.json`

### Ignored audit material

- Create: `.superpowers/sdd/2026-08-21-template-builder-documentation-wave-1/lane-a-sandbox-structural.md`
- Create: `.superpowers/sdd/2026-08-21-template-builder-documentation-wave-1/lane-b-viewport.md`
- Create: `.superpowers/sdd/2026-08-21-template-builder-documentation-wave-1/lane-c-wysiwyg-rich-inline.md`
- Create: `.superpowers/sdd/2026-08-21-template-builder-documentation-wave-1/progress.md`
- Create: `.superpowers/sdd/2026-08-21-template-builder-documentation-wave-1/task-1-report.md` through `task-6-report.md`

---

### Task 1: Freeze the family, audit three lanes, and publish the overview frame

**Files:**
- Create: `tests/template-builder-documentation-wave-1.test.ts`
- Create: `docs/versions/V0_1_0a_1/core/template-builder/OVERVIEW.md`
- Create ignored: the three lane matrices and `progress.md`

**Interfaces:**
- Consumes: Wave A orientation, inventory, frozen Core commit, current Core evidence head, and design spec.
- Produces: exact family constants, three complete claim matrices, protected-blob snapshot, and a candidate overview frame consumed by Tasks 2-5.

- [ ] **Step 1: Verify isolation, identities, and clean baselines**

Run from Project Control:

```powershell
git status --short
git branch --show-current
git rev-parse HEAD
npm test
```

Run read-only from Core:

```powershell
git -C C:\Users\nekot\Documents\GitHub\flowdoc-vnext-core\.worktrees\core-route-documentation-cleanup status --short
git -C C:\Users\nekot\Documents\GitHub\flowdoc-vnext-core\.worktrees\core-route-documentation-cleanup rev-parse HEAD
```

Expected: Project Control baseline is 22 files / 203 tests; both statuses are clean; Core is the exact evidence head.

- [ ] **Step 2: Write the family RED**

Create `tests/template-builder-documentation-wave-1.test.ts` with this initial contract:

```ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const overviewPath = "docs/versions/V0_1_0a_1/core/template-builder/OVERVIEW.md";
const frozenCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const coreEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const inventoryDigest = "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const leafNames = [
  "sandbox-runtime-and-store.md",
  "viewport-and-virtualized-rendering.md",
  "structural-runtime-and-navigation.md",
  "wysiwyg-draft-input-and-guards.md",
  "rich-inline-commit-and-session-lifecycle.md",
] as const;

describe("Template Builder documentation Wave 1", () => {
  it("freezes one 73-source family and creates the bounded overview first", async () => {
    const orientation = JSON.parse(await readFile(
      join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      "utf8",
    )) as {
      sourceCommit: string;
      inventoryDigest: string;
      families: Array<{
        familyId: string;
        sourceCount: number;
        subgroups: Array<{ sourcePaths: string[]; proposedLeafPath: string }>;
      }>;
    };
    const family = orientation.families.find(({ familyId }) => familyId === "template-builder");
    expect(family).toBeDefined();
    const sourcePaths = family!.subgroups.flatMap(({ sourcePaths }) => sourcePaths);
    expect(orientation.sourceCommit).toBe(frozenCommit);
    expect(orientation.inventoryDigest).toBe(inventoryDigest);
    expect(family!.sourceCount).toBe(73);
    expect(sourcePaths).toHaveLength(73);
    expect(new Set(sourcePaths).size).toBe(73);

    const overview = await readFile(join(root, overviewPath), "utf8");
    for (const leafName of leafNames) expect(overview).toContain(`](${leafName})`);
    expect(overview).toContain(coreEvidenceCommit);
    expect(overview).toMatch(/Template Builder[^.]*`unknown`/iu);
    expect(overview).toMatch(/no[^.]*source cleanup[^.]*authorized/iu);
  });
});
```

- [ ] **Step 3: Run RED**

```powershell
npm test -- tests/template-builder-documentation-wave-1.test.ts
```

Expected: Vitest starts and fails only because `OVERVIEW.md` is absent.

- [ ] **Step 4: Dispatch three read-only source-audit lanes in parallel**

Lane A reads all 24 sandbox and structural sources. Lane B reads all 19 viewport sources. Lane C reads all 30 WYSIWYG and rich-inline sources. Each matrix records, for every source:

```text
source path | frozen blob | current blob | material claim | current executable anchor |
destination heading | historical/current/unknown | forbidden wording | unresolved conflict
```

Require 73 assigned, 73 unique, zero missing, zero extra, and zero blob drift. Workers may write only their assigned ignored matrix; no canonical, data, test, generated, or Core writes.

- [ ] **Step 5: Run the read-only Core evidence batch once**

```powershell
npm test -- --maxWorkers=1 `
  tests/templateBuilderSandboxBoundary.test.ts `
  tests/structuralPacket.test.ts `
  tests/structuralProjection.test.ts `
  tests/richInlineCommit.test.ts `
  tests/richInlineLiveExactParityAudit.test.ts `
  tests/richInlineSessionPersistence.test.ts `
  tests/wysiwygExecutionCloseAudit.test.ts `
  tests/wysiwygExecutionRebaselineAudit.test.ts `
  tests/wysiwygPrimaryInputDecisionGate.test.ts `
  tests/wysiwygReentryAudit.test.ts
```

Run from the exact Core evidence worktree. Record file/test counts and any load-only timeout separately; do not modify Core.

- [ ] **Step 6: Write the minimum overview frame**

Create headings exactly:

```markdown
## Authority and Status
## Family Architecture
## Canonical Documents
## Ownership Map
## Current Verified State
## Known Limits and Unknowns
## Migration and Cleanup Boundary
## Evidence Anchors
```

List all five leaf links, the architecture from the spec, pinned Core evidence commit, `unknown` state, and explicit no-coverage/no-cleanup wording. Keep leaf detail limited to orientation responsibility and boundary until Tasks 2-4 complete.

- [ ] **Step 7: Run GREEN and commit**

```powershell
npm test -- tests/template-builder-documentation-wave-1.test.ts
npm run type-check
git diff --check
git add -- docs/versions/V0_1_0a_1/core/template-builder/OVERVIEW.md tests/template-builder-documentation-wave-1.test.ts
git commit -m "docs: frame Template Builder documentation wave"
```

Expected: focused test and type-check pass; exact two tracked paths committed; ignored matrices stay uncommitted.

---

### Task 2: Consolidate sandbox runtime/store and structural runtime/navigation

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/template-builder/sandbox-runtime-and-store.md`
- Create: `docs/versions/V0_1_0a_1/core/template-builder/structural-runtime-and-navigation.md`
- Create: `tests/template-builder-sandbox-structural-docs.test.ts`

**Interfaces:**
- Consumes: Lane A matrix, overview frame, exact orientation subgroups, and Core evidence results.
- Produces: two reviewed leaves and exact boundaries consumed by the final overview and registration.

- [ ] **Step 1: Write RED for both missing leaves**

The test derives both subgroups from orientation rather than copying former source paths. Require these exact headings in both leaves:

```ts
const commonHeadings = [
  "## Authority and Scope",
  "## Responsibility Boundary",
  "## State and Failure Model",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;
```

Add sandbox-specific headings for package boundary, runtime normalization, mutation packets, cache/store application, plain-text history, and live-layout summaries. Add structural-specific headings for projection, packet v1, command policy, outline jumps, and diagnostics navigation.

Mutation rows must reject claims that the sandbox is canonical storage, packet v1 is public/durable, the boot snapshot auto-refreshes, diagnostics may guess missing node IDs, or layout summaries are renderer output.

- [ ] **Step 2: Run RED**

```powershell
npm test -- tests/template-builder-sandbox-structural-docs.test.ts
```

Expected: failures are only missing leaf files.

- [ ] **Step 3: Write both bounded leaves from Lane A**

Every current claim cites a full immutable anchor such as `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/coreBoundary.ts`. Former source paths appear only in the ignored matrix, never in the leaves or test. Cross-link the two leaves and the other planned canonical leaf filenames without absorbing their authority.

- [ ] **Step 4: Run focused Core and Project Control GREEN**

```powershell
npm test -- tests/template-builder-sandbox-structural-docs.test.ts
```

Core read-only:

```powershell
npm test -- --maxWorkers=1 tests/templateBuilderSandboxBoundary.test.ts tests/structuralPacket.test.ts tests/structuralProjection.test.ts
```

- [ ] **Step 5: Review exact source closure and commit**

Require Lane A closure 24/24, immutable refs only, no former source literals, no production/persistence/renderer/collaboration claims, and unchanged overview frame.

```powershell
git diff --check
git add -- docs/versions/V0_1_0a_1/core/template-builder/sandbox-runtime-and-store.md docs/versions/V0_1_0a_1/core/template-builder/structural-runtime-and-navigation.md tests/template-builder-sandbox-structural-docs.test.ts
git commit -m "docs: consolidate Template Builder runtime foundations"
```

---

### Task 3: Consolidate viewport, scheduler, and virtualized rendering

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/template-builder/viewport-and-virtualized-rendering.md`
- Create: `tests/template-builder-viewport-doc.test.ts`

**Interfaces:**
- Consumes: Lane B matrix, store-backed-model boundary, orientation evidence checks.
- Produces: the viewport leaf and bounded 72-section/936-node shape authority.

- [ ] **Step 1: Write the missing-leaf RED**

Require headings for visible ranges, render windows/shells, measurements, spacers, virtual stacks, lazy detail, scheduler state, scroll restoration, node anchors, current evidence, limits, history, cross-references, and anchors.

Include mutation cases that inject wall-clock latency, DOM recycling, production performance, renderer fidelity, or unbounded large-document claims and require every mutation to fail.

- [ ] **Step 2: Run RED**

```powershell
npm test -- tests/template-builder-viewport-doc.test.ts
```

- [ ] **Step 3: Write the leaf from all 19 Lane B sources**

State exact bounded synthetic shape facts only where current tests support them. Separate request, predicted candidate, measured facts, apply decision, scheduler runtime state, and final render window. Treat stale sequence/request candidates as fail-closed shape guards, not speed evidence.

- [ ] **Step 4: Run GREEN and commit**

```powershell
npm test -- tests/template-builder-viewport-doc.test.ts
```

Core read-only:

```powershell
npm test -- --maxWorkers=1 tests/templateBuilderSandboxBoundary.test.ts
```

Then require 19/19 closure, immutable refs, diff check, and exact two-path commit:

```powershell
git add -- docs/versions/V0_1_0a_1/core/template-builder/viewport-and-virtualized-rendering.md tests/template-builder-viewport-doc.test.ts
git commit -m "docs: consolidate Template Builder viewport contracts"
```

---

### Task 4: Consolidate WYSIWYG draft guards and rich-inline lifecycle

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/template-builder/wysiwyg-draft-input-and-guards.md`
- Create: `docs/versions/V0_1_0a_1/core/template-builder/rich-inline-commit-and-session-lifecycle.md`
- Create: `tests/template-builder-wysiwyg-rich-inline-docs.test.ts`

**Interfaces:**
- Consumes: Lane C matrix, sandbox boundary, exact conflicts TB-C1 through TB-C4.
- Produces: two reviewed authoring leaves and the final downstream ownership chain.

- [ ] **Step 1: Write RED for both missing leaves and all four conflicts**

Require WYSIWYG sections for active draft, selection/caret, text commands, IME guards, local layout summaries, toolbar/field/history planning, current active input, limits, history, cross-references, and anchors.

Require rich-inline sections for segment capture, UTF-16 range mapping, hardening, local rich state, commit planning/application, undo/redo replay, JSON-safe session records, live/exact invalidation, limits, history, cross-references, and anchors.

Mutation rows must reject:

```text
contenteditable is the active primary input
session records are persisted through a storage adapter
live/exact parity proves renderer or export parity
planning/ready means production-ready
IME composition permits commit or range commands
browser-local draft or style state is canonical package truth
```

- [ ] **Step 2: Run RED**

```powershell
npm test -- tests/template-builder-wysiwyg-rich-inline-docs.test.ts
```

- [ ] **Step 3: Write both leaves from all 30 Lane C sources**

Keep textarea-first current input, browser-local draft state, accepted-plan-only mutation, stale-plan rejection, field/style preservation, vNext-native replay, storage-ready-but-not-written session records, and invalidation-only live/exact claims explicit.

- [ ] **Step 4: Run focused GREEN**

```powershell
npm test -- tests/template-builder-wysiwyg-rich-inline-docs.test.ts
```

Core read-only:

```powershell
npm test -- --maxWorkers=1 `
  tests/templateBuilderSandboxBoundary.test.ts `
  tests/richInlineCommit.test.ts `
  tests/richInlineLiveExactParityAudit.test.ts `
  tests/richInlineSessionPersistence.test.ts `
  tests/wysiwygExecutionCloseAudit.test.ts `
  tests/wysiwygExecutionRebaselineAudit.test.ts `
  tests/wysiwygPrimaryInputDecisionGate.test.ts `
  tests/wysiwygReentryAudit.test.ts
```

- [ ] **Step 5: Review 30/30 closure and commit**

```powershell
git diff --check
git add -- docs/versions/V0_1_0a_1/core/template-builder/wysiwyg-draft-input-and-guards.md docs/versions/V0_1_0a_1/core/template-builder/rich-inline-commit-and-session-lifecycle.md tests/template-builder-wysiwyg-rich-inline-docs.test.ts
git commit -m "docs: consolidate Template Builder authoring lifecycle"
```

---

### Task 5: Finalize the overview and register Template Builder truth

**Files:**
- Modify: `docs/versions/V0_1_0a_1/core/template-builder/OVERVIEW.md`
- Modify: `tests/template-builder-documentation-wave-1.test.ts`
- Create: `data/nodes/template-builder.json`
- Create: six Template Builder Document records.
- Create: twelve Template Builder Evidence records.
- Modify: `data/nodes/core.json`
- Modify: `data/repositories/core.json`
- Modify: `docs/domains/project-control.md`
- Modify: `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`
- Regenerate: `generated/project-index.json`
- Modify only after exact stale RED: the dependency tests listed in Planned file structure.

**Interfaces:**
- Consumes: all five reviewed leaves, source matrices, focused results, and prior commits.
- Produces: one complete `unknown` family registration and deterministic read model.

- [ ] **Step 1: Expand the family test to registration RED**

Add exact arrays:

```ts
const documentIds = [
  "doc-template-builder-sandbox-runtime-store",
  "doc-template-builder-viewport-virtualized-rendering",
  "doc-template-builder-structural-runtime-navigation",
  "doc-template-builder-wysiwyg-draft-guards",
  "doc-template-builder-rich-inline-session-lifecycle",
  "doc-template-builder-overview",
] as const;

const evidenceIds = [
  "evidence-template-builder-sandbox-package-boundary",
  "evidence-template-builder-runtime-store-packet-application",
  "evidence-template-builder-plain-text-history-live-layout",
  "evidence-template-builder-viewport-large-document-shape",
  "evidence-template-builder-viewport-scheduler-stale-guards",
  "evidence-template-builder-structural-packet-projection",
  "evidence-template-builder-structural-diagnostics-navigation",
  "evidence-template-builder-wysiwyg-local-draft-eligibility",
  "evidence-template-builder-wysiwyg-ime-planning-guards",
  "evidence-template-builder-contenteditable-range-hardening",
  "evidence-template-builder-rich-inline-commit-replay",
  "evidence-template-builder-session-live-exact-boundary",
] as const;
```

Bind those Evidence IDs to these exact Core anchors:

| Evidence ID | `pathOrContractId` |
| --- | --- |
| `evidence-template-builder-sandbox-package-boundary` | `examples/template-builder-sandbox/package.json` |
| `evidence-template-builder-runtime-store-packet-application` | `examples/template-builder-sandbox/src/coreBoundary.ts` |
| `evidence-template-builder-plain-text-history-live-layout` | `tests/templateBuilderSandboxBoundary.test.ts` |
| `evidence-template-builder-viewport-large-document-shape` | `tests/templateBuilderSandboxBoundary.test.ts` |
| `evidence-template-builder-viewport-scheduler-stale-guards` | `tests/templateBuilderSandboxBoundary.test.ts` |
| `evidence-template-builder-structural-packet-projection` | `tests/structuralPacket.test.ts` |
| `evidence-template-builder-structural-diagnostics-navigation` | `examples/template-builder-sandbox/src/coreBoundary.ts` |
| `evidence-template-builder-wysiwyg-local-draft-eligibility` | `tests/wysiwygPrimaryInputDecisionGate.test.ts` |
| `evidence-template-builder-wysiwyg-ime-planning-guards` | `tests/templateBuilderSandboxBoundary.test.ts` |
| `evidence-template-builder-contenteditable-range-hardening` | `examples/template-builder-sandbox/public/draftContenteditableSurfaceHardening.js` |
| `evidence-template-builder-rich-inline-commit-replay` | `src/authoring/richInlineCommit.ts` |
| `evidence-template-builder-session-live-exact-boundary` | `src/authoring/richInlineSessionPersistence.ts` |

Assert exact Node reciprocity/order, six active Documents, twelve Evidence records at the pinned Core head and fixed timestamp, overview links, map/current-scope wording, generated equality, absent `data/work/template-builder*.json`, absent Template Builder coverage, and unchanged protected Core Route/Text Engine blobs.

- [ ] **Step 2: Run registration RED**

```powershell
npm test -- tests/template-builder-documentation-wave-1.test.ts
```

Expected: overview source-closure assertions remain green; registration assertions fail only because records and final current-truth updates are absent.

- [ ] **Step 3: Finalize the overview from the five reviewed leaves**

Replace orientation-only summaries with exact ownership links, current evidence flow, verified state, limits, migration boundary, and immutable Project Control leaf anchors. Do not duplicate detailed leaf tables.

- [ ] **Step 4: Create exact registration records**

Use this exact Node identity and fill its two arrays from the constants above:

```json
{
  "kind": "node",
  "id": "template-builder",
  "title": "Template Builder",
  "parentId": "core",
  "truthState": "unknown",
  "order": 30,
  "documentIds": [],
  "evidenceIds": [],
  "repositoryIds": ["repo-core", "repo-project-control"]
}
```

Use these exact summaries:

```text
Template Builder Node:
Template Builder documentation synthesis is complete across five bounded leaves and one family overview; family truth remains unknown pending migration coverage, reference repair, publication review, and separately authorized cleanup, while production editor integration, durable persistence, collaboration, renderer output, and performance readiness remain unknown.

Core Node:
Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; the Text Engine documentation set is synthesized across four bounded leaves and one family overview; Template Builder documentation is synthesized across five bounded leaves and one family overview; migration coverage, reference repair, publication review, and family promotion remain incomplete for both documentation families.

Core repository:
Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; Text Engine and Template Builder documentation are synthesized but their migration, publication, and family-promotion work remains incomplete.

Project Control overview and Core Document Map:
Template Builder documentation synthesis is complete across five bounded leaves and one family overview; the Node remains unknown, and no migration coverage, source cleanup, production editor, persistence, collaboration, renderer, or performance authority is created.
```

Every Document uses an exact canonical path, active lifecycle, bounded authority, and immutable repository refs. Every Evidence record uses `repo-core`, current Core evidence commit, one material anchor, a non-inflated verification summary, and `2026-08-21T00:00:00.000Z`.

- [ ] **Step 5: Update shared current truth once and generate**

Update Core Node/repository summary, Project Control domain overview, and Core Document Map. Preserve Core Route closure and Text Engine documentation state verbatim. Then run:

```powershell
npm run generate
npm run check:data
npm test -- tests/template-builder-documentation-wave-1.test.ts tests/template-builder-sandbox-structural-docs.test.ts tests/template-builder-viewport-doc.test.ts tests/template-builder-wysiwyg-rich-inline-docs.test.ts
```

- [ ] **Step 6: Capture and correct only proven stale dependency assumptions**

Run the six listed dependency tests together. Accept failures only for exact child ordering/count, exact Document/Evidence ordering, Template Builder unregistered wording, or map membership. Any content, provenance, protected-blob, or unknown/cleanup failure stops the task.

Update only the stale expectations, preserving every prior Core Route and Text Engine assertion. Rerun until all focused tests pass.

- [ ] **Step 7: Verify deterministic generation and commit**

Run generation twice and require the second run to produce no tracked drift. Then:

```powershell
npm run check:data
npm run type-check
git diff --check
```

Stage only the overview finalization, registration/current-truth files, proven stale tests, and generated index. Commit:

```powershell
git commit -m "docs: register Template Builder documentation family"
```

---

### Task 6: Run final verification, dual review, and hand off Live Draft

**Files:**
- Create ignored: `.superpowers/sdd/2026-08-21-template-builder-documentation-wave-1/task-6-report.md`
- Modify ignored: `.superpowers/sdd/2026-08-21-template-builder-documentation-wave-1/progress.md`

**Interfaces:**
- Consumes: complete implementation range from design base through Task 5.
- Produces: READY evidence or an exact blocker; no additional canonical change without a new focused RED.

- [ ] **Step 1: Assert exact final scope and preservation**

Require:

```text
73 declared / 73 unique / 73 assigned / 0 missing / 0 extra / 0 drift
5 canonical leaves + 1 overview
6 active Documents
12 completed Evidence records
1 Template Builder Node, unknown
parent Core unknown
0 Template Builder coverage files
0 cleanup/deletion authority
Core clean at c503a45c03e0ce3b7a6efba2b029ca842017faa0
```

Verify all protected Core Route and Text Engine blobs are unchanged from the Wave 1 base.

- [ ] **Step 2: Run the Project Control final gate once**

```powershell
npm run generate
npm run check:data
npm run type-check
npm test
npm run build
npm run test:e2e
git diff --check 2d2b7cefafe8a43502576f4ccbd19e712083f09a..HEAD
```

If a known load-sensitive row exceeds its default timeout, run only that exact row once with an explicit 15-second allowance and record the broad gate as no-verdict unless a later unchanged broad rerun passes. Do not claim a broad PASS from an isolated row.

- [ ] **Step 3: Run the exact Core read-only evidence gate once**

Use the exact ten-file command from Task 1. Record counts and keep Core clean. No full Core suite is required because this wave changes no Core file.

- [ ] **Step 4: Request two independent reviews**

Contract/provenance review checks exact source ownership, leaf boundaries, immutable refs, Node/Document/Evidence reciprocity, generated equality, protected blobs, absent coverage/cleanup, and exact scope.

Factual/honesty review checks all six conflicts, browser-local/canonical separation, textarea-first status, non-public packet v1, non-performance viewport evidence, no storage-write claim, invalidation-only live/exact claim, and explicit remaining unknowns.

READY requires Critical 0 and Important 0 from both reviews. Every accepted finding begins with a focused RED, receives the smallest scoped fix, reruns affected focused gates, and gets fresh re-review. Stop after five correction rounds and ask for context.

- [ ] **Step 5: Record completion and next handoff**

Write exact hashes, path counts, test counts, review verdicts, residual Minors, and intentionally excluded migration/cleanup work to the ignored report and ledger. The next documentation handoff is:

```text
live-draft/product-readiness-and-renderer-boundaries
```

Do not start Live Draft, merge, push, tag, create coverage, or delete former Template Builder sources in this task.
