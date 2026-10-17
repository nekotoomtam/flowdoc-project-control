# Single-level Area Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task inline. Steps use checkbox syntax. No parallel implementation lanes.

**Goal:** Export ordered, variable-backed subformats at one area placement per occurrence, preserving version ownership and useful warnings.

**Architecture:** Model11 adds authored area identity and an owned areaFormats collection. Preparation filters entries, composition emits ordinary nodes, and existing image/layout/PDF stages consume them. Service persists ownership in current/version rows and exposes an input-only contract.

**Tech Stack:** Existing TypeScript/Node24, PostgreSQL, Fastify, Vitest and Linux/amd64 packaged PDF runtime. No new rendering dependency.

**Spec:** [Area design](flowdoc-area-design-2026-10-09.md), owner accepted before this plan.

## Authority Boundary / kickoff

Owner: Project Control for plan/status; Core and Service for their implementation.
Role: Planning Partner now; Product Implementation Agent during execution.
Work Size medium; Risk routine. Single-room, execution/Phase/Checklist IDs N/A.
Bases: Core203765599ee6e310b8c7553c1cebce4418c05c15;
Serviceb908b374d55257936b54cedba0e71d41456438bb. Recheck before editing.
Use separate clean sibling worktrees for Core and Service, codex/area, and preserve
primary branches. Native worktree tool may target only Project Control; use manual
cross-repo worktrees if required as in prior slice. No release/push/tag authority.

Proof budget: focused RED/GREEN per task, one final Core suite/packed check, one
isolated Service DB/API suite, one fresh final reviewer, one owner PDF review.
Document budget: spec, this plan/inline ledger, existing handoff only. No maps or
new execution registry. WORK uses current configured host session; no model override
or model identity inferred. Final review follows executing-plans model selection.
Return here with coverage, commits, local artifacts and remaining limitations.

## Global Constraints

- Model11 preserves model4–10; schemaVersion1 stays. Area cannot nest or be shared.
- One placement per local occurrence; one realized occurrence for a global area.
- Place at format root or ordinary body cell; not header or existing repeat range.
- Only existing cell-compatible roots inside a cell. No new layout/pagination rules.
- Static subformat inputSchema may be empty; data object mandatory per entry.
- Invalid area entries skip with original-index warning; outer type/required fail.
- Empty/all-skipped area allowed; do not waive outer EMPTY_CONTENT or layout errors.
- Explicit global/local/item scope; no host-local fallback inside subformat.
- Both authored identity and DB row UUID exist; version row links point to clones.
- No image I/O for skipped entries. Existing resource ownership checks still fail.
- Raw duplicate keys rejected before parser loses them; binary uploads unaffected.
- New migration only; never rewrite old snapshots/fingerprints/applied migrations.

## Review Focus

1. Equal area/subformat keys across owners or repeated outer content must never cross-bind data (Tasks1–2 tests).
2. Deleting/renaming current owners must not strand node/schema links or alter published versions (Task3 tests).
3. Forged persisted prepared entries must not reintroduce skipped data or substitute subformats (Task2 tests).
4. Area inside a merged cell cannot smuggle tables, headers or repeat ancestry into unsupported layout (Tasks1/5 tests).
5. Escaped duplicate JSON keys and rejected entries containing resources must not bypass admission or trigger downloads (Tasks1/4 tests).

## Task 1 — Authored contract and strict JSON boundary

**Files Core:** modify src/template/types.ts, validateTemplate.ts, validateSchemas.ts,
validateGraph.ts, readTemplateJson.ts, src/composition/resolvedDocument.ts,
validateResolvedDocument.ts, src/index.ts. Create src/template/areas.ts,
src/data/readGenerationJson.ts, src/json/readUniqueJson.ts,
tests/helpers/areas.ts, tests/template/areas.test.ts, tests/data/readGenerationJson.test.ts.

