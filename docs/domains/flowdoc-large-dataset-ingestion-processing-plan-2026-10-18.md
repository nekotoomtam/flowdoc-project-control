# Large dataset intake and bounded document processing — proposed design and phased plan

## Authority Boundary

Owner: FlowDoc Project Control. Product owners: Service for intake, storage,
admission and job lifecycle; Core for validation, composition, layout and PDF
writing; FlowDocMake for authoring transport and result presentation.
Active role: Planning Partner / Cross-Repo Boundary Reviewer, inline discovery
and documentation only. Work/Phase/Checklist execution IDs: not applicable.
This is a proposed architecture and sequence for owner review, not an approved
runtime contract, implementation authorization, capacity result or release claim.
No product code, data, installed configuration, release, tag or deployment changes.

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
  Use bounded admission metadata before accepting/storing the large body; no
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
  originals, intermediates and output while being sent. Exact byte representation,
  per-task bounds and processing-space estimates remain Stage 0/test decisions.
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
reconciles persisted deadlines and unfinished tasks. Exact interval, cancellation
grace and failure codes are Stage 0 details. Expiry does not rewrite prior success.

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
  `C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/group-label-stage3`.
- Core candidate `e1a65178815f1657ebe464aca23a8a0a4219938c` at
  `C:/Users/nekot/Documents/GitHub/flowdoc-core-worktrees/group-label-stage1`.
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
| `tasks` | `id` (public `taskId`), server-bound `owner_key` and `created_by_principal`, optional `client_actor_ref`, `request_kind` (export/authoring preview), optional server-bound `billing_subject_key`, bounded external reference, exact template source reference/fingerprint, `status`, `state_version`, `created_at`, `updated_at`, immutable `expires_at`, receive/queue/process/send/terminal timestamps, `last_progress_at`, input/normalized digest, completeness summary, terminal reason/stage, `cleanup_status`, `cleanup_completed_at`, worker lease token/deadline | Main permanent record; no raw document fields. Server actor/owner, client actor attribution, template and deadline are fixed at opening. `expires_at = created_at + 3 hours`; one terminal outcome, no reset by status reads. Execution lease is not task lifetime |
| `task_files` | `id`, `task_id`, `section_id` for image assets, role (payload/original image/normalized part/prepared image), optional client `assetKey`, generated internal asset identity, logical data locator/order, media type, declared/received/stored bytes, checksum, internal storage key, receive attempt, file state, published/deleted timestamps | Server-controlled paths; image ownership and resolution use task + Section + asset identity, never task-wide key alone. Envelope files may have no Section. Store partial files safely; sealed input immutable. After removal retain bounded metadata/tombstone and clear locators. Output remains in `document_outputs`, not counted twice |
| `task_resource_reservations` | `task_id` PK, `storage_held_bytes`, `storage_used_bytes`, `queue_slot_held`, reservation policy version, `released_at` | Durable quota accounting, one row per task; used bytes are included in held bytes, never add both. Require `0 <= used <= held`. Reserve bytes before writing, shrink/release after actual deletion. Terminal failure can release its queue slot while retaining storage until expiry; unfinished cleanup still consumes storage |
| `task_events` | `id`, `task_id`, task-local sequence, optional job reference, event type, previous/new state, observed/recorded times, server actor, bounded safe reason/details, unique event key | Append-only durable lifecycle/delivery/cleanup history; sequence/key uniqueness prevents duplicate transition records. Do not emit one permanent event per uploaded chunk or poll. Progress counters can change without ledger growth. No tokens, raw values, full URLs or filesystem paths |
| `task_usage` | `task_id`, `revision`, `measurement_version`, finalization time, ownership/request/template snapshot, measured counters, generation/delivery outcomes and evidence references, optional superseded revision/reason | Append-only fact snapshot for future billing; unique `(task_id, revision)`, revision 1 written once with the terminal transition. Corrections append a new revision with rationale; no overwrite/double counting. Keep indefinitely in this scope. No price, invoice, charged flag or automatic charge rule yet |

