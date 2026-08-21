# Text Block Documentation Wave 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the final Wave A family from ten frozen Text Block sources into three reviewed canonical leaves plus one compact overview, register bounded Project Control truth, and finish the 18-leaf Wave A documentation set without changing Core or authorizing source cleanup.

**Architecture:** A coordinator creates the family frame, then three isolated worktrees synthesize the disjoint orientation subgroups in parallel. The coordinator cherry-picks the three leaf commits in dependency order, reconciles the overview once, registers four Documents, six Evidence records, and one `unknown` Node, updates shared current truth and the generated projection once, and runs one final focused/review sequence.

**Tech Stack:** TypeScript, Vitest, JSON Schema/Ajv, Markdown, Git worktrees, PowerShell 7, deterministic Project Control generator.

**Spec:** `docs/superpowers/specs/2026-08-14-core-documentation-wave-a-orientation-design.md`

## Global Constraints

- Project Control execution base is exactly `8497eaa7b4c34a4ff4ac25af89d8e370b43faa0f`; execution branch is `text-block-documentation-wave-3` in `.worktrees/text-block-documentation-wave-3`.
- Frozen Core inventory commit is exactly `76a2f2311a898e781f53773390d47b05812911e4`; inventory digest is exactly `36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b`.
- Read-only current Core evidence head is exactly `c503a45c03e0ce3b7a6efba2b029ca842017faa0` at `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-core\.worktrees\core-route-documentation-cleanup`.
- Source closure is exactly ten `text-block` paths, assigned once across subgroup counts `4 + 3 + 3`; no missing, duplicate, extra, or cross-family source is permitted.
- Canonical output is exactly one overview plus three leaves. Canonical prose and test source must not contain former source-path literals; source membership is read from the reviewed orientation artifact.
- Every current Core claim uses a full immutable `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:<path>` anchor. Mutable refs such as `main`, `master`, `develop`, short hashes, tags, and `HEAD` are rejected.
- Historical v1 transition intent remains historical. Current v4 claims require matching code/test evidence at the pinned current Core head.
- Register exactly four active Documents, six Evidence records derived from the six orientation evidence checks, and one `text-block` Node with `truthState: "unknown"`; parent Core remains `unknown`.
- Do not create Text Block migration coverage, Work, cleanup/deletion Evidence, publication commits, source deletion, product activation, editor/backend adoption, renderer/export readiness, or performance readiness.
- Core is read-only. Do not modify Core source, tests, packages, assets, lockfiles, or Git state.
- Preserve every pre-existing canonical family record and Markdown byte-for-byte except the minimum additive shared summaries, current-scope map, family overview, dependency-test expectations proven stale by RED, and deterministic generated projection.
- TDD is mandatory: each leaf/registration behavior starts with an observed focused RED and reaches focused GREEN before commit.
- Failure policy: run every required gate normally once. If a named row fails or times out, rerun only that exact row once with one worker and `--testTimeout=30000`. If it passes after an original timeout, record `PASS (isolated)` and `TIMING-SENSITIVE` while leaving the original suite `NOT PASSED / DEFERRED`; if it fails or times out again, record `FAIL` and continue without another retry. A source mismatch, ambiguous assignment, schema state that prevents registration, or destructive-scope conflict is still a factual blocker rather than a timing variance.
- No merge to `main`, push, tag, source deletion, or publication action occurs in this plan.

---

