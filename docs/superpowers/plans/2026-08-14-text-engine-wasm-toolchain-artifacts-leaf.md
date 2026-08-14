# Text Engine WASM Toolchain and Artifacts Leaf Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the frozen 13-source `text-engine/wasm-toolchain-and-artifacts` batch into one reviewed, registered, current-first canonical leaf without modifying Core or authorizing source cleanup.

**Architecture:** Read and classify all 13 frozen sources before drafting. Current prose is derived only from pinned executable or byte-verifiable Core evidence; historical gate prose is retained at the end and unsupported claims remain unknown. The approved leaf is registered as an active bounded Document under an `unknown` Text Engine Node, so the leaf becomes usable without promoting the wider family.

**Tech Stack:** Markdown, TypeScript, Vitest, JSON Schema/Ajv, Project Control canonical JSON, Git object inspection, PowerShell read-only hashing.

## Global Constraints

- Project Control starts from approved design commit `49851757f33534f14867f553082ae917e2a9c93d`.
- The reviewed orientation artifact remains unchanged and pins batch `text-engine/wasm-toolchain-and-artifacts` to exactly 13 sources.
- Frozen Core inventory commit is `76a2f2311a898e781f53773390d47b05812911e4`.
- Read-only Core evidence worktree starts clean at `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.
- Never modify Core code, tests, documentation, packages, artifacts, index, branch, stash, or worktree configuration.
- Never install or upgrade Rust, wasm-pack, wasm-bindgen, Node, or system packages; never rebuild tracked artifacts in Core.
- Chronology is not authority. A current claim requires executable or byte-verifiable evidence at the pinned Core state.
- Keep all unsupported parity, renderer drift, numeric-threshold, accepted-manifest, production-readiness, and default-measurer claims explicitly negative or unknown.
- Do not change inventory, family map, Wave A orientation, migration coverage, schemas, generic tooling, package files, or cleanup authority.
- Do not delete, rename, move, or edit any of the 13 source documents.
- The canonical leaf and focused test must not contain the 13 former documentation paths as contiguous literals; exact ownership remains in orientation and later coverage.
- Run only the focused gates named by this plan. Do not run Project Control or Core broad suites, build, E2E, or unrelated tests.
- Any command with no verdict after 180 seconds is stopped only after validating its exact process tree; record `NO VERDICT`, do not claim PASS, and do not retry broadly.
- Do not push, merge, tag, publish remote links, or mutate stash state.

---

### Task 1: Read the frozen batch and produce the candidate leaf

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md`
- Create: `tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts`
- Create ignored: `.superpowers/sdd/2026-08-14-text-engine-wasm-toolchain-artifacts-leaf/claim-matrix.md`
- Create ignored: `.superpowers/sdd/2026-08-14-text-engine-wasm-toolchain-artifacts-leaf/task-1-report.md`

**Interfaces:**
- Consumes: `migrations/V0_1_0a_1/core/wave-a-orientation.json`, `migrations/V0_1_0a_1/core/inventory.json`, frozen Core Git objects, and the exact package anchors named by the design.
- Produces: one candidate Markdown leaf and a focused content/provenance test. It does not create Project Control Node, Document, Evidence, map, or generated records yet.

- [ ] **Step 1: Freeze identities and the exact batch**

Assert clean Project Control and Core worktrees, exact heads, the unchanged orientation source commit, exact subgroup identity, exact destination, and 13 unique sources. Resolve each source's frozen blob from inventory and prove `git rev-parse "76a2f2311a898e781f53773390d47b05812911e4:$sourcePath"` equals that blob.

Capture the clean Project Control execution base once after this plan commit:

```powershell
$leafImplementationBase = git rev-parse HEAD
```

Retain this exact value in the plan ledger; never recompute it after implementation starts.

Use the correct Core worktree:

```powershell
$coreRoot = 'C:\Users\nekot\Documents\GitHub\flowdoc-vnext-core\.worktrees\core-route-documentation-cleanup'
git -C $coreRoot rev-parse HEAD
git -C $coreRoot status --porcelain
```

Expected: exact head `c503a45c03e0ce3b7a6efba2b029ca842017faa0` and empty status.

- [ ] **Step 2: Write the initial failing focused test**

Create `tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts`. Load orientation and the proposed leaf. Derive source paths from the qualified subgroup instead of copying the 13 literals into the test.

