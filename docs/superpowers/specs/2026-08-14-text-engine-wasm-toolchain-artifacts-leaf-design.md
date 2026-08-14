# Text Engine WASM Toolchain and Artifacts Leaf Design

**Date:** 2026-08-14

**Status:** Approved for implementation

**Repository of authority:** `flowdoc-project-control`

**Read-only evidence repository:** `flowdoc-vnext-core`

## Goal

Synthesize the first reviewed Wave A batch into one usable canonical leaf:

`docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md`

The leaf explains the verified current package boundary, toolchain, build, bindgen, artifact-production, and digest-gating facts before preserving superseded designs in a historical section. It must not present chronological gate prose as current authority or claim that the broader Text Engine is production-ready.

## Frozen input

The batch is `text-engine/wasm-toolchain-and-artifacts` from `migrations/V0_1_0a_1/core/wave-a-orientation.json` at Project Control commit `61449f02d7ab8820f65007611a0f120a0ece4049`.

The exact source repository identity is Core commit `76a2f2311a898e781f53773390d47b05812911e4`. Current-state verification also inspects the clean Core descendant `c503a45c03e0ce3b7a6efba2b029ca842017faa0`; it never infers current truth from descendant status alone.

The batch contains exactly these 13 primary sources:

1. `docs/TEXT_ENGINE_WASM_ARTIFACT_BUILD_OUTPUT_GATE.md`
2. `docs/TEXT_ENGINE_WASM_ARTIFACT_DIGEST_PINNING_GATE.md`
3. `docs/TEXT_ENGINE_WASM_ARTIFACT_PRODUCTION_GATE.md`
4. `docs/TEXT_ENGINE_WASM_ARTIFACT_PRODUCTION_RETRY_GATE.md`
5. `docs/TEXT_ENGINE_WASM_BINDGEN_EXPORT_DEPENDENCY_GATE.md`
6. `docs/TEXT_ENGINE_WASM_BUILD_TOOLCHAIN_READINESS_GATE.md`
7. `docs/TEXT_ENGINE_WASM_TOOLCHAIN_ACQUISITION_GATE.md`
8. `docs/TEXT_ENGINE_WASM_TOOLCHAIN_OPTIONAL_READINESS_SMOKE.md`
9. `docs/TEXT_ENGINE_WASM_TOOLCHAIN_PROVISIONING_BOOTSTRAP_GATE.md`
10. `docs/TEXT_ENGINE_WASM_TOOLCHAIN_PROVISIONING_EXECUTION_GATE.md`
11. `docs/TEXT_ENGINE_WASM_TOOLCHAIN_RUST_UPGRADE_EXECUTION_GATE.md`
12. `docs/TEXT_ENGINE_WASM_TOOLCHAIN_VERSION_COMPATIBILITY_GATE.md`
13. `packages/text-engine-rust-wasm/README.md`

No source may be added, reassigned, renamed, edited, or deleted by this work.

## Chosen document form

The leaf is current-first with history at the end:

1. bounded purpose and authority;
2. verified current package boundary;
3. toolchain acquisition and provisioning;
4. build and bindgen flow;
5. artifact production, inventory, and digest checks;
6. operator verification commands;
7. known limits and unresolved questions;
8. historical design notes;
9. immutable evidence anchors.

This structure was selected over a chronological merge, which would make superseded stages look current, and over a separate history document, which would grow the document set and separate decisions from their context.

The historical section preserves material design transitions without repeating entire source documents. It explicitly labels completed gates, abandoned assumptions, and superseded procedures as historical.

## Authority and claim classification

Every material statement in the leaf belongs to exactly one class:

### Verified current fact

A statement is current only when it is supported at the pinned Core state by an executable or byte-verifiable anchor such as:

- `packages/text-engine-rust-wasm/package.json`;
- `packages/text-engine-rust-wasm/rust-shaper/Cargo.toml`;
- `packages/text-engine-rust-wasm/scripts/check-wasm-toolchain.mjs`;
- `packages/text-engine-rust-wasm/scripts/plan-wasm-toolchain-bootstrap.mjs`;
- `packages/text-engine-rust-wasm/scripts/verify-live-draft-artifacts.mjs`;
- tracked package outputs and fixture records;
- focused Core tests covering the named gate or artifact contract.

Existence proves only existence. A tracked artifact does not by itself prove production readiness, parity, successful regeneration, or adoption by the default Core measurer.

### Historical design fact

A source may establish that a gate, retry, upgrade, or provisioning step was designed or completed at a captured point. That fact is preserved as history unless current executable evidence independently supports the same operational claim.

### Unknown or conflict

A statement stays explicitly unresolved when executable evidence is missing, contradictory, unavailable in the local environment, or scoped to another Wave A leaf. The implementation may make the leaf narrower; it may not promote the statement by choosing the newest source.

### Operational instruction

A command may be presented as a current operator instruction only when the referenced script still exists at the pinned Core state and the implementation runs its non-mutating or sandboxed verification successfully. Environment-dependent installation or provisioning is never run against the user's machine as part of documentation synthesis.

## Evidence workflow

Before prose is written, implementation creates an ignored claim matrix for all 13 sources. Each row records:

- source path and frozen blob identity;
- material claim or historical contribution;
- proposed destination section;
- classification: current, historical, unknown, or duplicate;
- executable anchor and focused verification result when applicable;
- wording boundary that prevents claim inflation.

The matrix must account for every source at least once and must not silently resolve disagreements. Duplicate contributions may share a destination section, but every source retains an explicit disposition.

