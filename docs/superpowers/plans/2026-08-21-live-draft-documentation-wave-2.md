# Live Draft Documentation Wave 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Consolidate 64 frozen Live Draft sources into six canonical leaves and one family overview, register the complete family once, and retain unknown truth with no migration or cleanup authority.

**Architecture:** One coordinator creates the bounded overview frame, then three isolated Git worktrees audit and author two disjoint leaves each in parallel. The coordinator cherry-picks the three reviewed lane commits in fixed order, reconciles cross-leaf truth, registers the family once, and runs one bounded final verification and two parallel reviews.

**Tech Stack:** TypeScript 7, Node.js 26, Vitest 4, Ajv 8, Markdown, JSON, Git, PowerShell 7.

**Spec:** docs/superpowers/specs/2026-08-21-live-draft-documentation-wave-2-design.md

## Global Constraints

- Wave 2 design commit is exactly 7ca06c2bda6bfbc00a41f4db66f93fb6ea84ad8b, with completed Wave 1 head bed2b0475e887d97049c53903c26a185c6051d59 as its parent.
- Task 1 captures the clean plan-bearing HEAD once as $task1Base before any implementation edit. It must not recompute that base later.
- Frozen Core source commit is exactly 76a2f2311a898e781f53773390d47b05812911e4.
- Read-only current Core evidence head is exactly c503a45c03e0ce3b7a6efba2b029ca842017faa0.
- Orientation inventory digest is exactly 36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b.
- Live Draft owns exactly 64 declared source paths across six subgroups: 3, 16, 10, 10, 20, and 5.
- Core is read-only. Do not alter Core source, tests, packages, fixtures, documentation, branches, tags, index, or working tree.
- Project Control creates exactly one overview, six leaves, seven active Documents, twelve completed Evidence records, and one Live Draft Node.
- Live Draft and parent Core remain unknown.
- Do not create Live Draft migration coverage, cleanup Evidence, deletion Work, publication commits, or source deletion.
- Historical phase order and scoped PASS labels are not current authority. Current code, fixtures, and focused tests govern current claims.
- Former source paths must not appear in canonical leaves, leaf tests, records, Node summaries, document map, current-scope prose, or generated output.
- Mutable Core references such as main, master, develop, HEAD, tags, short hashes, and arbitrary branches are forbidden.
- Shared registration files have one writer. Parallel lane workers may edit only their two canonical leaves, one lane test, and their ignored lane report.
- Each parallel lane uses its own Git worktree and branch created from the exact Task 1 frame commit.
- Parallel lane commits are cherry-picked by the coordinator in Lane A, Lane B, Lane C order. Agents do not merge or rebase.
- Lane gates are focused only. No lane runs a broad Project Control or Core suite.
- The coordinator runs one final broad Project Control test attempt with a five-minute ceiling and no broad retry.
- A broad no-verdict is recorded as NOT PASSED / DEFERRED. A named assertion, schema, type, build, E2E, source-closure, or focused-test failure remains blocking.
- Independent final reviews require Critical 0 and Important 0. Minor findings are recorded unless they make current truth ambiguous.
- Canonical truth remains LF through the repository attributes contract.

---

## Planned file structure

### Canonical documents

- Create: docs/versions/V0_1_0a_1/core/live-draft/OVERVIEW.md
- Create: docs/versions/V0_1_0a_1/core/live-draft/product-readiness-and-renderer-boundaries.md
- Create: docs/versions/V0_1_0a_1/core/live-draft/geometry-and-scene-projection.md
- Create: docs/versions/V0_1_0a_1/core/live-draft/persistent-flow-and-range-foundations.md
- Create: docs/versions/V0_1_0a_1/core/live-draft/root-and-v3-transition-contracts.md
- Create: docs/versions/V0_1_0a_1/core/live-draft/source-authority-and-commit-transaction.md
- Create: docs/versions/V0_1_0a_1/core/live-draft/corrective-evidence.md

### Focused tests

- Create: tests/live-draft-documentation-wave-2.test.ts
- Create: tests/live-draft-product-geometry-docs.test.ts
- Create: tests/live-draft-persistent-root-docs.test.ts
- Create: tests/live-draft-source-authority-corrective-docs.test.ts
- Modify only after a named stale RED: tests/seed-project.test.ts
- Modify only after a named stale RED: tests/core-doc-migration.test.ts
- Modify only after a named stale RED: tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts
- Modify only after a named stale RED: tests/text-engine-runtime-identity-evidence-leaf.test.ts
- Modify only after a named stale RED: tests/text-engine-adapter-provider-leaf.test.ts
- Modify only after a named stale RED: tests/text-engine-rustybuzz-family-closeout.test.ts
- Modify only after a named stale RED: tests/template-builder-documentation-wave-1.test.ts

### Registration and current truth

- Create: data/nodes/live-draft.json
- Create: seven data/documents/live-draft-*.json records.
- Create: twelve data/evidence/live-draft-*.json records.
- Modify: data/nodes/core.json
- Modify: data/repositories/core.json
- Modify: docs/domains/project-control.md
- Modify: docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md
- Regenerate only: generated/project-index.json

