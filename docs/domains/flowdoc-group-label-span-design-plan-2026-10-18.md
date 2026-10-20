# FlowDoc: เซลล์ชื่อกลุ่มครอบแถวสมาชิกและชื่อกลุ่มในหน้าต่อ

## Authority Boundary และสถานะ

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
สถานะ: **ช่วง 0–5 ผ่านตามขอบเขตเซลล์ชื่อกลุ่มและเตรียมส่งมอบ เมื่อ 2026-10-18**.
Core candidate รับ declaration ขยายข้อมูลและจัดหน้า; Service/FlowDocMake เชื่อมแล้ว.
ชุดพัฒนา Core/Service 0.4.4 และ FlowDocMake 0.2.5 รวมเข้าตัวหลักแล้วเมื่อ 2026-10-19.
เก็บกวาด branch/worktree ชั่วคราวที่รวมครบแล้ว; ยังไม่ขึ้น release/push/tag/ติดตั้ง.
หก external font-height checks ยังไม่ยืนยัน จึงไม่อ้าง readiness ครอบคลุมทุกฟีเจอร์.
คำขอผู้ใช้วันที่ 2026-10-18 เป็น authority สำหรับงานเอกสารในห้องนี้;
Work/Phase/Checklist/execution IDs: N/A (single-room inline).
Core เป็นเจ้าของ schema, binding, composition, layout และ PDF;
Service เป็นเจ้าของ persistence, API และงาน PDF;
FlowDocMake เป็นเจ้าของเครื่องมือและคำแนะนำการสร้างแม่แบบผ่าน Service.

Work size: medium; risk: routine สำหรับงานตามสัญญาในรอบนี้.
Document budget: ปรับฉบับนี้ฉบับเดียว ใช้ลิงก์จาก contract เดิมที่มีแล้ว.
Proof budget ช่วง 0: ตรวจสัญญา/JSON/ลิงก์; ช่วง 1: focused/full Core tests,
build, packed consumer และ independent review หนึ่งรอบพร้อม regression ของข้อพบ;
ช่วง 2 เพิ่ม layout/PDF tests และตรวจภาพทุกหน้าของ PDF ทดสอบใหม่.
ช่วง 0 ไม่แก้ runtime; ช่วง 1–2 แก้เฉพาะ Core declaration/composition/layout และ tests
ใน worktree แยก. ไม่แก้ DB, draft, release, การติดตั้ง หรือ DOCUMENT_MAP.
ไม่เปิด execution เก่าหรือถือว่าได้เปลี่ยนโมเดลของห้อง.
เมื่อเริ่มพัฒนาให้เลือกโมเดลและฐานงานตาม workflow ปัจจุบันอีกครั้ง.

อ่านฉบับนี้เป็นทางเข้าของงานใหม่; อ่าน
[contract กลุ่มแถวเดิม](flowdoc-table-row-groups-contract-2026-10-11.md)
เฉพาะเมื่อต้องใช้รายละเอียดเดิม ไม่ต้องอ่านประวัติทุกส่วนเพื่อเริ่มงาน.

## 1. เป้าหมายและของเดิมที่ใช้ต่อ

ให้แม่แบบประกาศเซลล์ชื่อกลุ่มเพียงครั้งเดียว แล้วระบบคำนวณการครอบแถว
จากสมาชิกจริง เมื่อกลุ่มไหลข้ามหน้าให้แสดงชื่อกลุ่มพร้อมคำว่า “(ต่อ)”.
แรงจูงใจจากแม่แบบ UAT: การผูกข้อมูลแบบแบนและกำหนด rowSpan ตายตัว
ทำให้จำนวนสมาชิกเปลี่ยนแล้วต้องแก้แม่แบบตาม ไม่ใช่รูปแบบรับข้อมูลเป้าหมาย.

| เรื่อง | ของเดิมที่มี | ส่วนที่ต้องเพิ่ม |
| --- | --- | --- |
| กลุ่มและสมาชิก | rowGroups รับกลุ่มพร้อมสมาชิกและขยายแถวตามจำนวนจริง | ระบุเซลล์ชื่อกลุ่มที่ครอบสมาชิกโดยไม่ส่งจำนวน rowSpan |
| เซลล์รวม | rowSpan/colSpan แบบกริดตายตัว | การครอบแถวที่ได้จากขอบเขตสมาชิกของแต่ละกลุ่ม |
| กลุ่มว่าง | prefix กับ emptyRow ที่แม่แบบกำหนด | จัดชื่อกลุ่มให้สัมพันธ์กับแถว “ไม่มีรายการ” โดยไม่สร้างสมาชิกปลอม |
| ข้ามหน้า | ตารางไหล ซ้ำหัวตาราง และเซลล์รวมตายตัวต่อหน้าได้ | แสดงชื่อกลุ่มในทุกชิ้นของกลุ่ม พร้อม “(ต่อ)” หลังหน้าแรก |
| จุดเริ่มกลุ่ม | keepStart รักษา prefix กับส่วนแรกของสมาชิก | ใช้ร่วมกับเซลล์ชื่อกลุ่มแบบใหม่ และตรวจว่าต้องเริ่มกลุ่มได้จริง |
| fixed | จำกัดความสูงตามพื้นที่ใช้ได้และแจ้งส่วนที่ไม่ได้แสดง | ให้คำเตือนเดิมครอบคลุมข้อมูลกลุ่มใหม่ ไม่เปลี่ยนเป็น auto |

หลักฐานฐานเดิมที่ตรวจอ่าน: Core `src/template/rowGroups.ts`,
`src/template/types.ts`, `src/binding/expandRows.ts`,
`src/composition/tableGrid.ts`, `src/composition/composeDocument.ts`,
`src/composition/resolvedDocument.ts` และ `src/layout/cellTableFlow.ts`.
ฐานที่ตรวจคือ Core `293c293eb331666868c7b24e6ff6038ede6e6eb9`;
มีงานแก้ตัวเลขพิกัด PDF แยกอยู่ด้วย จึงต้องเลือกฐานและขอบเขตอีกครั้งก่อนพัฒนา.

การตรวจฐานเมื่อ 2026-10-18: `mergedTable.test.ts`, `rowGroups.test.ts`,
`mergedTableFlow.test.ts`, `rowGroupFlow.test.ts` รวม 59 tests ผ่าน.
นี่เป็นหลักฐานพฤติกรรมเดิม ไม่ใช่ผลตรวจรับความสามารถใหม่.
ปัจจุบัน validation ยังห้าม rowSpan > 1 แตะแถว repeat/rowGroup หรือข้ามขอบกลุ่ม.
แผนนี้จะเพิ่มข้อยกเว้นเฉพาะกลไกชื่อกลุ่มที่กำหนดไว้ ไม่ปลดข้อห้ามทั้งหมด.

## 2. นิยามและข้อมูล

“เซลล์ชื่อกลุ่ม” คือเซลล์ในตารางที่แม่แบบกำหนดให้แสดงชื่อของกลุ่มและครอบ
แถวสมาชิกในกลุ่มนั้น รองรับกลุ่มหนึ่งระดับก่อน ไม่ใช่ Section, Area หรือ Format ใหม่.
Area/Format ยังใช้บทบาทเดิม; rowGroups เป็นเจ้าของการขยายข้อมูลกลุ่ม.

ตัวอย่าง **ข้อมูลธุรกิจเท่านั้น** ไม่ใช่ JSON request เต็มหรือ schema ใหม่ที่ใช้ได้แล้ว:

```json
{
  "groups": [
    {
      "name": "Module A",
      "members": [
        { "requirement": "ตรวจข้อมูล", "result": "ผ่าน" },
        { "requirement": "บันทึกข้อมูล", "result": "ผ่าน" }
      ]
    },
    { "name": "Module A", "members": [] }
  ]
}
```

ชื่อ `groups`, `name`, `members` เป็นตัวอย่างชื่อที่แม่แบบผูกได้ ไม่ใช่ชื่อสงวน.
ผู้เรียกส่งชื่อและรายการสมาชิก ไม่ต้องคำนวณ rowSpan หรือแบ่งข้อมูลตามหน้ากระดาษ.
สอง object แม้ชื่อเหมือนกันก็เป็นคนละกลุ่ม รักษาลำดับและขอบเขตเดิมเสมอ.
สมาชิกหนึ่งรายการอาจใช้หลายบรรทัดหรือหลายหน้า แต่ยังนับเป็นสมาชิกหนึ่งรายการ.
ID และ source mapping ต้องอ้างกลุ่ม/สมาชิกจริง ไม่สร้างตัวตนธุรกิจจากหน้าต่อ.

## 3. กติกาการครอบแถวและการขึ้นหน้า

1. เซลล์ชื่อกลุ่มครอบเฉพาะแถวสมาชิกของกลุ่มนั้น จำนวนเปลี่ยนตามข้อมูลจริง.
   หัวตาราง prefix แถวรวม และกลุ่มถัดไปไม่อยู่ใน span.
2. กลุ่มว่างแสดงชื่อกับแถว “ไม่มีรายการ” ตามแม่แบบ แต่จำนวนสมาชิกยังเป็นศูนย์.
   outer array ว่างยังใช้พฤติกรรมเดิม ไม่สร้างกลุ่มว่างขึ้นเอง.
3. auto เริ่มกลุ่มพร้อมส่วนต้นที่วางได้ของสมาชิกแรก หากท้ายหน้าไม่พอเริ่ม
   ให้ย้ายจุดเริ่มไปหน้าถัดไป ไม่บังคับทั้งกลุ่มให้อยู่หน้าเดียว.
4. ทุกหน้าที่มีส่วนของสมาชิกในกลุ่มต้องมีชื่อกลุ่มด้วย หน้าแรกใช้ชื่อเดิม
   หน้าถัดไปใช้ชื่อเดิมตามด้วย ` (ต่อ)` ไม่สะสมเป็น “(ต่อ) (ต่อ)”.
5. หน้าต่อซ้ำหัวตารางตามนโยบายเดิม แล้วเปิดกรอบชื่อกลุ่มสำหรับส่วนในหน้านั้น.
   ปิดเส้นตาราง/เซลล์ที่ขอบชิ้นต่อหน้า โดยไม่วาดเส้นซ้ำหรือกินพื้นที่เกินกรอบ.
6. สมาชิกที่แบ่งได้ไหลต่อเฉพาะเนื้อหาที่ยังไม่ได้แสดง ห้ามซ้ำข้อมูลสมาชิกทั้งแถว.
   สมาชิกที่ห้ามแบ่งย้ายทั้งแถวตามกติกาเดิม หากใหญ่เกินหน้าเต็มให้แจ้งข้อผิดพลาด.
