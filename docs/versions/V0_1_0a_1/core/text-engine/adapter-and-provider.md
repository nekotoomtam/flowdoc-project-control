# Text Engine Adapter and Provider

## Authority and Scope

This is a bounded, current-contract leaf for the Text Engine adapter request, externally produced Evidence, Core acceptance, existing measurement-draft handoff, and optional external renderer-backed provider. It is pinned to `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0`.

Core owns contract planning, validation, and draft derivation. The external `@flowdoc/text-engine-rust-wasm` package owns Evidence production and the optional provider. This leaf does not establish a Core-owned engine, real-engine generality, native/WASM parity, production rollout, default binding, or Text Engine family completion.

## Pipeline at a Glance

```text
Core creates Adapter Request
        ↓
External adapter produces Glyph and Line Evidence
        ↓
Core accepts or blocks Evidence as data
        ↓
Core derives the existing VNextTextMeasurementDraft
        ↓
Optional external provider returns that draft through the renderer-backed bridge
```

| Stage | Owner | May execute engine work | Core imports external provider | May replace default measurement |
| --- | --- | ---: | ---: | ---: |
| Adapter request | Core | No | No | No |
| Evidence production | External adapter package | Only when a separately evidenced concrete producer does so | No | No |
| Evidence acceptance | Core | No | No | No |
| Draft handoff | Core | No | No | No |
| Renderer-backed provider | External adapter package | Only through supplied Evidence | No | No |

## Adapter Request Contract

The Core planner is `createVNextTextEngineAdapterSpiPlan` at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textEngineAdapterSpi.ts`. It creates static requests; it does not execute rustybuzz, HarfBuzz, ICU4X, WASM, font reads, segmentation, shaping, rendering, or pagination.

| Contract field | Current bounded contract |
| --- | --- |
| Owner | Core |
| Input | SPI id, policy revision, smoke/sample cases, copied font asset ids, profile, runtime target, engine references, and execution policy |
| Required identity | Request and smoke-case ids; `measurementProfileId`; `node`, `browser`, or `worker`; engine/revision references; output shape `glyph-line-box-v1` |
| Validation | Stable profile, external placement, positive width, known sample/font, unique case ids, required glyph/line facts, and Core no-engine policy |
| Output | `VNextTextEngineAdapterRequest` records and an SPI plan |
| Failure state | `blocked` |
| Retained facts | Sample text, font/style references, requested glyph id/advance/offset/cluster/text-range/line-box coverage |
| Deliberately excluded behavior | Engine execution, Core package imports, font reads, draft mutation, default-measurer replacement, and production binding |
| SPI states | ready-for-adapter-implementation, blocked |

## Produced Evidence Contract

`VNextTextEngineAdapterEvidence` is produced outside Core and binds glyph and line-box facts to the originating request, `measurementProfileId`, output shape, and engine references.

| Contract field | Current bounded contract |
| --- | --- |
| Owner | External adapter package |
| Input | An adapter request plus package-controlled execution or fixture source |
| Required identity | Request id, profile id, output shape, engine/revisions, glyph and line-box identities |
| Validation | Producer must preserve the requested identity and required fact coverage before Core can consider it |
| Output | Glyph ids, advances, offsets, clusters, font ids, line text/glyph ranges, dimensions, and offsets as Evidence |
| Failure state | Not acceptable to Core until the separate acceptance stage returns `accepted` |
| Retained facts | All glyph/cluster and line-box facts stay in the Evidence lane |
| Deliberately excluded behavior | Core engine ownership, implicit acceptance, draft schema changes, production binding, and parity claims |

| Origin | Meaning | Permitted claim |
| --- | --- | --- |
| Mock scaffold | Deterministic contract-shape proof | Package/SPI wiring only |
| Seeded or smoke fixture | Bounded test Evidence | Focused fixture behavior only |
| Real-engine Evidence | Output captured from identified engine execution | Only after separately verified execution and provenance evidence exists |

The currently verified provider Evidence is seeded/smoke-bounded; it is not general real-engine production Evidence or cross-runtime parity Evidence.

## Evidence Acceptance Contract

The Core planner is `createVNextTextEngineEvidenceAcceptancePlan` at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textEngineEvidenceAcceptance.ts`. It validates data and produces no measurement draft.

