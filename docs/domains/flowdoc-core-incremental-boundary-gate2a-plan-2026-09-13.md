# Core Incremental Boundary Gate 2A Plan

## Authority Boundary

Owner: `repo-project-control`

Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap`

PLAN task: `01a08a25-13d9-7090-8d91-1c32242988d8`

Active roles: `planning-partner`, `project-control-steward`,
`cross-repo-boundary-reviewer`, and `evidence-reviewer`

Phase: `phase-core-text-layout-roadmap`

Checklist: `checklist-core-text-layout-roadmap`

Gate 2A checklist item: `incremental-boundary-lifecycle-admission`

Evidence target: `evidence-core-incremental-boundary-lifecycle-admission`

This Project Control document records the user-approved continuation after the
Gate 2 `BLOCKER`. It owns the lifecycle and measurement decision for one
Core-only experimental round. Core owns its implementation and tests. This
plan does not authorize line reflow, geometry, pagination, Editor, Backend,
Node-count work, production binding, public export changes, UX acceptance, or
map promotion.

## Starting evidence

Gate 2 ended at clean Core commit
`064d84422ce10855cf5c85ee04fa2e8a03113944`. Its exact and bounded mechanism
passed, but final admission was blocked by six Latin 8,192-to-256 p95 ratios
above 1.50 and one mixed 8,192 append maximum of 17.4971 ms above 16.7 ms.

A preserved diagnostic using an authentic retained chain measured Latin
composition commit at 0.3723 ms p95 for 256 UTF-16 units and 0.3767 ms for
8,192 units, a 1.012 ratio. This supports separating runtime preparation,
paragraph preparation, prepared first edit, and sustained edits. It does not
override the fixed Gate 2 blocker or prove that cold setup is the only cause.

## Gate 2A question

Can a Core-owned lifecycle make every input-facing edit use an already
prepared retained paragraph session, while keeping first-edit and sustained
work exact, bounded, below the existing latency limits, and stable across
paragraph sizes?

## Lifecycle contract

The candidate separates four states:

1. `prepareRuntime`: load or retain the pinned WASM, font, runtime identity,
   and bounded ShapePlan cache once per engine runtime.
2. `prepareParagraph`: build the initial retained text, paragraph properties,
   fact indexes, and caret-local cursor once per paragraph revision root.
3. `applyPreparedEdit`: apply the edit, select one bounded context window,
   shape and segment it, validate the two-anchor certificate, and splice facts.
4. `dispose` or explicit rebuild: release bounded retained state or rebuild
   after an edit that invalidates paragraph properties.

`applyPreparedEdit` must not initialize the runtime, build a ShapePlan, create
a paragraph session, materialize complete text, or silently rebuild paragraph
properties. A call before readiness returns an explicit typed `not-ready`
result without mutating the revision. A property-changing edit returns the
existing explicit rebuild fallback.

## Phase A: causal diagnosis before implementation

Run one controlled diagnostic from the clean starting commit. Use the same
Thai, Latin, and mixed text construction and the same six edit operations as
Gate 2. Compare:

- cold runtime plus cold paragraph per sample;
- retained runtime plus cold paragraph per sample;
- retained runtime and paragraph at prepared first edit;
- one authentic retained session for 180 edits.

Record allocation count and bytes when available, garbage-collection or wall
pause markers, ShapePlan builds and cache hits, text-tree depth, leaves and
index nodes touched, offset-index reads, WASM input/output bytes, and each
foreground phase duration. Balanced case order must prevent every large case
from always running after every small case. The diagnostic must identify a
supported owner for the scaling or tail cost before implementation. If it
cannot, return `UNKNOWN` or `BLOCKER`; do not label the result noise.

## Phase B: one evidence-led repair

Implement only the smallest supported repair family:

- preparation ownership and reuse when initialization or cache construction is
  the demonstrated owner;
- caret-local cursor plus a fused tree traversal when repeated index walks are
  the demonstrated owner;
- bounded reusable transport buffers and delta-only output when allocation or
  WASM result transfer is the demonstrated owner.

More than one family requires a PLAN Contract Change Request with diagnostic
evidence. Cache eviction must return a typed fallback; it must not build a plan
inside `applyPreparedEdit`. V1 behavior, public entry points, and the retained
Gate 2 evidence remain unchanged.

## Fixed Gate 2A corpus

- Languages: Thai, Latin, and mixed Thai/Latin.
- Sizes: 256, 1,024, 2,048, 4,096, and 8,192 UTF-16 units.
- Operations: append, backspace, middle insertion, selection replacement,
  composition update, and composition commit.
- Five warmups and 50 measured repetitions for each fixed case.
- One prepared first-edit sample series per fixed case.
- One authentic 180-revision mixed burst using one prepared session.
- Existing adversarial surrogate, property, stale revision, identity, anchor,
  and cache-eviction cases.
- One preserved cold stress series reported separately from input-facing
  admission; it cannot replace or be averaged into prepared-edit results.

## Admission criteria

Gate 2A is `PASS` only when all criteria hold on one immutable final run:

1. Common prepared edits and prepared first edits are 100% exact against the
   full oracle; invalid or oracle-mismatch rows are zero.
2. The authentic 180-revision burst is exact with one paragraph session and no
   reset.
3. Adversarial cases use their expected explicit result and do not mutate
   revision state.
4. Paragraph preparation completes within 8.0 ms p95 and 16.7 ms maximum for
   each language and size after the engine runtime is ready.
5. Prepared first-edit and sustained-edit groups each complete within 8.0 ms
   p95 and 16.7 ms maximum.
6. The 8,192-to-256 p95 ratio for every language and operation is at most 1.50
   for prepared first edits and sustained edits separately.
7. Input-facing edits perform zero runtime initialization, paragraph-session
   creation, ShapePlan construction, complete-text materialization, scan,
   clone, freeze, serialization, hash, full shape, and full segmentation.
8. Any one WASM context is at most 512 UTF-16 units; combined shaped plus
   segmented input is at most 1,024 UTF-16 units per edit.
9. The cold stress series remains present with its own result and may be
   `BLOCKER`; no claim may hide cold readiness cost. It does not change criteria
   1-8 or authorize Editor buffering.
10. The full Core gate passes from a clean commit and an independent verifier
    proves source hashes, raw rows, fixed corpus, thresholds, measurement order,
    and summary.

No threshold may be relaxed after calibration. Preserve every calibration and
diagnostic. Run exactly one final admission measurement from the committed
source.

## WORK packet

- Dispatch set: `dispatch-core-incremental-boundary-g2a-2026-09-13`
- Room: `core-incremental-boundary-g2a-a1`
- Lane: `lane-core-incremental-boundary-g2a`
- Work Type: `product-implementation`
- Owner repository: `repo-core`
- Active role: `product-implementation-agent`
- Starting commit: `064d84422ce10855cf5c85ee04fa2e8a03113944`
- Branch: `codex/core-incremental-boundary-g2a-20260913`
- PLAN task: `01a08a25-13d9-7090-8d91-1c32242988d8`
- Expected handoff: `handoff-core-incremental-boundary-g2a-a1`
- Automatic return command: `mcp__codex_app__send_message_to_thread`
- Evidence target: `evidence-core-incremental-boundary-lifecycle-admission`
- UX applicability: not applicable because the candidate cannot publish layout
  or alter visible behavior.

### Model decision

Use `gpt-5.6-sol` with `high` reasoning effort. Gate 2 established the
cross-language correctness and Rust/WASM boundary, so this attempt is a
bounded diagnosis and one evidence-led repair with explicit counters and
immutable checks. Sol high is sufficient for multi-file TypeScript/Rust
performance work under a fixed contract and is preferred over GPT-6 for this
narrower attempt.

Escalate on the same usable WORK task only after one complete diagnostic cannot
attribute the scaling/tail cost, or when the supported repair requires a new
Rust/WASM ABI or moving paragraph-session ownership into Rust. Any escalation
retains the corpus and admission criteria and requires a PLAN-recorded model
decision. A required line, geometry, Editor, Backend, public, or production
change returns a Contract Change Request instead of expanding scope.

## Disposition

A `PASS` authorizes PLAN to draft Gate 3 for checkpointed line reflow and
retained geometry. It does not authorize Editor integration. A `BLOCKER`,
`FAIL`, `RISK`, or `UNKNOWN` preserves the candidate, evidence, and exact cause
without rerunning the final measurement or weakening the typing contract.
