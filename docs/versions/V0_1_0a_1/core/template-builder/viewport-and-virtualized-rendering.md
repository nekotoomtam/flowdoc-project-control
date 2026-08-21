# Viewport, Scheduler, and Virtualized Rendering

## Authority and Scope

This canonical leaf consolidates the 19 sources assigned by the reviewed Template Builder orientation subgroup. It documents the bounded path from a store-backed render model through visible-range intent, browser-local measurement, guarded range application, scheduler facts, render windows, section shells, spacers, virtual stacks, lazy-detail plans, and viewport/node anchors. Template Builder remains `unknown`.

Current executable evidence is pinned to immutable Core commit `c503a45c03e0ce3b7a6efba2b029ca842017faa0`. The frozen assignment is `76a2f2311a898e781f53773390d47b05812911e4`; its closure is **19 assigned / 19 unique / 0 missing / 0 extra / 0 drift**. Historical phase wording is not independent current authority.

## Responsibility Boundary

Viewport owns viewport prediction and rendering-window behavior after the store-backed model exists. The upstream sandbox owns snapshot normalization, accepted mutation/cache/store application, and browser-local render-model facts; this leaf neither changes nor makes those facts canonical. See [Sandbox Runtime, Mutation Packets, and Store-backed Render Model](sandbox-runtime-and-store.md).

Viewport does not own structural mutation packet application, authoring draft input, contenteditable caret mapping, durable storage, API behavior, or renderer output. Its bounded state records and browser coordination do not establish a production editor.

## Visible-range Requests and Resolution

A request is request intent: it carries an anchor, reason, budget, overscan, and draft-preservation policy before node ids are resolved. A resolved visible range is a distinct index-derived result: section-window membership and node ids may honor section/node anchors, budget, overscan, and the debug `all-nodes` mode. A request does not resolve itself into rendering, and a resolved range is not a measurement.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/visibleRangeRequest.js#createVisibleRangeRequest`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/visibleRange.js#createVisibleRange`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportController.js#resolveViewportRangeRequest`

## Request, Prediction, Measurement, and Apply

These facts have a deliberate direction and remain separate:

- A viewport request is request intent, not a resolved range or render result.
- Section offsets turn retained spacer heights into intervals; their predicted candidate is an advisory intersection/overscan result, not final layout truth.
- Browser-local measurement facts normalize section-shell boxes and identify a most-visible anchor. They are not authored document data or exact geometry.
- A guarded apply decision may turn a measurement or eligible candidate into a normal visible-range request. It can be manually invoked and does not make browser measurement canonical.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportSectionOffsets.js#createViewportSectionOffsetIndex`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportSectionOffsets.js#predictViewportFromSectionOffsets`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportMeasurement.js#createViewportMeasurement`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportMeasurement.js#createViewportMeasurementApplyRequest`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportSchedulerApply.js#createViewportSchedulerApplyRequest`

## Render Window, Shell, and Section Representation

The resolved render window consumes a resolved range to select active section and node membership without reading browser scroll state. The render shell retains ordered section representation: active-window sections carry detailed content while other shell sections remain placeholders. Thus section order and placeholder state are available without claiming that detailed content is mounted for every section.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/renderWindow.js#createRenderWindow`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/renderShell.js#createRenderShell`

## Measured Spacers and Placeholder Estimates

Rendered section-shell heights are retained as measured spacer facts. A placeholder uses its prior rendered measurement when one exists, otherwise a default estimate; placeholder-only observation does not replace a retained measurement. The offset index derives section intervals and long-section coverage from those facts, leaving predictions advisory.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportSectionSpacers.js#createViewportSectionSpacerMap`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportSectionSpacers.js#resolveViewportSectionSpacer`

## Virtual Stack and Lazy Detail

The virtual stack consumes shell and offset facts. It renders active sections as articles and collapses contiguous hidden sections into spacer items; if offset facts are absent, it mounts all shell sections so measurement can bootstrap. This is a section-granularity consumption boundary, not evidence about reuse of browser elements.

Within the mounted window, lazy-detail planning may defer heavy nodes. Selected or draft ancestor paths and expanded contexts remain materialized, so deferred detail is neither an asynchronous interface nor a statement that every heavy node is absent.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportVirtualStack.js#createViewportVirtualStack`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportLazyDetail.js#createViewportLazyDetailPlan`

## Scheduler Candidate, Runtime, and Apply Guards

