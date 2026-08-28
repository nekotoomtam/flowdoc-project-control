# Editor WorkspaceViewTabs Foundation - 2026-08-28

Status: in-progress planning lane; implementation evidence not recorded yet.

This document opens the second component-by-component Editor frontend redesign
lane. It narrows the next shell split to the workspace view selector currently
inside `AppHeader`. It does not promote Editor truth, Backend readiness, Core
truth, frontend design readiness, Preview parity, or FlowDoc product readiness.

## Work Identity

- Work path: `flowdoc-product-development-resumption > editor-workspace-view-tabs-foundation`
- Owner repository for implementation: `repo-editor`
- Record repository for this lane: `repo-project-control`
- Active role: `planning-partner`
- Phase: `phase-editor-workspace-view-tabs-foundation`
- Checklist target: `checklist-editor-workspace-view-tabs-foundation`
- Evidence target: `evidence-editor-workspace-view-tabs-foundation-2026-08-28`

## Terminology

The canonical English product terminology remains the authority source for
records, code, tests, contracts, and evidence. The Thai terminology companion is
coordination context only.

- `WorkspaceViewTabs`: define. The Editor-owned UI component that renders the
  Design and Preview view selector for the document workspace and dispatches
  view-selection intent.
- `tabs`: rename in records and tests to `WorkspaceViewTabs` when referring to
  this component. The shorter word can remain context-only in visible UI prose.
- `active view`: define. The route-derived `DocumentWorkspaceView` value that
  tells shell UI whether the Design or Preview workspace view is selected.
- `Preview`: define against the product terminology document. WorkspaceViewTabs
  may expose a Preview tab intent, but it must not own Preview generation,
  mounting policy, export parity, or readiness claims.
- `component`: split. This lane uses `UI component`; it does not create an
  Editor state component, integration component, Core runtime component, or
  Preview component.

## Component Scope

WorkspaceViewTabs owns:

- tablist markup and accessibility selection state;
- visible Design and Preview tab labels and icons;
- active and inactive view presentation;
- view-selection intent callback dispatch.

WorkspaceViewTabs does not own:

- route navigation or URL parsing;
- Editor draft mutation or document package authority;
- Preview lifecycle, Preview data derivation, PDF/export parity, or unavailable
  state decisions;
- Core runtime node semantics, Core mutation results, or Core diagnostics;
- Backend document records, Backend revisions, storage, or transport shape;
- AppHeader document identity, back navigation intent, or diagnostics summary.

## Implementation Target

The Editor implementation should add a focused `WorkspaceViewTabs` UI component
under the shell component boundary and update `AppHeader` to delegate the view
selector. The first RED test should fail because the component does not exist.
The implementation should prove:

- `WorkspaceViewTabs` renders a `Document workspace view` tablist;
- exactly one tab reflects the active view;
- inactive tabs dispatch the requested view;
- active tabs do not dispatch redundant selection intent;
- AppHeader still owns document identity, back intent, and status summary;
- WorkspaceViewTabs does not import Editor runtime, Core, or Backend modules.

## Evidence Target

Implementation evidence will be recorded as
`evidence-editor-workspace-view-tabs-foundation-2026-08-28` after the Editor
worktree passes focused WorkspaceViewTabs tests and the full Editor repository
gate.

That evidence can support only the bounded WorkspaceViewTabs UI component split.
It cannot promote broad Editor readiness, product frontend readiness, production
Backend readiness, Preview parity, Core truth, or FlowDoc product readiness.

## Risks

- AppHeader currently mixes document identity, status summary, and view selector
  UI; the split can accidentally move header responsibilities into the tabs
  component.
- The Preview tab label can imply Preview readiness if evidence wording is not
  bounded to UI intent and current route state.
- `active view` can be confused with Editor draft state unless the term remains
  tied to `DocumentWorkspaceView`.
- Project Control baseline has shown intermittent Vitest worker startup
  timeout during full-gate runs; rerun evidence is required before claims.

## Unknowns

- Final visual styling for the redesigned header and tab control.
- Whether future shell work should split a dedicated `WorkspaceHeader` after
  the tab component is isolated.
- Which visual regression or accessibility evidence should become mandatory
  before larger frontend redesign phases.
- Production Backend readiness and broad Editor readiness remain unknown.

## Next Work

Open the Editor implementation worktree only after this Project Control lane is
registered and verified. The next Editor turn should start with a RED test for
`WorkspaceViewTabs`, then implement the smallest component split without
changing Core, Backend, Preview lifecycle, Editor draft mutation, or map truth.
