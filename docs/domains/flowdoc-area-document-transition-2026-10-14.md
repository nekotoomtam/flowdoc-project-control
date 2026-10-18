# Area-based document structure transition

Current reading route for Format sizing work: read only `Format auto/fixed —
นิยาม กติกา และแผนพัฒนา (2026-10-17)` at the end first. It supersedes the
Area-sizing proposal. Read the current `สัญญาช่วง 0 — Format sizing v2` and
`แผนแก้ v2 — fixed เป็นเพดานความสูง` for the maximum-height correction.
Candidate v1 and correction v2 stages0–4 are complete within the recorded scope.
Maximum-height v2 is integrated into the existing primary development branches;
read the final integration section for checks, retained evidence and cleanup.
Core/Service0.4.3 and FlowDocMake0.2.4 are released on the recorded snapshot
branches/tags; installation remains pending separate owner authorization.
Area remains the ordered list receiver.
For the completed Section–Area foundation, start with `สัญญาช่วง 0 — Section
instance และ Area — 2026-10-17` at the end, then the immediately preceding
`แผนปรับ Section–Area ตามภาพอ้างอิง — 2026-10-17` when sequencing work.
Read linked JSON only for the operation needed. Earlier sections retain
historical decisions/results, including the old object-map request; the current
Section-instance Stage 0 contract governs that foundation; the Format sizing
section governs the new sizing scope. Do not load the full history
as startup context; use the dated inspection only when implementation evidence
is needed.

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

### Release 0.3.0 acceptance — 2026-10-15

Owner resumed the paused task and authorized complete verification, release and cleanup.
Core release6d2a9b7 (sourcef21ab6a) and Service release0c57eec (source57d9fd2)
were pushed with annotated v0.3.0 tags. Release trees equal the verified candidate
trees; integration ancestry retains source commits for clean worktree removal.
Core533 tests/73 suites and installed Linux package consumers passed. Service222
tests/75 suites passed with zero skips. Read-only Core contract review found no
blocking issue. PDF consumer visual review covered247 pages, with48 final-package
PDF files byte-identical to the reviewed outputs. Actual PDF TOC destinations and
authored numbering were checked independently.

SRS98 pages passed full comparison against the previously running area.5 renderer:
96 pages have identical drawing commands; pages36/42 only remove an orphan repeated
Features List header at the page bottom. All body text, page resources, geometry
and links remain equal. All361 explicit REQ codes in this fixture match source.
This is document correctness evidence, not a new RAM or483-page capacity result.

The live DB was backed up before cutover; two existing drafts and zero published
versions remain. Migration014 originally deployed CRLF bytes; Git normalization
had changed checkout bytes. An exact-file -text rule now preserves the original
applied bytes (SHA256c17b4d2d8740a1790503c515d5ef55ca69e88721cbc1416a7b2f4f7522b7157b).
No SQL semantics or stored migration history was changed. Final live migration
check returned applied:[], and MCP contract/direct PDF saving passed from primary
Service. Local authoring remains available; publication remains disabled.

Retired artifacts: unused model4–17 runtime branches, automatic legacy page footer,
unused table flow and old vendored tarballs. Meaningful feature tests migrated;
historical SQL and model4 rejection fixtures retained. Old vendor files and all
worktree artifacts are preserved under primary artifacts/release030. Manuals now
point to Area18/0.3.0 and the detailed developer reference rather than old models.
Both clean merged Area worktrees and their integrated branches were removed.
After cleanup, MCP contract and direct PDF saving passed again from primary
Service. The disposable test DB/debug containers were removed; local authoring
API and its preserved DB remain running. Detailed authoring reference and guide
examples pass against the installed0.3.0 package.

### Owner pause — 2026-10-15

Owner explicitly paused the release cutover; do not resume until asked. All active
subagents interrupted. No running test process found at pause. Changes remain
uncommitted in the two Area worktrees; neither release branch/tag was updated,
and no worktree or user template was published/removed.

Checkpoint: Core build and 533 tests / 73 suites passed after Area18-only runtime,
fixture and test migration. Legacy dead table/page-number paths removed. Local
Core package/lock set to0.3.0. Linux build/native packaging completed but packed
consumer FAILED in checkPdf.mjs: parent-migrated fixtures/pdf resolved snapshots
lack explicit headerMode/footerMode and inline sourceMap entries. Fix fixture
migration and rerun consumer; this is not release acceptance. Log:
flowdoc-core-area-v18/artifacts/release030-packed.log; package build artifact:
artifacts/1791997169396. Other consumer assertions remain unverified.

Service runtime/tests/examples migration is in progress. Installed node_modules
contains a provisional0.3.0 Core package for non-render tests only; it lacks native
resources and is NOT the final vendored release. Service package/lock/vendor still
need final update. Service agent reported33 targeted tests passing; migration
agent verification/review was interrupted and must be checked on resume.
Core README/template-guide legacy instructions were consolidated into current
Area18 entrypoints, retaining API/build/resource guidance and links to detailed
Project Control Developer Documentation. Obsolete version instructions remain
recoverable in Git history, not current guidance.

Remaining: finish/review Service migration tests, packed Linux/PDF acceptance,
final vendor/version/checksum and documentation alignment, release snapshot/tag
integration following repository conventions, switch live MCP launcher off Area
worktree, then remove only clean merged worktrees. Live authoring service/DB remain
untouched. Isolated disposable test DB container: flowdoc-release030-test-db
(local port55432), stopped on pause; restart only for further tests.

### Release 0.3.0 cutover request — 2026-10-14

Owner now authorizes release integration, retirement and worktree cleanup,
superseding the earlier no-release/no-primary-checkout-change scope for this work.
Owner explicitly confirmed: accept only Area model18; retire models4–17, including
their older Area variants. Preserve authored/static/cover nodes valid in model18.
Target Core and Service package versions are 0.3.0 on release. No user template
publication, historical snapshot rewrite, unrelated worktree deletion or npm
publication is implied. flowdocmake remains a separate planned task.

Single-room implementation/evidence review in existing candidate worktrees;
execution IDs N/A. Preserve immutable historical migrations and data. Inventory
legacy paths/fixtures and transfer relevant feature coverage before deleting them.
Acceptance requires Core/Service build and affected suites, packed Linux consumer,
Area PDF content/layout/link checks, vendor checksum/version agreement, active
tool connection moved off candidate paths, and clean merged worktrees before
removal. Prior 483-page Area acceptance is still open; do not mark it passed from
the older non-Area capacity run. No performance improvement claim in this release.

Initial inspection: local DB has two model18 currents, no template_versions and
no queued/running jobs. Core baseline build and 514 tests pass. Its previously
uncommitted Area migration was preserved as commit932b88c before retirement edits.
Service MCP launcher still points to service-area-v18; migrate it and verify the
connection before removing that worktree. Service vendor archives include old
packages; archive necessary local evidence outside Git before retiring unused ones.
New rejection tests demonstrate two previously valid legacy templates are accepted
by the old validator; the Area18-only entrypoint rejects them. This is interim
proof, not completion: old internal branches/types, fixtures, consumers, manuals,
packaging and final release checks remain to be completed.

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

Owner subsequently requested planning for create/update/validate/preview, with
human confirmation before publication. The proposed bounded implementation is
[template authoring tools plan](flowdoc-template-authoring-tools-plan.md).
It reuses Service storage/Core, adds revision-pinned unpublished preview and a
restricted tool adapter; phase1 exposes no publish tool. Planning is complete;
implementation, host connection and actual Luna/Terra PDF trial are not started.

## Section–Area clarification and read-only inspection — 2026-10-17

Authority: owner's current request to retain six questions and inspect existing
behavior before any implementation. Role: Planning Partner / Cross-Repo Boundary
Reviewer; owners Core (model/layout), Service (transport/storage/clone), Project
Control (this shared record). Single-room inline; execution IDs N/A. Risk routine;
scope is read-only product discovery plus this existing document. Proof budget:
source trace, bounded synthetic probes/focused tests, and metadata from the two
retained live drafts; no new drafts, PDF generation, runtime/DB changes, release
or installation. This is a new clarification, not a reopened historical round.
The earlier request-object approval above remains a historical decision;
do not silently rewrite it to imply the newly clarified intent was implemented.

Owner's conceptual reference is the supplied docx generator: `sections[]` owns
paper properties, header/footer and ordered children. One Section can flow over
many pages; a page break does not create a new Section. Area resembles insertion
of separately authored content (`...tableHistory`, `...dataunit`) with its own
input values and owned Formats. Cover/approval/history/contents/introduction may
be assembled inside one Section rather than becoming Sections just by name.
The owner expects ordered Section instances with independent data and fresh
instance IDs on split/clone; default display names derive from the template name
plus 1/2/etc. Implementation support must be checked rather than inferred.

Questions retained for later decisions (not implementation approval):

1. Separate instance ID, source-template/definition ID, data lookup key, display
   name and array order; names must not accidentally become shared data identity.
2. Define the Area insertion boundary: content expansion versus authority to
   change page dimensions, margins or the owning Section's header/footer.
3. Define cover/first-page header/footer behavior within one flowing Section.
4. Separate authored page breaks from Section transitions and their page starts.
5. Define page-number continuation/restart and whole-book versus Section TOC scope.
6. Define shared Format editing versus independent copied content on clone/reuse.

### Observed current behavior

Inspected Core `6cd25cac1ea7d4b5cd4b8df29d2c151dd3e409c0` (0.4.1), Service
`ee11ae80332bdf6e81a948bc35be98adfc79b7d3` (0.4.1), and the two retained live
drafts. Installed Service/Core remain 0.4.0 and FlowDocMake 0.2.1; relevant Core
template/data/binding/composition/layout paths and Service assembly/adapter are
byte-identical in Git to v0.4.0. No runtime upgrade was performed for inspection.

| Question / boundary | Observed result and source |
| --- | --- |
| Section model and request | Definition already has `sections: AreaSection[]`; each has id/key/optional label, page layout, source graph, input schema and own bands. Request is a map keyed by Section.key, not an instance array. Prepared data is mapped by definition Section.id. Source: Core template/types.ts, data/prepareSections.ts, composition/composeSections.ts. |
| Data collisions | Same variable names in different Sections are scoped separately; synthetic FIRST/SECOND values remain distinct and definition order wins over request-key order. Duplicate Section keys and Area IDs are rejected rather than silently sharing data. Combining unchanged copies therefore needs remapping; merely changing a display name does not suffice. |
| Identity and clone | Service sections.id is a fresh normalized UUID, while source_definition_id preserves the definition's s.id. Whole-draft clone deep-copies the definition and changes templateId/docKey/name; it generates new normalized rows but retains definition Section IDs/keys/Area IDs. No automatic template-name-plus-1 Section label is implemented in the inspected path. Sources: Service authoring/service.ts cloneDraft, authoring/adapter.ts, templates/assembly.ts, migration 011. This is not yet an explicit split/clone Section-instance composition contract. |
| Area insertion | An Area node expands ordered owned Format fragments into ordinary content with generated node IDs. Paragraphs/tables/images and authored page-break/TOC can be inserted. It does not carry page layout or header/footer settings; these belong to its Section. Area IDs are unique across the definition and each Area must be placed exactly once. Area inputs inside Format input schemas are rejected, so recursive function-call semantics are not supported. Sources: binding/expandAreas.ts, template/sectionOwnership.ts and validateSchemas.ts. |
| Cover / first page | Bands already support all/first/continuation/none; continuation suppresses the first page within a flowing body Section. Existing special role:cover is only permitted as the first Section and suppresses bands. Fixed-height cover blocks are restricted to authored root blocks of that cover Section; the same fixed-height block in an Area Format is rejected. A flowing cover-like content fragment can be inserted, but exact existing cover behavior cannot be claimed from that alone. Sources: template/pageSections.ts, validateGraph.ts, composition/validateResolvedDocument.ts, layout/pageBands.ts. |
| Page transitions | An authored break inside an Area makes another page within the same Section; repeated/leading/trailing breaks are covered by existing tests. Each nonempty normal Section currently starts a fresh page; no continuous mid-page Section transition is exposed in the inspected model. Source: layout/documentFlow.ts. |
| Numbering and TOC | Section numbering supports continue/restart/exclude and visibility. A TOC can be inserted through Area. Contents collection spans non-cover Sections globally; current graph validation permits at most one TOC in the resolved document, so independent per-Section/per-document TOCs are not implemented. Sources: template/pageNumbering.ts, composition/contents.ts, template/validateGraph.ts. |
| Shared/copy editing | Whole-draft clone is a deep copy with independent normalized rows. Within one Area, multiple entries use its owned Format definition; changing that definition affects its subsequent expansion. Formats have one ownerAreaId rather than a reusable externally referenced shared-library identity. Cross-template composition must also address document-wide styles/pageLayouts/Area IDs/anchors; variable scopes alone do not complete that contract. |

### Retained live templates

- SRS 98-page draft `008980f5-dd0d-4f7d-86be-2fc3f300e08d`, revision 1,
  fingerprint `ffcde8736980748a950fb56c2c786b66ef0f52d482ac383a7e31a91ef0a62f02`,
  has seven Sections: cover/approval/revisions/contents/legend/introduction/body.
  Four contain Areas; cover/approval/contents are authored directly. Section
  labels are absent. This is the current template's seven-part construction,
  not proof that these semantic parts must be separate Sections. Consolidation
  has not been tested and must preserve page/band/cover behavior explicitly.
- Latest two-page SB1 draft `af9015b7-df78-4af7-9444-15bd56a05f11`, revision 3,
  fingerprint `a9b666153d72ea23b216d473521a9e2d43050f2905c263b5d5e10ebfb89ccc00`,
  has declaration/cargo Sections and no Area nodes. Their different labels and
  page content alone do not establish whether the boundary is necessary; do
  not classify the two-section form as invalid without its layout requirements.

### Evidence and outcome boundary

Core focused tests passed 12 files / 95 tests, zero skips. Ten separate synthetic
observations exercised array-request rejection, duplicate keys/Area IDs, isolated
same-name variables, order/page starts, Area breaks, Area TOC, two-TOC rejection,
nested-Area rejection, fixed-height-in-Area rejection, and clone decomposition.
The clone probe executes the pure adapter path, not an actual new live clone;
layout probes use fake text metrics. Script fixture syntax was corrected before
the successful probe run; this was not a product defect or a relaxed assertion.
No new PDF or visual parity claim follows from these checks.

Local evidence: `C:/Users/nekot/Documents/Codex/2026-10-17/section-area-inspection/`
contains probe.mts, probe-result.json, core-focused-tests.log and
live-template-summary.json. Product source and live data are unchanged.
No system map, product Evidence registry, closed execution context or installed
guide snapshot was promoted/rewritten. This appendix is supporting context only,
not another mandatory AI startup document.

Conclusion: the Section/Area foundation partly matches the clarified model;
the current SRS template, request identity/instance composition, full cover
insertion and independent TOC scopes still need decisions or bounded work.
Do not declare wholesale foundation failure, claim the new design already
passes, or silently migrate the retained templates. Return to the owner for
scope selection; implementation is not authorized by this inspection request.

## แผนปรับ Section–Area ตามภาพอ้างอิง — 2026-10-17

**สถานะ: เจ้าของอนุญาตช่วง 0 เฉพาะปิดสัญญา/ตัวอย่าง; ยังไม่อนุญาตแก้ runtime.** เจ้าของขอแยกงานระบบกับงานแม่แบบ
และเรียงลำดับก่อนหลัง. ใช้ผลสำรวจด้านบนเป็นฐาน ไม่เปิด execution เก่า.
Role Planning Partner / Cross-Repo Boundary Reviewer; owners Core, Service และ
Project Control/FlowDocMake ตามตาราง. Single-room planning; execution IDs N/A.
Work Size large, Risk Tier routine; ความเสี่ยงที่ต้องควบคุมคือ breaking contract,
ID/การอ้างอิงคลาดเคลื่อน และเปลี่ยนเอกสารเก่าโดยไม่ตั้งใจ.

**Goal:** สร้าง Section เป็น instance ของโครงเอกสารที่มีการตั้งหน้า หัว–ท้าย และ
ข้อมูลแยกกัน ต่อกันตามลำดับได้; ใช้ Area แทรกเนื้อหาจาก Format ภายใน Section.
**Architecture:** Core ดูแลสัญญา/ขอบเขต/การขยาย/จัดหน้า; Service ดูแล identity,
บันทึก/clone และ HTTP; FlowDocMake เรียกสัญญาที่ประกาศจริง. แม่แบบเป็นผู้เลือก
Area/Format และข้อมูล ไม่สร้างเงื่อนไขพิเศษชื่อ SRS/cover/approval ใน engine.
**Tech stack:** TypeScript Core/Service, PostgreSQL, native MCP และ PDF runtime เดิม.
**Spec:** คำชี้แจงเจ้าของและผลสำรวจในหัวข้อ 2026-10-17 ข้างบน; รายละเอียดที่ยัง
ไม่ปิดเป็นผลส่งมอบของช่วง 0 ไม่ใช่ช่องให้ผู้ลงมือเดาเอง.

สำหรับผู้ลงมือภายหลัง: ใช้ executing-plans ในแชตเดียว; ไม่เปิด subagent/ห้องใหม่
หากไม่มีอำนาจแยก. เก็บแผนนี้ใน Project Control แห่งเดียว ไม่สร้างคู่มือเริ่มต้นเพิ่ม.
Product implementation ต้องใช้ lane แยกเมื่อเริ่มจริงตามความเสี่ยง/งานร่วมในเวลานั้น.

### แยกประเภทงาน

| เรื่อง | ต้องแก้ระบบ | ปรับแม่แบบ/ข้อมูล |
| --- | --- | --- |
| Section เป็น array | Definition มีแล้ว; ต้องปิดและทำ transport ของ request แบบ array ที่จับด้วย instance ID แทนชื่อ พร้อมกติกาข้อมูลเก่า | เปลี่ยนการส่งข้อมูลของตัวอย่างหลังสัญญาใหม่พร้อม |
| clone/แยก/ต่อ Section | ทำ mapping identity ของ instance และส่วนประกอบที่อยู่ในขอบเขตนั้น; ชื่อ default และการอ้างอิงต้องไม่ชน | ตั้งชื่อกำกับและเลือกลำดับในโครงใหม่ |
| ข้อมูลของแต่ละ Section | Scope มีแล้ว ให้รักษา; ตรวจการประกอบสำเนาและแยก global ที่จงใจใช้ร่วม | ย้ายข้อมูลเฉพาะเอกสารออกจาก global เมื่อทำให้สำเนาต่างค่ากันไม่ได้ |
| Area แทรกเนื้อหา/ขึ้นหน้าใหม่ | มีแล้ว ไม่เขียน engine ซ้ำ | ย้ายส่วนปก/ผู้อนุมัติ/ประวัติ/สารบัญ/บทนำเข้าสู่ Format และ Area ตามแผนของแม่แบบ |
| หน้าปกภายใน Area | เติมเฉพาะข้อจำกัดที่พบ: fixed-height content ผ่าน Area ตามกติกาที่ปลอดภัย; หัว–ท้ายหน้าแรกมี mode ใช้ได้แล้ว | เลือก mode และโครงปก/จุด page break; ไม่สร้าง Section ใหม่เพราะชื่อส่วนอย่างเดียว |
| สารบัญ | รองรับ scope ทั้งเอกสารหรือเฉพาะ Section และหลาย Section ที่มีสารบัญของตัวเอง; ไม่เพียงลบ guard จำนวนหนึ่งออก | เลือก scope และทำ heading/anchor ของแต่ละชุดให้ตรง |
| รูปแบบฟอนต์/หน้าและ ID อ้างอิง | การประกอบข้ามโครงต้องจัดการ namespace ของ styles/pageLayouts/Area/anchor ที่เกี่ยวข้อง ไม่ใช่แก้เฉพาะตัวแปร | เลือกทรัพยากรและข้อมูลจริงที่อ้างได้ตามสิทธิ์เดิม |
| ระบบรับภาพลูกค้า/คลังภาพถาวร | แยกนอกแผนนี้ ยังเป็นช่องว่างที่ทราบ | ใช้ภาพชุดตรวจที่เตรียมถูกต้อง; ไม่ถือว่าการผ่านแผนนี้ทำให้ external-client image API พร้อมแล้ว |

### ช่วง 0 — ปิดสัญญาและตัวอย่างก่อนแก้ runtime

Owner Project Control ร่วม Core/Service; ผลส่งมอบเป็นข้อกำหนดในเอกสารนี้กับ
ตัวอย่าง JSON ขนาดเล็กสำหรับหนึ่งโครงและโครงเดิมสองสำเนา ไม่ใช่โค้ดผลิตภัณฑ์.

- [x] แยก public Section instance ID, source identity, normalized DB ID, display
  name และลำดับ array. clone/แยกเป็น instance ใหม่; เปลี่ยนชื่อ/เรียงใหม่ต้องไม่
  เปลี่ยน identity. กำหนดชื่อเริ่มต้น `<ชื่อโครง>1`, `<ชื่อโครง>2` และขอบเขตการนับ.
- [x] ปิดรูปแบบ request array และตัวจับคู่ด้วย instance ID. เจ้าของยืนยันว่า
  สร้าง/ต่อ instance ในแม่แบบก่อน แล้ว request ส่งค่าของ instance ที่มีอยู่;
  ไม่เปิดให้ payload สร้าง graph/clone ใหม่ระหว่าง render โดยปริยาย.
  ต้องตกลงลำดับที่เป็น authority, instance ที่ขาด/ซ้ำ/เกิน, data/header/footer
  และกฎเมื่อ request ไม่เรียงตรงแม่แบบก่อนเขียน code.
- [x] ปิดการ remap ตาม ownership จริง รวม Section/Area IDs, Format definitions,
  bindings, styles/pageLayouts, anchors และ references ที่เกี่ยวข้อง. ห้ามสุ่ม ID
  ของ external font releases/assets หรือเปลี่ยนสิทธิ์ทรัพยากรตามไปด้วย.
- [x] ปิดขอบเขต Area: รับ local data และขยาย content; ไม่เปลี่ยน paper/margins/
  bands ของ Section. ยังไม่ทำ Area ซ้อน Area หรือ shared Format library ในรอบนี้.
- [x] ปิดกรณีปกภายใน Section: หน้าแรกซ่อน band, หน้าเนื้อหาต่อใช้ band เดิม,
  ความสูงคงที่/overflow/page break และการนับหน้าต้องชัด; ไม่ย่อเนื้อหาหรือสร้าง
  blank page เพื่อเลียนผลเดิม. ไม่ขยายเป็นระบบ absolute positioning ทั้งหมด.
- [x] ปิด TOC scope/เลขหน้า: whole document หรือ current Section, anchor namespace,
  continue/restart/exclude และกรณีหลายสารบัญ/ไม่มี heading; แยก logical page number
  จาก PDF page index. ไม่เพิ่มสารบัญภาพ/ตารางโดยอาศัยตัวอย่าง docx เพียงอย่างเดียว.
- [x] ปิด version boundary ของ definition/request/prepared snapshots ที่เปลี่ยนจริง
  แยกจาก font schemaVersion และ package version. ระบุทางอ่าน/แปลงโครงเก่า,
  ผลต่อ stored fingerprint และ reader/runtime ที่ต้องใช้; reject แบบผิดรุ่นชัดเจน.
  ไม่ใช้ model/version เดิมแล้วเปลี่ยนความหมายเงียบ ๆ หรือ rewrite published history.

**ตรวจรับช่วง 0:** ตัวอย่าง clone ซ้ำสองชุดใช้ตัวแปรชื่อเดียวกันแต่ต่างค่าได้;
เปลี่ยนชื่อ/ลำดับไม่สลับข้อมูล; ตัวอย่างปก+สารบัญ+เนื้อหาอยู่ใน Section เดียว;
ตัวอย่างข้อมูลเก่ามีเส้นทางที่ระบุแน่นอน. เจ้าของทบทวนสัญญาก่อนเริ่มช่วง 1.

### ช่วง 1 — Identity, clone/ต่อโครง และทางรับข้อมูล

