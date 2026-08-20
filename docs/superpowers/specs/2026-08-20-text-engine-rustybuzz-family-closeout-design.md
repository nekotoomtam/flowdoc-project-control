# Text Engine Rustybuzz Leaf and Family Closeout Design

Status: Approved for implementation

## Goal

Close the remaining Text Engine documentation synthesis in one bounded cycle:

1. consolidate the four frozen `text-engine/rustybuzz-shaping` sources into one canonical leaf;
2. write the Text Engine family overview from the four reviewed canonical leaves;
3. register both documents in Project Control and update the document map and generated projection.

This is documentation consolidation, not a runtime implementation phase. It does not create missing engine behavior, rerun native or WASM production work, promote Text Engine to production readiness, or authorize source deletion.

## Speed rule: reference existing truth instead of repeating it

The Rustybuzz leaf owns only shaping-specific facts that are not already canonical elsewhere. When a topic is already covered, the new leaf links to the existing canonical document and moves on:

- package toolchain, artifact bytes, and build/digest state remain owned by `wasm-toolchain-and-artifacts.md`;
- runtime identity and digest evidence remain owned by `runtime-identity-and-evidence.md`;
- request creation, evidence acceptance, measurement-draft handoff, and the optional provider remain owned by `adapter-and-provider.md`.

The family overview summarizes the four canonical leaves. It does not reread or restate every historical source document.

## Immutable input set

The reviewed Wave A orientation fixes the subgroup:

- qualified subgroup: `text-engine/rustybuzz-shaping`;
- destination: `docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md`;
- frozen Core source commit: `76a2f2311a898e781f53773390d47b05812911e4`;
- current read-only Core evidence head: `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.

Exactly four source documents belong to this leaf:

| Frozen source | Frozen Git blob | Material contribution |
| --- | --- | --- |
| `docs/TEXT_ENGINE_RUSTYBUZZ_SMOKE_PACKAGE_BOUNDARY.md` | `1174cde89460aab1be752e7ddd1d61710d1273ec` | package-local native Rustybuzz smoke and raw-output authority |
| `docs/TEXT_ENGINE_RUSTYBUZZ_RAW_MAPPING_BOUNDARY.md` | `b0ba6e961d169c42defc0726889dcf3acde9bb82` | UTF-8 byte-cluster to UTF-16 range and font-unit mapping |
| `docs/TEXT_ENGINE_RUSTYBUZZ_SMOKE_CORPUS_BOUNDARY.md` | `2cf9a00c016ce451c5618158b725c02c97c74f4b` | complete four-case bounded native smoke corpus |
| `docs/TEXT_ENGINE_LINE_WRAP_EVIDENCE_BOUNDARY.md` | `828af4b54139b6691f3e1873864173cf9a426971` | seeded break evidence to multi-line adapter evidence |

The implementation must derive the exact source paths from orientation rather than copying former source paths into the canonical leaf, tests, records, or map. All four frozen blobs must still equal their blobs at the current Core evidence head.

## Authority rule

Chronology is not authority. Current package code, fixtures, and focused tests at the pinned Core head govern current wording. The four source documents provide history, intended boundaries, and source ownership, but a later phase number does not by itself prove a stronger current claim.

Current code evidence is limited to:

- `packages/text-engine-rust-wasm/rust-shaper/Cargo.toml`;
- `packages/text-engine-rust-wasm/rust-shaper/src/main.rs`;
- `packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`;
- `packages/text-engine-rust-wasm/src/rustybuzzSmokeCorpus.ts`;
- `packages/text-engine-rust-wasm/src/lineWrapEvidence.ts`;
- the package-local raw/corpus fixtures;
- the four focused tests named below.

The material modules and tests have no frozen-to-current drift between the frozen source commit and current Core evidence head. Core remains read-only throughout this work.

## Canonical Rustybuzz leaf

The leaf presents one compact evidence pipeline:

```text
package-local native smoke
  → raw Rustybuzz JSON
  → UTF-8 byte-cluster / font-unit mapping
  → FlowDoc UTF-16 single-line adapter evidence
  → complete four-case bounded corpus
  → seeded break opportunities + accepted glyph evidence
  → multi-line adapter evidence
  → existing Core acceptance and draft-handoff boundary
