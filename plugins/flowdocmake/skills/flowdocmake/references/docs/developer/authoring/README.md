# FlowDoc Document Authoring — Developer Documentation

## Authority Boundary

เจ้าของเอกสาร: FlowDoc Project Control; บทบาท Documentation Synthesizer.
ขอบเขต: เอกสารอ้างอิงสำหรับผู้เขียน Template และผู้เรียก authoring API ของ
FlowDocMake0.3.0 กับ baseline Service0.5.0/Core0.5.0 ที่บันทึกไว้ ไม่ใช่การรับรองความพร้อมของ FlowDoc ทุกระบบ.
Core เป็นเจ้าของ schema/validation/layout; Service เป็นเจ้าของ storage/transport.
งานนี้เป็น single-room ตามคำขอผู้ใช้; execution/Phase/Checklist IDs ไม่เกี่ยวข้อง.
ไม่เปลี่ยน runtime, template ของผู้ใช้, ข้อมูลต้นทาง หรือ publish.

Baseline ชุดติดตั้งที่บันทึกไว้: `nodeModelVersion:18/19`, `schemaVersion:1/2`,
FlowDocMake `0.3.0`, Service `0.5.0` และ `@flowdoc/core@0.5.0`;
ต้องผ่าน preflight ของ package/runtime จริง. ตัวอย่าง Area18 เดิมยังเป็น model18
ไม่ใช่ตัวอย่าง Section19. อ่าน [แหล่งอ้างอิงและผลตรวจ](verification.md)
โดยแยกผลตรวจในอดีตออกจากรุ่นปัจจุบัน.

Section19 Stage3 รองรับคู่กับ18ในชุดปัจจุบัน (เริ่มใน candidate `0.4.2-dev.3`):
อ่านข้อยกเว้นสั้นที่ต้น [โครงสร้าง/ข้อมูล](structure-and-data.md) และ
[API](api.md) เฉพาะเมื่อ contract ประกาศ `sectionInstances.stage:3`, `scopedToc:true`.
TOC ของ19ต้องระบุ scope;18คงเดิม. การแก้คู่มือไม่เปลี่ยนรุ่นที่ติดตั้ง.

## คู่รุ่น candidate กับชุดที่ติดตั้งอยู่

