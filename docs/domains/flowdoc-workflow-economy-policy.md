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

## Work Size and work authority

Work Size is `small`, `medium`, or `large`. `large` is a signal to split the
round before dispatch, not permission to send an unbounded packet.

Each WORK receives exactly one work authority:

- `discovery`: read, inspect, compare, and return findings; no file mutation;
- `implementation`: change only the allowed scope and verify that change;
- `verification`: inspect and run checks; no file mutation.

A WORK cannot expand its own authority, scope, proof budget, document budget,
or downstream obligation. A needed expansion returns to PLAN as a blocker,
risk, unknown, or Contract Change Request.

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
