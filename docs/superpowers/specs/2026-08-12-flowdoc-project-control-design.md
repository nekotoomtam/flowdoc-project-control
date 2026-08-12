# FlowDoc Project Control — Architecture and GUI Design

สถานะ: อนุมัติแนวคิดแล้ว รอการตรวจทานเอกสารฉบับเขียน

วันที่: 2026-08-12
ขอบเขต: สถาปัตยกรรม repo กลาง, สัญญาข้อมูล, GUI รุ่นแรก, วงจรงาน, การย้ายเอกสาร และทิศทาง AGENTS/Skills

## 1. เป้าหมาย

`flowdoc-project-control` คือพื้นที่ควบคุมงานและความเข้าใจร่วมระหว่างผู้ดูแลโปรเจกต์กับ Codex สำหรับ FlowDoc ทั้งระบบ ไม่ใช่ product runtime, public documentation site หรือที่เก็บสำเนาโค้ดจาก repo อื่น

Repo นี้ต้องช่วยตอบคำถามต่อไปนี้ได้จากจุดเดียว:

- ตอนนี้ระบบมีส่วนใดอยู่บ้าง และแต่ละส่วนอยู่ระดับใด
- อะไรเป็นความจริงที่ยืนยันแล้ว อะไรเป็นแผน ความเสี่ยง หรือสิ่งที่ยังไม่รู้
- งานใดอยู่ในคิว กำลังทำ ติดขัด หรือรอตรวจ
- เอกสารและหลักฐานที่รองรับแต่ละ Node อยู่ที่ใด
- งานหนึ่งควรไปแก้ที่ Core, Editor หรือ Backend
- เมื่อทำงานเสร็จแล้ว ความจริงส่วนกลางเปลี่ยนอย่างไร

GUI เป็นเครื่องมืออ่านภาพรวมของข้อมูลนี้ ส่วน Git และไฟล์ต้นฉบับเป็นแหล่งความจริงที่ตรวจย้อนหลังได้

## 2. หลักการออกแบบ

1. **Shared truth, not copied truth** — Repo กลางครองความจริงข้าม repo แต่ไม่คัดลอก implementation ภายในทั้งหมดมาไว้ที่นี่
2. **File-first** — ข้อมูลต้นฉบับอยู่ในไฟล์และตรวจประวัติด้วย Git ได้ ฐานข้อมูลเป็นทางเลือกในอนาคต ไม่ใช่เงื่อนไขเริ่มต้น
3. **Structured data plus Markdown** — ข้อมูลที่ระบบต้องตีความใช้รูปแบบเคร่งครัด ส่วนคำอธิบายที่มนุษย์อ่านใช้ Markdown
4. **Read-only GUI first** — GUI รุ่นแรกอ่านข้อมูลและช่วยสำรวจเท่านั้น การแก้ไขยังทำผ่านไฟล์และ Git
5. **Evidence before current** — งานเสร็จไม่เท่ากับความจริงได้รับการยืนยัน ต้องมีหลักฐานและผ่าน gate ที่กำหนดก่อนใช้สถานะ `current`
6. **Work is not truth** — งานชั่วคราวและเอกสารถาวรเป็นคนละชนิดข้อมูล งานจบต้องกลั่นผลเข้าเอกสารถาวรก่อนนำงานออก
7. **No silent partial truth** — ข้อมูลผิดหรือ reference ขาดต้องทำให้การตรวจล้มเหลวและ GUI แสดงข้อผิดพลาด ห้ามประกอบภาพบางส่วนเหมือนข้อมูลสมบูรณ์
8. **Stable identifiers** — ความสัมพันธ์ใช้ ID ที่คงที่ ไม่ใช้ชื่อที่เปลี่ยนได้เป็นตัวตน
9. **One canonical meaning** — ศัพท์กลางหนึ่งคำมีหนึ่งความหมาย หากศัพท์เก่ามีความหมายต่าง ต้องแยก alias พร้อมบริบทและช่วงเวลาที่ใช้
10. **Start small, preserve the path to scale** — รุ่นแรกไม่ใช้ฐานข้อมูลหรือ graph engine ขนาดใหญ่ แต่สัญญาข้อมูลต้องย้ายไปสถาปัตยกรรมที่ใหญ่ขึ้นได้

