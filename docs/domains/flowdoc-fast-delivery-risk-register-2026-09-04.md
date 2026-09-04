# FlowDoc Fast Delivery Risk Register

## Authority Boundary

Owner repository: `repo-project-control`.

Work path:
`flowdoc-product-development-resumption > flowdoc-fast-delivery-risk-register`.

This document records a compact Project Control risk register for moving faster
after the 2026-09-04 creator UX and document-structure database alignment. It
is a pre-dispatch guard for PLAN rooms and future Kickoff Packets.

This document is not product implementation, not frontend implementation
evidence, not a product database implementation, not a SQL migration, not an
API contract, not renderer evidence, and not product readiness evidence. It
does not prove Core runtime behavior, Backend persistence or service behavior,
Editor behavior, PDF generation, frontend readiness, production readiness,
FlowDoc product truth, or map truth.

No product repository files change in this phase. PLAN may record these risks,
but PLAN must not patch Core, Backend, or Editor product repositories after
dispatch. Product repository repair must go back to the same WORK room as a
Revision Packet when the original retrievable locator remains usable.

## Work Context

Active role: `planning-partner`, with `documentation-authority-steward` and
`evidence-registrar` responsibilities for the Project Control records.

Current Phase: `phase-flowdoc-fast-delivery-risk-register`.

Checklist target: `checklist-flowdoc-fast-delivery-risk-register`.

Evidence target: `evidence-flowdoc-fast-delivery-risk-register-2026-09-04`.

Work Type: `planning-coordination` plus `documentation-authority`.

Known risks are listed below. Unknown state remains: these risks do not prove
that any Editor, Backend, Core, Preview, Published/API, Runtime Submission, PDF
renderer, artifact storage, permission, workflow, billing, audit, activity, or
integration behavior exists.

## How To Use This Register

Before opening a fast product WORK lane, PLAN should scan this register and
copy only the relevant risk rows into the lane's Kickoff Packet or Context
Capsule.

Every selected risk row should become one of:

- an accepted constraint in the Kickoff Packet;
- a stop condition;
- a required acknowledgement from the WORK room;
- a reason to send a Revision Packet back to the same WORK room;
- a reason to split the lane before dispatch.

This register is intentionally short. It should make fast movement safer, not
turn every lane into a new broad design round.

## Risk Register

| ID | Risk | Trigger | Guard / Mitigation | PLAN Action |
| --- | --- | --- | --- | --- |
| `RISK-FD-001` | Terminology risk | A lane uses `component`, `component instance`, or `component_*` without saying whether it means UI component, Structure Pattern, Structure Pattern Slot, or Structure Pattern Entry. | Required reading: `FlowDoc Product Terminology`, Thai companion, `FlowDoc Creator UX Contract v0`, and `FlowDoc Document Structure Database Model v0.0.2`. The lane must use Structure Pattern / Slot / Entry product terms unless it is explicitly quoting legacy component_* names. | If the room blurs the terms, mark `needs-revision` and send a Revision Packet. If the term changes product behavior, require a Contract Change Request. |
| `RISK-FD-002` | Database drift risk | Backend work follows the accepted v0.0.1 foundation but keeps legacy component_* meaning in service/domain behavior. | Treat legacy component_* names as compatibility names only. Product-facing behavior should expose Structure Pattern terms, slot repeat policy, layout boundaries, and slot-driven freeze. | Dispatch Backend work as a bounded owner lane. PLAN records evidence only after exact Backend commit and fresh Backend checks. |
| `RISK-FD-003` | UX scope risk | Build and Preview collapse into one surface, or Build starts storing runtime data entries. | Build is draft authoring. Preview is simulation. Build defines Structure Pattern Slots; Preview or runtime creates Structure Pattern Entries. The center of Build should remain a real Document Surface, not a free-form Word or Google Docs style editor. | If an Editor lane implements runtime entry behavior inside Build, reject or revise before accepting the lane. |
| `RISK-FD-004` | Truth promotion risk | A handoff treats planning docs, UX docs, risk notes, screenshots, branches, worktrees, or generated Project Control index content as product truth. | Do not promote frontend readiness, product database implementation, Published/API readiness, PDF readiness, or FlowDoc product truth without owner-repository evidence. Maps change only when a bounded Evidence record supports the exact claim. | Keep the claim `planned`, `risk`, or `unknown`; request product evidence from the owning repository. |
| `RISK-FD-005` | Speed risk | PLAN opens several WORK rooms quickly or uses Lean Dispatch with a thin Context Capsule. | Lean Dispatch may reduce duplicated prose, but it must not remove automatic return, liveness, retrievable locator, acceptanceGate, owner repository, forbidden scope, evidence target, or Contract Change Request triggers. | Before dispatch, record parallelLimit, Return Channel, Active Return Command, handoff ID, livenessDeadline, and compact Terminal Handoff fields. |
| `RISK-FD-006` | Dependency risk | A worktree setup or dependency install emits warnings such as npm audit findings, startup dependency failures, or long install behavior. | Do not hide dependency warnings. If a lane touches dependencies, security, package manager behavior, or CI setup, promote this to owner-repository evidence work. If unrelated, record as residual risk and continue without changing dependencies. | Keep current dependency warning as residual risk until a dedicated security/dependency lane is approved. |

The `RISK-FD-004` guard is intentionally strict: PLAN must not promote
frontend readiness and must not promote product database implementation from
this register, planning docs, generated indexes, screenshots, or unfinished WORK
output.

## Fast Kickoff Risk Gate

A fast Kickoff Packet should include this compact gate:

```text
Risk gate:
- Confirm whether Structure Pattern / Slot / Entry terminology is in scope.
- Confirm whether legacy component_* names are compatibility names only.
- Confirm Build and Preview remain separate if Editor UI is in scope.
- Confirm planning docs are not product implementation evidence.
- Confirm automatic return, liveness, retrievable locator, and acceptanceGate.
- Confirm dependency warnings are either out of scope or explicitly owned.
```

If any answer is unclear, the lane should not start as a fast lane. PLAN should
either tighten the Context Capsule, reduce parallelism, or split the work.

## Boundaries For Faster Movement

PLAN can move faster after this register by keeping each next lane narrow and
evidence-shaped:

- Backend lanes must return exact commit, files changed, behavior changed,
  tests run, risks left, and whether legacy component_* names remain.
- Editor lanes must return exact commit, files changed, visible flow changed,
  tests or screenshots when relevant, and whether Build and Preview stayed
  separate.
- Core lanes must return exact commit, files changed, semantic contract
  changed, tests run, and which renderer or package behavior is still unknown.
- Project Control lanes may update records and documents, but must not patch
  product repositories after dispatch.

This register does not require every lane to read every document in full. It
does require PLAN to give each WORK room the exact risks that can break that
lane.

## Intentionally Not Changed

- No Core, Backend, or Editor files change in this phase.
- No product repository repair is performed by PLAN.
- No frontend screen, product database schema, SQL migration, Backend API,
  Core renderer contract, PDF generation, artifact storage, permission,
  workflow, audit, activity, billing, or integration behavior is implemented.
- No FlowDoc product truth, frontend readiness, publish readiness, PDF
  readiness, production readiness, or map truth is promoted.

## Next Recommended Work

Use this risk register as a small pre-dispatch filter before the next fast
lane. The next useful decision is whether to open an Editor Build/Preview lane
or a Backend Structure Pattern alias/schema lane first.
