# FlowDoc — แผนแยกหมวดสำหรับงานคงเหลือ

## Authority Boundary

Owner: FlowDoc Project Control. Classification: Project Control canonical planning prose.
เอกสารนี้กำหนดหมวด ขอบเขต ลำดับ และเกณฑ์จบของรอบที่จะเปิดใหม่ตามคำขอผู้ใช้
ไม่ใช่ execution packet, product Evidence, หรือการเปิด PLAN/WORK เก่ากลับมาใช้
ไม่แก้สถานะงานเก่า ไม่อนุมัติ product implementation และไม่เปลี่ยน DOCUMENT_MAP
นโยบายการทำงานปัจจุบันคือ `flowdoc-workflow-economy-policy.md`

## รอบจัดทำแผนนี้

- Work: `flowdoc-remaining-work-plan-catalog` ใต้ `flowdoc-product-development-resumption`
- Owner: `repo-project-control`; role: `planning-partner`
- Phase: `phase-flowdoc-remaining-work-plan-catalog`
- Checklist: `checklist-flowdoc-remaining-work-plan-catalog`
- Evidence target: เอกสารนี้สำหรับความครบของแผน; `npm run check` สำหรับความถูกต้องของ records/projection เท่านั้น
- Work Size: small; Risk Tier: routine; authority: implementation เฉพาะเอกสารและ records ของ catalog นี้
- Base: `6a5162aeb97f572a5daf0d0d75f81760f9ece691`; branch: `codex/remaining-work-plan-catalog`
- Worktree: `C:/Users/nekot/.codex/worktrees/remaining-work-plan-catalog/flowdoc-project-control`
- Allowed: เอกสารนี้, document/work/phase/checklist records ที่ใช้ชื่อ catalog นี้, projection ที่สร้างโดยเครื่องมือ
  และค่าคาดหวังจำนวน/รายชื่อ Work ใน `tests/project-roadmap-work-queue.test.ts` ที่จำเป็นต่อ registration
- Forbidden: product repositories, source/schema changes, unrelated test changes, old execution registries, old Work status, Evidence/map promotion
- Proof Budget: ตรวจ coverage กับงานค้างและ `npm run check` ใน worktree/main; ไม่เพิ่ม formal audit หรือ product proof
- Document Budget: catalog เดียวและ registration records; ไม่สร้างสำเนาแผนเก่า
- Model: ใช้ session ปัจจุบันสำหรับการจัดหมวดเอกสารแบบ inline; ไม่ dispatch WORK และไม่อ้างว่าตรวจ host model availability แล้ว
- Return: รายงานและลิงก์กลับใน task นี้; ไม่มี separate-room ceremony
- Stop: prerequisite หาย, authority conflict, scope escape หรือ catalog/registration/check ผ่านครบ

## ฐานที่ใช้และขอบเขตความสด

ตรวจ records ณ 2026-09-26 ก่อนเพิ่ม catalog: Work 59 รายการ; 54 รายการมีทุก Phase done
และทุก Checklist passed; Roadmap เหลือ 3 Phase/12 items; อีก 4 Work ไม่มี Phase
ตัวเลขนี้เป็น snapshot ของ records ไม่ใช่ผลตรวจ product repositories ใหม่

Core Stage 4 ผ่านที่ `a39e91fd671706d8217d58f4668ed45afa0d0e67` ตาม
`evidence-core-rust-stage4-multispan-cumulative-2026-09-21` และ Work หลักบันทึก main integration แล้ว
ใช้เป็น immutable input ไม่ทำ Stage 4 ซ้ำเพียงเพราะแผนเก่ายังเขียนว่าเป็นงานถัดไป
Stage 5/6, Enter/join, general cross-span editing และ Editor UX ยังไม่ได้รับรองโดย Evidence นี้
สถานะโฟลเดอร์ตกค้าง, PDF dependency และจำนวนเอกสาร 293 ชิ้นเป็นบันทึกเก่าที่ต้องตรวจใหม่

## วิธีเปิดแต่ละ PLAN

