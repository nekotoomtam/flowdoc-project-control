# Text Block V4 Measurement and Pagination

## Authority and Scope

This candidate leaf records the bounded v4 contract for resolved measurement
source mapping, accepted text-line ranges, and isolated line pagination. It is
pinned to `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0`.
It follows the candidate [V4 Authoring and Inline](v4-authoring-and-inline.md)
leaf, but does not promote Text Block family truth, product readiness, or
source-cleanup authority.

## Resolved Measurement Source Contract

`VNextResolvedDocumentV1` preserves the authored v4 document, resolved field
and image bindings, style bindings, revision and pin facts while its execution
fields are `inputFetch`, `authoredGraphMutation`, `generatedExpansion`,
`pagination`, and `rendering`: `inputFetch`, `generatedExpansion`,
`pagination`, and `rendering` are `not-run`, while `authoredGraphMutation` is
`false`; there is no `measurement` execution field. The measurement request
carries a specific text block's rendered text and runs together with document
id, instance revision, section id, width, profile, and style identity.

An authored text run retains its local UTF-16 authored/resolved offset. A
resolved field run retains its authored `inlineId` and can have multiple
resolved offsets inside one atomic authored placement. Hard breaks and inline
images retain atomic endpoints; images also carry resolved asset/frame facts.
Unresolved field or image bindings block request construction.

Measurement source points contain `textBlockId`, `inlineId`, `authoredOffset`,
`resolvedOffset`, and boundary affinity. For a field, `authoredOffset` is only
`0` or `1` while `resolvedOffset` identifies the displayed value boundary.
These points support measured-range and fragment provenance; they must not
become editor caret offsets. A generated page-number blocks a resolved-document
measurement request until a separately owned expansion supplies page-specific
text and its owner fingerprint. This leaf does not perform that expansion.

## Accepted Line Range Contract

`acceptVNextTextBlockV4MeasuredLines` accepts externally measured lines only
when indexes start at zero and remain contiguous, ranges are ordered
non-negative integers, and the rendered stream has complete, gap-free coverage
without overlap. Each line must have finite non-negative width, positive finite
height, and safe UTF-16 source boundaries. A canonical empty block still has
one zero-range measured line.

Each accepted line receives canonical/resolved `sourceStart` and `sourceEnd`
points. At a run boundary, affinity selects the adjoining safe point. A field
value may span many accepted lines and preserve its single atomic authored
placement alongside different derived resolved offsets. The accepted result is
data only: it does not select a text engine, break lines, mutate authored
content, or execute pagination.

## Isolated Pagination Contract

`paginateVNextTextBlockV4Lines` consumes only accepted lines. It validates a
positive finite page-body height and rejects any measured line taller than that
body. It packs whole accepted lines in order, moves a line to the next page
when necessary, and never remeasures, rewraps, or splits a line.

Every occupied page receives one derived fragment for the same canonical text
block. The deterministic fragment id combines node id, page index, and its
inclusive line span; the fragment retains the exclusive ending index,
source-start/source-end points, page-local offsets, used height, and remaining
height. Pagination allocates fragment identity only. It does not allocate an
authored node or inline identity, mutate the document, relayout a renderer, or
turn resolved field offsets into editor positions.

## Bounded Close-Audit Result

The isolated 6,000-line/250-page scale check constructs 6,000 accepted measured lines, places 24
whole lines on each page, and produces 250 deterministic pages/fragments under
the local 1.5-second regression threshold. The first and final slices retain
their line/source facts. This is evidence for the isolated text-line contract;
it is not general performance readiness or product readiness.

The close audit allows columns and table split planning to consume retained
text-line fragments. It does not mark columns, tables, a mixed document, or a
complete product as implemented.

## Explicit Exclusions

This candidate leaf excludes choosing or executing a shaper, font loading, and
line breaking; generated page-number expansion; mixed-node composition,
columns/table flow policy, and generated document composition; renderer/export
or artifact bytes; backend jobs or lifecycle execution; cross-page DOM/caret behavior; and general performance readiness. It also excludes browser input,
IME, clipboard, selection painting, viewport windowing, backend persistence,
and any claim of a mixed-document scale threshold.

## Current Verified State

At the pinned Core commit, resolved documents retain the bindings required to
form a v4 request; measurement validates and maps accepted line results; and
pagination creates isolated deterministic fragments from those accepted lines.
The direct checks cover measurement source ranges, pagination, and the close
audit. No runtime execution flag is advanced by these modules.

## Risks and Unknowns

Resolved field values can yield many lines from one atomic authored slot, so
the resolved mapping remains unsuitable for editable caret offsets. Inline
image baseline/line-height integration, widow/orphan policy, keep rules,
mixed-node composition, page-number layout cycles, renderer memory, backend
thresholds, and cross-page browser selection remain separate risks or unknowns.

## Evidence Anchors

Immutable local anchors at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0`:

- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/resolution/resolvedDocument.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/pagination/textBlockV4Measurement.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/pagination/textBlockV4Pagination.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV4Measurement.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV4Pagination.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV4ReadinessCloseAudit.test.ts`