### Ignored audit material

- Create: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/lane-a-product-geometry.md
- Create: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/lane-b-persistent-root.md
- Create: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/lane-c-authority-corrective.md
- Create: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/progress.md
- Create: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/task-1-report.md through task-6-report.md

---

### Task 1: Freeze the family, publish the overview frame, and create three lane worktrees

**Files:**
- Create: tests/live-draft-documentation-wave-2.test.ts
- Create: docs/versions/V0_1_0a_1/core/live-draft/OVERVIEW.md
- Create ignored: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/progress.md
- Create ignored: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/task-1-report.md

**Interfaces:**
- Consumes: the design, Wave A orientation, frozen Core source commit, current Core evidence head, and completed Wave 1 truth.
- Produces: fixed $task1Base, frame commit stored as $liveDraftFrameCommit, a family test with exact constants, a bounded overview frame, and three isolated lane branches based on that commit.

- [ ] **Step 1: Verify exact clean identities**

Run from the Wave 2 coordinator worktree:

    git status --short
    git branch --show-current
    $task1Base = git rev-parse HEAD
    git rev-parse "$task1Base^"
    npm run check:data

Run read-only against Core:

    $corePath = 'C:\Users\nekot\Documents\GitHub\flowdoc-vnext-core\.worktrees\core-route-documentation-cleanup'
    git -C $corePath status --short
    git -C $corePath rev-parse HEAD

Expected: Project Control is clean on live-draft-documentation-wave-2; $task1Base is lowercase 40-hex, contains exactly the plan file relative to its parent, and its parent is the design commit 7ca06c2bda6bfbc00a41f4db66f93fb6ea84ad8b. Retain this captured value without recomputing it. Core is clean at c503a45c03e0ce3b7a6efba2b029ca842017faa0; check:data exits zero.

- [ ] **Step 2: Write the family RED**

Create tests/live-draft-documentation-wave-2.test.ts. Use these exact constants:

    const overviewPath =
      "docs/versions/V0_1_0a_1/core/live-draft/OVERVIEW.md";
    const frozenCommit =
      "76a2f2311a898e781f53773390d47b05812911e4";
    const coreEvidenceCommit =
      "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
    const inventoryDigest =
      "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
    const subgroupCounts = [3, 16, 10, 10, 20, 5] as const;
    const leafNames = [
      "product-readiness-and-renderer-boundaries.md",
      "geometry-and-scene-projection.md",
      "persistent-flow-and-range-foundations.md",
      "root-and-v3-transition-contracts.md",
      "source-authority-and-commit-transaction.md",
      "corrective-evidence.md",
    ] as const;

The first test loads the orientation, finds familyId live-draft, asserts sourceCount 64, exact subgroup order/counts, 64 flattened paths, 64 unique paths, exact proposed leaf paths, exact frozen commit and inventory digest, and then reads the absent overview.

The test requires these overview headings:

    ## Authority and Status
    ## Family Architecture
    ## Canonical Documents
    ## Ownership Map
    ## Evidence Flow
    ## Current Verified State
    ## Known Limits and Unknowns
    ## Migration and Cleanup Boundary
    ## Evidence Anchors

It also requires links to all six leaf filenames, the full Core evidence commit, Live Draft and parent Core unknown wording, and explicit no-coverage/no-cleanup wording.

- [ ] **Step 3: Run RED**

    npm test -- tests/live-draft-documentation-wave-2.test.ts

Expected: Vitest starts and fails only because OVERVIEW.md is absent.

- [ ] **Step 4: Write the bounded overview frame**

Create docs/versions/V0_1_0a_1/core/live-draft/OVERVIEW.md with the exact headings above. Keep every leaf description to one ownership paragraph and one limit paragraph. Include the architecture chain from the design. Label every leaf Candidate until Tasks 2 through 4 complete. Do not add detailed current-state tables, Project Control immutable leaf anchors, registration claims, or completion language.

State explicitly:

- Live Draft and parent Core remain unknown.
- Core is evidence-only and read-only at the full c503a45 commit.
- The six leaves own separate boundaries.
- No migration coverage or source cleanup is authorized.
- Product activation, Editor/Backend binding, Worker adoption, renderer/export parity, and performance readiness remain outside current authority.

- [ ] **Step 5: Run GREEN and commit only the frame**

    npm test -- tests/live-draft-documentation-wave-2.test.ts
    npm run type-check
    git diff --check
    git add -- docs/versions/V0_1_0a_1/core/live-draft/OVERVIEW.md tests/live-draft-documentation-wave-2.test.ts
    git commit -m "docs: frame Live Draft documentation wave"
    $liveDraftFrameCommit = git rev-parse HEAD

Require $liveDraftFrameCommit to be lowercase 40-hex, HEAD to equal it, parent to equal the retained $task1Base, exact two committed paths, and tracked status clean.

- [ ] **Step 6: Create three isolated lane worktrees**

