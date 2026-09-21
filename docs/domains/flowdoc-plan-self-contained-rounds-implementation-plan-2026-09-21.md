# FlowDoc PLAN Self-Contained Rounds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every new PLAN task own one self-contained execution round, freeze version 1 coordination as readable history, and remove every cross-PLAN execution-transfer path from version 2.

**Architecture:** Preserve the existing version 1 JSON shape behind a read-only compatibility boundary, then introduce a separate version 2 registry keyed by immutable `planTaskId` and `roundId`. A version-aware facade validates both versions but applies commands only to version 2; Project Control-wide semantic checks reject stale execution identities and prevent Historical Recovery Work from becoming an execution registry.

**Tech Stack:** TypeScript, JSON Schema, Vitest, Project Control canonical JSON/Markdown, deterministic JSON and SQLite projections.

**Spec:** `docs/domains/flowdoc-plan-self-contained-rounds-design-2026-09-21.md`

## Global Constraints

- One PLAN task owns exactly one execution round and one mutable coordination registry.
- Version 1 remains readable but every mutation attempt fails closed after the version 2 cutover.
- Version 2 contains no ownership-transfer history, ownership-generation counter, or `transfer-ownership` command.
- A later PLAN may consume only accepted commits, Evidence records, registered Project Control documents, or a bounded Historical Recovery Packet.
- Historical Recovery Work is read-only and cannot contain a coordination registry.
- Same-room revision is allowed only inside the same active `planTaskId` and `roundId`.
- Every new round uses a new WORK task, worktree or branch, handoff identity,
  Return Channel destination, and monitor owner.
- Core, Backend, and Editor product behavior and product maps remain unchanged.
- All edits stay in the current dedicated Project Control worktree until the worktree gate passes.

## Review Focus

- A hand-edited version 1 registry whose stored state says `active` must still validate as historical data but reject every command.
- A raw `transfer-ownership` command must fail before it can mutate either registry version.
- A version 2 room that reuses a historical thread, worktree, branch, room-run, dispatch-set, handoff, PLAN destination, or monitor identity must fail semantic validation.
- A same-PLAN, same-round revision must remain valid while the equivalent cross-PLAN reuse fails.
- A Work record marked `historical-recovery` must fail validation if it contains a coordination registry.

---

### Task 1: Add the dual-version coordination contract

**Files:**
- Modify: `src/model/types.ts`
- Modify: `schemas/project-control.schema.json`
- Modify: `tests/fixtures/coordination-registry.ts`
- Create: `tests/fixtures/coordination-registry-v2.ts`
- Modify: `tests/flowdoc-coordination-schema.test.ts`

**Interfaces:**
- Consumes: existing version 1 registry JSON without rewriting it.
- Produces: `CoordinationRegistryV1`, `CoordinationRegistryV2`, `CoordinationRegistry`, `CoordinationRoomRunV2`, `CoordinationTerminalPayloadV2`, `CoordinationHandoffV2`, `CoordinationIntegrationClaimV2`, and `CoordinationCleanupStateV2`.

- [ ] **Step 1: Write schema tests for legacy readability and the version 2 shape**

Add tests that validate an unchanged version 1 fixture, validate a version 2 fixture, and reject version 2 fields named `generation`, `ownershipGeneration`, or `transfers`:

```ts
it("keeps version 1 readable and accepts a non-transferable version 2 registry", async () => {
  expect(await validateWorkWithCoordination(createCoordinationRegistryFixture())).toEqual([]);
  expect(await validateWorkWithCoordination(createCoordinationRegistryV2Fixture())).toEqual([]);
});

it.each(["generation", "ownershipGeneration", "transfers"])(
  "rejects version 2 transfer field %s",
  async (field) => {
    const registry = createCoordinationRegistryV2Fixture() as unknown as Record<string, unknown>;
    injectRemovedTransferField(registry, field);
    expect(await validateWorkWithCoordination(registry)).toContainEqual(
      expect.objectContaining({ code: "SCHEMA_ADDITIONAL_PROPERTY" }),
    );
  },
);
```

