# Core Stage 2 Semantic Oracle Return — 2026-09-14

## Authority Boundary

Owner repository: `repo-core`.

Work: `flowdoc-frontend-expert-roadmap`.

Phase: `phase-core-text-layout-roadmap`.

Checklist: `checklist-core-text-layout-roadmap`.

Evidence: `evidence-core-rust-paragraph-session-feasibility`.

This is PLAN's receipt and acceptance record for a temporary Core-private proof
oracle. It does not accept a mutable text engine, Gate 2 or Gate 3, public API,
production binding, Editor or Backend integration, product UX, Node-count
performance, or map truth.

## Purpose and Use

The accepted artifact converts the approved run-owned property semantic
contract into executable fixtures before a new mutable engine is designed. It
answers one bounded question: whether reviewed evidence proves an exact local
caret seam, or whether the command must return a typed non-publishing
`not-admissible` result.

Core tests may use the oracle as a reference for later session behavior. The
future engine must not call this whole-reference oracle on the foreground edit
path or treat fixture facts as live provider integration.

## Accepted Result

PLAN received automatic handoff
`handoff-core-stage2-semantic-oracle-a3-20260914` from Core WORK task
`01a0a046-e4bb-7ef1-bc33-40daa07bf09e`. Two earlier Terra-high revisions were
returned for certificate-completeness gaps. The third attempt used GPT-6 Astra
at high effort under the recorded escalation trigger and closed the same
two-file private scope at Core commit
`c70b3e00416e38d2fd5757b9e80ee0339f60fce3`.

The oracle now requires:

- full source, authored-property, paragraph-context, provider and run binding;
- non-empty exact left and right seam partitions with scalar-safe endpoints;
- work totals derived from all immediate, repeated and deferred partitions;
- completed before and after work for source, property, shaping and segmentation;
- typed before and after edge facts and summaries bound to their fact IDs;
- exact complement coverage and matching digests for facts outside inspected ranges;
- source and property work no greater than 512, and shaping plus segmentation no greater than 1,024.

Malformed proof fails closed. The suite covers same-property Enter,
Thai-left/Latin-right Enter, `off|ice`, Thai combining marks, surrogate and ZWJ
boundaries, active composition, fixed-context first-strong changes, and missing
or malformed seam evidence.

## Verification

- WORK focused suite: 39 of 39 passed.
- WORK type-check: passed.
- WORK full Core gate: 436 files and 2,887 tests passed.
- PLAN independent focused suite: 39 of 39 passed.
- PLAN independent type-check: passed.
- PLAN independent full Core gate: 436 files and 2,887 tests passed.
- Independent adversarial review: PASS with no actionable findings.

## Remaining Boundary

The oracle validates the structure, identity, coverage and accounting of facts
supplied by a reviewed provider. It does not run or authenticate a live shaping
or segmentation provider. It also does not prove mutable-session ownership,
atomic publication, revisions, receipts, cancellation, disposal, latency or
scaling. Those remain explicit later-stage responsibilities.

The earlier blocked candidate at
`1540b7d71154e40b793c3c5ee0fffa90aa2569fc` remains a historical negative
control. Stage 3 may start only as a separate approved Core lane that consumes
these accepted fixture meanings while preserving every held product and gate
boundary above.
