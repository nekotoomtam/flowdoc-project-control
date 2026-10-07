# Export MVP R2 — simple table PDF flow

## Authority Boundary

Project Control owns this bounded plan/result. Core owns implementation. Owner
authorized continuous inline work after binding, stopping for actual blockers.
Role: Product Implementation Agent / Documentation Synthesizer. Execution IDs:
not applicable. Medium work, routine risk. Use existing codex/template-binding
branch from 3a99ec4; preserve unrelated scratch. No merge/push/release branch.
Scope derives from locked MVP and R1; no new approval ceremony is required by
the owner's explicit instruction. This record does not promote shared maps.

## Design and scope

Extend existing measured text flow, not a second PDF engine. Extract reusable
line measurement from textFlow; retain ICU/Rust shaping and glyph/Unicode writer.
Tables use fixed declared column widths, left alignment, 4 pt cell padding and
0.5 pt black borders as internal MVP defaults, without new public style knobs.
Each cell can contain multiple TextBlocks. Row height is maximum cell content
height plus padding; blank cells remain blank and empty tables show only headers.

Split allowBreak=true rows at whole measured lines with independent cell cursors;
each fragment shares the source row/cell/node identities. Finished columns stay
empty on continuations, not duplicated. Repeat the single header when requested.
Never emit a header-only page when the first pending body line cannot fit; move
the header with body. allowBreak=false moves intact to the next page and fails
if it cannot fit there. Oversize header, column width, grapheme or line yields
LAYOUT_FAILED with source identity, never clipping or a no-progress page loop.
Text before/after and multiple tables share the page cursor. No preflight render
or total-page estimation pass; measure once and place measured lines.

Allowed: Core layout/validation/draw writer, tests/fixtures/consumer/version/docs;
this record and previous result's next-step link. Excluded: Service/DB, images,
DOCX, nested/merged tables, multi-level headers, general performance work. Native
algorithms remain untouched. Package dev.4; retain dev.3 artifacts.

## Tasks and proof budget

1. Write failing layout tests for short/empty/multi-page tables, mixed root flow,
   repeated/non-repeated header, multi-block cells, different line heights,
   nonbreaking and oversize rows, column widths and exact line identity coverage.
   Extract measureText.ts, add documentFlow.ts/table pagination and private border
   draw commands. Reuse original textFlow path for text-only byte parity.
2. Reuse structural validateGraph at PDF boundary; preserve strict unknown props,
   source-map validation and contextual failures. Filter glyph commands in font
   subset/writer; add border-only drawing without changing text primitives.
   Verify focused tests/build before whole-suite checks.
3. Installed consumer imports raw SRS template/request and generates short,
   empty, multi-page examples. Long row must continue, header must repeat, body
   tokens occur once. Inspect extracted text/font reports/all rendered pages.
   Existing three text PDF hashes must remain unchanged. One packed consumer
   run plus bounded repairs; one fresh final review, fix concrete defects only.
4. Record actual evidence/limits, commit checked changes and stop. Table PDF
   acceptance is not full MVP acceptance; Service/DB remains subsequent work.

Plan interface check: measured lines retain GlyphRun geometry without page
coordinates; placement adds coordinates/unique run IDs. Private border commands
must be excluded from font extraction. Public ResolvedDocument union is already
present from binding. No schema extension or data migration required.

Implementation ruling: borders use a separate optional private DrawPage.borders
list, preserving GlyphRun-only commands and the existing font subset path. This
avoids broadening every font consumer and keeps text-only hashes unchanged.
The existing old table paginator was inspected: it depends on old prepared-row
and cursor schemas. This slice uses local per-cell cursors on the new measured
lines rather than importing the old publishing/resolution contracts.

## Result — PASS for the simple-table slice

Core commit `a2fcce4` on `codex/template-binding`; no merge or push. Existing
untracked `.superpowers/` from the earlier round was left untouched. Owner's
release-branch/tag decision remains for the eventual release, not this commit.

Implemented shared measured text lines, root text/table flow, independent cell
cursors, repeated single headers, whole-line row continuation, unbreakable-row
failure, fixed cell padding/borders and contextual errors. Public graph/schema
is unchanged. Private borders are separate from glyph commands; native shaping,
font subsetting and glyph/Unicode PDF algorithms remain unchanged.

### Acceptance coverage and checks

