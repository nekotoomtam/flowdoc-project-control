# PLAN/WORK — ตรวจ Core ก่อน R3

## Authority Boundary

Project Control canonical coordination only; owner repo-project-control, active role planning-partner / project-control-steward. Work path: flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap. Phase: phase-creator-core-readiness-review. Checklist: checklist-creator-core-readiness-review. Evidence target: evidence-creator-core-readiness-review-2026-09-05. No product readiness or map promotion.

ตูมอนุมัติเริ่มตามแผน PLAN/WORK ในห้องนี้วันที่ 5 กันยายน 2026 โดยเริ่มตรวจ Core อ่านอย่างเดียวก่อน งานซ่อมและ R3 ต้องผ่านการกำหนดขอบเขตและตรวจรับจาก PLAN ก่อน

## Dispatch Set และ continuation registry

- dispatchSetId: dispatch-creator-core-readiness-2026-09-05
- PLAN task: 01a0707e-00e9-74e1-be1b-a272a1b89d2a
- roomRunId: room-core-readiness-01
- laneId: lane-core-readiness-review
- Work Type: lane-reconciliation
- Owner: repo-core
- parallelLimit: 1; เหตุผล: ยังไม่ทราบเจ้าของไฟล์ที่หายและผลกระทบ dependency จึงรับผลทีละห้อง
- laneDependencyGraph: core-readiness-review -> PLAN recovery decision -> owner repair if required -> Editor R3 contract review -> bounded R3 implementation
- Held: all repair/product editing, R3, Preview, Versions, publication, PDF
- State: prepared; retrievable WORK locator: pending creation; Context Acknowledgement: pending
- Automatic Return Channel: WORK actively calls mcp__codex_app__send_message_to_thread to PLAN task above
- Active Return Command: send_message_to_thread with threadId 01a0707e-00e9-74e1-be1b-a272a1b89d2a, hostId local, prompt containing Terminal Handoff
- handoffId / Return Event ID: handoff-core-readiness-2026-09-05-01
- Liveness Signal: real task status plus context acknowledgement/progress; lastHeartbeatAt: pending opening; livenessDeadline: 10 minutes after real task locator resolves
- Death Signal: task unavailable, terminal error or no response by deadline. Mark return-channel-failed before manual recovery; silence is never accepted.
- handoffInbox: empty; completionQueue: empty; arrivalSequence: pending; duplicates deduplicated by handoffId
- returnOrderPolicy: BLOCKER/FAIL/Contract Change Request first, then arrivalSequence; process one at a time
- acceptanceGate: expected owner/lane, context acknowledgement, automatic return, exact repository refs, no edits, inventory/recovery proposal and unknowns explicit
- revision state: none; any incomplete return goes back to same WORK locator

## WORK Context Capsule

Read Project Control AGENTS, Delivery Operating Model, PLAN Room Orchestration Rules, Work Type Routing Model, Lean Dispatch Operating Rules, owner Core AGENTS and flowdoc-creator-draft-first-delivery-2026-09-05.md. Read full governing documents where required. Execution scope is read-only lane-reconciliation, not Lean Dispatch.

Accepted observation to recheck: Core canonical checkout C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core at e3b9888b25fe963ef4316fe8066d086bae55db47 had 59 tracked deletions under packages/text-engine-rust-wasm. Editor gate used a separate Git-pinned dependency snapshot. Cause and deletion ownership remain UNKNOWN. FlowDocEditor is retired and not a dependency.

Allowed: inspect canonical Core tracked status, exact missing files, HEAD/index/history, source availability, junction metadata and narrowly relevant setup references. Inspect Editor dependency link metadata read-only when needed to describe Core consumer setup. Use git status --untracked-files=no to avoid large untracked backup scans. The fresh WORK worktree is a locator/isolation surface; it must not be mistaken for the affected canonical checkout.

Forbidden: restore, checkout files, reset, clean, delete, install, build, mutate links, edit product files or Project Control records, recursively traverse dependency junctions or backup trees, or infer cause from deletion count alone. Do not repair yet.

