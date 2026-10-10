# FlowDoc R4 — เลขหน้าที่ระบบเติมในแม่แบบ

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Status: written design approved by owner; implementation plan for review, not implemented.
Authority: เจ้าของให้เริ่มร่างหลังยืนยันว่า current/total ไม่ต้องส่งผ่าน API.
Scope: R4 under [page-system roadmap](flowdoc-page-system-roadmap-2026-10-10.md).
Bases inspected: Core b0657ee / Service6729964, development0.1.12; release0.1.8 untouched.
Inline design work, medium size/routine risk; execution IDs not applicable.
Document budget: this design and existing roadmap. No product code/map changes.
Proof now: source inspection, contract consistency, local links, diff/check:data.
Future implementation owner: Core; Service verifies package/storage/API boundaries.
New registered PLAN/WORK is not opened by this document.

## เป้าหมายที่เจ้าของรับแล้ว

ผู้สร้างแม่แบบกำหนดการนับและวางตัวแปรของระบบใน TextBlock ของหัว–ท้าย.
คนเรียก API ส่งเพียงข้อมูลเอกสารเหมือนเดิม ไม่ส่ง current/total และไม่ต้อง
กรอกช่องเหล่านี้ใน inputSchema, header schema หรือ footer schema.

- `page.current`: เลขที่กำหนดให้หน้าปัจจุบันตามการนับของ Section.
- `page.total`: จำนวนหน้าที่ร่วมการนับทั้งเล่ม ไม่ใช่เลขสูงสุดหรือยอดของ Section.
- Section นับต่อเป็นค่าเริ่มต้น; เลือกเริ่มใหม่ด้วยจำนวนเต็มบวกได้ ค่าเริ่มใหม่คือ1.
- ซ่อนเลขแต่ยังนับ กับไม่นับหน้า เป็นคนละกติกา.
- ปกไม่แสดงและไม่นับ. หน้าเปล่าที่แทรกยังนับ แต่ไม่แสดงตามกฎเดิม.
- ไม่วางตัวแปรก็ไม่แสดงเลข แม้มีสารบัญ; มีเลขได้แม้ไม่มีสารบัญ.
- แม่แบบเก่าคงพฤติกรรมเดิมผ่าน model gate ใหม่ ไม่ rewrite snapshots.
- ตัวแปรนี้ใช้หัว–ท้ายก่อน ไม่ขยายไป body/Area/table หรือสูตรคำนวณ.

ตัวอย่างความหมาย (ไม่ใช่ syntax parser จาก string):

```text
หน้า {page.current} จาก {page.total}
```

หาก3หน้าถูกตั้งให้เริ่มเลข10 จะได้ current10,11,12 แต่ total3.
หากสอง Sections มี2และ3หน้าแล้วเริ่มใหม่ทั้งคู่ จะได้1,2 / 1,2,3 และ total5.

## ข้อเสนอทางเทคนิคสำหรับตรวจ

### สัญญาในแม่แบบ

เพิ่ม model16 แยกจาก4–15. ใช้ Section ownership เดิม; ไม่เพิ่ม request fields.
Section มีนโยบายการนับแบบ continue / restart(startAt) / exclude และการแสดง
แบบ show / hide แยกกัน. ชื่อ JSON fields ที่แน่นอนจะล็อกในแผนลงมือ.
continue ต่อจากเลขล่าสุดที่นับ แม้ Section ก่อนหน้า hide หรือ exclude;
exclude ไม่ขยับ counter. หน้าที่นับหน้าแรกเริ่ม1ถ้าไม่มี restart.
ห้าม startAt บน continue/exclude; ห้าม override ปกให้ร่วมการนับหรือแสดงเลข.
เลขเริ่มและผลบวกต้องเป็น safe positive integers; overflow ต้องแจ้งผิดพลาด.

