# FlowDoc model20-only transition implementation plan

> **Current release status — 2026-11-05:** By explicit owner request,
> Core/Service v0.6.0 publication is withdrawn. Local and origin `release`
> branches are restored to v0.5.2 and v0.6.0 tags are removed. Development
> code, immutable packages and scoped lab evidence remain candidates.
> Earlier publication entries below are historical and superseded by this status.
> Current-chat actual-use acceptance has not passed; lab acceptance alone does
> not satisfy the owner's release gate. No installation or runtime change occurred.

Authority Boundary: Project Control canonical design/implementation plan for
the owner-approved pre-use transition. Core owns template/input/composition and
render contracts; Service owns persistence/admission/authoring/runtime; Project
Control owns the separate conversion tool, plugin candidate and shared evidence.
No completed implementation or release readiness is implied by this plan.

Goal: keep useful UAT/SRS/templates, convert them explicitly, then make new
Core/Service/plugin candidates accept20 only on a fresh named Oracle/OCI lab DB.
The owner confirmed the Oracle system is performance testing, not in use, and
authorized incompatible cleanup now. Prior backward-runtime compatibility work
is retained as historical evidence, not a requirement for the new candidate.

Architecture: independent offline converter reads legacy18/19 using an immutable
old SDK pin. Product runtime has no implicit conversion, legacy validators or
request decoder. One old section becomes one20 definition and one explicit
request occurrence; no automatic deduplication. A new lab namespace replaces
test history; conversion never rewrites completed task/job pins or artifacts.
Tech: existing TypeScript/Node24, PostgreSQL18, existing PDF/DOCX engines and
Docker/cgroup launcher. Spec: owner-approved five-step direction in this chat,
plus bounded current contracts in `flowdoc-service-model20-support-plan-2026-11-01.md`.

## Authority, isolation and constraints

Single-room inline; execution IDs N/A. Active roles: Planning Partner then
Product Implementation Agent, frozen Evidence Reviewer and PC Steward. Work
size large, risk routine in named disposable candidates; identity/data loss,
containment failure or new unsupported semantics escalate on evidence.

Bases: Coredb828b2, Servicebdd8740, PC99e6456. Fresh sibling worktrees and branches
`codex/model20-only-20261103`; primary/development/release remain unchanged.
Native worktree creation previously rejected these product roots outside the
chat workspace list; reuse established Git sibling-root fallback. No real
runtime installation, push, release or automatic integration is authorized.

Keep512MiB/swap0 per worker/bundle, coordinator/aggregate1GiB/2CPU and private
DB512MiB/1CPU. Keep50000 XML nodes,10000 image placements/drawings,32MiB DOCX
and existing expansion/source/output/cancellation limits. Build may use1GiB.
Use cached toolchain/resources only; no dependency/native installation.

Cleanup scope: only newly named candidate lab data/jobs after an explicit
inventory of that owned namespace. Retained reports, baseline packages and
selected source templates stay outside runtime. Do not wipe unrelated Oracle
containers, `.env`, source files or preserved evidence. Historical001–028 SQL
remain checksum-stable; a new additive migration enforces the20-only boundary.

Document budget: this plan, a pointer/status update in the existing support
record, code-adjacent guides and external JSON ledger/report. No synthetic Work
registry or product-repo `docs/superpowers` plan. Proof budget: RED/GREEN per
owned change, one converter/parity family, one named native acceptance family,
full tracked suite inventory with dedicated native mapping, one final whole-
change review/correction pass. Failed/skipped/budget-refused cases are not PASS.

## Conversion contract and review focus

Convert definition AND request, including examples, section ordering, image part
pointers, headers/footers, numbering and references. Retain styles/page layouts/
content/resources byte-for-byte where they are not identity references. Stable
mapping owns old section IDs/keys→new definition UUIDs/sectionKeys/instanceKeys.
Use immutable source fingerprints plus explicit target identity. Never mutate
inputs, guess unknown data, forge font rights or silently drop unsupported data.

Review focus:1 model19 request array order differs from definition order;
2 model18 cover/global anchor/TOC semantics;3 image part pointers and shared
resources;4 source/font ownership and immutable published histories;
5 defaulted/unknown variables, repeated occurrences and invalid/capped inputs.
Each belongs to the converter/Core tests before product refusal is enabled.

Discovery finding: real SRS fixture is18 with an authored cover and six body
sections; current20 disallows an authored `role` property. UAT is19/schema2.
Therefore a necessary Core prerequisite is20 cover semantics with cover only at
the first actual occurrence (not assumed definition order), never repeated.
Do not drop the cover role to make conversion validate.

## Ordered tasks

- [x] T0: inventory owner guides/current source and locate the retained UAT/SRS
  inputs; create clean candidate lanes and external ledger. Inventory template
  assets and Core/Service/plugin18/19 execution branches. No destructive reset.
- [x] T1: add Core tests proving20 cover support, invalid repeated/non-first
  cover refusal and unchanged rendering/frame semantics; watch RED, implement
  in `src/template/types.ts`, `pageSections.ts`, `data/prepareAssembly.ts` and
  relevant validation paths; rerun affected checks. Keep18/19 until parity.
- [x] T2: build PC-owned offline conversion module under `tools/model20/` and
  CLI with explicit source SDK/target SDK paths, input/output and dry-run
  manifest. Interface `convertLegacyBundle(bundle, {legacyCore,targetCore})`
  returns20 template/request/image mapping plus source/target digests, or
  explicit unsupported diagnostics. CLI writes only new output paths.
  Tests pin18/19 validation, identity determinism, order, defaults, references,
  cover, origins, shared image pointers, malformed input and input immutability.
  Watch the missing-function/positive conversion RED before implementation.
