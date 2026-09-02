# FlowDoc First Delivery Round Plan

## Authority Boundary

This document records the first FlowDoc delivery round plan under the Project
Control Delivery Operating Model.

It is owned by Project Control under
`flowdoc-product-development-resumption > flowdoc-first-delivery-round`.

This is a Project Control planning and coordination contract. It does not prove
Core, Backend, Editor, gateway behavior, API key behavior, product database
behavior, PDF generation, compatibility, release readiness, frontend readiness,
FlowDoc product truth, or map truth.

Project Control owns the shared plan, IDs, lane boundaries, Kickoff Packets,
Checklist target, and Evidence target. Product repositories own product
behavior, tests, runtime contracts, local setup, and implementation evidence.

## Work Context

- Work path: `flowdoc-product-development-resumption > flowdoc-first-delivery-round`
- Owner repository: `repo-project-control`
- Bounded repository set: `repo-project-control`, `repo-editor`,
  `repo-backend`, `repo-core`
- Active role: `planning-partner`, with
  `documentation-authority-steward` and `project-control-steward`
  responsibilities for this Project Control record
- Current Phase: `phase-flowdoc-first-delivery-round-plan`
- Checklist target: `checklist-flowdoc-first-delivery-round-plan`
- Evidence target:
  `evidence-flowdoc-first-delivery-round-plan-2026-09-01`
- Room mode for this work: `PLAN`
- User name: `ตูม`
- Assistant name: `โค`
- Known risks: planned lane wording may be mistaken for product truth, WORK
  rooms may expand their own scope, product database language may be confused
  with Project Control SQLite, and the accepted Core PDF boundary may be
  mistaken for Backend, Editor, renderer, gateway, storage, or end-to-end
  delivery evidence.
- Unknown state: the original planning phase did not open real WORK rooms. A
  later approved Core WORK room has now returned and been accepted by PLAN, but
  current Backend, Editor, renderer, storage, API-key gateway, and integration
  behavior remain unverified by this plan.

## Source Documents

- [FlowDoc Delivery Operating Model](flowdoc-delivery-operating-model.md)
- [FlowDoc PLAN Room Orchestration Rules](flowdoc-plan-room-orchestration-rules.md)
- [FlowDoc Work Type Routing Model](flowdoc-work-type-routing-model.md)
- [FlowDoc Round Workflow](flowdoc-round-workflow.md)
- [Work Tree Operating Rules](work-tree-operating-rules.md)
- [Document Map Operating Rules](document-map-operating-rules.md)
- [FlowDoc Documentation Authority Policy](flowdoc-documentation-authority-policy.md)
- [FlowDoc Agent Documentation Authority Operating Rules](flowdoc-agent-documentation-authority-operating-rules.md)
- [FlowDoc Role Catalog](flowdoc-role-catalog.md)
- [Agent and Skill Operating Model](agent-and-skill-operating-model.md)
- [FlowDoc Product Terminology](flowdoc-product-terminology.md)
- [Thai Product Terminology Companion](flowdoc-product-terminology-th.md)
- [FlowDoc System Map](flowdoc-system-map.md)

## Round Goal

Prepare the first delivery round so separate WORK rooms can execute bounded
lanes without redefining scope.

The First Delivery Slice is:

```text
Structure creation -> API/key exposure -> data input -> PDF output
```

The target outcome for the product work, after later WORK rooms produce
repository-owned evidence, is:

- A user can create or define a real document structure.
- That structure can be exposed through an API-facing surface.
- The system can provide an API key and the required input-data shape.
- A caller can submit the required data.
- The system can produce a PDF document from that structure and data.

## Round Non-Goals

- Do not edit Core, Backend, or Editor product behavior in this PLAN room.
- Do not open a real WORK room until `ตูม` approves a specific lane.
- Do not store secrets, copied API keys, or credential material in Project
  Control.
- Do not define a product database schema in Project Control as if it were
  Backend-owned code.
- Do not claim PDF generation exists, is usable, or is integrated.
- Do not update the FlowDoc system map with planned product outcomes.
- Do not create product-repository Markdown for FlowDoc-wide plans.

## Terminology Decisions

- `First Delivery Slice`: `define`. In this round, this means the bounded
  path from structure creation to API/key exposure, data input, and PDF output.
  It is not the full FlowDoc product definition.
