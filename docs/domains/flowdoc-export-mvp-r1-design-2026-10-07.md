# FlowDoc Export MVP — R1 design

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Status: revised design, 2026-10-07, following owner agreement on one-level
subtemplates, inline variables, versioned examples and DB relationships.
Detailed contract remains for review; unresolved type policies are listed below.
No implementation started.
Authority: the owner's request to continue R1 in this conversation.
Registered execution IDs: not applicable. Scope authority:
[locked Export MVP v1](flowdoc-export-mvp-v1-2026-10-07.md).

This document defines contracts and repository boundaries within that MVP.
It records an owner-authorized scope clarification; it is not product Evidence or a claim of migration/runtime
parity. R2–R4 detailed layout, migrations and HTTP implementation plans remain
separate steps. Document budget for this request: this design plus a link in
the MVP. Proof budget: source-reference review, JSON syntax/reference checks,
and diff checks; no product tests or scaffolding in this design task.

## 1. ทางเลือกและข้อเสนอ

เสนอให้ใช้ node v4 เฉพาะส่วนที่ MVP ต้องใช้ พร้อม template envelope และ binding
ขนาดเล็ก แล้วเรียกกลไกข้อความ/ตาราง/PDF ที่คัดจากของเดิมผ่าน adapter ภายใน

- ย้ายระบบเก่าทั้งชุด: ใกล้เส้นทางเดิมที่สุด แต่พาระบบ publish, instance,
  session, media และ policy ที่อยู่นอก MVP ตามมาด้วย จึงไม่เลือก
- เขียน node และ renderer ใหม่: คุมรูปแบบได้เอง แต่ทิ้งสิ่งที่ลงทุนทำไว้
  และเสี่ยงย้อนปัญหาภาษาไทย จึงไม่เลือก
- ใช้ฐาน node เดิมกับสัญญาเล็กด้านหน้า: เป็นแนวทางที่เสนอ ต้องตรวจ adapter
  กับผลลัพธ์จริงใน R2 ก่อนถือว่า reuse สำเร็จ

นี่เป็นสัญญาใหม่ของ MVP ที่ใช้รูปทรง v4 เป็นฐาน ไม่อ้างว่าไฟล์ template ใหม่นี้
ส่งเข้า resolver เก่าได้โดยตรง หรือรองรับทุก node/prop ที่ schema เก่าอนุญาต

## 2. ข้อเท็จจริงจาก R0 ที่ใช้ตัดสินใจ

ตรวจ source ที่ Core `fa76c74356e5cfc9296f6a86c0bfac690e8416f6`
และ Backend `376d2981702cede3fc46dbede7ecb43c41fb36d9` โดยยังไม่รัน export ใหม่:

- `flowdoc-vnext-core/src/schema/documentV4Target.ts`: graph ของ section,
  zone, table, row, cell พร้อม ID และกฎตาราง
- `src/schema/documentV4ImageTarget.ts`: TextBlock มี children แบบ text/line-break
  และรองรับ children ว่าง; `documentV4Foundation.ts` มี content sizing และ style
- `src/resolution/resolvedDocument.ts`, `src/table/tableContentBindingV1.ts`,
  `src/table/tableContentMaterializationV1.ts`: มี field resolution และ collection binding
  แต่สัญญาเชื่อมกับ published structure/instance ของระบบเก่า
- `src/table/tablePaginationV1.ts`: pagination จาก prepared rows; มี cursor และ header policy
- `packages/uat-realdoc/src/uatMeasuredExport.ts` และ `local-runtime/index.ts`:
  ตัวอย่างต่อ resolution, native measurement, table pagination และ measured draw contract
- `packages/pdf-renderer-pilot/src/index.ts`: renderer คืน PDF bytes จากคำสั่งวาดที่วัดแล้ว
- `packages/text-engine-rust-wasm/src/node.ts` และ UAT native runtime ใช้ Rust subprocess;
  UAT local runtime ใช้ Python สร้าง font subset ไม่ใช่ JavaScript ล้วน
- `flowdoc-vnext-backend/src/pdfExport/pdfExportLocalRenderer.ts`: adapter เรียก renderer
  โดยไม่เขียน storage เอง; ระบบ workflow เก่ามีขอบเขตกว้างกว่า MVP

ใช้ไฟล์เหล่านี้เป็นต้นทางคัดส่วนและกรณีทดสอบ ไม่ถือว่าชื่อไฟล์หรือ test เก่า
พิสูจน์การทำงานของ SRS ใหม่แล้ว ความเท่ากันกับ editor ล่าสุดยังไม่ได้พิสูจน์