Owner Core + Service + FlowDocMake. แก้ระบบ ไม่ปรับแม่แบบจริง.
ไฟล์หลัก: Core template/types.ts, sectionOwnership.ts, data/prepareSections.ts,
data/types.ts, composition/composeSections.ts; Service templates/assembly.ts,
authoring/adapter.ts, authoring/service.ts, http/authoring.ts, tools/server.ts;
migration ใหม่ถ้าผลช่วง 0 ต้องเพิ่ม storage contract. FlowDocMake scripts/schema
และ compatibility ต้องสะท้อน contract จริง ไม่แปลงข้อมูลเองคนละกติกา.

- [x] เพิ่ม failing tests ตามสัญญาช่วง 0 แล้วทำ request identity/instance path
  ให้ผ่าน; ใช้ public Core validation และ packed artifact ใน Service.
- [x] ทำ clone/แยก/ต่อด้วย mapping ที่ตรวจครบ; clone เป็นข้อมูลอิสระ ชื่อกำกับไม่ใช่
  data key. รักษา stable identities เมื่อแก้ข้อมูล/rename/reorder instance เดิม.
- [x] ตรวจ clone โครงเดิมซ้ำ, ชื่อซ้ำ, ID ซ้ำ/หาย/ไม่รู้จัก, request สลับลำดับ,
  ข้อมูลต่าง owner, stale revision, retry และ rollback เมื่อ remap ไม่ครบ.
- [x] ตรวจ header/footer/local/global scopes, style/pageLayout/anchor references,
  retained retired-font rights และการอ่านข้อมูลเก่าตาม version boundary.

**ผลส่งมอบ:** โครงสังเคราะห์สอง Section instances ที่ข้อมูลไม่ปนกันผ่าน Core →
Service save/open/clone → native MCP; ไม่ต้องมี PDF SRS เต็มเพื่อรับช่วงนี้.
ทดสอบเดิมที่ได้รับผลต้องผ่านก่อน commit; ห้ามทำกับสอง live drafts ที่เก็บไว้.

### ช่วง 2 — Area รองรับปกและองค์ประกอบภายใน Section

Owner Core; Service ตรวจ consumer จากแพ็กเกจจริง.
ไฟล์หลัก: template/validateGraph.ts, sectionOwnership.ts,
composition/validateResolvedDocument.ts, binding/expandAreas.ts,
layout/documentFlow.ts, pageBands.ts และ tests ของ cover/Area/page flow.

- [x] เขียน failing case ของปกที่ติด fixed-height ใน Area แล้วเพิ่มความสามารถ
  ภายใต้กฎ layout ที่ปิดไว้; ไม่ให้ Area ยึดการตั้งหน้าหรือหัว–ท้ายแทน Section.
- [x] สร้าง fixture สั้น Section เดียวที่แทรกปก/ผู้อนุมัติ/ประวัติ/บทนำ/เนื้อหา
  พร้อม page breaks และ band mode เดิม; ใช้ native nodes ไม่ทำภาพเต็มหน้า.
- [x] ตรวจ first/continuation bands, cover overflow, ไทย/รูปภาพ/ตาราง, เนื้อหา
  หลายหน้า และ leading/repeated/trailing break. ข้อห้าม Area ซ้อนยังคงชัดเจน.

**ผลส่งมอบ:** PDF สั้นที่แสดงการประกอบตาม docx concept ได้จริง ตรวจทุกหน้า
และตรวจ text/geometry/band/page count. ใช้ชื่อ Format ใดก็ได้ ไม่มี SRS-specific engine.

### ช่วง 3 — สารบัญและเลขหน้าตามขอบเขต

Owner Core; Service/FlowDocMake ตรวจสัญญาและ pinned preview ที่ได้รับผล.
ไฟล์หลัก: composition/contents.ts, resolvedDocument.ts, template/validateGraph.ts,
pageNumbering.ts, layout/documentFlow.ts, systemPageCounting.ts และ link destinations.

- [x] เพิ่ม failing cases ของสอง Section ที่มีสารบัญอิสระ แล้วทำ scope ตามช่วง 0;
  ไม่เพียงปล่อยสอง TOC ให้ผ่านขณะที่ยังรวบรวม heading ทั้งเอกสารเหมือนเดิม.
- [x] ตรวจหัวข้อ/anchor ชื่อเดียวกันในสำเนาไม่ชน, ลิงก์ไปถูกหน้า/Section,
  whole-document TOC, Section TOC, เนื้อหาว่าง และเลขหน้า continue/restart/exclude.
- [x] ตรวจ pagination ที่สารบัญเองกินหลายหน้า และผลหลัง clone/reorder/แก้เนื้อหา;
  ต้องคำนวณจากเอกสารจริง ไม่กรอกเลขหน้าคงที่ใน payload.

**ผลส่งมอบ:** PDF สังเคราะห์สองชุดต่อกันที่สารบัญและเลขหน้าถูกขอบเขต;
ตรวจทุกหน้าและทุก TOC destination. ใช้ regression เดิมที่ยังตรง contract ต่อได้.

### ช่วง 4 — ปรับแม่แบบ 98 หน้าและ 2 หน้า

Owner ผู้จัดทำแม่แบบผ่าน FlowDocMake; ไม่เพิ่ม engine feature ในช่วงนี้.
ขึ้นกับช่วง 1–3 ที่เกี่ยวข้องผ่านแล้ว. สร้าง unpublished drafts ใหม่แยกจากต้นฉบับ
สองตัวที่เจ้าของให้เก็บ ไม่ overwrite/migrate live โดยอัตโนมัติ.

- [x] ทำ mapping ของ SRS ทั้งเจ็ดส่วนลงโครงตามภาพอ้างอิง: เป้าหมายเริ่มต้นเป็น
  Section เดียว แทรกปก/ผู้อนุมัติ/ประวัติ/สารบัญ/คำอธิบาย/บทนำ/เนื้อหาผ่าน Area
  และเลือก Format. Section เพิ่มได้เฉพาะเหตุผลจริงเรื่อง paper/band/data instance
  ที่ตกลง ไม่ใช่เพราะเป็นหัวข้อหรือขึ้นหน้าใหม่.
- [x] แยกค่ากลางที่ตั้งใจใช้ร่วมกับค่าของแต่ละ Section/Format; ข้อมูลไม่ต้องส่ง
  node graph หรือ page coordinates. ยังใช้ `{format,data}` ตามสัญญา Area ที่มีอยู่
  ไม่เพิ่ม business-data adapter หรือระบบรับภาพลูกค้าแฝงในงานนี้.
- [x] สำหรับแบบ ศบ.1 ตรวจว่าหน้าทั้งสองต้องใช้ page/band settings ต่างกันจริงไหม;
  รวม Section หากใช้กติกาเดียวกันได้ หรือบันทึกเหตุผลที่ยังต้องแยก. ส่วนเนื้อหา
  ที่ต้องแทรก/ใช้ซ้ำให้จัดเป็น Area/Format ไม่บังคับทุก static node ให้เป็น Area.
- [x] ตรวจ values/order/ตาราง/ภาพ/links/ตัวแปรครบและไม่ซ้ำ ก่อน preview;
  ตรวจ PDF ทุกหน้าเทียบต้นทางและ baseline: เริ่มด้วย 98 หน้าและ 2 หน้าที่มีอยู่.
  จำนวนหน้าต่างต้องอธิบายเหตุและให้เจ้าของรับ ไม่ลดฟอนต์/ย่อ/ตัดข้อมูลเพื่อให้ครบเลข.

**ผลส่งมอบ:** definition + request ของ candidate ทั้งสอง, mapping รายส่วน,
PDF/path/hash/render ทุกหน้าและรายการความต่าง; structural pass ไม่แทน visual acceptance.
ถ้าติด engine gap ให้ย้อนกลับ owner/ช่วงที่เกี่ยวข้อง ไม่แก้ด้วยโครงที่ขัดนิยาม.

ช่วง4ปิดงานปรับโครงพร้อมความต่างเดิมตามคำตัดสินเจ้าของท้ายผลช่วง4;
checkbox แสดงการตรวจและส่งมอบตามขอบเขตที่รับ ไม่ได้หมายถึง strict source fidelity ผ่าน.

### ช่วง 5 — ตรวจร่วมและเตรียมส่งมอบ

Owner Core/Service/Project Control ตามผลกระทบ; ใช้ acceptance ของเจ้าของ.

- [x] ทดสอบโครงเดิมสองสำเนาต่อกันและ SRS + แบบฟอร์มในชุดเดียว: ข้อมูล/ชื่อ/ID/
  styles/pageLayouts/Area/anchors ไม่ชน; หัว–ท้ายและ TOC ไม่รั่วข้าม Section.
- [x] ตรวจ packed Core → Service → native FlowDocMake, save/open/clone,
  readiness และ pinned jobs, ข้อมูลเก่า/สิทธิ์, fonts/default/retired ตามผลกระทบ;
  สำรอง/กู้คืนในฐานแยก. ตรวจ PDF ทุกหน้าของชุดตรวจที่ใช้รับงาน.
- [x] ทบทวน coverage ว่าเกณฑ์ใดมี source/test/PDF รองรับ; skipped/unverified
  ไม่ใช่ PASS. ใช้ซ้ำผลเดิมเฉพาะเมื่อพิสูจน์ identity; ไม่รัน full suite ซ้ำไร้เหตุ.
- [x] อัปเดตคู่มือเดิมและ compatibility/package versions ตามความเปลี่ยนแปลงจริง
  เตรียม candidate ที่ตามกลับได้. ไม่เพิ่ม mandatory AI reading หรือแทน plugin
  ที่ติดตั้งจนกว่าจะมีคำสั่ง. ส่งผลให้เจ้าของก่อน merge/release/tag/push/install.

**ตรวจรับ:** clone/reorder/ข้อมูลแยก, Area insertion, cover/bands, TOC/numbering,
สองแม่แบบ และ compatibility ผ่านตามสัญญาที่ปิดไว้ พร้อมข้อจำกัดที่ยังเหลือ.
เมื่อครบให้หยุด ไม่ขยายไป UI, recursive Areas, shared Format library, external
image ingestion, auto-fit หรือระบบรายงานผลกระทบฟอนต์ที่พักไว้.

### ลำดับและจุดตัดสิน

ลำดับที่เสนอ: **0 สัญญา → 1 identity/API → 2 Area/ปก → 3 TOC/เลขหน้า →
4 แม่แบบ → 5 ตรวจร่วม/ส่งมอบ**. งานตัวอย่าง JSON/mapping ของแม่แบบเตรียมได้
หลังช่วง 0 แต่ไม่อ้างผ่านหรือย้าย live จนกว่าความสามารถที่ใช้จริงพร้อม.
การอนุมัติแผนไม่ใช่อำนาจเริ่มพัฒนาอัตโนมัติ และไม่อนุญาต release/deploy.
รอบนี้แก้เฉพาะแผนนี้; หลักฐานเดิมและผลรับงานเก่าคงตามเวลาของมัน.

## สัญญาช่วง 0 — Section instance และ Area — 2026-10-17

**Authority Boundary:** เจ้าของสั่งปิดสัญญาช่วง 0 และยืนยันให้ต่อ/clone ในแม่แบบ
แล้วบันทึกก่อนสร้าง PDF. Owner Project Control; role Planning Partner / Cross-Repo
Boundary Reviewer; single-room inline, execution IDs N/A. เป็น target contract
สำหรับช่วงพัฒนาถัดไป ไม่ใช่ API/รุ่นที่เปิดใช้แล้ว. Core/Service runtime, live
drafts, installed FlowDocMake และ published history ไม่เปลี่ยนในช่วงนี้.
หลักฐานคือเอกสารและการตรวจความสอดคล้องของ JSON; ไม่อ้างผ่าน Core/PDF รุ่นใหม่.

### 0.1 ตัวตนและชื่อ

| ค่า | สัญญา |
| --- | --- |
| `Section.id` | Public instance ID รูป UUID; สร้างตอน authoring/new/clone/import ไม่สร้างตอน render. ไม่ใช้ตำแหน่ง array หรือชื่อเป็น identity. Tool สร้าง UUID ได้ตอนประกอบ definition; Service ตรวจรูป/ความไม่ซ้ำและสิทธิ์ของ draft. UUID เพียงอย่างเดียวไม่ให้สิทธิ์เข้าถึงข้อมูล. |
| normalized DB Section ID | identity ภายใน storage แยกจาก public id; ไม่ส่งให้ generation client และไม่ใช้แทน public id. |
| `origin` | optional metadata ที่ Service ตรวจได้จากการ copy: `{templateId,revision,sectionId}` ของต้นทางทันที. ไม่ dereference ตอน render และไม่เป็น shared live link. ต้นทางถูกลบก็ไม่ทำให้สำเนาหาย. Initial authored section ไม่มี origin; client ห้ามแต่ง origin เพื่ออ้างสิทธิ์. |
| `label` | ชื่อกำกับ nonblank; ใช้แสดงผลและแก้ชื่อได้ ไม่จับคู่ข้อมูล ไม่บังคับ unique. |
| `nameBase` | ฐานชื่อที่เก็บตอนสร้าง Section จากชื่อโครง ณ เวลานั้น; clone/import เก็บฐานเดิม ไม่ตัดเลขจาก label และไม่เปลี่ยนตามการ rename ต้นทางภายหลัง. |
| default label | `<nameBase><N>` โดย N เป็นจำนวนเต็มบวกน้อยที่สุดที่ label นี้ยังไม่ถูกใช้ในแม่แบบปลายทาง นับแยกตาม nameBase. เช่น SRS1 → SRS2; split ไปโครงว่างเริ่ม SRS1. ผู้ใช้เปลี่ยน label เองได้ การเปลี่ยนชื่อ/ลบอาจทำให้เลขว่างถูกใช้ใหม่ แต่ห้ามนำ ID เก่ากลับมาใช้. |
| ลำดับ | `definition.sections[]` คือ authority ของลำดับพิมพ์; `request.sections[]` เป็นชุดข้อมูลที่จับด้วย id. การสลับรายการข้อมูลใน request ไม่สลับการพิมพ์. |

New/import/split-copy ให้ public id ใหม่ทุก Section instance. Rename, reorder,
แก้ข้อมูลหรือย้ายตำแหน่งในแม่แบบเดิมคง id. Whole-draft clone ของ model ใหม่ต้อง
สร้าง public Section IDs ใหม่ด้วย ไม่ใช่เปลี่ยนเฉพาะ templateId/DB rows.
`Section.key` ไม่อยู่ใน definition/request รุ่นใหม่; label ใช้แทนหน้าที่ชื่อกำกับ
ส่วน data lookup ใช้ id เท่านั้น. Section IDs ต้องไม่ซ้ำใน definition เดียวกัน.

### 0.2 Definition, input และลำดับ

Definition เก็บ `sections[]` ของ instance ที่บันทึกแล้ว พร้อม inputSchema,
pageLayoutId, source fragment, header/footer schemas/fragments และ numbering.
Style/page layout ถูกอ้างจาก registry ของ definition ตามเดิม. AreaFormats อยู่
ใน registry ของ definition และผูก ownerAreaId; ไม่ต้องย้าย registry ตามรูป JSON
เพื่อเปลี่ยนความเป็นเจ้าของ. ไม่มี Section.formats ที่ใช้วางเนื้อหาข้าม Area.

Generation request ของ model ใหม่:

```json
{
  "docKey": "section-array-example",
  "data": {},
  "sections": [
    {
      "id": "10000000-0000-4000-8000-000000000011",
      "data": {"projectName": "Project A", "details": []},
      "header": {"title": "Header A"},
      "footer": {"note": "Footer A"}
    }
  ]
}
```

- ต้องมี entry ของทุก saved Section รวมถึง Section ที่ไม่มีตัวแปร โดยส่ง `data:{}`.
  id หาย/ซ้ำ/ไม่รู้จักเป็น error ไม่เดา id จากชื่อ และไม่ข้าม Section เงียบ ๆ.
- entry รับเฉพาะ id/data/header/footer. Header/footer เป็นค่าตรงตาม band schema
  ไม่ซ้อน `.data`; เมื่อละจะใช้ `{}` แล้วตรวจ required/default ตาม schema.
  ถ้า Section ไม่มี band นั้น ห้ามส่ง header/footer แม้เป็น `{}`.
- ข้อมูลใน data/header/footer ต้องตรง schema; รุ่นใหม่นี้ปฏิเสธ unknown fields
  แทนการทิ้งค่าเงียบ ๆ. ตัวแปรชื่อเดียวกันใน Section คนละ id รับค่าต่างกันได้.
- root data มีไว้เฉพาะ globalSchema ที่ตั้งใจใช้ร่วมทั้งแม่แบบ. ห้ามอ่านค่า
  ข้าม Section อัตโนมัติหรือ fallback จาก label/array index.
- Request ไม่ส่ง node graph, label, origin, layout หรือคำสั่ง clone/import;
  ไม่เพิ่ม instance ขณะสร้าง PDF. แก้ลำดับจริงผ่านการบันทึก definition พร้อม revision.

### 0.3 Clone, import/ต่อ และแยกโครง

การนำ Section มาซ้ำในโครงเดิมหรือมาต่อในอีกโครงใช้ operation เดียว:
`POST /authoring/drafts/{targetTemplateId}/sections/import` (target endpoint
ยังไม่ implemented). Body ระบุ sourceTemplateId, sourceRevision,
sourceSectionIds เป็น array ไม่ซ้ำเรียงตามลำดับที่จะนำเข้า, expectedRevision ของ
ปลายทาง, beforeSectionId หรือ null=ต่อท้าย และ idempotencyKey.
Optional `globalFieldRenames` เป็น map จาก sourceSectionId → source global key →
ชื่อ field ใหม่ใน Section ใช้แก้กรณีชื่อชนตามกฎด้านล่างเท่านั้น.
sourceSectionIds ต้องไม่ว่างและทุก id ต้องอยู่ในต้นทาง; beforeSectionId ที่ไม่ใช่
null ต้องอยู่ในปลายทางปัจจุบัน. ปฏิเสธค่าไม่รู้จัก ไม่ fallback เป็น append.

- ตรวจ owner ของต้นทางและปลายทางก่อนอ่าน/คืนผล; รอบแรก owner ต้องเป็น principal
  เดียวกัน. ไม่มี cross-owner sharing โดยอาศัย JSON/UUID.
- อ่านต้นทางตาม sourceRevision และตรวจ target revision; ทั้งสองต้องตรงปัจจุบัน
  ใน transaction. ถ้า source=target sourceRevision ต้องเท่ากับ expectedRevision.
  ล็อก draft IDs ตามลำดับเดียวกันก่อนตรวจซ้ำ ป้องกัน stale/การ import สวนทาง.
- Clone/import จัดสรร public Section IDs ใหม่และ normalized IDs ใหม่; remap
  Area IDs, owned Format definition IDs, binding ownership และทุก reference
  ภายในชุดที่ copy. Clone แต่ละ instance มี styles/pageLayouts ที่อ้างใช้อยู่
  เป็นสำเนา identity ใหม่ แม้ bytes เท่ากัน เพื่อไม่ให้แก้ style ของสำเนาแล้วกระทบ
  ต้นทาง. ตั้ง explicit pageLayoutId จาก effective layout ของต้นทาง ไม่เปลี่ยน
  default layout ของปลายทาง. Format.key เช่น paragraph ซ้ำข้าม Area ได้.
- Anchor ใช้ตัวตน `(Section.id, localAnchor)`; ชื่อ intro ในสองสำเนาไม่ชนกัน.
  reference ภายใน Section ใช้ local target; cross-Section reference ต้องระบุ
  `targetSectionId` ชัดและ remap เมื่อ Section เป้าหมายอยู่ในชุด copy.
  หาก dependency อ้าง Section นอกชุดที่เลือก ให้ปฏิเสธทั้งหมดด้วย
  SECTION_DEPENDENCY_OUTSIDE_SELECTION ไม่ทิ้ง link หรือชี้กลับต้นทางเงียบ ๆ.
- global field ที่ส่วนที่นำเข้าใช้อยู่ ให้ copy schema/default เข้าสู่ inputSchema
  ของ Section ใหม่ และ rewrite scope global→section เฉพาะ references นั้น;
  ไม่รวมเข้ากับ global ของปลายทางเอง. ถ้าชน field เดิมใน Section ให้ปฏิเสธ
  IMPORT_BINDING_COLLISION จนมี globalFieldRenames ที่ valid/ไม่ชน. Rename map
  ต้องอ้าง key ที่ใช้อยู่จริง ห้ามทับ field/ตัด required data หรือแปลงชนิดค่า.
  root globals ใน whole-draft clone คงเป็น globals ของโครงใหม่ที่แยกอิสระได้.
- external font release/asset IDs ไม่ remap; คง exact selection และตรวจ retained
  rights จากต้นทางที่ Service ยืนยัน ไม่ให้สิทธิ์เพิ่มจาก payload. Image resource
  IDs ไม่แปลว่าได้อายุ/สิทธิ์อัปโหลดใหม่; ยังใช้กฎเดิม ไม่แก้ image ingestion ในรอบนี้.
- การ "แยกโครง" รอบแรกคือ copy Section ที่เลือกลง draft ปลายทางซึ่งสร้างไว้แล้ว;
  ไม่ลบต้นทาง. การย้ายแบบตัดต้นทางเป็นคนละคำสั่ง ไม่รวมใน import นี้.
  ปลายทางที่มี identity แต่ยังไม่มี definition (revision 0) รับ import ได้โดย
  beforeSectionId ต้องเป็น null; operation สร้าง envelope model 19 ครั้งแรกจาก
  identity/name/docKey ปลายทางและ schemaVersion ต้นทาง พร้อม registry เฉพาะที่
  Section ที่เลือกใช้. globalSchema เริ่มว่างเพราะ globals ที่ใช้อยู่ถูกย้ายเข้า
  Section ตามกฎข้างบน; default layout เป็น private layout ของ Section แรกที่นำเข้า.
  บันทึกเป็น revision 1 แบบ atomic ไม่สร้าง Section ตัวหลอกหรือคัดทั้งโครงต้นทาง.
- append/import เปลี่ยน revision ปลายทางครั้งเดียว; ต้นทางไม่เปลี่ยน
  (กรณี source=target มีเพียง target write ครั้งเดียว). ล้มเหลว rollback ทั้งหมด.
  retry key+body เดิมคืน receipt และ IDs เดิม ไม่สร้างสำเนาซ้ำ; body ต่าง key เดิม
  คืน IDEMPOTENCY_CONFLICT หลังตรวจสิทธิ์. source/target ต้องตรงทั้ง model และ
  font schemaVersion; ถ้าต่างต้องแปลงสำเนาให้เข้ากันก่อน ไม่แปลงต้นฉบับอัตโนมัติ.
  ตรวจ receipt หลังสิทธิ์และก่อน stale revision เพื่อให้ retry ของคำสั่งที่สำเร็จ
  แล้วไม่ติด revision ที่คำสั่งนั้นเพิ่งเปลี่ยนเอง; คำสั่งใหม่ยังตรวจ revision ครบ.

Whole-draft clone ใช้ route clone เดิม แต่ model 19 จัดสรร Section/owned IDs ใหม่
และคืน sectionIdMap; label จัด default ตาม nameBase ในโครงใหม่. ไม่สร้าง shared link.
การสร้าง Section ว่างในโครงที่บันทึกแล้วใช้ target `POST .../sections` พร้อม
expectedRevision, pageLayoutId ต้นแบบและ idempotencyKey; คืน Section id/label ใหม่
พร้อม private layout copy. source เป็น authored fragment ว่าง ไม่ใช่คำสั่งพิมพ์
blank page. Initial full-definition authoring อาจจัดสรร UUID ก่อน save ได้;
generation client ไม่จัดสรรหรือเพิ่ม Section. Full save ต้องรักษา origin ที่ server
ยืนยันของ instance เดิม และตรวจ identity/owner ไม่เชื่อ origin ที่ client เพิ่มเอง.

### 0.4 Area, ปก, การขึ้นหน้า และสารบัญ

