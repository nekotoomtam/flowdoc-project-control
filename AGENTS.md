# FlowDoc Project Control Agent Guide

## Start here

This repository is the FlowDoc control surface. It records shared truth, work
coordination, document metadata, repository identities, and evidence indexes.
It is not the product runtime and must not become the place where Core, Editor,
or Backend behavior is implemented.

Before taking broad work, read these files in order:

1. `docs/domains/flowdoc-system-map.md`
2. `docs/domains/document-map-operating-rules.md`
3. `docs/domains/flowdoc-role-catalog.md`
4. `docs/domains/agent-and-skill-operating-model.md`
5. `docs/domains/flowdoc-round-workflow.md`
6. `docs/domains/project-control.md`

Use `generated/project-index.json` only as the generated read model. Canonical
records live under `data/` and canonical prose lives under `docs/`.

## First decision

Choose the active role before acting:

- Project Control Steward: maintain records, documents, generated index, and
  GUI-facing truth.
- Evidence Reviewer: check whether a claim has durable repository evidence.
- Lane Reconciliation Reviewer: review old worktrees or lane branches before
  cleanup.
- Cross-Repo Boundary Reviewer: keep Project Control, Core, Editor, and Backend
  ownership separate.
- Documentation Synthesizer: publish bounded summaries from reviewed source
  material.
- Product Implementation Agent: work in the owning product repository after
  scope and evidence target are clear.
- Planning Partner: turn broad intent into staged, verifiable work.

If the task touches product behavior, identify the owning repository first and
read that repository's `AGENTS.md` before editing there.

## Plan versus truth

Plan / Work records intent. It can describe what this round is trying to do,
which tasks exist, and what evidence should be produced.

DOCUMENT_MAP records verified system truth. Do not update DOCUMENT_MAP or a
system map with planned outcomes, expected behavior, or unfinished work. Update
the narrowest map only after implementation, verification, and Project Control
document/evidence registration support the new state.

For product-wide inventory, use `docs/domains/flowdoc-system-map.md`. For Core
release-line documentation, use
`docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`.

## Editing rules

- Preserve unrelated user changes in the working tree.
- Edit canonical sources under `data/` and `docs/`; regenerate
  `generated/project-index.json` with `npm run generate`.
- Do not hand-edit `generated/project-index.json`.
- A Work record is not evidence. Strong claims require Evidence records or
  clearly cited repository-owned tests, files, commits, or contracts.
- Do not promote parent nodes because a child node has evidence.
- Mark risks while inspecting, continue the full scan unless blocked, and make
  decisions after the scan is complete.

## Verification

Use focused checks while developing and run the full Project Control gate before
claiming completion:

```text
npm run check
```

If a product repository was touched, also report that repository's relevant
checks. Do not claim PASS without fresh verification output.

## Handoff

End broad work with:

```text
PASS / FAIL / BLOCKER / RISK / UNKNOWN
Files changed
Behavior changed
Tests run
Evidence or map updates
Intentionally not changed
Next recommended work
```

Call out whether a map changed, which map changed, what supports the change,
which planned items intentionally stayed out of the map, and which system
states remain unknown.
