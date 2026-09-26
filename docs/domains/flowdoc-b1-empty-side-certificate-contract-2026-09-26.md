# B1 Stage 5 empty-side certificate decision

## Authority Boundary

Owner: Project Control (`repo-project-control`); future runtime owner: `repo-core`.
Work: `flowdoc-b1-empty-side-contract-20260926`; Phase:
`phase-flowdoc-b1-empty-side-contract-20260926`; Checklist:
`checklist-flowdoc-b1-empty-side-contract-20260926`.

Status: **reviewable proposal; owner decision pending**. This document is the
single contract/decision packet for this round, not accepted runtime semantics.
It supplements section 3 of the approved run-owned semantic contract only after
an explicit owner decision is recorded here. The older contract remains the
accepted authority until then. No implementation, Stage 5, Stage 6, Gate 2,
latency, UX, public binding or map admission follows from this design.

## Round and Markdown pre-action gate

PLAN task: `01a0de32-c1af-7fd0-866a-e886c976671f`.
Round: `b1-empty-contract-20260926-01a0de32`; registry version 3;
policy: `flowdoc-workflow-economy-v2`. Role: Project Control Steward and Planning
Partner, with Documentation Synthesizer responsibility. Classification:
Project Control canonical decision proposal. Gate authorities read: Project
Control AGENTS, documentation-authority policy, agent documentation operating
rules, role catalog and agent/skill operating model. Terminology disposition:
`define` empty side and inverse sibling join as private Core concepts;
`split` empty text facts from real validation and allocation work.

PC base: `20a55019ef5174e7241d795daae8358a1b861b80`, supplied isolated worktree
`C:/Users/nekot/.codex/worktrees/f27d/flowdoc-project-control`. Core input:
`a39e91fd671706d8217d58f4668ed45afa0d0e67`, read-only. Closed B1 discovery is
immutable input, not execution authority. Observer task
`01a0dd89-4aaf-7701-997c-7c294174187c` receives startup, decision and terminal
reports; it does not own this execution round.

Work Size: medium; Risk Tier: routine (reversible contract records; no product
mutation). PLAN maintains this decision inline. The source-review work has
discovery authority only, no separate WORK room and no child agents. Its model
decision is independently selected as `gpt-6-astra` / `medium`: endpoint,
provenance and cumulative-lineage reasoning can change the contract. Sol medium
is available but suited to deterministic execution after these decisions.
Snapshot `b1-empty-local-20260926` records host tool availability. PLAN uses the
same policy-default pair; no effort escalation is justified.

Allowed mutations: this document, its Document/Work/Phase/Checklist records,
and generated projections. The existing Work inventory count and child-ID list
in `tests/project-roadmap-work-queue.test.ts` include this fresh record; the
required gate exposed these fixed-inventory prerequisites. Forbidden: Core/product files, existing Evidence,
maps, historical execution records, Editor, Backend, B2, public exports and
production bindings. Proof Budget: zero new product Evidence, one inline
source/spec review, existing PC gate in the worktree and after integration.
Document Budget: this one canonical decision with four required records.
No Stage 4 reproof, general audit or timing run. Evidence target: source-bound
decision review below; reuse Stage 4 Evidence only for its recorded scope.

## Source-grounded findings

All Core citations below are at the pinned Core input, inspected without
mutation or test execution in this round.

- `src/layout/runOwnedSemanticOracleStage2.ts:477-515,547-551` requires two
  nonempty inspected ranges and two runs. Missing either yields
  `uncertified-seam`. This is the specific endpoint contract gap.
- `tests/runOwnedSemanticOracleStage2.test.ts:123-208` defines same-property,
  Thai/Latin, `off|ice`, unsafe-boundary, composition and RTL semantic rows.
  Reviewed fixture facts are not live Rust provider measurements.
- `cold_session/derive.rs:47-73,100-107` under
  `packages/text-engine-rust-wasm/rust-live-draft-engine/src/` rejects non-LTR
  context, empty authored spans and unsupported scripts/controls.
  `cold_session/model.rs:85-105` has paragraph identity/direction/writing mode
  but no paragraph defaults; span style/language fields are separate.
- `cold_session/commands.rs:767-867` preflights output and cumulative work,
  publishes under exclusive Runtime ownership, then finalizes accounting.
  `cold_session/command_work.rs:297-327` accumulates 91 additive fields per
  session. Neither establishes split/join lineage or endpoint certificates.
- Accepted PC semantic contract sections 1-6 require explicit paragraph
  defaults, authored provenance, provider-backed facts, complete work and
  unchanged rejection. Implementation plan Stage 5 requires head/middle/tail,
  empty children and inverse join. Interior-only success cannot close Stage 5.