แทน token ด้วยชนิด inline ของระบบโดยเฉพาะ เช่น system-page-field
ที่เลือก current/total ไม่ใช่ field-ref ไปยัง variable schema. JSON syntax
ในข้อนี้เป็นแนวออกแบบ ยังไม่ใช่ exported contract. ข้อความปกติ เช่น ชื่อ:
ยังใช้ literal และ field-ref เดิมได้. system token ไม่เป็นชื่อที่ API ใช้ override.
ค่าข้อมูลชื่อ current/total ของผู้ใช้ถ้ามี schema ของตน ไม่เปลี่ยนเลขระบบ.

### พื้นที่กับการเติมค่าหลังจัดหน้า

ทางเลือก1: ใส่เลขแล้วจัดทั้งเล่มใหม่จนคงที่ — เพิ่มรอบและเสี่ยงวนจาก total เปลี่ยน.
ทางเลือก2 (แนะนำ): จองช่อง inline ความกว้างคงที่ในแม่แบบ แล้วเติมเลขจริงทีหลัง.
ทางเลือก3: ตรึงเลขไว้ล่างขวาเหมือนเดิม — ไม่ตอบโจทย์ผู้สร้างเลือกตำแหน่งเอง.

เลือกทาง2เป็นข้อเสนอ: แต่ละ token มีพื้นที่แนวนอนระบุด้วยหน่วย mm/pt ที่เป็นบวก.
inherit font/line height จาก TextBlock; เลขไม่ wrap ในช่องและชิดขวาภายในช่อง.
ความสูงหัวท้ายต้องวัดรวมช่องนี้ก่อนจัด body. เมื่อได้หน้าทั้งเล่มแล้วจึง
คำนวณ current/total และ shape เลขจริงตาม font ของมัน. ตรวจทั้ง advance และ ink;
ถ้าวางไม่พอให้ fail พร้อม Section/node/field path ไม่ย่อ/ตัด/ปล่อยทับ.
ไม่ใช้จำนวนหลักสมมติเป็นคำรับรองว่าจะพอสำหรับเลขทุกค่า.

band cache เก็บ geometry/token slots ที่ยังไม่เติมค่าเท่านั้น. เติมค่าต่อหน้า
บน commands ใหม่ ไม่แก้ cache ที่แชร์ มิฉะนั้นหน้าถัดไปอาจใช้เลขหน้าแรกซ้ำ.
ไม่เพิ่ม full-document layout pass เพื่อคำนวณ total; traversal นับ O(P),
เติมตามจำนวน token placements และเก็บ geometry ตาม output pages ที่มีอยู่แล้ว.

### การซ่อนและหน้าที่ไม่นับ

ข้อเสนอให้ hide ระงับการวาด TextBlock ที่มี system-page-field ทั้ง block
โดยยังสงวนพื้นที่เดิม เพื่อไม่เหลือคำว่า “หน้า / จาก” ลอยอยู่และไม่เปลี่ยน pagination.
ข้อความอื่นที่ต้องแสดงเสมอควรอยู่คนละ TextBlock. ไม่ซ่อนหัวท้ายทั้งแถบ.
exclude ยังอาจแสดงหัวท้ายปกติ; การวาง current ใน Section exclude ต้อง fail
ตอนตรวจแม่แบบตามที่ตกลง. total อย่างเดียวใช้ได้ถ้าเลือก show.
cover/blank ยังคงไม่วาดหัวท้ายเลยตามกฎเดิม ไม่สร้างพื้นที่แถบใหม่ให้หน้าพิเศษ.

## จุดต่อที่ตรวจจาก implementation ปัจจุบัน

- `src/layout/pageCounting.ts`: เดิมนับทุกหน้าที่ไม่ใช่ cover รวม blank.
- `src/layout/pageNumbers.ts`: เดิมผูกกับการมี TOC และเติมเลขล่างกระดาษอัตโนมัติ.
- `src/layout/pageBands.ts`: วัด/caches glyph commands ของข้อความแล้วใช้ซ้ำ;
  ต้องแยก static commands กับ dynamic slots ก่อนรองรับค่าเปลี่ยนต่อหน้า.