- [ ] **Step 2: Run the schema test and verify RED**

Run: `npx vitest run tests/flowdoc-coordination-schema.test.ts`

Expected: FAIL because version 2 types, fixture, and schema branch do not exist.

- [ ] **Step 3: Split legacy and version 2 types**

Keep the existing shape under `CoordinationRegistryV1` and define version 2 without generation or transfer fields:

```ts
export interface CoordinationRegistryV1 {
  version: 1;
  revision: number;
  scopeOwnership: LegacyCoordinationScopeOwnership;
  integrationClaims: CoordinationIntegrationClaim[];
  returnOrderPolicy: "severity-then-arrival";
  roomRuns: CoordinationRoomRun[];
  handoffs: CoordinationHandoff[];
  completionQueue: CoordinationQueueItem[];
  cleanup: CoordinationCleanupState[];
}

export interface CoordinationRegistryV2 {
  version: 2;
  revision: number;
  round: {
    planTaskId: string;
    roundId: string;
    workId: string;
    scopeId: string;
    scopeKeys: string[];
    allowedFiles: string[];
    state: "active" | "released" | "cancelled";
  };
  integrationClaims: CoordinationIntegrationClaimV2[];
  returnOrderPolicy: "severity-then-arrival";
  roomRuns: CoordinationRoomRunV2[];
  handoffs: CoordinationHandoffV2[];
  completionQueue: CoordinationQueueItem[];
  cleanup: CoordinationCleanupStateV2[];
}

export type CoordinationRegistry = CoordinationRegistryV1 | CoordinationRegistryV2;
```

Define version 2 attempts and payloads with `roundId` and without `ownershipGeneration`. Define version 2 integration and cleanup records with `roundId` and without `generation`.

- [ ] **Step 4: Add a `oneOf` schema for coordination versions**

Rename the existing schema branch to `coordinationV1`, add `coordinationV2`, and route Work records through:

```json
"coordination": {
  "oneOf": [
    { "$ref": "#/$defs/work/$defs/coordinationV1" },
    { "$ref": "#/$defs/work/$defs/coordinationV2" }
  ]
}
```

The version 2 branch must use `additionalProperties: false`, require `round.planTaskId`, `round.roundId`, and `round.workId`, and omit all transfer and generation properties.

- [ ] **Step 5: Add the version 2 fixture**

Create `createCoordinationRegistryV2Fixture()` with `plan-2`, `round-2`, `work-v2`, one prepared room, a fresh task locator, acknowledged context, and no handoff:

```ts
export function createCoordinationRegistryV2Fixture(): CoordinationRegistryV2 {
  return {
    version: 2,
    revision: 0,
    round: {
      planTaskId: "plan-2",
      roundId: "round-2",
      workId: "work-v2",
      scopeId: "pilot-v2",
      scopeKeys: ["flowdoc:pilot-v2"],
      allowedFiles: ["src/model/", "tools/", "tests/"],
      state: "active",
    },
    integrationClaims: [{
      repositoryId: "project-control",
      planTaskId: "plan-2",
      roundId: "round-2",
      baseCommit: "b".repeat(40),
      state: "active",
    }],
    returnOrderPolicy: "severity-then-arrival",
    roomRuns: [createV2Room()],
    handoffs: [],
    completionQueue: [],
    cleanup: [],
  };
}
```

- [ ] **Step 6: Run schema and type checks and verify GREEN**

Run: `npx vitest run tests/flowdoc-coordination-schema.test.ts && npm run type-check`

Expected: schema tests PASS and TypeScript reports no errors.

- [ ] **Step 7: Commit the contract**

```powershell
git add -- src/model/types.ts schemas/project-control.schema.json tests/fixtures/coordination-registry.ts tests/fixtures/coordination-registry-v2.ts tests/flowdoc-coordination-schema.test.ts
git commit -m "feat(coordination): add self-contained registry v2 contract"
```

### Task 2: Implement the version 2 lifecycle and freeze version 1

