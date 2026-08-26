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
