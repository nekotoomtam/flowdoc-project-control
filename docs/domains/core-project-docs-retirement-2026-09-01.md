# Core Project Docs Retirement - 2026-09-01

## Purpose

This record preserves the retained value and discard rationale for Core
`docs/project` Markdown before those files are retired or demoted from
`flowdoc-vnext-core`.

The retirement belongs to `flowdoc-product-development-resumption >
flowdoc-documentation-authority-cleanup` and follows the Core Markdown
classification recorded in
`docs/domains/core-repository-markdown-classification-2026-09-01.md`.

## Authority Boundary

This document is owned by `repo-project-control` and supports only the
documentation-authority cleanup sequence for Core project-state, status, risk,
unknown, and roadmap Markdown.

The source snapshot is Core commit
`68e7ad7180b2eb9afb0adff14bacaefcecbb4f08`. It does not make the Core-local
project documents active Project Control Work, Core runtime truth, release
evidence, or cross-repository readiness by themselves.

This record does not promote Core, Backend, Editor, compatibility, frontend
readiness, FlowDoc product truth, or map truth.

## Source Snapshot

The four Core project documents are:

- `docs/project/CURRENT_STATE.md`
- `docs/project/ROADMAP.md`
- `docs/project/RISK_REGISTER.md`
- `docs/project/KNOWN_UNKNOWNS.md`

Core `docs/manifest.json` registered `docs/project` as a canonical root and
registered the four documents as active project-state, roadmap, risk-register,
and known-unknown records. Three of the four rows used cross-repository scope
and normative authority.

## Retained Value

| Source | Retained value before retirement |
| --- | --- |
| `docs/project/CURRENT_STATE.md` | Core is a private `0.0.0` package. No alpha release has been authorized. The D0 Core source commit was `5bcb497cefe742222a835637cc33eddd5f96b685`. The cited Editor and Backend heads were inspected references, not compatibility acceptance. The canonical-documentation migration was active only through D2, zero runtime subsystems were registered as migrated in `release.json`, accepted Phase 5B evidence remained legacy-unmigrated until D3, the package documentation boundary remained broad until D5, and Production activation remains false. |
| `docs/project/ROADMAP.md` | Preserved historical Core-local work signals: `WORK-CORE-LAYOUT-CUTOVER-001`, `WORK-CORE-REMAINING-SUBSYSTEM-CUTOVER-001`, `WORK-CORE-PACKAGE-RELEASE-BOUNDARY-001`, `WORK-FLOWDOC-EDITOR-BACKEND-ADOPTION-001`, `WORK-FLOWDOC-COORDINATION-TRANSFER-001`, and `WORK-FLOWDOC-AGENT-SYSTEM-REDESIGN-001`. These are not promoted into active Project Control Work by this record. |
| `docs/project/RISK_REGISTER.md` | Preserved historical Core-local risk signals: `RISK-CORE-DOCUMENTATION-STALE-SOURCE-001`, `RISK-CORE-DOCUMENTATION-DUAL-TRUTH-001`, `RISK-CORE-DOCUMENTATION-TEST-COUPLING-001`, `RISK-CORE-DOCUMENTATION-PACKAGE-SURFACE-001`, `RISK-FLOWDOC-COORDINATION-DUAL-OWNER-001`, and `RISK-FLOWDOC-COORDINATION-BASELINE-GHOST-001`. These remain cleanup context unless separately registered as Project Control Evidence or risk records. |
| `docs/project/KNOWN_UNKNOWNS.md` | Preserved historical Core-local unknown signals: `UNKNOWN-CORE-DOCUMENTATION-CONTRACT-INVENTORY-001`, `UNKNOWN-CORE-DOCUMENTATION-TEST-MIGRATION-001`, `UNKNOWN-CORE-PACKAGE-PUBLIC-DOCS-001`, `UNKNOWN-FLOWDOC-COMPATIBILITY-EDITOR-001`, `UNKNOWN-FLOWDOC-COMPATIBILITY-BACKEND-001`, and `UNKNOWN-FLOWDOC-COORDINATION-REPOSITORY-001`. These stay open as cleanup context and are not closed by this record. |

## Discard Rationale

Core may retain package-local documentation mechanics, but Project Control owns
FlowDoc-wide Work, Risk, Unknown, Roadmap, and cleanup sequencing.

Keeping `docs/project` as a Core canonical root lets Core-local prose carry
cross-repository normative project state. That conflicts with the Project
Control documentation authority policy and leaves future agents with two places
to look for active FlowDoc work truth.

The retained meaning above should be cited from this Project Control record and
the exact source commit instead of continuing Core-local `docs/project`
authority. Later Core cleanup may remove those files, remove the `docs/project`
manifest root, and keep only package-local documentation checks that do not
claim FlowDoc-wide Work, Risk, Unknown, Roadmap, or readiness truth.

## Evidence Boundary

This record preserves cleanup rationale only. It does not delete Core Markdown
by itself, does not change Core documentation tooling, and does not claim that
Core, Backend, Editor, compatibility, frontend readiness, FlowDoc product
truth, or map truth is current.
