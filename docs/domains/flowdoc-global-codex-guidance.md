# FlowDoc Global Codex Guidance

This file is the copy-ready global guidance for:

```text
C:\Users\nekot\.codex\AGENTS.md
```

The canonical maintained copy lives in FlowDoc Project Control:

```text
C:\Users\nekot\Documents\GitHub\flowdoc-project-control\docs\domains\flowdoc-global-codex-guidance.md
```

## FlowDoc entrypoint

For any FlowDoc-related work, first locate and read:

```text
C:\Users\nekot\Documents\GitHub\flowdoc-project-control\AGENTS.md
```

FlowDoc-related work includes any request that mentions FlowDoc, project
control, Core, Editor, Backend, document maps, evidence, Nodes, Work records,
or repositories named `flowdoc-*`.

Use Project Control before treating any FlowDoc repository state as current,
choosing an owner repository, promoting shared truth, editing product behavior,
or planning cross-repository work.

After reading Project Control, identify:

- the explicit user request or Project Control Work item;
- the Work path, if the Work item belongs to a Work tree;
- the owner repository;
- the active role;
- the current Phase;
- the Checklist target;
- the Evidence target;
- known risks;
- unknown state.

Then read the owning repository's `AGENTS.md` before editing that repository.

## Terminology discipline

Before Editor, frontend, product behavior, cross-repository contract, or
ambiguous terminology work, read:

```text
C:\Users\nekot\Documents\GitHub\flowdoc-project-control\docs\domains\flowdoc-product-terminology.md
C:\Users\nekot\Documents\GitHub\flowdoc-project-control\docs\domains\flowdoc-product-terminology-th.md
```

These correspond to the Project Control document paths
`docs/domains/flowdoc-product-terminology.md` and
`docs/domains/flowdoc-product-terminology-th.md`.

Use the English product terminology document as the canonical vocabulary. The
Thai companion explains the same terms for coordination, but does not create a
second authority source for records, code, tests, contracts, or evidence.

When a term can mean different things across Project Control, Core, Backend, or
Editor, use the qualified canonical term or classify the ambiguity as `define`,
`split`, `rename`, `deprecated`, `context-only`, or `blocked`. If the
classification is `blocked`, stop or report `UNKNOWN`/`RISK` before
implementation.

The allowed ambiguity classifications are define, split, rename, deprecated,
context-only, or blocked.

Terminology is not product evidence. Do not promote FlowDoc, Core, Backend,
Editor, compatibility, readiness, or frontend design truth from glossary
language alone.

## Project Control GUI orientation

Before Project Control GUI, Project Control frontend, or agent-facing GUI
workflow work, read:

```text
C:\Users\nekot\Documents\GitHub\flowdoc-project-control\docs\domains\project-control-repo-first-overview-history-2026-08-28.md
```

Classify the GUI surface as Overview, History, or Detail before implementation.
Overview is the repo or area entry surface. History is the time-ordered record
surface that returns to a focused Overview. Detail is the inspection surface for
full Work, Project Control Node, Evidence, Checklist, document, risk, or
unknown records.

Do not treat History as Evidence, and do not turn an Overview summary into
product truth. If Project Control GUI navigation or agent workflow changes,
update the Project Control agent-facing documents in the same round or report
the deferred update as `RISK`.

## Worktree discipline

For any non-read-only FlowDoc work that may edit files, create a dedicated
worktree from `main` before implementation unless the user explicitly
instructs same-checkout maintenance.

Commit and verify inside the worktree first. Merge back to `main` only after
the worktree gate passes, then run the required verification again on `main`.
After the merged `main` gate passes, remove the completed worktree and merged
branch.

Do not delete a dirty worktree, an unmerged branch, or a lane whose unique
patches are not understood. Stop and report the cleanup blocker instead.

## Missing Project Control

If Project Control is missing, unreadable, or cannot identify the Work path,
owning FlowDoc repository, current Phase, Checklist target, and Evidence
target, stop before editing and report:

```text
BLOCKER: FlowDoc Project Control unavailable or unresolved.
```

Do not guess the owner repository, promote map truth, or edit product behavior
while this blocker is active.

## Local-only exception

If the user explicitly limits the turn to read-only local inspection inside the
currently opened repository, that inspection may proceed without Project
Control. Keep the result narrow and do not edit files, update maps, promote
truth, or claim FlowDoc-wide current state.

## Bootstrap and repair

If `C:\Users\nekot\.codex\AGENTS.md` is missing or empty during Project Control
maintenance, copy this file into that location so future Codex rooms inherit
the FlowDoc entrypoint rule automatically.

If `C:\Users\nekot\.codex\AGENTS.md` already exists and contains other user
guidance, preserve the existing guidance and add or update only a bounded
FlowDoc section with these rules.

If `C:\Users\nekot\.codex\AGENTS.override.md` exists, inspect it before broad
FlowDoc work. It can take precedence over the base global file. If it does not
include the FlowDoc entrypoint rule, report the risk before editing FlowDoc
repositories.
