# FlowDoc Workflow Economy Clean Authority Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace FlowDoc's duplicated coordination authority with one enforceable workflow-economy contract that scales proof, context, review, and documentation to the actual work while preserving ownership, scope, safety, return, and acceptance boundaries.

**Architecture:** Introduce coordination registry version 3 as the only mutable post-cutover execution format; versions 1 and 2 remain readable historical data. Version 3 carries a typed minimal PLAN packet and compact WORK completion report, while focused validators enforce authority type, Work Size, Risk Tier, proof/document budgets, evidence reuse, unknown disposition, owner decisions, and stop-after-acceptance. A generated Current Truth Snapshot and governance-cost projection feed a compact Cockpit Overview; only the final cutover task changes authority routing and supersedes the four duplicated operating documents.

**Tech Stack:** TypeScript 7, JSON Schema with AJV, Vitest, React 19, SQLite projection, deterministic Project Control JSON/Markdown generation, Playwright.

**Spec:** `docs/domains/flowdoc-workflow-economy-clean-cutover-design-2026-09-23.md`

## Authority Boundary

This plan belongs to Work `workflow-economy-clean-cutover` in
`repo-project-control`. It may change Project Control policy, canonical records,
schema, coordination behavior, projections, GUI, tests, global FlowDoc guidance,
and the local FlowDoc skill. It must not edit Core, Backend, Editor, product
behavior, product maps, or product readiness truth.

Tasks 1 through 4 build and verify the replacement candidate without changing
current authority. Task 5 is the single atomic authority cutover. If Task 5's
gate fails, the existing authority remains current and no partial routing or
supersession is committed.

## Global Constraints

- The user-provided twenty-item brief is the scope ceiling; each shipped rule must map to one or more of those twenty items.
- `routine` is the Risk Tier default; `critical` requires a recorded escalation reason.
- Work Size and Risk Tier are independent; `large` Work is split before dispatch.
- PLAN alone assigns owner, scope, Work Size, Risk Tier, proof budget, model/effort, WORK authority type, acceptance, and closure.
- WORK authority is exactly `discovery`, `implementation`, or `verification`; Discovery and Verification are read-only.
- Record-first and document-by-exception applies; new Evidence, Gate, audit, or durable document must name the concrete failure it prevents and why existing proof is insufficient.
- Existing evidence is reused when claim, scope, revision, method, and freshness remain valid.
- Unknown disposition is exactly `blocking`, `accepted`, `deferred`, or `irrelevant`; an unknown does not create a Gate.
- A correct conservative fallback that meets its performance budget wins over a new proof mechanism.
- Acceptance ends investigation unless a declared blocker or escalation trigger fires.
- A closed PLAN is permanently read-only; continuation always creates a fresh PLAN, round, registry, WORK task, locator, and return route.
- The cutover creates one current workflow authority; replaced authority remains traceable historical content and is excluded from default context.
- Existing versions 1 and 2 coordination data remain readable and immutable after cutover.
- No new runtime dependency is added.
- All implementation stays in a dedicated worktree until the worktree gate passes, then the full gate runs again on `main`.

## Review Focus

- A hand-edited version 3 packet that omits a Safety Kernel field, silently promotes routine to critical, or couples Work Size to Risk Tier must fail before dispatch.
- A WORK return that edits under Discovery/Verification, exceeds scope or artifact/review budget, changes its assigned profile, or invents an undisclosed artifact must fail acceptance without mutating the registry.
- Evidence that has the same ID but a mismatched claim, scope, revision, method, or freshness trigger must not be treated as reusable.
- A supersession fork, cycle, missing successor, two current successors, or historical document in default context must fail the Project Control data gate.
- A released PLAN, late handoff, owner decision, or already accepted lane must remain closed unless new blocker-grade facts satisfy a declared trigger; ordinary uncertainty must not reopen work.

## Twenty-Item Coverage

| Brief item | Owning task |
| --- | --- |
| 1 Risk/Proof Tier | Tasks 1-2 |
| 2 Proof Budget | Tasks 1-2 |
| 3 Evidence Reuse | Task 3 |
| 4 Gate Creation | Task 2 |
| 5 Close Audit Compression | Tasks 1-2 |
| 6 Current Truth Snapshot / Cockpit | Task 4 |
| 7 Context Loading | Task 3 |
| 8 Historical Memory Compaction | Tasks 3 and 5 |
| 9 Supersession | Tasks 3 and 5 |
| 10 Done Semantics | Task 4 |
| 11 Stop Conditions | Tasks 2 and 5 |
| 12 Inherited Global Rules | Task 5 |
| 13 Minimal Kickoff Packet | Task 1 |
| 14 Completion Economy | Tasks 1-2 |
| 15 Unknown to Action | Tasks 1-2 |
| 16 Fallback before Proof | Task 2 |
| 17 Token/Context Cost | Task 4 |
| 18 Governance Regression | Tasks 4 and 6 |
| 19 Permission to Stop | Task 2 |
| 20 Human Override | Tasks 1-2 |

---

### Task 1: Add the version 3 minimal packet and completion contract

**Files:**
- Create: `src/model/workflow-economy.ts`
- Modify: `src/model/types.ts`
- Modify: `schemas/project-control.schema.json`
- Create: `tests/fixtures/coordination-registry-v3.ts`
- Create: `tests/flowdoc-workflow-economy-schema.test.ts`
- Create at implementation start: `data/phases/phase-workflow-economy-clean-cutover-implementation.json`
- Create at implementation start: `data/checklists/checklist-workflow-economy-clean-cutover-implementation.json`