## 3. นิยามและขอบเขตที่แก้ตามเจ้าของ

Template คือโครงเล่มพร้อมชุดโครงย่อยที่ผู้สร้างเอกสารนั้นนิยามเอง
ไม่ได้เป็นรายการ paragraph/table สำเร็จรูปที่ระบบบังคับให้เลือก
ระบบมีชนิด node เป็นเครื่องมือ ผู้สร้างนำหลาย node มาประกอบเป็นโครงย่อย
ตั้งชื่อและกำหนดตัวแปรของแต่ละแบบ แล้วผู้เรียกส่งลำดับการใช้พร้อมข้อมูล

- โครงเล่มกำหนดหน้ากระดาษและจุดประกอบเนื้อหา; MVP หนึ่ง section/body flow
- แต่ละโครงย่อยเป็น fragment ที่มี rootIds กับกราฟ node ของตน ไม่ใช่กล่อง
  ความสูงคงที่และไม่ใช่หนึ่งหน้ากระดาษ เติมข้อมูลก่อนวัดและแบ่งหน้า
- โครงเล่มเรียกโครงย่อยได้หลายครั้ง; โครงย่อยเรียกโครงย่อยอื่นไม่ได้ใน MVP
- ตารางภายในโครงย่อยมี row repeat ได้ นี่เป็นการทำซ้ำข้อมูล ไม่ใช่การเรียกโครงย่อยซ้อน
- ตัวแปรเป็น field-ref inline ร่วมกับ text/line-break ใน TextBlock
  ไม่แทนทั้งกล่องและไม่ใช้ string interpolation หรือ script evaluator
- data กลางเล่ม, data ของแต่ละ invocation และ item ในตารางแยก scope
  tag ระบุ scope ชัด ไม่มี implicit lookup หรือ shadowing ข้าม scope
- ไม่มี form runtime ตอนนี้ label/description ของตัวแปรเป็น metadata ที่ใช้ได้
  ในอนาคต แต่ยังไม่เพิ่ม form layout, widget หรือ API สร้าง form

ชื่อ `formats`/`format` ด้านล่างหมายถึงโครงย่อยที่ผู้สร้างตั้งเองใน template
ไม่ใช่ชนิดไฟล์ PDF/DOCX และไม่ใช่ชนิด node
`content[]` เป็นรายการประกอบเอกสารใน request ไม่ใช่ field array ธุรกิจ

| ชั้น | หน้าที่ |
| --- | --- |
| TemplateDefinition | book, globalSchema, formats, styles, examples; immutable ต่อ version |
| GenerationInput | data กลาง + content[] ที่มี format/data เรียงตามผู้เรียก |
| PreparedInput | รายการที่ยอมรับ พร้อมค่าที่ resolve default แล้ว, original index, warnings |
| ResolvedDocument | ประกอบ fragments และแทน tags แล้ว พร้อม source map |
| LayoutResult | บรรทัด หน้า และ fragments ไม่เขียนกลับ template |
| PdfArtifact | bytes, media type, page count; Service เก็บและเปิดดาวน์โหลด |

schemaVersion คือรุ่นสัญญา template, nodeModelVersion: 4 คือฐานรูปแบบ node,
version คือรุ่น template; เป็นคนละค่า templateId/docKey เป็นตัวตน template
ชื่อ format unique ภายใน version นั้น ไม่ต้องมี version แยกต่อโครงย่อย

## 4. ระบบ type และการแทนค่าที่ตกลงแล้ว

นิยาม type กับ validation กับ display ต้องแยกกัน MVP เปิดใช้ string,
object สำหรับกลุ่มข้อมูล และ array<object> หนึ่งระดับของรายการธุรกิจ
ยังไม่เปิด number/date/boolean หรือ arbitrary nested arrays
โครง request ที่มี content และ data ไม่นับเป็นการเปิด nested business arrays

นิยามตัวแปรมี key จาก property name, type, required, default ถ้ากำหนด,
label/description ที่เป็น metadata และกฎ allowEmpty สำหรับ string