- `src/pdf/createPdfEngine.ts`: layout → destination index → TOC numbers →
  temporary page numbers → fonts/PDF. ต้องเติมเลขระบบก่อน subset/write.
- `src/layout/fillContentsNumbers.ts`: ปัจจุบัน fallback เลข physical เมื่อค่า null;
  ห้ามปล่อยให้ model16 ที่ exclude กลับมีเลขจริงจาก fallback โดยไม่ตั้งใจ.
- Service safe contract คืน schemas จากแม่แบบ; system token ต้องไม่เข้า schemas.
  Sections/payload ปัจจุบันเป็น JSON; ไม่วาง migration ใหม่โดยไม่มีความจำเป็นที่พิสูจน์.

## ขอบเขต R4 กับ R5

R4 เก็บ physical page identity, section identity, current|null และ total แยกกัน.
การเริ่มเลขใหม่ห้ามเปลี่ยน anchor หรือ link destination.
R4 ต้องไม่ส่งมอบ model16 TOC ที่มีเลขผิด: สำหรับ counted pages ใช้ current;
หากหัวข้ออยู่หน้าที่ exclude ให้ diagnostic ชัดเจนเป็น conservative boundary
จน R5 ล็อกวิธีแสดงหัวข้อไม่มีเลข. ไม่ fallback เป็น physical number เงียบ ๆ.
R5 ยังเป็นงานตรวจ/ขยายสารบัญหลายหน้าและกติกาหัวข้อที่ไม่นับโดยเฉพาะ.
เลขโรมัน เลขไทย totalรายSection ตัวแปรใน body หน้าคู่/คี่ และ frontend ไม่อยู่รอบนี้.

## เกณฑ์ตรวจและตัวอย่างที่จะให้เจ้าของดู

| พื้นที่ | หลักฐานที่ต้องได้ก่อนรับ implementation |
| --- | --- |
| Contract | model16รับ tokenเฉพาะหัวท้าย; fieldผิด/widthผิด/currentบนexcludeถูกปฏิเสธ; legacy unchanged |
| Binding/API | contractไม่มี current/total ที่ต้องกรอก; requestเดิมพอ; ข้อมูลผู้ใช้ปลอมค่าเลขระบบไม่ได้ |
| Counting | ต่อข้ามSections, restart, hide, exclude, blank, cover, เลขเริ่ม10, safe integer guard |
| Layout | 9→10,99→100; ช่องแคบ fail; ค่ารายหน้าไม่รั่วผ่าน cache; ไม่มีการจัดทั้งเล่มวน |
| Links/TOC | เลขซ้ำต่างSectionsยังไปจุดหมายเดิม; counted TOCถูก; excluded targetไม่ fallback |
| Storage | import/save/publish/reload คงนโยบายและ tokens; versionเก่าไม่เปลี่ยน |
| Package/PDF | packed Linux consumer + Service pinned artifact; ตัวอย่างทั้งมี/ไม่มี TOC และไม่วาง token |

PDF ตัวอย่าง: ปก → ส่วนแรกนับต่อ → ส่วนที่ซ่อนเลขแต่ยังนับ → หน้าเปล่า →
ส่วนเริ่มใหม่ → ส่วนไม่นับที่ไม่มี current; แสดง total เท่ากันทุกหน้าที่วางไว้.
เจ้าของดูตำแหน่งและลองลิงก์ก่อนรวม development; releaseยังรอ R5/R6.

## Review boundary

เจ้าของรับร่างนี้แล้ว รวมการจองความกว้าง hide ทั้ง TextBlock ที่มี token
และ diagnostic ของ excluded TOC. ยังไม่มี product code เปลี่ยน.
[แผนลงมือ R4](flowdoc-page-system-r4-plan-2026-10-10.md) ระบุ interfaces,
ลำดับงาน RED–GREEN และหลักฐานที่ต้องผ่าน พร้อมให้ตรวจแผนก่อน implementation.
