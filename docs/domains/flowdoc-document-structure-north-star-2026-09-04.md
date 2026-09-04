# FlowDoc Document Structure North Star v1

## Authority Boundary

Owner repository: `repo-project-control`.

Work path: `flowdoc-product-development-resumption > flowdoc-document-structure-north-star`.

This document records the Project Control product north star for FlowDoc
document-structure definition. It is a planning and terminology boundary for
future Core, Backend, and Editor lanes before product implementation continues.

This document is not implementation evidence. It does not prove Core runtime
behavior, Backend persistence or API behavior, Editor behavior, PDF generation,
renderer parity, frontend readiness, production readiness, FlowDoc product
truth, or map truth.

No product repository files change in this phase. Core, Backend, and Editor
remain the owners of product implementation behavior for later approved lanes.

## Work Context

Active role: `planning-partner`, with `documentation-authority-steward`
responsibility for the prose.

Current Phase: `phase-flowdoc-document-structure-north-star-v1`.

Checklist target: `checklist-flowdoc-document-structure-north-star-v1`.

Evidence target: `evidence-flowdoc-document-structure-north-star-2026-09-04`.

Work Type: `planning-coordination` plus `documentation-authority`.

Known risks:

- Future rooms may treat FlowDoc as a Word or Google Docs style editor.
- Future rooms may treat FlowDoc as a PDF-only system because PDF is the first
  constrained output target.
- A database model may mix document structure with runtime data, logs,
  generated files, permissions, or submission state.
- A product implementation lane may mistake this north star for evidence that
  Core, Backend, or Editor behavior already exists.

Unknown state:

- The product database schema for this document-structure model has not been
  implemented or verified.
- Core, Backend, and Editor adoption of this model remains unproven.
- PDF rendering from this model remains planned, not ready.

## North Star

FlowDoc is a document-structure definition system. Its first user-facing goal
is to let a creator define reusable document structure that a later caller can
fill with controlled data and render through an approved output target.

FlowDoc is not a Word or Google Docs style editor. It should not start from
unbounded free text, arbitrary page editing, or direct DOM/contenteditable
behavior. The creator works with structured document parts, fields, layout
choices, and controlled relationships.

FlowDoc is not a PDF-only system. PDF is the first renderer target because it
is the first constrained output FlowDoc needs to prove. The central product
model must stay output-aware but output-agnostic enough that later renderer
targets can consume the same structure relationship model.

The stable center of the product is the relationship between document
definition, section, Structure Pattern, Structure Pattern Slot, field, data
binding, style defaults, page profile, version, and publication. The first
database design should protect that relationship before optimizing for
authoring convenience.

## Product Roles

FlowDoc separates two product roles.

The structure creator defines the document structure. This role chooses the
document parts, section order, Structure Pattern Slots, fields, binding names,
style defaults, and page profiles that the system can support.

The downstream caller or user supplies data that matches the required contract.
That caller does not redefine the document structure. The caller can produce
Structure Pattern Entries from published Structure Pattern Slots when the
version allows repeatable or selectable structure. The caller provides the data
shape required by the published document version and receives an output from a
renderer target such as PDF.

The current north star is scoped to the structure creator and the document
structure model. Runtime data entry, submission processing, and generated
artifact lifecycle are later domains.

## Structure Relationship Model v0

`DocumentDefinition` is the top-level identity shown in the document library.
It represents one document-structure family and owns the draft structure,
metadata, reusable relationship, versions, and publications.

`Section` is a meaningful document-flow group. It can own section-level flow
rules such as visibility, repeat, page break, keep-together behavior, and
section-scoped style defaults.

`StructurePatternDefinition` is a reusable structured sub-layout with fields
and internal layout rules. It is the product term for the concept previously
discussed with the temporary word `component`.

`StructurePatternSlot` is the author-time relationship inside a document
section that says one Structure Pattern is allowed to appear there. It owns
order, local binding context, repeat allowance, and allowed local overrides
without changing the shared Structure Pattern definition.

`StructurePatternEntry` is a Preview or runtime occurrence created from a
Structure Pattern Slot. Entries are not placed by the creator during Build.
They belong to the later runtime/submission domain and can be zero, one, or
many depending on the caller data and the published version rules.

`FieldDefinition` names a data input required by a document section or
Structure Pattern. It describes the field key, label, type, requirement,
validation shape, and formatting intent that a later data contract can expose.

`DataBinding` connects a field or repeat rule to a named data path. The
structure model records the binding expectation, not the runtime data values.

`PageProfile` describes output-surface defaults such as size and orientation.
The document can set a default page profile, and a section can override it.
Structure Patterns do not change page orientation directly.

