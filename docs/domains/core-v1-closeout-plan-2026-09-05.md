# PLAN — ปิด Core V1 ที่เลิกใช้ โดยรักษา V2

## Authority Boundary / Work context

Project Control canonical planning-coordination. Owner repo-project-control, active role planning-partner / project-control-steward. Work path flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap. Phase phase-core-v1-closeout-scope; Checklist checklist-core-v1-closeout-scope; Evidence target evidence-core-v1-closeout-scope-2026-09-05. No map or product truth promotion.

ตูมอนุมัติเริ่มรอบปิดงานตาม PLAN/WORK: ระบุของเก่าที่ไม่มีผู้ใช้ -> PLAN รับรายการ -> owner WORK ถอด consumer ที่จำเป็น -> Core WORK cleanup -> owner/main checks และ Project Control ปิดรอบ เป้าหมายรักษา V2/Creator และเลิกพึ่ง text-engine snapshot ชั่วคราว ไม่เพิ่ม R3 ในรอบนี้

การอนุมัติรอบนี้ไม่เปลี่ยนข้อเท็จจริงว่า 59 ไฟล์ที่หายยังไม่ใช่ชุด V1-only ที่พิสูจน์แล้ว และไม่ใช่คำสั่ง restore ทั้งชุดลง checkout เดิม ความจำเป็นที่จะคืนไฟล์ที่ยังใช้ต้องเสนอเป็นรายการชัดเจนก่อนลงมือ ไม่ปล่อยให้ตัดสินใจผิดเป็นข้อมูลสูญหาย

## ผลล่าสุด — สรุปภาษาไทย

รอบถอด Core V1 สำเร็จในส่วน product: main ที่ f4f4425 ถอด runtime/API และ wrapper เก่า 9 source files โดยรักษา V2 และหลักฐานทดสอบที่จำเป็น ไฟล์ package 59 รายการคืนตรงกับ Git ตามข้อยกเว้นเฉพาะที่ตูมยืนยันแล้ว ไม่เหมารวมไฟล์ชื่อ V1 ว่าลบได้ทั้งหมด

Core main ผ่าน 430 ชุด / 2,739 tests; Editor ผ่านทั้ง worktree และ main 113 ชุด / 412 tests ใช้ dependency จาก Core ปกติแล้ว ไม่มี snapshot override. หน้าบ้านสร้าง–แก้–บันทึก–เปิดกลับผ่าน และการบันทึกชนกันเก็บข้อความที่ยังไม่บันทึกไว้ ผลและข้อจำกัดอยู่ในบันทึกท้ายเอกสาร

การรวมเอกสาร Project Control ใช้ full gate ใน worktree และ main ตามส่วน Final Project Control integration gate พร้อมผลคำสั่งใน PLAN handoff. โฟลเดอร์ worktree ว่าง 3 แห่งยังติด process lock ของ Windows แต่ถอดทะเบียน Git และสาขางานที่รวมแล้วเรียบร้อย งาน roadmap R3–R7 ยังไม่เริ่มในรอบนี้; ไม่มีการแก้ system map

ส่วนบริบทและ registry แรกด้านล่างเป็นลำดับประวัติ ให้ใช้ event ล่าสุดและ Evidence ที่รับแล้วในการตัดสินสถานะปัจจุบัน

## Accepted baseline / unknowns — initial history

PC main c379e4c128be51a3e0dbf46b8070a3d8248bcc14 records prior automatic read-only returns 01–03 in creator-core-readiness-dispatch-2026-09-05.md. Core HEAD e3b9888b25fe963ef4316fe8066d086bae55db47; Editor 8e29b711405916491a9efbaa3db2361175075519. Revalidate refs before relying on them.

Terminology SPLIT: most plausible old/current code axis is layout RootV1/SceneV1 vs RootV2/SceneV2, not package schema versions or *.v1.json. Shared V1-named kernels and native range inputs support V2. Missing 59 classified 9 shared, 32 historical-evidence, 18 unknown-generation QA artifacts; none yet certified legacy-v1-only. Initial-flow adapter and spatial-index wrapper narrow removals already landed. Do not redo them. FlowDocEditor is retired and excluded.

Unknown: exact obsolete layout candidate set, indirect/deep-import consumers, historical retention decisions, safe disposition for each missing file, full clean dependency setup. Preserve current V2 semantics and evidence; do not remove tests merely to get green.

