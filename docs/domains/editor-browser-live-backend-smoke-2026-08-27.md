# Editor Browser Live Backend Smoke - 2026-08-27

Status: bounded browser-app live Backend smoke complete; broader FlowDoc truth remains unpromoted.

Work path: `flowdoc-product-development-resumption > editor-browser-live-backend-smoke`

Owner repository: `repo-editor`

Evidence owner: `repo-project-control`

Evidence source repositories: `repo-backend`, `repo-core`

Active role: `product-implementation-agent`

Phase: `phase-editor-browser-live-backend-smoke`

Checklist: `checklist-editor-browser-live-backend-smoke`

Evidence target: `evidence-editor-browser-live-backend-smoke-2026-08-27`

## Scope

This lane adds an Editor-owned browser smoke for the rendered product routes
against a live loopback Backend server seeded from the Core minimal product
report fixture. It closes the UNKNOWN left by the prior Node loopback live
compatibility harness for one bounded browser-app path.

This packet does not promote FlowDoc, Core, Editor, Backend, document maps, or
production-readiness truth. Its Document and Evidence records intentionally use
empty `nodeIds` so the result remains work-scoped.

## Current Heads

| Repository | Commit | Role in this lane |
|---|---|---|
| Project Control | `f2ccbfbc87d5e9637e3d58277cbd6de564840f7a` | Intake Work/Phase/Checklist source before evidence registration. |
| Editor | `ad0dbf7b81f483cb73c19ed28c3fd8fcbd68c6e4` | Owner browser smoke implementation and verified main commit. |
| Backend | `42cc1040c959a16647b7e797929358c401ccfa38` | Unchanged live HTTP server, storage, migration, and mutation source. |
| Core | `77b9e181d1fb43bf69d725108ede664578a07a45` | Unchanged product-report minimal fixture and semantic contract source. |

## Browser Path Proven

Editor script `scripts/run-editor-browser-live-backend-smoke.mjs` and retained
fixture `src/fixtures/editor-browser-live-backend-smoke.v1.json` now prove one
browser-visible runtime path:

1. Start `createFlowDocBackendServer(...)` on a random loopback port.
2. Seed `createInMemoryPackageRepository(...)` with
   `product-report-vnext-minimal` from the Core-backed fixture.
3. Start the rendered Editor app with `VITE_FLOWDOC_BACKEND_URL` pointed at the
   live Backend server.
4. Launch headless Chrome through Chrome DevTools Protocol.
5. Open product route `/documents` and observe the library card loaded from
   Backend with `Migration required` and revision `3`.
6. Open `/documents/product-report-vnext-minimal/design` through the visible
   product UI and observe `Core: api r3`, `Versions: compatible`, and
   `Mode: active`.
7. Click `Upgrade` in the rendered toolbar and observe `Core: api r4` and
   `Mode: partial`.
8. Select `title`, click `Move selected node down`, and observe
   `Core: mutation-result r5`.
9. Retain final outline order:
   `summary-columns > title > detail-table`.

The retained fixture records Backend request paths and statuses for:

- `GET /documents?limit=24`
- `GET /capabilities/versions`
- `GET /documents/product-report-vnext-minimal`
- `OPTIONS` and `POST /documents/product-report-vnext-minimal/migrations/package-v3-document-v4`
- `OPTIONS` and `POST /documents/product-report-vnext-minimal/mutations`

All recorded Backend statuses were 200 or 204.

## TDD Record

Focused RED:

- `npx vitest run src/tests/editorBrowserLiveBackendSmokeEvidence.test.ts --reporter verbose`
  failed before implementation because
  `src/fixtures/editor-browser-live-backend-smoke.v1.json` did not exist.

Focused GREEN:

- `npm run evidence:editor-browser-live-backend-smoke` generated the retained
  browser evidence fixture and passed.
- `npx vitest run src/tests/editorBrowserLiveBackendSmokeEvidence.test.ts --reporter verbose`
  passed 1 test.

## Changes

Editor commit `ad0dbf7b81f483cb73c19ed28c3fd8fcbd68c6e4` changed:

- `package.json`
- `scripts/run-editor-browser-live-backend-smoke.mjs`
- `src/fixtures/editor-browser-live-backend-smoke.v1.json`
- `src/tests/editorBrowserLiveBackendSmokeEvidence.test.ts`

No Backend files, Core files, Project Control map truth files, or Editor
production runtime/UI modules were changed by the implementation commit.

## Verification

Editor worktree gate:

- Browser evidence script passed and generated the retained fixture.
- Focused retained evidence test passed 1 test.
- `npm run check`: type-check passed; 79 test files passed; 285 tests passed;
  Vite build passed.

Editor merged main gate:

- `FLOWDOC_EVIDENCE_WRITE=0 npm run evidence:editor-browser-live-backend-smoke`
  passed without rewriting the retained fixture.
- `npm run check`: type-check passed; 79 test files passed; 285 tests passed;
  Vite build passed.

Both Vite builds retained the existing chunk-size warning for large output
chunks. The warning did not fail the gate and was not remediated in this lane.

The browser fixture retained one non-blocking Chrome log entry for
`/favicon.ico` returning 404 from the Vite dev server. The fixture recorded no
`console.error` calls and no page exceptions.

## PASS

- The rendered Editor product routes can load the document library and design
  view from a live loopback Backend server in a real headless Chrome session.
- The browser-visible app path reaches the real Backend capability/read,
  migration, and mutation HTTP routes.
- The UI-driven migration reaches `Core: api r4` partial mode.
- The UI-driven reorder mutation reaches `Core: mutation-result r5` and updates
  the visible outline order.
- Backend and Core remained unchanged; the smoke consumes their existing
  boundaries.
- Project Control records this as bounded evidence with empty `nodeIds`.

## FAIL / BLOCKER

- No blocker remains for this browser smoke lane.

## RISK

- The smoke is local loopback headless Chrome evidence, not deployed Backend or
  hosted-product evidence.
- The smoke covers one fixture, one product route flow, one migration path, and
  one UI reorder mutation.
- The smoke is not cross-browser coverage.
- The smoke is not an accessibility audit or visual regression test.
- The script imports Backend source through Vite SSR for local evidence; Backend
  still does not publish a dedicated browser-smoke harness package surface.
- Editor `npm install` in the implementation worktree reported 5 high-severity
  npm audit findings; they were not investigated or fixed in this lane.
- Vite retained the existing chunk-size warning during build.

## UNKNOWN

- It remains unknown whether a deployed Backend and hosted Editor environment
  complete the same flow.
- It remains unknown whether the broader document corpus and every Backend
  mutation operation work through the same browser path.
- It remains unknown whether other browsers, assistive technology paths, and
  visual layout baselines pass equivalent gates.
- This lane does not prove broader product readiness beyond the cited browser
  smoke and Editor owner gates.

## Intentionally Not Changed

- No FlowDoc, Core, Editor, or Backend node truth state was promoted.
- No node `documentIds` or `evidenceIds` were updated from this packet.
- No Backend or Core implementation file was changed.
- No Editor production runtime/UI module was changed.
- No npm audit remediation, favicon asset addition, or bundle splitting was
  attempted.

## Next Recommended Direction

Use this packet as the narrow evidence base for the browser-app compatibility
claim. The next work should either promote only this bounded claim through the
proper map rules or open a separate deployed/cross-browser/broader-corpus lane
before making product-readiness claims.