Reusable input: `evidence-core-rust-stage4-multispan-cumulative-2026-09-21` at
the same Core revision. Its ordinary-command results remain accepted; its
validity explicitly excludes structural certificates and Enter/join.

## Owner decision and alternatives

**Recommendation A:** select the complete narrow contract in sections below:
explicit empty-side variant, document-supplied defaults plus preserved authored
provenance, and inverse join of the exact unchanged sibling pair only. This
meets the intended endpoint scope without expanding into arbitrary joins.

**Alternative B:** retain the current two-sided certificate and hold Stage 5
until another endpoint design is selected. This produces no endpoint PASS and
does not reduce Stage 5 acceptance to interior seams.

**Alternative C:** permit siblings to be edited before inverse join or derive
empty typing style from the adjacent run. Both need additional semantics
(conflicts, insertion affinity, ancestry merging), so require a new bounded
decision. They are not silently included in A.

Required owner decision: select A, B, or identify a change to A. The approved
request to resolve this contract authorizes preparation and review, but does
not itself select these previously undecided semantics. No response means
pending, never approval. Implementation remains closed in this round.

## Proposed semantic contract (A)

### 1. Text, authored meaning and paragraph context

For parent text T of UTF-16 length n and certified caret c, Enter produces
left T[0,c) and right T[c,n). Parent offsets and child-local offsets are bound
explicitly; c is an integer in [0,n]. At c=0 the left child is empty; at c=n
the right child is empty. For n=0, c=0 is one operation producing two distinct
empty children, not two competing head/tail interpretations.

Both children preserve base direction, writing mode and explicit document
paragraph defaults. They receive distinct fresh paragraph/session identities.
Defaults preserve absence versus explicit value and bind their version/digest;
no first-strong inference and no copying a resolved edge run key into defaults.
The private protocol must carry/validate any missing explicit defaults from
the document model; unsupported or ambiguous defaults reject before publication.
The additive private schema must preserve existing Stage 3/4 input meaning.

Nonempty authored spans are sliced without changing their authored style,
language, property presence or source order. Each slice records original span
identity and source interval; implementation IDs may be fresh but cannot
masquerade as two identical live span identities. A source span cut in two has
two child-local slices sharing immutable origin, not two unrelated authored
objects. Inverse join reconstructs original authored meaning and boundaries;
it must not coalesce distinct authored spans merely because analysis keys match.

An empty child has zero source units, zero authored text spans, zero analysis
runs and zero source-covering glyph/cluster/break facts. It separately retains
the paragraph defaults and a bound split-origin descriptor (parent identity,
revision, caret, side, and authored-edge provenance where present). Empty source
construction uses an empty span list, never a fabricated zero-length span or
analysis key. The certificate's empty facts do not imply an unstyled paragraph.
Absent authored edge on an empty parent is explicitly absent. Later insertion
and selection/typing affinity are outside this structural contract; no implicit
neighbor-style inheritance is authorized by this descriptor.

### 2. Certificate variants and admission

The certificate is tagged `interior`, `head`, `tail` or `empty-source`. It binds
the authentic input receipt/revision, command, provider/resource/policy digests,
paragraph contexts/defaults, authored origin, caret and output identities.
Both inspected source ranges are present in parent coordinates. Interior keeps
the accepted two-sided rules. At head the left range is [0,0); at tail the
right range is [n,n); empty-source has [0,0) on both sides. A zero-length side
is legal only for the matching true endpoint, not as a way to skip interior work.

Each side is tagged `empty` or `nonempty`. Nonempty carries its real analysis
key, inspected facts, before/after provider edges and outside-validity proof.
Empty carries an explicit absent run key, the bound empty origin/defaults,
empty fact collections and an endpoint-validity result. No sentinel run, guessed
font/script/language or invented provider glyph satisfies the empty side.
Provider-specific zero-length boundary sentinels, if returned by the oracle,
must be compared as endpoint metadata and not disguised as source-covering
facts; the exact provider convention must be documented by the implementation.

The nonempty edge still requires a provider-backed proof of before/after
equality or exact bounded repair, with genuine outside-range validity. Retained
proof reuse requires matching provenance/context/provider and explicit rebind
validation; an endpoint or style boundary alone is not proof. Empty-source
requires provider/configuration/context validation and the reviewed empty
boundary rule even though no text analysis key exists. Scalar/grapheme and
composition checks apply before all certificate variants.