Current verification is read-only. It may inspect Git objects, manifests, scripts, fixtures, tracked WASM outputs, and focused tests. It must not install or upgrade Rust, wasm-pack, wasm-bindgen, Node, or system packages; mutate caches; rebuild tracked artifacts in place; or edit Core.

SHA-256 and artifact-identity statements are included only when recomputed from exact tracked bytes and matched to the owning fixture or identity record. Otherwise the leaf states that a digest was historically recorded and leaves current reproducibility unresolved.

## Canonical leaf and provenance boundary

The canonical leaf contains concise evidence anchors, not the 13 former documentation paths. Exact source ownership remains in the reviewed orientation artifact and later family coverage. This prevents the new canonical document and its tests from becoming active references that block eventual cleanup.

The leaf must:

- identify the pinned Core commit used for verification;
- distinguish package-local readiness from FlowDoc-wide production readiness;
- distinguish tracked artifacts from artifacts reproduced during this work;
- distinguish native Rust/Rustybuzz facts from WASM delivery facts;
- refer readers to the later `runtime-identity-and-evidence`, `rustybuzz-shaping`, Live Draft transition, and corrective-evidence leaves for claims outside this boundary;
- contain no absolute local path, mutable branch URL, machine-specific result, or secret;
- contain no assertion that the default Core measurer has migrated to this package unless separately proven.

## Project Control registration

After content and evidence review pass, Project Control may register the bounded leaf without declaring the whole Text Engine current:

- create a `text-engine` Node under `core` with `truthState: "unknown"`;
- create one active Document record for the leaf with authority limited to verified WASM toolchain and artifact facts;
- create only Evidence records backed by commands or byte checks actually completed in this implementation;
- add the leaf to the Core document map as a reviewed partial leaf while stating that the family overview and remaining leaves are incomplete;
- regenerate the project index from canonical records.

The Node remains `unknown` until all four Text Engine leaves, the family overview, coverage, reference repair, and publication review are complete. An active bounded Document does not promote its parent Node.

If mandatory current evidence is unavailable, the implementation still may produce a historically accurate candidate leaf, but it must stop before active Document/Evidence registration and report the exact blocker.

## Focused tests and review

The implementation adds a leaf-focused test that derives the batch from the reviewed orientation rather than duplicating its 13 path literals. The test proves:

- the selected qualified subgroup is exactly `text-engine/wasm-toolchain-and-artifacts`;
- its source count is exactly 13 and its proposed destination is unchanged;
- the canonical leaf has the required current-first sections in order;
- prohibited readiness, parity, default-measurer, and chronological-authority claims are absent unless paired with the required executable evidence assertion;
- the pinned Core identity and repository references are immutable lowercase 40-hex commits;
- the new Node remains `unknown` while the bounded Document may be active;
- generated output matches the canonical records;
- no source document is deleted or edited.

Review occurs in two dimensions:

1. **Contract review:** exact 13-source closure, provenance, scope, registration semantics, deterministic generation, and no deletion authority.
2. **Factual review:** each current statement is supported by the named Core anchor; history and unknowns are honestly labeled; no production-readiness claim is inflated.

Critical and Important findings block registration. A correction must add a focused failing assertion before changing prose or records.

## Delivery sequence

1. Freeze Project Control and Core identities and verify both worktrees are clean.
2. Extract an exact leaf brief from the reviewed orientation.
3. Read all 13 sources completely and create the ignored claim matrix.
4. Inspect current executable anchors and run only focused, non-mutating verification.
5. Write the candidate current-first canonical leaf.
6. Add and pass focused structural, factual-boundary, and source-preservation tests for the candidate.
7. Request independent content and factual review of the candidate leaf.
8. Correct blocking findings with focused RED/GREEN cycles.
9. After the leaf is approved, add registration tests first, then register the bounded Node, Document, completed Evidence, map entry, and generated index.
10. Run focused Project Control gates and request final contract/factual review of the registered state before publishing the handoff for the next synthesis-order entry.

## Explicit exclusions

This leaf does not:

- synthesize the other three Text Engine leaves;
- write the Text Engine family overview;
- declare Text Engine, Core, Live Draft, Editor, or Backend production-ready;
- modify Core code, tests, packages, tracked artifacts, or source documents;
- install or upgrade a toolchain;
- change inventory, family-map ownership, the reviewed Wave A orientation, schemas, or generic migration tooling;
- mark family coverage content-reviewed, ready-for-deletion, or closed;
- repair references or authorize deletion of any source;
- push, merge, tag, or publish immutable links to a remote.

## Acceptance criteria

The leaf batch is complete only when:

1. the frozen subgroup still resolves to exactly 13 unique sources and the exact proposed destination;
2. all 13 sources have an explicit claim-matrix disposition;
3. every current statement has executable or byte-verifiable support at the pinned Core state;
4. every unsupported or conflicting statement is historical or unknown;
5. the leaf follows the approved current-first structure and preserves material historical design context once;
6. focused tests and Project Control type/data/generation checks pass;
7. both independent review dimensions return Critical 0 and Important 0;
8. total tracked scope contains only the leaf, its bounded Project Control records/map/index, and its focused tests;
9. Core remains clean and unchanged;
10. all 13 source documents remain present and unchanged;
11. no migration coverage status, cleanup commit, or deletion authority changes;
12. the handoff names `text-engine/runtime-identity-and-evidence` as the next frozen batch without beginning it.
