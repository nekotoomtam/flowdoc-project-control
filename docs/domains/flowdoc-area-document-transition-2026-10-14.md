# Area-based document structure transition

## Authority Boundary

Owner: FlowDoc Project Control. This is the shared design, execution plan and
progress record for the owner's seven-step direction change on2026-10-14.
It is not implementation evidence or a release claim. Core owns validation,
binding and pagination; Service owns storage, public contracts and consumers.
Private SRS data stays outside Git. Supersedes further memory-optimization work
as the next objective; accepted release0.2.14 and its evidence remain history.

## Authorization and working arrangement

Owner approved the seven steps and explicitly said to draft and start, then
confirmed the API shape `sections.body.data.details: [{format,data}]`.
No new object-valued Area mode is requested. The field name is the lookup key;
the Area value remains an ordered array. Design may be refined with concrete
examples during work; do not silently expand or hard-code SRS semantics.

Single-room inline work under flowdoc-workflow-economy-v2; execution IDs N/A.
Roles: Planning Partner/Cross-Repo Boundary Reviewer for discovery, Product
Implementation Agent for later candidate edits, Evidence Reviewer for checks.
Size large, risk routine with explicit schema/publication/data-loss risks.
Initial authority is discovery only with respect to product runtime; isolated
candidate fixtures are experimental outputs, never shared product truth.
Use isolated sibling worktrees for runtime changes. No remote push, production
DB operation, published-snapshot rewrite, Editor implementation or release-tag
rewrite. Service/Core checkouts currently point at release0.2.14 snapshots
`4de27a5`/`ce6ff28`; do not switch or edit those primary branches.
Model decision: retain this user-selected session for inline discovery; host
catalog provides gpt-6-astra/medium as planning policy default. No separate
execution/model dispatch is created or claimed. Reassess implementation needs
after discovery; do not invent a host/model switch.

## Agreed design

- The whole document owns shared variables and ordered sections. `Doc` is an
  explanatory word, not a required API rename.
- Section owns paper dimensions/orientation/margins and its own header/footer.
  It may span pages. Its authored graph contains static nodes and variable
  placements; section variables are shared within that section.
- Area is a named variable with an explicit placement linked by stable areaId.
  It accepts an ordered array of entries. Each entry chooses an owned Format
  and supplies that Format's local data. The caller never supplies node graphs.
- Format is a fragment/group of nodes, not a page and not an indivisible page
  block. Its tables may continue across pages.
- An explicit page-break node is authored by the template owner. No automatic
  inference from heading text/numbering. Breaks do not change Section settings;
  consecutive/leading/trailing breaks must not create accidental empty pages.
- The SRS target uses section-variable Areas, replacing direct content-format
  placement. Section boundaries follow actual page/header/footer requirements.
- Existing header/first-column centering is the visual baseline.

## Seven-step execution and acceptance

1. Define terminology and contracts. Resolve variable scope, allowed placement,
   empty/missing/invalid input, ordered expansion and break semantics. Classify
   whole-document naming as context-only; split Section layout from Area data.
   Acceptance: template/request examples demonstrate the owner's confirmed shape.
2. Inventory current implementation. Trace Core template/types, sectionOwnership,
   areas, prepareSections/prepareAreas, expandAreas/expandRows, composeSections,
   resolved validation and documentFlow. Trace Service assembly, contract,
   publication, image traversal and API example. Identify supported behavior,
   missing behavior and deletion candidates with actual consumers. Probe SRS
   conversion through public Core validation/preparation/composition first.
3. Build separate SRS template/request. Preserve scalar values/images/order;
   replace content sections with authored Area placements and area-owned formats.
   Keep original input immutable during comparison. Produce an explicit mapping
   and fail on dropped/duplicated values. Do not prematurely consolidate sections
   until explicit breaks can preserve intended page transitions.
4. Implement only demonstrated gaps. Add meaningful failing tests first for
   affected contracts: owned formats, repeated/grouped rows, invalid entries,
   bounds, anchors/TOC/links and page-break edge cases. Version new persisted
   semantics deliberately; no broad model-number substitutions. Publishable
   snapshots must remain immutable. Use packed Core in isolated Linux Service
   consumer before claiming package integration.
5. Verify full document. First prove structural migration with unchanged page
   layout against centered98-page reference. Compare drawing/resources/text/
   links, values/order and groups. Then test explicitly authored breaks separately;
   accept page-number changes only with correct TOC/link destinations. Visually
   inspect representative changed pages. No API layout heuristics.
6. Measure performance anew. Same input/output arrangement, machine/container
   limits and lightweight external sampler for old/new. Three alternating cold
   runs per candidate for98pages, report median/range/peak working set and total
   cgroup separately. After correctness/guards pass, repeat at483pages. Preserve
   API1GiB/2CPU, DB256MiB, host reserve/stop controls from capacity evidence.
   Proposed investigation trigger: >10% median worker or peak working-set
   regression; not a retrospective pass threshold. Record limitations and resolve
   regression before cutover. No new memory optimization unless findings require it.