## Dispatch and Room Run Registry

- dispatchSetId: dispatch-core-v1-closeout-2026-09-05
- PLAN task: 01a0707e-00e9-74e1-be1b-a272a1b89d2a, host local
- parallelLimit: 1; one owner/review at a time because retirement boundaries overlap retained dependencies
- laneDependencyGraph: scope-review -> PLAN acceptance -> consumer changes only if required -> Core cleanup -> integrated clean setup/Creator proof -> PC closeout
- current lane: lane-core-v1-closeout-scope; Work Type lane-reconciliation; owner repo-core
- roomRunId: room-core-v1-closeout-scope-01; state prepared; task locator pending; Context Acknowledgement pending
- Return Event ID/handoffId: handoff-core-v1-closeout-scope-2026-09-05-01
- Active Return Command: mcp__codex_app__send_message_to_thread to PLAN task above, host local, terminal handoff in prompt
- automatic return required; final answer alone not return. No user copy/paste.
- liveness: real task status plus acknowledgement/progress; deadline 15 minutes after real locator resolves; missed deadline recorded return-channel-failed before recovery
- death signal: unavailable/silent/error task; no dependent lane opens from silence
- handoffInbox/completionQueue empty; arrivalSequence pending; dedupe by handoffId; returnOrderPolicy BLOCKER/FAIL/CCR first then arrivalSequence, one acceptance at a time
- revision state none; incomplete result returns to same task
- Held: all product edits until exact scope accepted; R3, Preview, Versions, publication, PDF feature work

## WORK scope capsule

Read PC AGENTS, delivery model, orchestration, Work Type routing, Lean Dispatch rules (not selecting Lean mode), English/Thai terminology, documentation authority rules, Core AGENTS and current prior review registry/evidence. Use prior returns; do not restart the generic 59-file investigation.

Read-only task: produce a decision-ready exact scope for obsolete RootV1/SceneV1/top-level wrappers while preserving RootV2 and shared kernels. Trace imports, exports, dynamic/deep imports, current tests, native evidence helpers and narrow Editor/Backend consumer references where required. Examine only bounded layout family and affected 59 paths; do not expand into whole-repo cleanup or storage-size surveys. No install/build/test runs or file writes in this lane.

Deliver two tables: (A) each obsolete candidate with delete/retain/migrate recommendation, exact files and consumer proof; (B) all 59 missing paths with recommended retain/recover, retire-after-consumer-change, historical-retention, or unresolved decision, reason and owner. If a decision is not technically knowable, name the specific user/product decision instead of inventing an answer. Runtime Version V1 filename is not deletion proof. All candidate references must carry exact source refs and useful locations.

Give the smallest concrete implementation packet(s), owner order, required tests, expected feature changes (ideally none for V2), and any precise maintenance exception needed. Do not issue a blanket restoration or blanket retirement recommendation. Preserve user intent to reduce obsolete code/confusion and all current V2 behavior/evidence.

Forbidden: restore/delete/reset/clean, install/build, link mutation, product/PC edits, recursive node_modules or backup traversal, package-wide removal by inference, map promotion. Use canonical checkout tracked reads (git status --untracked-files=no); fresh WORK worktree is isolation/locator, not evidence that canonical 59 absences are fixed.

First acknowledge allowed/forbidden scope, reading, evidence, return path, liveness and unknowns. Terminal return PASS/FAIL/BLOCKER/RISK/UNKNOWN with exact tables/refs, no files changed/commit none/tests not run, CCR if next lane changes contracts, active return state and next PLAN decision. Push automatically to PLAN before/with final.

## Closeout gates

No unresolved tracked missing files inside accepted final scope; V2 and existing Creator flow checks pass; normal dependency setup no temporary snapshot override; deprecated/shared/evidence boundaries documented; exact owner commits and fresh worktree/main gates; no stale completed custom worktree. These are goals, not claims already achieved.

## Registry event: queued creation

Creation client-new-thread:3d9fd9ab-6f5e-4641-bf71-95768045355d returned on local. State queued; real task locator and Context Acknowledgement pending. No dependent dispatch or acceptance from clientThreadId alone.

