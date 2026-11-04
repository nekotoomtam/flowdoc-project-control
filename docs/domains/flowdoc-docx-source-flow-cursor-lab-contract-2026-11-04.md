# DOCX source flow cursor contract — MR1 lab proposal

## Authority Boundary

Owner: Project Control; product owner of any eventual private adapter: Core.
Status: proposed private contract, with a bounded lab validation record below.
This document does not define an implemented public Core/Service API, grant
product edits, establish native Word pagination, or promote a system map.
Governing work: the MR1 section of
`flowdoc-docx1800-budget-diagnosis-plan-2026-11-03.md`.

Owner scope: define remaining-page facts including preceding text/tables, test
on copies in Oracle512MiB, preserve M1/Menu, no Core/Service edits/integration.
Role: Planning Partner/Evidence Reviewer, Project Control Steward for prose;
inline execution IDs not applicable. Proof budget: one isolated contract-replay
worker and independent read-only verification; no renderer or package rebuild.
The reproduced correctness failures below justified one corrective lab rerun
beyond that initial budget; no broader/native suite was added.
Document budget: this reusable contract plus a pointer/result in the existing
plan. This is a discovery spike, not an implementation authorization.

## Decision and alternatives

Use ordered source footprints plus an accounting cursor derived by replay.
Do not accept an externally supplied current Y, remaining-height number or page
cut: such hints omit preceding blocks and can recreate the old-PDF dependency.
Do not reuse PDF renderer page positions as native Word facts. A renderer-neutral
private source adapter may reuse owned metrics, but must state their confidence.

The cursor is derived state; the logical document and its bound source map remain
truth. Source identity/flow order, measurement, page-frame policy and accounting
are separate responsibilities. Valid wire shape alone does not prove genuine
Core provenance or Word correctness.

## Current implementation anchors

At Core42008134 (read-only):

- `src/composition/resolvedDocument.ts`: `sections[].rootIds`, `nodes`,
  `sourceMap`, `formatInstances` and `endingArea` own logical flow/identity.
  `SourceEntry` carries sourceId, section/origin, group/index/member/repeat/area
  fields. Read those fields; never infer ownership by splitting an encoded ID.
- `src/docx/sections.ts`: section/band policies already derive first/continuation
  capacities, but mark them estimated/wordFootprintVerified=false. They cannot
  become exact native footprints merely by renaming a field.
- `src/docx/tables.ts:202`: `buildBodyFlow` emits roots in order, omits selected
  roots, coalesces pending authored breaks and adds structural paragraphs between
  tables. It does not expose a per-page consumed-height cursor. Those generated
  structural items must be included by an adapter, not silently skipped.
- `src/docx/source-layout.ts`: intent-owned SourceGuide lines/metrics can supply
  some text facts. `customXml/flowdoc-paragraphs.xml` retains partial paragraph/
  line provenance, not full body flow and not a complete Core checkpoint.

## Version, ownership and numeric representation

Proposed family: `flowdoc-source-flow/1`. The executable lab subset is
`flowdoc-source-flow-prefix/1`; it validates accounting before a target block.
It must not be advertised as the full production adapter or pagination engine.

Producer: a future adapter over a genuine immutable Core ExportIntent and bound
resources. Consumer: a private cursor/planner, never caller-supplied HTTP facts.
Lab fixtures must declare `lab-synthetic`; real source inventories are evidence
of available/missing fields, not manufactured production facts.

Snapshot identity binds logical-document/source-map/style/font/resource digests,
measurement revision, geometry policy revision and source order. A digest checks
staleness/consistency; it does not authenticate a producer. Cross-process trust
or transport is outside this contract and cannot rely on an `origin` string.
The trusted producer manifest supplies the ordered source registry and a digest
of measurement/frame facts separately from the replay payload. Both must match;
changing an advance while retaining an old document hash is not valid reuse.

Canonical quantities use nonnegative integer micro-points (`1pt=1000000`),
with `[lo,hi]` bounds. Convert units once; round lower bounds down and upper
bounds up. Positions/ink may use signed coordinates, but charged flow advances
cannot be negative. Do not repeatedly round to twips while accumulating blocks.
Word/device rounding equivalence is a separate proof requirement.

Extent confidence is `exact-source`, `bounded-source`, `estimated` or `unknown`.
`exact-source` describes source arithmetic, not native Word measurement.
Unknown/estimated bounds cannot silently be treated as exact for a safe plan.
A lab model verdict remains lab-only even when its synthetic intervals are exact.

## Source facts

Each logical block has an immutable source reference: sectionId, nodeId,
sourceId, origin, scope and applicable area/group/member/repeat identity. Group
identities include tableId + groupId + groupIndex; a repeated label remains
generated display tied to one source label, not a new business node.

Generated structural items need a separate derived-reference variant: owning
source block(s), structural role, measurement recipe revision and deterministic
ordinal. A between-table paragraph has no invented business SourceEntry. Replay
must include its footprint while logical-source coverage still counts each
business block once. The current lab-synthetic reference subset does not
implement this genuine-Core reference union; that remains an adapter prerequisite.

