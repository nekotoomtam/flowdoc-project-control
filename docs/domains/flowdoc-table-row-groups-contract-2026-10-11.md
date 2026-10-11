# FlowDoc: array สองระดับและกลุ่มแถวตาราง — พาร์ต 1

## Authority Boundary และสถานะ

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
เอกสารนี้เป็น **นิยามสำหรับพัฒนา ยังไม่ใช่ความสามารถที่ API ใช้ได้แล้ว**
ส่วน 1–7 เก็บสถานะและนิยามเมื่อจบพาร์ต 1; ผล implementation ล่าสุดอยู่ส่วน 8–9.
ผู้ใช้อนุมัติแนวทางและให้เริ่มพาร์ตนิยามในบทสนทนาวันที่ 2026-10-11
Core เป็นเจ้าของ schema, binding, composition และ pagination;
Service เป็นเจ้าของการบันทึกแม่แบบ/เวอร์ชันและ API integration.

งานห้องเดียวแบบ inline; execution/Work/Phase/Checklist IDs: N/A.
ขอบเขตรอบนี้: เอกสารนี้กับลิงก์ใน roadmap เดิมเท่านั้น; ไม่แก้ product code,
DB, package, release, DOCUMENT_MAP หรือข้อมูลต้นฉบับ ไม่ dispatch ห้องใหม่.
Work size: medium; risk: routine สำหรับงานนิยามที่ย้อนแก้ได้.
Document budget: หนึ่ง contract และหนึ่ง roadmap update.
Proof budget: เทียบกับโค้ดที่อ่าน, ตรวจ JSON ตัวอย่าง/ลิงก์/ความสอดคล้อง,
ทบทวนหนึ่งรอบ; ไม่อ้างผล runtime test จากการตรวจเอกสาร.
ใช้บริบทการอนุมัติในห้องนี้ ไม่เปิด execution เก่าหรืออ้างว่าเปลี่ยน model ของห้อง.
โมเดล/สภาพแวดล้อมของงาน implementation ให้เลือกใหม่ใน kickoff ของงานนั้น.

Current Truth Snapshot ยังชี้งาน frontend; คำขอเฉพาะนี้และ
[roadmap เดิม](flowdoc-page-system-roadmap-2026-10-10.md) เป็นบริบทงาน export.
พาร์ตนี้นิยามพฤติกรรมครบเพื่อวาง implementation plan; พาร์ต 2–4 ยังไม่เสร็จ.

## 1. ข้อเท็จจริงและทางเลือก

ตรวจ Core `1d4f71c831a080e7bbadfdec8b66eab11a0d4ea0` และ Service
`a07b953918324dc9edf8ec5f8929a90cbf636190` (0.2.11):

- Core `src/template/types.ts` / `validateSchemas.ts`: array item รองรับ
  string/link/image แต่ไม่รองรับ array ลูก; ไม่มี arbitrary object field.
- `src/binding/expandRows.ts`: repeat แถวเดียวและ cell repeat; ไม่มี group scope.
- `src/composition/resolvedDocument.ts`: sourceMap มี itemIndex ระดับเดียว.
- Service `src/templates/assembly.ts`: มี parentId และการเดินประกอบ schema
  แต่ตัวตรวจรับจำกัดความลึกและชนิดลูกอยู่ จึงยังรับ array ซ้อนไม่ได้.
- เล่มทดลอง meeting correction ประกอบหนึ่งตารางต่อการประชุมได้จริง แต่
  ต้องสร้างช่องบริษัทตามจำนวนในข้อมูล ไม่ใช่ generic nested repeat.

ทางเลือกที่ไม่เลือก: company1/members1 ต่อไปทำให้แม่แบบเปลี่ยนตามจำนวนบริษัท;
แยกหนึ่งตารางต่อบริษัททำได้ง่ายกว่าแต่ไม่ตรงการประชุมหนึ่งตาราง;
เปิด Area/โครงย่อยซ้อนทั่วไปขยายขอบเขตเกินโจทย์นี้.