`StyleDefaults` are inherited defaults used to reduce repeated style
declaration. A section may provide typography, spacing, color role, density, or
label treatment defaults for child Structure Patterns, but these defaults do
not own Structure Pattern internals or renderer-specific commands.

## Relationship Rules For v0

The v0 Build composition path is:

```text
DocumentDefinition
  -> Section
  -> StructurePatternSlot
  -> StructurePatternDefinition
  -> FieldDefinition
  -> DataBinding
```

Preview and runtime can create `StructurePatternEntry` records or equivalent
submission items from one repeatable slot later. The Build model must not make
the creator place `A A A` copies to express user-entered repetition.

Structure Patterns do not contain active child Structure Patterns in v0. If a
real use case appears to need nesting, v0 should model it by creating another
Structure Pattern definition and arranging slots as siblings in a section.

Structure Pattern parent-child relationships may be prepared as a separate
relation table for future compatibility, but v0 validation and rendering
should keep that relationship inactive unless a later approved decision
enables it.

Section rules are document-flow rules, not Structure Pattern layout authority. A
section may control visibility, repeat, page profile override, page break, keep
together, and style defaults. It must not define Structure Pattern fields, edit
Structure Pattern internals, or hold fixed renderer coordinates.

## Build, Preview, Version, And Published Flow

The creator-facing flow must keep authoring and simulation separate.

`Document Structure Library` is the entry surface for choosing one
`DocumentDefinition`.

`Build` is the creator workspace for the editable draft. It may contain tabs
such as Document, Fields, Structure Patterns, and Settings, but those tabs
still operate on the same draft. The center of Build should show the document
as a real document surface. Structure details, fields, and slot controls appear
from selection or tab context; Build should not become a free-form Word or
Google Docs editor.

`Preview` is a separate simulation surface. It takes the draft or selected
version's fields and Structure Pattern Slots, generates a form-like input
surface, lets the user add Structure Pattern Entries when a slot allows it,
and shows the resulting document output.

In plain guard language: Build defines the slot; Preview or runtime creates
the entries. Preview is a separate simulation surface.

`Version` freezes the creator-approved draft as a baseline.

`Published` selects one frozen version for real use and exposes the integration
or API contract that later systems should follow.

## Draft, Version, And Publication

`Draft` is the editable working structure for one `DocumentDefinition`. The
draft is one-to-one with the document definition and can change while creators
are designing.

`DocumentVersion` is a frozen baseline created from the draft. A document
definition can have many versions. A version freezes the document sections,
Structure Pattern Slots, and resolved Structure Pattern versions needed to
render or validate that version later.

`Publication` is a pointer from a document definition to one frozen document
version that is selected for real use. Publishing must not mutate the frozen
version itself. A later rollback or channel change should update the
publication pointer, not rewrite version history.

For handoff language: DocumentVersion is a frozen baseline, and Publication is
a pointer to the selected baseline.

Creating a document version should automatically resolve referenced Structure
Pattern drafts into immutable Structure Pattern versions. Legacy v0.0.1
database docs may still call these component drafts. This freeze is automatic
for safety and creator convenience, but it does not automatically release
those Structure Pattern versions as reusable library releases.

## Product Database Boundary

The first product database design should use relational tables as the canonical
source for document-structure relationships. JSON render packages may exist as
compiled cache or transport snapshots, but they should not become the primary
truth for editable structure, version relationships, field discovery, reuse,
or validation.

The document-structure scope includes document definitions, sections,
Structure Pattern definitions, Structure Pattern Slots, fields, data bindings,
style defaults, page profiles, versions, publications, and prepared Structure
Pattern relationship tables.

Runtime data, submissions, logs, audit trails, generated files, and permissions
are out of scope for this document-structure model. Those domains may relate
to a published document version later, but they should not be mixed into the
structure tables during the first database design.

## First Renderer Boundary

PDF is the first renderer target. The first implementation slice may constrain
supported page profiles, section flow rules, and Structure Pattern layouts to
what the PDF renderer can honestly generate.

That PDF constraint must not redefine FlowDoc as PDF-only. The renderer reads
a frozen document version and data contract; it does not own the central
document-structure relationship model.

## Intentionally Not Changed

- No Core, Backend, or Editor files change in this phase.
- No product database schema is implemented in this phase.
- No migration, API route, renderer, PDF generation, or artifact storage is
  activated in this phase.
- No runtime data, log, audit, permission, submission, or generated-file model
  is designed here.
- No FlowDoc map truth changes.
- No product readiness, frontend readiness, publish readiness, or PDF readiness
  is promoted.

## Next Recommended Work

Use this north star as the input to a bounded `Document Structure Relationship
Database v0` design. That follow-up should map the structure-only tables,
foreign keys, cardinality, version freeze rules, publication pointer rules, and
v0 validation constraints before any product implementation lane opens.