Text facts bind text/style/font digests, source UTF-16 spans, cluster-safe line
boundaries, line advances, paragraph spacing, keeps and break eligibility.
Line ranges must be ordered, gap-free and unique for the accounted source span.
Empty paragraphs and fixed spacers are real blocks. Native content-height text,
TOC/page fields, unresolved images, floating wraps or unknown metrics must report
a missing/unsupported footprint rather than be given zero height.

Table facts bind columns, header/member/total row IDs and order, cell spans,
row advances, keeps and break rules. Source row groups, label source/continuation
extents and source-map lineage are mandatory before planning fragments. Header
and total rows are explicit source roles, not guessed from displayed text.
Whole rows are the initial capability; tall rows/intra-row splits need a
separate source-line ownership contract and cannot silently lose a label.

Footprint advance is NOT an ink bounding box. The source adapter must account
for native margins, borders, structural/terminal paragraphs and M1's physical
top + once-per-visible-label paragraph offset. Keep Menu word-box XML unchanged;
do not remeasure/rasterize its text to force a cursor fit.

## Page frame and remaining capacity

Frame facts bind section and first/continuation/even page class, page dimensions,
resolved margins, header/footer visibility and reserved envelopes. Header/footer
inside an existing margin is not charged a second time:

`bodyTop=max(topMargin, headerReservedBottom)`

`bodyBottom=min(pageHeight-bottomMargin, footerReservedTop)`

Use upper bodyTop and lower bodyBottom for safe capacity. Apply owned gaps inside
the reserved envelope once. Reject inverted/empty bands or unresolved intrusions.
Nonrectangular flow/columns/floating wraps and continuous section transitions
are unsupported in the initial subset. New-page section transitions require
explicit source ordering and reset the section page class, not the document ID.

Cursor output binds snapshot/revisions, section, document/section page ordinals,
page class, frame identity, next source block/line/row, consumed `[lo,hi]`, pending
spacing/reservations and replay-ledger digest. It is never a user-supplied start Y.

`remainingRawSafe = capacity.lo - committedAdvance.hi`

`remainingForNextContentSafe = remainingRawSafe - resolvedNextBoundaryGap.hi - disjointReservations.hi`

The prefix cursor's `remainingSafe` field means remainingForNextContentSafe;
its nextGap is tentative boundary cost, not already committed source advance.
The producer/consumer must not also subtract pendingAfter as a separate charge.

Replay all preceding visible roots in source order, including emitted structural
items. Omitted roots need an explicit owner decision/reason. Resume requires the
same snapshot/revisions and a replay-equivalent checkpoint; tampering, reordered,
missing or duplicate blocks invalidate it. Source progress is monotonic even for
zero-height blocks; a no-fit block cannot generate an unbounded empty-page loop.
Track page logical-root progress separately from consumed height: an authored
break after a zero-height root is still effective, and zero height alone must
not re-enable first-root spacing suppression for the next block.

## Spacing, tables and reservations

The adapter owns boundary spacing semantics. The prefix subset supports declared
additive or max-adjacent paragraph spacing, with explicit page-top suppression.
Unsupported contextual/auto spacing or keeps require source resolution; do not
assume Word simply adds every before/after value. Trailing spacing is pending
until the next boundary or terminal policy resolves it.

Preceding whole-fit paragraphs/tables consume their footprints and spacing.
An indivisible block may move as a whole to the next valid frame. If a preceding
paragraph/table requires splitting, a source-owned line/row planner must first
provide a validated transition ledger; the prefix subset stops with
`NEEDS_FRAGMENT_PLANNER`. It must not report remaining height past an unresolved
split. Keep-next/widow/orphan chains are atomic until the adapter supplies their
resolved break facts; the initial subset rejects unresolved chains.

For a table fragment, charge repeated header and separator once per actual
fragment. Charge total rows once at their logical location, with explicit
affinity to retained members. A tentative total reservation is released/committed
atomically; it cannot also remain deducted after the total is charged.

A merged Module label shares its member-row area. Check
`sum(memberRowAdvances).lo >= labelExtent.hi`; do not add label height to the
same rows a second time. With preserve-row-extents policy, insufficient space
requires rebalancing/unsupported output, not silent row growth. M1 inset is once
per visible source/continuation label; new groups never get a continuation suffix
just because they start on a later page.

## Verdicts and safety boundary

For a candidate advance, all upper bounds fitting yields a model-safe fit;
lower bounds exceeding capacity yields a definite no-fit. A straddling interval
is `NEEDS_SOURCE_FACTS`, not permission to claim an exact page break.

The lab subset returns `LAB_VALID`, `NEEDS_SOURCE_FACTS`,
`NEEDS_FRAGMENT_PLANNER`, `UNSUPPORTED_LAYOUT`, `NO_FIT`, `INVALID_CONTRACT` or
`STALE_SOURCE`. `LAB_VALID` proves only schema/accounting on supplied fixtures,
never Word rendering, a complete source adapter or public API readiness.
Unknown fields, PDF/page-cut hints, stale digests/revisions, source ID/flow-order
mismatch, invalid bounds and duplicate charges are rejected.