## 3. ขอบเขตอำนาจของแต่ละ Repo

### 3.1 Project Control ครอง

- เป้าหมายและภาพรวมข้าม repo
- Domain/Node hierarchy ของระบบ
- นิยามกลางและ alias ตามบริบท
- Roadmap, release line และ baseline ระดับโปรเจกต์
- คำตัดสินที่ยังมีผล
- ความเสี่ยงและสิ่งที่ยังไม่รู้
- Work queue และสถานะการส่งต่องาน
- Repository registry
- Evidence index ที่ชี้ไปยังหลักฐานใน repo ปลายทาง

### 3.2 Product Repo ครอง

- source code และ runtime behavior
- tests และ fixtures
- implementation-local contracts
- build/release mechanics เฉพาะ repo
- เอกสารที่ต้องอยู่ใกล้โค้ดเพื่อคงความถูกต้อง

Product repo เริ่มต้นมีสามแห่ง:

- FlowDoc Core
- FlowDoc Editor
- FlowDoc Backend

### 3.3 กฎ Reference ข้าม Repo

Reference ที่ถือเป็นหลักฐานต้องระบุอย่างน้อย:

- `repositoryId`
- commit hash ที่แน่นอน
- stable contract/evidence ID หรือ path ที่ตรวจได้

ชื่อ branch เพียงอย่างเดียวไม่ถือเป็นหลักฐาน เพราะเปลี่ยนเป้าหมายได้ภายหลัง

## 4. สถาปัตยกรรมข้อมูลแบบ File-first

ข้อมูลแยกเป็นสามแกนหลักและสองชุดสนับสนุน:

```text
Node       — ระบบมีอะไรและสัมพันธ์กันอย่างไร
Work       — เรากำลังทำอะไรอยู่
Document   — ความจริงหรือคำอธิบายถาวรอยู่ที่ใด
Repository — งานและหลักฐานอยู่ repo ใด
Evidence   — อะไรยืนยันคำกล่าวหรือสถานะนั้น
```

ไฟล์ข้อมูลเครื่องอ่านใช้ JSON หนึ่ง record ต่อไฟล์เพื่อให้ schema, diff และการอ้าง ID ชัดเจน เนื้อหายาวใช้ Markdown ตัวสร้างดัชนีเป็นผู้รวมทั้งสองส่วนเข้าด้วยกัน

### 4.1 Node

Node เป็นตัวแทนหัวข้อในผัง ไม่เก็บเนื้อหาเอกสารยาวหรือรายการงานทั้งหมดไว้ข้างใน

ฟิลด์ขั้นต่ำ:

- `id` — ตัวตนคงที่
- `title` — ชื่อที่แสดง
- `parentId` — Node แม่ หรือ `null` สำหรับราก
- `summary` — สรุปสั้นสำหรับแถบขวา
- `truthState` — `current | planned | risk | unknown`
- `order` — ลำดับแสดงผลระหว่าง Node พี่น้อง
- `documentIds` — reference ไปยัง Document metadata
- `evidenceIds` — หลักฐานที่รองรับสถานะ/คำกล่าวปัจจุบัน
- `repositoryIds` — repo ที่เกี่ยวข้อง

Node hierarchy ต้องเป็นต้นไม้สำหรับการนำทางหลัก: Node หนึ่งตัวมี parent หลักได้หนึ่งตัว ความสัมพันธ์ข้ามกิ่งให้เก็บเป็น relation แยก ไม่สร้าง parent หลายตัวจนเส้นทางย้อนกลับกำกวม

### 4.2 Work

