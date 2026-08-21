# Sandbox Runtime, Mutation Packets, and Store-backed Render Model

## Authority and Scope

This canonical leaf consolidates the 15 sources assigned by the reviewed
Template Builder orientation subgroup. It documents only the browser sandbox
boundary, normalization, accepted plain-text packet handling, derived runtime
facts, bounded in-memory history, and live-layout invalidation summaries.
Template Builder remains `unknown`.

## Responsibility Boundary

The sandbox consumes public-Core snapshots and accepted mutation responses, then
derives browser-local cache, lookup, and render-model facts. It does not own
structural packet semantics, viewport policy, draft input, rich-inline commit,
storage, renderer output, persistence, or collaboration. Structural packet
semantics belong to
[Structural Runtime, Commands, and Navigation](structural-runtime-and-navigation.md).

## Current Package Boundary

The extractable sandbox package declares `@flowdoc/vnext-core` as its dependency;
the snapshot boundary identifies that import as the public entrypoint. This is a
package-consumer boundary, not an editor-product readiness claim.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/package.json`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/coreBoundary.ts`

## Runtime Normalization

The snapshot adapter produces tree-shaped boot and diagnostic metadata, while
the browser runtime store derives lookup indexes and the editor view keeps
visible-range concerns distinct from those indexes. The boot snapshot is not
refreshed automatically after packet application and may therefore be stale.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/coreBoundary.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/runtimeStore.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/editorView.js`

## Mutation Packets

Plain-text bridge actions enter public-Core transactions and return bounded
packet responses with revision, changed-node, diagnostic, and issue facts; they
do not return a replacement document tree. Packet handling is local sandbox
transport only. Explicit insert and replace actions are not per-keystroke
caret input.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/mutationBridge.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/runtimeCache.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Cache and Store Application

The browser-safe cache validates packets, updates runtime metadata, and
coordinates rebuilds. Accepted text packets update copied runtime-store text
facts; the store-backed render model reads active tree/canvas facts from that
derived store. These browser-local structures are not document truth and do not
establish a renderer.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/runtimeCache.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/runtimeStore.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/renderModel.js`

## Plain-text Actions and History

Accepted plain-text transactions expose a bounded in-memory authoring-history
summary. Undo and redo replay sandbox-held plain-text patches through normal
Core transactions and packet responses; no cross-session history behavior is
established here.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/mutationBridge.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/coreBoundary.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Live-layout Summaries

Accepted mutations can carry bounded affected-scope and freshness summaries.
They report invalidation and exact-generation staleness only; they neither run
exact layout nor produce renderer output.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/coreBoundary.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## State and Failure Model

Invalid or rejected packets do not advance the accepted runtime state. The
runtime cache rejects malformed packet identity and revision conditions; a
packet-applied store may diverge from the immutable boot snapshot by design.
Selection and shell interaction state stay browser-local.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/runtimeCache.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Current Verified State

At the pinned Core commit, the focused boundary suite covers public-package
consumption, packet-only plain-text responses, cache/store application,
browser-only selection, bounded history, and live-layout summaries. This is
focused foundation evidence, not broad product evidence.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Known Limits and Unknowns

The sandbox is not a production editor. This leaf does not establish
document storage, durable history, rendering or export parity, exact layout,
or collaboration. Viewport behavior is bounded separately in
[Viewport, Scheduler, and Virtualized Rendering](viewport-and-virtualized-rendering.md),
and browser draft behavior is bounded separately in
[WYSIWYG Draft Input, Selection, and Browser Guards](wysiwyg-draft-input-and-guards.md).

## Historical Design Notes

The source assignment preserves historical boundary decisions, but historical
phase labels and `PASS` wording are not current authority. The 15 assigned
sources are closed into this leaf only through the reviewed orientation and the
pinned executable anchors above.

## Canonical Cross-references

- [Structural Runtime, Commands, and Navigation](structural-runtime-and-navigation.md)
- [Viewport, Scheduler, and Virtualized Rendering](viewport-and-virtualized-rendering.md)
- [WYSIWYG Draft Input, Selection, and Browser Guards](wysiwyg-draft-input-and-guards.md)
- [Rich Inline Capture, Commit, Replay, and Session Lifecycle](rich-inline-commit-and-session-lifecycle.md)

## Evidence Anchors

All strong current claims above are anchored to immutable Core commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. The authoritative source
assignment and frozen commit are retained in
`migrations/V0_1_0a_1/core/wave-a-orientation.json`; this leaf does not
reproduce historical source paths.
