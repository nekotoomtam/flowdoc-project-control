# FlowDoc Export — ร่างรอบพัฒนาต่อจาก 0.1.0

## Authority Boundary

Owner: FlowDoc Project Control. Status: DRAFT for owner discussion, 2026-10-08.
This is the shared scope proposal for the next local export releases, not an
implementation plan, approved API/schema, Evidence or readiness claim. It does
not reopen the completed MVP or authorize product implementation by itself.
Baseline: [Export MVP and local 0.1.0 release](flowdoc-export-mvp-v1-2026-10-07.md).

Active role: Planning Partner / Documentation Synthesizer. Bounded inline task:
draft this document only; execution IDs N/A. Proof budget: compare owner decisions,
baseline and dependency order, review links and diff. Document budget: this draft
and one locator in the existing MVP document. No product, DB, map or release edits.

## เป้าหมายและข้อตกลงที่ยืนยันแล้ว

ต่อยอดระบบรับโครงเอกสารและข้อมูลผ่าน API แล้วออก PDF โดยยังไม่มีหน้าบ้าน
ฐานที่ผ่านคือ Core 0.1.0 และ Service 0.1.0 บน release/tag ของแต่ละ repo
งานรอบใหม่ที่เจ้าของต้องการมีรูปภาพ ขั้นเตรียมทรัพยากร ตารางรวมเซลล์
ตัวแปรลิงก์ที่แสดงเป็นข้อความกดได้ และสารบัญ

- ใช้เลข Service เป็นชื่อรุ่นส่งมอบหลัก: 0.1.1 → 0.1.2 → …
- หนึ่งหัวข้อหรือชุดย่อยที่ผ่านและพร้อมใช้ จึงส่งมอบหนึ่งรุ่น ไม่ใช่หนึ่ง commit
- Core มีเลขรุ่นอิสระ เพิ่มเมื่อเปลี่ยน และ Service ตรึงแพ็กเกจ/checksum ที่ใช้
- ทำงานบน branch พัฒนา; release รับเฉพาะชุดที่ผ่านพร้อม annotated tag
  ไม่แก้ทับรุ่นเดิมและไม่รวมงานที่ยังไม่ผ่านเข้าไปโดยอัตโนมัติ
- ไม่รอรวมทุกหัวข้อเพื่อออก 0.2.0 และยังไม่กำหนดวันหรือเงื่อนไขสำหรับเลขนั้น
- เลขท้ายในช่วงนี้เป็นกติกาส่งมอบระหว่างพัฒนาที่เจ้าของเลือก
  ไม่ใช่คำรับรองว่าทุกรุ่นเปลี่ยนเฉพาะ bugfix หรือเข้ากันได้เสมอ
- ยืนยันเพิ่มเติม: รูปเป็น node/block แยกก่อน รับ URL และ Base64 เริ่ม JPEG/PNG
  ปรับไฟล์ภาพจริงให้เหมาะกับพื้นที่เอกสาร ไม่เพียงย่อขนาดตอนวาด
- แยกรับข้อมูลให้ครบออกจากเตรียมภาพ; ชุดใหญ่ส่งรูปแยกและติดตาม uploadId
  ก่อนรับเป็น job สร้างเอกสาร ส่วน JSON/Base64 เป็นทางสำหรับชุดเล็กที่จำกัดขนาด
- รูปใช้ไม่ได้ให้เตือนและทำเอกสารต่อโดยเว้นพื้นที่เดิม; ข้อมูลคำขอผิดสัญญา
  หรือเกินเพดานรวมยังเป็นเหตุปฏิเสธ ไม่ใช้กฎข้ามรูปกลบ request ที่ไม่สมบูรณ์
- เก็บต้นทางและภาพเตรียมชั่วคราว ค่าเริ่มต้น 1 ชั่วโมงตามช่วงอายุด้านล่าง
  ใช้ API อ่านสถานะเป็นระยะ ยังไม่ทำเปอร์เซ็นต์รวมทั้งงานหรือ ETA
- เจ้าของเห็นด้วยให้แยกงานรับ/พักทรัพยากรพร้อมสถานะ กับงานเตรียมภาพ/วาง PDF
  เป็นสองรุ่นส่งมอบ แทนรวมทั้งหมดใน 0.1.1

## นิยามที่ใช้ในร่างนี้

เป็นนิยามเฉพาะการออกแบบรอบนี้ ยังไม่เพิ่มลง glossary หรือ schema ของผลิตภัณฑ์

| คำ | ความหมาย / การคลายความกำกวม |
| --- | --- |
| มีเดีย | split: รอบแรกหมายถึงรูปภาพ JPEG/PNG; วิดีโอ/เสียงยังไม่อยู่ในร่าง |
| รับทรัพยากร | define: รับข้อมูลและเก็บไฟล์ครบพร้อมยืนยันฝั่งเซิร์ฟเวอร์ ก่อนนำไปใช้; uploadId ไม่ใช่ jobId |
| เตรียมทรัพยากร | define: ตรวจและเตรียมข้อมูลรูปให้พร้อมก่อนวัดขนาด จัดหน้า และสร้าง PDF |
| ตัวแปรลิงก์ | split: ข้อความแสดงผลกับปลายทาง; ต้องแยก URL ภายนอกและจุดหมายภายในเอกสาร |
| จุดหมาย | define: ตัวอ้างอิงตำแหน่งในเอกสาร ไม่ใช้ข้อความหัวข้อหรือเลขหน้าเป็น identity |
| สารบัญ | define: รายการหัวข้อที่เลือก พร้อมเลขหน้าจริงและลิงก์ไปจุดหมาย |
| รวมเซลล์ | define: เซลล์ครอบหลายคอลัมน์/หลายแถว; ไม่ใช่ตารางซ้อน |

## การแบ่งรุ่นตามทิศทางที่ตกลง — รายละเอียดรอ roadmap

แบ่งงานทรัพยากรเป็นสองชุดที่ทดสอบผ่าน API ได้แยกกัน ตามการหารือเพิ่มเติม
รุ่นแรกตรวจการรับและเก็บข้อมูล ไม่อ้างว่า PDF รองรับภาพแล้ว

| ลำดับเสนอ | ชุดส่งมอบ | สิ่งที่ผู้ใช้ทำได้ | สิ่งที่ต้องมีก่อน |
| --- | --- | --- | --- |
| 0.1.1 | รับและพักทรัพยากรพร้อมสถานะ | เปิดชุดอัปโหลด ส่ง/ตรวจรายการ ส่งรายการที่ผิดใหม่ และตรวจอายุข้อมูลผ่าน API | ล็อกสัญญาการรับ การยืนยันครบ และ cleanup |
| 0.1.2 | เตรียมภาพและวางลง PDF | ใช้ทรัพยากรที่รับครบ ปรับภาพตามกรอบและความละเอียด แล้วออก PDF พร้อมคำเตือนรายรูป | ชุดรับทรัพยากร 0.1.1 และสัญญา Core |
| รุ่นถัดไป | ตารางรวมเซลล์ | สร้างตารางที่รวมแนวนอน/แนวตั้งตามขอบเขตที่รับ | ล็อกกติกาข้ามหน้าและรูปในเซลล์ |
| รุ่นถัดไป | ลิงก์และจุดหมาย | แสดงคำกดได้และไปปลายทางถูกต้อง | ล็อกชนิดปลายทางและ scope ของจุดหมาย |
| รุ่นถัดไป | สารบัญ | ได้รายการหัวข้อ เลขหน้าและลิงก์ตรงกับ PDF จริง | จุดหมายและผลจัดหน้าที่เสถียร |

