# Live Draft Documentation Wave 2 Design

Status: Draft for user review

## Goal

Complete the Live Draft documentation synthesis as one accelerated family wave:

1. write one family overview as the navigation and ownership frame;
2. consolidate 64 frozen Core documents into six bounded canonical leaves;
3. register the overview, leaves, evidence, and Live Draft Node once;
4. keep Live Draft and broader Core `unknown`;
5. leave migration coverage, reference repair, publication review, and source
   cleanup for a later, separately authorized transaction.

This wave changes documentation truth in Project Control only. It does not
change Core runtime behavior, activate Editor or Backend integration, claim
browser Worker adoption, establish renderer/export parity, promote historical
phase verdicts to present truth, or authorize deletion of former sources.

## Why this is one family wave

The six leaves share one Live Draft architecture but own distinct evidence and
authority boundaries. Completing them in one wave avoids six repeated family
registration cycles while keeping every source assigned to exactly one leaf.

The wave produces seven canonical documents, not one 64-source monolith and
not 64 rewritten documents. The overview remains compact; detailed chronology,
contracts, limits, and evidence stay in the responsible leaf.

## Immutable input set

The source set is governed by
`migrations/V0_1_0a_1/core/wave-a-orientation.json`:

- family: `live-draft`;
- frozen Core source commit:
  `76a2f2311a898e781f53773390d47b05812911e4`;
- current read-only Core evidence head:
  `c503a45c03e0ce3b7a6efba2b029ca842017faa0`;
- orientation inventory digest:
  `36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b`;
- exact source assignment: 64 declared across six subgroups.

Core remains read-only. Every strong current-state claim must resolve to
current code, package, fixture, or focused test evidence at the pinned Core
head. Historical plans, phase labels, and scoped `PASS` verdicts remain
historical unless current executable evidence supports the same bounded claim.

## Canonical output set

Create one overview:

`docs/versions/V0_1_0a_1/core/live-draft/OVERVIEW.md`

Create six leaves:

| Order | Qualified subgroup | Sources | Canonical leaf |
| --- | --- | ---: | --- |
| 1 | `live-draft/product-readiness-and-renderer-boundaries` | 3 | `live-draft/product-readiness-and-renderer-boundaries.md` |
| 2 | `live-draft/geometry-and-scene-projection` | 16 | `live-draft/geometry-and-scene-projection.md` |
| 3 | `live-draft/persistent-flow-and-range-foundations` | 10 | `live-draft/persistent-flow-and-range-foundations.md` |
| 4 | `live-draft/root-and-v3-transition-contracts` | 10 | `live-draft/root-and-v3-transition-contracts.md` |
| 5 | `live-draft/source-authority-and-commit-transaction` | 20 | `live-draft/source-authority-and-commit-transaction.md` |
| 6 | `live-draft/corrective-evidence` | 5 | `live-draft/corrective-evidence.md` |

All paths are rooted at `docs/versions/V0_1_0a_1/core/`.

## Family architecture

The overview expresses this dependency direction without merging authority:

```text
product ownership and renderer no-relayout boundary
  → geometry facts and scene/display-list projection
    → persistent flow, ranges, affected lines, and oracle separation
      → 5A/5B Root V2 and scoped V3 transition contracts
        → 5B-2 source authority and source-commit transaction
        → bounded corrective evidence and residual-risk history
```

Cross-references explain dependencies only. A downstream leaf cannot silently
expand an upstream contract or convert scoped evidence into family-wide truth.

## Leaf ownership contracts

### Product Readiness and Renderer Boundaries

Owns cross-repository product responsibility and the renderer-consumption,
no-measurement, and no-relayout boundary. It excludes Core implementation
authority, product activation, Worker adoption, and broad cross-runtime parity.

### Geometry and Scene Projection

Owns bounded geometry producers, layout-unit policy, spatial wrapping,
authored-box and inline-image geometry, source segments, forced breaks, and
display-list projection. It excludes Canvas/PDF pixel parity, production
binding, and retained-root policy.

### Persistent Flow and Range Foundations

Owns persistent flow trees, contextual ranges, semantic checkpoints,
affected-line planning, structural reuse, and complete-oracle comparison. It
does not turn complete QA materialization into per-keystroke performance proof.

### Root and V3 Transition Contracts

Owns the accepted 5A root, 5B Root V2 transition, V3 corrective policy, and
their exact source-envelope limits. It excludes later 5B-2 transaction
internals and keeps inactive capability rows bounded to their named evidence.

### Source Authority and Commit Transaction

Owns producer invocation, source topology, evidence/work ownership, fallback
targets, and the exact source-commit transaction seam. The 2026-08-11 approved
amendment governs conflicts with the earlier seam design only where current
implementation evidence confirms the amendment. Thai and English companion
material must preserve the same contract.

### Corrective Evidence

Owns five scoped repair, review, and verification records as evidence and
residual-risk history. A scoped review result never becomes a normative
implementation contract or extend beyond its reviewed range.

## Conflict policy

The six orientation conflicts are mandatory review items:

- dated handoff prose preserves historical Phase 3/4 and explicit NO-GO areas;
- XR-4/XR-5 prove selected projection rows, not Canvas/PDF glyph-pixel parity;
- range/oracle work does not establish interactive performance;
- V3 scoped policy and later replanning must be separated by exact evidence;
- the 2026-08-11 seam amendment and Thai/English companions must not drift;
- an earlier blocked type-check and later scoped verification cover different
  ranges and cannot be resolved by chronology alone.

Current executable evidence controls current wording. Historical intent stays
labelled as history. Unresolved contradictions remain `unknown` or excluded;
they are never averaged into a stronger statement.

## Accelerated execution model

### Three isolated parallel lanes

Use all available concurrency without concurrent shared-truth edits:

1. **Lane A — 19 sources:** product readiness plus geometry/scene projection;
2. **Lane B — 20 sources:** persistent flow/range plus root/V3 transition;
3. **Lane C — 25 sources:** source authority/transaction plus corrective
   evidence.

Each lane:

- reads every assigned frozen source completely;
- verifies exact orientation membership and frozen/current blob identity;
- inspects only its named executable evidence anchors;
- writes an ignored claim matrix;
- writes only its two disjoint candidate leaves and one disjoint focused test;
- does not modify Nodes, records, maps, summaries, generated output, or Core;
- does not commit shared integration state.

### One serialized integration lane

The coordinator alone owns:

- the family overview;
- cross-leaf dependency and terminology reconciliation;
- Document, Evidence, Node, repository-summary, and current-scope records;
- `DOCUMENT_MAP.md` and generated output;
- dependency-test updates proven stale by RED;
- commits, final verification, and review corrections.

This is the only phase that touches shared Project Control truth.

## Registration boundary

Register one `live-draft` Node under `core`, with exact seven Document IDs,
Evidence records derived only from the twelve orientation evidence checks,
repository references to Core and Project Control, and `truthState: unknown`.

Register exactly seven active Documents:

- one `current-state` overview;
- six bounded contract/evidence leaves.

Evidence records pin the current Core evidence head and one material anchor per
record. If one orientation check needs multiple anchors to establish one claim,
the Document carries the immutable set while the Evidence record identifies
the primary executable anchor. No fabricated Evidence is permitted.

Update shared Core Node/repository summaries, Project Control current-scope
prose, the canonical Core document map, and the generated projection once.
Preserve Core Route, Text Engine, and Template Builder truth verbatim except for
the minimum additive Live Draft wording and deterministic ordering.

Do not create Live Draft migration coverage, cleanup Evidence, deletion Work,
publication commits, or source deletion.

## Test and time policy

Every lane uses test-first missing-leaf contracts and mutation rows for its own
boundaries. Lane gates are focused only; no lane runs the Project Control full
suite or a broad Core suite.

Integration runs:

1. deterministic generation;
2. `check:data`;
3. the three lane suites plus family/dependency tests;
4. type-check;
5. build and E2E only after shared registration;
6. one final broad Project Control test attempt.

The final broad attempt has a fixed operational ceiling. If it produces no
verdict within that ceiling, record `NOT PASSED / DEFERRED`, preserve any named
timing evidence, terminate only validated processes from this worktree, and do
not treat the no-verdict result as a product failure. A named assertion failure,
schema failure, source mismatch, or focused-test failure remains blocking.

Core verification is read-only and limited to the exact evidence-anchor suites
selected by the three lanes. Core must remain clean at the pinned head.

## Review policy

After integration, run contract/provenance and factual/honesty reviews in
parallel. Completion requires zero Critical and zero Important findings from
both. Accepted findings receive the smallest focused RED/fix/re-review cycle.
Minor findings are recorded and deferred unless they make a current truth claim
ambiguous.

Reviews must verify:

- 64 declared / 64 unique / 64 assigned / zero missing / zero extra;
- exact seven-document and Node/Evidence reciprocity;
- all six conflicts and leaf ownership boundaries;
- immutable Core references and rejection of mutable refs;
- no former-source literals in canonical truth or test source;
- generated equality and preservation of earlier family blobs;
- Live Draft and parent Core remain `unknown`;
- zero coverage, cleanup, deletion, activation, or performance promotion.

## Failure handling

Stop only the affected lane when a source is missing, duplicated, drifting,
outside its subgroup, or contradicted by current executable evidence. Other
lanes may finish their read-only audit and disjoint drafts.

Do not register a partial family. If one leaf remains blocked, keep all
candidate leaves unregistered, record the blocker, and preserve shared truth.

## Completion contract

Wave 2 is complete when:

1. all 64 frozen sources have exactly one leaf destination;
2. six leaves and one overview are mutually consistent;
3. all orientation evidence checks have honest, immutable evidence binding;
4. registration and generated projection are deterministic;
5. Live Draft and parent Core remain `unknown`;
6. no migration coverage or cleanup authority exists;
7. Core remains unchanged and clean at the pinned evidence head;
8. focused, data, type, build, and E2E gates pass;
9. the broad Project Control test has either an actual PASS or an explicitly
   authorized `NOT PASSED / DEFERRED` no-verdict record;
10. both independent final reviews return zero Critical and zero Important.

The next family wave begins only after this exact documentation state is
recorded. Source cleanup remains deferred until all family waves and a separate
migration-readiness transaction are complete.