- `API key`: `define`. In this round, this means a Backend-owned credential or
  credential reference used by the delivery gateway. Project Control may name
  the boundary, but it must not hold real secrets.
- `Gateway`: `define`. In this round, this means the Backend-owned API-facing
  boundary for submitting data and retrieving or receiving the PDF artifact,
  unless a later Contract Change Request revises ownership.
- `Product database`: `split`. This means Backend-owned durable product
  persistence. It is separate from Project Control JSON records and generated
  Project Control SQLite.
- `Project Control SQLite`: `context-only`. This is an ignored local projection
  for lookup and GUI support. It is not canonical Project Control truth and is
  not the product database.
- `PDF output`: `define`. In this round, this means the exported document
  artifact target produced from a structure and input data. Ownership of the
  generation boundary must be confirmed by the Core and Backend lanes before
  implementation claims are promoted.
- `Room`: `define`. A WORK room is a real separate Codex task/chat visible to
  `ตูม`, not an internal subagent.

## Work Type Routing

Use `docs/domains/flowdoc-work-type-routing-model.md` before dispatching these
lanes. Each Lane Card and Kickoff Packet must include a Work Type, Context
Capsule, expected Context Acknowledgement, Return Channel, Liveness Signal,
Death Signal, and retrievable locator requirement.

The Context Capsule must carry the lane-specific understanding from this PLAN
room: owner repository, active role, allowed scope, forbidden scope, required
reading, accepted facts, risks, unknowns, terminology decisions, Evidence
target, stop condition, handoff format, and Contract Change Request trigger.
It must also name the mandatory WORK room return path so a terminal return of
PASS / FAIL / BLOCKER / RISK / UNKNOWN reaches the PLAN room.

The Context Acknowledgement must be checked before implementation starts. If a
WORK room cannot acknowledge the capsule, the room stays `needs-attention` or
`blocked` until the PLAN room revises the packet or asks `ตูม` for a missing
decision.

The PLAN room must record liveness for every opened WORK room. A silent room,
lost room, or room without terminal return must not be accepted. The PLAN room
must use the retrievable locator to pull the result, record a Death Signal when
the room cannot be recovered, and continue by revising, reopening, blocking, or
asking `ตูม` for the missing room reference.

Automatic WORK-to-PLAN return is mandatory for this round. Each WORK room must
have a Return Channel that sends its Terminal Handoff to PLAN or a PLAN-owned
monitor without requiring `ตูม` to copy/paste Terminal Handoffs. A manual
recovery fallback may preserve work if the Return Channel fails, but PLAN must
record `manual-recovered` or `return-channel-failed`, and that recovery does
not satisfy automatic return.

For the next real-room dispatch, automatic return must be an active
WORK-to-PLAN return push. The Kickoff Packet must include the PLAN task/chat
ID, Return Event ID or handoff ID, and Active Return Command; when Codex thread
tools expose `send_message_to_thread`, WORK uses that command to send the
Terminal Handoff back to PLAN before or with its own final answer. A WORK room
final answer alone is not enough for PLAN to continue automatically.

The 2026-09-02 Editor plus Project Control return-channel probe showed that a
clientThreadId-only dispatch did not satisfy automatic return. Both WORK
results were retrievable later, but PLAN had to discover real task IDs through
session/worktree locators before it could read or wait on the rooms. Classify
that result as `return-channel-failed-then-recovered` or `manual-recovered`,
not `automatic-returned`. `clientThreadId` alone is not a monitorable
retrievable locator, and PLAN must not treat it as enough for a scalable
multi-WORK dispatch set.

After the active return-channel hardening, the 2026-09-02 single-room active
return smoke test opened projectless WORK task
`01a0610f-d236-73e1-a4ff-d79fb9f2bd3e` with handoff ID
`handoff-return-channel-smoke-2026-09-02-01`. The WORK room sent
`WORK RETURN EVENT: handoff-return-channel-smoke-2026-09-02-01` back to this
PLAN room with `mcp__codex_app.send_message_to_thread`. PLAN classifies that
handoff as `automatic-returned` for single-room return-channel liveness only.
It does not prove multi-WORK close-together returns, product WORK
implementation returns, queued `clientThreadId` dispatch, evidence promotion,
or FlowDoc product truth.

