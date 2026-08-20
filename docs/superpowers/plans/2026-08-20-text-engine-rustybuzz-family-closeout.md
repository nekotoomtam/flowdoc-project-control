# Text Engine Rustybuzz Leaf and Family Closeout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the final four-source Text Engine subgroup into one canonical Rustybuzz leaf, synthesize the Text Engine family overview from all four canonical leaves, and register the completed documentation set without changing Core or promoting family readiness.

**Architecture:** Treat the work as documentation consolidation. First prove and write the bounded native-smoke → mapping → corpus → seeded-wrap leaf; obtain candidate approval; then derive the family overview only from the four canonical leaves and register the leaf/overview/Evidence in Project Control. Existing canonical topics are linked rather than repeated, while Text Engine and Core remain `unknown` with no coverage or cleanup authority.

**Tech Stack:** Markdown, TypeScript, Vitest, JSON Schema/Ajv, deterministic Project Control generator, Git object inspection, PowerShell read-only verification.

**Spec:** `docs/superpowers/specs/2026-08-20-text-engine-rustybuzz-family-closeout-design.md`

## Global Constraints

- Project Control starts from approved spec commit plus the preceding Adapter/Provider closeout head `9bd5f37b4ad6cf8911985f8e2c06c979b96e4bec`.
- Reviewed Wave A orientation remains unchanged and assigns `text-engine/rustybuzz-shaping` exactly four sources and destination `docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md`.
- Frozen Core source commit is `76a2f2311a898e781f53773390d47b05812911e4`.
- Read-only Core evidence worktree must remain clean at `c503a45c03e0ce3b7a6efba2b029ca842017faa0`.
- Never modify Core code, tests, docs, fixtures, packages, artifacts, index, branch, stash, or worktree configuration.
- This cycle consolidates existing truth only. Do not build an artifact, execute the manual native smoke command, run WASM/native/ICU4X/browser engines, or create new runtime Evidence.
- Chronology is not authority. Current package code, fixtures, and focused tests at the pinned Core head govern current wording.
- Link existing canonical ownership instead of duplicating WASM toolchain/artifact, Runtime Identity/digest, or Adapter/Provider contract content.
- Native raw smoke, mapped adapter Evidence, four-case corpus Evidence, and seeded line-wrap Evidence remain distinct authority classes.
- Every `ready` status is boundary-local. Evidence Acceptance `accepted` is structural admission only; neither means production/default/parity acceptance.
- Native/WASM parity, generated ICU4X/Intl/Thai-oracle agreement, general typography, production binding, default replacement, renderer readiness, pagination placement, and rollout remain unknown or excluded.
- Do not change orientation, inventory, family map, migration coverage, schemas, generic tooling, package/lock files, the three approved dependency leaves, or their existing Document/Evidence records.
- Canonical leaf, overview, focused tests, records, map, and generated content must not contain the four former source paths as contiguous literals. Derive them from orientation in tests.
- Text Engine and Core remain `truthState: "unknown"`; no migration coverage or cleanup authority is created.
- Run only focused gates named below. Do not run broad Project Control/Core suites, build, or E2E.
- Any command with no verdict after 180 seconds is stopped only after validating its exact process tree; record `NO VERDICT` and do not retry broadly.
- Do not push, merge, tag, publish remote links, delete sources, or mutate stash state.

---

### Task 1: Produce the bounded Rustybuzz candidate leaf

**Files:**
- Create: `docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md`
- Create: `tests/text-engine-rustybuzz-family-closeout.test.ts`
- Create ignored: `.superpowers/sdd/2026-08-20-text-engine-rustybuzz-family-closeout/claim-matrix.md`
- Create ignored: `.superpowers/sdd/2026-08-20-text-engine-rustybuzz-family-closeout/task-1-report.md`

**Interfaces:**
- Consumes: Wave A orientation, frozen inventory blobs, three approved Text Engine leaves, four frozen source documents, three current package modules, package-local Rust smoke crate/fixtures, and four focused Core tests.
- Produces: one candidate Rustybuzz leaf plus a focused content/provenance test. It creates no overview, registration, coverage, map, Node, Evidence, or generated change yet.

- [ ] **Step 1: Freeze identities and exact four-source ownership**