| input ของ string/array | กฎ |
| --- | --- |
| ไม่มี key และ required = true | error แม้มี default; รวม key ที่ขาดทั้งหมดก่อนตอบ ไม่สร้าง job |
| ไม่มี key, ไม่ required และมี default | ใช้ default ที่ผ่าน validation ของชนิดนั้น |
| ไม่มี key, ไม่ required และไม่มี default | string เป็น "", array เป็น [] |
| ส่งค่าถูกชนิดมาแล้ว | ใช้ค่าที่ส่ง ไม่ทับด้วย default |
| string ว่างหรือมีแต่ช่องว่าง | required ตรวจการมี key; ถ้า allowEmpty = false ให้ error โดยไม่แก้ข้อความ |
| null | ผิดชนิดสำหรับ type ของ MVP ไม่พิมพ์ "null" ลง PDF |

required/default ตรวจเมื่อไม่มี key จริง ๆ ไม่ใช้ truthiness; [] กับ "" ไม่ใช่ key ที่หาย
ค่า default ของ array/object ต้อง clone ต่อ invocation ไม่แชร์ mutable state
ตรวจ type และ default ตั้งแต่ลงทะเบียน; ถ้า default ขัด allowEmpty ถือว่า template ผิด
ไม่ trim ข้อความที่เก็บ/แสดง; CRLF/CR แปลงเป็น LF ใน binding แล้วสร้าง line-break
string ว่างแทน tag ด้วย inline ว่างจำนวนศูนย์ ไม่สร้าง text leaf ว่างที่ผิด node schema

MVP ใช้ object เป็น data envelope และ array item ไม่เปิด optional object field
ทั่วไปในรอบนี้ data ของ invocation ที่รู้จักต้องเป็น object รวมถึงกรณี {}
ถ้าชุดข้อมูลที่ต้องการหาย ต้องแจ้ง path ของชุดและ required children ที่ตรวจได้
ไม่สร้าง object ว่างเพื่อหลบ required validation

### เรื่องที่ยังไม่ตัดสินใจ — ไม่ใช้ข้อเสนอที่เกิดจากความเข้าใจผิดเป็นข้อตกลง

1. key ตัวแปรที่ไม่ได้ประกาศ: reject หรือ ignore พร้อม warning ยังไม่ได้ยืนยัน
2. key ถูกแต่ค่าผิดชนิดที่ไม่ใช่ null: reject หรือปฏิบัติเหมือน missing
   ยังไม่ได้ยืนยัน; ห้ามแปลงชนิดหรือใช้ default กลบโดยอัตโนมัติ

ข้อเสนอ conservative สำหรับ review คือ reject ทั้งสองกรณีพร้อม path
แต่ยังไม่เป็นกฎที่ล็อก ต้องสรุปก่อนเขียน data validator ใน R2
นโยบายข้ามชื่อ format ที่ไม่พบด้านล่างไม่ครอบคลุมสองกรณีนี้

## 5. สัญญา template และตัวอย่างประกอบเล่ม

ตัวอย่างนี้เป็น design JSON มีชื่อโครงย่อยที่ผู้สร้างตั้งสองแบบ
คำว่า field-ref และ scope เป็นสัญญา MVP ที่ต้อง map เข้ากลไก v4 เดิม
ไม่อ้างว่า payload นี้ผ่าน old schema ได้ตรง ๆ; source v4 มี field-ref แต่ไม่มี scope แบบนี้
styles เป็น registry ของ MVP, lineHeightPt ไม่ใช่ prop ที่เติมลง v4 TextRunStyle

