# FlowDoc Frontend Product Map v1

## Superseded Preview requirement — 2026-09-05

This v1 map is retained as historical planning context. For new Build/Preview
work, use `flowdoc-preview-definition-correction-2026-09-05.md`, the updated
Creator UX Contract, and canonical product terminology. Preview requires
editing permitted simulation values on the visible document; inspection-only
wording and PDF lifecycle checks below do not satisfy that requirement.
Build remains separate structure authoring. Closed WYSIWYG gates require
explicit prerequisite work, not substitution of a read-only result.

## Authority Boundary

Owner repository: `repo-project-control`.

Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map`.

This document is the Project Control planning and UX design exploration map for the next FlowDoc frontend implementation lane. It expands the accepted Frontend Expert Roadmap v1 into screen, state, action, and handoff boundaries before product repository work starts.

The product map is planning context, not product truth. It does not prove frontend readiness, WYSIWYG readiness, publish readiness, production readiness, Core runtime behavior, Backend service behavior, Editor behavior, compatibility, or map truth.

No product repository files change in this phase. Core, Backend, and Editor remain product implementation owners for later approved lanes.

## Work Context

- Lane ID: `lane-frontend-product-map`
- Work Type: `planning-coordination` plus `ux-design-exploration`
- Active role: `planning-partner`, with `project-control-steward` and `documentation-authority-steward` responsibilities
- Current Phase: `phase-flowdoc-frontend-product-map-v1`
- Checklist target: `checklist-flowdoc-frontend-product-map-v1`
- Evidence target: `evidence-flowdoc-frontend-product-map-2026-09-03`
- Source roadmap: `docs/domains/flowdoc-frontend-expert-roadmap-2026-09-03.md`

Known risks:

- This product map may be mistaken for current Editor behavior or frontend readiness.
- Visible Preview and Publish language may imply live Backend, production, artifact, or renderer readiness that remains unknown.
- A Design surface may invite direct page editing before the WYSIWYG gate is accepted.
- Later implementation lanes may widen from workspace usability into Core, Backend, or publish contracts without a Contract Change Request.

Unknown state:

- Broad Editor runtime and UI behavior remain `unknown`.
- End-to-end Editor to Backend to Core readiness remains unpromoted outside accepted evidence.
- Preview export parity, renderer parity, published artifact access, and production behavior remain `unknown`.
- The WYSIWYG gate remains closed until a later Project Control decision lane accepts prerequisites.

## Product Rhythm

The first FlowDoc frontend rhythm is:

```text
Library -> Document Detail -> Design -> Preview -> Publish
```

Library is the entry and recovery surface. Document Detail is the inspection surface for one selected document. Design is the main working surface for structure, bounded editing affordances, and status. Preview is a confidence surface for visible rendering state. Publish is a gated review surface whose actions stay unavailable until later Backend, Core, and integration evidence supports them.

Every screen must show the user's next safe action without hiding unavailable, blocked, risk, or unknown states.

## Screen And State Map

### Library

Purpose: show the document set, local state, and safe next actions without implying cloud or production readiness.

Primary content:

- Document list with title, source mode, last known status, and updated time when available.
- Status grouping for draft, blocked, unavailable, and unknown documents.
- Per-document action affordances for open, inspect status, preview when supported, and publish only when gated prerequisites are met.
- Empty state for no documents, with a create or import affordance only if the later Editor lane can prove the backing route exists.
- Loading state that keeps navigation stable and avoids replacing the whole application with a spinner.
- Error state with retry and diagnostics affordance; diagnostics should name whether the failure belongs to fixture mode, live Backend mode, or unknown source state.

Truth boundary:

- Library may say a document is present only when the later Editor lane proves its source.
- Library must not claim cloud sync, production storage, publish readiness, or broad compatibility.

### Document Detail

Purpose: inspect one document before entering a mode-specific workspace.

Primary content:

- Document identity, source mode, Backend document record freshness when available, and Editor draft status.
- Summary of structure, outline count, supported editable regions, preview state, and publish gate state.
- Action row for Design, Preview, Publish, retry source load, and inspect diagnostics.
- Blocked state when source, package version, migration, or capability facts are insufficient.
- Unknown state when the document source cannot be classified by accepted evidence.

Truth boundary:

- Detail may expose status from an accepted Editor source adapter only after the owner lane proves it.
- Detail must keep Project Control Document record, Backend document record, Document package, Editor draft, and Preview wording separate.

### Design

Purpose: provide the first real document workspace shape without authorizing broad direct editing.

Primary content:

- Stable workspace frame with Library return, document title, mode tabs, status strip, and scoped diagnostics.
- Left outline panel of `outline item` rows with selection, collapsed groups, and unavailable markers.
- Center page canvas for document structure and bounded editable cards or text islands.
- Right inspector for selected region status, supported properties, and disabled controls with state-aware reasons.
- Toolbar with familiar controls for selection, undo or redo only when supported, zoom, preview, save, and status inspection.
- Dirty, saving, saved, conflict, blocked, unavailable, loading, and error states.
- Mobile or narrow desktop inspection layout that preserves document context before controls.

Truth boundary:

- Design may plan bounded edit regions and structural controls.
- Design must not implement or imply WYSIWYG readiness, unsupported rich text, contenteditable shortcuts, Core mutation results, Backend persistence, or production readiness.

### Preview

Purpose: make visible rendering state legible and recoverable.

Primary content:

- Draft Preview, stale preview, failed preview, unavailable preview, blocked preview, and Published Preview placeholders.
- Freshness indicator tied to source document, Editor draft, Backend revision, or unknown source when evidence is missing.
- Diagnostics panel for source input, capability response, generation attempt, artifact pointer, and retry result once supported.
- Download or inspect artifact actions only when the later implementation lane has accepted evidence for the specific path.
- Empty state when no preview exists and unavailable state when the renderer or service path is not proven.

Truth boundary:

- Preview is a UX target and inspection mode, not evidence of export parity, renderer parity, Backend persistence, PDF bytes, or product readiness.
- Published Preview must stay unavailable until Publish and integration evidence support it.

### Publish

Purpose: show the review, submission, job, result, retry, and blocked states for a future publish flow without activating it early.

Primary content:

- Review step with document identity, selected version, required input-data shape, and readiness checklist.
- Submit boundary with explicit prerequisites for API key or credential reference, Backend route, storage, Core contract, worker or renderer, and artifact access.
- Queued, running, succeeded, failed, cancelled, retrying, unavailable, and blocked job states.
- Result inspection and artifact access paths only when supported by accepted Backend and Core evidence.
- Recovery path that distinguishes user-fixable missing input from service, contract, renderer, and storage unknowns.

Truth boundary:

- Publish actions stay unavailable until service credentials, persistence, generation contracts, and integration evidence exist.
- Publish must not claim live production, real API key provisioning, product database readiness, renderer execution, PDF bytes, artifact persistence, or end-to-end delivery from this map.

### Shared Empty, Error, Loading, Blocked, And Unavailable States

Every screen should use the same state vocabulary:

- `empty`: no matching user object or no selected document.
- `loading`: source is being read and the application shell remains stable.
- `error`: a recoverable failure has a retry path and diagnostic owner.
- `blocked`: the action would require a closed gate, missing contract, missing evidence, unsupported version, or unresolved owner decision.
- `unavailable`: the capability is intentionally not exposed in this lane or not proven by accepted evidence.
- `unknown`: the state cannot be safely classified from Project Control planning context.

These states are planning requirements for later implementation. They are not proof that the Editor runtime already supports them.

## Action Inventory

| Action | Primary screen | Planned behavior | Required boundary before enabled |
| --- | --- | --- | --- |
| Open document | Library, Document Detail | Navigate to document detail or Design for a selected document. | Editor-owned route and source classification evidence. |
| Edit bounded region | Design | Change only supported managed cards or text islands. | WYSIWYG gate remains closed; Core mutation and Editor draft boundaries must be explicit. |
| Save | Design | Persist a supported Editor draft change when the owner lane proves the path. | Backend revision and Core mutation result evidence before claiming durable save. |
| Preview | Design, Preview | Show visible Draft Preview state and freshness. | Renderer, source, and artifact claims stay scoped to accepted evidence. |
| Publish | Publish | Review prerequisites and submit only when later gates support it. | Backend credential, route, storage, Core contract, worker or renderer, and integration evidence. |
| Retry | Library, Preview, Publish | Retry a failed source load, preview generation, or publish job. | Retry owner must be named: Editor, Backend, Core, renderer, or unknown. |
| Export or download | Preview, Publish | Expose artifact access only when supported. | PDF bytes and artifact persistence evidence required. |
| Inspect status | All screens | Show diagnostics for source, draft, preview, publish, and unavailable states. | Diagnostic copy must not turn a planned or unknown state into current truth. |

## Truth Boundary Matrix

| Visible claim family | Allowed wording in this map | Forbidden wording in this map | Evidence needed later |
| --- | --- | --- | --- |
| Frontend workspace | planned workspace surface, lane-ready design target | claiming current frontend readiness | Editor implementation commit and fresh Editor checks. |
| WYSIWYG | WYSIWYG gate remains closed; bounded edit regions are planned | claiming current WYSIWYG readiness | Project Control gate decision plus Editor/Core evidence. |
| Preview | Draft Preview and state vocabulary are UX targets | preview proves export parity or renderer parity | Editor, Backend, Core, renderer, and artifact evidence for the exact path. |
| Publish | publish flow is gated and unavailable until prerequisites are proven | claiming current publish readiness | Backend/Core/Editor implementation plus integration evidence. |
| Production | production remains NO-GO from this map | live production, deployed, or ready | Separate production readiness decision and evidence. |
| FlowDoc map truth | no map truth promotion | FlowDoc product truth or system-map current state | PLAN acceptance and evidence registration before any map change. |

## Lane-Ready Package

Next lane: `lane-design-workspace-usability`.

Likely owner repository after PLAN acceptance: `repo-editor`.

Work Type: `product-implementation` plus `ux-design-exploration`.

Goal: implement or refine the Editor-owned Design workspace usability surface so it feels like a real document workspace with stable navigation, visible structure, selected-region context, bounded authoring affordances, status honesty, and responsive inspection.

Allowed scope proposal:

- Editor-owned workspace shell, route/view composition, mode tabs, status strip, outline, canvas framing, inspector, toolbar, disabled-state copy, and responsive layout.
- Editor-owned tests for workspace shell, selected region state, disabled/unavailable controls, loading/error/empty states, and narrow viewport behavior.
- Read-only Project Control context from this product map and the roadmap.

Forbidden scope proposal:

- Core, Backend, or Project Control source edits.
- Broad direct page editing, hidden contenteditable shortcuts, or rich editor package adoption.
- Backend route, storage, credential, API key, worker, renderer, artifact, or production activation.
- Claims of frontend readiness, WYSIWYG readiness, publish readiness, production readiness, compatibility, FlowDoc product truth, or map truth.

Required reading proposal:

- Project Control `AGENTS.md`
- Editor repository `AGENTS.md`
- `docs/domains/flowdoc-frontend-expert-roadmap-2026-09-03.md`
- this product map
- `docs/domains/flowdoc-product-terminology.md`
- `docs/domains/flowdoc-product-terminology-th.md`
- relevant Editor workspace source and tests after the Editor repository AGENTS.md is read

Acceptance checks proposal:

- The first viewport opens on a product workspace, not a landing page.
- Library return, document identity, Design/Preview/Publish navigation, outline, canvas, inspector, toolbar, and status strip have stable dimensions and no incoherent overlap.
- Empty, loading, error, blocked, unavailable, dirty, saving, saved, and conflict states are visible or testable where in lane.
- Controls use familiar icon or native control patterns where possible, with disabled reasons that do not pretend the feature exists.
- Narrow desktop and mobile inspection layouts preserve document context.
- Tests prove the lane did not bypass the WYSIWYG gate or enable publish submission.

Evidence target proposal:

- `evidence-editor-design-workspace-usability-2026-09-03`

Expected terminal handoff proposal:

- Editor commit hash for changed behavior.
- Files changed and behavior changed.
- Fresh Editor focused tests and `npm run check`.
- Evidence candidate for PLAN; the Editor WORK room must not self-promote Project Control truth or map truth.
- Claims intentionally not promoted, especially frontend readiness, WYSIWYG readiness, publish readiness, production readiness, and end-to-end compatibility.

## Intentionally Not Changed

- No product repository files change in this phase.
- No runtime UI implementation is performed by this phase.
- No Core, Backend, or Editor behavior is changed.
- No FlowDoc system map or DOCUMENT_MAP entry is updated with planned outcomes.
- No frontend readiness, WYSIWYG readiness, publish readiness, production readiness, compatibility readiness, or FlowDoc product truth is promoted.
- No additional WORK rooms are opened by this phase.

## Next Recommended Work

PLAN should review this map through `acceptanceGate`. If accepted, PLAN can use the Lane-Ready Package above as the Context Capsule basis for `lane-design-workspace-usability` and open a real Editor WORK room with automatic return, liveness, retrievable locator, death signal, evidence target, and stop conditions intact.
