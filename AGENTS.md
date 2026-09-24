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
- current Phase, Checklist target, and Evidence target;
- known risks, unknowns, and owner decisions.

Then read the owning repository's `AGENTS.md` before changing product behavior.
Use `docs/domains/flowdoc-system-map.md` only for verified product-wide truth.
If Project Control cannot resolve those fields, stop with:

```text
BLOCKER: FlowDoc Project Control unavailable or unresolved.
```

## Default context

Start with the generated Current Truth Snapshot, then the current Work packet,
then only its referenced current/supporting contracts and Evidence. The sole
current workflow authority is:

```text
docs/domains/flowdoc-workflow-economy-policy.md
```

Do not load historical documents, closed task conversations, old registries,
old branches/worktrees, unrelated Work trees, or unreferenced supporting
documents by default. Load history only for explicit audit, conflict, Evidence
recovery, or reconciliation.

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

A WORK has one authority: discovery, implementation, or verification. Discovery
and verification are read-only. Split discovery from implementation when the
finding can change architecture, ownership, contract, safety, or scope.

One PLAN task owns exactly one execution round. A new PLAN creates a fresh
version 3 execution context. Registry versions 1 and 2 and all closed PLAN/WORK
execution contexts are historical and read-only. Cross-PLAN ownership transfer
is not supported. Prior accepted commits, Evidence, and records may be immutable
input; old tasks must not be sent, waited, revised, resumed, or handed off.

When a real separate WORK room is used, automatic WORK-to-PLAN return,
retrievable locator, liveness, idempotent receipt, and PLAN-owned acceptance are
mandatory. PLAN does not patch a product repository after dispatch; product
repair returns to the same active WORK in the same round or becomes a fresh lane
in a new round.

This means mandatory WORK room return is an active WORK-to-PLAN return push,
not only a local final answer. PLAN tracks liveness; a silent room or missing
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
- For non-read-only work, use a dedicated worktree from `main` unless the user
  explicitly requests same-checkout maintenance.
- Commit and verify in the worktree, merge only after its gate passes, rerun the
  gate on `main`, then remove only clean merged current-round lanes.
- Never delete a dirty, unmerged, or unresolved lane.
- Regenerate projections with `npm run generate` after canonical record changes.
- A Work record is not Evidence; cite durable repository tests, files, commits,
  or contracts for strong claims.

Before claiming completion run:

```text
npm run check
```

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