เลือกขยายกลุ่มแถวก่อน layout. คาดว่าจะใช้การวัดข้อความ/wrap เดิมได้;
การรักษาชุดเริ่มต้นตอนข้ามหน้าเป็นงาน pagination เพิ่ม ไม่ใช่สิ่งที่พิสูจน์แล้ว.
คำว่า Row Group ในเอกสารนี้ `define` เป็น declaration สำหรับวนแถวตาราง;
`split` ออกจาก Area/โครงย่อย และไม่มีความหมายเป็น table หรือ Node ซ้อนใหม่.

## 2. ข้อมูลจากผู้เรียก API

ตัวอย่างต่อไปนี้เป็น payload **ที่เสนอ**. ชื่อ section, format และตัวแปร
ผู้สร้างแม่แบบเป็นผู้กำหนด; ไม่บังคับใช้ชื่อ companies/members.
version เป็นเวอร์ชันแม่แบบที่ล็อกแล้ว ไม่ใช่เวอร์ชันเอกสารบนหน้าปก.

```json
{
  "docKey": "srs-spaceship",
  "version": 1,
  "data": {},
  "sections": {
    "meetings": {
      "data": {},
      "content": [
        {
          "format": "meeting",
          "data": {
            "title": "บันทึกการประชุมครั้งที่ 1",
            "companies": [
              {
                "name": "Customer",
                "members": [
                  {"name": "ผู้เข้าร่วมคนที่ 1", "position": "Tester"},
                  {"name": "ผู้เข้าร่วมคนที่ 2", "position": "Project Manager"}
                ]
              },
              {"name": "TTT Brother", "members": []}
            ]
          }
        }
      ]
    }
  }
}
```

inputSchema ของ format นี้ (ส่วนอื่นของ template ไม่แสดงในตัวอย่าง):

```json
{
  "type": "object",
  "fields": {
    "title": {"type": "string", "required": true},
    "companies": {
      "type": "array",
      "required": true,
      "items": {
        "type": "object",
        "fields": {
          "name": {"type": "string", "required": true, "allowEmpty": false},
          "members": {
            "type": "array",
            "required": true,
            "items": {
              "type": "object",
              "fields": {
                "name": {"type": "string", "required": true, "allowEmpty": false},
                "position": {"type": "string", "default": ""}
              }
            }
          }
        }
      }
    }
  }
}
```

### ความลึกและค่าที่ไม่ครบ

- นับความลึกเฉพาะ array: companies = 1, members = 2; array ชั้น 3 ปฏิเสธ
  ตอนลงทะเบียนแม่แบบ. Object ที่เป็น envelope/items ไม่เพิ่มระดับ array.
- item schema ต้องมีอย่างน้อยหนึ่ง field. ระดับแรกมี string/link/image/array
  ได้; ระดับที่สองมี string/link/image เท่านั้น. ไม่เปิด arbitrary object
  field, area ภายใน item หรือการซ้อน Area ในงานนี้.
- ข้อมูลเรียงตาม array ที่ส่งมาเสมอ ไม่ sort/dedupe ตามชื่อ; ชื่อซ้ำต่างรายการ
  ยังคงเป็นคนละรายการ และไม่ใช้ชื่อเป็น ID ภายใน.
- missing required ปฏิเสธ แม้มี default; optional ที่หายใช้ default ที่ตรวจแล้ว
  หรือ [] สำหรับ array. ค่าที่ส่งมาเป็น [] ไม่ใช้ default แทน.
- required array หมายถึงต้องส่ง field ไม่ได้หมายถึง minItems=1; [] ถูกต้อง.
- null, string แทน array, item ที่ไม่ใช่ object, leaf ผิดชนิด: ปฏิเสธ request
  พร้อม path เช่น sections.meetings.content[0].data.companies[1].members[2].name.
- unknown key ใช้ warning/ignored เดิม; ใน prepared snapshot ต้องปฏิเสธ
  ข้อมูลส่วนเกินตามกติกาเดิม. ไม่ข้ามสมาชิกที่ข้อมูลผิดแบบเงียบ ๆ.