Run from C:\Users\nekot\Documents\GitHub\flowdoc-project-control after verifying .worktrees is ignored:

    git check-ignore -q .worktrees
    git worktree add --no-track -b live-draft-wave-2-lane-a .worktrees/live-draft-wave-2-lane-a $liveDraftFrameCommit
    git worktree add --no-track -b live-draft-wave-2-lane-b .worktrees/live-draft-wave-2-lane-b $liveDraftFrameCommit
    git worktree add --no-track -b live-draft-wave-2-lane-c .worktrees/live-draft-wave-2-lane-c $liveDraftFrameCommit

Run npm install once in each lane worktree in parallel. Verify every lane HEAD equals $liveDraftFrameCommit and every lane status is clean.

- [ ] **Step 7: Record the task evidence**

Write the frame hash, exact two-path scope, RED/GREEN result, check:data baseline, type-check, Core identity, and three lane paths to the ignored task report and progress ledger. Do not commit ignored evidence.

---

### Task 2: Lane A — Product readiness and geometry/scene projection

**Files:**
- Create: docs/versions/V0_1_0a_1/core/live-draft/product-readiness-and-renderer-boundaries.md
- Create: docs/versions/V0_1_0a_1/core/live-draft/geometry-and-scene-projection.md
- Create: tests/live-draft-product-geometry-docs.test.ts
- Create ignored: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/lane-a-product-geometry.md

**Interfaces:**
- Consumes: exact frame commit, orientation subgroups product-readiness-and-renderer-boundaries and geometry-and-scene-projection, 19 frozen sources, and named Core evidence anchors.
- Produces: one Lane A commit containing exactly two leaves and one focused test, plus a 19/19 ignored claim matrix.

- [ ] **Step 1: Verify Lane A isolation**

Run in .worktrees/live-draft-wave-2-lane-a:

    git status --short
    git branch --show-current
    git rev-parse HEAD

Expected: clean branch live-draft-wave-2-lane-a at the exact frame commit.

- [ ] **Step 2: Read and classify all 19 assigned sources**

Load the two exact subgroups from the orientation. For every source path:

1. read the complete frozen bytes from Core commit 76a2f2311;
2. read the complete current bytes from Core head c503a45;
3. compare Git blob IDs;
4. record one disposition in lane-a-product-geometry.md;
5. assign the source to exactly one of the two leaf paths;
6. record current claim, historical claim, explicit negative, conflict, evidence anchor, and final wording decision.

The matrix closure must state 19 declared, 19 assigned, 19 unique, zero missing, zero extra, and zero frozen-to-current blob drift. Stop on any mismatch.

- [ ] **Step 3: Write the missing-leaf RED**

Create tests/live-draft-product-geometry-docs.test.ts. Derive source paths and proposed leaf paths from orientation rather than embedding former source paths in test source.

Require these common headings in both leaves:

    ## Authority and Scope
    ## Responsibility Boundary
    ## Current Verified State
    ## State and Failure Model
    ## Known Limits and Unknowns
    ## Historical Design Notes
    ## Canonical Cross-references
    ## Evidence Anchors

Require product-specific sections for cross-repository ownership, renderer consumption, no-measurement/no-relayout, parity limits, and activation limits.

Require geometry-specific sections for layout units, spatial wrapping, authored-box geometry, inline-image geometry, source segments and forced breaks, display-list projection, and producer-owned facts.

Mutation rows must reject:

    browser Worker is active
    Editor or Backend owns the Core layout route
    renderer remeasures or relayouts fragments
    XR-4 or XR-5 proves Canvas/PDF glyph-pixel parity
    geometry evidence proves production binding
    historical Phase 3/4 PASS proves current product readiness

Add legitimate negative controls for each mutation.

- [ ] **Step 4: Run RED**

    npm test -- tests/live-draft-product-geometry-docs.test.ts

Expected: failures are only the two absent leaves.

- [ ] **Step 5: Write both bounded leaves**

Use only the 19-source matrix and these exact Core evidence anchors:

    src/renderer/textFlowDisplayListV1.ts
    tests/textFlowDisplayListV1.test.ts
    src/layout/textBlockPersistentFlowContractV1.ts
    tests/liveDraftMr1SpatialWrapping3a.test.ts
    tests/liveDraftMr1AuthoredBoxGeometry4a.test.ts
    tests/liveDraftMr1InlineImageGeometry4b.test.ts
    src/index.ts

Every Core anchor is a full flowdoc-vnext-core@c503a45... reference. Preserve dated handoff limits. State that display-list projection consumes producer-owned geometry without measurement or relayout. Keep selected parity rows bounded and exclude Canvas/PDF pixels, production binding, and broad product activation.

- [ ] **Step 6: Run Lane A GREEN**

Project Control:

    npm test -- tests/live-draft-product-geometry-docs.test.ts
    npm run type-check

Core read-only:

    npm test -- --maxWorkers=1 tests/textFlowDisplayListV1.test.ts tests/liveDraftMr1SpatialWrapping3a.test.ts tests/liveDraftMr1AuthoredBoxGeometry4a.test.ts tests/liveDraftMr1InlineImageGeometry4b.test.ts

