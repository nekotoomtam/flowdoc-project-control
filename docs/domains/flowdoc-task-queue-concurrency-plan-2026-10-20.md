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

Status: Stage 0 contract closed; Stages 1–2 verified on isolated candidate branches
on 2026-10-20 under the owner's subsequent implementation requests. Stages 3–4
remain pending. Numeric resource values below are trial policy decisions, not
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

Stage 0 is closed as a documented contract. Stages 1–2 results are recorded below;
Stages 3–4 checks remain future acceptance.
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
