# Core Stage6 no-op and lifecycle contract

## Authority Boundary

Project Control owns this decision; `repo-core` owns future implementation.
Work `flowdoc-core-stage6-noop-lifecycle-contract-20260927`, Phase
`phase-flowdoc-core-stage6-noop-lifecycle-contract-20260927`, Checklist
`checklist-flowdoc-core-stage6-noop-lifecycle-contract-20260927`.
Roles: Planning Partner and Documentation Synthesizer.

Status: no-op specified under delegated decision authority; retained-source
bounded recovery selected by the user in this round; host cancellation uses the
existing bounded synchronous execution option with explicit pre-entry/late timing.
This supplements the existing semantic
contract; it is not product Evidence, Stage6/Gate2 admission, performance proof,
geometry, Editor/Backend, public/production binding or map truth.

## Round packet and immutable input

Fresh inline PLAN round `stage6-noop-lifecycle-20260927-01a0e20c`, task
`01a0e20c-5d02-7463-b748-b8bacba461c9`, policy `flowdoc-workflow-economy-v2`.
Work Size medium; Risk Tier routine: reversible contract maintenance, no product
mutation. Discovery authority is read-only in Core; PLAN alone writes this PC
decision and its Work/Phase/Checklist/Document records, generated projection and
the existing Work inventory test's expected ID list.
No separate WORK, child, historical-room operation, new gate or product audit.

PC base `d84a20da381c87ba17fa3965c3fc921ffa0f8474`; Core source base
`8997f4c14b1a5a2487ea990c5c6f35bd4da54aff`. Both main refs and clean states were
checked locally on 2026-09-27. PC lane is
`C:/Users/nekot/.codex/worktrees/5dbc/flowdoc-project-control`, branch
`codex/stage6-noop-lifecycle-contract`. The generated snapshot's old Thai append
blocker is stale relative to the exact accepted seam Evidence; this round does
not revive its closed execution context or claim broad snapshot reconciliation.

Reuse [seam Evidence](../../data/evidence/core-stage6-seam-repair-20260927.json)
and the immutable `terminal-report.json` at
`C:/Users/nekot/.codex/visualizations/2026/09/26/01a0df93-c2e2-71f1-b879-92ee62ec8e6b/`.
No new product Evidence target: future implementation must revalidate the affected
receipt/accounting/lifecycle claims. Proof budget: one source-grounded contract
review, normal PC lane/main checks; zero full measurement and zero formal audits.
Document budget: this one durable addendum and four canonical records; reuse all
existing contracts. The existing semantic document is not rewritten with
unresolved transport semantics.

PLAN model decision: frontier `gpt-6-astra` at medium, selected for contract and
state-machine reasoning; `gpt-6-sol` medium is the next smaller available option,
but reconciling lifecycle authority and atomicity makes PLAN Lite inappropriate. Host
availability is recorded once in this round. No WORK model is inherited or
selected because no WORK room exists. Escalate scope only for a concrete
authority conflict or architecture choice, not an ordinary missing test.

## Existing authority and implementation delta

References below are to the inspected PC base above unless marked Core. Core
paths beginning `cold_session/` are under
`packages/text-engine-rust-wasm/rust-live-draft-engine/src/` at the exact Core base.

