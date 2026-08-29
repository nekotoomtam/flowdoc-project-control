# Editor Paper Smooth Zoom Anchor Fix - 2026-08-29

Status: bounded Editor viewport-only zoom timing bugfix complete; broad Editor
truth remains unpromoted.

## Scope

- Work path: `flowdoc-product-development-resumption > editor-paper-smooth-zoom-anchor-fix`
- Owner repository: `repo-editor`
- Related repositories: `repo-project-control`, `repo-backend`, `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-paper-smooth-zoom-anchor-fix`
- Checklist target: `checklist-editor-paper-smooth-zoom-anchor-fix`
- Evidence target: `evidence-editor-paper-smooth-zoom-anchor-fix-2026-08-29`

This record is work-scoped verification only. It does not promote broad Editor,
Backend, Core, FlowDoc, frontend Node, WYSIWYG, text input, authoring, or
production readiness.

## Terminology Boundary

- `zoom anchor` means the apparent stationary expansion point of the Editor
  browser-session paper viewport while viewport-only zoom changes.
- `synchronized zoom footprint` means the paper shell and page stack
  presentation footprint changing with the same 0.16s/ease timing as the paper
  transform.
- These are Editor presentation concepts only. They are not document content,
  Backend document records, Core document package truth, durable mutations, or
  authoring readiness.

## PASS

Editor merge commit `7a2a62579a02074e7fdf391f4c56a558740dfbf0` fixes the
visible smooth zoom anchor lag from the previous paper zoom surface.

The implementation keeps the original viewport-only zoom controls and adds the
missing footprint motion contract:

| Surface | Result |
| --- | --- |
| `PaperPage` shell | Adds `data-zoom-motion="smooth"` beside the existing viewport-only marker. |
| `PaperPageStack` | Adds `data-zoom-motion="smooth"` so page stack footprint changes are part of zoom motion. |
| `editor.css` shell footprint | Transitions shell width/height for `0.16s/ease`. |
| `editor.css` stack footprint | Transitions stack gap/min-height for `0.16s/ease`. |
| Reduced motion | Disables paper, shell, and stack smooth zoom motion together. |
| Authoring | Remains limited; this does not enable WYSIWYG, text input, or mutations. |

## Verification

- Baseline Project Control check in the fresh worktree hit a Vitest worker
  startup timeout before this record was added; rerunning unit tests with
  `--maxWorkers=1` passed 52 files / 323 tests.
- Editor focused RED:
  `npx vitest run src/tests/paperSmoothZoomSurface.test.ts --reporter verbose`
  failed because the paper stack and shell did not yet expose synchronized zoom
  motion.
- Editor focused GREEN:
  `npx vitest run src/tests/paperSmoothZoomSurface.test.ts --reporter verbose`
  passed 1 file / 3 tests.
- Editor worktree gate: `npm run check` passed type-check, 88 test files, 303
  tests, and build.
- Editor merged main gate: `npm run check` passed type-check, 88 test files,
  303 tests, and build.
- Main browser evidence at
  `http://127.0.0.1:4001/documents/product-report-vnext-minimal/design` with
  Backend on `http://127.0.0.1:4011` confirmed 85% to 95%, shell width/height
  transition `0.16s/ease`, stack gap/min-height transition `0.16s/ease`, paper
  transform/box-shadow transition `0.16s/ease`, shell/paper `footprintDelta 0`,
  4 authoring controls still disabled, and 0 console errors.

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
- Editor `npm install` still reports 5 high severity vulnerabilities.
- Vite still reports the existing chunk-size warning.
- Project Control default `npm run check` baseline hit a Vitest worker startup
  timeout in the fresh worktree; worker-limited unit verification passed.
- The browser check proves the settled 85% to 95% local-loopback path and CSS
  motion contract, not cross-browser animation perception.

## UNKNOWN

- Broad Editor readiness remains unknown.
- Broad FlowDoc product readiness remains unknown.
- Cross-browser zoom motion quality remains unknown.
- Mobile behavior remains intentionally unclaimed.
- Accessibility readiness and full visual regression readiness remain unknown.

## Next Work

Continue Editor frontend work component-by-component. The next visual polish
candidate is interaction perception around the paper workspace, but any next
lane should keep the same rule: define the UI term first, add focused evidence,
and avoid promoting map truth from a bounded local-loopback check.
