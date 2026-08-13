# FlowDoc Core Documentation Consolidation Design

**Status:** Proposed for implementation planning
**Date:** 2026-08-13
**Repository of authority:** `flowdoc-project-control`
**Source repository in scope:** `flowdoc-vnext-core`

## 1. Purpose

FlowDoc Core currently contains 470 tracked Markdown files. Most are design, plan, risk, decision, migration, status, or historical working documents accumulated across development phases. They preserve valuable reasoning, but their volume and overlapping authority make it difficult for a later maintainer or Agent to determine the current system truth.

This project consolidates those documents into a smaller, versioned canonical documentation set owned by Project Control. It preserves useful historical reasoning and exact provenance while removing superseded working documents from Core after each migrated family has been proved complete.

The target is not a shorter archive. The target is a documentation system in which a reader can start at a Core overview, descend into a family overview, reach one canonical leaf for a specific subject, and trace every material claim back to its source files, code, tests, and commits.

## 2. Locked Decisions

1. The first migration scope is FlowDoc Core only. Editor and Backend follow only after the Core process is proved.
2. Migration is prefix-first with semantic correction. A filename prefix identifies a candidate family; it does not determine authority or final boundaries.
3. Canonical understanding is synthesized from the bottom up:
   - source documents;
   - Canonical Leaf Documents;
   - Family Overview Documents;
   - one final Core Overview Document.
4. Canonical Core documentation is stored in Project Control under:

   ```text
   docs/versions/V0_1_0a_1/core/
   ```

5. Git records revisions inside a release line. A new version directory is created only when the release line changes materially, not for ordinary wording corrections.
6. `CORE_ROUTE_*` is the first end-to-end pilot family.
7. Source documents are removed from Core only after coverage, provenance, reference repair, verification, and independent review pass for that family.
8. Historical reasoning that remains useful is incorporated into the relevant leaf under `Historical Design Notes`; it is not preserved as an unstructured dump.
9. Project Control owns design, plan, risk, decision, work status, migration, and historical documentation.
10. Product repositories retain only code-adjacent documentation that must remain with the code.

## 3. Target Documentation Hierarchy

```text
docs/versions/V0_1_0a_1/core/
├─ CORE_OVERVIEW.md
├─ DOCUMENT_MAP.md
├─ core-route/
│  ├─ OVERVIEW.md
│  └─ <canonical-leaf>.md
├─ template-builder/
│  ├─ OVERVIEW.md
│  ├─ runtime.md
│  ├─ rich-inline.md
│  ├─ draft-editing.md
│  ├─ history.md
│  └─ rendering.md
├─ text-engine/
│  ├─ OVERVIEW.md
│  └─ <canonical-leaf>.md
└─ <additional-family>/
   ├─ OVERVIEW.md
   └─ <canonical-leaf>.md
```

The example leaf names are illustrative. The inventory and semantic split determine the exact final leaf set.

### 3.1 Canonical Leaf Document

A leaf owns the current detailed truth for one bounded subject. A reader should not need to inspect its source documents to understand the active contract.

Each leaf contains:

- stable document ID and release line;
- purpose and scope;
- current architecture or behavioral contract;
- invariants and ownership boundaries;
- code, test, contract, and Evidence references;
- current risks and unknowns that belong to this subject;
- `Historical Design Notes` containing only prior approaches that explain the current design or constrain future changes;
- provenance links to the family coverage record.

### 3.2 Family Overview Document

A family overview is written only after every leaf in that family passes review. It explains:

- the family purpose and boundary;
- how its leaves relate;
- data/control flow across leaves;
- cross-family dependencies;
- current risks and unknowns at family level;
- links to canonical leaves.

It does not duplicate leaf-level contracts and does not cite deleted source documents as active authority.

### 3.3 Core Overview Document

`CORE_OVERVIEW.md` is written last. It connects all completed families into the current Core architecture. It references only canonical family overviews and stable code/contracts. It is not a migration ledger or historical archive.

### 3.4 Document Map

`DOCUMENT_MAP.md` is the entry point for release line `V0_1_0a_1`. It lists the Core overview, every family overview, canonical leaves, lifecycle, ownership, and relevant Project Control Node IDs. It points to the central English and Thai glossaries.

## 4. What Remains in FlowDoc Core

After consolidation, Core may retain:

- repository `README.md` files needed to install, build, test, or use a package;
- license, security, and contribution files;
- code-adjacent contracts that must be versioned atomically with source code;
- machine-required or generated reference artifacts;
- narrowly scoped fixture or example documentation required to use that fixture or example.

Core does not retain:

- development plans;
- status reports;
- design explorations;
- decision narratives;
- risk and unknown registers;
- migration plans or progress records;
- historical SDD reports;
- duplicate copies of Project Control canonical documents.

An inventory classification must justify every Markdown file that remains.

## 5. Inventory and Classification

The migration begins with a read-only inventory of all 470 tracked Markdown files at one captured Core commit.

Each inventory row records:

- source repository and captured commit;
- source path;
- Git blob ID;
- filename prefix candidate;
- semantic subgroup candidate;
- document class;
- authority assessment;
- inbound and outbound Markdown references;
- code, test, or contract references found in the document;
- provisional disposition;
- eventual canonical destination;
- migration status.

### 5.1 Document Classes

- design;
- plan;
- decision;
- risk;
- unknown;
- status or closeout;
- migration;
- verification or audit;
- contract or code-adjacent reference;
- operational README;
- historical working record.

### 5.2 Provisional Dispositions

- `candidate-current` — may contain active truth;
- `historical-input` — useful reasoning but not active authority;
- `duplicate` — materially covered elsewhere;
- `repo-local-keep` — justified code-adjacent document;
- `needs-review` — classification is not yet safe;
- `migrated` — coverage and destination are verified;
- `removed-from-core` — source deletion committed after migration gates.

No automated classifier may mark a file as authoritative or deletable without review.

## 6. Family Formation

Filename prefix grouping provides the initial candidate families. Current large candidates include:

- `TEMPLATE_BUILDER_*`;
- `TEXT_ENGINE_*`;
- `PDF_CANONICAL_*`;
- `LIVE_DRAFT_*`;
- `PDF_EXPORT_*`;
- `TABLE_V4_*`;
- `WHOLE_DOCUMENT_*`;
- `TEXT_BLOCK_*`;
- `CORE_ROUTE_*`.

Each candidate family is semantically reviewed before synthesis. Review may:

- split a prefix into multiple leaves;
- merge a small prefix with a closely related family;
- move a misnamed file to another family;
- classify a file as repo-local or purely historical;
- identify cross-family references without duplicating content.

Prefix similarity alone never establishes current authority.

## 7. Authority and Current-Truth Rules

For every material claim, reviewers compare:

1. current source code;
2. current tests and fixtures;
3. stable exported contracts or schemas;
4. accepted implementation Evidence;
5. newer and older documentation claims.

When documents disagree, the canonical leaf records the disagreement and resolves it from executable evidence where possible. A newer filename or commit date does not automatically outrank a still-enforced code contract.

Unproved statements remain explicit risks or unknowns. Plans and intended designs must not be rewritten as current behavior.

## 8. Historical Design Notes

Historical notes preserve reasoning, not document volume. A historical note is retained only if it:

- explains why the current design exists;
- records a rejected alternative likely to recur;
- identifies a compatibility or migration constraint;
- preserves evidence needed to interpret current tests or contracts;
- describes an unresolved risk or unknown.

Each note states its former context, why it is no longer current, and what remains relevant. Obsolete task lists, duplicated prose, and superseded progress narration are not copied.

## 9. Provenance and Coverage

Every family has a machine-readable coverage record and a readable review summary in Project Control.

The coverage record maps each source path and blob ID to exactly one disposition:

- canonical leaf section;
- family overview section;
- historical note;
- justified repo-local keep;
- intentionally discarded duplicate or obsolete work record, with rationale.

A family cannot close while any source is unmapped, marked `needs-review`, or points to a nonexistent destination.

Provenance remains valid after source deletion because it records repository, commit, path, and blob. Git history remains the recovery mechanism; Project Control does not retain duplicate full source files.

## 10. Reference Repair

Before deleting source documents, migration identifies:

- Markdown links from retained Core files;
- links from other product repositories;
- references in Project Control;
- code comments or test fixtures that rely on stable document paths;
- plan/spec references that need historical provenance rather than an active link.

Active references are replaced with canonical Project Control destinations or stable contract references. Historical provenance uses repository, commit, and former path rather than a broken working-tree link.

Reference scans must pass before source deletion is committed.

## 11. Family Migration Transaction

Each family moves through a recoverable sequence:

1. capture exact Core and Project Control bases;
2. freeze the family source list and blobs;
3. classify and semantically split the family;
4. write leaf documents;
5. verify leaf claims against code/tests/contracts;
6. complete the coverage and provenance record;
7. review every leaf;
8. write and review the family overview;
9. register Nodes, Documents, Risks, Unknowns, Work, and Evidence in Project Control;
10. generate and validate the Project Control index;
11. repair active references;
12. delete only the migrated source files from Core;
13. run Core and Project Control gates;
14. obtain independent migration review;
15. commit Project Control publication and Core cleanup as explicit, reversible changes.

If any gate fails, source deletion does not proceed. A failed migration must leave both repositories in an identifiable pre-publication or reviewable state, not a partially authoritative state.

## 12. `CORE_ROUTE_*` Pilot

The four `CORE_ROUTE_*` documents form the first pilot because the family is small, already represented as queued Work in Project Control, and exercises cross-repository provenance without committing to a large synthesis.

The pilot must prove:

- inventory and family freeze;
- semantic split and authority resolution;
- canonical leaf template;
- historical-note policy;
- coverage/provenance representation;
- family overview template;
- Project Control registration;
- reference repair;
- safe source deletion;
- Core and Project Control verification;
- independent review and rollback evidence.

The templates and tooling produced by the pilot become reusable only after review. The pilot does not execute the separate `CORE_ROUTE_*` product migration or change runtime code.

## 13. Roadmap

