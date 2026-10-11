# FlowDoc 0.3.0 — Capacity and API Adoption Plan / Roadmap

## Authority Boundary and status

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
This is the single planning authority for this bounded roadmap, not evidence
of capacity, production readiness, or authorization to publish a release.
User requested the draft on 2026-10-11: start with RAM and concurrency, then
a small API client and large documents; **do not touch release**.
Current action is documentation only. All measurement and implementation steps
below are pending. Work/Phase/Checklist execution IDs: N/A (single-room,
unregistered planning); R0–R5 below are local roadmap labels, not registry IDs.

Goal: establish a measured operating envelope for the existing PDF service,
prove a small external caller can use it, and document controlled limits.
Keep the existing template/API/PDF pipeline. Measure before proposing a new
worker architecture. Stack remains the current Node/TypeScript Service,
PostgreSQL, packaged Core and pinned Linux container runtime.

Governing policy: [workflow economy](flowdoc-workflow-economy-policy.md).
Approved brief: owner's request in this conversation and the scope below.
When implementation is separately activated, use inline execution with bounded
checks; do not create agents or separate rooms merely because the roadmap has
multiple phases. Future PLAN model default: gpt-6-astra / medium under policy;
actual execution model/host availability is resolved at kickoff, not inherited
or claimed by this draft. No registered execution is opened here.

Writing classification: Project Control canonical plan. Size: medium roadmap,
small documentation change; risk: routine. Document budget: this one combined
plan/roadmap, with results appended here and repository-owned scripts/tests at
execution time. No new maps, registry, schema or duplicate report required.

## 1. Baseline: proven vs unknown

Baseline is local 0.2.13. Core candidate e889393 / release e63f0c4;
Service candidate a73afae / release4bc1b84. Verify exact commits, package hashes
and environment again when execution begins; no silent upgrade of the baseline.
[Release closeout, section11](flowdoc-table-row-groups-contract-2026-10-11.md)
records manuals, 497 Core tests, 175 Service tests and a real HTTP SRS export.

Reusable local input/evidence: `flowdoc-service/artifacts/release-0213-srs/`
contains template.json, request.json, uploads, client.mjs, run.mjs,
verify.py, check-group-pages.py, api-result.json and spaceship-srs.pdf.
Reuse source inputs and verification logic, not expired upload IDs or the
deleted test DB. Upload again into a fresh isolated trial. Keep private source
data and PDF outputs out of Git; commit only sanitized reusable harness code.

Proven for that run: 98 pages, 13 uploads, 1,457 checked values, 363 exact
requirement details, 396 valid internal links and 29 group starts retained.
One observed job16.473s / upload-through-completion16.890s is not a latency SLA.
Four IMAGE_LOW_RESOLUTION warnings are the accepted input baseline; don't hide
new warnings or change source images to improve the measurement.

Read-only inspection of `flowdoc-service/src/jobs/processor.ts` shows a
database advisory lock60430404 and a serial loop awaiting each job. Therefore
concurrent requests are not concurrent render workers. `src/jobs/render.ts`
and render-child.ts are the process-boundary inspection points at kickoff.
Earlier RAM findings in the [page-system record](flowdoc-page-system-roadmap-2026-10-10.md)
are method references only: different versions/data/counters must not become
a numerical before/after comparison with the new98-page corpus.

Unknowns: current peak and post-job retained memory (blocking worker sizing),
safe render parallelism (blocking a concurrency recommendation), large-document
limits (blocking a300–700-page claim), and client friction (to discover in R3).
Hosting size and public authentication are deferred; this round is local only.

## 2. Scope and alternatives

- Preserve text wrapping, geometry, source values, template version pinning,
  image preparation and file lifetime behavior throughout measurement.
- Keep cache/font/shaping settings identical across initial cells. Record their
  effective values; do not infer that earlier32MiB settings are current proof.
- Prefer a bounded queue and conservative worker limit if they solve the need.
  A pool, shared shaping process, distributed queue or DB redesign requires an
  observed problem and a separate bounded decision after R1.
- A single-process memory figure misses native descendants; use container totals
  and separate per-process diagnostics. Do not sum overlapping counters.
