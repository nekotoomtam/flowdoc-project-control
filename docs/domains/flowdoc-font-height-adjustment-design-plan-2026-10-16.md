# ข้อตกลงและแผนพัฒนาตัวช่วยปรับความสูงฟอนต์

วันที่ 2026-10-16 — เจ้าของยืนยันใช้ pt จริงเป็นหลัก และให้บันทึกข้อตกลงก่อนพัฒนา

## Authority Boundary

Owner: FlowDoc Project Control; บทบาท Planning Partner / Documentation Synthesizer.
เอกสารนี้เป็นข้อตกลงและแผนร่วม ต่อจาก
[ข้อตกลงคลังฟอนต์](flowdoc-font-library-design-2026-10-16.md).
ไม่ใช่หลักฐานว่าตัวช่วย การรับ custom font หรือ migration พัฒนาและออกใช้แล้ว.
คำขอครั้งนี้อนุญาตงานเอกสารและวางแผน ไม่อนุญาตเปลี่ยน runtime/ฐานข้อมูล/คลังจริง
หรือ release/deploy. เป็น single-room inline; Work/Phase/Checklist/execution IDs
ไม่เกี่ยวข้อง ไม่เปิดหรือรื้อฟื้น execution เก่า และไม่เปลี่ยน product map.
Current Truth Snapshot ที่อ่านยังชี้งาน frontend; ใช้คำขอเฉพาะและข้อตกลงคลังฟอนต์
เป็นบริบทของงานนี้ ไม่อ้างว่างาน frontend ครอบคลุมตัวช่วยนี้.
อ่านเฉพาะเมื่อพัฒนาหรือทบทวนเรื่องนี้ ไม่เพิ่มเป็นเอกสารเริ่มต้นบังคับของ AI.

> สำหรับผู้ลงมือ: ใช้ superpowers:executing-plans เมื่อทำในแชตเดียว;
> ใช้ subagent-driven-development เฉพาะเมื่อเจ้าของอนุญาตวิธีนั้น.
> ตรวจ base, owner guides และสัญญาปัจจุบันก่อนเริ่มแต่ละช่วง.

**Goal:** เปลี่ยนฟอนต์โดยเลือกปรับความสูงตัวหลักให้ใกล้ฟอนต์เดิมได้
และบันทึกผลเป็น pt จริง โดยเอกสารเดิมไม่เปลี่ยนเงียบ ๆ.

**Architecture:** Service ดูแลตัวตนไฟล์ การนำเข้า/ตรวจ/เก็บผลวัดและสิทธิ์;
Core ดูแลนิยาม metrics และสูตรคำนวณแบบไม่ผูก HTTP/DB รวมถึงการใช้ pt จริง
ในเส้นทางวัด/จัดหน้า/ฝังไฟล์เดิม. FlowDocMake เรียกสัญญาที่ตรวจแล้ว ไม่สร้างสูตรซ้ำ.
ยังไม่มีหน้า Editor/admin ใหม่; จุดเชื่อมหน้าจอวางภายหลังเมื่อมี client ที่ใช้งานจริง.

**Tech Stack:** Core/Service TypeScript, Service PostgreSQL และตัวตรวจ TTF ด้วย
Python/fontTools ที่มีอยู่; FlowDocMake MCP. ตรวจรุ่นแพ็กเกจจริงอีกครั้งก่อนลงมือ.

## 1 ข้อตกลงที่ยืนยัน

- ขนาดในเอกสารเป็น `fontSize: { value, unit: 'pt' }` จริง ไม่มีโหมดหรือหน่วย base ใหม่.
- เปลี่ยนฟอนต์ตามปกติคงเลข pt เดิม; การปรับความสูงต้องเลือกใช้โดยชัดแจ้ง.
- ตัวช่วยเสนอ pt ใหม่ให้ตรวจ ก่อนยืนยันและบันทึก font selection กับ pt พร้อมกัน.
- ขนาดเดียวกันต้องใช้ทั้งวัดข้อความ จัดหน้า preview และ PDF; ไม่ scale ภาพภายหลัง.
- ความกว้างเป็นไปตามฟอนต์ ไม่ยืด/บีบแนวนอน ไม่บังคับรักษาจุดตัดบรรทัดหรือจำนวนหน้า.
- ตัวช่วยไม่เปลี่ยน `lineHeightPt` อัตโนมัติ; ต้องตรวจสระ วรรณยุกต์ ขอบกล่อง
  และข้อความล้นหลังเปลี่ยนตามกฎ layout/readiness ที่มีอยู่.
