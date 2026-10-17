# Editor Browser Live Backend Corpus Smoke - 2026-08-27

Status: bounded local loopback corpus smoke complete; product readiness remains unpromoted.

Work path: `flowdoc-product-development-resumption > editor-browser-live-backend-corpus-smoke`

Owner repository: `repo-editor`

Evidence sources: `repo-backend`, `repo-core`, `repo-project-control`

Active role: `product-implementation-agent`

Phase: `phase-editor-browser-live-backend-corpus-smoke`

Checklist: `checklist-editor-browser-live-backend-corpus-smoke`

Evidence target: `evidence-editor-browser-live-backend-corpus-smoke-2026-08-27`

## Supported Claim

Editor commit `5cdd092265eb036be56a2d8f06e3987d0b6199d6` adds a retained
browser/live Backend corpus smoke for the default loopback Backend corpus. The
runner starts a live Backend server in process, seeds the same four documents as
Backend `src/server.ts`, starts the rendered Editor app with
`VITE_FLOWDOC_BACKEND_URL`, launches headless Chrome through CDP, opens the
library route, visits each design route, and clicks `Upgrade` through the UI for
each document.

This supports only default local loopback corpus compatibility for the
browser-visible library/design/migration path. It does not establish deployed
Backend compatibility, non-default or broad production corpus coverage,
cross-browser readiness, accessibility, visual regression, npm audit
remediation, bundle-size readiness, or product readiness.

## Documents Covered

| Document | Library revision | Migrated revision | Route |
| --- | ---: | ---: | --- |
| `reorder-blocked-target-qa` | 3 | 4 | `/documents/reorder-blocked-target-qa/design` |
| `product-report-vnext-baseline` | 1 | 2 | `/documents/product-report-vnext-baseline/design` |
| `product-report-vnext` | 3 | 4 | `/documents/product-report-vnext/design` |
| `product-report-vnext-minimal` | 3 | 4 | `/documents/product-report-vnext-minimal/design` |

The retained fixture records the library page exposing exactly these four
documents as `Migration required`, the initial compatible active API state for
each design route, and the migrated compatible partial API state after UI
upgrade.

## Verification

- Editor RED: `npx vitest run src/tests/editorBrowserLiveBackendCorpusSmokeEvidence.test.ts --reporter verbose` failed before implementation with `ENOENT` because `src/fixtures/editor-browser-live-backend-corpus-smoke.v1.json` did not exist.
- Editor worktree: `npm run evidence:editor-browser-live-backend-corpus-smoke` generated the retained fixture and reported `reorder-blocked-target-qa r3->r4, product-report-vnext-baseline r1->r2, product-report-vnext r3->r4, product-report-vnext-minimal r3->r4`.
- Editor worktree: `FLOWDOC_EVIDENCE_WRITE=0 npm run evidence:editor-browser-live-backend-corpus-smoke` passed without rewriting the fixture.
- Editor worktree: `npx vitest run src/tests/editorBrowserLiveBackendCorpusSmokeEvidence.test.ts --reporter verbose` passed 1 test.
- Editor worktree: `npm run check` passed type-check, 80 test files, 286 tests, and build; the existing Vite chunk-size warning remained.
- Editor main: `FLOWDOC_EVIDENCE_WRITE=0 npm run evidence:editor-browser-live-backend-corpus-smoke` passed with the same four migrations.
- Editor main: `npx vitest run src/tests/editorBrowserLiveBackendCorpusSmokeEvidence.test.ts --reporter verbose` passed 1 test.
- Editor main: `npm run check` passed type-check, 80 test files, 286 tests, and build; the existing Vite chunk-size warning remained.

## Files Added In Editor

- `package.json`
- `scripts/run-editor-browser-live-backend-corpus-smoke.mjs`
- `src/fixtures/editor-browser-live-backend-corpus-smoke.v1.json`
- `src/tests/editorBrowserLiveBackendCorpusSmokeEvidence.test.ts`

## Risks

- This is still local loopback evidence, not hosted/deployed parity.
- This covers the four default Backend seed documents only; non-default,
  imported, persisted, tenant-owned, or larger production corpora remain
  unknown.
- It uses headless Chrome only and does not establish Firefox, Safari, Edge,
  mobile, or assistive technology behavior.
- It verifies library, design route load, and migration through UI for all four
  default seeds, but it does not add per-document UI mutation coverage beyond
  the earlier product-report minimal mutation smoke.
- The Editor install still reports the existing five high-severity npm audit
  findings.
- The Editor build still reports the existing Vite chunk-size warning.
- Browser log retains the non-blocking Vite favicon 404 observed in the fixture.

## Unknowns Kept Unpromoted

- Deployed Backend and hosted Editor compatibility.
- Cross-browser and mobile browser behavior.
- Accessibility and visual-regression readiness.
- Non-default or production corpus coverage.
- Auth, tenancy, durable storage, rate limits, telemetry, backup, and rollback.
- Product readiness for FlowDoc, Editor, Backend, or Core as parent systems.

## Handoff

Use this packet to expand the bounded `FlowDoc Browser Backend Compatibility`
child node only for the default local loopback Backend corpus
library/design/migration path. Do not promote parent FlowDoc truth or broad
Editor, Backend, or Core runtime state from this evidence.
