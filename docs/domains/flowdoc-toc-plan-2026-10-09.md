# TextBlock Contents Implementation Plan

> For agentic workers: use superpowers:executing-plans for inline execution after
> written-plan review. Preserve the same-chat method; no separate implementation rooms.

**Goal:** Export a TextBlock-derived contents list with real clickable page numbers
and temporary bottom-right physical page numbers, without repaginating the document.

**Architecture:** Collect bound headings once, measure contents titles into a fixed
number-column layout and paginate alongside existing blocks. Index actual heading
positions once, fill reserved number slots, add footer numbers, then resolve link
geometry and subset/write the PDF. Generated contents do not clone the document graph.

**Tech Stack:** Existing TypeScript/Vitest, shaping runtime/PDF writer, PostgreSQL
Service and isolated Linux/amd64 Docker consumer. No new runtime dependency.

**Spec:** [TextBlock contents design](flowdoc-toc-design-2026-10-09.md).

## Authority Boundary and execution scope

Project Control owns this plan/status; Core owns model/layout/PDF, Service owns
consumer integration. Active role Planning Partner. Single-room execution IDs N/A.
Work size multi-step; risk routine. Written design accepted for planning by the
owner's instruction to proceed using the existing document. This implementation
plan still requires review before product edits. Core base e51ee7b, Service base
b7bf7d9; both development checkouts inspected clean. Use an isolated Core worktree
at execution; Service changes limited to examples/tests/package pin/README unless
inspection demonstrates a necessary model guard. No DB redesign or new migration.

Proof budget: focused red/green suites, one final full Core suite/build/package
check and Service database check, bounded resource comparison, visual and click
fixture. Repairs justify only affected reruns. Document budget: existing design,
this plan, roadmap locator and repository READMEs. Stop after acceptance. Retain
prior artifacts and release/tag 0.1.0; no push, map promotion or unrelated cleanup.

## Global constraints

- nodeModelVersion 8; preserve 4–7, images, merged tables and links.
- TextBlock props.toc is `{level:1|2|3}` and requires a valid unique anchorId.
- One root `table-of-contents` node maximum, shape `{id,type,props:{textStyleId}}`.
- Titles use bound visible text, whitespace normalized; empty selected title fails.
  Reading order is roots, authored rows/cells/children. No font-size inference.
- 12 pt indent per extra level, 12 pt gap, 36 pt number column; chosen text style.
  Title can wrap/split pages; page number belongs to the entry's first line.
- Every title fragment and entry number links to its heading. No dotted leaders,
  alternate labels, heading numbering or non-TextBlock source types.
- Physical page 1 includes cover/contents. Only model 8 documents with a contents
  node get temporary footer numbers, Sarabun regular 10 pt / 14 pt line box.
  Center that box in the bottom margin, right-align to content edge, require at
  least 2 pt clearance on either side (bottom margin >=18 pt). Never move content.
- Fill number slots once after pagination; if measured ink/height does not fit,
  fail contextually. No wrapping, shrink-to-fit or retrying whole-document layout.
- Target development versions Core/Service 0.1.5. No new variable master.

## Review focus

1. New model accidentally disabling model 7 link validation/geometry (Task 1/3).
2. Repeated format/header titles duplicating or pointing to the wrong copy (Task 1/3).
3. A long title crossing pages loses its first-line number or link fragments (Task 2/3).
4. Large number/italic overhang/footer margins silently overflowing (Task 3).
5. Per-heading scans or whole-layout repeats hidden by small fixtures (Task 4).

## Task 1 — contract, binding and ordered heading collection

Modify Core src/composition/resolvedDocument.ts, validateResolvedDocument.ts,
composeDocument.ts, src/template/types.ts, validateGraph.ts, validateTemplate.ts,
src/binding/expandRows.ts, src/layout/linkGeometry.ts and src/index.ts.
Create src/composition/contents.ts and tests/template/contents.test.ts.

Interfaces: export `ContentsBlock` through the public node union; `ContentsEntry`
is `{nodeId:string,anchorId:string,level:1|2|3,title:string}`.
`collectContents(document:ResolvedDocument):ContentsEntry[]` traverses reachable
nodes once in authored order and uses linkLabel for link text. Runtime failures
use existing LayoutError/source context; graph-invalid metadata uses Issue paths.
Template/bound graph both accept the new root; expansion prefixes its ID and
retains props/sourceMap without treating it as a table cell. Enable links for
models >=7, contents only >=8, with supported-version validation still exact.

- [ ] Write tests for literal/bound title collection, CRLF/whitespace normalization,
  levels 1/2/3, repeated formats with distinct anchors, duplicate title names,
  cell headings/repeated-header single entry, empty list and empty selected title.
  Reject missing anchors, invalid levels, unknown props, nested/multiple contents
  and pre-model-8 use. Assert model 8 preserves image/merged/link contracts.
- [ ] Run `npx vitest run tests/template/contents.test.ts`; observe missing support.
- [ ] Implement the interfaces above. No sorting or scan of all nodes per entry.
- [ ] Run focused tests, existing template/binding tests and `npm run build`;
  review diff and commit only on PASS.

## Task 2 — single-pass placement with reserved page-number slots

Modify Core src/layout/documentFlow.ts and src/pdf/drawContract.ts.
Create src/layout/measureContents.ts and tests/layout/contentsFlow.test.ts.