### Task 1: Freeze the family frame and parallel-lane contracts

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/text-block/OVERVIEW.md`
- Create: `tests/text-block-documentation-wave-3.test.ts`
- Create (ignored): `.superpowers/sdd/2026-08-21-text-block-documentation-wave-3/progress.md`
- Create (ignored): `.superpowers/sdd/2026-08-21-text-block-documentation-wave-3/task-1-report.md`

**Interfaces:**
- Consumes: the reviewed `text-block` family in `migrations/V0_1_0a_1/core/wave-a-orientation.json`.
- Produces: one candidate overview frame, exact subgroup/source closure assertions, three disjoint lane worktree bases, and the fixed integration contract consumed by Tasks 2–5.

- [ ] **Step 1: Capture clean identities and prove the exact source partition**

Record Project Control base/head/status and Core head/status. In the family test, load the orientation artifact and assert:

```ts
expect(family.sourceCount).toBe(10)
expect(family.subgroups.map(({ subgroupId, sourcePaths }) => [subgroupId, sourcePaths.length])).toEqual([
  ["v1-grammar-and-migration", 4],
  ["v4-authoring-and-inline", 3],
  ["v4-measurement-and-pagination", 3],
])
expect(new Set(family.subgroups.flatMap(({ sourcePaths }) => sourcePaths)).size).toBe(10)
```

Assert exact proposed leaf paths, dependency order, four conflict IDs `TBL-C1` through `TBL-C4`, frozen commit/digest, and absence of existing Text Block Node/Documents/Evidence/coverage.

- [ ] **Step 2: Run the focused RED**

Run:

```powershell
npm test -- tests/text-block-documentation-wave-3.test.ts
```

Expected: FAIL only because `docs/versions/V0_1_0a_1/core/text-block/OVERVIEW.md` is absent.

- [ ] **Step 3: Write the minimal overview frame**

Create a compact candidate overview containing:

- family state `unknown` and documentation state `candidate`;
- the dependency direction `v1 history -> v4 authoring -> v4 measurement/pagination`;
- links to the three proposed leaves;
- a concise ownership table and explicit unknown/excluded claims;
- no former-source paths, migration coverage, cleanup authorization, or current-truth promotion.

The overview is a frame only; detailed contracts belong to the lane leaves and Task 5 performs final reconciliation.

- [ ] **Step 4: Reach focused GREEN and commit the frame**

Run:

```powershell
npm test -- tests/text-block-documentation-wave-3.test.ts
npm run type-check
git diff --check
```

Commit exactly the overview and family test; the governing plan is committed separately before execution:

```powershell
git add docs/versions/V0_1_0a_1/core/text-block/OVERVIEW.md tests/text-block-documentation-wave-3.test.ts
git commit -m "docs: frame Text Block documentation wave"
```

- [ ] **Step 5: Create three isolated lane worktrees**

Create branches/worktrees from the exact frame commit:

```text
text-block-wave-3-v1
text-block-wave-3-authoring
text-block-wave-3-measurement
```

Verify each begins at the same commit and has clean status. Record a ruling that the user-approved parallel execution overrides the generic sequential-implementer default because the three lanes have disjoint Markdown/test paths and isolated worktrees; only Task 5 may edit shared truth.

### Task 2: Synthesize V1 grammar and migration history

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/text-block/v1-grammar-and-migration-history.md`
- Create: `tests/text-block-v1-grammar-migration-docs.test.ts`
- Create (ignored): lane claim matrix and `task-2-report.md`

**Interfaces:**
- Consumes: orientation subgroup `text-block/v1-grammar-and-migration`, its four source paths, two evidence checks, and conflict `TBL-C1`.
- Produces: one candidate historical/contract leaf and one focused guard; no shared truth.

- [ ] **Step 1: Audit every assigned source and current evidence**

Read all four frozen source documents completely. For each path, verify its blob at frozen commit `76a2f231...` equals the blob at current Core head `c503a45...`. Inspect completely:

```text
src/authoring/textBlockV1Grammar.ts
src/schema/documentVersionPolicy.ts
src/operations/documentOperations.ts
tests/textBlockV1Grammar.test.ts
tests/textBlockV1VersionMigrationDecision.test.ts
tests/textBlockV1GrammarFixtures.test.ts
tests/textBlockV1LayoutCompatibility.test.ts
```

Write an ignored four-row claim matrix with disposition, current/historical status, evidence, conflicts, and excluded claims.

- [ ] **Step 2: Write and verify the missing-leaf RED**

The focused test derives the subgroup paths from orientation, verifies `4/4` unique assignment and source blobs, rejects former-source literals in both leaf and test source, rejects mutable Core refs, and requires explicit separation between historical v1 intent and current bounded v4 evidence.

Run `npm test -- tests/text-block-v1-grammar-migration-docs.test.ts`; expected FAIL only because the leaf is absent.

- [ ] **Step 3: Write the minimal leaf**

Cover:

- v1 target grammar, pure validation/normalization, canonical empty-text producers, and accepted-write alignment;
- active package-v2/document-v3 acceptance and the historical v3-to-v4 copy-forward decision;
- the fact that historical absence of v4 parser/migration activation is not a denial of later bounded v4 implementation;
- no claim of active migration executor, editor/backend integration, pagination, renderer, collaboration, or production readiness;
- immutable current Core evidence anchors and links to the two downstream Text Block leaves.

- [ ] **Step 4: Run focused Core and Project Control GREEN**

Run once:

```powershell
npm test -- tests/text-block-v1-grammar-migration-docs.test.ts
npm run type-check
npm test -- tests/textBlockV1Grammar.test.ts tests/textBlockV1VersionMigrationDecision.test.ts tests/textBlockV1GrammarFixtures.test.ts tests/textBlockV1LayoutCompatibility.test.ts
git diff --check
```

Apply the 30-second isolated-row policy to any named failure or timeout, record a repeated failure as `FAIL`, and continue without another retry. Commit exactly the leaf and its focused test with `docs: consolidate Text Block v1 history`.

### Task 3: Synthesize V4 authoring and inline commands

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/text-block/v4-authoring-and-inline.md`
- Create: `tests/text-block-v4-authoring-inline-docs.test.ts`
- Create (ignored): lane claim matrix and `task-3-report.md`

**Interfaces:**
- Consumes: orientation subgroup `text-block/v4-authoring-and-inline`, its three source paths, two evidence checks, and conflict `TBL-C4`.
- Produces: one candidate current bounded contract leaf and one focused guard; no shared truth.

- [ ] **Step 1: Audit every assigned source and current evidence**

Read the three frozen sources completely and verify frozen/current blob identity. Inspect completely:

```text
src/authoring/textBlockV4Contract.ts
src/authoring/textBlockV4InlineCommands.ts
src/authoring/textBlockV4RichInlineReplace.ts
tests/textBlockV4Contract.test.ts
tests/textBlockV4InlineCommands.test.ts
tests/textBlockV4RichInlineReplace.test.ts
```

Write the ignored three-row claim matrix.

- [ ] **Step 2: Write and verify the missing-leaf RED**

The focused test derives the exact `3/3` sources, verifies blobs, scans both leaf and test source for former paths/mutable refs, and mutation-tests every explicit exclusion. Run the test and require a missing-leaf failure only.

- [ ] **Step 3: Write the minimal leaf**

Cover the flat-inline v4 grammar, canonical selection, atomic/field command planning, policy/pin-aware whole-rich-inline replacement, stale/policy/artifact/session rejection, and accepted apply boundary. Explicitly exclude DOM/IME/clipboard ownership, granular concurrent deltas, CRDT/offline merge, backend persistence, measurement, pagination, renderer/export, and cross-page editing. Link upstream v1 history and downstream measurement/pagination.

- [ ] **Step 4: Run focused Core and Project Control GREEN**

Run once:

```powershell
npm test -- tests/text-block-v4-authoring-inline-docs.test.ts
npm run type-check
npm test -- tests/textBlockV4Contract.test.ts tests/textBlockV4InlineCommands.test.ts tests/textBlockV4RichInlineReplace.test.ts
git diff --check
```

Apply the failure policy only when needed. Commit exactly the leaf and focused test with `docs: consolidate Text Block v4 authoring`.

### Task 4: Synthesize V4 measurement and pagination

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/text-block/v4-measurement-and-pagination.md`
- Create: `tests/text-block-v4-measurement-pagination-docs.test.ts`
- Create (ignored): lane claim matrix and `task-4-report.md`

**Interfaces:**
- Consumes: orientation subgroup `text-block/v4-measurement-and-pagination`, its three source paths, two evidence checks, and conflicts `TBL-C2` and `TBL-C3`.
- Produces: one candidate measurement/pagination leaf and one focused guard; no shared truth.

- [ ] **Step 1: Audit every assigned source and current evidence**

Read the three frozen sources completely and verify frozen/current blob identity. Inspect completely:

```text
src/resolution/resolvedDocument.ts
src/pagination/textBlockV4Measurement.ts
src/pagination/textBlockV4Pagination.ts
tests/textBlockV4Measurement.test.ts
tests/textBlockV4Pagination.test.ts
tests/textBlockV4ReadinessCloseAudit.test.ts
```

Write the ignored three-row claim matrix.

- [ ] **Step 2: Write and verify the missing-leaf RED**

The focused test derives exact `3/3` sources, verifies blobs, scans leaf/test source, and mutation-tests that measurement source points never become caret offsets and that the close-audit threshold never becomes broad performance or product readiness.

- [ ] **Step 3: Write the minimal leaf**

Cover authored/resolved source points, complete gap-free accepted ranges, isolated deterministic page fragments, and the bounded 6,000-line/250-page close-audit result. Explicitly exclude choosing/executing a shaper, generated page-number expansion, mixed-node composition, renderer/export, backend jobs, cross-page DOM/caret behavior, and general performance readiness.

