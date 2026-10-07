# FlowDoc Export MVP — R1 design

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Status: proposed design for owner review, 2026-10-07; no implementation started.
Authority: the owner's request to continue R1 in this conversation.
Registered execution IDs: not applicable. Scope authority:
[locked Export MVP v1](flowdoc-export-mvp-v1-2026-10-07.md).

This document defines contracts and repository boundaries within that MVP.
It is not product Evidence, a scope expansion, or a claim of migration/runtime
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

## 3. ชั้นข้อมูลและตัวตน

| ชั้น | ความรับผิดชอบ |
| --- | --- |
| TemplateDefinition | โครง v4 subset + styles + inputSchema + bindings; immutable ต่อ version |
| InputData | ข้อมูล JSON ของผู้เรียก ไม่มี node, ตำแหน่งวาด หรือคำสั่งประมวลผล |
| ResolvedDocument | สำเนาโครงที่แทนข้อความและขยายแถวแล้ว พร้อม source mapping |
| LayoutResult | ตำแหน่ง/บรรทัด/fragment ต่อหน้า; ไม่เขียนกลับ template |
| PdfArtifact | bytes, media type และจำนวนหน้า; Service เป็นผู้เก็บและเปิดดาวน์โหลด |

`schemaVersion` คือรุ่นสัญญา template; `structure.version: 4` คือรุ่นรูปแบบ node;
`version` คือรุ่นของ template นั้น ทั้งสามไม่ใช่ค่าเดียวกัน
`templateId` เป็นตัวตนถาวร, `docKey` เป็นชื่อสำหรับเลือกโครง, `nodeId` ระบุโครง,
`jobId` เป็นตัวตนการสร้างแต่ละครั้ง ไม่ใช้ชื่อที่แสดงเป็น key

Template version เป็นจำนวนเต็มบวก เพิ่มขึ้นเมื่อแก้โครง/schema/style/binding
job เลือกเวอร์ชันและเก็บข้อมูลที่ผ่าน validation ครั้งเดียวก่อน queued
Core ไม่สร้าง jobId หรือเลือก latest version เอง

## 4. Template contract ที่เสนอ

หนึ่งไฟล์ JSON มี `schemaVersion`, `templateId`, `docKey`, `version`, `name`,
`inputSchema`, `styles`, `structure`, `bindings` ไม่มี script หรือ import path

inputSchema เป็น DSL เล็กของ MVP ไม่ใช่การอ้างว่ารองรับ JSON Schema เต็มรูปแบบ:

- root เป็น object มี fields; scalar รองรับ `string` เท่านั้น
- array รองรับ items เป็น object หนึ่งชั้นที่มี string fields
- `required: true` บังคับให้มี key; string ที่มีอยู่ต้องเป็น string รวมถึงค่าว่าง
- optional string ที่ไม่ส่งให้เป็น `""`; `null` ไม่ใช่ค่าว่างและถูกปฏิเสธ
- array ที่ required ส่ง `[]` ได้ แต่ห้ามละ key; ไม่แปลงชนิดให้อัตโนมัติ
- unknown field ถูกปฏิเสธทั้ง root และ item เพื่อจับการสะกดผิด
- ไม่ trim หรือ normalize ข้อความไทยโดยเงียบ ๆ; CRLF/CR แปลงเป็น LF
  ในขั้น binding เพื่อสร้าง line-break โดยรักษาลำดับบรรทัด

### ตัวอย่าง template ที่ครบโครง

ค่าหน้ากระดาษ/ฟอนต์/ขนาดด้านล่างเป็นค่าเริ่มต้นของ SRS fixture เพื่อออกแบบ
ไม่ใช่คำรับรองว่าจะเหมือนเอกสาร SRS อ้างอิงทุกตำแหน่ง