```

### Native smoke boundary

The leaf may state that the package-local Rust crate pins Rustybuzz `0.20.1`, reads an explicit copied font asset, shapes text, and emits raw glyph IDs, byte clusters, advances, offsets, glyph count, and units-per-em as JSON.

It must also state that this is native package-local smoke evidence. It is not accepted FlowDoc evidence by itself, does not run inside Core, and does not establish WASM parity or production engine binding.

### Raw mapping boundary

The mapping stage has exact status vocabulary:

```text
ready
blocked
```

It deliberately converts:

- Rustybuzz UTF-8 byte clusters to FlowDoc UTF-16 code-unit ranges;
- raw font units to point units using `fontSizePt / unitsPerEm`.

It fails closed on request, text, font, revision, shape, glyph, unit, byte-length, scalar-count, or cluster-boundary mismatch. A cluster that is not a valid UTF-8 scalar boundary cannot be guessed or repaired.

`ready` means only that bounded raw smoke output was safely mapped into adapter evidence. It does not mean production-ready, parity-ready, default-bound, or renderer-accepted.

### Corpus boundary

The corpus stage also uses only:

```text
ready
blocked
```

The current corpus contains exactly four bounded cases:

- Sarabun regular Thai greeting;
- Sarabun regular combining marks;
- Sarabun bold mixed Thai/Latin/digit heading;
- Noto Sans Thai currency-fallback text.

Every case requires a smoke case, corpus sample, and raw-output fixture. Missing, duplicate, partial, mismatched, or blocked mapping data keeps the corpus `blocked`.

The leaf must retain the current per-case missing-WASM-digest warning. A separately tracked WASM artifact does not turn these native raw-output fixtures into native/WASM parity evidence.

### Line-wrap evidence boundary

The line-wrap stage uses:

```text
ready
blocked
```

It consumes an adapter request, accepted glyph evidence, bounded Thai break evidence, and a positive available width. It produces multi-line adapter line boxes and keeps break kind/reason and overflow warnings in a separate package-local summary.

It must preserve these boundaries:

- offsets are UTF-16 code-unit offsets;
- break offsets are ascending, in range, and cannot split glyph clusters;
- every glyph is covered exactly once by non-overlapping line ranges;
- an internal mandatory break closes the current line;
- a too-wide first available break is represented as bounded overflow evidence, not silently repaired;
- public adapter line boxes do not gain break metadata;
- accepted evidence may pass through the existing Core evidence-acceptance and draft-handoff contracts;
- glyph facts remain outside `VNextTextMeasurementDraft`.

The current break observations are seeded evidence. The leaf must not present them as generated ICU4X, `Intl.Segmenter`, Thai oracle, or production typography evidence.

## Required distinctions

The leaf must keep these authority classes visibly separate:

| Evidence class | What it proves | What it does not prove |
| --- | --- | --- |
| Native raw smoke | Rustybuzz executes in the external package and emits bounded raw glyph facts | accepted FlowDoc evidence, WASM parity, production binding |
| Mapped adapter evidence | raw byte clusters and font units can be converted safely into FlowDoc units | default measurement, renderer acceptance, broad script coverage |
| Four-case corpus | every frozen bounded smoke case maps and passes structural evidence acceptance | language generality, native/WASM determinism, production corpus sufficiency |
| Seeded multi-line evidence | accepted glyph facts and seeded breaks can form valid multi-line evidence | real ICU4X qualification, typography fidelity, pagination replacement |

The word `accepted` refers only to the existing structural Evidence Acceptance contract. It is not production acceptance, drift acceptance, or default adoption.

## Explicit unknowns and exclusions

The new leaf and records must not claim:

- native/WASM parity or cross-runtime determinism;
- generated ICU4X, browser segmentation, or Thai-oracle agreement;
- general script, bidi, justification, hyphenation, or typography fidelity;
- production engine selection or provider binding;
- default `measureVNextText` or pagination-measurer replacement;
- pagination placement, renderer output, PDF/DOCX, backend, storage, or browser-worker integration;
- accepted manifests, rollout thresholds, cache mutation, or family production readiness.

No Core code, tests, documentation, fixtures, packages, artifacts, branch, stash, or worktree configuration may change.

## Text Engine family overview

Create `docs/versions/V0_1_0a_1/core/text-engine/OVERVIEW.md` immediately after the Rustybuzz leaf passes candidate review.

The overview is derived only from the four canonical leaves:

1. WASM Toolchain and Artifacts;
2. Runtime Identity and Evidence;
3. Adapter and Provider;
4. Rustybuzz Shaping.

It explains the family architecture in this order:

```text
package delivery and artifact facts
  → runtime identity and digest state
  → Core request / acceptance / handoff contracts
  → package-local native shaping, mapping, corpus, and wrap evidence