Cancellation invalidates uncommitted output; checkpoint publication is atomic
with its ledger. The cursor retains small identity/extent facts, not a second
glyph/ZIP/PDF working set. Worker limit512MiB stays unchanged. No new Service
behavior, runtime implementation or Core mutation is authorized by this proposal.
Existing Core input/cardinality/resource limits remain authoritative. The lab
validator over bounded trusted fixtures does not prove hostile-input exhaustion
safety or implement cancellation/transport publication.

## Bounded lab evidence

Artifact root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-flow-contract-20261104`.
Final `run2/` contains `prefix.schema.json`, `cases.json`, `validator.py`,
`build.py`, `make-fixtures.py`, packet/source hashes, `verify-local.py` and
`verification-local.json`. Receipt is `run2/oracle/receipt.json`; worker outputs
`verification.json`, `prefix-example-cursor.json` and `real-source-inventory.json`
are under `run2/oracle/outputs/`. No DOCX output was created.

Schema SHA256:
`97f58429ca64caa5cc53c4768d2774b41fe6392fa3eced8f1408baa08f5fa188`.
The schema is a strict JSON Schema description; executable validation uses a
checked, limited keyword subset implemented without installing dependencies.
Independent review confirmed every keyword used by this schema is supported.
This is not a claim of a general JSON Schema implementation.

Final Oracle run:44 explicit synthetic cases matched their expected acceptance
or rejection;6 checkpoint checks covered JSON round-trip, tampered remaining/
consumption/source position/ledger digest and stale source. An isolated total
escrow probe retained the same remaining budget before/after commitment and
rejected duplicate commitment. It does not prove a full reservation transaction
or renderer cancellation implementation.

Coverage includes preceding text and whole-fit tables, additive/max spacing,
page-top suppression, frame intrusion without double-charging margins, first/
continuation and new-page section accounting, whole-block movement, bounds,
missing/split/unsupported facts, source order/identity and stale measurements.
Merged label overlays are checked against member extents rather than summed
again. Continuous sections, floating wraps and unresolved keeps/splits reject.
All cases declare `lab-synthetic`; none is a native Word layout observation.

Example:644.9pt capacity minus34.6pt text,6pt resolved boundary,199.1pt prior
table and3pt next boundary leaves402.2pt before the target. The cursor retains
239.7pt committed advance and2pt pending trailing spacing; the next max-adjacent
gap is3pt, so the pending2pt is not charged again. Independent dimensional
arithmetic confirmed this result without calling the reducer.

Initial42-case run passed, but review found two real lab-reducer counterexamples:
geometric zero was incorrectly used as a proxy for absence of a logical root,
dropping an authored break and next-block spacing. `review-counterexamples.json`
retains expected/actual failures. Run2 tracks logical-root progress separately;
both added cases pass. Initial code/results remain superseded, not erased.
No product defect/fix is inferred from this prototype correction.

Oracle worker512MiB/swap0, coordinator128MiB: exit0, OOMKilled=false,
oom_kill0, peak61599744bytes (58.746MiB). Inputs/source code copies unchanged;
original three container identities/start/restart counts unchanged; no owned
worker running. The M1 UAT DOCX stays byte-identical with SHA256
`32f3fb82a0be71d0ea707e8bf3483ee2759e4210bacab11dfe72394bf6f85f91`.
No PDF, renderer, SQL, original data/service change, merge/push/release/install.

Read-only UAT inventory found95native tables and58mapped source paragraphs /
63mapped lines. The custom map supplies node/tag/text/span references, but not
complete section/root order, source tuples, all preceding extents or resolved
band/split transitions. These data exist in different Core owners; this inventory
does not prove they have been exported as genuine cursor facts. Result is
`NEEDS_SOURCE_FACTS_REAL_UAT_ADAPTER_NOT_IMPLEMENTED`.

Bounded status: `PASS_PROPOSED_CONTRACT_LAB_ONLY`. The proposal and accounting
subset are ready to review; genuine Core adapter/ref-union implementation,
native UAT preceding-flow, actual section/band footprints, row/line splitting,
Word fit equivalence and full MR1 acceptance remain open. Core/Service product
files and runtime behavior were not changed.

## Genuine Core read-adapter proof — 2026-11-04

Owner next authorized a read-only adapter on copies, preserving M1/Menu. The
bounded proof used one genuine UAT generation in Oracle512MiB/swap0, with the
coordinator separately limited to128MiB. No product implementation or package
rebuild. This extends the earlier synthetic contract evidence; the earlier
statement that no genuine adapter had been proven is historical. The prefix
schema still accepts only its declared synthetic fixtures: this real-source
projection was not mislabeled as `lab-synthetic` or a complete wire schema.

Artifact root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-core-read-adapter-20261104`.
Inputs: `expected-core-src.json`, `read-adapter.mjs`, `worker.mjs`, `remote.py`,
`run.py` and `packet.json`. Outputs: `oracle/receipt.json`,
`oracle/outputs/read-adapter-facts.json`, `read-adapter-summary.json`,
`result.json`, `result.docx` and cgroup records. Independent checks:
`verify-local.py` and `verification-local.json`. The scripts and raw receipts,
not this prose alone, support these claims.

