## Authority and Scope

This candidate leaf consolidates the historical V1 grammar and migration-decision lane only. It is derived from the reviewed orientation assignment: **4 assigned / 4 unique / 0 missing / 0 extra / 0 drift**. It preserves transition reasoning; it does not promote family truth, migration coverage, or source-cleanup authority.

## Historical V1 Grammar Intent

The historical v1 intent is a flat ordered authored inline list within a text block. Text uses block-scoped UTF-16 offsets; managed inline usages occupy one slot; text leaves are non-empty and contain no raw CR/LF; and the canonical empty authored block has `children: []`. Inline identity is scoped to its owning text block.

These target rules are supported as bounded grammar evidence by [the grammar helper](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/textBlockV1Grammar.ts) and [its focused grammar tests](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV1Grammar.test.ts). They are historical target intent, not a restatement of the later v4 authored contract.

## Pure Validation and Normalization Boundary

The helper validates or plans deterministic normalization without mutating the source input, package records, storage, editor state, or layout output. It can remove empty text leaves and convert raw line endings to explicit line-break children, while unsafe identity, field, zone, malformed-shape, and Unicode cases remain blocked rather than guessed.

The relevant immutable evidence is [the pure helper](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/textBlockV1Grammar.ts), [fixture acceptance](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV1GrammarFixtures.test.ts), and [layout compatibility characterization](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV1LayoutCompatibility.test.ts).

## Canonical Empty-text Producers

The accepted table row and column insertion paths create a paragraph text block with an empty `children` list rather than persisting an empty text leaf. This aligns newly created Core-owned cells with the historical target empty-block shape, without making package-read normalization authoritative.

The implementation evidence is [the operation factory and insertion paths](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/operations/documentOperations.ts) and [the producer fixture assertions](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV1GrammarFixtures.test.ts).

## Active Acceptance and Copy-forward Decision

Active acceptance remains package v2 and document v3. The recorded target is package v3/document v4, with an explicit copy-forward action: validate a canonical v3 source, block unresolved semantic issues, normalize a copy deterministically, stamp the target document version, validate at the strict target boundary, and retain the source snapshot through revisioned persistence.

The version-policy record is decision-only: ordinary reads do not normalize or silently upgrade, the source is not mutated, Core owns a semantic plan, and backend persistence remains revisioned. These facts are bounded by [the policy](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/schema/documentVersionPolicy.ts) and [the version-decision tests](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV1VersionMigrationDecision.test.ts).

## Historical Absence and Later Bounded V4 Evidence

Historical absence of v4 parser/migration activation does not deny later bounded v4 implementation. The former statement records a transition gate; current bounded v4 evidence belongs to the downstream leaves for [authoring and inline commands](v4-authoring-and-inline.md) and [measurement and pagination](v4-measurement-and-pagination.md). Those leaves own their own executable evidence and exclusions.

This leaf keeps historical v1 intent separate from current bounded v4 evidence. It neither substitutes the v1 target grammar for the v4 contract nor treats the later contract as retroactive activation of the historical gate.

## Explicit Exclusions

This leaf does not activate migration execution, a parser, editor or backend behavior, page construction, rendering, collaboration, or a production claim. It does not establish field/image schema completion, persistence delivery, user-interface behavior, or family-level publication authority.

## Current Verified State

At the immutable Core evidence commit, the v1 helper is pure and opt-in, active package-v2/document-v3 parsing remains strict, and Core-owned table insertion emits canonical empty children. The historical transition records continue to require separate target-schema and downstream acceptance work before any future version activation.

## Known Limits and Unknowns

This leaf does not determine when a stored v3 document is offered a transition, the completed target image contract, strict target parsing, revision-gated persistence delivery, or user-facing conflict handling. It also makes no claim about page layout, rendering output, editor input, backend routes, or concurrent editing.

## Canonical Cross-references

- [Text Block v4 authoring and inline](v4-authoring-and-inline.md) owns later bounded authored-content and command evidence.
- [Text Block v4 measurement and pagination](v4-measurement-and-pagination.md) owns later bounded resolved-range and isolated fragment evidence.
- [Text Block overview](OVERVIEW.md) retains the candidate family frame and lane order.

## Evidence Anchors

- [Grammar helper](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/authoring/textBlockV1Grammar.ts)
- [Version policy](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/schema/documentVersionPolicy.ts)
- [Table insertion operations](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/operations/documentOperations.ts)
- [Grammar test](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV1Grammar.test.ts)
- [Version-decision test](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV1VersionMigrationDecision.test.ts)
- [Grammar-fixture test](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV1GrammarFixtures.test.ts)
- [Layout-compatibility test](flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockV1LayoutCompatibility.test.ts)
