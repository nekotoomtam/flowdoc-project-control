# แผนพัฒนาคลังฟอนต์ FlowDoc ตามช่วงงาน

## Authority Boundary

Owner: FlowDoc Project Control. บทบาท Planning Partner / Documentation Synthesizer.
อ้างอิง [ข้อตกลงที่เจ้าของอนุมัติ](flowdoc-font-library-design-2026-10-16.md).
เอกสารนี้กำหนดลำดับ ผลส่งมอบ และการตรวจ ไม่ใช่หลักฐานว่าพัฒนาแล้วหรือสิทธิ์ deploy.
การจัดทำแผนเป็น single-room; execution/Phase/Checklist IDs ไม่เกี่ยวข้อง.
ยังไม่แก้ product code, migration, ฐานจริง, user draft หรือแพ็กเกจ FlowDocMake.
ช่วง 0 ต้องจบก่อนทำช่วง 1–6 เพราะข้อค้นพบอาจเปลี่ยนสัญญาและเจ้าของส่วนเชื่อมต่อ.
รายละเอียดงานย่อยและ interface ของช่วงหลังต้องเติมจากผลช่วง 0 ก่อนส่งลงมือ.

> สำหรับผู้ลงมือ: ใช้ superpowers:executing-plans เมื่อเลือกทำในแชตเดียว;
> ใช้ subagent-driven-development เฉพาะเมื่อได้รับอนุญาตให้ใช้วิธีนั้น.
> แผนและสัญญาร่วมอยู่ Project Control ไม่สร้างสำเนาใน product docs/superpowers.

**Goal:** ผู้ดูแลจัดชุด TTF คงที่ ออกใช้เป็นรุ่น และให้เอกสารอ้างรุ่นนั้นเพื่อสร้าง PDF
โดยคงการใช้ Sarabun เดิมและยอมให้ draft มีปัญหาฟอนต์ที่ระบุได้.

**Architecture:** เสนอให้ Service เป็นเจ้าของคลัง ไฟล์ สิทธิ์ สถานะ และงานสร้าง PDF;
Core เป็นเจ้าของสัญญาโครงสร้าง การเลือก/วัด/จัดอักษร และฝังฟอนต์จากชุดที่ยืนยันแล้ว.
FlowDocMake และส่วนติดต่อใช้ API เดียวกัน ไม่สร้างคลังหรือกฎอนุมัติซ้ำในแต่ละ client.
ขอบเขต UI/Editor และ Backend อีกสายต้องตัดสินจากช่วง 0 ไม่ถือว่าต่อกันได้อยู่แล้ว.

**Tech Stack ที่พบ:** Core/Service 0.3.0, TypeScript/Node 24, PostgreSQL,
Python/fontTools, ตัวจัดอักษรของ Core และ MCP draft-only; frontend ยังไม่กำหนดในแผนนี้.

## ขอบเขตและวิธีทำงาน

- รักษากฎ TTF คงที่ ผู้ดูแลนำเข้า ปกติ 400 ขั้นต่ำ น้ำหนักสามค่า และหกสถานะตาม spec.
- ไม่เพิ่ม custom/variable font, OTF, automatic fallback, synthetic bold/italic หรือ style เส้น/กรอบ.
- รุ่นที่ออกใช้แล้วเปลี่ยนไฟล์/สมาชิก/การจับคู่ไม่ได้; ผลตรวจต้องผูกชุดและ hash จริง.
- บันทึก draft ไม่เท่ากับพร้อม PDF; โครงสร้างผิด/สิทธิ์ผิดยังต้องปฏิเสธอย่าง atomic.
- ไม่มีการแทนไฟล์ Sarabun หรืออัปเกรดเอกสารเดิมเงียบ ๆ.
- Core ไม่รับ HTTP/DB และ Service ไม่คัด renderer/validator ของ Core มาเขียนซ้ำ.
- migration ใหม่เป็น forward-only; ไม่แก้ migration ที่ใช้แล้วหรือฐานผู้ใช้เพื่อให้ผ่าน test.
- แผนงานรวมขนาด large, ความเสี่ยง routine; แตกเป็นช่วงเพื่อจำกัดผลกระทบต่อสัญญา/ข้อมูลเดิม.
- งบพิสูจน์: test เฉพาะส่วนที่เปลี่ยนและผู้ใช้สัญญานั้น, ฐานทดสอบแยก, PDF สั้น
  สำหรับรูปแบบที่ออกใช้ และการทดสอบ Core package ใน consumer จริง. ไม่ใช้ SRS 98 หน้าเป็นค่าเริ่มต้น.