- key ซ้ำคนละ scope เป็นคนละตัวแปร; การตรวจ duplicate JSON key ของระบบเดิม
  ไม่เปลี่ยน และไม่มี last-wins rule เพิ่มในงานนี้.

## 3. กติกาแม่แบบ: rowGroups

เสนอเพิ่ม `Format.rowGroups` โดยเก็บ `repeats` และ `cellRepeats` เดิมไว้.
JSON นี้เป็น declaration fragment ไม่ใช่แม่แบบที่สมบูรณ์หรือส่งใช้ได้ตอนนี้:

```json
{
  "rowGroups": [
    {
      "id": "companyGroup",
      "tableId": "meetingTable",
      "rowTemplateIds": ["companyRow", "labelsRow", "memberRow", "emptyRow"],
      "source": {"scope": "local", "key": "companies"},
      "memberRepeat": {
        "rowTemplateId": "memberRow",
        "source": {"scope": "group", "key": "members"},
        "emptyRowTemplateId": "emptyRow"
      },
      "pagination": {"keepStart": true}
    }
  ]
}
```

### กฎตำแหน่งและการขยาย

1. กลุ่มมี ID ไม่ว่าง ไม่ใช้ ~; unique ร่วมกับ repeat declaration IDs ที่มีชื่อ
   ภายใน format. tableId/row IDs ต้องอ้าง Node IDs ไม่ใช่ชื่อตัวแปร.
2. rowTemplateIds ต้องไม่ซ้ำและเป็นแถวติดกันใน table.rowIds ตามลำดับจริง
   อยู่นอก headerRowCount. แถว static ก่อน/หลังกลุ่มคงอยู่ครั้งเดียว.
3. รอบแรกหนึ่งกลุ่มมี memberRepeat หนึ่งชุด: มี prefix อย่างน้อยหนึ่งแถว
   ตามด้วย memberRow และ emptyRow เป็นสองแถวสุดท้ายตามลำดับ.
   emptyRow เป็นต้นแบบทางเลือก มีอยู่ใน graph เพื่อให้ตรวจโครงได้ครบ
   แต่ไม่แสดงพร้อม memberRow. ไม่มี suffix ภายในกลุ่มในรอบนี้.
4. วนแต่ละ company: prefix หนึ่งครั้ง แล้ว memberRow ตามจำนวน members;
   ถ้า members=[] ใช้ emptyRow ครั้งเดียว. ไม่มีต้นแบบหลงเหลือหลังขยาย.
5. ถ้า companies=[] กลุ่มทั้งชุดหายไป; หัวการประชุม/ส่วน static ยังคงอยู่.
   ตารางที่ไม่มีแถวเหลือเลยต้องไม่วาดกรอบเปล่า ใช้กติกา empty-table เดิม.
6. กลุ่มบริษัทว่างสมาชิกแสดงชื่อบริษัท + labelsRow + แถวข้อความ
   “ไม่มีรายชื่อผู้เข้าร่วม”. ข้อความเป็น literal ในแม่แบบ ไม่ hardcode ใน Core.
   emptyRow ใช้เซลล์รวมเต็มความกว้างได้.
7. มีหลายกลุ่มแยกกันใน format/table ได้ แต่ห้ามช่วงแถวทับกันหรือซ้อนกัน;
   ห้าม ordinary repeat/cellRepeat อยู่ในแถวของกลุ่มในรอบนี้.
8. source ของวงนอกใช้ global/section/local ตาม context ที่มีจริง;
   วงในใช้ group และต้องชี้ array ลูกของ item schema วงนอกโดยตรง.
   ไม่ใช้ dotted key/expression/dynamic property lookup.
9. อนุญาต colSpan ใน grid ที่ถูกต้อง. ในแถวกลุ่มยังไม่อนุญาต rowSpan>1
   และห้าม rowSpan จากนอกกลุ่มคร่อมเข้ามา เพื่อไม่สร้าง grid ที่ผิดหลังขยาย.
