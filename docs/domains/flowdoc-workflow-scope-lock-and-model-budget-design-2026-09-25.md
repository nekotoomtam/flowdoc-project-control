# FlowDoc Workflow Scope Lock and Model Budget Design

- Date: 2026-09-25
- Status: proposed design awaiting owner review
- Context class: supporting
- Owner repository: `repo-project-control`

## Authority Boundary

This document is a Project Control design proposal for strengthening the
current FlowDoc workflow economy authority. It defines the intended behavior
of Scope Lock Enforcement v1 and a smaller Model Budget policy before an
implementation plan is written.

This document is not current workflow authority, does not supersede
`docs/domains/flowdoc-workflow-economy-policy.md`, and does not authorize schema,
runtime, product-repository, global guidance, or map changes. The existing
workflow economy policy and coordination controls remain authoritative until a
separate approved implementation passes its gates and is promoted.

This design does not prove Core, Backend, Editor, release, compatibility,
security, performance, or product map truth.

## Planning Context

- Work path: `workflow-economy-clean-cutover`, used only as accepted immutable
  input; its closed PLAN/WORK execution contexts are not reactivated.
- Current round: a fresh Project Control-only design review in this task.
- Active roles: Planning Partner and Project Control Steward, with the
  Documentation Authority Steward overlay.
- Design target: constrain PLAN and WORK behavior before optimizing model use.
- Review target: owner review of this single design document.
- Reused Evidence:
  `evidence-flowdoc-workflow-economy-clean-cutover-2026-09-23` establishes the
  current version 3 workflow baseline at its pinned revision.
- Future Evidence target: behavior tests for actual Git scope computation,
  acceptance rejection, integration identity, model-decision validation, and
  legacy version 3 readability. This proposal is not Evidence.
- Known risk: the current validator checks the `changedFiles` list returned by
  WORK, but does not independently prove that the list equals the actual Git
  state of the returned worktree.
- Known limit: the current host does not expose a durable audit of every file
  read by an agent, so v1 cannot honestly prove a read allowlist.

## Outcome

The workflow should enforce this rule:

> An agent may discover a fact beyond its scope, but it may not act beyond its
> scope. Every mutation and every acceptance claim must map to the immutable
> packet. Otherwise WORK returns a classified unknown or a Contract Change
> Request and stops that action.

The enforcement must be mechanical at dispatch, return, acceptance, and
integration. Prompt wording remains useful guidance, but it is not the control.
The design adds no gateway repository, no new proof layer, and no routine close
audit.

## Design Principles

1. Scope Lock is part of the Safety Kernel and applies to every Risk Tier. It
   is not optional Evidence, a Gate created from an unknown, or proof-budget
   expansion.
2. PLAN owns the packet, acceptance, and integration decision. WORK cannot
   expand its authority, scope, acceptance criteria, budget, model permission,
   or downstream obligation.
3. Enforcement uses actual repository state. WORK-reported file lists are
   candidate metadata, not authority.
4. A separate implementation WORK returns one exact commit from one
   retrievable worktree. Acceptance is bound to that commit and packet digest.
5. When acceptance criteria pass, stop. Scope enforcement must not create an
   `implementation -> audit -> rebaseline -> audit` loop.
6. Model choice is a bounded resource decision. It never weakens scope,
   acceptance, verification, or authority.

## Existing Foundation and Exact Gap

The current version 3 implementation already provides useful foundations:

- an immutable canonical packet digest;
- one work authority: `discovery`, `implementation`, or `verification`;
- allowed and forbidden scope fields;
- Proof Budget and Document Budget enforcement;
- rejection of reported changed files for read-only authorities;
- rejection of reported changed files outside allowed scope or inside
  forbidden scope;
- PLAN-owned handoff acceptance and stop-after-acceptance behavior; and
- a recorded model decision with an observed availability snapshot.

The remaining enforcement gap is narrow but important: the validator evaluates
the file list supplied in the completion report. A WORK can accidentally omit
a changed, deleted, renamed, staged, unstaged, or untracked path. The current
return therefore cannot by itself prove repository containment.

## Scope Lock Enforcement v1

### 1. Dispatch Lock

Before activation, PLAN validates and freezes one Minimal Kickoff Packet. The
packet must contain:

- PLAN task ID, round ID, room ID, owner repository, integration owner, and
  return route;
- base commit and retrievable worktree locator for separate implementation;
- exactly one work authority;
- normalized allowed scope and only the forbidden scope needed for safety;
- immutable acceptance criteria, Proof Budget, Document Budget, model
  decision, unknown dispositions, and escalation triggers; and
