# FlowDoc Export — ร่างกติกาทำงานและออกรุ่น

## Authority Boundary

Owner: FlowDoc Project Control. Status: DRAFT for owner review, 2026-10-09.
Role: Planning Partner / Documentation Synthesizer. Scope: Core/Service export
development and delivery conventions; not a replacement workflow authority.
Governed by [Workflow economy policy](flowdoc-workflow-economy-policy.md).
This records owner-agreed version principles and proposed working rules; it is
not product Evidence, release approval, or a change to runtime/DB/branches/tags.
Single-room documentation work; execution/Phase/Checklist IDs N/A. Size small,
risk routine. Document budget: this draft and a link in the existing cell plan.
Proof budget: consistency with current export conventions, diff/link review and
Project Control check:data. No separate execution or review room is requested.

## ใช้เอกสารนี้อย่างไร

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

## ตัวอย่างสำหรับงาน cell ปัจจุบัน

เตรียมแผนผังเซลล์รวมเสร็จแต่ยังไม่ต่อกับ layout → commit ก่อน
เมื่อต่อกับ layout แล้ว ใช้งานจริงได้ ตรวจจำนวนการเตรียมและความถูกต้อง PDF ผ่าน
→ พิจารณารุ่นพัฒนาได้ แม้งาน cell ทั้ง roadmap ยังเหลือ
เมื่อ TextBlock/Image, padding, merged cells, PDF/API และ regression ผ่านครบ
ตามแผนที่ล็อกไว้ → จึงพร้อมเสนอเข้า release ไม่อาศัยเลขรุ่นอย่างเดียวตัดสิน

## สถานะและสิ่งที่ยังไม่ทำ

ร่างนี้บันทึกหลักที่ตกลงไว้และเสนอวิธีใช้ ยังรอ owner review ของกติกาทำงาน
ไม่เพิ่ม automated release pipeline, ไม่เปลี่ยนชื่อ branch, ไม่ออกเวอร์ชันหรือ tag
และไม่เลื่อนงาน area/array กลับมาเป็น prerequisite ของ cell slice
