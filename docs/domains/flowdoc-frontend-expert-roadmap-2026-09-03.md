# FlowDoc Frontend Expert Roadmap v1

## Roadmap ปัจจุบัน — ปรับลำดับ 5 กันยายน 2026

### นิยาม Preview ที่แก้ไขตามคำชี้แจงล่าสุด

ใช้ [Preview definition correction](flowdoc-preview-definition-correction-2026-09-05.md)
และ Creator UX Contract ที่ปรับแล้วก่อนเปิด R3/R4: Preview ต้องกดแก้ข้อมูล
ทดลองบนเอกสารจำลองได้และเห็นผลโดยไม่ต้องสร้าง PDF ก่อน ช่อง Form/JSON เป็น
ตัวช่วยได้แต่ไม่แทนการโต้ตอบบนเอกสาร Build ยังคงแก้โครงสร้าง ส่วน Preview
ไม่แก้ Build draft หรือ frozen version การสร้าง PDF และการดูไฟล์ไม่ใช่เกณฑ์
ผ่าน Preview การแก้นิยามนี้ไม่ใช่หลักฐานว่าหน้าบ้านทำได้แล้ว

ส่วนนี้เป็นลำดับงานปัจจุบัน ใช้แทนคำแนะนำลำดับงานใน v1 ด้านล่าง ซึ่งเก็บเป็นประวัติการวางแผนวันที่ 3 กันยายน โดยไม่ยกเลิกหลักฐานของงานที่ส่งมอบแล้ว

### Authority Boundary และบริบทรอบนี้