0.1.1/0.1.2 เป็นลำดับเป้าหมายของสองชุดนี้ หากพบว่าต้องแบ่งเพิ่มต้องแจ้งก่อน
เปลี่ยนขอบเขต ไม่จองเลขของหัวข้อหลังจากนั้นถาวร ไม่รวม crop/แปลงภาพทั่วไป
หรือ API แต่งภาพเต็มชุดเข้ามาเพียงเพราะใช้ตัวเตรียมภาพร่วมกัน

## ขอบเขตเสนอของแต่ละหัวข้อ

### 1. รูปภาพและเตรียมทรัพยากร

#### 1a. รับข้อมูลครบก่อนรับเป็นงานสร้างเอกสาร

ชุดใหญ่เปิดชุดรับข้อมูลได้ uploadId ก่อน แล้วส่งรูปแยกเป็นรายการ ระบบยืนยัน
รายการที่รับและบันทึกครบแล้ว; รายการที่ส่งขาดส่งใหม่ได้โดยไม่ต้องส่งรูปที่สำเร็จซ้ำ
ไม่ได้หมายถึงรองรับ resume ราย byte หรือ multipart chunk protocol ในรุ่นแรก
คำขอที่ยังส่ง body ไม่ครบไม่สร้าง job เอกสาร และไม่นำไฟล์บางส่วนไปใช้งาน
ต้องจำกัดการพักข้อมูลทั้งระหว่างรับและหลังรับ ไม่เก็บ Base64 ทั้งชุดใน RAM โดยไร้เพดาน

รองรับ URL และ Base64 ตามที่ตกลง; กรณีรูปมีสิทธิ์เฉพาะ ผู้เรียกดึงเองแล้วส่งข้อมูลรูป
ไม่รับงานล็อกอิน/ส่งต่อ token ไปดึงแทนเขา JSON/Base64 ก้อนเดียวใช้สำหรับชุดเล็ก
ที่มีเพดาน request ชัด; เมื่อรับครบจึงถอดเป็นไฟล์ และไม่เก็บ Base64 ซ้ำโดยไม่จำเป็น
ต้องออกแบบวิธีเลี่ยงการเก็บต้นฉบับ Base64 ซ้ำใน job payload เดิมด้วย

หลังรายการครบตามสัญญา จึงอ้าง uploadId/resources ในคำขอสร้างเอกสารและได้ jobId
การรับครบไม่เท่ากับการย่อภาพเสร็จ สำหรับ URL ให้แยกการรับ URL ครบกับการดึงไฟล์ครบ
การดึงไฟล์เป็นขั้นเตรียมทรัพยากรฝั่งเซิร์ฟเวอร์ ไม่ต้องค้าง HTTP จนดึง/ย่อทุกรูปเสร็จ
รายละเอียดการ finalize ชุด การ pin กับ job และการป้องกัน submit ซ้ำต้องล็อกใน roadmap
ก่อนทำจริง; ไม่ปล่อย renderer อ่านรายการที่ยังรับ/เตรียมไม่เสร็จ

0.1.1 จบเมื่อทดลองรับชุดหลายรูป ตรวจสถานะ รับครบ/ขาด/หมดเวลา/เกินเพดาน
ส่งรายการผิดใหม่และ cleanup ได้จริง โดย API เอกสารเดิมยังทำงานเหมือนเดิม
การ consume รูปเข้า PDF เป็นเกณฑ์ของ 0.1.2 ไม่ใช้ภาพสำเร็จปลอมปิด 0.1.1

#### 1b. ปรับไฟล์ภาพจริงก่อนจัดหน้า

รูปเป็น node/block แยก กรอบกว้าง/สูงมาจากโครงเอกสาร ไม่ให้ขนาดต้นฉบับขยายกรอบ
เริ่ม JPEG/PNG อ่านสัดส่วนและ orientation แล้ววางแบบรักษาสัดส่วนไม่ยืด/ไม่ crop
จัดกึ่งกลางกรอบ ส่วนรูปใน TextBlock/เซลล์และข้อความไหลรอบรูปพักไว้ก่อน

มี API/module ภายในรับรูปกับพื้นที่เป้าหมาย แปลงหน่วยขนาดเอกสารเป็นพิกเซล
ตามความละเอียดเป้าหมาย แล้วลดขนาดตัวไฟล์ก่อนใช้ ไม่ฝังภาพเต็มโดยเพียงวาดให้เล็กลง
ค่าความละเอียด นโยบายภาพเล็กกว่าเป้าหมาย คุณภาพบีบอัดและ transparency ต้องล็อก
ในงานออกแบบก่อนเลือก library ไม่ถือว่าการเพิ่มพิกเซลทำให้ภาพคมขึ้น
ยังไม่เปิด endpoint แต่งภาพสาธารณะแยก

เก็บภาพที่เตรียมแล้วแยกจากต้นทาง ผูกกับรายการของงาน ผล layout และ PDF ใช้ชุดเดียวกัน
ไม่โหลด URL ใหม่ระหว่างวัดกับวาด และไม่ล้างต้นทางที่งานยังต้องใช้

Service ดูแลรับ/เข้าถึงทรัพยากร วงจรงาน ข้อจำกัดและไฟล์ชั่วคราว
Core รับทรัพยากรที่พร้อมแล้ว ตรวจสัญญาที่ตนใช้ วัดและวางลง PDF
ไม่ให้ Core ไปอ่าน URL หรือ DB เอง ส่วน library ที่ถอด/แปลงรูปยังไม่เลือก
ตรวจของเดิมและความเหมาะสมใน runtime ก่อนล็อก dependency

กำหนดเพดานจำนวนรูป ขนาดไฟล์ พิกเซลหลังถอดภาพ เวลาและทรัพยากรรวมต่องาน
ก่อนลงมือ พร้อมการล้างไฟล์เมื่อสำเร็จ ล้มเหลว หมดเวลา หรือ restart
URL ต้องมีนโยบายปลายทาง/redirect/timeout ที่ตรวจได้;
upload/resource reference ต้องมีขอบเขตอายุและการเข้าถึงที่ชัดเจน
ยังไม่อนุญาตอ่าน host path ตามค่าที่ผู้เรียกส่งมาโดยตรง

