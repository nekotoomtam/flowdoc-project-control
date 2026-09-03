# FlowDoc Product Domain Relationship v0

## Authority Boundary

Owner repository: `repo-project-control`.

Work path:
`flowdoc-product-development-resumption > flowdoc-product-domain-relationship`.

This document records the Project Control product-domain relationship map for
FlowDoc. It is a domain-level relationship map and reading router: it names
the major product domains, describes how they relate at a high level, and tells
future rooms which follow-up domain documents to read before detailed design or
implementation.

This document is not a full database schema, migration plan, API contract,
renderer contract, implementation evidence, product readiness evidence, or
production readiness evidence. It does not prove Core runtime behavior,
Backend persistence or service behavior, Editor behavior, generated PDF
behavior, workflow behavior, permission behavior, billing behavior, or external
integration behavior.

No product repository files change in this phase. Core, Backend, and Editor
remain the owners of product implementation behavior for later approved lanes.

## Work Context

Active role: `planning-partner`, with `documentation-authority-steward`
responsibility for the prose.

Current Phase: `phase-flowdoc-product-domain-relationship-v0`.

Checklist target: `checklist-flowdoc-product-domain-relationship-v0`.

Evidence target: `evidence-flowdoc-product-domain-relationship-2026-09-04`.

Work Type: `planning-coordination` plus `documentation-authority`.

Known risks:

- Future rooms may try to design every domain schema before the next useful
  implementation lane.
- Future rooms may treat this domain map as product readiness or a complete
  system contract.
- Future rooms may mix document-structure tables with runtime submission,
  generated file, audit, permission, workflow, or billing tables too early.
- Future rooms may call the internal domain model a hierarchical data model
  and accidentally imply the whole FlowDoc product relationship is one tree.

Unknown state:

- The internal relationship database for each domain has not been designed,
  implemented, or verified.
- Core, Backend, and Editor adoption of the domain relationship map remains
  unproven.
- Runtime submission, rendering, generated artifact, workflow, permission,
  audit, activity, billing, and integration behavior remain planned or unknown
  unless a narrower evidence record says otherwise.

## Purpose

`FlowDoc Product Domain Relationship` is the system reading map for product
domain work. It should answer three questions before any narrower design starts:

1. Which product domains exist in the FlowDoc product model?
2. Which domains need to know about, reference, or observe other domains?
3. Which narrower domain document must a future room read before it designs or
   implements that area?

The map may describe an internal domain as having hierarchical or
tree-structured relationships where that shape is useful, but this top-level
document remains a domain graph, not a hierarchical database model.

## Product Domains

### Identity / Tenant / Workspace

Responsibility: identify the organization, workspace, actor, and ownership
boundary for FlowDoc resources.

Relationships: owns or scopes document definitions, component definitions,
dataset definitions, permissions, activity visibility, and billing usage.

Read next before detailed design: `Permission Scope Model` and `Billing Usage
Model` when access control or account usage is in scope.

### Permission / Access Control

Responsibility: decide who can view, edit, version, publish, submit data,
generate output, inspect artifacts, or administer workspace resources.

Relationships: references identity, workspace, document definition,
publication, generated artifact, and integration access boundaries.

Read next before detailed design: `Permission Scope Model`.

### Document Library / DocumentDefinition

Responsibility: provide the top-level document-structure family shown in the
document library or card list.

Relationships: owns one editable draft, many frozen document versions, and one
or more publication pointers. It also connects to component usage and data
contract expectations.

Read next before detailed design:
`FlowDoc Document Structure North Star v1` and
`Document Structure Relationship Database v0`.

### Document Structure

Responsibility: define the creator-owned document structure: sections,
component instances, field bindings, page profiles, style defaults, and the
rules that let the structure later render through an approved target.

Relationships: uses component definitions and field definitions, declares data
binding expectations, and freezes into document versions before publication.

Read next before detailed design:
`FlowDoc Document Structure North Star v1` and
`Document Structure Relationship Database v0`.

### Component Library

Responsibility: define reusable sub-layouts that can be placed into document
sections as component instances.

Relationships: component instances reference component definitions. Document
version creation resolves referenced component drafts into immutable component
versions for stable rendering and validation.

Read next before detailed design:
`Document Structure Relationship Database v0` until a separate
`Component Library Relationship Model` exists.

### Dataset / Data Contract

Responsibility: define the named data shape, variable names, field paths, and
validation expectations that downstream callers must satisfy.

Relationships: document structure and component fields declare binding
expectations; runtime submissions provide values against the published data
contract.

Read next before detailed design: `Dataset / Data Contract Model`.

### Version / Publication

Responsibility: keep editable work separate from frozen baselines and real-use
selection. A draft changes; a document version freezes; a publication points to
the selected frozen version.

Relationships: document definitions own versions and publications. Runtime
submissions and renderer jobs consume a publication and its resolved document
version, not an unfrozen draft.

Read next before detailed design: `Publication / Version Lifecycle`.

### Runtime Submission

Responsibility: represent one attempt to submit real data for a selected
publication and produce an output through the allowed flow.

Relationships: references publication, document version, data contract, actor,
and workspace. It creates validation results and can create rendering or
generation jobs after data is accepted.

Read next before detailed design: `Runtime Submission And Rendering Flow`.

### Rendering / Generation Job

Responsibility: run output generation such as PDF rendering, track queue state,
retry state, failure details, and renderer target.

Relationships: references runtime submission, document version, renderer
target, and actor or service identity. It produces generated artifacts.

