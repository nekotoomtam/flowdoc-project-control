# FlowDoc Export — กติกาทำงานและออกรุ่น

## Authority Boundary

Owner: FlowDoc Project Control. Created 2026-10-09; release rules confirmed and
updated by owner instruction, 2026-10-16. Other proposed working rules retain
their stated proposal scope. The existing filename is retained for incoming links.
Role: Planning Partner / Documentation Synthesizer. Scope: Core/Service export
development and delivery conventions; not a replacement workflow authority.
Governed by [Workflow economy policy](flowdoc-workflow-economy-policy.md).
This records owner-agreed version/release principles and proposed working rules; it is
not product Evidence, release approval, or a change to runtime/DB/branches/tags.
Single-room documentation work; execution/Phase/Checklist IDs N/A. Size small,
risk routine. Current documentation maintenance covers this guide, the existing
font plan, and the Core/Service README and AGENTS entrypoints; no new guide.
Proof budget: live Git refs/tag/snapshot checks, diff/link review and Project
Control check:data. No separate execution or review room is requested.

## ใช้เอกสารนี้อย่างไร

สำหรับห้องที่มารับต่องาน ให้เริ่มจาก
[จุดเริ่มอ่าน Cell Content](flowdoc-cell-content-handoff-2026-10-09.md)
เมื่องานเป็น Cell Content; เอกสารนั้นเชื่อมเป้าหมาย สถานะ ข้อตกลง และขั้นถัดไป.
สำหรับการออกรุ่น Core/Service อ่านกติกาและลำดับตรวจในไฟล์นี้ แล้วใช้แผนของงานที่จะส่งมอบ;
ไม่ต้องอ่านแผน cell เพื่อออกรุ่นอื่น. ไฟล์นี้เป็นเฉพาะ
กติกาทำงาน/ออกรุ่น ไม่ใช่บริบทส่งต่องานครบชุด

เก็บกติกาเฉพาะงาน export ไว้ที่ Project Control เพื่อให้แต่ละรอบทำงานต่อกันได้
โดยไม่ต้องตีความจากบทสนทนาใหม่ กฎ workflow/ownership/verification ใช้นโยบายหลัก
ตามเดิม ร่างนี้เพิ่มรายละเอียดเรื่องขอบเขตพาร์ต จุดออกรุ่น และการเลื่อนเข้า release
ไม่สร้างทะเบียน งาน หรือรายงานเพิ่มเพียงเพื่อทำตามพิธี

## หลักการเวอร์ชันที่เจ้าของยืนยันแล้ว

| สิ่งที่เกิดขึ้น | วิธีเก็บ |
| --- | --- |
| คุยออกแบบหรือแก้เอกสาร | commit; ไม่เพิ่มรุ่นผลิตภัณฑ์เพียงเพราะเอกสารเปลี่ยน |
| แก้โค้ดบางส่วน ยังไม่พร้อมใช้งานตามขอบเขต | commit; ยังไม่ถือเป็นรุ่นพร้อมใช้ |
| โค้ดเปลี่ยนจนได้ความสามารถหรือการปรับปรุงที่ใช้จริงและตรวจผ่าน | พิจารณาเพิ่มเวอร์ชันบนชุดพัฒนา |
| จบพาร์ต | เป็นจุดตรวจ ไม่ได้บังคับเพิ่มเวอร์ชันอัตโนมัติ |
| ผ่านครบตามขอบเขตและเกณฑ์ roadmap ที่กำหนด | พร้อมเสนอเลื่อนเข้า release ตามอำนาจอนุมัติที่มี |

การปรับภายใน เช่น เตรียมเซลล์รวมครั้งเดียว สามารถเป็นรุ่นใหม่ได้เมื่อเชื่อมกับ
ทางใช้งานจริงและมีหลักฐานว่าปรับปรุงได้โดยผลลัพธ์ยังถูกต้อง; refactor ที่ไม่มี
ผลส่งมอบชัดสามารถรวมรุ่นถัดไปได้ ไม่ฝืนเพิ่มเลขทุก commit
เลขท้ายใช้ติดตามชุดปรับปรุงที่ผ่านในช่วงพัฒนา ไม่ใช่จำนวนการแก้ไฟล์

