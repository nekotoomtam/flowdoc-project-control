# Baseline, sources และ verification coverage

## Authority Boundary

Owner: Project Control; documentation synthesis ตามคำขอผู้ใช้2026-10-14.
ขอบเขตแก้: docs/developer/authoring, คู่มือauthoringเดิม, ตัวอย่างและตัวตรวจเอกสาร,
recordแผนเดิม. ไม่เปลี่ยนCore/Service/runtime/ข้อมูลผู้ใช้; ไม่มีpublish.
Execution IDsไม่เกี่ยวข้องกับงานinlineนี้. ไม่ปรับDOCUMENT_MAPหรืออ้างglobal readiness.

## 0.5.0 release preparation — 2026-10-25

ชุดเตรียมใหม่คือ Service0.5.0 / Core0.5.0 และ FlowDocMake รุ่นใหม่ที่ตรึง
archive/checksum ของชุดนี้โดยตรง. ต้องผ่าน combined Service suite, packed
consumer และ plugin/guide preflight ก่อนเรียกพร้อม release. Package version
ไม่ใช่ tag, การติดตั้ง หรือการเปลี่ยน Service ที่รันอยู่. สถานะและ source/hash
สุดท้ายอยู่ใน `flowdoc-docx-export-plan-2026-10-20.md` หัวข้อ0.5.0 preparation.
ไม่ใช้ snapshot คู่มือเก่ามาอ้างว่ารองรับ border none/final Area ใหม่.

เก็บการยอมรับ ศบ.1 จากเจ้าของและข้อจำกัดเส้นบนของ Word-PDF ไว้ตามจริง;
ไม่เปิดปรับจูนซ้ำหรือสร้างเปอร์เซ็นต์ fidelity รวมจากตัวอย่างเฉพาะจุด.

## ชุดอ้างอิงก่อนหน้า: FlowDocMake 0.2.8

FlowDocMake `0.2.8` ตรึง Service `0.4.9` / Core `0.4.7`,
`nodeModelVersions:[18,19]`, `schemaVersions:[1,2]` และ definition.version1.
ตัวตนแพ็กเกจและข้อกำหนด preflight ดู [README](README.md) และ draft selection;
ผลตรวจส่งมอบ/ติดตั้งเดิมอยู่ใน Project Control ที่
`docs/domains/flowdoc-task-queue-concurrency-plan-2026-10-20.md`
หัวข้อ Release/Installation/Native chat verification (ไม่ได้รวมใน snapshot คู่มือ).
การแก้คู่มือครั้งนี้ตรวจความสอดคล้องเอกสาร ไม่ได้รันผลทดสอบหรือ PDF ด้านล่างใหม่.

## Core0.4.8 development and DOCX boundary

| ชุด | ตัวตน/สถานะ |
| --- | --- |
| Core development0.4.8 | implementation `8c2332d` บน `codex/template-binding`; build,126 suites/1125 tests และ27 packed-consumer groups ผ่านตามหลักฐานรอบ2026-10-24 |
| Core release ปัจจุบัน | `v0.4.7`; การเพิ่มรุ่น development ไม่ได้สร้าง release0.4.8 |
| Service development0.4.9 DOCX | source `8690193`; vendor ยังเป็น Core0.4.7, hash `067b7678c410e7413968159f7495fb3b0e6f3909f9c14d51eae20f7e5b7f4c3e`; I6 ยังไม่รับงาน |
| FlowDocMake0.2.8 / ชุดติดตั้ง | ใช้ pin/preflight ของรุ่นเดิม ไม่ได้เปลี่ยนเป็น Core0.4.8 และไม่เพิ่ม DOCX task UX จากการแก้คู่มือ |