7. ต้องวัดชื่อกลุ่มรวมคำว่า “(ต่อ)” ด้วย ไม่สมมติว่ามีความสูงเท่าเดิม.
   ถ้าชื่อหรือเนื้อหาจำเป็นที่แบ่งไม่ได้วางในหน้าเต็มไม่ได้ ให้แจ้งปัญหาที่ระบุจุดได้
   ไม่ตัดข้อความ ย่อฟอนต์ หรือวนขึ้นหน้าใหม่ไม่จบ.
8. ใช้ความสูงที่เหลือจริง รวม header/footer หัวตาราง padding และเส้นขอบ;
   รักษาทางออกเดิมของ keepStart กรณี prefix ใหญ่ผิดปกติพร้อมคำเตือน.
   แต่ห้ามปล่อยชิ้นสมาชิกโดยไม่มีชื่อกลุ่มตามข้อ 4.
9. เมื่อจบกลุ่มให้จบ span ก่อนกลุ่มถัดไป แถวรวมที่ผู้เขียนมีอยู่แสดงครั้งเดียว
   ในตำแหน่งเดิม ไม่สร้างยอดรวมรายหน้าและไม่เพิ่มการคำนวณยอดอัตโนมัติ.
   rowGroups เดิมไม่มี group suffix hook; งานนี้ไม่ถือว่าได้เพิ่ม hook ดังกล่าว.
10. fixed ใช้กรอบและนโยบายหยุด/แจ้งส่วนที่ไม่ได้แสดงเดิม ไม่ส่งส่วนเกินไปหน้าถัดไป.
    ชื่อกลุ่มและคำเตือนต้องอ้างส่วนที่แสดงจริงและส่วนที่เหลืออย่างถูกต้อง.

ชื่อซ้ำในหน้าต่อเป็นผลการแสดงเท่านั้น ข้อมูลต้นทางไม่เปลี่ยน ไม่เพิ่ม logical row,
กลุ่ม สมาชิก หรือ ID และไม่เพิ่มรายการสารบัญ/ปลายทางลิงก์ซ้ำ.
ไม่เปลี่ยนพฤติกรรมสารบัญที่ผู้ใช้เลือกใช้อยู่.

## 4. สัญญาช่วง 0 — groupLabelSpans v1

### 4.1 Declaration และกริด

เพิ่ม optional `groupLabel` ใน rowGroups แต่ละ declaration:
`{cellTemplateId, emptyCellTemplateId}`. ไม่ใส่ field นี้ใช้พฤติกรรมเดิมทุกประการ.
เซลล์แรกเป็นต้นแบบชื่อข้างสมาชิก เซลล์ที่สองเป็นต้นแบบชื่อข้าง emptyRow.
ชื่อมาจาก field-ref เดิมในเซลล์ ไม่เพิ่ม source อีกชุดที่อาจขัดกับ binding เดิม.

ตัวอย่าง AreaFormat **เฉพาะส่วน** สำหรับ model19; parent ต้องมี Area `uat-body`,
style `body`, page layout และ identity ที่ถูกต้องตามสัญญาเดิม:

```json
{
  "key": "grouped-results",
  "ownerAreaId": "uat-body",
  "sizing": { "mode": "auto" },
  "inputSchema": {
    "type": "object",
    "fields": {
      "groups": {
        "type": "array", "required": true,
        "items": {
          "type": "object",
          "fields": {
            "name": { "type": "string", "required": true, "allowEmpty": false },
            "members": {
              "type": "array", "required": true,
              "items": {
                "type": "object",
                "fields": { "requirement": { "type": "string", "required": true } }
              }
            }
          }
        }
      }
    }
  },
  "fragment": {
    "rootIds": ["results-table"],
    "nodes": {
      "results-table": { "id": "results-table", "type": "table", "props": { "headerRowCount": 0, "repeatHeaderRows": false }, "columns": [{ "width": { "value": 100, "unit": "pt" } }, { "width": { "value": 300, "unit": "pt" } }], "rowIds": ["member-row", "empty-row"] },
      "member-row": { "id": "member-row", "type": "table-row", "props": { "allowBreak": true }, "cellIds": ["member-group", "member-value"] },
      "member-group": { "id": "member-group", "type": "table-cell", "props": { "columnIndex": 0 }, "childIds": ["member-label"] },
      "member-label": { "id": "member-label", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "member-name-ref", "type": "field-ref", "scope": "group", "key": "name" }] },
      "member-value": { "id": "member-value", "type": "table-cell", "props": { "columnIndex": 1 }, "childIds": ["requirement-text"] },
      "requirement-text": { "id": "requirement-text", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "requirement-ref", "type": "field-ref", "scope": "item", "key": "requirement" }] },
      "empty-row": { "id": "empty-row", "type": "table-row", "props": { "allowBreak": false }, "cellIds": ["empty-group", "empty-value"] },
      "empty-group": { "id": "empty-group", "type": "table-cell", "props": { "columnIndex": 0 }, "childIds": ["empty-label"] },
      "empty-label": { "id": "empty-label", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "empty-name-ref", "type": "field-ref", "scope": "group", "key": "name" }] },
      "empty-value": { "id": "empty-value", "type": "table-cell", "props": { "columnIndex": 1 }, "childIds": ["empty-text"] },
      "empty-text": { "id": "empty-text", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "empty-leaf", "type": "text", "text": "ไม่มีรายการ" }] }
    }
  },
  "repeats": [],
  "rowGroups": [{
    "id": "requirement-groups",
    "tableId": "results-table",
    "rowTemplateIds": ["member-row", "empty-row"],
    "source": { "scope": "local", "key": "groups" },
    "memberRepeat": { "rowTemplateId": "member-row", "source": { "scope": "group", "key": "members" }, "emptyRowTemplateId": "empty-row" },
    "pagination": { "keepStart": true },
    "groupLabel": { "cellTemplateId": "member-group", "emptyCellTemplateId": "empty-group" }
  }]
}
```

กฎ validation ที่เพิ่ม:

- หนึ่ง groupLabel ต่อ declaration; cell ทั้งสองต้องอยู่ใน member/empty row
  ที่ระบุจริง คนละ ID แต่อยู่ `columnIndex` เดียวกัน มี `colSpan` เท่ากัน
  (ละไว้เท่ากับ 1) และอยู่ในขอบตาราง ไม่บังคับให้เป็นคอลัมน์แรก.
- cell แต่ละตัวมี text-block หนึ่งตัวและ field-ref หนึ่งตัวเท่านั้น;
  ทั้งคู่ `scope:group` และ `key` เดียวกัน อ้าง string schema ที่
  `required:true, allowEmpty:false`. ไม่อนุญาต link, anchor, toc, page field,
  image, cellRepeats หรือ fixed-height text-block ในเซลล์ชื่อนี้ใน v1.
  ใช้ style/wrap/padding/fill และ textAlign เดิม; ไม่เพิ่ม vertical alignment API.
- ห้ามกำหนด `rowSpan` เองในเซลล์ชื่อทั้งสอง แม้ค่า 1; engine คำนวณเท่านั้น.
  ห้าม span อื่นกินช่องชื่อหรือข้ามขอบกลุ่ม และห้ามเซลล์ถูกใช้ซ้ำต่าง declaration.
- เมื่อมี groupLabel เท่านั้น `rowTemplateIds` ยอมให้เหลือ member + empty
  สองแถวได้ หรือมี prefix ตามเดิม; member ยังเป็นรองสุดท้าย empty ยังเป็นสุดท้าย.
  แถวต้องติดกันและไม่ทับ header/repeat/group อื่นเหมือนเดิม.
- ต้องใช้ `pagination.keepStart:true`; ละไว้มีค่า true สำหรับ declaration นี้
  แต่ระบุ false ถือว่า INVALID_TEMPLATE. declaration เดิมที่ไม่มี groupLabel
  ยังคง default และข้อกำหนด prefix เดิม ไม่แปลงข้อมูลเดิมอัตโนมัติ.
- คีย์ที่ไม่รู้จักใน groupLabel เป็น INVALID_TEMPLATE; ไม่มี field suffix ใน v1.
  suffix เป็น literal ` (ต่อ)` คงที่และรวมอยู่ใน capability.

### 4.2 Request, จำนวนสมาชิก และตัวตน

request ใช้ envelope model19 เดิม ไม่มี rowSpan, continuation flag หรือ page index
ในข้อมูลธุรกิจ. ตัวอย่างนี้ใช้ Section ID สมมติ; งานจริงใช้ ID ในแม่แบบที่บันทึกแล้ว:

```json
{
  "docKey": "group-label-example",
  "data": {},
  "sections": [{
    "id": "10000000-0000-4000-8000-000000000011",
    "data": {
      "body": [{ "format": "grouped-results", "data": {
        "groups": [
          { "name": "Module A", "members": [{ "requirement": "R1" }, { "requirement": "R2" }] },
          { "name": "Module B", "members": [] },
          { "name": "Module A", "members": [{ "requirement": "R3" }] }
        ]
      }}]
    }
  }]
}
```

parent Section ต้องประกาศ `body` เป็น Area `uat-body` และจับคู่ format นี้.
ตัวอย่างส่งออกเป็น 3 กลุ่ม ตาม index 0,1,2; สมาชิกจริง 3 รายการ
และ empty placeholder 1 แถว. span เชิงตรรกะของแต่ละกลุ่ม = 2,1,1 แถว
แต่ memberCount = 2,0,1. outer `groups:[]` ให้ศูนย์กลุ่มและศูนย์ placeholder.
prefix/header/total ไม่รวมใน span หรือ memberCount.

สำหรับ n > 0: ขยาย member row n แถว ให้เซลล์ชื่ออยู่แถวแรกและครอบ n แถว;
แถวที่เหลือไม่สร้างสำเนาเซลล์ชื่อนั้นมาทับกริด. สำหรับ n = 0: ใช้ empty row
กับ emptyCellTemplateId เพียงครั้งเดียว ห้ามสร้างสมาชิกปลอมและห้ามใช้ item scope.
missing/null/wrong-type ไม่เท่ากับ []; ใช้ required/default/unknown-key rules เดิม.
ชื่อหายใช้ MISSING_REQUIRED; ชื่อไม่ใช่ string ใช้ TYPE_MISMATCH;
ชื่อว่างหรือมีแต่ช่องว่างใช้ INVALID_DATA ตาม validator เดิม.
ไม่ trim, sort, deduplicate หรือรวมชื่อที่ตรงกัน; ถ้ามีช่องว่างข้างชื่อก็เก็บและแสดงเดิม.

