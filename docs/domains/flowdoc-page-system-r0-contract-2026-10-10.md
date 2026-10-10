# FlowDoc — R0 ข้อสรุปเชิงเทคนิคและขอบเขตลงมือ R1

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Cross-Repo Boundary Reviewer.
Status: technical design derived from owner decisions, 2026-10-10.
Spec: [ร่างระบบหน้า](flowdoc-page-system-draft-2026-10-10.md).
Sequence: [Roadmap R0–R6](flowdoc-page-system-roadmap-2026-10-10.md).
เจ้าของให้ทวนและเริ่มงานหลังตกลงพฤติกรรมแล้ว เอกสารนี้ปิดข้อค้นพบ R0
และเลือกแนวทางเทคนิคสำหรับ R1; ไม่อ้างว่าโค้ดรองรับ model ใหม่แล้ว
ชื่อ field/signature ด้านล่างเป็นสัญญาเป้าหมายของงานใหม่ ต้องอ่านพร้อม spec
ไม่ใช่ contract ของ release0.1.8 และไม่ส่งตัวอย่างนี้เข้า API0.1.8

งาน inline discovery/design; execution IDs ไม่ applicable; risk routine
owner การแก้ต่อคือ Core/Service ตามขอบเขตด้านล่าง ไม่มีการ dispatch ห้องอื่น
proof รอบนี้คือ source inspection, consistency/link/diff review และ check:data
ไม่เปลี่ยน product files หรือ DB ใน R0 และไม่ใช้ design record แทน runtime Evidence
เอกสารนี้จำเป็นเพื่อป้องกันการสร้าง section/Area ซ้ำ การแก้ทางข้อความล้วนตกหล่น
และการใช้ contentIndex ปลอมกับเนื้อหาที่สร้างจากแม่แบบ

## ฐานตรวจและข้อค้นพบ

ตรวจ Core development `e8fa736` และ Service `5bf0620` ซึ่งมี tree เท่ากับ
release0.1.8 ตามบันทึก release ปัจจุบัน ไม่มี product changes ระหว่างการตรวจ

| จุดที่ตรวจจริง | ผลต่อการออกแบบ |
| --- | --- |
| Core src/template/types.ts และ src/composition/resolvedDocument.ts | book.page มีรูปแบบเดียว rootIds เป็นสายเนื้อหาเดียว; sizing รับเพียง content |
| Core src/data/prepareGeneration.ts และ src/composition/validatePreparedInput.ts | รับ docKey/version/data/content; บังคับอย่างน้อยหนึ่ง accepted content จึงต้องมีเงื่อนไข model ใหม่สำหรับส่วนคงที่ |
| Core src/composition/composeDocument.ts | ขยายแต่ละ content ต่อเข้า rootIds; ต้องเพิ่มการประกอบตาม sections โดยไม่เปลี่ยนลำดับภายใน content |
| Core src/template/areas.ts | ตรวจ placement เฉพาะ fragments ใน formats; ต้องรวม authored section fragments โดยยังนับจุดวางเดียว |
| Core src/binding/expandRows.ts และ src/pdf/createPdfEngine.ts | origin ผูกกับ contentIndex/format; เนื้อหาจาก section ต้องมี origin จริง ไม่ใช้ -1 หรือ contentIndex0 ปลอม |
| Core src/layout/documentFlow.ts และ src/layout/textFlow.ts | มีทางข้อความล้วนแยก และคำนวณกรอบหน้าครั้งเดียว; ต้องให้ทาง section-aware ครอบคลุมทั้งคู่ |
| Core src/pdf/drawContract.ts | มีหน้าจริง/anchor.pageIndex แต่ไม่มี section identity; เพิ่ม metadata ให้ตรงหน้าที่ layout สร้าง |
| Service src/templates/assembly.ts | payload ที่เหลือจากแยก formats/schema ประกอบกลับด้วย spread; รองรับการเก็บโครงหน้าได้โดยยังไม่มีเหตุเพิ่มตาราง |
| Service src/templates/assembly.ts normalizeAreaDeletions | ลบ placement ใน formats เท่านั้น; ต้องเก็บกวาด placement ใน authored sections ด้วย |
| Service src/http/server.ts และ src/jobs/admission.ts | contract เปิด schemas/รูปแบบ ไม่เปิด fragment; admission compose ก่อน claim ทรัพยากร |
| Service src/jobs/processor.ts | โหลด pinned version ตรวจ original/prepared แล้ว compose ก่อนเตรียมภาพ; รูปบนส่วนคงที่ต้องถูกพบใน document.nodes ด้วย |