The 2026-09-02 two-room active return queue smoke test opened projectless WORK
tasks `01a06123-7bb2-7e12-b8fc-1efeaa8d99cc` and
`01a06123-d366-7a93-b57a-3291cf673b98` under dispatch set
`dispatch-return-channel-queue-2026-09-02-01`. Both rooms pushed distinct
Terminal Handoffs to this PLAN room with `mcp__codex_app.send_message_to_thread`:
`handoff-return-channel-queue-alpha-2026-09-02-01` entered
`completionQueue` as arrivalSequence 1, and
`handoff-return-channel-queue-beta-2026-09-02-01` entered
`completionQueue` as arrivalSequence 2. PLAN processed the two read-only
handoffs one at a time through the smoke acceptance check. This supports only
projectless read-only multi-WORK return queue liveness on this local host; it
does not prove product WORK implementation return, queued `clientThreadId`
dispatch, product evidence promotion, or FlowDoc product truth.

If PLAN opens multiple active WORK rooms, it must keep every room in the Room
Run Registry, accept close-together returns into `completionQueue`, assign
`arrivalSequence`, apply `returnOrderPolicy`, treat a duplicate handoff
idempotently, and run `acceptanceGate` on one queued handoff at a time.

## Lane Cards

### lane-project-control-round-records

- Room Mode: `WORK`
- Work Type: `documentation-authority`
- Goal: keep this first delivery round registered in Project Control as lanes
  and evidence come back.
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with
  `documentation-authority-steward` responsibility
- Allowed scope: update Project Control Work, Phase, Checklist, Document,
  Evidence, and generated read-model records for this delivery round.
- Forbidden scope: product behavior edits, product repository Markdown for
  FlowDoc-wide truth, map promotion from planned outcomes, real secret storage,
  and opening other WORK rooms without PLAN room approval.
- Inputs: this plan, the Delivery Operating Model, returned lane handoffs, and
  repository-owned evidence from later WORK rooms.
- Context Capsule: Project Control owns this lane's records, authority
  boundaries, evidence target, generated read-model update, and no-product-edit
  rule.
- Expected output: Project Control records that cite exact owner repository
  commits, checks, supported claims, risks, unknowns, and intentionally
  unpromoted product states.
- Evidence target: Project Control focused guards, `npm run generate`,
  `npm run check:data`, and `npm run check`.
- Stop condition: an evidence claim lacks repository id, exact commit,
  path/contract id, verification summary, or owner-limited wording.
- Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN, Work ID, Phase ID, Checklist
  item IDs, evidence IDs, files changed, tests run, map changes, unpromoted
  claims, and next lane recommendation.

### lane-editor-structure-publish

- Room Mode: `WORK`
- Work Type: `product-implementation`
- Goal: inspect and implement the Editor-owned path for creating or publishing
  the document structure needed by the First Delivery Slice.
- Owner repository: `repo-editor`
- Active role: `product-implementation-agent`, with
  `cross-repo-boundary-reviewer` responsibility when the lane touches Backend
  or Core contracts.
- Allowed scope: Editor-owned browser runtime, UI behavior, Editor draft,
  structure creation affordance, publish action boundary, and Editor tests.
- Forbidden scope: Backend gateway implementation, Backend storage schema,
  Core document semantics, Project Control truth promotion, product-wide
  Markdown plans, and unqualified `Node` wording.
- Inputs: this plan, FlowDoc product terminology, Editor `AGENTS.md`, relevant
  Editor source/tests, and any existing Editor handoff/evidence records cited
  by Project Control.
- Context Capsule: Editor owns the browser runtime and structure/publish UI
  boundary; Backend gateway, Core semantics, Project Control truth, and product
  Markdown authority stay outside this lane.
- Expected output: an Editor handoff stating whether the structure creation and
  publish boundary is implemented, blocked, risk-bearing, or unknown.
- Evidence target: Editor commit, exact changed files, focused Editor tests,
  full Editor gate when available, and remaining product states not promoted.
- Stop condition: publish ownership depends on a Backend gateway contract that
  does not exist or conflicts with the lane boundary.
- Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN, lane ID, changed Editor
  behavior, tests run, evidence candidate, Contract Change Request if needed,
  and PR Summary Draft.

### lane-backend-gateway-database

