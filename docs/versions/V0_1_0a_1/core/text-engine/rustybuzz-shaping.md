# Text Engine Rustybuzz Shaping

## Authority and Scope

This candidate leaf consolidates bounded Rustybuzz shaping evidence for
`text-engine/rustybuzz-shaping` at immutable Core commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. It owns package-local native
smoke, safe raw mapping, the bounded four-case corpus, and seeded line-wrap
evidence. It does not register an overview, change Core, or create production
engine authority.

## Evidence Pipeline

```text
package-local native smoke
  → raw Rustybuzz JSON
  → UTF-8 byte-cluster / font-unit mapping
  → FlowDoc UTF-16 single-line adapter evidence
  → complete four-case bounded corpus
  → seeded break opportunities + glyph Evidence on the accepted-evidence lane
  → multi-line adapter evidence
  → existing Core acceptance and draft-handoff boundary
```

## Package-local Native Smoke

The native crate reads an explicit copied font asset, shapes text with pinned
Rustybuzz `0.20.1`, and emits raw glyph IDs, byte clusters, advances, offsets,
glyph count, and units-per-em as JSON. This is package-local native smoke only:
it is external to and not inside Core, is not accepted FlowDoc evidence by
itself, and establishes neither WASM parity nor production binding.

## UTF-8 Byte-cluster to UTF-16 Mapping

| Raw mapping states | ready, blocked |

The mapper converts UTF-8 byte clusters into FlowDoc UTF-16 code-unit ranges
only after strict validation of request, text, font, revision, shape, glyph,
unit, byte-length, scalar-count, and cluster-boundary agreement. An invalid
UTF-8 scalar boundary is fail-closed: it is not guessed, repaired, rounded, or
coerced. Raw font units become points through `fontSizePt / unitsPerEm`.

`ready` means only that bounded raw smoke output was safely mapped into adapter
evidence; it is not default measurement, renderer acceptance, broad script
coverage, or production readiness.

## Four-case Smoke Corpus

| Corpus states | ready, blocked |

| Case | Bounded smoke case | Scope |
| --- | --- | --- |
| 1 | Sarabun regular Thai greeting | bounded |
| 2 | Sarabun regular combining marks | bounded |
| 3 | Sarabun bold mixed Thai/Latin/digit heading | bounded |
| 4 | Noto Sans Thai currency-fallback text | bounded |

Every case requires one smoke case, one corpus sample, and one raw-output
fixture. Missing, duplicate, partial, mismatched, or blocked mapping data
keeps the corpus `blocked`. The missing-WASM-digest warning is retained per
case; a separately tracked WASM artifact does not make bounded native fixtures
native/WASM parity evidence. Structural acceptance for these four cases is not
language generality, native/WASM determinism, or production corpus sufficiency.

## Seeded Line-wrap Evidence

| Line wrap states | ready, blocked |

Line wrap consumes an adapter request, glyph Evidence on the accepted-evidence
lane, seeded break evidence, and a positive available width. It does not itself
verify a prior Core acceptance result. Offsets are UTF-16 code-unit offsets;
break offsets are ascending, in range, and cannot split glyph clusters. An
internal mandatory break closes the current line, while a too-wide first
available break remains bounded overflow evidence rather than being silently
repaired.

Line summaries own break kind, reason, and overflow metadata; public adapter
line boxes remain unchanged; every glyph is covered exactly once by
non-overlapping ranges, and glyph facts remain outside
`VNextTextMeasurementDraft`. This is seeded multi-line evidence, not generated
ICU4X, browser segmentation, Thai-oracle proof, typography fidelity, or
pagination replacement.

## Evidence Acceptance and Draft Handoff

Accepted evidence may pass through the existing Core contracts, while existing
Core Evidence Acceptance and draft handoff remain the downstream owners. Here,
accepted means only the existing structural Evidence Acceptance contract, not
production acceptance, drift acceptance, renderer acceptance, rollout
acceptance, or default adoption. The handoff derives its existing draft without
adding glyph facts to `VNextTextMeasurementDraft`. The focused path maps, then
wraps, then passes the resulting evidence through those downstream boundaries.

## Fail-closed Matrix

| Boundary | `ready` requires | `blocked` when |
| --- | --- | --- |
| Raw mapping | validated byte/scalar/range/unit facts | a request, shape, glyph, unit, byte-length, scalar-count, or UTF-8 boundary check fails |
| Corpus | all four bounded cases map with their samples and raw fixtures | a case is missing, duplicate, partial, mismatched, or blocked |
| Line wrap | glyph Evidence on the accepted-evidence lane, safe seeded breaks, and positive width | breaks or glyph coverage are invalid, or the request/evidence identities disagree |

## Current Verified State

The package-local implementation supplies a bounded evidence lane from native
raw output through mapped single-line evidence, the four listed corpus cases,
and seeded multi-line evidence. The three boundaries use only `ready` and
`blocked`; none is a promotion of engine selection, default measurement, or
runtime parity.

## Known Limits and Unknowns

Production and default binding, native/WASM parity, cross-runtime determinism,
generated ICU4X or `Intl.Segmenter` observations, Thai-oracle agreement,
general script coverage, bidi, justification, hyphenation, typography
fidelity, renderer output, pagination replacement, PDF/DOCX, backend, storage,
and browser-worker integration remain unknown or excluded.

## Historical Design Notes

The frozen source set supplies historical ownership and boundaries, not current
authority by chronology. Current package modules, fixtures, and focused tests
at the pinned Core commit govern the wording above.

## Canonical Cross-references

[WASM Toolchain and Artifacts](wasm-toolchain-and-artifacts.md) owns package
toolchain, artifact bytes, and build/digest state.
[Runtime Identity and Evidence](runtime-identity-and-evidence.md) owns runtime
identity and digest evidence. [Adapter and Provider](adapter-and-provider.md)
owns request creation, Evidence Acceptance, measurement-draft handoff, and the
optional provider. This leaf does not duplicate those contracts.

## Evidence Anchors

- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/rust-shaper/Cargo.toml`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/rust-shaper/src/main.rs`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/rustybuzzSmokeCorpus.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/lineWrapEvidence.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineRustybuzzSmokePackage.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineRustybuzzRawMapping.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineRustybuzzSmokeCorpus.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineLineWrapEvidence.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.corpus.v1.json`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.sarabun.v1.json`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.thai-combining.sarabun.v1.json`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.mixed-heading.sarabun-bold.v1.json`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.thai-currency.noto-sans-thai.v1.json`
