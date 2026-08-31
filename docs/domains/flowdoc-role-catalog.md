# FlowDoc Role Catalog

## Purpose

This catalog explains the working roles used when Codex helps with FlowDoc.
It is meant to be readable before a task starts, so the user and agent can
agree who is doing what, which repository owns the work, and what must be
reported back.

Roles are not job titles or permanent people. One agent can wear more than one
role in a small task, but broad work should name the active role so scope stays
clear.

## How to read a role

Each role answers four questions:

- Responsibility: what the role is allowed to own.
- Must not do: boundaries the role must preserve.
- Read first: local context the role should inspect before acting.
- Handoff: what the role must report when it stops.

## Documentation Authority For Roles

These rules apply before any role creates, updates, migrates, or deletes
FlowDoc Markdown.

- Project Control Steward owns shared Work, Phase, Checklist, Evidence,
  Document, Repository, and Node records. The steward keeps shared truth in
  Project Control and regenerates the read model from canonical sources.
- Documentation Synthesizer writes shared summaries in Project Control, not in
  product-repository superpowers files. It may retire repo-local Markdown only
  after retained value, source evidence, or discard rationale is recorded.
- Product Implementation Agent must not create product-repository
  `docs/superpowers/plans` or `docs/superpowers/specs` files for FlowDoc-wide
  truth. Repo-local Markdown may remain only when it is code-adjacent,
  repository-owned, or historical, and surviving repo-local Markdown should
  carry an Authority Boundary.
- Planning Partner must put broad plans in Project Control Work, Phase,
  Checklist, and Evidence targets before implementation. A plan is not
  evidence and must not be used as proof that a feature is current.
- Evidence Reviewer checks whether a claim has a repository id, exact commit,
  path or contract id, verification summary, and unresolved-risk boundary
  before recommending any truth-state change.
- Cross-Repo Boundary Reviewer rejects documentation that blends Project
  Control Node truth, Core runtime truth, Backend service truth, and Editor UI
  truth into one unqualified claim.
- Lane Reconciliation Reviewer records retain, merge, discard, or cleanup
  rationale before removing old worktrees or branches.
- Every agent handoff must name the Work path, owner repository, active role,
  Phase target, Checklist target, Evidence target, risks, and unknown state.

## Project Control Steward

Responsibility:

- Maintain Project Control canonical records in `data/`.
- Maintain Project Control documents in `docs/`.
- Regenerate `generated/project-index.json` from canonical sources.
- Keep Work, Document, Repository, Evidence, and Node records separate.
- Keep the read-only GUI honest about current, planned, risk, and unknown
  states.

Must not do:

- Claim product repository truth without recorded Evidence.
- Edit Core, Editor, or Backend implementation while acting only as steward.
- Treat a Work record as proof that a feature exists.
- Hand-edit `generated/project-index.json`.

Read first:

- `README.md`
- `OPERATIONS.md`
- `docs/domains/project-control.md`
- Relevant `data/nodes/`, `data/work/`, `data/documents/`, and
  `data/evidence/` records

Handoff:

- Records changed.
- Generated index status.
- Checks run.
- Truth claims intentionally unchanged.
- Any follow-up Evidence needed.

## Evidence Reviewer

Responsibility:

- Decide whether a strong claim has durable support.
- Check repository ID, exact commit, path or contract ID, verification summary,
  and node linkage.
- Recommend whether a node should remain `unknown`, `risk`, `planned`, or move
  toward `current`.

Must not do:

- Accept screenshots, notes, or memory as durable evidence by themselves.
- Promote a parent node because a child node has evidence.
- Hide uncertainty by writing a broad current-state summary.
- Replace repository-owned tests or contracts with Project Control wording.

Read first:

- The target Node record.
- Linked Document records.
- Linked Evidence records.
- The owning repository working agreement.
- The cited file, test, or contract when available locally.

Handoff:

- PASS claims with exact evidence.
- FAIL/BLOCKER claims with missing evidence.
- RISK claims that are partially supported.
- UNKNOWN claims that should stay unpromoted.
- Suggested Evidence records, if the claim is ready.

## Lane Reconciliation Reviewer

Responsibility:

- Review old worktrees and lane branches before cleanup.
- Identify unique commits and changed files.
- Check whether the unique patches are already represented in `main`.
- Preserve branch refs or record discard rationale before removing checkouts.

Must not do:

- Delete a dirty worktree.
- Delete branch refs before the user approves branch cleanup.
- Remove a lane whose unique patch is not understood.
- Treat hash difference as useful work if patch-equivalence says otherwise.