Area คือ node ของพื้นที่และเป็นตัวแปร รับ array ของ `{format,data}` ตามลำดับ.
Format เป็น fragment ที่อยู่ใต้ ownerAreaId เดียว; รับ local schema และขยาย
เป็น nodes ภายใต้ Section เจ้าของ. ไม่ใช่ Section ใหม่ ไม่เปลี่ยน paper/margins/
bands/numbering. รอบนี้ไม่เพิ่ม recursive Area หรือ shared external Format library.

- ปก/ผู้อนุมัติ/ประวัติ/สารบัญ/บทนำเป็น Format ที่ใส่ผ่าน Area ได้ตามการออกแบบ
  ไม่ให้ engine ตีความชื่อเหล่านี้พิเศษ. Static nodes ยังใช้ได้ ไม่บังคับห่อทุก node.
- fixed-height block ผ่าน Area ใช้ได้เฉพาะ top-level flow block ของ Section
  ไม่อยู่ใน table cell/row repeat. เนื้อหาต้องพอดีกับความสูงที่กำหนดและ body space
  ของหน้าที่วาง; หากไม่พอดีคืน layout error ไม่มีการตัด/บีบ/ลด pt/ขยายกรอบเอง.
- หน้าปกภายใน Section ใช้ headerMode/footerMode=continuation เมื่อต้องซ่อน
  หน้าแรก; mode all/first/none ยังใช้ตามความหมายเดิม. การซ่อน band ไม่ได้เปลี่ยน
  การนับหน้า และไม่ได้เปลี่ยนตัว Section เป็น special role:cover.
- page-break ใน Area เปลี่ยนหน้าใน Section เดิม. Leading/repeated/trailing break
  ไม่เพิ่มหน้าว่างโดยไม่ได้ตั้งใจ; empty normal Section ไม่สร้างหน้าเอง.
  Section ใหม่ที่มีเนื้อหาเริ่มหน้าใหม่ รอบนี้ยังไม่มี continuous Section กลางหน้า.
- numbering ของ Section ใช้ continue/restart(startAt)/exclude กับ visibility.
  หน้าปกที่ซ่อน band ยังนับตาม policy นี้ ไม่มี implicit exclude หน้าแรก.
- TOC node ระบุ `props.scope:{kind:"section"}` หรือ `{kind:"document"}` ชัดเจน.
  section หมายถึง Section เจ้าของ node; document คือทั้งชุดที่บันทึก. อนุญาต
  หนึ่ง TOC ต่อขอบเขต: หนึ่งต่อ Section และหนึ่ง document-wide อยู่ร่วมกันได้.
  ไม่เกินหนึ่งในขอบเขตเดียวกันในรุ่นนี้; สารบัญภาพ/ตารางยังนอกขอบเขต.
- TOC เก็บ headings ของ scope นั้นเท่านั้น ใช้ numbering ของหน้าเป้าหมายจริง
  และ PDF destination ที่ระบุ Section ถูกต้อง. anchor ซ้ำใน Section เดียวเป็น error.
  scope ว่างให้สารบัญว่าง ไม่สร้างหน้าว่างจากมัน; pagination ต้อง converge ภายใน
  bound ที่ engine ประกาศ มิฉะนั้นคืน error ไม่ใช้เลขหน้าที่เดาหรือ loop ไม่สิ้นสุด.

### 0.5 Version และข้อมูลเดิม

สงวน **nodeModelVersion 19** สำหรับ target definition/semantics ชุดนี้;
18 คงสัญญาเก่า. schemaVersion 1/2 ของ font selection และ package versions เป็น
คนละแกน ไม่เพิ่มเลขให้เหมือนกันเพียงเพราะเป็นช่วง 0. ยังไม่สร้าง package/tag รุ่นใหม่.

- definition 19 ใช้ Section.id/label/nameBase/origin ตามด้านบน ไม่มี Section.key
  หรือ Section.formats; Area formats ใช้ registry ที่ผูก ownerAreaId.
- prepare/compose ของ 19 ใช้ request array และเก็บ prepared.sections เป็น array
  `{id,data,header?,footer?}` ใน definition order; ไม่มีการเก็บชื่อเป็น authority.
  PreparedInput.schemaVersion ของเส้นทางนี้เป็น 2; snapshot ต้องมี model/fingerprint
  ของ definition ที่แน่นอนเพื่อเลือก reader และปฏิเสธข้อมูลข้ามรุ่น.
- เส้นทาง 18 ยังคงอ่าน/save/open/preview ด้วย definition/request/prepared เดิม;
  ไม่เปลี่ยน object-map เป็น array ให้เองใน render. ก่อนเปิดรุ่นใหม่ต้องพิสูจน์
  regression ที่เกี่ยวข้องครบ จึงประกาศ support 18/19 ใน contract ได้.
- แปลง 18→19 เป็น explicit export/conversion ไป unpublished draft ใหม่เท่านั้น;
  คืน mapping old definition id/key → new Section id และ schema changes ทั้งหมด.
  แปลง request ตาม mapping ไม่เดาตาม label; คงจำนวนและลำดับ Section เดิมในขั้นแปลง.
  การรวมเจ็ดส่วน SRS เป็น Section เดียวเป็นงานปรับแม่แบบช่วง 4 ไม่ใช่ migration แอบทำ.
- ห้าม rewrite published snapshot, historical fingerprint/job หรือเปลี่ยน reader
  ของงานที่ตรึงไว้. Job ใหม่ตรึง definition 19 + input contract + font/resource
  bindings ของรอบนั้น. Existing clone ของ 18 ยังเป็น legacy path ไม่อ้างว่าตรง
  กติกา instance ใหม่จนผ่าน explicit conversion.

### 0.6 JSON รับ–ส่งและผลตรวจเอกสาร

ตัวอย่างทั้งหมดเป็น **target-contract fixtures** ใช้ UUID/font release สังเคราะห์
ไม่ใช่ payload ที่ส่งให้ runtime 0.4.0/0.4.1 ปัจจุบันได้. ไม่ได้สร้าง template จริง.

| ตัวอย่าง | จุดที่แสดง |
| --- | --- |
| [single-section.definition.json](../examples/section-area-contract-20261017/single-section.definition.json) | Section เดียวที่มี Area, ปก, สารบัญ และเนื้อหา |
| [single-section.preview-body.json](../examples/section-area-contract-20261017/single-section.preview-body.json) | expectedRevision + idempotencyKey + request array/data/header/footer |
| [two-section.definition.json](../examples/section-area-contract-20261017/two-section.definition.json) | SRS1/SRS2, IDs/layout/style/Area ต่างกัน แต่ Format.key/ชื่อตัวแปรซ้ำได้ |
| [two-section.preview-body.json](../examples/section-area-contract-20261017/two-section.preview-body.json) | Project A/B แยกกัน; จงใจส่ง SRS2 ก่อน SRS1 เพื่อยืนยันว่าพิมพ์ตาม definition |
| [operations.json](../examples/section-area-contract-20261017/operations.json) | target create/import/append/split-copy/whole-clone/preview requests และ responses; แต่ละ scenario เป็นอิสระ ไม่ใช่ลำดับคำสั่งให้ยิงจริง |
| [legacy-conversion.json](../examples/section-area-contract-20261017/legacy-conversion.json) | mapping explicit จาก old key/object request ไป new instance IDs/array |

Responses ใช้ envelope ok/value/warnings หรือ ok:false/issues/warnings ตามเดิม.
ตัวอย่าง response แสดงเฉพาะ fields ที่เกี่ยวกับสัญญานี้ ไม่ใช่ schema response
ครบทุก field; fingerprint/resource snapshot ที่เส้นทางเดิมต้องมีต้องคงไว้ด้วย.
Identity/revision/schema failures เป็น error ไม่คืน queued job; กรณี target errors
ที่ปิดชื่อไว้คือ SECTION_INPUT_SHAPE/MISSING/DUPLICATE/UNKNOWN และ
SECTION_DEPENDENCY_OUTSIDE_SELECTION/IMPORT_BINDING_COLLISION.
ID หายภายใน entry ใช้ SECTION_ID_REQUIRED; unknown entry field ใช้ INVALID_DATA;
รูปแบบ/reader ข้ามรุ่นใช้ VERSION_MISMATCH. เจ้าของไม่ตรงคืน not-found โดยไม่เปิด
รายละเอียดต้นทาง; stale ใช้ STALE_CURRENT และ retry conflict ใช้ IDEMPOTENCY_CONFLICT.

ช่วง 0 ตรวจ JSON syntax, schema/ID/reference relationships, ค่าอิสระของสองสำเนา,
ลำดับ/rename semantics, mapping ของ clone/split และ negative input classes เท่านั้น.
ผลตรวจเอกสารไม่ใช่ runtime acceptance. ช่วง 0 จัดทำครบเพื่อทบทวนก่อนช่วง 1;
ช่วง 1–5 ยังไม่เริ่มและต้องมีคำสั่งต่อจากเจ้าของก่อนเปลี่ยนผลิตภัณฑ์.

ผลตรวจช่วง 0: JSON 6 ไฟล์ผ่าน consistency checks 123 จุด (รวม 7 negative input
variants), links ครบ, `git diff --check` และ `npm run check:data` ผ่าน.
หลักฐาน/ตัวตรวจเฉพาะเอกสารเก็บที่
`C:/Users/nekot/Documents/Codex/2026-10-17/section-area-contract-stage0/`:
`check-examples.py` และ `example-check.json`. ตัวตรวจตรวจเฉพาะสัญญาและ references
ในตัวอย่าง ไม่ใช่ full Core schema validator, Service integration หรือ PDF test.
ไม่มีการแก้ product code, live templates, DB, package versions หรือ DOCUMENT_MAP.

## ผลช่วง 1 — Section identity และ API — 2026-10-17

**Authority Boundary:** ผล candidate ของช่วง1 ที่เจ้าของสั่งต่อจากช่วง0;
ไม่ใช่ release/installation หรือผลช่วง2–5. ส่วน “ยังไม่เริ่มช่วง1” ด้านบนบันทึก
สถานะ ณ จบช่วง0 เท่านั้น. Active role Product Implementation Agent ตามด้วย
Evidence Reviewer; owners Core/Service และ Project Control สำหรับ FlowDocMake.
Single-room inline; execution/Phase/Checklist IDs N/A; ใช้ checklist ช่วง1 ในเอกสารนี้.

ขอบเขต/แผนปฏิบัติ: Work Size large, Risk routine พร้อมความเสี่ยง ID reuse,
scope collision, migration และ retained-resource rights. แยก worktrees ที่
`C:/Users/nekot/.codex/worktrees/section-area-stage1/` จาก Core `6cd25ca`,
Service `ee11ae8` และ Project Control `7acbd88`. ใช้ inline implementation
ตามแผนเดิม ไม่เปิด execution เก่าหรือ WORK room. ใช้โมเดลที่ host ตั้งให้ห้องนี้
โดยไม่ override; availability อ้าง tool catalog ของ host รอบนี้. Proof budget:
Core identity/legacy tests + packed consumer, Service SQL/API/MCP/retained-font
tests และ review เฉพาะ diff. Document budget: อัปเดต record/คู่มือเดิมและสร้าง
snapshot ตาม generator; ไม่มีคู่มือเริ่มอ่านหรือ DOCUMENT_MAP ใหม่.

### พฤติกรรม candidate

- Core/Service `0.4.2-dev.1`, FlowDocMake `0.2.3-dev.1`; model19 ช่วง1 คู่กับ18.
  รับ array ตาม public Section IDs; ลำดับ definition เป็น authority; ชื่อซ้ำได้.
  prepared schema2 ตรึง model19/fingerprint;18ยังใช้ object input/schema1 เดิม.
- Create Section, import/append และ split-copy ผ่าน HTTP/MCP; whole19 clone คืน
  sectionIdMap ใหม่. Remap Section/Area/Format/style/layout และ references;
  แยกค่าระดับ section/header/footer/local และ promote เฉพาะ globals ที่นำเข้าใช้.
  Whole clone คง globals ของหนังสือใหม่. Origin มาจาก server; font/assets คง external IDs.
- ตรวจทั้งสอง owner/revisions, lock ตามลำดับเดียว, atomic rollback และ retry receipt.
  Migration021 เพิ่ม ledger กันใช้ public ID ที่ลบกลับมาใหม่ (`SECTION_ID_REUSED`),
  รองรับ model19 ใน ownership/job pin โดยคงเงื่อนไข immutable input และ pin18 เดิม.
  Full save ห้ามสลับ18↔19ทับ draft เดิม (`VERSION_MISMATCH`).
- Retired fonts สืบทอดได้เฉพาะ exact tuple จาก reference set ที่ตรวจแล้วของ
  ต้นทาง/ปลายทาง; ไม่เพิ่มสิทธิ์จาก JSON. Namespace ของ anchors แยกตาม Section ID.
- FlowDocMake ใช้สัญญาเดียวกับ Service ไม่แปลง array เป็นชื่อ/index; helper รับ
  schema1/2 กับ models18/19 และ preflight ตรวจ version/artifact/capabilities ตรงชุด.
  ประกาศ `sectionInstances.stage:1`, `coverArea:false`, `scopedToc:false` ชัดเจน.

### หลักฐานและขอบเขตผลตรวจ

- Core commit `aabbb69`: build + unit **617 PASS**, packed Linux/amd64 consumer
  PASS. Tarball SHA256 `2542b11c6b5350aeb2833f97ca5e8e28013ceedbd971da181d7587038377cc3a`.
  Service commit `4f834be` ตรึงแพ็กเกจนี้พร้อม full source commit ใน manifest.
- Service full Linux suite **307 PASS / 0 FAIL / 6 SKIP** (`--testTimeout=15000`);
  หลังเพิ่ม guard ห้าม downgrade model ทับเดิม ตรวจ affected suite ใหม่
  **20 PASS / 0 FAIL / 0 SKIP** รวม native API/processor, legacy authoring และ CLI.
  Full result ใช้ซ้ำเฉพาะส่วนที่ guard นี้ไม่กระทบ; ไม่อ้างว่า rerun ทั้งหมดหลัง guard.
  6 skipped เป็น external font/height delivery fixtures/config ไม่ใช่เกณฑ์ช่วง1.
- Regression tests ครอบคลุม request IDs/ลำดับ/ชื่อซ้ำ, clone/import/split,
  normalized identity ตอน rename/reorder, late-write rollback, retry/concurrency,
  forged origin, deleted-ID reuse, model boundaries, scope values และ retired-font inheritance.
- Native FlowDocMake stdio → isolated Docker HTTP → PostgreSQL → processor/PDF
  PASS: 23 tools, save/open/copy/retry/clone/split และ pinned preview.
  PDFสังเคราะห์2หน้า ตรวจข้อความได้ Alpha body/header/footer เฉพาะหน้า1 และ
  Beta body/header/footer เฉพาะหน้า2 แม้ request ส่งย้อนลำดับ. เป็น text/order proof
  ไม่ใช่ visual fidelity review หรือการรับงาน PDF ต้นฉบับ98/2หน้า.
- Fresh-context review พบ getter-before-JSON-check และ deleted-ID reuse;
  เพิ่ม failing regressions แล้วแก้ ตรวจ targeted review ยืนยันครบ.
  การตรวจจริงพบ SQL pin18 และ processor map assumptions เพิ่มเติม;
  แก้พร้อม regression ที่ queue/process model19 เป็น PDF จริง.
- เก็บ failed probes ไว้ด้วย: Service artifact รอบแรกขาด runtime resources;
  เปลี่ยนเป็น Docker-built artifact ที่ผ่าน packed consumer. แยก native API ไปอีก
  test database เพราะ processor advisory lock เป็นระดับ database. CLI default
  5s เคย timeout; targeted CLI ผ่าน และ full run ใช้ harness timeout15s โดยไม่แก้ CLI.

หลักฐานถาวร:
`C:/Users/nekot/Documents/Codex/2026-10-17/section-area-stage1/`:
`core-final-tests.log`, `core-packed-final.log`, `core-package/`,
`service-final-verification.json`, `service-affected-accepted.json`,
`native-result.json`, `native-pdf-text-check.json`, `flowdocmake-checks.log`.
FlowDocMake Node checks **22 PASS / 0 FAIL / 4 SKIP**; skipped ต้องใช้ config
เฉพาะรอบอื่น. Positive real stdio/HTTP proof ใช้ native-result แทน ไม่เรียก skipped ว่า PASS.

ไม่เปลี่ยนสอง live drafts, installed runtime/plugin, default branches, release/tags,
หรือ published history. ไม่ทำ Area cover/scoped TOC/ปรับแม่แบบ/ระบบภาพ หรือ
เครื่องมือ conversion18→19ในช่วงนี้. Candidate อยู่บน task branches เพื่อทบทวน;
ยังไม่ merge/push/deploy. ขั้นถัดไปตามแผนคือช่วง2เมื่อเจ้าของสั่ง.

### รวม branch หลักและปิด lane — 2026-10-17

เจ้าของสั่งรวมช่วง1เข้าตัวหลักและเคลียร์ก่อนข้อถัดไป. Role Lane Reconciliation
Reviewer / Project Control Steward; single-room inline, execution IDs N/A.
รวมแบบ fast-forward ตรงกับ candidate ที่ตรวจแล้ว ไม่มี conflict/แก้ product เพิ่ม:
Core `codex/template-binding` → `aabbb69`, Service `codex/template-registry` →
`4f834be`, Project Control `main` → `3b652ef` ก่อนเพิ่มบันทึกปิด lane นี้.
คงชื่อ branch หลักเดิมตามข้อตกลง ไม่ใช่การเปลี่ยนชื่อเป็น main ทั้งหมด.

ตรวจ HEAD/tree, clean status และ vendored Core SHA256 ตรงกับชุดเดิม;
ใช้ผล Core617, packed consumer, Service307/6skip + affected20 และ native MCP/PDF
ข้างบนซ้ำตามกฎ unchanged fast-forward. ไม่ถือ skipped ว่า PASS และไม่ rebuild
ตัวเชื่อมที่ติดตั้งเพียงเพื่อรวม source. บันทึก identity/reuse ใน
`C:/Users/nekot/Documents/Codex/2026-10-17/section-area-stage1/main-integration.json`.
เก็บ ignored Core artifacts จาก lane ไว้ที่ `preserved-core-artifacts/`
ใต้โฟลเดอร์หลักฐานเดียวกัน พร้อมตรวจ hash รายไฟล์ใน `preserved-core-artifacts.json`.
ตำแหน่ง worktree ใน logs เก่าเป็น provenance; ใช้สำเนาที่เก็บนี้หลัง cleanup.

ขอบเขต cleanup คือ worktrees และ local task branch `codex/section-area-stage1`
ของทั้งสาม repo หลังยืนยันว่า clean/merged/ไม่มีผู้ทำงานค้าง; เก็บ primary branches,
release/tags และหลักฐานไว้. Packaged FlowDocMake snapshot คง sourceCommit ที่ผ่าน
การตรวจของ candidate เดิม; บันทึกสถานะการรวมนี้ไม่เปลี่ยน package/runtime contract.
ยังไม่ push, tag, release, deploy, เปลี่ยน live drafts หรือเริ่มช่วง2.
ผล cleanup: ลบ worktrees/local task branches ของทั้งสาม repo ครบแล้ว;
Project Control lane เก็บ recoverable archived snapshot ผ่านเครื่องมือของแอป.
แต่ละ repo เหลือ primary checkout ที่สะอาด; Core/Service คง release branch เดิม.

## ผลช่วง 2 — Area cover ภายใน Section (2026-10-17)

ขอบเขตตามคำสั่งเจ้าของ: Core implementation / Service packaged consumer /
Project Control guidance และ FlowDocMake compatibility; single-room inline,
execution IDs N/A. Role Product Implementation Agent → Evidence Reviewer.
Markdown เป็น repo-owned code-adjacent guidance หรือ canonical Project Control
ตามตำแหน่งเดิม; ไม่สร้างเอกสาร startup ใหม่หรือเลื่อน DOCUMENT_MAP.
แยก lane `codex/section-area-stage2` ใต้
`C:/Users/nekot/.codex/worktrees/section-area-stage2/` จาก Core `aabbb69`,
Service `4f834be`, Project Control `7a54b13`.

Core `5947536` เปิด fixed-height text เฉพาะ model19 authored Section flow roots
และ Format ของ Area ที่วางเป็น root. ตรวจทั้ง authored graph และ resolved graph;
parent/ownership checks กัน cell/repeat หลุดเข้าทาง root. ไม่แก้ตัวจัดหน้าเพราะ
การวัดกรอบ/overflow/page breaks/bands เดิมรองรับสัญญาที่ปิดไว้แล้ว.
fixed frame ต้องพอดีข้อความและ body ที่เหลือ; ล้มเหลวโดยไม่ตัด/ย่อ/เลื่อนกรอบ.
Section ยังคุม pageLayout/header/footer; Area ซ้อนและ fixed ใน cell/repeat ยังห้าม.
model18 คงสิทธิ์ปกและพฤติกรรมเดิม. ไม่มี logic ผูกชื่อ cover/approval/Format.

Core/Service `0.4.2-dev.2`, FlowDocMake `0.2.3-dev.2`; development candidates
ยังไม่ติดตั้ง/ออก tag. Core artifact SHA256
`aa9a0923b174eccd86cac1571570f0dc2e1f8627e30fff844b020b14a9305da6`
ตรง vendor manifest และ plugin pin. Contract ประกาศ `stage:2`, `coverArea:true`,
`scopedToc:false`. คู่มือแก้ข้อยกเว้นสั้นในทางเข้าเดิมและ snapshot จาก canonical
sources ที่ commit แล้ว ไม่เพิ่มเอกสารที่ AI ต้องอ่านก่อนเริ่ม.

หลักฐาน `C:/Users/nekot/Documents/Codex/2026-10-17/section-area-stage2/`:

- Core628 tests ผ่าน และ Linux/amd64 packed consumer ผ่าน รวม baseline18.
  มี red ของ fixed Area ก่อนเปิด validation; tests ใหม่11 กรณีครอบคลุมกรอบ,
  overflow, exact boundary, Section bands ทุก mode, page breaks และข้อห้าม.
- `area-cover.pdf` 6 หน้า: Section เดียว แทรกปก/ผู้อนุมัติ/ประวัติ/บทนำ/เนื้อหา;
  text/table/image เป็น native nodes. ตรวจภาพครบหน้า1–6 และ text/geometry:
  42 บรรทัดตามลำดับครั้งเดียว, ไม่มีหน้าว่างแทรก, ปกไม่มีหัว–ท้าย,
  หน้าต่อมีหัว–ท้าย, ภาพหน้า4 และไม่มีเนื้อหาชนขอบ/หัว–ท้าย (`pdf-review.json`).
- Service309 tests ผ่าน/6 external checks ข้าม ไม่ถือว่า PASS. ตรวจบน DB แยก
  ที่ migrate001–021 แล้ว (`service-accepted.json`); preview19 ตรึง schema2,
  ส่ง overflow เป็น LAYOUT_FAILED และ PDF revision เดิมยังดาวน์โหลดได้.
  แก้ assertion รุ่น renderer เก่าเป็น dev.2; ใช้ timeout15s ให้ CLI invalid URL
  แทน5s ที่รอ DNS เกินเวลา. ไม่แก้ runtime เพื่อกลบ failure ของชุดตรวจ.
- FlowDocMake22 tests ผ่าน/4 optional configuration checks ข้าม; native stdio
  context ready:true จาก candidate API/DB แยกอีกฐาน ตรวจ actual Docker package
  checksum/versions/port และ23 tools (`native-context.json`). ไม่ใช่ live install.
- Fresh-context read-only review ไม่พบ Critical/Important/Minor; reviewer ตรวจ
  fixed roots/cell/repeat/ownership/model18 และรัน11 tests ใหม่ผ่านอิสระ.

PASS เฉพาะช่วง2ตามขอบเขตนี้. เก็บ task branches/worktrees ไว้ตรวจและรวมภายหลัง;
ไม่เปลี่ยน primary branches, release/tags, installed plugin/runtime, สอง live drafts
หรือ published history. ไม่ทำ scoped TOC ช่วง3/ปรับแม่แบบช่วง4/ระบบภาพใหม่.
ขั้นถัดไปคือรอเจ้าของสั่งรวมงานหรือเริ่มช่วง3; ไม่เริ่มต่ออัตโนมัติ.

