# FlowDoc Work Type Routing Model

## Authority Boundary

This document defines how a FlowDoc PLAN room classifies lane work before
dispatch, packages the understanding a WORK room must receive, and chooses
which reusable skill candidates may help a lane.

It is owned by Project Control under
`flowdoc-product-development-resumption > agent-and-skill-design`.

This is a Project Control coordination contract. It does not create packaged
Codex skills, does not open WORK rooms, does not edit Core, Backend, or Editor
behavior, and does not prove product readiness, UX readiness, API behavior,
PDF generation, FlowDoc product truth, or map truth.

Project Control owns shared coordination, records, source-of-truth boundaries,
and evidence targets. Product repositories own implementation behavior, tests,
runtime contracts, local setup, and product evidence.

## Work Context

- Work path: `flowdoc-product-development-resumption > agent-and-skill-design`
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with `planning-partner` and
  `documentation-authority-steward` responsibilities for the prose
- Current Phase: `phase-agent-and-skill-design-work-type-routing-model`
- Checklist target: `checklist-agent-and-skill-design-work-type-routing-model`
- Evidence target: `evidence-flowdoc-work-type-routing-model-2026-09-02`
- Known risks: future PLAN rooms may send a lane goal without the supporting
  understanding, WORK rooms may use the wrong role or tool path for the kind of
  work, UX artifacts may be mistaken for product truth, and branch or worktree
  names may be accepted as evidence without exact commits
- Unknown state: this document does not prove future Codex compliance, does not
  install new packaged local skills, and does not inspect current Core,
  Backend, or Editor implementation state

## Purpose

The PLAN room is the place that holds the round understanding. A WORK room
should not have to reconstruct the whole FlowDoc context from memory, and it
must not quietly invent scope when the handoff is thin.

Every executable lane should therefore carry two pieces of routing metadata:

- `Work Type`: the kind of work the lane is allowed to perform.
- `Context Capsule`: the bounded understanding the WORK room must receive and
  acknowledge before it starts.

`Work Type` is not a role, not a Work record kind, and not a packaged skill. It
is dispatch metadata used by the PLAN room to choose the right active role,
required reading, expected output, evidence shape, acceptance checks, and skill
candidate.

## Work Type Taxonomy

Use the narrowest Work Type that describes the lane's main output. If a lane
needs two primary Work Types, split the lane unless the PLAN room records why a
combined lane is safer.

| Work Type | Use When | Typical Role | Expected Output | Acceptance Focus |
| --- | --- | --- | --- | --- |
| `planning-coordination` | A PLAN or Project Control lane records round shape, lane cards, dispatch sets, or sequencing. | `planning-partner` or `project-control-steward` | Plan record, lane card, Kickoff Packet, dispatch set, risk/unknown list. | No product behavior edits; planned outcomes stay out of maps. |
| `product-implementation` | A WORK room edits Core, Backend, or Editor behavior inside one approved owner repository. | `product-implementation-agent` with boundary review as needed | Owner-repo commit, changed files, behavior summary, focused tests, PR Summary Draft. | Changed behavior requires exact commit from the owner repo and fresh owner-repo verification. |
| `evidence-review` | A lane checks whether returned work supports a claim or integration slice. | `evidence-reviewer` | Evidence packet, supported claims, rejected claims, exact commands, map recommendation if supported. | Claims remain narrow; unsupported claims stay RISK or UNKNOWN. |
| `documentation-authority` | A lane creates, migrates, bounds, summarizes, or retires FlowDoc Markdown or Project Control records. | `project-control-steward` with `documentation-authority-steward` | Project Control documents, records, Authority Boundary wording, guard updates, evidence target. | Project Control remains canonical for shared truth; repo-local Markdown stays bounded. |
| `ux-design-exploration` | A lane explores product flow, screen structure, mockups, screenshots, or prototype direction before implementation. | `planning-partner`, `product-implementation-agent`, or a future design role after approval | Design brief, mockup or prototype artifact, decision notes, accessibility risks, implementation handoff. | A design artifact is not product truth; implementation still needs owner-repo evidence. |
| `lane-reconciliation` | A lane reviews old branches, worktrees, duplicate room outputs, or merge/cleanup decisions. | `lane-reconciliation-reviewer` | Retain, merge, discard, or cleanup decision with exact refs and risk notes. | No dirty or unmerged lane is removed before unique patches are understood. |

## Context Capsule

A Kickoff Packet must include a Context Capsule before a WORK room starts. The
capsule is written for the assigned lane, not for FlowDoc in general.

Minimum fields:

- Room Mode: `WORK`
- Work Type
- Round ID or Work path
- Lane ID
- Owner repository or bounded repository set
- Active role and role overlays
- Allowed scope
- Forbidden scope
- Required reading
- Accepted facts the WORK room may rely on
- Risks and unknowns the WORK room must preserve
- Terminology decisions or ambiguity classifications
- Evidence target
- Stop condition
- Handoff format
- Retrievable locator requirement
- Contract Change Request trigger

The PLAN room should keep the capsule concise. If the capsule is too large to
review, the lane is probably too broad.

## Context Acknowledgement

Before edits, a WORK room must return or record a Context Acknowledgement. This
can be in the room's first response, Room Run Registry note, or bounded handoff
notes until Project Control has a dedicated Room Run schema.

Minimum acknowledgement:

- the Work Type it received;
- the Lane ID and owner repository;
- the allowed and forbidden scope;
- the required reading it completed or could not complete;
- the evidence target it will use;
- the risks and unknowns it will preserve;
- the stop conditions that will make it return to PLAN;
- the retrievable locator it will use for PLAN pull review.

If a WORK room cannot acknowledge the capsule, the lane remains
`needs-attention` or `blocked`. The PLAN room must revise the packet or ask the
user for the missing decision before accepting work from that room.

## Locator And Evidence Rule

A Room Run Registry entry must contain at least one retrievable locator: Codex
task/chat ID, worktree/branch, or handoff location. If none is known, the run is
not trackable enough for PLAN acceptance and must remain `needs-attention`,
`RISK`, or `UNKNOWN`.

Branches, worktrees, task IDs, screenshots, mockups, and handoff notes are
locators or supporting material. They are not enough to prove changed product
behavior. Changed behavior requires exact commit from the owning repository,
plus fresh verification from that repository when behavior changed.

For `ux-design-exploration`, the design artifact is not product truth. It may
shape a later implementation lane, but it cannot promote frontend readiness,
Core truth, Backend truth, Editor truth, map truth, or release readiness.

## Skill Candidate Routing

Reusable skills should still be created only after a workflow repeats enough to
prove its trigger, scope, inputs, outputs, and stop conditions.

Work Type can route a lane toward a skill candidate:

- `planning-coordination`: delivery round planning and dispatch-set drafting.
- `product-implementation`: repository-specific implementation and boundary
  review support.
- `evidence-review`: evidence registration and map recommendation support.
- `documentation-authority`: Markdown authority and document synthesis support.
- `ux-design-exploration`: UX audit, mockup, screenshot, or prototype support.
- `lane-reconciliation`: worktree, branch, and handoff reconciliation support.

Until a skill candidate becomes a packaged skill, the PLAN room must write the
needed instructions into the Context Capsule rather than assuming another room
will know them.

## PLAN Room Duties

When preparing a dispatch set, the PLAN room must:

1. assign one Work Type to every candidate lane;
2. split lanes whose primary outputs require conflicting Work Types;
3. write a Context Capsule for every lane chosen for dispatch;
4. record the expected Context Acknowledgement;
5. record the retrievable locator requirement in the Room Run Registry;
6. review returned handoffs against the lane's Work Type acceptance focus;
7. reject or return handoffs that lack exact commits, required verification, or
   required acknowledgement for their Work Type.

The PLAN room may use internal subagents for exploration, summarization, or
review. A real WORK room remains a separate Codex task/chat visible to the
user and must receive a full lane Context Capsule before implementation.

## First Delivery Round Application

The first delivery round should use this initial routing:

- `lane-project-control-round-records`: `documentation-authority`
- `lane-editor-structure-publish`: `product-implementation`
- `lane-backend-gateway-database`: `product-implementation`
- `lane-core-document-pdf-boundary`: `product-implementation`
- `lane-integration-evidence`: `evidence-review`

The PLAN room may revise a Work Type before dispatch if the lane boundary
changes. Any revision must be recorded in the lane card and Kickoff Packet.

## Handoff Requirement

A PLAN or WORK room using this model must report:

- PASS, FAIL, BLOCKER, RISK, and UNKNOWN statements as applicable;
- Work Type, Lane ID, Work ID, Phase ID, Checklist target, and Evidence target;
- Context Capsule sent or received;
- Context Acknowledgement result;
- retrievable locator used for pull review;
- files changed by repository;
- exact commits for changed behavior;
- tests run;
- evidence or map updates;
- claims intentionally not promoted;
- next recommended dispatch, revision, or cleanup step.

This keeps separate rooms useful without letting the context split become a
truth split.
