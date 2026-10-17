# Editor Inspector Detail Navigation Foundation - 2026-08-29

Status: bounded Editor Inspector Details layer complete; broad Editor truth
remains unpromoted.

## Scope

- Work path: `flowdoc-product-development-resumption > editor-inspector-detail-navigation-foundation`
- Owner repository: `repo-editor`
- Related repositories: `repo-project-control`, `repo-backend`, `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-inspector-detail-navigation-foundation`
- Checklist target: `checklist-editor-inspector-detail-navigation-foundation`
- Evidence target: `evidence-editor-inspector-detail-navigation-foundation-2026-08-29`

This record is work-scoped verification only. It does not enable WYSIWYG, text
input, authoring, Backend mutation, persistence behavior, production Backend
readiness, Core truth, broad Editor truth, or FlowDoc product readiness.

## Terminology Boundary

- `Inspector Details layer` means the Editor Inspector presentation disclosure
  that keeps existing raw Inspector facts available behind a `Details` summary
  after the selected-block summary and node actions.
- It is derived from the Editor browser session's Inspector facts for an
  `Editor draft` selection. It is not a Backend document record, durable
  storage truth, Core document package truth, a mutation result, Project
  Control Node truth, or the Project Control `Full Detail Modal`.
- The word `Details` in this lane is context-only for the Editor Inspector UI.
  It should not become a schema, API, evidence ID family, or readiness claim
  without a later terminology decision.

## PASS

Editor merge commit `6ae950600949ec5c868b86cd0db140c9a9bb5780` adds a bounded
Inspector Details layer to the Editor.

The Inspector now keeps the first-read layer focused on the selected-block
summary and node actions. Raw facts remain available but start collapsed:

| State | Observed value |
| --- | --- |
| Summary selection | `Product Report for Customer` |
| Source | `Source: Backend read` |
| Authoring | `Authoring: limited` |
| Initial Details state | closed |
| Initial facts hidden state | `factsHidden: true` |
| Initial facts display | `display: none` |
| Initial facts rects | `0` |
| Expanded facts display | `grid` |
| Expanded Node row | `Node = title` |
| Expanded raw fact rows | `14` |
| Selection change to Columns | Details reset closed |
| Browser error logs | `0` |

The implementation preserves the existing Duplicate, Delete, Move Up, and Move
Down actions. It also preserves the existing raw facts; it only changes their
first-read presentation from always-open to collapsed-on-demand.

## Verification

- Editor baseline in the worktree: `npm run check` passed type-check, 89 test
  files, 307 tests, and build.
- Editor focused RED:
  `npx vitest run src/tests/selectionContextSummary.test.ts --reporter verbose`
  failed because the Inspector did not render an `inspector-details-layer` after
  node actions.
- Editor focused GREEN after the initial disclosure implementation:
  `npx vitest run src/tests/selectionContextSummary.test.ts --reporter verbose`
  passed 1 file / 3 tests.
- Worktree browser review found that the facts list still had rendered space
  while Details was closed because the existing `.facts-list` `display: grid`
  rule overrode the default hidden behavior.
- Editor focused RED after browser review:
  `npx vitest run src/tests/selectionContextSummary.test.ts --reporter verbose`
  failed because the facts list lacked `hidden` state.
- Editor focused RED after the hidden-state implementation:
  `npx vitest run src/tests/selectionContextSummary.test.ts --reporter verbose`
  failed because `editor.css` did not include
  `.inspector-details-layer .facts-list[hidden]`.
- Editor focused GREEN:
  `npx vitest run src/tests/selectionContextSummary.test.ts --reporter verbose`
  passed 1 file / 3 tests.
- Editor worktree gate: `npm run check` passed type-check, 89 test files, 308
  tests, and build.
- Worktree browser evidence in live Backend mode at
  `http://127.0.0.1:54551/documents/product-report-vnext-minimal/design` with
  Backend on `http://127.0.0.1:54550` confirmed `Source: Backend read`,
  `Authoring: limited`, collapsed Details with `factsHidden: true`,
  `factsDisplay: none`, `factsRects: 0`, expanded Details with `Node = title`
  and 14 raw fact rows, and Details reset closed after selecting Columns.
- Editor merged main gate: `npm run check` passed type-check, 89 test files,
  308 tests, and build.
- Main browser evidence at
  `http://127.0.0.1:60029/documents/product-report-vnext-minimal/design` with
  Backend on `http://127.0.0.1:60028` confirmed the same collapsed, expanded,
  and selection-change reset behavior, plus 0 browser error logs.
- git deregistered the Editor worktree and branch deletion succeeded, but the
  residual `.worktrees/editor-inspector-detail-navigation-foundation` folder
  could not be removed because local command policy blocked recursive
  `Remove-Item -Recurse`.

## Intentionally Not Changed

- No Backend mutation, persistence, storage, auth, tenancy, or production
  readiness behavior changed.
- No Core package, parser, runtime, renderer, or document package behavior
  changed.
- No WYSIWYG, free text input, command authoring readiness, or document editing
  behavior changed.
- No Inspector action semantics were changed; Duplicate, Delete, Move Up, and
  Move Down still use the existing InspectorPanel behavior.
- No raw Inspector facts were removed.
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
  `.worktrees/editor-inspector-detail-navigation-foundation` could not be
  removed because local command policy blocked recursive `Remove-Item -Recurse`;
  git no longer reports it as a worktree and the merged branch was deleted.
- The previous residual Editor worktree folder
  `.worktrees/editor-selection-context-summary-foundation` remains a local
  cleanup risk from the prior lane.
- This browser check proves the local-loopback title and Columns Inspector
  Details path; it is not a full cross-browser visual-regression suite.

## UNKNOWN

- Broad Editor readiness remains unknown.
- Broad FlowDoc product readiness remains unknown.
- Cross-browser Inspector Details quality remains unknown.
- Mobile behavior remains intentionally unclaimed.
- Accessibility readiness and full visual regression readiness remain unknown.

## Next Work

Continue Editor frontend work component-by-component. A useful next lane is to
make the Outline itself more scannable by grouping or compressing structure rows
without changing document semantics, or to continue the Inspector side by
separating action affordances from future editable authoring controls.