7. Cut over and retire. Switch active examples/manuals/client contracts to the new
   path. Inventory each old artifact/code path as migrate/delete/still-used
   compatibility/history before deletion. Delete genuinely unused implementations,
   fixtures and temporary outputs; retain only named necessary proof and immutable
   published history. Verify no dangling references and run affected checks after
   removal. An unresolved still-used path is an explicit remaining obligation,
   not permission to call cleanup complete. No deletion of unrelated user files.

## Proof and document budgets

One shared plan/progress record here; update the existing capacity roadmap only
to point at this direction. Product README/usage changes only when behavior is
implemented. No maps promoted by plans. Evidence in ignored Service
`artifacts/area-transition-20261014/`; minimal public synthetic fixtures/tests in
owner repositories. One discovery probe, focused tests per actual runtime change,
one affected full suite per stable candidate, paired PDF checks and bounded
performance matrix above. Repeat only for changed content, failures or uncovered
affected behavior. One final review of the integrated change; owner revisions
update this record rather than spawning report copies.

## Open decisions and review focus

- Area entries currently may be skipped with warnings: prevent silent SRS data
  loss; decide versioned strict semantics before changing public behavior.
- Verify grouped rows, image discovery and source diagnostics through Area;
  do not assume support solely from types.
- Keep authored breaks separate from Section transitions and empty content.
- Existing release/published consumers may still need legacy readers: identify
  them before deciding retirement scope; never rewrite historical snapshots.
- Names, anchors, group membership and data order must survive conversion.

## Progress

- [x] Owner confirmed named Area variable with ordered entry array.
- [x] Seven-step plan recorded; scope includes retirement and post-cleanup checks.
- [x] Current behavior inventory and isolated conversion probe.
- [x] New template and concrete gap decisions (candidate; not active cutover).
- [ ] Runtime/Service gaps implemented and tested.
- [ ] Full PDF acceptance.
- [ ] Matched performance acceptance.
- [ ] Active cutover, retirement and final checks.

Current source inspection: model17 owned-area validation explicitly accepts
rowGroups, and expandArea selects section/local/global variable storage then
expands each owned fragment. This supports a conversion probe, not yet a claim
that SRS fully works through Areas. Generic snapshot currently describes older
Editor work; this explicit owner request and the capacity/alignment record are
the relevant single-room context. No old execution context is reopened.

Discovery result: converted four content sections (436entries) to authored
section Area variables. Core validation/preparation/composition pass without
warnings; normalized resolved content equals the original. Service assembly
round-trip preserves serialized JSON (null-prototype dictionaries normalized
only for the comparison). Fresh Linux before/after98-page PDFs have identical
decoded drawing streams, resources, geometry and links. Evidence: probe-result.json
and parity.json under the stated artifact folder. Probe import-name and prototype
comparison mistakes were corrected before PASS; neither required product changes.

Owner decision: malformed/unknown Area entries in the new structure must fail
generation with their indexed path, never skip and output an incomplete SRS.
Implementation ruling: model18 versions the new authored-section/Area-only
contract, strict Area entries and root page-break node; models4–17 retain their
published reader behavior. This is compatibility still in use, not dead code.
New model sections must use authored/blank sources and no direct formats;
request content is rejected even if empty. Existing variable scope names remain
to avoid unrelated API renaming. Core worktree `flowdoc-core-area-v18` and Service
`flowdoc-service-area-v18`, branch `codex/area-document-v18`, start at the release
snapshots above. Runtime authority now implementation for these isolated lanes;
review actual version feature gates individually and retain old-model tests.

Implementation checkpoint, 2026-10-14: Core build and 508 tests in 63 files pass.
Review found two defects, now repaired and independently rechecked: prepared
Area validation lost strict policy through a legacy proxy; a page break before
an empty TOC created a trailing blank page. Regression tests cover both.
Service build and 192 tests pass in a fresh Linux verification image with an
isolated PostgreSQL database, including model18 snapshot round-trip and HTTP
rejection before enqueue. UNKNOWN_FORMAT now maps to HTTP422. Migration014 is
forward-only; prior migration tests assert the added step and preserved data.

Candidate package is `0.2.15-area.1`, built from the uncommitted isolated Core
tree with existing native/resources preserved. Its manifest explicitly marks
the uncommitted state; it is not a release artifact. Installed package hashes
match `flowdoc-core/artifacts/area-transition-20261014/expected-identities.json`.
Service evidence: `flowdoc-service/artifacts/area-transition-20261014/`
`tests-result.json`, `installed-identities.json`, `tests.log`, `cleanup.json`.

