# Core V1 retirement — owner return

## Authority Boundary

Owner repo-project-control. Work flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap; Phase phase-core-v1-runtime-retirement; Checklist checklist-core-v1-runtime-retirement; Evidence evidence-core-v1-runtime-retirement-2026-09-05. Preserved automatically returned owner evidence at exact commit. Main integration, canonical setup and product-wide readiness are separate decisions in core-v1-closeout-plan-2026-09-05.md. No map promotion.

WORK RETURN EVENT: handoff-core-v1-runtime-retirement-2026-09-05-01

Terminal evidence-candidate handoff. roomRunId room-core-v1-runtime-retirement-01; lane-core-v1-runtime-retirement; Work Type product-implementation; owner repo-core; Room Mode WORK; active role Product Implementation Agent with boundary/evidence review.
Real task 01a07158-bf75-7772-a83e-152bffbb333c, host local. Worktree C:/Users/nekot/.codex/worktrees/a64f/flowdoc-vnext-core. Branch codex/core-v1-runtime-retirement.
Work flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap; Phase phase-core-v1-runtime-retirement; Checklist checklist-core-v1-runtime-retirement; Evidence target evidence-core-v1-runtime-retirement-2026-09-05.
Context Acknowledgement complete: accepted capsule, exact nine-source scope, owner/PC guidance, documentation authority, terminology SPLIT (layout runtime versions versus retained shared V1 names), exclusions, evidence target, liveness and active return acknowledged. Initial staged PC sources were read; subsequent canonical PC b1067181e227c751351fd3581b9049f2ddf5511c source update acknowledged. Required return actively pushed using send_message_to_thread, not final-only or manual pull.

PASS: approved bounded retirement implemented and committed after fresh full Core gate.
Commit f4f4425dcd7b370d165d2a0d7383aa14cf88b586; parent/base e3b9888b25fe963ef4316fe8066d086bae55db47. 55 changed paths, 1290 insertions, 7091 deletions. Post-commit worktree clean.
FAIL/BLOCKER: none remaining inside this lane. Main integration is not executed or claimed. Known canonical 59 package absences remain a separate unresolved integration boundary; this dedicated worktree neither restores nor adjudicates them.
RISK: deliberate old public RootV1/SceneV1 API removal under D1; arbitrary external/dynamic consumers remain unproven. Old wrapper-specific API/provenance/message-format promises retire explicitly, not silently represented as V2 compatibility.
UNKNOWN: main gate after separate canonical reconciliation; Editor ordinary dependency/Creator check; deletion cause/pre-deletion unique bytes; cross-repository readiness. No current product/map truth promoted.
CCR: none new. D1/D2 approval governs scope. Repairs remained exact related test/export-inventory corrections.

Exact source changes:
- Delete src/layout/textBlockUnifiedLayoutRootV1.ts, textBlockUnifiedLayoutRootContractV1.ts, textBlockUnifiedLayoutRootAuthorityInternalsV1.ts, textBlockUnifiedLayoutSceneV1.ts, textBlockUnifiedLayoutSceneContractV1.ts, textBlockAuthoredBoxGeometryV1.ts, textBlockSpatialWrappingLayoutV1.ts, textBlockSpatialIndexV1.ts, textBlockFlowRegionProviderV1.ts.
- Remove corresponding Root/Scene public exports from src/index.ts.
- Add internal textBlockFlowRegionContractInternalV1.ts with identical FlowInterval/IssueCode/Work definitions. Only retained runtime-file edits are FOUR type-import path replacements: SpatialIndexContractV2, SpatialWrappingKernelV1, SpatialWrappingLayoutContractV1/V2. No retained V2/shared algorithm body changed.

Preservation proof:
- git diff base..commit -- packages fixtures tests/fixtures is empty.
- Historical tests/fixtures/text-block-v1-layout-compatibility.v1.json unchanged, SHA256 a886e21c5eb30ed19171b8c88bf60cf8aff550939e371b9176e2f2a1dc9a1f96.
- Three retained Live Draft WASM digests verified; artifacts not rebuilt/regenerated.
- Root source-only repeated helper body unchanged; direct V2 geometry children replace RootV1 setup without casting fake RootV2 authority.
- Native and WASM producer outputs still compared independently through complete RootV2 objects and Root/Scene fingerprints.
- No Editor/Backend/PC files, canonical checkout, links, snapshots, package configuration/artifacts, shared kernels, native source, or historical fixtures mutated by this lane.

