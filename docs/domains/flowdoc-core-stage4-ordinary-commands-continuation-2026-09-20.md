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

PLAN then sent the Activation Notice after Project Control main commit
`76e9f3a4d1cc6751297b2a6ccdef3c46ddc9c6c1` passed the full main gate. The
first observed WORK progress established the Rust/WASM/TypeScript
responsibility split and added the smallest append contract test. Its first
focused invocation did not reach the test because the fresh worktree lacked
the locked local test runner. PLAN classified this as setup progress rather
than semantic failure and extended liveness to
`2026-09-20T07:09:24.4341866Z` for lockfile dependency provisioning and the
intended actual-WASM RED. Scope, model and all gates remain unchanged.

The first GREEN proved only the private append mechanism: actual WASM accepted
an anchored Latin append and advanced revision 0 to 1. WORK correctly retained
the accounting risk because that temporary path called cold whole-session
construction and did not expose command-only counters. PLAN did not accept or
expand from that result. It required a long-paragraph accounting/locality RED
and one complete source-grounded diagnostic.

The diagnostic found a bounded Rust-only route: use the existing final shard
as the certificate window, re-shape and re-segment that window before and after
append, compare the old facts, and publish only after the candidate is sound.
Persistent source chunks and final-node/shard replacement are internal
representation work inside the existing Stage 4 boundary, not a new product
contract. PLAN extended liveness to `2026-09-20T07:16:53.3550123Z` for this one
bounded revision. Other command groups remain held until its accounting and
locality test passes.

The bounded tail revision then passed its actual-WASM short and 600-unit append
tests. The long case reported 89 UTF-16 source facts, one UTF-16 property fact,
267 combined UTF-16 shaping plus segmentation input, zero whole-paragraph
scans, zero full serializations and zero unbounded-suffix work. This accepts a
locality checkpoint only. Allocation, tree, hash, receipt and ABI accounting,
receipt lifecycle, exact post-state and line/unsafe edge comparison remain
required; the legacy non-tail reconstruction path must be removed or reject
without mutation. PLAN extended liveness to
`2026-09-20T07:21:09.7677791Z` to complete append proof before any other
command group begins.

The same task then removed the residual cold reconstruction path and reached
three passing actual-WASM append tests. It stopped its turn with two explicit
gaps: exact post-state proof and complete response-side ABI accounting. PLAN
continued the same attempt, kept all non-append commands closed, and extended
liveness to `2026-09-20T07:26:32.0872455Z` for compact revision-bound state
digests or Rust-native inspection plus complete request/response byte and
remaining command-ledger accounting.

Append proof then completed at three passing actual-WASM tests and eleven
passing native cold-session tests. The command result reports the fixed
source/property/provider limits, zero forbidden full or suffix work, allocator,
tree-copy, hash, receipt-binding and exact ABI request/response byte counters,
plus seam, line and unsafe-edge certification. Rust-native inspection proves
the exact retained source, revision, descriptors and provider facts without
exporting them to TypeScript. Non-tail fallback now rejects unchanged. PLAN
accepted this append-only proof and extended liveness to
`2026-09-20T07:30:15.6091423Z` for the next isolated group: bounded tail
Backspace/deletion across Latin, Thai, mixed, combining, surrogate and ZWJ
boundaries. Middle edits and cross-span deletion remain closed.

The tail Backspace/deletion group then passed nine actual-WASM tests and the
same eleven native cold-session tests. It covers safe Latin, Thai and mixed
final-grapheme deletion, rejects a Thai base/combining split unchanged, and
preserves the complete command ledger and zero forbidden work. The first
provider profile rejects unsupported surrogate/ZWJ source at construction, so
those rows remain typed unsupported coverage rather than command equality.
PLAN accepted the bounded tail proof and extended liveness to
`2026-09-20T07:34:41.9239677Z` for middle insertion inside one existing stable
authored span. Span-edge anchoring, replacement and cross-span work remain
closed; middle insertion must not rewrite absolute suffix offsets.

