# Core Stage 4 Ordinary Commands Continuation — 2026-09-20

## Authority Boundary

Owner repository: `repo-core`.

Work: `flowdoc-frontend-expert-roadmap`.

Phase: `phase-core-text-layout-roadmap`.

Checklist: `checklist-core-text-layout-roadmap` item
`incremental-boundary-rust-session-feasibility`.

Evidence target:
`evidence-core-rust-ordinary-commands-stage4-2026-09-20`.

Active role: Planning Partner. The future WORK role is Product Implementation
Agent.

This Project Control document owns the Stage 4 continuation, dispatch boundary
and acceptance plan. It does not itself authorize public API or production
binding, prove command behavior, accept Gate 2 or Gate 3, change Editor or
Backend, establish UX or Node-count readiness, or promote map truth.

## Restored State

Stage 3 is accepted at Core commit
`1c810bcab48a9d4df7a758ccbd29a4824389e349`. Rust owns the only retained cold
source, authored-span, analysis-run, layout-shard and raw-fact state for the
verified Thai/Latin provider profile. Construction has digest-bound provider
policy, opaque receipts, complete cold accounting and clean disposal.

Project Control coordination revision 226 released the completed Stage 3
scope and its Project Control/Core integration claims. The Stage 3 room and
handoff are closed. The old registered worktree is removed; one unregistered
residual directory containing build output remains a local cleanup limitation
and has no Git or acceptance authority. Core has local `core.longpaths=true`
for later worktree cleanup.

Gate 2 remains blocked. Stage 3 did not prove `Apply`, command locality,
performance admission, structural Enter/join, RTL live shaping, public or
product binding, Editor behavior, UX, Node-count behavior or map truth.

## Stage 4 Outcome

Add a private, opt-in ordinary-command protocol to the accepted Rust-owned
session:

```text
Apply(receipt, EditCommand)
  -> Accepted(nextReceipt, nextRevision, affectedSummary)
  | NotAdmissible(reason, unchangedReceipt, unchangedRevision)
```

The bounded command set is append, backspace, middle insert, replacement and
deletion. Enter, paragraph split/join, public exports, default binding and
Editor integration are excluded.

An `EditCommand` may carry the expected revision, one UTF-16 replacement
range, committed replacement text, composition state, and a stable authored
span anchor only when the accepted semantic contract requires one. It must not
carry caller-derived script, language, font, run, glyph, cluster, break,
unsafe-boundary, seam-certificate or mutable-tree facts.

When source review cannot derive one exact authored-span owner for inserted
text from existing paragraph context and stable span identity, the command
must return a typed `missing-anchor`/`ambiguous-anchor` result or WORK must
return one narrow Contract Change Request. It must not inherit an arbitrary
left/right property or recreate the blocked first-strong paragraph rule.

## Fixed Semantics and Work Bounds

One accepted command must:

- authenticate the live receipt and expected revision;
- classify scalar, grapheme and composition safety before publication;
- plan against the Rust-owned session without exporting authoritative state;
- derive provider facts inside Rust from the accepted immutable provider
  configuration;
- account for every source, property, shaping, segmentation, allocation, tree,
  hash, receipt and ABI operation, including deferred work;
- publish the complete new source/span/run/shard revision exactly once; and
- invalidate the prior receipt only after publication succeeds.

The unchanged per-command ceilings are:

- at most 512 UTF-16 units of inspected source facts;
- at most 512 UTF-16 units of inspected property facts; and
- at most 1,024 combined UTF-16 units supplied to shaping plus segmentation.

No admitted command may serialize, clone, hash, scan, shape, segment, move or
reindex the whole paragraph or an unbounded suffix. Compact QA digests,
counters and affected ranges may cross the ABI; authoritative source, trees
and raw facts may not.

Every rejection, including forged or stale receipt, stale revision, active
composition, surrogate or uncertified grapheme split, unsupported provider
coverage, missing/ambiguous anchor, cancellation, budget exhaustion or
provider failure, preserves the previous source, spans, runs, shards, raw
facts, revision, authentic receipt and live-session count byte-for-byte.

## Required Proof Matrix

The WORK lane must use tests-first development and retain RED/GREEN evidence
for these groups:

1. append and backspace in Latin, Thai and mixed Thai/Latin source;
2. middle insertion at scalar- and grapheme-safe positions;
3. non-empty replacement and forward/backward deletion;
4. deletion across authored-span edges while preserving surviving stable span
   identities and authored meaning;
5. insertion at an authored-span edge with an exact existing anchor, plus
   missing and ambiguous anchor rejection;
6. Thai base/combining-mark, surrogate and ZWJ unsafe-boundary rejection;
7. active composition, cancellation and injected budget-exhaustion rejection;
8. stale revision, forged receipt, reuse of a replaced receipt and disposal;
9. exact comparison with the accepted independent oracle through test-only
   Rust inspection or compact digests, without exposing a second TypeScript
   authority; and