### รวมช่วง 2 เข้าตัวหลักและปิด lane — 2026-10-17

เจ้าของสั่งรวมและ cleanup ก่อนช่วง3 โดยยังไม่ขึ้น release. Role Lane
Reconciliation Reviewer / Project Control Steward; small inline maintenance,
execution IDs N/A. รวมแบบ fast-forward ไม่มี conflict หรือ product changes เพิ่ม:
Core `codex/template-binding` → `5947536`, Service `codex/template-registry` →
`8b7c8d2`, Project Control `main` → `2bae2f7` ก่อน commit บันทึกปิดงานนี้.
คงชื่อ development branches เดิม; Core/Service `0.4.2-dev.2` และ FlowDocMake
`0.2.3-dev.2` เท่า candidate ที่รับแล้ว ไม่เพิ่มรุ่นจากการรวม source.

ตรวจ clean status, HEAD/tree เท่ากับ candidate, vendor checksum และ protected
release/tag/remote refs ไม่เปลี่ยน. ใช้ผล Core628/packed consumer, Service309
ผ่าน/6skip, FlowDocMake22ผ่าน/4skip และ PDF6หน้าที่ตรวจแล้วซ้ำตามกฎ unchanged
fast-forward; ไม่อ้าง skipped ว่า PASS และไม่สร้าง runtime ทดสอบใหม่เพื่อรวม source.
บันทึก identity/proof reuse/cleanup ใน
`C:/Users/nekot/Documents/Codex/2026-10-17/section-area-stage2/main-integration.json`.

ก่อน cleanup สำรอง ignored artifacts 241ไฟล์ไว้ที่ `preserved-artifacts/` ใต้
โฟลเดอร์หลักฐานเดียวกัน ตรวจ SHA256 ต้นทาง/สำเนารายไฟล์ครบ. Path worktree
ใน logs เก่าเป็น provenance; ใช้สำเนานี้หลังนำ worktree ออก.
ลบ worktrees และ local task branch `codex/section-area-stage2` ทั้งสาม repo
หลังยืนยัน clean/merged/ไม่มี active owner; Project Control ใช้ recoverable
archive ของแอป. เหลือ primary checkout ของแต่ละ repo; เก็บ development branches,
release และ tags เดิมไว้. ไม่ push/tag/release/deploy/แก้ live drafts หรือเริ่มช่วง3.
FlowDocMake snapshot คง canonical sourceCommit ของ candidate ที่ตรวจแล้ว;
บันทึกการรวมนี้ไม่เปลี่ยน guidance/runtime contract ของแพ็กเกจ.

## ผลช่วง 3 — สารบัญตามขอบเขตและเลขหน้า (2026-10-17)

คำสั่งเจ้าของคือทำช่วง3และตรวจ PDF ทุกหน้า; single-room inline, execution IDs
N/A. Role Product Implementation Agent → Evidence Reviewer. Owner Core สำหรับ
validation/collection/layout, Service สำหรับ packaged consumer/pinned preview,
Project Control สำหรับ guidance/FlowDocMake compatibility/ผลร่วม.
แยก lane `codex/section-area-stage3` จาก Core `5947536`, Service `8b7c8d2`,
Project Control `1666bc4`; ไม่เปิด registered execution หรือเริ่มช่วง4.

Core `c340c4f` เพิ่ม required props.scope kind section/document เฉพาะ19.
Section scope ใช้เจ้าของ node จาก membership/sourceMap ที่ตรวจแล้ว ไม่รับ ID
ที่ caller เลือก. เก็บ headings ตามขอบเขตและลำดับจริง; หนึ่ง TOC ต่อ Section
กับหนึ่ง document-wide อยู่ร่วมกันได้. ตรวจซ้ำหลังเลือก Format/ขยาย Area;
ไม่นับ TOC ข้ามคนละ Format มารวมกันก่อนเลือกใช้. Clone ไม่ต้อง rewrite
scope kind เพราะอ่านจาก Section เจ้าของใหม่; anchors ยัง namespace ตาม ID.
Scope ว่างไม่เพิ่มหน้า; ถ้าทั้งเอกสารไม่มีเนื้อหาจัดหน้า คืน layout error ไม่ออก
PDF ว่าง. Model18 ไม่รับ scope และคงสัญญา single/global TOC เดิม.

Pagination bound คือหนึ่ง layout pass: กันช่องเลขกว้างคงที่36pt จากนั้นเติมเลข
ด้วย numbering ของหน้าเป้าหมายจริงและ resolve PDF destinations โดยไม่ reflow.
เลขล้นช่องให้ error แทนการเดา/ย่อ/วน retry. continue/restart/exclude/visibility
คง semantics เดิม: hide ยังมีเลขใน TOC, exclude คงลิงก์ชื่อแต่ไม่แสดงเลข.
19จาก development candidate เก่าที่ใช้ TOC ไม่มี scope ต้องกำหนดชัดเจน;
ไม่ migrate/แก้เอกสารจริงอัตโนมัติ และไม่เปลี่ยน18เพื่อรับ contract ใหม่.

ชุด candidate: Core/Service `0.4.2-dev.3`, FlowDocMake `0.2.3-dev.3`.
Service ตรึง Core SHA256
`d6af816202a83817bb981325af791790accf07a8d9bdf49093eb8f93badd931e`;
plugin pin ตรงกัน. Contract ประกาศ `stage:3`, `coverArea:true`, `scopedToc:true`.
ไม่มี migration ใหม่; ยังใช้001–021. ปรับทางเข้าสั้นและบทที่เกี่ยวข้องเดิม
โดยไม่เพิ่ม startup document; Markdown ผ่าน authority gate และไม่เลื่อน map truth.

หลักฐาน `C:/Users/nekot/Documents/Codex/2026-10-17/section-area-stage3/`:

- Core637 tests และ Linux/amd64 packed consumer ผ่าน. มี red ก่อนแก้และ9tests
  ใหม่ ครอบคลุมสอง scopes+document, malformed/duplicate scopes, Area expansion,
  empty scope, reorder, multipage TOC, continue/restart/exclude และ hide.
- ชุด PDF ที่ส่งตรวจครบ20หน้า: short5, long9, clone5 และ legacy representative1.
  ตรวจภาพทุกหน้าและตรวจ168TOC rows/336title-and-number destinations จาก PDF
  จริง ทั้ง label/Section เป้าหมาย, พิกัดปลายทาง, เลขที่พิมพ์เทียบเลขหน้าเป้าหมาย,
  ลำดับ/ความครบของหัวข้อ และกรอบหน้า (`pdf-review.json`). ไม่ใช้เลขหน้าที่กรอกเอง.
- PDF ที่มีอยู่ใน packed regression ช่วง2จำนวน57ไฟล์ byte-identical กับรอบนี้
  รวมกรณี model18 TOC/page numbering; ไม่อ้างว่าเป็นการตรวจภาพใหม่ทั้ง57ไฟล์.
- Service311 tests ผ่าน/6external checks ข้าม ไม่ถือว่า PASS (`service-full.json`).
  MCP tool clone ผ่าน in-memory transport → Service HTTP injection → PostgreSQL
  และ packaged rendering (ไม่อ้างว่า clone กรณีนี้ผ่าน TCP/stdio);
  ตรวจ Section IDs ใหม่, reorder, ข้อมูลแก้เฉพาะสำเนา, scoped preview pin schema2,
  source revision/PDF เดิมไม่เปลี่ยน และปฏิเสธ scope ซ้ำหลังขยายข้อมูล.
- FlowDocMake22 tests ผ่าน/4optional configuration checks ข้าม; native stdio
  context ready:true กับ candidate API/DB แยกอีกฐาน actual Docker package/hash/
  port61736 และ23tools (`native-context.json`). ไม่ใช่สถานะของ plugin ที่ติดตั้ง.
- Fresh-context read-only review ไม่พบ Critical/Important; reviewer รัน9tests
  ใหม่และตรวจ Service vendor identity ผ่านอิสระ. ไม่ขยาย review ไปช่วง4/release.

PASS เฉพาะช่วง3. Candidate อยู่บน task branches/worktrees ที่สะอาดเพื่อรวมภายหลัง;
เก็บ PDF/JSON/request/ผลตรวจนอก worktree ไว้แล้ว. ไม่เปลี่ยน primary branches,
release/tags, installed runtime/plugin, สอง live drafts หรือ published history.
ไม่เริ่มปรับแม่แบบช่วง4 และไม่รวม/ติดตั้งต่ออัตโนมัติ. ขั้นถัดไปตามคำสั่งเจ้าของ.

### รวมช่วง 3 เข้าตัวหลักและปิด lane — 2026-10-17

เจ้าของสั่งรวมและ cleanup ก่อนช่วง4 โดยยังไม่ขึ้น release. Role Lane
Reconciliation Reviewer / Project Control Steward; small inline maintenance,
execution IDs N/A. รวมแบบ fast-forward ตรงกับ candidate ที่ตรวจแล้ว ไม่มี
conflict หรือ product changes เพิ่ม: Core `codex/template-binding` → `c340c4f`,
Service `codex/template-registry` → `08a7131`, Project Control `main` → `b679f0e`
ก่อน commit บันทึกปิดงานนี้. คงชื่อ development branches เดิมและเลขรุ่น
Core/Service `0.4.2-dev.3`, FlowDocMake `0.2.3-dev.3`.

ตรวจ clean status, HEAD/tree เท่ากับ candidate, vendor checksum และ protected
release/tag/remote refs ไม่เปลี่ยน. ใช้ผล Core637/packed consumer, Service311
ผ่าน/6skip, FlowDocMake22ผ่าน/4skip, PDF20หน้า/168แถว/336destinations และ
legacy PDF57ไฟล์ที่ hash ตรงเดิมซ้ำตามกฎ unchanged fast-forward.
Skipped ยังไม่ใช่ PASS. บันทึก identity/proof reuse/cleanup ใน
`C:/Users/nekot/Documents/Codex/2026-10-17/section-area-stage3/main-integration.json`.

สำรอง ignored artifacts 130ไฟล์ไว้ที่ `preserved-artifacts/` ใต้โฟลเดอร์หลักฐาน
เดียวกัน พร้อมตรวจ SHA256 ต้นทาง/สำเนารายไฟล์ก่อนนำ worktree ออก.
Path worktree ใน logs เก่าเป็น provenance; ใช้สำเนานี้หลัง cleanup.
ลบ worktrees และ local task branch `codex/section-area-stage3` ทั้งสาม repo
หลังยืนยัน clean/merged/ไม่มี active owner; Project Control ใช้ recoverable
archive ของแอป. เหลือ primary checkout ของแต่ละ repo; เก็บ development branches,
release และ tags เดิมไว้. ไม่ push/tag/release/deploy/แก้ live drafts หรือเริ่มช่วง4.
FlowDocMake snapshot คง canonical sourceCommit ของ candidate ที่ตรวจแล้ว;
บันทึกการรวมนี้ไม่เปลี่ยน guidance/runtime contract ของแพ็กเกจ.

## ผลช่วง 4 — แม่แบบใหม่ในชุดทดสอบแยก (2026-10-17)

**Authority Boundary:** Owner ผู้จัดทำแม่แบบผ่าน FlowDocMake; role Product
Implementation Agent → Evidence Reviewer / Project Control Steward. Single-room
inline, execution IDs N/A. เจ้าของอนุมัติชุดทดสอบแยกหลังพบว่า native chat ยังเป็น
FlowDocMake0.2.1/Core–Service0.4.0 model18. รอบนี้ใช้ fresh MCP file client ของ
candidate0.2.3-dev.3/Core–Service0.4.2-dev.3 ที่ผ่าน `ready:true`, live contract
และ tool schemas; ไม่เปลี่ยน engine, installed plugin หรือ published history.

หลักฐานและไฟล์ส่งตรวจอยู่ที่
`C:/Users/nekot/Documents/Codex/2026-10-17/section-area-stage4/`;
`delivery/manifest.json` เชื่อม definition/request/assets, PDF/hash, IDs, การสำรอง
และขอบเขต. บันทึกนี้เป็นผลตรวจแม่แบบ ไม่เลื่อน DOCUMENT_MAP หรือรับรอง release.

- SRS draft ใหม่ `1fa6edd4-cdb0-4c49-be8a-69842b970959`, revision4,
  docKey `section19-srs-stage4`, PDF98หน้า SHA256
  `9f5f24d8a64574f5ee564ebfc9bcabdc131fe692480043c83d476cb254637133`.
  ใช้สอง Section เพราะปกมีระยะขอบ194.488/62.362/51.024/20pt ต่างจากหน้าวิ่ง
  12/28.35/28.35/22pt จริง. การทดลอง Section เดียวติด line/nested-table ใน cell
  ที่ไม่รองรับ; ไม่เพิ่ม engine หรือแต่ง Area paper override. ปกอยู่ใน Area ของ
  Section แรก อีกหกส่วนเป็น Areas ใน Section เนื้อหาเดียว; TOC scope=section.
- ศบ.1 draft ใหม่ `12588ad1-73f5-42ab-b722-4e7000f85f95`, revision1,
  docKey `section19-sb1-stage4`, PDF2หน้า SHA256
  `f4b44d7fd9c5ca9e54ac2834434f70575c886d9faf5c5b3d243ef5bfa1a8166e`.
  ใช้ Section เดียว: declaration/cargo Areas, explicit break และ footer เฉพาะ
  continuation. Sarabun300 release เดิมถูกตรึง; ภาพทั้งสองหน้าตรง baseline ทุก
  พิกเซลที่96DPI และข้อความแต่ละหน้าตรงเดิม. ไม่อ้าง pixel identity ที่ความละเอียดอื่น.
- ข้อมูล component/global ย้ายโดยตรวจย้อนกลับเท่ากันทุกค่า รวมค่าว่าง; request
  เป็น sections array จับด้วย UUID. แก้ alignment หัวตาราง/เลข REQ/ค่าบางช่อง/
  ข้อมูลประชุมจาก center เป็น left ตาม source โดยไม่เปลี่ยนค่า ฟอนต์ หรือขนาด.
  Draft mutations/uploads/preview/save PDF ทั้งหมดผ่าน MCP จริงเท่านั้น.
- ตรวจภาพ source/output ครบ98+2หน้า พร้อมตัวแทนและหน้าที่ต่างแบบเต็มหน้า;
  `pdf-verification.json` ตรวจ bounds, bands/เลขหน้า และ198TOC rows/396title-and-number
  destinations รวมพิกัด/ข้อความเป้าหมาย. SRS ข้อความ normalized ตรง baseline ทุกหน้า,
  ตรง source96/98หน้า; REQ361รหัสตรงทั้งสามชุด. เมื่อแยก known footer และหัว
  Features List ที่ซ้ำ ข้อความ normalized ทั้งเล่มเรียงตรง source. ศบ.1 ตรวจ54ค่า
  จาก source พร้อมค่าว่างเดิม. Readiness แบบ actual_input ของสอง draft เป็น ready.

**ผลแยกขอบเขต:** โครง/การย้ายข้อมูล/การสร้างและตรวจ PDF มีหลักฐานครบข้างต้น;
การรับว่าตรง source ทุกส่วนยังไม่ผ่าน. ไม่เช็กข้อสุดท้ายของช่วง4หรือเริ่มช่วง5:

- SRS ไม่สร้างหัว Features List ที่ค้างซ้ำท้ายหน้า36/42 จำนวนสอง occurrence;
  ข้อมูลธุรกิจไม่ถูกตัด แต่ strict static-text fidelity ยังต่าง. มี IMAGE_LOW_RESOLUTION
  จากภาพต้นฉบับ4จุดและยังไม่รับรอง native image/drawing ว่าเหมือนทุกพิกเซล.
- ศบ.1 คงความต่างเดิม: คลังชุดนี้ใช้ Sarabun300 แทน THSarabunNew; จุดแทนเส้นประ
  และเส้นใต้ค่าที่กรอก, grid0.5pt แทน0.70866pt และระยะบางจุด. ฟอนต์เป็นการเลือก
  ในแม่แบบ/คลังปัจจุบัน; dash/grid style เป็น capability gap ที่ตรวจได้; ระยะที่เหลือ
  ยังเป็นงานปรับแม่แบบ ไม่เหมารวมว่าเป็นข้อจำกัด renderer.
- `coverage-delivery.json` และผล `manage_document_task review` ของทั้งสองชุดคง
  `complete:false` พร้อม failing criteria; ไม่ยอมรับความต่างแทนเจ้าของและไม่แต่ง PASS.

สำรอง live DB/staging/output แบบอ่านก่อนเริ่มไว้ `backup/` และสำรองชุด candidate
หลังตรวจไว้ `backup-after/` พร้อม SHA256. เก็บ containers `flowdoc-section4-db`
กับ `flowdoc-section4-api` บน127.0.0.1:3024/volumes แยก; host-service detached
worktree ยังจำเป็นต่อ fresh MCP config จึงคงไว้ ไม่ใช่ lane งานค้างที่ลบทิ้งได้.
สอง live originals ยัง revision1/revision3 และ fingerprint เดิมจาก native read หลังทำ.
ไม่เปลี่ยน release/tags, ไม่ push/publish/install และไม่เริ่มช่วง5. Exact preview request
อ้าง owned upload ที่หมดอายุได้; สำหรับ preview ใหม่ใช้ portable request และ original
assets ผ่าน upload tools ตาม manifest ไม่ใช้ resource IDs เก่าโดยไม่มี upload ใหม่.

### ปิดช่วง 4 ตามขอบเขตที่เจ้าของรับ — 2026-10-17

เจ้าของเลือก **“ปิดงานปรับโครง พร้อมบันทึกความต่างเดิมไว้”** จากผลส่งตรวจเดิม
98+2หน้า. สถานะช่วง4คือ **accepted with documented limitations** เฉพาะโครง/
ข้อมูล/แม่แบบใหม่และชุดส่งมอบ; ไม่ใช่การรับว่าเหมือน source ทุกส่วน. เจ้าของยืนยัน
SRS ปกหน้า1/เนื้อหาหน้า2–98 แยกได้ตามความจำเป็น และให้ใช้ Section เท่าที่จำเป็นจริง.

ตรวจปิดงาน: fresh candidate MCP ยัง ready:true; draft SRS revision4/ศบ.1 revision1
และ fingerprint ตรงชุดที่ตรวจ, PDF/backup SHA256 ตรง manifest, definition กับ
request sections array จับ IDs ครบ และ original assets อยู่ครบ. Live originals
ยัง revision1/revision3 พร้อม fingerprint เดิมจาก native MCP read รอบปิดงาน.
ใช้หลักฐานตรวจภาพ100หน้า/198TOC rows/396destinations ที่ผูกกับไฟล์เดิมซ้ำ;
ไม่มี template/request/font/runtime เปลี่ยน จึงไม่สร้างหรือเรนเดอร์ PDF ซ้ำ.

คงรายการความต่าง SRS/ศบ.1 และ strict coverage/task `complete:false` ตามผลจริง;
การปิด workflow ไม่เปลี่ยน checker ให้ PASS. `delivery/manifest.json` กับ review
เดิมแนบ owner acceptance แยกจาก source-fidelity result. ชุดทดสอบและข้อมูลสำรอง
ยังเก็บไว้; ไม่ release/push/install และยังไม่เริ่มช่วง5.

**พักหลังจบกระบวนเดิมตามคำสั่งเจ้าของ:** Area คุมพื้นที่และค่าเริ่มต้น auto,
Format กำหนดจุดแบ่งและส่วนที่ต้องอยู่ด้วยกัน; จัดการ overflow โดยไม่ทิ้งข้อมูล.
ยังไม่ปิดสัญญารายละเอียดหรือพัฒนาในช่วง4/5อัตโนมัติ. ศบ.1 รุ่นนี้ตรวจผ่านเฉพาะ
ข้อมูลตัวอย่างเดิมสองหน้า; ข้อมูลคำสำแดงที่ยาวกว่านั้นยังไหลต่อได้ และ footer mode
continuation อาจแสดงลายเซ็นผู้รับของก่อนถึง cargo. ไม่รับรองว่าเป็นแบบฟอร์มจำกัด
พื้นที่หรือรองรับข้อมูลยาวทั่วไป; ต้องนำกรณีนี้เข้าทดสอบเมื่อเริ่มงานที่พักไว้.

## ผลช่วง 5 — ตรวจร่วมและชุดส่งมอบ candidate (2026-10-17)

**Authority Boundary:** Project Control owns this bounded cross-repository result;
role Evidence Reviewer / Project Control Steward. เจ้าของอนุมัติช่วง5ในห้องเดิม;
single-room inline, execution IDs N/A. ตรวจ candidate กับ draft ทดสอบใหม่เท่านั้น
ไม่เปลี่ยน product source, ไม่เลื่อน DOCUMENT_MAP และไม่รับรอง release/install.
Phase/Checklist/Evidence target คือรายการช่วง5ด้านบนกับหลักฐานจริงด้านล่าง;
ไม่สร้าง registered execution หรือ Work record เพิ่มเพื่อปิดงาน.

หลักฐานอยู่ `C:/Users/nekot/Documents/Codex/2026-10-17/section-area-stage5/`;
`delivery/manifest.json` รวม identity, definition, request, assets, PDFs และ coverage;
`delivery/checksums.json` ตรวจไฟล์ส่งมอบรายไฟล์. ใช้ fresh real MCP stdio client
ของ candidate → TCP Service3025 → packed Core ใน Docker image
`sha256:7cdfa5abc9c55109a043098d9bf6a26022c8702df20cebc908d58f6793c5621b`.
ไม่อ้างว่า native chat plugin0.2.1/Core–Service0.4.0 ถูกอัปเกรดแล้ว.

ชุดตรวจ PDF ใหม่ทั้งสามชุดสร้างผ่าน MCP, สำเร็จและบันทึกไฟล์ก่อนตรวจ:

| ชุด | draft / rendered revision | หน้า | SHA256 |
| --- | --- | ---: | --- |
| SRS สองสำเนา | `cfe69add-4c13-48bb-a95f-29119043c38c` / 2 | 196 | `70c002625446dd042db881d89579cc7b760b44ef7694f9e343c6d016ef8116c3` |
| ศบ.1 สองสำเนา | `2063390c-e24e-4e91-be2a-bbcd58578ca6` / 2 | 4 | `2396b1ce755ec1019d5531e233d9d75d86cdf035e946e296220397971756f778` |
| SRS + ศบ.1 | `8c74ba13-9518-4f52-932b-99378981f56a` / 2 | 100 | `e946aaf29b805e56c02e269315230253f842c24b46586c4cc7b2239903ccadaf` |

- ตรวจภาพครบ300หน้าใน numbered contact sheets ที่96DPI พร้อม machine checks
  ทุกหน้า: ลำดับข้อความเทียบ Stage4 baseline, ข้อมูลสำเนา, bounds, bands และเลขหน้า.
  ไม่พบหน้าว่างผิดคาด ข้อมูลหาย หรือหัว–ท้ายรั่วในชุดตรวจนี้. `*.verification.json`
  ระบุ reviewed pages ครบ; ภาพยังอยู่ `*-review/` ไม่อ้าง pixel identity กับ source.
- SRS A01/A.0 กับ B02/B.0 และ ศบ.1 ALPHA/11111 กับ BETAA/22222 แยกกันจริง.
  ตรวจ Section IDs/labels, used style references, pageLayouts และ Areas ไม่ชน;
  import retry ทั้งสามชุดคืนผลเดิมไม่เพิ่ม revision. Request sections ถูกกลับลำดับ
  โดยเจตนา แต่ PDF ใช้ลำดับ Section ที่บันทึกไว้ ไม่ใช่ลำดับ request.
