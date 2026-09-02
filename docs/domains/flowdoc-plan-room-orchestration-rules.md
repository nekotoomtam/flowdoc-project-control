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
  be missing, a silent room may disappear without a terminal return, partial
  handoffs may be mistaken for accepted evidence, manual recovery may be
  mistaken for a scalable return channel, and product WORK active return may be
  treated as proven by a read-only projectless smoke test
- Unknown state: the 2026-09-02 single-room projectless return-channel smoke
  test proved that one WORK room on this local host could actively push a
  Terminal Handoff to the PLAN task with
  `mcp__codex_app.send_message_to_thread`. The 2026-09-02 two-room
  projectless return-channel queue smoke test proved that two read-only WORK
  rooms on this local host could push distinct Terminal Handoffs to the same
  PLAN task and be queued with `completionQueue` arrivalSequence 1 and
  arrivalSequence 2. These smoke tests do not prove product WORK active
  return, queued `clientThreadId` dispatch, every Codex environment, future
  automatic room wakeups, or product evidence promotion. Manual pull review
  remains recovery only.

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
  room, without requiring `ตูม` to copy/paste Terminal Handoffs;
- `parallelLimit`, the maximum active WORK rooms the PLAN room can actively
  track for this dispatch set;
- automatic Return Channel capacity for every active room;
- `completionQueue` capacity for close-together or simultaneous returns;
- `returnOrderPolicy` for one-at-a-time acceptance when several rooms finish
  at once.

When ownership, dependency, or evidence is unclear, set `parallelLimit` to `1`
until the uncertainty is resolved. When lanes are independent but merge or
handoff review would collide, split them into smaller dispatch sets instead of
opening every lane at once.

No new WORK room opens unless the PLAN room records why the selected
`parallelLimit` is safe for this dispatch set. A dispatch set with
`parallelLimit` greater than 1 must prove that PLAN can hold multiple active
WORK rooms, receive their terminal returns automatically, queue every return,
and process one queued handoff at a time.

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
- acceptance order if more than one room returns at once;
- `returnOrderPolicy`;
- expected `arrivalSequence` assignment rule;
- duplicate handoff handling rule.

The dispatch set does not prove product behavior. It only records coordination
intent and room-management limits.

Automatic WORK-to-PLAN return is mandatory for every room in the dispatch set.
The dispatch set must not require `ตูม` to copy/paste Terminal Handoffs for
ordinary progress. If a room can only be recovered through manual copy/paste or
manual locator inspection, the result may preserve work as `manual-recovered`,
but the dispatch set does not satisfy automatic return.

Automatic return means an active WORK-to-PLAN return push. The WORK room must
send the structured Terminal Handoff to the PLAN task/chat ID or PLAN-owned
monitor named in the Kickoff Packet. When Codex thread tools expose
`send_message_to_thread`, that command is the active Return Command. WORK room
final answer alone is not an active Return Channel because PLAN cannot enqueue
it without manual locator discovery.

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
- PLAN task/chat ID or PLAN-owned monitor locator;
- Return Channel;
- Automatic Return Channel;
- Active Return Command;
- Return Event ID or pending return event state;
- Liveness Signal;
- `livenessDeadline`;
- `lastHeartbeatAt`;
- Death Signal or `deathSignal`;
- `clientThreadId` resolution status, when a create-room action returns only a
  client-side queued locator;
- `threadIdResolvedAt`, when PLAN resolves a monitorable task/chat ID;
- `locatorDiscoveryMethod`, such as direct create result, task monitor, task
  list, session file, worktree, branch, or user-provided reference;
- status: `queued`, `running`, `needs-attention`, `returned`, `accepted`,
  `needs-revision`, `returned-silent`, `manual-recovered`,
  `return-channel-failed`, `return-channel-failed-then-recovered`, `rejected`,
  `blocked`, or `closed`;
- last observed state and timestamp;
- handoff ID or handoff location when returned;
- `arrivalSequence`, when PLAN receives or recovers a terminal handoff;
- duplicate handoff disposition;
- next PLAN action.

Until Project Control has a dedicated Room Run schema, the registry may live in
the PLAN room's handoff notes or a bounded Project Control Work/Checklist
record. It must still be explicit enough that a future PLAN room can find which
WORK rooms exist, which Context Capsule each room received, which handoffs
remain unprocessed, and which locator can be used for pull review.

## WORK Room Return And Liveness

Every WORK room must have a mandatory WORK room return path before dispatch.
The PLAN room must know the Return Channel for the terminal return, the
Liveness Signal that proves the room is still running or waiting, and the Death
Signal to record when the room disappears.

Automatic WORK-to-PLAN return is mandatory. The Return Channel must deliver the
terminal handoff back to the PLAN room or a PLAN-owned monitor without requiring
`ตูม` to copy/paste Terminal Handoffs. It must not require `ตูม` to copy/paste
Terminal Handoffs. A manual recovery fallback is only a recovery path for
missed or failed Return Channels; it does not satisfy automatic return.

