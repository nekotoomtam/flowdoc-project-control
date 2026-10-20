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
PostgreSQL, multipart task transport และ DOCX/OOXML. `docx` เป็นตัวเลือกสำหรับ
ประเมินใน Stage 0; ยังไม่ได้เลือก dependency หรือรับรองความครอบคลุม.

**Spec:** ข้อกำหนดเจ้าของและสัญญาในเอกสารนี้ โดยเฉพาะ
[Agreed design](#agreed-design) และ [API contract](#api-contract).
รวม design และ staged plan ไว้ไฟล์เดียวตาม Document Budget.

## Authority Boundary

Owner: FlowDoc Project Control สำหรับข้อตกลงและลำดับงานร่วม;
`flowdoc-core` สำหรับ document semantics/writer, `flowdoc-service` สำหรับ
HTTP/task/storage และ `plugins/flowdocmake` สำหรับตัวเรียกใช้.

Role: Planning Partner / Documentation Synthesizer. คำขอเจ้าของวันที่
2026-10-20 คือบันทึกแผนก่อน. สถานะ: **planning recorded; implementation not started**.
Work/Phase/Checklist/execution IDs: N/A สำหรับการวางแผนห้องเดียวนี้.
ไม่เปิด execution context ที่ปิดแล้วกลับมา.

Work Size: medium สำหรับการวางแผน; implementation แบ่งตาม stages ด้านล่าง.
Risk Tier: routine สำหรับเอกสารนี้; product stages มีความเสี่ยงเรื่องความครบถ้วน
และ compatibility ซึ่งต้องตรวจตามขอบเขต ไม่ใช่เหตุให้ประกาศ critical โดยอัตโนมัติ.
Work authority รอบนี้: เขียนแผนใน Project Control พร้อมอ่าน source ที่เกี่ยวข้อง.

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

- [ ] ทำ matrix จาก node/props ใน `src/composition/resolvedDocument.ts` และ
  semantics ใน template/layout ที่เกี่ยวข้อง; ระบุ direct mapping, adaptation,
  หรือ unsupported พร้อม fixture. รวม text/inlines/line/page break, tables,
  spans/rowGroups/group labels, images, Section18/19, cover/blank,
  header/footer/columns/placement, fixed sizing, links/anchors, scoped TOC และ page fields.
- [ ] ตรวจ fixed formats และ overflow: PDF ปัจจุบันมีบางกรณี omit พร้อม warning
  แต่ fixed text บางกรณี fail. DOCX ต้องไม่คัดลอกการ omit มาโดยเงียบ.
  ถ้ารักษาเนื้อหาครบในข้อจำกัดเดิมไม่ได้ ให้รายงาน unsupported/failure;
  การเปลี่ยน sizing semantics ต้องเป็นข้อตกลงที่ระบุใน matrix ก่อน implementation.
- [ ] พิสูจน์ทางทำ Word sections/bands, row-group continuation และ page fields/TOC
  โดยเฉพาะ total ที่ไม่นับบางหน้า, restart/hide และ scope. ไม่ hard-code หน้า PDF.
  ระบุวิธีให้ค่า fields ที่เห็นใน Word ถูกต้อง รวมการ refresh อัตโนมัติหรือ
  ขั้นตอนที่ผู้รับต้องทำ; ขั้นตอนเพิ่มเติมต้องเปิดเผยก่อนรับการรองรับนั้น.
- [ ] ประเมิน dependency จาก official documentation และ version จริง:
  API coverage, OOXML validity, licenses, supported Node/runtime, image/font handling,
  ZIP buffering/peak memory, output limit และ abort. `docx` เป็น candidate แรก;
  ถ้าขาดความสามารถให้เสนอ adapter/OOXML เฉพาะจุดหรือทางเลือกพร้อมเหตุผล.
- [ ] ตรึง dependency/version และ interfaces ของ Stage 1 ในเอกสารนี้ก่อนเริ่ม code.
  กำหนด resource contract สำหรับ DOCX PNG/JPEG และ font identities โดยรักษา
  alpha/dimensions/source association; ไม่บังคับใช้ raw PDF RGB-deflate เป็น DOCX media.
- [ ] เลือก frozen input ชุดเดียวกันสำหรับสอง output พร้อม hashes และ coverage map.
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
  inherited/first/continuation bands, columns/placement และ page numbering.
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
| DOCX dependency/version และ complex-feature mapping | Blocking ต่อ implementation ที่พึ่งพา; Stage 0 ปิดก่อนเลือก writer |
| Fixed/overflow และ PDF omission ต่างจากเป้าหมายครบถ้วน | Blocking ต่อ parity claim; Stage 0 กำหนด fail/adaptation โดยไม่เปลี่ยน PDF |
| Word field refresh และ page-total semantics | Blocking ต่อ fields/TOC acceptance; Stage 0 decision และ Stage 5 proof |
| Font embedding/resource conversion และ ZIP memory peak | Blocking ต่อ resource contract; Stage 0–1 ตรวจจริง |
| Word รุ่น/font environment ที่ใช้ review | Blocking ต่อ visual acceptance; บันทึกก่อน Stage 5 |
| Google Docs, LibreOffice, Word บนระบบอื่น | Deferred; ไม่อยู่ใน acceptance รอบนี้ |
| DOCX import/round-trip editing, frontend UI, both formats in one request | Deferred; ไม่อยู่ในขอบเขต |

Model decision: เอกสารนี้เป็น inline planning ภายใต้คำขอปัจจุบัน ไม่สร้าง
registered execution/model snapshot. ก่อนเริ่ม product stages ให้ resolve
model/effort จาก host availability จริงตาม workflow policy; PLAN สำหรับงาน
ข้าม owner มี default `gpt-6-astra` / `medium`, แต่ WORK เลือกแยกตาม stage
และไม่ inherit. ไม่อ้างว่าเปลี่ยน model ของ chat นี้แล้ว.

Next action หลังเจ้าของให้เริ่ม: Stage 0 แบบ discovery-only; กลับมาสรุป mapping,
dependency/interface และข้อจำกัดในเอกสารนี้ก่อน implementation. ห้องเดียว
เป็นค่าเริ่มต้นที่เพียงพอ; worktree isolation เลือกตาม concurrent changes และ risk.
ถ้าจะเปิด separate WORK room จริง ต้องมีเหตุผลและ return/ownership controls
ตาม workflow policy ก่อน dispatch. ไม่มี return route ที่สังเคราะห์ในรอบแผนนี้.

## Planning verification — 2026-10-20

ตรวจ source locators และ contract dependencies ระหว่างวางแผนแล้ว.
Self-review ครอบคลุม agreed requirements, dependencies/interfaces, defaults,
consumer/storage impact, acceptance coverage และ discovery/implementation boundary.
ตรวจ local Markdown links/anchors, `git diff --check` และ `npm run check:data` ผ่าน.
เปลี่ยนเฉพาะเอกสารนี้; ไม่มี canonical record หรือ generated projection เปลี่ยน.
Product feature stages ทั้งหมดยังไม่รัน; ไม่มี DOCX artifact หรือ runtime PASS ในรอบนี้.