Require clean Project Control and Core worktrees. Capture the execution base exactly once after this plan commit:

```powershell
$rustybuzzFamilyBase = git rev-parse HEAD
```

Record it in this plan's ledger and never recompute it. Assert Core is exactly:

```text
c503a45c03e0ce3b7a6efba2b029ca842017faa0
```

Load `text-engine/rustybuzz-shaping` from orientation. Require exact destination, exactly four unique source paths, frozen commit, inventory digest, and aligned source blobs. Prove these frozen blobs equal their current Core blobs:

```text
docs/TEXT_ENGINE_RUSTYBUZZ_SMOKE_PACKAGE_BOUNDARY.md  1174cde89460aab1be752e7ddd1d61710d1273ec
docs/TEXT_ENGINE_RUSTYBUZZ_RAW_MAPPING_BOUNDARY.md    b0ba6e961d169c42defc0726889dcf3acde9bb82
docs/TEXT_ENGINE_RUSTYBUZZ_SMOKE_CORPUS_BOUNDARY.md  2cf9a00c016ce451c5618158b725c02c97c74f4b
docs/TEXT_ENGINE_LINE_WRAP_EVIDENCE_BOUNDARY.md      828af4b54139b6691f3e1873864173cf9a426971
```

Capture and retain the Git blobs of the existing WASM, Runtime Identity, and Adapter/Provider canonical leaves and their six Evidence records.

- [ ] **Step 2: Write the candidate test before the leaf**

Create `tests/text-engine-rustybuzz-family-closeout.test.ts`. Derive source paths from orientation. Use these exact constants:

```ts
const subgroupId = "text-engine/rustybuzz-shaping";
const leafPath = "docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md";
const overviewPath = "docs/versions/V0_1_0a_1/core/text-engine/OVERVIEW.md";
const coreCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";

const leafHeadings = [
  "## Authority and Scope",
  "## Evidence Pipeline",
  "## Package-local Native Smoke",
  "## UTF-8 Byte-cluster to UTF-16 Mapping",
  "## Four-case Smoke Corpus",
  "## Seeded Line-wrap Evidence",
  "## Evidence Acceptance and Draft Handoff",
  "## Fail-closed Matrix",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;

const boundaryStates = ["ready", "blocked"] as const;
```

Assert headings occur exactly once and in order. Require three separately labelled state declarations for raw mapping, corpus, and line wrap; reject duplicate or extra state values. Pin raw orientation bytes/blob, inventory digest, 4/4 membership, source blobs, dependency leaf/record blobs, canonical path casing, and immutable full Core anchors.

Add representative mutations that must fail for direct raw-cluster use, invalid UTF-8 boundary repair, font-unit omission, partial corpus, missing WASM digest promotion, seeded break promotion, cluster-splitting breaks, overlapping/missing glyph coverage, public line-box widening, Core/package import reversal, production/default/parity/ICU4X/renderer/pagination promotion, and mutable Core references.

- [ ] **Step 3: Preserve the missing-leaf RED**

Run:

```powershell
npm test -- tests/text-engine-rustybuzz-family-closeout.test.ts
```

Expected: Vitest starts and candidate assertions fail because the Rustybuzz leaf is absent. Overview and registration assertions are not added until Task 3.

- [ ] **Step 4: Read all four sources and close the claim matrix**

Read every frozen source completely with argument-array Git commands. Populate the ignored matrix with frozen/current blob, material contribution, destination section, current/historical/unknown classification, executable anchor, verification result, and wording boundary.

End with exact machine-counted closure:

```text
assigned sources: 4
unique sources: 4
missing sources: 0
extra sources: 0
```

Classify toolchain/artifact, Runtime Identity/digest, and Adapter/Provider facts as canonical cross-references rather than duplicate Rustybuzz content.

- [ ] **Step 5: Verify current facts read-only**

Assert no frozen-to-current diff for:

```text
packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts
packages/text-engine-rust-wasm/src/rustybuzzSmokeCorpus.ts
packages/text-engine-rust-wasm/src/lineWrapEvidence.ts
tests/textEngineRustybuzzRawMapping.test.ts
tests/textEngineRustybuzzSmokeCorpus.test.ts
tests/textEngineRustybuzzSmokePackage.test.ts
tests/textEngineLineWrapEvidence.test.ts
```