**Interfaces:** AreaField={type:'area';areaId:string;required?:boolean;
default?:AreaEntry[];label?:string;description?:string}; AreaEntry={format:string;
data:Record<string,unknown>}. AreaFormat extends Format with key and ownerAreaId.
TemplateDefinition.areaFormats?:Record<string,AreaFormat>, allowed onlymodel11.
TemplateArea={id:string;type:'area';props:{areaId:string}} exists only before compose.
Expose readGenerationJson(raw:string):Result<unknown>; readTemplateJson keeps its
signature and INVALID_TEMPLATE errors. Shared readUniqueJson(raw:string):unknown
throws for syntax/duplicate decoded property names, uses existing walker factored
without changing the template caller's error semantics.

areas.ts exports buildAreaIndex(t:TemplateDefinition):AreaIndex after validation,
with byId mapping to {scope:'global'|'local',hostFormat?:string,key:string,
field:AreaField,formatsByKey:Map<string,{id:string,format:AreaFormat}>}.
validateAreas(t:TemplateDefinition):Issue[] verifies ownership/placement separately
from individual graph structure; use maps once per call, no repeated global scans.

- [x] Add fixture with two local areas using same subformat key and static subformat.
  RED: model10 rejects additions; model11 succeeds; duplicate authored area IDs,
  duplicate subformat keys within owner, missing owner and empty format set fail.
- [x] Add RED placement assertions: 0/2 placements fail; wrong host, header, repeated
  ancestry, nested area, cell subformat with table roots fail. Root table succeeds.
  Area types in array item schemas fail. Existing scalar binding to area fails.
- [x] Add RED raw JSON cases: ordinary/escaped-equivalent duplicate names reject,
  equal keys in different objects pass; malformed JSON rejects and template error
  shape stays unchanged. Preserve prototype handling; no raw payload in errors.
- [x] Run npm test -- tests/template/areas.test.ts tests/data/readGenerationJson.test.ts
  and retain expected RED. Implement types/validators/index/reader with exact above
  signatures. Register default validation using selected subformat schema; invalid
  default is INVALID_TEMPLATE, not request warning.
- [x] Run npm test -- tests/template tests/data and npm run build. Review diff,
  commit only after PASS. This task does not claim full compose/PDF support yet.

## Task 2 — Prepared area entries and in-place composition

**Files Core:** modify src/data/types.ts, validateValues.ts, prepareGeneration.ts,
src/composition/validatePreparedInput.ts, composeDocument.ts, resolvedDocument.ts,
validateResolvedDocument.ts, src/binding/expandRows.ts, bindInlines.ts as necessary.
Create src/data/prepareAreas.ts, src/binding/expandAreas.ts,
tests/data/areas.test.ts, tests/binding/areas.test.ts.

**Interfaces:** PreparedAreaValue={kind:'area';originalCount:number;
entries:{originalIndex:number;format:string;formatId:string;data:PreparedData}[];
skippedIndices:number[]}. Extend PreparedData values with this tagged object;
subformat data cannot contain another PreparedAreaValue. SourceEntry adds areaId,
areaEntryIndex and areaFormatId onlymodel11, all-or-none; existing itemIndex and
repeatId remain independent. Reject incomplete/out-of-range metadata.

prepareAreas exports prepareAreaValue(index:AreaIndex,areaId:string,value:unknown,
path:string,issues:Issue[],warnings:Issue[],missing:boolean):PreparedAreaValue.
Reuse scalar/array validateValues for subformat schemas with temporary issues;
convert only entry validation errors into skipped warnings preserving paths.
Existing entry unknown-key warnings stay warnings, not reasons to skip.

expandAreas exports expandArea(context:AreaExpansionContext):string[]; context
carries validated index, authored area ID, prepared value, global data, outer
content identity, output nodes/sourceMap. Refactor clone context minimally to
allow a subformat instance prefix and provenance; preserve legacy prefixes byte
for byte. New prefix includes content index, area ID, original entry index and
subformat ID using IDs validated to exclude the reserved '~' separator.

- [x] RED tests assert required overrides default; optional missing->default/[];
  [] and all-invalid are accepted, wrong outer type fails, non-object entry/missing
  format/data/invalid required or type skips with original path. Data:{} static works.
- [x] RED tests: two outer occurrences bind distinct local data; global area host
  selected twice fails. Same names in two areas stay separate; explicit global
  references work, absent host-local fallback fails entry validation.