**Files:**
- Create: `src/model/coordination-v2.ts`
- Modify: `src/model/coordination.ts`
- Modify: `tests/flowdoc-coordination-registry.test.ts`
- Create: `tests/flowdoc-coordination-v2.test.ts`

**Interfaces:**
- Consumes: `CoordinationRegistryV1 | CoordinationRegistryV2` from Task 1.
- Produces: `CoordinationCommandV2`, `applyCoordinationV2Command()`, `validateCoordinationV2Registry()`, and a version-aware `applyCoordinationCommand()` facade.

- [ ] **Step 1: Write failing lifecycle tests**

Pin the legacy freeze, PLAN/round identity, removed transfer path, same-round revision, and permanent release:

```ts
it("rejects every mutation against version 1", () => {
  expect(() => applyCoordinationCommand(createCoordinationRegistryFixture(), {
    type: "release-round",
    planTaskId: "plan-1",
    roundId: "legacy-round",
  })).toThrowError(expect.objectContaining({ code: "LEGACY_REGISTRY_READ_ONLY" }));
});

it("rejects a command from another PLAN or round without mutation", () => {
  const registry = createCoordinationRegistryV2Fixture();
  expect(() => applyCoordinationCommand(registry, {
    type: "activate-room",
    planTaskId: "wrong-plan",
    roundId: "wrong-round",
    roomRunId: "pilot-v2-room",
    revisionAttempt: 0,
  })).toThrowError(expect.objectContaining({ code: "PLAN_ROUND_MISMATCH" }));
  expect(registry.revision).toBe(0);
});

it("allows revision only inside the same active PLAN round", () => {
  const revised = applyCoordinationCommand(supersededV2Fixture(), {
    type: "authorize-revision",
    planTaskId: "plan-2",
    roundId: "round-2",
    roomRunId: "pilot-v2-room",
    priorAttempt: 0,
    expectedHandoffId: "pilot-v2-room-r1",
    livenessDeadline: "2026-09-21T16:30:00.000Z",
  });
  expect(revised.roomRuns.at(-1)).toMatchObject({ revisionAttempt: 1, status: "prepared" });
});
```

Also call the facade with `{ type: "transfer-ownership" } as never` and expect `OWNERSHIP_TRANSFER_REMOVED`.

- [ ] **Step 2: Run the lifecycle tests and verify RED**

Run: `npx vitest run tests/flowdoc-coordination-registry.test.ts tests/flowdoc-coordination-v2.test.ts`

Expected: FAIL because version 1 still mutates and the version 2 engine does not exist.

- [ ] **Step 3: Define commands with mandatory PLAN and round identity**

In `src/model/coordination-v2.ts`, define a shared identity and include it in every command:

```ts
interface RoundCommandIdentity {
  planTaskId: string;
  roundId: string;
}

export type CoordinationCommandV2 = RoundCommandIdentity & (
  | { type: "activate-room"; roomRunId: string; revisionAttempt: number }
  | { type: "supersede-attempt"; roomRunId: string; revisionAttempt: number }
  | { type: "authorize-revision"; roomRunId: string; priorAttempt: number; expectedHandoffId: string; livenessDeadline: string }
  | { type: "record-send"; handoffId: string; payload: CoordinationTerminalPayloadV2; outcome: "sent" | "failed"; attemptedAt: string }
  | { type: "receive-handoff"; handoffId: string; payload: CoordinationTerminalPayloadV2; senderThreadId: string; receivedAt: string }
  | { type: "acknowledge-receipt"; handoffId: string; acknowledgedAt: string }
  | { type: "accept-handoff"; handoffId: string; reviewer: string; reviewedAt: string; evidenceIds: string[]; requiredChecks: Array<{ name: string; status: "pending" | "passed" | "failed" }>; remainingScope: string[] }
  | { type: "resolve-handoff"; handoffId: string; reviewer: string; reviewedAt: string; decision: "needs-revision" | "rejected" | "blocked"; reviewNote: string; remainingScope: string[] }
  | { type: "release-round" }
);
```

