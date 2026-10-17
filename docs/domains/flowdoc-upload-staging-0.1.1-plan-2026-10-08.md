# Service 0.1.1 — Upload staging implementation plan

## Authority Boundary

Owner: FlowDoc Project Control. Implementation plan and bounded execution status;
the referenced Service tests/artifacts supply evidence, not this prose alone.
Spec: [next export releases, U0 contract](flowdoc-export-next-releases-draft-2026-10-08.md).
Owner authorized continuation on the normal development branch; release 0.1.0 stays
unchanged. Inline Product Implementation role applies when execution begins;
execution used Product Implementation Agent; this status update is Project Control
Steward work. Execution IDs N/A. No separate room dispatch.
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
counts are promised. Checklist groups above remain unchecked when any named proof
is outstanding. Implementation exists, but release acceptance remains pending as
recorded below; this plan does not assert release readiness.

## Development checkpoint — 2026-10-08

Historical checkpoint; the follow-up acceptance section below supersedes its
remaining-work status without erasing the original coverage gaps.

Service candidate: `9f9712c3ed33fdeb146509813f99ae15dd9b9359` on
`codex/template-registry`, package 0.1.1. Core remains pinned to 0.1.0.
U1–U3 behavior is implemented; U4 and fault-path acceptance are incomplete.
No tag, push, release promotion, system map or DOCUMENT_MAP update occurred.

Implemented: upload manifests and reservations, binary streaming, bounded Base64,
item retry, finalize, observational polling, expiry, startup reconciliation,
staging volume and configuration. URL entries remain declarations. Image fetching,
decode/resize, PDF image rendering and job claims remain outside this candidate.
The implementation keeps DB operations in `src/uploads/service.ts` rather than
creating separate `repository.ts`/`types.ts` files; the live experiment is
`tests/upload-large-live.mjs`. U1–U4 implementation was committed together, not as
separate per-stage commits. Test-first proof is partial, not claimed for every case.

Candidate defaults: 50 MiB/file, 200 MiB/set, 20 items, 1 GiB staging reservation,
100 sets, two receiving streams, Base64 1 MiB decoded / 2 MiB JSON; idle/open-ready
lifetime one hour, absolute open cap four hours, request idle 60 seconds / absolute
10 minutes, metadata tombstones 24 hours. Large-file intake measurements support
the candidate byte bounds, but disk-full and timeout proof still block final
acceptance of the limits. No image decoding safety claim follows from intake.

### Verified coverage

All locators below are relative to sibling repository `flowdoc-service`.

| Evidence | Bounded result |
| --- | --- |
| `artifacts/1791448081189/result.json` | Final 0.1.1 DB suite: 59 passed, zero failed/skipped; fresh migration/replay, SQL constraints/concurrency and existing persistence regression |
| `artifacts/1791448092185/result.json` | Final 0.1.1 API regression: three real PDFs, consumption/retention and queued/running/succeeded restart |
| `artifacts/1791447997454/result.json` | Valid PNG 3840×2160 / 24,893,018 bytes and 5120×3200 / 49,170,268 bytes; two parallel files, finalize, server restart with receipts retained |
| `tests/resource-files.test.mjs`, `tests/upload-contract.test.mjs`, `tests/uploads.test.mjs`, `tests/upload-http.test.mjs`, `tests/upload-recovery.test.mjs` at candidate | Reproducible focused storage, contract, state, HTTP and recovery checks included in final suite |

Large experiment peak server RSS was 124,780,544 bytes, below its 256 MiB assertion
budget. This measured process RSS, not a container hard memory limit or general
capacity certification. That experiment preceded the package metadata bump; the
final 0.1.1 DB/API packaged runs above followed it. Final Compose environment
forwarding passed `docker compose config --quiet`; runtime defaults were unchanged.
Build, script syntax and `git diff --check` passed. Test containers were stopped;
retained volumes and unrelated projects were not removed.

Review identified two corrected issues: deletion failure previously discarded
attempt ownership too early, and late progress could renew an already expired
session. Final recovery tests cover retained ownership/quota on unlink failure and
late arrival at expiry equality. The review itself is not a second execution proof.

### Remaining acceptance work

Before accepting 0.1.1, close the unchecked criteria with focused evidence:

- Actual or faithfully injected ENOSPC, rename-before-DB failure and uncertain
  COMMIT outcomes; generic write/unlink failure does not prove all these cases.