10. สมาชิกเซลล์ใช้ความสามารถเดิมที่ context อนุญาต รวม string/link/image;
    ไม่เพิ่ม nested table, Columns ใน cell, Area ในกลุ่มหรือวงที่สาม.

### ขอบเขตตัวแปร

- เพิ่ม scope `group`: company ปัจจุบัน ใช้ใน prefix/member/empty row ได้.
- `item`: member ปัจจุบัน ใช้ได้เฉพาะ memberRow. ใน prefix/empty row
  ที่ไม่มี member ให้ reject item ref ตอนตรวจแม่แบบ ไม่ fallback ไป company.
- ตัวอย่าง companyRow อ่าน `{ "scope": "group", "key": "name" }`;
  memberRow อ่าน `{ "scope": "item", "key": "name" }`.
- global/section/local ยังคงความหมายเดิม. scalar ref ห้ามชี้ array โดยตรง;
  image/link binding ต้องตรวจชนิดตาม schema ของ scope จริง.
- Source identity ต้องเก็บ group declaration ID, outer index และ inner index
  (inner index ไม่มีสำหรับ prefix/empty) รวมกับ origin เดิม. Node/inline IDs
  ต้องไม่ชนระหว่างบริษัท สมาชิก format instances และ sections.
  sourceMap ใช้ index เส้นทาง ไม่ใช้ชื่อบริษัทหรือสมาชิกเป็น identity.

## 4. กติกาจัดหน้า (นิยามตอนนี้ ทำในพาร์ต 4)

`pagination.keepStart` เป็น boolean; omitted/false ใช้ flow เดิม;
ตัวอย่าง SRS ตั้ง true อย่างชัดเจน ไม่เปิดให้ทุกตารางโดยปริยาย.

เมื่อ true ต้องให้ prefix ทั้งชุด (ชื่อบริษัทและหัวคอลัมน์) อยู่กับส่วนแรกที่
แบ่งได้ตามกติกาแถวของ member คนแรก. สำหรับแถวข้อความคือบรรทัดแรกของเซลล์
ที่มีข้อความ; ภาพที่แบ่งไม่ได้ต้องใช้ความสูงภาพด้วย ไม่สมมติว่าเป็นหนึ่งบรรทัด.
ถ้าไม่มี member ให้ prefix อยู่กับ emptyRow แทน. เคารพ allowBreak ของแถวเดิม.

วัดจากพื้นที่จริงหลังหัก header/footer/repeated table header และ padding.
ถ้าชุดเริ่มต้นพอดีหน้าใหม่แต่ไม่พอพื้นที่ปัจจุบัน ให้ย้ายทั้งชุดเริ่มต้น;
สมาชิกที่เหลือแบ่งต่อหน้าได้ ไม่ keep ทั้งบริษัท. ไม่แทรก Page Break Node
ลงแม่แบบหรือข้อมูลตามผลการจัดหน้า.

ถ้าชุดเริ่มต้นสูงกว่าพื้นที่เต็มหน้าที่ใช้ได้ ให้ผ่อน keepStart ของ instance นั้น
และใช้การแบ่งเดิม พร้อม warning ระบุ group/index และเหตุผล; ต้องคืบหน้าเสมอ
ไม่วนสร้างหน้าเปล่า. ถ้าเนื้อหาเองแบ่งไม่ได้และวางไม่ได้ยังเป็น layout error
ตามเดิม ไม่ตัด/ซ่อนข้อมูล. หมายเลข warning และ wire shape ของ resolved group
metadata ต้องล็อกในแผนพาร์ต 4 ก่อน implementation; ห้ามเงียบ ๆ ทิ้ง policy.
พาร์ต 2 ต้องรักษา boundary/origin ไว้ให้ layout ใช้ต่อ.