```json
{
  "schemaVersion": 1,
  "templateId": "tpl-srs-basic",
  "docKey": "srs-basic",
  "version": 1,
  "name": "SRS MVP",
  "inputSchema": {
    "type": "object",
    "fields": {
      "projectName": { "type": "string", "required": true },
      "description": { "type": "string", "required": true },
      "requirements": {
        "type": "array", "required": true,
        "items": {
          "type": "object",
          "fields": {
            "code": { "type": "string", "required": true },
            "detail": { "type": "string", "required": true },
            "remark": { "type": "string", "required": false }
          }
        }
      }
    }
  },
  "styles": {
    "body": { "fontFamilyKey": "ibm-plex-sans-thai", "fontWeight": "normal", "fontSize": { "value": 12, "unit": "pt" }, "lineHeightPt": 18 }
  },
  "structure": {
    "version": 4,
    "document": {
      "id": "doc-srs-basic",
      "sections": [{
        "id": "section-main", "type": "section",
        "page": {
          "size": "A4", "orientation": "portrait",
          "margin": {
            "top": { "value": 20, "unit": "mm" },
            "right": { "value": 20, "unit": "mm" },
            "bottom": { "value": 20, "unit": "mm" },
            "left": { "value": 20, "unit": "mm" }
          }
        },
        "zoneIds": ["body"],
        "nodes": {
          "body": { "id": "body", "type": "zone", "role": "body", "childIds": ["title", "project", "description", "requirements"] },
          "title": { "id": "title", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body", "sizing": { "mode": "content" } }, "children": [{ "id": "title-text", "type": "text", "text": "ข้อกำหนดระบบ" }] },
          "project": { "id": "project", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body", "sizing": { "mode": "content" } }, "children": [] },
          "description": { "id": "description", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body", "sizing": { "mode": "content" } }, "children": [] },
          "requirements": { "id": "requirements", "type": "table", "props": { "headerRowCount": 1, "repeatHeaderRows": true }, "columns": [{ "width": { "value": 25, "unit": "mm" } }, { "width": { "value": 110, "unit": "mm" } }, { "width": { "value": 35, "unit": "mm" } }], "rowIds": ["header-row", "item-row"] },
          "header-row": { "id": "header-row", "type": "table-row", "props": { "allowBreak": false }, "cellIds": ["header-code-cell", "header-detail-cell", "header-remark-cell"] },
          "header-code-cell": { "id": "header-code-cell", "type": "table-cell", "props": {}, "childIds": ["header-code"] },
          "header-detail-cell": { "id": "header-detail-cell", "type": "table-cell", "props": {}, "childIds": ["header-detail"] },
          "header-remark-cell": { "id": "header-remark-cell", "type": "table-cell", "props": {}, "childIds": ["header-remark"] },
          "header-code": { "id": "header-code", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "header-code-text", "type": "text", "text": "รหัส" }] },
          "header-detail": { "id": "header-detail", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "header-detail-text", "type": "text", "text": "รายละเอียด" }] },
          "header-remark": { "id": "header-remark", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [{ "id": "header-remark-text", "type": "text", "text": "หมายเหตุ" }] },
          "item-row": { "id": "item-row", "type": "table-row", "props": { "allowBreak": true }, "cellIds": ["item-code-cell", "item-detail-cell", "item-remark-cell"] },
          "item-code-cell": { "id": "item-code-cell", "type": "table-cell", "props": {}, "childIds": ["item-code"] },
          "item-detail-cell": { "id": "item-detail-cell", "type": "table-cell", "props": {}, "childIds": ["item-detail"] },
          "item-remark-cell": { "id": "item-remark-cell", "type": "table-cell", "props": {}, "childIds": ["item-remark"] },
          "item-code": { "id": "item-code", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [] },
          "item-detail": { "id": "item-detail", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [] },
          "item-remark": { "id": "item-remark", "type": "text-block", "role": { "role": "paragraph" }, "props": { "textStyleId": "body" }, "children": [] }
        }
      }]
    }
  },
  "bindings": [
    { "kind": "text", "targetNodeId": "project", "field": "projectName" },
    { "kind": "text", "targetNodeId": "description", "field": "description" },
    {
      "kind": "repeat-rows", "tableId": "requirements", "rowTemplateId": "item-row", "field": "requirements",
      "itemBindings": [
        { "targetNodeId": "item-code", "field": "code" },
        { "targetNodeId": "item-detail", "field": "detail" },
        { "targetNodeId": "item-remark", "field": "remark" }
      ]
    }
  ]
}
```

