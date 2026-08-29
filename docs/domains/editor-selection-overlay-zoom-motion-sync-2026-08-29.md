# Editor Selection Overlay Zoom Motion Sync - 2026-08-29

Status: bounded Editor viewport-only selection overlay zoom motion bugfix
complete; broad Editor truth remains unpromoted.

## Scope

- Work path: `flowdoc-product-development-resumption > editor-selection-overlay-zoom-motion-sync`
- Owner repository: `repo-editor`
- Related repositories: `repo-project-control`, `repo-backend`, `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-selection-overlay-zoom-motion-sync`
- Checklist target: `checklist-editor-selection-overlay-zoom-motion-sync`
- Evidence target: `evidence-editor-selection-overlay-zoom-motion-sync-2026-08-29`

This record is work-scoped verification only. It does not promote broad Editor,
Backend, Core, FlowDoc, frontend Node, WYSIWYG, text input, authoring, or
production readiness.

## Terminology Boundary

- `selection overlay zoom motion sync` means the Editor browser-session
  selected-node outline tracks the selected paper block geometry while
  viewport-only zoom motion is still moving.
- `selection overlay` is the separate canvas outline around the selected paper
  block. It is presentation feedback only.
- These are context-only Editor presentation concepts. They are not document
  content, Backend document records, Core document package truth, durable
  mutations, or authoring readiness.

## PASS

Editor merge commit `a11db59634873d309a0fb469a6479a099705a28e` fixes the
visible selection overlay lag during smooth viewport zoom.

Before the fix, browser sampling during 85% to 95% zoom measured the selected
block moving while the canvas selection overlay stayed stale, with max
divergence about `60.47px`. After the fix, the main browser measurement for
the same 85% to 95% path measured max overlay delta `0.011px`.

The implementation keeps the previous zoom surface and anchor fix intact:

| Surface | Result |
| --- | --- |
| `selectionOverlay` scheduler | Runs 24 animation-frame syncs during zoom motion and keeps the existing 180ms settle sync. |
| `CanvasOverlayLayer` | Applies measured CSS variables directly to the mounted outline element before waiting for the next React render. |
| Selection state | Remains read-only presentation feedback. |
| Authoring | Remains limited; this does not enable WYSIWYG, text input, or mutations. |

## Verification

- Editor focused RED:
  `npx vitest run src/tests/selectionOverlay.test.ts --reporter verbose`
  failed because no animation-frame overlay sync was scheduled.
- Editor focused RED after tightening:
  `npx vitest run src/tests/selectionOverlay.test.ts --reporter verbose`
  failed because `applySelectionOverlayStyle` was not implemented or used by
  `CanvasOverlayLayer`.
- Editor focused GREEN:
  `npx vitest run src/tests/selectionOverlay.test.ts --reporter verbose`
  passed 1 file / 9 tests.
- Editor worktree gate: `npm run check` passed type-check, 88 test files, 305
  tests, and build.
- Worktree browser evidence at
  `http://127.0.0.1:4042/documents/product-report-vnext-minimal/design`
  confirmed 85% to 95% max overlay delta `0.014px`.
- Editor merged main gate: `npm run check` passed type-check, 88 test files,
  305 tests, and build.
- Main browser evidence at
  `http://127.0.0.1:4001/documents/product-report-vnext-minimal/design` with
  Backend on `http://127.0.0.1:4011` confirmed 85% to 95% max overlay delta
  `0.011px`.

## Intentionally Not Changed

- No Backend mutation, persistence, storage, auth, tenancy, or production
  readiness behavior changed.
- No Core package, parser, runtime, renderer, or document package behavior
  changed.
- No WYSIWYG, free text input, command authoring readiness, or document editing
  behavior changed.
- No Editor, Backend, Core, FlowDoc, or frontend Node map truth was promoted.
- No broad accessibility or visual-regression readiness claim was made.

## RISK

- Backend `/health` still reports production blocked.
- Editor `npm install` in the lane still reported 5 high severity
  vulnerabilities.
- Vite still reports the existing chunk-size warning.
- git deregistered the Editor worktree and deleted the merged branch, but the
  residual `.worktrees/editor-selection-overlay-zoom-motion-sync` folder could
  not be removed because local command policy blocked recursive deletion.
- The browser check proves the 85% to 95% local-loopback path and moving-frame
  overlay geometry; it is not a full cross-browser visual-regression suite.

## UNKNOWN

- Broad Editor readiness remains unknown.
- Broad FlowDoc product readiness remains unknown.
- Cross-browser zoom motion quality remains unknown.
- Mobile behavior remains intentionally unclaimed.
- Accessibility readiness and full visual regression readiness remain unknown.

## Next Work

Continue Editor frontend work component-by-component. The next visual polish
candidate should stay bounded the same way: define the UI term first, add
focused evidence, verify against the local loopback path, and avoid promoting
map truth from a bounded browser check.