Return: PASS/FAIL/BLOCKER/RISK/UNKNOWN, exact HEAD and changed-file inventory, which files are recoverable from Git and whether working changes could be lost, evidence supporting or failing to support cause, smallest safe repair proposal with exact paths and owner, verification required after repair, commit none / files changed none, automatic return state and next PLAN action. First acknowledge scope, reading, evidence target, stop conditions and return command. Push terminal result actively to PLAN before/with local final; no user copy/paste.

## แผนหลังรับผล

PLAN ตรวจรับข้อเสนอและกำหนด lane ซ่อมให้ owner ที่ถูกต้อง หากต้องแก้ product จะส่ง WORK ทำพร้อม worktree/main gates หลังฐานพร้อมค่อยเปิด WORK Editor ตรวจ R3 แล้วแบ่ง sections -> fields -> Structure Patterns/Slots ตามสัญญาที่พิสูจน์ได้ ไม่ถือว่าข้อเสนอข้างต้นเป็นการอนุมัติแก้ทุก repo

## Registry event: queued
Creation returned client-new-thread:f0cba599-db78-45ae-a9e1-dd9ab218f96d on local. State queued; real locator pending. No acceptance or dependent dispatch allowed from clientThreadId alone.


## Registry event: real locator and acknowledgement

WORK task: 01a07122-1de9-7272-bd87-03d6f2d75793, host local; worktree C:/Users/nekot/.codex/worktrees/3084/flowdoc-vnext-core. State running. PLAN received active Context Acknowledgement through send_message_to_thread; reading completion remains pending terminal confirmation. Return Channel reachable; this acknowledgement is not terminal return or acceptance. lastHeartbeatAt 2026-09-05T10:35:00Z; livenessDeadline 2026-09-05T10:45:00Z. No dependent lane opened.


## Registry event: accepted read-only return (2026-09-05T10:40:31.267Z)

State returned -> accepted (read-only scope only). Active WORK push received handoff-core-readiness-2026-09-05-01 from expected real task before local final. Context Acknowledgement complete. handoffInbox staged; completionQueue arrivalSequence 1 processed; duplicate disposition none; queue now empty. acceptanceGate PASS for owner/lane/reading/locator/active return/exact inventory/no edits/unknowns preserved. Full preserved handoff: [Core readiness return](core-readiness-return-2026-09-05.md). Evidence evidence-creator-core-readiness-review-2026-09-05. No manual recovery. revision state none.

Next action: wait for explicit same-checkout maintenance exception for Core 59 missing-only restoration, as required by Project Control AGENTS worktree discipline. Existing approval starts the reviewed plan but did not expressly override that checkout rule. No repair performed and R3 remains held.

## User correction and revision 1

ตูมไม่อนุมัติการคืนไฟล์ และเสนอให้ลบส่วนที่เลิกใช้แล้วพร้อม commit เข้า main แทน PLAN จึงถือว่าคำขอ same-checkout recovery ไม่ได้รับอนุมัติ และไม่ดำเนินการ restore

Revision Packet 1 sent to same WORK task 01a07122-1de9-7272-bd87-03d6f2d75793. Scope remains read-only lane-reconciliation: inspect active consumers and distinguish dead references from runtime/build dependencies, missing 59 paths from whole 106-path package. No product edits authorized by this review packet. handoffId handoff-core-readiness-2026-09-05-02; automatic Return Channel unchanged. State running/revision-requested; livenessDeadline 10 minutes after revision dispatch. R3 remains held. Actual retirement implementation requires owner lane boundaries after review; user intent supports removal of unused parts, not an assumption that all current consumers are obsolete.

## Registry event: return 02 and revision 2

Automatic return handoff-core-readiness-2026-09-05-02 received from expected task; arrivalSequence 2, no duplicate/manual recovery; handoffInbox staged then processed. Accepted bounded source references only: Editor DEV-only Live Draft QA activates the package worker, package imports/declarations remain, Core tests consume missing artifacts/fixtures, whole-package retirement also touches PDF pilot/UAT. Exact returned evidence is retrievable in WORK task 01a07122-1de9-7272-bd87-03d6f2d75793. No product edits or repair performed. Deletion proposal remains needs-revision because no v1/v2 retirement boundary has been established.

