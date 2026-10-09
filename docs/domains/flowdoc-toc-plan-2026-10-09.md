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
consumer integration. Active role Product Implementation Agent; final acceptance recorded inline. Single-room execution IDs N/A.
Work size multi-step; risk routine. Written design accepted for planning by the
owner's instruction to proceed using the existing document. The owner accepted this implementation
plan, with three levels as an initial supported limit, not a permanent ceiling. Core base e51ee7b, Service base
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
- TextBlock props.toc is `{level:number}` (validated to 1–3 initially) and requires a valid unique anchorId.
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
is `{nodeId:string,anchorId:string,level:number,title:string}`.
`collectContents(document:ResolvedDocument):ContentsEntry[]` traverses reachable
nodes once in authored order and uses linkLabel for link text. Runtime failures
use existing LayoutError/source context; graph-invalid metadata uses Issue paths.
Template/bound graph both accept the new root; expansion prefixes its ID and
retains props/sourceMap without treating it as a table cell. Enable links for
models >=7, contents only >=8, with supported-version validation still exact.

- [x] Write tests for literal/bound title collection, CRLF/whitespace normalization,
  levels 1/2/3, repeated formats with distinct anchors, duplicate title names,
  cell headings/repeated-header single entry, empty list and empty selected title.
  Reject missing anchors, invalid levels, unknown props, nested/multiple contents
  and pre-model-8 use. Assert model 8 preserves image/merged/link contracts.
- [x] Run `npx vitest run tests/template/contents.test.ts`; observe missing support.
- [x] Implement the interfaces above. No sorting or scan of all nodes per entry.
- [x] Run focused tests, existing template/binding tests and `npm run build`;
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

- [x] Write failing layout tests: exact 12/12/36 geometry, three indent levels,
  short/long Thai+English titles, several contents pages, entries crossing pages,
  a contents node following normal content and an empty list consuming zero height.
  Assert title wrap width excludes reserved number/gap, one slot per entry on
  first positioned title line, and failure when remaining title width is invalid.
- [x] Run `npx vitest run tests/layout/contentsFlow.test.ts`; observe failures.
- [x] Measure titles with existing measureText; generate reference spans using
  existing typed link data, never reshape fragments to estimate rectangles.
  Add a contents-root branch to documentFlow using the same page cursor/break
  rules as text. Collect once per document; no pagination recursion. Preserve
  unique draw-run/link IDs without inserting generated nodes into document.nodes.
- [x] Run focused plus text/table/merged layout suites and build; review/commit.

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

- [x] Write failing tests asserting correct page digits/links after added/removed
  content, forward/back headings and repeated headers; unchanged title/heading
  geometry before/after filling; first-line number when title spans pages;
  excessive number width/ink, too-small bottom margin and line-height errors.
  Check page numbers 1..N, right alignment, no overlap and no legacy footer.
- [x] Run `npx vitest run tests/layout/contentsNumbers.test.ts`; observe failures.
- [x] Wire engine order: documentFlow once -> indexDestinations once -> fill slots
  -> append footer numbers -> resolveLinkGeometry using index -> subset -> writer.
  Remove private slot metadata once consumed. Invalid generated geometry returns
  LAYOUT_FAILED with the contents node's source context. No new PDF action format.
- [x] Instrument/mock layout invocation in an engine regression and assert exactly
  one invocation. Run layout/engine/writer suites and build; review and commit.

## Task 4 — packed PDF, resource budget and Service acceptance

Create Core fixtures/contents/template.json, tests/consumer/checkContents.mjs and
scripts/checkContentsResources.mjs. Modify scripts/checkPackedConsumer.mjs,
Dockerfile.consumer, package.json/package-lock.json and README.md.
Service: create examples/contents-template.json and tests/contents-api.test.mjs;
modify package files, vendor artifact/manifest and README.md. Inspect existing
model checks before deciding whether any Service source change is actually needed.

- [x] Add installed-package fixtures for short/empty/long contents, contents after
  content, repeated-format and table-cell headings, long wrapped titles and
  source content growth causing target page shifts. Compare displayed numbers
  and PDF destinations to actual heading pages, not fixture guesses alone.
