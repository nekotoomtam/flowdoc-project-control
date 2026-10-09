# FlowDoc: ข้อความและรูปหลายชิ้นในเซลล์ — Implementation Plan

> For agentic workers: execute sequentially inline using executing-plans after
> owner review. This plan does not dispatch another room or reopen a closed round.

**Goal:** หนึ่งเซลล์เรียง TextBlock และ Image หลายชิ้นได้ ส่งข้อมูลผ่าน API เดิม
แล้วได้ PDF ที่ไม่ทับกัน ไม่หาย และข้ามหน้าได้ตามกติกาที่ระบุด้านล่าง

**Architecture:** ใช้ `TableCell.childIds` และชนิด node เดิม เพิ่มการวัดเนื้อหา
เซลล์เป็นลำดับบรรทัดข้อความ/กรอบภาพ แล้วให้ทางจัดหน้าตารางทั้งธรรมดาและรวมเซลล์ใช้ร่วมกัน
Service ใช้ขั้นเตรียมภาพเดิม ไม่ย้ายหน้าที่จัดหน้าออกจาก Core

**Tech Stack:** TypeScript, Vitest, Core PDF runtime เดิม; Service/Fastify,
PostgreSQL, Sharp และระบบ upload/job เดิม

**Spec:** [ร่างโครงสร้างและขอบเขตพาร์ต 1](flowdoc-export-node-structure-draft-2026-10-09.md)

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Status: implemented and accepted for development 0.1.6, 2026-10-09.
Original proposal and execution history retained below; this plan is not runtime Evidence.
ขอบเขตลูกโดยตรงได้รับการยอมรับแล้ว แต่กติกาละเอียดด้านล่างเป็นข้อเสนอให้ตรวจรอบนี้
ไม่ได้หมายความว่าร่างสถาปัตยกรรมทั้งหกพาร์ตผ่านแล้ว
Current work: inline planning; execution/Phase/Checklist IDs N/A.
Work Size: medium implementation, split into four sequential tasks. Risk: routine.
Product owners: Core (contract/layout/PDF), Service (consumer/resource/job proof).
ฐานที่ตรวจ: Core `d95701f`, Service `2a69fd6`, ทั้งสองเป็นชุดพัฒนา 0.1.5
ไม่มีการแก้ product, DB, release, tag หรือ DOCUMENT_MAP ในงานร่างแผนนี้

## Global Constraints

Owner clarification หลังร่างแผน: คง slice นี้เป็นลูก TextBlock/Image โดยตรง
เรื่อง array ภาพตามรายการและ area รับโครงย่อยเก็บไว้พาร์ต 5 ของ
[ร่างหลัก](flowdoc-export-node-structure-draft-2026-10-09.md) และ compatibility พาร์ต 6
ไม่ต้องทำ area ก่อน Task 1 และไม่ถือว่าการรับแนวคิด area อนุมัติขยาย scope แผนนี้
กฎข้ามรายการผิดพร้อม warning ที่ตกลงสำหรับ area ไม่เปลี่ยน validation ของ slice นี้

- เนื้อหาใน cell เป็น TextBlock/Image โดยตรงตามลำดับ `childIds` เท่านั้น
- ไม่เพิ่ม Columns, container, ตารางซ้อน, area, การเรียกโครงย่อยซ้อนใน cell, ตัวแปรกลุ่ม
  หรือ array ภาพแบบใหม่; โครงย่อย/แถวซ้ำที่มีอยู่ยังใช้ขอบเขต binding เดิม
- ไม่ทำ frontend, DOCX, DB migration, queue redesign หรือ image API ใหม่
- authored node ไม่เปลี่ยน ID เพราะขึ้นหน้าใหม่; ผลวาดรักษา node ID/source mapping เดิม
- ใช้ฐานพัฒนา; ไม่แตะ `release` จนกว่างานผ่านและเจ้าของสั่งเลื่อนรุ่น
- เสนอ model version 9 เพื่อแยกความสามารถใหม่จาก 4–8; ต้องรักษา feature gate
  ของภาพ ลิงก์ สารบัญ และเลขหน้า ไม่ใช้เงื่อนไข `=== 8` จนรุ่นใหม่ปิดของเดิม
