# Geometry and Scene Projection

## Authority and Scope

This leaf owns the bounded geometry producers and scene/display-list projection described by the Live Draft geometry subgroup. Current assertions are limited to flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0 evidence. It does not own retained incremental-root transitions, source-commit authority, Canvas layout authority, production binding, or cross-runtime pixel parity.

## Responsibility Boundary

Geometry is producer-owned: accepted layout supplies layout-unit values, line boxes, source points, fragments, and pagination. Projection consumes those facts and makes them renderable without measuring or relayout. A renderer owns glyph rasterization only; it does not become a geometry producer.

## Layout Units and Spatial Wrapping

The bounded geometry contract uses finite point-valued dimensions for page/body boxes and line geometry. Spatial wrapping is a producer-stage layout concern: its focused evidence preserves bounded exclusion regions and placement decisions while keeping the renderer downstream of accepted geometry. See flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockPersistentFlowContractV1.ts and flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/liveDraftMr1SpatialWrapping3a.test.ts.

## Authored-box and Inline-image Geometry

Authored-box and inline-image records are distinct producer facts with bounded geometry validation. Their focused Phase 4 evidence verifies the accepted record shape and failure boundaries; it does not prove a production renderer binding, browser integration, or Canvas/PDF pixels. See flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/liveDraftMr1AuthoredBoxGeometry4a.test.ts and flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/liveDraftMr1InlineImageGeometry4b.test.ts.

## Source Segments, Forced Breaks, and Display-list Projection

Source segments preserve ordered, gap-free rendered ranges, inline identity, source offsets, rendered text, and resolved-field metadata when present. Forced breaks remain producer facts expressed in accepted flow/line output rather than instructions for a renderer to recompute. The display-list projector turns complete paginated fragments into deterministic text-line paint commands, retaining source start/end points and segment slices; it consumes those accepted facts with no measurement or relayout. See flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textFlowDisplayListV1.ts and flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textFlowDisplayListV1.test.ts.

## Producer-owned Geometry Facts

The producer’s complete pagination determines page count, line order, line break offsets, bounds, and fragment identity. Projection rejects incomplete pagination, geometry outside the page body, invalid source coverage, and baseline/line-box conflicts. These checks preserve the producer boundary; geometry evidence does not prove production binding or authorize a consumer to repair layout facts.

## Current Verified State

At the pinned head, the focused evidence covers spatial wrapping, authored-box geometry, inline-image geometry, and deterministic text-flow display-list projection. The exported API surface makes those bounded Core contracts available. This evidence supports a geometry-to-scene handoff only within the stated contracts.

## State and Failure Model

Geometry and projection must fail closed when producer input is incomplete or violates its finite, positive, ordered, contained, or baseline constraints. A blocked result has no ready command list. The correct consumer response is to surface or preserve the blocked state, not to infer missing line breaks, measure text, or relayout fragments.

## Known Limits and Unknowns

The evidence excludes Canvas/PDF glyph-pixel parity, artifact bytes, production binding, browser Worker activation, product activation, retained-root policy, and general cross-runtime readiness. Phase 3/4 focused PASS material is bounded test evidence, not a universal readiness conclusion.

## Historical Design Notes

The frozen geometry plans and design notes record the intended Phase 3/4 sequence: unit policy and wrapping, then authored-box and inline-image records, then projection detail. They remain historical rationale. Current wording is controlled by the pinned contracts and focused tests, with unresolved wider integration questions left unknown.

## Canonical Cross-references

- [Product Readiness and Renderer Boundaries](product-readiness-and-renderer-boundaries.md) owns cross-repository responsibility and the renderer no-relayout boundary.
- `live-draft/persistent-flow-and-range-foundations` owns persistent-flow and range foundations that supply, but do not expand, these geometry facts.
- `live-draft/root-and-v3-transition-contracts` owns retained-root and transition policy.

## Evidence Anchors

- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockPersistentFlowContractV1.ts
- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/liveDraftMr1SpatialWrapping3a.test.ts
- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/liveDraftMr1AuthoredBoxGeometry4a.test.ts
- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/liveDraftMr1InlineImageGeometry4b.test.ts
- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textFlowDisplayListV1.ts
- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textFlowDisplayListV1.test.ts
- flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/index.ts