Require Core status still clean at c503a45 after the command.

- [ ] **Step 7: Review and commit exact Lane A scope**

Require 19/19 matrix closure, exact two leaves and one test, immutable refs only, no former-source literals in tracked Lane A files, mutation controls green, and diff check clean.

    git add -- docs/versions/V0_1_0a_1/core/live-draft/product-readiness-and-renderer-boundaries.md docs/versions/V0_1_0a_1/core/live-draft/geometry-and-scene-projection.md tests/live-draft-product-geometry-docs.test.ts
    git commit -m "docs: consolidate Live Draft renderer geometry"

Return the full commit hash, parent, exact three paths, test counts, Core counts, and matrix closure to the coordinator. Do not merge, rebase, modify shared truth, or remove the lane worktree.

---

### Task 3: Lane B — Persistent flow/ranges and Root/V3 transition

**Files:**
- Create: docs/versions/V0_1_0a_1/core/live-draft/persistent-flow-and-range-foundations.md
- Create: docs/versions/V0_1_0a_1/core/live-draft/root-and-v3-transition-contracts.md
- Create: tests/live-draft-persistent-root-docs.test.ts
- Create ignored: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/lane-b-persistent-root.md

**Interfaces:**
- Consumes: exact frame commit, orientation subgroups persistent-flow-and-range-foundations and root-and-v3-transition-contracts, 20 frozen sources, and named Core evidence anchors.
- Produces: one Lane B commit containing exactly two leaves and one focused test, plus a 20/20 ignored claim matrix.

- [ ] **Step 1: Verify Lane B isolation**

Run in .worktrees/live-draft-wave-2-lane-b and require a clean branch at the exact frame commit.

- [ ] **Step 2: Read and classify all 20 assigned sources**

Use the same complete frozen/current read and blob comparison protocol as Task 2, but only for the two Lane B subgroups. The ignored matrix closure must state 20 declared, 20 assigned, 20 unique, zero missing, zero extra, and zero drift.

The matrix must distinguish:

- persistent structural reuse from speed claims;
- retained range planning from complete-oracle comparison;
- 5A acceptance from 5B Root V2 admission;
- scoped V3-only policy from later 5B-2 work;
- inactive capability rows from activated product capability.

- [ ] **Step 3: Write the missing-leaf RED**

Create tests/live-draft-persistent-root-docs.test.ts. Derive both source lists from orientation.

Use the eight common headings from Task 2. Require persistent-specific sections for flow-tree structure, contextual ranges, semantic checkpoints, affected-line planning, retained ranges, update reuse, and oracle-independent execution.

Require root-specific sections for 5A retained root, 5B Root V2 admission, scene and delivery, work policy, source envelope, V3 corrective scope, and stop boundaries.

Mutation rows must reject:

    complete oracle is an incremental execution input
    affected-line planning proves per-keystroke performance
    structural reuse proves latency
    5A acceptance activates all V3 policy
    V3 scoped PASS activates 5B-2 source authority
    inactive capability rows are current product capability

Add legitimate negative controls for every mutation.

- [ ] **Step 4: Run RED**

    npm test -- tests/live-draft-persistent-root-docs.test.ts

Expected: failures are only the two absent leaves.

- [ ] **Step 5: Write both bounded leaves**

Use only the Lane B matrix and these exact Core evidence anchors:

    src/layout/textBlockPersistentFlowTreeV1.ts
    src/layout/textBlockPersistentFlowUpdateV1.ts
    src/layout/textBlockPersistentLayoutLineTreeV1.ts
    tests/liveDraftMr1PersistentFlowFoundation.test.ts
    tests/textBlockPersistentFlowTreeV1.test.ts
    tests/textBlockPersistentFlowUpdateV1.test.ts
    src/layout/textBlockUnifiedLayoutRootV2.ts
    src/layout/textBlockPersistentSceneV2.ts
    src/layout/textBlockSceneDeliveryV2.ts
    src/layout/textBlockUnifiedLayoutWorkPolicyV1.ts
    tests/liveDraftMr1UnifiedLayoutRoot5a.test.ts
    tests/liveDraftMr1UnifiedIncrementalRoot5b.test.ts
    tests/textBlockUnifiedLayoutRootV2.test.ts
    tests/textBlockUnifiedLayoutWorkCalibrationV3.test.ts

Keep complete-oracle work QA-only. Preserve exact 5A/5B/V3 chronology without using chronology as current authority. Cross-link geometry upstream and authority/corrective leaves downstream without transferring ownership.

- [ ] **Step 6: Run Lane B GREEN**

Project Control:

    npm test -- tests/live-draft-persistent-root-docs.test.ts
    npm run type-check

Core read-only:

    npm test -- --maxWorkers=1 tests/liveDraftMr1PersistentFlowFoundation.test.ts tests/textBlockPersistentFlowTreeV1.test.ts tests/textBlockPersistentFlowUpdateV1.test.ts tests/liveDraftMr1UnifiedLayoutRoot5a.test.ts tests/liveDraftMr1UnifiedIncrementalRoot5b.test.ts tests/textBlockUnifiedLayoutRootV2.test.ts tests/textBlockUnifiedLayoutWorkCalibrationV3.test.ts

