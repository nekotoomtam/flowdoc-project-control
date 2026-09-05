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

