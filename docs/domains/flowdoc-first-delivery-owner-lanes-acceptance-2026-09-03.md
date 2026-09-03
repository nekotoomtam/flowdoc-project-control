# FlowDoc First Delivery Owner Lane Acceptance

## Authority Boundary

This document records the PLAN-room acceptance decision for the automatically
returned Backend and Editor WORK room handoffs in the first delivery round.

It is owned by Project Control under
`flowdoc-product-development-resumption > flowdoc-first-delivery-round`.

This is a Project Control verification record. It does not edit Core, Backend,
or Editor behavior, does not store secrets, does not start workers, does not
produce PDF bytes, does not run the renderer, does not prove end-to-end
delivery, and does not promote FlowDoc product truth or map truth.

Backend behavior remains owned by Backend at commit
`d20b905bf7da33d93d7f4b05117fd1a3ad0bb47a`. Editor behavior remains owned by
Editor at commit `15c956d5c887f938a828c80dc45ababe08c7569d`.

## Work Context

- Work path: `flowdoc-product-development-resumption > flowdoc-first-delivery-round`
- Owner repository for this acceptance record: `repo-project-control`
- Product evidence repositories: `repo-backend`, `repo-editor`
- Active role: `evidence-reviewer`, with `planning-partner`,
  `project-control-steward`, and `cross-repo-boundary-reviewer`
  responsibilities
- Current Phase: `phase-flowdoc-first-delivery-owner-lanes-acceptance`
- Checklist target: `checklist-flowdoc-first-delivery-owner-lanes-acceptance`
- Evidence targets:
  `evidence-flowdoc-backend-gateway-database-accepted-2026-09-03` and
  `evidence-flowdoc-editor-structure-publish-accepted-2026-09-03`
- Room mode for this record: `PLAN`
- Dispatch Set ID: `dispatch-first-delivery-owner-lanes-2026-09-03-01`
- Parallel limit: 2
- Dispatch budget profile: Lean Dispatch
- Accepted WORK lanes: `lane-backend-gateway-database` and
  `lane-editor-structure-publish`
- Work Type: `product-implementation`
- Known risks: Backend route behavior is still an optional boundary, Editor
  publish submission intentionally remains unavailable, and integration
  evidence remains held until a later owner-lane integration proof connects
  the accepted surfaces.
- Unknown state: real API key provisioning, real product database readiness,
  production gateway binding, queue or worker execution, renderer execution,
  PDF byte production, artifact download, browser-to-backend integration,
  release readiness, frontend readiness, FlowDoc product truth, and map truth
  remain unverified by this acceptance.

## Handoff Inbox Items

PLAN opened two real WORK rooms under
`dispatch-first-delivery-owner-lanes-2026-09-03-01`. Both returned Terminal
Handoffs through the automatic Return Channel by using
`mcp__codex_app.send_message_to_thread`; `ตูม` did not need to copy or paste
the terminal handoffs.

Backend handoff:

- Handoff status: PASS after one revision
- Return channel status: `automatic-returned`
- WORK task/chat ID: `01a06519-c3a4-70c0-9993-8264cc0418ac`
- Handoff ID: `handoff-backend-gateway-database-2026-09-03-01-r1`
- Lane ID: `lane-backend-gateway-database`
- Owner repository: `repo-backend`
- Final Backend main commit:
  `d20b905bf7da33d93d7f4b05117fd1a3ad0bb47a`

Editor handoff:

- Handoff status: PASS
- Return channel status: `automatic-returned`
- WORK task/chat ID: `01a06519-c810-77d1-9382-b50f2bca2a18`
- Handoff ID: `handoff-editor-structure-publish-2026-09-03-01`
- Lane ID: `lane-editor-structure-publish`
- Owner repository: `repo-editor`
- Final Editor main commit:
  `15c956d5c887f938a828c80dc45ababe08c7569d`

## Acceptance Gate Result

`acceptanceGate` result: `accepted` for both owner lanes.

Accepted Backend behavior:

- Adds the optional Backend First Delivery gateway route boundary.
- Mounts `POST /first-delivery/pdf-exports` and
  `GET /first-delivery/pdf-exports/:jobId` only when the Backend server is
  explicitly given `firstDeliveryGateway` options.
- Authenticates through an injected API-key credential reference.
- Validates accepted Core Published Structure PDF boundary plans through the
  existing Backend pre-admission guard.
