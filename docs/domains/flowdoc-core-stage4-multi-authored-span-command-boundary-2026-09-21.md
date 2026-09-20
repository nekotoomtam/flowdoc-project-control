# Core Stage 4 Multi-Authored-Span Command Boundary — 2026-09-21

## Authority Boundary

Product owner repository: `repo-core`.

Documentation owner repository: `repo-project-control`.

Work path:
`flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap`.

Phase: `phase-core-text-layout-roadmap`.

Checklist: `checklist-core-text-layout-roadmap` item
`incremental-boundary-rust-session-feasibility`.

Evidence target:
`evidence-core-rust-ordinary-commands-stage4-2026-09-20`.

Active roles: Planning Partner, Documentation Authority Steward and
Cross-Repo Boundary Reviewer. A later implementation lane belongs to a Core
Product Implementation Agent.

This Project Control document records the design decision required after the
Stage 4 sustained cumulative matrix stopped on a within-span backspace in a
three-`AuthoredSpan` session. It narrows the next Core repair and proof. It is
not implementation evidence, a repair authorization, Stage 4 acceptance,
Gate 2 or Gate 3 admission, a public API, Editor or Backend behavior, product
UX acceptance, Pattern semantics, Node-count readiness or map truth.

## Decision Summary

A paragraph text session may own many `AuthoredSpan` values. The number of
spans in the session does not determine whether an ordinary command is
supported.

For the first contract, one editable inline Core runtime Node owns one
`AuthoredSpan`. A `TextBlock` or paragraph session may contain many such
Nodes and spans. One visual line may also display content from many spans.
Whitespace, the absence of whitespace and visual line wrapping do not create,
split or merge an `AuthoredSpan`.

For this decision, the conversational phrase "text run" is `context-only` and
means an authored text segment. Canonical records, contracts and code should
use `AuthoredSpan`. `AnalysisRun` remains the separate derived provider term.

An ordinary Stage 4 command is classified by its mutation footprint:

- a within-span command targets one exact stable `AuthoredSpan` identity and
  its range stays inside that span;
- sibling spans may exist before and after the target and remain part of the
  same session;
- insertion, deletion, backspace and replacement do not become cross-span
  commands merely because `spans.len` is greater than one; and
- a range that actually crosses an authored-span boundary is a separate
  command shape and is not silently decomposed into multiple published
  ordinary commands.

Therefore the current rule that rejects a nontrivial range whenever the
session contains more than one span is not the selected design. Admission must
inspect the anchored command range, not the total session span count.

## Canonical Layer Meanings

The terms remain distinct:

| Layer | Meaning | Does not mean |
| --- | --- | --- |
| Core runtime Node | One editable inline document-semantic owner in this first contract. | A visual line or shaping run. |
| `AuthoredSpan` | The stable authored text segment owned by that Node, including its authored style and language meaning. | A word, whitespace-delimited token or automatic wrap fragment. |
| `AnalysisRun` | A derived contiguous slice with one resolved analysis key. | The authored Node identity. |
| `LayoutShard` | A bounded provider/layout cache unit. | A new authored segment. |
| Visual line | A layout result that may contain several Nodes, spans, runs and shards. | A structural split authority. |

One `AuthoredSpan` may yield several `AnalysisRun` or `LayoutShard` values.
Derived layers may split, join or coalesce their own representation when the
provider proof permits it. They must preserve the authored Node/span identity
and must not coalesce authored spans across Core runtime Node boundaries even
when adjacent Nodes currently have identical style and language values.

This specializes the earlier semantic-contract allowance to coalesce adjacent
spans with identical authored meaning. Under this first one-Node/one-span
contract, different stable Core runtime Node identities are different authored
meaning even when their current style and language values match. Therefore
only derived `AnalysisRun` or `LayoutShard` storage may coalesce across that
edge; the authored spans themselves may not. A future change to this identity
rule requires an explicit contract revision.

Typing text without spaces remains in the same `AuthoredSpan` while its Node
and authored properties remain the same. Typing spaces also remains in that
span. Automatic wrapping changes layout only. A paragraph break or Enter is a
structural command owned by Stage 5 and is not inferred from Stage 4 span
rules.

## Ordinary Command Resolution

Before provider work or publication, a within-span command must resolve all of
these facts against the authentic receipt and expected revision:

1. the stable target span identity exists in the current session;
2. the replacement range is wholly contained in that span, including an empty
   insertion range at an admitted boundary;
3. the command does not require an authored property owner other than the
   exact target or already admitted exact edge anchor;
4. scalar, grapheme, composition, provider seam and fixed-work-budget checks
   pass; and
