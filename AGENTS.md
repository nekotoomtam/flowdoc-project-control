# FlowDoc Project Control Agent Guide

## Start here

This repository is the FlowDoc control surface. It records shared truth, work
coordination, document metadata, repository identities, and evidence indexes.
It is not the product runtime and must not become the place where Core, Editor,
or Backend behavior is implemented.

Project Control is the governing entrypoint for FlowDoc work rounds. Future
Codex rooms and agents should start here before treating any FlowDoc repository
state as current, deciding an owner repository, promoting map truth, or planning
cross-repository work.

If a FlowDoc request starts in another repository or chat, first route through
this repository's Project Control records unless the user explicitly limits the
turn to local-only inspection. Use Project Control to identify the Work item or
Work path, owner repository, active role, current Phase, Checklist target,
Evidence target, known risks, and unknown state; then read the owning product
repository's `AGENTS.md` before editing product behavior.

Before taking broad work, read these files in order:

1. `docs/domains/flowdoc-system-map.md`
2. `docs/domains/document-map-operating-rules.md`
3. `docs/domains/flowdoc-role-catalog.md`
4. `docs/domains/agent-and-skill-operating-model.md`
5. `docs/domains/flowdoc-round-workflow.md`
6. `docs/domains/flowdoc-delivery-operating-model.md`
7. `docs/domains/flowdoc-plan-room-orchestration-rules.md`
8. `docs/domains/flowdoc-work-type-routing-model.md`
9. `docs/domains/work-tree-operating-rules.md`
10. `docs/domains/project-control.md`
11. `docs/domains/flowdoc-documentation-authority-policy.md`
12. `docs/domains/flowdoc-agent-documentation-authority-operating-rules.md`
13. `docs/domains/flowdoc-product-terminology.md`
14. `docs/domains/flowdoc-product-terminology-th.md`

For FlowDoc delivery planning, opened rooms, lane splitting, Kickoff Packets,
or handoff work, use the Delivery Operating Model. For any PLAN room that may
dispatch more than one WORK room, read the PLAN Room Orchestration Rules before
opening or accepting rooms. Read the FlowDoc Work Type Routing Model before a
PLAN room assigns lane Work Types, writes Context Capsules, expects Context
Acknowledgement, chooses skill candidates, or accepts a returned lane by Work
Type. Automatic WORK-to-PLAN return is mandatory: the Return Channel must send
the terminal handoff back to PLAN or a PLAN-owned monitor without requiring
`ตูม` to copy/paste Terminal Handoffs. It must not require `ตูม` to copy/paste
Terminal Handoffs. A manual recovery fallback may use a task ID, thread ID,
worktree, branch, or handoff locator only to recover or classify a missed
return; it must be recorded as `manual-recovered` or `return-channel-failed`
and does not satisfy automatic return. A WORK room has
mandatory WORK room return and liveness obligations: silence, lost room state,
or a missing terminal return of PASS / FAIL / BLOCKER / RISK / UNKNOWN must
not be accepted. Keep this room distinction explicit: PLAN room coordinates;
WORK room is a real separate Codex task/chat that executes one approved lane.

PLAN rooms must be able to hold multiple active WORK rooms. The Room Run
Registry must record each active room, `completionQueue` must accept returns
that arrive close together, `returnOrderPolicy` and `arrivalSequence` must
preserve processing order, duplicate handoff returns must be idempotent, and
PLAN must process one queued handoff at a time through `acceptanceGate`.

PLAN-owned reporting keeps product WORK output from self-promoting into Project
Control truth. Core, Backend, and Editor WORK rooms return evidence candidate
handoffs and must not self-promote Project Control truth, map truth, accepted
lane status, or round status. PLAN receives the handoff through the mandatory
automatic Return Channel, stages it in `handoffInbox`, runs `acceptanceGate`,
and writes Project Control records itself or delegates that reporting after
acceptance. PLAN may pull by retrievable locator only to recover or classify a
room whose Return Channel failed; that recovery must not hide the automatic
return gap. If acceptance returns `needs-revision`, PLAN sends a Revision
Packet back to the same WORK room when the original retrievable locator is
usable; the packet preserves the original lane boundary and names any Contract
Change Request requirement.

For Editor, frontend, product behavior, cross-repository contract work, or any
term that could mean different things across Project Control, Core, Backend, or
Editor, apply the product terminology discipline before implementation. Use the
qualified canonical term or classify the ambiguity as `define`, `split`,
`rename`, `deprecated`, `context-only`, or `blocked`. Terminology records do not
promote FlowDoc product truth by themselves.

## Documentation authority

Project Control is the canonical home for FlowDoc-wide shared understanding:
cross-repository status, Work paths, Phase state, Checklist targets, Evidence
targets, document authority, repository ownership, product terminology, and
map-truth boundaries.