- Room Mode: `WORK`
- Work Type: `product-implementation`
- Goal: inspect and implement the Backend-owned API key, gateway, product
  database, job, and artifact boundary needed by the First Delivery Slice.
- Owner repository: `repo-backend`
- Active role: `product-implementation-agent`, with
  `cross-repo-boundary-reviewer` responsibility for Core and Editor contracts.
- Allowed scope: Backend routes, request/response contracts, API key or
  credential reference behavior, product database persistence, job status,
  artifact pointer, validation, and Backend tests.
- Forbidden scope: Project Control SQLite as product persistence, real secret
  values in source or Project Control, copied Core operation semantics,
  Editor UI behavior, PDF rendering claims that lack Core or renderer evidence,
  and product-wide Markdown plans.
- Inputs: this plan, FlowDoc product terminology, Backend `AGENTS.md`, Backend
  source/tests, Core contract references as allowed by Backend, and returned
  Editor/Core handoffs when sequencing requires them.
- Context Capsule: Backend owns gateway, credential reference, persistence,
  job, validation, and artifact boundary decisions; Project Control SQLite is
  not product persistence and real secrets must not be stored.
- Expected output: a Backend handoff naming the gateway contract, credential
  boundary, persistence shape, generation job or synchronous response decision,
  artifact retrieval boundary, and evidence status.
- Evidence target: Backend commit, exact route/contract/storage files, focused
  Backend tests, full Backend gate when available, and no secret material.
- Stop condition: the lane needs to change Core document semantics, PDF
  ownership, Editor publish expectations, or source-of-truth rules.
- Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN, lane ID, contract files,
  tests run, evidence candidate, Contract Change Request if needed, and PR
  Summary Draft.

### lane-core-document-pdf-boundary

- Room Mode: `WORK`
- Work Type: `product-implementation`
- Goal: inspect and implement the Core-owned document package semantics and
  any Core-owned contract needed to transform structure plus input data toward
  PDF output.
- Owner repository: `repo-core`
- Active role: `product-implementation-agent`, with
  `cross-repo-boundary-reviewer` responsibility when exposing contracts to
  Backend or Editor.
- Allowed scope: Core document package schema, validation, mutation contracts,
  template/data binding semantics, generation input contract, and Core tests.
- Forbidden scope: Backend HTTP routes, Backend product database storage,
  Editor browser UI state, Project Control product truth promotion, PDF
  artifact service claims without owner evidence, and product-wide Markdown
  plans.
- Inputs: this plan, FlowDoc product terminology, Core `AGENTS.md`, Core
  document maps, Core contracts/tests, and Backend gateway boundary questions
  when available.
- Context Capsule: Core owns document package semantics, validation, mutation
  contracts, template/data binding semantics, and generation input contracts;
  Backend routes, Editor UI, and Project Control truth stay outside this lane.
- Expected output: a Core handoff stating the Core package/data/PDF contract
  boundary, implemented or blocked behavior, evidence candidate, and ownership
  questions that need PLAN room resolution.
- Evidence target: Core commit, exact contract/schema/test paths, focused Core
  tests, full Core gate when available, and remaining unknowns for renderer or
  artifact service ownership.
- Stop condition: the lane cannot identify whether PDF output is Core-owned,
  Backend-owned, split, or blocked for this delivery round.
- Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN, lane ID, contract boundary,
  tests run, evidence candidate, Contract Change Request if needed, and PR
  Summary Draft.

### lane-integration-evidence

- Room Mode: `WORK`
- Work Type: `evidence-review`
- Goal: run the narrow end-to-end evidence round after owner lanes return
  accepted handoffs.
- Owner repository: bounded set of `repo-editor`, `repo-backend`, `repo-core`,
  and `repo-project-control`
- Active role: `evidence-reviewer`, with `cross-repo-boundary-reviewer`
  responsibility
- Allowed scope: integration harness, smoke test orchestration, evidence
  collection, Project Control evidence registration after verified owner-lane
  commits, and narrow map recommendation if supported.
- Forbidden scope: feature implementation before owner lane handoffs, broad
  product readiness claims, map promotion from partial smoke, repo-local
  FlowDoc-wide plans, and unreviewed contract rewrites.
- Inputs: accepted handoffs from Editor, Backend, Core, exact commits, test
  commands, artifact paths, and the current Project Control evidence policy.
