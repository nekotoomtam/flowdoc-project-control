# FlowDoc Core Run-Owned Property Implementation Plan

## Authority Boundary

Owner repository: `repo-core`.

Work: `flowdoc-frontend-expert-roadmap`.

Phase: `phase-core-text-layout-roadmap`.

Checklist: `checklist-core-text-layout-roadmap`.

Evidence target: `evidence-core-rust-paragraph-session-feasibility`.

This is a Project Control plan for a future Core-only proof and implementation
round. It follows the accepted run-owned property semantic contract. It does
not itself authorize a Core edit, accept Gate 2, change the product, open Gate
3, change Editor or Backend, create a public API, bind production behavior, or
promote map truth.

## Starting Point

The retained candidate at Core commit
`1540b7d71154e40b793c3c5ee0fffa90aa2569fc` proves some bounded same-property
edits, but property-changing Enter rebuilds a whole child. The old
paragraph-wide first-strong tuple is therefore a historical negative control,
not a source of truth for the new session.

The contract defines the required ownership chain:

```text
ParagraphContext -> AuthoredSpan -> AnalysisRun -> LayoutShard
```

All future lanes preserve the unchanged Gate 2 bounds: at most 512 UTF-16
source facts, at most 512 UTF-16 property facts, and at most 1,024 UTF-16 units
of combined shaping plus segmentation input for every admitted command. Every
lane returns a terminal handoff to PLAN. PLAN alone accepts evidence and updates
Project Control records.

## Non-Negotiable Rules

- Rust owns the only mutable committed source, run tree, shard facts, revision,
  and receipt. TypeScript may hold opaque QA handles and compact outcomes only.
- A command either publishes a complete new revision or changes nothing. There
  is no provisional browser text, background whole-paragraph repair, or
  post-publication relabeling.
- A UTF-16 surrogate split, uncertified grapheme split, active composition,
  missing seam certificate, stale receipt, cancellation, or budget exhaustion
  returns a typed non-publishing outcome with the original receipt intact.
- Every claimed local repair names its source/property windows and accounts for
  all provider work. Deferred work is counted in the same command budget.
- Any failed stage is a stop gate. It returns a narrow redesign question; it
  cannot relax thresholds or advance to a later stage.

## Delivery Sequence

| Stage | Purpose | Required result to proceed | Failure result |
| --- | --- | --- | --- |
| 1. Semantic oracle | Define exact run-owned behavior for committed source. | Fixtures distinguish accepted and rejected boundaries, and independent provider facts match the contract. | Contract gap; no mutable session. |
| 2. Derivation proof | Derive `AnalysisRun` and classify caret boundaries without publishing state. | Every fixture has a source-supported run key and boundary result. | Unsupported provider rule or ambiguous property ownership. |
| 3. Cold session | Build the Rust-owned span/run/shard session with complete accounting. | One authoritative tree, no duplicate TypeScript facts, fixed cold accounting. | Ownership or accounting failure. |
| 4. Ordinary commands | Apply insert, replace, and deletion atomically. | Exact result and bounded certificate for each admitted case. | Typed unchanged receipt. |
| 5. Structural commands | Apply head/middle/tail Enter and join over certified boundaries. | Both children publish atomically without child-wide relabel. | Typed unchanged receipt. |
| 6. Recovery and Gate 2 | Prove lifecycle and the unchanged corpus/admission limits. | Full exactness, lifecycle, latency, scaling, window and cumulative-work evidence. | Gate 2 remains blocked. |

Stages run in this order. Stages 1 and 2 are proof work; they do not create a
usable editor session. Stage 3 creates only a private Core QA session. Stages
4 and 5 do not grant Gate 3 or Editor admission. Only a PASS at Stage 6 permits
a separately reviewed next plan.

## Stage 1 — Semantic Oracle

**Scope.** Create a Core-private reference oracle whose inputs are committed
text, authored spans, paragraph context, and reviewed provider output. It must
not derive a child-wide script from the first strong character.

**Fixtures.** Same-property Enter; Thai-left/Latin-right Enter; `off|ice`;
Thai base plus combining marks; ZWJ and surrogate boundaries; RTL with changed
first-strong text; active composition; and missing seam certificate.

**Required evidence.** For every fixture, record the exact source, authored
spans, paragraph context, expected `AnalysisRun` keys, accepted/rejected
boundary, and why the result follows from the provider or a deliberately typed
fallback. A full-paragraph reconstruction is allowed only as a reference
oracle; it cannot prove bounded foreground repair.

**Exit gate.** Every fixture is classified. The Thai/Latin and `off|ice` cases
have a defined expected result. Composition and uncertified Unicode boundaries
have an exact unchanged-receipt result.

**Recommended WORK model.** `gpt-6-astra`, high effort. This is the semantic
authority step: Unicode, shaping-provider behavior, text ownership, and
fixture meaning must agree. Escalate to maximum only if the provider exposes
contradictory facts that require a contract revision.

## Stage 2 — Run Derivation and Boundary Classifier

**Scope.** Implement no mutable session. From the Stage 1 inputs, derive
`AnalysisRun` descriptors and a classifier returning `scalar-safe`,
`grapheme-safe`, `composition-safe`, or a precise `not-admissible` reason.

**Required evidence.** Tests demonstrate that authored spans do not change as
runs are split or merged; an arbitrary Latin seam does not assume word
boundaries; Thai and combining cases never receive invented safety; and
paragraph direction remains distinct from per-run script facts.

**Exit gate.** The derivation produces the Stage 1 oracle result for every
fixture, and every rejection has no partial output. Any boundary without
provider-backed support remains rejected.

**Recommended WORK model.** `gpt-5.6-terra`, high effort. This is bounded
Rust/TypeScript test and data-flow work after the semantic answer is fixed.
Escalate to GPT-6 only if implementation exposes a semantic contradiction.

## Stage 3 — Cold Rust-Owned Session

**Scope.** Create private `CreateSession(ParagraphContext, AuthoredSpan[])`
construction with immutable source references, a balanced run tree, layout
shards, opaque receipts, and counters for all traversal, provider, allocation,
and ABI work.

**Required evidence.** Rust is the sole mutable owner; TypeScript has no
second text/fact tree; session construction preserves the Stage 2 descriptors;
receipt identity cannot be caller-forged; and cold work is reported separately
from command work.

**Exit gate.** Exact source and semantic fixture equality from a cold session,
complete accounting, clean disposal, and no hidden full-paragraph fallback.

**Recommended WORK model.** `gpt-5.6-terra`, high effort. The task is
contained systems implementation with detailed ownership tests. Escalate to
GPT-6 if Rust/WASM ownership or ABI constraints invalidate the contract.

## Stage 4 — Ordinary Atomic Commands

**Scope.** Add private `Apply(receipt, EditCommand)` for append, backspace,
middle insert, replacement, and deletion. The command plans, validates,
certifies seams, path-copies descriptors, then publishes once.

**Required evidence.** Exact before/after source and facts; counter evidence
for source/property/shaping work; stale receipt, cancellation, missing anchor,
budget exhaustion, and invalid boundary tests proving byte-for-byte unchanged
session state; and no command creates a second authority in TypeScript.

**Exit gate.** All admitted ordinary commands meet the fixed work limits and
all rejection paths preserve the old receipt and revision.

**Recommended WORK model.** `gpt-5.6-terra`, high effort. The command protocol
is mechanical once stages 1–3 are accepted. Escalate only for a new atomicity
or provider-seam question.

## Stage 5 — Structural Atomic Commands

**Scope.** Add Enter at head, middle, and tail plus its inverse join where a
certified seam exists. Test same-property and Thai-left/Latin-right children,
arbitrary Latin splits such as `off|ice`, empty children, RTL-sensitive cases,
and the non-admissible outcomes from Stage 1.

**Required evidence.** `SeamCertificate` records both inspected ranges, run
keys, repaired facts, edge summaries, unchanged facts, and all charged work.
Enter either publishes two child sessions from one revision or leaves the
parent unchanged. No child ever inherits a paragraph-wide script label.

**Exit gate.** The property-changing Enter fixture has a bounded certificate;
otherwise this stage returns `not-admissible(uncertified-seam)` and Gate 2
stays blocked.

**Recommended WORK model.** `gpt-6-astra`, high effort. This is the highest
semantic-risk implementation: structural atomicity meets mixed-script shaping
and a strict cost proof. Escalate to maximum only for an evidence-backed
contract ambiguity, never merely to attempt a broader fallback.

## Stage 6 — Recovery and Unchanged Gate 2

**Scope.** Test no-anchor recovery, eviction, cancellation, disposal, receipt
lifecycle, and the fixed 180-revision corpus with ordinary and structural
commands. Apply the existing p95, maximum, scaling, window, and cumulative-work
limits without edits.

**Required evidence.** Immutable raw measurements, independent exact oracle,
all provider/host work accounted, retained failure data, and clean Core gate.

**Exit gate.** PASS requires every corpus case and the existing admission gate.
A single semantic, bound, latency, scaling, lifecycle, or accounting failure is
BLOCKER and prevents Gate 3, Editor, public API, production binding, and map
promotion.

**Recommended WORK model.** `gpt-5.6-sol`, high effort, with a separate
`gpt-6-astra` review only if evidence contradicts the earlier semantic stages.
The primary work is reproducible measurement and verification, where a strong
workhorse is more suitable than using the largest model by default.

## Review and Dispatch Rules

Each stage is one or more separately registered real Core WORK rooms, never an
internal subagent. Before each room starts, PLAN records its chosen model,
effort, task-specific reason, availability, escalation trigger, exact Core
starting commit, required tests, evidence target, and automatic return command.

PLAN accepts one terminal handoff at a time. A result is accepted only after
the automatic return arrives, the exact commit and repository cleanliness are
verified, the required tests are reproduced, and its claims stay inside that
stage. A missing handoff, unverified measurement, changed threshold, or scope
expansion is `RISK` or `BLOCKER`, never an inferred PASS.

The Core candidate remains retained until a later passing implementation is
independently verified and merged. This plan does not authorize deletion of the
candidate, cleanup of its worktree, documentation promotion, or a system-map
change.

## Immediate Next Work

Open only Stage 1 as a Core semantic-oracle WORK lane. It must define the
fixture table and provider-backed expected facts, then return PASS, BLOCKER,
RISK, or UNKNOWN. PLAN must not dispatch Stage 2 until Stage 1 is accepted.
