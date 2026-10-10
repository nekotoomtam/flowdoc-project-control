# FlowDoc Section Ownership Implementation Plan

> For agentic workers: use superpowers:executing-plans task-by-task inline.
> Checkboxes record execution, not acceptance evidence.

**Goal:** แต่ละ Section รับข้อมูลและหัวท้ายของตัวเอง พร้อม DB owners และเวอร์ชันที่สอดคล้อง โดยแม่แบบเก่ายังใช้ได้.
**Architecture:** Core เพิ่ม model15 แยกจาก model4–14; ใช้ renderer เดิมและเพิ่ม scoped binding/section bands. Service เพิ่ม owner rows/FKs และ clone เวอร์ชัน ไม่สร้าง layout engine ซ้ำ.
**Tech Stack:** TypeScript, Node24, PostgreSQL, existing PDF/text/image runtime, Docker.
**Spec:** [Section ownership decision](flowdoc-section-ownership-decision-2026-10-10.md).

## Authority Boundary

Owner: Project Control; Planning Partner, then inline Product Implementation in Core/Service.
Status: written implementation plan for owner review; product implementation not started.
Bases inspected: Core d7533c1 / Service 55f7aad, development0.1.11.
Work size medium per dependent task, overall multi-part; risk routine. No registered execution IDs.
Document budget: this plan and existing decision/roadmap; owner-local guides at delivery.
Proof budget: focused RED/GREEN, affected regressions, one whole-change review,
packed Linux consumer, isolated DB/API tests and one owner PDF comparison.
No separate WORK dispatch. Native inline execution in this chat is the intended method.
Use isolated product worktrees; Project Control documentation stays in clean primary checkout.
Do not change release0.1.8, push/deploy, old published snapshots, frontend or R4 numbering.
Version target0.1.12 after usable verified delivery, not after each task.

## Global Constraints

- Document order comes from template.sections, never request object key order.
- Unknown Section rejects the entire request before job creation; return exact path and allowed keys.
- Omitted Section means empty values then default/required checks, not removal of the Section.
- Scopes global/section/header/footer/local/item are explicit; no fallback and no reading another Section.
- Preserve Area ownership, one placement, one-level restrictions and old unknown-format policy.
- R2 cover/blank and R3 band minimum/gap/40%/overflow rules remain.
- A4 portrait/landscape only; A3/custom sizes, body Columns, band Area/repeats and partial-export mode excluded.
- Parent owner rows carry template_id + section_id; variables follow schema_id without duplicated owners.
- Same ID cannot silently move to another owner; version IDs are new and references stay within that version.
- No automatic conversion or rewriting of model4–14/current snapshots/jobs during schema migration.

## Concrete interfaces to review before execution

### Core model15

Keep shared schemaVersion/templateId/docKey/version/name/styles/globalSchema/examples,
book.defaultPageLayoutId and pageLayouts. Top-level header/footer and formats are
legacy-only; model15 Sections own their definitions. areaFormats remains keyed by
stable authored definition ID with ownerAreaId (unique across the document).

Section15 extends the existing Section identity/page/source fields with:
`key:string`, `inputSchema:ObjectSchema`, `formats:Record<string,Format>`,
optional `header:PageBandDefinition`, `footer:PageBandDefinition`.
Keep source authored/content/blank; multiple content Sections now allowed.
Each content Section consumes its own content list; authored Sections consume
section data and Area placements. Cover remains first authored Section.

Request15 = `{docKey,version?,data?,sections?}`.
Section request = `{data?,header?,footer?,content?}`.
content defaults to []; only source.kind=content accepts nonempty content.
It retains `{format,data}` entries and unknown-format warning rules. Area examples
need only data; no requirement to send content for authored Sections.
Missing objects normalize to {}; explicit null/nonobject fails. Missing sections
normalizes to {}, then each declared Section still validates required/defaults.
Strict unknown Section code `UNKNOWN_SECTION`, path `sections.<key>`;
include permitted keys in its safe diagnostic message without template graphs.
Old top-level content/header/footer remain accepted only on legacy models.

Binding context adds section/header/footer to existing global/local/item.
Allowed scopes: authored body global+section; subformat global+section+local;
array descendants additionally item; band global+section+its own header OR footer.
No body access to band values, no header access to footer or vice versa.
Repeat sources allow global/section/local only in contexts that support repeats;
images, links, anchor scalar bindings follow the same context checks as text.
Shared global Area format receives the context of its single placement Section.