- [x] T3: inventory retained `docx-full-budget-20261031/inputs` UAT/SRS copies;
  apply converter and compare prepared/composed content/format facts with the
  pinned old SDK, using only declared identity mappings in the comparison.
  Run bounded actual PDF/DOCX cases and full-fixture feasibility within512MiB;
  stop on OOM. Existing large-document baseline refusals stay explicit; matching
  a refusal is not a valid output or capacity PASS. No fixture-name special case.
- [x] T4: after representable conversion passes, restrict Core public template,
  prepared/task input, resolved/render validation and exported runtime types to20.
  Delete old execution modules; legacy decoding stays only in offline tool's
  pinned SDK. Adapt active tests/fixtures to20; retain original golden inputs in
  converter references and assert18/19 rejection at public boundaries.
- [x] T5: restrict Service assembly/storage/contracts/authoring and internal font
  probes to20. Keep whole-definition create/save/validate/preview supported;
  remove obsolete19-only Section import/create/clone public tool routes rather
  than advertise unimplemented20 equivalents. Add migration029 with explicit
  legacy-row refusal and update startup schema guard; never relabel legacy rows.
  Verify new empty DB, bad/missing029, reject18/19,20 persistence/publication,
  input/durable diagnostics/rights and task recovery. Package exact tested Core
  into a new private digest and pin Service dependency/lock/manifest consistently.
- [x] T6: update PC/plugin active compatibility, guide snapshots/candidate profile
  and authoring/task examples to20-only; preserve exact archive guard. Build a
  separately identified candidate with new Core hash, test bootstrap and actual
  stdio/API PDF/DOCX paths. Do not patch installed plugin/cache or released files.
- [x] T7: fresh named Oracle lab namespace has only converted20 templates and
  newly seeded fonts/provenance, no old operational history. Compare available
  documents and diagnostics, native worker caps, interruption/DB fault/storage
  exhaustion/recovery. Inventory every active test and conditional; run complete
  ordinary suite and dedicated native counterparts, one file at a time. Do not
  delete tests just to reduce failures. Stop on actual OOM/containment failure.
- [x] T8: frozen whole-change review; commit only checked candidate changes,
  record exact sources/archives/evidence/limitations and retained data. No merge,
  push, release or install without the corresponding owner instruction.

Acceptance requires evidence for converted content AND actual supported output,
explicit unsupported cases, no legacy admission in product paths, functioning
20 authoring/task/plugin consumers, clean new DB, and declared test coverage.
The generalized checkpoint/facts/large-document memory redesign is a separate
scope; choosing model20 does not complete it or increase resource budgets.

## Owner decision 2026-11-03: XML repair before legacy removal

Core20 cover source checks pass56/56 in6 affected files. Offline converter/CLI
checks pass14/14. Full UAT/SRS conversion and resolved-graph parity pass in512MiB,
including actual frozen Service image-index validation of retained image bytes.
Native full DOCX still refuses both UAT and SRS at word/document.xml with
DOCX_OUTPUT_BUDGET_EXCEEDED. Same-run old-SDK controls refuse identically; this
does not make the full outputs pass. A bounded SRS20 DOCX is produced but native
Word fidelity and whole-document PDF/DOCX acceptance remain open.

Owner selected: repair full XML first, then remove18/19. T4–T7 remain dependent,
with no data reset, migration, Service/plugin mutation or legacy runtime removal.
The previous D2 full-DOM port encountered SRS heap OOM; do not repeat it unchanged.
X0 is bounded discovery: split Core-generated story XML into namespace-preserving
complete body units (never split tables), apply the prior recipe per bounded DOM,
and compare derived plans/output/content/formatting with the whole-DOM reference.
Retained raw SRS has484 direct body units, largest11777 nodes/392362 serialized
bytes; UAT236 units, largest16417/592539. This is sizing evidence, not a memory
or parser-safety proof. Ineligible oversized/unsupported units must retain their
original bytes and final refusal; no fixture-name special cases or raised caps.
Only after X0 may the private Core stage be implemented and checked with the
real generation working set, Word, packed consumers and failure paths. Preserve
50000XML/10000drawing/32MiB,512MiB per worker and the <=49000 SRS target. Scope
remains single-room inline; no new registered execution or implicit adoption of
the historical C1 candidate. External ledger/evidence: model20-only-20261103.

X0 result:11 lab unit cases and independent38-story protected-content/effective-
format checks pass; UAT36631/SRS48817 XML/rels nodes, no OOM. This is copy proof.
X1 may now port a private Core-only stage, after existing source compaction and
only while over budget. Use exact cached xmldom0.9.12 (dependency/archive checks,
no installation), strict XML/namespace/UTF8 framing, at most1MiB/20000 elements
per complete story unit and128 nesting depth. Ineligible input keeps original
bytes and existing final refusal. These are optimizer eligibility bounds, not
larger document caps. Known style IDs come from this generation's actual Packer/
source-style registrations; never infer ownership from an ID prefix. Footer
reuse uses actual emitted-section receipts and same-band identity, retains both
relationship IDs, and requires reverse-reference/sidecar validation. Stage all
replacements/removals and validate before mutation; cancellation propagates.
Keep under-budget packages on their prior byte path. Include C1's small lexical
native-constructor lifetime boundary, with fresh current-base receipt/package
parity tests; the old candidate's results alone are not acceptance of this port.
Then all affected DOCX Linux checks, real UAT followed by SRS512MiB (stop on OOM),
independent final package validation, native Word comparison and packed consumer
are prerequisites. Service/API/plugin and20-only removal remain later gates.

X1 accepted prerequisite result: Core candidate commit `4a14176` adds20 cover
support and private bounded compaction. Current affected Linux gate8 passes
310/310 tests in32 files; no skipped tests or OOM. Actual converted20 UAT/SRS
full DOCX generation passes in512MiB/swap0: UAT36435 nodes/190 drawings and
SRS48879 nodes/383 drawings, counting every XML/rels part. SRS leaves1121 nodes
below50000 and meets<=49000. Peaks are365268992/461201408 bytes respectively.

