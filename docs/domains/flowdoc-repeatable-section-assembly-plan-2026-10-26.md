# Repeatable Section Assembly Implementation Plan

> Execution after owner approval: use superpowers:executing-plans for bounded inline implementation. The owner approved sequential inline execution on2026-10-26; no merge, release, installation or publication is authorized.

## Authority Boundary

Owner: FlowDoc Project Control for this cross-repository proposal. Core owns
template/request contracts and composition/rendering; Service owns persistence,
transport, task pins and authoring discovery; consumer applications own their UI.
This is a single-room plan from the owner's explicit request. Execution, Phase
and Checklist IDs are not applicable. No map/product-readiness promotion.
Work size: medium; risk tier: routine, with explicit compatibility and identity
risks below. Scope is an isolated pilot, not a release or installed upgrade.
Current isolated PC lane: codex/shared-stroke-table-styles-pc at0e5efe9 before
this plan. Existing Core/Service lanes must be checked clean and revalidated
against their actual bases before implementation; do not reset unrelated work.
The current generated snapshot concerns unrelated Editor work; this request and
the retained CLIS correction are the applicable context, not a new Editor lane.

**Goal:** a caller can assemble a document by invoking saved Section definitions
in request order, including multiple uses of the same Section with independent
data, headers and footers, and obtain editable PDF/DOCX-compatible results.

**Architecture:** distinguish saved definitions from runtime uses. Give each
definition a unique public key within its document version; give each use its own
identity. Expand each use into an independently namespaced resolved Section,
then reuse the native PDF/DOCX Section renderers.

**Tech stack:** existing TypeScript Core/Service, versioned JSON contracts,
PostgreSQL authoring storage and task processing, existing PDF/DOCX renderers.

**Spec:** the owner's conversation establishes the semantics in the next section.
The version/field choices below are the recommended pilot design, not existing
capabilities or approved implementation truth.

## Agreed semantics and proposed public contract

- Authors may save any number of Section definitions under one docKey. A public
  Section key and internal definition UUID are unique; display labels need not be.
- Callers reference a saved definition by public sectionKey, not by display label
  or an internal UUID they must discover manually.
- Request order is output order, including A -> B -> A. Unused definitions are
  omitted; no mandatory-use/min/max policy is added in this pilot.
- Each use has a caller-supplied instanceKey unique within that request. It stays
  stable when the caller edits or reorders entries. Two uses may share sectionKey
  and display label, but cannot share instanceKey.
- Data/header/footer belong to a use. Schema, page settings, header/footer
  declarations and numbering rules belong to its saved definition.
- A use can flow over multiple pages. Each subsequent use starts a new page in
  the pilot; no continuous mid-page Section start is added.
- A header repeats according to the definition's band mode within that use.
  Final totals remain ordinary content when the definition places them there.
  For the current CLIS delivery, every selected use has its complete report header
  on its first and continuation pages. Totals are body nodes following that use's
  table; there is no visible repeating footer. The older Inward-derived A/B/A
  band fixture is test-only and is not the current CLIS delivery definition.
  This CLIS rule does not remove the general optional header/footer capabilities
  from Core or change unrelated18/19 documents.
- Empty request assembly is rejected. Empty data in a selected use follows its
  authored content and existing empty-content rules; it does not silently select
  a different definition or manufacture an extra page.

Recommended contract isolation: add a new explicit model contract (provisionally
Model20) rather than changing Model19's saved-order/exactly-once meaning. Keep18
and19 readers and their manuals unchanged. Confirm the model/prepared/streamed
version matrix in Task1 before implementation; never infer a task-wire version
from a node-model number. New prepared input must pin the definition fingerprint,
resolved public keys, instance identities and request order.

Illustrative new request shape, not an API that is already accepted:

```json
{
  "docKey": "clis-outward-pilot",
  "version": 1,
  "data": {},
  "sections": [
    {"sectionKey":"containerList","instanceKey":"ningbo-1","data":{},"header":{"pod":"Ningbo"}},
    {"sectionKey":"containerList","instanceKey":"shanghai-1","data":{},"header":{"pod":"Shanghai"}},
    {"sectionKey":"containerList","instanceKey":"ningbo-2","data":{},"header":{"pod":"Ningbo"}}
  ]
}
```

This is schema-backed business data: pod/header must be declared by that saved
definition. The caller cannot override geometry or inject arbitrary definitions.
An explicit discovery response lists sectionKey, label and input/band schemas
for the selected docKey/version. Renaming label does not break callers; changing
sectionKey is an API contract change belonging to a new document version.

