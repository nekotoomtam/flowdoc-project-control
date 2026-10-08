# Service 0.1.1 — Upload staging implementation plan

## Authority Boundary

Owner: FlowDoc Project Control. Written plan for review, not implementation Evidence.
Spec: [next export releases, U0 contract](flowdoc-export-next-releases-draft-2026-10-08.md).
Owner authorized continuation on the normal development branch; release 0.1.0 stays
unchanged. Inline Product Implementation role applies when execution begins;
current task is Planning Partner. Execution IDs N/A. No separate room dispatch.
Scope is Service `codex/template-registry`, based on `5141622`; Core stays pinned
to 0.1.0. Confirm clean candidate before editing. No image decode/resize/PDF changes,
URL fetching, public deployment, authentication, media library or byte-resume.

## Goal and boundaries

Accept bounded multi-image upload sets, persist completed bytes, expose truthful
polling status, permit item retries, finalize complete manifests and clean up after
the agreed lifetime. Large originals use binary streaming; small Base64 requests
are bounded before decoding. Do not embed bytes into original/prepared job JSON.
URL entries are declarations, not downloaded images. No new image job acceptance
in 0.1.1; old `/jobs` behavior and PDF retention remain intact.

Use installed Fastify 5.12.5 custom stream parser, Node stream pipeline and current
PostgreSQL18 stack. Local Fastify `docs/Reference/ContentTypeParser.md` distinguishes
custom stream handling from `parseAs` buffering: the stream path must enforce its
own actual-byte and length limits. Do not assume the buffered parser does that work.

Proof budget: targeted tests per task, one final isolated migration/integration run,
and old API export smoke for server wiring impact. Reuse Core proof unchanged.
Document budget: this plan, the existing draft and Service README only.
No automatic extra reviewers or rooms. Stop for unresolved storage ownership,
request safety, scope expansion or failed required acceptance.

## U1 — Contract, persistence and bounded reception

Files: create `src/uploads/types.ts`, `config.ts`, `validation.ts`, `repository.ts`,
`service.ts`, `src/storage/resource-files.ts`, `src/http/uploads.ts`,
`migrations/004_upload_staging.sql`, `tests/uploads.test.mjs`,
`tests/resource-files.test.mjs`, `tests/upload-http.test.mjs`.
Modify `src/http/server.ts` to register encapsulated upload routes.

Interfaces: `readUploadConfig(env): UploadConfig`; `validateManifest(input)`;
`createResourceFiles(root)` owns generated paths, exclusive temp creation, streaming
write with SHA256, rename/open/stat/remove; `createUploads({pool,files,config,clock})`
exposes create/get/receive/finalize/cleanup/recover. Return existing Result envelopes.
The receive input is an AsyncIterable of bytes with AbortSignal, never one giant
Buffer for binary. Keep DB transactions short; do not hold a pool connection while
waiting for a slow client. Persist attempt ownership before writing bytes.

- [ ] Write tests first: duplicate key, invalid source/URL/size, requestKey retry
  same/different digest, unique session-item relation, nonexistent item, oversized
  actual bytes even without Content-Length, premature EOF, disconnect and ENOSPC.
- [ ] Run focused tests on isolated DB and verify intended missing capability fails.
- [ ] Implement additive migration and strict manifest contract from U0. Reserve
  session declared bytes under a DB lock to enforce total capacity atomically;
  account in-progress/orphan bytes conservatively until reconciled, not just ready rows.
- [ ] Build binary route parser without parseAs and stream with backpressure.
  Enforce stream slots before consuming body, actual byte count, expected size,
  idle and absolute timeout, and shutdown abort. Reject unsupported Content-Encoding.
  Base64 route uses bounded JSON, strict encoding validation and decoded length cap.
- [ ] Store to generated attempt `.part`, publish receipt only after completed file
  and DB transition. For completed-item retry, stream/hash incoming bytes without
  mutating the accepted file; identical returns old receipt, different returns 409.
- [ ] Verify two simultaneous attempts cannot overwrite one item; release all stream
  slots and quota reservations after success/failure, preserving DB ambiguity for recovery.
- [ ] Build and run affected tests; inspect diff and commit U1 only after PASS.

## U2 — Finalize and polling

Files: extend `src/uploads/repository.ts`, `service.ts`, `src/http/uploads.ts` and
`tests/uploads.test.mjs`, `tests/upload-http.test.mjs`.

