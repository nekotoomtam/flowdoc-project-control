# Task admission, queue, and two-worker processing plan

## Authority Boundary

Owner: FlowDoc Project Control for the agreed definition and plan; Service for
implementation, storage accounting, scheduling, and task transport. Core owns
document composition/rendering and is initially unchanged. FlowDocMake consumes
the existing API and feedback; consumer changes require an identified impact.

Role: Planning Partner / Documentation Synthesizer. Inline documentation-only
work under the owner's explicit request on 2026-10-20; execution, Work, Phase,
and Checklist IDs are not applicable. Risk: routine. Document budget: this one
file. No closed execution context is reopened.

Status: Stage 0 contract closed; Stages 1–4 verified on isolated candidates
on 2026-10-20 under the owner's subsequent implementation and verification
requests. Development integration and clean merged-lane cleanup were subsequently
approved and completed; the subsequent authorized Git release is recorded below.
The subsequent authorized installation and native chat discovery are verified,
as recorded below. Numeric
resource values below are trial policy decisions, not
measured capacity guarantees.
This document is not implementation Evidence, a benchmark result,
deployment approval, or product/map truth. It does not authorize runtime edits,
tests, integration, release, or installation.

## Goal and counting rules

Accept nine requests from one owner into server-owned tasks and persistent
storage, then process at most two documents concurrently. Queued document data
stays on disk; a queue entry does not retain its full JSON, images, template, or
composed document in RAM.

Admission, receiving, processing, and sending have independent capacities:

| Capacity | Proposed trial value | Meaning |
| --- | ---: | --- |
| Admitted outstanding work, global | 10 | Nonterminal tasks across receiving, validation, queue, processing, and sending; legacy outstanding jobs also consume the shared ceiling without double-counting task jobs |
| Admitted outstanding tasks, per owner | 10 | Allows one owner to submit the nine-task workload; this is a trial policy, not a general production fairness decision |
| Active receiving/staging | 2 | At most two requests consume and stage their incoming bodies concurrently; admitted requests waiting for this slot remain bounded |
| Active document workers | 2 | Composition, image preparation, layout, and PDF generation; never more than two workers |
| Active PDF sends | 2 | Independent transport capacity, still included in outstanding task and resource accounting |

Ten outstanding slots include running work: two processing plus seven waiting
is nine admitted tasks, not nine waiting slots plus two uncounted workers. Each
task consumes one outstanding slot until its terminal transition, using the
existing release semantics. Residual files continue to consume storage even
after the task no longer holds an outstanding slot.

The trial task ceiling must agree with the shared ceiling; leaving `maxTasks=4`
or `maxOwnerTasks=2` in front of the new policy would prevent the goal. Proposed
values are not current runtime settings. Do not equate `maxReceivers=2` or
`maxSenders=2` with two document workers.

## Existing behavior versus required work

Read-only baseline inspected on 2026-10-20:

- Service primary development commit:
  `ef26740772d32341d7f353a0fe20a6e27857c0c3`.
- Retained, unmerged output-buffer candidate used by recent volume verification:
  `b0994e753c7699c34b483ac4467faf5ab954d69a` on
  `codex/pdf-output-buffer`, base `ef26740772d32341d7f353a0fe20a6e27857c0c3`.
- Core primary development commit:
  `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`.

These are inspection locators, not authority to merge the buffer candidate or
an assertion about the currently installed runtime. Resolve the exact execution
base and candidate dependency before development.

| Existing implementation | Change needed for this goal |
| --- | --- |
| Persistent `tasks`, queued `generation_jobs`, task files, reservations, and usage history | Reuse; do not introduce a second task or queue identity |
| `maxOutstanding=10`, `maxTasks=4`, `maxOwnerTasks=2`, `maxReceivers=2` | Separate total admission from receive capacity; raise the trial task/owner admission ceilings coherently |
| Creation rejects when receiver count reaches two | Acquire a receive slot independently; receiver saturation alone must not reject otherwise admissible work |
| One processor leader awaits each `runNext` render | Keep coordinated ownership but schedule up to two document workers |
| Queued execution coordinators and live transport are process-local | Preserve ownership and cancellation; do not assume a second Service instance can pick up another instance's in-memory execution |
| Stored input, pinned renderer/fonts, guarded paths, shared quota and cleanup | Reuse and verify under concurrent work |
| Feedback, PDF response, interruption and three-hour source retention | Preserve existing semantics; no new download archive or automatic retry promise |

Source locators: Service `src/tasks/policy.ts`, `repository.ts`, `intake.ts`,
`processing.ts`, `render.ts`, `quota.ts`, `workspace.ts`,
`src/jobs/processor.ts`, `src/http/documents.ts`, and `src/db/connection.ts`;
FlowDocMake `plugins/flowdocmake/scripts/task-client.mjs`. These were read again
for Stage 0; they remain inspection snapshots, not permanently current truth.

## Receive, queue, and worker contract

1. Authenticate and resolve the template before atomically admitting a task and
   reserving its initial storage. Issue its `taskId` through the existing
   feedback protocol. Count admission independently from a receive slot.
2. A request waiting for a receive slot may keep a connection, bounded protocol
   state, and bounded network buffers. It must not buffer the complete request
   in RAM. Apply stream backpressure and cap waiting connections by admission.
   Check framework/proxy buffering and timeouts; backpressure alone does not
   prove clients can wait safely.
3. Stream JSON/images into private persistent task storage when a receiving
   slot becomes available. Preserve checksums, actual-byte counting, incremental
   reservations, input validation, Section-local assets, and image findings.
   A task is ready for processing only after complete receipt and successful
   normalization. Bound normalization concurrency and include its memory in the
   global budget; a receive limit is not evidence of a normalization limit.
4. Select ready work in FIFO order with a deterministic tie-break. Atomically
   claim it once, retain its pins and lease, and start a worker only when a
   processing slot and resource headroom are available. Do not start a worker
   merely because the nominal concurrency ceiling is two.
5. A processing slot spans the actual document worker lifetime through exit and
   process-group reaping. PDF sending has its own slot. Releasing the worker
   slot does not release the task's storage or outstanding admission slot.
6. Keep the existing API, `taskId` wrapping `jobId`, feedback, and final PDF
   response. Disconnection still requests safe cancellation; this plan does not
   turn an interrupted connection into detached processing or automatic replay.
7. Age remains three hours from task creation, including receive-slot waiting
   and queue waiting. Never reset expiry when work advances. Define receive
   wait/active receive/normalization timeout boundaries using the closed timer
   table below so admission leases cannot silently expire during legitimate waits.
8. Preserve source retention until the original expiry after failure, deletion
   after successful delivery, and retained task/usage history. Restart recovery
   closes interrupted work safely; it does not automatically resume that task.

Nine-task acceptance is conditional on authorization, valid data, and available
capacity. It means all nine obtain server-owned tasks and can be stored without
a concurrency-only `QUEUE_FULL`; it cannot guarantee acceptance of arbitrary
sizes or completion within the unchanged expiry.

In ordinary operation, each ready task may start when a worker is available;
there is no new public batch barrier. In the proof workload only, hold the
scheduler until all nine requests are received, normalized, and queued, then
release it. This proves server-side queuing without substituting client-side
rolling submission. The hold must leave admission/API readiness and feedback
working; disabling API readiness would invalidate the proof.

## RAM contract

- Initial comparison profile: the same 2 CPU / 1 GiB container limit used by the
  named-volume verification. This is a test constraint, not a claim that two
  heavy documents fit. Do not silently increase RAM to obtain a pass.
- Budget the entire Service cgroup: API/coordinator, waiting connections and
  stream buffers, receive/normalization, both document workers and their native
  children, sends, observers where used, and charged file cache/kernel memory.
  PostgreSQL and host/VM RAM are measured separately or explicitly excluded.
- Queued tasks retain identifiers and bounded metadata in memory. Full stored
  inputs and job-local read buffers, indexes, images, fonts, and composed data
  are acquired only within bounded active stages and released afterward.
- The prior single-UAT cold run reached about 400 MiB; later runs reached about
  289–296 MiB. These observations do not justify multiplying an average to
  promise safe concurrency. Shared cache charging, receive overlap, and workload
  differences matter. Existing per-worker pause/stop thresholds are not a
  global two-worker memory guard.
- Before launching the second worker, enforce a global headroom rule. When
  headroom is insufficient, keep the task queued and report the reason; do not
  start it and rely on OOM. Resource waiting must be cancellable and expiry-aware.
  Do not pause both workers in a state where neither can release memory.
- The Stage 0 profile below closes the headroom/reservation model, high-water
  actions, memory sampling, and response to unavailable metrics. Existing
  quota/path/checksum guards must remain active. Never force cache
  dropping or close unrelated applications to improve a result.
- If the 1 GiB profile cannot sustain two active workers, report the constraint
  and propose a separately approved RAM profile. The ceiling remains two;
  resource gating may temporarily run one. A run that only runs one does not
  prove two-worker concurrency.

## Storage contract

- Trial task pool remains **1,500,000,000 bytes** (1.5 GB decimal), with the
  existing **256 MiB** free-space floor. A future 10 GB production budget is
  outside this round. Do not confuse GB/GiB or count the free floor as usable
  task space.
- Plan for original and normalized data of all nine admitted tasks, plus work
  directories, prepared image derivatives, fonts and PDFs for active workers,
  overlapping sends, and failed-task originals retained until expiry. Include
  other consumers of the existing shared pool.
- Keep admission and growth reservations atomic across all stages. Enforce
  both the configured pool ceiling and actual filesystem free space. Used
  bytes are already within held reservations; do not add used bytes again.
  On-disk outputs count until deletion, including during transport.
- No mandatory client size declaration is introduced. Initial reservation and
  subsequent actual-byte growth follow the existing contract. Admission of a
  slot does not reserve an unknown unlimited body. If growth cannot be reserved,
  stop safely, report the storage reason, and apply the existing retention and
  cleanup rules; do not leave unaccounted partial files.
- Do not free reservations before their writers/process groups have stopped
  and deletion/accounting is confirmed. Cleanup retries retain sufficient
  reservation; successful cleanup returns used/held bytes and slots correctly
  without deleting task/usage history.
- Use an isolated Docker local named volume with an explicit persistent task
  root, non-root permissions, and checked restart ownership. Current default
  temporary paths alone do not prove persistence. Keep production data and
  volumes untouched. Stable-hostname recovery was verified previously; changed
  host identity and foreign-writer quarantine remain explicit deployment limits.

## Staged development and future checks

Stage 0 is closed as a documented contract. Stages 1–4 results are recorded below.
The acceptance column records each stage's requirements, not new execution authority.
Implementation must remain isolated until separate integration approval.

| Stage | Deliverable / likely owner paths | Required future acceptance |
| --- | --- | --- |
| 0 — close contract (documented) | This file, including the closed contract below | Read-only source reconciliation and manual document review; no runtime proof claimed |
| 1 — admission and receiving | Service policy/repository/intake/HTTP and shared resource-grant foundation; FlowDocMake duplex client and capability consumer | One owner can admit nine; counts cannot oversubscribe; receiver saturation waits with bounded buffers and global intake credits; early feedback must not truncate uploads; old clients retain their existing mode; auth, storage exhaustion, disconnect, lease and expiry remain correct |
| 2 — two-worker scheduler | Service `jobs/processor.ts`, `tasks/processing.ts`, render/process lifecycle and shared grants | Attach both worker grants to the global memory/storage guard before enabling concurrency two; workers truly overlap and never exceed two; FIFO claims are unique; failures/cancel, leader loss, restart, reaping, legacy jobs and send overlap do not leak or double-start work |
| 3 — resource hardening and consumer impact | Service global guards/cleanup; FlowDocMake integration | Complete pressure, metric-failure and cleanup checks with two workers plus receive/send overlap; diagnose and reduce metric freshness delays using the bounded sequence below; no deadlock; retained source and usage history remain correct; client feedback/PDF contract works. This hardens the existing grant foundation rather than introducing memory control after two workers have already been enabled |
| 4 — mixed workload proof | Isolated real API + PostgreSQL + named volume, frozen UAT/SRS mocks and candidate | Run nine admitted tasks per comparison arm, all queued before release; compare concurrency one versus two under the same profile; verify output, resources, cancellation and cleanup; report limitations before any integration/release/install |

### Stage 3 metric freshness follow-up — owner decision 2026-10-20

Include the Stage 2 `UNAVAILABLE` timing risk in Stage 3; this addition is a
plan update only, not authorization to start runtime development or tests.
Preserve the Stage 2 acceptance record and failed-attempt evidence. The failed
attempt did not record enough per-read timing to establish whether file reads,
event-loop delay or shared-host contention caused the freshness loss. Lack of
fresh metrics is distinct from measured memory exhaustion.

Proceed in this order when Stage 3 implementation is authorized:

1. Add bounded diagnostics for scheduled versus actual sampling time, read
   start/completion or timeout, last successful sample age, event-loop delay,
   and active pipeline phase. Record metric failure reason separately from
   high/emergency memory pressure. Do not retain request bodies or unbounded
   sample arrays; monitoring overhead stays within the existing RAM credits.
2. Use those measurements to identify long uninterrupted receiving or
   normalization work. Where demonstrated, divide that work into bounded
   chunks and yield so sampling, cancellation, leases and feedback can run.
   Preserve validation order, checksums, backpressure and bounded buffering;
   do not load a whole queued input or add parallel intake to make it faster.
3. Only if timing remains inadequate, evaluate a separate monitoring process.
   It must read the same Service cgroup, timestamp fresh completed readings,
   bound IPC and account for its RAM/process lifetime. Lost/stale readings,
   monitor exit and cleanup still fail closed. Process separation does not
   guarantee timely CPU scheduling; an architectural change returns for an
   explicit scope decision before implementation.

Keep the 100-ms sampling target, 500-ms freshness/read-failure bounds, memory
credits and pressure thresholds unchanged. Stop new grants when metrics are
unavailable and safely stop affected active pipelines at the agreed bound;
never relabel stale values as fresh or replace cgroup charge with guessed RSS.
Any threshold change requires a separate supported policy decision, not tuning
until a proof passes.

Future acceptance: compare the unchanged Stage 2 candidate with the Stage 3
candidate using frozen UAT/SRS inputs on the same 2 CPU / 1 GiB profile, both
isolated and under a bounded, recorded shared-host load. Cover two real workers
plus intake/send overlap, deliberate metric failure/staleness and cancellation.
Report sample-age/read-time/event-loop distributions and maxima, `UNAVAILABLE`
counts with reasons, monitoring overhead, RAM/storage peaks and stage/total
times. Distinguish delays waiting to run from time awaiting a read callback;
neither proves physical I/O latency alone. All-page PDF parity, feedback,
leases, source retention, one usage record per task and cleanup must remain
correct. Require no unexplained freshness-related stops in the agreed normal
workload, and verify safe stopping under injected loss; retained timing risks
or inability to meet the existing bound must be reported before Stage 4 rather
than hidden by looser limits. Stage 4 retains the full nine-heavy-job comparison.

## Proof workload and measurement plan

- Frozen inputs: UAT full three times (70 pages each) and existing SRS six times
  (98 pages each), the same template/mock identities as recent verification.
  Do not change mocks, asset representation, image quality, or template content
  between comparison arms. Expected total: **798 pages per arm**.
- One comparison arm uses one worker, the other two, with the new admission
  policy unchanged between arms. Each arm keeps one container alive for its
  complete nine-task workload. Use separate empty test roots/DBs, the same
  runtime/CPU/RAM/storage/probes, and record run order and cold/warm conditions.
  This is one workload run per arm, not a statistically established benchmark.
- Define total wall time from first submission to receipt of the final PDF;
  separately report time until final cleanup. Include the intentional initial
  all-queued hold in the timeline and disclose its duration. Per task report
  receive wait, receiving, normalization, queue wait, worker execution, send,
  cleanup, and client latency. Overlapping durations must not be summed as total.
- Observe stage concurrency, worker/native PIDs, DB slots/reservations, cgroup
  CPU/RAM, anonymous memory versus file cache, physical task files, and sampled
  disk peaks. Retain raw samples and distinguish sampled peaks from kernel
  memory high-water marks. Do not present per-job container RAM as worker RSS.
- Record memory before the workload, during all nine tasks, after final cleanup,
  and through a 30-second idle window. Separately state any additional
  settling observations. Do not infer an unbounded leak from reclaimable cache
  alone or claim indefinite stability from nine jobs.
- Verify every resulting page against its reviewed reference: strict PDF parse,
  rendering diagnostics, text, images/alpha/order, links and geometry, and
  rendered appearance. Reuse exact parity where justified; retain every failed
  attempt and never count a skipped check as PASS.
- Completion requires nine successful tasks and one usage record each per arm,
  accurate stored pins/feedback/output checksums, zero leaked task files or
  held reservations after cleanup, and no surviving worker/zombie. Report OOM,
  pressure-induced waiting, timeouts, failures, and unmet prerequisites plainly.
  A two-worker arm must show overlapping real worker execution to establish it.

## Stage 0 closed contract — 2026-10-20

### Execution boundary and persistence

Future isolated implementation starts from Service buffer candidate
`b0994e753c7699c34b483ac4467faf5ab954d69a`; primary branches remain untouched.
This chooses the input dependency, not integration approval. Pin Core archive
`flowdoc-core-0.4.7-release.tgz`, SHA-256
`13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad`.
Re-resolve changed inputs before execution; do not silently switch candidates.

Keep existing task/job identities, status enums, pins, events, files, reservations,
and usage records. No migration is planned: versioned `resource_policy` JSON and
existing events can record the new limits/waits. If implementation demonstrates
a missing durable invariant, return that finding before adding a migration.
Use a distinct internal policy version `task-v1-queue-2worker-trial-1`; existing
task policy snapshots are immutable and do not inherit new numeric values.

One Service coordinator remains the sole processor leader for one database and
task root. Its two workers are child process groups, not competing Service
instances. Claims, ownership and resource grants are atomic; no duplicate
generation or stale worker may publish after losing its lease. Every new task
phase records the existing process-start identity as well as PID/host so PID
reuse cannot make a dead owner appear alive. Keep stable hostname/root ownership
for this trial; cross-host failover remains excluded.

FIFO for receive/normalization slots is `(tasks.created_at, tasks.id)`. A slot
is held from body consumption through normalization completion, at most two
combined intake pipelines; a blocked normalization retains its slot. Ready
document FIFO is `(generation_jobs.created_at, generation_jobs.id)`, meaning
readiness order, not a promise to delay ready work behind an incomplete upload.
Do not skip a ready FIFO head only to favor a smaller task when RAM/storage is
insufficient; retain its explicit resource wait until capacity, cancel or expiry.

The two-worker ceiling covers all document workers. Existing legacy job handling
remains serial and exclusive with task workers: at a legacy FIFO turn, drain
already running task workers, run that legacy job alone, then resume task
scheduling. Legacy work counts in the global outstanding ceiling and resource
checks; it must not bypass the two-worker guard or start a third renderer.

### Admission, API and feedback

Keep `POST /documents`, `doc-key` in the header, multipart JSON/images, existing
Section-local asset scope, and the `task-v1` multipart response envelope. New
queued/full-duplex behavior is explicit opt-in with one `task-mode: queue-v1`
header. Duplicate/unknown mode values are `INVALID_REQUEST`; an unsupported
mode must fail before task creation, never silently downgrade.

Advertise `queue-v1`, early-response/continued-upload support and numeric limits
through an additive Service capability. A new FlowDocMake client checks that
capability before selecting queue mode. Missing capability means this nine-task
flow is unavailable; never claim older installed versions support it.

In queue mode, after authorization/template lookup and atomic initial reservation,
open the response with a `task` event containing `taskId`, original timestamps,
template pin and `status: awaiting_input`. This acknowledges task admission,
not complete receipt or storage of the body. Emit wait/phase feedback while the
request remains attached. Only after complete receipt and normalization is it
acknowledged as `queued` for document processing. No body buffering before the
receive grant is permitted.

Waiting application metadata is capped at 64 KiB per task; transport-layer
request/response application buffers together are capped at 1 MiB per admitted
connection, with at most one pending feedback write and one replaceable heartbeat
value. Existing 32-KiB event and 64-KiB write limits still apply. Kernel socket
buffers and parsers also count in actual cgroup charge; this application cap is
not a bound on total connection memory. A bound violation is `LIMIT_EXCEEDED`,
not permission to start draining the entire body into RAM.

An updated client must continue streaming the entire request after a successful
early response, while reading feedback concurrently. Only terminal rejection,
cancellation or connection loss stops upload. The current `taskRequest` loop
breaks on any response and therefore must change before queue mode is enabled.
Bound both directions, serialize each response's writes, coalesce heartbeat
updates instead of accumulating an event backlog, and preserve final PDF length,
hash and exclusive local publication checks. Without a successful duplex proof,
nine-task admission is not ready for acceptance.

Requests without `task-mode` retain response-after-receipt behavior; a busy
receiver may still reject this old mode before task creation. Do not send early
success to an old client. Old mode shares the new outstanding, storage and
processor ceilings but is not advertised as supporting nine waiting uploads.
JSON task lookup remains unchanged. Reverse proxies must permit request and
response streaming without full-body buffering; this is a deployment prerequisite,
not permission to modify production proxy settings in this round.

Use existing status enums. Optional feedback `detail.waitReason` is one of
`receive_slot`, `memory`, `processing_slot`, `storage`, `legacy_turn`, or
`send_slot`. Waiting input is `awaiting_input`, active normalization is
`validating`, ready worker waits are `queued`. A completed worker awaiting a
sender is `sending` with `waitReason: send_slot`; start the actual send timer and
`send_started_at` only when a sender is acquired. Worker counters must follow
process-group lifetime, not infer activity from a status label.

Send state changes promptly and heartbeat at most every 10 seconds while waiting,
receiving or normalizing; retain processing feedback at most once per second.
No exact queue-position, completion percentage or ETA promise. Once the binary
PDF part begins, do not interleave JSON. Capacity rejection before admission is
`QUEUE_FULL` or `STORAGE_CAPACITY`, no new task; errors after admission use that
task's terminal feedback/history. A failed response does not prove the client
received its `taskId` and does not introduce automatic deduplication.

### Slot ownership and time limits

| Limit | Closed value / rule |
| --- | --- |
| Global outstanding / task ceiling / per-owner trial ceiling | 10 / 10 / 10; global includes legacy outstanding jobs; task jobs counted once |
| Intake pipelines / document workers / senders | 2 / 2 / 2, independently granted and released |
| Admitted task-request connections | At most 10, further reduced by shared outstanding consumption; no unbounded extra waiter list |
| Absolute lifetime | 3 hours from DB-created `created_at`; never extended by progress, retries or changing slots |
| Receive-slot or queued/resource/sender-slot waiting | Until original expiry, disconnect or explicit cancellation; no separate short queue timeout |
| Active receive | At most 30 minutes from intake grant, also bounded by original expiry |
| Client input idle | 60 seconds while the server is actively willing to read; server-induced backpressure/resource wait does not count as client idleness; on resumption a fresh idle interval starts, but active receive and absolute deadlines do not reset |
| Normalization | 15 minutes from normalization start, including resource pauses, bounded by original expiry |
| Document processing | 90 minutes from actual worker claim, including resource pauses, bounded by original expiry |
| PDF transmission | 30 minutes from actual sender grant, bounded by original expiry; sender-slot waiting is separate |
| One blocked response write | 60 seconds, then treat as connection loss; heartbeat is not an extension of this stalled-write limit |
| Ownership lease / renewal | 30 seconds / at most every 10 seconds in every admitted live phase, including slot waits; renewal never extends absolute expiry |
| Cleanup sweep / stop grace | Existing 10-second sweep / 5-second graceful worker stop, then kill only that owned process group and reap |

Each stage deadline is the earlier of its stage limit and original expiry. If
expiry and a stage timeout coincide, report `TASK_EXPIRED`; otherwise use
`TASK_TIMEOUT`. Service-wide leader loss or invalid lease stops owned work as
`WORKER_INTERRUPTED`. Keep the existing safe connection-loss behavior, closed
source retention and cleanup/history rules. A dead process is not kept alive by
renewing its task from an unrelated request.

Waiting timers and heartbeats must work before body receipt. Keep the native
client's three-hour request cap and 60-second socket idle guard with concurrent
feedback; do not solve waiting by removing all timeouts. Proxy/client request
duration must allow the original task lifetime, with streaming heartbeats and
the separate final-write guard. Clients may still cancel sooner.

Keep a global pool of at most **8 PostgreSQL connections** for this trial (current
code has 5): one is held by the leader, up to seven handle short operations.
Preserve 5-second acquisition/lock bounds and 15-second query/statement bounds.
No request holds a DB connection or transaction while parked on a slot, doing
CPU work, streaming the body/PDF, or awaiting the client. Cap queued-status reads
at one per second per task, rather than nine independent 20-ms polling loops;
lease/feedback work can share a read. This is a planned pool/polling change,
not a current runtime assertion.

