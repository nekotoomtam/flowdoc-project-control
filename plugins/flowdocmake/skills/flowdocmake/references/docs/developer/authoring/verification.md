# Baseline, sources และ verification coverage

## Authority Boundary

Owner: Project Control; documentation synthesis ตามคำขอผู้ใช้2026-10-14.
ขอบเขตแก้: docs/developer/authoring, คู่มือauthoringเดิม, ตัวอย่างและตัวตรวจเอกสาร,
recordแผนเดิม. ไม่เปลี่ยนCore/Service/runtime/ข้อมูลผู้ใช้; ไม่มีpublish.
Execution IDsไม่เกี่ยวข้องกับงานinlineนี้. ไม่ปรับDOCUMENT_MAPหรืออ้างglobal readiness.

## 1. Implementation baseline

- Core `0.3.0`, release `6d2a9b7`, verified source `f21ab6a`; Service `0.3.0`, release `0c57eec`, source `57d9fd2`.
- Core artifact SHA256 `d2f2d23ea42072f0f5fe1f702445c4384c686a371ea76fbcc7b96c5a77594380`; Service pins this exact archive.
- Only nodeModelVersion18 is accepted. Use primary `flowdoc-core` / `flowdoc-service` checkouts; Area worktrees are retired after integration.
- Core533 tests and packed Linux consumer pass; Service222 tests pass without skips. PDF numbering/destination checks pass. Visual review covered247 consumer pages; the final package's48 PDF files are byte-identical to the reviewed outputs.
- Full SRS98-page comparison preserves all page resources, geometry and links. 96 pages retain identical drawing commands. Pages36/42 intentionally remove an orphan repeated table header; all body text is unchanged. The fixture contains361 distinct explicit REQ codes, all matched; do not substitute a count from another dataset.
- Live MCP contract reports versions:[18], publicationEnabled:false. Direct PDF file saving was verified after moving the launcher to the primary Service checkout.
- Durable local evidence: `flowdoc-core/artifacts/release030/worktree-evidence/1792046442725`, `flowdoc-service/artifacts/release030/worktree-evidence/release030-tests-final.json`, and `flowdoc-service/artifacts/release030/area98/parity.json`.
- Prior candidate area.5 baseline is historical. This cutover makes no new RAM/capacity claim and does not publish user templates.

## 2. Source index

Pathsเป็นrepository-relativeภายในownerที่ระบุ ไม่ใช่คำสั่งให้แก้ไฟล์นั้น.

| บท/ข้อกำหนด | Source authority |
| --- | --- |
| Definition, schema, Section | Core src/template/types.ts, sectionOwnership.ts, pageSections.ts, validateSchemas.ts |
| Node properties/placement | Core src/template/validateGraph.ts; src/composition/resolvedDocument.ts |
| Variable missing/default/types | Core src/data/validateValues.ts, prepareSections.ts, prepareAreas.ts |
| Area ownership | Core src/template/areas.ts, sectionOwnership.ts |
| Repetition | Core src/template/rowGroups.ts, validateGraph.ts |
| TOC/links | Core src/composition/contents.ts, linkContract.ts; src/layout/measureContents.ts |
| Image contain/band geometry | Core src/layout/pageBands.ts, documentFlow.ts |
| Padding/line defaults | Core src/layout/measureCellContent.ts, line.ts |
| Numbering | Core src/template/pageNumbering.ts; src/layout/systemPageCounting.ts |
| Typography | Core src/composition/validateResolvedDocument.ts; src/layout/measureText.ts |
| MCP arguments/paths/local save | Service src/tools/authoring.ts, server.ts |
| Draft identity/CAS/idempotency | Service src/authoring/service.ts; templates/current.ts |

Type declarationsเป็นcatalogเบื้องต้น; validatorของตำแหน่งและruntime defaults
เป็นผู้ตัดสิน. ห้ามเอาชนิดรุ่นเก่ามาประกาศว่าทำได้ในArea18.

## 3. Proof ที่รันในรอบนี้

| Check | Result / ขอบเขต |
| --- | --- |
| reference-template + request | validate → prepare → compose ผ่าน |
| เปลี่ยนข้อมูล | เพิ่ม45แถวและเปลี่ยนglobalVersion ผ่าน; footer bindingเปลี่ยน |
| Negative cases | ระดับTOC4, root textAlign, image fit, Unknown Format, required+defaultแต่ไม่ส่ง, duplicate anchor ถูกปฏิเสธ |
| Renderด้วยnative runtime | baseline2หน้า, expanded4หน้า; ไม่เขียนDB/ไม่สร้างdraft |
| เลขหน้าสารบัญ | บทสองเปลี่ยน2→4ตามการเพิ่มข้อมูล |
| PDF annotations | internal linksไปหน้า1และ2/4, external URIตรงค่าข้อมูล |
| Geometry | headerภาพจริง190×19mm ตรงแนวขอบตาราง190mmทุกหน้าทั้งสองเล่ม |
| Visual inspection | เปิดภาพครบ6หน้าของสองPDF; ไม่พบclipping/overlapในfixture |
| ตัวอย่างrequirements/groupedเดิม | ตัวตรวจเดิมผ่านทั้งสองคู่; รวมempty area/groupและFormatผิด |

Reproduceด้วย [commands](examples.md); ผลPDF/draw/imageของรอบนี้เก็บที่
`flowdoc-service/artifacts/developer-docs-20261014/` (local ignored artifacts).
ไฟล์JSONและcheck scriptsที่version-controlไว้เป็นหลักฐานรันซ้ำได้.
ภาพsolidในfixtureมีไว้ตรวจขอบ/ratio ไม่ได้ทดสอบความคมชัดโลโก้ทุกประเภท.

## 4. สิ่งที่ยังไม่อ้างว่าได้พิสูจน์

- ไม่ใช่การรับรองSRS98หน้าหรือPDFของห้องSol/Terra; ไม่แก้draftเหล่านั้น.
- property catalogตรวจsource/validator แต่ไม่ได้renderทุกcombinationของmerged cells,
  cellRepeats, page placement, fixed cover, numbering restart/excludeในรอบนี้.
- ไม่ได้ยิงauthoringHTTP/MCPครบทุกnegative operational caseใหม่;
  APIreferenceอ่านimplementationและcontract ไม่ใช่deploymentload test.
- ไม่รับรองPDF-readerทุกตัว, ประสิทธิภาพ, memory หรือconcurrency.
- ไม่รับรองว่าโมเดลจะทำตามคู่มือทุกครั้ง; ต้องตรวจcoverageของผลลัพธ์แยก.
- continuationทับbandที่พบในงานSolเป็นข้อสังเกตจากการทดลองนั้น ไม่ได้แก้หรือ
  รับรองroot causeในรอบdocumentation. เก็บหลักฐานก่อนเปลี่ยนrenderer.

## 5. Review และการอัปเดตในอนาคต

ทบทวนชื่อproperty/required/default/ตำแหน่งจากvalidator เมื่อpackageเปลี่ยน;
รันfixturesและPDFcheckerใหม่ก่อนยกbaseline. ถ้าส่วนใดไม่มีหลักฐานให้ติดป้าย
source-inspected/NOT_RUN ไม่แปลงคำอธิบายเป็นPASS.
สำหรับเอกสารเพิ่มเติมให้เชื่อมจากREADMEนี้และคู่มือขั้นตอน ไม่สร้างreference
ที่ขัดกันหลายชุด. ไม่ลบข้อมูลประวัติการตรวจเดิมเมื่อเปลี่ยนรุ่น.