- Context Capsule: this lane starts only after owner-lane handoffs are accepted
  and must keep integration smoke results bounded to exact commits, commands,
  route or artifact paths, and unpromoted product states.
- Expected output: an evidence packet stating whether the First Delivery Slice
  passed, failed, is blocked, is risk-bearing, or remains unknown.
- Evidence target: exact repository commits, exact commands, exact route or
  artifact paths, and Project Control Evidence records for only the verified
  claim.
- Stop condition: any owner lane lacks accepted evidence, the test requires an
  undeclared cross-repository contract change, or the result cannot be bounded.
- Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN, lane ID, repositories
  checked, commands and results, evidence records to add, map recommendation,
  and PR Summary Draft.

## WORK Room Kickoff Packets

Use these packets only after `ตูม` approves opening the specific room.

### Kickoff: lane-project-control-round-records

```text
Room Mode: WORK
Work Type: documentation-authority
Lane ID: lane-project-control-round-records
Source of truth: Project Control records and docs/domains/flowdoc-first-delivery-round-plan.md
Owner repository: repo-project-control
Allowed scope: Project Control Work, Phase, Checklist, Document, Evidence, and generated read-model records for this round.
Forbidden scope: product behavior, product repository Markdown for FlowDoc-wide truth, map promotion from planned outcomes, and real secret storage.
Required reading: Project Control AGENTS.md; FlowDoc Delivery Operating Model; FlowDoc First Delivery Round Plan; FlowDoc Product Terminology and Thai companion; Documentation Authority Operating Rules.
Context Capsule: Project Control owns this lane's round records, authority boundaries, evidence registration language, generated read-model update, and no-product-edit rule.
Context Acknowledgement: before edits, repeat the Work Type, lane ID, owner repository, allowed/forbidden scope, evidence target, stop condition, and retrievable locator that PLAN can use for pull review.
Return Channel: send the terminal return back to the PLAN room handoffInbox for this lane.
Liveness Signal: PLAN tracks the room through the Room Run Registry, retrievable locator, last observed state, and livenessDeadline.
Death Signal: if the room disappears or cannot return, PLAN marks the room as a silent room with returned-silent, RISK, UNKNOWN, or blocked and the lane must not be accepted.
Expected output: bounded Project Control record updates for returned lane evidence.
Evidence target: focused Project Control guard, npm run generate, npm run check:data, npm run check.
Stop condition: missing repository id, commit, path/contract id, verification summary, or owner-limited claim.
Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN plus Work ID, Phase ID, Checklist item IDs, evidence IDs, files changed, tests run, map changes, unpromoted claims, and next recommendation.
```

### Kickoff: lane-editor-structure-publish

```text
Room Mode: WORK
Work Type: product-implementation
Lane ID: lane-editor-structure-publish
Source of truth: Project Control records and docs/domains/flowdoc-first-delivery-round-plan.md
Owner repository: repo-editor
Allowed scope: Editor-owned structure creation, publish boundary, Editor draft, browser runtime, and Editor tests.
Forbidden scope: Backend gateway implementation, Backend product database, Core document semantics, Project Control truth promotion, and product-wide Markdown plans.
Required reading: Project Control AGENTS.md; FlowDoc First Delivery Round Plan; FlowDoc Product Terminology and Thai companion; Editor AGENTS.md; relevant Editor source/tests.
Context Capsule: Editor owns browser runtime and structure/publish UI behavior only; Backend gateway, Core semantics, Project Control truth, and product Markdown authority stay outside this lane.
Context Acknowledgement: before edits, repeat the Work Type, lane ID, owner repository, allowed/forbidden scope, required reading completed, evidence target, stop condition, and retrievable locator that PLAN can use for pull review.
Return Channel: send the terminal return back to the PLAN room handoffInbox for this lane.
Liveness Signal: PLAN tracks the room through the Room Run Registry, retrievable locator, last observed state, and livenessDeadline.
Death Signal: if the room disappears or cannot return, PLAN marks the room as a silent room with returned-silent, RISK, UNKNOWN, or blocked and the lane must not be accepted.
Expected output: Editor handoff for the structure creation and publish boundary.
Evidence target: Editor commit, exact files, focused Editor tests, full Editor gate when available, and unpromoted product states.
Stop condition: publish ownership depends on an unresolved Backend gateway contract.
Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN plus lane ID, changed behavior, tests run, evidence candidate, Contract Change Request if needed, and PR Summary Draft.
```