### Closed trial RAM profile

All values here are Service-cgroup policy credits, not measured RSS guarantees.
The profile is 2 CPU / **1,024 MiB** hard container RAM; no swap allowance beyond
that limit. Do not apply these absolute thresholds unchanged to a smaller limit.

| Budget or guard | Closed value |
| --- | ---: |
| Coordinator/metadata/base credit | 128 MiB |
| Intake plus normalization credit | 64 MiB per held pipeline, at most 2 |
| Document-worker credit | 320 MiB per live process group, at most 2 |
| Sender credit | 8 MiB per active sender, at most 2 |
| New active-stage launch ceiling | 768 MiB |
| Stop admitting new active stages on high water | 832 MiB actual cgroup charge |
| Resume after pressure | At most 704 MiB for 10 consecutive 100-ms samples |
| Emergency pressure | At least 896 MiB for 3 consecutive 100-ms samples |

Under one atomic coordinator grant, let `credits` include base and all current
stage grants, and let `delta` be the requested new stage credit. Grant only if
`max(memory.current, credits) + delta <= 768 MiB`, the stage-count ceiling allows
it, and no pressure/metric/stop latch is active. Count an atomic intake-to-ready
or worker-to-sender transition by releasing the old stage only after it actually
ends. Idle admitted tasks hold bounded metadata, not an intake or worker credit.
For example two workers alone use 128 + 320 + 320 = 768 MiB credits; intake or
send overlap may therefore delay the second worker. This is intentional and must
appear in wait measurements, not be hidden as a two-worker pass.

Sample Linux cgroup-v2 `memory.current`, effective `memory.max`, `memory.stat`
and OOM events every 100 ms; measure `memory.peak` separately. Use a sample no
older than 500 ms for a grant, and validate the actual hard limit at startup.
Count file cache and kernel charge in the guard; anonymous/file breakdown is for
diagnosis, not permission to subtract cache from the limit. DB/host memory is
reported separately. If required metrics are missing at startup, queue-mode
generation is unavailable. On a read failure stop new grants immediately; if
metrics stay unavailable for 500 ms, safely cancel affected active pipelines as
`UNAVAILABLE`, rather than substitute guessed process RSS.

At high water keep already active work progressing, withhold new grants and
record memory waits; do not freeze both workers. Resume only after hysteresis.
At emergency pressure, stop the newest active document worker as `RESOURCE_LIMIT`
using its original processing time/id order; if no worker exists, stop the newest
active intake pipeline. Stop one victim at a time and reassess only after it has
exited/reaped. If pressure persists, continue with the next newest active pipeline.
No new work may start during this sequence. If only sending remains, cancel the
newest sender and remove its undelivered PDF safely. Resource cancellation still
retains eligible originals until expiry and records one terminal usage history.

The credit scheme and headroom are conservative trial decisions; they cannot
prove OOM prevention before validation. Unexpected fast allocations and cache
charging remain future proof risks. Large retained cache can also conservatively
block a grant even if Linux could reclaim it; report that resource wait and its
expiry instead of subtracting cache or claiming progress. Keep existing
reader/cache/index/reuse and 64-KiB IPC/output-buffer bounds unchanged and within
these credits. Do not give
every queued task its own read grant. Connect existing per-worker pause/stop
checks to this global guard in Stage 2, before enabling two workers; Stage 3
hardens the pressure/failure paths. Two workers must not deadlock at isolated
pause gates or exceed the container together. If the profile cannot demonstrate
two real workers, report that result and return for a resource-policy decision;
do not silently tune thresholds, raise RAM, or force cache dropping.

### Closed storage and request bounds

Keep the existing pool at **1,500,000,000 bytes**, actual free-space floor
**268,435,456 bytes**, per-task bound **1,000,000,000 bytes**, initial reservation
**8,388,608 bytes**, and reservation growth **8,388,608 bytes**. Ten initial task
reservations consume 80 MiB (nine consume 72 MiB); this is not a reservation for
their unknown complete bodies. Keep existing per-request 512 MiB, JSON 64 MiB,
image 50 MiB, normalized 256 MiB, PDF 256 MiB and 1,001-part limits.

Under the existing shared admission transaction/lock, let `delta` be the new
initial reservation or positive growth not yet included in held values. Enforce
both `held task reservations + legacy reserved/output bytes + delta <= poolBytes`
and `unused task reservations + unused legacy reservations + delta <= actual
free bytes - freeFloorBytes`. Apply delta once; do not double-count task used
bytes. Reject before creating a task if its initial reservation cannot fit.
On body/normalization growth failure,
terminate that task with `STORAGE_CAPACITY`, preserving only eligible complete
source parts. Do not consume more bytes without a reservation.

Move the current render workspace pre-reservation out of every queued request's
`execute` path: reserve it only at worker admission, atomically with the worker
grant and memory credit. Use the existing pinned-font workspace bound plus
64 MiB headroom over current task used bytes; also enforce the per-task bound.
If that known minimum can never fit this task's limit, fail `LIMIT_EXCEEDED`;
if it cannot currently fit the shared pool/free disk, stay queued with `storage`
wait reason until release, cancel or original expiry. Unknown derivative/PDF
growth later uses normal guarded reservations; inability to grow terminates that
task safely, not an unbounded retry. This prevents nine idle queue entries each
reserving an active renderer's workspace.

Account for both workers, all admitted sources/normalized files, sends, legacy
consumers and retained failed inputs. After terminal status, cleanup failures
retain storage accounting even if the outstanding slot is free. On successful
deletion reconcile actual bytes before releasing storage; never release worker,
intake or sender credits before their owned activity stops.

### Closure and future proof boundary

Stage 0 checks performed: read-only source reconciliation and manual consistency
review of counts, timers, feedback, resource formulas, ownership and future
acceptance. No runtime, client, capability, SQL schema, Docker configuration,
test fixture, installed package, or production data changed; no tests ran.

Stage 0 has no unresolved policy choice for this bounded trial. Production
fairness, proxy deployment, multi-instance recovery and larger RAM/storage
profiles remain explicitly deferred. The exact new configuration/capability
field placement is code-local implementation detail; the limits and semantics
above may not be silently weakened. Future evidence must demonstrate nine tasks
really queued, two process groups overlapping, no truncation after early
feedback, bounded resources and correct expiry/cancellation/cleanup. Failure
returns to the responsible stage; it is not retroactive closure evidence.

## Existing verification inputs

The local named-volume verification receipt is at:
`C:/Users/nekot/Documents/Codex/2026-10-20/uat-volume-verification/receipt.json`.
Its measurements and all-page checks cover serial UAT on the frozen buffer
candidate, interruption/restart, source retention, expiry simulation, and
cleanup. They are reusable inputs, not two-worker or nine-task Evidence.

Default scope excludes a queue broker, multi-instance failover, new public batch
API, automatic retries, billing changes, new document capabilities, release,
and production installation. Add none merely to satisfy the trial.

## Stage 1 isolated result — 2026-10-20

Scope: inline Service implementation and FlowDocMake consumer changes under the
owner's explicit Stage 1 request. Execution/Work/Phase/Checklist IDs remain not
applicable; no closed registered round was resumed. The existing file is the
only canonical document changed; no system/document map truth is promoted.

Service candidate: `codex/task-queue-stage1`, commit `af9b8b7`, based on the
retained, unmerged output-buffer candidate `b0994e7`. The matching Project
Control branch contains the duplex consumer changes and this record. Core
package remains 0.4.7 with SHA-256
`13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad`.
Package versions are unchanged experimental candidates, not a new release.

- Atomic admission accepts ten queue-mode tasks from one owner, rejects the
  eleventh without an extra row, and reserves initial/growth bytes under the
  existing shared quota lock. Nine real HTTP uploads reach persisted queued
  state before the proof-only scheduler hold is released.
- Two shared intake grants cover receiving through normalization. Waiting
  bodies remain unread; waiting feedback, cancellation, lease renewal and the
  original absolute expiry are preserved. Additive `queue-v1` capability and
  header negotiation allow early feedback without stopping the upload. An
  unmodified old client retains response-after-upload behavior.
- Startup without the queue metrics profile retains standalone legacy mode.
  Once shared intake has been enabled, transient metric loss fails closed for
  both client modes; recovery cannot bypass the two-grant ceiling. Native
  cgroup samples include current/max/stat/events/peak. Independent renewal
  remains active through slow PDF transmission without extra queued-status reads.
- One read-only whole-candidate review found two important issues: delivery lease
  renewal and a transient-health legacy bypass. Both were reproduced before
  correction and covered by the final passing regression. The populated old
  schema migration fixture also passes without rewriting history or originals.

Evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-20/task-queue-stage1`.
`receipt.json` maps acceptance to logs/artifacts; failed exploratory attempts
remain recorded rather than counted as passing checks. Final Service build and
131 tests pass with no skips. Relevant plugin checks pass nine tests in total;
two unchanged container-tamper preflight checks were not rerun and are not PASS.

Final representative UAT/SRS input hashes match all 190/14 original stored parts
respectively. Both receive feedback before upload completion, then produce
70/98-page PDFs. All 168 final pages match the reviewed baseline in pixels,
text, image bytes/alpha/order and link geometry/targets. An additional 19 fixture
PDFs (21 pages) pass strict parsing, text and all-page rendering checks.
The representative run uses 2 CPU / 1 GiB, no extra swap, and an isolated named
volume: cgroup peak 302.98 MiB, zero OOM events; sampled held storage peaks at
578,813,952 bytes. Successful tasks return storage and intake grants to zero
and retain exactly one usage record each. This is not a nine-heavy-job benchmark.

At the Stage 1 checkpoint, still required before enabling two workers were
Stage 2 worker/sender credits,
atomic workspace admission with storage waiting, actual overlap and legacy
worker exclusivity; Stage 3 combined pressure/reaping hardening; Stage 4 the
3-UAT/6-SRS comparison. Stage 1 still advertises and runs one PDF processor.
Primary branches, release refs/tags, installed runtime and production data are
unchanged. Candidate worktrees are retained for the next authorized stage.

## Stage 2 isolated result — 2026-10-20

Service candidate `codex/task-queue-stage2`, commit `98c4f75`, starts from the
verified Stage 1 commit `af9b8b7`. The existing isolated Service/control worktrees
are reused on new branches, preserving Stage 1 refs. Inline implementation and
verification use the owner's continuation approval; execution IDs remain N/A.
Core/package pins, SQL schema, installed runtime and primary/release refs are
unchanged. This record does not promote product/map truth or authorize integration.

- The sole processor leader launches at most two task workers without awaiting
  the first. A worker credit and quota-locked workspace reservation precede its
  unique FIFO claim. RAM/storage shortage holds the head; impossible per-task
  workspace size fails before launching. Legacy FIFO turns drain task workers
  and run alone under the same credit guard.
- Worker credit lasts through group exit and scratch cleanup; sender credit is
  separate. A completed worker waiting for a sender has status `sending` and
  null `send_started_at`; the send deadline starts only after a sender grant.
  Default local pause gates yield to an actual global worker grant. Explicit
  smaller local test limits remain active; capability now advertises two workers.
- Cancellation, leader loss, forced worker death, stable-container restart,
  original-source retention, expiry and cleanup are covered. Recoverable foreign
  group quarantine holds both scheduler lanes and resumes after safe cleanup.
  Unconfirmed termination retains credit/scratch and disables readiness. Legacy
  descendants, including adopted zombies, must disappear before releasing credit.
  Missing startup metrics keep standalone legacy mode until restart; metric
  recovery cannot activate a guard around uncredited fallback work.

Evidence root: `C:/Users/nekot/Documents/Codex/2026-10-20/task-queue-stage2`;
`receipt.json` maps checks to files. Build and 157 tests across 17 files pass
without skips. One read-only whole-candidate review found three important issues;
one RED/GREEN correction pass resolved them. Additional legacy render checks
required preparing the isolated public-schema fixture; no candidate repair was
used to hide that missing prerequisite.

Final UAT/SRS replay uses fresh isolated DB/volume and the unchanged 2 CPU /
1 GiB profile, with two real process groups overlapping: peak 471.11 MiB, zero
OOM, sampled held bytes 578,813,952. All 168 final pages match the reviewed
baseline in text, pixels, images/alpha/order and links; 20 fixture PDFs (22 pages)
also parse/render completely. A coordinator SIGKILL proof with two live groups
recovers without replay, retains all 204 complete source parts, records one
usage per task and clears bytes/reservations after isolated TTL ageing.

Retained risk for Stage 3: a replay overlapping another test workload failed
closed as `UNAVAILABLE` during metric freshness loss, without OOM. The isolated
final replay passed unchanged thresholds; its maximum observed event-loop lag
was 472.91 ms and memory-read latency 475 ms, close to the 500-ms bound. This is
not a general capacity/reliability guarantee. Broader pressure/timing hardening
and the Stage 4 nine-heavy comparison remain pending; do not silently relax the
guard to obtain a pass. Failed attempts remain in the evidence root.

## Stage 3 isolated result — 2026-10-20

Owner-authorized inline implementation uses the retained isolated Service and
control worktrees on `codex/task-queue-stage3`, starting at Service `98c4f75`
and control `a805a35`. Service candidate `9b4ab6e` changes the JSON reader,
memory guard and direct processing transport, with regression tests. Core,
package pins, schema, primary/release refs and installed runtime are unchanged.
Execution IDs remain N/A; only this existing shared plan is updated.

The cached/retained-record reproduction showed that fulfilled-Promise byte
scans could starve a cancellation timer. The reader now cooperatively yields
after an 8-ms work slice, checking time every 1,024 byte operations, without
retaining another input copy. Abort/close returns reader grants. The resource
guard records fixed-size read-time, scheduled-start-delay and sample-age
histograms plus failure reasons. Monotonic freshness checks run even while a
read is pending; a later successful read cannot erase an already missed
deadline, and one hung underlying read cannot accumulate overlapping retries.
The sampling/freshness, pressure, credit and storage limits remain unchanged.

Injected metric loss also exposed a direct-transport failure-feedback path
blocked by its own generation abort. Terminal feedback now follows client
connection cancellation independently, with the original bounded write timeout.
Both direct transport and actual HTTP/FlowDocMake receive the terminal reason;
confirmed disconnect still cancels work and removes unsent output.

Evidence root: `C:/Users/nekot/Documents/Codex/2026-10-20/task-queue-stage3`.
Build and the affected integration suite pass 190 tests across 22 files with
no skips. Coverage includes two-worker pressure/metric loss, receive/send waits,
cancellation, actual process reaping, leader loss/recovery, retained originals,
expiry, cleanup, old clients, model 18/19 and streamed feedback/PDF delivery.

Frozen UAT/SRS run once per cell on the same 2 CPU / 1 GiB Service profile;
shared-load cells add an isolated two-thread CPU workload capped at 2 CPU /
256 MiB. The Stage 2 baseline has timing instrumentation only; behavior remains
unchanged. PostgreSQL and the competing container are outside Service RAM.

| Observed value | Baseline isolated | Candidate isolated | Baseline shared load | Candidate shared load |
| --- | ---: | ---: | ---: | ---: |
| Maximum scheduled-start delay, ms | 448.74 | 28.05 | 423.95 | 10.52 |
| Maximum prior-success age at read start, ms | 546.00 | 126.88 | 521.00 | 108.65 |
| Peak Service cgroup RAM, MiB | 580.44 | 467.61 | 480.26 | 458.62 |
| Harness wall time, seconds | 30.39 | 26.19 | 24.11 | 22.54 |

Age is since the previous completed aggregate read, sampled at the next read
start; it is not continuous maximum staleness or the acquisition time of every
cgroup file. Read elapsed time includes callback scheduling, not just physical
I/O. These single runs and their order/cache conditions do not establish a
performance distribution. All four cells completed with two actual worker
groups, zero OOM and zero metric read errors; the candidate also recorded zero
stale stops. The original contended failure was not reproduced by this bounded
CPU load; deterministic tests instead prove the starvation, stale-reset and
overlapping-hung-read defects and their corrections. No separate monitor
process or threshold relaxation was needed for the measured workload.

All eight representative PDFs (672 pages) match the reviewed Stage 6 baseline
in text, pixels, image bytes/alpha/order and link targets/geometry. Every page
parses and renders without diagnostics; the candidate 168-page contact sheet
was inspected. Another 20 fixture PDFs (22 pages) parse/render completely.
Representative normal-HTTP PDF proof precedes the direct-terminal-transport
correction; that supplied-wire path is unchanged, and the final integration
suite rechecks the corrected transport. This is regression parity, not a new
source-document fidelity claim.

Remaining boundary: an actual host/event-loop stall exceeding the unchanged
freshness bound still causes a safe stop. These results do not guarantee
production capacity or all possible shared-host loads. Stage 4 still owns the
full nine-heavy-job, one-versus-two-worker comparison. No integration, release,
push or installation is authorized by this result.

## Stage 4 isolated mixed-workload result — 2026-10-20

Verification-only continuation uses unchanged Service `9b4ab6e` with Core
0.4.7 and the same pinned archive. No Service, Core, plugin, schema, runtime
configuration, primary branch or release ref changed. Project Control owns this
result on `codex/task-queue-stage4`; execution IDs are N/A inline. Evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-20/task-queue-stage4`.

Each comparison arm submits nine separate HTTP requests through the native
FlowDocMake client: three full UAT and six existing SRS inputs. All nine receive,
normalize and reach persisted queue state before any worker starts. All original
parts are hash-checked against frozen source and stored bytes (190 per UAT,
14 per SRS). Actual payload/template/image-list hashes match verified Stage 3;
the older manifest's stale SRS payload hash is preserved as provenance while
`frozenHashes` records the actual unchanged bytes. No mock or asset representation
is changed between arms.

Both arms use the same candidate, harness hash, 2 CPU / 1 GiB / no-extra-swap
profile, 1,500,000,000-byte pool, probes and independent empty named volumes /
cloned test databases. The single-worker arm adds only an external launch gate
around `runNext`; production capability stays two and all worker RAM credits
remain unchanged. Actual one/two-worker maxima are verified. Raw process census
contains 866 two-live-worker samples in the parallel arm and also confirms
simultaneous native Python descendants belonging to two worker parents.

| Measured value | One worker | Two workers |
| --- | ---: | ---: |
| First submission to final received PDF, seconds | 135.56 | 85.72 |
| Submission to final cleanup, seconds | 136.65 | 86.76 |
| Submission to all nine queued, seconds | 33.25 | 20.47 |
| Intentional all-queued verification hold, seconds | 2.23 | 1.34 |
| Release to final received PDF, seconds | 100.08 | 63.90 |
| Kernel cgroup peak RAM, MiB | 385.57 | 574.73 |
| Maximum sampled physical task-file bytes, MiB | 31.78 | 43.14 |
| Maximum sampled held reservation, MiB | 584 | 952 |
| Mean RAM during the final 30-second idle window, MiB | 162.48 | 141.33 |

The observed total-time reduction is 36.77% (1.58 times throughput for this
workload). One run per arm is not a performance distribution or a guarantee
about cold/cache-equivalent conditions. Order was failed harness preflight,
single-worker, then two-worker; no forced cache drop occurred. Preparation and
hold differences above are included in totals; post-release timing is reported
separately. Per-task/stage timings, CPU throttling, anonymous/file/kernel memory,
RSS/process census, disk and resource samples are retained in `measurements.json`
and raw traces. Service cgroup includes the coordinator, local clients and probes;
PostgreSQL and host/VM memory are excluded. Used bytes are within held reservations,
not an additional amount. Sampled physical peaks are not exact disk high-water marks.

Both arms complete nine tasks / 798 pages, one usage record per task, with intact
pins, checksums and feedback. No OOM, metric read failures or freshness stops occur.
After cleanup, task files and used/held reservations are zero; no worker or zombie
survives the final census. Transient zombies were sampled during normal reaping,
so this is not a claim that none ever existed. Idle RAM is observed for 30 seconds,
not proof of indefinite leak freedom or return to initial allocator state.

A separate three-full-input cancellation proof stops one queued and one active
task through client disconnect while its peer finishes a 98-page SRS PDF. Both
stopped tasks retain complete original-source records at their original expiry,
record one terminal usage each, and clear files/reservations after explicitly
isolated fixture TTL ageing. Existing Stage 3 backpressured-send/disconnect and
unsent-PDF deletion evidence remains reusable: no product code changed and all
172 externally recompiled files match executed `dist` byte-for-byte. The previous
190 tests are reused, not represented as rerun in Stage 4.

All 19 produced PDFs / 1,694 pages (1,596 comparison pages plus 98 cancellation
survivor pages) pass strict parse, every-page rendering without diagnostics,
text, image bytes/alpha/order, internal-link targets/geometry and exact pixel
comparison to the reviewed Stage 6 baseline. Representative 168-page contact
sheets from both arms were inspected. This proves regression parity, not new
fidelity to the original source documents.

Observation: one completed SRS PDF waits 10.679 seconds for its 8-MiB sender
credit while two worker credits fill the 768-MiB launch ceiling. All 101 observed
wait snapshots show two workers, zero senders and actual RAM at most 520.80 MiB;
this is conservative credit waiting, not high-water pressure, deadlock or a
failed delivery. Keep the agreed policy unchanged; no optimization is authorized.

The first nine-task attempt stopped before processing because the harness
incorrectly demanded first feedback before every fast upload completed. The
corrected harness records actual timing instead; queued source integrity remains
mandatory. That attempt is retained as failed proof, with source retention and
fixture expiry cleanup verified. A cleanup-helper assertion initially included
16 cloned historical terminal rows; it was scoped to the nine current-owner rows
before ageing. Neither failure required a product repair.

One independent read-only audit found the harness credible and no runtime defect;
its sole pending prerequisite was the then-running full PDF check. The executor
resolved it against the final 19-file / 1,694-page PASS receipt. Six stopped proof
containers and four physically checked empty volumes are removed; test databases,
output PDFs, evidence and unmerged candidate worktrees are retained. Docker is
restored to its initial stopped state. Maps and installed systems remain unchanged.

## Development integration closeout

Under the owner's subsequent merge and cleanup approval, Service candidate
`9b4ab6e` was fast-forwarded into `codex/template-registry` and Project Control
candidate `67d4604` into `main`. Core `codex/template-binding` stays unchanged.
Subsequent Service README/usage and plugin README edits clarify development
queue opt-in only; runtime, dependencies, packages, versions and configuration
are unchanged.

Fresh primary-checkout verification passes Service build, all 14 plugin tests
without skips, Project Control `check:data`, and whitespace checks. Service's
190-test / 22-file result and Stage 4's 19-PDF / 1,694-page proof are reused,
not rerun: tested source and dependencies are unchanged. Of 172 freshly compiled
files, 171 match the Stage 4 build exactly; `templates/registry.js` differs only
by one CRLF/LF sequence, with equal normalized content and parsed JavaScript
tokens/literal values. No output was rewritten to conceal this difference.

Three clean integrated worktrees and eight merged local branches were removed
with ordinary non-forced Git operations after ancestry and path checks. Primary
and release branches, tags and full integrated history remain. PDFs and proof
files stay outside removed worktrees; `cleanup.json` maps historical worktree
paths to their retained commits and primary repositories.

Integration evidence and final receipt are retained at
`C:/Users/nekot/Documents/Codex/2026-10-20/task-queue-integration/receipt.json`.
Docker and installed systems remain unchanged. No release, tag, push or
installation was performed. This closeout records development integration;
it does not promote a system map or authorize deployment.

## Release preparation — 2026-10-20

The owner authorized documentation/package preparation only. The next delivery
candidate is Service **0.4.9**, unchanged Core **0.4.7**, and FlowDocMake **0.2.8**.
Previously tagged 0.4.8/0.2.7 packages and all release refs remain immutable.
Service package/lock, Compose image defaults, `.env.example`, README/usage and
vendor delivery metadata now name this pair. The plugin manifest, exact Service
compatibility pin, entry skill, README and generated documentation snapshot agree.
Core archive SHA256 stays
`13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad`;
its source remains `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`.

The Service guide removes the obsolete claim that `/documents` is unavailable
and gives the separate operator override for the checked 1-GiB / 2-CPU queue
profile, credentials and retained task storage. Base Compose still does not
enable task credentials or impose that queue memory limit. No new SQL migration
is introduced after 024. The 1.5-GB trial pool and its reservation limits remain;
10-GB capacity is deferred, not claimed as verified.

Fresh checks pass Service build, 22 plugin compatibility/stdio/stream/snapshot
tests with no skips, Project Control data and whitespace checks. All 30 copied
guide files match their committed canonical inputs; `guideRelease:0.4.4` remains
the independent guide baseline, not the Service package version. Core tarball
SHA256, lockfile SHA512 and source provenance agree. GitHub default branches and
existing release/tag tips were read back without changing remote refs.

The integrated Service runtime source and Core package are unchanged by this
preparation, so the 190-test Service result and Stage 4's 19 PDFs / 1,694 pages
remain reusable under the recorded identity checks; they were not rerun here.
The new exact client pin rejects Service 0.4.8 and unknown/newer versions.
Release preparation evidence and frozen delivery files live at
`C:/Users/nekot/Documents/Codex/2026-10-20/queue-release-readiness/`.