- the canonical packet digest.

Scope entries are repository-root-relative Git paths. They use `/` separators,
cannot be absolute, cannot contain `..`, and identify either an exact file or a
directory prefix. Matching is path-segment aware, not a raw string prefix.
Allowed and forbidden scope must not overlap. A malformed or overlapping packet
cannot activate.

Acceptance criteria keep their current ordered representation for
compatibility. Within the immutable packet, their stable references are
`AC-1`, `AC-2`, and so on. Reordering or rewriting them changes the packet
digest and invalidates the attempt.

### 2. Worktree Containment

A real separate implementation WORK uses a dedicated worktree created from the
packet's base commit. Discovery and verification WORK are read-only. PLAN must
not repair product files in a dispatched lane; in-scope repair returns to the
same active WORK in the same round, while scope expansion requires a Contract
Change Request.

Git hooks may provide early feedback, but hooks are not acceptance authority
because they may be absent or bypassed.

### 3. Actual Change Manifest

The scope verifier computes a canonical manifest from the returned locator and
base commit. It must include:

- committed candidate changes from base commit to returned `HEAD`;
- staged changes;
- unstaged changes;
- untracked, non-ignored paths;
- deletions; and
- both old and new paths for renames or copies.

The verifier uses NUL-delimited Git output so unusual filenames do not corrupt
the manifest. It rejects absolute paths, path traversal, an unexpected Git
root, and a worktree whose registered repository does not match the packet.
A dirty submodule is a changed path and is rejected unless that submodule path
is explicitly allowed and separately supported by the packet.

WORK may run the verifier before return for fast feedback. PLAN reruns it from
the registered locator and owns the authoritative result. The canonical
manifest is compared with the completion report; omission, addition, or path
normalization mismatch is an acceptance failure.

For a separate implementation lane, final acceptance requires a clean
worktree, an exact terminal commit, and no staged, unstaged, or untracked
non-ignored paths. Dirty-state detection still matters because it explains a
rejection and prevents unreturned work from being silently lost.

### 4. Authority and Scope Evaluation

The verifier applies these decisions in order:

1. `discovery` or `verification` with any actual change is rejected as
   `WORK_AUTHORITY_READ_ONLY`.
2. Any path in forbidden scope is rejected as `CHANGED_FILE_FORBIDDEN`.
3. Any path outside allowed scope is rejected as
   `CHANGED_FILE_OUTSIDE_SCOPE`.
4. Any difference between actual manifest and WORK-reported files is rejected
   as `CHANGE_MANIFEST_MISMATCH`.
5. Any changed terminal commit, base commit, owner repository, worktree
   locator, or packet digest is rejected as an identity mismatch.

The completion report associates proof with `AC-*` references. PLAN reviews
whether the behavior and proof actually satisfy those criteria. v1 can require
the references and validate their existence, but it must not pretend that path
matching mechanically proves semantic intent.

### 5. Acceptance Lock

PLAN cannot record `accepted` when any of the following is true:

- actual Git state violates allowed or forbidden scope;
- a read-only authority mutated the repository;
- the canonical and reported manifests differ;
- the worktree is dirty at final return;
- the exact commit, base, owner, locator, packet, round, or attempt differs;
- a blocking unknown remains;
- Proof Budget, Document Budget, or review-cycle limits are exceeded; or
- required tests or acceptance criteria are pending or failed.

A scope failure becomes `needs-revision: scope-violation`, never
accepted-with-warning. The same active WORK may remove only changes that it
created in its own lane. If ownership of a mixed or pre-existing change is
uncertain, preserve the lane and route it to reconciliation; PLAN must not patch
over the uncertainty.

### 6. Integration Lock

Only the exact commit accepted against the exact packet digest may enter the
integration turn. A changed `HEAD`, amended commit, new commit, or changed main
base invalidates the prior acceptance and requires the relevant checks to run
again. The integration owner verifies the candidate against current `main`,
merges it, runs the main gate, and only then performs authorized clean-lane
cleanup.

This repository remains the control surface. The design does not create a
central gateway repository in front of FlowDoc repositories.

### 7. Honest Enforcement Boundary

Scope Lock v1 proves repository mutation containment, packet identity, and
acceptance/integration binding for cooperating local Git worktrees. It does not
prove every file an agent read, every network request it made, or every
external side effect outside Git.

Default context remains Current Truth Snapshot -> packet -> referenced current
or supporting records. Historical and unrelated material stays out of default
context. A future v2 may enforce read or tool allowlists only if the host
provides a durable path sandbox or audit stream. Until then, unexpected required
reading or an external mutation target is a scope question returned to PLAN,
not a falsely certified pass.