**Interfaces:**
- Consumes: immutable version 1/version 2 coordination records and the existing `CoordinationModelDecision`, return route, UX gate, and round identity shapes.
- Produces: `WorkflowEconomyPacket`, `WorkflowCompletionReport`, `CoordinationRegistryV3`, `CoordinationRoomRunV3`, `CoordinationTerminalPayloadV3`, and `createRoutineWorkflowPacket()`.

- [ ] **Step 1: Open the implementation Phase and one gate-oriented Checklist**

Create the implementation Phase with ID
`phase-workflow-economy-clean-cutover-implementation`, `phaseState:
"in-progress"`, order `30`, owner repository `repo-project-control`, active role
`project-control-steward`, the four global stop categories, and verification
target `checklist-workflow-economy-clean-cutover-implementation; focused Tasks
1-5 gates; npm run check`. Create one Checklist with exactly six items: packet
contract, enforcement, context/supersession, Cockpit, atomic cutover, and final
evidence/main gate. Start the first item `in-progress` and the other five
`pending`; every item names the focused test file from its owning task as its
Evidence target.

- [ ] **Step 2: Write schema tests for the Safety Kernel, tier default, and independent size/risk axes**

Create tests that accept a complete routine packet, reject every missing kernel
field, reject `large`, and prove a small critical packet and medium routine
packet are both representable:

```ts
it.each([
  "goal", "ownerRepositoryId", "allowedScope", "acceptanceCriteria",
  "workSize", "risk", "proofBudget", "modelDecision", "escalationTriggers",
  "returnRoute",
])("rejects a version 3 packet missing %s", async (field) => {
  const registry = createCoordinationRegistryV3Fixture();
  delete (registry.roomRuns[0].packet as unknown as Record<string, unknown>)[field];
  expect(await schemaDiagnostics(registry)).toContainEqual(
    expect.objectContaining({ code: "SCHEMA_REQUIRED" }),
  );
});

it("keeps Work Size independent from Risk Tier", async () => {
  expect(await schemaDiagnostics(createV3Fixture({ workSize: "small", riskTier: "critical" }))).toEqual([]);
  expect(await schemaDiagnostics(createV3Fixture({ workSize: "medium", riskTier: "routine" }))).toEqual([]);
});
```

In `tests/fixtures/coordination-registry-v3.ts`, implement
`createCoordinationRegistryV3Fixture()` by cloning no legacy registry: construct
a fresh version 3 value with `plan-economy-1`, `round-economy-1`, one prepared
room, a routine packet from `createRoutineWorkflowPacket()`, and no handoff.
Implement `createV3Fixture({ workSize, riskTier })` as a local test helper that
changes only those two properties on a structured clone. Implement
`schemaDiagnostics(registry)` with `validateCanonicalRecordValue()` and the same
minimal Work wrapper used by `tests/flowdoc-coordination-schema.test.ts`.

- [ ] **Step 3: Run the new schema suite and verify RED**

Run: `npx vitest run tests/flowdoc-workflow-economy-schema.test.ts`

Expected: FAIL because version 3 and the packet types do not exist.

- [ ] **Step 4: Define focused workflow-economy types**

Create `src/model/workflow-economy.ts` with these exact public types:

```ts
import type { CoordinationModelDecision } from "./types.js";

export type WorkAuthority = "discovery" | "implementation" | "verification";
export type WorkSize = "small" | "medium";
export type RiskTier = "routine" | "bounded" | "critical";
export type UnknownDisposition = "blocking" | "accepted" | "deferred" | "irrelevant";
export type CloseForm = "none" | "acceptance-summary" | "formal-audit";
export type OwnerDecisionKind = "accept-risk" | "defer-proof" | "freeze-scope" | "stop-investigation";

export interface WorkflowUnknown {
  id: string;
  summary: string;
  disposition: UnknownDisposition;
  ownerAction?: string;
  returnTrigger?: string;
}

export interface OwnerDecision {
  id: string;
  kind: OwnerDecisionKind;
  reason: string;
  decidedBy: string;
  decidedAt: string;
  returnTrigger?: string;
}

export interface ProofBudget {
  maxNewEvidence: number;
  maxDurableDocuments: number;
  maxReviewCycles: number;
  closeForm: CloseForm;
  authorizedArtifacts: Array<{
    kind: "evidence" | "gate" | "audit" | "document";
    failurePrevented: string;
    existingProofInsufficient: string;
  }>;
}

export interface WorkflowEconomyPacket {
  policyId: "flowdoc-workflow-economy-v1";
  goal: string;
  ownerRepositoryId: string;
  allowedScope: string[];
  forbiddenScope: string[];
  acceptanceCriteria: string[];
  workAuthority: WorkAuthority;
  workSize: WorkSize;
  risk: { tier: RiskTier; escalationReason?: string };
  proofBudget: ProofBudget;
  relevantEvidenceIds: string[];
  unknowns: WorkflowUnknown[];
  ownerDecisions: OwnerDecision[];
  fallback?: { behavior: string; performanceBudget: string; verification: string };
  modelDecision: CoordinationModelDecision;
  escalationTriggers: string[];
  returnRoute: { planTaskId: string; automaticChannel: string; activeCommand: string };
}

export interface WorkflowCompletionReport {
  behaviorChanged: string;
  proof: Array<{ kind: "test" | "evidence"; reference: string }>;
  remainingUnknowns: WorkflowUnknown[];
  downstreamInformation: string;
  changedFiles: string[];
  createdEvidenceIds: string[];
  createdDocumentIds: string[];
  reviewCyclesUsed: number;
  implementationCommitCount: number;
}
```