## Registry event: running / acknowledgement
Real WORK task 01a0714c-efdf-7dd0-b6ad-61d80b01bd13, local; worktree C:/Users/nekot/.codex/worktrees/39e1/flowdoc-vnext-core. State running. Active ACK/LIVENESS received through send_message_to_thread; full packet acknowledged, governing reading underway. lastHeartbeatAt 2026-09-05T11:22:36.7810937Z; livenessDeadline 2026-09-05T11:37:36.7810937Z. No terminal acceptance yet. Automatic channel is reachable; no dependent lane opened.


## PLAN acceptance and decisions — scope return 01

Automatic return received from task 01a0714c-efdf-7dd0-b6ad-61d80b01bd13; Context Acknowledgement complete. handoffInbox staged, arrivalSequence 1 processed through acceptanceGate; accepted read-only exact scope, no duplicate/manual recovery; queue empty. Scope WORK complete, revision none. Full return preserved in core-v1-closeout-scope-return-2026-09-05.md.

D1 accepted: retire five public RootV1/SceneV1 runtime/API files after retaining V2 equivalence/reference facts. User approved obsolete-v1 retirement preserving v2, so this supersedes old frozen V1-public-compatibility retention for these exact files only. D2 accepted: retire four old wrappers after shared type extraction and V2 test migration; preserve shared kernels plus geometry/fingerprint/rejection evidence. D3a/D3b choose retention of existing three live-bundle build policies and complete original historical bundle; packaging metadata cleanup is not this v1 scope. No same-checkout restoration is implied by these retention decisions.

Source return recommends separate migration/deletion packets. PLAN chooses one atomic Core-only product lane for these dependent changes: same owner, exact bounded nine sources, test migration/type extraction must precede retirement internally, no independent cross-owner work. This avoids integrating obsolete API deletion without its retained V2 tests. parallelLimit remains 1; scope WORK terminal before product WORK opens.

## Product WORK capsule — lane-core-v1-runtime-retirement

Work Type product-implementation; owner repo-core; Phase phase-core-v1-runtime-retirement; Checklist checklist-core-v1-runtime-retirement; Evidence evidence-core-v1-runtime-retirement-2026-09-05. roomRunId room-core-v1-runtime-retirement-01; task locator pending; state prepared; handoffId handoff-core-v1-runtime-retirement-2026-09-05-01. PLAN and automatic return command unchanged. Liveness deadline 20 minutes after resolved task; progress can renew explicitly. handoffInbox empty; no acceptance before exact commit and fresh owner checks. Return status PASS/FAIL/BLOCKER/RISK/UNKNOWN. Reading: full scope return and governing PC/owner/authority/terminology docs. Acknowledge before edits.

Allowed only in dedicated Core worktree from main: migrate shared fixtures and current V2/reference/parity tests; extract unchanged FlowInterval/IssueCode/Work types from old FlowRegionProvider to internal contract and adjust four shared imports; retire exact src/layout files textBlockUnifiedLayoutRootV1.ts, textBlockUnifiedLayoutRootContractV1.ts, textBlockUnifiedLayoutRootAuthorityInternalsV1.ts, textBlockUnifiedLayoutSceneV1.ts, textBlockUnifiedLayoutSceneContractV1.ts, textBlockAuthoredBoxGeometryV1.ts, textBlockSpatialWrappingLayoutV1.ts, textBlockSpatialIndexV1.ts, textBlockFlowRegionProviderV1.ts. Remove matching old index exports. Update narrowly affected retention guards and code-adjacent contract documentation after authority gate. Preserve historic compatibility fixture bytes and register what replaces removed old-only tests. Every replaced test obligation must be accounted for; use frozen expected facts captured from the baseline or direct V2 setup with independent assertions, not V2 compared to itself.

Forbidden: changes to current V2 semantics, shared V1 kernels/initial-flow/multi-run/native support, package artifact/fixture deletion or regeneration, restoring canonical 59 paths, root checkout mutation, Editor/Backend edits, snapshot/link changes, broad skips, shared truth promotion. Keep the 59-path reconciliation separate. No source changes solely to make broken tests pass. If tests expose unrelated baseline failure, return exact failure and original-lane repair boundary rather than broadening silently.

Owner verification: focused RootV2/PersistentSceneV2/SceneDeliveryV2/PersistentLayoutLineTreeV1/SpatialWrappingLayoutV2/native-WASM producer tests and affected source-helper users; package artifact checks where relevant; full Core npm run check before commit/handoff. Normal dependency installation inside dedicated worktree allowed; no traversing/removing shared dependency junctions. Preserve tests/fixtures/text-block-v1-layout-compatibility.v1.json unchanged. Return exact commit(s), removed/retained file lists, evidence replacement matrix, checks, risks, PR summary and automatic return. Do not merge main yourself; PLAN verifies/integrates, and sends product repairs back to same WORK. Full main gate may remain blocked by the known canonical 59 absences; report honestly and do not claim clean install/readiness from worktree alone.