identity ของหนึ่งกลุ่มประกอบจาก source location ของ Format instance,
declaration ID และ groupIndex; member เพิ่ม itemIndex. `groupId` ใน sourceMap คือ declaration ID
ไม่ใช่ชื่อกลุ่มหรือ ID จากลูกค้า. label/empty มี groupIndex และไม่มี itemIndex;
member จริงมี itemIndex ตามเดิม. span ที่ได้จาก composition ต้องมี provenance
ให้ validateResolvedDocument แยกจาก rowSpan ที่ผู้ใช้ปลอมเข้ามาได้.

clone/import ใช้การสร้าง Section/Area/Format identity ตามเดิม.
ID ภายใน fragment/declaration อยู่ใน local scope ของตนและคงค่าได้;
หาก importer remap local ID ต้อง remap tableId, rowTemplateIds,
memberRepeat และ groupLabel references ทั้งคู่พร้อมกัน. ห้าม remap จากชื่อแสดง.
สองสำเนาใช้คนละ instance identity จึงไม่ชน แม้ local IDs และชื่อกลุ่มเท่ากัน.

### 4.3 ข้ามหน้า ชื่อยาว และ fixed

auto วางชื่อเต็มพร้อมชิ้นแรกที่ถูกกติกาของสมาชิกใน fragment เดียวกัน.
ความสูงขั้นต่ำของ fragment = ค่าสูงสุดระหว่างชื่อเต็มรวม padding/border
กับชิ้นสมาชิกที่ลงได้; ไม่บวกความสูงสองคอลัมน์เข้าด้วยกัน.
ถ้าชื่อสูงกว่าสมาชิก ให้ fragment มีความสูงพอชื่อโดยไม่ทำข้อมูลสมาชิกซ้ำ.
breakable member ใช้ safe line breaks เดิม; protected row ต้องลงได้ทั้งแถว.
prefix ไม่เป็นส่วนของ span; ถ้า prefix ใหญ่จน keepStart ต้องผ่อน ให้ใช้คำเตือนเดิม
แต่ยังรักษาชื่อกับ member fragment เป็นคู่ที่แยกไม่ได้.

แต่ละ page fragment แสดงชื่อเต็มหนึ่งครั้งภายในเซลล์ ไม่ตัดชื่อแบ่งไปหน้าถัดไป:
หน้าแรกใช้ชื่อต้นทาง หน้าต่อทุกหน้าใช้ชื่อต้นทาง + ` (ต่อ)` หนึ่งครั้ง.
ไม่ตรวจแล้วลบ suffix ที่มีอยู่ในชื่อธุรกิจ เช่นชื่อจริง “A (ต่อ)” หน้าต่อเป็น
“A (ต่อ) (ต่อ)” ตามสูตร; คำว่าไม่สะสมในข้อ 3.4 หมายถึงห้ามนำผลหน้าก่อนมาต่อซ้ำ.
ถ้าทั้งกลุ่มเลื่อนไปหน้าใหม่แต่ยังไม่เคยแสดง ให้ใช้ชื่อเดิม ไม่มี suffix.
เมื่อจบกลุ่มแล้วเริ่มกลุ่มใหม่ชื่อเหมือนกัน ให้เริ่มนับหน้าต่อใหม่ของกลุ่มนั้น.
empty row เป็น protected row ของ feature นี้ ต้องแสดงชื่อและข้อความว่างครบคู่
หาก template ระบุ allowBreak:true สำหรับ empty row ให้ปฏิเสธ.

วัดพื้นที่หลัง repeated header และ page bands จริงของแต่ละหน้า.
ถ้ายังเริ่มไม่ได้ให้เลื่อนไปหน้าที่จุได้ตาม geometry เดิม และตรวจ no-progress;
ถ้าไม่มีหน้าใช้งานเต็มใดวางชื่อ/ชิ้นที่จำเป็นได้ ให้ LAYOUT_FAILED พร้อม
reason `group-label-does-not-fit` และ node/group context. ห้ามตัดชื่อ/ย่อฟอนต์.
TOC passes ต้องให้ชื่อและ fragment ตรงกันหลังเลขหน้าคงตัว.
ชื่อที่ซ้ำเป็น draw content เท่านั้น ไม่เพิ่ม sourceMap member/anchor/TOC entry;
draw commands มี ID เฉพาะของตนได้ แต่ไม่กลายเป็น business node ใหม่.

fixed อยู่ที่ Format เท่านั้น ตัวอย่างเปลี่ยนเพียง:

```json
{ "sizing": { "mode": "fixed", "height": { "value": 300, "unit": "pt" } } }
```

กรอบใช้ได้ = min(300 pt, พื้นที่หน้าที่เหลือ) ตาม sizing v2 เดิม;
จองความสูงกรอบที่ใช้ได้แม้เนื้อหาน้อยกว่า ไม่รอรวบรวมทั้งกลุ่มก่อนวาง.
วางสมาชิก/ชิ้นแถวที่พอ พร้อมชื่อเต็มและเส้นปิด; หากแถวถัดไปลงไม่ได้
หยุด Format ตรงนั้น ไม่ข้ามไปกลุ่มอื่น ไม่ขึ้นหน้าเพื่อส่วนที่เหลือ.
Format ถัดไปเริ่มหลังกรอบตาม flow เดิมและใช้นโยบายของมันเอง.
ไม่มี suffix ใน fixed เพราะไม่มี page fragment ต่อของ instance เดียวกัน.
ถ้าพื้นที่ไม่พอชื่อเต็มกับชิ้นแรก ให้ไม่แสดงกลุ่มนั้นเลย และแจ้งส่วนที่เหลือ;
อย่าวาดชื่อโดดหรือแสดงชื่อบางบรรทัด. กรอบศูนย์ใช้ FORMAT_FRAME_NOT_SHOWN เดิม.
fixed ที่วางชื่อไม่ได้ใช้ warning omission ไม่เปลี่ยนเป็น auto layout error.

### 4.4 ผลแจ้งปัญหาและ capability

ใช้ Result/Issue และช่องทาง warning/job status เดิม ไม่เพิ่ม API generate endpoint.
template ผิดใช้ INVALID_TEMPLATE พร้อม path ลงไปที่ groupLabel/เซลล์/field ที่ผิด;
ข้อมูลผิดใช้ MISSING_REQUIRED/TYPE_MISMATCH/INVALID_DATA พร้อม indexed data path.
auto ที่วางไม่ได้ใช้ LAYOUT_FAILED กับ reason ข้างต้น; ความผิดของ protected row,
image หรือ link ใช้เหตุผลเดิมของมัน ไม่เหมารวมเป็นชื่อกลุ่มผิด.

fixed ใช้ FORMAT_CONTENT_OMITTED, formatOmission.version:1 และ pending cursor เดิม.
reason ใช้ height-limit หรือ unbreakable-item-does-not-fit ตามชิ้นที่หยุด;
pending ต้องมี groupId, groupIndex และ itemIndex สำหรับสมาชิกจริง
(ไม่มี itemIndex สำหรับชื่อ/empty). lineIndex/sourceOffset ใช้ความหมายเดิมเมื่อหยุดกลางแถว.
cursor เป็นจุดเริ่มอ่านต่อเพื่อรายงาน ไม่ใช่คำสั่งให้รันต่อหน้าถัดไป.
ตัวอย่าง warning เมื่อ R1 วางครบ แต่ R2 ยังไม่เริ่ม (IDs resolved เป็นตัวอย่าง):

```json
{
  "code": "FORMAT_CONTENT_OMITTED",
  "path": "areaFormats.grouped-results.sizing",
  "message": "Format instance exceeded its fixed frame; remaining content was not shown",
  "sectionId": "10000000-0000-4000-8000-000000000011",
  "action": "skipped",
  "formatOmission": {
    "version": 1,
    "areaId": "uat-body", "areaEntryIndex": 0,
    "areaFormatId": "grouped-results", "format": "grouped-results",
    "reason": "height-limit",
    "pending": [{
      "kind": "node", "nodeId": "resolved-member-row-1", "sourceNodeId": "member-row",
      "nodeType": "table-row", "tableId": "resolved-results-table",
      "rowId": "resolved-member-row-1",
      "groupId": "requirement-groups", "groupIndex": 0, "itemIndex": 1
    }]
  }
}
```

pending เป็นรายการจุดค้างตามกลไกเดิม ไม่ต้องแจกทุกสมาชิกที่เหลือ.
ผู้รายงานเทียบ cursor กับข้อมูลต้นทางจึงต้องระบุได้ว่า R2 และกลุ่มถัดไปไม่แสดง;
ผล PDF มีคำเตือนนี้ต้องรายงานว่าไม่ครบ ไม่สรุปว่าเอกสารครบจาก job succeeded อย่างเดียว.

กำหนด capability เพิ่มใน `/authoring/contract` และ context ของ FlowDocMake ดังนี้
(เป็นส่วนเพิ่มใน response ไม่ใช่ response ทั้งก้อน):

```json
{
  "groupLabelSpans": {
    "version": 1,
    "nodeModelVersions": [19],
    "schemaVersions": [1, 2],
    "continuationSuffix": " (ต่อ)",
    "fixed": "formatSizing-v2",
    "diagnosticsVersion": 1
  }
}
```

ไม่เพิ่ม nodeModelVersion หรือ schemaVersion ใหม่: feature เป็น optional declaration
บน model19 เท่านั้น. model18 รับของเดิมและปฏิเสธ groupLabel ด้วย INVALID_TEMPLATE.
Core ใหม่ต้องตรวจ declaration นี้แม้ผู้เรียกไม่ผ่าน Service; รุ่นเก่าต้องไม่ถูกคาดหวังให้รองรับ.
FlowDocMake ตรวจ capability.version = 1 และ model/schema ที่ตรงก่อนส่ง definition
ที่มี groupLabel; เมื่อไม่มี/ไม่รู้จัก capability ให้หยุด preflight พร้อมบอกว่าไม่รองรับ
โดยไม่ตัด field หรือแปลงเป็น rowSpan ตายตัวเอง. definition ที่ไม่มี groupLabel
ใช้ทางเดิมได้. fixed ต้องมี formatSizing.version = 2 ร่วมด้วย.
Service บันทึก/read-back/clone ต้องคง field นี้ และตรึง definition/revision,
Core package checksum, fonts/resources ของ job เหมือนเดิม.

