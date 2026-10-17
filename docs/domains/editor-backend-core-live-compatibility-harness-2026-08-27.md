# Editor Backend Core Live Compatibility Harness - 2026-08-27

Status: bounded live harness complete; broader FlowDoc truth remains unpromoted.

Work path: `flowdoc-product-development-resumption > editor-backend-core-live-compatibility-harness`

Owner repositories: `repo-editor`, `repo-project-control`

Evidence source repositories: `repo-backend`, `repo-core`

Active role: `product-implementation-agent`

Phase: `phase-editor-backend-core-live-compatibility-harness`

Checklist: `checklist-editor-backend-core-live-compatibility-harness`

Evidence target: `evidence-editor-backend-core-live-compatibility-harness-2026-08-27`

## Scope

This lane adds the first accepted live compatibility harness for the current
local FlowDoc Core, Editor, and Backend heads. The harness is Editor-owned and
proves the Node loopback path from real Editor client calls to a real Backend
HTTP server and Core-backed document semantics.

This packet does not promote FlowDoc, Core, Editor, Backend, document maps, or
production-readiness truth. Its Document and Evidence records intentionally use
empty `nodeIds` so the result remains work-scoped.

## Current Heads

| Repository | Commit | Role in this lane |
|---|---|---|
| Project Control | `bf987f72820d7a7eb8cfc0f84840808758cc201d` | Intake Work/Phase/Checklist source before evidence registration. |
| Editor | `16a8fde628b887624249d50a162241ef2d96a415` | Owner implementation and verified harness commit. |
| Backend | `42cc1040c959a16647b7e797929358c401ccfa38` | Unchanged live HTTP server, storage, migration, and mutation source. |
| Core | `77b9e181d1fb43bf69d725108ede664578a07a45` | Unchanged fixture and public semantic operation source. |

Editor setup commit `e93414e0246c2177c29d5c5b6215fa1f7afcf5c6`
added `.worktrees/` to Editor `.gitignore` before the implementation worktree
was created.

## Harness Path Proven

Editor test `src/tests/liveCompatibilityHarness.test.ts` now proves one live
runtime path:

1. Start `createFlowDocBackendServer(...)` on a random loopback port.
2. Seed `createInMemoryPackageRepository(...)` with
   `loadProductReportMinimalPackage()` from the Core-backed fixture.
3. Read `/capabilities/versions` through `createFlowDocBackendClient(...)` and
   verify the advertised active, migration, mutation, and source snapshot
   contract.
4. Read `product-report-vnext-minimal` through the real Editor Backend client.
5. Bind the returned transport envelope through
   `loadFrontendCoreWorkingSetFromTransportEnvelope(...)` and boot Editor
   runtime state.
6. Build an explicit Editor migration request with
   `createBackendMigrationRequest(...)`.
7. Post the migration to Backend, read the migrated target document, and apply
   it through `applyRuntimeBackendMigrationResult(...)`.
8. Build a v4 `node.reorder` mutation with
   `createBackendMutationRequestFromCommand(...)`, commit it to Backend, and
   apply the returned Core-backed mutation envelope through
   `applyRuntimeBackendMutationResult(...)`.

## TDD Record

Focused RED:

- `npx vitest run src/tests/liveCompatibilityHarness.test.ts --reporter verbose`
  failed before implementation because
  `flowdoc-vnext-backend/fixtures/productReportMinimal` could not resolve.

Focused GREEN:

- `npx vitest run src/tests/liveCompatibilityHarness.test.ts --reporter verbose`
  passed 1 test.

## Changes

Editor commit `16a8fde628b887624249d50a162241ef2d96a415` changed:

- `src/tests/liveCompatibilityHarness.test.ts`
- `tsconfig.json`
- `vite.config.ts`
- `vitest.config.ts`

The config changes are resolver hardening for local sibling repositories so the
same tests and build work from both the main checkout and a nested Editor
worktree.

No Backend files, Core files, Project Control map truth files, or Editor
production runtime modules were changed by the implementation commit.

## Verification

Editor worktree gate:

- Focused harness: 1 test passed.
- `npm run check`: type-check passed; 78 test files passed; 284 tests passed;
  Vite build passed.

Editor merged main gate:

- `npm run check`: type-check passed; 78 test files passed; 284 tests passed;
  Vite build passed.

Both Vite builds retained the existing chunk-size warning for large output
chunks. The warning did not fail the gate and was not remediated in this lane.

## PASS

- A single accepted test now spans the real Editor Backend client, real Backend
  HTTP server, Core-backed fixture read, explicit migration, v4 mutation, and
  Editor runtime apply gates.
- Editor production runtime behavior remains unchanged.
- Backend continues to own HTTP, persistence, migration, and mutation service
  behavior.
- Core continues to own fixture parsing, migration semantics, and mutation
  semantics through public contracts.
- Project Control records this as bounded evidence with empty `nodeIds`.

## FAIL / BLOCKER

- No blocker remains for this live harness lane.

## RISK

- The harness is a Node loopback test, not a browser-app end-to-end test.
- The harness covers one fixture and one v4 `node.reorder` mutation after
  migration; it does not cover the broader document corpus or every operation.
- Editor test wiring imports Backend source subpaths through local sibling
  resolver aliases because Backend does not yet publish a dedicated test harness
  package surface.
- Editor `npm install` in the implementation worktree reported 5 high-severity
  npm audit findings; they were not investigated or fixed in this lane.
- Vite retained the existing chunk-size warning during build.

## UNKNOWN

- It remains unknown whether the full browser app, live CORS behavior in a real
  browser session, and deployed Backend environment complete the same flow.
- It remains unknown whether all FlowDoc package/document variants and all
  Backend mutation operations are covered by equivalent live harnesses.
- This lane does not prove broader product readiness beyond the cited harness
  and Editor owner gates.

## Intentionally Not Changed

- No FlowDoc, Core, Editor, or Backend node truth state was promoted.
- No node `documentIds` or `evidenceIds` were updated from this packet.
- No Backend or Core implementation file was changed.
- No Editor browser UI behavior was changed.
- No npm audit remediation or bundle splitting was attempted.

## Next Recommended Direction

Use this packet as the narrow evidence base for the next compatibility decision.
The next work should either promote only this bounded harness claim or open a
separate browser-app smoke lane that exercises the same path from the rendered
Editor app against a live Backend server.