Word16 read-only refresh/export of the actual Core outputs matches historical
raw references: UAT73/73 and SRS101/101 page images exact at72dpi, full Word text
and per-page PDF text equal. This is scoped fixture evidence, not universal Word
fidelity. The first port changed six SRS TOC pages; XML-TOC-01 is corrected by
keeping the original paragraph emphasis environment and sharing eligible bold
through explicit character styles. Returning direct bold alone did not fix it.
No page content, picture locks, caps or public receipt/option contract was dropped.

Independent ZIP/XML/relationship/bookmark/hyperlink/footnote checks pass. Image
byte multisets and deobfuscated full embedded-font multisets match references.
Exact private archive SHA256 `02870d83b87b16c96d6395df3d5883d6ccb57f5dd5fa4c64515da05c84a45f23`
has254 dist files identical to the tested snapshot. Its extracted Linux consumer
passes PDF/DOCX font/image/cancellation/cap/failure-cleanup checks; its four direct
dependencies resolve at exact declared versions with the cached transitive graph.
Three fresh-process ordinary documents retain exact ZIP parts, complete file
bytes and full writer receipts against the pinned baseline, with fixed Date and
seeded Math.random controls. Initial consumer harness failures remain recorded:
package self-reference at the consumer root, then missing baseline dependency
mount. Corrected harnesses reused the unchanged archive; neither changed Core.

Current converter unit4 passes14/14, including CLI dry-run/no-overwrite/refusal.
Full parity4 checks both complete source/converted graphs (1591/5622 nodes,
1/7 Sections) and actual fixture image-index bindings against gate8. The offline
converter still does not certify image availability or font release rights.

