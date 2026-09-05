# PLAN — ปิด Core V1 ที่เลิกใช้ โดยรักษา V2

## Authority Boundary / Work context

Project Control canonical planning-coordination. Owner repo-project-control, active role planning-partner / project-control-steward. Work path flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap. Phase phase-core-v1-closeout-scope; Checklist checklist-core-v1-closeout-scope; Evidence target evidence-core-v1-closeout-scope-2026-09-05. No map or product truth promotion.

ตูมอนุมัติเริ่มรอบปิดงานตาม PLAN/WORK: ระบุของเก่าที่ไม่มีผู้ใช้ -> PLAN รับรายการ -> owner WORK ถอด consumer ที่จำเป็น -> Core WORK cleanup -> owner/main checks และ Project Control ปิดรอบ เป้าหมายรักษา V2/Creator และเลิกพึ่ง text-engine snapshot ชั่วคราว ไม่เพิ่ม R3 ในรอบนี้

การอนุมัติรอบนี้ไม่เปลี่ยนข้อเท็จจริงว่า 59 ไฟล์ที่หายยังไม่ใช่ชุด V1-only ที่พิสูจน์แล้ว และไม่ใช่คำสั่ง restore ทั้งชุดลง checkout เดิม ความจำเป็นที่จะคืนไฟล์ที่ยังใช้ต้องเสนอเป็นรายการชัดเจนก่อนลงมือ ไม่ปล่อยให้ตัดสินใจผิดเป็นข้อมูลสูญหาย

## Accepted baseline / unknowns

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