- [x] Add a bounded 10/50/100-heading resource probe with a matched no-contents
  control, same runtime/title length/style. Run each variant in its own child
  process; record wall time and OS peak RSS with units. Include full Core child
  shaping process overhead or explicitly report that RSS excludes descendants.
  Record N/H/T/pages and deterministic traversal/layout counts; do not claim
  linear shaping, production capacity or hard latency guarantees from timings.
- [x] Run full Core tests/build, then `npm run check:package`. Compare legacy PDF
  fixture results, render bounded representative pages and inspect actual links.
  Ask for the owner's focused click check if controllable viewer is unavailable.
- [x] Add Service tests for current/published metadata roundtrip, old snapshot
  loading, model-8 job/download and invalid metadata rejection. Pin exact verified
  Core tarball/commit/checksum; run vendor verification/build/check:database.
- [x] One final fresh read-only review of the branch; repair substantive findings
  with regression tests and affected verification. Record Core/Service commits,
  artifacts, owner visual/click result and resource limitations in this plan.
- [x] After acceptance, integrate unchanged development candidate using valid
  proof reuse, preserve evidence, clean only current-run disposable containers,
  leave release/tag untouched and update the existing roadmap locator.

## Plan self-review and handoff

Contract/source scope -> Task 1; entries and bounded layout -> Task 2; final page
numbers/navigation/footer -> Task 3; package, Service, resource/visual evidence ->
Task 4. No storage architecture or generic footer work is hidden in these tasks.
Placement and filling use one shared reserved-column contract, so visible numbers
cannot affect title wrapping; implementation must prove this with tests.
Recommended execution is inline in this same chat, with one final fresh reviewer.
Written-plan review accepted; inline implementation and bounded local acceptance completed.


## Execution ledger

- Owner clarification: three levels now, with future 5–7 levels anticipated.
  Keep numeric level in the data contract, one versioned validation ceiling and
  arithmetic indentation. Do not implement extra levels or level-specific branches.
- Core worktree: flowdoc-core-contents, branch codex/contents, base e51ee7b.
  Native worktree tool targets the Project Control checkout and cannot choose
  Core; Git fallback used for this separate owner repository.
- Task 1 PASS: 2d32415, 191 Core tests and build.
- Task 2 PASS: 38392f0, affected layout suite 49 tests and build.
- Task 3 PASS: faf12cc; affected layout/PDF suite 81 tests and build.
  Number filling retains prior line geometry; engine regression asserts one layout.
- Task 4 PASS: Core d95701f and Service 2a69fd6; details below. No release changes.


## Acceptance and development integration — 2026-10-09

PASS within the approved local contents slice. Execution IDs N/A (inline).

- Core 202 tests/build PASS; installed Linux package consumer PASS at
  `flowdoc-core/artifacts/worktree-archive/flowdoc-core-contents/1791516319251/result.json`.
  Final source commit `d95701f496e86c20837ea2b6d8094d8bef8523f4`.
- Consumer PDFs: short/empty, 50 entries across six pages, content growth/reflow,
  contents after content, a title spanning multiple pages, and a repeated table
  header source. All seven files pass `tests/consumer/checkContentsPdf.py` using
  actual extracted PDF text, annotation rectangles and referenced physical pages.
  Report: `contents-pdf-verification.json` beside the package result. It also
  checks first heading occurrence and temporary footer numbers/placement.
- Representative page renders inspected: long contents pages 1/2, table page 1,
  wrapped contents page 2. No clipping or content/footer overlap observed.
- Owner explicitly confirmed title and number clicks reach the right headings
  (H010/H040) in `artifacts/1791516093898/contents-long.pdf`. Byte equality with
  the final artifact was verified; interactive acceptance applies to that file.
- Prior PDF, binding, table, image, merged-table and link result groups equal the
  accepted 0.1.4 artifact `flowdoc-core/artifacts/worktree-archive/flowdoc-core-links/1791513405642/result.json`.
- One final read-only reviewer found an installed-PDF equality/table-case proof
  gap, not a demonstrated runtime defect. Closed with the PDF proof helper and
  installed table fixture above; no additional review round requested.
- Service vendor verification/build and real database check PASS, 101 tests,
  zero failures/skips: `flowdoc-service/artifacts/1791516437265/result.json`.
  Current/published model-8 metadata isolation, legacy model-4 load, API job/PDF
  and invalid level rejection covered. Service commit `2a69fd674e79ddb728859f306545338d76e1242b`.
