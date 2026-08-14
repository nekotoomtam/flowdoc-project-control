# Text Engine Runtime Identity and Evidence Leaf Design

**Date:** 2026-08-14

**Status:** Draft for user review

**Repository of authority:** `flowdoc-project-control`

**Read-only evidence repository:** `flowdoc-vnext-core`

## Goal

Synthesize the second reviewed Wave A batch into one contract-first canonical leaf:

`docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md`

The leaf makes Runtime Identity, digest evidence, and their state rules quickly inspectable by the user and agents. It explains what is pinned, what remains only identity metadata, and which later evidence is still blocked. It must never translate a pinned digest into native/WASM parity, renderer acceptance, production readiness, or default-measurer adoption.

## Frozen input and dependency

The batch is `text-engine/runtime-identity-and-evidence` from the reviewed Wave A orientation at Project Control commit `61449f02d7ab8820f65007611a0f120a0ece4049`.

It contains exactly three primary sources from frozen Core commit `76a2f2311a898e781f53773390d47b05812911e4`:

1. `docs/TEXT_ENGINE_RUNTIME_IDENTITY_BOUNDARY.md`
2. `docs/TEXT_ENGINE_RUNTIME_IDENTITY_DIGEST_EVIDENCE_BUILDER_GATE.md`
3. `docs/TEXT_ENGINE_RUNTIME_IDENTITY_DIGEST_EVIDENCE_POPULATION_GATE.md`

The batch depends on the approved `text-engine/wasm-toolchain-and-artifacts` leaf at Project Control commit `c48de8c182a12e7c91480b57d1d492ce72ba373d`. The dependency supplies the verified package-local artifact boundary and digest bytes; it does not supply parity or runtime-execution evidence.

Current-state verification reads the clean Core descendant `c503a45c03e0ce3b7a6efba2b029ca842017faa0`. No source, dependency leaf, orientation record, or Core file may be modified by this work.

## Chosen document form

The leaf is contract-first:

1. `Authority and Scope`
2. `Runtime Identity Contract`
3. `Digest Evidence States`
4. `Building and Populating Evidence`
5. `Validation Rules`
6. `Current Verified State`
7. `Known Limits and Unknowns`
8. `Historical Design Notes`
9. `Evidence Anchors`

The contract and state tables come before workflow narrative so a user or agent can answer “which field and state governs this claim?” without reading historical sequencing. Historical design remains at the end of the same document so earlier intentions are preserved without becoming current authority.

## Contract model

### Runtime Identity fields

The document presents a compact table covering:

| Field group | Meaning | Current boundary |
|---|---|---|
| Manifest identity | Stable manifest ID and policy revision | Identifies the contract version; it does not identify successful execution |
| Adapter package | Owning package name | Must remain `@flowdoc/text-engine-rust-wasm` |
| Measurement profile | Font, shaping, segmentation, policy, and output context | Must match the evidence request before a digest is reusable |
| Output shape | Produced fact shape | Current supported value is `glyph-line-box-v1` |
| Runtime targets | Native and WASM comparison targets | Targets identify intended comparison endpoints; they do not prove comparison ran |
| Runtime revisions | Rustybuzz, ICU4X, and ICU4X-data identities | Blank values block identity; planned values remain visibly planned |
| WASM artifact | Digest status and SHA-256 | A pinned digest identifies bytes only |
| Font assets | Stable font IDs and hashes | Required identity ingredients, not visual acceptance evidence |
| Parity comparison | Status, targets, and compared facts | `not-run` cannot support `parity-ready` |

### Runtime Identity plan states

- `identity-ready`: required identity ingredients are structurally valid, while parity may remain unproven.
- `parity-ready`: allowed only with a pinned valid digest and a matching native/WASM comparison over every required fact.
- `blocked`: one or more required identity or parity conditions fail.

### Digest evidence states

- `pinned`: a lowercase SHA-256 exists and the runtime identity matches the requested matrix, profile, and output shape.
- `pending`: identity exists but the artifact digest is not pinned.
- `missing`: a pinned claim lacks a valid digest.
- `stale`: identity, measurement profile, output shape, or digest declaration no longer matches the requested evidence context.

`blocked` is a plan/result state, not a digest state. The leaf must keep these vocabularies separate.

## Current verified state

Current prose is admitted only after read-only checks against Core code, fixtures, and focused tests. The expected pinned state is:

- manifest ID `text-engine-runtime-identity-v1`;
- policy `text-engine-runtime-identity-policy-v1`;
- adapter package `@flowdoc/text-engine-rust-wasm`;
- output shape `glyph-line-box-v1`;
- runtime targets `node-native`, `browser-wasm`, and `worker-wasm`;
- Rustybuzz revision `0.20.1`;
- ICU4X and ICU4X data revisions explicitly planned;
- WASM digest status `pinned` with SHA-256 `4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44`;
- parity status `identity-only` and comparison status `not-run`;
- required compared-fact vocabulary present, but no comparison result;
- raw runtime/WASM evidence excluded from the JSON-safe root summary;
- production readiness and default-measurer replacement false;
- native and WASM execution evidence blocked;
- renderer drift unknown;
- numeric thresholds and accepted manifest blocked.

Any mismatch found during implementation narrows this list. The specification does not authorize changing Core to restore an expected value.

## Builder and population boundary

The builder converts a Runtime Identity manifest into a JSON-safe root summary. It validates identity context, resolves the digest state, preserves package-local retention pointers, and exposes later blockers.