Reusable evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/model20-only-20261103/`:
`xml-verification.json`, `final-package-validation.json`, `docx-gates8/`,
`full-native-xmlfix5-{uat,srs}/`, `word/{uat,srs}-final-comparison.json`,
`package-proof2/` consumer/dependencies, `package-proof3/` parity/exact-archive,
`converter-unit4/`, `full-parity4/` and retained failed attempts.
T4 may now begin in the isolated Core candidate. This does not complete20-only,
Service/API/plugin, full ordinary-suite/native-case union, release or installation.

T3's bounded converted20 PDF feasibility also passes: UAT2 pages/SRS7 pages,
valid PDF page counts, byte lengths and SHA256 matching receipts, no OOM at
512MiB/swap0. This is bounded data, not full-PDF capacity proof. Evidence:
`bounded-pdf-validation.json` and `full-native-bounded-pdf-{uat,srs}4/`.
The converter's offline reference directory preserves34 original Core fixture
JSON files under `tools/model20/fixtures/core-legacy/`, indexed by SHA256 and
Core `4a14176`. Explicit legacy-rejection inputs stay in Core negative tests;
they are not supported positive fixtures or runtime conversion fallbacks.

## T4 Core-only acceptance

Candidate `6f36c42` accepts20 only at template, preparation, normalized task,
resolved PDF and DOCX boundaries. It removes the18/19 preparation modules and
public model types. Active fixtures use explicit definition/instance keys;
38 original fixture files and2 resolved inputs remain offline references.
Legacy inputs remain negative-only product fixtures. Two positive18/19 output-
name metadata cases are retired with those models; they are not compatibility
passes. The current test inventory covers every130 active files:1321 ordinary
tests plus21 dedicated native tests,0 skipped. Native reuse compares unchanged
runtime/resources/test inputs, including the actual retained legacy ELF helper.

New cross-renderer regressions demonstrate that a global header and an unscoped
TOC were accepted by DOCX while shared PDF validation refused them. Corrected
RED3 first accepts valid20, then proves both malformed forms fail the final
refusal assertion. Strict DOCX guards and exported resolved types now agree;
old global-band traversal/fallbacks are removed. Earlier malformed test setups
are retained as harness failures, not defect proof. The type consumer separately
fails on permissive legacy fields before the repair and passes afterwards.

The exact private archive SHA256
`ef82f85163be57159c89dd64a535efd11a8791d4c7274f16ae5bb1670cf7aba8`
contains250 dist files matching passed snapshot final9. Its extracted consumer
passes types, exact cached dependencies, PDF/DOCX images/fonts, cancellation,
output refusal and failure cleanup. Binding/table PDFs match the immutable old
SDK byte-for-byte when given the same20 document; historical18 PDF hashes use
different source/instance identity and are not that comparison. Three ordinary
DOCX documents also retain exact ZIP bytes/parts and full writer receipts under
fixed Date/seeded-random controls.

Full native20 UAT/SRS9 pass512MiB/swap0, unchanged caps:36435/48879 nodes,
190/383 drawings, peaks370130944/473133056 bytes. Independent ZIP/XML/rels,
navigation/footnote checks and image/deobfuscated-font multisets pass. Native
Word16 read-only refresh/export matches historical raw references at73/101 pages:
full text, per-page PDF text and every72dpi page image equal. This is fixture-
scoped DOCX evidence; full-PDF capacity/general checkpoint redesign remain open.

Evidence: `t4-verification.json`, `cutover9-coverage.json`, `suite-model20-final9/`,
`package-cutover5/`, `full-native-cutover9-{uat,srs}/`,
`cutover9-package-validation.json`, `word/{uat,srs}-cutover9-comparison.json`.
Exclude final8's failed build and its prematurely started package4/native8
subprocesses from acceptance. A passed target receipt is now required before
dependent proof. Core main/development/release remain unchanged. T5 is active
in the separate Service candidate; its direct persistence/record/contract RED
has1 positive20 pass and6 legacy refusal failures before implementation.

## T5 in progress: Service cutover evidence

The Service candidate pins the exact T4 archive (`ef82f851...faba8`) and refuses
18/19 at decomposition, normalized-record, contract and authoring boundaries.
Migration029 refuses legacy operational rows with `LEGACY_MODEL_DATA`, preserving
data and its ledger. Current private DB checks pass22/22, including genuine
legacy18/19 seeds through the immutable old SDK, rollback after post-DDL failure,
numeric20 constraints and checksum protection. Native startup checks pass3/3:
missing029 or bad029 checksum starts no Service/worker; matching029 accepts20.

Actual native API A-B-A PDF/DOCX passes8/8; the20-only authoring/admission boundary
passes8/8. Nonempty diagnostics passes9/9 with capped details, retaining uncapped
totals and occurrence isolation. Each named lane verifies the installed archive
entry/hash,512MiB/swap0 worker placement, stable original-container identity and
no owned running containers after cleanup. These are scoped checks, not T5/T7
completion. Evidence: `service-db-domain-error-green/`, `model20-t1-second/`,
`model20-only-api1/`, `model20-diag-cap1/`, `model20-schema29-native1/`.

All22 active Service fixture families passed offline complete resolved-graph
parity before applying38 JSON files. Originals remain in `service-fixture-originals/`.
Current tests are being adapted to explicit20 occurrences, strict undeclared-field
errors and whole-definition authoring. Retired19-only clone/import cases remain
under `service-test-dispositions1/` through `service-test-dispositions8/`, with
original hashes and per-case rationale. They are not backward compatibility passes.
Historical001-028 SQL checks use an explicit028 ceiling and immutable old Service
for historical seeding/backfill; current029 admission remains a separate gate.

The first aggregate ordinary run fails and is not acceptance. It exposed stale
18/19 test inputs plus harness omissions (guides/scripts absent,64MiB shared temp).
The replacement ordinary harness runs one tracked file per fresh container,
private disk temp,512MiB/swap0, unchanged PID/CPU bounds and read-only source.
This also prevents intentional descendant-kill tests from accumulating process
state across files. Full ordinary/dedicated coverage, candidate packaging and
plugin integration remain open; no main integration or runtime installation.


T5 scoped acceptance is complete; see `service-t5-verification.json`. Current
private DB/domain guard22/22, native A-B-A8/8,20-only API8/8, capped diagnostics9/9,
native029 startup3/3 and actual worker HTTP acceptance5/5 pass. Current paired
typography/merged/navigation PDF/DOCX with normal/queue modes passes18/18.
CLI migrate/register/current-save-publish and persistence witness commands pass
in a fresh private DB; API restart seeding emits an actual20 PDF, but this CLI
check is not an actual DB/Service restart proof.001-028 bytes remain unchanged.

The158-file ordinary3 snapshot is explicitly FAIL (718pass/14fail/54pending).
Its stale current-input/setup failures are repaired and covered by subsequent
specific green files, including113pass/2conditional in task-clean7 and18/18 I6.
Plugin/config/conditional/native full union remains T6/T7, not a T5 whole-suite
PASS. Queue transport tests use declared synthetic admission headroom in a real
512MiB bundle; actual1GiB coordinator/512MiB worker cgroup admission is proved
separately, never inferred from that adapter. Three accidental doubled-CR test
line endings are repaired with identical TypeScript AST kind/literal streams.
No migration bytes were normalized:029 was already LF, checksum9a5e685d unchanged.
Prepared duplicate final-lf/adapted2/affected4 and failed CLI-smoke1 were not run.

T6 discovery RED retains the actual Service029 contract and demonstrates the old
plugin rejects valid20 discovery/group-label capability (1pass/2fail). Plugin
implementation follows in its candidate; installed cache and main stay unchanged.


## T6 initial scoped acceptance (workflow correction remains below)

The separately named0.3.2-candidate.1 profile pins the exact EF82 Core archive
and its actual262-file package tree (47cdac6d...). The prepared0.3.1 source pin,
snapshot and original guides remain unchanged. Candidate references contain
only converted20 examples, with6 families/7 requests checked for complete
resolved-graph parity. All shipped Markdown links resolve within the bundle.
Guide source commit80d2101 precedes snapshotting; no installed cache was patched.

Evidence under `model20-only-20261103/`: `plugin-t6-verification.json`,
`plugin-native-verification.json`, local37/37, candidate build2/2, preserved
legacy profile build2/2 and documentation authority22/22. Native MCP/API4/4
passes in `model20-plugin-native6`: actual ready:true, create/save/validate/preview
A-B-A including group labels, saved3-page PDF, PDF task/lookup, strict DOCX MCP
argument refusal without a new task, paired PDF/DOCX API with real JPEG/PNG.
Independent ZIP/XML/PDF parsing checks content/order, hashes and image objects.
The MCP task deliberately lacks one optional photo: it is explicitly partial,
with one stream warning and the same persisted finding/omission count, not a
claim of complete content. The paired API outputs are complete. All3 task
reservations are returned. Actual worker leaves remain512MiB/swap0; observed
aggregate peak477671424 bytes, no OOM, original identities stable and no owned
running containers after cleanup. No native Word claim for these small outputs.

Readiness never uses fabricated Docker responses. A private file transport
permits only actual inspect of the exact owned container and one exact read-only
metadata probe. No Docker socket reaches workers. This Docker daemon suppresses
HostPort publication on internal bridges, so the accepted private bridge uses
an unoccupied explicit subnet, NAT/ICC disabled and only127.0.0.1 publication;
DB stays on its private socket. Reader tools are copied into a lab-only prefix
from existing readers imagecea0eb185698..., with file hashes; the Service/worker
image and dependencies stay unchanged. No tool/product installation occurred.

Native1-5 are retained failed prerequisite/proof-input rounds and are not passes.
T7 full ordinary/dedicated union and fault/governor coverage, then T8 whole-change
review, remain open. T6 does not authorize merge, push, release or installation.


### T6 correction: candidate workflow must be included

Discovery after the direct MCP/API scoped pass found that the copied
`run_candidate_preview` workflow still admits only18/19 and chooses the old
`mcpServers.flowdocmake` name. The scoped4/4 result remains true for its named
paths, but is insufficient for T6 completion. Preserve that evidence and reopen
T6 instead of promoting a functioning-all-authoring claim. At that discovery snapshot the plan checkbox was intentionally unchecked
until correction and actual nested stdio proof passed. New unit regression is RED3/3 on package1. The20-only overlay model
gate becomes GREEN3/3 on package2-modelgate; actual named-server wiring still
needs its own native RED/GREEN. No Core/Service source changes are required.

The separate candidate workflow overlay preserves prepared legacy source
behavior. It changes neither source-coverage/deadline/review gates nor PDF-only
task semantics. Native workflow protocol fixtures explicitly use synthetic
coverage declarations; a successful wiring test is not source-authoring or
visual acceptance. Current T7 ordinary4 remains frozen against package1 and
must be assessed for affected-input reuse after this repair, not relabelled
as testing new workflow code.


### T6 correction resolved: actual workflow, examples and file client

`plugin-t6-current-verification.json` supersedes the initial scoped acceptance.
The candidate-only workflow accepts20, refuses18/19 before mutation, selects its
own named MCP server and rebases the executable path from the validated package
root. It retains examples and rebinds only their envelope docKey/version to the
server-owned draft; request data/text/occurrences and source bytes are unchanged.
The packaged file client has the same bootstrap guard and rejects retired clone
before connecting. Prepared legacy workflow/file-client sources stay unchanged.
Model gate RED3/3→GREEN3/3, example identity RED1→GREEN (final4/4), actual named
wiring/file-client REDs and candidate build2/2 are retained. Native13 passes6/6:
actual readiness, file client, direct authoring, nested run_candidate_preview,
PDF task/diagnostics and paired PDF/DOCX API. Independent parsing confirms both
three-page A-B-A PDFs, exact retained example graph apart from envelope identity,
two actual media files/drawings and returned queue reservations.
Small-output native Word/visual acceptance is not asserted.

Native9/11/12 colocation runs remain FAIL. Read-only resource observation in12
shows current458-493MiB, no active workers and healthy metrics, but adding the
320MiB worker reservation exceeds768MiB admission. This is caller test overhead,
not evidence of a broken font parser. Final13 runs caller MCP processes in a
separate512MiB/swap0 client container, preserving the Service1GiB aggregate and
worker512MiB/swap0 leaves. Actual Service-root peak476798976 bytes; client peak
141398016. Unix stdio transport forwards actual bytes and readonly Docker probes
still execute only on the exact owned Service container. No daemon socket or
fabricated ready values. Reader-tool raw receipt matches the controller hash.
All containers in the accepted namespace stop; original identities stay stable.
This does not claim that total lab RAM is1GiB or that software was installed.

## T7 suite coverage and T8 review correction

Current Service candidate `db15e9d` passes the frozen159-file ordinary execution:
813 passed,0 failed,6 skipped. Three skips are native task transport cases covered
by the actual capped native lane; three remain historical stage4 font-height
operator-harness cases, explicitly NOT RUN and not claimed PASS. All173 tracked
test files are inventoried in external `service-t7-suite-coverage.json`:9 fresh
native lanes,5 earlier native lanes with checked affected-input reuse, the
ordinary/native worker-task-wiring overlap, and one owner-cancelled historical
diagnostics-recovery file. No test was deleted to obtain these counts.

The one fresh-context whole-change review returned needs-revision for one P1:
a valid18 TOC-only Section with no contents entries can lose its page in20.
Resolved-graph parity alone did not catch this render-time distinction. The
offline converter now refuses18 TOCs with `LEGACY_TOC_LAYOUT_UNPROVEN` unless
an unconditional, non-cover authored root heading with literal nonempty text
proves document contents nonempty for every request/example. Nested/repeated
or dynamic evidence is deliberately insufficient. Core's intentional20 empty
TOC behavior remains unchanged; no synthetic paragraph or page is invented.

Frozen Oracle512MiB regression reproduces the legacy two-page layout and fails
before this guard, then passes16/16 after it. Full UAT/SRS conversion and complete
resolved-graph comparison pass2/2 on the final Core snapshot, with unchanged
target digests. The refreshed legacy fixture inventory honestly marks cases
without the conservative TOC proof as needing explicit reauthoring, rather than
reusing their earlier graph-only conversion acceptance. See external
`converter-review-toc-final/`, `full-parity-review-toc/` and
`fixture-migrate-review-toc/outputs/migration-plan.json`.

The rebuilt plugin `plugin-package6-final` contains50 files byte-identical to
the native13-tested package; only sourceCommit, inventory and the absolute
launch path metadata differ. `plugin-final-package-verification.json` supports
proof reuse; it is not described as a fresh native execution of the rebuild.

Runtime failure proof remains separate from the suite: real PostgreSQL terminal
writer termination after complete delivery passes both PDF/DOCX, preserves the
artifact hash and generation/delivery evidence, records FINALIZATION_FAILED,
does not replay a task and returns unused reservations.1800-item synthetic DOCX
is explicitly unsupported: a read-only child observer confirms
DOCX_OUTPUT_BUDGET_EXCEEDED (public LIMIT_EXCEEDED); PDF1800 succeeds. This is
neither a successful1800-DOCX output nor a failure of the full UAT/SRS Core/Word
acceptance. Storage-full/recovery is not yet accepted at this checkpoint.

### Final bounded candidate acceptance

The checkpoint above is superseded for disk-only recovery by
`model20-runtime-faults10-host-injector`:2/2 actual fault tests pass, with
independent file/XML/PDF verification in `runtime-faults-final-verification.json`.
PDF/DOCX64-record outputs preserve every ordered record before and after full
storage; actual ENOSPC/freeBytes0 gives health503 and both intakes503 without
FONT_CHECK_UNAVAILABLE or a new task. Removing only the owned filler restores
health200 and actual successful output on the same Service. Queue slots and
unused reservations return; retained files honestly remain charged held=used.
The actual post-delivery PostgreSQL writer-termination test also passes both
formats, with one generation job per task and no task replay. Worker512MiB/
swap0 and Service1GiB remain unchanged, no unexpected OOM, owned containers
stopped, private loop mount detached and original container identities stable.

Runs6–9 remain failed combined disk/cache-pressure experiments. Their filler
ran inside Service and charged loop-image page cache to its RAM scope;9 hit
memory.max without OOM. One snapshot observed WalSync, which is not proof of
the sole cause. Accepted10 places only the disk fault injector in the host
controller outside the Service cgroup, with exact private-path checks and
before/after memory.stat receipts. This does not certify recovery from combined
disk and memory pressure or make the earlier timeouts passes.

The one review's P1 is corrected by the executor's single fix pass:16/16
converter cases and full UAT/SRS graph parity2/2 pass in Oracle512MiB, target
source unchanged. The refreshed20-family historical inventory has18 ready and
2 conservative TOC refusals (`cell-repeats`, `contents`); the2 DOCX families
retain their separate earlier evidence. Their earlier graph-only acceptance
does not override the new refusal. Existing successful UAT/SRS target bundle
digests remain exactly unchanged, so their Core/package/Word evidence is reused.
No second independent review or reviewer approval of the fix is claimed.

T0–T8 close for isolated reviewable candidates with the explicit exclusions
above. This is not integration or production readiness. Deferred:1800-item
synthetic DOCX capacity, combined disk/RAM pressure recovery,3 historical
operator-harness cases, generalized checkpoint/facts/memory redesign and any
original-runtime migration or cleanup. No original data was accessed/changed;
no original service stopped; no merge, push, release or product installation.

## Authorized local candidate integration and version plan — 2026-11-05

Owner explicitly chose the complete Core/Service candidate set, not M1 alone.
Single-room work; execution IDs N/A. Owners: Core package, Service pin/runtime,
Project Control shared record and private plugin profile. Active roles: Planning
Partner, then owner implementation and Evidence Reviewer. Work size medium,
risk routine for reversible local Git/package promotion; model20 compatibility
break is explicit. Existing isolated worktrees are reused. No registered room
is reopened. Source bases: Core42008134, Servicedb15e9d, PCad64ea9. Integration
targets: Core codex/template-binding, Service codex/template-registry, PC main;
release branches/tags, installed plugins and original data/services forbidden.

1. Prepare Core0.6.0 (model20-only, R1 and M1) with lockfile and owner guides.
   Build/pack on the pinned Linux runtime using retained native resources;
   prove packed source/runtime identity and affected DOCX/PDF consumers within
   Oracle512MiB/worker. Reuse unchanged prior suite results only with exact
   source/dependency/configuration coverage; skips/exclusions remain explicit.
2. Prepare Service0.6.0 with the exact new archive, SHA/source manifest and
   lockfile. Historical migrations remain byte-identical, schema029 mandatory.
   Build and test the repinned consumer, including genuine PDF/DOCX API work
   against a newly owned lab PostgreSQL namespace. No original API/DB calls.
3. Align only the private model20 plugin profile with the new package identities
   and test its build/compatibility guards. Keep installed plugin and default
   prepared profile/snapshot intact.
4. Review changed metadata/guides and evidence coverage; commit after checks.
   Fast-forward the three clean development targets in Core→Service→PC order.
   Reuse verification after unchanged fast-forward. Retain lanes; cleanup is
   outside this request. No push/tag/release/install or runtime migration.

Proof budget: one bounded Linux package build, affected Core groups/packed
consumers, one repinned Service lab acceptance plus relevant ordinary tests,
plugin contract/build checks, manifest/reuse review and PC data/doc checks.
Document budget: extend this record and existing owner README/guides; no new
Work/registry/map/report prose. Evidence goes under
`C:/Users/nekot/Documents/FlowDoc-recovery/candidate-integration-060-20261105`.
Native Word/font fallback, general row/frame prediction and Module continuation
parity remain deferred, not PASS. Preserve M1/Menu and existing explicit
resource limits; no new rendering/layout repair is part of this integration.

### 0.6.0 local development acceptance — 2026-11-05

Owner confirmed full candidates twice; no release/install/push authorization.
Core0.6.0 source937bed1c0e0ad961bb1f04262624430e4b7392db includes model20-only,
R1 and M1. Service0.6.0 source458479bee31546b9337659d95dba50ef0d904f15 pins
`vendor/flowdoc-core-0.6.0.tgz`, SHA256
`145af7ff91416094e35ff9d283e350e6f86f7f7e2bb1707783591c877185e3fb`.
Its lockfile SHA512 is checked against the same bytes. All267 package files
produce tree digest `df69f433956a921ada4be8c42eb66df0d42df5fc84b9b3b777bce2da69a8897d`.
Private FlowDocMake0.4.0-candidate.1 profile, observed0.6.0 authoring contract and
candidate guide snapshot commitb5ce037 match this tuple; retained build is
`candidate-integration-060-20261105/plugin-candidate` under the evidence root's
parent. Default prepared profile/snapshot and installed plugin are unchanged.

Evidence in the round root above: `verification.json`, `core-identity.json`,
`reuse-verification.json`, `service-ordinary-acceptance.json`,
`retained-plugin-verification.json`, `git-before.json` and post-fast-forward
`integration-result.json`. Individual source packets, receipts, logs and failed
attempts remain in their named subdirectories; this prose is not a test result.

- Core: new offline Linux build/pack,73 affected tests and actual packed UAT/
  long80 consumers pass. All workers512MiB/swap0, no OOM; coordinator128MiB.
  Highest observed worker peak349573120bytes. New archive differs from the
  previously Word-reviewed M1 package only in package.json/README;265 runtime
  files match exactly. Scoped R1 and owner Word evidence is reused, not rerun
  or generalized. Full UAT uses the retained explicit maxXmlNodes300000 option;
  default Core XML/drawing/archive caps are unchanged. This is not proof that
  full UAT fits the default50000-node cap.
- Service: ordinary inventory159 files covers813pass/0fail/6conditional skips
  after the scoped lab-fixture correction below. Fresh real API8, real contract8
  and original six governor cases all pass against newly owned PostgreSQL labs.
  Worker512MiB/swap0 and original resource profiles remain unchanged. Actual
  delivered PDF/DOCX bytes match receipts; ZIP CRC and every XML/.rels part
  parse. Service runtime/tests/migrations are byte-identical to db15e9d; schema
  029 remains required,001–028 unchanged. These tests do not migrate old data.
- Plugin:6 identity/capability,2 isolated build and4 workflow protocol cases
  pass. Retained candidate inventory/bootstrap verifies the real267-file Core
  tree without starting its server or installing it. This is not a fresh
  whole native-plugin performance/Word acceptance run.
- Review: one fresh-context read-only package/pin/guide review finds no runtime
  packaging blocker; its P3 current-version guide references were corrected
  once and diff-reviewed. PC check:data and changed-area diff checks pass.

The first Core lab attempt stops before build on a retained-container name
collision; a new uniquely named round passes, no old container is removed.
The first complete ordinary Service run is retained as811pass/2fail/6skip.
Both failures are stdio clients correctly refusing a lab plugin still pinned
to0.5.2. Read-only old/new bootstrap comparison reproduces that refusal.
Replacing only the lab-plugin fixture with the reviewed0.6.0 profile gives
58/58 in all5 files that reference either plugin-root environment variable.
Acceptance keeps154 unchanged file results and replaces exactly those5 file
results, verifies product source/lock/pin identity, and verifies the only plugin
runtime-module difference is compatibility-profile.mjs. No product fix or
failed-to-PASS relabeling occurred. Initial workflow invocations missing their
explicit built-package prerequisite are not PASS; after providing the actual
built candidate,4/4 workflow cases pass.

Local integration targets are clean, ancestor-checked fast-forwards in
Core→Service→PC order. Core and Service targets now contain the accepted heads
above; this record/profile/guides are the PC fast-forward input. The final Git
postcondition is recorded in integration-result.json, including exact target
heads, unchanged release/tag/remote refs and clean state. Unchanged tested trees
reuse the passing evidence after fast-forward; no dependency installation or
second product build occurs in development checkouts.

Remaining:6 ordinary conditional skips retain their prior dispositions (native
counterparts separate;3 historical operator cases still unverified). Native
Word physical font fallback, general row/frame bounds and Module continuation
label parity remain deferred; M1/Menu is preserved and wordVerified stays false.
Combined disk/RAM recovery, synthetic1800 capacity and generalized memory-stage
redesign are not closed. All18 retained original DOCX/PDF hashes remain intact.
No original SQL/API/storage operation or service stop, no release branch/tag,
push, product installation, installed cache update, map promotion or cleanup.

## Core/Service0.6.0 release preparation — 2026-11-05

New owner scope: release the accepted Core/Service0.6.0 tuple, prepare update
instructions, and test FlowDocMake. Owner separately chose to retain FlowDocMake
as a tested candidate, not release it. No installation, existing-service stop
or original-data migration is authorized. Inline single-room, IDs N/A; roles
Planning Partner, owner documentation/package preparation, Evidence Reviewer.
Size medium, risk routine for versioned Git publication; model20 break and
schema029 are explicit, so no in-place legacy rewrite is proposed.

Allowed: Core README/template guide; Service README/usage, exact Core pin and
lock; private model20 plugin candidate metadata/guide pin; existing PC records.
Product source/runtime/migrations stay frozen. Reuse the just-accepted0.6.0
runtime and ordinary-suite evidence by exact hashes. A README change changes
the packed archive, so build a fresh immutable Core archive and repin Service
and private plugin together; never overwrite the earlier tested archive.

Acceptance/proof budget: owner-guide update/diff review; Linux package build
and packed consumer identity; real named-candidate native MCP context, tools,
draft/save/validation/preview/file download/task plus paired PDF/DOCX API and
diagnostics/reservation checks on fresh private Oracle lab PostgreSQL. Keep
512MiB/worker and client bundle, original Service aggregate budget and no
unexpected OOM. Inspect every newly produced PDF page in this bounded fixture
scope. Default installed FlowDocMake preflight returned SERVICE_UNREACHABLE;
do not restart it or treat a lab pass as installed/current-chat readiness.

After passing: commit/freeze exact source trees, preserve Git bundles and old
refs, create single-parent snapshots from each prior release tree, annotated
v0.6.0 tags, verify complete tagged ancestry/tree equality, atomic Git pushes
of corresponding development/release/tag refs and read back remote targets.
GitHub Release pages, npm/container publication and deployment are separate
and outside this Git-release scope. Private plugin stays candidate. Reuse
passing proof after unchanged fast-forward; no new broad feature/layout work.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/release-060-20261105`.
Document budget: extend these existing shared and owner guides only. Known
Word fallback/continuation/row bounds, default XML cap and historical test
exclusions remain visible; neither a tag nor a successful MCP fixture closes
them. Do not promote maps or create synthetic execution records.

