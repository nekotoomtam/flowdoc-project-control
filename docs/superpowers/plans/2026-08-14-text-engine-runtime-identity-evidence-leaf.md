# Text Engine Runtime Identity and Evidence Leaf Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the frozen three-source `text-engine/runtime-identity-and-evidence` batch into one reviewed and registered contract-first canonical leaf without modifying Core, claiming parity, or promoting the wider Text Engine family.

**Architecture:** Derive source ownership from the immutable Wave A orientation, classify all three frozen documents before writing prose, and admit current claims only when pinned Core code, fixtures, tests, and artifact bytes support them. Register the reviewed leaf as the second active bounded Document under the existing `unknown` Text Engine Node, while retaining no family coverage or cleanup authority.

**Tech Stack:** Markdown, TypeScript, Vitest, JSON Schema/Ajv, Project Control canonical JSON, Git object inspection, PowerShell read-only hashing.

## Global Constraints

- Project Control starts from approved design commit `ecfcbe77502ab48758ecdd7908640031572ed0f8` plus this plan commit.
- The reviewed orientation at commit `61449f02d7ab8820f65007611a0f120a0ece4049` remains unchanged and pins `text-engine/runtime-identity-and-evidence` to exactly three sources.
- Frozen Core inventory commit is `76a2f2311a898e781f53773390d47b05812911e4`.
- Read-only Core evidence worktree starts clean at `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.
- The approved dependency leaf remains byte-unchanged at Project Control commit `c48de8c182a12e7c91480b57d1d492ce72ba373d`.
- Never modify Core code, tests, documentation, fixtures, packages, artifacts, index, branch, stash, or worktree configuration.
- Never execute native or WASM shaping, install or rebuild toolchains, populate Core fixtures, or write artifacts.
- Chronology is not authority. A current claim requires executable or byte-verifiable evidence at the pinned Core state.
- Keep Runtime Identity plan states (`identity-ready`, `parity-ready`, `blocked`) separate from digest states (`pinned`, `pending`, `missing`, `stale`).
- A pinned digest proves artifact identity only. It never proves native/WASM parity, renderer agreement, numeric acceptance, accepted-manifest status, production readiness, or default-measurer adoption.
- Do not change Wave A orientation, inventory, family map, migration coverage, schemas, generic tooling, package files, lock files, or cleanup authority.
- Do not delete, rename, move, or edit the three source documents or the approved dependency leaf.
- The canonical leaf, focused test, and Project Control records must not contain the three former source paths as contiguous literals; exact ownership remains in orientation and future family coverage.
- Run only the focused gates named by this plan. Do not run broad Project Control/Core suites, build, or E2E.
- Any command with no verdict after 180 seconds is stopped only after validating its exact process tree; record `NO VERDICT`, do not claim PASS, and do not retry broadly.
- Do not push, merge, tag, publish remote links, or mutate stash state.

---

### Task 1: Read the frozen batch and produce the candidate leaf

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md`
- Create: `tests/text-engine-runtime-identity-evidence-leaf.test.ts`
- Create ignored: `.superpowers/sdd/2026-08-14-text-engine-runtime-identity-evidence-leaf/claim-matrix.md`
- Create ignored: `.superpowers/sdd/2026-08-14-text-engine-runtime-identity-evidence-leaf/task-1-report.md`

**Interfaces:**
- Consumes: `migrations/V0_1_0a_1/core/wave-a-orientation.json`, `migrations/V0_1_0a_1/core/inventory.json`, the approved dependency leaf, frozen Core Git objects, Runtime Identity code/fixtures, the tracked WASM artifact, and exactly three focused Core tests.
- Produces: one candidate Markdown leaf and one focused content/provenance test. It does not create Project Control Node, Document, Evidence, map, coverage, or generated records yet.

- [ ] **Step 1: Freeze identities and exact ownership**

Assert clean Project Control and Core worktrees, exact heads, unchanged orientation bytes/blob, exact qualified subgroup, exact destination, and three unique sources. Derive the source list from orientation and prove each source blob equals its inventory blob at frozen Core commit `76a2f2311a898e781f53773390d47b05812911e4`.

