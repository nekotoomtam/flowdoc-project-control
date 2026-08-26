# Work Tree Operating Rules

## Purpose

Project Control separates durable system knowledge from work execution. The Work tree records execution context separately from the Node tree. New FlowDoc rooms use these rules to identify the current Work path, Phase, Checklist target, and Evidence target before editing product repositories.

## Required Reading Order

1. `AGENTS.md`
2. `docs/domains/flowdoc-system-map.md`
3. `docs/domains/document-map-operating-rules.md`
4. `docs/domains/flowdoc-role-catalog.md`
5. `docs/domains/flowdoc-round-workflow.md`
6. `docs/domains/work-tree-operating-rules.md`

## Resolution Gate

Before execution, identify one Work item, one owner repository or bounded repository set, one active role, one current Phase, one Checklist item or Checklist group, and one Evidence target. If Project Control cannot identify owner repository and evidence target, stop with:

```text
BLOCKER: FlowDoc Project Control unavailable or unresolved.
```

## Truth Boundary

Work, Phase, Checklist, and SQLite projection state do not establish Node truth. Durable `current` claims still require Evidence records or repository-owned verification.

## Worktree Discipline

Any non-read-only FlowDoc work that may edit files must start in a dedicated
worktree from `main` unless the user explicitly approves same-checkout
maintenance. The worktree is the execution space; `main` is the clean
integration target.

Commit and verify inside the worktree first. Merge to `main` only after the
worktree gate passes, then run the required gate again on `main`. After the
merged `main` gate passes, remove the completed worktree and merged branch so
stale lanes do not confuse future rooms.

Do not delete a dirty worktree, an unmerged branch, or a lane with unique
patches that are not understood. Switch to Lane Reconciliation Reviewer and
report the blocker instead.

## Handoff

End with PASS, FAIL/BLOCKER, RISK, UNKNOWN, Work ID, Phase ID, Checklist item IDs, files changed, tests run, evidence or map updates, intentionally not changed, and next recommended work.