Before creating, updating, migrating, summarizing, or deleting FlowDoc
Markdown, read
`docs/domains/flowdoc-agent-documentation-authority-operating-rules.md` and
pass its Markdown Authority Pre-Action Gate. If a generic planning skill says
to write a FlowDoc-wide plan or spec into a product repository, Project Control
override wins.

Repo-local Markdown may remain only when it is code-adjacent,
repository-owned, or historical. Every repo-local Markdown file that survives
cleanup must carry an Authority Boundary naming the owner repository, narrow
scope, what it does not prove, and the governing Project Control document or
Work item.

Do not create product-repository `docs/superpowers/plans` or
`docs/superpowers/specs` files for FlowDoc-wide truth. Put shared or
cross-repository plans in Project Control Work, Phase, Checklist, and Evidence
targets first. Repository-local plans or specs are allowed only for bounded
repo-owned implementation and must not claim FlowDoc-wide status.

Cleanup order is inventory, classify, summarize or register in Project
Control, then retire. Do not delete repo-local Markdown until retained value,
source evidence, or discard rationale has been recorded.

Use `generated/project-index.json` only as the generated read model. Use
`generated/project-control.sqlite` only as an ignored local projection.
Canonical records live under `data/` and canonical prose lives under `docs/`.

## Global bootstrap

The copy-ready global Codex guidance for this machine lives at
`docs/domains/flowdoc-global-codex-guidance.md`. If
`C:\Users\nekot\.codex\AGENTS.md` is missing or empty during Project Control
maintenance, copy that file into `C:\Users\nekot\.codex\AGENTS.md` so future
FlowDoc rooms route through Project Control first. If the global file already
contains other user guidance, preserve it and add or update only the bounded
FlowDoc section.

If `C:\Users\nekot\.codex\AGENTS.override.md` exists, inspect it before broad
FlowDoc work. It can take precedence over the base global file; if it does not
include the FlowDoc entrypoint rule, report the risk before editing FlowDoc
repositories.

## First decision

Choose the active role before acting:

- Project Control Steward: maintain records, documents, generated index, and
  GUI-facing truth.
- Evidence Reviewer: check whether a claim has durable repository evidence.
- Lane Reconciliation Reviewer: review old worktrees or lane branches before
  cleanup.
- Cross-Repo Boundary Reviewer: keep Project Control, Core, Editor, and Backend
  ownership separate.
- Documentation Synthesizer: publish bounded summaries from reviewed source
  material.
- Product Implementation Agent: work in the owning product repository after
  scope and evidence target are clear.
- Planning Partner: turn broad intent into staged, verifiable work.

If the task touches product behavior, identify the owning repository first and
read that repository's `AGENTS.md` before editing there.

## Plan versus truth

Plan / Work records intent. It can describe what this round is trying to do,
which tasks exist, and what evidence should be produced.

DOCUMENT_MAP records verified system truth. Do not update DOCUMENT_MAP or a
system map with planned outcomes, expected behavior, or unfinished work. Update
the narrowest map only after implementation, verification, and Project Control
document/evidence registration support the new state.

For product-wide inventory, use `docs/domains/flowdoc-system-map.md`. For Core
release-line documentation, use
`docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`.

## Editing rules

- Preserve unrelated user changes in the working tree.
- For any non-read-only FlowDoc work that may edit files, create a dedicated
  worktree from `main` before implementation unless the user explicitly
  instructs same-checkout maintenance.
- Keep `main` as the clean integration target. Commit and verify the work in
  the worktree first; merge back to `main` only after the worktree gate passes.
- After merging to `main`, run the required verification on `main`, then remove
  the completed worktree and merged branch. Do not leave stale lanes behind.
- Do not delete a dirty worktree, an unmerged branch, or a lane with unique
  patches that are not understood; switch to Lane Reconciliation Reviewer and
  report the blocker instead.
- Edit canonical sources under `data/` and `docs/`; regenerate
  `generated/project-index.json` and the ignored local SQLite projection with
  `npm run generate`.
- Do not hand-edit `generated/project-index.json`.
- A Work record is not evidence. Strong claims require Evidence records or
  clearly cited repository-owned tests, files, commits, or contracts.
- Do not promote parent nodes because a child node has evidence.
- Mark risks while inspecting, continue the full scan unless blocked, and make
  decisions after the scan is complete.

## Verification

Use focused checks while developing and run the full Project Control gate before
claiming completion:

```text
npm run check
```

If a product repository was touched, also report that repository's relevant
checks. Do not claim PASS without fresh verification output.

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

Call out whether a map changed, which map changed, what supports the change,
which planned items intentionally stayed out of the map, and which system
states remain unknown.
