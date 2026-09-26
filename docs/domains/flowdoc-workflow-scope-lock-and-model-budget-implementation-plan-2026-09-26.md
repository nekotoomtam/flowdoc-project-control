# FlowDoc Workflow Scope Lock and Model Budget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` (recommended) or
> `superpowers:executing-plans` to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce real Git scope containment and compact host-aware model
selection for new FlowDoc version 3 rounds without rewriting historical state
or adding another workflow authority.

**Architecture:** Keep coordination state transitions pure. A focused Git
adapter computes a canonical change manifest from the registered worktree;
version 3 acceptance consumes and persists that verified result, while an
integration preflight rechecks the accepted commit before merge. A new current
packet profile cleanly separates enforceable rounds from readable legacy
version 3 packets, and compact model decisions reference one round-level host
availability snapshot.

**Tech Stack:** TypeScript, Node.js Git subprocesses through `execFile`, JSON
Schema, Vitest, the existing Project Control coordination CLI, and Markdown
authority documents.

**Spec:**
`docs/domains/flowdoc-workflow-scope-lock-and-model-budget-design-2026-09-25.md`

## Authority Boundary

This is a supporting implementation plan owned by FlowDoc Project Control. It
translates the owner-approved design into testable tasks but is not workflow
authority, Evidence, product truth, or permission to change Core, Backend,
Editor, product maps, or `DOCUMENT_MAP`. The owner must review this plan and
select the execution method before implementation begins.

## PLAN Packet

- Owner repository: `repo-project-control`.
- Active role: Project Control Steward with Planning Partner and Documentation
  Authority Steward responsibilities.
- Work Size: `medium`; the work is one repository with seven independently
  reviewable tasks. Do not dispatch it as one large unbounded WORK.
- Risk Tier: `bounded`; an error can accept an invalid workflow candidate, but
  changes are Project Control-only, testable, and reversible. No irreversible
  product or user data is changed, so `critical` is not justified.
- Work authority: `implementation` for execution; this planning round remains
  documentation-only.
- Allowed scope:
  `src/model/`, `tools/coordination-registry.ts`,
  `tools/lib/git-scope-verifier.ts`, `schemas/project-control.schema.json`,
  `tests/`, `data/work/`, `data/phases/`, `data/checklists/`, `data/evidence/`,
  the approved design, this plan, the two current workflow authority documents,
  `AGENTS.md`, and `docs/domains/flowdoc-global-codex-guidance.md`.
- Forbidden scope: Core, Backend, Editor, product maps, `DOCUMENT_MAP`, GUI
  behavior, unrelated Project Control records, and any historical PLAN or WORK
  execution context.
- Proof Budget: focused tests per task, one full worktree gate, one full main
  gate, at most one implementation Evidence record, no formal audit, and one
  review cycle unless a Safety Kernel blocker is found.
- Document Budget: this plan is the only new document. Execution updates the
  approved design and existing canonical policies; it must not create another
  policy, audit, or explanatory document.
- Model decision for a separate implementation WORK: `workhorse`, currently
  resolved to `gpt-6-sol` at `medium`, because the work spans typed contracts,
  Git parsing, schema compatibility, and CLI persistence but has an approved
  architecture and deterministic tests. A fast model is not selected because
  acceptance-state and compatibility changes require cross-file judgment.
- Escalation trigger: move one capability class or split the failing task only
  after packet/context/environment correction and two failures attributable to
  the same reasoning limitation, or immediately if a new architecture,
  authority, safety, or cross-repository boundary appears.
- Return route: implementation returns to the current PLAN with exact commit,
  changed files, tests, unknowns, downstream information, and budget use. PLAN
  owns acceptance, integration, Evidence registration, and cleanup.

## Global Constraints

- `docs/domains/flowdoc-workflow-economy-policy.md` remains the sole workflow
  authority; coordination controls remain supporting transport rules only.
- Registry version 3 remains the only mutable registry version. Registry
  versions 1 and 2 and closed tasks remain historical and read-only.
- Existing version 3 packet records remain readable without migration. Only the
  new current packet profile can activate a new Scope Lock v1 round.
- Scope entries are normalized repository-root-relative Git paths using `/`,
  with no absolute path or `..`; matching is path-segment aware.
