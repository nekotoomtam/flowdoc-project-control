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
