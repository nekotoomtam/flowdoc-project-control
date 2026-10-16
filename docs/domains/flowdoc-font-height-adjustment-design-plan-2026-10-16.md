# ข้อตกลงและแผนพัฒนาตัวช่วยปรับความสูงฟอนต์

วันที่ 2026-10-16 — เจ้าของยืนยันใช้ pt จริงเป็นหลัก และให้บันทึกข้อตกลงก่อนพัฒนา

## Authority Boundary

Owner: FlowDoc Project Control; บทบาท Planning Partner / Documentation Synthesizer.
เอกสารนี้เป็นข้อตกลงและแผนร่วม ต่อจาก
[ข้อตกลงคลังฟอนต์](flowdoc-font-library-design-2026-10-16.md).
ไม่ใช่หลักฐานว่าตัวช่วย การรับ custom font หรือ migration พัฒนาและออกใช้แล้ว.
คำขอเริ่มต้นเป็นงานเอกสาร; ต่อมาเจ้าของอนุญาตพัฒนาช่วง 0–3 ตามลำดับ.
ช่วง 1–3 เปลี่ยน candidates และตรวจในฐานแยกตามข้อ 8–10 ไม่อนุญาต release/deploy.
เป็น single-room inline; Work/Phase/Checklist/execution IDs
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
| คลังเดิม | family/release/face/asset IDs, checksum, license, แหล่งที่มา และน้ำหนักสามค่า | ใช้ข้อมูลเดิม ไม่สร้างคลังซ้ำ; sourceIdentity ปัจจุบันรับ google-fonts ส่วน custom ที่จะเพิ่มกำหนดในข้อ 7.4 |
| ชุดฐานเปรียบเทียบ | reference ID/version, Regular face/asset/hash ของ TH Sarabun New 1.35 | ตรึงไฟล์ ไม่ใช้ชื่อ family อย่างเดียว และไม่เปลี่ยนฐานเงียบ ๆ |
| ผลวัดของฟอนต์แต่ละรุ่น | Regular face/asset/hash, `unitsPerEm`, U+0E1A, ตำแหน่ง baseline และ top, ความสูงที่วัด, method version, tool version, เวลาและผลตรวจ/เหตุผลที่วัดไม่ได้ | ผูกกับ bytes จริง; ผลอนุพันธ์มีรุ่น ไม่แก้ทับผลที่ยืนยันไว้ |
| ค่าอนุพันธ์/แคช | อัตราความสูงและตัวคูณเทียบฐาน ถ้าจำเป็น | สร้างใหม่ได้จากผลวัด; ไม่เป็น authority แยกจาก hash/method |
| เอกสาร | font selection ที่ตรึงรุ่น, pt จริงที่ยืนยัน และ lineHeightPt | ไม่ต้องมี scale mode, reference size หรือ multiplier ที่ต้องตีความใหม่ตอน render |
| ผลเสนอจากตัวช่วย | selection เดิม/ใหม่, pt เดิม/ใหม่, profile IDs/hash/method, revision/fingerprint ของข้อมูลที่ใช้เสนอ | ใช้ยืนยันกับ candidate เดิม; รายละเอียด field/API ปิดในข้อ 7.5 ไม่ใช่ runtime contract ที่มีแล้ว |

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
แสดงผลประมาณ 10.92 ได้ แต่ค่าจริงบันทึก/ส่ง API ปัด half-up หกตำแหน่งตามข้อ 7
ไม่ปัดเป็นจำนวนเต็ม ไม่คำนวณจากตัวเลขแสดงผลซ้ำ.
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

- [x] ตรวจ `flowdoc-service/src/fonts/{types,inspection,repository,review,catalog}.ts`,
  `runtime/python/inspectFont.py`, CLI/routes และ Core `src/fonts/{types,selection}.ts`.
  ปิด owner ของ extractor/shared metrics และ arithmetic โดยไม่คัด renderer เข้าฝั่ง Service.
- [x] ปิด schema ผลวัด/proposal/error, precision/tolerance, stale confirmation และ legacy
  Sarabun mapping ที่ยืนยัน hash ได้; ระบุไฟล์ migration/test ใหม่ก่อนลงมือช่วงถัดไป.
- [x] ปิด custom sourceIdentity ของ TH Sarabun New: ผู้ดูแลเท่านั้น, ที่มา/ใบอนุญาตจริง,
  dedup, legacy google-fonts compatibility และกฎ immutable release เดิม.
- [x] ปิดวิธีแนบผลวัดให้รุ่นที่ออกใช้แล้วโดยไม่แก้สมาชิก/ไฟล์: ใช้ versioned derived
  record ที่ผูก digest เดิม; ยังไม่เปลี่ยนชุด immutable หรือบังคับออกฟอนต์ทุกรุ่นใหม่.
- [x] ตรวจรับสัญญา: ตัวอย่างรับ–ส่ง success/unavailable/stale/out-of-range ชัดเจน,
  ไม่เพิ่มข้อบังคับ profile ให้ ordinary pt/PDF; การพิสูจน์ runtime อยู่ช่วง 1–4.

### ช่วง 1 — วัดและจัดเก็บผล (Service ร่วม Core ตาม owner ที่ปิดในช่วง 0)

- [x] เพิ่ม extractor ในเส้นทาง inspection, typed profile/repository และ forward migration
  ใหม่; นำชุดฐานผ่านเครื่องมือผู้ดูแล ไม่เขียน DB/storage ตรงหรือแก้ migration เก่า.
- [x] ตรวจ fixture static TTF จริง: baseline/top/UPM, composite, missing บ, malformed
  font, hash mismatch, retry/idempotency และ method version; variable/OTF ยังปฏิเสธ.
- [x] ตรวจฐานใหม่และอัปเกรดฐานทดสอบ: ข้อมูลฟอนต์/draft เก่าครบ, restart อ่านกลับได้,
  ผลวัดผิดไม่ออกสถานะ verified และ custom intake ไม่เปิดสิทธิ์ผู้เขียน.
- [x] ตรวจรับ: ค่าตารางสำรวจคำนวณซ้ำได้จากไฟล์; reference/profile อ้าง hash จริง,
  ไม่กระทบ release เดิมและ ordinary font readiness.

### ช่วง 2 — สูตรและผลเสนอ (Core; Service transport ใช้ package export)

- [x] เพิ่ม pure calculation API, types และ focused tests ใน `src/fonts/`/`tests/fonts/`;
  รายละเอียดชื่อไฟล์และ signature ยึดช่วง 0. ไม่เพิ่ม font-size mode ลง template schema.
- [x] ทดสอบ same-font identity, TH16→Sarabun, คู่กลับและสลับซ้ำใน tolerance ที่กำหนด,
  UPM ต่างกัน, ขนาดทศนิยม, missing/invalid profile, non-finite และผลนอกช่วง.
- [x] ทดสอบ Regular/Bold/Italic ใช้สัดส่วนตระกูลเดียว ไม่สังเคราะห์ face ที่ขาด;
  missing target face ยังใช้กฎเดิม และไม่เปลี่ยนการวัด/ฝังของ ordinary pt.
