# รายการตรวจและแผนกู้งานเก่า FlowDoc สำหรับทบทวน

## Authority Boundary และสถานะ

Owner: FlowDoc Project Control — แผนร่วมและรายการตรวจเท่านั้น.
Service เป็นเจ้าของ task/job/output, PostgreSQL, reservations และไฟล์งาน;
Core เป็นเจ้าของการสร้าง PDF/DOCX. เอกสารนี้ไม่เปลี่ยนโค้ด ไม่รับรองระบบจริง
และไม่ใช่คำอนุญาตให้เชื่อมต่อ สำรอง แก้ข้อมูล เปิด/ปิดบริการ หรือ deploy.

สถานะ: **พร้อมทบทวนแผน / ยังไม่พร้อมดำเนินการกับข้อมูลจริง**.
วันที่จัดทำ: 2026-10-30. อำนาจเมื่อจัดทำฉบับแรกคือคำขอเจ้าของให้จัดทำเอกสารจาก
โค้ดและหลักฐาน lab ที่มีอยู่ โดยไม่เข้าถึงหรือแก้ข้อมูลจริง ไม่ release หรือติดตั้ง.
ภายหลังเจ้าของอนุญาตการสำรวจจริงแบบอ่านอย่างเดียวแยกแล้ว ตาม A1 และผลสำรวจ
ด้านล่าง ไม่ได้อนุญาต maintenance/backup/repair หรือ release/installation.
บทบาท: Planning Partner และ Project Control Steward; งานเอกสารในห้องเดียว,
execution/Work/Phase/Checklist IDs ไม่ใช้กับงานนี้. รหัสรายการด้านล่างเป็น
หัวข้อทบทวนในเอกสาร ไม่ใช่ registered Checklist records.

ขอบเขตการส่งมอบเมื่อจัดทำฉบับแรก: แผนหนึ่งฉบับและลิงก์ในบันทึกเดิม ตรวจความตรงกับ
implementation, หลักฐานที่อ้าง และการตรวจข้อมูลของ Project Control.
ไม่มีการรันทดสอบระบบจริงหรือเปิด lab เพิ่มเพื่อจัดทำเอกสารนี้.

## เป้าหมายและความหมายของการกู้

จัดการงานเก่าที่ไม่มี runtime origin และค้างจาก process เดิม ให้ปิดสถานะอย่างมี
หลักฐาน คืนช่องคิวและพื้นที่ที่ไม่ใช้ รักษาประวัติ job/output และความไม่แน่นอน
ของผลส่ง พร้อมเส้นทางกู้ย้อนกลับที่จับคู่ฐานข้อมูลกับไฟล์จากจุดเวลาเดียวกัน.

การกู้ในแผนนี้ไม่สร้างเอกสารหรือส่งงานเก่าซ้ำอัตโนมัติ ไม่เติม runtime/storage
identity ย้อนหลัง ไม่ยืนยันการส่งสำเร็จจากการมี output และไม่คืน quota โดยละเลย
ไฟล์จริง. หากต้องการสร้าง/ส่งใหม่ ให้เป็นคำขอแยกที่เจ้าของงานอนุมัติหลังทบทวน
หลักฐานการส่ง เพื่อป้องกันผลซ้ำที่ผู้รับหรือระบบภายนอก.

## ฐานหลักฐานที่นำกลับมาใช้

[บันทึกและผลซ้อมเดิม](flowdoc-task-queue-concurrency-plan-2026-10-20.md)
มีรายละเอียด provenance และตำแหน่งรายงานพร้อม raw receipts/manifest:

| หลักฐาน | ขอบเขตที่ยืนยันแล้ว | ขอบเขตที่ยังไม่ยืนยัน |
| --- | --- | --- |
| Legacy rehearsal | กู้สำเนา DB/ไฟล์, fencing, negative safeguards, transaction rollback และการคิดพื้นที่ใน lab | writers ทั้งหมดและ backup ของระบบจริง |
| PDF linked rehearsal | 4 เคส: queued, running, succeeded/output อยู่, succeeded/output หาย; recreate และ recovery ซ้ำ | ความเสียหายรูปแบบอื่นและการส่งในอดีตจริง |
| DOCX linked rehearsal | 4 เคสเดียวกับ PDF; MIME/NULL page count; ZIP/XML/ข้อความของ DOCX ใหม่ | หน้าตาใน Word, pagination และ field refresh |