Work เป็นรายการชั่วคราวสำหรับการดำเนินงาน ไม่ใช้แทนความจริงถาวร

ฟิลด์ขั้นต่ำ:

- `id`
- `title`
- `nodeId`
- `repositoryIds`
- `workState` — `queued | in-progress | blocked | in-review`
- `summary`
- `blockedBy` และ `unblockOwner` เมื่อเป็น `blocked`
- `requiredEvidence`
- `createdAt`
- `updatedAt`

งานที่เสร็จสมบูรณ์ไม่ค้างเป็นสถานะ `done` ใน active queue หลังกลั่นผลและแนบ evidence แล้ว งานถูกนำออกจากชุด active โดย Git history เป็นประวัติถาวร หากภายหลังต้องการรายงานประวัติงาน ระบบสามารถสร้าง view จาก Git/evidence โดยไม่เก็บงานเก่าปะปนกับคิวปัจจุบัน

### 4.3 Document

Document metadata เชื่อม Markdown กับ Node โดยไม่บังคับให้ GUI เดาความหมายจากข้อความ

ฟิลด์ขั้นต่ำ:

- `id`
- `title`
- `path`
- `nodeIds`
- `role` — `current-state | contract | verification | risk | unknown | decision | historical-note | glossary | version`
- `authority` — ขอบเขตที่เอกสารมีอำนาจอธิบาย
- `lifecycle` — `active | superseded | retired`
- `repositoryRefs` — หลักฐานหรือเอกสารเฉพาะ repo ที่เกี่ยวข้อง

เอกสาร `superseded` หรือ `retired` ไม่แสดงเป็นคำตอบหลักใน Summary Inspector แต่ดูได้จากรายละเอียดหรือประวัติเมื่อจำเป็น

### 4.4 Repository

Repository registry ไม่เก็บ source copy หรือใช้ submodule

ฟิลด์ขั้นต่ำ:

- `id`
- `name`
- `remote`
- `checkoutAlias` — ชื่อที่ใช้ค้นตำแหน่ง checkout จาก local config
- `defaultBranch`
- `ownershipSummary`

Absolute path ของแต่ละเครื่องห้าม commit ใน registry แต่เก็บใน local config ที่ Git ไม่ติดตาม แล้ว resolve ผ่าน `checkoutAlias` เพื่อให้ repo กลางย้ายเครื่องได้และไม่เผยข้อมูลส่วนตัวของ filesystem

### 4.5 Evidence

Evidence ผูกคำกล่าวกับผลที่ตรวจได้

ฟิลด์ขั้นต่ำ:

- `id`
- `nodeIds`
- `repositoryId`
- `commit`
- `pathOrContractId`
- `verificationSummary`
- `verifiedAt`

Evidence record ไม่แปลว่าทุกสิ่งใน commit นั้นได้รับการยืนยัน ต้องบอกขอบเขตคำกล่าวที่หลักฐานรองรับอย่างชัดเจน

## 5. Truth State และ Work State

สองสถานะนี้ต้องแยกกันทั้งใน schema, validator และ GUI

### Truth State

- `current` — ความจริงปัจจุบันที่มีหลักฐานตาม gate
- `planned` — เจตนาหรือทิศทางที่ยังไม่ยืนยันเป็นของจริง
- `risk` — มีความเสี่ยงที่กระทบหัวข้อนี้เป็นสาระหลัก
- `unknown` — ข้อมูลสำคัญยังไม่ทราบหรือยังพิสูจน์ไม่ได้

### Work State

- `queued` — รอเริ่ม
- `in-progress` — กำลังดำเนินการ
- `blocked` — เดินต่อไม่ได้จนกว่าเงื่อนไขที่ระบุจะถูกแก้
- `in-review` — ทำงานส่วนหลักแล้วและกำลังตรวจหลักฐาน/ความถูกต้อง