รหัส A1–D3 เป็นรหัสคิวใน catalog ไม่ใช่ live task IDs หรือ registry IDs
แต่ละรายการเริ่มใน PLAN ใหม่หนึ่งรอบ ใช้ execution context version 3 ใหม่เมื่อเปิด execution
ห้ามส่งงาน รอผล หรือโอน ownership ผ่านห้อง/registry เก่าที่ปิดแล้ว
ก่อนเริ่มอ่าน Current Truth Snapshot, input ที่อ้างไว้ และ AGENTS.md ของ owner
แล้ว pin base/worktree, exact allowed/forbidden paths, Phase/Checklist/Evidence target,
policy-v2 packet digest, acceptance, budgets, model decision และ return route ของรอบนั้น
PLAN default คือ Astra medium; WORK เลือกแยกจาก host availability snapshot ณ ตอนเปิด
ไม่มี product file list หรือ model availability ที่เดาล่วงหน้าใน catalog นี้
หาก discovery เปลี่ยน architecture/ownership/contract/scope ให้จบ discovery แล้วเปิด implementation รอบใหม่
Product repair หลัง dispatch ต้องกลับ WORK; หยุดเมื่อเกณฑ์ผ่าน ห้ามลด gate เพื่อให้ผ่าน

## หมวด A — สถานะและการปิดงาน

### A1 — กระทบยอด Work/Plan และกำหนดคิวปัจจุบัน

- Owner: Project Control; size small; risk routine; ทำก่อน B1
- เป้าหมาย: แยกงานจบ งานยังค้าง งานภาพรวม และงานที่ถูกแทนที่ โดยไม่แตะประวัติ execution
- ขั้นตอน: ตรวจ 54 Work ที่ผ่านครบ; ตรวจ 4 Work ไม่มี Phase; เทียบข้อความแผนกับ Evidence ล่าสุด;
  บันทึก disposition ของแต่ละรายการและ current continuation pointer เท่าที่จำเป็น
- เกณฑ์จบ: ทั้ง 59 Work มีคำอธิบายสถานะที่ตรวจย้อนกลับได้; 4 รายการไม่มี Phase มีคำตัดสิน
  retain/close/superseded/needs-discovery พร้อมเหตุผล; Stage 4 ไม่ถูกเสนอให้ทำซ้ำ;
  `npm run check` ผ่าน โดยไม่สร้างสถานะ enum ใหม่หรือแก้ registry v1/v2
- Proof/Document Budget: disposition หนึ่งชุด ใช้ records/Evidence เดิม; ไม่พิสูจน์ผลิตภัณฑ์ใหม่

### A2 — ตรวจโฟลเดอร์ตกค้างหลัง Core integration

- Owner: Project Control coordination และ Core repository; size small; risk routine; หลัง A1
- เริ่ม discovery อ่านอย่างเดียว: ตรวจเฉพาะ residual lane ที่ Work บันทึกว่า Windows ลบไม่ได้
- เกณฑ์จบ discovery: ระบุ path, registration, cleanliness, merge และ process ownership ปัจจุบัน
  แล้วตัดสิน retain หรือ eligible-for-cleanup พร้อมหลักฐาน
- หากลบได้ ให้เปิด cleanup round ที่มีขอบเขตชัดตาม coordination controls;
  ห้ามลบ dirty/unmerged/unresolved state หรือฆ่า process ที่ไม่ทราบเจ้าของ
- Budget: รายงานสั้นหนึ่งชุด; cleanup ไม่เป็น prerequisite ของ B1 ถ้าไม่มี authority conflict


#### A2 cleanup round — 2026-09-29

- Scope: inline maintenance of this catalog under Work
  `flowdoc-remaining-work-plan-catalog`, Phase
  `phase-flowdoc-remaining-work-plan-catalog`, checklist target `remaining-work-coverage`.
  Role: Lane Reconciliation Reviewer / Project Control Steward. Size small; risk routine.
- Base: `de60fed40dd43c74b8490e8ef89fd79faf109754`; isolated workspace:
  `C:/Users/nekot/.codex/worktrees/a2-cleanup/flowdoc-project-control`.
  No historical execution context is reactivated; no separate WORK room is dispatched.
- Allowed: this A2 status subsection and deletion of the five exact residual directories below.
  Forbidden: primary repository content, branches, other plans, execution registries and maps.
- Owner decision: discard old worktree material without recovery copies. These five directories
  have no `.git` marker or worktree registration. Cleanliness and merge ancestry cannot be
  reconstructed from unregistered residual files; deletion rests on explicit owner discard,
  not an assertion that their contents are clean or merged.
