# FlowDoc Core Run-Owned Property Semantic Contract

## Authority Boundary

Owner repository: `repo-core`.

Work: `flowdoc-frontend-expert-roadmap`.

Phase: `phase-core-text-layout-roadmap`.

Checklist: `checklist-core-text-layout-roadmap`.

Evidence target: `evidence-core-rust-paragraph-session-feasibility`.

This is the approved Core-only semantic contract for replacing the blocked
paragraph-wide property candidate. It defines the future private session's
meaning and proof obligations. It is not implementation evidence, Gate 2
admission, a public API, Editor/Backend work, production binding, UX
acceptance, or map truth.

## Decision

The old model derives one script/direction/language tuple from a paragraph or
child paragraph's first strong character. That tuple is no longer a valid
semantic authority for the redesign. It remains historical blocker evidence
only.

The new model separates authored meaning, derived analysis, and bounded layout
facts:

```text
ParagraphContext
       │
AuthoredSpan tree ── derive ──> AnalysisRun tree ── certify ──> LayoutShard tree
```

No layer may silently substitute for the layer above it.

## 1. Semantic Ownership

### ParagraphContext

`ParagraphContext` owns only paragraph-wide facts:

- base direction and writing mode;
- paragraph-level defaults explicitly supplied by the document model; and
- stable paragraph identity used to bind an opaque session receipt.

It does not own script, language, font choice, glyph facts, break facts, or a
first-strong result that relabels the whole paragraph.

### AuthoredSpan

`AuthoredSpan` is the canonical committed document input. Each span owns:

- an immutable UTF-16 source slice;
- explicitly authored inline style and language values, when supplied;
- source order and safe structural boundaries; and
- a stable identity independent of its current tree offset.

Adjacent spans may be coalesced only when their authored meaning is identical.
An analysis or layout optimization never changes authored spans.

### AnalysisRun

`AnalysisRun` is a derived contiguous slice. It owns the resolved analysis key
required for text analysis and shaping, including script, applicable direction,
language, font selection, shaping features, and the exact context provenance
used to resolve them.

An analysis run is neither a word nor the user's authored formatting range. A
single `AuthoredSpan` may yield several analysis runs, and a run may be split at
an arbitrary certified source boundary such as `off|ice`.

### LayoutShard

`LayoutShard` is the bounded cached unit. It owns:

- a reference to immutable source inside one analysis run;
- raw glyph, cluster, break, and unsafe-boundary facts;
- the analysis-key and context provenance that certified those facts; and
- edge summaries used by a seam certificate.

Shards are implementation-sized and may change without changing authored or
analysis semantics. Rust owns all mutable trees and shard facts. TypeScript
must not retain a second mutable source, run tree, or raw-fact copy.

## 2. Boundary Rules

Every edit and Enter caret is first classified as one of:

- `scalar-safe` — it does not split a UTF-16 surrogate pair;
- `grapheme-safe` — it does not split a certified grapheme cluster;
- `composition-safe` — no uncommitted composition is being made canonical; or
- `not-admissible`.

The Gate 2 session accepts only committed source edits. A command marked as an
active or incomplete composition returns `not-admissible(composition-active)`
with unchanged revision and receipt. A later composition transaction contract
may add committed replacement semantics, but cannot make an uncommitted preedit
the canonical source by implication.

Thai, combining marks, ZWJ sequences, surrogate pairs, RTL-sensitive text, and
property changes require fixture-backed rules. The absence of a rule is not a
license to split; it is `not-admissible(uncertified-boundary)`.

## 3. Seam Certificate

A split or join that changes a run edge requires a `SeamCertificate` before
publication. The certificate names:

- left and right source ranges inspected;
- the analysis keys and paragraph context used;
- the repaired glyph, cluster, break, and unsafe-boundary facts;
- the edge summaries before and after the command; and
- proof that facts outside those ranges remain valid for the new revision.

The certificate must stay within the fixed Gate 2 budget: no more than 512
UTF-16 units of source facts, no more than 512 UTF-16 units of property facts,
and no more than 1,024 combined UTF-16 units of shaping plus segmentation
input. It must account for all work performed, including deferred work.

Core must not claim that contextual shaping is local without a provider-backed
certificate. If a provider cannot supply one at a particular boundary, Core
returns `not-admissible(uncertified-seam)`.

## 4. Private Session Protocol

The private Rust/WASM boundary carries semantic input and compact command
results only:

```text
CreateSession(ParagraphContext, AuthoredSpan[])
Apply(receipt, EditCommand)
  -> Accepted(nextReceipt, revision, affectedSummary)
  | NotAdmissible(reason, unchangedReceipt)
```

`EditCommand` names the expected receipt/revision, committed replacement or
Enter caret, and any supplied authored-span change. It never supplies a caller
invented script, first-strong tuple, raw fact set, or mutable tree snapshot.

`affectedSummary` may identify bounded ranges and counters for QA. It cannot
contain a second authoritative text store, full layout facts, or a public
rendering contract.

## 5. Atomicity

Core plans an edit against the authentic receipt, validates source and seam
rules, creates any path-copied span/run/shard descriptors, and publishes one
new revision only after all checks succeed.

`NotAdmissible`, stale receipt, cancelled work, budget exhaustion, unsafe
boundary, missing anchor, or failed property proof leaves source, trees, raw
facts, revision, and receipt unchanged. Enter either publishes both children
from the same planned revision or publishes neither child.

No fallback may show a parent property temporarily, schedule hidden
whole-paragraph repair, or create a later revision without a fresh explicit
command.

## 6. Oracle and Required Fixtures

The exact oracle is defined by committed text, authored spans, paragraph
context, and the reviewed Unicode/shaping provider result. The old
paragraph-wide first-strong tuple is a negative-control fixture, not the new
oracle.

Before implementation claims semantic readiness, Core must carry fixtures for:

| Fixture | Required decision |
| --- | --- |
| Same-property Enter | exact two-child source/facts and atomic publication |
| Thai-left / Latin-right Enter | separate run facts; no child-wide relabel |
| `off|ice` | exact recombination with a certified local seam |
| Thai base + combining marks | reject unsafe split or prove a safe boundary |
| Active composition | non-publishing unchanged receipt |
| RTL and first-strong changes | paragraph direction is distinct from script facts |
| Missing seam certificate | typed non-publishing fallback with full atomicity |

Every fixture must state whether it proves accepted behavior or rejection. A
passing eventual full-paragraph reconstruction cannot replace a bounded seam
proof.

## 7. Migration Boundary

This is a new private session model. The blocked candidate is retained for
diagnosis and comparison only. It must not be wrapped with a compatibility shim
that preserves a paragraph-wide property authority behind a run-shaped API.

The implementation may reuse independent provider primitives only after a test
proves they preserve this contract. It may not reuse the blocked child-property
derivation as source truth.

Editor, Backend, persistence, renderer geometry, public exports, production
binding, Gate 3, Node-count claims, thresholds, corpus, and map updates remain
outside this contract.

## 8. Admission Sequence

1. Build the semantic reference oracle and fixtures.
2. Prove run derivation and boundary classification without mutable session
   publication.
3. Build cold Rust-owned session construction with complete accounting.
4. Prove ordinary edits and structural Enter with atomic receipts.
5. Prove recovery, cancellation, disposal and the fixed 180-revision corpus.
6. Apply unchanged Gate 2 latency, scaling, window and cumulative-work limits.

A failed step returns evidence and stops. It cannot relax a bound, skip an
earlier semantic fixture, or advance to Gate 3.