- สารบัญ594แถว ตรวจ title-and-number destinations1,188จุดจาก PDF จริง รวมเลข
  หน้าที่แสดง พิกัดและข้อความปลายทาง และไม่ชี้ข้ามสำเนา. SRS twin เปลี่ยนผ่าน
  หน้า98→ปก99→เนื้อหา100ได้; mixed มี SRS1–98 แล้ว ศบ.1หน้า99–100ไม่มี SRS bands.
  ศบ.1 twin ไม่มีลายเซ็น footer หน้า1/3 และมีเฉพาะ cargo หน้า2/4 ตามข้อมูลที่ตรวจ.
- พบ prerequisite ที่มีอยู่แล้ว: import ต้องตรงทั้ง model และ font schemaVersion.
  SRS schema1 กับ ศบ.1 schema2 จึงต่อโดยตรงไม่ได้. แปลง SRS เฉพาะ draft สำเนาใหม่
  `15c87efc-6f54-41d9-9946-111a144cacde` เป็น schema2 ก่อนต่อ โดย SHA256 ของไฟล์
  Sarabunทั้ง4facesตรง bundled Core ทุกตัว และคง pt/line height เดิม. ไม่เพิ่ม fallback
  หรือเปลี่ยนต้นฉบับ. `font-byte-identity.json` กับ conversion record แสดงหลักฐาน.
- Actual-input readiness ผ่านทั้งสามชุด, model18 SRS/ศบ.1 เดิมยัง ready;
  real MCP clone/import ที่ไม่มีสิทธิ์ถูกปฏิเสธ UNAUTHORIZED ทั้งสองคำสั่ง.
  ใช้ official admin tool เปลี่ยน default และ retire Sarabun เฉพาะฐานทดสอบ3025.
  Clone/import ศบ.1หลัง retired และ readiness รุ่นเดิมผ่านโดยคง allowed tuple เดิม.
  Job font snapshots ก่อน/หลังตรงกัน. แก้ metadata mixed เป็น revision3หลัง queue2;
  PDF ยังตรึง revision2 และส่ง expectedRevision2 ใหม่ถูกปฏิเสธ STALE_CURRENT.
- สำรอง database/staging/outputs ก่อนเริ่ม และสำรองหลังตรวจเพื่อ restore ในฐานแยก
  บน3035. ตรวจ SHA256 สำรองทั้ง6ไฟล์; fresh MCP หลัง restore อ่าน draft/readiness
  และดาวน์โหลด PDF ทั้งสามได้ byte-identical. `restore-verification.json` เป็นหลักฐาน;
  ไม่ใช่การรับรอง backup สำหรับ production migration. คลัง retired เป็น test state.
- อ่าน Stage4 sources สดผ่าน MCP3024หลังทำ: SRS revision4/ศบ.1 revision1 และ
  fingerprintsเดิม. Native chat read ยืนยัน live originals revision1/revision3
  และ fingerprintsเดิม (`live-originals-final.json`). ไม่แก้ published history.

**Coverage และ proof reuse:** Source Core `c340c4f`, Service `08a7131` ยัง clean
และตรงกับผลช่วง3ที่รวมแล้ว; artifact SHA256
`d6af816202a83817bb981325af791790accf07a8d9bdf49093eb8f93badd931e` ตรงเดิม.
ใช้ซ้ำ Core637/packed Linux consumer, Service311ผ่าน/6external skip,
FlowDocMake22ผ่าน/4optional skip ตาม unchanged source/package identity;
รวม reorder, Area insertion/overflow, empty scope และ model18 regression ของช่วงก่อน.
รอบนี้เพิ่ม actual MCP/PDF/restore proof ตามรายการข้างบน ไม่รัน full suite ซ้ำ.
Skipped ไม่ใช่ PASS; actual saved-definition reorder เป็นผลเดิม ไม่อ้างทดสอบใหม่.

**ผล:** PASS เฉพาะ acceptance ช่วง5และข้อมูลชุดนี้ พร้อมความต่าง Stage4ที่เจ้าของรับไว้.
Strict source fidelity ยังไม่ผ่าน: SRSหัว Features Listท้ายหน้า36/42, original low-res
image warnings; ศบ.1ฟอนต์/จุดแทนเส้นประ/grid/ระยะยังต่าง. ไม่เปลี่ยน strict checker
หรือ `complete:false` ของ source-fidelity task เดิมเป็น PASS. ศบ.1ข้อมูลยาวและ footer
continuation ก่อน cargo ยังคงเป็นงาน Area/Format ที่พักไว้ ไม่รวมในชุดตรวจนี้.

ทบทวนทางเข้า/คู่มือและ compatibility เดิมแล้ว: runtime/API ไม่เปลี่ยน จึงคง
Core/Service0.4.2-dev.3 และ FlowDocMake0.2.3-dev.3 ไม่ bump/repack โดยไม่มีการเปลี่ยน.
เพิ่มคำชี้แจง schema prerequisite ในสัญญาเดิมนี้เท่านั้น ไม่เพิ่ม mandatory AI reading.
Portable requests พร้อม original assets ใช้ upload ใหม่ก่อน preview; exact requests
เก็บไว้เป็น provenance เพราะ image IDs หมดอายุได้. Mixed current revision3ต่างจาก
rendered revision2เฉพาะ metadata ที่ใช้ตรวจ pinning. ชุดส่งมอบไม่รวม credentials/config.

ยังเก็บชุดทดสอบ3025/3035และ backupเพื่อ review; host-service worktreeของช่วง4ยังจำเป็น
ต่อ fresh MCP. ไม่มี lane ใหม่ให้รวม/ลบในช่วง5. ไม่ merge product branches, release,
tag, push, publish หรือ install. หยุดที่ชุดส่งมอบให้เจ้าของตรวจตามขอบเขตที่อนุมัติ.

### ยืนยันตัวหลักและ cleanup หลังช่วง 5 — 2026-10-17

เจ้าของสั่งรวมตัวหลักและเคลียร์ส่วนที่ไม่ใช้ก่อนกลับมาคุย Area/Format โดยไม่ขึ้น release.
Role Lane Reconciliation Reviewer / Project Control Steward; bounded inline maintenance,
execution IDs N/A. ตรวจสดแล้ว product changes รวมอยู่บนตัวหลักครบก่อนคำสั่งนี้:
Core `codex/template-binding` ที่ `c340c4f`, Service `codex/template-registry`
ที่ `08a7131`; ผลช่วง4/5อยู่บน Project Control `main` ที่ `bbf418d` ก่อนบันทึกนี้.
ไม่มี task branch หรือ commit รอ merge จึงไม่สร้าง merge commit ซ้ำ.

ทั้งสาม primary checkouts สะอาด; Core/Service package identity และ vendored artifact
ตรงชุดที่ตรวจแล้ว. ตรวจ checksum ชุดส่งมอบ107ไฟล์ตรงทั้งหมดและใช้ผลช่วง5เดิมซ้ำ;
ไม่เปลี่ยน template/request/runtime/dependencies หรือรัน PDF300หน้าซ้ำ.
หลักฐาน `section-area-stage5/main-integration-before.json` บันทึก refs/branches/
worktrees และ identity; `main-integration.json` เก็บผลหลังปิดงาน.

ไม่มี local task branch หรือ worktree ที่หมดหน้าที่เหลือให้ลบในสาม repo นี้.
คง development branches เดิม, release และ tags. Detached worktree
`section-area-stage4/host-service` ยัง clean และอยู่ที่ Service commit เดียวกับตัวหลัก;
config ของช่วง4/5และ restore ทั้งสามไฟล์ยังอ้าง compiled Service/SDK ที่นี่ จึงยังใช้งาน
และต้องเก็บไว้. Archived managed worktrees ไม่ใช่ active lanes ที่ต้องคืนมาลบซ้ำ.
ไม่ลบหลักฐาน/backup/ชุดทดสอบ และไม่ sweep งานอื่นนอกขอบเขต.

รอบนี้เปลี่ยนเพียงบันทึกสถานะเดิมใน Project Control; คง Core/Service0.4.2-dev.3
และ FlowDocMake0.2.3-dev.3. ไม่เปลี่ยน release/tag/remote refs, ไม่ push/install.
พร้อมกลับมานิยามงาน Area/Format ที่พักไว้เป็นขอบเขตถัดไป; ยังไม่เริ่มพัฒนาอัตโนมัติ.

## Format auto/fixed — นิยาม กติกา และแผนพัฒนา (2026-10-17)

**Authority Boundary:** Project Control owns this shared design/plan. Core owns
Format validation, expansion/layout and rendering diagnostics; Service owns saved
contracts, pinned jobs and transport; Project Control owns FlowDocMake guidance.
Current design is the owner's maximum-height correction (v2) below; candidate
0.4.3-dev.1 / FlowDocMake0.2.4-dev.1 still implements the earlier v1 gate.
Role Planning Partner / Cross-Repo Boundary Reviewer / Documentation Synthesizer;
single-room inline, execution/Phase/Checklist registry IDs N/A. Current authority
for the original planning revision was documentation only. The later owner
authorization covers Core source stage1 as recorded below, without live drafts,
DB writes, merge, release, tags, push or installation. Completed Section–Area
stages0–5 keep their original results.

### การเปลี่ยนข้อตกลงและสถานะ

เจ้าของยืนยันให้ `auto/fixed` อยู่ที่ **Format definition**; Area ยังคงรับรายการ
`{format,data}` ตามเดิม. ข้อเสนอ Area sizing ใน commits `46d3950`/`245940f`
และร่าง placement correction ที่ยังไม่ commit ถูก **superseded** โดยคำสั่งรอบนี้.
ไม่ลบหรือเขียนประวัติให้เหมือนข้อเสนอเก่าไม่เคยเกิดขึ้น; เก็บร่างก่อนแก้พร้อม hash
ไว้ที่ `C:/Users/nekot/Documents/Codex/2026-10-17/format-sizing-plan-revision/`.
Location นี้เป็น revision evidence เท่านั้น ไม่ใช่คู่มือเริ่มงานอีกไฟล์.

Previous Area-stage0 checkmarks do not prove Format sizing. ข้อตกลงพฤติกรรมด้านล่าง
ได้รับความเห็นชอบในแชตแล้ว; exact JSON/capability/diagnostics ปิดในสัญญาช่วง0
ท้ายส่วนนี้. แผนช่วง0–5และผลเดิมที่เก็บไว้เป็นประวัติของv1; งานแก้v2ยังไม่พัฒนา.
Read this section for the new sizing scope; do not implement the superseded
Area sizing property, Area stop scope or Area-prefixed omission diagnostics.

**Goal:** ให้แต่ละรายการที่เรียก Format เลือกพฤติกรรมตาม definition: auto ไหล
ตามเนื้อหา หรือ fixed จำกัดความสูงสูงสุดของรายการนั้นด้วยพื้นที่หน้าเหลือ
แล้วแสดงส่วนที่วางได้ พร้อมรายงานส่วนที่ไม่แสดง.
**Architecture:** รักษาขอบเขต Format instance หลัง expansion ให้ layout รับรู้;
reuse ตัววัดข้อความ/ภาพและ table fragmentation เดิม. Area ไม่จองกรอบเพิ่ม.
**Tech Stack:** Existing TypeScript Core, packed Core consumer in Service,
PostgreSQL draft/job persistence and FlowDocMake MCP; no new runtime dependency.
**Spec:** Agreed behavior below plus the closed Stage0 contract in this section.
Future execution uses the applicable executing-plans workflow after authorization;
this documentation does not dispatch subagents, new tasks or separate rooms.

### ฐานก่อนพัฒนา v1 (ประวัติ; ดูช่องว่าง v2 ในแผนแก้ด้านท้าย)

Read-only source baseline: Core `c340c4f`, Service `08a7131`, candidate
Core/Service0.4.2-dev.3 and FlowDocMake0.2.3-dev.3. No product tests were rerun
to create this plan; source inspection is not proof that Format sizing works.

| เรื่อง | ปัจจุบันทำได้แล้ว | งานใหม่ที่ต้องเพิ่ม |
| --- | --- | --- |
| Format definition | key/ownerAreaId, local inputSchema, fragment nodes/rootIds | sizing ของ Format ทั้งชุด |
| การเรียกซ้ำ | Area รับหลาย `{format,data}`; แต่ละรายการมีข้อมูลและ IDs แยก | กรอบและสถานะจบ/หยุดแยกต่อ instance |
| ข้อมูลซ้ำภายใน | repeats/cellRepeats/rowGroups และ binding scopes | ใช้ของเดิม ไม่สร้างระบบซ้ำใหม่ |
| การจัดหน้า | ข้อความ/ตาราง/ภาพไหลใน Section; sourceMap ตามกลับได้ | ส่งขอบเขต Format instance ผ่าน expansion ถึง layout |
| พื้นที่คงที่ | text-block บางตำแหน่งกำหนด fixed height; ภาพกำหนดกรอบ | fixed budget รวมของ Format; ไม่ใช่แค่ fixed text |
| ตาราง | วัด padding/แถว, allowBreak, keepStart, repeatHeaderRows และปิด fragment | reuse และตรวจเมื่อชนขอบ Format แทนขอบหน้า |
| ผลลัพธ์ | Result/Issue warnings และ job pinning | omission ของ instance เดียวผ่าน Core/Service/MCP |

Current code pointers: Core `src/template/types.ts`, `src/data/prepareAreas.ts`,
`src/binding/expandAreas.ts`, `src/binding/expandRows.ts`,
`src/composition/resolvedDocument.ts`, `src/layout/documentFlow.ts`,
`src/layout/fixedTextBlock.ts`, `src/layout/cellTableFlow.ts`.
Format ปัจจุบันไม่มี width/height/sizing หรือ keep-together ทั้ง Format;
ตอนนี้ validate/bind/expand ข้อมูลก่อนจัดหน้า ไม่ใช่ lazy rendering ที่หยุดอ่าน
input เมื่อเต็ม. การทำ fixed ไม่ได้ยกเลิกการตรวจข้อมูล/สิทธิ์/ฟอนต์ที่มีอยู่.

### นิยามและกติกาที่ตกลง

- **Area:** รับและเรียง ordered array `{format,data}`; ไม่กำหนด auto/fixed,
  ไม่จองกรอบรวมและไม่เปลี่ยน request เป็น object-valued Area.
- **Format definition:** โครงเอกสารย่อยที่มีความหมายครบ เช่นการประชุมหนึ่งครั้ง;
  มีหลายข้อความ ตาราง ภาพและรายการซ้ำได้. Sizing เป็นคุณสมบัติของ definition.
- **Format instance:** การเลือกใช้ Format หนึ่งรายการใน array. ทุกครั้งใช้ข้อมูล
  และกรอบของตนเอง; เรียก meeting สามครั้งไม่ใช่สามรายการที่แบ่งกรอบเดียวกัน.
- คง ownerAreaId, local schema และ binding scope เดิม; registry ยังชื่อ areaFormats
  ได้เพราะหมายถึง ownership ไม่ใช่ตำแหน่งของ sizing. ไม่สร้าง shared Format library.

| กรณี | auto | fixed |
| --- | --- | --- |
| พื้นที่ | ใช้ตามเนื้อหาและไหลต่อได้ | effectiveHeight=min(ความสูงสูงสุดใน definition, พื้นที่หน้าเหลือ) |
| บรรทัดถัดไปไม่พอ | ต่อหน้าใน Section เดิม | ปิดส่วนที่แสดงแล้วหยุด instance นี้ |
| ตารางถึงขอบ | ปิดเส้น fragment แล้วต่อส่วนค้าง | ปิดเส้น fragment แล้วหยุด instance นี้ |
| ภาพไม่พอพื้นที่ที่เหลือ | ยกทั้งภาพไปหน้าถัดไป | หยุดก่อนภาพ รวมส่วนที่เหลือใน instance นี้ |
| ความสูงที่กำหนดมากกว่าพื้นที่หน้าเหลือ | จัดตามองค์ประกอบตามปกติ | ใช้พื้นที่หน้าเหลือ วางส่วนที่พอ แล้วหยุดโดยไม่ขึ้นหน้าใหม่ |
| จบ/หยุด/ไม่แสดง instance | ทำรายการถัดไปตามลำดับ | ทำรายการถัดไปตามลำดับ ไม่หยุดทั้ง Area |

- Fixed ใช้ effectiveHeight=min(declaredHeight, remainingBodyHeight) ของแต่ละ
  instance. จอง effectiveHeight แม้ข้อมูลว่างหรือจบก่อนเต็ม ตามกติกาจองพื้นที่เดิม;
  ไม่เปลี่ยนเป็นยุบกรอบตามเนื้อหาในรอบนี้. ถ้าส่ง [] ไม่มี instance/กรอบ.
  หน้าเหลือ0จึงไม่วางกรอบ; ถ้ามีพื้นที่แต่หน่วยแรกไม่พอ ให้หยุดเนื้อหาของ instance
  และแจ้ง cursor. ไม่ข้ามทั้งรายการเพียงเพราะ declaredHeight มากกว่าพื้นที่หน้าเหลือ.
- พื้นที่ของลูกเป็นส่วนหนึ่งของกรอบรวม ไม่บวกกรอบซ้ำ: fixed180pt ที่มีกล่อง30pt
  ใช้30ptจาก180pt. ไม่อ่านความสูงรวมของเนื้อหาทั้งหมดเพื่อกำหนด declared height.
- Fixed เป็นกรอบใน flow ไม่ใช่ absolute x/y; เนื้อหาก่อนหน้าที่ขยายทำให้จุดเริ่ม
  เลื่อนได้. Width/page margins/header/footer/numbering ยังมาจาก Section/context.
- ก่อนวาง ตรวจ complete measured line/frame height พร้อม spacing, padding และ
  closing-stroke allowance ที่เกี่ยวข้องโดยไม่บวกซ้ำ. ไม่ตัด glyph/บรรทัด/ภาพกลางชิ้น
  และไม่ลด font size/กรอบภาพเพื่อซ่อนปัญหา. คง contain ภายในกรอบภาพเดิม.
- ตารางใช้ shared cut ที่ปลอดภัยสำหรับเซลล์ และปิดขอบล่าง/ด้านข้างของส่วนที่แสดง;
  shared edges ไม่วาดซ้ำ, spans ไม่เกิดเส้นผ่ากลาง merged cell. เคารพ allowBreak,
  keepStart และ repeated-header policies; ไม่ปล่อยหัวตารางเดี่ยวเมื่อ body วางไม่ได้.
- จุดที่วางไม่พอหยุดเฉพาะ instance ปัจจุบัน ไม่ข้ามลูกที่ติดไปแสดงลูกท้ายใน instance
  เดียวกัน. ทั้งการหยุดกลางเนื้อหาและการข้ามทั้งกรอบต้องเก็บ request/draft ครบ.
- รูปใหญ่เกินเต็มหน้าและ invalid child geometry ต้องแยกกันในช่วง0: เจ้าของยอมรับ
  ไม่แสดงภาพที่ใหญ่เกินพื้นที่ แต่ต้องไม่เปลี่ยน legacy failures แบบเงียบหรือใช้
  omission หลบ malformed input, missing resource, readiness หรือ security checks.

### รูปข้อมูลที่ปิดในช่วง 0

Closed design contract, not today's accepted runtime JSON: optional `sizing` อยู่บน
Format definition; omitted means existing implicit auto. Explicit auto has only
mode; fixed requires finite positive height in pt/mm. ค่ามีผลกับทุก instance ที่
เรียก definition นั้น ไม่เพิ่ม sizing override ใน `{format,data}` สำหรับรอบแรก.

```json
{
  "areaFormats": {
    "meeting-format": {
      "key": "meeting",
      "ownerAreaId": "meetings-area",
      "sizing": { "mode": "fixed", "height": { "value": 180, "unit": "pt" } },
      "inputSchema": {
        "type": "object",
        "fields": { "title": { "type": "string", "required": true } }
      },
      "fragment": {
        "rootIds": ["meeting-title"],
        "nodes": {
          "meeting-title": {
            "id": "meeting-title",
            "type": "text-block",
            "role": { "role": "paragraph" },
            "props": { "textStyleId": "body" },
            "children": [{ "id": "title-value", "type": "field-ref", "scope": "local", "key": "title" }]
          }
        }
      },
      "repeats": []
    }
  }
}
```

This is a definition excerpt with a miniature title-only Format, not the full
real SRS schema or a standalone validated template. Existing data syntax stays:

```json
{
  "meetings": [
    { "format": "meeting", "data": { "title": "Meeting 1" } },
    { "format": "meeting", "data": { "title": "Meeting 2" } }
  ]
}
```

Each call independently uses min(180pt,current remaining body space). With100pt
remaining, the first gets100pt and renders its fitting prefix; it is not skipped.
It reserves that100pt, so later fixed calls see no space unless another authored
flow action changes the page. Different Format keys/modes may still be mixed.

Contract warnings use the existing Result/Issue channel: FORMAT_CONTENT_OMITTED
for stopped content (including when its first unit cannot fit a positive frame);
FORMAT_FRAME_NOT_SHOWN is only for zero available body space.
There is no Area-level stop or omitted range extending through later entries.
An illustrative partial-result warning, not an executed receipt:

```json
{
  "code": "FORMAT_CONTENT_OMITTED",
  "path": "areaFormats.meeting-format.sizing",
  "message": "Format instance exceeded its fixed frame; remaining content was not shown",
  "action": "skipped",
  "sectionId": "10000000-0000-4000-8000-000000000001",
  "formatOmission": {
    "version": 1,
    "areaId": "meetings-area",
    "areaEntryIndex": 0,
    "areaFormatId": "meeting-format",
    "format": "meeting",
    "reason": "height-limit",
    "pending": [{ "nodeId": "section-instance~meeting-title", "sourceNodeId": "meeting-title", "kind": "text", "lineIndex": 3 }]
  }
}
```

The warning illustrates a separate overflowing input, not a measured result for
the two short titles above. Retain original zero-based entry index plus Section,
Area and Format identity; the same Format called twice must not share a stop
cursor. Bind reports to revision/fingerprint and pinned renderer/font identity.
Do not put visibility omissions in PreparedAreaValue.skippedIndices, remove
input entries, include raw private text in warnings, or infer total omitted
lines/rows from an entry index. PDF success with warnings is not full coverage.
Exact cursor shape, atomic rows/images, warning persistence and omission-related
TOC/reference handling are specified in the Stage0 contract below; they remain
implementation requirements, not current capabilities.

### ขอบเขต การตรวจ และลำดับงานที่ปรับแล้ว

Work Size large; Risk Tier routine with concrete data-omission, multi-cell-row,
pinning and legacy risks. Work authority now is design/documentation only.
Use this user-selected room/model for the authorized inline revision; no host
model switch or separate WORK is claimed. Resolve a fresh implementation model
decision against host availability only when execution is authorized.

Document budget: this existing canonical section and later affected existing
code-adjacent guides; no additional mandatory startup document. Proof budget:
source/JSON/diff/document checks now; later affected Core and packed-consumer
tests, Service/MCP checks and every-page review of bounded acceptance PDFs.
New runtime work must choose isolation for its actual risk/concurrency and
refresh bases; a plan does not create lanes or reopen old execution registries.

Allowed later owner paths: Core template/binding/composition/layout/result types
and affected tests; Service template/job/MCP contracts and consumers; Project
Control this record and existing FlowDocMake package/guidance. Not in scope:
Area sizing, absolute placement, recursive Format/Area nesting, shared external
Format library, UI, auto-fit, new image ingestion or font-scale features.

### แผนช่วง0–5เดิม — ประวัติ v1 ที่ส่งมอบแล้ว

Checkmarks below certify the v1 candidate only. The maximum-height v2 correction
has a separate bounded plan at the end of this same document.

### ช่วง 0 — ทวนสัญญา Format sizing หลังเปลี่ยนเจ้าของพฤติกรรม

- [x] บันทึกเจ้าของและขอบเขต: definition กำหนด mode; instance จองพื้นที่/หยุด
  เฉพาะตน; Area รับรายการเดิมและไม่หยุดทั้งชุด. Owner-approved chat summary
  supersedes the old Area contract; it is not old Stage0 proof reuse.
- [x] ตรวจ exact sizing JSON, default/units/validation และ capability `formatSizing`
  กับ model19/font schema1/2; ระบุ explicit auto/legacy impossible-image policy.
  Placement restrictions follow actual context: fixed initially only
  when the owning Area is a Section flow root; do not assume fixed in cells works.
