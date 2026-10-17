# Editor Creator Structure Add Affordance Foundation - 2026-08-29

Status: bounded Editor structure-panel affordance layer complete; broad Editor
truth remains unpromoted.

## Scope

- Work path: `flowdoc-product-development-resumption > editor-creator-structure-add-affordance-foundation`
- Owner repository: `repo-editor`
- Related repositories: `repo-project-control`, `repo-backend`, `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-creator-structure-add-affordance-foundation`
- Checklist target: `checklist-editor-creator-structure-add-affordance-foundation`
- Evidence target: `evidence-editor-creator-structure-add-affordance-foundation-2026-08-29`

This record is work-scoped verification only. It does not enable WYSIWYG, text
input, active add-block creation, Backend mutation, persistence behavior,
production Backend readiness, Core truth, broad Editor truth, accessibility
readiness, visual regression readiness, performance readiness, or FlowDoc
product readiness.

## Terminology Boundary

- `Structure panel` means the Editor left-panel surface that helps a creator
  scan document structure. In code it still uses the existing `OutlinePanel`
  component boundary.
- `Outline item` remains the canonical Editor UI row term from the FlowDoc
  product glossary.
- `Add block affordance` means the disabled plus controls that show future
  insertion placement in the Structure panel. It is not an active Core
  mutation, Backend route, document operation, or persistence claim.
- `Add node` is split for this lane. User-facing UI uses `Add block`; Core
  graph facts would be named `Core runtime node` only when the backing graph
  item is in scope.
- `Authoring limited` is a status cue for the current Editor draft surface. It
  does not prove authoring readiness.

## PASS

Editor merge commit `2538c2af02f2bda7aa6eafb8d621eec33bc28cc0` adds a bounded
creator Structure panel add-affordance foundation to the Editor.

The left panel now has:

| Surface | Observed value |
| --- | --- |
| Landmark | `Document structure` |
| Heading | `Structure` |
| Summary label | `Structure summary, 3 items, Text 1, Columns 1, Table 1` |
| Append affordance | Disabled `Add block at end unavailable until authoring is enabled` |
| Selected-row affordance | Disabled `Insert block after Columns unavailable until authoring is enabled` |
| Add state marker | `data-outline-add-state="disabled"` |
| Add placement markers | `append`, `after` |
| Large structure guard | A 1200-item synthetic outline renders one selected-row add affordance, not one per row |

The implementation preserves the existing selection path. Clicking a structure
row still calls the existing `onSelectNode` path. The add-block affordances are
disabled and do not call Backend, Core, command execution, document mutation,
or persistence behavior.

## Verification

- Editor worktree baseline: `npm run check` passed type-check, 90 test files,
  310 tests, and build before implementation. The build kept the existing Vite
  chunk-size warning.
- Editor focused RED:
  `npx vitest run src/tests/outlineScannability.test.ts --reporter verbose`
  first failed 4 tests because `OutlinePanel` did not render the Structure
  summary, add-block disabled state, large-outline item count marker, or
  bounded add source marker.
- Editor follow-up RED:
  `npx vitest run src/tests/outlineScannability.test.ts --reporter verbose`
  failed because the panel landmark still said `Document outline` instead of
  `Document structure`.
- Editor focused GREEN:
  `npx vitest run src/tests/outlineScannability.test.ts --reporter verbose`
  passed 1 file / 4 tests after implementation and the single-pass summary
  count refactor.
- Editor worktree gate: `npm run check` passed type-check, 90 test files, 312
  tests, and build.
- Worktree browser evidence:
  `FLOWDOC_EVIDENCE_WRITE=0 npm run evidence:editor-browser-live-backend-smoke`
  passed in live Backend mode and retained
  `editor-browser-live-backend-smoke-v1: summary-columns > title > detail-table`.
- Editor merged main gate: `npm run check` passed type-check, 90 test files,
  312 tests, and build.
- Main browser evidence:
  `FLOWDOC_EVIDENCE_WRITE=0 npm run evidence:editor-browser-live-backend-smoke`
  passed in live Backend mode and retained
  `editor-browser-live-backend-smoke-v1: summary-columns > title > detail-table`.
- Project Control baseline `npm run check` passed `check:data`, type-check, 57
  test files, 328 tests, build, and 6 e2e tests before records were edited.
- Project Control focused record tests:
  `npx vitest run tests/editor-creator-structure-add-affordance-foundation-lane.test.ts tests/project-roadmap-work-queue.test.ts tests/editor-outline-scannability-foundation-lane.test.ts --reporter verbose`
  passed 3 files / 4 tests after the new lane test and expected Work lists
  were added.
- Project Control record gate: `npm run check` passed `check:data`,
  type-check, 58 test files, 329 tests, build, and 6 e2e tests after records
  and tests were added.
- Editor branch cleanup succeeded after merge. `git worktree remove` deregistered
  the Editor worktree but could not remove the physical folder because the
  directory was not empty. A later verified recursive cleanup command was
  rejected by local command policy, so the residual physical folder remains.

## Intentionally Not Changed

- No active add-block command, menu, create flow, text input, or WYSIWYG
  behavior was enabled.
- No Backend mutation, persistence, storage, auth, tenancy, or production
  readiness behavior changed.
- No Core package, parser, runtime, renderer, mutation semantics, or document
  package behavior changed.
- No table row/cell tree, z-index/layers view, drag reorder, or canvas insertion
  handle was added.
- No Project Control overview/history behavior changed.
- No Editor, Backend, Core, FlowDoc, or frontend Node map truth was promoted.
- No broad accessibility, visual-regression, or performance readiness claim was
  made.

## RISK

- Real text-block typing performance remains untested because active text
  editing is not enabled in this lane.
- The large-structure guard is synthetic and checks rendering boundaries for
  the Structure panel. It does not prove real browser latency, virtualization
  readiness, or caret/IME behavior under heavy documents.
- The panel still renders all outline rows. Virtualization or windowing remains
  future work if real documents grow beyond what the current list can handle.
- Editor `npm install` in the lane still reported 5 high severity
  vulnerabilities.
- Vite still reports the existing chunk-size warning.
- The residual Editor worktree folder
  `.worktrees/editor-creator-structure-add-affordance-foundation` remains after
  git deregistration because local command policy rejected recursive cleanup.
- Previous residual Editor worktree folders
  `.worktrees/editor-inspector-detail-navigation-foundation`,
  `.worktrees/editor-outline-scannability-foundation`, and
  `.worktrees/editor-selection-context-summary-foundation` remain local cleanup
  risks.
- Browser smoke proves only the local-loopback minimal document path and the
  existing mutation smoke route. It is not a full cross-browser visual-regression
  suite.

## UNKNOWN

- Broad Editor readiness remains unknown.
- Broad FlowDoc product readiness remains unknown.
- Real large-document authoring performance remains unknown.
- Structure panel virtualization thresholds remain unknown.
- Cross-browser Structure panel quality remains unknown.
- Mobile behavior remains intentionally unclaimed.
- Accessibility readiness and full visual regression readiness remain unknown.
- The safe Backend/Core contract for active add-block creation remains a later
  product decision.

## Next Work

Before enabling active add-block creation, define the Backend/Core mutation
contract and keep the Editor button disabled until that path has evidence. A
useful next Editor lane is a read-only large-structure navigation/performance
slice: expand/collapse, selected-item reveal, and list windowing or
instrumentation without text editing.
