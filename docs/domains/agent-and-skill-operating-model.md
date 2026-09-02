# Agent and Skill Operating Model

## Purpose

This document defines the first Project Control operating model for FlowDoc
agents, reusable skills, and handoffs. It is a coordination contract, not an
implementation claim and not itself a generated Codex skill package.

Project Control should make agent work safer by keeping scope, ownership,
evidence, and remaining risk visible before work resumes in Core, Editor, or
Backend.

## Operating principles

- Project Control records shared truth, work coordination, documents, repository
  identities, and evidence indexes.
- Product repositories retain implementation ownership. Core owns document
  semantics, Editor owns product browser runtime and UI behavior, and Backend
  owns transport, revision gates, persistence, and service orchestration.
- A Work record never proves truth by itself. Strong claims require Evidence
  records that point to repository-owned files, tests, commits, or contracts.
- Agents should mark risk while inspecting, continue the full inspection unless
  blocked, and return to decisions only after the scan is complete.
- Broad work should move in phases with explicit handoffs instead of one large
  unreviewed change.

## Documentation authority boundary

Project Control remains the canonical home for FlowDoc-wide shared
understanding, including cross-repository status, Work paths, Phase state,
Checklist targets, Evidence targets, document authority, repository ownership,
product terminology, and map-truth boundaries.

Product-repository Markdown can remain when it is code-adjacent,
repository-owned, or historical, but it must not become a second source of
FlowDoc-wide truth. Surviving repo-local Markdown should carry an Authority
Boundary that names the owner repository, local scope, what it does not prove,
and the governing Project Control document or Work item.

Do not write product-repository `docs/superpowers/plans` or
`docs/superpowers/specs` files for FlowDoc-wide truth. Use Project Control
Work, Phase, Checklist, and Evidence targets for shared plans and cleanup
decisions. Agent role revisions for documentation cleanup are now captured in
`docs/domains/flowdoc-agent-documentation-authority-operating-rules.md`; use
that document's Markdown Authority Pre-Action Gate and role overlays before any
future FlowDoc Markdown work.

## Delivery room model

FlowDoc delivery planning now uses
`docs/domains/flowdoc-delivery-operating-model.md` as the Project Control
contract for PLAN rooms, real WORK rooms, lane cards, Kickoff Packets, handoff
rules, Contract Change Requests, and Project Control versus generated SQLite
authority.

Multi-room delivery planning now uses
`docs/domains/flowdoc-plan-room-orchestration-rules.md` as the Project Control
contract for PLAN Room Orchestration Rules. A PLAN room must use those rules
before choosing `N WORK rooms`, setting `parallelLimit`, opening a dispatch
set, tracking Room Run Registry entries, requiring automatic WORK-to-PLAN
return, using manual recovery fallback for missed returns, processing
`handoffInbox` and `completionQueue`, or accepting returned lane results.

Work-type delivery routing now uses
`docs/domains/flowdoc-work-type-routing-model.md` as the Project Control
contract for assigning Work Type to lanes, writing Context Capsules, requiring
Context Acknowledgement, choosing reusable skill candidates, and reviewing
returned handoffs by the correct output shape. The same model requires
mandatory WORK room return, liveness tracking, silent room handling, and
terminal return status of PASS / FAIL / BLOCKER / RISK / UNKNOWN so the PLAN
room can continue without guessing when a room fails, blocks, or disappears.

Automatic WORK-to-PLAN return is mandatory. A WORK room's Return Channel must
send the Terminal Handoff to PLAN or a PLAN-owned monitor without requiring
`ตูม` to copy/paste Terminal Handoffs. It must not require `ตูม` to copy/paste
Terminal Handoffs. Automatic return means an active WORK-to-PLAN return push,
not only a final answer inside the WORK room. A Kickoff Packet must give the
WORK room the PLAN task/chat ID, Return Event ID or handoff ID, and Active
Return Command; when Codex thread tools expose `send_message_to_thread`, the
WORK room uses that command to send the Terminal Handoff to PLAN before or
with its local final answer. `clientThreadId` alone is not a monitorable
retrievable locator; until PLAN resolves a real task/chat ID or other
monitorable locator, the room run remains queued or `needs-attention` and PLAN
must not open a scalable multi-WORK dispatch set from it. If PLAN later
recovers the result by task, thread, session, worktree, branch, or handoff
location, record `return-channel-failed-then-recovered` or `manual-recovered`;
that recovery does not satisfy automatic return. A manual recovery fallback may
preserve work after a missed Return Channel, but it must be recorded as
`manual-recovered` or `return-channel-failed` and does not satisfy automatic
return. PLAN must be able to hold multiple active WORK rooms, enqueue
close-together returns in `completionQueue`, preserve `returnOrderPolicy` and
`arrivalSequence`, treat a duplicate handoff idempotently, and process one
queued handoff at a time through `acceptanceGate`.