Capture the clean Project Control execution base once after this plan commit:

```powershell
$runtimeIdentityLeafBase = git rev-parse HEAD
```

Record this exact value in the ignored ledger and never recompute it after implementation begins.

Use the read-only Core worktree:

```powershell
$coreRoot = 'C:\Users\nekot\Documents\GitHub\flowdoc-vnext-core\.worktrees\core-route-documentation-cleanup'
git -C $coreRoot rev-parse HEAD
git -C $coreRoot status --porcelain
```

Expected: exact head `c503a45c03e0ce3b7a6efba2b029ca842017faa0` and empty status.

Prove the dependency leaf at `docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md` equals its blob at `c48de8c182a12e7c91480b57d1d492ce72ba373d`.

- [ ] **Step 2: Write the initial failing focused test**

Create `tests/text-engine-runtime-identity-evidence-leaf.test.ts`. Load orientation, inventory, dependency leaf, and the proposed leaf. Derive source paths from the qualified subgroup instead of copying the three former document paths into the test.

Require these stable values:

```ts
const expectedQualifiedSubgroup = "text-engine/runtime-identity-and-evidence";
const expectedLeafPath =
  "docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md";
const expectedHeadings = [
  "## Authority and Scope",
  "## Runtime Identity Contract",
  "## Digest Evidence States",
  "## Building and Populating Evidence",
  "## Validation Rules",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Evidence Anchors",
] as const;
const expectedPlanStates = ["identity-ready", "parity-ready", "blocked"] as const;
const expectedDigestStates = ["pinned", "pending", "missing", "stale"] as const;
```

Assert exactly three unique sources, exact destination, all headings once/in order, exact state vocabularies with no cross-membership, pinned Core anchor format, dependency blob stability, and absence of former-source literals from leaf/test/data.

Require current values including manifest `text-engine-runtime-identity-v1`, policy `text-engine-runtime-identity-policy-v1`, adapter `@flowdoc/text-engine-rust-wasm`, output shape `glyph-line-box-v1`, targets `node-native`/`browser-wasm`/`worker-wasm`, Rustybuzz `0.20.1`, digest `4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44`, parity `identity-only`, comparison `not-run`, production false, and default measurer false.

Add mutation guards rejecting arbitrary mutable branch anchors, positive parity/renderer/threshold/accepted-manifest/production/default-measurer claims, and any wording that treats planned ICU4X revisions as installed or executed.

- [ ] **Step 3: Preserve candidate RED**

Run:

```powershell
npm test -- tests/text-engine-runtime-identity-evidence-leaf.test.ts
```

Expected: Vitest starts and fails because the candidate leaf does not exist.

- [ ] **Step 4: Read all three sources and close the claim matrix**

Read every source completely from the frozen commit with argument-array Git commands. Populate the ignored claim matrix with frozen blob, material contribution, destination section, classification (`current`, `historical`, or `unknown`), executable anchor, verification result, and wording boundary.

The matrix must finish with machine-counted closure:

```text
assigned sources: 3
unique sources: 3
missing sources: 0
extra sources: 0
```

Do not resolve disagreements by document date. The gate documents supply design history; current truth comes from pinned executable evidence.

- [ ] **Step 5: Verify current Runtime Identity facts read-only**

First prove the relevant Core package subtree has no frozen-to-current drift:

```powershell
git -C $coreRoot diff --exit-code --name-only `
  76a2f2311a898e781f53773390d47b05812911e4 `
  c503a45c03e0ce3b7a6efba2b029ca842017faa0 -- `
  packages/text-engine-rust-wasm
```

Run only the three focused Core tests, one worker:

```powershell
npm test -- --maxWorkers=1 `
  tests/textEngineRuntimeIdentity.test.ts `
  tests/textEngineRuntimeIdentityDigestEvidenceBuilderGate.test.ts `
  tests/textEngineRuntimeIdentityDigestEvidencePopulationGate.test.ts
```

Inspect read-only:

- `packages/text-engine-rust-wasm/src/runtimeIdentity.ts`;
- `packages/text-engine-rust-wasm/src/runtimeIdentityDigestEvidenceBuilder.ts`;
- the three Runtime Identity/digest fixtures;
- `packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm`.

Prove the working artifact equals its `HEAD` blob, is `13782` bytes, and hashes to the pinned lowercase SHA-256. Do not rebuild or populate anything.

If a focused test, subtree comparison, blob, size, or digest assertion fails, narrow the affected claim to historical/unknown and stop before registration. Never change Core to make documentation evidence pass.

- [ ] **Step 6: Write the minimal contract-first leaf**

Write the nine required sections. The current contract must distinguish identity ingredients, digest state, comparison evidence, and readiness results. State explicitly:

- the adapter package and runtime targets identify intended endpoints, not successful execution;
- `identity-ready` may coexist with unproven parity;
- `parity-ready` requires a valid pinned digest and a matching native/WASM comparison over all required facts;
- the builder creates a JSON-safe metadata summary and does not import/load WASM, execute shaping, compare runtime output, mutate pagination, bind production measurement, or write artifacts;
- population is historical workflow context; this synthesis only verifies existing tracked bytes;
- ICU4X revisions remain planned;
- raw runtime/WASM evidence is excluded;
- renderer drift remains unknown and numeric/accepted-manifest evidence remains blocked.

Historical Design Notes preserves the three-document sequence without naming their paths. Evidence Anchors use immutable local notation such as:

```text
flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:packages/text-engine-rust-wasm/src/runtimeIdentity.ts
```

Do not use mutable branches, absolute paths, remote-publication claims, or raw evidence payloads.

- [ ] **Step 7: Reach focused GREEN and commit the candidate**

Run:

```powershell
npm test -- tests/text-engine-runtime-identity-evidence-leaf.test.ts
npm run type-check
git diff --check
```

Expected: focused test, type-check, and diff check PASS; tracked scope is exactly candidate leaf plus focused test; Core remains exact and clean.

Commit:

```powershell
git add -- `
  docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md `
  tests/text-engine-runtime-identity-evidence-leaf.test.ts
git commit -m "docs: synthesize Text Engine runtime identity leaf"
```

Record RED/GREEN, source closure, dependency blob, focused Core counts, subtree comparison, artifact proof, scope, and risks in the ignored Task 1 report.

---

### Task 2: Obtain candidate contract and factual approval

**Files:**
- Review: `docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md`
- Review: `tests/text-engine-runtime-identity-evidence-leaf.test.ts`
- Read ignored: `claim-matrix.md`
- Create ignored: `.superpowers/sdd/2026-08-14-text-engine-runtime-identity-evidence-leaf/task-2-report.md`

**Interfaces:**
- Consumes: exact Task 1 two-path commit, claim matrix, focused gate evidence, dependency proof, and read-only Core anchors.
- Produces: an independently approved candidate leaf. Registration remains absent.

- [ ] **Step 1: Freeze an exact candidate review package**

Capture the Task 1 base/head, exact two-path diff, source/blob closure, claim matrix, focused Project Control output, exact three-test Core output, subtree diff, artifact byte/digest proof, dependency blob, and clean statuses.

- [ ] **Step 2: Request two independent read-only reviews**

The contract/provenance reviewer checks exact 3/3 ownership, contract-first ordering, state separation, immutable evidence notation, no former-source literals, dependency preservation, no Core mutation, and no registration/coverage/deletion authority.

The factual reviewer checks every current field/state claim against pinned code, fixtures, artifact bytes, and focused tests. It rejects any implication of successful native/WASM comparison, renderer acceptance, numeric acceptance, accepted manifest, production readiness, or default-measurer adoption.

Neither reviewer writes files or runs broad suites.

- [ ] **Step 3: Correct blocking findings narrowly**

READY requires both reviewers to return Critical 0 and Important 0. Each valid blocking finding begins with a focused failing assertion or mutation. Change only candidate leaf/test, rerun Task 1 focused gates, safely amend the unpushed candidate commit, regenerate the exact package, and request scoped re-review.