- งบเอกสาร: spec และแผนนี้เป็นหลัก เติมผล/ลิงก์หลักฐานในช่วงที่เกี่ยวข้อง;
  ไม่เพิ่มคู่มือเริ่มต้นบังคับของ FlowDocMake หรือสร้าง Work/Evidence จำลอง.
- ยังไม่ dispatch หรือเลือกโมเดล WORK; ต้องตัดสินใน kickoff ของงานจริงตาม workflow policy.
  งานแผนครั้งนี้ใช้ session ปัจจุบัน ไม่อ้างว่าเป็น registered PLAN/WORK round.
- แนะนำทำตามลำดับในแชตเดียว ตรวจรับทีละช่วง; แยก worktree ของ repo ที่แก้เมื่อเริ่มลงมือ
  ตามความเสี่ยง/งานพร้อมกัน การแยก checkout ไม่บังคับเปิดอีกแชต.

## ฐานที่ตรวจและสิ่งที่มีผลต่อลำดับ

ตรวจแบบอ่านอย่างเดียว 2026-10-16: Core `6d2a9b7` และ Service `0c57eec`
เป็น 0.3.0 และ checkout สะอาด ณ ตอนจัดทำแผน; ตรวจ base ใหม่ก่อนลงมือ.

| ที่พบ | ผลต่อแผน |
| --- | --- |
| Core TextStyle รับ sarabun และ normal/bold; การวัดเลือก font-regular/bold/italic/bold-italic | ต้องเปลี่ยนสัญญาและเลือกไฟล์ทุกทาง ไม่ใช่เพิ่มแถว DB อย่างเดียว |
| loader คาด resource IDs เดิม; subset helper ระบุข้อมูล license ของชุดเดิม | ต้องรักษา legacy route และส่งตัวตน/ใบอนุญาตจากไฟล์จริง |
| authoring save เรียก validateTemplate; preview เรียกตัวตรวจเดียวกันก่อน prepare/compose | ต้องแยกโครงสร้างที่บันทึกได้จาก readiness ไม่ปิด validator เดิมทั้งหมด |
| Service มี migration 001–015 และใช้ Core จาก packed artifact | เพิ่ม migration ใหม่/packed release ตามสัญญาที่ตกลง ไม่แก้ vendor/dist โดยตรง |
| authoring access ปัจจุบันมี token/principal ไม่ได้พิสูจน์สิทธิ์ผู้ดูแลคลัง | ต้องกำหนด admin authorization ก่อนเปิดทางนำเข้า/ออกใช้ |
| Editor ปัจจุบันอิง @flowdoc/vnext-core และ Backend อีกสาย | ห้ามถือว่า Editor เชื่อม Service Area18 ได้แล้ว |
| FlowDocMake 0.1.9 ตรวจรุ่น Service/Core 0.3.0 แบบตรงรุ่น | การปล่อยรุ่นใหม่ต้องอัปเดต compatibility หลังพิสูจน์ ไม่ข้าม preflight |

## ลำดับและจุดตรวจรับ

| ช่วง | เจ้าของหลัก | ต้องได้ก่อนเดินต่อ |
| --- | --- | --- |
| 0 ปิดสัญญาและทางเชื่อม | Project Control พร้อมตรวจ Core/Service/clients | แบบสัญญาและ ownership ชัด พร้อมงานย่อยที่ลงมือได้ |
| 1 คลังและรับไฟล์เข้าเตรียม | Service | รับ/อ่าน/ตรวจซ้ำ/เก็บชุดเตรียมได้อย่างปลอดภัย ยังไม่เปิดออกใช้ |
| 2 Core ใช้ชุดฟอนต์ที่ระบุ | Core | วัดและฝังด้วยไฟล์ที่ตรงกัน พร้อมทาง Sarabun เดิม |
| 3 Draft readiness และงาน PDF | Service ร่วม Core | บันทึกค้างได้ แต่ PDF ใช้ snapshot ที่ตรวจแล้วเท่านั้น |
| 4 ตรวจและออกใช้คลังครบวงจร | Service | หกสถานะ สิทธิ์ ค่าเริ่มต้น และประวัติทำงานจริง |
| 5 เชื่อมเครื่องมือและส่วนติดต่อ | FlowDocMake และเจ้าของ UI ที่ยืนยัน | ผู้ดูแล/ผู้เขียนใช้ API จริงและเข้าใจปัญหาได้ |
| 6 ตรวจร่วมและเตรียมส่งมอบ | verification ตามเจ้าของส่วน | วงจรจริงผ่าน มีหลักฐานความครบและข้อค้างชัดเจน |