## Display and navigation rules

The creator's definition list shows each definition once. The caller's assembled
document list shows each use once, in request order, identified by instanceKey.
Display can show label plus use number or Port supplied by the application; no
new arbitrary label-expression language is introduced. Delete/reorder/data edit
acts on a use, while editing a definition is a separate authoring operation.

Namespacing must cover nodes, bands, Areas, bookmarks, TOCs, ending Areas, image
locators and diagnostics. Preserve both definition identity and instance identity
in source provenance. Local references resolve within the current use. A
cross-use reference requires an explicit target instance; never select the first
occurrence of a repeated definition. Existing cross-Section references must be
checked at admission; ambiguous unsupported input fails explicitly.
Section-scoped TOC means this use; document TOC follows the assembled document.
Numbering continues by default; existing explicit restart rules apply per use.

## Source findings that determine the implementation

- Core src/data/prepareInstances.ts rejects duplicate IDs and requires every
  saved Model19 Section exactly once; it cannot merely loosen one duplicate check.
- Core src/composition/composeSections.ts loops saved definitions and namespaces
  nodes/anchors with definition ID. Both iteration and identity need a new path.
- Core src/composition/resolvedDocument.ts carries Section identity in sections,
  sourceMap and formatInstances; provenance must keep definition and use separate.
- Core src/docx/sections.ts already consumes ordered resolved Sections, but its
  model-specific TOC/capability branches and native header links need verification.
- Service src/templates/assembly.ts stores sourceDefinitionId and saved positions;
  src/authoring/sectionInstances.ts currently imports/copies saved instances.
- Service src/tasks/normalize.ts and processing.ts pin/normalize/queue immutable
  input. Repeated use must survive JSON indexing, image ownership and job reload.
- FlowDocMake scripts pin runtime capabilities. They must advertise/accept the
  new contract only with a matching candidate, without changing installed0.3.0.

## Execution tasks and acceptance

### Task1: freeze the versioned definition/use contract

- [x] Inspect the owning Core/Service guides and all affected strict model switches,
  authoring serialization, registry, prepared and streamed normalization readers.
- [x] Freeze public sectionKey, instanceKey, request ordering, duplicate/error rules,
  band/data scopes, reference addressing and version matrix in this one document.
- [x] Locate any real consumer of Section IDs before changing its display contract;
  no existing Editor/frontend is assumed to be a runtime-document composer.
- [x] Acceptance:18/19 inputs retain current meaning; a paired new definition and
  A/B/A request are unambiguous. A required unapproved architecture/scope expansion
  is reported before product mutation.

### Task2: implement Core preparation and composition

Files: src/template/types.ts, sectionOwnership.ts, pageSections.ts,
src/data/types.ts, prepareInstances.ts and a focused new assembly reader;
src/composition/composeSections.ts, resolvedDocument.ts and affected reference/
contents/provenance validators. Audit direct and streamed normalization paths.

- [x] First add rejection/acceptance cases: repeat key with distinct instances,
  duplicate instance, unknown key, label-only lookup, missing/wrong-scope data,
  reordered uses, unused definition, empty request and immutable source definition.
- [x] Expand by request order with fresh instance namespaces; reuse definitions
  without mutating them. Charge every expansion to existing node/resource budgets.
- [x] Verify local anchors, explicit cross-use links, scoped/document TOC, images
  in two uses, mixed page layouts and ending Area on only its owning use's last page.
- [x] Acceptance: A/B/A produces independent content in both memory and streamed
  paths, with no duplicate nodes or data leakage;18/19 regressions still pass.

### Task3: prove PDF and native Word before wider transport rollout

Owner scope correction on2026-10-26: renderer-fidelity tuning and native Word
edit/save reliability are removed from this round's remaining work. Preserve
their observations as deferred limitations, not PASS. The conversion/reflow
and native header isolation evidence already collected remains reusable; the
Word save hang no longer blocks Task4. Do not spend more Word or spacing trials.
Current CLIS proof uses the Outward fixture with full headers and body totals,
not the older synthetic fixture's visible footer. The unchecked historical proof
items below are not to be completed by silently resuming the cancelled work.

Files: affected src/pdf, layout, src/docx/sections.ts, profile/fields/bands and
their focused tests. Modify only where new resolved semantics require it.

- [x] Export one-page A, multi-page B and a different-length second A in one file.
  Add distinct per-use text, repeated header, page number, local bookmark and total.