Remaining authorized-step boundary: after owner approval, recheck remote/base
identity, form the single-parent Service snapshot/tag `v0.4.9` and plugin component
snapshot/tag `flowdocmake-v0.2.8`, prove exact tree equality and tagged ancestry,
then atomically push the required refs per repository and read them back. Core
needs no new version or snapshot. These release actions are not performed here.
An image build, backup, real installation and live-chat/real-data post-install
checks are separate future work; no 0.4.9 running-image identity is claimed.
No Core/Service runtime source, actual local config, DB, installed plugin or Docker state was
changed by this preparation. Execution/Phase/Checklist IDs remain N/A for this
bounded inline preparation; no system map is promoted.

## Git release result — 2026-10-20

The owner subsequently authorized Git snapshots, annotated tags and GitHub pushes
only. Service `release` / `v0.4.9` is snapshot
`ca66f605b02a41d1bc3b05894fbc75f5224d4900`, from verified development source
`32d78570b5c2dc8940efd3452bf5d4dffc55c081`; its only parent is release 0.4.8.
FlowDocMake `release/flowdocmake` / `flowdocmake-v0.2.8` is snapshot
`85f7ea7e0c116f73ab1bd41a3dd12ab9834c168f`, from frozen Project Control source
`53677e28eac141e4bde440c0e11da96d4ad0a85e`; its only parent is component 0.2.7.
Each snapshot's complete tree equals its frozen source tree. All 12 Service
release ancestors and all 3 plugin component ancestors have their own annotated
version tags, including remote peeled targets. Old tags were not moved.

Default development branches, release branches and new tags were pushed atomically
per repository and read back from GitHub. Development histories remain complete;
this subsequent closeout changes only this record, not the frozen candidate.
Core 0.4.7 source, artifact, local/remote branches and tags remain unchanged.
The delivery hashes and passing readiness evidence above are reused without a
repack or runtime change. Verified pre-release Git bundles and publication proof
are retained at `C:/Users/nekot/Documents/Codex/2026-10-20/release-049-028/`.
No GitHub Release page, package/image registry publication, installation, actual
configuration, DB or Docker state change was performed. The existing 1.5-GB trial
scope and separately authorized installation checks remain applicable.

## Installation checkpoint — 2026-10-20

The owner authorized installation with backup and queue/document/chat checks.
The previous actual instance was Service/Core 0.4.3; its configured launcher
still selected plugin 0.2.4 while the plugin manager listed 0.2.6. The installed
set is now Service **0.4.9**, Core **0.4.7**, FlowDocMake **0.2.8**, on the original
loopback endpoint `http://127.0.0.1:3018`. The running image ID is
`sha256:9d76527509c0bed79350dc823e34d7e5fa1ab7ea4176e95277bb57af5a06b723`.
The image was built from the frozen released source archive; installed plugin
bytes match its frozen ZIP. Core archive identity remains unchanged from delivery.

Before changing the actual instance, a quiescent custom DB dump, both storage
volumes, configuration/credentials and old plugin copies were backed up with
hashes in an access-restricted local folder. Restore into an isolated DB and
file volume preserved all four drafts; migrations 022–024 and idempotent replay
passed there before the actual upgrade. Actual migration/replay, image identity,
1-GiB / 2-CPU / child-reaping-init settings, restart persistence and permission
checks pass. Four original definitions, revisions and fingerprints, the font
library/defaults and the zero published-template count remain unchanged.

Nine real streamed requests using the installed image in the isolated restored
DB produce UAT3/SRS6 PDFs, 798 pages, with two overlapping processing intervals.
All nine tasks were admitted before the first finished; normal scheduling overlaps
intake and processing, so this installation run does not claim all nine were
normalized before the first completion. Durable task/usage/hash receipts match;
success files and reservations reach zero after asynchronous cleanup. A separate
processing disconnect stops safely, retains received originals to their original
three-hour expiry and leaves no partial PDF. No native child or zombie remains.
Temporary test containers, volumes and their network were removed; user data and
the verified backup remain. The observed test-cgroup peak is about 545.8 MiB,
not a general capacity or performance guarantee.

Four unchanged actual drafts produce 115 pages. Those plus the nine queued PDFs
total 13 PDFs / 913 pages, all rendered and compared with prior reviewed output:
pixels, text, drawn image bytes/alpha/order, page sizes and link targets/geometry
match, with no new rendering diagnostics. The image checker follows actual `Do`
paint operations; unused resource-dictionary entries are not drawn images.
Existing `IMAGE_LOW_RESOLUTION` warnings remain: four for SRS and ten for the
UAT representative; both ศบ.1 variants have none. No source assets were enhanced.
This proves regression parity, not new source-document fidelity.

Fresh independent MCP startup reports `ready:true`, plugin0.2.8, Service0.4.9,
Core0.4.7 and 25 tools. The active chat still exposes no FlowDoc tool, so native
chat discovery is **not yet verified**. The owner previously chose to reopen Codex
manually; no app-wide restart was performed. After reopening, call the native
context/contract tools in this chat before marking this remaining item complete.
Evidence, PDFs and the explicit pending item are retained at
`C:/Users/nekot/Documents/Codex/2026-10-20/install-049-028/receipt.json`.
No product source, release/tag or user-template publication was changed by this
installation. Execution/Phase/Checklist IDs are N/A for this bounded inline work.

## Native chat verification complete — 2026-10-20

After the owner reopened the whole app, this chat exposed all 25 plugin tools.
The first native context/contract calls found Service unreachable because Docker
was stopped. Starting Docker and the existing original DB/API containers restored
the endpoint; no further Codex shutdown, reinstall or draft mutation was needed.
Native `mcp__flowdocmake__get_flowdocmake_context` now returns `ready:true`,
package0.2.8, Service0.4.9, Core0.4.7 and the exact delivered Core SHA256/image ID.
Native `get_authoring_contract` succeeds with queue-v1, maxOutstanding10 and
maxProcessing2. The installation's final pending item is complete.
Raw native tool evidence is retained in `native-chat-proof.json` alongside the
installation receipt above; earlier failures and pending checkpoints remain
historical observations. Prior queue/PDF checks are reused unchanged, not rerun.

## คู่มือ FlowDocMake — พักการออกรุ่นตามคำสั่งเจ้าของ 2026-10-20

ปรับคู่มือต้นทางและสำเนาเอกสารใน development ให้ตรงกับ FlowDocMake0.2.8 /
Service0.4.9 / Core0.4.7 แล้ว โดยแยกคำแนะนำปัจจุบันจากประวัติรุ่นและผลตรวจเดิม.
Commits: `1361221`, `5e598d3`, `501c944`, `50d2278`.
ผลตรวจเอกสาร: รุ่นและลิงก์ที่เพิ่มสอดคล้อง, ประวัติผลตรวจยังอยู่,
สำเนาและ checksum ครบ30ไฟล์ตรงต้นทาง, check:data และ diff whitespace ผ่าน.
ไม่มีการแก้ runtime หรือรันทดสอบ PDF ใหม่ในงานคู่มือนี้.

สำเนาคู่มือในแพ็กเกจ0.2.8ที่ติดตั้งยังเป็น snapshot เดิม ไม่ได้อัปเดตตาม development.
ข้อเสนอออกรุ่นแก้คู่มืออย่างเดียว (เช่น0.2.9) **พักไว้**: เจ้าของสั่งให้ mark
ใน Project Control เท่านั้น ยังไม่เตรียมออกรุ่น ไม่สร้าง release/tag ไม่ push
และไม่ติดตั้งหรือรีสตาร์ตแอป. กลับมาทำเมื่อเจ้าของสั่งอัปเดตปลั๊กอินในรอบใหม่;
Core/Service คงรุ่นเดิม. ผลตรวจการติดตั้ง0.2.8ที่ปิดแล้วด้านบนยังคงสถานะเดิม
ไม่เปิดงานติดตั้งเก่ากลับมาเป็น pending.

## Architecture audit follow-up — Oracle lab, 2026-10-30

Owner request: finish the remaining Core/Service audit follow-up and test on the
existing Oracle VM. This is a new bounded single-room follow-up; execution,
Work, Phase and Checklist IDs are N/A. Roles: Product Implementation Agent for
two test corrections, Evidence Reviewer for the isolated verification, and
Project Control Steward for this status record. This section records candidate
verification and local development integration; it does not reopen the earlier
installation rounds or promote a system map, release, installed readiness or
universal architectural correctness.

The F1–F6 Service fixes were integrated locally by fast-forward from `83f85f5`
to `843bd0204b424f32cf7fed8a8ebaab6964a33388` on the actual development branch
`codex/template-registry`. The latest additional change only makes the existing
publication-protection test deterministic: the PDF fixture gets an explicitly
old mtime before checking both active protection and deletion after release.
Fractional filesystem mtime had made immediate age-zero cleanup timing-dependent
on Oracle. Runtime retention behavior was not changed by that test correction.

Core development branch `codex/template-binding` was fast-forwarded locally from
`0401b87` to `1817efa4964af9e18cf75d4d31b4221893167800`. Its only change adds the
already exported and Service-consumed `normalizeOutputName` to the exact public
API test expectation. The archived Core release base `55315ca` and development
base `0401b87` have the same tree
`97752cfbf5f338c4528e7b8e98bd6da9f103262b`; the tested correction is identical
after integration. No Core runtime implementation, package pin or archive was
changed. Both default branches were checked against live remote HEAD; no push
was performed. Service `release` remains `25e912f`; Core `release` remains
`55315ca`.

Verification used the separate Oracle Docker project
`flowdoc-audit-187957aecc2d`, its own PostgreSQL18 database, internal network and
volumes, with no published ports or production data mounts. Suite/API containers
were limited to 1GiB and two CPUs each; the separate DB used 512MiB. The observed
VM has 7933MiB RAM: these are container checks, not whole-VM4GiB capacity proof.

| Criterion | Observed result |
| --- | --- |
| Complete Service suite | 729 passed, 0 failed, 3 skipped; F3 regression9/9 and paired PDF/DOCX API18/18 passed |
| Complete Core suite on Linux | 1268 passed, 0 failed, 0 skipped; original prior one-shot Linux ELF helper supplied with recorded provenance/hash |
| F1 runtime ownership/recovery | Three processing-container recreations plus an idle recreate; terminal event/usage once, unused reservations returned, retained input bytes charged, and a new PDF succeeded after every recovery |
| F1 health and legacy fixture | Synthetic unguarded foreign task caused both health/admission503 without admitting work; isolated expiry-clock advancement led to cleanup/reservations0 and health200 |
| F2 governed preflight | Its actual PostgreSQL/native admission and shared-credit regressions passed in the complete Service suite |
| F3 delivery/finalization | Real HTTP completed PDF with rejected DB finalization preserved delivery success; container loss before durable completion became unknown, without rerender; reservations reconciled |
| F4 lock order | Twelve controlled PostgreSQL schedules passed; deadlock counter0 before/after. This does not certify every possible deadlock schedule |
| Supplied font-height gate | Original TH custom and six Google-family fixtures passed, closing one previously skipped test |
| F5/F6 retirement | Ownership and filesystem retirement regressions passed in the complete Service suite |

Initial unsuccessful runs are retained. A new lab default schema first lacked
migrations required by the standalone version-render test; an actual catalog
probe confirmed the missing table, lab-only migration/focused verification
passed, and the complete suite was rerun. A subsequent run exposed the mtime
fixture above. The final full command passed after that test correction.
`PGOPTIONS` selects an independently migrated default schema while explicit
per-test pool options retain isolated schemas. Core's initial Linux run lacked
its documented legacy-helper prerequisite; a retained Core0.3.0 ELF fixture was
provided, its one-shot behavior checked, and the complete suite rerun. No mock
replaced a native result or database transaction.

Production container IDs, images, start times, restart counts and mount sets
were the same before/after; mount ordering was normalized. These observations
support unchanged runtime identity/restarts, not row-by-row production data
comparison or a guarantee of zero transient resource impact on a shared host.
All owned lab containers are stopped; lab volumes/images and evidence remain.
No production SQL/storage repair, release/tag, push, installation, or Oracle
runtime switch was performed. Migration027 was applied only inside the lab.

Remaining boundaries:

- Three Service font-height checks requiring the reviewed operator/configured
  container-binding fixture remain skipped; they are not PASS.
- Real legacy tasks without runtime identity remain quarantined. Actual repair
  still requires separately authorized consistent DB/storage backups, proven
  writer quiescence and a successful disposable restore/recovery rehearsal.
- Release preparation and installation remain separate future authorizations.
  Passing this follow-up does not close every design concern from the original
  architecture audit or constitute new native Word/fidelity acceptance.

Durable local report and raw evidence selection:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-20261030/verification-report.html`.
The adjacent `verification-summary.json`, `integration.json`, and
`evidence-manifest.json` bind source/fixture/image hashes, exact results, initial
failures, production observations and remaining gaps. Raw lab evidence is also
retained under `/home/ubuntu/flowdoc-audit-187957aecc2d` on Oracle. These artifacts
and repository tests support the bounded claims; this status prose is not a
replacement for those proofs.

## Three font-height binding guards completed — 2026-10-30 follow-up

The owner subsequently requested the three remaining skipped checks on the same
isolated Oracle lab, with no real-data changes, release or installation. This
bounded verification-only follow-up uses the unchanged Service candidate
`843bd0204b424f32cf7fed8a8ebaab6964a33388` and FlowDocMake0.3.1. Roles: Evidence
Reviewer and Project Control Steward; execution/Work/Phase/Checklist IDs N/A.
The earlier 729/0/3 Service and 1268/0/0 Core complete-suite observations remain
historical results. This round ran only the relevant guard module: **4 passed,
0 failed, 0 skipped**, covering all three previously skipped cases plus the
always-enabled setup-instruction assertion. It is not a new combined732-test
suite claim. Product source and package pins did not change.

| Previously skipped criterion | Evidence |
| --- | --- |
| Reject `prepare` on an unrelated loopback port before admin mutations | Actual MCP receipt reports `ready:false` / `RUNTIME_VERSION_UNKNOWN_OR_INCOMPATIBLE`; process exits1; administrator requests0 |
| Reject `activate` on an unrelated loopback port before admin mutations | Same real preflight rejection occurs before the visual-approval step; administrator requests0 |
| Accept the actual inspected container binding without repeating intake | Real Docker inspection/exec and actual localhost binding return `READY`; repeated `prepare` leaves six font catalog/audit table counts and hashes unchanged |

The fixture was prepared through the unchanged real seven-family import/review
helper against the lab API, rather than inventing a completed intake state.
`review-visual.json` remains `NOT_REVIEWED`; no visual approval or activation was
claimed or performed. Additional saved raw MCP receipts establish that both
negative cases failed at runtime/port preflight, rather than passing merely
because visual approval was absent. The source negative tests deliberately
serve the same contract on an unrelated local test server; positive binding,
Docker metadata, native readers and PostgreSQL are real.

`flowdoc-height-stage4-runtime` was created only after verifying that this
required test name was unused, and carries the lab project label. It publishes
only a dynamically assigned `127.0.0.1` port. An additional lab-only bridge was
needed because the previous internal-only network did not publish that port;
the database stays on the internal network. Private client files and reader
tools were confined to the lab directory/disposable image; the reader container
mounts only the lab directory read-only. No Docker socket or production data is
mounted, no system package is installed on Oracle host, and no installed plugin
configuration is changed. Restricted command wrappers delegate actual Docker
inspection/version execution only to the owned lab API; they do not manufacture
inspection results. Both tested scripts match the candidate content, with the
recorded executed CRLF bytes distinguished from canonical Git LF hashes.

All owned lab containers are stopped and evidence/volumes retained. Production
container identities, images, start times, restart counts and mount sets remain
unchanged. This is an observed runtime-identity boundary, not a row-by-row
production integrity comparison or a guarantee of zero transient shared-host
resource impact. No product code, release/tag, remote, installation or Oracle
runtime switch changed in this follow-up.

Report, raw focused results, raw negative receipts, positive binding identity,
fixture provenance, table hashes and final boundary check are retained at:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-height-guard-20261030/verification-report.html`.
The adjacent `verification-summary.json` and `evidence-manifest.json` bind the
claims and file hashes. Raw operator preparation and earlier prerequisite
failures remain under the Oracle lab's `height-guard` directory.

The three test gaps above are now closed. Real legacy tasks without runtime
identity remain quarantined; actual data repair still requires separately
authorized backups, writer quiescence and restore/recovery rehearsal. Release,
installation and new visual/Word acceptance remain outside this verification.

## Legacy identity-free recovery rehearsal — 2026-10-30 plan

Authority: the owner's new explicit request to plan and rehearse only on an
isolated Oracle lab. Owner: Service; roles: Planning Partner, Evidence Reviewer
and Project Control Steward. Single-room verification, execution/Work/Phase/
Checklist IDs N/A. Size: bounded; risk: routine within disposable synthetic
data, with real-data repair explicitly forbidden. The existing immutable
Service candidate `843bd02` remains unchanged. The current host model is used
for this inline verification; no separate WORK or model dispatch is created.

The implementation keeps historical runtime/storage identities NULL and guards
their immutability (migration027). A foreign-host writer/child reference cannot
be disproved by the new container. The proposed operator procedure therefore
requires a consistent DB plus storage backup and proven writer quiescence;
it must not invent runtime provenance, replay output, infer delivery success,
disable runtime identity guards, or release quota independently of file cleanup.

Rehearsal sequence and acceptance/proof budget:

1. Create only synthetic legacy tasks on a new labelled private Docker lab:
   interrupted input/processing/sending and retained files, with NULL identity
   and foreign process references. Show quarantine and matching health/admission.
2. Stop every lab writer, inventory containers/mounts and DB sessions, then
   export the dedicated database and complete task storage. Hash both backups.
   Restore to another dedicated DB/storage pair and compare rows and file hashes.
3. Before any repair, reject an active-writer condition, a stale inventory and
   incomplete backup/storage provenance. Exercise transaction rollback.
4. On the restored copy only, under maintenance ownership, advisory quota/task
   locks and an exact row allowlist, clear obsolete process references while
   retaining NULL origin identity. Let the existing recovery/cleanup path
   terminalize tasks, preserve uncertain delivery, return unused reservations,
   and retain received input until its original expiry. Repeat without duplicate
   terminal/usage rows or automatic generation/sending.
5. Recreate the restored API container; prove health/admission agreement, a new
   genuine PDF request, unchanged old job/output counts, and eventual TTL cleanup.
   Verify rollback by another restore from the untouched original backups.
6. Stop all owned lab containers, retain backups and evidence, and compare
   production container identity/restarts/mounts before and after, without
   querying production data. This is not row-level production integrity proof.

Allowed outputs: ignored lab scripts/evidence, one durable verification report
and this existing Project Control record. No product implementation, migration,
release/tag, push, install, production SQL/files/configuration or runtime switch.
The existing source and prior suites are reused within scope; no new full-suite
claim. Stop at these criteria; a prerequisite failure is not PASS. Backup and
writer-quiescence guarantees for a real deployment remain unverified and need
separate owner authorization even if this disposable rehearsal passes.

### Rehearsal result — PASS within the synthetic fixture

The new lab `flowdoc-legacy-b859ffbbd5fd` used its own private internal network,
three dedicated database volumes and three task-storage volumes, without
published ports. The previous Oracle lab and production data were not reused
as task data. Runtime image
`sha256:00980f7ded74ba413419329f36c6b328de7178493eba766d5f6a60654861d623`
is the prior unchanged image built from `3e21a5c`; comparison with `843bd02`
differs only in `tests/pdf-files.test.mjs`, not runtime source. No product
candidate, migration, Core pin or installed runtime was changed in this round.

Four tasks were created with real intake/normalization and then given explicit
synthetic awaiting-input/validating/processing/sending state and foreign-process
markers. Their runtime/storage origin fields remained NULL. They are not an
observation of historical senders, a real interrupted transport or user data.

- Quiescent lab DB export plus full storage TAR were hashed, restored into
  another DB/storage pair, and restored again from the original backups after
  recovery to prove rollback. Public-table row JSON and enumerated non-dot
  task-data file-content hashes matched. This comparison does not prove schema,
  sequence, filesystem metadata or hidden-control-file equivalence.
- Before repair, real API health and admission both returned503 and admitted
  no new task. A separate genuine storage owner caused `TASK_STORAGE_BUSY` even
  when the input observation was deliberately made permissive for this negative
  test. Eight further safeguard/rollback cases passed: active-writer observation,
  missing-backup evidence, stale observation, wrong backup hash, storage drift,
  immutable runtime identity, stale task allowlist, and injected transaction
  failure. The raw recorder's aggregate `negativeCases:5` is stale; the retained
  detailed eight receipts and derived verification summary establish the count.
- Restored-copy maintenance changed only process references plus state version
  and update timestamp. Other table rows and enumerated files stayed unchanged.
  It held the actual storage owner fence, advisory leader/quota locks and task
  row locks, retained NULL origin identities, and left terminalization, quota
  release and file cleanup to the unchanged Service path.
- Recovery produced four `failed/WORKER_INTERRUPTED` tasks, each with exactly
  one terminal event and usage row. The sending marker retained
  `delivery:unknown` / `unknown_after_interruption`. All queue slots returned;
  three received originals remained at291 bytes each, exactly matching held
  and used storage. The original expiry timestamps were unchanged.
- Reapplying the stale repair allowlist failed without further change; after an
  API container recreation, task rows, usage, file hashes and old job/output
  counts remained identical. A new real HTTP request returned200 with a valid
  one-page PDF, and health returned200. The legacy fixture had no pre-existing
  generation-job or document-output rows; populated legacy job/output recovery
  branches are not established by the unchanged zero counts in this rehearsal.
- A lab-only SQL clock advanced4hours to exercise TTL cleanup. No expiry or
  identity trigger was disabled or rewritten. All five tasks, including the
  new successful request, ended with held/used bytes0 and cleanup done. This is
  not a real three-hour wall-clock soak.

The final proof passed after retained harness prerequisite failures: a missing
fixture section constant, readiness checking during DB initialization, an
overly strict assertion rejecting the lab's read-only credential bind, a stopped
DB on resume, and a bytes/string mismatch in the negative-error recorder. These
were lab-script corrections, not product fixes or passing initial runs.
A separate read-only evidence review found no blocker for the bounded result.

All owned containers from both rehearsal attempts are stopped; backups, volumes,
images and evidence are retained. Production container identities, images,
start times, restart counts and mount sets matched before/after. This does not
prove production row integrity or zero transient load on the shared Oracle VM.
No production SQL/storage access or repair, release/tag, push, installation,
package installation on the host, or production runtime switch was performed.