- [x] ปิด geometry ของ instance: inherit width, empty invocation, full reservation,
  no double-counting, exact-fit tolerance and non-placement without page move.
  Separate absent entry from an invoked Format whose rendered content is empty.
- [x] ทวน full stop/skip semantics through rootIds, repeats and rowGroups, explicit
  page-break, nested table-cell images and child fixed text; preserve existing
  child errors rather than blindly replacing them with omissions.
- [x] ปิด exact FORMAT_* warning/cursor/envelope contract and instance identity;
  frame omission must identify the same single entry even when it shares a key
  with later entries. No Area-wide entryRange or replacement of valid input.
- [x] ปิด TOC/anchor/reference behavior if a stopped Format hides a destination:
  no guessed page or dangling link. Reassess the prior Area-specific TOC ban/error
  choices rather than silently carrying them into this different contract.
- [x] Review receiving/sending JSON and compatibility with Core/Service/FlowDocMake;
  record exact decisions here. Stop for contract review before runtime work.

### ช่วง 1 — Core: definition และ Format-instance boundary

Owner Core. Files: `src/template/types.ts`, relevant validators including
`src/template/sectionOwnership.ts`, `src/data/prepareAreas.ts` only if affected,
`src/binding/expandAreas.ts`, `src/binding/expandRows.ts`,
`src/composition/resolvedDocument.ts` and composition/validation consumers.

- [x] Red tests for omitted/explicit auto, fixed validation, correct ownership and
  unsupported contexts; implement definition-level sizing without new Area props.
- [x] Preserve per-entry boundary/provenance through expansion, including repeated
  members; two instances of one key must have independent frames/IDs/cursors.
  Do not turn the whole semantic Format into an indivisible layout item.
- [x] Verify clone/import maps, prepared/fingerprint compatibility and input
  immutability; run affected template/binding/composition tests and review diff
  before committing. Boundary delivery alone is not fixed-PDF acceptance.

### ช่วง 2 — Core: instance flow ข้อความและภาพ

Files: `src/layout/documentFlow.ts`, existing measurement helpers,
`src/layout/fixedTextBlock.ts` only if affected, `src/pdf/drawContract.ts` and
result/provenance types needed by the closed Stage0 contract; destination
consumers `src/layout/linkGeometry.ts` and `src/layout/fillContentsNumbers.ts`.

- [x] Red tests for exact fit, one-line overflow, valid empty invocation, no entry,
  multiple calls of the same Format and mixed auto/fixed in one Area.
- [x] Implement capacity per instance: fitting frames reserve full height;
  non-fitting frames do not move to the next page or consume space. Content stop
  skips only the remainder of that instance; subsequent entries are evaluated.
- [x] Test image frame fit/move/stop and invalid resources, Section bands/page
  remainder, child fixed-height behavior and no-progress termination. Compare
  omitted/default auto to existing behavior, then inspect every page of small
  text/image fixtures. No production template or source-data mutation.

### ช่วง 3 — Core: ตารางและเส้นปิดในกรอบ Format

Files: `src/layout/cellTableFlow.ts`, affected measurement/fragment sinks and
tests `cellContentFlow`, `mergedTableFlow`, `pageBandFlow`, `rowGroupFlow` plus
Format-instance boundary cases in the existing layout test convention.

- [x] Red cases for padding/border exact fit, unequal cells, allowBreak:false,
  group starts, spans, repeated headers, cell images and no-room-for-body.
- [x] Reuse fragment measurement/painting; fixed stops and closes the current
  instance without swallowing later entries. Auto continues every unit once;
  no glyph/image clipping, stranded headers, duplicated edges or fake empty rows.
- [x] Inspect every page of short auto/fixed tables and a whole meeting Format;
  assert physical draw/border bounds, accurate per-cell pending state, unchanged
  nested input arrays and independent results for two calls of the same Format.

### ช่วง 4 — Service/FlowDocMake: contract และ omission ของแต่ละรายการ

Files: Service `src/templates/areaContract.ts` (exposes Format definitions despite
its filename), template/storage/job/MCP consumers and `src/jobs/render.ts` as
affected; Project Control existing FlowDocMake capability/guidance/package.

- [x] Consume a real newly packed Core with exact SHA256; expose `formatSizing`
  and definition sizing, never `areaSizing`. Update development versions only
  for actual implemented behavior; the earlier planning-only revision bumped none.
- [x] Verify save/open/clone/import, permissions, stale revisions, pinned jobs,
  default auto/legacy templates and full source input preservation after omission.
- [x] Persist/retrieve instance diagnostics through processor restart and actual
  MCP status/save responses. PDF succeeded with warnings must not become source
  complete; keep original readiness/font/security checks and explain partial output.
- [x] Update existing code-adjacent guides and compatibility; no extra startup
  guide, installed plugin replacement or live cutover without authorization.

### ช่วง 5 — ตรวจร่วมและส่งมอบตามนิยาม Format

- [x] Use new isolated unpublished drafts for meeting Formats, SB1 and boundary
  fixtures; back up before mutations and preserve accepted originals/Stage4–5 PDFs.
- [x] Test auto/fixed mixed within one Area, two/three repeated calls of one key,
  first partial or wholly omitted then later instances, and clone/mixed Sections.
  Verify independent limits/data/IDs, bands/numbering, TOC/link outcomes and fonts.
- [x] Save/hash each PDF, render and inspect every page; connect visible/omitted
  content to the specific Format call and warning. Input must remain byte/value
  equivalent as appropriate; retain prior source-fidelity limitations explicitly.
- [x] Review coverage/reused evidence/skips and candidate identity in this same
  record; stop at owner review. Merge/cleanup/release/tag/push/install follow
  their actual authorization and are not granted by this documentation request.

**Current state (2026-10-17, after owner PDF review):** v1 stages1–5 remain a
verified historical candidate, but its whole-frame gate does not meet the newly
confirmed maximum-height v2 definition. The retained packages remain v1. Core source stage1 is now separately verified
below; stages2–4 and integration/install acceptance remain pending.

### สัญญาช่วง 0 — Format sizing v2: maximum height (owner correction 2026-10-17)

**Authority Boundary:** Project Control design contract for future Core/Service/
FlowDocMake implementation. User authorized closing this Format-stage0 contract
only. Role Planning Partner / Cross-Repo Boundary Reviewer; single-room inline,
execution IDs N/A. The exact technical choices below close the approved behavior;
they are not assertions that the current runtime accepts these fields/warnings.
Current retained v1 candidate is Core `53b57dc` / Service `1769773`,
Core/Service0.4.3-dev.1 and FlowDocMake0.2.4-dev.1. This request changes only
this document; no runtime/package edits, repack, migration or installation.

This current design supersedes only the incompatible v1 whole-frame admission
rule and its dependent examples. Original v1 design/results remain retrievable
in commit5bf5f70 and the historical delivery section below. No runtime is changed.

#### 0A. Exact definition and compatibility

- `AreaFormat.sizing` is optional and is the only new definition property.
  Allowed shapes are exactly `{"mode":"auto"}` or
  `{"mode":"fixed","height":{"value":180,"unit":"pt"}}` (example height).
  Fixed height value must be a finite number strictly greater than0; units are
  pt/mm, with pt=value for pt or value*72/25.4 for mm. Unknown keys/modes, null,
  an auto height, absent fixed height and invalid numbers/units are INVALID_TEMPLATE.
- New explicit sizing is supported only by nodeModelVersion19, with existing
  font schemaVersion1/2. No model20/font-schema change is introduced. Model18
  rejects sizing. Omitted sizing preserves legacy implicit auto behavior and
  old fingerprints; no draft or published definition is rewritten. Literal
  explicit auto may have a different fingerprint from omitted sizing.
- Explicit auto has existing ordinary text/table flow. Its opt-in oversized-image
  exception is specified in0C; omitted sizing preserves historical impossible-
  image errors. This compatibility distinction is deliberate, not a silent
  migration. Existing valid default-auto content must retain output semantics.
- Explicit fixed is valid only when its owning Area placement is an authored
  Section flow root. Fixed inside table cells/repeats, recursive Area/Format
  nesting and fixed TOC nodes are unsupported/INVALID_TEMPLATE in v2. Auto keeps
  existing placement rules. Reject a fixed definition whose fragment contains
  table-of-contents, even if that Format is not selected in the sample request.
- Sizing is not allowed on Area props, field schema, Section or `{format,data}`
  entries. No per-call override. Two calls of one definition share the same
  sizing policy but get distinct capacity/cursors. To author different policies,
  use different owned Format definitions. Clone/import copies sizing literally,
  remaps ordinary IDs/references and never merges independent instances.
- Prepared request data stays unchanged: no new skipped input entries or partial
  source payload. Existing template fingerprint/revision and packed renderer/font
  identities pin the sizing used by a job; a later definition edit cannot change
  the output/warnings of an already queued job.
- The future capability object is exactly the following (not currently exposed):

```json
{
  "formatSizing": {
    "version": 2,
    "nodeModelVersions": [19],
    "fontSchemaVersions": [1, 2],
    "modes": ["auto", "fixed"],
    "fixedContexts": ["section-flow-root"],
    "diagnosticsVersion": 1
  }
}
```

Older consumers must reject unsupported explicit sizing, never strip it and save
auto instead. The next consumer must require formatSizing.version2; current
version1 advertises the old whole-frame gate and cannot certify v2. Keep
diagnosticsVersion1 because envelope shapes are unchanged. No `areaSizing` capability or Area-prefixed omission schema is added.

#### 0B. Frame geometry, instance progress and stop

- Fixed width is the current Section flow width after margins/band constraints;
  v2 adds no Format width, absolute x/y, internal padding or visible outer border.
  Child table/cell/image geometry is measured within that width. A visible frame
  is not automatically painted; authored children retain their own drawing.
- At the current cursor compute remainingBodyHeight=max(0,bodyBottom-cursorY)
  after margins, selected bands and preceding content; then
  effectiveHeight=min(declaredHeight,remainingBodyHeight). Declared height is a
  maximum, not a requirement to fit a whole rectangle. A positive page remainder
  is usable even if the declaration exceeds a full page. Do not advance pages
  or scale text/images to make the declaration fit. Exact unit fit retains the
  existing1e-6pt comparison tolerance; it does not add capacity.
- Reserve effectiveHeight, including an empty invoked Format or content that
  ends/stops early. This preserves reservation behavior within the smaller
  effective frame, not natural-content shrink-to-fit. No entry means no frame.
  Children share this one budget; following entries start at its end.
- With zero remaining body space, no positive frame exists: consume no space
  and emit FORMAT_FRAME_NOT_SHOWN. With a positive frame but a first whole unit
  too tall, render no content and emit FORMAT_CONTENT_OMITTED with its actual
  pending cursor; reserve effectiveHeight. Never discard the entry solely for
  declaredHeight>remainingBodyHeight. Never retry its remainder on another page.
- Process rootIds and expanded members in order. At the first item that cannot
  fit, stop only this instance's remaining content; later entries in the same
  Area still run. There is no shared budget or Area-wide stop. Do not fill gaps
  by jumping ahead to later children of the stopped Format.
- Fit includes complete measured line/frame height and applicable spacing,
  cell padding and closing stroke extent. Do not count allowances twice.
  All visible stroke bounds, including half-stroke extents, stay within the
  frame. Never crop glyphs, text lines or images; never lower font size or change
  the requested image frame to conceal overflow.
- Text lines and image frames are atomic. A line/rule node includes all its
  before/after spacing and stroke. Existing child fixed-height text is atomic
  with its reserved height: if valid but it does not fit the parent remainder,
  stop before it; if its text violates its own fixed-frame contract, retain the
  existing layout error. Do not inherit partial parent behavior into that child.
- An explicit page-break reached in fixed stops the current instance before the
  break with reason explicit-page-break and creates no page. Subsequent entries
  may create pages only under their own ordinary flow or explicit authored break.
  Auto preserves current leading/repeated/trailing-break behavior.
- Source validation/readiness/security still covers full input. Declared invalid
  geometry, invalid data or missing resources are not turned into omissions.
  No requirement is introduced to fully lay out a stopped remainder merely to
  count its height/lines; diagnostics must not claim that hidden layout was tested.

#### 0C. Tables, groups and images

- Reuse the measured table grid/cell-content fragment logic. With allowBreak:true,
  select a safe shared slice containing complete text lines/image frames in
  every participating cell; unequal cells may have different logical stop cursors.
  Include repeated header height, padding and closure before accepting the slice.
- Close the bottom and sides of the rendered fragment with shared edges drawn
  once. Rowspan/colspan keeps grid topology and no separator crosses a merged
  cell. Keep the existing border geometry (currently0.5pt); no style API is added.
  Close at the real visible fragment end, not by painting pretend empty rows to
  fill the reserved Format height. The effective outer budget is still reserved, not the larger declared maximum.
- If a header fits but no body unit fits, do not leave a stranded header: auto
  moves the fragment, fixed stops before it. Genuinely empty authored tables
  retain their existing behavior and are not falsely called overflow.
- allowBreak:false protects a whole logical row. Row-group keepStart protects
  its prefix plus first member unit as currently defined. If that unit cannot
  fit fixed, stop before it; do not relax protection just to fill the frame.
  Auto keeps current group-start relaxation/warnings. A spanning cell alone
  does not make the whole span indivisible. Track unfinished cells separately.
- Ordinary auto images use the configured whole frame, moving to the next page
  if it fits a fresh applicable body region. For explicit sizing:auto only, an
  image too tall for any applicable fresh region is omitted with
  FORMAT_IMAGE_NOT_SHOWN and processing continues after that image. No blank-page
  loop. In cells account for table headers/padding and remeasure cell layout
  after the omission, preserving other text and protected-row/group policies.
  Implicit legacy auto retains its former impossible-image error behavior.
- In fixed, an image that cannot fit the remaining frame stops the instance,
  including a table-cell image. Emit FORMAT_CONTENT_OMITTED once; do not also
  emit an image warning, skip ahead within the same instance or split the image.
  Pixel dimensions are irrelevant to frame fit; existing contain behavior inside
  the declared frame is retained. Excessive declared width remains a layout error.
- If no unit fits a valid placed fixed frame, reserve the frame and report the
  stopped instance; continue to the next entry without retries or extra pages.

#### 0D. Exact diagnostic channel and identity

Use existing Result/Issue.warnings, with action:skipped and a fixed generic
message. Successful partial rendering remains ok:true and job status:succeeded;
Service sets hasWarnings:true. It is not full-content/source-fidelity PASS.
On a later layout error return ok:false with collected warnings, and expose no
new succeeded PDF. Prior successful artifacts remain independently valid.

Each warning requires path to the Format definition sizing, sectionId, and one
structured object as follows; ordinary optional Issue.nodeId may name the active
resolved node. No new public instance ID or client resume API is introduced.

| code | detail key | reason |
| --- | --- | --- |
| FORMAT_CONTENT_OMITTED | formatOmission | height-limit / image-does-not-fit / unbreakable-item-does-not-fit / explicit-page-break |
| FORMAT_FRAME_NOT_SHOWN | formatFrameOmission | insufficient-page-space |
| FORMAT_IMAGE_NOT_SHOWN | formatImageOmission | image-exceeds-page |

All three detail objects require version:1, areaId, areaEntryIndex (original
zero-based index), areaFormatId and format (key). Together with sectionId this
is the instance identity; retain original indices even when earlier calls were
omitted. Original clone/import origin remains separate provenance.

- formatOmission requires a nonempty pending array. Text cursor: kind:text,
  nodeId, sourceNodeId, lineIndex (zero-based measured line index), with optional
  sourceOffset (zero-based UTF-16 offset when known). Image cursor: kind:image,
  nodeId and sourceNodeId, without lineIndex. A wholly unshown atomic node uses
  kind:node plus nodeType. All indices/offsets are nonnegative safe integers.
- A pending cursor inside a table also supplies tableId, rowId, cellId when
  applicable, plus groupId/groupIndex/itemIndex/repeatId from actual expansion.
  For a partially shown row include one cursor per unfinished active cell;
  later untouched roots/rows of this same instance are implicitly omitted.
  No cursor, omitted range or skipped status extends to a later Area entry.
- formatFrameOmission requires sectionPageIndex (zero-based), requiredHeightPt
  and availableHeightPt (finite nonnegative measured lengths). No invented line
  cursor/page number for an unplaced frame. Emit one frame warning, not one per
  descendant. This code is limited to zero remaining body height, including empty invocations.
  requiredHeightPt is the declared maximum; availableHeightPt is0. Positive
  remainder with stopped content uses formatOmission, not this whole-frame code.
- formatImageOmission requires pending containing exactly the omitted image
  cursor. It reports that image only; it does not stop this auto instance or
  claim later content was omitted. Image warnings from independent instances
  retain separate identity. Existing unrelated warnings stay intact.
- Keep originalInput/PreparedInput, arrays, full text and asset references intact.
  Do not put rendering omissions into skippedContentIndices or
  PreparedAreaValue.skippedIndices, which represent preparation semantics.
  No guessed aggregate line/row counts or raw private values, image bytes,
  credentials, tokens or DB/storage paths appear in diagnostic messages.
- Preview/job envelopes identify templateId, saved revision, definitionFingerprint
  and already pinned renderer/font identity. A measured cursor is scoped to that
  exact render, never reused after changing fonts, data or definition. Persist
  warnings through child-render transport, restart, status read and PDF save.

The earlier example warning demonstrates the content case. Zero-space example
for a later call of that Format (illustrative v2 design, not a runtime receipt):

```json
{
  "code": "FORMAT_FRAME_NOT_SHOWN",
  "path": "areaFormats.meeting-format.sizing",
  "message": "Format instance frame did not fit the current page and was not shown",
  "action": "skipped",
  "sectionId": "10000000-0000-4000-8000-000000000001",
  "formatFrameOmission": {
    "version": 1,
    "areaId": "meetings-area",
    "areaEntryIndex": 1,
    "areaFormatId": "meeting-format",
    "format": "meeting",
    "reason": "insufficient-page-space",
    "sectionPageIndex": 0,
    "requiredHeightPt": 180,
    "availableHeightPt": 0
  }
}
```

#### 0E. TOC, anchors and legacy boundary

- Fixed Format definitions may contain headings/anchors, but not a TOC node in
  v2 as specified in0A. Auto TOCs retain their existing scoped behavior.
- Destination indexing must distinguish deliberately omitted nodes from visible
  nodes. A visible heading with a positioned line keeps its actual destination;
  an omitted heading never acquires a guessed page. If no visible reference or
  generated TOC row targets an omitted anchor, omission may succeed with warning.
- If a surviving reference or TOC row targets that omitted anchor, fail
  LAYOUT_FAILED with reason omitted-destination; do not erase a reference,
  silently prune TOC rows or add reflow passes. A partial heading with at least
  one positioned nonempty line follows the existing first-line anchor rule.
  The pre-omission title/schema remains subject to normal validation.
- Current `src/layout/linkGeometry.ts` rejects every unpositioned anchor and
  `fillContentsNumbers.ts` rejects missing TOC destinations. Omission-aware
  indexing for explicit sizing is therefore necessary product work, not a
  capability already available. Add these consumers to Stage2/5 impact checks;
  omitted sizing preserves the existing destination validation behavior.

#### 0F. Contract review cases and stopping point

Expected results below are future acceptance cases, not runtime tests run now:

| Input/case | Required result |
| --- | --- |
| Existing no-sizing template/request | Unchanged implicit auto behavior and input |
| Explicit auto declaration | No height; old normal flow plus explicit image exception |
| Fixed100pt with ten20pt text lines | Five lines; cursor lineIndex5; next call still processed |
| Two calls of fixed180pt with at least360pt left | Two separate180pt reservations, no shared budget |
| Invoked empty fixed180pt with100pt left versus [] | Reserve100pt versus no reservation; no omission if empty content ends normally |
| First fixed call stops mid-table, second call fits | Closed first fragment; accurate cursor; second rendered |
| First180pt call with100pt remaining, then fixed60pt call | First gets100pt and renders fitting prefix; next sees0pt and gets frame warning, no new page |
| Valid fixed maximum larger than full page body | Use full current remainder; render fitting prefix, no page move or shrink |
| Fixed300pt with120pt left and20pt text lines | Six whole lines; pending cursor if text remains; reserve120pt, no continuation page |
| Positive10pt frame with20pt first line/image | No content, content warning and cursor; reserve10pt, no page move |
| Zero body remainder | No frame; one frame warning with availableHeightPt0 |
| Invalid height or unsupported fixed placement | INVALID_TEMPLATE, not an omission warning |
| Two20pt table lines plus8pt total padding and0.5pt outer stroke allowance in48.5pt | Exact fit; complete lines and border |
| Same table in48.4999pt | Fitting complete lines only; closed fragment and pending cursors |
| Header fits without first body unit | No stranded header; auto moves / fixed stops |
| Fixed protected row/group does not fit | Stop before protected unit; no relaxation |
| Image20pt with fixed remainder10pt | Stop this instance before image; later entries continue |
| Explicit fixed page-break reached | Stop this instance, no continuation page |
| Omitted heading with/without visible inbound reference or TOC row | Error with surviving target use / warning-only allowed without it |
| Same Format key in cloned Sections | Independent identity, limits, warnings and pinned output |

Review coverage maps exact JSON/compatibility to0A, frame/stop to0B, table/image
behavior to0C, diagnostics to0D and links to0E. The original seven v1 Stage0 checklist
items remain historical; this owner-approved geometry correction is design only. Documentation verification covers JSON parsing,
example consistency, scope/identity and authority; it is not schema/runtime/PDF
acceptance. No Core/Service source, live data, generated map, package version,
release/tag or installed plugin is changed. Only the correction plan below may govern future work after authorization;
this design update does not authorize runtime implementation.


### ผลดำเนินงาน Format stages1–5 v1 — ประวัติส่งมอบ 2026-10-17

Authority: owner authorized continuous stages1–5 through verified handoff while
absent. Single-room inline; registered execution/Phase/Checklist IDs N/A.
Roles: Product Implementation Agent, Evidence Reviewer, Project Control Steward.
Scope: Format definition sizing, independent instance layout, structured omission
warnings and packed Service/FlowDocMake consumers. Area remains the ordered list.
Risk routine; large work. Existing contract/record and affected local guides only;
no extra AI startup document. Stop before merge/release/tag/push/publish/install.

**Candidate identity (development only):**

- Core `0.4.3-dev.1`, commit `53b57dc` (includes `f782d8b`, `4efd8dc`).
  Actual Linux/amd64 archive from `artifacts/1792234391075`:
  SHA256 `c12466b2e897dd80a8d8d1311eb76f0f7da104b90123649254d23cc5d9c78b58`.
- Service `0.4.3-dev.1`, commit `1769773`; vendor manifest and npm lock pin
  those exact archive bytes. No new migration. Rendering warnings are appended
  atomically to job_processing; immutable admission input/warnings stay unchanged.
- FlowDocMake `0.2.4-dev.1`, candidate in this record's development worktree;
  exact runtime/artifact check and `formatSizing` v1 required. Installed package
  and live Service configuration were not replaced.
- All three lanes retained under
  `C:/Users/nekot/.codex/worktrees/format-sizing`, branch `codex/format-sizing`.
  Primary bases remain PC `64b4d6f`, Core `c340c4f`, Service `08a7131`.

