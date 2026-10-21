# FlowDoc DOCX Export Implementation Plan

> For agentic workers: execute only the authorized stage. Use
> `superpowers:executing-plans` for inline implementation, or
> `superpowers:subagent-driven-development` when that execution method is selected.
> Execute only the stage subsequently authorized by the owner; latest authorization is U2 in isolation only. No registered execution round or product integration is opened.

**Goal:** ใช้โครงสร้างเอกสารและข้อมูลชุดเดียวกันสร้าง PDF หรือ DOCX;
`Output-Format` ที่ไม่ส่งมาต้องให้ PDF ตามเดิม.

**Architecture:** ประกอบ template และข้อมูลเป็น `ResolvedDocument` ด้วยทางเดิม
แล้วเลือก PDF renderer หรือ DOCX writer. Core เป็นเจ้าของการแปลงเอกสาร;
Service เป็นเจ้าของตัวเลือกในคำขอ การตรึงงาน คิว การเก็บ และการส่งผลลัพธ์.
FlowDocMake เป็น consumer ที่ต้องรับชนิดไฟล์ตามที่ขอได้.

**Tech Stack:** TypeScript/Node.js, Core document composition, Service/Fastify,
PostgreSQL, multipart task transport และ DOCX/OOXML. Stage 0 เลือก
`docx@9.13.0` เป็น candidate ที่ทดลองในพื้นที่แยกแล้ว;
ยังไม่ติดตั้งหรือรับรองความครอบคลุมของ dependency ในระบบจริง.

