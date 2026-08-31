# FlowDoc Repository Markdown Inventory - 2026-08-31

## Purpose

This inventory records the first repository-wide Markdown snapshot for the
FlowDoc documentation authority cleanup. It is a Project Control source
snapshot and cleanup guide, not product evidence.

Project Control remains the canonical home for FlowDoc-wide shared
understanding. Product repositories were read-only in this inventory phase.

## Authority Boundary

This document is owned by `repo-project-control` and supports only the
documentation cleanup Work item
`flowdoc-product-development-resumption > flowdoc-documentation-authority-cleanup`.

It records tracked Markdown counts, broad authority buckets, and immediate
cleanup risks from local main checkouts. It does not prove runtime behavior,
readiness, compatibility, frontend design readiness, or product-map truth.

No product-repository Markdown is deleted by this inventory. Product-repository
cleanup still requires a separate owner phase, source preservation or discard
rationale, focused verification, and Project Control evidence registration.

## Source Snapshot

The snapshot was taken with `rg --files -g '*.md'` against clean local main
checkouts after the first Editor docs/superpowers retirement slice.

Source totals: Project Control 92 tracked Markdown files; Core 347 tracked
Markdown files; Backend 40 tracked Markdown files; Editor 57 tracked Markdown
files.

| Repository | Source commit | Tracked Markdown | Main buckets |
| --- | --- | ---: | --- |
| Project Control | `d2f2a6ed22d90639c19e103c9bcc6fa5b82a2541` | 92 | `docs/domains`: 40; `docs/versions`: 26; `docs/superpowers`: 21; other docs: 2; root entrypoints: 3 |
| Core | `5892df6e542a02b25ae3b18ee02a55842b83d48f` | 347 | repo docs: 334; `docs/superpowers`: 4; `docs/versions`: 3; entrypoint/package/example docs: 6 |
| Backend | `fd6bd6a2c35c2f0bc7a0245b17beadf86ce39e08` | 40 | repo docs: 37; `docs/superpowers`: 1; root entrypoints: 2 |
| Editor | `04daeeaaac04317508b5cf8e93de61249255d477` | 57 | repo docs: 53; `docs/superpowers`: 3; root entrypoints: 1 |

The Project Control count is the source count before this inventory document is
added. Future inventory updates should record a new source snapshot instead of
editing this row into a moving target.

Superpowers totals: Project Control docs/superpowers: 21; Core
docs/superpowers: 4; Backend docs/superpowers: 1; Editor docs/superpowers: 3.

The docs/superpowers files in Core and Backend do not yet carry Authority
Boundary wording.

## Superpowers Markdown Risk

`docs/superpowers` is the clearest high-risk Markdown family because plans and
specs there can look like active truth if they remain inside product
repositories.

| Repository | `docs/superpowers` count | Classification | Cleanup status |
| --- | ---: | --- | --- |
| Project Control | 21 | Project Control-local historical plans and specs | Keep for now; already inside the canonical control repository, but later cleanup may summarize or retire old traces. |
| Core | 4 | Product-repository historical text-block plans/specs | Migration candidate. The files do not yet carry Authority Boundary wording and must not be treated as current Core evidence. |
| Backend | 1 | Product-repository backend service hardening plan | Migration candidate. The file does not yet carry Authority Boundary wording and must not be treated as current Backend evidence. |
| Editor | 3 | Product-repository WYSIWYG and Overview/History planning/spec source | Migration candidate. These remain intentionally because current Editor tests and Project Control evidence still consume them. They carry Authority Boundary wording after the first cleanup slice. |

The remaining product-repository `docs/superpowers` files are:

- Core: `docs/superpowers/plans/2026-07-21-text-block-complete-geometry-boundary.md`
- Core: `docs/superpowers/specs/2026-07-21-persistent-text-block-spatial-flow-design.md`
- Core: `docs/superpowers/specs/2026-07-27-initial-text-block-authored-box-geometry-design.md`
- Core: `docs/superpowers/specs/2026-07-27-inline-image-line-box-geometry-design.md`
- Backend: `docs/superpowers/plans/2026-08-27-backend-service-contract-hardening.md`
- Editor: `docs/superpowers/plans/2026-08-30-editor-overview-history.md`
- Editor: `docs/superpowers/specs/2026-08-30-editor-overview-history-design.md`
- Editor: `docs/superpowers/specs/2026-08-30-editor-wysiwyg-gate-design.md`

## Broad Classification

Project Control Markdown is canonical or historical control material. It can
hold shared understanding when registered through Document, Work, Phase,
Checklist, and Evidence records.

Product repository entrypoints such as `AGENTS.md` and `README.md` may remain
repo-local. They should point broad FlowDoc work back to Project Control.

Product repository `docs/` files are not automatically wrong. Many appear to be
code-adjacent contracts, boundaries, audits, or implementation notes owned by
Core, Backend, or Editor. They need classification before removal because they
may still explain repository-owned tests or runtime contracts.

Product repository `docs/superpowers` files are the first cleanup priority
after this inventory because their plan/spec shape conflicts most directly
with the documentation authority policy.

## Next Cleanup Order

1. Migrate or retire the remaining Editor WYSIWYG and Overview/History
   `docs/superpowers` files after replacing current test dependencies or
   preserving their retained value in Project Control.
2. Classify the Core `docs/superpowers` text-block plan/spec files against the
   existing Project Control Text Block synthesis and Core document map before
   deletion or Authority Boundary repair.
3. Classify the Backend `docs/superpowers` backend-service hardening plan
   against its existing Project Control Work and Evidence records before
   deletion or Authority Boundary repair.
4. Inventory the larger Core, Backend, and Editor `docs/` contract/audit
   families by repository owner and only then decide which files survive with
   Authority Boundary wording.
5. Revise FlowDoc agent roles only after enough cleanup evidence shows which
   role boundaries are needed.

## Evidence Boundary

This inventory is not product evidence. It does not promote Core, Backend,
Editor, compatibility, frontend readiness, FlowDoc product truth, or map truth.
