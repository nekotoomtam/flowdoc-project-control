# FlowDoc Creator UX Contract v0

## Current clarification — 2026-09-05

The user clarified that Preview must be an interactive document simulation:
permitted simulation values can be edited on the visible document itself.
This clarification supersedes the earlier form-beside-result interpretation.
Build remains controlled structure authoring. See
`flowdoc-preview-definition-correction-2026-09-05.md` for the decision and
acceptance scenarios. This is a requirement correction, not implementation
evidence or authorization to merge Build and Preview.

## Authority Boundary

Owner repository: `repo-project-control`.

Work path:
`flowdoc-product-development-resumption > flowdoc-document-structure-database-model > flowdoc-creator-ux-db-alignment-v0`.

This document records the Project Control creator-facing UX contract for the
document-structure flow discussed on 2026-09-04. It is a planning and product
relationship decision for how the creator should move between the document
library, Build, Preview, Versions, and Published/API surfaces.

This document is not frontend implementation evidence, not a Figma design, not
a browser-ready UI, not a product database implementation, not a SQL migration,
not an API contract, and not renderer evidence. It does not prove Core runtime
behavior, Backend persistence or service behavior, Editor behavior, PDF
generation, frontend readiness, product readiness, FlowDoc product truth, or
map truth.

No product repository files change in this phase. Core, Backend, and Editor
remain the owners of product implementation behavior for later approved lanes.

## Work Context

Active role: `planning-partner`, with `documentation-authority-steward` and
`evidence-registrar` responsibilities for the Project Control records.

Current Phase: `phase-flowdoc-creator-ux-db-alignment-v0`.

Checklist target: `checklist-flowdoc-creator-ux-db-alignment-v0`.

Evidence target: `evidence-flowdoc-creator-ux-db-alignment-v0-2026-09-04`.

Work Type: `planning-coordination` plus `documentation-authority`.

Known risks:

- Future rooms may collapse Build and Preview into one editor surface and make
  the creator enter runtime data too early.
- Future rooms may treat Structure Pattern Slots as runtime repeated entries.
- Future rooms may make the Build page behave like a Word or Google Docs style
  editor instead of a controlled document-structure builder.
- Future rooms may treat this UX contract as proof that the Editor already
  implements the flow.

Unknown state:

- The Editor implementation for this flow has not been built or verified.
- The Backend database/API adoption of the v0.0.2 relationship model remains
  unimplemented and unverified.
- Preview data entry, runtime submission, generated PDF files, and Published
  API behavior remain later product domains.

## Product Flow

The creator-facing product flow is:

```text
Document Structure Library -> Build -> Preview -> Versions -> Published/API
```

`Document Structure Library` is the card or list surface for choosing one
`DocumentDefinition`.

`Build` is draft authoring. It is the workspace for defining the document
structure, fields, Structure Patterns, Structure Pattern Slots, page defaults,
section rules, and binding expectations.

`Preview` is interactive document simulation. It takes a draft or frozen
version, lets the user edit permitted field values on the visible document,
add Structure Pattern Entries where allowed, and see the document update.

`Versions` is version inspection and freeze history. A creator can create a
new frozen baseline from the current draft, inspect prior versions, and preview
one selected version without mutating it.

`Published/API` is the real-use selection surface. Publication points from one
DocumentDefinition to one frozen DocumentVersion for a channel, and exposes the
data contract or API-facing shape that later systems should follow.

## Build Surface Contract

Build is draft authoring, not runtime data entry.

The Build layout should keep three stable areas:

- Left side: document outline, sections, and selected structure location.
- Center: `Document Surface`, shown as a real document-like page or page flow.
- Right side: inspector controls for the selected document, section, field,
  Structure Pattern, or Structure Pattern Slot.

The Build workspace may use these primary tabs:

- `Document`: document surface, outline, sections, page defaults, and section
  structure.
- `Fields`: document-level and section-level field definitions plus binding
  expectations.
- `Structure Patterns`: creator-defined reusable sub-structures with their own
  fields and internal layout rules.
- `Settings`: document metadata, page profile defaults, style defaults, and
  safe global options.

The center of Build must show the document as a real structure surface. The
creator should be able to click a visible document part, then edit the selected
section, field, or slot through contextual controls.

Build may place a Structure Pattern Slot in a section. It must not require the
creator to place `A A A` copies of the same Structure Pattern to express
future repeated runtime data.

In plain guard language: Build defines the slot; Preview or runtime creates
the entries.

## Preview Surface Contract

Preview is a separate simulation surface.

Preview reads the current draft or a selected frozen version. Its document
surface provides controlled editing of simulation values from document fields,
section fields, Structure Pattern Slots, and their allowed repeat rules.

When a slot allows repetition, Preview may show an add action that creates a
Structure Pattern Entry for that slot. Removing, reordering, or changing those
entries is Preview data behavior only. It does not mutate the Build draft and
does not create author-time slots.

The user must be able to select a permitted field on the document, change its
simulation value there, and see the filled document update without generating
a PDF first. Supporting Form/JSON controls may coexist, but a separate form
beside a read-only result is insufficient. A PDF viewer or read-only canvas
alone is also insufficient. Layout boundaries, repeated entries, and overflow
must be observable on the simulated document before freezing a version.

Direct simulation editing is a required product outcome. Existing WYSIWYG
gates still require a safe implementation contract, but must not silently
replace this outcome with PDF display or defer it out of Preview acceptance.
Missing prerequisites must be reported explicitly. Editing simulation values
does not authorize changing Build structure or unrestricted rich-text editing.

Preview data is not runtime submission truth and is not persisted as actual
submitted values in the document-structure model.

## Version And Publication Contract

Version freezes the approved draft as a baseline.

A `DocumentVersion` must freeze the document sections, Structure Pattern Slots,
resolved Structure Pattern Versions, field occurrences, bindings, page
settings, and style snapshots needed to read, validate, or preview that version
later.

Publication points from a DocumentDefinition to one frozen DocumentVersion.
Publication does not mutate the version and does not copy the full version as
canonical truth. Any published cache or snapshot is derived and rebuildable.

The Versions page may offer Preview for any frozen version. The Published/API
page may expose the selected version's API/data shape after publication.

## UX-To-Database Alignment

The UX contract requires the database model to separate three things:

- Structure Pattern: the reusable sub-structure definition.
- Structure Pattern Slot: the author-time location and repeat policy inside a
  document section.
- Structure Pattern Entry: the Preview or runtime occurrence created from a
  slot.

The Build page creates and edits Structure Patterns, fields, sections, and
slots. The Preview page creates temporary Structure Pattern Entries. Runtime
Submission later creates durable entries or equivalent submitted data records
against a published version.

This split prevents the database model from turning a flexible document
structure into a fixed template where the creator has already placed every
future repeated item.

## Intentionally Not Changed

- No Core, Backend, or Editor files change in this phase.
- No frontend screen, route, component, or browser behavior is implemented.
- No product database schema, SQL migration, API route, renderer, PDF
  generation, or artifact storage is implemented.
- No runtime submission, submitted value, generated file, permission,
  workflow, audit, activity, billing, or integration model is implemented.
- No FlowDoc product truth, frontend readiness, publish readiness, PDF
  readiness, or production readiness is promoted.

## Next Recommended Work

Use this UX contract together with
`FlowDoc Document Structure Database Model v0.0.2` before opening the next
Editor or Backend WORK lane. The next product implementation lane should pick
one owner repository and one narrow surface: either an Editor Build/Preview
prototype that obeys this split, or a Backend schema/service revision that
renames or aliases legacy `component_*` concepts into Structure Pattern terms.
