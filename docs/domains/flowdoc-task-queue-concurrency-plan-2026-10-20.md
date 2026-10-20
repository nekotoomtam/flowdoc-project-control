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

Status: owner-approved design direction and staged plan, recorded before
development. Stage 0 resource thresholds and implementation details remain to
be closed. This document is not implementation Evidence, a benchmark result,
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
`processing.ts`, `render.ts`, `quota.ts`, `workspace.ts`, and
`src/jobs/processor.ts`. Recheck them at Stage 0 rather than treating this
snapshot as permanently current.

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
   wait/active receive/normalization timeout boundaries at Stage 0 so admission
   leases cannot silently expire while a legitimate request waits.
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
- Stage 0 must close the numeric headroom/reservation model, global high-water
  actions, memory sample source/interval, and response to unavailable metrics.
  Existing quota/path/checksum guards must remain active. Never force cache
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

All stages below are pending. Checks describe future acceptance, not tests run
while writing this document. Implementation must remain isolated until separate
integration approval.

| Stage | Deliverable / likely owner paths | Required future acceptance |
| --- | --- | --- |
| 0 — close contract | Project Control definition; inspect Service policy/intake/processor/transport and exact base | Close counting, atomic ownership, FIFO, receive/normalization slots and timers, global RAM thresholds, insufficient-space behavior, feedback, and proof-only scheduler hold; decide whether a migration is actually necessary |
| 1 — admission and receiving | Service `tasks/policy.ts`, `repository.ts`, `intake.ts`, HTTP/feedback boundary as impacted | One owner can admit nine; concurrent requests cannot oversubscribe; receiver saturation waits with bounded buffers; auth, storage exhaustion, disconnect while waiting/receiving, lease and expiry retain correct behavior |
| 2 — two-worker scheduler | Service `jobs/processor.ts`, `tasks/processing.ts`, render/process lifecycle as needed | Two workers truly overlap and never exceed two; FIFO eligible claims are unique; one failure/cancel cannot affect another; leader loss, restart, reaping, legacy jobs and sender-slot overlap do not leak or double-start work |
| 3 — global resources and consumer impact | Service memory/storage guards and cleanup; FlowDocMake only where affected | Enforce whole-container RAM/headroom, disk reservations and deletion with two workers plus receive/send overlap; no deadlock on pressure; retained source and usage history remain correct; existing client feedback/PDF contract works |
| 4 — mixed workload proof | Isolated real API + PostgreSQL + named volume, frozen UAT/SRS mocks and candidate | Run nine admitted tasks per comparison arm, all queued before release; compare concurrency one versus two under the same profile; verify output, resources, cancellation and cleanup; report limitations before any integration/release/install |

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
  and through a proposed 30-second idle window. Separately state any additional
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

## Existing verification inputs and remaining decisions

The local named-volume verification receipt is at:
`C:/Users/nekot/Documents/Codex/2026-10-20/uat-volume-verification/receipt.json`.
Its measurements and all-page checks cover serial UAT on the frozen buffer
candidate, interruption/restart, source retention, expiry simulation, and
cleanup. They are reusable inputs, not two-worker or nine-task Evidence.

Before runtime work, close Stage 0 and the exact Git base, resource thresholds,
receive-wait timeout semantics, DB/pool connection budget, interaction with
legacy jobs/sends, and whether fairness beyond one owner's trial is needed.
Default scope excludes a queue broker, multi-instance failover, new public batch
API, automatic retries, billing changes, new document capabilities, release,
and production installation. Add none merely to satisfy the trial.
