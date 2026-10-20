# Large dataset intake and bounded document processing — Stage 0 contract and phased plan

## Authority Boundary

Owner: FlowDoc Project Control. Product owners: Service for intake, storage,
admission and job lifecycle; Core for validation, composition, layout and PDF
writing; FlowDocMake for authoring transport and result presentation.
Active role: Product Implementation Agent / Evidence Reviewer for the isolated
read-optimization Stage4 candidate below; main integration is retained history.
Work/Phase/Checklist execution IDs: not applicable (single-room owner request).
Stage 0 specification completed 2026-10-19 under the owner's request to close the
contract; the concrete contract below is the development baseline for review.
Stages1–6 and the phase-measurement follow-up are complete within the candidate
boundaries and evidence recorded below: Core0.4.7, Service0.4.8, FlowDocMake0.2.6.
The owner authorized main integration and clean merged-lane cleanup on 2026-10-19.
The final integration ledger records its actual outcome separately from the
historical isolated-stage ledgers. Read-optimization Stage0 is specified below;
Stages1–3 have isolated verified candidates below; Stage4 results are recorded below; Stage5 remains deferred.
No installed configuration, release, tag or
deployment changes are authorized in this round.

This replaces the narrow increase-the-image-count proposal from this chat with
one dataset intake-to-output plan. The completed historical image and group-label
plans retain their original scope and outcomes. No map or acceptance is promoted.
One plan document is the document budget; no new AI-required guide or synthetic
execution registry. Work size: multi-stage; risk tier: routine, with explicit
resource, ownership, pinned-input and recovery requirements. Implementation needs
its own reviewed contracts, bounded scope and impact checks before each stage.

## Goal and scope

Receive a dataset incrementally into owned storage, establish exactly what was
received, then validate and process the sealed dataset under separate RAM, disk,
time and work-size budgets. A dataset can contain structured document values and
many original images. Large stored bytes must not imply loading all bytes into RAM.
Neither receipt nor creation of a PDF proves complete document delivery.

## Owner decisions — 2026-10-18

The following intake/lifecycle decisions replace earlier alternatives in this
plan. The architecture remains planning-only; these decisions do not authorize
runtime development or establish unmeasured capacity.

- Check and atomically reserve queue/storage capacity while creating `taskId`.
  Use `Doc-Key` plus authenticated identity and a server-selected initial storage
  allowance before accepting/storing the large body; no caller size is required. No
  separate task-opening call is mandatory. Record server `createdAt`
  and `expiresAt = createdAt + 3 hours` durably. A capacity check without a
  reservation cannot protect against concurrent over-admission.
- One public API: a new request without `taskId` reserves capacity, creates a
  parent task, receives the full dataset, then streams feedback and a final PDF
  on that request's response. `taskId` is returned in the first task metadata
  event. A supplied `taskId` means inspect that existing task's latest state,
  not create, resume, rerender or download it. This replaces the earlier two-call
  opening/upload proposal. Internal parsing/chunking remains server-owned.
- `taskId` owns the full lifecycle; internal `jobId` identifies its PDF execution.
  First scope is zero/one generation job per task. Customers need no `jobId`.
  The new generation response is a versioned `multipart/mixed` stream: bounded
  JSON feedback parts followed by the binary `application/pdf` part on success.
  It is not a plain PDF response or multiple independent HTTP responses.
- If the client loses/does not keep `taskId` and opens another task, it is a new
  task even if content matches. Do not require a client idempotency key or dedupe
  task creation by content. Same-task upload conflicts still need protection.
- Storage quota: 1.5 GB for trials, 10 GB target for operation; these are temporary
  storage budgets, not RAM or accepted per-request sizes. Includes reservations,
  originals, intermediates and output while being sent. The Stage 0 profile below
  fixes byte units and initial bounds; implementation trials must verify them.
- Three-hour expiry is absolute from task creation, not refreshed by polling,
  receiving more data, restarting, or failing later. This replaces the earlier
  proposal to retain failed inputs for three hours after failure.
- Success is exposed through the final PDF part and complete response framing;
  durable terminal success follows server-side response completion. No client save acknowledgment
  and no retained download/re-delivery promise. After server-side sending finishes,
  delete originals, intermediates and temporary output; keep the task record.
  Client-side save failure after a correctly completed send is outside this promise.
- On confirmed connection loss, request a safe job stop immediately. Retain only
  fully received originals until the original expiry; delete partial inputs,
  intermediate files and unsuccessfully sent PDF after their operations stop.
  Keep task identity, terminal outcome and diagnostics after file deletion as a
  lasting record for possible future billing. Billing rules/charges are not defined here.
- Image intake decision: optional `assetKey`, assets owned by their Section only,
  and recoverable image failures skipped with durable reasons. Error-level selection
  is deferred. This replaces earlier proposals for task-wide image sharing and
  unconditional task failure on missing images; historical trial results stay intact.

Expiry must stop accepting/processing/sending and revoke further writes; cleanup
waits until owned workers/readers have stopped. Do not extend the expiry to avoid
handling an active task. A periodic internal expiry/recovery worker, optionally
invoked through a protected internal maintenance endpoint, must work without
client polling. A crashed process cannot rely on an in-memory timer; startup
reconciles persisted deadlines and unfinished tasks. Interval, cancellation grace
and error categories are fixed below. Expiry does not rewrite prior success.

Distinguish generated output, sending, and completed server send in durable events.
Terminal success uses the agreed server response-completion boundary, not proof
that the client saved the file. A disconnect is recorded as failed/indeterminate
delivery with observed cause; do not automatically blame the client. HTTP status
cannot be replaced with a JSON error once PDF response bytes have begun.

Long upload + queue + generation + feedback/PDF occurs within one connection.
Client, proxy and server timeout/size constraints therefore require end-to-end
tests; an existing-task lookup supports returning to the client page, not mandatory
polling or a substitute PDF download/replay channel.
This chosen path does not inherit an asynchronous-download timeout advantage.
Persistent records retain bounded owner/identity, template/contract version,
timestamps, byte/page counters, outcome, delivery and cleanup events as needed;
do not retain the full input/PDF inside logs. Persistent record storage is managed
separately from the temporary-file quota and has no automatic deletion in this scope.

Do not promise arbitrary JSON size, unlimited images, constant total document RAM,
or a production SLA. Keep explicit bounds on individual values, logical records,
expansion, pages, resource counts and metadata as well as byte budgets. Structure,
layout, font and TOC metadata can still grow with document complexity.

## Inspected baseline and evidence boundary

Read-only product references, inspected 2026-10-18:

- Service candidate `e605d9370d887ecbac835cd65d264c1607f1bba7` at
  `C:/Users/nekot/Documents/GitHub/flowdoc-service` (`codex/template-registry`,
  integrated 2026-10-19; former temporary worktree removed).
- Core candidate `e1a65178815f1657ebe464aca23a8a0a4219938c` at
  `C:/Users/nekot/Documents/GitHub/flowdoc-core` (`codex/template-binding`,
  integrated 2026-10-19; former temporary worktree removed).
- Local full UAT trial `C:/Users/nekot/Documents/Codex/2026-10-18/uat-full-source/feedback.json`
  and `review/verification.json`: 135 uploaded assets, 60 requirements, 64 figure
  placements, partial 70-page output; 61 figure placements missing. This is failure
  evidence for that candidate, not proof of proposed architecture performance.
- [Historical image plan](flowdoc-image-preparation-0.1.2-plan-2026-10-08.md)
  remains historical context; current behavior below is based on inspected code.

| Existing part | What is already present | Remaining boundary |
| --- | --- | --- |
| Binary intake | `src/storage/resource-files.ts` streams to `.part`, hashes and counts bytes, then renames | Image-oriented API, not a general sealed dataset |
| Upload sessions | `src/uploads/service.ts` has manifests, item identity, quotas, duplicate/retry checks, finalize and expiry | Full-file retry exists; byte-offset resume is not established. URL items may be declared ready before download |
| JSON job intake | `src/http/server.ts` parses the full JSON request; default body limit 2 MiB | Saving a big JSON file alone does not make validation/composition bounded |
| Admission and jobs | `src/jobs/admission.ts` validates/composes; jobs pin inputs/template/fonts and run serially | Original/prepared JSON and complete graphs are still materialized; do not send a large dataset back through this path unchanged |
| Image preparation | `src/images/prepare.ts` and `worker.ts` process one image in a child, with pixel/time bounds and disk output | `src/images/job.ts` limits derivatives to 20 and estimated retained image data to 64 MiB |
| Image render | Service `src/jobs/render-child.ts`; Core `src/pdf/imageResources.ts` and `createPdfEngine.ts` | All prepared images are loaded; PNG is decoded; Core copies the image buffers and independently limits count to 20 |
| PDF writer and transport | Core `src/pdf/writePdf.ts`, `primitives.js`; Service `src/jobs/render.ts` | PDF objects, image streams, final bytes and parent transport are accumulated in RAM |
| Download and cleanup | Service `src/storage/outputs.ts`, `pdf-files.ts`, upload recovery/TTL | Download already streams. Extend existing retention/active-use protections to new dataset and intermediate files |

These source observations are not an installed-version or live-chat capability claim.

## Proposed task DB and state design — 2026-10-18

Design proposal for review, not applied schema. The public noun stays `task` and
the only client tracking identity is `taskId`. A task orchestrates intake through
delivery; an existing `jobId` is its internal PDF execution. First scope
has zero or one generation job per task, no automatic rerender/retry attempts.
Existing tasks/jobs outside this new path keep their current contract.

### Existing tables and explicit changes

| Table | Reuse | Required change/boundary |
| --- | --- | --- |
| `templates`, `template_versions` and existing draft/font reference tables | Template identity, immutable version/revision and font ownership | Keep current authority and retention; pin exact source for the task, not whatever is current later |
| `generation_jobs` | Queued/running PDF execution, existing source pin and errors | Add nullable unique `task_id` FK to `tasks`; introduce an explicit task-backed input representation instead of giant `original_input`/`prepared_input` JSON |
| `job_processing` | Live preparation/render progress | Keep as execution progress, extend stages only as needed; it is not the public task state or permanent usage ledger |
| `document_outputs` | Output metadata, bytes, ownership and deleted marker | Task-backed output is transient, sent through the payload response and not offered by the legacy download route; mark deleted after confirmed removal |
| `job_font_snapshots`, `job_font_assets` | Exact admitted-job font snapshot | Preserve current immutability and references; task expiry does not remove shared font assets |
| `upload_sessions`, `upload_items`, `upload_job_claims` | Keep legacy image upload behavior and reuse streaming/ownership helpers | Do not reuse unchanged for all task input: items currently restrict upload media to JPEG/PNG, sessions can be removed, request key is mandatory and data parts are unsupported. New task file inventory is separate; no double accounting or duplicate physical storage |
| `authoring_receipts`, `authoring_audit` | Existing authoring operations | Do not repurpose as customer task/billing history or require their request-key model on new task creation |

Schema evidence: Service migrations `001_initial.sql`, `003_output_lifetime.sql`,
`004_upload_staging.sql`, `006_upload_job_claims.sql`, `007_job_processing.sql`,
`015_authoring_previews.sql`, `017_font_references_jobs.sql` at the inspected
candidate above. These already contain timestamps; this design is not based on
an assumption that all existing tables lack them.

For `generation_jobs`, propose `input_kind = inline | task_dataset`. Legacy inline
rows keep exact current JSON/pin validation. Task-backed rows reference the sealed
input and normalized manifests/digests and do not also carry whole payload JSON.
Update input/preview/font integrity checks and processor paths explicitly in a
future forward-only migration; empty JSON placeholders or bypassed immutable-input
triggers are not an acceptable compatibility shortcut. Draft preview pins must
still identify the exact definition, including any owned snapshot file needed.

### Five proposed new tables

These are logical field groups, not executable SQL. New task/file IDs use UUID;
Section references follow the validated template's identity contract. Use bigint
byte/count values with nonnegative checks, timestamptz lifecycle times and bounded
text/JSON metadata are proposed. Every table has `created_at`; mutable rows also
have `updated_at`. No source/PDF blob or unbounded diagnostic array lives here.

| Table | Proposed fields | Invariants and lifetime |
| --- | --- | --- |
| `tasks` | `id` (public `taskId`), server-bound `owner_key` and `created_by_principal`, optional `client_actor_ref`, `request_kind` (export/authoring preview), optional server-bound `billing_subject_key`, bounded external reference, exact template source reference/fingerprint, `status`, `state_version`, `created_at`, `updated_at`, immutable `expires_at`, receive/queue/process/send/terminal timestamps, `last_progress_at`, input/normalized digest, completeness summary, terminal reason/stage, `cleanup_status`, `cleanup_completed_at`, worker lease token/deadline | Main permanent record; no raw document fields. Server actor/owner, template and deadline are fixed at opening; client attribution starts NULL and is sealed once from validated payload metadata. `expires_at = created_at + 3 hours`; one terminal outcome, no reset by status reads. Execution lease is not task lifetime |
| `task_files` | `id`, `task_id`, `section_id` for image assets, role (payload/original image/normalized part/prepared image), optional client `assetKey`, generated internal asset identity, logical data locator/order, media type, declared/received/stored bytes, checksum, internal storage key, receive attempt, file state, published/deleted timestamps | Server-controlled paths; image ownership and resolution use task + Section + asset identity, never task-wide key alone. Envelope files may have no Section. Store partial files safely; sealed input immutable. After removal retain bounded metadata/tombstone and clear locators. Output remains in `document_outputs`, not counted twice |
| `task_resource_reservations` | `task_id` PK, `storage_held_bytes`, `storage_used_bytes`, `queue_slot_held`, reservation policy version, `released_at` | Durable quota accounting, one row per task; used bytes are included in held bytes, never add both. Require `0 <= used <= held`. Reserve bytes before writing, shrink/release after actual deletion. Terminal failure can release its queue slot while retaining storage until expiry; unfinished cleanup still consumes storage |
| `task_events` | `id`, `task_id`, task-local sequence, optional job reference, event type, previous/new state, observed/recorded times, server actor, bounded safe reason/details, unique event key | Append-only durable lifecycle/delivery/cleanup history; sequence/key uniqueness prevents duplicate transition records. Do not emit one permanent event per uploaded chunk or poll. Progress counters can change without ledger growth. No tokens, raw values, full URLs or filesystem paths |
| `task_usage` | `task_id`, `revision`, `measurement_version`, finalization time, ownership/request/template snapshot, measured counters, generation/delivery outcomes and evidence references, optional superseded revision/reason | Append-only fact snapshot for future billing; unique `(task_id, revision)`, revision 1 written once with the terminal transition. Corrections append a new revision with rationale; no overwrite/double counting. Keep indefinitely in this scope. No price, invoice, charged flag or automatic charge rule yet |

Relations: one task has many files/events and one reservation; zero/one linked
generation job; that job keeps zero/one output and its existing font snapshot.
A task has one terminal usage snapshot plus explicitly versioned corrections.
Persist `contract_version = task-v1` and the immutable `resource_policy` version/value
snapshot on `tasks`; reservation policy references that snapshot, not live defaults.
No cascaded file cleanup may delete the task, events or usage records. Permanent
records must not depend on continued availability of temporary file rows/bytes.

### Creation time, creator attribution and physical files

- `created_at` already belongs to every proposed table and is generated by the
  server/database, not accepted from a client clock. `tasks.created_at` anchors the
  three-hour deadline. Store lifecycle instants as timestamptz; return explicit
  timezone-qualified times in the API. `updated_at` does not renew expiry.
- `owner_key` identifies the authenticated customer/system owning the task.
  `created_by_principal` records the authenticated calling identity; these are
  bound by Service and cannot be selected arbitrarily in the request body.
  `client_actor_ref` optionally records the end-user ID supplied by that customer
  (the person clicking their website). Keep it scoped to `owner_key` and mark it
  as client-reported attribution, not independently authenticated identity or
  authority to access/bill another account. NULL is valid until the client sends
  this information. No local user-directory table is required merely to retain
  an external reference. Preserve attribution in task events/terminal usage facts.
- `task_files` stores file metadata and an internal `storage_key`, not file bytes.
  Service creates an owned directory for the task; proposed relative layout is
  `<taskId>/input/`, `<taskId>/normalized/`, `<taskId>/prepared/` and
  `<taskId>/output/` under a configured task-storage root. Filenames use
  server-generated file/job IDs. Example input key:
  `<taskId>/input/<fileId>.bin`; join it with the configured root in the storage
  adapter rather than storing a machine-specific absolute path in every row.
- Output metadata still belongs to `document_outputs`; its task-aware storage
  adapter must support the owned output key. Do not assume the current legacy
  basename-only PDF resolver accepts nested task paths without a future change.
  No duplicate `task_files` output row or duplicate quota charge is required.
- Client filenames/asset keys are labels/references, never filesystem paths.
  Restrict resolution to the owned task root and protect active handles during
  cleanup. After verified deletion clear the locator/availability and release its
  quota while retaining task/usage history. Directory creation must not precede
  successful capacity reservation except for bounded recoverable staging setup.

### Public states and transitions

| State | Meaning | Normal next state |
| --- | --- | --- |
| `awaiting_input` | Task created and capacity reserved inside the incoming request before accepting its large payload; no separate opening round trip required | `receiving` |
| `receiving` | One task-bound payload request is being stored | `validating` |
| `validating` | Full receipt sealed; checking/normalizing structured values and references | `queued` |
| `queued` | Valid input admitted, waiting for processing resources | `processing` |
| `processing` | Preparing resources, composing, laying out and generating PDF | `sending` |
| `sending` | Final binary PDF part is streamed after feedback in the same multipart response; skipped-image findings remain recorded | `succeeded` |
| `succeeded` | Server send completed according to the agreed boundary | Terminal |
| `failed` | Receive/validation/process/delivery failure or interruption confirmed | Terminal |
| `expired` | Nonterminal task reached its original absolute deadline | Terminal |

All nonterminal states can fail or expire. Internal `generation_jobs.succeeded`
means PDF generation completed, not that `tasks.succeeded` can be set early.
Render progress is exposed under task progress, without inventing a global percent
across stages whose total work is unknown. Task responses include `taskId`, state,
stage progress, `createdAt`, `expiresAt`, bounded warnings/error and file availability.
Successful sending may have skipped images: preserve separate content completeness
(`partial` when omissions exist), exact skip counts and paginated findings. The
response separates JSON feedback from binary PDF; do not inject JSON into the PDF
part. Task success is server send completion, not a claim of complete source
reproduction or zero warnings.
Terminal task status may remain queryable after `expiresAt`; that timestamp controls
temporary data/execution, not expiry of the permanent task identity.

Cleanup is orthogonal: `not_due | pending | running | done | retry_needed`.
Task success is unchanged if cleanup fails; keep its reservation and retry cleanup.
At the deadline stop nonterminal work with a fenced lease, record `expired`, close
owned handles/workers, then delete files. A task already `failed` remains failed
when its retained files expire; a succeeded task is never relabeled expired.
After restart, a lost HTTP payload/response connection cannot be resumed by changing
status: reconcile interrupted nonterminal tasks to failed or expired as appropriate.
During controlled cancellation expose progress stage `stopping`, not a new terminal
task state. Persist stop request/reason, stop deadline and confirmed stop time in
task lifecycle metadata. Do not claim stopped workers or free RAM from a cancel
signal alone. Already completed generation jobs keep their actual result even if
task delivery fails. Retained originals keep overall cleanup incomplete until
their expiry; scratch-file removal alone is not `cleanup_status = done`.
No automatic rerender, same-task payload retry or delivery replay is introduced.
An existing identity retrieves state only; a fresh generation opens a new task.

### Atomicity, indexes and failure boundaries

- Capacity reservation, task creation and opening event commit together before
  emitting the task metadata event. Existing legacy admission/storage operations
  must share
  the applicable lock/budget accounting with the new path. Count task-backed jobs
  once, not once as a reserved task and again as a legacy queued job. RAM concurrency
  is scheduled at processing time; reserving disk is not reserving RAM for 3 hours.
- Claim one receive/worker per task via row lock/compare-and-swap and fenced lease
  token. State transition, event and terminal usage snapshot commit together.
  Reject writes/results from expired leases and terminal tasks. On terminalization,
  release queue capacity exactly once; do not release retained file capacity early.
- Deadline versus send-completion race uses one conditional terminal transition
  against database time and state version. Exactly one outcome wins; sending that
  has not completed before expiry is not retroactively successful. Never pretend a
  client saved a file because the server emitted its final bytes. Persist observed
  bytes/events and unknown delivery outcome on crash; a missing receipt is not
  reconstructed as success for billing.
- Releasing a logical queue reservation does not release a live worker's RAM or
  file handles. Processing/receive/send concurrency permits stay held until their
  actual operations stop; expiry cannot admit replacement work on a false free slot.