เอกสารแผนกลาง (Project Control canonical) เจ้าของ `repo-project-control` บทบาท `planning-partner` ร่วมกับ Project Control Steward
Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap`
Phase: `phase-flowdoc-frontend-roadmap-refresh-2026-09-05`
Checklist: `checklist-flowdoc-frontend-roadmap-refresh-2026-09-05`
Evidence target: `evidence-flowdoc-frontend-roadmap-refresh-2026-09-05`

การปิด Phase จัด roadmap หมายถึงจัดแผนเสร็จเท่านั้น ต่อมารอบ creator-draft รับ R0–R2 ตามหลักฐานเฉพาะส่วนด้านล่าง ส่วน R3–R7 ยังเป็นแผน ไม่เปิด WORK rooms และไม่เปลี่ยน system map / DOCUMENT_MAP หรือสถานะความพร้อมของผลิตภัณฑ์

ยึด 4 repo ปัจจุบัน: `flowdoc-project-control`, `flowdoc-vnext-core`, `flowdoc-vnext-backend`, `flowdoc-vnext-editor` ตาม owner IDs เดิม `repo-project-control`, `repo-core`, `repo-backend`, `repo-editor`
ตามคำชี้แจงของตูมวันที่ 5 กันยายน `FlowDocEditor` เลิกใช้งานแล้ว งานค้างและ branch ของ repo นั้นไม่อยู่บนเส้นทางหลักและไม่ขวางรอบปัจจุบัน ย้อนดูได้เฉพาะมีคำถามเรื่องการย้ายที่ระบุชัด การตัดออกจาก roadmap ไม่ใช่คำสั่งลบ repo หรือ worktree เก่า

### เป้าหมายและสิ่งที่ใช้ตั้งแผน

เป้าหมายคือให้ผู้สร้างทำงานต่อเนื่องได้ตาม [Creator UX Contract](flowdoc-creator-ux-contract-v0-2026-09-04.md): **คลังโครงสร้าง → Build → Preview → Versions → Published/API**

ใช้ [ผลตรวจหน้าบ้านและแก้ toolbar](editor-creator-flow-audit-2026-09-05.md) และ [การรับงาน Backend HTTP](flowdoc-backend-document-structure-http-boundary-v0-acceptance-2026-09-04.md) เป็นฐาน โดยแยกข้อสังเกตออกจากแผน:

- Toolbar แก้แล้วใน Editor `493fd8c90fdc2283e7cc2d0f18436a671a60b952`; ไม่ต้องเปิดงานซ้ำ และไม่ถือว่าปิดงาน Build ทั้งหมด
- Backend `eddf727fabef035862c91d3af9eb04b884c8ac6d` มี save/read draft, freeze/read version และ publication pointer แล้ว จึงต่อยอดสัญญาที่มีอยู่
- การตรวจ source วันที่ 5 กันยายนพบว่า Library เรียก `/documents` และ Editor ยังไม่มีตัวเชื่อม `/document-structures` ข้อมูล Document Package กับ DocumentDefinition ต้องแยก ID และ revision (ambiguity disposition: `split`) ไม่อนุมานว่าใช้แทนกันได้
- ใน Backend commit ข้างต้น `src/server.ts` ใช้ in-memory repository สำหรับโครงสร้าง แม้มี SQLite adapter อยู่แล้ว; interface และ HTTP route ยังไม่มีรายการ DocumentDefinition สำหรับ Library
- ผลตรวจเฉพาะส่วนวันที่ 5 กันยายน: Backend `documentStructureRoute.test.ts` และ `documentStructureRepository.test.ts` ผ่าน 18 tests รวม SQLite close/reopen; Editor `documentLibrary.test.ts` และ `backendIntegration.test.ts` ผ่าน 20 tests ผลนี้ไม่ใช่หลักฐานว่า UI ทำงานครบวงจรหรือเซิร์ฟเวอร์ที่ใช้งานอยู่เก็บข้อมูลถาวรแล้ว

### ลำดับงานและเกณฑ์จบ

| ช่วง | สถานะแผน / เจ้าของ | งานที่ต้องทำ | ต้องพิสูจน์ก่อนผ่าน |
| --- | --- | --- | --- |
| R0 กำหนดทางเชื่อมข้อมูล | รับขอบเขตแล้ว / Project Control | ตกลงการเชื่อม DocumentDefinition draft กับ Build ที่อ่าน Document Package; ระบุ ID, revision, fields, sections, slots และข้อมูลที่แปลงกลับไม่ได้ โดยใช้สัญญาที่มีอยู่ก่อน | มีตัวอย่าง request/response และขอบเขตการแปลงที่ตรวจร่วมกันได้; ถ้าต้องเปลี่ยน Core semantics ให้แยกงาน Core ก่อนรับงาน Editor |
| R1 คลังและการเก็บโครงสร้าง | ส่งมอบ local scope แล้ว / Backend | เพิ่มรายการโครงสร้างตาม workspace พร้อมลำดับและการแบ่งหน้า; ต่อ SQLite adapter ที่มีอยู่เข้ากับ local runner พร้อม seed master data และที่เก็บข้อมูลชัดเจน | สร้างครั้งแรกด้วย baseRevision 0 → อ่านกลับ → แก้ไข → ปิดเปิด server → รายการและค่าที่บันทึกยังอยู่; เขียนพร้อมกันสองคำขอต้องไม่ทับ revision ที่ใหม่กว่า; ทดสอบ workspace ไม่ปะปน |
| R2 สร้าง–เปิด–บันทึกจากหน้าบ้าน | ส่งมอบ draft ขั้นต่ำแล้ว / Editor | ต่อ transport โครงสร้าง, Library, การสร้างฉบับร่างขั้นต่ำ และทางเปิด Build; แสดงกำลังบันทึก/ยังไม่บันทึก/ล้มเหลว/ข้อมูลขัดแย้ง | ผู้ใช้สร้าง ตั้งชื่อ แก้ค่าที่รองรับ บันทึก กลับ Library และเปิดต่อหลัง refresh กับ server restart ได้; ทดสอบสองแท็บโดยไม่ทิ้งการแก้ไขเงียบ ๆ |
| R3 Build โครงสร้างที่แก้ได้จริง | ถัดไป / Editor; Core หรือ Backend เฉพาะสัญญาที่ขาด | จัดการ sections, fields, Structure Patterns และ Slots ผ่านสัญญาที่รับแล้ว; inspector เข้าถึงได้บนจอแคบ | เปลี่ยนโครงสร้างแล้ว save/reload ได้ครบ; unsupported action บอกเหตุผล; keyboard ใช้งานได้; Build สร้าง Slot ไม่สร้าง runtime Entries |
| R4 Preview เพื่อทดลองข้อมูล | รอ R3 / Editor; Backend และ Core ตามขอบเขต simulation | แสดงเอกสารจำลองจาก draft ให้กดแก้ค่าทดลองบนเอกสาร เพิ่ม/ลบ Entries ตาม repeat policy; Form/JSON เป็นตัวช่วย | กดแก้ค่าบนเอกสารและเห็นผลโดยไม่ต้อง Generate PDF; ไม่เปลี่ยน Build draft; ผูกผลกับ draft revision; input ผิด/ผลเก่า/ล้มเหลวมีข้อความและ retry ที่มีชื่อเข้าถึงได้ |
| R5 Versions | รอ R4 / Backend สำหรับรายการเวอร์ชัน; Editor สำหรับหน้าใช้งาน | ต่อ freeze/read ที่มีอยู่ เพิ่มรายการเวอร์ชันและหน้าเลือกตรวจ; Preview เวอร์ชันที่เลือก | frozen version ไม่เปลี่ยนตาม draft; รายการและรายละเอียดตรงกัน; Preview เวอร์ชันเก่าไม่แก้ข้อมูลต้นทาง |
| R6 Published/API | รอ R5 / Backend สำหรับ publication contract; Editor สำหรับหน้าเลือก | เลือก frozen version ให้ channel และแสดง data contract ของเวอร์ชันนั้น | publication ชี้เวอร์ชันถูกต้อง ไม่แก้ frozen version; revision conflict มีทางแก้; ทดสอบเปลี่ยนเวอร์ชันที่เผยแพร่แล้ว |
| R7 การใช้งานจริงและไฟล์ผลลัพธ์ | รอ R6 และสัญญาบริการ / แยก Backend, Core, Editor ตามเจ้าของ | วางงาน credentials, runtime submissions, jobs, renderer, PDF และ artifact storage จากหลักฐานที่มี โดยไม่สร้างซ้ำส่วนที่รับแล้ว | มีหลักฐานบริการและผลลัพธ์ครบตามขอบเขตที่จะเปิดใช้งาน ก่อนอ้าง production readiness |

R0–R2 มี Phase records `phase-creator-draft-r0/r1/r2` และ [หลักฐานส่งมอบ](flowdoc-creator-draft-first-delivery-2026-09-05.md) แล้ว เฉพาะ create/save/reopen และ local persistence; R3–R7 ยังเป็นแผน ไม่มี WORK rooms ที่เปิดจากรอบนี้

**เป้าหมายส่งมอบแรก: จบ R0–R2 ให้ครบวงจรสร้าง → บันทึก → เปิดกลับมาแก้ไขได้** ไม่รอให้ Preview, Versions หรือ PDF เสร็จก่อนจึงตรวจผลช่วงแรก

ความอ่านง่าย การใช้คีย์บอร์ด สถานะว่าง/โหลด/ผิดพลาด และจอแคบเป็นเกณฑ์รับงานทุกช่วง ไม่เลื่อนไปตรวจตอนท้ายทั้งหมด

### ขอบเขตที่ต้องรักษา

- `Published/API` ใน R6 คือเลือก frozen DocumentVersion ให้ channel; การส่งข้อมูลจริง งาน render และ PDF อยู่ R7 จึงไม่ใช้บริการ R7 เป็นเหตุปิดกั้น publication pointer ที่มีสัญญาอยู่แล้ว
- WYSIWYG แบบกว้างยังไม่อยู่ใน roadmap รอบแรก ใช้ Build แบบควบคุมโครงสร้างตาม Creator UX Contract
- R0 เลือก DocumentDefinition draft เป็นต้นทางของ Build ขั้นต่ำโดยตรง; การแปลงเป็น Core Package และ renderer ยังไม่ส่งมอบ ไม่อนุมัติ adapter ที่ทำข้อมูลหาย
- R1–R2 พิสูจน์ local runner restart, Library และ browser flow แล้วตามหลักฐานรอบ creator-draft; Core checkout มีไฟล์ tracked หาย 59 ไฟล์ จึงใช้ dependency snapshot ระบุ commit ในการตรวจ Editor ต้อง reconcile ก่อนอ้าง clean install พร้อมใช้
- งานตรวจ lane เก่าและการเก็บกวาด worktree เป็น maintenance แยก ไม่ใช่ dependency เว้นแต่พบหลักฐานว่าแตะไฟล์หรือฐานเดียวกับงานที่กำลังเริ่ม

### วิธีนำ roadmap ไปเริ่มงาน

เริ่มจาก R0 โดยอ้าง Work นี้กับ Creator UX Contract และ Backend HTTP acceptance เดิม ก่อนเปิดงาน product ให้ลงทะเบียน Work/Phase/Checklist/Evidence ของเจ้าของแต่ละงาน พร้อมขอบเขตที่อนุมัติจริง; ไม่ใช้รายการ R0–R7 เป็น Kickoff Packet โดยตรง

เมื่อ dispatch ต้องทำตาม Delivery Operating Model, PLAN Room Orchestration Rules และ Work Type Routing Model: หนึ่ง WORK room ต่อหนึ่ง lane ที่อนุมัติ มี registry และ task locator จริง มี automatic Return Channel ส่งกลับ PLAN, ตรวจ liveness และผ่าน acceptanceGate ก่อนรับผล ถ้าต้องซ่อม product output ให้ส่งกลับห้องเดิมตามกติกา ไม่ให้ PLAN ขยายงานแก้เอง

ทุกงานที่จะ merge ต้องผ่าน gate ใน worktree และ main ของ repo เจ้าของก่อนปิดงาน; Project Control บันทึกหลักฐานและสถานะเฉพาะส่วนที่พิสูจน์แล้ว แผนนี้ไม่เปิดห้องและไม่สั่งเริ่ม R1–R7 อัตโนมัติ

---

## ประวัติ roadmap v1 — 3 กันยายน 2026

เนื้อหาต่อจากนี้เก็บเพื่ออ้างอิงทิศทางเดิมเท่านั้น ลำดับเริ่มงานและนิยามการเผยแพร่ใช้ส่วน Roadmap ปัจจุบันด้านบนร่วมกับ Creator UX Contract วันที่ 4 กันยายน

## Authority Boundary

Owner repository: `repo-project-control`.

Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap`.

