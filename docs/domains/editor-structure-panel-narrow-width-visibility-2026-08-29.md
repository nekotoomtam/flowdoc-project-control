# Editor Structure Panel Narrow Width Visibility - 2026-08-29

Status: bounded Editor layout bugfix complete; broad Editor truth remains
unpromoted.

## Scope

- Work path: `flowdoc-product-development-resumption > editor-structure-panel-narrow-width-visibility`
- Owner repository: `repo-editor`
- Related repositories: `repo-project-control`, `repo-backend`, `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-structure-panel-narrow-width-visibility`
- Checklist target: `checklist-editor-structure-panel-narrow-width-visibility`
- Evidence target: `evidence-editor-structure-panel-narrow-width-visibility-2026-08-29`

This record is work-scoped verification only. It does not enable WYSIWYG, text
input, active add-block creation, Backend mutation, persistence behavior,
production Backend readiness, Core truth, broad Editor truth, accessibility
readiness, full visual regression readiness, mobile readiness, performance
readiness, or FlowDoc product readiness.

## Terminology Boundary

- `Structure panel` means the Editor left-panel surface that helps a creator
  scan document structure. In code it still uses the existing `OutlinePanel`
  component boundary.
- `Outline item` remains the canonical Editor UI row term from the FlowDoc
  product glossary.
- `narrow desktop` means the Editor browser session is still a desktop
  workflow, but the available viewport is around the reported 704px test case.
  Mobile behavior remains intentionally unclaimed.
- `right detail panel` means the Editor inspector/detail surface. It remains
  secondary at the narrow desktop breakpoint and is not removed from wider
  desktop layout.

## Root Cause

The left Structure panel was not missing from the Editor draft data. Browser
evidence showed the `.outline-panel` element existed, but the max-width 980px
CSS rule set `display: none` on both `.outline-panel` and
`.editor-side-panel`. At the reproduced 704x880 viewport, the workspace became
one 704px canvas column and the Structure panel computed width was 0.

## PASS

Editor merge commit `2b711c87e4bb036fa2c172550093dbd4fddc91ac` changes the
Editor design workspace breakpoint so the left Structure panel remains visible
beside the canvas at narrow desktop width.

The <=980px workspace behavior is now:

| Surface | Observed value |
| --- | --- |
| Structure panel display | `grid` |
| Structure panel width at 704px | `280px` |
| Workspace columns at 704px | `workspaceGridColumns 280px 424px` |
| Right detail panel display | `none` |
| Browser console errors | `0` |

The implementation preserves the existing wider desktop three-column layout
and does not add authoring, text input, Backend mutation, Core mutation,
document persistence, or active add-block behavior.

## Verification

- Editor pre-fix browser evidence:
  `http://127.0.0.1:4001/documents/reorder-blocked-target-qa/design` at
  viewport 704x880 showed `.outline-panel` existed but computed
  `outlineDisplay` was `none`, Structure panel width was `0`,
  `workspaceGridColumns` was `704px`, and console error count was `0`.
- Editor focused RED:
  `npx vitest run src/tests/workspaceFrame.test.ts --reporter verbose` failed
  because the max-width 980px media rule still hid `.outline-panel`.
- Editor focused GREEN:
  `npx vitest run src/tests/workspaceFrame.test.ts --reporter verbose` passed 1
  file / 2 tests after the CSS fix.
- Worktree browser evidence:
  live Backend mode at
  `http://127.0.0.1:57257/documents/reorder-blocked-target-qa/design` with
  Backend `http://127.0.0.1:57256` and viewport 704x880 reported
  `outlineDisplay grid`, Structure panel width `280`, `sideDisplay none`,
  `workspaceGridColumns 280px 424px`, and 0 console errors.
- Editor worktree gate: `npm run check` passed type-check, 90 test files, 313
  tests, and build.
- Editor merged main gate: `npm run check` passed type-check, 90 test files,
  313 tests, and build.
