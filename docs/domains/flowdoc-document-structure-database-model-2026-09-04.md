# FlowDoc Document Structure Database Model v0.0.1

## Authority Boundary

Owner repository: `repo-project-control`.

Work path:
`flowdoc-product-development-resumption > flowdoc-document-structure-database-model`.

This document records the Project Control database relationship model for
FlowDoc document-structure definition v0.0.1. It is a planning and decision
document for table relationships, freeze rules, version boundaries, and
publication pointer behavior before product implementation lanes start.

This document is not a SQL migration, not a product database implementation,
not an API contract, not a renderer contract, and not implementation evidence.
It does not prove Core runtime behavior, Backend persistence or service
behavior, Editor behavior, PDF generation, renderer parity, frontend readiness,
production readiness, FlowDoc product truth, or map truth.

No product repository files change in this phase. Core, Backend, and Editor
remain the owners of product implementation behavior for later approved lanes.

## Work Context

Active role: `planning-partner`, with `documentation-authority-steward` and
`evidence-registrar` responsibilities for the Project Control records.

Current Phase: `phase-flowdoc-document-structure-database-model-v0-0-1`.

Checklist target:
`checklist-flowdoc-document-structure-database-model-v0-0-1`.

Evidence target:
`evidence-flowdoc-document-structure-database-model-2026-09-04`.

Work Type: `planning-coordination` plus `documentation-authority`.

Known risks:

- Future rooms may treat this model as enough to skip the later SQL migration
  and product persistence design.
- Future rooms may mix document-structure tables with runtime submission,
  generated artifact, audit, permission, workflow, billing, or integration
  domains too early.
- Future rooms may store only deltas in `document_versions` and lose the
  frozen relationship needed by later published use.
- Future rooms may confuse reusable component fields with per-document field
  occurrences.
- Future rooms may confuse author-time component instance table names with
  runtime repeated entries. The canonical product term is now Structure
  Pattern; the v0.0.1 `component_*` names are legacy database names that must
  be read as Structure Pattern definitions, slots, and versions.
- Future rooms may let `field_types` absorb format and validation concerns
  before those domains are designed.

Unknown state:

- The product database schema, migration, and repository-owned persistence
  code have not been implemented or verified.
- Core, Backend, and Editor adoption of this model remains unproven.
- Runtime Submission, generated PDF files, permissions, audit trails,
  workflow, billing, activity feed, and integrations remain out of scope for
  this v0.0.1 structure model.

## Model Goal

The v0.0.1 database model keeps the creator-owned document structure durable
enough to author, freeze, publish, and later consume without redefining
FlowDoc as a Word-style editor or as a PDF-only system.

The model answers these questions:

1. Where does the editable draft live?
2. How are sections, Structure Pattern Slots, Structure Pattern definitions,
   fields, page settings, style defaults, and binding expectations related?
3. What gets frozen into a version?
4. How does publication select a frozen version without rewriting history?
5. Which domains are deliberately left outside document structure?

This is a relationship model, not a DDL file. Names are stable enough for later
implementation planning, but a Backend implementation lane must still design
the exact migration, indexes, constraints, and storage engine behavior.

`FlowDoc Document Structure Database Model v0.0.2` now records the follow-up
Structure Pattern Slot and Structure Pattern Entry clarification. Use v0.0.2
for new planning, while keeping this v0.0.1 document as the recorded baseline
that explains the accepted Backend foundation and legacy `component_*` names.

## Core Decisions

`DocumentDefinition` is the top-level document-structure family shown in the
document library.

`DocumentDraft` is the editable normalized working structure. There is one
active draft for one `DocumentDefinition`.

`DocumentVersion` is a full immutable frozen structure, not a delta-only
record. A version must carry its own resolved sections, Structure Pattern
Slots, field occurrences, bindings, page settings, and style snapshots needed for
later validation and rendering.

`Publication` is a pointer from a `DocumentDefinition` to one frozen
`DocumentVersion`. Publishing does not mutate the version. Rollback or channel
change updates the pointer.

A published snapshot/cache may exist for render speed, transport, or API
convenience, but the published snapshot/cache is derived from the selected
version and must not become the canonical truth.

Actual submitted values are not stored in this structure model. Runtime data
belongs to a later `Runtime Submission` domain that references a publication
and resolved document version.

## Structure Pattern Terminology Clarification

The canonical product term for the former temporary `component` concept is
`Structure Pattern`.