ข้อสรุป storage: ใช้ payload/snapshot เดิมก่อน แต่ R1 ต้องพิสูจน์ round-trip,
fingerprint, publish, rename/delete และ snapshot isolation ไม่ถือว่า spread ผ่านแล้วเท่ากับ DB ผ่าน

## สัญญาเป้าหมาย R1

จอง nodeModelVersion12 สำหรับระบบส่วนของเล่มขั้นแรก schemaVersion คง1
model4–11 คง validation/composition/layout เดิม ไม่อัปเกรด snapshot อัตโนมัติ
ก่อนใช้เลข12 ต้องเช็คว่ายังไม่มีงานอื่นจองเลขนี้ หากมีให้หยุดเฉพาะการเลือกเลข

### หน้าและส่วน

- Template model12 มี pageLayouts เป็น map จาก authored ID ไปยังรูปแบบหน้า
  แต่ละค่ามี label optional และ page รูปเดิม: A4, portrait/landscape, margin4ด้านหน่วยmm/pt
  ใช้ค่าครบทุกด้าน ไม่ merge override ราย field เพื่อเลี่ยงความหมายซ้อน
- book ใช้ contentSlot:'body' และ defaultPageLayoutId อ้างรายการที่มีอยู่
  สำหรับ model12 ไม่ส่ง book.page คู่กันให้มีสองแหล่งความจริง
- sections เป็น array ตามลำดับที่ผู้สร้างกำหนด แต่ละตัวมี id, label optional,
  pageLayoutId optional (ไม่ส่งใช้อ้างอิง defaultPageLayoutId) และ source
  ID ต้องไม่ซ้ำภายในประเภท; label เปลี่ยนได้โดย reference ไม่เปลี่ยน
- source.kind='content' รับรายการ content เดิม มีได้ไม่เกินหนึ่ง section ต่อแม่แบบ
- source.kind='authored' มี fragment, repeats และ cellRepeats optional แบบกลไกเดิม
  ไม่มี inputSchema ของ section อีกชุด; ใช้ globalSchema สำหรับค่าของส่วนคงที่
  local binding ใน fragment นี้ไม่อนุญาต; item ใช้ได้เฉพาะใน repeat ที่ประกาศถูกต้อง
- ส่วน authored วาง global Area ผ่าน areaId ได้ ใช้ตัวแปรเดิมใน data;
  global Area หนึ่งตัวต้องมี placement เดียวรวมทั้ง sections และ formats
- การแสดงหัวท้าย/เลขหน้า/cover role/blank-page command ยังไม่เป็น field ที่รับใน R1
  ค่าที่ไม่รองรับต้อง reject ไม่รับแล้วละเลย; เพิ่มตามพาร์ตพร้อม model/compatibility review

ไม่มี node section แทรกในตาราง/Area และไม่เพิ่มระบบพิกัด x/y อิสระ
การเปลี่ยน pageLayoutId ทำเฉพาะขอบ section ไม่เปลี่ยนขนาดกลางหน้าที่วางไปแล้ว

### Request และข้อมูลว่าง

ยังรับ docKey, version optional, data และ content; uploadId เป็นของ Service ตามเดิม
ไม่มี sections ใน request ค่า projectName/appendixItems อยู่ใน data ตาม schema
content ต้องเป็น array เสมอ แต่ model12 รับ [] ได้ ถ้าประกอบแล้วทั้งเล่มมีผลวางจริง
ไม่ใช้ EMPTY_CONTENT เพียงเพราะสาย content ว่างขณะที่ authored section มีเนื้อหา
ไม่มี section รับ content แต่ request ส่งรายการมา ให้ error ไม่ทิ้งรายการเงียบ ๆ
formats ว่างได้เฉพาะแม่แบบที่ไม่มี content section; ถ้ามีต้องมีรูปแบบให้เรียกอย่างน้อยหนึ่ง

unknown format/Area entry และ required/type ใช้นโยบายเดิม ไม่กลบ validation error
Area[] ไม่สร้าง node หลังขยาย ส่วนที่ไม่มีรากเหลือข้ามโดยไม่เปิดหน้า
blank TextBlock/line-break ที่ผู้สร้างประกาศยังเป็นคำสั่งใช้พื้นที่ตามโครงเดิม
ไม่ตัดสินความว่างด้วยการดูว่า ink มองเห็นหรือไม่; fixed box ว่างยังจองพื้นที่ใน R2
ถ้าทั้งเล่มไม่เหลือคำสั่งวางเลย ให้ EMPTY_CONTENT ไม่สร้าง PDF หน้าเปล่าโดยปริยาย
กรณีหัวท้ายเพียงอย่างเดียวเลื่อนไปตัดสิน R3 ตามคำสั่งเจ้าของ