- Main browser evidence:
  live Backend mode at
  `http://127.0.0.1:58516/documents/reorder-blocked-target-qa/design` with
  Backend `http://127.0.0.1:58515` and viewport 704x880 reported
  `outlineDisplay grid`, Structure panel width `280`, `sideDisplay none`,
  `workspaceGridColumns 280px 424px`, and 0 console errors.
- Project Control baseline `npm run check` passed `check:data`, type-check, 58
  test files, 329 tests, build, and 6 e2e tests before records were edited.
- Project Control focused record tests:
  `npx vitest run tests/editor-structure-panel-narrow-width-visibility-lane.test.ts tests/project-roadmap-work-queue.test.ts --reporter verbose`
  passed 2 files / 3 tests after the new lane test and expected Work lists
  were added.
- Project Control record gate first stopped with `PROJECT_INDEX_STALE`; after
  `npm run generate`, the next gate reached tests and failed 14 existing Editor
  lane tests because their exact `editor.workIds` lists did not yet include
  `editor-structure-panel-narrow-width-visibility`.
- Project Control focused lane verification:
  `npx vitest run tests/editor-structure-panel-narrow-width-visibility-lane.test.ts tests/editor-creator-structure-add-affordance-foundation-lane.test.ts tests/project-roadmap-work-queue.test.ts --reporter verbose`
  passed 3 files / 4 tests after only those expected lists were updated.
- Project Control record gate: `npm run check` passed `check:data`,
  type-check, 59 test files, 330 tests, build, and 6 e2e tests after records
  and tests were added.
- Editor branch cleanup succeeded after merge. `git worktree remove`
  deregistered the Editor worktree but could not remove the physical folder
  because the directory was not empty. A later verified recursive cleanup
  command was rejected by local command policy, so the residual physical folder
  remains.

## Intentionally Not Changed

- No active add-block command, menu, create flow, text input, or WYSIWYG
  behavior was enabled.
- No Backend mutation, persistence, storage, auth, tenancy, or production
  readiness behavior changed.
- No Core package, parser, runtime, renderer, mutation semantics, or document
  package behavior changed.
- No Project Control overview/history behavior changed.
- No Editor, Backend, Core, FlowDoc, or frontend Node map truth was promoted.
- No broad accessibility, visual-regression, or performance readiness claim was
  made.

## RISK

- The bugfix is checked in Chromium local loopback only, not a full
  cross-browser visual-regression suite.
- Mobile behavior remains intentionally unclaimed.
- The right detail panel remains hidden at the <=980px breakpoint. A later
  design lane should add explicit panel controls if creators need detail access
  without widening the window.
- Editor `npm install` in the lane still reported 5 high severity
  vulnerabilities.
- Vite still reports the existing chunk-size warning.
- The residual Editor worktree folder
  `.worktrees/editor-structure-panel-narrow-width-visibility` remains after git
  deregistration because local command policy rejected recursive cleanup.
- Previous residual Editor worktree folders
  `.worktrees/editor-creator-structure-add-affordance-foundation`,
  `.worktrees/editor-inspector-detail-navigation-foundation`,
  `.worktrees/editor-outline-scannability-foundation`, and
  `.worktrees/editor-selection-context-summary-foundation` remain local cleanup
  risks.

## UNKNOWN

- Broad Editor readiness remains unknown.
- Broad FlowDoc product readiness remains unknown.
- Real large-document authoring performance remains unknown.
- Cross-browser Structure panel quality remains unknown.
- Mobile behavior remains intentionally unclaimed.
- Accessibility readiness and full visual regression readiness remain unknown.
- The final design for explicit left/right panel controls remains a later UI
  decision.

## Next Work

A useful next Editor lane is explicit panel control: keep the Structure panel
as the primary left overview, make the right detail panel intentionally
openable/collapsible, and verify the behavior at the desktop widths used by the
in-app browser.