- [x] ตรวจรับ: ไม่มีสูตรซ้ำใน clients; packed Core consumer คำนวณตรงผลทดสอบ.

### ช่วง 3 — เชื่อมตัวช่วยและการยืนยัน (Service + FlowDocMake)

- [x] Service เปิดข้อเสนอผ่าน API ตาม auth/catalog เดิม; FlowDocMake เพิ่มการขอเสนอ
  และยืนยันบันทึกผ่าน native draft tools. แก้คู่มือเดิมแบบสั้น ไม่ทำหน้า Editor ใหม่.
- [x] ตรวจ normal change คง pt, helper เป็น opt-in, ยกเลิกไม่เปลี่ยน draft,
  ยืนยันแก้ selection+pt พร้อมกัน, stale revision/selection ไม่เขียนบางส่วน.
- [x] ตรวจ unselected/missing profile, legacy mapping, unauthorized caller และ
  target retired ตามสิทธิ์เดิม รวมทั้ง read/clone เอกสารเดิม.
- [x] ตรวจรับ: save/open ใช้ pt ที่ยืนยัน, lineHeightPt ไม่เปลี่ยน,
  updated profile ไม่เปลี่ยน draft/PDF เอง, helper unavailable ไม่สร้าง readiness blocker ใหม่.

### ช่วง 4 — ตรวจร่วมใน PDF และเตรียมส่งมอบ

- [x] ใช้ static ความกว้างปกติของเจ็ดตระกูลที่มี: ฐาน TH, Sarabun, IBM Plex Sans Thai,
  Pridi และสามตระกูลใหม่. ทดสอบหลายขนาด เช่น 10/16/24 pt พร้อม face ที่มีจริง;
  Pridi/Noto ที่ไม่มี italic ต้องรายงานตามจริง ไม่ถือว่า PASS กรณีที่ไม่มี.
- [x] สร้างเอกสารทดสอบสั้น แยก same-pt และ height-adjusted; ไทย/อังกฤษ/ตัวเลข,
  สระบนล่าง/วรรณยุกต์, หลายบรรทัด, ช่องแคบ และตาราง. รักษาเอกสารเดิมด้วย draft ใหม่.
- [x] validate/save/open/preview ผ่าน consumer จริง; เก็บ PDF/path/hash/render ทุกหน้า,
  ตรวจข้อความครบ ฟอนต์ฝังตรง selection การใช้ pt และ lineHeightPt เดิม.
  ยอมให้ความกว้าง/จุดตัดบรรทัดต่าง แต่ห้ามข้อความหายหรือสระถูกตัดโดยไม่รายงาน.
- [x] ยืนยันนิยามการวัดตรงกันใน runtime; ไม่ตัดสินผ่านจากภาพหน้าจออย่างเดียว
  และไม่บังคับ bounding box ของทุกคำเท่ากันเพราะเทียบเฉพาะยอด บ.
- [x] ตรวจ ordinary pt/legacy Sarabun, profile absent, retired, default change และ
  save/reopen/clone regression ตามผลกระทบจริง. ทบทวนผลครบตามเกณฑ์ข้างต้น.
- [x] เตรียมเอกสาร/แพ็กเกจ/compatibility ตาม release rules ก่อนเสนอส่งมอบ;
  การวางแผนนี้ยังไม่อนุญาต tag/push/install/deploy.

## 6 ขอบเขตที่ยังไม่ทำและเงื่อนไขหยุด

ไม่แก้ style เส้น/กรอบ, auto-fit, automatic fallback, variable axes, optical-size,
หน้า admin/Editor ใหม่ หรือ helper schema2 bug ที่พบก่อนหน้า; ถ้าบั๊กนั้นบล็อก native
flow ที่จำเป็น ให้ระบุ dependency และแยกงานแก้ก่อน ไม่ข้าม guard หรือซ่อนผลล้มเหลว.
ใช้ ordinary pt เป็นทางเลือกเมื่อ helper ใช้ไม่ได้. อย่าขยายเป็นระบบ scale runtime
หรือย้าย pt เอกสารเดิมเพื่อให้ fixture ผ่าน.

สถานะล่าสุด: ช่วง 0–4 เสร็จตามขอบเขตข้อ 7–11; เป็น candidate ที่ตรวจแล้ว
ยังไม่รวม branch, ออก release/tag, push หรือติดตั้ง.
ผลสำรวจ Chromium และ numeric oracle ไม่ใช่การรับรอง runtime/PDF.

## 7 ผลช่วง 0 — สัญญาที่ปิดก่อนพัฒนา

### 7.1 ฐานตรวจและ ownership

ตรวจ discovery-only: Core 0.4.0 `e652a9e969b4fb53aec191929a5f72caa794acac`,
Service 0.4.0 `bfd5c293d70d4ff9e9149af1ae1c246db878219f` และ FlowDocMake
ใน Project Control. งานนี้แก้เอกสารฉบับเดิมเท่านั้น ไม่เปลี่ยน product/DB/คลังจริง.

| Source ที่ตรวจ | ข้อสรุป |
| --- | --- |
| Core `src/composition/validateResolvedDocument.ts` | pt/lineHeight ต้อง finite >0 ไม่มีเพดาน pt; คง validator เดิม ไม่เพิ่มช่วงสมมติ 1–72 หรือ 1–1000 |
| Service `runtime/python/inspectFont.py`, `src/fonts/inspection.ts` | ต่อ extractor เดิมใน Service; Core เป็นเจ้าของ method contract/สูตรและ public types ไม่เรียก Python/DB |
| Service `src/fonts/{types,service,client}.ts`, migration 016–018 | ปัจจุบันรับ google-fonts เท่านั้น; เพิ่ม custom branch และ forward migration ไม่แก้ migration เก่า |
| Service `src/fonts/{retention,catalog,legacy}.ts` | retired ใช้เฉพาะ tuple ที่ draft retained; legacy เป็น hash binding ไม่ใช่ชื่อหรือ default |
| Service `src/authoring/service.ts`, `src/errors.ts` | ยืนยันด้วย transaction/CAS/idempotency และ envelope เดิม ไม่บันทึก selection กับ pt สองครั้ง |
| FlowDocMake `scripts/server.mjs` | เพิ่ม thin client tools ที่นี่ ไม่ทำสูตรซ้ำหรือเปิดหน้า Editor ใหม่ |

### 7.2 วิธีวัดและ derived profiles

Method ID `thai-bo-baseline-top-v1`: ใช้ fontTools BoundsPen วัด U+0E1A จาก Unicode
cmap ของ Regular approvedWeight=400/style=normal. baseline=0 ใน design coordinates;
top เป็นขอบบนเส้นโค้งจริงหลังรวม composite/transform ไม่ใช่ control-point bbox,
font-wide bbox, advance หรือ ascender. วัด unhinted ไม่ใช้ raster/pixel rounding.
UPM integer 16–16384; top finite >0 และ glyph มี contour ไม่ใช่ .notdef.
คง parser timeout/size limits เดิม. ไม่มี metric ไม่ใช่ 0; malformed font ยัง reject
ตาม intake เดิม ไม่ใช้ helper unavailable ซ่อนไฟล์เสีย.

