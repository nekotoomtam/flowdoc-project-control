# FlowDoc — ข้อตกลงเจ้าของข้อมูลตาม Section

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Status: owner-accepted direction and PDF, recorded 2026-10-10; implemented and
integrated in development0.1.12. See the plan's Accepted delivery for evidence.
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
เจ้าของยืนยันต่อมาให้คง template_id และเพิ่ม section_id คู่กันเฉพาะตารางเจ้าของ.
รายละเอียดด้านล่างเป็นแบบ DB สำหรับนำไปทำ implementation plan ไม่ใช่ migration ที่รันแล้ว.

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
2. ใช้รายละเอียด DB ด้านล่างกาง migration/transactions และ tests; ปิด mapping
   ตัวตน Section เดิมกับ ID แถวใหม่พร้อม Core contract ก่อนเขียน DDL จริง.
3. ทำ Core ตามสัญญาที่รับ แล้ว Service DB/API/แพ็กเกจ พร้อมหลักฐานทั้งเส้นทาง.

Acceptance ที่ต้องใช้ในแผนลงมือ: หลาย Sections ที่ key ตัวแปรซ้ำแต่ข้อมูลต่าง,
หัวท้ายต่างกันบนความกว้างเท่ากัน, Area/ภาพไม่ปะปน, scoped diagnostics,
เปลี่ยน label ไม่ทำ identity หลุด, FK กันข้าม Document, publish แยกจาก current,
และเอกสารรุ่นเดิมยังให้ผลเดิม. นำเคสเหล่านี้ไปวาง tests ไม่สร้าง audit เพิ่ม.

R4 ระบบเลขหน้ารอปิดจุดต่อ Section รอบนี้ก่อน; DOCX/frontend/formulas/
ขนาดกระดาษอื่น/DB node tree/การซ้อนเพิ่มยังอยู่นอกขอบเขต.
R1 migration004 test debt ยังคงรายการเดิมก่อน release รวม.


## รายละเอียด DB หลังยืนยัน ID คู่ — 2026-10-10

ข้อตกลงเจ้าของ: คง template_id คู่กับ section_id ไม่เพิ่ม section_id ทุกตาราง.
ส่วนต่อไปเป็นข้อกำหนดออกแบบที่โคจัดให้ตามคำขอเก็บรายละเอียดก่อนเริ่ม;
ยังต้องพิสูจน์ด้วย migration และ API tests เมื่อ implementation.

### ตารางและแหล่งข้อมูลหลัก

| ตาราง | คอลัมน์/หน้าที่เพิ่มหรือคงไว้ |
| --- | --- |
| sections | id, template_id, key, label, position, payload, created_at, updated_at |
| formats | คง template_id และ owner_area_variable_id; เพิ่ม section_id nullable เพื่อรองรับข้อมูลร่วม/รุ่นเดิม |
| variable_schemas | คง template_id, scope, format_id; เพิ่ม section_id nullable |
| variables | คง schema_id, parent_id และ type_id; ไม่เพิ่ม template_id/section_id ซ้ำ |
| section_versions | id ใหม่, template_version_id, source_section_id, key, label, position, payload, created_at |
| format_versions / variable_schema_versions | คง template_version_id และเพิ่ม section_version_id |
| variable_versions | ตาม schema_version_id เหมือนเดิม ไม่เพิ่มเจ้าของซ้ำ |

sections.template_id อ้าง template_current.template_id; section_versions อ้าง
ชุด template_snapshots ของ template_version_id เหมือนตารางเวอร์ชันเดิม.
เลขเวอร์ชันอยู่ที่ template_versions ไม่เพิ่มเลขอิสระให้แต่ละ Section.
payload ของ Section เก็บโครงเนื้อหา/หัวท้ายและค่าหรือ reference หน้ากระดาษ
โดยเลือก source of truth เพียงจุดเดียวใน contract ไม่เก็บ graph เดียวซ้ำทั้ง
Section row และ template_current.payload. Schema ตัวแปรยังแยกเป็นแถวตามเดิม.
source_section_id ใช้ระบุที่มา ไม่ทำ FK แบบ cascade ไปชุด current ที่แก้/ลบได้.

