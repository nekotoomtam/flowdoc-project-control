# FlowDoc Delivery Operating Model

## Authority Boundary

This document defines the long-term delivery operating model for FlowDoc
planning, real multi-room execution, lane handoff, evidence registration, and
cross-repository coordination.

It is owned by Project Control under
`flowdoc-product-development-resumption > agent-and-skill-design`.

This is a Project Control coordination contract. It does not prove Core,
Backend, Editor, API, product database, PDF generation, compatibility, release
readiness, frontend readiness, FlowDoc product truth, or map truth.

Project Control owns shared FlowDoc understanding. Product repositories own
product behavior, tests, runtime contracts, local setup, and implementation
evidence.

## Work Context

- Work path: `flowdoc-product-development-resumption > agent-and-skill-design`
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with `planning-partner` and
  `documentation-authority-steward` responsibilities for the prose
- Current Phase: `phase-agent-and-skill-design-delivery-operating-model`
- Checklist target: `checklist-agent-and-skill-design-delivery-operating-model`
- Evidence target: focused Project Control guard for this document, generated
  Project Control read model, and full Project Control gate
- Known risks: future rooms may treat conversation memory as enough context,
  WORK rooms may redefine shared scope, product-repository Markdown may become
  duplicate authority, and generated SQLite may be mistaken for canonical truth
- Unknown state: this document does not inspect current Core, Backend, or Editor
  implementation readiness for the first delivery slice

## Collaboration Identity

- User name: `ตูม`.
- Assistant name: `โค`.
- FlowDoc rooms should address the user as `ตูม`.
- FlowDoc assistant rooms may refer to themselves as `โค`.
- This identity rule is collaboration context, not product evidence.

## Agent Shared Understanding

This document is not private context for one PLAN room. It is a shared
operating contract for future Codex rooms, WORK rooms, agents, and reviewers
participating in FlowDoc.

Every FlowDoc room must understand:

- Project Control is the shared source of truth.
- PLAN rooms define round intent, lane boundaries, owner repositories, and
  evidence targets.
- WORK rooms execute one approved lane only.
- WORK rooms do not redefine delivery scope, role authority, source-of-truth
  rules, or cross-repository contracts.
- If a room finds unclear ownership, missing evidence, or contract conflict, it
  reports `RISK`, `UNKNOWN`, `BLOCKED`, or a `Contract Change Request` back to
  the PLAN room.

## Room Mode Model

FlowDoc uses two room modes.

`PLAN` room coordinates work. It defines delivery rounds, splits lanes, prepares
Kickoff Packets, reviews handoffs, resolves conflicts, and decides what can be
promoted into Project Control.

`WORK` room executes one lane. It reads the Kickoff Packet, works only inside
the allowed scope, produces evidence, and returns a structured handoff.

A real opened room means a separate Codex task/chat visible to `ตูม`. It is not
the same thing as an internal subagent.

## Delivery Round Model

A delivery round is a bounded push toward a usable FlowDoc outcome.

Each round should define:

- Round ID
- Goal
- Lanes
- Owner repository per lane
- Allowed scope
- Forbidden scope
- Evidence targets
- Stop conditions
- Handoff requirements

Round planning records intent. It must not be promoted as product truth until
supported by repository-owned evidence.

## PLAN Room Orchestration

Use `docs/domains/flowdoc-plan-room-orchestration-rules.md` whenever a PLAN
room may open or coordinate more than one real WORK room.

The PLAN Room Orchestration Rules define how the PLAN room chooses
`N WORK rooms`, records `parallelLimit`, builds `laneDependencyGraph`, creates
a dispatch set, tracks Room Run Registry entries, pulls missing handoffs,
stages returned work in `handoffInbox`, processes `completionQueue`, and runs
`acceptanceGate` before accepting lane output or opening dependent lanes.

Those rules extend this Delivery Operating Model. They do not open WORK rooms
by themselves and do not prove product behavior or map truth.

Use the Work Type Routing Model at
`docs/domains/flowdoc-work-type-routing-model.md` before assigning Work Type to
lane cards, writing a lane Context Capsule, requiring Context Acknowledgement,
choosing reusable skill candidates, or accepting a returned handoff by Work
Type. Work Type routing extends the Delivery Operating Model without creating
packaged Codex skills or product evidence by itself.

## First Delivery Slice

The first delivery slice is:

```text
Structure creation -> API/key exposure -> data input -> PDF output
```

The target outcome is:

- A user can create or define a real document structure.
- That structure can be exposed through an API-facing surface.
- The system can provide the API key and required input-data shape.
- A caller can submit the required data.
- The system can produce a PDF document from that structure and data.

This first slice is not the definition of the whole operating model. It is the
first use of the operating model.

## Gateway Boundary

