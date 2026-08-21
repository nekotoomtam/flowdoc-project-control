# Template Builder Overview

## Authority and Status

This candidate documentation family is governed by the immutable 73-source
Template Builder assignment in
`migrations/V0_1_0a_1/core/wave-a-orientation.json`. Its frozen Core source
commit is `76a2f2311a898e781f53773390d47b05812911e4`. Template Builder and parent Core remain `unknown`; this overview does not promote either scope.

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
Core mutations remain the canonical path.

## Canonical Documents

The family is bounded to these five ownership leaves. Their detailed claims
remain limited to orientation responsibility and boundary until their source
audits complete.

- [Sandbox Runtime, Mutation Packets, and Store-backed Render Model](sandbox-runtime-and-store.md)
- [Viewport, Scheduler, and Virtualized Rendering](viewport-and-virtualized-rendering.md)
- [Structural Runtime, Commands, and Navigation](structural-runtime-and-navigation.md)
- [WYSIWYG Draft Input, Selection, and Browser Guards](wysiwyg-draft-input-and-guards.md)
- [Rich Inline Capture, Commit, Replay, and Session Lifecycle](rich-inline-commit-and-session-lifecycle.md)

## Ownership Map

The sandbox leaf owns public-package extraction, snapshot normalization, and
cache/store-backed render facts. Structural owns read-only projection,
packet-v1 constraints, commands, and navigation. Viewport owns visible ranges,
scheduling, virtual windows, and anchors. WYSIWYG owns browser-local draft
input and guards. Rich inline owns capture, commit/replay, session preparation,
and stale signaling. Cross-references do not transfer authority between leaves.

## Current Verified State

Current executable evidence is pinned to read-only Core commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. It supports only the focused,
bounded evidence reviewed for this family; historical phase chronology and
historical `PASS` wording are not current authority by themselves.

## Known Limits and Unknowns

Template Builder remains `unknown`. The sandbox is not a production editor,
browser-local drafts are not canonical truth, and packet v1 is not a durable or
public API. Viewport shape assertions are not wall-clock performance, DOM
recycling, production-rendering, or latency proof. Rich-inline session records
do not perform storage-adapter writes, and live/exact signaling does not prove
renderer or export parity.

## Migration and Cleanup Boundary

No migration coverage, reference repair, publication review, source cleanup,
or deletion authority is included in this candidate frame. No source cleanup is
authorized by this documentation wave.

## Evidence Anchors

The frozen source set and current executable evidence are both anchored by the
orientation record above. Strong current-state claims must resolve to current
Core code, packages, fixtures, or focused tests at the pinned evidence commit;
unresolved contradictions remain explicit `unknown` or excluded claims.
