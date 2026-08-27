# Backend Core Version Contract Consumer Hardening - 2026-08-27

## Scope

- Work path: `flowdoc-product-development-resumption > backend-core-version-contract-consumer-hardening`
- Owner repository: `repo-backend`
- Active role: `product-implementation-agent`
- Phase: `phase-backend-core-version-contract-consumer-hardening`
- Checklist: `checklist-backend-core-version-contract-consumer-hardening`
- Evidence target: `evidence-backend-core-version-contract-consumer-hardening-2026-08-27`

This record is work-scoped verification only. It does not promote Backend,
Core, Editor, or FlowDoc broad truth.

## PASS

Backend commit `6c3331217b509fc635ad25b71fba503ff066cd72` wraps the
Core-owned version capability and retirement-inventory contracts from
`@flowdoc/vnext-core`.

The Backend consumer inventory classifies the reviewed version facts:

| Surface | Classification | Result |
| --- | --- | --- |
| Core active package/document pair | imported | Read from `VNEXT_CORE_VERSION_CAPABILITY_CONTRACT.active`. |
| Core migration target pair | imported | Read from `VNEXT_CORE_VERSION_CAPABILITY_CONTRACT.migrationTarget`. |
| Backend capability envelope version pairs | wrapped | Exposed as Backend service capabilities without changing Core ownership. |
| Backend migration result target | wrapped | Reported through a Core-derived helper while Backend owns revisioned persistence. |
| Backend package repository version guards | retained | Kept as Backend persistence write-family guards. |
| Legacy copied capability test snapshots | deleted | Replaced with Core export/helper comparisons in focused tests. |
| Silent read compatibility adapter | blocked | Not added; explicit migration remains required. |

## Verification

- Baseline focused Backend suite: `npx vitest run --config vitest.config.ts src/tests/versionCapability.test.ts src/tests/migrationService.test.ts src/tests/httpServer.test.ts --reporter verbose` passed 3 files / 9 tests.
- RED: `npx vitest run --config vitest.config.ts src/tests/versionCapability.test.ts src/tests/migrationService.test.ts --reporter verbose` failed because `coreSurfaceRetirementInventory` was undefined and `createBackendCoreMigrationTargetPair` was not a function.
- Focused Backend suite after implementation: `npx vitest run --config vitest.config.ts src/tests/versionCapability.test.ts src/tests/migrationService.test.ts src/tests/migrationHttp.test.ts src/tests/httpServer.test.ts --reporter verbose` passed 4 files / 12 tests.
- Worktree verification note: the nested Backend worktree required restoring the expected sibling Core fixture path for tests that read `../flowdoc-vnext-core`; the failing PDF/local group then passed 4 files / 12 tests with 1 skipped test.
- Backend worktree gate: `npm run check` passed 89 files, 1 skipped file, 312 tests, 27 skipped tests, and build.
- Backend merged-main gate: `npm run check` passed 89 files, 1 skipped file, 315 tests, 24 skipped tests, and build.

## Intentionally Not Changed

- No Core version capability or retirement-inventory behavior changed.
- No Backend package parser acceptance changed.
- No Backend revision gate, idempotency, source snapshot, or persistence write
  behavior changed.
- No Editor behavior or browser compatibility claim changed.
- No Backend production readiness, auth, tenancy, storage provider, deployment,
  or FlowDoc map truth was promoted.

## RISK

- Backend readiness remains broader than this lane; service production blockers
  are unchanged.
- Editor compatibility still needs separate evidence against the updated
  capability envelope shape.
- Remaining version literals in Backend are retained persistence, fixture, or
  outcome checks; future work should reassess them only when changing
  persistence ownership or package family support.
- Backend worktree verification is sensitive to tests that assume Core is a
  sibling of the current working directory.

## UNKNOWN

- Broad Backend production readiness remains unknown.
- Broad FlowDoc compatibility remains unknown.
- Whether Editor currently consumes the new retirement-inventory wrapper remains
  unknown.
- Future policy for migration prompting or mandatory upgrade remains unknown.