### ช่วง 0 ปิดสัญญาก่อนเปลี่ยนระบบ

Authority: discovery-only ต่อ product; บันทึกการตัดสินใจใน spec/แผนนี้ได้.
อ่านจุดเชื่อมจากไฟล์ในตารางข้างล่าง ไม่อ่านประวัติทั้งโครงการหรือทดสอบ capacity ใหม่.

- [ ] ระบุสัญญา TextStyle ใหม่ รูปแบบยังไม่เลือก ช่วงน้ำหนักและ schema/model version
  รวม rule สำหรับ reference ชนิดถูกต้องแต่ยัง resolve ไม่ได้ กับ reference ผิดโครงสร้าง.
- [ ] กำหนด catalog/release/face/asset/import-audit และผล readiness ที่แยกจาก save receipt;
  เขียนตัวอย่างผ่าน/ไม่ผ่านและ issue code/path ที่ clients ใช้ร่วมกัน.
- [ ] ระบุ interface: ตรวจไฟล์ → ชุดเตรียม → review snapshot → เปิดใช้ →
  resolve style → font snapshot ของ job → Core; ให้ชื่อ/type/สิทธิ์แน่นอนก่อนเขียนงานย่อย.
- [ ] ยืนยันสิทธิ์ผู้ดูแล ขอบเขต API/CLI/MCP และ owner ของหน้า admin/ตัวเลือกฟอนต์.
  แยกการเลือก UI ใหม่กับการแก้ Editor อีกสาย; ไม่เพิ่ม frontend ใหม่โดยปริยาย.
- [ ] ตัดสินกรณีคัดลอกเอกสารที่อ้างรุ่นเลิกให้เลือก: new reference หรือ retained reference;
  กำหนดผลเมื่อ restore/ไฟล์ไม่พร้อมและการอนุมัติทดสอบรุ่นเตรียมที่แยกจาก normal PDF.
- [ ] ทำชุดข้อทดสอบตัวอย่าง: Sarabun เดิม, IBM/Pridi, น้ำหนักต่างจากต้นทาง,
  มี/ไม่มี italic, ขาด glyph, invalid structure, stale revision, สิทธิ์ไม่พอ.

**ตรวจรับ:** แต่ละกรณีบอกได้ว่า save/PDF/activate ผ่านหรือไม่ ใช้รุ่น/ไฟล์ใด และใครเป็นเจ้าของ;
ไม่มีสัญญาหรือ owner สำคัญที่ผู้ลงมือต้องเดา. ผลใหม่ที่เปลี่ยนข้อตกลงกลับให้เจ้าของทบทวน.
เติม exact interface, รายชื่อไฟล์ใหม่และคำสั่ง test ของช่วง 1–5 ในแผนก่อนอนุญาต implementation.
ไม่ใช้การเขียน API ตัวอย่างหรือ migration ทดลองเป็นวิธีข้ามช่วง discovery.

### ช่วง 1 สร้างคลังและรับเข้าเป็นชุดเตรียม

Scope ที่เสนอ: เพิ่ม module `flowdoc-service/src/fonts/` แยก metadata/repository/files/service;
เพิ่ม forward migration ใหม่ และ tests ใน `tests/fonts-*.test.mjs` ตามสัญญาช่วง 0.
ใช้รูปแบบจัดเก็บจาก `src/storage/resource-files.ts` เป็นบริบท ไม่ใช้ image-upload contract แทนฟอนต์.

- [ ] เพิ่ม failing tests แล้วทำ migration/repository สำหรับตัวตนรุ่น น้ำหนักสามค่า
  รูปแบบ ไฟล์ และประวัติ พร้อมข้อบังคับ unique/reference/เวลา.
- [ ] ทำการรับ TTF คงที่และอ่าน metadata โดยจำกัดขนาด/เวลา ตรวจ bytes/hash จริง
  แยกต้นฉบับ ค่าต้นทาง และค่าที่อนุมัติ ไม่ใช้ filename ตัดสินหรือแก้ bytes อัตโนมัติ.