Implement `createRoutineWorkflowPacket(input)` so omitted risk uses
`{ tier: "routine" }`, routine proof defaults to zero new Evidence, zero
durable documents, zero review cycles, and `closeForm: "none"`. The helper must
not infer Risk Tier from Work Size.

- [ ] **Step 5: Add version 3 coordination types without mutating old versions**

Add version 3 types to `src/model/types.ts`. `CoordinationRegistry` becomes a
three-version union. Version 3 preserves version 2's immutable `planTaskId` and
`roundId`, adds `policyId: "flowdoc-workflow-economy-v1"` to `round`, requires
`packet: WorkflowEconomyPacket` on each room, and requires
`completion: WorkflowCompletionReport` in each terminal payload. Do not add
workflow fields to version 1 or version 2.

- [ ] **Step 6: Add the strict version 3 JSON Schema branch and fixture**

Use `additionalProperties: false` at every new object boundary. Require all
Safety Kernel fields, integer budgets with `minimum: 0`, non-empty goal/scope/
acceptance/escalation arrays, exact enums, and conditional rules:

```json
{
  "if": { "properties": { "risk": { "properties": { "tier": { "const": "critical" } } } } },
  "then": { "properties": { "risk": { "required": ["escalationReason"] } } }
}
```

The schema must not contain `large`; large intent is split by PLAN before a
packet exists.

- [ ] **Step 7: Run schema and type checks and verify GREEN**

Run: `npx vitest run tests/flowdoc-workflow-economy-schema.test.ts && npm run type-check`

Expected: all tests PASS and TypeScript reports no errors.

- [ ] **Step 8: Commit the contract**

```powershell
git add -- src/model/workflow-economy.ts src/model/types.ts schemas/project-control.schema.json tests/fixtures/coordination-registry-v3.ts tests/flowdoc-workflow-economy-schema.test.ts data/phases/phase-workflow-economy-clean-cutover-implementation.json data/checklists/checklist-workflow-economy-clean-cutover-implementation.json
git commit -m "feat(workflow): add economy packet contract"
```

### Task 2: Enforce PLAN authority, proof economy, completion, and stopping

**Files:**
- Create: `src/model/coordination-v3.ts`
- Modify: `src/model/coordination.ts`
- Modify: `tools/coordination-registry.ts`
- Modify: `tools/lib/validate-semantics.ts`
- Create: `tests/flowdoc-workflow-economy-lifecycle.test.ts`
- Modify: `tests/flowdoc-coordination-cli.test.ts`

**Interfaces:**
- Consumes: Task 1's version 3 packet/completion types and existing immutable coordination transition helpers.
- Produces: `validateWorkflowPacket()`, `validateWorkflowCompletion()`, `applyCoordinationV3Command()`, and a facade that mutates only version 3 after cutover.

- [ ] **Step 1: Write failing behavior tests for all authority and economy rules**

Cover these cases with named diagnostics:

```ts
it.each([
  ["critical without a reason", criticalWithoutReason(), "CRITICAL_REASON_REQUIRED"],
  ["routine formal audit", routineFormalAudit(), "CLOSE_FORM_EXCEEDS_TIER"],
  ["unauthorized proof artifact", undisclosedEvidence(), "PROOF_ARTIFACT_UNAUTHORIZED"],
  ["review budget exceeded", twoReviewsOnOneReviewBudget(), "REVIEW_BUDGET_EXCEEDED"],
  ["unclassified unknown", unknownWithoutDisposition(), "UNKNOWN_DISPOSITION_REQUIRED"],
])("rejects %s", (_name, fixture, code) => {
  expect(validateWorkflowCompletion(fixture.packet, fixture.completion)).toContainEqual(
    expect.objectContaining({ code }),
  );
});

it.each(["discovery", "verification"] as const)("rejects changed files for %s", (workAuthority) => {
  const fixture = completionFixture({ workAuthority, changedFiles: ["src/changed.ts"] });
  expect(validateWorkflowCompletion(fixture.packet, fixture.completion))
    .toContainEqual(expect.objectContaining({ code: "WORK_AUTHORITY_READ_ONLY" }));
});
```

Define `completionFixture(overrides)` in the test file from
`createCoordinationRegistryV3Fixture()`: clone the room packet, construct all
four completion fields with zero artifact/review use, then apply only the named
override. Define the five matrix helpers as one-line calls to this helper that
respectively remove the critical reason, select formal audit on routine, add an
undeclared Evidence ID, use two reviews against a budget of one, or delete an
unknown disposition.

Also test: packet profile cannot change after activation; changed files must
stay inside allowed scope and outside forbidden scope; implementation may edit;
blocking unknown prevents acceptance; accepted/deferred/irrelevant unknown does
not; deferred unknown requires a return trigger; owner decisions remain closed;
new blocker-grade facts matching an escalation trigger may reopen; passing
acceptance rejects any later proof/revision command with
`ACCEPTED_WORK_MUST_STOP`; fallback is permitted only with recorded correctness
and performance verification; an unknown never synthesizes a decision Gate.

