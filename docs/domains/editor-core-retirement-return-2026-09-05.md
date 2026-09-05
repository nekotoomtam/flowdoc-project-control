# Editor verification after Core retirement — 2026-09-05

## Authority Boundary

Owner repo-project-control. Preserved automatic evidence-review WORK handoff for Work flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap, Phase phase-editor-core-retirement-verification. PLAN acceptance and separate browser evidence are recorded in core-v1-closeout-plan-2026-09-05.md. This document does not promote maps, R3, Preview, publication or general product readiness.

Terminal evidence-candidate handoff
handoffId: handoff-editor-core-retirement-verification-2026-09-05-01
roomRunId: room-editor-core-retirement-verification-01
dispatchSetId: dispatch-core-v1-closeout-2026-09-05
laneId: lane-editor-core-retirement-verification
Room Mode WORK; Work Type evidence-review; owner repo-editor; role evidence-reviewer with setup-cleanup overlay.
Work path: flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap.
Phase: phase-editor-core-retirement-verification.
Checklist: checklist-editor-core-retirement-verification / ordinary-dependencies-and-creator.
Evidence target: evidence-editor-core-retirement-verification-2026-09-05.
Context Acknowledgement: complete and actively pushed before changes; governing PC contracts/latest staged registry/Phase/Checklist/Editor AGENTS/narrow Core map read. Liveness maintained.
Terminal status: PASS for allowed dependency normalization, fresh worktree install, full worktree/canonical Editor checks, focused Creator session evidence, zero tracked changes. RISK/UNKNOWN below; browser evidence intentionally remains PLAN-owned.
Real task: 01a07195-ea95-7841-ab10-697c21a24221, host local.
Worktree retained for PLAN cleanup: C:/Users/nekot/.codex/worktrees/1470/flowdoc-vnext-editor (externally managed detached HEAD).
Exact initial/final refs unchanged:
- Editor worktree/main and canonical Editor: 8e29b711405916491a9efbaa3db2361175075519.
- Canonical Core: f4f4425dcd7b370d165d2a0d7383aa14cf88b586.
- Canonical Backend: a639dadb82d674360992ce085960989bc9cf2656.
Source commit: NONE; no merge or PR. PR summary not applicable.

Link restoration:
Before canonical Editor/node_modules/@flowdoc/text-engine-rust-wasm was exactly a Junction to C:/Users/nekot/.codex/visualizations/2026/09/05/01a0707e-00e9-74e1-be1b-a272a1b89d2a/core-wasm-baseline/packages/text-engine-rust-wasm.
Sibling text-engine-rust-wasm.original-link was exactly a Junction to C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core/packages/text-engine-rust-wasm.
Both identities rechecked in mutation command. Initial combined PowerShell cleanup command was rejected by automatic policy without stated reason before execution. Safer separate System.IO.Directory.Delete(linkPath,false) removed only temporary junction; Rename-Item restored original name. Final junction target and fs.realpathSync verified canonical Core package; original-link now absent. No target contents removed.
Fresh worktree node_modules and sibling Core path initially absent. Created only authorized C:/Users/nekot/.codex/worktrees/1470/flowdoc-vnext-core Junction to exact ordinary canonical Core. Existing Vitest tests import Backend fixtures/server/repository, so created similarly verified flowdoc-vnext-backend sibling Junction to canonical Backend. Installed @flowdoc package realpaths resolved canonical Core and its WASM package. After all commands finished, both own auxiliary sibling junctions were rechecked and deleted non-recursively; absence and retained target directories verified. Re-running worktree checks requires restoring that same topology. Canonical dependency junctions remain normal and usable.

Commands/results (Node v24.15.0, npm 11.12.1):
1. npm ci in fresh worktree: exit 0; 65 packages added, 68 audited in 48s. No installs into Core or Backend; no tracked lock changes.
2. npm run check in canonical Editor after link restoration: exit 0; tsc --noEmit PASS; Vitest 113 files / 412 tests PASS, duration 29.37s; Vite build PASS, 563 modules, 1.52s.
Log C:/Users/nekot/AppData/Local/Temp/editor-core-retirement-canonical-check.log.
3. npm run check in fresh worktree: exit 0; tsc --noEmit PASS; Vitest 113 files / 412 tests PASS, duration 29.15s; Vite build PASS, 563 modules, 1.02s.
Log C:/Users/nekot/AppData/Local/Temp/editor-core-retirement-worktree-check.log.
4. npm run test -- src/tests/creatorDraft.test.ts --reporter=verbose in worktree: exit 0; 1 file / 6 tests PASS. Explicit evidence: created draft property-order equality; read/save entire structure with title edit and revision 2; stale conflict keeps local title/dirty draft and blocks resave until explicit reload; malformed/wrong-definition rejection; older-response suppression and failed-save preservation; workspace list validation.
Log C:/Users/nekot/AppData/Local/Temp/editor-core-retirement-creator-check.log.
5. npm ls @flowdoc/vnext-core @flowdoc/text-engine-rust-wasm --depth=0: canonical PASS exit 0 with normal relative links. Additional worktree diagnostic reported ELSPROBLEMS/invalid for both file dependencies because listed installed target is canonical realpath outside lexical sibling path; both realpaths verified canonical and npm ci/full gate pass. This is a retained topology diagnostic RISK, not a hidden full-gate failure; no repair attempted.
6. Final git status --porcelain --untracked-files=no empty plus git diff --quiet and git diff --cached --quiet exit 0 in Editor worktree, canonical Editor, Core, Backend. Full worktree git status --porcelain also empty. Refs unchanged. Zero tracked source/lock/config/Markdown diff.

Files changed: no tracked files in any repository. Ignored Editor node_modules/dist created or updated by permitted install/build; exact canonical ignored junction normalized; own auxiliary sibling links created then removed. Behavior changed: NONE.
Browser scope: NO browser interaction or browser test was performed in WORK. Creator six tests use mocked transport; they do not prove live /structures create -> Build title/section/page defaults -> save -> reopen UI or browser conflict. Full build passed. PLAN must perform that fresh browser sequence on canonical 51412 with Backend 51411. No servers killed/restarted, including user 51318.
FAIL/BLOCKER: none in required check gates.
RISK: npm ci reports 5 high severity audit findings (not remediated or analyzed beyond install report); both builds warn about chunks over 500 kB; worktree-only npm ls path validation diagnostic as described.
UNKNOWN: original Core deletion cause, broader external consumers, unsampled browser paths. No broad readiness/compatibility/R3/map truth promotion.
Evidence/map updates: NONE; PLAN owns registration and acceptance.
Intentionally unchanged: product source/contracts/config/lock/Markdown, Core/Backend dependencies and files, package artifacts, shared V1 kernels/historical fixtures, FlowDocEditor excluded, Creator features/R3.
CCR: NONE; any source repair needs a revision/owner boundary.
Automatic Return Channel: this active send_message_to_thread push to PLAN 01a0707e-00e9-74e1-be1b-a272a1b89d2a/local before local final, no manual recovery/user bridge. PLAN assigns arrivalSequence, deduplicates this handoffId, stages inbox/queue, processes acceptanceGate under BLOCKER/FAIL/CCR-first policy.
Next PLAN action: review candidate, perform fresh canonical browser verification, record bounded evidence/risks, then clean retained completed worktree when accepted.

