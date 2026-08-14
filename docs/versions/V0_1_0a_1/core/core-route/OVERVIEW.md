# Core Route

This family records the current ownership boundary between Backend HTTP-shaped
route envelopes and Core's transport-independent generation readiness,
artifact-manifest, and artifact-job contracts. It also records that the
route-shaped Core modules are absent from the public package entrypoint. Their
route source files remain internal; exported route constants and
response-helper functions carry `@deprecated`, while types and interfaces
remain unannotated.

The completed family synthesis is:

- [Core Route Ownership and Retained Contracts](route-ownership-and-retained-contracts.md)

Registration and lifecycle status belong to Project Control truth records and
the family coverage state, not this overview. The bounded `core-route` truth is
`current` while the parent Core node remains `unknown`. Coverage is closed at
Core commit `8aa0be4f662708fa75d4eb8f0f99b4784da2371c`, and cleanup Evidence is
recorded. Exactly four captured Core documents were removed:

- `docs/CORE_ROUTE_DEEXPORT_PLAN.md`
- `docs/CORE_ROUTE_DEPRECATION_WINDOW.md`
- `docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md`
- `docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md`

No other Core document deletion is authorized by this closure.
