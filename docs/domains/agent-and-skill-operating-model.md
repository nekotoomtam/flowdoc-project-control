# Agent and Skill Operating Model

## Purpose

This document defines the first Project Control operating model for FlowDoc
agents, reusable skills, and handoffs. It is a coordination contract, not an
implementation claim and not a generated Codex skill package.

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

This document establishes a draft operating model for the queued
`agent-and-skill-design` work. It does not complete that Work item, create
Codex skill files, or define required evidence for roadmap Work. Required
Evidence should be added later after the user approves the evidence target for
each Work record.