### Published Core/Service0.6.0; FlowDocMake remains candidate — 2026-11-05

Status: PASS_CORE_SERVICE_060_GIT_PUBLISHED, scoped native MCP/PDF verification
PASS; no installation. Owner explicitly retained FlowDocMake as a candidate.

| Repository | Frozen development source | Release snapshot | Annotated tag |
| --- | --- | --- | --- |
| Core |c284498d33cd59f876037895d193828dbdc51163 |05818fe3e5ee7ec0d2520a51b7cf63de80b27bf5 |v0.6.0 |
| Service |1bdae8e416050ecf3c5480e2d2f81b6b6e4420ef |5ff91f49342275f0bd6daa8e47b62ff841ad1d39 |v0.6.0 |

Each snapshot tree equals its frozen development source and has one parent:
the prior release. All14 Core/15 Service release commits have annotated tags.
Default branch identities were read from GitHub, not guessed: Core
codex/template-binding, Service codex/template-registry, PC main. Development,
release and v0.6.0 tag refs were atomically pushed per repository and remote
tag objects/peeled commits read back; all earlier remote tags stayed unchanged.
Verified before-state Git bundles remain in release-060-20261105/git-backup.
GitHub Release pages, npm/container publication and deployment were not done.

Final Service pin is `vendor/flowdoc-core-0.6.0-release-c284498.tgz`, SHA256
`5e3e3ada2bfd5e65dd6774ff165756f198b217d466dea1b5d1a97291e973bc50`;
267-file package-tree digest is
`3b5b458411307506df422034a9f4693bfea01209905396d7a71aa6fd270b077f`.
The earlier0.6.0 integration archive is retained, not overwritten. Only packed
README bytes changed;265 runtime files match the accepted integrated package.
New Linux build/pack, public package contract and packed UAT/long80 consumers
pass within512MiB, no OOM. Prior scoped73 Core and159-file Service813pass/
6conditional-skip coverage is reused by runtime/source identity; skips,
3historical operator gaps and known layout concerns remain unresolved.