- Retirement candidates, relative to `C:/Users/nekot/Documents/GitHub/flowdoc-vnext-core/.worktrees/`:
  `core-creator-text-edit-geometry-v1`, `core-preview-explicit-line-breaks-20260908`,
  `fd-core-doc-superpowers-retire-0831`, `fd-core-hidden-sdd-0901`,
  `fd-core-project-docs-retire-0901`. Discard rationale: abandoned unregistered lane material,
  explicitly unwanted by the owner; no archival copy is requested.
- Inspection: 7,427 entries in the residual directories, no nested reparse points detected.
  No non-PowerShell process command line matched the Core/Backend `.worktrees` paths.
  This does not prove that no external process holds an open file handle; no process is killed.
- Retain: `C:/Users/nekot/Documents/GitHub/flowdoc-vnext-backend/.worktrees/flowdoc-vnext-core`
  is a junction targeting the actual Core main checkout, not a sixth residual checkout.
  Backend tracked dependencies resolve `../flowdoc-vnext-core`; no tracked usage of this
  junction was found. Retain the link conservatively; do not traverse or delete its target.
- Acceptance / proof budget: five candidates absent or explicitly blocked, retained junction
  classified, product main HEAD/status unchanged, and `npm run check` on worktree and main.
  Evidence target: filesystem/worktree/process observations and check outputs in this task.
  Existing product tests do not prove local directory absence. Document budget: this subsection only.
  Model: current session, inline; no new model or host-availability claim. Return: this task.
- - Status: CLOSED — 2026-09-29. The owner manually deleted all five listed residual directories.
  Fresh `Test-Path -LiteralPath` checks confirmed all five absent. Each of Project Control,
  Core, Backend and Editor had only its primary `main` worktree before this documentation follow-up.
  The Backend junction remains classified as a retained link to Core main, not residual lane content.
- Prior blocker: automatic approval review rejected the earlier deletion command with
  `blocked by policy` before execution. No tool bypass was attempted; the owner performed deletion.
- Product boundary: Core HEAD remains `2f0f1e4ba8e13625e046709ffc330ea15c270122`,
  Backend HEAD `a1745c4c030466bb326c53e93de4146bb11700ed`, and Editor HEAD
  `d1a9670a868493531423e3e92ff5e4d186c1141b`. Backend and Editor remain clean.
  Core still reports its pre-existing 101 tracked deletions; A2 does not resolve or certify that state.
- Closure follow-up: base `ac39d2ca855ae0b836d15631ce416c323176df26`, workspace
  `C:/Users/nekot/.codex/worktrees/a2-close/flowdoc-project-control`.
  Scope is this subsection and its generated projection; the original catalog Phase/checklist
  remain completed catalog-registration records, not reactivated execution. No other plan is closed.
  Required verification remains `npm run check` in the isolated workspace and on main.
  This closes residual-directory housekeeping only; no product Evidence or map is promoted.

หมวด B — Core text engine

### B1 — Stage 5: Enter/join แบบ atomic และ bounded

- Owner: Core; size medium; risk bounded; หลัง A1 ยืนยัน Stage 4 และฐานปัจจุบัน
- Input: Stage 4 Evidence และ `flowdoc-core-run-owned-property-implementation-plan-2026-09-14.md` ส่วน Stage 5
- ขั้นตอน: ตรวจ contract ของ certified seam; ถ้ายังไม่ชัดเปิด discovery-only ก่อน;
  จึงเตรียม implementation สำหรับ Enter head/middle/tail และ inverse join
- เกณฑ์จบ: same-property, Thai/Latin, Latin split เช่น off|ice, empty child และ RTL-sensitive outcomes
  เป็นไปตาม contract; children publish ทั้งคู่หรือ parent ไม่เปลี่ยน;
  SeamCertificate และ cumulative accounting ครบ; คงเพดาน source/property/provider เดิม
- หาก property-changing Enter ไม่มี bounded certificate ให้คืน not-admissible/BLOCKER;
  ไม่เพิ่ม general cross-span edit, Editor, public binding หรือ production activation
- Budget: focused semantic/atomicity tests, required owner gate และผลรับงานหนึ่งชุด;
  contract เพิ่มได้เฉพาะเมื่อ source review ชี้ ambiguity ที่ขวาง acceptance

### B2 — Stage 6: Recovery และ Gate 2 admission

- Owner: Core; size medium; risk bounded; หลัง B1 ผ่าน
- ขั้นตอน: ตรวจ no-anchor recovery, eviction, cancellation, disposal และ receipt lifecycle;
  รัน fixed 180-revision corpus พร้อม raw measurements/oracle/cumulative work
