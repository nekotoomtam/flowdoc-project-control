# Baseline, sources และ verification coverage

## Authority Boundary

Owner: Project Control; documentation synthesis ตามคำขอผู้ใช้2026-10-14.
ขอบเขตแก้: docs/developer/authoring, คู่มือauthoringเดิม, ตัวอย่างและตัวตรวจเอกสาร,
recordแผนเดิม. ไม่เปลี่ยนCore/Service/runtime/ข้อมูลผู้ใช้; ไม่มีpublish.
Execution IDsไม่เกี่ยวข้องกับงานinlineนี้. ไม่ปรับDOCUMENT_MAPหรืออ้างglobal readiness.

## 1. Implementation baseline

- Core package `@flowdoc/core@0.2.15-area.5` ที่ติดตั้งใน Service candidate.
- Artifact SHA256 `8cdb4c692d2066583f2626d5c86009c039e3fe3e3106099b6bfa0243b315926f`.
- Core source checkout `flowdoc-core-area-v18`, HEAD
  `fde34a991ccc7d6acfc8cfbb84e692246c64a7d6` **มีงานArea migrationค้างในcheckout**;
  HEADอย่างเดียวจึงไม่ใช่digestของcandidateทั้งหมด. ทดสอบด้วยinstalledpackageจริง.
- Service source `flowdoc-service-area-v18`, HEAD
  `decec4a26b139eb7a9c9c53d11d4925f8d8316f6`.
- local authoring contractยืนยันnodeModelVersions:[18], publicationEnabled:false;
  deployment limitsต้องอ่านใหม่เมื่อเปลี่ยนhost.

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