- [ ] ทำ dedup/idempotency และการเก็บไฟล์ร่วมกัน รวม cleanup เมื่อ transaction/การเก็บไฟล์ล้ม.
  ยังไม่เปิดให้สถานะออกใช้ผ่านก่อนมีผลตรวจจากช่วง 2–4.

**ตรวจ:** ทั้ง 29 ไฟล์อ่านเป็นชุดเตรียมได้; Sarabun สี่ไฟล์หลัก reuse ได้;
เปลี่ยนชื่อไฟล์ไม่ทำให้ซ้ำ, same slot/different hash ไม่ทับของเดิม, metadata ขัดกันค้างให้ยืนยัน,
TTF ปลอม/variable/OTF ถูกปฏิเสธ, retry/concurrent import ไม่สร้างซ้ำหรือทิ้งไฟล์ผิดสถานะ.
ทดสอบฐานใหม่และฐานที่มีข้อมูลเดิมใน environment แยก ไม่แก้เลข migration เก่า.

### ช่วง 2 ให้ Core เลือก วัด และฝังฟอนต์จากชุดที่ยืนยันแล้ว

แก้ contract/validator, resource adapter, text measurement/cache และ subset ตามสัญญาช่วง 0.
Service ส่ง resource ที่ resolve แล้ว; Core ไม่ค้น DB, Google Fonts หรือ system fonts เอง.

- [ ] เพิ่ม failing tests สำหรับ style อ้างรุ่น/น้ำหนัก/รูปแบบ และ legacy mapping
  รวม body, table, header/footer, TOC และเลขหน้า ไม่แก้เฉพาะทางข้อความธรรมดา.
- [ ] ส่ง resource identity ที่แยกไฟล์/รุ่นได้ถึง shaper, cache และ PDF;
  ป้องกัน font-regular ของคนละตระกูล/รุ่นชนกัน และตรวจ hash ก่อนใช้.
- [ ] ขยาย loader/subset metadata ให้ใช้ตัวตนและ license ของไฟล์จริง;
  รักษาเส้นทาง bundled Sarabun เดิมตาม hash ไม่แทนไฟล์หรือแก้เนื้อเอกสารเก่า.

**ตรวจ:** font เดียวกันถูกใช้วัดและฝัง; เปลี่ยน default ไม่เปลี่ยนงานที่ pin;
สองตระกูล/สองรุ่นในเอกสารเดียวไม่ปน cache; ตัวหนาเอียงต้องมี face จริง;
ขาด glyph/รูปแบบ/ไฟล์และ hash ผิดต้องไม่แทนเงียบ ๆ. ใช้ PDF สั้นตรวจทุก face ที่จะออกใช้.
เปรียบเทียบ Sarabun เดิมกับ baseline ด้านข้อความ ตัดบรรทัด ตำแหน่ง และหน้า;
การทดสอบเฉพาะ hash ไฟล์ไม่ใช่หลักฐาน layout parity.
build และตรวจ packed consumer Linux/amd64 ก่อน Service เปลี่ยน dependency.

### ช่วง 3 แยกการบันทึก draft ออกจากความพร้อม PDF

ต่อ Core package ที่พิสูจน์แล้วเข้ากับ Service authoring และ job pipeline.
ไม่ลดกฎสิทธิ์ identity ownership stale revision หรือ idempotency เดิม.

- [ ] เพิ่ม failing tests ให้โครงสร้างผิด/สิทธิ์ผิดปฏิเสธแบบไม่เขียนบางส่วนหรือเพิ่ม revision;
  font reference ที่ผิดความพร้อมแต่โครงสร้างถูกต้องต้อง save/read กลับได้.
- [ ] ส่ง save receipt แยกจาก readiness พร้อม issue code/path/reason/remedy;
  รวมปัญหาระดับ style และตำแหน่งอักษรอย่างมีขอบเขต ไม่เปิดเผย filesystem path/credentials.
- [ ] preview/generation ตรวจ revision และข้อความจริงก่อนรับงาน แล้ว pin font snapshot
  ให้ worker ใช้ชุดเดียวกัน; ตรวจ bytes อีกครั้งเมื่อใช้จริงและไม่ resolve latest ระหว่างงาน.
  บันทึกตัวสร้าง/ไฟล์ที่ใช้ รวม recovery/retry โดยไม่ย้ายไปฟอนต์อื่น;
  issue ของฟอนต์ต้องผ่าน render-child/render กลับมาถึง client โดยไม่ถูกกลืนเป็น error ทั่วไป.

