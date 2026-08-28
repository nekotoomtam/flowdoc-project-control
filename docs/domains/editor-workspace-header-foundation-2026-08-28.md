# Editor WorkspaceHeader Foundation - 2026-08-28

Status: in-review with bounded implementation evidence.

This document opens the third component-by-component Editor frontend redesign
lane. It narrows the next shell split to the document identity, back intent,
status display, and header slot layout that still sit inside `AppHeader`. It
does not promote Editor truth, Backend readiness, Core truth, frontend design
readiness, Preview parity, accessibility readiness, or FlowDoc product
readiness.

## Work Identity

- Work path: `flowdoc-product-development-resumption > editor-workspace-header-foundation`
- Owner repository for implementation: `repo-editor`
- Record repository for this lane: `repo-project-control`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-workspace-header-foundation`
- Checklist target: `checklist-editor-workspace-header-foundation`
- Evidence target: `evidence-editor-workspace-header-foundation-2026-08-28`

## Terminology

The canonical English product terminology remains the authority source for
records, code, tests, contracts, and evidence. The Thai terminology companion is
coordination context only.

- `WorkspaceHeader`: define. The Editor-owned UI component that renders document
  identity, back intent surface, document readiness status display, and a slot
  for already-separated workspace view controls.
- `AppHeader`: context-only for this lane. It remains the existing composition
  wrapper called by `EditorShell` and should not become a new behavior owner.
- `document identity`: define as display-only title, package version, and
  document version values provided by the Editor view model. It is not Core
  document package authority and not a Backend document record.
- `status display`: define as rendering already-derived readiness values. It
  does not interpret Core diagnostics, decide readiness, or create evidence.
- `back intent`: define as a callback surface for returning to the document
  library. It is not route navigation ownership or browser history ownership.
- `component`: split. This lane uses `UI component`; it does not create an
  Editor state component, integration component, Core runtime component, or
  Backend component.

## Component Scope

WorkspaceHeader owns:

- header landmark and shell layout around header content;
- document identity presentation;
- optional back button surface and callback dispatch;
- document readiness status display markup;
- composition slot for `WorkspaceViewTabs` or a future equivalent view selector.

WorkspaceHeader does not own:

- route navigation, URL parsing, or browser history behavior;
- WorkspaceViewTabs view-selection logic;
- Editor draft mutation or document package authority;
- Preview lifecycle, Preview data derivation, PDF/export parity, or unavailable
  state decisions;
- Core runtime node semantics, Core mutation results, Core diagnostics
  interpretation, or Core package validation;
- Backend document records, Backend revisions, storage, or transport shape.

## Implementation Target

The Editor implementation should add a focused `WorkspaceHeader` UI component
under the shell component boundary and update `AppHeader` to compose
`WorkspaceHeader` with `WorkspaceViewTabs`. The first RED test should fail
because the component does not exist. The implementation should prove:

- `WorkspaceHeader` renders the app header landmark;
- document title, package version, and document version render as display-only
  identity;
- document readiness status values render without Core diagnostic imports;
- back intent dispatches only when provided;
- `WorkspaceViewTabs` stays composed as a slot instead of being imported by
  `WorkspaceHeader`;
- WorkspaceHeader does not import Editor runtime, Core, or Backend modules.

## Evidence Target

Implementation evidence will be recorded as
`evidence-editor-workspace-header-foundation-2026-08-28` after the Editor
worktree passes focused WorkspaceHeader tests and the full Editor repository
gate.

That evidence can support only the bounded WorkspaceHeader UI component split.
It cannot promote broad Editor readiness, product frontend readiness, production
Backend readiness, Preview parity, Core truth, accessibility readiness, or
FlowDoc product readiness.

## Implementation Evidence

Editor commit `8adf7d69af1f2a54c88c9c3c716e005ac98ae590` adds
`WorkspaceHeader` as the next extracted UI component for the Editor Workspace
Shell. `AppHeader` now composes `WorkspaceHeader` with the already-separated
`WorkspaceViewTabs`, while `WorkspaceHeader` owns only document identity display,
back intent surface, readiness status display, and header slot layout.

The focused RED test failed before implementation because
`src/components/shell/WorkspaceHeader.tsx` did not exist. After implementation,
the focused test proved that `WorkspaceHeader` renders the app header landmark,
document title, package version, document version, view-tabs slot, document
readiness status values, and optional back intent while staying outside
WorkspaceViewTabs, Editor runtime, Core, and Backend ownership.

Verification:

- Editor focused tests passed for `src/tests/workspaceHeader.test.ts`,
  `src/tests/workspaceViewTabs.test.ts`,
  `src/tests/realdocDocumentWorkspaceTabs.test.ts`,
  `src/tests/workspaceFrame.test.ts`,
  `src/tests/editorBackendUnavailableHonesty.test.ts`, and
  `src/tests/boundary.test.ts`: 6 test files passed and 16 tests passed.
- Editor worktree `npm run check`: type-check passed, 83 test files passed, 291
  tests passed, and Vite build passed.
- Editor merged main `npm run check`: type-check passed, 83 test files passed,
  291 tests passed, and Vite build passed.
- Project Control evidence registration keeps the Editor Project Control Node at
  `unknown` and does not add this evidence to `editor.documentIds` or
  `editor.evidenceIds`.

## Risks

- `document identity` can still be confused with Core document package authority or a
  Backend document record if evidence wording is not bounded to display state.
- `status display` can still imply readiness interpretation unless future
  component work keeps it to already-derived values.
- Moving `WorkspaceViewTabs` deeper into `WorkspaceHeader` later would reverse
  the previous boundary split.
- Project Control baseline has shown intermittent Vitest worker startup
  timeout during full-gate runs; rerun evidence is required before claims.
- Editor dependency installation still reports 5 high severity vulnerabilities.
- Vite still reports the existing chunk-size warning during Editor build.

## Unknowns

- Final visual styling, density, and responsive shape of the redesigned header.
- Whether future shell work should split a dedicated `WorkspaceStatusStrip`.
- Which visual regression or accessibility evidence should become mandatory
  before larger frontend redesign phases.
- Production Backend readiness and broad Editor readiness remain unknown.

## Next Work

Open the Editor implementation worktree only after this Project Control lane is
registered and verified. The next Editor turn should start with a RED test for
`WorkspaceHeader`, then implement the smallest component split without changing
Core, Backend, Preview lifecycle, Editor draft mutation, WorkspaceViewTabs
behavior, or map truth.
