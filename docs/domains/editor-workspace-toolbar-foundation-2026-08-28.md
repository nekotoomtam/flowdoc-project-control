# Editor WorkspaceToolbar Foundation - 2026-08-28

Status: in-review with bounded implementation evidence.

This document records the fifth component-by-component Editor frontend redesign
lane. It narrows this slice to the toolbar shell UI boundary that was still
embedded in `EditorToolbar`. It does not promote Editor truth, Backend
readiness, Core truth, frontend design readiness, Preview parity, accessibility
readiness, visual regression readiness, command readiness, or FlowDoc product
readiness.

## Work Identity

- Work path: `flowdoc-product-development-resumption > editor-workspace-toolbar-foundation`
- Owner repository for implementation: `repo-editor`
- Record repository for this lane: `repo-project-control`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-workspace-toolbar-foundation`
- Checklist target: `checklist-editor-workspace-toolbar-foundation`
- Evidence target: `evidence-editor-workspace-toolbar-foundation-2026-08-28`

## Terminology

The canonical English product terminology remains the authority source for
records, code, tests, contracts, and evidence. The Thai terminology companion is
coordination context only.

- `WorkspaceToolbar`: define. The Editor-owned UI component that renders the
  toolbar shell, toolbar sections, dividers, spacer, and trailing slot from
  supplied children.
- `toolbar sections`: define for this lane as caller-supplied groups of toolbar
  controls with display labels. They are not Core runtime nodes, Backend
  document records, command contracts, or product readiness evidence.
- `EditorToolbar adapter`: define. The existing Editor shell component now owns
  toolbar action controls, callbacks, icons, paper and zoom display, PDF export
  display/control, migration display/control, and diagnostics display before
  passing sections and trailing controls to `WorkspaceToolbar`.
- `toolbar action`: define as an Editor UI intent surface. It is not a Core
  mutation result, Backend HTTP response, Backend revision, or Project Control
  evidence packet.
- `status`, `current`, `ready`, `compatible`, and `live`: context-only unless an
  explicit evidence packet supports the exact scope. `WorkspaceToolbar` must not
  add these claims on its own.
- `component`: split. This lane uses `UI component`; it does not create an
  Editor state component, integration component, Core runtime component, or
  Backend component.

## Component Scope

WorkspaceToolbar owns:

- the toolbar navigation landmark and shell markup;
- rendering supplied toolbar sections as labelled groups;
- rendering dividers between toolbar sections;
- rendering the toolbar spacer before trailing controls;
- rendering supplied trailing controls without interpreting their behavior.

WorkspaceToolbar does not own:

- route navigation, URL parsing, or browser history behavior;
- Editor draft mutation or document package authority;
- Preview lifecycle, Preview data derivation, PDF/export parity, or unavailable
  state decisions;
- Core runtime node semantics, Core mutation results, Core diagnostics
  interpretation, or Core package validation;
- Backend document records, Backend revisions, storage, transport shape, or
  capability response interpretation;
- PDF export behavior, migration behavior, paper model behavior, zoom behavior,
  or command readiness;
- Project Control truth state, evidence packets, or map promotion.

EditorToolbar remains the adapter that owns toolbar controls, callbacks, icons,
and runtime-derived display values before rendering `WorkspaceToolbar`.

## Implementation Target

The Editor implementation should add a focused `WorkspaceToolbar` UI component
under the shell component boundary and update `EditorToolbar` to build supplied
toolbar sections and trailing controls before rendering the component. The first
RED test should fail because the component does not exist. The implementation
should prove:

- `WorkspaceToolbar` renders toolbar shell markup from supplied toolbar
  sections;
- `WorkspaceToolbar` renders dividers, spacer, and trailing controls without
  importing command, runtime, Core, Backend, export, migration, paper, zoom, or
  icon modules;
- `EditorToolbar` renders `WorkspaceToolbar` instead of owning toolbar shell
  markup directly;
- EditorToolbar continues owning paper preset, zoom, PDF export, migration, and
  diagnostics display inputs;
- the lane does not promote map truth.

## Evidence Target

Implementation evidence is recorded as
`evidence-editor-workspace-toolbar-foundation-2026-08-28` after the Editor
worktree and merged main both passed focused tests and the full Editor
repository gate.

That evidence can support only the bounded WorkspaceToolbar UI component split.
It cannot promote broad Editor readiness, product frontend readiness, production
Backend readiness, Preview parity, Core truth, accessibility readiness, visual
regression readiness, command readiness, or FlowDoc product readiness.

## Implementation Evidence

Editor commit `9e9d0deaa957297419f34ed4e2a8b53344a9273e` adds
`WorkspaceToolbar` as the next extracted UI component for the Editor Workspace
Shell. `EditorToolbar` now acts as the EditorToolbar adapter: it builds toolbar
sections and trailing controls from existing props and renders
`WorkspaceToolbar`, while the new UI component owns only toolbar shell layout.

The focused RED test failed before implementation because
`src/components/shell/WorkspaceToolbar.tsx` did not exist. After implementation,
the focused test proved that `WorkspaceToolbar` renders supplied editing, paper,
and zoom toolbar sections with dividers, spacer, and trailing controls while
staying outside command, Editor runtime, Core, Backend, export, migration,
paper, zoom, and icon ownership.

Verification:

- Editor focused test passed for `src/tests/workspaceToolbar.test.ts`: 1 test
  file passed and 2 tests passed.
- Editor shell-adjacent regression tests passed for
  `src/tests/workspaceToolbar.test.ts`, `src/tests/workspaceFrame.test.ts`,
  `src/tests/workspaceHeader.test.ts`, `src/tests/workspaceViewTabs.test.ts`,
  `src/tests/workspaceStatusStrip.test.ts`,
  `src/tests/documentWorkspaceRoute.test.ts`, and
  `src/tests/realdocDocumentWorkspaceTabs.test.ts`: 7 test files passed and 12
  tests passed.
- Editor worktree `npm run check`: type-check passed, 86 test files passed, 296
  tests passed, and Vite build passed.
- Editor merged main `npm run check`: type-check passed, 86 test files passed,
  296 tests passed, and Vite build passed.
- Project Control evidence registration keeps the Editor Project Control Node at
  `unknown` and does not add this evidence to `editor.documentIds` or
  `editor.evidenceIds`.

## Risks

- Toolbar copy can still imply command readiness if future work displays
  unqualified enabled, ready, compatible, current, or live wording without exact
  evidence scope.
- EditorToolbar remains large after this shell split because it still owns
  paper, zoom, PDF export, migration, diagnostics, icons, and callbacks.
- The new component has unit-level markup evidence only; no visual regression or
  accessibility pass was added in this slice.
- Editor dependency installation still reports 5 high severity vulnerabilities.
- Vite still reports the existing chunk-size warning during Editor build.

## Unknowns

- Final visual styling, density, grouping, and responsive shape of the toolbar.
- Whether future frontend work should split editing command groups, document
  actions, paper controls, zoom controls, and export/migration controls into
  separate UI components.
- Which visual regression or accessibility evidence should become mandatory
  before larger frontend redesign phases.
- Production Backend readiness, Preview parity, Core truth, command readiness,
  and broad Editor readiness remain unknown.

## Next Work

Continue the component-by-component Editor shell redesign with a bounded toolbar
subcomponent split, likely editing command groups or paper/zoom controls, only
after a fresh Project Control Work path, Phase, Checklist target, and Evidence
target are identified. The next lane should start with a RED test, preserve
`WorkspaceFrame`, `WorkspaceViewTabs`, `WorkspaceHeader`,
`WorkspaceStatusStrip`, and `WorkspaceToolbar` boundaries, and avoid promoting
map truth without exact evidence.