- Real HTTP slow/disconnected clients, idle/absolute timeout, extra-stream 429 and
  declaration mismatch, with status polling during reception. Existing real HTTP
  coverage proves chunked large intake/retry, not this entire matrix.
- Explicit expiry/finalize races, absolute-open lifetime and tombstone purge cases
  beyond the expiry/recovery cases currently tested.
- A populated 0.1.0 database upgraded through migration 004 with templates/jobs
  preserved; fresh/replay and older legacy-upgrade tests are not a substitute.
- The planned fixed-container-memory experiment (or an explicit accepted change
  to that criterion). The RSS observation above does not silently replace it.

Do not start image preparation as though this checkpoint closed upload acceptance.
Next work remains the bounded missing proof and any repairs it reveals.

### Branch correction

The implementation was accidentally committed on local `release` as `4762939`.
After confirming a clean checkout and identical pre-change development/release
trees, it was cherry-picked to development as `9f9712c`; local `release` was restored
to `ec51ce5f50be2e5aa37ebe4f72ba9f0000fe0cc7`, matching `v0.1.0`.
The resulting development tree equals the tested implementation tree. No remote
push or tag mutation occurred. This was an execution error, not an authorized
release promotion; check the actual branch before future edits and commits.

## Follow-up acceptance — 2026-10-08

PASS for bounded local upload staging. Service development commit `f7610f7`
adds proof only (two test files and the constrained large-input harness); runtime
implementation remains `9f9712c`. Owner explicitly required keeping unfinished
work off `release`; no release/tag/push occurred in this follow-up. Execution IDs
remain N/A. Scope is U1–U4 acceptance, not image preparation or production scale.

| Previously open criterion | Closing evidence in Service |
| --- | --- |
| Disk failure and file/DB split | `tests/upload-acceptance.test.mjs`: injected ENOSPC at storage boundary, transaction failure before COMMIT after rename, COMMIT applied with acknowledgement lost, restart reconciliation of renamed orphan; retry and stored-file consistency assertions |
| Real network failure and limits | `tests/upload-network.test.mjs`: live HTTP receiving-state polling, extra-stream 429/Retry-After, client disconnect, idle/absolute timers, short/oversized chunked bodies and successful retry after each failure |
| Lifetimes | Same acceptance test: absolute-open boundary, ready expiry, concurrent finalize/cleanup at expiry equality, retained expired request key and metadata purge followed by new identity |
| Existing database upgrade | Same acceptance test: migrations 001–003, real template registration and prepared job, apply only 004, compare every existing domain table before/after and reload template/job |
| Hard memory boundary | `artifacts/1791449637499/result.json`, generated `memory.yaml`, and asserted `/sys/fs/cgroup/memory.max` in `tests/upload-large-live.mjs`: fixed 768 MiB memory/swap ceiling including fixture client and server; same two large valid PNG sizes, two concurrent streams, finalize/restart; server peak RSS 122,417,152 bytes |

Final packaged database run: `artifacts/1791449701255/result.json`, 69 passed,
zero failed/skipped; runtime image
`sha256:bf83b122c7d67fb19d1b7f8b047252f7c6412357194366d11ad25bbe6b632ead`.
This includes existing PDF/API tests and migration/restart checks. The prior
standalone API result `1791448092185` remains reusable because product code,
dependencies and runtime configuration did not change in this follow-up.
Build within the packaged check, new test syntax and diff whitespace checks passed.
The first run had one invalid upgrade fixture (prepared job lacked its required
version pin); corrected with Core's `prepareGeneration`, then reran successfully.
All test containers from this follow-up were stopped; volumes were retained.

Rulings: ENOSPC is injected at the storage API boundary, not by filling the host
disk. COMMIT ambiguity is injected around a real PostgreSQL transaction. Timeout
tests use shorter configured durations to exercise the same paths. These prove
the scoped failure handling, not every operating-system crash mode. The hard
container limit includes image-fixture generation, hence 768 MiB, while the server
RSS budget remains 256 MiB. No throughput, decoder-safety or production-capacity
claim is made. Existing implementation review is reused for this test-only change.

The original procedural checklist remains as planning history (including its
unmet test-first/per-stage-commit sequence); this criterion-to-evidence matrix
closes the functional acceptance gaps instead of retroactively claiming that
sequence occurred. Local 0.1.1 staging is accepted; release integration is not
performed. Next proposed development is 0.1.2 image preparation, under its own
bounded plan. Core and system maps remain unchanged.