ตูมชี้แจงว่าต้องการลบ Core เวอร์ชัน 1 ที่เลิกใช้ โดยรักษาเวอร์ชัน 2 ปัจจุบัน ไม่ใช่อนุมัติลบ text engine ทุกส่วน PLAN ส่ง Revision Packet 2 ให้ WORK เดิมตรวจประวัติการย้ายและความหมายของ v1/v2 จัดประเภท 59 ไฟล์และ dependency ก่อนเสนอขอบเขตลบ ห้ามเทียบชื่อ package, เลข protocol หรือ XR/MR กับเวอร์ชัน Core โดยไม่มีหลักฐาน

State running/revision-requested, revisionAttempt 2; handoffId handoff-core-readiness-2026-09-05-03; automatic Return Channel unchanged; livenessDeadline 10 minutes after revision dispatch. Context Acknowledgement received actively. R3 held. Recovery proposal superseded; no restore authorization. Only obsolete-v1 retirement intent is authorized; no current-v2 feature loss authorized.

## Registry event: return 03 — qualified V1/V2 boundary

Automatic handoff-core-readiness-2026-09-05-03 received from expected task; Context Acknowledgement complete; arrivalSequence 3; inbox processed, queue empty, no duplicate or manual recovery. PLAN accepts source-based classification only. revisionAttempt 2 complete; no product deletion accepted. Full exact path classification remains retrievable in WORK task 01a07122-1de9-7272-bd87-03d6f2d75793, return event 03.

Terminology disposition SPLIT: closest documented match is layout Root V1 -> Root V2, not a proven whole-Core v1/v2 switch. RootV2 uses V1-named kernels/contracts and current V2 test helpers invoke native range APIs in the missing crate. Package schema v2/document v3 is another version axis; *.v1.json and XR/MR labels are not Core generation identifiers.

59-path classification: 0 proven legacy-v1-only, 9 shared (README, package.json and seven rust-live-draft-engine files), 32 historical-evidence (26 fixtures plus six pkg bundle files), 18 UNKNOWN-generation retained QA artifact files (three pkg-live-draft groups). Historical-evidence remains consumed by current tests; UNKNOWN does not mean unused. None is approved for deletion from this review. Current-V2-exclusive count 0 does not imply V2 unaffected because shared native dependencies support V2 evidence.

Pinned evidence: Core e3b9888b25fe963ef4316fe8066d086bae55db47 src/index.ts retains RootV1 and RootV2 exports; src/layout/textBlockUnifiedLayoutRootV2.ts imports retained V1 internals; tests/helpers/textBlockUnifiedIncremental5b2.ts uses RootV2 plus package Node shaping/range APIs; package src/node.ts invokes the missing rust-live-draft-engine/Cargo.toml. PC docs/versions/V0_1_0a_1/core/live-draft/root-and-v3-transition-contracts.md explicitly excludes blanket RootV1/SceneV1 retirement.

Previously completed narrow retirements: bb59dd712c0b5cac2cd231755dffd3e529c2c19f removed textBlockInitialFlowTextOnlyAdapterV1 and its test; ed2a2b7a29065084aaa014cd8035cf7d2dc9ad85 removed textBlockSpatialIndexUpdateV1 wrapper and its test. Both are ancestors of current Core HEAD. Those removals do not authorize these 59 paths. Core layoutPublicSurfaceCleanupGuard.test.ts explicitly retains other V1 implementation files internally.

Next PLAN action: scope a bounded Core obsolete-layout reachability/retention audit to identify an exact v1-only deletion set while preserving V2 and shared dependencies. Do not expand to wholesale text-engine, QA or evidence retirement. Existing package absences remain unresolved separately; user has not authorized restoration. State accepted-read-only / product retirement blocked on exact scope. No current-v2-only product activation claim or map promotion.