Fresh model18 SRS PDFs pass exact decoded drawings/resources/geometry/link
comparison for all98 pages. A second candidate consolidates six identical
paper/header/footer sections into one body section with explicit page-break
nodes; cover remains separate. It also passes the same98-page comparison.
Evidence: `model18/parity.json` and `consolidated/parity.json` beneath that
Service artifact directory. Unused direct formats in the authored contents
section were inventoried in `model18/retired-unused-formats.json` and removed
from the candidate. Topic-level heading breaks are still pending; these results
prove preservation, not acceptance of that intentional pagination change.

Performance acceptance is BLOCKED before the first measured job: the host had
941.57MiB free, below the unchanged1536MiB start guard. Evidence:
`before-98-1/host-memory-phases.json`. Three alternating98-page before/after
pairs are prepared with the same external200ms sampler, but none has a measured
PASS. Do not infer a RAM reduction, attempt483 pages, lower guards, or promote
the candidate from these functional results. Resume after host memory permits;
primary release checkouts and published templates remain unchanged. Active
cutover, final packaging, docs/retirement and final acceptance remain open.

Owner follow-up: compare five runs of each variant. The98-page proof budget is
now five alternating before/after pairs (ten fresh-process measurements),
superseding the proposed three pairs. Verification-only outputs are isolated in
`flowdoc-service/artifacts/area-transition-20261014/benchmark-five`; candidate
source and prior evidence were not changed. All ten trial directories are
prepared. The fresh first-run attempt again stopped before setup:949.625MiB
free versus1536MiB required. `benchmark-five/status.json` records BLOCKED and
zero completed measurements. No performance comparison is available yet;
resume when host memory meets the original guard without closing user apps.

Retry after owner requested a fresh check: host initially had3923.60MiB free.
One baseline API job completed (14.534233s,98 pages), but its direct-Core PDF
oracle was inappropriate: Service image normalization resizes images (banner
4144x480 became1654x192), changing image placement relative to the full-size
direct-render oracle. No product source repair was made. Baseline API content
checks pass1457 text values,363 requirements,396 valid links and29 groups.
That diagnostic run is excluded from the five-pair performance comparison.

The corrected harness under `benchmark-five-api` uses that verified baseline
API PDF, the same API route for both variants, and compares warning codes
(expected low-resolution image warnings retain different source node paths).
Two attempts stopped before submitting any measured job: host reserve fell to
1513.94MiB and1356.14MiB respectively. Both isolated stacks were cleaned up;
Docker reports no running containers. `series-progress.json` is STOPPED with
zero completed comparison measurements. Preserve the first stopped attempt in
`before-98-1-memory-blocked` and the latest in `before-98-1`. A fresh untouched
trial directory is required on resume. Do not present the diagnostic baseline
time as a paired performance result or relax the1536MiB guard.

Five-pair98-page acceptance completed after the next owner retry. Evidence:
`flowdoc-service/artifacts/area-transition-20261014/benchmark-five-api-retry2/summary.json`,
`series-progress.json`, and each trial's `run-1/measurement.json`, `parity.json`,
`pdf-text-check.json`, `group-page-check.json`, `cleanup.json` and samples.
All ten cold-process API runs passed, alternating before/after, with unchanged
guards and200ms external sampling. Every PDF has98 pages and identical decoded
drawings/resources/geometry/links to the verified old-Service API oracle; each
also passes1457 text values,363 requirements,396 links and29 groups. Zero OOM
kills or guard stops; minimum host reserve2948.30MiB. All isolated stacks were
cleaned up and no containers remain running. No product source was modified.

| Round | Old worker s | New worker s | Old peak working MiB | New peak working MiB |
| --- | ---: | ---: | ---: | ---: |
| 1 | 11.335439 | 11.144848 | 345.0508 | 385.7305 |
| 2 | 11.901398 | 11.631685 | 377.4063 | 373.2969 |
| 3 | 11.456819 | 11.481250 | 352.9922 | 356.5781 |
| 4 | 11.375388 | 11.329646 | 349.0469 | 363.0313 |
| 5 | 11.826896 | 11.526954 | 351.0078 | 365.3008 |

Old/new mean worker time11.5792/11.4229s(-1.35%); median11.4568/11.4813s(+0.21%).
Old/new mean peak working set355.1008/368.7875MiB(+3.85%); median351.0078/
365.3008MiB(+4.07%). Treat speed as broadly unchanged on this small shared-host
sample; the new structure does not demonstrate a RAM reduction. Aggregate
changes do not exceed the proposed10% investigation trigger. The first pair's
larger RAM gap does not justify discarding it; all five pairs are included.
This closes only the requested98-page five-pair check.483-page verification,
intentional heading breaks, active cutover, final packaging and retirement stay
open. Earlier blocked/diagnostic attempts remain preserved and excluded.

### Read-only memory ownership survey

