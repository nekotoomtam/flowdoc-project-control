# Core Runtime Plan Boundary - 2026-09-01

This record preserves the retained value and authority boundary for four Core
runtime plan documents before they are demoted into explicit Core-local
implementation context.

The boundary belongs to `flowdoc-product-development-resumption >
flowdoc-documentation-authority-cleanup` and follows the Core Markdown
classification recorded in
`docs/domains/core-repository-markdown-classification-2026-09-01.md`.

## Authority Boundary

Owner repository: Project Control for this cleanup record, with source
material owned by Core.

Scope: Core runtime plan docs boundary for
`docs/BACKEND_GENERATION_RUNTIME_PLAN.md`,
`docs/FRONTEND_AUTHORING_RUNTIME_PLAN.md`,
`docs/KEY_REGISTRY_BINDING_PLAN.md`, and
`docs/LIVE_LAYOUT_AND_EXACT_GENERATION_PLAN.md`.

This record does not make those Core runtime plan docs active FlowDoc-wide
status, roadmap, risk, unknown, Phase, Checklist, or Evidence authority. It
does not promote Core, Backend, Editor, compatibility, frontend readiness,
FlowDoc product truth, or map truth.

## Source Snapshot

Source Core commit:
`3edd2fe81cf5d9554187cebbe67535204b87a72a`.

Source files:

- `docs/BACKEND_GENERATION_RUNTIME_PLAN.md`
- `docs/FRONTEND_AUTHORING_RUNTIME_PLAN.md`
- `docs/KEY_REGISTRY_BINDING_PLAN.md`
- `docs/LIVE_LAYOUT_AND_EXACT_GENERATION_PLAN.md`

These files survive cleanup as Core-local implementation context because Core
tests and README references still use them as narrow contract and historical
direction anchors.

## Cleanup Result

Core cleanup commit `2057a7458b1055785a516752e21d8edaa558388f` adds Authority
Boundary wording to the four runtime plan documents and adds a Core
documentation authority guard in `tests/coreDocumentationAuthority.test.ts`.

Core tracked and visible Markdown counts remain 339 files. This lane demotes
surviving runtime plan docs into bounded Core-local context; it does not delete
them.

## Cleanup Housekeeping

Post-merge cleanup leaves
`C:/Users/nekot/Documents/GitHub/fd-core-runtime-plan-boundary-0901` on disk.
Git no longer lists it as a Core worktree and branch
`fd-core-runtime-plan-boundary-0901` was deleted, but `git worktree remove`
failed with `Filename too long`.

The folder is a cleanup blocker only. It is not an active worktree or unmerged
branch.

## Retained Value

| Source | Retained value |
|---|---|
| Backend Generation Runtime Plan | Separates backend generation runtime from browser editing, preserves request/response direction, readiness-only baseline, route-safe response-adapter boundary, deterministic generation expectations, and non-goals such as active browser editing and generated-output-as-template mutation. |
| Frontend Authoring Runtime Plan | Preserves the browser authoring runtime boundary: editable session shape, normalized editor view, IME and Thai typing constraints, rich text return list, live layout ownership, and save/checkpoint boundaries. |
| Key Registry Binding Plan | Preserves package key registry, inline field reference, scalar data snapshot, binding diagnostics, derived runtime view, and future key-history boundary without promoting hidden submission/reviewer or collection behavior. |
| Live Layout And Exact Generation Plan | Preserves the split between responsive live layout and deterministic exact generation, including dirty-scope layout impact, viewport-first rendering, settling model, and export-readiness limits. |

## Disposition

The four Core files should remain in Core for now, but they must carry an
Authority Boundary explaining that:

- Core owns the local implementation context.
- Project Control owns FlowDoc-wide Work, Phase, Checklist, Evidence, Risk,
  Unknown, Roadmap, and cleanup state.
- The Core files are not the canonical source for cross-repository status or
  release readiness.

Later cleanup may retire these files only after replacement Core-owned
contracts, tests, or Project Control synthesis preserve the retained value
above.

## Verification Target

The cleanup lane should add Core guards that require Authority Boundary wording
in each surviving runtime plan document and then record evidence after Core
verification passes.

Verification completed after Core commit
`2057a7458b1055785a516752e21d8edaa558388f`: focused Core documentation
authority guard, Core docs check, Core full check, and merged-main Core checks
passed.

This record preserves cleanup rationale only. It does not edit Core runtime
behavior by itself and does not promote Core, Backend, Editor, compatibility,
frontend readiness, FlowDoc product truth, or map truth.