- [ ] **Step 2: Run lifecycle tests and verify RED**

Run: `npx vitest run tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-cli.test.ts`

Expected: FAIL because version 3 validation and transitions do not exist.

- [ ] **Step 3: Implement packet validation as pure functions**

In `src/model/coordination-v3.ts`, return stable issue objects without mutating
input:

```ts
export interface WorkflowEconomyIssue { code: string; message: string }

export function validateWorkflowPacket(packet: WorkflowEconomyPacket): WorkflowEconomyIssue[];
export function validateWorkflowCompletion(
  packet: WorkflowEconomyPacket,
  completion: WorkflowCompletionReport,
): WorkflowEconomyIssue[];
export function packetDigest(packet: WorkflowEconomyPacket): string;
```

Validate tier/close-form combinations, critical reason, explicit artifact
authorization, numeric budget use, unknown disposition/return trigger, read-only
authority, scope, and the four completion facts. Compare the stored packet
digest at activation and return so WORK cannot alter scope, tier, budget,
model, authority type, or acceptance.

- [ ] **Step 4: Implement version 3 transitions and permanent stop behavior**

Port the version 2 round identity, return, liveness, queue, UX, evidence, and
cleanup invariants. Before `accept-handoff`, validate the packet and completion;
reject when any check fails. Once accepted, allow only receipt inspection,
round release, and cleanup transitions. Reject revision/proof expansion after
acceptance unless the command includes a blocker-grade fact matching an
existing escalation trigger:

```ts
type ReopenTrigger = {
  kind: "safety-correctness" | "authority-violation" | "missing-prerequisite" | "scope-escape";
  fact: string;
  matchedEscalationTrigger: string;
};
```

An owner decision may not suppress `safety-correctness` or
`authority-violation`.

- [ ] **Step 5: Make the CLI version-aware without cutting over yet**

Teach the CLI to parse and validate version 3 commands. Keep version 2 mutation
available until Task 5 changes the authority switch. Reject raw packet changes
after room activation and preserve atomic writes on every validation failure.

- [ ] **Step 6: Add project-wide semantic guards**

In `validateProjectSemantics()`, validate every version 3 packet, require its
owner repository to match the room and Work repository boundary, reject a
version 3 registry on `historical-recovery` Work, and reject active version 3
rooms under a released/cancelled round. Do not infer missing fields.

- [ ] **Step 7: Run focused lifecycle, CLI, semantic, and records gates**

Run: `npx vitest run tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-cli.test.ts tests/semantic-validation.test.ts && npm run test:records`

Expected: all focused and records tests PASS.

- [ ] **Step 8: Commit enforcement**

```powershell
git add -- src/model/coordination-v3.ts src/model/coordination.ts tools/coordination-registry.ts tools/lib/validate-semantics.ts tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-coordination-cli.test.ts tests/semantic-validation.test.ts
git commit -m "feat(workflow): enforce proportional PLAN and WORK authority"
```

### Task 3: Add evidence validity, document context classes, and supersession routing

**Files:**
- Modify: `src/model/types.ts`
- Modify: `schemas/project-control.schema.json`
- Create: `src/model/context-routing.ts`
- Modify: `tools/lib/validate-semantics.ts`
- Modify: `tools/lib/build-read-model.ts`
- Modify: `tools/lib/build-sqlite-projection.ts`
- Modify: `app/src/data/loadProjectState.ts`
- Create: `tests/flowdoc-context-routing.test.ts`
- Modify: `tests/sqlite-projection.test.ts`
- Modify: `tests/load-sources.test.ts`

**Interfaces:**
- Consumes: Project Control `DocumentRecord`, `EvidenceRecord`, Work context IDs, and version 3 relevant Evidence references.
- Produces: `ContextClass`, `EvidenceValidity`, `resolveCurrentDocument()`, `selectDefaultContext()`, and `isEvidenceReusable()`.

- [ ] **Step 1: Write failing routing and reuse tests**

Pin one-successor selection, default-context exclusion, cycle/fork rejection,
and evidence freshness:

```ts
it("loads current packet references but excludes historical documents by default", () => {
  expect(selectDefaultContext(work, documents).map((item) => item.id))
    .toEqual(["doc-current", "doc-supporting-explicitly-referenced"]);
});

it.each(["claim", "pathScope", "sourceRevision", "verificationMethod", "freshnessTriggers"])(
  "rejects evidence reuse when %s differs",
  (field) => expect(isEvidenceReusable(mismatch(field))).toBe(false),
);
```

Test missing successor, two successors, cycle, active historical authority,
and a `contextDocumentIds` entry that names historical content.

- [ ] **Step 2: Run context tests and verify RED**

Run: `npx vitest run tests/flowdoc-context-routing.test.ts tests/sqlite-projection.test.ts tests/load-sources.test.ts`

Expected: FAIL because context class, supersession, and validity fields do not exist.

- [ ] **Step 3: Extend records without rewriting historical content**

Add these optional fields for legacy readability and require them semantically
for records participating in the new policy:

```ts
export type ContextClass = "current" | "supporting" | "historical";

export interface DocumentRecord {
  // existing fields
  contextClass?: ContextClass;
  supersedes?: string[];
  supersededBy?: string;
}

export interface EvidenceValidity {
  claim: string;
  repositoryId: string;
  pathScope: string[];
  sourceRevision: string;
  verificationMethod: string;
  freshnessTriggers: string[];
  supersedesEvidenceId?: string;
}
```

Add `validity?: EvidenceValidity` to `EvidenceRecord`. A version 3 packet may
reference only Evidence with validity metadata; legacy Work may keep reading
legacy Evidence.

- [ ] **Step 4: Implement deterministic authority and context routing**

Export:

```ts
export function resolveCurrentDocument(
  documentId: string,
  documentsById: ReadonlyMap<string, DocumentRecord>,
): DocumentRecord;

export function selectDefaultContext(
  work: Pick<WorkRecord, "contextDocumentIds">,
  documentsById: ReadonlyMap<string, IndexDocument>,
): IndexDocument[];

export function isEvidenceReusable(
  expected: EvidenceValidity,
  actual: EvidenceValidity,
  firedFreshnessTriggers: ReadonlySet<string>,
): boolean;
```

Follow `supersededBy` to exactly one active/current successor, detect cycles,
and never select historical content unless the caller explicitly requests
audit, conflict, evidence recovery, or reconciliation mode. Supporting content
loads only when the current packet references it.

- [ ] **Step 5: Add semantic diagnostics and projection columns**

Reject supersession cycles/forks, dangling or asymmetric links, a superseded
document not marked historical, a current successor not active, and historical
default context. Add `context_class` and `superseded_by` to the SQLite documents
table, a `document_supersession` relation, and Evidence validity JSON. Extend
the browser loader to validate the optional fields.

- [ ] **Step 6: Run routing, schema, projection, and data checks**

Run: `npx vitest run tests/flowdoc-context-routing.test.ts tests/sqlite-projection.test.ts tests/load-sources.test.ts tests/schema.test.ts && npm run check:data && npm run generate:sqlite`

Expected: all commands PASS; historical records remain readable.

- [ ] **Step 7: Commit context and supersession behavior**

```powershell
git add -- src/model/types.ts schemas/project-control.schema.json src/model/context-routing.ts tools/lib/validate-semantics.ts tools/lib/build-read-model.ts tools/lib/build-sqlite-projection.ts app/src/data/loadProjectState.ts tests/flowdoc-context-routing.test.ts tests/sqlite-projection.test.ts tests/load-sources.test.ts tests/schema.test.ts
git commit -m "feat(workflow): route current context and reusable evidence"
```

### Task 4: Generate completion milestones, Current Truth Snapshot, and Cockpit metrics

**Files:**
- Create: `src/model/current-truth-snapshot.ts`
- Modify: `src/model/types.ts`
- Modify: `tools/lib/build-read-model.ts`
- Modify: `tools/lib/build-sqlite-projection.ts`
- Modify: `app/src/data/loadProjectState.ts`
- Modify: `app/src/components/ControlRoom.tsx`
- Modify: `app/src/styles/control-room.css`
- Create: `tests/flowdoc-current-truth-snapshot.test.ts`
- Modify: `app/src/App.test.tsx`
- Modify: `tests/e2e/project-control.spec.ts`
- Modify: `tests/sqlite-projection.test.ts`

**Interfaces:**
- Consumes: canonical Work/Phase/Checklist/Evidence/Document records and accepted version 3 completion reports.
- Produces: `CompletionMilestones`, `CurrentTruthSnapshot`, `GovernanceCostSnapshot`, `buildCompletionMilestones()`, `buildCurrentTruthSnapshot()`, and the Overview Cockpit.

- [ ] **Step 1: Write failing projection tests for honest completion and compact current truth**

```ts
it("does not label planning-only completion as implementation complete", () => {
  expect(buildCompletionMilestones(planningOnlyFixture())).toEqual({
    planning: "complete",
    implementation: "not-required",
    verification: "not-required",
    truthPromotion: "pending",
  });
});

it("builds the eight-field snapshot without historical authority", () => {
  const snapshot = buildCurrentTruthSnapshot(projectFixture());
  expect(snapshot).toMatchObject({
    currentGoal: expect.any(String),
    currentBlocker: null,
    activeWork: expect.any(Array),
    acceptedTruth: expect.any(Array),
    criticalUnknowns: expect.any(Array),
    deferredWork: expect.any(Array),
    nextDecision: expect.any(String),
    repositoryIds: expect.any(Array),
  });
  expect(snapshot.authorityDocumentIds).not.toContain("doc-historical");
});
```

Build both test inputs with exported fixture factories in
`tests/fixtures/project-source.ts`: `planningOnlyFixture()` has one completed
planning checklist and no implementation room; `projectFixture()` has one
active routine version 3 room, one current Evidence-backed Node, one blocking
unknown, one deferred unknown, one current authority document, and one
historical document.

Test deterministic tie-breaking, no active Work, blocking versus deferred
unknowns, and no generic `Done` label in UI output.

- [ ] **Step 2: Run snapshot and UI tests and verify RED**

Run: `npx vitest run tests/flowdoc-current-truth-snapshot.test.ts app/src/App.test.tsx`

Expected: FAIL because the snapshot and milestone UI do not exist.

- [ ] **Step 3: Define and build generated snapshot types**

Add:

```ts
export type MilestoneState = "not-required" | "pending" | "complete";
export interface CompletionMilestones {
  planning: MilestoneState;
  implementation: MilestoneState;
  verification: MilestoneState;
  truthPromotion: MilestoneState;
}

export interface CurrentTruthSnapshot {
  generatedAt: string;
  currentGoal: string | null;
  currentBlocker: string | null;
  activeWork: Array<{ workId: string; title: string; milestones: CompletionMilestones }>;
  acceptedTruth: Array<{ nodeId: string; evidenceIds: string[] }>;
  criticalUnknowns: WorkflowUnknown[];
  deferredWork: WorkflowUnknown[];
  nextDecision: string | null;
  repositoryIds: string[];
  authorityDocumentIds: string[];
}
```

`generatedAt` is supplied by the generator, not read during sorting. Selection
order is blocked, in-progress, in-review, queued; ties use `updatedAt` descending
then ID. Derive milestones from requested WORK authority, accepted handoffs,
verification returns, and Evidence promotion; never infer all-complete from
`phaseState: "done"`.

- [ ] **Step 4: Add automatically observable governance metrics**

Build, do not hand-enter:

```ts
export interface GovernanceCostSnapshot {
  approximateContextTokens: number;
  contextDocumentCount: number;
  evidenceCreated: number;
  durableDocumentsCreated: number;
  implementationCommitCount: number;
  reviewCycleCount: number;
  reopenCount: number;
}
```

Use selected context content length divided by four for the token proxy, version
3 completion fields for commits/artifacts/reviews, and accepted-lane reopen
commands for reopen count. Metrics are informational and must never affect
acceptance.

- [ ] **Step 5: Add snapshot and metrics to JSON/SQLite/read validation**

Add `currentSnapshot` and `governanceCost` to `ProjectReadModel`, serialized
deterministically. Add SQLite tables `current_truth_snapshot` and
`governance_cost_snapshot`. Update browser validation and projection tests.

- [ ] **Step 6: Replace the root Overview header with the compact Cockpit**

Keep the surface classified as `Overview`. Above the Repo Directory cards,
render current goal, blocker, active work with four explicit milestone labels,
accepted truth count, critical unknowns, deferred work, next decision, and
repositories. Put metrics and source detail behind selection; do not render full
Work, Evidence, Checklist, document, risk, or history lists on Home.

- [ ] **Step 7: Run focused unit, accessibility, and browser tests**

Run: `npx vitest run tests/flowdoc-current-truth-snapshot.test.ts tests/sqlite-projection.test.ts app/src/App.test.tsx app/src/accessibility.test.tsx && npm run build && npm run test:e2e`

Expected: all commands PASS; Home exposes the Cockpit and retains Overview/
History/Detail separation.

- [ ] **Step 8: Commit the snapshot and Cockpit**

```powershell
git add -- src/model/current-truth-snapshot.ts src/model/types.ts tools/lib/build-read-model.ts tools/lib/build-sqlite-projection.ts app/src/data/loadProjectState.ts app/src/components/ControlRoom.tsx app/src/styles/control-room.css tests/flowdoc-current-truth-snapshot.test.ts app/src/App.test.tsx app/src/accessibility.test.tsx tests/e2e/project-control.spec.ts tests/sqlite-projection.test.ts generated/project-index.json
git commit -m "feat(project-control): add current truth cockpit"
```

### Task 5: Perform the atomic workflow-authority cutover

**Files:**
- Create: `docs/domains/flowdoc-workflow-economy-policy.md`
- Create: `data/documents/flowdoc-workflow-economy-policy.json`
- Modify: `AGENTS.md`
- Modify: `docs/domains/flowdoc-global-codex-guidance.md`
- Modify: `docs/domains/project-control-agent-onboarding.md`
- Modify: `docs/domains/agent-and-skill-operating-model.md`
- Modify: `docs/domains/flowdoc-round-workflow.md`
- Modify: `docs/domains/flowdoc-coordination-controls.md`
- Modify: `data/documents/flowdoc-delivery-operating-model.json`
- Modify: `data/documents/flowdoc-plan-room-orchestration-rules.json`
- Modify: `data/documents/flowdoc-work-type-routing-model.json`
- Modify: `data/documents/flowdoc-lean-dispatch-operating-rules.json`
- Modify: `data/documents/flowdoc-coordination-controls.json`
- Modify: `data/nodes/project-control.json`
- Modify: `src/model/coordination.ts`
- Modify: `tools/coordination-registry.ts`
- Create: `tests/flowdoc-workflow-economy-cutover.test.ts`
- Modify: `tests/flowdoc-project-control-skill.test.ts`
- Retire or rewrite: `tests/flowdoc-delivery-operating-model.test.ts`
- Retire or rewrite: `tests/flowdoc-plan-room-orchestration-rules.test.ts`
- Retire or rewrite: `tests/flowdoc-work-type-routing-model.test.ts`
- Retire or rewrite: `tests/flowdoc-lean-dispatch-operating-rules.test.ts`
- Rewrite affected exact-text tests listed by `rg -l 'doc-flowdoc-(delivery-operating-model|plan-room-orchestration-rules|work-type-routing-model|lean-dispatch-operating-rules)' tests`
- Sync only after verified main integration: `C:\Users\nekot\.codex\AGENTS.md`
- Sync only after verified main integration: `C:\Users\nekot\.codex\skills\flowdoc-project-control\SKILL.md`