The middle-insert test reached the intended RED: a safe 600-unit single-span
edit rejects because the current descriptors use absolute offsets whose direct
update would reindex the suffix. PLAN authorized a Rust-internal persistent
position representation. Two bounded Terra turns retained the RED and named
subtree lengths/lazy offsets as the required repair but did not attempt the
authorized revision. PLAN therefore applied the recorded reasoning-limitation
trigger, changed the same task to `gpt-6-astra` high, and renewed liveness to
`2026-09-20T07:36:25.8354498Z`. Scope, ownership, evidence target and every
acceptance limit remain unchanged.

The escalated diagnostic supersedes the earlier provisional append/tail
locality acceptance. `Source::utf16` and `tail_from` still scanned the whole
Cold source, `treePathCopies` used a literal rather than measured structural
operations, allocation measurement excluded request parsing and response
encoding, the native oracle checked only endpoints/nonempty glyphs, and the
provider counter omitted the old-window pass. PLAN reclassified those results
as `RISK`, retained their useful mechanism evidence only, and required Astra to
replace the representation and proof defects. The corrected work must measure
both old and new provider passes, all structural copies and the complete ABI
allocation window, and compare exact provider facts before append, deletion or
middle insertion can be accepted as bounded.

The persistent lookup then reached a 128-unit middle window without scanning
the paragraph. Rustybuzz marked the proposed join unsafe to concatenate. PLAN
renewed liveness to `2026-09-20T07:46:59.8768937Z` for a bounded outward search
that charges every attempted old/new provider window. An unsafe original seam
must remain an exact unchanged rejection; a separate provider-certified seam
must prove an admitted middle insert. Scalar or grapheme safety alone cannot
authorize publication.

The provider-backed middle outcomes then separated correctly: the original
all-Latin seam rejects unchanged, while an insertion inside a short Latin run
between long Thai runs succeeds and shares the suffix payload. Extending the
same exact oracle to tail deletion exposed two earlier defects: an empty run
remained after deleting the final Thai run and the paragraph-end line break was
lost. WORK pruned the empty run and repaired the new tail. Combined Stage
2/3/4 verification also exposed concurrent WASM builds sharing one output
directory; PLAN allowed test-only serialization and extended liveness to
`2026-09-20T07:53:58.0231803Z` without changing product semantics or proof
requirements.

Astra then completed the corrected persistent-position proof. An insertion
inside the short Latin run of `Thai x 300 + AB + Thai x 300` matches an
independent cold-provider oracle for source, authored descriptors, run keys,
UTF-8/UTF-16 positions, every glyph and line/grapheme fact. Native pointer
identity proves the long suffix payload is shared through ten successive
publications. Unsafe all-Latin seams reject unchanged; a provider-certified
mixed long append and exact Thai-tail deletion provide the positive cases.
Measured middle work reports source 5, property 2, provider 15 UTF-16, two
shape and four segment calls, seven tree copies, nine visits, six shared nodes
and three lazy shifts. Combined Stage 2/3/4 tests pass 71/71, native tests pass
18/18 and type-check passes. PLAN renewed liveness to
`2026-09-20T08:02:30.5132226Z` for the already-running full Core gate and held
all additional command groups.

The full Core gate then passed 438 files and 2,919 tests, the default Rust
build and feature-gated native suite passed, type-check passed, and diff
whitespace validation passed. PLAN's read-only review found fourteen changed
or new Core files, all inside the private QA adapter, cold-session Rust module,
and its tests. No production/default binding, Editor, Backend, dependency,
Markdown or map change entered the candidate. PLAN accepted this as an
internal persistent-position and certified single-span milestone only; it is
not Stage 4 acceptance. The returned risks remain authoritative: replacement,
general middle deletion, authored-edge and cross-span ownership, cancellation,
failure injection, cumulative accounting and sustained tree-height behavior
are not yet proved. PLAN instructed WORK to commit the exact verified
candidate before further implementation, then opened only nonempty replacement
and general deletion wholly inside one existing authored span and bounded
window. Liveness is renewed to `2026-09-20T08:17:56.0577415Z`; all other
command groups and later stages remain held.

