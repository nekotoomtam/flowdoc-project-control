# FlowDoc Documentation Authority Policy

## Purpose

This policy defines where FlowDoc documentation authority lives while the
repository-local Markdown cleanup is in progress. It is an operating contract
for Project Control and future agents, not product evidence.

Project Control is the canonical home for FlowDoc-wide shared understanding:
cross-repository status, Work paths, Phase state, Checklist targets, Evidence
targets, document authority, repository ownership, product terminology, and
map-truth boundaries.

Product repositories remain the authority for their own implementation,
runtime behavior, tests, package contracts, and local setup instructions.

## Repo-Local Markdown

Repo-local Markdown may remain only when it is code-adjacent,
repository-owned, or historical. Allowed repo-local Markdown includes:

- repository `AGENTS.md`, `README.md`, setup, package, or example guidance;
- code-adjacent API, boundary, fixture, migration, or runtime contracts owned
  by that repository;
- implementation notes that explain local code without claiming FlowDoc-wide
  status;
- historical notes or source documents that Project Control has not yet
  synthesized, retired, or explicitly superseded.

Repo-local Markdown must not become the place where FlowDoc-wide status,
cross-repository readiness, product truth, role definitions, Work sequencing,
or cleanup decisions are made.

Every repo-local Markdown file that survives cleanup must declare an Authority
Boundary. The boundary should name the owner repository, the narrow local scope,
what it does not prove, and the Project Control document or Work item that
governs any shared claim.

## New Markdown Rule

Do not create product-repository `docs/superpowers/plans` or
`docs/superpowers/specs` files for FlowDoc-wide truth. For cross-repository or
shared product understanding, first create or identify the Project Control
Work path, owner repository or bounded repository set, active role, Phase,
Checklist target, and Evidence target.

A product repository may still hold a local plan or spec when the claim is
strictly repository-owned and code-adjacent. That file must say it is local
scope only and must not outrun Project Control records.

## Cleanup Sequence

The cleanup order is:

Inventory -> classify -> summarize or register -> retire.

1. Inventory tracked Markdown in Project Control, Core, Backend, and Editor.
2. Classify each file as Project Control canonical, repo-local entrypoint,
   repo-owned contract, repo-local implementation note, historical note,
   migration candidate, or retirement candidate.
3. Summarize shared or cross-repository understanding into Project Control
   documents and records before removing the source file.
4. Register source commits, document records, evidence records, and remaining
   risks where a claim must remain durable.
5. Retire or delete only files whose retained value has been preserved or whose
   discard rationale is explicit in Project Control.

Repo-local Markdown is not deleted by this foundation phase. Cleanup requires
separate repository-owned phases and verification.

## Agent Timing

Agent role revisions come after the cleanup evidence is recorded. Until then,
agents should follow this policy, the existing role catalog, and the active
Project Control Work/Phase/Checklist records.

The later role revision should decide whether FlowDoc needs separate
Documentation Authority Steward, Repo Documentation Curator, Evidence
Registrar, or Documentation Cleanup Reviewer roles.

## Evidence Boundary

This policy does not promote Core, Backend, Editor, compatibility, frontend
readiness, or FlowDoc product truth. It only defines documentation authority
and cleanup sequencing for FlowDoc work.