### กติกา NULL ของชุดตัวแปร

เพิ่ม scope section สำหรับชุดเนื้อหา โดยไม่เปลี่ยนความหมาย global/format เดิม.

| scope | section_id ในแม่แบบรุ่นใหม่ | format_id |
| --- | --- | --- |
| global | NULL: ข้อมูลร่วมทั้งเล่ม | NULL |
| section | ต้องมี: เนื้อหาของ Section | NULL |
| header / footer | ต้องมี: หัว/ท้ายของ Section | NULL |
| format | ต้องตรงกับเจ้าของ format รวมกรณี NULL | ต้องมี |

แบบเก่าถึง model14 ยังคง header/footer ระดับเล่มและ section_id NULL ได้.
NULL จึงไม่ใช่หลักฐานว่าแถวผิดหรือจำเป็นต้องย้าย; ต้องพิจารณารุ่นแม่แบบด้วย.
กฎที่อาศัยรุ่นใน parent ใช้ validation และ constraint trigger ตามความจำเป็น
ไม่พยายามเขียน CHECK ธรรมดาให้อ่านข้อมูลอีกตาราง.

formats ที่ไม่ได้อยู่ใต้ area ในรุ่นใหม่มี Section เป็นเจ้าของโดยตรง.
formats ใต้ area รับ section_id จาก schema เจ้าของ area (หรือ format เจ้าของ schema)
และต้องตรงกันทั้ง document/section. หากเป็น area ใน globalSchema เดิม
เจ้าของยังเป็นระดับเล่มและ section_id NULL; ตำแหน่งวางใน Section ไม่เปลี่ยนเจ้าของ
โดยอัตโนมัติ. คงกฎ area หนึ่งตำแหน่งและไม่ซ้อนตามเดิม ไม่เปิดให้ reuse หลาย Section.

### FK และความเป็นเอกสารเดียวกัน

- sections มี UNIQUE(id, template_id); ตารางที่อ้างใช้ FK คู่
  (section_id, template_id) → sections(id, template_id).
- ทุก owner row ยังต้องมี template_id ที่ถูกต้อง แม้ section_id เป็น NULL.
- schema ของ format ต้องอยู่ document และ section เดียวกับ format.
  FK คู่เดิม (format_id, template_id) กันข้ามเล่มได้ แต่ยังไม่กันข้าม Section.
  ต้องมีการตรวจ section ด้วย NULL-safe equality (`IS NOT DISTINCT FROM`)
  ผ่าน constraint trigger หรือกลไกเทียบเท่าที่พิสูจน์แล้ว ไม่พึ่ง composite FK
  สามช่องเพียงอย่างเดียว เพราะ NULL อาจทำให้ FK ไม่ตรวจคู่ที่เหลือ.
- constraint ของ area ตรวจชนิดตัวแปร เจ้าของ Document และ Section ให้ตรง
  รวมถึงตรวจการเปลี่ยน owner schema ไม่ใช่ตรวจตอน insert format อย่างเดียว.
- เวอร์ชันใช้กฎเดียวกันแต่ทุก reference ชี้ไปชุดเวอร์ชันเดียวกัน.
  master variable_types ยังใช้ร่วม ไม่ clone.

### ชื่อซ้ำ ลำดับ และตัวตน

- Section key ต้องไม่ซ้ำภายใน Document: UNIQUE(template_id, key).
  Section label ซ้ำได้; label ไม่ใช่ key/reference.
- Section position เป็นจำนวนเต็มไม่ติดลบและไม่ซ้ำในเล่ม; การสลับลำดับต้อง
  สำเร็จใน transaction เดียว รองรับ deferred uniqueness หรือการย้ายลำดับที่ปลอดภัย.
- Schema หนึ่งชุดต่อเจ้าของ/scope ใช้ uniqueness ที่รวม template_id, section_id,
  scope, format_id และถือ NULL เป็นค่าเดียวกัน (`NULLS NOT DISTINCT`).
- Top-level format key ไม่ซ้ำภายใน document/section; แถวรุ่นเดิมหรือเจ้าของ
  ระดับเล่มที่ section_id NULL ยังคง uniqueness ระดับเล่ม.
