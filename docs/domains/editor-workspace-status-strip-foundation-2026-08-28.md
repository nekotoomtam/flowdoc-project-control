# Editor WorkspaceStatusStrip Foundation - 2026-08-28

Status: in-review with bounded implementation evidence.

This document records the fourth component-by-component Editor frontend
redesign lane. It narrows this slice to the status strip UI boundary that was
still embedded in `StatusBar`. It does not promote Editor truth, Backend
readiness, Core truth, frontend design readiness, Preview parity, accessibility
readiness, visual regression readiness, or FlowDoc product readiness.

## Work Identity

- Work path: `flowdoc-product-development-resumption > editor-workspace-status-strip-foundation`
- Owner repository for implementation: `repo-editor`
- Record repository for this lane: `repo-project-control`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-workspace-status-strip-foundation`
- Checklist target: `checklist-editor-workspace-status-strip-foundation`
- Evidence target: `evidence-editor-workspace-status-strip-foundation-2026-08-28`

## Terminology

The canonical English product terminology remains the authority source for
records, code, tests, contracts, and evidence. The Thai terminology companion is
coordination context only.

- `WorkspaceStatusStrip`: define. The Editor-owned UI component that renders
  supplied workspace status facts as status strip markup.
- `status facts`: define for this lane as display-ready label/value items
  supplied by the owning adapter. Status facts are not evidence packets, not
  Backend document records, not Core document packages, and not product
  readiness claims.
- `StatusBar adapter`: define. The existing Editor shell component now derives
  display values from Editor runtime inputs and passes those values to
  `WorkspaceStatusStrip`.
- `status`: split. This lane means Editor UI status display. It does not mean
  Core adapter status, Backend capability response status, Project Control truth
  state, evidence status, or product readiness.
- `current`, `ready`, `compatible`, and `live`: context-only unless an explicit
  evidence packet supports the exact scope. `WorkspaceStatusStrip` must not add
  these claims on its own.
- `component`: split. This lane uses `UI component`; it does not create an
  Editor state component, integration component, Core runtime component, or
  Backend component.

## Component Scope

WorkspaceStatusStrip owns:

- the status strip landmark and shell markup;
- rendering supplied status fact labels and values;
- stable keying of status fact rows by caller-provided item id;
- avoiding readiness, currentness, compatibility, or live claims that were not
  provided by the adapter.

WorkspaceStatusStrip does not own:

- route navigation, URL parsing, or browser history behavior;
- Editor draft mutation or document package authority;
- Preview lifecycle, Preview data derivation, PDF/export parity, or unavailable
  state decisions;
- Core runtime node semantics, Core mutation results, Core diagnostics
  interpretation, or Core package validation;
- Backend document records, Backend revisions, storage, transport shape, or
  capability response interpretation;
- Project Control truth state, evidence packets, or map promotion.

StatusBar remains the adapter that derives display values from existing Editor
runtime inputs before rendering `WorkspaceStatusStrip`.

## Implementation Target

The Editor implementation should add a focused `WorkspaceStatusStrip` UI
component under the shell component boundary and update `StatusBar` to build
display-ready status facts before rendering the component. The first RED test
should fail because the component does not exist. The implementation should
prove:

- `WorkspaceStatusStrip` renders status strip markup from supplied status facts;
- `WorkspaceStatusStrip` does not import Editor runtime, Core, or Backend
  modules;
- `StatusBar` renders `WorkspaceStatusStrip` instead of owning status strip
  markup directly;
- layout QA display remains absent when no layout QA summary is supplied and
  present when the adapter receives a summary;
- selected node, local history, document change, and undoable counts remain
  visible after the component split;
- the lane does not promote map truth.

## Evidence Target

Implementation evidence is recorded as
`evidence-editor-workspace-status-strip-foundation-2026-08-28` after the Editor
worktree and merged main both passed focused tests and the full Editor
repository gate.

That evidence can support only the bounded WorkspaceStatusStrip UI component
split. It cannot promote broad Editor readiness, product frontend readiness,
production Backend readiness, Preview parity, Core truth, accessibility
readiness, visual regression readiness, or FlowDoc product readiness.

## Implementation Evidence

Editor commit `a20f83a2e9c9bfb76aea4b724c91b5964cf6e3c1` adds
`WorkspaceStatusStrip` as the next extracted UI component for the Editor
Workspace Shell. `StatusBar` now acts as the StatusBar adapter: it derives
status facts from the existing Editor runtime inputs and renders
`WorkspaceStatusStrip`, while the new UI component owns only supplied status
fact markup.

The focused RED test failed before implementation because
`src/components/shell/WorkspaceStatusStrip.tsx` did not exist. After
implementation, the focused test proved that `WorkspaceStatusStrip` renders
document, Core source display, selection, job, and page status facts while
staying outside Editor runtime, Core, and Backend ownership.

Verification:

- Editor focused test passed for `src/tests/workspaceStatusStrip.test.ts`: 1
  test file passed and 2 tests passed.
- Editor shell/status-adjacent regression tests passed for
  `src/tests/workspaceStatusStrip.test.ts`, `src/tests/workspaceFrame.test.ts`,
  `src/tests/workspaceHeader.test.ts`, `src/tests/workspaceViewTabs.test.ts`,
  `src/tests/layoutQaConfig.test.ts`, and `src/tests/selectionHitTest.test.ts`:
  6 test files passed and 13 tests passed.
- Editor worktree `npm run check`: type-check passed, 85 test files passed, 294
  tests passed, and Vite build passed.
- Editor merged main `npm run check`: type-check passed, 85 test files passed,
  294 tests passed, and Vite build passed.
- Project Control evidence registration keeps the Editor Project Control Node at
  `unknown` and does not add this evidence to `editor.documentIds` or
  `editor.evidenceIds`.

## Risks

- Status strip wording can still imply readiness or compatibility if future
  work passes unqualified `current`, `ready`, `compatible`, or `live` values
  without exact evidence scope.
- `Core` remains a visible status fact label in the legacy bar; future copy work
  may need a clearer display label if frontend terminology becomes stricter.
- The new component has unit-level markup evidence only; no visual regression or
  accessibility pass was added in this slice.
- Editor dependency installation still reports 5 high severity vulnerabilities.
- Vite still reports the existing chunk-size warning during Editor build.

## Unknowns

- Final visual styling, density, grouping, and responsive shape of the status
  strip.
- Whether future frontend work should group status facts into document,
  workspace, background work, and QA clusters.
- Which visual regression or accessibility evidence should become mandatory
  before larger frontend redesign phases.
- Production Backend readiness, Preview parity, Core truth, and broad Editor
  readiness remain unknown.

## Next Work

Continue the component-by-component Editor shell redesign with the next bounded
surface, likely `EditorToolbar`, only after a fresh Project Control Work path,
Phase, Checklist target, and Evidence target are identified. The next lane
should start with a RED test, preserve `WorkspaceFrame`, `WorkspaceViewTabs`,
`WorkspaceHeader`, and `WorkspaceStatusStrip` boundaries, and avoid promoting
map truth without exact evidence.
