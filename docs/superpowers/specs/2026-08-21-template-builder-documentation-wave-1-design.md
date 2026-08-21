# Template Builder Documentation Wave 1 Design

Status: Draft for user review

## Goal

Complete Template Builder documentation synthesis in one accelerated family
wave:

1. write one family overview first as the navigation and ownership frame;
2. consolidate 73 frozen Core documents into five bounded canonical leaves;
3. register the overview, leaves, evidence, and Template Builder Node once;
4. keep Template Builder and broader Core `unknown`;
5. leave migration coverage, reference repair, publication review, and source
   cleanup for a later, separately authorized transaction.

This wave changes documentation truth in Project Control only. It does not
change Core runtime behavior, make the sandbox a production editor, promote a
browser-local draft to canonical truth, or authorize deletion of any former
source document.

## Why this is one family wave

The five leaves share one architecture but own distinct responsibilities. A
single family wave avoids five repeated design and registration cycles while
preserving reviewable leaf boundaries. The overview is authored first from the
approved orientation, then finalized only after all five leaves pass their
source and executable-evidence checks.

The wave therefore produces six canonical documents, not one monolithic
Template Builder document and not 73 replacement documents.

## Immutable input set

The source set is governed by
`migrations/V0_1_0a_1/core/wave-a-orientation.json`:

- family: `template-builder`;
- frozen Core source commit:
  `76a2f2311a898e781f53773390d47b05812911e4`;
- current read-only Core evidence head:
  `c503a45c03e0ce3b7a6efba2b029ca842017faa0`;
- orientation inventory digest:
  `36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b`;
- exact source assignment: 73 declared, 73 unique, zero missing at either
  commit, and zero frozen-to-current blob drift.

Core remains read-only. Every strong current-state claim must resolve to
current code, package, fixture, or focused test evidence at the pinned Core
evidence head. Phase chronology and historical `PASS` wording are not current
authority by themselves.

## Canonical output set

### Family overview

Create:

`docs/versions/V0_1_0a_1/core/template-builder/OVERVIEW.md`

The first draft establishes only:

- the public-Core-package to browser-sandbox boundary;
- the five leaf ownership boundaries and dependency order;
- browser-local versus canonical truth separation;
- the explicit `unknown` family state;
- the no-coverage and no-cleanup boundary.

It must not assert detailed leaf facts before their source audits complete.
After all leaves pass, finalize the overview with compact links, evidence flow,
current verified state, limits, migration boundary, and immutable Project
Control leaf anchors.

### Five leaves

| Order | Qualified subgroup | Sources | Canonical leaf |
| --- | --- | ---: | --- |
| 1 | `template-builder/sandbox-runtime-and-store` | 15 | `template-builder/sandbox-runtime-and-store.md` |
| 2 | `template-builder/viewport-and-virtualized-rendering` | 19 | `template-builder/viewport-and-virtualized-rendering.md` |
| 3 | `template-builder/structural-runtime-and-navigation` | 9 | `template-builder/structural-runtime-and-navigation.md` |
| 4 | `template-builder/wysiwyg-draft-input-and-guards` | 15 | `template-builder/wysiwyg-draft-input-and-guards.md` |
| 5 | `template-builder/rich-inline-commit-and-session-lifecycle` | 15 | `template-builder/rich-inline-commit-and-session-lifecycle.md` |

All paths are rooted at
`docs/versions/V0_1_0a_1/core/`.

## Family architecture

The overview expresses the dependency direction without collapsing ownership:

```text
public vNext Core snapshot and accepted mutations
  → sandbox runtime/cache/store-backed render model
  ├─→ structural projection, packet application, commands, navigation
  ├─→ viewport prediction, scheduling, virtualized render windows
  └─→ browser-local WYSIWYG draft, selection, caret, IME guards
        → rich-inline capture, commit, replay, session preparation,
          and live/exact stale signaling
```

The store-backed model is a prerequisite for the other browser paths. WYSIWYG
draft state is a prerequisite for rich-inline execution. Cross-references do
not transfer authority between leaves.

## Leaf ownership contracts

### Sandbox Runtime, Mutation Packets, and Store-backed Render Model

Owns package extraction, snapshot normalization, accepted mutation/change
packets, browser cache/store application, plain-text actions/history,
store-backed render facts, and live-layout summaries.

It excludes structural packet semantics, viewport windowing, active WYSIWYG
input, rich-inline commits, durable persistence, and renderer output.

### Viewport, Scheduler, and Virtualized Rendering

Owns visible-range requests and resolution, measurement application, render
windows and shells, section spacers, virtual stacks, lazy-detail planning,
scheduler guards, scroll restoration, and viewport/node anchors.

The 72-section and 936-node evidence is bounded synthetic-shape evidence. It is
not wall-clock performance, DOM recycling, production rendering, or latency
proof.

### Structural Runtime, Commands, and Navigation

Owns structural projection, packet-v1 application, command policy/UI requests,
outline jumps, and diagnostics navigation.

Projection remains read-only. Packet v1 remains a sandbox-foundation transport,
not a durable or public API. A boot snapshot may remain stale after accepted
packet application, and diagnostics without `nodeId` fail closed.

### WYSIWYG Draft Input, Selection, and Browser Guards

Owns browser-local draft activation, caret and selection policy, text commands,
IME guards, pre-commit layout summaries, and planning-only toolbar, field, and
history affordances.