| Contract field | Current bounded contract |
| --- | --- |
| Owner | Core |
| Input | Original adapter request, externally produced Evidence, expected engine, and acceptance policy |
| Required identity | Request id, `measurementProfileId`, output shape, engine/revisions, glyph/line facts |
| Validation | Glyph ids, advances, offsets, clusters, font ids, line ranges/metrics, finite safe values, and complete line-to-glyph coverage |
| Output | An acceptance plan with the original Evidence only when structurally valid |
| Failure state | `blocked` |
| Retained facts | Accepted Evidence remains separate from the draft lane |
| Deliberately excluded behavior | Engine execution, draft creation, repair, guessing, silent identity substitution, and production binding |
| Evidence Acceptance states | accepted, blocked |

Evidence Acceptance `accepted` means structurally acceptable for the next bounded stage. It is not renderer acceptance, drift acceptance, production acceptance, or default-measurer approval. Mismatch, malformed facts, non-finite or unsafe metrics, invalid ranges, and incomplete coverage fail closed.

## Measurement Draft Handoff

The Core planner is `createVNextTextEngineMeasurementDraftHandoffPlan` at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textEngineMeasurementDraftHandoff.ts`. It consumes only an accepted Evidence plan and derives the existing `VNextTextMeasurementDraft` shape.

| Contract field | Current bounded contract |
| --- | --- |
| Owner | Core |
| Input | Original request, accepted Evidence plan, and handoff policy |
| Required identity | Accepted request/profile/output-shape agreement and valid line ranges |
| Validation | Evidence has `accepted` status, policy is safe, ranges and dimensions are valid, and line boxes exist |
| Output | Existing `VNextTextMeasurementDraft` lines, pagination-facing line boxes, width, height, and line height |
| Failure state | `blocked` |
| Retained facts | Original request text and accepted line-box facts; glyph/cluster facts remain in separate Evidence |
| Deliberately excluded behavior | Evidence mutation, glyph facts in the draft, engine execution, pagination replacement, schema change, and production binding |
| Handoff states | ready, blocked |

The handoff derives line text from request ranges, computes dimensions from accepted Evidence, and drops glyph facts from the draft. It blocks non-accepted Evidence rather than building a draft directly.

## Optional Renderer-backed Provider

The optional external bridge is `createFlowDocTextEngineRendererBackedProviderBridge` at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/rendererBackedProvider.ts`. It uses injected public Core boundary functions rather than a Core import of the provider.

| Contract field | Current bounded contract |
| --- | --- |
| Owner | External adapter package |
| Input | Renderer measurement request, selected glyph/break Evidence source, renderer profile, and injected Core public boundaries |
| Required identity | `measurementProfileId`, style/text source key, `glyph-line-box-v1`, matching sample/profile identities |
| Validation | Profile planning, source uniqueness, profile and output-shape checks, glyph/profile agreement, and break/sample agreement |
| Output | A `VNextTextMeasurementDraft` through `createVNextRendererBackedTextMeasurer` after wrap → acceptance → handoff |
| Failure state | `blocked` |
| Retained facts | Selected Evidence remains distinct; Core boundaries return their ordinary plans |
| Deliberately excluded behavior | Acceptance/handoff bypass, Core import, cache mutation, invalidation changes, `measureVNextText` replacement, PDF/DOCX output, artifact bytes, and production binding |
| Provider states | ready, blocked |

The provider gates by profile and line-box support, remains external to `src/**`, and does not alter default pagination measurement.

## Drift Reporting and Adoption Boundary