- `tests/layout/documentFlow.test.ts`: short/empty/long table, repeated/omitted
  header, header/body fit, mixed root flow, multiple TextBlocks/different line
  heights, nonbreaking rows, impossible widths/header/line/grapheme and unique
  body-line/command identity. Existing textFlow tests cover shared measurement.
- `tests/pdf/createPdfEngine.test.ts`: malformed graph rejection before native
  work, cleanup and structured diagnostics; new 10,000-node invalid-chain case
  rejects without stack overflow and preserves nodeId for malformed properties.
- `tests/consumer/checkTable.mjs`: actual installed root API with raw templates
  and requests, short/empty/long outputs, oversize unbreakable row with original
  content/node context, unchanged inputs and empty temporary directories.
- Observed failing layout tests before implementation; final build passed and
  **125 tests in 14 files passed**. Final `npm run check:package` passed after
  review repair. Package, validation, existing binding/text/font/writer and new
  table consumers are covered. No Service/DB or load acceptance was attempted.
- One fresh read-only review found recursive traversal of malformed graphs
  escaping Result, plus a nodeId diagnostic regression. Both reproduced RED and
  passed GREEN after iterative traversal and restored structured identity.
  Regraded the diagnostic finding from minor to necessary compatibility repair:
  existing callers should not have to parse paths to recover a node ID. No
  review findings remain deferred. No second review or unrelated polish pass.

### Final artifact

Core `artifacts/1791389246204/`:

- `flowdoc-core-0.1.0-dev.4.tgz`, SHA-256
  `96be5988714e44a95f2aa67c84c1be86ec7ba1c6b2ab2a7fe54d02d361cb5878`;
  72 package entries, no source/tests/fixtures/scratch workspace shipped.
- Consumer image
  `sha256:3564b9410dced984c4c6f8caa897bce9c1e484452021cd9af4fdcf9b16f8c85c`;
  pinned Linux/amd64 dependencies, non-root, network none and no host source mounts.
- `table-short.pdf`: 1 page / 31380 bytes, SHA-256
  `723404ed9cab14c8584770b1af27a30a41b5f4e122ae515955932aebd3b9fdc3`.
- `table-empty.pdf`: 1 page / 23304 bytes, SHA-256
  `5e0559510de1d67f75e98b33834ca6ca4e568f7653b3b12989b7dcc2f8f1d065`.
- `table-long.pdf`: 3 pages / 164497 bytes, SHA-256
  `ba56b114b57c3fb5da1a0840940d68d3406ec509ba7ccc86c1ce5fcd30f1fdb3`.
- `result.json`, `table-result.json`, `table-host-checks.json`, `inventory.txt`,
  consumer lock, resolved graph/expected text JSON, extracted text, font reports
  and page PNGs retain inspectable proof. Host helper is
  `artifacts/check-table-output.mjs` (verification-only output).

Host checks verify full body character coverage (ignoring whitespace), all 68
unique LINE tokens and 15 ITEM tokens exactly once in order, one combined header
row per page and embedded subset font/Unicode maps. All five rendered pages were
inspected: no lost/overlapping/clipped content, continuations LINE033→034 and
LINE067→068, completed cells blank on continuation, final rows and paragraph intact.
The initial helper counted the word หมายเหตุ inside a body remark as another
header; it was corrected to count the combined header row. This was a proof
helper error, not a product change or waived failure.

Final six PDFs match the visually checked candidate in `artifacts/1791389001500/`
byte-for-byte after graph-guard repair. Text/font/visual results are reused on
that exact-hash basis. The three older text PDFs also retain their dev.3/P4 hashes.
Completed consumer containers removed after retrieval; no broad Docker cleanup.

### Scope rulings and next work

- Parent performed package/PDF verification which the reviewer declined to
  independently repeat. No missing mandatory proof is hidden by that division.
- Broad load/resource limits, nested/merged tables and configurable cell styling
  remain excluded. Cost: this proves the simple SRS-like table slice, not arbitrary
  Word parity or production queue capacity. Fixed 4 pt padding / 0.5 pt borders
  are MVP rendering defaults, not newly supported schema fields.
- Table fixture uses 12/20 pt body typography to fit measured Thai ink; earlier
  illustrative R1 12/18 values were not silently treated as guaranteed fit.
- Next: owner review of the sample PDF, then R3 DB/template registration and R4
  API/job lifecycle within locked MVP. No frontend/DOCX/images added. This result
  does not itself complete the end-to-end MVP or promote shared system maps.
