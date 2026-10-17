# Core readiness — returned read-only evidence

## Authority Boundary

Owner: repo-project-control. Work: flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap. Phase phase-creator-core-readiness-review; Checklist checklist-creator-core-readiness-review; Evidence evidence-creator-core-readiness-review-2026-09-05. This is the preserved automatic WORK return; PLAN accepts only read-only reconciliation facts. It is not repair authorization, runtime verification, product readiness or map truth.

WORK RETURN EVENT: handoff-core-readiness-2026-09-05-01

Terminal Handoff — bounded read-only evidence candidate
roomRunId: room-core-readiness-01
dispatchSetId: dispatch-creator-core-readiness-2026-09-05
laneId: lane-core-readiness-review
Work Type: lane-reconciliation; owner repo-core; role Lane Reconciliation Reviewer
Real task locator: 01a07122-1de9-7272-bd87-03d6f2d75793 on local (PLAN supplied/confirmed). WORK worktree locator C:/Users/nekot/.codex/worktrees/3084/flowdoc-vnext-core, detached HEAD e3b9888b25fe963ef4316fe8066d086bae55db47, tracked-clean. This is NOT the affected canonical checkout.
Work path: flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap
Phase: phase-creator-core-readiness-review
Checklist: checklist-creator-core-readiness-review (no individual item IDs supplied)
Evidence target: evidence-creator-core-readiness-review-2026-09-05

Context Acknowledgement: completed. Read canonical Project Control AGENTS; full dispatch capsule; delivery, orchestration, routing, lean rules; Core AGENTS; Core CROSS_REPO_OPERATING_MAP; corrected flowdoc-creator-draft-first-delivery-2026-09-05.md. Initial abbreviated creator-draft-first-delivery filename failed at both locations; resolved by tracked-file lookup and PLAN clarification to docs/domains/flowdoc-creator-draft-first-delivery-2026-09-05.md, then read fully. No other required source unresolved. No global AGENTS.override.md found by existence check. FlowDoc and systematic-debugging skills used; fresh verification-before-completion guidance applied. Scope and active Return Channel acknowledged to PLAN before investigation. All prohibitions preserved.

Terminal status: PASS for completed read-only reconciliation; RISK remains for canonical package completeness and recovery intent; UNKNOWN deletion cause/actor and prior uncommitted content. No product-readiness PASS. FAIL/BLOCKER: canonical package baseline is incomplete; repair and readiness promotion remain held pending PLAN decision. No tool or missing-context blocker remains for this review.

Exact affected repository:
C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core
branch main; HEAD = refs/heads/main = e3b9888b25fe963ef4316fe8066d086bae55db47.
Initial and final git --no-optional-locks status --porcelain=v1 --untracked-files=no both show exactly 59 ' D' entries, all under packages/text-engine-rust-wasm; no other tracked modifications. git diff --cached --quiet exit 0. No staged changes. git diff HEAD --name-status --diff-filter=ACMRT empty.
Package has 106 tracked index entries; 59 absent, leaving 47 not reported deleted.
For EACH missing file: Test-Path false; git rev-parse HEAD:path equals git rev-parse :path; git cat-file -s succeeds with object size. Total missing committed bytes 3459115. Thus all 59 committed baselines resolve in local Git/index. This checks object availability/size, not a full object-corruption or runtime test. Exact path/blob inventory below.

