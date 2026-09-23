# FlowDoc Workflow Economy Clean Cutover Design

## Authority Boundary

Project Control owns this design under
`flowdoc-product-development-resumption > agent-and-skill-design > workflow-economy-clean-cutover`.
It designs a replacement agent workflow for Project Control coordination. It
does not implement or prove Core, Backend, Editor, product UX, product
readiness, or map truth.

This design is not the new operating authority. The existing rules remain
authoritative until one verified cutover changes all current entrypoints and
marks the replaced rules historical. There is no dual-authority transition.

## Work Context

- Work ID: `workflow-economy-clean-cutover`
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with `planning-partner` and
  `documentation-authority-steward` responsibilities
- Current Phase: `phase-workflow-economy-clean-cutover-design`
- Checklist target: `checklist-workflow-economy-clean-cutover-design`
- Evidence target: approved design, focused authority-routing tests, generated
  read model, and the full Project Control gate
- Known risks: a partial cutover could leave two active rule sets; an
  over-minimal packet could omit an owner, acceptance boundary, or return path;
  historical records could be mistaken for current authority; metrics could
  become a new reporting burden
- Unknown state: implementation files, exact schema changes, retirement list,
  and test migration are intentionally deferred to the implementation plan

## Goal

Reduce FlowDoc governance, context, proof, review, and documentation cost while
preserving the minimum information needed to keep work owned, bounded,
verifiable, recoverable, and stoppable.

Success means a new PLAN can understand current work quickly, dispatch the
smallest sufficient WORK packet, accept adequate proof once, and stop without
creating extra Gates, Evidence, audits, phases, or documents by default.

## Source Brief

The user-provided twenty-item list is the controlling design brief. New
workflow features must implement or reduce cost for one or more of these items.
Ideas outside the list remain deferred unless the user explicitly expands the
brief.

| # | Brief item | Design decision |
| --- | --- | --- |
| 1 | Work Risk Tier / Proof Tier | PLAN assigns `routine`, `bounded`, or `critical`; default is `routine`; escalation requires a reason. |
| 2 | Proof Budget Policy | Every lane receives a proof budget. New proof must name the failure it prevents and why existing tests are insufficient. |
| 3 | Evidence Reuse | Reuse evidence by claim, scope, freshness, and validity; do not duplicate evidence for the same fact. |
| 4 | Gate Creation Rule | Unknowns do not create Gates. A Gate exists only for a real downstream allow/stop decision. |
| 5 | Close Audit Compression | Routine has no close audit; bounded normally uses an acceptance summary; formal close audit is reserved for critical work. |
| 6 | Current Truth Snapshot / Cockpit | Provide one generated entrypoint for current goal, blocker, work, accepted truth, critical unknowns, deferred work, next decision, and repositories. |
| 7 | Context Loading Policy | Default load order is snapshot, packet, and relevant current contracts/evidence. Historical material is trigger-loaded only. |
| 8 | Historical Memory Compaction | Classify authority as `current`, `supporting`, or `historical`; historical content is excluded from default context. |
| 9 | Supersession Contract | Current successors win. Replaced authority carries `supersedes`; old authority becomes historical and points to `supersededBy`. |
| 10 | Simplify Done semantics | Human surfaces distinguish planning, implementation, verification, and truth promotion instead of one ambiguous Done label. |
| 11 | Stop Condition Simplification | Local stop conditions cover only safety/correctness, authority, missing prerequisites, and scope escape beyond inherited policy. |
| 12 | Inherited Global Rules | Shared authority disclaimers and invariants live once in policy; child records state only exceptions. |
| 13 | Minimal WORK Kickoff Packet | A packet contains goal, owner, scope, acceptance, relevant evidence, risk, proof budget, model, escalation triggers, and return path. |
| 14 | Work Completion Economy | WORK returns changed behavior, proof, remaining unknowns, and downstream information; no extra artifact is required when those suffice. |
| 15 | Unknown to Action Rule | Classify unknowns as `blocking`, `accepted`, `deferred`, or `irrelevant`. Only blocking unknowns stop current work. |
| 16 | Fallback-before-Proof Rule | Prefer a correct conservative fallback when correctness and performance budgets pass; do not create a new proof mechanism unnecessarily. |
| 17 | Token/Context Cost Metric | Start with automatically observable proxies; do not require a new per-WORK metric report. |
| 18 | Governance Regression Check | Periodically compare steps added/removed and workflow cost; Project Control governance is refactorable. |
| 19 | Agent Permission to Stop | When acceptance passes, WORK and PLAN stop unless a declared blocker or escalation trigger fires. |
| 20 | Human Override / Owner Decision | Record `accept-risk`, `defer-proof`, `freeze-scope`, and `stop-investigation`; agents do not reopen them without new blocker-grade facts. |