- [x] RED tests: area replacement preserves siblings and position; no orphan
  placeholders; empty adds no node/spacing; repeated entries generate unique
  node/inline IDs, sourceMap, existing inner array image repeats and links work.
- [x] RED persistence tests JSON-roundtrip prepared input, modify accepted IDs,
  original indices/counts/skips/data/fingerprint/warnings and reject inconsistency.
  Follow existing validation trust boundary; never merely accept tagged objects.
- [x] Run focused new tests, retain RED, implement normalizing/filtering/expansion.
  Ensure warnings survive compose and no resource work is done here.
- [x] Run npm test -- tests/data tests/binding tests/composition tests/template
  and npm run build; diff review and commit after PASS.

## Task 3 — Relational ownership and immutable versions

**Files Service:** new migrations/009_area_ownership.sql (verify next unused name),
modify src/templates/assembly.ts, storage.ts, current.ts, publish.ts only if required.
Create tests/area-assembly.test.mjs, tests/area-version.test.mjs.
Use isolated uniquely named DB; existing tests helpers and migration CLI.

**Interfaces:** FormatRow adds ownerAreaVariableId:string|null and
sourceDefinitionId:string|null. Top-level rows use both null; subformats require
both. sourceDefinitionId stores authored areaFormats map key, not current-row ID.
Keep assemble/decompose/checkRecord signatures; assembled old definitions must
remain identical including omission of areaFormats for old models.

Migration adds variable_types110006/area after collision check, nullable
owner_area_variable_id and source_definition_id to formats, and corresponding
owner_area_variable_version_id/source_definition_id to format_versions.
Replace old full key UNIQUE constraints with partial unique indexes for null-owned
(template,key)/(version,key) and owned(owner variable,key). Add per-template/version
unique non-null source_definition_id. Preserve existing null rows without rewriting.
Owner FK references variables/variable_versions, DEFERRABLE INITIALLY DEFERRED;
current delete cascade, version delete restrict. A deferred constraint trigger
checks owner type110006 and same template/version via schema joins. Run guards
on both owner-bearing formats and variable/schema updates so SQL cannot move an
owner across templates. Existing immutable version triggers stay.

Write ordering: replace current graph within transaction; delete formats first
(cascades schemas/variables and owned formats); insert all formats, then schemas,
then variables, with owner FK deferred. Existing schema->format FKs remain satisfied
at schema insert. Snapshot allocates maps for all rows, inserts formats with mapped
owner references, then schemas/variables. Resolve all references before commit.

Normalization interface in assembly.ts:
normalizeAreaDeletions(existing:CurrentRecord,incoming:CurrentRecord):CurrentRecord.
Only a previously existing removed area triggers pruning of its owned subformats,
owned schemas/variables and placements in incoming fragments. New dangling owners
still fail. Call under template lock after revision check, before checkRecord/write.
Protect format ownership like existing variable/schema owner checks; key rename
retains authored and row identities. Last subformat removal alone remains an
invalid area for publish, not silent deletion of the area.

- [x] Install packed candidate Core only; no source imports. RED assembly tests
  roundtrip/static empty schema, equal keys under distinct owners, id rename,
  wrong-template/type/owner, forbidden nested area and nonarea stale old contracts.
- [x] RED real-DB tests run migration on prior schema populated with model10;
  old definition fingerprints unchanged. Constraints reject cross-owner corruption
  even through direct SQL. Verify isolated failed transaction leaves no partial rows.
- [x] RED publish v1/edit current/publish v2: all clone UUIDs new, owner refs point
  only to version rows, authored IDs stable, v1 content intact. Retry requestId
  returns same publication; concurrent publish retains existing serialization.
- [x] RED deletion tests remove area only from ID-bearing current input; owned
  graph/placements pruned, unrelated globals and versions unchanged. Remove last
  subformat alone->publication fails. Key rename keeps references and creation time.
- [x] Implement migration/assembly/storage/normalization; run focused real-DB tests
  plus current, version-boundary, version-render and assembly. Build and commit PASS.

## Task 4 — Input contract, raw admission and resources