The first test must require:

```ts
const expectedQualifiedSubgroup = "text-engine/wasm-toolchain-and-artifacts";
const expectedLeafPath =
  "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md";
const expectedHeadings = [
  "## Authority and Scope",
  "## Current Package Boundary",
  "## Toolchain Discovery and Provisioning",
  "## Build and Bindgen Flow",
  "## Tracked Artifact Contract",
  "## Verification Commands",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Evidence Anchors",
] as const;
```

Assert exactly 13 unique sources, the exact proposed path, all headings once and in order, frozen Core evidence commit `c503a45c03e0ce3b7a6efba2b029ca842017faa0`, digest `4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44`, explicit `productionReady: false`, `defaultMeasurerReplacement: false`, `nativeWasmParityStatus: not-run`, renderer drift unknown, numeric threshold blocked, and accepted manifest blocked. Reject mutable branch URLs, absolute paths, and unqualified production-ready/default-measurer claims.

- [ ] **Step 3: Run the test to preserve RED**

Run:

```powershell
npm test -- tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts
```

Expected: Vitest starts and fails because the candidate leaf does not exist.

- [ ] **Step 4: Read and classify every source**

Read each of the 13 sources completely from the frozen commit with argument-array Git commands. Populate the ignored claim matrix with source path, frozen blob, material contribution, destination section, classification, executable anchor, verification result, and wording boundary.

The matrix must finish with machine-counted closure:

```text
assigned sources: 13
unique sources: 13
missing sources: 0
extra sources: 0
```

Do not resolve disagreements by date. Package README material remains package-local operational evidence.

- [ ] **Step 5: Verify the current package facts without mutation**

First prove no package path changed between frozen inventory and current evidence heads:

```powershell
git -C $coreRoot diff --exit-code --name-only `
  76a2f2311a898e781f53773390d47b05812911e4 `
  c503a45c03e0ce3b7a6efba2b029ca842017faa0 -- `
  packages/text-engine-rust-wasm
```

Expected: exit 0 and no paths.

Run exactly the 12 Core gate tests corresponding to the 12 historical gate sources with one worker. Do not run the Core full suite. Record file/test counts and runtime in the report.

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

Before hashing, prove the working artifact blob equals `HEAD:packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm`. Then compute SHA-256 read-only with `Get-FileHash` and require the lowercase digest to equal the fixture value `4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44`. Require the tracked byte size to equal the fixture's `13782` bytes. Do not rebuild the artifact.

If a focused gate or byte assertion fails, classify the affected claim as historical/unknown and stop before registration. Never change Core to make documentation evidence pass.

- [ ] **Step 6: Write the minimal current-first leaf**

Write the nine required sections. The current boundary must state:

- the package is private and package-local;
- scripts and tracked outputs exist;
- toolchain discovery/bootstrap planning is documented, but this work does not install tools;
- the tracked WASM artifact has the verified byte size and digest;
- metadata-only summaries are not raw WASM execution evidence;
- production readiness and default-measurer replacement are false;
- native/WASM parity is not run;
- renderer drift is unknown;
- numeric thresholds and accepted manifest remain blocked.

Historical Design Notes summarizes the acquisition → provisioning → compatibility → build → bindgen → production/retry → digest sequence as historical reasoning without using the former source paths.

Evidence Anchors use immutable local notation such as:

```text
flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/package.json
```

Do not use `blob/main`, local filesystem paths, or remote-publication claims.

- [ ] **Step 7: Run focused GREEN and scope checks**

Run:

```powershell
npm test -- tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts
npm run type-check
git diff --check
```

Expected: focused test PASS, type-check PASS, diff check PASS. Verify only the candidate leaf and focused test are tracked changes; Core remains exact and clean.

- [ ] **Step 8: Commit the candidate**

```powershell
git add -- `
  docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts
git commit -m "docs: synthesize Text Engine WASM leaf"
```

Write full RED/GREEN, source closure, Core gate, digest, scope, and risk evidence to the ignored Task 1 report.

---

### Task 2: Review and correct the candidate content

**Files:**
- Review: `docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md`
- Review: `tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts`
- Read ignored: `claim-matrix.md`
- Append ignored: `task-2-report.md`