Candidate ที่ซ้อม: Service `843bd0204b424f32cf7fed8a8ebaab6964a33388`.
Runtime image ที่ซ้อม:
`sha256:00980f7ded74ba413419329f36c6b328de7178493eba766d5f6a60654861d623`.
Image สร้างจาก `3e21a5c`; เปรียบเทียบกับ candidate ต่างเฉพาะ test fixture
`tests/pdf-files.test.mjs`. ข้อมูลนี้เป็น lab provenance ไม่ใช่ identity ปัจจุบัน
ของระบบจริง. ผลชุดรวมเดิมยังคงขอบเขตเดิม ไม่มี full suite ใหม่ในงานเอกสารนี้.

ผล restore เดิมเปรียบเทียบแถว public tables และเนื้อหาไฟล์งานที่ตรวจนับซึ่งไม่ใช่
dot files; ยังไม่พิสูจน์ schema/sequence/metadata/hidden control files ครบทุกชนิด.
TTL ซ้อมด้วย logical clock+4ชั่วโมง ไม่ใช่ wall-clock soak3ชั่วโมง.
การไม่มีรายการซ้ำยืนยันตาม checkpoints ที่เก็บไว้ ไม่ใช่หลักฐานต่อเนื่องทุกขณะ.

## ข้อมูลที่ต้องกรอกหลังได้รับอนุญาตแยก

แบบฟอร์มนี้เริ่มจาก **ยังไม่ตรวจ** และอัปเดตเฉพาะหลักฐานที่ได้จาก A1.
ห้ามใช้ชื่อ container, path, credential หรือจำนวนงาน
จาก lab เป็นค่าเริ่มต้นของระบบจริง. ไม่บันทึก secret หรือเนื้อหาเอกสารลูกค้าลง
Project Control; ใช้ locator และหลักฐานที่ปกปิดข้อมูลอ่อนไหวแทน.

| รายการ | ค่าปัจจุบัน / ผู้รับผิดชอบ |
| --- | --- |
| ระบบ/tenant/database/schema และพื้นที่ไฟล์เป้าหมาย | สำรวจแอป flowdoc_oracle052 / DBflowdoc/public และ rootsหลัก; ไม่ครอบคลุมทุกtenant / ผู้ดูแลระบบ: TBD |
| Runtime image/digest, Service/Core pin และ config ที่ใช้งาน | Service/Core0.5.2, image227b2fd…, Corearchiveตรงpin; ไม่ใช่lab image / ผู้ดูแล Service: TBD |
| Migration names/checksums, triggers และ schema ที่มีจริง | 001–026ตรงruntime/release; ไม่มี027หรือruntime origin guard / ผู้ดูแล DB: TBD |
| งานและ job/output ที่ได้รับอนุญาตให้ตรวจ/แก้ | สำรวจmetadataแล้วไม่พบงานค้างในsnapshot; ยังไม่อนุญาตให้แก้ / เจ้าของข้อมูล: TBD |
| Writers ทุกแหล่งและวิธีปิด intake/ป้องกันการกลับมาทำงาน | ยังไม่ตรวจ / ผู้ควบคุม maintenance: TBD |
| หลักฐานผลส่งและผู้ตัดสินใจเมื่อผลส่งไม่ทราบ | ยังไม่ตรวจ / เจ้าของงาน: TBD |
| Maintenance window, ระยะยอมรับ downtime และจุดตัดสินใจย้อนกลับ | ยังไม่กำหนด / เจ้าของบริการ: TBD |
| Backup storage แยกเครื่อง, สิทธิ์เข้าถึง, retention และกุญแจถอดรหัส | ยังไม่ตรวจ / ผู้ดูแล backup: TBD |
| ผู้ปฏิบัติ ผู้ตรวจทานอิสระ และผู้อนุมัติแต่ละขั้น | ยังไม่กำหนด / เจ้าของระบบ: TBD |

TBD ไม่ถือเป็นการอนุมัติหรือหลักฐานผ่าน. ผู้ปฏิบัติและผู้ตรวจทานต้องระบุเป็นบุคคล
ก่อนใช้แผนจริง; การทบทวนเอกสารสำเร็จไม่ทำให้ช่องเหล่านี้ผ่านอัตโนมัติ.

## รายการตรวจและลำดับการดำเนินการในอนาคต

### A — อนุมัติขอบเขตตรวจแบบอ่านอย่างเดียว