ชุดพัฒนาใหม่: Service/Core0.5.2 เพิ่มชื่อไฟล์เริ่มต้น `defaultFileName` และ
ชื่อแทนที่จาก API `fileName` ตาม [API](api.md#ชื่อไฟล์ใน-servicecore-development052)
Core มี Model20 แบบทดลองสำหรับการเรียก Section ซ้ำผ่าน Core โดยตรง;
Service0.5.2 ยังรับ18/19 จึงไม่ใช้ request20 กับ Service/MCP ปัจจุบัน
ชุดติดตั้งและ FlowDocMake0.3.0/profile0.5.0 ยังคงเดิม ต้องเตรียมและตรวจ
compatibility ของ plugin แยกก่อนออกรุ่น/ติดตั้งใหม่ การรวมกิ่งพัฒนาไม่ใช่ release

สไตล์เส้นร่วม/ขอบตารางแต่ละด้านและแบบ B ของ0.5.1 ยังคงอยู่ใน0.5.2 อ่าน
[Node reference](nodes.md#รูปแบบเส้นในชุดพัฒนา052) สำหรับค่าที่รับและข้อจำกัด DOCX
และ [สถานะก่อน release](verification.md#052-documentation-checkpoint--2026-10-27)
ก่อนสรุปว่าคู่รุ่นใหม่พร้อมเผยแพร่ อย่าขยายความสามารถของ baseline0.5.0 ตาม
คู่มือชุดพัฒนาโดยไม่ตรวจ target

ชุด0.5.0 รวม DOCX/fidelity, เซลล์รวม, `borderStyle:none`, Area สุดท้ายชิดท้าย
และการปรับขอบเซลล์โดยไม่เปลี่ยน line height. รุ่นติดตั้งเดิมไม่เปลี่ยนตามคู่มือนี้.
ตรวจ archive/hash/source และ live contract ก่อนใช้. PDF/DOCX ใช้ source เดียวกัน;
ผล source-layout ใน Word ที่แก้ข้อความ/ฟอนต์อาจต้องสร้างใหม่เพื่อคืน fidelity.
ดู [หลักฐานและข้อจำกัด](verification.md) และ [API DOCX](api.md#docx-development-transport).
Core API อยู่ใน [template guide](../../../../flowdoc-core/docs/template-guide.md).

## อ่านจากตรงไหน

เริ่มจาก [ทางเข้าแบบอ่านตามช่วง](workflow-start.md) แล้วเปิดเฉพาะหัวข้อของช่วงที่ทำ.
หน้านี้เป็นสารบัญอ้างอิงตอนเลือกสัญญาที่ต้องใช้ ไม่ใช่รายการให้อ่านทุกบทก่อนเริ่ม.

คู่มือเลือกใช้แบ่งเป็นสามชั้น:

1. **หลักร่วม** — [การถอดแบบ](reference-mapping.md) และ reference ด้านล่าง:
   ข้อมูล หน่วย การจัดแนว ภาพ และเกณฑ์ตรวจ ใช้ร่วมทุกหมวด.
2. **ลักษณะเอกสาร** — [แบบฟอร์ม/ข้อจำกัด](reference-mapping.md#2-เลือกหมวดตามลักษณะการจัดหน้า) หรือ [เนื้อหาไหล](document-families/flowing-book.md).
   เลือกตามพฤติกรรมการจัดหน้า ไม่เลือกจากชื่อ SRS/สัญญา/รายงานอย่างเดียว.
3. **กรณีที่พบ** — อยู่ภายในหมวด: สิ่งที่เห็น → วิธีเลือก → เหตุผล/เกณฑ์ตรวจ;
   เปิดสัญญารายละเอียดจากลิงก์เฉพาะเรื่อง ไม่คัด reference ซ้ำ.

แบบฟอร์มอยู่ใน mapping เดิม ไม่เพิ่มไฟล์บังคับอ่าน. เพิ่มกรณีเมื่อกฎต่างจริง;
ถ้าต่างเพียงชื่อให้ใช้กรณีเดิม. แนวทางไม่ใช่หลักฐานว่ารองรับทุกความสามารถ.

| ต้องการทำอะไร | เอกสาร |
| --- | --- |
| อ่านต้นแบบแล้วเลือกโครง รักษาเส้น กรอบ ภาพ และข้อมูล | [แนวทางถอดแบบ](reference-mapping.md) |
| ตรวจทุกส่วนจาก PDF ก่อนเลือกโครงเก่า และเก็บหลักฐานเทียบก่อนส่งงาน | [Source-first coverage](reference-coverage.md) |
| เลือก draft ใหม่/ซ่อม ID เดิม/ทดแทนเมื่ออนุญาต และใช้ tool ทำ preview ต่อเนื่อง | [Draft selection และ workflow tool](draft-selection.md) |
| เข้าใจโครงทั้งเล่มและประกาศ Section/Area/Format | [โครงสร้างและตัวแปร](structure-and-data.md) |
| เลือก node และ property ที่เขียนได้ | [Node reference](nodes.md) |
| คำนวณพื้นที่ ตาราง ภาพ หัวท้าย และเลขหน้า | [Layout reference](layout.md) |
| ทำสารบัญ ลิงก์ และข้อมูลซ้ำเป็นกลุ่ม | [สารบัญและข้อมูลซ้ำ](contents-and-repetition.md) |
| สร้าง ID แก้ draft upload validate preview และรับ PDF | [API และเครื่องมือ](api.md) |
| เริ่มจากไฟล์ที่รันทดสอบได้ | [ตัวอย่างและเกณฑ์ตรวจ](examples.md) |
| ตรวจที่มาของข้อกำหนดและข้อจำกัด | [หลักฐานและ coverage](verification.md) |

คู่มือขั้นตอนถอดแบบ PDF อยู่ที่
[AI template authoring guide](../../domains/flowdoc-ai-template-authoring-guide.md).
เอกสารชุดนี้อธิบายสัญญาที่คู่มือขั้นตอนใช้อ้างอิง ไม่ต้องโหลดทุกบทเมื่อแก้เพียงเรื่องเดียว.

## กติกาการอ่าน reference

- **Required** หมายถึงต้องระบุ ไม่มีค่าเริ่มต้นให้เดา.
- **Optional** หมายถึงละได้; ตารางจะบอกผลเมื่อละ. Optional ไม่ได้แปลว่ารับ `null`.
- ตัวอย่าง JSON เฉพาะส่วนเป็น fragment ที่ต้องใส่ในตำแหน่งที่ระบุ;
  ไฟล์ตัวอย่างเต็มใน examples เป็น definition/request ที่ตรวจได้.
- ใช้ JSON object/array จริง ไม่ส่ง JSON ทั้งก้อนเป็น string ในช่อง `definition`.
- ฟิลด์นอกสัญญามักถูกปฏิเสธ; field ข้อมูลที่ไม่ประกาศอาจเป็น warning และถูกละเลย.
- TypeScript union มีชนิดของรุ่นเก่ารวมอยู่ด้วย ต้องยึดข้อจำกัดของ model18/19 ที่เลือกและ validator
  ตามตำแหน่ง ไม่คัด property จาก resolved document กลับมาเป็น template.
- Validate โครง ≠ compose ข้อมูล ≠ จัดหน้า PDF ≠ ตรงต้นแบบ.
  ต้องผ่านแต่ละชั้นที่เกี่ยวข้อง; ไม่มี warning ไม่ใช่หลักฐานว่าไม่ตกเนื้อหา.

## เส้นทางข้อมูล

```mermaid
flowchart LR
  T[Template definition] --> V[validateTemplate]
  R[Generation request] --> P[prepareGeneration]
  V --> P
  P --> C[composeDocument]
  C --> L[Layout and PDF]
  L --> Q[ตรวจข้อความ ภาพ เลขหน้า และลิงก์]
```

Template ประกาศกฎและตำแหน่ง; Request ส่งค่าและเลือก Format ที่ประกาศไว้.
PreparedInput/ResolvedDocument เป็นผลภายใน ไม่ใช่ payload ที่ผู้ใช้ต้องเขียนเอง.
การแก้ข้อมูลไม่ควรต้องเพิ่ม node ต่อรายการ; ใช้ array/repeats/rowGroups ตามความหมาย.

## การรักษาเอกสารนี้

เมื่อเพิ่ม property หรือ node ต้องแก้บทอ้างอิง ตัวอย่าง และ coverage พร้อมกัน.
ระบุชนิด ค่าเริ่มต้น ขอบเขตตำแหน่ง และ failure ที่คาดได้ ไม่เขียนเพียงชื่อ feature.
หากยังไม่ตรวจ runtime ให้ระบุชัดว่าเป็น source inspection ไม่ใช่ render PASS.
ตัวอย่างที่ทำงานได้แต่ไม่ใช้ความสามารถที่ตั้งใจ เช่นสารบัญเป็นตารางข้อความ
ไม่ถือว่าผ่าน acceptance ของ feature นั้น.
