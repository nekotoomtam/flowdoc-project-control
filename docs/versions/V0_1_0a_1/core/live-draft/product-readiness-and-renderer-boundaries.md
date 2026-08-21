# Product Readiness and Renderer Boundaries

## Authority and Scope

This leaf owns the bounded product-readiness handoff and the renderer-consumption boundary for Live Draft. Current executable facts are pinned to flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0; Core remains the authority for layout facts. This leaf does not activate a product surface or transfer Core implementation authority.

## Responsibility Boundary

The owning Core route produces accepted pagination, line breaks, bounds, and source provenance. Core alone owns that route; neither the Editor nor the Backend acquires it through this handoff. A renderer may consume the accepted projection, rasterize glyphs in its own domain, and reject invalid input; it may not replace the producer’s layout authority.

## Cross-repository Ownership

The cross-repository handoff is a boundary, not an activation decision. Core owns the bounded layout and display-list contracts; a consuming application remains responsible for its own integration and renderer choice. Browser Worker adoption, Editor activation, Backend lifecycle integration, durable storage, and broad product availability are unknown or out of scope.

## Renderer Consumption Without Measurement or Relayout

The display-list projection consumes complete accepted text-flow pagination. Its contract records `rendererMayMeasureText: false`, `rendererMayRelayout: false`, and `lineBreaksAndBounds: "core-measured"`; incomplete pagination, invalid geometry, and requested production binding are blocked. The display list supplies line commands, page/body bounds, and optional source segments for a renderer to consume without remeasurement or fragment relayout. See flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textFlowDisplayListV1.ts and flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textFlowDisplayListV1.test.ts.

## Selected Parity and Activation Limits

Selected XR-4/XR-5 projection rows support the bounded display-list and source-segment handoff only. They do not establish Canvas/PDF glyph-pixel parity, artifact-byte parity, production renderer binding, or cross-runtime product readiness. Public exports expose bounded Core contracts but do not themselves activate a consumer integration; see flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/index.ts.

## Current Verified State

At the pinned Core head, the renderer-facing display-list implementation is exported and its focused tests verify deterministic projection, producer-measured line bounds, no renderer measurement, no renderer relayout, source-segment preservation, and fail-closed handling for incomplete or inconsistent input. This is current bounded Core evidence, not a claim that a consuming product is active.

## State and Failure Model

The projection is ready only for complete accepted pagination with valid page/body geometry, valid style data, and (when supplied) complete ordered source runs. It is blocked for incomplete pagination, drift outside the body, invalid source ranges, invalid style data, or a production-binding request. Consumers must preserve that failure result rather than silently measure or reflow a replacement fragment.

## Known Limits and Unknowns

Product readiness remains unknown outside the named Core boundary. No browser Worker activation is claimed. No Editor or Backend layout-route ownership is claimed. No Canvas/PDF pixel comparison, production binding, broad activation, persistence, performance, or end-to-end consumer lifecycle is established here.

## Historical Design Notes

Dated Phase 3/4 handoff and composition material remains historical design and scoped verification context. Its PASS labels do not prove current product readiness. Where historical wording is broader than the current executable projection contract, the pinned implementation and focused test boundary controls the wording in this leaf.

## Canonical Cross-references

- [Geometry and Scene Projection](geometry-and-scene-projection.md) owns geometry producers, source segments, forced breaks, and projection detail.
- `live-draft/root-and-v3-transition-contracts` owns retained-root and V3 transition policy, which this leaf does not restate.

## Evidence Anchors

- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textFlowDisplayListV1.ts
- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textFlowDisplayListV1.test.ts
- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/index.ts