รูปดึงไม่ได้/เสีย/ชนิดไม่รองรับ ให้ข้ามรูป เก็บพื้นที่กรอบและเตือนระบุ resource path
ทำเอกสารต่อโดยไม่พิมพ์ error ลง PDF กฎ required ของโครง/ข้อมูลคำขอยังไม่ถูกยกเลิก
ต้องแยก missing field ที่ผิดสัญญาออกจากไฟล์ภาพที่รับรายการมาแล้วแต่ใช้งานไม่ได้
ไม่ใช้ค่าว่าง string ของตัวแปรข้อความเป็นค่ารูปโดยอัตโนมัติ

เกณฑ์จบเสนอ: รูปแนวตั้ง/นอน ต่างสัดส่วน และรูปซ้ำออกถูกต้อง;
รูปผิดชนิด/เสีย/เกินขีดจำกัดให้ข้อผิดพลาดที่ชี้รายการ; cleanup และ restart
มีผลตามกติกา; เอกสารไม่มีรูปเดิมยังใช้ได้; ตรวจ PDF จริงผ่าน API

#### 1c. อายุข้อมูลชั่วคราว

ค่าเริ่มต้น 1 ชั่วโมง ตั้งผ่าน config ได้ แยกนาฬิกาตามสถานะ:

- ระหว่างอัปโหลด: นับจากความคืบหน้าล่าสุดที่เซิร์ฟเวอร์รับจริง ไม่ใช่การ poll
  มีเพดานอายุรวมอีกชั้นที่ต้องกำหนด ป้องกันส่งทีละนิดแล้วไม่หมดอายุ
- รับครบแต่ยังไม่ผูกงาน: เก็บ 1 ชั่วโมงจากเวลารับครบ
- ผูก job แล้ว: ปกป้องระหว่างรอคิว/ทำงาน หลัง job สำเร็จหรือล้มเหลวจึงนับ 1 ชั่วโมง
  ก่อนลบต้นทางและภาพที่เตรียม ไม่ลบกลางงานเพียงเพราะคิวนาน
- ไฟล์บางส่วนจากการส่งขาดไม่ถือเป็น resource พร้อมใช้; retry/lifetime/cleanup
  ต้องตรวจร่วมกัน รวมการ restart และการแข่งขันระหว่างผูกงานกับหมดอายุ
- สถานะ/คำเตือนเก็บแยกจากเนื้อหา PDF ผลลัพธ์คงใช้นโยบาย retention เดิม
  งานที่ถูกขัดจังหวะต้องเข้าสถานะ recovery ที่ชัด ไม่ถูกปกป้องค้างตลอดไป

พื้นที่นี้เป็น staging ของงาน ไม่ใช่คลังมีเดียถาวร รายละเอียดว่าอ้างร่วมหลาย job
ได้หรือไม่ยังไม่ล็อก ถ้าอนุญาตต้องไม่ลบขณะมีงานใดใช้อยู่

#### 1d. Feedback ผ่าน polling

ใช้ API อ่านสถานะเป็นระยะ แยก uploadId และ jobId แต่เชื่อมความสัมพันธ์ไว้
ชื่อขั้นด้านล่างเป็นความหมาย ยังไม่ใช่ enum/API ที่ล็อกแล้ว:

| ขั้น | ข้อมูลที่รายงาน |
| --- | --- |
| รับข้อมูล | รายการที่บันทึกครบ/ทั้งหมด และ bytes ที่รับถ้าวัดได้; ไม่ถือว่าฝั่งผู้เรียกส่งครบเท่ากับเซิร์ฟเวอร์บันทึกครบ |
| ตรวจข้อมูล | กำลังตรวจโครง ตัวแปรและรายการทรัพยากร พร้อมข้อผิดพลาดที่ระบุตำแหน่ง |
| ดึงรูป URL | จำนวนที่เสร็จ/ทั้งหมด รายการกำลังดึงและคำเตือน |
| เตรียมภาพ | จำนวนที่เตรียมแล้ว/ทั้งหมดและรายการที่ข้าม |
| รอคิว / จัดหน้า / เขียน PDF | ขั้นที่เกิดจริง รักษาวงจร job หลักเดิม; ลำดับรอคิวกับเตรียมภาพต้องตรง scheduler ที่ออกแบบ |
| สำเร็จ / ล้มเหลว / หมดอายุ | ผลและคำเตือน หรือเหตุผลที่ไปต่อไม่ได้; URL ดาวน์โหลดเมื่อมีผลจริง |

ไม่ทำเปอร์เซ็นต์รวม/ETA ที่เดาจากจำนวนรูป ไม่ต้องเพิ่ม WebSocket/SSE ตอนนี้
0.1.1 ครอบคลุมสถานะการรับและพัก ส่วนขั้นภาพ/PDF เพิ่มใน 0.1.2

### 2. ตารางรวมเซลล์