This document is the Project Control planning and UX design exploration record for the next FlowDoc frontend direction. It coordinates product-facing frontend lanes before implementation starts.

The design artifact is not product truth. It does not prove frontend readiness, WYSIWYG readiness, publish readiness, production readiness, Core runtime behavior, Backend service behavior, Editor behavior, or map truth.

No product repository files change in this roadmap phase. Core, Backend, and Editor remain product implementation owners for later approved lanes.

## Work Context

Active role: `planning-partner`.

Current Phase: `phase-flowdoc-frontend-expert-roadmap-v1`.

Checklist target: `checklist-flowdoc-frontend-expert-roadmap-v1`.

Evidence target: `evidence-flowdoc-frontend-expert-roadmap-2026-09-03`.

Work Type: `planning-coordination` plus `ux-design-exploration`.

Known risks:

- A roadmap or mockup may be mistaken for frontend readiness or product truth.
- The frontend scope may expand into product implementation before lane approval.
- The WYSIWYG gate may be bypassed by adding broad direct editing before prerequisites are accepted.
- Preview and Publish wording may imply live integration that remains unknown or unavailable.

Unknown state:

- Broad Editor runtime and UI behavior remain `unknown` until a product-owned inspection or implementation lane proves them.
- End-to-end Editor to Backend to Core readiness remains unpromoted outside accepted evidence.
- Production remains NO-GO until a later evidence-backed decision changes that state.

