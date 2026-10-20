# FlowDoc DOCX Export Implementation Plan

> For agentic workers: execute only the authorized stage. Use
> `superpowers:executing-plans` for inline implementation, or
> `superpowers:subagent-driven-development` when that execution method is selected.
> This planning request does not start implementation or a registered execution round.

**Goal:** ใช้โครงสร้างเอกสารและข้อมูลชุดเดียวกันสร้าง PDF หรือ DOCX;
`Output-Format` ที่ไม่ส่งมาต้องให้ PDF ตามเดิม.

**Architecture:** ประกอบ template และข้อมูลเป็น `ResolvedDocument` ด้วยทางเดิม
แล้วเลือก PDF renderer หรือ DOCX writer. Core เป็นเจ้าของการแปลงเอกสาร;
Service เป็นเจ้าของตัวเลือกในคำขอ การตรึงงาน คิว การเก็บ และการส่งผลลัพธ์.
FlowDocMake เป็น consumer ที่ต้องรับชนิดไฟล์ตามที่ขอได้.

**Tech Stack:** TypeScript/Node.js, Core document composition, Service/Fastify,
PostgreSQL, multipart task transport และ DOCX/OOXML. Stage 0 เลือก
`docx@9.13.0` เป็น research-selected candidate สำหรับ bounded proof ถัดไป;
ยังไม่ติดตั้ง ทดสอบ หรือรับรองความครอบคลุมของ dependency ในระบบจริง.

**Spec:** ข้อกำหนดเจ้าของและสัญญาในเอกสารนี้ โดยเฉพาะ
[Agreed design](#agreed-design) และ [API contract](#api-contract).
รวม design และ staged plan ไว้ไฟล์เดียวตาม Document Budget.

## Authority Boundary

Owner: FlowDoc Project Control สำหรับข้อตกลงและลำดับงานร่วม;
`flowdoc-core` สำหรับ document semantics/writer, `flowdoc-service` สำหรับ
HTTP/task/storage และ `plugins/flowdocmake` สำหรับตัวเรียกใช้.

Role: Planning Partner / Documentation Synthesizer. คำขอเจ้าของวันที่
2026-10-20 เริ่มจากบันทึกแผน และต่อมาอนุญาต Stage 0 สำรวจ mapping/เลือกเครื่องมือ.
สถานะ: **source/docs discovery complete; implementation-entry prerequisites open**.
ผลสำรวจอยู่ใน [Stage 0 discovery results](#stage-0-discovery-results).
Work/Phase/Checklist/execution IDs: N/A สำหรับการวางแผนห้องเดียวนี้.
ไม่เปิด execution context ที่ปิดแล้วกลับมา.

Work Size: medium สำหรับการวางแผน; implementation แบ่งตาม stages ด้านล่าง.
Risk Tier: routine สำหรับเอกสารนี้; product stages มีความเสี่ยงเรื่องความครบถ้วน
และ compatibility ซึ่งต้องตรวจตามขอบเขต ไม่ใช่เหตุให้ประกาศ critical โดยอัตโนมัติ.
Work authority รอบนี้: source/docs discovery และบันทึกผลในแผน Project Control;
ไม่ทดลอง library หรือสร้าง DOCX candidate.

Allowed mutation: เอกสารนี้เท่านั้น. ไม่แก้ Core, Service, plugin runtime,
installed package, configuration, DB, Docker, template หรือเอกสารผู้ใช้.
ไม่สร้าง release/tag/push/install และไม่เปลี่ยน system/DOCUMENT_MAP.
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