### 4.5 ชุดตรวจรับที่ตรึงไว้สำหรับช่วงถัดไป

| ID | ข้อมูล/เงื่อนไข | ผลที่ต้องได้ | ช่วงตรวจ runtime |
| --- | --- | --- | --- |
| G01 | groups:[] | ไม่มีกลุ่ม/placeholder; static table parts คงเดิม | 1,2 |
| G02 | กลุ่มเดียว members:[] | ชื่อกับ “ไม่มีรายการ” 1 แถว; memberCount 0 | 1,2 |
| G03 | สมาชิก 1,2,5 | span 1,2,5 ตามลำดับ ไม่รวม prefix/header | 1 |
| G04 | request 4.2 | กลุ่ม 0/1/2; counts 2/0/1; ชื่อ Module A ไม่รวมกัน | 1,4 |
| G05 | missing/null/wrong-type/ชื่อว่าง | แยก [] ออกจาก invalid; indexed paths ถูก | 1,3 |
| G06 | clone/import สองสำเนา | local references อยู่ครบ; instance IDs/ข้อมูลไม่ชน | 1,3 |
| G07 | กลุ่มเดียว 3 หน้า | ชื่อเดิม, ชื่อ (ต่อ), ชื่อ (ต่อ); สมาชิกครั้งเดียว | 2,4 |
| G08 | สมาชิกเดียวไหล 3 หน้า | memberCount 1; ชื่อซ้ำ 3 fragments; ข้อความต่อโดยไม่ซ้ำ | 2,4 |
| G09 | ท้ายหน้าไม่พอเริ่ม | ย้ายจุดเริ่ม; ไม่มีชื่อโดด ไม่มี suffix ก่อนเคยแสดง | 2 |
| G10 | สองกลุ่มชื่อเหมือนกัน ต่างกลุ่มต่างข้ามหน้า | ลำดับ/ขอบแยก; suffix reset ต่อกลุ่ม | 2,4 |
| G11 | ชื่อยาวรวม suffix, bands/header/padding/border | วัดชื่อเต็ม; ถ้า full page ใส่ไม่ได้ error ระบุเหตุ | 2 |
| G12 | protected row/empty row/ภาพ | ใช้ indivisible rules; ไม่ผ่อนเพราะเป็น label span | 2 |
| G13 | fixed 300 เหลือ 120; ลงได้ R1 แต่ R2 ไม่พอ | จอง 120 ปิดเส้น เตือน cursor R2; ไม่มีหน้าต่อ | 2,4 |
| G14 | fixed เหลือ 0 หรือไม่พอชื่อ+member | เตือน frame/content ตามกรณี; ไม่มีชื่อบางส่วน | 2,4 |
| G15 | fixed เต็ม 300 แต่ข้อมูลน้อย; Format ถัดไป | คง reservation 300/พื้นที่จริง; ถัดไปเริ่มหลังกรอบ | 2,4 |
| G16 | invalid IDs/grid/span/prefix/member/empty/scope | INVALID_TEMPLATE ไม่สร้าง partial resolved document | 1 |
| G17 | capability เก่า/ขาด/unknown, model18 กับ feature | ปฏิเสธอย่างชัดเจน; ของเดิม model18/19 ผ่านเดิม | 1,3 |
| G18 | anchors/TOC/ยอดรวมและ fixed omitted destination | ไม่สร้าง target ซ้ำ; ใช้ omitted-destination guard เดิม | 2,4 |
| G19 | save/read/job pin/สิทธิ์/Core packed consumer | ไม่ทิ้ง field ไม่หลุดสิทธิ์ job ไม่เปลี่ยนตาม draft ใหม่ | 3 |
| G20 | UAT mock เดิม + cases ใหม่, SRS, ศบ.1 | ตรวจ PDF ทุกหน้าที่สร้าง แยก regression จากความต่างเดิม | 4,5 |

ตารางนี้เป็น expected results ไม่ใช่ผลทดสอบ runtime ใหม่ที่ผ่านแล้ว.
fixture อ้างอิง G07 ใช้สมาชิก index 0–4 โดยจัดพื้นที่ให้หน้า P ลง 0,1;
P+1 ลง 2,3; P+2 ลง 4: memberCount ต้องคง 5 และชื่อแสดง 3 ครั้ง.
G08 ใช้ itemIndex 0 ตลอดทั้งสามหน้าและแบ่งช่วงข้อความต่อเนื่องไม่ทับกัน.
G13 ให้ความสูงรวมเส้น/padding ของชื่อ 20 pt, R1 60 pt และบรรทัดแรกที่แบ่งไม่ได้
ของ R2 80 pt: กรอบ 120 ลง R1 ได้แต่ R2 ลงในส่วนที่เหลือไม่ได้;
สงวนทั้ง 120 และ pending เริ่ม R2 โดยไม่แสดงชื่อของกลุ่มถัดไป.
G14 ทดสอบทั้งศูนย์และค่าบวกที่น้อยกว่าความสูงขั้นต่ำ ไม่รวมสองเหตุเป็นกรณีเดียว.

### 4.6 ฐานงาน ขอบเขต และผลปิดช่วง 0

ฐานสำหรับเตรียมช่วง 1: Core `293c293eb331666868c7b24e6ff6038ede6e6eb9`
บน `codex/pdf-image-numbers-20261018`; รวม numeric PDF fix ที่มีอยู่เป็น prerequisite
โดยไม่อ้างว่างานนั้นถูก merge/release/install แล้ว. ช่วง 1 ต้องแยก diff ฟีเจอร์ใหม่
จาก prerequisite และเก็บ base ที่เลือกนี้ ไม่ล้าง/เขียนทับงานแก้ PDF.
Service baseline ที่สำรวจ: `92e7ff1cc902eddc6a53a1222abd7550cdeb89e5`;
FlowDocMake source อยู่ใน Project Control `plugins/flowdocmake` รุ่น 0.2.4.
ต้องตรวจฐานใหม่ก่อนช่วง 3; ถ้าเปลี่ยนให้ระบุผลกระทบและตรึงใหม่ ไม่อ้าง proof เดิมข้ามการเปลี่ยน.
เมื่อปิดช่วง 0 ยังไม่มี Core package/checksum สำหรับ feature นี้;
แพ็กเกจสำหรับ integration เป็นผลผลิตช่วง 3 ไม่ใช่สิ่งที่ค้างปิดสัญญา.

Owner paths เพิ่มที่ยืนยันแล้ว: Core `src/template/validateTemplate.ts`,
`src/composition/validateResolvedDocument.ts`, `src/layout/documentFlow.ts`,
`src/layout/formatLayout.ts`, `src/result.ts`, `src/pdf/drawContract.ts`;
Service `src/http/authoring.ts`, `src/authoring/service.ts`,
`src/authoring/sectionInstances.ts`, `src/templates/assembly.ts`, `src/templates/contract.ts`;
FlowDocMake `plugins/flowdocmake` และ reference snapshot ที่สร้างจาก canonical inputs.
ไม่แก้ snapshot/installed cache ด้วยมือ และไม่สร้าง DB migration หาก persistence เดิมเก็บได้ครบ.

ปิดทางเลือกเชิงสัญญาแล้ว: optional groupLabel, ชื่อมาจาก cell binding,
prefix ไม่บังคับเฉพาะ feature ใหม่, ชื่อใน empty แยก cell, suffix คงที่,
model19 + capability v1 และ fixed ใช้ sizing v2 เดิม.
unknown ที่ deferred มีเพียง build/package version/checksum และผล runtime
ของช่วงถัดไป; ไม่ถือว่าการปิดเอกสารเป็น implementation acceptance.
รอบนี้ตรวจรูป JSON, references/grid ของตัวอย่าง, acceptance coverage และกฎเอกสาร;
ไม่ส่ง declaration ใหม่ไป runtime เก่า ไม่แก้ product code หรือ draft.

ผลสำรวจที่ต้องเพิ่มในช่วง 3: `Service src/jobs/render.ts` ปัจจุบันอนุญาต
reason เฉพาะ omitted-destination จึงต้องเพิ่ม allowlist สำหรับ
group-label-does-not-fit และส่ง bounded groupId/groupIndex จาก Core ด้วย
ไม่เช่นนั้นผลหน้าจอจะเหลือเพียง LAYOUT_FAILED ทั่วไป.
FlowDocMake จุดเชื่อมคือ `plugins/flowdocmake/scripts/server.mjs`,
`scripts/compatibility.mjs` และ `scripts/candidate-workflow.mjs`.
ตรวจ font readiness และ shaping รวม suffix ที่ engine สร้างด้วย font/style ของ label
เพื่อไม่ให้ผ่านเพราะตรวจเฉพาะข้อมูลธุรกิจแล้วตกตอนวาด “(ต่อ)”; ไม่เพิ่ม fallback font.

## 5. แผนพัฒนาและการตรวจรับ

แต่ละช่วงเริ่มได้เมื่อช่วงก่อนหน้าผ่านตามหลักฐานที่ระบุ; ใช้เอกสารนี้เป็นแผนหลัก
และเติมผลใน record เดิมหรือหลักฐานที่จำเป็น ไม่สร้างชุดรายงานซ้ำ.
อ่าน AGENTS ของ owner ก่อนแตะ repository นั้น และตรึง base/package/checksum
ก่อนทดสอบ integration. ตัดสินใจขอบเขตใหม่หากการสำรวจพบว่าต้องเปลี่ยนสัญญา.

### ช่วง 0 — ปิดสัญญาและชุดตัวอย่าง

- [x] สำรวจ owner paths ปัจจุบันและปิดทุกรายการในส่วน 4 พร้อม JSON
  declaration/data/result ที่เข้าคู่กัน แยก syntax ใหม่จาก request เดิม.
- [x] ทำตาราง acceptance สำหรับกลุ่ม 0/1/N สมาชิก ชื่อซ้ำ และกลุ่มว่าง;
  ระบุ expected page fragments, diagnostics และข้อมูลที่ต้องไม่เปลี่ยน.
- [x] ระบุฐาน Core ที่จะใช้และผลต่อ Service/FlowDocMake รวม model/capability;
  ไม่ถือว่างานแก้ PDF ที่ยังไม่รวม/ติดตั้งรวมเข้ามาแล้วโดยปริยาย.

ตรวจ: ทบทวน JSON รับ–ส่ง อ้างอิง ID/clone กริดและ scope; ทุกกติกาในส่วน 3
ต้องมีกรณีตรวจรับ รวม fixed และชื่อยาว. ผ่านเมื่อไม่มีทางเลือกเชิงสัญญาค้าง
ที่จะทำให้แต่ละ owner ตีความต่างกัน; ยังไม่แก้ runtime ในช่วงนี้.

### ช่วง 1 — Core: declaration, validation และขยายข้อมูล

- [x] เพิ่มสัญญาใน `src/template/types.ts` / `src/template/rowGroups.ts`
  และเจ้าของ validation ที่ช่วง 0 ยืนยัน ใช้ grid เดิมตรวจตำแหน่งและข้อห้าม.
- [x] เชื่อม `src/binding/expandRows.ts` และ composition/resolved model
  ให้สร้างขอบเขต span จากสมาชิกจริง พร้อม scope/source mapping.
- [x] คง schema/model เก่าและ repeat/rowGroups ที่ไม่ใช้ฟีเจอร์นี้.

ตรวจ: 0/1/2/หลายสมาชิก หลายกลุ่มชื่อเหมือนกัน กลุ่มว่าง outer array ว่าง
ลำดับข้อมูล clone สองสำเนา ชน ID และ declaration ผิด.
ต่อยอด `tests/template/mergedTable.test.ts`, `tests/composition/rowGroups.test.ts`;
ตรวจ forbidden cross-group span ยังถูกปฏิเสธ. ผ่านเมื่อ expanded grid ถูกต้อง
โดยไม่ต้องส่ง rowSpan จากข้อมูลธุรกิจ และ old model 18/19 ที่ยังรองรับไม่เปลี่ยน.

ผลช่วง 1 — **PASS เฉพาะ declaration/composition ของ Core candidate**:

- Branch `codex/group-label-stage1-20261018`, commit
  `4a36cc5f59f2a00d8c3ef8e55b1f4ded75eface0`, base `293c293` ตามช่วง 0.
  Worktree: `C:/Users/nekot/Documents/GitHub/flowdoc-core-worktrees/group-label-stage1`.
- เพิ่ม validation model19 ทั้ง AreaFormat และ authored Section, default keepStart,
  prefix ที่ไม่บังคับเฉพาะ feature ใหม่, label span ตามสมาชิก และ resolved metadata
  `{cellId,sourceCellId,memberCount}`. label subtree มี groupIndex แต่ไม่มี itemIndex;
  สมาชิกจริงยังมี itemIndex. ตรวจ forged span/provenance และกริดด้วยกลไกเดิม.
- `tests/composition/groupLabels.test.ts` **52 tests PASS**: สมาชิก 0/1/2/5,
  outer ว่าง, ชื่อซ้ำ, empty fallback, prefix, colSpan/คอลัมน์อื่น, schema1/2,
  authored global/section sources, สอง Section สำเนาและ Format instance ซ้ำ,
  invalid declaration/data, forged resolved metadata และ model18/19 เดิม.
  การ clone/import ผ่าน Service จริงยังอยู่ช่วง 3; รอบนี้ตรวจ instance isolation ใน Core.
- TDD: ก่อนเพิ่ม feature ชุดใหม่ fail ตาม declaration ที่ยังไม่รองรับ;
  เพิ่ม authored-source regression ก่อนแก้ทางเข้า validation.
  independent review พบ P2 ชื่อหลายบรรทัดถูกปฏิเสธหลัง bindInlines;
  เพิ่ม 8 cases LF/CRLF/CR/ขึ้นบรรทัดต้น–ท้าย ทั้งกลุ่มมีสมาชิกและกลุ่มว่าง
  ให้ fail ก่อนแก้ แล้วผ่าน. รักษา text/line-break และ provenance ทุก leaf;
  ไม่มี Critical/Important finding ที่ยังไม่แก้ และไม่มี deferred minor.
- Final Core build PASS; ทั้งชุด **753 tests / 77 files PASS**.
  packed Linux/amd64 consumer แบบ non-root, network none, mounts []:
  **23 กลุ่มตรวจ PASS**, รวม public composition ของ groupLabel แบบชื่อหลายบรรทัด.
  `tests/consumer/checkRowGroups.mjs` เก็บผล `groupLabelSpans.stage:1`,
  `composition:PASS`, `multiline:true`, `layout:not_checked` โดยชัดเจน.
- Candidate tarball SHA-256:
  `843056281473430dd8d0b9f934e0dd06ea35067040b7f4a3349a16b240466293`.
  หลักฐานใน worktree: `artifacts/stage1/` (RED/GREEN/full/package logs) และ
  `artifacts/1792318244362/result.json`, `row-groups-result.json`, `group-labels.resolved.json`.
  แพ็กเกจนี้เป็น test candidate รุ่นฐาน 0.4.3 ไม่ใช่ release artifact ที่นำไปแทนของเดิม.
- Coverage: G01–G06, G16 และ Core model guard ของ G17;
  G19 เฉพาะ public packed composition. capability/job pin/สิทธิ์อยู่ช่วง 3.
  ยังไม่ตรวจชื่อ “(ต่อ)” ใน PDF, fixed ของ label ใหม่ หรือ PDF UAT จริง (ช่วง 2/4).
  ไม่เปลี่ยน layout, Service, FlowDocMake, DB, draft, รุ่นแพ็กเกจ, tag หรือการติดตั้ง;
  เก็บ branch/worktree นี้ไว้ ไม่รวมตัวหลักและไม่ลบงานที่ยังไม่รวม.

### ช่วง 2 — Core: layout, หน้าต่อ และ PDF

- [x] ต่อกลไกที่ `src/layout/cellTableFlow.ts` ให้แบ่ง span ตาม fragment จริง
  วัดชื่อในแต่ละหน้า รักษา keepStart, repeated header และนโยบาย row break.
- [x] ส่งชื่อ “(ต่อ)” เป็นผล layout ไปยัง draw/PDF พร้อม provenance ที่แยกได้;
  ใช้เส้นขอบและการวัดเดิม ไม่แก้ข้อมูลสมาชิกเพื่อให้วาดง่าย.
- [x] เชื่อม diagnostics ของ fixed/impossible layout และรักษาลิงก์/anchor.

ตรวจ: ชื่อยาวหลายบรรทัด ชื่อพร้อม suffix สูงขึ้น พื้นที่ท้ายหน้าเหลือน้อย
header/footer ต่างหน้า padding/เส้น ตารางหลายหน้า สมาชิกเดียวไหลหลายหน้า
protected row ภาพสูง ขอบก่อนกลุ่มถัดไป และไม่มีการวนไม่จบ.
ต่อยอด `tests/layout/mergedTableFlow.test.ts`, `tests/layout/rowGroupFlow.test.ts`
และ PDF/link tests ที่ได้รับผลกระทบ ตรวจค่าข้อมูลทุกตัวครั้งเดียวตามลำดับ
แยกชื่อที่ตั้งใจซ้ำออกจากข้อมูลซ้ำผิดพลาด.
ผ่านเมื่อชื่อมีทุก fragment เส้นปิดถูก และกรณีเป็นไปไม่ได้แจ้งปัญหาถูกจุด.

ผลช่วง 2 — **PASS เฉพาะ Core layout/PDF candidate**:

- ต่อบน worktree/branch ช่วง 1 เดิม; base `4a36cc5`, terminal commit
  `885e36ead5e7d86778cfdbd975b42d1743c4f25f`.
  เปลี่ยน `src/layout/cellTableFlow.ts`, `src/pdf/createPdfEngine.ts`,
  `tests/layout/groupLabelFlow.test.ts`, `tests/consumer/checkRowGroups.mjs` เท่านั้น.
- ชื่อเต็มอยู่ครบในแต่ละ page fragment; suffix วัดเมื่อมีหน้าต่อจริงและ cache
  แยกจากชื่อแรก ไม่แก้ nodes/sourceMap/data. ความสูง fragment รวมชื่อสูงและ
  สมาชิกที่วางได้; เส้นกริดใช้การรวมขอบเดิมและไม่วาดแถวเริ่มว่างหลอกที่ท้ายหน้า.
  fixed ยังคงจองกรอบจริง หยุดพร้อม pending cursor และไม่สร้างหน้าต่อของ Format นั้น.
- `groupLabelFlow.test.ts` **25 cases PASS**: กลุ่มหลายหน้า สมาชิกยาว ชื่อซ้ำ
  หลายบรรทัด/suffix ทำให้ wrap สูงขึ้น, prefix/keepStart, header/next capacity,
  protected/blank rows, ภาพใหญ่, fixed ทั้งเต็มกรอบและกรอบเหลือน้อย,
  Format ถัดไป, ลิงก์และสารบัญ. ชุดที่ได้รับผลกระทบรวม **63 tests PASS**;
  build PASS และทั้งชุด **778 tests / 78 files PASS**.
- independent review หนึ่งรอบพบ P1 ชื่อสูงกับหลายแถว protected:
  พื้นที่พอแต่ cut ที่ขอบแถวทำให้ auto ไม่ก้าวหน้า/fixed หยุดเร็ว.
  เพิ่ม 4 regressions ให้ fail ก่อนแก้ แล้วเว้นพื้นที่ในแถวสุดท้ายที่ลงได้เพื่อรักษา
  max(label, legal member fragment); auto 70/72/75 pt และ fixed ผ่าน.
  ตรวจภาพพบส่วนต้นแถวว่างท้ายหน้า เพิ่ม RED/GREEN อีกหนึ่งกรณีแล้วแก้เส้นปิด.
  ไม่มี Critical/Important ค้าง และไม่มี deferred minor.
- Final packed Linux/amd64 consumer แบบ non-root, network none, mounts []:
  **23 กลุ่มตรวจ PASS**. Native feature cases 7 กรณี: 6 PDF และ expected
  impossible-label failure ที่มี LAYOUT_FAILED/reason/groupId/groupIndex ถูกต้อง.
  Candidate SHA-256 `9d0db0231fdf98e4b0806a6f4b422f620ffcc119b7193ddf2ad0a43f0b4bfe06`.
  ยังเป็น test candidate รุ่นฐาน 0.4.3 ไม่ใช่ release/install artifact.
