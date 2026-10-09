# FlowDoc — จุดเริ่มอ่านสำหรับห้องที่รับต่องาน Cell Content

## Authority Boundary

Owner: Project Control. Role: Documentation Synthesizer. Status: context handoff,
2026-10-09. This is a bounded entrypoint to existing decisions and plans, not a
replacement specification, runtime Evidence, execution packet or release authority.
Follow Project Control AGENTS.md and its current workflow economy policy first.
Inline documentation maintenance; execution/Phase/Checklist IDs N/A. Risk routine.
Document budget: this entrypoint and a pointer in the existing rules draft.
Proof: referenced-file existence, consistency with current conversation/plan,
diff review and check:data. No new room, runtime change or execution is dispatched.

## งานนี้ทำไปเพื่ออะไร

FlowDoc ให้ผู้เรียกจัดข้อมูลและลำดับรายการ แล้วระบบสร้างเอกสารจากแม่แบบที่เตรียมไว้
ผู้เรียก API ไม่ต้องจัด node, childIds, padding หรือจุดแบ่งหน้าเอง
ชุดปัจจุบันเน้น backend/Core export PDF ยังไม่สร้าง frontend หรือ DOCX

## อ่านอะไรและเริ่มตรงไหน

1. อ่าน Project Control `AGENTS.md` แล้วตรวจสถานะ canonical และ checkout ปัจจุบัน
   ก่อนเริ่มจริง ห้ามถือว่าบันทึกวันที่นี้เป็นสถานะล่าสุดโดยไม่ตรวจ
2. อ่าน [ร่างโครงสร้างหกพาร์ต](flowdoc-export-node-structure-draft-2026-10-09.md)
   เพื่อรู้เหตุผล ขอบเขตที่ตกลง และหัวข้อที่เลื่อนไว้
3. อ่าน [แผน Cell Content](flowdoc-cell-content-plan-2026-10-09.md)
   เพื่อดู task, files, acceptance, proof budget และข้อเสนอที่ยังต้องสรุป
4. อ่าน [ร่างกติกาทำงาน/ออกรุ่น](flowdoc-export-working-release-rules-draft-2026-10-09.md)
   โดยแยกหลักที่เจ้าของยืนยันจากกติกาทำงานที่ยังเป็นร่าง
5. ก่อนแก้ Core/Service อ่าน AGENTS ของ repo เจ้าของ ไม่เริ่มจากห้อง/ทะเบียนเก่า

## จุดที่คุยค้างและสถานะจริง ณ ตอนส่งต่อ

- งาน runtime ชุด Cell Content ลงมือแล้วใน worktree แยกของ Core/Service;
  ดู commit และผลตรวจล่าสุดจาก Inline execution ledger ในแผน Cell Content
- Core tests 250/250 และ packed consumer ผ่าน; Service real-DB/API checks 16/16 ผ่าน
  มี PDF ทดลอง 15 หน้า รอเจ้าของตรวจ ยังไม่ integrate หรือเพิ่มเวอร์ชัน/release
- ฐานที่แผนเคยตรวจคือ Core/Service 0.1.5; commit และ release provenance อยู่ใน
  เอกสารที่อ้าง ไม่ต้องสร้าง release ใหม่เพราะเข้ามารับงาน
- พาร์ต 1–2 คุยหน้าที่ node, childIds และ identity แล้ว; พาร์ต 3–4 คุยขนาด
  padding และการแบ่งหน้า รวมการเตรียมความสัมพันธ์เซลล์รวมครั้งเดียวต่อ layout pass
- แผนมี Task 1–4 สำหรับ implementation ซึ่งคนละชุดเลขกับพาร์ตออกแบบ 1–6
- เจ้าของยืนยัน padding รายด้านเป็น Length หน่วย pt/mm แล้ว: ไม่ระบุใช้ 4pt
  เฉพาะด้านที่ขาด ค่า 0 ต้องรักษาไว้ รายละเอียดและเกณฑ์ตรวจอยู่ในแผน Cell Content
- ขั้นถัดไปคือให้เจ้าของตรวจ PDF ตาม artifact ที่ระบุใน ledger แล้วจึงจัดการ
  รุ่นส่งมอบ การตรวจแพ็กเกจ/consumer ที่เปลี่ยน และ integration ตามอำนาจที่มี
  อย่าเริ่มทำ implementation ซ้ำหรือเอา area มารวม; candidate ยังใช้ metadata
  รุ่นเก่าใน lane ทดลองเท่านั้น ต้องไม่ปะปนกับ release 0.1.5