**Files Service:** modify src/http/server.ts, src/cli.ts, src/jobs/admission.ts only
where required; add src/templates/areaContract.ts, tests/area-api.test.mjs and
scripts/checkAreas.mjs. Preserve src/uploads/claims.ts resource enforcement.

**Interfaces:** buildAreaContract(t:TemplateDefinition) returns additive areaFormats
indexed by authored subformat ID with only ownerAreaId,key,label,description,
inputSchema. Add this field to contract response onlymodel11; no fragment graph.
Register application/json parser through existing Fastify API before routes,
readGenerationJson at raw body boundary, keep prototype restrictions/bodyLimit and
binary upload content-type overrides. Existing CLI draft-save parses through the
same reader, translates Result errors to existing INVALID_DATA boundary.

- [x] RED API contract displays area subformats and empty schemas, pins version
  after current edits, unchanged old contract output. No internal fragment leakage.
- [x] RED raw /jobs tests reject duplicate/escaped-equivalent keys before enqueue;
  separate objects with same keys pass. Malformed/oversize JSON and __proto__/
  constructor protections hold; normal upload JSON and binary image stream still work.
- [x] RED jobs with accepted/bad/accepted entries preserve original warning indices
  and original_input. Required area absent or wrong outer type fails before job;
  all skipped/static-only area succeeds with surrounding static content.
- [x] RED image tests use existing finalized upload and request resources: collect
  accepted instances only, skipped unavailable resources do not trigger preparation,
  accepted wrong-upload resource fails, bad bytes retain existing IMAGE_UNUSABLE.
- [x] Implement wiring without changing worker scheduling/layout. Script follows
  checkCellRepeats isolation/cleanup pattern, runs explicit migrations before tests.
- [x] Docker build plus new tests and prior assembly/current/version-render,
  version-boundary/cell-repeat-api/cell-content-api/image-api/link-api/contents-api/
  upload-contract/processor/render tests; zero failed/skipped, commit after PASS.

## Task 5 — Packed PDF, review and development closeout

**Files Core:** new fixtures/areas/template.json, tests/consumer/checkAreas.mjs,
tests/layout/areaFlow.test.ts; modify scripts/checkPackedConsumer.mjs,
Dockerfile.consumer. Service examples/area-template.json shares authored fixture.
Package/lock/vendor manifest changes only for candidate and final delivery.

- [x] RED layout tests exercise two areas with repeated outer content, ordinary and
  merged cells, long Thai text, static notice, empty/all-skipped and images; check
  emitted order/identity and no residual area nodes. Links/TOC keep destinations.
- [x] Implement fixture/consumer wiring, no new pagination policy. Run final Core
  npm test, npm run build, npm run check:package. Retain all PDF/result/log outputs.
- [x] Pin unique candidate tarball in Service with SHA/source commit; run checkAreas
  against actual package in isolated DB/API, retain result with zero skips.
- [x] Render all pages, inspect order/borders/no lost or duplicated content; ask
  owner to accept one real PDF with clear limits. No claim of DOCX/frontend support.
- [x] One fresh final whole-branch reviewer follows executing-plans. Review Focus
  above supplied verbatim; repair material findings in one observed RED/GREEN pass.
- [x] On acceptance, assign next unused development version (proposed0.1.8 for both),
  rebuild Core artifact and refresh Service pin/proof. Reuse owner visual acceptance
  only when PDF SHA is identical; changed visuals require review.
- [x] Commit and fast-forward development branches under owner authority, never
  release/push/tag implicitly. Archive ignored evidence with per-file hashes before
  deleting only clean merged current worktrees/branches. Update this ledger/handoff.

## Stop / unresolved impact

If current DDL cannot preserve constraints/immutable versions with the planned
ownership extension, stop before migration edits and revise that task with evidence.
Do not weaken validation to fit an example. If raw parser change impacts unrelated
HTTP consumers, repair/verify the affected boundary before acceptance. Additional
nesting, shared subformats and new pagination behavior require a scope amendment.
Model gates, resource safety, version integrity and owner PDF review are mandatory;
no extra benchmark or broad workflow registry is required.

## Plan self-review / execution status

