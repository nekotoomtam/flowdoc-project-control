# Preview definition correction — 2026-09-05

## Authority Boundary

Project Control canonical product decision and planning correction, owned by
repo-project-control. Work path: flowdoc-product-development-resumption >
flowdoc-frontend-expert-roadmap. Role: planning-partner with documentation
authority stewardship. Phase: phase-preview-definition-correction.
Checklist: checklist-preview-definition-correction. Evidence target:
evidence-preview-definition-correction-2026-09-05 (documentation only).
This decision does not prove any product behavior or promote a system map.

## ข้อสรุปที่ตูมยืนยัน

Preview ต้องเป็นหน้าจำลองเอกสารที่ผู้ใช้กดและแก้ข้อมูลบนเอกสารได้ แล้วเห็นผล
เปลี่ยนตามข้อมูล ไม่ใช่สร้าง PDF แล้วเอาไฟล์มาแสดง ความคล้ายกับหน้า Build
หมายถึงลักษณะเอกสารที่โต้ตอบได้ ไม่ได้หมายถึงรวมสองหน้าเป็นหน้าที่เดียวกัน

| โหมด | ผู้ใช้ทำอะไร | ข้อมูลที่เปลี่ยน |
| --- | --- | --- |
| Build | กำหนดส่วนเอกสาร ฟิลด์ รูปแบบซ้ำ Slots และกฎหน้า ผ่านส่วนที่เลือกและตัวควบคุมตามบริบท | โครงสร้างฉบับร่าง |
| Preview | กดกรอก/แก้ค่าที่อนุญาตบนเอกสารจำลอง และเพิ่มหรือลบ Entries ตามกฎ | ข้อมูลทดลอง ไม่แก้โครงสร้าง Build หรือ frozen version |
| PDF output inspection | เปิดดูไฟล์ที่ส่งออกเพื่อเช็กผลลัพธ์ | ไม่ใช่การแก้ข้อมูลใน Preview |

English terminology is canonical. Ambiguity disposition is `split`: Build,
Preview, and PDF output inspection. Draft/Published Preview identifies which
draft or frozen version supplies the simulation; it does not select PDF as the
required display technology. Form/JSON is optional supporting input, not a
replacement for direct interaction on the document.

## Required acceptance scenarios for later WORK

1. Open a supported draft or frozen version in Preview, select a permitted
   visible field (for example a customer name), edit its simulation value on
   the document, and observe the updated document without a Generate PDF step.
2. Add/remove a permitted repeated Entry through controls associated with its
   document location; observe the resulting layout. Disallowed repetition
   remains constrained by the Slot policy. Build Slots remain unchanged.
3. Return to Build or inspect the selected frozen version and verify structure,
   field definitions, and repeat policies were not mutated by Preview edits.
4. Exercise keyboard entry and Thai composition on the document, invalid
   values, stale results, and a failed update. Preserve entered simulation data
   and make the current result/failure understandable. A failed update must not
   silently revert to a PDF viewer and claim success.
5. Inspect overflow and pagination for the supported scope on the simulated
   document. Record unsupported structures explicitly instead of claiming
   broad editing support from a single fixture.

Browser evidence for these interactions is mandatory before accepting the
product capability. Package checks, generated PDF bytes, screenshots alone,
and a read-only canvas do not prove it. The implementation technology and
layout/input contracts must be selected in a later approved PLAN/WORK lane;
this document does not select DOM, Canvas overlays, or a rich-text library.

## Why earlier acceptance was insufficient

The earlier Creator UX Contract described form input beside a filled result.
The older product map/probe emphasized visible rendering and PDF lifecycle.
Those definitions omitted editing simulation values on the document. Their
historical evidence remains valid only for the behavior actually tested; it
cannot be reused as proof of the corrected Preview requirement.

The read-only review found, at Editor 0cb3970a4f3a083a0b214c5a72fab953319aafdc:
`src/app/EditorShell.tsx` connects the normal Preview to exact generation;
`src/components/preview/PublishedPreviewPdf.tsx` renders PDF pages;
`src/components/preview/LiveDraftCanvasPage.tsx` paints Core display-list pages,
with the live-draft hook used by a development QA page. These are source
observations, not fresh browser or product readiness evidence. Existing Core
layout foundations may be reusable; full integration scope is still unknown.

The separate `/structures/:definitionId/build` surface remains a minimal
structure-authoring implementation. This decision neither certifies Build as
complete nor redesigns it. R3 remains planned, R4 must use the acceptance
scenarios above, and PDF output belongs to the separate export/runtime scope.

## Continuation and limits

No new product WORK is dispatched by this definition change. Do not resume the
PDF.js/Node support-policy proposal as a prerequisite for correcting Preview.
The earlier chat asking whether confirmation was possible did not authorize
dropping Node 20. The residual PDF security finding remains unresolved; this
decision neither fixes nor dismisses it. The existing Editor dependency room
01a071eb-36b3-73b0-83e3-c1cc42e143e8 remains a retrievable paused lane, not a
Preview implementation room. Existing browser reload confirmation is separate.

Next PLAN must restore the registry, size the missing document interaction and
data-binding contract, and dispatch an approved owner lane through PLAN/WORK.
Existing WYSIWYG gates must be resolved as implementation prerequisites; they
must not redefine Preview as read-only. No product files, Node requirement,
package versions, system map, or DOCUMENT_MAP change in this round.