Require Core status clean at c503a45.

- [ ] **Step 7: Review and commit exact Lane B scope**

Require 20/20 closure, exact two leaves and one test, immutable refs, no former-source literals, all negative mutations with positive controls, and diff check clean.

    git add -- docs/versions/V0_1_0a_1/core/live-draft/persistent-flow-and-range-foundations.md docs/versions/V0_1_0a_1/core/live-draft/root-and-v3-transition-contracts.md tests/live-draft-persistent-root-docs.test.ts
    git commit -m "docs: consolidate Live Draft persistent root contracts"

Return full commit evidence to the coordinator. Do not touch shared truth or another lane.

---

### Task 4: Lane C — Source authority/transaction and corrective evidence

**Files:**
- Create: docs/versions/V0_1_0a_1/core/live-draft/source-authority-and-commit-transaction.md
- Create: docs/versions/V0_1_0a_1/core/live-draft/corrective-evidence.md
- Create: tests/live-draft-source-authority-corrective-docs.test.ts
- Create ignored: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/lane-c-authority-corrective.md

**Interfaces:**
- Consumes: exact frame commit, orientation subgroups source-authority-and-commit-transaction and corrective-evidence, 25 frozen sources, and named Core evidence anchors.
- Produces: one Lane C commit containing exactly two leaves and one focused test, plus a 25/25 ignored claim matrix.

- [ ] **Step 1: Verify Lane C isolation**

Run in .worktrees/live-draft-wave-2-lane-c and require a clean branch at the exact frame commit.

- [ ] **Step 2: Read and classify all 25 assigned sources**

Use the complete frozen/current read and blob protocol from Task 2. The ignored matrix closure must state 25 declared, 25 assigned, 25 unique, zero missing, zero extra, and zero drift.

The matrix must compare:

- the 2026-08-10 seam design with the 2026-08-11 approved amendment;
- Thai and English glossary/plan companions;
- producer invocation, evidence/work owner, source authority, and transaction internals;
- earlier blocked type-check evidence with later scoped verification ranges;
- report authority versus normative implementation authority.

- [ ] **Step 3: Write the missing-leaf RED**

Create tests/live-draft-source-authority-corrective-docs.test.ts. Derive the two source lists from orientation.

Use the eight common headings from Task 2. Require authority-specific sections for producer invocation, source topology, fallback target, evidence/work ownership, source authority internals, transaction seam, amendment precedence, and bilingual terminology.

Require corrective-specific sections for collision repair, delivery repair, source-envelope verification, final verification, final scoped verdict, and residual-risk boundaries.

Mutation rows must reject:

    the 2026-08-10 seam design overrides the approved amendment
    Thai and English companion terms have different authority
    transaction internals activate generic product integration
    a scoped review applies outside its commit or test range
    a later PASS erases an earlier local repair concern
    corrective evidence is a normative implementation contract

Add legitimate negative controls for every mutation.

- [ ] **Step 4: Run RED**

    npm test -- tests/live-draft-source-authority-corrective-docs.test.ts

Expected: failures are only the two absent leaves.

- [ ] **Step 5: Write both bounded leaves**

Use only the Lane C matrix and these exact Core evidence anchors:

    src/layout/textBlockUnifiedLayoutProducerInvocationAuthorityV2.ts
    src/layout/textBlockUnifiedLayoutEvidenceWorkOwnerRegistryV2.ts
    src/layout/textBlockUnifiedLayoutSourceAuthorityInternalsV1.ts
    src/layout/textBlockUnifiedLayoutSourceCommitTransactionInternalsV1.ts
    tests/textBlockUnifiedLayoutProducerInvocationAuthorityV2.test.ts
    tests/textBlockUnifiedLayoutEvidenceWorkOwnerRegistryV2.test.ts
    tests/textBlockUnifiedLayoutSourceCommitTransactionV1.test.ts
    tests/textBlockUnifiedLayoutAdversarialV2.test.ts
    tests/textBlockSceneDeliveryV2.test.ts

The authority leaf states exact amendment precedence only where current evidence supports it. The corrective leaf preserves both earlier concern and later scoped evidence with exact range limits. Neither leaf promotes product activation.

- [ ] **Step 6: Run Lane C GREEN**

Project Control:

    npm test -- tests/live-draft-source-authority-corrective-docs.test.ts
    npm run type-check

Core read-only:

    npm test -- --maxWorkers=1 tests/textBlockUnifiedLayoutProducerInvocationAuthorityV2.test.ts tests/textBlockUnifiedLayoutEvidenceWorkOwnerRegistryV2.test.ts tests/textBlockUnifiedLayoutSourceCommitTransactionV1.test.ts tests/textBlockUnifiedLayoutAdversarialV2.test.ts tests/textBlockSceneDeliveryV2.test.ts

