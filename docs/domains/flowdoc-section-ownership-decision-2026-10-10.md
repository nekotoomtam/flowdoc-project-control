# FlowDoc — ข้อตกลงเจ้าของข้อมูลตาม Section

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Status: owner-accepted direction, recorded 2026-10-10; not implemented.
Scope: บันทึกข้อตกลงก่อนออกแบบลงมือ Core/Service หลัง R3 และก่อน R4.
Inline documentation, small/routine; execution/Phase/Checklist IDs not applicable.
Authority: คำยืนยันเจ้าของในบทสนทนาว่าให้ยึดแนวทาง sections และเก็บความสัมพันธ์ DB ก่อนเริ่ม.
Document budget: เอกสารนี้และ roadmap เดิม; proof: ตรวจเทียบข้อสรุป/โค้ดที่อ่านแล้ว,
ลิงก์ diff และ check:data. ไม่แก้ runtime, migration, package, release หรือ maps.

R3 เสร็จตามสัญญาเดิมในรุ่นพัฒนา0.1.11 ไม่เปิดผลรับเดิมใหม่.
[หลักฐาน R3](flowdoc-page-system-r3-plan-2026-10-10.md#accepted-delivery--2026-10-10).
งานนี้เป็นการขยายสัญญารอบถัดไป ไม่อ้างว่ารองรับแล้วหรืออนุมัติ release.

## นิยามที่รับแล้ว

- Document คือแม่แบบเอกสารทั้งเล่ม; Section คือส่วนของเล่มที่ประกาศรูปแบบ
  หน้ากระดาษก่อนวางเนื้อหา ไม่ใช่โครงย่อยเนื้อหา และไม่ใช่หน้า PDF หนึ่งหน้า.
- หนึ่ง Document มีหลาย Sections; หนึ่ง Section ต่อออกมาหลายหน้าจริงได้.
- ผู้สร้างแม่แบบกำหนดลำดับ ขนาด/แนวหน้ากระดาษ เนื้อหา และโครงหัวท้ายของแต่ละ Section.
  ผู้เรียก API ส่งข้อมูล ไม่ส่ง layout/node graph หรือจัดลำดับหน้าเอง.
- Sections ขนาดเดียวกันยังเป็นคนละ Section ได้; ไม่ใช้ขนาดเป็น identity.
- โครงย่อยยังใช้ตัวแปร area เป็นเจ้าของ/จุดวางตามกฎเดิม ไม่เพิ่มการซ้อน area.
- คำว่าโครงแยกเป็น Document / Section / โครงย่อยเนื้อหาในงานนี้
  (terminology disposition: split); ไม่เปลี่ยน glossary หรืออ้าง runtime truth.

## ขอบเขตตัวแปรและ API

เก็บ data ระดับ Document สำหรับค่าร่วมที่ใช้หลายจุด ไม่ใช่ชื่อเอกสารอัตโนมัติ.
ส่งค่าเฉพาะผ่าน sections.<key>.data และค่าในหัวท้ายผ่าน
sections.<key>.header / sections.<key>.footer.
แต่ละ Section มีโครงหัวท้ายของตัวเองได้ ไม่ใช่เปลี่ยนแค่ค่าของหัวท้ายชุดเดียว.
แม่แบบระบุแหล่งอ้างอิงค่าร่วม/ค่าเฉพาะชัดเจน ไม่ค้นข้ามหรือ fallback ตามชื่อ.
ชื่อตัวแปรซ้ำข้ามขอบเขตได้โดยไม่เป็นตัวเดียวกัน.

Section และตัวแปรมี ID คงที่ แยกจาก key สำหรับ API และชื่อแสดงผล.
เปลี่ยนชื่อแสดงผลไม่เปลี่ยน ID/reference; เปลี่ยน key อาจกระทบผู้เรียก
ต้องเป็นการเปลี่ยนสัญญาที่จัดการแยก ไม่ถือว่า ID คงที่แล้ว API จะไม่กระทบ.
หน้าบ้านในอนาคตใช้ schema/gฎเดียวกัน แสดงกลุ่มกรอกหรือเอกสารได้
แล้วจัดข้อมูลส่งเอง ผู้ใช้ไม่จำเป็นต้องเห็น JSON.

## ความสัมพันธ์ DB ที่รับเป็นทิศทาง

```text
Document
├─ ชุดตัวแปรร่วมของเล่ม
└─ Sections
   ├─ ID / document reference / key / label / position / page configuration
   ├─ ชุดตัวแปรเนื้อหา
   │  └─ ตัวแปร area → โครงย่อย → ชุดตัวแปรของโครงย่อย
   ├─ โครงหัวกระดาษ + ชุดตัวแปรหัว
   └─ โครงท้ายกระดาษ + ชุดตัวแปรท้าย
```

เพิ่มตาราง sections จริงให้เป็นเจ้าของที่อ้างอิงได้.
ชุดตัวแปรแยกเจ้าของเป็นค่าร่วม Document หรือเนื้อหา/หัว/ท้ายของ Section.
ความสัมพันธ์ภายในใช้ ID; key ของ Section ต้องไม่ซ้ำภายใน Document.
กฎ DB ต้องป้องกันการอ้าง Section ข้าม Document และเจ้าของชุดตัวแปรที่กำกวม.
คงความสัมพันธ์ variable_schemas → variables และ area → โครงย่อยเดิม
พร้อมเพิ่มบริบท Section; ไม่ใส่ section_id ซ้ำทุกตารางถ้าตามเจ้าของได้แน่นอน.
Node graph ภายในยังเก็บ JSON ได้ ไม่เพิ่ม table tree node ในรอบนี้.
ชื่อตาราง/คอลัมน์ในข้อความนี้เป็นทิศทาง ยังไม่ใช่ DDL ลงมือที่ล็อกแล้ว.

## เวอร์ชันและความเข้ากันได้

เพิ่ม section_versions ในชุดเวอร์ชัน แยกจาก sections ปัจจุบัน.
ตอน publish clone Sections และความสัมพันธ์ที่เกี่ยวข้องไปยังชุดเวอร์ชัน
สร้าง ID ของแถวเวอร์ชันใหม่และ map references ไปยังเจ้าของในเวอร์ชันเดียวกัน.
เก็บ source references ตามหลักเดิม; snapshot ต้องไม่อ่านค่าปัจจุบันเพื่อ render.
แก้/ลบ Section ปัจจุบันไม่เปลี่ยนเอกสารที่ publish แล้ว.
คง created_at และกติกา validation/transaction ของการ publish.

ใช้รุ่นโครงสร้างใหม่แยกจาก model14; ห้ามแก้ความหมายของแม่แบบเก่าเงียบ ๆ.
ทางอ่านเดิมต้องคงไว้ ส่วนวิธีอัปเกรด current template และ migration ต้องออกแบบ
ก่อนลงมือ ไม่แก้ snapshot เก่าเพื่อทำให้มันเป็นแบบใหม่.
ปก/หน้าเปล่าและข้อจำกัดหัวท้ายจาก R2/R3 คงเดิม เว้นแต่เจ้าของเปลี่ยนขอบเขตชัดเจน.

## ผลตรวจที่ใช้วางแผน

ตรวจฐาน Core d7533c1 / Service 55f7aad แบบอ่านอย่างเดียวก่อนบันทึกนี้:

- Core src/template/types.ts และ pageSections.ts มี Section ID/pageLayoutId แล้ว
  แต่ไม่มี key/schema เฉพาะ Section และจำกัด source kind content ได้หนึ่ง Section.
- src/data/prepareGeneration.ts และ composition/composeSections.ts ยังใช้ data/content กลาง.
- หัวท้ายอยู่ระดับเล่ม; layout/documentFlow.ts cache ตามชนิดหัวท้ายกับความกว้าง.
  เมื่อแยก Section ต้องแยก identity/data ในผลวัด ไม่ใช้ cache ผิดชุด.
- Service src/templates/assembly.ts และ migration010 มี scope global/format/header/footer
  แต่ไม่มีเจ้าของ Section. storage.ts clone ชุด schema/variables อยู่แล้ว ใช้หลักต่อได้.
- API contract, prepared input, source diagnostics, Area ownership และการรวบรวมรูป
  ต้องตาม Section ตลอดทาง รวมทั้ง save/publish/load และ job reload.
- ตัวจัดหน้า/วัดข้อความ/วาด PDF ใช้ต่อได้โดยปรับจุดเลือกข้อมูลและหัวท้าย.
- ปัจจุบันรองรับ A4 ตั้ง/นอนเท่านั้น. A3/ขนาดอื่นในตัวอย่างสนทนาเป็นแนวคิด
  ไม่ใช่ความสามารถปัจจุบัน และต้องแยกขอบเขตเพิ่ม ไม่รวมเข้ามาเอง.

นี่เป็นผลตรวจ source ไม่ใช่การทดสอบสัญญาใหม่; ไม่มี runtime tests เพิ่มในรอบเอกสาร.

## จุดที่ต้องปิดก่อนลงมือ และลำดับต่อไป

1. กาง contract คู่แม่แบบ/request พร้อม mapping ID/key และ scopes
   รวมวิธีอ้างค่าร่วมจากหัวท้าย/โครงย่อย, การไม่ส่ง Section, key ที่ไม่รู้จัก,
   และการอ่านค่าปกในรุ่นใหม่โดยไม่เปลี่ยนรุ่นเดิม.
2. กาง DB current/version: keys/FKs/uniqueness/delete policy, ownership ของ formats
   ที่ไม่ผ่าน area และทางอัปเกรดข้อมูลเดิม. ยังไม่อนุมาน cascade การลบทุกกรณี.
3. ทำ Core ตามสัญญาที่รับ แล้ว Service DB/API/แพ็กเกจ พร้อมหลักฐานทั้งเส้นทาง.

Acceptance ที่ต้องใช้ในแผนลงมือ: หลาย Sections ที่ key ตัวแปรซ้ำแต่ข้อมูลต่าง,
หัวท้ายต่างกันบนความกว้างเท่ากัน, Area/ภาพไม่ปะปน, scoped diagnostics,
เปลี่ยน label ไม่ทำ identity หลุด, FK กันข้าม Document, publish แยกจาก current,
และเอกสารรุ่นเดิมยังให้ผลเดิม. นำเคสเหล่านี้ไปวาง tests ไม่สร้าง audit เพิ่ม.

R4 ระบบเลขหน้ารอปิดจุดต่อ Section รอบนี้ก่อน; DOCX/frontend/formulas/
ขนาดกระดาษอื่น/DB node tree/การซ้อนเพิ่มยังอยู่นอกขอบเขต.
R1 migration004 test debt ยังคงรายการเดิมก่อน release รวม.
