# FlowDoc First Delivery Core PDF Boundary Acceptance

## Authority Boundary

This document records the PLAN-room acceptance decision for the returned Core
WORK room handoff in the first delivery round.

It is owned by Project Control under
`flowdoc-product-development-resumption > flowdoc-first-delivery-round`.

This is a Project Control verification record. It does not edit Core, Backend,
or Editor behavior, does not create Backend routes, does not expose API keys,
does not write product storage, does not produce PDF bytes, does not execute a
renderer, and does not promote FlowDoc product truth or map truth.

The accepted product behavior remains owned by Core at the cited Core commit.
Backend, Editor, gateway, storage, renderer, artifact persistence, end-to-end
delivery, release readiness, and frontend readiness remain outside this
record.

## Work Context

- Work path: `flowdoc-product-development-resumption > flowdoc-first-delivery-round`
- Owner repository for this acceptance record: `repo-project-control`
- Product evidence repository: `repo-core`
- Active role: `evidence-reviewer`, with `project-control-steward` and
  `cross-repo-boundary-reviewer` responsibilities
- Current Phase:
  `phase-flowdoc-first-delivery-core-pdf-boundary-acceptance`
- Checklist target:
  `checklist-flowdoc-first-delivery-core-pdf-boundary-acceptance`
- Evidence target:
  `evidence-flowdoc-first-delivery-core-pdf-boundary-accepted-2026-09-02`
- Room mode for this record: `PLAN`
- Accepted WORK lane: `lane-core-document-pdf-boundary`
- Work Type: `product-implementation`
- Known risks: Backend and Editor have not adopted this Core boundary, the
  production renderer profile is not verified, artifact byte storage is not
  verified, and API-key gateway behavior remains outside Core
- Unknown state: production renderer profile selection, artifact byte storage,
  API-key gateway behavior, product database persistence, and end-to-end
  Backend/Editor integration remain unverified by this Core-only lane

## Handoff Inbox Item

The Core WORK room returned a Terminal Handoff outside automatic PLAN-room
push. PLAN treated the user-provided return as a `handoffInbox` candidate and
used the retrievable locator to pull and verify it before acceptance.

- Handoff status: PASS
- Return channel status: `manual-recovered`
- Lane ID: `lane-core-document-pdf-boundary`
- Work Type: `product-implementation`
- Owner repository: `repo-core`
- Context Acknowledgement result: acknowledged in the returned handoff
- Terminal return source: user-provided WORK room Terminal Handoff
- Worktree locator:
  `C:\Users\nekot\.codex\worktrees\d63e\flowdoc-vnext-core`
- Branch locator: `codex/core-document-pdf-boundary`
- Core commit: `da5011ceeac6e0b72b152a9a5029d684af978581`
- PR Summary Draft: Add a Core-owned Published Structure PDF boundary plan
  that pins accepted generation runtime facts, published structure fingerprint,
  source owner, export IDs, and profile IDs while keeping downstream execution,
  Backend storage/API, and renderer PDF byte production explicitly not-run.

## Acceptance Gate Result

`acceptanceGate` result: `accepted`.

PLAN accepted the Core lane because the handoff included the expected lane ID,
owner repository, Work Type, Context Acknowledgement, terminal PASS status,
retrievable locator, exact Core commit, changed files, behavior summary, tests
run, risks, unknowns, intentionally closed scope, and PR Summary Draft.

Accepted Core behavior:

- Core exports `createVNextPublishedStructurePdfBoundaryPlanV1`.
- The contract creates a deterministic, content-free PDF boundary plan from an
  accepted Published Structure generation runtime receipt and a pinned
  Published Structure fingerprint.
- The plan records PDF handoff prerequisites without rendering, storage, or
  Backend execution.
- It blocks on blocked generation runtime, missing source owner, invalid
  artifact pins, invalid export pins, invalid date pins, invalid profile pins,
  or structure-version mismatch.

Intentionally closed by this acceptance:

- No Backend route.
- No API key exposure.
- No worker or queue.
- No storage writes.
- No PDF bytes.
- No renderer execution.
- No Editor browser UI state or data-entry surface.
- No Project Control truth promotion from the product WORK room itself.

Contract Change Request: none. The Core result stayed inside the approved Core
lane boundary and did not require PLAN to redefine gateway, storage, API key,
renderer, Editor, or source-of-truth ownership.

## Verification

PLAN verified the returned Core lane before accepting it:

- Verified the worktree, branch, and exact Core commit locator.
- Verified the changed files:
  `src/generation/publishedStructurePdfBoundaryV1.ts`, `src/index.ts`,
  `tests/publishedStructurePdfBoundaryV1.test.ts`, and
  `docs/CORE_PUBLIC_EXPORT_BOUNDARY_REVIEW.md`.
- Ran focused Core verification:
  `npx vitest run --config vitest.config.ts tests/publishedStructurePdfBoundaryV1.test.ts --maxWorkers=1`.
- Focused Core result: 1 file / 3 tests passed.
- Ran `git diff --check main...HEAD`.
- Ran full Core gate in the WORK worktree: `npm run check`.
- Merged Core branch into Core main by fast-forward.
- Ran full Core gate again on Core main: `npm run check`.
- Core main result: 462 files / 2,957 tests passed.

## PLAN Decision

Core WORK room handoff has now been accepted by PLAN for
`lane-core-document-pdf-boundary` at Core commit
`da5011ceeac6e0b72b152a9a5029d684af978581`.

The acceptance is bounded to additive Core evidence. It does not promote
FlowDoc product truth or map truth, and it does not prove Backend or Editor
adoption.

This acceptance does not prove automatic WORK-to-PLAN return. The WORK room
did not send its Terminal Handoff back to PLAN without a user bridge, so this
room run is recorded as `manual-recovered` for product evidence only. It must
not be treated as proof that a future PLAN room can hold multiple active WORK
rooms, receive close-together returns, or process `completionQueue` without
additional automatic Return Channel evidence.

`completionQueue` status: no other returned WORK handoff was queued in this
acceptance pass.

Room run cleanup status: the Core lane branch was merged and deleted. Git
removed the lane worktree from its registry; an empty residual directory at
`C:\Users\nekot\.codex\worktrees\d63e\flowdoc-vnext-core` remained after
Windows denied direct directory deletion from this PLAN room.

## Next Recommended Lanes

Next recommended lanes:

- `lane-backend-gateway-database`: adopt or reject the accepted Core boundary
  from the Backend gateway, credential, persistence, job, artifact, and
  validation side.
- `lane-editor-structure-publish`: inspect and implement the Editor-owned
  structure creation and publish surface that can feed the accepted Core
  boundary through Backend.
- `lane-integration-evidence`: stay held back until the owner-lane handoffs
  needed for the First Delivery Slice have been accepted by PLAN.