A PLAN room coordinates one or more delivery rounds. A WORK room is a real
separate Codex task/chat visible to the user and executes exactly one approved
lane. It is not the same thing as an internal subagent. WORK rooms must not
redefine delivery scope, role authority, source-of-truth rules, or
cross-repository contracts; they should return RISK, UNKNOWN, BLOCKED, or a
Contract Change Request to the PLAN room when scope changes are needed.

PLAN-owned reporting keeps Project Control truth separate from product WORK.
Product WORK rooms return evidence candidate handoffs and must not self-promote
their own result into Project Control truth, map truth, accepted lane status,
or round status. PLAN receives the handoff through the mandatory automatic
Return Channel, stages it in `handoffInbox`, runs `acceptanceGate`, and then
writes Project Control records itself or delegates that reporting to a Project
Control records lane. PLAN may pull by retrievable locator only to recover or
classify a failed Return Channel; that manual recovery fallback does not
satisfy automatic return.

When returned work is incomplete but still inside the original lane, PLAN marks
the room `needs-revision` and sends a Revision Packet back to the same WORK
room when the original retrievable locator remains usable. That packet must
name `revisionAttempt`, exact acceptance gaps, allowed repair scope,
still-forbidden scope, required verification, Return Channel, Liveness Signal,
Death Signal, and any Contract Change Request requirement. The same WORK room
may repair only the original lane.

## Packaged local skills

### flowdoc-project-control

The first local Codex skill package for FlowDoc is installed at
`C:\Users\nekot\.codex\skills\flowdoc-project-control\SKILL.md`.

Trigger: any FlowDoc, Project Control, Core, Backend, Editor, document map,
evidence, Work record, product terminology, or `flowdoc-*` repository work.

Output: the agent reads Project Control first, identifies Work path, owner
repository, active role, current Phase, Checklist target, Evidence target,
known risks, and unknown state, and applies the Markdown Authority Pre-Action
Gate before any FlowDoc Markdown work.

Stop conditions: Project Control is unavailable or unresolved, the skill would
conflict with Project Control AGENTS.md, a generic planning path would place
FlowDoc-wide truth in a product repository, the owner repository is ambiguous,
or the work would promote product truth without Evidence.

Validation: Project Control record
`docs/domains/flowdoc-project-control-skill-installation-2026-09-01.md`
captures structural skill validation and bounded pressure validation against
the generic `docs/superpowers/plans` default.

## Project Control GUI orientation

Project Control GUI work must classify the surface as Overview, History, or
Detail before implementation.

- Overview is the repo or area entry surface. It should show repository or area
  headings first and keep Work, Project Control Node, Evidence, and Checklist
  detail behind selection.
- History is the time-ordered record surface. It should show what has been
  recorded over time and return the user to the focused Overview for the
  related repository or area.
- Detail is the inspection surface for full Work, Project Control Node,
  Evidence, Checklist, document, risk, or unknown records.

Agents must do this classification before changing the GUI or agent-facing
Project Control docs. Agents must not treat History as Evidence; in short, do
not treat History as Evidence. They must not promote Overview or History
wording into system truth until implementation, verification, and Project
Control records support the bounded claim.

### Current GUI implementation

As of `doc-project-control-overview-history-gui-2026-08-29`, the first bounded
Project Control GUI implementation supports the Overview and History split.

Agents entering the GUI should start at `Repo Directory Overview` for broad
orientation. Use `Work History View` only when the user asks what happened over
time, which Work records exist, or where a previous recorded item belongs in
the map. A History row should return to the focused Overview for the related
repository or area; it should not open full Detail by default and should not be
used as Evidence.

Do not restore a raw Work tree to Home when changing Project Control GUI
behavior. Keep full Work, Project Control Node, Evidence, Checklist, document,
risk, and unknown detail behind selection unless a later approved decision and
Evidence record supersede this boundary.

When Project Control GUI navigation or orientation changes, the same round must
update the agent-facing documents that future rooms read, including this
operating model, the global Codex guidance when relevant, and any glossary
terms that changed. If those updates are intentionally deferred, the handoff
must report a `RISK`.

## Project roles

### Project Control steward

Maintains Project Control records, generated indexes, roadmap Work, repository
registry entries, and document metadata. This role may update canonical
Project Control files but must not mutate product repositories while recording
truth.

### Evidence reviewer

Checks whether a claimed state is supported by durable evidence. This role
looks for exact repository IDs, commits, paths, tests, and verification
summaries. It should downgrade unsupported claims to unknown, risk, or planned
instead of treating work status as proof.

### Lane reconciliation reviewer

Reviews old worktrees and lane branches before cleanup. This role identifies
unique commits, checks whether their patches are already represented in main,
records retained value or discard rationale, and removes only the reviewed
worktree checkouts.

### Cross-repo boundary reviewer

Keeps Core, Editor, and Backend responsibilities separate. This role checks for
direct imports, copied semantics, bypassed revision gates, local-only shortcuts
that look like product truth, and activation claims that outrun documented
gates.

### Documentation synthesizer

