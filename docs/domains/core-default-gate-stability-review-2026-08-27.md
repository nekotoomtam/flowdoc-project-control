# Core Default Gate Stability Review - 2026-08-27

Status: bounded Core gate-stability lane complete; compatibility truth remains unpromoted.

Work path: `flowdoc-product-development-resumption > core-default-gate-stability-review`

Owner repositories: `repo-core`, `repo-project-control`

Active role: `product-implementation-agent`

Phase: `phase-core-default-gate-stability-review`

Checklist: `checklist-core-default-gate-stability-review`

Evidence target: `evidence-core-default-gate-stability-review-2026-08-27`

## Scope

This lane investigated the fresh Core default `npm run check` failure recorded
by the cross-repository compatibility evidence review. The work was limited to
Core test-gate stability and Project Control evidence registration.

This packet does not promote FlowDoc, Core, Editor, Backend, document maps, or
accepted cross-repository compatibility truth. Its document and Evidence records
intentionally use empty `nodeIds` so the result stays work-scoped.

## Baseline Reproduction

Core worktree baseline started from
`969a21a4e888d836ae62164b206cb2dd34d5d702` on
`codex/core-default-gate-stability-review`.

Fresh baseline `npm run check` reproduced a failing default Core gate:

- `tests/textBlockUnifiedLayoutTextStyleSourceV1.test.ts > 5B-2 text/style Source path copy > commits exact Evidence-backed geometry 'insertion' through Plan A` timed out at the default 5-second limit.
- `tests/corePackageLaneRetirementGuard.test.ts > core package-lane retirement guard > points current ownership evidence at backend replacement modules and tests` failed because `src/storage/fileJsonStorage.ts` was not found under the worktree-local sibling path.
- Baseline summary: 2 failed and 457 passed test files; 2 failed and 2,939 passed tests; duration 247.30s.

Focused reproduction separated the two root causes:

- The geometry block passed isolated with 3 passed and 59 skipped tests; the insertion row took 614ms.
- The full `textBlockUnifiedLayoutTextStyleSourceV1.test.ts` file passed isolated with 62 tests in 74.08s, while several heavier rows took 4.7s to 11.3s.
- The backend replacement files existed in the real Backend checkout at `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-backend`, so the guard failure was path-topology-specific to a linked Core worktree under `.worktrees`.

## Root Cause

The Core default gate had two independent stability issues:

1. `corePackageLaneRetirementGuard.test.ts` resolved the Backend sibling from
   the current Core worktree root. In a linked worktree this incorrectly points
   under `flowdoc-vnext-core/.worktrees/flowdoc-vnext-backend` instead of the
   canonical sibling checkout.
2. `textBlockUnifiedLayoutTextStyleSourceV1.test.ts` already contains heavy
   5B-2 evidence rows with task-local timeout budgets, but the earlier
   evidence-backed geometry `it.each` block still used Vitest's default
   5-second timeout. The block is fast when isolated, but the default full
   suite can stretch it under worker load.

No assertion mismatch or Core semantic output mismatch reproduced.

## Changes

Core commit `77b9e181d1fb43bf69d725108ede664578a07a45` changed only tests:

- `tests/corePackageLaneRetirementGuard.test.ts` now resolves the canonical Core
  checkout via `git rev-parse --git-common-dir` before locating the Backend
  sibling, while falling back to the current root outside Git.
- `tests/textBlockUnifiedLayoutTextStyleSourceV1.test.ts` now gives the
  evidence-backed geometry `it.each` block a local 60-second timeout budget.

No runtime Core source, public exports, package schema, Editor code, Backend
code, or Project Control map was changed.

## Verification

Core focused checks after the patch:

- `npx vitest run --config vitest.config.ts tests/corePackageLaneRetirementGuard.test.ts --reporter verbose`: 1 test file passed, 3 tests passed.
- `npx vitest run --config vitest.config.ts tests/textBlockUnifiedLayoutTextStyleSourceV1.test.ts -t "commits exact Evidence-backed geometry" --reporter verbose`: 1 test file passed, 3 passed and 59 skipped tests.
- `npx vitest run --config vitest.config.ts tests/textBlockUnifiedLayoutTextStyleSourceV1.test.ts --reporter verbose`: 1 test file passed, 62 tests passed.

Core owner gate:

- Worktree `npm run check`: type-check passed; 459 test files passed; 2,941 tests passed; duration 223.28s.
- Merged main `npm run check`: type-check passed; 459 test files passed; 2,941 tests passed; duration 227.15s.

Project Control intake/evidence gate:

- The intake record was opened at Project Control commit `8bd85dab04110e453f7ac88d571cb40dca2a9b8b`.
- Project Control `npm run check` on main after intake passed 37 test files, 307 tests, build, and 5 e2e tests.

## PASS

- Core default `npm run check` is green at
  `77b9e181d1fb43bf69d725108ede664578a07a45` after a reproduced baseline
  failure and minimal test-gate fixes.
- The Backend sibling guard now works from a linked Core worktree.
- The load-sensitive 5B-2 geometry evidence block has a local timeout budget
  without changing global Vitest timeout configuration.

## FAIL / BLOCKER

- No blocker remains for this Core default gate-stability lane.

## RISK

- The 5B-2 Source path-copy file still contains heavy evidence scenarios; this
  lane stabilizes the default gate but does not optimize those algorithms or
  reduce file runtime.
- Core `npm install` in the worktree reported existing npm audit warnings; they
  were not investigated or fixed in this lane.

## UNKNOWN

- This lane does not add the live Editor-client to Backend-server to Core
  compatibility harness. Cross-repository live compatibility remains unknown.
- This lane does not prove broader Core product readiness beyond the default
  owner gate at the cited commit.

## Intentionally Not Changed

- No Core runtime behavior or public API was changed.
- No Editor or Backend product files were changed.
- No system map or Core document map truth was promoted.
- The stale cross-repository compatibility blocker evidence remains as a
  historical record of the earlier failed gate; this packet records the later
  Core gate-stability result.

## Next Recommended Direction

Open the live compatibility harness lane only after this evidence is accepted:
start the Backend HTTP server, consume it through the Editor backend client,
read `/capabilities/versions`, load a document, perform an explicit migration,
commit a mutation, and apply the Core-backed envelope into Editor runtime.