## Product registry event: queued

Creation client-new-thread:2afc8196-6c71-4b48-857b-0a946b867c73 on local; state queued, real locator pending. Scope review WORK is terminal and accepted. No second product room active; no acceptance from clientThreadId alone.

## Product registry event: running
Real task 01a07158-bf75-7772-a83e-152bffbb333c, host local; worktree C:/Users/nekot/.codex/worktrees/a64f/flowdoc-vnext-core at baseline e3b9888b25fe963ef4316fe8066d086bae55db47. ACK/LIVENESS actively received; exact scope and return acknowledged; governing reading completion pending. lastHeartbeatAt 2026-09-05T11:35:42.7391526Z; livenessDeadline 2026-09-05T11:55:42.7391526Z. State running, terminal result/acceptance pending. Current product task only; no canonical recovery performed.


## Integration continuation / explicit user exception

User ตูม explicitly confirmed the requested special case in PLAN: restore only the reviewed 59 missing paths from Git in the original Core checkout, verify still absent and do not overwrite other files, then integrate the verified V1 retirement and verify main. This is a one-time same-checkout exception for that exact set, not a general relaxation of worktree discipline. Earlier withholding of restoration is superseded for this set by this later explicit confirmation.

Runtime WORK handoff handoff-core-v1-runtime-retirement-2026-09-05-01 automatically received from expected task; arrivalSequence 2, Context Acknowledgement complete; inbox processed, no duplicate/manual recovery. PLAN reviewed f4f4425dcd7b370d165d2a0d7383aa14cf88b586, exact nine deletions, four retained type-import-only changes and replacement matrix. Worktree full gate 430 files/2739 tests; package type-check/3 digests PASS. PLAN focused gate 3 files/31 tests PASS. Accepted owner worktree implementation evidence; main integration not yet done. Scope WORK and runtime WORK terminal; parallelLimit 1 remains.

## Maintenance WORK capsule — lane-core-package-reconciliation

Owner repo-core, Work Type product-implementation (bounded local maintenance), role product-implementation-agent. Work flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap; Phase phase-core-package-reconciliation; Checklist checklist-core-package-reconciliation; Evidence evidence-core-package-reconciliation-2026-09-05. roomRunId room-core-package-reconciliation-01; task pending; handoffId handoff-core-package-reconciliation-2026-09-05-01. PLAN task 01a0707e-00e9-74e1-be1b-a272a1b89d2a local; active return via send_message_to_thread, terminal push required. Deadline 15 minutes from resolved locator; acknowledge scope and exception before writes. No concurrent product WORK.

Authorized canonical checkout C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core, baseline e3b9888b25fe963ef4316fe8066d086bae55db47. Exact 59 path inventory in core-readiness-return-2026-09-05.md and Table B core-v1-closeout-scope-return-2026-09-05.md. Read PC/owner AGENTS and authority rules before touching README. This restores historical original bytes, not edits documentary meaning.

Preflight: HEAD/index unchanged; exactly the 59 inventoried unstaged deletions and no other tracked modifications/staged edits; each path absent; resolved destination and existing ancestors ordinary directories inside canonical root, no junction traversal; source Git blobs available. Stop on mismatch, do not broaden list. Restore only exact approved missing paths from immutable baseline to working tree using Git-aware restoration; preserve index, remaining tracked files, untracked/ignored content and all dependency links. No reset/clean/full-directory overwrite or artifact regeneration. No main merge, no source commit for zero-diff baseline recovery.

Verify all restored files against expected Git blobs accounting for filters, zero tracked/index diff, package type-check and wasm:verify:live-draft-artifacts. Full Core main gate will be run by PLAN after retirement merge; do not rerun unrelated full baseline suite unless restoration verification indicates need. Report exact before/after refs, path count, hash comparison, package checks, no source commit and unchanged boundaries. Active return PASS/FAIL/BLOCKER/RISK/UNKNOWN to PLAN before/with final; if mismatch return without partial broad repair.