**Interfaces:**
- Consumes: the exact Task 1 two-path commit, claim matrix, focused gate evidence, and read-only Core anchors.
- Produces: an approved candidate leaf. Registration remains absent.

- [ ] **Step 1: Generate an exact candidate review package**

Capture the Task 1 base/head, exact two-path diff, claim matrix, source/blob closure, focused test output, Core targeted-gate output, package diff, artifact byte/digest proof, and clean statuses.

- [ ] **Step 2: Request two read-only reviews in parallel**

Contract reviewer checks exact 13/13 ownership, heading/order contract, immutable evidence notation, no old-source literals, no Core mutation, and no registration/deletion authority.

Factual reviewer reads every current statement against the pinned Core manifest, scripts, fixtures, artifact, and focused tests. It checks that history is not current authority and that the leaf does not claim parity, renderer acceptance, production readiness, or default-measurer adoption.

Neither reviewer runs broad suites or writes files.

- [ ] **Step 3: Correct blocking findings narrowly**

READY requires both reviewers to return Critical 0 and Important 0. For each valid blocking finding, add a focused failing mutation/assertion first, change only the candidate leaf/test, rerun the Task 1 focused gates, and request scoped re-review. Amend the unpushed candidate commit when safe and recapture its hash/package.

- [ ] **Step 4: Record candidate approval**

Record both final verdicts, unresolved non-blocking unknowns, exact candidate commit, and the statement that no Project Control truth record has been created yet.

---

### Task 3: Register the bounded leaf in Project Control

**Files:**
- Modify: `tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts`
- Create: `data/nodes/text-engine.json`
- Create: `data/documents/text-engine-wasm-toolchain-artifacts.json`
- Create: `data/evidence/text-engine-wasm-toolchain-gates.json`
- Create: `data/evidence/text-engine-wasm-artifact-digest.json`
- Modify: `data/nodes/core.json`
- Modify: `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`
- Modify generated: `generated/project-index.json`
- Append ignored: `.superpowers/sdd/2026-08-14-text-engine-wasm-toolchain-artifacts-leaf/task-3-report.md`

**Interfaces:**
- Consumes: the independently approved candidate leaf and actual verification results.
- Produces: one `unknown` family Node, one active bounded Document, exactly two completed Evidence records, a partial document-map entry, and deterministic generated output. It does not create family coverage.

- [ ] **Step 1: Add registration REDs**

Extend the focused test to require the exact new records, reciprocal IDs, bounded authority, immutable Core evidence commit, map wording, unchanged family coverage set, and generated projection.

Required semantic values:

```json
{
  "nodeId": "text-engine",
  "nodeTruthState": "unknown",
  "documentId": "doc-text-engine-wasm-toolchain-artifacts",
  "documentRole": "contract",
  "documentLifecycle": "active",
  "toolchainEvidenceId": "evidence-text-engine-wasm-toolchain-gates",
  "artifactEvidenceId": "evidence-text-engine-wasm-artifact-digest",
  "repositoryId": "repo-core",
  "commit": "c503a45c03e0ce3b7a6efba2b029ca842017faa0"
}
```

Require the Node summary and Document authority to say that broader Text Engine adoption and production readiness remain unknown. Require `migrations/V0_1_0a_1/core/families/text-engine/coverage.json` to remain absent.

- [ ] **Step 2: Run the registration test to preserve RED**

Run:

```powershell
npm test -- tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts
```

Expected: candidate content tests pass and registration assertions fail because the records do not exist.

- [ ] **Step 3: Create the bounded records**

Create `data/nodes/text-engine.json` with parent `core`, order `20`, `truthState: "unknown"`, the one Document ID, both Evidence IDs, and repositories `repo-core` plus `repo-project-control`.

Create the active contract Document. Its authority text must be exactly bounded to verified package-local WASM toolchain and tracked-artifact facts and explicitly exclude wider Text Engine adoption, parity, production readiness, and default-measurer replacement. Repository references include the pinned package manifest, toolchain scripts, digest fixture, evidence summary, tracked artifact, and the focused Core gate tests actually run.

Create two Evidence records only because Task 1 completed their checks:

- toolchain evidence points to `packages/text-engine-rust-wasm/scripts/check-wasm-toolchain.mjs` and summarizes the focused acquisition/provisioning/version gate results without claiming tools are installed globally;
- artifact evidence points to `packages/text-engine-rust-wasm/fixtures/wasm-artifact-digest-pinning.v1.json` and records that tracked bytes matched size `13782` and SHA-256 `4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44`, without claiming parity or production readiness.

Use `verifiedAt: "2026-08-14T00:00:00.000Z"` for deterministic records.

- [ ] **Step 4: Update bounded navigation truth**

Update `data/nodes/core.json` summary to retain broader Core `unknown`, retain closed `core-route`, and mention only that a bounded Text Engine WASM leaf is registered while the family remains unknown.

Update `DOCUMENT_MAP.md` with a `Reviewed Partial Family Leaves` section linking the new leaf. State that it is not a family overview, Text Engine remains unknown, the remaining three leaves are incomplete, and no source cleanup is authorized. Do not list the 13 former source paths.

- [ ] **Step 5: Generate and reach GREEN**

Run:

```powershell
npm run generate
npm run check:data
npm test -- `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts `
  tests/schema.test.ts `
  tests/load-sources.test.ts `
  tests/semantic-validation.test.ts `
  tests/generation.test.ts
npm run type-check
git diff --check
```

Run `npm run generate` again and require zero tracked diff from the first generation. Expected: all focused gates PASS, exact deterministic index, no migration-coverage change, and Core still clean/exact.

- [ ] **Step 6: Commit exact registration scope**

Stage exactly the eight Task 3 paths listed above and commit:

```powershell
git commit -m "docs: register Text Engine WASM leaf"
```

Write commands, counts, record identities, generated digest, status, and exact scope to the Task 3 report.

---

### Task 4: Final verification, review, and handoff

**Files:**
- Review: the complete implementation range from the plan base through Task 3
- Create ignored: `.superpowers/sdd/2026-08-14-text-engine-wasm-toolchain-artifacts-leaf/task-4-report.md`

**Interfaces:**
- Consumes: candidate-review verdicts, exact Task 3 records, focused gates, clean repositories, and complete review packages.
- Produces: READY evidence for the first leaf and a handoff to `text-engine/runtime-identity-and-evidence` without starting it.

- [ ] **Step 1: Verify final identities and scope**

Require a clean Project Control HEAD and a clean unchanged Core head. Assert the complete implementation range contains only:

- candidate leaf;
- focused leaf test;
- Text Engine Node;
- bounded Document;
- two Evidence records;
- Core Node summary;
- Core document map;
- generated project index.

Assert orientation, inventory, family map, migration coverage, schemas, generic tools, package/lock files, and all Core paths are byte-unchanged.

- [ ] **Step 2: Run each final focused gate exactly once**

Run:

```powershell
npm run generate
npm run check:data
npm test -- `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts `
  tests/schema.test.ts `
  tests/load-sources.test.ts `
  tests/semantic-validation.test.ts `
  tests/generation.test.ts
npm run type-check
git diff --check $leafImplementationBase..HEAD
```

Do not run the broad Project Control check, build/E2E, or Core full suite. A timeout or failure is reported honestly and blocks completion unless the exact unchanged row passes one isolated retry under the user's timing policy.

- [ ] **Step 3: Request final contract and factual reviews**

Give reviewers the approved design, this plan, claim matrix, task reports, candidate review verdicts, complete Project Control diff, and read-only Core evidence identities.

Contract READY requires exact scope, deterministic records/generation, valid unknown-parent/active-leaf semantics, no coverage/deletion authority, no source references that obstruct future cleanup, and Critical 0 / Important 0.

Factual READY requires every current statement and Evidence summary to match the pinned Core state, every historical statement to be labeled, every unknown to remain unresolved, and Critical 0 / Important 0.

One correction wave may change only the listed implementation paths, must start with a focused RED, and receives one scoped re-review. A residual load-bearing finding stops the plan.

- [ ] **Step 4: Publish the local handoff**

Record:

- exact final Project Control commit and implementation paths;
- exact clean Core evidence commit;
- source closure 13/13 and frozen source preservation;
- verified artifact size/digest and negative readiness boundaries;
- focused test/type/data/generation results;
- both final review verdicts;
- remaining unknowns and explicit no-cleanup state;
- next frozen batch `text-engine/runtime-identity-and-evidence` with exactly 3 sources.

Keep the branch and linked worktrees in place. Do not merge, push, tag, delete sources, or begin the next batch in this task.
