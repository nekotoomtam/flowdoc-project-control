# FlowDoc — จุดเริ่มอ่านสำหรับห้องที่รับต่องาน Cell Content

## Authority Boundary

Owner: Project Control. Role: Documentation Synthesizer. Status: context handoff,
2026-10-09. This is a bounded entrypoint to existing decisions and plans, not a
replacement specification, runtime Evidence, execution packet or release authority.
Follow Project Control AGENTS.md and its current workflow economy policy first.
Inline documentation maintenance; execution/Phase/Checklist IDs N/A. Risk routine.
Document budget: this entrypoint and a pointer in the existing rules draft.
Proof: referenced-file existence, consistency with current conversation/plan,
diff review and check:data. No new room, runtime change or execution is dispatched.

## งานนี้ทำไปเพื่ออะไร

FlowDoc ให้ผู้เรียกจัดข้อมูลและลำดับรายการ แล้วระบบสร้างเอกสารจากแม่แบบที่เตรียมไว้
ผู้เรียก API ไม่ต้องจัด node, childIds, padding หรือจุดแบ่งหน้าเอง
ชุดปัจจุบันเน้น backend/Core export PDF ยังไม่สร้าง frontend หรือ DOCX

## อ่านอะไรและเริ่มตรงไหน

1. อ่าน Project Control `AGENTS.md` แล้วตรวจสถานะ canonical และ checkout ปัจจุบัน
   ก่อนเริ่มจริง ห้ามถือว่าบันทึกวันที่นี้เป็นสถานะล่าสุดโดยไม่ตรวจ
2. อ่าน [ร่างโครงสร้างหกพาร์ต](flowdoc-export-node-structure-draft-2026-10-09.md)
   เพื่อรู้เหตุผล ขอบเขตที่ตกลง และหัวข้อที่เลื่อนไว้
3. อ่าน [แผน Cell Content](flowdoc-cell-content-plan-2026-10-09.md)
   เพื่อดู task, files, acceptance, proof budget และข้อเสนอที่ยังต้องสรุป
4. อ่าน [ร่างกติกาทำงาน/ออกรุ่น](flowdoc-export-working-release-rules-draft-2026-10-09.md)
   โดยแยกหลักที่เจ้าของยืนยันจากกติกาทำงานที่ยังเป็นร่าง
5. ก่อนแก้ Core/Service อ่าน AGENTS ของ repo เจ้าของ ไม่เริ่มจากห้อง/ทะเบียนเก่า

## สถานะล่าสุด — release 0.1.8 แล้วเมื่อ 2026-10-10

งานถัดไปที่เจ้าของเลือก: ระบบหน้ากระดาษและส่วนของเล่ม แยกรูปแบบหน้า,
ส่วนของเล่ม และหน้าที่จัดออกมาจริง เจ้าของให้ร่างก่อนกาง roadmap ตาม
[ร่างระบบหน้ากระดาษ](flowdoc-page-system-draft-2026-10-10.md)
สถานะเป็นงานออกแบบ ยังไม่มี implementation หรือเปลี่ยน release เพิ่ม

เจ้าของอนุญาตขึ้น release หลังรับคู่มือแล้วในห้องนี้ ทำแบบ local snapshot
ทั้งสอง repo โดยไม่เปลี่ยน runtime หรือเพิ่มเลขรุ่นใหม่ และไม่มี push/deploy

| Repository | Development source | Release snapshot | Annotated tag |
| --- | --- | --- | --- |
| Core | e8fa7361e0b52d74b110662a0cb1db4379f3f0f5 | 7b5161c7ff684aee479a66fdf6170e1e73aa2f9e | v0.1.8 |
| Service | 5bf0620b094d0d7145f409bea6a90bc1713c6fb9 | 78c94914cba42179e296c23e0e1cb113df70d543 | v0.1.8 |