### Kickoff: lane-backend-gateway-database

```text
Room Mode: WORK
Work Type: product-implementation
Lane ID: lane-backend-gateway-database
Source of truth: Project Control records and docs/domains/flowdoc-first-delivery-round-plan.md
Owner repository: repo-backend
Allowed scope: Backend API key or credential reference behavior, gateway routes, product database persistence, job status, artifact pointer, validation, and Backend tests.
Forbidden scope: Project Control SQLite as product persistence, real secret values in source or Project Control, copied Core operation semantics, Editor UI behavior, and product-wide Markdown plans.
Required reading: Project Control AGENTS.md; FlowDoc First Delivery Round Plan; FlowDoc Product Terminology and Thai companion; Backend AGENTS.md; relevant Backend source/tests; Core contracts only through approved boundaries.
Context Capsule: Backend owns gateway, credential reference, persistence, job, validation, and artifact boundaries; Project Control SQLite is not product persistence and real secrets must not be stored.
Context Acknowledgement: before edits, repeat the Work Type, lane ID, owner repository, allowed/forbidden scope, required reading completed, evidence target, stop condition, and retrievable locator that PLAN can use for pull review.
Return Channel: send the terminal return back to the PLAN room handoffInbox for this lane.
Liveness Signal: PLAN tracks the room through the Room Run Registry, retrievable locator, last observed state, and livenessDeadline.
Death Signal: if the room disappears or cannot return, PLAN marks the room as a silent room with returned-silent, RISK, UNKNOWN, or blocked and the lane must not be accepted.
Expected output: Backend handoff for gateway, credential, persistence, job, and artifact boundaries.
Evidence target: Backend commit, exact route/contract/storage paths, focused Backend tests, full Backend gate when available, and no secret material.
Stop condition: the lane needs to change Core semantics, PDF ownership, Editor publish expectations, or source-of-truth rules.
Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN plus lane ID, contract files, tests run, evidence candidate, Contract Change Request if needed, and PR Summary Draft.
```

### Kickoff: lane-core-document-pdf-boundary

```text
Room Mode: WORK
Work Type: product-implementation
Lane ID: lane-core-document-pdf-boundary
Source of truth: Project Control records and docs/domains/flowdoc-first-delivery-round-plan.md
Owner repository: repo-core
Allowed scope: Core document package schema, validation, mutation contracts, template/data binding semantics, generation input contract, and Core tests.
Forbidden scope: Backend HTTP routes, Backend product database storage, Editor browser UI state, Project Control product truth promotion, and product-wide Markdown plans.
Required reading: Project Control AGENTS.md; FlowDoc First Delivery Round Plan; FlowDoc Product Terminology and Thai companion; Core AGENTS.md; relevant Core document maps/contracts/tests.
Context Capsule: Core owns document package semantics, validation, mutation contracts, template/data binding semantics, and generation input contracts; Backend routes, Editor UI, and Project Control truth stay outside this lane.
Context Acknowledgement: before edits, repeat the Work Type, lane ID, owner repository, allowed/forbidden scope, required reading completed, evidence target, stop condition, and retrievable locator that PLAN can use for pull review.
Return Channel: send the terminal return back to the PLAN room handoffInbox for this lane.
Liveness Signal: PLAN tracks the room through the Room Run Registry, retrievable locator, last observed state, and livenessDeadline.
Death Signal: if the room disappears or cannot return, PLAN marks the room as a silent room with returned-silent, RISK, UNKNOWN, or blocked and the lane must not be accepted.
Expected output: Core handoff for document package, data binding, and PDF boundary questions.
Evidence target: Core commit, exact contract/schema/test paths, focused Core tests, full Core gate when available, and unknown renderer or artifact service ownership.
Stop condition: PDF output ownership cannot be identified as Core-owned, Backend-owned, split, or blocked.
Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN plus lane ID, contract boundary, tests run, evidence candidate, Contract Change Request if needed, and PR Summary Draft.
```

### Kickoff: lane-integration-evidence

