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