## Model Budget Policy

### Purpose

PLAN chooses the least costly capability and effort that can reliably satisfy
the unchanged packet. Selection is based on actual host availability and
task-specific risk, not a permanent model ranking, token superstition, or the
PLAN room's own model.

Official OpenAI model-selection guidance currently describes Luna as efficient
for scoped work, Sol as an everyday model for work needing judgment, and Astra
as the strongest option for ambiguous or ambitious work. It also treats model
guidance as a starting point that should be evaluated on representative work:
<https://developers.openai.com/api/docs/guides/model-selection>.

Reasoning effort is selected independently. Official guidance characterizes
`medium` as a balanced default for planning, complex reasoning, and judgment;
`high` for harder reasoning; and `xhigh` or `max` as settings that require a
clear evaluation benefit:
<https://developers.openai.com/api/docs/guides/reasoning>.

### Capability Classes

The policy records a capability class first, then resolves it to an actual
model ID offered by the dispatch host:

- `fast`: focused, explicit, repeatable, readily checked work;
- `workhorse`: everyday implementation or research requiring judgment across
  known contracts; and
- `frontier`: unresolved architecture, ownership, cross-boundary reasoning,
  critical impact, or an ambitious multi-step deliverable.

At the observed host snapshot for this design, examples are
`gpt-6-luna`, `gpt-6-sol`, and `gpt-6-astra` respectively. These examples are
not permanent aliases. Host availability is the dispatch authority; public API
availability or pricing does not prove availability in this Codex host.

### Independent Inputs

PLAN evaluates these dimensions independently:

- Work Authority: discovery, implementation, or verification;
- Work Size: small or medium; large work is split before dispatch;
- Risk Tier: routine, bounded, or critical;
- uncertainty and missing context;
- failure impact and recoverability;
- clarity and determinism of acceptance; and
- number of repository or contract boundaries requiring simultaneous
  reasoning.

Risk does not automatically select the largest model, and size does not
automatically raise Risk Tier. A small irreversible migration may need frontier
reasoning; a medium mechanical inventory may remain fast or workhorse.

### Minimal Model Decision

Each packet records only:

- capability class;
- selected model ID and reasoning effort;
- a task-specific sufficiency reason;
- assessment of the next smaller available option;
- measurable escalation triggers; and
- a reference to one availability snapshot for the round.

The round snapshot records the host, observation time, and available
model/effort pairs once. WORK packets reference it instead of duplicating a
large list. Refresh it only when the host changes, the selected pair is
unavailable, or the recorded freshness trigger fires. Existing version 3
records with an inline availability list remain readable; no historical record
is rewritten.

Model choice creates no Evidence item and consumes no proof artifact. Its
reason belongs in the packet and its outcome belongs in directional governance
metrics.

### Reasoning Effort

- `low`: mechanical edits, extraction, or focused checks with deterministic
  acceptance.
- `medium`: normal planning, agentic coding, research, and work needing
  judgment. This is the default effort for PLAN and ordinary WORK unless a
  task-specific reason says otherwise.
- `high`: difficult debugging, data safety, concurrency, migrations, multiple
  plausible failure paths, or critical cross-boundary review.
- `xhigh`, `max`, or a host-specific higher setting such as `ultra`: never
  routine defaults; use only after a recorded trigger or representative
  evaluation shows a material benefit worth the added latency and token use.

### Escalation and De-escalation

On failure, PLAN first checks packet clarity, missing context, environment,
scope, acceptance criteria, and test reliability. Correct those causes before
blaming model capability.

If the same bounded reasoning limitation remains after two corrected attempts,
PLAN may move up one capability class, raise effort, or split the work. It
records the observed limitation and keeps acceptance unchanged. A new
architecture, authority, safety, or scope boundary may trigger immediate
reassessment rather than spending two knowingly invalid attempts.

After discovery resolves architecture or uncertainty, implementation and
verification should be reconsidered independently and may de-escalate. WORK
never inherits the PLAN model automatically.

## PLAN Model Rule

For future new PLAN rounds after this design is implemented and the compact
context path is ready:

- default PLAN: `gpt-6-astra` at `medium`;
- PLAN Lite: `gpt-6-sol` at `medium` only when all of the following hold:
  one owner repository, no unresolved architecture or ownership question, no
  critical risk or irreversible-data concern, at most one bounded or inline
  WORK, and deterministic acceptance;
