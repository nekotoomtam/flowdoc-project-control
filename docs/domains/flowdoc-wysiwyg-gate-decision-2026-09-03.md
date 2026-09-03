# FlowDoc WYSIWYG Gate Decision v1

## Authority Boundary

Owner repository: `repo-project-control`.

Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-wysiwyg-gate-decision`.

This document is the Project Control decision record for the next FlowDoc WYSIWYG gate. It decides the planning boundary for later frontend and authoring lanes before any direct page editing expansion.

This decision is planning context, not product truth. It does not prove frontend readiness, WYSIWYG readiness, publish readiness, production readiness, Core runtime behavior, Backend service behavior, Editor behavior, compatibility, renderer parity, PDF output, or map truth.

No product repository files change in this decision lane. Core, Backend, and Editor remain product implementation owners for later approved lanes.

## Work Context

- Lane ID: `lane-wysiwyg-gate-decision`
- Work ID: `flowdoc-wysiwyg-gate-decision`
- Work Type: `decision` plus `planning-coordination`
- Active role: `planning-partner`, with `project-control-steward`, `documentation-authority-steward`, and cross-repo boundary review responsibilities
- Current Phase: `phase-flowdoc-wysiwyg-gate-decision-v1`
- Checklist target: `checklist-flowdoc-wysiwyg-gate-decision-v1`
- Evidence target: `evidence-flowdoc-wysiwyg-gate-decision-2026-09-03`
- Source roadmap: `docs/domains/flowdoc-frontend-expert-roadmap-2026-09-03.md`
- Source product map: `docs/domains/flowdoc-frontend-product-map-2026-09-03.md`

Lookup note: `lane-wysiwyg-gate-decision` is the dispatch lane ID, while `flowdoc-wysiwyg-gate-decision` is the durable Project Control Work ID for this decision record.

Known risks:

- A WYSIWYG label may be mistaken for current direct editing behavior.
- Managed editable cards or bounded text islands may be widened into contenteditable shortcuts without the prerequisite checks.
- Rich editor package adoption may bypass FlowDoc ownership, save, preview, undo/redo, compatibility, and accessibility gates.
- Preview, publish, or production wording may imply readiness that remains unknown.

Unknown state:

- Broad Editor runtime and UI behavior remain `unknown` until an Editor-owned lane proves the exact path.
- Full-document contenteditable, table/cell surface editing, media surface editing, direct preview typing, and rich editor engine integration remain `unknown` and blocked for implementation.
- End-to-end Editor to Backend to Core save, preview, publish, and artifact behavior remain unpromoted outside accepted evidence.
- Production remains NO-GO until a later evidence-backed decision changes that state.

## Existing Boundary Review

Project Control already records a narrower Editor WYSIWYG gate definition at `evidence-editor-wysiwyg-gate-definition-2026-08-31`. That evidence says FlowDoc WYSIWYG means managed document-surface authoring, preserves Hybrid Managed Cards plus one Active Text-Block Island as the accepted direction for that Editor gate, and explicitly states that a bounded textarea active text-block island is not WYSIWYG.

Core Template Builder records also keep the authoring boundary narrow. `docs/versions/V0_1_0a_1/core/template-builder/wysiwyg-draft-input-and-guards.md` records textarea-first active draft input, browser-local selection, IME composition guards, and planning-only toolbar or field affordances. `docs/versions/V0_1_0a_1/core/template-builder/rich-inline-commit-and-session-lifecycle.md` records contenteditable-like segment and range facts as bounded local planning or in-memory sandbox evidence, not production contenteditable input, durable persistence, collaboration, renderer output, or export parity.

This v1 decision preserves those boundaries and raises them into the new frontend roadmap context. It does not replace owner-repository evidence, and it does not promote the older Editor or Core records into broad FlowDoc product truth.

## Decision

WYSIWYG gate remains closed.

FlowDoc may continue toward progressive authoring only through managed, bounded authoring surfaces that keep the document model, selection, save, undo/redo, preview, compatibility, and accessibility responsibilities explicit.

The allowed direction for later lanes is:

- Managed Editable Cards for structure-aware regions where the card owns commands, validation, disabled states, and save eligibility.
- Bounded Text Islands for text-bearing regions where the backing `Editor draft`, Core runtime node, save path, and unsupported behaviors are explicit.
- Disabled or unavailable UI for rich behavior that lacks accepted evidence.
- Project Control acceptance before any later lane claims WYSIWYG behavior, direct page editing, or richer authoring readiness.

The blocked direction is:

- Full-document contenteditable remains blocked.
- Rich editor package adoption remains blocked for Slate, ProseMirror, TipTap-style, or similar engines until a later Contract Change Request is accepted.
- Direct preview typing, DOM innerHTML document truth, hidden contenteditable shortcuts, table/cell surface editing, media surface editing, drag-to-edit layout mutation, and broad clipboard rich-paste behavior remain blocked.
- Any implementation lane that needs Core mutation changes, Backend persistence or preview changes, product-wide contract changes, or map-truth updates must return a Contract Change Request.

## Definitions

### WYSIWYG

For this roadmap, WYSIWYG means managed document-surface authoring where the user edits a visual document surface and the system can prove how the edit maps to FlowDoc-owned document state, save state, preview state, undo/redo state, and compatibility boundaries.

A bounded textarea active text-block island is not WYSIWYG. It can be useful progressive authoring, but it remains a bounded text input surface until the WYSIWYG prerequisites below are met and accepted.

### Managed Editable Cards

Managed Editable Cards are structure-aware UI regions such as sections, columns, text blocks, tables, or media placeholders where commands are explicit and validation is owned by the later product lane. A card can show controls, disabled reasons, dirty state, and save eligibility without letting arbitrary DOM edits become document truth.

Managed Editable Cards are the preferred next authoring direction because they preserve ownership and failure states.

### Bounded Text Islands

Bounded Text Islands are local text input regions tied to a specific text-bearing document item. They may use textarea-first behavior, bounded selection, IME guards, and explicit commit paths. A text island must name its backing source, base revision, allowed commands, unsupported marks or atomic children, and save boundary.

Bounded Text Islands may be used before broad WYSIWYG only when they stay visibly scoped and do not claim direct page editing readiness.

### Contenteditable Shortcuts

Contenteditable shortcuts are any direct DOM editing path that lets typed or pasted page content become document state without the approved data model, selection, measurement, save, undo/redo, preview, compatibility, and accessibility prerequisites.

Those shortcuts remain blocked.

### Rich Editor Package Adoption

Rich editor package adoption means adding a general rich editor engine such as Slate, ProseMirror, TipTap-style, or similar packages as the primary document authoring model.

That adoption remains blocked until Project Control accepts a Contract Change Request naming ownership, Core package mapping, Backend persistence and revision behavior, Editor draft shape, preview and renderer boundaries, accessibility risks, migration risks, dependency risks, and verification gates.

## Prerequisite Checklist

Before PLAN may open a product implementation lane that claims WYSIWYG or direct page editing behavior, Project Control must have accepted evidence for each prerequisite:

| Prerequisite | Required before opening WYSIWYG implementation |
| --- | --- |
| data model | Core-owned document representation for each editable structure and inline form, including unsupported cases and migration or version boundaries. |
| selection | Editor-owned selection model that maps UI focus, caret, ranges, nested targets, IME composition, and unavailable states without DOM truth shortcuts. |
| measurement | Renderer or layout measurement boundary that says what visual editing can rely on and what remains stale, approximate, or unknown. |
| save | Backend and Editor save path for supported edits, including revision checks, conflict states, rejected operations, retry, and local draft preservation. |
| undo/redo | Editor and Core-compatible history model for accepted edits, rejected edits, stale plans, replay, and restore limits. |
| preview | Draft Preview and Published Preview states tied to source document, generation lifecycle, stale signals, diagnostics, and artifact availability. |
| compatibility | Accepted Core, Backend, and Editor compatibility evidence for the exact package versions, operations, routes, and fixture or live Backend mode used. |
| accessibility | Keyboard, focus, screen-reader, IME, reduced-motion, contrast, and mobile or narrow viewport behavior that does not trap users in an editing surface. |
| evidence | Project Control Evidence packet with repository id, exact commit, path or contract id, verification summary, and claims intentionally not promoted. |

If any prerequisite is missing, the implementation lane must stay with managed editable cards or bounded text islands and mark the missing state as `blocked`, `unavailable`, `risk`, or `unknown`.

## Owner Responsibilities

Project Control owns this decision, future lane boundaries, Checklist targets, Evidence targets, and truth-promotion discipline.

Editor owns the browser runtime, visible workspace, `Editor draft`, selection, focus, command presentation, disabled states, local dirty state, accessibility behavior, and any eventual WYSIWYG UI implementation.

Core owns document package semantics, Core runtime node structure, mutation results, inline representation, package version behavior, migration boundaries, and any model-level authoring contract.

Backend owns Backend document records, Backend revision checks, persistence, service routes, preview or publish job lifecycle, artifact references, and save or retry behavior when the implementation needs durable service state.

No single owner may bypass another owner by treating local DOM state, a package glossary, a Project Control plan, or a design artifact as product truth.

## Lane Rules For Later Work

Later `lane-design-workspace-usability` work may show bounded edit regions, managed cards, disabled controls, selected-region status, and unavailable WYSIWYG actions. It must not implement direct page editing or hidden contenteditable shortcuts.

Later `lane-progressive-authoring` work may implement bounded text islands or managed card commands only after the owner lane names its Core, Editor, Backend, preview, save, and undo/redo boundaries. If the lane needs broader WYSIWYG, it must stop for a Contract Change Request.

Later Preview and Publish lanes must keep preview and publish evidence separate from WYSIWYG. Preview is not WYSIWYG by itself, and Publish is not proof that direct editing is safe.

## Stop Conditions

Stop and return to PLAN when:

- Existing WYSIWYG boundary evidence conflicts with the proposed implementation direction.
- A lane would authorize full-document contenteditable, rich editor engine adoption, direct preview typing, or DOM innerHTML document truth.
- Core mutation, Backend persistence, Editor runtime, preview, publish, or compatibility behavior needs a cross-repository contract change.
- A product lane cannot identify owner repository, active role, Work Type, Checklist target, Evidence target, risks, unknowns, and return channel.
- Any claim would promote frontend readiness, WYSIWYG readiness, publish readiness, production readiness, compatibility, FlowDoc product truth, or map truth without accepted evidence.

## Intentionally Not Changed

- No product repository files change in this decision lane.
- No runtime UI implementation is performed by this decision lane.
- No Core, Backend, or Editor behavior is changed.
- No FlowDoc system map or DOCUMENT_MAP entry is updated with planned outcomes.
- No frontend readiness, WYSIWYG readiness, publish readiness, production readiness, compatibility readiness, or FlowDoc product truth is promoted.
- No additional WORK rooms are opened by this decision lane.

## Next Recommended Work

PLAN should process this handoff through `acceptanceGate`. If accepted, PLAN may use this decision as required context for `lane-design-workspace-usability` and any later `lane-progressive-authoring` packet. Direct page editing, contenteditable shortcuts, and rich editor package adoption should remain unavailable until a later accepted lane proves every prerequisite above.