Run only:

```powershell
npm test -- --maxWorkers=1 `
  tests/textEngineRustybuzzSmokePackage.test.ts `
  tests/textEngineRustybuzzRawMapping.test.ts `
  tests/textEngineRustybuzzSmokeCorpus.test.ts `
  tests/textEngineLineWrapEvidence.test.ts
```

Verify package-local boundaries and Core `src/**` has no import of the external package or Rustybuzz implementation. Do not execute `rustybuzz:smoke`, Cargo, WASM, ICU4X, build, or artifact commands.

- [ ] **Step 6: Write the minimal canonical leaf**

Write the exact 13 sections. Preserve the evidence pipeline and three separately labelled `ready | blocked` boundaries. State explicitly:

- the native crate/output is package-local smoke only;
- raw byte clusters become UTF-16 ranges only after strict validation;
- font units become points through `fontSizePt / unitsPerEm`;
- the four-case corpus is bounded and retains missing-WASM-digest warnings;
- line wrap consumes accepted glyph Evidence plus seeded breaks;
- line summaries own break metadata; public line boxes remain unchanged;
- every glyph is covered once by non-overlapping ranges;
- existing Core Evidence Acceptance and draft handoff remain the downstream owners;
- existing canonical leaves own toolchain/artifact, Runtime Identity/digest, and Adapter/Provider details;
- production/default/parity/ICU4X/general typography/renderer/pagination claims remain unknown or excluded.

Evidence Anchors use local immutable notation at full Core commit and include the Rust smoke crate/manifest, three package modules, four focused tests, and material fixtures. Do not include mutable branches or the four source paths.

- [ ] **Step 7: Reach focused GREEN and commit candidate**

Run:

```powershell
npm test -- tests/text-engine-rustybuzz-family-closeout.test.ts
npm run type-check
git diff --check
```

Require exact tracked scope of leaf plus focused test and both repositories clean. Commit:

```powershell
git add -- `
  docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md `
  tests/text-engine-rustybuzz-family-closeout.test.ts
git commit -m "docs: synthesize Text Engine rustybuzz leaf"
```

Write RED/GREEN, 4/4 closure, Core focused counts, immutable anchors, dependency preservation, exact scope, and remaining unknowns to Task 1 report.

---

### Task 2: Obtain independent Rustybuzz candidate approval

**Files:**
- Review: `docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md`
- Review: `tests/text-engine-rustybuzz-family-closeout.test.ts`
- Read ignored: `claim-matrix.md`
- Create ignored: `.superpowers/sdd/2026-08-20-text-engine-rustybuzz-family-closeout/task-2-report.md`

**Interfaces:**
- Consumes: exact Task 1 two-path commit, claim matrix, focused Core/Project Control evidence, immutable anchors, and protected blobs.
- Produces: an independently approved Rustybuzz candidate. Overview and registration remain absent.

- [ ] **Step 1: Freeze the exact candidate package**

Generate a helper review package from `$rustybuzzFamilyBase` to the candidate head. Verify header, SHA-256, exact two-path range, claim-matrix 4/4 closure, Core outputs, and clean statuses.

- [ ] **Step 2: Request two read-only reviews in parallel**

The contract/provenance reviewer checks exact source ownership, section/state tables, fail-closed mapping/corpus/wrap boundaries, Evidence authority classes, immutable anchors, no former-source literals, canonical cross-reference ownership, dependency preservation, and no overview/registration/Core mutation.

The factual reviewer checks every current statement against the pinned native smoke crate/fixture, three package modules, and four focused tests. It must reject any inference of WASM parity, generated ICU4X evidence, general typography, production/default binding, or renderer/pagination readiness.

Neither reviewer writes tracked files or runs broad suites/build/runtime commands.

- [ ] **Step 3: Correct blocking findings narrowly**

READY requires both reviews to return Critical 0 and Important 0. Every valid blocking finding starts with a focused failing assertion or mutation. Change only candidate leaf/test, rerun Task 1 focused gates, safely amend the unpushed candidate commit, regenerate its exact package, and request scoped re-review.

