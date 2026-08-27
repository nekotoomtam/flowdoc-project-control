# FlowDoc Core Backend Readiness Matrix - 2026-08-27

## Scope

This matrix records the bounded Core and Backend readiness decision before the
Editor or future frontend is redesigned. It summarizes accepted Project
Control evidence, separates implementation-ready boundaries from remaining
production blockers, and names the next work lanes.

This document does not promote FlowDoc, Core, Backend, Editor, document maps,
or production readiness truth. FlowDoc remains `planned`; Core, Backend, and
Editor remain `unknown` outside the specific evidence rows below.

## Work Context

- Work path: `flowdoc-product-development-resumption > flowdoc-core-backend-readiness-matrix`
- Owner repository: `repo-project-control`
- Related repositories: `repo-core`, `repo-backend`, `repo-editor`
- Active role: `cross-repo-boundary-reviewer`
- Phase: `phase-flowdoc-core-backend-readiness-matrix`
- Checklist: `checklist-flowdoc-core-backend-readiness-matrix`
- Evidence target: `evidence-flowdoc-core-backend-readiness-matrix-2026-08-27`

## Terminology Boundary

Use the FlowDoc product terminology foundation before translating this matrix
into implementation work:

- `Document package` means the Core-owned package payload and schema-versioned
  document graph.
- `Core runtime node` means a document graph element owned by Core, not a
  Project Control Node.
- `Backend document record` means the Backend-owned service, storage, and
  transport record that can carry the current Core document package.
- `Editor draft` means browser-local editable state derived from a Backend
  document record or fixture.
- `Preview` means Editor-visible rendering or inspection. It is not export
  parity, renderer parity, Backend persistence, or product readiness evidence.
- `current`, `ready`, `compatible`, and `live` are evidence-bearing claims and
  must include exact scope.

## Decision

| Decision | Status | Boundary |
| --- | --- | --- |
| Architecture planning for the Editor/frontend redesign | GO | Safe to use this matrix for information architecture, adapter naming, state boundaries, and risk planning. |
| Core and Backend contract hardening | GO | Safe to open focused owner-repository lanes that add tests and contracts for the gaps named below. |
| Frontend implementation that assumes production Backend readiness | NO-GO | NO-GO for frontend implementation that assumes production Backend readiness, deployed service availability, production storage, auth, tenancy, workers, or export routes. |
| Broad FlowDoc product readiness promotion | NO-GO | Existing evidence does not promote FlowDoc, Core, Backend, or Editor truth beyond the bounded records below. |

## Readiness Matrix