| Acceptance / impact | Durable evidence and outcome |
| --- | --- |
| Stage1 definition, context, provenance | Core `tests/template/formatSizing.test.ts`, helpers and composition validators; explicit/omitted auto, fixed units/context, empty calls, model18, immutable input, independent boundaries and invalid boundary ordering. Initial RED6 then GREEN; final full Core676PASS. |
| Stage2 text/image frames and destinations | Core `tests/layout/formatSizing.test.ts`, packed `tests/consumer/checkFormatSizing.mjs`; full reservation, unplaced frame without page move, next entry, explicit breaks, image/legacy behavior and omitted reference. Small native PDFs5files/9pages reviewed. |
| Stage3 tables / whole meeting Format | Core `tests/layout/formatTable.test.ts`: exact padding/stroke fit, unequal cells, protected rows/groups, merged spans, per-cell pending positions and header/body images. Whole semantic meeting tested through native MCP; auto/fixed content boundaries do not split the Format definition into tiny data chunks. |
| Stage4 consumer / persistence | Service `tests/format-sizing.test.mjs`, `format-sizing-unit.test.mjs`, `authoring-save-pdf.test.mjs`; actual packed Core, authenticated contract, save/open/clone/import, stale/foreign access, pinned old revision, unchanged input, successful partial and failed-reference diagnostics. Actual MCP status/save return the same warnings and fingerprint after isolated API restart. |
| Stage5 source / visual / legacy | New isolated unpublished drafts, final6PDFs/106pages. SRS98 + SB1auto2 pages pixel-identical at1100px to the accepted Stage4 PDFs; reuse prior every-page visual review by this equality. Meeting1, cloned/imported Sections2, fixedSB1two and image-boundary1: all6new pages freshly visually inspected. Final original/prepared/pin and restart checks8cases PASS, including failed reference and TOC jobs with no PDF exposed. |

Evidence directory (private inputs/config remain local):
`C:/Users/nekot/Documents/Codex/2026-10-17/format-sizing`.
Reusable summaries: `handoff.json`, `core-pdf-regression.json`,
`final-pages/comparison.json`, `pinned-input-proof.json`,
`final-restart-result.json`; actual MCP receipts and request/checkpoint files
are retained there. Backup-before contains the preserved isolated baseline DB,
staging and outputs with hashes. No authoring SQL/storage bypass was used;
SQL inspection for pin equality was read-only.

Final PDF examples: `final-meeting.pdf`, `final-two.pdf`,
`final-sb1-auto.pdf`, `final-sb1-fixed.pdf`, `final-srs.pdf`, `final-images.pdf`.
These deliberately partial fixed examples demonstrate omission, not source
reconstruction acceptance. Source-field arrays remain complete. SRS keeps the
existing4IMAGE_LOW_RESOLUTION warnings. Existing source differences in header
rows, SB1 font/line fidelity and source layout are not accepted as newly fixed.

**Review, repairs and test limits:** one fresh whole-branch reviewer found3
Important Core defects and1Minor boundary gap. All were reproduced failing and
repaired in one pass: oversized auto header image, already-processed empty anchor,
and unfinished later-row cell of a rowspan; boundary ordering now rejects the
forged case. Final packed Core full676tests PASS and all64consumer PDFs unchanged
from the pre-review candidate; the native table/reference cases remain checked.

Final Service full run:316PASS, one unchanged CLI invalid-argument test exceeded
its test window under concurrent native rendering (8515ms), six existing optional
font-height/intake tests SKIPPED. The exact final candidate's targeted CLI rerun
passed all3tests unchanged. This provides passing evidence for all317executed
cases across the full run and narrow rerun; it is **not** a one-shot full-suite
PASS. The6skips need their separate font-height/intake fixture environments and
are not recorded as PASS or new Format gaps. Final plugin suite23PASS/4optional
fixture SKIP. Actual candidate MCP preflight and native Service/DB paths passed.
Earlier superseded attempts (shared coordinator DB, stale local archive lock,
and test-harness upload alias reuse) remain in local logs; they were corrected
without changing acceptance, disabling immutability or relaxing upload ownership.

**Remaining / owner review:** fixed remains restricted to Section flow-root
placements and cannot contain a TOC. No absolute-position mode, cell fixed mode,
Area sizing, invocation override, resume API, automatic shrink or new border-style
API was added. Auto uses existing whole-line/image flow and legacy failures remain.
The unchanged CLI test timing sensitivity and optional fixture skips are recorded
execution limitations, not claims of source completeness. Main/release/remote/tag
refs and installed/live targets remain unchanged. Keep these clean unmerged lanes
and isolated evidence for review; integration needs the owner's next instruction.


### แผนแก้ v2 — fixed เป็นเพดานความสูง (ยังไม่แก้ runtime)

Owner instruction: after reviewing the300pt example, the owner confirmed that
fixed must show the fitting prefix in remaining page space. This supersedes the
v1 all-or-nothing frame gate, not the validity of its historical test results.
Owner repository for this request: Project Control; roles Planning Partner /
Documentation Synthesizer. Single-room inline, execution IDs N/A; work size small,
risk routine for documentation. One existing canonical file only. Proof budget:
JSON/example consistency, geometry case review, diff and Project Control checks.
No product code/tests, drafts, stored data, generated maps, package/version pins,
snapshot regeneration, merge, release, tag, push or installation in this request.

**Goal:** show all whole units that fit min(declared maximum,page remainder), stop
only this instance, preserve source input and diagnostics.
**Architecture:** retain per-entry boundary and bounded table sink; change frame
capacity calculation only, then verify affected warnings/consumers. No Area policy.
**Spec:** current0A–0F above. Tech stack and width/font/border behavior unchanged.
Future implementation may use the executing-plans skill after a fresh explicit
instruction; this plan does not dispatch agents or authorize execution now.

| ของที่มีอยู่แล้วใน v1 | ต้องแก้/ตรวจเพิ่มสำหรับ v2 |
| --- | --- |
| Format sizing JSON, model19 contexts and independent calls | Keep JSON shape; declared height now caps current remainder |
| Whole-line/image stop, table padding/borders and per-cell cursors | Feed effective height into the same bounded layout; test newly reachable short remainder |
| Input retention, cloned IDs, pinned jobs and persistent warnings | Reuse within scope; rerun for a positive but reduced frame and zero remaining space |
| Core676tests, prior PDFs and consumer checks | Historical evidence only for unchanged paths; old frame-skip assertions/PDFs are not v2 proof |
| Capability version1 and exact package pin | Advertise/require version2 with real new artifact/version only after implementation |

- [x] **แก้0 — นิยาม/ตัวอย่าง:** maximum formula; effective reservation retained
  even for short/empty content; positive-space first-unit stop versus zero-space
  frame omission; tables/images/breaks/links keep their existing whole-unit rules.
- [x] **แก้1 — Core capacity (owner Core):** RED cases in
  `tests/layout/formatSizing.test.ts` and `formatTable.test.ts`:300/120 with20pt
  lines,180/100 followed by60/0, declared height above page height, empty call,
  no-entry, exact fit and margins/bands. Change `src/layout/documentFlow.ts` to
  remove the positive-remainder whole-frame skip and reserve effectiveHeight.
  Keep schema/model18 validation, no page move/retry and input immutability.
- [x] **แก้2 — bounded components / diagnostics (owner Core):** test table
  padding+closing stroke at reduced capacity, protected rows/group start, merged
  active-cell cursors, header without body, image too tall for the remaining
  frame, atomic fixed-height child and explicit break. Change `cellTableFlow.ts`
  only for a demonstrated sink issue. Check existing anchor/TOC errors against
  newly rendered/omitted content. Audit `formatLayout.ts` warning conditions;
  positive frame => content stop, zero space => frame omission. Do not alter
  diagnostic shape or hide invalid child geometry, resources or font errors.
- [x] **แก้3 — packed consumers (owner Service and PC/FlowDocMake):** pack the
  verified Core artifact and exact checksum; expose formatSizing.version2 in
  `src/http/authoring.ts`, require it in plugin `scripts/compatibility.mjs` and
  update affected examples/tests/guides. Keep already-correct warning persistence
  and immutable admission inputs. Test old/new capability mismatch, pinned jobs,
  clone/import, permissions and actual MCP status/save. Development version bump
  belongs to this implemented change, never this documentation-only revision.
- [x] **แก้4 — native PDF handoff:** new isolated unpublished drafts: change the
  third meeting Format to fixed300pt too; it must render its fitting prefix in
  the current remainder rather than disappear. Check subsequent fixed/auto calls
  at zero space, SB1, schema1/2 fonts, source data and original drafts. Save/hash,
  inspect every new page, compare unchanged legacy SRS98/SB1two with accepted
  evidence and retain source-fidelity limits. Record changed/affected checks and
  any skips honestly. Stop at owner review; integration/release/install separate.

Worked example: if usable body height is730pt, the first two fixed300pt calls
reserve300+300pt. The third declared300pt receives130pt, so with20pt text lines
and no other allowances it shows6whole lines and stops before the seventh;
reserve130pt, not300pt. A table has less text room after header/padding/stroke;
use measured units, not a universal row count. This is a geometry example, not
a claim that every A4 page has730pt usable height.

**Validation boundary of design-only revision a21b0a8:** that revision changed
definition/plan only. The retained packed Core/Service0.4.3-dev.1 and
FlowDocMake0.2.4-dev.1 still implement v1. The newly authorized Core source
stage1 below is separate evidence; it does not update those artifacts or consumers.


### ผลแก้ v2 ช่วง1 — Core capacity (2026-10-17)

Scope: owner explicitly authorized stage1 only after maximum-height clarification.
Role Product Implementation Agent / Evidence Reviewer / Project Control Steward;
single-room inline, execution IDs N/A; small work, routine risk. Existing clean
linked worktrees reused on codex/format-sizing. Core base53b57dc; PC basea21b0a8.
No historical execution registry was reopened. No new plan/startup document.

Core source commit `e97cba15e43031dcc4734869e0285ebfae0f6ce7` implements the small documentFlow change:
positive page remainder always supplies a bounded frame ending at
min(cursor+declaredHeight,bodyBottom). Only zero remaining body space omits the
whole frame. Keep full effective-height reservation and existing stop/cursor
logic. No cellTableFlow rewrite, schema/JSON change or new Area behavior.
Local README/template-guide distinguish this unpackaged source from retained v1.

| Acceptance / impact | Evidence |
| --- | --- |
| Three fixed300 calls with120pt remaining after two calls | Third shows6whole20pt lines, stops at cursor6 and stays on page;119.99999pt shows5 without clipping. Input/definition unchanged. |
| Reservation and later instances | Short/empty call reserves the effective height; absent invocation reserves nothing.180/100 shows5lines; next fixed60 receives zero-space warning; subsequent auto moves to its own next page. Positive10pt with first20pt line gets content warning, not whole-frame skip. |
| Margins, bands, table consumer | Body capacity deducts selected header/footer and gaps. Existing table sink receives48.5pt from a declared300pt, draws2whole20pt lines plus padding/closure and then warns; no table-sink change. |
| Source checks | RED9fail/18pass -> GREEN27focused; TypeScript build PASS; full Core684PASS/75files, no skips. Schema/model18 and existing auto regressions included. Fresh scope reviewer PASS, no Critical/Important finding. |
| Native source PDF review |3PDFs/4pages, public PDF engine on Linux/amd64 with read-only current dist over the existing verified resource image. All pages rendered and visually inspected; expected text, unchanged source request and repeatable PDF bytes checked. This is source-layout evidence, not a new package or MCP delivery. |

Evidence: `C:/Users/nekot/Documents/Codex/2026-10-17/format-sizing-v2-stage1/`:
red.log, green.log, build.log, core-suite.log, native-result.json, pdf-review.json
and rendered pages/contact.png. PDF examples: three-fixed.pdf,
empty-reservation.pdf (first blank page is the intentional reservation),
reduced-table.pdf. Review initially read the pre-visual evidence status; the primary
agent's subsequent four-page inspection and current pdf-review.json establish
visual PASS. No reviewer assertion substitutes for that visual review.

**Remaining:** stages2–4 stay unchecked: deeper bounded-component/diagnostic
matrix, exact packed artifacts/capability version2 in Service/FlowDocMake, and
whole-document MCP handoff. Existing v1 archives, Service/plugin pins, capability,
installed/live targets, original drafts/data and primary/release refs remain
unchanged. No version bump, pack, merge, release, tag, push or installation.
Stop at stage1 review as requested; do not infer authorization for stage2.

### ผลแก้ v2 ช่วง2 — bounded components / diagnostics (2026-10-17)

Scope: the owner's next instruction authorized stage2 only. Owner Core; roles
Product Implementation Agent / Evidence Reviewer / Project Control Steward.
Single-room inline, execution IDs N/A; routine risk. Reuse clean linked
codex/format-sizing lanes; Core basee97cba1 and PC basefe500ee. Existing canonical
record only, no new shared plan or map promotion. Stage1's stop remains historical.

Core commit `ebc782a00253238e7741850fa9db84e90d0b9504` added
`tests/layout/formatReducedComponents.test.ts`:16 acceptance cases using
declared fixed300 with smaller available body regions. Existing bounded runtime
already satisfies these cases; no production-code rewrite was needed. Initial
test failures identified fixture mistakes (missing child heightMode, Section
anchor namespace, invalid width rejected before layout), not runtime defects.
No runtime RED/GREEN claim is made for correcting those fixtures.

| Acceptance / impact | Current evidence |
| --- | --- |
| Reduced table capacity, padding and closure |48.5pt fits2whole20pt lines;48.4999pt fits1; positive0.1pt fits none and emits content omission. Closing sides/bottom plus half-stroke remain inside the effective frame. Next fixed call at zero gets frame omission. |
| Protected rows, headers and group starts | Earlier fitting rows remain, later protected row stops whole; no isolated header without body; keepStart prefix stays with first member without relaxation. |
| Merged cells | Rowspan/colspan fragments close correctly; separate active unfinished cells retain independent line cursors and table/row/cell identity. |
| Images, atomic child and break | Root/cell image cannot split or skip ahead in fixed; later auto entry still flows. Valid fixed-height child stops whole, invalid child text retains layout failure. Explicit break stops without advancing the fixed instance. Invalid cell width is rejected during template validation. |
| Links / contents / warnings | Visible heading remains on its actual page and TOC number/internal annotations point there. Deliberately omitted unreferenced destinations stay absent; surviving reference or TOC fails with omitted-destination and preserves collected omission warnings. No new successful PDF is produced on failure. |
| Input / source regressions | Composed inputs unchanged by layout; public native runs retain request/template and empty skippedContentIndices. Full Core700PASS/76files, no skips; TypeScript build PASS. Existing auto/model18 and schema/resource regressions included. |
| Native source PDF review |5PDFs/8pages generated through public engine in Linux/amd64 with current read-only dist over existing verified resource image. Every page rendered and visually inspected; text, whole-image paint operations, page counts, internal targets and repeatable PDF bytes checked. Auto image case intentionally uses3pages: fixed prefix, auto text, whole auto image. This is source-layout evidence, not a new package or MCP proof. |

Evidence directory:
`C:/Users/nekot/Documents/Codex/2026-10-17/format-sizing-v2-stage2/` contains
core-suite.log, build.log, native-check.mjs, native-result.json, review_pdf.py,
pdf-review.json, original acceptance inputs and rendered/contact.png.
PDF cases: reduced-table, merged-table, protected-row, whole-image, visible-links.
Negative reference/TOC cases preserve issues/warnings in native-result.json.
Fresh scoped review PASS: no Critical/Important finding; declined-to-judge list
empty. Deferred minor: native omitted-reference fixture contains both reference
and TOC, so the recorded native error reaches TOC first. Reference-only failure
is independently verified by the new unit test, but not by a separate native
negative fixture. This limits evidence attribution, not Stage2 acceptance.

**Remaining:** stages3–4 remain pending: new packed artifact and exact consumer
pin/capability version2, Service/FlowDocMake checks and whole-document MCP handoff.
Retained v1 archives, installed/live targets, source drafts/data, primary branches,
release/tags and remotes are unchanged. No pack/version bump, merge, release,
tag, push or installation. Keep the unmerged lanes for the next owner decision.

### ผลแก้ v2 ช่วง3 — packed consumers (2026-10-17)

Owner authorized stage3 only: Core package, Service and FlowDocMake integration.
Roles Product Implementation Agent / Evidence Reviewer / Project Control Steward;
single-room inline, execution IDs N/A, routine risk. Existing linked development
lanes retained. Bases Coreebc782a, Service1769773, PCb4ea45c. No live installation,
primary integration, release/tag/push or stage4 whole-document authoring.

- Core `0.4.3-dev.2`, source commit `a87870977d6b49fc45bc242bfc399724909afa11`.
  Final artifact: Core `artifacts/1792238382286/flowdoc-core-0.4.3-dev.2.tgz`;
  SHA256 `8583805ff51223183ce68cbd2be3de2753dc1c6b70d9d1ff31d7fa3d964bc82f`.
  Earlier provisional dev.2 build is not the delivery artifact; final README
  version headers were refreshed before creating this exact archive.
- Service `0.4.3-dev.2`, commit `dffea2d09d5f357360120a847457512132db2c37`;
  vendor manifest, dependency and lock pin that exact new archive. Old v1 archive
  remains unchanged. Contract advertises formatSizing.version2, diagnostic
  envelopes remain version1. No migration or persistence schema change.
- FlowDocMake `0.2.4-dev.2` requires the exact Service/Core versions and checksum,
  capability2 and diagnostics1. Old/unknown capability and wrong runtime/hash
  fail closed. Updated existing API/layout chapters and generated plugin snapshot;
  no new mandatory startup reading. Candidate is untagged and not installed.

| Acceptance / impact | Evidence |
| --- | --- |
| Capability old/new | Plugin RED4fail/2pass against v1 -> GREEN6; rejects missing/v1/v3 capability, wrong contexts/diagnostic version and wrong artifact. Service RED2fail/2pass against v1 demonstrates old whole-frame skip; all4 Format tests pass with new package/capability. |
| Real package boundary | Linux/amd64 package build: Core700PASS/76files, build/native session and22 consumer families PASS. Exact installed tarball, no source mounts, networknone. New packed300/120 text and300/48.5 table cases verify fitting prefixes and zero-space warning. |
| Pinned jobs / clone / import / permissions | Actual PostgreSQL and packaged Core: full original/prepared input and preview definition remain pinned after a later sizing edit. Original, clone and imported Section previews retain maximum sizing with independent IDs, correct warning identity and no skipped input. Wrong-owner read/import fails; stale revision rejected. Restart keeps warnings and saved PDF bytes. |
| Failure and warning channels | Surviving reference to omitted content fails with omitted-destination and retained warnings, no downloadable partial PDF. Actual stdio MCP context is ready for candidate; clone/import/save/preview/status and save_preview_pdf retain revision1, fingerprint, both omission warnings and matching PDF hash after draft advances to revision2. |
| Service / plugin checks | Standalone Service suite success:true,318PASS/0FAIL/6fixture skips; host build and final README delivery guard PASS. Plugin23PASS/0FAIL/4fixture skips; changed capability cases included. Skips are listed below, not relabelled PASS. |
| Scoped PDF review | Final packed Format cases plus actual MCP saved PDF:8files/12pages rendered, text/page checked and visually inspected. Expected partial prefixes, closed table edges and ordinary auto/legacy flow retained. This is stage3 consumer proof, not stage4 whole-document or installed-chat readiness. |

Evidence directory:
`C:/Users/nekot/Documents/Codex/2026-10-17/format-sizing-v2-stage3/`:
core-identity.json, core-package-final.log, service-red.log, service-suite.log,
service-result.json, plugin-red.log, plugin-green.log, plugin-suite.log,
mcp-result.json, pdf-review.json and rendered/contact.png. Core consumer results
remain in its final artifact directory. Original v1 source artifacts are retained.

Verification incident: the first full Service run collided with a concurrently
started test API because processor advisory locks are database-wide, not per
schema. Stopped only the new API, reran the unchanged image alone, and verified
318PASS/0FAIL. service-concurrent.log preserves the failed harness run. The final
reviewer saw that earlier log before standalone completion; primary verification
read the final successful JSON. No product repair was inferred from that incident.
The isolated API also needed a bridge attachment for its loopback published port;
its private database and all user deployments/data stayed separate.

Coverage boundary: six Service skips require prior height-delivery configuration,
supplied Sarabun/Pridi metrics/native height-helper fixtures or seven-family intake;
four plugin skips require the legacy font-tools0.2.1 fixture environment. Those
font delivery/intake scenarios were not rerun or accepted here. Current Format
capability, package pin, job/clone/import ownership and warning criteria have
separate passing evidence above; seven-family/whole-document work remains stage4.

Fresh scoped review: no Critical/Important finding; declined-to-judge list empty.
Deferred minor: two Core guide headings have a duplicate literal `##`; cosmetic
only, keep the immutable verified package instead of repacking for that nit.
Review's pending standalone test prerequisite is satisfied by final service-suite
JSON and service-result.json; skipped fixture scenarios remain explicitly unverified.

**Remaining:** stage4 stays pending. Development lanes remain unmerged; primary
branches, release, tags, remotes, installed plugin/runtime and original drafts
are unchanged. Isolated test containers may be stopped with their state retained.

### ผลแก้ v2 ช่วง4 — native PDF handoff (2026-10-17)

Owner authorized stage4 PDF verification only, with no integration/release.
Roles Evidence Reviewer / Project Control Steward; single-room inline, execution
IDs N/A, routine risk. Candidate remains Corea878709 / Servicedffea2d /
FlowDocMake0.2.4-dev.2 at PC429ec93 before this status update. No runtime/package
changes or version bump. Existing source and acceptance fixtures are inputs;
verification did not repair the candidate or author directly into SQL/storage.

Restored the retained baseline backup only into fresh isolated stage4 DB/storage,
after verifying all three recorded SHA256 hashes. New API uses the exact stage3
image and Core archive SHA256
`8583805ff51223183ce68cbd2be3de2753dc1c6b70d9d1ff31d7fa3d964bc82f`.
Fresh actual MCP context ready:true, capability2 and23tool schemas captured
before mutations. All new drafts/clone/upload/readiness/preview/save operations
went through candidate FlowDocMake. Original drafts in both the restored and
earlier baseline environments were checked unchanged by read-only calls.

| Acceptance / impact | Evidence |
| --- | --- |
| Three fixed300 calls and following entries | Genuine meeting Format, independent Area calls; starts at12/312/612pt. Usable body807.88976378pt, so third receives207.88976378pt and paints its fitting prefix on page1. All three stop with content warnings; third retains two unfinished cell cursors for member index1. Following fixed60 receives zero-space frame warning at entry3; auto renders normally on page2. No remainder retry or input deletion. |
| Whole table units / closure | PDF vector geometry verifies the three frame starts and every stroke extent within the page remainder. Visual inspection confirms closed bottom/sides, no clipped lines or stranded group prefix. Unused height in first two frames is the agreed reservation, not missing automatic flow. |
| Schema1/2 fonts | Same meeting case generated with bundled legacy Sarabun and exact-library Sarabun400/700; unchanged sizes/line heights and identical pixels, text and links on both pages. Retained byte-identity evidence is referenced, not a new font intake claim. |
| SB1 | Unchanged schema2 auto clone remains2pages, pixel/text/link identical to accepted baseline. Separate declaration fixed300 clone deliberately omits its remainder with one content warning; cargo page2 remains identical. Both full original request payloads remain stored. Partial fixed form is a behavior example, not complete-source acceptance. |
| Existing SRS | Unchanged full98page clone, same13 source assets, all98pages pixel/text/link identical to accepted v1 baseline at1100px. TOC destinations, numbers, headers/footers and original source inputs retained. Existing4IMAGE_LOW_RESOLUTION warnings remain. |
| Pin / source preservation | Read-only5job verification proves original_input equality, pinned definition equality, renderer checksum and persisted warnings. Prepared input is checked for empty skippedContentIndices/skippedIndices; complete prepared-input equality is not asserted by this check. Original SRSrevision4 and SB1revision1 remain unchanged in both environments. |
| Every-page review |5PDFs/106pages saved/hash checked and rendered. All10contact sheets inspected;3independent changed pages additionally inspected individually.103pages also pixel/text/link match their accepted baseline or freshly reviewed schema1 equivalent. No visual page left unreviewed in this scope. |

Evidence: `C:/Users/nekot/Documents/Codex/2026-10-17/format-sizing-v2-stage4/`:
setup-proof.json, context.json, contract.json, tool-schemas.json, results.json,
all per-call inputs/receipts, pinned-proof.json, live-originals-proof.json,
pdf-review.json and rendered/. New PDFs: three-fixed300.pdf,
three-fixed300-schema2.pdf, sb1-auto.pdf, sb1-fixed300.pdf, srs98-auto.pdf.
Per-page coverage and hashes are in pdf-review.json, not inferred from job success.