เพิ่ม `font_height_profiles` เป็น derived append-only table แยกจาก parsed_metadata,
faces และ release manifest: schemaVersion=1, id, releaseId/releaseManifestDigest,
regularFaceId/assetId/sha256, methodId/toolVersion, referenceCodePoint=3610,
unitsPerEm, baselineDesign='0', topDesign เป็น canonical decimal string,
outcome (`measured`/`unavailable`), reason, measuredAt และ profileDigest.
top ไม่บังคับเป็น integer; ใช้ decimal representation ของค่าจาก BoundsPen
โดย normalize exponent ไม่มีการปัดให้เป็น pixel. Core รับ trusted metric จาก Service
ไม่รับ hash/ratio ที่ผู้เขียนอ้างเอง.

profileDigest ใช้ canonical sorted-key JSON แบบ `src/fonts/repository.ts` ผูก
binding/hash/method/tool/ค่าผลวัด ไม่รวม id/measuredAt. retry ผลเดียวกัน reuse แถว;
ผล/tool/method เปลี่ยนสร้างแถวใหม่. เพิ่ม `font_height_profile_reviews` เป็น
append-only ยืนยัน/ถอนใช้งานพร้อม digest/reviewer/reason/time และ
`font_height_profile_assignments` เป็น current pointer ต่อ release/method พร้อม revision.
admin เปลี่ยน pointer ด้วย CAS/audit; ต้อง measured+reviewed และ digest ตรงจึงเสนอได้.
active/retired เดิมแนบผลได้โดยไม่แก้สมาชิก/manifest/สถานะฟอนต์; preparing เปลี่ยน
manifest แล้ว binding เก่าใช้ไม่ได้. การตรวจ geometry ไม่แทน lifecycle review เดิม.

reference record ตรึง TH Regular/hash ตามข้อ 4 และ method ID นี้; ใช้ตรวจ fixture
ไม่ใช่ default font. การคำนวณคู่ฟอนต์อื่นไม่ต้องโหลด TH เพราะใช้ r_source/r_target ตรง ๆ.

### 7.3 สูตรและการปัดเศษที่แน่นอน

Core เพิ่ม package-root export `calculateFontHeightAdjustment({fontSizePt,
sourceMetric,targetMetric})`; metric มี methodId, unitsPerEm, topDesign.
คืน `{ok:true,value:{fontSizePt,methodId}} | {ok:false,code}`.
Service resolve profile/face/สิทธิ์; Core คำนวณ pure function ไม่รับ filesystem path.

- ตรวจ input pt finite >0, metric ใช้ได้และ method ตรงกัน. ใช้ Regular ของรุ่นตระกูล
  เป็นสัดส่วนเดียวกับ Bold/Italic แต่ target face ต้องมีจริงตามกฎเดิม.
- แปลง JSON number เป็น shortest round-trip decimal; คำนวณ decimal/rational
  arithmetic กับ topDesign/UPM ไม่ปัด intermediate ratios.
- หาก r_source=r_target คืน pt เดิมทุกหลัก; มิฉะนั้น round-half-up ผลสุดท้าย
  6 ตำแหน่ง เช่น TH16→Sarabun = 10.921502 pt. ไม่ใช้ Math.round(raw*1e6)
  ที่อาจผิดจุดครึ่งจาก binary float. รูปแบบ decimal/exponent ต้องมี tests.
- บันทึก/ส่ง JSON number จริง ไม่เก็บข้อความ '10.92'. แสดงสั้น 2 ตำแหน่งได้
  แต่ค่าที่ให้ยืนยันต้องเรียกดูตัวเลขจริงได้. ห้ามคำนวณจากตัวเลขแสดงผลซ้ำ.
- ไม่มี clamp/auto-fit; ปัดเป็น 0, overflow หรือ conversion ไม่รักษาความแม่นยำ
  ให้ NUMERIC_RANGE. ไม่เพิ่มขอบบน pt ใหม่ให้ ordinary save/render.
- ความคลาดหลังปัดไม่เกิน 0.0000005 pt + `1e-12*max(1,abs(result))` สำหรับ
  representation error. รอบไป–กลับมีขอบเขต
  `0.0000005*(1+r_target/r_source)` + representation tolerance;
  ไม่อ้างว่าสลับหลายรอบไม่มี drift. ใช้ pt ที่บันทึกเป็นต้นทางครั้งใหม่.
- renderer ไม่รู้จัก helper method/profile และไม่คำนวณใหม่เมื่อ reopen/export;
  lineHeightPt คงเดิม ผลเสนอยังไม่รับรอง actual-input PDF/line fit.

### 7.4 Custom font และใบอนุญาต

เพิ่ม provider discriminator `google-fonts | custom` โดยคง Google shape/ความหมายเดิม.
custom family ใช้ `{provider:'custom',providerFamilyKey:'thsarabunnew'}` เพื่อ reuse
unique index ใน 016. key เป็น lowercase ASCII `[a-z0-9][a-z0-9_-]{0,99}`,
admin เท่านั้นกำหนด; ชื่อเหมือนกันคนละที่มาใช้คนละ key ไม่ merge จากชื่อเอง.

custom SourceEvidence คง clientKey/retrievedAt/metadataHash/fileHashBinding/
sourceWeight/licenseClientKeys; เพิ่ม provenance `{sourceName,sourceVersion,
obtainedFrom,rightsNote}` เป็นข้อความไม่ว่าง. locator เป็น HTTPS ที่มาจริงหรือ
`urn:flowdoc:custom:thsarabunnew`; ไม่เก็บ local path/credentials ใน public metadata
และไม่ fetch ตอน intake/render. custom metadataHash ต้องตรง SHA-256 canonical
provenance และ fileHashBinding ตรง bytes. Google metadataHash ยังใช้กฎเดิม.
sourceWeight ไม่ทราบใช้ null แล้วผ่าน conflictResolution/reviewer ก่อนออกใช้;
เก็บน้ำหนักสามค่า ไม่เดาจาก filename. ต้องตรวจ source provider/family key ของ evidence
ตรง family ตอน stage/edit ด้วย ไม่ให้ Google family รับ custom evidence สลับกัน.

TH สี่ face ผ่าน static inspector เดิมและมี name ID 13 ระบุ GPL พร้อม embedding
exception; โฟลเดอร์ที่ได้รับไม่มี license text แยก. ก่อน intake จริง admin ต้องแนบ
UTF-8 license จริง ถ้าถอดจาก name ID 13 ให้รักษาข้อความครบและบันทึก source hash
ใน rightsNote ไม่ใส่ OFL ของ Google แทน. ไม่อ้างว่าการพบ license text พิสูจน์สิทธิ์ทุกอย่าง.
dedup bytes ใช้ asset hash เดิมได้ แต่ sourceEvidence/license binding ไม่ถูกรวมทิ้ง.
custom ยังผ่าน preparing/review/approve/active ตามเดิม ไม่เปิด upload ให้ author.