Missing/malformed proofs, false empty tags, wrong source/context/provider,
unsafe caret, unsupported capability, budget/overflow or stale provenance
reject without publication. Preserve existing typed distinctions such as
`composition-active`, `unsafe-surrogate-pair`, `uncertified-boundary`,
`uncertified-seam` and `unsupported-font-script`; new structural rejection
names may be internal but must be deterministic and fixture-tested.

### 3. Inverse join and receipt lineage

Only the exact ordered live siblings from one successful Enter are eligible.
Rust creates a split transaction identity binding parent provenance, both child
identities and receipts/revisions, provider/defaults and original authored
partition. Both child capabilities are required. Caller-created, reversed,
unrelated, duplicate, disposed or stale capabilities cannot join.

Any accepted mutation of either child, including another Enter, invalidates
that pair's inverse-join eligibility. Rejected attempts leave eligibility and
accepted state unchanged. Supporting edited siblings is explicitly deferred.
Disposal invalidates join eligibility and leaves the surviving child valid;
its accepted ancestry must not be silently dropped from accounting.

Enter consumes the parent capability and atomically creates both children.
Child revisions are 0 in their fresh identity domains and retain immutable
parent revision/split lineage. Join consumes both child capabilities and
creates a fresh joined identity/revision 0. It restores text, paragraph defaults
and authored provenance, never resurrects an old receipt or rewinds history.
Replaying Enter/join or using the old parent receipt rejects.

Join needs a direction-specific certificate for the recombined facts; an Enter
certificate is not automatically a join proof. For `off|ice`, compare joined
`office` shaping with the independent full oracle, not concatenated glyphs of
the children. Empty-left/right/both joins still validate capabilities, origin,
defaults and endpoint facts. No unrelated adjacent paragraph join is admitted.

### 4. Independent oracle and fixture obligations

Update the semantic reference contract with an explicit endpoint variant;
do not loosen its two-sided rule globally. Test the rule independently of the
live Rust generator. Live sessions derive their own facts; TypeScript never
supplies a trusted certificate or derived facts to Rust.

For each accepted structural operation compare exact committed source,
authored property presence/origin, paragraph defaults/context, derived run
keys/provenance, glyphs, clusters, grapheme/line facts, edges and outside facts
against independently constructed full child/joined reference results. Compare
both children, including the empty child's zero structures and endpoint
metadata. Normalize only independently assigned IDs through explicit origin
mapping, never text, properties, facts or offsets. Oracle construction work is
separate QA cost; any oracle/provider work used by the live command is charged
to that command. Eventual full reconstruction is not bounded proof.

| Required case | Expected contract obligation |
| --- | --- |
| Same-property `AB`: head, middle, tail | Accept only with the appropriate certificate; exact two-child and inverse results |
| Thai/Latin `กA`: head, `ก|A`, tail | Independent child keys; no paragraph-wide relabel; all admitted commands bounded |
| `off|ice`, plus `office` head/tail | Bounded direction-specific split and join proof, including contextual shaping |
| Empty source Enter and inverse empty+empty | Two real empty children, exact defaults/provenance, real costs counted |
| Empty left/right with distinct explicit/absent defaults | Preserve authored meaning and reject tampered or mismatched provenance |
| Thai base+mark, surrogate and ZWJ unsafe cuts | Typed unchanged rejection; no invented safe seam |
| Active composition, missing/forged certificate, stale/replayed receipt | Typed unchanged rejection and measured attempt work |
| RTL/non-LTR, Hebrew and first-strong-sensitive rows | Preserve paragraph/run distinction in semantic oracle; current live profile remains typed unsupported, including an empty RTL parent |
| Long/context-sensitive seam without bounded outside proof | Typed unchanged rejection, never full repair disguised as success |
| Fault after either child candidate, receipt/output preparation or ledger preflight | No partial children/join or accepted ledger mutation |

Stage 5 cannot pass by excluding head/tail/empty or the required bounded
property-changing fixture. Unsupported RTL live shaping remains explicitly
unsupported under the accepted profile, not a live equality claim. Provider
equality for all proposed structural acceptance rows is **unknown** until a
fresh implementation and measurement round.

### 5. Atomic publication and rejected attempts

One Rust-owned transaction prepares both children or the joined session, all
receipts, structures, certificate, compact response and cumulative checks before
the sole exclusive publication point. All fallible validation, allocation and
overflow checks that can return a typed failure occur before it. Publication
and final scalar accounting must have no recoverable failure path. Existing
OOM/process/WASM trap exclusions are not widened into a retry guarantee.

On rejection the source, authored/run/shard trees, defaults, session count,
receipts/revisions, sibling eligibility and accepted cumulative ledger remain
unchanged. Temporary candidates are reclaimed; real failed-attempt validation,
provider, allocation, response and reclamation work is reported. Diagnostic
attempt/fault counters are distinct from accepted semantic state. Cancellation
before publication has the same unchanged outcome; after the publication point
the operation has completed and cannot return a contradictory rejection.

