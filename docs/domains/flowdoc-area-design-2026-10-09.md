# FlowDoc — Single-level Area design

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Cross-Repo Boundary Reviewer.
Status: written design proposed for owner review, 2026-10-09. This is not runtime
Evidence or implementation authorization. Governing decisions: part5 of
flowdoc-export-node-structure-draft-2026-10-09.md. Core2037655 and Serviceb908b37
are the inspected development bases (both0.1.7); release0.1.5 is unchanged.
Single-room discovery/design, execution IDs N/A. Risk routine; work size medium.
Document budget: this specification plus pointers in existing draft/handoff.
No product edits, migrations, package increments or new rooms in this step.

## Intent and accepted behavior

The author declares an area variable and one placement, then defines its owned
subformats. API callers send ordered format/data entries, not node graphs.
Each area owns one or more subformats in this round. No shared subformat library,
area nesting, frontend, DOCX, Columns, nested tables or new pagination policy.
Static subformats may have an empty input schema. Each entry supplies data:{}
when it has no variables. The same local area in separate outer content entries
has separate data/instances; it is not duplicate placement of one occurrence.

An area array may be empty. Missing required key fails before default. Optional
missing uses a validated default or[]. Wrong type at the area value fails the
request. Invalid entries are skipped with warnings at original request indices;
all skipped is allowed when other outer document content remains. This does not
waive existing EMPTY_CONTENT, resource ownership, destination or layout failures.
Duplicate keys in one JSON object are rejected, never first/last-wins.

## Architecture decision

Prefer a separate authored subformat collection over placing new subformats in
the existing top-level formats keyed by name. The latter would change top-level
API selection and break the existing document-wide name constraint. Inlining
subformats into each variable would hide their identity and schema ownership.

Proposed model11 retains schemaVersion1 and all existing model4–10 contracts.
No migration rewrites historical definition_json or its fingerprint.

Proposed Core additions (field spelling is part of this proposed specification):
- AreaField: type:'area', areaId:string, required?:boolean, default?:AreaEntry[],
  label?:string, description?:string. ObjectSchema fields remain keyed by API key.
  areaId is an authored identity, unique in the template, independent of field key.
- TemplateDefinition.areaFormats: map keyed by authored subformat ID. Each value
  has key:string, ownerAreaId:string, inputSchema, fragment, repeats, optional
  cellRepeats, label and description. No formatIds copy on the area field.
- TemplateArea node: id, type:'area', props:{areaId:string}. Placement resolves
  the field by authored ID; key rename does not alter the placement reference.
- AreaEntry:{format:string,data:object}; format is resolved only among subformats
  whose ownerAreaId matches this area. Subformat key uniqueness is per area.

IDs in this contract are authored identities, not Service row UUIDs. Service
continues to allocate current and version row IDs independently. Versioned row
references must point to the version's clones, while authored IDs in the immutable
export definition retain their identity. Tests must distinguish these two layers.

## Placement and scope

Proposed first implementation supports placement in a top-level format's rootIds
or ordinary body-cell childIds. Exactly one authored placement per area declaration;
unused or duplicate placements make the template invalid. Header placement and
placement inside existing row/cell repeat ranges are excluded in this slice to
avoid another occurrence hierarchy. Subformats may use existing supported repeats
internally, but cannot declare another area or place an area node.

Local area belongs to its enclosing top-level format schema and may only be
placed in that format. Reusing the outer format creates separate local occurrences.
A global area may have one authored placement and at most one realized occurrence
in a request; selecting its host format twice fails explicitly, rather than showing
the same global data twice. This is a proposed enforcement of the accepted
one-placement rule, not permission to duplicate a global area silently.

Subformat local bindings read only that entry's data; global bindings read the
outer document global data explicitly. No fallback by equal key, and no implicit
access to the host format's local fields. Item scope remains for existing array
repeats inside the subformat. Scalars/arrays/images/links reuse their existing
validation rules; only the enclosing area entry converts its data issues into
skip warnings. Malformed entry objects, missing format/data, non-object data and
unknown format are entry failures. Unknown data keys retain existing warn/ignore
behavior. Invalid defaults are template errors, not skipped authored mistakes.

## Expansion and resource flow

Prepare normalizes accepted entries while retaining original indices, rejected
indices/reasons and warnings. Prepared JSON is serializable and independently
revalidated against the exact template fingerprint on compose; it must not trust
injected subformat IDs or forged accepted entries. Original input is preserved.