- เกณฑ์จบ: ทุก case ผ่าน semantic, bounds, latency, scaling และ lifecycle ตามเกณฑ์เดิม
  พร้อม required Core gate; fail จุดเดียวต้องคง BLOCKER และเก็บ failure evidence
- Budget: ใช้ corpus เดิมหนึ่งรอบและซ่อมเฉพาะ failure ที่เข้า scope; ห้ามเปลี่ยน thresholds/fixtures เพื่อหลบ failure
- ผลผ่านอนุญาตให้วางรอบ Gate 3/Editor ถัดไปเท่านั้น ไม่เปิด production อัตโนมัติ

## หมวด C — Editor และประสบการณ์ใช้งาน

### C1 — Gate 3/geometry boundary และ Preview keyboard contract

- Owner: Core สำหรับ geometry contract; Editor สำหรับ keyboard behavior; Project Control แยก owner lanes
- Size medium; risk bounded; หลัง B2; เริ่ม discovery-only
- ขั้นตอน: ตรวจ boundary ของ authoritative line/geometry และ input; นิยาม Enter, delete/backspace,
  selection และ undo ตาม source/owner decision; แยก Core กับ Editor implementation หากจำเป็น
- เกณฑ์จบ: contract พร้อมตัวอย่างและ acceptance ที่ไม่ขัด Core; ownership ชัด;
  keyboard behavior ผ่านการตรวจใน implementation รอบที่เปิดแยก และ `preview-keyboard-contract` ปิดได้ด้วย Evidence
- Budget: contract หนึ่งชุดเมื่อจำเป็นและ focused keyboard/geometry proof; ไม่อ้าง full WYSIWYG

### C2 — เชื่อมและตรวจ Preview ก่อน Build

- Owner: Editor; size medium; risk bounded; หลัง C1 และ Core prerequisites ผ่าน
- ขั้นตอน: ตรวจ Preview integration ตาม contract ก่อน แล้วเปิด Build validation เป็นรอบแยกถ้าขอบเขตต่างกัน
- เกณฑ์จบ: `paper-integration` มี Evidence แยก Preview/Build; authored content, input และ authoritative geometry ถูกต้อง;
  required Editor gate ผ่าน; ไม่มีการเปิด private QA API เป็น production โดยปริยาย
- Budget: ใช้ integration harness เดิมและ browser proof เฉพาะ acceptance; ไม่รวม complex flow

### C3 — ทดลอง Preview/ภาษาไทยกับผู้ใช้

- Owner: Editor; size small; risk bounded; หลัง C2 มี candidate ที่ตรวจได้
- ขั้นตอน: ทดสอบ Thai input, source preservation/read-save-freeze และ held-key visual stability
- เกณฑ์จบ: `user-thai-input`, `source-preservation`, `held-key-visual-stability` มี Evidence
  และคำยอมรับของผู้ใช้จริง; automated pass แทน user acceptance ไม่ได้
- Budget: user trial หนึ่งรอบและสรุปประเด็น; regression กลับ owner WORK ไม่แก้ใน PLAN

### C4 — Complex layout และ 30 nodes ข้ามหน้า

- Owner: Editor โดยมี Core dependency ตาม findings; size medium; risk bounded; หลัง C2
- ขั้นตอน: กำหนด fixture ของรูป/layout/30 nodes ข้ามหน้า แล้วตรวจ rendering และ editing
- เกณฑ์จบ: `complex-flow` มีผลตรวจเทียบ expected behavior; ข้อจำกัดบันทึกชัด;
  ถ้าพบ Core contract gap ให้แยก discovery/implementation แทนขยาย Editor lane
- Budget: fixture และ browser proof ที่จำเป็น; ไม่สรุปเป็น Node-count performance ทั้งระบบ

## หมวด D — Dependency และเอกสาร

### D1 — PDF dependency และยืนยันโหลดฉบับล่าสุด

- Owner: Editor; size small; risk routine; หลัง A1; ทำได้โดยไม่รอ B/C
- ขั้นตอน: ตรวจ dependency audit และ Node support ปัจจุบัน; เสนอทางเลือกให้ owner เลือกเมื่อเปลี่ยน support policy;
  ตรวจ latest-load หลัง save conflict ผ่าน host/browser ที่รองรับ