Require Core status clean at c503a45.

- [ ] **Step 7: Review and commit exact Lane C scope**

Require 25/25 closure, exact two leaves and one test, immutable refs, no former-source literals, exact bilingual and scoped-review controls, and diff check clean.

    git add -- docs/versions/V0_1_0a_1/core/live-draft/source-authority-and-commit-transaction.md docs/versions/V0_1_0a_1/core/live-draft/corrective-evidence.md tests/live-draft-source-authority-corrective-docs.test.ts
    git commit -m "docs: consolidate Live Draft authority evidence"

Return full commit evidence to the coordinator. Do not touch shared truth or another lane.

---

### Task 5: Integrate the three lanes and register Live Draft truth once

**Files:**
- Modify: docs/versions/V0_1_0a_1/core/live-draft/OVERVIEW.md
- Modify: tests/live-draft-documentation-wave-2.test.ts
- Create: data/nodes/live-draft.json
- Create: seven data/documents/live-draft-*.json records
- Create: twelve data/evidence/live-draft-*.json records
- Modify: data/nodes/core.json
- Modify: data/repositories/core.json
- Modify: docs/domains/project-control.md
- Modify: docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md
- Regenerate: generated/project-index.json
- Modify only after an exact stale RED: the seven dependency tests listed in Planned file structure
- Create ignored: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/task-5-report.md

**Interfaces:**
- Consumes: exact Task 1 frame commit and three clean one-commit lane branches.
- Produces: a deterministic seven-Document, twelve-Evidence, one-Node unknown family registration and a clean integration commit.

- [ ] **Step 1: Validate lane commits before integration**

For each lane require:

- direct parent equals the exact frame commit;
- exactly one non-merge commit;
- exact three-path set assigned to that lane;
- git show --check passes;
- branch worktree is clean;
- no shared registration, map, summary, generated, or Core path changed.

Record the three full lane hashes. Stop on any mismatch.

- [ ] **Step 2: Cherry-pick lanes in deterministic order**

Run only in the coordinator worktree:

    git cherry-pick $laneACommit
    git cherry-pick $laneBCommit
    git cherry-pick $laneCCommit
    $liveDraftLeafCandidateCommit = git rev-parse HEAD

Require exactly six new leaves and three lane tests between the frame commit and $liveDraftLeafCandidateCommit, with no other path. Run all three lane tests and type-check. Do not resolve any conflict by choosing one side; a cherry-pick conflict is a plan violation and stops the task.

- [ ] **Step 3: Reconcile all six leaves and finalize the overview**

Expand the family test so it reads all leaves and proves:

- exact six-leaf orientation order and dependency direction;
- 64/64 one-to-one source ownership;
- common headings and required leaf-specific sections;
- all six conflict policies;
- immutable Core references only;
- no former-source path in overview, leaves, or test source;
- no authority transfer across leaves.

Replace Candidate labels in OVERVIEW.md with reviewed bounded descriptions. Add compact canonical links, the dependency chain, evidence flow, current verified state, limits, migration boundary, and immutable Project Control anchors to each leaf using $liveDraftLeafCandidateCommit plus each leaf Git blob. Do not duplicate detailed leaf tables.

- [ ] **Step 4: Write the registration RED**

Add these exact Document IDs:

    doc-live-draft-product-readiness-renderer-boundaries
    doc-live-draft-geometry-scene-projection
    doc-live-draft-persistent-flow-range-foundations
    doc-live-draft-root-v3-transition-contracts
    doc-live-draft-source-authority-commit-transaction
    doc-live-draft-corrective-evidence
    doc-live-draft-overview

Add these exact Evidence IDs and primary Core anchors:

| Evidence ID | pathOrContractId |
| --- | --- |
| evidence-live-draft-renderer-no-relayout | src/renderer/textFlowDisplayListV1.ts |
| evidence-live-draft-public-exports-nonactivation | src/index.ts |
| evidence-live-draft-geometry-producer-projection | src/layout/textBlockPersistentFlowContractV1.ts |
| evidence-live-draft-phase-3-4-gates | tests/liveDraftMr1InlineImageGeometry4b.test.ts |
| evidence-live-draft-persistent-structural-reuse | src/layout/textBlockPersistentFlowTreeV1.ts |
| evidence-live-draft-oracle-execution-separation | src/layout/textBlockPersistentLayoutLineTreeV1.ts |
| evidence-live-draft-root-scene-work-policy | src/layout/textBlockUnifiedLayoutRootV2.ts |
| evidence-live-draft-root-calibration-boundary | tests/textBlockUnifiedLayoutWorkCalibrationV3.test.ts |
| evidence-live-draft-source-authority-transaction-internals | src/layout/textBlockUnifiedLayoutSourceCommitTransactionInternalsV1.ts |
| evidence-live-draft-source-authority-amendment-tests | tests/textBlockUnifiedLayoutSourceCommitTransactionV1.test.ts |
| evidence-live-draft-corrective-adversarial-scene | tests/textBlockUnifiedLayoutAdversarialV2.test.ts |
| evidence-live-draft-corrective-scoped-review-ranges | tests/textBlockSceneDeliveryV2.test.ts |

