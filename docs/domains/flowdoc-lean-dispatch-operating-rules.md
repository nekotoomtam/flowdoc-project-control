# FlowDoc Lean Dispatch Operating Rules

## Authority Boundary

This document defines the Lean Dispatch operating rules for FlowDoc PLAN rooms
that need to reduce PLAN/WORK room token, time, and review cost while still
using real WORK rooms.

It is owned by Project Control under
`flowdoc-product-development-resumption > agent-and-skill-design`.

This is a Project Control coordination contract. It does not open WORK rooms,
does not edit Core, Backend, or Editor behavior, does not create packaged
Codex skills, and does not prove FlowDoc product truth or map truth.

Lean Dispatch is only allowed to reduce payload size, reading duplication,
verification breadth during low-risk probes, and evidence-writing frequency.
It must not remove automatic WORK-to-PLAN return, liveness, retrievable
locator, or acceptanceGate.

In shorthand for budget reviews, Lean Dispatch must not remove automatic
return, liveness, retrievable locator, or acceptanceGate.

## Work Context

- Work path: `flowdoc-product-development-resumption > agent-and-skill-design`
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with `planning-partner` and
  `documentation-authority-steward` responsibilities for the prose
- Current Phase:
  `phase-agent-and-skill-design-lean-dispatch-operating-rules`
- Checklist target:
  `checklist-agent-and-skill-design-lean-dispatch-operating-rules`
- Evidence target:
  `evidence-flowdoc-lean-dispatch-operating-rules-2026-09-02`
- Known risks: a lean packet may omit context a WORK room needs, low
  verification tiers may be reused for product behavior that needs a full
  owner-repository gate, evidence batching may hide a failed room, and token
  savings may be mistaken for permission to weaken PLAN-owned reporting
- Unknown state: this contract has not yet been proven by a multi-product-WORK
  dispatch with actual Core, Backend, or Editor edits; it is not a packaged
  Codex skill and does not prove future Codex compliance

## Purpose

Lean Dispatch exists because real WORK rooms can now return to PLAN, but the
first experiments showed that giving every room full context and writing full
records for every probe costs too much.

A PLAN room may choose Lean Dispatch for a dispatch set when the lane boundary
is narrow, the owner repository is clear, and the WORK room can use a compact
Context Capsule plus source pointers instead of a copied wall of context.

Lean mode is a budget profile, not a weaker orchestration mode. The room still
receives one approved lane, the PLAN task/chat ID, the active Return Command,
the handoff ID, liveness expectations, and the acceptance rules.

## Resource Budget

Each Lean Dispatch lane card records these budget fields before dispatch:

- `contextBudget`: `tiny`, `small`, `normal`, or `strict`. This controls how
  much context is embedded in the Kickoff Packet. `strict` means no additional
  context may be inferred beyond the packet and required source documents.
- `verificationTier`: `read-only`, `focused`, `standard`, or `full`. Product
  behavior that will be merged or accepted as changed behavior still needs the
  appropriate owner-repository verification before PLAN acceptance.
- `reviewTier`: `none`, `risk-triggered`, or `mandatory`. `none` is allowed
  only for no-edit probes whose output is not promoted.
- `evidenceMode`: `registry-note`, `batched-evidence`, or
  `full-acceptance-record`. Product behavior acceptance, map-adjacent claims,
  new operating contracts, and user-approved durable proof require full
  records.
- `handoffDetail`: `compact` or `expanded-on-request`. Compact handoffs must
  still carry the fields needed for acceptanceGate.
- `docReadPolicy`: `required-summary`, `reference-pack`, or
  `triggered-full-read`. A WORK room reads full documents when the lane type
  or escalation trigger requires it.

The budget must be visible in the Room Run Registry or dispatch notes so PLAN
can explain why the work was allowed to stay lean.

## Lean Kickoff Packet

A Lean Kickoff Packet is the smallest packet a real WORK room may receive.
It must include:

- Room Mode: `WORK`
- Work Type
- Lane ID
- Owner repository
- Allowed scope
- Forbidden scope
- Round ID or Work path
- PLAN task/chat ID or PLAN-owned monitor locator
- Return Channel
- Automatic Return Channel
- Active Return Command
- Return Event ID or handoff ID
- Liveness Signal and livenessDeadline
- Death Signal
- Retrievable locator requirement
- Resource Budget fields
- Required reading summary
- Reference Pack
- Stop condition
- Compact Terminal Handoff format
- Contract Change Request trigger

The packet may omit long background prose when the Reference Pack points to the
source documents and the lane's accepted facts are summarized. It may not omit
the return path, liveness, owner repository, accepted scope, or evidence target.

## Reference Pack

The Reference Pack carries stable document IDs, paths, and narrow reason-to-read
notes instead of copying whole documents into the prompt.

Minimum Reference Pack entries:

- Project Control AGENTS.md
- `docs/domains/flowdoc-delivery-operating-model.md`
- `docs/domains/flowdoc-plan-room-orchestration-rules.md`
- `docs/domains/flowdoc-work-type-routing-model.md`
- this Lean Dispatch document
- the round or lane source document
- owner repository `AGENTS.md` for product implementation