| Topic | Existing authoritative decision and exact reference | Missing decision / implementation | Decision, alternatives and dependency |
| --- | --- | --- | --- |
| Ownership and failure | [Semantic contract](flowdoc-core-run-owned-property-semantic-contract-2026-09-14.md), sections 1, 4 and 5: Rust owns committed state; authentic capabilities; typed failures preserve state; no hidden whole-paragraph repair. | No dedicated successful empty-command outcome. `cold_session/commands.rs:264-289` rejects empty insertion before anchor/provider work. | Add `NoOp` below. Keeping rejection leaves fixed rows unsupported; minting a receipt/revision would consume identity and sibling eligibility for unchanged source. |
| Composition | Semantic contract section 2, lines 200-204: active/incomplete composition is rejected. Core `scripts/stage6/corpus.mjs`, `firstEdit`, `sustainedEdit`, `burstEdit`, generate committed empty insertion; `preflight.mjs:47-70` distinguishes this from IME. | Adapter and verifier assume successful mutations advance revision. | Keep generator and row identities; report outcome and content revision separately. No active-IME relabeling. |
| Recovery | [Implementation plan](flowdoc-core-run-owned-property-implementation-plan-2026-09-14.md), Stage6 lines 199-214, already requires no-anchor recovery. Semantic contract section 5 forbids missing-anchor mutation or hidden rebuild. | Existing missing-anchor rejection is not successful recovery. No explicit recover transition in `coldSessionStage3.ts` or `cold_session/runtime.rs`. | User selected retained-source bounded recovery. Cold Dispose/Create loses family/receipt and may exceed caps; it is not the selected mapping. Missing provider certificates remain deferred repair dependencies. |
| Eviction | Same Stage6 requirement; retained corpus `tests/fixtures/stage6/gate2a.v2.json` names `shape-plan-cache-eviction`. | Current dispose destroys authority. No evict transition. Historical runner at `d5031b6151a0a6aba2fbe2c3320f122a935470a3`, `scripts/run-incremental-boundary-gate2a-v2.mjs`, actually churns provider plans before the named row; it is workload history, not current semantic authority. | Evict real derived provider-cache content while retaining source authority; do not rename disposal or a fake flag as eviction. The exact named adversarial mapping must be validated as described below; unmatched plan-cache semantics remain explicit. |
| Cancellation | Semantic contract section 5 already requires unchanged state. Stage4 continuation's Fixed Semantics and Work Bounds plus failure-atomicity group define QA fault checkpoints, not host delivery. Core `commands.rs:712-875` prepares a response before a sole publication block; `faults.rs` is QA-only. | Synchronous adapter cannot service same-realm host events during a WASM call. Fault injection alone does not prove host cancellation. | Select the already-authorized bounded synchronous option: real host cancellation before entry and explicit late completion. It does not claim in-flight host cancellation. Cooperative steps or shared atomic transport are deferred alternatives, not new prerequisites. |
| Family and inverse join | [B1 contract](flowdoc-b1-empty-side-certificate-contract-2026-09-26.md), structural identity and accounting sections; 2026-09-27 amendment's Acceptance by responsibility. Core `cold_session/lifecycle.rs:1-65`, `commands.rs:841-855`, `structural.rs:939-1020`. | Family attempts already exist; accepted child edits currently invalidate inverse siblings. No-op and maintenance need distinct event categories. | Keep one shared family cold charge and unique attempt sum; do not sum overlapping child accepted ledgers. No-op/cache maintenance leave sibling semantics intact. |
| Geometry and gates | B1 amendment lines 17-98; run-owned implementation sequence Stage6; [Core architecture](flowdoc-core-authoritative-incremental-typing-architecture-2026-09-12.md), scheduler and Core sections. | Product geometry and presentation remain unproven. | No new geometry prerequisite for private lifecycle when preserved inputs suffice. Unchanged view/edit appearance, positions and line division, including transient frames, remain mandatory downstream. |

## 1. Exact committed no-op

The added shape is precisely `[n,n)` with empty replacement, where `n` is the
current authentic session's UTF-16 length, and composition is `committed`.
This includes an empty session (`n=0`). Interior empty requests are outside
this extension and keep their existing typed result. Equal-text nonempty
replacement is an ordinary edit; do not scan for equality to turn it into no-op.

Return `NoOp(unchangedReceipt, unchangedRevision, affectedSummary)` with
`outcomeKind: "no-op"`. The opaque TypeScript handle must be the same object,
and the Rust capability must be the same token. Preserve source, authored
presence/defaults/origins, runs, shards, source binding, provider identity,
revision, session count, sibling pair, structural maxima and accepted-mutation
ledger. No entropy, new receipt, tree publication, shaping, segmentation,
whole-source hash or full scan. Metadata accounting may change; "unchanged"
does not mean free execution.

