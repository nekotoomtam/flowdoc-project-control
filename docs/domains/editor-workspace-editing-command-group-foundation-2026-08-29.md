# Editor WorkspaceEditingCommandGroup Foundation - 2026-08-29

Status: in-review with bounded implementation evidence.

This document records the sixth component-by-component Editor frontend
redesign lane. It narrows this slice to the disabled editing command
presentation that was still embedded in `EditorToolbar` after the
`WorkspaceToolbar` split.

This lane does not promote Editor truth, Backend readiness, Core truth,
frontend design readiness, Preview parity, accessibility readiness, visual
regression readiness, command readiness, production readiness, bundle-size
readiness, or FlowDoc product readiness.

## Work Identity

- Work path: `flowdoc-product-development-resumption > editor-workspace-editing-command-group-foundation`
- Owner repository for implementation: `repo-editor`
- Record repository for this lane: `repo-project-control`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-workspace-editing-command-group-foundation`
- Checklist target: `checklist-editor-workspace-editing-command-group-foundation`
- Evidence target: `evidence-editor-workspace-editing-command-group-foundation-2026-08-29`

## Terminology

The canonical English product terminology remains the authority source for
records, code, tests, contracts, and evidence. The Thai terminology companion
is coordination context only.

- `WorkspaceEditingCommandGroup`: define. The Editor-owned UI component that
  renders supplied disabled editing command controls inside the toolbar.
- `editing command presentation`: define for this lane as the visible disabled
  Insert, Text, Fields, and Table toolbar controls. It is not command behavior,
  command readiness, Core mutation semantics, Backend transport, or evidence.
- `EditorToolbar adapter`: define. The existing Editor shell component remains
  responsible for choosing icons and preparing display descriptors before
  passing them to `WorkspaceEditingCommandGroup`.
- `toolbar action`: context-only in this lane. The controls are still disabled
  placeholders and do not prove available editing commands.
- `command readiness`: blocked for promotion in this lane. It requires a later
  command-owned evidence path before these controls can become enabled behavior.
- `component`: split. This lane uses `UI component`; it does not create an
  Editor runtime component, Core runtime component, Backend component, or
  Project Control component.

## Component Scope

WorkspaceEditingCommandGroup owns:

- rendering supplied editing command descriptors as toolbar buttons;
- preserving the current disabled command presentation;
- rendering supplied icons and labels without interpreting their behavior.

WorkspaceEditingCommandGroup does not own:

- command activation, command readiness, callbacks, or mutation behavior;
- Editor draft mutation, runtime state, selection, history, or Preview
  lifecycle;
- Core runtime node semantics, Core mutation results, or Core package
  validation;
- Backend document records, Backend revisions, persistence, transport, or
  capability responses;
- PDF export behavior, migration behavior, paper model behavior, zoom behavior,
  diagnostics interpretation, or icon ownership;
- Project Control truth state, evidence packets, or map promotion.

EditorToolbar remains the adapter that owns icons, display descriptors, paper,
zoom, PDF export, migration, diagnostics, and future command readiness inputs
before rendering the bounded UI component.

## Implementation Evidence

Editor commit `aca56f18b4e3e41ca514684fdf47478ce0e9ea00` adds
`WorkspaceEditingCommandGroup` as the next extracted UI component under the
Editor WorkspaceToolbar boundary. `EditorToolbar` now passes an
`editingCommands` descriptor list into that component instead of holding the
disabled editing command button markup inline.

The focused RED test failed before implementation because
`src/components/shell/WorkspaceEditingCommandGroup.tsx` did not exist. After
implementation, the focused test proved that the component renders supplied
Insert, Text, Fields, and Table commands as disabled toolbar controls while
staying outside Editor runtime, Core, Backend, export, migration, paper, zoom,
diagnostics, icon, and command readiness ownership.

Verification:

- Editor focused RED: `npx vitest run src/tests/workspaceEditingCommandGroup.test.ts --reporter verbose` failed before the component existed.
- Editor focused GREEN: `npx vitest run src/tests/workspaceEditingCommandGroup.test.ts --reporter verbose` passed 1 test file and 2 tests.
- Editor shell-adjacent regression tests passed for
  `src/tests/workspaceEditingCommandGroup.test.ts`,
  `src/tests/workspaceToolbar.test.ts`, `src/tests/workspaceFrame.test.ts`,
  `src/tests/workspaceHeader.test.ts`, `src/tests/workspaceViewTabs.test.ts`,
  `src/tests/workspaceStatusStrip.test.ts`,
  `src/tests/documentWorkspaceRoute.test.ts`, and
  `src/tests/realdocDocumentWorkspaceTabs.test.ts`: 8 test files passed and 14
  tests passed.
- Editor worktree `npm run check`: type-check passed, 87 test files passed,
  298 tests passed, and Vite build passed.
- Editor merged main `npm run check`: type-check passed, 87 test files passed,
  298 tests passed, and Vite build passed.
- Project Control registration keeps the Editor Project Control Node at
  `unknown` and does not add this evidence to `editor.documentIds` or
  `editor.evidenceIds`.

## Risks

- Editing command controls remain disabled placeholders. This lane does not
  prove command readiness or command behavior.
- EditorToolbar remains responsible for paper, zoom, PDF export, migration,
  diagnostics, icons, and display descriptors.
- The new component has unit-level markup evidence only; no visual regression
  or accessibility pass was added in this slice.
- Editor dependency installation still reports 5 high severity vulnerabilities.
- Vite still reports the existing chunk-size warning during Editor build.

## Unknowns

- Final visual styling, density, grouping, and enabled-state behavior of the
  editing command group.
- Whether command groups should become command-owned controls, stay toolbar
  presentation, or be replaced during the later full Editor frontend redesign.
- Which visual regression or accessibility evidence should become mandatory
  before larger frontend redesign phases.
- Production Backend readiness, Preview parity, Core truth, command readiness,
  and broad Editor readiness remain unknown.

## Next Work

Continue the component-by-component Editor shell redesign with another bounded
toolbar subcomponent only after a fresh Project Control Work path, Phase,
Checklist target, and Evidence target are identified. The next smallest slices
are likely `WorkspacePaperControlGroup` or `WorkspaceZoomControlGroup` because
they are still inside `EditorToolbar` but must preserve the paper and zoom
ownership boundaries.