Expand the area placeholder in place to the selected subformat roots. Empty area
removes only its placement; static siblings and authored surrounding spacing stay.
Cells accept only the root content they already support (TextBlock/Image). Reject
an incompatible subformat at template validation even if the request does not
select it. At root, use existing supported root nodes. Do not add Area to resolved
layout nodes; pagination consumes the existing graph.

Instance IDs include outer content index, area ID, original area-entry index,
subformat ID and source node identity; existing inner repeat identities remain.
Source mapping adds the area/subformat/original-entry identity independently of
existing itemIndex/repeatId. Link/anchor collisions retain existing explicit
errors; do not silently rename authored destinations or discard failed layout.

Implementation follows the verified existing pipeline:
validate/filter -> compose in memory -> collect/claim used image resources ->
prepare images -> layout/PDF. It does not lay out twice. No download/resize for
skipped entries. Existing upload/resource ownership errors still fail admission;
existing unusable-image warning/frame handling stays unchanged. Accumulated area
warnings must survive admission, persisted job input, processing and result APIs.

## Service storage and publication

Add area variable master code using the next available1100xx value (currently
110006 is a candidate; verify before migration). Do not modify applied migrations.

Proposed relational extension: reuse formats/format_versions with nullable owner
area-variable references. NULL means existing top-level format; non-NULL means
owned subformat. Replace document-wide key uniqueness with separate unique scopes:
top-level(template,key) and subformat(owner area variable,key), mirrored in version
rows. Preserve existing rows as NULL-owned. Variable schemas continue to belong
to their format, including subformats with zero variables.

Persist authored subformat ID separately from row ID, and preserve areaId in the
area variable contract payload. Assembly maps row owner references back to authored
area IDs; decomposition resolves authored owners to newly allocated variable IDs.
Reject wrong-template, wrong-type, nested-area and dangling owner references.
Use real foreign keys with transaction/deferred ordering appropriate to the
format-schema-variable ownership cycle; exact DDL/order must be specified in the
implementation plan before migration coding, not patched by disabling constraints.

writeCurrent currently replaces the full current graph. Keep this API boundary;
normalize deletion of an area and only its owned subformats/schemas/variables and
placements atomically. Do not delete unrelated globals or historical rows. Deleting
a last subformat leaves an invalid area for publication unless its area is deleted.
Publication validates first, clones all rows with new UUIDs, remaps owners and
schema/parent links, then validates reconstructed snapshot/fingerprint in one
transaction. Retain idempotency and per-document version locking.

Contract endpoint exposes supported area subformat keys and input schemas so
callers can construct entries, without exporting the internal node graph. Old
contracts retain their shape unless model11 needs the additive area contract.

## Raw JSON boundary

Core readTemplateJson already detects duplicate decoded names; Service /jobs
currently receives Fastify-parsed objects. Reuse/factor the duplicate-aware reader
through a public package API with request-appropriate errors, rather than copying
Core validation into Service. Preserve body limits, malformed-JSON responses,
prototype protection and binary upload parsers. Apply to raw JSON admission before
parsing loses duplicates. An already-parsed JS object cannot reveal discarded keys;
do not claim otherwise. CLI raw input paths used by this feature need the same check.

## Verification and acceptance budget

One focused RED/GREEN cycle per implementation part; final changed/affected suite
and one fresh final review. Reuse proofs after unchanged development fast-forward.
- Core modelgate/identity/ownership/placement and invalid defaults; legacy4–10.
- Same subformat names in different areas, same outer format twice with distinct
  local data, empty/static/all-skipped, original warning indices, explicit scopes.
- JSON persisted prepared input tampering, deterministic unique node/inline IDs,
  source mapping and existing link/TOC/array behavior.
- Real DB current roundtrip, empty subformat schema, deletion, publish v1/current
  edit/publish v2 isolation, new row IDs and version-local owner references.
- API raw duplicate and escaped-equivalent key rejection, malformed/oversize JSON,
  binary uploads preserved, version-pinned contract, accepted-only image claims,
  no download for skipped entries and complete warnings on job status.
- Packed Linux PDF: multiple areas/outer occurrences, normal and merged cell,
  Thai multipage content, static subformat, images; verify order/no missing or
  duplicate content and obtain owner review. No new benchmark campaign.

## Proposed implementation breakdown and return

1. Core authored contract and validators, model11, raw JSON utility boundary.
2. Core preparation/expansion/provenance plus packed PDF proof.
3. Service master/migration/current-version assembly, contract and HTTP admission.
4. Cross-repo API/PDF acceptance, versioned development delivery and cleanup.

Detailed implementation plan follows owner review of this written design. These
are sequencing proposals, not dispatched tasks. No release/push/tag or software
version increment for this documentation. New code only increments development
version after it is usable and verified under the existing release rules.