- Area-format key ไม่ซ้ำภายใต้ owner_area_variable_id ตามเดิม.
- Variable key ไม่ซ้ำภายใน schema_id + parent_id ตามเดิม;
  ชื่อเดียวกันต่าง Section/หัว/ท้ายจึงเป็นคนละตัวได้.
- คง source_definition_id ของ area-format ไม่ซ้ำใน Document ตามเดิม
  จนกว่า Core contract จะเปลี่ยน identifier นี้อย่างชัดเจน.
- ห้ามย้าย ID เดิมไปเป็นเจ้าของคนละ Document/Section/scope โดยเงียบ ๆ.
  เปลี่ยน label ได้; เปลี่ยน key เป็นการเปลี่ยน API ของ current และต้อง publish
  เวอร์ชันใหม่ก่อนผู้เรียกเวอร์ชันใหม่นำไปใช้. เวอร์ชันเก่าไม่เปลี่ยน.

### การลบและ publish

ไม่เพิ่ม cascade จาก Section ไปทุกตารางโดยอัตโนมัติ.
ใช้ RESTRICT/NO ACTION ที่ขอบ Section กับแถวเจ้าของ และให้คำสั่งแก้ current
ลบชุดที่เป็นเจ้าของจริงใน transaction เดียว ตรวจ references ที่เหลือก่อน commit.
Cascade เดิมภายใน schema → variables/area-owned formats ใช้ต่อได้ตามกฎเดิม.
ถ้ามี reference จากส่วนอื่นที่ยังไม่จัดการ ให้ปฏิเสธพร้อมระบุจุดอ้าง
แทนลบข้อมูลร่วม/อีก Section ให้เอง. ขั้นตอน SQL ต้องรองรับการ save แบบ replace
ของ storage.ts เดิม โดยไม่ลบ Section แล้วสร้าง ID ใหม่ทุกครั้ง.

Publish อ่าน revision เดียวกันใน transaction แล้ว clone Sections ก่อนลูก,
สร้าง mapping current ID → version ID และต่อ owner references ของ schema/format
ไปชุดใหม่ทั้งหมด. ตรวจไม่ให้ version row อ้าง current row เพื่อใช้ render.
แถว version immutable ตามเดิม; การลบ current ไม่ลบ version.

### การย้ายข้อมูล: แยก DB migration ออกจากการแปลงแม่แบบ

1. เพิ่มตาราง/คอลัมน์ nullable และปรับ constraints/indexes แบบ forward migration.
   แถวเก่าคง section_id NULL; ไม่สร้าง section สมมติหรือแจก format ไป section แรก.
2. ไม่ UPDATE payload, definition_json, fingerprint หรือแถว published เดิม
   เพื่อแปลงเป็น model ใหม่. การเพิ่มคอลัมน์ nullable ไม่ต้องปิด immutable trigger
   เพื่อ backfill Section ให้ snapshot เก่า.
3. เส้นทางอ่าน/assemble รุ่นเดิมละ field ใหม่ที่ไม่เกี่ยวข้อง ไม่เติม field NULL
   ลง definition จนทำให้ fingerprint เดิมเปลี่ยน. ตรวจทั้ง fresh DB และ DB มีข้อมูล.
4. การอัปเกรด current เป็นคำสั่งแยกจาก schema migration ต้องระบุ mapping ชัดว่า
   format/area/ข้อมูล/หัวท้ายเดิมเป็นของ Section ไหน; ไม่เดาเมื่อหลายส่วนใช้ร่วม.
   จัดการ Section identity เดิมและ DB row ID พร้อม mapping references ใน transaction.
5. ถ้า mapping ขาดหรือ validation ไม่ผ่าน rollback ทั้งชุด; เก็บ current เดิมไว้.
   เมื่อแปลงผ่านจึง publish เวอร์ชันใหม่; request และ jobs ที่ pin เวอร์ชันเดิม
   ใช้สัญญาเดิมต่อไป ไม่ rewrite งานที่เข้าคิวแล้ว.

### หลักฐานที่ต้องเพิ่มตอนลงมือ