After accepted recovery, PLAN merges f4f4425 and runs full Core main gate. Product-repo failures go back to runtime WORK as Revision Packet. Editor-owned ordinary dependency/Creator verification follows separately; no Editor changes in this maintenance lane.

## Editor verification capsule — lane-editor-core-retirement-verification

Room Mode WORK; Work Type evidence-review; role evidence-reviewer with setup-cleanup overlay; owner repo-editor. Work flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap; Phase phase-editor-core-retirement-verification; Checklist checklist-editor-core-retirement-verification item ordinary-dependencies-and-creator; Evidence evidence-editor-core-retirement-verification-2026-09-05. dispatchSetId dispatch-core-v1-closeout-2026-09-05; roomRunId room-editor-core-retirement-verification-01; parallelLimit 1. Prepared only; dispatch after Core main PASS.

Accepted facts: Core obsolete RootV1/SceneV1 and four wrappers retired by f4f4425dcd7b370d165d2a0d7383aa14cf88b586; all 59 missing retained package files recovered exactly, working/index clean. V1 filename is not retirement proof: shared kernels and historical fixtures remain required. FlowDocEditor retired/excluded. Editor source baseline 8e29b711405916491a9efbaa3db2361175075519; Backend a639dadb82d674360992ce085960989bc9cf2656. Verify current refs. No new Creator features or R3.

Read PC AGENTS, delivery/orchestration/Work Type/authority/terminology contracts, this registry/latest acceptance, and Editor AGENTS plus narrow cross-repo map before setup. Skill candidates flowdoc-project-control, verification-before-completion, using-git-worktrees; systematic-debugging only on actual failure. No product source/Markdown changes in this lane; PLAN owns all records.

Allowed: fresh ordinary dependency setup in dedicated Editor worktree from main, using exact canonical Core sibling topology (and Backend only if existing checks need it); full Editor npm run check. A temporary sibling junction may point to exact canonical owner repo after verifying its absence and resolved target, for normal file: dependency topology only; do not use snapshot packages or fabricate manifests. Revert the prior PLAN-created ignored canonical dependency override: canonical Editor node_modules/@flowdoc/text-engine-rust-wasm is a junction to C:/Users/nekot/.codex/visualizations/2026/09/05/01a0707e-00e9-74e1-be1b-a272a1b89d2a/core-wasm-baseline/packages/text-engine-rust-wasm; sibling text-engine-rust-wasm.original-link is the original junction to canonical Core/packages/text-engine-rust-wasm. Verify both exact junction identities/targets first; remove only the temporary junction itself without following it, restore the original junction name, verify resolution. This is cleanup of our own ignored setup artifact, not a new permission to alter tracked files or perform broad same-checkout maintenance. Any mismatch stops dependent cleanup. Full canonical Editor check after ordinary dependency resolution required. No install into Core or Backend.

Creator verification: existing preview ports Backend 51411 and Editor 51412 were started by PLAN; do not kill user servers (51318). Source unchanged: Creator /structures create -> Build title/section/page defaults -> save -> reopen/revision, stale conflict preserves edits. WORK may prove via existing focused tests and full build; PLAN owns fresh browser verification on canonical 51412 after your terminal handoff. Report exactly what was/was not browser-tested. Do not add browser frameworks/tests to Editor for this evidence-only lane.

Forbidden: any tracked source/lock/config/Markdown edits, Core/Backend edits, package regeneration, broad dependency/backup traversal, reset/clean, new feature work, map/evidence promotion. Return existing source failures with evidence; any repair needs a PLAN revision/CCR with owner boundary. Do not patch to make checks pass. Unknown: broader external consumers, original Core deletion cause, unsampled browser paths.

Before changes actively acknowledge reading, scope, exact targets, unknowns and return. Real task locator required; clientThreadId alone stays queued. Liveness active ACK/progress plus task status, deadline 20 minutes after real locator (renew on meaningful progress); lost/silent room returns UNKNOWN/BLOCKER, never accepted. Terminal handoff ID handoff-editor-core-retirement-verification-2026-09-05-01; automatic Return Channel required: call mcp__codex_app__send_message_to_thread with threadId 01a0707e-00e9-74e1-be1b-a272a1b89d2a, hostId local, prompt full terminal packet before/with local final. Final answer alone is not return. No user copy/paste. returnOrderPolicy BLOCKER/FAIL/CCR first then arrivalSequence; PLAN assigns next sequence, dedupes by handoffId, stages inbox/queue and accepts one at a time. Same task receives revisions.