### กฎโครงและ binding

- MVP หนึ่ง section/body zone, node ชนิด text-block/table/table-row/table-cell;
  text children ใช้ text/line-break เท่านั้น ไม่เปิด image, field-ref หรือ template expression
- style registry ใน envelope เป็นสัญญา MVP; `lineHeightPt` เป็นค่าของ registry
  ไม่ใช่ property ใหม่ที่ยัดเข้า schema TextRunStyle v4
- TextBlock default เป็น content sizing; header row หนึ่งแถว และ item row แตกหน้าได้
- `kind: text` แทน children ของ TextBlock ว่างทั้งก้อน ไม่แทรกค่าใน string
  แบบ `{{...}}`; ค่าคงที่อยู่ TextBlock ของตนเอง ไม่ทำ rich text binding ใน MVP
- field เป็นชื่อ key ตรง ๆ ไม่มี dotted path หรือ expression evaluator
- repeat row อยู่ใน table.rowIds แต่เป็นต้นแบบ ไม่ใช่แถวข้อมูลที่จะพิมพ์เพิ่ม
  ขยายต้นแบบตามลำดับ array แล้วแทนตำแหน่งต้นแบบด้วยแถวที่สร้าง
- itemBindings อ้างเฉพาะ TextBlock ใต้ rowTemplateId; ห้ามชี้ออกนอกแถว
  ห้าม repeat ซ้อนหรือ binding สองตัวเขียนเป้าหมายเดียวกัน
- array ว่างลบต้นแบบและลูกออกจาก resolved graph เหลือ header row
- ทุก node/inline ID ต้อง unique ในเอกสาร, record key ต้องตรง id,
  ทุก reference ต้องมีอยู่ ไม่มี cycle/หลาย parent/orphan หรือ style ที่หาไม่พบ
- ID ที่ผู้เขียนกำหนดห้ามมี `~`; ID ที่สร้างใช้ `<sourceId>~item-<index>`
  (index เริ่ม 0) สำหรับ row/cell/text/inline ที่ clone แล้วแก้ child references ให้ครบ
  เก็บ sourceMap แยกเป็น `{ sourceNodeId, collectionField, itemIndex }`
  การจัดหน้าเพิ่ม fragment identity โดยไม่เปลี่ยน logical row ID
- ข้อความที่แทนสร้าง text/line-break inline ตาม LF; string ว่างใช้ children ว่าง
  ไม่สร้าง text leaf ว่างที่ผิด schema; กรณีบรรทัดว่างต้องไม่ถูกทิ้ง
- Template ต้นทางห้ามถูกแก้ระหว่าง binding/layout; resolved output ใช้ภายใน
  งานนั้น ไม่เขียนกลับเป็น template version ใหม่

## 5. Input examples และผลที่คาดหวัง

ตัวอย่างข้อมูลปกติ (Service request envelope หุ้ม data อีกชั้น):

```json
{
  "docKey": "srs-basic",
  "version": 1,
  "data": {
    "projectName": "ระบบจัดการเอกสาร",
    "description": "ข้อกำหนดระบบสำหรับทดสอบ MVP",
    "requirements": [
      { "code": "REQ-001", "detail": "ผู้ใช้ส่งข้อมูลเพื่อสร้างเอกสารได้", "remark": "" },
      { "code": "REQ-002", "detail": "ผู้ใช้ดาวน์โหลดเอกสารที่สร้างสำเร็จได้" }
    ]
  }
}
```

ผล binding: project และ description เป็นข้อความตาม input; rowIds เป็น
`[header-row, item-row~item-0, item-row~item-1]`; remark ที่ไม่ส่งกลายเป็นข้อความว่าง
ไม่มี item-row ต้นแบบค้างใน output ไม่ใช้ code ของ requirement เป็น node ID

ชุดข้อมูลอื่นใช้ template เดิม ไม่มี conditional template:

| ชุด | เปลี่ยนข้อมูลจากตัวอย่าง | ผลที่ต้องตรวจ |
| --- | --- | --- |
| ว่าง | requirements = [] | เหลือหัวตาราง ไม่มีแถวปลอม |
| ยาว | เพิ่มรายการและ detail ยาวหลายบรรทัด | มีทั้ง table ข้ามหน้าและ row เดียวข้ามหน้า ข้อมูลครบตามลำดับ |
| ผิดชนิด | requirements[0].detail = 7 | INVALID_DATA ที่ data.requirements[0].detail ไม่สร้าง job |
| ขาด key | ลบ projectName | INVALID_DATA ที่ data.projectName |
| binding ผิด | เปลี่ยน targetNodeId เป็น missing | INVALID_TEMPLATE ตอนลงทะเบียน |

R2 ต้องเก็บข้อมูลชุดยาวเป็น fixture คงที่ที่ทำให้เกิดรอยต่อจริงด้วยฟอนต์ที่เลือก
ไม่กำหนดจำนวนหน้าคาดเดาใน R1 และไม่สร้างข้อมูลสุ่มสำหรับเกณฑ์รับงาน

## 6. Core interface และ error contract

API เชิงตรรกะที่เสนอ (ยังไม่มี implementation):

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; issues: Issue[] };
type Issue = {
  code: string;
  path: string;
  message: string;
  nodeId?: string;
};

validateTemplate(input: unknown): Result<ValidatedTemplate>;
validateData(template: ValidatedTemplate, input: unknown): Result<ValidatedData>;
bindDocument(template: ValidatedTemplate, data: ValidatedData): Result<ResolvedDocument>;
createPdfEngine(resources: ExportResources): Promise<Result<PdfEngine>>;
// PdfEngine exposes generatePdf(resolvedDocument): Promise<Result<PdfArtifact>>
// PdfArtifact = { bytes: Uint8Array; mediaType: "application/pdf"; pageCount: number }
```

ValidatedTemplate/Data เป็น output จาก validators ไม่ใช่การ cast raw API input
Service ตรวจ validation ก่อน queued; processor ตรวจข้อมูลที่โหลดจาก DB อีกครั้ง
ก่อน bind เพื่อไม่เชื่อ persisted JSON โดยไม่มี validation

ExportResources คือ font registry และ text/font provider ที่เตรียมจาก config
ของโปรแกรม ไม่รับ executable path หรือ font path จาก API/template
ไม่มีตัว engine ถูกสร้างใหม่สำหรับทุกตัวอักษรหรือทุก row

รหัสหลัก: INVALID_TEMPLATE, INVALID_DATA, UNSUPPORTED_FEATURE,
RESOURCE_UNAVAILABLE, LAYOUT_FAILED, PDF_RENDER_FAILED
Service เพิ่ม TEMPLATE_NOT_FOUND, VERSION_NOT_FOUND, JOB_NOT_FOUND,
OUTPUT_NOT_READY, OUTPUT_NOT_FOUND, STORAGE_FAILED, PROCESS_INTERRUPTED
ไม่ส่ง stack trace/รายละเอียด path ภายในเป็น public error
รายละเอียด HTTP code/route อยู่ R4; ไม่เพิ่ม error framework ทั่วไป

## 7. ขอบเขต repo และการตั้งชื่อ

```text
flowdoc-core/
  src/
    index.ts          public exports ที่ตั้งใจให้ใช้เท่านั้น
    template/         template schema และ graph validation
    data/             input validation
    binding/          text binding, row expansion, source mapping
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
- ฟังก์ชันเริ่มด้วยกริยาตามงาน เช่น validateTemplate, bindDocument,
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

R1 พร้อมให้ review เมื่อ: ตัวอย่าง JSON ถูกต้องเชิงโครง, ทุก field ตาม binding
ไปยัง node ได้, array ว่าง/ยาว/ผิดชนิดมีกติกา, ไม่มีข้อกำหนดนอก MVP,
และ ownership ชัดเจน เกณฑ์นี้ไม่เท่ากับ R2 runtime ผ่าน

Next decision: เจ้าของ review สัญญา template/binding และขอบเขต repo นี้
จากนั้นจึงทำ implementation plan สำหรับ R2 ที่มี prerequisite probe ชัดเจน