For Codex task/chat rooms, the Kickoff Packet must include the PLAN task/chat
ID, Return Event ID or handoff ID, and the Active Return Command. When
`send_message_to_thread` is available, the WORK room must call it to send the
terminal handoff to PLAN. The WORK room may also place the same handoff in its
own final answer, but that final answer is only a local record and is not the
active Return Channel.

`clientThreadId` alone is not a monitorable retrievable locator. It records
that room creation has been queued, but it is not enough for PLAN to wait on a
real task/chat, send a Revision Packet, or prove liveness. Until PLAN resolves
a real Codex task/chat ID or another monitorable locator, the room run remains
`queued` or `needs-attention`; PLAN must not open a scalable multi-WORK
dispatch set from that room state.

A terminal return is required for every outcome:

- PASS / FAIL / BLOCKER / RISK / UNKNOWN;
- lane ID;
- Work Type;
- owner repository;
- Context Acknowledgement result;
- retrievable locator;
- changed behavior and tests run, if any;
- evidence candidate or reason evidence is unavailable.

The Room Run Registry must record `livenessDeadline` and `lastHeartbeatAt`
when a WORK room is opened. If the PLAN room reaches the deadline without an
automatic return, it must mark the Return Channel as missed before recovery.
PLAN may pull by retrievable locator only to recover or classify the room. If
the room is gone, cannot be found, or cannot produce a terminal return, record
`deathSignal`, mark the run `returned-silent`, `needs-attention`, `RISK`,
`UNKNOWN`, or `blocked`, and choose the next PLAN action. If recovery finds a
terminal handoff, record it as `manual-recovered` or
`return-channel-failed`; that result does not satisfy automatic return and must
not be hidden by later acceptance.

If a WORK room disappears, the missing result is itself a PLAN-visible event.
The lane must not be accepted, dependent lanes must not open from it, and the
PLAN room must not treat silence as success.

## Automatic Return And Manual Recovery Rule

A WORK room must return its structured handoff to the PLAN room through the
automatic Return Channel. Current Codex task behavior may not always push that
result back automatically; when that happens, the dispatch set has not proven
scalable WORK-to-PLAN return.

If a WORK room does not push a final handoff back to the PLAN room, the PLAN
room must mark `return-channel-failed` or another explicit missed-return state
before using the stored Codex task/chat ID, available task list, session files,
or known worktree/branch location. PLAN may pull by retrievable locator only to
recover or classify the room. If recovery finds a terminal handoff after the
missed return was recorded, classify it as
`return-channel-failed-then-recovered` or `manual-recovered`, not
`automatic-returned`. If the PLAN room cannot find the room result, mark the
room run as `returned-silent`, `UNKNOWN`, or `RISK` and ask `ตูม` for the
missing room/task reference before accepting the lane.

The PLAN room must not treat "the WORK room probably finished" as accepted
evidence. It also must not treat a user-bridged or manually copied Terminal
Handoff as proof of automatic return.

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
- Return Event ID, handoff ID, or room run ID for duplicate handoff detection;
- `arrivalSequence`;
- automatic return status: `automatic-returned`, `manual-recovered`,
  `return-channel-failed`, or `return-channel-failed-then-recovered`.

The inbox is not acceptance. It is only the staging area before PLAN review.

## Completion Queue

If multiple WORK rooms finish before the PLAN room processes them, enqueue
every returned handoff in `completionQueue`.

`completionQueue` is mandatory for dispatch sets with multiple active WORK
rooms. PLAN assigns an `arrivalSequence` to every returned or recovered
handoff, keeps duplicate handoff returns idempotent by handoff ID, Return Event
ID, or room run ID, and then applies the dispatch set's `returnOrderPolicy`.

The PLAN room processes one queued handoff at a time. Process BLOCKER, FAIL,
Contract Change Request, then ordinary PASS handoffs. For handoffs with the
same priority, use the dispatch set's recorded acceptance order, then
`arrivalSequence`, then lane ID order.

The PLAN room must not merge, register Evidence, promote truth, or open
dependent lanes from a handoff until that handoff passes `acceptanceGate`.

## Acceptance Gate

`acceptanceGate` is the PLAN review step that decides whether a WORK room's
result can be accepted into the round.

A returned handoff can be accepted only when it includes:

- the expected lane ID and owner repository;
- the expected Work Type and completed Context Acknowledgement;
- a retrievable locator from the Room Run Registry;
- automatic Return Channel evidence, or an explicit `manual-recovered` /
  `return-channel-failed` /
  `return-channel-failed-then-recovered` state that is recorded as a scaling
  failure;
- terminal return status, or an explicit silent-room state that keeps the lane
  unaccepted;
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

A silent room or missing terminal return must not be accepted. Treat it as a
PLAN-visible liveness failure and decide whether to pull again, ask `ตูม` for a
room reference, reopen the lane, shrink the dispatch set, or block the round.
PLAN must not open dependent lanes from a manual-recovered handoff until PLAN
records the automatic-return gap and decides whether the dispatch set remains
safe.

## PLAN-Owned Reporting

Product WORK rooms return evidence candidate handoffs. They must not
self-promote their own result into Project Control truth, map truth, accepted
lane status, or round status.