ตัวอย่างที่ถูกต้อง: Node หนึ่งอาจเป็น `planned` พร้อม Work `in-progress` หรือเป็น `current` พร้อม Work `blocked` สำหรับการปรับปรุงรอบใหม่ได้ สถานะหนึ่งจึงห้ามอนุมานอีกสถานะโดยอัตโนมัติ

## 6. โครงสร้าง Repo เป้าหมาย

```text
flowdoc-project-control/
├─ data/
│  ├─ nodes/
│  ├─ work/
│  ├─ repositories/
│  ├─ documents/
│  └─ evidence/
├─ docs/
│  ├─ domains/
│  ├─ decisions/
│  ├─ risks/
│  ├─ versions/
│  ├─ GLOSSARY.md
│  └─ GLOSSARY_TH.md
├─ schemas/
├─ generated/
│  └─ project-index.json
├─ app/
├─ tools/
└─ tests/
```

`generated/` เป็นผลลัพธ์ deterministic และห้ามแก้ด้วยมือ คำสั่งตรวจต้องล้มเหลวหากผลที่ commit ไว้ไม่ตรงกับข้อมูลต้นฉบับ

## 7. Data Flow

```text
Structured source + Markdown
            │
            ▼
        Validator
            │
            ▼
       Index Builder
            │
            ▼
generated/project-index.json
            │
            ▼
   Read-only Local Web App
```

ลำดับต้องเป็นทางเดียว:

1. โหลด structured records และ Markdown
2. ตรวจ schema, ID, parent, relation, document path และ cross-repo reference
3. ตรวจ semantic rules เช่น Truth/Work separation และ evidence requirement
4. สร้าง read model แบบ deterministic
5. GUI อ่านเฉพาะ read model

GUI ห้ามอ่าน Markdown แล้วอนุมาน authority, status หรือ relation เอง เนื้อหา Markdown เปิดแสดงได้เฉพาะผ่าน Document metadata ที่ผ่านการตรวจแล้ว

## 8. GUI รุ่นแรก

GUI เป็น TypeScript + React local web app ใช้ธีมสว่าง ไม่มีระบบบัญชี ฐานข้อมูล หรือ cloud service

### 8.1 Focus Stack Map

พื้นที่ตรงกลางใช้ดูภาพหยาบมากที่สุด:

- ancestor Nodes เรียงอยู่ด้านบนตามเส้นทางที่เข้ามา
- current Node อยู่ตรงกลางและเด่นที่สุด
- child Nodes อยู่ด้านล่าง
- กด child เพื่อเลื่อนลงหนึ่งระดับ โดย current เดิมย้ายเป็น ancestor
- กด ancestor เพื่อย้อนกลับ และตัดระดับที่ลึกกว่าจุดนั้นออก
- ระดับที่เคยเข้ามาในเส้นทางปัจจุบันยังมองเห็นอยู่ทั้งหมด
- ขนาด ตำแหน่ง เส้น และข้อความบอกลำดับชั้น ไม่ใช้สีเพียงอย่างเดียว
- Node มี URL ถาวรสำหรับเปิดซ้ำ ส่งต่อ และ bookmark
- มีการค้นหา Node และเมื่อเลือกผลค้นหา ระบบสร้าง ancestor path ที่ถูกต้อง

รุ่นแรกไม่มีการลาก Node, infinite canvas, graph layout อิสระ หรือการแก้ข้อมูลผ่าน GUI

### 8.2 Summary Inspector ด้านขวา

ด้านขวาใช้ตอบว่า “Node นี้คืออะไรและควรเปิดดูต่อไหม” ไม่ใช่พื้นที่อ่านรายละเอียด

แสดงเฉพาะ:

- ชื่อและคำอธิบาย 2–3 บรรทัด
- Truth State
- Work State ที่สำคัญที่สุด
- จำนวน child Nodes
- จำนวน Work queue และ Documents โดยแยกคนละส่วน
- ความเสี่ยงหรือสิ่งติดขัดสำคัญไม่เกินหนึ่งรายการ
- ปุ่ม `ดูทั้งหมด`