Owner requested a source-led survey of suspected retained/copying structures.
Scope is discovery only over the existing Core/Service candidates and retained
benchmark samples; no runtime changes, heap snapshots, new render benchmark or
release promotion. Inline execution IDs remain not applicable. Outputs:
`flowdoc-service/artifacts/area-transition-20261014/source-audit-counts.json`
and `source-audit-peak-processes.json`. A local validation/composition pass only
counted the actual98-page fixture; serialized lengths are not heap measurements.

Measurement qualification: the benchmark client runs via `docker exec` inside
the API container, alongside the sampler. At sampled container peaks its RSS
is87.1–88.2MiB; API RSS170.3–203.4MiB and render RSS185.3–213.2MiB. RSS includes
shared pages: do not add these figures or subtract client RSS from cgroup working
set. The reported355.1/368.8MiB means remain valid for the matched complete
test-container setup, not isolated production-Service or renderer memory.
Both variants used the same arrangement. Production-only attribution remains
unknown without a client-outside-container measurement.

Confirmed source findings and bounded next experiments:

1. **Validation builds discarded results.** `Core/src/data/prepareSections.ts`
   uses model14 proxy validators which clone scoped prepared inputs, then clones
   the entire prepared input at the end. Model18 strictAreas calls
   `prepareAreaValue` but discards its return; prepared-mode implementation still
   clones the Area. `validateValues` likewise constructs arrays/maps even when
   callers only need issues. First candidate: separate allocation-free internal
   validation from the public detached-snapshot return, preserving strict
   rejection, defaults, warning integrity and mutation isolation. This is a
   concrete extra-allocation path introduced in the model18 strict recheck,
   not proof that it accounts for the measured RAM delta.
2. **Whole-document ownership crosses layers.** Service admission composes to
   validate output/claim images, worker prepares original input again to check
   persisted integrity, then composes again. `Service/src/images/job.ts` clones
   the composed document to rewrite resource IDs; `jobs/render.ts` serializes it
   across a process boundary. Child parses it and Core `createPdfEngine.ts`
   snapshots document and image bytes before its first await. Explore an explicit
   internal ownership transfer or a separate resource-ID mapping; do not remove
   the public snapshot guarantee or stored-input tamper checks. Lexical scope is
   not evidence that every old object remains live until render completion.
3. **Text cache persists through generation.** `cacheTextRuntime.ts` retains JSON
   strings with a32MiB UTF-16 payload budget/8192-entry cap; hits parse new objects.
   Cache payload limit is not an actual heap cap or measured occupancy. Smaller
   bounds are a focused RAM/time tradeoff experiment; preserve independent
   results or prove consumers cannot mutate shared entries.
4. **Layout retains the book.** `documentFlow.ts` accumulates all DrawPages while
   the resolved graph remains available. `cellTableFlow.ts` premeasures each whole
   table; drawn flags do not release measured lines until that table ends.
   Actual fixture:5627 nodes,457 roots,200 tables,933 rows,largest table30 rows,
   198 TOC headings,371 body image nodes. Thus table-at-a-time work already exists;
   changing it alone does not remove full-book graph/draw retention. `emitLine`
   shallow-copies runs and shares glyph arrays: not every representation is a
   full independent glyph copy. Incremental book processing is a larger change
   requiring row-span/group, numbering, links, TOC and font-subset preservation.
5. **TOC is not a second full pagination pass.** `composition/contents.ts` stores
   heading metadata; fixed number slots are filled after layout. Other consumers
   also need the final draw tree (links, page fields, font subset, writer).
6. **Writer creates another glyph representation and page streams.** `writePdf.ts`
   retains resolved glyph runs while building content buffers for all pages.
   Service collects output chunks then concatenates. Actual PDF is2583938 bytes
   in both variants, so final-buffer concatenation alone is not a plausible
   explanation for hundreds of MiB, though intermediate glyph structures may be.
7. **Images have both reuse and copies.** Service deduplicates derivatives by
   source/frame size. Actual PDF has13 top-level image objects, about1.343MiB of
   RGBA-equivalent pixels, despite371 body placements. Child PNG conversion and
   Core image snapshots allocate copies; original-image decoding/native-library
   overhead are separate and not bounded by that final-pixel estimate.

Prepared/composed compact JSON sizes are228502/5173567 bytes. This demonstrates
representation expansion, not proportional heap cost or a retained-live-set
measurement. Recommended experiment order: discarded validation allocations,
document ownership/copies, then text-cache tradeoff; defer table streaming and
writer redesign until evidence justifies their wider correctness surface.
No estimated MiB saving is accepted from this static survey. Future comparison
must preserve PDF/content tests and distinguish allocation churn from peak
live data and runtime-retained capacity.

### Validation-copy candidate and Area-only measurement attempt

Owner narrowed the requested run to latest Area only, three 98-page API runs;
no old variant and no before/after performance claim. The approved implementation
scope is discarded prepared-validation copies. Core internal checks now borrow
validated input synchronously; the outer validation boundary still returns a
detached snapshot and independent warnings. Prepared nested arrays and Areas
are checked without rebuilding their discarded results. Request normalization,
strict rejection and Service integrity checks remain intact.

Candidate remains in the existing isolated Core/Service worktrees, not release.
Core tests:509 passed; focused Area tests include snapshot isolation and two
boundary clone calls instead of intermediate clones. Core and Service builds
pass. The packed0.2.15-area.2 candidate passed192 Service tests in a fresh Linux
image with isolated PostgreSQL; installed file hashes match the archive manifest.
This demonstrates functional checks, not a measured RAM reduction.

Evidence: Core worktree `artifacts/area-validation-tests.json`; primary Core
`artifacts/area-validation-20261014/expected-identities.json`; primary Service
`artifacts/area-validation-20261014/` contains package-consumer checks and the
three-run harness. First measurement attempt stopped before generation because
host reserve was1462.40MiB, below the existing1536MiB start threshold. Zero of
three measured rounds completed; no new PDF parity result or peak measurement
is claimed. Cleanup passed and no test containers remain. Preserve this stopped
attempt; any retry needs a new output directory. The same200ms observer and
client-inside-container qualification apply. Latest observed reserve after
cleanup was1662.15MiB, insufficient margin to repeat setup reliably.

Remaining acceptance: complete three Area-only rounds when host reserve allows,
including exact decoded PDF drawing/resource/geometry/link parity and content
checks.483-page work, release promotion and remaining migration steps stay open.

### Area-only three-run acceptance after Docker reset

Owner requested rebuilding the test environment after clearing Docker data and
measuring latest Area only. Reused unchanged area.2 candidate and accepted
98-page consolidated inputs, with fresh isolated databases and cold API
processes for all three rounds. Each runtime's installed Core file hashes matched
`flowdoc-core/artifacts/area-validation-20261014/expected-identities.json`.
No product source changed and no old performance variant was run.

Evidence: `flowdoc-service/artifacts/area-validation-retry-20261014/summary.json`,
per-round measurements,200ms samples, PDF parity/content/group checks and cleanup
records. This successful series supersedes the pending three-run acceptance;
the earlier pre-generation memory stop remains preserved as a separate attempt.

| Round | Worker seconds | Peak container working MiB |
| --- | ---: | ---: |
| 1 | 11.575831 | 377.36328125 |
| 2 | 11.610380 | 355.69531250 |
| 3 | 11.195217 | 357.25000000 |

Mean worker11.460476s; median11.575831s. Mean peak363.4362MiB;
median357.25MiB. Kernel raw memory.current peaks were403.293,359.348 and363.152MiB;
these are distinct from sampled working-set peaks. Zero OOM kills and guard
stops; minimum host free RAM1693.039MiB. All three PDFs have98 pages and exact
decoded drawing/resource/geometry/link parity with the accepted API oracle.
Each passes1457 text values,363 requirements,396 internal links and29 groups.
Expected warning-code sequences also match. All test stacks cleaned up.

Acceptance for this bounded request passes. RAM describes the complete test
container including API client and observer, not isolated Core memory; do not
infer a RAM reduction without a controlled comparison.483-page verification,
remaining migration acceptance and release promotion remain outside this request.

### Boundary memory attribution on latest Area

Owner authorized continuing root-cause investigation after the three-run result.
Scope: discovery only; one98-page diagnostic run using area.2 with28 boundary
probes in generated JavaScript inside an isolated diagnostic Docker stage.
Core/Service source and packed candidate were not changed. Roles: Evidence
Reviewer/Cross-Repo Boundary Reviewer; inline execution IDs N/A, routine risk.
Proof budget: one instrumented API render plus existing PDF/content/group oracle;
no heap snapshot, forced GC, per-node logs or performance improvement claim.

Evidence: `flowdoc-service/artifacts/area-stages-20261014/summary.json`,
`prepare.py`, `overlay-manifest.json`, `overlay/`, and `trial/` contain the exact
instrumentation, hash-checked Core overlay,28 phase records, external200ms
samples, parity and cleanup. Diagnostic-only file hashes are deliberately
distinct from the normal package; do not publish or reuse this image as release.

Observed complete-container working set at boundaries (MiB): admission before
composition98.61, after170.86; worker after composition192.11; before render199.41;
child after parsing265.71; before Core resolved validation264.03, after305.56;
after snapshot306.23; layout start305.00/end354.82; contents-number fill start
354.82/end354.05; font-subset start357.00/end365.14; writer end375.48. The maximum
external sample375.91MiB occurs within font subsetting, with an additional Python
process RSS29.84MiB. The writer boundary is nearly as high: fixing only one tail
peak can leave the other. API RSS at sampled peak194.74MiB, renderer186.36MiB,
client88.16MiB; shared RSS cannot be added or subtracted as private memory.

Layout took8.181s; contents-number filling29ms; subset587ms; writer245ms. The
contents marker covers final number filling only, not initial TOC row layout.
Worker total12.045938s is diagnostic timing, not a regression comparison. The
28 memory/cgroup reads sum6.18ms excluding JSON serialization/file appends; total
probe overhead was not independently benchmarked. One run establishes observed
phase attribution, not repeatable savings or a complete live-object ownership map.

All98 pages pass exact decoded drawing/resource/geometry/link parity,1457 text
values,363 requirements,396 links and29 groups. No OOM/guard stop; cleanup PASS.
Source confirms composition calls resolved validation, and the render boundary
validates again; graph maps and descriptor traversal allocate temporary values.
The observed validation RSS rise is not proof that all of it remains live or can
be eliminated. Snapshot boundary had GC activity (heapUsed fell), so its small
RSS delta does not mean snapshots are free. No defensive validation was removed.

Next implementation hypothesis should target pre-render allocation/ownership and
layout retention together: lower the base carried into both font-subset and
writer peaks, preserving admission errors, persisted-input integrity, image
claims and caller snapshot isolation. Do not infer an achievable MiB saving from
boundary differences, or treat final TOC filling as the principal cause.

### Service render ownership optimization and three-run result

Owner authorized reducing pre-render retained data, followed by three latest-Area
98-page measurements and unchanged PDF acceptance. Bounded implementation owner:
Service; Core area.2 remains unchanged. Inline IDs N/A; routine risk, with explicit
input-integrity, image-claim, abort/timeout and serial-worker acceptance. No old
variant run, release promotion, heap snapshot, forced GC or cache-budget change.

Service isolated branch commit `e9af0c1` changes only five ownership/transport test
and source files. The worker's claim/validation/composition/preparation frame now
ends after starting transport; the coordinator awaits only job ID plus result
promise. `prepareOwnedJobImages` rewrites the freshly composed graph in place,
removing the previous whole-document clone; its name/comment require exclusive
ownership. No obsolete wrapper remains. Synchronous serialization wrappers pass
only text into the asynchronous transport, which clears its local text binding
after stdin.end. Node may retain pending pipe bytes until they are written.
Serialization errors still return rejected promises, preserving previous behavior.
Admission checks, original/prepared integrity comparison, child validation and
Core caller snapshot isolation remain intact. This establishes reference lifetime
and copy changes, not proof of immediate GC or OS memory release.

Proof:194 Linux Service tests passed including new real-child snapshot parity.
Focused review found no blocking issue; its serialization-error compatibility
note was corrected afterward. Final build and two ownership/error tests passed;
three API/PDF runs use the final rebuilt image. Full194-test result predates only
the final rejected-Promise error correction; do not present it as a rerun of all
tests on that exact final source. Evidence/source hashes are under primary Service
`artifacts/area-ownership-20261014/` (`tests-result.json`, `ownership-tests.json`,
`source-checkpoint.json`, `summary.json`, per-round checks). Other pre-existing
Area migration edits remain uncommitted in their isolated worktrees.

| Round | Worker seconds | Peak container working MiB |
| --- | ---: | ---: |
| 1 | 11.167761 | 372.55859375 |
| 2 | 11.274672 | 367.34765625 |
| 3 | 11.446108 | 347.28906250 |

Mean11.29618s and362.39844MiB; median11.274672s and367.34766MiB. All98-page PDFs
have exact decoded drawing/resource/geometry/link parity;1457 text values,
363 requirements,396 links and29 groups pass per run. Zero OOM/guard stops;
minimum host free RAM1957.64453MiB. Cleanup passes for all stacks.

The peak remains broadly in the prior observed range: these results do not
establish a meaningful peak RAM reduction. Do not count the ownership change as
solving the RAM objective or infer retained-live-data size from process RSS.
Container figures include the API client/observer; shared host and three samples
limit inference. Preserve the candidate and evidence; stop this bounded three-run
experiment. Larger architecture changes or further diagnostics need their own
bounded rationale.483-page acceptance and release remain open.

### Forced-GC and heap-snapshot attribution

Owner explicitly requested separate Service/renderer memory measurements and
forced GC on latest Area98, followed by snapshots only if live heap remained
substantial. Discovery-only diagnostic overlays preserve product source and
normal benchmark results. Service candidate e9af0c1 and Core area.2 remain
unchanged. Seven checkpoints collect each process before/after synchronous major
GC, RSS/PSS/private pages, heap/external/ArrayBuffer counters and V8 space stats.
The renderer requests Service collection through a diagnostic-only signal/ack,
then collects itself. Values are sequential pairs, not simultaneous process sums.

Evidence in primary Service: `artifacts/area-gc-20261014/summary.json`, probe,
preparation/overlay manifests, `trial-2/gc.ndjson` and complete PDF/cleanup checks.
Initial `trial/` failed in Docker bake before generation; it is excluded and
preserved. No normal-performance timing/savings claim is made from forced GC.
Diagnostic awaits alter the isolated renderer's scheduling only; the production
snapshot-before-await contract and artifact remain unchanged.

Selected process values (MiB): Service after parse heap45.39->24.97 while RSS
190.96->190.11; renderer after validation heap32.13->15.40 while RSS141.31->137.71;
renderer after layout heap61.97->51.73 while RSS186.05->186.20. Before writer,
Service heap remains24.69 and renderer52.04 after GC. This separates reclaimable
JS allocations from remaining reachable heap, but RSS beyond heap is not all
reclaimable: native allocations, mappings and allocator capacity also contribute.
Earlier collections affect later checkpoints; this is one diagnostic trajectory.

Because the renderer still held about52MiB after GC, a separate snapshot run
captured both processes before writing PDF. Evidence:
`artifacts/area-gc-snapshot-20261014/trial/{service,renderer}.heapsnapshot`,
`*.analysis.json`, `inspect.mjs`, `trace.mjs`, overlays and PDF checks. Snapshots
contain private document data and stay in ignored local artifacts; summaries
suppress string contents. Direct retaining-edge inspection found:

- Service: a10,210,176-byte string (9.737MiB) remains through
  `renderSerializedJob`'s suspended async frame -> parameters_and_registers[0].
  This is concrete evidence that clearing the local serialized binding did not
  release the original async argument. It corrects the prior lifetime hypothesis;
  lexical scope/source review alone was insufficient.
- Renderer: cacheTextRuntime's context.entries -> Map.table has10,390 directly
  referenced string nodes with17,189,968 bytes of combined self size (16.394MiB),
  plus a458,792-byte backing table. These are reachable before the writer. Shared
  string references and other heap objects mean this is not a dominator retained
  size or a guaranteed RSS saving.

Both completed diagnostic PDFs preserve98 pages and exact decoded drawing,
resource, geometry and link parity. Each passes1457 text values,363 requirements,
396 links and29 groups; no OOM and cleanup PASS. Minimum host reserve2607.25MiB
for GC-only and1719.125MiB for snapshots. Temporary preflight image removed.

Next bounded fixes can now target demonstrated retainers: avoid passing the large
JSON string as a suspended async parameter (for example an explicitly cleared
payload holder), and provide a lifetime boundary for the text cache after its
last layout/page-field use. They require independent behavior tests and normal
three-run evidence; no production GC, snapshot hooks or further fixes are part
of this diagnostic request. Do not predict peak reduction from adding self sizes.

### Service transport JSON holder fix and three normal runs

Owner authorized only the demonstrated Service JSON retainer fix, separate
release verification, then three normal Area98 runs with unchanged PDF. Inline
Service implementation and evidence review; execution IDs not applicable.
Service candidate commit `54c7a4a` replaces the async string argument with a
mutable payload holder and clears its text after handing it to stdin. Public
serialization errors remain rejected promises. Core area.2, text cache and
renderer behavior are unchanged; no production GC or snapshot hooks were added.

Evidence in primary Service:
`artifacts/area-json-holder-20261014/` contains the 195-pass Linux Service suite,
three normal runs, input/package identities, cleanup checks and `summary.json`.
`artifacts/area-json-holder-snapshot-20261014/` contains the diagnostic overlay,
retainer checker and successful `trial-3/`. The same checker fails the original
snapshot on its 10,210,176-byte transport string, then passes the new snapshot:
the suspended renderSerializedJob argument is an object with empty text and no
matching large transport JSON string remains. Service heap after forced GC
before writer is 15,681,896 bytes (14.96MiB), compared with the earlier diagnostic
24.69MiB. This establishes release at that checkpoint, not immediate OS memory
return or a guaranteed normal peak saving. Diagnostic PDF parity passes.

The two preceding diagnostic attempts stopped before generation for insufficient
host reserve (1523.05 and1333.43MiB versus1536MiB). They are preserved, excluded
from results and cleaned up. After host memory recovered, trial-3 and all normal
runs passed the unchanged guards. Normal runs use no forced GC or snapshots.

| Normal run | Worker seconds | Peak container working set MiB |
| --- | ---: | ---: |
| 1 | 11.574254 | 358.652344 |
| 2 | 11.391249 | 352.726563 |
| 3 | 11.391558 | 341.484375 |
| Mean | 11.452354 | 350.954427 |

All three PDFs retain98 pages and exact decoded drawing/resources/geometry/link
parity with the accepted baseline, with1457 text values,363 requirements,
396 internal links and29 groups checked per run. Zero OOM kills or guard stops;
minimum host free RAM1680.64MiB; all trial cleanup checks pass.

The previous normal set averaged362.398438MiB, so this set is11.444011MiB lower
(3.16%). These are separate shared-host samples, not a controlled paired causal
estimate. Sampling is200ms and the container includes the API client/observer.
The concrete success is the verified missing retainer and unchanged output;
peak saving remains variable. Text-cache work,483-page acceptance and release
integration remain open and outside this request.