Report, derived summary, original raw receipts, synthetic backups, executable
rehearsal scripts and SHA256 manifest are retained at:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-legacy-recovery-20261030/verification-report.html`.
Raw Oracle evidence remains under
`/home/ubuntu/flowdoc-audit-187957aecc2d/legacy-rehearsal-b859ffbbd5fd`.
This round ran the bounded rehearsal, not a fresh full Service/Core suite.

### Future real-data recovery plan — separately authorized work only

1. Inventory actual affected task IDs, storage mappings, linked jobs/outputs and
   delivery evidence. Retain quarantine when origin or delivery cannot be
   established. The current lab's synthetic state markers and absent linked
   job/output rows do not replace populated real-scope rehearsal.
2. Agree a maintenance window, close intake and prove all writers across hosts,
   containers, subprocesses and DB sessions are stopped. The lab's label-based
   inventory and same-application session exception are not a general production
   writer inventory; do not reuse those assumptions as production guarantees.
3. Take consistent DB and every referenced storage backup as one checkpoint,
   retain an immutable off-host copy, and prove restore against the authorized
   real-scope copy, including required job/output, schema/sequence and metadata
   checks. Never pair a restored DB with storage from another checkpoint.
4. Review an exact row/file allowlist with expected state/lease/version hashes
   and delivery uncertainty. Following separate authorization, use exclusive
   maintenance ownership and quota/task lock order; never backfill origin
   identity, infer send success or automatically replay/resend tasks.
5. Let normal recovery reconcile terminal state and reservations, verify one
   terminal/usage record per task, retained-file accounting and health/admission,
   then reopen intake only after the authorized scope passes. On mismatch stop
   and use the rehearsed matched DB/storage restore route.

The requested disposable rehearsal is complete. Real legacy tasks remain
quarantined and unmodified; their inventory, backups, writer shutdown, populated
restore rehearsal and repair are not authorized by this result. Release and
installation remain separate future authorizations.

## Legacy linked-job/output rehearsal — 2026-10-30 follow-up

The owner explicitly authorized extending the Oracle synthetic rehearsal to
legacy tasks with linked jobs/outputs, keeping real data, release and installation
out of scope. Owner: Service; roles: Evidence Reviewer and Project Control
Steward. This is bounded single-room verification, routine risk within a fresh
disposable lab; execution/Work/Phase/Checklist IDs N/A. Product candidate843bd02
and the prior runtime image/source equivalence remain unchanged. Allowed scope
is ignored lab scripts/fixtures, a durable evidence report and this existing
record. No implementation, migration, new registered execution or product-map
promotion is involved.

The acceptance target was four PDF cases with actual PostgreSQL task/job/output
relationships: queued job, running job, succeeded job with output present, and
succeeded job with output already missing. The same backup, exclusive maintenance,
normal recovery, container recreation, TTL and rollback procedure was reused.
Prior eight negative-safeguard proofs remain reusable within their lab-specific
scope; this follow-up did not rerun them or either complete product suite.

**PASS for the four synthetic linked cases.** New lab
`flowdoc-legacy-jobs-86366371bab0` used its own PostgreSQL18 databases, task-storage
volumes and internal network, without published ports. Real intake/normalization
produced four originals/normalized inputs. Four linked generation jobs and two
output metadata rows were inserted under the actual schema/immutable-pin
triggers, with explicit synthetic process/state/send markers and NULL runtime
origin. The present output reused the preceding rehearsal's valid one-page PDF;
the missing-output case retained metadata but deliberately omitted the file.
This is not proof of historical transmission or recipient behavior.

| Scenario | Job after recovery | Generation / delivery usage | Output after cleanup |
| --- | --- | --- | --- |
| Queued | failed / WORKER_INTERRUPTED | not_started / not_started | none |
| Running | failed / WORKER_INTERRUPTED | interrupted / not_started | none |
| Succeeded, file present, sending marker | succeeded | succeeded / unknown | expired/deleted |
| Succeeded, file absent, sending marker | succeeded | succeeded / unknown | expired/deleted |

All four tasks terminalized once as failed/WORKER_INTERRUPTED with one terminal
event and usage row each. Runtime/storage origin stayed NULL. Job input/prepared
data, task/template/Core pins and output identity/path/hash/size/format/page count
were retained. Existing succeeded generation did not become delivery success.
Original expiry timestamps were unchanged. Queue slots returned and held=used
matched four291-byte originals (1164bytes). After a lab-only SQL clock+4hours,
all five tasks including the new successful request had storage charges0 and
cleanup done, without rewriting expiry or disabling identity triggers.

Before repair health/admission were503 with no new task. First/repeat task and
linked-job/output receipts were byte-identical after actual API container
recreation: the four original job IDs and two original output IDs remained, with
no duplicate terminal/usage or additional job/output at those checkpoints. A new
HTTP request then returned200 and a parsed one-page PDF. The receipts do not
establish continuous absence of every possible transient duplicate execution.

Hashed DB/storage backups were restored and later restored again for rollback;
public-table row JSON and enumerated non-dot task-data contents matched the
source. Maintenance/repeat snapshots matched and changed only task process
references plus version/update timestamp. Lifecycle driver timestamp comparisons
use millisecond precision; no schema/sequence/metadata/hidden-control-file
equivalence is claimed. A separate read-only review found no blocker within
this bounded scope.

Initial recorder failures are retained: PostgreSQL int8 string versus JSON
number comparison, and a missing variable in the resume receipt after the
rollback snapshot had succeeded. The comparator was corrected without product
changes; final backup-hash/rollback assertions were checked independently and
passed. No claim is made that the initial command passed end-to-end.

All owned containers stopped; synthetic backups, volumes and evidence remain.
Observed production container identity/image/start/restarts/mounts matched
before/after, without production SQL/storage access. This does not prove
production row integrity or zero transient load on the shared Oracle host.
No product code, release/tag, remote, host package installation, installed
configuration or production runtime changed.

Report, scripts, original receipts, synthetic backups and file-hash manifest:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-legacy-linked-20261030/verification-report.html`.
Raw lab evidence:
`/home/ubuntu/flowdoc-audit-187957aecc2d/legacy-rehearsal-jobs-86366371bab0`.

The earlier missing linked-job/output fixture is now exercised for these four
PDF cases. DOCX, arbitrary corruption and real-deployment writer inventory,
consistent off-host backups, full-scope restore and actual repair are not
established or authorized here. The separately authorized real-data plan above
remains applicable; real legacy data stays quarantined and unchanged.

## Legacy DOCX linked-job/output rehearsal — 2026-10-30 follow-up

Owner request: repeat the four PDF linked-job/output cases for DOCX in a fresh
isolated Oracle lab, with no real data, release or installation. Owner: Service;
roles: Evidence Reviewer and Project Control Steward. Bounded single-room
verification, routine lab risk, execution/Work/Phase/Checklist IDs N/A. The
unchanged843bd02 candidate/runtime image and the established maintenance/backup
procedure are reused. Outputs are ignored lab scripts/evidence, one durable
report and this existing record; no product or migration changes are authorized.

**PASS for all four synthetic DOCX cases.** Fresh project
`flowdoc-legacy-docx-ed4d9017ffe6` uses separate PostgreSQL18 databases, task-storage
volumes and an internal network, without published ports. Four DOCX tasks have
real intake/normalized inputs and linked job/output rows accepted by the actual
schema/pin triggers. Historical process/send states remain explicit synthetic
markers and runtime/storage origins remain NULL. No historical sender or real
recipient is claimed. The output fixture is the prior passing Oracle suite's
`http-queue.docx`, SHA256
`1e4f8ea1459330997e064d873bacd53eae28b09f6a27d6be8b2af739c408cfe9`,
matching that report's retained manifest.

- Queued/running jobs became failed/WORKER_INTERRUPTED; succeeded jobs with
  present or missing output stayed succeeded. Four tasks terminalized once,
  with one terminal event/usage each and no origin backfill.
- Both output rows became expired/deleted while retaining their job link,
  path, byte size, SHA256, DOCX format/MIME and NULL page count. Sending-marker
  usage kept generation succeeded but delivery unknown; PDF bytes/hash and
  page count remained NULL, rather than inventing PDF metrics or send success.
- Maintenance/repeat snapshots and first/repeat task plus linked-job/output
  receipts matched. The original four job IDs/two output IDs remained after API
  recreation, without duplicate terminal/usage or extra job/output at those
  checkpoints. This does not certify continuous absence of every transient
  duplicate execution. Repeat maintenance proves no additional change; its
  specific rejection diagnostic was not separately saved.
- Health/admission changed from503 before repair to200 after recovery. A new
  real DOCX request returned200. Its saved multipart attachment passed ZIP CRC,
  unique/safe-entry, required OOXML part/content-type and XML parse checks; the
  document contained the expected `Record 0` input. This does not establish
  native Word rendering/fidelity, pagination or field-refresh acceptance.
- Queue slots returned; held=used matched four291-byte originals (1164bytes)
  until the unchanged expiry. A lab-only SQL clock+4hours brought held/used to0
  and cleanup done for all five tasks including the new successful request.
  No expiry/identity trigger was disabled or rewritten; this is not a real
  three-hour soak.
- Source/restore/rollback public-table row JSON and enumerated non-dot task-data
  contents matched, with backup hashes verified. Maintenance changed only task
  process references plus state version/update timestamp. Lifecycle timestamp
  comparisons use driver millisecond precision; no schema/sequence/metadata or
  hidden-control-file equivalence is asserted.

The full rehearsal command completed PASS in this run; no failed prerequisite
was observed in the execution transcript. A separate read-only review found no
blocker in the scripts/receipts within this scope; the local DOCX ZIP/XML/content
assertions additionally validate the actual saved attachment. Prior eight
negative safeguards remain reused, not rerun. No full product suite was rerun.

All owned lab containers stopped and synthetic backups/evidence remain.
Production container identity/image/start/restarts/mounts matched before/after.
No production SQL/files, release/tag, push, host installation, installed settings
or production runtime changed. This boundary is not production row-level
integrity proof or a guarantee of no transient shared-host load.

Report, executable scripts, original receipts, DOCX fixture/new attachment,
synthetic backups and SHA256 manifest:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-legacy-docx-20261030/verification-report.html`.
Raw lab evidence:
`/home/ubuntu/flowdoc-audit-187957aecc2d/legacy-rehearsal-docx-ed4d9017ffe6`.

The requested four linked-job/output scenarios now have separate PDF and DOCX
rehearsal evidence. Arbitrary corruption, native Word fidelity, complete real
writer inventory, consistent real-data/off-host backups and actual repair are
outside these proofs. Real data remains quarantined and untouched; release,
installation and real-data recovery still require separate authorization.

## Real-data recovery review plan prepared — 2026-10-30

The owner next authorized preparing the real-data checklist/plan for review
only, without accessing or changing real data, release or installation. The
review document is
[รายการตรวจและแผนกู้งานเก่า FlowDoc สำหรับทบทวน](flowdoc-legacy-recovery-review-plan-2026-10-30.md).
Owner: Project Control for the shared plan; Service remains implementation
owner. Roles: Planning Partner and Project Control Steward. Single-room document
work; execution/Work/Phase/Checklist IDs N/A. Product code is unchanged.

The plan separates future read-only inventory authorization, maintenance/backup
authorization and actual repair approval. Actual runtime/schema/storage,
affected tasks, writers, delivery evidence and backup locations remain
unverified/TBD. It specifically blocks assuming the lab candidate/migration027
is installed, silently installing it, or copying the lab's label/application-name
writer exceptions into production. It covers matched DB/storage backups,
off-host retention, actual-scope restore proof, per-task allowlists, exclusive
maintenance and lock order, normal cleanup/expiry effects, acceptance checks
and rollback before versus after intake reopens.

Local source review also confirmed that normal task sweep has no repair
allowlist and startup runs other cleanup/recovery paths. The plan therefore
separates direct-repair rows from the full runtime mutation/dispatch impact set,
requires its inventory, rehearsal and explicit approval or proven isolation,
and blocks runtime handoff before that boundary is established. A separate
read-only review raised this scope gap; a bounded re-review confirmed that the
plan correction resolves it. No product behavior was changed.

This is review-ready planning, not production readiness or permission to begin
inventory/maintenance/repair. This round uses only local repository and retained
synthetic evidence. No Oracle connection, production inspection, SQL/filesystem
repair, service lifecycle change, release/tag, push or installation is performed.
Verification is scoped to source/evidence consistency, document links, review
coverage, generated projections, data validation and whitespace; no runtime or
product suite is needed for this documentation-only change.

## Authorized live Oracle read-only inventory — 2026-10-30

The owner then explicitly authorized read-only inspection of live Oracle
runtime/schema, storage and pending work. Data changes, stopping services,
release and installation remain forbidden. Roles: Evidence Reviewer and
Project Control Steward; bounded single-room discovery, execution IDs N/A.
This changes the authorization for this inventory only; previous document-only
rounds remain historical and did not access production.

The identified app `flowdoc_oracle052-api-1` connects to the inspected dedicated
DB container and database `flowdoc` / schema `public`. Queries used SELECT in
REPEATABLE READ READ ONLY transactions with statement timeout5s and lock
timeout750ms, followed by ROLLBACK. A separate query using the app's actual
DATABASE_URL inside its container confirmed the database/schema and readonly
mode without exposing the URL or credentials. No Service migration command,
application startup, document request, worker restart or lifecycle change ran.

Observed live results:

- Service/Core0.5.2; PostgreSQL18.6. API image
  `sha256:227b2fd239283254eced9f51114161afad71a49d9f00db708e5c9c0b0a35571f`
  differs from the lab image. The actual Core archive hash matches647235de…
  and its recorded pin; native rendering was not invoked.
- Applied migrations1–26 through `026_task_file_names.sql` match runtime files
  and local release25e912f checksums. Migration027, its origin columns/guard
  and `dist/tasks/ownership.js` are absent. Other existing guards are present;
  none were disabled or changed. Lab repair is not compatible as-is.
- At12:12:47Bangkok on the app connection: tasks0, pending tasks0 and
  queued/running generation jobs0. Earlier metadata snapshot reports37
  historical jobs (36succeeded/1failed) and36expired output rows. The failed
  historical job is terminal, not an identified stuck task; its cause was not
  investigated. Task reservations/held slots/bytes and upload sessions were0.
- Tasks/uploads/fonts map to the persistent staging volume; outputs map to
  the persistent output volume. Task/output roots had0 immediate entries;
  font/upload roots contain directories. Render temp is in the container layer.
  No customer document contents were read. Runtime JSON, migration/code hashes
  and Core archive bytes were read; the raw `fileContentsRead:false` flag refers
  to document data, not runtime metadata files.
- GET /health returned200; no admission/render request was sent. Only the API
  was found among running Docker containers sharing its app volumes. This is
  not complete writer inventory, quiescence, backup integrity or volume-capacity
  acceptance. Shared backing-filesystem free space must not be summed per root.

Recorded container identity/image/start/restart counts/mount sets match before
and after when mount order is normalized; the initial order-sensitive comparison
failed only on mount ordering. This does not claim zero access-time/audit/stats
effects, zero transient host load or continuous absence of work. Services stayed
running and query/filesystem snapshots were live and separate. Other databases,
schemas, backups and external writers were not exhaustively inspected.

No recovery target was found in the configured app DB/schema snapshots. Do not
repair data or install027 merely to advance the old checklist. The recovery
review plan now records A1 authorization/inventory and partial A2/A3 evidence,
while compatibility, maintenance/backup/repair approvals remain unresolved.
Earlier instructions to retain quarantine were conservative recovery boundaries,
not a verified live count of affected rows. This inventory supplies the first
live evidence in this follow-up that the inspected target has no pending work;
it does not rewrite earlier synthetic results or claim other targets are empty.
A separate local read-only evidence review found no blocker for these bounded
inventory claims.

Local report, raw filtered inventory, query source, app-connection verification,
compatibility comparison and SHA256 manifest:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-production-readonly-20261030/verification-report.html`.
No backup/export of customer documents, SQL/storage repair, release/tag, push,
installation or Oracle service restart/stop was performed.

## Historical failed preview investigation — read-only, 2026-10-30

The owner authorized investigating the one failed job on Oracle, still
read-only without data changes, stopping services, release or installation.
Roles: Evidence Reviewer and Project Control Steward; bounded single-room
discovery, execution IDs N/A. Queries selected error/layout metadata and
server-side equality booleans, not document text or full input/definitions.

**Confirmed:** job `01a175d8-d591-746c-b8fb-950182a1a6a0` is a model18 PDF
authoring preview of template `626ab2e8-77c4-47b0-a7d8-e852b872c267`, revision1.
It was created on2026-10-26 at08:35:06Bangkok and finished at08:35:07 with
`LAYOUT_FAILED`, path `nodes.section-main~band-header~page`, section `main`.
It has no task_id, no published template-version ID and no output row. It is
terminal history, not a queued legacy task or an interrupted reservation.

The failing header page-number block uses compact layout and body style:
font9.1pt, lineHeight10.5pt, two12pt number slots in the same8:1 columns.
Revision2 uses band style at the same font size and lineHeight16pt and has two
recorded successful jobs with one output row each, at08:36 and08:40Bangkok.
The original request equals the first successful job's input (compared in DB,
boolean only). Page styles are equal except lineHeight; header structure is
equal after excluding style references; pageLayouts/book also match. The whole
definition still differs elsewhere, so this is not a controlled single-change
reproduction. Later output metadata does not establish PDF content/page count.

**Probable cause:** insufficient line-height reserve for the header's page
numbers in revision1. Current matching Core source checks both number ink width
and ascent+descent against the reserved slot/lineHeight in
`src/layout/fillContentsNumbers.ts:9`; compact page fields call that check and
must fit one line. The revision change and later successes support this
explanation, but do not prove the exact historical failing predicate or a
product defect. No original request was replayed.

**Unverified:** native measurements and exact runtime/font identity at the
historical execution, original detailed LayoutError and required minimum
lineHeight. Stored error is the generic Service layout message. The current
container started on27Oct, after this26Oct job; its bounded15-second log window
returns no entries. Older containers/log stores were not searched exhaustively.
Current source behavior is supporting evidence, not proof of the historical
emitter version. A separate local read-only review accepted these classifications.

Queries used the same READ ONLY transaction/timeout/ROLLBACK boundaries.
A related-job lookup initially compared a text preview ID with a UUID cast;
the read-only query failed and was corrected. No job or schema was changed.
API/DB IDs/images/start times/restart counts matched before/after; the final
live snapshot still showed pending tasks0/jobs0. Read activity may have normal
audit/access-time/statistics effects; no zero-side-effect claim is made.

No recovery, historical deletion, resend, template fix or runtime change is
justified by this completed preview record alone. The later successful revision
already exists; further causal proof would require separately scoped controlled
replay in a lab, not rerunning customer work on production.

Report, filtered diagnostics/geometry, revision comparisons, exact read-query
sources, final boundary and SHA256 manifest:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-failed-job-20261030/verification-report.html`.
No application data, services, release/tag, remote or installation changed.

## จุดกลับมาทำต่อ — เจ้าของขอสรุปเก็บไว้ 2026-10-30

เจ้าของแจ้งว่าอาจไม่อยู่ระยะหนึ่ง และยืนยันให้สรุป/เตรียมจุดกลับมาทำต่อเท่านั้น
ขอบเขตรอบนี้จึงไม่รวมการเดินงาน labเพิ่มระหว่างไม่อยู่. รอบนี้เป็นการเก็บสถานะใน Project Control
โดย Steward; execution IDs N/A ไม่เปิด Work/registryเก่ากลับมา ไม่เริ่ม background
monitor หรือทดสอบใหม่ และไม่เชื่อมต่อ Oracleเพิ่มเพื่อเตรียม checkpointนี้.

### สถานะที่กลับมาแล้วควรอ่านก่อน

- Service F1–F6 อยู่ใน development `codex/template-registry` ที่843bd02;
  Core development `codex/template-binding` อยู่1817efa. ตรวจ Git refsในเครื่อง
  รอบcheckpointนี้แล้ว; Service release25e912f และ Core release55315caคงเดิม.
  Development integration ไม่ใช่ release หรือการติดตั้งบน Oracle.
- ซ้อมกู้งานไม่มี origin ในlabแล้ว รวม linked job/outputทั้งPDFและDOCXอย่างละ
  4เคส พร้อมrepeat recovery, recreate, reservations/TTL และbackup rollback.
  ผลจำกัดตามfixtures ไม่รวมทุกข้อมูลเสียหายหรือWord visual fidelity.
- Live Oracleล่าสุดที่สำรวจแบบอ่านอย่างเดียวเมื่อ30ต.ค.: Service/Core0.5.2,
  schemaถึง026 ไม่ใช่image/ownership027ที่ซ้อม. App DBflowdoc/publicพบtasks0
  และpending jobs0; snapshotท้ายการตรวจfailureยังได้pending tasks/jobs0.
  นี่เป็นข้อมูลตามเวลาสำรวจ ไม่รับรองว่าจะยังเหมือนเดิมเมื่อกลับมา.
- Failed jobหนึ่งรายการเป็นpreviewPDFrevision1เก่าของ26ต.ค.ที่LAYOUT_FAILED
  ตรงเลขหน้าheader มีrevision2สำเร็จสองjobแล้ว. LineHeight10.5→16ptเป็น
  probable causeที่มีหลักฐานสนับสนุน ยังไม่ใช่root causeที่reproduceยืนยัน.
  ไม่พบเหตุให้กู้คิว ลบประวัติ หรือส่งงานนี้ซ้ำจากหลักฐานปัจจุบัน.

### จุดอ่านและหลักฐานที่เก็บไว้

1. อ่านส่วนท้ายของบันทึกนี้: live read-only inventory และfailed preview investigation.
2. อ่าน [แผนกู้ข้อมูลจริง](flowdoc-legacy-recovery-review-plan-2026-10-30.md):
   28รายการ โดยA1ได้รับอนุญาตและสำรวจแล้ว ส่วนA2/A3มีหลักฐานบางส่วน;
   maintenance/backup/repair/reopenยังไม่ได้อนุมัติหรือทำจริง.
3. เปิดรายงานตามlocatorsในแต่ละส่วนด้านบน: PDF linked, DOCX linked,
   production read-only inventory และfailed-job investigation. ตรวจSHA256
   manifestsทั้ง4ชุดอีกครั้งในเครื่องรอบcheckpointนี้แล้ว ลิงก์และraw evidenceยังอยู่.
4. เก็บaudit worktrees/ignored scriptsและlab evidenceเดิมไว้สำหรับreproduction;
   ไม่ลบหรือcleanupทรัพยากรเดิมในรอบcheckpointนี้. Lab containersหยุดตาม
   หลักฐานปิดรอบก่อน ไม่ได้ตรวจhostซ้ำในรอบนี้.

### เมื่อต้องการกลับมาทำต่อ

- เริ่มจากProject ControlและตรวจGit/ข้อมูลล่าสุดก่อน อย่าใช้snapshot30ต.ค.
  เป็นข้อเท็จจริงปัจจุบันหรือเปิดexecutionเก่ากลับมา.
- ให้เจ้าของเลือกขอบเขตใหม่: หากมีงานค้างใหม่ให้สำรวจแบบอ่านอย่างเดียวภายใน
  อำนาจที่มีอยู่ก่อน; หากต้องพิสูจน์failureเก่าจริงให้กำหนดcontrolled replayในlab
  แยก; Word visual acceptanceเป็นงานอีกขอบเขตหนึ่ง ไม่ได้ทำไว้แล้ว.
- ไม่ต้องเพิ่ม027หรือซ่อมข้อมูลเพียงเพื่อปิดchecklistที่ไม่มีงานเป้าหมาย.
  หากต้องเปลี่ยนruntime/schema ให้แยกแผนและอำนาจrelease/installationจากrecovery.
- คงข้อห้ามเดิม: ไม่แก้ข้อมูลจริง ไม่หยุดบริการ ไม่release/tag/pushหรือติดตั้ง
  จนกว่าจะได้รับอนุญาตตรงขอบเขตนั้น; การอนุญาตอ่านอย่างเดียวไม่ใช่การอนุมัติซ่อม.

Checkpointนี้ส่งมอบสถานะและเส้นทางกลับมาทำต่อครบ ไม่มีงานปฏิบัติการใหม่ที่
กำลังดำเนินการให้เจ้าของต้องเฝ้าต่อ และไม่ได้ตั้งงานอัตโนมัติระหว่างเจ้าของไม่อยู่.

## กลับมาตรวจสถานะก่อนทำต่อ — 2026-10-30 เวลา13:50ไทย

เจ้าของกลับมาและขอตรวจสถานะล่าสุดก่อน โดยคงการห้ามแก้ข้อมูลจริง หยุดบริการ
releaseหรือติดตั้ง. รอบนี้เป็น bounded read-only status refresh โดย Evidence
Reviewer/Project Control Steward; execution IDs N/A ไม่เปิดexecutionเก่ากลับมา.

ตรวจlocal refsแล้ว Service development843bd02/release25e912f และ Core
development1817efa/release55315caตรงcheckpointเดิม; checkoutsที่ตรวจสะอาด.
ไม่ได้fetch/pushหรืออ้างว่าได้ตรวจremote Git refs. Oracle queryณ
`2026-10-30T06:50:07.003561Z` (13:50:07เวลาไทย) ใช้READ ONLY transaction
พร้อมtimeoutsและROLLBACKตามวิธีที่อนุญาตเดิม พบ DBflowdoc/public:
tasks0, pending tasks0, queued/running jobs0, reservations/held bytes/used bytes0.
Job historyยังเป็น36succeeded/1failed; ไม่ได้ตรวจfailureเดิมซ้ำในรอบนี้.

Service/Coreยัง0.5.2, PostgreSQL18.6; migrations26รายการ/checksumsตรงกับ
snapshotเดิมถึง026 ไม่มีruntime origin columns/027. GET /health200เป็นเพียง
readiness observation ไม่ได้ทดสอบadmissionด้วยการสร้างงาน. API/DB container
IDs/images/start/restart countsตรงเดิมและคงที่ระหว่างตรวจ ทั้งคู่ยังrunning.
ไม่แก้ข้อมูล ไม่หยุด/restartบริการ ไม่release/tag/pushหรือติดตั้ง.

หลักฐานใหม่และquerysourceพร้อมSHA256 manifestเก็บที่
`C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/audit-f5-f6-20261027/artifacts/oracle-audit-20261030/resume-readonly-20261030-a67225`.
ไม่เขียนทับรายงานเดิมหรือเปิดlabรอบใหม่. Snapshotนี้ยังจำกัดเฉพาะapp DB/schema
และเวลาที่ตรวจ ไม่ใช่writer quiescence/backup proofหรือการรับรองว่าจะไม่มีงานใหม่.

ยังไม่พบงานเป้าหมายให้กู้ในtargetนี้. งานที่อาจเลือกขอบเขตใหม่ต่อคือ controlled
lab replayเพื่อพิสูจน์สาเหตุpreviewเก่า หรือWord visual acceptance; ทั้งสองยังไม่
เริ่มในรอบstatusนี้. แผนกู้จริงยังต้องผ่านcompatibility/backup/maintenance/repair
ตามอำนาจที่แยกไว้ก่อน ไม่เพิ่ม027หรือเปลี่ยนruntimeเพียงเพื่อปิดchecklist.

## Controlled lineHeight comparison — isolated Oracle lab, 2026-10-30

The owner authorized a separate Oracle lab to determine whether10.5 versus16pt
lineHeight alone changes the preview result, with no production data access or
changes, service interruption, release or installation. This single-room
verification uses synthetic content and retained geometry only; roles: Evidence
Reviewer and Project Control Steward, execution IDs N/A. Proof budget: one
native digit probe, four alternating full Core renders and two Service wrapper
renders, then PDF inspection and local evidence review. No product source edits
or complete-suite reruns are needed for this causal comparison.

**Confirmed in the synthetic fixture:** templates differ at exactly
`/styles/band/lineHeightPt`; input and every font hash are unchanged. Core runs
10.5→16→10.5→16 produce failure→success→failure→success. Both failures preserve
`Page number ink does not fit the reserved slot` at the header page-number node.
The unchanged Service render wrapper also fails at10.5 with
`nodes.section-main~band-header~page` / genericLAYOUT_FAILED, matching the stored
historical signature, and succeeds at16. All three successful PDFs are
byte-identical, one page, and contain the expected synthetic body andPage1of1.

The real native shaper for bundled Sarabun normal
`b8150084e25734e6f31696c57ff009f5564efa09d295848b717d9e2328c0311d`
reports ascent1068/descent-232 at1000units/em for digit1. At9.1pt, Core's actual
decode convention yields ascent9.7188/descent2.1112, total11.83pt. Its width
extent is5.005pt, below the12pt slot. The required line box exceeds10.5pt and
fits within16pt for this fixture. **11.83pt is the Core font line box, not visible
digit ink height**; the raw glyph ink is6.37pt tall. This is not a universal
minimum leading for arbitrary fonts, sizes or content. Core's existing guard
is operating as implemented; the observation does not establish a product bug.

The model18 fixture uses synthetic text/date, A4landscape margins18pt,
header8:1columns/gap12pt and compact12pt current/total slots. Body style is
unchanged20pt; only the header band style lineHeight changes. It is not the
customer's original template/input, and historical font/runtime identity was
not recovered. Therefore the historical job's exact cause remains probable;
what is now proven is the compatible causal mechanism in a controlled fixture.

Lab `flowdoc-lineheight-9fc1586a9e83` uses the previously observed release image
`sha256:227b2fd239283254eced9f51114161afad71a49d9f00db708e5c9c0b0a35571f`,
Service/Core0.5.2 and Corearchive647235de… . Its1GiB/1CPU container has networknone,
no DB configuration, no ports and only its own lab-directory bind mount. Core
public exports and native resources are real; no mocks/internal Core imports
or source changes. The script completed once; container exited and remains
stopped. Production container metadata matched before/after; only Docker
metadata was read, not production DB/documents. Normal host/audit/resource
effects on a shared Oracle VM are not claimed to be zero.

Successful PDF was parsed and rendered with Poppler; full-page inspection shows
the complete header/page number and body without observed clipping. The same
bytes cover all three PDFs. A separate read-only review accepted the controlled
comparison and required the line-box versus ink-height distinction above.

Report, synthetic templates/input, executable scripts, font/native measurements,
Core/Service raw results, PDFs/PNG and SHA256 manifest:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-lineheight-20261030/verification-report.html`.
Remote lab evidence is retained at
`/home/ubuntu/flowdoc-audit-187957aecc2d/flowdoc-lineheight-9fc1586a9e83`.
No real-data replay/repair, service stop/restart, template update, release/tag,
push, installation or new host package was performed. Stop at this proven scope;
exact historical replay and any template/engine fix require a new explicit scope.

