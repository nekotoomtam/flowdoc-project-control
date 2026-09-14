# FlowDoc Core Worktree Reconciliation — 2026-09-14

## Authority Boundary

Owner repository: `repo-core`.

Work: `flowdoc-frontend-expert-roadmap`.

This Project Control reconciliation records a user-authorized cleanup decision
for existing Core Git worktrees. It does not change Core code, merge any Core
candidate, alter Gate 2, discard evidence, promote map truth, or repair the
untracked backup directory in the Core checkout.

## Audit Basis

Every registered Core worktree was inspected for tracked cleanliness, exact
HEAD, and whether its HEAD is already an ancestor of Core `main` at
`bd6cc75589a22de569364e27bb4bb46d3986becb`. Project Control references and
active room status were also reviewed before selecting cleanup candidates.

## Approved Removal

The following worktrees are clean, contain no unique commit beyond `main`, and
have no current registered room or retained evidence obligation:

| Worktree | HEAD | Decision |
| --- | --- | --- |
| `C:/Users/nekot/.codex/worktrees/72b0/flowdoc-vnext-core` | `bd6cc75589a22de569364e27bb4bb46d3986becb` detached | remove worktree only |
| `C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core/.worktrees/core-preview-explicit-line-breaks-20260908` | `bd6cc75589a22de569364e27bb4bb46d3986becb` on `codex/core-preview-explicit-line-breaks-20260908` | remove worktree and merged branch |

Both removals require the worktree to remain clean at the point of deletion and
Core `main` to remain an ancestor of the target HEAD.

## Execution Result

On 2026-09-14, Git removed both worktree registrations and deleted the merged
`codex/core-preview-explicit-line-breaks-20260908` branch. The physical folders
remain and are intentionally retained as cleanup-incomplete:

- `72b0` is locked by an unidentified Windows process. Its creation time also
  overlaps a queued Core WORK-room provisioning attempt, which never resolved
  to a monitorable task ID. Treat it as unknown rather than deleting it.
- `core-preview-explicit-line-breaks-20260908` could not be removed because
  Windows encountered a path longer than its supported deletion path. Its
  contents now lack Git worktree registration, so they need a separate
  filesystem reconciliation that inventories untracked content before removal.

Neither residual is evidence of a successful cleanup. No forced recursive
deletion, branch recreation, or deletion of the separate backup directory was
performed.

## Retained Worktrees

All remaining Core worktrees are retained. They are detached diagnostic
candidates, unmerged branches, historical implementation work, or contain
tracked changes. In particular, retain the blocked Gate 2B candidate at
`C:/Users/nekot/.codex/worktrees/7c82/flowdoc-vnext-core` on commit
`1540b7d71154e40b793c3c5ee0fffa90aa2569fc`, because the run-owned property
contract and its evidence cite it directly.

## Separate Blocker

The untracked directory
`C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core/.git.broken-backup-25690905-002257`
is not a Git worktree and is intentionally outside this cleanup. Git encounters
Windows path-length failures while scanning it; it needs a separate data
reconciliation before it can be moved or removed.