- Astra `high`: only for a concrete critical or cross-repository conflict,
  conflicting Evidence, or a repeated reasoning failure after packet/context
  correction; and
- `xhigh`, `max`, or `ultra`: not a standing PLAN setting.

The owner decision for the current round is explicit: keep the current Sol
room. Do not reopen or switch rooms merely to change the PLAN model. The first
future PLAN pilot may use Astra medium after the scope/context controls are
ready, and its result should be compared directionally rather than assumed
better.

Recommended directional metrics are approximate tokens per WORK, documents
loaded, review or revision cycles, reopen/rebaseline frequency, scope escapes,
and acceptance quality. They are governance feedback, not a new proof Gate.

## Relationship to Workflow Economy

- Scope Lock is a Safety Kernel control, not an Evidence artifact, close audit,
  or automatically created Gate.
- Unknowns retain the four dispositions: blocking, accepted, deferred, and
  irrelevant.
- Owner decisions to accept risk, defer proof, freeze scope, or stop
  investigation remain authoritative within the Safety Kernel.
- Routine work still has no close audit. Bounded work may use an acceptance
  summary. Critical work may use only the authorized formal audit.
- A conservative fallback remains preferred to a new proof mechanism when it
  is correct and fits the performance budget.
- This design is the only new durable document in this review round.

## Future Implementation Boundary

After owner approval, a separate implementation plan may change only Project
Control-owned workflow surfaces needed to realize the design, expected to
include:

- `docs/domains/flowdoc-workflow-economy-policy.md` as the sole primary policy;
- `docs/domains/flowdoc-coordination-controls.md` only for separate-room
  transport and integration details;
- `src/model/workflow-economy.ts` and `src/model/coordination-v3.ts`;
- `schemas/project-control.schema.json`;
- a Project Control scope-verifier command or library that inspects the target
  Git worktree; and
- focused schema, lifecycle, scope, compatibility, and command tests.

The implementation must prefer updating those canonical surfaces over creating
another policy. It must preserve readability of existing version 3 records.
An additive compact availability-snapshot reference may coexist with the legacy
inline snapshot; history is not migrated merely for consistency.

The implementation must not change Core, Backend, Editor, product behavior,
product maps, or `DOCUMENT_MAP`. Global `AGENTS.md` or installed skill guidance
may be synchronized only after the Project Control main gate passes.

## Acceptance Criteria for the Future Implementation

1. Invalid, absolute, traversing, or overlapping scope cannot activate.
2. The packet digest binds scope, acceptance, budgets, model decision, and
   return identity.
3. Actual Git inspection detects committed, staged, unstaged, untracked,
   deleted, and renamed paths.
4. Omitting a real changed path from the WORK handoff is detected.
5. Discovery or verification with any repository mutation is rejected.
6. Exact allowed scope with a clean terminal commit can pass.
7. A scope violation cannot become accepted or merged.
8. Changing the accepted commit or packet invalidates acceptance.
9. Proof, document, review-cycle, and required-check violations remain
   rejected.
10. A compact model decision resolves against a fresh referenced host snapshot.
11. Existing version 3 records remain readable and valid.
12. Focused tests and the full Project Control `npm run check` gate pass.
13. No product repository, product behavior, or map changes are included.

## Deferred and Explicitly Unsupported in v1

- hard proof of every file read, pending host read-audit or path-sandbox
  support;
- certification of arbitrary network or external application side effects;
- exact token accounting when the host exposes only estimates;
- a separate gateway repository; and
- retroactive rewriting of historical PLAN, WORK, or version 3 records.

When external mutation is required for a future WORK, it needs a separately
declared target and enforcement design. It must not be treated as covered by
Git Scope Lock.

## Alternatives Rejected

- Policy wording alone: useful guidance, but it cannot detect an omitted file.
- Trusting WORK-reported `changedFiles`: insufficient because the reporter is
  the state being checked.
- Git hooks as sole authority: helpful feedback, but bypassable.
- Fixed model-name matrix: becomes stale and confuses public availability with
  host availability.
- Defaulting every PLAN or critical WORK to maximum effort: raises cost without
  proving better acceptance.
- A central gateway repository: adds ownership and operational complexity
  without a present scale need.
- OS-level read sandbox in v1: the current host cannot support the claim
  honestly.

## Review and Next Step

The owner reviews this written design before any implementation plan is
created. Approval authorizes planning, not implementation. Requested changes
are made in this design worktree. After written approval, a fresh implementation
plan will split the minimum policy, schema, verifier, compatibility, and test
work while preserving one PLAN round and the document budget.
