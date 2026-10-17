# Text Block V4 Authoring and Inline

Documentation state: `candidate`

## Authority and Scope

This candidate leaf consolidates the bounded V4 authored-inline contract that
was verified against immutable Core evidence. It is not shared current product
truth, a migration/publication record, or authority to change source
disposition. Its source closure is **3 assigned / 3 unique / 0 missing / 0 extra / 0 drift**.

## Responsibility Boundary

This leaf owns one text block's authored V4 inline shape, deterministic
selection identity, explicit atomic/field command planning, and the
single-user whole-rich-inline replacement preparation/application boundary.
It does not make an input surface, collaboration mechanism, persistence path,
or layout/rendering system authoritative.

## V4 Flat-inline Grammar and Projection

A V4 text block has five flat inline forms: text, field-ref, line-break, page-number, and inline-image. The only canonical empty representation is
`children: []`; empty text leaves, DOM sentinels, and placeholders are not
authored content. Inline identities are unique within their owning text block.

Text contributes literal UTF-16 length to the model projection, line-break
contributes a newline, and each other atomic contributes one U+FFFC slot.
Rendered field values or labels, page digits, and image dimensions do not
change authored offsets. Field refs require a key in the pinned field contract
and a scalar inline-compatible type; page number placement is limited to
static header/footer zones.

## Canonical Selection

A non-empty selection is a pair of anchors in one text block, each identified
by text-block id, inline id, inline-local UTF-16 offset and affinity. Text
offsets may not split surrogate pairs. Atomics accept only offset `0` before
or `1` after; affinity chooses the neighboring identity at a shared boundary.

An empty block uses its canonical null-inline caret: `inlineId: null` with
offset `0`. A block offset is adapter input only and is deterministically
translated into the inline-local anchor; page, line, DOM, glyph, and screen
coordinates are projections rather than selection identity.

## Atomic and Field Command Planning

`field-ref.insert`, `line-break.insert`, `page-number.insert`, and
`inline-image.insert` plan a complete replacement child list from a canonical
caret. `atomic.remove` targets only a non-text inline and chooses the prior
end, next start, or canonical empty caret deterministically.

New atomics and an inside-text split use explicit caller-supplied inline identities. A split retains the source identity on the left and requires the
right identity; no time- or random-based allocator is part of this boundary.
Planning validates both current and proposed grammar, returns identity facts,
and neither mutates a document nor creates history. The plan remains behind
`text-block.rich-inline.replace` for policy preflight and accepted application.

## Whole-rich-inline Replacement

`text-block.rich-inline.replace` replaces the complete child list of one text
block. An accepted request is bounded by exact artifact, policy, field-contract, and session pins. It accepts only an exact Structure Definition draft revision or a
Document Instance pinned to its Published Structure Version, with matching
policy and field-contract ownership. Published Structure Versions are not
direct mutation targets.

Every accepted request requires `content.edit`; a new/rebound field, image
source, or text style additionally requires `field.place`, `media.place`, or
`style.override` respectively. Unchanged submitted field, image, and style
facts do not require those additional actions. The replacement validates the
request, artifact ownership, source structure and target context, effective
policy, V4 grammar, and cloned full document before returning identity, scope,
field-key, history, and invalidation facts.

## Apply Boundary and Rejections

The accepted apply boundary is a validated clone result for one durable
content-history intent with merge key `rich-inline:<textBlockId>`; source input
remains immutable. It rejects malformed requests, artifact mismatches,
missing/unsupported targets, denied policy or session capabilities, no-ops,
and grammar or complete-document validation failures.

Stale, policy, artifact, and session rejection are distinct gates:
this bounded implementation enforces policy, artifact, and session rejection,
while stale/revision and idempotency execution remain an integration concern
outside the boundary. A returned history intent is history/revision-gate-ready;
backend revision advancement and before/after persistence are not performed.

## Current Verified State

The frozen/current evidence confirms canonical selection, explicit atomic
identity allocation, policy/pin-aware complete replacement, immutable source
input, and accepted clone application. The candidate claim is deliberately
single-user: no result makes whole replacement a granular collaboration
operation.

## Explicit Exclusions and Conflict

DOM, IME, and clipboard input ownership are excluded. Granular concurrent deltas are excluded. CRDT and offline merge are excluded. Backend persistence is excluded. Measurement and pagination are excluded. Renderer output and export are excluded. Cross-page editing is excluded.

**TBL-C4:** Whole rich-inline replacement is history/revision-gate-ready but is not a concurrency, CRDT, or offline-merge primitive. It must not be read as
a concurrency-safe delta, CRDT, or offline conflict-resolution contract.

## Canonical Cross-references

The preceding [V1 Grammar and Migration History](v1-grammar-and-migration-history.md)
leaf remains historical transition context only; it does not establish this V4
contract. The downstream [V4 Measurement and Pagination](v4-measurement-and-pagination.md)
leaf consumes authored identities and projection facts without converting
measurement points into editor caret identity.

## Evidence Anchors

- [V4 grammar and selection](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/textBlockV4Contract.ts)
- [V4 grammar tests](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV4Contract.test.ts)
- [V4 atomic/field command planner](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/textBlockV4InlineCommands.ts)
- [V4 command-planner tests](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV4InlineCommands.test.ts)
- [V4 policy-aware whole replacement](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/textBlockV4RichInlineReplace.ts)
- [V4 replacement tests](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV4RichInlineReplace.test.ts)
