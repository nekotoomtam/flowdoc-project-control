# FlowDoc R3 — หัวและท้ายกระดาษ

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Cross-Repo Boundary Reviewer.
Status: implemented and owner-accepted in development 0.1.11, 2026-10-10.
This is the accepted contract; implementation evidence is in the R3 plan delivery section.
It does not approve release.
Delivery: inline Core/Service implementation, medium/routine; execution IDs not applicable.
Runtime owners: Core for contracts, binding, measurement/layout/PDF; Service for
API, resource preparation, persisted current/version schemas and package integration.
Authority: [page-system roadmap](flowdoc-page-system-roadmap-2026-10-10.md).
Base: R2 development Core 3e85fd2 / Service 7ea6150, both 0.1.10.
Release remains 0.1.8. Existing R2 acceptance is not reopened.

Document budget: this design and roadmap pointer. Proof budget for this drafting
step: inspect current contracts/owner guides, diff/link checks and check:data.
No product edits, dependency changes, DB migration or execution dispatch here.

## Accepted purpose and request boundary

หัวท้ายคือพื้นที่เนื้อหาที่วางซ้ำบนหน้าที่เลือก ผู้สร้างแม่แบบกำหนดโครง
ผู้เรียก API ส่งเฉพาะค่าตัวแปร ไม่ส่ง node graph และไม่ทำข้อมูลซ้ำตามจำนวนหน้า.

- `data`: ตัวแปรปกและเนื้อหาหลักตามเดิม; ไม่มี request.cover แยก.
- `header`: ตัวแปรหัวกระดาษเท่านั้น.
- `footer`: ตัวแปรท้ายกระดาษเท่านั้น.
- ชื่อเดียวกันในสามขอบเขตเป็นคนละตัว ห้ามค้นข้ามขอบเขตโดยอัตโนมัติ.
- ใช้กฎ required/type/default/optional-empty และ unknown-key diagnostics เดิม
  โดยผูก diagnostic กับขอบเขตจริง เช่น header.companyName.
- ถ้าไม่มี definition ไม่ต้องส่งส่วนนั้น; การส่ง key เกินใช้แนวทางเดิม
  ไม่ทำให้ข้อมูลนั้นกลายเป็นโครงสร้างที่ระบบวาดเอง.
- ถ้ามี definition แต่ไม่ส่ง object ให้ตรวจเหมือนชุดข้อมูลว่างตามกฎเดิม;
  required ไม่หายไปเพียงเพราะไม่ได้ส่ง header/footer.

ตัวอย่างการจัดข้อมูล (เฉพาะส่วนที่เกี่ยวข้อง ไม่ใช่ request schema ฉบับเต็ม):

```json
{
  "docKey": "quotation",
  "data": { "projectName": "โครงการตัวอย่าง" },
  "header": { "companyName": "บริษัทตัวอย่าง", "logo": "asset-reference" },
  "footer": { "contact": "ข้อมูลติดต่อ" }
}
```

`asset-reference` เป็น placeholder; ภาพใช้ image input contract เดิม ไม่กำหนด
รูปแบบลิงก์/อัปโหลดใหม่จากตัวอย่างนี้.

## Content and page selection

เริ่มจากหัวหนึ่งชุดและท้ายหนึ่งชุดต่อแม่แบบ ไม่เพิ่มหลาย named variants.
รองรับ TextBlock, Image และ Columns หนึ่งชั้นในพื้นที่หัวท้าย.
ภาพเป็น scope รอบนี้ ใช้ resource preparation เดิม; Table, Area, repeat และ
Columns ซ้อนอยู่ภายนอกขอบเขตหัวท้ายรอบนี้ ไม่กระทบความสามารถในเนื้อหาหลัก.

แต่ละ section เลือกการแสดงหัวและท้ายแยกกัน:
- ทุกหน้า (default สำหรับ section ปกติเมื่อมี definition).
- เฉพาะหน้าแรกของ section.
- ตั้งแต่หน้าที่สองของ section.
- ไม่แสดง.

หน้าแรกนับจาก physical pages ที่สร้างให้ section นั้น ไม่ใช้เลขแสดงของสารบัญ.
Cover ไม่ใช้หัวท้ายเสมอ ไม่จองพื้นที่ ไม่ต้องตั้งค่าซ่อนเพิ่ม.
Explicit blank ว่างจริง ไม่มีหัวท้ายและไม่จองพื้นที่.
Body section ว่างไม่สร้างหน้าเพราะมีหัวท้ายอย่างเดียว.