Turns repository-owned source documents into bounded Project Control documents.
This role preserves authority limits, references source commits, avoids
promotion of parent nodes without evidence, and keeps migration or cleanup
claims separate from summary writing.

### Product implementation agent

Works in the owning product repository after Project Control has identified the
lane, scope, and evidence target. This role follows the product repository
working agreement and returns checks, changed behavior, risks left, and
intentionally unchanged boundaries.

## Reusable skill candidates

Reusable skills should be written only after their workflow has been repeated
enough to prove the trigger, scope, inputs, outputs, and stop conditions.

The Work Type Routing Model is the first routing layer before packaged skills.
It lets the PLAN room classify a lane as `planning-coordination`,
`product-implementation`, `evidence-review`, `documentation-authority`,
`ux-design-exploration`, or `lane-reconciliation`, then put the needed
instructions into the Context Capsule. A Work Type can point toward a skill
candidate, but it does not create a packaged Codex skill by itself.

### FlowDoc repository health audit

Trigger: before resuming broad FlowDoc product development.

Inputs: Project Control repository registry, local checkout paths, each
repository working agreement, and available check commands.

Output: repository status, check results, dirty-file risks, boundary risks,
unknowns, and recommended next work blocks.

Stop conditions: missing checkout, unavailable required dependency, dirty
tracked changes that affect the requested scope, or an external service that is
required for the check.

### FlowDoc lane reconciliation

Trigger: when Project Control lists old worktrees or lane branches that need
review before cleanup.

Inputs: `git worktree list`, branch names, unique commits, patch-equivalence
checks, and related Project Control Work records.

Output: retained/discarded decision for each lane, cleanup actions taken, branch
refs intentionally retained or removed, and any follow-up record update.

Stop conditions: dirty worktree, non-equivalent unique patch, conflict with
main, or unclear owner decision.

### FlowDoc evidence registration

Trigger: when a node is ready to move toward current truth.

Inputs: exact repository ID, 40-character commit, tested path or contract ID,
verification summary, node ID, and supporting document references.

Output: Evidence record, document or node links, regenerated index, and check
result.

Stop conditions: unverified commit, missing path, ambiguous owner repository,
or a claim that belongs in a product repository first.

### FlowDoc documentation synthesis

Trigger: when source documents from a product repository need bounded Project
Control publication.

Inputs: source inventory, family map, source commit, reviewed family boundary,
and migration/publication intent.

Output: bounded versioned Markdown, document records, evidence records when
available, tests that protect authority wording, and generated index updates.

Stop conditions: source authority is unknown, migration coverage is incomplete
but being represented as closed, or cleanup is implied before separate review.

### FlowDoc boundary review

Trigger: before cross-repo integration or when a local shortcut may become
product behavior.

Inputs: Core, Editor, Backend working agreements, cross-repo operating map,
imports, service routes, adapters, and tests for touched boundaries.

Output: PASS, FAIL/BLOCKER, RISK, UNKNOWN, files changed, behavior changed,
tests run, risks left, and intentionally not changed.

Stop conditions: responsibility conflict, missing product decision, bypassed
Backend revision gate, direct Core internals in Editor, or copied Core
operation semantics in Backend.

### Project Control GUI orientation update

Trigger: before changing the Project Control GUI layout, navigation, Overview,
History, or Detail behavior.

Inputs: Project Control read model, Project Control GUI tests, current GUI
screenshots when available, `docs/domains/project-control-repo-first-overview-history-2026-08-28.md`,
this operating model, global Codex guidance, glossary records, and the related
Work, Phase, Checklist, and Evidence targets.

Output: a bounded GUI or documentation change that preserves the Overview,
History, and Detail split, updates agent-facing guidance when navigation rules
change, and reports which surface changed.

Stop conditions: the change would mix raw Work, Project Control Node, Evidence,
and Checklist lists into the Home Overview; History would be used as Evidence;
or the agent-facing docs would become stale after a navigation rule change.

## Handoff format

Broad FlowDoc work should end with:

- PASS: what is verified and by which command or evidence.
- FAIL / BLOCKER: what prevents continuation.
- RISK: known hazards that did not block the current phase.
- UNKNOWN: what remains unverified.
- Files changed: grouped by repository.
- Behavior changed: user-facing or contract-facing effects.
- Tests run: command and result.
- Risks left: what should be scheduled next.
- Intentionally not changed: boundaries preserved by design.

## Current status

This document establishes a draft operating model for the in-progress
`agent-and-skill-design` work. The documentation authority operating rules are
registered in
`docs/domains/flowdoc-agent-documentation-authority-operating-rules.md`, and
the first local Codex skill package `flowdoc-project-control` is recorded in
`docs/domains/flowdoc-project-control-skill-installation-2026-09-01.md`.
Broader specialized skills for repository health audit, lane reconciliation,
evidence registration, documentation synthesis, boundary review, and Project
Control GUI orientation remain candidates for later phases. Bounded validation
does not prove future agent compliance outside this machine, future Codex skill
routing, or all possible prompt pressure cases.
