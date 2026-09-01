# Core Generated Canonical Docs Boundary - 2026-09-01

This record preserves the retained value and authority boundary for the Core
generated canonical documentation views and the authored Core 0.1
compatibility record before they are demoted into explicit Core-owned
documentation context.

The boundary belongs to `flowdoc-product-development-resumption >
flowdoc-documentation-authority-cleanup` and follows the Core Markdown
classification recorded in
`docs/domains/core-repository-markdown-classification-2026-09-01.md`.

## Authority Boundary

Owner repository: Project Control for this cleanup record, with generated
output, generator code, and source material owned by Core.

Scope: Core generated canonical docs boundary for `docs/DOCUMENT_MAP.md`,
`docs/GLOSSARY.md`, `docs/GLOSSARY_TH.md`,
`docs/versions/0_1/VERSION_OVERVIEW.md`,
`docs/versions/0_1/CAPABILITY_SET.md`, and the authored
`docs/versions/0_1/COMPATIBILITY.md`.

Project Control owns FlowDoc-wide Work, Phase, Checklist, Evidence, Risk,
Unknown, Roadmap, documentation authority, product terminology, compatibility
promotion, and cleanup state.

This record does not make those Core generated or authored version docs active
FlowDoc-wide status, roadmap, risk, unknown, Phase, Checklist, Evidence,
terminology, compatibility, or map authority. It does not promote Core,
Backend, Editor, compatibility, release readiness, frontend readiness, FlowDoc
product truth, Project Control terminology authority, or map truth.

## Source Snapshot

Source Core commit:
`b4992a70091d9e829b7c9f023ac7f0d90250e827`.

Core generator and source files:

- `scripts/documentation/canonical-docs-render.mjs`
- `scripts/documentation/canonical-docs-model.mjs`
- `scripts/generate-canonical-docs.mjs`
- `docs/manifest.json`
- `docs/glossary.json`
- `docs/versions/0_1/release.json`
- `docs/versions/0_1/COMPATIBILITY.md`

Core Markdown outputs covered by this lane:

- `docs/DOCUMENT_MAP.md`
- `docs/GLOSSARY.md`
- `docs/GLOSSARY_TH.md`
- `docs/versions/0_1/VERSION_OVERVIEW.md`
- `docs/versions/0_1/CAPABILITY_SET.md`
- `docs/versions/0_1/COMPATIBILITY.md`

These files survive cleanup as Core-owned generated or authored documentation
context because Core tests and canonical documentation checks still use them as
the local documentation spine, generated glossary views, planned release-line
views, capability selector view, and explicit non-compatibility record.

## Cleanup Result

Core cleanup commit `661d0bb214db4c68b9403c3e5783e40123944d4a` adds generated
Authority Boundary output to `scripts/documentation/canonical-docs-render.mjs`
and regenerates:

- `docs/DOCUMENT_MAP.md`
- `docs/GLOSSARY.md`
- `docs/GLOSSARY_TH.md`
- `docs/versions/0_1/VERSION_OVERVIEW.md`
- `docs/versions/0_1/CAPABILITY_SET.md`

The same Core commit adds an authored Authority Boundary to
`docs/versions/0_1/COMPATIBILITY.md` while preserving the
`FLOWDOC-COMPATIBILITY` metadata block at the document start.

Core tracked and visible Markdown counts remain 339 files. An Authority /
Project Control signal scan reports 27 matches and 312 tracked Core Markdown
files without Authority Boundary or Project Control signal. This lane demotes
the surviving generated canonical docs and compatibility record into bounded
Core-owned documentation context; it does not delete them.

## Cleanup Housekeeping

The cleanup used short path `C:/w/fd-core-gendocs-0901` to avoid repeating the
prior long-path cleanup blockers. Post-merge cleanup removed
`C:/w/fd-core-gendocs-0901`, and branch
`fd-core-gendocs-boundary-0901` was deleted.

## Retained Value

| Source | Retained value |
|---|---|
| Canonical document map | Preserves Core-local navigation over the canonical documentation manifest, coordination records, version-line records, and generated glossary views. It is not the FlowDoc product-wide system map. |
| Technical glossary | Preserves generated technical-language views of Core-hosted canonical glossary records. It does not replace Project Control product terminology authority. |
| Thai glossary | Preserves generated Thai-language views of the same Core-hosted glossary records for coordination readability. It does not create a second terminology authority. |
| Core 0.1 version overview | Preserves planned, unversioned, non-ready release-line facts and baseline linkage without authorizing a release. |
| Core 0.1 capability set | Preserves empty capability, contract, and verification selectors plus the explicit no-release-readiness non-claim. |
| Core 0.1 compatibility record | Preserves the structured `FLOWDOC-COMPATIBILITY` metadata and prose stating Core-Editor, Core-Backend, and end-to-end compatibility are not inferred. |

## Disposition

The five generated Markdown files should remain in Core for now, but their
Authority Boundary should be emitted by the Core canonical docs renderer rather
than hand-edited in generated output.

The authored compatibility Markdown should remain in Core for now, with its
structured metadata block still first and an Authority Boundary added to the
human-readable body.

Later cleanup may retire these files only after replacement Core-owned
generator outputs, source records, tests, or Project Control synthesis preserve
the retained value above.

## Verification Target

The cleanup lane should add Core guards that require Authority Boundary wording
in generated canonical documentation output and in the surviving compatibility
record, regenerate the generated Markdown from Core sources, and then record
evidence after Core verification passes.

Verification completed after Core commit
`661d0bb214db4c68b9403c3e5783e40123944d4a`: focused Core canonical
documentation and documentation authority guards, Core docs check, Core full
check, and merged-main Core checks passed.

This record preserves cleanup rationale only. It does not edit Core runtime
behavior by itself and does not promote Core, Backend, Editor, compatibility,
release readiness, frontend readiness, FlowDoc product truth, Project Control
terminology authority, or map truth.