Service README and usage now contain the0.5.2→0.6.0 preparation steps: new20
namespace, offline conversion before import, backup/isolated restore, one
transaction covering pending migrations per invocation, schema029 refusal of
legacy data, required host broker/cgroup prerequisites and separate deployment
approval. Default disabled worker isolation is not a512MiB guarantee. No host
broker deployment or real migration was performed for this Git release.

Private FlowDocMake0.4.0-candidate.2 snapshot8cabe91 uses the exact final pin.
All6 actual native MCP/stdio cases pass in Oracle: ready:true from inspected
Docker/installed tree, tool/file client, model20 A–B–A draft/save/validate/
preview/download, nested workflow, PDF task, paired PDF/DOCX API diagnostics
and released queue reservations. Retired clone and DOCX MCP arguments are
refused before a new task. A deliberately missing optional image reports one
partial finding consistently in stream/lookup; paired API images are complete.
External client512MiB peak148312064bytes, document worker512MiB/swap0, Service
aggregate peak459853824bytes with unchanged1GiB budget; no unexpected OOM.
Private bridge/metadata relay is allowlisted to only the owned lab container;
neither client nor Service receives the Docker daemon socket.

All4 PDFs/8 logical pages checked with5 distinct110dpi page images; the3-page
workflow PDF is byte-identical to the preview, permitting exact visual reuse.
Header/footer/group labels, Thai/English text and paired image rectangles are
visible without observed clipping. DOCX CRC, all XML/.rels, text,987nodes,
2drawings/2images and actual receipt hashes pass. No new Word rendering or
arbitrary document/source-authoring fidelity is claimed. Original container
identities remain unchanged; no owned workers/client/network stay running.

