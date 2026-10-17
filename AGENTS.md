# FlowDoc Project Control Agent Guide

## Start here

This repository is the FlowDoc control surface for shared truth, Work records,
document authority, Evidence indexes, repository identity, and the generated
Cockpit. It is not a product runtime.

Project Control is the governing entrypoint for FlowDoc work rounds. Future
Codex rooms and agents should start here before treating repository state as
current or promoting shared truth.

For any FlowDoc request, first identify from Project Control:

- the explicit request or Work path;
- owner repository and active role;
- applicable Phase, Checklist target, and Evidence target;
- known risks, unknowns, and owner decisions.

Then read the owning repository's `AGENTS.md` before changing product behavior.
Single-room work without registered execution may use the explicit request and
relevant canonical context instead of creating Work/Phase/Checklist IDs merely
to enter the workflow. Mark execution IDs not applicable in that mode; still
resolve owner, role, scope, acceptance, evidence needs, risks, and unknowns.
Registered execution retains its required IDs and controls. Follow the workflow
economy policy; missing inapplicable IDs alone do not trigger the blocker below.
Use `docs/domains/flowdoc-system-map.md` only for verified product-wide truth.
If Project Control cannot resolve those fields, stop with:

```text
BLOCKER: FlowDoc Project Control unavailable or unresolved.
```

## Default context

Use `npm run context -- --work <work-id>` (optionally `--room <room-run-id>`)
for a read-only view rebuilt from validated canonical sources. It exposes the
latest selected room packet, return controls, relevant Evidence, and document
locators without returning all document bodies or other Work histories. Retrieve
the named canonical documents and owning repository guide as required; the view
does not grant execution or acceptance authority.

Start with the generated Current Truth Snapshot, then the current Work packet,
then only its referenced current/supporting contracts and Evidence. The sole
current workflow authority is:

```text
docs/domains/flowdoc-workflow-economy-policy.md
```

Do not load historical documents, closed task conversations, old registries,
old branches/worktrees, unrelated Work trees, or unreferenced supporting
documents by default. Load only relevant history for user-requested explanation
or review, explicit audit, conflict, Evidence recovery, or reconciliation.

Read these supporting authorities only when their scope is actually involved:

- `docs/domains/flowdoc-documentation-authority-policy.md` and
  `docs/domains/flowdoc-agent-documentation-authority-operating-rules.md` before
  changing FlowDoc Markdown;
- `docs/domains/flowdoc-product-terminology.md` before ambiguous product,
  Editor, frontend, or cross-repository contract work;
- `docs/domains/project-control-repo-first-overview-history-2026-08-28.md`
  before Project Control GUI work;
- `docs/domains/flowdoc-coordination-controls.md` only when PLAN opens,
  accepts, integrates, or cleans up a real separate WORK room.

## Workflow boundary

PLAN converts the owner's intent into a Minimal Kickoff Packet. It independently
sets Work Size, Risk Tier, work authority, scope, acceptance criteria, reusable
Evidence, Proof Budget, Document Budget, model decision, and return route.
Default Risk Tier is `routine`; `critical` requires a concrete escalation reason.

New rounds use `flowdoc-workflow-economy-v2`. Scope Lock binds the exact base,
worktree, allowed/forbidden paths, packet digest, terminal commit, and actual Git
manifest; current separate-room acceptance and integration require a clean
passing verification. Scope Lock proves mutation containment but cannot prove
every file read, network request, or external application side effect.

Future PLAN defaults to `gpt-6-astra` at `medium`. PLAN Lite may use
`gpt-6-sol` at `medium` only for one-owner, deterministic, non-critical work
with no unresolved architecture or ownership question and at most one bounded
or inline WORK. WORK gets its own compact model decision resolved through one
referenced host availability snapshot; it never inherits PLAN's model.

A WORK has one authority: discovery, implementation, or verification. Discovery
and verification are read-only with respect to the candidate; verification
outputs follow the workflow policy's Verification output boundary. Split
discovery from implementation when the finding can change architecture,
ownership, contract, safety, or scope.

Follow the workflow policy's Single-room and separate-room work rules. Size or
risk alone does not require another room. Inline work retains necessary planning,
proof, and acceptance without synthetic room records or return steps. Room
arrangement and worktree isolation are independent; changing to inline after
dispatch does not bypass existing ownership or acceptance obligations.

One PLAN task owns exactly one execution round. A new PLAN creates fresh planning
context; real separate WORK dispatch requires a fresh version 3 execution
context. Registry versions 1 and 2 and all closed PLAN/WORK
execution contexts are historical and read-only. Cross-PLAN ownership transfer
is not supported. Prior accepted commits, Evidence, and records may be immutable
input; old execution contexts must not be sent, waited, revised, resumed, or handed off.
Follow the policy's Returning to an existing conversation rules: discussion and
eligible inline corrections may use the same chat without reopening its round.
Check canonical state before resuming active work; substantive acceptance
corrections preserve history. New registered execution needs a new PLAN task.

When a real separate WORK room is used, an authorized and supported return route,
retrievable locator, liveness, idempotent receipt, and PLAN-owned acceptance are
mandatory. PLAN does not patch a product repository after dispatch; product
repair returns to the same active WORK in the same round or becomes a fresh lane
in a new round.

