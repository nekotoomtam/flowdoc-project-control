# FlowDoc Frontend Expert Roadmap v1

## Authority Boundary

Owner repository: `repo-project-control`.

Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap`.

This document is the Project Control planning and UX design exploration record for the next FlowDoc frontend direction. It coordinates product-facing frontend lanes before implementation starts.

The design artifact is not product truth. It does not prove frontend readiness, WYSIWYG readiness, publish readiness, production readiness, Core runtime behavior, Backend service behavior, Editor behavior, or map truth.

No product repository files change in this roadmap phase. Core, Backend, and Editor remain product implementation owners for later approved lanes.

## Work Context

Active role: `planning-partner`.

Current Phase: `phase-flowdoc-frontend-expert-roadmap-v1`.

Checklist target: `checklist-flowdoc-frontend-expert-roadmap-v1`.

Evidence target: `evidence-flowdoc-frontend-expert-roadmap-2026-09-03`.

Work Type: `planning-coordination` plus `ux-design-exploration`.

Known risks:

- A roadmap or mockup may be mistaken for frontend readiness or product truth.
- The frontend scope may expand into product implementation before lane approval.
- The WYSIWYG gate may be bypassed by adding broad direct editing before prerequisites are accepted.
- Preview and Publish wording may imply live integration that remains unknown or unavailable.

Unknown state:

- Broad Editor runtime and UI behavior remain `unknown` until a product-owned inspection or implementation lane proves them.
- End-to-end Editor to Backend to Core readiness remains unpromoted outside accepted evidence.
- Production remains NO-GO until a later evidence-backed decision changes that state.

## North Star

FlowDoc should feel like an expert document production workspace, not a scattered demo shell. A user should be able to enter the product, understand the state of their documents, shape a document with visible structure, preview trustworthy output, and move toward publish with clear status and recoverable failures.

The first product-facing rhythm is Library, Design, Preview, and Publish:

- Library shows what exists, what is draft-only, what is blocked, and what can safely be opened next.
- Design is the authoring surface where document structure, editable regions, style controls, and page context are visible without overwhelming the user.
- Preview confidence tells the user whether they are seeing a draft preview, a stale preview, a published preview, or an unavailable state.
- Publish flow binding connects a reviewed document to submission, queued work, result state, retry, and evidence.

## Roadmap Principles

- Workflow-first: design around repeated work, not a landing page or promotional screen.
- Honest state: every surface must distinguish current, planned, risk, blocked, unavailable, and unknown state.
- Progressive authoring: start with bounded edit regions and structural controls before broad rich text behavior.
- Evidence-bearing UI: actions that claim compatibility, preview, publish, or production state need backing checks and records.
- No WYSIWYG shortcut: direct page editing stays behind the WYSIWYG gate decision until prerequisites are explicit.
- Product ownership stays clear: Project Control coordinates; Editor, Backend, and Core implement only through approved lanes.
- Accessibility and polish are acceptance requirements, not decoration.

## Current Frontend Gaps

Library needs a stronger product entry surface. It should show local documents, draft state, available actions, unavailable actions, and recovery paths without implying cloud or production readiness.

Design authoring surface is the largest missing product experience. The expected workspace needs a clear page canvas, outline or structure navigation, selected-region context, inspector controls, toolbar commands, disabled-state language, and responsive behavior.

Preview confidence is not yet a trusted workflow. Users need clear Draft Preview versus Published Preview state, stale-state warnings, generation status, diagnostics, and download or retry paths.

Publish flow binding is unavailable as a complete product path. It needs a visible review step, submission boundary, queued status, result state, error recovery, and Backend/Core readiness gates before any publish-ready claim.

WYSIWYG gate decision remains closed. The next accepted direction should prefer managed editable cards or bounded text islands before full direct DOM editing or a broad rich editor package.

## Roadmap Phases

### Phase 1: Frontend Product Map

Lane ID: `lane-frontend-product-map`.

Owner for this phase: `repo-project-control`.

Goal: create a lane-ready product map for Library, Design, Preview, and Publish, with each surface marked as current, planned, risk, blocked, unavailable, or unknown.

Expected output:

- Screen inventory for Library, Design, Preview, Publish, document detail, and error or empty states.
- Action inventory for open, edit, save, preview, publish, retry, export, and inspect status.
- Truth boundary for every visible readiness claim.
- Next implementation lane cards.

Acceptance:

- No product repository edits.
- No map truth promotion.
- The map can become the kickoff context for the first Editor implementation lane.

### Phase 2: Design Workspace Usability

Lane ID: `lane-design-workspace-usability`.

Likely implementation owner after approval: `repo-editor`.

Goal: make the Design surface feel like a real document workspace with clear structure, focus, and editing confidence.

Expected output:

- Workspace frame with stable navigation, page canvas, outline, inspector, toolbar, and status strip.
- Selected node or region state that explains what can be edited.
- Empty, loading, unavailable, conflict, and error states.
- Responsive layout for narrow desktop and mobile inspection.

Acceptance:

- The first viewport shows the product workspace, not a marketing hero.
- Controls use familiar icon or native control patterns where possible.
- Disabled actions explain state without pretending the feature exists.

### Phase 3: Progressive Authoring

Lane ID: `lane-progressive-authoring`.

Likely implementation owner after approval: `repo-editor`, with `repo-core` evidence dependencies.

Goal: add useful authoring in bounded regions before broad WYSIWYG editing.

Expected output:

- Text-region editing model for safe document changes.
- Structural controls for section, column, table, and media placeholders only where supported.
- Save and dirty-state handling.
- Compatibility boundary with Core document model and generation contracts.

Acceptance:

- Editing behavior is scoped to supported structures.
- Unsupported rich behavior is blocked or clearly unavailable.
- Tests prove that hidden direct-DOM editing does not bypass the WYSIWYG gate.

### Phase 4: Preview Confidence

Lane ID: `lane-preview-confidence`.

Likely implementation owner after approval: `repo-editor`, with `repo-backend` and `repo-core` evidence dependencies.

Goal: let the user trust what preview state means.

Expected output:

- Draft Preview and Published Preview labels.
- Fresh, stale, queued, failed, unavailable, and blocked preview states.
- Diagnostics panel for input, backend response, artifact pointer, and retry result.
- Download or inspect affordance only when supported evidence exists.

Acceptance:

- Preview cannot imply production or publish readiness without accepted evidence.
- Failed and unavailable states are visible, recoverable, and testable.
- Preview state is tied to source document and generation lifecycle.

### Phase 5: Publish Flow Binding

Lane ID: `lane-publish-flow-binding`.

Likely implementation owner after approval: `repo-editor`, with `repo-backend` and `repo-core` evidence dependencies.

Goal: connect the user-facing publish flow to the real submission and job lifecycle once Backend and Core gates support it.

Expected output:

- Review step before publish.
- Submit boundary with explicit prerequisites.
- Queued, running, succeeded, failed, cancelled, and retry states.
- Result inspection and artifact access paths.

Acceptance:

- Publish actions stay unavailable until service credentials, persistence, and generation contracts are proven.
- No product copy claims that production is live before Project Control evidence supports it.
- Errors include next actions without hiding backend or runtime uncertainty.

### Phase 6: Frontend Polish And Accessibility

Lane ID: `lane-frontend-polish-and-accessibility`.

Likely implementation owner after approval: `repo-editor`.

Goal: turn the main workflows into a repeatable, readable, accessible product surface.

Expected output:

- Keyboard navigation and focus visibility.
- Color contrast and reduced-motion checks.
- Dense but readable operational layout.
- Loading, long-document, small-screen, and high-density document checks.
- Visual QA across desktop and mobile breakpoints.

Acceptance:

- No text overlap or unstable resizing in common viewports.
- Icons, controls, cards, and panels follow the product UI conventions.
- Accessibility defects are recorded as blockers or risks, not taste notes.

### Phase 7: WYSIWYG Gate Decision

Lane ID: `lane-wysiwyg-gate-decision`.

Owner for decision: `repo-project-control`, with later implementation owned by `repo-editor` only if accepted.

Goal: decide whether FlowDoc should progress from bounded authoring to direct page editing, and under which constraints.

Expected output:

- Accepted WYSIWYG definition.
- Prerequisite checklist for data model, selection, measurement, save, undo, preview, and compatibility.
- Decision between managed editable cards, bounded text islands, or broader editor integration.
- Explicit blocks for unsupported contenteditable shortcuts or rich editor package adoption.

Acceptance:

- The gate names what is allowed, blocked, and unknown.
- The gate does not authorize implementation until Project Control records the decision and product owners accept the lane.

## Recommended First Sequence

Start with `lane-frontend-product-map`. It is a Project Control lane, can be lean, and should not edit product repositories. Its job is to convert this roadmap into screen-level lane cards and acceptance targets that a later Editor WORK room can execute without inventing scope.

Then run `lane-design-workspace-usability` as the first Editor implementation lane after approval. It should use the product map as kickoff context, keep changes bounded to the Editor frontend, and return evidence candidates to PLAN before any truth promotion.

Keep Preview and Publish behind explicit evidence gates. They depend on Backend and Core state and should not be sold in the UI as ready while integration remains unknown.

Use `lane-wysiwyg-gate-decision` before any direct page editing expansion.

## Lane Card Starters

| Lane ID | Work Type | Owner | First deliverable | Must not do |
| --- | --- | --- | --- | --- |
| `lane-frontend-product-map` | `planning-coordination` plus `ux-design-exploration` | `repo-project-control` | Screen and action map for Library, Design, Preview, Publish | Edit product repositories |
| `lane-design-workspace-usability` | `product-implementation` plus `ux-design-exploration` | `repo-editor` | Workspace shell and authoring affordance implementation | Claim broad WYSIWYG readiness |
| `lane-progressive-authoring` | `product-implementation` | `repo-editor` | Bounded edit-region behavior | Add unsupported rich editing |
| `lane-preview-confidence` | `product-implementation` plus `verification` | `repo-editor`, `repo-backend`, `repo-core` | Draft and Published Preview lifecycle states | Imply publish or production readiness |
| `lane-publish-flow-binding` | `product-implementation` plus `cross-repo-compatibility` | `repo-editor`, `repo-backend`, `repo-core` | Review, submit, job, result, retry path | Enable publish without service evidence |
| `lane-frontend-polish-and-accessibility` | `product-implementation` plus `verification` | `repo-editor` | Visual QA, accessibility, responsive workflow checks | Treat visual taste as evidence |
| `lane-wysiwyg-gate-decision` | `decision` plus `planning-coordination` | `repo-project-control` | Accepted WYSIWYG direction and prerequisites | Start broad direct editing before acceptance |

## Stop Conditions

- A lane cannot identify owner repository, active role, Work Type, Checklist target, Evidence target, risks, and unknown state.
- A proposed product lane would change Core, Backend, or Editor outside its approved lane boundary.
- A frontend surface would claim current readiness, publish readiness, production readiness, or WYSIWYG readiness without accepted evidence.
- A WORK room cannot return automatically to PLAN with PASS, FAIL, BLOCKER, RISK, or UNKNOWN.
- The user would need to copy/paste handoffs or personally carry Project Control truth-promotion work.

## Intentionally Not Changed

- No product repository files change in this roadmap phase.
- No WORK rooms are opened by this roadmap phase.
- No FlowDoc map truth changes.
- No frontend readiness, WYSIWYG readiness, publish readiness, production readiness, or compatibility readiness is promoted.
- No Core, Backend, or Editor behavior is implemented.
- No production path is activated.

## Next Recommended Work

Open `lane-frontend-product-map` as the next Project Control lane. Its deliverable should be a screen-by-screen product map and kickoff packet for the first bounded Editor implementation lane.