Prepared model15 stores `sections` keyed by stable authored Section ID; each value
retains key, normalized data/bands/content and per-Section original/skipped indices.
Keep existing top-level content=[]/originalContentCount=0/skippedContentIndices=[]
for compatibility with persisted job metadata; never flatten scoped indices there.
Extend prepared validation/recomposition so changing a section value, identity or
warning cannot pass forged-input checks. Diagnostics retain request Section key.
Resolved model15 Sections own optional resolved header/footer with Section-prefixed
node/source identities. Legacy resolved document-level bands remain unchanged.

### Storage identity and ownership

Separate authored identity from relational row identity as existing Area formats do:
`sections.id` is DB UUID; `sections.source_definition_id` stores Core Section.id.
Unique authored ID and key per template. `section_versions.id` is fresh UUID,
`source_section_id` preserves current row lineage, and `source_definition_id`
preserves Core identity so assemble/version fingerprint never depends on clone UUID.
This mapping does not create fresh current IDs on save.

CurrentRecord adds optional sections array for legacy compatibility. SectionRow =
`{id,sourceDefinitionId,key,label?,position,payload}`; payload retains page/source/band
structures but excludes key/label and extracted schemas/formats. SchemaRow gains
sectionId nullable and scope section. FormatRow gains sectionId nullable.
Assembler restores section definitions from ordered rows and removes DB-only metadata.
No duplicate sections graph in template_current.payload for model15.

Migration011 introduces sections/section_versions and corresponding owner columns.
Use pair FKs, explicit nullable-owner checks, deferred owner consistency triggers,
unique scoped names and immutable version guards per decision. Section position
uniqueness must allow transactional swaps. Legacy owner NULL stays valid.
Save current retains Section IDs/timestamps and rejects cross-owner moves. Section
removal checks references and deletes only its owned current rows transactionally;
no current-to-version cascade. Keep DB Section references RESTRICT/NO ACTION.

Existing ID-bearing draft-save is the explicit upgrade boundary: caller supplies a
complete model15 record/mapping and expected revision. Migration itself does not
convert. IDs whose owners change require newly mapped owned rows, not silent moves.
Malformed/incomplete upgrade rolls back. No heuristic conversion tool or extra endpoint.

## Review Focus

1. Same width but different band values: cache must not reuse another Section's text/images.
2. NULL format/schema owner agreement: FK alone may skip NULL comparisons; verify DB rejection.
3. Publishing clone UUIDs must not alter authored identity/fingerprint or rendering.
4. Same variable/format keys in different Sections must remain isolated through job reload.
5. Old header global binding means band-local values; model15 must not reinterpret old models.

## Task1 — Model15 contracts, validation and scoped composition

Files: modify Core src/template/{types,validateTemplate,validateGraph,pageSections,areas,pageBands}.ts,
src/data/{types,prepareGeneration,validateValues}.ts,
src/binding/{bindInlines,expandRows,expandAreas}.ts,
src/composition/{composeDocument,composeSections,composePageBand,validatePreparedInput,validateResolvedDocument,resolvedDocument,linkContract}.ts.
Create src/template/sectionOwnership.ts for model15 validation/helpers and
src/data/prepareSections.ts for scoped request preparation.
Tests: tests/template/sectionOwnership.test.ts, tests/composition/sectionOwnership.test.ts.

Interfaces: `validateSectionOwnership(t:Record<string,any>):Issue[]`;
`prepareSections(t:Template15,input:unknown):Result<PreparedSections>`;
public validateTemplate/prepareGeneration/composeDocument signatures stay stable.

- [ ] Write failing tests using three Sections (same keys, different data), omitted/default/required,
  unknown key mixed/alone, duplicate raw JSON keys, explicit null and no cross-scope fallback.
- [ ] Run `npm test -- tests/template/sectionOwnership.test.ts tests/composition/sectionOwnership.test.ts`;
  expected RED on unsupported model15, not setup/import errors.
- [ ] Implement interfaces above. Validate allowed scopes and area owners in template and prepared paths.
- [ ] Add assertions for images/links/repeats/Area local and item values, source paths and forged prepared data;
  reject wrong-owner Area, duplicate Section key/ID and nonempty content on authored Section.
- [ ] Run `npm run build` and `npm test -- tests/template tests/data tests/composition`; expect all PASS.
  Review diff and commit contract/binding change.

## Task2 — Per-Section bands through the existing PDF engine

Files: Core src/layout/{documentFlow,pageBands,pageNumbers}.ts,
src/pdf/createPdfEngine.ts, src/composition/{contents,linkContract}.ts;
create tests/layout/sectionOwnership.test.ts and fixtures/section-ownership/{template,request}.json.
Interfaces: existing measurePageBand/documentFlow signatures; choose bands from active
ResolvedSection on model15. Cache by band identity and effective width within one job.