**Spec:** ข้อกำหนดเจ้าของและสัญญาในเอกสารนี้ โดยเฉพาะ
[Agreed design](#agreed-design) และ [API contract](#api-contract).
รวม design และ staged plan ไว้ไฟล์เดียวตาม Document Budget.
แผนรวมตัวทดลองรอบปัจจุบันคือ
[Unified DOCX mapping contract and consolidation plan](#unified-docx-mapping-contract-and-consolidation-plan);
เป็น contract/profile เป้าหมาย; U1 มี isolated mapping checkpoint แล้วตามท้ายเอกสาร แต่ยังไม่รับรอง writer หรือผลใน Word.

## Authority Boundary

Owner: FlowDoc Project Control สำหรับข้อตกลงและลำดับงานร่วม;
`flowdoc-core` สำหรับ document semantics/writer, `flowdoc-service` สำหรับ
HTTP/task/storage และ `plugins/flowdocmake` สำหรับตัวเรียกใช้.

Role: Planning Partner / Documentation Synthesizer. คำขอเจ้าของวันที่
2026-10-20 เริ่มจากบันทึกแผน ต่อมาอนุญาต Stage 0 สำรวจ mapping/เลือกเครื่องมือ
และ bounded prototype ด้วย `docx@9.13.0` ในพื้นที่แยก พร้อมตรวจใน Word.
สถานะ: **U1 mapping and bounded U2 native text/image components checked; U3–U6 unstarted. Small independent package probe only; no public serializer, Word/SRS trial, PDF reference change or product integration. SRS tuning remains paused; V13 shift rejected and V11 retained only as bounded experimental baseline**.
ผลสำรวจอยู่ใน [Stage 0 discovery results](#stage-0-discovery-results);
ผลทดลองอยู่ใน [Prototype checkpoint](#prototype-checkpoint).
ผลทดสอบ SRS เดิมอยู่ใน [Existing SRS checkpoint](#existing-srs-checkpoint).
Work/Phase/Checklist/execution IDs: N/A สำหรับการวางแผนห้องเดียวนี้.
ไม่เปิด execution context ที่ปิดแล้วกลับมา.

Work Size: medium สำหรับการวางแผน; implementation แบ่งตาม stages ด้านล่าง.
Risk Tier: routine สำหรับเอกสารนี้; product stages มีความเสี่ยงเรื่องความครบถ้วน
และ compatibility ซึ่งต้องตรวจตามขอบเขต ไม่ใช่เหตุให้ประกาศ critical โดยอัตโนมัติ.
Work authority รอบปัจจุบัน: disposable prototype/discovery และบันทึกผลในแผนนี้;
ไม่ใช่ product implementation หรือการรับรอง feature ทั้งระบบ.

Allowed mutation: เอกสารนี้และ experiment root ที่ระบุในผลทดลองเท่านั้น.
อนุญาต dependency เฉพาะพื้นที่แยกและ Word review/export ของไฟล์ทดลอง;
ใช้ installed image แบบ read-only ใน disposable container เพื่อสร้าง Core PDF อ้างอิง.
ไม่แก้ Core, Service, plugin runtime, installed production package/configuration,
DB, template หรือเอกสารผู้ใช้. ไม่สร้าง release/tag/push/production install
และไม่เปลี่ยน system/DOCUMENT_MAP.
เอกสารนี้เป็นแผน ไม่ใช่ implementation Evidence หรือคำรับรอง DOCX readiness.

## Agreed design

ข้อตกลงจากบทสนทนากับเจ้าของ:

1. โครงสร้างและข้อมูลชุดเดียวกันใช้ได้ทั้ง PDF และ DOCX; ไม่ต้องบำรุง template
   หรือชุดข้อมูลอีกชุดสำหรับ DOCX.
2. DOCX เน้นส่งมอบเอกสารให้หน้าตาใกล้ PDF มากที่สุด โดยรักษาเนื้อหา ลำดับ
   ความสัมพันธ์ โครงสร้าง ตาราง รูปภาพ และรูปแบบให้ครบ.
3. ยอมให้จุดตัดบรรทัดและจุดแบ่งหน้าต่างจาก PDF ได้. การหายของข้อความ รูปภาพ
   การรวมช่อง หรือความสัมพันธ์ในเอกสาร ไม่ใช่ความต่างที่ยอมรับจากข้อนี้.
4. ใช้ Microsoft Word บน Windows เป็นเป้าหมายหลักของการตรวจหน้าตา.
   บันทึกรุ่น Word, ฟอนต์ และวิธีอัปเดต fields ที่ใช้ตรวจจริง.
5. ตัวเลือกชนิดไฟล์อยู่ระดับ request: `Output-Format`; ภายในใช้ `outputFormat`.
   หนึ่งคำขอสร้างหนึ่งชนิดไฟล์. เมื่อไม่ส่ง header ให้เป็น PDF ตามเดิม.

เส้นทางเป้าหมาย:

```text
template + data + assets
        -> validation / normalization / composition เดิม
        -> ResolvedDocument + resource identities
             -> PDF renderer เดิม
             -> DOCX writer ใหม่
```

ทางเลือกที่พิจารณา: (1) writer จากเอกสารกลาง เป็นแนวทางที่เลือก;
(2) แปลง PDF ที่สร้างแล้วเป็น DOCX เพิ่มขั้น reconstruct โครงสร้างที่มีอยู่แล้ว;
(3) บำรุง Word template แยก เพิ่มภาระรักษาความตรงกันสองชุด.
แนวทางที่เลือกตรงกับการใช้โครงสร้างและข้อมูลชุดเดียวกันมากที่สุด.
ไม่ใช้ภาพเต็มหน้าแทนข้อความ/ตารางเพื่อทำให้ดูเหมือน PDF.

## API contract

ใช้กับคำขอ generation แบบ multipart ของ `POST /documents` ทั้งทางเดิมและ
`task-mode: queue-v1`; การ lookup สถานะงานยังอ่านชนิดไฟล์จากงานที่บันทึกไว้.
ไม่ใส่ตัวเลือกลง `data`, `sections` หรือ template `formats`.

| Request header | ค่า normalized | พฤติกรรม |
| --- | --- | --- |
| ไม่ส่ง `Output-Format` | `pdf` | ใช้ PDF path เดิม |
| `Output-Format: PDF` หรือ `pdf` | `pdf` | สร้าง PDF |
| `Output-Format: DOCX` หรือ `docx` | `docx` | สร้าง DOCX |
| ตัวพิมพ์ผสม เช่น `Docx` | `docx` | normalize แบบไม่แยกตัวพิมพ์ |
| ค่าว่าง/มีแต่ whitespace/ค่าอื่น/list/ส่งซ้ำ | ไม่มี | HTTP 400, `INVALID_REQUEST` |

ชื่อ header ไม่แยกตัวพิมพ์ตาม HTTP. ตัดเฉพาะ whitespace ขอบค่าก่อนตรวจ;
การส่ง header ซ้ำยังผิดแม้ค่าทั้งสองเหมือนกัน. ค่า `null` แบบข้อความไม่ใช่การละค่า.
รักษาการตรวจ authentication/authorization เดิม และตรวจค่าก่อนสร้าง durable task
หรือรับ payload ขนาดใหญ่. ไม่ fallback เป็น PDF เมื่อขอ DOCX แล้วทำไม่ได้.

ผลลัพธ์ภายนอกยังใช้ multipart feedback ตาม task protocol เดิม:

| Output | Media type | ชื่อไฟล์เริ่มต้น | Page count |
| --- | --- | --- | --- |
| PDF | `application/pdf` | `document.pdf` | จำนวนหน้าจริงตามเดิม |
| DOCX | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `document.docx` | `null` หากยังไม่ได้จัดหน้าด้วย Word |

ตรึง `outputFormat` ตั้งแต่ admission; task/job/worker/result ต้องใช้ค่าเดียวกัน.
หลังสร้างงานแล้วเปลี่ยนชนิดไฟล์ผ่าน lookup ไม่ได้. เก็บชนิดไฟล์กับงานและ
ผลลัพธ์เพื่อแยกจาก template format และป้องกัน reuse ผลลัพธ์ผิดชนิด.
metadata ของ DOCX ต้องมีชนิดไฟล์ bytes และ SHA256 ตรง binary ที่ส่งจริง;
ห้ามคัดลอกจำนวนหน้า PDF หรือ cached Word properties มาอ้างเป็นจำนวนหน้าที่ตรวจแล้ว.
ค่าจำนวนหน้าจากการ review ใน Word เป็นหลักฐานการ review แยกต่างหาก.

PDF ที่ไม่ส่ง header และ PDF ที่ส่งชัดเจนต้องยังมี field/feedback/delivery
ที่ consumer เดิมพึ่งพา. การเพิ่ม metadata ต้องตรวจ old-client compatibility.
consumer ที่รองรับ DOCX ต้องตรวจ media type ให้ตรงชนิดที่ขอ รวมถึงนามสกุล
และ checksum ก่อนยืนยันส่งไฟล์สำเร็จ.

## Global Constraints

- ใช้ `ResolvedDocument` ก่อน PDF pagination; DOCX ไม่เรียก PDF glyph/draw output
  เป็นแหล่งโครงสร้างหลัก และไม่เขียน normalization/binding อีกชุด.
- ไม่เปลี่ยน schemaVersion/nodeModelVersion เพียงเพราะเพิ่ม output format;
  fixture ต้องครอบคลุม node models 18 และ 19 ที่รองรับปัจจุบัน.
- PDF behavior, warnings และข้อจำกัดเดิมไม่เปลี่ยนโดยปริยาย.
- DOCX ห้ามข้าม node/feature/asset โดยเงียบเพื่อให้ไฟล์สำเร็จ. กรณีที่ยังรองรับ
  ไม่ได้ต้อง fail ด้วย issue ที่ระบุตำแหน่งและเปิดเผย error ที่เหมาะสมใน Service.
- เป้าหมาย DOCX รอบนี้ไม่รับ success แบบ `completeness: partial` จากการ omit
  content/image. ถ้า normalization/preparation ทิ้ง image placements หรือ writer
  ทิ้ง content ต้อง fail พร้อม findings; warning ที่ไม่ทำเนื้อหาหาย เช่น low resolution
  แสดงตามจริงได้. ไม่เปลี่ยน partial-output policy ของ PDF เดิม.
- ข้อความภาษาไทย/อังกฤษ ตัวเลข ลำดับ และ source relationships ต้องรักษาไว้.
  ตารางต้องรักษา logical topology, spans, groups, labels และรูปภาพใน cell.
- ใช้ page geometry, margins, font selection, ขนาด, alignment, spacing, borders,
  fills และ image dimensions จากนิยามเดิม. ความต่างต้องระบุเป็นรายการ.
- ฟอนต์ต้องรักษา release/face/weight/style และ identity; ประเมินการฝังและสิทธิ์
  จากข้อมูลจริง. ไม่อ้างว่าใช้ชื่อฟอนต์แล้วหน้าตาตรงกันโดยไม่ตรวจใน Word.
- เลขหน้า สารบัญ และ internal destinations ต้องสอดคล้องกับ DOCX ของตัวเอง.
- ทรัพยากร ภาพ และ document snapshot ต้องคง caller-mutation isolation,
  bounded IO, cancellation และ integrity checks.
- ใช้ queue, quotas, task identity, cleanup และ expiry เดิมร่วมกัน.
  ไม่เพิ่ม worker count หรือผ่อน resource limits เพื่อให้ DOCX ผ่าน.
- Runtime export ไม่ติดตั้งโปรแกรมหรือดาวน์โหลด dependency/font เพิ่มเอง.
  การใช้ Word เพื่อ review ไม่เท่ากับกำหนดให้ server ต้องมี Word.
- รักษา package runtime floor ปัจจุบัน `node >=24.15.0 <25`;
  dependency ที่เลือกต้องรองรับ environment นี้.
- DB migration เป็น forward-only; ห้ามแก้ migrations 001–024 ที่ปล่อยแล้ว.

## Inspected baseline and ownership

Inspection locators วันที่ 2026-10-20; ไม่ใช่ immutable execution base ของงานอนาคต.
ก่อน execution ต้องอ่าน AGENTS และตรวจ branch/head/status ใหม่.

| Owner | Source identity / จุดที่เกี่ยวข้อง |
| --- | --- |
| Project Control | planning baseline `787de63404d1f4140c92f2bd99b08246699663fa` |
| Core | 0.4.7, `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`; `src/index.ts`, `src/composition/{composeTaskDocument,composeDocument,resolvedDocument}.ts` |
| Core PDF path | `src/pdf/createPdfEngine.ts`, `src/pdf/{imageResources,streamResources}.ts`, `src/layout/` |
| Service | 0.4.9, released snapshot `ca66f605b02a41d1bc3b05894fbc75f5224d4900`; `src/http/documents.ts`, `src/tasks/{intake,repository,normalize,render,render-child,processing,public,wire}.ts` |
| Service storage | `migrations/001_initial.sql` จำกัด media type เป็น PDF; `024_task_processing.sql` เพิ่ม nullable `page_count`; ตรวจ trigger identity ใน `022_task_intake.sql` ด้วย |
| Other Service consumers | `src/jobs/{render,render-child,processor}.ts`, `src/templates/contract.ts`, tools/authoring/preview ที่อาศัย PDF |
| FlowDocMake | development `plugins/flowdocmake/scripts/task-client.mjs` ตรวจรับเฉพาะ PDF และ pageCount บวก; installed package 0.2.8 เป็น released snapshot แยกจาก development |

Core guide: [flowdoc-core/AGENTS.md](../../../flowdoc-core/AGENTS.md).
Service guide: [flowdoc-service/AGENTS.md](../../../flowdoc-service/AGENTS.md).
Workflow: [flowdoc-workflow-economy-policy.md](flowdoc-workflow-economy-policy.md).

## Review Focus

1. คำขอเก่าที่ไม่ส่ง header ต้องได้ PDF พร้อมสัญญาที่ client เดิมตรวจผ่าน (Stage 3–4).
2. งานคิวสองชนิดใช้ input เหมือนกันต้องไม่สลับ format, resource pins หรือ output (Stage 3).
3. fixed frame/overflow และ merged/grouped table ต้องไม่ทำเนื้อหาหาย (Stage 0–2).
4. Word จัดหน้าใหม่แล้วสารบัญ/เลขหน้า/link ต้องยังถูกต้อง (Stage 2 และ 5).
5. ฟอนต์หาย ภาพมี alpha หรือ connection ขาดต้องไม่เกิดไฟล์สำเร็จที่ผิด/ไม่ครบ (Stage 1, 3–5).

## Stage 0 — Mapping and dependency decision

Authority: discovery ก่อน implementation; ผลที่เปลี่ยน contract กลับมาแก้แผนนี้.
Stage นี้ป้องกันการประกาศรองรับ DOCX ทั้งระบบจากตัวอย่างง่ายเพียงไฟล์เดียว.

- [x] ทำ matrix จาก node/props ใน `src/composition/resolvedDocument.ts` และ
  semantics ใน template/layout ที่เกี่ยวข้อง; ระบุ direct mapping, adaptation,
  หรือ unsupported พร้อม fixture. รวม text/inlines/line/page break, tables,
  spans/rowGroups/group labels, images, Section18/19, cover/blank,
  header/footer/columns/placement, fixed sizing, links/anchors, scoped TOC และ page fields.
- [x] ตรวจ fixed formats และ overflow: PDF ปัจจุบันมีบางกรณี omit พร้อม warning
  แต่ fixed text บางกรณี fail. DOCX ต้องไม่คัดลอกการ omit มาโดยเงียบ.
  ถ้ารักษาเนื้อหาครบในข้อจำกัดเดิมไม่ได้ ให้รายงาน unsupported/failure;
  การเปลี่ยน sizing semantics ต้องเป็นข้อตกลงที่ระบุใน matrix ก่อน implementation.
- [ ] พิสูจน์ทางทำ Word sections/bands, row-group continuation และ page fields/TOC
  โดยเฉพาะ total ที่ไม่นับบางหน้า, restart/hide และ scope. ไม่ hard-code หน้า PDF.
  ระบุวิธีให้ค่า fields ที่เห็นใน Word ถูกต้อง รวมการ refresh อัตโนมัติหรือ
  ขั้นตอนที่ผู้รับต้องทำ; ขั้นตอนเพิ่มเติมต้องเปิดเผยก่อนรับการรองรับนั้น.
- [x] ประเมิน dependency จาก official documentation และ version จริง:
  API coverage, OOXML validity, licenses, supported Node/runtime, image/font handling,
  ZIP buffering/peak memory, output limit และ abort. `docx` เป็น candidate แรก;
  ถ้าขาดความสามารถให้เสนอ adapter/OOXML เฉพาะจุดหรือทางเลือกพร้อมเหตุผล.
- [ ] ตรึง dependency/version และ interfaces ของ Stage 1 ในเอกสารนี้ก่อนเริ่ม code.
  กำหนด resource contract สำหรับ DOCX PNG/JPEG และ font identities โดยรักษา
  alpha/dimensions/source association; ไม่บังคับใช้ raw PDF RGB-deflate เป็น DOCX media.
- [x] เลือก hash-pinned input ชุดเดียวกันสำหรับสอง output พร้อม hashes และ coverage map.
  ใช้ fixtures/หลักฐานที่มีได้; gap เพิ่มเฉพาะกรณีที่ matrix ยังไม่ครอบคลุม.

Deliverable: matrix + dependency/interface decision ในแผนนี้จาก source/docs.
Discovery ไม่แก้ product candidate. ถ้าต้องสร้าง prototype หรือรัน library probe
ให้ระบุ bounded experimental implementation scope และพื้นที่แยกก่อนเริ่ม;
ไม่ถือว่า discovery authority อนุญาตเขียนหรือทดลอง product code.
Exit: ทุก feature ปัจจุบันมี mapping/วิธีพิสูจน์ หรือมี blocker ชัดเจน.
ห้ามลดขอบเขตความครบถ้วนเอง. Blocking unknown ทำให้ stage ที่พึ่งพาหยุด;
ส่วนอื่นที่ไม่พึ่งพาทำตามขอบเขตได้.

## Stage 1 — Core DOCX writer foundation

Depends on accepted Stage 0 decisions. Proposed files:
`src/docx/{createDocxEngine,types,resources,writeDocx}.ts`, `src/index.ts`,
dependency/lockfile, `tests/docx/{engine,resources,package}.test.ts`,
Core `README.md` / `docs/template-guide.md` เฉพาะ contract ที่ทำแล้ว.

Interfaces: consumes `ResolvedDocument`, existing resource identities and
Core `Result`; produces a DOCX engine with `generateDocxTo` sink-based entry,
checked image provider and a receipt containing media type, byte length and SHA256.
Names/types freeze in Stage 0; ไม่เปลี่ยน `createPdfEngine` signature เพื่อบังคับ migration.

- [ ] เพิ่ม failing tests: text/style/order ไทย–อังกฤษ, repeated composition,
  source snapshot isolation, image dimensions/alpha, output checksum/media type,
  unsupported node, cancellation, max output bytes และ malformed resources.
- [ ] รัน focused tests ยืนยัน failure ที่ตรงกับความสามารถที่ยังไม่มี.
- [ ] ทำ writer เริ่มจาก paragraphs/styles/images/simple tables โดยใช้ document
  กลางเดิม. Validate ทุก node ก่อนสำเร็จ; stage ยังไม่ครบต้อง fail ส่วนที่ไม่รองรับ.
- [ ] ตรวจ OOXML package/relationships และ absence ของภาพเต็มหน้าแทนโครงสร้าง;
  พิสูจน์ memory/cancellation ตามขนาด fixture ที่ตั้งใจรองรับ ไม่อนุมานจาก API ว่า stream.
- [ ] รัน `npm run build`, focused DOCX tests และ affected PDF/composition tests;
  packed consumer ต้องใช้ public package root ได้ใน Linux/amd64 ตาม Core guide.
  ตรวจ diff แล้ว commit เมื่อ checks ผ่าน.

## Stage 2 — Complete current document coverage

Depends on Stage 1. Proposed files: DOCX-only mapping modules
`src/docx/{tables,sections,bands,fields,links}.ts` และ matching `tests/docx/`;
reuse helpers ใน `tests/helpers/` แทนคัดลอก binding/composition logic.

Interfaces: consumes Stage 1 writer/resources; produces matrix-complete DOCX
mapping with the same source ids/order/relationships, plus explicit issues for failures.

- [ ] เพิ่ม failing tests สำหรับ spans/cell content, row break preferences,
  repeated headers, rowGroups/keep-start/group labels, fixed heights และ overflow.
- [ ] เพิ่ม failing tests สำหรับ mixed page geometry, cover/blank/Section18/19,
  explicit non-inherited/first/continuation bands, columns/placement และ page numbering.
- [ ] เพิ่ม failing tests สำหรับ three-level/scoped TOC, headings ในตาราง,
  bookmarks, internal/external links และระบบเลขหน้าหลัง Word repagination.
- [ ] ทำ mapping ตาม Stage 0; แยก semantic checks จาก Word layout checks.
  ไม่ใช้ผลลัพธ์ PDF pagination มาเติมเลขหน้า DOCX.
- [ ] รัน tests ที่เพิ่มและ affected existing suites; ตรวจ representative DOCX ใน Word.
  อัปเดต matrix ด้วยผลจริง/ข้อแตกต่าง แล้ว commit เมื่อ checks ที่ stage ต้องใช้ผ่าน.

## Stage 3 — Service request, persistence and delivery

Depends on Core package candidate from Stages 1–2 and frozen API contract.
Files: `src/http/documents.ts`, `src/tasks/{intake,repository,normalize,render,
render-child,processing,public,wire}.ts`, new `src/tasks/output-format.ts`,
shared output metadata/job paths ที่ได้รับผล, forward migration ถัดจากรุ่นล่าสุด,
`package.json`/lockfile/vendor artifact และ code-adjacent usage/API guidance.

Tests: existing `tests/task-{api,intake,processing,wire,record-reuse}.test.mjs`,
`task-queue-api.test.mjs`, `task-queue-scheduler.test.mjs` และ focused new output-format tests.

Interfaces: `OutputFormat = 'pdf' | 'docx'`; header parser returns normalized
format or existing `INVALID_REQUEST`. Persisted tasks expose immutable
`outputFormat`; output writer/transport use one format-to-media-type/filename mapping.

- [ ] เพิ่ม failing tests สำหรับ API table ทั้งหมด รวม absent/explicit PDF,
  case/OWS/empty/duplicates/lists, invalid-before-task และ lookup ที่แก้ format ไม่ได้.
- [ ] ทำ parser และตรึง format ใน task/job. Migration backfills/defaults งานเดิม
  เป็น PDF, ขยาย output media-type constraint และรักษา nullable page count.
  ขยาย immutable identity checks ให้ครอบคลุม format; ไม่แก้ migration เก่า.
- [ ] ต่อ worker dispatch ตาม format; รักษา fonts/template/assets pins,
  reservation/accounting และ cleanup. PDF jobs/authoring preview ที่มีอยู่ยังเป็น PDF
  เว้นแต่ระบุ consumer change ชัดเจน. ไม่ขยายไปทุก legacy endpoint โดยไม่จำเป็น.
- [ ] ตรวจ omission summaries จาก normalization/preparation/composition ก่อนส่ง DOCX;
  ถ้าเนื้อหา/รูปหายให้ failure พร้อม findings ไม่ส่ง partial artifact เป็น success.
- [ ] ทำ artifact event/binary headers/status metadata ให้ format และ SHA256 ตรงกัน;
  DOCX pageCount เป็น `null`; map unsupported DOCX issues โดยไม่กลบเป็น `PDF_FAILED`.
- [ ] ทดสอบ DB migration/replay กับ isolated DB, existing PDF rows,
  immutable-format tampering, restart/recovery, mixed PDF/DOCX queue,
  concurrent jobs, disconnect/cancel/output-limit และ partial-file cleanup.
- [ ] รัน Service build และ affected task/database/container checks.
  เทียบ PDF output/warnings กับ baseline ที่ input/resources เดิม; ไม่มี data loss
  และไม่มี quota/accounting leak. ตรวจ diff แล้ว commit เมื่อ checks ผ่าน.

## Stage 4 — Consumer and capability compatibility

Depends on Stage 3. Scope starts with `plugins/flowdocmake/scripts/task-client.mjs`
and its callers; discover exact caller list before edits. Update only the tool/contract
surfaces needed to request DOCX. PDF preview tools remain named and scoped as PDF.
ห้ามนำ DOCX ไปผ่าน PDF-only visual review/checker แล้วเรียกว่าตรวจแล้ว.

Tests: `tests/flowdocmake-task-stream.test.mjs`,
`flowdocmake-task.test.mjs`, affected preflight/integration tests and caller tests.

Interfaces: task client gets optional `outputFormat` with PDF default; sends
`Output-Format` when explicitly chosen, validates requested versus received media type,
and accepts `pageCount:null` only for DOCX. Capability advertises formats only after
server support; DOCX against an older server fails explicitly, never silently returns PDF.

- [ ] เพิ่ม failing tests: old PDF caller, explicit PDF, DOCX bytes/media/naming,
  null page count, media mismatch, interrupted ZIP และ old-server capability.
- [ ] ส่งตัวเลือกจาก caller ถึง API และยืนยัน binary/checksum ก่อน atomic local save;
  รักษา output-path ownership และไม่ overwrite ไฟล์เดิมโดยเงียบ.
- [ ] ปรับ capability/version checks, human-facing errors และคู่มือที่ได้รับผล.
  เลือก package/version ตอน release preparation ภายหลัง; ไม่กำหนด installed version ใหม่ในแผนนี้.
- [ ] รัน focused tests ด้วย `node --test` ตาม files ที่เปลี่ยน และ
  controlled API-to-client integration. ตรวจ diff แล้ว commit เมื่อ checks ผ่าน.

## Stage 5 — Word acceptance and PDF regression

Authority: verification ของ exact candidate; writes จำกัดที่ output area ใหม่.
การแก้ source/template/data เป็นงาน implementation กลับไป owner แล้ว refresh
เฉพาะ affected proof. ไม่แก้ candidate เพื่อให้ verification ผ่าน.

- [ ] ใช้ frozen input/resources/templates จาก Stage 0 สร้าง PDF และ DOCX
  โดยเปลี่ยนเฉพาะ output choice; ตรวจผล absent header เทียบ explicit PDF ด้วย.
- [ ] ตรวจ semantic inventory: ข้อความ/ตัวเลขครบและลำดับตรง, Section และ
  table topology/spans/groups/labels, image placements/alpha, styles,
  anchors/link destinations, header/footer และ TOC coverage.
- [ ] เปิดใน Microsoft Word บน Windows รุ่นที่บันทึกไว้; refresh fields ตาม
  วิธีที่ตกลงและตรวจผลที่ผู้รับเห็น. เก็บต้นฉบับกับไฟล์หลัง refresh คนละไฟล์.
  ห้ามแก้เอกสารด้วยมือเพื่อซ่อน writer defect.
- [ ] เก็บ DOCX/PDF/hashes และ rendered full pages จากเส้นทาง review ที่ระบุ;
  ตรวจทุกหน้าของ output ในขอบเขต. รีวิวตัวแทนทุก layout family ก่อนขยาย
  ไป full representative documents; ไม่จบด้วยการ unzip/validator ผ่านอย่างเดียว.
- [ ] บันทึกความต่างเป็นรายการ: line/page variation ที่อนุญาต,
  visual deviations ที่ยังต้องแก้ และ missing/incorrect content ที่เป็น FAIL.
  ไม่มีเปอร์เซ็นต์ความเหมือนที่ตั้งขึ้นโดยไม่มี metric.
- [ ] PDF regression ต้องรักษา semantic/visual/warning behavior ภายใต้ฐาน
  และ inputs ที่เทียบได้; reuse proof ได้เมื่อ identity/prerequisites ไม่เปลี่ยน.
  การมี DOCX ไม่ได้พิสูจน์ throughput/capacity หรือ SLA ใหม่.

Exit: ทุก acceptance criterion ด้านล่างมีหลักฐานครบ ไม่มี mandatory gap.
ปิดด้วยผลย่อในแผนนี้และอ้าง artifact/test receipts ที่ durable.
หลังผ่านแล้วหยุด; release/install เป็นคำขอแยก.

## Acceptance coverage

| Criterion | Owner/stage | Required evidence |
| --- | --- | --- |
| Input/template เดียวกันและ composition ไม่แตกเป็นสองชุด | Core 0–2 | Frozen hashes, composition/source-map checks, semantic inventory |
| Header/default/error contract | Service 3 | API tests รวม invalid/duplicate และ old-call PDF |
| ครบทั้ง content/table/image/style/Section | Core 1–2, review 5 | Feature matrix, OOXML/semantic tests และ full-page Word review |
| หน้าตาใกล้ PDF ตามข้อตกลง | Review 5 | Same-input pair, Word version/fonts, page images, exact difference list |
| TOC/page numbers/navigation ตรง DOCX | Core 2, review 5 | Fields/bookmarks tests และผลหลัง Word layout/refresh |
| ส่งและเก็บไฟล์ถูกชนิดครบ bytes | Service 3, consumer 4 | DB/API/stream tests, SHA256, correct media/filename/nullable page count |
| PDF เดิมไม่ถอยหลัง | Core/Service/consumer 1–5 | Affected regression suites, old-client test และ reviewed PDF baseline |
| คิว/resource/cancel/recovery ยังถูกต้อง | Service 3 | Mixed-format isolated task tests และ cleanup/usage receipts |

## Budgets, unknowns and next action

Document Budget: หนึ่งเอกสารนี้สำหรับ design, plan และ stage decisions.
อัปเดต API/package usage เฉพาะเมื่อ implementation จริงเปลี่ยน contract.
ไม่สร้าง Work/Phase/Checklist/report เพื่อเลียนแบบ separate-room workflow.

Proof Budget: focused tests ตาม impact, feature coverage matrix, frozen paired
artifacts และ Word full-page review; หนึ่ง acceptance pass หลัง repairs ที่จำเป็น,
ศูนย์ formal audit. Broad/capacity stress ไม่อยู่ในงบนี้. Recheck เพิ่มเมื่อมี
change/failure/stale prerequisite/unresolved affected area ตาม workflow policy.

| Unknown | Disposition / resolution |
| --- | --- |
| DOCX dependency/version และ complex-feature mapping | เลือก candidate 9.13.0 จาก source แล้ว; complex mapping ยังมี blockers ตามผลสำรวจ |
| Fixed/overflow และ PDF omission ต่างจากเป้าหมายครบถ้วน | ยืนยัน source conflict แล้ว; fail-closed เป็นข้อเสนอจนกว่าจะพิสูจน์ adaptation ที่ไม่ตัดเนื้อหา |
| Word field refresh และ page-total semantics | Blocking ต่อ fields/TOC acceptance; B3 ในผลสำรวจและ Stage 5 proof |
| Font embedding/resource conversion และ ZIP memory peak | API embedding พบแล้ว; resource acceptance และ memory/cancel ยังต้องพิสูจน์ B5–B6 |
| Word รุ่น/font environment ที่ใช้ review | Blocking ต่อ visual acceptance; บันทึกก่อน Stage 5 |
| Google Docs, LibreOffice, Word บนระบบอื่น | Deferred; ไม่อยู่ใน acceptance รอบนี้ |
| DOCX import/round-trip editing, frontend UI, both formats in one request | Deferred; ไม่อยู่ในขอบเขต |

Model decision: เอกสารนี้เป็น inline planning ภายใต้คำขอปัจจุบัน ไม่สร้าง
registered execution/model snapshot. ก่อนเริ่ม product stages ให้ resolve
model/effort จาก host availability จริงตาม workflow policy; PLAN สำหรับงาน
ข้าม owner มี default `gpt-6-astra` / `medium`, แต่ WORK เลือกแยกตาม stage
และไม่ inherit. ไม่อ้างว่าเปลี่ยน model ของ chat นี้แล้ว.

Next action หลัง review ผลสำรวจ: bounded experimental implementation เฉพาะ
blocking mappings/resource behavior ตามข้อเสนอท้ายผลสำรวจ ก่อนเปิด Stage 1.
ยังไม่มี authorization สำหรับ probe/implementation จากการสำรวจครั้งนี้.
ห้องเดียวเป็นค่าเริ่มต้นที่เพียงพอ; worktree isolation เลือกตาม concurrent changes และ risk.
ถ้าจะเปิด separate WORK room จริง ต้องมีเหตุผลและ return/ownership controls
ตาม workflow policy ก่อน dispatch. ไม่มี return route ที่สังเคราะห์ในรอบแผนนี้.

## Planning verification — 2026-10-20

ตรวจ source locators และ contract dependencies ระหว่างวางแผนแล้ว.
Self-review ครอบคลุม agreed requirements, dependencies/interfaces, defaults,
consumer/storage impact, acceptance coverage และ discovery/implementation boundary.
ตรวจ local Markdown links/anchors, `git diff --check` และ `npm run check:data` ผ่าน.
เปลี่ยนเฉพาะเอกสารนี้; ไม่มี canonical record หรือ generated projection เปลี่ยน.
Product feature stages ทั้งหมดยังไม่รัน; ไม่มี DOCX artifact หรือ runtime PASS ในรอบนี้.

## Stage 0 discovery results

ส่วนนี้เก็บ checkpoint ของ source/docs discovery ก่อนอนุญาตทดลอง;
ข้อจำกัดและคำว่า "ยังไม่รัน" ในส่วนนี้เป็นสถานะ ณ checkpoint นั้น.
ผลรอบทดลองที่ตามมาอยู่ใน [Prototype checkpoint](#prototype-checkpoint).

Observation date: 2026-10-20. ผู้ใช้อนุญาตให้สำรวจและสรุปก่อนแก้ระบบจริง.
Core/Service heads ยังตรง baseline ด้านบนและ working trees สะอาดระหว่างสำรวจ.
Project Control เริ่มที่ planning commit `e646f2b`.

ขอบเขตหลักฐาน: อ่าน source/tests/JSON/font headers, คำนวณ hashes และตรวจ
published metadata/source ของเครื่องมือ. ไม่รัน Core/Service/library, ไม่ติดตั้ง
dependency, ไม่สร้าง DOCX/PDF, ไม่เปิด Word และไม่แก้ product candidate.
ผลต่อไปนี้เป็น **source-backed mapping / design recommendation**;
API ที่ library มีอยู่ยังไม่ใช่หลักฐานว่า FlowDoc writer หรือ Word parity ผ่านแล้ว.

### Selection and alternatives

เลือก **`docx@9.13.0`** สำหรับ bounded proof ถัดไป. เหตุผล: สร้าง native OOXML
โดยตรงจากเอกสารกลางได้ และมี primitive สำหรับ text/runs/styles, tables/spans,
Section/bands, PNG/JPEG, hyperlinks/bookmarks, scoped TOC และ embedded fonts.
ไม่ต้องสร้าง Word template หรือ HTML model อีกชุดเพื่อเป็นแหล่งนิยามหลัก.

Published metadata ที่ตรวจจริง:

- Version `9.13.0`, license `MIT`, declared Node engine `>=10`.
- Published `gitHead`: `c98bc7351b76333d84c0cf8c2cddc538f7b37bf5`;
  source references ด้านล่างตรึงที่ commit นี้ ไม่ใช้ `master` ที่เปลี่ยนต่อได้.
- npm integrity:
  `sha512-MofrvX7rzwCe1xUFXnwneQHzv2p1lIUIDPD01DueOnKGw+TSKxAAcK5Beo69bTyqKUYsX8d49Co03Bcntc60WQ==`.
- Direct runtime dependencies ระบุ ranges `jszip:^3.10.1`, `nanoid:^6.0.1`,
  `hash.js:^1.1.7`; package ยังมี `@types/node:^26.6.2`.
  ตรวจ metadata ของ nanoid6.0.1 พบ engine `^22 || ^24 || >=26`, จึงรวม Node24.
  ยังไม่มี resolved lockfile/install; การ compile กับ Core types24/TS6 และ
  packed Linux/amd64 consumer เป็นหลักฐานที่ต้องทำในขั้นทดลอง/Stage 1.
- เมื่ออนุญาต implementation ให้ใช้ exact direct version และตรึง transitive
  resolution ใน lockfile. Version/integrity นี้เป็น selection record;
  ยังไม่อ้างว่า archive ที่ติดตั้งถูกตรวจหรือ dependency graph ทั้งชุดผ่านแล้ว.

| ทางเลือกที่ตรวจ | ความเหมาะสมกับโจทย์ | ผลเลือก |
| --- | --- | --- |
| `docx@9.13.0` | Native document object -> OOXML, มี primitives ใกล้ `ResolvedDocument`; ยังต้องทำ adapters และพิสูจน์ Word | เลือกแบบมี prerequisites |
| `docxtemplater@3.71.1` | Word-template engine; เพิ่ม Word template และการ map อีกชั้น ขณะที่เรามี semantic document อยู่แล้ว; ไม่คำนวณ pagination | ไม่เลือกเป็นแกนรอบนี้ |
| `@turbodocx/html-to-docx@1.23.1` | HTML -> native DOCX; เพิ่ม HTML/CSS translation และยังไม่พิสูจน์ complex group/field semantics ของเรา | ไม่พบข้อได้เปรียบเหนือ direct mapping |

Sources: [published docx metadata](https://registry.npmjs.org/docx/9.13.0),
[pinned package manifest](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/package.json),
[docxtemplater documentation](https://docxtemplater.com/docs/),
[docxtemplater pagination FAQ](https://docxtemplater.com/faq/),
[TurboDocx repository](https://github.com/TurboDocx/html-to-docx).

### Mapping matrix

Classification: **D** = มี native primitive ที่ตรงกับข้อมูลพื้นฐาน;
**A** = ต้องมี adapter และทดสอบ semantics/visuals;
**B** = ยังไม่พิสูจน์พฤติกรรมที่จำเป็น จึงเป็น blocker ของ feature ที่พึ่งพา.
แม้ D ก็ยังไม่ใช่ implemented/tested support.
Core source paths ต่อไปนี้อ้าง baseline ที่ระบุด้านบน.

| Source feature / facts | DOCX mapping ที่เสนอ | Class / coverage |
| --- | --- | --- |
| `ResolvedDocument` และ `sourceMap` (`composition/resolvedDocument.ts:28`, `composeTaskDocument.ts`) มีโครงสร้างหลัง binding และก่อน PDF pagination | ใช้ composition เดิม; writer เดิน roots/nodes โดยลำดับเดิมและเก็บ provenance แยกจาก layout metadata | A; same-input invariant |
| `TextBlock` / inline text / explicit line-break (`resolvedDocument.ts:8–13`) | Paragraph/TextRun/Break; รักษา whitespace, literal newlines, Thai/English และ empty strings | D/A; srs/table + whitespace gap cases |
| Legacy Sarabun 4 faces และ Library font selection (`fonts/selection.ts`) | Run font/size/bold/italic รวม complex-script properties และ `th-TH`; ไม่พึ่ง Word Normal defaults | A; resource proof B5 |
| `lineHeightPt`, left/center/right, fixed text height/verticalAlign | ตั้ง line spacing/paragraph spacing ชัดเจน, แปลงหน่วยและตรวจ rounding. ใช้ `LineRuleType.EXACT` ไม่ใช้ค่าชื่อ `EXACTLY` ที่ source library ระบุว่า invalid | A/B; Thai marks และ fixed overflow B4 |
| `LineBlock` มี width/thickness/color/alignment/before/after | Paragraph border หรือ native line element พร้อม adapter คำนวณ width/indent/spacing; ไม่แปลงทั้งหน้าเป็นภาพ | A; ต้องตรวจ minimal paragraph height |
| `PageBreak` (`layout/documentFlow.ts:190–203`) ถูก defer และไม่สร้างหน้าว่างซ้ำที่ page top | คง empty/break semantics ก่อน emit native page break; ไม่ serialize node ตามตัวอักษรทุกกรณี | A; blank/break tests |
| `Table`, column widths, borders/header fills (`resolvedDocument.ts:18–20`) | Native table + fixed grid widths; repeated headers เฉพาะ leading rows | D/A; table short/long/empty |
| `TableRow.allowBreak` และ `headerRowCount/repeatHeaderRows` | `cantSplit = !allowBreak`, `tableHeader` ตาม leading header count; manual page break ในตารางไม่ให้ผล repeat เหมือน auto break | A; protected rows และ multi-page headers |
| `TableCell.columnIndex/rowSpan/colSpan/padding/fillColor/childIds` | Cell grid/span/vertical merge และ native cell children; reconcile fully covered rows และ terminal paragraphs โดยไม่เพิ่มเนื้อหาปลอม | A; merged tests |
| `rowGroups`, `keepStart`, empty member groups (`cellTableFlow.ts:42–56,124–136`) | เก็บสมาชิก/group identities/order; paragraph keep-next/cantSplit เป็น candidate สำหรับ soft keep-start | A; ไม่ใช่ guarantee ของ pagination เดิม |
| `groupLabel` ถูกวาดครบทุก member fragment และเติม “(ต่อ)” เฉพาะ continuation (`cellTableFlow.ts:93,138`; `tests/layout/groupLabelFlow.test.ts`) | Native vertical merge/tableHeader อย่างเดียวไม่รู้ continuation ของแต่ละกลุ่มหลัง Word จัดหน้า | B1; ห้ามประกาศครบจาก ordinary table test |
| `ImageBlock.width/height` เป็น frame; PDF contain ตาม aspect ratio แล้ว center ใน frame (`tests/pdf/images.test.ts:21`) | `ImageRun` PNG/JPEG + คำนวณ contain จาก dimensions จริง พร้อมรักษาพื้นที่ frame และ alignment; ไม่ stretch ให้เท่ากรอบโดยตรง | A; stream-image JPEG/alpha PNG |
| Service ทำ orientation/sRGB/200-DPI variants ก่อน PDF (`tasks/render-child.ts:83–109,165`) | ใช้ verified normalized renditions/transform identity เดียวกัน; DOCX เก็บ encoded PNG/JPEG, PDF มี packaging RGB/alpha ของตัวเอง | A; ไม่ส่ง RGB-deflate เป็น DOCX media |
| Section18/19 order/identity/geometry (`template/pageSections.ts:38–48`, `composition/composeSections.ts:13–17`) | Native sections/page geometry; model19 UUID/label/nameBase ไม่ใช่เปลี่ยนเพียงชื่อ key. Model19 ห้าม `role`; ไม่ใส่ cover role ให้ model19 | A; page-sections/area-cover |
| Empty ordinary sections ถูก skip; explicit blank/cover คงอยู่ และ empty scoped TOC ไม่เพิ่มหน้า | Emit sections/blank pages ตาม semantic source; ตรวจ trailing paragraph และ next-page break ของ Word | A; cover/scoped fixtures |
| Section bands **ไม่ inherit จาก section ก่อน** (`composeSections.ts:19–22`) | เขียน explicit references หรือ empty header/footer parts ต่อ section; ป้องกัน Word Link to Previous เพิ่ม inheritance เอง | A; เป็นการแก้ความเข้าใจจากคำว่า inherited ใน draft เดิม |
| `all/first/continuation/none` อิง physical section-page index; header/footer เป็นอิสระ (`layout/pageBands.ts:11–13`) | `titlePage` + first/default parts พร้อม explicit empty parts; ไม่ผูก mode กับค่าที่พิมพ์เป็นเลขหน้า | A; independent mode combinations |
| Band weighted columns และ content/fixed sizing (`layout/pageBands.ts:17–29`) | Borderless fixed-width table; คำนวณ weight/gaps/padding และตรวจขั้นต่ำของ cell/paragraph | A/B; band exact heights B2/B4 |
| Band page-relative left/right/top-or-bottom offset และการลด body budget ตาม overlap ของแต่ละหน้า (`documentFlow.ts:70–80`) | Positioned native content + section distances เป็น candidate; first/continuation body height เปลี่ยนได้ใน Core แต่ Word section margins ปกติคงที่ | B2; ยังไม่พิสูจน์ safe mapping |
| Covers/blank/current sequence/hidden/excluded (`layout/systemPageCounting.ts:9–28`) | Section numbering restart/continue/hidden parts. Blank นับโดย default แต่ซ่อน fields; cover defaults exclude+hide แยกจากการ suppress bands | A/B; visibility ไม่เท่ากับ exclusion |
| `current/total` มี width; compact hidden block suppress ทั้งข้อความ; total นับทุก physical page ที่ไม่ excluded ไม่ใช่ last displayed number | `PAGE` สำหรับ current; `NUMPAGES`/`SECTIONPAGES` ล้วนไม่ตรง selective total. ต้องพิสูจน์ formula/bookmark/refresh strategy และ preserve hidden compact block | B3; numbering/compact tests |
| TOC1–3, section/document scope, heading ใน table, whitespace folding, cover exclusion (`composition/contents.ts:5–16`) | Section bookmark ranges + `entriesFromBookmark`; อาจใช้ explicit hyperlink/PAGEREF entries เพื่อคง flattened titles/excluded target behavior | A/B3; generic TOC ยังไม่พอ |
| Model19 anchor namespace เป็น JSON pair; internal refs local/cross-section (`composeSections.ts:24–29`, `composition/linkContract.ts`) | Stable legal Word bookmark names + logical-to-Word map; external hyperlink relationships ใช้ URL ที่ validate แล้ว | A; link/section-instance tests |
| Model19 fixed format เป็น capped remainder frame; overflow omit พร้อม warning และไม่ move frame ไปหน้าใหม่ (`documentFlow.ts:274–282`) | ไม่ทำ native clipping แล้วบอกว่าครบ. ข้อเสนอคือ fail-closed จนมี content-preserving adaptation ที่พิสูจน์และตกลงแล้ว | B4; sizing fixture เป็น negative/decision case |

Primary library capability references:
[run properties](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/paragraph/run/properties.ts),
[spacing](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/paragraph/formatting/spacing.ts),
[table cells](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/table/table-cell/table-cell-properties.ts),
[table rows](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/table/table-row/table-row-properties.ts),
[section properties](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/document/body/section-properties/section-properties.ts),
[image options](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/paragraph/run/image-run.ts),
[scoped TOC switches](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/table-of-contents/table-of-contents-properties.ts),
[Microsoft repeated-header rules](https://support.microsoft.com/en-gb/word/repeat-table-header-on-subsequent-pages).

### Fonts, packaging and resource limits

`docx9.13.0` รองรับ embedding regular/bold/italic/boldItalic และสร้าง ODTTF/
relationships/font-table entries. การ obfuscate เพิ่ม buffer ขนาดเท่าฟอนต์;
ไม่ได้ subset glyphs หรือพิสูจน์ permission ให้. Source:
[font options](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/fonts/font-table.ts),
[obfuscation](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/fonts/obfuscate-ttf-to-odttf.ts).

อ่าน OS/2 header ของ bundled Sarabun ทั้งสี่ face พบ `fsType=0`; มี
`assets/fonts/OFL.txt`. นี่เป็น static inspection ของ bundled files เท่านั้น.
Library font ปัจจุบันยอมรับ numeric weight 1–1000 (`fonts/validateSelection.ts:4`)
และ select exact face ตาม release/weight/style. DOCX embedding API มีสี่ face slots;
ต้องพิสูจน์ alias/family strategy สำหรับหลาย release และน้ำหนัก เช่น 500/600
โดยไม่ synthetic bold หรือเปลี่ยนเป็นคนละ face. ต้องคง license/hash checks ของแต่ละ font.
Source/library acceptance ยังไม่ผ่านจากการอ่าน flags เพียงอย่างเดียว.

สำคัญ: `Packer.toStream()` ของรุ่นที่เลือก compile document แล้วเรียก
`zip.generateAsync({type:'nodebuffer'})` จากนั้น emit ZIP ทั้งก้อนเป็น data event.
จึงยังมีทั้ง document/media model และ compressed output ใน RAM.
Source ของ method ไม่มี AbortSignal หรือ maxBytes;
การจำกัด sink หลัง pack ไม่จำกัด peak memory ตอน pack และการทำลาย exposed stream
ไม่เท่ากับยกเลิก compression. Source:
[pinned Packer lines166–182](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/export/packer/packer.ts#L166-L182),
[compiler](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/export/packer/next-compiler.ts).

ข้อเสนอ: generation อยู่ใน Service-owned child process เดิม มี input/media/font
bounds และ parent-controlled termination ตาม policy. ไม่ใช้ `Promise.race` แล้ว
คืน error ขณะที่ compressor ยังทำงานหลุด ownership. ยังไม่อนุมานว่า 2 workers
ภายใน 1-GiB profile ปัจจุบันปลอดภัยกับ DOCX; ต้องวัดเฉพาะ bounded probe ที่กำหนด.
หากต้องทำ ZIP adapter จริงให้เป็น implementation scope ที่ตกลงแยก;
เปลี่ยนเป็น JSZip generateNodeStream ก็ยังไม่ลบ retained document/media model.

Word refresh: pinned documentation ระบุว่า TOC page numbers รอ Word update และ
`updateFields:true` อาจมี prompt เมื่อเปิด. `docx/layout` มี estimator แต่ยังไม่มี
หลักฐานว่าตรง Word/FlowDoc; ไม่เลือกเป็น authority ของเลขหน้ารอบนี้.
ตรวจและเปิดเผยทั้ง initial view และผลหลัง refresh; ห้ามอ้าง cached PDF numbers.
[Pinned TOC guidance](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/docs/usage/table-of-contents.md),
[Microsoft field-update procedure](https://support.microsoft.com/en-us/word/update-fields).

### Proposed interfaces and unresolved contracts

Proposal สำหรับ bounded proof; **ยังไม่ freeze เป็น accepted implementation API**:

- `createDocxEngine(resources: DocxResources): Promise<DocxEngine>`;
  `DocxResources` ใช้ existing `FontResource[]`/license identities และ private temp root,
  ไม่บังคับพ่วง Python shaper paths ของ PDF ให้ DOCX.
- `generateDocxTo(document: ResolvedDocument, images: DocxImageProvider,
  output: DocxOutput, options: DocxOptions): Promise<Result<DocxArtifact>>`.
- Provider อ้าง PNG/JPEG, byteLength/SHA256, pixel dimensions และ immutable resource id;
  reads ผูกกับ verified private copies/chunk bounds; document props คง frame dimensions.
- `DocxOutput` มี awaited `write(Uint8Array)`/`abort(reasonCode)`;
  receipt มี media type/byteLength/SHA256/fontUsage และไม่สร้าง pageCount เทียม.
- Options ต้องมี byte/resource bounds และ abort semantics ที่ตรง source จริง.
  Signal checks ก่อน/หลัง packing ไม่ใช่ in-process immediate cancellation ระหว่าง pack;
  hard stop เป็นหน้าที่ owned process boundary. Numeric memory/input caps ยังไม่เลือก
  ก่อนมี bounded measurements. เพราะเหตุนี้ Stage 0 interface-freeze checkbox ยังเปิด.

| Blocker | ข้อเสนอ/หลักฐานที่ต้องได้ก่อนเปิด dependent implementation |
| --- | --- |
| B1 group label ต่อหน้า | ทดลอง native strategy กับหลายกลุ่มชื่อซ้ำ, single member ยาว, empty group, repeated headers; label/suffix ต้องตาม Word fragment จริงโดยไม่ duplicate สมาชิก |
| B2 page-relative bands/body budget | ทดลอง first/continuation modes กับ protected row ที่ต้องย้ายหน้าและ body budget ต่างกัน; ตรวจ explicit no-inheritance และไม่ทับ/ตัดเนื้อหา |
| B3 counted totals/scoped TOC | ทดลอง excluded cover/section, restart/hide, blank และ headings ในตาราง; ตรวจ Word refresh ทั้งก่อน/หลังและ exclusion semantics ของ target page |
| B4 fixed frame completeness | ข้อเสนอ fail-closed เมื่อยังรักษา frame และเนื้อหาทั้งหมดพร้อมกันไม่ได้; adaptation ต้องเป็นข้อตกลงใหม่ที่ชัดก่อน implement ไม่ตัด tail ให้เหมือน PDF |
| B5 exact font/image resources | พิสูจน์ exact face หลายน้ำหนัก/หลาย release, embedded Thai marks, PNG alpha/contain, stable private identity และ resource failure behavior; normalizer ที่ omit รูปต้องเป็น DOCX failure พร้อม findings ไม่ใช่ partial success |
| B6 packing memory/cancel | วัด document/media/font/ZIP lifetime บน bounded fixture, terminate เฉพาะ owned child ระหว่าง pack, ตรวจ no partial artifact/process leak และยังรักษา queue/resource policy |

การพบ blocker ไม่ได้แปลว่าเปลี่ยนไปใช้ library อื่นแล้วหาย; จุดหลักผูกกับ
Word pagination และ semantics ที่ FlowDoc กำหนด. ขณะนี้ไม่มีหลักฐานพอให้สัญญา
ครบทุก feature ด้วย `docx` หรือด้วย alternatives ที่ตรวจ.

### Hash-pinned inputs and coverage

เลือก source set ที่ commit Core `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`:
11 groups / 26 files. ยังไม่ copy ไปสร้าง export run และไม่ execute fixture builders.
Group digest คำนวณจาก raw working-copy bytes ณ inspection; ตาม file order ในตาราง:

```text
fileHash = lowercase SHA256(raw file bytes)
groupHash = SHA256(UTF8(concat(relativePath + NUL + fileHash + LF)))
```

ต้องตรวจ hash ซ้ำก่อน replay; ถ้า line endings หรือ bytes เปลี่ยนให้รายงาน mismatch
แทนการอ้างว่าเป็น input เดิม. ผล output สองชนิดต้องใช้ exact paired bytes/resources
จาก set เดียวกันในขั้นทดลองที่ได้รับอนุญาต.

| Group / Core-relative files ตามลำดับ | Coverage | Group SHA256 |
| --- | --- | --- |
| `fixtures/table/{template,short,long,empty}.json` | model18, grid/header, input length/empty | `b5bc6769de9d517d91eee9881300fa39b91202dd9ad72541c0c9bd0e45e02d80` |
| `fixtures/srs-basic/{template,request}.json` | model18 representative text/data | `f4cd737509e6eab2a349ca73b28668051a2e2581d3c68708de38904bc44ba50f` |
| `fixtures/row-groups/{template,request}.json` | model18 groups/repeats | `f2fba76c6e7fe580d016150789bc41fa189e641b1af62f7cfe730309cd208d71` |
| `fixtures/page-bands/{template,request}.json` | model18 weighted band columns | `4c1b4910ae22e87b9efdd375fa1326f5dc27f7585a21ec808edd984991adfeda` |
| `fixtures/page-numbering/{template,request}.json` | model18 numbering policies | `80fa7ffe6b137b12440438e96a33f6d791bc383fe5460c76857629ab8826a9b3` |
| `fixtures/cover-pages/{template,request}.json` | model18 cover/blank | `055ac62ecaddaf4dd3ef81ab0fb9dac114012cdaac3e415fb4e2d1bbcbb39301` |
| `fixtures/scoped-contents/{template,short,long}.json` | model19 scoped TOC and repagination | `1a7752677bd1f3c2260147b96f7cd1bbf5797b7e70ed979701c6cfaae077dc0f` |
| `fixtures/format-sizing/{template,request}.json` | model19 fixed/auto and negative completeness cases | `d37a4188a5ac3a3be62ea379be03369d389d5b79c5963f55b232d54f50ba6de8` |
| `fixtures/area-cover/{template,request}.json` | model19 authored area composition; ไม่ใช่ cover role | `e4bf4ed70b9dc2e89aba5ea35ca751b700c61e24cf225c276f29de4cb45061ba` |
| `fixtures/page-sections/{template,request}.json` | model18 per-section geometry/order | `3984ebcf26c8c3b9eda90a04a6602c063f38df681f176cb55d83574278bf9c10` |
| `fixtures/stream-images/{manifest.json,image-0.jpg,image-1.png}` | JPEG + alpha PNG encoded sources; resource fixture ไม่ใช่ complete document | `66b5fa6afcf05ed09edca2976997587e1bd8dabcb63b885c3157ad3150f3010b` |

Resource source SHA256: `resources.json` =
`7d32ef190b43587f35d3b6a04755558aaa629b8e77859f7d28a47cb4d46c6ede`;
`assets/fonts/OFL.txt` =
`be28652aa304594809e7174cd0206f8b9381a719a581fc429955c04de0f3ad1a`.
Bundled Sarabun font bytes inspected:

| Face under `assets/fonts/` | fsType | SHA256 |
| --- | --- | --- |
| `Sarabun-Regular.ttf` | 0 | `b8150084e25734e6f31696c57ff009f5564efa09d295848b717d9e2328c0311d` |
| `Sarabun-Bold.ttf` | 0 | `5d1fc1ee63ab861fb2022a212b5ff270848582bb9d9cba73b2d2aaabb16d0a18` |
| `Sarabun-Italic.ttf` | 0 | `fb86138e0cf99786db40715a84df51508766371e2f1f2822faf22cba6563acc7` |
| `Sarabun-BoldItalic.ttf` | 0 | `a497ef98fad371e04bc64076b213da00c05a84881494ee36a4c61922c65ff7ef` |

Coverage gaps: ยังไม่มี serialized group-label request ใน Service fixture
(`tests/fixtures/group-label/template.json` มี examples ว่าง); ใช้
Core `tests/helpers/groupLabels.ts` และ `tests/layout/groupLabelFlow.test.ts`
เป็น recipes สำหรับขั้นทดลองที่ได้รับอนุญาต. Helper SHA256:
`c266e2adbd977bc69d48ff57404faa9aa2c574613d939db4ca01987658d3932d`.
Merged/links/fixed Thai marks/band-intrusion/omitted-anchor cases บางส่วนยังอยู่
ใน existing test builders; ยังไม่ได้ serialize เป็น paired candidate inputs.
Hash ของ helper ไม่ใช่ hash ของ input ที่ยังไม่ได้สร้าง.

### Discovery closeout and proposed next checkpoint

**Completed:** source matrix, published tool selection, static resource/packing
limitations และ hash-pinned starter input set. **Not completed:** prototype,
accepted resource/interfaces contract, Word behavior/rendering, performance/memory
proof และ product integration. Stage 0 source/docs discovery สิ้นสุดได้พร้อม blockers;
Stage 1 implementation-entry prerequisites ยังไม่ผ่าน.

ข้อเสนอรอบถัดไปเพื่อ review: bounded experimental implementation ในพื้นที่แยก
เฉพาะ six blocker cases B1–B6, ตรวจผลจริงใน Word และ packing lifecycle.
เลือก contract ที่รักษาเนื้อหาครบจากผลทดลองแล้ว freeze interfaces/limits ในแผนนี้.
ไม่เริ่ม product integration, DB migration หรือเปลี่ยน installed plugin ระหว่าง probe.
ถ้าพฤติกรรมใดทำไม่ได้ตามสัญญา ให้รายงานทางเลือกและความต่างก่อนขยาย scope.

Verification ของเอกสารผลสำรวจ: `git diff --check`, local links/anchors,
`npm run check:data` และการคำนวณ group hashes ย้อนกลับจากตารางทั้ง
11 groups / 26 files ผ่าน. Source inspection รวม font headers/metadata
เป็น read-only; Core และ Service ไม่มี tracked/untracked changes.
ไม่มี runtime/library/rendering test จึงไม่อ้าง DOCX/PDF regression PASS.

## Prototype checkpoint

Owner authorization: ทดลอง six blocker cases B1–B6 ด้วย `docx@9.13.0`
ในพื้นที่แยก ตรวจใน Microsoft Word และสรุปก่อนเอาเข้าระบบจริง.
Checkpoint date: 2026-10-20. **ทดลองและตรวจครบตาม bounded sample;
ยังไม่ผ่าน feature acceptance ทั้งระบบและไม่เริ่ม product integration**.

Experiment root:
`C:/Users/nekot/Documents/Codex/2026-10-20/docx-prototype-9130`.
พื้นที่นี้แยกจาก product checkout; การเขียนผลทดลองจำกัดอยู่ใน root นี้.
Work Size medium / Risk routine; role Planning Partner + Evidence Reviewer.
Work/Phase/Checklist/execution IDs N/A ตาม single-room rules.
Proof Budget: 9 original DOCX, B3 diagnostic derivatives ที่เก็บแยก,
9 Word-exported PDF / 16 pages และ Core reference PDF / 1 page;
package/resource checks และ bounded pack/cancel probes. ตรวจภาพครบทั้ง 17 หน้า.
Document Budget: อัปเดตแผนเดิมนี้หนึ่งไฟล์; ไม่สร้าง Work/report/map records ใหม่.

Environment: Node `24.19.0`, local `docx` exact `9.13.0`, released Core `0.4.7`,
Windows Word file/product version `16.0.20430.20182`.
Package lock อยู่เฉพาะ experiment root; ไม่รัน install scripts.
Core tarball SHA256 `13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad`.
PDF reference รันจาก installed image identity
`sha256:9d76527509c0bed79350dc823e34d7e5fa1ab7ea4176e95277bb57af5a06b723`
ใน disposable container, network none / 256 MiB / 1 CPU / read-only inputs.
ไม่เรียก generation API หรือ DB; container ถูกลบหลังจบ.

### Evidence boundary and replay locators

Paths ต่อไปนี้ relative ต่อ experiment root. นี่เป็น local experimental evidence,
ไม่ใช่ registered production Evidence และไม่ใช่ source of product truth:

| Locator | สิ่งที่ตรวจย้อนกลับได้ |
| --- | --- |
| `evidence/generation.json`, `inputs/` | source descriptors, expected tokens, original output hashes และ exact shared Core resolved document |
| `outputs/`, `outputs/diagnostics/` | 9 original DOCX, Core reference PDF และ B3 candidates ที่ไม่เขียนทับต้นฉบับ |
| `word/` | Word-exported PDFs และ B3 Word-saved DOCX หลังอัปเดตสารบัญ |
| `renders/`, `evidence/word-render-manifest.json` | PDF source hashes และ full-page PNGs ที่ตรวจทุกหน้า |
| `evidence/independent-package-audit.json` | ZIP/XML integrity, content/order, decoded font hashes และ original image bytes |
| `evidence/independent-word-text-audit.json`, `evidence/independent-visual-review.json` | extraction เทียบ source และผลตรวจภาพ; extraction ไม่ใช้แทน visual completeness |
| `evidence/b3-word-audit.json`, `evidence/word-font-subset-audit.json`, `evidence/word-image-audit.json` | fields/links, actual font subset metadata และ image placement/alpha |
| `evidence/b6-*-receipt.json`, `logs/b6-*.jsonl` | pack lifecycle, memory observations, failed attempt และ corrected cancellation |
| `evidence/prototype-review.json`, `evidence/artifact-manifest.json` | root review observations, coverage gaps และ file hashes ของ review package |

B0 ใช้ actual public Core validate → prepare → compose จาก exact
`fixtures/table/{template,short}.json`; resolved JSON เดียวกันป้อน Core PDF
และ disposable DOCX subset mapper. B1–B5 เป็น source-backed experimental
recipes ที่แปลงเป็น native Word constructs โดยตรง; **ไม่ใช่ full Core writer**.
ไม่ได้ replay starter groups ทั้ง 11 groups / 26 files ผ่าน writer ครบทุก feature.
การที่ Word เปิด recipes ได้จึงไม่พิสูจน์ mapping ของทั้ง node models 18/19.

### Six blocker results

| Case | ผลใน Word / probe | ผลต่อการตัดสินใจ |
| --- | --- | --- |
| B1 group label continuation | Native vertical merge 2 หน้า: member tokens ทั้ง 75 อยู่ครบครั้งเดียวตามลำดับ, header columns ซ้ำ, same-name groups แยกกันและ empty group อยู่ครบ; แต่ label ของ G0 บนหน้าต่อว่าง. One-table-per-group ซ้ำหัวกลุ่มได้ แต่ย้าย label ไปเป็นหัวตารางและยังไม่มี continuation-only `(ต่อ)` | **FAIL exact continuation semantics**; มีทางเลือกที่รักษาเนื้อหา แต่ต้องตกลงรูปแบบก่อนใช้. ไม่ duplicate สมาชิกเพื่อแก้ label |
| B2 bands/body budget | 3 หน้า: first-header เฉพาะหน้าแรก, continuation-footer เฉพาะหน้าต่อ; protected row 6 บรรทัดย้ายไปหน้าที่ 2 ทั้งแถว; section ถัดไปไม่ inherit bands. ไม่เห็น overlap/clip ในตัวอย่าง | **PASS bounded recipe**; ยังไม่พิสูจน์ general first/continuation body-budget solver หรือ arbitrary columns/bands จาก Core |
| B3 numbering / scope / links | Corrected candidate 4 หน้า: cover ซ่อน fields, PAGE เป็น hidden/1/5/6, raw NUMPAGES 4, counted total 3; หลัง Word update TOC มีเฉพาะ 3 scoped headings รวม heading ใน table ด้วยเลข 5/5/6. PDF links 5 จุด resolve ถูก; native Word jump ไป body-two และกลับ table target ถูก | **PASS bounded Word behavior / RISK cached fields**; สูตรนี้หัก cover ที่กำหนดไว้ 1 physical page เท่านั้น. Arbitrary excluded/blank pages และ general counted-total policy ยัง UNKNOWN |
| B4 fixed-frame completeness | exact 60-pt row เห็นเพียง tokens 01–03, tokens 04–18 ถูกตัด แม้ XML และ PDF extraction ยังพบทั้ง 18. แบบ at-least height เห็นครบทั้ง 18 และ sentinel ไม่ทับกัน | **FAIL exact fixed height + complete content**; auto-height เป็น explicit adaptation ที่เปลี่ยน sizing contract. Preflight reject ใน prototype เป็น conservative check ของ recipe ไม่ใช่ proof ของ Core overflow detector |
| B5 fonts / images | normal Thai marks ครบ, bundled regular/bold/italic/boldItalic และ exact 500/600 + old/current release เป็น distinct embedded faces จริงตาม PDF font metadata. DOCX font payloads ถอดแล้วตรง source hashes; PNG alpha เห็น checkerboard, JPEG 3:2 อยู่กลาง frame พร้อมช่องบน/ล่างประมาณ 32 px | **PASS bounded visual/resource identity**; tight 8-pt diagnostic lines overlap. ยังไม่พิสูจน์ generic font fallback, corrupt/missing-resource failure, atomic private snapshot หรือ normalizer omission guards |
| B6 pack / memory / cancel | 9-doc generation child exit 0/reaped, sampled working set 92 MiB. Small 400-paragraph probe self-reported RSS สูงสุดที่ log 64.46 MiB, output 26,733 bytes. Corrected IPC cancellation หยุด owned child ที่ ZIP start, reaped และไม่มี final/partial artifact | **PASS process-boundary cancel / UNKNOWN capacity**; ไม่ใช่ in-process AbortSignal, peak-memory ceiling, concurrency หรือ 2-worker / 1-GiB acceptance |

B0 เพิ่มหลักฐาน shared-input path: ข้อความและ topology ตารางอยู่ครบ แต่ Word
row height ประมาณ 20.53 pt เทียบ Core 28 pt เพราะ subset mapper ยังไม่ map
cell padding/row sizing ครบ. จึงไม่อ้าง near-PDF geometry acceptance จาก B0.

### Failed attempts and Word update limits

- Original B3 เปิดใน Word ไม่ผ่านเพราะ prototype ใช้
  `ImportedXmlComponent.fromXmlString()` แล้วเกิด invalid `<undefined>` wrappers
  ใน footer3/footer4. XML parsing เพียงอย่างเดียวตรวจไม่เจอ schema defect นี้.
  เก็บ original ไม่เปลี่ยน; minimal derivative แก้เฉพาะ wrappers สอง footer parts.
  Corrected source ใช้ public component constructors และสร้าง footer XML ตรง
  minimal derivative. Word เปิด corrected-source candidate ได้; ไม่ใช่ข้อสรุปว่า
  Word ไม่รองรับสูตรหรือว่า production writer ถูกแก้แล้ว.
- B3 เปิดโดยตอบ No ต่อ update prompt เพื่อดู initial TOC: entries ยังไม่มีเลขหน้า.
  ใช้ Ctrl+A → F9 → Update entire table; ได้ 5/5/6 แล้ว Save As เป็นสำเนาใหม่
  และ export PDF ด้วย Word. Word PDF แสดง fields ถูก แต่ Word-saved DOCX ยังมี
  `REFRESH` caches ของ PAGE/NUMPAGES ในบาง footers; complex formula cache เป็น 3.
  ห้ามสัญญาว่าผู้รับทุก viewer เห็นค่าถูกก่อน refresh หรืออ้าง cached PDF page count.
- Word save ขยาย B3 จาก 193,799 เป็น 1,809,394 bytes และเพิ่ม style/default font
  embeddings; PDF ยังใช้ Sarabun. ไม่ใช้ Word-saved bytes แทน generator output
  โดยไม่เปิดเผย และไม่กำหนดให้ export server ต้องมี Word.
- Initial B6 cancellation แบบ polling ช้าเกินไป: child exit 0 และมี final ZIP.
  Receipt แม้เขียนเหตุผล cancel ก็ยัง **FAIL**. Corrected IPC attempt แยก receipt:
  child SIGTERM/reaped, จบที่ ZIP start, ไม่มี ZIP end/output, 352.16 ms รวม;
  self-reported RSS ล่าสุด 108.12 MiB. ค่านี้ไม่ใช่ peak working set.
- Host safety floor 1,536 MiB และ child cap 384 MiB ใช้เฉพาะ bounded experiment;
  ไม่ใช่ production limits ที่ freeze แล้ว. ไม่ปิดโปรแกรมหรือเอกสารที่ไม่เกี่ยวข้อง.
- `render_docx.py` ผ่าน LibreOffice ไม่สร้าง PDF และจบด้วย render/profile-lock error;
  ไม่ใช้เป็น PASS. Primary visual evidence มาจาก Word export แล้ว render ด้วย Poppler.
  ไม่มีการทดสอบ LibreOffice/Google Docs/viewer อื่นผ่านรอบนี้.

### Decision and remaining entry prerequisites

คง `docx@9.13.0` เป็น implementation candidate ได้จาก primitive/resource behavior
ที่เห็นจริง; **ยังไม่เปิด product integration**. สิ่งที่ต้องตกลง/ทำก่อน dependent stage:

1. เลือก semantics ของ group label ต่อหน้า: รักษาด้านข้างแบบเดิมยังไม่ผ่าน;
   repeated group header เปลี่ยนหน้าตาและไม่มี suffix เฉพาะหน้าต่อ.
2. จำกัดหรือพิสูจน์ counted-total policy ที่กว้างกว่าสูตร one-page excluded cover;
   ระบุ field-refresh requirement และ initial-view behavior ให้ชัด.
3. ยืนยัน fail-closed สำหรับ fixed content ที่ตรวจความครบไม่ได้;
   auto-height ต้องเป็น adaptation ที่ตกลง ไม่ใช่ implicit fallback.
4. ทำ writer/provider จาก actual ResolvedDocument พร้อมครบถ้วน/identity/negative
   checks และ freeze resource bounds/interfaces จากหลักฐานที่เหมาะกับ runtime.

Stage 0 semantic/interface prerequisites ที่ยังไม่ผ่านคง checkbox เปิด;
Stages 1–5, API/header/default-PDF regression, DB migration, queue/consumer
และ production capacity ยังไม่รัน. ข้อตกลง `Output-Format` omitted → PDF เดิมคงอยู่.
ไม่มีการเปลี่ยน system map, DOCUMENT_MAP หรือ promoted production Evidence.

Closeout: checkpoint **PASS as an experiment with explicit FAIL/RISK/UNKNOWN results**.
Core/Service source heads และ clean status ไม่เปลี่ยน; original 9 DOCX hashes คงเดิม.
ปิดเฉพาะหน้าต่างต้นแบบหลังเก็บหลักฐาน และคงเอกสาร Word ของผู้ใช้ที่เปิดอยู่ก่อน.
Verification ของแผน: diff/whitespace, local links/anchors และ `npm run check:data`.
ไม่มี canonical data เปลี่ยนจึงไม่ regenerate projections; ไม่อ้าง product test PASS.

## Existing SRS checkpoint

Owner authorization: ทดสอบกับโครง SRS ที่มีอยู่ในระบบประมาณ 98 หน้า;
เจ้าของยืนยันว่าไม่สร้างโครงใหม่. Checkpoint date: 2026-10-21.
**ผล: shared-input composition และ static DOCX coverage ผ่าน;
Word/layout acceptance FAIL จึงยังไม่เริ่ม product integration.**

Experiment root:
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130`.
Role: Planning Partner / Evidence Reviewer. Work Size medium / Risk routine;
Work/Phase/Checklist/execution IDs N/A สำหรับ single-room disposable experiment.
Allowed mutation: experiment root และแผนเดิมนี้หนึ่งไฟล์.
ไม่แก้ template/draft, product source, DB, API, installed runtime หรือ maps.
Proof Budget: exact existing SRS input freeze, public Core composition,
paired Core PDF เทียบครบ 98 หน้า, two DOCX candidates และ actual Word attempts;
หยุดหลัง Word ไม่ตอบสนองซ้ำ ไม่ขยายเป็น unbounded repair/integration.

### Exact existing source and shared path

- Live draft `008980f5-dd0d-4f7d-86be-2fc3f300e08d`, docKey
  `ttt-spaceship-srs-native-full-011-20261015`, name
  `SpaceShip SRS complete source trial (explicit Areas)`;
  revision 1, model 18, 7 sections. Fingerprint
  `ffcde8736980748a950fb56c2c786b66ef0f52d482ac383a7e31a91ef0a62f02`.
- เลือก original input เฉพาะ preview identity/revision/fingerprint ที่ตรงกันจาก
  installed 0.4.9/0.2.8 backup; ไม่ใช้ capacity-030 หรือ derived two-section queue fixture.
  Canonical original-request serialization SHA256
  `b8ea15e30f0c90d53f81b74c8250b8f3a89d55ad0dc336c24f32c22cfa049aa0`;
  ค่านี้ไม่ใช่ raw backup-file hash. สำเนาสำหรับ offline composition เอาออกเฉพาะ
  transport `uploadId`; business data/sections/resource IDs คงเดิม.
- Existing reference PDF: 98 pages / 2,559,955 bytes, SHA256
  `cd2fde00ea5273c889498eb490ff2e1fa945f7e4fbdc74cd65f25bbb9643ebf1`.
  ตรึง raw PNG ต้นทางครบ 13 resources พร้อม source paths และ hashes.
- ใช้ released Core 0.4.7 public `validateTemplate` → `prepareGeneration` →
  `composeDocument` เหมือน Service; ทุก stage OK, warnings ว่าง.
  Exact ResolvedDocument raw-file SHA256
  `920976069d27da172193fb253e1c3b313299327a6f7994755fb2b927bfdfa301`
  เป็น input ร่วมของ PDF และ disposable DOCX adapter.
- ใช้ installed Service image เดิมและ `prepareImage` helper สร้าง 13 prepared
  variants ในพื้นที่แยก; ไม่เรียก DB-owned preparation helper หรือ HTTP generation.
  มี `IMAGE_LOW_RESOLUTION` 4 รายการ; ไม่ข้ามรูปและไม่แสดงว่า warnings นี้หายไป.
  DOCX embeds exact prepared PNG bytes; paired PDF ใช้ RGB/alpha จาก bytes ชุดเดียวกัน.
- Existing SRS นี้ระบุ `continue` ทุก section และ cover `visibility: hide`;
  จึงนับหน้าปกรวมด้วย. ไม่ใช้สูตร `NUMPAGES - 1` หรือ restart body จาก B3.

### Results and acceptance coverage

| Criterion | Evidence / result | Boundary |
| --- | --- | --- |
| Existing SRS identity and no template rebuild | `evidence/source-freeze.json`, `compose-result.json`, `input-immutability.json`; frozen 19 files unchanged and live revision/fingerprint checked again | ไม่ได้เปลี่ยน draft หรือสร้าง SRS ใหม่ |
| Paired PDF from exact resolved/resource set | `outputs/srs-paired-core.pdf`, SHA256 `e368da46a89ca81b07931a30366a0210fbc6e4cd4a7c771969fbaf12df13cfb2`; `evidence/paired-core-alpha-retained-comparison.json` | 98/98 pages: decoded content/resources, text, geometry, link targets/coordinates และ 80-dpi pixels ตรง reference; ไม่ใช่ DOCX visual proof |
| Native DOCX content/order | `evidence/audit-mapping-v2.json`, `docx-inline-v2-package-audit.json` | 1,814 nonempty body paragraphs ตรง source ทุกข้อความและลำดับ; 198 heading texts/levels/order และ native TOC entries ครบ; เป็น XML/package proof |
| Tables and pictures | Same static audits plus `docx-generation.json` | 200 tables / 933 rows / 1,932 cells / 197 column spans; body images 371 placements, 13 exact prepared media; section order 7 และ internal link targets 198 resolve. ยังไม่พิสูจน์ว่า Word แสดงครบโดยไม่มี overlap/clip |
| Actual Word opening / stable layout / export | Two actual Word attempts on `16.0.20430.20182`, `evidence/srs-review.json` | เปิดผ่าน field/TOC prompts และเห็นหน้าปก แต่ค้างระหว่าง Save As DOCX รอบแรกและ PDF export รอบสอง; ไม่มี completed Word PDF หรือ Word-saved DOCX ที่ใช้ตรวจทุกหน้าได้: **FAIL** |
| Near-PDF appearance, Thai shaping, table continuation, TOC/page fields after refresh | No completed Word rendering | **UNVERIFIED**, ไม่ใช้ static content checks หรือ PDF parity มาแทน |
| Production/API behavior | No product mutation/tests in this checkpoint | `Output-Format` omitted → PDF ยังเป็นข้อตกลง; ไม่ใช่ tested API implementation |

### Two candidates and observed limits

1. V1 `outputs/diagnostics/srs-floating-v1.docx` (same bytes also in
   `outputs/srs.docx`): 1,080,150 bytes, SHA256
   `a00a41fd3c3deb17255a1ff40bede02b46a2453955fc384a73aa13114156da2a`.
   ใช้ native floating body images และ page-relative floating band canvases.
   Word เปิดและเริ่ม update entire TOC ได้; Save As ค้างต่อเนื่องหลายนาที,
   observed process working set 564 MiB. `word/srs-refreshed-v1.docx` เป็น 0 bytes
   จึงเป็น failed output ไม่ใช่ deliverable. เจ้าของช่วยปิดเฉพาะหน้าต่างทดลอง.
2. V2 `outputs/srs-inline-v2.docx`: 1,078,500 bytes, SHA256
   `e91797dec4fafc29d8ac90fc53d5ada58acc640c093d1d3bf322b25bb5f77223`.
   เปลี่ยน body images เป็น inline พร้อม minimum line height เพื่อทดสอบสมมติฐาน
   เรื่อง image anchors; source contain ratio คงเดิม แต่ Word baseline อาจเพิ่ม
   frame/row height. PAGE/NUMPAGES result runs แก้ให้ระบุ Sarabun 9pt ชัดเจนทั้ง
   font slots และ complex-script size; static audit ยืนยันครบ 36 fields.
   Band canvases ยังเป็น floating tables. Word เปิดได้ แต่ PDF export ค้างซ้ำ
   เกินสองนาทีและไม่มี PDF สำเร็จ. เจ้าของช่วยปิดรอบสอง;
   **ยังไม่พิสูจน์ root cause และห้ามสรุปว่า inline images แก้ Word hang ได้**.

การแปลงนี้รองรับ actual node/property set ของ SRS นี้ ไม่ใช่ full generic writer.
Table group keep-start ใช้ Word paragraph keep rules ซึ่งไม่ใช่ Core measured
fragment algorithm. Fixed blocks ที่พบเป็นเพียง empty cover spacers สองจุด;
ไม่มี nonempty fixed-frame, row spans, per-fragment group labels หรือ selective
excluded-page policy ใน SRS นี้ จึงไม่เพิ่ม coverage ของช่องว่างเหล่านั้น.
Band sizing วัดจาก source recipe และยังไม่ใช่ arbitrary Word-wrap solver.
Unknown types/properties/resources ที่ตัวทดลองตรวจพบต้อง fail แทนการข้าม.

Failed-attempt provenance คงไว้ใน receipts/logs: package metadata import ครั้งแรก
ชน package exports; subsequent diagnostic output rename ชนไฟล์ที่ Word ยังล็อก.
แก้เฉพาะ disposable scripts/output naming. Initial paired PDF elided fully opaque
alpha planes จึงต่างเพียง image-edge raster pixels; independent audit ยืนยัน alpha
ทั้งหมดเป็น 255 แล้ว rerender โดยคง SMask ได้ exact all-page parity ตามตาราง.
ไม่ได้แก้ต้นทางเพื่อให้ comparison ผ่าน.

Generation child เป็น owned process, 512-MiB sampled working-set cap,
1,536-MiB host floor / 90-second deadline; successful V2 generation exit 0/reaped,
sampled working set 323 MiB, pack ประมาณ 671 ms. เป็นหนึ่งการสังเกตของ full SRS;
ไม่ใช่ production capacity, Word memory bound, concurrency หรือ peak-memory proof.
Disposable containers network none / 1 CPU; image prep cap 256 MiB,
paired PDF cap 768 MiB; ลบ containers หลังจบ.

### Checkpoint decision

**FAIL Word/layout acceptance; input reuse and static mapping PASS within this SRS.**
ไม่ควร promote DOCX เหล่านี้เป็นเอกสารพร้อมส่งหรือเอา writer เข้าระบบจริง.
Next recommended work คือ bounded Word-layout diagnosis โดยแยก band canvases,
TOC refresh และ table pagination ทีละปัจจัย พร้อม reproducer และเกณฑ์หยุด;
ยังไม่ถือว่าส่วนใดเป็นสาเหตุจนมีผลทดลองแยกยืนยัน.
เมื่อ Word จัดหน้า/export สำเร็จ จึงตรวจภาพทุกหน้าและเทียบ source ก่อนตัดสิน
near-PDF acceptance. ไม่เพิ่มหลักฐานซ้ำของ PDF/input ที่ผ่านและไม่เปลี่ยน SRS structure.

Core/Service working trees clean และ source heads คงเดิม:
`8f8a739aea5597b6d8c9932c790f9bd716e8ebc7` /
`ca66f605b02a41d1bc3b05894fbc75f5224d4900`.
ไม่มี production Evidence/map updates. ตรวจแผนด้วย diff/whitespace,
local links/anchors และ `npm run check:data`; canonical data ไม่เปลี่ยน
จึงไม่ regenerate projections. เก็บ two candidates เป็น diagnostics เท่านั้น.

## Word diagnosis pause checkpoint

วันที่ 2026-10-21 เจ้าของอนุญาตให้แยกหัวหน้า ท้ายหน้า สารบัญ และการแบ่งตาราง
โดยใช้ SRS เดิมในพื้นที่ทดลองเท่านั้น แล้วสั่ง **หยุดการทดลองไว้ก่อน** ระหว่าง
กรณี `d-footer-only`. สถานะปัจจุบันคือ owner-paused; ไม่ใช่ completed/cancelled
และไม่เปิด registered execution เก่ากลับมา. IDs N/A ตาม single-room scope.
Owner/role/boundary เดิมคงอยู่; หลักฐานรอบนี้อยู่ใน experiment root เดิมใต้
`diagnosis/`. ไม่มี product/template/DB/API/runtime mutation.

การแยกปัจจัยใช้ ZIP derivatives ของ exact V2 SHA256 `e91797dec4fafc29d8ac90fc53d5ada58acc640c093d1d3bf322b25bb5f77223`.
ตรวจอิสระว่าคง body XML, margins, source text, 200 tables / 933 rows / 1,932 cells,
371 body images, media bytes, headings/bookmarks และ 7 sections ตามที่แต่ละ
factor ประกาศ. การปิด band stories เป็น diagnostic omission ที่ตั้งใจไว้;
ไม่ใช่เอกสารพร้อมส่ง. Proof scope คือ diagnosis เท่านั้น ไม่ใช่ production fix.

| Actual Word case | ผลที่วัดได้ | ความหมายที่ยืนยันได้ |
| --- | --- | --- |
| D00: ไม่มี band stories และล็อก outer TOC | PDF 99 pages / 923,215 bytes; write end 13,406 ms หลังคลิก export | เป็น positive control; outer lock ยังเหลือ 198 nested PAGEREF fields จึงไม่ใช่ fully static TOC |
| D01: ไม่มี band stories, native TOC active และ update entire table | PDF 99 pages / 969,611 bytes; write end 13,285 ms หลังคลิก export | การอัปเดตสารบัญและ original body-table pagination ทำงานได้ในกรณีนี้; นอก TOC pages 4–9 ข้อความ/geometry/image counts ตรง D00 ครบ 93 pages |
| Header only: คืนเฉพาะหัวหน้า, body/TOC เดิม | Word แจ้งทันทีว่า “การส่งออกล้มเหลว ไม่สามารถเตรียมเอกสารดังกล่าวเพื่อส่งออกได้”; ไม่มี completed PDF | Header mapping family ทำให้เกิด explicit export error ในการทดลองนี้; ยังไม่ยืนยันว่า nested image anchor หรือ floating canvas เป็นกลไกที่ผิด |
| Footer only: คืนเฉพาะท้ายหน้า, body/TOC เดิม | ไม่มี completed PDF ภายใน 300 seconds; Word ไม่ตอบสนอง, Escape request timeout; เจ้าของสั่งหยุด | เป็น bounded timeout ไม่ใช่ proof ของ infinite loop; ยังไม่ได้ทดสอบ footer-flow correction ใน Word |

D00 image audit: 371 placements ตรง asset identity/order/counts และ contained
dimensions; decoded RGB ของ 12 body variants ตรง prepared bytes.
แถวยาว REQ0041 (source lower bound 1,470.32 pt, allowBreak=true) แบ่งข้าม
Word pages 50–53 ได้ โดยตรวจภาพครบทั้ง 4 fragments เห็นท้ายข้อความ/icon และ
REQ0042 ถัดไป ไม่พบ clipping/overlap ที่จุดนี้. ไม่ได้ตรวจภาพทุกหน้าของเอกสาร.
Thai SARA AM บางตำแหน่งแสดงถูกในภาพแต่ PDF extraction ทำเครื่องหมายหาย;
เก็บ strict mismatches และแยก lossy text corroboration ไว้ ไม่เรียกเป็น glyph PASS.

ข้อสังเกตทางเทคนิค: V2 มี floating band canvases 36 ตัว และ header picture
anchors 18 ตัว; header-only จึงยังมีวัตถุลอยซ้อนกัน. Microsoft ระบุว่า floating
tables ใน footer สามารถมีผลต่อการแบ่ง body-table rows ได้
([OOXML reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.donotbreakconstrainedforcedtable?view=openxml-3.0.1)).
นี่เป็น supporting hypothesis ไม่ใช่คำยืนยันสาเหตุภายใน Word.
ไม่พบ obvious malformed ZIP/relationships/IDs หรือ table-grid defect จาก
targeted structural screen; ไม่อ้างว่า full XSD validation ผ่าน.

เตรียม single-factor corrections ไว้แล้ว แต่ **ยังไม่เปิดใน Word**:
`d-header-only-inline.docx`, `d-full-header-inline.docx` เปลี่ยนเฉพาะ
18 header pictures จาก anchor เป็น inline; และ `d-footer-only-flow.docx`,
`d-full-inline-header-flow-footer.docx` เอาออกเฉพาะ outer footer `tblpPr` 18 จุด
จากฐานที่ระบุ. ตรวจอิสระว่าการเปลี่ยนตรง factor และส่วนอื่นไม่เปลี่ยน;
inline baseline/centering และ native footer-flow position เป็น geometry deviations
ที่ยังต้องตรวจ. `d10-all-bands-locked-toc.docx` และ `d-footer-flow.docx`
ที่เตรียมไว้ก็ยังไม่ได้รัน Word เช่นกัน. ไม่เปลี่ยน candidate ที่เคยวัดแล้ว.

Locators: `diagnosis/evidence/variant-manifest.json`, `independent-variant-audit.json`,
`header-inline-manifest.json`, `footer-flow-manifest.json`, `independent-*-audit.json`,
`d00-completion.json`, `d01-completion.json`, `d-header-word-error.json`,
`d-footer-completion.json` และ `checkpoint-paused.json`.
D00 completion monitor ที่เรียกย้อนหลังครั้งแรกตรวจ deadline ก่อน existing file
จึงให้ผลผิด; เก็บเป็น `d00-monitor-late-call-error.json` แล้วแก้ monitor และใช้
validated PDF/file write time ในผลด้านบน. ไม่ใช้ false timeout นั้นเป็น Word result.

จุดกลับมาต่อ: ตรวจว่า task-owned Word `d-footer-only` ปิดแล้วก่อนเริ่มใหม่;
ขณะหยุดยังไม่มีหลักฐาน cleanup และไม่สั่ง UI เพิ่มหลังเจ้าของสั่งหยุด.
จากนั้นใช้ Word process ใหม่ ทดสอบ header-inline / footer-flow ทีละปัจจัย
แล้วจึงยืนยัน combined candidate หากทั้งคู่ผ่าน. รักษา source เดิมและผลก่อนหน้า;
ไม่สรุปว่าตัวแก้ได้ผลก่อนวัดจริง ไม่เริ่ม production integration.
การไม่ตอบสนองชั่วคราวอย่างเดียวไม่เพียงพอให้สรุปว่าค้างไม่จบ: D00/D01
กลับมาส่งออกสำเร็จ จึงใช้ explicit error/ครบกรอบเวลา/validated output แยกผล.

## Owner manual Word export checkpoint

วันที่ 2026-10-21 เจ้าของเปิด `outputs/srs-inline-v2.docx` แล้วช่วยแปลงเป็น
`outputs/srs-inline-v2.pdf` ด้วย Word สำเร็จ. ตรวจไฟล์ที่มีอยู่แบบ read-only;
ไม่ได้เริ่ม Word automation หรือ corrective-candidate experiments กลับมา.
Role: Evidence Reviewer / Documentation Synthesizer; single-room IDs N/A.
เอกสารแผนนี้ยังเป็น Project Control canonical checkpoint ไม่ใช่ production Evidence.

DOCX ที่เจ้าของเปิดยังมี SHA256 เดิม
`e91797dec4fafc29d8ac90fc53d5ada58acc640c093d1d3bf322b25bb5f77223`
/ 1,078,500 bytes. อ่าน hash ด้วย Python ได้ขณะ Word เปิดอยู่; PowerShell
`Get-FileHash` ครั้งแรกถูก file sharing lock ปฏิเสธ จึงไม่ใช้เป็นผล corruption.
PDF ใหม่มี 99 pages / 1,005,937 bytes, SHA256
`c461b314bb449da1f86fdfd2a9ba8c4d38daae498ac70a354dcd4dc8bbdea29c`;
metadata ระบุ Microsoft Word for Microsoft 365, creation time
2026-10-21 01:20:37 +07:00. ไม่ได้จับเวลาหรือสังเกตขั้นตอน manual export โดยตรง.

ผลนี้ยืนยันว่า full SRS V2 ส่งออกผ่าน Word ได้ในการใช้งานของเจ้าของ.
เก็บ prior explicit header error และ bounded footer/V2 timeouts ตามเดิม;
ไม่ขยายเป็นข้อสรุปว่าไฟล์เต็มส่งออกไม่ได้เสมอ หรือ bands เป็นสาเหตุแน่นอน.
ความต่างระหว่าง manual session กับ automation ยัง unknown; การวินิจฉัยที่พักไว้
และ corrective candidates ยังไม่มีผลใหม่จาก Word.

| Read-only check | Result and limit |
| --- | --- |
| File and visual coverage | PDF เปิดอ่านได้ครบ 99 pages; render 96 dpi แล้ว review ทุกหน้า แบ่งช่วง 1–33 / 34–66 / 67–99 และ zoom จุดสงสัย. ไม่พบ visible clipping, body/header/footer overlap, blank-page anomaly หรือ obvious broken glyph ในการตรวจนี้; ไม่ใช่ per-glyph หรือ pixel-parity proof |
| Body text against D01 | หลังตัด exact source-defined band prefixes ข้อความ normalized ของ 93 non-TOC pages ตรง D01 ทุกหน้า. TOC pages 4–9 ต่างที่ leader dots และบาง Thai extraction. Strict source-string probes ยังเหลือ 134 absent candidates เทียบ D01 139; newly absent 0. เก็บผลไว้ ไม่แสดงเป็น strict text PASS. Explicitly lossy Thai/source corroboration พบ absent 0/1,160 distinct non-contents strings; ไม่พิสูจน์ ordered instances/multiplicity หรือความถูกต้องของทุก glyph |
| Images | 469 painted occurrences = 371 body placements + 98 identical header banners บน pages 2–99. Body images ตรง D01 ทุก page/order/dimensions/decoded-image hash/soft-mask hash; 12 distinct body variants. เป็น image data/sequence proof ร่วมกับ visual review ไม่ใช่ complete source-layout parity |
| TOC and page fields | Internal links resolve 198/198; printed page numbers ตรง link destinations 198/198 และ destinations ตรง D01. Source headings พบที่ปลายทาง 198/198 ด้วย explicitly lossy Thai normalization. Pypdf TOC labels ตรง strict 194/198 และ lossy 198/198. Page fields เป็น 2/99 ถึง 99/99; cover ไม่มีเลขแสดง ตาม source policy |

พบ mapping defect ที่ต้องเก็บไว้ก่อน near-PDF acceptance:
Word pages 18–26 ใช้ repeated meeting-table header ของ “ครั้งที่ 1” ข้ามไปยัง
การประชุมครั้งถัด ๆ ไป. ตัวอย่าง Word page 18 ขึ้น header ครั้งที่ 1 ก่อนเนื้อหา
ครั้งที่ 2/3 ขณะที่ Core reference page 18 ใช้ header ครั้งที่ 2; Word page 19
ยังขึ้นครั้งที่ 1 ขณะที่ Core reference page 19 ใช้ครั้งที่ 3.
Frozen DOCX มี meeting tables แยกกัน 15 ตารางพร้อม first-row repeat flags
และ title ของแต่ละครั้ง; source เดิมข้ามครั้งที่ 11 อยู่แล้ว จึงไม่รายงานเป็น
เนื้อหาที่ DOCX ทำหาย. มี adjacent-table runs 3 ชุด / 26 pairs รวม approval,
legend และ meetings; Word table coalescence เป็น supporting hypothesis
ที่ยังไม่ได้พิสูจน์ด้วย corrective experiment.

Pagination polish ที่มองเห็น: หัวข้อแยกจากตาราง/เนื้อหาไปหน้าถัดไปที่ท้าย
pages 28, 33, 35–44, 74 และ 83. Icon-only continuation rows ที่ pages
46, 49, 50, 54, 55, 59, 64, 80 และ 89. ไม่พบว่าข้อมูลตรงจุดเหล่านี้หาย;
ยังไม่ได้จัดประเภททุกกรณีว่าเป็น regression จาก Core หรือความต่างที่เจ้าของยอมรับ.
99 pages เทียบ Core 98 pages ไม่ใช่ failure เพียงเพราะจำนวนหน้าต่างกัน.

Locators ใต้ experiment root เดิม: `user-pdf-review/review.json`,
`user-pdf-review/renders/`, `user-pdf-review/sheets/`,
`user-pdf-review/visual-b/review-pages-34-66.json` และ
`user-pdf-review/semantic-agent/` สำหรับ text/image/TOC และ
`table-adjacency-and-meeting-headers.json`.

Checkpoint: **PASS owner manual full-SRS Word export; near-PDF acceptance
ยังมี wrong repeated-table-header defect และ pagination findings; ไม่ใช่
production readiness.** ไม่ลดเนื้อหา/รูป ไม่แก้ source template, Core, Service,
API, DB หรือ installed runtime และไม่ทดสอบ corrective candidates เพิ่มในรอบนี้.
การแก้ prototype หรือเริ่มระบบจริงต้องยึด scope ที่เจ้าของอนุญาตต่อไป.

## DOCX-first alignment and wrap tuning

เจ้าของยืนยันวันที่ 2026-10-21 ให้ใช้ PDF ปัจจุบันเป็น reference แล้วแก้ DOCX
ก่อน โดยเน้นแนวชิดซ้าย/ขวา ตำแหน่งตาราง ระยะ และ wrap. พิจารณาจูน PDF
ร่วมกันเฉพาะเมื่อมีหลักฐานว่าติดข้อจำกัดจริงของ DOCX/Word; รอบนี้ไม่แก้ PDF.
ความหน่วงที่พบตอน Word แปลง PDF แยกเป็น observation ของขั้นตอนตรวจ:
ยังไม่ตัดสินว่าเป็น product DOCX stability failure หรือบั๊กของ Core/Service.
ผู้ใช้แจ้งว่า manual export ก็หน่วงเกือบค้าง จึงไม่อธิบายด้วย automation เพียงอย่างเดียว.
หากต้องใช้ manual conversion ให้บอกเจ้าของตรง ๆ พร้อมไฟล์ที่พร้อมตรวจ.

Scope: bounded inline prototype tuning; owner Project Control สำหรับ checkpoint,
Core สำหรับ future writer semantics; role Planning Partner / Evidence Reviewer;
Work/Phase/Checklist/execution IDs N/A. ใช้ experiment root เดิม ไม่เปิด registered
execution หรือ product lane. Allowed: `tuning-v3/`, fresh experimental DOCX,
เอกสารแผนนี้. Frozen inputs/PDFs/V2, product repositories/API/template/DB/runtime
อยู่นอก mutation scope. Proof budget: one full-SRS V3 candidate, package preservation
checks, independent package audit และ Word re-export เมื่อเจ้าของช่วยแปลง;
ไม่เริ่มชุด header/footer/performance experiments เก่ากลับมา.

Read-only spot comparison pages 2, 3, 10, 11 และ 27 อยู่ใน
`user-pdf-review/alignment-wrap/`. ตัวอย่าง first intro paragraph หน้า 11:
Core 4 lines, Word 5 lines ทั้งที่ขอบซ้าย 28.35 / 28.32 pt ใกล้กัน.
First source text run มี 391 characters, ordinary spaces 9 จุด ไม่มี internal
line break/ZWSP/joiner; Word line 1/2 ตรง space-delimited chunks.
พบ `w:lang val=th-TH` จริง จึงแก้ข้อสงสัยก่อนหน้าว่า language ถูก ignore:
ช่องที่ยังขาดคือ complex-script language (`w:bidi`). การเพิ่มช่องนี้ยังเป็น
hypothesis ต่อ Thai wrap ไม่ใช่ผล Word ที่ยืนยันแล้ว.

Table mapper เพิ่ม `tblInd` เท่ากับ source first-cell padding ทั้งที่ padding
อยู่ใน `tcMar` แล้ว. ตัวอย่าง cover: Version x ของ Core 191.532 pt เทียบ
Word 320.95 pt; offset 129.418 pt สอดคล้อง explicit indent 129.15 pt.
Page 27 เมื่อเทียบ vertical-border centers แบบเดียวกัน offset +5.25 pt
สอดคล้อง indent 5 pt. Center-to-center table width จริง 538.5 / 538.56002 pt;
ไม่ใช้ความต่าง 0.42 pt จากการเทียบ horizontal stroke/rectangle คนละรูปแบบ
เป็นเหตุเพิ่มความกว้างตาราง. ยังต้องวัด candidate ใน Word ก่อนปรับเศษระยะ.

V3 `outputs/srs-tuned-v3.docx`, 1,078,002 bytes, SHA256
`cf656c2b6fb6998b633dd02d6b79d571b69a5dcc65d7042769798bd70f622526`:

1. Body table indents เป็น 0 ตาม flow origin ทั้ง 200 tables;
   เปลี่ยนจริง 189 จุด อีก 11 จุดเดิมเป็น 0. คง widths/grids/padding/borders เดิม.
2. เพิ่ม `w:bidi=th-TH` ใน existing Thai language elements 6,010 จุด;
   API equivalent คือ `language:{value:'th-TH',bidirectional:'th-TH'}` ใน
   `docx@9.13.0`. ไม่ใช่ RTL direction และไม่เพิ่ม CJK rules/forced line breaks.

สร้างเป็น lossless ZIP derivative ของ frozen V2 เพื่อให้วัดเฉพาะ mapping changes;
receipt ระบุ source adapter fixes สำหรับการนำไปใช้กับ writer ภายหลัง.
ไม่เปลี่ยนข้อความ ลำดับ run/breaks รูป ฟอนต์ styles เดิม (นอก language metadata),
TOC/bookmarks/fields, sections/margins, table rows/cells หรือ asset bytes.
Static regression check FAIL บน V2 แล้ว PASS บน V3; canonical XML comparison
อนุญาตเฉพาะสอง changes ข้างต้น. Body counts คง 200 tables / 933 rows /
1,932 cells; nonchanged ZIP members คง byte-identical.

Wrong meeting-header repetition ยังไม่แก้ใน V3 นี้. ตรวจเพิ่มพบ adjacent body
tables 26 boundaries; Microsoft OOXML ระบุว่าตารางติดกันที่ใช้ style เดียวกัน
และไม่มี paragraph คั่นถือเป็น table เดียว
([Table reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.table?view=openxml-2.20.0)).
ทางแก้ถัดไปคือ empty structural separator ระหว่าง logical tables โดยต้องตรวจ
pagination ใหม่. Approval/legend `tblHeader val=off` คือ disabled;
15 meeting tables เท่านั้นที่เปิด repeat first row ในกลุ่มนี้. ไม่ใช้แค่ tag presence นับ enabled.

Locators: `tuning-v3/scripts/make_candidate.py`, `check_candidate.py`,
`tuning-v3/evidence/{red-baseline,green-candidate,generation}.json`,
`tuning-v3/table-diagnosis/` และ `tuning-v3/wrap-diagnosis/`.
Packaged `render_docx.py` ลองแล้วไม่มี `soffice.exe` บน PATH;
เก็บ log ใน `tuning-v3/evidence/packaged-render.log`. ไม่ติดตั้ง renderer เพิ่ม.
ขอเจ้าของเปิด V3 ใน Word และบันทึก `srs-tuned-v3.pdf` ในโฟลเดอร์เดียวกันแล้ว.
**Word alignment/wrap verification pending**; ไม่ส่งเป็น final-ready DOCX และ
ไม่ claim ว่า wrap ดีขึ้นจาก package PASS เพียงอย่างเดียว.

### V3 owner Word verification result

เจ้าของช่วยแปลง V3 แล้ววันที่ 2026-10-21. `outputs/srs-tuned-v3.pdf`
มี 99 pages / 1,001,269 bytes, SHA256
`118ffee934290fd96e7e6ad600bdd05fd4a771037b2522d38ef8847b9d599dfb`;
Word metadata creation time 08:31:12 +07:00. V3 DOCX ยังตรง hash เดิม
`cf656c2b6fb6998b633dd02d6b79d571b69a5dcc65d7042769798bd70f622526`.
ตรวจแบบ read-only; ไม่มี Word automation หรือ candidate repair ระหว่าง verification.

| Targeted measurement, pt | Core PDF | Word V2 | Word V3 | Result |
| --- | ---: | ---: | ---: | --- |
| Cover Version left | 191.532205 | 320.950000 | 191.810000 | Large offset removed; residual +0.277795 |
| Cover value 3.0 left | 308.125984 | 437.860000 | 308.690000 | Large offset removed; residual +0.564016 |
| Page 3 left/right border centers | 28.350000 / 566.925591 | 32.880000 / 571.439990 | 28.560000 / 567.239990 | Residual +0.210000 / +0.314399 |
| Page 27 left/right border centers | 28.350000 / 566.850000 | 33.600000 / 572.160020 | 28.560000 / 567.239990 | Residual +0.210000 / +0.389990 |
| Page 11 first intro paragraph | 4 lines | 5 lines | 5 lines | V3 line texts and coordinates exact V2; language hypothesis did not improve wrap |

เทียบ vertical-border centers ชนิดเดียวกัน: V3 page 27 center span 538.679990 pt
เทียบ Core 538.500000 pt; ยังต่าง +0.179990 pt แม้ declared grids/widths ไม่เปลี่ยน.
ไม่เพิ่ม arbitrary width correction. Page 3 cell left insets คงประมาณ 4.32 pt
เทียบ Core 4.25 pt; page 27 Features List center offset ภายใน cell +0.024805 pt.
ตำแหน่งชิดซ้าย/กลางในตัวอย่างดีขึ้นพร้อม padding เดิม; ไม่มี right-aligned paragraph
ในตารางที่สุ่มวัด จึงไม่ขยายเป็น right-alignment PASS ทั้งระบบ.
ความต่างแนวตั้งยังอยู่: cover Version ต่ำกว่า Core +1.741280 pt, page 3 table
bottom 231.500000 เทียบ Core 229.150841 pt; page 27 row heights ประมาณ
28.32 เทียบ Core 27.84 pt. ขนาด glyph ที่ PDF ระบุ Word 11.04 เทียบ Core 11 pt.

All-page data check เทียบ V2: raw pypdf text ตรง 99/99 pages, media boxes ตรง
99/99, painted image identities/order ตรงทุกหน้า 469 occurrences = 371 body
+ 98 header. TOC links resolve และ printed page ตรง destination 198/198;
rectangles/destinations ตรง V2. Page fields แสดงครบ 98 non-cover pages.
ผลเหล่านี้เป็น preservation checks เทียบ V2 ไม่ใช่ strict source/glyph parity.
Render V3 ครบ 99 pages ที่ 96 dpi; visual comparison รอบนี้ตรวจเฉพาะ pages
1, 2, 3, 10, 11 และ 27 ไม่อ้าง full all-page visual acceptance รอบใหม่.

**PARTIAL: table-position hypothesis supported; complex-script language alone
does not fix Thai wrap.** Page 10 legend wrap ก็ยังตรง V2. ไม่มีหลักฐานว่าถึง
ข้อจำกัดจริงที่จำเป็นต้องแก้ PDF แล้ว. Next diagnosis ควรแยก Thai word-boundary
behavior และแนวตั้ง/line metrics ฝั่ง DOCX; ไม่เดา RTL/CJK flags หรือเติม forced
line breaks เพื่อให้ภาพตัวอย่างดูผ่าน. Wrong repeated meeting header ยังเป็น
known defect ตาม scope เดิม. ไม่สร้าง V4 หรือแก้ PDF/product ใน verification รอบนี้.

Locators ใต้ `tuning-v3/word-review/`: `review.json`, `renders/`,
`comparisons/compare-*.jpg`, `geometry-agent/geometry-review.json` และ
`content-agent/comparison.json`. สถานะนี้แก้ pending เฉพาะการตรวจ V3;
ไม่ได้ promote generic DOCX readiness หรือปิดงานจูนทั้งหมด.

## V4 Thai wrapping and table-height experiments

เจ้าของอนุญาตวันที่ 2026-10-21 ให้ตรวจ native Word paragraph ก่อน แล้วแยก
ทดลอง Thai word boundaries และความสูงแถวด้วย SRS เดิมในพื้นที่ทดลอง.
เป็น bounded inline discovery/prototype ต่อจาก checkpoint เดิม; owner Project
Control สำหรับบันทึกนี้, Core สำหรับ future writer semantics; role Evidence
Reviewer / Planning Partner / Documentation Synthesizer; execution IDs N/A.
Allowed: `tuning-v4/`, fresh experimental DOCX และแผนนี้. ไม่แก้ reference PDF,
frozen resolved input, template/data, Core/Service/API/plugin/DB/runtime.
Proof budget: native paragraph control หนึ่งชุดพร้อม font-confound correction,
full-SRS wrap-only และ height-only อย่างละหนึ่งไฟล์, package checks และ
targeted Word PDF review พร้อม preservation checks. Document budget: แผนเดิม
หนึ่งไฟล์; JSON/scripts/images ใต้ experiment root เป็น supporting diagnostics.
ไม่รวมสอง changes เป็น candidate ใหม่ และไม่เริ่มระบบจริง.

### Native Word paragraph control

พิมพ์ first intro paragraph จาก source ลง blank Word โดยตรง: 391 characters,
SHA256 `78a39a63bc3ba663ea8e0030d3929f73658b5e0ec7dae19c7ebb75bd7da11a89`,
ไม่มี forced break หรือ U+200B; A4, margins 567 twips, Sarabun 11 pt,
exact line 397 twips, after 0 และ snap-to-grid off. Word แจ้งว่า Sarabun ไม่ได้
ติดตั้งในเครื่อง และแทน Thai run เป็น Angsana New ในการพิมพ์ครั้งแรก;
ไม่ใช้ผลนั้นเปรียบเทียบกับ SRS ที่ฝังฟอนต์.

แก้เฉพาะ control โดยนำ embedded Sarabun variants/font keys เดิมจาก V3
มาใส่ใน font carrier แล้วเปิดใหม่และเลือก Sarabun ให้ Thai run ผ่าน Word.
ขั้น font-carrier ไม่แตะ native document/styles/settings/text; เป็น control
ที่เขียนด้วย Word และควบคุมฟอนต์ ไม่ใช่ pristine untouched Word package.
ไม่ได้ติดตั้งฟอนต์หรือเปลี่ยน OS configuration. หลัง Word บันทึกตรวจ source
text ยังตรงทั้ง 391 characters และ Sarabun outlines/metrics/shaping tables
12 SFNT tables ตรง V3 byte-for-byte; ต่างเฉพาะ head/name หลัง Word save.
PDF font name ภายในเป็น Sarabun-Regular ทั้งคู่; export ระบุ 11.04 pt เท่ากัน.

| First intro source break ends, exclusive UTF-16 offsets | Result |
| --- | --- |
| Core reference | 103, 210, 312, 391: 4 lines |
| V3 generated DOCX in Word | 50, 145, 210, 300, 391: 5 lines |
| Native Word control with same Sarabun | 103, 210, 312, 391: 4 lines |

Break offsets ผูก PDF extraction กลับไปยัง exact source ด้วย normalization
เพื่อการวัด ไม่ใช่ raw PDF text/source equality. Control เป็น standalone paragraph;
ข้อความเดียวกันใน V3 เป็นช่วงแรกของ paragraph ยาวที่มี BR คั่นส่วนถัดไป.
Paragraph structure และ font-table metadata จึงเป็นปัจจัยต่างที่ต้องเก็บร่วมกับ
run/settings differences ไม่สรุปว่ามีเพียง flags ที่เป็นไปได้.

ตรวจ rendered paragraph แล้วไม่พบ missing-glyph boxes/visible clipping.
ผลนี้ยืนยันว่า Word session นี้ตัดย่อหน้าเดิมใกล้ Core ได้โดยไม่ต้องแทรก
จุดตัดคำในข้อความ; ยังไม่ชี้ว่า property ใดเป็นสาเหตุ. Native run มี `w:cs`
ขณะที่ V3 document/styles ไม่มี explicit `w:cs`; compatibility settings,
grid และ defaults ก็ยังต่างกัน. `w:cs` เลือก complex-script formatting;
`useFELayout` เกี่ยวกับ complex-script layout ตาม
[Microsoft reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.compatibility.usefareastlayout?view=openxml-3.0.1).
ยังไม่เพิ่ม flags เหล่านี้ใน SRS หรืออ้างว่าเป็น root cause โดยไม่มี isolated test.

Native control final DOCX ใต้ `tuning-v4/native-control/` มี SHA256
`d47d80f8357254a5c8adb7db26f20c9406c38f53b874ee63388871f101dec7c4`;
one-page Word PDF SHA256
`7f7d83bd2954c71b4a40a61eba38b8782587d06276427dcc6f0656d94543fccd`.
Locators: `native-control/native-word-comparison.json`, font-carrier receipt,
`native-paragraph-detail.png` และ `after-word-identities.json` ใต้ `tuning-v4/`.

### Wrap-only candidate

ใช้ exact Core native binary จาก commit
`8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`, ICU4X 2.2.0,
`LineSegmenter::new_auto(Default::default()).segment_str` ผ่าน Ubuntu WSL.
Binary SHA256 `55347fc74ffe268bc37eecd71ae09f5dd9e4993e53a52615b00120eb98e59bb9`;
ไม่ใช้ word segmenter ตัวอื่นแทน และไม่ build/install/start Docker.
Manifest ผูกตำแหน่ง OOXML กับ exact text/hash และ source candidates;
repeated source strings ที่คลุมเครือ 402 จุดถูกระบุ ไม่อ้าง unique source mapping.

`outputs/srs-wrap-v4.docx`, SHA256
`1a9e08de7ee4b806e675c0fbc3baca70bf9772973eecd38ea5e831a24b8cf0c9`:
เพิ่มเฉพาะ U+200B 6,034 จุดใน 1,206 text nodes ตาม internal Thai boundaries
จาก Core. Exclude fields/TOC/textboxes/deleted content. ไม่เพิ่ม forced breaks,
ไม่เปลี่ยน font/style/table/band/margin. การลบเฉพาะ inserted bytes ที่บันทึก
ใน receipt คืน raw XML เดิมได้ตรง byte-for-byte; actual text ใน DOCX มี
invisible characters เพิ่ม จึงไม่เรียกว่า raw text unchanged และยังต้องตรวจ
search/copy/caret effects ก่อนพิจารณาใช้วิธีนี้.

เจ้าของแปลงเป็น Word PDF แล้ว: 100 pages / 1,212,164 bytes, SHA256
`4574f434281cbeb8cf0c993ddb90c4abf4b2fafb4eca2dd5b0e9633ebf6cf4fb`.
**FAIL visible Thai glyphs:** first intro paragraph และ heading มี missing-glyph
boxes จำนวนมากใน rendered PDF. ย่อหน้าแรกยังเป็น 5 lines; ไม่ถือว่า wrap
ผ่านจากจำนวนหน้า/ตัวอักษรใน package. นี่เป็นผลเสียของ candidate/export รอบนี้;
ยังไม่พิสูจน์ว่า Word ไม่รองรับ U+200B โดยทั่วไปหรือแยก font/shaping mechanism ได้.
เก็บ failed artifact ตามเดิม ไม่ใช้เป็น production candidate และไม่แก้ PDF.
ตรวจภาพ pages 10, 11 และ 27 พบอาการเดียวกัน. Body images คง 371 placements
ครบ decoded data และลำดับ; painted total 470 = 371 body + 99 header banners.
TOC links resolve และ printed page ตรง destinations 198/198; cover ซ่อนเลข
และ pages 2–100 แสดง physical page ถูกต้อง. Text/glyph preservation **FAIL**;
ไม่เพิ่ม strict source probes เพื่อทำให้ผลที่เห็นล้มเหลวดูเป็น PASS.
Locators: `wrap/{manifest,core-boundaries,generation,green-candidate}.json`,
`audit/independent-package-audit.json`, `word-review/wrap/comparison.json`
และ `word-review/wrap/intro-detail.png`.

### Height-only candidate

`outputs/srs-height-v4.docx`, SHA256
`bafe549ac45b2ac57df8eccd47dbd0cb65237c964456b1c53c3f37b9489bf33a`:
เปลี่ยนเฉพาะ border value `single` เป็น `nil` 42 attributes ในตาราง metadata
บนปก 3 rows / 9 cells: 6 table edges และ 36 cell edges. Source ใช้ vertical
padding 0, line 17 pt และ white borders. คง text/fonts/widths/padding/spacing
เดิมทั้งหมด; ไม่ใช้ exact row height และไม่ลบ authored white borders ทั่ว SRS.
เจ้าของแปลงเป็น `outputs/srs-height-v4.pdf`, 99 pages / 1,002,897 bytes, SHA256
`c8111bf66deccf28bfa014f975ae5da8abce9e2220e9a2414a9dcedcfb196563`.

| Cover measurement, pt | Core | V3 | Height V4 |
| --- | ---: | ---: | ---: |
| Version left | 191.532205 | 191.81 | 191.57 |
| Value 3.0 left | 308.125984 | 308.69 | 308.21 |
| Version text top | 444.650000 | 446.391280 | 445.911280 |
| Author text top | 461.650000 | 463.911280 | 462.831280 |
| Updated text top | 478.595000 | 481.431280 | 479.871280 |
| Successive text-top advances | 17.000 / 16.945 | 17.52 / 17.52 | 16.92 / 17.04 |

**PASS narrow cover-border contribution hypothesis:** เปลี่ยน border อย่างเดียว
ทำให้ row text advances ลด 0.48–0.60 pt และตำแหน่งชิด Core ขึ้น. Text-top
advances รวม glyph/export quantization จึงไม่ประกาศ exact row height 17.04
ทุกแถว. Later cover content ขยับขึ้นสูงสุด 2.04 pt; ยังมี residual vertical offset
และ glyph metrics difference. ไม่หัก line height 0.5 pt ทั้งเอกสาร และไม่ขยาย
ผลนี้เป็นคำสั่งลบ authored white borders ทั่ว SRS.

Preservation เทียบ V3: raw pypdf text ตรง 99/99 pages, media boxes ตรงทุกหน้า,
469 painted images คง decoded data/soft mask/page/order, TOC destinations
และ rectangles ตรง 198/198, cover hidden และ page fields 2–99 ถูกต้อง.
Body geometry 12 pages ยังมี Latin horizontal deltas สูงสุด 0.09624 pt;
body Y และ font sizes ตรงเดิม จึงไม่อ้าง all-body geometry identical.
Visual review เฉพาะ cover, intro crop page 11 และ feature tables page 27:
ไม่พบ glyph boxes/obvious clipping ในจุดที่ตรวจ; intro ยัง 5 lines เท่า V3.
ไม่ใช่ all-99-page visual หรือ strict source-glyph acceptance.
Locator: `word-review/height/height-review.json` และภาพในโฟลเดอร์เดียวกัน.

Static regression checks FAIL บน V3 แล้ว PASS บน candidate ที่ถูกชนิด;
independent audit ยืนยันแต่ละไฟล์เปลี่ยนเฉพาะ `word/document.xml`, อีก 124 ZIP
payloads และ compressed records ตรง V3. คง 200 tables / 933 rows / 1,932 cells /
371 body drawings / 198 hyperlinks. Frozen resolved/reference/V3 PDF และ V3
DOCX hashes ยังคงเดิมหลัง owner export. Package PASS ไม่ทดแทน Word appearance.

ทิศทางถัดไปจาก native control คือแยก native run/compatibility/font metadata
และ paragraph structure ทีละปัจจัยก่อนเพิ่ม invisible characters ทั่วเอกสาร. ยังไม่สรุปว่าต้อง
เปลี่ยน PDF. Wrong repeated meeting header และ pagination polish เป็น known
findings เดิมที่อยู่นอกสอง candidate นี้; ไม่ promote DOCX readiness.
Checkpoint นี้ปิดเฉพาะสามการทดลองที่อนุญาต: native Word control ผ่าน,
wrap-hint candidate ล้มเหลวด้าน visible glyphs และ cover-border height
hypothesis มีผลวัดสนับสนุน. ยังไม่เลือกแนวทางแก้ Thai wrap เข้า writer จริง;
ต้องแยกปัจจัย native/generated ที่ต่างกันในพื้นที่ทดลองรอบถัดไป.

## V5 language font and paragraph isolation

เจ้าของอนุญาตวันที่ 2026-10-21 ให้ทดลองภาษา ฟอนต์ และโครงสร้างย่อหน้า
ทีละปัจจัยต่อด้วย SRS เดิม. เป็น new bounded inline experimental scope;
ไม่เปิด registered execution หรือย้อนแก้ acceptance ของ V4. Owner/roles
ตาม checkpoint เดิม; execution IDs N/A. Allowed: `tuning-v5/`, fresh SRS
experimental outputs และแผนนี้. PDF reference, frozen V3/V4 artifacts,
source template/data และ product/dependency/runtime/OS settings อยู่นอก mutation.

Proof budget: focused intro baseline + five one-factor variants, Word export
หนึ่งรอบต่อไฟล์, package invariants และ rendered comparison. Focused baseline
ต้อง reproduce first intro chunk 5 lines ก่อนใช้สรุปผล. หากได้ผลที่ชัดเจนจึง
ยืนยันปัจจัยนั้นกับ full SRS ได้อีกหนึ่ง candidate; ไม่รวมหลายปัจจัยโดยไม่มี
ผลแยก และไม่เพิ่ม invisible characters. Document budget: update แผนเดิม;
scripts/JSON/QA images เก็บใต้ experiment root. Candidate generation กับ
read-only verification แยกขั้น; ไม่แก้ candidate ระหว่างตรวจ.

Fixture ใช้ exact intro heading และ whole paragraph เดิมทั้งสาม text chunks,
run formatting และ double-BR boundaries ไม่ใช้ native control มาแทน source.
คง section geometry ของ SRS บทนำ; ตัด body ส่วนอื่นและ header/footer references
เฉพาะ common fixture ที่ใช้ร่วมกันทุก probe จึงไม่ใช่ full-SRS acceptance.
ห้าปัจจัยที่ทดสอบ: `applyBreakingRules`, `useFELayout`, first Thai run `w:cs`,
Sarabun `w:sig` จาก actual embedded font และ paragraph boundaries.
ผล Word อยู่ใน checkpoint ด้านล่าง; การต่างจาก native Word เพียงอย่างเดียว
ไม่ใช่หลักฐานสาเหตุ.

### V5 focused Word results

สร้าง baseline และห้า variants ใน `tuning-v5/probes/` แล้วเจ้าของช่วยแปลง
ครบหก PDF รวม baseline. ทุกไฟล์หนึ่งหน้า. Baseline SHA256
`e4e43271ce053cca95e14c023f7a44cba527143e88bea8a0ed12165b40b2e771`
reproduce original first-chunk break ends 50, 145, 210, 300, 391 ได้จริง.
Independent package check 50 checks ผ่าน: baseline retained subtrees ตรง source,
อีก 124 ZIP payloads ตรง V3, แต่ละ variant เปลี่ยนเฉพาะหนึ่งปัจจัย และ exact
ordered text/fonts คงเดิม. Paragraph split เก็บ 2 BR เดิม + 2 P boundaries
แทน 4 BR จึงคง logical newlines และ run formatting ไม่เปลี่ยนช่องว่างในข้อความ.

| Probe | Sole difference from focused baseline | First chunk in Word |
| --- | --- | --- |
| 00 baseline | Common extracted fixture only | 5 lines; reproduces V3 |
| 01 apply-breaking-rules | Add one compatibility flag | 5 lines; unchanged |
| 02 use-fe-layout | Add one compatibility flag | 5 lines; unchanged |
| 03 complex-script | Add `w:cs` to first 391-character Thai text run | 4 lines; ends 103, 210, 312, 391 match Core/native control |
| 04 font-signature | Correct Sarabun `w:sig` from embedded font OS/2 | 5 lines; unchanged |
| 05 paragraph-split | Replace the two double-BR logical boundaries with paragraphs while retaining newline count | 5 lines; unchanged |

Root inspected all six full-page renders: ไม่มี visible glyph boxes/clipping
ในจุดที่ตรวจ. Pixels ของ 01/02/04/05 ตรง baseline ทั้งหน้า; เฉพาะ 03 ต่าง.
ทุก PDF ฝัง Sarabun-Regular/Sarabun-Bold และ painted sizes 11.04/12.96 pt
ตรงกัน; ไม่ใช่การใช้ฟอนต์คนละ family หรือย่อขนาดเพื่อให้บรรทัดผ่าน.
Source-to-PDF break alignment ยังเป็น explicitly lossy Thai normalization;
exact source text preservation พิสูจน์จาก DOCX แยกกัน ไม่เรียก raw PDF text PASS.

**PASS bounded single-factor effect:** `w:cs` ทำให้ Word ใช้ complex-script
formatting กับ run นี้และได้จุดตัดคำตามเป้าหมาย โดยไม่เพิ่ม U+200B/forced BR,
ไม่เปลี่ยน text/font/paragraph structure. ผลนี้แยกปัจจัยที่มีผลกับข้อความ
ตัวอย่างได้ ไม่อธิบาย internal Word mechanism ทุกขั้นหรือรับรองทั้ง writer.
การเปลี่ยนภาษา compatibility flags, font signature หรือ paragraph split
เพียงอย่างเดียวไม่แก้ตัวอย่างนี้ใน export รอบที่ตรวจ.

### Separate font metadata finding

อ่าน actual OS/2 ของ embedded Sarabun ทั้ง regular/bold/italic/boldItalic
แล้วได้ six signature fields ตรงกัน: USB `21000007,00000001,00000000,00000000`,
CSB `20010193,00000000`. Declared values ใน V3 กลับเป็น USB
`E0002AFF,C000247B,00000009,00000000`, CSB `000001FF,00000000`;
ขาด Thai Unicode bit 24 และ code-page 874 bit 16. ตาม
[OpenType OS/2](https://learn.microsoft.com/en-us/typography/opentype/spec/os2)
และ [OOXML font signature](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.fontsignature?view=openxml-3.0.1)
ข้อมูลนี้ควรมาจากฟอนต์จริง.

Trace ต้นทางพบ pinned experimental `docx@9.13.0` ใน
`docx-prototype-9130/node_modules/docx/dist/index.cjs` function `createEmbeddedFont`
lines 12629–12638 hardcode ค่าเดิม; prototype caller `scripts/generate-srs.mjs:26`
ส่ง Sarabun ผ่าน font embedding path นี้. ยังไม่แก้ vendor, package หรือระบบจริง.
Native control เดิมก็เก็บ signature ผิดนี้ไว้ แต่ตัดเป็น 4 lines ได้; probe 04
แก้ signature อย่างเดียวก็ไม่เปลี่ยน wrap. จึงเป็น metadata defect ที่แยกไว้
ไม่ใช่ demonstrated standalone cause ของ line-breaking failure นี้.

### Full SRS one-run confirmation

หลัง focused result ผ่าน สร้าง `outputs/srs-cs-confirm-v5.docx`,
1,078,009 bytes, SHA256
`621e4cbefde1614276cdff244bb8f15fa7a96b070921bd034dfdb955ba92eb24`.
เพิ่ม `<w:cs/>` 7 bytes ที่ first intro run เดิมเพียงจุดเดียวใน frozen V3 เต็ม;
ไม่ใส่ให้ Thai runs อื่น ไม่รวม V4 height change หรือ font-signature correction.
ลบ recorded insertion คืน entire raw document.xml เดิมได้ตรง byte-for-byte.
Independent check 24 checks ผ่าน: อีก 124 ZIP payloads/compressed records,
text order, 200 tables / 933 rows / 1,932 cells / 371 drawings / 198 hyperlinks /
922 BR / 2,761 paragraphs / 7 sections / 396 bookmarks ตรง baseline.
เจ้าของช่วยแปลง full Word PDF แล้ว: 99 pages / 1,013,098 bytes, SHA256
`3543ead63755ba3e0b01da9af8b688dccba48e6bd128719648c0ab28ccb292cf`.
DOCX ยังตรง hash ที่ตรึงไว้. Page 11 first chunk มี 4 lines และ source break ends
103, 210, 312, 391 ตรง focused probe/Core/native control. Root ตรวจ full pages
11–16 และ intro detail: ไม่พบ visible glyph boxes/clipping ในภาพที่ตรวจ.
**PASS full-SRS confirmation of the one-run effect**; ไม่อ้างว่าแก้ Thai wrap
ทุกส่วนของ SRS หรือรับรองทุก glyph ทุกหน้าแล้ว.

All-page checks: 469 painted images = 371 body placements + 98 header banners;
body image decoded data/soft masks/order/page/bounding boxes ตรง V3 ทั้งหมด.
Media boxes ตรง, TOC links resolve และ printed page ตรงปลายทาง 198/198,
page-field policy cover hidden แล้ว pages 2–99 ถูกต้อง. Destination coordinates
11 จุดเปลี่ยนเฉพาะ XYZ-Y +19–27 pt ตาม reflow; target physical pages,
link rectangles และ names ตรงทั้ง 198 links. ไม่รายงานว่า TOC geometry identical.

Raw pypdf text ตรง V3 83/99 pages; pages 11–26 ต่างกันและมี text reflow.
Per-page whitespace/lossy Thai checks ก็ไม่ตรงทั้งหมด; ไม่ยกระดับเป็น strict
PDF text-preservation PASS จาก DOCX package preservation. รอบนี้ render/review
เฉพาะ pages 11–16; changed pages 17–26 ไม่ได้ทำ visual review ใหม่.
Known repeated-meeting-header defect เดิมยังไม่แก้และต้องแยกจาก text reflow.
Bounded reconciliation หลังตัด exact source-defined bands: normalized body
streams มี 96,454 characters และ character counts ตรง แต่ ordered stream
ยังต่าง. First difference คือ repeated meeting-1 header แทรกระหว่าง participant
rows 2/3 ใน V3 เทียบ rows 3/4 ใน candidate. เป็น supporting explanation ของ
ความต่างลำดับจุดหนึ่ง ไม่ใช่ proof ว่าทุกความต่างหรือทุก glyph ถูกต้องแล้ว.
เก็บข้อจำกัดนี้ไว้โดยไม่เพิ่ม corrective candidate นอก proof budget.

Checkpoint: จบ five-factor isolation และ one-run full SRS confirmation ตาม
scope. ขั้นถัดไปต้องวาง mapping สำหรับ Thai/mixed-script runs พร้อมรักษา
bold/italic/complex-script style inheritance ก่อนขยายทั่ว SRS; การใส่ `w:cs`
ให้ทุก run โดยไม่ตรวจ `bCs/iCs/szCs` ไม่อยู่ในผลพิสูจน์นี้. Font-signature defect
เป็นอีกเรื่องที่ต้องจัดการตามขอบเขตของ writer ไม่รวมแก้เงียบใน candidate นี้.
ไม่แก้ PDF, source template/data, installed dependencies หรือระบบจริง.

Locators ใต้ `tuning-v5/`: `probe-manifest.json`,
`research/settings-research.json`, `audit/independent-package-audit.json`,
`word-review/{comparison,root-review}.json`, `full-srs/generation.json` และ
`scripts/{v5_probe_suite,analyze_word_probes,full_srs_cs_confirmation}.py`.
Full Word evidence อยู่ที่ `full-srs/word-review/comparison.json` และ renders
ในโฟลเดอร์เดียวกัน; initial observation และ root visual acceptance แยกกัน.
Supplement: `toc-reflow-summary.json`, `text-stream-reconciliation.json`
และ `root-review.json` ในโฟลเดอร์ full Word evidence เดียวกัน.

## V6 mixed script and emphasis scope

เจ้าของอนุญาตวันที่ 2026-10-21 ให้ตรวจข้อความไทยปนอังกฤษ ตัวหนาและตัวเอียง
ด้วย SRS เดิมในพื้นที่ทดลอง แล้วสรุปก่อนขยายทั้งเอกสาร. เป็น bounded inline
discovery ใหม่; ไม่เปิด registered execution หรือเปลี่ยน acceptance ของ V5.
Owner: Project Control สำหรับแผนนี้; experiment writer เป็น disposable input
สำหรับ Core owner เท่านั้น. Roles: Planning Partner / Evidence Reviewer /
Documentation Synthesizer; Work/Phase/Checklist/execution IDs N/A.

Allowed: new `tuning-v6/` artifacts, section นี้ และ current status ของแผน. Frozen V3/V5 candidates,
PDF reference, source template/data, product repositories, installed dependencies,
runtime/OS settings และ maps อยู่นอก mutation. ใช้ isolated experiment root
เดิม; small separable plan update ใช้ Project Control checkout ที่สะอาด.
Model decision: retain current host model for this bounded diagnostic continuation;
ไม่ dispatch registered product WORK หรือเปลี่ยน model setting.

Acceptance: inventory actual script/emphasis coverage และ effective formatting;
สร้าง common fixture จากข้อความ/ย่อหน้า SRS เดิม; แยก baseline, `w:cs` only
และ `w:cs` พร้อม explicit complex-script formatting ที่รักษารูปแบบเดิม;
ตรวจ exact text/package invariants แล้วเปรียบเทียบ Word fonts, line breaks,
ขนาด และ glyphs. หาก source ไม่มี italic/boldItalic ต้องระบุ coverage gap
และแยก controlled formatting overlays จาก actual SRS cases อย่างชัดเจน.
ไม่ถือ XML-only checks เป็น Word rendering PASS.

Proof budget: source inventory หนึ่งชุด, comparison DOCX ไม่เกินสามไฟล์
ไฟล์ละไม่เกินหกหน้า, Word export หนึ่งรอบต่อไฟล์ และ review ทุกหน้าของ
compact fixture. อนุญาต focused read-only check/research สำหรับ script-slot
และ style-inheritance failure; ไม่สร้าง full-SRS candidate หรือขยาย mapping
ทั่วเอกสารในรอบนี้. Candidate generation กับ verification แยกขั้น.
Document budget: update section เดิมนี้; machine-readable observations/scripts/
QA images อยู่ใต้ `tuning-v6/`; ไม่มีรายงานหรือ Work records เพิ่ม.

Current status: **PASS bounded V6 comparison**, with the scope and limitations
below. Mixed-script/emphasis behavior is demonstrated for this compact fixture;
general mapping and full-SRS pagination remain unverified. Absence of actual
italic source remains an explicit coverage limitation.

### V6 source coverage and common fixture

Frozen V3/source identities remain those in V5. Inventory of active text-bearing
main-document runs found regular and bold Thai/Latin/mixed text, but no natural
italic, boldItalic or inline emphasis transitions. Unused italic style definitions
are not coverage. The source style named `bold` has `fontWeight: normal`;
this checkpoint does not rename or repair existing source styles.

Natural specimens: original mixed heading paragraph 297 and full introduction
paragraph 298, plus definition table 16 rows 0–7. Paragraph indices are zero-based
`//w:p` indices in the frozen `word/document.xml`. In the common baseline, the
first two retain exact qualified XML structure/properties/text; table properties
and the eight selected rows are also source-identical. Existing section geometry/fonts/settings are
retained, with header/footer references removed from the common extracted section.

Three comparison files share five diagnostic pages:

| Page | Coverage | Provenance limit |
| --- | --- | --- |
| A / 1 | Natural mixed bold heading and three intro chunks | Exact existing source paragraphs |
| B / 2 | Natural Latin, Thai and mixed text in definition table | Eight existing rows; not the complete source table |
| C / 3 | Regular / bold / italic / boldItalic | Controlled paired standard/CS formatting on the existing 312-character mixed intro chunk |
| D / 4 | Inherited boldItalic with direct regular / bold / italic / boldItalic overrides | Controlled character style; CS off flags deliberately absent in baseline |
| E / 5 | Inline regular → bold → italic → boldItalic transitions | Controlled common segmentation of the same exact source text; no candidate-specific splitting |

The natural paragraphs keep their original run boundaries. Controlled page E
introduces the same four run boundaries in every candidate to exercise a missing
source case; this is not evidence that arbitrary script-boundary splitting is
layout-equivalent or needed by the writer.

Files under `tuning-v6/probes/`: `00-baseline.docx`, `01-cs-only.docx`, and
`02-cs-preserve-emphasis.docx`. The latter SHA256 is
`a5ccf65f334ea309f3de4915633ae0dded7121b2e751d77158dbe216eff35415`.
All three contain 125 ZIP payloads; 123 remain byte-identical to frozen V3.
Only common document/style fixture parts differ from V3. Between candidates,
exact text, paragraph/table/run boundaries, font resources and all non-target
properties remain identical. Pure Latin control runs remain unchanged.
Independent saved-package check passed 331 focused assertions; candidate hashes
and frozen inputs remain unchanged after Word export and verification.

### V6 Word comparison results

The owner exported all three PDFs through Word: five pages each. Root rendered
and reviewed all 15 complete pages. No visible clipping, overlap or box/replacement
glyphs was found in these specimens; the deliberately failing emphasis control
is recorded separately below and is not a deliverable-ready candidate.

Both CS variants add `w:cs` to 24 Thai-containing text runs, including whole
mixed runs; they do not force RTL. The synchronized variant additionally writes
explicit `bCs/iCs` true **and false**, with `szCs` matching the original intended
size. Every target has direct `b/i/sz` and all font slots resolve to Sarabun.
This known-fixture rule is not a general style-inheritance or font resolver.

| Check | Baseline | CS only | CS with formatting preservation |
| --- | --- | --- | --- |
| Natural intro wrapping | Reproduces V5 differences | All three chunks match Core reference endpoints | Same match |
| Natural mixed bold heading | Bold retained | Bold retained | Bold retained |
| Paired direct four-style controls | All requested faces retained | All retained | All retained |
| Inherited-on/direct-off controls | All requested faces retained | Regular, bold and italic incorrectly become boldItalic | All requested faces retained |
| Inline transitions | Measured segments retained | Retained | Retained |

Source-relative intro break ends, after the same explicitly lossy PDF alignment
used in V5:

| Chunk | Baseline ends | Both CS variants and Core PDF ends |
| --- | --- | --- |
| First Thai chunk | 50, 145, 210, 300, 391 | 103, 210, 312, 391 |
| First mixed chunk | 96, 202, 246, 312 | 96, 202, 304, 312 |
| Second mixed chunk | 73, 176, 272, 330 | 114, 219, 315, 330 |

The table excerpt also retains its normalized text sequence; its Kick-Off row
wraps differently when CS is selected. This does not certify table wrapping
against every source PDF row. Natural heading PDF size stays 12.96 pt and
controlled text paints at 11.04 pt across variants; DOCX intended sizes remain
13/11 pt. Font stream metadata (name tables, OS/2 weight/style, head style and
italic angle) supports Sarabun regular/bold/italic/boldItalic selection, rather
than relying only on Word's temporary PDF font labels. Full outline identity
and fallback behavior outside these specimens were not checked.

CS-only and synchronized rendered pixels are identical on pages 1, 2, 3 and 5;
only page 4 differs. On page 4 the CS-only candidate paints every controlled
body row as boldItalic, including the three rows requesting another style.
Both Thai and Latin show the same failure. Explicit off values in the
synchronized candidate restore the requested four styles. This proves a
controlled inheritance risk; it does **not** demonstrate an emphasis defect
in the natural SRS, whose existing standard/CS effective values already agree.
Page E's regular segment contains only Thai, so Latin regular at that particular
transition is absent coverage; regular Latin is covered on pages C/D.

### V6 decision and limits

**PASS bounded mixed-script/emphasis experiment:** retain the CS selector
together with the original effective emphasis/size/font policy as the next
experimental mapping candidate. Selecting CS alone is insufficient for a writer
that must preserve inherited formatting. Resolve effective values before mapping;
do not equate a missing property with an explicit false or introduce RTL as a
substitute. Research of pinned `docx@9.13.0` also found that explicitly passing
false to its CS emphasis options can omit the XML element; inspect emitted XML
or use a verified emission path when an inherited true must be overridden.
See [CS formatting](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.complexscript?view=openxml-3.0.1)
and [CS italic inheritance](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.italiccomplexscript?view=openxml-3.0.1).

No global/full-SRS candidate is created in V6. General paragraph/character/table/
numbering inheritance, differing font slots, fallback, arbitrary run splitting,
whole-document reflow/pagination and strict raw Thai PDF text/glyph fidelity
remain outside this acceptance. The font-signature defect, repeated meeting
header and line/row-height work remain separate existing findings. No PDF
reference, source template/data, product repository, dependency/runtime/OS setting
or map is changed. Stop after this comparison and summarize before expanding.

Locators under `tuning-v6/`: `inventory/srs-style-inventory.json`,
`research/mapping-rules.json`, `probe-manifest.json`, `package-check.json`,
`inventory/saved-package-check.json`, `word-review/comparison.json`,
`word-review/emphasis-observations.json` and `word-review/root-review.json`.
The last separates root visual acceptance from raw observations; initial
package/research records retain their original pre-export status. Reproduction
helpers are `scripts/build_mixed_emphasis.py`, `scripts/observe_word.py` and
`word-review/measure_emphasis.py`. These are disposable experiment helpers,
not installed writer or product tests.

## V7 full SRS formatting-preserving CS comparison

เจ้าของอนุญาตวันที่ 2026-10-21 ให้ใช้ complex script พร้อมรักษารูปแบบเดิม
กับ SRS เต็มในพื้นที่ทดลอง แล้วตรวจการตัดบรรทัด ตาราง และการแบ่งหน้าเทียบ
PDF เดิมก่อน. เป็น bounded inline experimental scope ใหม่; ไม่เปลี่ยน
acceptance ของ V5/V6 หรือเปิด registered execution. Roles: Planning Partner /
Evidence Reviewer / Documentation Synthesizer; Work/Phase/Checklist IDs N/A.
Owner: Project Control สำหรับบันทึกนี้; disposable writer experiment สำหรับ
Core owner. Product repositories ไม่ใช่ mutation target ของรอบนี้.

Allowed: new `tuning-v7/`, fresh `outputs/srs-cs-preserved-v7.docx` และ owner
Word PDF ชื่อเดียวกัน, section นี้และ current status. Frozen V3/V5/V6 artifacts,
PDF reference, source template/data, dependency/runtime/OS settings และ maps
คงเดิม. ใช้ isolated experiment root เดิมและ clean separable PC checkout.
Work Size medium; Risk Tier routine. Model decision: retain current host model
สำหรับ bounded same-chat continuation; ไม่ dispatch registered product WORK.

Acceptance: preflight ทุก active story part; apply CS เฉพาะ text runs ที่มีไทย
โดยรักษา effective font/emphasis/size และ explicit off, ไม่เปลี่ยน text/runs/
tables/images/fields/section/page-break policies. Unsupported font slots หรือ
style semantics ต้องเป็น finding ไม่ใช่ silent fallback. ตรวจ package invariants
ก่อน Word export; หลัง export เทียบ intro line breaks, semantic content order,
tables/table splits, images/TOC/page fields และ whole-document pagination กับ
98-page Core PDF โดยใช้ V3 Word PDF เป็น regression context. Review output
ทุกหน้า พร้อม source-aligned comparison; ความต่างที่ยอมรับและ gaps ต้องแยก
จาก missing content หรือ source/structure defects.

Proof budget: full-SRS candidate หนึ่งไฟล์และ owner Word export หนึ่งรอบ;
focused package checks และ one all-page comparison/review cycle. Render QA
candidate ทุกหน้าและ source pages ที่ใช้เทียบ; parallel read-only reviewers
อาจแบ่งช่วงหน้าได้ แต่ไม่สร้าง corrective candidate เพิ่มในรอบนี้. ไม่ตั้ง
สมมติฐานว่า page numbers ต้องเท่ากัน และไม่ใช้ lossy Thai normalization แทน
strict text/glyph proof. Document budget: update แผนนี้; scripts/JSON/PNG อยู่
ใน experiment root. Generation และ verification แยกขั้น; checks ไม่แก้ candidate.

Current status: **COMPLETED WITH LAYOUT FINDINGS**. Full candidate และ Word
comparison เสร็จแล้วตามผลด้านล่าง; ไม่รับรอง whole-document layout fidelity.
General writer readiness และ other-font coverage ยัง deferred. ไม่มี corrective
candidate เพิ่มใน scope นี้ และไม่มีการเปลี่ยน PDF หรือระบบจริง.

### V7 full candidate and preservation checks

Preflight ตรวจ 45 active story parts: main document, 21 headers, 21 footers,
footnotes และ endnotes. พบ Thai-containing text runs 1,420 จุดทั้งหมดใน
`word/document.xml`: 1,405 จุดมี direct formatting; อีก 15 จุดเป็น cached
TOC hyperlink labels ที่ไม่มี `rPr`. ตรวจ chain จริงของ TOC1/2/3 → Normal
ที่ไม่มี run properties → docDefaults แล้วได้ normal, non-italic, 11 pt และ
Sarabun ทุก font slot ตรงกัน. ไม่สร้าง general style resolver หรือข้ามจุดนี้
โดยไม่แจ้ง. ไม่มี Thai target ใน story อื่น ไม่มี unsupported target, font-slot
mismatch, target character style, revision หรือ existing CS/RTL selector.

สร้าง `outputs/srs-cs-preserved-v7.docx`, 1,083,034 bytes, SHA256
`e5ba0793924984d52c9ded04c7b82e57b4a6f21d75ec17384e182ffa92045a73`.
เปลี่ยนเฉพาะ CS run properties ของทั้ง 1,420 จุด: เลือก CS พร้อม explicit
`bCs/iCs` true/false และ size ที่รักษาค่าเดิม; TOC 15 จุดเพิ่ม `rPr` เฉพาะ
CS values จาก known chain. ไม่เปลี่ยน ordinary inherited formatting, text,
run boundaries, section geometry หรือ page-break policies. XML เพิ่ม 72,615
bytes; inverse เฉพาะ allowed changes คืน entire raw source XML ได้ตรงทุก byte.

Independent saved-package check ผ่าน 33,835 assertions: อีก 124 ZIP payloads
และ compressed local records ตรง frozen V3 ทุก byte. Exact ordered text,
fields และโครงสร้างคงเดิม: 2,761 paragraphs / 4,609 runs / 200 tables /
933 rows / 1,932 cells / 371 drawings / 198 hyperlinks / 922 breaks /
7 sections / 396 bookmarks. Main complex fields 199 และ footer simple fields
36 คงเดิม. Styles/settings/fonts/media ไม่เปลี่ยน. นี่คือ DOCX package proof;
ไม่ใช้แทน rendered PDF content หรือ layout acceptance.

เจ้าของแปลงผ่าน Microsoft Word for Microsoft 365 เป็น
`outputs/srs-cs-preserved-v7.pdf`, 99 pages / 1,015,353 bytes, SHA256
`57af67fa9dc998fd9a7ad0719bfe32d9f701ab16c181dcdd87120d366c269d9f`.
Frozen Core PDF มี 98 หน้า; frozen Word V3 มี 99 หน้าเช่นกัน. Refresh ของ
TOC อาจสร้าง cached run properties ใหม่ใน Word จึงตรวจผล PDF จริง ไม่อ้าง
ว่า selector บน cache ต้องคงอยู่หลัง refresh. Original DOCX hash ไม่เปลี่ยน.

### V7 all-page reference comparison

Render ที่ 120 dpi และตรวจ full page ทุกหน้า: candidate 1–99 และ Core 1–98.
แบ่งช่วง reviewer เป็น 1–25 / 26–50 / 51–75 / 76–99 พร้อม source-aligned
comparison; manually align หน้าไม่มี unique anchors และ long-row continuations.
ไม่มี source page หรือ candidate page ที่หลุดจาก visual coverage. ไม่พบ visible
glyph boxes, clipping, overlap, blank pages หรือ incomplete ending ในรอบนี้;
ไม่อ้างว่าตรวจ raw Unicode หรือทุก glyph program ตรงกันแล้ว.

| Area | Observed result | Acceptance boundary |
| --- | --- | --- |
| Intro Thai/mixed wrapping | ทั้งสาม chunks มี break ends ตรง Core ตาม V6: 103/210/312/391; 96/202/304/312; 114/219/315/330 | PASS จุดที่วัด; ไม่ใช่ universal line-break parity |
| Other wrapping | ตัวอย่างนิยาม SRS หน้า 13 และ requirements หลายจุดยังตัดต่างจาก Core | Readable; บันทึก exact examples ไม่เปลี่ยน PDF ให้ตาม Word |
| DOCX structure/content | Exact source package invariants ผ่าน | ไม่เท่ากับ strict rendered PDF text preservation |
| Body images | 371 placements มี decoded identity/soft mask/order ตรง Word V3 | PASS identity/order; 78 placements ขยับตาม reflow บน pages 53–61 |
| TOC | 198/198 resolve, printed page ตรง destination และ source label corroborates ที่ link/target | PASS functional; 16 destination/geometry differences ตาม reflow, ไม่อ้าง identical geometry |
| Header/page fields | 98 banners; cover ไม่แสดงเลข แล้ว pages 2–99 แสดง Page p of 99 ถูกต้อง | PASS policy; ไม่ต้องบังคับ page count เท่ากับ Core |
| Whole pagination | Word 99 เทียบ Core 98; offset เปลี่ยนตามช่วง ไม่ใช่ +1 คงที่ | เป็น recorded difference; fidelity ยังมี findings ด้านการจับกลุ่มตาราง |

Semantic alignment ใช้ 463 eligible unique paragraph anchors; candidate map
ได้ 429 จุด. จาก source 933 rows ยังมี 532 rows ที่ไม่มี unique text anchor
เช่น short/repeated/image-only cells; ใช้ manual source comparison ช่วย แต่ไม่
ประกาศ automated cell-by-cell equality. Raw pypdf page text ตรง V3 เพียง
48/99 หน้า. Lossy Thai normalization ใช้จัดตำแหน่งเท่านั้น ไม่ใช่ raw text/glyph
proof หรือหลักฐานว่าจุดที่ map ไม่ได้เป็น missing content.

### V7 remaining table and pagination findings

1. **Persistent wrong meeting header:** Word V3 และ V7 แสดงหัวประชุมครั้งที่ 1
   บน pages 17–26 ขณะที่ Core แสดงครั้งที่ 1 เฉพาะ 17 แล้วใช้เลขของการประชุม
   ที่กำลังต่อหน้า. ตัวอย่าง V7 page 18 เป็นเนื้อหาครั้งที่ 2 แต่หัวซ้ำเป็น 1;
   page 26 ต่อครั้งที่ 15 ก็ยังหัว 1. ไม่ถือเป็นปัญหาตัดคำที่ CS แก้แล้ว.
2. **Persistent heading/table separation:** เช่น V7 pages 28, 33, 35–44,
   74 และ 83 มีหัวข้อหรือคำอธิบายอยู่ท้ายหน้าแต่ตารางเริ่มหน้าถัดไป.
   ตรวจ V3 supporting evidence แล้วพบปัญหาเดิมในตัวอย่างที่รายงาน;
   ไม่ยกทั้งหมดเป็น regression จาก CS.
3. **Persistent detached icons/text:** เช่น REQ0003/0026/0034 ที่ pages
   46/49/50 และ REQ0270, REQ0293, REQ0331 ในช่วงท้าย. V3 visual comparison
   ยืนยัน representative cases เดิม; บาง continuation เหลือเฉพาะ blue icon
   หรือ `-Image` บนหน้าใหม่ ทำให้ความสัมพันธ์กับข้อความอ่านยากขึ้น.
4. **New reflow instance:** REQ0074 text อยู่ท้าย V7 page 55 แต่ blue icon
   อยู่ลำพังต้น 56. Core page 55 และ Word V3 page 56 เก็บ text+icon ร่วมกัน.
   จึงเป็นจุดแบ่งใหม่จากรอบนี้ แม้ general row/image splitting policy มีปัญหา
   เดิมอยู่แล้ว (เช่น V3 page 55 มี icon continuation ของ REQ0063).
   ไม่อ้างว่ารอบนี้ปราศจาก layout regression ทุกจุด.
5. **Other splits with unresolved regression status:** icons ของ REQ0113/
   REQ0133 แยกบน V7 pages 61/64 ต่างจาก Core; ไม่ได้ตรวจ V3 counterpart
   สองจุดนี้แยกอีก จึงรายงานเป็น confirmed Core difference และ unknown ว่า
   เป็นจุดใหม่หรือเดิม ไม่เพิ่ม proof นอก budget เพื่อบังคับ classification.
6. **Residual spacing/wrap/TOC appearance:** overview 7.5 ลงท้ายด้วยคำ
   `รายงาน เป็นต้น` บน V7 page 15 แทน Core 14; scope 10.4.1 เลื่อนไป 17.
   ตารางนิยาม/Element มี vertical drift และบางข้อความตัดบรรทัดต่าง.
   TOC มี dotted leaders และเลขหน้าที่ดูต่าง: วัด page-4 digits พบ AngsanaNew
   11.04 pt ในทั้ง V3/V7 เทียบ Core font label FlowDocSubset-0 ที่ 11 pt.
   เป็น face difference ที่มีอยู่เดิม ไม่ใช่หลักฐานว่ารอบนี้ลดขนาดเลขหน้า.

**Decision:** completed the authorized full-SRS comparison with findings;
ไม่รับรอง layout fidelity หรือ product readiness. เก็บ CS พร้อม formatting
preservation เป็นแนวทางของ prototype ต่อได้ แต่ต้องจูน meeting-header semantics,
การจับหัวข้อกับตาราง และ row/text/icon page grouping ก่อนนำเข้าระบบจริง.
ยังไม่จำเป็นต้องแก้ PDF จากผลนี้ และไม่เปลี่ยน PDF/source/runtime จริง.
ไม่มี corrective candidate หรือ product repair ใน checkpoint นี้.

Locators ใต้ `tuning-v7/`: `generation.json`, `package-check.json`,
`preflight/{full-srs-mapping-preflight,target-plan,saved-package-check}.json`,
`comparison/{design.json,compare_v7.py}`, `word-review/comparison.json`,
`word-review/root-observations.json`, `word-review/root-review.json`,
`qa/reviews/pages-{001-025,026-050,051-075,076-099}.json` และ full-page renders
ใน `qa/{reference,candidate}/`. Root summary ตรวจ union ของ visual coverage
และ immutable input/candidate hashes อีกครั้ง; observation records ที่เขียนก่อน
Word export คงสถานะ pre-export เดิม ไม่ย้อนแก้ให้ดูเหมือนผ่าน Word มาก่อน.

## V8 meeting headers and content grouping trial

### Bounded scope and acceptance

คำขอเจ้าของ 2026-10-21 อนุญาตแก้เฉพาะ candidate ทดลองจาก V7 ให้หัวตาราง
ประชุมใช้เลขของครั้งที่กำลังต่อหน้า หัวข้อ/คำอธิบายอยู่กับต้นตาราง และไอคอน
อยู่กับข้อความที่สัมพันธ์กัน. ใช้ SRS/source เดิมใน experiment root เดิม;
PDF ต้นแบบ, resolved data, V7 และ product/runtime ทั้งหมด frozen.
นี่เป็น scope ใหม่ต่อจากผล V7 ที่คงประวัติไว้ ไม่ย้อนเปลี่ยน acceptance เดิม.

Owner: Project Control สำหรับแผน; prototype writer ใน experiment root
สำหรับ candidate. Role: Planning Partner / Evidence Reviewer /
Documentation Synthesizer. Single-room, unregistered; execution IDs N/A.
Work Size: small; Risk Tier: routine. Work authority: bounded prototype
implementation หลัง read-only discovery แล้ว verification ที่ไม่แก้ candidate.
Model decision: ใช้ host/session model ปัจจุบันกับ bounded inline task;
ไม่มี separate WORK หรือ model override. Helpers แยก read-only discovery
และ verification ไม่รับ ownership ของ product lane.

Document Budget: อัปเดตแผนนี้ไฟล์เดียว. Proof Budget: หนึ่ง full-SRS candidate,
source mapping, package/inverse preservation checks, หนึ่ง manual Word export
และ all-page review เทียบ frozen Core PDF พร้อม targeted comparison V7.
หากยังมี finding ให้บันทึกก่อนเริ่ม candidate/review cycle เพิ่ม.
ข้อเท็จจริงจาก V7 ที่ยังไม่เปลี่ยนใช้ผลเดิม ไม่ทดสอบ controls V5/V6 ซ้ำ.

Acceptance: หัวประชุมไม่ซ้ำผิดเลข; representative headings/descriptions
และไอคอนที่แยกเดิมอยู่กับ content ที่เกี่ยวข้อง; long rows ยังแบ่งหน้าได้;
text/runs/fields/images/section geometry/CS formatting และ package parts
นอกขอบเขตคงเดิม. ตรวจ all-page output ว่าไม่มี visible clipping, overlap,
glyph boxes หรือ missing ending พร้อม functional TOC/page fields หลัง reflow.
Page count/line breaks อาจต่างจาก Core ตามข้อตกลง; ไม่ปรับ typography,
TOC appearance, general row heights, PDF หรือ production เพื่อบังคับจำนวนหน้า.
ความเสี่ยงคือ grouping อาจเปลี่ยน pagination หรือถูก Word ตีความต่างจาก XML;
static checks จึงไม่แทน Word rendering. สถานะเริ่มต้น: discovery in progress;
ผลสิ้นสุดและข้อจำกัดอยู่ด้านล่าง.

### V8 source diagnosis and candidate

Read-only discovery แก้ความเข้าใจเรื่องสาเหตุให้แม่นขึ้น: V7 มีตารางประชุม
แยกอยู่แล้ว 15 ตาราง (source indexes 19–33), ครั้งที่ 1–10 และ 12–16.
แต่ละตารางมีหัวแถวแรกและเลขของตัวเองถูกต้อง; ไม่มีครั้งที่ 11 ใน source.
ทุกตารางมี `tblPr/tblGrid` ตรงกันและวางเป็น adjacent `w:tbl` ไม่มี paragraph
คั่น 14 จุด. ไม่ใช่ source รวมทุกครั้งเป็นตารางเดียวหรือข้อมูลหัวผิดเลข.
ข้อสันนิษฐานคือ Word รวมตารางที่ติดกันและใช้หัวแรก; V8 ยืนยันเชิงผลลัพธ์ว่า
เพิ่มตัวคั่นแล้วหัวต่อหน้าถูกเลข ไม่อ้างว่า trace internal Word implementation.

สร้าง `outputs/srs-grouped-v8.docx`, 1,084,106 bytes, SHA256
`972b987f758df41d8c2dbf1970cc2faa89b2c85d8fd031634c6ee33784727bbb`.
เปลี่ยนเฉพาะ main document part จาก frozen V7:

- เพิ่ม empty paragraph 14 จุดระหว่างตารางประชุมเดิม; before/after 0,
  exact line 1 twip, paragraph-mark size 1 pt และ keep-with-next.
  ไม่มี visible blank separator line ใน Word output; ไม่ split/rewrite ตาราง
  หรือแก้ `tblHeader`, row/cell properties.
- จับ 172 heading/table chains รวม 221 paragraphs (189 headings + 32
  descriptions) ด้วย `keepNext`; เพิ่ม `keepLines` เฉพาะ headings.
  ไม่มี chain ข้าม section/page break หรือเข้า TOC/list/hyperlink.
- จับ 363 text/icon pairs (361 requirement rows + 2 unnumbered note rows)
  ด้วย `keepNext` บน text paragraph ก่อน icon; คง `keepLines=false`
  เพื่อให้ข้อความยาวแบ่งหน้าได้. ไม่เปลี่ยน 8 legend images ที่ไม่มี text
  ก่อนหน้าใน cell; ไม่ใช้ blanket `cantSplit` หรือจับทั้งตารางไว้หน้าเดียว.

การเลือก targets อิง source paragraph/table/row/cell identity ไม่อิงเลขหน้า
หลัง render. [Microsoft KeepNext semantics](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.keepnext?view=openxml-3.0.1)
รองรับการให้บางส่วนของย่อหน้าอยู่หน้าเดียวกับย่อหน้าถัดไปและยังแบ่งกลุ่มที่ยาว
เกินหน้าได้; จึงยังต้องดู Word จริง. ตารางประชุมคงกติกา
[repeat-header ของแถวแรก](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.tableheader?view=openxml-3.0.1)
เดิม ไม่สร้างข้อความหัวต่อหน้าขึ้นเอง.

Builder raw inverse คืน source XML ทุก byte ได้; independent saved-package
check ผ่าน 19,818 assertions และ derive targets จาก topology แยกจาก manifest.
มีเพียง 584 paragraph-property targets และ 14 separators; raw XML ลด 8,428
bytes จากการเขียน true แบบ empty element. อีก 124 ZIP payloads และ compressed
local records ตรง V7 ทุก byte. ลบเฉพาะ separators และย้อน target properties
แล้วได้ entire V7 canonical XML เดิม. คง ordered text, 4,609 runs/CS formatting,
200 tables/933 rows/1,932 cells/371 drawings/198 hyperlinks/922 breaks/
7 sections/396 bookmarks/199 main field instructions. Paragraphs เพิ่ม
2,761 → 2,775 เท่านั้น; styles/settings/fonts/media/header/footer ไม่เปลี่ยน.
ขนาด serialized XML นี้ไม่ใช่ผลวัด RAM หรือ Word performance.

### V8 Word rendering and comparison results

เจ้าของแปลงด้วย Word for Microsoft 365 เป็น `outputs/srs-grouped-v8.pdf`,
100 pages / 1,017,481 bytes, SHA256
`2d129ea6348ef047216bb917a55977b3e11a124f59f046b6336c9572d11d53ab`.
Word V7 มี 99 หน้า; frozen Core PDF มี 98 หน้า. Render 120 dpi และเปิด
full-page candidate 1–100 / Core 1–98 ครบทุกหน้า พร้อม V7 supporting pages
สำหรับจุดเดิม. ไม่พบ visible glyph boxes, clipping, overlap, blank pages หรือ
incomplete ending ในรอบนี้; ไม่ใช้แทน raw Unicode/every-glyph/every-cell proof.

| Authorized target | Observed result | Boundary |
| --- | --- | --- |
| Meeting header numbers | Pages 18–26 ใช้ 2/3/5/7/8/10/12/14/15 ตามการประชุมที่ต่อหน้า; ครั้ง 16 เริ่มต่อบน 26 ถูกต้อง | แก้การซ้ำเลข 1 แล้ว; meeting 2 ย้ายไปเริ่ม 18 และ meeting 7 ยังแบ่ง 20–21 |
| Heading + description + table | จุดที่รายงานเดิมอยู่ด้วยกัน: 4.4 ที่ 29; 7.5 ที่ 34; 9.6 ที่ 36; 9.14 ที่ 37; 10.6 ที่ 38; 11/11.1 ที่ 39; 11.9 ที่ 40; 11.17 ที่ 41; 12.4 ที่ 42; 13.5 ที่ 43; 14/14.1 ที่ 44; 15.3 ที่ 45; 16.19 ที่ 76; 16.24 ที่ 85 | ไม่พบ orphan headings ใน all-page review; ไม่บังคับ table/whole-row ให้อยู่หน้าเดียว |
| Nine previously reported icon cases | REQ0003/0026/0034/0074/0113/0133/0270 อยู่กับข้อความที่ 46/49/50/56/61/64/81; REQ0293 รายการ Subject/Description/Image + icon อยู่ 84; REQ0331 สองบรรทัดท้าย + icon อยู่ 90 | สองกรณีท้ายยังมีส่วนต้น row อยู่หน้าก่อน; ไม่มี icon-only continuation ในจุดเหล่านี้ |
| Images | 371 ordered decoded body placements/soft masks ตรง V3/V7/V8 | PASS identity/order; ตำแหน่งเปลี่ยนตาม reflow ไม่ใช่ equal geometry |
| TOC and page policy | 198/198 links resolve และ printed page ตรง destination; cover ซ่อนเลข, pages 2–100 แสดง Page p of 100; 99 banners ถูก policy | Functional PASS; รูปแบบ TOC/font face ยังต่างจาก Core |
| Intro CS wrapping | Relevant frontmatter/intro body pixels pages 1–4 และ 10–16 ตรง V7 (ยกเว้น footer/page total) | ใช้ V7 wrap findings เดิมต่อได้; ไม่อ้าง wrap parity ทั้งเอกสาร |

Automated suffix indicators สำหรับ 363 text/icon pairs: V7 มี 324 unique
suffixes อยู่หน้าเดียวกับ icon, 8 อยู่ต่างหน้า, 6 short/19 repeated/6 unresolved.
V8 มี 324 same-page, 0 different-page indicators, 6 short/19 repeated และ
14 unresolved. บาง suffix ยาวคร่อมหน้าเมื่อ reflow; จำนวน unknown ที่เพิ่ม
ไม่ใช่หลักฐานว่าเนื้อหาหาย และ 0 indicators ไม่ใช่ automatic all-pass.
ใช้ all-page visual review และ source-specific known cases ประกอบ.
Generic paragraph/row anchors ยังไม่ครอบคลุมทุก cell: รอบนี้ 549/933 rows
ไม่มี unique candidate text anchor; ไม่ประกาศ automated cell equality.

### V8 remaining limits and checkpoint decision

- **Requirement-column header repetition ยังมีปัญหา:** บาง continuation pages
  ไม่แสดง `Req no. / Features List / Remark` ซ้ำ เช่น V8 52, 56, 57,
  60, 61, 64, 65, 67, 72, 73, 75. ยืนยัน general behavior เดิมใน V7
  52/57; V8 56 เป็น reflow instance ใหม่ (REQ0065 ขึ้นหน้าใหม่หลังตาราง
  16.5 เริ่มที่ 55). ไม่ปะปนกับ meeting-number defect ที่แก้แล้ว และไม่อ้าง
  ว่าไม่มี layout regression instance ใดเลย.
- Long rows ยังแบ่งต่างจาก Core เช่น REQ0019: V8 48–49 เทียบ Core 47;
  REQ0241: V8 76–77 เทียบ Core 75. การจับ icon รักษาท้ายข้อความร่วมกัน
  ไม่ใช่การรับรอง whole-row non-splitting หรือ identical pagination.
- General line/row height, บาง gray-header border edges, ordinary wrapping,
  overview 7.5 ที่ต่อ 14–15, outline 10.4 ที่ต่อ 16–17 และ TOC dotted
  leaders/number face ยังต่าง. ไม่ tune นอกสามเป้าหมายเพื่อบังคับ 98 หน้า.
  Core เองมี icon-only continuations บางจุด เช่น REQ0280/0290/0357/0362;
  semantic grouping ที่ดีขึ้นจึงไม่เท่ากับ copy ทุก page break จาก Core.
- Discovery `grouping.json` บาง `requirementIds` ได้จาก concatenated row text
  จึงอาจติดเลขต้น content. ตัวเลือก paragraph targets ไม่กระทบ; observation
  helper ใช้ exact first-cell REQ label แทน และเก็บ discovery เดิมไว้ไม่ย้อนแก้.

**Decision:** COMPLETED WITH REMAINING LAYOUT FINDINGS สำหรับ bounded V8
trial. ยืนยันผลแก้สามเป้าหมายตามตัวอย่างเดิมและ all-page inspection แล้ว;
full layout fidelity/product readiness ยัง NOT ACCEPTED. คง candidate และ
ข้อจำกัดไว้ให้เจ้าของประเมิน. งานถัดไปที่เหมาะคือแยกจูน repeated requirement
column headers ก่อน general spacing/typography; ไม่แก้ PDF หรือระบบจริง.
ไม่มี candidate/review cycle เพิ่มหลังจุดตรวจนี้.

Locators ใต้ `tuning-v8/`: `discovery/{meeting,grouping}.json`,
`generation.json`, `scripts/{build_grouping_trial,check_package,observe_grouping}.py`,
`preflight/independent-package-check.json`,
`word-review/{comparison,grouping-observations,root-review}.json`,
`qa/candidate/manifest.json`, `qa/reviews/pages-{001-025,026-050,051-075}.json`,
`qa/reviews/pages-076-end.json`,
`qa/reviews/reference-001-025-completion.json`. Original source, V7 and V8
candidate hashes ตรวจซ้ำหลัง QA; checks เขียนเฉพาะ outputs ใหม่ใน lane.

## V9 repeated requirement-header trial

### Scope and corrected discovery

คำขอเจ้าของ 2026-10-21 อนุญาตหาสาเหตุและจูนหัวคอลัมน์ตารางที่ไม่แสดงซ้ำ
ใน SRS เดิม พื้นที่ทดลองเดิม แล้วเทียบ PDF อีกครั้ง. Frozen base คือ V8
`srs-grouped-v8.docx/pdf`; source/resolved/Core PDF และ product/runtime
ทั้งหมดไม่เปลี่ยน. Owner/roles และ single-room unregistered mode ตาม V8;
execution IDs N/A. Work Size small / Risk routine; current host/session model,
ไม่มี override หรือ separate WORK. ขั้นแรก read-only discovery ก่อน candidate
implementation แล้ว verification แยกที่ไม่แก้ candidate.

Document Budget: แผนนี้ไฟล์เดียว; raw diagnostics/scripts/artifacts อยู่ใต้
`tuning-v9/`. Proof Budget: minimal full-SRS candidate จากการวินิจฉัย,
package containment/inverse check, manual Word PDF export และ all-page
comparison; หาก single-property experiment ยืนยันสาเหตุแต่ทำ icon แยก
อนุญาตหนึ่ง bounded paragraph-boundary fallback พร้อมบันทึกเหตุผลก่อนสร้าง.
ไม่ทดลอง header flags, row heights, fonts หรือ whole-row non-splitting
หลายปัจจัยพร้อมกัน. Acceptance: หัวคอลัมน์แสดงในทุก requirement table page,
รวมช่วงกลาง REQ0041; icon/heading/meeting fixes ของ V8 ยังคงได้ผล;
เนื้อหา/รูป/fields/geometry คงเดิมตามขอบเขตที่ระบุ และไม่มี visible clipping,
overlap, missing ending. ยังยอมให้ line/page breaks ต่างจาก Core.

**Correction to V8 reporting:** retained V8 review เคยระบุ pages 52, 56,
57, 60, 61, 64, 65, 67, 72, 73, 75 ว่าขาดหัว และยก V7 52/57 ว่าเป็น
ปัญหาเดิม. ตรวจ current PDFs ทั้งหมดใหม่ด้วย source-bounded header geometry
และภาพ full-page/pixel corroboration พบว่า **V8 ขาดจริงเฉพาะ 52**:
54/55 requirement pages มีหัว; V7 มีครบ 55/55 และ Core ครบ 54/54.
รายงาน V8 ที่กว้างกว่านี้และการจัดเป็น pre-existing general behavior ผิด.
เก็บ original reports ไว้พร้อม correction นี้ ไม่ย้อนแก้ให้เหมือนตรวจถูกตั้งแต่แรก.
ไม่มีเหตุสรุปว่าเป็น generic Word bug จากรายงานเดิม.

Source/header checks: requirement tables 26 ชุดมี `repeatHeaderRows=true`,
header count 1 และ row0 `tblHeader` enabled ถูกต้อง; ไม่มี manual page break,
floating/nested table, vertical merge หรือ oversized header. จุดจริงคือ
table177 / row2 / cell1 / global paragraph1395, REQ0041: 2,012 chars,
73 text segments และ 72 line breaks ภายใน paragraph เดียว. Exact line
397 twips ทำให้ minimum text height 1,449.05 pt เทียบ body 689.7 pt.
V8 paragraph นี้ `keepNext=true` ต่อ icon; V7 เดิม false. V8 row คร่อม 51–53
และหัวหายช่วงกลาง 52. Hypothesis: oversized keep-with-next group ทำให้ Word
เลือก pagination path ที่ไม่ repeat header. ยังต้องยืนยัน causal effect ใน Word.

Minimal trial จะคืน `keepNext=false` เฉพาะ paragraph นี้ก่อน โดยไม่แก้ header
flag/row/table หรือโครงสร้าง. หากหัวและ icon อยู่ถูกที่ทั้งคู่ ไม่ต้องเปลี่ยน
paragraph structure. หากจำเป็น fallback จะแบ่งเฉพาะข้อความนี้ตาม existing
semantic boundaries เป็น native paragraphs และผูกเฉพาะท้ายข้อความกับ icon.
ไม่ใช้ `cantSplit` กับแถวยาวเกินหน้า: Microsoft
[implementation note](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oi29500/a55188f7-2443-4c17-ba5a-75999085bab4)
ระบุข้อจำกัดการแสดง overflowing row ซึ่งไม่เหมาะเป็นทางแก้กรณีนี้.

Discovery locators: `tuning-v9/discovery/{header-source,pdf-header-map}.json`,
source-bounded scanner `tuning-v9/scripts/scan_requirement_headers.py` และ
fresh corroboration renders ที่ไม่ทับ V7/V8. Header ROI ของ V7 52 / V8 53/56
มี gray fill 38,609 pixels; V8 52 มี 0. Fresh images ตรง retained PNG bytes;
ไม่มี render-cache inconsistency. สถานะเริ่มต้น: one-property trial pending;
ผลทดลองและการรับผลอยู่ด้านล่าง.

### V9 single-property candidate and preservation

สร้าง `outputs/srs-header-repeat-v9.docx`, 1,084,112 bytes, SHA256
`a23be445751f2fdf593f9fc37a966da898a98c9318e4abb8459a77876afe4743`.
คืน `keepNext=false` เฉพาะ paragraph1395 ของ REQ0041; ไม่แก้ paragraph
boundaries, line breaks, header flags, row/table properties หรือ fonts.
Raw XML เพิ่ม 14 bytes จาก explicit false. การผูกข้อความกับ icon อีก 362 จุด
และ heading/meeting changes ของ V8 คงเดิมทั้งหมด.

Independent saved-package check ผ่าน 9,787 assertions. เลือก target จาก
REQ0041 first-cell identity แยกจาก builder manifest; inverse one property
คืน entire V8 canonical XML ได้. อีก 124 ZIP payloads และ compressed records
ตรง V8 ทุก byte; raw splice inverse คืน source XML ทุก byte. โครงสร้างเดิม
2,775 paragraphs / 4,609 runs / 200 tables / 933 rows / 1,932 cells /
371 drawings / 198 hyperlinks / 922 breaks / 7 sections / 396 bookmarks /
199 main field instructions คงเดิม. Ordered text, all run/CS formatting,
fields, media และ story parts ไม่เปลี่ยน.

### V9 rendered acceptance and comparison

เจ้าของแปลงผ่าน Word for Microsoft 365 เป็น
`outputs/srs-header-repeat-v9.pdf`, 100 pages / 1,014,742 bytes, SHA256
`30f5e154bfec2c698fc2fc55f839b3ecef7203cee8bb39bb76d1bbab2e92abbd`.
จำนวนหน้าเท่า V8; Core reference ยัง 98 หน้า. ไม่สร้าง fallback candidate
เพราะ single-property trial ผ่านทั้ง header และ icon behavior.

| Criterion | Evidence and result |
| --- | --- |
| Repeat requirement-column headers | Source-bounded geometry scan พบครบ 55/55 pages 46–100, ไม่มี missing page; gray header bands ใน rendered PNG corroborate ทุกหน้านี้ |
| Actual defect at 52 | V8 header ROI gray pixels 0 → V9 38,609; crop/full-page inspection ยืนยัน Req no./Features List/Remark อยู่เหนือ continuation text และไม่ทับกัน |
| REQ0041 content/icon | ยังคร่อม 51–53; ท้ายข้อความและ blue icon อยู่ร่วมกันบน 53. ไม่ต้องเพิ่ม paragraph หรือบังคับ row ให้อยู่หน้าเดียว |
| Other V8 fixes | Meeting numbers/headings/known icon cases คงผลเดิม; changed-page review ไม่พบ visible glyph boxes, clipping, overlap หรือ icon-only ending ที่เกิดใหม่ |
| Body images | 371 ordered decoded placements/soft masks คง identity/order; 24 placements เปลี่ยนตำแหน่งเฉพาะ 53–55 เมื่อข้อความ reflow |
| TOC/page fields/banner | 198/198 links resolve, printed pages และ source labels corroborate; cover ซ่อนเลข, pages 2–100 เป็น Page p of 100 และ 99 banners ถูก policy |

เปรียบเทียบ rendered raster ทั้ง 100 หน้า: 87 หน้าเหมือน V8 ทุก pixel.
ใช้ V8 visual evidence ของหน้าที่ไม่เปลี่ยนซ้ำได้ตาม workflow evidence reuse;
ไม่อ้างว่าเปิดใหม่ครบ 100 หน้า. ตรวจ full V9/V8 ทุก 13 หน้าที่ภาพต่าง และ
Core counterparts สำหรับช่วงที่เปลี่ยน. Changed pages คือ 52–55 และ
60/61/64/68/69/72/77/79/86. สี่หน้าแรกมี header/row reflow; อีกเก้าหน้ามี
ความต่างแคบใน feature text: character sequences/font names/sizes/Y positions
ตรง V8 และ Latin-word X positions ต่างสูงสุด 0.0312 pt
(ประมาณ 0.052 pixel ที่ 120 dpi, 26–102 changed pixels ต่อหน้า).
ไม่พบ visible regression ในการตรวจภาพคู่. Raw pypdf page text ตรง V8
96/100 หน้า; ต่างเฉพาะ 52–55. เป็น corroboration ไม่ใช่ every-glyph proof.
Header acceptance ใช้ geometry + rendered pixel/visual evidence ใหม่แทน
classification ผิดในรายงาน V8 ไม่ใช้ evidence reuse เพื่อคงข้ออ้างผิดนั้น.

### V9 decision and limits

**Decision: PASS for this bounded repeated-header correction.** เปลี่ยน property
เดียวแล้วหัวหน้า 52 กลับมา ขณะที่ text/icon relation ยังถูกต้อง จึงยืนยัน trigger
เชิงทดลองจาก oversized keep-with-next group ที่ V8 เพิ่ม; ไม่สรุป internal
Word algorithm หรือ universal limit. ไม่ต้องเปลี่ยน PDF หรือ source structure.

V9 เป็น specific frozen-SRS prototype; ยังไม่ใช่ generic oversized-paragraph
policy หรือ product implementation. General wrapping/row height/border/TOC
appearance และความต่าง 100 vs Core 98 หน้ายังมีตามผลก่อนหน้า; full layout
fidelity/product readiness ยัง NOT ACCEPTED. ไม่มี Word performance benchmark
หรือข้อสรุปสาเหตุการประมวลผลช้าจากผลรอบนี้. หยุด candidate/review cycles
หลัง acceptance; งานถัดไปจึงค่อยจูน spacing/typography ตาม scope ใหม่.

Locators ใต้ `tuning-v9/`: `generation.json`,
`scripts/{build_header_trial,check_package,scan_requirement_headers}.py`,
`preflight/independent-package-check.json`,
`word-review/{header-geometry,comparison,render-diff,root-observations,root-review}.json`,
`qa/candidate/manifest.json`, `qa/details/` สำหรับ header corroboration และ
`qa/reviews/{changed-pages,tiny-diff-pages}.json`. Verification เขียนเฉพาะ
fresh QA outputs; source/V8/V9 hashes ตรวจซ้ำหลัง review.

## V10 separate line-spacing and row-height trials

คำขอเจ้าของ 2026-10-21 อนุญาตวัดและจูนระยะบรรทัดกับความสูงแถวทีละปัจจัย
ใน SRS เดิม แล้วเทียบ PDF. ทั้งสอง branches ใช้ frozen V9 DOCX/PDF เป็น
baseline เดียวกัน; ไม่สร้าง combined candidate หรือแก้ PDF/reference/data/product.
Owner/roles/single-room unregistered mode ตาม V9; execution IDs N/A.
Work Size medium / Risk routine. Work authority: read-only measurement ก่อน
bounded prototype implementation แล้ว verification ที่ไม่แก้ candidate.
ใช้ current host/session model ไม่มี override หรือ separate WORK.

Document Budget: แผนนี้ไฟล์เดียว; scripts/measurements อยู่ `tuning-v10/`.
Proof Budget: สอง independent full-SRS candidates (line-only / row-only),
package containment/inverse checks, manual Word export อย่างละรอบ, source-
aligned spacing metrics และ full-output QA พร้อม evidence reuse เฉพาะภาพ
ที่ตรง baseline. เก็บ/ปฏิเสธแต่ละ factor จากผลจริง ไม่จำเป็นต้องรับทั้งสอง.
ไม่ปรับจนได้ 98 หน้า ไม่รวมผลก่อนรู้ผลของแต่ละตัว ไม่แก้ font size/width/
CS formatting หรือ grouping fixes ของ V8/V9.

Discovery ระบุ body lineHeightPt 19.84; nearest integer twip คือ397=19.85 pt
ซึ่งใกล้ค่าที่ source กำหนดแล้ว. LINE branch จึงเป็น calibration control ลด
เพียงหนึ่ง twip 397→396=19.80 pt ใน1,574 nonempty direct-text paragraphs
(1,530 table +44 body), ไม่มี pStyle/drawing/instrText; ไม่แก้368 empty
paragraphs ที่อาจกำหนด minimum row content. Prediction: อาจไม่ดีขึ้นและ
ควรคง397 หาก measured pitch/visual fidelity แย่ลง.

ROW branch: V9 ไม่มี `trHeight` ทั้ง933rows. แถวสั้นหลาย families สูงกว่า
Coreราว0.44–0.60 pt จาก natural content/padding/border budget; ไม่สามารถ
ลดด้วย minimum row height ที่ต่ำกว่าความสูงธรรมชาติ. ทดลองลด explicit
cell top/bottom padding อย่างละ5twips=0.25pt ใน1,830cells/887rows/183tables
ที่มี four visible `single` borders size4, color666666/000000 และ padding
มากกว่า5twips. รวม revision/meeting/emptyfeature/requirement families;
ไม่รวม white/decorative cover/approval/legend/definition tables. คง line
properties และ borders เดิม; rows auto-expand ได้ ไม่ใช้ exact height/cantSplit.

Acceptance: วัด line pitch และ row-border height ของ source-matched content
แยกจาก glyph ink height; ระบุ factor ที่ใกล้ Coreขึ้น/แย่ลงและข้อจำกัดให้ชัด.
Ordered content/run properties/fields/images/source structure คงเดิม;
header/heading/icon fixes ยังคงได้ผล และไม่มี visible clipping/overlap/
missing ending. Page/line breaks เปลี่ยนได้. Unknowns: Word quantization,
glyph centering, long-row reflow และ inline-image baseline growth อาจทำให้
row/pitch ไม่ตรงทุก family; ห้ามอ้าง universal geometry หรือ product readiness.

### V10 saved candidates and preservation

เจ้าของส่งออกผ่าน Word for Microsoft 365 ครบทั้งสองไฟล์แล้ว. แต่ละไฟล์แยก
จาก V9 โดยตรง ไม่ได้นำ LINE และ ROW มารวมกัน.

| Factor | DOCX / bytes | Word PDF / bytes / pages |
| --- | --- | --- |
| LINE | `outputs/srs-line-spacing-v10.docx` / 1,084,593 | `outputs/srs-line-spacing-v10.pdf` / 1,017,453 / 100 |
| ROW | `outputs/srs-row-height-v10.docx` / 1,084,286 | `outputs/srs-row-height-v10.pdf` / 1,014,540 / 99 |

SHA256 ของ LINE DOCX/PDF ตามลำดับ:
`2fa77bf326af5e6dc91da31af2f977a1af7f4d550d23e53677ca4b2d531d1215` /
`ab8f32d9698cf252486d780db5393ae7e7e143161c18a996d9170771b35b881e`.
SHA256 ของ ROW DOCX/PDF:
`4f4f899d2721775438728924d3a10ad166bf19445b8beb26b4332a29fb329057` /
`6c9ed7824972ee5a71878c63854e73f8c9ae6926639c60db9013a02fde665fd4`.
Baseline V9 ยัง 100 หน้า และ Core reference ยัง 98 หน้า; จำนวนหน้าอย่างเดียว
ไม่ใช่เกณฑ์รับ factor.

Independent package checks ผ่าน LINE 13,717 / ROW 20,563 assertions.
LINE เปลี่ยนเฉพาะ 1,574 line attributes; ROW เปลี่ยนเฉพาะ 3,660 padding
attributes ใน 1,830 cells. กลับค่าปัจจัยที่เปลี่ยนแล้วคืน V9 canonical XML
ได้ทั้งเอกสาร; raw splice inverse คืน source XML ทุก byte. อีก 124 ZIP
payloads/ compressed records ตรง V9 ทุก byte. โครงสร้างเดิม 2,775 paragraphs /
4,609 runs / 200 tables / 933 rows / 1,932 cells / 371 drawings คงเดิม
พร้อม ordered text, CS/font/emphasis, fields และ relationships. V9 paragraph1395
ยัง `keepNext=false`; grouping properties จุดอื่นทั้งหมดไม่เปลี่ยน.

### V10 measurements and rendered comparison

| Criterion | LINE result | ROW result |
| --- | --- | --- |
| Matched line pitch | คลาดกว่า V9: ผลรวม absolute mean-pitch error ของ Customer/Company สองกลุ่ม 0.009 → 0.087 pt | line policy ไม่เปลี่ยนทั้งเอกสาร; measured mean pitch ต่าง V9 ไม่เกิน 0.004 pt ในสามกลุ่ม เป็น export/position phase ไม่ใช่ line-setting change |
| Whole-row border height | 27 common rows: mean error 0.457 pt / max 0.56 pt เทียบ V9 0.514 / 0.64 pt | mean error 0.022 pt / max 0.12 pt; ดีขึ้นใน revision, meeting, empty-feature, requirement header และ short/multiline requirement samples |
| Requirement headers | geometry + rendered gray-band corroboration ครบ 55 pages 46–100 | ครบ 55 pages 45–99 |
| Functional fields/images | TOC 198/198 resolve และ printed page/labels corroborate; page fields/banner ถูก policy; body images 371 ordered decoded identities/soft masks คงเดิม | ผ่านเกณฑ์เดียวกัน โดย footer เป็น Page p of 99 |
| Visual content safety | ไม่พบ visible clipping, overlap, glyph boxes หรือ missing ending ใน full-page review | ไม่พบปัญหาดังกล่าว แต่มี grouping regression ตามรายละเอียดด้านล่าง |

Row metrics ใช้ source-matched content และ border centers ไม่ใช่ glyph ink
height หรือ same-index page assumption. Samples เป็น 27 whole rows ร่วมกัน
จาก revision 4 / meeting1 16 / empty-feature 2 / requirement 4 / header 1.
REQ0004 ถูกตัดออกจาก aggregates ของทุก branch เพราะ ROW split 45→46;
ห้ามใช้ความสูง fragment แรกแทน whole logical row. `row-height-v2.json`
แก้ aggregate ของรายงานแรกและเก็บรายงานเดิมไว้. Line metrics ใช้กลุ่มเดียวกัน
ทั้งสองฝั่ง; Development list ของ LINE คร่อม 51→52 จึงไม่รวม full-span
aggregate ของทั้ง LINE/V9. ใช้ `line-pitch-final.json` แทน aggregate แรก.
ตัวเลขนี้เป็น sample evidence ไม่ใช่การวัดครบทุก paragraph/row.
Row-border height ที่ใกล้กันไม่ได้แปลว่า text baseline ตรงกัน: Latin R ของ
REQ labels สี่แถวที่วัดใน ROW ยังต่ำกว่า Core เฉลี่ย 1.321 pt เทียบ V9
1.591 pt. จึงยังไม่รับรอง vertical text alignment หรือทุก glyph metric.

ตรวจ full candidate pages ใหม่ครบ LINE 1–100 และ ROW 1–99 ที่ 120 dpi;
ใช้คู่ Core/V9 ตาม source content สำหรับจุดเปลี่ยน. ไม่อ้างว่าเปิด Core ใหม่
ครบ 98 หน้า: reuse frozen source QA เดิมร่วมกับ new paired views/metrics.
Raster comparison พบ LINE ตรง V9 ทั้งหน้า 8 หน้า; ROW ตรงเพียง cover.
ส่วน body-only ที่ตรงไม่นับเป็น whole-page equality เพราะ footer/reflow ต่าง.
Repeated meeting numbers คงถูกต้อง รวม source ที่ไม่มี meeting11.
REQ0041 และ known icon endings ยังคงมีข้อความท้ายอยู่กับ icon; long rows
ข้ามหน้าได้และ repeat headers ไม่หาย. Short-row pagination ยังมี tradeoffs:
LINE แยก REQ0043/0055/0116 เพิ่ม; ROW แยก REQ0004/0209 แต่เก็บ REQ0190/0270/
0293/0331 ไว้ทั้งแถวได้ในจุดที่ตรวจ. ไม่ถือทุก row split เป็น content loss.

**พบ regression ที่ ROW 44→45:** หัวข้อ `15.4 Element SRS` และคำอธิบาย
บรรทัดแรกอยู่ท้าย 44; คำอธิบายที่เหลือกับตารางอยู่ 45. Core 44 และ V9 45
เก็บหน่วยนี้ครบหน้าเดียว. เนื้อหายังครบและไม่ใช่ title-only orphan แต่
heading-description-table relationship แย่ลงจาก V9. Lower padding ทำให้
cumulative pagination เปิดเผยว่าการผูกข้าม multi-line description ยังไม่ครบ;
source inspection ยืนยัน description ยัง `keepNext=true` แต่ `keepLines=false`
เหมือน V9 จึงไม่ได้ป้องกันการแยกภายในย่อหน้า. ไม่อ้างว่า grouping properties
ถูกเปลี่ยน. ไม่มีรอบแก้ grouping เพิ่มใน V10.

### V10 decision and evidence boundary

**PASS for bounded measurement/comparison; LINE rejected; ROW geometry
improvement confirmed, whole-document replacement NOT ACCEPTED.** คง line397
ของ V9; เก็บ ROW compensation เป็นผลทดลองสำหรับพัฒนาต่อเมื่อแก้และยืนยัน
grouping regression แล้ว. V9 ยังเป็น baseline ล่าสุดที่รับ bounded fixes ก่อนหน้า;
ไม่ได้อ้างว่า V9 หรือ V10 พร้อมเข้าระบบจริง. ไม่รวมสอง factors ไม่ปรับ PDF
ต้นแบบ ไม่แก้ source data/template หรือ product runtime. หยุดสอง candidate
cycles ตาม Proof Budget หลังบันทึกผลและข้อจำกัด.

Locators ใต้ `tuning-v10/`: `scripts/{build_factors,check_factors,compare_line_pitch}.py`,
`discovery/{line-spacing,row-height}.json`, `discovery/measure_row_height.py`,
`row/scripts/measure_rendered_rows.py`, `{line,row}/generation.json`,
`{line,row}/preflight/independent-package-check.json`,
`{line,row}/word-review/{comparison,header-geometry,line-pitch-final}.json`,
`row/word-review/row-height-v2.json`, `{line,row}/qa/candidate/manifest.json`,
`qa/{render-diff,header-pixel-corroboration,15.4-source-properties}.json`, `qa/reviews/` และ
`word-review/root-review.json`. Original intermediate reports คงไว้พร้อม
superseding observations; verification เขียน fresh QA outputs และตรวจ hashes
หลัง review. Source anchors ที่หาไม่ได้ 550/933 LINE และ 549/933 ROW เป็น
ข้อจำกัดของ unique-text mapping ไม่ใช่หลักฐานว่า content หาย. ไม่มี claim
every-glyph equality, complete border/TOC appearance parity หรือ Word speed.

## V11 cell baseline and semantic grouping investigation

เจ้าของอนุญาตเริ่มสองก้อนแรกหลังทบทวนความต่าง: แยก row extent ออกจาก
text baseline และรักษา heading–short description–table เป็นหน่วยตามโครงสร้าง.
เป็น bounded disposable prototype ในห้องเดิม ไม่ใช่ product implementation.
Owner/roles: Project Control Planning Partner / Evidence Reviewer /
Documentation Synthesizer; future writer owner คือ Core แต่ไม่แก้ Core รอบนี้.
Work Size medium / Risk routine; execution/Phase/Checklist IDs N/A.
ใช้ current host/session model ไม่มี override; helpers อยู่ภายในงานห้องเดียว.

Allowed mutation: แผนนี้, `tuning-v11/` และ candidate outputs ใหม่ใต้ experiment
root เดิม. ห้ามเปลี่ยน source/resolved/reference/V9/V10, production dependencies,
PDF behavior, runtime, maps หรือ published state. Document Budget: แผนเดิมไฟล์เดียว.
Work authority เริ่ม discovery แยกสองสาเหตุ ก่อน bounded candidate creation และ
verification ที่ไม่เปลี่ยน candidate. Current Truth Snapshot อ่านใหม่จาก validated
canonical model แล้ว; DOCX ใช้ explicit request และแผนนี้เป็น inline authority.

Proof Budget: ไม่เกินหนึ่ง full-SRS grouping candidate จาก frozen V10 ROW
และหนึ่ง short baseline probe document จาก SRS เดิม, Word export อย่างละรอบ.
Grouping เลือกตาม heading/paragraph/table properties และ estimated height guard;
ไม่เลือกด้วยชื่อ SRS, เลขหัวข้อ/REQ หรือ global paragraph index. ต้องมี positive
และ negative controls สำหรับ long text/oversized group. Baseline ต้อง trace
font/line placement ก่อนเลือกปัจจัย; ไม่ยกข้อความทั้งหมดด้วยค่าแก้เฉลี่ย 1.32 pt
และไม่ลด line397 ที่ V10 ปฏิเสธ. หากยังแยกสาเหตุไม่ได้ ให้เก็บเป็น unknown
แทนการสร้าง full-SRS baseline correction ที่ไม่มีหลักฐาน.

Acceptance: ตรวจ selector และ mutation containment, ordered content/formatting/
fields/images คงเดิมใน full candidate, ไม่ทำให้ oversized REQ0041 chain กลับมา;
หลัง Word export ตรวจ 15.4 และ counterparts, all repeated requirement headers,
known icon endings และ full output coverage ตาม reuse boundary. Short baseline
probe ต้องวัดกรอบแถว/line pitch/text baseline แยกกัน พร้อมข้อความไทย/อังกฤษ
และรูปแบบที่มีใน SRS. Package PASS ไม่ใช่ rendered acceptance. Word rendering
ยังใช้เจ้าของช่วย export ตามทางที่ตกลงไว้ ไม่รัน conversion อัตโนมัติซ้ำ.

### V11 discovery and prepared Word checkpoint

Baseline trace จาก frozen Core package พบการคำนวณ
`A+(max(lineHeight,A+D)-A-D)/2` โดยเริ่ม A/D จาก face ascender/descender
แล้วขยายตาม shaped ink. Sarabun ทั้งสี่ faces มี hhea/Typo1068/-232 ที่ UPM1000.
Body11pt / source line19.84pt / source top padding3pt ให้ baseline17.518pt,
ตรง Core label ที่วัด17.51884pt. DOCX mapper ส่ง font/line/padding แต่ไม่มี
การคำนวณ baseline นี้; Word เป็นผู้เลือกตำแหน่งภายในบรรทัด. จึงยืนยันความต่าง
ของ baseline policy ที่ boundary ได้ แต่ยังไม่ระบุ internal Word font metrics.
ไม่สรุปว่า OS2Win metrics เป็นสาเหตุจากการเห็นค่าใน font table เพียงอย่างเดียว.

Short probe ใช้หนึ่ง DOCX วาง control3หน้าและ adjusted3หน้า. เปลี่ยนเฉพาะ
cell top/bottom55/55→30/80twips: ย้าย origin ขึ้น1.25pt โดยคง nominal sum
110twips. มี32 controlled cases ต่อชุด: single/multiline, Latin/Thai/mixed,
regular/bold/italic/boldItalic, 11pt line397 และ controlled13pt line480;
มี natural SRS header+REQ0001/0002/0005 และ icons แยกไว้. Font13/emphasis
บางกรณีเป็น labelled controls ไม่ใช่ claim ว่าพบทุกกรณีตามธรรมชาติใน SRS.
Core nominal13pt baseline20.434pt ยังต้องแยกวัดจาก11pt หลัง export.
การคงผลรวม padding ไม่รับรอง rendered row height: ต้องตรวจ border extent,
line pitch, base-letter baseline และ ink clipping แยกกันหลัง Word.

Grouping selector พบ32 plain direct-body descriptions ระหว่าง protected
heading chain กับ table โดยไม่ใช้ข้อความหัวข้อ/เลขREQ/source node ID/index
เป็นเกณฑ์. Source correspondence ของ32จุดตรง resolved sequence ตามลำดับ;
index/node IDs เป็น locator/annotation ภายหลังเท่านั้น. มี nominal multiline
ปัจจุบันหนึ่งจุดคือ15.4; อีก31จุดเป็น counterparts ที่เลือกด้วยกฎเดียวกัน.
Guard ใช้ frozen Sarabun advance estimates +25% reserve +หนึ่งบรรทัดต่อ
paragraph; description group ไม่เกิน¼ body และ heading+description+leading
table group ไม่เกิน½ body. เป็น conservative heuristic ไม่ใช่ formal Word
fit bound. ไม่รองรับ unresolved fonts/complex content; table-cell paragraphs
ถูก exclude จึงไม่แตะ oversized REQ0041. Meaningful RED จาก frozenROW
ยืนยัน15.4ยังไม่ protected;16 structural/source controls PASS รวม renamed
labels, long/broken/field/drawing/list/section/nested-table/oversized groups.

สร้าง full trial `outputs/srs-semantic-grouping-v11.docx`, 1,084,318 bytes,
SHA256 `39a7de89643f901c40a995364b5e8848af73c19b8152035e9178f9ad10d5e0ff`.
เปลี่ยน32 `keepLines=false→true` ตาม selector เท่านั้น; existing keepNext,
V10ROW padding/line/font/fields/media และ V9 oversized-cell correction คงเดิม.
Short trial `outputs/srs-cell-baseline-probes-v11.docx`, 974,943 bytes,
SHA256 `851e448458769c4cfa04fd79d83cad862c8dd6c01abde1ccb33d90e19740bdf5`.
6 planned pages; ไม่มี active band references/TOC ใน probe. สอง candidate
เป็นคนละการทดลอง ไม่เพิ่ม baseline redistribution ลง full SRS.

Locators ใต้ `tuning-v11/`: `discovery/cell-baseline.json`,
`grouping/{structural_selector,build_candidate,test_structural_selector}.py`,
`grouping/{discovery,baseline-red,selector-controls-final,generation}.json`,
`baseline/scripts/build_probe.py`, `baseline/generation.json` และ
`verification/` สำหรับ independent saved-package checks. Word-rendered
acceptance ยัง PENDING; ห้ามใช้ package/static checks ประกาศ15.4หายหรือ
baselineใกล้ขึ้นแล้ว. Source/Core reference/V9/V10 และ production คงเดิม.

Independent review พบ initial probe มีลำดับ CT_PPr ของ diagnostic captions
ผิดห้าจุด (`pageBreakBefore` มาก่อน `keepNext`). เก็บไฟล์/รายงาน FAIL เดิมไว้
และแก้โดย authoring owner ก่อนส่ง Word เป็น
`outputs/srs-cell-baseline-probes-v11-r1.docx`, 974,938 bytes, SHA256
`26407a9ac3677b695db8991ad7442aa42937aabc7a407d191365e9eacb70841b`.
**ให้ใช้ r1 เท่านั้นสำหรับ owner export.** Repair ย้าย child order เฉพาะป้าย
ห้าจุด; measurement tables และทุก run ตรง original canonical XML. อีก124
ZIP payloads คงเดิม. ไม่ใช่ baseline factor ใหม่หรือ Word export cycle เพิ่ม.
Reference สำหรับ child sequence:
[python-docx schema excerpt](https://github.com/python-openxml/python-docx/blob/master/docs/dev/analysis/features/text/paragraph-format.rst#schema-excerpt).

Saved-package checks: `verification/grouped-package.json` PASS4,996 assertions;
`verification/baseline-probe-package-r1.json` PASS300 assertions. Grouping มี
exact raw/canonical XML inverse และอีก124 payload/compressed records ตรง ROW;
ordered text/runs/CS/fonts/fields/images คงเดิม. Probe มี4table pairs: undo
padding/caption/start-marker differences แล้วตรงกัน รวม natural excerpts
ที่ normalize เฉพาะ unique nonvisual drawing IDs; image data/size/order คงเดิม.
มี6unique icon appearances, one section, six logical page blocks/five later
page starts, ไม่มี active header/footer references หรือ unsafe row/keep chain.
Unused source story relationships42รายการยัง valid และคงเดิม; ไม่ตีความว่า
มี active band จาก relationship presence. `cantSplit=off` ไม่ใช่ enabled.
Original verifier reports เก็บไว้พร้อม semantic correction สองข้อนี้.

ยังไม่ตรวจภาพ DOCX ผ่าน Word ใน checkpoint นี้. ต้องรับ PDF ของ full SRS
และ r1 probe ก่อนวัด/ตรวจจริง; ไม่แสดง static checks เป็นผล layout PASS.
Additional locators: `baseline/{generation-r1.json,scripts/repair_probe_order.py}`,
`verification/baseline-probe-package-sequence.json` สำหรับ pre-repair failures
และ `preflight/root-review.json` สำหรับ input/font/Core hashes และ pending criteria.

### V11 owner Word results and acceptance

เจ้าของแปลงทั้งสองชุดผ่าน Word for Microsoft 365 แล้ว. ใช้ full SRS
`outputs/srs-semantic-grouping-v11.pdf`, 99 pages / 1,014,548 bytes, SHA256
`f6bd6bdbcf6227a10c95cae7b9eb9bbc9bd8b8274a285ac24f24d2476aa44f11`
และ final probe `outputs/srs-cell-baseline-probes-v11-r1.pdf`, 6 pages /
85,110 bytes, SHA256
`3b7121b1449d626b37bbab0385661647f75ebd9e0a447c1fb563966fea99d638`.
DOCX ยังตรง hashes ก่อนส่ง Word; ไม่มี candidate repair ระหว่าง verification.

**Grouping: PASS for this bounded structural policy.** Locate target relations
ได้ครบ32/32ตาม source/base/candidate โดยแยกการหา text แบบ lossy ออกจาก
package/visual proof. ทั้ง32มี heading chain, complete short description,
paired table header และ first body line อยู่หน้าเดียวกัน. อีก31จุดตรง V10ROW
geometry เดิม; จุด15.4เปลี่ยนจาก heading44/description44–45/table45 เป็น
ทั้งหัวข้อ คำอธิบาย2บรรทัด และตารางทั้งชุดอยู่45. Core เก็บหน่วยนี้บน44;
ไม่ได้อ้าง physical page parity. Source บางกลุ่มเองแยกหน้าเดิมอยู่แล้ว จึง
บันทึก source relations ไม่ใช้ชื่อหัวข้อเป็นตัวบังคับเลขหน้าหรือผลลัพธ์.

Rendered RGB ทั้ง99หน้าเทียบ V10ROW:95หน้าเหมือนทุก pixel รวม bands;
reuse full-page QA ของ V10ROW เฉพาะ95หน้านี้. เปิด full candidate ใหม่ครบ
4หน้าที่ต่างคือ8/44/45/46 พร้อม source/base counterparts และ32target pairs.
หน้า8เปลี่ยน TOC15.4 printed page44→45 ถูกต้อง;44เหลือพื้นที่ท้ายหลัง15.3
ตามการย้ายหน่วย;45ไม่มี orphan description;46รับ item2ของREQ0004เพิ่มจาก
45 แล้วตามด้วย item3+icon. REQ0004ยัง split45–46เหมือนเดิมแต่ fragment
boundary ต่างหนึ่งบรรทัด ไม่พบ visible clipping/overlap/glyph boxes หรือ
icon-only ending ใหม่. ไม่อ้างว่าเปิด candidate ใหม่ทุก99หน้า.

Functional checks PASS:198/198 TOC links resolve/printed page match และ
source labels corroborate ที่ link/target ผ่าน declared lossy normalization;
coverซ่อนเลข,98 non-cover page fields/banners ถูก policy;371 ordered body
image data/soft masks ตรง frozen WordV3. Requirement headers geometry และ
actual pixels ครบ55pages45–99/76bands. Meeting headers24occurrences คงเลข
source1–10,12–16. REQ0041 text2012codepoints corroborate across50–52ภายใต้
lossy normalization, final text+iconอยู่52;50–53ตรง V10ROW ทุก pixel.
ไม่มี raw Unicode/every-glyph claim หรือเอา unknown anchors มาเรียก content loss.

**Baseline probe: PASS empirical origin-shift calibration; uniform Core parity
NOT ACCEPTED.** ตรวจ6full pages144dpiและ6detail crops288dpi. เปรียบเทียบ
32controlled cases/4table pairs พร้อม native SRS rows: row-border height delta
ทุกคู่0.000pt, text baselines ขึ้น1.20หรือ1.32pt, pitch deltaสูงสุด0.12pt
ภายใน declared export precision. Font identity/face, paired text/CS/emphasis
และ images คงเดิม; Word subset font sizes ที่วัด11.04/12.96pt. ไม่พบ Thai
upper/lower marks clipping, overlap หรือ icon หาย. Native icons ยังคง100×16pt
และขยับขึ้น1.25pt โดย decoded resource ตรงกันทั้งสองชุด.

| Probe stratum | First-line residual after redistribution | Final-line residual | Boundary |
| --- | ---: | ---: | --- |
| 11pt / line397, 18 controlled cases | +0.00199…+0.142005pt | +0.00199…+0.182005pt | เทียบ nominal Core formula; Thai regular3line เป็น worst case ไม่เฉลี่ยซ่อน |
| 13pt / line480, 14 controlled cases | +0.56599…+0.596pt | +0.56599…+0.596pt | controlled style, ยังไม่ตรง Core model; แยกจาก11pt |
| Native REQ0001/0002/0005 Latin R labels | +0.00115 / +0.12115 / +0.12115pt | single line | เทียบ actual Core baseline17.51884pt ที่วัดไว้ |

บาง11pt residualและทุก13pt residualยังเกิน0.12pt; เก็บ individual findings
ใน `nominalAlignmentResidualsOutsideTolerance` ไม่ตีเป็น exact alignment PASS.
Probe พิสูจน์ว่าการกระจาย padding เปลี่ยน origin โดยไม่เปลี่ยนความสูงแถวใน
ชุดนี้ แต่ไม่ได้ระบุ internal Word metric algorithm หรือให้ universal shift.
Core nominal formula อาจต้องขยาย ascent/descent เมื่อ shaped ink เกิน face
metrics; Thai PDF extraction จัด combining marks ใหม่ได้ จึงใช้ paired paint
order และภาพแยกจาก normalization. ไม่อ้าง font subset bytes เท่าต้นฉบับ.

Decision: ใช้ V11 grouping เป็น latest bounded-fix experimental baseline ต่อ
จาก V9/V10ROW ได้ในขอบเขตที่ตรวจ. ยังไม่รับ full document fidelity/product
readiness. Baseline redistribution ยังอยู่เฉพาะ short probe ไม่ใส่ full SRS.
งานถัดไปควรแยก calibration ตาม font size/line style และผล multiline ก่อน
ขยาย; ไม่ลด line397, ไม่บังคับ98หน้า และไม่ปรับ PDF/source/runtime.
หยุดรอบทดลองตาม Proof Budget หลังบันทึกผลจริง; ไม่สร้าง candidate เพิ่ม.

Word locators ใต้ `tuning-v11/`: `grouping/qa/candidate/manifest.json`,
`grouping/word-review/{render-diff,target-relations-inventory}.json`,
`grouping/qa/reviews/{target-and-pages-044-045,root-changed-pages}.json`,
`baseline/word-review/baseline-word-review.json`, `baseline/qa/candidate/`,
`word-review/functional/{functional-review,comparison,header-geometry,header-pixel-corroboration,source-target-observations}.json`
และ `word-review/root-review.json` สำหรับ acceptance coverage/input hashes.
Pre-export reports คงสถานะเดิม ไม่แก้ย้อนหลังให้ดูเหมือนตรวจ Word แล้ว.

## V12 font size and line spacing calibration

Owner request: แยกจูนตำแหน่งข้อความตามขนาดฟอนต์กับระยะบรรทัด โดยคง
ความสูงแถว ใช้ SRS เดิมในพื้นที่ทดลอง แล้วเทียบ PDF อีกครั้ง. ไม่แก้ PDF
ต้นแบบ ข้อมูลต้นฉบับ หรือระบบจริง. ใช้ latest bounded-fix full SRS
`outputs/srs-semantic-grouping-v11.docx` เป็น immutable excerpt source;
ไม่ใส่ redistribution ลง full SRS ก่อนพิสูจน์ short probe.

Authority/owner: bounded explicit request + แผนเดิมนี้; Planning Partner /
Evidence Reviewer / Documentation Synthesizer. Project Control owns this
record; future product writer owner remains Core without product edits here.
Execution/Phase/Checklist IDs N/A for this single-room continuation. Work Size
medium, Risk Tier routine. Model decision: retain current host/session model
for bounded inline discovery/prototype and inherited helper review; no new
registered PLAN/WORK room or model override.

Markdown gate: update this existing canonical plan only; do not create a second
shared plan/report, change maps, or promote prototype findings into runtime truth.
Allowed mutations: this plan, new `tuning-v12/` diagnostics/scripts, and one new
`outputs/srs-font-line-calibration-v12.docx`. Forbidden: source/Core reference,
prior candidates/evidence, production repositories/packages/configuration, DB,
template, global guidance, releases/tags/push/install. Existing experiment is
already isolated; helper discovery and verification do not repair the candidate.

### V12 diagnosis and bounded design

V11 observed only11pt/397 and13pt/480, so font size and line spacing were
confounded. V12 uses a crossed2×2 matrix with all other fixture properties
held constant, followed by paired padding hypotheses for the two measured
strata only. Font size/line changes occur between discovery strata; within
each adjusted A/B pair only top/bottom padding distribution changes.

| Planned page | Font size | Exact line twips | Top/bottom twips | Purpose |
| --- | ---: | ---: | --- | --- |
| 1 | 11pt | 397 | 55/55 | Control; native header+REQ0001 excerpt appended |
| 2 | 11pt | 480 | 55/55 | Crossed line-only control |
| 3 | 13pt | 397 | 55/55 | Crossed size-only control |
| 4 | 13pt | 480 | 55/55 | Control |
| 5 | 11pt | 397 | 28/82 | Pair with1, nominal origin up1.35pt |
| 6 | 13pt | 480 | 19/91 | Pair with4, nominal origin up1.80pt |

Every measured cell keeps total vertical padding110twips and top alignment;
no exact/minimum row-height override, font shrink, line-height reduction,
run baseline/superscript shift, or page-count forcing. Word must still confirm
actual row heights; a constant padding sum alone is not rendered proof.
Crossed11/480 and13/397 controls receive no guessed correction.

Each controlled page contains15cases: Latin/Thai/mixed×four faces as12single
lines, plus explicit3-line Thai regular, mixed italic and mixed boldItalic.
These retain V11's Thai worst final residual and mixed-italic final minimum.
Text comes verbatim from frozen SRS; emphasis/13pt overlays are labelled
controls rather than natural-SRS coverage. Native table174 rows0/1 only
(header+REQ0001) repeat on1/5, preserving sibling cells, source text/run/image
properties and icon size; only nonvisual drawing IDs are made globally unique.
The four-native-row V11 excerpt would exceed the six-page budget, so no new
V12 REQ0002/0005 coverage is claimed. Estimated1/5content614.34pt leaves
75.38pt within689.72pt body; actual fit remains pending Word.

Grounding uses every measured V11 line rather than only a mean.11/397 control
residual range1.272…1.442pt has continuous minimax shift1.357pt; choose27twips
(1.35pt), not an asserted universal correction.13/480 range1.76599…1.796pt
has midpoint1.780995pt; choose36twips(1.80pt). Word export previously moved
a nominal1.25pt by1.20/1.32pt, so predicted ideal residuals are not PASS.
Keep source19.84pt versus DOCX397twips=19.85pt distinct; use traced nominal
Core font/line-box formula and existing actual native baseline where available,
without changing/re-rendering the Core PDF or claiming Word internal metrics.

Proof Budget: one six-page probe/one manual owner Word export, saved-package
verification before export, per-line/per-row paired measurements and all-six-page
visual QA after export. Compare the four controls to distinguish size/line
effects; retain every residual outside0.12pt rather than average it away.
Require no new wrapping/clipping, font/CS/emphasis/image changes, row-border
height delta<=0.12pt (target0), and pitch delta<=0.12pt within each paired
comparison. Actual page count/content presence must match the fixture.
No full-SRS correction is accepted from this short fixture; any later expansion
must select by effective properties/family, include all affected sibling cells,
and recheck SRS pagination/tables against frozen PDF. Never select by document
title, requirement ID, physical page number or a special global paragraph index.

Document Budget: this plan only; machine-readable discovery, builder,
generation, preflight and independent verification live under `tuning-v12/`.
Unknowns: actual Word quantization/pagination and crossed-pair effects are
blocking for calibration acceptance; exact internal Word metric algorithm is
deferred. Product/API implementation remains outside this experiment.

Discovery locator: `tuning-v12/discovery/calibration-design.json`.
Status at planning checkpoint: **prepared design; no V12 Word acceptance**.

### V12 generated probe and pre-export checks

Actual main-story inventory is `tuning-v12/discovery/style-inventory.json`,
matched to frozen source nodes and direct/effective OOXML rather than available
style definitions.200tables/933rows/1,932cells contain2,305paragraphs:
1,566text,371image-only and368empty. Natural text pairs are11/397=1,530,
11/340=9,11/400=18,11/500=2,18/520=3 and9/340=4paragraphs;13/480 is absent
from natural cells. All2,383text runs explicitly specify both sizes and four
Sarabun font slots. Regular/nonitalic is natural in these cells; source style
name `bold` itself specifies normal weight, so probe emphasis remains a control.
This is not proof of Word fallback/shaping or a reason to change source styles.

The gray-border55/55vertical and85/85horizontal margin family spans26tables /
1,167cells:802text-bearing (363also contain images) plus365empty siblings.
A future row-level change must account for siblings, mixed-pair front matter,
image-only `atLeast` paragraphs and available top-padding budget. A successful
font/line pair alone does not authorize every cell/margin family.

Generated `outputs/srs-font-line-calibration-v12.docx`,974,868bytes, SHA256
`e05a31e00b91d2fab56c2e922211420a663d427497aa4b3e33f41c2574abf32b`.
Builder `tuning-v12/scripts/build_probe.py`; generation metadata records all
page cases, nominal model, pair shifts and boundaries. Eight tables comprise
90controlled rows and four native row appearances; total102cells and two
unique source icon appearances. Six pages are planned, not yet confirmed.

Independent saved-package report
`tuning-v12/verification/saved-package-cross-factor.json`: PASS2,129assertions,
zero failures. Actual four-way control XML differs only in declared font size
and line spacing; paired1/5 and4/6 tables invert exactly after restoring margins
and normalizing only declared captions/start flags/nonvisual drawing IDs.
All124other ZIP payloads and compressed bytes match V11; native rows, image
resources/dimensions/order, paragraph/run/CS/emphasis properties and section
geometry are preserved. CT_PPr/CT_RPr ordering passes, including captions;
there are no active band/TOC references, exact row-height overrides or run
baseline shifts. Dormant source story relationships remain valid.

Root preflight is `tuning-v12/preflight/root-review.json`, covering frozen
source/reference/font/Core-trace hashes, final candidate/generation, discovery,
verification, plan scope and local anchors. Project Control validation is
`check:data` plus plan-link/whitespace review; this is prose-only and does not
regenerate projections. Only this existing plan is committed in Project Control.

**Checkpoint: ready for owner Word export; layout acceptance PENDING.**
Save `srs-font-line-calibration-v12.pdf` beside the new DOCX. No TOC update is
needed in this focused fixture. After export, inspect every page and measure
every paired row/line, including native icon placement, before claiming constant
rendered heights or improved Core alignment. No full-SRS redistribution,
reference PDF edit or production change has occurred.

### V12 owner Word results and acceptance

เจ้าของแปลงผ่าน Word for Microsoft365 แล้ว: `outputs/srs-font-line-calibration-v12.pdf`,
6pages /85,349bytes, SHA256
`a4d346ef5bb7fbd98c9fb11f25a621c1829bbd15c40e924a6a769ab0becf38e9`.
DOCX ยังตรง hash ก่อนส่ง; frozen20source/reference/font/Core-trace/candidate
inputs คงเดิม. Verification ไม่แก้ candidate หรือสร้าง full-SRS derivative.

**PASS bounded two-pair origin calibration; not full-SRS acceptance.**
วัด30paired cases/42lines และ native header+REQ0001. Row-border height delta
ทุกคู่0.000pt; paired line-pitch delta สูงสุด0.12pt. ไม่พบ measurement failures
หรือ adjusted-line residual เกิน±0.12pt. ใช้ทุก first/intermediate/final line
และ base-letter PDF text matrices; combining-mark offsets ไม่ถูกเอามาปน
baseline. ในแต่ละ line ทุก base-letter matrix origin ตรงกัน(spread0.000pt).

| Corrected pair | Requested upward shift | Measured text shift | All-line nominal Core residual | Row-height delta |
| --- | ---: | --- | --- | ---: |
| 11pt /397,15cases /21lines | 1.35pt | 1.32หรือ1.44pt | −0.11801…+0.08199pt | 0.000pt |
| 13pt /480,15cases /21lines | 1.80pt | 1.80pt | −0.03401…−0.004pt | 0.000pt |

ค่าคลาดเคลื่อนนี้เทียบ **nominal traced Core formula** สำหรับ controls,
ไม่ใช่ newly rendered Core PDF ทุก style. Native REQ0001 Latin R เทียบ
prior actual Core baseline17.51884pt ได้ error+0.00115pt. Native icon ยังคง
100×16pt, decoded RGBตรง sourcePNG และเลื่อนขึ้น1.35pt โดยกรอบแถวคงเดิม.
Source reference PDF/hash และ Core baseline evidence เดิมใช้ซ้ำแบบ immutable.

**Crossed finding:** ขนาดจริงใน PDF เป็น11.04ptบน1/2/5 และ12.96ptบน3/4/6,
จึงไม่ได้เกิดจาก fixture เผลอใช้ font size เดียว. ที่ exact line เดียวกัน
เปลี่ยน11→13แล้ว actual Word base-letter origin เปลี่ยน0.000ptครบ21samples
ทั้ง397และ480; observed font/line interaction0.000pt. เปลี่ยน397→480แล้ว
first baseline เลื่อน3.24…3.39ptเท่ากันทั้งสองขนาด. Nominal Core target
เพิ่ม0.836ptเมื่อเพิ่มขนาด และ first-line targetเพิ่ม2.08ptเมื่อเพิ่ม line.
จึงต้องแยก actual Word response ออกจากส่วนต่างระหว่างสอง layout models;
V11 diagonal residual ไม่พิสูจน์ว่า font size เป็นเหตุให้ Word origin เปลี่ยน.
ไม่อ้าง internal metric algorithm ของ Word. Crossed11/480และ13/397ยังไม่ได้
จูน/รับรอง: unadjusted residual2.60199…2.632และ0.40599…0.606ptตามลำดับ.

เทียบเฉพาะ matched V11 cases:11pt worst absolute residualลด0.182005→0.11801pt,
แต่4/21individual linesคลาดมากขึ้นเล็กน้อย,15ลด,2เท่าเดิม.13pt matched15lines
ดีขึ้นทั้งหมดและ worstลด0.596→0.034pt. ไม่กล่าวว่าทุกบรรทัดดีขึ้นจากV11;
11pt mixed boldItalic first-line−0.11801ptอยู่ใกล้ขอบ0.12pt ต้องคงข้อจำกัด
เรื่อง export quantization/ตำแหน่งบรรทัด ไม่ยกระดับเป็น universal padding rule.

Functional review PASS432assertions/zero failures:90controlled casesและ126
logical linesตรง source ภายใต้ declared NFKD+whitespace normalization.
Paired encoded glyph/TJ-advance streams และทุก char font/size/advance/X/
linear transform/color ตรงกันโดยยกเว้นYที่เป็นปัจจัยทดลอง. Embedded SFNT
PostScript identities ครบสี่Sarabun facesตรง emphasis; native image source
pixels/ขนาด/ลำดับครบ. ไม่อ้าง raw Unicode/every-glyph equality จาก normalization.

Root เปิดภาพ full-page144dpiครบ6หน้า และ detail288dpiสี่ภาพของ1/4/5/6;
ทุกกรณีอยู่ครบ ไม่เกิด overflow, visible Thai upper/lower-mark clipping,
overlap, glyph boxes, new wrapping หรือ icon-only ending. ตำแหน่งกรอบแถว
ตรงก่อน–หลังและ native text/iconอยู่ด้วยกัน. ภาพเต็มครอบคลุมส่วนที่ detail
crop จงใจตัดออก; ไม่ใช้ crop boundary เป็นข้อสรุปเรื่อง text clipping.

Acceptance coverage/input freeze: `tuning-v12/word-review/root-review.json`
PASS43root checks. Supporting locators:
`word-review/measurements/{word-measurements,measurement-summary}.json`,
`word-review/functional/functional-review.json`, `qa/candidate/manifest.json`
และ `qa/reviews/root-visual-review.json` ภายใต้ `tuning-v12/`.
Pre-export reports คงสถานะเดิมเพื่อรักษาประวัติ. Project Control checks:
`check:data`, local anchors and `git diff --check`; prose-only, no projection change.

Decision: ยอมรับเฉพาะ measured two-pair calibration ใน short fixture นี้.
หยุดตาม Proof Budget หลัง owner export/measurement/visual QA ครบ.
Next recommended work คือ bounded full-SRS trial ของ natural11/397 gray-border
55/55-margin family พร้อม sibling-cell/row guards แล้วตรวจ pagination,
table splits/repeated headers, heading groups และ icons. ยังไม่สร้าง candidate
รอบถัดไป, ไม่จูนทุกfamily, ไม่แก้ PDF/source/runtime และไม่รับ product readiness.

## V13 full SRS eligible-family trial

Owner authorizes one full-SRS experiment before proceeding to later difference
categories: use accepted values only in eligible tables, then compare pagination,
repeated column headers, headings and icons against frozen PDF. Same isolated
experiment, no reference PDF/source/runtime change. Existing V11 full candidate
remains immutable input; V12 two-pair findings are bounded calibration evidence,
not an already accepted full-document policy.

Authority: explicit request + this existing canonical plan. Roles Planning
Partner / Evidence Reviewer / Documentation Synthesizer; Project Control owns
this record, future product writer owner remains Core with no product edits.
Execution/Phase/Checklist IDs N/A in this unregistered single-room continuation.
Work Size medium / Risk Tier routine. Model decision: retain current session
model for inline authoring and inherited read-only discovery/final verification
helpers, no new PLAN/WORK room or model override. Current Truth Snapshot was
rebuilt read-only; unrelated roadmap state does not override this explicit task.

Markdown gate: update this Project Control canonical plan only. Document Budget
one existing plan; machine-readable selection/generation/verification/acceptance
targets under `tuning-v13/`. Allowed mutations: this plan, new `tuning-v13/`
files and one `outputs/srs-cell-origin-v13.docx`. Preserve all prior evidence,
DOCX/PDF outputs and source inputs. Forbidden: Core/reference PDF, resolved
data/assets/template, product repositories/dependencies/configuration/DB,
maps/global guidance/releases/tags/push/install. Experiment isolation already
exists; no new checkout or destructive cleanup.

### V13 scope and acceptance

Source `outputs/srs-semantic-grouping-v11.docx`, SHA256
`39a7de89643f901c40a995364b5e8848af73c19b8152035e9178f9ad10d5e0ff`.
Retain V11 heading/short-description/table grouping and all V9 icon/oversized
paragraph safeguards. Use accepted27twip upward redistribution for natural
Sarabun11pt/exact397 only; no13/480 overlay or guessed crossed-pair correction.

Select by table/row/cell properties, never SRS title, requirement ID, heading
name, paragraph index or physical page. Expected family:26whole tables /
389logical rows /1,167cells, fixed three-column10770twip grid, gray666666
0.5pt borders, top alignment, explicit55/55vertical and85/85horizontal margins.
All sibling cells must satisfy guards; preserve original text/empty/image
paragraph policies, widths, row splitting, header flags and keep properties.
Only `tcMar/top@w:w`55→28 and `tcMar/bottom@w:w`55→82 change; total110twips
and minimum top padding>=20twips remain. Other style/margin families stay intact.
Source paragraph/run/CS/font/line/field/image properties and all non-document
ZIP resources must match baseline exactly after inverse margin restoration.

Proof Budget: one full-SRS candidate/one manual owner Word export; before export
run structural positive/negative selector controls, exact raw/canonical XML
inverse, independent saved-package preservation checks and frozen-input guards.
Static package PASS does not certify rendered row-height/pagination parity.
After Word export compare source-matched rows/line origins and full output:
TOC links/printed page labels, page fields/bands, repeated header continuation,
32heading-description-table relations including15.4, known REQ0004/REQ0041
splits and text/icon endings, plus all371ordered body image identities.

Baseline Word99pages versus Core98 is retained as an observation, not a target.
Recompute header/page coverage from actual continuations; do not hard-code V11
55requirement pages/76bands or24meeting-header occurrences as fixed V13counts.
Inspect every new output page, reusing prior full-page QA only where new raster
comparison proves identical pixels. No averaging away content/relationship
loss, clipping, changed row height, hidden header or icon-only ending.

Unknowns blocking acceptance: full-document row/fragment/pagination response to
padding redistribution and any text-position quantization near the V12.12pt
boundary. Exact Word internal font metrics remain deferred; scope does not
include changing PDF line placement to chase parity. Stop after the declared
single candidate/export review, preserving any regression as a result rather
than silently authoring extra revisions or promoting product readiness.

### V13 generated candidate and owner Word checkpoint

Generated `outputs/srs-cell-origin-v13.docx`,1,084,303bytes, SHA256
`ed65d2e0c551af6e2bdf7af45a7123c4c81caf62bf147b31f06b728264f7e262`.
Only2,334equal-length margin-attribute replacements in `word/document.xml`;
raw inverse restores every source byte and canonical inverse matches as well.
All174unselected tables remain unchanged. Main-story counts remain2,775p /
4,609r /200tables /933rows /1,932cells /371drawings /198hyperlinks /922breaks /
7sections /396bookmarks /199field-instruction nodes. No drawing ID reassignment,
line/font/CS/emphasis/keep/header/field/section/asset change.

Independent source discovery identifies26tables /389rows (26header,363body).
Cell counts are439text only +363text with image +365empty =1,167; image-only
cells0. Paragraph counts are802text +363image only +365empty =1,530. Image
paragraphs retain0.5pt marks and `atLeast320`; all empty siblings retain11/397.
These are separate cell/paragraph counts, not interchangeable layout units.
Selected2,012-codepoint oversized text retains72breaks, `keepNext=false` and
`keepLines=false`; no oversized chain is reintroduced.

Root selector controls PASS19 including renamed-content independence and
one-sibling font/CS-size/line/margin/border/alignment/span/image-spacing mismatch,
enabled non-splitting, row-height, merge and nesting exclusions. Initial test
records remain: unimplemented guard RED; next detached synthetic-table fixture
failed direct-body eligibility. Corrected fixture restores body context and
passes before candidate authoring; final report `verification/selector-controls-r1.json`.

Independent saved-package verification PASS4,955assertions/zero failures:
membership matches source family, all row siblings receive28/82, total110,
raw/canonical XML inverse is exact, and all124other ZIP payloads/compressed
local records remain identical. Ordered text/runs/paragraph/row/section
properties, images, fields, header flags and oversized keep guards are frozen.
This is package acceptance only; actual Word row heights/continuations remain
unverified. No extra candidate or automatic Word conversion was started.

Locators under `tuning-v13/`: `scripts/{select_family,check_selector,build_full_srs}.py`,
`generation.json`, `discovery/{eligible-family-final,acceptance-targets}.json`,
`verification/{selector-controls-r1,saved-package}.json` and
`preflight/root-review.json`. Independent discovery/hash agrees with root
selection; root preflight PASS40checks covers22frozen input/candidate hashes,
calibration/source/candidate freeze and pending
acceptance. Reuse V11 baseline/Core QA only within declared identity/content
boundaries after actual V13 comparison. Pre-export checks for this prose-only
Project Control update: `check:data`, local anchors and `git diff --check`;
no generated projection changes or product/map promotion.

**Ready for one owner Word export; V13 rendered acceptance PENDING.**
Open the new DOCX and save `srs-cell-origin-v13.pdf` in the same output folder;
update the entire TOC if Word asks. Next review uses the prepared32groups,
26requirement-table continuation rules,15meeting tables,198TOC entries,
371images, known long-row/icon endings and all-page QA. Actual page/header
counts are measured from V13, not copied as required numbers from V11.

### V13 owner Word results and candidate decision

เจ้าของส่ง Word for Microsoft365 export แล้ว: `outputs/srs-cell-origin-v13.pdf`,
99pages /1,013,849bytes, SHA256
`a8d4ca5c440fa920106949236703478b312af3224fbdaed3df04a0587d47d3c0`.
Candidate DOCX ยังตรง pre-export hash; frozen22input/candidate paths คงเดิม.
Verification ไม่แก้ DOCX/PDF, source, prior evidence หรือ product files.

**Trial complete; reject V13 uniform cell-origin shift as the replacement for
V11.** โครงสร้างและการแบ่งหน้าคงเดิม แต่ actual Core alignment ของข้อความ
บางส่วนและไอคอนแย่ลง. เก็บ V13 เป็น experiment/evidence; คง
`srs-semantic-grouping-v11.docx` เป็น bounded experimental baseline ซึ่งยัง
ไม่ใช่ product-ready DOCX หรือคำรับรองว่าเหมือน Core ทุกจุด.

Functional review R1 PASS171checks/zero failures:198TOC links resolve พร้อม
printed labels/destinations,98visible page fieldsและ98header bannersตรง policy.
Actual requirement continuation coverage คือ55pages /76header bands; geometry
และ fill/ink pixelsครบ.15source meeting tablesมี24header occurrences พร้อม
เลข1–10,12–16ตาม source; ไม่เติมเลข11ที่ source ไม่มี. Ordered371body images
ตรง V11ทั้ง decoded image/softmask identity; ตำแหน่งแนวตั้งเป็นปัจจัยทดลอง.
All99pages encoded glyph paints/font programs/ToUnicode/sizes/advances/Xและ
linear text stateตรง V11โดยแยกY;6,979relative `TD` operandsตรงกันทั้งหมด.
ไม่ใช้ lossy Thai normalization อ้าง raw Unicode/every-glyph source equality.

Geometry covers363logical body rowsใน26tables:361REQ labelsและ2blank-label
source notes (`ขอเพิ่มสีเขียว`, `มีเรื่องของ template`), ไม่ใช่363REQ IDs.
Wordยัง99pagesเท่า V11 เทียบ Core98;30logical split rowsและ394physical data
fragmentsเหมือนเดิม. All99gray-border arraysตรงภายใน declared0.01pt precision;
333whole Word rowsมีheight delta0.000pt. Feature line-pitch deltaสูงสุด0.12pt.
Height errorต่อ Coreของ305rowsที่wholeทั้งสามไฟล์ยัง−19.8…+0.25ptจาก retained
wrapping/layout differences; ผลนี้ไม่รับรอง Core row-height parity ทั้งเอกสาร.

Grouping PASS32/32heading-description-table relations;31groupsมีgeometry
ตรง V11.16.14ยังอยู่ครบpage67แต่first body lineเลื่อนตามปัจจัยทดลอง;
15.4ยังอยู่ครบpage45. Source correspondence64checksครอบคลุมheader+first
body prefixของ32groupsภายใต้ declared normalization. REQ0004ครบpages45–46
และจบtext+icon46; REQ0041ครบ2,012source codepointsภายใต้ normalization
pages50–52และจบ `dates to tasks*` +icon52ก่อนREQ0042page53. Package-level
exact inverseและ unchanged source text/keep guardsรองรับความครบถ้วนแยกต่างหาก.

### V13 actual Core alignment limits

วัดแต่ละตำแหน่งเทียบ row topของตัวเองจาก actual Core/V11/V13 PDF จึงไม่ใช้
physical page indexหรือ absolute page Yเป็นเป้าเดียวกัน. Strict comparison
เลือก173whole rowsที่ feature textครบและอยู่บรรทัดเดียวเหมือนกันทั้งสามไฟล์;
ไม่ปน changed wrapping/split context. All363first-line comparisonsเก็บเป็น
observationเท่านั้น. Base-letter matricesภายในแต่ละบรรทัดมีspread0.000pt;
แยก combining-mark offsetsออกจากbaseline.

| Actual Core target | Result after V13 shift | Decision boundary |
| --- | --- | --- |
| Latin R labels,361rows | Improved361;360within±0.12pt;new error−0.122841…+0.031159pt | REQ0035page49ยัง−0.122841pt;คง marginal outlier ไม่ขยาย toleranceเงียบๆ |
| Strict same-line feature text,173rows | Improved141,worsened32;81within±0.12pt;new error−1.456341…+0.581159pt | Uniform shiftไม่ทำให้ทุกข้อความใกล้ Coreขึ้น |
| Matched icon tops in strict173rows | Worsened173/173;new error−1.490841…−1.300841pt;0within±0.12pt | เดิม168/173within±0.12pt;การยกทั้งเซลล์ทำให้ไอคอนสูงเกินเป้า |

Native REQ0001แสดงความต่างชัด: Core R baseline17.518841ptจากrow top แต่
mixed feature baseline18.244841pt; Wordทั้งสองroleเดิม18.84→17.52pt.
Rดีขึ้นแต่feature error+0.595159→−0.724841pt. Icon100×16ptเดิมerror−0.030841
กลายเป็น−1.380841pt โดย image identityและtext/icon relationshipยังครบ.
Worst strict feature REQ0064: error−0.136341→−1.456341pt, Corepage54/Word55.
Three-way native288dpi detail reviewยืนยันภาพตำแหน่งต่างนี้; crop boundaries
จงใจตัดเนื้อหาข้างเคียง ไม่ใช่ clipping ของเอกสาร.

สรุปได้ว่า whole-cell margin redistributionย้ายlabel/text/iconพร้อมกัน
ทั้งที่ actual Core target originsต่างกัน. ยังไม่พิสูจน์ internal Word
font-metricหรือshaped-ink cause; ไม่อ้างว่าสาเหตุเป็นWordbug. V12ยังผ่านเฉพาะ
nominal traced-formula/two-pair short-fixture boundตามที่บันทึกไว้เดิม;
V13 actual mixed-text/icon evidenceขัดขวางการขยายเป็นfull-document policy.

### V13 coverage and closure

Rasterized99pages at120dpi. Pages1–44ตรง V11แบบexactRGBจึงใช้prior full-page
QAแบบtransitiveภายในidentity boundary. Changed55pages45–99เปิดตรวจภาพเต็ม
ใหม่ครบ:root45–60/91–99(25pages),functional helper61–75(15),grouping helper
76–90(15). ไม่มีหน้าขาด/ซ้ำในcoverage; ไม่พบnew clipping,overlap,glyph boxes,
missing repeated headers,heading orphanหรือicon-only ending. Visual integrity
PASSนี้ไม่เปลี่ยน actual Core vertical-alignment FAILให้เป็นPASS.

Final root report `tuning-v13/word-review/root-review-r1.json`:63verification
checks PASS/zero failures,99-page coverage complete; status
`TRIAL_COMPLETE_CANDIDATE_REJECTED_ALIGNMENT_REGRESSIONS`, SHA256
`00de4821d27a8877b3282dca05a0cacae77e5516a995661fd930ab2ffb207153`.
Candidate criteriaแยก functional/pagination PASSจาก alignment-regression FAIL.
Supporting evidence under `tuning-v13/`: `word-review/functional/functional-review-r1.json`,
`word-review/functional/text-state-review.json`, `word-review/grouping/{grouping-review,table-start-source-correspondence}.json`,
`word-review/geometry/{geometry-review,actual-core-role-comparison}.json`,
`word-review/render-diff.json`, `qa/candidate/manifest.json`,
`qa/reviews/{root-visual-review,root-core-native-detail}.json`และhelper visual
reports061–075/076–090. Root report binds supporting report and frozen-input hashes.

Retain verifier history: original functional/glyph reports failed a short-probe
assumption that relative text operations were absent; independent text-state
review proves operand identity and freshfunctional R1supersedes that method
limitation. Initial root aggregation compared locator+hash dictionariesกับ
hash-only dictionaries; retained `word-review/root-review.json` records those
two schema-assumption failures, R1 compares explicit SHA256maps and passes.
ไม่มีcandidate repair. Pre-export/pending manifestsคงสถานะประวัติ; finalroot
reportเป็นcoverage/decision aggregation, ไม่เขียนทับ checkpoint เดิม.

Project Control closure checks for this prose-only update: `check:data`, local
anchors and `git diff --check`; no generated projection or map promotion.
Stop after the authorized one candidate/export. Next recommended workคือ
bounded discoveryเพื่อแยกlabel/feature-text/image origin policiesโดยใช้actual
Core renderingก่อนสร้างcandidateถัดไป; ยังไม่เริ่มรอบใหม่หรือไปข้อ3–4.
PDF reference, resolved structure/data/assetsและระบบจริงคงเดิม.

## Shared mapping discovery — SRS tuning paused

Owner request: พักการจูน SRS ตรวจ mapping จากโครงสร้างกลางไป PDF/DOCX
แล้วสรุปสาเหตุและแนวทางที่ใช้ได้หลายเอกสารก่อนทดลองต่อ. This is a new bounded
read-only discovery scope in the same unregistered conversation; it does not
reopen V13 candidate authoring or rewrite its acceptance. Work/Phase/Checklist/
execution IDs N/A. Roles Evidence Reviewer / Planning Partner / Documentation
Synthesizer; Project Control owns this record, future Core writer owns product
implementation. Work Size medium / Risk routine; current session model for
inline inspection, no separate WORK or model override.

The validated Current Truth Snapshot was rebuilt read-only from canonical
sources, digest `e9bacb313ae72de8f57dee468e4723f051a28572561b27b373d00764085e2300`.
Its unrelated frontend roadmap does not replace this explicit request. Markdown
gate: classify this update as Project Control canonical, retain one existing
plan; no new Work/Phase/Evidence record or map promotion. Machine evidence under
`mapping-audit/` prevents promoting nominal calibration or SRS-only assumptions
as general writer semantics; prior rendered reports do not inventory this
cross-path contract, so they are immutable supporting inputs rather than a
substitute for this discovery.

Allowed writes: this plan and new `mapping-audit/{inspect_mapping.py,mapping-review.json}`
inside the existing isolated experiment. No new DOCX/PDF, Word interaction,
renderer execution, source/template/resolved-data modification, PDF reference
edit, product/dependency/configuration/DB change, global guidance, release or
push. Proof Budget: one source/OOXML mapping inspection, saved-package inventory,
source/evidence hashes and22frozen input checks before/after; then documentation
validation. Stop after findings/recommendations; no automatic V14 or new probe.

### Inspected routes and identity

Shared input is frozen `inputs/resolved.json`, schema1/nodeModel18, SHA256
`920976069d27da172193fb253e1c3b313299327a6f7994755fb2b927bfdfa301`.
Inspected PDF implementation is the experiment's installed Core0.4.7 package
under `docx-prototype-9130/node_modules/@flowdoc/core/dist/`, not an assertion
about every current Core checkout. The existing paired-PDF receipt binds that
same resolved hash and98pages; no PDF was generated or newly reviewed here.

PDF route: `createPdfEngine` → `documentFlow` / `measureCellContent` /
`measureText` → concrete font selection + native segmentation/shaping → measured
line/frame/row/page geometry → glyph/image coordinates in PDF writer.

DOCX route: `scripts/generate-srs.mjs` with `tables.mjs` / `bands.mjs` consumes
the same resolved structure, emits Word paragraphs/tables/fields with
`docx@9.13.0`, then Word performs text shaping/wrapping/layout. Current reviewed
V11 is not a direct fresh output of that generator: V2 → V3 indent/language →
V7 CS/emphasis → V8 relationships/separators → V9 oversized keep → V10ROW
padding → V11 description keep. V13 is a rejected derivative of V11. These
postprocessors remain frozen experimental evidence, not the implementation
contract for a reusable writer.

### Confirmed mapping differences

| Topic | PDF interpretation | Current DOCX prototype | General implication |
| --- | --- | --- | --- |
| Line height and baseline | `H=max(requested,A+D)`; baseline `A+(H-A-D)/2`; A/D expand to actual positioned glyph ink | Text uses rounded `lineHeightPt` with `lineRule=exact`; Word chooses baseline | Source height acts as a safe minimum in PDF, but is encoded as fixed spacing in Word; equal numbers do not preserve the same typography policy |
| Font and script | Concrete legacy face or library release/weight/style; missing face/glyph fails explicitly | Four Sarabun faces/all font slots, hardcoded th-TH; rejects other legacy families/library styles; V7 applies forced CS to Thai-containing runs only | Other-font/language support is an unimplemented prototype scope, not evidence of a DOCX limitation; effective style/script policy needs a general mapping |
| Wrapping and normalization | Native break opportunities + shaped ink width + grapheme fallback; CRLF/CR normalize to LF and tabs to display spaces | LF becomes explicit Word breaks; Word owns remaining wrapping, with no equivalent explicit CR/tab normalization in this generator | Keep authored breaks and define normalization; do not bake PDF physical wrapping into reusable content |
| Block images | Independent authored frame contributes exact frame height; contain pixels centered inside frame | Body image becomes inline drawing in its own paragraph with minimum line height and0.5pt paragraph mark; optional source image alignment rejected | Word inline/paragraph metrics are an extra layout budget; image framing needs its own adapter rather than cell-wide compensation |
| Cell geometry | Padding defaults4pt; row height comes from child line/frame stack plus padding; borders drawn0.5pt at resolved coordinates | Initial80twip default agrees, but V10ROW subtracts5twips from both margins in1,830cells; V13 redistributes27twips in1,167cells | Authored padding and renderer overhead have become mixed in experiments; prior compensation must not become the shared style definition |
| Horizontal alignment | Cell alignment uses actual occupied ink width and negative-ink correction; image frame alignment supported | Word paragraph alignment and fixed grid; V3 corrects table indent to0; image align is outside current allowlist | Table origin, cell padding, text alignment and frame alignment are separate concerns; indent fix does not prove universal text-edge parity |
| Grouping and pagination | Measured row fragments, group prefix/first-member capacity and keepStart relaxation | Native tblHeader/cantSplit plus keepNext/keepLines approximations and bounded inferred heading/icon relationships | Same logical relationships need format-specific mapping with oversized relaxation; never a per-REQ or per-title offset rule |
| Sections and bands | Text-runtime measurement and actual first/continuation band footprint per page | One-line/explicit-break estimates, floating band tables, maximum footprint reserved in section margins; A4portrait/continued numbering guard | Wrapped bands, arbitrary numbering and other page geometries are not established by this SRS recipe |
| General model coverage | Types include library fonts, page-break, content/fixed text height, verticalAlign, image.align, TOC scope and formatInstances | Several are explicitly rejected; heightMode checks `auto` although model enum is `content`; formatInstances is not interpreted | Establish a capability matrix and fail on unsupported input; missing mappings are not evidence that the source cannot represent the case |
| Units and generated fields | Point floats and measured coordinates; page/TOC values filled after layout | Integer twips, half-point run size inputs and native Word fields requiring refresh | Quantization and each format's own numbering are expected adaptations; one rounded length differs by at most0.025pt, not an explanation for the1.3pt icon shift |

Source detail: Core A/D can change with actual content even if total line height
does not grow. Therefore font size/line height alone cannot establish one
baseline target for Latin and mixed text. This confirms the PDF-side rule; it
does not establish which internal Word metric causes its observed origins.
Likewise Word's inline object participates in line layout according to
[Microsoft Inline documentation](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.drawing.wordprocessing.inline?view=openxml-3.0.1),
and exact/atLeast spacing and font-slot semantics are documented in
[line spacing](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.spacingbetweenlines.line?view=openxml-3.0.1)
and [run fonts](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.runfonts?view=openxml-3.0.1).
These references support the format semantics, not a newly verified fix.

Saved-package corroboration: V11/V13 both2,775paragraphs /4,609runs /
200tables /933rows /1,932cells /371inline body drawings /7sections; no explicit
row-height nodes. Both have1,942paragraphs at exact397twips,195at exact480 and
363image paragraphs at atLeast320. V11 has1,183cells at55/55twips; V13 changes
1,167of them to28/82, leaving16unchanged. The source requirement family has
3pt/3pt padding (=60/60twips), so even V11's55/55 is retained experimental
compensation, not a value to copy back into source or a future general writer.
There are1,420forced-CS main-story run properties and all200table indents are0.
Fixture has no formatInstances/page-break nodes and only Sarabun styles;
absence is not acceptance coverage for those general capabilities.

### Cause boundary and proposed general correction

Confirmed: common structure/data is preserved, but the two paths do not share
final line boxes, baselines or pagination. Prototype mapping changes the
meaning of minimum line spacing and block-image framing, adds inferred Word
grouping, and accumulates spacing compensation. Existing V13 actual-rendered
evidence confirms that translating a whole cell moves already-close images
along with text having different Core targets. This is enough to reject that
abstraction; it is not proof of an internal Word/docx-library defect.

Recommended design direction, **not implemented or rendered-accepted**:

1. Resolve an effective style/capability layer from the existing shared input:
   concrete font face identity/weight/style, normalization, minimum line height,
   block-image frame, authored padding and genuine grouping. PDF behavior stays
   frozen. Derive existing intent where possible; any new language/direction/
   fallback or relationship metadata needs a separately reviewed contract.
2. Map that intent into native Word behavior per element/property, without
   R/REQ/title/page/fixture-index rules or magic offsets per font. Preserve
   source spacing; account for Word border/paragraph/image overhead separately.
   `atLeast` is a candidate for minimum spacing, **not** a proven one-property
   fix for Core baselines. Font-metric reading alone cannot guarantee parity.
3. Before a replacement writer, validate actual Core/Word outputs on a small
   same-input set across more than one supported font and Thai/Latin/mixed text
   with block images. Measure line box, baseline, image frame and row extent
   separately; accept individual failures, not nominal-formula averages.
4. Only after a policy is supported, consolidate accepted mappings into one
   isolated writer with explicit unsupported handling. Use full SRS later as
   regression coverage. Do not chase another SRS-specific correction first.

Still unresolved before implementation: effective minimum-line/baseline policy,
acceptable native Word fidelity difference, concrete font/script disposition
and supported generic feature scope. Exact internal Word metrics, arbitrary
scripts/fonts, wrapped bands and pixel/page parity remain unverified. This
inspection does not diagnose Word conversion performance. V12's bounded
nominal calibration and V13's rejection retain their original evidence meaning.

### Discovery evidence and stopping point

`mapping-audit/mapping-review.json`: status
`DISCOVERY_COMPLETE_IMPLEMENTATION_AND_NEW_RENDERING_NOT_STARTED`, SHA256
`f08f707d7429fdf80809b7bb3ff3eae48d1e47291d2bff8eafa06f7925a1c0b3`.
Ten mapping topics have exact source locators;29source/evidence files are
hash-bound before/after;22prior frozen inputs remain identical. Read-only
inspection covers two saved DOCX packages and the existing same-input PDF
receipt. No new DOCX/PDF, Word interaction, candidate repair or runtime change.
All reported new verification is source/package inspection, not rendered proof.

Acceptance: mapping differences, confirmed causes versus unknowns, reusable
correction direction and unsupported boundaries are recorded for owner review.
Documentation checks: `check:data`, local anchors, scope/diff/whitespace review.
No projection regeneration is needed for this prose-only change. SRS tuning
remains paused; no follow-up experiment starts under this discovery authority.

## Unified DOCX mapping contract and consolidation plan

Owner request: กำหนดกติกา mapping กลางและขอบเขต DOCX ให้ชัด พร้อมแผนรวมเป็น
ตัวแปลงเดียวก่อน; ยังไม่ทดลอง SRS หรือแก้ PDF ต้นแบบ/ระบบจริง. **Status:
DESIGN_AND_PLAN_FOR_REVIEW; no implementation or new rendering.** MUST below
defines the proposed acceptance target, not a claim of present support. This
section governs the next isolated-writer proposal; it does not supersede the
product ownership/API/transport constraints in Stages0–5 or historical evidence.

Authority/Markdown gate: existing Project Control canonical plan only; role
Planning Partner / Documentation Synthesizer, future Core writer owner.
Work/Phase/Checklist/execution IDs N/A for single-room planning. Work Size
medium / Risk routine. Current session model retained for this inline design;
no registered execution or model change. Validated Current Truth Snapshot was
rebuilt read-only with the same canonical digest recorded above. New execution
will choose its model/base/isolation under the workflow policy, not inherit
an earlier PLAN or experimental acceptance.

Document Budget one existing plan. Allowed mutation this turn: this Markdown
only. Proof Budget: reuse the hash-verified mapping audit and22frozen inputs,
design self-review/cross-reference coverage, `check:data`, anchors/scope/diff
checks. No new source/report/candidate, dependency install, Word/PDF execution,
product/configuration/data/DB/map/global-guidance edit, commit outside Project
Control, release or push. Stop with the reviewable design and staged plan.

### Design choice and fidelity contract

Choose a **native Word flow writer from shared semantic input**. Alternative
PDF-coordinate reconstruction would couple DOCX to final PDF pagination and
require position-based text/frame placement. Maintaining Word templates
separately would duplicate structure and styles. These alternatives add final-
layout coupling or duplicated authoring beyond the chosen flow; neither is selected.

Preserve logical content/order, table topology, links, concrete font/style,
authored lengths/alignment, image frames and reading relationships. Word owns
shaping, natural line wrapping, line origins and pagination. Different line/
page breaks are allowed; clipping, missing content, changed image identity,
wrong emphasis, hidden repeated headers, incorrect navigation or arbitrary
font/padding compensation are not. Pixel-identical baselines, exact PDF page
counts and one offset valid for all fonts are not acceptance promises.

Derived values remain output-specific and carry source locators. PDF receives
the original `ResolvedDocument` through its existing route unchanged. A pure
derived export-intent view describes the semantics the DOCX adapter must
preserve; it is not a new authored template, replacement public schema, shared
final coordinate tree, or a prerequisite refactor of the PDF renderer.

```text
existing composition -> ResolvedDocument + verified resource snapshot
                          |-> existing PDF route (unchanged)
                          |-> support preflight -> derived ExportIntent
                              -> one native DOCX writer -> staged DOCX + receipt
```

The future isolated implementation takes one public entry, proposed
`generateDocxTo(document, resources, sink, options)`; all helper modules are
internal. It reads source input and creates a new package directly. It never
reads V2/V3/V7/V8/V9/V10/V11/V13 output files to construct the new document,
patches a serialized old package, or selects behavior by SRS/REQ/title/node
identity/paragraph index/page. Source IDs remain traceability locators only.

### Central mapping rules: docx-native-flow/1

| Rule | Proposed normative behavior | Difference handling / proof |
| --- | --- | --- |
| C1 Input and normalization | Validate the complete reachable body/band graph and selected profile before output. Derive from an immutable snapshot. Normalize CRLF/CR to LF and tabs to single display spaces as the inspected PDF text path does; retain explicit authored breaks and all other characters | Never inject PDF physical line breaks, recompose from an SRS-specific source or mutate the caller. Normalization has before/after source offsets for links |
| C2 Effective style | Resolve actual style properties, not names such as `bold`. Legacy font aliases and library release/weight/style resolve to concrete verified faces/resources. Preserve size, weight and italic in ordinary/CS formatting and generated/inherited Word styles | No forced Sarabun/th-TH default for unrelated input. Source face missing, unresolved or glyph coverage missing is fatal; no silent fallback or font shrinking |
| C3 Script and language | Classify supported Unicode text without cutting grapheme clusters. Use appropriate Word font slots and preserve the same effective face/emphasis across mixed runs. Language tags come from explicit writer context when supplied; otherwise do not invent a document-wide locale. Script selection is not RTL direction | Profile initially targets Thai, Latin and their mixtures, including numbers/punctuation. CS mapping for Thai/mixed text must be proved independently of pure Latin; no unconditional forced-CS rule for every script |
| C4 Lines and fixed frames | Interpret `lineHeightPt` as minimum safe text line height, matching inspected PDF behavior. Default Word text spacing is `atLeast` at the converted value; before/after0 unless another actual source property supplies spacing. Do not encode a target glyph baseline by moving the cell | This selects semantic behavior, not a claim that atLeast solves baseline parity. Empty fixed spacers may use exact authored height. Nonempty fixed text/format frames are outside profile1 until a no-loss fit mapping is accepted |
| C5 Units and grid | Convert scalar point/mm lengths once to nearest integer twip, recording any quantization. For columns, round cumulative boundaries and derive adjacent widths so total equals rounded source total. Keep positive usable widths and separate table origin from cell margins | Scalar position error <=0.025pt; a derived column width may differ <=0.05pt. No5/27twip or font-specific correction. Font sizes must be representable in half-points; otherwise profile1 fails explicitly rather than rounding/shrinking silently |
| C6 Cells and borders | Preserve authored/default4pt padding and logical spans, fills, widths and0.5pt table borders. Keep row heights content-driven. Account for mandatory empty/terminal Word paragraphs and border footprint as adapter structure, without adding source text | Word paragraph overhead is not permission to change padding. No exact row heights or font shrinking to force content to fit. Validate merge/header boundaries before serialization |
| C7 Images | Preserve verified image identity/alpha, authored frame size and left/center/right frame alignment; contain pixels within that frame. Treat block images as independent flow units even if implemented using a native inline drawing paragraph | Map and report the paragraph mark/line footprint separately. Choose one documented block-image wrapper in taskU2; reject its adoption if it needs cell-wide compensation or separates a required tail/image group |
| C8 Reading groups | Preserve rowGroups.keepStart, header counts, row break preferences and explicit/source-derived heading/description/table and same-cell trailing-image relations. Derive relations by structure, never text identity. Default to short keeps; a long paragraph/row may split | Never attach an entire oversized text paragraph to its image or force all rows not to split. A trailing-image relation may bind only a bounded final tail at existing authored boundaries. If no safe mapping exists, return a located unsupported result; do not silently waive the relationship |
| C9 Sections and bands | Derive A4 portrait/landscape, margins, section order, cover/blank roles, band placement/modes and numbering from source. Keep independent adjacent tables separate with explicit structural separation where Word requires it | Wrapped/weighted bands need their own measured acceptance; maximum band footprint reserved by Word is a reported adaptation, not hidden margin drift. Different first/continuation body capacity is an explicit profile limitation |
| C10 Fields and links | Generate bookmarks, internal/external links, scoped/document TOC and native page fields from source relationships. Page numbers refer to the DOCX after Word pagination/field refresh; retain source section numbering/visibility policies | No copied PDF page labels or unverified REFRESH placeholders in accepted output. Numbering modes and refreshed TOC/destinations require actual Word proof |
| C11 Unsupported and findings | Classify every reachable feature as supported, supported-conditionally or unsupported before successful output. Findings contain code, source node/style/section/resource path, reason and required capability | Unsupported content, missing resources, invalid topology, unrepresentable required geometry or uncertified required grouping are fatal. Publish no successful/partial DOCX on fatal; warnings are reserved for quantified allowed adaptations |
| C12 Output and resources | Verify resource hashes/licenses, bounds, package relationships and output SHA256/media type. Use existing runtime floor `node >=24.15.0 <25` and pinned `docx@9.13.0` in isolation. No runtime downloads/installations | Buffer/ZIP memory and cancellation must be measured; a sink API is not evidence of bounded streaming. Stage output and discard/abort on failure; do not expose an incomplete package |

These rules do not introduce authoring-schema language, direction or grouping
fields. Any need for new shared metadata becomes a separate contract proposal;
the implementation cannot silently add it to `ResolvedDocument` or the PDF
path. Normalized offset mappings and layout-only paragraph segmentation must
preserve links/anchors and exact normalized logical text, including empty lines.

### Support profile and refusal boundary

Here **Required** means needed before the isolated writer can be called
profile1-complete. **Conditional** means explicit preconditions plus applicable
tests; it is not blanket support. **Deferred** means a located fatal result if
requested, never dropping it. Every row is **PLANNED / NOT IMPLEMENTED** now.

| Capability | Profile1 target | Boundary |
| --- | --- | --- |
| Shared schema | Required: valid schema1/2 and nodeModel18/19 combinations under Core validation | Complete reachable-graph preflight, not only a fixture inventory; unselected library fonts fail |
| Text/styles | Required: Thai/Latin/mixed, four ordinary emphasis combinations, explicit breaks, content-height text, empty fixed spacers, horizontal alignment | Font faces and glyphs must resolve; no promise of arbitrary script/direction or fractional half-point size |
| Fonts | Required: legacy face aliases and concrete library release/weight/style; at least two resource-distinct families in acceptance | Family names are data, not a hardcoded whitelist. Coverage/license/embedding identity and actual Word face use must pass. Embedding prohibited or not effective requires a separately agreed environment contract; no silent substitution |
| Other scripts | Deferred: RTL/bidirectional layout, CJK layout/locale-specific behavior and other unverified script profiles | Detect and report unsupported script/direction before success. Unsupported is not a claim that Word itself cannot render it |
| Images and rules | Required: block images with contain/alpha/frame alignment, horizontal line node, missing-resource refusal | No full-page raster replacement of native text/tables; supported image resources obey existing preparation policy |
| Tables | Required: logical rows/cells, widths/padding/fills/borders, valid colSpan/rowSpan, repeat header rows, allowBreak, independent adjacent tables | Conditional: native merge continuation and repeated-header interaction must pass Word cases; invalid/cross-header spans rejected. Nested tables are outside the inspected Core cell-content contract |
| Groups and long content | Required: short heading/description/table groups, row-group starts, explicit-break multiline text, oversized rows and trailing text/image endings | Conditional: bounded tail grouping without an oversized keep chain. Per-fragment groupLabel re-emission is deferred; nonempty groupLabel metadata is fatal in profile1 |
| Sections/numbering | Required: A4 portrait/landscape, continued/restarted numbering, hidden numbering, body/cover/blank section roles and explicit page-break nodes | Empty sections/blank pages and numbering resets must be exercised; no filename/page-index recipes |
| Bands | Required: absent/none/all/first/continuation bands, weighted columns and explicit placement, line/image/compact-page-field content | Conditional: automatic wrapping, fixed/min/max sizing and maximum-footprint reservation are supported only within a tested source/Word fit envelope; outside it fails instead of clipping |
| Navigation | Required: anchors/bookmarks, source links/references/URLs, document/scoped TOC and page fields | Scope and refresh must work after actual DOCX pagination; field-update requirement is visible in the receipt, not treated as verification |
| Format sizing | Conditional: auto formatInstances whose semantics can be retained without omission/truncation | Nonempty fixed format budgets and nonempty fixed text frames with verticalAlign are deferred; no silently ignored formatInstances or conversion to auto |
| Engine safety | Required: immutable input/resource snapshot, cancellation, output/placement/node budgets, cleanup, deterministic semantic receipt | Visual Office-version differences and ZIP byte nondeterminism are recorded; no reproducible-package claim without proof |
| External surfaces | Deferred: DOCX import/round-trip, LibreOffice/Google Docs equivalence, Word server automation, UI, production API/storage/queue | Existing `Output-Format` absent→PDF contract remains the future Service requirement; this plan does not implement it |

Required features are incremental task deliverables. Until every applicable
Required row passes, a partially implemented writer is labelled incomplete and
must fail on features beyond its actually verified capabilities. A support
matrix entry cannot become PASS from package generation or a unit test alone
when the row also requires Word-rendered evidence.

### Consolidation structure and interfaces

Future isolated target directory (not created this turn):
`C:\Users\nekot\Documents\Codex\2026-10-21\docx-srs-9130\unified-docx-writer`.
New local files only; existing candidates/source/reference and frozen package
remain immutable. Do not add product-repository files during these tasks.
Checkpoint future isolated sources/receipts by hash. Git integration is not
assumed for this external experiment directory; do not initialize or attach a
repository merely to satisfy a generic commit step. Project Control record
updates retain their own checked-commit requirement.

| Proposed files relative to that target | Responsibility |
| --- | --- |
| `package.json`, local lockfile, `tsconfig.json` | Isolated runner/type checking and exact dependency/resource identities; no product package changes |
| `src/types.ts`, `src/profile.ts` | Internal readonly contracts, capability/refusal classification, source-located findings and immutable snapshot |
| `src/intent.ts`, `src/fonts.ts`, `src/units.ts` | Effective styles/resources, grapheme/script-safe text and logical relationships, normalization offsets and deterministic units |
| `src/text.ts`, `src/images.ts`, `src/tables.ts` | Native paragraphs/image block wrapper/table topology; same normalized intent and no old-package patches |
| `src/sections.ts`, `src/bands.ts`, `src/fields.ts` | Source-driven section geometry, numbering/bands, bookmarks/links/TOC/fields |
| `src/writer.ts`, `src/index.ts` | Single orchestration/serialization entry, staging, cancellation/budgets and receipt |
| `tests/{profile,intent,text-images,tables-groups,sections-fields,writer}.test.ts` | Positive/negative behavior assertions owned by corresponding task |
| `fixtures/`, `evidence/`, `qa/` | Small source-defined cases, frozen receipts and later rendering coverage; no alternate authored Word templates |

Proposed internal names/signatures to keep task boundaries consistent:

```typescript
preflightDocx(document: Readonly<ResolvedDocument>, resources: ResourceSnapshot,
  profile: DocxProfile): Result<Preflight>;
deriveExportIntent(preflight: Preflight): Result<ExportIntent>;
writeDocx(intent: ExportIntent, sink: DocxSink,
  options: WriteOptions): Promise<Result<DocxReceipt>>;
generateDocxTo(document: Readonly<ResolvedDocument>, resources: ResourceSnapshot,
  sink: DocxSink, options: WriteOptions): Promise<Result<DocxReceipt>>;
```

`DocxProfile` identifies `docx-native-flow/1` plus actually enabled capabilities;
`ResourceSnapshot` contains verified immutable font/image bytes and identities,
font licenses and optional explicit language context. `Preflight` binds that
snapshot, the source graph and findings. `ExportIntent` is readonly normalized
flow/style/frame/group data with source/offset locators and resource references,
not copied final PDF geometry. `DocxSink` supports write/abort; `WriteOptions`
contains profile, signal and explicit budgets. `DocxReceipt` contains media type,
bytes/SHA256, input/resource identities, profile/capabilities, quantified
adaptations, field-refresh state and evidence references. `Result` uses Core's
success/failure shape; no new public Core API is introduced in isolation.
Private findings distinguish `DOCX_CAPABILITY_UNSUPPORTED`,
`DOCX_GEOMETRY_UNREPRESENTABLE`, `DOCX_REQUIRED_RELATION_UNSUPPORTED`,
`DOCX_RESOURCE_INVALID`, `DOCX_OUTPUT_BUDGET_EXCEEDED`, `DOCX_CANCELLED` and
`DOCX_SERIALIZATION_FAILED`; reuse existing font identity/glyph failure codes
where they apply. Quantization, native band footprint and pending field refresh
are separate adaptation records, never success aliases for a fatal finding.

### Tasks for a separately authorized isolated implementation

All tasks below are pending. No task, including fixture construction or Word
export, starts from approval to write this plan. Task steps use the earliest
incomplete prerequisite; do not import the old tuning patches as the writer.

**U1 — Profile, resources and normalized intent.** Files: local runner/configuration,
types/profile/intent/fonts/units plus `tests/{profile,intent}.test.ts`. Consumes frozen public model
and verified resource contracts; produces `Preflight`/`ExportIntent` above.

- [x] Establish the isolated package/lockfile with audited local Core0.4.7
  resource identity, `docx@9.13.0`, `tsx@4.23.12`, `typescript@7.0.2` and the
  declared Node floor. The latter two pins reuse inspected Project Control
  tool versions, not a latest-version claim. Define `type-check` as
  `tsc --noEmit` and use the named Node test commands below. Inventory a second
  licensed font family from authorized resources; if unavailable, return a
  located resource prerequisite before U5, without downloading or substituting.
- [x] Add failing cases for both schema variants, legacy/library face identity,
  missing glyph/face/resource, unsupported script/size/fixed content, unknown
  reachable property, CRLF/tab normalization with links, inherited emphasis,
  source mutation during async work and cumulative-grid rounding.
- [x] Implement preflight and derivation; no output side effects on failure.
  Verify every unsupported case has source location and every supported node
  retains normalized logical order/identity. Save a checkpoint after focused checks.

**U2 — Text and block-image contract.** Files: text/images plus
`tests/text-images.test.ts`; consumes U1 intent and produces native paragraphs.

- [x] Add failing Thai/Latin/mixed, regular/bold/italic/boldItalic, available
  concrete faces/sizes, explicit/empty lines, aligned text and frame/alpha image
  cases. Assert C2–C7 without V11/V13 offsets or inherited-style loss. The second
  resource-distinct family branch remains unverified: carry the U1 resource
  prerequisite to U5; this check does not certify multi-family support.
- [x] Implement minimum-line mapping and one image-block wrapper; state its
  structural paragraph footprint/settings in the receipt. Adoption is conditional
  on U5 Word checks; the measured footprint is not yet known. U3 still owns
  required tail/group relationships, with no whole-paragraph keep workaround.
- [x] Run focused semantic/OOXML checks. Later taskU5 must confirm Word line
  origins/image footprint; unit/package PASS is not visual acceptance.

**U3 — Table topology and bounded reading groups.** Files: tables and group
derivation in intent, `tests/tables-groups.test.ts`; consumes U1/U2.

- [ ] Add failing spans/header boundaries, adjacent-table separation, empty
  cells, source padding, repeat headers, allowBreak/rowGroups, short heading
  groups and oversized paragraph/row with trailing-image cases.
- [ ] Implement source-driven tables and bounded group/tail mapping using
  structural/authored boundaries. Keep text split offsets/anchors stable;
  never bind an entire oversized paragraph to its following image. Refuse
  groupLabel or unsafe mandatory groups, rather than weaken preservation.
- [ ] Verify text/image identity, topology and keep-chain bounds, plus renamed
  content/IDs and reordered counterpart cases proving no fixture selector.
  Save a checkpoint after checks; actual split/header/endings await U5.

**U4 — Sections, bands, fields and single writer entry.** Files: sections/bands/
fields/writer/index, `tests/{sections-fields,writer}.test.ts`; consumes U1–U3.

- [ ] Add failing portrait/landscape, continued/restarted/hidden numbering,
  cover/blank/page-break, first/continuation/absent bands, scoped TOC/links and
  unsupported fit/format cases. Assert staged output aborts on fatal/cancel,
  resource mutation or budget exhaustion and exposes no successful partial file.
- [ ] Implement `generateDocxTo` using the one intent path and public entry;
  account for empty paragraphs/section boundary requirements and field refresh.
  Verify package/resource relationships, receipt hash/media type and no imports
  of prior raw XML patch helpers. Save a checkpoint after focused checks.

**U5 — Small cross-document acceptance before SRS.** Files: small fixtures,
evidence/qa and only repairs in U1–U4 owner modules. Consumes unified writer;
produces coverage results, not a generic support declaration from one sample.

- [ ] Freeze three independent source cases: typography with Thai/Latin/mixed
  text/two resource-distinct supported font families/four emphasis states;
  tables with short groups/oversized content/images/header continuation;
  sections with geometry/band modes/numbering/scoped navigation. Reuse structure
  and resources for the existing PDF path and unified DOCX. No SRS/REQ titles.
- [ ] When separately authorized, generate new comparison artifacts without
  altering the PDF implementation/reference. Owner Word export remains the
  established review route; no automatic Word conversion or retries. Record
  actual Word/font environment and refresh fields before navigation acceptance.
- [ ] Inspect every output page or prove exact pixel reuse from reviewed input.
  Check source/normalized text, emphasis/faces, image identity/frame, logical
  rows/groups, real repeated headers and long endings. Measure row extent,
  line pitch, base-letter origin and image footprint independently against
  actual paired outputs; no nominal-formula-only or average-only acceptance.
- [ ] Review each capability and all differences. Visible clipping/loss, unsafe
  keeps, wrong emphasis/resources/navigation or padding compensation fails.
  Different wrapping/pages or native baseline positions may remain only as
  disclosed fidelity limitations accepted by the owner; no invented universal
  point tolerance and no silent downgrade of required semantic relationships.

**U6 — Consolidation decision and return checkpoint.** Consumes U5 evidence;
changes only necessary isolated modules and this existing canonical record.

- [ ] Reconcile required/conditional/deferred matrix against actual evidence;
  unfinished rows stay unverified, not PASS. Reuse evidence only for unchanged
  code/resources/environment. Stop if required support cannot be implemented
  safely and return the specific contract/capability issue before extra cycles.
- [ ] Preserve old scripts/candidates as historical evidence; mark their roles,
  do not delete them or use them in the new runtime. Confirm the new entry
  regenerates outputs solely from shared source/resources, with no SRS files
  or output-package dependency and no source/PDF change.
- [ ] Return the concrete isolated result for review. Full-SRS regression needs
  a later explicit request; product Core/Service/consumer integration remains a
  separate future scope under Stages1–5, including PDF regression/default API
  checks. Passing U6 does not start those stages.

Future isolated task commands (after its local runner exists):
`node --import tsx --test tests/profile.test.ts tests/intent.test.ts` for U1;
use the owning named test file(s) for U2–U4, and all six named files before U5.
Expected meaningful failures precede implementation, then the same cases PASS.
The runner/dependencies must resolve from pinned isolated resources; no install
or package/lockfile mutation is authorized this turn. Product commands, exact
checkout/base and integration tests are resolved only in their future scope.
Run isolated `npm run type-check` with each owning task and before U5; passing
transpiled runtime tests does not substitute for interface/type consistency.

### Review focus, acceptance and current handoff

Five failure families have explicit owners above: (1) missing/replaced font or
unsupported script and inherited emphasis — U1/U2; (2) CR/tab/line splitting
that changes text/link offsets — U1/U3/U4; (3) oversized keeps, header loss or
trailing icon orphan — U3/U5; (4) section/band/field refresh changing body flow
or numbering — U4/U5; (5) partial output/resource mutation/cancel or hidden
capacity assumptions — U1/U4. These checks close the design review focus,
not a claim that tests have been written or run.

Self-review maps C1–C3/C5 to U1; C4/C7 to U2; C6/C8 to U3; C9–C12 to U4;
rendered requirements across all rules to U5 and capability/no-patch decision
to U6. Interfaces use the same names throughout. Required/conditional/deferred
is a support target, while actual statuses remain unimplemented/unverified.
The new plan selects a semantic/native-flow boundary, not acceptance of the
unverified atLeast/image wrapper/Word baseline behavior. Prior results remain
historical evidence, with V13 rejection unchanged and SRS tuning still paused.

Current-turn acceptance is the written mapping rules/profile, isolated module
and task plan, refusal/fidelity boundaries and proof coverage for owner review.
Checks are Project Control `check:data`, local anchors and scope/diff/whitespace,
plus unchanged audit/frozen-input verification. No product tests or Word trials
are claimed. Completion of this planning request does not authorize U1–U6;
reviewable design is the return point, with no implementation method dispatched.


## U1 isolated mapping checkpoint — 2026-10-21

### Authority and acceptance boundary

Owner subsequently authorized the first step only: inspect data/fonts/resources
and implement the shared mapping layer in the existing isolated experiment,
then return results before proceeding. This authorization supersedes the earlier
planning-only restriction for U1 only; it does not authorize U2–U6, SRS trials,
PDF reference/runtime changes or product integration. The older planning and
SRS findings above remain historical, not reopened execution.

Active roles: Planning Partner / isolated implementation / Evidence Reviewer /
Documentation Synthesizer. Work Size medium; Risk Tier routine; execution IDs
N/A for this single-room bounded request. Project Control owns this status;
future product writer ownership remains Core. Markdown pre-action gate:
update this existing canonical plan only, preserve historical evidence, create
no product Markdown or new Work/Phase/Checklist/Evidence/map records.

Allowed writes: this plan and
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer`.
The latter is an isolated private package, not a product checkout or release.
It has no Git initialization; durable source/resource hashes form its checkpoint.
No separate WORK room/return route is opened. One read-only fresh subagent
review was used as required by the selected inline execution skill.

### Implemented and checked

**PASS within U1's intent-only boundary.** The public isolated entry exports
`preflightDocx`, `deriveExportIntent`, profile and unit helpers. It exposes no
`generateDocxTo` or serializer. A genuine preflight owns defensive copies of
source/resource bytes; intent retains normalized logical text and source offset
mapping, inline/link identity, concrete effective font/style, source document,
section provenance, table grid/padding and resource identities. Caller mutation
cannot alter the captured candidate. No content-dependent baseline correction,
SRS selector, font shrinking or padding compensation was introduced.

The local profile checks schema1/2 and node model18/19 fixtures; authored section
membership, reachable graph/unknown fields, fonts/glyphs, image frames (including
cell width), source geometry and selected unsupported capabilities. It quantizes
minimum line spacing and cumulative column boundaries for later native output.
These are intent decisions, not evidence that Word uses the same line origins.

Pinned isolated dependencies: audited local Core0.4.7 archive, docx9.13.0,
tsx4.23.12, TypeScript7.0.2, @types/node24.10.0 and pngjs7.0.0. The latter is a
bounded addition for actual PNG decoding and CRC verification. Runtime tests and
type checking used Node24.15.0; package engine is >=24.15.0 <25. Dependencies
were installed only in the isolated package with install scripts disabled.

Resources: four Sarabun faces and OFL bytes match frozen copies. All13 prepared
PNG resource variants decode and match manifest byte hashes, dimensions and
byte counts. Resource-only inventory did not map or render the SRS document.
No second licensed family was found in the authorized resource inventory;
this is a located **U5 resource prerequisite**, not permission to substitute or
download a font, and multi-family acceptance remains unverified.

Validation tests were written to fail first. Initial24 cases, five self-review
cases and three fresh-review cases now total **32 PASS / 0 FAIL**. The fresh
review reproduced: a legacy alias pointing to the wrong emphasis face, source
provenance pointing to another existing section, and TrueType resources missing
outline tables. Fixes bind legacy selection to concrete weight/style, require
complete matching authored member provenance, and require static outline tables
with bounded glyph locations. The same regression cases pass after correction.
`npm run type-check` also passes. These checks include no renderer or Word call.

### Contract findings and explicit limits

The pinned Core package has no public `validateResolvedDocument` export. The
isolated runtime therefore uses a strict local supported-profile guard, with
no deep import of the private validator and no PDF render merely to validate.
Source inspection found public resolved-section typings permit `content` and
optional modes, while the inspected pinned runtime validator requires
`authored`/`blank`, explicit header/footer modes, and complete authored member
provenance matching section membership. Positive synthetic fixtures were
corrected accordingly. Private validator bytes match the frozen installed
package. **Full Core-validator equivalence is not established**; the mismatch
must be revisited when choosing the future product boundary. It does not prove
an old SRS output invalid, and no historical SRS artifact was re-evaluated here.

Enabled resource/text scope is intentionally bounded: prepared PNG, standalone
static TrueType with Unicode cmap4/12, and Thai/Latin/Common/Inherited script
text with explicit unsupported-script refusal. JPEG, variable fonts and other
font containers are not implemented. The font parser checks metadata, embedding
flags, Unicode coverage and outline extents; it is not a complete font sanitizer
or proof of actual shaping/embedding in Word. License permission is an explicit
caller-supplied resource contract backed by captured license bytes/hash.

U1 does not prove native paragraph/image/table layout, repeated headers, scoped
field behavior, pagination, line origins, actual font embedding, output budgets
or transactional serialization. Those remain U2–U5 obligations. No DOCX/PDF was
created, no Word automation/export was attempted, and no SRS trial, PDF reference,
production dependency/configuration/data/template or product source was changed.

### Durable checkpoint and return point

Isolated evidence paths under the workspace above:

- `evidence/u1-checkpoint.json` — source/test/package-lock/resource hashes,
  review dispositions, validation boundary and unchanged-input receipt;
  SHA256 `ab1cb77d5d05b5a04094e095c5c26893d6772e0f8cf4d898d824ee3aeb981997`.
- `evidence/u1-example-intent.json` — independent tiny authored fixture intent;
  contains no SRS input and is not an output document.
- `evidence/u1-resource-inventory.json` — four concrete faces and13 decoded PNGs.
- `evidence/u1-red.txt`, `u1-review-red.txt`, `u1-final-review-red.txt` and
  their green receipts — failing-before-fix history; final result is
  `evidence/u1-final-green.txt` (32/32) and `evidence/u1-type-check.txt`.

All22 frozen inputs and29 mapping-audit source/evidence files retain their
recorded hashes; the mapping-audit receipt hash is unchanged. The isolated
checkpoint includes all51 comparisons and a reproducible recording script.
Project Control impact is this plan only: check:data passed; all7 local fragment
links resolve; final diff/scope review and whitespace checks passed. No projection
regeneration is needed because no canonical data record changed. Product tests and full
Project Control system checks are outside this documentation-only impact.

**Return point: U1 finished with disclosed limits; stop before U2.** Next planned
step remains native text/image mapping from this intent, after owner review.
Full SRS regression and production/API integration remain separately authorized
future work; absent `Output-Format` must continue to mean PDF in that future API.


## U2 native text and image checkpoint — 2026-10-21

Owner authorized U2 only using small independent fixtures in the existing
isolated workspace, returning before the next step. U1's stop remains historical;
this request opens no registered execution or production scope. Roles: isolated
implementation / Evidence Reviewer / Documentation Synthesizer; Work Size medium,
Risk routine, execution IDs N/A. Current session inline model, no product lane.
The validated Current Truth Snapshot was rebuilt read-only before implementation;
its unrelated frontend roadmap does not authorize this export experiment.

Markdown gate: Project Control canonical update to this existing plan only.
Allowed code writes remain inside `unified-docx-writer` under the experiment root
recorded above; no product Markdown or new Work/Phase/Checklist/Evidence/map
records. Preserve all historical receipts and the U1 checkpoint unchanged.

**PASS for bounded native component and OOXML checks; visual acceptance pending.**
`src/text.ts` and `src/images.ts` consume genuine immutable U1 intent.
`src/profile.ts` adds private intent-to-snapshot binding and defensive resource
access; public `src/index.ts` still exposes no writer. Only the two existing U1
files `src/profile.ts` and `package.json` changed; U1 source/test/resource/lockfile
hash comparisons otherwise match. The test script now includes the U2 cases.
No dependency/lockfile installation or upgrade was needed.

Text mapping preserves normalized logical text, explicit/empty lines, source
alignment, half-point size, concrete face and ordinary/CS emphasis. Native run
and paragraph-mark formatting is explicit, including false bold/italic against
hostile inherited defaults. Thai segments alone receive forced `w:cs`; Latin
and neutral segments retain the same font slots without unconditional CS.
Explicit language context is retained; no document-wide Thai locale is invented.
Content paragraphs use minimum `atLeast` spacing, before/after0. Empty fixed
spacers use the authored exact height. Navigation/fields are refused with a
source path pending U4 instead of being stripped.

Image wrapper: one native inline-drawing paragraph per block, with the original
PNG bytes/alpha, authored frame quantized once to twips/EMU, centered contained
picture geometry, and source left/center/right frame alignment. It is built
before serialization using public `Run`, `BuilderElement` and `Media.addImage`
APIs; no existing DOCX, serialized XML patch or historical tuning helper is read.
The wrapper has before/after0, a1pt paragraph mark and minimum line equal to the
frame height. These are adapter settings, not measured Word line/descent space.
The receipt exposes frame/picture geometry and `wordFootprintVerified:false`.
It introduces no cell-padding shift, raised image run or keep-chain compensation.
Actual Word interpretation of the separate frame/picture extents and offsets,
and whether the wrapper is acceptable, remain U5 obligations before adoption.

### Evidence and review

- Meaningful U2 RED preceded implementation; full isolated suite now **51/51
  PASS**, comprising32 U1 and19 U2 cases. `npm run type-check` PASS.
- A10-paragraph independent fixture includes four emphasis combinations,
 11/12/13/15pt sizes, Thai/Latin/mixed text, explicit/empty lines, an empty fixed
  spacer and three differently aligned PNG frames. It uses no SRS source graph.
- Its small package probe passes a separate Python/lxml inspection: all XML
  parts parse, exact normalized logical text and10 paragraphs retained, three
  drawings, valid media relationships, original PNG byte hashes retained.
  This is structural verification, not a rendered Word result.
- One fresh read-only reviewer independently ran51 tests and type checking;
  no Important/Critical defect or U2 repair was requested. No deferred minors.
- All22 frozen inputs and29 mapping-audit source/evidence files retain hashes.

Durable paths beneath the isolated workspace:
`fixtures/u2-text-images.json`, `qa/generate-u2-probe.mjs`,
`qa/u2-text-images-unverified.docx`, `tests/text-images.test.ts`,
`evidence/u2-red.txt`, `evidence/u2-green-r1.txt`,
`evidence/u2-independent-package-check.json`, `evidence/u2-probe-receipt.json`,
`evidence/u2-final-review.json` and `evidence/u2-checkpoint.json`.
The checkpoint hashes source/tests/fixture/package files and records limits;
SHA256 `dbba7813cc740100704cf1fd684058cca03cebe369ad131d723d08aaa8a4caaa`.
The DOCX is an internal unverified package probe, not a delivered/accepted writer
output. The test harness's minimal section is not U4 section implementation.

### Decisions, limitations and stopping point

Rulings for this bounded stage: retain the explicitly pinned local docx9.13.0
and isolated hash-checkpoint workflow; do not replace them with generic artifact
runtime/cleanup rules. Keep Word/rendered acceptance in U5 and serialize only
small component probes through the test harness. Wrong calls would require
adapter revision in this workspace; package PASS cannot authorize integration.
No public serializer, font embedding, sink/cancel/output-budget contract or
complete DOCX profile is claimed.

Only licensed Sarabun resources were available. The second resource-distinct
family branch remains a U5 prerequisite; multiple-family acceptance is not PASS.
Native extensions and image-footprint behavior need the later Word check.
U4's consolidated receipt must also report source/converted geometry and allowed
quantization adaptations; U2 currently exposes converted settings and retains
original source lengths in the intent. U3 owns table/group/tail preservation;
U4 owns navigation/sections/resources/serialization, and U5 owns actual layout.
These are deferred stage obligations, not waived requirements.

Project Control impact is this plan only. Scope/diff/whitespace and all7 local
fragment links passed; check:data passed. No canonical data record changed,
so projection regeneration is not needed. No SRS document trial,
Word export, PDF reference/render/implementation edit, product source or package
change, DB/template mutation, release or push occurred.

**Stop after U2.** U3 has not started. Owner review is the return point; do not
advance to full SRS or integration from this component checkpoint.
