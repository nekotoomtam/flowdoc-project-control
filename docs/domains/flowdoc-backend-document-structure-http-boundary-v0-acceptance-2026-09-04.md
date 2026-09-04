# FlowDoc Backend Document Structure HTTP Boundary V0 Acceptance

## Authority Boundary

This document is the PLAN-owned Room Run Registry and acceptance note for `dispatch-backend-document-structure-http-boundary-v0-2026-09-04-01`.

It records the WORK room locator, automatic return, liveness state, code-review repair, `acceptanceGate` decision, Backend main merge, and Backend verification for the bounded document-structure HTTP boundary lane. It does not edit Core, Backend, or Editor behavior and does not prove API-key readiness, production database readiness, PDF readiness, artifact readiness, Editor integration, FlowDoc product truth, release readiness, frontend readiness, or map truth.

## Dispatch Set

- Dispatch set ID: `dispatch-backend-document-structure-http-boundary-v0-2026-09-04-01`
- PLAN task/chat ID: `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- `parallelLimit`: `1`
- Reason for `parallelLimit`: the lane changes a Backend public HTTP/API boundary and repository revision behavior, so dependent Editor integration is held until this contract is accepted.
- Return order policy: single-lane dispatch; process returned handoff through `acceptanceGate`.
- Active Return Command: `send_message_to_thread` back to PLAN task/chat ID `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- Liveness policy: `clientThreadId` alone is not a monitorable retrievable locator. PLAN resolved the created WORK task through session/worktree locators before acceptance.
- Acceptance policy: PLAN stages the terminal handoff in `handoffInbox`, checks required fields, verifies the exact Backend commit, merges only after acceptance, and does not patch Backend product files after dispatch.

## Room Run Registry

### room-backend-document-structure-http-boundary-v0-2026-09-04-01

- Status: `accepted`
- Lane ID: `lane-backend-document-structure-http-boundary-v0`
- Work Type: `product-implementation`
- Owner repository: `repo-backend`
- Active role: `product-implementation-agent`
- Work path: `flowdoc-product-development-resumption > flowdoc-first-delivery-round > lane-backend-document-structure-http-boundary-v0`
- Codex task/chat ID: `01a06d2c-b5d5-77b1-b189-f66a152b4153`
- Initial client locator: `client-new-thread:39c8dcec-6561-4b92-b009-5806803c2d73`
- Worktree locator: `C:\Users\nekot\.codex\worktrees\cf3a\flowdoc-vnext-backend`
- Branch locator: `codex/backend-document-structure-http-boundary-v0`
- Locator discovery method: session index plus Backend git worktree locator after `create_thread` first returned only `clientThreadId`
- Context Acknowledgement status: completed
- Return handoff ID: `handoff-backend-document-structure-http-boundary-v0-2026-09-04-01`
- Evidence target: `evidence-backend-document-structure-http-boundary-v0-2026-09-04`
- Automatic return status: `automatic-returned`
- Terminal status: `PASS`
- Accepted Backend lane commit: `eddf727fabef035862c91d3af9eb04b884c8ac6d`
- Accepted changed paths: `src/documentStructure/documentStructureRepository.ts`; `src/documentStructure/documentStructureSqliteRepository.ts`; `src/http/server.ts`; `src/index.ts`; `src/routes/documentStructureRoute.ts`; `src/server.ts`; `src/tests/documentStructureRepository.test.ts`; `src/tests/documentStructureRoute.test.ts`
- Accepted behavior: Backend now exposes `/document-structures` HTTP endpoints for draft save/read, version freeze/read, active publication publish/read, and field-type master listing. Draft save and publication publish require `baseRevision` and use repository-level conditional write methods for Backend revision gating. Malformed document-structure JSON returns the document-structure status/error envelope. The default local Backend server mounts an in-memory document-structure repository for this route.
- WORK verification included: `npm install`, baseline `npm test -- src/tests/documentStructureRepository.test.ts`, RED `npm test -- src/tests/documentStructureRoute.test.ts`, review-fix RED route tests reproducing race and malformed nested JSON failures, focused GREEN `npx vitest run --config vitest.config.ts src/tests/documentStructureRoute.test.ts --maxWorkers=1`, `npm run type-check`, neighboring tests, and final post-commit `npm run check`.
- PLAN verification: `npm run check` passed on the WORK worktree at `eddf727fabef035862c91d3af9eb04b884c8ac6d`, then PLAN fast-forwarded Backend `main` to the same commit and `npm run check` passed again on Backend `main` with type-check, full tests, and build. The full tests reported 94 files passed / 1 skipped and 351 tests passed / 27 skipped.
- Review handling: WORK spawned a read-only reviewer for `9da58214e087d2f15afd43855bfd1febec882037..89fd5b68e009b1064be5234d959b65b0ffd902cc`. The reviewer found non-atomic stale gates and malformed JSON envelope gaps. WORK repaired those issues in the same lane before terminal handoff, producing final commit `eddf727fabef035862c91d3af9eb04b884c8ac6d`.
- Setup risk: the WORK room installed dependencies and created a local sibling Core junction at `C:\Users\nekot\.codex\worktrees\cf3a\flowdoc-vnext-core` to satisfy the repository's file dependency path. This is local setup state, not product behavior.
- Package risk: `npm install` reported 2 high severity audit findings; the lane did not change dependency policy or audit state.
- Intentionally not changed: no Editor UI/runtime behavior, no Core semantic rewrite, no Project Control product behavior, no real API key or secret behavior, no production binding, no durable production database rollout, no runtime submitted values, no PDF generation, no renderer execution, no artifact byte storage, no worker/queue, no permission, no billing, no audit trail, and no activity feed.

## PLAN Decision

PLAN accepts `lane-backend-document-structure-http-boundary-v0` as a bounded Backend product implementation lane.

Accepted product commit:

- Backend main commit: `eddf727fabef035862c91d3af9eb04b884c8ac6d`

Accepted bounded behavior:

- Backend document-structure draft/version/publication operations are exposed through a bounded HTTP route.
- Draft save and publication publish use Backend-owned `baseRevision` gates at the repository write boundary.
- Malformed document-structure JSON returns the document-structure route envelope instead of escaping to unhandled service assumptions.
- The local server mounts an in-memory document-structure repository for this route.

This record does not promote FlowDoc product truth or map truth. It does not prove API-key readiness, production database persistence, production deployment, Editor adoption, Core adoption beyond existing contracts, runtime submission persistence, submitted values, PDF files, renderer jobs, artifact storage, permission behavior, workflow, billing, audit, activity feed, end-to-end readiness, release readiness, or full frontend readiness.

## Required Next PLAN Handling

The next high-value lane is an Editor integration lane that connects the accepted Editor Build/Preview/Publish surfaces to this accepted Backend document-structure HTTP boundary. That lane must remain Editor-owned and should treat API-key behavior, production persistence, PDF generation, and runtime submission as still out of scope unless PLAN opens separate Backend/Core lanes.

Backend document-structure route changes should keep race/stale tests and malformed JSON envelope tests as required acceptance checks.

Manual recovery may use task ID, worktree, branch, commit, or session locator only to recover or classify a missed automatic return. Manual recovery does not satisfy automatic return.

## Intentionally Not Changed

- No Core behavior changed in this dispatch.
- No Editor behavior changed in this dispatch.
- No Project Control product behavior changed by this acceptance note.
- No generated PDF file, renderer job, artifact byte storage, runtime submission, user permission, workflow, billing, audit trail, activity feed, dataset, or external API-key behavior added.
- No FlowDoc product truth or map truth promoted.