```json
{
  "schemaVersion": 1,
  "nodeModelVersion": 4,
  "templateId": "tpl-srs-basic",
  "docKey": "srs-basic",
  "version": 1,
  "name": "SRS MVP",
  "book": {
    "page": {
      "size": "A4", "orientation": "portrait",
      "margin": {
        "top": { "value": 20, "unit": "mm" },
        "right": { "value": 20, "unit": "mm" },
        "bottom": { "value": 20, "unit": "mm" },
        "left": { "value": 20, "unit": "mm" }
      }
    },
    "contentSlot": "body"
  },
  "globalSchema": {
    "type": "object",
    "fields": {
      "projectName": { "type": "string", "required": true, "allowEmpty": false, "label": "ชื่อโครงการ" }
    }
  },
  "styles": {
    "body": { "fontFamilyKey": "ibm-plex-sans-thai", "fontWeight": "normal", "fontSize": { "value": 12, "unit": "pt" }, "lineHeightPt": 18 }
  },
  "formats": {
    "section-note": {
      "label": "ข้อความประกอบหัวข้อ",
      "inputSchema": {
        "type": "object",
        "fields": { "text": { "type": "string", "required": true } }
      },
      "fragment": {
        "rootIds": ["note"],
        "nodes": {
          "note": {
            "id": "note", "type": "text-block", "role": { "role": "paragraph" },
            "props": { "textStyleId": "body", "sizing": { "mode": "content" } },
            "children": [
              { "id": "prefix", "type": "text", "text": "โครงการ " },
              { "id": "project", "type": "field-ref", "scope": "global", "key": "projectName" },
              { "id": "separator", "type": "text", "text": ": " },
              { "id": "note-value", "type": "field-ref", "scope": "local", "key": "text" }
            ]
          }
        }
      },
      "repeats": []
    },
    "requirement-list": {
      "label": "ตารางข้อกำหนด",
      "inputSchema": {
        "type": "object",
        "fields": {
          "items": {
            "type": "array", "required": true,
            "items": {
              "type": "object",
              "fields": {
                "code": { "type": "string", "required": true },
                "detail": { "type": "string", "required": true },
                "remark": { "type": "string", "required": false, "default": "ไม่ระบุ" }
              }
            }
          }
        }
      },
      "fragment": {
        "rootIds": ["table"],
        "nodes": {
          "table": { "id": "table", "type": "table", "props": { "headerRowCount": 1, "repeatHeaderRows": true }, "columns": [{ "width": { "value": 25, "unit": "mm" } }, { "width": { "value": 110, "unit": "mm" } }, { "width": { "value": 35, "unit": "mm" } }], "rowIds": ["header", "row"] },
          "header": { "id": "header", "type": "table-row", "props": { "allowBreak": false }, "cellIds": ["hc", "hd", "hr"] },
          "hc": { "id": "hc", "type": "table-cell", "props": {}, "childIds": ["htc"] },
          "hd": { "id": "hd", "type": "table-cell", "props": {}, "childIds": ["htd"] },
          "hr": { "id": "hr", "type": "table-cell", "props": {}, "childIds": ["htr"] },
          "htc": { "id": "htc", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "hct", "type": "text", "text": "รหัส" }] },
          "htd": { "id": "htd", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "hdt", "type": "text", "text": "รายละเอียด" }] },
          "htr": { "id": "htr", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "hrt", "type": "text", "text": "หมายเหตุ" }] },
          "row": { "id": "row", "type": "table-row", "props": { "allowBreak": true }, "cellIds": ["rc", "rd", "rr"] },
          "rc": { "id": "rc", "type": "table-cell", "props": {}, "childIds": ["rtc"] },
          "rd": { "id": "rd", "type": "table-cell", "props": {}, "childIds": ["rtd"] },
          "rr": { "id": "rr", "type": "table-cell", "props": {}, "childIds": ["rtr"] },
          "rtc": { "id": "rtc", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "code", "type": "field-ref", "scope": "item", "key": "code" }] },
          "rtd": { "id": "rtd", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "detail-prefix", "type": "text", "text": "ระบบต้อง " }, { "id": "detail", "type": "field-ref", "scope": "item", "key": "detail" }] },
          "rtr": { "id": "rtr", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "remark", "type": "field-ref", "scope": "item", "key": "remark" }] }
        }
      },
      "repeats": [{ "tableId": "table", "rowTemplateId": "row", "source": { "scope": "local", "key": "items" } }]
    }
  },
  "examples": [
    {
      "name": "normal",
      "request": {
        "docKey": "srs-basic", "version": 1,
        "data": { "projectName": "ระบบจัดการเอกสาร" },
        "content": [
          { "format": "section-note", "data": { "text": "ขอบเขตการทำงาน" } },
          { "format": "requirement-list", "data": { "items": [{ "code": "REQ-001", "detail": "สร้าง PDF ได้" }] } },
          { "format": "section-note", "data": { "text": "รายละเอียดหลังตาราง" } }
        ]
      }
    }
  ]
}
```

ตัวอย่างผล resolve: note แรกเป็น "โครงการ ระบบจัดการเอกสาร: ขอบเขตการทำงาน"
ตามด้วยตารางหนึ่งแถวที่ remark เป็น "ไม่ระบุ" แล้วตามด้วย note อีกชุด
ทั้งสอง note ใช้โครงเดียวกันแต่ข้อมูลและ generated IDs เป็นอิสระ
reorder content เปลี่ยนลำดับประกอบ ไม่เปลี่ยน definition ของ format

