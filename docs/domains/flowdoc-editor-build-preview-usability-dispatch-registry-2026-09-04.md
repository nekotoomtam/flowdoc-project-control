# FlowDoc Editor Build Preview Usability Dispatch Registry

## Authority Boundary

This document is the PLAN-owned Room Run Registry and acceptance note for `dispatch-editor-build-preview-usability-v0-2026-09-04-01`.

It records WORK room locators, automatic returns, liveness state, `completionQueue` arrival order, `acceptanceGate` outcomes, same-room revision handling, and the final Editor main integration gate for the next Structure Pattern Build and Preview usability dispatch. It does not edit Core, Backend, or Editor behavior and does not prove full Build readiness, Preview readiness, Publish readiness, API readiness, PDF readiness, FlowDoc product truth, or map truth.

## Dispatch Set

- Dispatch set ID: `dispatch-editor-build-preview-usability-v0-2026-09-04-01`
- PLAN task/chat ID: `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- `parallelLimit`: `3`
- Return order policy: process returned handoffs by `completionQueue.arrivalSequence`
- Active Return Command: `send_message_to_thread` back to PLAN task/chat ID `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- Liveness policy: `clientThreadId` alone is not a monitorable retrievable locator. A worktree locator may prove a room exists, but the room remains `needs-terminal-return` until PLAN receives a terminal handoff or explicitly records recovery/failure.
- Acceptance policy: PLAN stages every returned handoff in `handoffInbox`, queues it in `completionQueue`, and runs `acceptanceGate` one handoff at a time. PLAN must not repair WORK output itself; `needs-revision` goes back to the same WORK room when the original locator remains usable.
- Completion queue:
  - `arrivalSequence: 1`: `handoff-backend-document-structure-gateway-probe-2026-09-04-01` accepted as read-only context.
  - `arrivalSequence: 2`: `handoff-editor-preview-entry-simulation-contract-2026-09-04-01` returned PASS, then PLAN integration smoke found a duplicate accessible-label regression and sent same-room revision.
  - `arrivalSequence: 3`: `handoff-editor-build-surface-creator-usability-2026-09-04-01` accepted.
  - `arrivalSequence: 4`: `handoff-editor-preview-entry-simulation-contract-2026-09-04-01-r1` accepted after revision.

## Room Run Registry

### room-editor-build-surface-creator-usability-2026-09-04-01

- Status: `accepted`
- Lane ID: `lane-editor-build-surface-creator-usability`
- Work Type: `product-implementation`
- Owner repository: `repo-editor`
- Active role: `product-implementation-agent`
- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-structure-pattern-build-preview-integration-v0 > lane-editor-build-surface-creator-usability`
- Codex task/chat ID: `01a06c2b-3211-7621-9ba8-ff9eb5021dcc`
- Initial client locator: `client-new-thread:466055b5-ac7f-4e09-b749-84daf8c2f86a`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\e698\FlowDocEditor`
- Branch locator: `codex/editor-build-surface-creator-usability`
- Locator discovery method: Git worktree list plus transcript lookup after `create_thread` returned only `clientThreadId`
- Context Acknowledgement status: completed
- Return handoff ID: `handoff-editor-build-surface-creator-usability-2026-09-04-01`
- Evidence target: `evidence-editor-build-surface-creator-usability-2026-09-04`
- Automatic return status: `automatic-returned`
- Terminal status: `PASS`
- Arrival sequence: `3`
- Accepted Editor lane commit: `78dbae50e234487e64c58eae5480d8a8f1c16f97`
- Accepted changed paths: `src/app/editor/_components/AddPanel.tsx`; `src/app/editor/_components/EditorShell.tsx`; `src/app/editor/_components/FieldPalette.tsx`; `src/app/editor/_components/__tests__/structurePatternWorkflow.test.ts`; `src/app/editor/_components/shell/EditorLeftRail.tsx`
- Accepted behavior: Build Add rail now carries visible authoring focus for Document, Fields, and Structure Patterns; Fields authoring surfaces field definitions first; Structure Patterns authoring surfaces the Structure Pattern Slot affordance first; the center document-like canvas and Preview separation remain intact.
- PLAN verification: `npm run review:gate` passed on the lane worktree with Core package tests 54 files / 837 passed / 6 skipped, app tests 129 files / 1157 passed, and production build passed.
- WORK verification included: baseline `npm run review:gate`, focused RED/GREEN workflow test, `npm run type-check`, `npm run review:gate`, and `npm run smoke:editor`.
- Intentionally not changed: no Preview Entry simulation, no persistent slot creation, no Backend/Core/Project Control edits, no runtime submitted values, no API, and no PDF behavior.