Relations: one task has many files/events and one reservation; zero/one linked
generation job; that job keeps zero/one output and its existing font snapshot.
A task has one terminal usage snapshot plus explicitly versioned corrections.
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

### Remaining decisions and proof before SQL/runtime work

Close exact API examples and multipart binary-to-image-field binding,
principal/billing-subject mapping,
GB byte units, reservation estimates, per-record limits and timeout
values. Prove concurrent opening/upload, no double reservation, exact old/new input
mode constraints, owner access, all state transitions, expiry at every phase,
restart/stale worker, success versus disconnect/deadline race, missing required
images, deletion failure, and exactly-once terminal facts/events. Assert file
deletion preserves task/usage/event history and no giant payload remains in DB/logs.
Core/Service integration and current branch/worktree reconciliation are prerequisites
before runtime implementation; cleanup of the unmerged candidate lanes is not done.

## Proposed intake contract

1. Receive a new generation request without `taskId`. Authenticate and check
   bounded size/template admission metadata before consuming/storing large input;
   reserve queue/storage and create its parent task atomically. The exact control
   header/initial bounded-part syntax is Stage 0 work. No previous call is required.
2. Receive the entire dataset on this `multipart/form-data` request: one
   `payload` JSON part and binary image parts. JSON may be delivered as a JSON file.
   The server streams, extracts and registers assets; callers need not create an
   internal asset manifest, storage path or DB image IDs. Binary parts still need
   an unambiguous association with image fields in the payload; the exact binding
   syntax/examples remain Stage 0 work, not inferred from file order or filename.
3. Count bytes and hash while writing. Limit active streams, per-item bytes,
   per-dataset storage, aggregate storage, idle time and absolute lifetime.
   Transport buffering must apply backpressure and enforce limits on actual bytes.
4. Stream bounded task feedback on the generation response, with paginated stored
   diagnostics available on later task lookup. Looking up a task does not renew
   expiry or attach a new connection to its old output. One task receives one
   dataset; after interruption a new generation requires a new task. No byte-offset
   resume, upload overwrite or retained-PDF replay is promised in first scope.
5. Seal after complete transport receipt with validated sizes/checksums for stored
   originals. A truncated/malformed body is not complete receipt. A missing image
   reference becomes a recorded image omission, not a requirement to invent a file
   or fail the whole task. URL image sources, if supported, must be retrieved under
   existing network guards and pinned or marked unusable before rendering; no
   mutable URL is treated as a stored original. URL support is not added by this plan.
6. Validate structured content and cross-file references after receipt using a
   bounded reader. Sealed/received-complete is distinct from schema-valid and
   admitted-to-process. No rendering starts against an incomplete dataset.
7. Internally admit the sealed dataset for processing using its identity/digest.
   Pin the template, fonts, normalized input digest and processing contract. Keep
   this request open for feedback and the final PDF part; no extra client call is needed.
   Never rebuild the complete large JSON HTTP body or job JSON for admission.

Internal dataset lifecycle proposal: receiving -> sealed -> validating -> ready,
or invalid. The public task additionally tracks awaiting-payload, queue, processing,
sending and terminal outcomes, with immutable dataset and output identities.
Exact public names and JSON are Stage 0 decisions. Input validation remains distinct
from complete receipt; cleanup state is distinct from task outcome.
Transport/overall-capacity violations and unreadable structured input can be
rejected while receiving; storing first never accepts unlimited bytes. Isolatable
image failures follow the skip-and-record policy below instead of this fatal path.

## Parent task and single-API response stream — owner decision 2026-10-18

One logical public endpoint supports new generation and existing-task inspection.
The route name and exact `taskId` carrier remain Stage 0 examples, not implemented
routes. New requests use the multipart dataset; existing-task inspection supplies
only the identity and receives bounded JSON status, not a replayed PDF stream.