Interfaces: `measureContents(node:ContentsBlock,entries:ContentsEntry[],
style:TextStyle,available:number,runtime:TextRuntime):Promise<ContentsLine[]>`.
`ContentsLine` contains a MeasuredLine, indentation x offset, and optional
first-line number-slot description `{anchorId,style,widthPt:36}`. Keep internal
types with the module; `DrawDocument.contentsSlots?` holds placed
`{nodeId,anchorId,pageIndex,xPt,yPt,widthPt,style}` records for Task 3.
No empty placeholder glyphs or new public graph nodes are required.

- [ ] Write failing layout tests: exact 12/12/36 geometry, three indent levels,
  short/long Thai+English titles, several contents pages, entries crossing pages,
  a contents node following normal content and an empty list consuming zero height.
  Assert title wrap width excludes reserved number/gap, one slot per entry on
  first positioned title line, and failure when remaining title width is invalid.
- [ ] Run `npx vitest run tests/layout/contentsFlow.test.ts`; observe failures.
- [ ] Measure titles with existing measureText; generate reference spans using
  existing typed link data, never reshape fragments to estimate rectangles.
  Add a contents-root branch to documentFlow using the same page cursor/break
  rules as text. Collect once per document; no pagination recursion. Preserve
  unique draw-run/link IDs without inserting generated nodes into document.nodes.
- [ ] Run focused plus text/table/merged layout suites and build; review/commit.

## Task 3 — final destinations, number filling and footer painting

Modify Core src/layout/linkGeometry.ts, src/pdf/createPdfEngine.ts and drawContract.ts.
Create src/layout/fillContentsNumbers.ts, src/layout/pageNumbers.ts;
create tests/layout/contentsNumbers.test.ts and extend tests/pdf/createPdfEngine.test.ts.

Interfaces: extract `indexDestinations(document:ResolvedDocument,draw:DrawDocument)` from linkGeometry, returning
`NonNullable<DrawDocument['anchors']>` while retaining first nonblank actual line
and empty-target failures. `resolveLinkGeometry(document,draw,anchors?)` reuses
that index if supplied; existing callers remain valid.
`fillContentsNumbers(draw:DrawDocument,anchors:NonNullable<DrawDocument['anchors']>,
runtime:TextRuntime):Promise<void>` shapes actual pageIndex+1 in every slot.
`appendPageNumbers(document:ResolvedDocument,draw:DrawDocument,
runtime:TextRuntime):Promise<void>` adds the temporary footers only when enabled.
Both emit glyph runs before font subsetting, reusing measured ink-aware geometry.

- [ ] Write failing tests asserting correct page digits/links after added/removed
  content, forward/back headings and repeated headers; unchanged title/heading
  geometry before/after filling; first-line number when title spans pages;
  excessive number width/ink, too-small bottom margin and line-height errors.
  Check page numbers 1..N, right alignment, no overlap and no legacy footer.
- [ ] Run `npx vitest run tests/layout/contentsNumbers.test.ts`; observe failures.
- [ ] Wire engine order: documentFlow once -> indexDestinations once -> fill slots
  -> append footer numbers -> resolveLinkGeometry using index -> subset -> writer.
  Remove private slot metadata once consumed. Invalid generated geometry returns
  LAYOUT_FAILED with the contents node's source context. No new PDF action format.
- [ ] Instrument/mock layout invocation in an engine regression and assert exactly
  one invocation. Run layout/engine/writer suites and build; review and commit.

## Task 4 — packed PDF, resource budget and Service acceptance

Create Core fixtures/contents/template.json, tests/consumer/checkContents.mjs and
scripts/checkContentsResources.mjs. Modify scripts/checkPackedConsumer.mjs,
Dockerfile.consumer, package.json/package-lock.json and README.md.
Service: create examples/contents-template.json and tests/contents-api.test.mjs;
modify package files, vendor artifact/manifest and README.md. Inspect existing
model checks before deciding whether any Service source change is actually needed.

- [ ] Add installed-package fixtures for short/empty/long contents, contents after
  content, repeated-format and table-cell headings, long wrapped titles and
  source content growth causing target page shifts. Compare displayed numbers
  and PDF destinations to actual heading pages, not fixture guesses alone.
- [ ] Add a bounded 10/50/100-heading resource probe with a matched no-contents
  control, same runtime/title length/style. Run each variant in its own child
  process; record wall time and OS peak RSS with units. Include full Core child
  shaping process overhead or explicitly report that RSS excludes descendants.
  Record N/H/T/pages and deterministic traversal/layout counts; do not claim
  linear shaping, production capacity or hard latency guarantees from timings.
- [ ] Run full Core tests/build, then `npm run check:package`. Compare legacy PDF
  fixture results, render bounded representative pages and inspect actual links.
  Ask for the owner's focused click check if controllable viewer is unavailable.
- [ ] Add Service tests for current/published metadata roundtrip, old snapshot
  loading, model-8 job/download and invalid metadata rejection. Pin exact verified
  Core tarball/commit/checksum; run vendor verification/build/check:database.
- [ ] One final fresh read-only review of the branch; repair substantive findings
  with regression tests and affected verification. Record Core/Service commits,
  artifacts, owner visual/click result and resource limitations in this plan.
- [ ] After acceptance, integrate unchanged development candidate using valid
  proof reuse, preserve evidence, clean only current-run disposable containers,
  leave release/tag untouched and update the existing roadmap locator.

## Plan self-review and handoff

Contract/source scope -> Task 1; entries and bounded layout -> Task 2; final page
numbers/navigation/footer -> Task 3; package, Service, resource/visual evidence ->
Task 4. No storage architecture or generic footer work is hidden in these tasks.
Placement and filling use one shared reserved-column contract, so visible numbers
cannot affect title wrapping; implementation must prove this with tests.
Recommended execution is inline in this same chat, with one final fresh reviewer.
Written-plan review remains the next step; no implementation has started.
