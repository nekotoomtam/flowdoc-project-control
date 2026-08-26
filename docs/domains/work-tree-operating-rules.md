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

## Handoff

End with PASS, FAIL/BLOCKER, RISK, UNKNOWN, Work ID, Phase ID, Checklist item IDs, files changed, tests run, evidence or map updates, intentionally not changed, and next recommended work.