History evidence:
HEAD e3b9888b25fe963ef4316fe8066d086bae55db47, 2026-09-05T13:54:35+07:00, Add structure pattern slot boundary; show --stat contains five files (docs/CORE_PUBLIC_EXPORT_BOUNDARY_REVIEW.md, src/index.ts, src/lifecycle/structurePatternSlots.ts, tests/corePublicExportBoundaryReview.test.ts, tests/structurePatternSlotBoundary.test.ts), none under the missing package.
Previous commit 8de9e5082f3462e42fdff368d0cb380159da3713, chore: retire pdf renderer pilot fixture outputs.
Most recent package-affecting commit a89b02c3d2d0073ee7ef669de25b862d5534717e, 2026-09-01T15:43:26+07:00, Bound all Core Markdown authority. Earlier package commits e2c979271cff9968765ad73c31c6877ca8a81478 and 25379ecb8f2df5ce567e762c171885d2580ed6a3.
HEAD reflog showed current cherry-pick at e3b9888..., prior reset: moving to HEAD at 8de9e508..., plus two 8de9 entries with empty messages. None establishes who/what removed working files. git log -1 --diff-filter=D -- packages/text-engine-rust-wasm returned no entry. The observed 59 deletions are unstaged working-tree absences, not deleted from current HEAD/index. No causal inference from count, reflog reset, or consumer junction.

Filesystem/link evidence (Get-Item -Force exact paths only, no traversal):
Canonical Core root, packages, packages/text-engine-rust-wasm, rust-live-draft-engine, and Core node_modules are ordinary directories, not junctions.
Package fixtures, pkg, pkg-live-draft, pkg-live-draft-mr1, pkg-live-draft-mr1-range, rust-live-draft-engine/src and src/bin are absent.
Editor HEAD 8e29b711405916491a9efbaa3db2361175075519.
Editor node_modules/@flowdoc/vnext-core is Junction -> canonical Core root.
Editor node_modules/@flowdoc/text-engine-rust-wasm is Junction -> C:/Users/nekot/.codex/visualizations/2026/09/05/01a0707e-00e9-74e1-be1b-a272a1b89d2a/core-wasm-baseline/packages/text-engine-rust-wasm.
Editor node_modules/@flowdoc/text-engine-rust-wasm.original-link is Junction -> canonical Core/packages/text-engine-rust-wasm.
Editor package.json declares @flowdoc/text-engine-rust-wasm=file:../flowdoc-vnext-core/packages/text-engine-rust-wasm and @flowdoc/vnext-core=file:../flowdoc-vnext-core. package-lock.json lines 11,44–45,85–86 retain canonical text-engine path. Existing Editor pass recorded in delivery document therefore does not establish clean-install readiness against the incomplete canonical package. Snapshot contents/digests were not re-audited; no dependency/backups recursively inspected.

Recovery risk:
All committed versions are available. Git/index contain no alternate staged versions for these 59 paths. At observation time no existing file at any of these exact paths would be overwritten by a missing-only restoration. However deletion may be intentional work, and pre-deletion uncommitted content cannot be reconstructed from HEAD/index evidence. Untracked/ignored content and backups were deliberately not enumerated. Restoring whole directories, resetting, cleaning, reinstalling, rebuilding WASM, or replacing links would expand risk and scope. Another process may race; preflight must revalidate every destination and ancestor immediately before any future write. Recovery would restore baseline, not prove or fix deletion cause.

Smallest safe repair proposal (NOT executed):
Owner repo-core, executed by Core WORK after PLAN accepts evidence and explicitly scopes a repair packet. Because the defect is in the canonical checkout and a clean worktree does not repair it, PLAN must resolve the existing worktree rule with explicit user-authorized same-checkout maintenance for exactly these 59 missing tracked paths; do not silently use a clean worktree as proof of canonical repair.
Freeze source to e3b9888b25fe963ef4316fe8066d086bae55db47. Recheck unchanged HEAD/index, exact 59 deletion inventory, absence of each destination, ordinary in-root ancestors and deletion intent. If any mismatch, return for review. Then restore only those explicit paths to working tree from that immutable commit, preserving index, remaining tracked files, untracked/ignored content and all links. No reset/clean/full-directory overwrite/install/build or new source commit needed for an exact baseline recovery.
Verification for repair packet: (1) zero remaining tracked deletions and no new staged or tracked diff; (2) hash/compare all 59 restored files to expected blobs, accounting for Git filters; (3) run existing package wasm:verify:live-draft-artifacts (read inspected scripts/verify-live-draft-artifacts.mjs; checks three pinned WASM SHA-256s); (4) package type-check and Core npm run check in approved verification environment; (5) separate Editor-owned follow-up decides consumer junction normalization and verifies fresh isolated dependency setup plus Editor npm run check against restored canonical Core. No reinstall/build was run in this review. Existing snapshot/original-link should remain until consumer owner accepts replacement. Do not create artificial source commits for a zero-diff restoration. Any actual source fix requires dedicated worktree, normal commit and main gates.