- [ ] Inspect every PDF/Word-converted page: use starts, header inheritance,
  table-header repetition, last-use totals, links, numbering, ending Area, blank
  pages and editable native tables. Use native Word Sections, not table-header
  substitution for general Section headers.
- [ ] In a copy in Word, edit the first A enough to change its page count. Confirm
  its header follows its continuation pages and does not alter B or the second A.
- [ ] Original acceptance (superseded as a Task4 gate by the owner correction):
  normal Word reflow preserves use boundaries and per-use bands; content is
  complete. Preserve incomplete checks and known differences without a PASS claim.

### Task4: connect Service, discovery and caller display identity

Files: src/templates/assembly.ts/registry.ts, src/authoring/sectionOperations.ts,
src/http/authoring.ts, src/tasks/normalize.ts, processing.ts and image-index
consumers; FlowDocMake compatibility/profile/contract readers when applicable.
Any DB change uses a new forward-only migration, never rewrites old definitions.

- [ ] Persist unique public keys per document definition/version and return their
  schemas through the supported discovery route. Reopening saves the same keys.
- [ ] Verify a real isolated task through intake, normalization, queue/reload and
  PDF/DOCX delivery; preserve assembly order and instance keys in diagnostics.
- [ ] Verify image pointers/access ownership across repeated uses, immutable
  fingerprints and candidate version pins. Do not shortcut via direct user DB edits.
- [ ] Provide a small display contract/example showing independent select/edit/
  remove/reorder by instanceKey. Existing frontend product changes are outside
  this pilot until its actual owner and consumers are traced.
- [ ] Acceptance: discovery -> submit -> queued delivery retains A/B/A exactly,
  and changing one use does not alter another. Old18/19 API cases remain valid.

### Task5: CLIS pilot and closeout

- [ ] Keep all original PDFs, CLIS Model18 evidence and migrated Model19 fixtures.
  Derive a separately named new-contract CLIS candidate; do not overwrite those.
- [ ] Use checked source records to make a small multi-Port Outward sample with
  at least one Port spanning pages. Preserve source field meanings and blanks;
  no invented dimensions or corrected totals. Each group total follows its items.
- [ ] Export both formats and inspect Core PDF pages plus native DOCX structure.
  Verify row-once coverage, full per-use headers on first/continuation pages and
  one body total after each use's last item. No visible repeating footer. Native
  Word conversion may be checked by the owner; fidelity tuning and edit/save
  proof are deferred and do not block this round's transport acceptance.
- [ ] Run only affected Core/Service/FlowDocMake checks and unchanged-model CLIS
  regressions. Record coverage, failures and accepted limits in this plan's result
  section; no full-system PASS from selected tests.
- [ ] Stop when the sample and affected checks meet acceptance. Commit the isolated
  candidate, but do not merge, tag, release, push, install or publish in this scope.

## Proof and document budget

One canonical plan/result document and retained machine-readable test/artifact
outputs; no synthetic execution registry or per-step report files. Reuse unchanged
baselines. Initial render targets are A/B/A plus the bounded CLIS multi-Port sample
in both formats and only affected old-model controls. Review every output page.
Use at most three render batches (initial, responsible repair, confirmation) before
reassessing a persistent failure; do not spend iterations tuning unrelated spacing.
Keep real render/service experiments at1GiB and isolated from the running service.
No arbitrary performance claim follows from these functional samples.

## Current result

Task1 and Task2 remain complete for the isolated candidate. The owner has removed
PDF/DOCX fidelity tuning and Word edit/save reliability from this round's remaining
scope; their incomplete evidence and known issues are retained, not marked PASS.
Task4 Service/discovery is the remaining implementation target and has not started.
Task5 has a direct-Core bounded Outward sample with complete per-use headers and
body totals, no visible footer. The latest clis-atomic-rows-r3 pair uses TH Sarabun
New and intact rows; Core PDF/data checks pass and owner Word conversion is next.
Its Service delivery remains unverified. Do not
claim whole-plan acceptance or that the installed API accepts repeated Sections.

## Execution ledger

Task1 completed by source inspection. Ruling: use opt-in Model20, retaining
Model18/19 meaning unchanged. Definition Sections add unique sectionKey alongside
internal UUID id; label remains display-only. Public keys and instanceKey use
ASCII identifiers `[A-Za-z][A-Za-z0-9_-]{0,63}` to avoid ambiguous namespace and
pointer delimiters. Maximum2000 definitions/uses is an admission bound, with
existing overall expansion/task budgets still enforced. Prepared schema3 pins
model20; task normalization uses flowdoc-task-input/2, separately from unchanged
HTTP task-v1 response framing. Normalized20 repeats sectionKey/instanceKey;
composition maps these to definition UUIDs and independent runtime Section IDs.