The v0.0.1 database model and accepted Backend foundation still use
`component_*` table names because they were recorded before this terminology
clarification. Future rooms must translate those names as follows until a
later migration or aliasing decision renames them:

- `component_definitions` means Structure Pattern definitions.
- `component_drafts` means editable Structure Pattern drafts.
- `component_fields` means fields declared inside a Structure Pattern draft.
- `component_versions` means immutable Structure Pattern versions.
- `component_version_fields` means fields frozen inside one Structure Pattern
  version.
- `draft_component_instances` means author-time Structure Pattern Slots inside
  a draft section, not runtime repeated entries.
- `document_version_component_instances` means frozen Structure Pattern Slots
  inside one document version, not runtime repeated entries.

Runtime repeated data rows or user-added occurrences should be called
`Structure Pattern Entries`. They belong to a later Runtime Submission domain
and are not stored in this v0.0.1 document-structure model.

## Table Group Overview

```text
document_definitions
  -> document_drafts
    -> draft_sections
      -> draft_component_instances
        -> component_definitions
          -> component_drafts
            -> component_fields
          -> component_versions
            -> component_version_fields

document_definitions
  -> document_versions
    -> document_version_sections
      -> document_version_component_instances
        -> component_versions
    -> document_version_fields
    -> document_version_bindings

document_definitions
  -> document_publications
    -> document_versions
```

The draft side is normalized for editing. The version side is resolved and
immutable for later use.

In the table overview above, `draft_component_instances` and
`document_version_component_instances` are legacy table names for Structure
Pattern Slots. They are not the same thing as Preview or runtime Structure
Pattern Entries.

## Master And Support Tables

### `field_types`

`field_types` is a small master table for the broad value shape of a field.
The v0.0.1 seed values are:

- `text`
- `number`
- `date`
- `boolean`

Draft field records reference `field_type_id`. Version field records keep both
`field_type_id` and `field_type_snapshot` so a frozen version remains readable
if the master display name or later metadata changes.

There are no `format_types` and no `validation_rule_types` in v0.0.1. In
plain guard language: no format_types and no validation_rule_types.
Currency, email, phone, percent, URL, and similar concerns belong to a later
format or validation model, not the first pure `field_types` master.

### Other master tables

`component_kinds` classifies reusable Structure Pattern definitions at a broad
level. The table name is legacy v0.0.1 terminology.

`section_kinds` classifies document-flow sections at a broad level.

`binding_value_kinds` classifies binding expectations such as scalar value,
array/repeat context, object context, or derived placeholder intent.

`page_profiles` can provide presets such as common page sizes, but a section
or frozen version section must still store the actual page width and height,
unit, and orientation used for that structure. The preset is a convenience,
not the sole truth.

### `style_defaults`

`style_defaults` is a support table for section-scoped inherited style
defaults. It exists to reduce repeated child declarations. It does not own
Structure Pattern internals, fixed renderer coordinates, or renderer-specific
drawing commands.

A later implementation may split style defaults into `style_default_sets` and
`style_default_entries` if the style surface grows. For v0.0.1, the important
relationship is that section defaults can be edited in draft and frozen as a
snapshot on version sections.

## Document Draft Tables

### `document_definitions`

Represents one top-level document-structure family.

Important fields:

- `id`
- `workspace_id` or later tenant scope
- `title`
- `status`
- `created_at`
- `updated_at`

This is the object shown as a card in the document library. It owns the active
draft, many versions, and one or more publication pointers.

### `document_drafts`

Represents the editable working structure for one document definition.

Important fields:

- `id`
- `document_definition_id`
- `default_page_width`
- `default_page_height`
- `default_page_unit`
- `default_orientation`
- `created_at`
- `updated_at`

`document_definition_id` should be unique for the active draft path. Draft
history can be added later, but v0.0.1 keeps one editable draft per document
definition.

### `draft_sections`

Represents creator-owned document-flow groups in the draft.

Important fields:

- `id`
- `document_draft_id`
- `parent_draft_section_id`
- `section_kind_id`
- `section_key`
- `title`
- `sort_order`
- `page_width`
- `page_height`
- `page_unit`
- `orientation`
- `style_default_id`

`parent_draft_section_id` prepares a section tree. Top-level sections have no
parent. A valid draft must not allow cycles and must not let a section parent
cross the owning `document_draft_id`.

Page orientation may be portrait or landscape. The actual page width and
height live on the section when the section overrides the draft default.

## Structure Pattern Library Tables

### `component_definitions`