## รูปแบบรุ่นและแพ็กเกจที่ใช้ต่อจากข้อตกลงเดิม

อ้าง [แนวทาง export releases](flowdoc-export-next-releases-draft-2026-10-08.md):
ใช้รุ่น Service เป็นชื่อชุดส่งมอบหลัก Core มีรุ่นอิสระ และ Service ตรึงแพ็กเกจ
Core พร้อม checksum/source provenance ให้ตรวจได้ว่าใช้คู่ใด
ไม่บังคับเลขสอง repo เท่ากันเมื่อมีเพียง repo เดียวเปลี่ยน; คู่รุ่นที่ส่งมอบต้องชัดเจน
เลขรุ่นซอฟต์แวร์ รุ่นโมเดลเอกสาร และเวอร์ชันแม่แบบเป็นคนละเรื่อง
การเพิ่มเลขท้ายไม่ได้รับประกัน compatibility; ถ้ามี breaking change ต้องบอกผลกระทบ
และกำหนดวิธีอ่านของเดิมก่อนส่งมอบ ไม่แอบซ่อนไว้หลังเลขรุ่น

## กติกาทำงานที่เสนอ

1. ก่อนเริ่มพาร์ต ระบุเป้าหมาย ขอบเขตที่ทำ/เลื่อน เกณฑ์ผ่าน owner และฐานที่ใช้
   ในแผนเดิมให้ครบพอทำงานได้ ไม่ต้องแตกเอกสารใหม่ทุกพาร์ต
2. แยกพาร์ตตามผลที่ตรวจได้ เช่น เตรียมโครง → วัดเนื้อหา → แบ่งหน้า/วาด
   งานภายในที่ยังใช้เดี่ยวไม่ได้ถือเป็นส่วนของชุดส่งมอบ ไม่อ้างว่าผลิตภัณฑ์พร้อมแล้ว
3. ข้อค้นพบที่เปลี่ยนสัญญาหรือขอบเขตให้กลับมาปรับแผน พร้อมบอกผลกระทบ
   เรื่องอนาคตลงส่วน deferred ไม่สอดแทรกโค้ดโดยไม่อธิบาย; ห้ามลดเกณฑ์เพื่อให้ผ่าน
4. ก่อน commit ตรวจ diff และทดสอบส่วนเปลี่ยนรวมถึง consumers ที่ได้รับผลกระทบ
   งาน layout ต้องมีผล PDF/ภาพตรวจเมื่อเกี่ยวข้อง ไม่อาศัย unit test เพียงอย่างเดียว
5. ก่อนเพิ่มรุ่น ระบุความเปลี่ยนแปลงที่ใช้ได้จริง ผลตรวจ ข้อจำกัด และคู่ dependency
   ในบันทึกเดิม; skipped/unverified ไม่เท่ากับ PASS และไม่ขยายการตรวจโดยไม่มีเหตุ
6. งานยังไม่ผ่านเก็บบนชุดพัฒนา ไม่แตะ release; เมื่อ roadmap ผ่านครบจึงตรวจ
   candidate ที่จะเลื่อนและใช้การอนุมัติของเจ้าของที่ครอบคลุม ห้ามถือว่าการรับร่างนี้
   เป็นคำสั่ง merge/push/tag ทันทีหรืออนุญาต release อัตโนมัติทุกครั้ง
7. รุ่นที่เผยแพร่แล้วไม่เขียนทับ artifact/tag เดิม เก็บต้นทางและผลตรวจให้ตามกลับได้
   หลังรับงานและ integrate ให้ cleanup เฉพาะ worktree/branch ชั่วคราวที่ clean/merged
   ตามนโยบายหลัก เก็บ development/release และสถานะที่ยังไม่จบไว้

## กฎของ branch release ที่เจ้าของยืนยัน