Ruling: local references stay instance-local. New20 explicit cross-use references
use targetInstanceKey;19 targetSectionId stays unchanged and is not reinterpreted
as a repeated definition target. Missing target use fails rather than selecting
one implicitly. New20 Section ordering is only request order; saved definition
order remains a creator-side display order. No automatic18/19 migration.

Observed consumers in this delivery lane are Service authoring schema/discovery,
Core PDF/DOCX and task normalization, plus FlowDocMake's exact capability readers.
No caller assembly UI is implemented in these Core/Service repositories. The
pilot supplies stable display identities and a contract example; it does not
claim to have changed the separate Editor. Existing isolated Core and Service
lanes were clean before product implementation.


### Core checkpoint and owner pause

Core candidate commit:10eeb89 on the existing isolated codex/shared-stroke-table-styles
lane. Package identity0.5.1-dev.section-assembly.1 is development-only. Build
passes; the final impact-scoped host suite passes768/768 with zero skipped.
The final report is `section-assembly-r1/core-checkpoint-tests-final.json` in the
existing recovery root. This is not a complete Service/full-system test claim.

A fresh read-only review found a retained19-only guard in validateFormatInstances.
Reproduced with failing20 repeated-use auto/fixed Area Format sizing cases,
fixed the admission, then passed both direct and streamed composition and the
final affected suite. New20 scoped/document TOC tests also pass. No other
concrete defect was reported within this checkpoint's reviewed scope.

Direct packed-Core pilot A12/B60/A5 produced5 PDF pages, with row distribution
12/20/23/17/5; all77 synthetic pilot records occur exactly once. Headers identify
first/middle/last uses independently, including B's continuation pages. All5 PDF
pages were visually reviewed. DOCX contains3 native Sections and editable tables,
with distinct per-use headers and no body text boxes. This pilot derives from
the retained Inward fixture; it is not the checked Outward source reconstruction.
Its totals retain the Inward footer model, not Outward's end-of-group totals.

The initial77-row B-stroke DOCX exceeded the unchanged default XML cap; the next
bounded proof used the already-supported explicit100000-node option under1GiB.
No product default was raised. Two render batches used of the planned three.
Proof archive and artifacts were generated before the review's Format-sizing
fix; those pilot inputs contain no explicit Area Format sizing. The retained
archive is pre-review proof input, not a final/released package of10eeb89.
Final source/build/test evidence is distinct from that archive's evidence.

Native Word prerequisite failed twice: windows disappeared from list_apps before
the pilot file could be selected. A new Word launch reproduced the unavailable
window; this does not establish that the generated document caused a crash.
No Word PDF/reflow PASS is claimed, no user document was saved/overwritten, and
no further Word retry or render batch was started after the owner's pause.

Return point: restore a usable native Word session and complete Task3 conversion
plus edit/reflow proof before Service integration. Keep using the saved pilot
files; rebuild/re-pin a final package from the checkpoint source before any new
consumer integration. Service, installed FlowDocMake, original PDFs and old CLIS
fixtures are unchanged. No merge, push, release, installation or publication.

### Owner-authorized resume: native Word reflow and save blocker

The owner confirmed that earlier disappearing windows were being closed by the
owner. That observation is not evidence of a generated-document crash. Native
Word then exported a clean five-page baseline, retained as
`section-assembly-r1/artifacts/Section-Assembly-ABA-R2-word-clean.pdf`. The earlier
`Section-Assembly-ABA-R2-word.pdf` contains an accidentally typed Thai character
in its title; preserve it as excluded evidence, not the comparison baseline.

Rebuilt and packed the unchanged final Core source10eeb89. The final archive
SHA256 is `e2a31efe7a8598914867e8c4c9f161eeee6a9a85a126d4c4cda24e8f1a14d5af`.
It is retained in both section-assembly-r1/final-core and section-assembly-r2.
It does not replace the installed package or the earlier pre-review proof input.

The third Core render batch produced a plain native-border A12/B60/A5 pair and
a checked-source Outward sample pair under1GiB with network disabled. A preceding
fixture validation rejected0.35pt for a native single border; the proof fixture
was corrected to0.5pt before rendering. No product default changed. All three
planned Core render batches are now used; reassess the persistent failure before
any further Core render batch rather than retrying automatically.