## Core Model

### Safety Kernel

Every executable lane contains only these always-required facts:

- goal;
- owner repository;
- allowed scope;
- acceptance criteria;
- Work Size;
- Risk Tier;
- proof budget and reusable evidence;
- blocking unknowns;
- escalation triggers;
- selected model and reasoning effort;
- return path for a real WORK room.

Everything else is inherited policy, tier-triggered detail, or an explicit
exception. The kernel cannot be removed by a low tier.

### PLAN responsibility

PLAN translates the user's intent into executable lanes. PLAN alone owns:

- decomposition and Work Size;
- owner repository and allowed scope;
- Risk Tier and escalation reason;
- proof and document budgets;
- model and reasoning-effort selection;
- acceptance criteria;
- whether Discovery, Implementation, or Verification WORK is required;
- acceptance, rejection, deferment, and closure.

WORK may report a trigger or request a contract change. WORK may not enlarge
its scope, raise or lower its own tier, create a Gate, add proof layers, or
open downstream work without PLAN approval.

### Work Size and Risk Tier are separate

Work Size describes execution breadth:

- `small`: one narrow outcome with known boundaries;
- `medium`: multiple related changes inside one owner boundary;
- `large`: too broad for one safe WORK packet and therefore split before
  dispatch.

Risk Tier describes consequence and proof:

- `routine`: default; normal reversible work with clear ownership and existing
  focused proof;
- `bounded`: meaningful but contained impact requiring neighboring checks or a
  concise acceptance summary;
- `critical`: security, authority, public contract, irreversible data,
  cross-repository semantic, or similarly high-consequence change. Promotion
  to critical records the trigger.

Large work is not automatically critical, and a one-line change can be
critical.

### WORK authority types

Use the fewest types needed to limit authority:

1. `discovery`: read-only investigation that returns facts, candidate scope,
   risks, unknowns, and a recommendation; it cannot edit or continue into
   implementation.
2. `implementation`: edits only the approved owner scope and returns the four
   completion facts.
3. `verification`: independently checks a returned critical or triggered
   result; it cannot repair the implementation.

A clear routine or bounded task goes directly to Implementation. Discovery is
used only when owner, cause, scope, acceptance, tier, or model choice cannot be
set honestly. Verification is not automatic; it is required by critical tier
or a recorded trigger.

## Proof and Document Economy

### Tier defaults

| Tier | Default proof | Review | Close form | New durable document |
| --- | --- | --- | --- | --- |
| routine | existing focused tests | none unless triggered | four-field completion | zero |
| bounded | focused plus relevant neighboring checks | risk-triggered | acceptance summary | zero; at most one decision/contract exception when justified |
| critical | full owner gate plus declared independent proof | mandatory | formal close audit only when its failure-prevention purpose is named | allowed inside the declared budget |

Before creating Evidence, a Gate, audit, or durable document, PLAN must answer:

1. Which concrete failure does this prevent?
2. Why do existing tests, records, or evidence not prove the claim?
3. What is the artifact's owner, validity boundary, and retirement trigger?

Failure to answer means the artifact is not created.

### Evidence reuse

Evidence identity alone is insufficient. Reuse is valid when its claim,
repository and path scope, source revision, verification method, and freshness
trigger still match. A later phase references the same evidence rather than
copying it. If freshness fails, refresh or supersede the evidence; do not clone
it under a new ID merely because a phase changed.

### Document creation