`release` เก็บ snapshot หนึ่ง commit ต่อรุ่นที่รับแล้ว ทุก commit ที่เข้าถึงได้จาก
branch ต้องมี annotated tag `v<version>` ของรุ่นนั้นบน GitHub ด้วย ไม่ตรวจเพียง
first-parent เพราะ merge parent สามารถพาประวัติพัฒนาที่ไม่มี tag เข้ามาได้.
รุ่นแรกมี root ของตนเอง; รุ่นถัดไปมี parent เดียวเป็น release รุ่นก่อนหน้า.
ห้าม merge หรือ fast-forward ประวัติ development เข้า `release` โดยตรง รวมถึง
merge commit ที่พาอีกสายประวัติเข้ามา. เก็บรายละเอียดงานไว้บน development branch.
Snapshot ใช้ไฟล์ครบจาก candidate ที่ตรวจแล้ว และระบุ source commit ในข้อความ commit;
ต้องตรวจว่า tree ของ candidate กับ snapshot ตรงกันทุกไฟล์.

ก่อนเริ่มต้องตรวจ default branch จาก GitHub จริง ไม่อนุมานจากชื่อ `main` หรือ
`release`. ตรวจ working tree, local/remote tips, รุ่น release ล่าสุด, tag และ
candidate ที่จะใช้ให้ตรงกัน. การเปลี่ยน package version หรือการติดตั้งทดสอบ
ไม่ถือว่าออกรุ่นแล้ว และคำอนุญาตติดตั้งไม่ข้ามขั้นเอกสาร/แพ็กเกจ/อนุมัติออกรุ่น.

## ลำดับตรวจและจุดหยุดก่อนออกรุ่น

1. **เตรียมบน development:** ระบุ source commit, ขอบเขต, คู่ Service/Core และ
   ข้อจำกัดในบันทึกเดิม. อัปเดต README/คู่มือใช้งาน คำสั่ง setup/migration และ
   วิธี deploy/ตรวจหลังติดตั้ง/กู้คืนที่ตรงกับรุ่นนั้นก่อนตรึง candidate.
   แยกขั้นตอนที่ตรวจจริงกับที่ยังไม่ได้ตรวจ; ไม่คัดลอกค่าลับลงเอกสาร.
2. **ตรวจชุดส่งมอบ:** version ใน package/lock/คู่มือและแพ็กเกจต้องสอดคล้อง;
   Service ตรึง Core tarball พร้อม checksum/source provenance. ตรวจ artifact ที่
   จะส่งจริงและ affected consumers; งาน PDF ตรวจผลทุกหน้าตามขอบเขต. ผลเดิมใช้ซ้ำ
   ได้ตาม workflow policy เท่านั้น; FAIL/skipped/unverified ต้องแสดงและไม่ใช้ปิด gate.
3. **ตรวจสิทธิ์และสร้าง snapshot:** แก้ prerequisite ที่ยังค้างหรือรับ owner decision
   ตามอำนาจก่อน; ใช้คำอนุญาตออกรุ่นที่ครอบคลุม. สร้าง snapshot จาก tree ที่ตรึงไว้
   ต่อจาก release รุ่นก่อน ตรวจ tree equality, parent เดียว และ source commit.
   การมีโค้ดพร้อมบน development ไม่อนุญาตขั้นนี้เอง.
4. **tag และส่ง:** สร้าง annotated tag ให้ snapshot รุ่นนั้น ตรวจทั้งสายว่าแต่ละ
   commit มี tag แล้วจึงส่ง branch กับ tag ที่จำเป็นพร้อมกันด้วย atomic push.
   ตรวจ remote tips/tag targets หลังส่งก่อนรายงานว่าออกรุ่นแล้ว. GitHub Release,
   การ publish package/image และการ deploy เป็นคนละขั้น ต้องมี scope/สิทธิ์ของตน.
5. **ปิดงาน:** บันทึก development source, snapshot/tag, คู่รุ่น/checksum, ผลตรวจ
   และข้อจำกัดแยกกัน. หลัง deploy ตรวจรุ่นที่รันจริงและผลใช้งานตามแผนก่อนเรียก
   ว่าติดตั้งผ่าน. หากข้อมูลเปลี่ยนกลับไปตรวจ affected areas ตามนโยบายหลัก.

