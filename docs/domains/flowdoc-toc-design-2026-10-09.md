# TextBlock table of contents — proposed design

## Authority Boundary

Owner: FlowDoc Project Control. Status: implemented and accepted in the bounded local slice; proof is linked from the implementation plan.
Active role: Planning Partner. Single-room design work; execution IDs N/A.
Core owns document contracts, layout and PDF; Service consumes the checked Core
package and retains template versions. This document does not prove implementation.
Work size: multi-step; risk: routine. Architecture question: page-dependent text
must not invalidate the layout used to compute its page numbers.
Document budget: this design, then one implementation plan after written review.
Proof budget: contract/binding/layout tests, packed PDF fixture, Service roundtrip,
visual and owner click checks. No capacity investigation or release promotion.
Accepted baseline: links slice Core e51ee7b and Service b7bf7d9, development 0.1.4.

## Confirmed owner scope

- Sources are TextBlock nodes only. Do not introduce generic outline semantics
  for images, tables or other node types.
- First physical PDF page is page 1, including cover and contents; continuous
  Arabic page numbers. Custom start/offset/roman numbers are deferred.
- Show a temporary bottom-right page number on each page. Keep this output
  separate from content layout. General headers/footers are deferred until after
  release; this temporary behavior must not become a general footer subsystem.
- Continue API/Core workflow without a frontend. Keep release/tag 0.1.0 unchanged.

## Proposed input and collection

Introduce the next node model (8), preserving models 4–7 and their fixtures.
Add optional TextBlock metadata `toc: {level: 1|2|3}` in props, alongside its
existing unique anchorId. Only explicitly marked blocks participate; never infer
headings from font size. Three levels are the accepted initial limit, not a permanent ceiling; the owner
expects a future need for 5–7. Keep the numeric data shape and compute indentation
from the level, with the current supported ceiling centralized in validation.

Use the bound TextBlock's visible text as its entry title, including resolved
string/link labels. Normalize line breaks and whitespace to spaces for the entry;
retain the original heading content. Empty resulting titles fail with source
context. Custom alternate titles and automatic heading numbering are deferred.
Repeated formats produce entries after binding, with unique anchors supplied as
in the links slice. Duplicate displayed titles are valid; duplicate anchors are not.

Collect headings in document reading order: root order, table row order, authored
cell order and child order. Marked TextBlocks in table cells remain TextBlock
sources; their first physical positioned line is the destination. Repeated table
header copies never duplicate the entry. No table/image node becomes a source.

Provide one root-level `table-of-contents` node per composed document, with a
textStyleId. It can occur at the caller-chosen root position; it cannot be nested
in a cell or repeated to create multiple contents lists. An ordinary TextBlock
before it can supply the visible title such as สารบัญ. Zero selected headings
produces zero entries; multiple contents nodes fail explicitly. Metadata without
a contents node is allowed and produces no contents list.

## Approach choice

1. Fill page numbers into ordinary flowing text and repeat whole-document layout:
   flexible, but numbers can change wrapping and cause another pagination change.
2. Reserve a fixed number column and fill it after pagination (recommended):
   entry geometry is independent of the number string, so no page-count fixed
   point loop is needed. Extra-wide numbers must fail rather than silently wrap.
3. Put the contents outside the document: simpler, but fails the requested
   in-document contents behavior and is excluded.

For option 2, measure titles using the existing shaping/wrapping implementation.
Each entry has level indentation, a title area, a gap and a reserved right-aligned
number column. Provisional geometry: 12 pt indentation per level, 12 pt gap,
36 pt number column; validate remaining title width. Use the chosen text style
and its line height. No dotted leaders or added styling controls initially.

Paginate entries with the rest of the content, allowing multi-line titles and
multi-page contents. Each visible title fragment is clickable; its page number
is also clickable. Number appears on the entry's first line. Both refer to the
same anchor using existing reference semantics and glyph-based hit areas.

After all content is positioned, resolve each target's first nonblank physical
line. Shape and place the actual page number within the reserved column without
changing entry height or title wrapping. Validate horizontal and vertical fit;
if it cannot fit, return a contextual layout error. No clipping, shrinking,
extra page insertion or stale guessed number. This makes the no-relayout claim
conditional on explicit fit checks, which must be demonstrated in implementation.

## Temporary page numbers

For model 8 documents containing a contents node, paint physical page numbers
1..N on every page, after content pagination and before font subsetting/PDF writing.
Use a small fixed Sarabun regular style (proposed 10 pt, 14 pt line box), right
aligned to the content right edge and centered in the bottom margin. Require the
bottom margin to fit that line box plus clearance; fail explicitly if insufficient.
Do not change margins, reserve new body space or overlap content. Documents without
contents and legacy models retain their prior behavior in this initial proposal.
The implementation plan must keep number painting replaceable independently of
contents collection and future header/footer configuration.

## Validation, compatibility and Service

Validate model-gated node/metadata shapes, level range, required anchorId, composed
contents count, title emptiness and number fit. Keep stable source mapping for
generated entries. No new variable master type is required; source titles use
existing fields and binding. Service must roundtrip the model 8 graph and metadata
through current and immutable published versions and export through the job API.
Proposed next development version: Core/Service 0.1.5, confirmed at planning time.

## Resource budget and deferred architecture review

Owner accepted adding a bounded complexity/resource budget and deferred the
broader architecture, storage and retrieval discussion until after release.
This is a follow-up topic, not permission to redesign DB/storage or add a capacity
benchmark project to the contents slice.

Design targets, not measured performance claims:

- N nodes, L positioned lines, H selected headings, P physical pages and T total
  heading-title characters. Collect headings in one ordered graph traversal:
  O(N + T), including title extraction/normalization; no unnecessary sorting.
- Build/reuse a destination index in O(L), with average O(1) lookup per heading.
  Do not scan all nodes or positioned lines again for each heading.
- Shape/wrap contents titles with the existing engine. Its cost is dependent on
  text and the shaping/break algorithm; do not label it O(T) without evidence.
- Fill H reserved number slots and paint P page numbers once, including the cost
  of shaping their digits. Neither step may trigger full-document relayout.
- Extra contents bookkeeping: O(H) records plus O(T) title storage and generated
  contents draw data. Do not clone the whole document solely for the contents.
  This is not a claim about total renderer or concurrent-job memory consumption.

Implementation proof should include a bounded increase in heading count, elapsed
layout/export time and peak memory in the same runtime, plus inspection or
instrumentation for repeated graph scans and full-layout invocations. Record
fixture sizes and separate the contents overhead from existing text/image work.
No production throughput target is inferred; whole-system capacity and storage
architecture remain the explicitly deferred post-release discussion.

## Acceptance and limits

- Explicit selection, reading order, three levels, repeated formats, duplicate
  titles, missing/duplicate anchors, empty list/title and malformed inputs.
- Single/multi-page contents, long Thai/English titles, heading on later page,
  heading spanning pages, repeated table headers, contents placed before or after
  content, and addition/removal of content shifting actual destination pages.
- Assert every displayed number equals its target's final physical page, and
  filling number slots does not alter layout. Test narrow/insufficient margin
  and oversized number failures instead of silently accepting overlaps.
- Page numbers bottom-right on every relevant page without changing content flow;
  all fonts subset correctly and old PDF fixtures preserved.
- Installed Linux package, Service publication/job PDF, rendered pages and real
  PDF navigation. Owner testing can close the interactive check if automation
  remains unavailable; do not equate annotations with actual clicks.

No generalized headers/footers, alternate numbering, multi-contents lists,
non-TextBlock sources, DOCX, frontend, image-in-cell or release promotion.
Owner confirmed proceeding with this existing design after the resource-budget
addition. The next artifact is [the implementation plan](flowdoc-toc-plan-2026-10-09.md);
its review precedes product implementation.
