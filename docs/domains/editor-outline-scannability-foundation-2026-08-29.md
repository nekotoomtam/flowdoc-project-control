# Editor Outline Scannability Foundation - 2026-08-29

Status: bounded Editor Outline scannability layer complete; broad Editor truth
remains unpromoted.

## Scope

- Work path: `flowdoc-product-development-resumption > editor-outline-scannability-foundation`
- Owner repository: `repo-editor`
- Related repositories: `repo-project-control`, `repo-backend`, `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-outline-scannability-foundation`
- Checklist target: `checklist-editor-outline-scannability-foundation`
- Evidence target: `evidence-editor-outline-scannability-foundation-2026-08-29`

This record is work-scoped verification only. It does not enable WYSIWYG, text
input, authoring, Backend mutation, persistence behavior, production Backend
readiness, Core truth, broad Editor truth, accessibility readiness, visual
regression readiness, or FlowDoc product readiness.

## Terminology Boundary

- `Outline summary` means the compact Editor left-panel summary that reports
  the number and displayed types of outline items for the current Editor draft.
- `Outline type cue` means the presentation icon and type label attached to an
  Editor outline row. It helps scanning; it is not a Core node type authority,
  Backend record schema, or Project Control Node truth.
- `Outline depth cue` means the row indentation and `data-outline-depth`
  presentation attribute for an Editor outline row. It does not change
  document structure semantics.
- The word `Outline` in this lane is context-only for the Editor UI. It is not
  the Project Control overview, Project Control history, Core runtime node
  graph, or a Backend persistence claim.

## PASS

Editor merge commit `f45512f2667d066553b7ffaedfdc85d2c6e1392f` adds a bounded
Outline scannability layer to the Editor.

The left Outline now has:

| Surface | Observed value |
| --- | --- |
| Summary label | `Outline summary, 3 items, Text 1, Columns 1, Table 1` |
| Text row label | `Product Report for Customer, Text block` |
| Columns row label | `Columns section` |
| Table row label | `Table section` |
| Type attributes | `text-block`, `columns`, `table` |
| Depth attributes on served sample | `0`, `0`, `0` |
| Selection after choosing Columns | `summary-columns` |
| Browser error logs | `0` |

The implementation preserves the existing Outline selection path. Clicking an
Outline item still calls the existing selection handler; this lane only changes
how the outline rows are summarized and visually scanned.

## Verification

- Editor focused RED:
  `npx vitest run src/tests/outlineScannability.test.ts --reporter verbose`
  failed because `OutlinePanel` did not render an `Outline summary` or
  `data-outline-type` / `data-outline-depth` row cues.
- Editor focused GREEN:
  `npx vitest run src/tests/outlineScannability.test.ts --reporter verbose`
  passed 1 file / 2 tests.
- Editor worktree gate: `npm run check` passed type-check, 90 test files, 310
  tests, and build.
- Worktree browser evidence in live Backend mode at
  `http://127.0.0.1:50079/documents/product-report-vnext-minimal/design` with
  Backend on `http://127.0.0.1:50078` confirmed `outlineVisible: true`,
  summary label `Outline summary, 3 items, Text 1, Columns 1, Table 1`, item
  labels `Product Report for Customer, Text block`, `Columns section`, and
  `Table section`, type/depth attributes, `summary-columns` selected after
  clicking Columns, and no browser errors.
- Editor merged main gate: `npm run check` passed type-check, 90 test files,
  310 tests, and build.
- Main browser evidence at
  `http://127.0.0.1:63958/documents/product-report-vnext-minimal/design` with
  Backend on `http://127.0.0.1:63957` confirmed the same summary, item labels,
  type/depth attributes, Columns selection state, and 0 browser errors.
- Project Control baseline `npm run check` first failed with a transient
  Vitest worker startup timeout before records were edited; the immediate exact
  rerun passed `check:data`, type-check, 56 test files, 327 tests, build, and 6
  e2e tests.
- Project Control worktree record gate: `npm run check` passed `check:data`,
  type-check, 57 test files, 328 tests, build, and 6 e2e tests after records
  were added.
- git deregistered the Editor worktree and branch deletion succeeded, but the
  residual `.worktrees/editor-outline-scannability-foundation` folder could not
  be removed because ignored files remained in the physical folder.

## Intentionally Not Changed

- No Backend mutation, persistence, storage, auth, tenancy, or production
  readiness behavior changed.
- No Core package, parser, runtime, renderer, or document package behavior
  changed.
- No WYSIWYG, free text input, command authoring readiness, or document editing
  behavior changed.
- No Project Control overview/history behavior changed.
- No Outline item semantics or selection handler behavior changed.
- No raw Inspector facts, Inspector actions, or canvas behavior were changed.
- No Editor, Backend, Core, FlowDoc, or frontend Node map truth was promoted.
- No broad accessibility or visual-regression readiness claim was made.

## RISK

- Backend `/health` still reports production blocked.
- Editor `npm install` in the lane still reported 5 high severity
  vulnerabilities.
- Vite still reports the existing chunk-size warning.
- Project Control baseline `npm run check` had one transient Vitest worker
  startup timeout before records were edited; the immediate rerun passed.
- The residual Editor worktree folder
  `.worktrees/editor-outline-scannability-foundation` could not be removed
  after git deregistered the worktree because ignored files remained in the
  physical folder; the merged branch was deleted.
- Previous residual Editor worktree folders
  `.worktrees/editor-inspector-detail-navigation-foundation` and
  `.worktrees/editor-selection-context-summary-foundation` remain local cleanup
  risks.
- This browser check proves the local-loopback minimal document Outline path;
  it is not a full cross-browser visual-regression suite.

## UNKNOWN

- Broad Editor readiness remains unknown.
- Broad FlowDoc product readiness remains unknown.
- Cross-browser Outline quality remains unknown.
- Mobile behavior remains intentionally unclaimed.
- Accessibility readiness and full visual regression readiness remain unknown.
- Whether deeper Outline grouping, history linkage, or Project Control-like
  overview diagrams are the right long-term navigation model remains a later
  frontend design question.

## Next Work

Continue Editor frontend work component-by-component. A useful next lane is to
separate the Outline into a stronger human-readable overview/history structure,
or to continue hardening the canvas and Inspector relationship before enabling
authoring controls.