### 7.5 Proposal, confirmation และ legacy

Endpoints ต่อไปนี้ปิดสัญญาในช่วง 0; ผล implementation candidate ของช่วง 3 ดูข้อ 10:

1. `POST /authoring/drafts/:id/font-height-adjustments` สำหรับ authenticated owner,
   body `{expectedRevision,styleId,targetFont,idempotencyKey}`. อ่าน sourceFont/pt/
   lineHeight จาก draft จริง ไม่รับ ratio/profile/pt ใหม่จาก caller.
2. สำเร็จ envelope `{ok:true,value,warnings:[]}`; value มี status='proposed',
   proposalId, expiresAt, expectedRevision, definitionFingerprint, styleId,
   sourceFont/targetFont, sourceFontSizePt/proposedFontSizePt, lineHeightPt,
   sourceProfileId/targetProfileId, methodId, precisionDecimals=6,
   layoutCheck='not_checked'. ตัวอย่างคู่ TH16→Sarabun ให้ proposedFontSizePt=10.921502.
3. เก็บ `font_height_adjustment_proposals` ผูก principal/template/revision/fingerprint/
   style/source/target/profile IDs+digests/result, createdAt และ TTL 15 นาที.
   idempotent retry คืน proposal เดิมไม่ยืดอายุ; propose ไม่เพิ่ม draft revision.
4. `POST /authoring/drafts/:id/font-height-adjustments/:proposalId/confirm`
   body `{expectedRevision,idempotencyKey}` เท่านั้น. ตรวจ principal, TTL,
   revision/fingerprint/source, profile review/assignment/digest และ target permission
   อีกครั้งใน transaction เดียว; เปลี่ยนเฉพาะ style.font และ style.fontSize.value.
   lineHeightPt และส่วนอื่นต้องเท่าเดิม. ไม่เรียก public save นอก transaction;
   ใช้ shared write/reference/audit path และ release lock ร่วม lifecycle/retention.
5. active target หรือ exact tuple ที่ draft retained เท่านั้น; ไม่ให้ retired เพิ่มสิทธิ์
   เพราะ family เดียวกัน. source ที่ใช้ไม่ได้ไม่เสนอ. confirm คืน draft result แบบ save
   พร้อม proposalId/appliedFontSizePt. receipt retry key เดิมคืนผลเดิมก่อนตรวจ TTL/stale
   แต่หลังตรวจ owner โดยไม่เพิ่ม revision; key เดิมต่าง payload เป็น IDEMPOTENCY_CONFLICT.
6. ยกเลิกคือไม่ confirm ไม่มี draft write. Shared style เปลี่ยนทุก node ที่อ้าง styleId
   นั้นตาม semantics เดิม; ไม่ clone style หรือเปลี่ยนเฉพาะ node โดยเงียบ ๆ.
7. schema1 helper unavailable: LEGACY_STYLE_UNSUPPORTED เพราะไม่มี library selection;
   ordinary pt/preview/clone เดิมยังใช้ได้. ห้ามเปลี่ยน schema ทั้งเอกสารอัตโนมัติ.
   hash mapping ใน legacy.ts ใช้รักษา ordinary legacy เท่านั้นไม่ใช่สิทธิ์ migrate.

FlowDocMake เพิ่ม `propose_font_height_adjustment`/`confirm_font_height_adjustment`
ใน scripts/server.mjs เป็น thin clients; แสดง actual pt และ layout-not-checked,
ยืนยันเฉพาะเมื่อผู้ใช้เลือกใช้. preview ต่อด้วย native schema2 tools ที่รองรับ;
ถ้า schema2 helper bug เดิมบล็อก delivery จริงให้แยกแก้ dependency ไม่ bypass guard.

### 7.6 กรณีใช้ไม่ได้และตัวอย่างรับ–ส่ง

| กรณี | ผลสัญญา | ผลต่อเอกสาร |
| --- | --- | --- |
| ไม่มี profile/ยังไม่ review/ไม่มี บ หรือ Regular/method ต่าง | ok:true; status='unavailable'; reason PROFILE_MISSING / PROFILE_UNREVIEWED / GLYPH_MISSING / REGULAR_MISSING / METHOD_UNSUPPORTED | ไม่มี proposalId/pt ใหม่; ใช้ pt ปกติได้ถ้าผ่านกฎเดิม |
| schema1 หรือ source unselected | unavailable; LEGACY_STYLE_UNSUPPORTED / FONT_NOT_SELECTED | ไม่ migrate/default; unselected ยังติดกฎ PDF เดิม |
| profile binding ผิด/ไฟล์อ่านไม่ได้ | unavailable; PROFILE_BINDING_INVALID / RESOURCE_UNAVAILABLE | ไม่เดา; asset เสียยังมี readiness issue ตามเดิม |
| ปัดเป็น 0/overflow/precision ใช้ไม่ได้ | unavailable; NUMERIC_RANGE | ไม่ clamp/ไม่เขียน draft |
| request/field/styleId/pt ต้นทางผิด | ok:false INVALID_FONT_INPUT; HTTP 422 | ไม่เขียนบางส่วน |
| ไม่ใช่ owner หรือไม่พบ draft/proposal | ok:false NOT_FOUND; HTTP 404 | ไม่เปิดเผยข้อมูลของคนอื่น |
| target ไม่ active/ไม่ retained/ไม่มี face | ok:false FONT_TARGET_UNAVAILABLE; HTTP 422 | ไม่ให้ helper เพิ่มสิทธิ์หรือสร้าง selection ที่ใช้ไม่ได้ |
| หมดอายุ หรือ profile/assignment/review เปลี่ยน | ok:false FONT_HEIGHT_PROPOSAL_EXPIRED / FONT_HEIGHT_PROFILE_CHANGED; HTTP 409 | ขอเสนอใหม่ |
| revision/fingerprint/source เปลี่ยน | ok:false STALE_CURRENT; HTTP 409 | โหลดใหม่และขอเสนอใหม่ |
| DB/Service ใช้ไม่ได้ | ok:false UNAVAILABLE; HTTP 503 | retry ไม่สร้าง receipt สำเร็จปลอม |

ตัวอย่าง unavailable:
`{ok:true,value:{status:'unavailable',reason:'PROFILE_MISSING'},warnings:[]}`.
ตัวอย่าง stale: `{ok:false,issues:[{code:'STALE_CURRENT',path:'expectedRevision',
message:'Reload draft and request a new font height proposal'}],warnings:[]}`.
ใช้ safe messages ไม่เปิดพาธไฟล์/DB. ไม่มี helper profile ไม่เพิ่ม font-readiness blocker
ใหม่; actual_input glyph/layout และฟอนต์หายยังใช้กฎเดิมหลังยืนยัน.