The adapter observes the actual branded ExportIntent and actual `buildSections`
result at the writer's pre-package boundary, using a one-shot in-process Node
inspector breakpoint. It does not patch Core code or package files. All267
compiled package files remain identical to the tested M1 archive;127tracked
source files match current Core42008134. The private Core brand rejects a
shallow forged intent. Eight in-worker checks cover genuine registry reading,
forged intent rejection, altered source/order/missing/duplicate root rejection,
stale-style snapshot rejection and before/after source/measurement equality.
Registry/snapshot rejection checks are lab-adapter validation, not new Core API
guarantees. No caller HTTP fact or PDF/page-cut input is accepted by this proof.

Actual snapshot sourceDigest:
`9c4c27b2bcc39bb01e88ed3b3e8bce6c2e4b0c3cb737908907eb2e47c906c968`.
Read facts:1section,179ordered roots,3315source-map entries,95table roots,
4grouped tables,58applied source guides and63lines. All179roots have one source
action;54derived between-table references retain both source owners and match
the real emitter's separator count. Actual SourceEntry tuples are copied,
not decoded from names. Source UTF16 spans/tags/text hashes and line counts
match the emitted custom map. The projection retains compact line/font facts,
not a second glyph or ZIP graph.

Native M1 receipts include three merged labels with480twips source top mapped
to160twips physical top plus320twips first-label offset once (8pt+16pt).
The single-member group correctly remains480+0 under `retain-native`.
This checks actual selected policy and content preservation, not a fresh Word
render or a new native continuation-label implementation.

Worker exit0, OOMKilled=false, oom_kill0, peak349970432bytes (333.758MiB),
generation+observation6996.186ms. One generation only; no OOM or retry.
The initial remote comparator remains FAIL because it allowed only timestamp
differences and correctly stopped on changed embedded-font parts. Independent
review of the pinned docx obfuscation implementation and package relationships
decoded both fonts: complete font bytes match baseline and observed Core style
resource SHA256s. Only their per-generation GUID keys and first32obfuscated
bytes differ. Do not rewrite the original failed receipt as PASS.

Independent20checks pass, including parsing all26XML/.rels parts. Of171package
entries,167are byte-identical, including document.xml, styles, source map,
headers/footers and Menu textbox markup. The four reviewed differences are
created/modified timestamps in core.xml, GUIDs in fontTable.xml and the two
obfuscated font parts. Thus M1 content/geometry/decoded fonts are preserved,
but whole-file byte equality is NOT claimed. New DOCX SHA256:
`6b1c06cabab2020427cf2af58ce8b7d3bf610fd97b94e0bd7816f46b3d3de8d5`.
No fresh Word/PDF export or native page-count assertion was made.

Remaining gaps are explicit, with `remainingSafe:null` and
`fullCursorStatus:NEEDS_SOURCE_FACTS`: complete preceding-root advances and
spacing/keeps; automatic native row advances and explicit total-row roles;
bounded first/continuation band footprints; special ending/TOC/scope and split
transitions. Source line frames alone are not complete native flow advances.
Core capacities remain estimated/wordFootprintVerified=false. Unclassified
rows are not guessed to be totals from text or last-row position. This proof
does not establish transport authentication, cancellation or all-document
adapter coverage.

Status: `PASS_GENUINE_READ_ADAPTER_WITH_CURSOR_GAPS`. Next bounded discovery
should project preceding paragraph/table boundary facts and classify unsupported
native automatic-height cases before attempting cursor replay. Full MR1 and
product adapter implementation remain open. Core/Service heads42008134/db15e9d
stay clean. Source/package/harness/baseline hashes and original three container
identities/start/restart counts unchanged; no owned worker left running.
No SQL, original data/service change, Core/Service edit, merge/push/release/
install, or map promotion.

## Genuine row and inter-content constraints — 2026-11-04