- The authoritative manifest includes committed, staged, unstaged, untracked,
  deleted, renamed, copied, and dirty-submodule paths.
- Separate-room acceptance requires a clean worktree, exact terminal commit,
  packet digest match, manifest match, and passing required checks.
- Scope failure is never accepted-with-warning. Acceptance fails without a
  write; PLAN records the existing `needs-revision` resolution with a
  `scope-violation:<code>` review note.
- Git hooks may warn but never authorize acceptance.
- No implementation may claim proof of every file read, network request, or
  external side effect.
- Model choice never weakens scope, acceptance, proof, or verification.
- New durable Evidence, Gate, audit, or document is forbidden unless the packet
  budget names the failure prevented and existing tests are insufficient.
- Stop when the acceptance criteria pass.

## File Structure

- `src/model/workflow-economy.ts`: legacy/current packet types, compact model
  decision types, Scope Lock profile, and completion criterion references.
- `src/model/types.ts`: version 3 registry, host snapshot, scope verification,
  and persisted acceptance types.
- `src/model/scope-lock.ts`: pure path normalization, overlap detection,
  canonical manifest digest, and scope evaluation; no filesystem or Git calls.
- `tools/lib/git-scope-verifier.ts`: confined Git inspection and conversion to
  the pure manifest input.
- `src/model/coordination-v3.ts`: packet activation, completion, acceptance,
  and stored-state invariants for the current profile.
- `src/model/coordination.ts`: shared command context and versioned dispatch.
- `tools/coordination-registry.ts`: compute authoritative scope verification
  during acceptance and expose a read-only integration preflight.
- `schemas/project-control.schema.json`: legacy/current packet and persisted
  verification schema.
- `tests/fixtures/coordination-registry-v3.ts`: current profile fixture plus an
  explicit legacy version 3 fixture.
- `tests/flowdoc-workflow-economy-schema.test.ts`: schema compatibility.
- `tests/flowdoc-workflow-economy-lifecycle.test.ts`: packet and acceptance
  lifecycle rules.
- `tests/flowdoc-scope-lock.test.ts`: pure Scope Lock behavior.
- `tests/flowdoc-git-scope-verifier.test.ts`: real temporary Git repository
  inspection.
- `tests/flowdoc-coordination-cli.test.ts`: persistence and CLI enforcement.
- Current policy, supporting coordination contract, guidance, and canonical
  records: authority cutover and durable evidence after behavior passes.

## Review Focus

1. Prefix collision such as `src/model/` versus `src/model-old/` must fail
   closed; Task 2 adds segment-aware path tests.
2. A rename or copy crossing from allowed to forbidden scope must report both
   source and destination; Tasks 3 and 4 exercise real Git rename output.
3. An omitted untracked, staged, or deleted path must still block acceptance;
   Tasks 3 and 5 compare the authoritative and reported manifests.
4. A changed `HEAD`, packet digest, or main base after acceptance must invalidate
   integration preflight; Task 6 tests all three identities.
5. A missing, stale, or host-mismatched model snapshot must prevent activation
   without invalidating readable legacy records; Task 1 and Task 2 cover both
   profiles.

---

### Task 1: Introduce the current packet and compact model contracts

**Files:**

- Modify: `src/model/workflow-economy.ts`
- Modify: `src/model/types.ts`
- Modify: `schemas/project-control.schema.json`
- Modify: `tests/fixtures/coordination-registry-v3.ts`
- Modify: `tests/flowdoc-workflow-economy-schema.test.ts`
- Modify: `tests/flowdoc-coordination-schema.test.ts`

**Interfaces:**

- Produces: `WorkflowEconomyPacketV1`, `WorkflowEconomyPacketV2`,
  `WorkflowEconomyPacket`, `ScopeLockProfileV1`,
  `LegacyCoordinationModelDecision`, `CompactCoordinationModelDecision`,
  `CoordinationModelAvailabilitySnapshot`, `ScopeLockVerification`, and
  `createRoutineWorkflowPacketV2(input)`.
- Produces: current policy ID `flowdoc-workflow-economy-v2`; the registry version
  remains `3`.