Every Evidence record uses:

    kind: evidence
    nodeIds: [live-draft]
    repositoryId: repo-core
    commit: c503a45c03e0ce3b7a6efba2b029ca842017faa0
    verifiedAt: 2026-08-21T00:00:00.000Z

Verification summaries must state the exact positive fact and explicit non-authority established by the lane matrix. No Evidence summary may claim product activation, performance, cross-runtime pixel parity, Editor/Backend binding, Worker adoption, or family promotion.

Run:

    npm test -- tests/live-draft-documentation-wave-2.test.ts

Expected: all leaf/source assertions pass; registration assertions fail only because Node, Documents, Evidence, shared truth, and generated projection are absent.

- [ ] **Step 5: Create exact canonical records**

Create data/nodes/live-draft.json:

    {
      "kind": "node",
      "id": "live-draft",
      "title": "Live Draft",
      "parentId": "core",
      "summary": "Live Draft documentation synthesis is complete across six bounded leaves and one family overview; family truth remains unknown pending migration coverage, reference repair, publication review, and separately authorized cleanup, while product activation, Editor and Backend integration, browser Worker adoption, renderer and export parity, and performance readiness remain unknown.",
      "truthState": "unknown",
      "order": 40,
      "documentIds": [],
      "evidenceIds": [],
      "repositoryIds": ["repo-core", "repo-project-control"]
    }

Fill documentIds and evidenceIds in the exact order declared in Step 4.

Every leaf Document has role contract, lifecycle active, nodeIds [live-draft], exact canonical path, bounded authority, and immutable Core repository refs from its Evidence set. The overview Document has role current-state and repository refs to all six canonical leaf paths at $liveDraftLeafCandidateCommit.

- [ ] **Step 6: Update shared truth once**

Update data/nodes/core.json by appending only bounded Live Draft synthesis wording to the existing summary. Preserve truthState unknown, documentIds, evidenceIds, and repositoryIds.

Update data/repositories/core.json with the same bounded additive status.

Update docs/domains/project-control.md so Live Draft is no longer described as unregistered or future documentation, but remains unknown and has no coverage or cleanup authority.

Add a Live Draft Family Documentation section to DOCUMENT_MAP.md with overview first and six leaves in orientation order. Preserve Core Route, Text Engine, and Template Builder wording exactly except for the minimum additive broader-summary sentence.

- [ ] **Step 7: Generate and reach focused GREEN**

    npm run generate
    npm run check:data
    npm test -- tests/live-draft-documentation-wave-2.test.ts tests/live-draft-product-geometry-docs.test.ts tests/live-draft-persistent-root-docs.test.ts tests/live-draft-source-authority-corrective-docs.test.ts
    npm run type-check

The family test also proves:

- Core childIds are exactly core-route, text-engine, template-builder, live-draft;
- seven active Documents and twelve Evidence records are reciprocal;
- generated records equal canonical records and Markdown content;
- no migrations/V0_1_0a_1/core/families/live-draft/coverage.json exists;
- no Live Draft Work or coverage/cleanup Evidence exists;
- Core Route, Text Engine, and Template Builder protected blobs are unchanged from 7ca06c2.

- [ ] **Step 8: Capture only proven stale dependency assumptions**

Run exactly:

    npm test -- tests/seed-project.test.ts tests/core-doc-migration.test.ts tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts tests/text-engine-runtime-identity-evidence-leaf.test.ts tests/text-engine-adapter-provider-leaf.test.ts tests/text-engine-rustybuzz-family-closeout.test.ts tests/template-builder-documentation-wave-1.test.ts

Accept RED only for exact Core child order/count, exact Core/repository summary, exact document-map scope, or Live Draft unregistered/future wording. Any prior-family content, blob, provenance, unknown-state, cleanup, or coverage failure stops the task.

Modify only the stale assertions, preserving every earlier family-specific contract. Rerun the seven dependency tests plus all four Wave 2 tests until green.

- [ ] **Step 9: Verify deterministic generation and commit**

Run generation twice. Hash generated/project-index.json after the first run and require identical hash plus zero tracked drift after the second.

    npm run check:data
    npm run type-check
    npm run build
    npm run test:e2e
    git diff --check

Stage only the registration/current-truth paths, overview finalization, proven stale tests, and generated index. Commit:

    git commit -m "docs: register Live Draft documentation family"

Require clean tracked status, exact parent equal $liveDraftLeafCandidateCommit, no Core change, no coverage/cleanup path, and exact intended scope. Record the integration hash and all gate counts in the ignored Task 5 report.

---

### Task 6: Run bounded final verification and dual review

**Files:**
- Create ignored: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/task-6-report.md
- Modify ignored: .superpowers/sdd/2026-08-21-live-draft-documentation-wave-2/progress.md

**Interfaces:**
- Consumes: implementation range from retained $task1Base through the registration commit, with 7ca06c2..$task1Base retained separately as governing-plan context.
- Produces: READY evidence or an exact blocker, two independent verdicts, and the next family handoff.