### 7.7 ไฟล์เป้าหมายและเกณฑ์รับงานถัดไป

| ช่วง | ไฟล์เพิ่ม/เปลี่ยนที่กำหนด ณ ปิดช่วง 0 (ผลล่าสุดดูข้อ 8) | จุดตรวจ |
| --- | --- | --- |
| 1 | Service runtime/python/inspectFont.py, src/fonts/{types,inspection,service,client}.ts; ใหม่ src/fonts/heightProfiles.ts และ migrations/019_font_height_profiles.sql ถ้าเลขยังว่าง; tests/fonts-height-profiles.test.mjs และขยาย intake/repository tests | custom/Google compatibility, license/hash/dedup/admin, missing metric ไม่ reject valid font, profile CAS/immutability/restart และ schema ใหม่บนฐานเก่า |
| 2 | Core ใหม่ src/fonts/heightAdjustment.ts, types และ src/index.ts export; tests/fonts/heightAdjustment.test.ts; Service packed dependency ที่ pin ใหม่ | decimal/exponent/half-up, identity, UPM ต่าง, numeric range, roundtrip bound และ packed consumer ไม่เปลี่ยน renderer |
| 3 | Service ใหม่ src/fonts/heightProposals.ts, migration ถัดไปสำหรับ proposals; src/authoring/service.ts, src/http/authoring.ts และ src/http/fonts-authoring.ts สำหรับ profile availability; FlowDocMake scripts/server.mjs; tests/fonts-height-proposals.test.mjs และ FlowDocMake focused tests | real DB auth/CAS/receipt/TTL/retired/race, shared style และ lineHeight unchanged, native MCP; legacy unavailable ไม่ปิด ordinary route |
| 4 | fixture/check scripts ของ owners และผลตรวจ PDF สั้น | เจ็ดตระกูล custom จริง default/retired/legacy regression และตรวจทุกหน้า ไม่เรียก Chromium ว่า PDF PASS |

ผลตรวจ discovery: `C:/Users/nekot/Documents/Codex/2026-10-16/font-size-comparison/stage0-contract-check.json`
ผ่าน 44 checks: สูตร/half-up/exponent/overflow/invalid inputs/roundtrip, geometry เจ็ด Regular,
reference checksum และรัน Service inspector เดิมกับ TH สี่ face.
นี่ไม่ใช่ tests ของ API/profile/migration ที่ยังไม่มี. ขอบเขตพิสูจน์ช่วง 0 คือ source
inspection + numeric oracle + document checks ไม่ใช่ integration/production readiness.
ตรวจลิงก์/Authority Boundary/coverage ในเอกสาร, `git diff --check` และ
`npm run check:data` ผ่าน; ไม่เพิ่ม mandatory AI reading หรือ canonical data records.
ไม่มี unresolved contract blocker ของช่วง 0; ก่อน intake ช่วง 1 ยังต้องเตรียม custom
provenance/license จริง และก่อน implementation ตรวจเลข migration/base อีกครั้ง.

## 8 ผลช่วง 1 — วัด เก็บ และตรวจรับ custom font

Service candidate commit `5280079b7ea29cd3ba24bd9006fe6e271b0e138b` อยู่ branch
`codex/font-height-stage1` ที่
`C:/Users/nekot/Documents/Codex/worktrees/font-height-stage1/flowdoc-service`.
ฐาน release 0.4.0 เดิมยังแยกจาก candidate; ไม่อ้างว่าติดตั้งหรือออกใช้แล้ว.
Owner: Service; role Product Implementation Agent ร่วม Evidence Reviewer ของขอบเขตนี้.
ไม่มี execution IDs/dispatch room จำลอง; ใช้คำขอเจ้าของและแผนฉบับนี้เป็น authority.

| ผลที่ได้ | หลักฐานใน Service candidate |
| --- | --- |
| วัด U+0E1A จาก outline จริง รวม quadratic extrema/composite และ missing glyph | runtime/python/inspectFont.py, src/fonts/inspection.ts; tests/fonts-height-profiles.test.mjs |
| derived profile/hash/method/tool/time, review/revoke append-only, assignment CAS/audit | migrations/019_font_height_profiles.sql, src/fonts/heightProfiles.ts; profiles tests |
| custom provenance/license/hash/dedup และ source identity แยก Google | src/fonts/provenance.ts, service.ts, types.ts; profiles/supplied/intake/repository tests |
| admin-only measure/show/approve/revoke/assign ทั้ง HTTP และ CLI client | src/http/fonts-admin.ts, src/fonts/client.ts; route/CLI integration ใน profiles tests และ fonts-admin.test.mjs |
| รักษา ordinary metadata ที่มีผลต่อ legacy review/re-activation | inspectFont เรียก includeHeightMetric:true เฉพาะตอนวัด; default inspection shape เดิมไม่เปลี่ยน; lifecycle/pipeline tests |
| upgrade 015/018, replay checksum, draft/fingerprint/asset/release เดิมครบ | fonts-repository.test.mjs และ profiles tests; migration 001–018 ไม่แก้ |
| อ่านกลับหลัง DB และ process restart จริง | tests/checkFontHeightPersisted.mjs seed/verify ใน container แยกหลัง restart PostgreSQL ของชุดทดสอบ |

รายละเอียดที่ตัดสินระหว่างลงมือเพื่อรักษาสัญญา:

- custom SourceEvidence เพิ่ม providerFamilyKey แบบบังคับ เพื่อผูก family ได้แม้ locator
  เป็น HTTPS; Google input shape เดิมไม่เปลี่ยน. key ต้องตรง family ก่อน stage/edit.
- ไม่เพิ่ม heightMetric เข้า immutable asset metadata ปกติ เพราะ runReview เทียบ metadata
  ทั้งชุด. วัดเป็น opt-in แล้วเก็บผลแยก เพื่อไม่ทำให้ asset เก่า review ซ้ำไม่ผ่าน.
- regularFaceId เป็น historical UUID ไม่ใช้ FK ที่ SET NULL ตอน preparing edit
  เพราะจะเปลี่ยน append-only profile; profile เก่าคงครบและปฏิเสธ stale binding.
- profile unavailable อาจไม่มี regular face/asset/UPM; outcome/reason ชัดและ approve ไม่ได้.
- referenceId ที่เก็บผูกกับ TH Regular checksum ที่ตรึง ไม่ match จากชื่อ/version อย่างเดียว.
- migration 019 ใช้ LF ให้ bytes ตรง Git attributes/checksum; ไม่เปลี่ยน migration เก่า.

ฟอนต์จริงที่ตรวจ: TH Sarabun New 1.35 custom สี่ face และ Google Regular
Sarabun, IBM Plex Sans Thai, Pridi, Noto Sans Thai Looped, Noto Serif Thai, Prompt.
ค่า top/UPM=1000 ที่อ่านได้ตามลำดับ: TH=400, Sarabun=586, IBM=546, Pridi=544,
Noto Sans Looped=562, Noto Serif=554, Prompt=535. นำเข้าผ่าน API ภายในฐานทดสอบ
พร้อม provenance/license (TH ใช้ข้อความ name ID 13 จริง) ไม่ใช่นำเข้าคลังผู้ใช้.