- [ ] **Step 4: Run focused Core and Project Control GREEN**

Run once:

```powershell
npm test -- tests/text-block-v4-measurement-pagination-docs.test.ts
npm run type-check
npm test -- tests/textBlockV4Measurement.test.ts tests/textBlockV4Pagination.test.ts tests/textBlockV4ReadinessCloseAudit.test.ts
git diff --check
```

Apply the failure policy only when needed. Commit exactly the leaf and focused test with `docs: consolidate Text Block v4 pagination`.

### Task 5: Integrate leaves and register bounded Text Block truth

**Files:**
- Modify: `docs/versions/V0_1_0a_1/core/text-block/OVERVIEW.md`
- Modify: `tests/text-block-documentation-wave-3.test.ts`
- Create: `data/nodes/text-block.json`
- Create: `data/documents/text-block-overview.json`
- Create: `data/documents/text-block-v1-grammar-migration.json`
- Create: `data/documents/text-block-v4-authoring-inline.json`
- Create: `data/documents/text-block-v4-measurement-pagination.json`
- Create: `data/evidence/text-block-v1-version-policy.json`
- Create: `data/evidence/text-block-v1-producer-alignment.json`
- Create: `data/evidence/text-block-v4-authoring-contract.json`
- Create: `data/evidence/text-block-v4-rich-inline-replacement.json`
- Create: `data/evidence/text-block-v4-measurement-pagination.json`
- Create: `data/evidence/text-block-v4-close-audit.json`
- Modify: `data/nodes/core.json`
- Modify: `data/repositories/core.json`
- Modify: `docs/domains/project-control.md`
- Modify: `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`
- Modify: `generated/project-index.json`
- Modify only when RED proves stale: prior Text Engine, Template Builder, Live Draft, generation, seed, or migration tests whose exact family ordering/current-summary expectation changes.
- Create (ignored): `task-5-report.md`

**Interfaces:**
- Consumes: the three reviewed lane commits and the Task 1 frame.
- Produces: four registered Documents, six reciprocal Evidence records, one `unknown` Text Block Node, reconciled family overview, additive shared truth, deterministic generated projection, and the integration commit.

- [ ] **Step 1: Validate and cherry-pick the three lane commits**

For each lane require clean status, direct frame parent, exact two-path commit, passing focused report, and unchanged Core. Cherry-pick in dependency order: v1, v4 authoring, v4 measurement.

- [ ] **Step 2: Reconcile the overview and write registration REDs**

The overview must summarize the dependency chain and link all three leaves without absorbing their detail. Extend the family test to require exact Node/Document/Evidence reciprocity, immutable refs, source closure, unknown truth, shared-summary wording, generated equality, and zero Text Block coverage/Work/cleanup Evidence.

Run:

```powershell
npm test -- tests/text-block-documentation-wave-3.test.ts
```

Expected: registration assertions fail because records are absent; all leaf/source assertions pass.

- [ ] **Step 3: Register exact canonical records**

Create Node `text-block`, parent `core`, order `50`, `truthState: "unknown"`, Document IDs in dependency order with overview last, six Evidence IDs in orientation-check order, and repositories `repo-core` plus `repo-project-control`.

Create Documents:

```text
doc-text-block-v1-grammar-migration
doc-text-block-v4-authoring-inline
doc-text-block-v4-measurement-pagination
doc-text-block-overview
```

Create Evidence:

```text
evidence-text-block-v1-version-policy
evidence-text-block-v1-producer-alignment
evidence-text-block-v4-authoring-contract
evidence-text-block-v4-rich-inline-replacement
evidence-text-block-v4-measurement-pagination
evidence-text-block-v4-close-audit
```

Each Evidence record pins Core `c503a45...`, one truthful primary executable anchor, a narrowly bounded summary, and `verifiedAt: "2026-08-21T00:00:00.000Z"`. Documents carry the complete immutable anchor sets needed for their claims. The overview references the three leaf objects at the captured candidate commit after lane integration.

- [ ] **Step 4: Update shared truth once and generate**

Add only bounded Text Block synthesis wording to Core Node/repository summary, Project Control current scope, and `DOCUMENT_MAP.md`. State that Text Block documentation is synthesized while family truth remains unknown and migration/publication/promotion remain incomplete. Do not weaken or replace prior-family wording.

Run `npm run generate` twice; require identical bytes and record the generated SHA-256.