## North Star

FlowDoc should feel like an expert document production workspace, not a scattered demo shell. A user should be able to enter the product, understand the state of their documents, shape a document with visible structure, preview trustworthy output, and move toward publish with clear status and recoverable failures.

The first product-facing rhythm is Library, Design, Preview, and Publish:

- Library shows what exists, what is draft-only, what is blocked, and what can safely be opened next.
- Design is the authoring surface where document structure, editable regions, style controls, and page context are visible without overwhelming the user.
- Preview confidence tells the user whether they are seeing a draft preview, a stale preview, a published preview, or an unavailable state.
- Publish flow binding connects a reviewed document to submission, queued work, result state, retry, and evidence.

## Roadmap Principles

- Workflow-first: design around repeated work, not a landing page or promotional screen.
- Honest state: every surface must distinguish current, planned, risk, blocked, unavailable, and unknown state.
- Progressive authoring: start with bounded edit regions and structural controls before broad rich text behavior.
- Evidence-bearing UI: actions that claim compatibility, preview, publish, or production state need backing checks and records.
- No WYSIWYG shortcut: direct page editing stays behind the WYSIWYG gate decision until prerequisites are explicit.
- Product ownership stays clear: Project Control coordinates; Editor, Backend, and Core implement only through approved lanes.
- Accessibility and polish are acceptance requirements, not decoration.

## Current Frontend Gaps

Library needs a stronger product entry surface. It should show local documents, draft state, available actions, unavailable actions, and recovery paths without implying cloud or production readiness.