ชื่อบริษัทไม่ซ้ำอัตโนมัติในหน้าต่อไปในรอบนี้; repeated table header เดิมยังทำงาน.
ไม่บังคับหมวดการประชุมเริ่มหน้าใหม่ และไม่เพิ่มกติกาเยื้องข้อความในงานนี้.

## 5. Compatibility และขอบเขต Service

- ความสามารถใหม่ต้องมี nodeModelVersion ใหม่; รุ่นเลขที่แน่นอนตรวจจองใน
  kickoff implementation เพื่อไม่ชนงานอื่น. models4–16 และรูปแบบ repeat เดิม
  ต้องรักษาผลตรวจรับ/ปฏิเสธและผลเอกสารเดิม. schemaVersion ไม่เปลี่ยนเพราะ
  เหตุนี้เพียงอย่างเดียว. ห้ามแก้ locked template snapshot ย้อนหลัง.
- ตรวจ schema depth ก่อนข้อมูลจริง/defaults/prepared input; ป้องกันวงลึก
  และขยายแถวโดยรักษาลำดับ. จำนวนแถวแปรตามผลรวมสมาชิก ไม่ใช่จับคู่ทุกบริษัท
  กับสมาชิกทั้งหมด. ต้องตรวจขีดจำกัด expanded nodes ที่มีอยู่ใน kickoff
  และกำหนด budget ถ้ายังไม่มี ก่อนเปิดใช้จริง; ไม่อ้างรองรับจำนวนไม่จำกัด.
- Service อาจใช้ parentId/schemaId/type master เดิมได้ แต่ต้องแก้ depth/type
  validation และตรวจ round-trip/publish/clone. ยังไม่ยืนยันว่าไม่ต้อง migration
  จนกว่าจะตรวจข้อจำกัด DB ที่เกี่ยวข้องในพาร์ต 3.
- รวมการเปลี่ยนแปลง version-gated ใน authored/content section และ format
  ที่รองรับ ไม่เปิด repeat ใน header/footer เพิ่ม. Prepared snapshot, media
  collection และ sourceMap validation ต้องตามทัน ไม่รับ payload ใหม่ครึ่งทาง.

## 6. เงื่อนไขตรวจรับของงานต่อไป

| กรณี | ผลที่ต้องได้ | พาร์ตพิสูจน์ |
| --- | --- | --- |
| สองบริษัทสมาชิก 2/1, ชื่อซ้ำข้ามกลุ่ม | ลำดับถูกและ ID ไม่ชน | 2 |
| companies=[] | กลุ่มหาย ส่วน static คงอยู่ | 2 |
| บริษัท members=[] / optional members หาย | ชื่อ + หัวคอลัมน์ + emptyRow หนึ่งครั้ง | 2 |
| required members หาย / null / leaf ผิดชนิด | reject พร้อม indexed path ไม่มี PDF บางส่วน | 2 |
| array ลึกสามชั้น / dotted ref / item นอกวง | reject template | 2 |
| ช่วงกลุ่มทับ/ซ้อน/rowSpan คร่อมกลุ่ม | reject template | 2 |
| สองกลุ่มแยกกัน, static ก่อนหลัง | แต่ละกลุ่มไม่กินแถวกัน | 2 |
| default ของ array สองระดับ | ตรวจและ clone ตาม schema ไม่แชร์ mutable state | 2 |
| บันทึก/โหลด/publish และแก้ current หลัง publish | locked version คงเดิม; parent IDs ถูก remap | 3 |
| ตัวอย่าง link/image ในสมาชิก | scope ถูก ผ่าน composition/media/API | 2–3 |
| prefix ท้ายหน้า, บริษัทว่าง, member ยาวหลายหน้า | keepStart ถูกและไม่มีข้อมูลหาย | 4 |
| ชุดเริ่มต้นใหญ่กว่าหน้าเต็ม | warning/fallback มี progress ไม่วนหน้าเปล่า | 4 |
| ไม่ตั้ง keepStart / แม่แบบเก่า | ไม่เปลี่ยนพฤติกรรมเดิม | 2–4 |
| SRS จริง 15 การประชุม 29 กลุ่ม 94 คน | ตรวจรายการและ PDF, เวลา/RAM พร้อมสภาพแวดล้อม | 4 |

