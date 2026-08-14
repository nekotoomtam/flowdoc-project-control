# FlowDoc Core Documentation Wave A Orientation Design

**Status:** Approved for implementation planning

**Date:** 2026-08-14

**Repository of authority:** `flowdoc-project-control`

**Source repository:** `flowdoc-vnext-core`

**Frozen Core inventory commit:** `76a2f2311a898e781f53773390d47b05812911e4`

**Frozen inventory count:** 470 Markdown files

**Frozen inventory digest:** `36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b`

## 1. Purpose

Wave A must turn a large set of accumulated Core documents into a small number of bounded, executable consolidation batches without repeating the cost of the `core-route` pilot. The first Wave A step is therefore an orientation pass, not immediate synthesis or deletion.

The orientation pass reads high-level records first to build a provisional map of each family, then assigns every source record to one semantic subgroup. Later work reads and verifies the detailed records inside one subgroup at a time, writes canonical leaves, and only then writes a replacement family overview.

The primary outcome is speed with controlled accuracy: finish the documentation consolidation so FlowDoc product development can resume, while retaining exact source coverage and avoiding unsupported current-state claims.

## 2. Scope

The orientation pass covers exactly these four reviewed candidate families from the frozen inventory:

| Family | Frozen source count |
| --- | ---: |
| `template-builder` | 73 |
| `live-draft` | 64 |
| `text-engine` | 26 |
| `text-block` | 10 |
| **Total** | **173** |

This design does not consolidate the 173 sources into canonical prose. It produces the reviewed semantic map and leaf-batch boundaries required to do that work quickly and predictably.

## 3. Locked Decisions

1. Understanding proceeds from overview to detail; canonical writing proceeds from verified detail back to overview.
2. Old overview-like documents are orientation evidence, not current authority.
3. Prefix membership establishes the four candidate families but does not establish semantic subgroup boundaries.
4. Every frozen source belongs to exactly one primary subgroup or one explicit non-leaf disposition. Cross-cutting relationships are references, not duplicate assignment.
5. A normal leaf batch contains 15–25 source records. A larger batch must be split or carry a written reason proving that splitting would damage one coherent contract.
6. All four family maps are completed before the first leaf batch is selected for synthesis.
7. Schema and generic migration tooling remain frozen during orientation. The implementation may add only Wave A data and a narrowly scoped completeness test.
8. Orientation does not modify Core, delete sources, publish canonical documents, or change Project Control current truth.
9. Final family overviews are written only after every canonical leaf in that family passes content and evidence review.
10. Performance or infrastructure work discovered during orientation is recorded separately and does not expand this scope.

## 4. Two-Level Decomposition

### 4.1 Level One: Family Orientation

For each family, reviewers select approximately three to eight orientation records. Likely candidates include:

- overview or architecture records;
- design or architecture locks;
- current contract records;
- handoff or integration summaries;
- readiness and close audits;
- package or example READMEs that define an operational boundary.

Selection is based on actual content. A filename containing `OVERVIEW`, `LOCK`, `CLOSE`, or `README` is not sufficient by itself.

The orientation set provides a provisional answer to:

- what the family is responsible for;
- which major concerns exist inside it;
- how those concerns depend on each other;
- which records claim to be current, historical, or superseded;
- which claims must later be checked against code, tests, contracts, or Evidence.

No claim becomes current merely because an orientation record states it.

### 4.2 Level Two: Semantic Subgroups

The provisional family model is used to assign all family sources to bounded semantic subgroups. Each subgroup has:

- a stable subgroup ID and readable name;
- one-sentence responsibility and explicit boundary;
- its primary source paths;
- links to related subgroups;
- known conflicts, unknowns, or evidence requirements;
- a proposed canonical leaf path;
- a proposed synthesis order;
- a source count and batch-size decision.

The subgroup map is complete only when all 173 Wave A sources are assigned exactly once.

### 4.3 Canonical Writing Direction

After orientation is approved, each subgroup becomes a leaf-batch implementation task:

```text
orientation records
  -> provisional family map
  -> complete source assignment
  -> bounded leaf batches
  -> verified canonical leaves
  -> reviewed family overview
  -> family publication and source cleanup
```

This preserves the useful top-down reading order without allowing an old overview to dictate unverified canonical truth.

## 5. Orientation Artifact

Implementation creates one reviewed JSON orientation artifact at:

```text
migrations/V0_1_0a_1/core/wave-a-orientation.json
```

It records:

- the frozen inventory identity and the four exact family source counts;
- orientation source paths and selection rationale;
- the provisional model for each family;
- all semantic subgroups and their boundaries;
- exact primary source assignment for every source;
- subgroup dependencies and cross-references;
- proposed canonical leaf paths;
- conflicts and later evidence checks;
- batch sizes and synthesis order.