Represents one reusable Structure Pattern definition. The table name keeps the
v0.0.1 legacy `component_*` wording, but the product concept is Structure
Pattern.

Important fields:

- `id`
- `workspace_id` or later tenant scope
- `component_kind_id`
- `name`
- `status`
- `created_at`
- `updated_at`

Structure Pattern definitions are reusable across document definitions when
permission and workspace scope allow it. v0.0.1 does not design that
permission model.

### `component_drafts`

Represents the editable draft for one Structure Pattern definition.

Important fields:

- `id`
- `component_definition_id`
- `created_at`
- `updated_at`

Like document drafts, Structure Pattern drafts stay mutable until frozen.

### `component_fields`

Represents reusable fields declared by a Structure Pattern draft.

Important fields:

- `id`
- `component_draft_id`
- `field_key`
- `label`
- `field_type_id`
- `required`
- `sort_order`

`component_fields` are Structure Pattern-owned draft field definitions. They
do not store values and they do not know which document slot will reference
the Structure Pattern.

### `component_versions`

Represents an immutable frozen Structure Pattern definition.

Important fields:

- `id`
- `component_definition_id`
- `source_component_draft_id`
- `version_number`
- `version_label`
- `frozen_at`
- `snapshot_hash`

Creating a document version should automatically create or select the required
`component_versions` for every referenced Structure Pattern draft. The legacy
table name still says component, but the product concept is Structure Pattern.
This auto-create behavior protects the document version from later Structure
Pattern draft edits.

### `component_version_fields`

Represents fields frozen inside one Structure Pattern version.

Important fields:

- `id`
- `component_version_id`
- `source_component_field_id`
- `field_key`
- `label`
- `field_type_id`
- `field_type_snapshot`
- `required`
- `sort_order`

`component_version_fields` preserve the reusable Structure Pattern field
contract at the legacy component version table level. They are not the same as
`document_version_fields`, because the same Structure Pattern version can be
referenced by document slots with different binding context.

### `prepared_component_relations`

Represents a future parent-child relation between Structure Pattern
definitions.

Important fields:

- `id`
- `parent_component_definition_id`
- `child_component_definition_id`
- `relation_kind`
- `enabled`

This table is prepared for later, but it is inactive in v0.0.1. v0.0.1
authoring and rendering must not require active nested Structure Patterns. If
a real case appears to need nesting, first model it as sibling Structure
Pattern Slots or as another Structure Pattern definition until a later
decision activates this relationship.

## Draft Composition Tables

### `draft_component_instances`

Represents one author-time Structure Pattern Slot inside a draft section. The
table name is legacy v0.0.1 terminology and must not be read as a runtime
entry table.

Important fields:

- `id`
- `draft_section_id`
- `component_definition_id`
- `instance_key`
- `repeat_allowed`
- `sort_order`
- `binding_scope`

The slot owns order, repeat allowance, and local binding scope. It does not
alter the shared Structure Pattern definition. Build creates or edits slots;
Preview and runtime later create Structure Pattern Entries from slots.

## Document Version Tables

### `document_versions`

Represents a frozen baseline of one document definition.

Important fields:

- `id`
- `document_definition_id`
- `source_document_draft_id`
- `version_number`
- `version_label`
- `frozen_at`
- `snapshot_hash`
- `status`

`document_versions` should freeze the full resolved structure. A delta log may
be useful later for comparison, but delta-only version truth is not enough for
published use.

### `document_version_sections`

Represents a section frozen inside one document version.

Important fields:

- `id`
- `document_version_id`
- `source_draft_section_id`
- `parent_version_section_id`
- `section_kind_id`
- `section_kind_snapshot`
- `section_key`
- `title`
- `sort_order`
- `page_width`
- `page_height`
- `page_unit`
- `orientation`
- `style_defaults_snapshot`

`parent_version_section_id` preserves the draft section tree inside the frozen
version. A version section parent must stay inside the same
`document_version_id`.

### `document_version_component_instances`

Represents a frozen Structure Pattern Slot inside one version section. The
table name is legacy v0.0.1 terminology.

Important fields:

- `id`
- `document_version_section_id`
- `source_draft_component_instance_id`
- `component_definition_id`
- `component_version_id`
- `instance_key`
- `repeat_allowed`
- `sort_order`
- `binding_scope`

This table is the bridge between one document version and one resolved
Structure Pattern version. It lets the same Structure Pattern definition be
reused while each document version keeps the exact Structure Pattern version
it froze. It does not store runtime Structure Pattern Entries.