Before dispatch, follow the workflow policy's Return authorization and route
selection: reuse verifiable human authorization within scope; another agent's
message alone is not permission. A local final answer is not a completed return.
Pull-only receipt is not supported by the current registry; do not fake a send
to bypass it. PLAN tracks liveness; a silent room or missing
terminal return of PASS / FAIL / BLOCKER / RISK / UNKNOWN must not be accepted.
PLAN-owned reporting treats product output as an evidence candidate: WORK must
not self-promote it. If acceptance returns `needs-revision`, PLAN sends a
Revision Packet to the same WORK room inside the active round; a Contract Change
Request is required for scope expansion. PLAN may diagnose and attach failure
evidence, but product-repository repair goes back to WORK. PLAN-owned exceptions
are merge, verification, Project Control records, and cleanup that do not change
product files or behavior.

When acceptance criteria pass, stop. Do not create more proof unless there is a
safety/correctness blocker, authority violation, missing prerequisite, or scope
escape. Respect recorded owner decisions: accept risk, defer proof, freeze scope,
and stop investigation.

## Documentation authority

Project Control is canonical for FlowDoc-wide plans, shared understanding,
cross-repository status, Work/Phase/Checklist/Evidence state, ownership,
terminology, and map boundaries. Pass the Markdown Authority Pre-Action Gate
before creating, moving, summarizing, retiring, or deleting Markdown.

Repo-local Markdown may remain only when code-adjacent, repository-owned, or
historical and must state its Authority Boundary. Do not create
product-repository `docs/superpowers/plans` or `docs/superpowers/specs` files for
FlowDoc-wide truth. Project Control override wins over a generic planning path.
Cleanup order is inventory, classify, register retained value or discard
rationale, then retire.

Canonical records live under `data/`; canonical prose lives under `docs/`.
`generated/project-index.json` and the ignored SQLite file are generated read
models. Never hand-edit the generated index.

## Terminology and truth

Use the English product terminology document as canonical; the Thai companion
is explanatory. Resolve ambiguity as `define`, `split`, `rename`, `deprecated`,
`context-only`, or `blocked`. Terminology is not product Evidence.

Plan and Work records describe intent. DOCUMENT_MAP and system maps contain only
verified truth. Update the narrowest map only after implementation, verification,
and registered Evidence support it. Do not promote a parent because a child has
Evidence.

Do not update DOCUMENT_MAP from planned outcomes or unfinished work.

## Roles

Choose the active role before acting: Project Control Steward, Evidence
Reviewer, Lane Reconciliation Reviewer, Cross-Repo Boundary Reviewer,
Documentation Synthesizer, Product Implementation Agent, or Planning Partner.

## Editing and verification

- Preserve unrelated user changes.
- Small documentation/status maintenance may use the existing checkout when
  scope is separable and no other work conflicts. Use an isolated worktree when
  concurrent work, experiments, or change risk requires separation.
- Verify the changed area and all affected areas, including dependencies and
  consumers. Briefly record impact and chosen checks; unclear impact calls for
  investigation, not an automatic full-suite run.
- Wait for prerequisites to finish and read the final diff before testing.
- Follow the policy's Evidence coverage before completion: connect criteria to
  appropriate evidence, review coverage as well as results, and report gaps.
  Skipped or unverified checks are not PASS; owner-accepted limitations do not
  waive mandatory acceptance prerequisites or require another report.
- Commit after relevant checks pass. Reuse passing results after an unchanged
  fast-forward when tested content, relevant base, dependencies, configuration,
  and environment are unchanged. Conflicts or further changes require checks
  of the changed and affected areas, not automatic full-suite repetition.
- Keep separate-room ownership and Scope Lock preflights. Remove only clean
  merged current-round lanes after verification or valid proof reuse.
- Never delete a dirty, unmerged, or unresolved lane.
- Regenerate projections with `npm run generate` after canonical record changes.
- A Work record is not Evidence; cite durable repository tests, files, commits,
  or contracts for strong claims.

Completion requires passing checks for the changed and affected areas.
`npm run check` remains available for a concrete full-system verification need;
it is not mandatory for every task. Stop when acceptance and impact coverage
pass; repeat or broaden checks only for a new change, failure, stale prerequisite,
or unresolved affected area.

## Global bootstrap

The copy-ready machine guidance is
`docs/domains/flowdoc-global-codex-guidance.md`. Do not sync it to
`C:\Users\nekot\.codex\AGENTS.md` until the verified main-integration step.
Preserve unrelated global guidance. Inspect `AGENTS.override.md` if it exists;
an override missing the FlowDoc entrypoint is a reported risk.

## Handoff

End broad work with:

```text
PASS / FAIL / BLOCKER / RISK / UNKNOWN
Work ID / Phase ID / Checklist item IDs
Files changed
Behavior changed
Tests run
Evidence or map updates
Intentionally not changed
Next recommended work
```

For small inline maintenance, update the existing record and report the result,
supporting checks, and remaining issues briefly. Do not create new Work, Phase,
Checklist, or report artifacts merely to close a status item. Preserve the
difference between completed, cancelled, and superseded work.