### room-editor-preview-entry-simulation-contract-2026-09-04-01

- Status: `accepted-after-revision`
- Lane ID: `lane-editor-preview-entry-simulation-contract`
- Work Type: `product-implementation`
- Owner repository: `repo-editor`
- Active role: `product-implementation-agent`
- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-structure-pattern-build-preview-integration-v0 > lane-editor-preview-entry-simulation-contract`
- Codex task/chat ID: `01a06c2b-322a-7b43-85a7-ef732195b723`
- Initial client locator: `client-new-thread:0f116be2-678a-4c59-991e-df9eb7973222`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\91c3\FlowDocEditor`
- Branch locator: `codex/editor-preview-entry-simulation-contract`
- Locator discovery method: Git worktree list plus automatic return handoff after `create_thread` returned only `clientThreadId`
- Context Acknowledgement status: completed
- First return handoff ID: `handoff-editor-preview-entry-simulation-contract-2026-09-04-01`
- First returned commit: `3ac90724a5dd6ea92f1d7a9cde11dfb19fa0b48c`
- First acceptance decision: `needs-revision`
- Revision Packet: `revision-editor-preview-entry-simulation-contract-2026-09-04-01`
- Revised return handoff ID: `handoff-editor-preview-entry-simulation-contract-2026-09-04-01-r1`
- `revisionAttempt`: `1`
- Evidence target: `evidence-editor-preview-entry-simulation-contract-2026-09-04`
- Automatic return status: `automatic-returned`
- Terminal status: `PASS`
- Arrival sequence: first handoff `2`, revised handoff `4`
- Accepted Editor lane commit: `76e32076a6588fb48def07daaf08825c41afa334`
- Accepted changed paths: `src/app/editor/_components/FillingPanel.tsx`; `src/app/editor/_components/__tests__/structurePatternWorkflow.test.ts`
- Accepted behavior: Preview renders slot-scoped temporary Structure Pattern Entry simulation; entry values stay local to Preview; repeat controls clamp to the slot policy; Preview entry input accessible names no longer collide with ordinary document field labels such as `Customer name`.
- PLAN revision reason: the first accepted-looking Preview handoff passed static gates, but integration `npm run smoke:editor` failed because `getByLabel(/Customer name/)` resolved to both a document field input and a Preview entry input.
- PLAN verification after revision: integration-r1 `npm run review:gate` and `npm run smoke:editor` passed after merging the revised Preview commit with the accepted Build commit.
- WORK verification after revision included: focused RED duplicate-label regression, focused GREEN 1 file / 6 tests, `npm.cmd run type-check`, post-commit `npm.cmd run review:gate`, post-commit `npm.cmd run smoke:editor`, and `git diff --check HEAD`.
- Intentionally not changed: no Build authoring behavior, no Backend/Core/Project Control edits, no durable Editor schema for authored Structure Pattern Slots, no runtime Structure Pattern Entry persistence, no submitted values, no API, and no PDF behavior.

### room-backend-document-structure-gateway-probe-2026-09-04-01

- Status: `accepted-readonly-context`
- Lane ID: `lane-backend-document-structure-gateway-probe`
- Work Type: `evidence-review`
- Owner repository: `repo-backend`
- Active role: `evidence-reviewer`
- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-structure-pattern-build-preview-integration-v0 > lane-backend-document-structure-gateway-probe`
- Codex task/chat ID: `01a06c2b-3230-7c40-9ca7-2f827328c2ee`
- Initial client locator: `client-new-thread:7b177161-5005-4809-98f1-18849bb388c8`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\1044\flowdoc-vnext-backend`
- Commit locator: `9da58214e087d2f15afd43855bfd1febec882037`
- Context Acknowledgement status: completed
- Return handoff ID: `handoff-backend-document-structure-gateway-probe-2026-09-04-01`
- Evidence target: `evidence-backend-document-structure-gateway-probe-2026-09-04`
- Automatic return status: `automatic-returned`
- Terminal status: `PASS / RISK`
- Arrival sequence: `1`
- Product files changed: none
- Product behavior changed: none
- PLAN acceptance boundary: accepted only as read-only Backend context for missing document-structure HTTP gateway/API work.
- Key returned risk: WORK could not run Backend tests because dependencies were unavailable in the probe worktree, so the return is source-inspection context plus prior accepted evidence, not fresh product verification.
- Next PLAN action: use this only to shape a future Backend implementation lane such as `lane-backend-document-structure-http-boundary-v0`; do not treat it as Backend behavior implemented.

## Integration Gate Result

`acceptanceGate` result: `accepted` after one same-room Preview revision.

