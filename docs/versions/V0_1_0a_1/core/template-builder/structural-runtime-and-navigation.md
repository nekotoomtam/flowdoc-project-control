# Structural Runtime, Commands, and Navigation

## Authority and Scope

This canonical leaf consolidates the nine sources assigned by the reviewed
Template Builder orientation subgroup. It covers the read-only structural
projection, local packet-v1 foundation transport, accepted structural bridge
and store application, bounded command policy, outline jumps, and diagnostics
navigation. Template Builder remains `unknown`.

## Responsibility Boundary

This leaf owns structural-tree semantics and their browser-local navigation
constraints. It does not own generic runtime-cache rules, viewport windowing,
draft input, rich-inline lifecycle, storage, persistence, collaboration, or
production editor integration. Generic cache/store facts remain in
[Sandbox Runtime, Mutation Packets, and Store-backed Render Model](sandbox-runtime-and-store.md).

## Structural Projection

`createStructuralProjection(...)` derives a tree-shaped working view from a
document and relationship-graph facts. Its structures are read-only and the
focused test verifies materializing the projection does not mutate the
canonical document.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/structure/projection.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/structuralProjection.test.ts`

## Packet v1

`createStructuralChangePacket(...)` represents accepted Core structural
operation results; `validateStructuralChangePacket(...)` checks source,
version, stage, revisions, operation metadata, and invalidation facts. Packet
v1 is non-public, non-durable local foundation transport; it is not a storage,
history, replay, or collaboration protocol.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/structure/packet.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/structuralPacket.test.ts`

## Command Policy

The DOM-free policy module evaluates availability, targets, request routes, and
post-result selection for bounded insert-text-block, delete, and reorder
actions. It blocks commands for missing selection, active drafts, busy bridge
state, or unavailable node capability; it does not establish a backend API.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/structuralCommandPolicy.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Outline Jumps

An outline jump accepts only a matching node identifier and node fact, then
creates a browser-local node-aware visible-range request. A missing node is
blocked, and no structural edit is implied by navigation.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/structuralOutlineNavigation.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Diagnostics Navigation

Diagnostics navigation accepts a jump only when the item has a node identifier
that exists in the current runtime index. Document-level items and missing or
unknown node identifiers fail closed; no nearest-node fallback is used.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/structuralDiagnosticsNavigation.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/structuralOutlineNavigation.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## State and Failure Model

The sandbox bridge returns packet-only results from accepted Core structural
operations. Runtime-store application validates packet identity and rejects
malformed, stale, or non-applied packets before rebuilding derived indexes. An
accepted application does not mutate the boot snapshot, which may be stale
after the packet is applied.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/src/mutationBridge.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/runtimeStoreStructuralPacket.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/runtimeCache.js`

## Current Verified State

At the pinned Core commit, the focused structural suites cover projection and
packet construction/validation, while the sandbox boundary suite contains the
structural bridge, store-application, command, outline, and fail-closed
diagnostics checks. This bounded evidence does not promote Template Builder.
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/structuralProjection.test.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/structuralPacket.test.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Known Limits and Unknowns

Structural foundation transport does not establish a public contract, durable
operation history, storage writes, collaboration, rendering, or product-ready
editor behavior. Viewport restoration is owned by
[Viewport, Scheduler, and Virtualized Rendering](viewport-and-virtualized-rendering.md),
while draft interaction is owned by
[WYSIWYG Draft Input, Selection, and Browser Guards](wysiwyg-draft-input-and-guards.md).

## Historical Design Notes

The source assignment includes historical audit and UI ownership material. The
current policy owner is the DOM-free module cited above; phase chronology and
historical `PASS` wording are not current authority. The nine assigned sources
are closed into this leaf only through the reviewed orientation and immutable
executable evidence.

## Canonical Cross-references

- [Sandbox Runtime, Mutation Packets, and Store-backed Render Model](sandbox-runtime-and-store.md)
- [Viewport, Scheduler, and Virtualized Rendering](viewport-and-virtualized-rendering.md)
- [WYSIWYG Draft Input, Selection, and Browser Guards](wysiwyg-draft-input-and-guards.md)
- [Rich Inline Capture, Commit, Replay, and Session Lifecycle](rich-inline-commit-and-session-lifecycle.md)

## Evidence Anchors

All strong current claims above are anchored to immutable Core commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. The authoritative source
assignment and frozen commit are retained in
`migrations/V0_1_0a_1/core/wave-a-orientation.json`; this leaf does not
reproduce historical source paths.
