# FlowDoc Frontend Continuation Dispatch Registry

## Authority Boundary

This document is the PLAN-owned Room Run Registry note for `dispatch-frontend-continuation-2026-09-03-01`.

It records WORK room locators, automatic returns, `completionQueue` arrival order, and PLAN acceptance outcomes for returning from the accepted frontend roadmap plan into the next lane split. It does not edit Core, Backend, or Editor behavior and does not prove frontend readiness, Preview readiness, Publish readiness, WYSIWYG readiness, FlowDoc product truth, or map truth.

## Dispatch Set

- Dispatch set ID: `dispatch-frontend-continuation-2026-09-03-01`
- PLAN task/chat ID: `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- `parallelLimit`: `2`
- Return order policy: process returned handoffs by `completionQueue.arrivalSequence`
- Active Return Command: `send_message_to_thread` back to PLAN task/chat ID `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- Liveness policy: treat missing automatic return, unresolved task ID, or silent room state as `needs-attention`, `RISK`, `UNKNOWN`, `returned-silent`, or `return-channel-failed` before manual recovery.
- Acceptance policy: PLAN stages every returned handoff in `handoffInbox`, queues it in `completionQueue`, and runs `acceptanceGate` one handoff at a time. PLAN must not repair WORK output itself; `needs-revision` goes back to the same WORK room when the original locator remains usable.
- Completion queue:
  - `arrivalSequence: 1`: `handoff-preview-confidence-probe-2026-09-03-01`
  - `arrivalSequence: 2`: `handoff-design-selected-region-command-affordance-cleanup-2026-09-03-01`

## Room Run Registry

### room-design-selected-region-cleanup-2026-09-03-01

- Status: `accepted`
- Lane ID: `lane-design-selected-region-command-affordance-cleanup`
- Work Type: `product-implementation` plus `ux-design-exploration`
- Owner repository: `repo-editor`
- Active role: `product-implementation-agent`
- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-design-workspace-usability > lane-design-selected-region-command-affordance-cleanup`
- Codex task/chat ID: `01a06786-74da-73e2-a852-64e9c7351aef`
- Initial client locator: `client-new-thread:d74a80b7-0797-4f81-bdd6-599f4a46fe54`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\e543\FlowDocEditor`
- Locator discovery method: `session_index.jsonl` plus Git worktree list after `create_thread` returned only `clientThreadId`
- Context Acknowledgement status: completed
- Return handoff ID: `handoff-design-selected-region-command-affordance-cleanup-2026-09-03-01`
- Evidence target: `evidence-editor-design-selected-region-command-affordance-cleanup-2026-09-03`
- Automatic return status: `automatic-returned`
- Terminal status: `PASS`
- Arrival sequence: `2`
- Accepted Editor commit: `cb3c1ca4e35973c3bd4f89d969826911e109e55c`
- Accepted changed paths: `src/app/editor/_components/shell/EditorSelectedRegionCommands.tsx`; `src/app/editor/_components/shell/EditorTopToolbar.tsx`; `src/app/editor/_components/__tests__/EditorTopToolbar.test.ts`
- PLAN acceptance document: `docs/domains/flowdoc-design-selected-region-command-affordance-acceptance-2026-09-03.md`
- Last observed state: task idle after terminal return; PLAN acceptance passed after owner-repository verification.
- Next PLAN action: use the accepted selected-region command summary as bounded Editor evidence only; do not open dependent Preview or Publish lanes from it.

### room-preview-confidence-probe-2026-09-03-01

- Status: `accepted`
- Lane ID: `lane-preview-confidence-probe`
- Work Type: `evidence-review` plus `planning-coordination`
- Owner repository: `repo-project-control` for the probe; product repositories remain read-only
- Active role: `evidence-reviewer` with `planning-partner` responsibility
- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > lane-preview-confidence-probe`
- Codex task/chat ID: `01a06786-7d05-7be3-b939-8ff6e7917e61`
- Initial client locator: `client-new-thread:edf48cb6-c459-408c-97de-1e7395b11283`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\758f\flowdoc-project-control`
- Locator discovery method: `session_index.jsonl` plus Git worktree list after `create_thread` returned only `clientThreadId`
- Context Acknowledgement status: completed
- Return handoff ID: `handoff-preview-confidence-probe-2026-09-03-01`
- Evidence target: `evidence-flowdoc-preview-confidence-probe-2026-09-03`
- Automatic return status: `automatic-returned`
- Terminal status: `PASS / RISK / UNKNOWN`
- Arrival sequence: `1`
- Product files changed: none
- Product behavior changed: none
- PLAN acceptance document: `docs/domains/flowdoc-preview-confidence-probe-2026-09-03.md`
- Last observed state: task returned a no-edit planning/evidence-review probe and remained bounded to Preview vocabulary, evidence gaps, and the next validation lane.
- Next PLAN action: open `lane-preview-confidence-validation` with `parallelLimit: 1` before any Preview readiness claim.

## Required Next PLAN Handling

PLAN must not open dependent lanes from either room until the returned handoff passes `acceptanceGate`.

If both rooms return close together, PLAN assigns arrival order and processes one handoff at a time. A duplicate handoff ID is idempotent. Manual recovery may use task ID, worktree, branch, or session locator only to recover or classify a missed automatic return; it does not satisfy automatic return.

For this dispatch set, both rooms returned through the automatic Return Channel and both passed `acceptanceGate`. The Preview probe is accepted only as no-edit planning and evidence-review context. The selected-region command affordance cleanup is accepted only as bounded Editor UI evidence at commit `cb3c1ca4e35973c3bd4f89d969826911e109e55c`.

## Intentionally Not Changed

- No Core, Backend, Editor, or Project Control product behavior changed by this registry note.
- No Preview implementation opened from this registry note.
- No Publish implementation opened from this registry note.
- No Progressive Authoring implementation opened from this registry note.
- No frontend readiness, Preview readiness, Publish readiness, WYSIWYG readiness, FlowDoc product truth, or map truth promoted.