- ฐานเปรียบเทียบคือ TH Sarabun New 1.35 Regular 400 ไฟล์ที่เจ้าของให้.
  ฐานนี้ไม่ใช่คำสั่งเปลี่ยน default font ของระบบ.
- แหล่งที่มา: ชุด TH Sarabun New 1.35 เป็น custom font ที่ผู้ดูแลนำเข้า;
  Sarabun, IBM Plex Sans Thai, Pridi, Noto Sans Thai Looped, Noto Serif Thai และ Prompt
  เป็น Google Fonts. ทุกตัวใช้จากคลังของระบบเมื่อออกใช้ ไม่โหลดจากภายนอกตอน render.
- รับเฉพาะ static TTF ตามขอบเขตเดิม ไม่เปิด upload custom font ให้ผู้เขียนทั่วไป
  และไม่รับ variable/OTF ในงานนี้. สองตระกูล Noto เลือก static ความกว้างปกติก่อน.
- ไม่ทำ automatic font fallback, synthetic bold/italic หรืออัปเกรดเอกสารเดิมอัตโนมัติ.
- ใช้ Regular 400 ของแต่ละรุ่นตระกูลกำหนดสัดส่วน แล้วใช้สัดส่วนเดียวกับ
  Bold/Italic ในรุ่นนั้น; ต้องตรวจ face เหล่านั้นก่อนเปิดตัวช่วยให้ใช้ร่วมกัน.

## 2 ข้อมูลที่ต้องเก็บ

| เจ้าของข้อมูล | ต้องเก็บ | ข้อกำหนด |
| --- | --- | --- |
| คลังเดิม | family/release/face/asset IDs, checksum, license, แหล่งที่มา และน้ำหนักสามค่า | ใช้ข้อมูลเดิม ไม่สร้างคลังซ้ำ; sourceIdentity ปัจจุบันรับ google-fonts ต้องปิดสัญญา custom ในช่วง 0 |
| ชุดฐานเปรียบเทียบ | reference ID/version, Regular face/asset/hash ของ TH Sarabun New 1.35 | ตรึงไฟล์ ไม่ใช้ชื่อ family อย่างเดียว และไม่เปลี่ยนฐานเงียบ ๆ |
| ผลวัดของฟอนต์แต่ละรุ่น | Regular face/asset/hash, `unitsPerEm`, U+0E1A, ตำแหน่ง baseline และ top, ความสูงที่วัด, method version, tool version, เวลาและผลตรวจ/เหตุผลที่วัดไม่ได้ | ผูกกับ bytes จริง; ผลอนุพันธ์มีรุ่น ไม่แก้ทับผลที่ยืนยันไว้ |
| ค่าอนุพันธ์/แคช | อัตราความสูงและตัวคูณเทียบฐาน ถ้าจำเป็น | สร้างใหม่ได้จากผลวัด; ไม่เป็น authority แยกจาก hash/method |
| เอกสาร | font selection ที่ตรึงรุ่น, pt จริงที่ยืนยัน และ lineHeightPt | ไม่ต้องมี scale mode, reference size หรือ multiplier ที่ต้องตีความใหม่ตอน render |
| ผลเสนอจากตัวช่วย | selection เดิม/ใหม่, pt เดิม/ใหม่, profile IDs/hash/method, revision/fingerprint ของข้อมูลที่ใช้เสนอ | ใช้ยืนยันกับ candidate เดิม; รายละเอียด field/API ปิดในช่วง 0 ไม่ใช่ runtime contract ที่มีแล้ว |

การไม่มีผลวัดตัวช่วยไม่ใช่เหตุใหม่ที่ห้ามบันทึก draft หรือสร้าง PDF ด้วย pt ปกติ
หากฟอนต์และข้อความผ่านกฎเดิม. หากไม่มี “บ”, Regular ที่ยืนยัน หรือผลวัดไม่ถูกต้อง
ให้ปิดตัวช่วยพร้อมเหตุผล ไม่เดาอัตรา ไม่เขียนค่าเสียกลับเอกสาร.
สิทธิ์เลือก target release รวมถึง retired ต้องใช้กฎเดิม ไม่ได้สิทธิ์เพิ่มเพราะเรียกตัวช่วย.

## 3 นิยามการวัดและสูตร