Files changed by this lane: none, all repositories.
Behavior changed: none. Commit: none. Tests run: none (read-only dispatch explicitly forbids install/build and requested inspection only).
Read-only checks: Git status/index/HEAD/path-object availability/history/reflog, exact path existence and junction metadata, narrow package/lock/script reads. Final canonical status reconfirmed 59 ' D', indexDiffExit=0, HEAD unchanged.
Evidence/map updates: none; this is candidate evidence delivered to PLAN. No Core/Editor/Backend/FlowDoc readiness, map truth or accepted lane/round state promoted.
Intentionally unchanged: all files, links, branches, index, backups, untracked/ignored contents, retired FlowDocEditor, repair, R3/Preview/Versions/publication/PDF.
Contract Change Request: none for this read-only lane. Executing repair requires separate explicit scoped authorization/packet; read-only scope is not repair authority.
PR Summary Draft: not applicable (no implementation).
Automatic return status: active automatic push via mcp__codex_app__send_message_to_thread to PLAN 01a0707e-00e9-74e1-be1b-a272a1b89d2a on local, this event; no manual recovery/user copy-paste. Tool success confirms submission.
Next PLAN decision: stage in handoffInbox, acceptanceGate, then resolve deletion intent/recovery authorization and owner repair packet before claiming canonical readiness or opening dependent renderer work. Preserve cause and lost-uncommitted-content UNKNOWN even if baseline is restored.