พาร์ต 1 ตรวจความชัดเจนและ JSON ในเอกสารเท่านั้น ไม่ใช้ตารางนี้ประกาศ runtime
PASS. พาร์ต 2 ต้องวางแผนไฟล์/types/tests แบบเจาะจงตาม contract นี้ก่อนแก้ code;
พาร์ต 3 ตามด้วย Service/DB integration; พาร์ต 4 ทำ pagination และเล่มจริง.

## 7. หยุดขอบเขตและสิ่งที่ยังไม่ยืนยัน

ไม่รวม autoLink, frontend, DOCX, Break Node, Area ซ้อน, การเยื้อง, การซ้ำหัวบริษัท
บนหน้าต่อไป หรือ promotion เข้า release. การรองรับ nested array/rowGroups
ยังไม่ implement; runtime performance และ layout compatibility ยังต้องพิสูจน์.
เลข model version, resolved metadata/warning wire shape และ expanded-node budget
เป็น implementation decisions ของพาร์ตที่ระบุ ไม่ใช่หลักฐานว่าพร้อมใช้งาน.
หากต้องเปลี่ยนขอบเขตความลึกหรือเปิดวงซ้อนทั่วไป ให้กลับมาทบทวนกับเจ้าของก่อน.

## 8. พาร์ต 2 — implementation kickoff (2026-10-11)

Owner: Core; role: Product Implementation Agent. User authorized implementation
in this conversation; single-room inline, execution IDs N/A. Size: medium;
risk: routine. Base: `1d4f71c`; branch `codex/row-groups-part2`, isolated checkout
`../flowdoc-core-row-groups`. Native worktree tool is bound to Project Control,
so the Core lane uses Git directly. No separate WORK dispatch/model change.

Allowed: Core template/data/binding/composition, version-routing consumers,
targeted tests and package consumer; this existing contract for progress/results.
Forbidden: Service/DB, release, rendering/wrap algorithm changes, input datasets.
Document budget: this existing record. Proof budget: focused red/green tests,
type build, affected legacy suite, packed Linux consumer, one final review.

Implementation order:
1. Add model 17 and recursive item types bounded to two arrays in schema
   validation; cover defaults, bad values, prepared round-trip and old models.
2. Add `rowGroups` declaration validation in `validateGraph` with a dedicated
   helper; add group scope, contiguous row ownership and span/repeat guards.
   Expand in `expandRows`, retaining ordered boundaries and source identity.
3. Validate resolved metadata, route model 17 through existing section/numbering
   consumers, test multiple groups/instances, authored/Area contexts, image/link,
   old IDs and an expansion budget. Review diff, run affected checks, integrate
   only into development when passing and clean up this task's lane.

Ruling: model 17 is free at the inspected base. No package version or Service
dependency update until this Core-only slice is proved.
Ruling: resolved table metadata will retain declaration ID, group index,
ordered rows, prefix rows, first member/empty row and keepStart. Exact pagination
warning/fallback remains Part 4. Until then, layout must explicitly reject
keepStart=true rather than silently ignore it; false/omitted uses existing flow.
Ruling: cap model-17 expansion at 100,000 node/inline identities per document,
shared across sections and Areas; reject without returning a partial document.
This is an initial safety ceiling, not a performance or production guarantee.

Acceptance: the Part-2 rows in section 6 plus preserved keepStart and explicit
pending-layout behavior; all old model tests retain acceptance and output.
### ผลพาร์ต 2 — PASS เฉพาะ Core

Implemented at Core `93fabbcfb8c0054e2e247d867607a3c4b96a7549`, integrated by
unchanged fast-forward into `codex/template-binding`. Model 17 accepts bounded
two-level arrays and rowGroups; models 4–16 retain their existing gates.
Package version remains 0.2.11 in this development-only slice; no package
promotion, Service dependency change, tag or release update. Part 3 must choose
the integrated package version before updating the Service consumer.

