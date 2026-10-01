# FlowDoc Workflow Economy Policy

## Authority Boundary

Owner: FlowDoc Project Control.

Scope: the current operating policy for turning an owner request into one PLAN
round, bounded WORK, proportionate proof, accepted truth, and a compact current
context. This policy governs workflow; it does not prove Core, Backend, Editor,
release, compatibility, or map truth.

This document supersedes the Delivery Operating Model, PLAN Room Orchestration
Rules, Work Type Routing Model, and Lean Dispatch Operating Rules. Those files
remain readable historical sources, but they are not authority for a new round.
The Coordination Controls document remains a supporting transport and ownership
contract only when a PLAN opens a real separate WORK room.

## Safety Kernel

Economy may reduce coordination and documentation, never the following safety
properties:

1. one current PLAN owns one execution round and its integration boundary;
2. a new PLAN creates a fresh round, packet, room identities, return route, and
   registry version 3; closed PLAN or WORK execution context is read-only;
3. a WORK may act only inside its explicit repository, authority, allowed scope,
   forbidden scope, and acceptance criteria;
4. product WORK returns candidates to PLAN and cannot promote shared truth;
5. real separate WORK rooms have a retrievable locator, liveness, automatic
   return, idempotent handoff, and PLAN-owned acceptance;
6. only verified implementation may become Evidence or promoted map truth.

Registry versions 1 and 2 are historical and read-only. Only version 3 may be
mutated. Historical Recovery Work may inspect older state but never reactivate
its authority. Cross-PLAN ownership transfer is not supported.

New rounds use packet policy `flowdoc-workflow-economy-v2` and Scope Lock
Enforcement v1. Legacy policy v1 packets remain readable as historical input
but must not activate, accept, or authorize integration for a new round.

## PLAN responsibility

PLAN listens to the owner, identifies current truth, and converts the request
into one self-contained round. Before dispatch it decides:

- the goal, owner repository, Work Size, Risk Tier, and work authority;
- allowed scope and only the forbidden scope needed for safety;
- acceptance criteria and relevant reusable Evidence;
- Proof Budget, Document Budget, model decision, escalation triggers, and
  return route;
- whether research and implementation belong in one WORK or in separate WORK.

Work Size and Risk Tier are independent. Size describes delivery shape; risk
describes the minimum proof. A small change can be critical and a large survey
can be routine. PLAN must not use either axis to inflate the other.

PLAN may keep discovery and implementation together only when the unknown is
small, local, and cannot materially change scope. Use a discovery-only WORK
when findings determine architecture, repository ownership, contract, safety,
or scope. Discovery returns findings and stops; PLAN decides whether to open a
fresh implementation WORK.

## Small inline maintenance

Owner decision, 2026-09-29: small documentation or status maintenance may use
the existing checkout when its scope is separable and no other work conflicts.
Inspect the diff and preserve unrelated changes. Use an isolated worktree when
concurrent work, experiments, or change risk requires separation; real separate
WORK rooms keep their existing ownership, identity, and Scope Lock controls.

For small inline maintenance, the explicit user request and relevant existing
record or canonical document are sufficient context. State owner, scope,
acceptance, affected areas, and verification briefly in the current task. Update
the existing record with the result, supporting checks, and remaining issues.
Do not create a Work, Phase, Checklist, registry, or new report merely to close
a status item. Mark unavailable Phase/Checklist IDs not applicable; do not
reactivate a historical execution context. Broad or separate-room work still
requires its execution context and the controls below.

## Verification by impact

Verify the changed area and every other area affected by the change. Before
running checks, briefly identify the change, its dependencies and consumers,
and which checks cover those effects, including other repositories when needed.
File extension alone does not establish impact: policy or contract prose may
affect guidance, consumers, validation, and generated projections.

There is no mandatory full-suite check for every task. `npm run check` remains
available when a concrete task-specific reason calls for full-system coverage.
If impact is unclear, investigate the boundary first; uncertainty alone does
not automatically require the full suite. Do not skip an affected area merely
to save time. Record material coverage gaps and do not claim unverified scope.

Wait for prerequisite commands, including generation, to finish successfully
before starting dependent checks. Read the final diff, including prose and
headings, before testing; a passing test does not replace that review.

After integration, reuse passing results for an unchanged fast-forward when
the tested content, relevant base, dependencies, configuration, and environment
remain the same. Confirm that identity and record the reused result; do not
automatically run the suite again on `main`. Conflicts, additional changes, or
relevant environment changes require checks of the changed and affected areas.
Separate-room acceptance and integration preflights still apply; proof reuse
does not bypass candidate identity, ownership, or mutation-containment checks.