Design authoring surface is the largest missing product experience. The expected workspace needs a clear page canvas, outline or structure navigation, selected-region context, inspector controls, toolbar commands, disabled-state language, and responsive behavior.

Preview confidence is not yet a trusted workflow. Users need clear Draft Preview versus Published Preview state, stale-state warnings, generation status, diagnostics, and download or retry paths.

Publish flow binding is unavailable as a complete product path. It needs a visible review step, submission boundary, queued status, result state, error recovery, and Backend/Core readiness gates before any publish-ready claim.

WYSIWYG gate decision remains closed. The next accepted direction should prefer managed editable cards or bounded text islands before full direct DOM editing or a broad rich editor package.

## Roadmap Phases

### Phase 1: Frontend Product Map

Lane ID: `lane-frontend-product-map`.

Owner for this phase: `repo-project-control`.

Goal: create a lane-ready product map for Library, Design, Preview, and Publish, with each surface marked as current, planned, risk, blocked, unavailable, or unknown.

Expected output:

- Screen inventory for Library, Design, Preview, Publish, document detail, and error or empty states.
- Action inventory for open, edit, save, preview, publish, retry, export, and inspect status.
- Truth boundary for every visible readiness claim.
- Next implementation lane cards.

Acceptance:

- No product repository edits.
- No map truth promotion.
- The map can become the kickoff context for the first Editor implementation lane.

### Phase 2: Design Workspace Usability

Lane ID: `lane-design-workspace-usability`.

Likely implementation owner after approval: `repo-editor`.

Goal: make the Design surface feel like a real document workspace with clear structure, focus, and editing confidence.

Expected output:

- Workspace frame with stable navigation, page canvas, outline, inspector, toolbar, and status strip.
- Selected node or region state that explains what can be edited.
- Empty, loading, unavailable, conflict, and error states.
- Responsive layout for narrow desktop and mobile inspection.

Acceptance:

- The first viewport shows the product workspace, not a marketing hero.
- Controls use familiar icon or native control patterns where possible.
- Disabled actions explain state without pretending the feature exists.

### Phase 3: Progressive Authoring

Lane ID: `lane-progressive-authoring`.

Likely implementation owner after approval: `repo-editor`, with `repo-core` evidence dependencies.

Goal: add useful authoring in bounded regions before broad WYSIWYG editing.

Expected output:

- Text-region editing model for safe document changes.
- Structural controls for section, column, table, and media placeholders only where supported.
- Save and dirty-state handling.
- Compatibility boundary with Core document model and generation contracts.

Acceptance:

- Editing behavior is scoped to supported structures.
- Unsupported rich behavior is blocked or clearly unavailable.
- Tests prove that hidden direct-DOM editing does not bypass the WYSIWYG gate.

### Phase 4: Preview Confidence

Lane ID: `lane-preview-confidence`.

Likely implementation owner after approval: `repo-editor`, with `repo-backend` and `repo-core` evidence dependencies.

Goal: let the user trust what preview state means.

Expected output:

- Draft Preview and Published Preview labels.
- Fresh, stale, queued, failed, unavailable, and blocked preview states.
- Diagnostics panel for input, backend response, artifact pointer, and retry result.
- Download or inspect affordance only when supported evidence exists.

Acceptance:

- Preview cannot imply production or publish readiness without accepted evidence.
- Failed and unavailable states are visible, recoverable, and testable.
- Preview state is tied to source document and generation lifecycle.

### Phase 5: Publish Flow Binding

Lane ID: `lane-publish-flow-binding`.

Likely implementation owner after approval: `repo-editor`, with `repo-backend` and `repo-core` evidence dependencies.

Goal: connect the user-facing publish flow to the real submission and job lifecycle once Backend and Core gates support it.

Expected output:

- Review step before publish.
- Submit boundary with explicit prerequisites.
- Queued, running, succeeded, failed, cancelled, and retry states.
- Result inspection and artifact access paths.

Acceptance:

- Publish actions stay unavailable until service credentials, persistence, and generation contracts are proven.
- No product copy claims that production is live before Project Control evidence supports it.
- Errors include next actions without hiding backend or runtime uncertainty.

### Phase 6: Frontend Polish And Accessibility

Lane ID: `lane-frontend-polish-and-accessibility`.

Likely implementation owner after approval: `repo-editor`.

Goal: turn the main workflows into a repeatable, readable, accessible product surface.

Expected output:

- Keyboard navigation and focus visibility.
- Color contrast and reduced-motion checks.
- Dense but readable operational layout.
- Loading, long-document, small-screen, and high-density document checks.
- Visual QA across desktop and mobile breakpoints.

Acceptance:

- No text overlap or unstable resizing in common viewports.
- Icons, controls, cards, and panels follow the product UI conventions.
- Accessibility defects are recorded as blockers or risks, not taste notes.

### Phase 7: WYSIWYG Gate Decision

Lane ID: `lane-wysiwyg-gate-decision`.

Owner for decision: `repo-project-control`, with later implementation owned by `repo-editor` only if accepted.

Goal: decide whether FlowDoc should progress from bounded authoring to direct page editing, and under which constraints.

Expected output:

- Accepted WYSIWYG definition.
- Prerequisite checklist for data model, selection, measurement, save, undo, preview, and compatibility.
- Decision between managed editable cards, bounded text islands, or broader editor integration.
- Explicit blocks for unsupported contenteditable shortcuts or rich editor package adoption.

Acceptance:

- The gate names what is allowed, blocked, and unknown.
- The gate does not authorize implementation until Project Control records the decision and product owners accept the lane.

## Recommended First Sequence

Start with `lane-frontend-product-map`. It is a Project Control lane, can be lean, and should not edit product repositories. Its job is to convert this roadmap into screen-level lane cards and acceptance targets that a later Editor WORK room can execute without inventing scope.

Then run `lane-design-workspace-usability` as the first Editor implementation lane after approval. It should use the product map as kickoff context, keep changes bounded to the Editor frontend, and return evidence candidates to PLAN before any truth promotion.

Keep Preview and Publish behind explicit evidence gates. They depend on Backend and Core state and should not be sold in the UI as ready while integration remains unknown.

Use `lane-wysiwyg-gate-decision` before any direct page editing expansion.

## Lane Card Starters

| Lane ID | Work Type | Owner | First deliverable | Must not do |
| --- | --- | --- | --- | --- |
| `lane-frontend-product-map` | `planning-coordination` plus `ux-design-exploration` | `repo-project-control` | Screen and action map for Library, Design, Preview, Publish | Edit product repositories |
| `lane-design-workspace-usability` | `product-implementation` plus `ux-design-exploration` | `repo-editor` | Workspace shell and authoring affordance implementation | Claim broad WYSIWYG readiness |
| `lane-progressive-authoring` | `product-implementation` | `repo-editor` | Bounded edit-region behavior | Add unsupported rich editing |
| `lane-preview-confidence` | `product-implementation` plus `verification` | `repo-editor`, `repo-backend`, `repo-core` | Draft and Published Preview lifecycle states | Imply publish or production readiness |
| `lane-publish-flow-binding` | `product-implementation` plus `cross-repo-compatibility` | `repo-editor`, `repo-backend`, `repo-core` | Review, submit, job, result, retry path | Enable publish without service evidence |
| `lane-frontend-polish-and-accessibility` | `product-implementation` plus `verification` | `repo-editor` | Visual QA, accessibility, responsive workflow checks | Treat visual taste as evidence |
| `lane-wysiwyg-gate-decision` | `decision` plus `planning-coordination` | `repo-project-control` | Accepted WYSIWYG direction and prerequisites | Start broad direct editing before acceptance |

## Stop Conditions

- A lane cannot identify owner repository, active role, Work Type, Checklist target, Evidence target, risks, and unknown state.
- A proposed product lane would change Core, Backend, or Editor outside its approved lane boundary.
- A frontend surface would claim current readiness, publish readiness, production readiness, or WYSIWYG readiness without accepted evidence.
- A WORK room cannot return automatically to PLAN with PASS, FAIL, BLOCKER, RISK, or UNKNOWN.
- The user would need to copy/paste handoffs or personally carry Project Control truth-promotion work.

## Intentionally Not Changed

- No product repository files change in this roadmap phase.
- No WORK rooms are opened by this roadmap phase.
- No FlowDoc map truth changes.
- No frontend readiness, WYSIWYG readiness, publish readiness, production readiness, or compatibility readiness is promoted.
- No Core, Backend, or Editor behavior is implemented.
- No production path is activated.

## Next Recommended Work

Open `lane-frontend-product-map` as the next Project Control lane. Its deliverable should be a screen-by-screen product map and kickoff packet for the first bounded Editor implementation lane.