### Identity และ structural validation

- แต่ละ fragment มี IDs unique ภายใน; คนละ format ใช้ชื่อ node เดียวกันได้
- proposed generated prefix คือ `content-<originalIndex>~<sourceId>`;
  แถวซ้ำต่อด้วย `~item-<index>`; inline ที่สร้างจาก tag ต่อด้วย `~part-<index>`
  ห้าม source ID มี `~` เพื่อกันการชน; sourceMap เก็บ original content index,
  format key, source node/inline ID และ item index แยกจาก generated ID
- ข้าม format ที่ไม่พบแล้วห้าม renumber originalIndex ใน diagnostics/sourceMap
- clone subtree พร้อมแก้ references; ไม่แชร์ node object ข้าม invocation
- rootIds/child references ต้องครบ ไม่มี cycle, orphan หรือหลาย parent
  table มีคอลัมน์ตรงจำนวน cell, header ไม่ใช่ rowTemplate; repeat อยู่ใน table จริง
- item tags อยู่ใน subtree ของ row repeat เท่านั้น; global/local tags อ่าน schema
  ของ scope นั้น; key ไม่มี expression หรือ dotted path
- tag ที่ชี้ array/object เป็น template error เพราะไม่ได้ใช้เป็นข้อความโดยตรง
- default, style, tag และ duplicate format key ต้องตรวจตอนลงทะเบียน
  JSON reader ต้องไม่ปล่อย duplicate property ถูกทับเงียบ ๆ ก่อน validator เห็น
- row template ไม่ถูกพิมพ์แถม; items=[] ลบต้นแบบ/ลูกออก เหลือ header
- text หลังแทน tag สืบทอด style ของตำแหน่ง tag/parent ตาม adapter ที่ R2 ต้องนิยาม;
  ไม่บังคับให้หนึ่ง tag เป็นหน่วยห้ามตัดบรรทัด
- ไม่รองรับ invocation node ภายใน fragment; ไม่เปิด arbitrary code, import หรือ recursion

### Unknown format และผลที่มีคำเตือน

รับ `content[]` ตามลำดับ ตรวจรูปแบบ envelope ก่อน
ชื่อ format ที่ไม่พบให้ข้ามรายการนั้นพร้อม UNKNOWN_FORMAT ที่ path เดิม
ไม่ validate data ของรูปแบบที่ไม่รู้จัก, ไม่เดาชื่อใกล้เคียง, ไม่พิมพ์ placeholder ลง PDF
format ต้องเป็น string ไม่ว่าง; envelope ที่ผิดรูปแบบไม่ใช่ unknown-format warning

ถ้ารู้จัก format แต่ขาด required ให้รวม error ทุกจุดแล้วไม่สร้าง job
ถ้าทุกรายการถูกข้ามหรือ content=[] ให้ EMPTY_CONTENT และไม่สร้าง job
เกณฑ์นี้นับ invocation ที่ยอมรับ ไม่ใช่จำนวนตัวอักษร; ไม่ขยายเป็นตัวตรวจความว่างเชิงภาพ
warnings ยังส่งคืนร่วมกับ errors ได้แม้ request ถูกปฏิเสธ

เมื่อมีรายการที่ยอมรับและไม่มี error ให้สร้าง job พร้อม warnings และ original input
warnings อยู่กับ job ตลอดทั้ง queued/running/succeeded/failed ไม่หายเมื่อ process restart
succeeded หมายถึงสร้างส่วนที่ยอมรับสำเร็จ ไม่ได้หมายความว่ารับทุก content item
API ระบุ `hasWarnings` และ skipped content indices ชัด; ไม่มีสถานะใหม่ใน state machine

```json
{
  "jobId": "job-example-001",
  "templateVersion": 1,
  "status": "queued",
  "hasWarnings": true,
  "warnings": [
    { "code": "UNKNOWN_FORMAT", "path": "content[1].format", "format": "requiremnt", "action": "skipped" }
  ],
  "skippedContentIndices": [1]
}
```

ตัวอย่าง response นี้ใช้กับ request ที่มี known content ร่วมกับ format
สะกดผิดที่ index 1 ไม่ใช่ response ของตัวอย่าง normal ด้านบน

## 6. ตัวอย่างการเรียก, Core boundary และ DB

### สัญญาที่คนเรียกดูได้