Original plan review: contract/scope->Task1; filtering/identity/persistence->Task2;
DB/delete/publication->Task3; raw API/contract/resources->Task4; PDF/version/cleanup
->Task5. Execution outcomes and review repairs are recorded below.
Owner approved specification and implementation plan. Preserve requested
inline execution method after review; no separate implementation room dispatched.


## Inline execution ledger

Owner approved plan and execution in this chat. Worktrees ../flowdoc-core-area and
../flowdoc-service-area, branch codex/area, at specified bases. Core clean baseline
287/287 PASS. Task1 observed3 expected failures (model11 root/cell acceptance and
missing public JSON reader);10 rejection tests already reject on modelgate.
Ruling: manual cross-repository worktrees because native tool targets only Project
Control. Ruling: ledger remains here under documentation authority rather than
product-local superpowers Markdown. No model switch claimed.
Pre-flight: Task1 AreaIndex feeds Task2 preparation/expansion; tagged values require
Task2 prepared validation updates. Task3 assembly consumes authored IDs separately
from DB UUIDs; Task4 consumes packaged reader and schema/contract additions. Task5
requires all tasks and versioned artifact. No conflicting interface names found.
Task1 implementation active; no commit or completion claim yet.

Task1 complete: e6b6f56,19 new contract/JSON cases,143 focused tests and build PASS.
Task2 observed5 RED tests, then7 area data/binding tests GREEN;187 impacted tests
and build PASS. Local occurrences, global duplication, empty/static/all-skipped,
original warning indices, prepared tampering, and unique provenance implemented.
Ruling: Task1 temporarily rejected area generation until Task2 wired expansion;
this was an isolated intermediate contract commit, not deliverable readiness.
Final proof still requires broader scenario coverage, packaged PDF and Service.

Task2 commit30ddd93; package public export assertion initially failed because the
new approved readGenerationJson root export was absent from its expected list.
Ruling: update intended public contract assertion, not hide the export.00aee93
full313/313 tests and package Linux consumers PASS, artifacts/1791543269239.
Service pins uniquely named0.1.7-area-candidate tarball, not existing0.1.7 artifact.
Task3 assembly observed2 RED then7/7 GREEN including legacy assembly. DB run
artifacts/1791543448884 passed new ownership/version/delete cases; one old master
list assertion expected5 types, now6 with approved110006 area. Update expectation.
Ruling: defer legacy backfill until all pending migrations finish, since new
storage reads the columns introduced by009; old applied migration SQL unchanged.
Task4 new API contract/raw duplicate tests are running RED before implementation.

Tasks3/4 implementation committed bafc859: assembly, master110006, migration009,
current deletion and immutable version ownership, input-only contracts and strict
HTTP/CLI JSON. RED API run1791543537708 exposed missing area contract and duplicate
JSON rejection; corrected behavior passed. Final isolated Service proof
artifacts/1791543765918:49 passed,0 failed,0 skipped including actual upload/image
processing and legacy migration upgrade. Ruling: one combined Service commit for
coupled storage/API changes after all relevant proof, rather than artificial split.
Task5 fixture/layout/package commit1e386c4; Core315 tests and Linux package consumers
PASS artifacts/1791543697751. Tarball hash equals candidate used by Service.
Owner accepted area-long.pdf five-page ordering/page continuation in this chat.
All18 BEGIN/END markers extracted once; five pages visually reviewed. Durable
visual-review.json holds PDF SHA and owner acceptance. Final read-only reviewer
area_final_review dispatched against exact Core2037655..1e386c4 and
Serviceb908b37..bafc859. Delivery0.1.8 and development integration remain pending.
Coverage review found one promised integration missing: explicit global/entry/item
scope with a table/cell repeat inside a root area. Added focused integration test,
5 binding tests PASS, artifacts/task5-scope-coverage.log. Ruling: this closes a
named acceptance gap; it is additional proof without runtime changes, not a new
feature or a claimed RED/GREEN repair. Reviewer informed of the added test.

