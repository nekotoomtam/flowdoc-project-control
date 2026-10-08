# Image preparation and PDF integration — implementation plan

## Authority Boundary

Project Control owns this plan; Service/Core own code and tests. Governing design:
[I0](flowdoc-export-next-releases-draft-2026-10-08.md#i0-design-proposal--2026-10-08).
Owner approved that design, then confirmed 200 DPI as the initial value with actual
size legibility as acceptance, and repeatedly authorized starting implementation.
Inline Product Implementation Agent; execution IDs N/A. Work size multi-step,
risk routine with untrusted image/URL inputs requiring bounded processing.
No release, push, tag, public deployment, DOCX, tables-with-images or inline images.
Use existing clean development checkouts; no concurrent product lane is dispatched.
No separate agent rooms. Record progress here, not in product plans or maps.

## Sequence and proof budget

- [x] A / I2 foundation: Service `src/images/prepare.ts`, `worker.ts`, `types.ts`,
  focused `tests/image-preparation.test.mjs`, pinned Sharp dependency. Input is an
  internally resolved source path, frame in points, owned output directory and
  AbortSignal. Output is an owned prepared file descriptor plus warnings, or a
  skipped-image result. Child process is killed on timeout/cancel; never let a
  caller-supplied path reach this API from HTTP. JPEG quality 90, lossless alpha PNG,
  EXIF orientation, 200 DPI, no pixel upscaling, 40 MP input / 8 MP target output.
  Prove landscape/portrait, alpha, orientation, corrupt/unsupported/oversized input,
  small-image warning, invalid frame, cancellation and timeout cleanup. Test module
  first for missing capability, then implement and verify local and Linux package.
- [x] B / I0+I3: Core image field/block validation, binding, prepared resource map,
  layout and PDF JPEG/RGB-alpha objects. Preserve old snapshots; image frame moves
  intact across pages and over-page frame fails validation. Tests cover missing
  bindings/resources, malicious lengths, deduplication and non-image regressions.
- [ ] C / I1: Service additive migration for atomic upload/job claim and processing
  progress/warnings, resource pinning and terminal cleanup. URL retrieval validates
  and pins public destinations at each redirect. Compose once; no re-download in
  layout/paint. Prove duplicate/conflicting claims, expired/wrong-set IDs, restart,
  URL failures, queued/running retention and one-hour terminal cleanup.
- [ ] D / I4: Pack Core, pin/checksum in Service, run upload-to-PDF fixtures and
  baseline exports in isolated Docker projects. Inspect actual PDF pages at intended
  size and embedded image dimensions. Measure decode under fixed memory constraints.
  Prepare version metadata only after integration is demonstrated; leave release alone.

Proof budget: focused checks after each changed area, one final packed acceptance
per affected package, one bounded visual fixture set. New failures justify repair
and relevant reruns. Existing unchanged upload proofs remain reusable. Stop when
acceptance passes. Do not call stage A completion whole 0.1.2 completion.
Document budget: this plan, existing roadmap, code-adjacent README changes only.

## Decisions / execution ledger

- 200 DPI is a starting preparation density, not a promise to restore missing detail.
  Warn when source effective density is lower; visual legibility remains required.
- Start A before job wiring because it is independently testable and isolates native
  decoder/package risks. This reorders I1/I2 implementation without changing scope.
- Candidate decoder: Sharp 0.35.5, registry reports Node >=20.9.0; verify pinned
  native package on the existing Node24 Linux/amd64 runtime before accepting it.
- Initial plan had no completed stages; subsequent execution is recorded below.

## Stage A result — 2026-10-08

Service development commit `99aac86` implements the internal preparer with pinned
Sharp 0.35.5. It is not wired into job admission/rendering yet; package version
stays 0.1.1 during development. Core remains unchanged. The caller must provide
trusted Service-resolved paths; HTTP never exposes this internal function.

Observed test-first failure: seven cases failed for missing `prepareImage`.
The initial implementation passed those after a TypeScript IPC signature repair.
Additional failing tests caught concurrent decoder admission and incorrect density
reporting (source density rather than derivative density); both were corrected.
Nine focused tests pass on Windows and Linux. Review found no source defect and
flagged that cancellation could precede actual child creation; the final test now
observes the real spawned child and verifies its termination before the next call.

Packaged Linux build/database regression:
`flowdoc-service/artifacts/1791451436965/result.json`, 78 passed, zero failed/skipped;
runtime image `sha256:ccbb05f6a72122fcef2818692f1bf00b21c6599db2ff971a543cf9ef6cf01d88`.
Final stronger cancellation test reused that unchanged runtime with only the test
file mounted read-only and networking disabled: nine passed, recorded in
`artifacts/image-preparation-linux-final.log`. Build and final diff checks passed.
Trailing blank-line normalization after tests changes no executable content.
Test containers stopped; release/tag 0.1.0 still resolve to `ec51ce5` in Service.
No push, promotion or map update occurred.

Remaining: B/C/D, including actual-size PDF image quality review and constrained
decode memory measurement. Solid-colour functional fixtures do not prove text in
screenshots stays legible. Prepared files currently remain caller-owned; automatic
job-linked lifetime will be implemented in C. This stage does not claim 0.1.2 done.

## Stage B1 result — 2026-10-08

Core development commit `47ac31d` implements the resolved-document/PDF portion of
B. B stays unchecked: template image fields/binding are still pending, followed
by Service job integration. Service was not modified or repinned in this slice.

Contract: resolved node model 5 permits root `image` nodes with explicit width,
height and resourceId; model 4 retains its existing allowed nodes. Template model
4 still rejects image templates. `generatePdf(document, imageResources)` accepts
bounded JPEG or normalized RGB/alpha bytes separately from JSON. Validate pixel,
plane-length, JPEG header/scan structure and aggregate byte limits before making
exact-length owned snapshots. Core does not decode untrusted originals or fetch
URLs. Header/scan validation is not a substitute for Service's decoder stage.

Layout reserves the authored frame, centers proportional content, moves whole
frames to the next page and rejects oversized frames. Missing resources leave
blank space with a node-specific warning. PDF reuses an image object across repeated
references; JPEG is DCT data, RGB and alpha are compressed image/soft-mask objects.
The PDF identity now incorporates embedded image content. Old non-image drawing
and PDF paths remain intact.

Evidence in Core:

- `tests/pdf/images.test.ts`: initial four missing-capability failures, then green;
  subsequent failing identity and review cases repaired and verified.
- `artifacts/image-core-tests-reviewed.log`: 135 tests passed; build passed.
- `artifacts/1791452246659/result.json` and `image-result.json`: final Linux/amd64
  packed public consumer passes image, existing text, binding and table checks.
- `artifacts/1791452246659/images.pdf`: two-page synthetic fixture with JPEG reuse,
  alpha, frame break and missing-resource warning. Poppler page PNGs inspected;
  final rendered PNG hashes equal the inspected pre-review render on both pages.
  This proves placement/alpha, not screenshot text legibility at 200 DPI.

Review found two issues, fixed before commit: incomplete JPEG with no scan could
pass; structuredClone copied oversized backing buffers and retained shared storage.
Tests now reject that JPEG and check exact-owned copies of ArrayBuffer and
SharedArrayBuffer views. All final diff checks passed. Package metadata remains
development 0.1.0; diagnostic tarballs are not published or used to replace the
accepted Service vendor artifact. Core release/tag still equal `1aeacd0`; no push,
tag or release changes. No maps updated. Next: image variable/binding, then C/D.

## Stage B2 and image master result — 2026-10-08

Owner confirmed adding the image variable master. Core commit `e457f1b` and
Service commit `9644a11` complete B on development branches. Inline execution IDs
remain N/A. This update records bounded results, not whole-release readiness.

Service migration `005_image_variable_type.sql` adds `110004 image` to the existing
variable type master. Current and version variables reference the same master;
publication creates independent version variable IDs and preserves their types
after current variables are removed. No node master tables are introduced.
URL and uploaded-file sources remain resource source kinds, not variable types.

Core model 5 templates bind global/local image fields to root image blocks using
resource UUID strings. The node owns width/height. Optional omitted images bind
to an empty value; required and supplied values are validated. URL/Base64 values,
image fields in array items, table-cell images and model 4 image templates remain
unsupported. Existing non-image contracts are preserved.

Evidence and coverage:

- Core `tests/binding/imageFields.test.ts` covers scoped binding, invalid values,
  legacy/array rejection and optional images. `artifacts/image-binding-all.log`
  records 139 passing tests; build passed.
- Core `artifacts/1791453902993/result.json` records the passing Linux/amd64 packed
  consumer. `tests/consumer/checkImages.mjs` also exercises the public template to
  bound-image PDF path, producing `bound-image.pdf` in that artifact directory.
- Service `tests/image-master.test.mjs` covers master mapping, publication isolation,
  master FK protection and admission guarding. Upgrade coverage confirms migration
  005 preserves existing domain rows. Final packaged database run
  `artifacts/1791454119696/result.json`: 81 passed, zero failed/skipped, including
  existing export and persistence regressions.
- Service pins Core 0.1.1 from commit `e457f1b7698c3ff944082371d47f8e3db29be557`;
  SHA-256 `a61f7040c039ee214abe5b06651f4e869bdc3b79e89a02e15f254cf0c2d52db8`.
  Vendor verification passed. Service stays development 0.1.1.

Failing checks exposed an old non-string-to-array mapping fallback and admission
of image jobs before resources were connected. Both were corrected. Until C is
implemented, selected image templates return `IMAGE_JOBS_UNAVAILABLE` (HTTP 422)
before job insertion, avoiding a successful export with silently missing images.
Bounded independent review found no remaining actionable defects.

Product working trees were clean after commits; final diff checks passed and test
containers were stopped. Release/tag refs remain Core `1aeacd0` and Service
`ec51ce5`; no push, release promotion or map update. C/D remain pending, including
resource claims, preparation-to-job wiring, actual-size legibility and constrained
memory acceptance. These results do not establish end-to-end API image support.

## Stage C1 kickoff — 2026-10-08

Owner authorized the next step. Service owns this inline implementation on
`codex/template-registry`, base `9644a11`; Project Control Steward records results
here. Execution IDs N/A. Routine risk, bounded scope: internal atomic set/job claim
and original-file lifetime only. Core, release and public image admission remain
unchanged. C2 will connect preparation, URL retrieval, progress and rendering.

Ruling: establish and test the transaction/lifetime boundary before removing the
image admission guard. This prevents partially integrated API jobs from producing
blank images. Existing upload recovery deletes unreferenced files, so prepared
derivatives must get explicit ownership in C2 before using that storage.

C1 acceptance: ready/nonexpired set only; all referenced resources belong to it;
one set per job; concurrent identical retries return one job; changed input/version
conflicts; failed insertion rolls back the claim; queued/running claims survive
expiry/recovery; terminal claims retain originals for one hour then release bytes.
Proof: focused real PostgreSQL tests, existing upload regressions, one packaged
database check and a bounded review. Document budget remains this plan and local
README. No new execution registry or product map update.

## Stage C1 result — 2026-10-08

Service development commit `58999c1` adds migration 006 and internal
`src/uploads/claims.ts`. The session row lock serializes claims and cleanup;
job insertion and ownership commit together. JSONB equality checks the original
request, prepared input, selected version and normalized resource IDs on retry.
Only references belonging to the finalized set can enter a new claim. A failed
job insert rolls back without consuming the set. The caller must derive resource
IDs from composed nodes; this internal function is not an HTTP input validator.

Upload polling exposes `claimed` with no expiry during queued/running work.
Cleanup protects originals through recovery and retains them until terminal
finished_at plus one hour; then existing deletion/quota cleanup applies. Prepared
derivative ownership and public image admission remain C2 work. Stage C remains
unchecked; no end-to-end API image support is claimed.

Verification:

- New `tests/upload-claims.test.mjs` first failed all four tests because the claim
  function was absent. It now verifies concurrent retries, changed input/version,
  open/expired/wrong-set references, insertion rollback and original-file lifetime
  across queued/running recovery and interrupted-job failure.
- Focused claim/upload/recovery suite: 12 passed. Packaged database run
  `flowdoc-service/artifacts/1791454877554/result.json`: 85 passed, zero failed or
  skipped, migration replay, populated upgrade preservation and existing export
  regressions included. Build and final diff checks passed.
- First packaged run caught two old fixed migration/table inventories, updated to
  include migration 006 and its table. A subsequent infrastructure attempt failed
  before tests because Docker's address pool was exhausted. Removed only inactive
  current-turn test containers/networks, retained volumes, and reran successfully.
- Bounded read-only review found no actionable correctness/security findings.

Core and its vendor pin remain unchanged. Service release and peeled v0.1.0 remain
`ec51ce5`; no push or release promotion. Existing plan updated only; no maps or
execution records created. Next C2: resource preparation/URL retrieval, derivative
ownership, persisted progress/warnings and rendering integration, then D acceptance.