API อ่าน contract ตาม docKey/version คืน resolved version, globalSchema,
ชื่อ/label/inputSchema ของแต่ละ format และ examples ที่ผูก version นั้น
ถ้าไม่ระบุ version เลือก latest ที่ลงทะเบียนแล้วและคืน version ชัดเจน
ผู้เรียกควรใช้ version ที่ได้ในการสร้างงานเพื่อไม่เปลี่ยนความหมายระหว่างอ่านกับส่ง
ไม่คืน graph node, executable path หรือข้อมูล job ของคนอื่นใน contract response
ไม่มี frontend/documentation portal เพิ่มใน MVP

normal examples เก็บใน template version ต้องผ่าน validator เดียวกับ generation
ตอนลงทะเบียน โดยต้องไม่มี error หรือ warning; example version/docKey ต้องตรง owner
negative examples สำหรับแสดง errors/warnings อยู่ใน fixture/docs และระบุ expected outcome
ไม่ปะปนกับ normal examples ที่ใช้ยืนยัน template registration

| Fixture ที่ต้องมีใน R2/R4 | ผลที่ตรวจ |
| --- | --- |
| สอง custom formats, เรียกแบบ A/B/A | แทน inline tags ถูก, ใช้ซ้ำไม่ปน, สลับลำดับได้ |
| items=[] ใน table invocation ที่รู้จัก | มี header ไม่มีแถวปลอม |
| items/ข้อความยาว | table และ row ข้ามหน้า ข้อมูลครบ |
| required หายหลายที่ | คืนทุก path ไม่สร้าง job แม้มี default |
| optional หาย มี/ไม่มี default | default หรือค่าว่างตาม type |
| unknown format ปน known | PDF เฉพาะ known, warning/path/index คงอยู่ |
| unknown ทั้งหมดหรือ content=[] | EMPTY_CONTENT ไม่สร้าง job |
| contract lookup version เก่า/ใหม่ | schema/example และ generation pin version เดียวกัน |
| default/tag ผิด, format name ซ้ำ | registration error |

### Core interface เชิงตรรกะ (ยังไม่ใช่ implementation)

```ts
validateTemplate(input: unknown): Result<ValidatedTemplate>;
prepareGeneration(template: ValidatedTemplate, input: unknown): Result<PreparedInput>;
composeDocument(template: ValidatedTemplate, input: PreparedInput): Result<ResolvedDocument>;
createPdfEngine(resources: ExportResources): Promise<Result<PdfEngine>>;
// PdfEngine.generatePdf(resolvedDocument) -> Promise<Result<PdfArtifact>>
// PdfArtifact = { bytes: Uint8Array; mediaType: "application/pdf"; pageCount: number }
// Result<T>: ok/value หรือ ok:false/issues; ทั้งสองมี warnings[]
// Issue: code, path, message และ optional contentIndex/format/nodeId
```

Service เลือก immutable version แล้วให้ Core ตรวจ/prepare ก่อน queued
บันทึก original request, prepared input (accepted entries/defaults/original indices),
warnings และ version ใน transaction เดียวเพื่อไม่ให้ processor resolve ต่างจากที่รับ
processor ตรวจ persisted shape/reference ก่อน compose แต่ไม่เลือก latest ใหม่
Core ไม่รู้ DB/HTTP/job state; Service ไม่คัดลอกกฎ type/binding มาตรวจเองคนละชุด

Core errors รวม INVALID_TEMPLATE, INVALID_DATA, UNKNOWN_FORMAT (warning),
EMPTY_CONTENT, RESOURCE_UNAVAILABLE, LAYOUT_FAILED, PDF_RENDER_FAILED
Service เพิ่ม TEMPLATE_NOT_FOUND, VERSION_NOT_FOUND, JOB_NOT_FOUND,
OUTPUT_NOT_READY, OUTPUT_NOT_FOUND, STORAGE_FAILED, PROCESS_INTERRUPTED
ไม่ส่ง stack trace หรือ path ภายในเป็น public error; route/status code ที่แน่นอนอยู่ R4

### ความสัมพันธ์เชิงข้อมูลเทียบกับที่เก็บจริง

| ข้อมูล | ที่เก็บจริงใน MVP | ความสัมพันธ์ |
| --- | --- | --- |
| ตัวตนเอกสาร | templates | id, unique docKey |
| โครงเล่ม, global schema, formats/ตัวแปร, styles, normal examples | template_versions.definition_json | อยู่ใน immutable version เดียว ไม่แตกเป็นตารางย่อย |
| คำขอ, accepted/defaulted data, warnings, errors, status | generation_jobs | FK ไป template_versions.id ที่เลือกแน่นอน |
| PDF metadata/path | document_outputs | unique FK ไป job.id; job มี output 0..1 |