| Acceptance / impact | Evidence |
| --- | --- |
| Two levels, order, empty/default/required, indexed errors, unknown keys, prepared tampering | `tests/composition/rowGroups.test.ts` |
| Disjoint groups, repeated instances/sections, authored/global/section/Area context, image/link scope | Same test file; unique IDs, exact row values and sourceMap assertions |
| Invalid declarations, scope misuse, overlap, colSpan and rowSpan boundary | Same test file; valid colSpan and otherwise-valid crossing span cases |
| Preserved boundaries/policy; explicit pending keepStart behavior | `validateRowGroupMetadata.ts`, composition tests and packed consumer |
| 100,000 identities across body, Areas, sections and page bands | `expansionBudget.ts`; body-instance and combined header/footer budget tests |
| Legacy section numbering, bands, layout/wrap | Exact draw equality for model-16 fixture upgraded to 17; affected legacy tests |
| Package / native / PDF consumer | Final `npm run check:package`: Linux/amd64, build + 484 tests in 61 files, native session check, installed package in network-disabled non-root consumer |

Paths in the table are relative to `flowdoc-core`. Durable tests/fixtures at the
commit are implementation evidence; this prose is a result record, not a map
promotion. No DOCUMENT_MAP/shared product readiness change.

Final local artifact directory (ignored, preserved before worktree removal):
`C:/Users/nekot/Documents/GitHub/flowdoc-core/artifacts/1791731449519/`.
`row-groups-result.json` reports PASS: two groups, nine rows, one PDF page;
`row-groups.pdf` and `result.json` retain package-consumer results;
`package-check.log` includes the full final build/test/consumer output.
107 artifact files were copied and hash-compared. Embedded original worktree
paths in result/log files are provenance; use this retained directory to open them.

Review found that page bands bypassed the first budget implementation. A failing
combined header/footer test reproduced it; the shared budget now reaches band
leaves and Columns. A separate failing forged-resolved-span case was also fixed.
Both pass in the final 484-test run. A TypeScript index guard error during an
intermediate package build was corrected before the final passing build.
Final diff/whitespace check passed. Only a trailing test-file blank line changed
after the passing package run; runtime/package contents remained identical.

Cleanup: removed the clean merged `codex/row-groups-part2` branch/worktree and
both task consumer images. Kept only the final artifact evidence; intermediate
package attempts were superseded. Service checkout remained unchanged.
Core release stays `d06cd8a`; Service release stays `7563151`.

Remaining: Part 3 Service schema persistence/publish/clone/API and nested media
handling; Part 4 keepStart pagination and the real SRS acceptance/performance run.
Until Part 4, keepStart=true fails layout explicitly. False/omitted works with
the existing flow. No claim yet about real SRS group pagination or load capacity.

## 9. พาร์ต 3 — Service/DB/API kickoff

User authorized Part 3 in the same conversation. Inline implementation;
execution IDs N/A. Owner: Service; Core owns only package version/artifact.
Role: Product Implementation Agent; size medium, risk routine. No separate
WORK dispatch. Existing contract is the work authority and document budget.
Service base `a07b953`, Core base `93fabbc`; isolated lanes
`../flowdoc-service-row-groups` and `../flowdoc-core-row-groups-package`.

Plan / allowed scope:
1. Package the verified Core changes as 0.2.12, consume that immutable tarball
   with checksum/provenance; align Service development version to 0.2.12.
2. Extend model-17 Section routing and record validation for two array levels.
   Keep rowGroups in format/source payloads, and preserve the existing parent
   relationship and current/version clone remapping. No new tables required.
3. Add forward-only migration 013 for model-17 Section ownership. Do not edit
   migrations 001–012. Verify upgrade from populated 012 and replay/immutability.
4. Test registration/current save/publish/reload, nested parent remapping,
   pinned versions, malformed schema/data, contract response, real API jobs,
   nested member image/link and prepared snapshot integrity.

