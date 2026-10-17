# FlowDoc Document Structure Database Model v0.0.2

## Authority Boundary

Owner repository: `repo-project-control`.

Work path:
`flowdoc-product-development-resumption > flowdoc-document-structure-database-model > flowdoc-creator-ux-db-alignment-v0`.

This document records the Project Control v0.0.2 relationship model for
FlowDoc document-structure definition after the Structure Pattern
terminology clarification and creator UX alignment. It supersedes the
v0.0.1 product interpretation where legacy `component_instances` wording could
be confused with runtime repeated entries.

This document is a planning and database relationship decision. It is not a
SQL migration, not a product database implementation, not an API contract, not
a renderer contract, and not implementation evidence. It does not prove Core
runtime behavior, Backend persistence or service behavior, Editor behavior,
PDF generation, renderer parity, frontend readiness, production readiness,
FlowDoc product truth, or map truth.

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

- Future Backend work may keep legacy `component_*` names without an adapter
  and reintroduce the slot/entry ambiguity.
- Future rooms may freeze every Structure Pattern in the library instead of
  only Structure Patterns referenced by slots.
- Future rooms may let `record_json` become canonical truth even though the
  relationship model is intentionally relational.
- Future rooms may mix runtime submissions, generated files, audit,
  permissions, workflow, billing, or integrations into document structure.

Unknown state:

- Backend migration and service adoption of this v0.0.2 model has not been
  implemented or verified.
- Editor Build and Preview adoption of this v0.0.2 model has not been
  implemented or verified.
- Runtime Structure Pattern Entries, submitted values, PDF output, and
  publication API behavior remain later product domains.

## Model Goal

The v0.0.2 model keeps FlowDoc flexible without making the creator place final
runtime repetition inside Build.

The key correction is:

```text
Build defines Structure Pattern Slots.
Preview or runtime creates Structure Pattern Entries from those slots.
```

This keeps document structure separate from submitted data while still letting
a published version tell later callers exactly what can repeat, how many
entries are allowed, where those entries live, and which fields each entry
requires.

## Relationship Overview

```text
document_definitions
  -> document_drafts
    -> draft_sections
      -> draft_structure_pattern_slots
        -> structure_pattern_definitions
          -> structure_pattern_drafts
            -> structure_pattern_fields

document_definitions
  -> document_versions
    -> document_version_sections
      -> document_version_structure_pattern_slots
        -> structure_pattern_versions
          -> structure_pattern_version_fields
    -> document_version_fields
    -> document_version_bindings

document_definitions
  -> document_publications
    -> document_versions
```

The draft side is normalized for creator editing. The version side is a full
immutable snapshot of the resolved structure. Publication is a pointer to a
frozen version.

## Table Group Summary

### `document_definitions`

Top-level document-structure family shown in the document library.

Important relationships:

- one active `document_drafts`
- many `document_versions`
- one active `document_publications` pointer per channel

### `document_drafts`

Editable working structure for one document definition.

Important relationships:

- one `document_definition_id`
- many `draft_sections`
- optional document-level `draft_fields`

### `draft_sections`

Creator-owned document-flow groups.

Important fields include `parent_draft_section_id`, `section_key`,
`sort_order`, page width and height, orientation, and section
`style_defaults`.

Sections may be flat ordered groups or a parent-child tree. The parent
relationship must stay inside the same document draft and must not form cycles.

### `draft_fields`

Draft fields owned directly by the document or a section.

Important fields:

- `id`
- `document_draft_id`
- `owner_kind`
- `owner_id`
- `field_key`
- `label`
- `field_type_id`
- `required`
- `sort_order`

`owner_kind` is limited to document or section in this structure model.
Structure Pattern fields live under `structure_pattern_fields`.

### `structure_pattern_definitions`

Reusable creator-defined document sub-structure.

Important relationships:

- one active `structure_pattern_drafts`
- many `structure_pattern_versions`
- reusable across document definitions when later permission and workspace
  scope allow it

### `structure_pattern_drafts`

Editable draft for one Structure Pattern definition.

It stores layout rules and owns `structure_pattern_fields`. It is not placed
many times in Build. Slots reference the definition.

### `structure_pattern_fields`