Validation precedence is explicit, and preserves the existing outer ledger
guard: parse/schema failure; unknown/retired receipt; family recording overflow;
stale expected revision; active/incomplete composition; invalid range; shape
classification. Only then enter the no-op branch. Authenticated no-op checks
its current identity/binding and cancellation before returning. EOF is already
a scalar/grapheme boundary of valid committed source, so no seam repair is
needed. A derived-cache miss does not make committed EOF unsafe.

No authored anchor is required because no text acquires properties. If an
anchor is supplied, validate that stable authored span touches EOF using the
existing bounded tree lookup; reject an unknown/nonadjacent anchor using the
existing missing/ambiguous-anchor vocabulary. An empty session permits absent
or empty anchor only. Never invent a left/right property or consult Editor
state. Keep malformed-field rejection even when the requested change is empty.

After validation, observe cancellation at the completion checkpoint, prepare
the response and reserve actual family accounting before finalization. A
requested cancellation returns `cancelled`, not `NoOp`; overflow returns the
existing typed overflow result and separately reports unaccumulated work. A
QA provider fault is not consumed because there is no provider phase. A QA
publication-refusal fault is not a no-op publication test: no publication
occurs. Host cancellation must not reuse either of those QA fault controls.

Each completed call charges parse/authentication, anchor lookups when used,
cancellation checks, allocation/free, request/response serialization and ABI
work to the unique family attempt sum. Add a fixed-size `noOpEvents` count;
do not increment `acceptedEvents` (mutations), `rejectedAttempts`, accepted
revision totals or disposal totals for a successful no-op. Preflight the new
counter and every additive field against overflow. Source/property/provider
caps still apply to actual work; do not hard-code all counters to zero. Native
and outer Rust ABI allocation windows and host work stay distinct and complete.

An identical retry at the same receipt/revision returns another `NoOp`, records
another attempt, and creates no mutation. A retry after cancellation succeeds
only after the cancellation operation is retired and a fresh request is issued.
After another command publishes, retry with the old receipt is stale/unknown,
not idempotent success. No request-ID deduplication is implied.

The 180 burst rows and 11,271 total obligations are unchanged. A row's retained
generator ordinal is not a content revision: no-op rows retain their row ID,
ordering, timing samples, exact oracle and family charge, but expect the same
content revision/receipt. Subsequent requests use the actual live revision.
The 15 step-10 burst no-ops are not removed or renumbered; an all-successful
ordinary burst has 180 handled rows and 165 source mutations. This semantic
mapping must be encoded in the verifier, not used to reduce the denominator.

## 2. Retained-source recovery and eviction

User decision in this round: retain committed source, authored properties and
provider identity inside Rust; evict only identified derived cache; recover
within 512/512/1024 using provider-backed witnesses. No Dispose/Create substitute.

States are `Ready`, `DerivedMissing(targets)`, and `Disposed`. Availability is
separate from content revision. A bounded maintenance request authenticates the
same live receipt/revision and family. It may select only bounded derived
entries; it cannot accept caller-provided facts, certificates or replacement
source. Keep the immutable provider/resources/policy binding, persistent source,
authored spans/defaults/origins and semantic run identities authoritative in Rust.

`Evict(receipt, revision, target)` releases the selected actual derived payload
and its acceleration anchor atomically, preserving source authority and receipt.
Report `Evicted` with exact released resources/bytes and missing target identity;
an already absent target returns an explicit unchanged result. A retained alias
must not be counted as freed. For the initial implementation, a target pinned by
the B1 inverse sibling's parent snapshot returns `resource-in-use` unchanged;
do not scan/rewrite all aliases or destroy inverse eligibility to manufacture
eviction. Dispose keeps its destructive meaning and invalidates the capability.