## Height and space contract

- ค่าเริ่มต้น content-height: bind ข้อมูล/เตรียมภาพแล้ววัดด้วย text runtime เดิม.
- เลือก fixed-height ได้เพื่อรักษาตำแหน่ง; ไม่มี shrink หรือ clip เพื่อหลบ overflow.
- พื้นที่เปิดใช้สูงขั้นต่ำหนึ่งบรรทัดตาม resolved base font/line-height
  ของหัวหรือท้ายนั้น แม้ข้อความว่างหรือเป็นพื้นที่ภาพอย่างเดียว.
- `minHeight` ที่ระบุเพิ่มขั้นต่ำได้ แต่ลดต่ำกว่าหนึ่งบรรทัดไม่ได้.
- `maxHeight` คือเพดานของพื้นที่นั้น; min > max หรือ fixed ต่ำกว่าขั้นต่ำ
  เป็นข้อผิดพลาด. ค่าที่ตัดสินได้จากแม่แบบตรวจตั้งแต่ validation.
- ความสูงขั้นต่ำรวมอยู่ในกล่อง; gap กับเนื้อหาหลักคิดแยก.
- ใช้หน่วย Length เดิม mm/pt; fixed ต้องเป็นบวก min/max ต้อง finite
  และใช้ข้อจำกัดเดียวกันกับ runtime Length ที่เกี่ยวข้อง.
- header + footer + active gaps ไม่เกิน 40% ของความสูงภายใน page margins
  บนหน้าที่แสดงจริง เหลือเนื้อหาหลักอย่างน้อย 60%.
- หัวหรือท้ายที่ไม่แสดงมีทั้งความสูงและ gap เป็นศูนย์.
- ตรวจเพดานตาม page layout จริง รวมแนวนอน; ห้ามเฉลี่ยข้ามทั้งเล่ม.
- ข้อมูลจริงเกิน max/fixed/เพดานรวม: ล้มการสร้าง PDF พร้อม diagnostic
  ขอบเขต section และ node ที่เกี่ยวข้อง ไม่ส่ง PDF ที่ทับกันหรือสำเร็จบางส่วน.

กติกา 40% เป็นนโยบายเริ่มต้นที่เจ้าของรับ ไม่ใช่มาตรฐานเอกสารภายนอก.
รายละเอียดค่า gap default, style fallback และ fixed/min/max combinations
ต้องระบุเป็นค่าชัดใน implementation contract ก่อนลงโค้ด ห้าม executor เดาเอง.

## Layout approach and boundaries

เตรียมข้อมูลและทรัพยากรครั้งเดียว วัดหัวท้ายแยกตามความกว้าง/page layout/style
ที่ใช้จริง แล้วใช้ผลวัดเดียวกันทั้งสงวนพื้นที่และวาด. แต่ละหน้าตัดสินการแสดง
ก่อนจัดเนื้อหา; ตาราง/ภาพที่ต่อหน้าต้องรับ content rectangle ของหน้านั้น.
ไม่วัดซ้ำต่อ node เนื้อหา และไม่รับรอง cache/performance ที่ยังไม่พิสูจน์.

หัวท้ายซ้ำต้องไม่เพิ่มสารบัญซ้ำหรือทำ anchor identity ชนกับเนื้อหา.
เลขหน้าอัตโนมัติ/total pages ไม่เป็นข้อมูลผู้ใช้ใน header/footer รอบนี้;
ต้องตรวจตำแหน่งเลขชั่วคราว R2 ไม่ชน footer ใหม่ ก่อนรับ implementation.
R4 จะกำหนด numbering fields อย่างเป็นทางการ ไม่แอบขยายใน R3.

ส่วนปิดท้ายครั้งเดียว (ยอดรวม/ลายเซ็น), last-page pinning, สูตรคำนวณ,
DOCX, frontend, หลายชุดหัวท้าย และ DB redesign ทั้งระบบเลื่อนไว้.
ผู้เรียกคำนวณค่าและส่งมาเองในระยะนี้.

## Technical findings and remaining design work

Read-only inspection found:
1. Core src/template/types.ts TemplateNode export union ยังไม่มี Columns.
   ห้ามถือว่า Editor/ระบบเก่ามีแล้วเท่ากับแพ็กเกจ export ใช้ได้.
   ต้องกำหนด container/child restrictions และ reusable layout boundary
   สำหรับ Columns หนึ่งชั้นโดยไม่เปิด arbitrary nested nodes.