The builder and population flow must be described as non-executing:

- no WASM import or load;
- no Rustybuzz, ICU4X, native-shaping, or WASM-shaping execution;
- no runtime-output comparison;
- no pagination mutation;
- no production-measurement binding;
- no artifact write.

Population may discover an already tracked artifact, recompute its digest, and write a metadata fixture in the historical workflow. Documentation synthesis itself performs only read-only byte verification and does not rerun population against Core.

## Authority and evidence rules

Every material statement is classified as current, historical, or unknown.

- Current contract claims require `runtimeIdentity.ts`, `runtimeIdentityDigestEvidenceBuilder.ts`, exact fixtures, or focused tests at the pinned Core head.
- A current byte/digest claim also requires the tracked artifact to match its Git blob, size, and SHA-256.
- The three old gate documents establish design history, not current authority by chronology.
- `pinned` proves artifact identity in the requested context; it does not prove parity, execution, renderer agreement, numeric acceptance, manifest acceptance, production readiness, or default binding.
- Planned ICU4X values remain planned; they are never paraphrased as installed or executed versions.

Implementation creates an ignored three-row claim matrix before prose. Each row records frozen blob, material contribution, destination section, classification, executable anchor, verification result, and wording boundary. Closure must be 3 assigned / 3 unique / 0 missing / 0 extra.

## Canonical provenance boundary

The canonical leaf and focused test do not contain the three former document paths as contiguous literals. Exact source ownership remains in the immutable orientation artifact and later family coverage.

Evidence anchors use immutable local notation pinned to the full lowercase Core commit, for example:

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/runtimeIdentity.ts`

The leaf contains no mutable branch URL, absolute local path, remote-publication claim, machine-specific tool status, or raw evidence payload.

## Project Control registration

After candidate content and factual review pass:

- add `doc-text-engine-runtime-identity-evidence` to the existing `text-engine` Node;
- keep the Node `truthState: "unknown"`;
- register the Document as active with authority limited to the verified Runtime Identity and JSON-safe digest-evidence contract;
- add Evidence only for focused Runtime Identity and digest builder/population verification that actually passes;
- update the Core document map to list two reviewed partial Text Engine leaves and state that two leaves plus the family overview remain incomplete;
- regenerate the project index deterministically.

No Text Engine family coverage is created or advanced. The two active bounded leaves do not promote the family or parent Core.

## Focused testing and review

A new leaf-focused test derives the three sources from the pinned orientation artifact and protects:

- exact orientation raw-byte and Git-blob identity;
- exact qualified subgroup, destination, source membership, inventory digest, and three aligned source blob IDs;
- exact contract-first section order;
- exact state vocabularies and the separation between digest states and result states;
- rejection of positive parity, renderer, threshold, accepted-manifest, production, and default-measurer claims;
- rejection of mutable anchors and former-source literals in leaf/test/data;
- unchanged dependency leaf and source repository;
- existing `unknown` Node with two bounded active Documents after registration;
- absent Text Engine coverage and cleanup authority;
- deterministic generated projection.

Candidate review has two dimensions: contract/provenance and factual honesty. Registered-state final review repeats both dimensions. Critical and Important findings block progression; corrections begin with focused REDs and stay inside the leaf's paths.

## Delivery sequence

1. Freeze clean Project Control and Core identities.
2. Extract the exact three-source batch and verify its dependency leaf.
3. Read all three sources and create the ignored claim matrix.
4. Inspect Runtime Identity code, builder code, fixtures, tracked artifact, and focused tests read-only.
5. Write the candidate contract-first leaf and focused tests.
6. Obtain contract and factual candidate approval.
7. Add registration tests, then the bounded Document and completed Evidence.
8. Update the existing Text Engine Node and Core map; regenerate deterministically.
9. Run focused Project Control gates and obtain final dual review.
10. Hand off to `text-engine/adapter-and-provider` without beginning it.

## Explicit exclusions

This work does not:

- change the approved WASM toolchain/artifact leaf;
- synthesize adapter/provider or Rustybuzz leaves;
- write the Text Engine family overview;
- execute native or WASM shaping;
- create parity, renderer, threshold, or production evidence;
- modify Core or install/rebuild any toolchain or artifact;
- change orientation, inventory, family map, migration coverage, schemas, generic tooling, package, or lock files;
- repair references, authorize cleanup, or delete any source;
- run broad Project Control/Core suites, build, or E2E;
- push, merge, tag, publish, or mutate stash state.

## Acceptance criteria

The leaf is complete only when:

1. the pinned subgroup resolves to exactly 3 unique frozen sources and the exact destination;
2. the dependency leaf remains approved, present, and unchanged;
3. all three sources have explicit claim-matrix dispositions;
4. every current field/state claim matches pinned Core code, fixtures, artifact bytes, and focused tests;
5. contract-first tables clearly separate identity readiness, digest state, and comparison/readiness evidence;
6. unsupported claims remain negative, historical, or unknown;
7. focused tests, data validation, deterministic generation, and type-check pass;
8. candidate and registered-state contract/factual reviews return Critical 0 and Important 0;
9. tracked scope contains only the new leaf/test, bounded Document/Evidence, existing Node/map changes, and generated index;
10. Core and all three source documents remain unchanged;
11. Text Engine remains unknown with no coverage or cleanup authority;
12. handoff names `text-engine/adapter-and-provider` as the next frozen batch without beginning it.