ห้ามแสดงรายการยาว เนื้อหาเอกสารเต็ม หรือผสมคิวกับเอกสารในชุดเดียว

### 8.3 Full Detail Modal

ปุ่ม `ดูทั้งหมด` เปิดหน้าต่างกลางทับหน้าเดิมโดยไม่เปลี่ยน current Node หรือทำให้ตำแหน่งในผังหาย ภายในแบ่งเป็น:

- ภาพรวม
- งานปัจจุบันและคิว
- เอกสารอ้างอิง
- ความเสี่ยงและสิ่งที่ยังไม่รู้
- หลักฐานและประวัติย่อ

การปิด Modal ต้องกลับสู่ผังเดิมพร้อมตำแหน่ง, URL และ selection เดิม

### 8.4 สีและการเข้าถึง

- ระบบใช้ธีมสว่างเป็นค่าเริ่มต้น
- สีบอก Truth/Work State เท่านั้น ไม่ใช้สีเดียวกันเพื่อบอกตำแหน่ง ancestor/current/child
- ทุกสีมีข้อความหรือสัญลักษณ์กำกับ
- ลำดับชั้นและสถานะต้องเข้าใจได้เมื่อมองแบบขาวดำ
- keyboard navigation, focus visibility และ reduced motion เป็น acceptance criteria ของรุ่นแรก

## 9. พฤติกรรมเมื่อข้อมูลผิด

Validator ต้องปฏิเสธอย่างน้อยกรณีต่อไปนี้:

- ID ซ้ำ
- parent หาย หรือ hierarchy มี cycle
- Document path หาย
- reference ชี้ repository/evidence/contract ที่ไม่รู้จัก
- สถานะอยู่นอกค่าที่อนุญาต
- Work `blocked` ไม่มีสาเหตุหรือผู้ปลดล็อก
- Node `current` อ้างการยืนยันที่ไม่มี evidence ตามกฎของ Node นั้น
- generated index ไม่ตรง source

เมื่อพบข้อผิดพลาด ระบบไม่เขียนทับ index ที่ถูกต้องล่าสุดด้วยผลครึ่งสำเร็จ และหน้า GUI ต้องแสดง Diagnostic View ที่ระบุไฟล์, record ID, กฎที่ผิด และแนวทางแก้ แทนการซ่อน Node ที่เสียเงียบ ๆ

## 10. วงจรงาน

```text
queued
  → in-progress
  → in-review
  → ตรวจหลักฐาน
  → ปรับเอกสารถาวร/Truth State
  → นำ Work ออกจาก active queue
```

กฎปิดงาน:

1. Work ต้องระบุ Node และ repo เป้าหมาย
2. งานใน product repo ต้องคืน commit และผลตรวจตาม required evidence
3. Project Control ตรวจว่าหลักฐานตรงกับขอบเขตคำกล่าว
4. ปรับ Document/Evidence/Node ที่เกี่ยวข้อง
5. ตรวจทั้ง Project Control และ product repo ที่เปลี่ยน
6. นำ Work ชั่วคราวออกเมื่อข้อเท็จจริงถาวรถูกบันทึกครบแล้วเท่านั้น

`in-review` ไม่ทำให้ Truth State เปลี่ยนโดยอัตโนมัติ และการลบ Work ก่อนบันทึกความจริงถาวรถือเป็นข้อผิดพลาด

## 11. การย้ายและยุบเอกสารเดิม

ห้ามนำเอกสารเดิม 408 ฉบับเข้ามาทั้งก้อน เอกสารต้องถูกจำแนกเป็น:

1. ความจริงข้าม repo — กลั่นมาไว้ใน Project Control
2. implementation-local contract — คงไว้ใน product repo และชี้ reference
3. เอกสารทำงาน/ประวัติที่หมดหน้าที่ — สรุป Historical Note ที่จำเป็น แล้วลบต้นฉบับหลัง reference และ tests ย้ายครบ

