# FlowDoc PLAN Room Orchestration Rules

## Authority Boundary

This document defines how a FlowDoc PLAN room decomposes shared understanding,
chooses `N WORK rooms`, dispatches real WORK rooms, monitors returns, queues
handoffs, and accepts or rejects results before Project Control records are
updated.

It is owned by Project Control under
`flowdoc-product-development-resumption > agent-and-skill-design`.

This is a Project Control coordination contract. It does not open WORK rooms,
does not edit Core, Backend, or Editor behavior, and does not prove API key
behavior, gateway behavior, product database behavior, PDF generation, product
readiness, release readiness, FlowDoc product truth, or map truth.

## Work Context

- Work path: `flowdoc-product-development-resumption > agent-and-skill-design`
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with `planning-partner` and
  `documentation-authority-steward` responsibilities for the prose
- Current Phase:
  `phase-agent-and-skill-design-plan-room-orchestration-rules`
- Checklist target:
  `checklist-agent-and-skill-design-plan-room-orchestration-rules`
- Evidence target:
  `evidence-flowdoc-plan-room-orchestration-rules-2026-09-02`
- Known risks: a WORK room may finish without pushing its handoff back to the
  PLAN room, multiple WORK rooms may finish before PLAN can process them,
  `N WORK rooms` may be set higher than the PLAN room can track, room IDs may
  be missing, and partial handoffs may be mistaken for accepted evidence
- Unknown state: this document does not prove that every Codex environment can
  automatically wake a PLAN room from a completed WORK room; until that is
  proven, PLAN rooms must use a pull/review step

## Relationship To Delivery Model

The Delivery Operating Model defines the two room modes and the required Lane
Card, Kickoff Packet, handoff, and Contract Change Request shape.

The Work Type Routing Model at
`docs/domains/flowdoc-work-type-routing-model.md` defines how a PLAN room
assigns Work Type, writes the lane Context Capsule, expects Context
Acknowledgement, chooses skill candidates, and accepts or rejects returned work
by Work Type.

This document adds the PLAN-room event loop for rounds that may use more than
one real WORK room. It answers when the PLAN room may split work into a
dispatch set, how the PLAN room chooses `parallelLimit`, and how completed
handoffs are processed without letting rooms collide.

## N WORK Room Assessment

`N WORK rooms` means the number of real separate Codex task/chat rooms the PLAN
room opens or asks `ตูม` to open for one dispatch set.

`N` is not fixed. It is chosen by the PLAN room for the current round after
the PLAN room records:

- the candidate lane IDs;
- the Work Type for each candidate lane;
- the owner repository for each lane;
- `laneDependencyGraph`, including lanes that must wait for another lane's
  accepted handoff;
- shared files, branches, worktrees, records, or Evidence targets that could
  collide;
- expected handoff size and review cost;
- user-attention cost, including decisions that may return from more than one
  room;
- `parallelLimit`, the maximum active WORK rooms the PLAN room can actively
  track for this dispatch set.

When ownership, dependency, or evidence is unclear, set `parallelLimit` to `1`
until the uncertainty is resolved. When lanes are independent but merge or
handoff review would collide, split them into smaller dispatch sets instead of
opening every lane at once.

No new WORK room opens unless the PLAN room records why the selected
`parallelLimit` is safe for this dispatch set.

## Dispatch Set

A dispatch set is the group of lanes the PLAN room decides can run at the same
time.

Each dispatch set must record:

- `dispatchSetId`;
- round ID;
- selected lane IDs;
- Work Type for each selected lane;
- `parallelLimit`;
- `laneDependencyGraph`;
- reason these lanes can run now;
- lanes intentionally held back;
- expected fan-in point;
- acceptance order if more than one room returns at once.

The dispatch set does not prove product behavior. It only records coordination
intent and room-management limits.

## Room Run Registry

Every opened WORK room must have a Room Run Registry entry before or
immediately after the room is created.

Minimum registry fields:

- `roomRunId`;
- Codex task/chat ID, worktree/branch, or handoff location; at least one
  retrievable locator must be recorded before the lane can be accepted;
- `dispatchSetId`;
- lane ID;
- Work Type;
- owner repository;
- active role;
- Work path, Phase target, Checklist target, and Evidence target;
- Context Capsule reference or summary;
- Context Acknowledgement status;
- status: `queued`, `running`, `needs-attention`, `returned`, `accepted`,
  `rejected`, `blocked`, or `closed`;
- last observed state and timestamp;
- handoff ID or handoff location when returned;
- next PLAN action.

Until Project Control has a dedicated Room Run schema, the registry may live in
the PLAN room's handoff notes or a bounded Project Control Work/Checklist
record. It must still be explicit enough that a future PLAN room can find which
WORK rooms exist, which Context Capsule each room received, which handoffs
remain unprocessed, and which locator can be used for pull review.

## Pull Review Rule

A WORK room should return its structured handoff to the PLAN room. Current
Codex task behavior may not always push that result back automatically.

If a WORK room does not push a final handoff back to the PLAN room, the PLAN
room must actively pull the result by using the stored Codex task/chat ID,
available task list, or known worktree/branch location. If the PLAN room cannot
find the room result, mark the room run as `UNKNOWN` or `RISK` and ask `ตูม`
for the missing room/task reference before accepting the lane.

The PLAN room must not treat "the WORK room probably finished" as accepted
evidence.