**ตรวจ:** draft มีปัญหาฟอนต์ยังบันทึกได้แต่ไม่มี PDF ที่ผิด;
ผลเก่าไม่รับรอง revision/ข้อมูลใหม่, preview กับ generation ใช้กฎเดียวกัน,
activation/default/retirement ที่เกิดระหว่าง queue ไม่เปลี่ยนไฟล์ของงาน,
ไฟล์หายหลังรับงานต้องล้มอย่างชัดเจน. Legacy draft/version/identity ยังอ่านและทำงานตามข้อยืนยันเดิม.

### ช่วง 4 ทำการตรวจและออกใช้หกสถานะ

Service เพิ่มคำสั่งผู้ดูแล/transport ที่ตกลง โดยใช้ Core จากช่วง 2 และ snapshot จากช่วง 3.
เพิ่มกลไก review/activate ใน `src/fonts/` และ tests ของ authorization/transaction.

- [ ] บังคับ transition, revision ของชุด และผลตรวจที่ตรงกับ manifest/hash ปัจจุบัน;
  เตรียม PDF ทดสอบได้เฉพาะทางผู้ดูแล ไม่เปิด normal generation ให้รุ่นเตรียม.
- [ ] ตรวจปกติ 400 และทุก face ก่อน activate ทั้งชุด; เปิดใช้/ตั้ง default แบบ atomic.
  แก้ชุดเตรียมให้ invalidate ผลที่ได้รับผล ไม่อนุมัติด้วยผลจากชุดเก่า.
- [ ] ทำ retirement/reactivation, default replacement/clear, audit และ deletion guards;
  รุ่นออกใช้แล้วแก้สมาชิกไม่ได้ ไฟล์ร่วม/ข้อมูลอ้างอิงเดิมไม่ถูกลบตามรุ่น.

**ตรวจ:** ทั้งหกสถานะและ transition ที่ห้าม; user ปกติ activate/import ไม่ได้;
review ชนกับการแก้ชุดต้องไม่ผ่านผิดชุด, เปิดใช้สองครั้งไม่สร้างสองรุ่น,
ไม่มีปกติ 400 หรือมี face ไม่ผ่านทั้งชุดยังออกใช้ไม่ได้;
retire ไม่เปลี่ยนเอกสารเดิมและต้องจัดการ default ชัดเจน, restore ไม่เปิดให้แก้รุ่นเดิม.

### ช่วง 5 เชื่อมเครื่องมือและส่วนติดต่อที่ยืนยันแล้ว

FlowDocMake ใช้ catalog/readiness API จาก Service; ไม่ทำสิทธิ์ admin ผ่าน token authoring โดยปริยาย.
เจ้าของ UI/Editor และไฟล์ที่จะเปลี่ยนต้องมาจากช่วง 0 ก่อนเริ่มช่วงนี้.

- [ ] เพิ่มการอ่าน catalog และ readiness ผ่าน HTTP/MCP adapter และ schemas ที่ตรงสัญญา;
  ทดสอบจริงกับ Service พร้อมแยกสิทธิ์อ่าน/นำเข้า/ออกใช้.
- [ ] ส่วนผู้ดูแลแสดงชุดเตรียม ความต่างน้ำหนักสามค่า ผลตรวจ และหกสถานะ;
  ส่วนเขียนเอกสารเลือกเฉพาะรุ่นที่มีสิทธิ์เลือก บันทึกรุ่นจริง และแสดง save/readiness แยกกัน.
- [ ] เพิ่มการนำทางไปตำแหน่งปัญหา/เลือกแก้ และทดสอบ retained reference ตามกติกาช่วง 0;
  ไม่ผูก preview font จากเครื่องผู้ใช้แทนไฟล์ที่ Core ใช้.