```text
Room Mode: WORK
Work Type: evidence-review
Lane ID: lane-integration-evidence
Source of truth: accepted owner-lane handoffs plus Project Control records and docs/domains/flowdoc-first-delivery-round-plan.md
Owner repository: bounded set of repo-editor, repo-backend, repo-core, and repo-project-control
Allowed scope: integration harness, smoke evidence collection, Project Control evidence registration, and narrow map recommendation if supported.
Forbidden scope: feature implementation before owner-lane handoffs, broad product readiness claims, map promotion from partial smoke, repo-local FlowDoc-wide plans, and unreviewed contract rewrites.
Required reading: Project Control AGENTS.md; FlowDoc First Delivery Round Plan; FlowDoc Product Terminology and Thai companion; owner-lane handoffs; relevant owner repository AGENTS.md files for any repo touched.
Context Capsule: this lane starts only after owner-lane handoffs are accepted and keeps integration smoke results bounded to exact commits, commands, route or artifact paths, and unpromoted product states.
Context Acknowledgement: before edits, repeat the Work Type, lane ID, bounded repository set, accepted owner-lane handoffs, evidence target, stop condition, and retrievable locator that PLAN can use for pull review.
Return Channel: send the terminal return back to the PLAN room handoffInbox for this lane.
Liveness Signal: PLAN tracks the room through the Room Run Registry, retrievable locator, last observed state, and livenessDeadline.
Death Signal: if the room disappears or cannot return, PLAN marks the room as a silent room with returned-silent, RISK, UNKNOWN, or blocked and the lane must not be accepted.
Expected output: bounded evidence packet for the First Delivery Slice.
Evidence target: exact repository commits, exact commands, route or artifact paths, and Project Control Evidence records for only verified claims.
Stop condition: an owner lane lacks accepted evidence or an undeclared cross-repository contract change is required.
Handoff format: PASS/FAIL/BLOCKER/RISK/UNKNOWN plus lane ID, repositories checked, commands and results, evidence records to add, map recommendation, and PR Summary Draft.
```

## PLAN Room Dispatch Rules

No real WORK room has been opened by this plan. Opening a WORK room requires
`ตูม` to approve one specific lane or one revised lane set.

Use `docs/domains/flowdoc-plan-room-orchestration-rules.md` before opening a
dispatch set with more than one real WORK room. The PLAN room must record the
selected lane IDs, Work Types, Context Capsules, expected Context
Acknowledgement, Return Channel, Liveness Signal, Death Signal,
`parallelLimit`, `laneDependencyGraph`, held-back lanes, Room Run Registry
entries, retrievable locators, and the expected acceptance order before
treating the set as dispatch-ready.

The PLAN room must give each WORK room the matching Kickoff Packet and Context
Capsule. A WORK room must not redefine the round goal, owner repository,
source-of-truth rule, evidence target, or cross-repository contract. If the
WORK room finds that the packet is wrong, it must stop and return a Contract
Change Request instead of silently changing scope.

Product WORK rooms for Core, Backend, and Editor must not write Project Control
acceptance records, Project Control Evidence records, map truth, or accepted
lane status for their own output; in short, they must not self-promote. They
return an evidence candidate and Terminal Handoff. PLAN-owned reporting means
this PLAN room receives that handoff through the mandatory automatic Return
Channel, places it in `handoffInbox`, runs `acceptanceGate`, and writes Project
Control records itself or delegates them to `lane-project-control-round-records`
after acceptance. PLAN may pull by retrievable locator only as a manual
recovery fallback when a Return Channel fails; that does not satisfy automatic
return and must not require `ตูม` to copy/paste Terminal Handoffs for ordinary
progress.

If `acceptanceGate` returns `needs-revision`, PLAN sends a Revision Packet back
to the same WORK room when the original retrievable locator is still available.
The Revision Packet must name the original lane, `revisionAttempt`, exact
acceptance gaps, allowed repair scope, still-forbidden scope, required
verification, Return Channel, Liveness Signal, Death Signal, and whether a
Contract Change Request is required. The same WORK room may repair the original
lane only; it must not expand owner repository, source-of-truth rule, evidence
target, or cross-repository contract on its own.