- PDF ใหม่ 6 ไฟล์: groups 5 หน้า, long 4, multiline 4, fixed 1,
  protected 4, fixed-protected 1 — **ตรวจภาพครบ 19 หน้า** ในพื้นที่เขียนทั้งหมด
  และเก็บ full-page PNG. ตรวจ text tokens ยืนยัน auto ครบครั้งเดียวตามลำดับ;
  fixed แสดง prefix สมาชิก 3/12 และ 2/6 ตามกรอบ พร้อม cursor จุดเริ่มส่วนที่เหลือ.
  ไม่มี PDF Syntax Error. ชื่อที่ซ้ำเพื่อแสดงหน้าต่อไม่ถูกนับเป็นสมาชิกซ้ำ.
- หลักฐานใน worktree: `artifacts/stage2/` (RED/GREEN/full/package logs),
  `artifacts/stage2/pdf-review/checks.json`, `visual-review.json`, PNGs;
  native package/PDF/results ที่ `artifacts/1792319551096/`.
  ระหว่างเตรียม consumer เคยพบ syntax ใน test band fixture แล้วแก้;
  ผลข้างต้นอ้าง final passing package เท่านั้น ไม่อ้าง run ที่ fail เป็น PASS.
- Coverage: G07–G15/G18 ในขอบเขต Core และ regression G01–G06/G16/G17.
  Service allowlist/readiness/capability และ API pin/clone ยังอยู่ช่วง 3;
  UAT/SRS/ศบ.1 จริงยังตรวจร่วมในช่วง 4. ไม่แก้ Service, FlowDocMake, DB, draft,
  รุ่นแพ็กเกจหรือ DOCUMENT_MAP; ไม่รวมตัวหลัก ไม่ push/tag/release/ติดตั้ง.

### ช่วง 3 — แพ็กเกจจริง, Service และ FlowDocMake

- [x] แพ็ก Core candidate แล้วให้ Service ใช้ไฟล์แพ็กเกจจริงพร้อม checksum;
  ตรวจ consumer/native runtime ของสภาพแวดล้อมส่งมอบ.
- [x] เชื่อม save/read, draft validation/readiness, snapshot ของงาน PDF,
  clone/import และการส่ง diagnostics ตามสัญญาที่ปิดแล้ว.
- [x] เพิ่ม capability/schema/context ของ FlowDocMake และตัวอย่างสั้นในคู่มือ
  จุดเดิม เพื่อให้ AI เลือกกลไกใหม่แทน hard-code จำนวนสมาชิก.

ตรวจ: สิทธิ์ผู้ดูแล/ผู้เขียน/ผู้ไม่มีสิทธิ์ตามขอบเขต API จริง; client เก่า–ใหม่,
engine ที่ไม่รองรับ, round-trip ไม่ทิ้ง field, clone สองชุดข้อมูลไม่ชน,
แก้ draft หลังเริ่มงานแล้ว job ยังตรึงชุดเดิม และ warning/error ถึงผู้เรียกครบ.
ตรวจ reason/context ผ่าน render-child และ Service allowlist จริง รวม readiness
ของข้อความชื่อพร้อม suffix ที่สร้างใน layout.
ใช้ `tests/consumer/checkRowGroups.mjs`, `checkMergedTable.mjs` เป็นฐาน
แล้วเพิ่ม Service/FlowDocMake tests ใน owner paths ที่ยืนยันในช่วง 0.
ผ่านเมื่อเรียกผ่านเครื่องมือและ Service ได้จริง ไม่ใช่ผ่านเฉพาะ direct Core.

ผลตรวจช่วง 3 (single-room implementation; execution IDs N/A):

- Service branch `codex/group-label-stage3-20261018`, commit `6054037`;
  FlowDocMake source บน Project Control branch ชื่อเดียวกัน:
  `93db697` (คู่มือ), `8bc87f8` (integration), `0ee44a7` (review fix).
  Core `885e36e` ไม่แก้เพิ่ม; ใช้ archive ที่ตรวจช่วง 2 แล้วแบบ byte-identical
  เป็น `vendor/flowdoc-core-0.4.3-group-label-stage2.tgz`, SHA-256
  `9d0db0231fdf98e4b0806a6f4b422f620ffcc119b7193ddf2ad0a43f0b4bfe06`.
  เก็บ archive release เดิมไว้; รุ่นภายในยังเป็น 0.4.3/0.2.4 และใช้ checksum
  แยก candidate จนเตรียมรุ่นช่วง 5 ไม่อ้างว่าเป็น installed package ใหม่.
- capability ตรง 4.4; context ส่ง groupLabelSpans/formatSizing.
  validate/save ผ่าน stdio และ candidate workflow ปฏิเสธ capability ที่ขาด/unknown/
  ชนิดข้อมูลผิดโดยไม่ส่ง definition ต่อ. นิยามไม่มีฟีเจอร์ใช้ทางเดิม;
  engine/package pin ผิดปฏิเสธชัดเจน. ของเดิม model18/19 ผ่านชุด regression.
- API/MCP save/read คง field; clone/import สอง Section ใช้ ID และ Area/Format
  เจ้าของใหม่ ชื่อเหมือนกันแต่ข้อมูล COPY-A/COPY-B แยกกัน. งานที่ queued ก่อน
  แก้ draft ยังใช้ revision/definition/input เดิม; immutable font snapshot
  ตรึง renderer SHA และ Sarabun เดิมครบสี่ face, engine อื่นใช้ snapshot ไม่ได้.
  เจ้าของอื่นรับ 404, ไม่ยืนยันตัวตนรับ 401; ไม่มี admin/publish tool เพิ่ม.
- auto readiness ใช้ชื่อรวม ` (ต่อ)` ใน face เดียวกัน; fixed ไม่ตรวจ suffix.
  ทดสอบ schema2 ด้วยไฟล์ subset ที่ตัด U+0E15: auto blocked พร้อมตำแหน่งอักษร
  และไม่ enqueue, fixed ready. ไม่มี synthetic face/fallback เพิ่ม.
- fixed 300 เหลือ 120 แสดง ROW0–ROW2 แล้วเตือน cursor ของสมาชิกค้าง;
  auto ส่งชื่อพร้อม suffix ในหน้าต่อและสมาชิกครั้งเดียว. ชื่อสูงเกินหน้าส่ง
  LAYOUT_FAILED/group-label-does-not-fit พร้อม bounded groupId/groupIndex/nodeId
  ผ่าน child/Service/MCP และดาวน์โหลด partial PDF ไม่ได้.
- ชุด native/API ที่เกี่ยวข้อง 22/22 ผ่านก่อนตรวจเต็ม. ชุดเต็ม PostgreSQL/Linux
  100 files: **325 ผ่าน, 0 ล้มเหลว, 6 ข้าม**; ไม่เรียกว่า 331 ผ่าน.
  หกข้อเดิมเป็น height-delivery guard 3, proposal fixture 2, supplied fonts 1
  ที่ต้องใช้ external fixture; **ยังไม่รับรองผลหกข้อนี้ในรอบนี้**.
  harness รอบเต็มหยุดที่ zero-skips assertion (ไม่ใช่ product test ล้มเหลว);
  runner ใหม่แสดงรายการ skipped โดยเปิดเผยและไม่ยอมให้ group-label acceptance ข้าม.
- หลัง review fix: ทดสอบ Service กลุ่มใหม่ **7/7**, FlowDocMake ที่ได้รับผลกระทบ
  **24/24**, ไม่มี skipped; เรียก stdio จริงกับ native API รวม Format ชื่อ examples.
  PDF **5 ไฟล์/8 หน้า** ตรวจ strict parsing, จำนวน/ลำดับข้อความ, render และภาพทุกหน้า
  ผ่าน. fixed เป็น partial output ตามคำเตือน ไม่อ้างว่าข้อมูลครบ.
- independent review หนึ่งรอบพบ detector มองข้าม Format ชื่อ examples และอ่าน
  business defaults ผิดเป็น declaration. เพิ่ม regression ให้เห็น RED 3 ข้อก่อนแก้
  แล้ว GREEN; ตรวจเฉพาะ declaration owners ของ Format/authored Section แทน recursive scan.
  ไม่มีข้อพบค้าง. Core layout ใช้หลักฐานช่วง 2; visual acceptance ตรวจเองครบ;
  UAT/SRS/ศบ.1 เป็นช่วง 4 และหก external height checks ยังไม่ใช่หลักฐานผ่านรอบนี้.
- คู่มือเพิ่มเฉพาะบท contents-and-repetition เดิม, startup reading ไม่เพิ่ม;
  snapshot สร้างด้วย build-flowdocmake จาก canonical inputs รวม reference เดิมที่ล้าหลัง.
  ไม่แก้ installed cache/DB จริง, ไม่เพิ่ม migration, ไม่เปลี่ยน DOCUMENT_MAP.

Evidence: Service tests `group-label-api.test.mjs`, `group-label-unit.test.mjs`,
`checkGroupLabelPdf.py` และ runner `scripts/checkGroupLabels.mjs` ที่ commit ข้างต้น;
PC tests `flowdocmake-group-label.test.mjs`, `flowdocmake-workflow.test.mjs`,
`checkFlowdocmakeGroupLabels.mjs`. หลักฐาน local อยู่ที่ Service worktree
`C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/group-label-stage3/artifacts/`:
`1792321128017/tests.log` (ชุดเต็ม), `1792321717476/result.json`,
`1792321717476/plugin-tests.log`, `1792321717476/pdf-review/checks.json` และ
`1792321717476/pdf-review/all-pages.png`; coverage/RED–GREEN/review notes ใน `stage3/`.
เก็บ lanes/evidence ไว้ใช้ช่วง 4; ไม่รวมตัวหลัก ไม่ push/tag/release/ติดตั้ง.

### ช่วง 4 — แม่แบบ UAT และตรวจ PDF ทั้งชุด

- [x] สร้างสำเนา draft UAT แยกจากต้นฉบับ ใช้ mock เดิมเป็นฐาน
  เปลี่ยนเฉพาะตารางชื่อกลุ่มจาก scalar/rowSpan ตายตัวเป็น groups/members.
- [x] เพิ่ม case mock 0/1/หลายสมาชิก ชื่อเหมือนคนละกลุ่ม กลุ่มยาวหลายหน้า
  สมาชิกยาวข้ามหน้า กลุ่มว่าง และ fixed; ระบุค่าที่เพิ่มเพื่อทดสอบแยกจาก mock เดิม.
- [x] สร้าง PDF ทุก case เก็บ revision/package/hash และตรวจทุกหน้าของผลทดสอบ.