- Writes planned artifact-manifest and artifact-job records through Backend
  file JSON storage.
- Returns queued job/status and artifact pointer metadata.

Backend intentionally closed:

- Does not run renderer.
- Does not produce PDF bytes.
- Does not start a worker.
- Does not enable production binding.
- Does not store credentials or real secrets.
- Does not mount the existing V-G pdf-export candidate at root `/pdf-exports`.

Accepted Editor behavior:

- Adds `/documents/:documentId/publish` as a first-class workspace view.
- Adds a Publish tab to the workspace header.
- Retains Design runtime state while the Publish view is active.
- Renders an Editor-owned Publish boundary panel for the active document and
  version.
- Keeps publish submission unavailable until the Backend-owned gateway
  contract is ready for integration.

Editor intentionally closed:

- Does not call Backend.
- Does not submit publish jobs.
- Does not store API keys.
- Does not claim PDF output readiness.
- Does not prove browser-to-backend integration.

Contract Change Request: none. The Backend and Editor handoffs stayed inside
their approved owner-lane boundaries. The Backend revision repaired stale test
fixture dependencies caused by retired Core canonical output fixtures without
expanding the lane into renderer or PDF-byte delivery.

## Verification

Backend verification:

- WORK focused gate passed after revision: type-check, 9 files / 32 tests / 1
  skipped, and build.
- WORK full gate passed: `npm run check`, 92 passed / 1 skipped test files,
  333 passed / 27 skipped tests, and build passed.
- PLAN verified the Backend worktree, branch, and commits.
- PLAN fast-forward merged the Backend lane branch into Backend main.
- PLAN repaired Backend main test discovery so Vitest excludes nested
  `.worktrees` and `dist` outputs, and made canonical full-document proofs skip
  only when their retired Core output fixtures are unavailable.
- PLAN reran focused Backend regression tests:
  `src/tests/pdfExportLocalComposition.test.ts` and
  `src/tests/pdfExportLocalRenderer.test.ts`, 2 files / 9 passed / 3 skipped.
- PLAN reran Backend main `npm run test`, 92 passed / 1 skipped test files,
  333 passed / 27 skipped tests.
- PLAN reran Backend main `npm run check`; type-check, test, and build passed.
- Backend lane worktree cleanup completed; the branch was deleted and only
  Backend main remains registered by `git worktree list`.

Editor verification:

- WORK baseline `npm run check` passed before implementation.
- RED route/tab/frame tests failed before the publish route, tab, and frame
  existed.
- GREEN focused route/tab/frame tests passed with 3 files / 6 tests.
- WORK post-commit and post-merge main gates passed with 109 files / 394 tests
  and build, with the existing Vite chunk-size warning family.
- PLAN independently verified Editor main and reran `npm run check`; 109 test
  files / 394 tests and build passed with the same Vite chunk-size warning
  family.

Project Control verification:

- RED guard:
  `npx vitest run tests/flowdoc-first-delivery-owner-lanes-acceptance.test.ts --maxWorkers=1`
  failed before these owner-lane acceptance records existed.
- GREEN target after registration:
  `tests/flowdoc-first-delivery-owner-lanes-acceptance.test.ts`,
  `npm run generate`, `npm run check:data`, and full `npm run check`.

## PLAN Decision

PLAN accepts `lane-backend-gateway-database` and
`lane-editor-structure-publish` as owner-lane product implementation evidence
for the First Delivery Round.

The acceptance is bounded to the exact Backend and Editor commits named in
this record. It proves the two owner lanes returned automatically to PLAN,
their main-branch gates passed after merge, and their implementation boundaries
are now recorded by Project Control.

The acceptance does not prove end-to-end delivery. `lane-integration-evidence`
remains held until PLAN opens a later integration lane that connects the
accepted Backend and Editor surfaces and produces repository-owned evidence for
the exact integration claim.

`completionQueue` status: Backend and Editor handoffs were received and
processed by PLAN. Backend carried a revision return, so PLAN processed the
Backend RISK/revision path before final PASS acceptance and then accepted the
Editor PASS handoff.

## Next Recommended Work

Next recommended lane:

- `lane-integration-evidence`, to verify the narrow path across accepted
  Backend and Editor owner surfaces without promoting broader product,
  release, frontend, or map truth beyond the exact evidence produced.