- SQL and filesystem writes are not atomic together. Publish owned file metadata
  after safe file completion, reconcile orphan files/records on recovery, and mark
  deletion/release only after verifying removal. After stream headers are sent,
  application failure is a typed error event when the connection/framing is usable,
  plus persisted task state. Do not replace started HTTP headers or append JSON
  inside a partially transmitted PDF part; close incomplete output on send failure.
- Proposed indexes: `tasks(owner_key, created_at, id)` for history;
  `tasks(expires_at, id)` partial on nonterminal states; pending cleanup/deadline
  index; unique nullable `generation_jobs(task_id)`; `task_files(task_id, role,
  part_order, id)` plus canonical image-key uniqueness within `(task_id, section_id,
  assetKey)` when present; `task_events(task_id, sequence)`;
  `task_usage(task_id, revision)` and owner/finalization history where measured need
  justifies it. Expiry cleanup also scans terminal failed tasks retaining files,
  not only the nonterminal expiry index. Queue/disk limits use integer bytes and
  ordered locking with unchanged legacy operations to avoid races/deadlocks.

### Facts retained for future billing

Record distinct measurements: actual request-body bytes received, sealed original
file bytes, prepared/intermediate peak bytes, PDF bytes generated, bytes written
to the response, generated page count, source image item count, rendered image
placements, required resources missing and warning/omission counts. Request bytes
and extracted file bytes describe different things and must not be summed as one
usage amount. Generated pages and delivered pages are not interchangeable; partial
PDF byte delivery does not establish a number of usable delivered pages.

Retain task owner/request kind, exact template/processing/measurement versions,
stage timestamps and defined wall durations, terminal reason, generation result,
server-send result, and output/input digests where applicable. Unknown/unmeasured
counts stay NULL with a measurement status/reason, not fabricated zeros. Wall time
is not CPU time; optional measured memory/CPU values need their own units/method.
Capture terminal facts before deleting files. Cleanup events can follow without
rewriting the terminal usage snapshot. Skipped-image codes/counts, Section/field
locations and content completeness remain recorded even when task sending succeeds;
no automatic discount or charge follows from the default skip policy. Preview/test
work remains distinguishable from customer export, without deciding which is
chargeable. Future invoices must
use explicit pricing and usage-revision rules; neither success nor failure creates
a charge by itself. Persistent history will need access control, indexing and
storage monitoring even though automatic record deletion is out of scope.

### Stage 0 closure and implementation proof boundary

The Stage 0 contract below fixes API/binary binding, identity mapping, byte units,
reservation arithmetic, initial limits and timeout policy. These are specifications,
not executed SQL or capacity proof. Future implementation must prove concurrent
opening/upload, no double reservation, exact old/new input
mode constraints, owner access, all state transitions, expiry at every phase,
restart/stale worker, success versus disconnect/deadline race, missing required
images, deletion failure, and exactly-once terminal facts/events. Assert file
deletion preserves task/usage/event history and no giant payload remains in DB/logs.
Core/Service integration and branch/worktree reconciliation completed 2026-10-19;
see the integration/cleanup section of the
[group-label plan](flowdoc-group-label-span-design-plan-2026-10-18.md).
Stage 0 is now specified; each implementation stage still requires its own bounded
authorization and checks. SQL/runtime changes require the owner's stage-specific
instruction; the current Stage1 authorization is recorded below.

## Intake contract and template header

The concrete API, JSON and binary binding are specified once in Stage0 A–B below.
Use `Doc-Key` only for new generation; no duplicate root selector, aliases
`X-FlowDoc-Template`/`X-FlowDoc-Doc-Key`, or required declared-size field/header.
Legacy APIs retain their own contracts. Pin template identity before large receipt;
seal after complete framing, validate before processing, never rebuild giant job JSON.
Sealed receipt is not validation, processing admission or completed delivery.
Internal dataset states are receiving -> sealed -> validating -> ready, or invalid;
public task states and cleanup remain separate as defined above.

## Parent task and single-API response stream

Stage0 D specifies `task-v1` feedback/PDF framing and lookup. The envelope uses
[RFC2046 multipart semantics](https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1.3);
event names/schema are FlowDoc's own contract. Service projects job progress and
owns HTTP; Core produces the bounded artifact without HTTP/DB responsibilities.
No mandatory polling, separate opening call, replay, SSE or WebSocket subsystem.
Browser/proxy early-response visibility is not guaranteed; baseline works after
complete upload. Heartbeats do not renew expiry or guarantee a proxy stays connected.

Confirmed connection-loss policy is now owner-approved for planning; it is not
implemented. Detect loss of the caller-to-Service generation response, not merely
a changed browser page, a quiet progress stage or temporary slow reading. Do not
attribute fault to the customer without evidence. Detection/idle/write timeouts
are specified below and still require environment tests; they do not prove that
every disconnect is immediately observable. On confirmed loss use these rules:

| Phase at confirmed loss | Job action | Task outcome |
| --- | --- | --- |
| Receiving or validating, before a job exists | Stop intake/validation; do not create a dummy job | `failed` after stopping, with receive/connection interruption reason |
| Queued | Fence/dequeue so a worker cannot start it; mark that job failed | `failed` with connection interruption reason |
| Processing | Request cancellation immediately; revoke stale result authority, stop owned child work and await bounded shutdown | Expose `stopping`, then `failed` after confirmed stop; expiry wins if its absolute deadline is reached first |
| Sending PDF | Stop its reader/writer; no further generation/delivery retry | `failed` for delivery; a generation job already succeeded remains succeeded |
| Complete server send already committed | Do not cancel or rewrite historical outcome | Keep `succeeded`; normal immediate file cleanup continues |

Use a short bounded graceful-stop period, initially 5 seconds for isolated trials,
then terminate only the task's owned process tree if still running. This trial
value is not a measured production SLA. Keep RAM/concurrency permits and active
file protection until those operations have actually stopped. A later worker
result cannot turn failed/expired task delivery into success. Deadline/finish/close
races use the existing conditional terminal transition and durable event rules.

After handles/workers stop, delete partial/incomplete payload files, normalized
parts, prepared-image/embedding files and a PDF not sent successfully. Keep fully
received original data/image files only until `tasks.expires_at`; no new three-hour
clock starts on disconnect. At expiry remove remaining task-owned originals.
Shared font/template files are not task scratch. Confirm each physical deletion
before marking its metadata deleted and reducing storage reservations; retained
originals or failed removals continue to count against the quota. Queue reservation
can be released after safe stop independently from retained disk. On cleanup error
keep `retry_needed`, reason and reservation; retry without changing task outcome.
When immediate scratch removal succeeds and only unexpired originals remain,
cleanup may return to `not_due`; it becomes due at the original expiry. Mark
`done` only once all task-owned temporary files are confirmed removed.

After restart reconcile interrupted nonterminal work: `failed` if its connection
is gone and deadline remains, otherwise `expired` when due. Keep prior terminal
success/failure; do not infer a successful send from a generated PDF or HTTP 200.
Persist safe phase, stop/delivery events, observed reason and known usage counters
before removal; unknown values remain unknown. The task/event/usage records remain
after deletion. Later `taskId` inspection reports their latest state only, with
no reconnect-to-stream, rerun or retained-file download; new generation is a new task.

Frontend/API consumers must read the response incrementally and separate JSON
parts from the PDF; ordinary whole-response `json()`, `blob()` or a direct download
alone cannot display periodic feedback. Validate client/proxy/server behavior,
stream chunk splitting, binary boundaries, slow readers, cancellation, incomplete
framing and delivery races in the actual supported environment before promising
interoperability. Recommend a small reference consumer/helper to reduce caller
framing work; no new SDK project is authorized here. Existing `/jobs` behavior remains legacy
compatibility; do not silently change its media type or claim this is installed.

## Section-owned image forms and omission policy — owner decision 2026-10-18

Image recognition follows Core's typed template/binding contract, not guesses about
arbitrary text or a duplicate Service schema implementation. Service traverses
Section/Area/Format values using that contract and a bounded reader, extracts image
sources and builds the internal registry. In v1 a binary image source is
`{"upload":true}`; Stage 0 below specifies its multipart association.

| Client form | Meaning |
| --- | --- |
| Image field contains `{ "image": ... }`, no `assetKey` | Generate a fresh internal asset identity for each image occurrence; do not auto-merge equal bytes, names or checksums |
| Image field contains `{ "assetKey": "photo-001", "image": ... }` | Define an optional named image inline; other image fields in the same Section may use `{ "assetKey": "photo-001" }` |
| `sections[i].assets` contains `[{ "assetKey": "photo-001", "image": ... }]` | Optional Section-local array; image fields in that Section reference its keys. `assets` is a sibling of that Section's `data`, not a root/document asset list |

Resolve explicit keys only inside `(taskId, sectionId, assetKey)`. The same key in
another Section denotes a different image. No cross-Section lookup, implicit
fallback, doc-level assets or new image-scope selector is included. Inline named
images and array declarations share the Section registry; declaration order is
irrelevant after full receipt. References alone without any source cannot create
an image. Contradictory sources for the same Section/key are ambiguous: do not
select the first/last definition or borrow from another Section. Skip affected
references and record the conflict; unrelated content continues. Repeated names
do not require duplicate canonical DB entries. Unkeyed assets remain distinct.

Initial behavior is fixed: skip recoverable image failures and record reasons.
This includes an unresolved/mismatched key, conflicting definitions, a missing
source, and an individually invalid/unsupported image that can be isolated safely.
Skip only the affected image placements, not the surrounding data or Section.
Keep existing image-frame/layout behavior; this policy does not redesign flow,
fixed bounds or blank-space handling. Record omission in the resource registry so
later rendering does not silently retry or duplicate the same diagnostic.

Persist safe reason code, Section ID, logical field/Format/item locator and optional
assetKey/internal asset ID, with skip counts and bounded paginated detail available
through task feedback/events. Preserve these facts in terminal usage history before
file cleanup. Do not require callers to assemble diagnostic manifests. The final
PDF part contains no JSON error report; feedback parts carry the reports separately.
No selectable `errorLevel`, report/strict mode,
or collect-all-then-stop implementation is part of this round; leave selection
for a separately scoped future decision.

Skip applies to isolatable image/content issues, not task authorization, unreadable
JSON/multipart, global capacity exhaustion, cancellation, deadline or inability to
write a valid PDF. Those still stop/reject the task safely. Existing privacy/network
guards remain enforced; skipping does not grant access to a forbidden resource.
Keep content completeness separate from transport success. Valid full-source UAT
input still must render every expected image to pass full-source acceptance; the
historical capacity-caused missing-image trial is not reclassified as a pass.

## Structured-data boundary

Accepting a JSON file as bytes solves receipt memory only. Streaming validation,
normalization, binding, composition and serialization must be considered together.
Service owns transport/storage; Core remains the schema and composition authority.

Proposed large-data representation: a bounded manifest plus ordered data parts at
declared logical record boundaries, with explicit Section/Area ownership and stable
ordering, produced internally from the single client payload where necessary.
This does not require the client to split uploads. Keep Section/Area/Format
semantics unchanged; transport parts are not new pages, Sections or Formats.
Single JSON file import can use a
bounded parser/normalizer; do not use whole-file read plus JSON.parse as the large
path. A single huge scalar/record needs its own limit or a separately designed
representation. Duplicate keys, nesting, reference validity, duplicate/missing
parts, order and expansion must retain Core's validation guarantees.

Normalize to owned on-disk parts/indexes, then use a Core reader/composition
contract that does not materialize the full original and prepared payloads together.
Database records can retain digests, locations, progress and bounded diagnostics;
do not silently put the full giant dataset into existing job JSON columns.
Global TOC, links, page fields and layout metadata remain bounded explicitly.
If this requires additional layout spooling, surface it as a scope decision before
claiming large structured-document support; image-only success is insufficient.

## Read–prepare–embed–release design

- Retain originals under dataset ownership; pin their identities, not mutable URLs
  or caller filesystem paths. Keep legacy immutability guarantees across awaits.
- Prepare images serially initially. Reuse only an explicitly shared Section-local
  asset, with derivatives keyed by that asset's identity, target parameters and
  transform-contract version. Checksums verify bytes; they do not auto-merge
  unkeyed images or images from different Sections. Distinct placements remain.
- Keep only image dimensions, format, identity and availability in Core layout.
  Materialize JPEG or compressed RGB/alpha embedding streams to job-owned files,
  one image at a time. Preserve orientation, color, transparency and current
  quality/density policy; no silent quality reduction to pass a budget.
- Core gets bounded read/write adapters and metadata, not Service DB/network
  responsibilities. Validate the embedding representation and verify pinned
  content identity while accessing it; a file path alone is not an immutable snapshot.
- Embed each prepared image once; subsequent page placements reference the object.
  Page resource dictionaries reference images actually used on that page rather
  than every image in the document. Release buffers/handles after writing each
  object; on-disk assets remain according to retention and active-use rules.
- Incrementally write PDF objects with tracked offsets and final cross-reference
  information. Do not accumulate all image streams, PDF objects or final PDF bytes
  in memory. Preserve deterministic identity, fonts, alpha masks, links and geometry.
- Service's child writes through a Service-owned output target; parent receives a
  bounded completion descriptor and verifies the resulting owned artifact. Commit
  the artifact-ready event only after completion, then stream the PDF part on the
  parent's original response. Handle crash gaps between file and DB
  operations using recovery; filesystem and DB are not one atomic transaction.
- Preserve legacy byte-return APIs under their explicit limits. New large jobs
  require capability negotiation and the new path; no silent fallback to whole-file
  buffers. Audit FlowDocMake upload/download/hash/copy helpers as consumers too.

## Resource and result invariants

Stage0 E–F define separate byte/work/RAM/time limits and reservation rules. The
64 MiB legacy retained-image budget is not a whole-process memory guarantee.
Use enforced group memory limits and account native allocations/cache, parent,
children, fonts/layout and bounded stream queues; measure by phase in Stage6.
Image-count ceilings never substitute for memory bounds. Known source fidelity
criteria remain: every valid expected image must render for full-source acceptance;
default image skip cannot turn the old incomplete UAT trial into a pass.

## Stage 0 — concrete v1 contract, 2026-10-19

This section closes the remaining design choices under the owner's current request.
It governs future implementation; values marked trial are conservative starting
guards selected for this plan, not measured production capacity. Existing owner
decisions above remain binding. Closing Stage0 itself changed no runtime,
migration, configuration or data.
Specification checks use this document only; execution/Phase/Checklist IDs N/A.

### A. API and payload

One route, `POST /documents`, with two content-type-discriminated operations:

| Operation | Request | Response |
| --- | --- | --- |
| Generate | Authenticated `multipart/form-data`, one `Doc-Key`, optional `Accept: multipart/mixed` | HTTP 200 multipart stream after accepted complete receipt; early fatal error uses normal JSON/status instead |
| Inspect | Authenticated `application/json`: `{"taskId":"<uuid>"}`; optional `findingsCursor`/`findingsLimit` | HTTP 200 bounded JSON snapshot of that exact owned task, never PDF |

An incompatible explicit `Accept` is 406. Lookup rejects `Doc-Key`, generation
data, files or unrelated body fields (409 `TASK_REQUEST_CONFLICT`). A `taskId` in
the generation payload also conflicts; it never retries/resumes that task.
Malformed IDs are 400; missing and other-owner IDs both return 404 `TASK_NOT_FOUND`.
Terminal records remain queryable after file expiry; they do not become 410 merely
because temporary bytes are gone. No task is created on lookup or pre-admission failure.

New generation requires exactly one nonempty `Doc-Key`, validated by the existing
Core identity rules. Repeated/comma-combined headers and root `docKey` are 400
`INVALID_REQUEST`, even when equal. Pin the authorized template version/fingerprint
at task creation; do not select again after upload. Unknown/inaccessible template
is 404; no client-selected filesystem paths, credential identity or arbitrary
template definition is accepted. No declared byte count is required.

The first multipart part MUST be named `payload`, UTF-8 `application/json`, with
an optional filename. Its root allows `data`, `sections`, optional `meta` only;
use the pinned Core contract for required data, header/footer, Area and Format fields.
Model19 uses the Section-ID array below; model18 retains its existing Section map
shape and name identity. Do not convert old model identities or clone IDs in transport.
The new `assets` sibling is removed by normalization before Core admission; its
resolved image references retain Section ownership. Legacy `/jobs` APIs do not change.

Generation request headers are `Authorization: Bearer <credential>`,
`Doc-Key: inspection-report`, `Content-Type: multipart/form-data; boundary=<request-boundary>`,
and optionally `Accept: multipart/mixed`. The first part has
`Content-Disposition: form-data; name="payload"` and
`Content-Type: application/json; charset=utf-8`, followed by this JSON:

```json
{
  "meta": {"actorRef": "user-42", "reference": "inspection-2026-001"},
  "data": {},
  "sections": [{
    "id": "10000000-0000-4000-8000-000000000011",
    "assets": [{"assetKey": "seal", "image": {"upload": true}}],
    "data": {"details": [{"format": "inspection", "data": {
      "photo": {"image": {"upload": true}},
      "badge": {"assetKey": "badge", "image": {"upload": true}},
      "badgeAgain": {"assetKey": "badge"},
      "seal": {"assetKey": "seal"}
    }}]},
    "header": {}, "footer": {}
  }]
}
```

This is a mock model19 payload for an `inspection-report` template whose declared
image fields are `photo`, `badge`, `badgeAgain`, `seal`; it is not a payload for an
arbitrary existing template. `meta` is transport attribution and is not document data.
The three image forms share one binary binding; assetKey is never mandatory.
No request/part compression or Content-Transfer-Encoding is accepted in v1;
reject415 rather than count compressed bytes as the decoded budget. Validate
JPEG/PNG signatures and actual dimensions instead of trusting filename/media type.
Content-Length, when present, is only a consistency hint; actual bytes govern limits.

### B. Binary association and image exceptions

