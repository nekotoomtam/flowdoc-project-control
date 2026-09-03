# FlowDoc Frontend Continuation Dispatch Registry

## Authority Boundary

This document is the PLAN-owned Room Run Registry note for `dispatch-frontend-continuation-2026-09-03-01`.

It records active WORK room locators for returning from the accepted frontend roadmap plan into the next lane split. It does not accept any WORK room output, does not edit Core, Backend, or Editor behavior, does not change the drafted frontend lane plan, and does not prove frontend readiness, Preview readiness, Publish readiness, WYSIWYG readiness, FlowDoc product truth, or map truth.

## Dispatch Set

- Dispatch set ID: `dispatch-frontend-continuation-2026-09-03-01`
- PLAN task/chat ID: `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- `parallelLimit`: `2`
- Return order policy: process returned handoffs by `completionQueue.arrivalSequence`
- Active Return Command: `send_message_to_thread` back to PLAN task/chat ID `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- Liveness policy: treat missing automatic return, unresolved task ID, or silent room state as `needs-attention`, `RISK`, `UNKNOWN`, `returned-silent`, or `return-channel-failed` before manual recovery.
- Acceptance policy: PLAN stages every returned handoff in `handoffInbox`, queues it in `completionQueue`, and runs `acceptanceGate` one handoff at a time. PLAN must not repair WORK output itself; `needs-revision` goes back to the same WORK room when the original locator remains usable.

## Room Run Registry

### room-design-selected-region-cleanup-2026-09-03-01

- Status: `running`
- Lane ID: `lane-design-selected-region-command-affordance-cleanup`
- Work Type: `product-implementation` plus `ux-design-exploration`
- Owner repository: `repo-editor`
- Active role: `product-implementation-agent`
- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-design-workspace-usability > lane-design-selected-region-command-affordance-cleanup`
- Codex task/chat ID: `01a06786-74da-73e2-a852-64e9c7351aef`
- Initial client locator: `client-new-thread:d74a80b7-0797-4f81-bdd6-599f4a46fe54`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\e543\FlowDocEditor`
- Locator discovery method: `session_index.jsonl` plus Git worktree list after `create_thread` returned only `clientThreadId`
- Context Acknowledgement status: pending WORK response
- Return handoff ID: `handoff-design-selected-region-command-affordance-cleanup-2026-09-03-01`
- Evidence target candidate: `evidence-editor-design-selected-region-command-affordance-cleanup-2026-09-03`
- Last observed state: task metadata exists; automatic Terminal Handoff not yet received by PLAN
- Next PLAN action: wait for automatic return; if incomplete, send a Revision Packet to the same WORK room.

### room-preview-confidence-probe-2026-09-03-01

- Status: `running`
- Lane ID: `lane-preview-confidence-probe`
- Work Type: `evidence-review` plus `planning-coordination`
- Owner repository: `repo-project-control` for the probe; product repositories remain read-only
- Active role: `evidence-reviewer` with `planning-partner` responsibility
- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > lane-preview-confidence-probe`
- Codex task/chat ID: `01a06786-7d05-7be3-b939-8ff6e7917e61`
- Initial client locator: `client-new-thread:edf48cb6-c459-408c-97de-1e7395b11283`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\758f\flowdoc-project-control`
- Locator discovery method: `session_index.jsonl` plus Git worktree list after `create_thread` returned only `clientThreadId`
- Context Acknowledgement status: pending WORK response
- Return handoff ID: `handoff-preview-confidence-probe-2026-09-03-01`
- Evidence target candidate: `evidence-flowdoc-preview-confidence-probe-2026-09-03`
- Last observed state: task metadata exists; automatic Terminal Handoff not yet received by PLAN
- Next PLAN action: wait for automatic return; if the probe edits files or self-promotes truth, send a Revision Packet to the same WORK room or reject the handoff.

## Required Next PLAN Handling

PLAN must not open dependent lanes from either room until the returned handoff passes `acceptanceGate`.

If both rooms return close together, PLAN assigns arrival order and processes one handoff at a time. A duplicate handoff ID is idempotent. Manual recovery may use task ID, worktree, branch, or session locator only to recover or classify a missed automatic return; it does not satisfy automatic return.

## Intentionally Not Changed

- No Core, Backend, Editor, or Project Control product behavior changed by this registry note.
- No Preview implementation opened from this registry note.
- No Publish implementation opened from this registry note.
- No Progressive Authoring implementation opened from this registry note.
- No frontend readiness, Preview readiness, Publish readiness, WYSIWYG readiness, FlowDoc product truth, or map truth promoted.