### 6. Combined caps and cumulative accounting

Per structural command, the whole transaction (both children plus certification,
or join plus certification) shares the unchanged caps: source facts <=512 UTF-16,
property facts <=512 UTF-16, combined shaping+segmentation input <=1024 UTF-16.
Repeated visits/calls and deferred work count according to the existing meter;
no per-child budget reset. No whole-paragraph fallback, child-wide relabel,
hidden certificate build, uncharged provider validation or suffix rewrite.

Empty source-covering facts contribute zero units to those fact volumes only
when zero units are actually visited. They do not imply zero endpoint checks,
ID/digest comparisons, tree/handle construction, policy/default validation,
provider invocations, allocation/free, ABI bytes, response serialization or
scalar-slot writes. Instrument every applicable existing additive field and
add explicitly defined structural counters for work not expressible there.
Zero-input provider calls still count as calls; their actual allocations and
other work remain charged. Structural gauges/maxima are reported separately
and never treated as additive work.

Proposed ledger meaning: immutable ancestry is shared once, with each accepted
command adding one unique event. If parent accepted command total is P and
Enter costs E, the sibling pair's total is P+E, not 2(P+E). Both child receipts
refer to the same immutable ancestry identity; a child summary may show its
reachable ancestry, but those overlapping totals must never be blindly summed.
An immediate inverse join of cost J yields P+E+J. Cold construction cost C
remains separately identified and counted once in total lifecycle work, not
reset or copied on split. Failed attempts remain visible in attempt/lifecycle
totals even though they do not enter the accepted-command ledger.

Distinct immutable event identity, checked additive arithmetic and authenticated
ledger binding prevent duplicated/dropped ancestry. The representation is Core's
choice; it must prove bounded access without scanning an ever-growing event
history. Tests include repeated split/inverse cycles, rejected attempts between
them, stale siblings, disposal, overflow and zero-source operations. Every
accepted delta must equal measured actual work, including response finalization
and cleanup. This is an accounting requirement, not evidence of feasibility
or performance admission. If bounded ledger management cannot be shown, stop.

## Fresh implementation kickoff (conditional, not dispatched)

After owner selection and contract review, a new PLAN creates a new v3/policy-v2
round, fresh exact Core base/worktree and one implementation WORK. No context,
room or authority is transferred from this or closed discovery rounds. Future
WORK model is selected independently from a fresh host snapshot; no inherited
model mandate. One owner implements; PLAN directly owns any subsequent read-only
verification WORK. WORK must not dispatch children.

Implementation scope must explicitly include the private Rust/WASM cold-session
code, private QA wrapper/tests, and the narrow Stage 2 reference-oracle types/
schemas/tests required for the tagged endpoint certificate and explicit defaults.
The discovery packet forbade `src/`; do not reuse that packet to authorize this
necessary oracle change. No public export, product binding or unrelated source
change is authorized. Name exact paths after fresh-base inspection.

Ordered acceptance: (1) endpoint oracle fixtures including forged-empty
rejections; (2) explicit defaults and origin preservation; (3) all required
split/join rows with independent provider equality and combined caps;
(4) atomicity, authentic receipt/revision and exact sibling rejection matrix;
(5) full additive accounting, shared lineage, empty-side costs and overflow;
(6) focused native and actual-WASM tests, affected regressions, type check and
Core's required gate. Reuse Stage 4 only within its validity; revalidate changed
behavior rather than repeat unrelated proof. Stage 6's fixed 180-revision corpus
and Gate 2 timing/scaling admission remain separate and unchanged.

Stop for owner semantic disagreement, missing provider/default authority,
unbounded edge/lineage work, changed caps, architecture/ownership/scope expansion,
or failed equality/atomicity/accounting. Return the exact failure and candidate;
do not substitute interior-only PASS or silently weaken the corpus.

## Review result and remaining state

Source/spec review: endpoint gap confirmed; source findings and proposed rules
are separated above. The proposal covers all requested cases, both publication
directions and empty-side accounting; no product Evidence or map is created.
Blocking: owner selection of A's defaults/empty provenance and exact-unchanged-
sibling semantics. Deferred to implementation: actual provider equality,
bounded structural work, defaults schema encoding, ledger representation and
counter completeness. Deferred to Stage 6: performance admission.

PC record verification and integration results are reported with exact commits
through the observer and terminal handoff after execution; this text does not
claim a gate result before it happens. A reviewable pending proposal may be
integrated as pending documentation, never as accepted product semantics.