PLAN first merged the accepted Build commit and the first Preview commit in a temporary integration worktree. The merge itself succeeded, but `npm run smoke:editor` failed with a duplicate accessible-label strict-mode violation for `Customer name`. PLAN did not patch Editor product files. PLAN sent `revision-editor-preview-entry-simulation-contract-2026-09-04-01` back to the same Preview WORK room.

The revised Preview room returned `handoff-editor-preview-entry-simulation-contract-2026-09-04-01-r1` with commit `76e32076a6588fb48def07daaf08825c41afa334`. PLAN then created integration-r1 from Editor `main`, merged Build commit `78dbae50e234487e64c58eae5480d8a8f1c16f97` and revised Preview commit `76e32076a6588fb48def07daaf08825c41afa334`, and verified the combined result.

Accepted Editor main commit after integration: `715dd2e7edf0e7a3592ab7ff7e55cced361c836a`.

PLAN did not patch Core, Backend, or Editor product files after dispatch. PLAN-owned product-repository work was limited to automatic merges, verification, and main ref integration.

## Verification

Build lane:

- PLAN command: `npm run review:gate`
- PLAN result: type-check passed; Core package tests 54 files / 837 passed / 6 skipped; app tests 129 files / 1157 passed; production build passed.

Preview lane after r1 revision:

- WORK result: focused GREEN 1 file / 6 tests, `npm.cmd run type-check` passed, `npm.cmd run review:gate` passed, `npm.cmd run smoke:editor` passed.
- PLAN integration-r1 result: `npm run review:gate` passed with Core package tests 54 files / 837 passed / 6 skipped, app tests 129 files / 1160 passed, and production build passed.
- PLAN integration-r1 browser smoke: `npm run smoke:editor` passed.

Editor main after integration:

- Command: `npm run review:gate`
- Result: type-check passed; Core package tests 54 files / 837 passed / 6 skipped; app tests 129 files / 1160 passed; production build passed.
- Command: `npm run smoke:editor`
- Result: passed.

Project Control registry:

- Command: `npx vitest run tests/flowdoc-editor-build-preview-usability-dispatch-registry.test.ts --maxWorkers=1`
- Result: passed before final acceptance edits.
- Command: `npm run check:fast`
- Result: data validation, type-check, and records tests passed before final acceptance edits.
- Final Project Control gate target: `npm run check`.

## PLAN Decision

PLAN accepts the dispatch set as a bounded Editor Build/Preview usability continuation plus a read-only Backend gateway context probe.

Accepted product commits:

- Editor Build lane: `78dbae50e234487e64c58eae5480d8a8f1c16f97`
- Editor Preview lane after r1 revision: `76e32076a6588fb48def07daaf08825c41afa334`
- Editor main integration: `715dd2e7edf0e7a3592ab7ff7e55cced361c836a`
- Backend read-only context commit inspected: `9da58214e087d2f15afd43855bfd1febec882037`

Accepted bounded behavior:

- Build Add rail routes creator focus for Document, Fields, and Structure Patterns.
- Structure Patterns authoring prioritizes Structure Pattern Slot affordance without naming or creating runtime Structure Pattern Entries.
- Preview creates temporary Structure Pattern Entry simulation from field-derived slot context.
- Preview entry accessible labels do not collide with ordinary document field labels.
- Backend current source context still lacks document-structure HTTP gateway/API exposure; this is context for a later Backend implementation lane, not accepted implementation.

This record does not promote FlowDoc product truth or map truth. It does not prove runtime submission persistence, submitted value storage, HTTP gateway exposure, generated PDF files, renderer jobs, artifact storage, permission behavior, workflow, billing, audit, activity, integrations, deployment, production database migration, published API readiness, release readiness, full frontend readiness, or product readiness.

## Required Next PLAN Handling

The next high-value lane is `lane-backend-document-structure-http-boundary-v0`, because Editor Build and Preview now have a usable local shape but still cannot save/read/freeze/publish document structure through a bounded Backend gateway.

Preview/browser smoke remains a required acceptance check for future Preview changes that add or rename field inputs, because broad label lookup caught a real collision that static tests did not catch initially.

Manual recovery may use task ID, worktree, branch, commit, or session locator only to recover or classify a missed automatic return. Manual recovery does not satisfy automatic return.

## Intentionally Not Changed

- No Core behavior changed in this dispatch.
- No Backend behavior changed in this dispatch.
- No Project Control product behavior changed by this registry note.
- No runtime submission, generated PDF file, user permission, workflow, billing, activity feed, dataset, or external API behavior added.
- No persistent Structure Pattern Entry storage added.
- No durable Editor schema for authored Structure Pattern Slots added.
- No Build readiness, Preview readiness, Publish readiness, API readiness, PDF readiness, FlowDoc product truth, or map truth promoted.