`Recover(receipt, revision, target)` resolves the target from retained source
and stable authored/run identity even when its optional derived acceleration
anchor is absent. The retained semantic owner is not the missing derived anchor.
Re-derive the bounded missing provider facts and certify both outside edges
against authentic, revision-bound provider witnesses. A positive first fixture
can use a complete short isolated admitted run with provider-proven edges;
run/style boundaries alone are not certificates. Preserve the committed state
and cache-missing set on every failed/cancelled recovery. On success publish
only the complete derived cache replacement, return `Recovered`, and preserve
content receipt/revision, source binding and sibling identity.

A witness binds source range/content identity, authored origin/presence,
ParagraphContext, resolved run key, provider/resource/policy digest, revision
and outside dependency. It must be sufficient for the actual provider rule,
not a guessed safety flag or a retained duplicate of evicted raw glyph facts.
Missing source authority, a real missing/ambiguous authored owner, stale
binding, missing edge proof or excessive required work remains typed rejection.
Recovery cannot fabricate an authored anchor or cure an uncertifiable seam by
scanning a paragraph. Explicit whole-session cold creation is still a separate
construction cohort and cannot count as this bounded recovery.

Apply/Enter/Join may use only the derived entries they actually need. If one is
missing, return a typed `recovery-required` unchanged; no implicit recovery,
queued background mutation or whole-paragraph fallback. A no-op may complete
without unrelated cached facts after the validation above. Recovering an already
Ready target is a separately reported unchanged maintenance outcome, not a new
source revision. Keep one live family and one cold charge across eviction,
recovery, successful mutations, no-ops, rejects, Enter children and inverse join.

Maintenance charges real source/property/provider, witness validation,
allocation/free, indexing, hashing, ABI and host work once to family totals;
accepted mutation counters remain unchanged. Add checked fixed-size maintenance
event categories, no per-event history vector. Disposal charges actual final
release without erasing prior totals; publish the final compact family summary
before the final owner disappears. Structural pinning and canceled candidates
must be represented in resource accounting and cleanup checks.

### Exact Stage6 mapping

| Obligation | Eligible mapping | What does not satisfy it / exact dependency |
| --- | --- | --- |
| No-anchor recovery | Remove a real derived acceleration anchor/cache target, preserve Rust semantic authority, explicitly recover it, then execute and compare the dependent command to independent cold facts. | A missing authored anchor rejection is only a negative test. Positive recovery needs a supported bounded provider certificate; other certificate repairs remain later work. |
| Eviction lifecycle | Release a real unpinned derived shaping/segmentation cache target; prove unavailable state, rejected dependent operation, and exact recovery. | Dispose and a simulated boolean miss release the wrong thing or nothing. Pointer aliases and B1 snapshots must not hide retained payload. |
| `shape-plan-cache-eviction` named adversarial row | Keep this exact row identity and committed edit; evict the actual Rustybuzz shape plan used by its resolved analysis key, then prove a typed cache-missing result and explicit recovery. Provider plans must be genuinely reused by command shaping before eviction. | Current Rust creates a temporary plan inside `rustybuzz::shape` on each call. Shard eviction alone does not cover this row. Legacy churn across unsupported scripts cannot be replayed as live supported source; use a private explicit eviction request targeting the same plan dependency, and retain the legacy stimulus in provenance rather than silently claiming it ran. |
| Disposal/receipt lifecycle | Existing create/dispose plus stale/forged/replaced capability tests; extend to missing-cache states and actual call completion. | Recreating a session cannot preserve the old family or count as recovery. |
| Continuous family | Existing shared `Lifecycle` through Apply/Enter/Join, extended with no-op/maintenance/cancellation outcomes. | Per-child sums double-count ancestry; no reset at recovery, eviction or no-op. |
| Host cancellation | Real host pre-entry request reaches the authenticated private execution-control envelope; late delivery reports the actual completed result. | No in-flight host cancellation claim. QA fault injection, dropping a response, ignoring stale output or killing a worker is not cancellation proof. |

