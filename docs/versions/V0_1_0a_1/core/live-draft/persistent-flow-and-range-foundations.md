# Persistent Flow and Range Foundations

## Authority and Scope

This leaf records the bounded Core foundations for persistent TextBlock flow,
retained ranges, and incremental composition. It is grounded in the 10 assigned
sources, all unchanged between frozen Core commit
`76a2f2311a898e781f53773390d47b05812911e4` and current evidence commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`: **10 assigned / 10 unique / 0 missing / 0 extra / 0 drift**. It does not establish product activation,
publication, production, Editor/Backend binding, or a performance budget.

## Responsibility Boundary

This leaf owns persistent flow-tree structure, contextual range facts, semantic
checkpoints, affected-line planning, retained-range planning, update reuse, and
the separation of incremental execution from complete-oracle QA. Geometry is an
upstream dependency; Root V2 admission and work policy are downstream
responsibilities. Structural evidence and correctness checks do not transfer
those owners or become product-speed evidence.

## Flow-tree Structure

The current Core implementation projects accepted bounded flow facts into an
immutable, process-local persistent tree. It keeps offset-independent item and
subtree identity, rejects untrusted provenance, and represents the accepted
text subset without granting serialization or publishing authority. Path-copy
updates preserve untouched node identity while rebuilding only the changed path
under the tree policy. Structural reuse is not a latency claim.

## Contextual Ranges

Contextual range work retains exact UTF-16-safe boundaries, shaping context,
and fail-closed fallback conditions. A stable bounded range remains evidence
about range construction; it does not itself position a complete layout, grant
product authority, or turn diagnostic observations into an interaction budget.

## Semantic Checkpoints

Line-aligned semantic fingerprints and prefix/suffix chains are process-local
proof facts tied to an exact retained snapshot and next request. They distinguish
semantic equality from revision-specific physical identities, validate stable
prefix/suffix conditions, and fail closed on cloning, mutation, topology drift,
or incompatible context. They do not make retained proof objects transferable
or persisted authority.

## Affected-line Planning

Retained restart checkpoints and safe contextual boundaries support a bounded
affected window and reconvergence test. The plan reports fallback when exact
text reconstruction, context, topology, safe boundaries, or bounds are not
satisfied. Affected-line planning is not per-keystroke performance proof:
diagnostic timing and work counters require separate representative measurement
before any latency claim.

## Retained Ranges

The retained snapshot keeps accepted topology, range, cluster, break, and line
checkpoint facts for one exact process-local layout. The planner maps one exact
edit into a bounded range without rerunning layout, while range execution can
splice newly established facts with retained prefix/suffix facts. A fallback is
a truthful planning/execution outcome, not a weakened correctness path.

## Update Reuse

Current tree-update behavior path-copies affected nodes, counts created work
from local facts, and reuses untouched nodes by identity. The resulting proof
keeps structural reuse separate from retained semantic equality and from
revision-specific line/fragment identity. Counters describe the covered
structural operation; they are neither heap measurements nor product latency,
frame, or interaction guarantees.

## Oracle-independent Execution

The incremental execution boundary can construct the complete next Core request
from retained plans and spliced facts, then invoke incremental acceptance
without receiving a complete next Core layout as an input. An optional complete
oracle is checked only after that construction and acceptance: the complete layout is optional QA-only comparison. It cannot construct the request, choose
reconvergence, or become a production hot-path authority. Earlier
oracle-gated range/line materialization remains QA evidence, not a conflicting
execution rule.

## State and Failure Model

Accepted results remain non-publishable and non-production. Incompatible
identity, stale/mutated proof, unsafe UTF-16 edit, source/style topology drift,
missing safe boundary, failed reconvergence, or optional-oracle divergence
fails closed or selects the documented fallback. Complete request validation,
complete shaped/break arrays, and optional materialization are explicitly
separate work; their existence does not imply a fast interactive path.

## Current Verified State

Current evidence at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockPersistentFlowTreeV1.ts`
provides the persistent-tree creation and inspection boundary. The update and
proof behavior is independently exercised by
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockPersistentFlowUpdateV1.ts`
and
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockPersistentFlowUpdateV1.test.ts`.
The persistent line-tree boundary is anchored at
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockPersistentLayoutLineTreeV1.ts`.
Focused foundation/tree checks are at
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/liveDraftMr1PersistentFlowFoundation.test.ts`
and
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockPersistentFlowTreeV1.test.ts`.

## Known Limits and Unknowns

No accepted product-scale heap/rotation policy, user-facing frame or latency
budget, cross-process hydration authority, or production scheduling behavior is
established. Complete request validation and complete fact arrays may remain
material work even where the semantic checkpoint pass is removed. This leaf
does not claim unsupported geometry, list, empty-block, spatial, table,
publication, Editor, Backend, or production capability.

## Historical Design Notes

The assigned design and implementation-plan material explains the Phase 2/MR1
sequence from complete-oracle analysis through retained planning, range
execution, composition, and persistent-tree checkpoints. That chronology is
useful context, not present authority: current executable evidence controls the
bounded statements above. The historical oracle-gated rows remain compatible
with the later oracle-independent input boundary because they refer to different
QA and execution roles.

## Canonical Cross-references

- Upstream geometry facts remain owned by [Geometry and Scene Projection](geometry-and-scene-projection.md).
- Root admission, scene/delivery policy, and the V3 boundary remain owned by [Root and V3 Transition Contracts](root-and-v3-transition-contracts.md).

## Evidence Anchors

- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockPersistentFlowTreeV1.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockPersistentFlowUpdateV1.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockPersistentLayoutLineTreeV1.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/liveDraftMr1PersistentFlowFoundation.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockPersistentFlowTreeV1.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockPersistentFlowUpdateV1.test.ts`
