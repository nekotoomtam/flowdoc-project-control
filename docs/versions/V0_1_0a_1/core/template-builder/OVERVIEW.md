# Template Builder Overview

## Authority and Status

This documentation family is governed by the immutable 73-source Template
Builder assignment in
`migrations/V0_1_0a_1/core/wave-a-orientation.json`. Its frozen Core source
commit is `76a2f2311a898e781f53773390d47b05812911e4`, and current executable evidence
is pinned to read-only Core commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. Template Builder and parent Core remain `unknown`; this overview does not promote either scope.

Template Builder documentation synthesis is complete across five bounded leaves and one family overview; family truth remains unknown pending migration coverage, reference repair, publication review, and separately authorized cleanup, while production editor integration, durable persistence, collaboration, renderer output, and performance readiness remain unknown.

## Family Architecture

```text
public vNext Core snapshot and accepted mutations
  → sandbox runtime/cache/store-backed render model
  ├─→ structural projection, packet application, commands, navigation
  ├─→ viewport prediction, scheduling, virtualized render windows
  └─→ browser-local WYSIWYG draft, selection, caret, IME guards
        → rich-inline capture, commit, replay, session preparation,
          and live/exact stale signaling
```

The store-backed model precedes the browser paths. Browser-local drafts, DOM
state, caches, and layout summaries are not canonical truth; accepted vNext
Core mutations remain the canonical path. Cross-references express dependency
direction and do not transfer authority between leaves.

## Canonical Documents

- [Sandbox Runtime, Mutation Packets, and Store-backed Render Model](sandbox-runtime-and-store.md)
- [Viewport, Scheduler, and Virtualized Rendering](viewport-and-virtualized-rendering.md)
- [Structural Runtime, Commands, and Navigation](structural-runtime-and-navigation.md)
- [WYSIWYG Draft Input, Selection, and Browser Guards](wysiwyg-draft-input-and-guards.md)
- [Rich Inline Capture, Commit, Replay, and Session Lifecycle](rich-inline-commit-and-session-lifecycle.md)

These five links are the ownership boundary. Each leaf carries its detailed
contract, state and failure model, verified facts, limits, and executable Core
anchors; this overview does not repeat those leaf tables.

## Ownership Map

The sandbox leaf owns public-package extraction, snapshot normalization,
accepted mutation packets, cache/store application, bounded plain-text history,
store-backed render facts, and live-layout summaries. Structural owns read-only
projection, packet-v1 constraints, bounded commands, outline jumps, and
fail-closed diagnostics navigation. Viewport owns request/prediction/measurement
separation, guarded scheduling, windows, shells, spacers, virtual stacks, lazy
detail, and anchors. WYSIWYG owns the textarea-first browser-local draft,
selection/caret, text commands, IME guards, and planning-only affordances. Rich
inline owns local segment/range hardening, accepted-plan commit, in-memory
replay, session preparation, and stale invalidation.

## Evidence Flow

The current evidence direction is: public package boundary → accepted mutation packets → browser-local cache/store facts → structural and viewport consumers → guarded local draft → accepted rich-inline commit/replay → session preparation and live/exact stale invalidation.

Twelve registered Evidence records preserve one material Core anchor per
reviewed check. They establish bounded package, runtime, shape, guard,
navigation, commit/replay, and preparation facts only; they do not combine into
product readiness, renderer authority, persistence, collaboration, or
performance proof.

## Current Verified State

At the pinned Core commit, reviewed source closure is 73 assigned / 73 unique /
0 missing / 0 extra / 0 drift. Focused executable evidence supports the public
package boundary, bounded packet/cache/store behavior, read-only structural
projection and fail-closed navigation, browser-local viewport composition,
textarea-first draft guards, accepted-plan rich commit/replay, JSON-safe session
preparation, and live/exact stale invalidation. Historical phase chronology and
historical `PASS` wording are not current authority by themselves.

## Known Limits and Unknowns

The sandbox is not a production editor, browser-local state is not canonical
package truth, and packet v1 is neither durable nor public. The 72-section /
936-node fixture is bounded synthetic shape evidence, not wall-clock
performance, DOM recycling, real-document scaling, or production rendering.
The active input remains textarea-first; the hardened contenteditable surface
is hidden/fallback evidence. Session records do not perform storage-adapter
writes, and live/exact stale signaling does not prove renderer or export parity.
Production editor integration, durable persistence, collaboration, renderer
output, and performance readiness remain unknown.

## Migration and Cleanup Boundary

No Template Builder migration coverage, reference repair, publication review,
cleanup Evidence, deletion Work, cleanup commit, or family promotion is created
by this synthesis. No source cleanup is authorized. Former source deletion
requires a later, separately reviewed transaction.

## Evidence Anchors

The five reviewed canonical leaves are immutably anchored in Project Control:

- `flowdoc-project-control@5c3bd8cb9765310f6950300ee17ed3a8c76bf7a0:docs/versions/V0_1_0a_1/core/template-builder/sandbox-runtime-and-store.md (Git blob 89b6f20aed93ef2b2a18a516b44b3c243a96787b)`
- `flowdoc-project-control@5c3bd8cb9765310f6950300ee17ed3a8c76bf7a0:docs/versions/V0_1_0a_1/core/template-builder/viewport-and-virtualized-rendering.md (Git blob 42987ef843d4e466e7295546f56b903b2bc4e1df)`
- `flowdoc-project-control@5c3bd8cb9765310f6950300ee17ed3a8c76bf7a0:docs/versions/V0_1_0a_1/core/template-builder/structural-runtime-and-navigation.md (Git blob d3c34b7d14e6f1dfd7783f449d66f1dc103a6480)`
- `flowdoc-project-control@5c3bd8cb9765310f6950300ee17ed3a8c76bf7a0:docs/versions/V0_1_0a_1/core/template-builder/wysiwyg-draft-input-and-guards.md (Git blob a8288ba8b20d41140ab225f5b237991dc064e4bb)`
- `flowdoc-project-control@5c3bd8cb9765310f6950300ee17ed3a8c76bf7a0:docs/versions/V0_1_0a_1/core/template-builder/rich-inline-commit-and-session-lifecycle.md (Git blob 13d41032f395c5ec6eb2007f4999d35ef2cc07ce)`

All strong current claims in those leaves remain pinned to immutable Core
commit `c503a45c03e0ce3b7a6efba2b029ca842017faa0`. Unresolved or excluded claims
remain explicit `unknown`; registration does not inflate their authority.
