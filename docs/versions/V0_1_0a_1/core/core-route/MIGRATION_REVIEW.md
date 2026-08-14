# CORE_ROUTE Migration Readiness Review

## Verdict

The independent readiness verdict is **READY FOR TASK 8 AUTHORIZATION — not deletion performed.** The review recorded zero Critical findings, zero Important findings, and three Minor findings. With the historical allowances and lifecycle transition registered by this Task 8 publication, the four sources listed below are **ready for source deletion**. This record does not perform that deletion and does not authorize any other Core path.

## Reviewed revisions and ranges

- Project Control canonical publication: `bd588e336bd466e3c49e0d593ec6296293ef28bb`.
- Core frozen inventory source: `76a2f2311a898e781f53773390d47b05812911e4`.
- Core seven-path guard and reference-repair commit: `c43fe56a4f96bfce405adc919e95e9ce50ead866`.
- Core one-path canonical-baseline correction and final clean reference-repair commit: `9f4605d91f58e3a4ab8dc00ed7768592cc5a6fb1`.
- Seven-path review range: `76a2f2311a898e781f53773390d47b05812911e4..c43fe56a4f96bfce405adc919e95e9ce50ead866`.
- One-path review range: `c43fe56a4f96bfce405adc919e95e9ce50ead866..9f4605d91f58e3a4ab8dc00ed7768592cc5a6fb1`.

The two Core ranges were reviewed separately. Their review packages have SHA-256 values `6bdad0df17853941c264ac16948db43203e7fdb327242b1c0ed1444d7b5e7c4e` and `c3d691af6ebcc3176d8e496c79a721c1df7109878ca7d740e64e6b8414553705`, respectively.

## Exact deletion scope

Only these four captured paths are authorized:

| Core source path | Captured blob |
| --- | --- |
| `docs/CORE_ROUTE_DEEXPORT_PLAN.md` | `8f17cbd011fb706d69e53f38b86a95bc2afe6c7c` |
| `docs/CORE_ROUTE_DEPRECATION_WINDOW.md` | `815dd7117dfdbb9551257afe7d81ac1351fa4b33` |
| `docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md` | `d8db6dfe0eb6f5d3c6821f1c55b10bd25c1b46ef` |
| `docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md` | `188fd81d4e78a025119c8d2b0ae1cef046d0ff13` |

Coverage closes each source and blob exactly once against the canonical leaf. The family map remains a provisional classification artifact whose four `migrationStatus` values are `classified`; the family coverage record is the authoritative deletion lifecycle. Task 8 deliberately does not rewrite the family map.

## Review findings

The reviewer confirmed:

1. Coverage, source blobs, canonical destinations, and the exact deletion set are closed and consistent.
2. Current authority claims are bounded to the reviewed `core-route` child and supported by the named executable anchors; the parent Core node remains `unknown`.
3. Reference closure contains only the four completed-phase provenance rows at `docs/PHASE_LEDGER.md:244`–`:247`. No README or test reference remains and no README or test allowance is granted.
4. The consolidated Core guard preserves the retained generation, artifact, and public-boundary contracts while forbidding the removed route-helper ownership.
5. The authorized deletion scope is exactly the four paths above. No Core deletion has occurred in this Project Control commit.

Before the historical allowances were registered, the clean external scan at Core `9f4605d91f58e3a4ab8dc00ed7768592cc5a6fb1` reported only those four ledger mentions plus coverage not yet ready. It reported no dirty-tree, README, test, source-drift, or destination diagnostic.

## Verification evidence

- The Task 7 exact-HEAD Core check passed type checking and all 3,080 tests across 464 files.
- Two fresh readiness-review Core full checks passed type checking and 3,079 of 3,080 tests; the same pre-existing `canonicalDocumentationSpine` negation-matrix row exceeded its 15-second limit at 17.6 and 18.7 seconds, then passed 1/1 in isolation in 13.71 seconds.
- Project Control `check:data` and `check:migrations` passed during readiness review.
- A pre-existing Task 4 row in `core-doc-migration.test.ts` exceeded its five-second limit by 13 milliseconds during the review and passed in isolation without a product change.
- The normal and mention-report external scans both bound the exact clean Core handoff and found exactly the four `PHASE_LEDGER.md` provenance mentions described above before allowances were added.

## Rollback procedure

Before a Core cleanup commit exists, restore all four staged source paths from Core commit `9f4605d91f58e3a4ab8dc00ed7768592cc5a6fb1` and discard no unrelated change. After a Core cleanup commit exists, revert that single exact cleanup commit without rewriting history. In either case, verify that every restored path has the captured blob listed in this review, then rerun the Core and external migration gates.

If Project Control closure has already been published, publish or revert the corresponding closure state so that cleanup Evidence is removed, `coreCleanupCommit` is cleared, and Work and coverage once again reflect restored sources. Do not leave Project Control claiming closed cleanup while any authorized source has been restored.

## Remaining risks and unknowns

- External consumers and deep imports outside the reviewed repositories remain unknown.
- The internal deprecated route vocabulary can drift after the captured Core commit and must remain guarded until cleanup.
- Backend behavior was not independently revalidated by this documentation-only pilot.
- Two pre-existing timing-sensitive test rows remain operational risks even though each passed in isolation and the Task 7 exact-HEAD full check passed.
- The provisional family-map status and authoritative coverage lifecycle intentionally differ; consumers must use coverage, not family-map `migrationStatus`, to decide deletion readiness.
