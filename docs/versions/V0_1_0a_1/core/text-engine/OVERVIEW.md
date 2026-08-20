# Text Engine Overview

## Authority and Status

This overview is the current navigation and ownership reference for the four
reviewed canonical Text Engine leaves. Documentation synthesis is complete,
but the Text Engine Node and its parent Core Node remain `unknown`. This
overview does not create runtime, migration, publication, or cleanup authority.

## Family Architecture

The family architecture is ordered as follows:

```text
package delivery/artifact facts
  → runtime identity/digest state
  → Core request/acceptance/handoff contracts
  → package-local native shaping/mapping/corpus/wrap evidence
```

Each stage constrains the next without promoting it. Artifact identity does not
prove execution, runtime identity does not prove parity, structurally accepted
Evidence does not prove production acceptance, and bounded shaping Evidence
does not select a default engine.

## Canonical Documents

1. [WASM Toolchain and Artifacts](wasm-toolchain-and-artifacts.md)
2. [Runtime Identity and Evidence](runtime-identity-and-evidence.md)
3. [Adapter and Provider](adapter-and-provider.md)
4. [Rustybuzz Shaping](rustybuzz-shaping.md)

These four leaves are the complete reviewed documentation set for the family.
This overview links their boundaries; it does not duplicate their detailed
tables or absorb their evidence authority.

## Ownership Map

WASM Toolchain and Artifacts owns package delivery, toolchain discovery,
generated-package shape, retained artifact bytes, and build/digest status.
Runtime Identity and Evidence owns runtime identity ingredients, digest states,
and JSON-safe summary boundaries. Adapter and Provider owns Core request
creation, structural Evidence Acceptance, measurement-draft handoff, and the
optional external provider. Rustybuzz Shaping owns package-local native smoke,
strict raw mapping, the complete bounded four-case corpus, and seeded line-wrap
Evidence.

## Evidence Flow

The processing order is distinct from the ownership architecture:

```text
Core adapter request
  → package-local native smoke / raw Rustybuzz JSON
  → strict UTF-8-byte-to-UTF-16 and font-unit mapping
  → current complete four-case bounded corpus
  → seeded breaks + glyph Evidence on the accepted-evidence lane
  → multi-line adapter Evidence
  → Core structural Evidence Acceptance
  → Core measurement-draft handoff
```

Wrapping consumes glyph Evidence on the accepted-evidence lane; it does not
verify an earlier Core acceptance result. Only after wrapping does the result
pass through Core structural Evidence Acceptance and the existing draft
handoff.

The layers stay distinct: native raw smoke is not accepted FlowDoc Evidence by
itself; mapped adapter Evidence is not default measurement; the four-case
corpus is not language generality; and seeded multi-line Evidence is not a real
segmentation or typography oracle.

## Current Verified State

Documentation synthesis is complete across four bounded leaves and this family
overview at Core commit `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.
The retained package and artifact facts, identity and digest state, Core
contract boundaries, and package-local native shaping Evidence are documented
under their separate owners. This documentation state does not promote the
Text Engine family beyond `unknown`.

## Known Limits and Unknowns

Production selection, default adoption, native/WASM parity, real ICU4X evidence,
and general typography remain unknown. Cross-runtime determinism, browser or
worker execution, general script and bidi behavior, justification,
hyphenation, renderer fidelity, pagination replacement, and wider output or
storage integration also remain unknown or excluded.

## Migration and Cleanup Boundary

Text Engine family truth remains unknown pending coverage, reference repair,
publication review, and separately authorized cleanup. No Text Engine migration
coverage record is created or advanced by this synthesis, and no source cleanup
is authorized.

## Evidence Anchors

The overview inputs are these immutable Project Control objects:

- `flowdoc-project-control@4b5abf19468448b2c1c75beda0274aaa40800dd7:docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md (Git blob bc55024985dc1f29086d35a7569fa1ec24bb38ea)`
- `flowdoc-project-control@4b5abf19468448b2c1c75beda0274aaa40800dd7:docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md (Git blob 2548592edd80b3f480928b129e86ca260904a3af)`
- `flowdoc-project-control@4b5abf19468448b2c1c75beda0274aaa40800dd7:docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md (Git blob 11d8fca99265993ba5f8cf0505903026fb33310e)`
- `flowdoc-project-control@4b5abf19468448b2c1c75beda0274aaa40800dd7:docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md (Git blob f7028107cfddd4145d5a5e84bbf7afd2149ad6a1)`

Their current executable facts resolve to Core authority
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. Exhaustive module, fixture, test,
artifact, and Evidence anchors remain in the owning leaves. The Rustybuzz
closeout Evidence records only strict mapping/corpus and seeded line-wrap
verification; it does not establish production, default, parity, ICU4X,
renderer, migration, or cleanup authority.