- [ ] **Step 5: Run focused GREEN and classify dependency REDs**

Run:

```powershell
npm run check:data
npm test -- tests/text-block-v1-grammar-migration-docs.test.ts tests/text-block-v4-authoring-inline-docs.test.ts tests/text-block-v4-measurement-pagination-docs.test.ts tests/text-block-documentation-wave-3.test.ts
npm run type-check
```

Then run the prior-family dependency suites. Modify only assertions proven stale by the additive Text Block Node/summary/map/order. Any prior content, provenance, coverage, cleanup, or truth-state failure is blocking and is not rewritten away.

- [ ] **Step 6: Commit exact integration scope**

Verify zero coverage/Work/cleanup files, zero former-source literals, no mutable refs, exact ten-source closure, Core clean/exact, and `git diff --check`. Commit `docs: register Text Block documentation family`.

### Task 6: Final verification, dual review, and Wave A handoff

**Files:**
- Create (ignored): `task-6-report.md`
- Update (ignored): `progress.md`
- Create (ignored): full implementation review package and any scoped correction packages.

**Interfaces:**
- Consumes: the full Task 1–5 implementation range and all lane/integration reports.
- Produces: honest final gate evidence, two independent final verdicts, accepted focused fixes if required, and a handoff stating all 18 Wave A leaves are synthesized.

- [ ] **Step 1: Run the final gate sequence once**

Run once in order:

```powershell
npm run generate
npm run check:data
npm test -- tests/text-block-v1-grammar-migration-docs.test.ts tests/text-block-v4-authoring-inline-docs.test.ts tests/text-block-v4-measurement-pagination-docs.test.ts tests/text-block-documentation-wave-3.test.ts
npm run type-check
npm run build
npm run test:e2e
npm test
git diff --check <wave-base>..HEAD
```

For any named failure or timeout, apply the exact one-row/one-worker/30-second policy once and record both the original result and isolated result without upgrading the original suite to PASS. A second isolated failure or timeout is marked `FAIL`; work proceeds to review with the failure visible and no additional retry.

- [ ] **Step 2: Run the exact read-only Core evidence union once**

Run the union of the ten named Core evidence test files from Tasks 2–4 at exact clean Core `c503a45...`. Apply the same failure policy. Do not modify Core.

- [ ] **Step 3: Build and verify the review package**

Create a complete package from exact execution base `8497eaa...` to final HEAD containing full commit list, stat, and `-U10` diff. Record package path, SHA-256, body equality, exact path set, commit topology, generated hash, record counts, source closure, prior-family blob preservation, clean statuses, and every timing-sensitive or failed row.

- [ ] **Step 4: Dispatch two independent reviews in parallel**

Review A: contract/provenance/source closure, registration reciprocity, immutable refs, generated equality, preserved prior families, unknown truth, and zero coverage/cleanup/Work.

Review B: factual/honesty review of all three leaves, overview, six Evidence summaries, the four conflicts, historical-vs-current v1/v4 boundary, authoring/collaboration exclusions, measurement-source/caret separation, and bounded threshold language.

Both return Spec PASS/FAIL, Quality APPROVED/NOT APPROVED, exact Critical/Important/Minor counts, and READY yes/no. Timing-sensitive rows are evidence, not grounds to relabel a broad timeout as PASS.

- [ ] **Step 5: Apply only accepted blocking fixes**

For each accepted Critical/Important finding: reproduce with one focused RED, change the smallest owning path, rerun affected focused/data/type/generation gates, amend only the responsible unpushed commit when topology permits, regenerate the package, and obtain fresh scoped re-review. Record Minors without expanding scope unless they make current truth ambiguous.

- [ ] **Step 6: Record the final Wave A boundary**

Completion requires:

1. ten declared/unique/assigned Text Block sources with zero missing/extra/drift;
2. three leaves plus one overview and exact reciprocal records;
3. six truthful Evidence bindings;
4. Text Block and parent Core remain `unknown`;
5. zero coverage, Work, cleanup, deletion, or publication authority;
6. deterministic generated output and preserved prior-family blobs;
7. clean Project Control and Core worktrees;
8. zero Critical and zero Important findings, with every timeout/FAIL honestly recorded;
9. Wave A totals stated as 18 synthesized leaves: Text Engine 4, Template Builder 5, Live Draft 6, Text Block 3.

Do not merge to main, push, tag, delete former sources, or start migration-readiness/source-cleanup work in this task.