- [ ] **Step 4: Implement fail-closed version dispatch**

Make the public facade reject version 1 before examining lifecycle state and reject the removed command explicitly:

```ts
export function applyCoordinationCommand(
  registry: CoordinationRegistry,
  command: CoordinationCommandV2 | { type: string; [key: string]: unknown },
  context: CoordinationCommandContext = {},
): CoordinationRegistryV2 {
  if (registry.version === 1) {
    throw new CoordinationTransitionError(
      "LEGACY_REGISTRY_READ_ONLY",
      "Version 1 coordination is historical and cannot be mutated.",
    );
  }
  if (command.type === "transfer-ownership") {
    throw new CoordinationTransitionError(
      "OWNERSHIP_TRANSFER_REMOVED",
      "A PLAN round cannot transfer execution authority to another PLAN.",
    );
  }
  return applyCoordinationV2Command(registry, command as CoordinationCommandV2, context);
}
```

Remove `transferOwnership()` and all transfer-command switch branches from the callable engine.

- [ ] **Step 5: Port lifecycle rules to immutable round identity**

Implement `ensureRoundIdentity()` once and call it before every transition:

```ts
function ensureRoundIdentity(registry: CoordinationRegistryV2, identity: RoundCommandIdentity): void {
  ensure(
    registry.round.state === "active" &&
      registry.round.planTaskId === identity.planTaskId &&
      registry.round.roundId === identity.roundId,
    "PLAN_ROUND_MISMATCH",
    "Only the active owning PLAN round can advance coordination state.",
  );
}
```

Use `roundId` instead of generation in room lookup, payload identity, cleanup eligibility, acceptance, and release. Preserve retry delay, payload digest, queue priority, Evidence, UX, and cleanup gates from the existing engine.

- [ ] **Step 6: Run lifecycle tests and verify GREEN**

Run: `npx vitest run tests/flowdoc-coordination-registry.test.ts tests/flowdoc-coordination-v2.test.ts`

Expected: both suites PASS; old transfer-success expectations have been replaced by legacy-read-only and removed-command expectations.

- [ ] **Step 7: Commit the lifecycle**

```powershell
git add -- src/model/coordination.ts src/model/coordination-v2.ts tests/flowdoc-coordination-registry.test.ts tests/flowdoc-coordination-v2.test.ts
git commit -m "feat(coordination): enforce self-contained PLAN lifecycle"
```

### Task 3: Enforce fresh identities through persistence and cross-Work validation

**Files:**
- Modify: `tools/coordination-registry.ts`
- Modify: `src/model/coordination.ts`
- Modify: `tests/flowdoc-coordination-cli.test.ts`
- Modify: `tests/flowdoc-coordination-registry.test.ts`

**Interfaces:**
- Consumes: version 2 facade and types from Tasks 1-2.
- Produces: version-aware raw command parsing, `collectExecutionIdentityIssues()`, and fail-closed cross-Work collision diagnostics.

- [ ] **Step 1: Write failing CLI and collision tests**

Test raw legacy mutation, removed transfer, Work/round mismatch, and identity reuse:

```ts
it("rejects a raw legacy command before parsing lifecycle fields", async () => {
  await expect(applyRawCommandToWorkFile(legacyWorkPath, {
    type: "transfer-ownership",
    fromPlanTaskId: "plan-1",
    toPlanTaskId: "plan-2",
  })).rejects.toMatchObject({ code: "LEGACY_REGISTRY_READ_ONLY" });
});

it.each([
  "roomRunId",
  "dispatchSetId",
  "threadId",
  "worktree",
  "branch",
  "expectedHandoffId",
])("rejects reused historical %s in a mutable version 2 round", (identity) => {
  const issues = validateIdentityReuse(identity);
  expect(issues).toContainEqual(expect.objectContaining({
    code: "COORDINATION_EXECUTION_IDENTITY_REUSED",
  }));
});
```

Add a control test proving two revision attempts with the same `roomRunId`, thread, worktree, and branch inside one PLAN/round lineage remain valid when their handoff IDs differ.