สถานะพัฒนา 2026-10-09: ขอบเขตรวมเซลล์ model 6 ผ่านการตรวจรับ local แล้ว
Core/Service 0.1.3 ตาม [แผนและผลตรวจ](flowdoc-merged-table-plan-2026-10-09.md#final-acceptance--pass-2026-10-09)
ยังไม่ขึ้น release/tag; ภาพและโครงหลาย block แบบ column ภายในเซลล์พักไว้หลัง
0.2.0 ตามเจ้าของ ส่วน TextBlock หลายตัวที่รองรับอยู่เดิมยังคงไว้
ข้อความถัดไปเป็นข้อเสนอเดิม; ขอบเขตที่อนุมัติและผลจริงให้ยึดเอกสารที่ลิงก์ไว้

เสนอรองรับ colspan และ rowspan บนกริดที่ตรวจช่องซ้อน ช่องเกินขอบ และ coverage ได้
วัดข้อความตามพื้นที่เซลล์รวมจริง และคำนวณความสูงแถวร่วมกันอย่างมีเจ้าของชัดเจน
ยังไม่เพิ่มตารางซ้อนหรือหน้าบ้านแก้ตาราง

ต้องล็อกก่อนทำ: การรวมข้ามหัวตาราง/เนื้อหาอนุญาตหรือไม่; แถวจากรายการซ้ำ
รวมข้าม item ได้หรือไม่; เซลล์รวมสูงเกินหน้าแบ่งอย่างไร; หน้าใหม่แสดงเส้นกรอบ
เนื้อหาต่อและหัวซ้ำอย่างไร ห้ามแก้ปัญหาด้วยย้ายแถวทั้งก้อนเสมอโดยไม่ตกลง
ความต้องการแบ่งส่วนที่เกินไปหน้าถัดไปจาก MVP ยังเป็นฐานในการออกแบบ

เกณฑ์จบเสนอ: รวมแนวนอน/แนวตั้งและกรณีผสม ข้อความยาว รูปถ้าอยู่ใน scope
และจุดต่อหน้าไม่หาย/ซ้ำ/ทับ; ตารางเก่าที่ไม่รวมช่องยังถูกต้อง
ความสามารถที่ยังไม่รองรับต้องถูกปฏิเสธชัด ไม่วาดผลผิดเงียบ ๆ

### 3. ตัวแปรลิงก์และจุดหมาย

เสนอเป็นค่าที่มีข้อความและปลายทางแยกกัน แทรกกับข้อความปกติได้
รูปแบบ JSON และ master type ID ใหม่ยังไม่กำหนด ต้องให้ template contract
และ validation อธิบายแก่ผู้เรียกได้ ไม่ใช้ข้อความ label เป็น identity

จุดหมายในโครงย่อยที่เรียกซ้ำต้องแยกตาม invocation เพื่อไม่ชนกัน
ตำแหน่งปลายทางผูกกับผลจัดหน้าจริง ลิงก์ที่ข้อความตัดหลายบรรทัดต้องมีพื้นที่กด
ตรงข้อความแต่ละช่วง กำหนดผลกรณีปลายทางหาย/ซ้ำและชนิด URL ที่ยอมรับก่อนทำ

เกณฑ์จบเสนอ: ข้อความแสดงถูก กดไปถูกจุด/URL ไม่สร้างพื้นที่กดทับรายการอื่น
และตรวจด้วย PDF viewer ที่ตกลง ไม่ใช้เพียงการพบข้อความในไฟล์แทนการกดจริง

### 4. สารบัญ

เสนอให้ผู้สร้างโครงเลือกหัวข้อและระดับที่เข้ารายการได้ ไม่เดาจากขนาดฟอนต์
อ้างอิงจุดหมายเดียวกับลิงก์ เลขหน้าต้องมาจาก layout สุดท้าย
ต้องรองรับผลที่สารบัญกินพื้นที่จนเปลี่ยนเลขหน้าของเนื้อหา รวมกรณีสารบัญหลายหน้า

ไม่จำลองเอกสารรอบพิเศษเพียงเพื่อทำ progress UX แต่การแก้ dependency ของ
เลขหน้าสารบัญอาจต้องคำนวณซ้ำเฉพาะส่วน/หลาย pass ให้เลือกจากหลักฐานตอนออกแบบ
ต้องมีขอบเขตการลู่เข้าและผลล้มเหลวชัดเจน ไม่วนไม่จำกัดหรือส่งเลขหน้าที่รู้ว่าคลาด

เกณฑ์จบเสนอ: ลำดับหัวข้อถูก ชื่อยาว/หัวข้อซ้ำไม่สับสน เลขหน้าและลิงก์ตรงจริง
ทั้งสารบัญหน้าเดียว/หลายหน้า และหลังเพิ่มหรือลดเนื้อหา

## กติกากันหลุดระหว่างพัฒนา

- ก่อนเริ่มแต่ละรุ่น ล็อก input/output ขอบเขต ตัวอย่าง และเกณฑ์รับของรุ่นนั้น
  ไม่ถือว่าการรับร่างภาพรวมอนุมัติรายละเอียด API/DB ที่ยังไม่ตัดสินใจ
- ใช้ fixture ปกติ/ว่าง/ยาวของ MVP เป็นฐาน ตรวจพื้นที่ที่กระทบและกรณีใหม่
  ไม่บังคับ PDF byte เหมือนเดิมเมื่อ metadata เปลี่ยน; ตรวจความหมายและภาพตามผลกระทบ
- แยก software version, template version และ schema/contract version
  ระบุความเข้ากันได้และวิธีย้ายเมื่อจำเป็น; ไม่แก้ snapshot เก่าเพื่อให้ทดสอบผ่าน
- เปลี่ยน DB เฉพาะเมื่อมีสัญญาที่ต้องเก็บจริง พร้อม migration/อ่านข้อมูลเก่า
  ไม่เพิ่มคลังมีเดียถาวรหรือ tree tables ล่วงหน้าเพียงเพราะอาจใช้ภายหลัง
- ทดสอบชุดที่แพ็กจริงและ Service ที่ตรึง Core นั้นก่อนเข้า release
  บันทึกรุ่นคู่กัน ตัวอย่างเรียกและข้อจำกัดในที่เดิม ไม่เพิ่มรายงานทุกขั้น
- ไม่รับรองโหลดหนักจาก fixture เดียว; ยังไม่เพิ่ม multi-worker, permission,
  billing, public deployment, UI หรือ DOCX เข้าเกณฑ์จบของรอบนี้

## Roadmap — ลำดับงานและจุดจบ

เพิ่มตามคำขอเจ้าของ 2026-10-08 เป็น roadmap สำหรับหารือและแตกแบบ
ยังไม่ใช่ implementation plan ที่เลือก endpoint/ตาราง/library แล้ว
ทำบน branch พัฒนาปกติ: Service `codex/template-registry`, Core
`codex/template-binding`; ไม่แก้ release/tag 0.1.0 ระหว่างพัฒนา
ขั้นย่อยด้านล่างเป็นช่วงงาน ไม่ใช่หนึ่งช่วงต่อหนึ่งเลขเวอร์ชัน

### Service 0.1.1 — รับและพักทรัพยากรพร้อมสถานะ

เจ้าของหลัก Service; Core คง 0.1.0 หากไม่พบเหตุจำเป็นต้องเปลี่ยน
ผลส่งมอบคือ API รับชุดทรัพยากรที่ใช้และทดสอบได้จริง โดยยังไม่สร้าง PDF ที่มีภาพ

| ช่วง | งานที่ต้องได้ | เกณฑ์จบ / หลักฐาน |
| --- | --- | --- |
| U0 ตรวจของเดิมและล็อกสัญญา | ตรวจ HTTP body limit, queue admission, payload persistence, temp storage และ cleanup เดิม; ออกแบบ session/item/finalize/retry กับ DB relationships และ status response | มีตัวอย่าง API/ข้อมูลและ state transitions ที่ review ได้ ระบุผู้ถือไฟล์ทุกช่วง; ปิดคำถามที่บล็อก U1–U3 ก่อนลงโค้ด |
| U1 รับชุดและไฟล์ | เปิดชุดได้ uploadId; รับไฟล์แยกและ Base64 แบบจำกัดขนาด; ลงไฟล์ชั่วคราวแล้วค่อยยืนยันรายการพร้อม | ทดสอบหลายไฟล์ ส่งขาด ตัด connection ส่งซ้ำ ส่งรายการเสียใหม่ และเกินเพดาน; ไฟล์บางส่วนไม่ถูกประกาศพร้อมและไม่กิน RAM แบบไร้ขอบเขต |
| U2 ยืนยันครบและอ่านสถานะ | ตรวจรายการที่คาดหมายกับที่บันทึกจริง รับรายการ URL โดยไม่อ้างว่าโหลดแล้ว; finalize แบบไม่สร้างรายการซ้ำ; polling อ่านสถานะ/คำเตือนได้ | ชุดไม่ครบไม่ผ่าน finalize; คำขอซ้ำหรือพร้อมกันให้ผลตามสัญญา; อ่านสถานะไม่ต่ออายุโดยอัตโนมัติ; ไม่มี job เอกสารจาก body ที่ยังไม่ครบ |
| U3 อายุและการกู้สถานะ | เก็บตามค่าเริ่มต้น 1 ชั่วโมง แยก inactive/ready/claimed; cleanup, restart และขอบเขตการเข้าถึง resource | ใช้นาฬิกาควบคุมทดสอบอายุโดยไม่รอจริง 1 ชั่วโมง; ทดสอบ finalize/claim แข่ง cleanup, partial files หลัง restart และไฟล์ที่กำลังใช้งานไม่ถูกลบ |
| U4 รับรุ่น | ตัวอย่างเรียก API ตั้งแต่เปิดชุดจนพร้อมใช้ พร้อมวิธีส่งใหม่และข้อจำกัด; ทดสอบ packaged Service กับ DB/ไฟล์จริง | ผ่านกรณีรับ/สถานะ/อายุ และ API export เดิม; ระบุว่า image consumption ยังไม่รองรับ; จึงเตรียม Service 0.1.1 และ tag หลังรับงาน |

U0 ต้องกำหนดความหมาย claimed/lease สำหรับ consumer ถัดไปให้ทดสอบวงจรชีวิตได้
แต่ U1–U4 ไม่เปิดทางให้ job เดิมรับ image reference แล้วเงียบหายไปจาก PDF
การปกป้องไฟล์กับ job จริงต้องตรวจซ้ำใน I1 เมื่อเชื่อม consumer แล้ว
การส่งใหม่รุ่นแรกหมายถึงส่งไฟล์รายการนั้นใหม่ ไม่รับรอง resume ตำแหน่ง byte

### Service 0.1.2 — เตรียมภาพและนำไปออก PDF

Service เป็นเจ้าของการดึง/พัก/เตรียมและสถานะ; Core เป็นเจ้าของสัญญาภาพที่พร้อมใช้
การวัดพื้นที่และวาด PDF เลขรุ่น Core กำหนดเมื่อทราบชุดเปลี่ยนจริง

| ช่วง | งานที่ต้องได้ | เกณฑ์จบ / หลักฐาน |
| --- | --- | --- |
| I0 ล็อกสัญญารูป | node ภาพ กรอบ ความละเอียด fit, warning และ prepared-resource interface; เลือกเครื่องมือหลังตรวจ runtime | มี fixture รูปและขนาดที่คาดหวัง แยก invalid request จากรูปที่ข้ามได้; ไม่เลือก dependency จากชื่ออย่างเดียว |
| I1 เชื่อมทรัพยากรกับ job | pin ชุดที่ finalize แล้ว; ดึง URL ภายใต้นโยบายที่กำหนด; polling แสดงขั้นจริง | ไฟล์พร้อมถูกใช้ซ้ำโดยไม่โหลดระหว่าง layout/paint; restart และงานค้างไม่ทำไฟล์หาย; URL เสีย/ถูกปฏิเสธให้ warning และเดินต่อได้ตามกติกา |
| I2 เตรียมไฟล์ภาพ | ถอด JPEG/PNG และลดพิกเซลตามพื้นที่กับความละเอียดเป้าหมาย บันทึกผลที่พร้อมใช้ | ตรวจขนาดไฟล์/พิกเซลจริง สัดส่วน orientation และ transparency; เวลา/หน่วยความจำ/จำนวนงานพร้อมกันอยู่ในเพดานที่วัดไว้ |
| I3 วางใน PDF | block ภาพแยก พอดีกรอบรักษาสัดส่วน; รูปผิดเว้นกรอบและส่ง warning | ตรวจภาพจริงใน PDF หลายสัดส่วนและหลายหน้า; ไม่มีภาพเต็มต้นฉบับถูกฝังโดยไม่จำเป็น; เอกสารเดิมยังถูกต้อง |
| I4 รับรุ่น | packed Core ใหม่และ Service ที่ตรึง artifact นั้น พร้อม flow จริงตั้งแต่ upload ถึง download | ตรวจ lifecycle ก่อน/ระหว่าง/หลัง job, ภาพและคำเตือน, baseline PDF และ restart; ผ่านแล้วจึงส่งมอบรุ่น |

### หัวข้อถัดไป — ยังไม่จองเลขรุ่น

1. ตารางรวมเซลล์: ออกแบบกริด/validation → วัด colspan/rowspan → กติกาข้ามหน้า
   → ตรวจ PDF และรับรุ่น ห้ามถือว่ารองรับทุกกรณี merged-cell ตั้งแต่มี syntax
2. ลิงก์และจุดหมาย: ล็อกค่าตัวแปร/identity/scope → ผูกตำแหน่งจาก layout
   → สร้างพื้นที่กด → ทดสอบกดจริงและรับรุ่น
3. สารบัญ: ล็อกหัวข้อ/ระดับ → ประกอบรายการจากจุดหมาย → แก้เลขหน้าจนเสถียร
   ภายใต้ขอบเขต → ตรวจสารบัญหลายหน้าและรับรุ่น

ลิงก์เป็น prerequisite ของสารบัญ ตารางไม่ใช่ prerequisite ของลิงก์โดยตัวมันเอง
ลำดับตารางก่อนลิงก์เป็นข้อเสนอด้านความสำคัญ สามารถปรับก่อนเริ่มหัวข้อนั้นได้
ถ้าพบ scope เพิ่ม ให้ทบทวนขอบเขตและเกณฑ์จบของรุ่นก่อนขยาย ไม่เลื่อนงานเข้าไปเงียบ ๆ
ไม่มี ETA หรือคำรับรองโหลดหนักจาก roadmap นี้ และไม่มีการเปิดห้องงานเพิ่มโดยอัตโนมัติ

## U0 — ผลตรวจของเดิมและแบบสัญญาสำหรับทบทวน

ตรวจ source Service บน branch พัฒนา 2026-10-08 แบบ read-only:

| จุดตรวจ | ข้อเท็จจริงจาก source | ผลต่อแบบใหม่ |
| --- | --- | --- |
| `src/http/server.ts`, `src/server.ts` | JSON body limit เริ่มต้น 2 MiB, ไม่มี upload routes | ไม่ยกเพดานทุก route เพื่อรับรูป; แยก binary stream กับ Base64 ขนาดเล็ก |
| `src/jobs/admission.ts` | เก็บ original_input และ prepared_input เป็น JSON ทั้งคู่ | อย่าส่ง Base64 ผ่านเส้นนี้; job ใช้ resource references เมื่อเชื่อมใน 0.1.2 |
| `src/storage/pdf-files.ts` | ชื่อและ cleanup เป็นของ PDF โดยเฉพาะ มี active-file protection ใน process | แยก resource storage และสถานะ DB; ไม่ปน cleanup กับ PDF |
| `src/jobs/processor.ts` | coordinator เดียวด้วย advisory lock; running ที่ขัดจังหวะเป็น failed | ไม่เพิ่ม worker cluster; ใช้ขอบเขต single-instance เดิมและวาง recovery ของ uploads แยก |
| `src/db/migrate.ts` | migration เรียงลำดับและตรวจ checksum | เพิ่ม migration ใหม่หลัง 003 ไม่แก้ของเดิม |
| `compose.yaml` | มี volume DB/output และ private network แบบ internal | เพิ่ม volume staging; URL fetch จริงใน 0.1.2 ต้องตัดสินใจ outbound access ก่อน ไม่อ้างว่ารับ URL แล้วดึงได้ในชุดเดิม |

ผลตรวจนี้เป็นการอ่าน implementation ไม่ใช่ผลทดสอบพฤติกรรมใหม่
แบบต่อไปนี้เป็นข้อเสนอ U0 เพื่อ review; U1 ยังไม่เริ่มและ schema/API ยังไม่ปล่อย

### สัญญา API ที่เสนอ

ใช้ Result envelope เดิม `{ok,value,warnings}` / `{ok:false,issues,warnings}`
โดยไม่คืน filesystem path, credential หรือ raw URL ที่มีข้อมูลลับใน error/log

| Endpoint เสนอ | หน้าที่และผล |
| --- | --- |
| `POST /uploads` | รับ manifest ของรายการทั้งหมด; ตอบ 201 พร้อม uploadId, resourceId ต่อ item, limits และ expiresAt; รองรับ requestKey สำหรับ retry การสร้างชุด |
| `PUT /uploads/:uploadId/items/:resourceId/content` | ส่ง binary JPEG/PNG ของรายการหนึ่งเป็น stream; บันทึกครบจึงตอบ receipt; ไม่ใช้ filename ของผู้เรียกเป็น path |
| `PUT /uploads/:uploadId/items/:resourceId/base64` | ส่ง JSON `{data: base64}` สำหรับภาพเล็ก; ตรวจเพดานทั้ง encoded/decoded และรูปแบบ Base64 ก่อนประกาศว่ารับครบ |
| `GET /uploads/:uploadId` | คืนสถานะชุดและราย item, bytes/counts ที่รับจริง, warnings, expiresAt; อ่านอย่างเดียวไม่ต่ออายุ |
| `POST /uploads/:uploadId/finalize` | เปลี่ยน open → ready เมื่อ binary items รับครบและ URL descriptors ผ่านกฎ; เรียกซ้ำคืนผลเดิม ไม่สร้าง job |

manifest ตัวอย่าง (ชื่อ field ยังรอรับแบบ):

```json
{
  "requestKey": "document-batch-001",
  "items": [
    {"key": "cover", "source": "upload", "mediaType": "image/jpeg", "byteSize": 524288},
    {"key": "diagram", "source": "url", "url": "https://example.org/diagram.png"}
  ]
}
```

key ไม่ซ้ำภายในชุด และ resourceId เป็น UUIDv7 แยกจาก key; manifest ถูกตรึงหลังสร้าง
เปลี่ยนรายการสร้างชุดใหม่ ห้าม finalize ขณะที่รายการยัง receiving หรือ incomplete
binary retry ใช้ item เดิม: completed content ที่ hash/size ตรงกันคืน receipt เดิม
ถ้าต่างกันให้ conflict; attempt ที่ขาด/ผิดล้างไฟล์บางส่วนก่อนรับใหม่
requestKey เดิมกับ manifest เดิมคืนชุดเดิม; payload ต่างกันเป็น conflict
หลังหมดอายุ key เดิมไม่ฟื้นชุด ให้ใช้ key ใหม่

URL item ใช้สถานะ declared ไม่ใช้ received: ready หมายถึงคำขอและ upload bytes
ครบพร้อมส่งต่อ ไม่ใช่รูปทุกใบใช้งานได้หรือถูกดาวน์โหลดแล้ว
ใน 0.1.1 ตรวจรูปแบบ URL เท่านั้น ไม่ fetch; 0.1.2 fetch ภายใต้กฎ DNS/IP/redirect,
ขนาดและ timeout ก่อน renderer ใช้งาน เสนออนุญาต HTTPS ไม่มี embedded credentials
และไม่มี custom authentication headers; สิทธิ์ภายนอกใช้ผู้เรียกส่งไฟล์เอง

สถานะผิดเสนอ: 400 รูปแบบคำขอผิด, 404 ไม่พบชุด/item, 409 สถานะหรือ retry ขัดกัน,
410 หมดอายุ, 413 เกินขนาด, 422 manifest/ข้อมูลไม่ผ่านกฎ, 503 พื้นที่/ระบบไม่พร้อม
ชนิดภาพจริงและการ decode ที่หนักอยู่ 0.1.2; การยอมรับ MIME ตอนรับไม่ใช่หลักฐานว่า
ภาพ valid ใน PDF transport error ตอน upload ต้องแก้ให้ครบก่อน finalize ไม่ใช่
image warning ที่ renderer ข้ามได้

### DB และไฟล์ที่เสนอ

เพิ่ม `upload_sessions` และ `upload_items` ใน migration ใหม่ (ชื่อเสนอ
`004_upload_staging.sql`); ยังไม่เพิ่มตาราง library หรือแก้ template snapshot

- sessions: id, request_key unique ในขอบเขต local service ปัจจุบัน,
  manifest_digest, status, created_at, updated_at, last_progress_at, ready_at,
  expires_at, absolute_expires_at และ revision; ภายหลังมี tenant ต้อง scope key ใหม่
- items: id, upload_id FK, key, source_kind, declared_media_type,
  expected_bytes, received_bytes, checksum, internal storage key หรือ URL,
  status, attempt_id, error code, created_at, updated_at; unique(upload_id,key)
- ความสัมพันธ์หนึ่งชุดมีหลายรายการ; byte payload อยู่ volume staging ไม่อยู่ JSONB
  DB เก็บ metadata และ reference เท่านั้น; ห้ามใช้ URL/path เป็น id หรือ path ดิสก์
- จัดไฟล์ตาม session/item/attempt ที่ระบบสร้าง เขียน `.part` แล้วปิด/rename ก่อน
  commit receipt; ถ้า DB commit ไม่ชัดเจนให้ reconcile ห้ามรายงานสำเร็จจาก rename อย่างเดียว
- restart ทำ receiving attempt ที่ไม่จบเป็น incomplete และ reconcile orphan;
  ready files ที่มี receipt ต้องตรวจได้ ไม่ถือว่าแค่แถว DB อยู่แปลว่าไฟล์อยู่

state ชุด U1–U4: open → ready → expired (terminal); incomplete item ส่งใหม่ได้ใน open
ไม่ให้เปลี่ยน manifest/bytes หลัง ready การลบจริงมีขั้น retiring/retry ภายใน
เพื่อไม่ลืมลบเมื่อ DB/ดิสก์ผิดพลาด โดยไม่เพิ่มรายละเอียดนี้เป็นสถานะ UX ที่จำเป็น

เสนอหนึ่งชุดต่อหนึ่ง job ใน 0.1.2 เพื่อลดความกำกวมของ TTL/reuse:
เพิ่ม job linkage และ claimed เมื่อเชื่อม consumer จริง ไม่เปิด claim endpoint จำลอง
ใน 0.1.1 การ claim กับ admit job ต้อง atomic และใช้ lock/expiry predicate เดียวกับ cleanup
หลัง job terminal เก็บอีก 1 ชั่วโมง; ทดสอบการปกป้อง job จริงใน I1
ใน 0.1.1 ทดสอบ finalize แข่ง cleanup ได้ แต่ยังไม่อ้างว่า job lease ผ่านแล้ว
ข้อมูลสถานะที่หมดอายุเก็บแบบไม่มี bytes/Base64; อายุ metadata และ requestKey tombstone
ต้องกำหนดใน implementation plan เพื่อไม่ให้เกิดข้อมูลสะสมถาวรโดยไม่ได้ตั้งใจ

### เพดานตั้งต้นสำหรับทดลอง — ยังไม่ใช่ capacity ที่รับรอง

เสนอ limits จาก config และแสดงให้ผู้เรียกรู้ก่อนอัปโหลด:

| รายการ | ค่าเสนอให้ทดลอง |
| --- | --- |
| รูปต่อชุด | 20 รายการ |
| binary ต่อรูป / รวมต่อชุด | 10 MiB / 50 MiB |
| Base64 ต่อรูป | decoded ไม่เกิน 1 MiB, JSON body ไม่เกิน 2 MiB |
| upload streams พร้อมกันใน instance | 2; เกินให้ 429 พร้อมแนวทาง retry ไม่พัก body ไม่จำกัด |
| staging รวม / ชุดที่ยังไม่หมดอายุ | 512 MiB / 100 ชุด; จองโควตาก่อนรับ bytes |
| ชุด open ไม่คืบหน้า / ชุด ready ยังไม่ใช้ | 1 ชั่วโมง |
| อายุ open สูงสุด | 4 ชั่วโมง แม้มีความคืบหน้า; hard cap ต้องแจ้งผู้เรียก |
| request รับไฟล์ | idle 60 วินาที, สูงสุด 10 นาทีต่อ attempt; retry รายไฟล์ได้ |

Owner clarification after U0: callers may send large originals and expect the
service to prepare them, rather than routinely resizing before upload. The 10 MiB
draft value above is not an accepted default. Separate intake byte limits from
prepared-image pixel/quality limits. Test large JPEG/PNG originals, including
files above 10 MiB, through streaming intake before choosing defaults; image
decoding/downsampling remains 0.1.2. A successful upload alone proves neither
that decoding is safe nor that the image fits the eventual PDF quality budget.

expected_bytes ต้องนับตรวจจริง ไม่เชื่อ Content-Length อย่างเดียว; จองโควตาแบบ atomic
และคืนเมื่อ attempt จบ/ผิดพลาด/restart ไม่ต่ออายุจาก polling
ค่า pixel/decode/ความละเอียด PDF เป็นงาน I0–I2 ไม่แต่งค่ารับรองขึ้นจาก byte limit
ต้องวัด near-limit, concurrent stream และ disk-full ใน U1/U4 ก่อนยืนยันค่าเริ่มต้น
503/429/413 ต้องไม่ทิ้งชุดหรือไฟล์ที่ระบบคิดว่าสำเร็จทั้งที่รับไม่ครบ

### ขอบเขตไฟล์ลงมือที่คาดไว้และจุดรับแบบ

Service: กลุ่ม `src/uploads/` รับผิดชอบ contracts/repository/service,
storage แยกใน `src/storage/`, routes แยกจาก server factory,
migration ใหม่, startup/recovery/cleanup wiring และ Compose staging volume
tests ครอบคลุม stream, DB transitions, expiry และ HTTP end-to-end;
Core ไม่เปลี่ยนใน U0/0.1.1 ตามผลตรวจนี้

ไม่เพิ่ม framework/queue ภายนอกในการร่างนี้ การเลือก Fastify stream parser
และ enforcement ของ timeout ต้องตรวจ API ของรุ่นที่ติดตั้งตอนทำ implementation plan
U0 discovery เสร็จในขอบเขตอ่าน source และร่างสัญญา; ขั้นรับแบบยัง pending
จุดขอเจ้าของทบทวนคือ API แบบสองช่วง, ready ที่ยังไม่ fetch URL,
หนึ่งชุดต่อหนึ่ง job และ limits ที่เป็นค่าเริ่มทดลอง ไม่ใช่คำถามเปิดทั้งหมดใหม่
เมื่อรับแบบแล้วจึงแตกแผน U1–U4 พร้อม test cases; ยังไม่เปลี่ยนโค้ดหรือ release

Owner instructed proceeding after clarifying large-original handling. The bounded
[U1–U4 implementation plan](flowdoc-upload-staging-0.1.1-plan-2026-10-08.md)
now records the next steps. API/DB choices below remain design decisions to check
against implementation; no product behavior is claimed by the plan.

## จุดที่ต้องลงรายละเอียดก่อนลงมือ

### I0 design proposal — 2026-10-08

Status: proposed for owner review, not an implemented contract. Bounded discovery
after accepted local upload staging; Planning Partner role, execution IDs N/A.
Owners: Service for resource lifecycle/preparation; Core for typed binding, layout
and PDF objects. Scope/document budget: this existing draft only until the design
is reviewed; no product edits, dependency installation or release changes.

Inspection: Core `composition/resolvedDocument.ts` and `template/types.ts` currently
allow text/table nodes only; `pdf/drawContract.ts` and `pdf/writePdf.ts` draw text
and borders, with no image resource interface. Service `jobs/processor.ts` calls
render directly, and `jobs/repository.ts` marks interrupted running jobs failed.
Therefore this requires an explicit cross-repository interface, not simply adding
a decoder dependency. Baseline branches are `codex/template-binding` (Core) and
`codex/template-registry` (Service, upload proof `f7610f7`).

Proposed decisions:

1. Add a separate `image` block with a required width/height in existing Length
   units and an image-field binding. The image variable carries only a resource ID;
   it may occur in global or format-local scope. No URL/Base64/host path goes inside
   the composed document. Table cells and inline images remain excluded. Preserve
   old text/table contracts and snapshots; explicitly version any widened contract.
2. A job request may reference one finalized uploadId. Validate every bound resource
   against that set, then claim the set and insert the job in one transaction under
   the session lock. An identical retry of that claim returns its original job;
   different template/version/input is a conflict. One set serves one job initially.
   Queue/running jobs pin original and prepared files; terminal jobs retain them
   for one hour before cleanup. Restart preserves queued claims; interrupted running
   jobs keep the existing failed-job policy and release only on terminal lifetime.
3. Prepare once before layout. Proposed default 200 DPI, no pixel upscaling,
   proportional inside fit, centered in the fixed frame, EXIF orientation applied.
   JPEG remains JPEG at quality 90; PNG stays lossless with alpha. Convert colour
   to sRGB and remove unrelated metadata. Repeated use at different frame sizes
   gets a per-job derivative keyed by source checksum and target pixel dimensions.
4. Recommend Sharp in Service, pinned after the Linux/amd64 package probe. Its
   documented constructor exposes orientation and input-pixel limits; resize offers
   inside-fit and withoutEnlargement. Alternatives considered: Python Pillow would
   add a second orchestration boundary; decoding in Core would mix untrusted-input
   preparation with the renderer. Neither is selected for this slice.
5. Core receives only bounded prepared resources: dimensions plus encoded JPEG,
   or normalized RGB/alpha planes for PNG. PDF embeds JPEG as an image object;
   PNG uses compressed RGB plus an alpha soft mask. Core validates buffer lengths,
   references and bounds; it never fetches URLs or reads arbitrary client paths.
   The internal binary map is separate from persisted JSON and immutable job input.
6. A frame that fits a page but not the remaining space moves intact to the next
   page. A frame larger than the printable page is a template error; never silently
   clip or shrink the authored frame. Missing/invalid image bytes leave the frame
   blank with a resource-specific warning; an invalid binding/request is rejected.
7. Proposed preparation budgets to verify: 40 megapixels/input, 8 megapixels/output,
   one decode process at a time, 30 seconds/image and 5 minutes preparation/job;
   uploaded byte/count limits remain 0.1.1 limits. Decode in a killable child process;
   a timeout must actually terminate work. Validate memory under a fixed container
   budget before accepting these defaults; pixel metadata alone is not isolation.
8. URL policy: HTTPS public destinations only, no credentials, no forwarded user
   authentication, bounded redirects (three), 50 MiB/body and 30 seconds/download.
   Validate all resolved addresses and pin the validated address for each connection;
   revalidate every redirect. Private/loopback/link-local destinations are rejected.
   URL failures become image warnings; no refetch during layout or PDF painting.
9. Polling adds actual stages `preparing-resources` and `rendering`, with completed,
   total and warning counts for preparation; no fabricated overall percentage/ETA.
   Processing warnings must be persisted separately from immutable accepted-input
   warnings and combined in the public result without rewriting accepted snapshots.

Acceptance examples: landscape/portrait, transparent PNG, EXIF JPEG, small image,
4K downsample, repeated source at two sizes, broken image, blocked URL/redirect,
mixed good/bad images, page boundary, expired/wrong-set references, claim retry,
queued/running restart and terminal cleanup. Inspect rendered PDF pages and embedded
pixel dimensions; then test packed Core in Service with baseline text/table PDFs.
No DOCX, crop editor, shared media library, nested image cells or release promotion.

Primary dependency references (reviewed 2026-10-08):
[Sharp constructor](https://sharp.pixelplumbing.com/api-constructor/) and
[Sharp resizing](https://sharp.pixelplumbing.com/api-resize/).
These support API suitability only; no native-runtime, image-quality or memory
acceptance is claimed before the implementation/package probe.

Owner accepted I0 and confirmed 200 DPI as the starting density, conditional on
actual-size legibility. Execution is tracked in the
[0.1.2 implementation plan](flowdoc-image-preparation-0.1.2-plan-2026-10-08.md).
Stages A–D now have bounded local development acceptance, including job/PDF
integration, UAT visual inspection and a 40 MP constrained-memory probe. See the
implementation plan's Stage D result for coverage and limits. Service/Core are
development 0.1.2; no release promotion is implied.

1. 0.1.1: รูปแบบ upload session, รายการไฟล์, finalize, retry และคำขอ JSON/Base64
   รวมจังหวะรับ job เมื่อใช้ URL; ไม่ล็อก endpoint/DB schema จากร่างนี้ทันที
2. 0.1.1: เพดาน bytes/จำนวนรายการ/เวลา อายุกลางสูงสุด และการวัดยืนยันค่าจริง
   รวมข้อจำกัดงานที่ยังอัปโหลดไม่ครบและการเข้าถึง resource reference
3. 0.1.1 → 0.1.2: ความเป็นเจ้าของ staging, pin/reuse ระหว่างงาน, restart/cleanup
   และข้อมูลสถานะที่ต้องเก็บถาวรเทียบกับไฟล์ชั่วคราว
4. 0.1.2: ความละเอียดเป้าหมาย วิธีลดพิกเซล/บีบอัด การรักษา transparency
   และ mapping กรอบเอกสารกับภาพที่ใช้ซ้ำต่างขนาด
5. 0.1.2: ขอบเขต required validation กับ image warning และ scheduler ของขั้นเตรียม
   เพื่อไม่ให้การรับข้อมูลหรือหลายรูปพร้อมกันกินทรัพยากรเกินเพดาน

เรื่องลิงก์ภายนอก หัวข้อสารบัญ และพฤติกรรมเซลล์รวมคงเป็นคำถามของหัวข้อนั้น
ไม่ต้องแก้ทุกประเด็นก่อนเริ่มรูปภาพ แต่ต้องไม่เปลี่ยนสัญญาร่วมแบบเงียบ ๆ
สถานะล่าสุด 2026-10-08: U0 และแผน U1–U4 นำไปสู่ implementation candidate
Service `9f9712c` และชุดตรวจเพิ่มเติม `f7610f7` บน branch พัฒนาแล้ว
ปิด acceptance สำหรับ upload staging ใน local ด้วย 69 tests และการรับภาพใหญ่
ภายใต้เพดานหน่วยความจำจริง ตาม
[Follow-up acceptance](flowdoc-upload-staging-0.1.1-plan-2026-10-08.md#follow-up-acceptance--2026-10-08)
ต่อมาแผน 0.1.2 สำหรับเตรียมภาพผ่านการตรวจรับในขอบเขต local แล้ว ตาม
[Stage D result](flowdoc-image-preparation-0.1.2-plan-2026-10-08.md#stage-d-result--bounded-local-acceptance-2026-10-08)
Service และ Core ฝั่งพัฒนาเป็น 0.1.2; หัวข้อถัดไปคือตารางรวมเซลล์
release/tag 0.1.0 คงเดิมตามคำสั่งเจ้าของ และค่า limits ด้านบนเป็นประวัติข้อเสนอ U0
ให้ดูค่า staging ปัจจุบันกับขอบเขตหลักฐานจากแผนดังกล่าว ไม่ใช่ข้อรับรอง production


สถานะหัวข้อลิงก์ 2026-10-09: implementation candidate Core/Service 0.1.4
ผ่านการตรวจอัตโนมัติและภาพ PDF แล้ว แต่ยังรอลองกดลิงก์ในโปรแกรมอ่าน PDF
ตาม [ผลการทำงานและข้อค้าง](flowdoc-links-plan-2026-10-09.md#execution-result--2026-10-09)
ยังไม่ปิด acceptance ไม่รวมสารบัญอัตโนมัติ และไม่เปลี่ยน release/tag 0.1.0


อัปเดตหลังเจ้าของทดลอง 2026-10-09: ยืนยันว่าไฟล์ลิงก์ใช้งานได้แล้ว
ปิดการตรวจรับหัวข้อลิงก์ 0.1.4 ในขอบเขต local และรวม Core เข้ากิ่งพัฒนาแล้ว
ตาม [Owner acceptance](flowdoc-links-plan-2026-10-09.md#owner-acceptance-and-development-integration--2026-10-09)
หัวข้อถัดไปคือสารบัญอัตโนมัติ; release/tag 0.1.0 ยังคงเดิม