- Compatibility: `createLegacyCoordinationRegistryV3Fixture()` preserves the
  previous inline model snapshot and policy v1 packet for readability tests.

- [ ] **Step 1: Write failing schema tests for both profiles**

Add tests asserting that the legacy fixture still validates, the current
fixture requires `scopeLock`, a compact decision requires
`capabilityClass`, `availabilitySnapshotRef`, and a non-empty escalation list,
and accepted current-profile state requires a persisted Scope Lock verification.

- [ ] **Step 2: Run the schema tests and confirm the current profile fails**

Run:
`npx vitest run tests/flowdoc-workflow-economy-schema.test.ts tests/flowdoc-coordination-schema.test.ts`

Expected: FAIL because policy v2, compact decisions, round snapshots, and
Scope Lock verification are not defined.

- [ ] **Step 3: Add the minimal union types, schema branches, and fixtures**

Keep v1 fields unchanged. Define policy v2 with a required
`scopeLock: { version: 1; enforcement: "git-worktree"; baseCommit: string;
worktree: string }`. Store model availability snapshots once on the version 3
registry. Make a compact model decision reference a snapshot ID instead of
embedding the host list.

- [ ] **Step 4: Run focused schema and type checks**

Run:
`npx vitest run tests/flowdoc-workflow-economy-schema.test.ts tests/flowdoc-coordination-schema.test.ts && npm run type-check`

Expected: PASS, including the unchanged legacy fixture.

- [ ] **Step 5: Commit the contract boundary**

```text
git add src/model/workflow-economy.ts src/model/types.ts schemas/project-control.schema.json tests/fixtures/coordination-registry-v3.ts tests/flowdoc-workflow-economy-schema.test.ts tests/flowdoc-coordination-schema.test.ts
git commit -m "feat(project-control): add current scope lock packet contract"
```

### Task 2: Validate packet scope and compact model decisions

**Files:**

- Create: `src/model/scope-lock.ts`
- Create: `tests/flowdoc-scope-lock.test.ts`
- Modify: `src/model/coordination-v3.ts`
- Modify: `tests/flowdoc-workflow-economy-lifecycle.test.ts`
- Modify: `tests/flowdoc-coordination-registry.test.ts`

**Interfaces:**

- Produces: `normalizeRepositoryPath(value: string): string`,
  `pathWithinScope(path: string, scope: string): boolean`,
  `collectScopeDefinitionIssues(packet: WorkflowEconomyPacketV2): ScopeLockIssue[]`,
  and `resolveModelAvailability(decision, snapshots): ScopeLockIssue[]`.
- Consumes: Task 1 current and legacy packet/model unions.

- [ ] **Step 1: Write failing path, overlap, criterion, and model tests**

Cover absolute paths, `..`, backslash normalization, segment-prefix collisions,
allowed/forbidden ancestor overlap, duplicate normalized entries, missing
`AC-*` references, missing snapshot, host mismatch, unavailable model/effort,
and a valid compact decision. Assert legacy stored validation remains readable
but a new activation requires policy v2.

- [ ] **Step 2: Run the focused tests and confirm stable error codes fail**

Run:
`npx vitest run tests/flowdoc-scope-lock.test.ts tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-registry.test.ts`

Expected: FAIL for missing implementations such as `SCOPE_PATH_INVALID`,
`SCOPE_OVERLAP`, `ACCEPTANCE_CRITERION_UNKNOWN`,
`MODEL_SNAPSHOT_MISSING`, and `MODEL_EFFORT_UNAVAILABLE`.

- [ ] **Step 3: Implement pure validation and activation binding**

Use path-segment comparisons, not raw prefixes. Validate that the packet's
base commit and worktree equal the room locator and integration claim. Resolve
compact decisions only through the registry snapshot referenced by the packet;
do not reintroduce the inline list for new packets.

- [ ] **Step 4: Run focused tests and type checking**

Run:
`npx vitest run tests/flowdoc-scope-lock.test.ts tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-registry.test.ts && npm run type-check`

Expected: PASS.

- [ ] **Step 5: Commit packet enforcement**

```text
git add src/model/scope-lock.ts src/model/coordination-v3.ts tests/flowdoc-scope-lock.test.ts tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-registry.test.ts
git commit -m "feat(project-control): validate scope lock and model budget"
```