Fresh scoped reviewer PASS: no Critical/Important/Minor finding. Reviewer confirms
the original-input/prepared-index attribution above. Declined scope is retained
explicitly: fresh full-source fidelity repair, seven-family intake, historical
optional font fixtures, release/install readiness and unperformed integration.
These are not newly accepted; they need their own evidence/authorization before
such claims. The exact correction-stage4 requirement is schema1/2 and the existing
documents, not re-execution of earlier font-library delivery work. SRS empty
Features List values, prior table-header differences and SB1 font/line fidelity
remain as in the accepted structural baseline. Four existing SRS image warnings
are not hidden or treated as new failures. Prior stage3 cosmetic guide-heading
nit remains unchanged to preserve the immutable artifact.

**Owner-review checkpoint:** correction stages0–4 complete within their recorded
scopes. No main/release/tag/remote refs or installed runtime/plugin changed.
Development lanes and isolated evidence/state are retained; integration, release
and installation remain separate owner decisions. This status-only update does
not regenerate or overwrite the immutable stage3 plugin guide snapshot.

### รวมตัวหลักและเคลียร์ชุดงาน — Format sizing v2 (2026-10-17)

Owner authorized local development integration and unused-lane cleanup, explicitly
excluding release and installation. Roles: Evidence Reviewer / Project Control
Steward. Single-room inline, execution/Phase/Checklist IDs N/A; routine risk.
Documentation gate: this existing Project Control canonical plan/status record
owns the cross-repository result; no new mandatory guide, product change, map
promotion or registered execution is needed.

Fast-forwarded unchanged tested candidates: Core `codex/template-binding` to
`a87870977d6b49fc45bc242bfc399724909afa11`, Service `codex/template-registry` to
`dffea2d09d5f357360120a847457512132db2c37`, and Project Control `main` to
`18647de9f7decc843d3483e9f65e249fed109c4f` before this status-only update.
Versions remain Core/Service0.4.3-dev.2 and FlowDocMake0.2.4-dev.2.

Fresh post-integration checks: Core build and700tests PASS/0skips; Service build
and4targeted contract/clone/warning/guide tests PASS,3optional legacy fixture
skips; plugin23PASS/0FAIL/4optional legacy fixture skips; all30snapshot hashes
and vendored/retained Core archive hashes match. Read-only stdio MCP from the
primary Service/plugin paths returns ready:true, capability2 and23tools; all5
retained preview jobs remain succeeded. All5saved PDF hashes match stage4.
Project Control check:data and diff checks PASS. Local development dependencies
were refreshed for the Service build; deployed runtime and installed plugin
configuration were not changed.

The first plugin test invocation inherited the installed environment URL and
failed its missing-reader case with SERVICE_UNREACHABLE. The same unchanged test
suite passed after explicitly selecting the isolated integration configuration;
both logs are retained. No candidate repair was made. Optional fixture skips
remain unverified, not PASS.

Proof reuse: unchanged fast-forwards preserve the exact tested trees and Core
archive. Reuse the standalone Linux Service318PASS/6fixture-skips, native Core
package/22consumer-family results and stage4 all106page review rather than
claiming a fresh full suite or fresh visual review. Their prior limitations and
source-fidelity differences above remain unchanged.

Integration evidence and replay configuration:
`C:/Users/nekot/Documents/Codex/2026-10-17/format-sizing-v2-main-integration/`.
Files: before.json, retained-hashes.json, core-tests.json, service-tests.json,
plugin-tests-selected-config.log, verification.json, cleanup.json and final.json.
Private config.json selects primary source paths and the existing isolated API;
it does not replace the installed configuration. Before removing task worktrees,
copied and SHA256-verified all573ignored evidence files. Previous Core artifact
locators under `format-sizing/flowdoc-core/artifacts/` now resolve to this
directory's `retained/flowdoc-core/artifacts/`; the final archive remains in
subdirectory1792238382286 with SHA256
`8583805ff51223183ce68cbd2be3de2753dc1c6b70d9d1ff31d7fa3d964bc82f`.
Original external stage1–4 evidence and PDFs remain at their recorded locations.

Removed clean merged Core/Service Format worktrees and their temporary branches;
archived the managed Project Control Format worktree with a recoverable snapshot
and removed its merged branch. Also removed the clean detached
`section-area-stage4/host-service` helper at08a7131: no unique ignored data beyond
reproducible dependencies/build outputs; its source commit remains in Service
development ancestry. Historical configs pointing at removed worktrees remain
historical; use the integration config for current replay. Existing development
branches and Core/Service release branches remain. No release/tag, remote push,
deployment, user-data mutation or installed-plugin replacement occurred.

### เตรียมคู่มือและชุดผู้สมัคร release (2026-10-17)

Owner request: audit and prepare manuals/delivery before release; no snapshot,
tag, push or installation. Single-room inline; roles Documentation Synthesizer /
Evidence Reviewer, execution IDs N/A, routine risk. Existing record owns status;
Core README/template-guide and Service README/usage remain repo-owned operation
contracts, plugin metadata/guides remain Project Control-owned. Scope is documentation,
package identity and immutable delivery preparation only; product runtime and SQL
stay unchanged. Prepare Core/Service0.4.3 and FlowDocMake0.2.4 as untagged candidates,
retain dev.2 archives. Check exact package bytes/pins, Linux consumers, relevant
Service/plugin checks, source-to-package identity and guide snapshot. Existing
106page evidence may be reused only after proving executable/resource identity.
Unknowns: stale guide wording and deployment versions must be resolved; optional
font fixtures remain unverified. Release/install authority remains absent.

#### ผลเตรียมชุดผู้สมัคร — ยังไม่ออก release

Prepared Core0.4.3 source `559b126`, Service0.4.3 source `92e7ff1`, and
FlowDocMake0.2.4 source PC`9af5575`; plugin guide snapshot source `7bdddd9`.
These are local development candidates, not tagged releases or installed builds.
Runtime source, SQL, native tools and font binaries are unchanged from integrated
dev.2. Updated Core README/template-guide, Service README/usage, explicit image
defaults in Compose/.env.example, plugin manifest/README/skill and exact pins.
Distinguished text-block `props.heightMode:fixed` overflow errors from Format
maximum-height omission; corrected model18 example scope, helper availability
and upgrade instructions through migration021. No new startup guide was added.

Final Core tarball `flowdoc-core-0.4.3.tgz` SHA256:
`64dae8f530b8b02be1a36c6cf15172635a7752c4d70ec1edacad8593269805b2`.
Service package/lock/vendor manifest and FlowDocMake compatibility pin agree.
Old dev.2 archives remain unchanged. Compared all154packed files: changes are
package.json version, README, OFL.txt line endings and its resource-manifest hash.
License text normalizes identically; executable/font bytes are identical.
All66matching native consumer PDFs are byte-identical to dev.2; this supports
reuse of the prior106page review within its original scope and limitations,
not a new source-fidelity or new seven-family intake claim.

Checks: Linux Core700PASS and22consumer families PASS; Service build and full
Linux/PostgreSQL318PASS/0FAIL/6optional fixture skips; host4PASS/3fixture skips;
FlowDocMake23PASS/0FAIL/4optional legacy fixture skips; focused compatibility/
snapshot7PASS. Actual candidate stdio preflight ready:true,23tools, exact image/
versions/hash; all30guide hashes pass. Runtime-only Service image independently
loads resources and generates a native one-page fixture PDF with networknone,
no source mounts. This is runtime smoke proof, not a new visual-review claim.
Project Control data/diff checks pass. Remote default branches confirmed by
GitHub symbolic HEAD; existing release histories each retain9annotated versions.

Verification incidents retained: first full suite ran before migrating its new
base database (317PASS/1STORAGE_FAILED); migrated only that isolated database and
reran unchanged candidate to318PASS/0FAIL. Initial preflight was invoked before
its configuration existed; final preflight after prerequisites passed. The
runtime image intentionally omits build-only verifyVendor.mjs; replaced that
invalid checker invocation with in-container archive hashing and public Core
native rendering, without adding build scripts to the runtime image.

Delivery and evidence:
`C:/Users/nekot/Documents/Codex/2026-10-17/format-release-preparation/`.
`delivery/delivery.json` binds source commits, versions, archive hashes and image
IDs; delivery contains Core tarball, Core/Service source ZIPs, plugin ZIP including
marketplace wiring and the five existing manuals/rules. No credentials, DB dumps,
private source-document PDFs or installed configuration were added to delivery.
Core consumer artifacts remain in primary Core `artifacts/1792242597324/`.
Logs, package-comparison.json, service-result.json, context.json, runtime-check.json
and final-check.json preserve scoped results. The temporary candidate API is
stopped/removed after checks; isolated test DB and test images remain as evidence.

Remaining before release: owner authorization, freeze exact final source trees,
construct single-parent snapshots, verify tree equality, annotated version tags
and atomic push with remote confirmation. None was performed here. Six Service
and four plugin legacy fixture cases remain unverified in this round; their names
are retained in service-result.json/plugin-tests.log, with earlier font-height
evidence under the existing font-height plan. Do not report them as fresh PASS
or waive a mandatory prerequisite if later release scope requires those cases.
Existing SRS/SB1 source-fidelity differences remain deferred as above. Live-data
backup/upgrade/restore and fresh installed-chat checks belong to separately
authorized installation, not this preparation. No release/tag/remote refs,
installed runtime/plugin/configuration or user DB/drafts changed.

#### ปิดข้อทดสอบที่ข้ามก่อน release — 2026-10-17

Owner authorized completing the six Service and four FlowDocMake fixture cases,
with cause classification and no release/install. Single-room inline verification
with bounded test maintenance; execution IDs N/A, routine risk. PC owns this
status and two plugin test assertions; Service owns its unchanged integration
tests. Existing record is canonical; no new mandatory reading or guide snapshot.

All10previously skipped cases now PASS. Service's targeted proposal/supplied-font
and delivery-guard files:26PASS/0FAIL/0SKIP, including all6identified skipped
names. The earlier318passing Service cases are reused for the unchanged candidate;
this is not one fresh324test invocation. FlowDocMake's complete suite now runs
27PASS/0FAIL/0SKIP, including all4previously disabled cases. Core/Service0.4.3,
FlowDocMake0.2.4, Core checksum and delivered plugin bytes remain unchanged.

Evidence coverage: real seven-family input includes TH Sarabun New custom and
six supplied Google families; measured non-identity Sarabun/Pridi size adjustment;
native stdio proposal/confirmation through authenticated Service/PostgreSQL;
two unrelated-port guard rejections before admin mutations; real inspected binding
accepted without repeating intake. Plugin checks use a new cloned draft whose
font release was retired only in an isolated restored database, with readiness
still ready. A deliberately corrupted archive fails preflight and is restored;
final native preflight is ready with the original checksum. Both launcher/checker
use the selected configuration even with an empty simulated home directory.

Cause classification:
- Environment: explicit HEIGHT_DELIVERY_CONFIG, FONT_FIXTURE_DIR,
  HEIGHT_SUPPLIED_DIR, FLOWDOCMAKE_PLUGIN_ROOT, FONT_TEST_CONTAINER and FONT_PROOF_DIR
  were absent. Original supplied files and retained review state were available.
  Two test APIs initially competed for the same database worker lock; reran one
  at a time. A host-only attempt to read Docker-internal DB DNS was corrected to
  a read-only database inspection through Docker. These are test setup issues.
- Test harness: two assertions hardcoded plugin0.2.1. With the complete fixture,
  unmodified tests give2PASS/2version failures; amended only those assertions to
  require the exact selected plugin manifest version, then all27PASS. No checksum,
  authentication, ownership or compatibility condition was weakened.
- Reporting: the previous external report filtered status `pending`, while Vitest
  used `skipped`, so its name list was empty despite the recorded6skip count.
  New readiness.json recovers all6names from the original JSON and maps each to
  a fresh passing assertion. The original report/logs remain historical.
- Product runtime: no defect found in these10cases and no runtime/SQL/package
  repair needed. Existing unrelated source-fidelity limitations remain unchanged.

Evidence: `C:/Users/nekot/Documents/Codex/2026-10-17/format-remaining-tests/`:
readiness.json, service-fonts.log, service-guards-final.json, plugin-red-complete-
fixture.log, plugin-green.log, font-tools-proof.json and final-preflight.json.
Earlier setup failures remain in separate logs. Private dump/config/credentials
stay outside delivery. Original source environment's font release remains active;
retirement affected only its restored test copy. Temporary APIs are stopped and
removed after checks; isolated DB/staging evidence is retained. No user drafts,
installed environment or original font library were mutated.

This supplement closes the six/four fixture prerequisites listed in the previous
delivery record; immutable delivery archives are not replaced. Remaining steps
are owner-authorized snapshot/tree/parent checks, annotated tags and atomic push,
then separately authorized installation/live-data/installed-chat verification.
No release/tag/remote refs or installation were changed in this round.

#### ออกรุ่น Core/Service0.4.3 และ FlowDocMake0.2.4 — 2026-10-17

Owner explicitly authorized Git release snapshots, annotated tags, exact-tree
checks and GitHub push, excluding installation. Single-room inline; execution
IDs N/A, routine risk; roles Evidence Reviewer / Project Control Steward.
Existing readiness and all10fixture-case proof remain valid: no candidate product,
dependency, configuration or artifact changes. No new mandatory documentation.

| Component | Frozen development source | Release snapshot / annotated tag |
| --- | --- | --- |
| Core0.4.3 | `559b126c51073c31a2d42b3963d5d95a9b87757f` | `5c34f8496b698e06dc90be9e98ddf0fd756f067d` / `v0.4.3` |
| Service0.4.3 | `92e7ff1cc902eddc6a53a1222abd7550cdeb89e5` | `be90f69774342c010e635d52ff48ad6e64cb2640` / `v0.4.3` |
| FlowDocMake0.2.4 | PC`732a2bffdb17e5c0ee5e6e20e4974b81cd86fe13` | `a1cfbedd85544c33649319bed749ff50d3009ea7` / `flowdocmake-v0.2.4` |

Core/Service `release` each gains exactly one snapshot, whose only parent is its
previous0.4.0 snapshot; each full ancestry now has10commits with annotated tags
on GitHub. Old tags are unchanged. Each snapshot tree equals its frozen source
tree exactly. Development branches retain their full histories and were pushed
alongside the corresponding snapshot/tag in one atomic push per repository.

FlowDocMake is a component inside Project Control, not a standalone repository
or Project Control workspace version. Its first release uses the separate
`release/flowdocmake` branch and namespaced annotated `flowdocmake-v0.2.4` tag,
with its own root snapshot. Full repository tree equals frozen PCsource732a2bf;
component version is read from `plugins/flowdocmake/.codex-plugin/plugin.json`.
This does not label the independent PCpackage as version0.2.4. Later status-only
updates on PCmain do not rewrite that frozen source, snapshot or plugin guide.

Verified GitHub symbolic default HEAD before publication, clean working trees,
development ancestry, exact versions/Core checksum,9delivery archive/manual
hashes, prior readiness and all10supplemental tests. Verified all3Git bundles
before ref changes, then all3atomic dry-runs. Actual atomic pushes succeeded;
read back remote development heads, snapshot heads, annotated tag objects and
peeled targets; all equal their prepared identities. Core archive remains SHA256
`64dae8f530b8b02be1a36c6cf15172635a7752c4d70ec1edacad8593269805b2`.

Evidence: `C:/Users/nekot/Documents/Codex/2026-10-17/format-release-043/`:
before.json, verified pre-change Git bundles, prepared.json, per-repository
dry-run/push logs, release-result.json and final-check.json. Existing immutable
delivery and remaining-test supplements retain their original hashes/locators.
No installation/deployment, user-data changes, package/image publication or
GitHub Release-page creation was performed. Next is separately authorized
backup/install/live-data/installed-chat verification against this exact release.

#### ติดตั้งและตรวจข้อมูลจริง — 2026-10-17 (รอเปิด Codex ใหม่)

Owner authorized backup and installation of Core/Service0.4.3 and FlowDocMake0.2.4,
including original-document and native-chat checks. Single-room inline operator /
Evidence Reviewer / Project Control Steward; execution IDs N/A. This existing
canonical status is updated without changing product contracts or release refs.

Before installation, backed up the quiescent live PostgreSQL database, staging,
output, local configuration, launcher and previous plugin cache;58files have
recorded hashes. Restored the actual backup into an isolated database/storage,
applied migrations019–021, verified replay applied nothing, and regenerated both
original PDFs successfully before changing the live API. Backup contains private
credentials and is retained locally outside delivery.

Live endpoint remains `http://127.0.0.1:3018`, using the original database and
volumes. API now runs `flowdoc-service:0.4.3`, image
`sha256:04b95ce9eb94d5ebb10e6a53b8b4352b164edf1e2436e0331139ab5bcec24190`.
Core checksum is still `64dae8f530b8b02be1a36c6cf15172635a7752c4d70ec1edacad8593269805b2`.
Installed plugin0.2.4 through the supported local marketplace installation;
all47installed files match the released component source and its30guide snapshot
hashes pass. Local configuration and the existing MCP launcher now select0.2.4.

Actual live original drafts remain model18: SRS revision1 and ศบ.1 revision3,
with unchanged definitions and fingerprints. Regenerated SRS98pages and ศบ.1
2pages through the installed plugin. All100pages match previous output in
rendered pixels at1100px, extracted text and normalized PDF links; reviewed all
10contact sheets. The restored rehearsal also passed the same100page comparison.
This proves installation regression coverage, not new source-fidelity acceptance:
existing SRS missing-input/layout differences and ศบ.1 font/line differences
remain. SRS retains4low-resolution image warnings; ศบ.1 has none.

Live authorization checks return401without credentials,403for author credentials
on the admin route, and200for administrator credentials. Restarted only the live
API with no queued/running jobs; readiness recovered and both draft definitions,
font catalog and saved PDF hashes persisted unchanged. Removed only this round's
temporary rehearsal API; retained restored database/storage and backups.

Native chat can call the new Service contract (models18/19, Format sizingv2), but
this already-running chat still exposes15old tools. A fresh installed-plugin
client is ready with23tools and exact0.2.4/Core–Service0.4.3 identity. This is not
yet proof of the complete new native-chat catalog. Owner explicitly chose to
close/reopen Codex themselves; no app or other-chat process was stopped.
Installation remains **pending native-chat reload verification**, not complete.
After reopening, discover and call `get_flowdocmake_context` through this chat,
confirm ready/version/checksum and the23tool catalog, then close this checkpoint.

Evidence: `C:/Users/nekot/Documents/Codex/2026-10-17/format-install-043/`:
`installation-checkpoint.json`, `backup-manifest.json`, `restore-proof.json`,
`installed.json`, `live-pdf-review.json`, `live-permissions.json`,
`persistence-proof.json`, `post-restart-context.json`, and `native-chat-contract.json`.
Live PDFs are `live/srs.pdf` and `live/sb1.pdf`. No draft publication, original
template migration, release/tag rewriting or package/image registry publication.

#### ยืนยัน native chat หลังเปิด Codex ใหม่ — 2026-10-18

Owner returned after restarting Codex and authorized continuing the outstanding
connection checks. Native `mcp__flowdocmake` now exposes all23tools. Initial
preflight returned SERVICE_UNREACHABLE because both existing live containers
were stopped (exit255); started the original database, confirmed readiness, then
started the original API. No container recreation, configuration/data repair or
application restart was needed. The exit code alone does not establish why the
containers had stopped; startup policy/root-cause investigation is outside this
bounded connection acceptance.

Actual native-chat `get_flowdocmake_context` now returns ready:true,
packageVersion0.2.4, Service/Core0.4.3, exact released Core checksum and image
identity. Native contract confirms models18/19 and Format sizingv2. Native reads
of both original drafts confirm the same revisions1/3, fingerprints and ready
font status. Native `save_preview_pdf` downloads both persisted PDFs; SHA256s
match the previously reviewed98+2page outputs exactly, so that unchanged whole-
document review is reused rather than rendering the same bytes again.

Evidence: `format-install-043/native-chat-final.json` and updated
`installation-checkpoint.json` at the external installation evidence directory
above. The latter now reports PASS_INSTALLATION_AND_NATIVE_CHAT with no pending
check. This closes the installation/native-chat acceptance; existing source-
fidelity differences and4SRS image warnings remain unchanged. No user draft,
font default, release/tag or remote ref was changed in this follow-up.

#### ศบ.1 สำเนา Section–Area / Format fixed — 2026-10-18

Owner authorized a separate copy, original preservation, fixed/overflow warning
checks and both-page comparison. Single-room inline template authoring / Evidence
Reviewer; execution IDs N/A. Scope is the saved template and original sample,
not product runtime changes or renewed source-PDF reconstruction. Created fresh
conversion identity because model18 cannot change models in place; source
`af9015b7-df78-4af7-9444-15bd56a05f11` revision3 remains byte-structure/fingerprint
unchanged. New unpublished draft `68277691-1427-4b28-88af-535601ee18f1`, docKey
`sb1-section-area-fixed-20261018`, revision1 has one model19 Section, two root
Areas and declaration/cargo Formats fixed720/700pt, with an explicit page break.
Styles, schema2 font tuples, original input and native fragments are preserved;
Section bindings inside Formats become local. Continuation footer stays on page2.

Normal input: succeeded2pages, no warnings, all extracted text and horizontal
text coordinates equal baseline. Overflow cargo30rows: four fit, table closes
at616.11pt, remaining input retained; FORMAT_CONTENT_OMITTED identifies cargo,
entry0 and pending item4. Long owner160lines: protected source row cannot fit,
so it and following declaration content are not painted; one declaration omission
warning, rather than silently deleting input. Each test remains2pages, other
page pixels stay unchanged, and cargo footer coordinates remain fixed. Warnings
match status and saved-PDF receipts. All6output pages and2baseline pages viewed.

Visual comparison is **not identical**: fixed table stroke allowance adds.25pt
before/after each table and insets border edges. Measured vertical text shift is
.25–10.75pt on page1 and0–1.75pt on page2; footer coordinates do not shift. This
is traced to existing Core documentFlow.ts fixed-table handling, not font/data
changes. No compensation hacks or runtime edits were made. Functional acceptance
passes with this disclosed visual difference; owner has not accepted exact-layout
fidelity. Existing source-form font/line differences also remain out of scope.

Evidence/output: `C:/Users/nekot/Documents/Codex/2026-10-18/sb1-format-fixed/`:
`results.json`, `conversion.json`, `pdf-review.json`, source/target final reads,
complete preview input/status/PDF receipts and rendered pages. `normal.pdf` is
the normal-data deliverable; `cargo-overflow-fresh.pdf` and
`declaration-overflow-fresh.pdf` are explicitly incomplete overflow demonstrations.
Only this new draft was saved; no publication, deployment, release or font change.

Owner follow-up on2026-10-18 authorized natural wrapping of the declaration
starting “ข้าพเจ้า ( นาม )”. Same candidate is now revision3: combined f73/f80
into one paragraph, replaced its explicit line breaks with spaces, removed the
extra wrapper table and allowed that paragraph's row to split at whole lines.
Text values and owner binding remain intact. Aligned the paragraph with the
existing continuation text's left inset; first-line indentation is no longer
separately imposed. The initial revision2 repair showed that the earlier720pt
cap omitted the last signature-date row with a realistic long owner name.
Expanded declaration maximum to805pt within the805.8898pt printable page1;
cargo stays fixed700pt and the explicit break keeps cargo on page2. Final
normal and long-name previews both succeed in2pages without warnings, with all
normalized text preserved and page2 pixel-identical to revision1. Viewed all4
pages. Original model18 draft stays revision3 with its original fingerprint.
Earlier revision1/2 artifacts remain historical rather than overwritten.
Current evidence/PDFs: `sb1-format-fixed/flow-text/` under the same external
workspace, especially `results.json`, `review.json`, `normal-expanded.pdf` and
`long-name-expanded.pdf`. This supersedes the candidate's earlier720pt cap only;
no runtime, source draft or publication changes.