- [ ] **Step 2: Run persistence and registry tests and verify RED**

Run: `npx vitest run tests/flowdoc-coordination-cli.test.ts tests/flowdoc-coordination-registry.test.ts`

Expected: FAIL because commands are parsed before the registry version is known and cross-Work identity reuse is not checked.

- [ ] **Step 3: Move command parsing behind the registry-version check**

Change persistence input from a typed command to raw JSON:

```ts
export interface ApplyCoordinationCommandOptions {
  rootDir: string;
  workFile: string;
  expectedRevision: number;
  command: unknown;
}
```

After loading the Work record, reject version 1 immediately. Parse only the version 2 command keys, each including `planTaskId` and `roundId`. Do not include `transfer-ownership` in the accepted key map.

- [ ] **Step 4: Add opaque identity collision validation**

Collect historical identity values without reading conversation content. For each mutable version 2 registry, reject collisions with every other registry and with another room lineage in the same round:

```ts
interface ExecutionIdentity {
  kind: "roomRunId" | "dispatchSetId" | "threadId" | "worktree" | "branch" | "handoffId";
  value: string;
  workId: string;
  planTaskId: string;
  roundId: string;
  roomRunId?: string;
}

export function collectExecutionIdentityIssues(
  workRecords: Array<Pick<WorkRecord, "id" | "coordination">>,
): CoordinationValidationIssue[];
```

Permit `dispatchSetId` reuse only inside the same PLAN/round. Permit room/task/worktree/branch reuse only for revision attempts in the same room-run lineage. Never permit handoff ID reuse.

Also require every version 2 room's `returnRoute.planTaskId` and `monitorOwner` to equal `registry.round.planTaskId`.

- [ ] **Step 5: Preserve rejected-transition atomicity**

Keep parsing, transition, schema validation, semantic validation, and atomic write inside the writer guard. Any failure must leave the Work JSON and revision unchanged; assert this in the CLI tests.

- [ ] **Step 6: Run CLI, registry, and full records tests**

Run: `npx vitest run tests/flowdoc-coordination-cli.test.ts tests/flowdoc-coordination-registry.test.ts && npm run test:records`

Expected: focused suites and all records tests PASS.

- [ ] **Step 7: Commit persistence enforcement**

```powershell
git add -- tools/coordination-registry.ts src/model/coordination.ts tests/flowdoc-coordination-cli.test.ts tests/flowdoc-coordination-registry.test.ts
git commit -m "feat(coordination): reject stale execution identities"
```

### Task 4: Make Historical Recovery Work read-only and label legacy projections

**Files:**
- Modify: `src/model/types.ts`
- Modify: `schemas/project-control.schema.json`
- Modify: `tools/lib/validate-semantics.ts`
- Modify: `tools/lib/build-sqlite-projection.ts`
- Modify: `tests/flowdoc-coordination-projection.test.ts`
- Create: `tests/flowdoc-historical-recovery-work.test.ts`

**Interfaces:**
- Consumes: `WorkRecord` and dual-version coordination registries.
- Produces: `executionMode?: "standard" | "historical-recovery"`, semantic recovery guards, and projection fields `coordination_version`, `coordination_authority`, and `execution_mode`.

- [ ] **Step 1: Write failing recovery and projection tests**

```ts
it("rejects coordination on Historical Recovery Work", async () => {
  const work = createWorkRecord({
    executionMode: "historical-recovery",
    coordination: createCoordinationRegistryV2Fixture(),
  });
  await expect(validateWork(work)).rejects.toContainDiagnostic(
    "HISTORICAL_RECOVERY_COORDINATION_FORBIDDEN",
  );
});

it("projects version 1 as legacy read-only authority", async () => {
  const row = await readProjectedWork("legacy-work");
  expect(row).toMatchObject({
    coordination_version: 1,
    coordination_authority: "legacy-read-only",
  });
});
```

Add a version 2 projection expectation of `coordination_authority: "current-round"` only while `round.state === "active"`; released/cancelled version 2 is `historical-read-only`.