| Area | Current evidence | Readiness class | What this supports | What remains excluded |
| --- | --- | --- | --- | --- |
| Core default owner gate | `evidence-core-default-gate-stability-review-2026-08-27`, Core commit `77b9e181d1fb43bf69d725108ede664578a07a45` | Bounded pass | Core `npm run check` is stable at the captured owner head after test-only gate fixes. | Cross-repository live compatibility, broad Core current truth, and production readiness. |
| Core runtime version contract | `evidence-core-runtime-version-contract-hardening-2026-08-27`, Core commit `992dbbbd6b6ac8f921d3dd98bd3515b77728868f` | Bounded pass | A JSON-safe version-surface inventory distinguishes active runtime, retained migration, retained evidence, and blocked surfaces. | Deleting old surfaces, proving every consumer path, or treating the inventory as a full public API freeze. |
| Core public export boundary | `evidence-core-public-export-boundary-review-2026-08-26`, Core commit `969a21ae66a3a1d6a92e5df608d23e08acb9a563` | No-go boundary | Root exports remain synchronized and visible; destructive narrowing is blocked until adoption is proven. | A narrow supported consumer surface for Backend, Editor, and future frontend work. |
| Backend Core version consumer | `evidence-backend-core-version-contract-consumer-hardening-2026-08-27`, Backend commit `6c3331217b509fc635ad25b71fba503ff066cd72` | Bounded pass | Backend wraps the Core-owned version capability and inventory instead of duplicating package version truth. | Broad Backend readiness, Editor compatibility, production service readiness, or FlowDoc map truth. |
| Backend service readiness | `evidence-backend-service-readiness-boundary-review-2026-08-27`, Backend commit `42cc1040c959a16647b7e797929358c401ccfa38` | Blocked for production | The default Backend server is development-ready and reports a bounded readiness envelope. | Production readiness for auth, tenancy, storage providers, export route mounting, workers, renderer/provider binding, deployment, TLS/proxy, rate limits, telemetry, backup, and rollback. |
| Editor live loopback harness | `evidence-editor-backend-core-live-compatibility-harness-2026-08-27`, Editor commit `16a8fde628b887624249d50a162241ef2d96a415` | Bounded pass | A Node loopback test proves Editor client to Backend server to Core read, migration, mutation, and runtime application for the minimal product report fixture. | Browser app readiness, deployed Backend compatibility, and broad document corpus coverage. |
| Editor browser live Backend smoke | `evidence-editor-browser-live-backend-smoke-2026-08-27`, Editor commit `ad0dbf7b81f483cb73c19ed28c3fd8fcbd68c6e4` | Bounded pass | Headless Chrome exercises the rendered Editor product route against a live loopback Backend for the minimal product report fixture. | Cross-browser readiness, accessibility, visual regression, npm audit remediation, bundle-size readiness, deployed Backend compatibility, and broad corpus coverage. |
| Editor browser live Backend corpus smoke | `evidence-editor-browser-live-backend-corpus-smoke-2026-08-27`, Editor commit `5cdd092265eb036be56a2d8f06e3987d0b6199d6` | Bounded pass | Headless Chrome covers the default loopback Backend corpus read, design, and migration path. | Non-default corpus, production corpus, cross-browser, accessibility, visual, performance, and deployment readiness. |
| Product terminology foundation | `evidence-flowdoc-product-terminology-foundation-2026-08-27`, Project Control commit `61413513552bba0d078b2d8e03b0b06abdbe633c` | Current control boundary | Overloaded terms are split before frontend work starts. | Runtime behavior, compatibility, product readiness, or owner repository truth. |

## Next Work Lanes

| Lane | Owner | Role | Target |
| --- | --- | --- | --- |
| Core consumer surface freeze | `repo-core` | `cross-repo-boundary-reviewer` | Define the supported Core consumer imports, subpaths, and blocked/deprecated surfaces that Backend, Editor, and the future frontend may rely on before cleanup or binding work. |
| Backend service contract hardening | `repo-backend` | `product-implementation-agent` | Turn production blockers into explicit contracts, feature flags, or deferred decisions, especially for auth, tenancy, storage providers, workers, export mounting, deployment, telemetry, backup, and rollback. |
| Editor integration boundary before redesign | `repo-editor` | `product-implementation-agent` | Define the adapter and state model from Backend document record to Editor draft and Preview before UI reconstruction begins. |

## RISK

- Local loopback evidence can hide deployed service issues such as CORS,
  reverse proxy behavior, auth, storage providers, worker orchestration, and
  TLS termination.
- Editor browser smoke evidence is useful, but it does not cover cross-browser
  behavior, accessibility, visual regression, npm audit remediation, or bundle
  size readiness.
- Core root exports are still broad. Without a Core consumer surface freeze,
  a frontend redesign can accidentally bind to surfaces that remain retained
  for migration or evidence only.
- Backend reports a bounded readiness envelope, but production service
  readiness remains blocked until the missing contracts and operating surfaces
  are owned.

## UNKNOWN

- Whether a hosted Backend, hosted frontend, real storage provider, auth,
  tenancy, workers, and export routes complete the same flows as the accepted
  local loopback evidence.
- Whether the future frontend should consume Backend document records directly
  or through an Editor-owned adapter boundary.
- Whether non-default documents and broader corpora expose Core runtime node,
  migration, mutation, Preview, or persistence gaps not present in the default
  corpus smoke.
- Whether accessibility, visual regression, performance, and bundle-size gates
  should be blocking before or after the first Editor redesign slice.

## Evidence Use

Use this matrix as a readiness decision for planning and lane selection. Do
not cite it as proof that the FlowDoc product, Backend service, Core package,
Editor app, or redesigned frontend is production-ready.

