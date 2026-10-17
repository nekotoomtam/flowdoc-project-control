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

### Duplicate Removal Execution Result

After the Project Control main gate passed, Git removed
`C:/Users/nekot/.codex/worktrees/7c1a/flowdoc-vnext-core` completely. Its
worktree registration and physical checkout no longer exist; the preserving
unmerged branch remains unchanged.

Git also removed the `ede4` worktree registration, but Windows returned
`Permission denied` while deleting
`C:/Users/nekot/.codex/worktrees/ede4/flowdoc-vnext-core`. The residual
directory was empty when inspected and is no longer listed by `git worktree
list`. It is a filesystem cleanup-incomplete record rather than a retained
Core worktree. No forced recursive deletion or process termination was used.
It may be removed only after the lock is released and the exact empty target is
rechecked.

## Approved Archival Checkout Removal

A final audit found six more registered checkouts that are fully clean but are
only physical copies of historical, unmerged Core commits. Their branches keep
the commits reachable and the historical Project Control work records continue
to name the old checkout locators as execution history. Those records do not
require a live checkout at the old path.

| Worktree | HEAD | Durable retention | Decision |
| --- | --- | --- | --- |
| `core-incremental-boundary-g2a-20260913` | `d5031b6151a0a6aba2fbe2c3320f122a935470a3` | `codex/core-incremental-boundary-g2a-20260913` | remove worktree only |
| `core-incremental-typing-feasibility-20260913` | `064d84422ce10855cf5c85ee04fa2e8a03113944` | `codex/core-incremental-typing-feasibility-20260913` | remove worktree only |
| `typing-baseline-g1-a1` | `f19088445d2b9848d36e3b206178d40853dbd73f` | create `codex/archive-typing-baseline-g1-a1-20260914` first | remove worktree only |
| `core-creator-native-tail-20260909` | `4e3b0c9aa4a4d916c78ea5da8e9bac4cffdc4224` | `codex/core-creator-native-tail-20260909` | remove worktree only |
| `core-edit-safety-proof-20260909` | `92f96fc6726679769ea49b1a5d0202f103dd7c89` | `codex/core-edit-safety-proof-20260909` | remove worktree only |
| `core-preview-shape-memo-20260909` | `5e7b81313d8593e700e93dcf1f4d5deaa42e2fa1` | `codex/core-preview-shape-memo-20260909` | remove worktree only |

Before every removal, recheck the resolved absolute path, full status including
untracked files, exact HEAD, and the listed retaining branch. Do not delete the
retaining branch. This decision does not include `7c82`, which remains the
current semantic candidate, or `8faf`, which has tracked changes.

## Separate Blocker

The untracked directory
`C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core/.git.broken-backup-25690905-002257`
is not a Git worktree and is intentionally outside this cleanup. Git encounters
Windows path-length failures while scanning it; it needs a separate data
reconciliation before it can be moved or removed.