การตรวจ: build, verifyVendor, Linux focused suite 13 files/52 tests และ restart
seed/verify ผ่าน. ครอบคลุม active/retired, สิทธิ์ writer/unknown/disabled admin,
atomic/idempotent/CAS, custom source/weight conflict, geometry และข้อมูลเดิม.
ผู้ตรวจอิสระพบ P2 เรื่องพาธใน provenance; เพิ่ม reproducer ที่ล้มเหลวแล้วแก้
ให้ปฏิเสธ absolute Unix/embedded Windows paths และ credential URLs; suite หลังแก้ผ่าน.
หลักฐานท้องถิ่นอยู่ `artifacts/font-height-stage1/` ใน worktree และสำเนา
`C:/Users/nekot/Documents/Codex/2026-10-16/font-height-stage1/`.
เพิ่มคำสั่งเฉพาะส่วนใน Service docs/usage.md 8.1 ไม่เพิ่ม mandatory reading ของ AI.

ข้อจำกัดที่คงไว้: ยังไม่มีสูตรเปลี่ยน pt/Core export ของช่วง 2, proposal/confirm ของ
ช่วง 3, หน้า UI, auto fallback หรือ release/install. ผล 52 tests รวม regression
การสร้าง PDF เดิม ไม่ใช่การรับรอง PDF หลังปรับขนาดซึ่งยังไม่มีในช่วงนี้.
ขั้นต่อไป: ช่วง 2 pure calculation API ตามข้อ 7.3 และ packed consumer.

## 9 ผลช่วง 2 — สูตรใน Core และ packed Service consumer

Owner: Core และ Service consumer; role Product Implementation Agent / Evidence Reviewer.
ใช้คำขอเจ้าของและแผนฉบับนี้เป็น authority แบบ inline; execution IDs ไม่เกี่ยวข้อง.
Core commit `b8abb8d405b5711f364ec2ac22baea7d7669a453`; Service commit
`553ee00` บน branch `codex/font-height-stage2` ใน worktree ของแต่ละ repository ที่
`C:/Users/nekot/Documents/Codex/worktrees/font-height-stage2/`.
ไม่แก้ branch หลัก/release, ไม่ tag/push/install และไม่เปลี่ยนคลังหรือฐานข้อมูลจริง.

- Core เพิ่ม src/fonts/heightAdjustment.ts และ root exports ของ function, method constant
  และ types ตามข้อ 7.3. คำนวณด้วย BigInt rational จาก decimal/exponent; ปัด half-up
  หกตำแหน่งเฉพาะผลสุดท้าย. สัดส่วนเท่ากันคืน pt เดิมทุกหลัก รวม MIN/MAX.
- input/metric/method ผิดหรือผลปัดเป็นศูนย์/overflow/แทนค่าไม่ได้ คืน error ตามสัญญา;
  ไม่ clamp, lookup, เปลี่ยน selection, lineHeight หรือ renderer และไม่ mutate input.
- สูตรใช้ profile Regular ของตระกูล ไม่มี weight/style ใน input จึงใช้สัดส่วนเดียวกับ
  Regular/Bold/Italic. Core selection/legacy regression ตรวจ exact face และปฏิเสธ face
  ที่ขาด; ไม่มี synthetic bold/italic หรือการใช้ helper เพิ่มสิทธิ์เลือก face.
- Service ตรึง tarball Core `0.4.1-dev.font-height.1` ใน vendor/package-lock/manifest;
  production heightProfiles ใช้ method constant จาก package root. ไม่มีสูตรซ้ำใน Service.
  vendor SHA256 `26b1dcae3ed34bd60db2cbe1f088d06ce2ad1309941657c029ac47844ca231c4`.
- tests/fonts-height-supplied.test.mjs นำเข้าฟอนต์จริงผ่านคลังทดสอบ วัด/approve/assign
  แล้วส่ง metric เข้า API จากแพ็กเกจจริง: TH16→TH16, Sarabun10.921502,
  IBM11.721612, Pridi11.764706, Noto Sans Looped11.3879, Noto Serif11.552347,
  Prompt11.962617 pt. TH custom มีสี่ face; release manifest ไม่เปลี่ยนจากการผูก profile.

หลักฐาน: Core official Docker packaging ผ่าน build, 69 files/604 tests, native build,
resources และ native session check. ชุดสูตรมี 60 cases พร้อม roundtrip 245 คู่/ขนาด;
focused calculation/selection/legacy ผ่าน 67 tests. Service build, verifyVendor,
root runtime consumer และ TypeScript consumer ของ .d.ts จาก tarball ผ่าน.
Linux Service ชุด 14 files/53 tests ผ่านด้วยการ reuse 13 files ที่ไม่เปลี่ยนและ
pipeline recheck 3 tests หลังแก้ expected renderer version จาก 0.4.0 เป็นรุ่นที่ตรึง.
รอบแรก 52 ผ่าน/1 ไม่ผ่านเฉพาะ expected version นี้; ไม่ใช่การเปลี่ยน renderer logic.
ครอบคลุม custom/admin/profile, active/retired/default, draft readiness, migration
ข้อมูลเดิม, pinned job และ PDF/legacy regression เดิม. ไม่อ้างเป็น PDF ที่ปรับ pt แล้ว.
ผู้ตรวจอิสระไม่พบประเด็นสำคัญ; numeric edge probes เพิ่มอีกเจ็ดกรณีผ่าน.

หลักฐานถาวรท้องถิ่น: `C:/Users/nekot/Documents/Codex/2026-10-16/font-height-stage2/`
มี result.json, package build log, Service logs, typed consumer และ tarball/hash.
ลบเฉพาะ container ฐานทดสอบของรอบนี้; worktree ยังมีงานที่ไม่ได้รวมจึงเก็บไว้.
แก้คู่มือเดิมของ owners แบบสั้น ไม่เพิ่ม mandatory AI reading.

ข้อจำกัดที่คงไว้: ยังไม่มี proposal/confirm, เครื่องมือ FlowDocMake หรือ PDF หลังปรับ pt;
สิทธิ์/profile availability ระดับ draft จะตรวจในช่วง 3 ตามข้อ 7.5–7.6.
ขั้นต่อไปคือช่วง 3 ไม่ใช่ release/install. ข้อ 8 เป็นผลช่วง 1 ในเวลานั้นและคงไว้เป็นประวัติ.

## 10 ผลช่วง 3 — ข้อเสนอและการยืนยันผ่าน Service / FlowDocMake