Read next before detailed design: `Runtime Submission And Rendering Flow` and
`Generated Artifact Lifecycle`.

### Generated Artifact / File Storage

Responsibility: record generated files and access metadata such as file type,
storage locator, retention state, download eligibility, and relation to the job
that created it.

Relationships: generated artifacts are produced by rendering jobs and are
usually accessed through permission, workflow, audit, activity, and integration
boundaries.

Read next before detailed design: `Generated Artifact Lifecycle`.

### Workflow / Approval

Responsibility: coordinate human or system states such as review, approval,
publish request, publish approval, generation approval, retry, and request
change.

Relationships: references document definitions, document versions,
publications, runtime submissions, generated artifacts, actors, and permission
rules when a process requires approval.

Read next before detailed design: `Workflow / Approval Model`.

### Audit Trail

Responsibility: preserve inspectable event history for important actions such
as create version, publish, rollback, permission change, submit data, generate
artifact, delete artifact, and integration access.

Relationships: Audit Trail observes important events across domains. It should
not own the product resources it records.

Read next before detailed design: `Audit And Activity Boundary`.

### Activity Feed / Notification

Responsibility: show a human-readable stream of selected events and
notifications.

Relationships: Activity Feed summarizes selected events from audit, workflow,
submission, rendering, artifact, and permission domains. It is not the same
authority as the audit trail.

Read next before detailed design: `Audit And Activity Boundary`.

### Billing / Usage Metering

Responsibility: measure workspace usage such as seats, generated artifacts,
rendering jobs, storage, retention, and integration calls.

Relationships: references workspace, actors, rendering jobs, generated
artifacts, storage, and integration usage. It should measure usage without
becoming the owner of product resources.

Read next before detailed design: `Billing Usage Model`.

### Integration / External Consumption

Responsibility: define how other systems call FlowDoc through API, webhook,
embed, token, or external app binding.

Relationships: external consumers should enter through publication, runtime
submission, generated artifact access, and permission boundaries. They should
not mutate drafts or document versions directly unless a later explicit
contract allows it.

Read next before detailed design: `Integration Boundary`.

## High-Level Relationship

The first product-domain relationship map is:

```text
Identity / Tenant / Workspace
  -> owns DocumentDefinition, ComponentDefinition, DatasetDefinition
  -> controls Permission / Access Control
  -> feeds Billing / Usage Metering

DocumentDefinition
  -> owns Draft, DocumentVersion, Publication
  -> uses Component Library
  -> declares Dataset / Data Contract expectations

Publication
  -> points to a frozen DocumentVersion
  -> is consumed by Runtime Submission
  -> is read by Rendering / Generation Job

Runtime Submission
  -> provides accepted data for a Publication
  -> creates Rendering / Generation Job
  -> produces Generated Artifact / File Storage through the job

Workflow / Approval
  -> coordinates review, approve, publish, submit, generate, retry, and change

Audit Trail
  -> observes important events across domains

Activity Feed / Notification
  -> summarizes selected events for humans

Integration / External Consumption
  -> calls through Publication, Runtime Submission, Artifact, and Permission boundaries
```

## Follow-Up Domain Documents

Use this document only to choose the next document to read. Do not use it as
the detailed schema for any domain.

| If the work is about... | Read next |
| --- | --- |
| Document structure, sections, components, fields, data bindings, page profile, style defaults | `FlowDoc Document Structure North Star v1`; `Document Structure Relationship Database v0` |
| Draft freeze, document version, published baseline, rollback, publish channel | `Publication / Version Lifecycle` |
| Runtime data input, submission validation, output request | `Runtime Submission And Rendering Flow` |
| PDF or other output generation, queue, retry, renderer target | `Runtime Submission And Rendering Flow`; `Generated Artifact Lifecycle` |
| Generated PDF, stored file, download, retention | `Generated Artifact Lifecycle` |
| Access, sharing, actor permissions, workspace resource rights | `Permission Scope Model` |
| Review, approval, request change, publish approval | `Workflow / Approval Model` |
| Inspectable event history versus human-readable feed | `Audit And Activity Boundary` |
| Seats, render counts, storage, plan limits, usage charges | `Billing Usage Model` |
| API, webhook, embed, external app call, token-based access | `Integration Boundary` |

## Boundary Rules

The top-level product relationship is a domain graph. It is not one
hierarchical data model.

Internal domain documents may use ERD-style relationship diagrams or
hierarchical relationship diagrams when that makes the domain easier to
understand.

Detailed tables, foreign keys, cardinality, indexes, migration strategy,
snapshot strategy, and schema validation belong in the follow-up domain
documents, not in this product-domain map.

Runtime submissions, generated files, audit trail, activity feed, permission,
workflow, billing, and integration should not be mixed into the first
document-structure database design unless a later approved domain document
requires an explicit reference.

## Intentionally Not Changed

- No Core, Backend, or Editor files change in this phase.
- No product database schema is implemented in this phase.
- No migration, API route, renderer, PDF generation, artifact storage,
  permission rule, workflow engine, billing meter, audit trail, activity feed,
  or integration endpoint is activated in this phase.
- No FlowDoc map truth changes beyond registering this planning document as a
  Project Control domain reading map.
- No product readiness, frontend readiness, publish readiness, renderer
  readiness, PDF readiness, production readiness, permission readiness,
  workflow readiness, billing readiness, audit readiness, activity readiness,
  or integration readiness is promoted.

## Next Recommended Work

Return to `Document Structure Relationship Database v0` as the next detailed
design target. Use this document only to keep the broader product-domain
dependencies visible while designing that narrower document-structure schema.