- [x] A1 เจ้าของอนุญาตการเข้าถึงระบบ/ข้อมูลจริงแบบอ่านอย่างเดียว ระบุขอบเขต
  เวลา ผู้ปฏิบัติ และวิธีเก็บหลักฐานที่ไม่เปิดเผยข้อมูลลูกค้า.
  เจ้าของอนุญาตในแชตนี้เมื่อ2026-10-30 ให้ Codexสำรวจ Oracle เฉพาะ runtime/
  schema, storage และงานค้าง โดยไม่แก้ข้อมูลหรือหยุดบริการ. ตรวจช่วง12:08–12:12
  เวลาไทย เก็บ metadataที่จำเป็น ไม่ดึงเนื้อหาเอกสาร/secret. ไม่ครอบคลุม backup,
  maintenance, repair, release หรือ installation.
- [ ] A2 ตรวจ identity ของ runtime, Core pin, config, schema/migration checksums
  และ triggers จากระบบเป้าหมายจริง แล้วเทียบกับ candidate และวิธีที่ซ้อม.
- [ ] A3 ระบุ storage roots/mounts และความสัมพันธ์ DB–ไฟล์จาก implementation
  ที่ใช้งานจริง ครอบคลุม tasks, uploads, normalized/prepared/output/work,
  font assets/snapshots และทรัพยากรอื่นที่ค้นพบว่าอ้างถึง.
  หาก control/identity file หายหรือไม่ทราบที่มา ให้หยุดทบทวนวิธีได้มาซึ่ง
  maintenance ownership ก่อน ห้ามสร้างหรือแทนที่ไฟล์เพื่อข้ามความไม่แน่นอน.

**จุดหยุด:** runtime/schema ไม่ตรงหรือไม่มี migration027/guard ที่วิธีซ้อมต้องใช้
ให้หยุดประเมิน compatibility. ห้ามรัน script lab กับ schemaอื่น ข้าม guard หรือ
ติดตั้ง runtime/migration เพิ่มเพื่อให้แผนเดินต่อ. การ release/ติดตั้ง/ปรับ schema
ต้องมีแผนและคำอนุญาตแยกก่อนเริ่ม maintenance นี้.

### B — สำรวจและจัดกลุ่มงานโดยยังไม่แก้

- [ ] B1 จัดทำ allowlist ของ task IDs และเหตุผลที่เลือก; แยกงานนอกขอบเขตชัดเจน.
  เก็บ snapshot/hash ของ row, state/version/lease, writer/child references,
  NULL origin ทั้งคู่, expiry, owner และ template/Core/output-format pins.
- [ ] B2 รวม job IDs/status/immutable inputs, output IDs/format/MIME/hash/size/
  page count/availability, task_files, reservations, terminal events และ usage
  ทุก revision ที่เชื่อมโยง รวม references ที่ข้าม schema/พื้นที่ไฟล์ถ้ามีจริง.
- [ ] B3 ตรวจไฟล์แต่ละรายการว่าอยู่/หาย/ขนาดหรือแฮชไม่ตรง และตรวจไฟล์ส่วนเกิน
  หรือ work files ที่ไม่อยู่ใน DB. ยืนยัน path อยู่ภายใน root ที่อนุญาต ไม่ตาม
  symlink หรือใช้ mount ที่ยังพิสูจน์เจ้าของไม่ได้.
- [ ] B4 จัดกลุ่มตาม fixture PDF/DOCX ที่ซ้อม พร้อมจำนวนงานและผลที่คาดราย task.
  งานมี origin แล้ว, task terminal แล้ว, usage ซ้ำ, input หาย, แฮชไม่ตรง,
  quota ต่ำกว่าพื้นที่จริง หรือ references เสีย ให้แยกออกเพื่อวิเคราะห์ก่อน.
  แยกสองขอบเขตให้ชัด: (1) allowlist ของแถวที่จะซ่อมโดยตรง และ (2) งาน/ไฟล์/
  ทรัพยากรทั้งหมดที่ runtime อาจเปลี่ยนเมื่อเริ่ม recovery/cleanup/processing.
  `sweep()` ตรวจทุก nonterminal/cleanup-pending task โดยไม่มี allowlist;
  startup ยังมี render-temp/output cleanup, upload recovery และ processor.
  การปิด HTTP intake อย่างเดียวไม่จำกัดการเขียนภายในเหล่านี้.
- [ ] B5 ทบทวนหลักฐานการส่งรายงานกับเจ้าของงาน แยกสิ่งที่ยืนยันได้กับสิ่งที่ไม่ทราบ.
  ไม่ใช้ output/job succeeded, HTTP log เพียงบรรทัดเดียว หรือไฟล์หายเป็นหลักฐาน
  ว่าผู้รับได้รับครบ. กำหนดการเก็บ output/หลักฐานก่อน cleanup เริ่มลบไฟล์.

