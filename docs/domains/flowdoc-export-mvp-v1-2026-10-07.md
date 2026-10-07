# FlowDoc Export MVP v1

## Authority Boundary

Owner: FlowDoc Project Control. This document records the agreed export-only
MVP scope and the owner's scope-freeze instruction dated 2026-10-07. It is a
scope specification, not implementation Evidence, a product readiness claim,
or authorization to resume historical execution rounds.

Status: scope locked by the owner on 2026-10-07 following agreement on local
API, relational DB relationships, one SRS template, PDF output and serial job
processing. Implementation has not started under this document. The owner's
instruction is: "งันร่างแล้วล็อกเอกสารกัน".

Owner-authorized clarification, 2026-10-07: template means a book structure
with creator-defined one-level subtemplates, inline variables and ordered
invocations. Includes versioned caller examples/contract access and warnings
for unknown format names. This replaces the fixed-body interpretation in the
initial draft; all unrelated exclusions remain. Subsequent owner confirmation
sets unknown variable keys to ignore-with-warning and wrong known types to error.

Active role: Planning Partner / Documentation Synthesizer. Authority: the
current conversation. Registered Work/Phase/Checklist/Evidence IDs: not
applicable. Document budget: this scope document and its linked R1 design. Verification budget:
scope/consistency review and Markdown diff checks; no product tests for prose.

The generated snapshot inspected on 2026-10-07 still describes the older
frontend work. It does not represent or authorize this new export MVP.
Existing product history and evidence remain unchanged.

## เป้าหมายและจุดจบ

ผู้พัฒนาสร้างหนึ่ง template ที่มีโครงเล่มและโครงย่อยที่นิยามเอง
ผู้เรียกส่งข้อมูลส่วนกลางและลำดับการใช้โครงย่อยพร้อมข้อมูลของแต่ละรายการ
ระบบตรวจข้อมูล ประกอบ node แทน inline tags และสร้าง PDF ที่อ่านใช้งานได้
เปลี่ยนข้อมูลแล้วใช้โครงเดิมสร้างไฟล์ใหม่ได้โดยไม่แก้โค้ดจัดหน้าเฉพาะชุดข้อมูล

MVP รอบนี้จบที่ API และ DB จริงที่รันและทดสอบในเครื่อง:

เตรียมไฟล์โครง → ลงทะเบียนโครงใน DB → เรียก API ด้วย `docKey` และ JSON
→ ตรวจข้อมูล → บันทึกงานพร้อมเวอร์ชัน/คำเตือน → ประกอบโครงย่อยและผูกข้อมูล → จัดหน้า → สร้าง PDF
→ เช็กสถานะและดาวน์โหลดผ่าน API

ไม่มีหน้าบ้าน การเตรียมโครงทำผ่านไฟล์และคำสั่งสำหรับผู้พัฒนา
ยังไม่เปิดบริการสาธารณะและไม่อ้างว่าพร้อมรองรับโหลดจริง

## ขอบเขตที่ทำ

1. template ตัวอย่างหนึ่งชุดอิง SRS: โครงเล่มและ custom subtemplates อย่างน้อย
   สองแบบที่ประกอบจากข้อความ/ตาราง ผู้เรียกใช้ซ้ำและสลับลำดับได้
   ชื่อรูปแบบกำหนดโดยผู้สร้าง template ไม่ hardcode เป็นชนิด node ของระบบ
   โครงย่อยเรียกโครงย่อยอื่นไม่ได้ใน MVP; ไม่จำเป็นต้องทำ SRS ทั้งเล่ม
2. โครงมี `templateId`, `version` และ `nodeId` ที่คงที่สำหรับอ้างอิง
3. นิยามตัวแปรแยกจากข้อมูลจริง: key, label/description, ชนิด, required,
   default ถ้ามี; รองรับ string, data object และรายการ object ซ้ำ
   แยกข้อมูลส่วนกลาง/แต่ละ invocation/item; ยังไม่มี form runtime
4. Binding ใช้ tag ภายใน TextBlock ร่วมกับข้อความปกติและกำหนดแถวทำซ้ำในตาราง
   ประกอบสำเนาโครงย่อยตามลำดับ content ที่ส่งมาโดย ID/ค่าของแต่ละครั้งไม่ปนกัน
   ไม่อ้างตำแหน่งด้วย label และไม่รันโค้ดที่มากับข้อมูล
5. รองรับ TextBlock และตารางธรรมดาหัวหนึ่งชั้น ไม่มีตารางซ้อนหรือช่องรวม
   ใน fixture แรก คอลัมน์ตัวอย่างคือรหัส รายละเอียด และหมายเหตุ
6. ใช้การจัดข้อความภาษาไทยและการสร้าง PDF ที่นำกลับมาใช้ได้จากระบบเดิม
   ปรับเฉพาะส่วนจำเป็นต่อ fixture นี้ ไม่ย้อนกลับไปใช้ตัวตัดคำที่ด้อยลง
7. รองรับเนื้อหาหลายหน้าในขอบเขต fixture: ข้อความต้องไม่หายหรือทับกัน
   แถวที่ยาวข้ามหน้าให้ส่วนที่เกินต่อหน้าถัดไป ยังคงเป็นรายการเดิม
   และแสดงหัวตารางซ้ำ การทำส่วนนี้เป็นงาน export ไม่รวม editor ข้ามหน้า
8. ขาด required ให้คืน key/path ที่ขาดทั้งหมดและไม่สร้างงาน แม้มี default;
   optional ที่หายใช้ default ก่อน แล้ว string="" หรือ array=[]
   null เป็นค่าผิดชนิด; tag/default/graph ที่ผิดต้องปฏิเสธตอนลงทะเบียน template
   variable key ที่ไม่รู้จักให้ข้ามพร้อม warning; key ที่รู้จักแต่ค่าผิด type
   ไม่สร้างงานแม้ optional/มี default และแจ้ง path/expectedType/actualType
   ห้ามถือว่านโยบายข้าม unknown format อนุญาตให้ข้ามค่าบังคับหรือแปลงชนิดเงียบ ๆ
9. มี API สร้างงาน อ่านสถานะ และดาวน์โหลดผลลัพธ์ โดยใช้ DB จริงเก็บ
   template, version, job และ output metadata; ไฟล์ PDF เก็บในเครื่อง
10. ประมวลผลเอกสารทีละงานใน service process เดียว งานที่รออยู่มีสถานะ
    ชัดเจน ไม่เพิ่ม distributed queue หรือ worker service แยกในรอบนี้
11. ชื่อโครงย่อยที่ไม่พบให้ข้าม invocation นั้นพร้อม warning ที่ระบุ original
    content index/name; ถ้าไม่มี invocation ที่ยอมรับเหลือให้ไม่สร้างงาน
    คำเตือนเก็บกับ job และคืนทาง API ไม่พิมพ์ placeholder ลง PDF
12. มี API อ่าน contract และ normal request examples ตาม template version
    ที่ใช้จริง ตัวอย่างต้องตรวจด้วย validator เดียวกับ generation ตอนลงทะเบียน

ชื่อ field ข้างต้นใช้กำหนดความหมายในขอบเขตนี้ รูปแบบสัญญา JSON ที่แน่นอน
ต้องกำหนดในแผนลงมือ โดยต้องไม่เพิ่มความสามารถเกินรายการนี้

## ขอบเขตการนำของเดิมมาใช้

ใช้โครงสร้าง node เดิมเป็นจุดตั้งต้นและย้ายเฉพาะ dependency ที่ต้องใช้จริง
ไม่ clone ทั้งระบบ ไม่ย้ายหน้าบ้าน และไม่ปรับโครงสร้างทุกชนิดเผื่ออนาคต

เจ้าของ implementation:

- `flowdoc-core`: schema, validation ของโครง/ข้อมูล, binding, layout และ
  PDF export; ไม่ขึ้นกับ HTTP หรือ DB
- `flowdoc-service`: API, ลงทะเบียน/โหลดโครง, DB, วงจรงานแบบทีละงาน,
  เก็บไฟล์และให้ดาวน์โหลด; เรียก Core ผ่าน public interface

การใช้งาน renderer แบบไม่มี browser UI ต้องตรวจเป็น prerequisite แรก
หากพบว่า reuse ไม่ได้ตามขอบเขต ต้องรายงานข้อจำกัดก่อนเปลี่ยนแนวทาง

## ความสัมพันธ์ DB ที่ล็อกไว้

| ส่วน | ข้อมูลหลักและข้อกำหนด |
| --- | --- |
| `templates` | `id`, `docKey` ที่ไม่ซ้ำ และชื่อที่แสดง |
| `template_versions` | `id`, `template_id` เป็น FK, `version`, JSON รวมโครงเล่ม/โครงย่อย, scopes/types/tags/repeats, styles และ normal examples; คู่ template/version ต้องไม่ซ้ำ |
| `generation_jobs` | `id`, `template_version_id` เป็น FK, original/prepared input, สถานะ, คำเตือน/รายการที่ข้าม, ข้อผิดพลาด และเวลาเริ่ม/จบ |
| `document_outputs` | `id`, `job_id` เป็น FK แบบ unique, ตำแหน่งไฟล์, ชนิดไฟล์และขนาด; MVP มี PDF สำเร็จได้หนึ่งไฟล์ต่อ job |

ความสัมพันธ์: Template 1:N Version; Version 1:N Job; Job 1:0..1 Output

- node และ binding อยู่ใน JSON ของเวอร์ชัน ไม่แตกทุก node เป็นตาราง DB
- โครงย่อย ตัวแปร และ examples เปลี่ยนพร้อม template version ไม่แยก version
  หรือเพิ่มตารางของตนใน MVP; เปลี่ยนสิ่งเหล่านี้ต้องลง version ใหม่
- เวอร์ชันที่ลงทะเบียนแล้วห้ามเขียนทับ การแก้โครงสร้างเป็นเวอร์ชันใหม่
- งานเลือกเวอร์ชันครั้งเดียวตอนรับงานและบันทึก FK นั้นไว้ตลอด
  ห้ามโหลดเวอร์ชันล่าสุดใหม่ระหว่างประมวลผล
- รับ `docKey` และ version แบบระบุได้ หากไม่ระบุ ให้เลือกเวอร์ชันล่าสุด
  ที่ลงทะเบียนสำเร็จ ณ เวลารับงาน แล้วบันทึกเวอร์ชันที่เลือกให้ชัดเจน
- การเปลี่ยน template ภายหลังต้องไม่เปลี่ยนความสัมพันธ์หรือผลของ job เดิม
- ไม่มีการลบ template/version ที่ job อ้างอิงใน MVP; ไม่ทำระบบ cleanup อัตโนมัติ

DB ต้องมี migration และวิธีเริ่มฐานข้อมูลในเครื่องที่ทำซ้ำได้
รายละเอียดชนิดคอลัมน์ ดัชนี และเครื่องมือที่ใช้ให้กำหนดในแผนลงมือ
ภายใต้ความสัมพันธ์นี้ ไม่ใช่ช่องให้เพิ่ม entity หรือความสามารถใหม่

## API และสถานะงาน

สัญญาความสามารถที่ต้องมี โดยชื่อ route ที่แน่นอนกำหนดในแผนลงมือ:

1. สร้างงาน: รับ `docKey`, version ถ้าระบุ, `data` ส่วนกลาง และ `content[]`
   ที่มี format/data; ตรวจโครง/ข้อมูลก่อนรับเข้าคิว ตอบ `jobId`, version,
   สถานะเริ่มต้น, hasWarnings, warnings และ skipped content indices
2. อ่านงาน: รับ `jobId`; ตอบสถานะ เวอร์ชัน คำเตือนที่เก็บไว้ ข้อผิดพลาดถ้ามี
   และช่องทางดาวน์โหลดเมื่อสำเร็จ
3. ดาวน์โหลด: รับ `jobId`; ส่ง PDF ของงานสำเร็จเท่านั้น
   งานไม่พบ งานยังไม่เสร็จ หรือไฟล์ไม่พบต้องตอบข้อผิดพลาดชัดเจน
4. อ่านสัญญา template: รับ docKey/version คืน version ที่เลือก, global schema,
   รายชื่อ/label/input schema ของโครงย่อย และ normal examples ของ version นั้น
   ไม่คืนรายละเอียด graph node และไม่เพิ่มหน้าบ้านสำหรับอ่านสัญญา

สถานะพื้นฐาน: `queued` → `running` → `succeeded` หรือ `failed`
การตรวจข้อมูลมี error ให้ตอบข้อผิดพลาดโดยไม่สร้างงาน render
warning-only รับงานได้เมื่อมี known invocation; succeeded พร้อม warnings
หมายถึงสร้างส่วนที่ยอมรับแล้ว ไม่ได้หมายความว่าทุก content item ถูกนำไปใช้
ไม่มีเปอร์เซ็นต์ความคืบหน้า เวลาเสร็จประมาณการ หรือ retry อัตโนมัติ

service ประมวลผลได้ครั้งละหนึ่ง job และดึงงานที่รอจาก DB ตามลำดับรับ
เมื่อ process เริ่มใหม่ งาน queued ต้องยังทำต่อได้ ส่วนงาน running
ที่ค้างจาก process ก่อนให้เปลี่ยนเป็น failed พร้อมเหตุผลการหยุดกลางทาง
เมื่อเก็บไฟล์และ output metadata สำเร็จจึงเปลี่ยนสถานะเป็น succeeded
ไม่อ้างการรับประกัน exactly-once หรือการรองรับหลาย service instance

การทดสอบใช้ localhost เท่านั้น ไม่มีบัญชีผู้ใช้หรือ API key ในรอบนี้
`docKey` เป็นตัวระบุโครงเอกสาร ไม่ใช่ข้อมูลยืนยันสิทธิ์

## เกณฑ์รับงาน

- [ ] เริ่ม service และ DB ในเครื่องจากขั้นตอนที่ให้ไว้ได้ รวม migration
      และการลงทะเบียนโครงตัวอย่าง โดยไม่มีหน้าบ้าน
- [ ] โครงตัวอย่างกับชุดข้อมูลถูกเก็บแยกกัน เรียก API ด้วย docKey/JSON
      แล้วได้ jobId ตรวจสถานะ และดาวน์โหลด PDF ได้ครบ flow
- [ ] ผู้สร้างนิยามโครงย่อยอย่างน้อยสองแบบ; เรียก A/B/A และสลับลำดับได้
      ข้อมูลและ ID แต่ละครั้งไม่ปน; ปฏิเสธโครงย่อยเรียกซ้อนโครงย่อย
- [ ] tag อยู่กลางข้อความปกติได้; global/local/item อ้างถูก scope
      แทนค่าก่อนวัดและแบ่งหน้า ไม่มี placeholder ที่ผิดหลุดลง PDF
- [ ] DB บังคับ docKey ไม่ซ้ำ, template/version ไม่ซ้ำ และ FK ถูกต้อง
      งานเดิมยังอ้างเวอร์ชันเดิมเมื่อลงทะเบียนเวอร์ชันใหม่
- [ ] ข้อความเดี่ยวและทุกรายการในตารางลงถูก node ถูกลำดับ ครบ ไม่ซ้ำ
- [ ] ใช้โครงเดิมกับข้อมูลอย่างน้อยสามชุด: ปกติ, รายการว่าง,
      และยาวพอให้มีทั้งตารางข้ามหน้าและแถวเดียวข้ามหน้า
- [ ] กรณีรายการว่างแสดงหัวตารางโดยไม่มีแถวข้อมูลปลอม
- [ ] ตรวจ PDF จริงทั้งเนื้อหาและภาพ: ภาษาไทยอ่านได้ ข้อความไม่ล้นคอลัมน์
      ไม่ทับกัน ไม่หายที่รอยต่อหน้า และหัวตารางต่อหน้าถัดไปได้
- [ ] ตัวอย่างข้อมูลผิดและ binding ผิดให้ข้อผิดพลาดที่ระบุ field/node ได้
- [ ] required ที่หายหลายจุดคืนครบและไม่ใช้ default ข้าม required;
      optional ที่หายใช้ default/ค่าว่างตรง type; template/default/tag ผิดถูกจับตอนลงทะเบียน
- [ ] unknown variable ข้ามพร้อม warning แต่ required ที่หายยังเป็น error;
      known variable ผิดชนิดไม่ใช้ default กลบ แม้ optional ต้องไม่สร้างงาน
      รวม errors/warnings ที่ตรวจได้ในคำตอบเดียวและเก็บ warnings กับงานที่รับ
- [ ] unknown format ปน known สร้างเฉพาะ known พร้อม warning/index ที่คงอยู่
      ตอนอ่าน status/restart; unknown ทั้งหมดหรือ content ว่างไม่สร้าง job
- [ ] API contract/examples ผูก version ถูกต้อง normal example ผ่านตัวตรวจเดียว
      กับ generation และเรียกได้จริง; version ใหม่ไม่เปลี่ยนตัวอย่าง/งานของ version เก่า
- [ ] docKey/version/job ที่ไม่พบให้ข้อผิดพลาดชัดเจน งาน render ล้มเหลว
      แสดง failed และไม่แสดงผลลัพธ์สำเร็จปลอม
- [ ] ส่งงานที่ถูกต้องสามงานติดกันแล้วทุกงานได้ผลลัพธ์ตรงกับข้อมูลของตน
      และมีงาน running ไม่เกินหนึ่งงาน เป็นการตรวจลำดับ ไม่ใช่ load test
- [ ] restart แล้ว template, version, ประวัติ job และไฟล์สำเร็จยังเข้าถึงได้
      queued ทำต่อได้ และ running ที่ถูกขัดจังหวะกลายเป็น failed ตามกติกา
- [ ] มีวิธีเรียกซ้ำที่ชัดเจน พร้อมไฟล์ตัวอย่างให้เจ้าของตรวจผล
- [ ] เจ้าของตรวจ PDF ตัวอย่างและยอมรับว่าเพียงพอสำหรับ MVP นี้

จำนวนหน้าและตำแหน่งตัดบรรทัดไม่ต้องเหมือน Word หรือ PDF จากระบบเก่าทุกจุด
ตัวอย่าง SRS ใช้อ้างอิงความหมายและโครง ไม่ใช่เกณฑ์เทียบภาพระดับ pixel

## Roadmap ภายใน MVP

เพิ่มตามคำขอเจ้าของวันที่ 2026-10-07 เพื่อแตกการออกแบบโดยอ้างอิงขอบเขต
ที่ล็อกแล้ว ไม่เพิ่ม feature หรือเกณฑ์รับงานใหม่
Roadmap นี้เป็นลำดับผลลัพธ์ ไม่ใช่ implementation plan หรือหลักฐานว่าทำได้แล้ว

สถานะอัปเดต 2026-10-07: R0 ตรวจ source รอบแรกแล้ว (ยังไม่รัน export ใหม่);
R1 มี [ร่างการออกแบบสำหรับ review](flowdoc-export-mvp-r1-design-2026-10-07.md)
ซึ่งบันทึกแหล่งอ้างอิง R0 และข้อจำกัดไว้ด้วย ปรับตามนิยามโครงย่อย/tag ล่าสุดแล้ว
นโยบาย unknown variable/wrong type ยืนยันและบันทึกใน R1 แล้ว; R2–R5 ยังไม่เริ่ม

### R0 — ตรวจของเดิมและกำหนดขอบเขตการย้าย

- ออกแบบจากข้อเท็จจริง: ตรวจเฉพาะ node/schema, text engine, font,
  layout และ PDF renderer ที่จำเป็นต่อ SRS ตัวอย่าง
- ผลที่ต้องได้: รายการส่วนที่ reuse ได้พร้อมแหล่งอ้างอิง ส่วนที่ต้องปรับ
  dependency ที่ต้องย้าย และข้อจำกัดการรันแบบไม่มี UI
- จุดจบ: มีหลักฐานจากโค้ด/การเรียกส่วนเดิมที่เพียงพอให้เลือกเส้นทาง reuse
  ถ้ายังต้องทดลองเพิ่ม ให้กำหนดคำถามและการทดลองเฉพาะจุดก่อน ไม่ย้ายทั้ง repo
- รองรับเกณฑ์: สร้าง PDF ไม่มีหน้าบ้านและคงการจัดข้อความภาษาไทย
- ขอบเขต: สำรวจก่อนเปลี่ยน product; ไม่เปิดการวิจัย Word/LibreOffice ใหม่

### R1 — ออกแบบสัญญาข้อมูลและขอบเขตสอง repo

- ออกแบบโครงเล่ม/custom formats, scoped variables/inline tags, ordered invocations,
  request examples และผลหลัง compose/binding
  โดยใช้ชนิด node เท่าที่ MVP ต้องใช้
- ระบุชื่อ/รูปแบบ ID และ version, การอ้าง node, รายการซ้ำ, optional/required,
  ข้อผิดพลาด และ interface ที่ Service ใช้เรียก Core
- กำหนดโครงสร้างโฟลเดอร์ การตั้งชื่อ และความรับผิดชอบของแต่ละส่วน
  พร้อมเลือก stack/runtime ที่จำเป็นตามผล R0; ไม่สร้าง framework เผื่ออนาคต
- ผลที่ต้องได้: สัญญาที่อ่านแล้วตามได้จาก input ไปถึง output พร้อม SRS
  หนึ่งโครงและตัวอย่างข้อมูลปกติ ว่าง ยาว และผิดชนิด
- จุดจบ: อธิบายได้ว่าทุก field ลงที่ใดและใครเป็นผู้ตรวจ โดย Core ไม่ผูกกับ DB/HTTP
- รองรับเกณฑ์: โครง/ข้อมูลแยกกัน, mapping ถูกต้อง, validation และชุดตัวอย่าง

### R2 — ทำ Core ให้สร้าง PDF จากโครงและข้อมูลได้

- ออกแบบแล้วลงมือเฉพาะเส้นทาง validate/prepare → compose/bind → layout → PDF
  เริ่มข้อความและตารางสั้นให้ทำงานครบเส้นทาง ก่อนเพิ่มกรณีว่างและหลายหน้า
- ใช้การจัดข้อความเดิมตามผล R0; ออกแบบตารางข้ามหน้าและแถวต่อหน้า
  เฉพาะขอบเขต MVP พร้อมรักษา identity ของรายการและหัวตาราง
- ผลที่ต้องได้: เรียก Core ในเครื่องด้วยโครงและข้อมูลแล้วได้ PDF จริง
  และข้อผิดพลาดที่ระบุ field/node ได้
- จุดจบ: ตรวจข้อมูลและภาพของ PDF ทั้งสามชุด ข้อความครบ ไม่ซ้ำ ไม่ทับ
  ไม่หายตามรอยต่อ และรายการว่างไม่สร้างข้อมูลปลอม
- รองรับเกณฑ์: ความถูกต้องของข้อความ/ตาราง/PDF และ validation
- ขอบเขต: การเรียก Core โดยตรงเป็น milestone ภายใน ไม่ใช่การปิด MVP แทน API

### R3 — ออกแบบและทำ DB กับการลงทะเบียนโครง

- ออกแบบ schema/migration ตามสี่ส่วนที่ล็อกไว้ รวม FK, unique constraints,
  การเลือก version และขอบเขต transaction ที่จำเป็น
- ทำวิธีเริ่ม DB และลงทะเบียน template จากไฟล์ในเครื่อง
  เตรียมการบันทึก job/output สำหรับช่วง R4
- ผลที่ต้องได้: โครงที่ลงทะเบียนแล้วโหลดกลับได้ และ job ผูก version ที่แน่นอน
- จุดจบ: ตรวจข้อบังคับ DB, ลง version ใหม่โดยไม่เขียนทับเก่า,
  และเปิด DB กลับมาแล้วยังอ่านข้อมูลเดิมได้
- รองรับเกณฑ์: setup/migration, DB relationships, version pinning และ persistence

### R4 — ต่อ API และวงจรงานให้ครบ

- ออกแบบ request/response, route, status/error และการเก็บไฟล์ก่อนลงมือ
- ต่อ API อ่าน contract/examples, สร้างงาน/อ่านสถานะ/ดาวน์โหลดเข้ากับ DB และ Core ที่ผ่าน R2
- ทำการดึง queued ทีละงาน เปลี่ยนสถานะตามผลจริง และจัดการ restart
  ตามกติกาในหัวข้อ API และสถานะงาน
- ผลที่ต้องได้: เรียกผ่าน localhost ตั้งแต่ docKey/JSON จนดาวน์โหลด PDF ได้
- จุดจบ: สามงานติดกันไม่ปนข้อมูลและ running ไม่เกินหนึ่งงาน;
  validation/not-found/render failure/file missing และ restart ให้ผลตามสัญญา
- รองรับเกณฑ์: API ครบ flow, errors, serial processing และ restart recovery

### R5 — รับงานและปิด MVP

- ใช้ขั้นตอน setup และตัวอย่างที่เก็บไว้เดิน flow ผ่าน API กับ DB จริง
  นำผลตรวจ R2–R4 มาใช้ซ้ำเมื่อยังตรงกับ candidate; ไม่เพิ่มชุดทดสอบซ้ำโดยไม่มีเหตุ
- ตรวจความครอบคลุมกับ checklist เกณฑ์รับงานทุกข้อ พร้อมตรวจ PDF จริงกับเจ้าของ
- ผลที่ต้องได้: วิธีรัน/เรียกที่ทำซ้ำได้ ผลตรวจที่ผูกกับเกณฑ์ และ PDF ที่เจ้าของยอมรับ
- จุดจบ: ผ่านเกณฑ์ทั้งหมดแล้วปิด MVP ข้อที่ยังไม่ตรวจต้องระบุว่ายังไม่ผ่าน
  ไม่นำการยอมรับข้อจำกัดมาแทนข้อบังคับใน checklist
- ขอบเขต: ไม่เริ่ม feature หลัง MVP ในช่วงเก็บงาน

### วิธีใช้ roadmap ในการแตกแบบ

ลำดับหลัก: R0 → R1 → R2 → R3 → R4 → R5

แต่ละช่วงแยกสถานะ ออกแบบ / ลงมือ / ตรวจผล ให้ชัด ไม่ใช้คำว่าเสร็จออกแบบ
แทนเสร็จ implementation เริ่มแตกแบบเฉพาะ R0–R1 ก่อน แล้วใช้ผลจริงกำหนด
รายละเอียดช่วงถัดไป ไม่ลงรายละเอียดอนาคตทั้งหมดพร้อมกัน

ทุกแบบต้องระบุ input/output, เจ้าของ, ขอบเขต, error ที่เกี่ยวข้อง,
เกณฑ์ MVP ที่รองรับ และวิธีตรวจผล ก่อนลงมือให้แปลงแบบที่ตกลงแล้วเป็นงาน
ที่มีขอบเขตชัดเจน โดยอ้างเอกสารนี้ ไม่คัดลอก scope จนเกิดแหล่งอ้างอิงหลายชุด
เอกสารออกแบบร่วมอยู่ใน Project Control; สัญญาหรือคำแนะนำเฉพาะโค้ดอยู่กับ
repo เจ้าของตามนโยบายเอกสาร ไม่กำหนดจำนวนเอกสารแยกให้ครบทุก R โดยอัตโนมัติ

ช่วงที่พบ prerequisite ขาดให้รายงานข้อจำกัดและผลต่อ MVP ก่อนเปลี่ยน scope
ยังไม่กำหนดวันที่เสร็จจนกว่าจะทราบผล R0 และขนาดงานจริง

## ไม่ทำในรอบนี้

- หน้าบ้าน, WYSIWYG, live editing, การเลือก/ลาก/ย่อขยาย node
- DOCX export/import, LibreOffice integration หรือการวิจัยให้ wrap เหมือน Word
- รูปภาพและระบบ crop/resize/แปลงชนิดไฟล์
- ตารางซ้อน หัวหลายชั้น ช่องรวม คอลัมน์ซ้อน และการจัดหน้าแบบซับซ้อน
- สารบัญอัตโนมัติ ภาษา script/expression ทั่วไป การเรียกโครงย่อยซ้อนกัน
  และการจำลองหน้ารอบพิเศษเพื่อแจ้งจำนวนหน้า
- authentication/API key, ระบบสมาชิก/คิดเงิน, deployment สาธารณะ,
  external queue/worker infrastructure, ETA, distributed processing,
  load test และการปรับประสิทธิภาพเผื่อโหลดอนาคต

ข้อเหล่านี้เป็นงานเลื่อนออกจาก MVP ไม่ใช่ความต้องการที่ยกเลิก

## กฎห้ามขยายงาน

คำสั่งเจ้าของ: ยึดเอกสาร MVP จนเสร็จ แล้วจึงเริ่มรอบใหม่

ก่อนลงมือแต่ละงานต้องชี้ได้ว่าสนับสนุนเกณฑ์รับงานข้อใด
แนวคิดเพิ่มหรือการถามความเป็นไปได้ระหว่างทำไม่ใช่การอนุมัติขยายงาน
ให้บันทึกสั้น ๆ ในรายการหลัง MVP ด้านล่างและกลับมางานเดิม
ห้ามแทรกงานใหม่เพียงเพราะดูเกี่ยวข้องหรืออาจมีประโยชน์ในอนาคต

หากงานที่อยู่นอกขอบเขตจำเป็นจริงจนเกณฑ์รับงานไปต่อไม่ได้
ให้รายงานสิ่งที่ติด ผลกระทบ และทางแก้ที่เล็กที่สุดแก่เจ้าของก่อน
การเปลี่ยนขอบเขตต้องเป็นการตัดสินใจโดยชัดแจ้งและแก้เอกสารนี้
ห้ามขยายโดยเงียบ ๆ หรือผ่อนเกณฑ์ให้ผลทดสอบผ่าน

ผ่านเกณฑ์ครบแล้วให้หยุด สรุปผล และปิด MVP ก่อนพิจารณารอบถัดไป

## หลัง MVP

ความต้องการที่คงไว้: บริการสำหรับผู้ใช้ภายนอกและ API key,
คิวรองรับโหลดหนัก/หลาย worker, ความคืบหน้าแบบละเอียด, รูปภาพ, DOCX
และการรองรับเอกสารที่หลากหลาย
รายการนี้ไม่มีลำดับดำเนินงานและไม่เป็น acceptance ของ MVP

## บันทึกการล็อกขอบเขต

- 2026-10-07 (ยืนยัน type): unknown variable key ข้ามพร้อม warning;
  known key ผิด type ปฏิเสธงาน ไม่ใช้ default กลบ รวมทุก issue ที่ตรวจได้
  เป็นการปิดสองประเด็นที่เคยค้าง ไม่เปลี่ยนนโยบาย unknown format
- 2026-10-07 (หลัง review R1): เจ้าของอนุมัติแก้นิยามจาก fixed-body เป็น
  โครงเล่ม + โครงย่อยผู้สร้างกำหนดเองหนึ่งชั้น, inline tags, ลำดับจากผู้เรียก,
  กฎ missing/default, unknown-format warnings, versioned examples และ DB JSON
  ที่เก็บองค์ประกอบเหล่านี้ร่วมกัน รายละเอียดอยู่ R1; ไม่ใช่การขยายงานโดย agent เอง
- 2026-10-07: เจ้าของยืนยันให้ร่างและล็อกตามข้อตกลงล่าสุด
  เพิ่ม local API, DB relationships, job status/download และ serial processing
  แทนร่างก่อนหน้าที่จำกัดแค่การเรียกในเครื่องโดยไม่มี API/DB
- เอกสารนี้เป็นขอบเขตเดียวสำหรับ Export MVP v1 ไม่ใช้บทสนทนาเรื่องอนาคต
  หรือแผน frontend เดิมมาเพิ่ม acceptance ให้รอบนี้
- รอบการเขียนนี้เปลี่ยนเฉพาะเอกสารใน Project Control; ไม่เปลี่ยน product,
  ไม่อ้างว่า implementation ผ่าน และไม่ปรับ system map หรือ Evidence
