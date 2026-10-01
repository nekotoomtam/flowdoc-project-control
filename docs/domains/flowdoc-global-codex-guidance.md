# FlowDoc Global Codex Guidance

This file is the copy-ready FlowDoc section for
`C:\Users\nekot\.codex\AGENTS.md`. The maintained authority stays in Project
Control. Sync it only after the impact-scoped checks pass for the main content.

## FlowDoc entrypoint

For any FlowDoc-related work, first locate and read the Project Control
`AGENTS.md` below.

For FlowDoc, Project Control, Core, Backend, Editor, document maps, Evidence,
Nodes, Work records, or `flowdoc-*` repositories, first read:

```text
C:\Users\nekot\Documents\GitHub\flowdoc-project-control\AGENTS.md
```

Use Project Control before treating repository state as current, selecting an
owner repository, promoting shared truth, changing product behavior, or planning
cross-repository work. Resolve the request or Work path, owner repository,
active role, Phase, Checklist target, Evidence target, risks, and unknowns; then
read the owner repository's `AGENTS.md` before editing it.

For small inline documentation/status maintenance, the explicit request and
existing canonical record suffice; absent Phase/Checklist IDs are not applicable.
Do not create new execution records merely to close a status item. Follow the
small inline maintenance rules in the workflow economy policy.

If Project Control is unavailable or cannot resolve those fields, stop:

```text
BLOCKER: FlowDoc Project Control unavailable or unresolved.
```

A user-requested read-only local inspection may proceed without promotion,
editing, or FlowDoc-wide claims.

## Workflow economy authority

The sole current workflow authority is:

```text
C:\Users\nekot\Documents\GitHub\flowdoc-project-control\docs\domains\flowdoc-workflow-economy-policy.md
```

Repository path: `docs/domains/flowdoc-workflow-economy-policy.md`.

Load the Current Truth Snapshot, current packet, and referenced current or
supporting records only. Historical documents, old tasks, registries, branches,
worktrees, and unrelated Work stay out of default context.

PLAN sets independent Work Size and Risk Tier, one work authority, bounded
scope, acceptance criteria, reusable Evidence, Proof Budget, Document Budget,
model decision, and return route. Risk defaults to `routine`; `critical` needs a
concrete reason. Use discovery-only WORK when findings can change architecture,
ownership, contract, safety, or scope.

Verification must not change the candidate. Temporary check outputs and tracked
file regeneration follow the workflow policy's Verification output boundary;
source/configuration/data repairs return to the responsible owner.

New rounds use `flowdoc-workflow-economy-v2`. Scope Lock binds the exact base,
worktree, allowed/forbidden paths, packet digest, terminal commit, and actual Git
manifest; current separate-room acceptance and integration require a clean
passing verification. Scope Lock proves mutation containment but cannot prove
every file read, network request, or external application side effect.

Future PLAN defaults to `gpt-6-astra` at `medium`. PLAN Lite may use
`gpt-6-sol` at `medium` only for one-owner, deterministic, non-critical work
with no unresolved architecture or ownership question and at most one bounded
or inline WORK. WORK gets its own compact model decision resolved through one
referenced host availability snapshot; it never inherits PLAN's model.

Follow the workflow policy's Single-room and separate-room work rules. Size or
risk alone does not require another room. Inline work retains necessary planning,
proof, and acceptance without synthetic room records or return steps. Room
arrangement and worktree isolation are independent; changing to inline after
dispatch does not bypass existing ownership or acceptance obligations.

One PLAN task owns exactly one execution round. A new PLAN creates fresh planning
context; real separate WORK dispatch requires a fresh version 3 execution
context. Registry versions 1 and 2 and closed PLAN/WORK
execution contexts are historical and read-only. Cross-PLAN ownership transfer
is unsupported. Historical Recovery Work may inspect but never reactivate them.