### Two bounded text-cache experiments (owner stop boundary)

Owner authorized at most two further changes to document-generation memory,
each with three normal Area98 runs and unchanged PDF. Queue/concurrency design,
483-page testing and release integration are excluded. Inline implementation
owner is Core, with Service consuming private candidate packages; execution IDs
are not applicable. Core commit `fdcb9fc` contains only the cache changes/tests;
the pre-existing uncommitted Area migration remains separate in the worktree.

Attempt1 adds idempotent cache disposal after appendPageNumbers, the final text
consumer, before font subsetting/writing, and in failure cleanup. Pending misses
cannot refill a disposed cache. Core512 tests pass (including disposal/pending
request and success/failure lifecycle checks); the packed area.3 consumer passes
195 Linux Service tests. Separate renderer snapshot before writing confirms the
cache Map has zero directly referenced strings and a152-byte table, versus the
earlier16.394MiB of direct string self sizes. The diagnostic PDF remains identical.
Normal generation has no forced GC or snapshot instrumentation.

Attempt2 retains disposal and reduces the internal UTF-16 cache payload budget
from32 to8MiB, keeping8192 as the entry limit. This bounds accumulation during
layout; evicted entries can be computed again. Core512 tests and Service build
pass; packed area.4 runs the real Linux API/PDF path three times. The195-test
Service suite belongs to area.3 and was not rerun for area.4; unchanged Service
behavior plus the area.4 real API runs are the scoped consumer proof.

| Candidate | Worker seconds (3 runs) | Peak working set MiB (3 runs) | Mean MiB |
| --- | --- | --- | ---: |
| area.3: disposal | 11.126988 / 11.259346 / 11.311507 | 349.687500 / 340.722656 / 354.160156 | 348.190104 |
| area.4: disposal +8MiB | 11.424370 / 11.542929 / 11.470918 | 309.644531 / 333.664063 / 349.164063 | 330.824219 |

Prior JSON-holder baseline mean was350.954427MiB. Attempt1 changes that by only
2.764323MiB; attempt2 is20.130208MiB lower (5.74%) with mean worker11.479406s
versus baseline11.452354s. These are observational shared-host sets, not a
controlled causal reduction or a guaranteed per-job budget. The final set spans
39.52MiB; host pressure and Docker/WSL restart before its last run limit comparison.
Its cgroup kernel peak current values are318.22/347.05/370.22MiB: these include
reclaimable memory and differ from sampled working set, so do not advertise a
hard330MiB peak ceiling or reliable reduction of total peak current.

All six completed normal PDFs retain98 pages and exact decoded drawing,
resources, geometry and links; each checks1457 text values,363 requirements,
396 links and29 groups. Zero OOM kills or runtime guard stops. Minimum host free
RAM1911.91MiB for attempt1 and1282.84MiB for attempt2; the1536MiB start gate and
1024MiB runtime reserve remain unchanged. All completed stacks were cleaned up;
Docker Desktop stopped and WSL shut down afterward.

Evidence under primary Service:
`artifacts/area-cache-release-20261014/summary.json`, tests and normal trials;
`artifacts/area-cache-release-snapshot-20261014/trial-3/` snapshot/analysis/parity;
`artifacts/area-cache-budget-20261014/summary.json`, `after-98-1`,
`after-98-2-retry` and `after-98-3-retry`. Core artifact directories of matching
names contain pack recipes/full expected file identities. Failed pre-generation
attempts are preserved/excluded: diagnostic trial had low host reserve; trial-2
used an old expected-package locator (corrected for trial-3); final normal
attempts2 and3 initially failed host reserve before generation. No failed
generation or PDF mismatch was hidden by these retries.

Keep area.4 as the tested private candidate, not release evidence. The two-change
budget is exhausted; stop optimization here. The upper250MiB target is not met,
and these results do not establish that it is impossible. Further redesign or
additional tuning requires a new owner decision.

### AI authoring guide (documentation only)

Owner requested a guide for Luna/Terra to interpret a reference PDF into reusable
semantic templates, plus a proposal to avoid direct file edits. The bounded
documentation work is [AI template authoring guide](flowdoc-ai-template-authoring-guide.md),
with two complete synthetic template/request pairs under
`docs/examples/ai-template-authoring/` and the repeatable checker
`tools/check-ai-authoring-examples.mjs`. Public area.4 validation/preparation/
composition checks pass, including changed long data, empty groups/Areas and
invalid/missing Area input. No new PDF visual parity claim or actual Luna/Terra
trial is made. No PDF reference was supplied for this documentation task.

The proposed authoring tools reuse Service current/publication storage, require
an identity-preserving definition adapter and revision-pinned draft preview,
and restrict the agent's write access at the host/tool boundary. Existing runtime
and API are unchanged; suggested tool names are not implemented endpoints.
No new rooms, publication, release integration or memory optimization were run.
