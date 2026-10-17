# FlowDoc PLAN Self-Contained Rounds Design

## Authority Boundary

Project Control owns this design under
`flowdoc-product-development-resumption > agent-and-skill-design > plan-self-contained-rounds`.
It defines agent coordination and Project Control registry behavior only. It
does not change or prove Core, Backend, Editor, product UX, product readiness,
or map truth.

## Work Context

- Work ID: `plan-self-contained-rounds`
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with `planning-partner` and
  `documentation-authority-steward` responsibilities
- Current Phase: `phase-agent-and-skill-design-plan-self-contained-rounds`
- Checklist target:
  `checklist-agent-and-skill-design-plan-self-contained-rounds`
- Evidence target:
  `evidence-flowdoc-plan-self-contained-rounds-2026-09-21`
- Known risks: the current coordination registry permits ownership transfer
  and can represent a new PLAN as a later generation of an older PLAN;
  historical version 1 records must remain readable without retaining
  execution authority
- Unknown state: runtime enforcement, version 2 schema, command migration,
  projection labeling, and complete guard coverage are not implemented by this
  design document

## Problem

The first coordination model treated a later PLAN task as a possible successor
to an earlier PLAN task. Ownership transfer and ownership generations could
seal an old room while still carrying the same registry, room locator,
worktree, branch, or return path forward.

That model makes the new PLAN reconstruct the old PLAN before it can act. It
also makes a correction look like continuation authority. This is the opposite
of the intended boundary: a PLAN should be able to understand, execute, and
close its own work without reopening another PLAN's execution context.

## Decision

One PLAN task owns exactly one self-contained execution round.

The PLAN may create multiple dispatch sets and WORK rooms inside that round,
but all execution authority begins and ends with that PLAN task. When the PLAN
round closes, its tasks, room locators, return routes, liveness state,
worktrees, branches, handoff IDs, and registry become historical. No later
PLAN can acquire, resume, revise, wait on, or send through them.

A new PLAN that addresses the same product problem starts a new Project
Control Work execution record and a new coordination registry. It does not
continue the previous registry under a later ownership generation.

## Core Invariants

1. `one PLAN task = one execution round = one mutable coordination registry`.
2. A registry's PLAN task ID and round ID are immutable after creation.
3. A PLAN may mutate only the registry that was created for its own round.
4. Cross-PLAN ownership transfer is not a supported operation.
5. A WORK room can receive Revision Packets only from its owning PLAN and only
   while that PLAN round remains active.
6. Closing or cancelling a PLAN round permanently removes its execution
   authority.
7. A later PLAN may consume only immutable inputs: accepted commits, Evidence
   records, registered Project Control documents, or a bounded Historical
   Recovery Packet.
8. A thread, conversation, registry, room run, liveness record, Return
   Channel, worktree, branch, dirty candidate, or unaccepted handoff is not an
   immutable input.
9. Repair work under a different PLAN is a new lane with a new WORK task and
   execution context.
10. Historical inspection never reactivates the inspected PLAN or WORK room.

## Coordination Registry Version Boundary

### Version 1

Existing version 1 registries remain readable as historical records. Their
stored state, including `active` wording or transfer history, is preserved for
audit compatibility but no longer grants execution authority after the
version 2 cutover. The cutover is the Project Control commit that first ships
and verifies version 2; there is no per-registry opt-in that can leave a
version 1 registry mutable afterward.

All mutation commands against a version 1 registry fail closed with a stable
legacy-read-only error. Projection and validation may read version 1 records,
but dispatch, revision, return, acceptance, release, and transfer commands may
not advance them.

### Version 2

Every new PLAN creates a version 2 registry in a new PLAN-owned Work execution
record. Version 2 binds the registry directly to:

- `planTaskId`;
- `roundId`;
- Project Control Work ID;
- owner scope and integration claims;
- dispatch sets and room attempts created only by that PLAN.

Version 2 does not contain ownership-transfer history or a cross-PLAN
generation counter. Same-room retry remains represented by
`revisionAttempt`; it does not create a new PLAN or transfer authority.

Terminal payloads and commands identify the immutable `planTaskId` and
`roundId`. A mismatch is rejected before lifecycle state changes.

## Fresh Execution Identities

A version 2 round must create fresh values for:

- round ID;
- dispatch-set ID;
- room-run ID;
- handoff ID;
- WORK task/thread;
- worktree or branch when repository edits are allowed;
- PLAN-owned Return Channel destination and monitor owner.