- รุ่นซอฟต์แวร์เสนอเป็น 0.1.6 ของสอง repo ตอนส่งมอบ ไม่ใช่การอนุมัติ release ในเอกสารนี้
- ก่อนเริ่ม code อ่าน AGENTS ของ owner ตรวจ base/สถานะปัจจุบัน และแยก worktree
  หากมีงานอื่นชน; ไม่ต้องสร้างห้องหรือทะเบียน execution เพียงเพื่อทำงานนี้
- Model สำหรับ WORK ต้องเลือกแยกจาก PLAN ตาม host availability ตอนเริ่มจริง;
  ไม่มี WORK ถูก dispatch และไม่มีการอ้างว่าเปลี่ยนโมเดลของห้องนี้แล้ว

## กติกาที่เสนอให้ใช้ในชุดแรก

Owner clarification: padding กำหนดในแม่แบบได้ ค่า 0 ต้องรักษาเป็น 0
ใช้ค่าเริ่มต้น 4pt ต่อด้านเฉพาะเมื่อไม่ได้ระบุ ไม่ใช้ truthy fallback แทนค่า 0
เจ้าของยืนยันสัญญา: `TableCell.props.padding` เป็น object ที่มี top/right/bottom/left
แต่ละด้านเป็น Length `{value:number, unit:'pt'|'mm'}` และละด้านได้
ไม่ระบุ padding ทั้งชุดใช้ 4pt ทุกด้าน; ไม่ระบุบางด้านใช้ 4pt เฉพาะด้านที่ขาด
ระบุ 0 ใช้ศูนย์จริง ไม่มี shorthand เพิ่มในชุดแรก
ปฏิเสธค่าที่ไม่ใช่จำนวน finite ค่าติดลบ หน่วยไม่รองรับ หรือรูปข้อมูลผิด
เมื่อทราบความกว้าง cell/เซลล์รวม ถ้าหัก padding ซ้าย–ขวาแล้วไม่เหลือพื้นที่เนื้อหา
ให้แจ้งข้อผิดพลาดก่อนจัดวาง แปลงเป็น pt และเติม default ครั้งเดียวต่อ cell ต่อ
layout pass แล้วใช้ผลเดียวกันตลอดการวัด วางภาพ และแบ่งหน้า
นี่เป็นค่าของแม่แบบ ไม่ใช่ค่าที่ผู้เรียก generation API ต้องส่ง
ข้อความ 4pt ในตารางด้านล่างหมายถึงค่าเริ่มต้น ไม่ใช่ระยะตายตัว
Task 1 ต้องตรวจค่าที่ไม่ถูกต้องและความเข้ากันได้; Task 2–3 ต้องใช้ padding
ที่ resolve แล้วชุดเดียวกันในการวัด ความกว้าง การแบ่งหน้า และวาดกรอบ