Stop for user direction if a finding needs Core, new runtime evidence, more source documents, or a design change. Record non-blocking Minors for final review.

- [ ] **Step 4: Record approval**

Record exact candidate hash, both verdicts, Minors, protected blobs, and explicit remaining production/default/parity/ICU4X unknowns. Confirm overview, records, map, coverage, and generated projection remain unchanged.

---

### Task 3: Write the family overview and register the closeout

**Files:**
- Modify: `tests/text-engine-rustybuzz-family-closeout.test.ts`
- Modify: `tests/text-engine-adapter-provider-leaf.test.ts`
- Modify: `tests/text-engine-runtime-identity-evidence-leaf.test.ts`
- Modify: `tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts`
- Create: `docs/versions/V0_1_0a_1/core/text-engine/OVERVIEW.md`
- Create: `data/documents/text-engine-rustybuzz-shaping.json`
- Create: `data/documents/text-engine-overview.json`
- Create: `data/evidence/text-engine-rustybuzz-mapping-corpus.json`
- Create: `data/evidence/text-engine-rustybuzz-line-wrap.json`
- Modify: `data/nodes/text-engine.json`
- Modify: `data/nodes/core.json`
- Modify: `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`
- Modify generated: `generated/project-index.json`
- Create ignored: `.superpowers/sdd/2026-08-20-text-engine-rustybuzz-family-closeout/task-3-report.md`

**Interfaces:**
- Consumes: approved Rustybuzz candidate and the three byte-preserved prior canonical leaves/records.
- Produces: one current-state family overview, two active Documents, two completed Evidence records, order-preserving Node/map changes, deterministic projection, and an honest documentation-complete/migration-incomplete state.

- [ ] **Step 1: Add overview and registration REDs**

Extend the new test with exact values:

```ts
const registration = {
  nodeId: "text-engine",
  nodeTruthState: "unknown",
  leafDocumentId: "doc-text-engine-rustybuzz-shaping",
  leafDocumentRole: "contract",
  overviewDocumentId: "doc-text-engine-overview",
  overviewDocumentRole: "current-state",
  mappingCorpusEvidenceId: "evidence-text-engine-rustybuzz-mapping-corpus",
  lineWrapEvidenceId: "evidence-text-engine-rustybuzz-line-wrap",
  repositoryId: "repo-core",
  coreCommit: "c503a45c03e0ce3b7a6efba2b029ca842017faa0",
  verifiedAt: "2026-08-20T00:00:00.000Z",
} as const;

const overviewHeadings = [
  "## Authority and Status",
  "## Family Architecture",
  "## Canonical Documents",
  "## Ownership Map",
  "## Evidence Flow",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Migration and Cleanup Boundary",
  "## Evidence Anchors",
] as const;
```

Require overview links exactly these four canonical leaves in order:

```text
wasm-toolchain-and-artifacts.md
runtime-identity-and-evidence.md
adapter-and-provider.md
rustybuzz-shaping.md
```

Require no former source paths, no duplicated leaf tables, exact registration reciprocity/order, deterministic timestamps, Text Engine/Core unknown, absent coverage, no cleanup authority, and generated equality.

- [ ] **Step 2: Preserve overview/registration RED**

Run:

```powershell
npm test -- tests/text-engine-rustybuzz-family-closeout.test.ts
```

Expected: candidate assertions pass; overview and registration assertions fail because the files/records do not exist.

- [ ] **Step 3: Write the overview from canonical leaves only**

Create `OVERVIEW.md` with the nine exact sections. Read the four canonical leaves, not the former source documents. Present the architecture:

```text
package delivery/artifact facts
  → runtime identity/digest state
  → Core request/acceptance/handoff contracts
  → package-local native shaping/mapping/corpus/wrap evidence
```

State documentation synthesis is complete, but Text Engine family truth remains unknown pending coverage, reference repair, publication review, and separately authorized cleanup. Retain production/default/parity/ICU4X/general typography unknowns.

- [ ] **Step 4: Create exact Documents and Evidence records**

Create active Documents:

```text
doc-text-engine-rustybuzz-shaping  role=contract
doc-text-engine-overview           role=current-state
```