WORK committed the accepted internal milestone as Core commit
`3f15275cae62917a175877f04863976ac07e7498` with a clean worktree, then began
only the authorized single-span replacement and general-deletion group. Exact
native and actual-WASM tests reached a provisional green, but explicit
auxiliary-work accounting first exposed unreported source reads, index
construction and payload copying. After those passes were charged, an 80-unit
repair rejected before provider work because the conservative total would
exceed the 512-unit cap. A fresh review then found a run-edge defect: replacing
a Thai base with a leading combining mark could publish even though the mark
joined the preceding Latin grapheme. WORK reproduced the case as a native RED
and changed unproved newly-authored run-edge edits to typed unchanged
rejection. Focused Stage 2/3/4 verification now passes 92/92 and native tests
pass 22/22. PLAN renewed liveness to `2026-09-20T08:37:00.0000000Z` only for
the repaired candidate's already-running full Core gate and checkpoint
packaging. No further command group is authorized until PLAN reviews that
result.

Before the repaired full gate could become evidence, a final current-group
regression exposed a second certificate gap. Replacing one Thai code point
inside a partial shard of a longer Thai analysis run could preserve local
shaping while still changing dictionary line facts outside the bounded
window. PLAN authorized only a fail-closed correction: a range edit must cover
the complete bounded retained analysis run, or return `uncertified-seam` with
the exact receipt, revision and state unchanged before provider work. Adjacent
context certification remains closed. The earlier full-gate process is not
evidence for this corrected candidate; WORK must rerun focused proof, review
and the full Core gate after the guard.

The corrected replacement/deletion candidate then passed the fresh full Core
gate with 438 test files and 2,941 tests, the focused actual-WASM Stage 2/3/4
matrix with 93 tests, and the native cold-session suite with 23 tests. Default
Rust check, type-check, diff validation and read-only review also passed. PLAN
reviewed the exact six-file diff and accepted it as an internal bounded
single-span replacement/deletion milestone only. It admits same-script edits
whose bounded shard covers the complete retained analysis run; unproved run
edges, script transitions, interior-run removal, whole-span removal, partial
analysis runs and oversized repairs reject with the authentic state unchanged.
The checkpoint does not accept Stage 4: authored-span edges, cross-span
ownership, cancellation/failure injection, cumulative accounting, sustained
tree height and inherited tail-repair limitations remain open. PLAN instructed
WORK to commit the exact verified candidate and stop before the next ownership
group.

The authored-ownership semantic gate passed for one narrow subset. At one
existing authored edge, an exact adjacent stable span ID directly selects the
owner of inserted text; it does not infer a property from caret side. Empty
deletion across one edge introduces no property and can preserve both
nonempty surviving spans in source order. The initial representation test
proved that materializing a same-key run copied membership in proportion to
600 versus 6,000 spans. WORK replaced that command-path payload with immutable
shared membership, then implemented an adjacent-only ownership helper that
inspects at most two spans and path-copies only the affected descriptors.

Exact native and actual-WASM tests cover left- and right-anchored Latin and
Thai insertion, one-edge deletion, unchanged missing/nonadjacent/wrong
anchors, unsafe authored cuts, cross-script seams, oversized work,
cross-edge replacement, whole-span removal, multi-edge deletion, forged and
stale commands, and full ABI allocation. Work remains constant across 300 and
3,000 unrelated suffix spans, with shared membership and untouched payload
identity. Review found one newly widened Thai dictionary-context defect:
style-separated same-script analysis runs did not isolate line facts. WORK
reproduced both directions as RED and made those cases reject before provider
work; adjacent-context certification remains closed. The final candidate
passes 119 focused tests, 29 native tests and the full Core gate with 438 test
files and 2,967 tests. PLAN reviewed the exact nine-file diff and accepted it
as an internal authored-ownership milestone only, then instructed WORK to
commit without opening another group. Liveness is renewed to
`2026-09-20T09:35:00.0000000Z` for commit receipt, Project Control recording
and the next separately gated Stage 4 group. Full Stage 4 remains blocked by
failure injection, cancellation, cumulative accounting and the retained
baseline limitations.