Owner authorized the next copy-only Oracle512MiB proof of row heights and
inter-content spacing, preserving M1/Menu. Scope: one genuine UAT generation,
read-only inspector observation plus source-to-output XML comparison. Product
owner Core; inline Evidence Reviewer/Project Control Steward; execution IDs N/A.
Reuse this contract and the existing plan. This is discovery of available and
missing height facts, not authorization to alter automatic native layout.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-row-boundary-proof-20261104`.
`row-adapter.mjs` extends the unchanged prior lab observer, reading text/source
properties, effective styles, actual baseline decisions and the cached Core
reading plan. `oracle/outputs/row-boundary-source.json` is the genuine snapshot;
`read-adapter-facts.json` retains source order and selected cell-space policies.
`oracle/receipt.json`, cgroup records and `result.docx` retain the runtime proof.
`verify-base.py`/`verification-base.json` and
`verify-rows.py`/`verification-rows.json` are independent output checks.
`artifact-hashes.json` binds scripts and raw results. No Core source/package
patch, new shaping pass, resource installation or SQL is involved.

Confirmed implementation and emitted constraints:

- `tables.ts:196` constructs TableRow without a height option. All181source
  rows have only `allowBreak`; all181native rows lack `w:trHeight`. Their
  cantSplit/header-repeat flags match source policy. Native automatic row
  height is therefore unresolved, not zero or a source-specified exact value.
- 95source tables map in actual emission order to95body tables and181rows.
  Occupancy/column spans and restart/continue merges map522logical cells to
  526physical cells, including4continuations. All2104emitted margin attributes
  match the actual Core cell-space receipts.
- 511ordinary cell text paragraphs match actual style line budgets, AtLeast
  policy and per-child before/after offsets. The13guided table line frames
  match their emitted outer Exact frames. Across716cell flow paragraphs,
  699are AtLeast (including image paragraphs),13guided frames are Exact and
  4continuation-cell structural paragraphs are Exact20twips. Inner textbox
  paragraphs are excluded from flow accounting. AtLeast is a minimum line
  setting, not a measured line count or row height.75of594source body text
  blocks contain authored newlines; a paragraph cannot be assumed one line.
- 713outer cell paragraphs have before0 and3have before320twips; all716have
  after0. The three M1 merged labels keep160twips physical top plus320twips
  first-label offset (8pt+16pt) once, rather than per member row. This does not
  turn a merged-label overlay into a separate row charge.
- `tables.ts:50,247` emits54owned between-table structural paragraphs. Actual
  XML for each has Exact20twips (1pt), before0/after0 and no text/image/box.
  The1080twip declared-line sum is not a claim of54pt native page consumption:
  breaks, keeps and page transitions must still be resolved.
- Nine other table-paragraph-table adjacencies are authored source content,
  not those structural separators:5headings with AtLeast560twips,1page break
  and3rules. The rules' before/after settings match source via `bands.ts:15`:
  6pt/5pt,155pt/0 and142pt/0. The large authored gaps must not be erased,
  normalized to1pt or counted twice. This is fixture content, not a confirmed
  Core defect. Full preceding-flow transitions remain outside this comparison.

Initial local verifier incorrectly assumed every table-paragraph-table
adjacency was a generated separator. It failed on authored source content.
`verify-rows-initial.py` is retained; the final verifier requires the genuine
source program and both table owner IDs. It preserves and checks all9authored
cases separately. Only local read-only verification was corrected; no worker
retry, source change or generated DOCX rewrite occurred.

Runtime: worker512MiB/swap0, coordinator128MiB, one generation; exit0,
OOMKilled=false/oom_kill0, peak384368640bytes (366.5625MiB),7033.290ms.
Eight inherited in-worker checks pass. Independent20base checks and11row/
boundary checks pass; these are constraint/provenance checks, not31native
height/layout tests. All26XML/.rels parts parse. The167unchanged package parts
include M1 geometry/Menu textbox/source-map markup; the other4parts differ only
in timestamps and font obfuscation GUIDs/first32bytes, with full decoded font
bytes identical. No fresh Word export or native page/clipping claim.

Verdict: `PASS_SOURCE_ROW_AND_BOUNDARY_CONSTRAINTS_NATIVE_HEIGHT_UNKNOWN`.
This proves selected spacing/line/merge constraints can be read from Core and
matched to output. It does NOT prove exact row advances or a finite native row
upper bound. Wrapping, image/box footprint, cell/merged-row interactions and
split/keep transitions must be bounded before summing a cursor. Source reading
measurements used for selected relationships are not a complete per-row native
height contract. `remainingSafe:null` and unknown row bounds remain; MR1 stays
open. Next design/proof should define a complete row footprint over source
line/image/merge facts with explicit unsupported cases before cursor replay.

Core42008134/Servicedb15e9d remain clean;127source/267package files, harness,
baseline and original3container identities/start/restart counts unchanged.
No owned worker running. No original data/service changes, Core/Service edit,
merge/push/release/install or map promotion.

## Proposed row footprint and page-transition contract — 2026-11-04

Owner authorized contract definition and bounded copy-only Oracle512MiB checks,
not a Core/Service change. Role Planning Partner/Evidence Reviewer, Project
Control Steward for this canonical prose; inline IDs N/A. Proof budget one
synthetic checker worker plus independent evidence review; one corrective run
was justified by the test-harness JSON comparison failure recorded below.
Document budget: extend this contract and add a pointer to the existing plan.

Proposed private sub-contract: `flowdoc-row-footprint/1`. Keep the existing
snapshot/source-reference/confidence/units rules above. Choose explicit source
constraints and certified row allocations over forcing fixed native row heights
or guessing from default AtLeast values. A renderer-only native measurement
could verify examples, but does not replace the required source-owned facts.
This choice preserves M1 and Menu while making missing facts visible.

### Required fact ownership

| Fact | Required meaning and binding |
| --- | --- |
| Snapshot | Genuine intent source digest, source-map/order/style/font/image digests, metric/wrap/geometry revisions and actual selected native widths/insets. Producer trust comes from the private intent boundary, never an origin string or digest alone. |
| Row reference | Section/table/source row ID and ordinal, explicit header/member/total role, allowBreak, keep edges and member/group identity. Do not infer totals from text or final-row position. |
| Cell reference | Anchor row/column, rowSpan/colSpan and covered grid slots; source child order; physical-cell continuation references share the same logical owner. Validate occupancy, not just index/count. |
| Text plan | Text/style/font hashes, source UTF16/cluster-safe line ranges and stable line IDs, usable width, line frames/flow advances and boundary policy. Ranges cover the owned span once; preserve empty text/paragraphs and authored newlines. |
| Image/object | Resource/geometry hashes, inline/floating/overlay mode, anchor/flow owner, aspect/crop and complete advance including carrier/baseline/clearance. Authored image height alone is insufficient. |
| Insets/strokes | Final Core-selected top/bottom and paragraph offsets, owned border/terminal/structural terms and geometry recipe. Each term has one charge owner. Use net selected margins; do not re-add an already compensated stroke. |
| Row allocation | A measured/bounded advance interval per physical source row, allocation recipe/proof revision and constraints it satisfies. It must be valid for the native profile; a proposed number is not proof Word will use it. |
| Fragment transition | Source row/line ranges, frame/page class, repeated-header/label occurrences, split/keep/total rules, spacing ledger and next cursor. Never accept prior PDF cuts or caller remaining-height hints. |

All advances use nonnegative integer micro-points with outward-rounded bounds.
`exact-source` and `bounded-source` describe source evidence, not native Word
equivalence. Estimated/unknown native footprints cannot certify fit. A complete
safe row upper bound needs both complete source coverage and a bounded mapping
to the selected native profile; otherwise the native interval stays unknown.

### Cell and row composition

For each cell, resolve its ordered child stack: every text line's flow frame,
inline object advance and resolved inter-paragraph gap. Gaps must already state
additive/max-adjacent/contextual/page-top treatment; raw before/after values
cannot simply be added. Then include selected physical insets and disjoint
owned geometry terms once. Empty cells retain their emitted structural line.
Separate painted ink, paragraph advance and row advance throughout.

For a nonspanning cell, its required interval constrains one row. The natural
source row requirement is the maximum across cells, not their sum. This is a
source constraint, not automatic proof of a native Word row height. Wrapping
must be resolved at the actual colspan width after selected insets; a single
paragraph may occupy multiple lines. Unknown wrapping yields unknown advance,
not `style.line * 1`. Fixed/Exact line frames also need explicit overflow policy.

An inline image contributes its complete carrier-inclusive advance once.
Unknown image decode/resize/aspect/carrier facts stop planning. Floating wraps
need a separate flow-interaction recipe and are unsupported initially. Menu's
VML word boxes remain overlays of their owned outer source line: do not sum
their inner paragraph/box heights as extra flow. Their ink/overflow envelope
must fit the permitted line/cell region or return NEEDS_SOURCE_FACTS; this
contract does not permit changing/removing the textbox to force a fit.

For a cell spanning rows i..j, retain a span constraint rather than distribute
its height equally or charge it in every row. With preserve-row-extents:

`sum(allocatedRowAdvance[k].lo, k=i..j) >= spanningCellRequired.hi`

Also require each allocated row's lower bound to cover all its nonspanning
cell upper bounds. A span total alone does not prove each member row fits.
Multiple overlapping merge constraints must hold simultaneously. Without a
source-owned valid allocation/proof, return NEEDS_ROW_ALLOCATION. Feasible
arithmetic allocations are not automatically native measurements. Missing row
facts cannot be filled by dividing label height or treating continuation cells
as independent label content.

M1 keeps the selected8pt physical top plus16pt first-label offset once for each
eligible visible label occurrence; include these in that label's span constraint.
The single-member retain-native case remains unchanged. Check the label against
its member rows without adding its height again to the table. Do not silently
grow/rebalance rows when a label does not fit. A future continuation occurrence
must separately measure its label+suffix and bind its offset policy; a new
source group beginning later is not a continuation.

### Whole-row admission and page transitions

Receive current/fresh capacity only from a valid source-flow cursor and bounded
first/continuation frame, after preceding text/tables. Form a keep closure over
affected row/paragraph/group/total edges before deciding a cut. cantSplit is a
break restriction, not a height measurement. The initial capability is whole
rows/keep groups; no guessed intra-row split is allowed.

Charge per actual fragment: repeated header rows once, resolved next-boundary
gap once, member rows once and disjoint reservations once. Header IDs/roles are
explicit, excluded from the member-row sum if already charged as occurrences.
Totals commit at their source location; release a tentative reservation in the
same transition so it is not both reserved and consumed. Structural/terminal
paragraphs need derived ownership. Authored rules/spacers remain source content,
including the observed155pt/142pt gaps; do not normalize them to1pt separators.

Let C be the complete fragment cost interval and R the remaining frame interval:

- If C.hi <= R.lo, the supplied model is a safe fit, conditional on the native
  evidence/profile. `LAB_FIT_CURRENT` is never a Word-verification claim.
- If C.lo <= R.hi but the upper bound does not fit, return NEEDS_SOURCE_FACTS.
  Do not pick a page cut from overlapping intervals.
- If it definitely does not fit current space and its complete upper bound fits
  a valid fresh frame, move the whole row/keep closure. Re-resolve boundary,
  first/continuation header and label facts for that frame; do not reuse a stale
  current-page cost when those differ.
- If even the row lower bound exceeds fresh capacity, an unsplittable row is
  TALL_ROW_UNSUPPORTED. allowBreak=true only authorizes considering a split;
  it does not supply the missing fragment plan. Multiple ordinary rows may
  instead require a whole-row fragment planner, not an intra-row split.

A future intra-row fragment plan must partition every cell's source lines into
ordered, gap-free, cluster-safe ranges. Images/atomic objects cannot be split
without an explicit supported recipe. For every fragment prove header/total/
keep constraints, per-fragment merge allocation, label+continuation suffix fit,
M1 insets and any retained structural cell paragraph. Record first/last-member
ownership and merge restart/continue materialization. Reject a cut that loses,
duplicates or clips source content; do not emit a partial success.

Break/continuation outputs atomically publish the consumption ledger and next
row/line cursor against the same snapshot/revisions. Cancellation discards an
uncommitted transition; resume must match its ledger and make source progress.
An empty fresh page with no feasible row must terminate with a bounded failure,
not loop. Native split rendering, cancellation and checkpoint implementation
remain separate unproven work; no product implementation is authorized here.

### Bounded contract evidence and open prerequisites

Artifact root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-row-contract-20261104`.
Final inputs/results are under `run2/`: `row_contract.py`, `cases.json`,
`build.py`, `packet.json`, `correction.json`, `oracle/receipt.json` and
`oracle/outputs/verification.json`/`real-gap.json`. Independent review:
`verify-local.py`, `verification-local.json` and `artifact-hashes.json` at the
artifact root. Canonical contract prose does not replace these executable facts.