วัดจาก baseline ถึงยอดเส้นรูปตัว “บ” U+0E1A ใน font design units
จาก outline ที่ไม่ผ่าน hinting/pixel rounding; ไม่ใช้ bbox ทั้งฟอนต์หรือความสูง
รวมสระ/วรรณยุกต์. อ่าน outline รวม composite หากมี และระบุ convention ของ baseline
ใน method. ค่า baseline-to-top เป็นหลัก; อย่าสลับไปใช้ bbox height รวมใต้ baseline
โดยไม่เปลี่ยน method version.

```text
r = (top ของ บ − baseline) / unitsPerEm
pt_new = pt_old × r_old / r_new
scale_to_reference = r_reference / r_font   # คำนวณประกอบ ไม่ต้องผ่านฐานหลายรอบ
```

ตัวอย่างจากไฟล์ Regular ที่ตรวจ: TH Sarabun New มี r=400/1000;
Sarabun มี r=586/1000 จึงได้ `16 × 0.4 / 0.586 ≈ 10.9215017 pt`.
แสดงผลประมาณ 10.92 ได้ แต่ความละเอียดที่บันทึก/ส่ง API ต้องปิดในช่วง 0
ตามสัญญา Core จริง ไม่ปัดเป็นจำนวนเต็ม ไม่คำนวณจากตัวเลขแสดงผลซ้ำ.
ตรวจ NaN/Infinity, ศูนย์/ค่าติดลบ, ratio ที่ใช้ไม่ได้ และผลเกินช่วงขนาดที่ Core รับ;
ไม่ clamp หรือย่อให้พอดีกล่องโดยเงียบ ๆ.

เมื่อบันทึกแล้ว renderer ใช้ pt ที่บันทึก ไม่เรียกสูตรซ้ำ.
ผลวัดหรือสูตรรุ่นใหม่จึงไม่เปลี่ยนเอกสารเก่า; การเรียกตัวช่วยใหม่เป็นการกระทำครั้งใหม่.
ขั้นยืนยันต้องปฏิเสธผลเสนอที่ selection/size/revision เปลี่ยนไปแล้วอย่าง atomic.

## 4 ผลสำรวจที่นำกลับมาใช้ได้และขอบเขต

หลักฐานไฟล์ท้องถิ่น (การสำรวจ ไม่ใช่ผลรับรอง Core/PDF):
`C:/Users/nekot/Documents/Codex/2026-10-16/font-size-comparison/`:
`font-metadata.json`, `additional-font-inventory.json`, `additional-font-selected.json`,
`additional-font-render-metrics.json`, `same-16pt.png`, `matched-thai-body.png`.
ฐาน Regular hash: `b248f824f3d7a8576bc396826a4d898070c1420564f6ce6aa716aa8ad24f824a`.
ตรวจ hash/ใบอนุญาตและที่อยู่ไฟล์ใหม่ก่อนใช้; paths เหล่านี้ไม่ใช่คลัง runtime.

| Regular ความกว้างปกติ | pt เมื่อยอด บ เทียบฐาน 16 pt |
| --- | ---: |
| TH Sarabun New 1.35 | 16.0000 |
| Sarabun | 10.9215 |
| Noto Sans Thai Looped 2.000 | 11.3879 |
| Noto Serif Thai 2.002 | 11.5523 |
| Prompt 1.001 | 11.9626 |

