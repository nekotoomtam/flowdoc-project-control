# Project Control Superpowers Retirement - 2026-09-01

## Purpose

This record closes the Project Control-local `docs/superpowers` cleanup slice
for `flowdoc-product-development-resumption >
flowdoc-documentation-authority-cleanup`.

Project Control remains the canonical home for FlowDoc-wide shared
understanding, but `docs/superpowers` is no longer the active authoring surface
for Project Control plans, specs, or shared truth. Broad plans now start from
Work, Phase, Checklist, and Evidence targets. Canonical prose lives under
`docs/domains` or `docs/versions`, and generated read models remain generated.

## Authority Boundary

This document is owned by `repo-project-control` and supports only the
Project Control documentation cleanup state for the Project Control repository.
It does not promote Core, Backend, Editor, compatibility, frontend readiness,
FlowDoc product truth, or map truth.

The cleanup source snapshot is Project Control commit
`32ca1fe1207c68710382d4198493616e0c086ec6`, where
`rg --files docs/superpowers -g '*.md'` returned 21 Markdown files.

After this cleanup, docs/superpowers contains no Markdown files after this
cleanup.

## Retained Value

One active Project Control design document moved to a canonical domain path:

| Former path | Current path | Disposition |
| --- | --- | --- |
| `docs/superpowers/specs/2026-08-12-flowdoc-project-control-design.md` | `docs/domains/flowdoc-project-control-architecture-and-gui-design-2026-08-12.md` | Retained as the active `doc-project-control-design` decision document. The original `evidence-project-control-design` record still points to the approved 2026-08-12 commit and former path as historical proof. |

The remaining Project Control `docs/superpowers` files were historical
execution traces. Their retained value is already represented by canonical
Project Control records, versioned documentation, or source commits in git
history. They are retired from the current tree rather than rewritten as active
truth.

| Retired paths | Retained authority or discard rationale |
| --- | --- |
| `docs/superpowers/plans/2026-08-12-foundation-and-gui-v1.md` | Superseded by the active Project Control overview, operating rules, schemas, tests, generated read model, and `doc-project-control-design`. The implementation trace remains available in git history. |
| `docs/superpowers/plans/2026-08-13-core-documentation-consolidation-pilot.md`; `docs/superpowers/specs/2026-08-13-core-documentation-consolidation-design.md` | Superseded by the Core `V0_1_0a_1` document map, Core migration tests, migration manifests, and registered Core route evidence. The old paths may still appear as exact historical source refs at older commits. |
| `docs/superpowers/plans/2026-08-14-core-documentation-wave-a-orientation.md`; `docs/superpowers/specs/2026-08-14-core-documentation-wave-a-orientation-design.md` | Superseded by `migrations/V0_1_0a_1/core/wave-a-orientation.json`, `tests/core-doc-wave-a-orientation.test.ts`, and the published Core family documents under `docs/versions/V0_1_0a_1/core`. |
| `docs/superpowers/plans/2026-08-14-text-engine-wasm-toolchain-artifacts-leaf.md`; `docs/superpowers/specs/2026-08-14-text-engine-wasm-toolchain-artifacts-leaf-design.md` | Superseded by `docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md` and its Document and Evidence records. |
| `docs/superpowers/plans/2026-08-14-text-engine-runtime-identity-evidence-leaf.md`; `docs/superpowers/specs/2026-08-14-text-engine-runtime-identity-evidence-leaf-design.md` | Superseded by `docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md` and its Document and Evidence records. |
| `docs/superpowers/plans/2026-08-15-text-engine-adapter-provider-leaf.md`; `docs/superpowers/specs/2026-08-15-text-engine-adapter-provider-leaf-design.md` | Superseded by `docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md` and its Document and Evidence records. |
| `docs/superpowers/plans/2026-08-20-text-engine-rustybuzz-family-closeout.md`; `docs/superpowers/specs/2026-08-20-text-engine-rustybuzz-family-closeout-design.md` | Superseded by `docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md`, `docs/versions/V0_1_0a_1/core/text-engine/OVERVIEW.md`, and their Document and Evidence records. |
| `docs/superpowers/plans/2026-08-21-template-builder-documentation-wave-1.md`; `docs/superpowers/specs/2026-08-21-template-builder-documentation-wave-1-design.md` | Superseded by the Template Builder overview and leaves under `docs/versions/V0_1_0a_1/core/template-builder`, plus their Document and Evidence records. |
| `docs/superpowers/plans/2026-08-21-live-draft-documentation-wave-2.md`; `docs/superpowers/specs/2026-08-21-live-draft-documentation-wave-2-design.md` | Superseded by the Live Draft overview and leaves under `docs/versions/V0_1_0a_1/core/live-draft`, plus their Document and Evidence records. |
| `docs/superpowers/plans/2026-08-21-text-block-documentation-wave-3.md` | Superseded by the Text Block overview and leaves under `docs/versions/V0_1_0a_1/core/text-block`, plus their Document and Evidence records. |
| `docs/superpowers/plans/2026-08-25-work-tree-phase-checklist-sqlite-projection.md`; `docs/superpowers/specs/2026-08-25-work-tree-phase-checklist-design.md` | Superseded by `docs/domains/work-tree-operating-rules.md`, `docs/domains/flowdoc-round-workflow.md`, Project Control Work/Phase/Checklist records, SQLite projection tests, and the generated read-model boundary. |

## Cleanup Result

Project Control `docs/superpowers` is retired from the current repository tree.
Historical source paths remain valid only when paired with the exact commit
that contained them. New FlowDoc-wide plans or shared documentation decisions
must use Project Control Work, Phase, Checklist, Evidence, Document, and domain
or versioned documentation records instead of recreating `docs/superpowers`.

## Evidence Boundary

This retirement is documentation-authority cleanup only. It records source
preservation and discard rationale for Project Control-local historical
execution traces. It does not delete product-repository Markdown, edit product
runtime behavior, promote product readiness, or update map truth.