```

The overview links to each leaf and states which document owns each topic. It does not repeat leaf tables or cite the four former source documents.

Documentation synthesis can be complete while the Project Control Node remains `unknown`. The overview must state that family truth remains unknown until migration coverage, active-reference repair, publication review, and any separately authorized cleanup are complete. Production/default/parity unknowns remain explicit.

## Project Control registration

Register two active Documents:

- `doc-text-engine-rustybuzz-shaping`, role `contract`;
- `doc-text-engine-overview`, role `current-state`.

Register exactly two completed Evidence records for the Rustybuzz leaf:

- `evidence-text-engine-rustybuzz-mapping-corpus`;
- `evidence-text-engine-rustybuzz-line-wrap`.

Use deterministic verification time:

```text
2026-08-20T00:00:00.000Z
```

The mapping/corpus Evidence records the package-local native smoke, exact raw mapping, four-case corpus, fail-closed coverage, and the retained missing-WASM-digest warning. The line-wrap Evidence records seeded multi-line evidence, cluster-safe breaks, exact glyph coverage, and successful passage through existing acceptance/handoff boundaries.

Neither Evidence record claims production, default binding, native/WASM parity, generated ICU4X evidence, or general renderer readiness.

Append the two Documents and two Evidence IDs after all existing Text Engine IDs; never reorder or mutate the three existing leaves or their six Evidence records.

The Text Engine Node remains `truthState: "unknown"` with a summary equivalent to:

```text
Text Engine documentation synthesis is complete across four bounded leaves and one family overview; family truth remains unknown pending coverage, reference repair, and publication review, while production, default adoption, and native/WASM parity remain unknown.
```

The parent Core Node remains `unknown` and states that the Text Engine documentation set is synthesized but not yet migrated or promoted.

No Text Engine migration coverage record is created or advanced in this cycle.

## Document map and generated projection

Update `DOCUMENT_MAP.md` so Text Engine is no longer described as missing a leaf or family overview. It must link the overview and all four canonical leaves, distinguish documentation completion from migration completion, retain Text Engine/Core `unknown`, and deny source cleanup authority.

Regenerate `generated/project-index.json` only through the existing generator and require byte-stable regeneration.

## Focused verification

Create one new focused Project Control test covering both the Rustybuzz leaf and family closeout. It must derive the four former source paths from orientation and reject their contiguous appearance in canonical leaf, overview, tests, records, map, and generated content.

The focused test must verify:

- exact 4/4 source ownership and blob preservation;
- exact heading/table/status vocabulary and ordering;
- native-smoke, mapped, corpus, seeded-wrap, and unknown boundaries;
- immutable canonical Core anchors with exact path casing;
- no mutable Core refs;
- exact Document/Evidence IDs, ordering, reciprocity, lifecycle, and deterministic timestamps;
- Text Engine/Core remain `unknown`;
- overview references exactly the four canonical leaves;
- no Text Engine coverage or cleanup authority;
- generated projection equals canonical sources.

The three existing Text Engine leaf tests may change only where they hard-code the previous three-leaf/six-Evidence/no-overview state. Their content, provenance, immutable-anchor, negative-claim, prior-record, and generated-order guards must remain intact.

Run only focused Project Control data/schema/generation/type checks and these read-only Core tests:

- `tests/textEngineRustybuzzSmokePackage.test.ts`;
- `tests/textEngineRustybuzzRawMapping.test.ts`;
- `tests/textEngineRustybuzzSmokeCorpus.test.ts`;
- `tests/textEngineLineWrapEvidence.test.ts`.

Do not run broad suites, build new artifacts, execute the manual native smoke command, or create new engine evidence.

## Review policy

Candidate leaf review has two independent dimensions:

- contract/provenance;
- factual honesty.

After the leaf passes, write and review the family overview and registration as one closeout range. A Critical or Important finding must be corrected with a focused failing assertion before approval. Any finding requiring Core changes, new runtime evidence, migration coverage, or a wider source set stops the cycle for user direction.

## Expected tracked scope

The implementation is expected to touch only:

1. the new Rustybuzz canonical leaf;
2. the new Text Engine family overview;
3. one new focused closeout test;
4. the three existing Text Engine leaf tests where their old three-leaf state becomes stale;
5. two new Document records;
6. two new Evidence records;
7. the existing Text Engine Node;
8. the existing Core Node;
9. `DOCUMENT_MAP.md`;
10. the generated project index.

That is fourteen unique tracked paths. Orientation, inventory, family map, migration coverage, schemas, generic tools, package/lock files, prior canonical leaf/record bytes, and every Core path remain unchanged.

## Success criteria

The cycle is complete when:

1. all four frozen sources are assigned exactly once and remain byte-identical at frozen/current Core heads;
2. the Rustybuzz leaf describes only current bounded native smoke, mapping, corpus, and seeded wrap evidence;
3. duplicate topics are linked to existing canonical leaves rather than repeated;
4. all three `ready | blocked` boundaries and fail-closed cases match current code/tests;
5. native raw smoke, mapped adapter evidence, corpus coverage, and seeded wrap evidence remain distinct;
6. production/default/parity/ICU4X/general typography claims remain absent or explicitly unknown;
7. the family overview references exactly four canonical leaves and no former source documents;
8. two Documents and two Evidence records are valid, reciprocal, deterministic, and order-preserving;
9. Text Engine/Core remain `unknown`; no coverage or cleanup authority is created;
10. focused Core and Project Control checks pass without broad suites or new runtime execution;
11. contract/provenance and factual reviews return Critical 0 and Important 0;
12. the tracked implementation scope is exactly fourteen paths and both repositories finish clean.