**ตรวจ:** API/เครื่องมือ/หน้าจอให้ผลตรงกัน; ไม่มี italic/bold-italic ให้เลือกปลอม;
ปัญหาซ้ำไม่ท่วมหน้าจอและ draft กลับมาแก้ได้; stale revision ไม่ถูกเขียนทับ.
ทดสอบ user flow กับ runtime จริง ไม่ใช้ mock เป็นหลักฐานจบการเชื่อมต่อ.
ปรับ package compatibility และคู่มือ FlowDocMake ตามรุ่น Core/Service ที่สร้างจริง
พร้อมรักษาการอ่านตามช่วง; ห้ามแก้เลขรุ่นเพื่อหลอก preflight โดยไม่มี proof.
ถ้าช่วง 0 เลือกส่งมอบเฉพาะ CLI/API ต้องระบุขอบเขต UI ที่เลื่อนไว้อย่างชัดเจนก่อนตรวจรับ.

### ช่วง 6 ตรวจร่วมและเตรียมส่งมอบ

Authority: verification ต่อ candidate ที่ตรึงแล้ว; ซ่อม source กลับเจ้าของช่วงที่เกี่ยวข้อง.

- [ ] ทดสอบรับเข้าจากโฟลเดอร์ผู้ใช้ในพื้นที่ทดสอบ ตรวจซ้ำ ยืนยันน้ำหนักที่ขัดกัน
  ตรวจทุก face ในชุดที่เลือกออกใช้ แล้วสร้าง PDF ไทย/อังกฤษจากหลายตระกูลในเอกสารเดียว.
- [ ] ทดสอบวงจรเพิ่มรูปแบบเป็นรุ่นใหม่ เปลี่ยน default, retire/restore, retry/restart,
  ไฟล์หาย/hash ผิด และเอกสาร Sarabun เดิม; ไม่มีการแก้ฐานหรือ draft ผู้ใช้จริง.
- [ ] ตรวจทุกหน้าใน PDF ตัวอย่าง พร้อมข้อความ/อักษรซ้อน/เส้นฐาน/การตัดบรรทัด/ไฟล์ที่ฝัง;
  เชื่อมเกณฑ์ spec กับผลตรวจและขอบเขตที่ยังไม่ผ่าน ก่อนส่งเจ้าของตัดสินใจใช้รุ่นใหม่.

**ตรวจรับ:** เป็นวงจรจริงตั้งแต่ admin ถึง saved draft/job/PDF พร้อม immutable font identity;
ไม่มี unresolved ที่จำเป็นต่อขอบเขตส่งมอบ. ผล parser 29 ไฟล์ไม่เท่ากับ 29 face ผ่าน PDF;
รายงานแยกจำนวนรับเข้า จำนวนออกใช้ และจำนวนที่ตรวจ PDF แล้ว.
ตรวจ packed Core, real DB/API และ actual FlowDocMake preflight ของ release ที่จะส่งมอบ.
การทดสอบผ่านไม่อนุญาต deploy/เปลี่ยน default ของระบบใช้งานจริงโดยอัตโนมัติ.

## จุดในโค้ดและคำสั่งตรวจสำหรับเติมงานย่อย

เส้นทางอ้างจาก Project Control; ไฟล์ใหม่ของช่วงหลังต้องยืนยันในช่วง 0.
คำสั่งด้านล่างเป็นชุดตรวจเมื่อพัฒนา ไม่ใช่ผล PASS ในงานจัดทำแผนนี้.

| ส่วน | ไฟล์เดิมที่กระทบ |
| --- | --- |
| Core contract | `../flowdoc-core/src/composition/resolvedDocument.ts`, `src/template/validateTemplate.ts`, `src/template/sectionOwnership.ts`, `src/composition/validateResolvedDocument.ts` |
| วัด/จัดหน้า | Core `src/layout/measureText.ts`, `measurePageFieldText.ts`, `pageBands.ts`; ตรวจ caller อื่นที่เลือก font ID ด้วย |
| Runtime/ฝัง PDF | Core `src/runtime/exportResources.ts`, `loadResources.ts`, `textRuntime.ts`, `cacheTextRuntime.ts`, `subsetFonts.ts`, `runtime/python/fontSubset.py` |
| Draft/API/tools | Service `src/authoring/service.ts`, `adapter.ts`, `src/templates/contract.ts`, `assembly.ts`, `storage.ts`, `src/http/authoring.ts`, `src/tools/authoring.ts` |
| Job/worker | Service `src/jobs/types.ts`, `admission.ts`, `repository.ts`, `processor.ts`, `render.ts`, `render-child.ts` |
| Storage/deploy package | Service `migrations/`, `src/storage/resource-files.ts`, `src/cli.ts`, `package.json`, `vendor/`; Core `scripts/buildResourceManifest.mjs`, `scripts/checkPackedConsumer.mjs` |
| FlowDocMake | `plugins/flowdocmake/scripts/compatibility.mjs`, `server.mjs`, packaged skill/references ตามผลสัญญา |