หยุดก่อนแตะ `release` เมื่อคู่มือ/deploy prerequisites ยังไม่ครบ, source หรือ
รุ่นไม่ชัด, mandatory checks ยังไม่ผ่าน หรือคำอนุญาตไม่ครอบคลุม.
การแก้คู่มือครั้งนี้ไม่อนุญาตขั้น 3–4 หรือ deploy รุ่นถัดไป.

## สถานะที่ตรวจแล้วและข้อยกเว้นวันที่ 2026-10-16

| Repo | Development/default branch | release และ tag v0.3.0 |
| --- | --- | --- |
| Core | `codex/template-binding` | `57d1554` |
| Service | `codex/template-registry` | `9c433fa` |

ทั้งสอง `release` มี 8 commit/8 annotated tags ตั้งแต่ `v0.1.0` ถึง `v0.3.0`
(ไม่ใช่ทุกเลขเวอร์ชันระหว่างนั้น); ไม่มี commit ไม่มี tag ใน ancestry.
ชุดพัฒนาฟอนต์มี package version `0.4.0` อยู่บน development แต่ยังไม่มี release/tag
`v0.4.0`. การติดตั้งทดสอบก่อนหน้านี้ไม่ใช่การออกรุ่น 0.4.0 ตามกฎนี้.

เจ้าของอนุมัติเฉพาะครั้งให้จัดประวัติ `release` ใหม่และย้าย tag `v0.3.0` เพื่อ
ตัดประวัติพัฒนาที่เคยรวมผิดออก; tree ของ 0.3.0 เดิมเท่าเดิม, อีก 7 tag ไม่เปลี่ยน,
branch หลักและงานล่าสุดคงครบ. มี verified Git bundles ก่อนแก้ทั้งสอง repo.
นี่ไม่ยกเลิกกฎห้ามย้าย tag/เขียนทับ artifact สำหรับการออกรุ่นปกติ.
หลักฐาน: `step1-result.json` และ `prepared-step1.json` ใน
`C:/Users/nekot/Documents/Codex/2026-10-16/font-library-deployment/release-history-backup-25691016-182954/`.
การแก้ปัญหาลักษณะนี้ในอนาคตต้องสำรอง เสนอผลกระทบและ old/new refs แล้วรับ
คำอนุมัติเฉพาะจากเจ้าของก่อนเปลี่ยนประวัติ/tag ที่เผยแพร่; ห้ามทำอัตโนมัติ.

## ตัวอย่างสำหรับงาน cell ปัจจุบัน

เตรียมแผนผังเซลล์รวมเสร็จแต่ยังไม่ต่อกับ layout → commit ก่อน
เมื่อต่อกับ layout แล้ว ใช้งานจริงได้ ตรวจจำนวนการเตรียมและความถูกต้อง PDF ผ่าน
→ พิจารณารุ่นพัฒนาได้ แม้งาน cell ทั้ง roadmap ยังเหลือ
เมื่อ TextBlock/Image, padding, merged cells, PDF/API และ regression ผ่านครบ
ตามแผนที่ล็อกไว้ → จึงพร้อมเสนอเข้า release ไม่อาศัยเลขรุ่นอย่างเดียวตัดสิน

## สถานะและสิ่งที่ยังไม่ทำ

หลักเวอร์ชันและกฎ release ข้างต้นเป็นข้อตกลงที่เจ้าของยืนยัน; กติกาทำงานทั่วไป
ที่ยังเป็นข้อเสนอไม่ได้กลายเป็นอำนาจอัตโนมัติ. การปรับคู่มือรอบนี้ไม่เพิ่ม
automated release pipeline, ไม่เปลี่ยนชื่อ branch, ไม่ออกเวอร์ชันหรือ tag
และไม่เลื่อนงาน area/array กลับมาเป็น prerequisite ของ cell slice