The executable subset is `flowdoc-row-footprint-lab/1`, accepting only explicitly
synthetic facts; a forged Core origin is rejected. It is a bounded trusted-fixture
checker, not a general JSON Schema engine, hostile-input validator or genuine
producer implementation. Top-level/part unknown fields and caller/PDF fit hints
are rejected. The full source/grid/role/image provenance contract above is not
implemented by this subset; declared source/native certification is not forged
by supplying lab numbers.

Oracle final45cases matched expected verdicts and available hand-calculated
extents. Coverage: resolved wrapped lines, cell maximum rather than sum, resolved
paragraph gap, carrier-inclusive image, Menu line overlay, owned border term,
merged-label allocation/once-only M1 offset and insufficient member/span cases;
whole-fit/move, uncertainty, tall row and missing fragment planner; repeated
header/boundary/total reservation charges; stale source, unknown/estimated or
invalid bounds, bad span coverage/cluster cuts, duplicate owners/reservations,
unbounded boxes/images/floats and caller hints.

Independent examples: three10pt lines+4pt+4pt padding=38pt; max(18pt,28pt)=28pt,
not46pt;10pt text+21pt carrier-inclusive image+8pt padding=39pt. Synthetic
22pt+22pt member rows cover an8pt+16pt+20pt merged label once; do not charge
another44pt. Header5pt+boundary1pt+row18pt=24pt cannot fit23pt current space and
moves when a valid fresh frame permits. These are model examples, not measurements
of actual UAT rows or evidence of Word-equivalent image/box/border behavior.