Fields declared inside one Structure Pattern draft.

Important fields:

- `id`
- `structure_pattern_draft_id`
- `field_key`
- `label`
- `field_type_id`
- `required`
- `sort_order`

These fields do not store values and do not know which document slot will use
the Structure Pattern.

### `draft_structure_pattern_slots`

Author-time relationship inside a draft section.

Important fields:

- `id`
- `draft_section_id`
- `structure_pattern_definition_id`
- `slot_key`
- `label`
- `sort_order`
- `binding_scope`
- `repeat_mode`
- `min_entries`
- `max_entries`
- `required`
- `layout_region_key`
- `flow_mode`
- `overflow_behavior`
- `keep_together`

The slot owns how a Structure Pattern may appear in that document location.
It defines how many entries are allowed and which bounded area they belong to.

`repeat_mode` should stay simple in v0.0.2: `single` or `repeatable`.
`required`, `min_entries`, and `max_entries` express the count policy. For a
required single item, use `repeat_mode = single`, `required = true`,
`min_entries = 1`, and `max_entries = 1`.

`layout_region_key` identifies the bounded document area for the entries
created from this slot. `flow_mode` describes how entries flow, such as
`inline`, `block`, `table_rows`, or `page_flow`. `overflow_behavior` describes
whether overflow can continue, move to a new page, clip, or reject. These are
structure rules, not submitted values.

## Version Tables

### `document_versions`

Frozen baseline of one document definition.

A version is a full immutable structure snapshot, not delta-only truth.

### `document_version_sections`

Frozen section records inside one document version. They preserve the section
tree, page size, orientation, and style defaults snapshot.

### `structure_pattern_versions`

Immutable version of one Structure Pattern definition.

Creating a document version must auto-create or select Structure Pattern
Versions for only Structure Patterns referenced by slots in the draft being
frozen. In plain guard language: freeze only Structure Patterns referenced by
slots, not the whole library.

### `structure_pattern_version_fields`

Frozen fields inside one Structure Pattern version.

They preserve the reusable field contract for a Structure Pattern version, but
they are not the same as document-level field occurrences.

### `document_version_structure_pattern_slots`

Frozen author-time slot records inside one document version section.

Important fields:

- `id`
- `document_version_section_id`
- `source_draft_structure_pattern_slot_id`
- `structure_pattern_definition_id`
- `structure_pattern_version_id`
- `slot_key`
- `label`
- `sort_order`
- `binding_scope`
- `repeat_mode`
- `min_entries`
- `max_entries`
- `required`
- `layout_region_key`
- `flow_mode`
- `overflow_behavior`
- `keep_together`

This is the resolved relationship between a document version location and one
Structure Pattern Version. It is still not a runtime entry table.

### `document_version_fields`

Resolved field occurrences inside one document version.

Important fields:

- `id`
- `document_version_id`
- `owner_kind`
- `owner_version_id`
- `source_field_id`
- `source_field_kind`
- `field_key`
- `label`
- `field_type_id`
- `field_type_snapshot`
- `required`
- `sort_order`

`owner_kind` can identify document, section, or structure pattern slot
ownership in the frozen version. `source_field_id` and `source_field_kind`
allow the version field to trace back to either `draft_fields` or
`structure_pattern_version_fields`.

### `document_version_bindings`

Expected data paths for version fields.

Important fields:

- `id`
- `document_version_id`
- `document_version_field_id`
- `binding_path`
- `binding_value_kind_id`
- `binding_value_kind_snapshot`
- `repeat_context`
- `required`

Bindings store where data is expected to come from. They do not store actual
submitted values.

## Slot-Driven Freeze Flow

Creating a document version should follow this slot-driven freeze flow:

```text
validate DocumentDraft
  -> validate draft_sections tree
  -> validate draft_structure_pattern_slots
  -> collect only Structure Patterns referenced by slots
  -> auto-create or select structure_pattern_versions
  -> freeze structure_pattern_version_fields
  -> create document_versions
  -> clone draft_sections into document_version_sections
  -> clone draft_structure_pattern_slots into document_version_structure_pattern_slots
  -> freeze draft_fields into document_version_fields
  -> expand structure_pattern_version_fields into document_version_fields per frozen slot
  -> create document_version_bindings
  -> compute snapshot_hash
```