| Request | Behavior |
| --- | --- |
| No `taskId`, complete generation payload and bounded admission metadata | Reserve/create parent task; receive/validate; create zero/one internal generation job; stream feedback then PDF |
| Existing `taskId`, no new generation payload | Authenticate owner and return the latest persisted state of that exact task, including terminal outcome/expiry and omission summary |
| Supplied identity not found or not authorized | Return a bounded error; never silently open a new task |
| Existing identity plus another payload | Reject/conflict; do not overwrite, start a duplicate job or revive terminal work |

New generation has one response envelope with separate JSON parts and one final
binary PDF part. Proposed media type is `multipart/mixed`, whose mixed parts are
defined by [RFC 2046 section 5.1.3](https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1.3)
and HTTP multipart semantics by [RFC 9110 section 8.3.3](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.3.3).
Application event names/schema are our own versioned contract, not an RFC API.

- First metadata event: protocol version, `taskId`, current state, `createdAt`,
  `expiresAt`. Emit only after task reservation/creation commits. Make no guarantee
  that a browser exposes an early response before its request upload finishes;
  baseline progress after full receipt must work, and earlier visibility is tested.
- Progress events: task state/stage, known completed/total units, bounded warning
  summary and sequence. Relay the internal job's existing progress through Service,
  not by sending raw child-process output to the client. Do not invent a global
  percentage or create a new permanent record for each heartbeat/poll/chunk.
- Error event: safe reason/stage plus task identity if created. Recoverable image
  issues remain skip findings. Fatal error before stream starts can use normal HTTP
  error JSON/status; after it starts, HTTP 200 alone is never evidence of task success.
- On generation success, send artifact metadata (media type, expected byte size,
  digest and omission summary), then the raw PDF part and closing envelope boundary.
  No base64 of the whole PDF, no extra download URL and no JSON appended inside PDF
  bytes. Record `tasks.succeeded` only after the server finishes the response and
  wins the existing deadline/state race. The client verifies complete framing and
  PDF size/digest rather than treating an earlier progress event as success.

Core need not know this HTTP envelope: it produces the bounded output artifact;
Service owns the response stream, task/job mapping and progress projection.
Use bounded queues/coalesced progress and backpressure for slow clients. A heartbeat
can show a live connection but does not renew the three-hour task lifetime or
guarantee that proxies will not buffer/time out. First implementation keeps one
generation response per task; no subscription/replay/SSE/WebSocket subsystem.

Confirmed connection-loss policy is now owner-approved for planning; it is not
implemented. Detect loss of the caller-to-Service generation response, not merely
a changed browser page, a quiet progress stage or temporary slow reading. Do not
attribute fault to the customer without evidence. Detection/idle/write timeouts
remain Stage 0/environment tests, not proof that every disconnect is immediately
observable. On confirmed loss use these rules:

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
sources and builds the internal registry. `image` below denotes the image
source representation; these are logical shapes, not executable endpoint examples.

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

## Resource and result rules to close in Stage 0

- Separate stored bytes, active decode bytes, scratch/encode buffers, writer queue,
  font/layout overhead, metadata, total output, elapsed time and concurrent work.
  Existing 64 MiB image accounting is not a total-process RAM guarantee.
- Reserve conservatively before decode/write, reconcile actual bytes, limit queue
  buffers and initial processing concurrency. Measure parent and children together,
  including native allocation and container file-cache accounting where applicable.
  Use an enforced test/runtime memory boundary plus early abort policy and headroom;
  a managed-heap limit alone is insufficient.
- Count images/files/placements as work and metadata limits, not as a substitute for
  RAM accounting. No proposed 256-image production limit or larger RAM value is
  accepted yet. Capacity targets come from measured workloads.
- Distinguish corrupt/missing images, resource exhaustion, timeout and intentional
  fixed-format omissions. Report required images not rendered with bounded detail
  and paginated diagnostics. Low-resolution warnings alone do not mean missing.
- Initial new-task behavior skips isolatable image failures and records omissions,
  with partial content completeness even if sending succeeds. Error-level selection
  is deferred. Full-source fidelity acceptance still requires all expected valid
  images; old API behavior is not silently changed by this new-path design.
