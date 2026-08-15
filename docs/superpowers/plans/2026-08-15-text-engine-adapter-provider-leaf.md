# Text Engine Adapter and Provider Leaf Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the frozen six-source `text-engine/adapter-and-provider` batch into one detailed, reviewed, and registered contract-pipeline leaf without modifying Core, replacing default measurement, or promoting the wider Text Engine family.

**Architecture:** Derive exact ownership from the immutable Wave A orientation, classify all six sources before drafting, and admit current claims only when pinned Core modules, package structure, and focused tests support them. Present the request → Evidence → acceptance → draft → optional-provider flow as separate fail-closed contracts, then register the leaf as the third bounded active Document under the existing `unknown` Text Engine Node.

**Tech Stack:** Markdown, TypeScript, Vitest, JSON Schema/Ajv, Project Control canonical JSON, Git object inspection, PowerShell read-only verification.

## Global Constraints

- Project Control starts from approved design commit `81fb348f6b64e9e9f6c23f82471dffbe680ae42e` plus this plan commit.
- The reviewed orientation at commit `61449f02d7ab8820f65007611a0f120a0ece4049` remains unchanged and pins `text-engine/adapter-and-provider` to exactly six sources.
- Frozen Core inventory commit is `76a2f2311a898e781f53773390d47b05812911e4`.
- Read-only Core evidence worktree starts clean at `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.
- Approved dependency leaves `text-engine/wasm-toolchain-and-artifacts` and `text-engine/runtime-identity-and-evidence` remain byte-unchanged.
- Never modify Core code, tests, documentation, fixtures, packages, artifacts, index, branch, stash, or worktree configuration.
- Chronology is not authority. Current code, package structure, fixtures, and focused tests at the pinned Core head govern current truth.
- Keep scaffold/mock Evidence, seeded/smoke Evidence, and real-engine Evidence explicitly distinct.
- Keep the two `accepted` vocabularies context-separated: Evidence Acceptance `accepted` is not drift-report `accepted`, and neither means production accepted.
- The external provider remains optional; Core never imports it into `src/**`; `measureVNextText` and default pagination measurement remain unchanged.
- Do not change Wave A orientation, inventory, family map, migration coverage, schemas, generic tooling, package files, lock files, or cleanup authority.
- Do not delete, rename, move, or edit the six source documents or the two approved dependency leaves.
- The canonical leaf, focused tests, and Project Control records must not contain the six former source paths as contiguous literals; exact ownership remains in orientation and future family coverage.
- Run only the focused gates named by this plan. Do not run broad Project Control/Core suites, build, or E2E.
- Any command with no verdict after 180 seconds is stopped only after validating its exact process tree; record `NO VERDICT`, do not claim PASS, and do not retry broadly.
- Do not push, merge, tag, publish remote links, or mutate stash state.

---

### Task 1: Read the frozen batch and produce the candidate leaf

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md`
- Create: `tests/text-engine-adapter-provider-leaf.test.ts`
- Create ignored: `.superpowers/sdd/2026-08-15-text-engine-adapter-provider-leaf/claim-matrix.md`
- Create ignored: `.superpowers/sdd/2026-08-15-text-engine-adapter-provider-leaf/task-1-report.md`

**Interfaces:**
- Consumes: Wave A orientation, Core inventory, both approved Text Engine dependency leaves, six frozen Core sources, four current contract modules, package scaffold/provider structure, and five focused Core tests.
- Produces: one candidate Markdown leaf and one focused content/provenance test. It creates no Project Control Document, Evidence, Node/map, coverage, or generated records yet.

- [ ] **Step 1: Freeze clean identities and exact six-source ownership**

Assert Project Control and Core are clean and at the required heads. Capture the Project Control execution base once after this plan commit:

```powershell
$adapterProviderLeafBase = git rev-parse HEAD
```

Record this exact value in the plan ledger and never recompute it after implementation starts.

Use the read-only Core worktree:

```powershell
$coreRoot = 'C:\Users\nekot\Documents\GitHub\flowdoc-vnext-core\.worktrees\core-route-documentation-cleanup'
git -C $coreRoot rev-parse HEAD
git -C $coreRoot status --porcelain
```

Expected: exact head `c503a45c03e0ce3b7a6efba2b029ca842017faa0` and empty status.

Load orientation and inventory from Project Control. Require exact subgroup `text-engine/adapter-and-provider`, exact destination `docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md`, exactly six unique source paths, frozen source commit, inventory digest, and six aligned source blob IDs. Prove each frozen source blob equals its current Core blob.

Capture and assert the Git blobs of both approved dependency Markdown files. They must remain identical throughout all tasks.

- [ ] **Step 2: Write the initial focused test before the leaf**

Create `tests/text-engine-adapter-provider-leaf.test.ts`. Derive source paths from orientation; never copy the six former documentation paths into the test.

Require these exact stable values:

```ts
const expectedQualifiedSubgroup = "text-engine/adapter-and-provider";
const expectedLeafPath =
  "docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md";
const expectedHeadings = [
  "## Authority and Scope",
  "## Pipeline at a Glance",
  "## Adapter Request Contract",
  "## Produced Evidence Contract",
  "## Evidence Acceptance Contract",
  "## Measurement Draft Handoff",
  "## Optional Renderer-backed Provider",
  "## Drift Reporting and Adoption Boundary",
  "## Fail-closed Matrix",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Evidence Anchors",
] as const;
const expectedSpiStates = ["ready-for-adapter-implementation", "blocked"] as const;
const expectedAcceptanceStates = ["accepted", "blocked"] as const;
const expectedHandoffStates = ["ready", "blocked"] as const;
const expectedProviderStates = ["ready", "blocked"] as const;
const expectedDriftStates = ["accepted", "rejected"] as const;
```

Assert each heading occurs exactly once and in order. Parse exact labelled state declarations/tables, require uniqueness within each vocabulary, require Evidence Acceptance and drift `accepted` to remain separately labelled, and reject extra or duplicate labelled declarations.

Pin orientation raw bytes/Git blob, inventory digest, subgroup/destination/source membership, all six inventory blobs, both dependency leaf blobs, and full lowercase immutable Core anchors.

Add robust mutation guards for every unsupported positive claim named by the specification, including Core engine execution, malformed Evidence acceptance, non-accepted handoff, glyph facts in drafts, provider validation bypass, Core provider import, default replacement, production meaning from drift acceptance, real-engine meaning from seeded/mock Evidence, cache mutation, parity/manifest/production/default readiness, and Text Engine promotion.

- [ ] **Step 3: Preserve the missing-leaf RED**

Run:

```powershell
npm test -- tests/text-engine-adapter-provider-leaf.test.ts
```

Expected: Vitest starts and fails because the candidate leaf does not exist.

- [ ] **Step 4: Read all six sources and close the claim matrix**

Read each source completely from frozen Core with argument-array Git commands. Populate the ignored claim matrix with source path, frozen/current blob, material contribution, destination section, classification (`current`, `historical`, or `unknown`), executable anchor, verification result, and wording boundary.

The matrix must end with machine-counted closure:

```text
assigned sources: 6
unique sources: 6
missing sources: 0
extra sources: 0
```

Assign close-audit facts owned by Runtime Identity, WASM toolchain, or Rustybuzz shaping to their dependency/cross-reference boundary rather than absorbing them into this leaf.

- [ ] **Step 5: Verify current contract and provider facts read-only**

Inspect these exact current modules:

- `src/renderer/textEngineAdapterSpi.ts`;
- `src/renderer/textEngineEvidenceAcceptance.ts`;
- `src/renderer/textEngineMeasurementDraftHandoff.ts`;
- `packages/text-engine-rust-wasm/src/rendererBackedProvider.ts`.

Verify relevant files have no frozen-to-current drift, or stop and explicitly reclassify every changed claim before prose:

```powershell
git -C $coreRoot diff --exit-code --name-only `
  76a2f2311a898e781f53773390d47b05812911e4 `
  c503a45c03e0ce3b7a6efba2b029ca842017faa0 -- `
  src/renderer/textEngineAdapterSpi.ts `
  src/renderer/textEngineEvidenceAcceptance.ts `
  src/renderer/textEngineMeasurementDraftHandoff.ts `
  packages/text-engine-rust-wasm/src/rendererBackedProvider.ts
```

Run only the five focused Core tests, one worker:

```powershell
npm test -- --maxWorkers=1 `
  tests/textEngineAdapterSpi.test.ts `
  tests/textEngineEvidenceAcceptance.test.ts `
  tests/textEngineMeasurementDraftHandoff.test.ts `
  tests/textEngineAdapterPackageScaffold.test.ts `
  tests/rendererBackedTextEngineProvider.test.ts
```

Use a literal-path scan to prove Core `src/**` does not import `@flowdoc/text-engine-rust-wasm` or the provider module. Verify the provider uses injected public Core boundary functions and that focused tests retain default-measurement independence.

If any focused test, module diff, dependency blob, or import-boundary assertion fails, narrow the affected claim to historical/unknown and stop before registration. Never change Core to make documentation evidence pass.

- [ ] **Step 6: Write the minimal contract-pipeline leaf**

Write all 13 required sections and the tables mandated by the design. Use exact current exported planner/bridge names and status vocabularies.

The leaf must state:

- Core creates requests but does not execute an engine;
- the external package owns Evidence production and the optional provider;
- mock scaffold, seeded/smoke, and real-engine Evidence are different authority classes;
- Evidence Acceptance validates data and produces no draft;
- handoff consumes only accepted Evidence and drops glyph facts from the existing draft shape;
- provider routes through injected acceptance/handoff boundaries and remains optional;
- drift `accepted` is only tolerance-local and never production/default acceptance;
- `measureVNextText`, pagination defaults, cache, and invalidation contracts remain unchanged;
- current provider Evidence remains seeded/smoke-bounded;
- production rollout, real-engine generality, parity, and default adoption remain unknown/blocked.

Historical Design Notes preserves the former no-concrete-adapter state without presenting it as current. Evidence Anchors use immutable local notation pinned to full Core commit `c503a45c03e0ce3b7a6efba2b029ca842017faa0` and include all material module plus focused-test anchors.

- [ ] **Step 7: Reach focused GREEN and commit the candidate**

Run:

```powershell
npm test -- tests/text-engine-adapter-provider-leaf.test.ts
npm run type-check
git diff --check
```

Expected: focused test, type-check, and whitespace checks PASS; tracked scope is exactly candidate leaf plus focused test; both repositories and dependency blobs remain unchanged.

Commit:

```powershell
git add -- `
  docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md `
  tests/text-engine-adapter-provider-leaf.test.ts
git commit -m "docs: synthesize Text Engine adapter provider leaf"
```

Write RED/GREEN, 6/6 closure, Core focused counts, module/import/dependency proofs, exact scope, and risks to the ignored Task 1 report.

---

### Task 2: Obtain independent candidate approval

**Files:**
- Review: `docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md`
- Review: `tests/text-engine-adapter-provider-leaf.test.ts`
- Read ignored: `claim-matrix.md`
- Create ignored: `.superpowers/sdd/2026-08-15-text-engine-adapter-provider-leaf/task-2-report.md`

**Interfaces:**
- Consumes: exact Task 1 two-path commit, claim matrix, focused Project Control/Core evidence, import-boundary proof, and dependency blobs.
- Produces: an independently approved candidate. Registration remains absent.

- [ ] **Step 1: Freeze the exact candidate review package**

Capture Task 1 base/head, exact two-path diff, 6/6 blob closure, claim matrix, focused outputs, module diff, Core import scan, dependency blobs, and clean statuses with a helper-generated package and SHA-256.

- [ ] **Step 2: Request contract/provenance and factual reviews in parallel**

The contract/provenance reviewer checks source ownership, exact tables/states, pipeline/failure boundaries, both `accepted` contexts, immutable anchors, dependency preservation, no former-source literals, and no registration/coverage/Core mutation.

The factual reviewer checks every current claim against pinned modules, package structure, and five focused tests. It specifically distinguishes historical package absence from current optional-provider existence, mock/seeded Evidence from real-engine Evidence, and drift acceptance from production/default acceptance.

Neither reviewer writes files or runs broad suites.

- [ ] **Step 3: Correct blocking findings narrowly**

READY requires both reviewers to return Critical 0 and Important 0. Every valid blocking finding begins with a focused failing assertion/mutation. Change only candidate leaf/test, rerun Task 1 focused gates, safely amend the unpushed candidate commit, regenerate its exact package, and request scoped re-review.

Stop for user direction if a finding conflicts with the approved design or needs broader files. Record non-blocking Minors for final review.

- [ ] **Step 4: Record candidate approval**

Record both final verdicts, candidate commit, deferred Minors, remaining unknowns, and confirmation that registration remains absent.

---

### Task 3: Register the third bounded Text Engine leaf

**Files:**
- Modify: `tests/text-engine-adapter-provider-leaf.test.ts`
- Modify: `tests/text-engine-runtime-identity-evidence-leaf.test.ts`
- Modify: `tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts`
- Create: `data/documents/text-engine-adapter-provider.json`
- Create: `data/evidence/text-engine-adapter-contract.json`
- Create: `data/evidence/text-engine-provider-bridge.json`
- Modify: `data/nodes/text-engine.json`
- Modify: `data/nodes/core.json`
- Modify: `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`
- Modify generated: `generated/project-index.json`
- Create ignored: `.superpowers/sdd/2026-08-15-text-engine-adapter-provider-leaf/task-3-report.md`

**Interfaces:**
- Consumes: approved candidate and actual verification results.
- Produces: one active bounded Document, exactly two completed Evidence records, updated existing Nodes/map/tests, and deterministic generated output. It creates no family coverage.

- [ ] **Step 1: Add registration REDs to the new focused test**

Require these exact registration values:

```json
{
  "nodeId": "text-engine",
  "nodeTruthState": "unknown",
  "documentId": "doc-text-engine-adapter-provider",
  "documentRole": "contract",
  "documentLifecycle": "active",
  "contractEvidenceId": "evidence-text-engine-adapter-contract",
  "providerEvidenceId": "evidence-text-engine-provider-bridge",
  "repositoryId": "repo-core",
  "commit": "c503a45c03e0ce3b7a6efba2b029ca842017faa0"
}
```

Require exact reciprocal IDs and ordering: the two prior Documents/Evidence pairs remain byte-identical and first; the new Document/Evidence IDs append after them. Require both Nodes to remain `unknown`, the map to list three reviewed partial leaves, only `rustybuzz-shaping` plus family overview to remain incomplete, generated projection equality, absent Text Engine coverage, and no former-source/mutable-anchor strings.

- [ ] **Step 2: Preserve registration RED**

Run:

```powershell
npm test -- tests/text-engine-adapter-provider-leaf.test.ts
```

Expected: candidate content assertions pass and registration assertions fail because new records do not exist.

- [ ] **Step 3: Create bounded Document and two Evidence records**

Create an active contract Document whose authority is limited to the verified request, acceptance, draft-handoff, and optional provider contracts. Its repository references include immutable Core anchors for the four material modules and five focused tests.

Create exactly two completed Evidence records:

- `evidence-text-engine-adapter-contract` records the focused SPI, acceptance, handoff, and scaffold checks while denying Core engine execution and production binding;
- `evidence-text-engine-provider-bridge` records the optional renderer-backed provider/profile/drift/default-independence checks while labelling Evidence seeded/smoke-bounded and denying default replacement.

Use deterministic `verifiedAt: "2026-08-15T00:00:00.000Z"`. Neither record may claim real production Evidence, parity, accepted manifest, default adoption, or production readiness.

- [ ] **Step 4: Update Nodes and document map**

Append the new IDs without reordering the existing arrays. Use these exact current summaries:

```text
Text Engine family remains unknown; three reviewed bounded leaves register package-local WASM toolchain/artifact facts, runtime identity/digest-evidence facts, and adapter/provider contract facts only, while broader adoption and production readiness remain unknown.
```

```text
Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; three bounded Text Engine leaves are registered while the Text Engine family remains unknown.
```

Add the new leaf as the third `Reviewed Partial Family Leaves` entry. State that none is a family overview, Text Engine remains unknown, `rustybuzz-shaping` plus the family overview remain incomplete, and no source cleanup is authorized.

- [ ] **Step 5: Preserve stale dependency-test REDs before correcting them**

After records and map exist, generate the current projection once, then run all three leaf tests together before editing the two prior tests:

```powershell
npm run generate
npm test -- `
  tests/text-engine-adapter-provider-leaf.test.ts `
  tests/text-engine-runtime-identity-evidence-leaf.test.ts `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts
```

Expected: the new test passes; both prior tests fail only where they hard-code two Documents/four Evidence IDs, two-leaf summaries, or two remaining leaves. Record exact failures. Any other failure stops the task.

- [ ] **Step 6: Correct only obsolete dependency-test expectations**

Update both prior tests to assert the exact three-Document/six-Evidence ordering, exact three-leaf summaries, and one remaining leaf plus family overview. Preserve all prior leaf content, provenance, record equality, negative-claim, and generated-order assertions. Do not weaken a guard or modify either dependency Markdown/canonical record.

- [ ] **Step 7: Generate deterministically and reach full focused GREEN**

Run:

```powershell
npm run generate
npm run check:data
npm test -- `
  tests/text-engine-adapter-provider-leaf.test.ts `
  tests/text-engine-runtime-identity-evidence-leaf.test.ts `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts `
  tests/schema.test.ts `
  tests/load-sources.test.ts `
  tests/semantic-validation.test.ts `
  tests/generation.test.ts
npm run type-check
git diff --check
```

Run `npm run generate` again and require zero tracked drift. Require absent Text Engine coverage, unchanged dependency leaf/record blobs, and clean unchanged Core.

- [ ] **Step 8: Commit exact registration scope**

Stage exactly the ten tracked Task 3 paths listed above and commit:

```powershell
git commit -m "docs: register Text Engine adapter provider leaf"
```

Write registration REDs, stale dependency REDs, final GREEN counts, record IDs, generated hashes, exact scope, preservation proofs, and repository statuses to the ignored Task 3 report.

---

### Task 4: Final focused verification, dual review, and handoff

**Files:**
- Review: complete implementation range from `$adapterProviderLeafBase` through Task 3
- Create ignored: `.superpowers/sdd/2026-08-15-text-engine-adapter-provider-leaf/task-4-report.md`

**Interfaces:**
- Consumes: candidate verdicts, exact registered records, focused gates, clean repositories, and complete helper-generated packages.
- Produces: READY evidence for the third leaf and handoff to `text-engine/rustybuzz-shaping` without starting it.

- [ ] **Step 1: Assert final identities and exact 11-path scope**

Require clean Project Control and clean unchanged Core. The complete implementation range contains exactly 11 unique tracked paths:

1. adapter/provider leaf;
2. new adapter/provider focused test;
3. Runtime Identity focused test;
4. WASM toolchain focused test;
5. adapter/provider Document;
6. adapter contract Evidence;
7. provider bridge Evidence;
8. Text Engine Node;
9. Core Node;
10. Core document map;
11. generated project index.

Assert orientation, inventory, family map, both dependency leaves and their canonical records, migration coverage, schemas, generic tools, package/lock files, and all Core paths are byte-unchanged.

- [ ] **Step 2: Run final focused gates once**

Run:

```powershell
npm run generate
npm run check:data
npm test -- `
  tests/text-engine-adapter-provider-leaf.test.ts `
  tests/text-engine-runtime-identity-evidence-leaf.test.ts `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts `
  tests/schema.test.ts `
  tests/load-sources.test.ts `
  tests/semantic-validation.test.ts `
  tests/generation.test.ts
npm run type-check
git diff --check $adapterProviderLeafBase..HEAD
```

Do not run broad Project Control/Core suites, build, or E2E. Report any timeout/failure honestly; one isolated retry is allowed only for an exact unchanged timing row under the user's policy.

- [ ] **Step 3: Request final contract/provenance and factual reviews**

Give both reviewers the approved design, this plan, claim matrix, all task reports/reviews, complete 11-path diff, dependency preservation proof, and read-only Core identities.

Contract READY requires exact 6/6 ownership, exact pipeline/state/fail-closed tables, context-separated `accepted` states, valid unknown-family/active-leaf registration, exact dependency-test correction without weakening, deterministic projection, no former-source/mutable anchors, no coverage/cleanup, and Critical 0 / Important 0.

Factual READY requires every leaf/Document/Evidence/Node/map/generated claim to match pinned Core modules/package/tests, historical package absence to remain historical, seeded Evidence to remain bounded, provider optionality/default independence to remain explicit, and Critical 0 / Important 0.

One correction wave may touch only the 11 implementation paths, begins with a focused RED, updates generated projection when source content changes, repeats affected focused gates, and receives scoped re-review. A residual load-bearing finding stops the plan.

- [ ] **Step 4: Publish the local handoff**

Record:

- exact final Project Control commits and 11-path implementation scope;
- exact clean Core evidence commit;
- source closure 6/6 and source/dependency preservation;
- verified request/acceptance/handoff/provider states and fail-closed boundaries;
- explicit mock/seeded/real-engine and non-production/default/parity boundaries;
- focused data/test/type/generation results;
- both final review verdicts and residual non-blocking risks;
- Text Engine/Core `unknown`, no coverage, no cleanup authority;
- next frozen batch `text-engine/rustybuzz-shaping` with exactly four sources.

Keep the branch and linked worktrees in place. Do not merge, push, tag, delete sources, or begin the next batch in this task.