## ประเด็นสำคัญที่ห้องใหม่ต้องไม่ตีความคลาด

- Cell รับ TextBlock/Image หลายชิ้นเรียงแนวตั้งตาม childIds; childIds เป็น ID
  ของ node ไม่ใช่ชื่อตัวแปร แต่ละภาพเป็น node แยก แม้ใช้ resource ภาพเดียวกันได้
- ยังไม่เพิ่ม Columns, ตารางซ้อน, container, area หรือ image item binding ใหม่
  ใน slice นี้; คงความสามารถรวมเซลล์เดิม
- Padding ให้ผู้สร้างตั้งในแม่แบบ ค่า 0 ต้องไม่ถูกแทนด้วย default; ไม่ระบุจึงใช้
  ค่าเริ่มต้น 4pt ต่อด้าน ผลวัดและการแบ่งหน้าต้องใช้ค่าเดียวกัน
- การเตรียมแผนผังเซลล์รวมเป็นหนึ่งครั้งต่อ table instance ต่อ layout pass
  ไม่ใช่ cache ตลอดอายุเอกสาร และไม่ตัด validation ขั้นอื่นทิ้ง
  การคำนวณพื้นที่คงเหลือ/จุดตัดต่อหน้ายังจำเป็น แบ่งงานนี้เป็น Task 3A–3C แล้ว
- ตรวจหลายเซลล์ หลายหน้า และหลายตาราง ไม่อาศัยเพียงเคสง่ายหนึ่งเซลล์หรือ
  ตัวนับการเรียก; ต้องพิสูจน์เนื้อหา/กรอบไม่หาย ไม่ซ้ำ และ PDF ถูกต้อง
- เรื่อง array ของภาพและ area มีความต้องการจริง แต่เจ้าของย้ายไปพาร์ต 5
  และ compatibility พาร์ต 6 แล้ว ไม่ดึงกลับมาเป็นเงื่อนไขก่อนทำ cell
- Area ที่นิยามผิดทำเอกสารไม่ได้; รายการข้อมูล area ใช้ไม่ได้ให้ข้ามพร้อม warning
  และทำส่วนที่เหลือต่อ; [] ใช้ได้ นี่เป็นข้อตกลงอนาคต ไม่ใช่พฤติกรรมที่ทำแล้ว
- Frontend อนาคตใช้ Adapter แปลงไป–กลับได้โดยไม่เสียความหมาย; พรีวิวที่ต้องตรง
  กับ PDF ใช้ Core wrap/layout ร่วมกัน ไม่เริ่มสร้าง editor/adapter ในงานนี้

## วิธีทำงานร่วมกับเจ้าของ

เจ้าของต้องการคุยรายละเอียดเป็นพาร์ตและให้แยกสิ่งที่ตกลง ข้อเสนอ และสิ่งที่ยังเปิด
ตัวอย่าง ID ใช้ node-001/node-002 ให้ต่างจาก key ของตัวแปรอย่างชัดเจน
เมื่อมีแนวคิดใหม่ให้เก็บไว้ในพาร์ตที่เกี่ยวข้อง ไม่ขยายงานที่กำลังทำโดยเงียบ ๆ
อธิบายผลต่อการใช้งานจริงและข้อจำกัด ไม่อ้างว่า test ผ่านเท่ากับใช้จริงผ่านทุกกรณี
การเพิ่มเวอร์ชันต้องมีการเปลี่ยนโค้ดที่ใช้ได้จริงและตรวจผ่าน ไม่เพิ่มทุกพาร์ตอัตโนมัติ
release รอครบตาม roadmap และอำนาจอนุมัติที่ครอบคลุม ไม่ใช่ทุก dev version

## การรับต่อ

เอกสารนี้ให้บริบท ไม่สั่งให้เปิดห้อง ส่งข้อความ ทำ implementation หรือ merge
ห้องใหม่สรุปจุดเริ่มจากเอกสารที่อ้าง ตรวจว่ามีการแก้ใหม่หลังบันทึกนี้หรือไม่
และดำเนินตามคำขอปัจจุบันของเจ้าของ; ไม่รื้อข้อตกลงที่ชัดแล้วหรือเปิด round เก่ากลับมา