- Core: `npm run build`, `npm test -- <affected test paths>`, `npm run check:package`.
  ใช้ `tests/resources.test.ts`, `tests/subsetRequest.test.ts`, `tests/runtime/cacheTextRuntime.test.ts`,
  `tests/template/validateTemplate.test.ts`, `tests/layout/pageBands.test.ts` และ tests ใหม่ตามสัญญา.
- Service: `npm run build`, `npm test -- <affected test paths>` ในฐานทดสอบแยก;
  ใช้ `tests/authoring.test.mjs`, `authoring-adapter.test.mjs`, `authoring-tools.test.mjs`,
  `current.test.mjs`, `jobs.test.mjs`, `queue-admission.test.mjs`, `processor.test.mjs` และ tests ใหม่.
  `npm run check:database` / `npm run check:api` สำหรับจุดตรวจ migration/package/API ที่กระทบ.
- Project Control/FlowDocMake: focused `tests/flowdocmake*.test.mjs`,
  `npm run check:data`, link/hash checks และ `node tools/check-flowdocmake.mjs` หลังติดตั้งรุ่นที่ตรวจแล้ว.
  ไม่ใช้ wildcard path ที่ shell ไม่รองรับ ต้องส่งรายชื่อ test จริงตอนลงมือ.

## Review Focus และความครบของหลักฐาน

| ความเสี่ยงสำคัญ | จุดพิสูจน์ |
| --- | --- |
| ชื่อเหมือน/ไฟล์ต่าง/ค่าต้นทางต่างทำให้ overwrite หรือจับคู่ผิด | ช่วง 1: concurrent dedup, conflict review และ immutable hash |
| ผล review เก่าหรือสิทธิ์ authoring ถูกใช้ activate ผิดชุด | ช่วง 4: manifest/revision race, admin authorization และ idempotency |
| ปนฟอนต์ใน cache/worker หรือ default ใหม่เปลี่ยนงานเก่า | ช่วง 2–3: multi-font identity, queued snapshot และ worker failure |
| การยอม draft มีปัญหาทำให้ข้อมูลเสียถูกบันทึกหรือ PDF ผ่านทั้งที่ผิด | ช่วง 3: atomic reject/save-with-issues และ actual-input readiness |
| Legacy/UI ดูเหมือนรองรับแต่ใช้ Core คนละสาย/ฝังไฟล์คนละตัว | ช่วง 0, 2, 5–6: ownership, Sarabun parity, real consumer และ visual proof |

Spec ข้อ 1–5 ครอบคลุมในช่วง 0–1/4; ข้อ 6–7 ในช่วง 2–3/5;
ข้อ 8–9 ในช่วง 4/6; ข้อ 10 ในช่วง 3/5; ช่องว่างข้อ 11 ต้องปิดในช่วง 0.
ทุก implementation task ต้องเริ่มจาก failing test ของพฤติกรรมที่เป็นเจ้าของ
แล้วแก้ขั้นต่ำ ตรวจผลและ affected consumers ก่อน commit. ใช้ผลเดิมซ้ำเฉพาะเงื่อนไขไม่เปลี่ยน.
ก่อนเริ่มช่วงใหม่ตรวจ base/ownership/หลักฐาน prerequisite; หยุดเมื่อ acceptance ของช่วงผ่าน.
ถ้าพบข้อจำกัดจริงหรือ scope ขยาย ให้กลับทบทวนสัญญา ไม่แก้ข้าม owner หรือข้าม gate.

## จุดกลับมาคุยก่อนลงมือ

ทบทวนลำดับและขอบเขตแผนนี้ แล้วเลือกวิธีทำงาน; ข้อเสนอคือทำตามช่วงในแชตนี้.
จุดเริ่มถัดไปคือช่วง 0 เพื่อปิดสัญญาและเติมงานย่อย ไม่เริ่มเปลี่ยน DB หรือ Core ทันที.
ถ้าจะใช้ห้อง WORK แยกจริง ต้องตั้งรอบและ return controls ตาม Project Control ก่อนส่งงาน;
แผนนี้ไม่สร้าง registry/locator/สิทธิ์ส่งข้อความแทนผู้ใช้.
