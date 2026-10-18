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
  Reject if unavailable before inviting the large body. Record server `createdAt`
  and `expiresAt = createdAt + 3 hours` durably. A capacity check without a
  reservation cannot protect against concurrent over-admission.
- Two calls: a small task-opening call returns `taskId`, status and expiry; a
  second call sends the complete payload once and receives the final PDF on that
  same second HTTP response. Do not require the client to split content into
  separate per-image requests, submit a third processing call, or fetch the PDF
  later. Internal parsing/chunking is the server's responsibility.
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
- Success is exposed with the final PDF response. No client save acknowledgment
  and no retained download/re-delivery promise. After server-side sending finishes,
  delete originals, intermediates and temporary output; keep the task record.
  Client-side save failure after a correctly completed send is outside this promise.
- An unsuccessful task can retain its data only until the original expiry. Keep
  task identity, terminal outcome and diagnostics after file deletion as a lasting
  record for possible future billing. Billing rules/charges are not defined here.

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

Long upload + queue + generation + response occurs within the second connection.
Client, proxy and server timeout/size constraints therefore require end-to-end
tests; task status polling is feedback, not a substitute PDF download channel.
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

## Proposed intake contract

1. Open an owned task with bounded size/template metadata; reserve capacity and
   return `taskId` as described above. Record the associated internal dataset.
2. Send the entire dataset on one task-bound request. A single structured-data
   body or a streamed multipart envelope for JSON plus binary images are proposed
   representations to close in Stage 0; separate image API calls are not mandatory.
   Client asset keys identify image references within the dataset; Service maps
   them to internal identities. Clients do not discover other users' DB IDs.
3. Count bytes and hash while writing. Limit active streams, per-item bytes,
   per-dataset storage, aggregate storage, idle time and absolute lifetime.
   Transport buffering must apply backpressure and enforce limits on actual bytes.
4. Expose bounded/paginated task feedback. Do not treat status polling as expiry
   renewal. A task accepts one payload attempt at a time and becomes immutable
   after complete receipt. Failed-transfer retry within the same task needs an
   explicit Stage 0 rule; no byte-offset resume or retained-PDF replay is promised.
5. Seal only after all declared originals exist and checksums/counts match.
   URL images, if supported here, must be retrieved under existing network guards
   and stored before sealing; a URL declaration is not a pinned original.
6. Validate structured content and cross-file references after receipt using a
   bounded reader. Sealed/received-complete is distinct from schema-valid and
   admitted-to-process. No rendering starts against an incomplete dataset.
7. Internally admit the sealed dataset for processing using its identity/digest.
   Pin the template, fonts, normalized input digest and processing contract. Keep
   the second request open for the PDF response; no third client call is needed.
   Never rebuild the complete large JSON HTTP body or job JSON for admission.

Internal dataset lifecycle proposal: receiving -> sealed -> validating -> ready,
or invalid. The public task additionally tracks awaiting-payload, queue, processing,
sending and terminal outcomes, with immutable dataset and output identities.
Exact public names and JSON are Stage 0 decisions. Input validation remains distinct
from complete receipt; cleanup state is distinct from task outcome.
An oversized or invalid item can be rejected while receiving; storing first never
means accepting unlimited bytes or skipping input validation.

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
- Prepare images serially initially. Deduplicate within the job using content
  identity, frame/target parameters and transform-contract version. Distinct
  placements remain distinct even when their bytes are shared.
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
  output visibility only after completion. Handle crash gaps between file and DB
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
- For complete-source acceptance, missing required resources fails acceptance.
  Exact preview partial-result and final-job status behavior is a contract decision;
  do not silently change old succeeded-with-warning semantics.
- Dataset re-use versus one-job ownership, quotas across owners, expiry while jobs
  are queued/running, cancellation and same-task receive retry must be explicit
  within the owner decisions above. Do not introduce cross-task dataset re-use or
  automatic retry by implication. Cleanup failure does not turn successful delivery
  into a failed document; record and retry cleanup while retaining quota accounting.

## Phased plan and acceptance

All stages below are proposed and not started. Stage 0 contract review precedes
runtime authorization. Each implementation stage stops at its own verified checkpoint.

| Stage | Owner and output | Required proof |
| --- | --- | --- |
| 0: close contracts and budgets | Project Control + Service/Core: two-call examples, single large upload/PDF response, identity, absolute expiry, persistent records and measured-test budgets | Payload encoding, declared/actual bytes, reservation estimates, GB byte units, interruption, same-task retry, expiry during each phase and long-connection contract; no runtime changes |
| 1: dataset intake/storage | Service: reserve/create task atomically, stream one whole dataset into owned staging, internal item status, seal and recovery | Actual bytes over limit, backpressure, disconnect, concurrent uploads to one task, concurrent quota reservations, disk full, seal race, absolute expiry and restart; complete receipt does not imply runnable |
| 2: bounded validation and normalization | Core defines validation/reader semantics; Service provides storage/index adapters | The single HTTP payload is not buffered/parsed whole or copied into giant job JSON; exact values/order, duplicate-key/depth limits, cross-part references and bounded expansion; old model 18/19 paths remain compatible |
| 3: Core incremental image/PDF path | Core: metadata-only image layout, pinned resource provider, sequential embedding and incremental output | More than 20 unique images, repeated header and distinct sizes, JPEG/alpha PNG, bounded slow sink, links/TOC/page numbers, immutable snapshots, offset correctness and PDF syntax; no full-output buffer |
| 4: Service processing integration | Service: claim sealed dataset, pin contracts/template/fonts, prepare files, stream final PDF on the original payload request, retain terminal record | Packed Core consumed for real; complete server send, disconnect before/after headers, no whole-PDF parent buffer, absolute expiry/cancellation, stale worker writes, disk-full and crash gaps; successful-send cleanup and failed-task expiry preserve records and release quota |
| 5: FlowDocMake/legacy integration | FlowDocMake and Service: task opening, single payload/PDF exchange, feedback, capabilities and lasting records | Auth/ownership, client/proxy/server timeout limits, legacy small requests, mixed versions, clone/import mapping, streamed save/hash, lost task ID creates new task, no required requestKey or later-download assumption |
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