Read first:

- Related Work record.
- `git worktree list`
- Unique commits with `git log main..branch`
- Patch-equivalence result with `git cherry -v main branch`
- Final tree diff if patch-equivalence is ambiguous.

Handoff:

- Worktrees reviewed.
- Unique commits found.
- Retain, merge, discard, or already-in-main decision for each lane.
- Cleanup action taken.
- Branch refs intentionally retained or removed.

## Cross-Repo Boundary Reviewer

Responsibility:

- Keep Core, Editor, Backend, and Project Control ownership separate.
- Catch direct imports, copied semantics, bypassed backend gates, and local-only
  shortcuts that look like product truth.
- Review whether an integration follows the documented cross-repo operating
  flow.

Must not do:

- Move HTTP, React state, DOM state, or concrete storage into Core.
- Let Editor import Core internals outside its adapter boundary.
- Let Backend copy Core operation semantics instead of calling Core contracts.
- Treat local preview, QA, or development-only routes as production activation.

Read first:

- `../flowdoc-vnext-core/AGENTS.md`
- `../flowdoc-vnext-core/docs/CROSS_REPO_OPERATING_MAP.md`
- `../flowdoc-vnext-editor/AGENTS.md`
- `../flowdoc-vnext-backend/AGENTS.md`
- Tests that guard the touched boundary.

Handoff:

- Boundary PASS/FAIL/RISK/UNKNOWN.
- Files or imports reviewed.
- Checks run in each repository.
- Responsibilities intentionally kept closed.
- Decisions that need user approval.

## Documentation Synthesizer

Responsibility:

- Convert repository-owned source documents into bounded Project Control
  documents.
- Preserve authority limits, source commit references, and remaining unknowns.
- Keep family overview documents separate from leaf contracts and evidence.
- Add tests when wording must not accidentally promote truth.

Must not do:

- Rewrite source repository history.
- Turn a summary into migration coverage.
- Claim cleanup before a separate cleanup review.
- Promote a family or parent node without evidence for that exact claim.

Read first:

- Source inventory or family map.
- Source repository commit.
- Existing Project Control document records for the same node.
- Tests that protect the family being synthesized.

Handoff:

- Documents added or changed.
- Source authority used.
- Claims intentionally limited.
- Tests protecting the summary.
- Cleanup or evidence work still open.

## Product Implementation Agent

Responsibility:

- Implement behavior in the owning product repository.
- Follow the repository working agreement.
- Keep changes small enough to verify.
- Return evidence that Project Control can later record.

Must not do:

- Use Project Control as the place to implement product behavior.
- Cross repository boundaries without reading the operating map.
- Commit unrelated dirty changes.
- Claim completion without fresh verification.

Read first:

- Owning repository `AGENTS.md`.
- The relevant source and tests.
- Project Control Work and Document records that explain the requested lane.
- Cross-repo operating map when more than one repository is involved.

Handoff:

- Behavior changed.
- Files changed.
- Tests run.
- Risks left.
- Evidence candidates for Project Control.
- Intentionally not changed.

## Planning Partner

Responsibility:

- Turn broad user intent into a staged plan.
- Identify the right owning repository and role before implementation.
- Break large work into phases that can be verified.
- Keep user decisions explicit.

Must not do:

- Start broad implementation from a vague request.
- Hide tradeoffs when there are several plausible routes.
- Write a plan that crosses repository ownership without stop conditions.
- Treat a plan as proof that the work is done.

Read first:

- Current Project Control Work queue.
- Related node documents.
- Known risks and unknowns.
- Repository health baseline if the work is cross-repo.

Handoff:

- Recommended first phase.
- Alternatives considered.
- Required decisions.
- Stop conditions.
- Verification target for the phase.

## Default role selection

Use this quick route before starting:

| If the task says... | Start as... |
| --- | --- |
| "What is the status?" | Project Control Steward |
| "Can we trust this claim?" | Evidence Reviewer |
| "Clean up old branches/worktrees" | Lane Reconciliation Reviewer |
| "This touches Core, Editor, and Backend" | Cross-Repo Boundary Reviewer |
| "Summarize or publish docs" | Documentation Synthesizer |
| "Build/fix this feature" | Product Implementation Agent |
| "Help us decide what to do" | Planning Partner |

When unsure, start with Project Control Steward plus Planning Partner, then
switch roles after the owner and evidence target are clear.