A WORK room must read the full source document when the lane edits product
behavior, changes cross-repository contracts, writes Markdown, promotes
Evidence, touches UX or mockup direction that may shape implementation, handles
secrets or API keys, changes storage, or hits an escalation trigger.

## Verification Tiers

Use the cheapest verification tier that can honestly support the lane:

- `read-only`: no repository edits; return locator, findings, risks, and
  unknowns. No product behavior claim may be accepted from this tier.
- `focused`: changed-file or directly related tests plus syntax/type checks
  when available. Good for early local probes and narrow no-merge edits.
- `standard`: focused verification plus neighboring tests, generated read-model
  checks, and diff review. Good for most Project Control document contracts.
- `full`: the owner repository's full gate before merge, evidence acceptance,
  or product behavior promotion.

If a product WORK room changes Core, Backend, or Editor behavior and asks PLAN
to accept that changed behavior, the final acceptance requires exact commit
evidence and fresh owner-repository verification. Lean Dispatch cannot
downgrade that requirement.

## Evidence Batching

Lean Dispatch may batch evidence when the output is exploratory, no-edit,
or only validates orchestration mechanics.

Use `registry-note` for throwaway or non-promoted probes. Use
`batched-evidence` when several small no-edit room runs prove one coordination
claim together. Use `full-acceptance-record` when a lane changes product
behavior, creates a new operating contract, supports a map-adjacent claim, or
needs durable proof for future rooms.

Evidence batching does not allow PLAN to lose terminal returns. Every WORK room
still returns PASS / FAIL / BLOCKER / RISK / UNKNOWN, and PLAN still stages the
handoff in `handoffInbox` and `completionQueue` with `arrivalSequence` when
multiple rooms return close together.

## Compact Terminal Handoff

A compact Terminal Handoff must include:

- Return Event ID or handoff ID
- roomRunId, lane ID, Work Type, and owner repository
- Context Acknowledgement result
- terminal status: PASS / FAIL / BLOCKER / RISK / UNKNOWN
- automatic return status
- retrievable locator
- exact commit when changed behavior exists, or `none` when no commit exists
- files changed, or `none`
- tests run and result, or why no tests were run
- risks and unknowns
- Contract Change Request, or `none`
- next PLAN action requested

PLAN may ask the same WORK room for expanded detail only when acceptanceGate
finds a missing field, a risk trigger fires, or the result affects a broader
contract than the lane allowed.

## Escalation Triggers

Lean Dispatch must stop being lean for the affected lane when any of these
triggers appears:

- missing Context Acknowledgement
- missing PLAN task/chat ID, Active Return Command, or handoff ID
- missing retrievable locator
- missed Return Channel, silent room, or Death Signal
- FAIL, BLOCKER, unresolved RISK, or UNKNOWN that affects lane acceptance
- Contract Change Request
- public API, security, secret, API key, storage, database, worker, queue,
  route-mounted production behavior, renderer execution, PDF bytes, or artifact
  persistence
- cross-repository contract or ownership change
- unexpected dirty worktree or branch collision
- test failure that cannot be explained inside the lane
- UX artifact, mockup, or prototype being treated as implementation evidence
- any claim that would change FlowDoc product truth or map truth

When a trigger fires, PLAN either expands the packet, raises the verification
tier, sends a Revision Packet to the same WORK room, splits the lane, or blocks
the round.

## Lean Dispatch Defaults By Work Type

Use these defaults unless the dispatch set records a stricter reason:

| Work Type | Default Budget |
| --- | --- |
| `planning-coordination` | `contextBudget: small`, `verificationTier: standard`, `reviewTier: risk-triggered`, `evidenceMode: batched-evidence` |
| `product-implementation` | `contextBudget: small` or `normal`, `verificationTier: standard` while developing and `full` before merge or acceptance, `reviewTier: risk-triggered`, `evidenceMode: full-acceptance-record` |
| `evidence-review` | `contextBudget: normal`, `verificationTier: full` for accepted claims, `reviewTier: mandatory`, `evidenceMode: full-acceptance-record` |
| `documentation-authority` | `contextBudget: normal`, `verificationTier: standard`, `reviewTier: mandatory`, `evidenceMode: full-acceptance-record` |
| `ux-design-exploration` | `contextBudget: small`, `verificationTier: focused`, `reviewTier: risk-triggered`, `evidenceMode: registry-note` or `batched-evidence`; a mockup is not product truth |
| `lane-reconciliation` | `contextBudget: normal`, `verificationTier: focused`, `reviewTier: mandatory`, `evidenceMode: batched-evidence` |

## PLAN Acceptance Rule

PLAN may accept a Lean Dispatch handoff only after checking that the budget did
not remove required orchestration or evidence fields. A compact handoff can be
accepted when it carries all acceptanceGate fields for the lane's Work Type.

If a lean packet caused the WORK room to miss required context, PLAN marks the
handoff `needs-revision`, sends a Revision Packet to the same WORK room when
the original locator is usable, and expands only the missing context. If the
missing context changes owner, evidence target, source-of-truth rule, or
cross-repository contract, PLAN requires a Contract Change Request instead.

This keeps separate rooms cheaper without turning the context split into a
truth split.
