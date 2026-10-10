# FlowDoc — R2 ปก กล่องจองพื้นที่ และหน้าเปล่า

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Cross-Repo Boundary Reviewer.
Status: design implemented and accepted in development 0.1.10, 2026-10-10.
Implementation evidence and limitations: [R2 accepted delivery](flowdoc-page-system-r2-plan-2026-10-10.md#accepted-delivery--2026-10-10).
This design remains a contract, not release approval.
ต่อจาก [Roadmap](flowdoc-page-system-roadmap-2026-10-10.md) และ
[R0 contract](flowdoc-page-system-r0-contract-2026-10-10.md).
คำขอรอบนี้คือไปต่อหลังรับ R1; ข้อตกลงปกและ fixed-height เดิมคงไว้
เจ้าของยืนยันว่าข้อมูลบนปกไม่เข้าสารบัญ แล้วตอบ ok ให้เร่งไปต่อ
ใช้ร่างนี้เป็นฐานแผนลงมือ; ยังไม่ใช่ผลทดสอบหรือการอนุมัติ release

งาน inline ไม่มี registered execution; Work/Phase/Checklist IDs ไม่ applicable.
ขนาด bounded cross-repository design, risk routine. Core owns validation,
composition, layout and PDF; Service owns storage/package/API integration.
รอบออกแบบแก้เฉพาะเอกสารนี้กับ pointer ใน roadmap ไม่แก้ runtime/release/map.
Document budget สองไฟล์; proof budget ตรวจโค้ดที่เกี่ยวข้อง ความสอดคล้องกับ R0,
links/diff และ check:data. Current Truth Snapshot เกี่ยวกับ frontend เก่า;
งาน export นี้ใช้ page-system roadmap ปัจจุบัน ไม่เปิด execution frontend กลับมา

ฐานที่ตรวจแบบ read-only: Core7134894 และ Service27e7a3b รุ่นพัฒนา0.1.9
ทั้งสอง checkout สะอาด; release0.1.8 คงเดิม ตามผลรับ R1 ใน roadmap.
ยังไม่เลือกหรือเปลี่ยนโมเดล/สร้างห้อง WORK สำหรับ implementation ในรอบออกแบบนี้

## ผลที่ต้องได้

ผู้สร้างแม่แบบกำหนดปกหน้าเดียว ใส่ตัวแปรได้ และจองความสูงของ TextBlock
ชื่อโครงการยาวขึ้นภายในกรอบแล้วข้อความถัดไปต้องอยู่ตำแหน่งเดิม
เกินกรอบหรือรวมทั้งปกเกินหน้าให้หยุดพร้อมจุดผิดพลาด ไม่ตัด/ย่อ/ดันไปหน้าอื่น
หน้าเปล่าที่ตั้งใจแทรกเป็นคำสั่งชัดเจน; ส่วนข้อมูลว่างยังถูกข้ามตาม R1
ผู้เรียก API ยังส่ง data/content ตามเดิม ไม่ส่ง node หรือคำสั่งจัดหน้า

## แนวทางที่เลือกเสนอ

ใช้ section เดิมเพิ่มบทบาท cover และ source แบบ blank เพราะมีขอบหน้าและ ID
อยู่แล้ว ไม่เพิ่ม node page-break ลง cell/Area ที่ทำให้การแบ่งหน้าได้หลายความหมาย
อีกทางคือเพิ่ม page-break node แต่เกินความจำเป็นของ R2; อีกทางคือใช้ TextBlock
ว่างเติมหน้า ซึ่งแยกคำสั่งหน้าเปล่าจากข้อมูลว่างไม่ได้ จึงไม่เลือกสองทางนั้น

ใช้ nodeModelVersion13 สำหรับสัญญาใหม่ ส่วน4–12 คงกติกาเดิม ไม่เปลี่ยน
snapshot เก่าอัตโนมัติ การยกระดับแม่แบบเป็นความตั้งใจของผู้สร้าง
model13 รับรูปแบบหน้า/sections แบบ12 และเพิ่มเฉพาะกติกาด้านล่าง
รุ่น package จะเพิ่มเมื่อผ่านงานจริง ไม่เพิ่มเพราะเอกสารออกแบบเสร็จ

## สัญญาปกและหน้าเปล่า

- section.role ไม่ส่งหมายถึง body; ค่าใหม่ cover มีได้หนึ่งส่วนและต้องเป็น
  section แรกในรายการ ไม่อาศัยการข้ามส่วนว่างก่อนหน้าเพื่อให้กลายเป็นปก
- cover ใช้ source.kind authored เท่านั้น อ่าน global variables ตามเดิม
  รองรับ node เดิมที่วางได้ภายใต้การจำกัดหนึ่งหน้า ไม่เปิด nested section
- cover ที่ประกอบแล้วไม่มี root ยังสร้างหนึ่งหน้าปก เพราะประกาศบทบาทชัดเจน
  ต่างจาก body ว่างที่ข้าม; required/type error ยังคงหยุดก่อน composition
- source.kind blank ไม่มี fragment/repeats/content สร้างหนึ่งหน้าตาม pageLayout
  ต่อหนึ่ง section ใช้ role body เท่านั้น ใส่ต้น/กลาง/ท้ายได้ ถ้ามี cover ต้องอยู่หลัง cover
- blank หลายส่วนติดกันให้หลายหน้าตามที่ประกาศ ไม่รวมทิ้ง หน้าที่ไม่มี node
  แต่มีคำสั่ง cover/blank ชัดเจนไม่นับเป็น EMPTY_CONTENT
- เริ่มส่วนเนื้อหาใช้กฎ R1: ส่วนไม่ว่างเริ่มหน้าใหม่เสมอ ไม่เพิ่มหน้าเปล่าแถม
  เมื่อส่วนก่อนหน้าจบพอดีหน้า ไม่เพิ่มคำสั่งขึ้นหน้าใหม่ระดับ node ในรอบนี้

ตัวอย่างเฉพาะ sections ไม่ใช่แม่แบบเต็ม:

```json
[
  {"id":"cover","role":"cover","source":{"kind":"authored","repeats":[],"fragment":{"rootIds":[],"nodes":{}}}},
  {"id":"intentional-blank","source":{"kind":"blank"}},
  {"id":"body","source":{"kind":"content"}}
]
```

ตัวอย่างนี้ใช้ปกว่างเพื่อแสดงคำสั่งสร้างหน้าโดยตรง; fixture ที่ลงทะเบียนจริง
ต้องมีแม่แบบครบพร้อม styles/schema และผ่าน validator ไม่ใช้ตัวอย่างย่อนี้เป็น proof

## กล่องความสูงคงที่

TextBlock.props.heightMode ไม่ส่งหรือ content ใช้การวัดตามเนื้อหาเดิม
heightMode fixed ต้องมี height เป็น Length >0 mm/pt และ verticalAlign optional
top(default)/center/bottom. height และ verticalAlign ไม่รับเมื่อเป็น content
ตัวอย่าง props: textStyleId body, heightMode fixed, height {value:30,unit:mm}

รับเฉพาะ TextBlock ที่ผู้สร้างวางเป็น root โดยตรงใน authored cover fragment
ไม่รับใน formats, Area formats, table cells หรือ body section แม้หลัง expansion
จะกลายเป็น root บนปกก็ตาม ตรวจทั้งแม่แบบและ resolved input เพื่อกันหลุดขอบเขต

ความสูงรวมพื้นที่จองทั้งหมด ไม่มี padding ใหม่ ความกว้างเต็มพื้นที่พิมพ์ของปก
วัดข้อความจริงทั้งหมดครั้งเดียวต่อกล่องแล้ววางด้วยผลวัดชุดนั้น ตรวจ line boxes
และ ink containment ตาม text runtime เดิม ไม่แทนด้วยการนับจำนวนตัวอักษร
offset แนวตั้งเป็น 0 / ครึ่งพื้นที่เหลือ / พื้นที่เหลือ ตาม top/center/bottom
node ถัดไปเริ่มหลังความสูงที่จอง ไม่ใช่หลังความสูงข้อความ

ข้อความว่างที่ไม่มี ink และไม่มี explicit line-break ยังจองกล่องเต็มและไม่บังคับ
ให้กล่องสูงเท่าหนึ่งบรรทัดขั้นต่ำ; explicit line-break ยังคงใช้พื้นที่บรรทัดตามเดิม
เกินกล่องแจ้ง LAYOUT_FAILED พร้อม source section/node/path
ผลรวมทั้งปกต้องอยู่ในพื้นที่พิมพ์ รวมตาราง ภาพ และกล่องที่ไม่มีข้อความด้วย

## ขอบเขตเลขหน้าและสารบัญที่ต้องเชื่อม

R1 appendPageNumbers และ fillContentsNumbers อ่าน physical index +1 ทั้งคู่
การซ่อนเลขปกอย่างเดียวจึงไม่เพียงพอกับข้อตกลงปกไม่นับเลข
เสนอให้ R2 เพิ่มข้อมูลลำดับสำหรับการนับขั้นพื้นฐาน: cover ไม่นับ/ไม่แสดงเลข;
ทุกหน้าที่เหลือรวม blank นับต่อจาก1. Blank ไม่วาดเลขให้เป็นหน้าเปล่าจริงใน R2
เป็นข้อเสนอเฉพาะหน้าเปล่า ยังไม่ล็อกระบบหัวท้าย R3 แทนผู้ใช้

เลขท้ายหน้าชั่วคราวยังเกิดเฉพาะเมื่อมี TOC ตามทางเดิม แต่ใช้เลขนับใหม่ร่วมกับ
เลขใน TOC เพื่อไม่ส่ง PDF ที่สองตำแหน่งขัดกัน ลิงก์/anchor ใช้ physical pageIndex
เสมอ ไม่ใช้เลขแสดงเป็น identity. ไม่เพิ่มเลขโรมัน restart หรือ total pages ใน R2
ตัวเลือกเลขหน้าเต็มรูปแบบยังอยู่ R4 และ TOC policies เต็มรูปแบบยังอยู่ R5

หัวข้อบน cover ไม่เข้า TOC อัตโนมัติใน model13 เพราะไม่มีเลขนับ แต่ explicit
reference ไป anchor บนปกยังทำงานตามหน้าจริง ต้องตรวจการเก็บหัวข้อแยกจาก anchor
model4–12 ต้องรักษา TOC/เลขเดิม นี่เป็นส่วนเชื่อมขั้นต่ำสำหรับปก ไม่ถือว่า R4/R5 ปิดแล้ว

## เส้นทางโค้ดและข้อควรระวังที่พบ

- Core template/pageSections.ts และ types.ts ปัจจุบันรองรับ12แบบระบุเลขตรง ๆ
  ต้องทบทวน gates ทุกจุดที่ใช้12 ไม่เปลี่ยนเป็น >=12 โดยไม่ดู semantics
- composition/composeSections.ts มี source สองทาง; blank ต้องมีทางของตัวเอง
  ห้ามส่งเข้า expandRows แบบ authored โดยไม่มี fragment
- resolved sections เก็บ page/rootIds; เพิ่ม role/source kind ที่เพียงพอสำหรับ
  validation และ layout ของหน้าไม่มี root โดยไม่มี sourceMap node ปลอม
- layout/documentFlow.ts ข้ามทุก section rootIds ว่างในปัจจุบัน ต้องแยก
  body ว่างจาก cover/blank และปฏิเสธ nextPage ภายใน cover พร้อมต้นทางจริง
- layout/measureText.ts ตรวจ ascent/descent ต่อ line และ horizontal ink อยู่แล้ว
  ใช้ผลนี้ต่อสำหรับ fixed box; ไม่เพิ่ม text shaping engine หรือเปลี่ยน wrap
- layout/pageNumbers.ts, fillContentsNumbers.ts และ composition/contents.ts
  ต้องแชร์ข้อมูลเลขที่นับและบทบาทหน้า แต่ไม่แก้ตำแหน่ง anchor ให้เป็นเลขนับ
- Service เก็บ metadata ใน payload เดิม คาดว่าไม่ต้อง migration แต่ต้องพิสูจน์
  save/publish/load และ snapshot เดิมด้วย DB ทดลองแยก ไม่ถือว่าคาดการณ์คือผลผ่าน

## การตรวจรับที่ต้องมีในแผนลงมือ

1. ปกแรก/ปกซ้ำ/ปกผิดตำแหน่ง/ชนิด source ผิด, blank refs และ model12 reject fields ใหม่
2. กล่องชื่อ1บรรทัด/หลายบรรทัด/พอดี/เกิน พร้อมตำแหน่ง node ถัดไปเท่ากันเมื่อผ่าน
   top/center/bottom, ว่าง, line-break, mm/pt, ค่าผิดและใช้ fixed ผิดบริเวณ
3. แต่ละกล่องพอดีแต่รวมปกล้น, ภาพ/ตารางขอหน้าต่อบนปกต้อง error โดยไม่คืน PDF สำเร็จ
4. หน้า blank ต้น/กลาง/ท้าย/ติดกัน, body ว่าง, ก่อนหน้าจบพอดี, ตาราง/ภาพหลายหน้า
   เนื้อหา/ต้นทางไม่หายหรือซ้ำ ไม่วัดเพียงจำนวนหน้า
5. cover→TOC→body: ปกไม่เลข, หน้าแรกหลังปกเลข1, TOC label กับท้ายหน้าตรงกัน
   ลิงก์ยังไปหน้าจริงถูก; blank ถูกนับแต่ไม่มีหมึก; regression model12 unchanged
6. packed Linux consumer และ PDF ตัวอย่างตรวจด้วยตา; Service API ใช้ artifact เดียวกัน
   ตรวจข้อมูลจริงที่ทำให้ปกล้น พร้อม job diagnostic, storage round-trip และ old snapshot

งานค้าง migration004 test ที่พบใน R1 เป็นข้อจำกัดฐานเดิม ต้องรายงานแยก
ไม่ใช้มันเป็นเหตุให้ข้าม tests ที่เกี่ยวข้องกับ R2 และไม่ซ่อม migration นอกขอบเขตนี้

## จุดรับก่อนแผนลงมือ

ข้อตกลงปกหน้าเดียว/overflow/fixed root TextBlock รับไว้แล้ว ไม่ขอเลือกซ้ำ
ข้อเสนอใหม่ที่ต้องให้เห็นชัด: model13, cover ว่างยังสร้างหน้า,
blank หนึ่ง section ต่อหนึ่งหน้าและนับแต่ไม่พิมพ์เลข, bridge เลข/TOC และตัดหัวข้อปก
ออกจาก TOC อัตโนมัติ เพื่อให้ปกใช้ได้โดยไม่ส่งเลขที่ขัดกันระหว่างพาร์ต
หลังรับร่างนี้จึงแตก implementation tasks และเริ่มพัฒนาใน worktree ที่แยกจากฐาน
ยังไม่เพิ่ม header/footer, DOCX, front-end, fixed cells หรือ release promotion