Final reviewer reported two Important findings. Accepted both effects and one
bounded repair pass. Wrong-type skip warnings carried expectedType/actualType
but prepared validation rejected them. Core regression observed RED then GREEN;
repair validates/preserves those fields rather than losing diagnostic detail.
Persisted partition checks alone cannot detect coordinated accepted/skipped edits.
Ruling: preserve Core's structural prepared-input boundary; authenticate selection
against the separate original_input at Service job processing, before image I/O.
Do not add another attacker-editable copy/hash inside PreparedInput. Existing DB
immutability already rejects UPDATE, so reproduction inserts an inconsistent row
to test the processing boundary. Service RED1791544334513 shows both failures,
including an inconsistent row reaching success before repair. This narrow repair
adds jobs/types/repository/processor to allowed affected files; no scheduling or
rendering-policy change. Re-prepare model11 input against its pinned version and
compare normalized data plus diagnostic multiset (JSONB key order can differ).
This does not authenticate both original/prepared data against a malicious DB
administrator. Cost is one input preparation per model11 job, no extra layout.
Closeout follows finishing-a-development-branch with already approved local
fast-forward and cleanup from Task5; no repeated integration menu, remote push,
or release change. Final Core0.1.8 artifact verification is in progress. Primary
branches remain clean at the approved bases; release heads are unchanged.
Core review repair317 tests + Linux consumers PASS1791544402994. Final0.1.8
317 tests/package PASS1791544490198, commit97a0985. Final area-long.pdf SHA
matches owner-accepted dcc8088a43da875507ba4e7a00dc5a265e11cb1a037eb5f2ad24648db8972fe2;
visual acceptance reused without asking owner to repeat the same file.
Core tarball SHA48241590350d22ddac983f8b5296bd5559646b76a4803510874dddde60d90a0d.
Service final pin/check in progress. Review had no other findings; no second review
per proof budget. Declined visual re-review belongs to owner acceptance; final
version/integration verified by executor. Excluded product features remain excluded.

## Development closeout — 0.1.8

PASS within the single-level Area scope. Execution/Phase/Checklist IDs N/A
(single-room approved plan). Core97a0985 and Service0419718 fast-forwarded into
codex/template-binding and codex/template-registry respectively, without conflict.
Final Core317 tests plus isolated Linux package consumers PASS1791544490198;
Service51 tests,0 failed,0 skipped PASS1791544583916 with that exact0.1.8 tarball.
Service review repair passed the observed RED cases and valid reordered-warning
control. Reused unchanged tested content after fast-forward; refreshed primary
Service dependency install and built both primary checkouts.

Acceptance coverage: model/owner/placement/default/raw JSON -> Core template/data
area tests; local/global/item scope/identity/filtering/provenance -> binding tests;
prepared integrity -> Core structural tests plus Service original-input comparison;
current/version/delete/upgrade -> area-assembly and area-version real DB tests;
contract/duplicate/body/upload/image warnings -> area-api and area-render; layout,
merged cells, images, links/TOC -> areaFlow and packed checkAreas plus owner PDF.
No mandatory criterion remains unverified. Core alone validates prepared structure,
not original-request authenticity; Service holds and compares the original request.

Evidence archive locations under primary repositories:
- flowdoc-core/artifacts/worktree-archive/flowdoc-core-area
- flowdoc-service/artifacts/worktree-archive/flowdoc-service-area
Each archive has a per-file SHA256 manifest. Final PDF is
1791544490198/area-long.pdf under the Core archive, with visual-review.json.
No DOCUMENT_MAP or system-map promotion; this ledger links durable tests/artifacts.

Release heads unchanged: Core9ee6526, Service3293a05 (0.1.5). No push or tag.
Intentionally unchanged: nested/shared areas, Columns/cell nesting, DOCX/frontend,
new pagination and throughput policy. Next: review part6 compatibility/remaining
roadmap before any release decision. Cleanup result is recorded below.

Cleanup PASS: archived and hash-verified Core329 files and Service63 files before
removal. Both codex/area worktrees were clean and identical to their integrated
primary heads; removed only those two worktrees and temporary branches. Primary
checkouts clean. Ignored build/dependency outputs were reproducible; no unique
non-artifact ignored files existed. No unrelated lane or Docker data was removed.
Documentation gate: update this canonical plan and existing handoff only, role
Project Control Steward; no new Work/registry/maps. Proof: diff, referenced files,
current commits and impact-scoped check:data.