**Interfaces:**
- Consumes: verified Tasks 1-4 candidate behavior and the approved twenty-item design.
- Produces: one current `doc-flowdoc-workflow-economy-policy`, historical replaced documents, supporting low-level coordination controls, and a facade that mutates only version 3.

- [ ] **Step 1: Inventory every current authority entrypoint and write the failing atomic-cutover guard**

Use one test-owned list rather than duplicated prose assertions:

```ts
const currentEntrypoints = [
  "AGENTS.md",
  "docs/domains/flowdoc-global-codex-guidance.md",
  "docs/domains/project-control-agent-onboarding.md",
  "docs/domains/agent-and-skill-operating-model.md",
  "docs/domains/flowdoc-round-workflow.md",
  "C:/Users/nekot/.codex/skills/flowdoc-project-control/SKILL.md",
];

it("routes every current entrypoint to the workflow economy policy", async () => {
  for (const path of currentEntrypoints.filter((item) => !item.startsWith("C:/"))) {
    expect(normalize(await read(path))).toContain("flowdoc-workflow-economy-policy.md");
  }
});
```

The same suite must assert: the new policy is active/current; each replaced
document is `lifecycle: "superseded"`, `contextClass: "historical"`, and points
to the new policy; the new policy lists all four IDs in `supersedes`; coordination
controls is active/supporting; no Work default context names a replaced document;
old Markdown remains readable; versions 1 and 2 reject mutation with
`HISTORICAL_REGISTRY_READ_ONLY`; version 3 accepts mutation.

- [ ] **Step 2: Run the cutover suite and verify RED**

Run: `npx vitest run tests/flowdoc-workflow-economy-cutover.test.ts`

Expected: FAIL because the new policy and routing do not exist.

- [ ] **Step 3: Publish one policy that carries only current rules**

Write `flowdoc-workflow-economy-policy.md` as the sole current workflow
authority. It must contain the Safety Kernel, PLAN responsibility, size/risk
separation, three WORK authorities, tier/proof/document defaults, reuse and
freshness, unknown/gate/fallback/override rules, minimal packet/return,
completion milestones, closure/continuation, context classes/supersession,
Cockpit, metrics/regression review, permission to stop, and the four global stop
categories. Put shared authority disclaimers once in this policy; child packets
state only exceptions.

- [ ] **Step 4: Apply document lifecycle migration in one patch**

Register the policy as `lifecycle: "active"`, `contextClass: "current"`, and
`supersedes` the four documents below:

```text
doc-flowdoc-delivery-operating-model
doc-flowdoc-plan-room-orchestration-rules
doc-flowdoc-work-type-routing-model
doc-flowdoc-lean-dispatch-operating-rules
```

Set those four records to `lifecycle: "superseded"`,
`contextClass: "historical"`, and
`supersededBy: "doc-flowdoc-workflow-economy-policy"`. Keep their Markdown and
Evidence unchanged. Mark `doc-flowdoc-coordination-controls` active/supporting;
it remains the low-level transport/queue/receipt reference only and is not a
default authority entrypoint.

- [ ] **Step 5: Replace entrypoint lists and duplicated guidance**

Point repository AGENTS, canonical global guidance, onboarding, agent model,
and round workflow to the new policy first. Remove the four replaced documents
from required/default reading. Preserve only concise non-duplicated references
to documentation authority, terminology, GUI orientation, and low-level
coordination controls when a packet actually uses a separate WORK room.

- [ ] **Step 6: Flip mutable registry authority from version 2 to version 3**

Change the facade and CLI so version 1 and version 2 throw
`HISTORICAL_REGISTRY_READ_ONLY` before command parsing. Only version 3 accepts
transitions. A late v1/v2 handoff remains readable as historical/reconciliation
input but cannot enter the current completion queue.

- [ ] **Step 7: Replace exact-text document tests with behavior and routing tests**

Delete assertions whose only purpose was to repeat sentences across the four
old documents. Preserve safety coverage by moving return identity, liveness,
queue order, idempotency, acceptance, round isolation, model selection, and
cleanup checks to typed coordination tests. Keep only small link/lifecycle tests
for entrypoints and supersession.

- [ ] **Step 8: Run the atomic cutover gate**

Run:

```powershell
npm run generate
npx vitest run tests/flowdoc-workflow-economy-cutover.test.ts tests/flowdoc-workflow-economy-schema.test.ts tests/flowdoc-workflow-economy-lifecycle.test.ts tests/flowdoc-context-routing.test.ts tests/flowdoc-current-truth-snapshot.test.ts tests/flowdoc-plan-round-isolation.test.ts tests/flowdoc-coordination-registry.test.ts tests/flowdoc-coordination-v2.test.ts tests/flowdoc-project-control-skill.test.ts
npm run check:data
```

Expected: every focused suite and the data gate PASS. If any entrypoint still
requires a replaced document, do not commit this task; restore the candidate to
the pre-cutover commit and keep the old authority current.

- [ ] **Step 9: Commit the cutover atomically**

Stage the new policy, all entrypoint changes, all five document lifecycle
records, version-authority switch, migrated tests, node record, and regenerated
index in one commit:

```powershell
git add -- AGENTS.md docs/domains data/documents data/nodes/project-control.json src/model/coordination.ts tools/coordination-registry.ts tests generated/project-index.json
git commit -m "feat(workflow): cut over to workflow economy authority"
```