PLAN-owned reporting means the PLAN room receives the WORK handoff through the
mandatory automatic Return Channel, puts it in `handoffInbox`, runs
`acceptanceGate`, decides `accepted`, `needs-revision`, `rejected`, `blocked`,
`RISK`, or `UNKNOWN`, and only then writes or delegates Project Control
reporting. A product WORK room may request an Evidence record, but PLAN or a
Project Control records lane writes Project Control records after acceptance.
Manual recovery fallback can preserve a lane result, but it does not satisfy
automatic return.

This keeps Core, Backend, and Editor WORK rooms focused on their owner
repository behavior while the PLAN room carries cross-repository context,
truth-promotion discipline, and follow-up sequencing.

## Revision Packet Loop

If acceptanceGate rejects or cannot accept a returned handoff, the PLAN room
must classify the result before opening dependent lanes:

- `needs-revision`: the lane goal remains valid, the same owner repository
  remains correct, and the same WORK room can repair missing handoff fields,
  missing verification, owner-scoped wording, or bounded implementation gaps.
- `rejected`: the result cannot be used for the lane because it violates the
  lane boundary, lacks a retrievable locator, lacks required evidence, writes
  FlowDoc-wide truth into a product repository, or cannot be safely revised.
- `blocked`: the lane cannot continue without a PLAN decision, user decision,
  unavailable dependency, or Contract Change Request.

For `needs-revision`, PLAN sends a Revision Packet back to the same WORK room
when the original retrievable locator is still usable. The packet must include:

- `revisionAttempt`;
- original lane ID, Work Type, owner repository, and dispatch set ID;
- original retrievable locator;
- `revisionReason`;
- exact missing or rejected acceptanceGate fields;
- allowed repair scope;
- forbidden scope that still applies;
- required additional tests, commit references, or wording corrections;
- whether a Contract Change Request is required instead of repair;
- the Return Channel, Liveness Signal, Death Signal, and next
  `livenessDeadline`.

The same WORK room must continue inside the original lane boundary. It may fix
handoff completeness, focused tests, owner-limited language, or the bounded
implementation required by the same lane. It must not redefine the round goal,
owner repository, source-of-truth rule, evidence target, or cross-repository
contract. If the repair needs any of those changes, it must return a Contract
Change Request to PLAN.

If the same WORK room is unavailable, cannot receive the Revision Packet, or
has lost its retrievable locator, PLAN records the room run as
`needs-attention`, `returned-silent`, `RISK`, `UNKNOWN`, or `blocked`, then
chooses whether to ask `ตูม` for the missing room reference, reopen the lane in
a new WORK room, shrink the dispatch set, or stop the round.

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
   include Work Type, Context Capsule, expected Context Acknowledgement,
   PLAN task/chat ID, Automatic Return Channel, Active Return Command, Return
   Event ID or handoff ID expectation, Liveness Signal, and Death Signal.
8. Record each room in the Room Run Registry with a retrievable locator,
   livenessDeadline, lastHeartbeatAt, and return-channel state. If creation
   returns only `clientThreadId`, record it as queued and resolve a real
   task/chat ID before treating the room as monitorable.
9. Wait for automatic returned handoffs. If a Return Channel misses its
   deadline, record `return-channel-failed` before any manual recovery
   fallback.
10. Put returned or recovered handoffs into `handoffInbox` and
    `completionQueue` with `arrivalSequence`.
11. Run `acceptanceGate` one handoff at a time.
12. Send Revision Packets to same WORK rooms for `needs-revision` results when
    the original locator is still usable, or record the fallback state when it
    is not.
13. Update Project Control records only from accepted handoffs and verified
    evidence.
14. Decide whether to dispatch the next set, revise the plan, block, or close
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
PLAN-room push. PLAN pulled the result by the available worktree, branch, and
terminal handoff locator, placed the discovered result into `handoffInbox`,
ran `acceptanceGate`, and recorded the lane decision in
`docs/domains/flowdoc-first-delivery-core-pdf-boundary-acceptance-2026-09-02.md`.
Core WORK room handoff has now been accepted by PLAN for
`lane-core-document-pdf-boundary` at Core commit
`da5011ceeac6e0b72b152a9a5029d684af978581`.

That acceptance is bounded to additive Core evidence for
`createVNextPublishedStructurePdfBoundaryPlanV1`. It does not prove Backend or
Editor adoption, gateway behavior, API key exposure, product database
persistence, artifact storage, PDF bytes, renderer execution, release
readiness, frontend readiness, FlowDoc product truth, or map truth. The first
Core WORK-room trial did not satisfy automatic return; it is a
`manual-recovered` lane acceptance and does not prove automatic WORK-to-PLAN
return. The next dispatch should choose Backend and/or Editor owner lanes only
after recording the dispatch set, dependencies, `parallelLimit`, Room Run
Registry entries, Automatic Return Channel, Return Event ID or handoff ID
expectation, Liveness Signal, Death Signal, `returnOrderPolicy`,
`arrivalSequence`, and acceptance order.

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
- Return Channel, Liveness Signal, Death Signal, livenessDeadline,
  lastHeartbeatAt, and any silent room decision;
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