ผลตรวจ Coreข้างต้นใช้ Linux/amd64,1GiB, consumer ปิด network/ไม่มี source mounts.
หลักฐานอยู่ใน [บันทึก integration](../../domains/flowdoc-docx-export-plan-2026-10-20.md#2026-10-24--core048-local-development-integration)
และ `srs-real-2026-10-24/integration-048/integration-result.json` ใต้ FlowDoc-recovery.
เป็นผลตรวจ implementation ก่อนปรับคู่มือรอบนี้ ไม่ใช่การทดสอบผลิตภัณฑ์ใหม่รอบนี้.
แพ็กเกจ release ที่จะสร้างจากคู่มือใหม่ต้องมี checksum/source ของตัวเอง.

PDF/DOCX ใช้ข้อมูล semantic เดียวกัน แต่ตัวจัดหน้าคนละตัว. DOCX receipt มี
pageCount:null/wordVerified:false และต้อง refresh fields/TOC ใน Word.
การส่ง native shaper+segmenter เข้า Core เลือก source-line/VML-word-box mode
สำหรับข้อความที่เข้าเกณฑ์โดยอัตโนมัติ; หลังแก้ข้อความ/ฟอนต์ใน Word อาจต้องสร้างใหม่.
การวัดความตรงต้องระบุไฟล์/font hashes, ขนาด/น้ำหนัก, ขอบเขตเอกสาร, Word/export
และผลทุกหน้าที่เกี่ยวข้อง แยก QA ของ LibreOffice ออกจาก native Word.
Prompt control แก้ metadata แล้วไม่พบ Angsana New แต่ Word102/FlowDoc101หน้า
ยังต่างกัน; ห้ามยุบเป็นเปอร์เซ็นต์ความตรงทั้งระบบ. Sarabun/Bai และผล SRS เดิม
เป็นหลักฐานตามขอบเขตนั้น ไม่ครอบคลุมทุกฟอนต์. PDF baseline เก็บไว้ตามเดิม;
private PDF calibration ยังเป็น opt-in ไม่ใช่กฎ PDF ปกติ.

ก่อน release: ตรวจเอกสารและ candidate จริง, pinแพ็กเกจ/affected consumers,
ข้อจำกัดและ mandatory gates ของขอบเขตที่จะส่ง แล้วทำ snapshot/tag เมื่อมีอำนาจ
ตาม [กติกา release](../../domains/flowdoc-export-working-release-rules-draft-2026-10-09.md).
Coreผ่านไม่ได้ปิด complete combined Service-suite gate ของ I6. คู่มือ canonical
รอบนี้ไม่เขียนทับ snapshot คู่มือที่บรรจุใน FlowDocMake0.2.8; ใช้ preflight hash เดิม
และเตรียม snapshot รุ่นใหม่แยกเมื่อออกรุ่น FlowDocMakeจริง.

## 1. Implementation baseline เดิม — 0.3.0 (ประวัติ)

ข้อกำหนด versions:[18] และจำนวนผลตรวจต่อไปนี้ใช้เฉพาะรอบเดิม ไม่ใช่เพดาน
หรือผลตรวจของชุด0.2.8. เก็บไว้เพื่อย้อนกลับที่มา ไม่ใช้แทน live contract ปัจจุบัน.

- Core `0.3.0`, release `6d2a9b7`, verified source `f21ab6a`; Service `0.3.0`, release `0c57eec`, source `57d9fd2`.
- Core artifact SHA256 `d2f2d23ea42072f0f5fe1f702445c4384c686a371ea76fbcc7b96c5a77594380`; Service pins this exact archive.
- Only nodeModelVersion18 is accepted. Use primary `flowdoc-core` / `flowdoc-service` checkouts; Area worktrees are retired after integration.
- Core533 tests and packed Linux consumer pass; Service222 tests pass without skips. PDF numbering/destination checks pass. Visual review covered247 consumer pages; the final package's48 PDF files are byte-identical to the reviewed outputs.
- Full SRS98-page comparison preserves all page resources, geometry and links. 96 pages retain identical drawing commands. Pages36/42 intentionally remove an orphan repeated table header; all body text is unchanged. The fixture contains361 distinct explicit REQ codes, all matched; do not substitute a count from another dataset.
- Live MCP contract reports versions:[18], publicationEnabled:false. Direct PDF file saving was verified after moving the launcher to the primary Service checkout.
- Durable local evidence: `flowdoc-core/artifacts/release030/worktree-evidence/1792046442725`, `flowdoc-service/artifacts/release030/worktree-evidence/release030-tests-final.json`, and `flowdoc-service/artifacts/release030/area98/parity.json`.
- Prior candidate area.5 baseline is historical. This cutover makes no new RAM/capacity claim and does not publish user templates.

## 2. Source index ของการตรวจเดิม

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

## 3. Proof ที่รันในรอบเอกสารเดิม — 2026-10-14

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

## 4. ขอบเขตที่รอบเอกสารเดิมไม่ได้พิสูจน์

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