ตรวจ: จำนวน/ลำดับ/ค่าข้อมูล span และชื่อ “(ต่อ)” ตรง fragment;
ไม่มีชื่อโดด ไม่มีสมาชิกหายหรือซ้ำ เส้นและหัวตารางถูก แถวรวมเดิมแสดงครั้งเดียว
สารบัญ เลขหน้า หัว–ท้าย และลิงก์เดิมยังถูกต้อง.
ตรวจเอกสารเดิม SRS 98 หน้าและ ศบ.1 สองหน้าเทียบ baseline เดียวกัน;
จำนวนหน้าของ case ใหม่เปลี่ยนได้ตามเนื้อหา ไม่บังคับให้เท่าเดิมด้วยการย่อฟอนต์.
เทียบ UAT กับต้นฉบับและผลรอบก่อน แยกความต่างเดิมออกจาก regression ใหม่.
ผ่านเมื่อครอบคลุม PDF ทุกหน้าที่สร้าง และ fixed omission ถูกแจ้งครบ.

ผลช่วง 4 (2026-10-18): **PASS ตามขอบเขตแม่แบบและ regression**.
ใช้ candidate ของช่วง 3 ในระบบทดลองแยก; ไม่เปลี่ยน runtime code หรือระบบที่ติดตั้ง.
สำเนา UAT `3c9f0379-3e04-4742-8774-74e5b978c2ff` revision 4 ใช้ Format
`summary-dynamic` กับ rowGroups/groupLabel แทน scalar และ rowSpan ตายตัว.
หนึ่งกลุ่มใช้หนึ่งรายการ Format ใน Area เดิม เพื่อคงยอดรวมแต่ละกลุ่มผ่าน repeat
ของแถวท้ายที่มีอยู่แล้ว ไม่เพิ่ม group-footer hook หรือ Section.

| ชุด PDF | หน้า | ผลที่ตรวจ |
| --- | ---: | --- |
| baseline normal / long บน candidate เดียวกัน | 11 / 13 | แยกผลของแม่แบบออกจากแพ็กเกจ |
| mock normal / long เดิม | 11 / 13 | ค่าและลำดับเดิมครบ ยอดรวมครั้งเดียว เปลี่ยนภาพเฉพาะหน้าสรุป 5 |
| groups ว่าง / สมาชิก 0, 1, 5 | 11 / 11 | ไม่มีสมาชิกปลอม; empty fallback เฉพาะกลุ่มว่าง |
| สองกลุ่มชื่อเหมือน กลุ่มละ 26 สมาชิก | 15 | แยก instance; กลุ่มละสาม fragment รวม “(ต่อ)” สี่ครั้ง |
| สมาชิกหนึ่งรายการ 80 บรรทัด | 13 | ไหลสามหน้า ชื่อกลุ่มซ้ำพร้อม “(ต่อ)” สองครั้ง ไม่มีข้อมูลซ้ำ/หาย |
| fixed สูงสุด 300 pt แต่หน้าเหลือ 120 pt | 12 | แสดงสองจาก 24 สมาชิก ปิดเส้น แจ้ง 22 สมาชิกและแถวรวมที่ไม่แสดง; Format ถัดไปยังทำงาน |
| SRS เดิม / ศบ.1 free-flow ล่าสุด | 98 / 2 | ข้อความ ลิงก์ และภาพทุกหน้าตรง baseline |

รวม 11 PDF / 210 หน้า: ตรวจโครงสร้าง ข้อมูล เลขหน้า สารบัญ ลิงก์
และ Poppler render ทุกหน้า ไม่พบ PDF syntax error; ตรวจภาพ 162 หน้าที่ต่างกัน
ผ่าน 27 sheets และใช้ผลภาพที่มี pixel hash ตรงกันทุกจุดสำหรับอีก 48 หน้า.
ผู้ตรวจอิสระหนึ่งรอบตรวจ hash/revision/fingerprint และ coverage ไม่พบ
Critical/Important finding. คำเตือนภาพความละเอียดต่ำเดิมยังอยู่
(UAT ชุดละ 10, SRS 4, ศบ.1 ไม่มี) ไม่ถูกซ่อนหรือถือว่าแก้แล้ว.

ความต่างที่ต้องแยกให้ชัด: หัวคอลัมน์ซ้ำเมื่อเริ่มแต่ละกลุ่ม เพราะเป็นคนละรายการ
Format; เนื้อหาสมาชิกและยอดรวมไม่ซ้ำ. เทียบกับ PDF UAT จากแพ็กเกจก่อนหน้า
ยังมี pixel difference ของภาพแนวตั้งสุดท้ายที่หน้า 11/13
(กรอบ 282,103–313,301 ที่ 72 dpi) แต่ข้อความ/ลิงก์ตรงกัน;
เมื่อเทียบ old/new template บน candidate เดียวกันต่างเฉพาะหน้าสรุป.
นี่ไม่ใช่การรับรองความเหมือนทั้งหมดกับต้นฉบับ UAT 72 หน้า:
mock เดิมเป็นชุดย่อ 11/13 หน้า มีภาพ/ข้อความ mock และข้อแตกต่างด้านฟอนต์/เส้นเดิม.
SRS ใช้ baseline ที่เก็บไว้ ไม่ได้ปิดข้อแตกต่างจากเอกสารต้นทางในงานเก่า.

ระหว่างทดลองแก้สองจุดในแม่แบบ/fixture: ใช้ supported authoring flow เพิ่ม
Format ใหม่แล้วลบ Format เก่าที่เลิกใช้ แทนการฝืนเปลี่ยนเจ้าของ schema เดิม;
และคำนวณพื้นที่ fixed จากตำแหน่งหัว–ท้ายจริงให้เหลือ 120 pt.
ศบ.1 เปลี่ยน input ทดสอบจากสำเนา revision เก่าไปเป็น free-flow revision 4
ก่อนตรวจรับ; ผลก่อนแก้เก็บแยก `superseded-r1/` ไม่ใช้เป็น PASS.

Evidence local root:
`C:/Users/nekot/Documents/Codex/2026-10-18/group-label-stage4/`.
`review/verification.json`, `review/visual-index.json`, `prepared/composition-checks.json`
ผูกเกณฑ์กับผลตรวจ; `delivery/` มี PDF ทั้ง 11 ชุดพร้อม receipt definition/request,
revision/job/package/hash; `template/` มีแม่แบบ revision 4, input เจ็ดกรณี
และไฟล์ภาพ 17 ชิ้นพร้อม checksum (alias ต้องอัปโหลดใหม่ก่อนใช้งาน).
`checkpoint.json` เก็บ authoring receipts; `scope.json` เก็บฐาน/ขอบเขต.
Core SHA `9d0db0231fdf98e4b0806a6f4b422f620ffcc119b7193ddf2ad0a43f0b4bfe06`
ตรงกับช่วง 3. ตรวจต้นฉบับ live UAT revision 9, SRS revision 1 และ ศบ.1 revision 4
ทั้งก่อนและหลัง พบ fingerprint/definition ตรงกันครบ.
สำรอง DB/ไฟล์ก่อนทดลองและหลังทดลอง; หยุดเฉพาะ containers ของชุดทดลอง
และเก็บ volumes/dumps ไว้ต่อช่วง 5. ไม่รวมตัวหลัก ไม่ push/tag/release/ติดตั้ง.
ตรวจ diff/ลิงก์แผนและ checksum ของชุดแม่แบบผ่าน (`review/handoff-checks.json`).
`npm run check:data` เริ่มไม่ได้เพราะ worktree นี้ไม่มี `tsx`; ไม่อ้างเป็น PASS.
รอบนี้ไม่เปลี่ยน canonical data หรือ generated records จึงใช้การตรวจแผนเฉพาะส่วน.

### ช่วง 5 — ตรวจร่วมและเตรียมส่งมอบ

เริ่ม 2026-10-18 ตามคำสั่งให้ต่อช่วง 5: single-room inline, role Evidence Reviewer /
Documentation Synthesizer; IDs N/A. ไม่เปิด execution เก่า. ขอบเขตเพิ่มเฉพาะ
คู่มือเดิม Core README/template-guide, Service README/usage, plugin README/skill,
version manifests/locks/pins และ generated plugin snapshot; ไม่แก้พฤติกรรม runtime.
เตรียม development candidate Core/Service 0.4.4 และ FlowDocMake 0.2.5
เพื่อแยกจาก installed 0.4.3/0.2.4; release approval ยังไม่รวมในคำสั่งนี้.
Proof budget: ทวน G01–G20 กับ evidence เดิมที่ฐานยังตรง, ตรวจ packed Linux consumer
ของ archive ใหม่, byte identity ของ renderer/resources เทียบช่วง 4, native API/MCP
เฉพาะผลกระทบ version/pin และตรวจ snapshot/ตัวอย่าง; ไม่ตรวจทุก suite ซ้ำโดยไม่มีเหตุ.
Document budget: แก้ entrypoints เดิมและแผนนี้ ไม่เพิ่ม startup reading.
หก external font-height checks ยังคงเป็น unverified จนมี proof จริง;
ไม่ใช่การลด group-label acceptance หรืออนุญาต release.

- [x] สรุป acceptance-to-evidence coverage ของช่วง 0–4 พร้อมรายการที่ไม่ผ่าน
  หรือไม่ได้ตรวจ; skipped ไม่เท่ากับ PASS.
- [x] ตรวจคู่มือ เวอร์ชัน package/checksum capability และตัวอย่างรับ–ส่งให้ตรงกัน.
- [x] เก็บชุดส่งมอบและความต่างที่ยอมรับไว้ในจุดอ้างอิงเดียว; เสนอ checkpoint
  การรวมงานและ cleanup เฉพาะงานสะอาดที่รวมแล้วตามการอนุมัติในตอนนั้น.

ผ่านเมื่อไม่มีช่องว่างใน mandatory acceptance และแยกข้อจำกัดเดิมได้.
**หยุดก่อน release/tag/push และติดตั้ง** จนมีคำสั่งอนุมัติขั้นนั้นโดยชัดเจน.

ผลช่วง 5 — **PASS เฉพาะ feature scope และชุดพัฒนาเตรียมส่งมอบ**:

- ทวน G01–G20 กับหลักฐานช่วง 0–4: declaration/composition 52 cases,
  layout 25 cases, clone/import/rights/job pin และ capability/readiness ผ่าน API/MCP,
  UAT mock เดิมกับกรณีเพิ่มและ regression SRS/ศบ.1 ครบ.
  G14 พื้นที่ศูนย์ใช้ admission guard ของ Format ก่อนเรียก renderer ร่วมกับ
  label-specific positive-frame omission; G18 ใช้ shared omitted-destination guard
  และ group-label anchor/TOC tests. ไม่สร้างชุดตรวจซ้ำสำหรับ guard ที่ไม่เปลี่ยน.