## จุดกลับมาทำต่อหลังพิสูจน์ lineHeight — 2026-10-30

เจ้าของขอเก็บสถานะ หลักฐาน และรายการที่ยังติดไว้ก่อน รอบนี้เป็นการบันทึกใน
Project Control เดิมเท่านั้น โดย Project Control Steward; execution/Work/Phase/
Checklist IDs N/A. ไม่เปิด execution เก่า ไม่เริ่ม lab/monitor/background work
และไม่เชื่อมต่อ Oracle. ขอบเขตเอกสารหนึ่งไฟล์; ตรวจ local refs, evidence hashes,
diff และข้อมูล Project Control โดยไม่รันทดสอบผลิตภัณฑ์ซ้ำหรือเปลี่ยน source.
บันทึกนี้เป็นทางกลับมาทำต่อ ไม่ใช่การรับรอง production readiness หรือคำอนุมัติซ่อม.

### สถานะที่เก็บไว้

- ตรวจ local Git refs รอบนี้: Service development `codex/template-registry`
  `843bd0204b424f32cf7fed8a8ebaab6964a33388`; release `25e912f`.
  Core development `codex/template-binding` `1817efa`; release `55315ca`.
  ไม่ fetch/push และไม่อ้างว่าเป็นสถานะ remote ล่าสุด.
- F1–F6 รวมใน development แล้ว หลักฐาน Oracle lab ชุดเต็มเดิม: Service
  729 passed / 0 failed / 3 skipped และ Core 1268 passed / 0 failed / 0 skipped.
  สามช่องว่าง Service ทดสอบเสริมภายหลังผ่านทั้งหมดใน focused module 4/0/0;
  ไม่ใช่การรันชุดเต็มใหม่ 732 ผ่าน. F4 ผ่าน 12 controlled schedules โดย
  deadlock counter ไม่เพิ่ม ไม่รับรองทุก concurrency schedule.
- ซ้อม legacy recovery และ linked job/output ของ PDF/DOCX อย่างละ 4 fixtures
  รวม recovery ซ้ำ, recreate, reservations/TTL และ matched DB/file rollback.
  ผลจำกัดตาม fixtures; TTL ใช้ logical clock ไม่ใช่ wall-clock soak.
  ยังไม่รับรองหน้าตา/pagination/field refresh ใน Word.
- Controlled lineHeight proof เสร็จแล้ว: เปลี่ยนเฉพาะ header lineHeight
  10.5/16 pt ได้ failure/success ใน Core สลับ 4 รอบและ Service อีก 1 คู่.
  Core font line box 11.83 pt เกิน 10.5 แต่พอดี 16; ไม่ใช่ visible ink height.
  ยืนยันกลไกใน synthetic fixture ไม่ใช่ exact replay ของ preview เก่า;
  historical font/runtime และรายละเอียด error เดิมยังไม่ครบ.
- Live SQL snapshot ล่าสุดที่มีหลักฐานคือ **30 ต.ค. 2026 เวลา 13:50:07 ไทย**
  จาก app DB `flowdoc/public`: tasks/pending tasks/queued-running jobs/
  reservations เป็น 0; ประวัติ jobs 36 succeeded / 1 failed.
  Service/Core 0.5.2, PostgreSQL 18.6, migrations ถึง 026 ไม่มี ownership027.
  รอบ checkpoint นี้ไม่ได้ตรวจ live ซ้ำ จึงไม่รับรองว่าจะยังไม่มีงานใหม่.
- Failed job เก่าเป็น preview ที่จบแล้ว ไม่มี task/output ผูกอยู่ และมี revision2
  สำเร็จภายหลัง ไม่ใช่หลักฐานให้กู้คิว ลบประวัติ หรือส่งงานนี้ซ้ำ.
  Lab containers หยุดตาม receipts ของแต่ละรอบ ไม่ได้ตรวจ host ซ้ำตอนเก็บบันทึก.

### หลักฐานและจุดอ่าน

อ่าน [แผนกู้ข้อมูลจริง 28 ข้อ](flowdoc-legacy-recovery-review-plan-2026-10-30.md)
คู่กับส่วนหลักฐานด้านบน. A1 ผ่าน; A2/A3 มีหลักฐานบางส่วนแต่ยังไม่ผ่าน readiness
สำหรับ repair. ช่องอื่นยังไม่ผ่าน ไม่ทำเครื่องหมายเพิ่มเพราะ synthetic tests ผ่าน.

รายงานแต่ละชุดมี `verification-report.html` และ `evidence-manifest.json` ภายใต้
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/`:

| โฟลเดอร์ | หลักฐาน |
| --- | --- |
| `flowdoc-oracle-20261030` | F1–F6, complete suites และ development integration |
| `flowdoc-oracle-height-guard-20261030` | สามเทสต์เสริมที่เคยข้าม |
| `flowdoc-oracle-legacy-recovery-20261030` | Legacy recovery พื้นฐานและ rollback |
| `flowdoc-oracle-legacy-linked-20261030` | PDF linked job/output 4 เคส |
| `flowdoc-oracle-legacy-docx-20261030` | DOCX linked job/output 4 เคส |
| `flowdoc-oracle-production-readonly-20261030` | Runtime/schema/storage และ live inventory เดิม |
| `flowdoc-oracle-failed-job-20261030` | Historical preview investigation แบบอ่านอย่างเดียว |
| `flowdoc-oracle-lineheight-20261030` | Controlled causal proof, PDF/PNG และ native measurements |

ตรวจ hashes ของทั้ง 8 ชุดในเครื่องรอบ checkpoint นี้แล้ว: **295 ไฟล์ตรง manifest**.
Live refresh เวลา13:50 มี `snapshot.json`, `query.py`, `manifest.json` ที่
`C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/audit-f5-f6-20261027/artifacts/oracle-audit-20261030/resume-readonly-20261030-a67225`.
ตรวจสองไฟล์ตาม manifest นั้นด้วย. การตรวจ hashes ยืนยัน retained bytes เท่านั้น
ไม่ใช่การรันซ้ำหรือการยืนยัน live state ใหม่. เก็บ worktrees/scripts/evidence เดิม;
ไม่ลบหรือ cleanup ทรัพยากรในรอบนี้.

### รายการที่ยังติดก่อนกู้จริง และลำดับกลับมาทำต่อ

1. **เป้าหมายกู้:** ยังไม่พบงานค้างใน target ที่สำรวจ อย่าเริ่มซ่อมหรือเพิ่ม027
   เพื่อปิด checklist. เมื่อกลับมาให้ตรวจ canonical/local state ก่อน และถ้าต้อง
   สำรวจ live ให้ยืนยันขอบเขตอำนาจที่ใช้ในรอบนั้น ไม่ใช้ snapshot นี้แทนข้อมูลสด.
2. **Compatibility:** runtime/schema จริงยังไม่ตรงวิธี lab ที่ใช้027/ownership
   guard. ห้ามนำ script lab ไปรันตรง ๆ; การเปลี่ยน runtime/schema ต้องมีแผนและ
   อำนาจ release/installation แยก ไม่เป็นส่วนแฝงของ recovery.
3. **ขอบเขตข้อมูลและผลส่ง:** ยังไม่มี repair allowlist พร้อม row/file hashes,
   expected outcomes และ delivery assessment ของเป้าหมายจริง. ห้ามถือว่า output
   อยู่หรือ job succeeded แปลว่าผู้รับได้รับ และไม่ rerender/resend อัตโนมัติ.
4. **Writers และ runtime impact:** ยังไม่พิสูจน์ทุก writer/session/host ว่าหยุด
   และกลับมาเขียนไม่ได้; startup/sweep/cleanup ไม่จำกัดแค่ direct-repair allowlist.
   ต้องทราบ expected mutations และควบคุมขอบเขตก่อน handoff ให้ runtime.
5. **Backup/restore จริง:** ยังไม่มี DB+storage checkpoint เดียวกันที่ครบ schema,
   sequences/roles/grants, metadata/hidden control files พร้อม off-host copy และ
   restore/recovery proof บนสำเนาจริงที่ได้รับอนุญาต. Synthetic rollback แทนไม่ได้.
6. **ผู้รับผิดชอบและอนุมัติ:** ยังไม่กำหนด maintenance window, downtime,
   operator/reviewer, production tools/dry-run, abort/rollback และ reopen criteria
   พร้อมคำอนุมัติ backup/maintenance/repair/reopen ตามขั้น. ยังไม่เริ่มปฏิบัติการ.

หยุดที่ checkpoint นี้: ไม่แก้ข้อมูลจริง ไม่หยุด/restart บริการ ไม่ release/tag/
push หรือติดตั้ง และไม่มีงานใหม่ที่ตั้งให้เดินต่ออัตโนมัติ. เมื่อกลับมาให้อ่านส่วนนี้
กับแผน 28 ข้อก่อนเลือกขอบเขตถัดไป; ข้อจำกัดในอดีตยังคงประวัติ ไม่ถูกลบหรือ
ยกระดับเป็น PASS จากการเก็บสถานะครั้งนี้.

## Migration026→027 isolated Oracle rehearsal — authorized scope 2026-10-30

Owner authorized verification with synthetic legacy-shaped data only, including
upgrade failure and rollback. Owner: Service migration/runner; role: Evidence
Reviewer and Project Control Steward, single-room execution IDs N/A, routine
verification. This section is the bounded work authority; no old round reopened.
Use a fresh labelled Docker project, internal network, no published ports or
production mounts/DB connection; only inspect production Docker identity metadata
before/after. Product source, released migrations, real data, release/tag/push,
host installation and live-service stop/restart are forbidden.

Acceptance/proof budget: one synthetic026 seed with task/job/output relationships
and retained files; real unmodified migration runner/checksums; successful027
preserves existing rows and NULL origins, guard behavior and repeat migration;
checksum rejection, actual lock contention and an explicitly injected late
transaction failure leave no partial027/ledger mutation, then retry succeeds;
quiescent026 DB+storage backup restored into a separate disposable target after
successful upgrade, comparing rows, schema objects, sequence state and all files
including hidden metadata. Restore is backup recovery, not a down migration.
Compare actual lab image migration bytes with candidate. Record raw outcomes,
failures and gaps; stop owned containers on exit. Do not infer release readiness
or that synthetic restore satisfies production backup requirements.

Document budget: append result here and link one local evidence report; no new
Work/registry/map or product documentation. Checks: bounded lab script assertions,
evidence hashes, documentation diff and Project Control data validation. A failure
may justify bounded prerequisite/script corrections with each attempt retained;
rerun only for the demonstrated failure. Product defects are
reported before any source repair outside this verification scope.

### Result — bounded synthetic upgrade/restore PASS, 2026-10-30

Completed on Oracle VM PostgreSQL18/Docker using fresh project
`flowdoc-migration-9634dead32d9`. The actual old release image227b2fd seeded
001–026 through its unmodified runner. All first26 SQL byte hashes match the
development candidate; the existing verification image's actual27 migrations
also match candidate `843bd0204b424f32cf7fed8a8ebaab6964a33388` byte-for-byte.
No product code, migration SQL, package pin, installed deployment or release
changed. This is synthetic verification, not production installation acceptance.

The baseline contains49 public tables,5 tasks (awaiting_input, queued,
processing, sending with output present/missing),4 linked jobs,2 output rows
and10 files including hidden synthetic metadata. The file labelled legacy
metadata is a fixture marker, not a fabricated runtime ownership identity.
Real template registration, task intake/normalization and retained synthetic
PDF bytes were used; no production documents or DB connection were used.

| Criterion | Observed result |
| --- | --- |
| Normal026→027 | Only027 applied; old row contents preserved apart from added NULL origin columns; files and sequence metadata unchanged |
| Repeat migration | applied=[] and complete snapshot unchanged |
| Checksum mismatch | MIGRATION_MISMATCH before upgrade; no schema/data/file drift |
| Actual table lock contention | Held ACCESS EXCLUSIVE lock;350ms lock_timeout failed migration; PostgreSQL lab log confirms lock timeout; no partial027/ledger |
| Late transaction failure | Lab-only schema_migrations INSERT trigger raises after027 columns/function/trigger exist; NOTICE confirms this point; all027 DDL and ledger rolled back, then normal retry succeeds |
| Origin guards | Legacy NULL→pair update55000; half-pair INSERT23514; paired INSERT accepted; paired-origin change55000; ordinary no-op update accepted; probe transaction rolled back |
| Restore after committed upgrade | Quiescent pre-upgrade DB dump + storage tar restored into fresh DB/volume; all public-table rows, checked schema objects and files match026 baseline; old release runner accepts history without applying anything |
| Sequence | pg_sequences metadata matches; supplemental read explicitly confirms last_value17/is_called=true in both upgraded source and restored target |
| Isolation | Internal network, no ports, own labelled volumes/containers; no app/API/worker service started; production Docker identities/start/restart metadata stable |

Schema comparison covers columns, canonical constraint definitions, indexes,
triggers, function definitions, relation ownership/ACL, extensions and sequences.
File comparison covers hashes/size/mode/uid/gid/mtime, including the hidden marker.
No claim covers internal OIDs, physical DB layout, every global role/grant,
off-host storage, or all production metadata. PostgreSQL canonical constraint
deparse `pg_get_constraintdef(oid,true)` is used: raw CHECK deparse can regroup
AND parentheses during dump/restore. The two raw differences were inspected;
canonical definitions match without hand-stripping parentheses or ignoring guards.

Three unsuccessful full attempts remain retained:961049b4540e failed because
the reused synthetic helper lacked SID;2c08a11815d8 reached guard probes but the
test harness used pool.query across an error/transaction;5ae8fba992d8 reached
restore but compared raw CHECK parentheses. Corrections touched only this
round's fixture/harness, using a fixed synthetic UUID, a checked-out client and
PostgreSQL canonical deparse respectively. Each complete retry used a fresh lab.
The final9634dead32d9 run passed all actions. A supplemental read initially tried
row_to_json(sequence), which PostgreSQL rejects because sequences lack composite
types; corrected scalar-field reads passed, with the rejected query retained in
lab logs. These are test/prerequisite failures, not new product defects or PASS
claims for the unsuccessful runs.

All four attempts' owned containers are stopped; volumes/images/evidence remain.
The supplemental sequence/log check also ended with ownedRunning=[] and stable
production metadata. Shared-host resource/audit effects are not claimed zero.
No production SQL/storage access or repair, production stop/restart, release/tag,
push, host package installation or installed runtime switch occurred.

Report, source/SQL/image pins, backup files, raw failure/restore snapshots,
PostgreSQL lab log and71-file SHA256 manifest:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-migration-026-027-20261030/verification-report.html`.
Ignored local scripts/raw receipts remain under the Service audit worktree's
`artifacts/oracle-audit-20261030/migration-*`; remote final evidence remains at
`/home/ubuntu/flowdoc-audit-187957aecc2d/flowdoc-migration-9634dead32d9`.

**Next return point:** migration success/failure/backup restore is now proven for
these synthetic026 fixtures; no new product fix was needed. Do not confuse
transactional failure rollback with post-commit restore: there is no down
migration, and restoring old backup does not preserve hypothetical new writes.
027 deliberately leaves legacy origins NULL; it does not adopt or recover them.
This round did not start the upgraded application or test readiness/admission,
crash/connection-loss/disk-full schedules, large-table lock time/capacity, or a
production upgrade. Prior full suites were not rerun. The28-item real-recovery
plan keeps its existing status; no real targets/allowlist, writer quiescence,
matched real-data/off-host backups, authorized real-copy rehearsal or maintenance/
repair/reopen approvals have been supplied by this synthetic result. Latest
production SQL snapshot is still30Oct13:50Thai, not refreshed here.
Stop at the proven scope; no automatic follow-up, release or installation.

## Post026→027 app startup and admission — authorized scope 2026-10-30

Owner authorized isolated Oracle verification of the new application after027,
including legacy NULL-origin tasks, then local development integration if passing.
Owner: Service startup/task HTTP/processor; roles Evidence Reviewer/Project Control
Steward, single-room IDs N/A. Routine verification, not a production rollout.
Use fresh labelled Docker DB/storage and internal network only, no published
ports, production data/mounts/DB connections, release/tag/push or installation.
Local development already contains843bd02; do not fabricate a second merge.
Any newly necessary product fix must return to implementation and relevant checks
before integration; preserve unrelated changes and never alter applied migrations.

Acceptance/proof budget: seed real026 via old image; upgrade via actual candidate
CLI; start actual new server (no mocks). Test a ready profile including a terminal
NULL-origin historical task with fresh PDF and DOCX over HTTP, durable delivery,
job/output linkage, usage/events, identity pairs, reservations and health. Recreate
ready app once and send another canary. Separately start the migrated profile with
five legacy inflight tasks/linked outputs and unproven foreign process markers:
health/admission must both503, rejected requests must create no task/reservation,
legacy origins/state/jobs/files must not be adopted/rerendered/resend; recreate
once and repeat. Record expected startup cleanup separately from unsafe mutation.
Stop owned containers, compare production Docker metadata, retain raw receipts
and one report; append result here. No new full suite unless source changes or
new affected-area uncertainty requires it. Preserve/correct harness failures and
rerun only for a demonstrated prerequisite/failure. Document checks: evidence
coverage/hashes, diff, generation and check:data; keep real-recovery28 items pending.

### Result — app startup/admission PASS within synthetic profiles, 2026-10-30

Completed in fresh project `flowdoc-startup-5e160086261b` on Oracle VM using
PostgreSQL18, two private DB/storage profiles, no published ports and actual
Service server/CLI. The old release227b2fd seeded026. Actual candidate CLI applied
only027 to each DB; both final27-name/checksum ledgers match local843bd02 SQL.
Existing runtime image00980f7d (source3e21a5c) ran the actual server; direct Git
comparison to843bd02 differs only in `tests/pdf-files.test.mjs`, no runtime source.
Helper/runtime image IDs and executed script hashes are retained in the packet.

| Profile / criterion | Result |
| --- | --- |
| Ready026 with terminal legacy task | After027 actual app health200; historical failed task remains NULL-origin with same terminal reason/time and no generated job |
| Fresh PDF/DOCX over HTTP | Two200 multipart responses with closed boundary, real artifacts and matching receipt/DB SHA256/byte counts |
| Durable completion | Each new task/job succeeded, usage.delivery=succeeded, terminal event and usage once, one linked output; DOCX page_count remains NULL |
| Reservations | All3 successful canaries release queue slots and storage held/used bytes to0 |
| Ready app recreation | New container/runtime owner, same image/storage identity; health200 and third fresh PDF succeed; no old canary duplication |
| Inflight legacy026 with NULL origin | Five synthetic tasks have unproven foreign writer/child references; after027 actual app health503 and PDF/DOCX admission503 |
| Legacy app recreation | Second new container again health503 and admission503; four rejected requests total create no task/reservation/job |
| Legacy preservation | Seven task-domain tables equal upgraded baseline before/after both checkpoints; all10 original file hashes/sizes unchanged; no adoption/rerender/resend observed |
| Lookup | Actual POST /documents JSON taskId contract returns200 for completed canaries and while legacy admission is503 |

NULL origin alone is not a universal readiness failure: the terminal historical
row does not block ready-profile admission. The blocked profile additionally has
unproven foreign process markers. Neither profile fills historical origin values.
The legacy equality check covers tasks, generation_jobs, document_outputs,
task_resource_reservations, task_files, task_events and task_usage, not every
application table. Expected startup adds only `.runtime-id`, `.runtime.lock`,
`.storage-id`, `.writers.lock` under the task root in that fixture; do not claim
the whole filesystem is unchanged. Ready terminal-history cleanup may proceed
normally; critical terminal facts/origins remain preserved.

HTTP bytes were extracted by the actual multipart Content-Length/framing, tied
to artifact-event and DB hashes. Both PDFs are byte-identical, parse as one page
with expected synthetic text and pass full-page Poppler visual inspection with
no observed clipping/overlap. DOCX ZIP/XML/text are valid; native Word appearance,
pagination and field refresh remain outside acceptance. HTTP completion here
does not prove historical delivery to a real recipient.

Initial attempts are retained and not counted PASS. Projectf2d18e74f21c exited
before HTTP because the lab token was27characters, below the real parser's32
minimum; the actual parser reproduced the configuration rejection. Project
051b78b557ac delivered/persisted a PDF but the harness lookup used a nonexistent
GET route and got404. Only harness credentials/lookup were corrected to the
actual POST JSON contract, then a fresh final profile pair passed. No product
source, released migration, version or package pin was changed to obtain PASS.
All owned containers from all3 attempts are stopped; evidence/volumes remain.
Production Docker identity/start/restart metadata is stable; no production SQL,
storage access, stop/restart or runtime switch occurred. Normal shared-host
resource/audit effects are not claimed zero.

**Git integration decision after PASS:** local development
`codex/template-registry` already equals843bd0204b424f32cf7fed8a8ebaab6964a33388,
contains the tested candidate, and is clean. No new product changes or second
merge are necessary. Direct ancestry/source-diff checks are saved as
`development-integration.json`; Service release25e912f remains unchanged.
Retain the passing result in Project Control main; no remote fetch/push,
release/tag, deployment or installation is performed.
Do not describe this as a new Service commit or a newly merged product fix.

