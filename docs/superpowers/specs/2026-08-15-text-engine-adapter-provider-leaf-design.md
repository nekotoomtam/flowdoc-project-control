# Text Engine Adapter and Provider Leaf Design

**Date:** 2026-08-15

**Status:** Draft for user review

**Repository of authority:** `flowdoc-project-control`

**Read-only evidence repository:** `flowdoc-vnext-core`

## Goal

Synthesize the third reviewed Text Engine Wave A batch into one detailed, contract-first canonical leaf:

`docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md`

The leaf explains how Core creates adapter requests, accepts independently produced glyph and line evidence, derives the existing pagination-facing measurement draft, and exposes an optional renderer-backed provider bridge. It must let a user or agent determine the owner, input, validation, output, failure state, retained facts, and excluded behavior of every stage without inferring architecture from historical phase order.

The leaf must not turn an existing adapter package, an accepted Evidence object, a provider bridge, or an accepted drift result into a claim of Core-owned engine execution, real production evidence, native/WASM parity, default-measurer replacement, pagination replacement, or production binding.

## Frozen input and dependencies

The batch is `text-engine/adapter-and-provider` from the reviewed Wave A orientation at Project Control commit `61449f02d7ab8820f65007611a0f120a0ece4049`.

It contains exactly six primary sources from frozen Core commit `76a2f2311a898e781f53773390d47b05812911e4`:

1. `docs/TEXT_ENGINE_ADAPTER_LANE_CLOSE_AUDIT.md`
2. `docs/TEXT_ENGINE_ADAPTER_PACKAGE_SCAFFOLD.md`
3. `docs/TEXT_ENGINE_ADAPTER_SPI_BOUNDARY.md`
4. `docs/TEXT_ENGINE_EVIDENCE_ACCEPTANCE_BOUNDARY.md`
5. `docs/TEXT_ENGINE_MEASUREMENT_DRAFT_HANDOFF_BOUNDARY.md`
6. `docs/TEXT_ENGINE_RENDERER_BACKED_PROVIDER_BOUNDARY.md`

Current-state verification reads the clean Core descendant `c503a45c03e0ce3b7a6efba2b029ca842017faa0`. All six source blobs are identical between the frozen and current commits.

The batch depends on the approved Project Control leaves:

- `text-engine/wasm-toolchain-and-artifacts` for the package-local toolchain and tracked-artifact boundary;
- `text-engine/runtime-identity-and-evidence` for runtime identity and digest-state semantics.

It cross-references but does not synthesize:

- `text-engine/rustybuzz-shaping`, which owns how shaping Evidence is produced;
- `text-block/v4-measurement-and-pagination`, which consumes measurement facts downstream.

No source, dependency leaf, orientation record, inventory record, family map, or Core file may be modified by this work.

## Authority resolution

The six sources span multiple phases and contain a deliberate historical transition:

- early sources say that no concrete adapter package exists;
- later sources and the current Core tree contain `packages/text-engine-rust-wasm` and an optional renderer-backed provider bridge.

The canonical leaf resolves this without erasing history:

- current code, fixtures, focused tests, and package structure at the pinned Core head govern current truth;
- the former absence of a concrete adapter remains only in `Historical Design Notes`;
- the existence of a package/provider does not prove default adoption, real production Evidence, native/WASM parity, or production readiness;
- scaffold/mock Evidence and seeded/smoke Evidence are labelled separately from real-engine Evidence.

Chronology alone never promotes a historical claim into current authority.

## Chosen document form

The leaf uses a contract-pipeline structure:

1. `Authority and Scope`
2. `Pipeline at a Glance`
3. `Adapter Request Contract`
4. `Produced Evidence Contract`
5. `Evidence Acceptance Contract`
6. `Measurement Draft Handoff`
7. `Optional Renderer-backed Provider`
8. `Drift Reporting and Adoption Boundary`
9. `Fail-closed Matrix`
10. `Current Verified State`
11. `Known Limits and Unknowns`
12. `Historical Design Notes`
13. `Evidence Anchors`

Historical narrative remains near the end. It cannot interrupt or redefine the current pipeline.

## Pipeline architecture

The canonical current flow is:

```text
Core creates Adapter Request
        ↓
External Adapter produces Glyph and Line Evidence
        ↓
Core validates and accepts or blocks Evidence
        ↓
Core derives the existing VNextTextMeasurementDraft
        ↓
Optional Renderer-backed Provider returns the draft through the existing bridge
```

The ownership boundary is strict:

| Stage | Owner | May execute engine work | Core imports external provider | May replace default measurement |
|---|---|---:|---:|---:|
| Adapter request | Core | No | No | No |
| Evidence production | External adapter package | Only when a concrete producer actually does so | No | No |
| Evidence acceptance | Core | No | No | No |
| Draft handoff | Core | No | No | No |
| Renderer-backed provider | External adapter package | Only through its supplied Evidence source | No | No |

Core owns contracts and validation. The external package owns Evidence production and the optional provider bridge. Public Core boundary functions are injected into the provider from the call site; Core never imports the provider package back into `src/**`.

## Contract presentation

Every pipeline stage is documented with a compact table containing:

- owner;
- input;
- required identity;
- validation;
- output;
- failure state;
- retained facts;
- deliberately excluded behavior.

The tables must use exact current type/function/status names where they are material. Narrative may explain them, but may not replace the tables.

## Adapter Request Contract

Core's SPI is owned by `src/renderer/textEngineAdapterSpi.ts` and the exported planner `createVNextTextEngineAdapterSpiPlan`.

The leaf records these exact plan states:

- `ready-for-adapter-implementation`;
- `blocked`.

The request contract binds a smoke/sample case to stable measurement identity and an intended external execution context. Its table covers:

- request and smoke-case identity;
- copied font asset/sample references;
- `measurementProfileId`;
- runtime target (`node`, `browser`, or `worker`);
- engine/revision references;
- output shape `glyph-line-box-v1`;
- required glyph and line fact coverage;
- execution policy and package placement.

Creating a request or a `ready-for-adapter-implementation` plan does not execute rustybuzz, HarfBuzz, ICU4X, WASM, font reads, segmentation, shaping, rendering, or pagination.

## Produced Evidence Contract

`VNextTextEngineAdapterEvidence` is produced outside Core. It carries glyph facts and line-box facts tied to the originating request and measurement identity.

The leaf distinguishes three evidence origins:

| Origin | Meaning | Permitted claim |
|---|---|---|
| Mock scaffold | Deterministic contract-shape proof | Package/SPI wiring only |
| Seeded or smoke fixture | Bounded test Evidence | Focused fixture behavior only |
| Real-engine Evidence | Output captured from an identified engine execution | Only after separately verified execution/provenance evidence exists |

Current provider Evidence remains bounded by seeded line-break Evidence and native rustybuzz smoke fixtures. The leaf must not call it production Evidence or cross-runtime parity Evidence.

Glyph IDs, advances, offsets, clusters, font references, line text ranges, glyph ranges, dimensions, and offsets remain Evidence facts. Their presence alone does not make them accepted.

## Evidence Acceptance Contract

Core acceptance is owned by `src/renderer/textEngineEvidenceAcceptance.ts` and `createVNextTextEngineEvidenceAcceptancePlan`.

The exact acceptance states are:

- `accepted`;
- `blocked`.

Acceptance validates Evidence as data without executing an engine or producing a measurement draft. It must bind and validate:

- original request identity;
- measurement profile identity;
- output shape;
- engine and revision references;
- glyph IDs, advances, offsets, clusters, and font IDs;
- line text ranges, glyph ranges, widths, heights, and y offsets;
- complete line-to-glyph coverage;
- acceptance policy.

Mismatch, malformed facts, non-finite/unsafe metrics, invalid ranges, or incomplete coverage fail closed to `blocked`. Acceptance never repairs, guesses, normalizes away, or silently substitutes mismatched identity.

`accepted` means structurally acceptable for the next bounded stage. It does not mean renderer accepted, drift accepted, production accepted, or default-measurer approved.

## Measurement Draft Handoff

The handoff is owned by `src/renderer/textEngineMeasurementDraftHandoff.ts` and `createVNextTextEngineMeasurementDraftHandoffPlan`.

The exact handoff states are:

- `ready`;
- `blocked`.

The handoff consumes only an accepted Evidence plan and derives the existing `VNextTextMeasurementDraft` shape. It:

- derives lines from the original request text and accepted line ranges;
- derives pagination-facing line boxes;
- computes draft width, height, and line height from accepted Evidence;
- exposes that glyph facts are dropped from the draft;
- preserves glyph and cluster facts in the separate Evidence lane.

It blocks non-accepted Evidence, unsafe handoff policy, malformed line ranges, and invalid dimensions. It does not mutate Evidence, add glyph facts to the draft, execute an engine, replace pagination measurement, or change the draft schema.

## Optional Renderer-backed Provider

The external bridge is owned by `packages/text-engine-rust-wasm/src/rendererBackedProvider.ts`.

The current exported entry points are:

- `createFlowDocTextEngineRendererBackedProviderBridge`;
- `createFlowDocTextEngineRendererBackedDriftReport`.

The exact provider plan states are:

- `ready`;
- `blocked`.

The provider bridge:

- consumes renderer measurement requests and selected Evidence sources;
- uses injected public Core boundary functions;
- routes Evidence through the existing acceptance and handoff contracts;
- returns a draft through `createVNextRendererBackedTextMeasurer`;
- gates by `measurementProfileId` and line-box support;
- remains external to Core.

The provider may not bypass acceptance or handoff, import itself into Core, mutate the pagination cache, change invalidation contracts, replace `measureVNextText`, render PDF/DOCX output, produce artifact bytes, or claim production binding.

## Drift reporting and adoption boundary

The drift report compares approximate and renderer-backed draft summaries. It may include profile ID, text hash, approximate summary, renderer-backed summary, width/height/line-count drift, tolerance, and result.

The exact drift states are:

- `accepted`;
- `rejected`.

These names belong only to the drift-report vocabulary. They must not be confused with Evidence Acceptance's `accepted` state.

`accepted` drift means that one comparison falls within the supplied tolerance. It does not mean:

- production acceptance;
- native/WASM parity;
- renderer correctness across all inputs;
- accepted runtime manifest;
- default-measurer adoption;
- permission to mutate cache/default behavior.

Drift tolerance and rollout policy remain separate policy decisions.

## Fail-closed matrix

The leaf contains a visible matrix covering at least these cases:

| Condition | Stage | Required result | Forbidden fallback |
|---|---|---|---|
| Missing required request fact | SPI | `blocked` | Infer the missing fact |
| Request/profile mismatch | Acceptance | `blocked` | Accept by shape alone |
| Output-shape mismatch | Acceptance | `blocked` | Convert implicitly |
| Engine/revision mismatch | Acceptance | `blocked` | Substitute current revision |
| Malformed glyph/cluster/line facts | Acceptance | `blocked` | Clamp or repair silently |
| Incomplete line glyph coverage | Acceptance | `blocked` | Drop uncovered glyphs |
| Evidence is not accepted | Handoff | `blocked` | Build a draft directly |
| Unsafe handoff policy or dimensions | Handoff | `blocked` | Approximate within handoff |
| Wrong `measurementProfileId` | Provider | `blocked` | Select another profile |
| Profile lacks line-box support | Provider | `blocked` | Fabricate line boxes |
| Drift exceeds tolerance | Drift report | `rejected` | Change default measurement |
| Evidence origin is mock/seeded only | Current claim | Keep bounded label | Call it real production Evidence |

## Current verified state

Current prose is admitted only after read-only verification against the pinned Core tree.

The expected current state is:

- the Core SPI, acceptance, and handoff modules exist and expose their bounded planners;
- the external adapter package exists;
- the provider bridge exists and is optional;
- public Core boundary functions are injected rather than importing the provider into Core;
- request, acceptance, handoff, profile, and line-box guards are covered by focused tests;
- the default approximate measurement path remains unchanged;
- glyph/cluster facts remain outside `VNextTextMeasurementDraft`;
- provider Evidence remains seeded/smoke-bounded rather than general production Evidence;
- drift reports do not mutate cache or default behavior;
- production rollout policy, default binding, native/WASM parity, and general renderer acceptance remain unresolved.

Any mismatch found during implementation narrows this list and stops registration when material. The specification does not authorize changing Core to make documentation evidence pass.

## Evidence and claim matrix

Implementation creates an ignored six-row claim matrix before prose. Each row records:

- source path derived from orientation;
- frozen/current Git blob;
- material contribution;
- destination section;
- classification (`current`, `historical`, or `unknown`);
- executable anchor;
- verification result;
- wording boundary.

Closure must be:

```text
assigned sources: 6
unique sources: 6
missing sources: 0
extra sources: 0
```

The close audit's facts outside this subgroup are assigned to their owning leaves/cross-references rather than absorbed into the adapter/provider leaf.

## Focused evidence checks

Current verification includes at minimum these focused Core tests:

- `tests/textEngineAdapterSpi.test.ts`;
- `tests/textEngineEvidenceAcceptance.test.ts`;
- `tests/textEngineMeasurementDraftHandoff.test.ts`;
- `tests/textEngineAdapterPackageScaffold.test.ts`;
- `tests/rendererBackedTextEngineProvider.test.ts`.

Implementation also verifies read-only that:

- all six frozen/current source blobs match;
- the relevant Core modules/package subtree have no frozen-to-current drift unless every changed fact is explicitly reclassified;
- Core does not import the external provider package into `src/**`;
- both approved dependency leaves remain byte-identical;
- Project Control and Core remain clean.

No broad Core or Project Control suite, build, or E2E is required by this leaf.

## Focused mutation guards

The new leaf test derives ownership from orientation and must reject mutations that claim:

- Core executes Rust, WASM, shaping, segmentation, or font reads;
- mismatched or malformed Evidence can be accepted;
- handoff can consume non-accepted Evidence;
- glyph facts are added to the measurement draft;
- provider can bypass acceptance/handoff;
- Core imports the provider package;
- provider replaces `measureVNextText` or pagination defaults;
- drift `accepted` means production accepted;
- mock or seeded Evidence is real-engine production Evidence;
- pagination cache/invalidation behavior changed;
- native/WASM parity, accepted manifest, production readiness, or default binding is established;
- Text Engine or Core becomes `current` because this leaf is registered.

The test also pins:

- orientation raw bytes/Git blob;
- orientation inventory digest;
- exact qualified subgroup, destination, six sources, and aligned inventory blobs;
- exact 13-section order;
- exact stage/status vocabularies and separation of both `accepted` terms by context;
- immutable Core anchors and absence of arbitrary mutable branch references;
- absence of former-source literals from leaf/test/data;
- unchanged dependency leaves;
- deterministic generated projection;
- absent Text Engine coverage and cleanup authority.

## Project Control registration

Registration happens only after candidate contract/provenance and factual reviews both return Critical 0 and Important 0.

The bounded records are:

- Document: `doc-text-engine-adapter-provider`;
- Evidence: `evidence-text-engine-adapter-contract`;
- Evidence: `evidence-text-engine-provider-bridge`.

The Document is active with authority limited to the verified adapter request, Evidence acceptance, measurement-draft handoff, and optional renderer-backed provider contracts.

The contract Evidence records focused SPI/acceptance/handoff verification. The provider Evidence records focused optional bridge/profile/drift/default-independence verification. Neither record claims real production Evidence, native/WASM parity, default adoption, or production readiness.

The existing `text-engine` Node gains the third active bounded Document and the two Evidence IDs while remaining `truthState: "unknown"`. The parent Core Node remains `unknown`.

`DOCUMENT_MAP.md` lists three reviewed partial Text Engine leaves and states that `rustybuzz-shaping` plus the family overview remain incomplete. No Text Engine coverage is created or advanced. No source cleanup or deletion is authorized.

## Review and correction policy

Candidate and registered-state review each have two independent dimensions:

- contract/provenance;
- factual honesty.

Critical or Important findings block progression. Every accepted correction begins with a focused RED and remains within the leaf's approved paths. A scope need outside leaf/test/Document/Evidence/existing Nodes/map/generated index stops for user approval.

Focused commands have a 180-second no-verdict boundary. A command exceeding that boundary without a verdict is stopped only after validating its exact process tree and is recorded as `NO VERDICT`. It is never reported as PASS.

## Explicit exclusions

This work does not:

- modify Core;
- modify either approved dependency leaf;
- synthesize `rustybuzz-shaping` or the Text Engine family overview;
- execute native/WASM shaping, ICU4X, font reads, or renderer output;
- capture new real-engine Evidence;
- establish native/WASM parity or cross-runtime determinism;
- replace default measurement or pagination behavior;
- mutate pagination cache/invalidation contracts;
- set drift tolerance or production rollout policy;
- create accepted-manifest, renderer-acceptance, production, or default-binding Evidence;
- change orientation, inventory, family map, migration coverage, schemas, generic tooling, package files, or lock files;
- delete, rename, move, or edit the six source documents;
- run broad Project Control/Core suites, build, or E2E;
- push, merge, tag, publish, or mutate stash state.

## Acceptance criteria

The leaf is complete only when:

1. orientation resolves exactly six unique frozen sources and the exact destination;
2. all six source blobs match frozen/current inventory expectations;
3. all six sources have explicit claim-matrix dispositions;
4. current claims match pinned Core modules, package structure, focused tests, and dependency leaves;
5. the pipeline and all stage tables identify exact ownership, input, validation, output, failure, retained facts, and exclusions;
6. SPI, acceptance, handoff, provider, and drift vocabularies remain exact and context-separated;
7. fail-closed cases reject mismatches without guessing, repair, implicit conversion, or fallback adoption;
8. mock, seeded/smoke, and real-engine Evidence are labelled distinctly;
9. provider remains external/optional and default measurement remains unchanged;
10. focused Project Control/Core tests, data validation, deterministic generation, and type-check pass;
11. candidate and registered-state dual reviews return Critical 0 and Important 0;
12. tracked scope contains only the canonical leaf/test, bounded Document/Evidence, existing Node/map changes, and generated index;
13. Core, six sources, dependency leaves, orientation, inventory, family map, and coverage remain unchanged;
14. Text Engine and Core remain `unknown`, with no coverage or cleanup authority;
15. handoff names `text-engine/rustybuzz-shaping` as the next frozen batch without starting it.