คำขอเจ้าของเป็น authority ของ single-room inline implementation; execution IDs
ไม่เกี่ยวข้อง. Owner: Service สำหรับข้อมูล/สิทธิ์/transaction; Project Control สำหรับ
FlowDocMake และบันทึกร่วม. Role: Product Implementation Agent / Evidence Reviewer.
Scope/risk: medium / routine; proof budget เป็น focused PostgreSQL/native MCP กับ
regression ส่วนที่เปลี่ยนและได้รับผล. ใช้ Core package ของช่วง 2 เดิม ไม่มีสูตรใน clients.

Candidates บน branch `codex/font-height-stage3`:

- Service `d66463eda69ad8d7e67cda8e61157166da0a16e6` รุ่น `0.4.1-dev.font-height.1`;
  reuse worktree แยกเดิมที่ `C:/Users/nekot/Documents/Codex/worktrees/font-height-stage2/flowdoc-service`.
  ชื่อโฟลเดอร์เดิมไม่ใช่สถานะช่วงงาน; branch/commit ข้างต้นคือตัวช่วง 3.
- FlowDocMake `6896acf1f14595ef2a5773b953d2a373473145b4` รุ่น `0.2.2-dev.font-height.1`
  ที่ `C:/Users/nekot/.codex/worktrees/font-height-stage3/flowdoc-project-control`.
  Canonical API guide commit `d93999e`; copied references สร้างด้วย builder เดิม,
  snapshot ครบ 24 hashes. ไม่เปลี่ยน source ใน installed plugin cache.

ผลพัฒนาและจุดพิสูจน์:

| พฤติกรรม | Implementation / evidence |
| --- | --- |
| propose อ่าน pt/font/profile จาก draft จริง ไม่เขียน draft | src/fonts/heightProposals.ts; tests/fonts-height-proposals.test.mjs |
| เก็บข้อเสนอ/revision/fingerprint/bindings/TTL 15 นาที | migrations/020_font_height_proposals.sql; ไม่มีการแก้ migrations 001–019 |
| confirm เปลี่ยน font+pt พร้อมกัน คง lineHeight/ส่วนอื่น | shared writeDraft ใน authoring/service.ts → writeCurrent/reference/audit ใน transaction เดียวกับ receipt |
| owner-only HTTP, safe unavailable/404/409/422/503 | http/authoring.ts; authenticated HTTP test และ closed-DB test |
| stale, expiry หลังรอ lock, retry/concurrent confirm, review revoke/reapprove และ assignment revision | proposal tests; release locks ลำดับเดียวกับ retention/lifecycle; receipt ตรวจ owner ก่อน replay และไม่เพิ่ม revision ซ้ำ |
| active หรือ exact retained retired tuple เท่านั้น | propose/confirm/clone tests; ไม่มีสิทธิ์เพิ่มจาก family/JSON หรือ face ที่ขาด |
| schema1 Sarabun ใช้ ordinary save/open/clone/preview เดิม | helper คืน LEGACY_STYLE_UNSUPPORTED ไม่ migrate; authoring/pipeline/legacy regression |
| catalog แสดง review เบื้องต้น แยก availability จริง | fonts/catalog.ts heightProfile; propose ตรวจ binding และไฟล์ซ้ำ ไม่ใช้ catalog เป็น grant |
| native MCP ใช้ Service จริง | plugin font-height-tools.mjs; stdio → authenticated HTTP → PostgreSQL ใน proposal test ไม่ใช่ mock-only |
| tool schema ไม่รับ pt/profile override; explicit user choice ก่อน confirm | strict native MCP transport test + descriptions; call_tool_file allowlist รองรับทั้งสอง tools |

การตรวจสุดท้าย: Service Docker build และ vendor checksum ผ่าน;
Linux affected suite **20 files / 86 tests ผ่าน ไม่มี skip** รวมฟอนต์จริงเจ็ดตระกูล,
custom intake/admin, profile, 015/018 upgrade/replay, readiness, default/retired,
shared write adapter/diff, pinned job/PDF และ authoring tools.
คู่ Sarabun16→Pridi ได้ 17.235294 pt; save/open คงค่าใหม่และส่วนอื่นตรงเดิมทั้งหมด.
FlowDocMake **19 tests ผ่าน ไม่มี skip**: native stdio strict schema/transport,
exact candidate compatibility, snapshot, workflow/coverage/representatives/task regression.
check:data, git diff --check และ snapshot hash check ผ่าน.

รอบแรก migration regression ไม่ผ่านสองจุดเพราะ expected list ยังจบที่ 019;
เพิ่ม 020 ในค่าคาดหวังและตรวจตารางข้อเสนอเริ่มว่าง ข้อมูลเดิมยังเท่าเดิม.
ผู้ตรวจอิสระพบ P2 หนึ่งข้อ: ผลวัดที่ยังไม่ assigned ถูกยุบเป็น PROFILE_MISSING.
เพิ่มสอง reproducer ที่ล้มเหลว แล้วแก้ให้เลือก diagnostic จาก profile ของ manifest/method
ปัจจุบันเท่านั้น; คืน PROFILE_UNREVIEWED/GLYPH_MISSING ตามจริง และไม่ใช้ metric ที่ยังไม่ผูก.
full affected suite หลังแก้ผ่านตามข้างต้น. ไม่มี deferred minors หรือประเด็นที่ผู้ตรวจเว้นวินิจฉัย.

การตัดสิน implementation: ใช้ candidate version เพื่อแยกจากของติดตั้ง (จับคู่ผิดให้
preflight ปฏิเสธ), template_id ของ 020 ใช้ text ตาม PK จริง (ไม่เปลี่ยน identity/schema เดิม),
fixture ใช้ isAbsolute เพื่อรองรับ temp paths Windows (ไม่มีผลต่อ runtime product).
ไม่เปลี่ยน contract/ขอบเขตจากข้อ 7. คู่มือเพิ่มเฉพาะ API/usage เดิมและแก้ metadata รุ่น;
ไม่มีเอกสารอ่านบังคับเพิ่มหรือการอ้างว่า skill instruction พิสูจน์พฤติกรรม AI ในอนาคต.

หลักฐานท้องถิ่นถาวร: `C:/Users/nekot/Documents/Codex/2026-10-16/font-height-stage3/`
มี result.json, Service build/RED/GREEN logs, plugin logs และ ledger.
ลบเฉพาะ container/volume ฐานทดสอบรอบนี้; เก็บ worktrees/branches ที่ยังไม่รวม.
ผลนี้เป็น candidate ที่ตรวจแล้ว ไม่ใช่ release/tag/push/install หรือการเปลี่ยนฐาน/คลังจริง.
ข้อ 8–9 คงผลตามเวลาเดิม. ขั้นต่อไปคือช่วง 4 ตรวจ PDF หลังปรับ pt ทุกหน้าและเตรียมส่งมอบ;
ผล PDF regression เดิมในช่วงนี้ไม่ใช่ visual acceptance ของเอกสารหลังปรับความสูง.

## 11 ผลช่วง 4 — ตรวจ PDF ทุกหน้าและเตรียมชุดส่งมอบ

