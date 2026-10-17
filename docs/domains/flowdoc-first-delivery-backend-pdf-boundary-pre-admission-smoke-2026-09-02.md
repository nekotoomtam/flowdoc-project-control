# FlowDoc First Delivery Backend PDF Boundary Pre-Admission Smoke

## Authority Boundary

This document records the PLAN-room acceptance decision for the automatically
returned Backend WORK room handoff in the first delivery round.

It is owned by Project Control under
`flowdoc-product-development-resumption > flowdoc-first-delivery-round`.

This is a Project Control verification record. It does not edit Core, Backend,
or Editor behavior, does not create Backend routes, does not expose API keys,
does not write product storage, does not produce PDF bytes, does not execute a
renderer, and does not promote FlowDoc product truth or map truth.

The accepted product behavior remains owned by Backend at the cited Backend
commit. Core semantics, Editor behavior, gateway routing, storage, workers,
renderer execution, artifact persistence, end-to-end delivery, release
readiness, and frontend readiness remain outside this record.

## Work Context

- Work path: `flowdoc-product-development-resumption > flowdoc-first-delivery-round`
- Owner repository for this acceptance record: `repo-project-control`
- Product evidence repository: `repo-backend`
- Active role: `evidence-reviewer`, with `project-control-steward` and
  `cross-repo-boundary-reviewer` responsibilities
- Current Phase:
  `phase-flowdoc-first-delivery-round-backend-pdf-boundary-pre-admission-smoke`
- Checklist target:
  `checklist-flowdoc-first-delivery-round-backend-pdf-boundary-pre-admission-smoke`
- Evidence target:
  `evidence-flowdoc-backend-pdf-boundary-pre-admission-smoke-2026-09-02`
- Room mode for this record: `PLAN`
- Accepted WORK lane: `lane-backend-pdf-boundary-pre-admission-smoke`
- Parent lane: `lane-backend-gateway-database`
- Work Type: `product-implementation`
- Dispatch Set ID:
  `dispatch-backend-product-edit-return-smoke-2026-09-02-01`
- Room Run ID:
  `room-backend-pdf-boundary-pre-admission-smoke-2026-09-02-01`
- Known risks: `npm install` reported 2 high severity audit findings in the
  existing Backend dependency set, the helper exactly validates the current
  Core v1 boundary shape, and gateway behavior remains unknown until a later
  route or operation-admission lane consumes this helper.
- Unknown state: Backend route mounting, API key behavior, product database
  persistence, artifact storage, worker execution, renderer execution, PDF
  byte production, Editor adoption, and end-to-end integration remain
  unverified by this smoke.

## Handoff Inbox Item

The Backend WORK room returned a Terminal Handoff through the automatic Return
Channel. PLAN received the message directly in this PLAN room and staged it in
`handoffInbox` before running `acceptanceGate`.

- Handoff status: PASS
- Return channel status: `automatic-returned`
- Active Return Command:
  `mcp__codex_app.send_message_to_thread`
- PLAN task/chat ID: `01a05e34-5b16-7493-ac31-9baf8ba71454`
- WORK task/chat ID: `01a06166-428a-75e3-8cee-911d4d4c53f2`
- Reviewer task/chat ID: `01a06175-9bf5-7431-aa4a-ac2b4a1025f3`
- Lane ID: `lane-backend-pdf-boundary-pre-admission-smoke`
- Work Type: `product-implementation`
- Owner repository: `repo-backend`
- Context Acknowledgement result: completed in the returned handoff
- Worktree locator:
  `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-backend-pdf-boundary-pre-admission-smoke-2026-09-02`
- Branch locator: `codex/backend-pdf-boundary-pre-admission-smoke-2026-09-02`
- Backend commit: `5427ebc12bfe52e0961fbdc35544e476ee0fd484`
- PR Summary Draft: Add a Backend-owned PDF export Published Structure
  pre-admission guard that accepts verified Core boundary plans and blocks
  malformed, forged, or no-run-drifted plans before operation admission.

## Acceptance Gate Result

`acceptanceGate` result: `accepted`.

PLAN accepted the Backend lane because the handoff included the expected lane
ID, owner repository, Work Type, Context Acknowledgement, terminal PASS status,
automatic Return Channel evidence, retrievable locator, exact Backend commit,
changed files, behavior summary, tests run, risks, unknowns, intentionally
closed scope, and PR Summary Draft.

Accepted Backend behavior:

- Backend exports
  `createFlowDocBackendPdfExportPublishedStructurePreAdmissionV1`.
- The helper consumes the public `@flowdoc/vnext-core` Published Structure PDF
  boundary plan result.