- [ ] RED: same-width Sections with distinct headers/images; portrait→landscape→portrait,
  first/continuation modes and long table across pages; assert content never mixes or overlaps.
- [ ] Implement band selection, scoped source IDs/diagnostics, image discovery and link destinations.
  Keep global TOC/anchors per document; cross-page links remain legal.
- [ ] Test cover/blank exclusion, 40% bound, fixed overflow and no extra empty body pages.
- [ ] Run `npm run build` and `npm test -- tests/layout tests/pdf tests/composition`; expect PASS.
  Commit usable Core behavior, preserving package version until final packaging task.

## Task3 — Relational Sections and immutable versions

Files: Service migrations/011_section_ownership.sql;
src/templates/{assembly,storage,current,publish,registry}.ts;
create tests/section-ownership-{assembly,migration,version}.test.mjs.
Interfaces: CurrentRecord SectionRow as above; readRecord/writeCurrent/writeSnapshot/
assemble/decompose maintain existing call signatures, extended data only.
Use a local interim Core package for development; final vendor artifact comes in Task5.

- [ ] RED assembly roundtrip asserting separate keys/data/owners and authored identity preserved.
- [ ] RED migration from populated010 with current/published rows; prove old fingerprints unchanged.
- [ ] Add tables/constraints and extend decomposition, owner validation, save and snapshot clone.
  Index by owner during assembly; avoid repeated full scans for each new Section.
- [ ] Test same-name different Sections allowed; within-owner duplicates and cross-template/section
  references rejected, including NULL mismatch. Check ID/timestamp retention and position swaps.
- [ ] Test deletion leaves global/other Section/version intact; clone IDs new while authored IDs stable.
  Explicit complete upgrade passes; incomplete mapping/stale revision fails transactionally.
- [ ] Run Service build and tests above on isolated Docker DB; compare output before commit.
  Include existing assembly/current/Area/version tests affected by owner changes.

## Task4 — API contract, job persistence and resources

Files: Service src/http/server.ts, src/jobs/{admission,processor}.ts,
src/images/job.ts and current resource collectors; create a shared scoped-image collector
if needed to avoid three independent traversals. Tests/section-ownership-api.test.mjs;
examples/section-ownership-{template,request}.json.
Interfaces: existing GET template contract returns globalSchema plus keyed Sections
containing input/header/footer schemas and allowed format contracts, never node graphs.
POST /jobs accepts Request15 through Core validation; storage/job signatures unchanged.

- [ ] RED API: unknown Section returns structured failure and job count unchanged;
  required diagnostics point to sections.<key>.<scope>.<field>.
- [ ] Implement contract projection and resource claiming/preparation over all Section bands/body.
- [ ] Test direct and staged upload requests, same image key in scoped variables,
  claim/reload/process/download, corrupted prepared input rejected and accepted originals immutable.
- [ ] Test current label changes do not alter old version contract/PDF;
  reordered request keys preserve template Section order.
- [ ] Build + isolated affected API/resource/current/version suite; expect PASS and commit.

## Task5 — Package, sample acceptance and delivery

Files: Core tests/consumer/checkSectionOwnership.mjs, scripts/checkPackedConsumer.mjs;
Service vendor/manifest.json + tarball + locks; package versions and existing local guides.

- [ ] Run final Core suite/build and one fresh whole-change review; fix correctness findings with regressions.
- [ ] Set verified deliverable version0.1.12 in both repos and pack Core Linux/amd64 consumer.
  Use existing text/native/image runtime; no dependency changes unless required by a proven failure.
- [ ] Consumer creates sample with cover, TOC, at least three body Sections including two equal-width
  different headers, local Area/table/image data, long continuation and blank. No A3 claim.
- [ ] Pin exact Core artifact SHA/sourceCommit in Service and rerun affected real DB/API checks using it.
  A failed old assertion must be explained; no skipped test is PASS. R1 migration004 debt remains explicit.
- [ ] Compare model14 baseline PDF/request/fingerprint with pre-change evidence; owner inspects new sample.
- [ ] After acceptance, integrate development only, reuse unchanged proof, archive artifacts,
  remove clean merged lanes and disposable Docker. Record exact checks and commits in existing docs.

## Plan self-review / remaining gates

Scope coverage: request/scopes Task1, layout/cache Task2, FK/version/migration Task3,
API/resource job lifecycle Task4, compatibility/packaging/owner PDF Task5.
Review Focus items map respectively to Tasks2,3,3,1+4,1+5.
No added feature beyond scoped owners except explicit section content support needed
for existing top-level formats to remain usable under their new Section owner.

Implementation must start only after the owner reviews this written plan;
inline method is already selected by conversation, no new execution-method question.
Product work has not started. R4/release remain held while this plan is reviewed/executed.