The Rustybuzz Document authority is limited to native smoke, strict raw mapping, four-case corpus, and seeded wrap evidence. The overview authority is limited to current ownership relationships among the four canonical leaves.

Create exactly two completed Evidence records at `2026-08-20T00:00:00.000Z`:

```text
evidence-text-engine-rustybuzz-mapping-corpus
evidence-text-engine-rustybuzz-line-wrap
```

The first points to `packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`; the second points to `packages/text-engine-rust-wasm/src/lineWrapEvidence.ts`. Both pin the full Core commit. Their summaries explicitly deny production/default/parity/real-ICU4X authority.

- [ ] **Step 5: Update Nodes and document map**

Append, without reordering existing IDs:

```json
{
  "documentIds": [
    "doc-text-engine-wasm-toolchain-artifacts",
    "doc-text-engine-runtime-identity-evidence",
    "doc-text-engine-adapter-provider",
    "doc-text-engine-rustybuzz-shaping",
    "doc-text-engine-overview"
  ],
  "evidenceIds": [
    "evidence-text-engine-wasm-toolchain-gates",
    "evidence-text-engine-wasm-artifact-digest",
    "evidence-text-engine-runtime-identity-contract",
    "evidence-text-engine-runtime-identity-digest",
    "evidence-text-engine-adapter-contract",
    "evidence-text-engine-provider-bridge",
    "evidence-text-engine-rustybuzz-mapping-corpus",
    "evidence-text-engine-rustybuzz-line-wrap"
  ]
}
```

Use exact Text Engine summary:

```text
Text Engine documentation synthesis is complete across four bounded leaves and one family overview; family truth remains unknown pending coverage, reference repair, and publication review, while production, default adoption, and native/WASM parity remain unknown.
```

Use exact Core summary:

```text
Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; the Text Engine documentation set is synthesized across four bounded leaves and one family overview, while migration coverage, reference repair, and family promotion remain incomplete.
```

Update `DOCUMENT_MAP.md` with the overview and all four leaves. Remove stale statements that a Rustybuzz leaf or Text Engine overview is incomplete. Add exact closure wording:

```text
Text Engine documentation synthesis is complete across four bounded leaves and one family overview; Text Engine remains unknown pending coverage, reference repair, and publication review, and no source cleanup is authorized.
```

- [ ] **Step 6: Generate and preserve stale-test REDs**

Run `npm run generate`, then run all four Text Engine leaf tests before editing the three old tests:

```powershell
npm test -- `
  tests/text-engine-rustybuzz-family-closeout.test.ts `
  tests/text-engine-adapter-provider-leaf.test.ts `
  tests/text-engine-runtime-identity-evidence-leaf.test.ts `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts
```

Expected: the new closeout test passes. The prior tests fail only where they hard-code three Documents/six Evidence IDs, three-leaf summaries, missing Rustybuzz/overview, or incomplete-family wording. Any content/provenance/dependency failure stops the task.

- [ ] **Step 7: Correct only obsolete prior-test expectations**

Update the three old tests to assert the exact five-Document/eight-Evidence ordering, exact summaries, four leaves plus overview, documentation-complete/migration-incomplete wording, absent coverage, and no cleanup authority.

Preserve every prior canonical-leaf byte assertion, record equality, source ownership, immutable-anchor, mutable-ref, negative-claim, dependency, and generated-order guard.

- [ ] **Step 8: Reach deterministic focused GREEN and commit**

Run:

```powershell
npm run generate
npm run check:data
npm test -- `
  tests/text-engine-rustybuzz-family-closeout.test.ts `
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

Run `npm run generate` again and require zero tracked drift. Require absent Text Engine coverage, protected prior blobs, exact thirteen-path Task 3 scope, and clean unchanged Core.

Commit:

```powershell
git add -- `
  tests/text-engine-rustybuzz-family-closeout.test.ts `
  tests/text-engine-adapter-provider-leaf.test.ts `
  tests/text-engine-runtime-identity-evidence-leaf.test.ts `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts `
  docs/versions/V0_1_0a_1/core/text-engine/OVERVIEW.md `
  data/documents/text-engine-rustybuzz-shaping.json `
  data/documents/text-engine-overview.json `
  data/evidence/text-engine-rustybuzz-mapping-corpus.json `
  data/evidence/text-engine-rustybuzz-line-wrap.json `
  data/nodes/text-engine.json `
  data/nodes/core.json `
  docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md `
  generated/project-index.json
git commit -m "docs: close Text Engine documentation family"
```