2. Service src/templates/assembly.ts SchemaRow ปัจจุบันอ้าง formatId และ
   ใช้ null เป็น global เพียงชุดเดียว; จำนวน schemas ถูกตรวจเท่ากับ formats+1.
   การเพิ่ม header/footer ต้องเลือก ownership discriminator/relations สำหรับ
   current และ version พร้อมกัน ห้ามยัดหลาย null schema ผ่าน invariant เดิม.
3. Core prepared input ปัจจุบันมี data/content; ต้องส่ง scoped values ผ่าน
   validation, snapshots, images and composition โดยไม่มี global fallback.

These are blocking for a detailed implementation plan, not reasons to change the
accepted user-facing API. Next step is bounded read-only design of those seams,
including forward-only migration if required, before writing exact task interfaces.
No implementation plan is considered ready merely from this design file.

## Acceptance to carry into implementation plan

- Same key in data/header/footer renders its own value; cover reads data only.
- Missing/default/wrong-type values and images preserve existing input rules.
- Header/footer content survives current save, publish, version snapshot and job reload.
- One-line minimum, empty text, fixed, min/max and 40% exact/over boundary tested.
- Portrait/landscape, first/continuation/all/none, cover/blank/empty sections tested.
- Long Thai variables, image + Columns, multipage merged tables and image flow
  do not overlap repeated regions or lose content.
- TOC/links and temporary page numbers stay correct; no repeated-heading pollution.
- Old models and published snapshots keep previous output behavior.
- Packed Core Linux consumer + Service isolated DB/API test + owner PDF review.
- Do not declare migration004 baseline test debt resolved without separate proof;
  retain the R1/R2 limitation until repaired before combined release.


## Technical decisions for the implementation plan

Use a model14 gate; models4–13 remain unchanged. Add optional template header/footer
as band definitions, each with inputSchema, fragment, baseTextStyleId, sizing and gap.
Bindings marked global inside a band resolve against that band's inputSchema/data,
never document data; local/item binding is unavailable without repeat contexts.
Band schema starts with scalar string/image/link, using existing field semantics.
Arrays/Area require repeat support and remain outside this band scope.

Sizing: content mode default, optional minHeight/maxHeight; fixed mode requires
height and rejects minHeight/maxHeight to avoid contradictory settings. Missing
min resolves to one base-style line; explicit min below that line is invalid.
Base style is required and references an existing style. Gap defaults to 0pt;
explicit nonnegative gap is allowed. Top-align contents inside reserved height.
No implicit padding. Content/max and fixed heights obey the aggregate40% ceiling.

Columns is a band-only node, one level: props contains nonnegative gap (default0),
columns contains ordered {weight, childIds}; positive finite weights split usable
width after gaps. Each column stacks TextBlock/Image only, top-aligned. Height is
maximum column height. Columns cannot be a child of Columns or enter body/cells.
A regular band root sequence may contain TextBlock/Image/Columns. Disallow TOC
membership and anchor definitions on repeated band nodes; references to body
anchors retain existing resolution. Node identities are isolated by band prefix.

Section headerMode/footerMode enums: all, first, continuation, none. Defaults all
when corresponding definition exists; cover/blank override none. Footer is drawn
inside bottom content margin, ending at the inner bottom edge; temporary page
numbers remain in the outer bottom margin, preserving the existing18pt requirement.
This prevents overlap without introducing R4 page-number fields.

Service schema rows gain scope global|format|header|footer, with format reference
required only for format. Missing scope in legacy current-record API input is
normalized from formatId; outputs can expose scope. New rows and snapshots carry
scope. Migration010 backfills both current and version tables, replaces owner
uniqueness constraints, and preserves every existing schema/variable identity.
No new variable-type master, no duplicate header/footer schemas hidden in JSON.

Continuation tables must read live page top/bottom through getters after nextPage.
A row that cannot fit the first-page region but fits the next-page region must
advance once before rejecting; a row impossible on any applicable continuation
page fails without a loop. Repeated table headers count against the same budget.

These decisions close the seams recorded above; exact tasks and verification are
in the R3 plan. They are proposed implementation details, not runtime evidence.


Delivery and limits: [R3 accepted delivery](flowdoc-page-system-r3-plan-2026-10-10.md#accepted-delivery--2026-10-10).
