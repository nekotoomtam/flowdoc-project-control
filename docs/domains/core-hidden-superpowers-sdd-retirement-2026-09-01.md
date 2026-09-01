# Core Hidden Superpowers SDD Retirement - 2026-09-01

## Purpose

This record preserves the retained value and discard rationale for the tracked
hidden `.superpowers/sdd` Markdown files in `flowdoc-vnext-core` before they
are retired from the Core repository.

The retirement belongs to `flowdoc-product-development-resumption >
flowdoc-documentation-authority-cleanup` and follows the Core Markdown
classification recorded in
`docs/domains/core-repository-markdown-classification-2026-09-01.md`.

## Authority Boundary

This document is owned by `repo-project-control` and supports only the
documentation-authority cleanup sequence for hidden Core `.superpowers/sdd`
Markdown.

The source snapshot is Core commit
`6c1b53796802772467bf715b83764ac1ef613e52`, where `git ls-files
'.superpowers/*.md'` returned five tracked Markdown files. It does not make the
historical SDD files active Project Control Work, Core runtime truth, or
release evidence by themselves.

This record does not promote Core, Backend, Editor, compatibility, frontend
readiness, FlowDoc product truth, or map truth.

## Source Snapshot

The tracked hidden Markdown files are:

- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-corrective/collision-fix-report.md`
- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-corrective/delivery-fix-report.md`
- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/final-review-verdict.md`
- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/final-verification.md`
- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/source-envelope-verification.md`

No active Core source, test, README, or `docs/` path references these hidden
file paths by name. The Core implementation and tests still carry the retained
5B-1 V3 behavior and verification signals.

## Retained Value

| Hidden source | Retained value | Current carrier after retirement |
| --- | --- | --- |
| `collision-fix-report.md` | Records the correction from clone-only digest mutation evidence to a genuine forced Scene collision proof, including `delivery-plan-retain-payload-mismatch` and public export non-leakage. | `tests/textBlockUnifiedLayoutAdversarialV2.test.ts`; `src/layout/textBlockSceneDeliveryV2.ts`; the Core public export guard remains in source and tests. |
| `delivery-fix-report.md` | Records the descriptor-safe delivery parser fix and the regression that blocks nested accessor-backed renderer data with `invalid-input` or `complete-delivery-data-mismatch`. | `src/layout/textBlockSceneDeliveryV2.ts`; `tests/textBlockSceneDeliveryV2.test.ts`. |
| `final-review-verdict.md` | Records the Phase 5B-1 V3 scoped review verdict, resolved findings, and remaining unknowns: product-scale memory, Worker lifetime, Editor/Backend binding, and later change-family support. | `README.md`; `docs/PHASE_LEDGER.md`; related 5B-1 V3 source and tests. |
| `final-verification.md` | Records the historical focused gate, full Core gate, hygiene check, and non-modification of Editor/Backend for the Phase 5B-1 V3 lane. | Superseded as active verification by current Core `npm run check` evidence; historical details remain in git history at the source commit. |
| `source-envelope-verification.md` | Records the active `5b-1-v3` policy identity, fingerprint, 21-row stage ledger, source-envelope threshold evidence, and fail-closed source exhaustion behavior. | `README.md`; `src/layout/textBlockUnifiedLayoutWorkPolicyV1.ts`; `tests/textBlockUnifiedLayoutWorkCalibrationV3.test.ts`; `tests/liveDraftMr1UnifiedIncrementalRoot5b.test.ts`; `tests/textBlockUnifiedLayoutTransitionContractV1.test.ts`; related source-state and evidence tests. |

## Discard Rationale

The five hidden Markdown files are historical execution and review artifacts.
They are not package entrypoints, generated Core documentation, Core API
contracts, or Project Control records.

Keeping them tracked under `.superpowers/sdd` creates a hidden work-memory
plane outside Project Control. That makes normal visible Markdown scans report
343 files while `git ls-files '*.md'` reports 348 files. The hidden files should
not remain as a second documentation authority surface.

The retained meaning is represented by this Project Control record, the Core
source and test files named above, the Core README and phase ledger summaries,
and git history at the exact source commit. After the Core cleanup commit,
future agents should cite this record or the exact source commit instead of
recreating hidden `.superpowers/sdd` Markdown.

## Evidence Boundary

This record preserves cleanup rationale only. It does not delete Core Markdown
by itself and does not claim that the 5B-1 V3 runtime area, Live Draft, Text
Block, Core, Editor, Backend, or FlowDoc product is ready.