Template 1:N Version; Version 1:N Job; Job 1:0..1 Output
Formats เป็น children เชิงโครงสร้างใน JSON ไม่ใช่ entities ที่ต้องมี FK/version แยก
เพิ่ม/แก้ format, tag, default, schema หรือ example ต้องลง version ใหม่ทั้งชุด
job เก่าไม่เปลี่ยนตาม ส่วน job ที่จบแล้วห้ามเขียน input/warnings ใหม่ตาม template รุ่นใหม่
ข้อบังคับ JSON และตัวอย่างตรวจใน registration; FK/unique ตรวจใน DB ด้วย

### ไล่หนึ่งงานตั้งแต่ต้นจนจบ

1. ผู้สร้างเตรียม template พร้อม formats และ normal example แล้วเรียก register command
2. ตรวจ graph/tags/types/defaults/examples สำเร็จจึง insert immutable version
   ความล้มเหลวต้องไม่เหลือ version ที่เลือกใช้ได้เพียงครึ่งเดียว
3. ผู้เรียกอ่าน contract/example ของ version 1 แล้วส่ง docKey/version/data/content
4. Service เลือก version 1; Core prepare/validate รวม errors และ warnings
5. ถ้า error ไม่มี ให้ insert queued job + original/prepared input + warnings
6. serial processor โหลด version ที่ job อ้างไว้, compose fragments, bind tags,
   วัดและแบ่งหน้า แล้ว render PDF
7. เก็บไฟล์และ output metadata สำเร็จจึงเปลี่ยน succeeded; ถ้าล้มเหลวเป็น failed
8. อ่าน status เห็น version/warnings/download; ดาวน์โหลดเฉพาะ output ของ job นั้น

ขอบเขต transaction/file recovery รายละเอียดอยู่ R3/R4 ตาม MVP เดิม
ไม่มี exactly-once, cloud storage, multi-worker หรือ retry อัตโนมัติเพิ่มใน R1

## 7. ขอบเขต repo และการตั้งชื่อ

```text
flowdoc-core/
  src/
    index.ts          public exports ที่ตั้งใจให้ใช้เท่านั้น
    template/         template schema และ graph validation
    data/             input validation
    binding/          inline tags, scoped values, row expansion
    composition/      format invocation, cloned graph และ source mapping
    layout/           orchestration ของ measurement/pagination
    pdf/              draw contract และ PDF bytes
    runtime/          adapters ของ text engine/font resources
  tests/              จัดกลุ่มตามหน้าที่ข้างบน
  fixtures/srs-basic/ template และข้อมูลทดสอบคงที่

flowdoc-service/
  src/
    app.ts            สร้างแอปจาก dependencies สำหรับทดสอบ
    server.ts         อ่าน config และเริ่ม/หยุด process
    templates/        register/load/select immutable version
    jobs/             create/query/process และ serial loop
    storage/          บันทึกและอ่าน PDF
    db/               connection กับ SQL repositories
    http/             routes, request/response และ error mapping
  migrations/
  scripts/            migration และ register-template ในเครื่อง
  tests/
```

- Type/interface: PascalCase; function/variable: camelCase; file: camelCase.ts
- ฟังก์ชันเริ่มด้วยกริยาตามงาน เช่น validateTemplate, prepareGeneration, composeDocument,
  expandRows, generatePdf, registerTemplate, createJob, processNextJob
- ไม่เพิ่ม prefix ยาวแบบ FlowDocVNext ให้ทุก symbol; public contract รุ่นใช้
  schemaVersion/contract version ส่วนชื่อฟังก์ชันใช้ V2 เมื่อจำเป็นต้องอยู่คู่รุ่นเดิมจริง
- ไม่รวม HTTP, SQL, mapping และ rendering ไว้ไฟล์เดียว; ไม่สร้าง utils.ts
  เป็นที่รวมงานคนละหน้าที่ และไม่สร้าง base class ก่อนมีเหตุจำเป็น
- Service import ผ่าน public package เท่านั้น ไม่มี deep import เข้า src ของ Core
- Core ไม่ import Service, React, DOM, editor session หรือ concrete DB
- runtime adapter ที่จำเป็นต่อ export อยู่ Core และถูกส่ง dependencies ชัดเจน;
  bootstrap เป็นผู้เตรียม resource paths ไม่ให้ schema/binding เรียก process เอง