Stop when acceptance and the selected impact coverage pass. A repeat or broader
check needs a reason tied to a new change, failure, stale prerequisite, or
unresolved affected area, within the existing stopping rules.

### Case selection examples

Owner clarification, 2026-10-01: classify work by meaning and impact, not file
count, line count, or extension. These examples help select checks; they are
not a checklist to run in full. Select only applicable cases, combine their
coverage without duplicate checks, and use judgment for cases not listed.
A short edit to a shared rule or contract is not cosmetic maintenance.

| Change case | Relevant verification |
| --- | --- |
| Wording, formatting, or links with unchanged meaning | Review the rendered meaning, links, and generated content when affected. |
| Status update from existing evidence | Confirm the evidence matches the item and remains valid; do not re-prove unchanged work. Keep completed, cancelled, and superseded distinct. |
| Policy or contract meaning | Trace affected instructions, consumers, validators, and projections; verify their consistency and the behavior governed by the change where applicable. |
| Local code behavior | Check the changed behavior, affected callers, and existing behavior that could regress. |
| Shared components or cross-repository interfaces | Identify affected consumers and check the relevant integration boundaries and behavior. |
| Deletion, permissions, or hard-to-reverse changes | Confirm exact targets, effects, applicable authorization, and recovery implications. Few changed lines do not imply low risk. |
| Unknown impact | Inspect dependencies and consumers to establish the boundary before selecting checks; do not automatically run the full suite. |
| Configuration or defaults | Check paths reading the setting, both explicit values and fallback/default behavior, in the relevant environment. |
| Dependency or lockfile update | Check affected package consumers, installation/build resolution, and relevant compatibility. |
| Move or rename intended to preserve behavior | Check imports, links, callers, and name-based or dynamic references; confirm preserved behavior. |
| Persisted data structure or migration | Check existing-data reads, migration behavior, and consumers of the new format; account for rollback or mixed versions when applicable. |
| Generator input, schema, or template | Regenerate from the canonical source, inspect its output, and check affected consumers; do not patch generated output alone. |
| Tests, fixtures, or acceptance thresholds | Confirm the new expectation still matches the requirement and detects the relevant failure. A newly green test alone does not justify changing the criterion. |
| Performance changes intended to preserve results | Check correctness, cache invalidation where relevant, and comparable before/after measurements for the affected workload. |
| Revert or feature disablement | Check later dependencies, affected consumers, and data already produced. Reverting code does not necessarily restore previous state. |

Apply these conditions across cases only when relevant:

- Concurrent changes: inspect the latest relevant base and overlapping work
  before integration. Reuse results only where the tested assumptions still
  hold; verify newly changed or affected areas.
- Unavailable or flaky checks: distinguish change failures from environment or
  tool failures using available evidence. Report what remains unverified; do
  not retry indefinitely or treat an eventual pass as proof of reliability.

Choose isolation separately from the case label: use the existing small-inline
maintenance exception only when its conditions hold, and choose a worktree for
conflicting concurrent work, experiments, or risk requiring separation. These
examples do not authorize broader edits, new gates, or additional artifacts.

## Scope Lock Enforcement v1

For registered execution rounds, Scope Lock is part of the Safety Kernel for
every Risk Tier. Small inline maintenance uses the bounded context above. The
immutable policy v2 packet binds one repository, exact base commit, registered worktree,
work authority, allowed and forbidden repository-relative paths, ordered
acceptance criteria, budgets, model decision, return identity, and packet
digest. Scope paths use `/`, reject absolute paths and `..`, compare by path
segment, and cannot overlap.

For a real separate implementation WORK, PLAN computes an actual Git manifest
from the registered worktree instead of trusting reported `changedFiles`. The
manifest covers committed, staged, unstaged, untracked non-ignored, deleted,
renamed, copied, and dirty-submodule paths; rename and copy checks include both
endpoints. Discovery and verification reject any candidate mutation; verification
outputs follow the boundary below and do not weaken this manifest check.
Implementation rejects forbidden paths before paths outside allowed scope.

Acceptance requires a clean worktree, exact base and terminal commits, an
unchanged packet digest, identical actual/payload/completion file sets, passing
required checks, and a persisted compact Scope Lock verification. A violation
fails without writing accepted state and is routed as
`needs-revision: scope-violation:<code>` when repair remains in scope. Before
integration, PLAN reruns the read-only preflight against the accepted commit,
base ref, packet, manifest digest, and clean worktree. Git hooks may warn but
never authorize acceptance or integration.