Authority คือคำขอเจ้าของและแผนช่วง 4 แบบ single-room inline; execution IDs
ไม่เกี่ยวข้อง. Owners: Service สำหรับ fixtures/checkers และคู่มือ; Project Control
สำหรับบันทึกและ FlowDocMake. Role Product Implementation Agent / Evidence Reviewer.
Scope/risk medium / routine. ไม่เปลี่ยน product runtime; ใช้แผนและ README/usage เดิม
ไม่เพิ่ม mandatory AI reading. Branch candidates คือ `codex/font-height-stage4`.

Service commit `216960acef2ddda693d6df882d0fa7329b5c8f2b` ใน worktree เดิมของช่วง 2.
Core คง `b8abb8d405b5711f364ec2ac22baea7d7669a453` กับ vendor SHA256
`26b1dcae3ed34bd60db2cbe1f088d06ce2ad1309941657c029ac47844ca231c4`.
FlowDocMake code คง `6896acf1f14595ef2a5773b953d2a373473145b4`;
source archive จาก Project Control `b83d0259e927bba3d9644464fc00cce24c2917db`.
Candidate versions: Service/Core `0.4.1-dev.font-height.1`, FlowDocMake
`0.2.2-dev.font-height.1`. ไม่แก้ installed cache หรือคลัง/เอกสารจริง.

| เกณฑ์ | ผลและหลักฐาน |
| --- | --- |
| เจ็ดตระกูล / 20 faces จริง | TH Sarabun New 1.35 custom, Sarabun, IBM Plex Sans Thai, Pridi, Noto Sans Thai Looped, Noto Serif Thai, Prompt; admin API intake/review/profile ในฐานแยก |
| review ก่อน activate | 21 review PDFs / 21 หน้า รวม Sarabun default รุ่นสอง; render และตรวจภาพทุกหน้าก่อน approve/activate |
| same-pt / adjusted | native MCP → Service → PDF; เจ็ด specimen สองหน้าต่อตระกูล ที่ 10/16/24 pt พร้อม face จริง ไทย/อังกฤษ/เลข สระบนล่าง วรรณยุกต์ หลายบรรทัด ช่องแคบและ native table |
| ข้อความ/face/pt/geometry | checkFontHeightPdf.py ตรวจทุก text span และ embedded subset outlines เทียบ source hash; Regular บ baseline-to-top ตรงฐาน 21 กรณี ภายใน 0.00001 pt; lineHeight และ definition ส่วนอื่นไม่เปลี่ยน |
| visual ทุกหน้า | 14 author PDFs / 25 หน้า รวม regression; รวม review เป็น 35 PDFs / 46 หน้า ผ่านภาพและ automated checks ไม่มีข้อความหาย สระตัด กล่องแทนอักษร หรือ overflow ที่พบ |
| default change | draft เดิมคง definition/fingerprint และ PDF byte-identical; default ใหม่เลือกได้ รุ่นไม่มี profile ใช้ ordinary pt/PDF ได้ helper คืน PROFILE_MISSING |
| retired | เอกสาร/สำเนาคง exact tuple และ PDF byte-identical; helper ใช้ retained rights เดิม ขณะที่ fresh JSON ถูก readiness/helper ปฏิเสธ |
| Sarabun เดิม | schema1 save/open/clone/preview คงเดิม PDF สำเนา byte-identical; helper คืน LEGACY_STYLE_UNSUPPORTED |
| backup/restore | DB/files คืนสู่ฐานใหม่ ตรวจ 11 drafts / 14 PDF bindings และ profile/receipt; confirm replay ไม่เพิ่ม revision, propose ใหม่ได้, preview byte-identical; migration replay applied[] |
| runtime จริง | restore/preview ผ่าน production target ไม่มี dev dependencies; image sha256:776d970ffe749fa1f83f1ce033731e1688f1c398fcbfc907137fe2c0f4dfd0f4 |

Checks ใหม่: guard suite 4/4, FlowDocMake focused 6/6 ไม่มี skip, node syntax,
vendor pin และ diff checks ผ่าน. Reuse Service ช่วง 3 จำนวน 86 tests โดยตรวจ identity
ของ src/package/lock/vendor/runtime/migrations/Dockerfile ที่ไม่เปลี่ยน;
ไม่อ้างว่ารัน 86 tests ใหม่. Project Control check:data ผ่านหลังบันทึกผล.

ผู้ตรวจอิสระพบ P2 สองข้อ แก้ด้วย reproducer RED → GREEN: prepare/activate ต้องผ่าน
Docker-backed native preflight ก่อน admin action เพื่อปฏิเสธ URL ที่ไม่ตรง container;
และ README ต้องตรง Core tarball/image/migration 020 ปัจจุบัน. ไม่มี deferred minors.
ผู้ตรวจเว้นวินิจฉัย final commit-bound bundle ให้ผู้ทำตรวจ และ production release/install
อยู่นอกขอบเขต. Fixture แรกใช้ Area18 shape ผิด และ glob checker นับ clone ซ้ำ;
แก้เฉพาะ verification input/checker เก็บ failure logs ไม่ผ่อนเกณฑ์หรือเปลี่ยน runtime.

หลักฐานถาวร: `C:/Users/nekot/Documents/Codex/2026-10-16/font-height-stage4/`
มี state/receipts, PDF hashes, renders ทุกหน้า, pdf-verification.json,
specimen-visual.json, review-visual.json, restore proof และ scoped logs.
`flowdoc-font-height-candidate.zip` รวม Service/FlowDocMake source archives,
Core tarball, PDF หลักฐาน, original license texts เจ็ดตระกูล และ font inventory.
delivery.json ตรึง commits/versions/checksums; delivery-check.json ตรวจ Git objects
และ raw migration bytes; delivery-archive.json เก็บ SHA256 ของ bundle.
ชุดส่งมอบ 6,832,907 bytes; SHA256
`789fe7c0b8d9fe96c676c57d68331f19d4318c1a1f23b7007111fb1fa41166f2`.
ตรวจ 71 files ใน manifest ผ่าน. ไม่รวม token/config, DB dump หรือ full font source files
ในชุดแจกจ่าย; backup ฐานทดสอบเก็บแยก ไม่ใช่ backup ข้อมูลผู้ใช้จริง.

ข้อจำกัดตามสัญญา: เทียบยอด บ เท่านั้น ความกว้าง/การตัดบรรทัด/สระต่างได้.
IBM, Pridi และ Noto ทั้งสองตระกูลไม่มี italic ที่ส่งมา จึงตรวจการปฏิเสธทั้งสี่กรณี
ไม่สร้าง synthetic face. ordinary pt ยังคงเป็นหลัก ไม่มี auto-fit/fallback.
ลบเฉพาะสี่ container ทดสอบช่วงนี้ เก็บ branches/worktrees ที่ยังไม่รวม.
ผลเป็น development candidate ที่ตรวจแล้ว ไม่ใช่การรวม branch หรือ release/tag/push/install.
ขั้นถัดไปต้องมีคำสั่งแยกสำหรับการรวมงานและออก release ตามกฎเดิม.