แต่ละ snapshot มี parent เป็น release0.1.5 ของ repo นั้น และ tree ตรงกับ
development source ทุกไฟล์ เก็บที่มาและหลักฐานใน commit message
Service ยังคงตรึง Core0.1.8 จาก runtime source `97a0985` SHA256
`48241590350d22ddac983f8b5296bd5559646b76a4803510874dddde60d90a0d`
ใช้ tarball เดิมที่ผ่านแล้ว ไม่ pack ทับรุ่นเดิม; คู่มือใหม่อยู่ใน source repositories
จึงไม่อ้างว่าคู่มือที่เพิ่งเพิ่มถูกบรรจุลง tarball เดิมด้วย

งานนี้เป็น inline release integration ตามคำขอเจ้าของ ไม่มี execution IDs
ขอบเขตคือ refs/tags ของสอง repo และบันทึกนี้ ไม่แก้ product tree
ตรวจ runtime/dependencies เทียบ source ที่ผ่านแล้วพบเปลี่ยนเฉพาะ Markdown
จึง reuse ผล Core packaged consumer ทั้ง12กลุ่ม PASS และ Service51checks
0failed/0skipped ร่วมกับ walkthrough Docker/API สดของคู่มือที่ผ่านในวันเดียวกัน
ตรวจ vendor checksum, clean checkout, parent, annotated tags และ exact tree equality
สำหรับ candidate/release โดยไม่รัน runtime regression ซ้ำเมื่อไม่มี runtime change
คง branch พัฒนาและ release; รอบนี้ไม่ได้สร้าง worktree/branch ทดลองให้ต้องลบ
งานหลังจากนี้ให้เลือกจากขอบเขตหลัง release ที่เจ้าของเก็บไว้ ไม่เริ่มเองจากบันทึกนี้

## ผลก่อน release — Area 0.1.8 ผ่านแล้ว

