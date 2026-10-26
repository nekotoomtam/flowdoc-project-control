# Shared line and table styles implementation plan

> Execution: use superpowers:executing-plans inline; no separate WORK room.

## Authority Boundary

Owner: FlowDoc Project Control for this bounded owner-approved scope and its
acceptance record. Core owns implementation, API and tests. This plan is not
Evidence of implementation, release, installation, native Word fidelity or map
truth. Execution/Phase/Checklist IDs are N/A for this single-room scope. Current
generated snapshot still concerns the separate frontend roadmap; it does not
override the owner's explicit CLIS export request. No old registered round is
reactivated.

Goal: share line/table stroke style, color and width across PDF and DOCX while
preserving omitted/default behavior; deliver CLIS20/60 candidate artifacts.
Scope: Core implementation and code-adjacent guide, this canonical plan/receipt,
and task-local evidence/artifacts. No merge, push, release/tag/version change,
production installation, draft publication, Service vendor update or text-style
expansion. Existing PDF/DOCX sources and live drafts remain immutable inputs.
Roles: Product Implementation Agent, then Evidence Reviewer inline.
Work size: medium; risk: routine, with backwards-compatibility and merged-grid
paint coverage. Models: current host-provided inline runtime, no override and
no separately dispatched WORK; no synthetic room/return records.

Architecture: preserve one semantic graph for both renderers. Resolve shared
stroke defaults and per-table-edge overrides centrally, then encode native DOCX
borders and PDF drawing instructions. No image flattening or renderer-specific
style data in the CLIS business input. Reuse the approved CLIS native DOCX flow.

## Contract decisions

- Shared kinds: `single`, `none`, `dashed`, `dotted`, `double`.
- Line adds `props.lineStyle`; existing thickness/color/spacing remain.
- Table extends `props.borderStyle`, adds `props.borderWidth:Length`, and
  `props.borders` overrides for top/right/bottom/left/insideHorizontal/
  insideVertical/headerBottom. Override shape: `{style?,width?,color?}`.
- headerBottom is a targeted CLIS need: retain the rule below repeated labels
  while hiding horizontal rules between data rows.
- Override -> table property -> original default: single0.5pt black. White stays
  painted white; none suppresses paint without removing cells or padding.
- New table widths use the shared DOCX range0.25..12pt, exact eighth-points;
  Length supports pt/mm with equivalent conversion. Existing line inputs retain
  their prior accepted behavior; new non-single kinds must be representable.
- Double width is the nominal component-line weight; two strokes plus equal
  gap occupy3x that weight. Dash/dot are portable named styles, not a promise
  that Word's native dash phase equals PDF pixels.
- Borders follow native cells/merges; no interior stroke through a merged cell.
  Repeated headers retain headerBottom; physical continuation fragments close
  with the configured outer borders. Paint each shared PDF edge once.
- Do not silently apply legacy half-point DOCX geometry accommodations to custom
  widths/styles. Preserve existing paths for omitted/single/none defaults.
- For styled PDF rules/edges, keep the complete stroke envelope within the page
  or fixed frame; reject an impossible frame rather than silently clipping.

## Acceptance and proof budget

1. Validator accepts supported combinations and rejects invalid nested keys,
   colors, widths/kinds at authored and resolved boundaries and DOCX profile.
2. PDF buffered/streamed writers encode single/dash/dot/double/none and honor
   color/width. Native DOCX XML preserves corresponding kind/width/color and
   effective per-cell outer/interior borders, including merged grids.
3. Existing defaults, explicit white and border-none tests remain passing;
   legacy/default CLIS outputs remain equivalent under unchanged inputs.
4. Candidate CLIS20/60 uses dotted vertical grid, no body horizontal rules,
   solid header separator and double footer rule; preserve repeating footer,
   header rows, row values/order and live page numbers. Render/review every PDF
   page and native DOCX preview page. Native Word conversion remains owner-run.
5. Preserve baseline hashes, package/run identities and receipts, final clean
   reviewed commits on isolated branches; do not integrate them.

Proof budget: one selected baseline run; RED/GREEN cycles on stroke, validation,
merged/pagination and writer tests; affected Core suite/build plus one packed
Linux consumer and CLIS matrix. Repeat only after an actual repair or uncovered
affected area. Document budget: this plan/receipt and Core template guide; no
synthetic Work/Evidence registry or product-repo shared plan.

## Tasks

- [x] Baseline: Core at b5218a81a5bd81d8c1885bdb893044bc8fad0793;
  branch codex/shared-stroke-table-styles, sibling of this managed PC worktree.
  Native creation is bound to PC; Core isolation uses owner-repo Git worktree
  fallback. PC base312dc6d2f10382358dcac3eae9dbf154f265f9a4.
- [x] RED: add focused tests in tests/layout/strokeStyles.test.ts and
  tests/docx/strokeStyles.test.ts using existing genuine composition helpers.
  Exercise defaults, all styles, invalid input, mixed edges, repeated headers,
  merged cells, and physical stroke envelopes.
- [x] GREEN: shared types/resolution in src/composition/strokeStyle.ts;
  extend resolvedDocument/template graph and DOCX profile validation. Update
  line/table layout, draw contract and PDF primitives; preserve default output.