The subset treats one row/keep group atomically, using supplied model capacity
and the same aggregate overhead policy on current/fresh pages. Differing actual
page-class headers/labels/gaps require a new fragment cost and remain outside
the executable subset. It returns NEEDS_FRAGMENT_PLANNER instead of selecting
whole-row/intra-row cuts. Native pagination, continuation materialization,
cross-process producer authentication, cancellation and atomic checkpoint
publication are specified prerequisites, not implemented/tested product behavior.

Initial worker failed in the test harness because Python interval tuples were
compared directly to expected JSON arrays; numeric extents matched. Raw failed
receipt/log remain at `oracle/`. Run2 adds output JSON round-trip before result
comparison; the reducer bytes are unchanged. No OOM or budget increase. Local
review also distinguishes the intentional forged-origin rejection case from
accepted synthetic inputs; it does not claim every invalid payload is a valid
synthetic fact.

Final worker512MiB/swap0, coordinator128MiB: exit0, OOMKilled=false/oom_kill0,
peak10051584bytes (9.5859375MiB). This measures a small contract checker, NOT Core
generation memory. Independent15checks pass, including dimensional examples,
input hashes, unchanged reducer, cgroup limits and source-preservation checks.
The copied real inventory is byte-identical to the prior genuine row proof:
all181native row advances/upper bounds remain unknown and remainingSafe=null.
It is not fed to the synthetic checker as an asserted height model.

Status `PASS_PROPOSED_ROW_CONTRACT_LAB_ONLY`. The row-height/transition contract
is ready for review; no real UAT native height/cut or full MR1 acceptance is
established. Next bounded proof should read complete source text-wrap/image/
merge facts for representative rows, establish coverage and native confidence,
and preserve unknowns where the adapter cannot yet certify a row footprint.
Core42008134/Servicedb15e9d clean; Word-reviewed M1 DOCX hash unchanged. No new
DOCX/PDF, renderer, Core/Service change, original data/service operation, SQL,
merge/push/release/install or map promotion. Original3container identities/
start/restart counts unchanged; no owned worker running.

## Genuine representative text/image/merge facts — 2026-11-04

Owner authorized a copy-only Oracle512MiB representative-row proof under the
proposed contract, preserving M1/Menu without Core/Service changes/integration.
Product owner Core; inline Evidence Reviewer/Project Control Steward, IDs N/A.
Proof budget: one genuine UAT generation with a read observer and independent
source-to-package checks; stop on OOM. Reuse this contract and the existing plan.