**หลักฐานผ่าน B:** รายการ task/job/output/file ที่ชัดเจน มี hash/locator และผล
ที่คาดราย task พร้อมผู้ตรวจทาน. หากประเภทข้อมูลไม่ตรง fixture ให้คง quarantine
และซ้อมเพิ่มด้วยสำเนาที่ได้รับอนุญาตก่อนรวมในรอบซ่อม.
ต้องระบุ expected mutations ของขอบเขต runtime ทั้งหมด รวมงานที่อาจข้าม expiry
ระหว่าง window. หากพิสูจน์ขอบเขตผลกระทบไม่ได้ ให้หยุดก่อนเปิด runtime.

### C — อนุมัติ maintenance และพิสูจน์ว่า writers หยุด

- [ ] C1 เจ้าของอนุมัติ window, downtime, รายการเป้าหมาย, backup/restore และ
  การลบ output/work โดย normal cleanup ที่จะเกิดตามหลัง. อนุมัตินี้แยกจาก A.
  ขอบเขต rollback ทั้ง DB/volumes อาจกว้างกว่า task allowlist ต้องระบุและอนุมัติ
  ทรัพยากรร่วมทั้งหมดด้วย; หากคุม writers ของข้อมูลร่วมไม่ได้ ห้ามใช้ full restore.
  ต้องอนุมัติขอบเขต runtime startup/recovery/cleanup/queue processing จาก B4
  ด้วย หรือมีวิธี isolation ที่พิสูจน์แล้วว่าไม่เปลี่ยนทรัพยากรนอกขอบเขตนั้น.
- [ ] C2 ปิด intake จากทุกเส้นทางและหยุด schedulers/retries/autorestart ที่อาจ
  เขียนซ้ำ ตรวจ API/worker/CLI/admin/upload/cleanup/DB clients และ subprocesses
  ทุก host/container/เครื่องมือที่เข้าถึง DB หรือ storage เดียวกัน.
- [ ] C3 บันทึก writers และ DB sessions ทั้งหมด รวม idle/transaction/connection
  pools; ปิด session ที่ไม่จำเป็นผ่านผู้ดูแลที่ได้รับอนุญาต. ห้ามยกเว้นเพราะชื่อ
  application หรือ Docker label เหมือนเครื่องมือกู้ หรือตรวจไม่พบ PID ใน hostใหม่.
- [ ] C4 พิสูจน์การหยุดจริงและการป้องกันกลับมาเขียน ครอบคลุม process groups,
  legacy writers ที่ไม่ถือ fence และผู้เขียนข้าม host. ตรวจซ้ำก่อน backup,
  ก่อน commit ซ่อม และก่อน restore. Storage fence/DB advisory lock เพียงอย่างเดียว
  ไม่พิสูจน์ว่า legacy/external writer ที่ไม่เคารพ lock หยุดแล้ว.

**จุดหยุด:** writer/child/session ที่ไม่ทราบเจ้าของ, ยืนยันไม่ได้ว่าหยุด,
หรือมี writer กลับมา ให้หยุดและรักษา quarantine. ไม่ล้าง process references
เพื่อทำให้ health ผ่านแทนการพิสูจน์ว่า process หยุด.

### D — สำรองและซ้อม restore ตามขอบเขตจริง

- [ ] D1 ขณะ writers หยุดและ intake ปิด กำหนด checkpoint เดียวกันให้ DB และ
  storage ทุกส่วนที่เกี่ยวข้อง. ถ้าต้องใช้ snapshot หลายชุด ให้บันทึกวิธีพิสูจน์
  ความสอดคล้องระหว่างชุด ห้ามสรุปว่า consistent เพราะเวลาใกล้กัน.
- [ ] D2 สำรอง DB พร้อม schema/functions/triggers/constraints, migrations และ
  checksums, extensions/versions, roles/grants/search_path/sequence state ที่ต้องใช้
  และ storage พร้อมไฟล์ที่อ้างถึง, metadata/permissions/ownership, hidden identity
  control files และ mapping ที่จำเป็น. ไม่คัดลอก active lock/session state มาใช้
  เป็นหลักฐานถือสิทธิ์ในเครื่อง restore; ไม่ลบหรือสร้าง origin identity ทดแทนเอง.
- [ ] D3 สร้าง manifest ผูก checkpoint, locator, bytes/count/hash, version และ
  พื้นที่ไฟล์ ตรวจว่า backup อ่านคืนได้ เก็บสำเนา immutable แยกเครื่อง พร้อม
  สิทธิ์และ retention ที่เจ้าของกำหนด รวม backup encryption keys ที่กู้ใช้ได้.
