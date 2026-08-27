# Core Runtime Version Contract Hardening - 2026-08-27

## Scope

- Work path: `flowdoc-product-development-resumption > core-runtime-version-contract-hardening`
- Owner repository: `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-core-runtime-version-contract-hardening`
- Checklist: `checklist-core-runtime-version-contract-hardening`
- Evidence target: `evidence-core-runtime-version-contract-hardening-2026-08-27`

This record is work-scoped verification only. It does not promote Core,
Backend, or FlowDoc broad truth.

## PASS

Core commit `992dbbbd6b6ac8f921d3dd98bd3515b77728868f` adds
`VNEXT_CORE_VERSION_SURFACE_RETIREMENT_INVENTORY` beside the existing version
capability contract.

The inventory classifies reviewed version surfaces before Backend hardening:

| Surface | Classification | Result |
| --- | --- | --- |
| package v2/document v3 active runtime | active-runtime | Kept as canonical persisted input and runtime authority. |
| package v3/document v4 target parser and read-only runtime | retained-for-migration | Kept for explicit migration target validation and read-only inspection. |
| package v2-to-v3 explicit copy-forward planner | retained-for-migration | Kept as Core-owned pure semantic planning; Backend owns revisioned persistence. |
| Phase 258 consumer evidence | retained-for-evidence | Kept as historical cross-repo capability evidence without v4 runtime activation. |
| silent read normalization or compatibility adapter | blocked | Remains prohibited by Core workspace and migration gates. |

No version surface was deleted in this lane because no reviewed surface was
proven unused in scope.

## Verification

- RED: `npx vitest run --config vitest.config.ts tests/versionCapability.test.ts --reporter verbose` failed because the inventory export and documentation section were missing.
- Focused Core suite: `npx vitest run --config vitest.config.ts tests/versionCapability.test.ts tests/packageV2ToV3Migration.test.ts tests/packageV3.test.ts --reporter verbose` passed 3 files / 24 tests.
- Core docs: `npm run docs:check` passed.
- Core worktree gate: `npm run check` passed 459 files / 2,942 tests in 250.00s.
- Core merged-main gate: `npm run check` passed 459 files / 2,942 tests in 263.94s.

## Intentionally Not Changed

- No package parser acceptance changed.
- No active runtime/session behavior changed.
- No migration executor behavior changed.
- No Backend route, persistence, or HTTP behavior changed.
- No Core, Backend, or FlowDoc Node truth was promoted.

## RISK

- Backend and Editor can still drift if they copy capability facts instead of
  comparing with Core.
- Future version work must update the inventory whenever a version surface is
  deleted, retained, or blocked.

## UNKNOWN

- Broad Core readiness remains unknown.
- Backend production readiness remains unknown.
- Future policy for when workspaces should be offered or required to migrate
  remains unknown.