- [ ] **Step 2: Run recovery and projection tests and verify RED**

Run: `npx vitest run tests/flowdoc-historical-recovery-work.test.ts tests/flowdoc-coordination-projection.test.ts`

Expected: FAIL because execution mode and projection authority fields do not exist.

- [ ] **Step 3: Add the Work execution mode and semantic guard**

Add the optional property to `WorkRecord` and schema:

```ts
executionMode?: "standard" | "historical-recovery";
```

In semantic validation, reject coordination whenever `executionMode === "historical-recovery"`. Also require Historical Recovery Work to be a `task` and to use a read-only role such as `evidence-reviewer` or `lane-reconciliation-reviewer`; report separate stable diagnostics for each violation.

- [ ] **Step 4: Extend the SQLite projection**

Add columns to the recreated local `work` table:

```sql
execution_mode text,
coordination_version integer,
coordination_authority text
```

Derive authority without mutating canonical JSON:

```ts
function coordinationAuthority(work: WorkRecord): string | null {
  if (work.coordination === undefined) return null;
  if (work.coordination.version === 1) return "legacy-read-only";
  return work.coordination.round.state === "active"
    ? "current-round"
    : "historical-read-only";
}
```

- [ ] **Step 5: Run recovery, projection, and data checks and verify GREEN**

Run: `npx vitest run tests/flowdoc-historical-recovery-work.test.ts tests/flowdoc-coordination-projection.test.ts && npm run check:data && npm run generate:sqlite`

Expected: all commands PASS; the ignored SQLite projection is regenerated locally.

- [ ] **Step 6: Commit recovery and projection boundaries**

```powershell
git add -- src/model/types.ts schemas/project-control.schema.json tools/lib/validate-semantics.ts tools/lib/build-sqlite-projection.ts tests/flowdoc-coordination-projection.test.ts tests/flowdoc-historical-recovery-work.test.ts
git commit -m "feat(coordination): isolate historical recovery work"
```

