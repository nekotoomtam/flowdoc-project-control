# Editor Paper Smooth Zoom Surface - 2026-08-29

Status: in-review with bounded implementation evidence.

This document records a small Editor frontend lane opened after zoom inspection
showed that the paper scale could feel abrupt. The lane adds a smooth viewport
zoom surface around the existing paper model while keeping the Editor honest:
the current browser session can show `Source: Backend read` and
`Authoring: limited`, but this lane does not enable WYSIWYG editing.

This lane does not promote Editor truth, Backend readiness, Core truth, command
readiness, WYSIWYG readiness, text input readiness, frontend design readiness,
Preview parity, accessibility readiness, visual regression readiness, durable
storage readiness, PDF export readiness, production readiness, bundle-size
readiness, or FlowDoc product readiness.

## Work Identity

- Work path: `flowdoc-product-development-resumption > editor-paper-smooth-zoom-surface`
- Owner repository for implementation: `repo-editor`
- Record repository for this lane: `repo-project-control`
- Evidence source repositories: `repo-backend`, `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-paper-smooth-zoom-surface`
- Checklist target: `checklist-editor-paper-smooth-zoom-surface`
- Evidence target: `evidence-editor-paper-smooth-zoom-surface-2026-08-29`

## Terminology

The canonical English product terminology remains the authority source for
records, code, tests, contracts, and evidence. The Thai terminology companion
is coordination context only.

- `smooth viewport zoom`: define. A visible Editor browser-session interaction
  that changes paper scale with motion. It is not document content, a Core
  document package mutation, Backend persistence, or authoring readiness.
- `viewport-only zoom`: define. The scale is a presentation state for the
  current Editor viewport. It must not be interpreted as a durable Backend
  document record field or exported document layout fact.
- `paper zoom presets`: define. The current bounded preset buttons are 50%,
  85%, 100%, and 125%. They are UI controls over the existing viewport zoom
  policy, not a new zoom contract across FlowDoc.
- `post-transition selection overlay sync`: define. The selected-node overlay
  is remeasured after the smooth paper transform has had time to settle so the
  overlay does not remain at the pre-motion geometry.
- `live Backend mode`: context-only for this lane as Editor Vite calling a real
  Backend server on a local loopback URL while Core remains dependency-only.
- `ready`, `live`, `source`, `session`, and `runtime`: context-only unless
  qualified by route, server, browser, repository, and evidence boundary.

## Component Scope

EditorToolbar and PaperZoomControls own:

- presenting `Canvas zoom (viewport only)`;
- rendering Zoom out, current zoom, fixed presets for 50%, 85%, 100%, and 125%,
  and Zoom in;
- preserving icon-button and segmented-control ergonomics without claiming
  document editing or Backend persistence.

PaperPage and editor.css own:

- marking the paper shell with `data-paper-viewport-only="true"`;
- marking paper pages with `data-zoom-motion="smooth"`;
- applying a 160ms transform transition for zoom motion;
- disabling that transition under `prefers-reduced-motion: reduce`.

CanvasOverlayLayer and selectionOverlay own:

- keeping the selected-node overlay as a read-only pointer-free measurement
  layer;
- measuring selection geometry immediately when the viewport measurement key
  changes;
- scheduling one post-transition sync so smooth zoom does not leave the overlay
  stale after the paper transform settles.

This lane does not own:

- WYSIWYG, text input, caret, selection editing, free-form document editing, or
  full authoring;
- command activation, command readiness, undo/redo readiness, or new mutation
  operations;
- Core document package semantics, Core runtime nodes, Core mutation results,
  or Core authoring contracts;
- Backend document record persistence, Backend revision gates, migration,
  mutation, auth, tenancy, storage, deployment, or production readiness;
- Preview lifecycle, PDF export, visual regression, accessibility, or map truth
  promotion.

## Implementation Evidence

Editor commit `58f3002363b29662bb02042fdb1021236844cbc1` changes only the
bounded Editor viewport zoom surface:

- `src/components/shell/PaperZoomControls.tsx` adds the zoom control group.
- `src/components/shell/EditorToolbar.tsx` uses the new viewport-only zoom
  control group.
- `src/components/paper/PaperPage.tsx` marks the paper shell and page for
  viewport-only smooth zoom.
- `src/styles/app.css` sizes the zoom preset controls.
- `src/styles/editor.css` applies smooth transform motion and reduced-motion
  fallback.
- `src/components/canvas/CanvasOverlayLayer.tsx` schedules overlay remeasurement
  after zoom motion.
- `src/editor/selection/selectionOverlay.ts` defines the post-transition sync
  scheduler used by the overlay layer.
- `src/tests/paperSmoothZoomSurface.test.ts` and
  `src/tests/selectionOverlay.test.ts` cover the new behavior.

The focused RED test failed because the current UI did not render
`Canvas zoom (viewport only)`, viewport-only paper markers, zoom presets, or
smooth zoom motion before implementation. A second focused RED test failed
because the selection overlay had no post-transition sync helper before the
overlay drift fix.

After implementation, focused GREEN passed for
`src/tests/paperSmoothZoomSurface.test.ts` and
`src/tests/selectionOverlay.test.ts`: 2 test files passed and 9 tests passed.

Editor worktree `npm run check` passed type-check, 88 test files, 302 tests,
and Vite build. Editor merged main `npm run check` also passed type-check, 88
test files, 302 tests, and Vite build.

Live Backend mode verification:

- `npm run dev:local-loopback:smoke` passed in the Editor worktree with Backend
  and Editor on random loopback ports while Core remained dependency-only.
- A Chromium browser check opened
  `/documents/product-report-vnext-minimal/design` through live Backend mode,
  observed Backend `GET /capabilities/versions` and
  `GET /documents/product-report-vnext-minimal` with status 200, and confirmed
  the design route showed `Source: Backend read` and `Authoring: limited`.
- The browser check clicked Zoom in from 85% to 95%, confirmed the paper
  transform transition was 0.16s, found no Backend mutation request, and
  measured the selected title overlay with near-zero deltas after motion
  settled.

Project Control registration keeps the Editor Project Control Node at
`unknown` and does not add this evidence to `editor.documentIds` or
`editor.evidenceIds`.

## Risks

- This lane improves zoom feel and viewport clarity, not authoring capability.
  Users still cannot type and edit the full document as a WYSIWYG editor.
- `Local history: 1` can increase after a zoom click because viewport command
  history records the zoom action; it is not a document mutation and `Doc
  changes` stayed 0 in browser evidence.
- Local loopback evidence does not prove deployed Backend compatibility,
  production storage, auth, tenancy, rate limits, telemetry, backup, rollback,
  cross-browser behavior, visual regression, or accessibility readiness.
- Backend `/health` still reports production blocked.
- Editor dependency installation still reports 5 high severity vulnerabilities.
- Vite still reports the existing chunk-size warning during Editor build.
- The primary Core checkout still has unrelated deleted
  `packages/pdf-renderer-pilot/fixtures/**` files. They were not edited or
  reverted by this lane.

## Unknowns

- Whether the final Editor redesign keeps zoom in this toolbar section, moves
  it into a denser canvas header, or combines it with page navigation.
- Whether zoom history should remain undoable viewport history or later split
  into non-document local view preferences.
- Cross-browser visual smoothness, accessibility audit results, and high-volume
  page-stack performance remain unverified.
- The ownership and test shape for WYSIWYG, caret, IME, clipboard, undo/redo,
  collaborative edits, and Backend persistence remain unresolved.
- Production Backend readiness, broad Editor runtime truth, broad Core truth,
  and FlowDoc product readiness remain unknown.

## Next Work

Continue the component-by-component Editor redesign. The next low-risk visual
slice can split the remaining paper controls out of EditorToolbar, but any
slice that touches document loading, mutation, persistence, or source/authoring
claims must stay under live Backend mode evidence. For product behavior, the
next larger planning topic is still the first real authoring gate and its
Core/Backend evidence boundary before enabling controls.