Exact missing-file inventory (all paths relative to canonical Core root; all status ' D'; indexed blob=HEAD blob; object size available):
packages/text-engine-rust-wasm/README.md | bede4b58281cd31ebbf03599c75c575f7fefb814 | 12363 bytes
packages/text-engine-rust-wasm/fixtures/native-evidence-summary.v1.json | a6bf791a9fd57f2b5d54aa29241566a449682922 | 7812 bytes
packages/text-engine-rust-wasm/fixtures/native-wasm-parity-summary.v1.json | 0c5dd4994fc85571796339a4c53fc03f82a3001c | 9126 bytes
packages/text-engine-rust-wasm/fixtures/numeric-drift-threshold-decision.v1.json | 9be4dd746398fb5d000e333ee15acf32361ddca7 | 9897 bytes
packages/text-engine-rust-wasm/fixtures/pdf-report-font-bakeoff-summary.v1.json | 4437e49ee8873500b65a6a7c7f6ea3b202173d69 | 13037 bytes
packages/text-engine-rust-wasm/fixtures/renderer-backed-drift-summary.v1.json | c417b1b1dc51baa1da68cae80d1b92b8c659ecbb | 9088 bytes
packages/text-engine-rust-wasm/fixtures/runtime-identity-digest-evidence-builder.v1.json | 3230633e62330e3b2e03ec610a20e1c668a3d07c | 2218 bytes
packages/text-engine-rust-wasm/fixtures/runtime-identity-digest-evidence-population.v1.json | bbe4dc62716f8da13f99aac998d5e9dd54386766 | 5333 bytes
packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.corpus.v1.json | 623022092c9ed8fe75c55e1acc0377bcdeef351d | 1225 bytes
packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.mixed-heading.sarabun-bold.v1.json | be05fc2c518ee84aa674b378bfd2bb0c00fe3d74 | 2567 bytes
packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.sarabun.v1.json | 4679f43544d82ace7d0d82f1965b333a3a93fd2a | 2382 bytes
packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.thai-combining.sarabun.v1.json | 22a16c44d90e56e51e687eb2208360a3288899c9 | 2359 bytes
packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.thai-currency.noto-sans-thai.v1.json | b280269569dbcf92aad49da7e9b2c424c85b267e | 2247 bytes
packages/text-engine-rust-wasm/fixtures/text-engine-runtime-identity.v1.json | 38ebcac6c5e195d97b32d92d3a10face66f46fa6 | 2118 bytes
packages/text-engine-rust-wasm/fixtures/wasm-artifact-build-output.v1.json | 30c51d649da2fa11c2b4b2d02cca5182c1532926 | 5074 bytes
packages/text-engine-rust-wasm/fixtures/wasm-artifact-digest-pinning.v1.json | 6f9bca7a15c032de24c6f03ac2cc759403ddc449 | 6534 bytes
packages/text-engine-rust-wasm/fixtures/wasm-artifact-production-retry.v1.json | b543002961dc99ecb08899097e299abb9a12d541 | 5845 bytes
packages/text-engine-rust-wasm/fixtures/wasm-artifact-production.v1.json | ba391a081ef168b64baf5c107cd39cf1852c1276 | 4189 bytes
packages/text-engine-rust-wasm/fixtures/wasm-bindgen-export-dependency.v1.json | 5c90ae6ab2d19869391680a9c07265125186ebf1 | 4894 bytes
packages/text-engine-rust-wasm/fixtures/wasm-build-toolchain-readiness.v1.json | 347a72c3684a030e08743e108937d505900e6545 | 3952 bytes
packages/text-engine-rust-wasm/fixtures/wasm-evidence-summary.v1.json | 684f48160071f0e7de34754627b99cf42bcf52fc | 8247 bytes
packages/text-engine-rust-wasm/fixtures/wasm-toolchain-acquisition.v1.json | b0ed75beb30df6bd34827535cc9211b6f6640a7e | 3972 bytes
packages/text-engine-rust-wasm/fixtures/wasm-toolchain-optional-readiness-smoke.v1.json | 9fd5991cb842a5f5c5fdc429758ac02ce4a40da8 | 3434 bytes
packages/text-engine-rust-wasm/fixtures/wasm-toolchain-provisioning-bootstrap.v1.json | e69a134d69ddd034f1da1397e7f6588dc41fc6c1 | 5190 bytes
packages/text-engine-rust-wasm/fixtures/wasm-toolchain-provisioning-execution.v1.json | ad2f3e78c8769cea553943cfe83462d56975cdcd | 6635 bytes
packages/text-engine-rust-wasm/fixtures/wasm-toolchain-rust-upgrade-execution.v1.json | 15411ba9681ebf47f7d4826a511478fc6429fb5d | 6276 bytes
packages/text-engine-rust-wasm/fixtures/wasm-toolchain-version-compatibility.v1.json | a21077cb92d510bef5ff3fbad83e7aa0f948963c | 8591 bytes
packages/text-engine-rust-wasm/package.json | ae8bf1e0d9403539dab86af809d6beed7a426032 | 2001 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1-range/.gitignore | f59ec20aabf5842d237244ece8c81ab184faeac1 | 1 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1-range/flowdoc_text_engine_mr1_range.d.ts | 8567130e05f6b0de292145428f3750c55ac3f6ad | 3315 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1-range/flowdoc_text_engine_mr1_range.js | 729c7fbfdb27dd3b29d00c8a1950ff4feddf93a5 | 12330 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1-range/flowdoc_text_engine_mr1_range_bg.wasm | 70e6d0791d57c6959e155d9d6021ef3f1a6097f6 | 1077166 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1-range/flowdoc_text_engine_mr1_range_bg.wasm.d.ts | 2828a5d433d28bf44ef12ee425d2773adc34fecd | 1426 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1-range/package.json | d4dba783a0548bac5e88b71551f3c9583eccf631 | 371 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1/.gitignore | 63f4f9e3af413da4150d5f61ebaa60b237453b17 | 157 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1/flowdoc_text_engine_mr1.d.ts | 5ecc42c51711a8f2f013a03c3c074ad8c1583a78 | 2363 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1/flowdoc_text_engine_mr1.js | cf2e417900bf579576f26b6e3402404d3797a3fe | 9465 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1/flowdoc_text_engine_mr1_bg.wasm | 0de24e8cce5c270eef2aec37399f9a3d011ac07f | 1067344 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1/flowdoc_text_engine_mr1_bg.wasm.d.ts | 3d6b253d5223879ccd90af93de7ca4cb0c0e3e7e | 970 bytes
packages/text-engine-rust-wasm/pkg-live-draft-mr1/package.json | 0bbff9926e4dc68f0e4453d838a55a1e6a95760e | 341 bytes
packages/text-engine-rust-wasm/pkg-live-draft/.gitignore | f59ec20aabf5842d237244ece8c81ab184faeac1 | 1 bytes
packages/text-engine-rust-wasm/pkg-live-draft/flowdoc_text_engine.d.ts | a40a8e0a596735c795106ae746c3470531a6c62c | 2205 bytes
packages/text-engine-rust-wasm/pkg-live-draft/flowdoc_text_engine.js | 8063f1ccf0f93361320df1dca2ccba2b4f0e5d58 | 9037 bytes
packages/text-engine-rust-wasm/pkg-live-draft/flowdoc_text_engine_bg.wasm | 71fd5532998f63320379562299ff2ae5b40c361e | 1064500 bytes
packages/text-engine-rust-wasm/pkg-live-draft/flowdoc_text_engine_bg.wasm.d.ts | 2d60547113b46ba905e3f7752b5bed48d5223dfa | 886 bytes
packages/text-engine-rust-wasm/pkg-live-draft/package.json | 69a8d03e8713eecb7af69f789861ab6b25d67890 | 321 bytes
packages/text-engine-rust-wasm/pkg/.gitignore | f59ec20aabf5842d237244ece8c81ab184faeac1 | 1 bytes
packages/text-engine-rust-wasm/pkg/flowdoc_text_engine.d.ts | 83b840907b58239a5e1375b6509a6eee70a251df | 1529 bytes
packages/text-engine-rust-wasm/pkg/flowdoc_text_engine.js | d3142353371a91e537a92b772c0eee0e647b74ee | 5258 bytes
packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm | 3a2b4e24dd5cfea0af9985612678a59dd333c0a6 | 13782 bytes
packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm.d.ts | 290de132654342d5aa96377e75fcdcee42509082 | 404 bytes
packages/text-engine-rust-wasm/pkg/package.json | 4a9e46c31de0cc7aca77d4d9981c7586808a0db7 | 314 bytes
packages/text-engine-rust-wasm/rust-live-draft-engine/Cargo.lock | 12f8455653d4cdd1dbe432a13d4246b88382bb6e | 12227 bytes
packages/text-engine-rust-wasm/rust-live-draft-engine/Cargo.toml | ccd339b0dcc0ec8b2e3c43765d31e9a0427c708a | 440 bytes
packages/text-engine-rust-wasm/rust-live-draft-engine/src/bin/flowdoc-live-draft-icu4x-range.rs | 7beb188f1e82f0f4dd9af0610a8f98bb127dc081 | 984 bytes
packages/text-engine-rust-wasm/rust-live-draft-engine/src/bin/flowdoc-live-draft-icu4x.rs | 66c8ef3e7078ce2b8329d9d94abf57d72a566aa5 | 542 bytes
packages/text-engine-rust-wasm/rust-live-draft-engine/src/bin/flowdoc-live-draft-rustybuzz-range.rs | 45565d3d017688324679c410a6b5762e8eb22c71 | 1250 bytes
packages/text-engine-rust-wasm/rust-live-draft-engine/src/lib.rs | 29e55281927d168443c082b51ceb8df00dd64310 | 12700 bytes
packages/text-engine-rust-wasm/rust-live-draft-engine/src/main.rs | 58d7989827db2e0ca671a216301463879b8cd8ea | 879 bytes