| เรื่อง | กติกา |
| --- | --- |
| ลำดับ | ข้อความ → รูป → คำบรรยาย หรือหลายชิ้นต่อกันตาม childIds; คำบรรยายเป็น TextBlock |
| ความสูง | วัดข้อความจริงรวมกับความสูงกรอบภาพ และ padding เซลล์เดิม 4pt บน/ล่าง |
| ความกว้าง | พื้นที่เซลล์หรือเซลล์รวม หัก padding ซ้าย/ขวาอย่างละ 4pt |
| ภาพ | ใช้กรอบ width/height เดิม รักษาสัดส่วนแบบ contain และ align ซ้าย/กลาง/ขวาภายในพื้นที่เซลล์ |
| ระยะระหว่างลูก | ไม่เพิ่ม gap อัตโนมัติ; รักษาความสูงบรรทัด/บรรทัดว่างตามข้อความ |
| ข้ามหน้า | ข้อความแยกที่บรรทัด; กรอบภาพไม่ผ่า ถ้าไม่พอพื้นที่คงเหลือให้ไปหน้าถัดไป |
| ภาพใหญ่เกิน | ถ้ากรอบกว้างเกินเซลล์ หรือสูงเกินหน้าว่างหลังหักหัวตารางและ padding ให้ error ระบุ node; ไม่ย่อกรอบเงียบ ๆ |
| ภาพหาย/โหลดไม่สำเร็จ | ใช้ warning และกรอบว่างตามนโยบายเดิม ไม่ทำให้ตำแหน่งเนื้อหาถัดไปเปลี่ยน |
| แถวห้ามแยก | รักษา allowBreak=false; แถวที่ใหญ่กว่าพื้นที่หน้าให้ error ตามเดิม |
| หัวตารางซ้ำ | วาดลูกซ้ำตามหัวตาราง ใช้ทรัพยากรภาพที่เตรียมแล้วร่วมกัน |
| คำบรรยาย | ยังไม่บังคับติดภาพข้ามหน้า; keep-with-next/กลุ่มภาพกับคำบรรยายเป็นงานถัดไป |

ตัวอย่าง fixture: cell มี `childIds: [description, evidenceImage, caption]`
โดย description/caption เป็น text-block และ evidenceImage เป็น image ที่ผูก
ตัวแปรภาพ global/local เดิมเข้ากับ resourceId จาก upload; ไม่สร้าง source kind ใหม่
สร้างแถวหลายรายการด้วยวิธีประกอบเดิม พร้อมข้อความยาวและรูปแนวตั้ง/แนวนอน

## Review Focus

1. สัญญารุ่นใหม่ทำให้เอกสารเก่าหรือสารบัญหาย — พิสูจน์ใน Task 1 และ 4
2. วัดกรอบภาพกับพื้นที่วาดไม่ตรง ทำให้ทับ/เว้นผิด — Task 2
3. rowspan/header ข้ามหน้าแล้วรูปซ้ำ หาย หรือวนไม่จบ — Task 3
4. ผูกข้อมูล/เตรียมภาพเห็นเฉพาะรูปที่ราก — Task 1 และ 4
5. ส่วนต่อเนื่องสูญเสีย node identity หรือเปลี่ยนต้นฉบับ — Task 2–4

## Task 1 — สัญญาข้อมูลและการประกอบ

Files (Core): `src/composition/resolvedDocument.ts`, `src/template/types.ts`,
`src/template/validateTemplate.ts`, `src/template/validateGraph.ts`,
`src/composition/validateResolvedDocument.ts`, `src/composition/composeDocument.ts`,
`src/binding/expandRows.ts`; ทบทวน feature gates ใน `src/layout/pageNumbers.ts` ด้วย
แก้เฉพาะไฟล์ที่จำเป็นจากผลทดสอบ

- [x] เพิ่ม failing tests ใน `tests/template/cellContent.test.ts` และ
  `tests/composition/cellContent.test.ts`: รับลูกหลายชนิดใน model 9,
  รุ่นเก่ายังปฏิเสธ image child, ปฏิเสธ nested table/container และ ID อ้างไม่ถึง
- [x] เพิ่ม model 9 โดยไม่เพิ่ม node type หรือเก็บพิกัดจัดหน้าลงต้นฉบับ
- [x] เพิ่มสัญญา padding ตามที่เจ้าของยืนยันข้างต้น พร้อม tests: ไม่ระบุทั้งชุด,
  ระบุบางด้าน, explicit 0, pt/mm, ค่าผิด และพื้นที่เนื้อหาไม่เหลือ
  ทดสอบว่าค่าเริ่มต้นรักษาผลตารางเดิม และระบุขอบเขตรุ่นโมเดลที่รับ field ใหม่
- [x] พิสูจน์ global/local image binding, แถวซ้ำตามข้อจำกัดเดิม,
  sourceMap/instance IDs และลำดับ childIds; ไม่ขยายชนิดตัวแปรในงานนี้
- [x] รัน `npm test -- tests/template tests/composition tests/binding` และ
  `npm run build`; ตรวจ diff แล้ว commit เฉพาะงานนี้

**Done:** โครงแบบใหม่ประกอบสำเร็จและตรวจข้อมูลผิดได้ก่อนจัดหน้า
ยังไม่ถือว่า export ภาพในเซลล์ผ่านจน Task 2–4 จบ

## Task 2 — วัดและวางในตารางธรรมดา

Files (Core): ใหม่ `src/layout/measureCellContent.ts`, แก้ `src/layout/documentFlow.ts`;
ใหม่ `tests/layout/cellContentFlow.test.ts` และ reuse `tests/layout/documentFlow.test.ts`

สัญญาภายในที่เสนอ: `MeasuredCellItem` เป็น union
`{kind:'text-line', nodeId, height, line:MeasuredLine}` กับ
`{kind:'image-frame', nodeId, height, frameWidth, align, resourceId}`.
`measureCellContent(document, childIds, contentWidth, runtime)` คืนลำดับหน่วยเหล่านี้
การวาดใช้หน่วยและ geometry เดียวกับการวัด; unit สูงเท่ากรอบ ไม่ใช่แค่พื้นที่ภาพจริง
ไม่ export สัญญาชั่วคราวนี้เป็น API หน้าบ้าน

- [x] เขียน red tests สำหรับ text→image→text, หลายภาพ, align ทั้งสาม,
  missing resource, ข้อความไทย และภาพใกล้ท้ายหน้า
- [x] เพิ่ม shared measurement และการวาด frame แบบ contain โดยคง root image behavior
- [x] ปรับ cursor ของ cell ให้กินหน่วยข้อความหรือภาพได้; ย้ายภาพทั้งกรอบ
  ตรวจ no-progress และ oversize ก่อนเกิดหน้าว่างต่อเนื่อง
- [x] ทดสอบ nodeId เดิมบนทุกหน้า, ต้นฉบับไม่ถูกแก้, เส้นกรอบครอบเนื้อหา,
  legacy text-only positions ไม่เปลี่ยน และ allowBreak=false
- [x] รัน `npm test -- tests/layout/cellContentFlow.test.ts tests/layout/documentFlow.test.ts tests/layout/textFlow.test.ts tests/pdf/images.test.ts`
  ตามด้วย build, diff review และ commit

**Done:** ตารางธรรมดาวัดและวาดลูกหลายชนิดถูกต้อง รวมกรณี error ที่จบได้แน่นอน

## Task 3 — เซลล์รวมและหัวตารางซ้ำ

Files (Core): `src/layout/mergedTableFlow.ts`, `src/layout/documentFlow.ts`,
`tests/layout/mergedTableFlow.test.ts`, ใหม่ `tests/layout/mergedCellContent.test.ts`

ปรับ `TablePageSink` ให้ส่งหน่วยภาพได้ พร้อมคงทาง emitLine สำหรับข้อความ
ใช้ MeasuredCellItem จาก Task 2 และ offset/drawn tracking เดิมเป็นหลัก
ไม่สร้าง paginator อีกชุดสำหรับภาพ

แบ่ง Task 3 เป็นสามพาร์ตตามลำดับ ตรวจแต่ละพาร์ตก่อนต่อขั้นถัดไป:

### 3A — เตรียมความสัมพันธ์ตาราง

- [x] อ่านตัว resolve grid เดิมก่อนแก้ แล้วเตรียมแผนผังเซลล์รวมหนึ่งครั้งต่อ
  table instance ต่อการจัดหน้าหนึ่งรอบ: owner cell, ช่วงแถว/คอลัมน์ และความกว้าง
- [x] ตรวจ span ทับกัน/อ้างผิดก่อนแบ่งหน้า ตำแหน่งที่ถูกครอบอ้างเซลล์หลัก
  ไม่กลายเป็นเจ้าของเนื้อหาอีกชุด; ไม่เพิ่ม cache ข้ามรอบ
- [x] ตรวจด้วยตัวนับการเรียกที่ขอบเขตเตรียมตาราง: ตารางเดียวหลายหน้าต้องเตรียม
  ครั้งเดียว สอง table instances ต้องเตรียม instance ละครั้ง ไม่ใช้ผลผิดตัว
  ขอบเขตนี้คือ layout pass; ไม่อ้างว่าต้องตัด validation ในขั้นรับแม่แบบออก

### 3B — วัดเนื้อหาเซลล์หลัก

- [x] วัดเฉพาะ owner cell ด้วยความกว้างหลังหัก padding แล้วเก็บหน่วยเนื้อหาไว้ใช้
  ตลอด layout pass; covered positions ไม่วัดซ้ำและไม่คัดลอกเนื้อหา
- [x] ตรวจหลายเซลล์รวมในตารางเดียว ทั้ง colspan/rowspan และเพื่อนข้างกันสูงต่างกัน
  รวม padding 0, ค่าเริ่มต้น และค่ากำหนดเอง; repeated header ใช้ผลวัดเดิม
- [x] ตรวจทั้งจำนวนการวัดและผล geometry/ลำดับเนื้อหา ไม่ใช้เพียงตัวนับเป็นหลักฐาน

### 3C — แบ่งหน้า วาด และใช้ผลเตรียมซ้ำ

- [x] pagination อ่านแผนผังและหน่วยที่วัดแล้ว; ยังคำนวณพื้นที่คงเหลือ จุดตัด
  และ offset ต่อหน้าได้ แต่ไม่สร้างความสัมพันธ์เซลล์รวม/วัดข้อความใหม่ทุกหน้า
- [x] ใช้ชุดกรณีด้านล่างตรวจเส้นกรอบและเนื้อหาทุกส่วน รวมกรณีไม่มีความคืบหน้า
  ไม่เพิ่มชุด stress/benchmark แยกในรอบนี้

- [x] เริ่มด้วย red tests: colspan, rowspan ข้ามหลายหน้า, cell ข้างกันยาวไม่เท่ากัน,
  ภาพใน repeat header และภาพที่พอดี/ใหญ่กว่าพื้นที่หลังหัก header
- [x] เปลี่ยนการคำนวณ cut/row heights ให้ใช้ความสูงทั้งกรอบภาพอย่างสอดคล้องกัน
- [x] พิสูจน์ว่ารูป body วาดครั้งเดียวต่อ instance; รูป header ซ้ำเฉพาะหน้าที่มีหัวตาราง
  ไม่มีเนื้อหาหาย วาดทะลุกรอบ หรือ pagination วนไม่จบ
- [x] รัน `npm test -- tests/layout/mergedTableFlow.test.ts tests/layout/mergedCellContent.test.ts tests/layout/cellContentFlow.test.ts`
  ตามด้วย build, diff review และ commit

**Done:** ตารางที่มีความสามารถรวมเซลล์เดิมใช้ลูกแบบใหม่ได้ด้วยกติกาเดียวกัน

## Task 4 — PDF จริงและการเรียกผ่าน Service

Files (Core): ใหม่ `tests/consumer/checkCellContent.mjs`,
เชื่อมกับ `scripts/checkPackedConsumer.mjs`; package metadata เมื่อยืนยันรุ่นแล้ว
Files (Service): ใหม่ `tests/cell-content-api.test.mjs`, package/lock/vendor manifest;
ตรวจ consumers `src/jobs/admission.ts`, `src/images/job.ts`, `src/jobs/processor.ts`
และ renderer ที่เรียกอยู่จริงก่อนแก้ มีปัญหาค่อยแก้เฉพาะทางที่เกี่ยวข้อง

จาก discovery admission และ prepareJobImages ใช้ image nodes จากทั้ง graph แล้ว
จึงคาดว่าไม่ต้องเพิ่ม DB/API แต่ต้องพิสูจน์ผ่านแพ็กเกจจริง ไม่ถือว่าผ่านจากการอ่านโค้ด

- [x] สร้าง fixture ประมาณ 12 แถว ใช้ภาพ 3 แหล่งร่วมกัน พร้อมข้อความไทยยาว,
  cell หลายลูก, merged cell, repeat header, ลิงก์และสารบัญไปหัวข้อหลังตาราง
  จำนวนหน้าเป็นผล layout ไม่เดาจำนวนตายตัวก่อนสร้าง
- [x] ตรวจ PDF ที่ render แล้วทุกหน้าของ fixture: ขอบเซลล์ ตำแหน่ง/สัดส่วนภาพ
  ลำดับข้อความ หน้าเป้าหมายลิงก์/สารบัญ; เก็บ PDF และผลตรวจไว้ใช้ซ้ำ
- [x] รัน Core `npm test`, `npm run build`, `npm run check:package`
  หนึ่งรอบก่อนส่งแพ็กเกจ เนื่องจากสัญญารุ่นโมเดลกระทบ consumers ทั้งหมด
- [x] Service ใช้ tarball ที่สร้างจาก candidate เท่านั้น; เพิ่ม real-DB API test
  สำหรับ publish template→finalized upload→job→download PDF และ missing image warning
- [x] รัน Service build และ tests ที่กระทบ: cell-content-api, image-api,
  merged-table-api, contents-api, version-boundary, processor พร้อมฐานข้อมูลทดสอบ
  ห้ามนับ test ที่ skip หรือไม่มี DB เป็น PASS
- [x] เจ้าของตรวจ PDF ตัวอย่างหนึ่งชุด; ไม่ต้องให้ลองซ้ำทุก unit case
- [x] บันทึกผลในแผนนี้และหลักฐานเดิมที่เกี่ยวข้องก่อน commit/integrate ชุดพัฒนา
  เก็บ release ไว้เดิม และเก็บกวาดเฉพาะ lane งานนี้ที่ clean/merged ตาม policy

**Done:** API เดิมสร้าง PDF ที่มีข้อความและภาพร่วมในเซลล์ได้จริงจาก package candidate

## Proof / Document Budget และจุดหยุด

Document Budget: แผนนี้หนึ่งไฟล์และ link/status ในร่างเดิม ไม่สร้างรายงานราย task
Proof Budget: focused red/green tests ต่อ task, Core package verification หนึ่งรอบ,
Service impacted real-DB tests หนึ่งรอบ, fixture PDF หนึ่งชุดและ visual review หนึ่งรอบ
ใช้ผลเดิมซ้ำเมื่อ candidate/สิ่งแวดล้อมที่เกี่ยวข้องไม่เปลี่ยน; เพิ่มรอบเมื่อพบ failure จริง
การตรวจแผนรอบนี้: self-review coverage + links/diff + Project Control check:data
ไม่อ้างผลทดสอบ runtime ใหม่จากการเขียนเอกสาร

Original prerequisite (now satisfied): เจ้าของ review กติกาขนาดภาพ/การข้ามหน้าในแผนนี้
Deferred: arbitrary nesting, cell subformats, frontend editing API, keep-with-next,
image arrays, stress/concurrency redesign และ DOCX
เมื่อ acceptance ของสี่ task ผ่านให้จบ slice; ไม่ต่อหกพาร์ตหรือ performance tuning เอง
ถ้าต้องเปลี่ยน public binding, schema DB หรือกติกาตารางเดิม ให้หยุดเสนอผลกระทบก่อนขยาย

## สถานะ

### Development closeout — 2026-10-09

Owner reviewed the sample as acceptable and authorized continuing the proposed
0.1.6 closeout. All four implementation tasks are accepted within the direct-cell
scope. This supersedes the pending-delivery status in the historical ledger below;
its previous candidate results and acceptance history are retained.

- Core development `codex/template-binding`: `4546a1899bcdf2defe2a0c9976cdf90250c309d1`,
  package 0.1.6. Service development `codex/template-registry`:
  `eb41b697085a66a7123313572024285436e0acde`, package 0.1.6.
- Core versioned candidate: fresh 250/250 tests, build and isolated Linux/amd64
  packed consumer PASS. Service versioned consumer: Docker build/vendor identity
  and 16 real-DB/API tests PASS, zero failed/skipped. No runtime repair in closeout.
- Core tarball SHA256:
  `e24ef044ea68a6d36694759cd1a7a39fbc1a1fe8ae77e265e22c38671c988981`.
  Service package/lock/manifest pin this exact artifact and Core source commit.
  Retired the temporary candidate vendor filename; released 0.1.5 remains intact.
- Final PDF remains byte-identical to the owner-reviewed 15-page fixture,
  SHA256 `fcb7cca72ba05065f0272bab2c7cbaeee1d32ad1a55d98896c5f827b6d12d27d`.
  Visual proof reused; no additional owner trial required for metadata-only changes.
- Local fast-forward integration preserved the exact tested commits. Proof reused
  after integration; no conflict, source, dependency or configuration changes.
- Both current-round worktrees and their `codex/cell-content` branches were removed
  only after clean/merged checks. All ignored artifact files were copied and
  SHA256-verified before removal; archive manifests record every retained file.
- Core artifact root: `../flowdoc-core/artifacts/worktree-archive/flowdoc-core-cell-content/`.
  Final package/PDF/proof: `1791536347578/`; previous `1791535765151/` and visual
  rendering in `1791535582773/` remain under that same archive root.
- Service artifact root: `../flowdoc-service/artifacts/worktree-archive/flowdoc-service-cell-content/`.
  Final consumer proof: `1791536451120/result.json`; previous proof `1791535841549/`.
  Historical paths below resolve through these archive roots after cleanup.
- Release branches unchanged: Core `9ee6526263368ce18bf139d70adce1f000a3ccba`,
  Service `3293a0519824ade1919da8857a017dd1c2224e07`. No push, tag, release promotion,
  DB migration or DOCUMENT_MAP promotion. Project Control records this bounded
  development delivery; it does not certify the entire six-part roadmap.

Limits remain: synthetic image fixture, direct TextBlock/Image cell children only;
no Columns/nested tables/area/image-array extension, DOCX or stress admission.
Next work is an owner-selected remaining design part; do not expand automatically.

### Inline execution ledger — 2026-10-09

Owner authorized implementation in this conversation. Role: Product Implementation
Agent (Core), with Project Control maintaining this existing ledger. No registered
execution IDs or separate WORK room. Core lane: `../flowdoc-core-cell-content`,
branch `codex/cell-content`, base `d95701f`. Core primary/release remain untouched.
Native worktree tool targets the chat's Project Control repo, not Core; use manual
Core worktree for this cross-repository lane. This ledger replaces product-local
skill scratch Markdown to retain Project Control documentation ownership.

Pre-flight: Task 1 model/padding feeds Task 2 measurement; Task 2 measured units feed
Task 3 pagination; Task 4 consumes packed Core, not source checkout imports.
Ruling: model 9 uses a shared table-content paginator based on the existing merged
algorithm, while model 4–8 keep their layout paths. This avoids two new padding/image
implementations and preserves old behavior; cost is maintaining a legacy path until
a separately verified consolidation. Grid preparation remains once per table/layout
pass; validation may independently validate topology before layout.
Task 1: contract/template/composition tests RED (7 unsupported-feature failures),
then GREEN 106/106 targeted tests plus build. Added padding-width RED→GREEN and
global image repeat/source-identity checks. No version bump or release promotion.
Task 1 committed `a0235d9`; composition proof is consolidated in
`tests/template/cellContent.test.ts` instead of duplicating fixtures in a separate
composition file. Task 2–3 implemented in `db900d2`, with model-9 shared
`src/layout/cellTableFlow.ts` plus `measureCellContent.ts`; legacy paginator retained.
Task 2 observed RED (6 unsupported cell-image failures) then GREEN. Task 3 verifies
multiple table instances, repeated-header resource reuse and one measurement per
owner cell, with ordinary/merged padding and pagination tests.

Fresh reviewer found two Important issues: huge empty-cell padding could create
unbounded blank pages; zero-height body could omit its header. Both reproduced with
RED tests and fixed in `e6b7de4`. Ruling: also fix oversized-image diagnostic node ID
in this correction pass: the reviewer marked it minor, but naming the offending
node is an explicit acceptance requirement; cost if left is ambiguous user feedback.
That diagnostic fix has its own RED→GREEN test. No deferred reviewer findings remain.
Final Core verification: 250/250 tests and build PASS; packed Linux/amd64 consumer
PASS from source `e6b7de4`, artifact `../flowdoc-core-cell-content/artifacts/1791535765151/result.json`.
PDF fixture: 12 rows, 12 image placements, 3 resources, 15 pages. Assistant reviewed
all rendered pages and confirmed each BEGIN/END marker appears once. Final PDF is
byte-identical to the reviewed pre-fix fixture; visual proof reused by SHA256.
See `visual-review.json` in that artifact directory; owner visual acceptance pending.

Service lane: `../flowdoc-service-cell-content`, branch `codex/cell-content`, base
`2a69fd6`, candidate commit `c3abf54`. No Service runtime/DB code change required.
Real PostgreSQL/API consumer checks: 16 passed / 0 failed / 0 skipped, covering
publication, upload, image preparation, jobs, PDF download, bad-image warnings and
affected legacy consumers. Build and vendor identity checks PASS. Result:
`../flowdoc-service-cell-content/artifacts/1791535841549/result.json`.
Its isolated Docker project was removed by the verification script after checks.

Task 4 technical checks PASS; owner visual acceptance/integration remain pending.
Do not mark the full slice accepted or change maps yet. No version bump, release
promotion, push or tag. Candidate package retains 0.1.5 metadata ONLY inside the
isolated test lanes, named `flowdoc-core-0.1.5-cell-content-candidate.tgz` with checksum
`46e2c86d179a4ad2577aa637f2fa512327af83abf09dbf561980572e4a6a4c7b`; it is not released
0.1.5 and must not replace that immutable artifact. Before development delivery,
assign the accepted next version, rebuild/package and refresh the consumer pin/proof.
Keep these clean unmerged worktrees until owner acceptance and integration; do not
delete pending work under the cleanup rule. The following original draft checklist
is the planned acceptance set; this ledger distinguishes technical PASS from pending
owner acceptance and delivery.

กติกาจุดออกรุ่นและการเลื่อนเข้า release ร่างไว้ที่
[Export working/release rules](flowdoc-export-working-release-rules-draft-2026-10-09.md)
จบ Task หรือพาร์ตไม่เท่ากับต้องเพิ่มเวอร์ชัน: ต้องมีการเปลี่ยนโค้ดที่ใช้ได้จริง
และตรวจผ่านก่อน ส่วน release รอครบเกณฑ์ roadmap; ยังไม่มีการออกรุ่นจากงานเอกสารนี้

2026-10-09: ร่างแผนจากการตรวจ source ของฐาน 0.1.5; ยังไม่เริ่มสี่ task
อัปเดตจากการคุยต่อ: ยืนยัน direct-cell scope และแยก area/array extension ไปท้าย
ลำดับออกแบบหกพาร์ตตามร่างหลัก บันทึกทิศทาง Adapter ไว้สำหรับอนาคต
ยังไม่เริ่ม runtime หรือประกาศว่า proposed sizing/pagination ทั้งหมดผ่านแล้ว
Return route: สรุปในห้องนี้ ไม่มี separate-room return หรือการแก้ทะเบียนเก่า
