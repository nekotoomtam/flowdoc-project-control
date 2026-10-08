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
- [ ] B / I0+I3: Core image field/block validation, binding, prepared resource map,
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