## 8. Stack และ runtime ที่เสนอ

- TypeScript strict + Node.js; Core เป็น package ที่ build ได้ ไม่ต้องอาศัย
  Vite SSR loader ของชุดทดลองเก่าเพื่อเรียก production entrypoint
- Service: Fastify; DB: PostgreSQL ผ่าน pg; migration เป็น SQL ที่เก็บใน repo
- Validation: Zod สำหรับ envelope และการตรวจ inputSchema DSL แบบจำกัด
- Tests: Vitest; ตรวจ PDF จริงเพิ่มเติมตาม MVP ไม่ใช้ unit test แทนการตรวจภาพ
- Text/PDF: คัด Rust shaping/segmentation และ measured PDF renderer เดิม
  font subset ใช้ Python tool เดิมผ่าน adapter ถ้าการทดลอง R2 ยืนยันว่าใช้ได้
- ฟอนต์เริ่มต้น IBM Plex Sans Thai regular ตามเส้นทาง export ที่ตรวจพบ
  จัดเก็บไฟล์และ license ที่นำมาใช้; ไม่อ้าง parity กับ Sarabun ใน editor
- Rust build เป็นขั้นเตรียม runtime ไม่ build ระหว่างรับ request;
  เริ่ม service ต้องตรวจ prerequisite และรายงานสิ่งที่ขาดชัดเจน
- ไม่ติดตั้งหรือเลือกเลขเวอร์ชัน dependency ใน R1; pin เวอร์ชันที่ตรวจร่วมกัน
  ใน implementation plan/lockfile ก่อนลงมือ ไม่ตาม latest โดยอัตโนมัติ

นี่เป็นตัวเลือกการออกแบบ ไม่ใช่ผลพิสูจน์ว่า runtime รวมนี้พร้อมแล้ว
R2 ต้องทดลอง font/Thai wrapping/row seams บนเส้นทางที่เลือกก่อนย้ายส่วนใหญ่
หากไม่ผ่านให้กลับมาระบุข้อจำกัดเฉพาะ adapter ไม่เปลี่ยน engine หรือขยาย scope เงียบ ๆ

## 9. ส่งต่อแต่ละช่วงและเกณฑ์ review R1

- R2 รับ template/data/binding นี้ไปออกแบบ adapter, line/layout contract,
  empty-line behavior, pagination และ font preparation; ต้องให้ template
  เป็นตัวกำหนดโครง ไม่ hardcode SRS เป็น renderer ตัวใหม่
- R3 รับ envelope immutable และ identity ไปทำตารางสี่ส่วนตาม MVP;
  template_versions เก็บ payload JSON นี้พร้อม unique version ไม่แตก node เป็นแถว DB
- R4 รับ Core result และ errors ไปกำหนด routes/status/transaction boundaries;
  Service เลือก version, เก็บ job และ output; Core ไม่ทำสิ่งเหล่านี้
- การ reuse native path ต้องวัดความถูกต้องและรายงานข้อจำกัด ไม่เปิดโครงการ
  performance ใหม่ งานคิวหนัก/หลาย worker ยังอยู่นอก scope

R1 พร้อมให้ review เมื่อ: template/request/examples สอดคล้อง, tags/format references
ชัดเจน, array ว่าง/ยาวและ missing-value policy ครบ, ไม่มีข้อกำหนดนอก MVP
และ ownership ชัดเจน ต้องปิดสองประเด็น type ที่ยังไม่ตัดสินใจก่อน implementation
ของ validator เกณฑ์นี้ไม่เท่ากับ R2 runtime ผ่าน

Next decision: เจ้าของ review สัญญา template/binding และขอบเขต repo นี้
จากนั้นจึงทำ implementation plan สำหรับ R2 ที่มี prerequisite probe ชัดเจน


## Revision history

- 2026-10-07: owner-authorized correction from fixed document/whole-block binding
  to creator-defined one-level subtemplates, inline tags and ordered invocations.
  Adds versioned caller contracts/examples and warning persistence without new DB tables.
- Prior proposal at commit 85af94f retained in Git history; its fixed-body JSON,
  ban on field-ref and whole-TextBlock replacement are no longer current design.
- Unknown variable key/wrong-type handling remains explicitly unresolved; the
  earlier discussion based on confusing variable keys with format names is not approval.