Report, CLI/server/container receipts, actual HTTP wire/PDF/DOCX, snapshots,
initial failures, Git integration receipt and92-file SHA256 manifest:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-postupgrade-startup-20261030/verification-report.html`.
Raw scripts/receipts remain under Service audit worktree
`artifacts/oracle-audit-20261030/startup-*` and remote
`/home/ubuntu/flowdoc-audit-187957aecc2d/flowdoc-startup-5e160086261b`.

**Next return point:** post-upgrade actual startup/readiness/admission is now
proven for these two synthetic profiles. No new runtime fix was needed. This
does not authorize legacy repair or certify high-load/soak, mid-request crash,
expiry recovery or production upgrade. Prior full suites are not new runs.
Real recovery28-item readiness remains unchanged: target allowlist, writer
quiescence, matched/off-host real backups and authorized real-copy restore,
maintenance/repair/reopen approvals are still separate prerequisites. Latest
production SQL snapshot remains30Oct13:50Thai; no refresh was performed here.
Stop at the accepted scope; no automatic follow-up, release or installation.

## Interrupted-work fault batch — authorized scope 2026-10-30

Owner authorized synthetic isolated Oracle tests: abrupt app-container removal
during active native processing; actual PostgreSQL app-session termination during
terminal write after completed HTTP delivery; client TCP reset after receiving
only part of the artifact. Roles Evidence Reviewer/Project Control Steward,
Service ownership, single-room IDs N/A, routine bounded verification. Use fresh
labelled DB/network/volumes, no published ports, no production DB/data/mounts or
service actions. Product source/migration/package changes, release/tag/push and
host installation are forbidden. Inspect production Docker metadata only.

Proof budget: one instance of each fault, actual client/DB checkpoints at the
fault boundary, terminal state + one usage/event/job, delivery evidence consistent
with observation, no automatic rerender/resend, queue release and storage charges
equal retained actual files (not forced zero), healthy fresh canary after each;
one final recreate/idempotence check. Lab-only advisory-lock trigger synchronizes
the terminal transaction; pg_terminate_backend cuts its actual checked-out
connection, not the entire DB service. Client fixture uses bounded synthetic
text and a small real TCP receive window to reach a partial-artifact checkpoint.
Preserve and correct demonstrated harness/prerequisite failures only. Limits:
app/helper1GiB/1CPU, DB512MiB/1CPU, native deadlines bounded; no host-wide faults.
Stop owned containers on exit, collect raw receipts/hashes, append one result
and link one report. No new Work/map/full suite without changed product scope.

### Result — FAIL: confirmed DB-disconnect availability defect; recovery verified

All three requested fault scenarios completed in isolated Oracle lab
`flowdoc-interrupt-267a224fa06b`. **Batch FAIL** is retained because one actual
application PostgreSQL connection loss terminates the API process. Other fault
and recovery criteria passed; successful recovery does not turn that defect
into PASS. No product source, migration SQL, package pin, release or installation
changed. Service candidate remains843bd02; runtime image00980f7d/source3e21a5c
has no runtime-source difference from843bd02 (only the prior test-fixture change).

| Fault/check | Observed result |
| --- | --- |
| App container killed | Real native-processing row/child captured, app paused and removed, same-image app recreated; failed/WORKER_INTERRUPTED, job failed, delivery not_started, no output/rerender |
| DB finalization connection cut | Client received complete valid PDF/closing boundary; actual success UPDATE blocked on lab-only advisory-lock trigger, its PostgreSQL session terminated; API exited1 with unhandled Client error |
| DB-cut durable state before recovery | Task sending, no usage; PostgreSQL log confirms FATAL administrator termination while UPDATE succeeded waited inside lab_hold_success |
| Recovery after DB-cut crash | New same-image container closes task WORKER_INTERRUPTED; job remains succeeded and no resend; durable delivery unknown/unknown_after_interruption despite separately retained complete client PDF |
| Client partial-artifact reset | Real TCP client received64of3,957,976PDF bytes while task sending and no usage; TCP RST; task failed, generation succeeded, delivery interrupted |
| Fresh work | Three canaries, one after each fault/recovery, returned complete PDF and durable succeeded delivery |
| Idempotence | Final additional recreate: health200, total6tasks/6jobs/6usage, each fault has one terminal event/usage/job; job IDs/history unchanged |
| Resources | All fault queue slots returned; held=used=retained actual input bytes, not forced0; unused credit reconciled; canary storage held/used0 |

#### INT-01 — Confirmed Defect / High

- **Problem/owner:** Service checked-out PostgreSQL Client error lifecycle can
  terminate the whole API while finalizing one delivered task.
- **Implementation locations:** `src/db/connection.ts:7–10` acquires a client,
  awaits transaction/rollback and releases it; `src/tasks/processing.ts:200` is
  the terminal UPDATE after actual HTTP finish. Runtime stack shows the unhandled
  asynchronous error emitted on pg Client. Promise-level transaction catch is
  not an EventEmitter error handler; exact repair still needs implementation review.
- **Path/condition:** complete HTTP PDF → post-response transaction → success
  UPDATE waits on lab-only advisory lock → pg_terminate_backend of that actual
  checked-out app session → Connection terminated unexpectedly / Unhandled error
  on Client → Node exit1. Whole DB service was not cut and OOMKilled=false.
- **Impact:** API availability and terminal persistence are lost until restart;
  observed task remains sending/no usage. Other concurrent API work could be
  interrupted, but concurrent blast radius and production restart policy were
  not tested. No severe corruption/loss was observed; do not label Critical.
- **Evidence/reproduction:** retained proof.mjs action dbcut synchronizes the
  real UPDATE, identifies its blocking PID and terminates that one private-DB
  session. PostgreSQL log, API unhandled-error stack/exit1, complete PDF/hash,
  pre-recovery durable snapshot and subsequent recovery receipts support the claim.
- **Proposed remediation:** handle checked-out Client and idle Pool error events
  with correct connection disposal and controlled readiness/recovery; preserve
  durable-state reconciliation and transport-finish evidence, with no automatic
  rerender/resend on uncertain finalization. Do not implement by retrying the
  whole request or blindly treating a lost connection as a rolled-back commit.
  Source repair is outside this verification-only batch and remains undone.

Earlier F3 SQL-rejection23514 proof and this connection-loss event exercise
different failure paths. This finding adds current evidence without rewriting
the bounded earlier acceptance. An in-scope continuation inspected recovery
and finished the client case after the real defect,
without changing the candidate or marking the failing case PASS.

Retained input bytes after cleanup: appkill402,299; DBcut291; clientcut335,489.
For each, actual files are input-only and equal held/used reservations; all queue
slots are false. Inputs are retained under existing expiry policy, not an unused
reservation leak. Four fully received PDFs (DBcut response +3canaries) parse with
expected text and identical SHA256; existing full-page visual evidence is reused
only because those bytes match. The64-byte fragment is intentionally incomplete.
The client-cut raw terminal reason is ECANCELED and public fallback PDF_FAILED,
while generation succeeded/delivery interrupted; this diagnostic mapping is an
observed contract-review concern, not promoted as a second confirmed defect here.

Retained unsuccessful prerequisites/harness attempts: a90b63f7fbaf rejected the
URL pathname because the test guard omitted its leading slash;033e421c756f
recovered the app-kill task but looked up HTTP before readiness and got
ECONNREFUSED. Only the harness guard/readiness wait changed before fresh retry.
267a224fa06b then exposed the real API crash. Continuation preflight first used
an LF-text hash instead of executed CRLF bytes and stopped before DB work;
checking actual byte hash corrected that harness prerequisite. Raw logs and
scripts remain. These failures are not all attributed to the product, and the
actual DB-cut defect is not hidden among prerequisite failures.

All three attempts' owned containers are stopped; lab evidence/volumes remain.
Internal network, no ports, own labels/volumes/mounts; production Docker identity/
start/restart metadata matches before/after original and continuation checks.
No production DB/storage access, actual-service stop/restart, release/tag/push,
installation or runtime switch occurred. No zero shared-host impact claim.

Report, INT-01 detail/source snapshots, native/HTTP evidence, DB/API logs,
recovery/idempotence receipts, initial attempts and98-file SHA256 manifest:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-interruption-20261030/verification-report.html`.
Ignored local scripts/receipts remain under the Service audit worktree's
`artifacts/oracle-audit-20261030/interruption-*`; remote evidence remains at
`/home/ubuntu/flowdoc-audit-187957aecc2d/flowdoc-interrupt-267a224fa06b`.

**Next recommended work:** repair INT-01 in Service connection/transaction
lifecycle with a focused implementation scope, then rerun actual session-loss
regression and affected consumer/leadership checks before integration. Do not
call this fault batch passing or promote product/map/release readiness. Lost
COMMIT acknowledgement, whole-DB outage, production restart policy, concurrent
load, DOCX fault matrix and TTL soak remain unverified. The real-recovery28-item
plan keeps its own outstanding prerequisites; latest production SQL snapshot
remains30Oct13:50Thai. Stop this completed verification batch; no source repair
or further automatic experiment is running.

## INT-01 repair — authorized implementation scope 2026-10-30

Owner authorizes Service connection-error lifecycle repair and repeated actual
Oracle lab session-cut verification. Single-room implementation then verification;
roles Product Implementation Agent/Evidence Reviewer/Project Control Steward,
execution IDs N/A. Reuse clean existing isolated Service worktree, new branch
`codex/int-01-db-client-lifecycle` from843bd02. Scope: createPool error-event
ownership and real-PostgreSQL child-process regressions. Keep transaction retry,
task/delivery contracts, migrations, Core/package pins and unrelated diagnostics
unchanged. No production DB/storage/service actions, release/tag/push or install.

Plan/proof budget: first show old code fails real checked-out/idle connection-loss
regressions in child processes; preserve processor leadership-loss fail-closed
behavior. Implement the smallest lifecycle guard after observing RED; query
promises must still reject and broken clients be discarded by pg, without retrying
operations. Build immutable candidate images from a hashed exact source overlay,
run focused GREEN regressions and one complete Service suite because createPool
is shared by all runtime DB consumers. Reuse established native/fixture inputs;
report skips explicitly. Repeat the three actual API fault cases on the candidate,
especially post-HTTP terminal-session termination: API must remain live with same
container identity, delivery stays succeeded/transport_finished on known completed
HTTP, fallback terminal state/usage once, no rerender/resend, quota equals retained
files, fresh canaries and final recreate/idempotence. Stop owned lab containers.
Keep source-equivalent prior Core proof; no new Core suite for an unchanged pin.

Only a demonstrated failure/prerequisite permits bounded reruns. One appended
result and one evidence report; no synthetic Work/map/new shared-plan files.
Commit product fix only after build, affected tests and real API proof pass;
do not reinterpret the prior INT-01 failure as passing. Record remaining gaps
and the separate real-recovery28-item constraints.

### INT-01 resolution — verified in local development, 2026-10-30

**PASS within the repair scope.** Service commit
`0978fbed915b43647f9c02dccf1aa9ef4a455c90` fixes INT-01 and is fast-forwarded
locally into actual development `codex/template-registry` from843bd02. The
original fault report remains FAIL as recorded; this is new resolution evidence,
not a rewrite of that failure or a production installation claim. Service
release25e912f, Core/package pins, migrations, API contracts and versions remain
unchanged; no fetch/push/tag/release or installation occurred.

Changes: `src/db/connection.ts` keeps an error listener for each Client's full
lifetime from Pool connect, including checkout/rollback/disposal, and consumes
the idle Pool error after pg removes the broken client. pg query promises still
reject, existing domain error listeners still run, and no operation/transaction
retry is added. `transaction` and task/delivery logic are unchanged. Two new
test files exercise real PostgreSQL loss in child processes, with an isolated
schema and exact application-name/PID validation before terminating their own
sessions. No global uncaughtException handler masks unrelated failures.

| Proof | Result |
| --- | --- |
| RED on old image/source | Checked-out transaction and idle connection child probes fail with unhandled errors:2failed/1passed; leadership-loss behavior already passed |
| GREEN on exact candidate image | Same3 real-PG probes pass; transaction rejected, callback called once, next query succeeds; leadership loss still makes processor readiness false |
| Build | Local TypeScript build and Docker source builds pass; compiled connection module matches local output after newline normalization |
| Complete Service suite | 732passed/0failed/3skipped; supplied/native/plugin fixture archive verified and reused; default public schema migrated before execution |
| API DBcut regression | Unchanged fault proof from prior failing run; actual session terminated at the blocked post-HTTP success UPDATE; API process/container/StartedAt unchanged, restartCount0 |
| Truthful delivery | Client PDF/closing boundary complete and hashes match; task failed/FINALIZATION_FAILED, durable delivery succeeded/transport_finished, job/output/usage/terminal each once |
| Reservations | Queue slot false; held=used equals291retained input bytes for DBcut, not forced0; all unused reservation credit reconciled |
| Adjacent fault regressions | Actual app kill during native work and actual partial-client TCP RST pass on new image; three fresh canaries succeed; final recreate has6tasks/6jobs/6usage without repeats |
| Source review | Independent read-only reviewer found no actionable issues; reviewer did not run tests/access Oracle and does not substitute for runtime proof |
| Integration | Three tested overlay file hashes exactly match commit blobs; clean unchanged fast-forward to development, no conflicts/extra edits, so proof is reused without another full run |

Regression/build project: `flowdoc-int01-8b54698213de`.
Actual API project: `flowdoc-int01-api-45faf2a5a8ca`.
Runtime image:
`sha256:3e14e3e6ca49d63aca23235a3a2f2a9b9704706816514e617b91597646523e63`.
Verification image:
`sha256:fe9c56a12c1668fa6f0c92daa9191cf8295761471d7b45801d18c66c6546d58d`.
Exact base843bd02 +3file overlay source archive SHA256:
`e22d27c9ddd10c122fb8e3b68adc09a41af06f5cc596e8c4c4e488334a0e0152`.
Tests were identical RED→GREEN apart from canonical line endings. The API proof
itself is byte-identical to the prior INT-01-finding proof; its controller only
selects the new pinned images and adds same-process/container assertions.

Three skips are the HEIGHT_DELIVERY_CONFIG operator/container-binding checks,
not PASS in this complete-suite run. Their earlier separate accepted proof keeps
its original scope; no new operator intake/activation is claimed. Core/runtime
archive, migrations and release metadata did not change, so no new Core suite
or installation documentation/version update was necessary for this source fix.
README/usage release-install instructions were reviewed, not promoted as a027
production rollout plan. Native Word visuals, whole-DB outage, lost COMMIT reply,
production restart policy, high-load/soak and TTL recovery remain outside this
repair. Clientcut ECANCELED→PDF_FAILED diagnostic fallback is unchanged.

All owned RED/GREEN/suite/API containers are stopped; evidence/volumes and the
existing worktree are retained. Networks are internal, no ports or production
mounts; production Docker identity/start/restart metadata matches before/after
all phases. No production DB/storage access, service stop/restart or runtime
switch occurred; normal shared-host resource/audit effects are not claimed zero.

New report, RED/GREEN/full-suite results, unchanged actual API fault proof,
same-process receipt, image/source hashes, reviewed source/test snapshots,
integration receipt and93-file SHA256 manifest:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-int01-fix-20261030/verification-report.html`.
Local raw files remain under the Service audit worktree's
`artifacts/oracle-audit-20261030/int01-*`; remote roots are the two projects above
under `/home/ubuntu/flowdoc-audit-187957aecc2d`.

**Next return point:** INT-01 is fixed and verified in local development0978fbe;
installed Oracle runtime is not changed by that Git integration. No more repair
work is required for the accepted INT-01 scope. The28-item real-data recovery
plan still needs its actual targets, writer/impact scope, matched real/off-host
backups, authorized restore proof and maintenance/repair/reopen decisions.
Latest production SQL snapshot is still30Oct13:50Thai, not refreshed here.
Stop after recording this result; no further experiments or rollout run automatically.

## Resource exhaustion — authorized isolated verification 2026-10-30

New explicit owner request: constrain RAM and fill only a bounded lab writing
filesystem on Oracle; restore resources and prove fresh admission/output. This
is single-room verification, not a source repair or reopening of INT-01.
Owner: Service runtime; roles Evidence Reviewer then Project Control Steward;
Work/Phase/Checklist execution IDs N/A. Work size bounded, risk routine with
explicit shared-host containment. Candidate0978fbe and previously verified image
IDs are immutable inputs. Current snapshot was rebuilt from canonical data;
its frontend-wide goal is not substituted for this explicit Service request.

Allowed: fresh labeled internal Docker project, synthetic database/template/
requests, lab-only memory changes/recreation, bounded tmpfs volume fill/removal,
proof helpers and one evidence report, append result here. Forbidden: candidate
source/config/data repair, production DB/storage access, actual-service actions,
release/tag/push/install. Reuse the existing isolated audit checkout only for
ignored proof helpers; no product changes or new shared plan file.

Proof budget: one real cgroup OOM during native work, one actual ENOSPC during
native processing, intake while full, baseline and post-restore/recreate canaries,
terminal/delivery/reservation reconciliation and recreate idempotence. Fill a
768MiB tmpfs filesystem, not the host disk; retain the default256MiB capacity
floor and existing policy. API at most1GiB, DB512MiB, helpers1GiB each,1CPU each;
check host memory/disk prerequisites before creating resources. Keep the tmpfs
mounted through a keeper during API recreation. Save actual OOM counters/state,
ENOSPC/free-space evidence, client wire, DB rows, identities and boundaries.
An OOM may require restarting only the lab API: distinguish resource restoration
alone from an operator recreation. No automatic production inference.

Acceptance: fault really occurred; affected work terminates truthfully without
duplicate jobs/delivery; queue credit returns and held/used bytes equal retained
files; after resource restoration a fresh request produces a complete valid PDF;
recreation does not repeat terminal work; all owned containers stop and production
identity/start/restart metadata stays unchanged. Failed attempts stay retained;
only a demonstrated prerequisite/harness failure justifies a bounded rerun.
Product failures are findings, not permission to repair or weaken assertions.
Document budget: this existing record plus one external evidence report/manifest;
no synthetic registry/map promotion. Stop after results and coverage review.

### Resource exhaustion result — bounded recovery PASS with concerns

Completed project `flowdoc-resource-dac1c151626e`, on immutable Service0978fbe.
Actual runtime image
`sha256:3e14e3e6ca49d63aca23235a3a2f2a9b9704706816514e617b91597646523e63`;
verification image
`sha256:fe9c56a12c1668fa6f0c92daa9191cf8295761471d7b45801d18c66c6546d58d`.
No source, package, migration, version or deployment changes.

| Criterion | Actual evidence and limits |
| --- | --- |
| Real memory exhaustion | API reduced1GiB→64MiB after real native child checkpoint; OOMKilled=true, exit137. This is fault injection below the normal profile, not a supported64MiB operating recommendation |
| Recovery after RAM returned | Restore1GiB **and operator recreate only lab API**. Task failed/WORKER_INTERRUPTED, generation interrupted, delivery not_started. Fresh canary succeeds; memory restoration alone does not resurrect a dead process |
| Real full writing filesystem | Docker local tmpfs768MiB at/lab, total805,306,368bytes; filler804,081,664bytes, ENOSPC errno28/free0. No host disk fill; synthetic DB volume separate |
| Processing during full filesystem | One task fails/FONT_CHECK_UNAVAILABLE; no output, delivery not_started. Existing input retained; no automatic resend or job repeat. Low-level failed app syscall not captured |
| New admission while full | HTTP503/STORAGE_CAPACITY, taskId null, zero new task records. Capacity guard prevents admission correctly |
| Recovery after space returned | Remove only/lab/.lab-space-fill. Fresh canary succeeds without operator API restart |
| Reservations | Both fault tasks queue_slot_held=false; held=used=actual402,299input bytes each; child/writer PID null; unused credits returned, retained-file reservation intentionally nonzero |
| Recreate/idempotence | After recreate: tasks5/jobs5/usage5, unreconciled0, duplicate task-job0, terminal IDs/usage unchanged. Then final successful canary has its own sixth task/job/usage receipt; no claim of a fresh SQL count6 after that final canary |
| Output | Four canaries total: baseline, after RAM, after space, after final recreate. Complete multipart/PDF hashes equal previously parsed/text/visually checked one-page artifactac7251a1; only identical-byte proof reused, no fresh visual review claimed |
| Boundaries/cleanup | Both attempts' owned containers stopped. Internal networks/no ports/own mounts, production identity/start/restart metadata before=after. No production SQL/storage access, actual-service action, push/tag/release/install |

**RES-01 — Design Concern / Medium:** full filesystem still returns GET/health200
ready=true while new POST/documents503/STORAGE_CAPACITY. Observation is confirmed;
a bug against a capacity-aware health contract is not established. Runtime/font
preflight readiness in Service `src/http/server.ts:27,47` checks separately from
storage admission in `src/tasks/repository.ts:20–21`. Reproduce using the saved
disk-full checkpoint and compare both responses. Impact: health-only monitoring
can miss inability to admit writes. Proposed follow-up: owner defines readiness/
global capacity versus quota semantics, then implement/test an appropriate signal.

**RES-02 — Probable Risk / Medium:** the task processing while space is full
reports FONT_CHECK_UNAVAILABLE. Same pinned template/font canaries succeed before/
after restoration, but those are1record versus1800records in the fault task;
there is no equal-size no-fault control, so this is not complete causal proof. Render
child `src/tasks/render-child.ts:225` sends workspace to
`src/fonts/snapshot.ts:22`, which maps bundled-resource failure to generic font
error; `src/tasks/render.ts:58` also places child TMPDIR in that workspace.
Impact: misleading diagnosis under storage pressure. Exact low-level failing
write is unverified, so do not claim a captured application ENOSPC syscall.
Proposed follow-up: inspect resource-loader cause at this boundary in an authorized
diagnostic/fix scope, preserve safe IO classification with public compatibility.
Neither concern is repaired or silently promoted to a confirmed architectural bug.

First attempt `flowdoc-resource-11a44420c16a` retained: real OOM/exit137 observed,
but helper lookup raced recreated API readiness and fetch failed. Only proof
harness added await health before lookup; fresh project reran all criteria.
Local collector used the available Python tarfile API with strict flat-file
validation after an unsupported extractall filter keyword; no dependency installed.

Tmpfs is volatile: keeper preserved its mount and storage identity through API
recreation, but stopping all containers can discard those synthetic files. This
does not prove persistent-volume/off-host backup recovery. Durable evidence rows,
wire/PDF bytes, helpers and both attempts' outcomes are copied outside that tmpfs.
Not tested: physical disk/inodes, DB filesystem full, DOCX fault matrix, gradual
memory pressure/soak, actual supervisor restart policy or production recovery.
Full Service/Core suites not rerun for an unchanged candidate; no broad suite or
production readiness claim from this API-only batch. Original28-item recovery
prerequisites remain unchanged; no fresh production SQL snapshot was taken.

Report,102-file SHA256 manifest, raw client/DB state, OOM/ENOSPC receipts,
unchanged candidate/source hashes and explicit first-attempt failure:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-resource-exhaustion-20261030/verification-report.html`.
Ignored proof helpers/collected evidence: Service audit worktree
`artifacts/oracle-audit-20261030/resource-*` and the two project directories.
Remote roots remain under `/home/ubuntu/flowdoc-audit-187957aecc2d/`.
Next recommended decision: scope health-capacity and IO diagnostic work explicitly;
no automatic repair, extra experiment, real-data recovery or rollout follows.

## RES-01 repair — authorized storage-aware health 2026-10-30

Explicit owner authorizes health correction and repeated Oracle lab full/restore
verification. Single-room implementation then verification; owner Service,
roles Product Implementation Agent/Evidence Reviewer/Project Control Steward;
execution IDs N/A. Bounded size/routine risk. Current canonical snapshot rebuilt;
use the explicit Service request, not unrelated frontend goal. Existing isolated
Service checkout is clean at0978fbe; new branch codex/health-storage-readiness.

Design: GET/health consults the same initial-byte/global-storage calculation as
task admission, including outstanding and legacy reservations and existing free
floor. Probe is read-only, takes no quota/row lock and reserves no bytes; actual
admission remains serialized and authoritative. An observation is not a guarantee
against resource changes after the response. Space/error =>503 generic unavailable;
restoration =>200 without process restart. Keep runtime/leadership/font checks,
legacy no-task health, owned lookup, principal quotas and admission errors intact.
No RES-02 error mapping, migrations/Core/package/config/retry changes.

Proof: four real-PG regressions show old code3fail/1pass before fix (floor-boundary,
outstanding reservations, injected space-read error, owner quota separation); exact same tests
must GREEN. Local TypeScript/Docker builds, one complete Service suite because
shared HTTP/intake consumers are affected, native fixtures reused with skips
reported; no new Core suite for unchanged pin. New immutable-image Oracle API
project: baseline PDF, real bounded768MiB tmpfs ENOSPC, health503/admission503 with
no task allocation, owned lookup still200, remove only filler, health200 and new
complete PDF on same process, repeat full/restore once, recreate/idempotence and
quota reconciliation. Compare production metadata before/after, stop owned
containers, retain attempts. No production SQL/storage/service actions, push/tag/
release/install. No real recovery or automatic rollout from passing lab proof.