### `document_version_fields`

Represents resolved field occurrences inside one document version.

Important fields:

- `id`
- `document_version_id`
- `document_version_component_instance_id`
- `source_component_version_field_id`
- `field_key`
- `label`
- `field_type_id`
- `field_type_snapshot`
- `required`
- `sort_order`

`document_version_fields` exist because the same
`component_version_fields` can be referenced through different document slots.
The document version needs its own field occurrence records for API shape,
preview, validation, and binding discovery.

### `document_version_bindings`

Represents binding expectations for one document version field.

Important fields:

- `id`
- `document_version_id`
- `document_version_field_id`
- `binding_path`
- `binding_value_kind_id`
- `binding_value_kind_snapshot`
- `repeat_context`
- `required`

`document_version_bindings` store where data is expected to come from, not the
data itself. Actual submitted values belong to Runtime Submission later.

## Publication Tables

### `document_publications`

Represents the real-use pointer from a document definition to a selected
document version.

Important fields:

- `id`
- `document_definition_id`
- `document_version_id`
- `channel`
- `status`
- `published_at`
- `created_at`
- `updated_at`

Publication is a pointer. It should not duplicate the full version as truth.
A unique active publication per document definition and channel is likely
needed, but exact indexes belong to the implementation lane.

### Optional `document_publication_snapshots`

A later Backend implementation may add a cache table for fast renderer or API
read access.

Important fields could include:

- `id`
- `document_publication_id`
- `document_version_id`
- `snapshot_hash`
- `compiled_at`
- `cache_payload`

This published snapshot/cache is optional and derived. It must be rebuilt from
the selected version if stale.

## Version Freeze Flow

Creating a document version should follow this relationship flow:

```text
validate DocumentDraft
  -> validate draft_sections tree
  -> resolve draft_component_instances as Structure Pattern Slots
  -> auto-create or select component_versions
  -> freeze component_version_fields
  -> create document_versions
  -> clone draft_sections into document_version_sections
  -> preserve section tree with parent_version_section_id
  -> create document_version_component_instances as frozen Structure Pattern Slots
  -> resolve component_version_fields into document_version_fields
  -> create document_version_bindings
  -> optionally compile a published snapshot/cache after publication
```

The freeze must copy enough relationship data that the version can be read
later even if the draft, Structure Pattern draft, or master display names
change.

## Validation Rules For v0.0.1

- One `DocumentDefinition` has one active `DocumentDraft`.
- One `DocumentDefinition` can have many `DocumentVersion` records.
- One `DocumentDefinition` can have one active `document_publications` pointer
  per channel.
- `draft_sections.parent_draft_section_id` must stay inside the same
  `document_draft_id` and must not form cycles.
- `document_version_sections.parent_version_section_id` must stay inside the
  same `document_version_id` and must not form cycles.
- `draft_component_instances` must point to `component_definitions`, not
  directly to `component_drafts`; in product language this is a Structure
  Pattern Slot, not a runtime entry.
- Version creation resolves every slot to one `component_versions` record.
- `component_version_fields` preserve reusable Structure Pattern field
  contracts.
- `document_version_fields` preserve per-document field occurrences.
- `document_version_bindings` preserve expected data paths only.
- `field_types` stays pure: `text`, `number`, `date`, and `boolean` only in
  v0.0.1.
- No `format_types`, no `validation_rule_types`, and no runtime submitted data
  values are included in this model.

## Out Of Scope

- Runtime Submission records and actual submitted values.
- Runtime Structure Pattern Entries created from repeatable slots.
- Generated PDF files and generated artifact storage.
- Renderer jobs, queues, retries, and PDF bytes.
- Permission, access-control, sharing, and workspace rights.
- Workflow, approval, activity feed, notification, audit trail, billing, and
  integration endpoints.
- Dataset seeding, curated Structure Pattern promotion, and AI-assisted
  Structure Pattern creation.
- SQL migration files, production indexes, database engine tuning, and product
  repository implementation.

## Next Recommended Work

Use this v0.0.1 model as the Project Control input for a Backend-owned product
database implementation lane only after the PLAN room creates a bounded lane
card and Kickoff Packet.

Before opening another product lane, decide whether the next work should first
mock the creator-facing frontend around `DocumentDefinition`, sections,
Structure Pattern Slots, Structure Pattern Entries in Preview, and field
binding expectations. That frontend mock can pressure-test the structure model
without turning this document into product database truth.