This is the v0.0.2 slot-driven freeze rule. It avoids freezing unused library
patterns and preserves enough relationship data that a published version can
be read later even if the draft or Structure Pattern draft changes.

## Relational Truth And JSON Boundary

The document-structure model is relational first. Draft editing, version
relationships, field discovery, reuse, publication selection, and validation
should be read from the relationship tables.

Compiled JSON packages may exist as transport payloads, render caches, or
published snapshots. They are derived from the selected version and can be
rebuilt. In plain guard language: record_json must not become canonical truth.

If a Backend implementation keeps a `record_json` column for compatibility, it
should be treated as a cache or compatibility payload unless a later approved
decision explicitly changes the source-of-truth boundary.

## Compatibility With v0.0.1 And Backend Foundation

The accepted Backend v0.0.1 foundation uses legacy names such as
`component_definitions`, `component_drafts`, `component_fields`,
`component_versions`, `component_version_fields`, `draft_component_instances`,
and `document_version_component_instances`.

Those names should now be translated as:

- `component_definitions` -> `structure_pattern_definitions`
- `component_drafts` -> `structure_pattern_drafts`
- `component_fields` -> `structure_pattern_fields`
- `component_versions` -> `structure_pattern_versions`
- `component_version_fields` -> `structure_pattern_version_fields`
- `draft_component_instances` -> `draft_structure_pattern_slots`
- `document_version_component_instances` ->
  `document_version_structure_pattern_slots`

A later Backend lane can either rename tables through migration or keep legacy
physical names behind a service/domain alias. The product-facing contract
should expose Structure Pattern terms.

## Runtime Boundary

Runtime Structure Pattern Entries are out of scope for this document-structure
database model.

Future runtime or submission tables may reference:

```text
document_publications
  -> document_versions
    -> document_version_structure_pattern_slots
      -> runtime_structure_pattern_entries
        -> runtime field values
```

That future relationship must not move submitted values into draft or version
structure tables.

## Validation Rules For v0.0.2

- One `DocumentDefinition` has one active `DocumentDraft`.
- One `DocumentDefinition` can have many `DocumentVersion` records.
- One `DocumentDefinition` can have one active publication pointer per channel.
- A section parent must stay inside the same draft or version and must not
  form cycles.
- A draft slot must reference a Structure Pattern definition.
- A version slot must reference a Structure Pattern Version resolved at freeze
  time.
- Version creation freezes only Structure Patterns referenced by slots.
- A slot defines count policy through `repeat_mode`, `required`,
  `min_entries`, and `max_entries`.
- A slot defines area behavior through `layout_region_key`, `flow_mode`,
  `overflow_behavior`, and `keep_together`.
- `document_version_fields` are per-version field occurrences.
- `document_version_bindings` store expected data paths only.
- `field_types` remains pure: `text`, `number`, `date`, and `boolean` in the
  first model; format and validation masters remain deferred.
- Runtime Structure Pattern Entries, actual submitted values, generated
  artifacts, permissions, workflow, audit, activity, billing, and integrations
  remain outside this structure model.

## Intentionally Not Changed

- No SQL migration complete claim is made.
- No Core, Backend, or Editor files change in this phase.
- No product database schema is implemented in this phase.
- No Backend service/API, Editor UI, Core renderer contract, PDF generation,
  or artifact storage is implemented.
- No runtime submission table, runtime submitted values, generated file,
  permission, workflow, audit, activity, billing, or integration model is
  implemented.
- No FlowDoc product truth, frontend readiness, publish readiness, PDF
  readiness, or production readiness is promoted.

## Next Recommended Work

Use this v0.0.2 model as the Project Control input for the next owner-specific
lane. The smallest useful options are:

- Backend lane: rename or alias legacy `component_*` domain terms to
  Structure Pattern terms, add slot repeat policy and layout boundary fields,
  and ensure version freeze reads from relational tables rather than making
  JSON the effective truth.
- Editor lane: implement or prototype the Build and Preview split so Build
  defines Structure Pattern Slots and Preview creates Structure Pattern
  Entries from those slots.

Either lane must receive a bounded Kickoff Packet from PLAN before product
repository edits begin.
