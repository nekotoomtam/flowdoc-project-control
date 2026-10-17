# Rich Inline Capture, Commit, Replay, and Session Lifecycle

## Authority and Scope

This canonical leaf consolidates the 15 sources assigned by the reviewed
Template Builder orientation subgroup: **15 assigned / 15 unique / 0 missing /
0 extra / 0 drift**. The frozen source commit is
`76a2f2311a898e781f53773390d47b05812911e4`; every assigned blob is identical
at the read-only current evidence commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. It owns the bounded rich-inline
lifecycle after the browser-local draft guard. Template Builder remains
`unknown`.

## Responsibility Boundary

This leaf owns contenteditable-like segment and range facts, local rich state,
commit planning and accepted application, in-memory rich replay, JSON-safe
rich-inline replay-patch validation and history-ready facts, and live/exact
stale signaling. It excludes package-snapshot or persisted-session-record
creation, renderer artifacts, storage-adapter writes, replay execution from
storage, collaboration merge, production contenteditable input replacement,
and renderer- or DOM-caret authority. The prerequisite draft and IME policy
belongs to [WYSIWYG Draft Input, Selection, and Browser Guards](wysiwyg-draft-input-and-guards.md).

## Segment Capture and UTF-16 Range Mapping

Browser-owned segment capture normalizes plain-text, styled-run, and atomic-chip
facts without package mutation. Local mapping converts supported endpoints to
FlowDoc UTF-16 code-unit offsets and rejects mismatched text, unsupported styled
or atomic cases, overlap, and drift. This mapping is local planner evidence,
not a DOM `Range` binding, a renderer measurement, or a DOM/renderer caret
contract. It neither changes package truth nor executes a rich commit.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftContenteditableSegmentCapture.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftContenteditableRangeMapping.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Contenteditable Hardening Boundary

Hardening validates local root, target, text, selection, nested-endpoint, and
composition facts for the contenteditable-style surface. It is bounded hidden
or fallback evidence: current active authoring remains textarea-first, and the
hardened surface is not the active primary input. Hardening does not itself run
a core transaction, record history, request layout, write storage, or make a
production editor claim. Composition-active state remains guarded before range
or rich-commit work.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftContenteditableSurfaceHardening.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/app.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/wysiwygPrimaryInputDecisionGate.test.ts`

## Browser-local Rich State

Normalized local rich state deterministically combines plain text, styled runs,
and atomic field-chip facts while rejecting ambiguous overlaps and revision
drift. Local style and field facts are preserved as planner input, not treated
as canonical authored children, durable history, collaborative state, live
layout, or renderer output. Local patch and field insertion execution remains
bounded until the planner admits a fresh replacement plan.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftRichInlineState.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftRichInlinePatchExecution.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftFieldChipInsertExecution.js`

## Commit Planning and Accepted Application

The planner maps guarded local state to validated vNext inline-child facts and
blocks stale revision, document drift, overlaps, unsupported marks, and missing
keys before mutation. Rich mutation requires an accepted fresh plan: the bridge
accepts only the normalized replacement plan when its base and document revision
match the in-memory sandbox revision. Stale plans are rejected, including before
the bridge request where applicable. An accepted plan uses the vNext-native
helper to replace validated `text` and `field-ref` children, preserve field and
style facts, create bounded history-ready facts, and mark output stale. This is
an in-memory sandbox package behavior, not a canonical package, durable
persistence, collaboration transaction, renderer result, or export result.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftRichInlineCommitPlan.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/mutationBridge.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/richInlineCommit.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/richInlineCommit.test.ts`

## In-memory Undo and Redo Replay

Sandbox undo and redo replay full before/after inline children through the same
vNext-native rich-inline helper. This bounded in-memory path preserves field and
style facts and repeats stale invalidation after accepted replay. It does not
restore a session, write or read a durable history store, provide granular CRDT
behavior, merge collaboration changes, or establish renderer/export parity.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/mutationBridge.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/richInlineCommit.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/richInlineCommit.test.ts`

## JSON-safe Replay-patch Validation and History-ready Facts

The helper creates JSON-safe rich-inline replay-patch validations and
history-ready facts. It reports history-ready and rich-history counts,
before/after child snapshots and inline counts, field keys, validation status,
and issues. Its contract explicitly records `storageRecord: false`,
`storageWrites: false`, and `replayExecution: false`; it creates no package
snapshot or persisted session record and performs no route dispatch, backend
call, conflict resolution, selection restore, collaboration merge, or renderer
work.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/richInlineSessionPersistence.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/richInlineSessionPersistence.test.ts`

## Live/Exact Stale Invalidation Only

Accepted rich commit, undo, and redo mark shared live-layout and exact-generation
signals stale. This is stale invalidation only; it does not render a live
result, generate an exact artifact, prove renderer or export parity, produce
PDF/DOCX output, or establish renderer-backed measurement. It also performs no
storage write. The sandbox and viewport leaves own their separate bounded
summaries and render-window contracts.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/richInlineCommit.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/mutationBridge.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/richInlineLiveExactParityAudit.test.ts`

## State and Failure Model

Segment capture, mapping, hardening, local style/chip state, and planning remain
browser-local until an accepted fresh plan enters the bridge. IME blocks rich
commit and range commands. Unsupported ranges, text mismatch, missing keys,
overlaps, planner drift, and revision drift fail closed; stale plans are
rejected without applying an in-memory replacement. Accepted commit and replay
preserve bounded field/style child facts and mark stale signals, while
replay-patch validations remain JSON-safe facts only.

## Current Verified State

At the pinned Core evidence commit, focused rich-inline commit and live/exact
tests cover the accepted-plan gate, stale rejection, vNext helper behavior,
field-key and history-ready facts, replay behavior, JSON-safe record
validation, and invalidation-only signals. The sandbox boundary suite covers
the browser-local capture, guard, state, and planning inputs. This is bounded
implementation evidence, not production readiness.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/richInlineCommit.test.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/richInlineLiveExactParityAudit.test.ts`

## Known Limits and Unknowns

This leaf does not establish production contenteditable input, canonical package
truth for browser-local state, durable persistence, storage replay execution,
collaboration behavior, renderer output, exact artifacts, export parity, or a
renderer/DOM caret contract. Live and exact signals do not establish rendering.
The replay-validation helper creates no package snapshot, persisted session
record, or storage record, performs no storage write, and does not execute
replay. UTF-16 mapping stays local to supported segment facts.

## Historical Design Notes

Historical re-entry, rebaseline, and close-audit phases capture sequence and
future work, but their chronology and `PASS` labels are not authority for
current production claims. Current code and focused tests establish only the
bounded implementation stated here; planned work remains planning, not
production readiness.

## Canonical Cross-references

- [WYSIWYG Draft Input, Selection, and Browser Guards](wysiwyg-draft-input-and-guards.md)
- [Sandbox Runtime, Mutation Packets, and Store-backed Render Model](sandbox-runtime-and-store.md)
- [Viewport, Scheduler, and Virtualized Rendering](viewport-and-virtualized-rendering.md)
- [Structural Runtime, Commands, and Navigation](structural-runtime-and-navigation.md)

## Evidence Anchors

All strong current claims are pinned to immutable Core commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. The reviewed orientation retains
the exact frozen assignment and provenance; this leaf deliberately does not
repeat former source paths.