### ตัวอย่างโครงคู่กับข้อมูล

ต่อไปนี้เป็นส่วนที่เพิ่ม/เปลี่ยนของ template ไม่ใช่แม่แบบเต็ม; styles/globalSchema/
formats/areaFormats ยังคงต้องประกาศให้ตรงกับ bindings ตามสัญญาเดิม
section-001 เป็นเนื้อหาคงที่ตัวอย่าง R1 ยังไม่ใช่ cover role ที่มีข้อบังคับหน้าเดียวของ R2

```json
{
  "book": {"contentSlot":"body","defaultPageLayoutId":"layout-001"},
  "pageLayouts": {
    "layout-001": {"label":"หน้ามาตรฐาน","page":{
      "size":"A4","orientation":"portrait","margin":{
        "top":{"value":20,"unit":"mm"},"right":{"value":20,"unit":"mm"},
        "bottom":{"value":20,"unit":"mm"},"left":{"value":20,"unit":"mm"}
      }
    }}
  },
  "sections": [
    {"id":"section-001","label":"ข้อความจากแม่แบบ","source":{
      "kind":"authored","repeats":[],"fragment":{
        "rootIds":["node-001"],"nodes":{
          "node-001":{"id":"node-001","type":"text-block","role":{"role":"paragraph"},
            "props":{"textStyleId":"body"},"children":[
              {"id":"leaf-001","type":"field-ref","scope":"global","key":"projectName"}
            ]}
        }
      }
    }},
    {"id":"section-002","label":"เนื้อหาหลัก","source":{"kind":"content"}},
    {"id":"section-003","label":"ภาคผนวก","source":{
      "kind":"authored","repeats":[],"fragment":{
        "rootIds":["node-002"],"nodes":{
          "node-002":{"id":"node-002","type":"area","props":{"areaId":"area-001"}}
        }
      }
    }}
  ]
}
```

globalSchema มี projectName:string และ appendixItems:area ที่ areaId='area-001'
areaFormats มี notice ของ area-001; formats มี section-note ที่รับ text:string

```json
{
  "docKey":"page-trial","version":1,
  "data":{"projectName":"โครงการตัวอย่าง","appendixItems":[
    {"format":"notice","data":{}}
  ]},
  "content":[{"format":"section-note","data":{"text":"รายละเอียด"}}]
}
```

เปลี่ยน appendixItems เป็น [] แล้ว section-003 ไม่สร้างหน้า เพราะไม่มี node อื่นเหลือ
สลับชื่อ label หรือเปลี่ยนลำดับ keys ของ data ไม่เปลี่ยนลำดับ sections

## ผล composition และ layout ที่พาร์ตถัดไปใช้

ResolvedDocument model12 เก็บ sections ตามลำดับพร้อม sectionId, pageLayoutId
และ rootIds ของแต่ละส่วน; rootIds ระดับเล่มเป็น concatenation ที่ต้องตรวจว่าตรงกัน
nodes/sourceMap มี instance เดียว ไม่คัดลอกเนื้อหาเพื่อสร้างหลาย representation
normalize รูปแบบหน้าก่อน layout; authored input ไม่ถูกแก้ตามผลวัด

sourceMap model12 แยก origin ของ content กับ authored section อย่างชัดเจน
ทั้งคู่มี sectionId/sourceId; เฉพาะ content มี original contentIndex/format
Area/repeat origin คงข้อมูลเดิมและเสริม section identity ไม่ใช้ index ปลอม
รหัส generated node ต้องมี section prefix เพื่อไม่ชนข้าม fragments
anchors ยังคงต้อง unique ระดับเล่มตามเดิม ไม่แก้ความหมาย target อย่างเงียบ ๆ

DrawPage เพิ่ม sectionId และ sectionPageIndex สำหรับ model12
physical pageIndex ใช้ตำแหน่งใน pages เหมือนเดิม; anchor ชี้ global pageIndex เสมอ
เลขที่แสดงเป็นข้อมูลอีกชุดใน R4 ไม่ใช้แทน physical index
R1 ไม่รวม PDF หลายไฟล์เข้าด้วยกันหรือวาดสารบัญแยกเป็นเล่มย่อย:
ต้องรวบรวมหัวข้อ/จุดหมายทั้งเล่มและรักษา offset หน้าข้าม sections
ห้ามเรียก flow เดิมทีละส่วนโดยลืม global contents/anchors/page-number processing