The candidate module expands offset prediction with overscan and reports a predicted candidate plus delta; observe-only is the default. Scheduler runtime state assigns sequence and request identifiers and captures revision facts. Its stale or revision-mismatched candidates fail closed before apply. Those guards are shape and correctness checks, not elapsed-time evidence.

Budgeted automation plans and attempts guarded application. Disabled, stale, draft, IME, missing, blocked, not-ready, and stable-window conditions do not update the visible-range request. A candidate therefore does not necessarily change the resolved render window.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportSchedulerCandidate.js#createViewportSchedulerCandidate`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportSchedulerRuntime.js#planViewportSchedulerRuntimeCandidate`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportSchedulerRuntime.js#applyViewportSchedulerRuntimeCandidate`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportSchedulerAutomation.js#runViewportSchedulerAutomation`

## Scroll Coordination and Anchor Restoration

The app binds canvas scrolling and owns its local timer, while the DOM-free scroll controller records and settles state before asking for measurement application. Draft-active and composition states skip automatic application. The debounce configuration is coordination state, not a responsiveness measurement.

A section anchor records `sectionId + offsetInSection` and restores against a later section-shell measurement, with raw scroll position as fallback. A node anchor restores a later node position against a section measurement and fails safely when the section is unavailable. Neither anchor establishes caret-aware navigation.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportScrollController.js#recordViewportScroll`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportScrollController.js#settleViewportScroll`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportAnchor.js#createViewportSectionAnchor`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportAnchor.js#resolveViewportSectionAnchorScrollTop`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportNodeAnchor.js#createViewportNodeAnchor`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/viewportNodeAnchor.js#resolveViewportNodeAnchorScrollTop`

## Bounded Synthetic Shape Evidence

The focused boundary test constructs exactly **72 ordered synthetic sections** and **936 ordered synthetic runtime nodes** (13 per section), targets `section-50`, and uses an **80-node scheduler budget**. It resolves `section-49–section-51` and 39 visible nodes, renders three shell sections with 69 placeholders, creates two virtual spacers, defers inactive heavy table detail, preserves the active target-table path, and restores the target node after a shifted section measurement. These are fixture-specific composition facts only.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## State and Failure Model

Missing offset facts cause the virtual stack to mount shell sections for measurement bootstrap. Missing anchors fall back safely. A missing, malformed, stale, revision-mismatched, blocked, draft/IME-protected, not-ready, or stable candidate does not advance the apply path. Browser-local measurement, request, runtime, and shell state can become stale relative to accepted Core mutations; they remain derived coordination facts rather than document truth.

## Current Verified State

At the pinned Core commit, the focused boundary suite exercises request and range separation, measurement application, section prediction/spacers, guarded scheduler runtime and automation, window/shell consumption, virtual spacers, lazy detail, scroll coordination, and section/node anchor restoration. The synthetic fixture supplies bounded shape evidence, not a generalized editor result.

## Known Limits and Unknowns

This evidence does not establish response-time behavior, throughput, elapsed delay bounds, browser-element reuse, real-document scaling, production virtualization, rendered-output equivalence, async lazy hydration, outline or diagnostics UI, caret-relative text anchoring, persistence, backend/API behavior, or a production renderer. It does not make a fixed node budget a product-wide answer. Template Builder remains `unknown`.

## Historical Design Notes

The assigned sources preserve historical implementation boundaries, but their phase labels and historical success language are not current authority. Current claims above are limited to the immutable executable modules and focused test at the pinned Core commit; excluded claims remain excluded rather than inferred from chronology.

## Canonical Cross-references

- [Sandbox Runtime, Mutation Packets, and Store-backed Render Model](sandbox-runtime-and-store.md)
- [Structural Runtime, Commands, and Navigation](structural-runtime-and-navigation.md)
- [WYSIWYG Draft Input, Selection, and Browser Guards](wysiwyg-draft-input-and-guards.md)
- [Rich Inline Capture, Commit, Replay, and Session Lifecycle](rich-inline-commit-and-session-lifecycle.md)

## Evidence Anchors

All current claims in this leaf are anchored to immutable Core commit `c503a45c03e0ce3b7a6efba2b029ca842017faa0`; the frozen 19-source assignment is retained in `migrations/V0_1_0a_1/core/wave-a-orientation.json`. The anchors above deliberately identify executable code and focused tests rather than former source documents.
