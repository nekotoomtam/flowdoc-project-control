# FlowDoc 0.3.0 — Capacity and API Adoption Plan / Roadmap

## Authority Boundary and status

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
This is the single planning authority for this bounded roadmap, not evidence
of capacity, production readiness, or authorization to publish a release.
User requested the draft on 2026-10-11: start with RAM and concurrency, then
a small API client and large documents; **do not touch release**.
Initial approval covered documentation only; owner subsequently authorized R0
preparation and one reference run. R1–R5 remain pending. Work/Phase/Checklist execution IDs: N/A (single-room,
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

- [x] Verify development/release identities and clean state, input/template/font
  hashes, installed Core archive, Node/native/Python versions and cache settings.
- [x] Record host RAM/CPU, Docker VM limit, current available memory and other
  load. Select a finite CPU/memory budget with host reserve before running.
  Keep that total budget constant when comparing1/2/4; don't give4workers four
  times the memory then claim better capacity. Record any swap policy.
- [x] Define timestamps: request/upload start/end, admission, queued, claim,
  preparation, rendering, terminal state, download end. Report queue wait,
  worker time, API elapsed and batch makespan separately.
- [x] Capture container memory.current/peak, working set, CPU and memory.events
  plus Node/native child RSS where available; sample at200ms initially.
  Mark unavailable or sampled peaks honestly. DB and host counters are separate.
- [x] Validate collection with one excluded warm-up/reference run. Do not add
  production logging or force GC to manufacture memory release.
- [x] Compare PDFs using decoded page drawing/resources/geometry and link
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

## 7. R0 preparation result — 2026-10-11

Owner authorized R0 only. Inline Evidence Reviewer/discovery, routine risk,
no registered execution IDs. Service owns the task-local measurement harness;
Core and Service product source/configuration/packages are unchanged. Existing
checkout used only for ignored artifacts; no worktree or branch required.
Proof budget consumed: one excluded warm-up, PDF checks, observer sanity checks
and documentation validation. No R1 measured jobs or release changes.

Evidence: local ignored `flowdoc-service/artifacts/capacity-030/r0-20261011/`.
Includes manifest.json (source/input/archive hashes and environment),
installed-identities.log (installed package files including fonts/native tools,
cache and engine sources), effective-container-limits.ndjson, host snapshots,
samples.ndjson, job-times.log, api-result.json, measurement.json, parity.json,
pdf-text-check.json, group-page-check.json, cleanup.json and reproducible scripts.
Private source remains local. verifyVendor passed. Package0.2.13/commits and
release refs match section1. Cache inspected at its actual callsite/default:
per-generation32MiB /8192entries; no cache override or GC forcing.

| R0 criterion | Observed evidence / boundary |
| --- | --- |
| Resource budget | API1GiB /2CPU; DB256MiB /0.5CPU; swap disabled; effective Docker settings captured. Docker VM limit7.61GiB/20CPU; Windows physical15.71GiB |
| Collection | 251 samples across50.37s; target200ms, maximum gap224.87ms, maximum observer collection3.43ms; API/render/native children classified separately |
| Memory counters | API sampled peak working set402.48MiB; sampled memory.current422.70MiB; cgroup lifetime peak438.33MiB (different counters, not interchangeable) |
| Post-job observation | API working set44.36MiB before,158.23MiB after30s; final10s range158.22–158.48MiB. No persistent render/shaper/segmenter child or OOM. One warm-up cannot establish a leak or steady-state ceiling |
| DB boundary | Separate lifetime peak143.27MiB, no OOM; CPU counters recorded. DB sampled per-process RSS not collected; no claim of a full DB memory profile |
| Time | DB queue0.102525s, worker16.366440s; HTTP upload-through-download observation17.413s. Stage transitions polled250ms, not exact internal stage durations |
| Output parity | 98pages; decoded drawing/resources/geometry/link equality to accepted API PDF; all1,457values,363details,396links and29group starts pass; same4low-resolution warnings |
| Lifetime | Second download410; output/render-temp empty; staging follows existing expiration policy; task containers/volumes/networks/image/credential file removed |

Observer and Node client run inside API cgroup. Their separately labelled RSS
does not permit exact subtraction from aggregate usage. Warm-up values above
are setup diagnostics, not an R1 statistical sample or performance improvement
claim. No production runtime instrumentation was added. Content check initially
needed missing mapping-check.json copied from the existing baseline; rerun of
that check passed without repeating the export or changing its data.

### Host reserve finding and R1 prerequisite

Host free RAM fell from roughly2.8GiB before setup to465MiB during the run,
then recovered to about1.1GiB after cleanup. Container ceilings protected their
own scope but did not guarantee host reserve. This is a concrete R1 blocker,
not evidence of a FlowDoc leak. Other load / Docker VM retention was not
attributed and must not be guessed or resolved by stopping unrelated programs.

R0 collection/parity preparation is complete; **R1 is not cleared to run yet**.
Before any further jobs, require at least1.5GiB host free at start, and monitor
free RAM every1s alongside container counters. Three consecutive samples below
1GiB stop this task's API and mark the measurement invalid. Check again after
image build and before starting a workload. Reassess the fixed total test budget
before parallel cells; don't multiply1GiB by4 without an explicit host budget.

`host-guard.ps1` is prepared with task-name restriction and threshold/reset
self-test PASS. Its live integration and Docker-stop branch are **not yet
exercised**; they are a prerequisite at R1 setup, not claimed PASS here.
The original run.mjs is retained as the exact executed R0 harness and does not
silently acquire that later guard. Wire it into a fresh R1 run directory before
admitting jobs. No second export was run merely to demonstrate the guard.

Acceptance coverage: R0 identities, measurements, time boundaries and output
oracle are established. Safe host headroom for repeated/concurrent runs remains
blocking. Project Control owns this result; no map or runtime-readiness promotion.

## 8. R1A single-worker attempt — blocked before admission

Owner cleared applications, then authorized only R1A:5 sequential measured jobs
in the same API instance, host guard enabled, release unchanged. Preflight
free RAM was approximately4GiB. This is a new discovery attempt, not a revival
of the completed R0 execution. Evidence Reviewer, Service task-local ignored
harness; execution IDs N/A. No product source/config/package changes.

Evidence: `flowdoc-service/artifacts/capacity-030/r1a-20261011/`. Input hashes
and installed Core file hashes match R0; verifyVendor passes. Same API1GiB/2CPU
and DB256MiB/0.5CPU, no swap. Harness prepared to run one excluded warm-up in
the fresh API and5 measured jobs; this additional warm-up is necessary because
the R0 API was removed, and is not added to measured statistics.

The host guard is now integrated and its stop branch exercised: before any
document job, injected low-reserve samples caused it to stop only the named
task API container. Docker confirmed that container stopped. It was restarted
before the intended warm-up. `host-stop-proof.json` records PASS; live memory
samples are separately retained and never replaced by injected values.

**R1A did not start document generation:0/5 measured jobs,0warm-ups.**
The mandatory live host-reserve check immediately before the first job failed
the1.5GiB requirement. Host observer samples during setup ranged from3957.48
to1528.56MiB; the synchronous pre-admission check triggered the failure but its
exact value was not retained. Do not attribute the difference solely to the
API, a leak, Docker or another application. No latency/RAM benchmark result is
claimed from this attempt. The synthetic stop probe is proof of guard operation,
not an actual low-memory export failure.

Cleanup PASS: task containers, volumes, networks, image and temporary credentials
removed. Host free RAM after cleanup was about1.75GiB. Raw failures and harness
remain local/ignored for diagnosis. Core/Service development and release refs
unchanged. R1B/R1C were not attempted. Next attempt requires fresh host headroom
checks after build/start and before admission; do not lower the agreed reserve
or silently rerun while near its boundary. Record the exact pre-admission
memory value in the next harness before asserting its threshold.