- [ ] D4 หลังอนุญาตใช้สำเนาข้อมูลจริง สร้าง restore environment แยกจริง ปิด egress,
  credentials ภายนอก, intake และ scheduler/retry/cleanup/worker อัตโนมัติไว้ก่อน
  ตรวจข้อมูล เพื่อไม่ส่งงานหรือทำลายหลักฐานระหว่าง restore.
- [ ] D5 ตรวจแถวข้อมูลและ relationships ทั้ง allowlist และงานนอกขอบเขตที่ต้องคงเดิม,
  schema/trigger behavior, migration checksums, sequence state, required roles,
  metadata/control files และ file contents/hashes/missing-file classifications.
  ตรวจพื้นที่ว่างสำหรับทั้ง backup/restore และ cleanup ที่ค้างอยู่.
- [ ] D6 ซ้อมกระบวนการจริงบนสำเนาที่อนุญาต รวม partial failure, retry/restart,
  output preservation/missing states และ matched DB/storage rollback ตามรายการ
  ที่สำรวจ เก็บ receipts ก่อน–หลังและข้อจำกัดตามจริง.
  รวมงาน/ไฟล์ที่ไม่อยู่ใน direct-repair allowlist แต่เข้าเงื่อนไข sweep/expiry/
  cleanup/queue dispatch เพื่อพิสูจน์ขอบเขต runtime จาก B4; ห้ามสมมติว่ามี
  config ปิดหรือกรองการทำงานเหล่านี้โดยยังไม่ตรวจ implementation จริง.

**หลักฐานผ่าน D:** ผู้ตรวจทานยืนยันว่าชุดสำรองตรง checkpoint อ่านคืนได้ และ
การซ้อมครอบคลุมสภาพข้อมูลจริงที่เลือก. ผล lab จำลองไม่ทำให้ D ผ่านโดยอัตโนมัติ.

### E — ทบทวนผลกระทบและอนุมัติการซ่อมรายรอบ

- [ ] E1 เจ้าของและผู้ตรวจทานลงรับรอง allowlist ฉบับสุดท้าย พร้อม digest,
  expected state/version/lease/row+file hashes, ผลที่คาดราย task และหลักฐานส่ง.
  ลงรับรอง runtime impact set และ expected mutations แยกจาก direct-repair
  allowlist; การขยายชุดผลกระทบต้องขออนุมัติใหม่ ไม่ใช้การอนุมัติซ่อม task แทน.
- [ ] E2 ระบุผลของ normal recovery ก่อนอนุมัติ: nonterminal อาจกลายเป็น failed
  หรือ expired ตาม expiry จริง; queued/running jobs ถูกปิด; succeeded jobsคงเดิม;
  output/work อาจถูกลบและ metadata เป็น expired/deleted; input คงไว้เฉพาะที่ยัง
  ไม่ครบ expiry ตามนโยบายเดิม. หาก expiry ผ่านแล้วไฟล์อาจถูกลบทันทีเมื่อเริ่ม.
- [ ] E3 กำหนดขนาด batch/ระยะรอ/lock timeout/จุด abort จากผลซ้อมจริง ไม่ใช้
  ตัวเลข lab เป็นข้อกำหนด production. ต้องรักษา writers หยุดตลอดช่วงซ่อมและกู้.
- [ ] E4 อนุมัติการซ่อมจริงโดยระบุผู้ปฏิบัติ ชุด backup วิธี restore และผู้ตัดสินใจ
  เมื่อผลไม่ตรง. ช่องอนุมัติหรือหลักฐานที่ขาด = ไม่เริ่ม E/F.

### F — ขั้นตอนซ่อมที่เสนอหลังได้รับอนุมัติ

เอกสารนี้ตั้งใจไม่แนบ SQL/connection command ที่พร้อมรันกับ production.
ก่อนดำเนินการต้องเตรียมเครื่องมือ/คำสั่งที่ตรวจทานแล้วให้ผูกกับ runtime/schema
และ allowlist จริง. Scripts จาก lab เป็นหลักฐานการซ้อม ไม่ใช่เครื่องมือ production
ที่ผ่านการอนุมัติ โดยเฉพาะข้อยกเว้นชื่อ application และ label inventory เดิม.

1. ตรวจ target identity, checkpoint/backup hashes, writer quiescence และ
   allowlist อีกครั้ง ถ้า drift ให้หยุดจัดทำ snapshot/อนุมัติใหม่ก่อนแก้.