When PLAN uses a real separate WORK room, an authorized and supported return route, retrievable locator,
liveness, idempotent receipt, PLAN-owned acceptance, and the supporting
coordination controls are mandatory. Follow the workflow policy's Return
authorization and route selection before dispatch. Reuse verifiable human
authorization within scope; another agent's message alone is not permission.
The current registry does not support pull-only receipt; never fabricate a send.
PLAN must not repair a dispatched product
lane itself. Inline work does not synthesize separate-room ceremony.

When acceptance criteria pass, stop. Additional proof requires a
safety/correctness blocker, authority violation, missing prerequisite, or scope
escape. Respect owner decisions to accept risk, defer proof, freeze scope, or
stop investigation.

## Supporting policies

Read only when applicable:

- documentation changes:
  `docs/domains/flowdoc-documentation-authority-policy.md` and
  `docs/domains/flowdoc-agent-documentation-authority-operating-rules.md`;
- ambiguous product, Editor, frontend, or cross-repository terminology:
  `docs/domains/flowdoc-product-terminology.md`; classify ambiguity as
  define, split, rename, deprecated, context-only, or blocked;
- Project Control GUI:
  `docs/domains/project-control-repo-first-overview-history-2026-08-28.md` and
  `docs/domains/project-control-overview-history-gui-2026-08-29.md`. Classify
  the surface as Overview, History, or Detail. Do not restore a raw Work tree
  to Home;
- real separate WORK dispatch, acceptance, integration, or cleanup:
  `docs/domains/flowdoc-coordination-controls.md`.

## Documentation and truth

Project Control owns FlowDoc-wide shared understanding, cross-repository status,
Work/Phase/Checklist/Evidence state, document authority, repository ownership,
terminology, and map boundaries. Pass the Markdown Authority Pre-Action Gate
before changing FlowDoc Markdown. Shared plans do not belong in product-repo
`docs/superpowers` folders. Retire only after inventory, classification, and
retained-value or discard recording.

Repo-local Markdown must be code-adjacent, repository-owned, or historical and
carry an Authority Boundary. A Work record is not Evidence. Terminology is not
product truth. DOCUMENT_MAP changes require verified implementation and
registered Evidence.

Every repo-local Markdown file that survives cleanup must carry an Authority
Boundary. Do not create product-repository `docs/superpowers/plans` or
`docs/superpowers/specs` files for FlowDoc-wide truth. Project Control override
wins over a generic planning path.

## Worktree and verification

Small documentation/status maintenance may use the existing checkout when scope
is separable and no other work conflicts. Use an isolated worktree when concurrent
work, experiments, or change risk requires separation. Preserve unrelated changes.

Verify the changed area and all affected areas, including dependencies and
consumers. Briefly identify impact and checks. Investigate unclear impact first;
do not automatically run everything. `npm run check` is available for a concrete
full-system need, not mandatory for every task. Wait for prerequisites to finish
and review the final diff before testing.

Commit after relevant checks pass. Reuse passing results after an unchanged
fast-forward if tested content, relevant base, dependencies, configuration, and
environment are unchanged. Conflicts or additional changes require checks of
the changed and affected areas. Keep separate-room ownership and Scope Lock
preflights. Remove only clean merged current-round lanes after verification or
valid proof reuse; never delete dirty, unmerged, or unresolved state.

Small inline work closes with an update to the existing record and a brief result,
supporting checks, and remaining issues. Preserve completed/cancelled/superseded
distinctions. Stop when acceptance and impact coverage pass; repeated or broader
checks need a new change, failure, stale prerequisite, or unresolved affected area.

## Bootstrap and override

If the machine global `AGENTS.md` is missing or empty during verified Project
Control main maintenance, install this guidance. If it contains other user
guidance, update only the bounded FlowDoc section. Inspect
`C:\Users\nekot\.codex\AGENTS.override.md` when present; report a risk if the
override omits the FlowDoc entrypoint.