Plain pilot:5 Core PDF pages,3 native DOCX Sections. Opened a separate edit copy
in Word, inserted70 paragraphs before the first table, and exported a seven-page
PDF. Pages1-3 retain the first-use Ningbo header, pages4-6 the Shanghai header,
and page7 the second-use Ningbo header. All77 original records and70 inserted
paragraphs occur exactly once; native page fields show1 of7 through7 of7.
All seven Word PDF pages and all five plain Core PDF pages were visually reviewed.
This proves observed native reflow/band isolation, not exact PDF/Word pagination.

Native Ctrl+S remains a real blocker. The B-stroke edit case stopped responding;
after the owner closed its windows without saving, the plain-border edit case
also stopped responding during save. The current plain DOCX on disk still has
zero REFLOW paragraphs. Escape did not recover it; Word PID43544 was observed
Responding=false. No forced termination or unrelated application closure was
performed. Root cause is UNKNOWN: B strokes are not established as the cause.
The successful Word PDF preserves the edited result, but no saved-edit DOCX PASS
is claimed. Stop before Service implementation, as required by Task3's gate.

Outward sample preparation:39 checked records from source pages1,2,3,24, grouped
as Ningbo9 / Shanghai20 / Xiamen10. One saved containerList definition is used
three times. The four-page Core PDF repeats the correct Port header, places each
sample total after its group, and has no footer. The Shanghai row continuation
crosses the page boundary normally. All four pages were visually reviewed and
all39 container IDs were checked once. Totals are explicitly sample totals, not
the original full-group totals. This is not a full30-page fidelity reconstruction.
Native Word conversion of this sample is pending because of the save blocker.

Retained evidence under the existing recovery root:
`section-assembly-r2/artifacts/resume-word-verification.json`,
`Section-Assembly-Plain-R2-edit-word.pdf`, its per-page inspection JSON and QA
images, `consumer-result.json`, both generated artifact pairs, and checked source
rows in section-assembly-r2. Product source, Service vendor/pins, installed
FlowDocMake and all original baselines remain unchanged in this resume. Service
source inspection was read-only; no API/discovery/task integration PASS is claimed.

### Owner scope correction: full CLIS headers, body totals, transport remains

The owner explicitly removed remaining-work items1 (PDF/DOCX fidelity) and2
(native Word edit/save) from this round. Do not continue those investigations or
keep the save hang as a transport gate. Their prior BLOCKER/NOT PASS observations
remain historical evidence; this is an owner scope decision, not a successful fix.
No merge, push, release, installation or publication was authorized.

Clarification verified against the retained fixtures: plain-template.json and
its A/B/A request are synthetic tests of independent bands and still contain the
old Inward-derived repeating footer. They are not the final CLIS structure.
The current clis-template.json defines header roots title/vessel/port, no footer,
and body roots table/total. Every ningbo/shanghai/xiamen use supplies its own full
header data and section total. Native DOCX has independent default/first headers
for all three uses with the correct Port. Its six footer parts are empty (no
text, fields or tables); they do not contain the old repeating totals. Existing
Core PDF pages confirm the full header repeats on Shanghai's continuation and
each sample total follows that group's final item. No new artifact was rendered
for this inspection and no product behavior was changed.

Task4 and its real delivery fixtures must use this full-header/body-total shape.
If an A/B/A transport test is retained, adapt its test data to the same shape;
do not deliver the legacy visible-footer fixture as the requested CLIS output.
Reassessed proof scope after the three Core batches: reuse the final packed Core
and existing source rows. Remaining proof is the already-planned isolated Service
PDF/DOCX delivery and affected compatibility checks under1GiB, with at most an
initial and responsible-repair delivery batch. No further native Word automation,
spacing tuning or unrelated renderer experiment is part of that proof.

### CLIS20 feasibility correction: TH Sarabun New and compact rows

The owner clarified a client requirement: target20 items per page, at most three
lines per item, and never split an item across pages; if the next item does not
fit, move it intact to the next page (for example19 then item20). The current
stage is feasibility before product changes. Use TH Sarabun New, not the Sarabun
family used in the previous sample. Investigate compact leading and cell padding
for this CLIS requirement; this is not a reopening of general PDF/Word fidelity
tuning or Word save diagnosis. Ellipsis beyond three lines remains undecided;
Core currently exposes no line-clamp/ellipsis contract. Do not silently discard
data. Current CLIS itemRow allowBreak=true must change in a later approved edit.