Each `{"upload":true}` image source requires one binary part whose `name` is the
[JSON Pointer](https://www.rfc-editor.org/rfc/rfc6901.html) to that **image source
object** in the original payload. This associates a file with its occurrence without
another client-maintained asset ID. Example request parts after `payload`:

```http
Content-Disposition: form-data; name="/sections/0/data/details/0/data/photo/image"; filename="a.jpg"
Content-Type: image/jpeg

<binary JPEG>
```

The other two names are `/sections/0/data/details/0/data/badge/image` and
`/sections/0/assets/0/image`; their order and filenames are irrelevant. The two
key-only references need no binary part. A caller/helper can derive these names
while walking its JSON; Service generates all internal file/asset IDs itself.

Apply RFC6901 token escaping (`~0`, `~1`), zero-based decimal array indices without
leading zeroes, no `-` append token. Match the original payload before normalization;
never interpret the pointer as a filesystem path. Multipart quoted `name` is UTF-8,
with normal header quoting; no URL/percent decoding or Unicode normalization.
Reject control characters/invalid encoding/header-limit violations as malformed
transport. Include Thai field names and escaped `/`/`~` in interoperability tests.
The framing follows [RFC7578](https://www.rfc-editor.org/rfc/rfc7578.html); the
pointer convention and `upload` marker are FlowDoc-specific, not RFC requirements.

Only declared typed image slots and their owning Section's `assets` can be bound.
Fields of other types are never reinterpreted because their business text resembles
an image object. Initial v1 accepts binary JPEG/PNG only; do not add URL fetching,
data URLs, base64, remote paths or new source types to this path by implication.
Existing URL/base64/DB-resource legacy inputs remain on their bounded legacy API.

`assetKey` is a nonempty case-sensitive UTF-8 string, at most 128 bytes; compare
exact code points, no normalization. A definition in `assets` requires a key.
Unkeyed occurrences remain separate even if their file bytes match. Named repeated
definitions in one Section may share only when all received sources are provably
byte-identical; different or unverifiable sources conflict. Same key in another
Section is unrelated. Resolve all definitions after complete receipt, not first-win.

| Condition after complete valid framing | Action |
| --- | --- |
| Missing part/key, key-only reference with no source, invalid/unsupported image, per-image 50 MiB/pixel/preparation bound exceeded | Skip affected placements with `IMAGE_SOURCE_MISSING`, `IMAGE_KEY_NOT_FOUND`, `IMAGE_UNUSABLE` or `IMAGE_LIMIT`; keep surrounding content |
| Duplicate binary name, contradictory/unverifiable definitions of one Section/key | Skip all affected references with `IMAGE_SOURCE_CONFLICT`; do not choose first/last |
| Image part has a well-formed but unbound pointer | Drain/discard under request limits; record `IMAGE_PART_UNBOUND`, no document substitution |
| Duplicate/missing payload, binary before payload, malformed/truncated multipart/JSON, duplicate JSON property, global count/byte/depth/capacity limit | Fatal request/task error; incomplete transport is never reclassified as an image omission |

An oversized individual image may be drained/discarded with bounded buffers only
while the total request/time limits permit. Never keep its partial bytes or decode
it to decide whether it fits. One stored finding can cover repeated placements;
maintain separate finding count, omitted-placement count and unused-upload count.
Normalized input represents a skipped image as a typed unavailable resource with
its reason; it must not erase a required data field and then fail Core's unrelated
missing-required validation. Core owns this new reader/validation contract in Stage2.
Only omitted content makes completeness `partial`; low-resolution warnings or an
unused extra upload alone do not. Intentional fixed-Format omissions remain separately
counted/reported using the existing omission contract. No selectable error-level mode.

### C. Authenticated creator and ownership

New task API is disabled unless Service has an explicit trusted credential resolver.
It resolves `Authorization: Bearer <credential>` to `{ownerKey, principalId,
billingSubjectKey?}` plus template permissions. Never reuse the unauthenticated
legacy `/jobs` route as task authentication or assume the authoring token is a
customer credential. No credentials/user administration table/UI is added here.
For the isolated first scope a server-configured fixed credential mapping is enough;
an authoring adapter may map an existing principal only through explicit trusted config.

Persist `owner_key = ownerKey`, `created_by_principal = principalId`, and
`billing_subject_key = configured value or NULL`. Missing owner/principal mapping
rejects before creating a task; billing NULL is valid and cannot trigger charging.
Credential rotation may retain stable IDs. Authorize lookup by owner; another
principal of that owner needs an explicit task-read permission. Do not treat taskId
alone, `actorRef`, an external reference or font-admin status as access authority.
Cross-owner reads are 404; no raw token/digest is returned or retained in usage.

`meta.actorRef` maps to optional `client_actor_ref`; `meta.reference` to the optional
external reference. Each is at most 200 UTF-8 bytes, nonempty when supplied, without
control characters. They are client-reported, scoped to the authenticated owner,
not verified users or idempotency keys. Missing values become NULL; reject attempts
to set `ownerKey`, `principalId`, `billingSubjectKey`, request kind or server timestamps
in payload/meta. Public generation records kind `export`; trusted authoring-preview
adapters supply kind/pinned revision server-side, never by an untrusted body override.
Creation precedes payload receipt: actorRef/reference start NULL and are set once
under the receive lease when their metadata validates, then frozen when sealed.
Absent metadata stays NULL; an early lookup may correctly have no client attribution.

### D. Feedback, completion and lookup schema

Response: `Content-Type: multipart/mixed; boundary=<random>; flowdoc=task-v1`,
`Cache-Control: no-store`. Do not set a whole-response Content-Length or buffer the
whole response. Each event part is UTF-8 `application/json`, at most 32 KiB, using:

```json
{"version":1,"seq":1,"type":"task","taskId":"20000000-0000-4000-8000-000000000001","at":"2026-10-19T02:00:02Z","status":"validating","eventSeq":3,"detail":{"createdAt":"2026-10-19T02:00:00Z","expiresAt":"2026-10-19T05:00:00Z","template":{"docKey":"inspection-report","version":1,"fingerprint":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}}}
```

`seq` increases per response, including transient progress/heartbeat; `eventSeq`
is the durable `task_events.sequence` for a persisted event, otherwise NULL.
They are different counters. First `task` event includes persisted opening times
and current status (not an invented historical awaiting_input state if receipt
already finished). Event IDs do not imply replay/subscription support.

| `type` | `detail` contract |
| --- | --- |
| `task` | `createdAt`, `expiresAt`, `template` {`docKey`,`version`,`fingerprint`}; emitted once after creation commit, baseline after upload completes |
| `progress` | `stage`, `completed`, `total`, `unit` (`bytes/files/records/nodes/pages` or NULL); known nonnegative counts or NULL, same-unit counts only; `stopping` is a stage, not a task status |
| `heartbeat` | `stage`; after response starts, at most once per 10 seconds; no permanent event per heartbeat |
| `warning` | bounded `findings` and cumulative `findingCount`, `omittedImagePlacements`, `unusedImageParts`, `formatOmissionCount`; one finding has `code`,`sectionId` (NULL if no bound Section),`path`, optional `assetKey`, safe `message`, `affectedPlacements` (count or NULL), `action` (`skipped/warning`) |
| `artifact` | `mediaType:"application/pdf"`, `bytes`, lowercase `sha256`, `pageCount`, `completeness` (`complete` or `partial`), omission counts; status `sending`, generation complete, not task success |
| `error` | stable `code`,`stage`,`message`; status `failed`/`expired` after safe stop, no stack/token/path/raw document values; no PDF follows |

Progress stages are `receiving`, `validating`, `queued`, `preparing_images`,
`composing`, `layout`, `writing_pdf`, `sending`, `stopping`, `complete`; error.stage
identifies the operation that failed. All counts use JSON safe nonnegative integers
or NULL when unknown; times are UTC RFC3339 with `Z`; hashes are lowercase SHA-256.
NULL totals are never fabricated 0 or an arbitrary overall percent.
Coalesce progress to at most once/second; keep at
most 32 pending events and 512 KiB of application stream buffers per response.
Flush bounded warning batches; when detail is capped retain totals and `detailsTruncated`.
Do not accumulate raw worker output, per-chunk or per-poll permanent events.

After artifact metadata, send exactly one final PDF part, with
`Content-Type: application/pdf`, safe generated filename `document.pdf` and exact
part Content-Length. End the multipart boundary after that PDF, no success JSON
after it. Use a random 256-bit boundary; boundedly preflight the stored artifact
for delimiter collision and verify size/digest before beginning its PDF part.
A collision fails safely before PDF bytes, not a boundary change halfway through.
Reference parsers must handle arbitrary chunk splits and raw binary; framing and
size/hash must all complete. PDF bytes in events/base64 are forbidden.

Persist `succeeded` only on actual server response finish plus conditional DB
terminal transition before expiry. `artifact`, HTTP200, stream flush or generated
job success is insufficient. A complete client PDF can precede an uncommitted DB
receipt on crash; record conservative failed/unknown delivery rather than invent
success. There is no mandatory acknowledgment, second call or retained PDF replay.
If failure occurs after PDF part begins, abort incomplete framing; never insert an
error JSON into PDF bytes. Before PDF starts, send error event and closing boundary
when possible. A closed error envelope contains no PDF and is not a success.

Pre-stream errors use `{"ok":false,"error":{"code":"STORAGE_CAPACITY","stage":"receiving","message":"Temporary storage capacity unavailable"},"taskId":"<uuid-or-null>"}`.
Map invalid transport/header to 400, auth to 401/403 (404 for hidden resources),
conflicting operation to 409, limits to 413, media to 415, Core validation to 422,
queue/unavailable/storage capacity to 503. Stable fatal codes include
`INVALID_REQUEST`, `TASK_REQUEST_CONFLICT`, `LIMIT_EXCEEDED`, `INVALID_DATA`,
`QUEUE_FULL`, `STORAGE_CAPACITY`, `STORAGE_IO`, `RESOURCE_LIMIT`, `TASK_TIMEOUT`,
`TASK_EXPIRED`, `CONNECTION_LOST`, `WORKER_INTERRUPTED`, `PDF_FAILED`.
Streaming errors carry these codes; HTTP200 is not an outcome. A known task failure
lookup itself returns HTTP200 with that task's failed/expired status.

Lookup response uses the exact shape below. Unknown progress counts, terminalAt,
output facts or attribution are NULL, not missing fields/fabricated zero. Output
metadata is a fact record, not file availability. Generation/delivery outcomes use
`pending|succeeded|failed|unknown`; only terminal task success yields delivery
`succeeded`. Cleanup uses the existing five-state enum; completeness uses
`unknown|complete|partial`. No jobId, raw source, download URL, path or credential.
`findingsLimit` defaults 50, range 1–100; opaque cursor
is scoped to owner/task and a stable sequence boundary. Persist at most 10,000
finding details/task with exact aggregate counters beyond the cap; advertise
`detailsTruncated`. No per-call renewal, mutation or automatic retry.
Lookup body is at most16 KiB; response at most256 KiB, shortening a findings page
with nextCursor when necessary. Finding message is at most512 UTF-8 bytes and path
at most2 KiB; preserve an internal hashed locator if a longer diagnostic path must
be shortened. Snapshot task fields are fixed as shown; no raw business values.

```json
{
  "ok": true,
  "task": {
    "taskId": "20000000-0000-4000-8000-000000000001",
    "status": "succeeded",
    "progress": {"stage": "complete", "completed": null, "total": null, "unit": null},
    "createdAt": "2026-10-19T02:00:00Z",
    "updatedAt": "2026-10-19T02:01:00Z",
    "expiresAt": "2026-10-19T05:00:00Z",
    "terminalAt": "2026-10-19T02:01:00Z",
    "template": {"docKey": "inspection-report", "version": 1, "fingerprint": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
    "creator": {"principalId": "customer-api", "actorRef": "user-42", "actorVerified": false, "reference": "inspection-2026-001"},
    "cleanup": {"status": "pending", "completedAt": null},
    "completeness": "complete",
    "counts": {"findingCount": 0, "omittedImagePlacements": 0, "unusedImageParts": 0, "formatOmissionCount": 0},
    "detailsTruncated": false,
    "generation": "succeeded",
    "delivery": "succeeded",
    "output": {"bytes": 12345, "sha256": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "pageCount": 2},
    "error": null
  },
  "findings": [],
  "nextCursor": null
}
```

One complete round: send the headers/payload in A and the three binary parts in B,
then close the request boundary. Server reserves/creates before body storage,
counts bytes and seals, then returns the `task` event above. Next JSON parts may be
`progress` (`seq:2`, status `processing`, eventSeq NULL,
detail `{"stage":"layout","completed":1,"total":2,"unit":"pages"}`), then
`artifact` (`seq:3`, status `sending`, durable eventSeq,
detail `{"mediaType":"application/pdf","bytes":12345,"sha256":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","pageCount":2,"completeness":"complete","findingCount":0,"omittedImagePlacements":0,"unusedImageParts":0,"formatOmissionCount":0}`).
Each carries the same version/taskId and its own observed timestamp. Then send the
12,345 PDF bytes as the final part and close the response boundary. Commit finish;
an optional later JSON lookup returns the shape above. IDs/times/hash/size are mock
values illustrating the wire contract, not a claimed generated artifact/checksum.
With a missing badge file, omit badge and badgeAgain, emit one source finding with
two affected placements, and report `partial` in artifact/lookup while valid photo
and seal remain. A malformed outer boundary instead fails and sends no PDF.

### E. Trial policy task-v1-trial-1

All byte limits count bytes, not JavaScript character length. GB is decimal;
MiB/GiB use powers of 1024. A limit is a rejection/stop bound, not guaranteed capacity.
Snapshot this policy version/values on each task; config changes do not silently
rewrite its limits. Increasing production storage alone changes no RAM/work limit.

| Guard | Initial trial value / rule |
| --- | --- |
| Shared temporary pool | **1,500,000,000 bytes** (1.5 GB); operational storage target 10,000,000,000 bytes is a future configured profile, not tested here |
| Actual volume free-space floor | Keep 256 MiB outside owned reservations; account shared legacy staging/outputs once; unrelated disk use can still cause a handled I/O failure |
| Initial held / growth quantum | 8 MiB / 8 MiB; reserve before every bounded write, including before payload is fully read |
| Per-task held ceiling | 1,000,000,000 bytes, includes originals + normalized + prepared + PDF + unused holds; cannot consume the entire shared pool |
| Whole request / payload JSON | 512 MiB actual request-body bytes including multipart framing / 64 MiB UTF-8 payload; no whole-body parsing |
| Per image / image count | 50 MiB per binary image; at most 1,000 source image definitions and 1,000 binary parts; at most 2,000 prepared derivatives and 10,000 image placements |
| Pixel/preparation limits | Retain existing 40,000,000 source pixels, 8,000,000 target pixels, single-page JPEG/PNG, at most 30 s/image; no silent quality reduction |
| Structured bounds | Depth64 (root depth1); scalar string64 KiB; member name256 UTF-8 bytes; logical record256 KiB; 100,000 total logical records; normalized output256 MiB; bound each before materialization |
| Composition / output | 50,000 expanded nodes, 2,000 pages, 256 MiB PDF; use the stricter existing Core guard until a verified replacement is active |
| Transport metadata | At most 1,001 parts (payload + 1,000 images); part name2 KiB UTF-8, headers16 KiB/part; aggregate retained intake index8 MiB |
| Queue/admission | Shared existing JOB_MAX_OUTSTANDING default10 across legacy/jobs/tasks, task counted once; new tasks sublimit4 global,2/owner; terminal records do not consume queue capacity |
| Active work | At most2 receiving requests,1 shared generation worker and1 image-preparation worker; no separate legacy/task worker overlap; sending capped2; active permits persist until actual stop |
| RAM trial boundary | Isolated Service + all owned children in a 1 GiB enforced memory group (DB separate); account native/cache usage too; stop admission/new decode at768 MiB, cancel safely at896 MiB, hard limit1 GiB |
| Application buffers | 64 KiB intake chunks, at most256 KiB queued incoming data/task; feedback/output combined at most512 KiB/task, stream backpressure mandatory |
| Deadlines | Absolute3 h from DB creation; receive30 min, validate15 min, processing90 min, PDF-send30 min, each additionally clamped to remaining absolute life |
| Stalls / stop / maintenance | Receive inactivity60 s; blocked response write60 s; quota-lock wait at most5 s then fail safely, no indefinite disk wait; graceful stop5 s, then terminate only owned process tree; expiry/cleanup sweep10 s plus startup reconciliation |

The group memory boundary is a future isolated test prerequisite, not a claim that
new-task execution works in 1 GiB. Stage 6 measures the whole process group and
rejects an inadequate profile. Existing 20-image/64 MiB retained-image guards stay
in force until Stage 3/4 activate the negotiated replacement across the whole path;
the new ceilings never authorize bypassing them prematurely. Large structured
graphs also remain subject to actual Core memory limits, despite accepted stored JSON.
Logical records are values of Core-declared input array members (including a
Format entry and any nested collections it owns), measured as complete UTF-8 JSON
subtrees; transport root/Section envelopes are not records. Nested records count
toward the aggregate limit as well; no unlimited parent record is allowed merely
because a child collection can stream. Object-valued inputs outside arrays have
the same256 KiB record ceiling except declared envelopes. This intentionally
rejects a single oversized member rather than materializing it. Image binary bytes
are separate multipart data, not part of the JSON record-size counter.

### F. Reservation, races and precise stop boundary

Let `H` be this task's held bytes, `U` its actual owned stored bytes and `P` the pool
ceiling. The invariant is `0 <= U <= H`, with `sum(all held) <= P`; used is not added
again. Account legacy reservations/bytes once in the same admission transaction.
Creation reserves8 MiB and queue slot atomically with task/opening event using DB
time. Before commit, allocation/auth/template failure leaves no task, slot or file.
Body bytes arriving before admission must remain within bounded transport buffers.
Receive/concurrency permits are acquired before task creation; if unavailable,
return503 without a task instead of opening one that cannot start receiving.
Global quota/worker claims are durable/shared, not process-local counters that
multiple Service instances can each spend independently.
Within a task the initial implementation serializes owned disk-write windows under
one fenced writer claim: reserve against reconciled U, write within the granted
window (at most8 MiB), then reconcile actual bytes before another writer is granted.
Do not let preparation and PDF writers both spend the same unused H using stale U.
No DB transaction stays open across file I/O; on crash retain H and revoke/stop the
old writer before stat/reconciliation. This writer claim is not a new public job.

Before a write of `w` bytes, if `U+w > H`, atomically acquire
`delta = ceil((U+w-H)/8MiB)*8MiB`, clamped to the per-task ceiling only if the exact
write still fits. Check pool, task cap and actual-volume headroom under common
ordered locking. No disk write beyond granted H; chunk accounting includes .part,
normalization, partial output and scratch, not just successfully sealed files.
If actual free volume bytes are F, new delta must also satisfy
`sum(H-U across all reservations) + delta <= F - 256MiB`: subtract promised but
unwritten bytes before admitting another reservation. Logical quota counts stored
file bytes; actual free-space checks additionally catch filesystem overhead or
unrelated writers. Neither physical free space nor quota checking replaces the other.
Write failure keeps conservative accounting until actual bytes are reconciled;
do not shrink from an in-memory counter before confirming deletion/stat.

Before the job starts, require at least64 MiB of *unused* held processing allowance
in addition to retained originals/normalized parts, and budget the next image's
known target/raw workspace before decode. This is headroom, not another copy of U
or a promise that the whole job fits. Every later file write still reserves growth;
if a conservative next operation cannot fit disk/RAM/work bounds, fail before it.
Do not queue indefinitely waiting for storage the same task/retained failures hold.

Example: opening H=8 MiB,U=0; writing9 MiB total requires H=16 MiB,U=9 MiB.
Before processing, U=9 MiB and 64 MiB unused requires H=80 MiB, not73 MiB and not
U+H charged to the pool. Deleting3 MiB gives U=6 MiB; release only confirmed unused
holds under lock, preserving allowance for still-active operations. Another task
cannot spend that reservation until release commits. Global exhaustion is fatal,
never `IMAGE_LIMIT` or a successful PDF with capacity-caused missing images.

Lifecycle CAS/lease checks gate every state change and publication. Use DB time for
expiry and short worker leases (30 s, renewed at most10 s); after lease loss revoke
result authority and stop owned work. Do not grant a replacement worker while the
old one could still write; no auto-rerun. Deadline, confirmed connection loss, idle
timeout and I/O failure trigger safe stop; only confirmed finish before deadline
can win terminal success. Pausing reads for a quota check does not pretend client
inactivity, but remains bounded by lock/absolute deadlines. A maintenance sweep
delay never extends authorization to read/write past expires_at.

After safe stop, release queue/active permits according to their distinct lifetimes;
remove partial input/scratch/unsent PDF, retain only fully received originals until
original expiry. A payload is fully received only when its part closes correctly;
the dataset is sealed only when outer framing completes. Therefore a closed payload
part can be retained after a later binary part truncates, but never processed.
On success remove all task-owned bytes immediately after handles close. Failed
deletion leaves quota charged and retry_needed, with durable task/events/usage intact.
DB terminal transition + event + usage revision1 is atomic; cleanup may finish later.
Unknown crash/delivery measurements stay NULL, no automatic fee or inferred success.

### G. Stage 0 acceptance and next-stage proof

Specification coverage: all three image forms, two-Section key isolation, duplicate
sources, missing/oversized image versus incomplete transport; generate/lookup and
no-taskId resubmission; owner spoofing and no billing mapping; event/binary framing,
first metadata timing, completed send versus crash; concurrent unknown-size growth,
processing headroom, deadline/cancel/delete races and legacy accounting are defined.
Documentation checks validate examples/pointers, arithmetic, links and consistency.
They establish specification closure only, not a running endpoint or measured RAM.

Stage1 must prove DB/owner mapping, shared atomic quota/create, one receive claim,
stream-to-disk/seal, retained-file accounting and crash/expiry cleanup in isolated
storage/DB. It must not expose a production generate endpoint that merely accepts
data but cannot complete the declared feedback/PDF contract. Gate that route until
Stages2–5 negotiate and implement it; test intake through isolated/internal adapters.
Stage2 owns Core-backed bounded data/image normalization; Stage3 owns file-backed
layout/writer; Stage4 owns task/job/send/cancel; Stage5 owns real consumer parsing.
Stage6 proves resource thresholds and complete UAT/SRS/SB.1 PDFs. No stage may call
a skipped or not-run criterion PASS. Production tuning, browser/proxy certification,
error-level modes, billing rates, byte resume and replay remain outside Stage0.

Stage0 closeout: reviewed the final contract against the owner's decisions and
inspected Service auth/queue/image guard boundaries without changing products.
JSON examples, binary pointers, sharing/omission counts, TTL, reservation rounding,
physical-space accounting, local links and Markdown table consistency are checked;
receipt: `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage0/checks.json`.
This is documentation/specification verification only; no API/DB/RAM/PDF test was
run or claimed. The one-document budget is retained; duplicated earlier intake
proposals were replaced by references to this contract. Next is separately
authorized Stage1 intake/storage implementation, not release or installation.

### Stage1 execution ledger — 2026-10-19

Owner instruction in this chat authorizes internal task foundation/intake and its
permission, concurrent quota, file, expiry and restart checks. Single-room inline;
role Product Implementation Agent / Cross-Repo Boundary Reviewer; execution IDs N/A.
Routine risk; source owner Service. Base `e605d93`, branch
`codex/task-intake-stage1-20261019`, workspace
`C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/task-intake-stage1`.
PC record branch `codex/task-stage1-record-20261019` in its managed worktree.
Use current configured model inline; no separate implementer WORK room or model
inheritance claim. This existing plan is the authority and progress ledger.

Bounded steps: [1] migration/pinned identity/atomic admission; [2] streaming
multipart receipt + bounded transport JSON checks; [3] safe stop, expiry, retained
originals and recovery; [4] impacted regression, independent review and candidate
commits. Tests must first fail for absent task functionality, then pass. Document
budget: this plan plus code-adjacent usage notice only; no new startup guide/map.
Acceptance is receipt/seal, not Core schema-valid input or runnable PDF. Core
normalization/signatures/Section binding and processing remain stages2–4.

Preflight: quota/create consumes the same60430405 lock as legacy queue/uploads;
receipt writes consume reservation before I/O; cleanup releases only removed bytes.
Ruling: serialize one receive writer per task; use bounded64 KiB writes below the
8 MiB maximum window. Recovery refuses to delete files of a still-live or foreign-
host writer; a local dead process can be recovered. Cross-host orchestration is not
silently assumed. Public `POST /documents` stays absent until stages2–5 are ready.
Legacy published output accounting is observed; complete legacy render-scratch/
PDF pre-write reservation integration remains a Stage4 prerequisite before enabling
the new public route. No broad whole-runtime disk/RAM guarantee is claimed here.

Result: PASS within Stage1 receipt/storage scope. Service candidate commit
`0eb192f58f9816017fe4d1e7e1c41a9c44a6a5df`; clean isolated worktree, not merged.
Migration022 adds five tables and a nullable job/task link explicitly gated to
NULL until Stage4; no released migration bytes or Core package pin changed.
Identity/template/policy pins and creation-based three-hour expiry are immutable.
Task events and terminal usage facts are retained; unmeasured crash byte counts
remain NULL. Internal open/receive/inspect plus startup/ten-second maintenance
are implemented; public HTTP/CLI wiring is intentionally absent.

Coverage and reusable proof (Service tests are durable candidate evidence):

- `tests/task-intake.test.mjs`: 32 passing cases cover trusted identity, owner and
  creator permissions, atomic shared queue/storage admission, incremental growth,
  physical unused promises and mixed-policy floor, multipart/UTF-8/JSON budgets,
  filenames, complete-file retention, disconnect, deadline, disk failure, deletion
  retry, actual killed-child recovery, receiver token/process fencing, stale-state
  CAS, and automatic startup/periodic expiry. Image receipt fixtures do not claim
  decoded-image validity, semantic Section binding or PDF readiness.
- Host build passed; task/database/resource-file checks passed42/42 in
  `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage1/host-accepted.log`.
- Latest isolated Linux verification image: 99 files,357 passed,0 failed,
  6 skipped of363 tests, including old migration upgrades, queue, uploads,
  model18/19 and PDF-generation regressions. Root test schema was migrated first;
  invocation used60s test/hook timeouts under a1 GiB/2 CPU test-container limit.
  No test assertions were weakened. The initial run's README migration mismatch
  was corrected; absent root schema and default5s timing failures were rerun.
  The Windows FONT_CHECK_UNAVAILABLE cases passed in Linux. This is not a peak
  RAM/capacity measurement or every-page visual PDF acceptance.
- Six skips remain explicitly unverified: three installed-binding delivery guards,
  two real-profile/native-FlowDocMake proposal cases, and one supplied-font import
  case, all gated by external fixture/configuration. No live font or installed
  runtime check is claimed. They remain later integration/release proof needs.
- Independent bounded review PASS after fixing receiver ownership/stale recovery,
  physical quota propagation and mixed-policy accounting, unknown byte counts,
  and maintenance. Regression failures were observed before the fixes; no remaining
  Critical/Important findings in the reviewed scope. Receipt: `review-receipt.json`.
- Complete logs and compact final receipt: local proof directory
  `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage1/`; native report
  `native-accepted.json`. Candidate diff/whitespace and this plan's authority/local
  links checked. Original main/release refs retained. Test containers/credential
  files are removed after verification; unmerged candidate branches/worktrees stay.

Next is separately authorized Stage2 bounded validation/normalization. No task PDF,
public route, giant-data capacity claim, main integration, push, release, tag or
installation is accepted here. Execution IDs remain N/A; no product map promoted.

## Phased plan and acceptance

### Stage2 execution ledger — 2026-10-19

Owner authorizes isolated validation/normalization, Section-local named/unnamed
images and recorded omissions, with model18/19 regressions. Product Implementation
Agent / Cross-Repo Boundary Reviewer, single-room inline, execution IDs N/A;
routine risk, medium work size. Core owns typed bounded reader/normalization;
Service owns file-backed reader, image metadata/resolution and durable findings.
Bases: Core `e1a6517`, Service `0eb192f`, PC `bb99456`. Core isolated worktree:
`C:/Users/nekot/Documents/GitHub/flowdoc-core-worktrees/task-normalization-stage2`.
Reuse the clean Stage1 Service/PC worktrees on new branches
`codex/task-normalization-stage2-20261019` / `codex/task-stage2-record-20261019`.
No registered room dispatch; current configured model implements inline.

Bounded sequence: [1] Core reader/typed image omission tests RED then implementation;
[2] Service file-backed traversal and Section image collection/resolution tests;
[3] pinned packed-Core integration, findings/quota/stop persistence; [4] affected
legacy regressions, one independent review and isolated commits. Proof budget:
targeted checks per change, one final affected-suite run per owner plus packed
Linux consumer; repeat only on failure/change. Document budget: this existing
ledger and concise code-adjacent notices, no new AI startup guide or product map.

Ruling: Core accepts storage-neutral value handles and writes canonical normalized
input incrementally; Service supplies byte-range file handles. This preserves
property-order independence without buffering a Section/Area entry or full JSON.
Two bounded passes collect image definitions then resolve forward references;
metadata must stay within the existing index budget. Unsupported images become
explicit typed unavailable resources, not missing required fields. The existing
object-based prepareGeneration and legacy endpoints retain their contracts.
Normalization success remains internal at validating with a sealed normalized
artifact; queue/job/public route and incremental PDF remain later stages. Cost if
wrong: Stage3 reader adaptation, not a silent change to legacy prepared snapshots.

Acceptance: optional assetKey, key-only/inline/Section assets, unkeyed separation,
same key across Sections, identical/conflicting definitions, malformed/missing/
unused parts, image signature/dimensions, exact counts/reasons, scalar/record order,
escaped/Thai pointers, unknown fields/defaults and model18/19 shape; no whole-file
JSON parse, giant DB payload, resource leak or new PDF/API exposure. Preserve pins,
original expiry, owner checks and global-capacity-fatal behavior. No main merge,
push, release/tag or installation.

Result: PASS within isolated Stage2 normalization scope. Core/Service development
candidates are0.4.5; previous0.4.4 artifacts and main/release refs are not rewritten.
Core commit `e2935eb34634607eb9c38b72e5bcdfaa6ba8b4a3`; Service commit
`32a25fc42f62a12736337c0c5d68dd3bb323d6d3`. Service vendors the verified Linux
tarball by checksum and that exact Core source commit, not source-path imports.
Migration023 adds normalization pins, validation start and immutable findings;
populated022 task history/files survive unchanged. No released migration changed.

Evidence coverage and limits:

- Core `tests/data/taskInput.test.ts`:15 passing cases, including model18 defaults,
  model19 identities/property order, required unavailable images, typed/escaped Thai
  slots,100,001-record rejection, complete oversized parent record rejection,
  placement budget, long valid links and lazy collection traversal. Full Linux
  Core suite793/793 plus packed consumer PASS; its artifact/result is under
  `C:/Users/nekot/Documents/GitHub/flowdoc-core-worktrees/task-normalization-stage2/artifacts/1792349087833/`.
- Service tests: `task-image-index.test.mjs`11, `task-json-reader.test.mjs`2 and
  `task-normalization.test.mjs`16, all passing. They cover optional/inline/key-only
  assets, Section isolation, identical/unverifiable conflicts, invalid/missing/
  unbound images and counts, actual image metadata/signatures, Unicode pointers,
  persisted reasons/owner paging, unknown/default values, model18/19, quota/write
  batching, stop/concurrent fencing, changed input, expiry and022→023 preservation.
- Final Linux Service:102 files,386 passed,0 failed,6 skipped of392. This includes
  the unchanged32 Stage1 task tests and legacy queue/upload/font/Section/model/PDF
  generation regressions. The six externally gated font tests remain unverified
  as listed in Stage1; no installed-runtime or FlowDocMake connection claim.
- All three Important review findings have reproducing RED→GREEN checks: link
  limits now follow64 KiB scalars/256 KiB records; record/source/placement/output
  counters enforce the agreed ceilings; validation stops at15 minutes or original
  expiry, with a DB-time write/publication fence. No Critical or Minor findings.
  An additional reproduced long-diagnostic SQL failure is fixed by a bounded
  displayed pointer plus stable full-locator hash. Finding detail retention is
  capped at10,000 with exact aggregates and detailsTruncated beyond the cap.
  One independent review; fix verification is by the parent and tests, no re-review.
- Proof directory `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage2/` retains
  `native-accepted.json`, `core-package-receipt.json`, `review-receipt.json` and
  final `receipt.json`. Source diff/whitespace, package identity, authority and
  local documentation links checked. Temporary DB/containers/credentials are
  removed after verification; all unmerged candidate branches/worktrees remain.

Review exclusions stand: full decoding/preparation, incremental PDF, public task
API/feedback, FlowDocMake integration and whole-group capacity certification are
Stages3–6. Normalization summaries are historical facts, not PDF readiness; image
probing does not certify full raster decoding. Cost of that boundary: no claim
that a complete real UAT task can render yet. No source/schema/map promotion,
main merge, push, release/tag or installation. Next is separately authorized Stage3.

Stage0 specification and isolated Stage1–2 candidates are complete;
Stage3 is complete in its isolated Core scope; stages4–6 are not started.
Runtime authorization remains separate. Each stage stops at its verified checkpoint.

| Stage | Owner and output | Required proof |
| --- | --- | --- |
| 0: contract specified 2026-10-19 | Project Control: v1 API/JSON/binary binding, identity, events, reservation and trial profile above | Documentation examples, arithmetic, transition/exception coverage and legacy boundary checked; runtime/capacity proof remains in stages 1–6 |
| 1: dataset intake/storage — isolated candidate complete | Service: reserve/create task atomically, stream unknown-size dataset with counted incremental reservation; seal and recovery | Evidence and unverified external cases are listed in the Stage1 ledger above; receipt is not runnable proof |
| 2: bounded validation and normalization — isolated candidate complete | Core typed reader; Service file/image adapters and Section asset resolution | Stage2 ledger above connects cases, limits, commits and verification; public task processing remains later scope |
| 3: Core incremental image/PDF path — isolated candidate complete | Core: metadata-only image layout, pinned resource provider, sequential embedding and incremental output | Stage3 ledger below: 820 Core tests; packed Linux consumer; 25 distinct source images in model18/19; 100-image retained-buffer proof; 74 PDFs /316 rendered pages and legacy comparison |
| 4: Service processing integration — isolated candidate complete | Service: parent task/job projection, feedback/PDF stream, confirmed-disconnect stop and per-file retention | Packed Core, bounded progress/response errors; disconnect during receive/queue/process/send versus after complete send, bounded stop/escalation, no stale success, no false free permits; scratch/PDF deletion versus originals retained to fixed expiry, cleanup retries/quota reconciliation, restart/deadline races and permanent history; no whole-PDF buffer |
| 5: FlowDocMake/legacy integration — isolated candidate complete | FlowDocMake and Service: single-API new generation or exact-task lookup, incremental feedback/PDF parsing, Section assets and lasting records | Real proxy/client stream visibility, request-upload timing, split chunks, save/hash, partial feedback, no taskId creates new work, taskId never duplicates/resumes/downloads, legacy/mixed compatibility; no mandatory polling, opening call or error-level selector |
| 6: resource and full-document acceptance | Service/Core with isolated fixtures and original UAT inputs | Grow unique-image count with fixed image size; separately grow one image and structured records; large alpha images, repeated assets, slow output and repeated jobs. Record total peak RAM/disk/time and cleanup against Stage 0 thresholds. Then verify all UAT placements, headers/Accept marks and every output page; regress SRS and SB.1 |

Do not remove the existing count protections until their replacement is active
across the complete negotiated path. For rollout, small-request compatibility is
required; broad large-JSON support must not be claimed from image-heavy tests.

## Proof, documentation and stopping boundary

### Stage4 execution — 4A Core bridge and 4B Service integration authorized

Owner approved both4A and4B after the preflight below, with no main merge,
release/push/install. Product Implementation Agent; execution IDs not applicable.
Core branch `codex/task-processing-stage4-20261019` base35e65dd; Service branch
same name base32a25fc; PC `codex/task-stage4-record-20261019` basef78d86b.
Reuse the existing isolated worktrees. Document budget: this ledger and necessary
repo-owned README/usage changes. Proof budget: TDD per changed boundary, Core
package consumer, isolated DB/container Service regressions and lifecycle tests,
one independent final whole-change review with one bounded fix pass.
Evidence: `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage4`.

Pre-flight interfaces: normalized typed handles -> Core bounded composition ->
ResolvedDocument -> prepared stream provider -> streamed PDF receipt -> Service
owned output and terminal delivery. Legacy prepared schemas/byte API stay separate.
Core owns bind/expand/validate semantics; Service owns task identity, durable pins,
shared worker admission, file accounting, image preparation and response lifecycle.
Ruling: preserve one bounded resolved graph (50,000 identities) while traversing
source collections lazily/replayably; never hold full original plus PreparedInput.
This is bounded composition, not layout spooling. Cost if wrong: stop at the
composition/work boundary rather than weakening image/data completeness.

Tasks: A1 typed record/scalar reader and Core composition bridge preserving IDs,
groups, Areas, bands and omissions; A2 limits/legacy/package/PDF integration;
B1 forward task/job pins and shared worker lifecycle; B2 quota-aware serial
derivatives/output and bounded child transport; B3 feedback/delivery/disconnect/
expiry/recovery/cleanup; B4 isolated integration/legacy proof, final review and
commits. Tests/results/rulings are appended here as each boundary is verified.

A1/A2 implementation checkpoint: Core29fd2af (base35e65dd), development0.4.7.
Host/native832 tests and actual Linux package consumer PASS. Package SHA256
`dd965695587389cc204d3e5c6f8fb993663c08b45e137daae8bcd24283e91295`.
All74 pre-existing Stage3 PDFs are byte-identical; three new task composition
consumer aliases match legacy graph/output. Final whole-change review remains.

B2 Ruling: one owned Linux process group composes bounded typed handles, decodes
one source at a time and streams derivatives/PDF through acknowledged64KiB IPC;
parent reserves before each write and owns publication/accounting. Core native
font writes receive an exclusive conservative scratch window, inherited Linux
RLIMIT_FSIZE and fixed-count source/subset/request algorithm; reconcile scratch
before output and after actual group stop. No unaccounted legacy preparer/stdout
buffer fallback. Cost if wrong: fail closed with retained reservation until
actual stop/cleanup, never claim free capacity. Windows task child is unavailable
in this candidate; supported deployed runtime and acceptance use Linux/amd64.

B1/B3 Ruling: integrate the task hook inside the existing session-held serial
processor60430404, version task descriptors separately from legacy PreparedInput,
and use the normalized file digest as the font input pin. Admission style checks
defer file IO to the reserved child; exact assets and actual glyphs remain Core
render checks before any PDF part. Public endpoint/capability stays Stage5.
Cost if wrong: reject task, preserve source until original expiry; no retry job.

Integration correction: the real file-backed TaskValue has prototype methods.
A1's spread projection dropped them. Reproduced by an additional Core test RED,
fixed using explicit delegation GREEN. Corefb567f4,833/833 host/native tests;
actual package consumer PASS. This supersedes the initial package pin above:
SHA256 `e79726b50f8aa2d8436d003aaf0727f87ed86b8e615ee8dc0a59b041c2dc2d5a`,
artifact `flowdoc-core/artifacts/1792376778859/flowdoc-core-0.4.7.tgz` in the isolated
candidate. Service's manifest/lock use this exact file; same-version npm cache
initially retained the old integrity, corrected from the actual packed bytes and
verified with a clean install/vendor check. No installed package was modified.

B1–B3 implementation checkpoint: forward024 task descriptors and pins, shared
processor hook, child IPC derivative/output stores, response coordinator,
terminal usage, safe cancellation, DB deadlines, sender slots, actual group-stop
recovery, PID start identity and deletion retry. Public API and FlowDocMake remain
unwired. Initial25 lifecycle tests PASS on isolated PostgreSQL/Linux under1GiB,
including24 mixed JPEG/alpha PNG sources and retained retired-library fonts.
A final explicit-key/anonymous/omission case and joint regression run remain.
This is candidate progress, not Stage4 acceptance or deployment readiness.

B4 Ruling: initialize the public schema of the isolated verification DB before
legacy version-render tests, as the standard harness does; use30s test-runner
bound for the10,000-record asynchronous disk-reader case. Its default5s expired
under the full container suite; this is not a production processing deadline or
performance claim. Keep all semantic/count/record limits and runtime deadlines.
Initial suite also exposed stale migration expectation lists (now include024)
and stale candidate README package locators (now0.4.7). These are corrected and
rerun rather than recorded as PASS. A briefly overlapping verification container
was stopped; advisory-lock suites run serially, not in parallel schemas.
Cost if wrong: no performance certification; Stage6 still measures full workload.

B4 pre-review verification: Service36a1ca9,413 passed/0 failed/5 skipped
(418 total), with all26 new processing cases and all76 task receive/normalize/
reader/processing cases passing. Core833 tests and real package consumer remain
unchanged PASS. PC authority22/22 PASS. Final package PDF proof:74 prior PDFs
byte-identical;8 new PDFs/15 pages strict parse/render/visual PASS. Regenerated
Service PDFs with random resource/font identities were compared on every page:
all pixels equal. Records: `service-verified.json`, `task-scope-coverage.json`,
`pdf-verification.json`, `pdf-rerun-parity.json` under the Stage4 evidence folder.

One fresh-context whole-change review completed (Core35e65dd..fb567f4,
Service32a25fc..36a1ca9): zero Critical, one Important, zero Minor. Important:
preparation failure of a shared asset lost exact affected counts, Section/input
locators and generation completeness after cleanup. Reproduced RED with a real
PNG readable by metadata but invalid at full decode, shared by two equal frames
and a third smaller frame. One bounded fix pass now aggregates per variant and
Section, persists the input source pointer/full count/bounded node sample, and
commits diagnostics before suppressing equivalent Core warnings. Separate
immutable generation observations and terminal usage preserve partial status
without rewriting normalization. Targeted regression GREEN; final whole suite
runs on a fresh isolated DB with the revised never-deployed024 candidate.
No edits to previously applied released migration bytes.

Final Ruling: generation image counts explicitly use `expanded-image-nodes`,
before physical page-band repetition; normalization retains input-slot counts.
This keeps each phase's unit explicit and records all three affected frames in
the reproducer (two findings). Physical repeated page-placement measurement stays
Core layout/Stage6 scope, not an inferred billing metric. Cost if wrong: these
counters cannot be used as physical-image billing quantities without later proof.

Review boundaries retained: Stage5 owns HTTP/FlowDocMake response integration;
Stage6 owns original full workload and sustained RAM/performance. Windows task
rendering fails closed; abandoned/old jobs are not resumed. No rolling-install,
release/main/push/install certification. Parent owns every-page PDF verification.
Five optional tests remain unrun, not PASS: three installed font-height delivery
checks, native FlowDocMake stdio/HTTP round trip and the supplied seven-family
import/profile fixture. Existing available Pridi and library/retired regression
coverage did run. These do not certify the later external integration phases.

Stage4A/4B complete within the isolated candidate boundary. Core terminalfb567f4;
Service terminalbd90a0c (implementation36a1ca9 plus one Important fix). Both
Core/Service development0.4.7, exact Core archive SHA recorded above. No main,
release/tag, push, install or public capability activation. Candidate branches
and worktrees are unmerged and deliberately retained.

Final proof: Core833/833 plus actual packed Linux consumer PASS; Service414
passed/0 failed/5 explicitly unrun optional external cases (419 total). All77
receive/reader/normalization/processing cases PASS, including27 processing cases.
Important shared-image finding fixed RED to GREEN and full suite green in one
fix pass; no second reviewer.27th case preserves three omitted image frames,
two variant findings, exact Section/input locators, independent normalization
and immutable generation observations, partial usage and zero duplicate engine
image warnings. Builds/vendor integrity/whitespace checks PASS. PC authority22
checks passed before final closeout; final record check is run before commit.

PDF acceptance:9 new PDFs/16 pages strictly parsed, rendered without warnings
and visually reviewed. All24 JPEG/transparent PNG source images,12 masks and
24 row labels verified; explicit assets reuse while identical anonymous images
remain separate. Regenerated prior candidate pages are pixel-identical.74 prior
Core PDFs remain byte-identical to Stage3 and reuse that every-page proof.
This is bounded regression evidence, not full original UAT/production RAM proof.

Evidence directory `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage4`:
`receipt.json`, `review-receipt.json`, `task-scope-coverage.json`,
`service-final.json`, `optional-test-gaps.json`, `pdf-verification.json`,
`pdf-rerun-parity.json`, PDFs/renders, build/package/RED-GREEN logs and unchanged
protected-ref receipt. Source tests/consumer scripts and commits are the durable
implementation evidence; this ledger does not promote product maps.

Cleanup limitation: automatic approval rejected the combined test-container/
network/image/private-environment-file deletion command with only `blocked by
policy`; it never executed. No alternate deletion attempted. A narrower
reversible action successfully stopped the exact owned isolated PostgreSQL
container. Test resources and private generated environment files remain for
later authorized cleanup; no user/live data or unrelated resources were touched.
Next planned work is Stage5 API/FlowDocMake integration, then Stage6 full data
and resource acceptance. Do not install or merge as part of this closeout.

### Stage4 preflight — retained discovery, superseded by authorization above

Owner request: start Service integration, including task/job, reservations,
feedback/PDF, disconnect, expiry and cleanup; no main integration, release or
installation. Active role: Cross-Repo Boundary Reviewer (discovery before an
owner/contract scope change), execution IDs not applicable. Existing single plan
remains authority. This preflight does not reopen or revise Stage3 acceptance.

Read-only discovery confirmed the dependency flagged at Stage3 closeout:
`normalizeTaskInput` produces `flowdoc-task-input/1` and typed task-image markers.
`composeDocument` accepts only legacy PreparedInput schema1/2; passing the new
normalized representation returns `INVALID_DATA` at `prepared`. Feeding its values
through `prepareGeneration` instead returns `TYPE_MISMATCH` on an image marker.
Existing composition expands synchronous in-memory PreparedData. Service's legacy
renderer also serializes the full document and collects PDF stdout into one buffer;
that renderer cannot be reused as the task large-data path.

Reproduction: tiny existing Area18 fixture with one image, using built Core0.4.6
at `35e65dd6918b66141df09701e2acd7bb3a855bdd`. Receipt:
`C:/Users/nekot/Documents/Codex/2026-10-19/task-stage4-preflight/core-bridge-probe.json`.
Normalization succeeds; both direct composition and legacy preparation reject as
above. Replacing the marker with a UUID in this tiny in-memory fixture succeeds,
confirming the boundary rather than proving a production adapter. This shortcut
does not cover unavailable images, a whole large dataset, replays or record bounds.

No runtime, migration, package pin, task data, installed system or product branch
changed during preflight. Core and Service isolated candidates remain clean at
`35e65dd` and `32a25fc`. This record is on PC branch
`codex/task-stage4-preflight-20261019`, based on `4edee14`.

Proposed scope clarification for owner approval before implementation:

1. Stage4A, Core-owned prerequisite: specify and implement a bounded composition
   entrypoint consuming the normalized typed reader. Traverse declared records
   without materializing the complete source/prepared payload; preserve global/
   Section/band values, stable expansion identities/order, Area/Format/repeat and
   row-group semantics, unavailable-image frames and existing errors. Retain the
   shared document expansion budget and streamed PDF path. Choose reader/replay or
   spool details only after examining Core binding consumers; do not copy Core
   validators/binders into Service. Proof: normalization-to-composition-to-PDF,
   available/unavailable images, both models, arrays/global reuse, two Section
   clones, fixed, links/TOC/page fields, work limits and legacy parity.
2. Stage4B, Service integration from the original phase row: consume the verified
   Core package; connect permanent task and child job pins, shared admission,
   quota-aware serial preparation/output, bounded feedback and one final PDF part.
   Verify disconnect/expiry/lease/crash races, safe actual worker stop, terminal
   facts, originals retained to original expiry, scratch/failed-send PDF removal,
   cleanup retry and exact accounting. Keep public FlowDocMake wiring for Stage5.

This is a proposal, not accepted new Core implementation scope. The current plan
explicitly says to surface a new Core reader/spool before Stage4 implementation.
Whole-file parse/UUID rewrite and Service imports of Core private paths are not
acceptable fallbacks. Once the dependency scope is agreed, update this same plan
and execute it in isolated candidates; retain the no-main/release/install boundary.

### Stage3 execution ledger — 2026-10-19

Owner authorization: implement Core image/PDF path only; no main integration,
release, push or installation. Product Implementation Agent, Core owner;
Work/Phase/Checklist IDs not applicable (single room). Existing isolated Core
worktree `flowdoc-core-worktrees/task-normalization-stage2` now uses branch
`codex/task-pdf-stage3-20261019`, base `e2935eb34634607eb9c38b72e5bcdfaa6ba8b4a3`.
PC record branch `codex/task-stage3-record-20261019`, base `f28bd992a005fc41be5c5033193957cbdce35e0e`.
Service remains unchanged at Stage2; no public capability activated.

Scope: bounded prepared-image descriptors/providers, sequential verified stream
embedding, backpressured PDF object output and a separate engine method returning
only bytes/hash/page metadata. Legacy byte-return limits remain unchanged.
Proof budget: RED/GREEN resource/writer/engine tests, affected legacy tests, one
packed Linux consumer with real JPEG/transparent PNG-derived streams, syntax and
every-page visual checks, one independent final review and bounded fixes.
Document budget: this existing plan ledger and Core's code-adjacent README only.
Evidence target: `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage3`.
Risk: partial output must never become success, mutable resource/sink state across
awaits, image retention, image lengths/hashes, alpha/resource dictionaries and xref.
Whole Service process-group RAM and source/UAT acceptance remain Stage6 proof.

Pre-flight: Stage2 normalized task-image markers are not legacy prepared snapshots.
Stage3 consumes a validated bounded ResolvedDocument plus pinned derivative
descriptors; Service owns decoding/derivative storage and orchestrates Core
composition in Stage4. Core never opens client paths/URLs or adds an image decoder.
Prepared JPEG or zlib RGB/alpha bytes are verified through the provider; PNG
decoding stays with the existing Service image preparer. Cost if this interface is
wrong: Stage4 must revise its adapter before activation, never silently fall back
to retained buffers. Existing font/TOC/link layout algorithms remain shared.

Tasks: (1) pinned descriptors/stream verification; (2) lazy shared PDF object
assembly; (3) metadata-only engine API, snapshot/stop/output bounds; (4) package,
legacy and PDF acceptance; (5) review, evidence and candidate commits.

Tasks1–3 implemented: versioned metadata-only provider, frozen descriptor/callback
snapshots, exact content length/SHA verification, JPEG framing and streaming RGB/
alpha inflate validation, lazy shared PDF object planner, page-local resources,
64 KiB awaited output writes and final xref/hash receipt. Public engine
`generatePdfTo` preserves legacy `generatePdf` limits and layout semantics;
failure closes the active resource/session and calls the owned output abort.
Core development version0.4.6; Service remains0.4.5. Host build and all820 tests
pass after the review fixes below; completed packed/native/PDF proof is below.

Independent reviewer checked `e2935eb..4edaf1a`: zero Critical, two Important,
zero Minor. Both Important findings reproduced RED and fixed GREEN in one pass:
provider mutation during inflate (RGB and alpha) now copies at most64 KiB before
hash/await; image placement limit now stops layout before retaining placement10,001
across page bands, body and table cells, before subset/output. Writer retains its
guard. `review-red.log` has all three failing regressions; `review-green.log`
has820/820 passing (82 files). No re-review or extra implementation lane.

Review exclusions accepted within Stage3 scope: source decoding/orientation/colour
and JPEG entropy validation remain Service preparer duties; reservations/task
composition orchestration/adapter deadlines/forced stop remain Stage4; whole-group
RAM/source UAT proof remains Stage6. Structured spooling is not implemented or
authorized by this image/PDF acceptance: if the normalization-to-composition bridge
requires a new Core reader/spool, surface that scope before Stage4 implementation;
never silently materialize the complete normalized input as a fallback.
Installation/release is forbidden here.
Private writer draw/fonts are owned by the public engine, not a public mutable
writer contract. These are boundaries, not proof waivers: Stage3 still requires
packed Linux output and every-page rendering, and later activation must verify
all deferred consumer responsibilities before bypassing any legacy guard.

Native prerequisite interruption: Docker initially failed on a stale Secrets
Engine socket; normal force-stop and detached start restored the daemon.
An attempted bounded stale-socket removal was rejected automatically and did not
run; no alternate deletion was used. No factory reset or data/configuration edits.
Tasks4–5 complete. Core candidate terminal commit
`35e65dd6918b66141df09701e2acd7bb3a855bdd` (initial implementation `4edaf1a`,
one review fix commit). Service is unchanged at
`32a25fc42f62a12736337c0c5d68dd3bb323d6d3`. Main and release refs remain unchanged.

Final verification (all PASS, no skipped Core cases):

- Host TypeScript build and820/820 Core tests; same820 tests run inside the
  Linux/amd64 package build. Native session checks passed16 exact one-shot cases,
  malformed frames and EOF. Final diff/whitespace checked before proof/commit.
- Actual packed Core0.4.6 consumer, network disabled and no mounts; checksum
  `6c1b3586a3836e4850180801577c9936c33aa2f68d5f7cdec6a792db12b2566e`.
  All legacy installed-consumer checks plus new stream/PDF and buffer checks pass.
- 25 different source-image hashes (13 JPEG,12 PNG). PNG RGB and alpha derivatives
  match actual decoded original pixels. Each model18/19 PDF has5 pages,25 distinct
  images,12 soft masks and30 placements including repeated header and a smaller
  second placement. Provider open/close74/74, peak active1. Sink writes awaited;
  input/descriptor/callback and byte-mutation cases, failure/abort/output limit,
  exact stream lengths/hash, xref offsets and page-local resources checked.
- Core retained-buffer trial10→100→10 images: 100-image PDF78,698,334 bytes/15 pages;
  peak live ArrayBuffers after explicit GC3,691,518 bytes (16 MiB test ceiling).
  Core sampled RSS for that run75,014,144 bytes. This is a **GC-assisted Core buffer
  retention test**, not production peak RSS, native preparation or the1 GiB Service
  group guarantee. Stress PDFs were streamed, independently hashed and removed.
- All74 package PDFs parsed strictly and rendered with Poppler,316 current pages,
  zero syntax/render warnings/errors. Legacy72 PDFs:51 byte-identical,21 with all
  page rasters pixel-identical to the Stage2 package. All10 new pages visually
  inspected; both models' rasters match. Checked every source placement, alpha
  centres, all13 internal link annotations (6 TOC titles +6 number links +1 jump),
  matching title/number destinations, external URI and all current/total footers.
  PDF content-order text extraction differs from visual footer order; spatial
  extraction correctly checks the fixed page fields. No runtime change for this.
- PC documentation authority checks22/22 pass from the candidate cwd, using the
  existing matching dependency installation through an ignored local junction.
  Earlier wrong-cwd/missing-dependency attempts are environment errors, not PASS.

Evidence: `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage3/receipt.json`,
`review-receipt.json`, `fixture-verification.json`, `pdf-verification.json`, logs
and page renders. Package/consumer receipt and PDFs remain in Core candidate
`artifacts/1792373977045`. Source tests and consumer scripts are committed;
this ledger is not a substitute for that evidence. No product map promotion.
Temporary consumer container was removed by the package check; its task-owned
image is cleaned after receipts. Candidate worktrees/branches and artifacts are
retained because they are unmerged. No global Docker prune or user-file cleanup.
Stop at Stage3. Next authorized stage would be Service adapter/job/output
integration using this exact packed candidate, keeping the old guards until the
complete negotiated path passes. No main integration, release, push or installation.

Reuse the UAT originals, request mapping and failure receipt; create isolated
runtime/fixtures only when implementation or measurement is authorized. Future
proof includes source/input/output digests, exact semantic counts/order, image
placement coverage, PDF syntax/link/page checks, every-page visual comparison and
resource measurements by phase. Keep unresolved Thai extraction and known source
font/page-layout differences separate; do not erase them to pass image acceptance.

For planning-only changes, check this document's authority, source locators,
dependencies, unresolved decisions, scope and final diff; product suites cannot
prove an unimplemented design. Stage1 implementation proof is recorded in its
execution ledger above. No product map, registered Work acceptance, Core package
pin or mandatory AI entrypoint change. Stop at the authorized stage checkpoint;
no merge, release or installation.

### Stage5 execution ledger — 2026-10-19

Owner authorized API/FlowDocMake integration only, no main/release/push/install.
Single-room Product Implementation Agent; Work/Phase/Checklist IDs not applicable.
Owner repositories: Service HTTP/runtime, Project Control packaged FlowDocMake.
Existing isolated checkouts now use Service codex/task-api-stage5-20261019
(basebd90a0c), PC codex/task-stage5-record-20261019 (basea480d18).
Corefb567f4/artifacte79726b50f8aa2d8436d003aaf0727f87ed86b8e615ee8dc0a59b041c2dc2d5a
is reused unchanged. Candidate versions: Service0.4.8, Core0.4.7, FlowDocMake0.2.6.

Scope/acceptance: explicit credential ownership; one multipart generation/JSON
lookup route; actual Node finish/close and bounded writes; complete-receipt timing;
public safe versioned events, diagnostics and exact-task lookup; streamed local
payload/image upload and PDF length/hash/framing parser; stdio/proxy/model18/19
and old authoring compatibility. No large unpublished-draft preview adapter or
publication is added: new task tools operate authorized registered templates;
existing bounded draft tools remain unchanged. Stage6 retains full UAT/RAM proof.
Proof budget: targeted RED/GREEN wire/client/HTTP cases, isolated Linux/PostgreSQL
runtime and actual stdio/streaming proxy, affected suites and vendor/build checks,
every new accepted PDF page, one fresh whole-change reviewer and one fix pass.
Document budget: this ledger, code-adjacent Service README/usage, existing plugin
README and version header; no extra AI-required guide, Work registry or map.

Preflight: Stage4 normalized-file/TaskResponse seam is reused; HTTP must bind
response finish/close rather than completed request close, keep payload raw-streamed
and propagate disconnect through normalization. Earlier Stage4 feedback was internal;
Stage5 replaces its public serialization without copying Core binding/validation.
Model decision: current inline host model for execution, gpt-6-astra medium for one
fresh read-only review (explicit executing-plans skill requirement). No registered
separate WORK dispatch or historical execution context reopened.

Findings so far: request boundary with32 random bytes encoded hex plus prefix was
71 characters, violating RFC2046's70 limit; binary upload exposed EPIPE. Reproduced
RED with actual producer, fixed GREEN using32-byte base64url (50 chars,256 bits).
Creator lookup previously required taskRead even for its own record; real HTTP/MCP
with taskRead=false reproduced FORBIDDEN, fixed to require extra permission only
for another principal of the same owner. Another-owner tasks remain404.
Fixed warnings beyond the100-detail sample undercounted omissions:101 real fixed
instances reproduced100, fixed by retaining aggregate separately and paginating
bounded safe details. Observed test-harness native shutdown double-stop was a
fixture error; the fixture now releases each owned processor once.

Evidence target: C:/Users/nekot/Documents/Codex/2026-10-19/task-stage5.
Verification in progress; no Stage5 PASS or shared map promotion yet.

Stage5 closeout: Service terminal8253f65, development0.4.8; unchanged Core0.4.7
fb567f4/archivee79726b50f8aa2d8436d003aaf0727f87ed86b8e615ee8dc0a59b041c2dc2d5a;
FlowDocMake0.2.6. PC terminal is recorded in the external receipt, avoiding a
self-referential commit. Both candidate branches remain unmerged; Core candidate
and all six protected development/main/release refs remain unchanged.

One fresh-context review found0 Critical/4 Important/3 Minor. All four Important
findings fixed in one pass, with actual RED then GREEN and final regression proof:
(1) authenticate lookup before bounded16KiB reception,15s total/60s idle maximum;
(2) replace default fetch transport on task operations with bounded native HTTP:
31min response-header,60s idle,3h total; scaled slow upload and deadline proof;
(3) propagate MCP cancellation and enforce15s whole lookup including response body,
verified against an actually trickling canceled stdio lookup; (4) offset job-warning
cursors after the actual durable finding maximum, share the configured detail cap
across normalization/preparation, retain exact totals when details are capped.
Historical sequence10001 plus a fixed warning now paginate without loss. No re-review.

Final: minor (deferred): public lookup error.stage still reports terminal status
rather than the operation that failed; failure outcome/reason remains available.
Final: minor (deferred): durable task/artifact eventSeq fields remain null; response
seq and permanent task history remain distinct but lack the wire-to-event link.
Final: minor (deferred): skill header still says draft-only despite new explicitly
registered-template export tools; tool descriptions and package README identify them.
These are retained review findings, not silently marked fixed or release accepted.

Final: Ruling: registered-template task export plus unchanged bounded draft preview
satisfies this public Doc-Key integration; no unpublished-draft task adapter or
publication was authorized. Cost: larger unpublished draft preview remains unavailable.
Final: Ruling: native long-upload deadlines are verified with controlled time scales,
not a30min production browser/proxy soak. Cost: deployment-specific timeouts and
proxy behavior still need later operational verification.
Final review set-aside rulings: parent owns completed full-suite/PDF verification;
Stage6 owns original full UAT/SRS/SB.1 and sustained RAM/performance; production
browser/proxy interoperability beyond the isolated harness is unverified; installation,
release/promotion and live permissions are outside authorization; unchanged Core and
prior internals reuse their exact pinned evidence plus affected regression tests;
an exhaustive security/race campaign is not claimed. Cost of these boundaries:
this candidate is not production, deployment, full-workload or exhaustive-audit proof.

Final regression:436 Service cases covered,431 passed/0 unresolved failures/5 optional
external cases explicitly unrun. Raw full run had430 PASS/1 fixture failure/5 skipped:
only Pridi6 files had been included while the supplied-folder case requires29 TTFs.
Restored the two original supplied families and reran both full-folder/profile
consumers:26 PASS/1 same optional skip. Production source, compiled code, packages,
policy/config and existing Pridi bytes unchanged. Other fixture consumers read the
identical Pridi file; unaffected full-run results are reused by impact, not rerun
for ceremony. Raw failed report retained; `service-final.json` explicitly reconciles
results rather than altering it. All105 cases across eight task test files PASS
(includes11 image-index cases outside the prior77-case Stage4 selection);17 new
Stage5 cases PASS. Builds/vendor integrity/whitespace checks PASS.

FlowDocMake candidate suite:36 PASS/0 FAIL/4 optional installed-fixture cases unrun;
includes actual native stdio capability/credential gates, model18/19 stream, progress,
proxy7-byte chunking, cancellation, binary save and hash proof. Old auth/reader/guide/
font-height/group-label/authoring workflow checks pass on the isolated configured
runtime, not the user's installed connection. Actual preflight ready:true,25 tools,
Service0.4.8/Core0.4.7 exact vendor bytes and Docker image identity inspected.
PC documentation authority22/22 PASS; final prose scope/diff reviewed before commit.

PDF proof:9 files/11 pages strict pypdf + all-page Poppler, zero warnings/errors.
Eight previous pages pixel-identical to Stage4 and reuse its visual review; three
new pages individually inspected. Native model18 and Service-entrypoint text each
appear once; tool PDF preserves all four labels, three placements, two image
resources/two alpha masks, with one intentionally missing image diagnosed partial.
Whole original UAT/resource acceptance remains Stage6. No source fidelity promotion.

Evidence directory C:/Users/nekot/Documents/Codex/2026-10-19/task-stage5 contains
`receipt.json`, `service-final.json`, raw full/affected-run reports, RED/GREEN logs,
`review-receipt.json`, `coverage.json`, `pdf-verification.json`, PDFs/renders,
preflight/build/authority logs and protected-ref/Git manifests. Five Service and
four plugin optional external tests are listed as unrun, not PASS. Existing plan
only updated; no generated map, Work registry or shared product-truth promotion.

Closeout: all owned test containers and the reused isolated PostgreSQL are stopped.
Test images/networks/private generated config remain; no deletion workaround was
attempted after the previously recorded automatic cleanup rejection. Candidate
branches/worktrees are deliberately retained because unmerged. Existing installed
configuration, user drafts, main, release and tags are unchanged. Stop at Stage5;
next planned work is Stage6 only after separate owner authorization.

### Stage6 execution ledger — 2026-10-19

Owner authorized isolated full UAT/resource/PDF verification and old SRS/SB.1
regression. Role: Evidence Reviewer; single room, execution IDs not applicable.
Core `fb567f4`, Service `8253f65`, FlowDocMake/PC input `21bceb6` remain the
Stage5 candidate. Record branch `codex/task-stage6-evidence-20261019`; no main
integration, release/tag/push, installation or runtime repair authorized.
Evidence: `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage6`.

Ruling: verify the retained source-derived full input, not regenerate business
data — it preserves 60 requirements,64 figures,75 original images and60 Accept
crops. Existing extraction/layout differences must remain visible; source-exact
or production capacity claims require separate proof. Only transport image
references change; source hashes and business-value round trips are checked.

Proof budget: full UAT twice (first measurement collector failed after successful
PDF), SRS98/SB.1 once, then12 bounded resource cases:24/64/128 unique images,
1/8MP single images,32MP alpha source,three128-placement reuse jobs,100/1000
records and throttled output. Service, owned children and test client share a
1GiB cgroup/2CPU allocation; PostgreSQL is separate. Report sampled per-case RAM
and kernel lifetime peak distinctly; cleanup timing/physical bytes/quota release
need post-completion evidence. No threshold or arbitrary-load certification.

Harness corrections: absolute package import, reservation/file column names and
synthetic fixture syntax/module resolution corrected only in evidence scripts.
First UAT PDF/log retained; its discarded resource samples are not PASS evidence.
Tar restoration wrote resources but could not restore Windows root metadata;
font/source hashes and runtime readiness provide the applicable content check.

Final: PASS bounded Stage6 workload, not release/install or maximum capacity.
UAT70pages/106.614s, SRS98pages/259.322s, SB.1two pages/4.340s, measured through
client receipt/lookup; cleanup is additional:8.194s/22.111s/0.287s respectively.
Exact shared documents-container kernel peak395,100,160bytes (376.8MiB), below
enforced1GiB; sampled per-case peaks379,133,952/374,714,368/248,893,440bytes.
Largest sampled task-file footprint10,958,241bytes; sampling250ms does not prove
the exact instantaneous disk peak. Conservative reservation is a separate metric.
Post-run audit:all16 tasks succeeded,physical task files0bytes/0files,held/used
quota0,cleanup done and permanent events/usage retained. No OOM events observed.

UAT all60 requirement IDs occur once in source order;64 figure entries/135source
images match output evidence:258 actual draws=189 input locations+69 headers,
zero image/Format omissions. Independent image signatures match all135 sources;
all60 descriptions and60 remarks match exact logical cell text after whitespace/
NFC. Raw geometric extraction still differs:five repeated Features List headers
and reordered Thai glyphs; REQ0384 whole-page search interleaves columns across
pages59–60. Raw failures retained; new cell proof resolves data-loss suspicion,
not source typography/spelling/layout fidelity. All432 UAT/SRS link labels and
page-number links match their destination pages. Page fields and headers checked.

All170 primary pages strict-parsed/rendered without Poppler diagnostics. UAT70
pages inspected and repeat-run pixel-identical; SRS97pages and SB.1page2 reuse
exact pixel-identical prior reviewed baseline. Changed SRS page10 icons and SB.1
page1 Garuda inspected:only image sampling differs,all100 old-document page texts
identical. All97 synthetic pages rendered/checked for exact ordered labels,
image counts/reuse/alpha and inspected via nine sheets. Twelve resource cases
PASS; synthetic container lifetime peak198,696,960bytes. Three reuse jobs retain
one image resource for128 placements and return file/quota usage to zero each time.

Final fresh read-only review:four Important evidence gaps resolved by physical/
quota audit,precise kernel-vs-sample reporting,logical-cell text reconciliation,
and completed document/matrix checks. Minor claim gaps resolved with both PDF
hashes,image identity support and label-to-destination checks. No runtime fixes
or re-review. Ruling:reuse retained source extraction/Accept crops rather than
independently reconstruct crop coordinates; cost:source extraction correctness
is inherited,not recertified. Ruling:measure selected real workload plus bounded
matrix,not1GB-request/max-pool or sustained production SLA; cost:upper-capacity
and deployment claims remain unavailable. Prior Stage5 runtime/threshold/fault
evidence reused unchanged; parent owns every-page visual acceptance.

Durable evidence:source-audit.json,pdf-verification.json,uat-visual-review.json,
image-review.json,link-review.json,matrix-verification.json,cleanup-audit.json,
receipt.json,review-receipt.json and Git/container manifests under the directory
above. No new Work/map/generated projection; only this existing ledger updated.
All owned test services stopped after verification. Images/networks/private test
config and unmerged candidates retained; no workaround of prior cleanup rejection.
Main/release/tags,installed configuration and original drafts remain unchanged.

### Stage6 follow-up — phase timing/RAM instrumentation, 2026-10-19

Separate explicit owner authorization: measure layout,image preparation,font
embedding,PDF writing,sending and cleanup; rerun unchanged full UAT/SRS/SB.1.
Single-room measurement scope,execution IDs not applicable. Existing Stage6 PASS
is retained. Record branch `codex/task-stage6-profile-20261019` from `0a4459d`.
Ruling: use opt-in exact-hash ESM probes in the isolated test runtime instead of
adding a production API/package feature — this answers the measurement request
without changing candidate bytes or performance behavior. Cost:these probes are
candidate-specific test tooling,not an installed/general telemetry feature.
Evidence directory: `C:/Users/nekot/Documents/Codex/2026-10-19/task-stage6-profile`.
Independent50ms cgroup sampler continues through send/cleanup; span edges also
sample memory. Font subsetting,PDF font mapping and actual six-object-per-font
embedding are distinct; embedding is nested in total PDF writing,not additive.
No optimization,main integration,release/tag/push or installation authorized.
Budget:bounded probe tests,three document runs,all170-page before/after parity,
physical/quota cleanup audit and one fresh read-only review. Seven probe tests
PASS. Initial run exposed overlapping cleanup callbacks continuing after the
database cleanup marker; its traces and failing coverage check are retained.
One test-tooling fix pass adds active-callback waiting,case tags and recorder
cost accounting (RED/GREEN retained); final three-document rerun is under
`task-stage6-profile/retry`. No product repair or performance change was made.

Final instrumented wall times (seconds),UAT70/SRS98/SB.1two pages respectively:
image preparation29.969/65.063/0.313;layout7.185/10.208/0.300;
font subsetting1.187/0.736/0.479;PDF font mapping plus font-object embedding
0.677/0.859/0.383;writer excluding those nested font intervals
19.963/57.908/0.701;send0.260/0.129/0.073;task-file/quota cleanup interval union
15.293/32.584/0.516. Inclusive writer20.640/58.767/1.083 must not be added to
the nested embedding times. Renderer session/font-temp disposal remains in
residual render time;layout includes TOC/page fields,destinations and links.
Full phase measurements,sample coverage and observed RAM are in
`retry/phase-report.json` and `retry/phase-metrics.csv`.

Times include synchronous recording and other observer costs; recorder work is
measured separately,not subtracted or claimed as full observer overhead. Short
font spans are particularly sensitive. RAM is sampled absolute container-group
usage (including test client,observer and cache),not allocation by phase or an
additive measure;PostgreSQL is separate. Target50ms sampling has actual gap
statistics and edge snapshots. Final lifetime kernel peak295.227MiB under the
1GiB/2CPU test limit is a selected-workload observation,not production capacity
or an improvement claim against earlier runs. All four loaded probe PIDs finish
with zero observer faults and zero active spans;every callback end is covered.

Fresh read-only review Important findings addressed by recorder-cost disclosure
and final parent/child fault coverage;the callback-window gap was found by the
parent and fixed in the same single pass. No re-review. Manual span status does
not certify failed-stage classification;only these successful runs are claimed.
Final PDF parity,cleanup and protected-ref checks are parent-owned. The final
verifier initially used an incorrect baseline path after copying into retry;
only that tooling path was corrected,no document rerun or product edit needed.

Final evidence PASS:identical input hashes and all170 pages match the
unchanged Stage6 reviewed baseline in pixels,text,image/alpha draws and link
geometry/targets,with strict parsing and zero Poppler diagnostics. Three final
tasks retain history with zero physical task files/quota and no child/writer
PIDs. Receipt and manifests bind the unchanged product heads,packages,tags and
protected refs. Test services stopped;private test artifacts retained. No new
Work/map/generated projection. Documentation authority checks22PASS and final
diff whitespace check PASS. Main/release/install remain untouched.

### Composition read optimization — plan, 2026-10-19

Authority: the owner separately authorized read-optimization Stages0–4; their
isolated candidate results are recorded below. Stage5 remains deferred.
Service owns file-backed readers;
Core owns validation/composition and template access. Main integration
does not authorize runtime optimization. Keep this in the existing plan, with no
additional AI-required guide or execution registry.

Evidence: `C:/Users/nekot/Documents/Codex/2026-10-19/srs-compose-profile/receipt.json`
and its hash-bound fixture, control, profile, metrics and boundary audit. The
unchanged inline-key SRS fixture has13 assets,372 input image placements and
234,318 normalized bytes. Instrumented composition took48.658s: normalized
validation35.847s (73.67%), expansion11.488s (23.61%); synchronous generator steps
within expansion took0.249s. File reads returned920,403,283 logical bytes across
118,043 calls. These include repeated ranges/page-cache reads, not physical disk
traffic or920MB held simultaneously in RAM. Read waits and operation counters
are nested within stage times and must not be added together.

One uninstrumented control took65.019s versus48.658s instrumented: cache/order/
host variability prevents treating this difference as speedup or observer cost.
Composition-only sampled peaks98.24/94.45MiB do not represent full-Service RAM.
Both composed outputs match all oracle nodes and metadata byte-for-byte. The
strict all-ref audit failed because Core/Service remote-tracking refs moved;
the qualified receipt separately verifies unchanged candidate heads, local
branches, tags, working trees and packages. Actor was not established.

Observed mechanism: repeated field lookup scans properties from the beginning;
separate kind/scalar/property readers create fresh16KiB cursors and reread ranges.
Validation and later binding revisit values. Creating nodes is not the measured
dominant cost.

Sequence: Stages0–4 were separately authorized; Stage5 needs bounded authorization:

| Step | Change and owner | Required checks |
| --- | --- | --- |
| 0 (closed below) | Core + Service freeze semantics, counters and budgets | Hash inputs/template/packages; positive/rejected fixtures; define cache byte/entry limits, eviction, task lifetime and cancellation |
| 1 (isolated candidate complete) | Service shared bounded read windows per sealed immutable input | Fewer reads/bytes; UTF-8, escape, token and EOF across windows; concurrent cursors, abort/close/recovery; RAM under large inputs/concurrent tasks |
| 2 (isolated candidate complete) | Service bounded object-field-to-offset index | Preserve duplicate/unknown/missing-key and scalar rules; eviction/oversized-object fallback; model18/19 and Section/task isolation |
| 3 (isolated candidate complete) | Core + Service bounded per-record/subtree reuse | Source IDs/order, repeated rows, clone isolation; oversized-record fallback; release state after record use; generator/error/cancellation parity |
| 4 (functional proof complete; performance gate failed) | Core compile template access once per pinned template | Fingerprint/model/binding-sensitive invalidation; preserve conditions/empty branches and required validation; no eager loading of all records |
| 5 (deferred) | Reuse verified-normalization receipt under a closed trust contract | Bind input hash, template fingerprint, schema, normalizer/validation versions and limits; tamper/stale/recovery checks; unknown provenance performs full validation |

Stage0 is closed below; start Stage1 only after owner authorization and measure
before authorizing the next step. No17s promise
or fixed improvement claim. Retain admission, validation, size, ownership,
warnings, cancellation and expiry controls. Bound caches per task and across
simultaneous work; eviction or oversized inputs use the correct file-reader
fallback. Do not load the whole request, remove validation or add an unbounded
global cache to obtain faster results.

Future acceptance: unchanged business data, document/source-map semantics,
rejected-input behavior, findings and lifecycle; named/anonymous images,
model18/19, clone and empty/large records. Compare UAT70/SRS98/SB.1two pages in
text, image placements, links/TOC/page numbers and every-page visual output.
Repeat uninstrumented control/candidate runs with identical CPU/RAM/inputs;
report read counts/bytes, validation/composition and full-task time, group RAM,
disk reservations and cleanup. Reuse evidence only where identity/impact allow.
PDF writer/IPC batching remains a separate deferred workstream.

### Main integration and cleanup — 2026-10-19

Owner authorized drafting the optimization direction, integrating completed work
and clearing unused merged branches/worktrees. Single-room documentation and
integration; execution IDs N/A. This supersedes only the earlier instruction to
keep these task candidates unmerged. No release/tag/push/install is performed.

Fast-forward integration, with no conflicts or runtime edits:

| Repository | Retained main branch | Integrated candidate |
| --- | --- | --- |
| Core | `codex/template-binding` | `fb567f45c81f2e8a2c96eaf7631dceedcb828232`, version0.4.7 |
| Service | `codex/template-registry` | `8253f6522355af0add053885eb170ef3b7c128ea`, version0.4.8 |
| Project Control / FlowDocMake | `main` | `d3a5577fdbeef885b479a54c3edca5e396ec6c22`, plugin0.2.6 plus this plan's optimization draft |

All three main trees matched their candidate trees immediately after integration.
Service vendor checksum remains
`e79726b50f8aa2d8436d003aaf0727f87ed86b8e615ee8dc0a59b041c2dc2d5a`,
bound to the Core commit above; FlowDocMake compatibility pins match both versions
and this checksum. Release branches and all tags are preserved byte-for-byte.
The existing versions already identify this completed work; documentation/merge
alone does not create another version.

Fresh checks: Core and Service builds, whitespace review, documentation authority
22/22 and FlowDocMake task stream/capability8/8 (zero skips), including the latter
on integrated PC main. Unchanged fast-forward proof reuse follows workflow policy:
Core Stage4 has833 passing cases and the isolated Linux packed consumer; Service
Stage5 reconciled431 passing cases with5 optional external cases unrun; plugin
Stage5 has36 passing cases with4 optional installed-fixture cases unrun. Stage6
provides all170 primary-page checks plus the bounded matrix; the phase-measurement
follow-up has170-page parity. These are the exact tested runtime trees/packages,
not a new full-suite/PDF rerun or an installed-connection claim. Optional gaps and
prior source/layout/operational limitations remain recorded above.

Cleanup removed all15 local task branches (Core3,Service4,PC8) after ancestry and
clean-state checks, and all three task worktrees. The managed PC worktree was
archived through Codex; the two manual Git worktrees were removed without force.
Before removal,1,225 ignored evidence/build/fixture files (49,691,294bytes) were
copied outside worktrees and checked against their SHA256 hashes. Reproducible
node_modules were excluded. The historical Core sourceArtifact path in Service's
vendor provenance remains historical; its identical source tarball is retained
under `task-main-integration/preserved/core/artifacts/1792376778859/` as well as
the tracked Service vendor package. No evidence path is silently reassigned.

Evidence root: `C:/Users/nekot/Documents/Codex/2026-10-19/task-main-integration`:
`before.json`, `integration.json`, `cleanup.json`, final receipt and preserved
file/hash inventory. Existing experiments/PDFs outside worktrees remain intact.
No data records, maps or generated projections changed. Legacy Editor/vNext
branches and worktrees remain: current snapshot includes held/unresolved Editor
work, older lanes lack current-round cleanup acceptance, and legacy repositories
have local changes. Merge reachability alone cannot establish they are unused;
this integration does not accept or discard those separate historical lanes.

Result: completed task work is on the local main branches, with task lanes cleared.
Optimization implementation, release preparation, GitHub publication and
installation remain future separately authorized work.

### Read-optimization Stage0 — closed contract, 2026-10-19

Owner request: close RAM, buffer lifetime, cancellation, uncached fallback and
measurement rules; no runtime edits. Scope: this existing canonical plan only,
routine risk, inline planning/documentation; execution IDs N/A. Product owner:
Service for the reader/cache and cross-process grants; Core's TaskValue contract
and validation/composition semantics stay unchanged in Stage1. No additional
guide, registry, cache DB table, public API field or product version is introduced.
This closes optimization Stage0 specification, not the original intake Stage0,
and does not authorize runtime Stage1 or certify future performance.

**Source baseline and existing behavior.** Core `fb567f4`0.4.7, Service
`8253f65`0.4.8, plugin0.2.6; vendor SHA remains the integration pin above.
Service `src/tasks/json-reader.ts` currently gives each cursor its own16KiB
window; kind/property/scalar traversals reread ranges. `normalize.ts` checks the
received payload checksum before opening its reader and closes it in finally;
`render-child.ts` checks the normalized checksum, opens another reader and keeps
it until its final cleanup. Core revalidates normalized input before binding;
none of those validation passes or checksum checks may be removed in Stage1.
The existing reader's small/scalar allocations are distinct from reusable raw
windows. Field indexes, decoded-record reuse, template access compilation and
trusted-receipt reuse remain later stages, not implicit parts of the cache.

**RAM contract (initial fixed implementation bounds;1MiB=1,048,576bytes).**

| Resource | Bound and accounting |
| --- | --- |
| Shared window |16KiB raw bytes, aligned to a16KiB file offset; final block may be shorter; no JSON objects/strings retained in cache |
| Optional cache per task |1MiB maximum =64 windows across all its open readers/files and parent/child holders; not1MiB per cursor or per process |
| Optional cache per Service instance |4MiB maximum =256 windows across that Service parent and all owned renderer children; do not infer this from maxTasks or multiply it by process count |
| In-flight cache fills | Count reserved full backing capacity before allocation; retained, filling, pinned and retired-but-still-borrowed windows all consume the same cap; no uncharged replacement copy |
| Direct-read scratch | Reuse one16KiB scratch window per open reader, serialize its uncached operations; at most4 open readers per task/16 per instance, hence64KiB/task and256KiB/instance outside the optional-cache cap |
| Bookkeeping | At most64 cache entries/task,256/instance,4 readers/task,16/instance and one filling/direct IO operation per reader; numeric handle/offset keys, no stored payload values or unbounded wait queue |

Thus cache backing plus reader scratch is at most1,114,112bytes/task and
4,456,448bytes/instance. This bounds cache/window-scratch backing, not all buffers
or V8/native RSS. Existing bounded scalar transfer buffers (reader maximum393,218
bytes per scalar), decoded values, image/font/PDF memory, OS file cache and DB RAM
are separate and must remain visible in full-group measurements. Keep existing
scalar/record/depth/work limits. Do not turn the64MiB received JSON or256MiB
normalized limit into a RAM allowance. Do not keep private cursor windows on top
of the shared cache except the charged direct-read scratch above.

Service parent owns atomic optional-cache grants, divided into16KiB credits,
including credits delegated to children. Grant state is ephemeral, scoped to
one Service instance; no DB/storage quota is consumed. A child cannot grant itself
a fresh independent budget. If a grant is unavailable, use uncached reads rather
than wait for cache capacity or reject a valid task. Reader-count admission is
separate: excess open requests wait in the existing bounded operation flow,
respecting abort/deadline; no unbounded queue or new public error is introduced.
The current call sites open one reader per phase; any future extra-reader caller
must use this admission. One instance's cap is not a cluster-wide guarantee;
multiple instances need separate explicit deployment sizing before expansion.
Existing standalone/default openTaskJson calls without a trusted Service grant
use uncached mode; they cannot mint their own1MiB allowance. Stage1 changes only
the task reader path, not legacy draft preview transport or image reuse rules.

**Identity, sharing and eviction.** Cache only sealed files under the current
task lease after existing checksum/integrity verification. Identity is task and
lease/attempt + immutable file identity/size/digest + reader generation + aligned
offset, never pathname, assetKey or taskId alone. Cursors share bytes only within
that verified file/session; their positions and parser states remain independent.
No sharing between tasks, file revisions or retries. Raw windows may service
different Sections in the same file; assetKey resolution remains Section-local
and never becomes a cross-Section lookup through this cache.
No checksum pass per lookup; ownership of sealed bytes is a prerequisite.
Unexpected descriptor identity/size change is an integrity failure, not permission
to reuse old windows. A detected mutation/short-read/read failure follows the
existing failure path, never returns cached data as a successful substitute.

Allocate lazily on a miss; coalesce same-window fills only if cancellation and
ownership remain correct. Use least-recently-used eviction among unborrowed,
completed windows; a borrower pins its backing storage until its operation ends.
If every window is pinned, read directly. Do not retain arbitrary subarray views
that pin evicted backing storage outside accounting, and do not expose mutable
cache buffers through TaskValue. A short OS read must be completed or rejected
according to actual EOF/expected range; do not mark a partially filled window
complete or zero-fill missing input. UTF-8/escapes/tokens may span windows.

**Lifetime and cancellation.** No startup prefetch or durable cache. Raw payload
and normalized-file sessions are separate. Close the raw session after
normalization; close/release the normalized reader immediately after the last
composition TaskValue read, before image/font/layout/PDF work. If later code
actually needs a value, it must extend the declared session lifetime and prove
the bound; stale handles cannot silently reopen a file. Close is idempotent and
returns that session's grants once after active IO/borrowers settle. Drop all
strong references and report zero held credits; this does not promise immediate
RSS reduction or force a GC. No retention until task expiry just to reuse a cache.

On disconnect, expiry, worker stop or explicit abort: stop scheduling reads and
fills, reject waiting operations with the original abort reason, check abort
before cache hits and after awaited IO, never publish a late fill or advance a
consumer after cancellation, then close in finally. Await an already submitted
file read safely; do not claim Node file IO is instantly interruptible. Retain
the existing owned-child stop/kill escalation (`stopMs=5000` trial policy), and
reclaim delegated credits only after confirmed child-group exit. Parent-side
normalization uses its existing cancellation/deadline lifecycle; the child5s
kill rule is not falsely extended to an in-process read. On crash/recovery,
start with empty sessions; no persistent grants can be mistaken for live cache.
Original files, task history,3h expires_at and temporary/PDF cleanup retain the
existing task contract, independent of cache lifetime.

**Fallback.** `cache disabled`, no grant, eviction, oversized file/working set or
all slots pinned means read uncached through the same parser and limits. A file
larger than1MiB is not rejected or loaded whole. Release optional windows before
switching a session to uncached mode; cancellation is still checked on every
path. Cache allocation failure may disable caching only if direct scratch is
available and the process remains healthy; never swallow OOM, integrity,
malformed JSON, permission/IO, validation or abort errors as a cache miss.
Do not rerun the task or side effects automatically on an arbitrary exception.
The same candidate must support an internal cache-off test mode using this raw
file path; this is not a public API option. No fallback to whole-file JSON.parse.

**Measurement and acceptance for Stage1.** Use the frozen SRS fixture cited above
(`srs-compose-profile/fixture.json`):234,318 normalized bytes,13 assets,372 input
image placements, template/normalized/oracle hashes preserved there. Baseline
Core/Service/package hashes and exact candidate hashes must be recorded. Cache
off/on must use identical inputs, template, packages except the intended reader
change,2CPU/1GiB limits, same host/runtime/config; PostgreSQL remains separate.
Use3 paired off/on runs (alternate order), report every run plus medians/range;
do not combine historical65.019/48.658s as a comparative baseline or claim cold
OS-cache measurements without controlling that cache. Timing runs use bounded
aggregate counters, with observer configuration identical for each pair.

Count actual FileHandle.read calls and returned logical bytes, hits/misses/fills,
evictions/bypasses and peak/current cache/scratch credits across parent/children.
Do not count logical reads as physical disk IO. Measure open/root scan,
normalization, normalized validation, binding/composition, full request-to-client
PDF and post-send cleanup separately; IO waits are nested, not additional time.
Record whole-group sampled RAM and kernel peak, actual disk/quota, sampling gaps,
OOM/stop events and child/descriptor/credit cleanup. Composition-only RAM is not
full-Service RAM. Cache/window-scratch counters must respect the caps even if all
four admitted tasks and parent/children overlap; test exhausted grants explicitly.

Stage1 improvement gate on the fitting SRS composition fixture: median actual
read calls and returned logical bytes each at most25% of cache-off (at least75%
reduction), and median uninstrumented composition time lower than cache-off.
For the same3 paired full SRS task runs, cache-on median request-to-client time
must not regress more than5%. These are acceptance targets to test, not measured
results or a17s promise. If noise obscures timing or a target fails, report
inconclusive/failed improvement and revise the plan; do not silently lower the
gate or keep rerunning for a favorable sample. Budget:3 pairs per composition
and full-SRS comparison, one bounded correctness/concurrency/fault matrix and
one UAT/SB.1 regression each; extra runs need an identified failed/stale condition.

Mandatory correctness matrix: cache off/on document nodes/sourceMap and metadata
equal the same oracle; original success/rejection codes, findings order/counts
and limits unchanged. Include16KiB boundary UTF-8/escapes/keys/numbers, partial
reads/EOF, duplicate and unknown keys, array/scalar/depth limits, empty/large
records, model18/19, clone and Section isolation, eviction/thrashing, grant
exhaustion, concurrent cursors/tasks, abort during hit/miss/IO, double-close,
descriptor failure and child crash. Fully test no grants/leaks after every exit.
Do not treat invalid input acceptance as a performance improvement.

Compare SRS98/UAT70/SB.1two-page PDFs against unchanged controls: data/text, image
placements, warnings, TOC/links/page fields and every page visually. Use strict
parse/render checks; any inherited image-resampling difference must be declared
and bounded, not hidden by a blanket pixel-parity claim. Keep existing memory
pause/stop limits (trial768/896MiB for the owned render group), timeouts, disk
reservations and the1GiB test envelope. This does not claim all-instance RSS is
already guarded by those child-group thresholds. Performance cannot waive data,
security, lifecycle, PDF or memory acceptance.

**Implementation boundary and next handoff.** Stage1 is Service-owned:
`src/tasks/json-reader.ts` plus a focused cache/grant helper if needed;
`normalize.ts`, `render.ts`, `render-child.ts` for grant/lifetime wiring and their
affected tests. Test reader/scratch bounds and cache-off first, then shared
windows, then parent/child ownership, then measurement/PDF acceptance. Preserve
Core TaskValue API and validation; do not add field indexes, decoded-record
caches, PDF writer batching, migrations, public capability or API changes here.
Service-local typed options carry the internal cache mode/grant, retaining the
existing default-call compatibility; exact helper signatures belong to Stage1
implementation planning. Policy values above are fixed internal Stage1 bounds,
not additions to the existing persisted task-v1-trial-1 policy or frozen records.
If safe cross-process grant ownership cannot be implemented within this boundary,
stop for a contract amendment before runtime work expands.

Stage0 closure scope: specified contract and source traceability, arithmetic,
documentation-authority checks and final diff review only. Cache behavior,
cancellation/fault/resource/performance and PDF acceptance above remain future
Stage1 obligations, not tests passed by this documentation change.
Closure checks:22/22 documentation-authority cases PASS; cache/scratch arithmetic
and frozen fixture counts PASS; diff whitespace PASS. Only this plan changed;
Core/Service heads and clean states match the baseline above. No runtime test,
benchmark, PDF regeneration, dependency/product-version change, map promotion,
release/tag/push or installation was performed for optimization Stage0.

### Read-optimization Stage1 execution ledger — 2026-10-19

Owner authorized Service shared read windows, bounded RAM/cancellation/fallback,
paired cache-off/on measurement and all-page PDF checks. No integration/release/
installation. Single-room Product Implementation Agent then Evidence Reviewer;
IDs N/A. Service lane `codex/read-cache-stage1-20261019` from8253f65 at
`C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/read-cache-stage1`;
PC managed lane `C:/Users/nekot/.codex/worktrees/read-cache-stage1/flowdoc-project-control`
fromf47366d. Existing main branches, Core/package and plugin remain protected.
Scope: Stage0's reader/helper/normalize/render/child wiring and affected tests;
no indexes, decoded-record cache, Core changes, policy/DB/API expansion.
Evidence: `C:/Users/nekot/Documents/Codex/2026-10-19/read-cache-stage1`.
Proof/document budget follows Stage0; one whole-branch fresh review and one fix
pass if needed. Current host model retained for inline execution; no separate
registered execution or synthetic room/Work records.

Baseline build and two existing reader cases PASS. Six new feature cases first
failed because createReadBudget did not exist; RED retained. Initial test command
ran before dependency installation completed and had a missing build-tool binding;
that result is tooling failure, not the feature RED. After installation, the real
six-case RED was obtained before implementing the helper. Initial build exposed
an exactOptionalPropertyTypes typing error; fixed. The large-file case initially
timed out because uncached per-byte reads unnecessarily entered the IO queue;
added a safe direct-scratch hit path (invalidated before an asynchronous fill).
No test timeout or fixture size was relaxed. Current reader matrix12 cases PASS.

Ruling: reserve optional credits atomically in the parent and delegate a fixed
ceiling to the child, rather than synchronize every byte read over IPC — fewer
control operations while the reserved ceiling covers filling/pinned buffers.
Release normal child grants only after its reader-close acknowledgement, and
crash-path grants only after confirmed process-group stop. Cost: reserved cache
capacity can exceed actual allocated windows and reduce another task's cache;
that task uses the specified uncached fallback.
Ruling: cache-off retains only the one declared16KiB reader scratch and the same
parser. It is the same candidate's uncached control, not a claim to reproduce
every historical private-cursor allocation/timing. Existing standalone calls
remain uncached. Benchmarks compare this exact off/on pair, not historical runs.

Initial checkpoint: Stage1 in progress, with no acceptance or map promotion.

Final Stage1 result: PASS within the frozen Stage0 scope, retained on isolated
branches; no main integration, release or installation. Service implementation
adds read-cache budget/window helpers and changes only the task reader,
normalization, renderer parent/child and affected tests. Core package/API,
template bindings, image preparation, PDF writer, task schema/policy, public
transport and installed plugin are unchanged. Stage1 is not permission for
Stage2 indexes or any later optimization.

The parent atomically reserves credits before allocation and delegates a fixed
ceiling through the existing private renderer init message. Reader-close returns
normal child credits; confirmed group exit returns crash-path credits. Reader
windows are lazy LRU buffers, with cursor offsets only and one serialized scratch
window. Normalized readers close before image/font/layout/PDF work. Abort
checks cover cache hits, pending and queued IO; close is idempotent, waits for
active IO and clears strong references/credits. Default/no-grant calls are
uncached. Raw/scalar limits and both validation passes remain intact.

Final build PASS. Linux task suite115/115 PASS, zero skipped; source-equivalent
reader suite then14/14 PASS, including two additional queued-miss/cross-file/
revision cases (12 overlap the115,117 unique affected cases total). Existing
real timeout/memory-stop/recovery cases now also assert zero global reader/cache/
scratch permits after processor shutdown. This is scoped task evidence, not a
new full-Service suite claim. One fresh whole-source review:0 Critical,0 Important,
0 Minor; reviewer-owned12-case run PASS. Its non-blocking queued-miss coverage
observation was addressed with a real second queued miss, not a renamed test.
No runtime repairs followed the review; no re-review. Parent owns remaining proof.

Actual resource matrix: four simultaneous readers allocate1MiB of cache each,
fifth gets no optional cache and succeeds through scratch; all process oversized
working sets correctly. Peak optional grants4MiB, five scratch windows80KiB;
all readers close with0 cache/scratch/readers/waiters. Separate admission case
reaches16 scratch permits (256KiB) and cancellation frees blocked requests.
These byte/credit bounds are not RSS bounds. All full runs used2CPU/1GiB;
maximum container kernel lifetime peak296.27MiB, DB separate, no OOM events.

Three paired fitting-SRS composition runs, without load hooks:

| Metric | Cache off median | Cache on median | Change |
| --- | --- | --- | --- |
| Composition |4.595s |2.479s |46.1% lower |
| FileHandle.read calls |1,168 |15 |98.7% fewer |
| Logical bytes returned |18,449,992 |234,318 |98.7% fewer |
| Full SRS request-to-client PDF |54.630s |49.992s |8.5% lower |

Composition off runs4.595/4.157/5.270s; on2.479/2.455/2.783s. Full SRS off
52.874/54.630/56.705s; on49.992/48.385/53.620s, alternating paired order.
All six composed documents match the frozen complete node/sourceMap/metadata
oracle. The targets of75% fewer calls/bytes, lower composition median and no
more than5% full-task median regression all pass. Off already shares the one
declared16KiB scratch: do not attribute the entire historical48–65s to2.48s
difference solely to optional1MiB caching. Full runs include identical coarse
phase observer work per pair; IO waits and nested phases are not additive.

UAT70 and SB.1two-page single unpaired runs took130.782s and5.190s through client
receipt; they prove correctness here, not a speedup. UAT image preparation54.058s
and PDF writing23.434s remain outside this optimization. Do not compare its one
observation to earlier runs as a causal regression/improvement result.

All8 PDFs/660 output pages (six SRS98 + UAT70 + SB.1two) pass strict parsing,
all-page Poppler with zero diagnostics, exact page text and pixel parity against
the reviewed Stage6 baseline, image bytes/alpha/draw order and link geometry/
destinations. All output pages were rendered; exact parity reuses previous visual
acceptance for every page. Parent also inspected SRS10,UAT59,SB.1one directly.
Original source/layout limitations remain inherited; source-exact reconstruction
is not newly claimed. Named SRS uses the retained13-asset inline-key mock; both
modes use that same data, not the earlier372-anonymous-image transport.

Measurement tooling corrections, retained rather than hidden: the copied report
expected four loaded PIDs for a prior three-document run; each current one-document
run has two. One on1 periodic sample was lost when a font subprocess exited
between enumeration/read (`ESRCH`). The original failed analysis/raw sample stay
retained; corrected analysis exposes that missing sample and valid-sample gap,
while the independent kernel lifetime peak remains available. Later samplers
tolerate that expected vanished PID. Both modes within each pair use the same
sampler version. No completed composition/PDF run was repeated to select a better
result. A local observer-string escaping error was caught before document work.

Final DB/physical audit: all8 tasks succeeded, no child PIDs, no owned task files,
held/used storage and queue permits0; permanent events/usage remain. Client PDFs
remain separately in evidence. Physical disk peak was not sampled in this round;
final file/quota cleanup was checked. All owned test services are stopped and the
reused test DB container restored to its prior stopped state. Cloned test DB and
evidence retained. No user data or installed state changed.

Durable evidence: `scope.json`, build/RED/GREEN logs, `runtime-identity.json`,
`linux-tasks-final.json`, `linux-extra.json`, `resource-matrix.json`, composition
reports, `measurements.json`, all raw traces/sampling gaps, `pdf-verification.json`,
`cleanup-audit.json`, `review-receipt.json`, container manifest and final receipt
under the evidence directory above. Documentation checks/final commits are bound
by the final receipt. No Work/map/generated projection promotion. Baseline package
number0.4.8 stays unchanged during this isolated source experiment; its terminal
commit distinguishes the candidate. Delivery version/pins must be settled before
any later promotion/install; no baseline-numbered artifact is published here.

## Read-optimization Stage2 — field-position index contract and execution ledger

Authority Boundary: Project Control owns this bounded plan and acceptance ledger;
Service owns implementation. This extends the isolated Stage1 candidate only.
Owner/role: Service / Product Implementation Agent, inline implementation;
execution IDs not applicable. Base: Service `005c6c0`, PC `70141fd`.
Scope: reader-local numeric property offsets, parent-owned index credits and
private render-child delegation; no Core/public API, model, delivery pin, main,
release, tag, install, database schema or document-data changes.

- Ruling: add at most 256 KiB/task and 1 MiB/Service of index backing, separate
  from Stage1's raw-window credits. Reuse the same atomic parent grant and
  reader-close/confirmed-child-exit release. Descriptor count is bounded to 64
  per fully credited reader; no decoded values/keys or negative-field cache.
  Cost if wrong: bounded extra memory without useful speedup; measured below.
- Each slot is one 4 KiB numeric offset table (256 entries of four uint32
  offsets). At most 64 slots; metadata remains bounded. Build lazily at object
  enumeration, preserve original key order and duplicate keys. Objects exceeding
  256 fields and unavailable slots fall back to the unchanged scanner. LRU may
  reuse only unpinned slots; held iterators pin their own slot. Close invalidates
  iterators and drops all tables, including after cancellation or parse failure.
- A complete table may be reused across newly created TaskValue cursors for the
  same object in this reader only. No cross-task/file/attempt sharing. Abort,
  identity checks, scalar/depth/key limits, validation and checksums stay active.
- Ruling: benchmark `FLOWDOC_TASK_FIELD_INDEX=off/on` with Stage1 raw-window
  cache ON in both arms. Three alternating pairs, same frozen inputs, Core,
  2 CPU/1 GiB and separate DB. The Stage1 75% raw-read gate is inapplicable
  because those reads are already reduced to 15; compare property scan bytes,
  composition median and full SRS duration instead. Acceptance: exact semantic
  output and PDF parity, lower property scan bytes and composition median,
  full SRS median at most 5% slower, bounded backing/metadata and zero credits
  after cleanup. If performance fails, retain evidence and report failure.
- Proof budget: targeted RED/GREEN index tests; affected existing task/model18/19
  tests on Linux with isolated DB; actual bounded allocation/fallback exercise;
  one fresh whole-source review; three paired composition/full-SRS measurements;
  UAT/SB1 regression and all-page strict/text/images/links/render parity. Do not
  expand to Stage3 subtree reuse or rerun finished measurements for a better score.
- Document gate: update this existing canonical plan only. No new Work registry,
  map promotion, product guide or global documentation sync.

Execution start: Stage2 began without an acceptance result; final results follow. Stage1 branches retained;
fresh branches `codex/field-index-stage2-20261019` (Service) and
`codex/field-index-stage2-record-20261019` (PC) reuse their isolated worktrees.


### Stage2 final results — PASS, retained isolated candidate

Service commit: `619d522e77a6a53cc1594de355b238012002b234`, branch
`codex/field-index-stage2-20261019`; PC record branch
`codex/field-index-stage2-record-20261019`. Both extend the retained Stage1
branches. Candidate implementation, compiled hashes and tests were frozen before
the paired measurements; the terminal receipt checks that exact identity again.

Implementation adds reader-local numeric field-position tables, bounded parent
credits, child delegation and close diagnostics. It retains duplicate keys in
source order, uses pinned slots during iteration, evicts only unpinned LRU slots,
and uses the original scanner when full, oversized or disabled. Keys and values
are not retained decoded. Existing intake JSON64MiB / normalized256MiB bounds
fit uint32 offsets; no payload/resource policy was enlarged. No Core/public API,
database schema, font, template, mock, checksum bypass or normalization-receipt
shortcut was added.

Verification and coverage:

- Initial four feature tests failed against Stage1 as expected (no index or
  index credits). A later held-iterator test exposed resumption after the last
  yield returning done after reader close; a post-yield check fixed it RED to
  GREEN. The exploratory Linux run122/123 is retained, not counted as passing.
- Final Linux affected suite: **124/124 index ON and124/124 index OFF**, zero
  skipped. Includes real DB/HTTP/render-child, model18/19, task recovery,
  authentication, normalization, image/task adapters and cleanup. Targeted index
  cases cover duplicate/order/missing fields, Unicode and256-field boundary,
  oversized fallback, pinned-slot exhaustion, eviction, file/attempt isolation,
  close, abort and cancellation while a build waits for actual file IO.
- Additional normalizer conformance:12 model18/19 cases,24 off/on executions,
  exact normalized output/errors equal. Required missing fields stay
  MISSING_REQUIRED, duplicate keys stay INVALID_DATA, wrong scalars stay
  TYPE_MISMATCH; model18 unknown-variable tolerance and model19 strict rejection
  remain different as designed. The first supplemental fixture used a binding
  invalid for model18; changed only that evidence fixture to static text, then
  reran this probe. No candidate or timing was changed/rerun for that correction.
- Actual five-reader allocation: four tasks allocate256KiB each, exactly1MiB
  aggregate index backing; fifth task falls back. Eviction occurs, existing4MiB
  raw-window ceiling holds, all credits/backing return to zero after close.
- One fresh whole-source review:0 Critical /0 Important /0 Minor. No source
  repair was needed after review. Final: Ruling: performance, Linux compatibility
  and PDF parity declined by the source reviewer are parent-owned prerequisites,
  discharged by the evidence here. Existing schema/protocol and recovery paths
  remain unchanged; this is not a production deployment or every historically
  persisted-task configuration test. Cost if misread: unsupported deployment
  assurance; no such assurance or acceptance waiver is made.
- All **8 PDFs /660 pages** strictly parsed, all pages rendered with zero
  Poppler diagnostics. Every page's text and rendered pixels match the reviewed
  Stage6 reference; image bytes/alpha/order and link targets/geometry also match.
  SRS6x98 pages, UAT70 pages, SB.1 two pages. Manual views of SRS10, UAT59 and
  SB.1 page1 confirm the rendered comparison. Existing UAT70 vs original72-page
  and other inherited layout/source differences remain; this is regression
  parity, not a new source-exactness claim.
- Eight tasks succeeded; physical task files, reserved/used quota and child PIDs
  are zero after cleanup, with task events/usage retained. The test DB was
  restored to its initially stopped state. No user DB/data was edited.

Three alternating same-candidate pairs, raw-window cache ON in both arms,
2CPU/1GiB hard envelope, separate DB:

| Metric | Index OFF | Index ON |
| --- | ---: | ---: |
| Composition seconds, runs1/2/3 |2.374361 /2.712083 /2.434647 |1.532787 /1.552926 /1.562982 |
| Composition median |2.434647s |1.552926s (36.22% lower) |
| Property scan bytes, median |10,972,492 |5,048,379 (53.99% lower) |
| Actual reader calls / returned bytes |15 /234,318 |15 /234,318 |
| SRS request-to-PDF seconds, runs1/2/3 |54.424184 /64.966153 /44.634693 |41.229506 /53.123089 /54.268046 |
| SRS total median |54.424184s |53.123089s (2.39% lower) |

All declared gates pass. Total times vary materially: composition benefit and
scan-count reduction are clear, but no large or causal end-to-end speedup is
claimed. Reader scan bytes count repeated parser work, not disk IO; Stage1 has
already reduced actual reads, which remain unchanged. UAT116.951588s and
SB.1 3.956562s are single correctness runs, not paired speedup evidence.
Largest whole-cgroup kernel peak across full runs:292.449219MiB. Index backing
is separate from bounded JS metadata; total process RAM is not claimed to equal
the backing budget. Phase timings include identical observer hooks and are
nested, not additive; composition pairs use no hooks. Physical disk peak was
not sampled; final physical/quota cleanup was audited.

Retained evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-19/field-index-stage2`.
Read `receipt.json`, `measurements.json`, `runtime-identity.json`,
`resource-matrix.json`, `model-parity.json`, `linux-tasks-final-on.json`,
`linux-tasks-final-off.json`, `review-receipt.json`,
`pdf-verification.json`, `cleanup-audit.json`, and per-run PDFs/traces.
Documentation authority checks:22/22. Terminal receipt verifies clean candidate
checkouts, unchanged primary heads/release/tags, allowed eight-file Service
manifest, exact compiled/source identities and stopped owned test services.

Intentionally not changed: primary branches, release/tag/push/install, Core
archive, FlowDocMake, production task storage/TTL/history, record/subtree reuse,
template-access compilation, normalization trust shortcuts. Source experiment
keeps baseline package0.4.8; no artifact is published under that number. Delivery
version and package pins remain a later promotion prerequisite. Retain both
unmerged candidate worktrees and Stage1 branch pointers. Stage2 ends here.

## Read-optimization Stage3 — bounded record byte reuse, 2026-10-20

Authority Boundary: Project Control owns this scope/acceptance ledger; Core owns
TaskValue lifetime requests and composition, Service owns sealed-file byte views.
Explicit owner authorization: implement Stage3, measure and inspect every PDF
page; no main integration, release/tag/push or installation. Inline implementation;
execution IDs N/A. Risk routine; affected owners Core and Service. Bases: Core
fb567f4, Service619d522, PCd6ac4a6. Use isolated candidate branches, retaining
Stage1/2 pointers. Core requires a new owner worktree because the native worktree
tool targets the current PC repository; manual owner worktree is the fallback.

- Ruling: retain raw bytes, not a decoded record graph. Optional TaskValue
  retainRecord() returns {value,release}; absent capability preserves old traversal.
  Core scopes each data/record use in try/finally, including suspended generator
  records, errors and cancellation. Views retain absolute source offsets and fall
  back after lease release; no source-ID/business-key deduplication.
- Ruling: maximum64KiB/retained subtree,256KiB/task and1MiB/Service backing, at
  most8 simultaneous leases/task (32 fully credited instance leases). Parent
  grants/delegates these credits with the existing reader lifecycle. Count before
  allocation; close/abort clears views; release is idempotent. Nested subtrees may
  borrow an active containing view without another allocation. Oversized input,
  no credits or lease-count exhaustion uses the original reader, preserving the
  existing256KiB record validation limit. Cost if wrong: bounded additional
  backing/metadata without useful speedup; no increased input limits.
- Service reuses its existing scanner against a bounded byte view, preserving
  duplicate keys/order/limits and IO/abort errors. No JSON.parse of containers,
  no whole-array decoding, validation or checksum bypass, image changes, shared
  cache across files/tasks/attempts, template compilation or trusted receipts.
- Private packed Core candidate stays baseline0.4.7 but has an unmistakable
  stage3 filename and new checksum/source commit; only the isolated Service
  dependency/lock/vendor manifest consumes it. No release artifact is published
  under the baseline number. Future promotion must settle versions/pins.
- Checks: RED/GREEN owner tests, Core task/schema/binding consumers, packed Linux
  Service suite on/off, raw budget allocation/fallback/drain, model18/19,
  duplicate/missing/order/IDs/repeated rows/clones/empty/oversized records and
  error/cancellation release. One fresh whole-source review. Same-candidate
  three alternating pairs with raw cache/index ON in both, only record reuse
  toggled; frozen inputs and package,2CPU/1GiB, DB separate. Gates: exact whole
  composition output, lower composition median, full-SRS median no more than5%
  slower, backing/lease caps and zero credits after cleanup. Report all raw runs;
  no rerunning completed measurements for a better score. If speed fails, report
  the failed gate rather than widening scope.
- PDF budget: six paired98-page SRS outputs, one70-page UAT and one2-page SB.1;
  all660 pages strict/text/images/alpha/order/links/render comparison to reviewed
  reference, manual representatives. Physical files/quota/history cleanup audit.
  No need to repeat unaffected native PDF-engine tests unless changed paths or
  failures justify it. Existing UAT/source layout differences remain inherited.
- Markdown gate: extend this existing canonical plan only; owner implementation
  and durable tests/JSON receipts supply proof. No new Work/guide/map promotion.

Execution start: contract closed for the explicit bounded implementation; no
Stage3 acceptance result at kickoff; final results follow. Model choice uses this inline host; one fresh
reviewer follows executing-plans. Stage3 ends at isolated verified commits.


### Stage3 read-reuse final results — PASS, isolated only

Source commits: Core `87f50e47c4c418b1452d041c01ae06588748a641`, Service `36b4baec9db1fbd339f39c5ef68629718132dae8`.
Both use `codex/record-reuse-stage3-20261020`; PC record branch is
`codex/record-reuse-stage3-record-20261020`. Source/compiled/package identity
was frozen before all paired measurements and verified again by the final
receipt. Stage1/2 branch pointers and unmerged worktrees are retained.

Behavior: optional `TaskValue.retainRecord()` scopes bounded raw-byte views.
Core uses try/finally around data and suspended collection records; Service
returns valid file-offset handles after release. No decoded whole records or
arrays, validation removal, cross-task cache, source/business-key deduplication,
image change or template compilation. Full validation still finishes before
composition: reuse is within an active subtree/record, not retention of every
record across both whole validation passes.

Evidence coverage:

- Core two new lease tests failed against baseline, then passed with the
  implementation. Final **190/190** affected data/binding/composition/package
  cases passed, zero skipped; Core build passed. Includes repeated identical
  rows, two cloned Sections, exact document IDs/sourceMap/order, older readers
  without the capability and cancellation/error while a binding iterator holds
  its record. Service **25/25** reader cases passed, including four new record
  cases, plus the real Linux consumer below.
- Packed Linux integration initially passed127/128. The remaining FlowDocMake
  stdio case correctly rejected the new archive checksum with
  TASK_CAPABILITY_UNSUPPORTED. Ruling: use an **external test-only** FlowDocMake
  mirror with only compatibility checksum/snapshot updated. Preserve the strict
  guard; installed and tracked plugin remain unchanged. Cost: this does not
  establish installed-plugin compatibility; actual promotion must assign delivery
  versions and repin the real plugin before use.
- All14 API cases reran and passed with that mirror. The114 unaffected cases
  from the unchanged candidate/package were reused; `linux-on-accepted.json`
  explicitly links both original reports and the reuse reason. This establishes
  **128 unique ON cases**. The complete **128/128 OFF** suite then passed, zero
  skipped. No failed check was relabelled PASS; the original127/128 report stays.
  Source-commit stamping changed provenance metadata only, not archive bytes,
  version/SHA capability checks or execution behavior, before timing freeze.
- Actual backing matrix: four tasks retain4x64KiB each, exactly256KiB/task and
  **1MiB/Service**; fifth task falls back. Reader tests also exercise8-lease count
  exhaustion, byte exhaustion, records above64KiB, nested borrowing, duplicate
  keys/order/Unicode, independent files/tasks, double release and abort/close.
  Pending-prefetch cancellation keeps parent credits until IO drains; IO errors
  remain errors. All backing and credits return to zero.
- Twelve model18/19 normalizer cases /24 record-off/on executions preserve exact
  output and errors: required missing, duplicate, unknown and wrong-type fields,
  missing Sections, model18 tolerance vs model19 strictness. Existing image,
  ownership, task/recovery and limit checks remain in the Linux suite.
- Private packed Core filename:
  `flowdoc-core-0.4.7-read-reuse-stage3.tgz`, SHA256
  `9a5068c80a7b332155aa454f4d72240012c25b44a08d0a446b3a995d7a39bf2e`.
  Actual unpacked archive matches compiled Core. Every pre-existing non-task
  package file, including native binaries, fonts and resource manifests, is
  byte-identical to baseline; only task bridge JS/types and the new helper differ.
  The Service manifest names the exact final Core commit, not its base.
- One fresh whole-source review:0 actionable findings. Final Ruling: its excluded
  runtime/performance/PDF proof, final provenance and independent resource archive
  comparison are parent-owned prerequisites, all discharged here. Cost if omitted
  would be unsupported acceptance; no production/deployment assurance is inferred.
- All **8 PDFs /660 pages** strictly parsed and individually rendered with zero
  Poppler diagnostics. Text, encoded image bytes/alpha/order, link geometry and
  destinations, and rendered pixels match the reviewed reference on every page.
  Six SRS98-page outputs, UAT70 and SB.1 two pages. Manual views: SRS10, UAT59,
  SB.1 page1. Identical reference-PDF facts are reused only while their SHA stays
  identical; no candidate page check/render is skipped. Existing UAT70 vs original
  72-page and other inherited source/layout differences remain unchanged.
- All8 tasks succeeded, cleanup done, zero physical task files/reserved or used
  quota/child PIDs. Events and usage/history remain. Test DB restored stopped.
  Docker Desktop was initially off and was started for isolated tests; no user
  runtime container or DB was started/edited. Final receipt records restoration.

Measurements: same candidate, raw-window cache and field index ON in both arms,
only record reuse toggled; three alternating pairs,2CPU/1GiB, DB separate:

| Metric | Record OFF | Record ON |
| --- | ---: | ---: |
| Composition seconds, runs1/2/3 |1.983203 /1.784224 /1.593427 |1.642291 /1.363113 /1.992656 |
| Composition median |1.784224s |1.642291s (7.95% lower) |
| SRS request-to-PDF seconds, runs1/2/3 |76.667297 /81.232030 /83.190463 |80.111923 /84.680720 /79.471725 |
| SRS total median |81.232030s |80.111923s (1.38% lower) |
| Actual reader calls / returned bytes |15 /234,318 |15 /234,318 |
| Property scan bytes |5,048,379 |5,048,379 |

All declared gates pass; benefit is modest and timings overlap materially, so
these medians do not prove a large or universal causal speedup. Compare within
this round, not directly against yesterday's absolute times. Source read/scan
counts remain unchanged; ON serves2,765,372 byte/text requests from record views,
copies677,487 raw bytes across1,238 successful leases and peaks at54,690 retained
bytes in composition. These are internal byte requests, not millions of disk IOs.
All leases are zero after use/reader close. Maximum full-group kernel peak:
**292.03125MiB**. Backing budgets exclude bounded JS metadata; total RAM is measured
separately. UAT129.277487s / SB.1 7.197867s are single correctness runs, not speedup
claims. Full phase timings include equal observer hooks and are nested, not
additive; composition pairs have no hooks. Physical disk peak was not sampled;
final physical cleanup and quota were audited. No completed measurement reran.

Evidence root: `C:/Users/nekot/Documents/Codex/2026-10-20/record-reuse-stage3`.
Read `receipt.json`, `measurements.json`, `runtime-identity.json`,
`core-tests.json`, `linux-on-accepted.json`, `linux-tasks-final-on.json`,
`linux-tasks-api-pin.json`, `linux-tasks-final-off.json`,
`resource-matrix.json`, `model-parity.json`, `package-proof.json`,
`test-plugin-pin.json`, `review-receipt.json`, `pdf-verification.json`,
`cleanup-audit.json`, and per-run PDFs/traces. Documentation authority22/22.

Intentionally retained: baseline package numbers Core0.4.7 / Service0.4.8 in this
private source experiment, distinguished by checksum, filename and source commit.
No artifact is published under those baseline numbers. Delivery version changes,
actual FlowDocMake repinning, integration/release/install, template-access
compilation and trusted-normalization receipt reuse are later work. No main,
release/tag/push/install, schema/TTL/data-policy change or map promotion occurred.
Stage3 ends at the clean isolated commits; Stages4–5 are not started.


### Read-optimization Stage4 — operation-local template access, 2026-10-20

Owner authorized Stage4 implementation and verification, keeping all work isolated.
Core owns schema field entries, binding references, repeat lookup maps and the
shared Area index; Service only consumes the actual packed candidate. Project
Control owns this existing plan. Inline implementation, routine risk; execution
IDs N/A. No main/release/tag/push/install, schema/API persistence change or Stage5
validation-trust shortcut. Stage3 bases: Core87f50e4, Service36b4bae, PC8646f20.

Ruling: one access owner per normalize/compose call, rather than a process cache —
validated definitions are deeply frozen; new fingerprints/models/bindings/clones
get fresh owners without stale cross-call reuse. Cost: compilation repeats for
separate calls; accepted to bound lifetime and avoid invalidation ambiguity.
Schema/repeat/binding plans are lazy, with at most2,048 retained plans and1MiB
accounted metadata per operation. This accounting is not an exact V8 heap bound;
measure process/cgroup RAM too. Existing template/Area-index memory remains.
Budget exhaustion or explicit templateAccess:false builds the same transient
access plan; both full validation walks, limits, conditions/empty branches and
record release remain. No task values, decoded records or IO handles are cached.
All paths release plans on completion/error/abort; compile does not enumerate
business records. One final fresh source review; no per-task reviewer loop.

Acceptance: focused RED/GREEN, Core affected suites/build, actual packed Linux
Service consumers, fingerprint/changed binding/model18/19/clone/empty parity;
three alternating off/on pairs on the same package with previous optimizations
on in both modes (2CPU/1GiB), full SRS median no >5% regression, lower composition
median; UAT/SRS/SB.1 all660 pages against reviewed oracle, task/quota/file cleanup.
Measurements are one fixed batch, never repeated for a better score. Full-job
off/on is test-only source-hash-bound compose option injection; Service's intake
normalization uses the default in both modes. No installed plugin change.

Evidence: C:/Users/nekot/Documents/Codex/2026-10-20/template-access-stage4.
Status: functionality verified below; performance acceptance failed, candidate retained for review.


Stage4 verification result: RISK — performance gate not met; no promotion.

Core source commit: 96befec347b1977ae5e57a173edb30f0f2ebaf6d. Service consumes the actual
flowdoc-core-0.4.7-template-access-stage4.tgz, SHA256
ef855ab550d9951ab2f9e9901881df2b98bcd4750a9a11c7216e7f7816c45395. Its manifest pins that exact source commit;
package version remains private baseline0.4.7 (Service0.4.8), not a published
release. Unpacked archive JS/types match compiled Core; native/font/license
resources remain byte-identical to reviewed baseline. Service source is unchanged.
An external test-only FlowDocMake mirror pins this checksum with its strict guard
retained. Tracked and installed plugin are unchanged; future promotion requires
version assignment and real compatibility repin.

RED: new access-plan test failed because taskAccess did not exist. GREEN: all
200 affected Core cases pass, including template-access/uncached parity, stale
fingerprint, changed clone, empty Area, model18/19, required fields, source IDs,
repeated rows, abort/error release and metadata fallback. Core/Service builds pass.
Linux actual-package consumer:128/128, zero skipped. Model parity12 cases/24
normalization executions preserve output/errors for missing/duplicate/unknown/
wrong-type fields and missing Sections. Fresh whole-source reviewer found no
Critical/Important/Minor issues. Review set aside runtime/archive/performance/PDF/
cleanup evidence for parent verification; those prerequisites are discharged here.
Release/install/Stage5 remain out of scope, not waived checks. No deferred minors.

Fixed paired batch (no score-driven repeat),2CPU/1GiB, DB separate; previous
reader/index/record optimizations ON in both modes. Composition seconds OFF
1.308855, 1.266374, 1.321945, ON
1.506122, 1.252033, 1.313040. Medians
1.308855 → 1.313040s
(-0.32% reduction). Full SRS98 medians
73.247851 → 70.711741s
(3.46% reduction). Performance gate
FAIL: lower composition median plus no >5% full-SRS regression.
Small differences and run variance do not establish a universal causal speedup.
Read counters are logical requests, not physical IO; template metadata reuse
does not promise fewer file reads. Full-job modes use the same phase hooks;
composition has no timing hooks. Full phase times overlap and are not additive.

Maximum full-job kernel cgroup peak: 301.438MiB.
Accounting ceiling1MiB/2,048 plans bounds retained template metadata accounting,
not exact V8 heap; per-operation caches hold no task data. Existing reader/index/
record grants remain bounded and return to zero before later PDF work.
UAT/SB.1 are unpaired correctness runs, not speed comparisons.

All8 PDFs/660 pages passed strict parse, zero Poppler diagnostics and all-page
exact text/pixel/image-byte/alpha/order/link-geometry/target parity to the reviewed
Stage6 baseline. SRS98, UAT70 and SB.1two preserve their existing source/layout
limitations; this verifies regression parity, not new source fidelity. Saved PDFs,
rendered pages, hashes and complete phase/cgroup logs remain in the evidence root.
Manual representative visual review is separately recorded there.
Eight succeeded tasks retain event/usage history; owned task files, child PIDs
and disk reservations are zero after cleanup. Physical disk peak was not sampled.
Documentation authority22/22 and final diff checks cover the single-plan change.
All candidate branches remain isolated and retained; no merged-lane cleanup, main
integration, release/tag/push/install or Stage5 work is performed.

Ruling: the inherited SRS manifest payloadHash names a pre-variant payload;
keep that historical field intact and bind comparisons to input-proof.json's
actual SHA256 instead. All Stage4 fixture files match Stage3 and all per-run
copies; composition template/normalized/oracle hashes match their frozen
fixture receipt. Actual SRS payload SHA256 is
8ee4f598e6ab0a394d454bee2505db117086224704159e8ad17c3bbc2536e3df.
No input mutation or replacement measurement was used. Cost if this identity
reconciliation were wrong: unsupported performance comparison; byte equality
and complete PDF oracle checks independently cover this prerequisite.


### Field-access diagnosis after Stage4 — 2026-10-20

Owner authorized continuing the bounded read-only measurement before selecting
a change. Discovery only, routine risk, inline IDs N/A; Core/Service own readers
and composition; this existing plan records findings. Runtime, package pins,
main/release/tag/install and Stage4's failed performance gate remain unchanged.
Ordinary reasoning sufficed; no escalation/delegation or new execution records.

Evidence: C:/Users/nekot/Documents/Codex/2026-10-20/field-access-profile,
identity.json,9 run results,3 CPU profiles,analysis.json and terminal receipt.
Three control/CPU-profile pairs plus one API-count pass,2CPU/1GiB, network none.
Two justified counters-only follow-ups separated lookup from required enumeration,
then cross-pass from within-pass rebuilding; neither repeats timing for a score.
Every composed document equals the same frozen whole-document oracle, all reader
grants return to zero, and actual Stage4 archive/source/input hashes are checked.
Raw counters remain identical across the detailed probes. Source hashes gate
external loader instrumentation; no candidate file is edited by profiling.

Uninstrumented control times: 1.323187, 1.281332, 1.281830s;
median1.281830s. Observer runs are diagnostic only and are not
new speedup evidence.15 reads return234318 logical bytes.
Lookups10721, key visits21212, average1.979 keys per lookup.
Validation collect/write each perform3571 lookups/7055 key visits; binding
3577/7099, envelope2/3. Mandatory non-lookup enumeration remains separate.
Index builds5400, evictions5336, but only8 builds repeat the same object within
the same collect/write/binding pass. Most rebuilding crosses the3 passes; this
does not support a cache-thrashing or active-record-pinning fix by itself.

CPU sampled self-time across3 profiles: Service31.71%, Core19.93%, GC11.22%,
VM/unknown32.40%, Node internals4.74%. The Service string-scanner frame is16.15%
of samples. Samples include profiler overhead; async attribution is incomplete.
Do not assign unknown/GC samples to promises, JSON.parse or any one component.

Recommendation revised from aggregate counters: pause extra cache/lifetime
changes. Existing Stage4 full-job evidence shows composition1.29–1.40s, layout
35.27–40.11s, PDF writing18.37–19.89s. To improve total SRS time, next inspect
layout first and PDF writing separately. If reader speed remains the chosen
goal, consider bounded synchronous scanning inside the already retained raw
record buffer; measure with escape/UTF8/duplicate/limit/abort/fallback parity.
Direct-name lookup remains a secondary proposal requiring a Core–Service
contract change. Neither proposal nor Stage5 is implemented or authorized here.

No PDF rerun: exact runtime/package/input identity and whole-document oracle
proof permit reuse of Stage4's660-page PDF evidence for unchanged behavior.
This diagnosis makes no new source-layout-fidelity or full-task timing claim.
Only this existing Project Control record changes; product branches/worktrees,
installed tools and data stay intact. Source, counters and CPU samples justify
this recommendation; improvement from any proposed change is still unmeasured.