2. ใช้ exclusive storage maintenance ownership ที่ถูกต้อง และถือ leadership
   advisory lock60430404 ผ่าน checked-out DB session จริง. เข้าธุรกรรมด้วย
   quota lock60430405 ก่อน task row locks ที่เรียงลำดับแน่นอน; ใช้ parameters
   และตรวจ expected rows/state/version/lease ภายใน transaction.
3. ภายใน allowlist เท่านั้น ล้าง obsolete writer/child process references ที่
   พิสูจน์แล้วว่าหยุด พร้อมเพิ่ม state_version/update timestamp ตามวิธีที่ทบทวน.
   คง runtime_owner_id/storage_identity เป็น NULL ไม่ปิด triggers ไม่แก้ expiry,
   status, immutable input/pins, delivery facts หรือ reservations โดยตรง.
4. ถ้าจำนวนแถวหรือค่าใดไม่ตรง ให้ rollback ทั้ง transaction และหยุด ไม่ใช้
   wildcard ขยายขอบเขต และไม่รันซ้ำเมื่อไม่ทราบว่า commit สำเร็จหรือไม่.
   กรณี connection หลุด ให้ตรวจ durable state ก่อนตัดสินใจ retry/restore.
5. หลัง commit เก็บ receipt แล้วปล่อย maintenance owner/session อย่างควบคุม
   ก่อน handoff ให้ runtime ที่ตรวจความเข้ากันได้และได้รับอนุญาตใช้อยู่แล้ว
   เข้าถือสิทธิ์ recovery. Intake/schedulers เส้นทางอื่นยังคงปิดจนผ่าน G.
   **จุดหยุดก่อน handoff:** ต้องมี runtime impact set ที่อนุมัติและซ้อมแล้ว หรือ
   isolation ที่พิสูจน์การป้องกันทรัพยากรนอกขอบเขต. หาก runtime จะกวาดงานอื่น
   ลบไฟล์อื่น หรือ dispatch งานที่ยังไม่ได้อนุมัติ ห้ามเริ่ม runtime แล้วรอตรวจพบ
   ความเปลี่ยนแปลงภายหลัง; กลับไปทบทวนขอบเขต/วิธี isolation ก่อน.
6. ให้ normal recovery/cleanup ทำงานตาม implementation จริง เก็บ checkpoints
   task/job/output/file/reservations/events/usage; ไม่ rerender/resend งานเก่า
   เพื่อแก้ผลส่งที่ไม่ทราบ และไม่สรุป success เพียงเพราะ health เป็น200.

### G — ตรวจผลและอนุมัติเปิด intake กลับ

- [ ] G1 แต่ละ task มีผล terminal ตาม expected state/expiry จริง และ terminal
  event/usage ที่ถูกต้อง ไม่ซ้ำ; ประวัติเดิมและ immutable pins คงอยู่.
  หากพบ usage ก่อนหน้าหรือ revision ที่ไม่ตรงแผน ให้หยุด ไม่ลบประวัติให้ผ่าน.
- [ ] G2 Job/output ไม่เกิดรายการใหม่โดยไม่ได้อนุญาต queued/running ถูกปิดตาม
  ข้อกำหนด succeeded generation ไม่ถูกแปลงเป็นหลักฐานส่งสำเร็จ.
  Output present/missing และ availability/deleted_at ตรงกับไฟล์จริงและแผน.
- [ ] G3 Queue slots คืนตามสถานะ พื้นที่ held/used ตรงกับไฟล์จริง รวม cleanup
  retry_needed/พื้นที่ที่ลบไม่สำเร็จ. ห้ามบังคับ quotaเป็น0เมื่อไฟล์ยังมีอยู่.
- [ ] G4 PDF/DOCX formats และข้อมูลส่งตรงหลักฐาน; DOCX ไม่สร้าง PDF metrics
  หรือ page countขึ้นเอง. ผลไม่ทราบยังเป็น unknown และมีผู้รับผิดชอบติดตาม.
- [ ] G5 ยืนยันความคงเดิมของทรัพยากรนอกทั้ง direct-repair allowlist และ
  runtime impact set ที่อนุมัติ; ภายใน runtime impact set เทียบ expected
  mutations รายรายการ ไม่เรียกการเปลี่ยนงานอื่นว่าอนุญาตเพียงเพราะเป็น cleanup.
  Health/readiness และ admission สอดคล้องกัน ตรวจ canary ที่เจ้าของอนุมัติ
  พร้อม task ID/usage ใหม่ที่แยกจากงานเก่า ไม่ส่งต่อให้ผู้รับจริงอัตโนมัติ.