- ชื่อซ้ำข้าม Section ผ่าน แต่ซ้ำภายในเจ้าของเดียวกันถูกปฏิเสธ.
- FK กันข้าม Document; owner check กันข้าม Section รวมกรณี NULL/ไม่ NULL.
- ลำดับสลับได้ใน transaction; ID/created_at เดิมอยู่เมื่อ save/rename.
- ลบ current Section ไม่กระทบค่าร่วม อีก Section หรือ published version.
- Clone แล้ว references/IDs อยู่ใน version เดียวกัน ไม่กลับไปอ่าน current.
- DB เก่าผ่าน migration แล้ว fingerprint และผล PDF ของแม่แบบเดิมคงเดิม.
- ข้อมูล/หัวท้าย/ภาพของ Sections ที่ความกว้างเท่ากันไม่ปะปน.

รายละเอียดที่ยังต้องปิดใน Core/API contract: วิธี map authored Section ID กับ
DB ID, syntax อ้างค่าร่วม/ค่า Section ส่วนพฤติกรรม omitted/unknown Section ปิดแล้วตามข้อตกลง API ด้านล่าง.
ไม่ถือว่าการปิดแบบ DB นี้ปิด API contract หรือพิสูจน์ implementation แล้ว.


## ข้อตกลง API ที่เจ้าของรับต่อ — 2026-10-10

ตัวอย่างรูปทรงคำขอสำหรับรุ่นใหม่ (ยังไม่ใช่ endpoint ที่รองรับแล้ว):

```json
{
  "docKey": "project-report",
  "version": 2,
  "data": { "projectName": "โครงการ A" },
  "sections": {
    "overview": {
      "data": { "description": "ภาพรวมโครงการ" },
      "header": { "title": "ภาพรวม" },
      "footer": {}
    },
    "requirements": {
      "data": { "items": [] },
      "header": { "title": "ข้อกำหนด" },
      "footer": {}
    }
  }
}
```

- ผู้สร้างแม่แบบประกาศ Section ID/key, ลำดับ, หน้าและ schemas ไว้ก่อน.
  ผู้เรียกใช้ key ไม่ส่ง ID ภายใน DB หรือ node graph.
- ลำดับ key ใน request ไม่กำหนดลำดับเอกสาร; ยึดลำดับแม่แบบ.
- ไม่ส่ง Section ไม่ได้แปลว่าตัด Section นั้นออก. ถือเป็นข้อมูลว่าง แล้วใช้
  default และ required ตาม schemas ที่ประกาศ รวมเนื้อหา/หัว/ท้าย.
  เมื่อมี required ขาดให้ตอบตำแหน่งที่ขาด ไม่เริ่ม job.
- ไม่ส่งค่าไม่เหมือนส่งชนิดผิด; object หรือค่าที่ชนิดผิดยังถูกตรวจตามสัญญา.
- ปกเป็น Section role cover; อ้างค่าเฉพาะ Section หรือค่าร่วมได้
  และยังไม่แสดงหัวท้ายตามกฎเดิม. ทางอ่านรุ่นเก่าไม่เปลี่ยน.
- การอ้างค่าร่วม/ค่าเฉพาะต้องระบุขอบเขตชัด ไม่ค้นข้ามอัตโนมัติ.
  syntax field reference ที่แน่นอนยังต้องกางใน Core contract.

### ชื่อ Section ที่ไม่รู้จัก: strict เป็นค่าเริ่มต้น

เจ้าของเลือกตามคำแนะนำหลังอภิปรายการข้ามบางส่วน:
ถ้ามี key ใน request.sections ที่ไม่มีในแม่แบบเวอร์ชันที่เลือก
ให้ปฏิเสธทั้งคำขอก่อนสร้าง job และก่อนเริ่ม render.
แจ้ง key/path ที่ผิด พร้อม Section keys ที่รองรับของแม่แบบนั้น.
ใช้กฎเดียวไม่ว่ามี Section เดียว หลาย Section หรือถูก/ผิดปนกัน.
ห้ามรายงานสำเร็จพร้อมข้าม Section ที่ไม่รู้จักเงียบ ๆ.