Handoff PASS/FAIL/BLOCKER/RISK/UNKNOWN, exact refs/worktree, before/after link targets, install/check commands and test counts, zero tracked diff proof, source commit NONE, files/behavior changes, unresolved risks, browser scope, PR summary not applicable if no source patch. Keep completed worktree locator available for PLAN cleanup; remove only any own auxiliary sibling junction once no command needs it, never targets. PLAN will accept evidence and finalize records.

## Maintenance registry: real task

WORK task 01a07185-eabb-74e3-9323-94d63f404642, host local, canonical Core checkout by explicit user exception. State running/ACK pending. Runtime retirement Phase moved to in-review (implementation terminal, main gate pending); package reconciliation is the sole in-progress Phase. Return handoff-core-package-reconciliation-2026-09-05-01, automatic command unchanged. Deadline 15 minutes from opening.

## Maintenance acceptance — return 01 / revision 02

Automatic handoff 01 received from the expected real task; arrivalSequence 3, ACK complete, no manual recovery or duplicate. Content recovery accepted provisionally: 59/59 filtered blobs equal baseline, 1,427 semantic index entries unchanged, package type-check and three pinned WASM digests pass. acceptanceGate needs-revision for 52 stale porcelain M flags despite empty semantic diffs. No main merge yet.

Revision 02 sent to the same task, preserving lane scope and exact 59 paths. Metadata-only refresh/really-refresh permitted; targeted identical-content add permitted only after proving every target blob equals both existing index and immutable baseline. Preserve HEAD and all path/blob/mode/stage entries. No source rewrite, persistent configuration change, reset, broad staging, or unrelated path changes. This is bookkeeping verification under the approved bounded restoration, not authority to stage content changes. Active ACK received; state running, deadline renewed 15 minutes from revision. Return handoff-core-package-reconciliation-2026-09-05-02 required through the same automatic channel.

## Maintenance acceptance — return 02 / Core integration

Automatic revision handoff 02 received; arrivalSequence 4, correct task/lane, ACK complete, no duplicate/manual recovery. acceptanceGate accepts exact restoration plus metadata reconciliation. All 59 raw bytes unchanged during revision, filtered blobs equal baseline, all 1,427 index entries preserved. Exact-path really-refresh resolved stale flags; no targeted add or content change. Prior status risk resolved; original deletion cause remains unknown. Package type-check and three WASM digests from return 01 remain applicable because content is unchanged. Registry terminal PASS, revision closed, queue empty.

PLAN independently verified empty tracked porcelain status, empty working/cached diffs and baseline HEAD. Fast-forward merged f4f4425dcd7b370d165d2a0d7383aa14cf88b586 into canonical Core main. Fresh full main npm run check is running; integration is not yet claimed PASS. Runtime WORK remains available for any product repair; PLAN does not patch product files.

## Core main gate accepted / Editor dispatch opening

Canonical Core main f4f4425dcd7b370d165d2a0d7383aa14cf88b586: fresh npm run check exit 0, type-check PASS, 430 test files/2739 tests PASS, Vitest duration 229.80s. Log C:/Users/nekot/AppData/Local/Temp/core-v1-retirement-main-check.log. Runtime retirement Phase done; package reconciliation Phase done. Editor verification is the sole in-progress Phase. Main implementation accepted; no map changes or R3 promotion.

Editor capsule above is activated after this gate. State prepared, real task locator pending; handoff-editor-core-retirement-verification-2026-09-05-01. All previous WORK rooms terminal; parallelLimit 1 maintained. Current draft registry is in the dedicated PC integration worktree pending full final PC gate; it is coordination intent/evidence staging, not yet canonical main publication.

## Editor registry event — queued

Creation client-new-thread:b954d9b7-35fa-4fa5-aedb-a5680b908b63 on local; room-editor-core-retirement-verification-01 queued. Real locator and Context Acknowledgement pending; no dependent dispatch or acceptance from clientThreadId alone. Core main acceptance notification sent to runtime WORK; no new Core work assigned.

## Editor registry event — running / ACK complete

Resolved real task 01a07195-ea95-7841-ab10-697c21a24221, host local; worktree C:/Users/nekot/.codex/worktrees/1470/flowdoc-vnext-editor at clean detached Editor main 8e29b711405916491a9efbaa3db2361175075519. Full Context Acknowledgement actively received, governing reading complete and exact junction targets verified before writes. Core and Backend refs confirmed. State running; liveness deadline renewed 20 minutes from ACK. Automatic return command/handoff unchanged; PLAN owns browser verification after WORK terminal. No dependent room or product-source patch authorized.