Evidence replacement matrix:
Full per-obligation matrix is committed at f4f4425dcd7b370d165d2a0d7383aa14cf88b586:docs/CORE_LAYOUT_RUNTIME_RETIREMENT.md (Root/Scene and four-wrapper matrices); local path C:/Users/nekot/.codex/worktrees/a64f/flowdoc-vnext-core/docs/CORE_LAYOUT_RUNTIME_RETIREMENT.md.
1. RootV1 mixed identity + all former 20 content/alignment/exclusion/barrier/requery cases -> textBlockUnifiedLayoutRetirementV2.test.ts, exact V2 identities/closed capabilities.
2. RootV1 hostile envelopes, clones/foreign children and attempted mutation -> RootV2 closed-null hostile rows + retirement corpus authority rejection; old private V1 registrar/stage-specific error promises explicitly retire.
3. RootV1 scale/deterministic fingerprint/query pruning -> RootScaleV2 with independent equivalent sources, exact constant inspection work and real spatial query; these determinism tests do not substitute for old parity.
4. RootV2 old-runtime parity -> frozen BASELINE RootV1 facts: 2 lines, 2 text fragments, 1 image fragment, width100000000,height32000000 layout units. Literal expected values captured before deletion; no V2-self oracle.
5. SceneV1 clone-safe projection/order/provenance -> retained PersistentSceneV2/SceneDeliveryV2 assertions and full former content corpus; V1-specific wire/WeakSet API retired.
6. Existing line-tree/Scene/delivery setup -> new direct V2 geometry helper, existing assertions retained; source-only factory split without body changes.
7. Wrapper geometry -> current V2 tests against immutable old no/middle-exclusion facts, frozen old wrapping baseline, exact authored insets/width/multi-interval/barrier/shrink assertions; deterministic V2 fingerprints and explicit production->tree->index rejection order.
8. Shared overflow/monotonic-height/whole-group placement -> direct retained-kernel tests, including exact three groups across two middle-exclusion intervals; no runtime algorithm edits.
9. Old index invalid-entry table, 1024-node half-open pruning and ordinal code-unit order -> SpatialIndexRetainedV2; flow-region seven interval/event rows and failures -> FlowRegionRetainedV2 plus current V2 suites. Existing V2 move/resize tests retained.
10. Old wrapper-only strict request shapes/provenance codes and lexical/AST guards for nonexistent wrapper files explicitly retire; raw V1 fingerprint/rejection evidence remains byte-pinned. Four exact source-absence guards replace internal-retention checks.
11. Public surface gate now requires old exports/files absent and validates public V2; historical Phase5B fixture claims remain unchanged and explicitly historical. Export inventory counts updated to actual source after removal.
Markdown classified code-adjacent Core-local, with Authority Boundaries; no map changes.

Fresh verification:
- npm ci: PASS, 48 packages installed normally in dedicated worktree; no link/snapshot override.
- Baseline npm run check: PASS type-check + 432 files/2791 tests, Vitest274.30s.
- Root migration focused gate: PASS7 files/67 tests (RootV2,RootScaleV2,PersistentLayoutLineTreeV1,PersistentSceneV2,SceneDeliveryV2,public5A boundary,native/WASM).
- Corpus/hostile/public focused gate: PASS3 files/38 tests.
- Wrapper focused gate: PASS10 files/87 tests; supplementary boundary gate PASS4 files/19 tests.
- packages/text-engine-rust-wasm npm run type-check: PASS.
- packages/text-engine-rust-wasm npm run wasm:verify:live-draft-artifacts: PASS3 digests.
- First changed full gate: type-check PASS; tests428 files passed/2 failed,2737 passed/2 failed. Failures: stale CORE_PUBLIC_EXPORT_BOUNDARY_REVIEW.md counts; new direct-kernel test used wrapper-only intervalPlacements field. Both corrected in lane (metadata counts; assert actual placedAtoms mapped to same independent expected geometry).
- Repair npm test -- tests/textBlockRetainedGeometryKernelsV1.test.ts tests/corePublicExportBoundaryReview.test.ts: PASS2 files/7 tests.
- FINAL npm run check on final staged file state: PASS type-check +430 files/2739 tests, start18:58:49 Asia/Bangkok, Vitest226.52s; exit0. No broad skips.
- git diff --cached --check PASS before commit; post-commit git status --short empty.
- Two bounded read-only subagent reviews (execution/review skill requirement) found no critical/important issues; actual tests/commit remain owner evidence.

First failures and final logs remain retrievable in C:/Users/nekot/AppData/Local/Temp/core-v1-retirement-final.log and core-v1-retirement-final-verified.log; task tool outputs also preserve results.

PR Summary Draft:
Retire the obsolete Core layout RootV1/SceneV1 APIs and four legacy wrappers after migrating their current consumers to V2. Preserve unchanged shared contracts/kernels, independent historical geometry and rejection evidence, native/WASM parity, and the complete original compatibility fixture. Exact retained API/source absence and replacement regressions cover the approved boundary. Final full Core gate passes430 files/2739 tests plus package type-check and three artifact digests. Canonical package absences and main/Editor integration remain separate.

