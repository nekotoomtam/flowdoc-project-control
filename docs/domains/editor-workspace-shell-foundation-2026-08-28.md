# Editor Workspace Shell Foundation - 2026-08-28

Status: in-review with bounded implementation evidence.

This document opens the first component-by-component Editor frontend redesign
lane. It is a Work-scoped planning decision for the Editor Workspace Shell. It
does not promote Editor truth, Backend readiness, Core truth, frontend design
readiness, or FlowDoc product readiness.

## Work Identity

- Work path: `flowdoc-product-development-resumption > editor-workspace-shell-redesign-foundation`
- Owner repository for implementation: `repo-editor`
- Record repository for this lane: `repo-project-control`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-workspace-shell-foundation`
- Checklist target: `checklist-editor-workspace-shell-foundation`
- Evidence target: `evidence-editor-workspace-shell-foundation-2026-08-28`

## Terminology

The canonical English product terminology remains the authority source for
records, code, tests, contracts, and evidence. The Thai terminology companion is
coordination context only.

- `Editor Workspace Shell`: define. The Editor-owned UI frame that hosts the
  document workspace route, stable app frame, view selection, region slots,
  status surfaces, unavailable states, and responsive layout boundaries.
- `component`: split. Use qualified terms when planning or reviewing work:
  `UI component` for React rendering units, `Editor state component` for
  Editor-owned view-model assembly, `integration component` for adapter or
  transport boundaries, and `Preview component` for preview-specific surfaces.
- `workspace`: context-only unless qualified. In this lane it means the Editor
  document workspace, not Project Control workspace, repository checkout, or
  implementation worktree.
- `shell`: rename in records to `Editor Workspace Shell` when it could be
  confused with a command shell, Project Control control room, or page chrome.
- `Preview`: define against the product terminology document. The shell may host
  a Preview surface or Preview-unavailable surface, but it must not own Preview
  generation lifecycle or export parity.
- `Editor draft`: define against the product terminology document. The shell may
  show draft state, but it must not mutate draft structure or claim source
  authority.

## Shell Scope

The Editor Workspace Shell owns the outer product editor frame only:

- document workspace frame and responsive layout constraints;
- Design and Preview view slot placement;
- stable header, view tabs, region hosts, status strip, and bounded empty,
  loading, unavailable, error, and migration-required surfaces;
- route-derived active workspace view display;
- intent callbacks passed to owner modules.

The shell does not own:

- Core runtime node semantics or Core operation contracts;
- Backend document record persistence, revision identity, or transport shape;
- Editor draft mutation rules or document package authority;
- Preview generation lifecycle, PDF/export parity, or production readiness;
- Outline item semantics, diagnostics interpretation, auth, or full WYSIWYG
  editing behavior.

## Component Split

The first implementation pass should split the shell by ownership instead of by
visual decoration:

- `WorkspaceFrame`: outer layout, landmark structure, and responsive regions.
- `WorkspaceHeader`: document identity, workspace-level commands, and stable
  route context.
- `WorkspaceViewTabs`: Design and Preview view selection display and intent.
- `WorkspaceRegionHost`: named content slots for outline, canvas, inspector,
  diagnostics, and preview-specific panels.
- `WorkspaceStatusStrip`: save/sync/readiness/status summaries.
- `WorkspaceEmptyState` and `WorkspaceErrorState`: bounded no-document,
  unavailable, migration-required, and blocking states.

The exact component names may change during Editor implementation, but the
ownership split must remain visible in tests and review evidence.

## Data Boundary

Shell components should receive a narrow Editor-owned view model rather than raw
Core or Backend data. Acceptable shell inputs include:

- document identity and display title;
- active `DocumentWorkspaceView`;
- view readiness, unavailable, loading, migration-required, and error states;
- draft status summary;
- Preview status summary;
- intent callbacks such as change view, retry, open document, or close panel.

Shell components must not import Core internals, inspect raw document packages,
or couple directly to Backend response shapes. The existing Editor rule remains:
React components render state and dispatch intent; runtime modules own behavior.

## Evidence Target

Implementation evidence is recorded as
`evidence-editor-workspace-shell-foundation-2026-08-28` after the Editor
implementation worktree passes its focused tests, visual/layout review target,
and full repo gate.

That evidence can support only the bounded shell foundation claim. It cannot
promote broad Editor readiness, product frontend readiness, production Backend
readiness, Preview parity, Core truth, or FlowDoc product readiness.

## Implementation Evidence

Editor commit `aef34d9b0b38521dac361abd95d61db7a1c061ee` adds
`WorkspaceFrame` as the first extracted UI component for the Editor Workspace
Shell. `EditorShell` now delegates shell frame and tabpanel retention to that
component while retaining runtime derivation, view-model assembly, preview
eligibility, and intent wiring.

The focused RED test failed before implementation because
`src/components/shell/WorkspaceFrame.tsx` did not exist. After implementation,
the focused test proved that the Design runtime remains present while Preview is
active, Preview is not mounted while Design is active, and `WorkspaceFrame`
does not import Editor runtime or Core modules.

Verification:

- Editor worktree `npm run check`: type-check passed, 81 test files passed, 287
  tests passed, and Vite build passed.
- Editor merged main `npm run check`: type-check passed, 81 test files passed,
  287 tests passed, and Vite build passed.
- Project Control evidence registration will keep the Editor Project Control
  Node at `unknown` and will not add this evidence to `editor.documentIds` or
  `editor.evidenceIds`.

## Risks

- The current `EditorShell` already coordinates many props and child surfaces;
  redesign work can easily become another monolith if the shell boundary is not
  split first.
- Existing Design, Preview, document library, Backend unavailable, and browser
  smoke lanes can leak behavior ownership into the shell lane.
- A visual redesign can outpace evidence and accidentally imply readiness that
  Project Control still marks as unknown.
- Ambiguous component vocabulary can send future agents toward the wrong owner
  repository or behavior layer.

## Unknowns

- Final visual density, navigation hierarchy, and detailed interaction model.
- Exact component names and prop shapes for the Editor implementation.
- Whether a dedicated shell view-model adapter is needed before the component
  split is small enough.
- Which visual regression or accessibility evidence target should be required
  beyond the normal Editor test gate.
- Production Backend readiness and broad Editor readiness remain unknown.

## Next Work

Open the Editor implementation worktree only after this Project Control lane is
registered and verified. The next implementation turn should start with a RED
Editor test for the shell boundary, then split the first shell component without
changing Core, Backend, Preview lifecycle, or map truth.