- The helper emits a Backend pre-admission record only when the Core boundary
  result is `ready` or `ready-with-warnings`, issues are empty, the full Core
  plan shape is present, the Core plan fingerprint verifies, and no-run
  stage, contract, and execution flags remain intact.
- The helper blocks Core blocked plans, malformed or forged ready plans,
  non-empty ready issues, stale plan fingerprints, missing Core sections,
  unexpected retained fields, invalid time ordering, and no-run flag drift.
- The helper retains only pruned Core boundary facts plus Core contracts and
  execution no-run proof.

Intentionally closed by this acceptance:

- No Backend route.
- No API key exposure.
- No operation admission.
- No worker or queue.
- No storage writes.
- No PDF bytes.
- No renderer execution.
- No Editor browser UI state or data-entry surface.
- No Project Control truth promotion from the product WORK room itself.

Contract Change Request: none. The Backend result stayed inside the approved
pre-admission smoke lane boundary and did not require PLAN to redefine Core
semantics, gateway, storage, API key, renderer, Editor, or source-of-truth
ownership.

## Verification

WORK verification:

- `npm install` completed because the worktree lacked dependencies; npm
  reported 2 high severity audit findings in the existing dependency set.
- TDD red test failed first because
  `createFlowDocBackendPdfExportPublishedStructurePreAdmissionV1` did not
  exist.
- Reviewer task `01a06175-9bf5-7431-aa4a-ac2b4a1025f3` found critical
  malformed/forged ready-plan and leakage risks in the first implementation.
- WORK added regression tests and tightened the helper.
- Reviewer re-review found no Critical, Important, or Minor issues.
- Focused Backend verification passed:
  `npm test -- src/tests/pdfExportPublishedStructurePreAdmission.test.ts`,
  1 file / 8 tests.
- Neighboring Backend verification passed:
  `npm test -- src/tests/pdfExportOperation.test.ts src/tests/pdfExportRoute.test.ts src/tests/pdfExportLocalEligibilityHttpHandler.test.ts src/tests/pdfExportPublishedStructurePreAdmission.test.ts`,
  4 files / 21 tests.
- `npm run type-check` passed.
- Full Backend gate passed in the WORK worktree:
  `npm run check`, 91 passed / 1 skipped test file, 334 passed / 24 skipped
  tests, and build passed.

PLAN verification:

- Verified the worktree, branch, and exact Backend commit locator.
- Verified the changed files:
  `src/pdfExport/pdfExportPublishedStructurePreAdmission.ts`,
  `src/tests/pdfExportPublishedStructurePreAdmission.test.ts`, and
  `src/index.ts`.
- Ran `git diff --check`.
- Ran full Backend gate in the WORK worktree: `npm run check`.
- Fast-forward merged the Backend branch into Backend main.
- Ran full Backend gate again on Backend main: `npm run check`.
- Backend main result: 91 passed / 1 skipped test file, 334 passed / 24
  skipped tests, and build passed.

## PLAN Decision

Backend product-edit active return smoke has now been accepted by PLAN for
`lane-backend-pdf-boundary-pre-admission-smoke` at Backend commit
`5427ebc12bfe52e0961fbdc35544e476ee0fd484`.

The acceptance is bounded to the Backend pre-admission guard and the single
product-edit automatic return proof on this local host. It does not promote
FlowDoc product truth or map truth, and it does not prove Backend gateway
readiness, API key readiness, product database persistence, route-mounted
production behavior, worker or queue readiness, renderer execution, PDF byte
production, artifact persistence, Editor adoption, end-to-end integration,
release readiness, or frontend readiness.

This acceptance does prove that one real product WORK room with actual Backend
edits can push a Terminal Handoff back to PLAN through the active Return
Channel without requiring `ตูม` to copy and paste it.

`completionQueue` status: no other returned WORK handoff was queued in this
acceptance pass because `parallelLimit` was 1.

Room run cleanup status: Backend main now points at the accepted commit and
the branch was deleted. Git removed the lane worktree from its registry; a
residual directory at
`C:\Users\nekot\Documents\GitHub\flowdoc-vnext-backend-pdf-boundary-pre-admission-smoke-2026-09-02`
remained after Windows reported `Filename too long` during directory deletion.

## Next Recommended Lanes

Next recommended lanes:

- `lane-backend-gateway-database`: decide how the Backend route or operation
  admission path consumes the pre-admission guard without exposing API keys,
  storage, workers, renderer execution, or PDF bytes prematurely.
- `lane-editor-structure-publish`: inspect and implement the Editor-owned
  structure creation and publish surface that can feed the accepted Core and
  Backend boundaries.
- `lane-integration-evidence`: stay held back until the owner-lane handoffs
  needed for the First Delivery Slice have been accepted by PLAN.