ตัวเลขเป็น fixture ผลสำรวจ ไม่ hardcode ในสูตร. ภาพ Chromium แสดงว่าความกว้าง
ยังต่างหลังเทียบความสูง ไม่พิสูจน์การฝัง/จัดหน้า PDF หรือทุกภาษา/น้ำหนัก.
ชื่อ Thin/ExtraLight บางไฟล์ไม่ตรง raw weight; คงขั้นอนุมัติน้ำหนักสามค่าเดิม.
อ้างวิธี/มาตรฐานประกอบ: [OpenType units](https://learn.microsoft.com/en-us/typography/opentype/spec/head),
[งานวิจัยใช้ความสูง บ](https://aodr.org/_common/do.php?a=full&aidx=9769&bidx=717).

## 5 แผนพัฒนาเป็นช่วง

งานพัฒนารวมขนาด medium ข้าม Core/Service/FlowDocMake, risk routine.
รอบเอกสารนี้เปลี่ยนเพียงเอกสารนี้และลิงก์จาก design คลังฟอนต์;
ยังไม่ dispatch/เลือก WORK model. ตอนเริ่มพัฒนาต้อง resolve base/model ตาม policy.
งบเอกสาร: เอกสารร่วมนี้หนึ่งฉบับ ใช้คู่มือเดิมเฉพาะคำสั่งใหม่ ไม่เพิ่ม mandatory reading.
งบพิสูจน์: focused tests ต่อ owner, isolated DB, packed consumer และ PDF สั้นที่ตรวจทุกหน้า;
ไม่ใช้ full suite/SRS 98 หน้าเป็น default. หยุดแต่ละช่วงเมื่อเกณฑ์รับและผลกระทบครบ.

### ช่วง 0 — ปิดสัญญาและ dependency (discovery-only ต่อ product)

- [ ] ตรวจ `flowdoc-service/src/fonts/{types,inspection,repository,review,catalog}.ts`,
  `runtime/python/inspectFont.py`, CLI/routes และ Core `src/fonts/{types,selection}.ts`.
  ปิด owner ของ extractor/shared metrics และ arithmetic โดยไม่คัด renderer เข้าฝั่ง Service.
- [ ] ปิด schema ผลวัด/proposal/error, precision/tolerance, stale confirmation และ legacy
  Sarabun mapping ที่ยืนยัน hash ได้; ระบุไฟล์ migration/test ใหม่ก่อนลงมือช่วงถัดไป.
- [ ] ปิด custom sourceIdentity ของ TH Sarabun New: ผู้ดูแลเท่านั้น, ที่มา/ใบอนุญาตจริง,
  dedup, legacy google-fonts compatibility และกฎ immutable release เดิม.
- [ ] ปิดวิธีแนบผลวัดให้รุ่นที่ออกใช้แล้วโดยไม่แก้สมาชิก/ไฟล์: เสนอ versioned derived
  record ที่ผูก digest เดิม; ยังไม่เปลี่ยนชุด immutable หรือบังคับออกฟอนต์ทุกรุ่นใหม่.
- [ ] ตรวจรับ: ตัวอย่างรับ–ส่ง success/unavailable/stale/out-of-range ชัดเจน,
  ordinary pt และ PDF ที่ไม่มี profile ยังทำงาน; ไม่มี unresolved contract ที่บล็อกช่วง 1.

### ช่วง 1 — วัดและจัดเก็บผล (Service ร่วม Core ตาม owner ที่ปิดในช่วง 0)

- [ ] เพิ่ม extractor ในเส้นทาง inspection, typed profile/repository และ forward migration
  ใหม่; นำชุดฐานผ่านเครื่องมือผู้ดูแล ไม่เขียน DB/storage ตรงหรือแก้ migration เก่า.
- [ ] ตรวจ fixture static TTF จริง: baseline/top/UPM, composite, missing บ, malformed
  font, hash mismatch, retry/idempotency และ method version; variable/OTF ยังปฏิเสธ.
- [ ] ตรวจฐานใหม่และอัปเกรดฐานทดสอบ: ข้อมูลฟอนต์/draft เก่าครบ, restart อ่านกลับได้,
  ผลวัดผิดไม่ออกสถานะ verified และ custom intake ไม่เปิดสิทธิ์ผู้เขียน.
- [ ] ตรวจรับ: ค่าตารางสำรวจคำนวณซ้ำได้จากไฟล์; reference/profile อ้าง hash จริง,
  ไม่กระทบ release เดิมและ ordinary font readiness.

### ช่วง 2 — สูตรและผลเสนอ (Core; Service transport ใช้ package export)

- [ ] เพิ่ม pure calculation API, types และ focused tests ใน `src/fonts/`/`tests/fonts/`;
  รายละเอียดชื่อไฟล์และ signature ยึดช่วง 0. ไม่เพิ่ม font-size mode ลง template schema.
- [ ] ทดสอบ same-font identity, TH16→Sarabun, คู่กลับและสลับซ้ำใน tolerance ที่กำหนด,
  UPM ต่างกัน, ขนาดทศนิยม, missing/invalid profile, non-finite และผลนอกช่วง.
- [ ] ทดสอบ Regular/Bold/Italic ใช้สัดส่วนตระกูลเดียว ไม่สังเคราะห์ face ที่ขาด;
  missing target face ยังใช้กฎเดิม และไม่เปลี่ยนการวัด/ฝังของ ordinary pt.
- [ ] ตรวจรับ: ไม่มีสูตรซ้ำใน clients; packed Core consumer คำนวณตรงผลทดสอบ.

### ช่วง 3 — เชื่อมตัวช่วยและการยืนยัน (Service + FlowDocMake)

- [ ] Service เปิดข้อเสนอผ่าน API ตาม auth/catalog เดิม; FlowDocMake เพิ่มการขอเสนอ
  และยืนยันบันทึกผ่าน native draft tools. แก้คู่มือเดิมแบบสั้น ไม่ทำหน้า Editor ใหม่.
- [ ] ตรวจ normal change คง pt, helper เป็น opt-in, ยกเลิกไม่เปลี่ยน draft,
  ยืนยันแก้ selection+pt พร้อมกัน, stale revision/selection ไม่เขียนบางส่วน.
- [ ] ตรวจ unselected/missing profile, legacy mapping, unauthorized caller และ
  target retired ตามสิทธิ์เดิม รวมทั้ง read/clone เอกสารเดิม.
- [ ] ตรวจรับ: save/open ใช้ pt ที่ยืนยัน, lineHeightPt ไม่เปลี่ยน,
  updated profile ไม่เปลี่ยน draft/PDF เอง, helper unavailable ไม่สร้าง readiness blocker ใหม่.

### ช่วง 4 — ตรวจร่วมใน PDF และเตรียมส่งมอบ

- [ ] ใช้ static ความกว้างปกติของเจ็ดตระกูลที่มี: ฐาน TH, Sarabun, IBM Plex Sans Thai,
  Pridi และสามตระกูลใหม่. ทดสอบหลายขนาด เช่น 10/16/24 pt พร้อม face ที่มีจริง;
  Pridi/Noto ที่ไม่มี italic ต้องรายงานตามจริง ไม่ถือว่า PASS กรณีที่ไม่มี.
- [ ] สร้างเอกสารทดสอบสั้น แยก same-pt และ height-adjusted; ไทย/อังกฤษ/ตัวเลข,
  สระบนล่าง/วรรณยุกต์, หลายบรรทัด, ช่องแคบ และตาราง. รักษาเอกสารเดิมด้วย draft ใหม่.
- [ ] validate/save/open/preview ผ่าน consumer จริง; เก็บ PDF/path/hash/render ทุกหน้า,
  ตรวจข้อความครบ ฟอนต์ฝังตรง selection การใช้ pt และ lineHeightPt เดิม.
  ยอมให้ความกว้าง/จุดตัดบรรทัดต่าง แต่ห้ามข้อความหายหรือสระถูกตัดโดยไม่รายงาน.
- [ ] ยืนยันนิยามการวัดตรงกันใน runtime; ไม่ตัดสินผ่านจากภาพหน้าจออย่างเดียว
  และไม่บังคับ bounding box ของทุกคำเท่ากันเพราะเทียบเฉพาะยอด บ.
- [ ] ตรวจ ordinary pt/legacy Sarabun, profile absent, retired, default change และ
  save/reopen/clone regression ตามผลกระทบจริง. ทบทวนผลครบตามเกณฑ์ข้างต้น.
- [ ] เตรียมเอกสาร/แพ็กเกจ/compatibility ตาม release rules ก่อนเสนอส่งมอบ;
  การวางแผนนี้ยังไม่อนุญาต tag/push/install/deploy.

## 6 ขอบเขตที่ยังไม่ทำและเงื่อนไขหยุด

ไม่แก้ style เส้น/กรอบ, auto-fit, automatic fallback, variable axes, optical-size,
หน้า admin/Editor ใหม่ หรือ helper schema2 bug ที่พบก่อนหน้า; ถ้าบั๊กนั้นบล็อก native
flow ที่จำเป็น ให้ระบุ dependency และแยกงานแก้ก่อน ไม่ข้าม guard หรือซ่อนผลล้มเหลว.
ใช้ ordinary pt เป็นทางเลือกเมื่อ helper ใช้ไม่ได้. อย่าขยายเป็นระบบ scale runtime
หรือย้าย pt เอกสารเดิมเพื่อให้ fixture ผ่าน.

สถานะขณะบันทึก: ข้อตกลงบันทึกแล้ว; ช่วง 0–4 ยังไม่เริ่มลงมือ.
ความละเอียดตัวเลข, custom intake contract และ derived-profile attachment
เป็น prerequisite ช่วง 0. ผลสำรวจ Chromium ไม่ใช่การรับรอง PDF.
