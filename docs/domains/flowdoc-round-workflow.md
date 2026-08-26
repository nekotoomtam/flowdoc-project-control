# FlowDoc Round Workflow

## Purpose

This workflow defines the shared shape of one FlowDoc work round. It keeps
scope, repository ownership, evidence, and remaining uncertainty visible while
Project Control reconstructs and maintains system truth across Project Control,
Core, Editor, and Backend.

Project Control is the governing entrypoint for FlowDoc work rounds. Future
Codex rooms and agents should start here before treating any FlowDoc repository
state as current, selecting a role, promoting a map, or opening a broad product
implementation round.

If a FlowDoc request starts in another repository or chat, first check Project
Control for the relevant Work path, Phase, Checklist target, Evidence target,
Node, Document, and Repository records, then continue in the owning repository
only after scope and evidence targets are clear.

Use this workflow before broad work, cross-repository work, evidence
registration, lane cleanup, documentation synthesis, or product implementation.
It is a coordination contract. It does not by itself prove that a product
system is current.

## 1. Round intake

Before work starts, name the round in plain terms:

- Lane or Work item: the Project Control Work record or explicit user request.
- Work path: the parent Work chain from the broad topic to the executable task,
  when a task exists.
- Owner repository: Project Control, Core, Editor, Backend, or a bounded set of
  repositories.
- Active role: Planning Partner, Project Control Steward, Evidence Reviewer,
  Lane Reconciliation Reviewer, Cross-Repo Boundary Reviewer, Documentation
  Synthesizer, or Product Implementation Agent.
- Current Phase: the active or next Phase for an executable Work task.
- Checklist target: the Checklist item or Checklist group that will be reported
  at handoff.
- Evidence target: the command, path, contract, document, or Evidence record
  that would support the bounded claim.
- Expected output: commit, evidence packet, map update, recommendation,
  cleanup decision, health report, or another explicit deliverable.
- Stop condition: the missing input, dirty state, failing check, ownership
  conflict, or unsupported claim that should pause the round.

## 2. Context check

Read the local context for the owner repository before editing:

- the owner repository's `AGENTS.md`;
- related Work, Node, Document, Repository, and Evidence records;
- current Phase, Checklist target, and Evidence target for executable Work;
- current git branch, local changes, and untracked files;
- whether the checkout is `main` or a dedicated worktree for the current
  round;
- the boundary between plan, truth, evidence, risk, and unknown state.

If the working tree is dirty, classify the changes before continuing:

- work that belongs in the current round;
- user or previous-agent work that must be preserved but not touched;
- work that should be split to another branch, cleanup review, or later round.

## 3. Scope decision

Before implementation or record edits, state:

- which repository owns the change;
- which repositories are intentionally not being edited;
- which dedicated worktree will hold the work, or why the user explicitly
  approved same-checkout maintenance;
- which claims must remain unpromoted;
- which check, path, test, contract, commit, or Evidence record would be enough
  to close the round.

This decision keeps Project Control from becoming product implementation and
keeps planned outcomes out of system truth maps.

## 4. Execute

Work only inside the approved scope:

- Product behavior changes belong in the owning product repository.
- Project Control changes should edit canonical sources under `data/` and
  `docs/`.
- Non-read-only FlowDoc work must happen in a dedicated worktree created from
  `main` before implementation unless the user explicitly approves
  same-checkout maintenance.
- Commit and verify in the worktree before merging. Keep `main` as the clean
  integration target, not the experimentation surface.
- `generated/project-index.json` is deterministic output and should be
  regenerated, not hand-edited.
- Work records can track intent, but they do not prove truth.
- Maps should change only after implementation, verification, and Project
  Control registration support the new state.

## 5. Verification

Before reporting success, run fresh verification for the repository or
repositories touched. Record the command and result.

For worktree-based rounds, verification has two gates:

1. Run the relevant gate in the worktree before merging.
2. After the worktree is merged to `main`, run the required gate again on
   `main`.

Only after the merged `main` gate passes may the completed worktree and merged
branch be removed. Do not remove a dirty worktree, an unmerged branch, or a
lane whose unique patches are not understood.

If a claim is strong enough to affect a Node, Document map, or system map, it
needs durable support such as:

- repository id;
- exact commit;
- file path, test path, contract id, or Evidence record;
- verification summary;
- remaining unknowns or explicitly excluded authority.

If that support is missing, report `UNKNOWN`, `RISK`, or `BLOCKER` instead of
promoting the claim.

## 6. Evidence packet

When a round produces evidence, return or record a bounded evidence packet:

- repository id;
- commit SHA;
- relevant files, paths, tests, or contracts;
- commands run and results;
- related Work, Node, Document, or map records;
- supported claims;
- claims intentionally left unknown or unpromoted.

Evidence packets are narrow by design. They should not promote parent nodes or
unreviewed repository areas by implication.

## 7. Project Control update

If the round changes Project Control's shared knowledge:

- add or update Evidence records;
- add or update Document records;
- update Node links or Work state when supported;
- update the narrowest map that changed;
- regenerate `generated/project-index.json`;
- run the Project Control gate.

Do not update `docs/domains/flowdoc-system-map.md` merely because work started
or because a plan expects success. Update maps after reviewed evidence exists.

## 8. Handoff

End broad work with:

- PASS: what is verified and by which command or evidence.
- FAIL / BLOCKER: what prevents continuation.
- RISK: known hazards that did not block the current phase.
- UNKNOWN: what remains unverified.
- Work ID, Phase ID, and Checklist item IDs: the execution context being
  reported.
- Files changed: grouped by repository.
- Behavior changed: user-facing, contract-facing, or record-facing effects.
- Tests run: command and result.
- Evidence or map updates: what changed and what supports it.
- Intentionally not changed: boundaries preserved by design.
- Worktree cleanup: merged, retained, blocked, or intentionally not applicable.
- Next recommended work: the smallest useful next round.

This handoff keeps reconstructed history honest while letting FlowDoc move
forward one verified round at a time.