### Task 3: Build the pure canonical manifest evaluator

**Files:**

- Modify: `src/model/scope-lock.ts`
- Modify: `tests/flowdoc-scope-lock.test.ts`

**Interfaces:**

- Produces: `GitChangeEntry`, `GitScopeManifest`,
  `canonicalScopeManifestDigest(manifest): string`, and
  `evaluateScopeLock(input): ScopeLockEvaluation`.
- `evaluateScopeLock` consumes policy v2 packet, actual manifest, both payload
  `changedFiles` lists, exact commit, packet digest, and verification time.
- Produces a passing `ScopeLockVerification` or stable issues; it performs no
  I/O and mutates no coordination state.

- [ ] **Step 1: Write failing manifest evaluation tests**

Assert deterministic sorting/digest, both sides of renames and copies, deletion
coverage, read-only mutation rejection, forbidden-before-outside precedence,
manifest omission/addition rejection, dirty-state rejection, exact commit and
packet mismatch, and a clean in-scope pass.

- [ ] **Step 2: Run the pure tests and confirm failures**

Run: `npx vitest run tests/flowdoc-scope-lock.test.ts`

Expected: FAIL because canonical manifest and evaluation functions are absent.

- [ ] **Step 3: Implement canonicalization and evaluation**

Canonicalize Git paths once, retain change kind and rename/copy endpoints, sort
before hashing, and compare sets rather than caller order. Require both the
top-level payload and completion-report file lists to equal the actual set.

- [ ] **Step 4: Run the pure test suite**