Proof budget: targeted RED/GREEN then Service build and affected real database /
API tests in an isolated named Docker project, final diff review. Core runtime
tests from Part 2 are reusable for unchanged source; verify the repackaged
consumer through Service. No shared map promotion or new report artifacts.
Forbidden: release/tags, live user DB, Core rendering changes, Part-4 keepStart
implementation. keepStart=true remains explicit layout failure; baseline API
fixtures use false. Unknown: DB constraints and consumer version routing must
be proved by the checks above; no production concurrency claim.

### ผลพาร์ต 3 — PASS เฉพาะ Service/DB/API integration

Core package commit `d11d7ce8afc6e48341d571d0d3d49f74d49dfdfe` and Service
commit `7a91db3fd020e63db880f7496a446999d4a79ead` integrate unchanged into
`codex/template-binding` and `codex/template-registry`. Both development
packages are 0.2.12. Core runtime source is unchanged from Part 2.

| Acceptance / impact | Durable evidence in Service |
| --- | --- |
| Two-level schema roundtrip; malformed depth, cycles, cross-schema parents; old-model gates | `tests/row-groups-assembly.test.mjs` |
| Populated migration 012 → 013 and replay; old current/version preserved | `tests/row-groups-version.test.mjs` |
| Every nested parent remapped into each immutable version; pinned v1 unaffected by current/v2 edits | Same version test, including SQL mutation rejection and failed-save rollback |
| API contract exposes nested input fields without internal table graphs; invalid nested data rejected before enqueue | `tests/row-groups-api.test.mjs` |
| Direct/staged input, nested member image/link, real worker PDF, empty outer/inner arrays | Same API test, using HTTP handler injection with isolated PostgreSQL and native PDF child process |
| Forged prepared data rejected on reload; expansion limit returns 422 without job creation | Same API test |
| Repeatable isolated build/DB/API proof and cleanup | `scripts/checkRowGroups.mjs`; run with no arguments for the complete Service suite |

Final check: Service TypeScript build PASS; isolated Linux Docker suite
**174 passed, 0 failed, 0 skipped**. Core packaging build ran **484 tests in
61 files** and native checks successfully. Archive SHA-256:
`30e37e0bb38fd520f5d14e6d42e9766ae5bdd691e427a0edc4b947ae5d542ff4`.
New migration 013 only extends Section ownership to model 17; migrations
001–012 remain unchanged. Existing parent foreign keys and clone remapping
support the additional array level; no new tables or master types were needed.

RED/GREEN: old Service routing failed the new model-17 assembly tests before
integration. A new API test then reproduced EXPANSION_LIMIT incorrectly mapped
to 503; it now receives 422 and creates no job. Initial complete suite had 173
passing tests; the final suite includes this additional regression test.
Fresh read-only final review found no actionable or deferred minor findings.
Only removal of a trailing blank line in the API test followed the final test
run; candidate runtime/configuration remained identical. Staged diff check PASS.

Local evidence retained (ignored, not portable CI records):
- `flowdoc-core/artifacts/row-groups-0212/`: tarball and package build log.
- `flowdoc-service/artifacts/1791732320813/`: final result/build/test/cleanup logs.
- `flowdoc-service/artifacts/1791732135359/`: targeted expansion-limit RED proof.

Ten Service evidence files were copied and hash-checked; temporary DB
credentials were excluded. The package hash was checked after preservation.
Embedded worktree paths in logs are provenance. These are proof candidates
supported by committed tests, not DOCUMENT_MAP or product-readiness promotion.

Remaining: Part 4 keepStart pagination, then real SRS acceptance/performance.
No claim of large-document or production concurrency readiness. Release and
tags remain unchanged: Core `d06cd8a`, Service `7563151`.

Cleanup completed: removed only this round's clean merged package/Service
worktrees and temporary branches. The isolated Docker projects removed their
containers, volumes and task images. Both development checkouts are clean;
release refs were verified unchanged after fast-forward integration.