5. publication can preserve every untouched sibling span identity and payload.

If those conditions hold, the command continues through the existing Stage 4
safety, locality, accounting and atomic-publication gates regardless of how
many sibling spans the session contains.

If the target is missing, ambiguous or stale, or if the range crosses one or
more authored-span boundaries without an explicitly admitted command shape,
Core returns a typed non-publishing result. The authoritative source, spans,
runs, shards, facts, revision, receipt, cumulative ledger and live-session
count remain unchanged.

Conceptually, the admission order is:

```text
authenticate receipt and revision
  -> resolve stable span anchor
  -> classify the actual range footprint
       -> wholly inside one span: ordinary within-span path
       -> exact already-admitted edge subset: its named bounded path
       -> otherwise: typed cross-span-not-supported result
  -> run existing Unicode, provider, budget and atomicity gates
  -> publish once or not at all
```

The exact private enum and reason names remain an implementation detail. The
semantic distinction between session cardinality and command footprint does
not.

## Cross-Span Selection and Mutation

A selection may eventually cover text from several Nodes and spans. That does
not authorize Stage 4 to simulate one user action by publishing a sequence of
single-span revisions.

A future general cross-span edit must have its own atomic Core document/text
transaction contract. That contract must define ordered targets, surviving or
removed span identities, property ownership for inserted text, capability
checks, provider certification, cumulative accounting and one all-or-nothing
publication result. Until that contract is approved, a general cross-span
replacement or deletion is unsupported and must leave the prior revision
unchanged.

The already evidenced adjacent authored-edge subset remains a bounded
mechanism result. It does not establish a general multi-span mutation
contract, and the next repair must not broaden it while fixing the within-span
multi-span-session blocker.

## Core Document Boundary

The private text session remains generic. It knows paragraph context, stable
authored spans, derived analysis/layout facts, receipts and commands. It does
not know Build, Preview, Pattern Studio, Structure Pattern Slot or Structure
Pattern Entry concepts.

The higher Core document transaction and capability layer decides whether a
document-semantic Node is editable and coordinates future actions that touch
several Nodes. After that layer admits an action, it may submit the exact
span-scoped text command. Future definition-versus-instance permissions can be
added there without turning the low-level text engine into a product-mode
engine.

This keeps one Core semantic authority usable by document-definition and
document-instance flows while allowing those flows to expose different
capabilities.

## Required Continuation Proof

The retained three-span sustained fixture must stay combined. It must not be
split into separate single-span sessions to avoid the failure.

The next Core revision must prove at least:

1. in `Thai prefix span + AB span + CDE span`, revision 1 append and revision
   2 inverse backspace both target the same exact span and both remain
   admissible when all existing safety and budget gates pass;
2. untouched sibling span IDs, authored properties, payload identities and
   source order remain exact;
3. the command result matches the independent cold-provider oracle and the
   stored and returned cumulative ledgers remain equal;
4. unrelated session cardinality does not change the admitted-path ledger or
   locality result for the 300- and 3,000-context fixtures;
5. stale receipt, wrong anchor, a genuinely cross-span range and every existing
   failure injection remain exact unchanged-state rejections;
6. no command-path optimization coalesces authored spans across Node
   boundaries; and
7. the remaining inverse pairs, tail chain, structural height bounds, focused
   actual-WASM proof, full Core gate and default-artifact absence checks run
   only after the blocker repair passes its focused RED/GREEN proof.

The existing fixed ceilings remain unchanged: at most 512 inspected UTF-16
source facts, at most 512 inspected UTF-16 property facts and at most 1,024
combined UTF-16 units supplied to shaping plus segmentation for each admitted
command.

## Explicitly Deferred Decisions

This decision does not define:

- a general atomic cross-span edit command;
- span removal or merging across several runtime Nodes;
- paragraph Enter/join or block ownership;
- definition-authored versus instance-authored editing capabilities;
- Pattern Studio or Structure Pattern Slot/Entry behavior;
- Editor selection, drag, caret or visible typing UX;
- public or production binding; or
- Stage 5, Stage 6/Gate 2 or later admission.

Those questions are not blockers for repairing the current within-span command
inside a multi-span session. Any implementation that needs one of them must
stop and return a separate Contract Change Request.

## Continuation State

The design blocker exposed by
`evidence-core-rust-ordinary-commands-stage4-2026-09-20` is resolved at the
semantic level by this document. Product implementation remains unstarted.
The retained uncommitted Core candidate stays evidence-bearing and must not be
patched from Project Control. A separately authorized Core WORK revision may
implement only this command-footprint correction and then resume the unchanged
sustained matrix.