Revisions inside the same PLAN round may reuse the same WORK task, room-run
lineage, worktree, and branch while allocating a new revision attempt and
handoff ID. No reuse is allowed after that PLAN round closes.

Project Control may compare opaque identity values with historical indexes to
reject collisions. This check does not load old conversation content into the
new PLAN and does not grant the new PLAN permission to inspect or contact the
old task.

## Historical Recovery Work

If accepted Evidence, commits, and registered documents do not contain enough
information, history lookup becomes a separate read-only
`historical-recovery` Work item.

When that lookup needs agent execution, it receives its own self-contained
PLAN round. Its scope is recovery only; it is not a continuation of the PLAN
being inspected and cannot become the implementation PLAN for the recovered
problem.

Historical Recovery Work may:

- read Project Control history, repository commits, retained artifacts, and an
  explicitly authorized old task;
- identify exact source locators;
- produce a Historical Recovery Packet with immutable findings, provenance,
  risks, and unknowns.

Historical Recovery Work must not:

- send a prompt, Revision Packet, wait request, or handoff through the old
  PLAN or WORK task;
- activate or mutate the historical registry;
- reuse an old task, worktree, branch, Return Channel, or room locator as the
  execution context of another PLAN;
- present an unaccepted candidate as accepted Evidence.

A later PLAN may cite the resulting Historical Recovery Packet as immutable
input. It still creates a fresh execution round.

## Runtime Enforcement

The implementation must fail closed at these boundaries:

- schema validation rejects version 2 transfer fields and commands;
- command application rejects every version 1 mutation;
- command application verifies the exact PLAN task and round before any state
  transition;
- activation rejects stale or colliding execution identities;
- return, receipt, acceptance, revision, cleanup, and release reject a PLAN or
  round mismatch;
- cross-Work validation rejects simultaneous mutable authority for the same
  execution identity;
- Project Control projections label version 1 coordination as legacy
  historical state rather than current execution authority.

The repository runtime cannot intercept an arbitrary Codex app API call made
outside Project Control. AGENTS and the local FlowDoc skill therefore remain a
second fail-closed layer: a current PLAN must not call send, wait, revision, or
handoff tools with an older task locator. Project Control runtime acceptance
still rejects any result produced through that stale path.

## Data Flow

```text
new PLAN task
  -> new Work execution record
  -> new version 2 registry
  -> new dispatch sets and WORK tasks
  -> acceptance and integration inside the same PLAN
  -> release and permanent historical seal

old records or artifacts
  -> optional read-only Historical Recovery Work
  -> immutable Historical Recovery Packet
  -> optional input to a different fresh PLAN
```

There is no execution edge from one PLAN registry to another.

## Migration

Migration is additive and non-destructive:

1. Keep version 1 data readable without rewriting old room history.
2. Mark version 1 as legacy read-only in validation and projections.
3. Introduce version 2 types, schema, transitions, and fixtures.
4. Remove `transfer-ownership` from the version 2 command surface.
5. Require all newly created PLAN execution records to use version 2.
6. Update agent guidance and the local FlowDoc skill so a new PLAN creates a
   new Work execution record instead of restoring another PLAN's registry.
7. Add focused behavior tests before implementation changes are accepted.

This migration does not delete historical Work, Evidence, commits, tasks,
branches, or worktrees. Cleanup remains separately authorized and evidence
bound.

## Verification Design

Focused tests must demonstrate that:

- version 1 records still validate and project as historical;
- every version 1 mutation is rejected;
- version 2 cannot express or apply ownership transfer;
- a command from another PLAN or round is rejected without mutation;
- stale thread, worktree, branch, room-run, dispatch-set, handoff, return, and
  monitor identities are rejected;
- same-PLAN same-round revision remains valid;
- closing a version 2 round prevents further mutation;
- immutable Evidence and commit references can be consumed without importing
  old execution state;
- Historical Recovery Work stays read-only and cannot become a dispatch
  registry;
- stored hand-edited conflicts fail the normal Project Control gate.

The implementation round must run focused coordination tests, the full
Project Control gate in its worktree, and the full gate again after integration
to `main`.

## Intentionally Unchanged

- Core, Backend, and Editor product behavior
- product terminology and product maps
- accepted historical Evidence and commit claims
- automatic WORK-to-PLAN return inside one active PLAN round
- same-PLAN Revision Packets and retry rules
- cleanup authority and evidence requirements

## Acceptance Outcome

The design is complete when the user confirms that a PLAN is a fully isolated
execution owner, version 1 is historical read-only, version 2 has no
cross-PLAN transfer path, and history lookup occurs only through separate
read-only Historical Recovery Work.
