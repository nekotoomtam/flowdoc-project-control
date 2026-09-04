# FlowDoc Editor Build Preview Usability Dispatch Registry

## Authority Boundary

This document is the PLAN-owned Room Run Registry note for `dispatch-editor-build-preview-usability-v0-2026-09-04-01`.

It records WORK room locators, automatic return state, liveness state, and acceptance boundaries for the next Structure Pattern Build and Preview usability dispatch. It does not edit Core, Backend, or Editor behavior and does not prove Build readiness, Preview readiness, Publish readiness, API readiness, PDF readiness, FlowDoc product truth, or map truth.

## Dispatch Set

- Dispatch set ID: `dispatch-editor-build-preview-usability-v0-2026-09-04-01`
- PLAN task/chat ID: `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- `parallelLimit`: `3`
- Return order policy: process returned handoffs by `completionQueue.arrivalSequence`
- Active Return Command: `send_message_to_thread` back to PLAN task/chat ID `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- Liveness policy: `clientThreadId` alone is not a monitorable retrievable locator. A worktree locator may prove a room exists, but the room remains `needs-terminal-return` until PLAN receives a terminal handoff or explicitly records recovery/failure.
- Acceptance policy: PLAN stages every returned handoff in `handoffInbox`, queues it in `completionQueue`, and runs `acceptanceGate` one handoff at a time. PLAN must not repair WORK output itself; `needs-revision` goes back to the same WORK room when the original locator remains usable.
- Completion queue:
  - `arrivalSequence: 1`: `handoff-backend-document-structure-gateway-probe-2026-09-04-01`
  - Pending: `handoff-editor-build-surface-creator-usability-2026-09-04-01`
  - Pending: `handoff-editor-preview-entry-simulation-contract-2026-09-04-01`

## Room Run Registry

### room-editor-build-surface-creator-usability-2026-09-04-01

- Status: `needs-terminal-return`
- Lane ID: `lane-editor-build-surface-creator-usability`
- Work Type: `product-implementation`
- Owner repository: `repo-editor`
- Active role: `product-implementation-agent`
- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-structure-pattern-build-preview-integration-v0 > lane-editor-build-surface-creator-usability`
- Codex task/chat ID: unresolved
- Initial client locator: `client-new-thread:466055b5-ac7f-4e09-b749-84daf8c2f86a`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\e698\FlowDocEditor`
- Branch locator: `codex/editor-build-surface-creator-usability`
- Locator discovery method: Git worktree list after `create_thread` returned only `clientThreadId`
- Context Acknowledgement status: unknown
- Expected return handoff ID: `handoff-editor-build-surface-creator-usability-2026-09-04-01`
- Evidence target: `evidence-editor-build-surface-creator-usability-2026-09-04`
- Automatic return status: pending
- Terminal status: pending
- Last observed state: branch still at base commit `65ab5b149c5aad10b36bbaa23650b9fce7070dff`; no changed files observed.
- Next PLAN action: wait for automatic terminal return or classify the missing return before accepting, revising, recovering, or opening dependent lanes.

### room-editor-preview-entry-simulation-contract-2026-09-04-01

- Status: `needs-terminal-return`
- Lane ID: `lane-editor-preview-entry-simulation-contract`
- Work Type: `product-implementation`
- Owner repository: `repo-editor`
- Active role: `product-implementation-agent`
- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-structure-pattern-build-preview-integration-v0 > lane-editor-preview-entry-simulation-contract`
- Codex task/chat ID: unresolved
- Initial client locator: `client-new-thread:0f116be2-678a-4c59-991e-df9eb7973222`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\91c3\FlowDocEditor`
- Branch locator: `codex/editor-preview-entry-simulation-contract`
- Locator discovery method: Git worktree list after `create_thread` returned only `clientThreadId`
- Context Acknowledgement status: unknown
- Expected return handoff ID: `handoff-editor-preview-entry-simulation-contract-2026-09-04-01`
- Evidence target: `evidence-editor-preview-entry-simulation-contract-2026-09-04`
- Automatic return status: pending
- Terminal status: pending
- Last observed state: uncommitted change observed in `src/app/editor/_components/__tests__/structurePatternWorkflow.test.ts`; no terminal handoff or accepted commit yet.
- Next PLAN action: wait for automatic terminal return or classify the missing return before accepting, revising, recovering, or opening dependent lanes.

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

## Required Next PLAN Handling

PLAN must not open dependent Editor Preview, Publish, API, or PDF lanes from the two Editor rooms until their terminal handoffs pass `acceptanceGate`.

If either Editor room returns incomplete output, wrong scope, missing tests, or product changes that fail verification, PLAN sends a Revision Packet back to the same WORK room when the original locator remains usable. PLAN must not patch Editor product files itself.

Manual recovery may use task ID, worktree, branch, commit, or session locator only to recover or classify a missed automatic return. Manual recovery does not satisfy automatic return.

## Intentionally Not Changed

- No Core, Backend, Editor, or Project Control product behavior changed by this registry note.
- No Editor Build surface result accepted yet.
- No Editor Preview simulation result accepted yet.
- No Backend implementation lane opened from the probe.
- No runtime submission, generated PDF file, user permission, workflow, billing, activity feed, dataset, or external API behavior added.
- No Build readiness, Preview readiness, Publish readiness, API readiness, PDF readiness, FlowDoc product truth, or map truth promoted.