การข้าม Section ผิดเพื่อออกเอกสารบางส่วนเป็นแนวคิด mode ในอนาคตเท่านั้น
ยังไม่เพิ่ม field/flag/branch พฤติกรรมในรอบนี้.
กฎนี้เจาะจง Section key ไม่เปลี่ยนนโยบาย unknown variable/unknown area format เดิม.

Acceptance เพิ่ม: unknown key เดี่ยว/ปน known/ผิดทั้งหมดต้องไม่สร้าง job;
response ชี้ key ถูกต้อง; omitted Section ใช้ default หรือแจ้ง required;
request เรียง keys ต่างกันยังได้ลำดับแม่แบบเดิม.
นี่เป็นผลรับ contract ไม่ใช่ผลทดสอบ runtime.


## ขอบเขตการอ้างตัวแปรที่เจ้าของรับ — 2026-10-10

ผู้ใช้เห็นด้วยกับ ID/key/label แยกหน้าที่และ scopes ต่อไปนี้สำหรับรุ่นใหม่:

| scope | แหล่งข้อมูล |
| --- | --- |
| global | request.data ร่วมทั้งเล่ม |
| section | request.sections.<key>.data ของ Section ปัจจุบัน |
| header | request.sections.<key>.header ของ Section ปัจจุบัน |
| footer | request.sections.<key>.footer ของ Section ปัจจุบัน |
| local | ข้อมูลของโครงย่อยที่กำลังประกอบ ตามหลักเดิม |
| item | ข้อมูลรายการที่กำลังวน ตามหลักเดิม |

Binding ระบุ scope และ key ชัดเจน เช่นหัวกระดาษอ้าง
{scope:'global',key:'projectName'} ร่วมกับ {scope:'header',key:'title'} ได้.
ไม่มี fallback ค้นชื่อใน scope อื่นเมื่อหาไม่เจอ.
รายชื่อ scopes ไม่ได้เปิดทุก scope ในทุกชนิด node; แผนลงมือต้องระบุ legality
ตามบริบทที่มีข้อมูลจริง โดยไม่เพิ่ม repeats/Area ในหัวท้ายเกิน R3.

ไม่เปิดการอ้างค่าของ Section อื่นโดยตรงในระยะนี้.
ค่าที่ต้องใช้หลาย Section ให้ใช้ global; ไม่เพิ่ม cross-section reference syntax.
กฎนี้ไม่เปลี่ยนลิงก์/anchor ข้ามหน้าเดิม ซึ่งเป็นคนละเรื่องกับการอ่านตัวแปร.
การอ่าน model14/เก่าคงความหมายเดิม รวม global ภายใน band ตามสัญญาเก่า;
ห้ามตีความ band เก่าด้วย scope ใหม่โดยอัตโนมัติ.

Section id เป็นตัวตนคงที่, key สำหรับ API, label สำหรับแสดงผล.
เมื่อ publish สร้าง ID ของแถวเวอร์ชันใหม่และ map references ภายในชุดนั้น
โดยคัดลอก key/label ณ เวลาที่ publish; ผู้เรียกไม่ต้องส่ง DB IDs.
รายละเอียด mapping authored identity กับแถว DB ยังคงเป็นจุดที่ต้องระบุ
ในแผนลงมือให้แน่นอน ไม่อนุมานว่าผลรับนี้อนุญาตสร้าง ID ใหม่ทุกครั้งที่ save.

ผลรับนี้เป็นขอบเขตออกแบบ ไม่ใช่ผล implementation. ขั้นต่อไปกางแผน Core
และ Service พร้อมตัวอย่างแม่แบบ/request คู่กันและเกณฑ์ทดสอบที่บันทึกไว้.


แผนลงมือสำหรับตรวจ: [Section ownership implementation plan](flowdoc-section-ownership-plan-2026-10-10.md).
เจ้าของอนุมัติแผนแล้ว; ผลตรวจ candidate0.1.12 และสิ่งที่ยังรออยู่บันทึกใน
Delivery checkpoint และ Accepted delivery ของแผน รวมฝั่งพัฒนาแล้ว แต่ยังไม่ขึ้น release.