Project Control uses `record-first, document-by-exception`. A document is
justified only for a shared contract, durable decision with meaningful
alternatives, reusable policy, behavior specification not expressible as
acceptance criteria, or a required critical audit. Routine completion,
ordinary passing tests, non-blocking unknowns, and inherited disclaimers stay
in existing records.

## Unknown, Gate, Fallback, and Override Rules

Every relevant unknown has one disposition:

- `blocking`: prevents current acceptance and names the owner/action;
- `accepted`: known uncertainty accepted within the present boundary;
- `deferred`: has a return trigger and does not block current work;
- `irrelevant`: outside the accepted goal and closed for this round.

Only a decision that truly allows or blocks downstream work becomes a Gate.
A task note, risk, or unknown is not a Gate by itself.

When a conservative fallback is correct and meets its declared performance
budget, PLAN prefers it over a new proof mechanism. A fallback that hides a
correctness failure or exceeds the budget is not eligible.

The human owner may issue:

- `accept-risk`;
- `defer-proof` with a return trigger;
- `freeze-scope`;
- `stop-investigation`.

These decisions are authoritative for the round. They cannot override a
safety/correctness blocker or an authority violation, and an agent may reopen
them only when new blocker-grade facts appear.

## Minimal PLAN and WORK Flow

```text
user intent
  -> PLAN defines goal and acceptance
  -> PLAN chooses lane size, risk, proof budget, model, and WORK type
  -> optional Discovery returns and stops
  -> PLAN issues a fresh Implementation packet
  -> WORK edits, proves, returns four completion facts, and stops
  -> optional critical Verification returns and stops
  -> PLAN accepts once, records only required truth, and closes
```

The Minimal Kickoff Packet contains:

- goal;
- owner repository;
- allowed scope;
- necessary forbidden scope only;
- acceptance criteria;
- Work Size and Risk Tier;
- proof and document budgets;
- relevant current evidence;
- model and reasoning effort;
- escalation triggers;
- return path.

The compact WORK return contains:

1. behavior changed;
2. tests or evidence proving it;
3. remaining unknowns and their disposition;
4. downstream information or `none`.

Transport identity, exact commit, and terminal status remain machine fields
when a real separate room is used; they do not need duplicated prose.

## PLAN Closure and Continuation

Closing a PLAN permanently seals its registry, WORK rooms, return channels,
handoffs, worktrees, and branches as execution context. The closed PLAN is
read-only.

A user request to continue creates a new PLAN and round. The new PLAN reads, in
order:

1. Current Truth Snapshot;
2. accepted Work and Evidence;
3. accepted commits and fresh repository state;
4. current canonical contracts;
5. the closed PLAN summary;
6. historical conversation only when the durable sources are insufficient.

The new PLAN verifies current repository state independently. It never sends,
waits, revises, or returns through the old PLAN or WORK rooms. When accepted
durable inputs are insufficient, a separate read-only Historical Recovery
lane may produce immutable findings; it cannot reactivate the inspected room.

## Context and Authority Layers

Every governed document or policy has one context class:

- `current`: active authority and eligible for default context;
- `supporting`: loaded only when a current packet points to it;
- `historical`: traceable but excluded from default context and execution
  authority.

Default context order is:

```text
Current Truth Snapshot
  -> current PLAN or WORK packet
  -> directly relevant current contract/evidence
```

Historical documents, closed room transcripts, old registries, old audit
notes, and superseded plans are prohibited by default. They are loaded only
for a named conflict, audit, evidence recovery, or reconciliation question.

Supersession is directional and unambiguous:

- the successor records `supersedes`;
- the replaced authority records `supersededBy` and becomes historical;
- current routing always selects the successor;
- historical references remain resolvable without becoming authority.

Shared disclaimers and invariants live in the new policy once. Child packets
inherit them and state only exceptions.

## Completion Semantics

The canonical data may retain internal lifecycle fields, but human and agent
read models expose distinct milestones:

- `planning-complete`;
- `implementation-complete`;
- `verification-complete`;
- `truth-promoted`.

No generic `Done` label may imply all four. A lane stops at the milestone its
acceptance criteria requested.

## Current Truth Snapshot / Cockpit

The Cockpit is generated from canonical records and is never a second truth
source. Its first view contains only:

- current goal;
- current blocker;
- active work;
- accepted truth;
- critical unknowns;
- deferred work;
- next decision;
- involved repositories.

Detail, supporting evidence, and history remain behind selection. Snapshot
generation must prefer current successors and omit historical authority by
default.

## Governance Metrics

Initial metrics use existing or automatically observable data:

- approximate context documents loaded per WORK;
- evidence and durable documents created per Work/Phase;
- review or revision count;
- implementation commits compared with governance artifacts;
- reopen or rebaseline frequency.

Metrics are trend indicators, not acceptance Gates. No WORK creates a separate
metrics artifact. At a monthly or major-milestone review, Project Control asks
which steps were added, which can be removed, and whether workflow cost moved
up or down.

## Clean Authority Cutover

The cutover is atomic:

### Before cutover

- existing rules remain the only authority;
- this design and the implementation candidate are non-authoritative;
- old rooms follow their existing round until closed or explicitly stopped.

### Cutover gate

One accepted integration must:

- publish the new Workflow Economy Policy as current;
- route Project Control `AGENTS.md`, global guidance, onboarding, and the local
  FlowDoc skill to it;
- update schema, read model, and behavior tests needed by the new contract;
- remove replaced documents from required/default reading;
- mark replaced authority historical with `supersededBy`;
- preserve historical lookup without preserving execution authority.

If any current entrypoint still requires the replaced rules, cutover fails and
the old authority remains current. There is no mixed state.

### After cutover

- the new policy is the only current workflow authority;
- existing PLAN and WORK rooms are read-only historical execution context;
- every continuation starts a new PLAN, round, registry, WORK task, and return
  route;
- late handoffs are historical/reconciliation inputs, not current returns;
- historical documents remain available only through triggered lookup.

## Failure Handling

- Missing Safety Kernel field: do not dispatch.
- Discovery tries to edit: reject the result and keep implementation unopened.
- WORK exceeds scope or proof budget: stop and return an escalation request.
- Evidence freshness fails: refresh or supersede; do not duplicate blindly.
- Unknown lacks a disposition: PLAN classifies it before acceptance.
- Successor conflict or two current authorities: fail the Project Control
  gate.
- Closed PLAN or stale return identity: quarantine as historical input.
- Acceptance passes: stop; do not search for more proof without a declared
  trigger.

## Verification Design

Implementation planning must include focused tests demonstrating:

- routine is the default and critical requires a reason;
- Work Size does not determine Risk Tier;
- proof/document budgets prevent undeclared artifacts;
- unknown dispositions do not create Gates automatically;
- Discovery cannot edit and cannot continue as Implementation;
- WORK cannot change its own scope, tier, proof budget, or model assignment;
- reused evidence observes claim, scope, and freshness;
- owner overrides close issues except for new blocker-grade facts;
- acceptance stops additional proof creation;
- current/supporting/historical routing excludes historical content by default;
- supersession selects exactly one current successor;
- human surfaces distinguish the four completion milestones;
- closed PLAN state is immutable and continuation creates a fresh round;
- cutover fails when any current entrypoint still points to replaced authority;
- historical records remain readable after cutover;
- the full Project Control gate passes in the worktree and again on main.

Text-presence tests alone are insufficient for state, routing, budget, or
closure behavior. They may guard a small number of entrypoint links, while
behavior tests prove selection and rejection rules.

## Implementation Boundaries

The implementation plan may change Project Control policy, canonical records,
schema, model, projection, GUI read model, tests, global guidance, and the local
FlowDoc skill. It must not edit Core, Backend, or Editor behavior.

The implementation plan must stage the work into independently verifiable
Project Control lanes while preserving one atomic authority cutover. It must
not produce twenty policy documents, duplicate historical Evidence, or require
old rooms to participate.

## Design Acceptance

This design is ready for implementation planning when the user confirms:

- the twenty-item brief is represented without expanding its scope;
- PLAN owns size, tier, proof budget, model, WORK type, and acceptance;
- Discovery, Implementation, and Verification have separate authority;
- documentation is record-first and budgeted;
- closed PLAN rooms are permanently read-only;
- the cutover creates one current authority with no dual-rule period;
- old rules remain traceable history but leave default context.
