# Text Engine Runtime Identity and Evidence

## Authority and Scope

This candidate leaf records the bounded current contract for runtime identity and digest evidence in `@flowdoc/text-engine-rust-wasm`. The source batch is frozen at Core commit `76a2f2311a898e781f53773390d47b05812911e4`; current executable evidence was read at `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.

It covers identity ingredients, digest-state handling, and JSON-safe summaries only. It does not create or load an artifact, run shaping, establish native/WASM or renderer parity, adopt a production measurer, change pagination, or publish raw runtime/WASM evidence.

## Runtime Identity Contract

The manifest is `text-engine-runtime-identity-v1` under policy `text-engine-runtime-identity-policy-v1`. It names `@flowdoc/text-engine-rust-wasm`, the `glyph-line-box-v1` output shape, and `node-native`, `browser-wasm`, and `worker-wasm` runtime targets. The adapter package and runtime targets identify intended endpoints, not successful execution.

| Field group | Meaning | Current boundary |
| --- | --- | --- |
| Manifest identity | Stable manifest ID and policy revision | Identifies the contract version; it does not identify successful execution |
| Adapter package | Owning package name | Must remain `@flowdoc/text-engine-rust-wasm` |
| Measurement profile | Font, shaping, segmentation, policy, and output context | Must match the evidence request before a digest is reusable |
| Output shape | Produced fact shape | Current supported value is `glyph-line-box-v1` |
| Runtime targets | Native and WASM comparison targets | Targets identify intended comparison endpoints; they do not prove comparison ran |
| Runtime revisions | Rustybuzz, ICU4X, and ICU4X-data identities | Blank values block identity; planned values remain visibly planned |
| WASM artifact | Digest status and SHA-256 | A pinned digest identifies bytes only |
| Font assets | Stable font IDs and hashes | Required identity ingredients, not visual acceptance evidence |
| Parity comparison | Status, targets, and compared facts | `not-run` cannot support `parity-ready` |

The identity pins Rustybuzz 0.20.1, planned ICU4X and ICU4X-data revisions, font hashes, the measurement profile, output shape, and the WASM digest before a parity-ready claim. Plan-state vocabulary: `identity-ready`, `parity-ready`, and `blocked`.

| Plan state | Contract |
| --- | --- |
| `identity-ready` | Required identity ingredients are structurally valid while parity may remain unproven |
| `parity-ready` | Requires a pinned valid digest and a matching native/WASM comparison over every required fact |
| `blocked` | One or more required identity or parity conditions fail |

The present plan state is `identity-ready`; `identity-ready` may coexist with unproven parity. `parity-ready` requires a valid pinned digest and a matching native/WASM comparison over all required facts: glyph id, glyph advance, cluster map, and line box.

## Digest Evidence States

The builder recognizes exactly four digest states. Digest-state vocabulary: `pinned`, `pending`, `missing`, and `stale`.

| Digest state | Contract |
| --- | --- |
| `pinned` | A lowercase SHA-256 exists and identity matches the requested matrix, profile, and output shape |
| `pending` | Identity exists but the artifact digest is not pinned |
| `missing` | A pinned claim lacks a valid digest |
| `stale` | Identity, profile, output shape, or digest declaration no longer matches the requested evidence context |

These digest states are distinct from plan states: `identity-ready`, `parity-ready`, and `blocked`. A digest status does not itself report runtime execution, parity, renderer agreement, or production readiness.

| Evidence layer | Current value | Readiness boundary |
| --- | --- | --- |
| Identity readiness | `identity-ready` | Identity ingredients validate; parity remains unproven |
| Digest evidence | `pinned` | Exact retained bytes are identified; execution and parity are not proved |
| Parity status | `identity-only` | No parity-ready claim |
| Comparison evidence | `not-run` | No matching native/WASM result exists |
| Production readiness | `false` | Production binding remains blocked |
| Default measurer replacement | `false` | The default measurer remains unchanged |

## Building and Populating Evidence

The package-local builder creates a JSON-safe metadata summary. It does not import/load WASM, execute shaping, compare runtime output, mutate pagination, bind production measurement, or write artifacts.

Population is historical workflow context. This documentation synthesis did not create or execute Core runtime or raw evidence and did not rerun population. It only verifies existing tracked bytes and does not promote retained metadata into raw execution evidence. Raw runtime/WASM evidence is excluded from this leaf and from root-facing summaries.

## Validation Rules

Runtime identity validation requires the stable manifest and policy identifiers, the adapter package, a measurement profile, `glyph-line-box-v1`, `node-native`, at least one WASM target, Rustybuzz and planned ICU4X identity fields, font hashes, and complete required parity facts.

Only a `parity-ready` claim requires both a pinned digest and a `matching` native/WASM comparison. The current comparison remains `not-run`; therefore the tracked pinned digest does not establish parity. Any production binding request is blocked, and the validation contract reports `productionReady: false` and `defaultMeasurerReplacement: false`.

## Current Verified State

At the pinned Core evidence commit, the runtime identity fixture is `identity-only`, its comparison is `not-run`, and its artifact digest is `4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44`. The retained WASM file is 13782 bytes and matches its `HEAD` Git blob.

The three focused Runtime Identity and digest tests passed against an unchanged package subtree. This verifies contract and retained-byte identity only; it does not show native or WASM execution.

## Known Limits and Unknowns

ICU4X revisions remain planned; they are identity placeholders, not installed or executed runtime components. Browser and worker loading behavior and native/WASM comparison output remain unknown. Renderer drift remains unknown. Numeric and accepted-manifest evidence remains blocked.

Production readiness is false and default-measurer replacement is false. The pinned artifact and intended endpoints do not change those limits.

## Historical Design Notes

The frozen three-document sequence first established a runtime-identity boundary, then defined a JSON-safe digest-builder handoff, and then recorded a population decision when evidence was pending. Those gate documents preserve design history rather than selecting present truth by date.

Current statements in this leaf come from the immutable executable anchors and retained tracked bytes. Earlier pending-artifact language is historical context; it is not a claim about the current pinned artifact.

## Evidence Anchors

- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/runtimeIdentity.ts` — identity ingredients, plan states, and parity preconditions.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/runtimeIdentityDigestEvidenceBuilder.ts` — digest-state policy and JSON-safe, non-executing builder boundary.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/fixtures/text-engine-runtime-identity.v1.json` — current identity, targets, comparison state, and pinned digest metadata.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/fixtures/runtime-identity-digest-evidence-population.v1.json` — retained-byte metadata and blocked downstream evidence lanes.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm` — exact retained artifact bytes.
