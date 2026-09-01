# FlowDoc Agent Documentation Authority Operating Rules

## Authority Boundary

This document governs FlowDoc agent behavior before an agent creates, updates,
migrates, summarizes, or deletes Markdown. It is owned by Project Control under
`flowdoc-product-development-resumption > agent-and-skill-design`.

This is an agent-facing operating contract. It does not promote Core, Backend,
Editor, compatibility, release readiness, frontend readiness, FlowDoc product
truth, or map truth. Product repositories still own their implementation,
runtime behavior, tests, local setup, and code-adjacent contracts.

The FlowDoc documentation authority policy remains the canonical policy. The
role catalog remains the canonical role inventory. This document makes the
policy executable for agents by turning the cleanup root cause into a repeatable
gate, role overlays, and handoff requirements.

## Work Context

- Work path: `flowdoc-product-development-resumption > agent-and-skill-design`
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with `documentation-synthesizer`
  responsibility for the prose
- Current Phase: `phase-agent-and-skill-design-documentation-authority-operating-rules`
- Checklist target:
  `checklist-agent-and-skill-design-documentation-authority-operating-rules`
- Evidence target:
  `evidence-flowdoc-agent-documentation-authority-operating-rules-2026-09-01`
- Known risks: generic planning skills still describe repo-local
  `docs/superpowers` plan output; future agents may follow that default unless
  the FlowDoc override is explicit
- Unknown state: this document does not create packaged Codex skill files or
  prove future agent compliance outside the Project Control guidance layer

## Why The Drift Happened

FlowDoc Markdown drift was not caused by one bad decision. Several conditions
lined up:

- The generic `writing-plans` skill default tells agents to save plans to
  `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`. That is useful in
  ordinary repositories but unsafe for FlowDoc-wide truth when the active
  authority is Project Control.
- Older product-repository `AGENTS.md` files routed broad FlowDoc work through
  Project Control, but they did not yet spell out the documentation authority
  boundary, the `docs/superpowers` prohibition, or a strict Authority Boundary
  requirement for surviving repo-local Markdown.
- Project Control documentation authority policy arrived after many
  product-repository plans and specs. The foundation policy was recorded at
  Project Control commit `98bcec99d905c95feb765c1d630bda2f225bd998` on
  2026-08-31, while older Core, Backend, and Editor planning files already
  existed.
- Role guidance tightened later. The first role-catalog rewrite at Project
  Control commit `be0729767ba3e86a828e4f133edf17380ab77fbe` named
  Documentation Authority For Roles, but it still needed this operating gate to
  make future agent steps unambiguous.
- Guard coverage was late and uneven. Product repositories gained strict
  Markdown authority guards only after cleanup work began, so earlier agents had
  no automated failure when a broad plan landed in a product repo.
- Visible-only scans missed hidden tracked Markdown. Core had tracked
  `.superpowers/sdd` Markdown that a normal visible-file scan could miss. For
  FlowDoc authority work, agents must use tracked-file scans such as
  `git ls-files -- '*.md'`; visible scans are only supplementary.
- Plan, evidence, and map truth were sometimes close together in wording. When
  plan text looked polished, it could feel like a truth source even though Work
  records, plans, and historical execution traces are not evidence by
  themselves.

## Markdown Authority Pre-Action Gate

Before any FlowDoc agent writes, moves, retires, summarizes, or deletes
Markdown, it must pass this gate.

1. Read Project Control first: `AGENTS.md`,
   `docs/domains/flowdoc-documentation-authority-policy.md`, this document,
   `docs/domains/flowdoc-role-catalog.md`, and
   `docs/domains/agent-and-skill-operating-model.md`.
2. Resolve the execution context in the handoff language: Work path, owner
   repository, active role, Phase, Checklist, Evidence, risks, and unknown
   state.
3. Classify the target writing before creating or editing it:
   Project Control canonical, repo-local code-adjacent, repo-local historical,
   migration candidate, retirement candidate, or blocked.
4. If the writing records FlowDoc-wide status, role definitions, Work
   sequencing, cleanup decisions, cross-repository readiness, product
   terminology, or map-truth boundaries, place it in Project Control records or
   Project Control documents first.
5. If a generic skill says to write a FlowDoc-wide plan or spec into a product
   repository, Project Control override wins. Do not create product-repository
   `docs/superpowers/plans` or `docs/superpowers/specs` files for FlowDoc-wide
   truth.
6. If repo-local Markdown is truly needed, read that repository's `AGENTS.md`,
   keep the file code-adjacent and repository-owned, add an Authority Boundary,
   and add or update that repository's guard so tracked Markdown cannot survive
   without the boundary.
7. Use `git ls-files -- '*.md'` for repository-wide Markdown authority scans.
   Use visible scans only to supplement tracked-file evidence, not to replace
   it.
8. Keep plan, evidence, and map truth separate. A plan can say what the round
   intends to do. Evidence records and repository-owned checks support bounded
   claims. Maps change only after supported Project Control records exist.
9. If Project Control cannot identify the Work path, owner repository, current
   Phase, Checklist target, and Evidence target, stop before editing and report
   exactly:

```text
BLOCKER: FlowDoc Project Control unavailable or unresolved.
```

## Role Overlays

These role overlays are narrow modes an agent can wear together with the
existing FlowDoc roles. They do not replace Project Control Steward, Planning
Partner, Documentation Synthesizer, Product Implementation Agent, Evidence
Reviewer, Cross-Repo Boundary Reviewer, or Lane Reconciliation Reviewer.

### Documentation Authority Steward

Responsibility: decide where a Markdown change belongs before the file exists.
This overlay applies whenever an agent is about to create, update, migrate,
summarize, or delete FlowDoc Markdown.

Must not do: follow a generic planning-skill output path when it conflicts with
Project Control authority.

Handoff: report the writing classification, owner repository, governing
Project Control document or Work item, and whether a repository guard changed.

### Repo Documentation Curator

Responsibility: keep repo-local Markdown bounded to code-adjacent,
repository-owned, or historical context after Project Control has identified
the owner repository.

Must not do: let repo-local Markdown claim FlowDoc-wide status, readiness,
cleanup sequence, role authority, or map truth.

Handoff: report every retained file, its Authority Boundary, its guard coverage,
and any retired source path with retained value or discard rationale.

### Evidence Registrar

Responsibility: turn a completed documentation-authority round into Project
Control Evidence, Document, Work, Phase, and Checklist records.

Must not do: cite a plan, glossary, or cleanup intention as proof of product
truth.

Handoff: report repository id, commit, path or contract id, checks run, claims
supported, and claims intentionally left unpromoted.

### Documentation Cleanup Reviewer

Responsibility: review deletion, retirement, or migration of Markdown after
inventory and classification are complete.

Must not do: delete a file because it looks stale before Project Control records
retained value, source evidence, or discard rationale.

Handoff: report inventory source, classification, retention decision, evidence
target, cleanup action, and remaining risks.

## Handoff Requirement

Any FlowDoc round that touches Markdown must end with:

- PASS, FAIL, BLOCKER, RISK, and UNKNOWN statements as applicable.
- Work ID, Phase ID, Checklist item IDs, and Evidence target.
- Files changed, grouped by repository.
- Whether a map changed, which map changed, and what supports it.
- Which claims intentionally stayed out of maps.
- Which product states remain unknown.

This keeps future agents from turning good-looking notes into shared truth.
