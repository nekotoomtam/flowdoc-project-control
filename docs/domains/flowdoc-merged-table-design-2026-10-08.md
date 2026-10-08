# Merged table cells — first design

## Authority Boundary

Owner: FlowDoc Project Control. Product owner: flowdoc-core; consumer:
flowdoc-service through its pinned package. This is a proposed public contract
and layout design, not implementation evidence or release readiness.
Active role: Planning Partner. Bounded explicit owner request; execution IDs N/A.
The owner approved the cell representation and height rule in conversation and
authorized starting. This document consolidates them with the compatibility and
pagination details discovered in current code, for written design review.
Routine risk, multi-step scope. No separate rooms, release, tags, push or maps.

## Goal and accepted decisions

Export tables with horizontal, vertical and mixed merged cells to PDF. Each
logical cell owns its content once; covered slots do not have placeholder nodes.
Cells declare a starting column and row/column spans. Layout determines pages.
Measure unmerged cells first; any height deficit of a spanning cell is added to
the last row it covers. Long content continues across pages without loss or
duplication. Existing ordinary tables remain supported.

Do not add images in cells, nested tables, column containers, new cell layout
controls, DOCX or frontend editing. The owner defers a richer cell container
until after 0.2.0. Existing multiple TextBlock children are already supported;
preserve that capability without expanding it into a general block container.

## Current implementation inspected

Core TableCell currently has empty props and childIds; TableRow has cellIds and
allowBreak. Validation requires one cell per column. Binding clones each cell
and its children, and expands one row template per array item. documentFlow.ts
measures cells against individual column widths and paginates whole measured
lines with independent cell cursors. A single header can repeat. Source maps
retain original node and invocation identities.

Sources: Core src/composition/resolvedDocument.ts,
src/template/validateGraph.ts, src/binding/expandRows.ts and
src/layout/documentFlow.ts at development commit 1790f26e.

## Contract proposal

Introduce nodeModelVersion 6 for explicit cell placement, keeping model 4/5
validation and ordinary-table output unchanged. Model 6 retains model 5 image
support outside tables. The model number is independent of package versions.

Keep the existing graph: table.rowIds -> row.cellIds -> cell.childIds. The row
owning a cell is its starting row. Cell props add:

```json
{"columnIndex": 0, "rowSpan": 2, "colSpan": 1}
```

columnIndex is zero-based. Omitted spans equal 1; explicit spans must be positive
safe integers. A table using explicit placement must specify columnIndex for
every authored cell, including cells with span 1. An ordinary table may retain
empty props and the existing positional mapping. Do not mix implicit and explicit
placement in one table. This avoids guessing placement around occupied slots.

A fully covered row has empty cellIds and still exists as a logical row. An
intentionally blank uncovered slot requires a real cell with empty childIds.
No content copy or reference to a second parent is created for covered slots.

## Validation and binding

Before layout, build a bounded occupancy representation from column and row
counts. Validate integer coordinates, bounds, overlap and complete coverage.
Avoid allocating based on an untrusted span; check against actual grid bounds
first. Errors identify the relevant table/cell path and source identity.

Retain one header row for this iteration. Horizontal merging in that header is
allowed; a rowspan cannot cross the header/body boundary. A rowspan cannot touch
a row-template repeat, either by starting in it or spanning into/across it.
Colspan within a repeated row is allowed. This makes empty, one-item and many-item
expansion unambiguous. Validate both template and composed graph.

Binding preserves props and clones each real cell once per existing invocation;
it does not manufacture covered cells. Existing variables and source-map rules
remain unchanged. No database schema change or new variable master is needed.

## Measurement and height

Reuse the existing text measurer and font pipeline. Width is the sum of covered
columns minus existing horizontal padding. Measure every real cell once and
retain measured lines for placement.

Initialize each row with existing minimum padding height. Cells with rowSpan 1
set the row minimum from their measured content. Process spanning cells by ending
row, then starting row and column for deterministic results. When the sum of the
covered row heights is less than the cell's content plus padding, add only the
deficit to its ending row. Previously satisfied constraints remain satisfied
because heights only increase. Do not distribute extra height among all rows.

No new vertical-alignment setting: content begins at the top of its logical cell.
Empty cells still contribute their border and minimum geometry.

## Pagination and borders

Separate logical cells from their page fragments. A fragment references the same
cell/source IDs and consumes only its pending measured lines. Never repeat body
content on continuation pages. Finished content leaves the remaining cell region
blank; borders continue through the cell's remaining logical extent.

Choose page cuts that do not bisect a measured line. Preserve logical row heights
and rowspan occupancy when multiple cells have different line heights. A page cut
may fall inside a merged cell; it must not cause an internal row separator to be
drawn across that cell. At the physical page edge, close the visible table fragment
and reopen its continuation on the next page. Draw shared edges once.

allowBreak=false protects that logical row from an interior page cut; it does not
make a rowspan spanning several rows indivisible. Cuts at valid row boundaries
remain possible. If a protected row or a whole next line cannot fit on a fresh
page with the required repeated header, fail with source identity rather than
clipping, looping or silently ignoring the setting.

Repeat the single header when configured, including horizontal merged cells.
Reserve space for pending body progress before emitting a header; no header-only
page. Keep text/tables/images before and after the table on the shared page cursor.

## Alternatives considered

1. Explicit anchors and spans (recommended): one content owner, deterministic
   validation, and compatibility with future richer cell children.
2. Placeholder nodes in covered slots: larger graphs and ambiguous ownership;
   not selected.
3. Always move an entire merged group to the next page: simpler placement but
   fails the accepted long-content requirement; not selected.

## Acceptance and proof budget

Use focused test-first validation/binding/layout cases, then Core regression and
one final packed Linux consumer. Inspect a bounded PDF fixture set. Pin the
verified package in Service and exercise registration/publication/API export;
use existing unchanged lifecycle evidence. Repeat only on a change or failure.

- Accept horizontal, vertical and mixed spans; reject overlap, holes, bad spans,
  out-of-range coordinates, mixed placement, header crossing and repeat crossing.
- Repeated horizontal merged rows work for zero, one and multiple items.
- Long Thai/English content uses merged width and deterministic row heights.
- On continuation pages, each body line appears once, borders do not cross merged
  interiors, repeated headers are correct and subsequent nodes do not overlap.
- Cover differing line heights, fully covered rows, blank cells, exact page ends,
  multi-page cells and allowBreak=false fit/failure cases.
- Old model 4/5 ordinary tables and existing text/image fixtures retain behavior.
- Service consumes the exact checked Core artifact; existing snapshots remain
  readable. No release promotion is part of this work.

The implementation plan follows written design review. No product files have
changed while preparing this design. Open risk: legal page cuts across several
spanning cells require explicit progress tests; do not claim Word pagination
equivalence or multi-level header support.