## Handoff Inbox

Returned WORK room results first enter `handoffInbox`.

Each inbox item must keep the original handoff bounded to:

- status: PASS / FAIL / BLOCKER / RISK / UNKNOWN;
- lane ID;
- Work Type;
- owner repository;
- Context Acknowledgement result;
- files changed;
- behavior changed;
- tests run;
- exact commits reported for changed behavior, plus branches, worktrees, task
  IDs, or handoff locations used only as locators;
- evidence candidate or Evidence record request;
- claims intentionally not promoted;
- product states that remain unknown;
- Contract Change Request, if needed;
- PR Summary Draft.

The inbox is not acceptance. It is only the staging area before PLAN review.

## Completion Queue

If multiple WORK rooms finish before the PLAN room processes them, enqueue
every returned handoff in `completionQueue`.

The PLAN room processes one queued handoff at a time. Process blockers and
Contract Change Requests before ordinary PASS handoffs. For handoffs with the
same priority, use the dispatch set's recorded acceptance order or lane ID
order.

The PLAN room must not merge, register Evidence, promote truth, or open
dependent lanes from a handoff until that handoff passes `acceptanceGate`.

## Acceptance Gate

`acceptanceGate` is the PLAN review step that decides whether a WORK room's
result can be accepted into the round.

A returned handoff can be accepted only when it includes:

- the expected lane ID and owner repository;
- the expected Work Type and completed Context Acknowledgement;
- a retrievable locator from the Room Run Registry;
- exact commit, file, test, or contract references for the owning repository;
- fresh verification results from the owning repository when product behavior
  changed;
- a clear statement of behavior changed and behavior intentionally not changed;
- claims intentionally not promoted;
- risks and unknowns that remain;
- no undeclared cross-repository contract change;
- no FlowDoc-wide truth written into a product repository;
- a PR Summary Draft when implementation changed.

For product implementation handoffs, changed behavior requires exact commit
from the owning repository. A branch, worktree, task/chat ID, screenshot,
mockup, or handoff note can help the PLAN room find the work, but it is not
enough evidence for changed behavior by itself.

If any required field is missing, mark the handoff `rejected` or
`needs-attention` and ask the WORK room or `ตูม` for a revision. If the handoff
requests a scope, owner, source-of-truth, evidence, or contract change, process
the Contract Change Request before accepting any dependent handoff.

## PLAN Event Loop

A PLAN room that coordinates real WORK rooms should loop in this order:

1. Read Project Control and resolve Work path, owner repository, active role,
   Phase, Checklist, Evidence target, risks, and unknown state.
2. Break the goal into candidate lanes with owner repositories and stop
   conditions.
3. Build `laneDependencyGraph`.
4. Assign Work Type to each candidate lane, split lanes with conflicting Work
   Types, and write a Context Capsule for every lane chosen for dispatch.
5. Choose a dispatch set and record `parallelLimit`.
6. Ask `ตูม` to approve the dispatch set or approve a revised smaller set.
7. Open or instruct opening real WORK rooms with exact Kickoff Packets that
   include Work Type, Context Capsule, and expected Context Acknowledgement.
8. Record each room in the Room Run Registry with a retrievable locator.
9. Wait for, read, or pull returned handoffs.
10. Put returned handoffs into `handoffInbox` and `completionQueue`.
11. Run `acceptanceGate` one handoff at a time.
12. Update Project Control records only from accepted handoffs and verified
    evidence.
13. Decide whether to dispatch the next set, revise the plan, block, or close
    the round.

A real WORK room is still a separate Codex task/chat visible to `ตูม`; it is
not an internal subagent and it must execute one approved lane only.

## First Delivery Round Application

For the first delivery round, use
`docs/domains/flowdoc-first-delivery-round-plan.md` as the lane source and this
document as the orchestration rule. Use
`docs/domains/flowdoc-work-type-routing-model.md` to assign the lane Work
Types and Context Capsules before dispatch.

The current Core WORK room returned a handoff candidate outside automatic
PLAN-room push. Before the PLAN room treats that Core lane as accepted, the
PLAN room must place the discovered result into `handoffInbox`, run
`acceptanceGate`, and record whether the lane is accepted, needs revision, or
requires a Contract Change Request. No accepted Core room locator is recorded
yet; the PLAN room must identify a task/chat ID, worktree/branch, or handoff
location before the Core lane can pass acceptance.

The remaining first-delivery lanes should be dispatched only after the PLAN
room records a dispatch set and `parallelLimit` against their dependencies.

## Handoff Requirement

A PLAN room handoff after multi-room coordination must include:

- PASS, FAIL, BLOCKER, RISK, and UNKNOWN statements as applicable;
- Work ID, Phase ID, Checklist item IDs, and Evidence target;
- dispatch set IDs and `parallelLimit` used;
- Room Run Registry status for every opened WORK room;
- Work Type, Context Capsule, Context Acknowledgement, and retrievable locator
  status for every opened WORK room;
- handoffInbox and completionQueue decisions;
- accepted, rejected, blocked, and still-unknown lane IDs;
- files changed by repository;
- tests run;
- evidence or map updates;
- claims intentionally not promoted;
- next dispatch recommendation.

This document does not open WORK rooms. It makes the PLAN room responsible for
tracking, pulling, reviewing, and sequencing them before FlowDoc truth is
updated.