`createFlowDocTextEngineRendererBackedDriftReport` at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/rendererBackedProvider.ts` compares approximate and renderer-backed draft summaries.

| Contract field | Current bounded contract |
| --- | --- |
| Owner | External adapter package |
| Input | Text, optional profile id, approximate draft, renderer-backed draft, and supplied tolerance |
| Required identity | Profile id and text hash on the comparison record |
| Validation | Absolute width, height, and line-count drift must be within the supplied tolerance |
| Output | Summary pair, drift values, tolerance, and local result |
| Failure state | `rejected` |
| Retained facts | Approximate and renderer-backed summary facts, profile id, text hash, and tolerance |
| Deliberately excluded behavior | Production approval, parity proof, accepted-manifest proof, cache/default mutation, and rollout policy |
| Drift report states | accepted, rejected |

Drift report `accepted` is tolerance-local for one comparison. It does not mean production accepted, renderer correctness across all inputs, native/WASM parity, accepted runtime manifest, or default-measurer adoption.

## Fail-closed Matrix

| Condition | Stage | Required result | Forbidden fallback |
| --- | --- | --- | --- |
| Missing required request fact | SPI | `blocked` | Infer the missing fact |
| Request/profile mismatch | Acceptance | `blocked` | Accept by shape alone |
| Output-shape mismatch | Acceptance | `blocked` | Convert implicitly |
| Engine/revision mismatch | Acceptance | `blocked` | Substitute a current revision |
| Malformed glyph/cluster/line facts | Acceptance | `blocked` | Clamp or repair silently |
| Incomplete line glyph coverage | Acceptance | `blocked` | Drop uncovered glyphs |
| Evidence is not accepted | Handoff | `blocked` | Build a draft directly |
| Unsafe handoff policy or dimensions | Handoff | `blocked` | Approximate within handoff |
| Wrong `measurementProfileId` | Provider | `blocked` | Select another profile |
| Profile lacks line-box support | Provider | `blocked` | Fabricate line boxes |
| Drift exceeds tolerance | Drift report | `rejected` | Change default measurement |
| Evidence origin is mock/seeded only | Current claim | Keep bounded label | Call it real production Evidence |

## Current Verified State

At the pinned Core commit, the request, acceptance, and handoff modules exist; the external package and optional provider bridge exist; and the provider routes injected Core boundary functions through acceptance and handoff. The five focused checks passed: `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineAdapterSpi.test.ts`, `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineEvidenceAcceptance.test.ts`, `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineMeasurementDraftHandoff.test.ts`, `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineAdapterPackageScaffold.test.ts`, and `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/rendererBackedTextEngineProvider.test.ts`.

The default approximate measurement path, `measureVNextText`, pagination defaults, cache, and invalidation contracts remain unchanged. Glyph/cluster facts remain outside `VNextTextMeasurementDraft`. Core `src/**` has no import of `@flowdoc/text-engine-rust-wasm` or its provider module.

## Known Limits and Unknowns

Production rollout policy, default binding, real-engine generality, native/WASM parity, accepted runtime manifests, and general renderer acceptance remain unknown or blocked. The package/provider bridge does not itself demonstrate a real engine execution, production Evidence, a universally correct renderer, or permission to change default measurement.

The Rustybuzz shaping and runtime/toolchain close-audit facts belong to their dependency or cross-reference boundary; this leaf does not absorb them.

## Historical Design Notes

Earlier material described a foundation pass before any concrete external adapter package existed. That former absence is historical only. Current package structure and focused tests support a bounded external package and optional provider, while retaining the limits above.

## Evidence Anchors

Immutable local anchors at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0`:

- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textEngineAdapterSpi.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textEngineEvidenceAcceptance.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/renderer/textEngineMeasurementDraftHandoff.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/rendererBackedProvider.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineAdapterSpi.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineEvidenceAcceptance.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineMeasurementDraftHandoff.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textEngineAdapterPackageScaffold.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/rendererBackedTextEngineProvider.test.ts`
