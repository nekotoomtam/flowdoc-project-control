# FlowDoc — Array-driven cell content implementation plan

> For agentic workers: after owner review, execute sequentially inline using
> executing-plans. Do not dispatch a new WORK room or reopen a closed execution.

**Goal:** ผู้สร้างเลือกชุด TextBlock/Image ในเซลล์หนึ่งครั้ง ผู้เรียกส่ง array
แล้วได้ชุดเนื้อหาตามลำดับจริง พร้อม PDF ที่ไม่มีชุดต้นแบบหลงเหลือหรือเนื้อหาซ้ำ

**Architecture:** เพิ่ม cell repeat declaration ในแม่แบบ model 10 และผูกภาพจาก
item scope; ขยายรายการก่อน layout เป็นลูก TextBlock/Image ปกติ ใช้ paginator
0.1.6 ต่อ Service ขยายการยอมรับ image child ของ array แล้วใช้ upload/job เดิม

**Tech Stack:** TypeScript/Vitest, Core PDF runtime, Service/PostgreSQL/Sharp เดิม

**Spec:** [พาร์ต 5: array ทำซ้ำชุดลูกในเซลล์](flowdoc-export-node-structure-draft-2026-10-09.md#ช่วงถัดไป-array-ทำซ้ำชุดลูกในเซลล์)

## Authority Boundary / kickoff

Owner: Project Control; product owners: flowdoc-core and flowdoc-service.
Role: Planning Partner. Status: implementation plan ready for owner review;
written design approved in this conversation on 2026-10-09. No runtime work yet.
Single-room inline; Work/Phase/Checklist IDs N/A. Work Size medium, Risk routine.
Base Core `4546a1899bcdf2defe2a0c9976cdf90250c309d1` (`codex/template-binding`),
Service `eb41b697085a66a7123313572024285436e0acde` (`codex/template-registry`), both0.1.6.
Recheck clean state/base before implementation; use isolated current-slice lanes.

PLAN model policy: gpt-6-astra/medium; this document does not claim to change this
chat's model. WORK decision: inline implementer with bounded tasks; resolve actual
host model availability at implementation kickoff, independently of PLAN. Current
host tool metadata lists gpt-6-astra and gpt-6.1-sol with medium support; do not
invent a model switch or another room to satisfy a label. Return route: this chat.

Document budget: this plan, approval/link in existing spec, and final status in
existing handoff. No task reports, new map records or synthetic execution registry.
Proof budget: focused RED/GREEN per task; final Core suite/build/package Linux proof;
Service impacted real-DB/container checks; one PDF sample and owner visual review;
one final review per executing-plans, reuse unchanged proof after fast-forward.
New proof only for changed candidate, failure, missing prerequisite or uncovered impact.

## Global constraints

- Only fixed TextBlock/Image sequences in cells; one declaration per cell, multiple
  cells allowed. No cell repeat inside row repeat or table header; no nested arrays,
  arbitrary objects, area, Columns, nested tables, frontend or DOCX.
- New fields gated at nodeModelVersion10; old4–9 acceptance/rejection unchanged.
  schemaVersion stays1; existing row `repeats` wire shape remains unchanged.
- `Format.cellRepeats?: CellRepeat[]`; omitted or [] means no cell repetition.
  `CellRepeat={id:string,cellId:string,childTemplateIds:string[],source:{scope:'global'|'local',key:string}}`.
  IDs are nonempty authored IDs without `~`; repeat IDs unique within their Format.
- childTemplateIds is a nonempty contiguous ordered range of direct TextBlock/Image
  children of the named cell, no duplicates; replace that range in place, never append
  clones while retaining original prototypes. Keep static children before/after once.
- Model10 array item schemas have at least one field, types string/link/image only.
  Image source may use item only inside a validated repeat scope; no implicit fallback.
  Existing row repeats may bind image items in model10; no nested repeat context.
- [] expands to no repeated nodes; preserve cell/row/padding/static content. Missing
  required rejects before default; optional absent uses validated default or [].
  Type/required errors reject request with indexed paths; unknown keys keep existing
  ignore/warning rules. Image preparation failures retain existing warning/frame policy.
- API callers send ordinary data and finalized upload resource IDs, not raw graphs.
  No new media intake, limits, master type or DB migration planned.
- IDs/sourceMap preserve source identity without mutating inputs. New repeat identity
  includes contentIndex/repeatId/itemIndex/sourceId; reorder is not stable item identity.
- Text lines/image frames/allowBreak/oversize/padding follow0.1.6. No group gap,
  container, keep-with-caption rule, or layout geometry stored in the template.
- Keep release0.1.5 unchanged. Candidate delivery proposed0.1.7 only when usable and
  verified; software version != model10 != published template version. Never replace
  an existing artifact with new bytes under the same filename/version.

## Review focus

1. Wrong cell/range/header or row-repeat ancestry introduces ambiguous item scope — Task1.
2. [] removes static content or prototypes survive; IDs collide across cells/content — Task2.
3. Same key in global/local/item picks wrong value; invalid/default item image escapes — Tasks1–2.
4. New model accidentally disables links/TOC or loses sourceMap on persisted input — Tasks2–3.
5. Service rejects child images or current edits leak into published versions/resources — Task3.

## Task 1 — Validate model10, item images and cell repeat ownership

**Files (Core):** modify `src/template/types.ts`, `validateSchemas.ts`,
`validateTemplate.ts`, `validateGraph.ts`, `src/composition/resolvedDocument.ts`,
`validateResolvedDocument.ts`, `composeDocument.ts`, `src/index.ts`.
New `tests/template/cellRepeats.test.ts`, shared fixture `tests/helpers/cellRepeats.ts`.
Reuse `src/data/validateValues.ts`; change it only if an explicit new test exposes a gap.

**Interfaces:** export CellRepeat from package root and optional Format.cellRepeats;
ArrayField.items includes ImageField, image source adds item. PreparedItem already
supports resource IDs as strings, so do not broaden it to arbitrary objects.
GraphContext gains `cellRepeats?:CellRepeat[]` and `itemImages?:boolean`; wire these
only for model10. Extend validateSchemas with a trailing optional itemImages=false
flag; thread it recursively and require nonempty item fields only for this flag.
SourceEntry gains optional repeatId (model10 only; requires valid itemIndex).
These are declarations/validation, not a promise Task1 alone can compose new repeats.

- [ ] RED tests: accept model10 local/global array with image+caption and valid range;
  reject empty item schema, nested array/object, image item/source in models4–9,
  cellRepeats even [] in models4–9, duplicate/invalid repeat ID and duplicate cell.
- [ ] RED ownership cases: empty/reversed/noncontiguous/duplicate child range,
  wrong-parent/missing/non-content child, missing/non-array source; cell under row
  repeat or header rejects. Item reference outside the range rejects; static siblings
  cannot see item scope. Same named global/local/item fields remain distinct.
- [ ] Add model10 gates and carry features forward with >= gates. Validate repeat
  ancestry from graph relationships, not node naming. Validate item image source
  using the resolved traversal scope like text bindings, before composition.
- [ ] RED/GREEN value cases via validateTemplate→prepareGeneration: []/one/many,
  required overrides default, valid/invalid defaults, null/type mismatch and missing
  photo return exact item paths; unknown item key warns. Preserve old empty schema
  behavior for old models rather than applying the new rule retroactively.
- [ ] SourceMap validation rejects repeatId on old models and repeatId without
  itemIndex; supports JSON round-trip of valid model10 resolved metadata.
- [ ] Run `npm test -- tests/template tests/data tests/composition tests/binding`
  and `npm run build`; inspect diff and commit after PASS. Existing tests plus new
  rejection cases prove old model contract, not an unsupported global compatibility claim.

## Task 2 — Expand cell ranges and preserve source mapping

**Files (Core):** modify `src/binding/expandRows.ts`, `bindInlines.ts` as needed;
`src/composition/composeDocument.ts` only for necessary wiring. New
`tests/binding/cellRepeats.test.ts`, `tests/layout/cellRepeatFlow.test.ts`.
Reuse Task1 fixture and existing `src/layout/cellTableFlow.ts` unchanged unless a
reproducible new failure requires a narrowly justified repair.

**Interfaces:** keep expandRows signature and return type unchanged. Build maps once
per format expansion: row declarations by row ID, cell declarations by cell ID.
Internal clone context carries item/itemIndex and optional repeatId. For new cell
instances use ID prefix `content-{contentIndex}~repeat-{repeatId}~`, then source ID
and `~item-{index}`; source IDs/repeat IDs cannot contain ~. Preserve legacy IDs for
old row repeats and static nodes. bindInlines keeps its signature; feed the new
prefix and origin.repeatId so newline-expanded leaves get the same provenance.
Output remains existing ResolvedDocument nodes, with repeatId metadata only.

- [ ] RED tests with static heading/photo/caption/footer: [] yields heading/footer;
  1 and3 items yield exactly2+2*n children in order. No template-only orphan nodes.
- [ ] RED tests: two cells share array, two content instances share Format; all node
  and inline IDs unique, all emitted leaves carry correct sourceId/contentIndex/
  format/itemIndex/repeatId. Same request twice produces equivalent graph. Inputs
  and prepared snapshots unchanged; resource reuse does not share node IDs.
- [ ] Implement range replacement when cloning a cell, binding global/local/item
  explicitly. Image source selects the named scope including item. Existing model10
  row image repeat works independently; never overwrite outer item silently.
- [ ] Verify string/newline/link item binding, unique item-bound anchors and internal
  references. Duplicate authored anchor values still fail existing destination checks;
  do not rewrite external anchor semantics merely to avoid an error.
- [ ] Persist prepared input to JSON and compose again; malformed image values and
  altered template fingerprint still reject. No new shortcut bypasses prepared validation.
- [ ] Layout tests: ordinary/merged cells with repeated children and Thai text longer
  than a page; images remain whole, body instances appear once, static siblings retain
  order, zero/default padding and row allowBreak rules still hold. Header outside
  repeated body cell remains repeated normally; no template re-expansion per page.
- [ ] Run `npm test -- tests/binding tests/composition tests/layout tests/template`
  and build; review diff and commit after PASS. Do not add benchmarks or caching here.

## Task 3 — Immutable versions, resource/API and packed PDF proof

**Files (Core):** new `tests/consumer/checkCellRepeats.mjs`; wire
`scripts/checkPackedConsumer.mjs` and `Dockerfile.consumer` to retain result/PDF.
**Files (Service):** modify `src/templates/assembly.ts`; new
`tests/cell-repeat-assembly.test.mjs`, `tests/cell-repeat-api.test.mjs`,
`scripts/checkCellRepeats.mjs`; package/lock/vendor manifest/artifact at delivery.
Reuse current/publish/load APIs, isolatedDatabase, cell-content API upload/job helpers.

**Interfaces:** existing decompose/assemble/checkRecord signatures unchanged.
Allow child variable type110004 only when record.payload.nodeModelVersion>=10;
retain string/link and same-schema/parent/cycle rules. Format payload carries
cellRepeats without a new table. Use published Core root exports, never source imports.

- [ ] Core packed fixture: 0/1/many cases with static markers, Thai long captions,
  images of three distinct resources reused across items, ordinary and merged cells,
  two content instances, link/TOC to a heading after the table. Count output instances
  from sourceMap; do not guess page count. Preserve generated PDF/result for review.
- [ ] Run final Core `npm test`, build, `npm run check:package`; Linux/amd64 consumer
  installed solely from tarball and without network at rendering. Test legacy package
  consumers already wired by the script; new model must preserve links/TOC/page numbers.
- [ ] Pin unique candidate tarball/checksum in Service. RED assembly tests: image
  child round-trip with schema/parent IDs, reject old-model image child, cross-schema
  parent and nested array. Implement only the required parent type gate.
- [ ] Real-DB tests: import model10→publish v1→load; modify current caption/default/
  repetition→publish v2; v1 keeps its own variables, references, cellRepeats and content.
  New version IDs and source document ref follow current behavior; do not alter migrations.
- [ ] API tests finalize upload→submit data array→job→download PDF with actual images;
  verify repeated resource reuse and original_input unchanged. Invalid required/type
  item fails admission without creating a job; wrong-upload resource still rejects;
  corrupt image bytes retain IMAGE_UNUSABLE behavior. Empty array with only static
  text needs no image upload when no other image nodes remain.
- [ ] New checkCellRepeats script follows checkCellContent isolation/cleanup pattern.
  Select cell-repeat-assembly, cell-repeat-api, assembly, current, version-render,
  cell-content-api, image-api, contents-api, link-api, processor, render suites with
  real DB. Docker build must pass and zero skipped tests; cleanup own project only.
- [ ] Render all pages of the new PDF; verify text/image order, no prototypes/duplicates,
  continuation borders and destinations. Have owner review one sample. If package
  version only changes later and PDF is byte-identical, reuse visual review by SHA256.
- [ ] On acceptance, version deliverable (proposed0.1.7), rebuild immutable package and
  refresh Service pin/proof for changed artifact. Commit then integrate development
  per owner authority; no release/push/tag implicitly. Preserve ignored evidence
  with checksum before removing only clean merged current-slice lanes/branches.

## Stop / escalation / closeout

Stop and propose an amended scope if DB migration, nested repeat context, node
container, changed layout rules, altered area policy or image resource budgets become
necessary. Missing one of these deferred features does not itself block this slice.
Do not silently make validation permissive to pass a fixture.

Completion evidence must cover model contract, expansion identity/order, old-model
regression, real PDF and versioned API/resource behavior; skipped checks are not PASS.
Record commits/artifact paths/checks/owner acceptance here and refresh existing
handoff. No DOCUMENT_MAP promotion without separately registered Evidence.

Status: PLAN READY FOR REVIEW, not started. Next: owner reviews this written plan;
execution approach proposed sequential inline, preserving current collaboration.
