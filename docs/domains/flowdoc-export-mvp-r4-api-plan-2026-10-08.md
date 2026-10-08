# Export MVP R4 API and job implementation plan

> For agentic workers: use superpowers:executing-plans inline, task by task.

## Authority Boundary

Owner: Project Control for this plan; Service for implementation. Role: Planning
Partner / Documentation Synthesizer. Owner requested continuation after current/
version acceptance. This is the detailed R4 plan for review, not runtime evidence.
Inline work, execution/Phase/Checklist IDs not applicable. Medium size, routine
risk. No old execution context is reopened. No code/migration change in this plan.

**Goal:** localhost API accepts document data, persists a pinned queued job,
processes one job at a time, and serves its status and PDF after restart.
**Spec:** [MVP API/state contract](flowdoc-export-mvp-v1-2026-10-07.md#api-และสถานะงาน),
[R1 Service/Core boundary](flowdoc-export-mvp-r1-design-2026-10-07.md).
**Baseline:** Service `138269c` / dev.2, installed Core dev.4; current/version
[acceptance](flowdoc-export-mvp-current-version-plan-2026-10-08.md#acceptance--2026-10-08-completed).
**Stack:** existing PostgreSQL18/pg/Node24 and Fastify as selected in R1.
Pin a compatible Fastify release and its lockfile at implementation; no queue broker.

Scope: public contract read, job admission/status/download, serial processor,
local file storage and restart behavior. Excludes UI, authentication/permissions,
media, DOCX, progress percentage/ETA, automatic retries and multi-instance service.
Publication retry tokens are not automatically a job-submission idempotency promise.

Document budget: this plan, current-version next-step link, delivered Service
README/AGENTS. Proof budget: focused RED/GREEN, real isolated DB/API/PDF/restart
acceptance and one fresh final code review. No broad benchmark or extra audit.
Use clean current development branch per owner preference; reconsider isolation
only if another writer or conflicting change appears. Recheck guides/state at start.

## API contract proposed for this slice

All JSON routes use existing Result shape: ok/value/warnings or ok:false/issues/
warnings. Core diagnostics keep useful public paths/content indices; no SQL,
filesystem path, stack trace or native process output returned to callers.

| Route | Success | Failure |
| --- | --- | --- |
| GET /health | 200 readiness; DB/runtime/processor initialized | 503 unavailable |
| GET /templates/:docKey/contract?version=N | 200 selected version, globalSchema, format key/label/description/inputSchema and examples | 400 invalid version, 404 missing key/version |
| POST /jobs | 202 jobId, selected version, queued, hasWarnings, warnings, skippedContentIndices | 400 malformed JSON/shape, 413 body bound, 404 template/version, 422 Core input validation, 503 storage/runtime unavailable |
| GET /jobs/:jobId | 200 persisted status/version/warnings/skips/errors, download URL only on success | 400 malformed UUID, 404 absent |
| GET /jobs/:jobId/pdf | 200 application/pdf attachment stream | 400 malformed UUID, 404 absent job, 409 not succeeded, 410 output file missing, 503 storage failure |

No graph, host file path or full internal prepared input in contract/status output.
Payload remains docKey, optional version, data and ordered content[] from R1.
Initial request body cap proposed 2 MiB, configurable and documented; it is an
operational bound, not a new content/node schema or claimed large-document capacity.
No broad CORS enablement needed without a frontend. Compose publishes API only
on 127.0.0.1; DB stays on internal network. Container listens on its interface.

## Processing and failure contract

Admission loads immutable version once, calls prepareGeneration, and stores
original input plus Core prepared input/warnings/skips with that version FK.
Validation errors create no job. Unknown format warnings follow Core behavior.

One coordinator starts after migration and resource initialization. A dedicated
PostgreSQL advisory-lock connection rejects accidental second coordinators;
connection loss stops admission/processing. This prevents local mistakes, not a
multi-instance availability promise. Startup marks pre-existing running jobs
failed with PROCESS_INTERRUPTED before claiming queued jobs in created_at,id order.

Claim queued→running transactionally. Resolve the pinned version ID, revalidate
stored prepared data via Core composition boundary, never select latest again.
Render in one child process at a time, keeping synchronous layout off the HTTP
event loop. The parent owns DB transitions and output storage. Child receives
only immutable render input and packaged runtime configuration, with no DB access.
Child crash/render failure gives sanitized failed state; no automatic retry.
Set a documented configurable render deadline and output size guard during
implementation; classify them as execution failures, not successful partial PDFs.

Write bytes to a unique temp file inside configured output directory, then rename
to a server-generated job filename. In a DB transaction insert output metadata
and transition running→succeeded. Only then expose a download. On write/metadata
failure report failed if DB is available; uncertain DB outcome must be reconciled
on restart, never overwritten blindly from succeeded to failed. Crashes may leave
unreferenced files, which are not downloadable; no general cleanup feature added.
Output directory is a persistent named volume and paths never come from requests.

Graceful shutdown stops admission/claiming and lets the active child finish within
the shutdown bound; forced exit leaves running for startup recovery. Queued jobs
remain durable. No exactly-once claim. File metadata alone does not prove file exists.

## Task 1 — Job repository and admission

Files: add src/jobs/repository.ts, admission.ts, types.ts;
tests/jobs.test.mjs; use existing templates/registry.ts and Core root exports.
Only add migration 003 if an actual required constraint cannot be implemented with
the existing four lifecycle fields/tables. Do not change applied migrations.

Interfaces: submitJob(pool,input): Promise<Result<JobReceipt>>;
getJob(pool,id): Promise<Result<JobView>>; claimNextJob(client): Promise<Job|null>;
failInterruptedJobs(client): Promise<void>. JobView excludes internal data/paths.

- [ ] Write failing tests for invalid/no-job, warning persistence, selected version
  pin, FIFO claim, conditional state transitions and interrupted-running recovery.
- [ ] Implement parameterized transactional admission and lifecycle operations.
  Check update row counts to prevent double completion or terminal-state overwrite.
- [ ] Test later template publication cannot change accepted prepared input;
  missing/invalid IDs and unknown-format-only requests follow Core contract.
- [ ] Run build and focused real-DB tests; inspect diff and commit.

## Task 2 — Renderer process and durable output

Files: add src/jobs/processor.ts, render-child.ts, src/storage/pdf-files.ts;
tests/processor.test.mjs, tests/pdf-files.test.mjs.
Interfaces: startProcessor(dependencies): Promise<{stop():Promise<void>}>;
renderPinnedJob(job,template): Promise<Result<PdfArtifact>>;
writePdf(jobId,bytes): Promise<OutputMetadata>; openPdf(metadata): Readable.

- [ ] Write failing tests for exactly one active render in a three-job sequence,
  child crash/timeout, file write failure, output metadata failure and missing file.
- [ ] Implement coordinator lock, startup recovery and isolated render child;
  reuse Core public loadBundledResources/createPdfEngine/composeDocument.
- [ ] Implement generated filenames, temp/rename, output transaction and safe
  failure reconciliation. Never accept a caller-supplied download path.
- [ ] Prove HTTP event-loop work can progress while rendering; process failure
  does not silently hang the next queued job. Run focused tests and commit.

## Task 3 — Fastify routes and local server

Files: add src/http/server.ts, routes.ts, errors.ts, src/server.ts;
tests/http.test.mjs; update package/lock and CLI serve entrypoint if used.
Interface: createServer(dependencies): FastifyInstance; injectable processor/files
for deterministic route failures, plus real integration in Task 4.

- [ ] Pin Fastify version; write route tests before handlers with exact status codes
  above, JSON limits, malformed UUID/version and safe diagnostic assertions.
- [ ] Implement contract projection without graph leakage, admission, job view,
  PDF streaming and readiness. Disable framework/internal error details in responses.
- [ ] Wire startup/shutdown with the processor and persistent DB/file configuration.
  Keep migration/registration explicit setup commands, not per-request work.
- [ ] Run build, route tests and affected CLI/repository tests; commit.

## Task 4 — Isolated localhost acceptance and release

Files: compose.yaml, Dockerfile as required, scripts/checkApi.mjs,
tests/api-restart.mjs, README/AGENTS, package/lock Service dev.3.
Add API/output-volume without removing registry commands or old DB checks.

- [ ] Start fresh isolated DB/runtime, migrate and register example solely from
  packaged files; call real HTTP for contract, submit, poll and download PDF.
- [ ] Submit three distinguishable jobs; prove each result belongs to its input,
  serial processing and responsive status; include success-with-warning behavior.
- [ ] Test malformed/type/missing input without new jobs, unknown job/version,
  download-before-success, forced render/storage failure and file-missing response.
- [ ] Restart same image with queued/running/succeeded fixtures: queued processes,
  running becomes failed, succeeded PDF and warnings remain downloadable. Do not
  depend on accidental render timing to create recovery fixtures.
- [ ] Verify PDF content/page result through existing Core proof or output text/
  visual inspection where changed; record artifact hashes and image/version.
- [ ] Run affected current/version regression checks once for final candidate.
  One fresh review, fix concrete findings, rerun affected proof, then commit.
- [ ] Record result/coverage in this plan; stop at R4. R5 owner PDF acceptance and
  overall MVP checklist closure remain separate; do not mark full MVP complete.

## Review focus

Double completion after uncertain DB commit (Tasks 1/2); interrupted process with
orphan file (Tasks 2/4); exposure of graph/path/child stderr (Task 3); admission
while processor unavailable (Tasks 2/3); lost warning/skipped indices after restart
(Tasks 1/4). Each must have an owning test rather than another audit document.

Plan verification: mapped routes/states to existing MVP/R1; checked baseline Service
and current/version acceptance. No runtime results claimed in this planning file.
