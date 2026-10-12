# FlowDoc 0.3.0 — Capacity and API Adoption Plan / Roadmap

## Authority Boundary and status

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
This is the single planning authority for this bounded roadmap, not evidence
of capacity, production readiness, or authorization to publish a release.
User requested the draft on 2026-10-11: start with RAM and concurrency, then
a small API client and large documents; **do not touch release**.
Initial approval covered documentation only; owner subsequently authorized R0
preparation and one reference run, then R1A and R1B measurements. R1A/R1B passed;
R1C two-render trial passed; four-render exploration is owner-deferred. R2 planning
is active; R2 parts1–2 passed; part3 and R3–R5 remain pending. Work/Phase/Checklist execution IDs: N/A (single-room,
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
| R3 — Small API test page | Service examples/client | Upload → submit → status → download works using public API only; validation failure, expired resource, failed job and download lifetime understandable without Core internals |
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

- [x] Run5 measured jobs serially in the same API instance after warm-up, fresh
  upload session per job. Keep the processor alive to reveal retained growth.
- [x] Measure idle before first job and30seconds after each terminal/download
  cleanup. If still declining, extend once to120seconds and report it.
- [x] Record peak and post-idle memory per job, leftover child processes,
  output/temp/staging lifetime according to policy. Allocator retention alone
  is not proof of a leak; persistent upward trend is a follow-up question.
- [x] Report every sample, mean, sample SD, min/max and median. Five runs are
  descriptive, not sufficient for a claimed p95/p99 or universal SLA.

### R1B: Concurrent callers using the existing queue

- [x] Submit bursts of1,2,4 jobs to one API/DB,3 measured batches per level;
  retain its single processor. Label as queue concurrency, not worker scaling.
- [x] Check each job has one terminal outcome, pinned version and matching
  output; record queue delay, completion order and batch makespan. Do not
  assume HTTP submission order is a strict FIFO contract without evidence.
- [x] Check the API remains responsive while rendering; no cross-job inputs,
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

R3 is a small local API test page, not an Editor or SDK platform. User supplies
data, never an internal composed Core tree. Report remaining integration
friction; a developer-authored client is not proof of external customer demand.
Owner clarification2026-10-12: show upload, queue, preparation, rendering,
download and errors using actual API feedback. Defer the six-near-simultaneous
request trial to this page; do not run it during R1C. No invented progress or ETA.

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

## 9. R1A authorized retry — PASS, serial scope only

Owner requested a fresh RAM check and continuation if safe. Same discovery scope,
product baselines, input hashes and container budgets; no runtime fix or version
bump. Prior failed attempt retained in section8. This retry consumes the bounded
retry allowance and completed one excluded warm-up plus5 measured jobs, with the
same API process throughout those6jobs and a fresh upload set per job.

Evidence: local ignored
`flowdoc-service/artifacts/capacity-030/r1a-retry-20261011/`. Key files:
manifest.json, host-memory-phases.json, host-samples.ndjson, samples.ndjson,
results.json, summary.json, completion.json, cleanup.json, run.mjs,
summarize.mjs and warmup/run-1…run-5 directories with individual reports/PDFs.
Private content remains uncommitted. Installed package hashes equal R0 exactly.

Live host guard was enabled across setup and all jobs; reuse of section8's
synthetic Docker-stop proof is explicitly recorded. Free host RAM before build
3629.57MiB, after build3579.55MiB, after DB start3490.71MiB, after API start
3398.93MiB; before warm-up3380.13MiB. Lowest observed across the whole attempt
2806.71MiB. Every pre-admission check exceeded1536MiB. No guard stop or OOM.
These checkpoints show this attempt's changes; they do not explain the earlier
attempt's much larger drop or attribute host allocations to a single process.

| Run | DB worker seconds | Observed API cycle seconds | API sampled peak working set MiB | After30s idle MiB |
| --- | ---: | ---: | ---: | ---: |
| 1 | 13.588 | 14.375 | 432.18 | 199.50 |
| 2 | 13.079 | 13.997 | 474.46 | 221.65 |
| 3 | 15.324 | 16.389 | 464.52 | 223.14 |
| 4 | 13.493 | 14.393 | 459.17 | 223.56 |
| 5 | 13.621 | 14.388 | 454.86 | 223.75 |

Worker mean13.821s, sample SD0.868s, median13.588s, range13.079–15.324s.
Observed API cycle mean14.708s, sample SD0.954s, median14.388s,
range13.997–16.389s. API cycle includes upload, polling, download and the
client's repeat-download check; it is not pure renderer duration. Queue mean
0.101985s from database timestamps. All raw samples and statistics retained.

Peak working-set mean457.04MiB, sample SD15.71MiB, max474.46MiB. Sampled
memory.current max488.22MiB; whole-container lifetime memory.peak516.43MiB
spans warm-up and all jobs. These counters have different definitions and are
not interchangeable. API cgroup includes the client and observer. DB counters
remain separate. Container sampling max gap247.94ms versus200ms target;
host sampling max gap1493ms includes the PowerShell/CIM collection overhead.

Idle memory rose from warm-up166.22MiB to199.50/221.65MiB, then changed by only
about0.61MiB across the last three measured endpoints223.14→223.75MiB. API RSS
at those last endpoints was241.70/241.52/241.33MiB. This small sample is consistent
with retention approaching a plateau, not proof of its cause or absence of a
slow leak. No forced GC or restart; source uploads retain their normal expiry.
All idle windows stayed30s: no measured decline exceeded the harness's1MiB
last-window extension trigger. Longer-term retention remains outside this pass.

Acceptance checks for all6PDFs:98pages; decoded drawing, resources, geometry
and link destinations exactly match reference;1,457values/363details/396links
and29group starts pass. Same4image-density warnings; no new warning class.
All jobs succeeded; second downloads410; output/render-temp directories empty;
no render/shaper/segmenter descendants remained after idle. Host and container
guards stayed enabled. Task containers, volumes, networks, image and credentials
removed after evidence collection. Both product checkouts and release refs are
unchanged; no production-readiness, parallelism, throughput or SLA promotion.

Decision: R1A complete. Next bounded work is R1B queue bursts1/2/4 with the
existing serial processor, subject to a new host preflight; R1C independent
parallel stacks remain later and require a fixed aggregate memory budget.
Do not infer four-worker support by multiplying this single-worker result.

## 10. R1B queue bursts — PASS, completed 2026-10-12

Owner authorized only queue concurrency1/2/4 with the existing serial processor,
RAM guards enabled, no release change. Discovery role/scope unchanged. Accepted
measurement matrix:3 batches per level,21 successful measured jobs. Same pinned
0.2.13 source/package/input identities and API1GiB/2CPU, DB256MiB/0.5CPU budgets.
No runtime code, configuration default, schema, package or version change.

Artifacts under `flowdoc-service/artifacts/capacity-030/`:
- `r1b-20261011/`: accepted level1, raw ambiguous-process-count failure in first
  level2 batch (both PDFs passed but that batch excluded from statistics).
- `r1b-retry-20261012/`: accepted level2, PPID-aware observer, aborted level4
  upload preparation with429 UPLOAD_BUSY; no level4 job admitted in that attempt.
- `r1b-four-20261012/`: accepted level4 after sequential upload preparation;
  `summary.json` / `summarize.mjs` combine the three accepted blocks explicitly.

Each folder retains manifest, installed hashes, effective budgets, raw samples,
host guard samples, per-batch/job timing, original input comparisons, PDF checks,
progress/failures and cleanup. Data/PDFs remain private and ignored by Git.
Each fresh API instance had one excluded warm-up (3 total); no instance restart
within an accepted level. This is a blocked-order descriptive trial, not a
causal comparison controlling cache/order effects across concurrency levels.

| Concurrent queued jobs | Batches / jobs | Batch makespan mean (sample SD), seconds | Worst sampled API working set, MiB | Longest queue wait, seconds |
| --- | --- | ---: | ---: | ---: |
| 1 | 3 /3 | 13.882 (0.275) | 482.64 | 0.106 |
| 2 | 3 /6 | 26.975 (0.533) | 520.61 | 13.315 |
| 4 | 3 /12 | 54.844 (0.813) | 608.94 | 40.957 |

Makespan starts when the barrier releases all job requests after successful
uploads and ends at the final PDF download; excludes preparation/idle/verification.
Submission spread at most12ms. DB start/finish intervals do not overlap; one
direct API renderer was observed. Worker means by level13.337/13.056/13.404s.
All sampled health requests succeeded, maximum observed latency292ms; this is
limited health-probe evidence, not an API latency SLA. Concurrent caller index
does not dictate completion order; no strict HTTP-arrival FIFO promise added.

All21 accepted PDFs:98pages, exact decoded drawings/resources/geometry/link
destinations,1,457values/363details/396links and29group starts pass. All records
match their submitted original inputs exactly; job IDs and upload sessions are
distinct, published version IDs pinned. Same4image warnings; second download410;
output/render-temp cleanup and child-process cleanup pass. Because corpus content
is identical, visual comparison cannot distinguish exchange of byte-equivalent
outputs; unique input/resource association is checked in DB, not overclaimed.

API totals include observer and client processes, so increased concurrent client
RSS is included; do not interpret these as pure server-memory scaling. Max
sampled memory.current for level4 was649.73MiB, whole-instance lifetime peak
685.53MiB, with post-batch idle204.04/213.29/221.99MiB. No OOM or live guard
trigger. Lowest host free memory across setups/runs2227.87MiB. No supported
multi-worker capacity or long-term leak conclusion follows from this result.

### Measurement corrections and bounded extra proof

1. Initial observer classified render processes by argv substring only and
   saw2 during one level2 sample despite non-overlapping DB jobs. Stop preserved
   that attempt. Added PPID/executable/argv evidence and counted only direct API
   children as workers. Later level4 sample reproduced a render-like descendant:
   PID20191 had PPID17963 (the active renderer), not API PID1. It was not a second
   API worker. Exact purpose of the transient descendant was not inferred.
   Product processor remained unchanged. Old failed batch excluded; level1
   accepted data retained. This necessary observer correction used the retry.
2. The next level4 setup failed before its barrier because four upload clients
   exceeded default2 upload streams. Actual response429 UPLOAD_BUSY matches
   `src/uploads/config.ts` and service.ts. This was a harness prerequisite
   mismatch, not a queue failure. An additional bounded level4-only attempt was
   justified to complete the authorized queue test: upload sequentially first,
   then release4job requests simultaneously. No upload limit raised, no automatic
   endpoint retries introduced, no unrelated tests repeated. Failed setup kept.

Implication for R3 client: respect upload-stream concurrency and surface429;
choose a bounded retry/backoff policy separately if needed. Do not require the
caller to infer that4queued export jobs permit4simultaneous uploads.

Decision: R1B complete; keep serial processor behavior. R1C remains a separate
authorized-next scope with aggregate resource budget and host preflight, not
automatic continuation. All task containers/volumes/networks/images/credentials
cleaned; no worktree/branch created. Project Control diff/data checks cover this
record; product trees and release refs unchanged. No DOCUMENT_MAP promotion.

## 11. R1C two-render kickoff — 2026-10-12

Owner authorized two simultaneous renders only, RAM guards enabled, no release.
Inline discovery/Evidence Reviewer; execution IDs N/A. Service owns ignored
harness outputs; Project Control owns this existing record. Routine risk, small
bounded experiment. No product candidate mutation, package bump or map update.

Reuse R1A/R1B baseline identities and PDF verification. Two independent API/DB
stacks preserve job locking; total API budget remains1GiB/2CPU, split512MiB/1CPU
each, DB total256MiB/0.5CPU split128MiB/0.25CPU each; swap disabled. Per-lane
85% RAM guard for three samples plus host1GiB reserve guard; a stopped lane stops
further work in both. Three paired measured batches after warm-up if safe.
Independent-stack overhead differs from one shared worker pool; do not claim
production multi-worker support. Stop without escalating to four.

Proof: synchronized submissions after uploads, overlapping DB processing windows
and observed render children, memory/time/raw samples, exact PDF parity and
existing content/link checks; task-only cleanup and unchanged product refs.
Document budget: update this record only; focused data/diff checks. Unknown safe
parallel capacity is the finding sought, not a prerequisite assumed satisfied.

### R1C two-render result — PASS within measured scope

Accepted artifacts: `flowdoc-service/artifacts/capacity-030/r1c-two-ready-20261012/`.
`summary.json` / `summarize.py`, per-lane manifests, limits, raw200ms samples,
DB timing/input associations, all PDF checks and cleanup are retained privately.
Three measured pairs/six jobs, plus one excluded warm-up pair/two jobs. Both
lanes exited0. Source/package hashes unchanged from the baseline above.

| Pair | Submit-to-last-download seconds | Processing overlap seconds | Aggregate sampled working set MiB | Aggregate sampled memory.current MiB |
| --- | ---: | ---: | ---: | ---: |
| 1 | 21.412 | 19.473 | 738.49 | 755.44 |
| 2 | 20.286 | 19.123 | 743.93 | 767.71 |
| 3 | 20.876 | 19.227 | 758.27 | 788.75 |

Mean makespan20.858s, sample SD0.563s. Submissions within10ms; each paired
window has80–81 matched samples with two direct API render children, supporting
actual overlap rather than merely simultaneous admission. DB intervals cover
whole job processing, not a precise renderer-only stage. Aggregate counters use
nearest samples within300ms; actual maximum pair skew115.85ms. These sampled
sums are not an exact simultaneous kernel peak. Lane lifetime peaks438.17 and
414.46MiB are separate, not added as a simultaneous peak.

All8 PDFs passed98-page exact decoded layout/resources/link parity plus the
1,457values/363details/396links/29group-start checks. Same4image-density warnings,
unique job/upload IDs and original-input association, second download410,
output/temp and child-process cleanup passed. No host/container guard stop,
OOM or failed job. Host free minimum1841.21MiB. All health probes succeeded;
measured maximum305ms (excluded warm-up592ms). DB final current89.40/91.38MiB;
DB peaks102.91/104.21MiB, separate from API counters, no DB OOM.

Post30s idle working sets by lane, warm-up then three measured pairs:
140.84→155.52→169.62→171.21MiB and100.68→139.05→142.96→148.65MiB.
Short-run retention remains; no claim of leak absence. API counters include
clients/observers, and independent stacks duplicate API/DB overhead. CPU usage
was recorded; full pair-plus-idle windows consume about41.9–43.2 CPU-seconds
summed across lanes, including clients/monitoring. No pure-render CPU claim.

Compared descriptively with R1B two queued jobs mean26.975s, paired completion
is about23% shorter under the same aggregate CPU/RAM limits. Each individual
worker now takes19.18–20.35s versus R1B mean13.06s: splitting the CPU budget and
running two isolated stacks does not yield a2x gain. Different run order, stack
layout, network setup and current host load prevent a controlled causal claim.
This does not establish shared-queue multi-worker support or a ten-job SLA.

### Preserved setup failures and bounded corrections

- `r1c-two-20261012/`: Docker default address pools exhausted before API start;
  zero jobs. Both stacks cleaned. No unrelated network was deleted.
- `r1c-two-retry-20261012/`: task-local Compose uses one internal network per
  stack, no egress network. Uploaded-image corpus needs no external fetch;
  external-image access is deliberately untested. A fixed2s observer startup
  assertion fired before its first sample became visible; later samples were
  present. Zero jobs. Cleanup passed. This was a readiness prerequisite failure,
  not a renderer or RAM failure.
- The additional `r1c-two-ready-20261012/` attempt was necessary to obtain a valid
  measurement: wait for a nonempty observer sample, bounded15s, before jobs.
  Failed attempts remain excluded; no source/default/timeout or RAM limit was
  raised. This extra bounded retry is recorded beyond the original one-retry
  budget because an unresolved measurement prerequisite prevented any job trial.

All three attempts' task containers, volumes, networks, images and credentials
removed; verified by task project labels. Product checkouts/release refs remain
unchanged. No worktree/branch created. Roadmap/data/diff verification only for
this documentation update; no product/map promotion.

Decision: authorized two-render trial complete; stop. Four-render trial remains
pending, not automatically started. R2 should weigh the measured23% batch-time
benefit against higher aggregate memory and real worker ownership/recovery work.
Keep the existing serial service until that decision. Six API callers remain
scheduled for R3's small local test page, not this experiment.

## 12. R2 plan — serial admission and failure handling, 2026-10-12

Owner decision: defer four-render exploration; retain one processor and plan R2.
This supersedes only the pending-four next-step status, not measured R1C results.
Six near-simultaneous API callers stay in R3. No release or implementation is
currently authorized by this planning request. Inline Planning Partner, IDs N/A;
Service owns implementation, Core remains unchanged. Routine risk; evidence
sources are the inspected files below, not newly executed tests. Document budget
is this existing roadmap; no new registry, map or architecture required.

### Current code findings and evidence boundary

Read `src/jobs/admission.ts`, `src/uploads/claims.ts`, `src/jobs/processor.ts`,
`src/jobs/repository.ts`, `src/jobs/render.ts`, `src/http/server.ts` and existing
processor/render/http tests. No admission count limit was found. Existing code
serializes processing with its DB advisory lock; renderer timeout120s and output
limit50MiB exist. A render failure marks that job failed; startup marks interrupted
running jobs PROCESS_INTERRUPTED, while queued jobs remain eligible. Lost lock
makes readiness false. Tests already cover serial processing, a middle-job
failure, metadata/storage failure, lock loss, render timeout and temp cleanup.
These are read-only findings; no tests rerun and no recovery PASS claimed here.

Upload-backed identical submission can return the existing job; upload-free
submission currently inserts a new job. Do not promise universal idempotency or
introduce automatic POST retries. Upload concurrency2/UPLOAD_BUSY429 is separate
from document queue capacity.

### Proposed bounded implementation parts

1. Admission contract/configuration: propose `JOB_MAX_OUTSTANDING=10`, counting
   queued+running jobs in this service DB (not ten waiting plus one running).
   With one active processor that means at most one running and nine waiting.
   This is a configurable local trial policy reflecting the owner target, not
   demonstrated ten-job capacity or latency. Invalid config fails startup.
   Existing body/upload/render limits remain unchanged. A count limit bounds
   backlog, not per-document memory or request preparation CPU.
2. Atomic admission: serialize the count-and-insert decision transactionally
   across image and non-image paths using a dedicated admission lock, distinct
   from processor ownership. Select one consistent lock order. Existing identical
   upload-backed jobs return before a new-capacity decision; conflicting requests
   remain conflicts. Rejected requests create no job/claim and leave finalized
   uploads available until normal expiry. Failed/succeeded jobs release capacity
   automatically by falling outside the counted statuses. No counter table,
   distributed queue, worker pool or schema redesign unless a concrete need is
   discovered. An early count may be an optimization only, never the authority.
3. Feedback: propose503 + stable `QUEUE_FULL` for shared-service saturation,
   distinct from503 `UNAVAILABLE` and upload429 `UPLOAD_BUSY`. Response states no
   new job accepted; no fabricated jobId, queue rank or completion estimate.
   Preserve the existing error envelope. Do not add Retry-After timing without
   a defined policy. A known QUEUE_FULL response can be retried later, but a
   lost/ambiguous POST response must not trigger blind retries or imply no job.
4. Failure/recovery: retain existing render timeout/defaults, failure codes and
   explicit resubmission behavior. Verify that a failed job does not stall later
   jobs, interrupted running jobs become failed on restart, queued jobs resume,
   and readiness/503 blocks new admission after processor failure. Inspect
   preparation/upload expiry and output cleanup across waiting/restart too.
   Repair only demonstrated gaps. Do not add automatic job retry, cancellation,
   queue-wait timeout, new progress percentages or expanded error taxonomy now.

### Acceptance and proof budget

- Focused real-DB admission tests with a deliberately tiny configured cap:
  simultaneous submissions never exceed it; cover mixed image/non-image paths,
  existing-job replay at capacity, rejection without upload consumption, and
  capacity reopening after terminal status. These are invariant tests, not the
  deferred six-document capacity/UX trial.
- Reuse/extend existing processor/render tests for failure followed by success,
  forced render stop/temp cleanup, restart with running+queued records, lost
  coordinator readiness and unavailable admission. Use short test deadlines;
  do not increase production deadlines or manufacture real host OOM.
- HTTP checks prove status/error envelope/no receipt on rejection, valid accepted
 202/status/download behavior, and correct distinction from upload saturation.
- After an approved implementation, run affected build/tests and one real
 98-page SRS API export with existing PDF/wrap/content parity. Keep RAM guard
 enabled for the export. Broader capacity profiling remains out of scope.
- Review actual impact before finalizing checks. DB coordination and resource
 claiming are the key risks; input memory and shared-worker architecture remain
 deferred. Stop after criteria pass; no repeated benchmark sweep or new agent.

Suggested implementation order: contract/configuration and atomic admission,
then focused failure/recovery gaps, then real API regression and concise manual
updates for R3. Numeric default10 and503 QUEUE_FULL above are recommendations
pending owner agreement, not current API behavior. No source files, package
versions, DB schema or release refs changed by this plan.

### R2 part1 — PASS, 2026-10-12

Owner approved default10 outstanding jobs and503 QUEUE_FULL, implementation of
part1 only. Service commit `cffd8b30fff39ef00f5bbd0dafbe2e1eccc4607f` is integrated
by unchanged fast-forward into `codex/template-registry`. Core and both release
refs/package versions remain unchanged. This approval resolves the numeric/status
recommendations above; it does not authorize parts2–3 or release promotion.

Implementation: `src/jobs/config.ts` validates a positive safe integer before
server resources start. `src/jobs/capacity.ts` uses dedicated transaction-scoped
advisory lock60430405 and a fresh queued+running count before insertion, shared
by text-only and upload-backed admission. Upload-session locks precede capacity
locks; replay/conflict decisions precede new-slot admission. Processor ownership
lock60430404 is unchanged. HTTP/server/Compose wiring and `.env.example` expose
JOB_MAX_OUTSTANDING default10; README documents behavior and limitations.
No migration, shared counter, worker pool, automatic retry or renderer change.

Coverage: `tests/queue-admission.test.mjs` covers default/invalid configuration,
HTTP eleven simultaneous admissions accepting exactly ten, mixed upload/plain
content competing for two remaining slots with an existing running job,
QUEUE_FULL503 without receipt/claim, ready-upload reuse, identical replay at
capacity, conflicting replay and capacity reopening after failed/succeeded jobs.
The eleven admissions use small fixtures without rendering; they are invariant
checks, not a replacement for R3 six-caller feedback or a ten-job capacity claim.

Verification: TypeScript build; focused host real-DB15tests across5files; pinned
Linux real-DB/API consumer67tests across20files, including real PDF generation,
images, sections, area, row groups, links and contents. All final checks passed.
Tests were observed failing before implementation (all six competitors accepted),
then passing after atomic admission. Early test setup upload saturation and
shared test-state issues were corrected in the test harness; one initial5s test
wait timed out, with subsequent focused default-timeout and Linux runs passing.
Raw runs, Linux build/test logs and cleanup are preserved under ignored
`flowdoc-service/artifacts/r2-admission/`; credentials removed. No blanket
full-suite or98-page parity claim: the full SRS API check remains part3.

Reviewed changed/affected paths and reused passing checks after the identical
fast-forward. Isolated task DB/container/image removed, ignored evidence copied
and hashes verified, clean merged worktree and task branch removed. No unrelated
resources touched. Project Control roadmap passes diff/data checks; no map update.

Remaining: part2 failure/restart/expiry gap verification, then part3 real SRS
parity and client-facing integration closeout. Existing focused failure tests
passing here do not mark the additional part2 recovery scope complete. Keep
serial processing and defer four-render exploration; no automatic continuation.

### R2 part2 — PASS on pinned Linux runtime, 2026-10-12

Owner authorized failure/recovery verification with bounded repairs only if
needed, no release. Single-room scope/IDs N/A; Service owns tests, Evidence
Reviewer role, routine risk. Added recovery coverage at Service commit
`6903ec188315f4082a64f34eae6256f37bda7382`, unchanged fast-forward into development.
No runtime source, migration, Core, package version or release ref changed.

New `tests/recovery.test.mjs` and `tests/fixtures/recovery-worker.mjs` cover:
- actual processor subprocess SIGKILL after a rendering-stage barrier, then a new
  processor: interrupted job becomes failed/PROCESS_INTERRUPTED with failed
  processing stage and no output; the queued job succeeds with a real PDF;
- claimed upload bytes survive a two-hour simulated expiry while jobs are
  running/queued and startup upload recovery; this uses claimed source fixtures,
  not a new image-decoding test;
- actual renderer forced timeout with a1ms test-only deadline, followed by a
  successful job using the normal deadline; no failed-job output metadata or
  renderer temporary files remain;
- actual termination of this test's PostgreSQL coordinator backend: readiness
  becomes false, health and admission return503/UNAVAILABLE, job count unchanged.

Build and syntax/diff checks passed. Pinned Linux selected7files/21tests passed,
including existing serial failure isolation, write/metadata failure, bounded
renderer output, upload expiry, output lifecycle, HTTP and admission tests.
No runtime defect was demonstrated, so no speculative fix or automatic retry
was added. Existing supported single-processor behavior remains unchanged.

Initial Docker startup was unavailable; started Docker Desktop through its CLI.
The preliminary Windows-host admission test then exceeded its5s test deadline;
that run is retained as failed, not counted as acceptance. The same admission
suite and the new recovery suite passed on pinned Linux. Windows-host timing
reliability remains unproven; no application timeout was raised. Linux is the
runtime scope of this acceptance. No machine-wide outage, full Docker-daemon
crash or universal recovery claim follows from these focused process tests.

Evidence: ignored `flowdoc-service/artifacts/r2-recovery/` contains test logs,
Linux build/results, harness and cleanup. Task DB/container/image and credentials
removed. Evidence copied with hashes checked before removing clean merged task
worktree/branch. Passing proof reused after identical fast-forward. Project
Control diff/data checks cover this record; no map or release promotion.

Next: R2 part3, one real98-page SRS API regression with RAM guard, exact PDF/wrap
parity and client-facing closeout. Not run in part2; do not mark all R2 complete.
Four-render and R3 six-caller trials retain their previously agreed deferral.