Scope Lock proves repository mutation containment and accepted candidate
identity. It cannot prove every file read, network request, or external
application side effect. Hard read-audit remains unsupported until the host
provides an enforceable read sandbox or audit surface; do not describe Git
Scope Lock as read containment.

## Model Budget

PLAN chooses the least costly capability and reasoning effort that can reliably
satisfy the unchanged packet. Work Size and Risk Tier inform but do not dictate
model choice. Each current packet records a compact decision: capability class,
actual model ID and effort, task-specific sufficiency reason, assessment of the
next smaller available option, measurable escalation triggers, and one
`availabilitySnapshotRef`. The version 3 round stores the referenced host,
observation time, and available model/effort pairs once. A selected pair absent
from that host availability snapshot cannot activate.

For future PLAN rounds, the default is `gpt-6-astra` at `medium`. PLAN Lite may
use `gpt-6-sol` at `medium` only when there is one owner repository, no
unresolved architecture or ownership question, no critical or irreversible
data concern, at most one bounded or inline WORK, and deterministic acceptance.
Use Astra `high` only for a concrete critical or cross-repository conflict,
conflicting Evidence, or repeated reasoning failure after correcting packet and
context. `xhigh`, `max`, and `ultra` are never standing defaults.

WORK does not inherit the PLAN model. Resolve its decision from actual host
availability and task needs. On failure, correct scope, context, environment,
acceptance, and test reliability first. Escalate one capability class, raise
effort, or split the lane only after a recorded trigger; reconsider and
de-escalate after discovery removes uncertainty. Model choice never weakens
Scope Lock, proof, acceptance, verification, or stopping rules and creates no
new Evidence artifact by itself.

## Work Size and work authority

Work Size is `small`, `medium`, or `large`. `large` is a signal to split the
round before dispatch, not permission to send an unbounded packet.

Each WORK receives exactly one work authority:

- `discovery`: read, inspect, compare, and return findings; no file mutation;
- `implementation`: change only the allowed scope and verify that change;
- `verification`: inspect and run checks without changing the candidate; bounded
  verification outputs are permitted as described below.

A WORK cannot expand its own authority, scope, proof budget, document budget,
or downstream obligation. A needed expansion returns to PLAN as a blocker,
risk, unknown, or Contract Change Request.

### Verification output boundary

Verification must not change what is being verified. Before running a check,
identify its expected writes and output location; afterwards compare candidate
state and account for the changes. Apply only the relevant case:

- Temporary outputs such as caches, coverage, and test reports may be written
  to a designated output area without overwriting existing work or real data.
  Prefer output outside the candidate or an existing ignored output directory;
  being ignored alone does not authorize overwriting its contents.
- Checks that regenerate tracked files must use a non-writing comparison mode
  when available, or an isolated scratch copy of the exact candidate and relevant
  environment. Record that input identity and any generated differences. Do not
  update the candidate's generated files or claim it passes merely because the
  regenerated scratch copy passes. A difference is a finding for the owner.
- A required source, configuration, or real-data repair is implementation work.
  Return the finding to the responsible owner; do not make the repair to obtain
  a pass while acting as verification.

If a check unexpectedly changes candidate files, stop dependent checks, report
the mutation and preserve the observed state. Do not silently reset, delete, or
hide changes to satisfy the clean-state gate. Remove only outputs known to have
been created by this verification and safe to discard; preserve pre-existing
or uncertain files. Scope Lock acceptance still requires an unchanged candidate
and its normal clean-state checks. This boundary does not grant permission for
external side effects or change discovery authority.

## Risk Tier

The default Risk Tier is `routine`.

- `routine`: ordinary reversible work with focused tests; no close audit.
- `bounded`: meaningful but contained failure impact; focused tests plus an
  acceptance summary when it adds decision value.
- `critical`: safety, correctness, irreversible data, security, authority, or
  wide compatibility impact; requires a written escalation reason and may use
  a formal close audit.

Neither uncertainty nor the wish to be thorough automatically makes work
critical. PLAN records the concrete failure impact before escalation.

## Proof Budget and Document Budget

Before authorizing a new Evidence item, Gate, audit, certificate, or review
cycle, PLAN must name the failure it prevents. If a normal test already proves
the fact, no additional proof layer is allowed.

Every packet sets a Proof Budget: authorized artifacts, maximum review cycles,
and close form. Routine defaults to focused tests and zero formal audit.
Bounded work may use an acceptance summary. Formal audit is reserved for
critical work. The loop `implementation → audit → rebaseline → audit` must stop
when acceptance criteria pass unless a Safety Kernel blocker is present.