Budget: one RED, one GREEN/full suite, two actual filesystem full/restore cycles;
only demonstrated failure/prerequisite permits bounded reruns. Existing record
and one external report/manifest; no synthetic execution/map/shared-plan records.
Commit after relevant checks pass; source review before local development
integration. Stop when criteria/impact coverage pass, preserve unrelated evidence.

### RES-01 resolution — storage health repair verified locally

**PASS within this repair scope.** Commit
`8f741885e0fa4256ab9cbc2f7fdb2ed7a2bde53a` changes3source files and1test and is
fast-forwarded locally from0978fbe into development `codex/template-registry`.
Prior resource-exhaustion observations remain historical facts; this is new
implementation and proof, not a rewrite of that report. Source/release/version/
Core pins and runtime installation boundaries remain distinct. No push/tag/
release/install or actual-runtime switch occurred.

`src/tasks/repository.ts` exposes a read-only storageReady snapshot using the
existing admission capacity function with policy.initialBytes. Intake exposes
it, and `src/http/server.ts` adds it only to GET/health. No storage reservation,
DB/file write, quota lock or duplicated arithmetic. Existing runtime/font/
leadership checks, principal quotas, actual admission locking/errors and owned
lookup remain intact. Space-read/query failure returns false and the checked-out
client is released in finally. Readiness is a point-in-time global-storage
observation; actual admission must still check after it, and this does not claim
that every principal/queue/legacy filesystem can accept every request.

| Proof | Result |
| --- | --- |
| RED real PostgreSQL | Exact new4tests on0978fbe:3failed/1passed, expected503 but observed200 |
| GREEN exact candidate |4passed/0failed: free-floor equality and1byte short, outstanding reservation deduction, same-app recovery, no accounting mutation, space-read error redaction, runtime fail-closed and owner-quota separation |
| Builds | Local TypeScript and immutable Docker verification/runtime builds pass |
| Complete Service suite |736passed/0failed/3skipped, exit0; unchanged native/font/plugin fixtures reused |
| Actual full filesystem | Fresh Oracle project, bounded/lab tmpfs768MiB filled to ENOSPC(errno28)/free0 twice; host disk not filled |
| Full-space API | Each cycle3health probes503; POST/documents503 STORAGE_CAPACITY with taskId null/no new tasks or reservations; owned existing-task lookup200 |
| Restore without restart | Remove only lab filler; each cycle health200 then complete multipart/PDF, API ID/PID/StartedAt identical, restartCount0 |
| Recreate and quota | Four successful canaries total: baseline, restore1/2, final recreate. Final actual SQL counts4tasks/4jobs/4usage, unreconciled0; prior job/usage/terminal IDs unchanged; retained files/reservations0 |
| Source review/integration | Independent read-only source reviewer found no actionable findings; reviewer ran no tests/Oracle. Tested4overlay hashes match commit blobs after newline normalization. Clean unchanged local FF; passing proof reused without repeat suite |
| Cleanup/boundary | All owned RED/GREEN/suite/API containers stopped; internal networks/no ports/own mounts; production Docker identity/start/restart metadata stable before/after each phase |

Three skips are the operator/container-binding HEIGHT_DELIVERY_CONFIG cases,
not PASS in this suite. No new Core suite because vendor/Core pin is unchanged.
Source review does not newly prove pool-cap/legacy-accounting branches or DB-loss
recovery; shared admission arithmetic remains unchanged and older evidence retains
its original limits. All4received PDFs hash to the previously parsed/text/visually
checked one-page ac7251a1 artifact, so identical-byte artifact proof is reused;
no new visual review or dependency installation is claimed. README/usage reviewed;
no new setup flags/version/pin or release-install instructions required.

Regression/build project `flowdoc-health-7eef79c93d15`.
Actual API project `flowdoc-health-api-4b95de986c85`.
Runtime image:
`sha256:2341dde366765402ed361f7bacb08d975380042203779c90d3ec48cd3aa1274e`.
Verification image:
`sha256:bc9ed2e2148dd997dc6dcd4e2d46fa189ea8041733066a07a9aeb7148c79d72e`.
Exact0978fbe+4file source archive SHA256:
`6c3b0ada086097ce80aee2360628b6dc4aa9ce21a56d5d44c401d93f642ff678`.

Harness limits retained transparently: local SSH launcher timed out at25s after
the detached build/suite started; remote progress was confirmed and the same run
completed, with no duplicate launch. Reused runner's green-summary.json contains
a stale hardcoded passed3; actual Vitest green-results.json and executed assertion
require4/0. Raw artifact retained, derived summary cites primary results. These
are harness/reporting issues, not product failures or hidden failed test reruns.

Report,94-file SHA256 manifest, primary RED/GREEN/full-suite results, API client/
DB/free-space/identity evidence, tested source binding and local integration:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-health-storage-fix-20261030/verification-report.html`.
Ignored raw helpers and collected evidence remain at the reused Service audit
checkout under `artifacts/oracle-audit-20261030/health-*` and both project names;
remote roots remain under `/home/ubuntu/flowdoc-audit-187957aecc2d/`. Reused audit
checkout retains earlier evidence/inputs; it was not created by this repair.

RES-02/FONT_CHECK_UNAVAILABLE mapping remains unmodified/probable; equal-load
control and exact low-level IO cause still need separate authorization/proof.
Physical disk/inodes/DB filesystem full, DOCX faults, soak, production recovery
and all-stop persistent storage remain outside this scope. Tmpfs data is volatile;
keeper held the mount through lab API recreation only. No production SQL/storage
access or service action; latest actual-data snapshot/recovery28-item prerequisites
are not refreshed or discharged by this fix. Stop; no further experiment or
rollout runs automatically.

## RES-02 equal-load proof — authorized discovery 2026-10-30

New explicit owner request: compare identical1800-record work before, during and
after full lab writing space, no product repair. Owner Service with pinned Core;
roles Evidence Reviewer/Cross-Repo Boundary Reviewer then Project Control Steward.
Single-room discovery, bounded size/routine risk; execution IDs N/A. Canonical
snapshot rebuilt; explicit Service request is authority for this scope.
Candidate8f74188 and its previously built immutable image pair are reusable inputs.

Plan/proof budget: fresh labeled Oracle Docker project/private network/synthetic
database,768MiB tmpfs writing filesystem and existing1GiB API/512MiB DB limits.
Three exact same payload/multipart bytes and template/font pins: baseline complete,
middle request admitted while space exists then filled at real native-child
checkpoint, final request after removing only lab filler. Validate input hashes,
HTTP/PDF evidence, task/usage/delivery and reservations, same API identity and
final counts. New requests while already full would be rejected before rendering;
do not confuse such admission rejection with RES-02 processing failure.

Gather resource-loader evidence without editing candidate: separate diagnostic
calls in the same runtime image/UID and bounded writing filesystem, raw write
check, public Core loadBundledResources result, then Service snapshotResources
mapping. Use dedicated diagnostic folder, never modify a running task's files.
Record exact differences between these supplemental calls and the actual task;
do not call a supplemental write error an in-process app syscall trace. Available
strace/perf are absent or unsupported for this kernel; do not install them or
enable host-wide tracing. Pair source evidence with equal-load execution and
explicitly preserve any remaining gap rather than modifying source to observe it.

Allowed only ignored lab helpers/evidence and this existing canonical record.
No Service/Core tracked source/config changes, migrations, production DB/storage
access, actual-service actions, release/tag/push/install or new integration.
Proof budget one complete three-way comparison plus three small loader controls;
failed prerequisites remain retained and justify only bounded corrections/reruns.
One external report/manifest and this record; no synthetic Work/maps/registries.
Check candidate unchanged, stop owned containers and compare production metadata.
Stop after supported classification/results; a confirmed defect is not permission
to repair it. Physical disk/inodes, DB volume full, DOCX and soak stay out of scope.

### RES-02 result — equal-load diagnosis confirmed, 2026-10-31

**PASS for bounded diagnosis; RES-02 is Confirmed Defect / Medium for error
classification. No product code changed.** Fresh Oracle project
`flowdoc-res02-a7a5eda9a93b` uses unchanged8f74188 and runtime image
`sha256:2341dde366765402ed361f7bacb08d975380042203779c90d3ec48cd3aa1274e`,
verification image
`sha256:bc9ed2e2148dd997dc6dcd4e2d46fa189ea8041733066a07a9aeb7148c79d72e`.
All requests use exactly1800records/same402,431multipart bytes, SHA256
`e90673bb47bd951a0c47b58ee0ad3a65d0a1128d66b3c719ffba92285c6976fa`.
Payload SHA853ea591 and persisted input digestc324d47b match all3, as do template
fingerprint42a59991 and font resource manifest5f0847e6.

| Comparison | Observed result |
| --- | --- |
| Before full | Task succeeded, delivery succeeded; complete148-page PDF |
| During full | Request admitted while space exists, then768MiB lab tmpfs filled at real child-PID processing checkpoint; task failed/FONT_CHECK_UNAVAILABLE, usage delivery not_started, no PDF output |
| After removing filler | Exact same request succeeds on same API process, complete148-page PDF |
| PDF control | Both files4,181,707bytes, SHA256b2606f74 identical; bundled pypdf parses both, extracts all Record0–1799; no all-page visual fidelity claim |
| Original loader functions | Before/after: raw write/Core loadBundledResources/Service snapshotResources all succeed. Full: raw write ENOSPC(syscall write), Core RESOURCE_UNAVAILABLE/path tempRoot, Service FONT_CHECK_UNAVAILABLE |
| State/credit |3tasks/3jobs/3usage, one terminal event per task, unreconciled0; failed task retains only402,299input bytes with held=used, queue slot false; successful tasks retain/reserve0 |
| Lifecycle | API ID/PID/StartedAt unchanged throughout all3, restartCount0; no automatic rerender/resend observed |

**Confirmed finding:** Service `src/fonts/snapshot.ts:22` maps every failed
bundled-resource result to FONT_CHECK_UNAVAILABLE, losing Core's temporary-root
classification. Task path `src/tasks/render-child.ts:225` calls this function
with the task workspace. Executed image modules were copied read-only from its
stopped, label/image-validated container: runtime-snapshot.js:22–24 and
runtime-render-child.js:220 match candidate compiled modules. Pinned Core package
`dist/runtime/loadResources.js:53–57` performs mkdtemp/write-check after resource
manifest/asset-hash validation and returns RESOURCE_UNAVAILABLE/tempRoot on failure.
Service `src/tasks/public.ts:28` then falls back to PDF_FAILED for the font code.
The actual wire/owned lookup show PDF_FAILED; lookup delivery=failed with
evidence=not_started, while durable usage records not_started. Do not describe
HTTP200 multipart error as a delivered PDF or mix raw terminal/public projections.

Impact: operator diagnosis can target fonts rather than the unwritable temporary
storage; generic client error obscures the resource class. Severity Medium is for
diagnostic loss under a clear condition, not data corruption. Equal-load baseline/
recovery close the prior1-record-versus1800-record comparison gap. Original reports
remain historical probable-risk observations; this is new confirmed evidence.

Evidence limits: supplemental loader controls use separate exec processes as the
same UID10001/image/filesystem, dedicated/lab/res02-diagnostics, same4legacy font
IDs/checksums but synthetic diagnostic fingerprints, and python directly rather
than the task's fenced wrapper. Core tempRoot write-check precedes Python/runtime
probe. The controls do not intercept task-child return values/syscalls or modify
its workspace. Cleanup can free normalized/work files after failure, so filler
was topped up to free0 again before loader controls; both fill receipts retained.
Exact app failing syscall remains untraced. No strace available; installed perf
wrapper lacks matching kernel tools. No package installation or host-wide tracing.
These limits do not undo directly observed Core-to-Service misclassification.

**Proposed repair, not authorized/executed here:** preserve safe temporary-storage
classification at Core/Service boundary, e.g. existing STORAGE_IO for an identified
RESOURCE_UNAVAILABLE/tempRoot, keep genuine font/runtime errors distinct and add
both storage and font regressions. Do not emit filesystem paths to clients or map
all tempRoot failures specifically to ENOSPC/STORAGE_CAPACITY: Core's current
catch also groups other unwritable-root causes. Separate repair scope required.

All owned containers stopped, private network/no ports/own mounts. Production
Docker identity/start/restart metadata before=after; no actual DB/storage/service
actions. Service checkout remains clean at8f74188; no tracked source/config edits,
branch integration, migrations/Core changes, push/tag/release/install. Full suites
not rerun because candidate unchanged; actual3-way API/loader/PDF proof only.
Tmpfs is volatile and keeper preserves its mount only during lab; external evidence
is retained, not a persistence/off-host backup proof. No physical disk/inode/DB
filesystem, DOCX, soak or actual-data recovery claim. Single complete comparison,
no failed product run or rerun hidden. Work/Phase/Checklist IDs remain N/A.

Report,61-file SHA256 manifest, full fixed multipart, both PDFs/wires and parsed
record checks, loader results, executed source/line evidence and cleanup:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-res02-proof-20261031/verification-report.html`.
Ignored helpers/evidence remain in Service audit checkout under
`artifacts/oracle-audit-20261030/res02-*` and project name; remote root remains
`/home/ubuntu/flowdoc-audit-187957aecc2d/flowdoc-res02-a7a5eda9a93b`.
Stop after this classification. RES-02 is not fixed; no further experiment or
production recovery/rollout starts automatically.

## RES-02 repair — authorized implementation 2026-10-31

Explicit owner authorizes correcting temporary-writing failure classification
and repeating exact1800-record before/full/restored comparison in an isolated
Oracle lab. Single-room implementation then verification; owner Service, roles
Product Implementation Agent/Evidence Reviewer/Project Control Steward; execution
IDs N/A. Bounded size/routine risk. Canonical snapshot rebuilt; clean existing
audit worktree at8f74188 reused on codex/res02-storage-diagnostics. Current
explicit Service request governs; no unrelated frontend work/context activated.

Scope: Service snapshotResources identifies Core's primary RESOURCE_UNAVAILABLE/
tempRoot and throws safe STORAGE_IO with a storage-specific generic message.
Keep genuine font/manifest/runtime behavior, public mapping, quota/health,
transactions/retry, Core/package pins/migrations/config unchanged. Do not claim
every unwritable tempRoot is ENOSPC/STORAGE_CAPACITY. Existing error code means
no new public protocol/schema or filesystem paths exposed.

Proof budget: six boundary regressions, RED on original image before repair,
GREEN on immutable candidate; local TypeScript and Docker builds. One full
Service suite because snapshotResources is shared by PDF/DOCX/readiness/native
font consumers, supplied/native fixtures reused and skips reported; no Core
suite for unchanged package. Fresh labeled Oracle API project repeats exact
402,431byte/1800record request three times as previous proof: baseline success,
middle admitted then fill768MiB lab tmpfs at native checkpoint, after removing
filler success. Require terminal/usage/public wire/lookup STORAGE_IO for full
task; durable delivery not_started, no output, no resend, reconciled retained
input reservations. PDFs before/after identical,148pages/all1800records, same
API process and final3task/3job/3usage counts. Original loader diagnostics must
still show Core RESOURCE_UNAVAILABLE/tempRoot while Service now reports STORAGE_IO.
Maintain supplemental-control versus actual-process evidence boundaries.

Allow only snapshot source/new focused test, ignored lab harness/evidence and
this existing canonical record. No actual data/storage/service access or stop,
push/tag/release/install, version bump, Core fix or new Work/map/registry. Source
review before local development integration; commit after selected checks pass.
One external evidence report/manifest, retain failed prerequisites; bounded
reruns only for demonstrated failures. Stop owned containers and compare
production metadata. Stop when acceptance/impact coverage pass; no extra
experiment, production recovery or rollout follows automatically.

### RES-02 resolution — task storage diagnosis repaired, 2026-10-31

**PASS within the task-render repair scope.** Commit
`2c089b536f8782258898693db63dc62141ca7659` contains only
`src/fonts/snapshot.ts` and `tests/font-storage-diagnostics.test.mjs`; clean local
development codex/template-registry fast-forwarded from8f74188 without conflict
or additional edits. Tested overlays match commit blobs after newline normalization;
unchanged FF reuses passing proof. No fetch/push/tag/release/install, version/pin/
Core/migration/config change or actual-runtime switch.

Snapshot loader now inspects Core's primary issue. Only RESOURCE_UNAVAILABLE at
logical path tempRoot becomes safe OperationError/STORAGE_IO with message
"Temporary storage is not writable". Other bundled-resource/font/runtime failures
and actual font hash mismatch keep their prior behavior. No raw path, original
Core message or connection detail exposed. This class includes unwritable roots
generally, not a claim that all such causes are specifically ENOSPC/capacity.
Public mapper already supports STORAGE_IO and is unchanged.

| Evidence | Result |
| --- | --- |
| RED original image | New unit boundary tests use controlled Core results:1failed/5passed; storage expectedSTORAGE_IO but originalFONT_CHECK_UNAVAILABLE |
| GREEN candidate |6passed/0failed: safe storage message/public projection/redaction, manifest/font/runtime unchanged, unrelated issue not inferred as storage, genuine hash mismatch retained |
| Build/full Service | Local TypeScript/Docker builds pass;742passed/0failed/3skipped, exit0, existing native/font/plugin fixture pins reused |
| Exact1800record API control | Before/full/restored requests retain original402,431byte multipart SHAe90673bb and inputDigest/template/font pins; baseline and restored succeed |
| Real full processing | Middle request admitted before768MiB lab tmpfs fill at child checkpoint; ENOSPC/free0. Task terminal, usage.reason, public multipart error and owned lookup allSTORAGE_IO; noFONT_CHECK_UNAVAILABLE/PDF_FAILED substitution |
| Delivery/integrity | Full task has no output, durable delivery not_started; lookup delivery failed/evidence not_started. Final3tasks/3jobs/3usage, one terminal each, unreconciled0; held=used=402,299retained input bytes for full task, successful tasks0 |
| Recovery/output | Same API ID/PID/StartedAt across3tasks, restartCount0. Before/restored PDFs both4,181,707bytes/148pages, SHA256b2606f74 identical to each other and pre-fix control; bundled pypdf parses and finds all0–1799records; no all-page visual claim |
| Loader controls | Raw separate write stillENOSPC; Core stillRESOURCE_UNAVAILABLE/tempRoot; Service nowSTORAGE_IO with safe storage message. Before/after loaders succeed, manifest constant |
| Source review | Independent static reviewer found no actionable issues; reviewer did not run tests/DB/Docker/SSH and is not runtime acceptance |
| Boundaries | All owned RED/GREEN/suite/API containers stopped; internal networks/no ports/own mounts. Production Docker identity/start/restart metadata before=after |

Three full-suite skips remain HEIGHT_DELIVERY_CONFIG operator/container-binding
checks, not PASS. No new Core suite because package/pin unchanged. README/usage
version/pin/setup instructions reviewed; no new flags, schema or error-code
contract requires a setup/release documentation change. Source review/actual
proof do not certify every legacy/authoring readiness catch or projection: those
existing paths are outside this bounded task-render fix. The six unit cases mock
Core results; real fault evidence is the separate actual API/loader comparison.

Regression/build project `flowdoc-res02fix-6ad6b4528a7b`.
Actual API project `flowdoc-res02fix-api-8ee3c992c6d4`.
Runtime image:
`sha256:3af621e99d38cfa68d7c2aca6febd392337e1fe6b078545e2736e23a731a4134`.
Verification image:
`sha256:3833930be9d1d7f9f8118ba38f5613c5c6c46c91c7c6009ce4a1fb0a2e238f3d`.
Exact base8f74188+2file source archive SHA256:
`1b22dadaaf3758c115c06e97e4514b468e58ea61e94a1d760e31e04425c68741`.
Executed snapshot module copied from label/image-validated stopped lab container
matches candidate compiled module; unchanged Core modules remain bound separately.
Fault proof changes only assertions/expected code, not input/fault point; diff
retained. No failed candidate run or hidden retry. Original RES-02 failure/proof
reports remain historical and are not rewritten as passing.

Supplemental loaders still use another exec/dedicated diagnostic directory with
same legacy font IDs/checksums, synthetic diagnostic fingerprints and python
directly versus actual fenced task wrapper. Core write-check precedes runtime
probe; exact task-child syscall is not intercepted. Top-up after task cleanup
and before loader controls remains explicit. Physical disk/inode/DB filesystem,
DOCX fault matrix, soak and actual-data recovery remain unproved. Tmpfs volatile;
keeper holds mount through lab only, not a persistence/backup proof. No production
SQL/storage or actual-service actions. Recovery28-item prerequisites not discharged.

Report,94-file SHA256 manifest, RED/GREEN/full-suite results, actual public wire/
lookup/usage/reservations, PDF/loader/source bindings, review and local FF receipt:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-res02-fix-20261031/verification-report.html`.
Ignored raw helpers/evidence remain in the reused Service audit checkout under
`artifacts/oracle-audit-20261030/res02fix-*` and both project directories; remote
roots stay under `/home/ubuntu/flowdoc-audit-187957aecc2d/`. Existing checkout
retains prior evidence/inputs and was not created by this repair. Execution IDs
N/A. Stop after accepted scope; no automatic extra experiment, data recovery,
release or installation follows.

## DOCX full-space parity — authorized verification 2026-10-31

Explicit owner requests the same1800-record before/full/restored resource-fault
comparison for DOCX on isolated Oracle. Single-room verification; owner Service
with pinned Core package; role Evidence Reviewer then Project Control Steward;
execution IDs N/A, bounded size/routine risk. Rebuilt canonical snapshot and
current explicit Service request govern, not unrelated frontend activity.
Reuse unchanged2c089b5 and verified RES-02 runtime/verification image pair.

Plan/proof budget: one fresh labeled project/private network/synthetic DB with
same1GiB API/512MiB DB limits and768MiB bounded tmpfs write filesystem. Same
402,431byte multipart/payload/template/fonts as PDF; only Output-Format:docx and
DOCX artifact expectations change. Within DOCX all3requests/pins/input digests
must agree; do not require PDF/DOCX format-dependent input digests to match.
Baseline/restored produce valid native DOCX, full processing must fail STORAGE_IO
in raw terminal/usage/public wire/owned lookup and never report successful send.
Admit middle request before fill at real native-child checkpoint; do not confuse
already-full new-admission rejection with a processing fault. Assert actual job/
task/output format, DOCX MIME/name/receipt disclosures, no PDF artifact fallback.

Check complete multipart plus artifact hash, ZIP CRC/XML/relationship integrity
and all1800records in both DOCX files. Compare semantic document content; store
actual byte hashes without assuming ZIP metadata deterministic. DOCX pageCount
null/wordVerifiedfalse/fieldRefreshrequired remain truthful; no native Word visual
or pagination acceptance. Same process, final3tasks/3jobs/3usage, no duplicate
terminal/delivery, held=used=actual retained files and queue slots returned.
Reuse original loader diagnostics with their separate-process limitations.

No tracked Service/Core source/config changes, migration, new image build/full
suite, production SQL/storage/service access, release/tag/push/install or branch
integration. Allowed only ignored proof helpers/evidence and this canonical
record. One external report/manifest, retain failed attempts, bounded retries
only for demonstrated prerequisites/failures. Stop owned lab containers, compare
production metadata before/after, preserve evidence outside volatile tmpfs.
Stop after results and coverage review; findings do not authorize code repair.

### DOCX result — three-way experiment completed, output parity FAIL

**FAIL_DOCX_1800_OUTPUT_PARITY.** Do not mark this batch PASS merely because
STORAGE_IO and state cleanup work. Candidate/image remains2c089b5; no product
source/config edits, Core budget increase, record reduction, image build or
branch integration. All existing PDF repair evidence keeps its original scope.

Initial project `flowdoc-docxspace-2d80974e5c9e`,1GiB/1CPU, failed before fill:
task/job RENDER_FAILED, output_formatdocx, no artifact/delivery. Original harness
asserted one artifact and stopped before persisting the wire; failed assertion,
DB rows and stopped-container log/metadata retained. Read-only inspection starts
only its synthetic DB then stops it again, never restarts that API. OOMKilledfalse
and no Docker OOM event in its start/stop interval; exact cause remains Unverified.
Do not infer absence of every memory/V8/signal problem from Docker metadata.

The observed failure justified one fresh bounded diagnostic continuation:
`flowdoc-docxspace-057d7189fd11`, existing opt-in4g-2cpu profile, API4GiB/2CPU,
TASK_QUEUE_MAX_PROCESSING1, DB512MiB and768MiB bounded tmpfs as before. Host
available-memory prerequisite raised to5GiB; no production profile changed. This
is a different diagnostic environment and does not erase the1g failure. Harness
now saves raw wire before artifact checks and records unsuccessful baseline/
restored cases while preserving overall FAIL; not a relaxation into PASS.

| Same1800-record DOCX request on4g | Actual result |
| --- | --- |
| Before full | Task failed/DOCX_OUTPUT_BUDGET_EXCEEDED; public LIMIT_EXCEEDED, no DOCX |
| Full during processing | Admitted before fill, then native-child checkpoint/ENOSPC/free0; raw terminal/usage/public wire/lookup STORAGE_IO, no output/delivery; health503 |
| After filler removed | Same payload again fails/DOCX_OUTPUT_BUDGET_EXCEEDED, public LIMIT_EXCEEDED; no DOCX |
| Identity/integrity |3tasks/3jobs/3usage, one terminal each, unreconciled0; each held=used=actual402,299retained input bytes at lab checkpoint, queue slotsfalse |
| Lifecycle | API ID/PID/StartedAt unchanged across3tasks, restartCount0; no automatic resend or extra job observed |
| Input/format | Exact402,431byte multipart SHAe90673bb and payloadSHA853ea591, same template/fonts; Output-Formatdocx frozen in all task/job/usage records |
| Supplementary loaders | Before/after resource loaders succeed; at full raw writeENOSPC/Core RESOURCE_UNAVAILABLE-tempRoot/Service STORAGE_IO, preserving previous probe limitations |

No ZIP/XML/relationship/1800record artifact check ran: no DOCX files exist. The
validator was prepared but is not evidence of a successful check. No DOCX byte
hash, page count, native Word visual/pagination or successful export after space
restoration is established. A complete multipart error is not delivery success.

**DOCX-SPACE-01 — Design Concern / Medium, confirmed runtime constraint:** current
workload cannot produce baseline/restored DOCX under existing limits. Supplemental
public Core composition/native writer on the same1800-record fixture, pinned
package and existing32MiB maxBytes returns DOCX_OUTPUT_BUDGET_EXCEEDED at
word/document.xml: "Expanded XML node/drawing budget exceeded", bytesWritten0.
This is a separate Core call, not an intercepted detailed task-child result;
actual API preserves only the budget code. Guard may operate as designed, so
do not call the guard itself a confirmed defect.

Executed image `Core dist/docx/writer.js:84–86` sets effective default XML budget
50,000, with optional upper bound300,000; `:154–162` checks expanded XML/drawing
counts, default drawing/reference limit10,000. Exact counters and which side of
the combined guard exceeded first were not captured. `Core dist/docx/engine.js`
passes existing options; Service `src/tasks/render-child.ts:244–247` keeps only
issue code and `src/tasks/public.ts:28` maps it to LIMIT_EXCEEDED. Copy/hash-bound
modules came from the stopped, label/image-validated lab API, with candidate
source equality checked. Read-only direct Core probe uses networknone/4GiB/2CPU
and stops, with separate production-metadata boundary receipt.

4g cgroup peak1,310,031,872bytes, oom/oom_kill0, includes API/worker/kernel/cache,
not a measured child heap/RSS. It does not prove the1g failure cause, and the
profile/CPU/coordinator changes prevent attributing differences solely to RAM.
Next proposed work: scoped DOCX expansion/budget and earlier admission/rejection
analysis that preserves semantics/resource limits, plus a bounded1g generic
failure diagnosis. Do not blindly raise XML/byte budgets or production memory.

All owned containers from both attempts and the Core diagnostic are stopped.
Private networks/no published ports/own mounts; production identity/start/restart
metadata stable across both attempts and extra read-only lab DB/Core diagnostics.
No actual DB/storage/service action, fetch/push/tag/release/install or source fix.
Full suites not rerun because unchanged image/candidate; earlier742passed/3skipped
does not waive this failed DOCX acceptance. Tmpfs is volatile and keeper held it
during API experiment only; observed file/reservation equality is the in-lab
checkpoint, not all-stop persistence/backup proof. Physical disk/inodes/DB full,
soak and actual-data recovery remain unproved. Execution IDs N/A.

Report,98-file SHA256 manifest, both attempts, all3raw wires, DB/delivery/quota
state, exact body/format proof, loader/Core budget diagnostics and source/cleanup:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-docx-storage-20261031/verification-report.html`.
Ignored helpers/evidence remain in reused Service audit checkout under
`artifacts/oracle-audit-20261030/docxspace-*` and both project directories. Remote
roots are under `/home/ubuntu/flowdoc-audit-187957aecc2d/`. No successful DOCX
claimed, original1g failure retained. Stop after this FAIL report; no automatic
code repair, additional experiment, real-data recovery or rollout.

