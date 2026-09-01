# Core Render API Planning Boundary - 2026-09-01

This record preserves the retained value and authority boundary for three Core
Render API planning documents before they are demoted into explicit Core-local
implementation context.

The boundary belongs to `flowdoc-product-development-resumption >
flowdoc-documentation-authority-cleanup` and follows the Core Markdown
classification recorded in
`docs/domains/core-repository-markdown-classification-2026-09-01.md`.

## Authority Boundary

Owner repository: Project Control for this cleanup record, with source
material owned by Core.

Scope: Core Render API planning docs boundary for
`docs/RENDER_API_CONTRACT_PLANNING_GATE.md`,
`docs/RENDER_API_RESPONSE_STATUS_CONTRACT_GATE.md`, and
`docs/RUNTIME_BINDING_IMPLEMENTATION_PLANNING_GATE.md`.

This record does not make those Core Render API planning docs active
FlowDoc-wide status, roadmap, risk, unknown, Phase, Checklist, or Evidence
authority. It does not promote Core, Backend, Editor, compatibility, frontend
readiness, FlowDoc product truth, or map truth.

## Source Snapshot

Source Core commit:
`2057a7458b1055785a516752e21d8edaa558388f`.

Source files:

- `docs/RENDER_API_CONTRACT_PLANNING_GATE.md`
- `docs/RENDER_API_RESPONSE_STATUS_CONTRACT_GATE.md`
- `docs/RUNTIME_BINDING_IMPLEMENTATION_PLANNING_GATE.md`

These files survive cleanup as Core-local implementation context because Core
tests and README references still use them as planning, pointer, and contract
gate anchors.

## Retained Value

| Source | Retained value |
|---|---|
| Render API Contract Planning Gate | Preserves the lane ranking for request envelope, response/status, render-readiness validation, artifact pointer/job status, and error/blocker vocabulary before any Render API runtime implementation. |
| Render API Response / Status Contract Gate | Preserves JSON-safe response status vocabulary, metadata-only response envelope expectations, placeholder artifact/job policy names, and routing to render-readiness validation without implementing backend routes or execution. |
| Runtime Binding / Implementation Planning Gate | Preserves the first implementation lane selection for request envelope runtime binding and keeps validation, defaults, compatibility, artifact bytes, storage, auth/authz, schema mutation, and production behavior deferred. |

## Disposition

The three Core files should remain in Core for now, but they must carry an
Authority Boundary explaining that:

- Core owns the local implementation context.
- Project Control owns FlowDoc-wide Work, Phase, Checklist, Evidence, Risk,
  Unknown, Roadmap, and cleanup state.
- The Core files are not the canonical source for cross-repository status,
  release readiness, or map truth.

Later cleanup may retire these files only after replacement Core-owned
contracts, tests, or Project Control synthesis preserve the retained value
above.

## Verification Target

The cleanup lane should add Core guards that require Authority Boundary wording
in each surviving Render API planning document and then record evidence after
Core verification passes.

This record preserves cleanup rationale only. It does not edit Core runtime
behavior by itself and does not promote Core, Backend, Editor, compatibility,
frontend readiness, FlowDoc product truth, or map truth.