The Core WORK room returned a handoff candidate outside automatic PLAN-room
push. PLAN pulled the result by the available worktree, branch, and terminal
handoff locator, put the candidate result into `handoffInbox`, processed it
through `acceptanceGate`, and recorded the decision in
`docs/domains/flowdoc-first-delivery-core-pdf-boundary-acceptance-2026-09-02.md`.
Core WORK room handoff has now been accepted by PLAN for
`lane-core-document-pdf-boundary` at Core commit
`da5011ceeac6e0b72b152a9a5029d684af978581`.

This acceptance is bounded to the additive Core contract
`createVNextPublishedStructurePdfBoundaryPlanV1`. Backend and Editor have not
adopted this Core boundary yet, and the acceptance does not prove gateway
behavior, API key exposure, product database persistence, artifact storage,
PDF bytes, renderer execution, release readiness, frontend readiness, FlowDoc
product truth, or map truth.

The first Core WORK-room trial did not satisfy automatic return. PLAN accepted
the bounded Core product evidence as `manual-recovered` after pulling the
available locator, but that trial does not prove automatic WORK-to-PLAN return
and must not be used as proof that multi-WORK dispatch is scalable.

Next recommended lanes: `lane-backend-gateway-database` and
`lane-editor-structure-publish`, with `lane-integration-evidence` held back
until the required owner-lane handoffs have been accepted by PLAN.

## Handoff Requirements

Each WORK room must return:

- PASS / FAIL / BLOCKER / RISK / UNKNOWN
- Lane ID
- Work Type
- Owner repository
- Context Acknowledgement result
- Files changed
- Behavior changed
- Tests run
- Evidence candidate or Evidence record request
- Claims intentionally not promoted
- Product states that remain unknown
- Contract Change Request, if needed
- PR Summary Draft

The PR Summary Draft is handoff material only. It is not product truth and is
not a separate authority source.

## Stop Conditions

Stop and return to the PLAN room when:

- owner repository is unclear;
- Work path, Phase, Checklist target, or Evidence target is missing;
- a lane needs to redefine gateway behavior, product database ownership, PDF
  output ownership, or a cross-repository contract;
- a product behavior claim lacks repository-owned tests, files, commit, or
  contract evidence;
- a room would need to write FlowDoc-wide truth into a product repository;
- a real secret or copied API key would be stored in Project Control or source;
- a map would be updated from a planned outcome instead of verified evidence.

## Dispatch Status

This PLAN room records the first delivery round plan, lane packets, and the
accepted Core WORK room handoff for `lane-core-document-pdf-boundary`.

The single-room active return smoke test passes for one projectless WORK room,
and the two-room active return queue smoke test passes for two read-only
projectless WORK rooms returning to the same PLAN task. The product-repository
read-only active return smoke test passes for a worktree-created Core task:
initial `clientThreadId`
`client-new-thread:a8a7a22f-152e-46d3-9ab9-d45482469c47` resolved to WORK task
`01a06146-4c7a-7ca3-9f36-475df0f7ba99`, which actively returned
`handoff-core-readonly-return-smoke-2026-09-02-01` from
`C:\Users\nekot\.codex\worktrees\c89e\flowdoc-vnext-core`. The separately
opened local fallback task `01a06147-82e3-71e1-add6-d7d702b6c406` also
returned and is kept only as a local fallback diagnostic.

Automatic WORK-to-PLAN return remains a required dispatch gate for product
WORK rooms that make actual edits. The next dispatch must not require `ตูม` to
copy/paste Terminal Handoffs, must define a manual recovery fallback that
records `manual-recovered` or `return-channel-failed`, and must preserve
`completionQueue`, `returnOrderPolicy`, `arrivalSequence`, duplicate handoff
handling, and one queued handoff at a time.

Next recommended implementation-return test: dispatch one very small product
WORK room in an owner repository with an isolated worktree and actual edit
scope, require active return, owner-repository checks, exact commit evidence,
and PLAN-owned Project Control reporting before promoting any claim.

Next recommended lanes:

- `lane-backend-gateway-database`, to inspect and implement Backend gateway,
  credential, persistence, job, artifact, and validation adoption of the
  accepted Core boundary.
- `lane-editor-structure-publish`, to inspect and implement the Editor-owned
  structure creation and publish surface that feeds the delivery path.
- `lane-integration-evidence`, held back until owner-lane handoffs required
  for the First Delivery Slice have been accepted by PLAN.