Evidence: release-060-20261105/{release-verification.json,
native-structural-verification.json,visual-review.json,pdf-review/inventory.json,
git-preflight.json,prepared-snapshots.json,publication-result.json}; final
postcondition is final-result.json. A fresh-context read-only release review
finds no actionable metadata/package/update-guide issue. Installed/current-chat
FlowDocMake separately reported SERVICE_UNREACHABLE; it was not restarted or
reconfigured. A successful named-candidate lab preflight does not change that.
FlowDocMake release/flowdocmake and flowdocmake-v0.3.1 remain unchanged; no
flowdocmake-v0.4.0 tag, installed-cache change, original data/service operation,
release artifact replacement, cleanup or map promotion occurred.

### Owner-requested withdrawal — 2026-11-05

Single-room inline status correction; execution/Phase/Checklist IDs N/A.
The owner requested withdrawal after clarifying that publication requires the
intended actual-use test to pass. Current installed FlowDocMake reported
SERVICE_UNREACHABLE; that is a failed current-environment prerequisite, not
evidence that the previously passing isolated lab tests failed.

Core `release` is restored from 05818fe to v0.5.2 commit55315ca;
Service `release` is restored from 5ff91f4 to v0.5.2 commit25e912f.
Both local and origin v0.6.0 tags are removed using exact-ref guards; every
other origin tag is unchanged. Development code remains intact with withdrawal
notices in Core commit258ab50 and Service commit8540206. Candidate branches,
package archives, pins and earlier publication evidence are retained unchanged.

Evidence root: `C:/Users/nekot/Documents/FlowDoc-recovery/withdraw-060-20261105`.
`before.json` records original refs and SHA-256 hashes of verified full Git
bundles in `git-backup/`; `result.json` records verified withdrawal postconditions.
The earlier release-060-20261105 evidence remains immutable historical evidence.
Product checks: documentation-only diffs and diff whitespace checks; no product
runtime behavior changed or runtime retest claimed. Project Control data and
documentation checks cover the status correction separately.

FlowDocMake remains candidate-only; release/flowdocmake and flowdocmake-v0.3.1
are unchanged. No DB, installed files, runtime configuration or service lifecycle
was touched. Future publication requires an owner-agreed actual-use acceptance
scope and passing results; do not automatically republish the withdrawn version.