10. repeated admitted ordinary edits that keep tree height bounded and report
    cumulative work without silently resetting or warming hidden state.

The implementation must preserve all Stage 2 and Stage 3 checks. Actual WASM
tests must execute the built feature; native-only mocks are insufficient.

## Stop Gates

Stop Stage 4 and return `BLOCKER` or one Contract Change Request when:

- property ownership for an ordinary command is not determined by the accepted
  contract;
- any accepted case needs whole-paragraph or unbounded-suffix work;
- complete provider/allocation/ABI accounting cannot be observed;
- a failed command mutates state or invalidates the authentic receipt;
- TypeScript must retain authoritative source or provider facts;
- the fixed work limits would have to change; or
- Stage 5 Enter/join, Gate 2 admission, Editor, public/production binding or
  another excluded scope is required to make Stage 4 pass.

A stop preserves the candidate and evidence. It does not authorize PLAN to
patch Core or advance to Stage 5.

## Model Decision

Preferred WORK model: `gpt-5.6-terra`, high effort.

Reason: Stage 1 fixed the semantics, Stage 2 fixed the oracle, and Stage 3
fixed Rust/WASM ownership and provider construction. Stage 4 is a bounded
multi-file systems implementation with strong deterministic tests. Terra high
is sufficient without using the largest model by default.

Use the model/effort capability snapshot exposed by the task host at dispatch.
If Terra is unavailable, PLAN reassesses the available list rather than
silently inheriting PLAN settings. Escalate to `gpt-6-astra` high only when a
source-backed ownership, atomicity or provider-seam contradiction survives one
complete diagnostic and one bounded Terra revision, or when a required
contract decision cannot be resolved within the existing Stage 4 boundary.
Acceptance requirements never weaken after a model change.

## UX and Product Boundary

UX applicability is `not-applicable` for this lane because it changes only an
opt-in private Core QA feature and does not alter visible product behavior.
This exemption cannot be reused by a later Editor typing lane. Key-to-visible
latency, wrapping, caret stability, IME behavior and user acceptance remain
pending until the engine passes later admission and a separately declared UX
gate.

## Dispatch and Return Boundary

Open one real Core WORK task from exact clean Core main
`1c810bcab48a9d4df7a758ccbd29a4824389e349`. Register a monitorable task ID,
isolated worktree, branch, ownership generation, model decision, twenty-minute
liveness deadline, stable handoff ID and active
`mcp__codex_app__send_message_to_thread` return command before activation.

WORK first returns a Context Acknowledgement that repeats the Stage 4 scope,
base commit, accepted contracts, stop gates, evidence target and exclusions.
PLAN activates only after recording that acknowledgement. WORK sends progress
only at meaningful TDD or blocker boundaries and sends its terminal handoff
automatically to PLAN.

PLAN accepts only after reviewing the exact commit and diff, reproducing the
focused native and actual-WASM proof, running Core type-check and the full Core
gate, confirming repository cleanliness and verifying the fixed bounds and
failure atomicity. Product-repository repair returns to the same WORK task as
a Revision Packet. PLAN alone integrates accepted output, writes Project
Control evidence, runs the main gate and performs authorized current-round
cleanup.

## Task Preparation and Context Acknowledgement

The host created one isolated Core task from exact commit
`1c810bcab48a9d4df7a758ccbd29a4824389e349`:

- task ID: `01a0bd81-dd35-7b30-94e0-9c9da761c7ba`;
- worktree: `C:/Users/nekot/.codex/worktrees/431e/flowdoc-vnext-core`;
- selected model: `gpt-5.6-terra` at high effort;
- room: `core-stage4-ordinary-commands-a1`;
- expected terminal handoff:
  `handoff-core-stage4-ordinary-commands-a1-20260920`; and
- automatic return target: PLAN task
  `01a08a25-13d9-7090-8d91-1c32242988d8` through
  `mcp__codex_app__send_message_to_thread`.

The initial task response could see only a broad local model label. PLAN used
the successful host `create_thread` request as the model/effort authority and
sent the exact selection and monitorable task ID back to the same task. WORK
then returned a corrected Context Acknowledgement through the automatic channel
confirming Terra high, the exact clean Core base, the fixed Stage 4 command and
accounting scope, all stop gates, the evidence target and the excluded Stage
5/6 and product surfaces. No product file, branch, dependency or broad test was
created during setup.

Project Control coordination revision 227 registers the task as prepared under
the existing PLAN ownership generation 1. The ownership generation does not
increment because no PLAN ownership transfer occurred; Stage number and
ownership generation are different concepts. Activation is a separate typed
transition. Coordination revision 228 records that transition after the
corrected Context Acknowledgement; WORK remains read-only until the matching
Activation Notice arrives in its task.