- เพิ่มคู่มือ groupLabel ใน Core README/template-guide เดิม ครอบคลุม field เดียวกัน,
  empty row ที่แบ่งไม่ได้, members/empty, suffix, fixed, errors และข้อจำกัด;
  ไม่เพิ่มเอกสารเริ่มอ่านของ FlowDocMake. Service README/usage และ plugin entrypoint
  ระบุคู่รุ่นและ checksum ตรงกัน; snapshot สร้างจาก canonical inputs 30 ไฟล์.
- Core commit `e1a65178815f1657ebe464aca23a8a0a4219938c`, Service
  `e605d9370d887ecbac835cd65d264c1607f1bba7`; FlowDocMake อยู่ PC branch
  `codex/group-label-stage3-20261018` (terminal commit อยู่ใน delivery manifest).
  คู่รุ่น Core/Service **0.4.4**, FlowDocMake **0.2.5**; models18/19 และ schema1/2
  ไม่เพิ่มรุ่นโมเดล. Core archive `flowdoc-core-0.4.4.tgz` SHA-256
  `dc65df98e1a605236e0c2e4f13dc1595b1b9924709ceed9ab276ee0a6006a529`
  ตรง vendor manifest, SHA512 ของ lockfile และ plugin compatibility pin.
  เก็บ archive รุ่นก่อนครบ ไม่เขียนทับของที่ออกใช้แล้ว.
- Core packed Linux/amd64 build: **778 tests/78 files**, native consumer
  **23 กลุ่มตรวจ** ผ่าน. ใน archive ใหม่ต่างเฉพาะ README/package.json;
  renderer/resources/native runtime อีก **154 ไฟล์ byte-identical** กับช่วง 4.
  PDF จาก consumer **72 ไฟล์/306 หน้า byte-identical** กับผลช่วง 2
  (รวมกลุ่มใหม่ 6 PDF/19 หน้า ซึ่งตรวจ raster identity เพิ่ม).
  จึงใช้ visual proof ของ UAT/SRS/ศบ.1 ช่วง 4 รวม 210 หน้าต่อได้โดยไม่อ้าง
  ว่ารันเอกสารธุรกิจทั้งหมดซ้ำด้วย engine ที่ต่างจากเดิม.
- คู่แพ็กเกจใหม่ผ่าน Service native **7/7** และ FlowDocMake **24/24**, ไม่มี skipped;
  actual stdio context ready, packageVersion 0.2.5, runtime Core/Service0.4.4,
  groupLabelSpans v1 และ formatSizing v2 ตรงสัญญา. PDF API/MCP **5 ไฟล์/8 หน้า**
  ตรวจ strict parsing/ข้อมูล/คำเตือนและภาพทุกหน้าผ่าน.
- การลอง host plugin tests โดยไม่ตั้ง candidate environment ครั้งแรก fail/skip
  เพราะใช้ runtime ที่ติดตั้งเดิมและไม่มี test config ไม่ใช่เหตุให้แก้ compatibility
  ให้รับ checksum ผิด; ใช้ isolated runner ที่ตั้ง environment ครบแล้วผ่าน 24/24.
  independent review หนึ่งรอบพบคู่มือ Service ยังระบุ FlowDocMake0.2.4 สองจุด;
  เพิ่ม assertion ให้เห็น fail แล้วแก้เป็น0.2.5 และผ่าน. ไม่มีข้อพบสำคัญค้าง.
- จุดอ้างอิงชุดส่งมอบเดียว:
  `C:/Users/nekot/Documents/Codex/2026-10-18/group-label-stage5/delivery/manifest.json`.
  มี Core archive, Service source archive, plugin archive, สำเนาแม่แบบ/input เจ็ดกรณี,
  ภาพ 17 ชิ้น, PDF และ receipts, acceptance coverage และรายการความต่างช่วง 4.
  `group-label-stage5/acceptance.json`, `pdf-review/core-comparison.json`,
  `pdf-review/service-checks.json` และ native proof
  `flowdoc-service-worktrees/group-label-stage3/artifacts/1792329754223/`
  เป็นหลักฐานตรวจ; Core consumer อยู่ `artifacts/1792329618482/`.
- **ไม่ใช่ผลผ่านของหก external font-height checks** ที่ข้ามในชุดเต็มช่วง 3:
  height-delivery guard3, proposals2, supplied-fonts1 ยัง unverified.
  เก็บรายละเอียดใน acceptance.json; ต้องจัด fixture/หลักฐานให้ครบก่อนอ้าง
  release-wide verification. PC check:data ที่เริ่มไม่ได้เพราะไม่มี tsx ยังคง
  not-run; รอบนี้ตรวจแผน/ลิงก์/snapshot/hash ตามผลกระทบ ไม่มี canonical data เปลี่ยน.
- ไม่มี runtime feature code หรือ migration เปลี่ยนในช่วง 5. ระบบเดิม/ต้นฉบับคงเดิม;
  native test containers ของรอบนี้หยุดและเก็บกวาดโดย runner แล้ว.
  เก็บ worktree/branch ที่ยังไม่รวมพร้อม backup ช่วง 4; ไม่ลบ unmerged lane.
  ขั้นถัดไปคือขออนุมัติรวมเข้าตัวหลักและ cleanup เฉพาะ lane ที่สะอาดรวมแล้ว;
  ไม่รวม ไม่ push/tag/release หรือติดตั้งในรอบนี้.

### รวมตัวหลักและ cleanup — 2026-10-19

คำสั่งเจ้าของในแชตนี้อนุมัติเฉพาะรวมงานเซลล์ชื่อกลุ่ม ตรวจหลังรวม และ cleanup;
ไม่ขึ้น release หรือติดตั้ง และยังไม่เริ่ม runtime ของ task. Single-room inline,
role Lane Reconciliation Reviewer / Project Control Steward; execution IDs N/A.
ใช้แผนและ acceptance เดิม ไม่เปิด execution เก่าหรือแก้ผลช่วง 5 ย้อนหลัง.

- Core `codex/template-binding` fast-forward เป็น `e1a6517` และ Service
  `codex/template-registry` เป็น `e605d93`; tree ตรง candidate ที่ตรวจทุกไฟล์.
  PC `main` merge เป็น `aa72144` ไม่มี conflict; ส่วน plugin/tests/คู่มือที่รวม
  ตรง candidate `008e43c`, เก็บแผน task ที่เพิ่มใน main ไว้ครบ.
- ตรวจใหม่: Core 778/778 และ build ผ่าน; isolated Service API/unit 7/7 และ
  actual FlowDocMake stdio/API 24/24 ไม่มี skipped. หลังรวม Service build และ
  unit 3/3 ผ่าน; plugin snapshot test ผ่านและ canonical/snapshot hashes 30 ไฟล์ตรง.
  รุ่น 0.4.4/0.4.4/0.2.5, vendor checksum และ Core source pin ตรงกัน.
- ใช้ packed Linux consumer/PDF proof ช่วง 4–5 ต่อได้เพราะ fast-forward ไม่เปลี่ยน
  source, package bytes, dependencies หรือ configuration ของชุดที่ตรวจ.
  ตรวจซ้ำ checksum/ขนาดของไฟล์ส่งมอบเดิมครบ 69 ไฟล์; ไม่อ้างว่ารันหรือดู PDF
  ทั้งหมดซ้ำ. หก external font-height checks ยัง unverified นอก feature scope.
- เก็บ ignored artifacts ที่ต้องใช้ต่อจากทั้งสาม worktree รวม 1,756 ไฟล์
  65,894,211 bytes พร้อมตรวจ SHA-256 ต้นทาง/สำเนาทุกไฟล์ก่อนลบ.
  จุดอ้างอิงใหม่คือ `C:/Users/nekot/Documents/Codex/2026-10-19/group-label-integration/`:
  `preservation.json` เก็บ mapping เดิม→ใหม่; artifacts ของ Core, Service และ PC
  อยู่ใต้ `preserved/core`, `preserved/service`, `preserved/projectControl` ตามลำดับ.
  ตัวอย่าง consumer `preserved/core/1792329618482/result.json`; native ล่าสุด
  `preserved/service/1792343664758/result.json`. Delivery manifest เดิมอยู่นอก
  worktree และยังคงใช้ได้. ไม่เขียนทับ historical receipts หรือ source provenance.
- ลบ clean merged worktree 3 ตัวและ local branch `codex/group-label-stage1-20261018`,
  `codex/group-label-stage3-20261018` ของ Service/PC และ
  `codex/pdf-image-numbers-20261018` ของ Core ที่รวมครบแล้ว.
  ทุก repo เหลือ primary checkout, development branch และ release branch เดิม.
  ไม่ลบ remote branch, ไม่เปลี่ยน release refs/tags, ไม่ push และไม่ติดตั้ง.
- ขั้นถัดไป: ปิดสัญญาช่วง 0 ในแผน large-dataset/task เดิมก่อนเริ่ม runtime.
  การรวมงานนี้ไม่ใช่ release-wide readiness หรือการอนุมัติพัฒนา task ทุกช่วง.

## 6. ขอบเขตที่พักไว้และความเสี่ยง

ไม่ทำกลุ่มซ้อนหลายชั้น dynamic span ทั่วทุกเซลล์ การรวมกลุ่มตามข้อความ
group footer hook ใหม่ การคำนวณยอดรวม ระบบ style/font ใหม่ หรือเปลี่ยนสารบัญ.
หากพบว่าต้องเพิ่มเรื่องเหล่านี้ ให้เสนอขยายขอบเขตก่อน ไม่แอบรวมใน implementation.

ความเสี่ยงหลักคือ span ชนกริดหลังขยายสมาชิก ความสูงชื่อในหน้าต่อไม่เท่าหน้าแรก
การนับข้อมูลซ้ำเพราะชื่อที่ตั้งใจซ้ำ และ capability รุ่นเก่าทิ้ง declaration ใหม่.
ช่วง 0–3 จัดการความเสี่ยงแต่ละด้านก่อนใช้แม่แบบจริง; ช่วง 4 เป็นหลักฐานเอกสารจริง
ไม่ใช้การทดสอบ unit แทนการตรวจ PDF ทุกหน้า.