The gateway lane must define the delivery API surface before product
implementation starts:

- Authentication or API key behavior.
- Endpoint shape.
- Required request body.
- Validation and error shape.
- Job or synchronous response behavior.
- PDF download or artifact retrieval behavior.

This document does not prove that any gateway behavior exists.

## Product Database Boundary

The product database is separate from Project Control SQLite.

The first delivery slice may need product database records for:

- Published structure reference.
- API key hash or credential reference.
- Required input schema.
- Generation job status.
- PDF artifact pointer.
- Minimal audit metadata.

Project Control JSON and Markdown remain canonical for Project Control truth.
generated SQLite is only a local projection for lookup and reference.

## Project Control Reference ID Contract

FlowDoc rooms should coordinate with stable IDs:

- `roundId`
- `laneId`
- `workId`
- `phaseId`
- `checklistId`
- `evidenceTargetId`
- `documentId`
- `ownerRepoId`
- `handoffId`
- `prSummaryDraftId`

These IDs let PLAN and WORK rooms refer to the same object without rewriting
shared meaning.

## Lane Card Template

Each lane should define:

- Lane ID
- Work Type
- Goal
- Owner repository
- Active role
- Allowed scope
- Forbidden scope
- Inputs
- Context Capsule
- Expected output
- Evidence target
- Stop condition
- Handoff format

## WORK Room Kickoff Rule

A WORK room must receive a Kickoff Packet before it starts.

The Kickoff Packet must include:

- Room Mode: `WORK`
- Lane ID
- Work Type
- Source of truth
- Owner repository
- Allowed scope
- Forbidden scope
- Required reading
- Context Capsule
- Expected Context Acknowledgement
- Expected output
- Evidence target
- Stop condition
- Handoff format

A WORK room prompt must not say only "build FlowDoc" or "build the MVP". It
must assign one bounded lane.

## First Delivery Slice Lane Draft

The first delivery slice should be split into candidate lanes before any WORK
room is opened. This section is a planning draft, not execution authority.

- Project Control delivery round lane: records the round, lane cards, kickoff
  packets, checklist targets, and evidence targets in Project Control.
- Editor structure lane: inspects and implements only the Editor-owned path for
  creating or publishing the document structure required by the slice.
- Backend gateway and product database lane: inspects and implements only the
  Backend-owned API key, endpoint, persistence, job, and artifact boundary.
- Core document and PDF boundary lane: inspects and implements only the
  Core-owned document semantics and any Core contract needed by PDF generation.
- Integration evidence lane: runs the narrow cross-repository proof after the
  owner lanes return handoffs.

Each lane becomes executable only after the PLAN room creates a specific Lane
Card and Kickoff Packet.

The first concrete Project Control round plan for this slice is
`docs/domains/flowdoc-first-delivery-round-plan.md`. That plan is dispatch
coordination only; it does not prove product behavior or open WORK rooms by
itself.

## Handoff Rule

Each WORK room returns:

- PASS / FAIL / BLOCKER / RISK / UNKNOWN
- Lane ID
- Work Type
- Context Acknowledgement result
- Work ID / Phase ID / Checklist item IDs, if assigned
- Files changed
- Behavior changed
- Tests run
- Evidence produced
- Claims not promoted
- Open risks
- PR Summary Draft

The PR Summary Draft is handoff material. It is not a separate source of
product truth.

## PLAN-owned reporting

Product WORK rooms return evidence candidate handoffs and must not
self-promote Project Control truth, map truth, accepted lane status, or round
status. PLAN receives or pulls returned handoffs, stages them in
`handoffInbox`, runs `acceptanceGate`, and writes Project Control records
itself or delegates that reporting after acceptance.

If accepted work needs Project Control record writing, PLAN may use a Project
Control records lane. If returned work is incomplete but still inside the
original lane, PLAN marks it `needs-revision` and sends a Revision Packet back
to the same WORK room when the original retrievable locator remains usable.
The same WORK room may repair only the original lane. If repair needs a
different owner, source-of-truth rule, evidence target, or cross-repository
contract, the WORK room returns a Contract Change Request.

## Contract Change Request

A WORK room must stop and send a Contract Change Request when it needs to
change:

- Delivery scope
- Gateway behavior
- Product database boundary
- Cross-repository contract
- Source-of-truth rule
- Role responsibility
- Evidence requirement

The PLAN room decides whether to accept, revise, split, or reject the change.

## Stop Conditions

Stop and return to the PLAN room when:

- Owner repository is unclear.
- Evidence target is missing.
- Work path, Phase, or Checklist target cannot be resolved before edits.
- A lane needs another lane's contract to change.
- Product behavior claim lacks repository-owned evidence.
- A room would need to write FlowDoc-wide truth into a product repository.