- One-job ownership, quotas across owners, expiry while jobs are queued/running
  and disconnect cancellation details must follow the owner decisions above.
  Existing-task lookup is not payload retry. Do not introduce cross-task re-use or
  automatic retry by implication. Cleanup failure does not turn successful delivery
  into a failed document; record and retry cleanup while retaining quota accounting.

## Phased plan and acceptance

All stages below are proposed and not started. Stage 0 contract review precedes
runtime authorization. Each implementation stage stops at its own verified checkpoint.

| Stage | Owner and output | Required proof |
| --- | --- | --- |
| 0: close contracts and budgets | Project Control + Service/Core: parent task/zero-or-one job, single-endpoint new/lookup examples, multipart feedback/PDF protocol, Section assets, ownership, expiry, usage and budgets | Admission metadata, lookup/event/framing schema, binary binding, image skip/fatal boundaries, confirmed-disconnect stop policy and trial shutdown timing, deadline races and limits; error-level selection deferred; no runtime changes |
| 1: dataset intake/storage | Service: reserve/create task atomically, stream one whole dataset into owned staging, internal item status, seal and recovery | Actual bytes over limit, backpressure, disconnect, concurrent uploads to one task, concurrent quota reservations, disk full, seal race, absolute expiry and restart; complete receipt does not imply runnable |
| 2: bounded validation and normalization | Core defines validation/reader semantics; Service provides storage/index adapters and automatic Section asset extraction | No whole-payload buffering or giant job JSON; values/order, duplicate JSON keys/depth, unkeyed images distinct, same keys in different Sections isolated, missing/conflicting refs skipped with reasons, no client manifest requirement; model 18/19 compatibility |
| 3: Core incremental image/PDF path | Core: metadata-only image layout, pinned resource provider, sequential embedding and incremental output | More than 20 unique images, repeated header and distinct sizes, JPEG/alpha PNG, bounded slow sink, links/TOC/page numbers, immutable snapshots, offset correctness and PDF syntax; no full-output buffer |
| 4: Service processing integration | Service: parent task/job projection, feedback/PDF stream, confirmed-disconnect stop and per-file retention | Packed Core, bounded progress/response errors; disconnect during receive/queue/process/send versus after complete send, bounded stop/escalation, no stale success, no false free permits; scratch/PDF deletion versus originals retained to fixed expiry, cleanup retries/quota reconciliation, restart/deadline races and permanent history; no whole-PDF buffer |
| 5: FlowDocMake/legacy integration | FlowDocMake and Service: single-API new generation or exact-task lookup, incremental feedback/PDF parsing, Section assets and lasting records | Real proxy/client stream visibility, request-upload timing, split chunks, save/hash, partial feedback, no taskId creates new work, taskId never duplicates/resumes/downloads, legacy/mixed compatibility; no mandatory polling, opening call or error-level selector |
| 6: resource and full-document acceptance | Service/Core with isolated fixtures and original UAT inputs | Grow unique-image count with fixed image size; separately grow one image and structured records; large alpha images, repeated assets, slow output and repeated jobs. Record total peak RAM/disk/time and cleanup against Stage 0 thresholds. Then verify all UAT placements, headers/Accept marks and every output page; regress SRS and SB.1 |

Do not remove the existing count protections until their replacement is active
across the complete negotiated path. For rollout, small-request compatibility is
required; broad large-JSON support must not be claimed from image-heavy tests.

## Proof, documentation and stopping boundary

Reuse the UAT originals, request mapping and failure receipt; create isolated
runtime/fixtures only when implementation or measurement is authorized. Future
proof includes source/input/output digests, exact semantic counts/order, image
placement coverage, PDF syntax/link/page checks, every-page visual comparison and
resource measurements by phase. Keep unresolved Thai extraction and known source
font/page-layout differences separate; do not erase them to pass image acceptance.

Current change is this single Project Control document. Check its authority,
source locators, stage dependencies, unresolved decisions, scope and final diff;
do not run product suites to imply that a design is implemented. No product map,
Work acceptance, package pin or mandatory AI entrypoint change. End this round at
the revised-plan review checkpoint; no merge, release or installation.