It does not own canonical rich-inline mutation, contenteditable segment/range
capture, durable history, renderer output, or production primary-input
replacement.

### Rich Inline Capture, Commit, Replay, and Session Lifecycle

Owns contenteditable-like segment/range capture, UTF-16 mapping, local style and
chip state, commit planning and accepted commit, undo/redo replay, JSON-safe
session-record preparation, and live/exact stale signaling.

It excludes renderer artifacts, storage-adapter writes, collaboration merge,
WASM measurement replacement, and any claim that the hardened
contenteditable surface is the active primary editor input.

## Conflict policy

The six orientation conflicts are load-bearing review items:

- future-work cards versus later bounded implementation do not establish
  production readiness;
- the active sandbox remains textarea-first unless current executable evidence
  proves otherwise;
- storage-ready session records do not perform storage-adapter writes;
- live/exact parity currently proves invalidation, not renderer/export parity;
- structural packet v1 is bounded, non-durable, and non-public;
- viewport shape assertions are not performance evidence.

If current code and a historical source disagree, current executable evidence
controls the wording and the historical intention is retained only in a clearly
labelled historical section. Unresolved contradictions remain explicit
`unknown` or excluded claims; they are never silently averaged.

## Accelerated execution model

### Parallel source-audit lanes

Use three independent read-only lanes:

1. sandbox runtime/store plus structural runtime/navigation;
2. viewport/virtualized rendering;
3. WYSIWYG draft/guards plus rich-inline lifecycle.

Each lane reads every assigned frozen source completely, verifies frozen and
current blobs, inspects the orientation evidence anchors, and writes a
structured ignored claim matrix. Lanes do not edit shared canonical maps,
Nodes, records, generated output, or Core.

### Serialized canonical integration

One integration lane owns:

- the overview and all canonical leaf files;
- Project Control tests;
- Document, Evidence, Node, repository-summary, and current-scope records;
- `DOCUMENT_MAP.md`;
- deterministic generation;
- commits and final verification.

This preserves speed without concurrent edits to shared truth.

## Project Control registration

Create one `template-builder` Node under `core` with order `30`, exact six
Document IDs, exact evidence IDs, repository references to Core and Project
Control, and `truthState: unknown`.

Register exactly six active Documents:

- `doc-template-builder-overview` with role `current-state`;
- one role `contract` Document for each of the five leaves.

Register one Evidence record per approved orientation evidence check: twelve
Evidence records total, grouped 3 / 2 / 2 / 2 / 3 across the five leaves. Each
record pins the current Core evidence head, one material executable anchor, a
bounded verification summary, and
`2026-08-21T00:00:00.000Z`.

Update:

- `data/nodes/core.json` without promoting broader Core;
- `data/repositories/core.json` with bounded documentation status only;
- `docs/domains/project-control.md` so Template Builder is no longer described
  as unregistered;
- `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md` with the overview and five
  leaves;
- `generated/project-index.json` only through the generator.

Do not create Template Builder migration coverage, cleanup Evidence, a cleanup
commit, or active deletion Work.

## Test design

Add one family-focused Project Control test file that proves:

- 73/73 exact unique source assignment and frozen/current blob stability;
- exact overview plus five-leaf paths and required headings;
- exact dependency and cross-reference ownership;
- all six conflict boundaries remain bounded;
- immutable Core anchors and rejection of mutable refs;
- former source paths do not leak into canonical leaves, their test source,
  records, map, or Node;
- exact six Document and twelve Evidence registrations with reciprocal Node
  membership;
- Template Builder and Core remain `unknown`;
- no Template Builder coverage, cleanup authority, or deletion Work exists;
- generated records equal canonical sources byte-for-byte;
- prior Core Route and Text Engine canonical blobs remain unchanged.

Core evidence gates include the sandbox boundary suite plus the focused
structural, viewport, WYSIWYG, rich-inline commit/replay/session, and
live/exact tests named by the evidence anchors. Core is checked read-only and
must remain clean at the pinned evidence head.

Project Control final gates are deterministic generation, `check:data`, the
family-focused and dependency regression suites, type-check, the full unit,
build, and E2E gate, diff checks, and exact clean scope.

## Failure handling

Stop the affected lane when:

- a source is missing, duplicated, assigned outside its subgroup, or has blob
  drift;
- executable evidence contradicts an intended current claim;
- a leaf needs authority owned by another family;
- Project Control registration would require fabricated Evidence;
- any test fails outside a documented load-only timing retry policy;
- Core or a protected prior Project Control object changes.

Other independent source-audit lanes may continue. The integration lane does
not register a partial family. If one leaf remains blocked, Wave 1 remains
unregistered and the overview remains a candidate draft.

## Completion contract

Wave 1 is complete only when:

1. all 73 sources have one and only one leaf destination;
2. the five leaves and family overview are canonical and mutually consistent;
3. all twelve evidence checks are represented by verified Evidence records;
4. registration and generated projection are deterministic;
5. Template Builder and Core remain `unknown`;
6. no migration coverage or cleanup authority exists;
7. Core is unchanged and clean at the pinned evidence head;
8. focused and full Project Control gates pass;
9. independent contract/provenance and factual/honesty reviews return zero
   Critical and zero Important findings.

The next handoff after this wave is Live Draft documentation synthesis. Source
cleanup remains deferred until all documentation waves and a separate
migration-readiness transaction are complete.
