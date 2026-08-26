# Cross-Repository Compatibility Evidence - 2026-08-27

Status: bounded review complete; accepted cross-repository compatibility remains unpromoted.

Work path: `flowdoc-product-development-resumption > cross-repository-compatibility-evidence-review`

Owner repositories: `repo-project-control`, `repo-core`, `repo-editor`, `repo-backend`

Active role: `cross-repo-boundary-reviewer`

Phase: `phase-cross-repository-compatibility-evidence-review`

Checklist: `checklist-cross-repository-compatibility-evidence-review`

Evidence targets:

- `evidence-cross-repo-compatibility-core-gate-2026-08-27`
- `evidence-cross-repo-compatibility-editor-gate-2026-08-27`
- `evidence-cross-repo-compatibility-backend-gate-2026-08-27`

## Scope

This packet reviews the current local heads for Core, Editor, and Backend after
the Core public export boundary, Editor backend-unavailable honesty, and
Backend service-readiness boundary lanes. It classifies what the existing
evidence can safely support and what remains blocked or unknown.

This packet does not promote FlowDoc, Core, Editor, Backend, document maps, or
production readiness truth. Its document and evidence records intentionally use
empty `nodeIds` so the review stays work-scoped.

## Current Heads

| Repository | Commit | Fresh gate result |
|---|---|---|
| Project Control | `f86aa644ab3fba4428fd02ae575d78ae264e95dd` | Clean before this worktree. |
| Core | `969a21a4e888d836ae62164b206cb2dd34d5d702` | `npm run check` failed: 1 timeout in the default full test suite. |
| Editor | `3eb382b6c0c891481b1bada0827e0f92f21d18e2` | `npm run check` passed: 77 test files, 283 tests, build. |
| Backend | `42cc1040c959a16647b7e797929358c401ccfa38` | `npm run check` passed: 89 passed test files, 1 skipped file, 314 passed tests, 24 skipped tests, build. |

## Compatibility Paths Reviewed

Core publishes the relevant package/document version facts and operation APIs
through its root package export:

- `src/schema/versionCapability.ts`
- `src/index.ts`
- `runVNextOperation(...)`
- `runVNextDocumentV4Operation(...)`
- `runVNextTextBlockV4RichInlineReplace(...)`
- `planVNextPackageV2ToV3Migration(...)`
- `applyVNextPackageV2ToV3Migration(...)`

Backend consumes those public Core exports and wraps them in Backend-owned
contracts:

- `src/contracts/versionCapability.ts`
- `src/contracts/mutation.ts`
- `src/contracts/migration.ts`
- `src/http/server.ts`
- `src/service/mutationService.ts`
- `src/service/migrationService.ts`

Editor keeps production Core imports behind `src/core/coreAdapter.ts` and
consumes Backend through Editor-owned transport and runtime gates:

- `src/editor/backend/backendVersionCapability.ts`
- `src/editor/backend/backendTransport.ts`
- `src/editor/backend/backendMutationRequests.ts`
- `src/editor/backend/backendMigrationRequests.ts`
- `src/editor/runtime/runtimeBackendMutation.ts`
- `src/editor/runtime/runtimeBackendMigration.ts`

## PASS

- Editor and Backend both depend on the current local Core package through
  `file:../flowdoc-vnext-core`.
- Backend wraps `VNEXT_CORE_VERSION_CAPABILITY_CONTRACT` instead of duplicating
  Core version facts as a separate source of truth.
- Backend route and service tests cover `/capabilities/versions`, document
  reads, mutation routes, revision-stale handling, migration persistence,
  idempotency, and source snapshot retention.
- Editor tests cover Backend capability parsing, transport envelopes,
  mutation/migration request creation, stale apply gates, and runtime state
  replacement only after fresh Core-backed envelopes.
- Editor production source keeps direct `@flowdoc/vnext-core` imports behind
  `src/core/coreAdapter.ts`; tests enforce the boundary.

## FAIL / BLOCKER

- Core `npm run check` is not green on the current local Core head. Type-check
  passed, but the default full Vitest run failed with one timeout:
  `tests/textBlockUnifiedLayoutTextStyleSourceV1.test.ts > 5B-2 text/style Source path copy > commits exact Evidence-backed geometry 'insertion' through Plan A`.
- The default Core full-suite summary was 1 failed and 458 passed test files,
  1 failed and 2,940 passed tests, duration 227.23s.
- Because a default owner-repository gate failed, Project Control must not
  promote accepted cross-repository compatibility from this packet.

## RISK

- The failing Core geometry block passed when isolated, and the full
  `textBlockUnifiedLayoutTextStyleSourceV1.test.ts` file passed with 62 tests.
  That points to suite-load or timeout instability, but the default gate is
  still the governing signal for promotion.
- Existing Editor tests use mocked fetch/client boundaries. Existing Backend
  tests start the Backend server and exercise HTTP routes directly. These are
  useful contract tests, but they are not a single live runtime path.
- Previous evidence that recorded a green Core gate is stale for this current
  compatibility review because this review captured a fresh default-gate
  timeout on the current Core head.

## UNKNOWN

- No accepted single test currently starts `createFlowDocBackendServer(...)`,
  consumes it through Editor `createFlowDocBackendClient(...)`, and applies the
  Core-backed document read, migration, or mutation result into Editor runtime.
- It remains unknown whether the real browser app, real Backend server,
  current CORS behavior, current document fixtures, and current Core adapters
  complete the same flow without a mocked transport boundary.
- Root cause for the Core full-suite timeout is not proven beyond the observed
  pattern: default full suite failed, focused block passed, and isolated file
  passed.

## Intentionally Not Changed

- No Core, Editor, or Backend product files were changed in this review.
- No system map truth state was promoted.
- No Node `documentIds` or `evidenceIds` were updated from this packet.
- No Core timeout workaround was applied.
- No live end-to-end harness was added in this lane.

## Next Recommended Direction

1. Open a Core-owned gate-stability lane for
   `tests/textBlockUnifiedLayoutTextStyleSourceV1.test.ts` under the default
   `npm run check` command. The target is to make the owner repository gate
   deterministic before compatibility promotion.
2. After Core default gate is green, add one accepted live compatibility
   harness that starts the Backend HTTP server, uses the Editor backend client,
   reads `/capabilities/versions`, loads a document, performs an explicit
   migration, commits a mutation, and applies the resulting Core-backed
   envelope into Editor runtime.
3. Only after those owner gates pass should Project Control consider promoting
   a narrower product compatibility truth.