## Editor acceptance / PLAN browser verification

Automatic handoff-editor-core-retirement-verification-2026-09-05-01 from expected task received; arrivalSequence 5, ACK complete, inbox/queue processed once, accepted with bounded risks. No duplicate/manual recovery. WORK terminal PASS, revision none; all round rooms terminal. Full return preserved in editor-core-retirement-return-2026-09-05.md. PLAN read canonical check log and independently verified normal canonical WASM junction plus clean Editor tracked status.

WORK proof: fresh ordinary npm ci PASS, full Editor worktree and main gates PASS (each113 files/412 tests, type-check/build), focused6Creator session tests PASS. Exact canonical temporary snapshot junction removed without following target and original junction name restored. Auxiliary Core/Backend sibling junctions were removed after checks; no source/lock/config changes or new commit. Canonical npm ls PASS. Worktree npm ls reports invalid because lexical sibling differs from canonical realpath; installation/full gate nevertheless passed, diagnostic preserved without source repair. npm ci reported5high severity audit findings, not analyzed/remediated in this lane; Vite chunk-size warning preserved. Those are follow-up risks, not new feature scope.

PLAN browser on canonical Editor51412/Backend51411, after normal dependencies restored: created document-definition:cc6ec6cf-7f01-4070-9cbd-698e0d420891 at revision1; edited title to ทดสอบ Core V2 พร้อมใช้งานต่อ, section รายละเอียดหลังถอด V1 and default page200x297mm; save revision2 then Library/reopen preserved all values and saved state. Second tab saved title ทดสอบ Core V2 บันทึกจากหน้าที่สอง at revision3. First tab at revision2 edited ข้อความในหน้าค้างต้องไม่หาย and attempted save: UI showed มีฉบับใหม่จากอีกหน้า, disabled Save and preserved exact local text; screenshot visually confirmed this state. Explicit latest-load action opened the discard confirmation; browser-control CDP timed out, so completion of that optional browser reload is NOT claimed. Fresh ordinary create/edit/save/reopen and stale-preservation evidence is complete. No broader responsive, Preview, PDF, Versions or R3 claim.

## Completed lane cleanup

After clean status and integrated ancestor checks, removed registered Core read-only worktrees3084/39e1, merged Core worktreea64f and Editor verification worktree1470. Core retirement branch codex/core-v1-runtime-retirement deleted after verified merge. Dependency directories moved as whole ordinary directories to explicit external dependency-cache/core-v1-retirement and editor-core-verification before cleanup, avoiding dependency junction traversal. Canonical Core/Editor remain clean. Unrelated Core worktree8faf at0de05a3 remains untouched; this round does not classify its patches.

Windows keeps empty directories39e1/flowdoc-vnext-core, a64f/flowdoc-vnext-core and1470/flowdoc-vnext-editor locked by another process. Git registration and contents are gone; direct inspection shows empty roots. A non-recursive empty-directory removal for39e1 confirmed the process lock. Do not force-kill unrelated processes or claim physical residue cleanup complete. This is a cleanup RISK only, not an unmerged lane or lost patch.

## Final Project Control integration gate

All product lane evidence is accepted; this PC worktree stages canonical records/docs and regenerated index. Run full npm run check here, commit, fast-forward main only on PASS, rerun full main gate and then remove this completed PC worktree/branch. Final command evidence is supplied in PLAN handoff; no preemptive gate PASS assertion. Map changes NONE; all new evidence nodeIds empty, no parent promotion. Roadmap Work remains in-progress because R3-R7 are not delivered in this retirement round. Next recommended work: resume the next bounded Creator roadmap lane through PLAN/WORK, with explicit scope and acceptance; separate dependency-audit and bundle-size risks from feature delivery.

PC worktree full npm run check completed exit0: data validation/type-check, 100 unit-test files/399 tests, build, and6 browser E2E PASS. Log C:/Users/nekot/AppData/Local/Temp/core-closeout-pc-worktree-check.log. This gate result note is added after observing success; generated/data consistency rechecked before commit. Main verification must still run after integration; its actual result belongs to the final PLAN handoff, not an assumed success here.