- [ ] **Step 1: Assert final source and truth closure**

Require:

    64 declared / 64 unique / 64 assigned / 0 missing / 0 extra / 0 drift
    6 canonical leaves + 1 overview
    7 active Documents
    12 completed Evidence records
    1 Live Draft Node, unknown
    parent Core unknown
    0 Live Draft coverage files
    0 cleanup or deletion authority
    Core clean at c503a45c03e0ce3b7a6efba2b029ca842017faa0

Require protected Core Route, Text Engine, and Template Builder blobs to equal the design base. Require every Wave 2 Core reference to use the full c503a45 hash and every Project Control leaf anchor to use the captured leaf-candidate hash.

- [ ] **Step 2: Run the final focused sequence once**

    npm run generate
    npm run check:data
    npm test -- tests/live-draft-documentation-wave-2.test.ts tests/live-draft-product-geometry-docs.test.ts tests/live-draft-persistent-root-docs.test.ts tests/live-draft-source-authority-corrective-docs.test.ts tests/seed-project.test.ts tests/core-doc-migration.test.ts tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts tests/text-engine-runtime-identity-evidence-leaf.test.ts tests/text-engine-adapter-provider-leaf.test.ts tests/text-engine-rustybuzz-family-closeout.test.ts tests/template-builder-documentation-wave-1.test.ts
    npm run type-check
    npm run build
    npm run test:e2e
    git diff --check $task1Base..HEAD

Every command must finish with an actual verdict. A named failure is blocking.

- [ ] **Step 3: Run one bounded broad Project Control test attempt**

Run npm test once with a five-minute outer ceiling. Do not rerun the broad suite.

If it exits zero, record actual file/test counts as PASS.

If it produces a named 5-second timing row, run only that exact row once with one worker and a 15-second test allowance. Record the broad result as NOT PASSED / DEFERRED unless the original broad command itself passed.

If it produces no verdict by five minutes, validate process command lines, stop only the exact Wave 2 npm/Vitest process tree, record elapsed time and NO VERDICT as NOT PASSED / DEFERRED, and continue because the user explicitly authorized this variance.

Any named assertion failure remains blocking and is not converted to deferred.

- [ ] **Step 4: Run the exact Core read-only union once**

Run one union of the unique evidence tests used by Tasks 2 through 4 with maxWorkers=1. Do not run the full Core suite. Record file and test counts. Require Core status clean and HEAD unchanged afterward.

- [ ] **Step 5: Create the exact review package**

Create a complete binary-safe implementation package for $task1Base..HEAD and a separate governing-plan context package for 7ca06c2bda6bfbc00a41f4db66f93fb6ea84ad8b..$task1Base under the ignored SDD directory. Never collapse the two ranges. Verify:

- full base and head hashes in the header;
- package SHA-256;
- package body equals git diff --binary --full-index for the exact range;
- exact committed path set;
- no package, runtime, Core, coverage, cleanup, lockfile, or source path.

- [ ] **Step 6: Dispatch two independent reviews in parallel**

Contract/provenance review checks:

- exact 64-source partition and six leaf ownership contracts;
- immutable Core and Project Control anchors;
- Document/Evidence/Node reciprocity and deterministic projection;
- prior-family preservation and exact scope;
- no former-source literal leakage;
- absent coverage, cleanup, deletion, and promotion.

Factual/honesty review checks:

- all six orientation conflicts;
- current evidence versus historical chronology;
- renderer no-relayout and parity limits;
- no performance inference from range/oracle evidence;
- 5A/5B/V3/5B-2 separation;
- 2026-08-11 amendment and bilingual parity;
- scoped corrective verdict boundaries;
- explicit remaining product, Worker, Editor, Backend, renderer/export, and performance unknowns.

Both reviewers return Spec PASS/FAIL, Quality APPROVED/NOT APPROVED, exact Critical/Important/Minor counts, line-specific findings, and READY yes/no.

- [ ] **Step 7: Apply only accepted blocking review fixes**

For each accepted Critical or Important finding:

1. reproduce it with one focused RED;
2. modify only the owning leaf/test/record or the minimum shared truth path;
3. rerun affected lane tests, family test, check:data, and type-check;
4. amend only the responsible unpushed commit when topology and scope remain exact;
5. recapture changed hashes and regenerate the review package;
6. request fresh scoped review.

Record Minors without changing canonical truth unless the wording is ambiguous. Stop after three correction rounds and ask for context rather than expanding scope.

- [ ] **Step 8: Record completion and handoff**

Write exact commits, lane hashes, source closure, path counts, record counts, generated hash, focused/build/E2E/Core results, broad PASS or authorized deferred status, review verdicts, residual Minors, and excluded cleanup work to the ignored report and progress ledger.

Final status is complete only when both reviews have Critical 0 and Important 0, all blocking gates pass, both worktrees are clean, and no unauthorized publication action occurred.

Do not merge to main, push, tag, delete former sources, create coverage, or begin the next family within this task.
