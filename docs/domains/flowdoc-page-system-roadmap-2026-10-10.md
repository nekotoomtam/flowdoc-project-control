# FlowDoc — Roadmap ระบบหน้ากระดาษหลัง 0.1.8

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Status: R0–R6 accepted; Core/Service local release0.2.0 completed, 2026-10-10.
Spec: [ร่างระบบหน้ากระดาษและส่วนของเล่ม](flowdoc-page-system-draft-2026-10-10.md)
เริ่มจากคำขอกาง roadmap; ต่อมาเจ้าของอนุญาตให้เริ่ม R1 หลังรับข้อสรุป R0 แล้ว
เอกสารนี้เป็นลำดับผลส่งมอบ ไม่ใช่แผนลงโค้ดรายไฟล์ที่ให้ executor เดาสัญญาเอง
คำถามที่ยังเปิดต้องปิดก่อนพาร์ตที่เกี่ยวข้อง แล้วเติมแผนลงมือเฉพาะพาร์ตนั้น
ไม่เขียน signature/ชื่อ field ที่ยังไม่ตกลงให้ดูเหมือนเป็น contract ที่ใช้แล้ว

การร่างเดิมเป็นงานเอกสาร inline, small/routine, execution IDs ไม่ applicable; authority คือ
คำขอเจ้าของและร่างที่อ้าง ใช้ workflow economy policy ของ Project Control
scope: roadmap นี้และลิงก์ในร่างเดิม; ห้ามแก้ runtime, DB, package, release หรือ map
proof budget: coverage ของร่าง, dependency/acceptance review, links/diff และ check:data
document budget สองไฟล์; ไม่สร้าง Work/ห้อง/ทะเบียนใหม่สำหรับ roadmap นี้
ฐาน release0.1.8 และหลักฐานอยู่ใน
[จุดรับต่องาน](flowdoc-cell-content-handoff-2026-10-09.md#สถานะล่าสุด--release-018-แล้วเมื่อ-2026-10-10)

## เป้าหมายส่งมอบ

แม่แบบหนึ่งชุดสร้างเล่มที่มีปก สารบัญ เนื้อหาหลายหน้า หัว–ท้าย และเลขหน้า
ตามกติกาที่ผู้สร้างกำหนด ผู้เรียก API ส่งเฉพาะข้อมูล/รายการตาม contract
ของเดิมยังอ่านได้ ไม่แก้ snapshot ที่ publish ไปแล้ว และไม่มีเนื้อหาหาย/ซ้ำจากการแบ่งหน้า
Core เป็นผู้จัดหน้า; Service ไม่สร้าง layout engine อีกชุด

ลำดับปัจจุบัน: R0 → R1 → R2 → R3 → ปรับเจ้าของข้อมูลตาม Section → R4 → R5 → R6
R0 ปิดข้อกำหนดที่มีผลข้ามพาร์ตก่อน ส่วนรายละเอียดเฉพาะพาร์ตคุยก่อนเริ่มพาร์ตนั้น
สถานะ: **R0–R6 และ Section ownership ปิดแล้ว; ทั้งสอง repo ขึ้น release0.2.0**.
ผลรับ/หลักฐานอยู่ท้ายเอกสาร; รอบถัดไปออกแบบเลขหัวข้อตามระดับตามที่เจ้าของรับไว้
รายละเอียดสัญญาเป้าหมาย ตัวอย่าง และ task ลงมืออยู่ใน
[R0 contract / R1 tasks](flowdoc-page-system-r0-contract-2026-10-10.md)
การปิด R0 เป็นผลออกแบบ ไม่ใช่หลักฐานว่า runtime รองรับแล้ว

## R0 — ตรวจโค้ดและล็อกสัญญาพื้นฐาน

Owner: Project Control ออกแบบร่วมกับเจ้าของ; ตรวจ Core/Service แบบ read-only
ก่อนเริ่ม implementation ต้องอ่าน AGENTS ของ repo และตรวจฐานปัจจุบันอีกครั้ง

- [x] ไล่เส้นทางจริงจากแม่แบบ/API → snapshot → composition → layout → PDF
- [x] ล็อกวิธีผูกรายการ content กับส่วนของเล่ม พร้อมตัวอย่างแม่แบบและ request คู่กัน
- [x] ล็อก identity/reference, ลำดับส่วน, default/override ของรูปแบบหน้า
- [x] ล็อกนโยบายเริ่มส่วนใหม่ และแยกหน้าเปล่า/ซ่อนเลข/ไม่นับหน้า/ยกเว้นสารบัญ
- [x] กำหนดขอบเขตข้อมูลหน้าจริง/section metadata; เลขแสดงลงรายละเอียดใน R4
- [x] กำหนดทางอ่านแม่แบบเดิม, model gate และผลต่อ storage/contract/version
- [x] กำหนดขอบเขตกล่องความสูงคงที่: TextBlock รากบนปก หน่วยmm/pt ไม่มี padding ใหม่
  การจัดแนวตั้ง และ overflow diagnostics โดยคงโหมดสูงตามเนื้อหาเดิม

ข้อตกลงที่รับแล้วระหว่าง R0: ผู้สร้างกำหนด cover และตัวแปร; ปกหน้าแรกหน้าเดียว
ไม่แสดงเลข/ไม่นับหน้า หน้าหลังปกเริ่ม1; ปกล้นให้หยุดออกเอกสาร ไม่ต่อ/ตัด/ย่อเอง
รับโหมดล็อกความสูงเพื่อจองพื้นที่ให้ node โดยเนื้อหาเพิ่มภายในไม่ดัน node ล่าง
รายละเอียดและขอบเขตที่ยังต้องล็อกอยู่ในร่างหัวข้อข้อตกลงเพิ่มเติมระหว่าง R0
ตัวอย่าง sections ใน request จากแชตเดิมไม่ถูกเลือก ปกไม่ต้องรอรายการจากผู้เรียก
สัญญาใหม่ใช้ sections ในแม่แบบ; request คง data/content และใช้ Area เพิ่มเติม

ข้อตกลงต่อมาในวันเดียวกัน: แยกเนื้อหาที่แม่แบบกำหนดให้เกิดเองและเติมตัวแปร
ออกจากพื้นที่รับรายการ API เล่มพื้นฐานใช้ data กลางเติมปก และส่ง content
เข้าเนื้อหาหลักตามเดิม ไม่ต้องส่งรายการสร้างปก/สารบัญเพิ่ม
ดูตัวอย่างคู่ความหมายในร่างหัวข้อเนื้อหาจากแม่แบบกับรายการจาก API
ต่อมาปิดรายละเอียด references/content ว่าง/หลายพื้นที่ใน R0 contract ที่อ้างด้านบน
ไม่ถือว่าการบันทึกสัญญาคือการเปลี่ยนโค้ดแล้ว

เจ้าของรับต่อ: รูปแบบหน้าและส่วนของเล่มมี ID แยก ชื่อที่แสดงเปลี่ยนได้โดย
ไม่ทำ reference หลุด; ผู้สร้างกำหนดลำดับส่วน และส่วนใหม่เริ่มหน้าใหม่เสมอในรอบนี้
ไม่ขึ้นหน้าใหม่เพียงเพราะเปลี่ยน node/format ในส่วนเดิม หลายพื้นที่รับรายการ
ใช้ key ของ Area ที่ผู้สร้างตั้ง ส่วนความสัมพันธ์ภายในใช้ ID ตรวจของเดิมแล้ว
และเลือกไม่เพิ่มช่อง sections ใน request รายละเอียดอยู่ใน R0 contract

ผลส่งมอบ: ตัวอย่างสัญญาหนึ่งชุด กติกาที่ไม่มีความหมายซ้อนกัน และรายการไฟล์/
interfaces/ผู้ใช้ต่อที่ตรวจจากโค้ดจริง รวมแผนลงมือ R1 พร้อมวิธีตรวจ
ผ่านเมื่อผู้สร้างรู้ว่าจะประกาศอะไร ผู้เรียกเห็น request ที่ส่งได้ และไม่มีคำถาม
architecture/ownership ที่ปล่อยให้ implementation เดา ไม่สร้าง migration ล่วงหน้า

## R1 — รูปแบบหน้าและส่วนของเล่มใช้งานได้

Owner: Core; Service รับสัญญาใหม่เฉพาะส่วนที่จำเป็น พึ่ง R0

- [x] ทำ validation/binding/composition ของสามส่วนตามสัญญาที่ล็อก
- [x] จัดเนื้อหาหลายหน้าโดยรักษาส่วนของเล่มและต้นทางของ node
- [x] รองรับเส้นทางแม่แบบเดิมโดยไม่เปลี่ยนข้อมูลที่เผยแพร่แล้ว
- [x] ต่อ import/save/publish/contract และออก PDF ผ่าน Service ถ้าสัญญากระทบส่วนนี้

ผลส่งมอบ: เล่มที่มีหลายส่วนใช้รูปแบบหน้าตามที่กำหนด และมี PDF ผ่าน API ให้ตรวจ
เกณฑ์: ข้อมูลสั้น/ยาว, ส่วนว่างตามกติกา R0, reference ผิด, defaults/override,
ขอบหน้าและช่วงต่อของ node ถูกต้อง; ตรวจ snapshot ใหม่/เก่าแยกจาก current
ตรวจเปลี่ยนชื่อที่แสดงโดย ID เดิมแล้ว reference ยังถูก และหลายส่วนใช้รูปแบบหน้าเดียวกัน
เปลี่ยนส่วนเริ่มหน้าใหม่แต่เปลี่ยน format ภายในส่วนไม่บังคับขึ้นหน้าใหม่
หลักฐาน: Core contract/layout tests, packed consumer, Service boundary tests ที่กระทบ
และ PDF ตัวอย่าง อย่าอ้างว่าหัวท้าย/เลขหน้าแบบใหม่เสร็จในขั้นนี้

## R2 — ปก หน้าเฉพาะ และการเริ่มหน้า

Owner: Core; Service ตรวจการเก็บ/ส่งผ่านถ้ามี field เพิ่ม พึ่ง R1

2026-10-10: เริ่มทวนเส้นทางและร่าง
[R2 design สำหรับตรวจ](flowdoc-page-system-r2-design-2026-10-10.md)
หลังเจ้าของให้ไปต่อจาก R1; ต่อมายืนยันปกไม่เข้าสารบัญและให้เร่งต่อ
[แผนลงมือ R2](flowdoc-page-system-r2-plan-2026-10-10.md) ส่งมอบแล้ว ดูผลรับและหลักฐานท้ายแผน
Core `3e85fd2` / Service `7ea6150`, รุ่นพัฒนา0.1.10; release ยังไม่เปลี่ยน

- [x] ล็อกแล้วทำกติกาปก หน้าเฉพาะ เริ่มหน้าใหม่ และหน้าเปล่าที่ตั้งใจแทรก
- [x] ทำกล่องล็อกความสูงตามขอบเขต R0 ควบคู่ปก ให้ node ล่างคงตำแหน่ง
  และข้อความที่เกินพื้นที่แจ้งผิดพลาดโดยไม่ปล่อยให้ทับกัน
- [x] รองรับกรณีเนื้อหาส่วนก่อนหน้าพอดีขอบหน้า/ล้นไปหน้าถัดไป
- [x] ระบุพฤติกรรมส่วนว่าง และตรวจปกยาวเกินพื้นที่ว่าหยุดพร้อม diagnostic

ผลส่งมอบ: ปกและเนื้อหาเริ่มตามคำสั่งโดยไม่ใช้การเติม newline เพื่อดันหน้า
ปกเป็นหน้าเดียวตามที่รับแล้ว และจัดข้อมูลตัวแปรลงในพื้นที่ที่จองได้
เกณฑ์: ไม่มีหน้าเปล่าเพิ่มโดยไม่ตั้งใจ; หน้าเปล่าที่สั่งมีจริง; เนื้อหาไม่หาย/ซ้ำ
ทดสอบตำแหน่งเริ่ม/กลาง/ท้ายเล่ม และตาราง/ภาพที่ต่อจากส่วนก่อนหน้า
ทดสอบชื่อโครงการ1บรรทัด/หลายบรรทัด/พอดีกล่อง/เกินกล่อง: ตำแหน่ง node ถัดไป
เท่ากันในกรณีที่วางได้ เกินกล่องต้อง error และอ้างต้นทางได้; ปกที่แต่ละกล่อง
ไม่ล้นแต่รวมแล้วเกินพื้นที่ปกต้องถูกตรวจด้วย ทดสอบค่าจริงที่ยาวกว่าตัวอย่างแม่แบบ
และยืนยันโหมดสูงตามเนื้อหาเดิมยังขยับ node ถัดไปตามปกติ
ยังไม่เพิ่มหน้าคู่/คี่หรือการเข้าเล่มอัตโนมัติหากไม่ได้เลือกใน R0

## R3 — หัวและท้ายกระดาษ

2026-10-10: เจ้าของรับกติกาแยก data/header/footer, cover/blank ไม่ใช้หัวท้าย,
ขั้นต่ำหนึ่งบรรทัด และเพดานรวม40%.
[ร่าง R3](flowdoc-page-system-r3-design-2026-10-10.md) บันทึกขอบเขตและจุดต่อ
Columns/schema ownership ตามสัญญาเดิมส่งมอบแล้ว ดูผลรับ R3 ท้ายเอกสาร.
[แผนลงมือ R3](flowdoc-page-system-r3-plan-2026-10-10.md) แบ่ง5งาน พร้อมตรวจ.

เจ้าของย้ำเมื่อ2026-10-10 ว่าอาจมีข้อกำหนดเพิ่ม ให้คุยรายละเอียดในพาร์ตนี้
ยังไม่ถือว่ากติกาปก/ส่วนว่างล็อกพฤติกรรมหัวท้ายครบแล้ว ต้องสรุปกรณีส่วนที่มี
เพียงหัวท้าย และการแสดงบนปก/หน้าเปล่า/หน้าแรกก่อน implementation ที่พึ่งกติกานั้น

Owner: Core; Service ดู resource binding/contract ที่ได้รับผล พึ่ง R1–R2

- [x] ล็อกชนิดเนื้อหาที่รองรับ ความสูง/พื้นที่ และการเลือกใช้หรือยกเว้นบางหน้า
- [x] ทำการวัด/สงวนพื้นที่เดียวกันทั้งการจัดเนื้อหาและการวาดหัวท้าย
- [x] ต่อ binding และการเตรียมภาพเฉพาะเมื่อเลือกให้หัวท้ายรองรับภาพ
- [x] ระบุ diagnostics สำหรับหัวท้ายหรือพื้นที่เนื้อหาที่วางไม่ลง

ผลส่งมอบ: หัวท้ายของแต่ละส่วนปรากฏถูกหน้าและไม่ทับเนื้อหา
เกณฑ์: หน้าแรก/หน้าต่อ/ปก/หน้าเปล่าตามกติกา, ข้อความหัวท้ายยาว,
พื้นที่เหลือน้อย, ตารางเซลล์รวม/ภาพต่อหน้า และตัวแปรที่เปลี่ยนค่าจริง
กรณีพื้นที่ไม่พอต้องมีผลตามนโยบายที่ล็อก ไม่ตัดเนื้อหาเงียบ ๆ

## R4 — การนับและแสดงเลขหน้า

Owner: Core พึ่ง R2–R3 และข้อมูลหน้าจริงจาก R1

เจ้าของยืนยันตัวแปรระบบ current/total ที่ผู้สร้างวางในหัวท้าย ไม่ส่งผ่าน API;
totalรวมหน้าที่ร่วมการนับทั้งเล่ม และ continue เป็นค่าเริ่มต้น.
[ร่างสัญญา R4 และเกณฑ์ทดสอบ](flowdoc-page-system-r4-design-2026-10-10.md)
เจ้าของรับแล้ว; [แผนลงมือ R4](flowdoc-page-system-r4-plan-2026-10-10.md)
ดำเนินการและรับงานแล้วตามผลรับ R4 ด้านล่าง.

- [x] ล็อกรูปแบบเลขเริ่มต้น การเริ่มใหม่/ต่อเนื่อง และความหมายของการซ่อนกับไม่นับ
- [x] ทำเลขแสดงโดยไม่เปลี่ยน identity หรือลำดับหน้าจริงใน PDF
- [x] แทนเลขหน้าชั่วคราวในแม่แบบใหม่ตามกติกา compatibility ที่ตกลง
- [x] ถ้ารับ total pages เข้าขอบเขต ต้องระบุว่ารวมทั้งเล่มหรือเฉพาะส่วนและพิสูจน์ผล

ผลส่งมอบ: ปกไม่แสดงเลขและเนื้อหาเริ่ม1ได้ตามกติกาที่เลือก รวมหลายส่วนที่นับต่อ/เริ่มใหม่
เกณฑ์: หน้าเปล่า, เลขข้ามหลัก9→10และ99→100, ส่วนที่ไม่มีเนื้อหา,
เลขซ้ำต่างส่วน และกรอบเลขวางไม่พอ ไม่ใช้เลขที่แสดงเป็น key ของจุดหมาย
ไม่ถือว่าเลขโรมันหรือ total pages ต้องมีเพียงเพราะใส่ชื่อไว้ในคำถามออกแบบ

## R5 — สารบัญสัมพันธ์กับระบบหน้า

Owner: Core; Service ตรวจ fixture/request ตาม contract พึ่ง R4

- [x] ล็อกการเลือกหัวข้อและเลขที่แสดง รวมกรณีหัวข้อบนหน้าที่ซ่อนเลข
- [x] ให้ชื่อ/เลขสารบัญอ้างจุดหมายจริง แม้เลขแสดงของต่างส่วนซ้ำกัน
- [x] ตรวจผลเมื่อสารบัญยาวหลายหน้าและทำให้หน้าเนื้อหาขยับ
- [x] รักษากติกาหัวข้อในตาราง/Area และ destination ที่ข้ามหน้า

ผลส่งมอบ: สารบัญแสดงเลขตามกติกาเล่มและทั้งชื่อ/เลขกดไปหัวข้อถูก
เกณฑ์: สารบัญหลายหน้า, ชื่อยาว wrap, หัวข้อที่ต่อหน้า, เริ่มเลขใหม่หลายส่วน,
หัวข้อหาย/IDซ้ำ และผลของการเปลี่ยนข้อมูลจำนวนมาก
ใช้ระดับสารบัญเดิม1–3ก่อน การเพิ่ม5–7ระดับเป็นงานแยกถ้าเจ้าของไม่เพิ่ม scope
วิธีคำนวณต้อง resolve dependency ของพื้นที่สารบัญกับเลขหน้า ไม่บังคับ render PDF
สองรอบหรือรับรอง one-pass ก่อนตรวจว่ากติกาที่เลือกทำได้จริง

## R6 — ตรวจทั้งเล่ม คู่มือ และ release

Owner: Core/Service สำหรับผลตรวจ, Project Control สำหรับการรับชุดส่งมอบ พึ่ง R1–R5

- [x] ใช้ fixture ร่วม: ปก → สารบัญ → เนื้อหามีตารางเซลล์รวม/ภาพ/Area → ส่วนปิดท้าย
- [x] ออก PDF ข้อมูลสั้นและยาวผ่าน API จาก template version ที่ล็อก
- [x] ตรวจของเดิมตามพื้นที่ผลกระทบ และ migration upgrade หากรอบนี้มี migration
- [x] ตรวจแพ็กเกจ Core จริงและ Service ที่ตรึง checksum เดียวกัน
- [x] ให้เจ้าของดู PDF และลองลิงก์ที่ใช้จริง; บันทึกข้อจำกัดที่ยอมรับ/เลื่อน
- [x] ปรับคู่มือและบันทึก compatibility เลือกเลขรุ่น แล้วรับอนุมัติ release ชุดที่ตรวจแล้ว
- [x] ทำ snapshot/tag ตามกติกาเดิม และเก็บกวาดเฉพาะงานชั่วคราวที่จบ/clean

ผ่านเมื่อเกณฑ์ของทุกพาร์ตครบ ตัวอย่างทั้งเล่มรับได้ ไม่มีปัญหาความถูกต้องค้าง
ผลตรวจผูกกับ source/artifact ที่จะส่งมอบ และ skipped ไม่ถูกนับเป็น PASS
ไม่อ้างว่าเครื่องสะอาด/production load ผ่านถ้าไม่ได้ทดสอบเรื่องนั้น

## วิธีลงมือและควบคุมขอบเขต

ทำทีละพาร์ตในห้องนี้ได้ ไม่ต้องสร้างห้อง/worktree เพียงเพราะมีหมายเลข R
ก่อนแต่ละพาร์ต resolve กติกาที่เปิด ตรวจเจ้าของ/ไฟล์จริง และเติม task ลงมือที่เล็กพอ
ให้ทดสอบการเปลี่ยนพฤติกรรมแล้วตรวจส่วนที่ได้รับผลก่อน commit
หากพบประเด็นเปลี่ยนสถาปัตยกรรมหรือสัญญา ให้หยุดส่วนที่พึ่งคำตอบแล้วเสนอทางเลือก
อย่าให้ R0 กลายเป็น redesign ทั้งระบบ หรือให้ทุกพาร์ตเพิ่ม prerequisite ใหม่เอง

หลักฐานใช้ซ้ำได้เมื่อ candidate/dependencies/environment ที่เกี่ยวข้องไม่เปลี่ยน
แต่เนื้อหาเดิมไม่เท่ากับ layout เดิมเสมอ ต้องเลือกตรวจ compatibility ที่ผลกระทบจริง
ไม่รันซ้ำ/เพิ่มรายงานเมื่อเกณฑ์ผ่านแล้วโดยไม่มี change หรือความเสี่ยงที่ยังไม่ปิด

คงสิ่งเลื่อนตามร่าง: DOCX, frontend, โครงซ้อนเพิ่ม, DB redesign,
multi-worker/โหลดหนัก, ETA และ performance overhaul
เวอร์ชันพัฒนาเพิ่มเมื่อมีโค้ดที่ใช้ได้และผ่าน ไม่เพิ่มตามจำนวน R อัตโนมัติ
เจ้าของรับเป้าหมาย release0.2.0 แล้ว ไม่ผูกหมายเลข R กับเลขรุ่น
และไม่ย้ายเข้า release ระหว่างพาร์ต

## จุดเริ่ม R1 (บันทึกเดิมก่อนลงมือ)

เริ่ม R1 ตาม Task1–4 ใน R0 contract โดยตรวจฐาน/สัญญาที่อ้างและเลือก isolation
ตามความเสี่ยงจริงก่อนแก้ product ไม่มีการเปิดรอบแยกหรือสร้างงานใหม่โดยอัตโนมัติ
R1 ส่งมอบส่วนของเล่มทั่วไปก่อน; cover/fixed-height อยู่ R2 และรายละเอียดหัวท้ายอยู่ R3
ถ้าพบข้อจำกัดที่เปลี่ยนสัญญาหรือ scope ต้องกลับมา resolve ไม่แก้โดยเงียบ ๆ


## ผลรับ R1 — 2026-10-10

Owner Core/Service; inline implementation ตาม R0 Tasks1–4, risk routine,
execution IDs ไม่ applicable. เจ้าของยืนยัน PDF8หน้าและลิงก์สารบัญใช้ได้
Core runtime commit `62e50bf`, เพิ่ม exact-boundary test `7134894`;
Service `27e7a3b`; ทั้งคู่เป็น0.1.9 ใน branch พัฒนา ไม่ขึ้น release

- Core build/339 tests ผ่าน; เพิ่ม exact-boundary regression อีก1ข้อและรันกลุ่ม
  pageSections5ข้อผ่านหลัง commit runtime โดยไม่มีการเปลี่ยน runtime เพิ่ม
- Packed Linux consumer ผ่านทุกกลุ่มเดิมและ page-sections: long8หน้า/static2หน้า
  `flowdoc-core/artifacts/worktree-archive/flowdoc-core-page-sections/1791618157602/result.json`
  แพ็กเกจ SHA256 `2a07fdd8682f433fb79f419cc83892db8147322247079504f80d6c6cbe0329fd`
- Service final affected51 tests ผ่าน0fail/0skip บน DBใหม่แยกชื่อ flowdoc_r1_final
  ใน projectทดลอง; หลักฐาน
  `flowdoc-service/artifacts/worktree-archive/flowdoc-service-page-sections/page-sections-r1/result.json`
  รวม import/save/publish/load, rename identity, Area deletion พร้อม owned DB rows,
  pinned snapshot ไม่เปลี่ยน, schema-only contract และรูป authored ผ่าน HTTP PDF
- ตรวจภาพ8หน้าด้วย Poppler และเจ้าของรับรูปแบบ/ลิงก์แล้ว; หลังแก้ diagnostic
  PDFมี SHA256 เดิม `4ba086aa9bd2453cb8bcf0f85faba6519b6e9f1864a78c40ad6c40fc73247ffc`
- Fresh reviewer พบ margin diagnostic ชี้ส่วนสารบัญผิด แก้และพิสูจน์ RED→GREEN
  ใน tests/pdf/createPdfEngine.test.ts; ไม่มี runtime defect อื่นที่ reviewer ระบุ

ข้อจำกัดที่เปิดเผย: การรัน Service ทั้งชุดครั้งแรกได้125/127 โดยอีก2ข้อคือ
สิทธิ์โฟลเดอร์หลักฐานทดลอง (แก้แล้ว) และ upload-acceptance migration004
ซึ่งทดลองบน release0.1.8 แล้วล้มตำแหน่งเดียวกัน จึงเป็น baseline failure
ไม่อ้างว่า full suiteผ่าน และไม่แก้ migration/fixture เก่านอก R1
ก่อน releaseรวมควรแยกเก็บ test migrationเก่านี้: มันใช้ register ปัจจุบันกับ DB001–003
แล้วคาดชุด migrationจบ008 ทั้งที่ระบบมี009 แล้ว
การรันทวน current บน DBทดลองเดิมเจอ CURRENT_EXISTS จากข้อมูลรอบก่อน;
ผลรับใช้ DBใหม่ที่51ข้อผ่าน ไม่ใช้การลบข้อมูลผู้ใช้

Rulings: section ว่างตัดสินจาก root หลัง expansion; table root แม้ไม่มีแถวยังคง
พฤติกรรมเดิมเหมือน blank TextBlock ไม่เพิ่มกฎตัด node จากหมึกที่มองเห็น
validation/prepared tests รวมอยู่ใน tests/template/pageSections.test.ts;
ไม่สร้าง helper sectionFlow เพราะใช้ page context ร่วมใน documentFlow ได้ตรงกว่า
และยังรวบรวมสารบัญ/anchors ทั้งเล่มครั้งเดียว

ขั้นต่อไป R2: ปกหน้าเดียวและกล่องจองความสูงตามสัญญาที่รับแล้ว
หัวท้าย/เลขแสดงอยู่ R3/R4; ไม่มี DOCX/frontend/DB redesign ในงานนี้


Integration/cleanup: fast-forward เข้า Core codex/template-binding (`7134894`)
และ Service codex/template-registry (`27e7a3b`) แล้ว เนื้อหาที่ตรวจไม่เปลี่ยน
เก็บ PDF/tarball/result/log ไว้ใน artifacts/worktree-archive ตาม path ด้านบน
ลบ worktree/branch codex/page-sections ที่ clean/merged ของทั้งสอง repo แล้ว
และลบ container/network/volume เฉพาะ projectทดลอง flowdoc-page-sections-r1
release refs คง Core `7b5161c` / Service `78c9491`; ไม่มี push หรือ deploy


## ผลรับ R2 — 2026-10-10

ปกหน้าเดียว กล่อง TextBlock จองความสูง และหน้าเปล่าผ่านแล้วในรุ่นพัฒนา0.1.10
Core `3e85fd2` / Service `7ea6150`; package runtime source `8cb76ff`.
Core full364ข้อผ่าน ตามด้วย boundary tests เพิ่ม2ข้อในกลุ่ม10ข้อที่ผ่าน;
packed Linux consumer ผ่าน และ Service affected59ข้อผ่านบนฐานข้อมูลใหม่.
เจ้าของรับรูปแบบหน้าปกสั้น/ยาวแล้ว; PDF สุดท้ายตรงกับชุดที่รับทุกไบต์.
[ผลรับ หลักฐาน และข้อจำกัด](flowdoc-page-system-r2-plan-2026-10-10.md#accepted-delivery--2026-10-10).
R1 migration004 baseline test debt ยังต้องเก็บก่อน releaseรวม ไม่รวมในผล PASS นี้.
ขั้นถัดไป R3: คุยรายละเอียดหัวท้ายตามที่เจ้าของขอไว้ ไม่เริ่มโดยเดาข้อกำหนด.


## ผลรับ R3 — 2026-10-10

หัวท้ายแยกตัวแปร API พร้อมข้อความ ภาพ และ Columns หนึ่งชั้น ผ่านในรุ่นพัฒนา0.1.11
Core `d7533c1` / Service `55f7aad`; เจ้าของรับ PDF แล้ว.
Core386ข้อและ packed Linux consumer ผ่าน; Serviceครอบคลุม68ข้อ โดยแก้
รายการ migration ที่คาดหวังใน testเก่าแล้วตรวจไฟล์นั้นซ้ำ3ข้อผ่าน.
[ผลรับและหลักฐาน](flowdoc-page-system-r3-plan-2026-10-10.md#accepted-delivery--2026-10-10).
รวมเข้าฝั่งพัฒนา เก็บ artifacts และล้าง worktree/branch/Docker ทดลองแล้ว.
releaseยัง0.1.8; migration004 baseline test debt ยังค้างก่อน releaseรวม.
ขั้นถัดไป R4: นโยบายเลขหน้าอย่างเป็นทางการตามขอบเขต roadmap.


## ข้อตกลงเพิ่มหลัง R3 — Section ownership ก่อน R4

เจ้าของรับให้ Document มี Sections ที่เป็นเจ้าของข้อมูลเนื้อหาและหัวท้ายแยกกัน
พร้อม data ร่วมระดับเล่ม และให้ DB มี sections/section_versions จริง.
[ข้อตกลงและผลกระทบก่อนลงมือ](flowdoc-section-ownership-decision-2026-10-10.md)
เป็นทิศทางใหม่สำหรับรุ่นโครงสร้างถัดไป; บันทึก R0–R3 ข้างต้นยังอธิบาย
สัญญาที่ส่งมอบแล้วของรุ่นเดิม ไม่ใช้ข้อจำกัด data/content เดิมปฏิเสธทิศทางใหม่นี้.
ไม่เปลี่ยนผลรับ R3 และยังไม่เดิน R4 ก่อนปิด contract/DB รอบนี้.

Checkpoint0.1.12: Core399 tests + packed Linux consumer และ Service56 affected
tests ผ่านแล้ว เจ้าของรับ PDF10หน้าและรวมฝั่งพัฒนา0.1.12 แล้ว.
[ผลตรวจและขอบเขตหลักฐาน](flowdoc-section-ownership-plan-2026-10-10.md#delivery-checkpoint--2026-10-10).
releaseยัง0.1.8 ไม่ได้เปลี่ยนในรอบนี้.

Core `b0657ee` / Service `6729964`; เก็บหลักฐานและล้าง lane/Docker ทดลองแล้ว.
[ผลรับและตำแหน่งหลักฐานหลัง cleanup](flowdoc-section-ownership-plan-2026-10-10.md#accepted-delivery--2026-10-10).
ขั้นถัดไป R4 นโยบายเลขหน้าอย่างเป็นทางการ; migration004 test debt ยังอยู่ก่อน releaseรวม.

## R4 technical checkpoint — 2026-10-10

เลขหน้า current/total ที่ผู้สร้างวางในหัวท้าย และนโยบายต่อเนื่อง/เริ่มใหม่/ไม่นับ
ตรวจทางเทคนิคผ่านใน candidate0.1.13 ของทั้งสอง repo แล้ว รอเจ้าของรับ PDF12หน้า.
Core53baa9f / Servicee6fb28f; ยังไม่รวม development และไม่เปลี่ยน release0.1.8.
[ผลตรวจและข้อจำกัด](flowdoc-page-system-r4-plan-2026-10-10.md#technical-checkpoint--2026-10-10).
R5/R6 และ migration004 test debt ยังอยู่ตามแผนเดิม.

## ผลรับ R4 — 2026-10-10

เจ้าของรับ PDF แล้วหลังยืนยันความหมายของเลขเริ่ม99เทียบกับ total10 ใน fixture.
รวม0.1.13 เข้า Core53baa9f / Servicee6fb28f แล้ว buildผ่าน และใช้ผลตรวจเดิม
ที่เนื้อหาไม่เปลี่ยน. เก็บหลักฐานพร้อมตรวจ hash และล้าง lane/branch/Docker ทดลองแล้ว.
[ผลรับและตำแหน่งหลักฐาน](flowdoc-page-system-r4-plan-2026-10-10.md#accepted-delivery--2026-10-10).
ขั้นถัดไป R5 สารบัญสัมพันธ์กับระบบหน้า; releaseคง0.1.8จนผ่าน R5/R6.

## R5 bounded inline scope — 2026-10-10

Owner approved proceeding and chose: selected headings on excluded pages remain
clickable by title with no page number; cover remains absent. Hidden counted
pages retain TOC numbers. This supersedes only R4's temporary excluded-target
error, not its historical acceptance. Keep the36pt slot/geometry, no new layout
pass, API fields, DB migration, levels beyond1–3 or release changes.

Owners Core implementation / Service package and API consumer; role Product
Implementation Agent inline, routine risk, medium scope; execution IDs not
applicable. Bases Core53baa9f/Servicee6fb28f. Development target0.1.14.
Use isolated sibling contents-pages lanes (native worktree tool targets only
Project Control). Existing package/runtime remains authoritative.

Sequence: RED excluded-title behavior and missing metadata distinction; implement
narrow fill rule; test long/multipage contents, Thai title wrapping, repeated
headers/Area and repeated displayed numbers against physical anchors; packLinux;
pin Service artifact and check real API; owner PDF acceptance before integration.
Acceptance: no false page numbers or missing title links, stable geometry,
invalid/missing/duplicate anchors still rejected, legacy behavior retained.
Evidence: targeted layout/template tests, installed package PDFs/annotations,
Service API test and owner visual check. Reuse R4 proof where unchanged.
Proof budget: affected tests/build, one final review, packed consumer, one API
round plus repairs for actual failures; no load benchmark. Documentation budget:
this roadmap plus local usage entries, no separate plan or synthetic records.
Main unknown resolved by owner choice above; fixed-slot overflow continues to
fail explicitly. Stop for contract expansion; stop when acceptance passes.

## ผลรับ R5 — 2026-10-10

เจ้าของรับ PDF17หน้าและลิงก์ H900/H901/H998 แล้ว. หัวข้อบนหน้าไม่นับเลข
แสดงชื่อที่กดได้โดยช่องเลขว่าง; หน้าซ่อนเลขยังแสดงเลขในสารบัญ. ปกไม่เข้าสารบัญ.
Core `d72408c` / Service `308ee81` รวมแบบ fast-forward เข้าฝั่งพัฒนา0.1.14แล้ว.

หลักฐานและขอบเขต:
- Core build+416 tests/50files PASS. RED4ข้อก่อนแก้ fill rule แล้ว GREEN.
  ครอบคลุมหลายหน้า/ชื่อยาว/เลขซ้ำ/metadataหาย และคงเส้นทาง legacy.
- One read-only final review: no actionable findings. No architecture/DB/API redesign.
- Packed Linux consumer PASS. Actual PDF check: ชุดสั้น8หน้า สารบัญ1หน้า
  (8 number links/15 title links); ชุดยาว17หน้า สารบัญ3หน้า
  (75 number links/82 title links). ตรวจ destinations ตรงบรรทัดแรกจริง,
  หัวตารางซ้ำไม่เลือกครั้งถัดไป, Area, hidden และ excluded title-only.
  Render/inspectครบ17หน้า และเจ้าของรับการคลิกจริง.
- Legacy model8 contents-long.pdf เท่าชุด0.1.13ทุกไบต์ SHA256
  `0d5aeb7f9d8d2668fc8e035180892e98d262d63564c55ca85a6ab2293e04b265`.
- Service build+14 affected DB/API tests PASS บน Dockerฐานข้อมูลแยก.
  Published snapshot ยังเป็น excludeหลังแก้ current; PDFมี3title links+2number links.
- Exact Core artifact SHA256
  `2e8aaf13c03c5df8a5520c73e2d0e768fa0cf431312fbd3491df31f0cc8fae8e`;
  sourceCommit d72408c ใน Service vendor/manifest.json.

หลักฐานหลัง cleanup:
`../flowdoc-core/artifacts/worktree-archive/flowdoc-core-contents-pages/1791635593361/`
มี PDFสั้น/ยาว, template/requestตัวอย่าง, tarball/resultและภาพตรวจ.
ไฟล์ tests/consumer/checkContentsSectionsPdf.py ตรวจ PDFแบบ read-only.
logs Coreอยู่ใต้ `.../flowdoc-core-contents-pages/r5/`; Serviceอยู่ใต้
`../flowdoc-service/artifacts/worktree-archive/flowdoc-service-contents-pages/r5/`.
Copyและเทียบhashครบ Core130/Service4ไฟล์ก่อนล้าง; primary build/install logs
เพิ่มไว้ข้างโฟลเดอร์r5. Primaryทั้งคู่buildผ่านหลังรวม.

ใช้ผลตรวจเดิมหลัง fast-forwardที่เนื้อหา/base/configไม่เปลี่ยน. ล้างเฉพาะ
worktree/branch codex/contents-pagesที่ clean/merged ของทั้งสองrepo และ
Docker project flowdoc-contents-r5พร้อมvolume/network/imageทดลองที่ระบุ.
Releaseคง Core7b5161c / Service78c9491 (0.1.8); ไม่มี push/deploy/map promotion.
R6ยังไม่เริ่ม: ตรวจทั้งเล่ม/คู่มือ/release และเก็บ migration004 baseline test debt.
ไม่อ้าง full Service-suite PASS จากชุดตรวจเฉพาะพื้นที่นี้.

## R6 inline release scope — 2026-10-10

Owner authorized finishing R6 and local release of both repositories, target0.2.0.
Role: Product Implementation Agent then Evidence Reviewer / Project Control Steward.
Medium size, routine risk, execution IDs N/A. Authority: this roadmap and current
owner request. Bases Core d72408c / Service308ee81; isolated sibling page-release
lanes (native worktree tool applies to Project Control only). No runtime feature
expansion, new migration, remote push, deployment or map promotion.

- [x] Repair migration-test fixtures against their historical schema; keep all
  released SQL immutable. Run Service full Docker suite for combined release
  (includes upgrades, pinned snapshots, jobs, uploads and rendering).
- [x] Update existing Core template guide/README and Service usage/README for
  model16 and release0.2.0; preserve legacy model4–15. Align package manifests,
  repack Core Linux consumer, pin exact checksum/source in Service.
- [x] Reuse R5 complete-book short/long fixtures through real HTTP on isolated
  Docker DB after import/publish. Check images, contents links and numbering;
  compare accepted R5 PDF geometry where applicable. Preserve PDF/log artifacts.
- [x] Review changes, verify impact coverage, integrate unchanged development
  candidates, create release snapshot commits and immutable v0.2.0 tags using
  existing release convention. Keep development branches. Clean only this lane.

Proof budget: Core build/tests/package once for final artifact; Service full
container suite once plus bounded repairs; API short/long outputs and PDF
inspection, one final review. No production-load or clean-machine claim.
Document budget: this roadmap, existing product guides/README only. Shared status
stays here. Open prerequisite: migration004 old fixture uses current registrar
against001–003; inspect/fix fixture, not production SQL. PDF approval from R5 may
be reused only if final output matches its accepted rendering/link semantics.

Deferred owner-approved next round: optional automatic hierarchical heading
numbers (1,1.1,1.1.1), shared by body headings and TOC; no caller-supplied numbers.
Detailed depth/reset rules remain to be designed after this release.


## ผลรับ R6 และ release0.2.0 — 2026-10-10

เจ้าของอนุญาตเก็บงานก่อนขึ้น release แล้วค่อยเริ่มเลขหัวข้อตามระดับ.
Core development `7aff2f178ff701acbe7f407c8bca22951db8f6d6`, Service development
`f89225cd0b5871108b4763f5692e6625c93973e6`. รวมแบบ fast-forward โดย tree ไม่เปลี่ยน.
Release snapshot parent เป็น release0.1.8 เดิม และ tree เท่ากับ candidateที่ตรวจ:

- Core release `c17f1973d0206e9d45c3db3c0abb03ac442fceb0`
- Service release `edd9a7ef115dfcd80fe8994c258bb1ee796c7d3c`
- Annotated tag `v0.2.0` ทั้งสอง repo ชี้ snapshot ของตน ตรวจตรงกับ releaseแล้ว.
- Core tarball SHA256 `d6a3d6bb612263b92d2d09d847372c71da5cd8dcc664a9cd681fdcf5d20aaa07`
  ตรง vendor/manifest และ lock ของ Service; sourceCommitเป็น Core7aff2f1.

ขอบเขตที่เปลี่ยน R6: package versions/pin, คู่มือและตัวอย่างทั้งเล่ม,
สคริปต์ HTTP acceptance, แก้ historical DB test fixtures/expectations.
ไม่มีการแก้ production runtime หรือ migrations ใน R6. ของเดิม model4–15ยังใช้
สัญญาของตน; model15/16ใช้ dataร่วมและ sections. ไม่แปลงแม่แบบเก่าอัตโนมัติ.

ผลตรวจ/coverage:
- Core build+416 tests/50files PASS; packed Linux consumerทุกกลุ่ม PASS.
  PDF8/17หน้าตรง accepted R5ทุกไบต์; checkerของลิงก์/เลขหน้าผ่าน.
- Service buildและvendor integrity PASS. Full Docker runแรก160/162; สองข้อ
  ไม่ผ่านเพราะ expected migrationไม่มี012และ expected tablesไม่มี Section.
  หลังแก้ expectationตาม schemaจริง รันทั้งสองไฟล์ใหม่บน DBใหม่11/11 PASS.
  ครอบคลุม162 unique casesด้วยผลรวมดังกล่าว ไม่อ้างว่ามี full rerun162/162ครั้งใหม่.
- migration004 baseline debt ปิดแล้ว: seed normalized rowsด้วย columns001–003
  แทนการเรียก registrarปัจจุบันบน schemaเก่า. พิสูจน์004ไม่เปลี่ยนแถวเก่า,
  อัปเกรดถึง012รักษา historical columns/IDs และโหลด published snapshotได้.
  REDของ fixtureเก่าและ GREEN7ข้อรวม section migrationเก็บในlogs.
- Whole-book APIใช้ DBแยก `flowdoc_r6_api`: import → publish version1 → upload
  PNG → finalize → POST/jobs → status → download → repeat download410 PASS.
  Short8/long17หน้า, สารบัญ1/3หน้า, number links8/75และ title links15/82ผ่าน.
- Renderเทียบทั้ง25หน้า pixel-identicalกับ R5ที่เจ้าของรับแล้ว; PDF drawing
  commandsต่างเพียงชื่อ image-resource (/Im1 กับ /Im2). ตรวจ contact sheetด้วย.
  จึงใช้ผลรับภาพ/การคลิกเดิมได้ ไม่ขอให้เจ้าของตรวจเอกสารเดิมซ้ำ.
- Fixtureภาพสี2×1pxจงใจให้2 low-resolution warnings และไม่ส่ง optional logos
  จึงมี7 unavailable warnings. HTTP scriptตรวจชุดนี้ตรง ๆ ไม่กลบ warningอื่น.
  ภาพนี้พิสูจน์ตำแหน่ง; testsภาพจริง/APIอื่นใน Serviceผ่านตามขอบเขตเดิม.
- One fresh read-only review + bounded delta review: แก้คำอธิบาย model15ใน
  คู่มือหนึ่งจุดแล้ว ไม่มี actionable findingค้าง. Source/guide diffตรวจแล้ว.

หลักฐานหลังเก็บกวาด:
- `../flowdoc-core/artifacts/worktree-archive/flowdoc-core-page-release/1791636533011/`
  tarball, consumer PDFs และ result.json; logsและaccepted comparisonอยู่ข้างกันในr6.
- `../flowdoc-service/artifacts/worktree-archive/flowdoc-service-page-release/r6/`
  baseline/fix/full/repaired test logs, builds, API logs. `api/` มี PDFทั้งสอง,
  job/result/contract JSON, comparison.json, PNGเทียบและcontact.png.
- Copyแล้วเทียบhash Core109/Service78ไฟล์ก่อนล้าง. Release commit messages
  บันทึก source/artifact/evidenceเพิ่มไว้ในarchive parent.
- ล้าง clean/merged worktreeและbranch codex/page-releaseของทั้งสอง repoแล้ว.
  ล้าง Docker project flowdoc-page-r6 รวม containers/network/volumes และ
  สามimage tagsเฉพาะรอบ; ไม่แตะ development/release branchesหรือtagsเดิม.

ใช้ผลตรวจซ้ำหลัง unchanged fast-forward/snapshotตาม policy; ไม่รันกว้างเพิ่ม
เมื่อ coverageครบ. ไม่มี push, registry publication, deploy หรือ map promotion.
ไม่รับรอง clean-machineหรือproduction concurrency; งานนี้ local Linux Docker.
DOCX/frontend, TOCระดับ4ขึ้นไป, Roman numerals และงานหลังreleaseอื่นยังเลื่อน.
ขั้นถัดไปคือออกแบบ hierarchical heading numberingตามข้อตกลงด้านบน ไม่เริ่มโค้ดในR6.

## Post-release SRS extraction checkpoint — 2026-10-10

Owner reprioritized real-document acceptance before hierarchical heading numbers,
then supplied `C:/Users/nekot/Downloads/69C_REQ_SRS.pdf` as the sole source.
This is a new bounded extraction scope, not a reopening of R6 or release changes.
Owner Service for ignored local artifacts; role Evidence Reviewer / Planning Partner,
execution IDs N/A. No runtime, template contract or DB edits. Source SHA256
`59239549d484d79b1ded120a16528b4e90eceae0f1fb67c0f4e1e2231c6553a4`.
The supplied file is document revision2.0, distinct from earlier `(1).pdf` revision3.0.

Local outputs: `../flowdoc-service/artifacts/srs-source-020/` contains
srs-template-outline.json (explicitly non-executable), srs-values.json,
srs-data.json with page/row provenance, source-extraction.json, assets.json,
nine extracted images, extraction scripts and extraction-check.json.
93 A4 portrait pages;32 numbered headings,240 unique consecutive requirements
REQ0001–REQ0240,68 multi-page requirements rejoined,6 explicit empty tables.
All309 body category-icon placements mapped to requirement segments;8 legend
icons and repeated banner preserved as assets. Source headings/requirement IDs
match extraction; no unresolved table continuation detected. This proves
structural extraction, not word-perfect semantic recovery or export readiness.

Before executable mapping: source TOC has4 levels versus Core1–3; physical PDF
line breaks do not establish author paragraph boundaries; source total counts
cover while current Core excludes it; full-bleed banner and horizontal category
icons need explicit layout mapping. No silent omission or Core expansion approved.
Next: resolve these bounded mappings and build an executable SRS template/request,
then real-document acceptance. Hierarchical numbering stays deferred.

### First executable SRS trial — 2026-10-10

Owner authorized trying the existing engine first, then improving fidelity from
the resulting PDF. Inline, bounded/routine; Service owns ignored trial artifacts,
active role Product Implementation Agent / Evidence Reviewer, execution IDs N/A.
Scope: map the extracted source into a model16 template/request and render with
the released Core0.2.0 package; no engine, DB, release, or production API changes.
Proof budget: schema/input/composition validation, one successful full-book render,
requirement/heading presence and representative page inspection. Document budget:
this existing checkpoint only. This is not the five-dataset real-document acceptance.

Trial mappings are explicitly provisional: level4 headings remain present but
use TOC level3; counted total follows existing cover-exclusion policy; banner fits
content width; category icons are composed into prepared image strips; physical
source line breaks remain. Signature spacing, table colors and footer placement
are still fidelity work. These choices do not change the target/source definition.
Fixed-height text is restricted to authored cover roots by the existing contract;
the trial uses that path for cover spacing and normal flow for approval content.

Result: full-book export FAIL, not accepted. Public package rendering failed at
PDF writing. A diagnostic rerun used the same installed writer/layout/subsetter
through an internal logging wrapper, with no package edits: `Font CID capacity
exceeded`; layout87 pages, regular117576 glyph occurrences, bold3573. Existing
writer allocates a CID per occurrence and rejects above65535 per font. This is
a demonstrated export blocker, not merely visual template fidelity. Diagnostic
internal imports are trial-only and must not become a Service integration API.

Partial sample `../flowdoc-service/artifacts/srs-source-020/srs-sample.pdf` uses
the public Core0.2.0 API unmodified:10 pages, first12 requirements and2 headings,
zero warnings,11.428s generation in the local container. Source lines checked120,
all present after whitespace normalization; REQ0001–0012 present. Rendered and
visually inspected contact sheet pages1–8 and10 plus detailed page6. This is
partial evidence only, not full-document or HTTP acceptance; page9 not visually
reviewed. Table header color, cover/approval spacing, footer placement and source
line-break treatment remain provisional. No claim of source93-page equivalence.

Artifacts in that directory: trial.mjs, trial-template/request.json (full input),
srs-sample-template/request/result/check.json, full-render-failure.json, sample
PDF and rendered pages/contact sheet; check-trial.py reproduces presence/render
checks. Product tracked files unchanged; no version bump or release changes.
Next recommended scope: fix and verify CID allocation for long documents, then
rerun this full SRS before pursuing layout fidelity or five-dataset acceptance.

### Raw SRS input normalization — 2026-10-10

Owner supplied the original JSON attachment and requested restructuring. Inline
Service-owned ignored artifact work, routine; execution IDs N/A. No runtime or
release edits. Use `unit2` for the current ordered body, not the empty `srs` field
or historical `version.versionlist[].dv_data`. Preserve historical snapshots in
the original attachment; do not concatenate them into current requirements.

`artifacts/srs-source-020/normalize-raw.py` creates srs-values-from-raw.json and
srs-request-from-raw.json; raw-normalization-check.json records source SHA and
mapping limits.32 headings,240 unique source IDs/REQ codes, all240 requirement
details match the PDF extraction ignoring whitespace; category sequences match.
Raw detail strings are preserved exactly, including their1088 newline characters,
instead of1798 from physical PDF extraction. Input array order is retained.
Core0.2.0 public validation/preparation/composition PASS, zero warnings; no render.

Body text now comes from raw data. Front matter remains explicitly PDF-derived:
outer version.name is not assumed to be the document author, and snapshot dates
do not silently replace printed dates. Element master has10 entries versus9 in
the PDF legend (Minutes of Meeting is extra); preserve inventory without adding
content. Screenshot references are not downloaded or inserted. Unrelated project
fields are not copied into generation input. The CID writer blocker remains open;
raw input resolves the extraction-related line-break ambiguity for mapped text,
not the export capacity issue or full acceptance.

### SRS CID repair — 2026-10-10

Owner narrowed acceptance to the supplied SRS first; 300–700-page acceptance and
layout fidelity remain deferred. New inline implementation scope, Core owner,
Product Implementation Agent; bounded/routine, IDs N/A. Base7aff2f1 in isolated
flowdoc-core-srs-cid/codex/srs-cid (primary Core checkout is on release; preserve
that checkout). Native worktree tool targets PC, so use the established manual
Core sibling-worktree route. Allowed: writer CID reuse, focused regressions,
development patch version and isolated packed-consumer/SRS proof. No release,
DB, template-contract, layout or font-sharding changes.

Acceptance/proof budget: repeated-glyph regression RED then GREEN, identity and
positioning tests, affected PDF/package consumers, full raw SRS rendering plus
text and representative visual checks. One fresh read-only code review required
by review skill; no synthetic separate-room registry. Document budget: this
existing record. Artifacts stay ignored; raw business data stays outside Git.
Per-font mapping key is glyph ID + rounded PDF advance + Unicode assignment;
horizontal offsets stay occurrence-specific. Retain controlled failure above
65535 distinct mappings. No claim of unlimited document support.

Result: bounded CID repair PASS. Core development commit43f8f26 reuses identical
per-font mappings, version0.2.1. Three new regressions failed before the fix;
affected PDF tests31/31, full packaged build419/419 and packed consumer groups
passed. Existing four-style/overflow PDFs remain pixel-identical on3/3 pages.
The synthetic700-page repeated-glyph test is a writer regression, not acceptance
of real700-page documents. Read-only review found no actionable runtime issue.

The supplied raw SRS now renders through the public Core API:90 pages,240 unique
requirements,32 headings, zero warnings,100.104 seconds. All requirement details,
headings and source paragraphs pass whitespace-insensitive extraction checks;
requirements occur exactly once. Actual font maps use225 regular and122 bold
CIDs. Representative visual review covers pages1–7,45,89,90, not all90 pages.
Output is not claimed equivalent to the source93-page layout.

One additional input issue was isolated: the single tab in REQ0188 produces an
unsupported glyph-metrics error. The trial maps that tab to one space and records
the normalization; original raw input remains unchanged. General tab handling is
still unresolved. No other source text was rewritten for this repair.

Service dependency propagation is included as the affected consumer, without
runtime/API/DB behavior changes: development commit10271f7, version0.2.1, vendored
Core SHA256 ffc7585d0749fadaa79b672e2e84b17b69fa79c764927144a32a12a75ffdee68.
Vendor identity, Docker verification build and isolated render tests2/2 passed.
Dependency review found matching versions and hashes; its pending archive-locator
concern was resolved by checking the completed archive and matching SHA256.
Full SRS HTTP/job execution was not tested; the standalone100-second measurement
does not establish production performance or concurrent-job capacity.

Durable local evidence (ignored; business data is not committed):

- ../flowdoc-service/artifacts/srs-cid-021/srs-trial.pdf;
  srs-trial-result.json, verification.json, verify.py, trial.mjs,
  input-normalizations.json and representative rendered pages in the same folder.
- ../flowdoc-core/artifacts/worktree-archive/flowdoc-core-srs-cid/1791642171251/:
  package, result.json, package-check.log and pixel-comparison.json;112 archived
  files verified against their original SHA256 hashes before lane removal.
- ../flowdoc-service/artifacts/worktree-archive/flowdoc-service-srs-cid/srs-cid/:
  build and render-check logs; both archived files hash-verified.

Development refs were fast-forwarded with exact old-ref guards to the tested
commits. Primary checkouts and release refs remain on0.2.0 (Core c17f197,
Service edd9a7e); no tag, push or release promotion. Clean merged temporary lanes
and their two branches were removed after evidence archival; three task-only
Docker image tags removed. Unchanged tested content permits proof reuse.
Deferred: source-layout fidelity, general tab handling, full-book HTTP acceptance,
five-dataset acceptance,300–700-page capacity and font sharding.

### Replacement SRS input and paused next steps — 2026-10-10

Owner supplied a replacement JSON for all subsequent SRS trials:
`C:/Users/nekot/.codex/attachments/1489b53b-c835-4069-b346-d52c27a73eec/ข้อความที่วาง.txt`.
Source size3989716 bytes; SHA256
`8c8c6cdf91e6dfa4e6032a1b09a6f336e96430e267f81e386d068cc79e2f82ea`.
JSON syntax parses successfully. This supersedes the earlier attachment as the
next input, without replacing prior artifacts or transferring their acceptance
to this dataset. No normalization, export or runtime changes have been run for
the replacement; source business data remains outside Git.

Inline Project Control Steward maintenance only, routine, execution IDs N/A;
scope is this existing checkpoint and source identity verification. Owner has
explicitly paused implementation. Before major layout work, the agreed pending
items are general tab handling and full SRS API/queue/download acceptance.
During that future test, record queue wait, preparation, PDF generation and total
time to download readiness, with input size, page count and machine context.
Collect measurements before choosing a performance threshold; concurrent-load
testing and performance tuning are not implicitly included. Recheck source
normalization needs against this new input when execution resumes.

### SRS legacy generator sizing reference — 2026-10-10

Owner requested a read-only comparison before future layout adjustment. Reference:
`C:/Users/nekot/.codex/attachments/dd9bf4e6-e50b-4889-9fa3-a61a84106c27/ข้อความที่วาง.txt`,
SHA256 `1f34716e782ee7593eed5674ba792ce028d9416a7472fe19251224ab71afdb64`.
Compared source constants/helpers against the existing ignored
`../flowdoc-service/artifacts/srs-cid-021/trial.mjs`; no generator execution,
network requests, product edits, template changes or new PDF this round.

Source reference values (geometry in mm; font sizes in pt):

| Item | Legacy generator | Existing FlowDoc trial |
| --- | --- | --- |
| Paper | A4 portrait210x297 | A4 portrait |
| Body side margins | 10 each; usable190 | 28.35pt each, approximately10mm |
| Requirement columns | 16/64/20%;30.4/121.6/38mm | 65/393.5/80pt;approximately22.9/138.8/28.2mm |
| Body text | 16pt | 12pt |
| Heading | 18pt in requirements | 16pt |
| Main cover title | 29pt | 24pt |
| Requirement line step | 7mm, approximately19.84pt | 22pt, approximately7.76mm |
| Requirement wrap width | Column width minus3mm | Column width minus10pt, approximately3.53mm |
| Banner | x0,y0,width211,height27mm | 538.5x62.4pt, approximately190x22mm, within margins |
| Footer | 13pt; page baseline275mm, rule277mm, copyright/version281mm | 9pt, three columns in flowing footer band |

The legacy file registers only THSarabunNew through Get_font_pdf_th2 and selects
the bold alias; actual font bytes are external and were not supplied here.
Trial uses bundled Sarabun normal/bold. Font equivalence is unverified and must
be resolved before attributing wrap differences solely to size. Body continuation
resets y to38mm and uses endpage260mm with additional per-row break guards;
these are baseline/flow rules, not directly interchangeable with page margins.
Legacy rows also reserve a minimum two line slots, icon space and2mm trailing
space; trial currently uses4pt top/bottom cell padding and a prepared icon strip.
Do not translate these into one universal padding value or promise identical
pagination. Future layout work should use the source's sizing intent with the
reference PDF for visual acceptance, retaining FlowDoc's text shaping/wrapping.
The earlier tab/API/timing work remains pending and precedes major layout work.

### Tab display handling — 2026-10-11

Owner resumed item1 only and explicitly chose one display space per TAB, with
original source unchanged; Word-style tab stops are outside scope. Inline Core
implementation, bounded/routine, IDs N/A; role Product Implementation Agent.
Base43f8f26, isolated flowdoc-core-tabs/codex/srs-tabs; preserve primary release.
Change shared text measurement before segmentation/shaping, retaining one-to-one
UTF-16 offsets for tabs and existing CRLF handling. No API, DB, font or layout
styling changes. Full SRS API acceptance and timing remain subsequent work.
Proof budget: failing tab regression, space-equivalent layout/link geometry and
input immutability tests, affected shared-layout coverage via packaged build and
real Linux PDF consumer, one bounded read-only review. Existing checkpoint only;
no additional process records. New JSON still has one TAB in unit2; historical
version data has another, and is not merged into current document input.

Item1 PASS: Core36065e1, development0.2.2. Two regressions demonstrated the
previous tab behavior; focused layout/link tests9/9 and packaged build421/421
passed. The complete isolated Linux packed-consumer check passed, including a
new public-API tab PDF in four font styles with input immutability asserted.
Extraction confirms eight fixture text leaves retain consecutive display spaces
and contain no tabs. The first extraction assertion assumed four leaves; the
fixture has eight, so the checker was corrected to derive the count from the
fixture (PDF/product unchanged). Bounded read-only review found no actionable
issue. Shared measurement covers body, cells, page bands and contents paths.

Evidence/package archived with per-file SHA256 comparison at
`../flowdoc-core/artifacts/worktree-archive/flowdoc-core-tabs/1791700712494/`:
result.json, package-check.log, tabs.pdf and tab-extraction.json. Package SHA256
`c6f3fad0d02cc83bbff0cfc766e7b09786c520cf81a31527a49f20ceb0a2e963`.
Development ref fast-forwarded with exact base guard; unchanged verified content
reuses passing checks. Clean merged worktree/temporary branch and task image
removed. Core release unchanged. Service remains development0.2.1 pending the
explicit next API integration step; no claim that Service already applies this
fix. Items2–3 (new JSON full SRS API/queue/download and timing) remain not started.

### Full SRS API and timing trial — 2026-10-11

Owner resumed items2–3. Inline Service dependency integration and isolated trial,
bounded/routine, IDs N/A, Product Implementation Agent. Base10271f7, isolated
flowdoc-service-srs-api/codex/srs-api. Allowed tracked changes: Core0.2.2 vendor
and Service patch metadata; trial scripts/data/results remain ignored. No layout,
font, DB migration, release or performance redesign. Proof: isolated PostgreSQL,
real HTTP upload/admission/queue/render/download, text completeness, consumed
output/temp cleanup and stage timing with measurement limits stated. Reuse Core
packaged proof; build Service and run affected render tests. New JSON parses
identically to prior JSON by each top-level value; preserve the new source as
input authority and original tabs. Stop on an architectural or capacity finding
that requires scope expansion. One existing checkpoint, no extra Work records.

Result: dependency integration PASS, full SRS API acceptance FAIL. Service74fc8c7
development0.2.2 consumes tested Core0.2.2; Docker build, vendor verification,
isolated renderer tests2/2 and bounded dependency review passed. No runtime
source changes. User-supplied replacement JSON is deep-equal to the previous
source; trial reuses its validated body mapping and retains the TAB in submitted
data.17 PNG resources uploaded through HTTP, finalized, and submitted with the
full240-requirement request.254 image-node occurrences prepared, no content
indices skipped.13 low-resolution warnings surfaced; they did not stop the job.

Default120000ms render limit was unchanged. Job failed with RENDER_FAILED after
the rendering-stage observation interval120078ms; total client time124633ms.
Database queue101.669ms, running123262.448ms; observed resource preparation3066ms.
Stage observations poll every250ms and are not precise internal stage timings.
Docker reports20 CPUs and8169644032 bytes memory, linux/x86_64, Node24.21.0.
Single local job only; no concurrency or production performance claim. No PDF
was produced: download, full text completeness and completed page count remain
unverified. Earlier90-page standalone Core acceptance does not satisfy this gate.

Post-failure health200, output directory empty, actual render temp directory
`/app/temp/flowdoc-job-renders` empty. Upload resources remain under expiry policy;
one-hour expiry was not waited out. Isolated trial containers/networks/volumes
and task image removed; generated DB-password env file removed before archival.
Artifacts hash-verified into `../flowdoc-service/artifacts/srs-api-022/`, including
submitted-request.json, api-failure.json, timing-result.json, failure-cleanup.json,
build/render-test logs, scripts and cleanup.log. Raw data stays ignored.
Development ref fast-forwarded to dependency-only tested commit; clean temporary
lane/branch removed, release unchanged. Item3 has a failed-run timing baseline,
not an end-to-end successful timing. Recommended next decision: one isolated
longer-deadline diagnostic to measure completion before changing the default
deadline or optimizing. Do not call item2 complete or proceed to layout acceptance.

### SRS extended-deadline diagnostic — 2026-10-11

Owner authorized one repeat with300000ms render deadline in an isolated test
environment. Discovery-only inline Service trial at74fc8c7, routine, IDs N/A;
no tracked product mutation. Reuse exact template/request/images from prior
trial, measure completion and sampled container resources, then inspect PDF
completeness/download cleanup if successful. Default120000ms remains unchanged.
Isolated lane flowdoc-service-srs-diagnostic/codex/srs-diagnostic; evidence in
ignored artifacts/srs-api-300. No additional optimization or layout changes.

Diagnostic PASS under300s test configuration: full HTTP upload/job/download
produced90 pages,240 unique requirements occurring exactly once,32 headings and
all mapped paragraphs/details present by whitespace-insensitive extraction.
Sampled page contact sheet1–7,45,89,90 visually inspected; no source-layout
equivalence or all-page visual acceptance claimed.13 low-resolution image
warnings remain. Download2611227 bytes, SHA256
`dc566082a6e07102e4143e4069926d3d8f94ec20a3d1337570422d7c3ad76e4e`.

Upload1129ms, admission400ms, DB queue107.356ms, DB running117233.936ms;
observed resource preparation2801ms, rendering-to-complete114410ms, download107ms,
total119187ms. Stage polling250ms; timings include local variation and do not
isolate internal layout/shaping/subsetting/writing.21 container samples at roughly
6–7s intervals, maximum observed527.1MiB and127.6% CPU (Docker convention, not
percent of all20 CPUs). These are sampled maxima, not exact peaks or leak proof.
One successful run after a timeout does not prove120s reliability, explain the
variation, or establish production/concurrent performance. Increasing the test
deadline did not establish a speed improvement.

Second download410 as expected; output and actual render-temp directories empty.
Upload expiry not waited out. Trial containers/networks/volumes/image and generated
password env removed; ignored evidence hash-archived to
`../flowdoc-service/artifacts/srs-api-300/` (api-result.json, verification.json,
resource-summary.json, samples, scripts, PDF and rendered pages). Clean no-change
lane/branch removed. No product commit/version/default/release change. Items2–3
now have one full successful trial and measured baseline under the explicitly
extended test deadline; choosing default timeout/headroom remains a decision.

### SRS layout draft — 2026-10-11

Status: owner-agreed scope, draft for implementation discovery; no product code
changes authorized by this record alone. Inline Project Control planning/prose
maintenance, routine, execution IDs N/A. This existing checkpoint owns shared
scope; Core owns engine behavior and Service owns package consumption/trials.
Document/proof budget for this update: this section, agreement coverage and
Project Control data validation only. No new agents, execution records or maps.

#### Goal and references

Match the reference SRS's elements and proportions approximately90% by owner
visual judgment, not a computed similarity score. Do not require matching line
breaks, page breaks or total page count. Use the previously supplied PDF and
legacy generator sizing reference above, latest JSON attachment as input, and
the successful srs-api-300 PDF as the current baseline. Keep current FlowDoc
fonts; adjust size, weight and spacing rather than acquire the legacy font.
Legacy pt values are starting references, not required replacements across font
families. Use regular weight by default and bold only where emphasis is intended.

#### Seven layout groups

| Group | Intended work | Acceptance focus |
| --- | --- | --- |
| 1. Font and weight | Existing FlowDoc font family, regular default, selective emphasis | Overall visual density and hierarchy near reference; Thai marks remain legible |
| 2. Text size and spacing | Body/title/heading sizes, line spacing, paragraph and heading gaps | Readability and proportional similarity without enforcing source line breaks |
| 3. Page area | A4 portrait, body margins and start/end positions; configurable cover counting | Body remains inside its region; numbering mode consistent throughout book |
| 4. Tables | Column proportions, cell spacing, borders, header appearance, icons and repeated headers | Readable continuation, no missing text, correct column boundaries |
| 5. Cover and approval | Title/project metadata, version/author details, signature and stamp areas | Required elements present with similar placement and useful whitespace |
| 6. Header and footer | Independent horizontal margins, banner, page fields, copyright/version, separator | Full-width header possible without changing body margins; no body overlap |
| 7. Contents and images | Hierarchy/indentation, links and page labels, image size/clarity | Destinations and displayed page labels agree; image limitations explicit |

Within every group distinguish template-only settings, engine capability gaps,
and unresolved decisions. Inspect existing contracts before proposing new ones;
prefer existing settings when sufficient. Do not change Core merely to style SRS.

Table color is an owner-requested subtask in group4, subject to proportional
implementation judgment: consider header fill, cell fill and border color only
as needed for SRS. Reuse existing support; no full table theme system. Repeating
the REQ identifier when its row continues to another page is desirable but
explicitly deferrable. Current TOC level4-to-level3 mapping remains a known
limitation to assess, not silent approval to redesign heading depth.

#### Capability candidates, pending code discovery

- Cover counting: template option for count-cover versus exclude-cover. SRS
  chooses count-cover with no visible number on the cover; next page is2 and
  total includes cover. Preserve existing exclude-cover behavior as the default
  for unchanged templates. Contents page labels follow the selected numbering;
  callers do not supply current/total fields through API.
- Header/footer horizontal margins: inherit body margins or explicitly set
  left/right, including zero. Header and footer can differ. SRS banner may span
  page width while footer remains inset. Preserve vertical space reservation;
  expanding horizontal area must not move body margins or cause overlap.
- Line: horizontal standalone separator, color/thickness/width and before/after
  spacing; default width follows its containing region. Intended placements:
  body/header/footer. Keep table borders distinct. Vertical/diagonal/free-position
  lines and unrelated nesting support are outside scope. Existing rendering
  primitives may be reusable; public node/API shape is not yet decided.

These candidates are requirements, not proof they are missing or implemented.
Any engine additions need bounded contracts and backward compatibility checks.

#### Sequence and proof

First inspect existing capability and identify the narrow owner changes. Tune
font/weight, text sizes, body width and table proportions before polishing cover,
contents and bands, since they affect wrapping throughout the book. Implement
necessary capability dependencies in the order revealed by discovery. Review
representative pages with the owner, then full-book API output using the latest
JSON: verify all requirements/headings, links/page labels, clipping/overlap and
download cleanup, and record timing against the current baseline. Reuse stable
checks; do not rerun a whole book for every minor styling edit when a focused
sample resolves the question. Finish with one complete candidate verification.

Use300s only as the agreed local trial allowance; production/default timeout
remains undecided. No performance optimization,300–700-page/concurrency promise,
DOCX/frontend work or release promotion in this layout scope. Low-resolution
image warnings require review; do not claim that resizing recovers source detail.
Completion is owner acceptance of the seven groups with recorded deferrals,
plus full-data correctness; approximately90% does not excuse missing content.

Design approach: challenge necessity and compare simpler alternatives before
Architecture/DB/Contract additions; separate evidence, assumptions and decisions.
Do not add process or agents merely to enforce that approach.

### SRS layout execution roadmap — 2026-10-11

Owner requested the roadmap and readiness to execute. Use the seven-group draft
above as scope. Inline Planning Partner, routine; execution IDs N/A. This update
completes discovery R0 only, with no product mutation. Each implementation slice
gets its bounded contract and affected-area checks before edits. Shared roadmap
stays here; no synthetic room records. Keep release unchanged throughout.

| Slice | Deliverable | Exit evidence | Status |
| --- | --- | --- | --- |
| SRS-L0 | Existing capability inventory and owner boundaries | Source paths against development base; requirements/gaps separated | Complete |
| SRS-L1 | Small representative SRS sample using existing fonts, regular default, tuned sizes, spacing and16/64/20 table proportions | Short PDF, preserved text, owner visual comparison; record chosen template settings | Complete; owner accepted |
| SRS-L2 | Cover counting option preserving old default | Cover hidden but counted when selected; next page2, total includes cover, TOC labels consistent; old templates unchanged | Complete; owner accepted |
| SRS-L3 | Independent header/footer horizontal regions | Full-width banner and inset footer with body margins unchanged; bounds and vertical reservation tests | Complete; owner accepted |
| SRS-L4 | Minimal horizontal Line and bounded table color subtask | Body/band separators and needed header/cell fills/border colors; merged and continued table checks | Complete; owner accepted |
| SRS-L5 | Complete SRS template styling across all seven groups | Cover/approval/contents/bands/images assembled with chosen typography; known deferrals listed and representative pages reviewed | Candidate verified; owner review pending |
| SRS-L6 | Full latest-data API acceptance and refreshed timing | Complete requirements/headings, page labels/links, download/cleanup, timing/resource baseline and owner visual acceptance | Pending |

SRS-L1 deliberately precedes engine additions: it establishes whether existing
fonts can achieve the desired proportions and avoids rewriting layout before
the visual target is understood. Build a focused sample from the retained SRS
template/request, not a new product fixture containing private business data.
Keep full-book baseline untouched; use ignored separate sample artifacts. Start
with current font family, normal weight, existing size values and reference
column ratios, then tune from visual comparison rather than blindly switching
body12pt to legacy16pt. Color remains optional until L4 necessity is assessed.

#### L0 findings and implementation boundaries

Inspected Core development base36065e1; the following inspected files have no
release-to-development differences (primary checkout remains release):

- `src/template/types.ts`, `src/composition/resolvedDocument.ts`: font styles,
  column widths and cell padding exist. Page bands have sizing/gap but no
  horizontal margin override. Public node union has no Line; cells have no fill
  or border-color setting.
- `src/template/pageNumbering.ts`: cover normalizes to exclude/hide and validator
  rejects counting it. Existing PageNumbering modes may be reusable; prefer a
  compatible extension of that contract over a second competing numbering mode.
- `src/layout/systemPageCounting.ts`: numbering is distinct from visible cover
  labels, providing an existing place to preserve hidden cover rendering.
- `src/layout/documentFlow.ts`: bands measured at body available width; table
  borders emitted with fixed0.5pt/black values.
- `src/pdf/drawContract.ts`: border drawing primitive exists and may underpin
  Line, but an authored Line contract and flow placement still need design.
  Cell backgrounds need an explicit draw-order/bounds design, not a theme system.

Core owns validation/composition/layout/draw additions and their tests; Service
owns consumed package, template persistence compatibility and HTTP verification.
Before L2–L4, inspect Service current/version assembly and storage for each exact
contract; do not assume fields survive persistence or that no migration is needed.
Keep capability patches independent and usable before patch-version increments;
do not preassign a release version or promote release from roadmap completion.

Proof budget: focused unit/regression tests for each changed boundary, packaged
Linux consumer when claiming package capability, Service persistence/API tests
when contracts affect it; one final whole-book run after styling stabilizes.
No repeat of the long book per cosmetic change. Document budget: this roadmap
plus existing evidence checkpoints. R0 proves code observations only, not the
planned feature behavior. Defer REQ repetition and unrelated nesting/TOC depth
expansion unless separately bounded and accepted. Next executable slice: L1.

#### L1 sample delivery — 2026-10-11

Owner authorized starting L1. Service-owned ignored template experiment at74fc8c7,
Core0.2.2 public API; no product changes. Separate clean lane used and removed
after hash-verified artifact archival. Sample: REQ0001–0006 and REQ0188 with its
original TAB, associated headings and existing bands/icons. Baseline and candidate
both3 pages; all7 full requirement strings present by whitespace-insensitive
extraction and each code appears once. PDF page1 comparison visually inspected;
remaining pages rendered for owner review. Public render durations5.200s and5.245s
are small-sample measurements, not whole-book performance claims.

Candidate settings: Sarabun body11pt/line19.84pt, normal-weight table header,
heading13pt/line24pt bold; requirement columns16/64/20% of538.5pt; cell padding
top/bottom3pt,left/right1.5mm. These are proposed visual settings, not accepted
final values. Existing cover/header/footer/color capabilities unchanged, no
cover sample or complete seven-group layout claim. L1 pending owner comparison.

Evidence at `../flowdoc-service/artifacts/srs-layout-l1/`: baseline.pdf,
candidate.pdf, compare.png, rendered pages, sample-request.json, both template
variants, result.json and verification.json. Raw business artifacts remain
ignored; engine/version/release unchanged. Task Docker image and clean temporary
worktree/branch removed. Next: owner selects or adjusts typography/proportions,
then L2 cover-counting contract. Do not silently treat sample delivery as approval.

#### L1 acceptance and L2 kickoff — 2026-10-11

Owner accepted L1: retain Google Fonts Sarabun, body11pt and the candidate
settings above; custom fonts are out of scope. This supersedes the pending
selection status, not the historical sample-delivery result.

Owner authorized L2 and requested investigation of apparent cover bands.
Inspection of the retained SRS template and90-page API PDF found an authored
banner image in the cover body (`cover.source.fragment.nodes.n13`), not an
enabled cover header. Cover has no header/footer definition; extracted page1
has no repeating footer text. Remove that authored banner from the SRS candidate.

Inline implementation, routine, execution IDs N/A. Core owns the compatible
nodeModelVersion16 extension: an explicit cover numbering policy may count
using existing continue/restart modes; default remains exclude, visibility
remains hidden and explicit show remains invalid. Bands remain suppressed.
Service consumes the new package; existing section JSON payload must preserve
numbering through decomposition/assembly and version storage. No new DB field,
node model, custom font, release promotion or L3 horizontal band changes.

Acceptance: counted cover1, body2, total includes cover, TOC uses counted labels;
omitted/excluded cover retains prior numbering; cover bands absent; SRS authored
banner removed in a focused candidate. Proof: focused regression, packed Linux
consumer, Service contract round trip and short real PDF. Reuse prior full-book
proof and defer the next full-book run to L6. One existing roadmap update only.

#### L2 delivery — 2026-10-11

Core development `codex/template-binding` at5d44da5 and Service development
`codex/template-registry` atc04aa37 now0.2.3. Release checkouts unchanged.
Core validation/normalization accepts explicit counted covers while retaining
hidden bands/labels and omitted-policy exclusion. No layout rewrite or migration.
Service version-storage regression proves policy persists and changing current
to excluded does not mutate the previously published counted version.

Checks: new regression RED3 before fix; affected Core21 tests passed; package
build/full427 tests and isolated Linux consumers passed. Service8 targeted tests
passed, including real PostgreSQL current/version storage and existing numbering
HTTP/direct/staged render tests. Vendor checksum verified. Passing content was
fast-forwarded unchanged, so no duplicate suite run.

Core package evidence:
`../flowdoc-core/artifacts/worktree-archive/flowdoc-core-srs-cover/1791704984343/`;
tarball SHA256 `b01c5f762274a838e5ac61d00999fe32256f7e75a76eb57b23b2bcb6cc3d5489`.
SRS sample evidence: `../flowdoc-service/artifacts/srs-cover-l2/cover-counted.pdf`,
`cover-template.json`, `cover-request.json`, `cover-sample.mjs`,
`cover-result.json`, `cover-verification.json`, `service-tests.log`.
The five-page sample has zero drawn cover images and no repeating cover footer;
following labels2–5,total5; TOC destinations3/3/5 match displayed labels. Seven
REQ codes retained. Cover rendered and visually inspected; owner visual review
of this sample remains pending. Render5.610s is a short sample, not full-book timing.
Cover styling beyond banner removal remains L5; L2 does not claim final cover design.

Artifacts archived with matching hashes before clean worktree/branch removal.
Isolated database/volume/network, task images and temporary password file removed.
No custom fonts, full-book rerun, timeout changes, or release promotion.
Next: owner sample review, then L3 independent header/footer horizontal regions.

#### L2 acceptance and L3 scope clarification — 2026-10-11

Owner accepted the L2 sample and authorized L3. L3 means page-relative bands,
not only horizontal overrides: each header/footer may ignore body margins and
set its own left/right inset and offset from its corresponding physical edge
(top for header, bottom for footer). Zero is allowed. The physical page remains
the boundary; body margins remain intact and actual band overlap plus gap must
reserve body space. Cover/blank suppression and the existing40% cap remain.

Inline routine implementation; execution IDs N/A. Core owns optional band
`placement:{mode:'page',left:Length,right:Length,offset:Length}` carried through
validation/composition/layout. Omission preserves the established body-relative
placement. Reuse existing sizing/gap; no second page model or DB migration.
Service owns package consumption and current/version round-trip proof. Test
portrait/landscape, independent bands, zero insets, repeats, number slots/images,
overlap and invalid bounds; packed Linux and targeted Service checks plus a
short SRS comparison. No Line/color/L4, release or full-book performance work.

#### L3 delivery — 2026-10-11

Core development df4dfe0 and Service development f5765b3 now0.2.4, release
unchanged. Optional placement is validated, preserved by composition and section
storage, and used for band measurement and text/image/page-field positioning.
Body reservation uses actual overlap plus gap; physical bounds and the40% cap
prevent unusable regions. Existing band modes and cover suppression remain.

Evidence: Core focused32 checks passed before the additional repeated-page test;
all4 new placement tests and package build/full431 tests/isolated Linux consumers
passed. Service existing8 targeted storage/API checks passed; new placement
version test passed after correcting its missing-footer fixture. No Service
runtime repair or migration was needed. The original failed fixture run is
retained and is not reported as a passing run. Vendor identity verified.

Core artifacts:
`../flowdoc-core/artifacts/worktree-archive/flowdoc-core-srs-bands/1791705826939/`.
Package SHA256 `2c8f29436676b3274f733c26a83d4a957c437febe66dddc30c7c23735769b12e`.
SRS comparison: `../flowdoc-service/artifacts/srs-bands-l3/` with baseline.pdf,
page-bands.pdf, both template variants, band-sample.mjs, band-result.json,
band-verification.json, current-service-tests.log and placement-retest.log.
Both PDFs have5 pages and7 REQ codes; labels and TOC destinations3/3/5 match.
The baseline PDF is byte-identical to the retained L2 output. Candidate page3
and baseline page3 visually inspected: full-width header, independent inset
footer, body horizontal margins retained. Cover still has no drawn image.
Sample durations4.512s/6.743s are individual measurements, not a performance claim.

Owner visual acceptance pending. Artifacts hash-verified before clean temporary
worktree/branch removal; isolated Docker DB/volume/network, images and temporary
password removed. Fast-forwarded tested content unchanged; no duplicate checks.
Next: owner review, then L4 horizontal Line and bounded table colors.

#### L3 banner frame correction — 2026-10-11

Owner observed the remaining white top gap and authorized matching the SRS
banner frame to the image aspect ratio. The previous27mm frame centered a
4144x480 image at210mm width, leaving letterbox space. Corrected the sample
generator to calculate height from the loaded image dimensions:24.324324mm.
This is template-only; no engine/API change or patch version increment.

Corrected candidate at `../flowdoc-service/artifacts/srs-bands-l3-fit/page-bands.pdf`,
with generator, template and `fit-verification.json`. PDF drawing matrix verifies
left0, top gap below0.00001pt, full page width and unchanged image aspect ratio;
five pages retained. Page3 rendered and visually inspected. These corrected
files supersede the prior L3 candidate for owner review; copied older comparison
logs remain historical. Temporary detached checkout/image removed; release unchanged.

#### L3 acceptance and L4 kickoff — 2026-10-11

Owner accepted L3 after opening the PDF outside the chat viewer. The remaining
one-pixel border was absent in the external viewer and direct raster; do not
change document geometry to compensate for the chat preview. Exact viewer cause
is unverified; no application feedback submission is claimed.

Owner approved the L4 bounded design: horizontal Line in body/header/footer,
optional width (default parent width), thickness, color and before/after space;
table header fill, per-cell fill and one border color per table. Explicit cell
fill wins over header fill. No per-edge colors, lines in cells, theme system,
vertical/diagonal lines or new nesting. Defaults preserve old output.

Inline routine implementation, execution IDs N/A. Core owns graph validation,
binding, flow and PDF primitives; Service consumes the package and verifies
storage/version round trips. Proof budget: invalid-contract/flow tests, repeated
header and row/column-span continuation fills, packed Linux consumer, targeted
Service checks and a short SRS PDF. One existing record; no new registry/report.
Keep raw sample data ignored, release unchanged and defer whole-book rerun to L6.

#### L4 implementation and verification — 2026-10-11

Core development 5e77cf6 and Service development a108df3 are version0.2.5;
release remains0.2.0. Horizontal `line` accepts optional Length width,
thickness, spaceBefore and spaceAfter, and six-digit hex color without `#`.
Defaults: parent width,0.5pt black, zero spacing. It occupies flow height and
moves intact to the next page; excessive width/height fails layout. Body and
page bands support it; cells do not. Available with nodeModelVersion13+.
Table `headerFillColor`/`borderColor` and cell `fillColor` are optional (model9+).
Explicit cell fill wins; absent fill stays transparent and border stays black.
Merged/repeated/continued cells reuse their prepared color per page fragment.

Evidence: all437 Core tests (including6 new L4 cases), build and isolated packed
Linux consumers passed. Service9 targeted storage/version/API/assembly checks
passed in a disposable database. No runtime Service change or migration needed.
Package identity checked against its SHA256 manifest. Core proof archived at
`../flowdoc-core/artifacts/worktree-archive/flowdoc-core-srs-l4/1791707393060/`.
Service proof and sample at `../flowdoc-service/artifacts/srs-l4/`: tests.log,
line-colors.pdf, line-colors-template.json, l4-sample.mjs, l4-result.json and
verification.json. Initial sample attempt lacked copied upload files; corrected
artifact preparation and reran successfully, without changing product code.

Short SRS candidate retains5 pages and7 unique requirement codes. Page3 raster
visually reviewed: shaded header, visible text/images and footer rule. Fill
operators precede text. Omitting new options reproduces the accepted L3 PDF
byte-for-byte. Individual generation timings5.497s baseline/5.934s candidate are
observations, not a performance threshold. Whole-book testing remains in L6.
Owner visual acceptance pending; no claim of final SRS layout acceptance.

Artifacts hash-verified before cleanup. Tested commits fast-forwarded to existing
development branches unchanged; temporary clean lanes/branches and this round's
Docker image/database/volume/network/password removed. Release untouched.
Next: owner review of L4 sample, then the next bounded layout roadmap item.

#### L4 follow-up: line alignment and reference cover — 2026-10-11

Owner accepted L4 and requested left/center/right line alignment plus a cover
closer to the supplied69C_REQ_SRS.pdf. New bounded inline scope; no registered
execution IDs. Core owns optional align (default left); Service consumes0.2.6.
Use the existing flow, preserve old geometry when omitted, test body and bands,
invalid align and snapshot persistence, packed Linux consumer, then inspect
reference/candidate cover and unchanged subsequent pages. Reference uses one
long rule below a single-line title. Keep Sarabun; approximate components and
placement rather than original font or pagination. Template-only cover changes
may reuse fixed-height spacing and a white-border metadata table. No general
text alignment, new columns contract or release promotion. Existing roadmap is
the sole record; raw documents/artifacts stay ignored. Risk routine; owner
visual approval remains separate from engine checks. Current host model retained
for this bounded inline implementation; no delegated lanes or new room.

Follow-up delivered: Core41ec0ab / Service10a59c1, development0.2.6. Optional
`Line.props.align` supports left/center/right relative to its immediate available
width; omitted remains left. New alignment regression observed RED then GREEN;
all439 Core tests, build and packed Linux consumer passed. Two targeted Service
snapshot/band persistence tests passed; package checksum verified. No DB/API
runtime changes. Core proof archived under
`../flowdoc-core/artifacts/worktree-archive/flowdoc-core-line-align/1791708082814/`.

Candidate `../flowdoc-service/artifacts/srs-cover-line-align/cover-aligned.pdf`
and cover-aligned-template.json preserve the request's variable values. The
cover uses normal Sarabun20pt title/project,11pt metadata and10pt contacts;
original margins/line endpoints are reproduced, with a single-line title and
white-border table for metadata positioning. cover-sample.mjs and
cover-verification.json record reproduction/checks. The rule endpoints match
reference coordinates within0.001pt; pages2–5 are pixel-identical at1000px raster
to accepted L4 output. Five pages retained; final cover raster visually reviewed.
Reference font is intentionally not reused. Fixed cover spacing is tuned to the
sample; unusually long project/author/address values may need template changes.
Owner visual acceptance of this cover remains pending.

This follow-up did not change L5/L6 scope or release. Clean tested development
commits fast-forwarded unchanged. Core archive hashes checked, Service test logs
copied and hash-checked, current temporary worktrees/branches and Docker resources
removed. Existing copied L4 files in the sample folder remain comparison inputs;
cover-result.json and cover-verification.json describe this follow-up.


#### L5 assembled SRS template candidate — 2026-10-11

Owner accepted the aligned-line cover, then authorized L5. Bounded inline,
routine, Product Implementation Agent / Evidence Reviewer; execution IDs N/A.
Service owns ignored template/sample artifacts using public Core0.2.6; no product
source, architecture, API, database or package-version change. Existing Core
capabilities suffice. Proof budget: focused sample validation/render, complete
sample text, links/page labels and visual review; full latest-data API/timing
remains L6. Shared record stays here. No release promotion.

Candidate at `../flowdoc-service/artifacts/srs-l5/srs-l5.pdf` is8 pages: accepted
cover, approval, revisions, contents, legend and three body pages. Reuses the
accepted typography, margins, full-width banner, footer and16/64/20 body table.
Approval has four open signing/date areas and two stamp areas; it does not imply
actual signatures/approval. A white-border table supplies template spacing.
Revision columns use19/16/21/44 with a light-blue header; legend uses existing
image-in-cell support to put icons beside descriptions. TOC now includes revision,
contents and legend headings. No new general text alignment was introduced.

Files: build-sample.mjs, l5-template.json, l5-sample-request.json,
l5-full-request.json, result.json, verify-l5.py and l5-verification.json.
Latest-data baseline is the retained srs-api-300 request; its full body/data
remain equal in l5-full-request.json and pass preparation validation. The sample
uses the previously selected seven REQs only; full-book generation is not claimed.
Renderer returned no warnings;8 pages in6.903s is one sample observation, not an
API or performance acceptance threshold. Verified31 source strings, all7 REQ
codes, twelve TOC annotations targeting3/4/5/6/6/8 twice, and displayed page fields.
Initial extraction assertion included repeated page/table headers; verification
was corrected to remove those known decorations, then all source strings passed.
All eight final page rasters visually reviewed; cover template unchanged.

Seven-group coverage: typography/spacing and body area reuse accepted L1–L3;
tables reuse L4 with revision styling; cover/approval assembled; bands reuse
accepted geometry; contents/legend images assembled and links checked. Owner
visual judgment remains pending. Known limitations: template padding approximates
centering for this data, unusual long title/approval data may need adaptation;
TOC depth4 maps to3, continued REQ IDs are not repeated, and scaling cannot recover
source icon detail. No new image-quality guarantee or source-page-count match.

Temporary detached Service checkout and this round's Docker image removed after
checks; all outputs created directly in the retained ignored artifact directory.
No DB was needed. Both development packages remain0.2.6, release unchanged.
Next: owner review of pages2–5, then L6 full latest-data API acceptance/timing.

#### L5 Element pairing correction — 2026-10-11

Owner clarified that the left side must contain icon plus category label, with
only its description on the right. After discussing Columns versus paired rows,
owner approved a two-column table. Inline routine template correction; Service
ignored artifacts only, same public Core0.2.6; no product/DB/API contract changes.
The existing Columns support is band-only; no body Columns expansion is implied.

Candidate `../flowdoc-service/artifacts/srs-l5-element/element-refined.pdf`
supersedes the prior L5 sample for visual review. Paired cells use145pt left and
remaining width right, invisible white borders, shared row height and unbreakable
rows. Each image precedes its label within the left cell. Nine labels/descriptions
preserved, eight source icons retained; Agreement has no invented icon. Split the
existing label separator into template-local label/text fields in both sample and
full request, asserting reconstruction equals original source. No non-legend data
changed. Files: refine-element.mjs, element-template.json,
element-sample-request.json, element-full-request.json, result.json, verify.py,
verification.json and page5 raster. These template/request outputs are the next
L6 inputs, subject to owner review.

Validation/preparation/render passed,8 pages, no renderer warnings. All nine pairs
checked against extracted text; page5 visually reviewed. The other seven page
rasters are pixel-identical at1000px to the prior L5 candidate. Raw originals and
prior artifacts preserved. Temporary clean detached checkout and this task's
Docker image removed; packages remain0.2.6 and release unchanged. L5 visual
acceptance remains pending; full-book API/timing stays L6.

#### L5 Element inline-icon correction — 2026-10-11

Owner rejected the vertically stacked icon/label candidate: the left group must
contain separate horizontal icon and label slots, with a smaller icon. Bounded
inline template correction uses three physical table cells (22pt icon,123pt
label, remaining description), representing the two logical groups. This avoids
new nested Columns or engine behavior. Icons reduced20pt to12pt; Agreement keeps
an empty icon slot so labels align. No label or description changes.

Candidate `../flowdoc-service/artifacts/srs-l5-element-inline/element-refined.pdf`
supersedes the previous Element candidate, which remains unaccepted history.
Same folder holds generator, template, sample/full requests, result.json and
verification.json. All nine pairs/eight images retained, public validation and
render passed with8 pages; final page5 visually inspected. Other seven pages are
pixel-identical at1000px to the original L5 sample. Full non-legend data unchanged.
Use this folder's element-template.json and element-full-request.json for L6
only after owner review. L5 remains pending visual acceptance. No product change,
version bump or release promotion; temporary clean checkout and image removed.

#### L5 Element natural wrapping — 2026-10-11

Owner accepted the inline small-icon/label arrangement and requested engine-led
wrapping instead of reference line breaks. Bounded inline template-data mapping:
replace extracted newline breaks with one space in Element descriptions only,
for both sample and full request. Preserve raw inputs and all other sections;
this is not a global newline removal or Core wrapping-policy change.

New candidate `../flowdoc-service/artifacts/srs-l5-element-wrap/element-refined.pdf`;
its element-template.json / element-full-request.json supersede prior L5 inputs
for the next full-book trial. Public preparation/render passed,8 pages. Verified
nine labels/descriptions, unchanged non-whitespace source text, no remaining
hard breaks in those descriptions, eight icons, and seven other page rasters
unchanged at1000px. Page5 visually reviewed with naturally wrapped descriptions.
Generator/results/verification retained in the same ignored directory. Temporary
clean checkout and Docker image removed. Packages0.2.6 and release unchanged.
L6 remains full-data API/timing work; no full-book acceptance claimed here.

#### L5 footer finishing — inline scope, 2026-10-11

Owner approved finishing footer before L6. Core owns optional band text alignment
and compact final page-field text; Service consumes the packed package and owns
the SRS template adjustment. Routine inline implementation; execution IDs N/A.
No separate room or registered round. Acceptance: natural Page N of Total spacing,
whole-line centering above the rule, Copyright/Version below; 1–3 digit coverage,
legacy defaults retained, no arbitrary XY positioning. Overflow must fail without
changing already-computed pagination. No body/cell alignment expansion, full-book
L6, release promotion, or custom fonts. Evidence budget: focused layout/contract
checks, packed Linux consumer, affected Service persistence/API checks and an
8-page visual sample. Reuse accepted Element sample/full request; update this
record with results and retained artifacts only.

Footer implementation delivered in Core `b8a7017` / Service `30e0644`, both dev
packages0.2.7; fast-forwarded into codex/template-binding and
codex/template-registry. Primary release checkouts remain c17f197 / edd9a7e.
Optional band-only textAlign left/center/right and pageFieldLayout compact; the
latter shapes the whole final label after page counting and reserves one line
before pagination. Declared field width remains a capacity limit. Compact text
that needs multiple lines fails; non-left page-field alignment requires compact
mode. Omitted options preserve legacy output. Body/cell text remains unchanged.

Proof: focused RED before implementation, then14 focused tests; packed Linux
build445 tests passed plus isolated consumer checks. Service container build,
vendor integrity and6 affected real-DB/API tests passed (including immutable
published band settings). Public-engine sample8 pages, no warnings,5.718s for
this render only; not a full-book timing claim. Separate restarted numbering
fixture Page103of8 tests3-digit current alignment; its total8 is intentional.
Unit cases also cover total240. All eight page rasters reviewed; no footer/body
collision. New footer height causes natural table continuation changes on final
three pages; first five body/header glyph sequences unchanged, all-page
non-whitespace body/header glyph counts unchanged. Legacy template PDF remains
byte-identical. Automated center/order checks passed for all seven body pages;
link annotation counts unchanged (no new manual click acceptance claimed).

Retained candidate and reproducible generator/checks:
`../flowdoc-service/artifacts/srs-footer/footer.pdf`, footer-template.json,
footer-sample-request.json, footer-full-request.json, generate.mjs, verify.py,
verification.json, result.json, container/API logs and rasters. Core package
proof archived at `../flowdoc-core/artifacts/worktree-archive/flowdoc-core-footer/1791711058663`.
Archive copies hash-verified before deleting clean merged task worktrees and
branches; task DB volume and Docker images removed. No release promotion.
Owner visual review of this footer remains pending; use its template/full request
for L6 only after review. Full-book API/timing remains deferred until discussion.

#### L5 approval-page completion — inline scope, 2026-10-11

Owner approved three bounded changes after inspecting page2: section-scoped
signer name/date variables, actual centering inside existing table cells, and
more spacing below Company Stamp. Core owns cell text alignment; Service consumes
the package and the SRS template. Routine inline implementation, execution IDs
N/A. Existing artifact srs-footer is the immutable baseline. No release, full-book
L6, arbitrary XY, body-root text alignment, or new node model. Names/dates may be
empty for later paper signing; short/long values are explicitly mock data.
Acceptance/proof budget: focused alignment validation/layout tests including
padding/ink and continuation, packed Linux consumer, affected persistence check,
and blank/short/long public-engine PDFs with complete text, centered lines and
no approval/footer overlap. Reuse this record and retained artifact folder;
no additional report or execution records.

Delivered Core `386afe1` / Service `4318bf2`, dev packages0.2.8. Core admits
textAlign left/center/right for direct table-cell TextBlocks in model9+ and
positions each measured line using occupied ink width inside cell padding.
Existing header/footer behavior retained; body-root alignment remains rejected.
No new node model or XY contract. The SRS approval template removes asymmetric
horizontal padding and centers titles, names/dates and company information.
Nine optional string fields live under sections.approval.data: preparedName,
preparedDate, verifiedName, verifiedDate, approvedName, approvedDate,
customerApprovedName, customerApprovedDate, customerOrganization. Omitted values
use dotted placeholders; supplied empty strings remain empty. Global projectName
and organization bindings retained. Dates are display strings, no new date type.

Approval-only text lineHeight increased17pt to20pt after full Thai date text
exposed insufficient vertical ink capacity. Company Stamp label uses25pt line
height. Reduced excess vertical padding before stamp group provides space for
long names without changing page/footer positioning or shrinking text.

Proof: four failing focused assertions before implementation;5 new focused tests
pass, packed Linux build450 tests and isolated consumer pass. Service container
build/vendor verification and6 affected real-DB/API tests pass. Blank, short and
long signer/date/company public-engine PDFs each8 pages with no warnings;
render times6.049s/7.114s/8.493s are sample measurements only. All requested mock
values extracted from page2; measured maximum column center error0.244pt,
stamp label gap11.555pt and minimum body-to-page-number gap36.501pt for long case.
All three page2 rasters visually reviewed. Other seven pages' extracted text
unchanged; baseline template still produces byte-identical PDF. Incorrect types
rejected for all nine variables. No full-book L6 or production-scale claim.

Retained `../flowdoc-service/artifacts/srs-approval/`: approval-template.json,
approval-{blank,short,long}-request.json/PDFs, approval-full-request.json (no
fabricated signer names), generator, verifier, logs and page2 rasters. Use the
new template/full request for the later full-book trial after visual review.
Core package proof: `../flowdoc-core/artifacts/worktree-archive/flowdoc-core-approval/1791711938157`.
Hash-verified archives, fast-forwarded dev branches, removed clean merged task
lanes/branches and task Docker resources. Release remains c17f197 / edd9a7e.

Separate discovered limitation, deferred rather than hidden: testing an unusually
long global projectName caused the existing cover to fail safely with 'Cover
exceeds one page' at contact-fax. Failure log retained. Final long case exercises
signer names, full Thai dates and customer organization; it does not claim the
cover supports arbitrary project-title length. Footer design accepted by owner;
this approval-page visual candidate awaits owner review.

#### L5 signature dotted baselines — 2026-10-11

Owner approved a separate dotted baseline under each parenthesized signer name,
with a minimum width independent of supplied name length. Bounded inline template
change only, Service-owned SRS artifact, execution IDs N/A. Reused current Core
0.2.8 public renderer; no engine/API property, package bump or release change.
Four centered TextBlocks containing64 Sarabun11 dots follow the name blocks.
Their measured width62.586mm exceeds the60mm target and fits each padded cell.
This is a fixed authored baseline in this SRS template, not a general minWidth
contract. Long names wrap above it. Missing names now default to empty text;
explicit empty strings tested. Reduced existing bottom padding by20pt absorbs
the added line, preserving dates and stamp positions.

Evidence retained in `../flowdoc-service/artifacts/srs-signature-lines/`:
signature-{blank,short,long}.pdf and request.json, signature-template.json,
signature-full-request.json, generate.mjs, verify.py, verification.json and
page2 rasters. Public validation/preparation/render passed for all3 cases,
8 pages each, no warnings. All4 baselines verified centered, >=60mm, below final
name line and above Date. All supplied names retained, date/stamp coordinates
unchanged, other7 pages extracted text unchanged. All3 page2 rasters reviewed.
Full request validates but full-book render remains L6. Clean temporary detached
checkout and task Docker image removed; no branch created. Use this template/full
request after owner visual review; previous approval artifacts preserved.

#### L5 signature bracket correction — 2026-10-11

Owner clarified and rejected the preceding bracket placement: name must be above
one literal `(................................................................)`
line, not parenthesized separately. Current bounded inline Service template
correction removes bracket text from all4 name blocks and puts both parentheses
in the same text run as the64 dots. Explicit empty names retain their reserved
line height. No Core/API change, version bump, or release promotion; execution
IDs N/A. Prior signature-lines candidate remains unaccepted history.

New candidate `../flowdoc-service/artifacts/srs-signature-brackets/` retains
signature-{blank,short,long}.pdf/requests, signature-template.json,
signature-full-request.json, generator, verifier, results and page2 rasters.
All3 public validation/preparation/renders pass,8 pages each, no warnings.
All4 bracket/dot runs share the same baseline; dots retain width>=60mm, full
bracketed run65.054mm. Names appear above, dates below, all mock values retained.
Date/stamp coordinates and other7 pages' extracted text unchanged. All3 page2
rasters visually reviewed. Full request validates; full-book render still L6.
Clean temporary detached checkout and task image removed. Packages remain0.2.8.
Use this candidate after owner visual acceptance; it supersedes the previous
signature-lines template/full request for the next trial.

#### Owner artifact retention decision — 2026-10-11

Owner accepted srs-signature-brackets as the current visual candidate. Preserve
srs-approval in full as a reusable no-underline alternative. Owner requested
removal of the superseded srs-signature-lines variant (parentheses around name,
dots below); inventory40 ignored local artifact files, no symlinks. That variant
is retired from future use. Physical removal is NOT completed: automatic approval
review rejected the scoped deletion command with 'blocked by policy' and no
specific reason. No files were deleted, and no alternate deletion route was used.
No runtime, package, release or template behavior change. Inline maintenance;
execution IDs N/A. Retained approval/current folders confirmed present.

#### L6 current full-data real API trial — 2026-10-11

Owner requested the latest source JSON (document version "2") through the real
API using the accepted signature-brackets template. Bounded inline verification,
Service-owned trial with Core consumer; execution IDs N/A. No product changes,
package bump or release promotion. Service dev4318bf2 consumes Core0.2.8; clean
isolated detached checkout and private task Compose database were used.

Evidence: `../flowdoc-service/artifacts/srs-l6-real-api/` retains template,
full/submitted requests,17 upload assets, runner/client, PDF, input-check,
api-result, verification, links-pages-verification, resource samples and rasters.
Raw SHA2568c8c6cdf91e6dfa4e6032a1b09a6f336e96430e267f81e386d068cc79e2f82ea;
all240 raw sm_comment values match request details whitespace-insensitively.
Source document version2.0 is distinct from registry template version1.

Actual HTTP upload/finalize -> job -> poll -> download passed:85 pages,
2,763,039 bytes; upload845ms, admission250ms, observed job95,806ms,
download127ms, total97,068ms. DB running95,694ms, queue105ms. Task renderer
limit300s; this one local run is not a concurrency or300–700page capacity claim.
13 container samples, maximum observed409.6MiB; not exact peak RSS.
Eight IMAGE_LOW_RESOLUTION warnings retained for authored requirement icons;
these do not block output and do not prove image print quality.

All240 requirement codes appear once with complete details; all mapped headings
and paragraphs retained. All70 TOC annotations checked against target pages and
headings, all84 visible page fields correct, no text outside physical pages,
cover has no repeated band. Five cropped Thai link labels differed in glyph
ordering between extractors; canonical request headings confirm target text.
Ten representative pages rasterized and visually reviewed, including cover,
approval, TOC, Element, first/middle/final body pages. Full-book owner visual
acceptance remains pending; no claim of exact source-PDF layout equivalence.
Second download410 and empty output/render-temp directories confirm one-shot
cleanup. Staged resources follow expiry policy. Task Compose containers/volumes,
image, temporary credential and clean detached checkout removed; retained local
PDF/evidence preserved. Release branches unchanged. Existing deferred cover-long-
title and other layout limitations remain outside this trial.

#### L6 empty trailing table fragment UX correction — 2026-10-11

Owner accepted pagination behavior and requested only removal of the empty table
strip at page49. Bounded inline Core rendering fix, Service package consumer;
execution IDs N/A. No new pagination mode or template workaround. Core paint
clips a trailing newly-started nonempty row when none of its items fit this
fragment. Layout cursor/cut, next-page offsets and contents remain unchanged.
Explicitly authored empty rows, partial content and crossing rowspans retain
existing geometry. Borders and fills use the same shortened paint extent.

Regression reproduced first: border extended to40pt rather than26pt with no
second-row content. Added regression and authored-empty-row preservation tests.
Relevant local layout/PDF tests167 pass; TypeScript build passes. Linux package
build runs452 tests successfully. Core0.2.9 commit6c0a8c3; Service0.2.9 commit
d206d37 consumes checksum-verified package, Docker runtime build and isolated
network-disabled packed consumer render8-page sample pass. Integrated into
existing development branches only; release unchanged.

Evidence in `../flowdoc-service/artifacts/srs-empty-fragment/`: real full API
trial using tested Core dist, comparison.json, page49.png, srs-api.pdf,
packed-consumer.json/packed-short.pdf, requests, uploads and logs. Full trial
85pages; all page text and glyph coordinates exactly equal previous L6 PDF.
Page49 line count15->14; raster confirms the empty strip removed and table closes
at the last populated row. Same8 low-resolution warnings; no layout/content
change claimed. Full API trial used dist mount; separate8-page Linux smoke used
the actual packed0.2.9 artifact. Timing105.8s is not a performance comparison
because package build ran concurrently. Existing content checks reused because
all85 pages' extracted text is identical. Owner visual acceptance pending.
Core package/logs retained under `../flowdoc-core/artifacts/table-empty-fragment/`.
Task containers/volumes, images, credentials, clean worktrees and integrated task
branch removed; prior artifacts retained. No shared system map promotion.

#### L6 ten-run sequential real API benchmark — 2026-10-11

Owner requested5–10 repeated trials and standard deviation. Bounded inline
Service verification using immutable devd206d37/Core6c0a8c3, both packaged0.2.9;
execution IDs N/A. Ran10 serial jobs on one prepared isolated Compose server,
fresh17-image upload/finalize per run, same full version2.0 source request and
accepted SRS template. No builds or PDF content verification during timed runs.
Timing starts before upload and ends after PDF download; excludes Docker build,
DB migration, template registration and post-download cleanup check. Client uses
real HTTP loopback inside API container; public-network latency not represented.

Evidence: `../flowdoc-service/artifacts/srs-api-benchmark-10/` contains input and
environment hashes, runner/client,10 PDFs and per-job reports, summarize.py,
timings.csv and summary.json. Host i9-13900H,20 logical CPUs; Docker20 CPUs,
8,169,648,128 bytes memory. No explicit claim of idle host or dedicated hardware.
Totals in seconds:87.682,91.834,88.029,87.835,91.827,93.923,91.929,92.756,
91.238,99.520. All runs retained, including first and slowest. Mean91.6573s,
sample SD3.52845s (n-1), median91.8305s, min87.682s,max99.520s,CV3.8496%.
Summed timed duration916.573s. Mean upload0.4676s, admission0.1757s,
observed job90.8911s, download0.1024s; small remainder is client overhead.
DB worker mean90.6943s. These are descriptive sample statistics, not an SLA,
concurrent capacity, population bound or explanation of slowest-run cause.

All10 jobs succeeded,85 pages each, every page's extracted text exactly matches
the accepted empty-fragment correction PDF. Same8 low-resolution warnings each.
All10 one-shot cleanup checks passed (second download410, no output/render-temp
files left). Task staging follows expiry policy and isolated volume was removed
at end. Containers, volumes, image, temporary credentials and clean detached
checkout removed; evidence/PDFs retained. No product edits, version bump, branch
promotion or release changes. This repeated baseline is complete; further load
or performance optimization work is outside the current request.

#### Local release0.2.9 — 2026-10-11

Owner authorized matching guides followed by release0.2.9 in both repositories.
Bounded inline release maintenance; execution IDs N/A. Core README/template guide
and Service README/usage guide now describe0.2.9, existing model gates, counted
hidden covers, independent page bands, lines/colors, alignment/compact fields,
tab/CID handling and empty-fragment UX. Service guide records the10-run local
baseline and explicitly distinguishes300s trial override from120s server default.
Compose default runtime/verification image tags now0.2.9; no engine/API/DB change.

Core candidate0b8058e, Service candidate1c02c4a. Rebuilt Core tarball differs from
previous tested0.2.9 candidate only in package/README.md; all runtime/native/font
entries identical. This is the first released0.2.9, not overwriting a release.
Final SHA256f18a8e0d4ea8db0fab1787e115a4c8261a25fea633ffcb33bb7f4425b279ab10.
Service vendor manifest/lock pin this tarball. Core Linux build452 tests PASS;
Service Docker runtime build and checksum PASS. Fresh isolated DB guide exercise
migrate -> draft-import -> publish -> show -> contract -> HTTP job -> PDF ->410
PASS, no warnings. Reuse10-run full-book evidence because runtime is identical.
No broad Service suite rerun claimed for this docs/config/package-metadata delta.
Evidence: Core artifacts/release-029 and release-029-build.log; Service
artifacts/release-029 (manual-result, logs, PDF, promotion.json) plus benchmark.

Release snapshots parent previous release commits and exactly match reviewed
candidate trees. Annotated v0.2.9 tags created locally:
- Core release d06cd8a1b8365a6c0a7735706165c3b670704d80 (source0b8058e).
- Service release7563151fe5870adf3d3574ca4ad2139535e7f9c6 (source1c02c4a).
Primary checkouts were on development branches at promotion preflight, so those
branches were fast-forwarded and preserved; separate release checkouts were used.
No push, remote release publication or deployment. Scoped containers/volumes,
image, temporary credential, clean worktrees and integrated task branches removed.
Evidence retained. Known image-resolution warnings, long-cover overflow and
unproven concurrent/300–700page capacity remain explicit limitations.

#### Worker-time diagnosis — 2026-10-11

Owner requested diagnosis of long workerSeconds before further features/load work.
Bounded inline discovery, Service processor plus Core text runtime; execution IDs
N/A. Release0.2.9 and product source unchanged. Temporary instrumented copies of
installed Core createPdfEngine.js/textRuntime.js were mounted in an isolated API
trial; no candidate/runtime optimization or public telemetry contract introduced.
Evidence `../flowdoc-service/artifacts/srs-worker-profile/` retains instrumentation,
inputs, stage/native counters, API result, PDF and diagnosis.json.

workerSeconds is DB finished_at-started_at: after claim, including pinned-input
validation/composition, resource preparation, render child, PDF persistence and
success transition. Upload/queue time is outside it. Profile run worker87.304s:
layout81.727s (93.61%), TOC numbers0.085s, final page text1.434s, font subset1.210s,
PDF writing0.295s. Resource preparation approximately2.03s from250ms polling.
Inclusive native counters:28,859 shaping subprocesses75.305s;1,810 segmentation
subprocesses4.815s. JS decodeShape0.704s inside these rendering stages. Do not sum
inclusive counters with stage times. Native elapsed includes startup, font read/
parse, shaping, JSON serialization and transport; their costs are not separated.
Shaper returned149,200,780 bytes of JSON in total.6,604 shape calls (22.88%) and327
segment calls repeat executable/arguments within this job. One profile includes
instrumentation overhead and does not replace the10-run baseline.

Code explains call amplification: measureText grows each candidate line through
word boundaries and shapes each candidate; its cache lives only within one block.
textRuntime starts a fresh native process on every cache miss. Native main reads
and parses the font on every shaping invocation. Layout runs once in this profile;
whole-book double pagination is not the measured source of cost. The native-call
family is the established bottleneck; process-start overhead alone is not yet
isolated. Output85pages; every page's extracted text matches benchmark. PDF bytes
differ, so byte-identical output is not claimed.

Next options for owner decision: bounded per-job cache (simple, duplicate-call
coverage measured but speedup unproven), then batching/persistent native process
(font reuse, cancellation/time/memory boundaries required), then fewer wrapping
probes with exact Thai/ink/layout regression coverage. No change to wrapping rules
or replacement of ICU/Rustybuzz justified by this evidence alone. No promised
speedup. Scoped containers/volumes, image, credential and clean detached checkout
removed; local evidence retained. No release/version/map changes.

#### Text runtime optimization0.2.10 — 2026-10-11

Owner authorized a first target of layout/measurement <=60s (half of81.727s was
aspirational), preserving wrapping and document geometry. Bounded inline product
implementation: Core runtime/native transport plus Service package consumption;
execution IDs N/A. Routine risk, medium work size. Existing roadmap is the work
and result authority; no additional room/registry/map promotion. Accepted design:
per-document bounded cache first, persistent native font session if insufficient.
No changes to measureText, ICU boundaries, Rustybuzz revision, template or API/DB
contracts. Proof budget: targeted lifecycle/cache tests, Linux package checks,
real85-page SRS timing and exact output comparisons. No concurrent/300–700page
capacity claim. Local available model retained; no agent dispatch or model switch.

Core commit c35c9cc adds a per-generation LRU (32MiB serialized UTF-16 key/value
payload and8192entries; not a total heap bound) and one lazily opened native
shaper per used font. Length-prefixed UTF-8 input and JSON-line responses preserve
native shaping output. Input/output bounded16MiB, request timeout30s; process
failure/timeout closes the session, finally closes all sessions on engine success
or failure. Native EOF also exits when the rendering parent disappears. Fonts
are loaded once per session. One-shot CLI remains compatible for runtime probes.
Sessions/cache are not shared across documents. Service commit55e1a60 pins Core
artifact f666ce7206709ccf67a0fcadc334bc253bfc82de4332aeae753b74a2be79a9c6.
Both development packages are0.2.10; release/tag0.2.9 is unchanged. No remote push.

Cache-only trial reduced shape calls28859->23738 but layout82.555s failed60s.
Persistent-session diagnostic trial with the whole package mounted from Windows
achieved33.369s layout/41.087s total; this mount-dependent result is not the final
packaged benchmark. Final Docker image installs the actual versioned tarball;
only a copy of createPdfEngine with five stage timing wrappers is mounted.
No algorithm or runtime logic differs in that copy. Five serial local actual API
jobs each upload17resources, finalize, submit, poll, download and check410/cleanup.
Same raw data/template and85-page baseline as the earlier10-run benchmark.

| Measure (seconds) | Mean | Sample SD (n-1) | Min | Max |
| --- | ---: | ---: | ---: | ---: |
| Layout/measurement | 11.8620 | 0.5716 | 11.1241 | 12.4904 |
| DB worker duration | 16.2588 | 0.7376 | 15.3335 | 17.1104 |
| Upload through download | 17.3718 | 0.7929 | 16.3350 | 18.2940 |

All5 satisfy60s. Original profiled layout81.727s was one instrumented run;
original full API mean91.6573s was10runs. These are local descriptive observations,
not an SLA or a dedicated-host guarantee. A200ms /proc sampler observed peak
summed RSS476.55MiB across render child and sampled native/subset processes;
shared pages may be counted more than once, short peaks can be missed, and no
matching old memory baseline exists. No total-memory improvement is claimed.

Acceptance proof: every one of the5 PDFs has85pages, identical decompressed page
drawing streams, page boxes, decoded font/image resources and link destinations/
annotations to baseline run01. Thus line positions/wrapping and artwork are
preserved, beyond extracted-text-only checks. PDF metadata/whole-file hashes need
not match. All jobs succeeded with the existing low-resolution image warnings;
second download410 and empty output/render-temp directories passed each time.
After jobs the container process list contained only the API server, no shapers.

Core Linux build464 tests/59files PASS, including cache isolation/eviction,
Unicode/concurrent transport, malformed response, timeout, cancellation, process
exit and engine-session cleanup. Native check compares16 complete raw one-shot
and persistent responses across four fonts and checks invalid/truncated frames
and EOF. Service image build, tarball checksum and real API consumption PASS.
No DB/schema change; no new migration or broad database-suite rerun claimed.
Development branches fast-forwarded unchanged, so passing proof reused.

Evidence: Core artifacts/performance-0210 (tarball/build logs); Service
artifacts/srs-performance-cache and artifacts/srs-performance-session
(summary.json, verify.py, repeated-results.json, run-01..05 PDFs/API/stage records,
memory.json, stage wrappers, inputs and runner). Guides describe the new runtime.
Only current-task Docker containers/volumes/images, temporary credentials and
clean merged task worktrees/branches removed; evidence retained. The failed
new-network attempt was resolved by reusing this task's existing Docker project;
its unused volume was also removed. No unrelated Docker state was pruned.
Stop optimization here: requested timing and geometry criteria pass. Further
memory/concurrency/large-book work remains a separate scope.

#### Memory and parallel-render capacity trial — 2026-10-11

Owner approved measurement of one job, followed by1/2/4 simultaneous renders;
release explicitly excluded. Bounded inline discovery/evidence review owned by
Service, using unchanged Core0.2.10 c35c9cc and Service0.2.10 55e1a60. Execution
IDs N/A; routine risk/medium scope. Existing roadmap remains the authority.
Proof budget:5 complete API jobs, then3 waves each at1/2/4 render slots (21jobs),
exact PDF regression, memory/CPU/cleanup observations. Document budget: this
existing record and ignored reproducible trial artifacts, no new Work registry.
No product-source, DB-schema, package-version, worker-setting or release change.

The current processor retains its singleton DB advisory lock and serial loop.
Parallel trials therefore invoke the existing renderPinnedJob pipeline directly,
with the exact template/prepared document and images captured from a bootstrap
API job. Images are preprepared; admission, queue, DB and image-preparation
concurrency are excluded. A temporary capture copy was mounted only for bootstrap;
all measured runs verify the installed render.js equals the unmodified original.
No shared shaper/cache or new production worker mechanism was introduced.

Same explicit budget at every level: API/render container4 CPU,4GiB RAM,no swap;
DB1 CPU,512MiB,no swap. Docker host reports20 CPUs and8,169,631,744 bytes RAM;
this is not dedicated hardware. Container memory.current, memory.stat, CPU quota
counters and process RSS sampled about200ms; DB Docker stats sampled separately.
Working set here = memory.current - inactive_file. Peaks are observed samples,
not exact lifetime maxima. Aggregate cgroup memory avoids summing shared RSS.

Five sequential actual API jobs (17uploads each) succeeded. Mean upload-through-
download17.398s, sample SD2.069s, min15.744/max20.914; mean DB worker16.174s.
Peak API/render working set831.30MiB. Working set two seconds after each job:
177.11,225.59,270.10,305.37,307.88MiB. API RSS increased initially; memory later
fell from352.70 to219.17MiB during parallel trials without restarting the API.
This shows memory was reclaimed in this run, not proof of leak freedom or a
long-duration steady state. Render/shaper processes were absent after every wave.
DB observed peak83.96MiB, separate from the API/render values; DB OOM events zero.

| Concurrent render slots | Jobs / waves | Mean seconds per job | Documents/minute | Peak working set MiB |
| --- | --- | ---: | ---: | ---: |
| 1 | 3 / 3 | 14.130 | 4.222 | 806.38 |
| 2 | 6 / 3 | 14.645 | 8.145 | 1256.96 |
| 4 | 12 / 3 | 20.588 | 11.550 | 2040.84 |

Throughput is completed jobs divided by summed active batch duration; upload,
setup, between-wave idle time and prepared-image creation are excluded. Samples
within one parallel wave are correlated; these are descriptive small-sample
results, not an SLA. Observed simultaneous render counts reached1/2/4 as intended.
CPU throttled periods were0/0/613 across the respective three-wave groups: four
slots encounter the4-CPU quota. Four slots gain about42% throughput over two but
increase mean per-job latency about41%. Memory alone is not the observed limit.

Recommendation: use2 concurrent slots as the initial candidate for real queue
integration;4 remains a measured render option for this fixture/budget when
throughput is preferred. Neither is enabled yet. Before enabling, integrate
bounded slots under the existing coordinator and prove queue ownership, shutdown,
resource preparation, output isolation and restart/recovery with real API jobs.
No recommendation beyond4 and no300–700page or mixed-document capacity claim.

All26 measured PDFs have85pages and identical decompressed drawing streams,
page boxes, decoded font/image resources and link annotations/destinations to
accepted SRS baseline. All API second downloads410 and output/render-temp cleanup
passed. No OOM kills; only API server remained at final process inspection.
No source regression suite rerun: candidate unchanged, direct package use and
26-job evidence cover this discovery scope. Evidence:
../flowdoc-service/artifacts/srs-capacity-0210/ (summary.json, measurements.json,
per-wave measurements/PDFs, environment.json, db-samples.json, input hashes,
setup/measurement/verification scripts and build logs). Exact-output verifier
PASS. Task containers, volumes, image, credential and clean detached worktree
removed; inputs/results retained. No unrelated cleanup and release0.2.9 unchanged.

#### Document-cache memory sweep — 2026-10-11

Owner paused worker expansion and approved measurement of cache off/8/16/32MiB,
with unchanged wrapping. Inline discovery/evidence review, Service trial using
unchanged Core0.2.10/Service0.2.10; execution IDs N/A, routine risk/medium scope.
This existing roadmap is the record; no product implementation or release work.
Proof budget:3 complete API jobs per setting (12total), memory/time samples,
exact PDF comparisons, cleanup. No additional agents or synthetic records.

Only the new per-document cache varies. A temporary mounted copy of installed
cacheTextRuntime.js reads the trial budget; off returns the base runtime directly
without cache serialization.8/16/32MiB set maxBytes, retaining8192entry cap and
identical eviction logic. Original per-TextBlock measurement cache and persistent
native font sessions remain unchanged. This is not an all-caches-off experiment.
Production source/default32MiB and packages remain untouched.

Fixed4CPU/4GiB/no-swap API budget, separate1CPU/512MiB DB. Fresh API container for
each measured job, shared isolated test DB. Order0/8/16/32,32/16/8/0,8/32/0/16
reduces order bias; host is not dedicated. Every job uploads the same17images and
uses the same85-page SRS inputs. Working set sampled about200ms as memory.current
minus inactive_file, including API/render/test observer but excluding DB. Cache
budget denotes serialized key/value payload, not total heap or RSS.

| Cache MiB | API seconds mean (sample SD) | Worker seconds mean | Mean of per-run peak MiB | Highest observed MiB |
| --- | ---: | ---: | ---: | ---: |
| Off | 17.557 (0.277) | 16.286 | 539.70 | 550.82 |
| 8 | 17.729 (1.104) | 16.522 | 615.22 | 618.68 |
| 16 | 16.430 (0.790) | 15.492 | 638.96 | 653.87 |
| 32 | 16.795 (1.305) | 15.800 | 665.52 | 674.18 |

Off reduced mean per-run peak working set125.82MiB (18.91%) relative to32MiB;
observed API mean increased0.762s. All whole-API times below19s, within the60s
budget. Three samples/setting are insufficient to confidently rank timing;
16MiB's lowest sample mean is not proof it is universally fastest. Memory
separation is clearer in this fixture. Secondary mean peak summed render/native
RSS388.58/477.08/493.68/515.20MiB; shared RSS may be counted more than once.
No heap allocation profile separates retained cache payload from allocation/GC
or other effects, so the125.82MiB delta is not claimed as live cache bytes.

Recommendation for this SRS workload: bypassing the added document cache is a
promising lower-memory candidate while preserving persistent shaping. Do not
infer that every document benefits: repetition patterns and larger workloads
remain untested. No actual default has been changed. Remaining ~540MiB sampled
whole-container peak shows other allocations still matter; their cause is not
established by this sweep. Worker work remains deferred.

All12 PDFs exactly match85page baseline drawing streams, page boxes, decoded
font/image resources and link annotations/destinations. All jobs succeeded,
second download410, empty output/render-temp storage, no OOM kills and no
render/shaper processes after completion. Exact-output verifier PASS. No source
suite rerun because product candidate unchanged. Evidence:
../flowdoc-service/artifacts/srs-cache-sweep/ (summary.json, per-run measurements,
PDFs, original/trial cache modules, scripts, environment and build/setup logs).
Task containers/volumes/image/credential removed; evidence retained. Both product
repositories remain clean at previous commits; release0.2.9 unchanged.

#### RAM attribution by pipeline stage — 2026-10-11

Owner approved measurement before choosing further fixes; preserve wrapping and
exclude release. Inline discovery, Service-owned trial with Core observations;
active role Evidence Reviewer, execution IDs N/A, routine risk/bounded scope.
Authority remains this roadmap and the explicit request. Proof budget: six full
API jobs (cache off/32MiB, three each), boundary memory marks and existing200ms
sampler, exact PDF equivalence, scoped cleanup. Document budget: this record and
ignored reproducible artifacts. No product-source/default/package/DB changes.
Existing candidate Core c35c9cc / Service55e1a60 and release0.2.9 remain unchanged.

Fresh API container each job,4CPU/4GiB/no swap; separate1CPU/512MiB DB. Same85page
SRS,17images, order off/32,32/off,off/32. Temporary mounted installed-JS copies add
only observations before/after pipeline boundaries; stripping observations
reproduces original token content. Cache bypass is the same experimental setting
as the prior sweep, not a production default. No forced GC, heap snapshot, global
shaper pool, new worker, wrap or document change. Boundary marks record Node RSS,
heapUsed/heapTotal/external/arrayBuffers and cgroup working set. External observer
samples cgroup and per-process RSS during synchronous work as well.

Mean of per-run observed stage peaks, MiB (container working set, including API,
render and observer, excluding DB; columns are NOT allocations exclusive to each
stage and must not be added):

| Stage | Cache off | Cache32MiB |
| --- | ---: | ---: |
| Prepare image resources in API | 207.8 | 212.6 |
| Decode prepared images in render child | 243.1 | 235.4 |
| Validate/snapshot document and images | 290.3 | 283.9 |
| Layout and text measurement | 411.4 | 503.3 |
| Resolve contents/page fields/links | 413.6 | 504.6 |
| Font subsetting | 535.5 | 635.5 |
| Write PDF | 536.6 | 600.5 |

Overall sampled peaks average545.35MiB off /635.48MiB32, ranges530.46–562.56 /
610.97–670.60. The overall sampled maximum lands in subsetting in5/6jobs and PDF
writing in1/6. API duration averages17.820s /17.734s (sample SD0.263/1.219), worker
16.399/16.795s. Small samples plus observation overhead do not establish a speed
ranking; this trial attributes memory stages, not a new timing SLA.

Observations: off-cache render RSS grows from144.5MiB at layout entry to257.9MiB
at exit;32MiB cache grows144.4 to352.6MiB. These are RSS footprints, not retained
live-object measurements. Image decode grows render RSS only about5.5–5.7MiB in
this fixture; this does not cover image-heavy books. Snapshot-stage RSS growth
about44MiB includes validation and copies, not a measured clone-only cost.

Source-supported next candidate: subsetFonts serializes all paintCommands from
the whole book into request.json, then starts Python separately for each used
font. fontSubset.py loads the complete JSON before filtering commands by fontId
and collecting glyph IDs. Thus full drawing objects overlap with serialization
and Python's decoded objects. At subset-peaking samples, Python RSS is about
95–104MiB while native shapers are about6MiB combined. This makes a compact
font/glyph-ID handoff worth a separately scoped trial before changing wrapping.
It does not prove all Python RSS is avoidable: fontTools and font data contribute.
The writer also retains resolved glyph runs and serializes draw for fingerprint;
its independent contribution and the layout's live-object retention remain
unprofiled. Do not label allocated-but-unused heap/RSS a leak or promise a byte
reduction. No optimization implemented in this measurement scope.

Acceptance: all6PDFs have85pages and identical decompressed page drawing streams,
page boxes, decoded font/image resources and annotations/destinations to accepted
baseline. Thus wrap and positioning remain exact, beyond text-only comparisons.
All jobs succeeded; second download410, empty output/render-temp paths, no OOM or
remaining render/shaper child. Instrumentation-only checker and exact verifier
PASS. Product regression suites not rerun because candidate remains unchanged;
actual installed-package API jobs cover this discovery boundary.200ms sampling can
miss brief peaks; boundary observations supplement it but are not allocation
ownership or heap-retention proof.300–700pages and concurrent workers stay deferred.

Evidence: ../flowdoc-service/artifacts/srs-ram-stages/ (summary.json,
stage-summary.json, per-run stages.ndjson and measurement.json/PDF, original and
instrumented modules, fontSubset-observed.py, setup/run/analyze/verification and
instrumentation-check scripts, environment.json). Task Docker containers, networks,
volumes, image and temporary credential removed; evidence retained. No worktree
created or unrelated cleanup. Existing roadmap only; no map promotion.