- เกณฑ์จบ: `dependency-audit` และ `latest-reload-browser` มีผลปัจจุบันที่ปิดได้
  หรือ owner ยอมรับ/defer ความเสี่ยงอย่างชัดเจน; การ defer ไม่ถูกนับว่า test passed
- Budget: audit ปัจจุบันหนึ่งครั้ง, focused repair/owner gate เมื่อมีการแก้ และ user confirmation ที่จำเป็น

### D2 — Core Documentation Family Closure

- Owner: Project Control + Core docs; size small; risk routine; หลัง A1
- ขั้นตอน: discovery inventory ของสี่ family เดิม เทียบ migration/reference/publication evidence;
  ระบุ retained value ก่อนเสนอย้ายหรือลบไฟล์
- เกณฑ์จบ discovery: disposition ครบทุก family พร้อม gap/owner;
  งานซ่อมเอกสารเปิดรอบใหม่เฉพาะ gap แล้วจึงปิด Work ด้วยผลตรวจ references และ authority
- Budget: inventory/closure decision ชุดเดียว; ไม่ rewrite เอกสารที่ใช้งานได้อยู่แล้ว

### D3 — Remaining Core Documentation Synthesis

- Owner: Project Control synthesis + Core source ownership; size small discovery แล้วแบ่ง implementation เป็น batch;
  risk routine; หลัง D2 ระบุ coverage
- ขั้นตอน: ตรวจจำนวนคงเหลือใหม่ ไม่ถือว่า 293 ยังถูกต้อง; แบ่งตาม subject และคุณค่าที่ต้องรักษา
- เกณฑ์จบ discovery: inventory ปัจจุบันและ batch ที่มี owner/scope/acceptance;
  แต่ละ batch สังเคราะห์หรือบันทึก discard rationale ก่อน retirement
- Budget: ใช้ source/migration records เดิม; ไม่มีการสั่งสังเคราะห์ทั้ง 293 ชิ้นในรอบเดียว

## ลำดับและการครอบคลุมรายการค้าง

ลำดับผลิตภัณฑ์: A1 → B1 → B2 → C1 → C2 → C3; C4 เริ่มหลัง C2
งานปิดท้าย: A2 และ D1 หลัง A1; D2 หลัง A1 แล้ว D3 หลัง D2
ทำทีละ PLAN ตามที่ผู้ใช้เลือก ไม่มีการสร้างห้องทั้งหมดหรือเริ่มงานอัตโนมัติจาก catalog

| รายการเดิม | รอบที่รับผิดชอบ |
|---|---|
| 4 blocked incremental Checklist items | A1 กระทบยอดประวัติ; B1/B2 สร้างผลใหม่ ไม่เขียนทับ failure เก่า |
| paper-integration | C2 |
| preview-keyboard-contract | C1 |
| complex-flow | C4 |
| user-thai-input / source-preservation / held-key-visual-stability | C3 |
| dependency-audit / latest-reload-browser | D1 |
| Core Documentation Family Closure | D2 |
| Remaining Core Documentation Synthesis | D3 |
| Product Development Resumption / Project Control Hardening ที่ไม่มี Phase | A1 |
| residual merged Core directory | A2 |

Deferred: general cross-span editing, leading/zero-advance-mark policy, broad WYSIWYG,
public/production binding และ release/map promotion ไม่มี execution authority ในชุดนี้
ถ้าเป็น prerequisite จริงให้ PLAN รายงาน contract/scope decision ก่อนเปิดรอบเพิ่ม
Unknown แบบ blocking: ฐาน/contract ที่ขัด acceptance ของรอบนั้น; แบบ deferred: legacy inventory และ cleanup
ที่ยังไม่ถึงคิว; accepted boundary: catalog ไม่ยืนยัน product main ปัจจุบันจากการอ่าน records เพียงอย่างเดียว

## Review และเกณฑ์จบรอบจัดทำ catalog

ตรวจแล้วว่าครอบคลุม 12 Checklist ค้าง, 4 Work ไม่มี Phase และ residual cleanup โดยไม่ทำ Stage 4 ซ้ำ
เกณฑ์จบ: แผนมี owner/dependency/scope/acceptance/budget; registration resolve ได้;
generated projection สร้างจาก canonical records และ full Project Control gate ผ่าน
ไม่เพิ่ม product test สำหรับการจัดหมวดเอกสาร และไม่สร้าง Evidence ใหม่เพื่อบรรยายแผนนี้
รอบที่แนะนำให้เปิดถัดไปคือ A1