- [ ] G6 ผู้ตรวจทานกับเจ้าของยอมรับผลและ residual risks ก่อนเปิด intakeกลับ.
  กำหนดช่วงเฝ้าดู ผู้รับผิดชอบ และจุดหยุดจากแผนที่อนุมัติ; ไม่เพิ่ม soak/time
  หรือยืด maintenance โดยไม่มีเหตุจากผลตรวจหรือข้อตกลงเจ้าของ.

## เมื่อผิดเงื่อนไขและการกู้ย้อนกลับ

| จุดที่พบปัญหา | การตอบสนองที่เสนอ |
| --- | --- |
| ก่อน commit ซ่อม | Rollback transaction ถ้ามี; คง intake ปิดและ quarantine; เก็บความต่าง ไม่แก้ snapshot ให้ดูตรง |
| ไม่ทราบผล commit | ตรวจ durable rows/events/receipts ก่อน ไม่ retry repair หรือ rerender/resendแบบคาดเดา |
| หลัง commit หรือระหว่าง cleanup แต่ยังไม่เปิด intake | หยุด writersใหม่และเก็บ post-failure DB/files/audit evidence แยกก่อน พิจารณากู้ DB+storageทั้งชุดจาก checkpointที่ผ่านการซ้อมและได้รับอนุมัติ |
| หลังเปิด intake หรือมีงานใหม่เขียนแล้ว | หยุดและรักษาข้อมูลใหม่ ห้ามย้อน backupเก่าทับทั้งชุดทันที; ต้องทบทวนผลสูญหายของงานใหม่และแผน reconciliation/restoreที่อนุมัติใหม่ |
| ทรัพยากร/backupไม่ครบ หรือ writerยังไม่หยุด | ไม่เริ่ม restore/repair รักษา quarantine และส่งให้ผู้รับผิดชอบตัดสินใจ |

DB transaction ไม่ครอบคลุม filesystem cleanup หรือการส่งที่เกิดนอก DB.
ห้ามถือว่า rollback SQL สามารถคืนไฟล์ที่ถูกลบหรือเรียกเอกสารที่ส่งไปแล้วกลับได้.
การ restore ต้องใช้ชุด DB/storage/config ที่ตรวจว่าเข้ากันได้ ไม่ย้อน release หรือ
ติดตั้ง runtimeใหม่เป็นส่วนแฝงของ rollback. ประวัติการซ่อม/ส่งและ receipts ต้องเก็บ
นอกชุดที่อาจถูก restoreทับ เพื่อไม่ให้การย้อน DB ลบหลักฐานการกระทำไปด้วย.

## หลักฐานที่ผู้ทบทวนต้องเห็นก่อนอนุมัติขั้นจริง

ผลสำรวจแบบอ่านอย่างเดียว2026-10-30: แอปที่ตรวจชี้ DB `flowdoc` / schema `public`.
ตรวจผ่าน app connection ณ12:12:47เวลาไทยพบ tasksทั้งหมด0, pending tasks0 และ
queued/running jobs0. มี historical generation jobs36succeeded/1failed และ
outputs36expired ตาม snapshotก่อนหน้า; ไม่ได้ตรวจสาเหตุของ historical failure.
ภายหลังเจ้าของอนุญาตให้ตรวจ failureนั้นแยก: พบเป็น preview revision1 วันที่26ต.ค.
จบด้วยLAYOUT_FAILEDในบล็อกเลขหน้าส่วนหัว ไม่มีtask/outputผูกอยู่ และมีrevision2
สำเร็จสองรายการแล้ว. หลักฐานชี้ว่าlineHeight10.5ptต่ำเกินเมื่อเทียบกับband16pt
ของrevision2 แต่ยังเป็น probable cause ไม่ใช่ controlled reproduction หรือ
ข้อบกพร่องของผลิตภัณฑ์ที่พิสูจน์แล้ว. ดูผลตรวจในบันทึกและรายงาน:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-failed-job-20261030/verification-report.html`.
รายการสำรวจว่างไม่ใช่ allowlistที่อนุมัติให้ซ่อม และไม่ครอบคลุม DB/schemaอื่น.
คำแนะนำเดิมให้คง quarantine เป็นข้อควบคุมก่อนตรวจ ไม่ใช่หลักฐานว่ามี taskค้าง
ในระบบจริง; รอบนี้เป็นการตรวจ live inventory ที่ยังไม่พบเป้าหมายในtargetนี้.

Runtimeจริง Service/Core0.5.2; PostgreSQL18.6; migrations26รายการถึง026 โดย
checksumตรง runtime/local releaseทั้งหมด. ยังไม่มี027, runtime origin columns
และ ownership guard/moduleที่ใช้ในlab; guardsอื่นที่มีอยู่ไม่ได้ถูกปิดหรือแก้.
จึงยังไม่ผ่านเงื่อนไขใช้วิธีกู้labโดยตรง ไม่ติดตั้งหรือเปลี่ยนschemaเพื่อปิดรายการนี้.
Storageหลัก mapถึง staging/outputs namedvolumes; render-tempอยู่ในcontainer layer.
นี่เป็น root/mount/metadata inventory ไม่ใช่ complete backup/file-integrity proof.

รายงานและหลักฐาน:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-production-readonly-20261030/verification-report.html`.
A2สำรวจแล้วพบcompatibilityไม่ตรงlab; A3ได้mappingหลักแต่ยังไม่ครบขอบเขตbackup.
ทั้งสองยังไม่ติ๊กผ่านเป็น readiness สำหรับ repair. ข้อมูลจริงไม่ได้ถูกหยุดให้
quiescent; snapshotsแยกกันและมีบริการทำงานอยู่ จึงไม่ใช่ consistent backup.

