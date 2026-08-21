# Source Authority and Commit Transaction

## Authority and Scope

This leaf owns the process-local 5B-2 source-topology, producer-invocation, work-owner, fallback-target, and Source-commit transaction seam. It preserves historical plans and design corrections as evidence, while current implementation claims are limited to the immutable Core evidence head `c503a45c03e0ce3b7a6efba2b029ca842017faa0`. Its provenance closure is **20 assigned / 20 unique / 0 missing / 0 extra / 0 drift**.

## Responsibility Boundary

The leaf records private Core authority and one Source-stage transaction only. It does not establish a generic transaction facility, a public API, Worker protocol, Editor lifecycle, Backend persistence, Root publication, or product activation. In particular, the transaction seam does not activate generic product integration.

## Producer Invocation

Producer invocation is a Core-created, frozen, one-shot authority bound to the exact previous Root, change, evidence request, source material, and work policy. It starts only for its exact request/material pair; producer work is charged in the ordered producer-owned units, binds only a registered matching runtime identity, and can be consumed only after the expected terminal outcome. The current implementation evidence is `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockUnifiedLayoutProducerInvocationAuthorityV2.ts` and its focused proof is `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockUnifiedLayoutProducerInvocationAuthorityV2.test.ts`.

## Source Topology

Source topology is a Core-owned transition concern: exact source candidates, sidecars, access records, reservations, and structural target authority stay private and identity-bound. Historical topology/rebaseline material explains why summary slices are not physical source items and why local versus complete topology cannot simply be required to match. Current implementation evidence remains bounded to `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockUnifiedLayoutSourceAuthorityInternalsV1.ts`.

## Fallback Target

The recorded fallback target is an exact, policy-bound Core path. A source-envelope or pre-binding failure fails closed before it can mint an unrelated fallback authority; a non-source post-binding limit requires its exact unconsumed evaluator authority. This topology and authority evidence does not turn fallback into a generic product recovery mechanism or a promise of product behavior.

## Evidence and Work Ownership

The owner registry fixes evidence work to Core preflight, Core materialization, producer, or Core acceptance and charges the `incrementalCandidateWork` ledger; it does not transfer Core admission or acceptance authority to the producer. The owner rows are current private implementation evidence at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockUnifiedLayoutEvidenceWorkOwnerRegistryV2.ts`, with focused verification at `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockUnifiedLayoutEvidenceWorkOwnerRegistryV2.test.ts`.

## Source Authority Internals

Source authority coordinates the exact detached ticket and the fixed CandidateWork, sidecar, Source, and Stage plans. Participant modules retain authority for their own permanent state; transaction control does not create shadow participant truth. Exact object identity—not clone, equal facts, or a matching fingerprint—is the authorization basis. The named internal seam is evidenced by `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockUnifiedLayoutSourceAuthorityInternalsV1.ts`.

## Source-commit Transaction Seam

The transaction leaf keeps a detached ticket non-live while it prepares and seals the fixed four-plan tuple. Minting validates and installs the fixed indexes before the final live write; after live, the sequential private apply steps use prevalidated, precreated state and finish by consuming the ticket. The current transaction internals and focused transaction proof are `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockUnifiedLayoutSourceCommitTransactionInternalsV1.ts` and `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockUnifiedLayoutSourceCommitTransactionV1.test.ts`. This is a named Source-stage seam, not a generic transaction or integration contract.

## Approved Amendment Precedence

The 2026-08-11 approved amendment governs conflicts with the earlier 2026-08-10 seam design only for lifecycle, owner-plan sealing, Source-access ownership, bounded post-live publication, and Stage-result identity where the current private implementation and focused transaction evidence support that amendment. Unchanged earlier design material remains historical/normative context for its unchanged scope. The earlier seam design does not override the approved amendment.

## Bilingual Terminology

The Thai and English companion terminology preserves the same authority: matching Source Commit Transaction term identifiers and exact English technical identifiers carry the same contract. A companion translation is not an independent or stronger authority source, and Thai and English companion terms have the same authority.

## State and Failure Model

Detached preparation may reject without publication. Mint failure rolls back partial private indexes; live tickets reject re-entry or replay; a post-live invariant violation is not converted into fallback or a partial accepted result. These are process-local failure rules and do not assert generic product lifecycle handling.

## Current Verified State

At the pinned Core head, the named private producer, owner-registry, source-authority, and transaction modules and their focused tests support the bounded source-authority seam. The evidence does not promote any plan/review prose into a broader current product claim.

## Known Limits and Unknowns

No claim is made for generic transactions, public exports, persistence, scheduling, cancellation, Worker use, Editor apply, Backend publication, complete traversal, or product-scale memory behavior. Broader source/flow/scene/root transitions remain outside this leaf unless separately evidenced.

## Historical Design Notes

The 5B-2 plans, corrections, and bilingual review companions record decisions, replanning, and terminology history. Their report or plan authority does not replace executable implementation authority. The approved amendment supplies the conflict rule stated above; it does not erase the historical seam record.

## Canonical Cross-references

This leaf depends on [Root and V3 Transition Contracts](root-and-v3-transition-contracts.md) and bounds its corrective history through [Corrective Evidence](corrective-evidence.md). Product ownership and activation limits remain with [Product Readiness and Renderer Boundaries](product-readiness-and-renderer-boundaries.md).

## Evidence Anchors

- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockUnifiedLayoutProducerInvocationAuthorityV2.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockUnifiedLayoutEvidenceWorkOwnerRegistryV2.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockUnifiedLayoutSourceAuthorityInternalsV1.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:src/layout/textBlockUnifiedLayoutSourceCommitTransactionInternalsV1.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockUnifiedLayoutProducerInvocationAuthorityV2.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockUnifiedLayoutEvidenceWorkOwnerRegistryV2.test.ts`
- `flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/textBlockUnifiedLayoutSourceCommitTransactionV1.test.ts`