- [x] GREEN: map native DOCX border styles/widths for lines, tables and merged
  cells; restrict legacy geometry accommodations to their proven inputs.
- [x] Verify: final diff, selected/affected suites and build; package candidate
  and test the public API in isolated Linux. Preserve actual reports and gaps.
- [x] CLIS: derive unchanged20/60 requests and font snapshots; keep live Service
  and draft untouched. Render candidate PDFs/DOCX using candidate public package,
  inspect all pages, reconcile rows/labels/footer/geometry and baseline hashes.
- [x] Record results, known Word/dash-phase boundary, commit isolated branches
  after checks; retain lanes and evidence for owner review without merging.

## Review focus

- Hidden/partial edges on merged spans must not regain unwanted native strokes.
- Header/body seam and page-fragment closures must use the intended edge style.
- Non-default widths must not inherit half-point-only spacing compensation.
- Wide/double strokes at zero margins or fixed frames must not clip silently.
- Omitted properties and explicit old defaults must retain legacy rendering.

## Status

Candidate implementation in isolated Core worktree; not installed capability.

Ruling: use shared style kinds/properties now, not named table-style presets —
the owner selected the first line/table capability slice, before reusable sets.

Ruling: Windows full-suite native metric failures reproduce on the unchanged
base (four baselineRules, three geometry, seven metricPairs cases); require the
complete Linux run rather than treating those host results as PASS. The first
Linux run had1203 passing plus a new test-fixture error and a missing explicit
legacy-helper prerequisite. Correct the test fixture and supply the preserved
real old helper; neither is a product-source repair or a waived prerequisite.

Ruling: fresh review found three concrete PDF edge cases — collapsed thick
segments/mixed-width corners at zero margin, a header-only table incorrectly
using headerBottom, and dotted end caps outside fixed frames. Four new RED
regressions reproduce them. Apply one common painted-envelope table inset and
node-specific collapsed-segment LayoutError; use outer bottom for header-only;
inset dotted caps inside their declared line span in body/fixed/band contexts.
The resulting selected54 tests and build pass. Fresh reviewer independently
reran21 layout tests and accepted closure of all three Important findings, with
no remaining Critical/Important issue in that repair pass.

## Candidate result — 2026-10-26

PASS for the scoped implementation/package/CLIS candidate, with native Word
visual comparison explicitly pending. No integration or installation acceptance.

- Complete isolated Linux suite:1209/1209 pass,0 failed,0 skipped. Memory/swap
  each1GiB,init,network none and no mounts; no OOM. Host Windows controls reproduce
  the14 platform-native failures on the unchanged base, retained as diagnostics.
- Packed public consumer:5 style kinds,0.75pt color224466 matrix passes both
  engines and native DOCX XML. Actual PDF line count is51 for single/dashed/
  dotted,0 for none,102 for double; weights/colors/dash arrays checked.
- CLIS20 and60: PDFs1/3 pages; native DOCX previews1/3 pages. Every scoped page
  visually reviewed, all row values/order retained,13-column headers repeat,
  page numbers correct and whole-report totals appear in the footer every page.
  Page row distribution is20 and20/24/16 for both candidate PDF and preview.
- Original default-input PDF controls are byte-identical to the preserved
  installed0.5.0 PDFs (both20 and60). All original source/PDF/DOCX hashes remain
  unchanged. Existing hidden/white/default border tests remain passing.
- Footer double-rule component weights are0.5pt in both PDF and DOCX-preview
  PDF; two distinct strokes are present. Small native vertical quantization and
  dash density differ; no arbitrary pixel-equivalence claim.
- Remaining visual difference: LibreOffice native DOCX preview does not paint
  the table's outer bottom rule on intermediate continuation pages, whereas PDF
  closes each fragment. The final table bottom and repeating footer double rule
  are present. Word's own page-fragment painting is unverified; this is not a
  PASS for full PDF/Word visual fidelity and was not repaired by locking page
  positions or adding content-specific page breaks.

Ruling: preserve native DOCX table-flow semantics and disclose the observed
preview continuation-border difference — candidate APIs share stroke intent;
native Word review remains the explicit acceptance boundary for pagination and
native border conflict/fragment painting. No new universal fidelity gate is
invented and no renderer-only approximation is represented as Word acceptance.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/shared-stroke-table-styles-2026-10-26`.
Durable proof: `linux-suite-r2.json`, `source-and-isolation.json`,
`artifact-review.json`, `artifacts/consumer-result.json`, original hash manifests,
review RED/GREEN logs and every rendered candidate page. Actual candidate archive
and consumer image hashes are retained there; package version remains0.5.0 for
this uninstalled experiment and is distinguished by archive/source digest.

Changes are confined to Core's semantic stroke contract/resolution, validation,
PDF layout/paint, native DOCX border mapping, targeted tests and local template
guide; this record owns the shared scope/result. Service/plugin versions, live
drafts, production vendor/archive, all release tags and mainlines are unchanged.
Worktrees/branches are retained for owner review; helper containers are stopped.

Core terminal candidate commit:
`03606f7f9d5fbdde214a80db5c957ff7c37e2379` on
`codex/shared-stroke-table-styles`, worktree
`C:/Users/nekot/.codex/worktrees/shared-stroke-table-styles/flowdoc-core`.
Project Control record remains isolated on
`codex/shared-stroke-table-styles-pc`. No shared branch was pushed or merged.

## Actual Word PDF review, 2026-10-26

The owner supplied both converted PDFs in the preserved `word-conversion`
directory. PDF Creator and Producer identify Microsoft Word for Microsoft 365;
the exact build and export settings are not inferred. This review supersedes
only the pending native Word comparison boundary above, preserving that earlier
preview receipt and all candidate/source files. Active role: Evidence Reviewer;
single-room read-only comparison, execution IDs not applicable.

- Word and FlowDoc both have 1 page for 20 items and 3 pages for 60 items.
  All row values and order match the unchanged request data exactly. The page
  distribution is 20 and 20/24/16 in both renderers, without missing or duplicate
  items. Headers, correct page numbers and whole-report footer totals appear on
  every page. All four pages from each renderer were visually inspected.
- The actual Word PDFs confirm the continuation-border difference: the 60-item
  table has no dotted horizontal closing rule on pages 1 and 2, whereas FlowDoc
  closes both fragments. Both renderers paint the final bottom edge, and the
  double footer rule is visible on every page. Native Word behavior is now
  observed directly; this is no longer merely a LibreOffice preview limitation.
- Other differences remain: Word's dotted strokes use a 0.48pt width and
  different dash density versus FlowDoc's nominal 0.5pt strokes. Word row text
  starts 5.530pt lower on page 1 and 3.323pt lower on continuation pages; the last
  row offsets are 5.606pt, 3.399pt and 3.373pt for the 60-item pages. These are
  extracted text-box positions, not a claim about exact glyph ink or baseline.
  Word's footer rules are filled 0.48pt bands, extending roughly 1.44pt farther
  left and 1.59pt farther right than FlowDoc. No footer clipping or overlap seen.

Ruling: PASS for scoped content, pagination, repeated headers and footer
presence; remaining visual differences are explicitly retained, including the
missing continuation closing rule. This does not establish universal PDF/DOCX
fidelity or authorize integration. No product repair or additional test run was
performed. Core candidate commit and all original PDF/DOCX inputs are unchanged.

Comparison evidence under the same root: `word-review-20261026/comparison.json`
contains input hashes, Word provenance, every-page row/value checks and vector
stroke measurements; `page1-table-end-comparison.png` shows the fragment-end
difference side by side. Actual Word PDF SHA-256 values:

- 20 items: `fa1b34419cc1763b4986c298e72592314e83a75bc5befb530fd4eb40f235ca22`.
- 60 items: `54ddbb3ad56390e1257ed7b01caf5bc2222155dca7cc035ba62a9dfb9fa29b62`.

## Continuation bottom-border diagnosis, 2026-10-26

Owner-requested discovery only, Core owner, Evidence Reviewer role; execution
IDs not applicable. Preserve the current candidate and all PDF/DOCX inputs;
no product change or integration is authorized by this diagnosis receipt.

The original 60-item DOCX contains one 61-row container table, with no vertical
merges. Its table-level bottom is correctly dotted, black, 0.5pt, and insideH
is none. However, `src/docx/tables.ts:153-156` also writes explicit top/bottom
cell borders for ordinary body rows: every cell in items 20 and 44 (the last
rows of actual Word pages 1 and 2) has bottom=none; all 13 cells of item 60
have bottom=dotted. In total, 767 body-cell bottom declarations are none and
13 are dotted. The 20-item control ends with 13 dotted cell bottoms. The
original DOCX hashes still match the delivered inputs.

PDF's `src/layout/cellTableFlow.ts:69` instead selects the semantic bottom
stroke at each painted fragment boundary, independently of whether the logical
table ends there. This explains the renderer policy mismatch. Microsoft's
Open XML TableCellBorders contract states that a cell border wins against a
table border; TableBorders describes the fallback when no cell border exists:

- <https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.tablecellborders?view=openxml-3.0.1>
- <https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.tableborders?view=openxml-3.0.1>

Ruling: explicit ordinary-cell no-border overrides are the strong causal
hypothesis supported by source, generated XML, contract and observed output.
A controlled Word comparison has not yet isolated that variable, so this is
not a confirmed fix or proof that the native engine cannot paint the border.

Recommended bounded experiment: omit redundant horizontal cell overrides for
ordinary unmerged body cells where the table-level rule already expresses the
same intent, retaining table insideH=none and bottom=dotted. Keep explicit
header separation, semantic exceptions and merged-cell suppression. Changing
none to nil is not an established fix. Do not hard-code items 20/44 or insert
page breaks. Preserve widths, padding, line heights, headers and footer parts.
Acceptance requires actual Word closing rules on pages 1/2, the existing final
rule, no unwanted interior horizontal rules, page counts 1/3 with 20/24/16
rows, and unchanged header/footer content and positions. Native pagination
must be rechecked because changing border inheritance can affect Word layout.

Evidence: `word-review-20261026/border-cause-analysis.json` under the existing
root records the unchanged input hashes and complete scoped XML counts.
No candidate DOCX was edited and no Word/renderer/test execution was added.

## Border inheritance experiment R1, 2026-10-26

The owner subsequently authorized implementing the proposed experiment in the
same worktree and delivering new 20/60-item DOCX files for their Word conversion.
Single-room implementation and verification, Core owner, routine risk; execution
IDs not applicable. Scope is the DOCX table mapper, targeted tests, this receipt
and task-local output. No merge, installation, publication or baseline changes.

Core commit `0970a6348ad9ed4115fe2a06830f75f655a09417` omits redundant horizontal
cell overrides only for tables without any row/column merge, with insideH=none
and a visible table bottom. The table outline remains native. Header separation,
final cell bottom, merged-table perimeters and all geometry stay explicit and
unchanged. No page-specific row IDs, manual table splits or page breaks added.

Checks and evidence:

- New inheritance test failed on the original explicit bottom=none, then the
  targeted border tests passed 20/20 after the change. Build/type-check passed.
- The complete DOCX suite in the pinned Linux image passed 227/227, zero skips,
  under 1GiB memory+swap, 2 CPUs, init, network none, no mounts. The Windows run
  had 189 passes, 14 failures and 24 skips because native metric proof was
  unavailable; that run is not claimed as PASS. Linux covers those same cases.
- Independent review found no concrete defect, including header-count zero/one,
  header-only and merged-table boundaries. Word acceptance remains pending.
- Packed candidate generated both files from unchanged CLIS inputs/fonts.
  Every row/value is retained. Header/footer parts are byte-identical; document
  XML is identical after removing the intended redundant NONE edges. Other
  varying package members are timestamps and embedded-font obfuscation keys.
  Styled and default-control PDFs for both counts remain byte-identical to the
  previous candidate PDFs. All eight preserved input PDF/DOCX hashes match.
- `render_docx.py` inspected all four LibreOffice preview pages: counts 1/3,
  row distribution 20 and 20/24/16, repeated headers/page fields/totals retained,
  no new interior horizontal rules or clipping/overlap. The preview now paints
  the page-1 closing rule, but still lacks it on page 2. This partial result is
  disclosed; neither a universal fix nor native Word pagination is accepted.

Ruling: deliver the bounded R1 experiment for actual Word conversion rather
than tune to LibreOffice or broaden table flow. Actual Word must still confirm
the closing rules on both pages 1/2 and unchanged pagination/header/footer.
Preserve the earlier Word outputs as controls; no further product changes until
that observation is available.

Evidence root addition: `border-inheritance-r1/verification.json`,
`docx-tests.json`, the packed archive, consumer receipt and all preview pages.
New deliverables are under `border-inheritance-r1/artifacts/`:

- `CLIS-border-inheritance-R1-20.docx`, SHA-256
  `4bd1d0f9e46eda3bd35b03c39158920726ac7ff8b8b878ab64caa48af3f4f9ee`.
- `CLIS-border-inheritance-R1-60.docx`, SHA-256
  `fb2dd9e4dbd68e0261584a03c4d796996b2d92fdfef0e3277b83207ecc456018`.

## Native Word dash-style probe R1, 2026-10-26

The owner authorized trying Word border patterns against the supplied close-up.
This is a bounded discovery spike, Evidence Reviewer role, Core owning any later
renderer change; execution IDs not applicable. Product source and the pending
CLIS border-inheritance candidate remain unchanged. No merge or publication.

Read-only vector inspection of the original CLIS source PDF identifies Crystal
Reports as producer, with 16 dashed lines using [1,3]pt, phase 0 and width 0
(device hairline), plus two solid lines. A screenshot cannot establish a fixed
hairline thickness in points. The earlier 0.5pt dense dotted trial is therefore
not an exact representation of that source pattern.

Before tuning PDF to an unobserved Word preset, one native OOXML probe was
derived from the preserved FlowDoc-generated R1 package. It contains six
editable 2-row/3-column tables: dashed, dotted and dashSmallGap, each at 0.25pt
and 0.5pt. Labels A-F allow matching the converted vectors and intersections.
This is explicitly a native Word research file; dashSmallGap is not claimed as
a FlowDoc API capability. Report totals were removed from the probe to avoid
presenting its synthetic grids as CLIS data. Original CLIS files are intact.

Checks: ZIP integrity, six exact native border styles/widths, table topology,
one LibreOffice preview page, every sample label, full-page visual review and
unchanged non-document package parts passed. Preserved input hashes match.
No Core suite was rerun because no product files changed. LibreOffice preview
is not evidence of Word's actual dash lengths/gaps or intersection painting.

Deliver `dash-style-probe-r1/CLIS-Word-border-samples-R1.docx` under the same
evidence root, with provenance/checks in `manifest.json`. Next prerequisite is
the owner's actual Word PDF conversion of this single file, saved beside it.
Measure that output before choosing a preset or adjusting PDF. The earlier
20/60 R1 continuation-border Word review remains pending independently.

## Word A-F measurement and E vector artifact trial, 2026-10-26

The owner supplied the actual Word probe PDF and authorized choosing the
closest preset and adjusting PDF experimentally. Evidence Reviewer/artifact
experiment, Core owner for any future renderer change; single-room execution
IDs not applicable. Core source, shared API and installed packages remain
unchanged. No merge, publication or baseline replacement.

Actual PDF Creator/Producer identify Microsoft Word for Microsoft 365. Modal
straight-edge measurements in points (nominal width / actual width / dash / gap):

| Sample | Native style | Nominal width | Actual width | Dash | Gap |
| --- | --- | --- | --- | --- | --- |
| A | dashed | 0.25 | 0.24 | 0.72 | 0.24 |
| B | dashed | 0.5 | 0.48 | 1.44 | 0.48 |
| C | dotted | 0.25 | 0.24 | 0.24 | 0.24 |
| D | dotted | 0.5 | 0.48 | 0.48 | 0.48 |
| E | dashSmallGap | 0.25 | 0.24 | 0.8 | 0.4 |
| F | dashSmallGap | 0.5 | 0.48 | 2.0 | 0.4 |

A-D use vector dash arrays; E/F use repeated raster tiles with alpha masks,
including different corner and truncated tiles. E's regular horizontal tile is
1.2pt wide with mask bits110; F's is 2.4pt with101111. The dash/gap figures for
E/F are cyclic modal painted runs, not a native vector dash declaration.

Ruling: select E narrowly by minimizing absolute dash and gap error against
the source [1,3]pt: E=2.8pt versus runner-up B=2.96pt. Source hairline width is
not scored as a fixed point thickness. This is a small relative advantage;
every preset is substantially denser than the original. It is not an overall
visual-fidelity pass or a universal dashSmallGap scaling rule.

Produced two explicitly labelled research PDF copies by changing only the
dotted border paint operators of the preserved FlowDoc CLIS PDFs: 0.24pt width,
butt caps, [0.8,0.4]pt dash array and phase0. They are postprocessed vector
artifact trials, not unmodified FlowDoc exports or new Core support. Text,
path coordinates, header seam, footer strokes and all other operators are
unchanged. Word's raster tile seams/corner phases are approximated, not cloned.

Verification: both PDFs reopened; every word and its position is exactly equal
to the corresponding original. Page counts1/3 and row counts20,20/24/16 match.
Only the three intended graphics operators per selected border group differ;
26 groups changed per page, footer strokes unchanged. All four rendered pages
were visually reviewed without new clipping/overlap. The original eight input
PDF/DOCX hashes match. No product tests were rerun because no product changed.

Evidence: `dash-match-e-r1/measurements-and-output.json`, actual Word full-page
render and four output renders under the same evidence root. Deliverables:

- `dash-match-e-r1/CLIS-Word-E-vector-trial-20.pdf`.
- `dash-match-e-r1/CLIS-Word-E-vector-trial-60.pdf`.

Remaining boundary: these files demonstrate the selected pattern on the existing
CLIS layout only. General Core style support and native DOCX full-report use of
E have not been implemented or accepted. The earlier continuation-border Word
review remains separate and unresolved by this line-pattern experiment.

## Shared E profile implementation, 2026-10-26

The owner authorized adding E to Core's shared PDF/DOCX styles and generating
CLIS20/60 for actual Word conversion, preserving all originals and forbidding
integration. Single-room implementation/verification; Core owner, routine risk,
execution IDs not applicable. Scope: shared stroke enum, native DOCX mapping,
PDF paint, targeted/affected tests, local template guide and this receipt.
No model-version, Service, installation, publication or pagination-policy change.

Design ruling: `dashSmallGap` maps to the native Word border. PDF scales the
measured E vector profile linearly (0.24pt paint,0.8pt dash,0.4pt gap at nominal
0.25pt), while layout reserves the nominal envelope. Existing styles/defaults
stay unchanged. Exact agreement at unmeasured weights or raster tile seams is
not claimed; the known native0.5pt sample has different ratios. This limitation
is explicit rather than introducing a content-specific or piecewise fit.

Acceptance: authored/resolved validation, standalone/table DOCX mapping and PDF
stream equivalence; affected DOCX/PDF and stroke layout checks; packed Linux
consumer output; unchanged default PDF controls and original hashes; CLIS pages
1/3 with20/24/16 rows, repeated headers and unchanged header seam/footer. Actual
Word pagination and continuation border painting remain pending owner conversion.
Proof budget: one RED/GREEN cycle, one affected Linux run, one packed consumer
run and full scoped visual/structural review; repair only demonstrated failures.
Document budget: existing guide and this record; no new shared Work/Evidence
records or maps. Current inline host/model retained; no model override.

Scoped implementation/output receipt:

- Core commit `a1b7e6201ab0e7f5baf402921581841f9bfec050` on the existing isolated
  branch; no merge/push/install/version change. Native mapper, validation/type
  propagation and PDF buffered/streamed writers support the new named style.
- RED: six new/expanded cases failed on missing style support,35 passed.
  GREEN:43 targeted tests passed; build/type-check passed. The pinned Linux
  affected run passed321/321 with zero skips, covering all DOCX/PDF tests plus
  stroke layout. Runtime budget1GiB memory+swap,2 CPUs, init, network none and
  no mounts. Independent review found no runtime defect; stale guide wording
  referring to five styles was corrected. No full-suite acceptance is claimed.
- Packed public consumer generated both PDF and DOCX directly from Core,
  without artifact patching. CLIS sets dashSmallGap0.25pt while explicitly
  preserving the solid header seam at0.5pt; footer definition is unchanged.
  Every data row/value is retained. DOCX document XML is identical to R1 after
  removing border declarations; header/footer parts are byte-identical.
- Core PDFs remain1/3 pages with rows20 and20/24/16. Every extracted word and
  coordinate equals the earlier candidate; all26 styled border groups per page
  paint at0.24pt with [0.8,0.4]pt dashes. Default-input PDFs remain byte-identical.
  All25 previously preserved PDF/DOCX hashes match.
- All4 Core PDF and4 LibreOffice preview pages visually inspected. Preview
  pages remain1/3 with repeated headers/page numbers/totals and no lost rows or
  new clipping/overlap. However, LibreOffice paints this native preset as1pt
  dashed strokes despite authored0.25pt and distributes the60 items20/23/17.
  This preview difference is not tuned away or represented as Word behavior.
  Actual Word pagination, fragment closing rules and raster corners are pending.

Evidence under `shared-e-core-r1/`: `verification.json`, `affected-tests.json`,
source hashes, packed archive, consumer receipt/selected template, all rendered
pages and `preserved-inputs.json`. Four direct Core deliverables under
`shared-e-core-r1/artifacts/`:

- `CLIS-Core-E-R1-20.docx` and `CLIS-Core-E-R1-20.pdf`.
- `CLIS-Core-E-R1-60.docx` and `CLIS-Core-E-R1-60.pdf`.

Ruling: the scoped shared-style candidate and files are ready for the owner's
actual Word conversion. This is not acceptance of PDF/Word pagination fidelity;
preserve the candidate and originals, stop at this requested conversion checkpoint.

## Wide dash and lighter DOCX discovery probe, 2026-10-26

The owner requested finding a DOCX method closer to the original sparse pattern
and reducing darkness before adjusting PDF. Bounded discovery spike, Core owner
for any later integration, Evidence Reviewer role, execution IDs not applicable.
Retain Core commit a1b7e6201ab0e7f5baf402921581841f9bfec050, existing worktrees,
all old files and the no-merge boundary. No product changes or PDF tuning here.

Primary references establish two drawing-level mechanisms, distinct from
native table border presets:

- DrawingML dash stops express dash/space as percentages of stroke width:
  <https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.drawing.dashstop?view=openxml-3.0.1>.
- VML accepts custom dash/space ratios relative to stroke width:
  <https://learn.microsoft.com/en-us/windows/win32/vml/msdn-online-vml-dashstyle-attribute>.

One research DOCX contains five newly labelled samples A-E:

- A: native dashSmallGap0.25pt control, color666666.
- B/C: inline DrawingML custom geometry, stroke0.25pt, dash1pt/gap3pt,
  colors666666 and888888. XML uses dash stop400000/1200000 (400%/1200%).
- D: the same sparse666666 grid expressed as643 explicit1pt vector segments,
  separated by3pt gaps, to test independence from Word's dash-pattern handling.
- E: VML grouped lines with custom ratio4/12,0.25pt and666666.

B-D are normal-flow inline drawings, not floating page anchors. E is a VML group
in the paragraph flow; its internal coordinates are relative to that group.
These are drawn research grids, not yet native editable table border replacements.
Row resizing, cell attachment and multi-page continuation have not been solved
or claimed. A remains a real editable table for comparison.

Checks: ZIP integrity, intended dash ratios/colors, unique drawing IDs,3 inline
drawings and zero floating anchors, unchanged non-document package members,
one-page preview, caption/grid spacing and all25 preserved input hashes passed.
LibreOffice B/C vectors measure exactly1pt dash/3pt gap/0.25pt with the requested
gray values; D paints the explicit sparse segments. E's custom ratio is ignored
there and maps to dense0.25/0.25pt dashes. This does not establish Word behavior.
No product tests were rerun because product source/config/data are unchanged.

Deliver `word-wide-dash-r1/CLIS-Word-wide-dash-probe-R1.docx` under the existing
evidence root; `build_probe.py`, `manifest.json` and one-page render retain the
prototype and checks. Actual Word conversion of this one file is the next
prerequisite. Measure that result before selecting a drawing method or changing
PDF. No new shared Work/Evidence record, baseline, Core API or map was created.

## Actual Word wide-dash measurement and table-flow feasibility, 2026-10-26

The owner supplied the converted wide-dash probe and requested choosing B-E
against the original, plus checking dynamic multi-page table feasibility first.
Read-only Evidence Reviewer discovery, Core owner for future implementation,
single-room IDs not applicable. No new document, product change or merge.

The supplied one-page PDF identifies Microsoft Word for Microsoft 365. All
relevant page content was rendered and visually inspected. Actual measurements:

| Sample | Dash pt | Gap pt | Stroke pt | Gray | PDF line paths |
| --- | --- | --- | --- | --- | --- |
| B DrawingML | 1 | 3 | 0.25 | 0.4 (666666) | 7 |
| C DrawingML | 1 | 3 | 0.25 | 0.533 (888888, rounded) | 7 |
| D explicit segments | 1 | 3 | 0.25 | 0.4 | 643 |
| E VML | 0.25 | 0.75 | 0.25 | 0.4 | 7 |

Original Crystal PDF reinspection confirms all16 patterned strokes use [1,3]pt,
black and device hairline width0. B/C/D match the physical dash/gap lengths;
E remains4x too dense in period. Gray0.4/0.533 is intentionally lighter than
source black; exact perceived darkness cannot be equated to device hairline
without a fixed display/print resolution. Color/weight equivalence is not claimed.

Ruling: choose B as the primary drawing method, with C as the lighter color
alternative. D has no measured pattern advantage and uses643 rather than7 paths.
This replaces the earlier preset-E preference only for the custom sparse-dash
investigation; previous candidate commits and their limitations remain preserved.

Flow feasibility is NOT READY for dynamic tables. XML confirms B-D are804x40pt
inline frames, none inside native table cells; only control A is a native table.
Core currently emits native rows/cells and leaves row growth and pagination to
Word. These fixed frames do not resize or split their strokes at Word's cell or
page boundaries. Word treats inline objects as characters in the paragraph:
<https://learn.microsoft.com/en-us/office/vba/api/word.inlineshape>.
Moving a fixed grid with text is not dynamic table-border integration. This
conclusion is from package/source review; no actual multi-page Word experiment
was performed and no universal impossibility is asserted.

Recommended next bounded proof: retain native text cells and test row/cell-bound
B lines with short rows, wrapped expanding rows, rows splitting across pages,
repeated headers and footer clearance. Require actual Word border/text alignment
through all those cases. A fixed whole-page grid, blanket keep-whole-row rule or
manual page breaks cannot stand in for normal table flow acceptance. PDF tuning
and Core integration remain deferred until that feasibility is established.

Evidence: `word-wide-dash-r1/word-measurement-and-flow-review.json`, actual Word
PDF/hash, full-page render and original source hash under the same root. Probe
DOCX hash and all25 earlier input hashes match. No product tests were rerun
because source/config/data remain unchanged; existing Core commit a1b7e62 retained.

## Owner thick-thin 0.35 trial, 2026-10-26

The owner reported their own Word limitations and requested width0.35 with
compound thick-thin. Interpret0.35 as points for this reversible DOCX probe;
no edited owner DOCX was supplied to prove their exact settings. Evidence
Reviewer discovery, Core owner for later integration, execution IDs not applicable.
Keep current Core, all previous inputs and no-merge boundary unchanged.

DrawingML encodes exactly0.35pt as4445 EMU and compound as `thickThin`; this
is a shape outline setting, not a newly supported native table border width.
Do not silently quantize0.35 to an eighth-point table width. Compound indicates
one thick/one thin component, rather than0.35pt per component:
<https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.drawing.compoundlinevalues?view=openxml-3.0.1>.

One new file compares three inline drawing grids, all gray666666:

- A: thickThin0.35pt, physical dash/gap held at approximately1/3pt by setting
  dash-stop percentages285714/857143.
- B: thickThin0.35pt, previous400000/1200000 ratios retained, giving nominal
  physical dash/gap1.4/4.2pt as width increases.
- C: single0.35pt control with the fixed approximately1/3pt physical pattern.

The distinction tests the owner's observation that increasing width also grows
dash lengths. Actual Word compound painting remains unverified; no PDF profile
was changed. These are still fixed inline research drawings with the previously
recorded row-growth/page-fragment limitation, not dynamic table integration.

ZIP/XML checks, exact EMU width, compound/dash instructions, three inline frames,
unchanged non-document members and preserved input hashes passed. One full
LibreOffice preview page inspected: all labels/grids visible, no overlap/clipping.
No product test run because no product changed. The owner must convert the new
file through Word before native dimensions/appearance can be accepted.

Deliver `word-thick-thin-035-r1/CLIS-Word-035-thick-thin-R1.docx` under the same
evidence root, with provenance/checks in `manifest.json`. Original files retained;
Core a1b7e62 remains clean, no merge/push/install/publication or new baseline.

## Selected B DOCX and native Word PDF, 2026-10-26

The owner selected B and requested both PDF and DOCX to see its appearance.
Scope stated in chat: one-page selected-style pair, not a full CLIS or dynamic
table integration. Evidence Reviewer artifact work, Core owner for any later
implementation, single-room IDs not applicable. Preserve the existing worktree,
product source, old files and no-merge boundary.

Produced a dedicated DOCX retaining only the selected inline B grid: total
outline width0.35pt (4445 EMU), compound thickThin, gray666666, custom dash stops
400000/1200000, nominal dash1.4pt/gap4.2pt. No floating page anchor or Core API
change. Source DOCX and output DOCX hashes were checked before/after conversion.

The document connector had no connected session. Using the computer-use skill,
opened the new local copy in Word, declined updating fields, and saved as PDF
with Standard online/printing quality and open-after-export disabled. Existing
documents were not edited or saved by the agent. The first new window became
unavailable before export; the second open/export completed. No reason for the
window disappearance is inferred and no unrelated window was closed.

Actual PDF Creator/Producer identify Microsoft Word for Microsoft 365. One page
rendered and inspected, no clipping/overlap. ZIP/XML checks confirm one inline
grid and the selected settings. Native Word paints920 filled vector rectangles,
with regular horizontal dash1.4pt, gap4.2pt, thick component0.21pt, thin0.07pt,
inter-component gap0.07pt and total0.35pt. Gray is0.4. Thus the compound appearance
is now directly observed, rather than inferred from LibreOffice's approximation.

Deliver under `selected-b-035-r1/` in the same evidence root:

- `CLIS-selected-B-035.docx`.
- `CLIS-selected-B-035.pdf` (native Word export, not direct FlowDoc Core PDF).

`manifest.json` retains provenance, actual vector measurements and checks;
`word-pdf.png` retains full-page visual review. No product tests were rerun
because source/config/data are unchanged. Native dynamic table row resizing and
page continuation remain unimplemented; this pair proves the selected outline
only. No release/install/merge/push/publication or replacement baseline.

## Selected B black-only retry, 2026-10-26

The owner found the gray PDF too faint and authorized a black retry with the
same pattern. One-page artifact scope, Evidence Reviewer, Core owner for later
integration, single-room IDs not applicable. Preserve the gray pair and Core.

New DOCX changes only DrawingML stroke color666666 to000000 and its descriptive
caption. Exact normalized document XML and unchanged ZIP members verify no other
change. Width0.35pt, thickThin, dash1.4pt/gap4.2pt and inline geometry are retained.
Using Word UI, declined field updates and saved as PDF at Standard online/printing
quality. Creator/Producer confirm Microsoft Word for Microsoft 365.

Both versions have one page and920 filled vector border rectangles. All black
rectangle coordinates match the gray PDF within0.001pt, and every stroke fill is
black. DOCX/source PDF/source DOCX hashes remain unchanged after export. Full-page
render inspected without new overlap/clipping; no visibility guarantee at every
zoom or printer resolution is claimed. No product tests because no product edits.

Deliver `selected-b-035-black-r1/CLIS-selected-B-035-black.docx` and `.pdf` under
the same evidence root. `manifest.json` and `word-pdf.png` retain verification.
PDF is a native Word export, not a FlowDoc Core PDF. Dynamic table/page-flow
integration remains unimplemented. No merge, release, install or new baseline.

## Selected B full CLIS artifact trial, 2026-10-26

Owner accepted black B and requested its use in the CLIS structure and full
document outputs. Inline artifact implementation and evidence review in the
existing isolated lane; execution IDs not applicable. Core remains the owner
of any later general renderer feature. Scope: preserved CLIS20/60 sources,
editable native Word tables, black0.35pt thickThin custom dash1.4pt/gap4.2pt,
PDF/DOCX examples, unchanged pagination/header/footer, no main integration.

Produced full cases under the existing evidence root's `clis-b-row-flow-r1/`:

- `CLIS-B-row-flow-20.docx` and `CLIS-B-row-flow-60.docx`.
- Same-stem `.pdf` files exported through native Microsoft Word for Microsoft
  365 UI, Standard printing quality, field updates declined.
- `CLIS-B-row-flow-20-flowdoc-trial-r3.pdf` and corresponding60, vector-paint
  adapters over preserved Core PDFs, explicitly not direct Core exports.
- `build_trial.py`, `verify_trial.py`, `manifest.json`, `verification.json`
  and eight rendered full-page review images.

The prototype adds one custom DrawingML anchor to each native table row,
removes replaced dotted borders and retains the solid header seam. Paragraphs,
row-height/split flags, data, fonts, header/footer parts and page-break rules
are unchanged; no manual row-per-page cuts were introduced. Non-document ZIP
members are byte-identical, and normalized document XML differs only in the
added drawings and border declarations. B paint uses black, total0.35pt,
thick component0.21pt, thin0.07pt and component gap0.07pt, verified from Word
vector rectangles. Initial adapter PDF revisions are retained but superseded
by r3, which corrects compound offsets and the RGB stroke operator.

Checks confirm20 is1page and60 is3pages with20/24/16 rows; every source container
appears once, table headings/page numbers/footer totals remain on every page.
PDF trial text and character coordinates exactly match the preserved Core PDFs.
Relative to older styled Word exports, text positions differ by at most1.08pt
(20) and0.96pt (60); that comparison includes the prior border-inheritance change
and is not a same-source causal measurement. All four Word pages and four
FlowDoc paint-trial pages rendered and visually inspected; no new text clipping
or overlap observed. Original PDF hashes still match the retained manifest.

Result: artifact checks pass, with explicit unresolved limits. Row drawings
use measured fixed extents for this pinned one-line-body/two-line-header CLIS
fixture; wrapped or split growing rows are not supported by this adapter.
Word repeats the drawn header but still lacks the intermediate table-closing
rule on60 pages1/2. Vertical dash phase restarts per Word row, whereas the PDF
paint trial uses a continuous fragment stroke. Therefore this is a full-report
visual prototype, not a completed general Core style or exact PDF/DOCX parity.
No product tests run because Core source is unchanged at a1b7e62. General
integration and remaining continuation-edge behavior stay open; no merge,
push, publication, install or replacement baseline.
