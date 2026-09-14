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

The remaining Core worktrees are retained until a separate reconciliation
either preserves their commits by a durable ref or records a discard decision.
They include unmerged implementation branches, historical diagnostic work, and
one checkout with tracked changes. In particular, retain the blocked Gate 2B candidate at
`C:/Users/nekot/.codex/worktrees/7c82/flowdoc-vnext-core` on commit
`1540b7d71154e40b793c3c5ee0fffa90aa2569fc`, because the run-owned property
contract and its evidence cite it directly.

## Second Audit and Approved Duplicate Removal

On 2026-09-14, the registered worktrees were audited again with full tracked
and untracked status, exact commits, Project Control locator searches, and the
visible Codex task list. Two clean detached worktrees are duplicate physical
checkouts rather than separate retained candidates:

| Worktree | HEAD | Why the commit remains available | Decision |
| --- | --- | --- | --- |
| `C:/Users/nekot/.codex/worktrees/7c1a/flowdoc-vnext-core` | `d5031b6151a0a6aba2fbe2c3320f122a935470a3` | the unmerged branch `codex/core-incremental-boundary-g2a-20260913` retains the same commit | remove worktree only |
| `C:/Users/nekot/.codex/worktrees/ede4/flowdoc-vnext-core` | `1540b7d71154e40b793c3c5ee0fffa90aa2569fc` | the retained Gate 2B candidate at `7c82` has the identical commit and is cited by the active semantic contract | remove worktree only |

Neither checkout has tracked or untracked changes. No visible active Codex task
uses either locator, and no Project Control record cites either exact locator.
The removal must use Git's single-worktree removal operation only. It must not
delete the preserving branch, the `7c82` candidate, any evidence, or an
unregistered filesystem residual.

The remaining worktrees are deliberately outside this duplicate-removal
decision: `8faf` has tracked changes; `7c82` is the active semantic candidate;
the two incremental branches and three September branches are unmerged; and
the `typing-baseline-g1-a1` detached baseline needs a separate retention or
discard decision before its sole physical ref can be removed.

## Separate Blocker

The untracked directory
`C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core/.git.broken-backup-25690905-002257`
is not a Git worktree and is intentionally outside this cleanup. Git encounters
Windows path-length failures while scanning it; it needs a separate data
reconciliation before it can be moved or removed.