### Phase 0 — Migration Contract

Publish this design, exact schemas/templates, deletion rules, and implementation plan.

### Phase 1 — Core Inventory

Inventory all 470 tracked Markdown files, build reference data, classify repo-local keeps, and create the reviewed candidate family map.

### Phase 2 — `CORE_ROUTE_*` Pilot

Execute one complete family transaction and correct the migration method before scaling.

### Phase 3 — Wave A: Editing Foundation

Provisional order:

1. `TEMPLATE_BUILDER_*`;
2. `LIVE_DRAFT_*`;
3. `TEXT_ENGINE_*`;
4. `TEXT_BLOCK_*`.

Large families are split into bounded semantic leaf batches. A family overview waits until all its batches pass.

### Phase 4 — Wave B: Document and Layout Foundation

Provisional candidates include `WHOLE_DOCUMENT_*`, `TABLE_V4_*`, `DOCUMENT_V4_*`, `VERTICAL_SLICE_*`, `SEQUENTIAL_WHOLE_*`, `TOC_V4_*`, and related layout, measurement, and structure families identified by inventory.

### Phase 5 — Wave C: Rendering and Export

Provisional candidates include `PDF_CANONICAL_*`, `PDF_EXPORT_*`, `PDF_RENDERER_*`, `RENDER_API_*`, and related renderer and artifact families.

### Phase 6 — Long Tail and Historical Workspaces

Classify and migrate remaining plans, specs, tracked SDD reports, project/version/coordination documents, package/example READMEs, and single-name documents.

### Phase 7 — Core Synthesis

Write all family overviews, `CORE_OVERVIEW.md`, and `DOCUMENT_MAP.md`; verify glossary usage and canonical-only active references.

### Phase 8 — Core Repository Closure

Audit the final Core Markdown allowlist and prove that no design/plan/risk/status/historical working documents remain outside Project Control.

### Phase 9 — Project Control Truth Plane

Complete the Core Node hierarchy and register every canonical document, risk, unknown, work item, and Evidence record needed for the GUI to represent current Core truth.

### Phase 10 — Editor and Backend Adoption

Create separate designs and plans using evidence from the Core migration. Reuse contracts and tooling, not unverified Core classifications.

### Phase 11 — Agent and Skill Architecture

After canonical documentation and terminology stabilize, design `AGENTS.md`, roles, capabilities, authority/handoff contracts, Skills, and context-package generation.

## 14. Verification Gates

Every family must satisfy all of the following:

- frozen source manifest matches the captured Core commit;
- every source has exactly one reviewed disposition;
- no unresolved coverage row remains;
- canonical claims are supported by code, tests, contracts, or explicit Evidence;
- historical notes retain material reasoning without presenting it as current;
- leaf documents pass content and reference review;
- family overview references only canonical leaves and stable contracts;
- Project Control schemas, semantic validation, generation, unit tests, build, and E2E pass;
- relevant Core type, test, build, and repository-specific gates pass;
- no machine-local path is committed;
- active references to deleted files are zero;
- both worktrees are clean after commits;
- independent review reports no Critical or Important finding.

## 15. Failure Handling and Recovery

- Inventory and synthesis never modify Core runtime code.
- Source deletion is a separate, reviewable step after Project Control publication is valid.
- Family commits remain independently revertible.
- A failed reference or test gate blocks deletion and publication closure.
- Provenance records always identify the original Core commit/path/blob so Git can recover exact content.
- Conflicting or unprovable claims are recorded as risks or unknowns, not silently resolved.
- Tooling must fail closed on incomplete coverage, duplicate source assignment, missing destinations, or unexpected inventory drift.

## 16. Test Strategy

The implementation plan must include:

- schema tests for inventory, family, coverage, and provenance records;
- negative tests for missing, duplicate, or changed source blobs;
- deterministic grouping and output tests;
- reference graph tests;
- coverage closure tests;
- tests proving deletion is blocked before all gates pass;
- tests proving repo-local allowlisted documents remain untouched;
- a real `CORE_ROUTE_*` RED/GREEN pilot;
- Core and Project Control full gates;
- independent contract and documentation-architecture reviews.

## 17. Non-Goals

This design does not:

- execute `CORE_ROUTE_*` runtime migration;
- modify Core runtime behavior;
- migrate Editor or Backend documents;
- design Agent roles or Skills yet;
- create a public documentation site or Doc API;
- add GUI write operations;
- introduce a database or hosted service;
- preserve every historical source file as a copied archive in Project Control;
- declare Core production-ready or fully documented before all family gates pass.

## 18. Completion Criteria

Core documentation consolidation is complete when:

1. all 470 captured Markdown files have reviewed dispositions;
2. every migratable family has canonical leaves and a reviewed overview;
3. `CORE_OVERVIEW.md` and `DOCUMENT_MAP.md` represent the complete current Core documentation set;
4. Project Control registers the final canonical truth and Evidence;
5. Core retains only the justified repo-local documentation allowlist;
6. no active reference points to a removed document;
7. all Core and Project Control gates pass;
8. independent final reviews report no Critical or Important finding.