## DOCX expansion diagnosis and proposed repair plan — 2026-10-31

Owner explicitly requests locating which XML/drawing counters and generated
structure exceed budget, then a repair plan before implementation. Single-room
discovery/planning, not code repair. Owner Core packed DOCX writer; Service is
consumer. Roles Cross-Repo Boundary Reviewer/Evidence Reviewer/Planning Partner;
execution IDs N/A, bounded size/routine risk. Canonical snapshot rebuilt and
Core/Service guides read. Use pinned Core0.5.2 artifact consumed by unchanged
Service2c089b5, not an assumed current Core checkout. Core primary checkout is
release55315ca; local development refs at1817efa are reconciliation inputs for
future implementation, not permission to edit release or repin Service now.

Proof budget: one fresh isolated Oracle container/networknone, existing verified
image,4GiB/2CPU, same1800record fixture and unchanged32MiB/XML/drawing budgets.
Observe original writer locals using an in-process Node inspector breakpoint
at existing container/style compaction and final guard; no source rewriting,
monkey-patching or variable/limit mutation. Copy generated intermediate XML as
diagnostic evidence before the original guard rejects output; no DOCX acceptance
or artifact delivery claim. Bind helper/module hashes and read-only container
root, stop owned container, compare production metadata. A missing debugger
prerequisite permits only a bounded corrected observation, retaining failed runs.

Count before/after existing compaction, per-part cumulative XML/drawing totals,
dominant element/property patterns and source paragraph/line/word-box expansion.
Validate extracted XML counters independently. Plan owned source boundaries,
preserved invariants, risk/unknowns, regression/acceptance gates and integration
order from evidence. Correctly distinguish an established cause from candidate
optimizations; no prototype repair, raised cap, reduced records, production
SQL/storage/service actions, release/tag/push/install or full suite rerun.
One external evidence report and plan in this existing canonical record; no
product docs/superpowers or synthetic registry/map updates. Stop after diagnosis
and plan; original DOCX output parity stays FAIL until a separately authorized
implementation passes the unchanged limits and actual API three-way proof.

Result: PASS bounded diagnosis/planning only; DOCX delivery remains FAIL. Fresh
Oracle-hosted Docker lab `flowdoc-docxtrace-a1423f327b45` captured the original
rejection. One coverage gap justified a second read-only observation:
`flowdoc-docxtrace-4fdc12c5ca15` retained an inspector reference to the existing
ZIP, resumed the unchanged guard, and read all XML/rels parts only AFTER its
original rejection. This neither bypassed the guard nor produced a DOCX.
No DB connection was needed for this writer diagnosis; Oracle here is the
isolated cloud-hosted lab, not a claim about the Oracle Database engine.

Confirmed implementation path (pinned installed Core, not documentation):
`text-intent.ts:33-44` groups graphemes by Thai/Latin/Common script;
`text.ts:65-93` emits separate ScriptRuns per segment, with full native run
properties each time. `writer.ts:125` packs before the expanded XML scan;
`writer.ts:135-157` only attempts source-word container/style compaction when
sourceSerialized=true. Here sourceSerialized=false, guides/wordBoxes=0,
source nodes=text blocks=1800, so neither compactor applies. The original
guard at `writer.ts:168` rejects `word/document.xml`; no drawing limit was hit.
The relevant four source files are unchanged between release55315ca and local
development1817efa, but future implementation still needs base reconciliation.

Measured, independently checked using both the writer regex and XML parser:

- guard cumulative XML820825/50000, drawing counter0/10000; prior rels12 plus
  document.xml820813. Document XML22170647bytes, SHA256
  `b5f28d4cca02114ac0338c5cdc3c7bb441613b4227d88f17239134f35e50c6cd`;
- entire pre-rejection ZIP has821427XML nodes; other parts total614 and
  drawing counter remains0. This post-rejection inventory is not a successful
  final writer traversal or artifact acceptance;
- 1800paragraphs each40text runs =72000runs/text elements. Every run has the
  same explicit rPr signature, only rPr+t children, and11element nodes.
 73800rPr groups include1800paragraph-mark groups plus72000run groups; each
  has8property children (font, b/bCs, i/iCs, snapToGrid, sz/szCs);
- all Record0..1799 texts, spaces, order and suffixes match the input exactly.
  No text was dropped/reduced. Writer source hash before=after
  `578d2fb9c01821bae1c383ffb4908f4228994762d0d2eee4b7f4dca50f350eee`.

This confirms native text-run expansion as the cause of this bounded failure,
not source-word drawings, database state, font-check failure or a guard defect.
No broader1800-record capacity contract is inferred. Styles-only deduplication
cannot solve72000r tags exceeding50000 even before counting their text children.

Proposed repair, in priority order; ALL implementation below remains pending:

1. Core RED regression on the same1800-record fixture and original budgets,
   plus assertions for exact ordered text, properties and all package parts.
   Use an isolated development worktree based on reconciled1817efa or its
   confirmed successor; never edit release. First reproduce current failure.
2. Core `src/docx/text.ts`: coalesce adjacent ordinary Latin/Common text
   descriptors with identical complete effective properties, BEFORE creating
   ScriptRun objects. Flush at breaks, inline span/navigation/field/bookmark
   boundaries and any changed style, language, script flag, spacing or baseline.
   Preserve Thai segmentation and authored/source layout, pair spacing,
   explicit spacing0 versus undefined, CS emphasis, fonts, whitespace and
   cancellation. Do not merge by font alone, remove rPr blindly, collapse text,
   alter script normalization, post-rewrite arbitrary OOXML, or change budgets.
   Native Word shaping equivalence requires separate evidence; matching rPr
   alone is not proof. Preserve visualVerified/wordVerified=false until proved.
3. Arithmetic only, not a prototype: if each40-run paragraph safely becomes
   one11-node run, save70200*11=772200nodes; document48613, package49227,
   leaving773nodes (1.546%) under50000. No XML was rewritten to obtain this.
   This is a narrow margin, not general capacity: more styles, structure or
   fields may still legitimately fail. If actual counts do not fit, stop and
   revise the plan from evidence; no automatic style rewrite or cap increase.
4. Core validation: focused writer regression and affected metricPairs,
   baselineRules, pageFieldPosition, sectionAssembly, sourceLayout,
   sourceWordBoundaries/containers/styles, pagination and cancellation/resource
   paths; then the applicable required Core checks and isolated Linux packed
   consumer. Include Latin/Common punctuation/numbers/whitespace and kerning,
   Thai/Latin transitions, authored breaks, hyperlink/reference/page-field
   barriers, zero/nonzero spacing and baseline positions. Verify original
   XML/drawing/source-node/byte guards still reject true excess and sink aborts
   without committing partial output. Native Word layout/kerning proof stays a
   separate explicit acceptance gap until executed, not inferred from XML.
5. Only after Core gates, prepare a LOCAL packed development artifact and
   checksum-pinned Service consumer change for review; no publish/tag/release/
   install. Inspect release gates before future Git promotion, and never merge
   or repin merely because this diagnosis passed. Service transport, storage
   classification, admission and original budgets remain unchanged.
6. Fresh Oracle Service lab at the same recorded4g-2cpu profile: same1800DOCX
   input before full, processing-root full, and restored. Require valid complete
   DOCX packages before/after; exact records/order/relationships/font embedding,
   all-part XML<=50000, drawings<=10000 and original byte guard. Full must report
   STORAGE_IO consistently in wire/task/usage/lookup with no delivered artifact;
   tasks/jobs/usage once each, reservations0, no automatic resend, same healthy
   API process/restart0 and post-restoration admission. This is required before
   closing previous DOCX parity FAIL. Run affected Service checks on the actual
   repinned candidate; prior742pass/3skip is not evidence for a new package.

Memory follow-up is separate and deferred: packing currently happens before
XML rejection, so pre-allocation run coalescing is preferable to a late XML
rewrite. Previous cgroup peak1310031872bytes is not the worker heap and does
not prove the original1GiB RENDER_FAILED cause. The generic1GiB failure,
physical disk/inode exhaustion, broad capacity/soak and real-data recovery
remain unverified; no RAM increase is proposed as a substitute for this fix.

Evidence scope: same immutable verification image3833930, Service2c089b5,
Core0.5.2 archive647235de. Two separate4GiB/2CPU network-none/read-only-root
containers, no published ports, both stopped; production container identity/
start/restart metadata unchanged across each observation. No production SQL,
storage or service action, source/config changes, limit mutation or DOCX output.
Ignored inspection helpers were corrected locally to collect .rels as well as
.xml, and the independent analysis asserted11tags/run; this did not change the
candidate or require another remote execution. Full suites are not rerun for
unchanged product; only independent evidence/parser checks and PC doc checks
apply to this diagnosis. Registered execution IDs remain N/A; no map promotion.

External report, both retained observations, all XML/rels, exact analyzer and
hashed installed sources:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-docx-expansion-20261031/verification-report.html`.
Stop here for owner review of this plan. No proposed repair has been executed.

## DOCX native run budget repair and Oracle parity execution — 2026-10-31

Owner now authorizes implementing the preceding Core plan and1800-record DOCX
before-full/full/restored proof in an isolated Oracle lab, with original caps,
no real data/service stop/release/install. Single-room implementation then
read-only verification; IDs N/A. Product Implementation Agent owns Core text
emission and bounded Service package pin; Evidence Reviewer owns proof. Existing
canonical record is the work authority; snapshot e9bacb3 rebuilt from validated
sources remains unrelated frontend context and does not override this request.
Size bounded cross-repository, risk routine; correctness risks are native text
boundaries, spacing and narrow773-node estimated margin. Runtime model is the
current host model for inline product execution; one read-only review helper
uses gpt-6-astra/high under the review skill, with no product WORK dispatch.
Registered availability/return fields N/A. Owner-approved diagnosis is immutable
input; no closed registry/context is resumed.

Core base1817efa reconciled against release55315ca for the four relevant DOCX
files. Fresh branch codex/docx-run-budget at
`C:/Users/nekot/Documents/GitHub/flowdoc-core-worktrees/docx-run-budget-20261031`.
Native worktree creation could not target Core outside this chat's registered
roots, so Git created the isolated sibling checkout. Allowed Core mutation:
text.ts and directly related tests, ignored build/proof artifacts; source
intent/guard/resource limits and release checkout forbidden. Existing native
runtime/resources may be reused unchanged from immutable a45fe800 Core Linux
test image; no rebuilding tools during rendering. Service gets a fresh isolated
candidate branch and package/checksum/lock updates only after Core gates.

Proof budget: failing regression, minimal repair, affected Core DOCX tests plus
required build/full Linux Core suite and packed Linux consumer. Then actual
Service build/affected suite and one fresh4GiB/2CPU/one-processing-slot Oracle
three-way run with the exact previous1800-record fixture. Retain failed attempts;
correct only a demonstrated blocker within scope. Review XML/text/format and
public verification disclaimers; native Word visual/kerning fidelity remains
unverified unless explicitly exercised, never implied by XML/package success.
No budget override, data reduction, source-layout mode switch, or repair of
unrelated1GiB generic rendering failure. A failed actual count or semantic gate
returns to implementation/replanning; no false artifact PASS.

Evidence target: one external report with source/package/image hashes, logs,
raw responses, complete DOCX ZIP/XML inspections, DB/task/usage/lookup/reservation
and process/health identity checks, ownership/cleanup and production metadata
comparison. Existing storage FAIL and diagnosis remain intact. Document budget:
this existing record plus ignored execution ledger and one external report;
no new Work/Phase/map or product shared plans. Stop after acceptance coverage;
commit passing development changes only, no automatic Git-main integration,
push/tag/release/installation or real-data recovery.

Implementation checkpoint: Core65f17ee changes only text.ts and the new exact
1800-record regression. Linux Core239DOCX/1271full pass with0skips; scoped
installed DOCX/streaming PDF consumers pass, not full check:package. Service's
fresh candidate overlays only vendor archive/manifest, lock integrity and
code-adjacent README pin/plugin-boundary wording. Its unchanged runtime source
consumes Core SHA04442fd16ec884e5cf87664dcf3562e4d4f25ae4d32b996d033a88642fe1668d.
Archive runtime diff versus the prior pin is only dist/docx/text.js; README
diff is inherited from reconciled Core base. Independent read-only review found
no Critical/Important defect; it does not substitute for pending API proof.

Verification prerequisite correction: initial Service full run741pass/1fail/3skip
correctly rejects the retained FlowDocMake fixture because its explicit supported
Core SHA647235de differs from new Service-advertised04442fd1. This is confirmed
pin incompatibility, not a DOCX render failure or an assumed flaky readiness
test. Preserve that negative result. Create only a disposable LAB fixture copy
with the new explicit SHA, retain the strict compatibility check, and bind it
in the fixture snapshot hash manifest (the original profile was not listed).
All other snapshot entries verify unchanged. No plugin repository, prepared
archive or installed profile is edited. Rerun affected consumers and the complete
Service suite; never relabel the failed initial full run as passing. Reuse only
unchanged build/Core evidence. Before future real plugin use/promotion, review
and separately authorize the matching plugin pin; existing fixture compatibility
must not be inferred from the calibrated positive proof.

Correctness blocker and bounded plan revision before further implementation:
first actual1800-request lab flowdoc-docxfixapi-da64dce44cf3 fails INVALID_DATA
in composing despite the new Core writer succeeding. Separate public-Core
diagnostic flowdoc-docxfixreceipt-c7f892476b5e creates215075-byte DOCX; complete
message shaped exactly as current child has839303characters, dominated by1812
adaptations/838665characters, beyond the unchanged131072-character parent guard
in tasks/render.ts:195. This is not interception of that failed task's IPC;
the actual API failure plus original implementation and same-fixture public
receipt establish the incompatible bridge path. Parent already deliberately
projects this receipt to byteLength/sha256/pageCount/mediaType and DOCX
disclosures after the size guard; full adaptations never reach downstream task
records or clients through this bridge. Existing fields project to623characters.

Smallest correction within the authorized end-to-end Core/Service lab goal:
allow Service tasks/artifact.ts, tasks/render-child.ts and a dedicated regression
to move that SAME existing receipt projection before IPC. No public/Core receipt
contract change, omitted public diagnostics, new owner, transport version, cap
increase or unrelated behavior repair. Preserve separate warnings/summary,
hash/length/seal checks, disclosures and parent's unchanged guard/validation.
This revises the earlier package-pin-only implementation-path assumption, not
permission for broad Service refactoring. Add functional RED, then minimal
adapter fix; freeze/rebuild Service candidate and repeat affected/full Service
checks plus fresh API three-way. Never reuse passing tests from the earlier
Service image as final proof of this source correction. Retain all earlier
FAILs and current Core/packed-package passing evidence unchanged. Full Core
need not repeat because this bridge correction changes no Core file/package.

Final result: PASS_BOUNDED_DOCX_1800_ORACLE_STORAGE_PARITY. Core65f17ee on
codex/docx-run-budget and Servicef36f821 on codex/docx-core-consumer committed
after impact verification; both isolated worktrees clean. Core changes text.ts
and nativeRunBudget.test.ts. Service changes artifact.ts, render-child.ts,
task-artifact-receipt.test.mjs plus the four package-pin/README files. Parent
render.ts/its131072-character guard, Core XML50000/drawings10000/output32MiB
caps, normalization, schema, delivery/public receipt and warning/summary/seal
contracts remain unchanged. No primary-branch integration or release/install.

Proof and lineage:

- Core RED reproduces DOCX_OUTPUT_BUDGET_EXCEEDED; Windows focused30pass,
  Linux DOCX239pass and full Core1271pass,0failed/0skipped. Build/native-session
  and scoped installed Linux DOCX/streaming PDF consumers pass. No full
  check:package multi-consumer claim; unchanged native/runtime/resources reused.
- Old Core-only Service full suite first741pass/1fail/3skip (strict old-plugin
  pin rejection), then742pass/0fail/3skip with the calibrated disposable plugin
  fixture. Original rejection is retained. That image fails the first actual
 1800API task with INVALID_DATA; it does not verify the final bridge fix.
- Bridge regression on old image2failed (839303>131072 and PDF extra diagnostics),
  then2passed on final rebuilt image. Final whole Service suite744pass/0failed/
 3skipped, recorded on flowdoc-docxfixservice-bab71a466307. Skips are unconfigured
  HEIGHT_DELIVERY_CONFIG operator cases, not marked PASS. Disposable plugin
  profile pins the actual04442fd1 archive and all snapshot files verify;
  plugin repository/prepared archive/installed profile were not changed.
- New Service verification image
  `sha256:a17bf735c314d11c4b97ca103015037d77a9d6eb159550fe31abbc6b5c093d31`,
  runtime image
  `sha256:ce49f3c462e42cc80ac82f94e77e2f91395fa52e754de4274304df7f039df87a`,
  source archive SHA
  `f4c29edf049552fb68b0ce7023a1f8619a10b27f89c3c992543f5f30dd837e53`.
  All seven local overlay hashes still match the tested source. Core archive
  stays04442fd16ec884e5cf87664dcf3562e4d4f25ae4d32b996d033a88642fe1668d.
- Independent read-only review covered Core/pin and then the new bridge delta,
  with no Critical/Important defect. Review is not substituted for runtime proof.

Actual successful lab: flowdoc-docxfixapi-77143a7346c8, private internal network,
4GiB/2CPU/one processing slot, fresh PostgreSQL lab DB/migrations027, own768MiB
tmpfs. Same1800-record402431-byte multipart SHAe90673bb/payload SHA853ea591 as
the original failure, no cap override or record reduction. API proof began
after focused green while the full Service suite ran separately; acceptance
waited for final full744pass, and the frozen image/source did not change.

Before full: task succeeded/delivery succeeded,215083-byte DOCX. During full:
actual ENOSPC/free0 on /lab only, already-admitted task failed STORAGE_IO,
delivery not_started and wire has no artifact; task/usage/lookup agree. After
removing only the lab filler: succeeded/delivery succeeded,215079-byte DOCX.
Health200/503/200 matches those resource checkpoints, same API container/PID/
StartedAt, restart0. Health503 is not the status of the already-open multipart
request, which carries the error event. This does not claim a new-admission
request was issued while storage was full.

Both delivered DOCX files independently pass ZIP CRC, all25XML/rels parses,
19internal relationship resolutions, content type/officeDocument relationship,
4embedded font parts and Sarabun/400twip-atLeast properties. Exact text,
whitespace and order Record0..1799 match;1800paragraphs/1800runs, full-package
XML49227<=50000, drawing0, margin773nodes. SHA/length/MIME/filename and
pageCount=null/wordVerified=false/fieldRefresh=required/buffered=true match wire
receipts. Package bytes differ (docProps/core.xml, fontTable and font parts);
byte equality or native Word visual/kerning/pagination equality is not claimed.

Final DB has3tasks/3jobs/3usage, each one terminal event, no extra execution in
the observed window, queue slots free and unreconciled reservations0. Reserved
storage equals actual retained files: success task files0bytes; failed input
402299bytes is retained by policy, not an unused reservation leak. No automatic
resend was observed. This is not a soak/long-duration or all-stop persistence
proof. All current owned containers stopped and production container identity/
start/restart metadata unchanged across lab boundaries; no production SQL/storage/
service action. No stopped lab/data/network was deleted to make checks pass.

Lab prerequisites retained separately: unsupported legacy Docker COPY --chmod
attempt; generated consumer-fixture ownership correction without rerunning
unchanged passing Core tests; first plugin-calibration helper missed an unlisted
profile hash and was corrected before tests; stale-plugin rejection; real
Core-only API failure; and default Docker address-pool exhaustion at35networks.
For the last, inventory selected10.240.0.0/24 after checking all Docker subnets
and host routes. Only the fresh lab uses that subnet; existing networks/services
remain intact. Failed network creation has its own prerequisite boundary record.

Remaining/deferred:773-node margin is narrow and does not prove all1800-record
templates; native Word visual/kerning/pagination; original1GiB generic
RENDER_FAILED cause; physical disk/inode/DB exhaustion, soak and actual-data
recovery. Before real plugin use or future promotion, reconcile/authorize its
matching strict Core pin; calibrated lab fixtures prove no installed-plugin
compatibility. No further fix/test/integration is automatic from this PASS.

Report with raw wires, actual DOCX files, source/package/image hashes, full
results, both regressions, review, fixture calibration and failed attempts:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-docx-run-fix-20261031/verification-report.html`.
Single-room execution/Phase/Checklist IDs N/A; no map/registry promotion.

Identity note: raw API packets retain the earlier human-readable
"2c089b5+Core65f17ee-package-pin" label. For the final bridge fix, authoritative
identity is frozen source archive f4c29edf, runtime ce49f3c4/verification a17bf735
and Servicef36f821; the raw label does not imply the earlier Core-only image.
