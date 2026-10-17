# FlowDoc Structure Pattern Build/Preview Integration v0 Acceptance

## Authority Boundary

This document records the PLAN-room integration acceptance decision for the
automatically returned Core, Backend, and Editor WORK room handoffs for
Structure Pattern Build/Preview v0.

It is owned by Project Control under
`flowdoc-product-development-resumption > flowdoc-document-structure-database-model > flowdoc-structure-pattern-build-preview-integration-v0`.

This is a Project Control verification record. It does not edit Core, Backend,
or Editor behavior, does not create HTTP gateway routes, does not persist
runtime Structure Pattern Entries, does not store submitted values, does not
generate PDF files, does not execute renderer jobs, and does not promote
FlowDoc product truth or map truth.

The accepted product behavior remains owned by the cited owner-repository
commits. Runtime submission, generated PDF files, renderer execution, artifact
storage, permissions, workflow, billing, audit, activity, integrations,
deployment, production database migration, published API readiness, release
readiness, full frontend readiness, product readiness, and map truth remain
outside this record.

## Work Context

- Work path:
  `flowdoc-product-development-resumption > flowdoc-document-structure-database-model > flowdoc-structure-pattern-build-preview-integration-v0`
- Owner repository for this acceptance record: `repo-project-control`
- Product evidence repositories: `repo-editor`, `repo-backend`, `repo-core`
- Active role: `evidence-reviewer`, with `project-control-steward` and
  `cross-repo-boundary-reviewer` responsibilities
- Current Phase:
  `phase-flowdoc-structure-pattern-build-preview-integration-v0`
- Checklist target:
  `checklist-flowdoc-structure-pattern-build-preview-integration-v0`
- Evidence target:
  `evidence-flowdoc-structure-pattern-build-preview-integration-v0-2026-09-04`
- Room mode for this record: `PLAN`
- Dispatch Set ID:
  `dispatch-structure-pattern-build-preview-v0-2026-09-04-01`
- Known risks: Editor checkout carried unrelated branch state and an untracked
  `debug.log`; Backend and Core returned detached commits; dependency audit
  findings were reported by WORK rooms; legacy Backend physical names still
  include `component_*` for compatibility.
- Unknown state: runtime Structure Pattern Entry persistence, submitted value
  storage, HTTP gateway exposure, generated PDF, renderer, artifact,
  permission, workflow, billing, audit, activity, integration, deployment,
  production database migration, published API readiness, release readiness,
  full frontend readiness, product truth, and map truth remain unverified by
  this integration record.

## Handoff Inbox Items

PLAN opened three real WORK rooms under dispatch set
`dispatch-structure-pattern-build-preview-v0-2026-09-04-01` with
`parallelLimit` 3. Each room returned a terminal handoff through the automatic
Return Channel.

### Editor

- Handoff status: PASS
- Return channel status: `automatic-returned`
- Handoff ID:
  `handoff-editor-build-preview-structure-pattern-v0-2026-09-04-01`
- WORK task/chat ID: `01a06bdf-b876-7920-9c08-a680c766b784`
- Lane ID: `lane-editor-build-preview-structure-pattern-v0`
- Work Type: `product-implementation`
- Owner repository: `repo-editor`
- Accepted commit:
  `65ab5b149c5aad10b36bbaa23650b9fce7070dff`
- Worktree locator:
  `C:\Users\nekot\.codex\worktrees\515f\FlowDocEditor`

Accepted Editor behavior:

- Build keeps draft authoring separate from Preview.
- Build defines Structure Pattern Slots.
- Preview simulates Structure Pattern Entries from fields and Structure
  Patterns without mutating the Build structure.
- Workflow labels expose Build, Fields, Structure Patterns, and Preview.
- Publish remains blocked by readiness policy.

PLAN noted one locator correction: the handoff text used the PLAN task ID in
one place when naming the child WORK task. PLAN verified the real WORK task,
worktree, branch, and commit before acceptance, so no same-room revision was
required for the product output.

### Backend

- Handoff status: PASS
- Return channel status: `automatic-returned`
- Handoff ID:
  `handoff-backend-structure-pattern-v0-0-2-alignment-2026-09-04-01`
- WORK task/chat ID: `01a06be4-9e75-7b52-a94d-5804f8bee47b`
- Lane ID: `lane-backend-structure-pattern-v0-0-2-alignment`
- Work Type: `product-implementation`
- Owner repository: `repo-backend`
- Accepted commit:
  `9da58214e087d2f15afd43855bfd1febec882037`
- Worktree locator:
  `C:\Users\nekot\.codex\worktrees\d135\flowdoc-vnext-backend`

Accepted Backend behavior:

- Backend freezes only Structure Patterns referenced by draft slots.
- Legacy `component_*` names remain compatibility and physical storage names.
- Backend exposes `structurePatternSlots` and `structurePatternVersions`
  aliases for v0.0.2 callers.
- Version fields expose Structure Pattern Slot ownership and source aliases.
- SQLite persists slot policy and layout fields.
- Frozen document version reads hydrate from normalized relational rows instead
  of canonicalizing `document_versions.record_json`.

### Core

- Handoff status: PASS
- Return channel status: `automatic-returned`
- Handoff ID:
  `handoff-core-structure-pattern-boundary-probe-2026-09-04-01`
- WORK task/chat ID: `01a06be4-bab9-71a2-b7d2-a5b4cf4a4cfc`
- Lane ID: `lane-core-structure-pattern-boundary-probe`
- Work Type: `product-implementation`
- Owner repository: `repo-core`
- Accepted commit:
  `8411f26763d81743ba9d44a59fd5ad4942e5601a`
- Worktree locator:
  `C:\Users\nekot\.codex\worktrees\8744\flowdoc-vnext-core`

Accepted Core behavior:

- Core owns a strict Structure Pattern Slot boundary validator.
- Core accepts draft or published slot facts.
- Core validates duplicate slot ids and keys.
- Core validates repeat policy cardinality and required minimums.
- Published slots require resolved Structure Pattern version pins.
- Core rejects runtime entries and submitted values.

## Integration Gate Result

`acceptanceGate` result: `accepted`.

PLAN accepted the three returned lanes because each handoff included terminal
PASS status, owner repository, Work Type, Context Acknowledgement, automatic
Return Channel evidence, retrievable locator, exact commit, changed files,
tests run, risks, unknowns, intentionally closed scope, and no Contract Change
Request.

PLAN then integrated the accepted commits into owner-repository main branches:

- Core main fast-forwarded to
  `8411f26763d81743ba9d44a59fd5ad4942e5601a`.
- Backend main fast-forwarded to
  `9da58214e087d2f15afd43855bfd1febec882037`.
- Editor main fast-forwarded to
  `65ab5b149c5aad10b36bbaa23650b9fce7070dff`.

PLAN did not patch Core, Backend, or Editor product files after dispatch.

## Verification

WORK verification already returned with each handoff. PLAN then performed fresh
owner-repository main gates after merge.

Core main:

- Command: `npm run check`
- Result: type-check passed, 432 passed test files, and 2791 passed tests.

Backend main:

- Command: `npm run check`
- Result: type-check passed, 93 passed / 1 skipped test file, 346 passed / 27
  skipped tests, and build passed.

Editor main:

- Command: `npm run review:gate`
- Result: type-check passed, Core package tests passed with 54 files / 837
  passed / 6 skipped, app tests passed with 129 files / 1155 passed, and
  production build passed.

## PLAN Decision

Structure Pattern Build/Preview v0 has been accepted by PLAN at the bounded
owner-repository commit level:

- Editor:
  `65ab5b149c5aad10b36bbaa23650b9fce7070dff`
- Backend:
  `9da58214e087d2f15afd43855bfd1febec882037`
- Core:
  `8411f26763d81743ba9d44a59fd5ad4942e5601a`

This acceptance supports only the bounded owner-repository behavior proven by
those commits and main gates:

- Build defines Structure Pattern Slots.
- Preview simulates Structure Pattern Entries.
- Backend freezes only Structure Patterns referenced by slots.
- Core rejects runtime entries and submitted values from Structure Pattern Slot
  facts.

This record does not promote FlowDoc product truth or map truth. It does not
prove runtime submission persistence, submitted value storage, HTTP gateway
exposure, generated PDF files, renderer jobs, artifact storage, permission
behavior, workflow, billing, audit, activity, integrations, deployment,
production database migration, published API readiness, release readiness, or
full frontend readiness.

Intentionally closed by this acceptance:

- No runtime submission model.
- No persisted runtime Structure Pattern Entries.
- No submitted value storage.
- No HTTP gateway exposure.
- No generated PDF files.
- No renderer jobs.
- No artifact storage.
- No permission, workflow, billing, audit, activity, or integration readiness.

## Next Recommended Lanes

Next recommended lanes:

- `lane-editor-build-surface-creator-usability`: continue making Build usable
  as the creator-facing document-structure authoring surface.
- `lane-preview-entry-simulation-contract`: harden Preview as a separate
  Structure Pattern Entry simulation surface without mutating Build drafts.
- `lane-backend-document-structure-gateway`: expose the accepted Backend
  document-structure foundation through a bounded API surface after frontend
  authoring needs are stable.
- `lane-runtime-submission-model`: design runtime submitted values and persisted
  Structure Pattern Entries separately from structure definition.