- Four parallel workers and700pages are exploratory targets, not mandatory
  supported promises. A lower limit is acceptable only when measured, enforced
  and reported clearly; failed runs are not relabelled as successful exports.
- Out of scope: Editor/WYSIWYG, DOCX, new Node models, automatic heading numbers,
  media library, public deployment, multi-user permissions, layout redesign.

## 3. Roadmap and acceptance

| Phase | Owner / deliverable | Exit condition |
| --- | --- | --- |
| R0 — Measurement setup | Service harness; Core inspected read-only | Input/package/environment fixed; counters and time boundaries defined; reference PDF verified; isolated limits and stop rules recorded |
| R1 — RAM and concurrency discovery | Service-led, unchanged Core package | Single-job baseline, queue bursts1/2/4 and safe isolated render overlap1/2/4 measured or explicitly stopped; post-job memory and output parity checked; recommendation with limits and unknowns |
| R2 — Apply only necessary limits/remedies | Service; Core only if evidence assigns a Core issue | Chosen queue/worker/input limits actually enforced; focused failure/recovery tests; same PDF/wrap; exact implementation scope decided from R1 first |
| R3 — Small API client | Service examples/client | Upload → submit → status → download works using public API only; validation failure, expired resource, failed job and download lifetime understandable without Core internals |
| R4 — Large-document envelope | Service harness + Core output verification | Approximately300/500/700 actual pages attempted progressively within safety budget; successful outputs preserve content/order/links; failures bounded and supported maximum documented |
| R5 — 0.3.0 acceptance | Project Control + both owners | Manuals/configuration match evidence, relevant regression/package checks pass, reproducible example and known limits recorded; separate owner instruction required before release promotion |

Dependency order: R0 → R1 → R2 decision → R3 → R4 → R5. If R4 exposes a
necessary bounded limit fix, return to R2 with that specific evidence, not an
open-ended optimization round. Later phases are outlines until prior findings
resolve their implementation choices; don't prewrite speculative architecture.

## 4. First execution plan: R0–R1 only

Authority: discovery; do not change the product candidate. Service owns a
measurement harness (proposed `scripts/measureCapacity.mjs`, final location
confirmed after inventory of reusable scripts). Core owns any later renderer
fix. Outputs go to ignored `artifacts/capacity-030/<run-id>/` with manifest,
raw samples, per-job timing/status, summaries, PDF checks and cleanup result.
No output contains credentials. Keep service/database separation intact.

### R0: Make each measurement interpretable

- [ ] Verify development/release identities and clean state, input/template/font
  hashes, installed Core archive, Node/native/Python versions and cache settings.
- [ ] Record host RAM/CPU, Docker VM limit, current available memory and other
  load. Select a finite CPU/memory budget with host reserve before running.
  Keep that total budget constant when comparing1/2/4; don't give4workers four
  times the memory then claim better capacity. Record any swap policy.
- [ ] Define timestamps: request/upload start/end, admission, queued, claim,
  preparation, rendering, terminal state, download end. Report queue wait,
  worker time, API elapsed and batch makespan separately.
- [ ] Capture container memory.current/peak, working set, CPU and memory.events
  plus Node/native child RSS where available; sample at200ms initially.
  Mark unavailable or sampled peaks honestly. DB and host counters are separate.
- [ ] Validate collection with one excluded warm-up/reference run. Do not add
  production logging or force GC to manufacture memory release.
- [ ] Compare PDFs using decoded page drawing/resources/geometry and link
  destinations, ignoring only known volatile metadata/IDs. Reuse text/order/
  group-start checks. File-byte hash alone is not a layout/wrap oracle.

### R1A: One worker, sequential jobs

- [ ] Run5 measured jobs serially in the same API instance after warm-up, fresh
  upload session per job. Keep the processor alive to reveal retained growth.
- [ ] Measure idle before first job and30seconds after each terminal/download
  cleanup. If still declining, extend once to120seconds and report it.
- [ ] Record peak and post-idle memory per job, leftover child processes,
  output/temp/staging lifetime according to policy. Allocator retention alone
  is not proof of a leak; persistent upward trend is a follow-up question.
- [ ] Report every sample, mean, sample SD, min/max and median. Five runs are
  descriptive, not sufficient for a claimed p95/p99 or universal SLA.

### R1B: Concurrent callers using the existing queue