## กล่องจองพื้นที่และปกสำหรับ R2

R0 กำหนดขอบเขตเริ่มต้น fixed-height ที่ TextBlock ระดับรากบนปก
ไม่เพิ่ม fixed-height ใน cell/Area/ตาราง/ภาพเป็นผลข้างเคียง
กรอบสูงเป็น Length >0 หน่วยmm/pt รวมพื้นที่ที่จองทั้งหมด ไม่เพิ่ม padding ใหม่
ในรอบนี้; ใช้ความกว้างพื้นที่พิมพ์ของปก โหมด content ยังคงเดิม
วัด line boxes และ ink ด้วยกลไกเดิมให้ครบก่อนวาง; ทั้งสองต้องอยู่ในกรอบ
เสนอ vertical alignment top เป็น default, center/bottom เป็นตัวเลือก
กรอบที่ว่างยังใช้ความสูงที่จอง ข้อความพอดีกรอบผ่าน เกินกรอบให้ LAYOUT_FAILED
พร้อม section/node/path ต้นทาง ไม่ขยายกรอบ ไม่ clip ไม่ shrink
ต้องตรวจผลรวมกล่องทั้งปกด้วย ไม่ใช่ผ่านเพราะแต่ละกล่องแยกกันพอดี
ปกพิเศษหน้าเดียวและไม่นับเลขหน้าเป็น R2/R4 ไม่แอบอ้างว่า R1 ทำครบ

## พื้นที่แก้และแผนลงมือ R1

ทำทีละ task ในห้องนี้หลังอ่าน contract/spec/AGENTS และยืนยันฐานยังตรง
แต่ละ task เพิ่ม regression ที่ชี้พฤติกรรมใหม่ให้เห็น FAIL ก่อน แล้วแก้ให้ผ่าน
review diff และตรวจพื้นที่กระทบก่อน commit; ไม่จำเป็นเพิ่ม version ทุก task

### Task 1 — Template และ preparation

Core: src/template/types.ts, validateTemplate.ts, areas.ts, validateGraph.ts;
src/data/prepareGeneration.ts, types.ts; src/composition/validatePreparedInput.ts
เพิ่ม helper src/template/pageSections.ts สำหรับ index/reference/validation
ไม่วางการตัดสิน section ไว้ใน HTTP route

tests/template/pageSections.test.ts และ tests/data/pageSections.test.ts:
valid defaults/explicit layouts, duplicate IDs, missing refs, invalid margin,
สอง content slots, fixed-section local binding, Area placements ข้าม sections,
content[]/missing/wrong type, global required/default และ prepared tampering
ทดสอบ model11 reject fields ใหม่และคงนโยบาย EMPTY_CONTENT เดิม
ผลส่งต่อ: ValidatedTemplate/PreparedInput ผ่านสัญญาใหม่โดยไม่มี layout/pagination state

### Task 2 — Composition และ provenance

Core: src/composition/composeDocument.ts, resolvedDocument.ts,
validateResolvedDocument.ts; src/binding/expandRows.ts, expandAreas.ts, bindInlines.ts
แยก helper src/composition/composeSections.ts เมื่อจำเป็นเพื่อลดการแทรกเงื่อนไขใน loop เดิม
origin เป็น tagged structure ภายใน model12; preserve การ serialize model4–11

tests/composition/pageSections.test.ts: ลำดับส่วน/data, Area[]ข้ามส่วน,
global image ใน authored section, duplicate authored node IDs ต่าง section
ไม่ชนตอน compose, original index หลัง skip, link target ข้ามส่วน,
section/root concatenation tamper และไม่ mutate แม่แบบ
ผลส่งต่อ: ResolvedDocument ที่ระบุ section และต้นทางจริงของทุก node

### Task 3 — Layout และ PDF ของส่วนทั่วไป

Core: src/layout/documentFlow.ts, textFlow.ts และ helperใหม่ sectionFlow.ts;
src/pdf/drawContract.ts, createPdfEngine.ts; consumers ของ anchors/contents/pageNumbers
ใช้ page context ร่วมสำหรับ section-aware text/table/image โดยคง legacy path
ไม่เปิดใช้ role ปก/คำสั่งหน้าเปล่า/fixed-height ก่อน R2

