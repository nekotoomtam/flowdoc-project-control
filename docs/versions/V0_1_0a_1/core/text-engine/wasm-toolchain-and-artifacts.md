# Text Engine WASM Toolchain and Artifacts

## Authority and Scope

This leaf is the current operational reference for the package-local WASM toolchain, build boundary, generated package, and retained artifact in `@flowdoc/text-engine-rust-wasm`. Its source batch is frozen at Core commit `76a2f2311a898e781f53773390d47b05812911e4`; current facts were independently checked against the clean Core evidence commit `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.

The authority is deliberately narrow. A tracked artifact proves that exact bytes are retained; it does not prove shaping execution, native/WASM parity, renderer agreement, adoption by Core's default measurer, or FlowDoc-wide readiness. Runtime identity and evidence, adapter/provider selection, Rustybuzz shaping, Live Draft transitions, and corrective evidence belong to their respective later leaves.

## Current Package Boundary

`@flowdoc/text-engine-rust-wasm` is a private, package-local adapter package. Its manifest owns Rustybuzz smoke/build commands, WASM discovery and plan commands, the historical `pkg` build command, and separate QA-oriented Live Draft entry points. The package remains external to Core `src/**`; the root check does not install or require the WASM toolchain or rebuild the retained artifact.

The retained historical `pkg` output contains JavaScript glue, TypeScript declarations, a package manifest, and `flowdoc_text_engine_bg.wasm`. The Rust source behind that artifact exposes only a readiness marker and boundary-version string. It is not a shaping or measurement export.

The artifact-pinning fixture that governs this leaf records the following bounded status:

```text
productionReady: false
defaultMeasurerReplacement: false
nativeWasmParityStatus: not-run
rendererBackedDriftStatus: unknown
numericDriftThresholdStatus: blocked
acceptedManifestStatus: blocked
```

These are artifact-boundary values, not an aggregation of later package summaries. Metadata-only summaries are not raw native or WASM execution evidence.

## Toolchain Discovery and Provisioning

The package exposes three non-root operations:

- `npm run wasm:check-toolchain` discovers Cargo, installed Rust targets, `wasm-pack`, and the optional standalone `wasm-bindgen` CLI, then emits JSON-safe status with an always-zero diagnostic policy.
- `npm run wasm:readiness-smoke` is the named wrapper around that diagnostic.
- `npm run wasm:bootstrap-plan` reports the accepted developer-or-CI bootstrap plan and observed availability. The script is plan/check only and does not install tools.

Toolchain provisioning is environment work outside this documentation synthesis. This work did not install or upgrade Rust, add a Rust target, install `wasm-pack`, mutate caches, or select a canonical CI image. Any diagnostic output about locally installed versions is ephemeral and must not be promoted to repository truth.

## Build and Bindgen Flow

The package manifest retains this build flow:

```text
wasm-pack build rust-shaper --target web --out-dir ../pkg --out-name flowdoc_text_engine
```

The `rust-shaper` manifest defines a `flowdoc_text_engine` library with `cdylib` and `rlib` crate types, pins Rustybuzz to `0.20.1`, and declares package-local `wasm-bindgen = "0.2"`. The library's WASM boundary is intentionally minimal: a numeric readiness marker and a boundary-version string. The native smoke binary remains a separate path.

The command above explains the tracked generated-package shape. It was not rerun during this documentation task, so this leaf makes no reproducibility claim for the current machine or a future CI environment.

## Tracked Artifact Contract

At Core evidence commit `c503a45c03e0ce3b7a6efba2b029ca842017faa0`, the working artifact matches the `HEAD` Git blob `3a2b4e24dd5cfea0af9985612678a59dd333c0a6`. Direct inspection found the WASM magic/version header `0061736d01000000`, a tracked byte size of `13782`, and this lowercase SHA-256:

```text
4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44
```

The size and digest match the current artifact-digest-pinning fixture. They were computed from the retained bytes without rebuilding the package. The contract is identity and retention only: the artifact's existence and digest do not show that it executed a shaping corpus, matched native output, matched a renderer, met a numeric threshold, entered an accepted manifest, or replaced a production measurer.

## Verification Commands

Run these commands from the Core repository when rechecking the package boundary. Discovery and bootstrap planning are non-installing; their environment observations must be treated as local diagnostics.

```text
npm --prefix packages/text-engine-rust-wasm run wasm:check-toolchain
npm --prefix packages/text-engine-rust-wasm run wasm:readiness-smoke
npm --prefix packages/text-engine-rust-wasm run wasm:bootstrap-plan
```

Verify retained bytes without rebuilding:

```text
git rev-parse HEAD:packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm
git hash-object packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm
Get-FileHash -Algorithm SHA256 packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm
```

The focused Core contract uses one worker and these test files:

```powershell
npm test -- --maxWorkers=1 `
  tests/textEngineWasmArtifactBuildOutputGate.test.ts `
  tests/textEngineWasmArtifactDigestPinningGate.test.ts `
  tests/textEngineWasmArtifactProductionGate.test.ts `
  tests/textEngineWasmArtifactProductionRetryGate.test.ts `
  tests/textEngineWasmBindgenExportDependencyGate.test.ts `
  tests/textEngineWasmBuildToolchainReadinessGate.test.ts `
  tests/textEngineWasmToolchainAcquisitionGate.test.ts `
  tests/textEngineWasmToolchainOptionalReadinessSmoke.test.ts `
  tests/textEngineWasmToolchainProvisioningBootstrapGate.test.ts `
  tests/textEngineWasmToolchainProvisioningExecutionGate.test.ts `
  tests/textEngineWasmToolchainRustUpgradeExecutionGate.test.ts `
  tests/textEngineWasmToolchainVersionCompatibilityGate.test.ts
```

## Known Limits and Unknowns

- This leaf does not establish a reproducible artifact producer. A pinned CI image or equivalent immutable runner, including exact Rust and `wasm-pack` versions, remains unspecified.
- The retained `pkg` artifact exports readiness/version functions, not shaping or measurement.
- Native/WASM parity is not run within this artifact contract; renderer drift is unknown; numeric thresholds and an accepted manifest remain blocked.
- Production readiness is false, and the default Core measurer has not been replaced by this package.
- Later runtime-identity, Rustybuzz-shaping, adapter/provider, Live Draft, and corrective-evidence leaves own their distinct evidence. Their summaries or artifacts must not be collapsed into this historical `pkg` contract.

## Historical Design Notes

The frozen gate sequence is useful as reasoning, not as present-tense authority:

1. Acquisition separated optional package tooling from root checks and introduced JSON-safe discovery.
2. Provisioning split a non-installing plan from explicitly authorized environment mutation.
3. Compatibility analysis responded to an observed Rust/`wasm-pack` mismatch and proposed both an immediate upgrade and a longer-term immutable producer.
4. Build preparation added the package-local library target and retained `wasm-pack` command.
5. Bindgen work added the package-local dependency and only the minimal readiness/version exports.
6. Production and retry gates moved from a blocked attempt to a retained generated package after readiness and dependency issues were addressed.
7. Digest pinning finally bound the accepted path and runtime-identity context to exact retained bytes.

Earlier missing-tool, missing-target, missing-artifact, and pending-digest statements are historical transitions. Later successful steps do not retroactively prove measurement execution or broader readiness.

## Evidence Anchors

- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/package.json` — private package boundary and scripts.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/rust-shaper/Cargo.toml` — crate types and Rust dependencies.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/rust-shaper/src/lib.rs` — minimal WASM exports.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/scripts/check-wasm-toolchain.mjs` — non-fatal discovery behavior.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/scripts/plan-wasm-toolchain-bootstrap.mjs` — non-installing bootstrap plan.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/scripts/verify-live-draft-artifacts.mjs` — separate Live Draft artifact verification, outside this artifact's proof.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/fixtures/wasm-artifact-production-retry.v1.json` — generated package and byte-size record.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/fixtures/wasm-artifact-digest-pinning.v1.json` — digest and explicit boundary statuses.
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm` — exact retained bytes.