Artifact root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-representative-rows-20261104`.
`representative-adapter.mjs` reads the actual branded intent at the unchanged
writer observation point; `oracle/outputs/representative-source.json` retains
selection reasons, actual SourceEntry tuples, raw selected text/line spans,
cached extent facts, image resource/geometry identities and merged-label policy.
Other raw outputs/receipt/cgroup records are under `oracle/`; checks/results are
`verify-base.py`/`verification-base.json`, `verify-rows.py`/`verification-rows.json`
and `verify-representative.py`/`verification-representative.json`.
`artifact-hashes.json` binds retained local artifacts. No source shaper, image
builder or rendering policy is called a second time by the observer: cached
measurements/resource bytes are read, not regenerated. The single generation
is genuine Core work, not the prior synthetic contract checker.

Selection is based on actual source capabilities, not prior PDF coordinates:
resolved soft-wrap, authored multiline, cached multiline measurement, mixed
text/image cell and largest table-image frame. All five roles were found; their
union plus the first eligible M1 merged span covers7rows in5tables,24text blocks
and5inline images. Counts describe this fixture subset, not all document types.

| Representative | Confirmed Core-to-output facts | Remaining native-height gap |
| --- | --- | --- |
| Summary/Menu, area entry8, group0 members0–2 | Three genuine guides supply five Exact outer line frames. Source lengths19/32/39 map to ranges0–19;0–28/28–32;0–21/21–39. The two-line examples contain no authored newline. All text/spans/tags and outer frames match emitted SDT content. | Line frames do not bound every peer cell or merged row. Inner VML word boxes remain overlays, not extra flow lines. |
| Authored multiline cover row | Text106characters with three explicit newlines is preserved in one ordinary native paragraph with breaks. | No guide or cached measurement for this block; authored breaks do not establish all native wraps/row height. |
| Requirement area entry18 | Cached aggregate at212pt source-width key reports11lines/190.3pt for330characters with8newlines; emitted ordinary paragraph preserves text and breaks. | Cache exposes height/line count, not line source ranges or a native Word line cursor. Measurement recipe includes1.5pt width safety; it is not an exact Word measurement. |
| Mixed Requirement cells, entries16/18 | Two8×8pt image frames and two28×25pt frames match actual inline geometry, contained picture scale/offset and embedded-byte hashes. Entry16 text cache reports1line/17.3pt. | Images retain native AtLeast carrier paragraphs. The image frame height is not a complete carrier-inclusive native row advance. |
| Largest table image, mobile figure entry142 |451×212.4pt frame matches actual inline extent; contained picture transform and resource bytes match Core identity. | Caption/paragraph/carrier and cell interactions remain part of unresolved row advance. |
| Module merged over the three summary members | Source group/cell identity, rowSpan3 and all member IDs preserved. Actual XML keeps8pt physical top+16pt first-label offset once. | Module text itself has neither SourceGuide nor cached extent at this width; no certified merge allocation/label-wrap upper bound is available. |

All24selected text blocks match their emitted text and source hashes; guides
cover five full source-line frames. Two cached extents are explicitly retained
as aggregate-only facts. Source content widths match selected native widths for
these cells; this is checked, not assumed for other policies. For all5images,
private resource-byte SHA256 equals both the intent metadata and the actual
relationship-target part hash. Image wrapper line budgets/zero spacing,
frame extents, aspect-containment transforms and offsets also match. Physical
picture dimensions are distinguished from the enclosing frame.

Worker512MiB/swap0, coordinator128MiB: exit0, OOMKilled=false/oom_kill0,
peak365809664bytes (348.86328125MiB),7009.196ms, one generation/no retry.
Eight inherited in-worker checks pass; independent20base,11row/boundary and
15representative checks pass. All26XML/.rels parts parse.127Core source files
and267compiled files match M1;167of171DOCX parts match the reviewed baseline
byte-for-byte. Remaining differences are timestamps/font obfuscation GUIDs and
first32bytes; full decoded fonts match. Menu/M1/source-map markup unchanged.
No fresh Word/PDF export, page count, clipping or native fit claim is made.

Verdict `PASS_GENUINE_REPRESENTATIVE_FACTS_WITH_NATIVE_HEIGHT_GAPS`.
Real text/resource/geometry facts can be read without product changes. This does
not complete flowdoc-row-footprint/1: cached11line measurements cannot supply
line-cut ownership; Module wrap and merge allocation remain missing; image
carriers and ordinary peer paragraphs lack complete native upper bounds.
All7row native advances and remainingSafe stay null. No fake row height is
derived from image dimensions, paragraph count or an aggregate text height.
Next bounded discovery should establish source line/flow facts for the Module
label and its ordinary peer cells, then carrier-inclusive image/paragraph
footprints, before claiming a complete row bound or replaying page cuts.

Full MR1 remains open. Core42008134/Servicedb15e9d remain clean; source/package/
harness/baseline inputs and original3container identities/start/restart counts
unchanged, no owned worker running. No Core/Service edit, original data/service
operation, SQL, merge/push/release/install or map promotion.