Found local Regular/Bold files in Downloads/THSarabunNew and verified their
internal family names. Regular SHA256 is
`b248f824f3d7a8576bc396826a4d898070c1420564f6ce6aa716aa8ad24f824a`;
Bold SHA256 is
`49596f298a8fe248c5340b4589b3b4adfcf34a3e24084ebeb4f49c6600f75fa7`.
These are local trial inputs, not registered/installed font releases. The active
Service catalog currently lists Sarabun, Pridi and IBM Plex Sans Thai, not this
family. No catalog, package, template or renderer was changed by the inspection.

One isolated read-only shaping probe used the existing final packed Core image,
network disabled and1GiB. At12pt (measurement size only), the three actual English
operator lines have ink heights7.716/7.920/7.692pt, whereas the font ascent/descent
envelope reserves15.612pt. Thai samples with marks have ink heights10.764-12.816pt.
Core measureText takes max(authored leading, font ascent+descent), so lowering
lineHeightPt alone cannot reclaim that envelope. This identifies a candidate
mechanism to investigate before implementation, not proof that20 worst-case rows
fit or that Word matches. Keep Thai mark clearance in any later compact-line
experiment; do not extrapolate English-only packing to arbitrary Thai text.
No new PDF/DOCX or product test was run for this feasibility probe.

### Owner clarification and authorized atomic-row CLIS trial

The owner corrected the20-item interpretation: the controlling rule is actual
available space. Move the entire next item to the next page if it does not fit;
do not split it and do not compress20 three-line items into a page. The20-line
description is not authority to introduce a hard20-item counter or a fixed text
line-count paginator. The three-line-per-item requirement remains; treatment of
overlong text/ellipsis has not been selected. The owner authorized starting the
trial after this clarification. The prior20-worst-case-item packing calculation
is superseded as an acceptance target, not erased from history.

Ruling: reuse the existing public allowBreak=false row option and TH Sarabun New
font resources in a new isolated CLIS fixture; no renderer change is needed for
atomic-row pagination. Generate the same checked39 source records in PDF/DOCX,
retaining the full per-use headers and ordinary body totals. Preserve all prior
files. Start with10pt table text,12pt bands and compact cell padding as a trial
choice, not an owner-specified font size. Verify every rendered cell's line count,
row-once/text completeness and no item split; fail visibly instead of truncating
any cell exceeding three lines. No new ellipsis behavior, catalog registration,
installation, Service integration, merge or release is part of this fixture trial.
Budget: one initial artifact pair plus one responsible repair pair only if a
concrete check fails, each real generation under1GiB with network disabled.
The owner performs native Word conversion; do not resume automated Word save
diagnosis or claim Word visual acceptance from structural XML checks.

Atomic-row trial result: retained under the existing recovery root at
`clis-atomic-rows-r3`. Same39 checked source records, TH Sarabun New10pt table
text/12pt bands, compact cell padding, allowBreak=false on every row and no
renderer/product-source modification. PDF has4 pages: Ningbo9, Shanghai12+8,
Xiamen10. Full headers repeat on the Shanghai continuation; group totals occur
only after each group's last item. All four PDF pages were visually reviewed.
Each container occurs once and each of its three operator lines stays on that
same page. All507 PDF cell values match source data after whitespace normalization.
All measured body cells have at most3 lines; no clipping or ellipsis was applied.
This is a sample-data result, not a general3-line truncation implementation.

DOCX contains3 native Sections,42 rows including the three header rows, and
cantSplit on all42. All507 body cell values match source after whitespace
normalization. Header parts contain the complete independent Port headers;
footer parts contain no text/fields/tables. Font table names TH Sarabun New.
DOCX native Word visual/reflow acceptance remains pending owner conversion.

One responsible environment repair: initial PDF generation succeeded but DOCX
could not create its source temp directory on read-only /tmp. Added a bounded
tmpfs at /tmp and generated DOCX only; preserved the first PDF. Both container
runs kept network disabled and1GiB. The cell comparison checker initially included
the following total node in the last-row window; corrected the reader boundary
and passed without changing the artifact. Durable outputs: template/request/font
inputs, embedding license extracted from the original font, cell-lines.json,
generation.json (DOCX retry receipt), verification.json (both artifact hashes and
coverage), and all PDF page images. Core/Service source, catalog and installed
packages remain unchanged. This fixture trial is ready for owner Word conversion;
Task4 Service/discovery integration remains pending, not implicitly accepted.