### Task 5: Replace transfer guidance with self-contained PLAN guidance

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/domains/flowdoc-global-codex-guidance.md`
- Modify: `docs/domains/agent-and-skill-operating-model.md`
- Modify: `docs/domains/flowdoc-round-workflow.md`
- Modify: `docs/domains/flowdoc-delivery-operating-model.md`
- Modify: `docs/domains/flowdoc-plan-room-orchestration-rules.md`
- Modify: `docs/domains/flowdoc-work-type-routing-model.md`
- Modify: `docs/domains/flowdoc-lean-dispatch-operating-rules.md`
- Modify: `docs/domains/flowdoc-coordination-controls.md`
- Modify: `tests/flowdoc-plan-round-isolation.test.ts`
- Modify: `tests/flowdoc-coordination-docs.test.ts`
- Later sync after main integration: `C:\Users\nekot\.codex\AGENTS.md`
- Later sync after main integration: `C:\Users\nekot\.codex\skills\flowdoc-project-control\SKILL.md`

**Interfaces:**
- Consumes: approved spec and verified runtime vocabulary from Tasks 1-4.
- Produces: one canonical guidance rule across Project Control and the local machine entrypoints.

- [ ] **Step 1: Write failing documentation guards**

For every governing document, require these meanings:

```ts
expect(content).toContain("One PLAN task owns exactly one execution round");
expect(content).toContain("version 1 coordination is historical and read-only");
expect(content).toContain("cross-PLAN ownership transfer is not supported");
expect(content).toContain("Historical Recovery Work");
expect(content).toContain("must not send, wait, revise, resume, or hand off through an older PLAN or WORK task");
```

Also reject operative wording that tells a new PLAN to transfer ownership or restore another PLAN's Room Run Registry. Historical descriptions may retain the phrase only when explicitly marked legacy.

- [ ] **Step 2: Run documentation guards and verify RED**

Run: `npx vitest run tests/flowdoc-plan-round-isolation.test.ts tests/flowdoc-coordination-docs.test.ts`

Expected: FAIL because current documents still describe ownership transfer as an active operation.

- [ ] **Step 3: Update canonical Project Control guidance**

Replace the current rule with this consistent boundary:

```text
One PLAN task owns exactly one execution round. A new PLAN creates a new Work
execution record and version 2 registry. Version 1 coordination is historical
and read-only. Cross-PLAN ownership transfer is not supported. Missing history
is recovered through separate read-only Historical Recovery Work; it never
reactivates the inspected PLAN or WORK task.
```

Keep same-PLAN Revision Packets, automatic return, liveness, queue ordering,
acceptanceGate, and cleanup rules intact.

- [ ] **Step 4: Regenerate and run focused document/data checks**

Run: `npm run generate && npx vitest run tests/flowdoc-plan-round-isolation.test.ts tests/flowdoc-coordination-docs.test.ts && npm run check:data`

Expected: generated index is current and all focused checks PASS.

- [ ] **Step 5: Commit canonical guidance**

```powershell
git add -- AGENTS.md docs/domains/flowdoc-global-codex-guidance.md docs/domains/agent-and-skill-operating-model.md docs/domains/flowdoc-round-workflow.md docs/domains/flowdoc-delivery-operating-model.md docs/domains/flowdoc-plan-room-orchestration-rules.md docs/domains/flowdoc-work-type-routing-model.md docs/domains/flowdoc-lean-dispatch-operating-rules.md docs/domains/flowdoc-coordination-controls.md tests/flowdoc-plan-round-isolation.test.ts tests/flowdoc-coordination-docs.test.ts generated/project-index.json
git commit -m "docs(agent): end execution authority with each PLAN"
```

Do not update the two machine-level files until the canonical repository commit has passed the worktree and main gates.

### Task 6: Register evidence, run both gates, integrate, and sync machine guidance

**Files:**
- Create: `data/evidence/flowdoc-plan-self-contained-rounds-2026-09-21.json`
- Modify: `data/work/plan-self-contained-rounds.json`
- Modify: `data/phases/phase-agent-and-skill-design-plan-self-contained-rounds.json`
- Modify: `data/checklists/checklist-agent-and-skill-design-plan-self-contained-rounds.json`
- Modify: `data/documents/flowdoc-plan-self-contained-rounds-design-2026-09-21.json`
- Modify: `data/documents/flowdoc-plan-self-contained-rounds-implementation-plan-2026-09-21.json`
- Modify: `data/nodes/project-control.json`
- Regenerate: `generated/project-index.json`
- Sync after main gate: `C:\Users\nekot\.codex\AGENTS.md`
- Sync after main gate: `C:\Users\nekot\.codex\skills\flowdoc-project-control\SKILL.md`

**Interfaces:**
- Consumes: exact implementation commit and passing focused checks from Tasks 1-5.
- Produces: bounded Evidence, closed checklist/phase state, passing worktree and main gates, and machine guidance matching canonical Project Control.

- [ ] **Step 1: Run the focused coordination suite**

Run:

```powershell
npx vitest run tests/flowdoc-coordination-schema.test.ts tests/flowdoc-coordination-registry.test.ts tests/flowdoc-coordination-v2.test.ts tests/flowdoc-coordination-cli.test.ts tests/flowdoc-coordination-projection.test.ts tests/flowdoc-historical-recovery-work.test.ts tests/flowdoc-plan-round-isolation.test.ts tests/flowdoc-coordination-docs.test.ts
```

Expected: every focused file and test PASS.

- [ ] **Step 2: Run the full worktree gate**

Run: `npm run check`

Expected: data validation, type-check, grouped unit suites, build, and Chromium e2e all PASS.

- [ ] **Step 3: Commit implementation before creating Evidence**

Run `git status --short`, review `git diff --check`, and commit all implementation changes. Capture and validate the resulting commit:

```powershell
$implementationCommit = (git rev-parse HEAD).Trim()
if ($implementationCommit -notmatch '^[a-f0-9]{40}$') { throw "Implementation commit is not a full SHA." }
$implementationCommit
```

- [ ] **Step 4: Create bounded Evidence and close Project Control records**

Build the exact Evidence values from the captured commit and current timestamp:

```powershell
$evidenceValues = [ordered]@{
  kind = 'evidence'
  id = 'evidence-flowdoc-plan-self-contained-rounds-2026-09-21'
  nodeIds = @('project-control')
  repositoryId = 'repo-project-control'
  commit = $implementationCommit
  pathOrContractId = 'src/model/coordination-v2.ts; src/model/coordination.ts; schemas/project-control.schema.json; tools/coordination-registry.ts; tests/flowdoc-coordination-v2.test.ts; docs/domains/flowdoc-plan-self-contained-rounds-design-2026-09-21.md'
  verificationSummary = 'Version 1 coordination is readable history with no mutation authority; version 2 binds one PLAN task to one round with no ownership-transfer path; stale execution identities and mutable Historical Recovery Work are rejected; focused coordination and full Project Control worktree gates passed. No Core, Backend, Editor, product behavior, or map truth changed.'
  verifiedAt = (Get-Date).ToString('o')
}
$evidenceValues | ConvertTo-Json -Depth 4
```

Use `apply_patch` to create the Evidence record with exactly the emitted values; do not save PowerShell variable names in JSON. Add the Evidence ID to the Work, design and plan Document records, and Project Control Node. Mark checklist items passed only when their stated evidence exists; set the Phase to `done` only after the worktree gate passes.

- [ ] **Step 5: Regenerate, validate, and commit Project Control evidence**

Run: `npm run generate && npm run check:data && git diff --check`

Expected: PASS with a regenerated `generated/project-index.json`.

Commit:

```powershell
git add -- data/evidence/flowdoc-plan-self-contained-rounds-2026-09-21.json data/work/plan-self-contained-rounds.json data/phases/phase-agent-and-skill-design-plan-self-contained-rounds.json data/checklists/checklist-agent-and-skill-design-plan-self-contained-rounds.json data/documents/flowdoc-plan-self-contained-rounds-design-2026-09-21.json data/documents/flowdoc-plan-self-contained-rounds-implementation-plan-2026-09-21.json data/nodes/project-control.json generated/project-index.json
git commit -m "docs(agent): record self-contained PLAN evidence"
```

- [ ] **Step 6: Re-run the full worktree gate after Evidence registration**

Run: `npm run check`

Expected: full gate PASS at the final worktree HEAD.

- [ ] **Step 7: Integrate the detached worktree commits into `main`**

Verify the exact worktree path, clean status, and commit list. Integrate only this round's commits into the clean Project Control `main` using the app's native worktree integration when available; otherwise cherry-pick the reviewed commit sequence in order. Do not merge or modify any historical PLAN/WORK branch.

- [ ] **Step 8: Run the full main gate**

Run from `C:\Users\nekot\Documents\GitHub\flowdoc-project-control`: `npm run check`

Expected: full gate PASS on merged `main`.

- [ ] **Step 9: Sync machine-level guidance from the verified canonical wording**

Update only the bounded FlowDoc sections in:

- `C:\Users\nekot\.codex\AGENTS.md`
- `C:\Users\nekot\.codex\skills\flowdoc-project-control\SKILL.md`

Preserve unrelated user guidance. Run the local skill validator if present and compare the PLAN-isolation wording against canonical Project Control.

- [ ] **Step 10: Clean the current worktree only**

After the main gate and machine-guidance sync pass, verify this worktree is clean and its commits are ancestors of `main`. Remove only `C:\Users\nekot\.codex\worktrees\plan-self-contained-rounds\flowdoc-project-control` through the app's native worktree cleanup. Do not inspect, modify, or remove historical PLAN/WORK worktrees as part of this round.

- [ ] **Step 11: Report the bounded handoff**

Report PASS/FAIL/BLOCKER/RISK/UNKNOWN, Work ID `plan-self-contained-rounds`, Phase and Checklist IDs, exact commits, files changed, focused and full gates, Evidence ID, machine guidance sync, map unchanged, product repositories unchanged, and cleanup status.
