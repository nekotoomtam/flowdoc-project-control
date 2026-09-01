# Core Repository Markdown Classification - 2026-09-01

## Purpose

This record classifies the remaining repo-local Markdown in
`flowdoc-vnext-core` for `flowdoc-product-development-resumption >
flowdoc-documentation-authority-cleanup`.

It is a cleanup sequencing record. It tells the next agent which Core Markdown
families should be preserved, summarized, migrated, or retired before any
broader Core documentation cleanup starts.

## Authority Boundary

This document is owned by `repo-project-control` and supports only the
documentation-authority cleanup sequence for Core repo-local Markdown.

Core source commit `6c1b53796802772467bf715b83764ac1ef613e52` is the source
snapshot for the counts and sampled classification below. Core repository was
read-only in this classification phase. No Core Markdown is deleted by this
classification.

This record does not promote Core, Backend, Editor, compatibility, frontend
readiness, FlowDoc product truth, or map truth.

## Source Snapshot

| Scan or signal | Count | Classification note |
| --- | ---: | --- |
| `git ls-files '*.md'` | 348 tracked Markdown files | Complete tracked Markdown count, including hidden tracked paths. |
| `rg --files -g '*.md'` | 343 visible Markdown files | Normal visible-file scan; hidden `.superpowers` paths are not returned. |
| Hidden `.superpowers/sdd` Markdown | 5 hidden `.superpowers/sdd` Markdown files | Tracked execution and review artifacts outside Project Control. |
| `docs/superpowers` | docs/superpowers: 0 | The former Core `docs/superpowers` cleanup already removed this lane. |
| Authority / Project Control signal | Authority / Project Control signal: 4 | Only `AGENTS.md`, `docs/CORE_PUBLIC_EXPORT_BOUNDARY_REVIEW.md`, `docs/LIVE_DRAFT_CROSS_RUNTIME_PARITY_HANDOFF.md`, and `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/source-envelope-verification.md` matched the signal scan. |
| Missing authority signal | 344 tracked Core Markdown files without Authority Boundary or Project Control signal | Every survivor needs boundary review before it is treated as current authority. |

Tracked location groups:

| Location | Count |
| --- | ---: |
| `.superpowers` | 5 |
| root | 2 |
| `docs/root` | 329 |
| `docs/project` | 4 |
| `docs/coordination` | 1 |
| `docs/versions` | 3 |
| `examples/template-builder-sandbox` | 1 |
| `packages/pdf-renderer-pilot` | 1 |
| `packages/text-engine-rust-wasm` | 1 |
| `packages/uat-realdoc` | 1 |

High-signal suffix counts:

| Suffix signal | Count |
| --- | ---: |
| `_BOUNDARY.md` | 100 |
| `_GATE.md` | 47 |
| `_CLOSE_AUDIT.md` | 34 |
| `_ARCHITECTURE_LOCK.md` | 20 |
| `_CONTRACT.md` | 13 |
| `_PLAN.md` | 8 |
| `_SMOKE.md` | 6 |
| `_MAP.md` | 5 |
| `README.md` | 5 |
| `_HANDOFF.md` | 4 |
| `_MATRIX.md` | 4 |
| `_DECISION.md` | 3 |
| `_POLICY.md` | 2 |
| `_ROADMAP.md` | 2 |
| `_STATUS.md` | 1 |
| `GLOSSARY.md` | 1 |
| `GLOSSARY_TH.md` | 1 |

## Classification Buckets

### Hidden execution artifacts

First cleanup lane: hidden `.superpowers/sdd` execution artifacts.

These five files are tracked Markdown under a hidden tool/work directory:

- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-corrective/collision-fix-report.md`
- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-corrective/delivery-fix-report.md`
- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/final-review-verdict.md`
- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/final-verification.md`
- `.superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/source-envelope-verification.md`

Disposition: summarize retained evidence into Project Control or Core
code-adjacent records, then retire the hidden Markdown from Core if no current
test or source reference still requires the files. These artifacts should not
remain as a separate work-memory plane.

### Project state and planning records

Second cleanup lane: Core project-state, status, roadmap, and planning docs.

The highest-conflict files are `docs/project/CURRENT_STATE.md`,
`docs/project/ROADMAP.md`, `docs/project/RISK_REGISTER.md`,
`docs/project/KNOWN_UNKNOWNS.md`, `docs/CURRENT_STATUS.md`,
`docs/NEXT_PHASE_POINTER.md`, progress indexes, roadmaps, and broad `*_PLAN.md`
or `*PLANNING*` files.

Disposition: migrate or synthesize Work, Phase, Checklist, Risk, Unknown, and
Evidence meaning into Project Control before deletion or demotion. Core may
retain narrow package-local status markers only when they declare that Project
Control owns FlowDoc-wide state and that Core-local docs are not cross-repo
authority.

### Code-adjacent Core contracts and boundaries

The code-adjacent Core contracts, boundaries, gates, and architecture locks are
retention candidates, not automatic survivors. They often name source files,
tests, fixtures, package boundaries, and blocked runtime behavior that may be
needed near the Core code.

Disposition: review by family before deletion. Surviving files need an
Authority Boundary that says they are Core-owned implementation evidence or
package-local contracts only. They must not claim Project Control Work state,
cross-repository compatibility, release readiness, Editor behavior, Backend
behavior, or FlowDoc-wide map truth.

### Historical close audits, handoffs, smokes, matrices, and ledgers

Close audits, handoffs, smoke records, matrices, and the legacy phase ledger
are historical evidence candidates. They may still be useful when tied to
exact Core tests, fixtures, and commits, but they should not be treated as
current planning truth.

Disposition: preserve the retained value in Project Control or narrower
code-adjacent records, then retire obsolete prose once evidence pointers and
discard rationale exist.

### Generated navigation, glossary, and version-line docs

Generated Core navigation/version docs and glossary outputs can remain
Core-local only as generated or package/version-scoped views. `docs/DOCUMENT_MAP.md`
explicitly says it is generated. `docs/versions/0_1/*` declares an unversioned,
non-ready release line with compatibility not verified.

Disposition: do not hand-edit generated files. Add or enforce Authority
Boundary wording at the source that generates or owns the content. Compare
Core glossary output against Project Control terminology before retiring,
because Project Control owns FlowDoc-wide terminology.

### Entry points and package READMEs

`AGENTS.md`, root `README.md`, example README, and package READMEs are
repo-local entrypoint/setup candidates. They can remain when they guide local
Core development, package checks, examples, or package-local tooling.

Disposition: keep as local onboarding only after boundary review. They should
point FlowDoc-wide state decisions back to Project Control.

## Next Cleanup Order

1. Retire or migrate the hidden `.superpowers/sdd` artifacts after recording
   retained evidence.
2. Review Core project-state/status/roadmap/planning docs and move shared Work,
   Risk, Unknown, Phase, Checklist, or Evidence meaning into Project Control.
3. Sweep generated navigation/glossary/version docs for Authority Boundary
   source ownership without hand-editing generated outputs.
4. Review code-adjacent contracts/boundaries/gates/architecture locks by Core
   family, adding Authority Boundary text to survivors and retiring obsolete
   historical prose only after source evidence is preserved.
5. Leave package/example READMEs in place when they remain local setup or
   package evidence, but make their Project Control boundary explicit.

## Evidence Boundary

This classification is evidence for cleanup sequencing only. It does not
delete Core Markdown, does not edit Core behavior, and does not decide that any
specific Core subsystem is current, compatible, release-ready, or product-ready.