Next PLAN action: stage this active terminal return in handoffInbox/completionQueue, run acceptanceGate against exact commit/matrix, and perform authorized integration/main verification only after separate canonical boundary is resolved. Send any product repair back to this same WORK locator. Keep branch/worktree retrievable; no main merge, push, PR creation or cleanup performed.

Automatic return: active push to PLAN task01a0707e-00e9-74e1-be1b-a272a1b89d2a host local via send_message_to_thread before local final; no user copy/paste/manual recovery.

Exact file inventory (Git name-status, renames retained):
M	README.md
A	docs/CORE_LAYOUT_RUNTIME_RETIREMENT.md
M	docs/CORE_PUBLIC_EXPORT_BOUNDARY_REVIEW.md
M	docs/LIVE_DRAFT_MR1_AUTHORED_BOX_GEOMETRY_4A.md
M	docs/LIVE_DRAFT_MR1_SPATIAL_WRAPPING_3A.md
M	src/index.ts
D	src/layout/textBlockAuthoredBoxGeometryV1.ts
A	src/layout/textBlockFlowRegionContractInternalV1.ts
D	src/layout/textBlockFlowRegionProviderV1.ts
M	src/layout/textBlockSpatialIndexContractV2.ts
D	src/layout/textBlockSpatialIndexV1.ts
M	src/layout/textBlockSpatialWrappingKernelV1.ts
M	src/layout/textBlockSpatialWrappingLayoutContractV1.ts
M	src/layout/textBlockSpatialWrappingLayoutContractV2.ts
D	src/layout/textBlockSpatialWrappingLayoutV1.ts
D	src/layout/textBlockUnifiedLayoutRootAuthorityInternalsV1.ts
D	src/layout/textBlockUnifiedLayoutRootContractV1.ts
D	src/layout/textBlockUnifiedLayoutRootV1.ts
D	src/layout/textBlockUnifiedLayoutSceneContractV1.ts
D	src/layout/textBlockUnifiedLayoutSceneV1.ts
R072	tests/helpers/textBlockAuthoredBoxGeometryV1.ts	tests/helpers/textBlockAuthoredBoxGeometryV2.ts
M	tests/helpers/textBlockUnifiedIncremental5b.ts
A	tests/helpers/textBlockUnifiedLayoutGeometryV2.ts
R090	tests/helpers/textBlockUnifiedLayoutRootV1.ts	tests/helpers/textBlockUnifiedLayoutSource.ts
M	tests/layoutPublicSurfaceCleanupGuard.test.ts
M	tests/liveDraftMr1UnifiedIncrementalRoot5b.test.ts
M	tests/liveDraftMr1UnifiedLayoutRoot5a.test.ts
D	tests/textBlockAuthoredBoxGeometryV1.test.ts
A	tests/textBlockAuthoredBoxRetainedGeometryV2.test.ts
D	tests/textBlockFlowRegionProviderV1.test.ts
A	tests/textBlockFlowRegionRetainedV2.test.ts
M	tests/textBlockIncrementalFlowTreeV1.test.ts
M	tests/textBlockPersistentLayoutLineTreeV1.test.ts
M	tests/textBlockPersistentSceneV2.test.ts
A	tests/textBlockRetainedGeometryKernelsV1.test.ts
M	tests/textBlockSceneDeliveryV2.test.ts
A	tests/textBlockSpatialIndexRetainedV2.test.ts
D	tests/textBlockSpatialIndexV1.test.ts
D	tests/textBlockSpatialWrappingLayoutV1.test.ts
M	tests/textBlockSpatialWrappingLayoutV2.test.ts
M	tests/textBlockUnifiedLayoutAdversarialV2.test.ts
A	tests/textBlockUnifiedLayoutRetirementV2.test.ts
D	tests/textBlockUnifiedLayoutRootAdversarialV1.test.ts
R060	tests/textBlockUnifiedLayoutRootScaleV1.test.ts	tests/textBlockUnifiedLayoutRootScaleV2.test.ts
D	tests/textBlockUnifiedLayoutRootV1.test.ts
M	tests/textBlockUnifiedLayoutRootV2.test.ts
D	tests/textBlockUnifiedLayoutSceneV1.test.ts
M	tests/textBlockUnifiedLayoutSourceSidecarsV1.test.ts
M	tests/textBlockUnifiedLayoutSourceStateV1.test.ts
M	tests/textBlockUnifiedLayoutTextStyleFlowV1.test.ts
M	tests/textBlockUnifiedLayoutTextStyleSourceV1.test.ts
M	tests/textBlockUnifiedLayoutTransitionPreflightV2.test.ts
M	tests/textBlockUnifiedLayoutWorkCalibrationV3.test.ts
M	tests/textBlockV1LayoutCompatibility.test.ts
M	tests/textEngineFlowEvidenceNodeWasmV2.test.ts