- Both development packages are 0.1.5. Vendor SHA256
  `65e2e9213ea90966ad0e26f6312e7039f3174689e32592b7a935760c853eb2f9`.
  Core fast-forwarded unchanged into `codex/template-binding`; Service remains
  on `codex/template-registry`. Passing candidate proof reused on unchanged FF.
- Current-run Service containers/network removed after PASS, DB volume retained.
  Core consumer containers removed by the check. Evidence worktree retained;
  no old worktrees/artifacts removed. Release/tag 0.1.0 and remotes untouched.

### Bounded resource result and limits

`contents-resources.json` records separate installed Linux Node processes with
matched title lengths/styles and no-contents controls:

| Headings | No contents / contents wall ms | No contents / contents peak RSS KiB |
| --- | --- | --- |
| 10 | 514 / 688 | 62880 / 66332 |
| 50 | 1301 / 2102 | 81092 / 89676 |
| 100 | 2416 / 3709 | 92552 / 108040 |

RSS measures the Node parent and excludes native/Python descendant processes.
Single samples are observations, not production capacity or latency guarantees.
One-layout engine regression plus implementation inspection supports one ordered
collection, one destination index, H slot fills and P footer paints; no per-heading
node/line rescans or full-layout retry. Existing shaping costs are not claimed
linear. Broader architecture/storage/capacity remains deferred until after release.

Coverage maps to Tasks 1–4 above. No open blocker in this slice. Initial levels
remain 1–3 with a numeric contract; 5–7 is future scope. No frontend, DOCX,
image-in-cell, generic header/footer, DB redesign, map promotion or release update.
Next: owner chooses the next bounded scope; do not automatically expand contents.


## Owner-authorized release snapshot — 2026-10-09

Owner subsequently requested release 0.1.5 for both repositories, as one new
commit on each existing release branch plus an annotated v0.1.5 tag. This
supersedes the earlier no-release instruction for this bounded promotion only.
Inline integration role; execution IDs N/A. No runtime/source changes or push.

- Core release: `9ee6526263368ce18bf139d70adce1f000a3ccba`, parent
  `1aeacd045c4e1ab1c048edb27d4ddbe9267a3b75` (0.1.0).
- Service release: `3293a0519824ade1919da8857a017dd1c2224e07`, parent
  `ec51ce5f50be2e5aa37ebe4f72ba9f0000fe0cc7` (0.1.0).
- Each annotated `v0.1.5` resolves to its new release commit; both v0.1.0 tags
  retain their previous targets. Release history has one new version snapshot.
- Index tree equality before committing and zero full-tree diff afterward prove
  release contents exactly equal accepted development d95701f / 2a69fd6.
  Existing Linux package/PDF and Service database evidence above applies to those
  identical files, dependencies and configuration; no runtime behavior changed.
- Fresh checks: Core 202 tests/build; Service vendor checksum/build; both staged
  diff checks, full-tree equality, tag targets and clean workspaces PASS.
- Main checkouts returned to their original development branches. Release refs
  and tags remain local; remotes, data volumes and evidence worktrees untouched.


## Owner-authorized worktree cleanup — 2026-10-09

The owner requested removal of unused worktrees. The completed contents, links
and merged-table worktrees were clean and their HEAD commits were ancestors of
`codex/template-binding`. Removed only those three Git worktrees using normal
`git worktree remove` without force; branches, commits and release tags retained.
Primary Core/Service checkouts were not removed or switched.

Before removal, all ignored artifacts were copied to
`flowdoc-core/artifacts/worktree-archive/<former-worktree-name>/` and every file
was checked by SHA256 and file count: contents 124, links 99, merged-table 54.
Per-worktree hash manifests sit beside those archive directories. The artifact
locators above now point to the preserved copies. Embedded historical paths in
immutable result/vendor manifests retain their original provenance; resolve them
through this relocation mapping. Generated dist/node_modules were disposable.
No product code changed; Git status/ancestry, archive hashes and remaining
worktree inventory are the impact-scoped checks. Only primary checkouts remain
for Core and Service. This supersedes earlier worktree-retention notes, not the
recorded acceptance or release history.