The exact provider delta is source-supported: locked Rustybuzz 0.20.1 exports
`ShapePlan` and `shape_with_plan`; `src/hb/shape.rs:14-24` constructs a plan for
each `shape` call, and `src/hb/ot_shape_plan.rs:9-58` defines the reusable plan
and its font/direction/script/language/features constructor. Core's
`cold_session/commands.rs:171` currently uses `shape`. Retain actual reusable
plans in a bounded Rust family-owned cache and call `shape_with_plan` for the
same verified key. Bind font digest/index/variation identity, provider version,
direction, script, language, canonical features and resolution-policy digest;
never use a plan with another face/key. Record plan construction, reuse,
eviction, pinning and recovery work explicitly. The first implementation packet
must fix cache capacity and replacement policy from the admitted profile and
its working set, with bounded lookup and no hidden warm-up; capacity is a
resource parameter, not permission to change the corpus or caps.

No caller supplies a plan. A cold-created family owns its cold plan-building
cost; an explicit recovery builds from retained immutable configuration, charges
all provider setup and validates the binding before atomic cache publication.
Provider setup without source input is still real work/latency, never a zero
cost claim. An in-flight operation pins the needed plan, so eviction returns
`resource-in-use`; afterward an actual drop must be visible. Family-local plans
avoid cross-family eviction authority. Retaining a useful provider plan removes
repeated current plan construction, rather than adding a dummy cache solely for
a test. The alternative is to retain current temporary plans, in which case
this fixed eviction obligation remains unsatisfied. This contract selects real
reusable provider-plan eviction as the implementation target under the user's
retained-derived-cache decision; no product support or speedup is claimed.

## 3. Host cancellation on the existing synchronous boundary

The existing Core architecture's Scheduler and execution realm section explicitly
permits active work to yield/cancel **or be short enough not to block a newer
revision**. Stage6 already measures the unchanged latency bounds. Therefore this
round does not introduce interruptible WASM as an additional admission gate.

Select real host cancellation before synchronous WASM entry, with honest late
semantics. The host adapter receives an optional AbortSignal or an equivalent
explicit host request, snapshots the requested cancellation immediately before
entry, and passes it through a distinct private execution-control envelope.
The semantic EditCommand remains free of QA fault flags and caller facts.
Rust authenticates the receipt/revision and checks the normal validation order
before observing the cancel control and beginning provider work. A valid
pre-entry cancelled request returns `cancelled` with unchanged authoritative
state; its actual parsing/authentication/response/ABI work is reported and charged
to the same family attempt ledger. It is not silently dropped in TypeScript.

The host control envelope is separate from `stage4_fault` or other QA injection.
Bind it to this call's authentic receipt, expected revision and a fresh opaque
operation identity. Enter and Join bind all input capabilities atomically;
recovery binds its exact missing target and provider identity. Unrelated or stale
operation identities cannot cancel another command. No persistent pending Rust
candidate or asynchronous operation handle is introduced. TypeScript retains
only compact call/completion identities and counters, never source or facts.

Once the synchronous call begins, ordinary same-realm host callbacks cannot run.
A cancellation queued during it is observed after the result: return/report
`too-late` with the actual `Accepted`, `NoOp`, `Recovered` or failed result,
never rewrite it to `cancelled`, discard an accepted receipt, or roll back source.
After a failed call this means already-completed with that failure, not an
accepted mutation. Cancellation arriving after the final gate likewise cannot
undo publication. This contract explicitly makes no in-flight host-cancellation
claim. QA checkpoints before/after providers and at publication remain useful
atomicity tests, but must be reported separately from host timing evidence.

Real host tests use actual AbortController/control delivery: already aborted
before submit; abort delivered while a request is queued but before entry;
queued abort whose callback is delayed by a synchronous call; and abort after
completion. Confirm all authentic results and exact state/capability outcomes,
including a fresh retry with a new operation identity after pre-entry cancel.
Tests must record when the host request was observed, not label a pre-armed QA
fault as a mid-call host event. Dispose is a separate final lifecycle action,
not cancellation. Reentrant callbacks into mutable Runtime remain forbidden.