Run: `npx vitest run tests/flowdoc-scope-lock.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the evaluator**

```text
git add src/model/scope-lock.ts tests/flowdoc-scope-lock.test.ts
git commit -m "feat(project-control): evaluate canonical scope manifests"
```

### Task 4: Inspect real Git worktrees without shell parsing

**Files:**

- Create: `tools/lib/git-scope-verifier.ts`
- Create: `tests/flowdoc-git-scope-verifier.test.ts`

**Interfaces:**

- Produces: `inspectGitScope(options: { worktree: string; baseCommit: string;
  expectedHead: string }): Promise<GitScopeManifest>`.
- Consumes: Task 3 `GitScopeManifest` and change-entry types.
- Uses `execFile("git", args)` with explicit arguments and NUL-delimited output;
  it must not construct a shell command.

- [ ] **Step 1: Write failing temporary-repository tests**

Create isolated Git fixtures covering committed modification, staged file,
unstaged deletion, untracked file, rename across scope, ignored file exclusion,
dirty submodule, unexpected root, wrong base, wrong HEAD, and a filename with
spaces. Assert both rename endpoints and every dirty category are returned.

- [ ] **Step 2: Run the Git adapter tests and confirm failure**

Run: `npx vitest run tests/flowdoc-git-scope-verifier.test.ts`

Expected: FAIL because `inspectGitScope` does not exist.

- [ ] **Step 3: Implement confined Git inspection**

Resolve the worktree real path, require `git rev-parse --show-toplevel` to equal
it, verify base and HEAD, parse `--name-status -z` for committed/staged/unstaged
changes, parse untracked non-ignored paths, and use porcelain/submodule status
only to surface dirty submodules. Treat malformed Git output as a coded failure.

- [ ] **Step 4: Run adapter tests and type checking**

Run:
`npx vitest run tests/flowdoc-git-scope-verifier.test.ts && npm run type-check`

Expected: PASS on Windows paths without shell quoting assumptions.

- [ ] **Step 5: Commit the Git adapter**

```text
git add tools/lib/git-scope-verifier.ts tests/flowdoc-git-scope-verifier.test.ts
git commit -m "feat(project-control): inspect actual git scope state"
```

### Task 5: Require verified scope before version 3 acceptance

**Files:**

- Modify: `src/model/types.ts`
- Modify: `src/model/coordination.ts`
- Modify: `src/model/coordination-v3.ts`
- Modify: `tools/coordination-registry.ts`
- Modify: `schemas/project-control.schema.json`
- Modify: `tests/flowdoc-workflow-economy-lifecycle.test.ts`
- Modify: `tests/flowdoc-coordination-cli.test.ts`

**Interfaces:**

- Extends: `CoordinationCommandContext` with optional
  `scopeLockVerification: ScopeLockVerification`.
- Persists: a passing verification under the accepted version 3 handoff.
- Consumes: Task 4 Git manifest and Task 3 evaluator when applying an
  `accept-handoff` command through the CLI.

- [ ] **Step 1: Write failing acceptance and persistence tests**

Assert policy v2 acceptance rejects missing verification, omitted actual path,
dirty worktree, read-only mutation, wrong base/HEAD/packet/worktree, and failed
required checks without writing the Work file. Assert a clean exact candidate
persists the verification and increments the revision atomically. Assert legacy
accepted records remain readable.

- [ ] **Step 2: Run lifecycle and CLI tests and confirm failure**

Run:
`npx vitest run tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-cli.test.ts`

Expected: FAIL with missing Scope Lock acceptance enforcement.

- [ ] **Step 3: Wire authoritative verification into acceptance**

For CLI `accept-handoff`, load the current room and handoff, inspect the stored
worktree, evaluate the result, pass only a successful verification into the
pure command, and persist it with acceptance. On scope failure, leave the Work
file unchanged and emit a stable code so PLAN can call existing
`resolve-handoff` with `needs-revision` and `scope-violation:<code>`.

- [ ] **Step 4: Run focused acceptance, schema, and type checks**

Run:
`npx vitest run tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-cli.test.ts tests/flowdoc-workflow-economy-schema.test.ts && npm run type-check`

Expected: PASS.

- [ ] **Step 5: Commit the acceptance lock**

```text
git add src/model/types.ts src/model/coordination.ts src/model/coordination-v3.ts tools/coordination-registry.ts schemas/project-control.schema.json tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-cli.test.ts tests/flowdoc-workflow-economy-schema.test.ts
git commit -m "feat(project-control): require scope verification for acceptance"
```

### Task 6: Add accepted-candidate integration preflight

**Files:**

- Modify: `tools/coordination-registry.ts`
- Modify: `tests/flowdoc-coordination-cli.test.ts`
- Modify: `package.json` only if the existing `coordination` entry cannot expose
  the new action without another script.

**Interfaces:**

- Produces: `verifyAcceptedIntegrationCandidate(options): Promise<void>`.
- CLI action:
  `npm run coordination -- preflight-integration --work <data/work/file.json>
  --handoff <id> --repository <path> --base-ref <ref>`.
- Consumes: stored accepted verification, exact payload commit, packet digest,
  integration claim base, and Task 4 Git inspection.

- [ ] **Step 1: Write failing integration identity tests**

Assert preflight rejects a non-accepted handoff, changed candidate HEAD,
modified packet digest, stale scope verification, changed base ref, unexpected
repository root, and dirty worktree. Assert the exact accepted clean candidate
passes without mutating Project Control or the target repository.

- [ ] **Step 2: Run CLI tests and confirm failure**

Run: `npx vitest run tests/flowdoc-coordination-cli.test.ts`

Expected: FAIL because the integration preflight action is absent.

- [ ] **Step 3: Implement the read-only integration preflight**

Reuse Task 4 and Task 3 functions. Resolve the requested repository path and
base ref through Git, compare them with the stored integration claim, and emit
stable errors. Do not merge, reset, clean, or delete anything.

- [ ] **Step 4: Run CLI, lifecycle, and type checks**

Run:
`npx vitest run tests/flowdoc-coordination-cli.test.ts tests/flowdoc-workflow-economy-lifecycle.test.ts && npm run type-check`

Expected: PASS.

- [ ] **Step 5: Commit integration preflight**

```text
git add tools/coordination-registry.ts tests/flowdoc-coordination-cli.test.ts package.json
git commit -m "feat(project-control): preflight accepted integration candidates"
```

### Task 7: Cut over authority, register bounded evidence, and verify

**Files:**

- Modify: `docs/domains/flowdoc-workflow-economy-policy.md`
- Modify: `docs/domains/flowdoc-coordination-controls.md`
- Modify: `docs/domains/flowdoc-workflow-scope-lock-and-model-budget-design-2026-09-25.md`
- Modify: `AGENTS.md`
- Modify: `docs/domains/flowdoc-global-codex-guidance.md`
- Create: `data/work/workflow-scope-lock-model-budget.json`
- Create: `data/phases/phase-workflow-scope-lock-model-budget-implementation.json`
- Create: `data/checklists/checklist-workflow-scope-lock-model-budget-implementation.json`
- Create: `data/evidence/flowdoc-workflow-scope-lock-model-budget-2026-09-26.json`
- Generate: `generated/project-index.json`

**Interfaces:**

- Produces: one current workflow policy updated with Scope Lock and Model Budget
  rules; coordination controls contain only separate-room transport and
  integration mechanics.
- Produces: one new Work path for this fresh round. It references the old
  workflow-economy evidence as immutable input and never reactivates the old
  execution context.
- Evidence pins the exact implementation commit and the focused/full checks;
  it does not promote product or map truth.

- [ ] **Step 1: Write failing authority and record tests**

Extend the existing workflow cutover/skill tests to require policy v2 for new
rounds, actual Git verification before acceptance, compact referenced model
snapshots, the PLAN Astra-medium default with bounded PLAN Lite exception, and
the honest read-audit limitation. Add record fixtures requiring the new Work,
Phase, Checklist, and bounded Evidence relationships.

- [ ] **Step 2: Run authority and data tests and confirm failure**

Run:
`npx vitest run tests/flowdoc-workflow-economy-cutover.test.ts tests/flowdoc-project-control-skill.test.ts && npm run check:data`

Expected: FAIL because authority text and canonical records have not yet been
cut over.

- [ ] **Step 3: Update only canonical authority and records**

Move the approved rules into the sole workflow policy, keep command mechanics
in coordination controls, mark the design implemented only after tests pass,
and keep the plan as supporting context. Do not create another policy or change
product/map truth. Record routine governance metrics directionally, not as a
new Gate.

- [ ] **Step 4: Regenerate and run focused plus full worktree gates**

Run:

```text
npm run generate
npx vitest run tests/flowdoc-scope-lock.test.ts tests/flowdoc-git-scope-verifier.test.ts tests/flowdoc-workflow-economy-schema.test.ts tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-cli.test.ts tests/flowdoc-workflow-economy-cutover.test.ts tests/flowdoc-project-control-skill.test.ts
npm run check
```

Expected: all focused tests and the full gate PASS; generated projections are
current; no product repository or map changed.

- [ ] **Step 5: Commit the verified authority cutover**

```text
git add docs/domains/flowdoc-workflow-economy-policy.md docs/domains/flowdoc-coordination-controls.md docs/domains/flowdoc-workflow-scope-lock-and-model-budget-design-2026-09-25.md AGENTS.md docs/domains/flowdoc-global-codex-guidance.md data/work/workflow-scope-lock-model-budget.json data/phases/phase-workflow-scope-lock-model-budget-implementation.json data/checklists/checklist-workflow-scope-lock-model-budget-implementation.json data/evidence/flowdoc-workflow-scope-lock-model-budget-2026-09-26.json generated/project-index.json tests/flowdoc-workflow-economy-cutover.test.ts tests/flowdoc-project-control-skill.test.ts
git commit -m "docs(project-control): cut over scope lock workflow authority"
```

- [ ] **Step 6: Perform PLAN-owned integration and post-merge verification**

Review the exact branch diff and commit chain, run the integration preflight,
merge only the accepted commit range, run `npm run check` on `main`, then sync
the bounded FlowDoc section in the machine global guidance and installed skill
only after that main gate passes. Validate skill parity. Remove only the clean,
fully merged current-round worktree and branch; otherwise retain and report the
reason.

## Completion Report

Return exactly:

1. behavior changed;
2. tests and Evidence proving it;
3. remaining unknowns;
4. downstream information;
5. actual changed files and budget use; and
6. PASS / FAIL / BLOCKER / RISK / UNKNOWN with Work, Phase, Checklist, commit,
   integration, main-gate, guidance-sync, and cleanup status.

Stop after these acceptance criteria pass. Do not add another audit, policy,
design, certificate, review cycle, or proof mechanism unless one of the four
Safety Kernel stop conditions is present.