- [ ] Submit bursts of1,2,4 jobs to one API/DB,3 measured batches per level;
  retain its single processor. Label as queue concurrency, not worker scaling.
- [ ] Check each job has one terminal outcome, pinned version and matching
  output; record queue delay, completion order and batch makespan. Do not
  assume HTTP submission order is a strict FIFO contract without evidence.
- [ ] Check the API remains responsive while rendering; no cross-job inputs,
  upload IDs or outputs become mixed. Download each produced PDF normally.

### R1C: Isolated parallel rendering experiment

- [ ] After prior cells are safe, run1,2,4 isolated API/DB stacks or supported
  independent harness processes with separate resources,3 batches per level.
  Prefer existing isolation support; never remove the advisory lock or run
  competing processors against the same DB to simulate worker support.
- [ ] Prove overlapping render intervals actually occurred. Record aggregate
  memory/CPU under the same total host budget; DB overhead separately.
- [ ] Label this as capacity exploration, not support for a multi-worker shared
  queue. If isolation would materially alter the product or exceed the budget,
  stop this cell and return the limitation for a design decision.

### Stop rules and bounded proof budget

Before execution, record concrete memory/CPU limits. Stop admitting further
work or increasing parallelism if memory usage stays above85% of the configured
test budget for three samples, OOM occurs, output parity fails, a job is lost,
or the host becomes unresponsive. This85% threshold is an initial conservative
experiment guardrail, not a measured production recommendation. Let safe jobs
drain; terminate only task-owned containers when necessary and record failures.
Respect existing per-job timeout; bound total batch wait by serial baseline ×
job count ×2 plus30seconds. A timeout is evidence, not a reason to raise limits
silently. Do not increase from2 to4 after a stopped2-worker cell.

Budget: one reference warm-up,5 sequential jobs,3 batches per queue level and
3 per isolated level (maximum47 measured jobs, plus the warm-up, if all cells run). One rerun of
an invalid measurement is allowed with its cause retained. Additional sweeps,
cache tuning or profiling need a concrete unresolved finding and scoped plan.
If startup/runtime conditions make a run incomparable, label it invalid rather
than omit it from raw data. Stop once the decision has sufficient coverage.

R1 exit: concise table of memory/time/success by mode and level, parity results,
post-idle trend, candidate operating limit and safety margin with rationale.
Separate measured facts, hypotheses (including leak causes), pending decisions
and deliberately untested scope. No automatic source fix or version bump.

## 5. Later-phase guardrails

R2 first considers existing configuration and serial admission before more
workers. If a shared worker pool becomes necessary, explicitly design job
claim ownership, cancellation, crash recovery and process/cache isolation;
do not infer those are solved by the R1C isolated experiment.

R3 is a small script/CLI example, not an Editor or SDK platform. User supplies
data, never an internal composed Core tree. Report remaining integration
friction; a developer-authored client is not proof of external customer demand.

R4 first expands the existing representative corpus with unique IDs and known
expected counts. Preserve image/text/table diversity and name synthetic data
as synthetic. Record actual generated page counts, not assumed exact counts.
Try300 before500 before700; stop escalation on unsafe behavior. Use real data
when available without blocking on its absence. If a configured limit rejects
the document, report that rejection as the current boundary. Default limits
and deliberately adjusted diagnostic runs must remain separate.

R5 requires human review of representative PDFs alongside automated content/
layout checks. Publish a supported envelope for the measured environment,
not a universal production claim. If a target remains untested, explicitly
defer that target with owner agreement rather than marking it PASS.

## 6. Version and completion rules

0.2.13 remains the baseline and release stays untouched during this work.
Documentation and measurements alone do not trigger package increments.
Working code changes with passing relevant checks may increment the development
patch version; there is no decimal9 rollover rule. Only affected packages need
a development bump; paired release versions are reconciled at R5. Target0.3.0
is a milestone proposal, not a date promise or automatic release authorization.

Planning acceptance: agreed scope, measured-vs-unknown boundary, ordered phases,
specific R0/R1 matrix, controlled resource stop rules, outputs and owner boundaries
are explicit. Review links and final diff, run Project Control check:data and
commit this document. Product tests/benchmarks are not run for this draft.
No product map or generated projection is promoted by writing this plan.
