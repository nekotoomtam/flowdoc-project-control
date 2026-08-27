# FlowDoc Product Terminology

## Purpose

This glossary defines product-facing FlowDoc terms that can be confused across
Project Control, Core, Backend, Editor, and future frontend redesign work. Use
it with the Project Control glossary in `docs/GLOSSARY.md`.

The goal is to reduce agent interpretation drift before implementation work
starts. This document defines names and usage boundaries only. It is not
implementation evidence, test evidence, or product readiness evidence.

## Authority Boundary

This document is canonical for English product terminology inside Project
Control records, planning notes, handoffs, and cross-repository coordination.
Repository-owned code, APIs, tests, and documents remain authoritative for
runtime behavior.

Do not promote FlowDoc product truth from terminology alone. A glossary entry
can make a sentence clearer, but it cannot make Core, Backend, Editor, a
feature, or a compatibility claim `current`.

The Thai companion document translates intent for coordination. English term
IDs remain canonical when records, code symbols, tests, contracts, and evidence
packets need stable identifiers.

## When to Read This

Read this document before:

- Editor or frontend redesign work;
- Core, Backend, or Editor product behavior changes;
- cross-repository API, schema, migration, mutation, transport, preview, or
  capability work;
- writing Project Control plans or evidence that use overloaded terms;
- deciding whether a term should be renamed, split, deprecated, or blocked.

If a user uses a familiar word in a broad way, translate it to the narrowest
canonical term before planning work. If the narrow term is still not clear,
record `UNKNOWN`, `RISK`, or `BLOCKER` instead of guessing.

## Ambiguity disposition

Every ambiguous term in a FlowDoc round should get one of these dispositions:

- `define`: keep the term and state the exact owner/context for this round.
- `split`: one word covers multiple things; replace it with qualified terms.
- `rename`: the current name conflicts with another FlowDoc term; choose a
  clearer canonical name before implementation.
- `deprecated`: do not use the term for new work; preserve it only when
  quoting historical material.
- `context-only`: acceptable in prose or handoff notes, but not in code,
  schemas, public APIs, evidence IDs, or canonical records.
- `blocked`: no safe term can be chosen until owner, evidence, or behavior is
  resolved.

When a term is `split`, qualify it with the owner or runtime, such as
`Project Control Node`, `Core runtime node`, `Backend document record`, or
`Editor draft`.

## Core Terms

### Document Package

`Document package` means the Core-owned canonical package payload and schema
versioned document graph. It is the thing Core parses, validates, migrates, and
mutates.

Do not use `Document package` for a Backend storage row, an Editor draft, a
Project Control Document record, a Markdown document, or an exported file.

### Core Runtime Node

`Core runtime node` means an element inside a Core document graph, such as a
section, table, block, inline, or other schema-owned document item.

Do not shorten this to `Node` when Project Control is also in scope. In Project
Control, `Node` means a navigation/system-map topic record.

### Package Version

`package version` identifies the Core package/schema family version used by a
document package or migration target. It is not a Backend service version, app
release version, npm package version, or Project Control document lifecycle.

### Mutation Result

`mutation result` means the Core-produced response to an accepted document
operation. It can describe a changed package, rejected operation, revision
facts, diagnostics, or similar Core contract output.

Do not use `mutation result` for an Editor UI action by itself or a Backend HTTP
response unless the response is explicitly carrying the Core mutation result.

### Migration Package

`migration package` means a Core-owned migration output or target payload.
Backend may transport it and Editor may request it, but Core owns the package
shape and semantic version boundary unless a narrower record says otherwise.

## Backend Terms

### Backend Document Record

`Backend document record` means the Backend-owned service/storage and transport
record for one document. It can include document id, title, revision,
timestamps, capability facts, and the current Core document package payload.

Do not call this a `Document package` unless you are referring only to the
embedded Core package payload.

### Backend Revision

`Backend revision` means the service-side concurrency or freshness marker used
by Backend routes. It is not automatically the same thing as a Core package
version, Editor draft version, or Project Control evidence revision.

### Capability Response

`capability response` means a Backend API response that reports supported Core
package versions, document versions, migration targets, or service capability
facts.

Do not treat a capability response as proof that a route, UI path, or production
deployment is working unless separate evidence verifies that path.

### Storage Record

`storage record` means durable Backend persistence state. It is separate from
the Project Control Repository Registry and from local test fixtures.

## Editor and Frontend Terms

### Editor Draft

`Editor draft` means browser-local editable state derived from a Backend
document record or fixture. It may include selection, working copy, local
status, preview inputs, or pending UI changes.

An Editor draft is not canonical storage, not a Core document package by
itself, and not Project Control truth.

### Preview

`Preview` means an Editor-visible rendering or inspection mode for a document
or working copy. It can be a useful user experience target, but it is not proof
of export parity, renderer parity, Backend persistence, or product readiness.

### Live Backend Mode

`live Backend mode` means the Editor is configured to call a real Backend
server, usually through a local loopback URL in accepted smoke evidence.

Do not shorten this to `live` without naming the route, server, corpus, browser,
and evidence boundary.

### Fixture Mode

`fixture mode` means the Editor uses local fixture data instead of a live
Backend. It can support UI and Core adapter checks, but it does not prove
Backend integration.

### Outline Item

`outline item` means an Editor UI item that represents a document structure
entry. If the item is backed by Core data, name the backing value separately as
`Core runtime node`.

## Cross-Repository Terms

### Project Control Node

`Project Control Node` means the durable Project Control navigation and system
map topic record. It has a truth state and may link documents, evidence, work,
and repositories.

Do not use plain `Node` in product implementation handoffs when Core runtime
nodes are also involved.

### Document Record

`Document record` means Project Control metadata for a Markdown or other
durable document. It is not a Core document package and not a Backend document
record.

### Evidence Packet

`evidence packet` means a bounded claim with repository id, exact commit, path
or contract id, verification summary, and remaining unknowns. It supports only
the stated claim.

### Runtime

`runtime` must be qualified as `Core runtime`, `Backend runtime`, `Editor
runtime`, `browser runtime`, or another explicit owner. Unqualified runtime is
`split` by default.

### Session

`session` must be qualified as `Editor browser session`, `Backend request
session`, `agent work session`, or another explicit owner. It is not durable
document truth unless a repository-owned contract says so.

### Snapshot

`snapshot` must identify what was captured: Core package snapshot, Backend
storage snapshot, Editor fixture snapshot, evidence snapshot, or Project
Control generated read-model snapshot.

### Source and Target

`source` and `target` must name the axis: source package version, target package
version, source repository, target repository, source document, target route,
source commit, or target commit.

### Current, Ready, Compatible, and Live

`current`, `ready`, `compatible`, and `live` are evidence-bearing claims. They
must name the exact scope and supporting evidence. Without evidence, record the
state as `planned`, `risk`, or `unknown`.

## Frontend Redesign Rule

Before redesigning the Editor or any future frontend, translate UI vocabulary
through this glossary:

- use `Editor draft` for browser-local working state;
- use `Preview` for visible rendering/inspection;
- use `Outline item` for UI structure rows;
- use `Core runtime node` only when the backing Core graph item is in scope;
- use `Backend document record` for service data;
- use `Document package` for the Core payload;
- use `Project Control Node` for the registry/map topic.

If the redesign needs a term that is not listed here, add it to this document
or record an explicit `blocked` terminology decision before implementation.