| ชุดหลักฐาน | สถานะปัจจุบัน |
| --- | --- |
| แผนและหลักฐาน synthetic PDF/DOCX | มีแล้ว ตามบันทึกที่อ้างด้านบน |
| Target/runtime/schema/storage จริงและผล compatibility | สำรวจtargetนี้แล้ว พบ026/ไม่มี027; storageได้mappingหลัก ยังไม่พร้อมใช้วิธีกู้lab |
| Task/job/output/file allowlist และ delivery assessment จริง | ไม่พบงานค้างในsnapshotของtargetนี้; ยังไม่มีallowlistซ่อม/การประเมินการส่งจริง |
| Writer shutdown/session inventory และ maintenance approval | ยังไม่ตรวจ/ยังไม่อนุมัติ |
| Matched backup manifest, off-host copy และ restore proof ตามข้อมูลจริง | ยังไม่ตรวจ |
| คำสั่ง/เครื่องมือ production ที่ตรวจทาน พร้อม dry-run/affected-row proof | ยังไม่มีในแผนนี้ |
| Repair approval, post-check receipts และ reopen approval | ยังไม่อนุมัติ/ยังไม่ดำเนินการ |

ผลทบทวนเลือกได้: รับแผนไว้เตรียมขั้นต่อไป / ขอแก้แผน / พักงาน.
การรับแผนไม่ใช่การผ่านหลักฐานที่ยังไม่ตรวจ และไม่เท่ากับอนุญาต A, C หรือ E.
รอบนี้หยุดเมื่อเอกสารพร้อมทบทวนและตรวจความตรงของข้อกำหนด/หลักฐานผ่านแล้ว.

## จุดอ้างอิง implementation ที่ตรวจในเครื่องเท่านั้น

Owner implementation: Service candidate843bd02 ใน checkout audit ที่ใช้ซ้อม;
รายการอ้างอิง implementation นี้ตรวจในเครื่องเมื่อจัดทำแผน.
ผล production metadata/SQLที่ได้รับอนุญาตในภายหลังแยกอยู่ในผลสำรวจด้านบน.

- `src/tasks/intake.ts`: `canRecover`, `stopped`, `sweep`, `cleanup`, `isReady` —
  NULL origin ไม่ถูก adopt; foreign processยังพิสูจน์ไม่ได้จะพักงาน;
  sweepไม่จำกัด allowlist; cleanupรักษา originalsตาม expiry และคิดพื้นที่ตามไฟล์.
- `src/server.ts`: startup initialization เรียก task recovery, render-temp/
  output cleanup และ upload recovery ก่อนเริ่มการทำงานของ processor;
  ขอบเขต side effects ต้องตรวจและอนุมัติก่อน handoff.
- `src/tasks/repository.ts`: `finishLocked`, `recoverInterrupted` —
  terminal/usage, queued/running job finalization, uncertain delivery และ quota.
- `src/tasks/ownership.ts` และ `runtime/python/task_owner.py`: storage fence/
  runtime identity; ไม่ใช้แทนการสำรวจ legacy writersทุกแหล่ง.
- `src/tasks/quota.ts`: quota advisory lock และ storage accounting.
- `migrations/027_task_runtime_ownership.sql`: immutable NULL-origin pair;
  schemaนี้ต้องตรวจจริงก่อนใช้วิธีเดียวกับ lab.

เอกสารนี้เป็นแผนของ Project Control ไม่ใช่ runtime contract, Evidence promotion
หรือผลตรวจ production. สถานะการซ้อมเดิมยังคงอยู่ตามวันและขอบเขตที่รายงานไว้.
