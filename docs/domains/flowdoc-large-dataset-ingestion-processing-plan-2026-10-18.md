# Large dataset intake and bounded document processing — Stage 0 contract and phased plan

## Authority Boundary

Owner: FlowDoc Project Control. Product owners: Service for intake, storage,
admission and job lifecycle; Core for validation, composition, layout and PDF
writing; FlowDocMake for authoring transport and result presentation.
Active role: Product Implementation Agent / Cross-Repo Boundary Reviewer for
the isolated Stage1 ledger below. Work/Phase/Checklist execution IDs: not applicable.
Stage 0 specification completed 2026-10-19 under the owner's request to close the
contract; the concrete contract below is the development baseline for review.
Stage1 is complete only in the isolated intake scope recorded below; stages2–6
remain unstarted. Stage0 closure alone is not implementation authorization, measured
capacity, installed capability or a release claim.
Stage0 changed no product code/data/configuration; Stage1 changes only the isolated
Service candidate. No installed configuration, release, tag or deployment changes.

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

Stage0 specification and isolated Stage1 receipt/storage are complete;
stages2–6 are not started.
Runtime authorization remains separate. Each stage stops at its verified checkpoint.

| Stage | Owner and output | Required proof |
| --- | --- | --- |
| 0: contract specified 2026-10-19 | Project Control: v1 API/JSON/binary binding, identity, events, reservation and trial profile above | Documentation examples, arithmetic, transition/exception coverage and legacy boundary checked; runtime/capacity proof remains in stages 1–6 |
| 1: dataset intake/storage — isolated candidate complete | Service: reserve/create task atomically, stream unknown-size dataset with counted incremental reservation; seal and recovery | Evidence and unverified external cases are listed in the Stage1 ledger above; receipt is not runnable proof |
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

For planning-only changes, check this document's authority, source locators,
dependencies, unresolved decisions, scope and final diff; product suites cannot
prove an unimplemented design. Stage1 implementation proof is recorded in its
execution ledger above. No product map, registered Work acceptance, Core package
pin or mandatory AI entrypoint change. Stop at the authorized stage checkpoint;
no merge, release or installation.