The artifact is migration planning data. It is not a canonical Core document, an Overview replacement, or a statement that the recorded claims are current.

A narrowly scoped focused test at `tests/core-doc-wave-a-orientation.test.ts` verifies the artifact against the existing frozen inventory and family map. No new generic CLI, schema version, or migration framework is introduced. The test owns this Wave A planning contract; generic migration validators do not consume the orientation artifact.

## 6. Execution Order

Orientation is completed across all four families before any detailed synthesis begins:

1. confirm the frozen inventory and exact 173-source Wave A scope;
2. select and justify the orientation set for each family;
3. draft the four provisional family models;
4. define semantic subgroups and assign every source;
5. record dependencies, conflicts, and evidence requirements;
6. split oversized subgroups into coherent 15–25-source leaf batches;
7. run the focused completeness test;
8. review the complete map for missing, duplicate, or misleading boundaries;
9. freeze the leaf-batch order for subsequent implementation plans.

The detailed synthesis order is derived from the completed map rather than assumed from prefix size or filename chronology.

## 7. Speed and Scope Controls

- The orientation pass does not run broad Core or Project Control test suites.
- It does not reread every source in full before forming the provisional subgroup map. Detailed reading occurs inside the owning leaf batch.
- Generic migration tools and schemas are frozen.
- Minor wording or process findings that do not affect source ownership, semantic boundaries, or later deletion safety are recorded and deferred.
- A tool or test defect becomes a separate correction task only when it blocks exact assignment or makes the orientation artifact unverifiable.
- The implementation plan must avoid repeated full reviews of unchanged inventory data.
- One orientation review closes the four-family map; later reviews focus on the leaf or family being synthesized.

## 8. Verification Strategy

Orientation verification is intentionally narrow. It proves:

1. the source inventory commit, count, and digest equal the frozen artifacts;
2. the family set is exactly `template-builder`, `live-draft`, `text-engine`, and `text-block`;
3. the family counts are exactly 73, 64, 26, and 10;
4. all 173 paths exist in the frozen family map;
5. every Wave A source has exactly one primary assignment;
6. no non-Wave-A source is assigned;
7. every orientation source belongs to its stated family;
8. every subgroup has a boundary, proposed leaf, source list, and evidence notes;
9. every batch is at most 25 sources or has an explicit cohesion rationale;
10. the orientation change touches only approved Project Control planning and focused-test paths;
11. Core remains unchanged and both worktrees retain an identifiable clean base.

Broad product tests are unnecessary because orientation changes no runtime, canonical truth, or source repository content.

## 9. Failure Handling

- A missing or duplicate source assignment blocks orientation approval.
- An ambiguous source is assigned to the most responsible primary subgroup and records cross-references plus an unresolved note; it is never duplicated silently.
- A disagreement between overview-like records is recorded for the owning leaf batch. Orientation does not resolve it by chronology alone.
- A source that does not fit its prefix family is recorded as a proposed move and remains within the 173-source closure until the reviewed map assigns its final owner.
- An unprovable current-state claim is marked as requiring executable evidence, not copied into a canonical destination.
- If a broad test is run accidentally and gives no verdict within about ten minutes, it is stopped and recorded as `NO VERDICT`; it does not expand orientation scope.

## 10. Handoff to Leaf Synthesis

After the orientation artifact passes review, each leaf batch receives a small implementation brief containing only:

- its subgroup boundary;
- its exact source paths and blobs;
- orientation records relevant to that subgroup;
- conflicts and evidence checks;
- proposed canonical leaf destination;
- cross-subgroup dependencies;
- focused verification and review requirements.

Leaf synthesis compares detailed sources with current code, tests, contracts, and accepted Evidence. A family closes only after all leaves pass, its final overview is written, provenance coverage is complete, active references are repaired, and the family-level publication and deletion gates pass.

## 11. Non-Goals

This orientation design does not:

- write canonical leaves or final family overviews;
- modify FlowDoc Core files;
- delete any of the 173 source records;
- change source dispositions to migrated or removed;
- add Project Control Nodes, Documents, Work, Risks, Unknowns, or Evidence;
- modify migration schemas or generic verification behavior;
- address non-Wave-A families;
- repair slow tests or broaden product verification;
- merge, push, tag, or publish either repository.

## 12. Completion Criteria

Wave A orientation is complete when:

1. all four family orientation sets are reviewed;
2. the four provisional family models are recorded;
3. all 173 sources have exactly one primary semantic assignment;
4. subgroup boundaries, dependencies, evidence needs, and proposed leaves are explicit;
5. oversized groups are split or justified;
6. the focused completeness test passes;
7. no Core file or canonical current-truth record changed;
8. the reviewed map yields an ordered list of bounded leaf-batch implementation plans;
9. no unresolved Critical or Important finding remains about coverage or boundary correctness.