- [ ] Test receiving/incomplete blocks finalize; completed upload plus declared URL
  can finalize; repeated finalize returns same result. ready forbids mutation.
- [ ] Test get status returns counts and item states, never Base64, local paths or
  sensitive URL query strings; GET does not update last_progress_at or expires_at.
- [ ] Implement session row locking for finalize/receive/expiry transitions. Count
  URL declared separately from bytes received; no fake downloaded count.
- [ ] Throttle persisted byte-progress updates (time/byte threshold), do not issue
  one SQL update per chunk. Always flush terminal counts. Polling is observational.
- [ ] Verify safe error mapping, 429 with retry guidance and unchanged `/jobs` validation.
  Run focused tests/build, review diff and commit.

## U3 — Lifetime, recovery and startup wiring

Files: extend uploads service/repository/resource-files; modify `src/server.ts`,
`compose.yaml`, `.env.example`; add `tests/upload-recovery.test.mjs`.

- [ ] Use injected clock to test idle 1h, ready 1h, absolute-open cap, boundary equality,
  and poll not extending life; test expiry racing finalize and active stream completion.
- [ ] Implement a separate staging volume/root; cleanup only owned names. Under the
  existing single-instance coordinator, recover abandoned attempts before accepting
  uploads; do not delete live files via PDF cleanup.
- [ ] Test rename-before-DB crash, uncertain commit, failed deletion and orphan disk
  quota reconciliation. DB must not expose received when bytes cannot be recovered.
- [ ] Expire bytes first through retryable retirement; keep minimal id/requestKey/digest
  tombstones for a proposed 24h, then remove metadata. Expired key after tombstone purge
  may create a new session; document bounded idempotency. Never reuse expired resource IDs.
- [ ] Expose config for lifetimes, metadata lifetime and limits; validate before startup.
  Graceful close stops new reception, aborts/drains streams, then closes DB.
- [ ] Do not add unused job FK/claim endpoint. U0 one-set/one-job design is reserved
  for I1; no claim that job protection has been implemented in this release.
- [ ] Run affected lifetime/recovery/startup tests, build and diff review; commit.

## U4 — Large-original experiment and packaged acceptance

Files: add `tests/upload-stream-live.mjs`, `scripts/checkUploads.mjs`,
`examples/upload-client.mjs`; update `README.md`, package script and existing migration
expectations in `scripts/checkDatabase.mjs` and affected tests after migration 004.

- [ ] Prepare synthetic valid JPEG/PNG originals with recorded byte sizes and pixel
  dimensions, including 4K and files above 10 MiB. Clearly separate transport stress
  bytes from valid-image fixtures; do not claim arbitrary bytes prove image support.
- [ ] In a dedicated Docker project, exercise raw HTTP streams rather than inject-only:
  slow sender, dropped connection, retry, two uploads together, extra stream rejection,
  chunked body, undersized/oversized declaration and status reads while uploading.
- [ ] Use configurable trial bounds for 10/25/50 MiB originals before selecting default;
  update aggregate quota coherently for each experiment. Record peak RSS and bytes
  accepted; compare under fixed container memory and confirm bounded streaming rather
  than memory growth proportional to entire accepted payloads. This is bounded intake
  proof, not general high-load capacity or decode safety.
- [ ] Select/document final limits from measurements; if no safe useful bound emerges,
  report blocker instead of claiming large-original support. Keep Base64 small and
  independent. Pixel/decode/target-DPI checks remain I0–I2.
- [ ] Verify migrate existing 0.1.0 DB without losing templates/jobs, restart staged
  resources, expiry and filesystem/DB consistency. Run existing export/API regression
  in the final packaged candidate once. Stop test containers; preserve unrelated projects.
- [ ] Record result/artifact identity and reusable evidence here; remove no previous
  accepted release. Update package/lock/Compose version to 0.1.1 only at release
  preparation and test that final candidate before tag. Core remains 0.1.0.

## Review focus / acceptance gaps

Critical cases have owners: U1 handles byte-limit bypass and concurrent overwrite;
U2 handles misleading URL-ready state and finalize races; U3 handles disk/DB split
and restart; U4 handles real streaming/memory and upgrade evidence. No new test
counts are promised. All tasks pending; defaults and metadata lifetime are design
choices to validate before release. This plan does not assert readiness.
