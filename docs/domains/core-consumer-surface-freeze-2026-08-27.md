# Core Consumer Surface Freeze - 2026-08-27

## Scope

- Work path: `flowdoc-product-development-resumption > core-consumer-surface-freeze`
- Owner repository: `repo-core`
- Related repository: `repo-project-control`
- Active role: `cross-repo-boundary-reviewer`
- Phase: `phase-core-consumer-surface-freeze`
- Checklist: `checklist-core-consumer-surface-freeze`
- Evidence target: `evidence-core-consumer-surface-freeze-2026-08-27`

This record is work-scoped verification only. It does not promote broad Core
truth, FlowDoc truth, production Backend readiness, Editor readiness, frontend
implementation readiness, or deployed compatibility.

## PASS

Core commit `5892df6e542a02b25ae3b18ee02a55842b83d48f` adds
`VNEXT_CORE_CONSUMER_SURFACE_FREEZE` in
`src/schema/consumerSurface.ts` and exports it through the existing package
root.

The freeze classifies current and future consumer boundaries:

| Area | Classification | Result |
| --- | --- | --- |
| `@flowdoc/vnext-core` root import | supported-current-private-root | Kept stable during private transition because Backend still has broad direct root imports and Editor tests still import selected root symbols. |
| `@flowdoc/vnext-core/fixtures/*` | supported-fixture | Kept for bounded local Backend and Editor evidence. |
| schema, operations, runtime, generation, composition, pagination, renderer, table, toc, authoring subpath groups | planned-not-exported | Named as candidate groups only; `package.json` exports did not change. |
| Document package v2/v3 | supported-consumer | Kept as the canonical persisted Core document package input. |
| version capability contract | supported-consumer | Kept so consumers can inspect package/document version facts without parser probing. |
| explicit v2-to-v3 migration plan | retained-for-migration | Kept as Core-owned semantic planning; Backend owns revisioned persistence and Editor owns user-facing migration intent. |
| broad root entrypoint | retained-for-transition | Kept as private transition evidence, not a release API. |
| direct `src/**` imports | blocked | Consumers must use exported package paths. |
| Backend transport, storage, revision, service readiness, auth, tenancy, deployment, telemetry, backup, rollback | blocked as Core surfaces | These remain Backend-owned. |
| Editor draft, Preview, Outline item, browser state, React state, DOM state, UI workflows | blocked as Core surfaces | These remain Editor-owned. |
| silent compatibility adapters | blocked | Migration remains explicit; no silent read normalization is authorized. |

Future frontend redesign work must consume Backend document records or an
Editor-owned adapter boundary until a separate package boundary and adoption
evidence approve direct Core imports.

## Verification

- RED: `npx vitest run --config vitest.config.ts tests/consumerSurface.test.ts`
  failed with 3 failed tests because
  `VNEXT_CORE_CONSUMER_SURFACE_FREEZE_VERSION`,
  `VNEXT_CORE_CONSUMER_SURFACE_FREEZE`, and
  `docs/CORE_CONSUMER_SURFACE_FREEZE.md` were missing.
- Focused Core suite:
  `npx vitest run --config vitest.config.ts tests/consumerSurface.test.ts tests/corePublicExportBoundaryReview.test.ts`
  passed 2 files / 6 tests.
- Core docs: `npm run docs:check` passed.
- Core type-check: `npm run type-check` passed.
- Core worktree gate: `npm run check` passed 460 files / 2945 tests.
- Core merged main commit verification: a clean detached worktree at
  `5892df6e542a02b25ae3b18ee02a55842b83d48f` passed `npm run check` with
  460 files / 2945 tests.

Core `npm ci` reported 2 high severity vulnerabilities. They were not
auto-fixed because dependency remediation was outside this lane.

## Intentionally Not Changed

- `package.json` export map remained unchanged.
- No active parser acceptance changed.
- No runtime/session behavior changed.
- No migration executor behavior changed.
- No pagination, renderer, generation, composition, table, toc, or authoring
  execution behavior changed.
- No Backend source changed.
- No Editor source changed.
- No Core, Backend, Editor, FlowDoc, or frontend Node truth was promoted.

## RISK

- Backend still has broad direct root imports, so future public-boundary
  narrowing can break Backend unless a Backend adoption lane moves first.
- Editor tests still import selected root symbols and fixtures directly; their
  policy remains separate from Editor production adapter usage.
- Candidate subpath groups are planning-only and could change when the package
  release boundary closes.
- The primary Core main checkout retained pre-existing unrelated
  `packages/pdf-renderer-pilot/fixtures` deletions. This evidence verifies the
  merged Core commit in a clean checkout, not that dirty primary checkout.
- Core npm audit still reports 2 high severity vulnerabilities.

## UNKNOWN

- Broad Core readiness remains unknown.
- Final public package subpath selection remains unknown.
- Backend replacement import paths are not staged.
- Editor test import policy is not staged.
- Whether the future frontend consumes Backend document records directly or an
  Editor-owned adapter boundary remains unknown.
- Production Backend readiness and deployed compatibility remain unknown.

