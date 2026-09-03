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
definition, section, component, field, data binding, style defaults, page
profile, version, and publication. The first database design should protect
that relationship before optimizing for authoring convenience.

## Product Roles

FlowDoc separates two product roles.

The structure creator defines the document structure. This role chooses the
document parts, section order, component instances, fields, binding names,
style defaults, and page profiles that the system can support.

The downstream caller or user supplies data that matches the required contract.
That caller does not redefine the document structure. The caller provides the
data shape required by the published document version and receives an output
from a renderer target such as PDF.

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

`ComponentDefinition` is a reusable structured sub-layout with fields and
internal layout rules. In v0 it must not contain another active component.
Recursive component composition is prepared for later relationship modeling,
but v0 rendering and authoring must treat components as non-recursive.

`ComponentInstance` is the placement of one component definition inside a
document section. It owns order, local binding context, and allowed local
overrides without changing the shared component definition.

`FieldDefinition` names a data input required by a component. It describes the
field key, label, type, requirement, validation shape, and formatting intent
that a later data contract can expose.

`DataBinding` connects a field or repeat rule to a named data path. The
structure model records the binding expectation, not the runtime data values.

`PageProfile` describes output-surface defaults such as size and orientation.
The document can set a default page profile, and a section can override it.
Components do not change page orientation directly.

`StyleDefaults` are inherited defaults used to reduce repeated style
declaration. A section may provide typography, spacing, color role, density, or
label treatment defaults for child components, but these defaults do not own
component internals or renderer-specific commands.

## Relationship Rules For v0

The v0 composition path is:

```text
DocumentDefinition
  -> Section
  -> ComponentInstance
  -> ComponentDefinition
  -> FieldDefinition
  -> DataBinding
```

Components do not contain active child components in v0. If a real use case
appears to need nested components, v0 should model it by creating another
component definition and arranging the components as siblings in a section.

Component parent-child relationships may be prepared as a separate relation
table for future compatibility, but v0 validation and rendering should keep
that relationship inactive unless a later approved decision enables it.

Section rules are document-flow rules, not component-layout authority. A
section may control visibility, repeat, page profile override, page break, keep
together, and style defaults. It must not define component fields, edit
component internals, or hold fixed renderer coordinates.

## Draft, Version, And Publication

`Draft` is the editable working structure for one `DocumentDefinition`. The
draft is one-to-one with the document definition and can change while creators
are designing.

`DocumentVersion` is a frozen baseline created from the draft. A document
definition can have many versions. A version freezes the document sections,
component instances, and resolved component definition versions needed to
render or validate that version later.

`Publication` is a pointer from a document definition to one frozen document
version that is selected for real use. Publishing must not mutate the frozen
version itself. A later rollback or channel change should update the
publication pointer, not rewrite version history.

For handoff language: DocumentVersion is a frozen baseline, and Publication is
a pointer to the selected baseline.

Creating a document version should automatically resolve referenced component
drafts into immutable component versions. This freeze is automatic for safety
and creator convenience, but it does not automatically release those component
versions as reusable library releases.

## Product Database Boundary

The first product database design should use relational tables as the canonical
source for document-structure relationships. JSON render packages may exist as
compiled cache or transport snapshots, but they should not become the primary
truth for editable structure, version relationships, field discovery, reuse,
or validation.

The document-structure scope includes document definitions, sections,
component definitions, component instances, fields, data bindings, style
defaults, page profiles, versions, publications, and prepared component
relationship tables.

Runtime data, submissions, logs, audit trails, generated files, and permissions
are out of scope for this document-structure model. Those domains may relate
to a published document version later, but they should not be mixed into the
structure tables during the first database design.

## First Renderer Boundary

PDF is the first renderer target. The first implementation slice may constrain
supported page profiles, section flow rules, and component layouts to what the
PDF renderer can honestly generate.

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
