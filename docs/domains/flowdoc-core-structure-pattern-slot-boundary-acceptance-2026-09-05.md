# FlowDoc Core Structure Pattern Slot Boundary Acceptance

## Authority Boundary

This document is the PLAN-owned Room Run Registry and acceptance note for `dispatch-core-dirty-risk-0905`.

It records the WORK room locator, automatic return, liveness state, `acceptanceGate` decision, Core main merge, and Core verification for the bounded Structure Pattern Slot semantic boundary lane. It does not edit Core, Backend, or Editor behavior and does not prove Backend persistence, Editor Preview, runtime submitted values, API-key readiness, production database readiness, PDF readiness, artifact readiness, FlowDoc product truth, release readiness, frontend readiness, or map truth.

## Dispatch Set

- Dispatch set ID: `dispatch-core-dirty-risk-0905`
- PLAN task/chat ID: `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- `parallelLimit`: `1`
- Reason for `parallelLimit`: this lane accepts or rejects a dirty Core product slice that was already present in the Core main checkout, so no dependent database or Editor lane should run until the slice is no longer unaccepted product work.
- Return order policy: single-lane dispatch; process the returned handoff through `acceptanceGate`.
- Active Return Command: `send_message_to_thread` back to PLAN task/chat ID `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- Liveness policy: `clientThreadId` alone is not a monitorable retrievable locator. PLAN resolved the created WORK task through the session/worktree locator before acceptance.
- Acceptance policy: PLAN stages the terminal handoff in `handoffInbox`, checks required fields, verifies the exact Core commit, merges only after acceptance, and does not patch Core product files after dispatch.

## Room Run Registry

### room-core-structure-pattern-slot-boundary-acceptance-2026-09-05-01

- Status: `accepted`
- Lane ID: `lane-core-structure-pattern-slot-boundary-acceptance-2026-09-05`
- Work Type: `product-implementation`
- Owner repository: `repo-core`
- Active role: `product-implementation-agent`
- Work path: `flowdoc-product-development-resumption > flowdoc-fast-delivery-risk-register > lane-core-structure-pattern-slot-boundary-acceptance-2026-09-05`
- Codex task/chat ID: `01a07040-3005-7ad0-9bb4-988098e24aa5`
- Initial client locator: `client-new-thread:d1961338-a2c6-41e8-ab5b-e7a098b5409c`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\8faf\flowdoc-vnext-core`
- Branch locator: detached HEAD
- Locator discovery method: session index plus Core git worktree locator after `create_thread` first returned only `clientThreadId`
- Context Acknowledgement status: completed
- Return handoff ID: `handoff-core-structure-pattern-slot-boundary-acceptance-2026-09-05-01`
- Evidence target: `evidence-flowdoc-core-structure-pattern-slot-boundary-accepted-2026-09-05`
- Automatic return status: `automatic-returned`
- Terminal status: `PASS`
- Accepted WORK Core commit: `0de05a3fe3502847d1179c1d2debb2f4c02e514f`
- Accepted Core main commit: `e3b988806ebaa4fdbda4b426924543605e539c2f`
- Accepted changed paths: `docs/CORE_PUBLIC_EXPORT_BOUNDARY_REVIEW.md`; `src/index.ts`; `src/lifecycle/structurePatternSlots.ts`; `tests/corePublicExportBoundaryReview.test.ts`; `tests/structurePatternSlotBoundary.test.ts`
- Accepted behavior: Core now exposes a bounded lifecycle assessment for Structure Pattern Slot facts. The boundary accepts strict author-time or published-structure slot input, returns deterministic slot facts and summary counts, and explicitly keeps Structure Pattern Entry, submitted values, Backend persistence, Editor Preview, package schema changes, and `package.json` export-map changes out of this Core boundary.
- WORK verification included: `npx vitest run tests/structurePatternSlotBoundary.test.ts --config vitest.config.ts`, `npm run type-check`, focused two-file gate `npx vitest run tests/structurePatternSlotBoundary.test.ts tests/corePublicExportBoundaryReview.test.ts --config vitest.config.ts`, font evidence guard after local line-ending setup, and final `npm run check`.
- PLAN verification: PLAN cherry-picked the accepted WORK commit to Core main as `e3b988806ebaa4fdbda4b426924543605e539c2f`, then reran `npm run type-check`, the focused two-file gate, and final Core main `npm run check`. The focused gate passed with 2 files and 5 tests. The full Core main gate passed with 432 files and 2791 tests.
- Setup risk: the WORK room installed dependencies with `npm ci` and had to normalize local line-ending state for existing Windows-sensitive guards. This is local workspace setup state, not product behavior.
- Package risk: `npm ci` reported 2 high-severity audit findings; the lane did not change dependency policy or audit state.
- Workspace risk: known unrelated untracked cleanup residue remains, including `.git.broken-backup-25690905-002257/` and `.superpowers/`. PLAN kept this as residual local workspace risk.
- Stash handling: before cherry-picking the accepted WORK commit, PLAN saved the pre-existing Core main dirty slice into `stash@{0}` with message `backup before accepting core structure pattern slot boundary`. This preserves the prior unaccepted slice as a backup while Core main now carries the accepted commit.
- Intentionally not changed: no Project Control product behavior, no Backend persistence, no Editor Build or Preview UI behavior, no runtime submitted values, no product database tables, no API-key behavior, no generated PDF file, no renderer execution, no artifact byte storage, no worker or queue, no permission, no billing, no audit trail, no activity feed, and no map truth.

## PLAN Decision

PLAN accepts `lane-core-structure-pattern-slot-boundary-acceptance-2026-09-05` as a bounded Core product implementation lane.

Accepted product commits:

- WORK Core commit: `0de05a3fe3502847d1179c1d2debb2f4c02e514f`
- Core main commit: `e3b988806ebaa4fdbda4b426924543605e539c2f`

Accepted bounded behavior:

- Core has a Structure Pattern Slot semantic boundary for author-time or published-structure slot facts.
- Published-structure slots must pin a Structure Pattern version.
- Duplicate slot keys and slot IDs are blocked.
- Single and repeatable cardinality rules are checked.
- Required slots must allow at least one future entry, while Structure Pattern Entry and submitted values remain outside this Core slot fact boundary.

This record closes only the known Core dirty-product slice under `RISK-FD-008`. The general dirty-product-main guard remains active for future cases.

This record does not promote FlowDoc product truth or map truth. It does not prove Backend persistence, Backend API adoption, production database persistence, production deployment, Editor Build adoption, Editor Preview behavior, runtime submission persistence, submitted values, PDF files, renderer jobs, artifact storage, permission behavior, workflow, billing, audit, activity feed, end-to-end readiness, release readiness, or full frontend readiness.

## Required Next PLAN Handling

The next high-value work is to resume the database implementation direction using the accepted document-structure database model and the now-accepted Core Structure Pattern Slot boundary as bounded inputs. Backend persistence, Editor presentation, Preview simulation, runtime submitted values, PDF generation, and external API-key behavior still require their own owner lanes and evidence.

Manual recovery may use task ID, worktree, branch, commit, or session locator only to recover or classify a missed automatic return. Manual recovery does not satisfy automatic return.

## Intentionally Not Changed

- No Backend behavior changed in this dispatch.
- No Editor behavior changed in this dispatch.
- No Project Control product behavior changed by this acceptance note.
- No product database table, generated PDF file, renderer job, artifact byte storage, runtime submission, submitted value schema, user permission, workflow, billing, audit trail, activity feed, dataset, or external API-key behavior added.
- No FlowDoc product truth or map truth promoted.
