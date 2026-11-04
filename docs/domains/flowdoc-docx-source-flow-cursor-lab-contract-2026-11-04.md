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