Every packet also sets a Document Budget. Write a new document only when it
creates durable authority, a reusable decision, an interface contract, or
evidence that tests cannot express. Prefer updating a canonical record or
returning the four-field completion report. Do not create an artifact merely
to narrate work already proven elsewhere.

## Evidence reuse and freshness

Reference existing Evidence for the same fact. Do not clone it for another
Phase. Reuse depends on claim, repository and path scope, source revision,
verification method, and freshness triggers. When a trigger fires, revalidate
the same Evidence or supersede it explicitly; copying is not freshness.

## Unknowns, Gates, and Fallback before Proof

Every unknown has one disposition:

- `blocking`: must be resolved now because acceptance cannot be sound;
- `accepted`: known and explicitly tolerated by the owner or policy;
- `deferred`: returns only when its recorded trigger occurs;
- `irrelevant`: closed because it cannot affect this round.

An unknown does not create a Gate. Create a Gate only for a real decision that
stops or permits downstream work. A TODO or ordinary risk remains a TODO, risk,
or unknown.

Apply **Fallback before Proof**: when a conservative fallback is correct and
fits the performance budget, use it before inventing a new proof mechanism.
Record the fallback behavior, budget, and verification.

## Owner decisions

The owner may issue `accept risk`, `defer proof`, `freeze scope`, or
`stop investigation`. Record the decision, reason, author, and time. It is
authoritative within the Safety Kernel; an agent must not reopen the same issue
without a new blocker-grade fact matching a declared escalation trigger.

## Minimal Kickoff Packet and return

A Minimal Kickoff Packet contains only:

- goal and owner repository;
- work authority, Work Size, and Risk Tier with any critical reason;
- allowed scope and necessary forbidden scope;
- acceptance criteria;
- relevant Evidence references;
- Proof Budget and Document Budget;
- known unknown dispositions, owner decisions, model decision, and escalation
  triggers;
- PLAN task ID, round ID, expected handoff ID, automatic return route, and
  active return command when a separate WORK room is used.

Default context loading is: Current Truth Snapshot → packet → referenced current
or supporting contract/Evidence. Do not load historical documents, old task
conversations, old registries, old branches/worktrees, unrelated Work trees, or
unreferenced supporting documents by default. Load history only for explicit
audit, conflict, Evidence recovery, or reconciliation.

A separate WORK room must acknowledge context, remain retrievable, and make an
automatic return to PLAN. A final message that exists only inside WORK is not a
return. PLAN queues close arrivals, handles duplicates idempotently, and accepts
one handoff at a time. A silent room or missing terminal return must not be
accepted. Inline work does not synthesize room ceremony.

If acceptance finds an in-scope repair, PLAN sends a Revision Packet only while
the same PLAN and round remain active. PLAN does not patch a dispatched product
repository: product-repository repair goes back to WORK. A changed PLAN uses a
fresh version 3 execution context instead.

## Completion and stopping

Completion uses four distinct milestones:

- `planning complete`: the packet is approved;
- `implementation complete`: authorized behavior changes are finished;
- `verification complete`: required checks pass;
- `promoted truth`: PLAN has accepted and registered the supported truth.

They must not be collapsed into a generic Done label.

The WORK completion report answers only:

1. what behavior changed;
2. which test or Evidence proves it;
3. what remains unknown;
4. what downstream work must know.

It also lists changed files and budget use for enforcement. Once acceptance
criteria pass, the agent must stop and must not seek additional proof unless it
finds one of exactly four stop conditions:

- safety/correctness blocker;
- authority violation;
- missing prerequisite;
- scope escape.

Routine work closes without audit. Bounded work may use an acceptance summary.
Critical work may use the authorized formal audit. A new PLAN is a new round;
it may consume accepted commits, Evidence, and Project Control records as
immutable input but cannot continue an older task's execution authority.

## Supersession, cockpit, and governance review

A successor document names `supersedes`; every predecessor names
`supersededBy`, uses lifecycle `superseded`, and context class `historical`.
Agents must resolve to the current successor and may not treat a predecessor as
authority.

The generated Current Truth Snapshot is the common cockpit. It exposes current
goal, current blocker, bounded active work, accepted truth, critical unknowns,
deferred work, next decision, related repositories, completion milestones, and
one selected Work's governance metrics. Detail and History stay behind explicit
selection.

Governance metrics are directional, not a new proof requirement: approximate
tokens, documents loaded, Evidence created, implementation commits versus
governance artifacts, review cycles, and reopen/rebaseline frequency. At each
monthly or major milestone review, ask how many steps were added, which can be
removed, and whether delivery became faster or slower. Refactor Project Control
like code; delete redundant process instead of accumulating it.