Charge host queue/control/serialization costs separately and include them in
end-to-end command latency and complete family reporting without double-counting
Rust ABI work. Every Rust-entered cancellation increments rejected-attempt work;
no source revision or accepted-mutation event is added. Host requests rejected
before an authentic family is resolved report their own unattributed work.
Fatal OOM, process termination and WASM traps remain outside atomic retry.

Alternatives: cooperative Begin/Step/Finish would allow cancel between bounded
provider phases but adds candidate state, locking and scheduling; a shared atomic
token allows observation from another realm but adds shared-memory host support.
Revisit only if the owner requires interruptibility or measured synchronous work
fails the existing timing requirements and that mechanism is an appropriate
scoped remedy. A latency failure remains a Stage6 failure; this decision does
not waive it, establish a new gate or open Editor/worker implementation.

4. Exact implementation delta and acceptance

These are future Core requirements, not permission to mutate Core in this round.

1. Extend the private ordinary result union, Rust command branch, checked family
   counters and TypeScript capability handling for `NoOp`. Verify EOF nonempty
   and empty source; forged/stale/revision/composition/range/anchor precedence;
   same object/token and revision; unchanged source/facts/structure; sibling
   inverse still eligible; cancellation/overflow; repeated no-op; retry after
   an actual mutation. Measure all nonzero work and zero provider calls.
2. Add bounded derived-missing state, real eviction and explicit recovery with
   retained Rust authority. Test actual resource release, pinned rejection,
   successful short source-backed recovery, missing witness/owner/provider
   mismatch/budget rejection, failure at each pre-publication point and retry.
   Compare recovered facts to the independent oracle; verify no duplicate host
   authority, no whole-paragraph scan and same revision/family. Resolve the exact
   shape-plan implementation above before claiming that row covered.
3. Implement the private host execution-control envelope and synchronous timing
   contract. Test real host pre-entry and too-late delivery for ordinary commands,
   Enter/Join and recovery, stale operation identities and fresh retry. Retain
   provider/prepublication QA faults as distinct atomicity tests; do not claim
   in-flight host cancellation or add a new execution architecture.
4. Extend fixed-row adapters/verifiers to distinguish handled no-op from accepted
   mutation, preserve all generator inputs/IDs and 180/11,271 denominators, and
   prove exact unique family sums across create, edit, no-op, split, sibling
   operations, eviction/recovery, cancellation, join and disposal. Cold creation
   is counted once; all attempts and maintenance remain visible. Do not claim
   full corpus readiness from focused tests.
5. Run focused Rust and actual-WASM checks plus the required Core gate in the
   later implementation lane. Default exports stay private-feature free. Full
   Stage6 measurement, remaining ordinary certificates and Core geometry are
   later separately scoped rounds, not automatic continuations here.

The existing thresholds remain p95 <= 8 ms, maximum <= 16.7 ms, scaling <= 1.50;
caps 512 source / 512 property / 1024 shaping plus segmentation UTF-16. Retain
825 preparation + 4950 prepared-first + 4950 sustained + 180 burst + 6 adversarial
+ 360 cold = 11,271 obligations. This design adds no gate or threshold.

## 5. Decisions and remaining unknowns

Terminology dispositions: split content revision from generator ordinal; split
authored ownership anchor from derived acceleration anchor; split cancellation
request from QA injection; define eviction as actual derived resource release;
keep active composition distinct from committed composition-named corpus rows.

Settled: no-op scope/outcome/identity/revision/validation/accounting/retry; retained
source ownership, explicit bounded eviction/recovery and atomicity; reuse of
family accounting and B1 sibling semantics; unchanged downstream constraints.
Host timing is settled by the existing synchronous option; no user choice remains
necessary for this contract. In-flight host interruptibility is explicitly unsupported.
Blocking only for later implementation/admission: real provider-plan cache,
supported bounded witnesses, real host scheduling proof and focused executable
acceptance. Deferred: remaining certificates, full timing/heap/GC/scaling and
geometry/UX. No product PASS follows from this record.