### Task 6: Register bounded evidence, verify both gates, integrate, and close

**Files:**
- Create: `data/evidence/flowdoc-workflow-economy-clean-cutover-2026-09-23.json`
- Modify: `data/work/workflow-economy-clean-cutover.json`
- Modify: `data/phases/phase-workflow-economy-clean-cutover-implementation.json`
- Modify: `data/checklists/checklist-workflow-economy-clean-cutover-implementation.json`
- Modify: `data/documents/flowdoc-workflow-economy-clean-cutover-design-2026-09-23.json`
- Modify: `data/documents/flowdoc-workflow-economy-clean-cutover-implementation-plan-2026-09-23.json`
- Modify: `data/documents/flowdoc-workflow-economy-policy.json`
- Modify: `data/nodes/project-control.json`
- Regenerate: `generated/project-index.json`
- Sync after main gate: `C:\Users\nekot\.codex\AGENTS.md`
- Sync after main gate: `C:\Users\nekot\.codex\skills\flowdoc-project-control\SKILL.md`

**Interfaces:**
- Consumes: exact commits and passing focused/full gates from Tasks 1-5.
- Produces: one bounded Evidence record, honest completion milestones, verified main, canonical/machine guidance parity, and removal of only this clean merged worktree.

- [ ] **Step 1: Run the full worktree gate**

Run: `npm run check`

Expected: data validation, type-check, all grouped unit suites, production build,
and six Chromium e2e tests PASS.

- [ ] **Step 2: Review change economy before claiming success**

Run `git diff --check`, inspect `git diff --stat main...HEAD`, and record:

```text
workflow steps added/removed
current-context document count before/after
new Evidence count
new durable document count
implementation commits : governance artifacts
review/reopen count
```

Fail the close gate if the implementation adds an unbudgeted document, audit,
Gate, Evidence layer, or default-context dependency.

- [ ] **Step 3: Commit implementation before creating Evidence**

Capture the full implementation SHA only after the worktree gate passes:

```powershell
$implementationCommit = (git rev-parse HEAD).Trim()
if ($implementationCommit -notmatch '^[a-f0-9]{40}$') { throw "Implementation commit is not a full SHA." }
```

- [ ] **Step 4: Create one Evidence record and close only supported milestones**

The Evidence must identify version 3 packet/lifecycle tests, context routing,
snapshot/Cockpit tests, atomic entrypoint/lifecycle cutover tests, and the full
worktree gate. It must state that Core, Backend, Editor, product behavior, and
product maps did not change. Add the Evidence ID to the Work, policy/design/plan
Document records, and Project Control Node. Mark planning, implementation, and
verification complete only after their checks pass; mark truth promotion
complete only after the policy is current and every supersession link validates.

- [ ] **Step 5: Regenerate and verify the evidence commit**

Run: `npm run generate && npm run check:data && git diff --check`

Expected: PASS. Commit only the bounded evidence/closure records and generated
index:

```powershell
git add -- data/evidence/flowdoc-workflow-economy-clean-cutover-2026-09-23.json data/work/workflow-economy-clean-cutover.json data/phases/phase-workflow-economy-clean-cutover-implementation.json data/checklists/checklist-workflow-economy-clean-cutover-implementation.json data/documents/flowdoc-workflow-economy-clean-cutover-design-2026-09-23.json data/documents/flowdoc-workflow-economy-clean-cutover-implementation-plan-2026-09-23.json data/documents/flowdoc-workflow-economy-policy.json data/nodes/project-control.json generated/project-index.json
git commit -m "docs(workflow): record workflow economy evidence"
```

- [ ] **Step 6: Re-run the full worktree gate at final HEAD**

Run: `npm run check`

Expected: full gate PASS with evidence and closure records included.

- [ ] **Step 7: Integrate only this reviewed branch and run the full main gate**

Verify the worktree is clean and list the exact commits unique to
`codex/workflow-economy-design`. Integrate them in order using the app's native
worktree integration when available; otherwise cherry-pick only the reviewed
commit sequence into clean `main`. From
`C:\Users\nekot\Documents\GitHub\flowdoc-project-control`, run `npm run check`.

Expected: full gate PASS on `main`.

- [ ] **Step 8: Sync verified machine guidance**

Copy only the bounded FlowDoc authority section from verified canonical
guidance into `C:\Users\nekot\.codex\AGENTS.md`, preserving unrelated user
guidance. Update the installed `flowdoc-project-control` skill so its default
load order is Current Truth Snapshot -> current packet -> directly relevant
current/supporting contract/evidence, with historical content trigger-loaded.
Run the skill validator and the repository skill parity test.

- [ ] **Step 9: Remove only the clean merged current worktree**

Confirm every worktree commit is an ancestor of `main`, the worktree is clean,
and no live process uses it. Remove only the current workflow-economy worktree
and merged branch. Do not inspect, reactivate, or remove historical PLAN/WORK
worktrees in this round.

- [ ] **Step 10: Report the compact handoff and stop**

Report PASS/FAIL/BLOCKER/RISK/UNKNOWN; Work/Phase/Checklist IDs; behavior
changed; tests/Evidence; remaining unknowns with disposition; downstream
information or `none`; exact commits; main gate; machine-guidance sync; map
unchanged; product repositories unchanged; cleanup status. Do not open another
audit, proof layer, or follow-up Work unless a declared blocker or escalation
trigger fired.