กระบวนการต่อกลุ่ม prefix:

1. รวบรวมไฟล์ที่มีคำนำหน้าร่วมกัน
2. อ่านทุกไฟล์และ dependency ในกลุ่ม
3. แยก current truth, history, conflict และ unknown
4. สร้างเอกสารปัจจุบันหนึ่งฉบับพร้อม Historical Note สั้น
5. สร้าง Node/Document metadata และ reference
6. ย้าย reference/tests ใน repo ต้นทาง
7. ตรวจทั้งสองฝั่ง
8. ลบต้นฉบับเมื่อ gate ผ่าน
9. บันทึก commit และ verification เป็น Evidence

กลุ่มนำร่องคือ `CORE_ROUTE_*` งานย้ายกลุ่มอื่นเริ่มได้หลังกลุ่มนี้พิสูจน์รูปแบบและเผยความเสี่ยงจริงแล้ว

## 12. AGENTS และ Skills รุ่นใหม่

ส่วนนี้ออกแบบรายละเอียดหลัง GUI และ pilot migration เพื่ออิงวิธีทำงานจริง

ข้อกำหนดที่ล็อกไว้:

- `AGENTS.md` เป็นตัวนำทางสั้น ไม่รวมทุกกฎไว้ในไฟล์เดียว
- Agent เริ่มจาก Work ID หรือ Node ID และได้รับ context package เท่าที่จำเป็น
- Project Control AGENTS ครอง workflow ข้าม repo; product AGENTS ครอง implementation-local rules
- Skill หนึ่งตัวมีหน้าที่เดียว ระบุ input, authority, files ที่อ่าน/แก้ได้, evidence ที่ต้องคืน และ stop conditions
- Skill และ schema มี version
- Skills ต้องมีการทดสอบทั้ง happy path, missing data, broken reference, cross-repo work และ incomplete closure

ชุด Skill เป้าหมายเบื้องต้น:

- รับและจำแนกงาน
- ทำงานข้าม repo
- กลั่นและยุบเอกสาร
- ตรวจและปิดงาน
- อัปเดต truth/evidence
- เตรียม baseline/release

รายละเอียดของ AGENTS และแต่ละ Skill ต้องมี design spec แยกหลัง Phase 3 ไม่รวมเป็น implementation ของ GUI รอบแรก

## 13. ความปลอดภัยและความเป็นส่วนตัว

- GUI รุ่นแรก bind เฉพาะเครื่อง local โดยค่าเริ่มต้น
- ไม่มีการส่งข้อมูล telemetry หรือเนื้อหาออกอินเทอร์เน็ต
- ไม่มี login เพราะยังไม่เปิดให้ผู้ใช้อื่นหรือ network ภายนอก
- UI ไม่รัน script หรือ HTML จาก Markdown
- path จาก metadata ต้องถูกจำกัดให้อยู่ใน repo ที่อนุญาต
- การเปิด reference ข้าม repo เป็น read-only และต้องตรวจ repository registry ก่อน
- คำสั่ง build/check ห้ามแก้ product repo โดยอัตโนมัติ

หากภายหลังต้องเปิดผ่าน private server ต้องมี threat model และ design spec ใหม่ก่อนเพิ่ม authentication/network exposure

## 14. แนวทางทดสอบ

### Data and validation

- schema validation ของทุก record type
- ID uniqueness, parent existence และ cycle detection
- exact repository/evidence/document reference
- Truth/Work separation
- deterministic index generation
- stale generated output detection

### GUI behavior

- drill down, ancestor jump และ browser back/forward
- direct Node URL และ search result path
- Summary Inspector แสดงข้อมูลจำกัดตาม contract
- Queue และ Document แยกกัน
- Modal เปิด/ปิดโดยคง current Node และ scroll/focus ที่เหมาะสม
- keyboard, visible focus, text alternative และ reduced motion
- Diagnostic View เมื่อ index โหลดไม่ได้