เจ้าของรับ PDF Area 5 หน้าแล้ว ตาม [แผน Area](flowdoc-area-plan-2026-10-09.md)
Core `97a0985` รวมเข้า codex/template-binding; Service `0419718` รวมเข้า
codex/template-registry ทั้งสองเป็น0.1.8 ส่วน release ยังคง0.1.5
Core317 tests และ packed Linux consumer ผ่าน; Service51 real-DB/API tests ผ่าน
ไม่มี skip ผู้ตรวจพบ2จุดสำคัญ แก้แล้วพร้อม RED/GREEN: diagnostic ของรายการ
ผิดประเภท และการตรวจ prepared input เทียบคำขอต้นฉบับก่อนเริ่มประมวลผล
PDF หลังเพิ่มเวอร์ชันเหมือนชุดที่เจ้าของรับทุกไบต์ ดูหลักฐานและการเก็บกวาด
ใน Development closeout ของแผน Area ไม่เริ่ม implementation ชุดนี้ซ้ำ
พาร์ต6 compatibility และการปรับสถานะเอกสารปิดแล้วเมื่อ2026-10-10 ใน
[ร่างโครงสร้าง พาร์ต6](flowdoc-export-node-structure-draft-2026-10-09.md#พาร์ต-6--การใช้กับของเดิมและขอบเขตส่งมอบ-018)
เจ้าของให้ทำคู่มือก่อน release เมื่อ2026-10-10 ผลอยู่หัวข้อคู่มือด้านล่าง
จากนั้นเจ้าของอนุญาต release0.1.8 แล้ว ผลอยู่หัวข้อสถานะล่าสุดด้านบน
ยังไม่รวม area ซ้อน, โครงย่อยกลางใช้ร่วมหลาย area, Columns ใน cell หรือ DOCX
เจ้าของเพิ่มงานหลัง release เมื่อ2026-10-10: ระบบหน้ากระดาษเต็มรูปแบบ หน้าปก
หน้าเฉพาะและการเว้นหน้า เก็บในหัวข้อเรื่องที่เลื่อนไว้ของร่างโครงสร้างแล้ว
ต้องออกแบบกติกาอีกครั้งก่อนลงมือ ไม่ดึงกลับมาเป็นเงื่อนไขปล่อยชุดปัจจุบัน

## คู่มือก่อน release — 2026-10-10

งาน inline ขนาดเล็ก/routine ตามคำขอเจ้าของ; execution IDs ไม่ applicable
เจ้าของคู่มือการใช้งานคือ Core/Service ส่วนบันทึกสถานะนี้เป็น Project Control
ขอบเขตแก้เฉพาะ Markdown ไม่เปลี่ยน runtime, package version, DB contract หรือ release
เอกสารใหม่สองไฟล์เพื่อป้องกันผู้ใช้ทำตาม README เก่าที่อธิบายความสามารถไม่ครบ:

- Core `docs/template-guide.md`: แม่แบบ/model, ตัวแปรและ scope, ตาราง/ภาพ,
  array/cellRepeats, area, ลิงก์/สารบัญ และข้อจำกัด พร้อม fixture ที่เปิดใช้ได้
- Service `docs/usage.md`: Docker local, PDF แรก, draft/save/publish,
  API contract, upload/Area request, status/warnings และอายุข้อมูล
- README ของแต่ละ repo ชี้เข้าคู่มือและแก้ข้อความที่ล้าสมัยตามโค้ด0.1.8

เกณฑ์รับคือเส้นทางเริ่มใช้งานทำตามได้ ตัวอย่างตรง contract ลิงก์มีปลายทาง
และไม่อ้างความสามารถที่ยังไม่ได้ทำ ใช้ proof เดิมของ runtime เป็นบริบท
ไม่รัน regression ทั้งหมดซ้ำเพื่อแก้ Markdown
ทดสอบสดบน Docker29.8.2 ใน project/volumes `flowdoc-manual-20261010` แยกจากข้อมูลเดิม:
fresh migrations001–009, SRS import/publish v1, draft read/save/publish v2,
contract, PDF download แล้วได้410เมื่อเรียกซ้ำ, upload JPEG/finalize,
Area notice+image PDF, warning เมื่อ format ย่อยไม่รู้จักโดยส่วนที่เหลือยังสำเร็จ,
และ duplicate JSON key400 ผ่าน ภาพ fixture ขนาดเล็กได้ IMAGE_LOW_RESOLUTION
ตามจริง ไม่ตีว่าไร้ warning หรือใช้แทนการรับคุณภาพภาพทุกขนาด
ตรวจลิงก์15รายการ, JSON snippets10ชุด, fixtures5ชุด และ bind/compose
request ตัวอย่างในคู่มือผ่าน หลักฐาน local อยู่ Service
`artifacts/manual-20261010/result.json`, `first.pdf`, `area.pdf` และ job/receipt JSON
ไฟล์ compose.env ในบริเวณเดียวกันมีรหัสผ่านทดลอง ห้ามแนบไปกับคู่มือ
การทดลองนี้ไม่ใช่การทดสอบเครื่องสะอาดใหม่/production load หรือการอนุมัติ release
ไม่เพิ่มรุ่นเพราะไม่มีการเปลี่ยนโค้ด ขั้นถัดไปยังเป็นพิจารณาชุด release
คู่มือ commit Core `e8fa736` และ Service `5bf0620`; Markdown diff checks และ
Project Control `check:data` ผ่าน เก็บ PDF/รายงานไว้แล้ว และลบเฉพาะ containers,
networks และ volumes ของ project ทดลองข้างต้นเรียบร้อย ไม่แตะชุดใช้งานอื่น

## ผลก่อนหน้า — array ในเซลล์ 0.1.7

เจ้าของรับ PDF ตัวอย่าง5หน้าแล้ว และ independent review ผ่าน ไม่มี findings
ตาม [แผน Array-driven cell content](flowdoc-cell-array-plan-2026-10-09.md)
Core `2037655` รวมเข้า codex/template-binding; Service `b908b37` รวมเข้า
codex/template-registry ทั้งสองเป็น0.1.7 ส่วน release ยังคง0.1.5
Core287 tests และ packed Linux consumer ผ่าน; Service35 real-DB/API tests ผ่าน
ไม่มี skip PDF หลังเพิ่มเวอร์ชันเหมือนชุดที่เจ้าของรับทุกไบต์
หลักฐานอยู่ artifacts/worktree-archive/flowdoc-core-cell-array และ
artifacts/worktree-archive/flowdoc-service-cell-array ใน repo หลักแต่ละตัว
ตรวจ checksum แล้ว ลบเฉพาะ worktree/branch ชั่วคราวที่ clean และ merged แล้ว
ดู Development closeout ในแผนสำหรับรายละเอียด ไม่เริ่มงานชุดนี้ซ้ำ
ในรอบ0.1.7 ยังไม่เริ่ม area; ผล Area รอบถัดไปอยู่ด้านบน

## ขอบเขต Area ที่นำไปทำแล้ว

เจ้าของยืนยัน area เป็นตัวแปร วางได้หนึ่งจุดต่อตัว รองรับหลายรูปแบบโครงย่อย
และหลายรายการได้ รอบแรกโครงย่อยเป็นลูกของ area เดียว; ไม่มีตัวแปรก็ได้
หากเป็นเนื้อหาตายตัว การลบฉบับแก้ไขไม่กระทบเวอร์ชันที่ล็อกแล้ว
นิยามและข้อจำกัดอยู่พาร์ต 5 หัวข้อกฎที่ตกลงแล้วในร่างโครงสร้างหกพาร์ต
เจ้าของขอเก็บแนวคิดโครงย่อยกลางใช้ร่วมหลาย area ไว้ทำภายหลังโดยชัดเจน
อย่าสับสนหนึ่งจุดวางกับหนึ่งรูปแบบ และอย่าเริ่มระบบแชร์ในรอบนี้
สเปกที่เจ้าของรับอยู่ใน [Area design](flowdoc-area-design-2026-10-09.md)
ผล implementation และข้อจำกัดอยู่ใน [แผนลงมือ Area](flowdoc-area-plan-2026-10-09.md)
ใช้วิธีทำในห้องนี้ ยังไม่ลงโค้ดหรือเปลี่ยนเวอร์ชัน

## บริบทชุดก่อนหน้า — 0.1.6

- Cell Content ผ่านและรวมเข้าฝั่งพัฒนา Core/Service 0.1.6 แล้ว เจ้าของรับ PDF ตัวอย่าง
  ดู commit และ archive หลักฐานในหัวข้อ Development closeout ของแผน Cell Content
- Core tests 250/250, build และ packed Linux consumer ผ่าน; Service real-DB/API
  checks 16/16 ผ่าน ไม่มี skip; PDF 15 หน้าเหมือนชุดที่เจ้าของตรวจทุกไบต์
- worktree/branch ชั่วคราวของชุดนี้เก็บกวาดแล้ว หลักฐานย้ายไป artifacts/worktree-archive
  ของ repo หลักพร้อมตรวจ SHA256; release คง 0.1.5 ไม่มี push หรือ tag ใหม่
- พาร์ต 1–2 คุยหน้าที่ node, childIds และ identity แล้ว; พาร์ต 3–4 คุยขนาด
  padding และการแบ่งหน้า รวมการเตรียมความสัมพันธ์เซลล์รวมครั้งเดียวต่อ layout pass
- แผนมี Task 1–4 สำหรับ implementation ซึ่งคนละชุดเลขกับพาร์ตออกแบบ 1–6
- เจ้าของยืนยัน padding รายด้านเป็น Length หน่วย pt/mm แล้ว: ไม่ระบุใช้ 4pt
  เฉพาะด้านที่ขาด ค่า 0 ต้องรักษาไว้ รายละเอียดและเกณฑ์ตรวจอยู่ในแผน Cell Content
- ชุด direct-cell จบแล้ว ขั้นถัดไปคือเลือกพาร์ตออกแบบที่ยังเหลือตามคำขอเจ้าของ
  ไม่ทำ implementation ซ้ำ ไม่ดึง area มารวมเอง และไม่ตีว่า roadmap ทั้งหมดเสร็จ

## ประเด็นสำคัญที่ห้องใหม่ต้องไม่ตีความคลาด

- Cell รับ TextBlock/Image หลายชิ้นเรียงแนวตั้งตาม childIds; childIds เป็น ID
  ของ node ไม่ใช่ชื่อตัวแปร แต่ละภาพเป็น node แยก แม้ใช้ resource ภาพเดียวกันได้
- ยังไม่เพิ่ม Columns, ตารางซ้อน หรือ container; image item binding เพิ่มแล้ว
  ใน model10/0.1.7 และ area ชั้นเดียวเพิ่มใน model11/0.1.8 คงเซลล์รวมเดิม
- Padding ให้ผู้สร้างตั้งในแม่แบบ ค่า 0 ต้องไม่ถูกแทนด้วย default; ไม่ระบุจึงใช้
  ค่าเริ่มต้น 4pt ต่อด้าน ผลวัดและการแบ่งหน้าต้องใช้ค่าเดียวกัน
- การเตรียมแผนผังเซลล์รวมเป็นหนึ่งครั้งต่อ table instance ต่อ layout pass
  ไม่ใช่ cache ตลอดอายุเอกสาร และไม่ตัด validation ขั้นอื่นทิ้ง
  การคำนวณพื้นที่คงเหลือ/จุดตัดต่อหน้ายังจำเป็น แบ่งงานนี้เป็น Task 3A–3C แล้ว
- ตรวจหลายเซลล์ หลายหน้า และหลายตาราง ไม่อาศัยเพียงเคสง่ายหนึ่งเซลล์หรือ
  ตัวนับการเรียก; ต้องพิสูจน์เนื้อหา/กรอบไม่หาย ไม่ซ้ำ และ PDF ถูกต้อง
- เรื่อง array ของภาพและ area มีความต้องการจริง แต่เจ้าของย้ายไปพาร์ต 5
  และ compatibility พาร์ต 6 แล้ว ไม่ดึงกลับมาเป็นเงื่อนไขก่อนทำ cell
- Area ที่นิยามผิดทำเอกสารไม่ได้; รายการข้อมูล area ใช้ไม่ได้ให้ข้ามพร้อม warning
  และทำส่วนที่เหลือต่อ; [] ใช้ได้ ตามหลักฐานรอบ0.1.8 ข้างต้น
- Frontend อนาคตใช้ Adapter แปลงไป–กลับได้โดยไม่เสียความหมาย; พรีวิวที่ต้องตรง
  กับ PDF ใช้ Core wrap/layout ร่วมกัน ไม่เริ่มสร้าง editor/adapter ในงานนี้

## วิธีทำงานร่วมกับเจ้าของ

เจ้าของต้องการคุยรายละเอียดเป็นพาร์ตและให้แยกสิ่งที่ตกลง ข้อเสนอ และสิ่งที่ยังเปิด
ตัวอย่าง ID ใช้ node-001/node-002 ให้ต่างจาก key ของตัวแปรอย่างชัดเจน
เมื่อมีแนวคิดใหม่ให้เก็บไว้ในพาร์ตที่เกี่ยวข้อง ไม่ขยายงานที่กำลังทำโดยเงียบ ๆ
อธิบายผลต่อการใช้งานจริงและข้อจำกัด ไม่อ้างว่า test ผ่านเท่ากับใช้จริงผ่านทุกกรณี
การเพิ่มเวอร์ชันต้องมีการเปลี่ยนโค้ดที่ใช้ได้จริงและตรวจผ่าน ไม่เพิ่มทุกพาร์ตอัตโนมัติ
release รอครบตาม roadmap และอำนาจอนุมัติที่ครอบคลุม ไม่ใช่ทุก dev version

## การรับต่อ

เอกสารนี้ให้บริบท ไม่สั่งให้เปิดห้อง ส่งข้อความ ทำ implementation หรือ merge
ห้องใหม่สรุปจุดเริ่มจากเอกสารที่อ้าง ตรวจว่ามีการแก้ใหม่หลังบันทึกนี้หรือไม่
และดำเนินตามคำขอปัจจุบันของเจ้าของ; ไม่รื้อข้อตกลงที่ชัดแล้วหรือเปิด round เก่ากลับมา
