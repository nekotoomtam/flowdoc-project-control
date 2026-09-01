# Project Control Overview

## Current scope

Project Control is the shared, file-first registry for Flowdoc Nodes, Work, Documents, Repository Registry entries, and Evidence. Its generated index is a deterministic read model, and its first GUI is read-only.

Project Control is also the governing entrypoint for FlowDoc work rounds. Future
Codex rooms and agents should start here to identify owner repositories, active
roles, evidence targets, known risks, and unknown state before promoting shared
truth or editing product behavior.

The copy-ready global Codex guidance lives at
`docs/domains/flowdoc-global-codex-guidance.md` and can bootstrap
`C:\Users\nekot\.codex\AGENTS.md` when the global file is missing or empty.
That global layer keeps FlowDoc rooms opened from any repository pointed back
to Project Control first.

FlowDoc documentation authority is governed by
`docs/domains/flowdoc-documentation-authority-policy.md`. That policy keeps
FlowDoc-wide shared understanding in Project Control, permits repo-local
Markdown only for code-adjacent, repository-owned, or historical purposes, and
requires Authority Boundary wording before repository-local Markdown survives
cleanup. The policy does not promote Core, Backend, Editor, compatibility,
frontend readiness, or FlowDoc product truth.

Project Control-local `docs/superpowers` Markdown is retired by
`docs/domains/project-control-superpowers-retirement-2026-09-01.md` and
`evidence-project-control-superpowers-docs-retired-2026-09-01`. The active
Project Control design now lives under `docs/domains`, and historical
superpowers paths are valid only when paired with the exact commit that
contained them.

The approved next Project Control GUI direction is the repo-first Overview and
History split in
`docs/domains/project-control-repo-first-overview-history-2026-08-28.md`.
That decision says the first GUI surface should act as a repository or area
directory, while a separate History surface records what has happened over
time and returns the user to a focused Overview.

Repo Directory Overview and Work History View are implemented as bounded
Project Control GUI behavior by Project Control commit
`97e9d234d2bb1e2d294463a395604d5f0ec75348`. The implementation record is
`doc-project-control-overview-history-gui-2026-08-29`, and the supporting
Evidence record is
`evidence-project-control-overview-history-gui-2026-08-29`. This claim is
limited to the Project Control read-only GUI entry, History, focused return
flow, and related agent guidance.

This overview is current only for the Project Control architecture described by the approved design at commit `bc2e1efb60c7391b2d4b0978cf7c4b1105ef7444`. It does not claim that Core, Editor, or Backend is current.

## Evidence boundary

The current Project Control architecture claim is maintained in
`docs/domains/flowdoc-project-control-architecture-and-gui-design-2026-08-12.md`.
The original approved design object was recorded at
`docs/superpowers/specs/2026-08-12-flowdoc-project-control-design.md` in the
Project Control repository at commit `bc2e1efb60c7391b2d4b0978cf7c4b1105ef7444`.
The Evidence record deliberately limits its verification to that original
object and commit.

The current Project Control GUI Overview and History claim is supported by
`evidence-project-control-overview-history-gui-2026-08-29`. That Evidence
deliberately limits verification to the Project Control GUI implementation and
tests; it does not claim that Core, Editor, or Backend is current.

## Product-repository inspection baselines

These approved preflight baselines identify exact revisions inspected before this seed was authored. They are not Evidence records and do not establish current truth for the product Nodes.

| Repository | HTTPS remote | Inspected commit |
| --- | --- | --- |
| Project Control | `https://github.com/nekotoomtam/flowdoc-project-control.git` | `d7bbb4cc2a8a30356a59e5d434b794cf357f233a` |
| Core | `https://github.com/nekotoomtam/flowdoc-vnext-core.git` | `76a2f2311a898e781f53773390d47b05812911e4` |
| Editor | `https://github.com/nekotoomtam/flowdoc-vnext-editor.git` | `43dcebb22735d7330fda0d57d4e7ce9a726e2454` |
| Backend | `https://github.com/nekotoomtam/flowdoc-vnext-backend.git` | `280c4ffbe075cd5391cce5219e8f9c40fed16527` |

## Closed pilot

The `CORE_ROUTE_*` documentation-consolidation pilot is closed. Exact Core cleanup commit `8aa0be4f662708fa75d4eb8f0f99b4784da2371c` removed exactly the four covered documents, Core main descendant `501caec1fe3317309d0f6c18c2dec118fb6994e7` retains that cleanup, cleanup Evidence is recorded as `evidence-core-route-cleanup`, and no active `CORE_ROUTE` Work remains. This bounded closure does not promote the broader Core node from `unknown` or authorize deletion outside the reviewed family.

Template Builder documentation synthesis is complete across five bounded leaves and one family overview; the Node remains unknown, and no migration coverage, source cleanup, production editor, persistence, collaboration, renderer, or performance authority is created.

Live Draft documentation synthesis is complete across six bounded leaves and one family overview; the Node remains unknown, and no migration coverage, source cleanup, product activation, Editor or Backend integration, browser Worker adoption, renderer or export parity, or performance authority is created.

Text Block documentation synthesis is complete across three bounded leaves and one family overview; the Node remains unknown, and migration coverage, reference repair, publication review, family promotion, and separately authorized cleanup remain incomplete.