Write REDs, final counts, hashes, exact scope, protected blobs, statuses, and unknowns to Task 3 report.

---

### Task 4: Final focused verification, dual review, and handoff

**Files:**
- Review: complete implementation range from `$rustybuzzFamilyBase` through Task 3
- Create ignored: `.superpowers/sdd/2026-08-20-text-engine-rustybuzz-family-closeout/task-4-report.md`

**Interfaces:**
- Consumes: candidate approval, family overview, exact registration, focused gates, protected blobs, and helper-generated packages.
- Produces: READY evidence for Text Engine documentation closeout and handoff to `template-builder/sandbox-runtime-and-store` without starting it.

- [ ] **Step 1: Assert exact final identities and fourteen-path scope**

Require clean Project Control/Core and exact fourteen unique tracked paths:

1. Rustybuzz leaf;
2. Text Engine overview;
3. new closeout test;
4. Adapter/Provider test;
5. Runtime Identity test;
6. WASM Toolchain test;
7. Rustybuzz Document;
8. overview Document;
9. mapping/corpus Evidence;
10. line-wrap Evidence;
11. Text Engine Node;
12. Core Node;
13. document map;
14. generated index.

Assert orientation, inventory, family map, migration coverage, schemas, generic tooling, package/lock files, three prior canonical leaves, six prior Evidence records, and all Core paths are byte-unchanged.

- [ ] **Step 2: Run final focused gates once**

Run:

```powershell
npm run generate
npm run check:data
npm test -- `
  tests/text-engine-rustybuzz-family-closeout.test.ts `
  tests/text-engine-adapter-provider-leaf.test.ts `
  tests/text-engine-runtime-identity-evidence-leaf.test.ts `
  tests/text-engine-wasm-toolchain-artifacts-leaf.test.ts `
  tests/schema.test.ts `
  tests/load-sources.test.ts `
  tests/semantic-validation.test.ts `
  tests/generation.test.ts
npm run type-check
git diff --check $rustybuzzFamilyBase..HEAD
```

Do not run broad suites, build, E2E, native smoke, Cargo, WASM, ICU4X, or artifact commands. Report any timeout/failure honestly. One isolated retry is allowed only for an exact unchanged timing row under the user's policy.

- [ ] **Step 3: Request final dual reviews**

Give both reviewers the approved spec/plan, claim matrix, all task reports/reviews, exact fourteen-path package, protected-blob proofs, and clean Core identity.

Contract/provenance READY requires exact 4/4 ownership, exact three boundary vocabularies, fail-closed mapping/corpus/wrap matrices, authority-class separation, canonical cross-reference ownership, exact four-leaf overview, valid registration/order, deterministic projection, no former-source/mutable refs, no coverage/cleanup, and Critical 0 / Important 0.

Factual READY requires every leaf/overview/Document/Evidence/Node/map/generated claim to match pinned Core modules/fixtures/tests, native smoke to remain raw, missing-WASM-digest warnings and seeded breaks to stay bounded, all production/default/parity/ICU4X/general-typography unknowns to remain explicit, and Critical 0 / Important 0.

One correction wave may touch only the fourteen implementation paths, starts with focused RED, regenerates projection when source content changes, repeats affected focused gates, and receives one scoped re-review. Residual load-bearing findings stop the plan.

- [ ] **Step 4: Record local closeout and next handoff**

Record final Project Control hashes, exact fourteen paths, clean Core hash, 4/4 closure, protected prior leaves/records, focused results, dual verdicts, Text Engine/Core unknown, absent coverage/cleanup, and remaining production/default/parity/ICU4X risks.

The next orientation batch is:

```text
template-builder/sandbox-runtime-and-store
```

It has exactly fifteen frozen sources. Record it as the next handoff without reading, changing, or starting that batch.

Keep the branch and linked worktrees in place. Do not merge, push, tag, delete sources, or start Template Builder in this task.