WORK committed the accepted authored-ownership milestone as Core commit
`5cdcca9584ff0a39c010a692493cbe05be2afdcc`, parent
`bde3a1743da73d0b7d7d0fb00b0f109f6916af6b`, and returned a clean worktree.
The next isolated Stage 4 group is failure atomicity only. It must use a
private `cold-session-qa` fault-control channel separate from `EditCommand` and
absent from default/product builds. One-shot faults bound to an authentic
receipt and revision must cover cancellation before provider work,
cancellation after bounded provider work, injected provider failure, and
refusal at the final pre-publication gate. Every case must preserve exact
source, spans, runs, shards, binding, authentic receipt, revision and live
session count, then allow a clean retry to publish exactly once. Source review
must also show that every recoverable `Result` or typed failure occurs before
the single mutation point; post-publication work may not introduce a
recoverable semantic failure. Fault controls must not become caller semantic
facts, a production export or a second authority. Cumulative work, sustained
tree height, tail-repair review and all later stages remain closed. Liveness
is reserved through `2026-09-20T10:00:00.0000000Z` for Project Control gate,
this one group and its checkpoint review.

The failure-atomicity group then implemented a separate private QA sidecar
with one authentic receipt/revision-bound fault slot. Four recoverable points
run before the sole session mutation block: cancellation before provider work,
injected provider failure after the old facts, cancellation after the bounded
old/new provider phase, and refusal after complete candidate/accepted-response
preparation. Every rejection preserves the exact session and all retained
payload identities; an unarmed identical retry publishes once. Matching
disposal clears the slot, while early rejection, another session and a wrong
binding do not consume it. The raw control channel accounts for parsing,
storage, encoding, allocation and ABI transfer without entering `EditCommand`
or the TypeScript adapter. Actual default native and WASM artifacts contain no
cold-session or fault-control exports.

Independent review found no issue in this bounded group. Native tests pass
32/32, focused Stage 2/3/4 tests pass 124/124, and the full Core gate passes
438 test files and 2,972 tests. PLAN reviewed the exact seven-file diff and
accepted it as an internal failure-atomicity milestone only, then instructed
WORK to commit without beginning another group. The claim explicitly excludes
allocator abort, process failure and WASM trap recovery. Cancellation after
provider work also does not cover the inherited later tail-repair provider
call. That path, along with the baseline append/backspace/middle accounting,
requires a dedicated audit before cumulative-work proof. Liveness is renewed
to `2026-09-20T10:45:00.0000000Z` for the commit receipt, Project Control gate
and that next separately authorized audit; repeated-edit/cumulative work
remains closed.

WORK committed the accepted failure-atomicity milestone as Core commit
`0101396c9bb08bb93022d6355ed1bd14720b6aba`, parent
`5cdcca9584ff0a39c010a692493cbe05be2afdcc`, and returned a clean worktree.
The next group is an audit-first closure of inherited ordinary-command paths,
not a new admission profile. It must re-prove append, backspace, middle insert
and final-run tail deletion against the current exact oracle and complete
source/property/provider/structural/allocation/hash/receipt/ABI accounting.
The tail case that removes the final analysis run and re-derives the previous
shard must receive its own provider-failure and cancellation checkpoints before
publication, with exact unchanged state and clean retry. Source review must
identify every provider call and auxiliary copy/index/fact pass in those paths;
literal or incomplete counters, an uncovered recoverable failure after a
provider call, or a whole-paragraph/unbounded suffix dependency is a RED and
must be corrected or rejected fail-closed. This audit does not authorize new
adjacent-context behavior, new command shapes or repeated-edit/cumulative-work
proof.

WORK committed that accepted internal milestone as Core commit
`bde3a1743da73d0b7d7d0fb00b0f109f6916af6b`, parent
`3f15275cae62917a175877f04863976ac07e7498`, and returned a clean worktree.
PLAN next isolates only the authored-ownership group required by the fixed
proof matrix: insertion at one existing authored-span edge with an exact
adjacent stable anchor, and deletion across one adjacent authored-span edge
while both surviving spans retain their stable identities and authored
meaning. Source review must establish that the accepted semantic contract
determines ownership before implementation; otherwise WORK returns one narrow
Contract Change Request. The command path must also remove or avoid work that
copies `Run.span_indexes` in proportion to the total span count before a
bounded admission decision. Multi-edge deletion, complete authored-span
removal, cross-edge nonempty replacement, adjacent-context certification and
all failure-injection or recovery work remain closed. The next authorization
may begin only after this Project Control continuation update passes its gate;
liveness is reserved through `2026-09-20T09:05:00.0000000Z` for that isolated
group.