tests/layout/pageSections.test.ts และ packed fixture fixtures/page-sections/:
ข้อความล้วน, ตารางเซลล์รวม/ภาพหลายหน้า, หลาย orientation/margins,
ส่วนก่อนหน้าจบพอดีหน้า, ส่วนว่างคั่น/ท้าย, cross-section links/TOC,
page metadata และ layout error ที่ย้อนต้นทาง section ได้
ทดสอบ source node ไม่หาย/ซ้ำ ไม่ใช้เพียง pageCount
run npm run build, targeted tests แล้ว packed Linux consumer สำหรับฟีเจอร์จริง
ตรวจ PDF ตัวอย่างกับเจ้าของ; ไม่ตีผล schema tests ว่า layout ผ่าน

### Task 4 — Service และส่งมอบ R1

Service: src/templates/assembly.ts (รวม normalizeAreaDeletions),
src/templates/areaContract.ts, src/http/server.ts เฉพาะ metadata ที่จำเป็น,
src/jobs/admission.ts, processor.ts, render-child.ts เฉพาะส่วนที่ผลตรวจระบุว่าต้องแก้
ให้ contract ส่ง schemas/examples ตามเดิม ไม่เปิด fragment/node graph ให้ API caller
vendor/package lock ปรับหลัง Core artifact ใหม่ที่ตรวจแล้ว; ห้ามทับ0.1.8

tests/page-sections-assembly.test.mjs, page-sections-api.test.mjs:
decompose/assemble/fingerprint, rename layout label, current save/publish/load,
ลบ Area แล้ว placement ใน section ถูกลบพร้อม owned rows, snapshotเก่ายังคงเดิม,
content[]กับ authored text/image, invalid request ไม่รับ job, upload claim จาก authored
image และ PDF ผ่าน HTTP ที่มีหลาย sections
ใช้ DB ทดลองแยก; ไม่มี migration ใหม่ถ้า payload round-trip พอ
ถ้าพบข้อจำกัดต้องกลับมาแก้สัญญา ไม่เพิ่ม schema change เงียบ ๆ

R1 จบเมื่อ Task1–4 มีหลักฐานผ่านบนคู่ Core/Service artifact เดียวกัน
อัปเดตคู่มือ/roadmap และเพิ่มรุ่นพัฒนาเฉพาะเมื่อฟีเจอร์ใช้ได้จริง
release เป้าหมายทั้งชุดคือ0.2.0 ตามเจ้าของรับแล้ว; R1 ไม่ใช่การอนุมัติ release

## Review focus และสิ่งที่ไม่อ้างว่าปิดแล้ว

- original content index ของ Area/content ที่ถูกข้าม กับ origin ของส่วนคงที่ — Task1–2
- deletion ของ Area ใน payload ใหม่กับ snapshot เดิม — Task4
- ทางข้อความล้วนกับตาราง/ภาพต้องได้ section boundary เดียวกัน — Task3
- หน้าสารบัญ/anchor ข้าม section ต้องอิงทั้งเล่ม — Task3 และตรวจเพิ่ม R5 เมื่อเลขแสดงเปลี่ยน
- ข้อมูลภาพบนปก/ส่วนคงที่ต้องถูก claim/prepare และ error ไม่หาย — Task2/4

R0 ปิดการตรวจเส้นทางและแนวทางเทคนิคสำหรับเริ่ม R1; เอกสารนี้ยังไม่ใช่ proof
ของ model12 ผล runtime หรือผลการใช้ DB ใหม่ รายละเอียดหัวท้าย/เลขแสดงยังคุย
ใน R3/R4 ตามที่เจ้าของเลื่อนไว้ และ acceptance แต่ละพาร์ตต้องทดสอบจริง


## บันทึกหลังลงมือ R1

2026-10-10: Tasks1–4 ลงมือแล้วตามคำอนุญาตเจ้าของ ดูผล/ข้อจำกัด/หลักฐานใน
[Roadmap ผลรับ R1](flowdoc-page-system-roadmap-2026-10-10.md#ผลรับ-r1--2026-10-10)
ข้อสรุป R0 ด้านบนคงเป็นบันทึกการออกแบบ ไม่ยกระดับเป็น runtime evidence ด้วยตัวเอง
Core0.1.9/Service0.1.9 เป็นรุ่นพัฒนา; release ยังคง0.1.8
