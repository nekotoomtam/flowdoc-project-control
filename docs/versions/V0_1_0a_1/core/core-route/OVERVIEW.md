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
the family coverage state, not this overview. The bounded `core-route` truth
may be registered as `current` while the parent Core node remains `unknown`.
Neither registration nor content review authorizes source or reference
deletion; cleanup evidence remains pending until separate readiness and cleanup
gates pass.