Stop after one correction wave if a new load-bearing contract ambiguity would require broader files or policy.

- [ ] **Step 4: Record candidate approval**

Record both final verdicts, exact candidate commit, remaining non-blocking unknowns, and confirmation that Project Control truth records are still absent.

---

### Task 3: Register the second bounded Text Engine leaf

**Files:**
- Modify: `tests/text-engine-runtime-identity-evidence-leaf.test.ts`
- Create: `data/documents/text-engine-runtime-identity-evidence.json`
- Create: `data/evidence/text-engine-runtime-identity-contract.json`
- Create: `data/evidence/text-engine-runtime-identity-digest.json`
- Modify: `data/nodes/text-engine.json`
- Modify: `data/nodes/core.json`
- Modify: `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`
- Modify generated: `generated/project-index.json`
- Create ignored: `.superpowers/sdd/2026-08-14-text-engine-runtime-identity-evidence-leaf/task-3-report.md`

**Interfaces:**
- Consumes: approved candidate leaf and actual verification results.
- Produces: one active bounded Document, exactly two completed Evidence records, updated existing Nodes/map, and deterministic generated output. It does not create or advance family coverage.

- [ ] **Step 1: Add registration REDs**

Extend the focused test to require:

```json
{
  "nodeId": "text-engine",
  "nodeTruthState": "unknown",
  "documentId": "doc-text-engine-runtime-identity-evidence",
  "documentRole": "contract",
  "documentLifecycle": "active",
  "contractEvidenceId": "evidence-text-engine-runtime-identity-contract",
  "digestEvidenceId": "evidence-text-engine-runtime-identity-digest",
  "repositoryId": "repo-core",
  "commit": "c503a45c03e0ce3b7a6efba2b029ca842017faa0"
}
```

Require the existing Text Engine Node to retain the approved WASM leaf plus the new Runtime Identity leaf, both Evidence pairs, and `truthState: "unknown"`. Require the Core Node summary and document map to say two bounded Text Engine leaves are registered while the family remains unknown and two later leaves plus the family overview remain incomplete. Require `migrations/V0_1_0a_1/core/families/text-engine/coverage.json` to remain absent.

Require generated output to match the canonical records and reject any former-source literal or mutable anchor in leaf/test/data.

- [ ] **Step 2: Preserve registration RED**

Run:

```powershell
npm test -- tests/text-engine-runtime-identity-evidence-leaf.test.ts
```

Expected: candidate content assertions pass and registration assertions fail because the new records do not exist.

- [ ] **Step 3: Create bounded Document and Evidence**

Create the active contract Document with authority limited to the verified Runtime Identity and JSON-safe digest-evidence contract. Explicitly exclude runtime execution, parity, renderer acceptance, numeric thresholds, accepted manifest, production readiness, default-measurer replacement, and family-wide authority.

Create exactly two completed Evidence records:

- contract Evidence records the focused Runtime Identity contract/builder verification and immutable code/fixture anchors;
- digest Evidence records that the tracked artifact blob matched `13782` bytes and SHA-256 `4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44`, while comparison remains `not-run`.

Use deterministic `verifiedAt: "2026-08-14T00:00:00.000Z"`. Do not create Evidence for parity, renderer drift, thresholds, accepted manifest, production, or default binding.

- [ ] **Step 4: Update bounded navigation truth**

Append the new Document and Evidence IDs to the existing Text Engine Node without reordering the approved first leaf. Update its summary from one registered WASM leaf to two reviewed bounded leaves while preserving family `unknown`.

Update the Core Node summary to retain broader Core `unknown`, retain the closed `core-route` child, and say two bounded Text Engine leaves are registered while the Text Engine family remains unknown.

Add the Runtime Identity leaf beneath `Reviewed Partial Family Leaves` in `DOCUMENT_MAP.md`. State that neither entry is a family overview, two later leaves plus the family overview remain incomplete, and no source cleanup is authorized. Do not list the three former source paths.

- [ ] **Step 5: Generate and reach registration GREEN**

Run:

```powershell
npm run generate
npm run check:data
npm test -- `
  tests/text-engine-runtime-identity-evidence-leaf.test.ts `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts `
  tests/schema.test.ts `
  tests/load-sources.test.ts `
  tests/semantic-validation.test.ts `
  tests/generation.test.ts
npm run type-check
git diff --check
```

Run `npm run generate` a second time and require zero diff from the first generated state. Expected: both Text Engine leaf suites and Foundation data gates PASS; dependency leaf stays byte-identical; no coverage appears; Core stays clean/exact.

- [ ] **Step 6: Commit exact registration scope**

Stage exactly the eight tracked Task 3 paths listed above and commit:

```powershell
git commit -m "docs: register Text Engine runtime identity leaf"
```

Record exact paths, record IDs, gate counts, generated digest, source/dependency preservation, and repository statuses in the Task 3 report.

---

### Task 4: Final verification, dual review, and handoff

**Files:**
- Review: complete implementation range from `$runtimeIdentityLeafBase` through Task 3
- Create ignored: `.superpowers/sdd/2026-08-14-text-engine-runtime-identity-evidence-leaf/task-4-report.md`

**Interfaces:**
- Consumes: candidate reviews, exact registered records, focused gates, clean repositories, and complete diff packages.
- Produces: READY evidence for the second leaf and a handoff to `text-engine/adapter-and-provider` without starting it.

- [ ] **Step 1: Assert final identities and exact scope**

Require clean Project Control and clean unchanged Core. Assert the complete implementation range contains exactly nine unique tracked paths:

1. candidate leaf;
2. focused test;
3. Runtime Identity Document;
4. contract Evidence;
5. digest Evidence;
6. existing Text Engine Node;
7. existing Core Node;
8. Core document map;
9. generated project index.

Assert orientation, inventory, family map, approved dependency leaf, migration coverage, schemas, generic tools, package/lock files, and every Core path are byte-unchanged.

- [ ] **Step 2: Run final focused gates once**

Run:

```powershell
npm run generate
npm run check:data
npm test -- `
  tests/text-engine-runtime-identity-evidence-leaf.test.ts `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts `
  tests/schema.test.ts `
  tests/load-sources.test.ts `
  tests/semantic-validation.test.ts `
  tests/generation.test.ts
npm run type-check
git diff --check $runtimeIdentityLeafBase..HEAD
```

Do not run broad Project Control/Core suites, build, or E2E. A timeout/failure is recorded honestly and blocks completion unless one exact unchanged row passes one isolated retry within the user's timing policy.

- [ ] **Step 3: Request final contract and factual reviews**

Give both reviewers the approved design, this plan, claim matrix, all task reports, candidate verdicts, complete Project Control diff, dependency proof, and read-only Core evidence identities.

Contract READY requires exact scope, deterministic records/generation, state-vocabulary separation, valid unknown-family/active-leaf semantics, dependency preservation, no coverage/deletion authority, no former-source literals outside orientation, and Critical 0 / Important 0.

Factual READY requires every current statement/Evidence summary to match pinned Core code, fixtures, tests, and artifact bytes; every historical statement to be labeled; every unsupported outcome to stay negative/unknown; and Critical 0 / Important 0.

One correction wave may touch only the nine listed implementation paths, begins with focused RED, repeats the affected focused gates, and receives scoped re-review. A residual load-bearing finding stops the plan.

- [ ] **Step 4: Publish the local handoff**

Record:

- exact final Project Control commit and nine-path implementation scope;
- exact clean Core evidence commit;
- source closure 3/3 and frozen-source preservation;
- dependency leaf preservation;
- verified Runtime Identity values and artifact byte/digest proof;
- explicit negative parity/renderer/threshold/accepted-manifest/production/default-binding boundaries;
- focused data/test/type/generation results;
- both final review verdicts;
- Text Engine `unknown`, no coverage, and no cleanup authority;
- next frozen batch `text-engine/adapter-and-provider` with exactly six sources.

Keep the branch and linked worktrees in place. Do not merge, push, tag, delete sources, or begin the next batch in this task.
