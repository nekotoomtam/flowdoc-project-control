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

1. Open an owned dataset with an idempotency key and bounded control metadata.
   Declare/paginate item metadata rather than require one unbounded manifest.
2. Upload structured-data files and image files separately as binary streams.
   Client asset keys identify image references inside this dataset; Service maps
   those keys to internal identities. Clients do not discover another user's DB IDs.
3. Count bytes and hash while writing. Limit active streams, per-item bytes,
   per-dataset storage, aggregate storage, idle time and absolute lifetime.
   Transport buffering must apply backpressure and enforce limits on actual bytes.
4. Query paginated item status and resend missing/incomplete items. First scope
   proposes complete-item retransmission, reusing existing semantics. Byte-offset
   resumability is a separate decision, not a claim about current functionality.
5. Seal only after all declared originals exist and checksums/counts match.
   URL images, if supported here, must be retrieved under existing network guards
   and stored before sealing; a URL declaration is not a pinned original.
6. Validate structured content and cross-file references after receipt using a
   bounded reader. Sealed/received-complete is distinct from schema-valid and
   admitted-to-process. No rendering starts against an incomplete dataset.
7. Submit a small request containing dataset identity/digest and selected template
   identity/revision. Pin the template, fonts, normalized input digest and processing
   contract. Never rebuild the complete large JSON HTTP request for this submission.

Dataset lifecycle proposal: receiving -> sealed -> validating -> ready, or invalid;
expiry/deletion is a separate availability concern. Job lifecycle is separate and
references the immutable dataset. Exact public names and JSON are Stage 0 decisions.
An oversized or invalid item can be rejected while receiving; storing first never
means accepting unlimited bytes or skipping input validation.

## Structured-data boundary

Accepting a JSON file as bytes solves receipt memory only. Streaming validation,
normalization, binding, composition and serialization must be considered together.
Service owns transport/storage; Core remains the schema and composition authority.

Proposed large-data representation: a bounded manifest plus ordered data parts at
declared logical record boundaries, with explicit Section/Area ownership and stable
ordering. Keep the business Section/Area/Format semantics unchanged; transport
parts are not new pages, Sections or Formats. Single JSON file import can use a
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
  are queued/running, cancellation, replay and retry lifetime must be explicit.

## Phased plan and acceptance

All stages below are proposed and not started. Stage 0 contract review precedes
runtime authorization. Each implementation stage stops at its own verified checkpoint.

| Stage | Owner and output | Required proof |
| --- | --- | --- |
| 0: close contracts and budgets | Project Control + Service/Core: public examples, transport part boundaries, states, identity, retry, retention, capabilities, completeness and measured-test budgets | Trace small and large paths; malformed/oversized scalar, interrupted item, wrong-owner reference, missing part, changed source, URL snapshot and mixed-version examples; no runtime changes |
| 1: dataset intake/storage | Service: stream original JSON/data parts and images into owned staging; item status, seal and recovery | Actual bytes over limit, backpressure, disconnect, full-item retry, conflicting replay, concurrent quotas, disk full, seal race, expiry and restart; complete receipt does not imply runnable |
| 2: bounded validation and normalization | Core defines validation/reader semantics; Service provides storage/index adapters | Large structured data does not become a single HTTP body or giant stored job JSON; exact values/order, duplicate-key/depth limits, cross-part references and bounded expansion; old model 18/19 paths remain compatible |
| 3: Core incremental image/PDF path | Core: metadata-only image layout, pinned resource provider, sequential embedding and incremental output | More than 20 unique images, repeated header and distinct sizes, JPEG/alpha PNG, bounded slow sink, links/TOC/page numbers, immutable snapshots, offset correctness and PDF syntax; no full-output buffer |
| 4: Service processing integration | Service: claim sealed dataset, pin contracts/template/fonts, schedule bounded work, prepare/embed files, publish completed output | Packed Core consumed for real; safe rejection before excess allocation, cancellation/timeouts, disk-full and child failure, recovery across file/DB gaps, retention and released reservations; no whole-PDF parent buffer |
| 5: FlowDocMake/legacy integration | FlowDocMake and Service: dataset controls, paginated status, capabilities, file streaming and result completeness | Auth/ownership, legacy small requests, mixed versions, clone/import reference mapping, streamed save and incremental hash/copy, clear incomplete output and retry receipts |
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
