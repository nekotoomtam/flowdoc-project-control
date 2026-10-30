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