### End-to-end

- source files → validation → index → local server → rendered root Node
- invalid source ไม่ทำลาย last known valid index
- pilot Node ชี้ evidence ที่ commit/path จริงและตรวจได้

## 15. ระยะส่งมอบ

### Phase 1 — Foundation

- โครง repo
- Glossary อังกฤษและไทย
- schemas และตัวอย่างข้อมูลขั้นต่ำ
- validator และ deterministic index builder
- repository registry สำหรับ Core/Editor/Backend

### Phase 2 — GUI รุ่นแรก

- local TypeScript/React app
- Focus Stack Map
- Summary Inspector
- Full Detail Modal
- search, Node URL และ Diagnostic View
- tests ตั้งแต่ source ถึงหน้าจอ

### Phase 3 — Pilot Migration

- กลั่น `CORE_ROUTE_*`
- เชื่อม evidence จริง
- พิสูจน์วงจร Work → truth → evidence → cleanup
- ปรับ schema/GUI เฉพาะสิ่งที่หลักฐานจาก pilot แสดงว่าจำเป็น

### Phase 4 — Operating System

- ออกแบบ AGENTS และ Skills รุ่นใหม่
- context package generation
- automated handoff/closure checks
- ขยาย migration ไปกลุ่มอื่น

Implementation plan ถัดไปครอบคลุมเฉพาะ Phase 1 และ Phase 2 ส่วน Phase 3 และ Phase 4 ต้องมี spec/plan แยกหลังได้รับข้อมูลจากการใช้งานจริง

## 16. สิ่งที่ไม่อยู่ในรุ่นแรก

- แก้ข้อมูลผ่าน GUI
- database
- cloud hosting หรือ network access
- user account และ permissions
- drag-and-drop graph editing
- infinite canvas
- autonomous command execution ใน product repo
- Doc API สำหรับบุคคลภายนอก
- release/package orchestration เต็มรูปแบบ

## 17. เกณฑ์ยอมรับการออกแบบ

งาน Foundation + GUI รุ่นแรกถือว่าตรงแบบเมื่อ:

1. ข้อมูล Node, Work และ Document แยกกันจริงใน source/schema/index
2. GUI อ่านเฉพาะ index ที่ผ่าน validator
3. ผังกลางแสดง ancestor/current/children และนำทางได้ตาม URL
4. แถบขวาเป็นสรุปสั้น ไม่กลายเป็นพื้นที่อ่านรายละเอียด
5. Queue และ Documents แสดงแยกกัน
6. รายละเอียดเต็มเปิดใน Modal และปิดกลับตำแหน่งเดิม
7. Truth/Work State ไม่อนุมานแทนกัน
8. broken reference ทำให้ build/check ล้มเหลวพร้อมข้อความที่แก้ได้
9. generated index สร้างซ้ำจาก input เดิมแล้วได้ byte-identical output
10. ระบบทำงาน local-only และไม่ส่งข้อมูลออกภายนอก

## 18. ทางไปสู่ฐานข้อมูลในอนาคต

หากจำนวนข้อมูลหรือรูปแบบการแก้ไขทำให้ file-first ไม่เพียงพอ สามารถเพิ่ม storage adapter ที่ส่ง read model ตาม contract เดิมให้ GUI ได้ Stable IDs, schemas และ separation ระหว่าง Node/Work/Document ทำหน้าที่เป็น migration boundary

การย้ายไปฐานข้อมูลต้องไม่เปลี่ยนความหมายของ record หรือทำให้ Git history ของเอกสารสูญหาย และต้องมีเหตุผลที่พิสูจน์ได้ เช่น concurrent editing, query scale หรือ transaction requirement ไม่ใช่เปลี่ยนเพียงเพราะฐานข้อมูลดูเป็นระบบที่ใหญ่กว่า
