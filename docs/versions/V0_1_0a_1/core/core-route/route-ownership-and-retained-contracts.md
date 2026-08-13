# Core Route Ownership and Retained Contracts

## Purpose and Scope

This document records the current Core route boundary for the `V0_1_0a_1`
documentation line. It separates executable package truth from the historical
reasoning that led to the boundary.

The scope is limited to Core generation readiness, artifact manifest and job
contracts, the Core public package entrypoint, and the ownership boundary with
Backend HTTP routes. It does not define or change Editor, GUI, Agent, or Skill
behavior, and it does not change Core runtime behavior or Backend wiring.

## Current Ownership Boundary

Backend owns the HTTP-shaped generation and artifact route envelopes. At this
boundary, that includes method handling, HTTP status and headers, and the
artifact permission, retry, listing, and download-metadata response vocabulary.
The current Core route modules identify Backend as that owner and mark their
route helpers as deprecated compatibility source.

Core owns the transport-independent contracts consumed below that envelope:
generation request parsing and readiness assessment, artifact manifest
validation/planning, and durable artifact job state transitions. Those retained
contracts explicitly do not execute a Backend route. The manifest and job plans
also record that they do not perform worker, renderer, queue, database, file, or
storage writes.

## Retained Core Contracts

The public Core entrypoint retains these contract groups:

- `src/generation/runtime.ts` exports
  `safeParseVNextGenerationRequest(...)` and
  `assessVNextGenerationReadiness(...)`. Readiness results stay
  transport-independent: they report request, package, document, key/data,
  exact-layout, and artifact state without assigning HTTP status or headers.
- `src/generation/artifactManifest.ts` exports
  `createVNextArtifactManifestPlan(...)`. It validates JSON-serializable artifact
  lifecycle records while declaring storage, database, renderer, and Backend
  route execution false.
- `src/generation/artifactJob.ts` exports `createVNextArtifactJobPlan(...)` and
  `advanceVNextArtifactJob(...)`. They create and advance durable job records
  while declaring worker, layout, renderer, storage, queue, and Backend route
  execution false.

The retained tests exercise these contracts through `src/index.ts`, including
successful and blocked readiness, manifest lifecycle validation, valid job
transitions, and invalid transition rejection.

## Public Export State

`src/index.ts` publicly re-exports `./generation/runtime.js`,
`./generation/artifactManifest.js`, and `./generation/artifactJob.js`. It does
not re-export `./generation/apiRoute.js` or
`./generation/artifactApiRoute.js`; route-shaped helpers are therefore absent
from the Core package public entrypoint.

Both route source files still exist under `src/generation/`. Their exported
route constants and response-helper functions are marked `@deprecated`; route
types and interfaces remain unannotated. All remain internal source rather than
public entrypoint exports. Their continued presence does not restore public
route ownership and does not authorize their deletion.

## Verification Anchors

| Claim | Current executable anchor |
|---|---|
| Retained readiness, manifest, and job modules are public; route modules are not | `src/index.ts` |
| Readiness is transport-independent and does not render an artifact | `src/generation/runtime.ts`; `tests/generationRuntimeRetainedContract.test.ts` |
| Manifest planning validates durable records without writes or Backend route execution | `src/generation/artifactManifest.ts`; `tests/artifactRetainedContract.test.ts` |
| Job planning and transitions do not execute workers, layout, rendering, queues, storage, or Backend routes | `src/generation/artifactJob.ts`; `tests/artifactRetainedContract.test.ts` |
| Deprecated route-shaped source remains internal after public de-export | `src/generation/apiRoute.ts`; `src/generation/artifactApiRoute.ts`; `tests/coreRouteRetainedContractRewrite.test.ts` |
| Backend owns HTTP-shaped envelope behavior at this boundary | deprecation contracts in `src/generation/apiRoute.ts` and `src/generation/artifactApiRoute.ts`, reinforced by the retained tests' exclusion of HTTP-shaped ownership |

## Risks and Unknowns

- Consumers outside the inspected repositories may have depended on the former
  route exports or may deep-import internal Core source paths. No complete
  external-consumer registry or package-usage scan is available here.
- The deprecated internal route files duplicate some HTTP vocabulary. They can
  drift from Backend behavior while they remain, so they are evidence of the
  boundary, not the current implementation authority for HTTP envelopes.
- This document does not independently revalidate Backend route implementation or
  authorize removal of any Core source or reference.

## Historical Design Notes

The four captured migration records describe a three-window design. Window A
documented the intended ownership split while the route helpers were still
public. Window B retained them for one compatibility window and added explicit
deprecation markers. Window C removed the route modules from the public
entrypoint after retained-contract tests replaced route-helper ownership tests.

The compatibility window was selected to reduce surprise breakage while
external package consumers were not fully known. Rewriting the tests first
preserved direct evidence for readiness, manifest, and job behavior without
keeping HTTP status, header, permission, retry, or download-envelope assertions
in Core. This sequence explains the current boundary; it is historical design
context, not a current rollout plan, schedule, or source-deletion instruction.

## Provenance

Current claims were checked against Core source and tests captured at commit
`76a2f2311a898e781f53773390d47b05812911e4`. The four historical inputs and
their exact Git blobs are mapped once in the
[core-route coverage record](../../../../../migrations/V0_1_0a_1/core/families/core-route/coverage.json).
Registration and lifecycle status belong to Project Control records and the
coverage state; this document does not grant them. Neither registration nor
content review authorizes deletion, and cleanup evidence remains pending until
separate readiness and cleanup gates pass.
