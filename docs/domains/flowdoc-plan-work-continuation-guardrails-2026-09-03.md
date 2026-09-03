# FlowDoc PLAN/WORK Continuation Guardrails

## Authority Boundary

This document records PLAN/WORK continuation feedback before returning to drafted frontend lanes. It is owned by Project Control under `flowdoc-product-development-resumption > agent-and-skill-design`.

This is a Project Control coordination decision and evidence note. The canonical rule text lives in `AGENTS.md`, `docs/domains/flowdoc-global-codex-guidance.md`, and `docs/domains/flowdoc-plan-room-orchestration-rules.md`. This note records why that rule was added; it is not the only place a future PLAN room should learn the rule. It does not change the drafted frontend lane plan, does not open the next frontend lane, does not edit Core, Backend, or Editor behavior, does not implement a durable Room Run Registry schema, and does not prove frontend readiness, FlowDoc product truth, or map truth.

## Work Context

- Work path: `flowdoc-product-development-resumption > agent-and-skill-design`
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with `planning-partner` and `documentation-authority-steward` responsibilities
- Current Phase: `phase-agent-and-skill-design-plan-work-continuation-guardrails`
- Checklist target: `checklist-agent-and-skill-design-plan-work-continuation-guardrails`
- Evidence target: `evidence-flowdoc-plan-work-continuation-guardrails-2026-09-03`
- Known risks: conversation-only room state may be lost before the drafted frontend lanes resume; PLAN may over-carry WORK correction; a later packet may omit Room Run Registry, liveness, or automatic return fields; a lean dispatch note may be mistaken for weaker acceptance.
- Unknown state: the durable Room Run Registry schema is not implemented here; the next frontend lane is not opened here; multi-product-WORK close-together returns remain unproven beyond the current bounded evidence.

## Feedback Accepted

The current PLAN/WORK pattern is accepted for FlowDoc work that needs multiple real WORK rooms, especially when one PLAN room must preserve Project Control truth and review returned product-lane evidence.

The valuable parts are:

- real WORK rooms can hold lane execution while PLAN stays focused on orchestration, acceptance, and Project Control reporting;
- automatic WORK-to-PLAN return reduces manual copy/paste and makes handoffs reviewable;
- `acceptanceGate` can catch bad or incomplete returns before PLAN promotes them;
- same-room Revision Packets keep repair responsibility with the original WORK room;
- Lean Dispatch is useful when a lane is low-risk, but it must still keep automatic return, liveness, retrievable locator, and acceptanceGate.

## Continuation Rule

Before returning to drafted frontend lanes, PLAN should restore the planning context from:

- `docs/domains/flowdoc-frontend-expert-roadmap-2026-09-03.md`;
- `docs/domains/flowdoc-frontend-product-map-2026-09-03.md`;
- `docs/domains/flowdoc-wysiwyg-gate-decision-2026-09-03.md`;
- `docs/domains/flowdoc-design-workspace-usability-acceptance-2026-09-03.md`;
- this continuation guardrail.

PLAN should then create or update a Room Run Registry entry, or a Lean Dispatch registry note when the dispatch is intentionally lean, before opening or resuming the next dispatch set. The registry state must include enough information to recover the room without relying on memory in the conversation: dispatch set, lane ID, Work Type, owner repository, retrievable locator, PLAN task/chat ID or PLAN-owned monitor, automatic Return Channel, Active Return Command, liveness state, handoff ID, completionQueue arrival, acceptance decision, and revision state.

PLAN must not repair WORK output itself. If a returned handoff is incomplete or wrong but still belongs to the same lane, PLAN sends a Revision Packet back to the same WORK room when the original retrievable locator remains usable. If the same room cannot receive the packet, PLAN records the room as `needs-attention`, `returned-silent`, `manual-recovered`, `return-channel-failed`, `UNKNOWN`, `RISK`, or `blocked` instead of silently taking over the lane.

## Drafted Lane Boundary

This record preserves the existing lane plan; it does not choose a new lane order and does not change accepted lane boundaries.

When PLAN returns to the drafted frontend lane plan, this guardrail should be treated as required context for the next Kickoff Packet or Lean Dispatch packet. It should not be treated as product evidence or as permission to skip owner-repository verification.

## Non-Goals

- No Core, Backend, or Editor behavior changes.
- No product repository tests, fixture, dependency, or configuration repair.
- No new WORK room opened by this record.
- No durable Room Run Registry schema implementation.
- No frontend readiness, WYSIWYG readiness, publish readiness, production readiness, FlowDoc product truth, or map truth promotion.

## Verification

The focused guard is `tests/flowdoc-plan-work-continuation-guardrails.test.ts`. It requires the parent `agent-and-skill-design` Work record, this document, the Phase, the Checklist, and the Evidence record to preserve the continuation boundary before PLAN resumes drafted frontend lanes.
