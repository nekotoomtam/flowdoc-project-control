# ตัวอย่างครบชุดและวิธีตรวจ

Authority Boundary: Project Control documentation fixtures สำหรับ Model19
และตัวอย่าง Model18 เดิมที่แยกเป็น legacy. ไม่มีการsave/publishในtest scripts.

## เริ่มงานใหม่: Model19

- โครง Section19: [definition](../../examples/section-area-contract-20261017/single-section.definition.json)
  และ [preview body](../../examples/section-area-contract-20261017/single-section.preview-body.json).
- CLIS Inward ที่ย้ายจากชุดทดลองจริง: [template](../../examples/clis-model19/template.json),
  [ข้อมูล20รายการ](../../examples/clis-model19/request-20.json),
  [ข้อมูล60รายการ](../../examples/clis-model19/request-60.json).

CLIS ใช้ schemaVersion2 กับคลังฟอนต์เดิม และเส้น B `thickThinWideGap`
จึงต้องใช้ Core0.5.1 ที่มีสไตล์นี้ ไม่ใช่คู่ runtime0.5.0 ของ FlowDocMake0.3.0
ที่ติดตั้งอยู่. UUID Section ในตัวอย่างเป็น identity ของไฟล์ตัวอย่าง ไม่ใช่ ID
ของ draft ที่บันทึกบน Service. งานใหม่ต้องใช้ identity ที่ Service คืนมา;
อย่าถือว่าไฟล์ตัวอย่างถูก save หรือใช้ผ่าน HTTP แล้ว.

Request ใช้ `sections:[{id,data,header?,footer?}]` จับคู่ saved ID ทุกตัว
ครั้งเดียว; ไม่มี Section.key/formats. รายการและ footer ของ CLIS ชุดนี้คง
พฤติกรรม Inward เดิม ไม่ใช่การออกแบบกลุ่ม Port ของ Outward ใหม่.
Model18 ด้านล่างเก็บไว้สำหรับอ่านและตรวจงานเดิม ห้ามใช้เริ่มโครงใหม่.

## 1. ตัวอย่าง Model18 เดิม: TOC + รูปหัว + ตาราง + ตัวแปรร่วม

- [reference-template.json](../../examples/ai-template-authoring/reference-template.json)
- [reference-request.json](../../examples/ai-template-authoring/reference-request.json)
- [สคริปต์ตรวจ](../../../tools/check-developer-authoring.mjs)
- [ตรวจปลายทาง PDF](../../../tools/check-developer-authoring-pdf.py)

ไฟล์templateเป็นCore definitionเต็ม; เมื่อนำไปsaveผ่านauthoringต้องเปลี่ยน
templateId/docKeyเป็นidentityที่createคืนมา และเปลี่ยนrequest.docKeyตาม.
ใช้definition.version:1 ตามเดิม อย่าเอาrevisionมาแทน.
ไฟล์requestมีresource UUIDสมมติสำหรับtest. ในAPIจริงต้องuploadภาพของตนเอง
แล้วแทนresourceIdพร้อมแนบuploadIdเฉพาะขั้นpreview.

โครงตัวอย่าง:

| ส่วน | Declaration | สิ่งที่ควรเห็น |
| --- | --- | --- |
| ชื่อเอกสาร | global.projectName → field-ref | เปลี่ยนข้อมูลแล้วชื่อเปลี่ยน |
| รุ่นเอกสาร | global.documentVersion → footer | เปลี่ยน1.0เป็น2.0แล้วทุกหน้าเปลี่ยน |
| Header | global.headerBanner → image 190×19mm | ภาพ1000×100เต็มกรอบโดยไม่บิด |
| บท | local.title/anchor → text-block/toc | สารบัญมีชื่อและเลขหน้า พร้อมinternal link |
| ตาราง | requirements[] → row repeat | เพิ่มแถวได้โดยไม่เพิ่มnode |
| ขึ้นหน้า | new-page AreaFormat | บทสองขึ้นหน้าใหม่ |
| ลิงก์ภายนอก | global.manual:link | มีURI annotationจริง |
| เส้น | line propsว่าง | เส้นเต็มพื้นที่ ความหนา0.5pt |

Baselineมี2หน้า. สคริปต์เพิ่ม45แถวไทยก่อนบทสองและเปลี่ยนVersionเป็น2.0
ได้4หน้า; สารบัญบทสองเปลี่ยนจาก2เป็น4 และlinkปลายทางเปลี่ยนตาม.
ตัวอย่างเน้นความสามารถและแนวกรอบ ไม่ใช่การถอดแบบ SRS98หน้า.

## 2. รันทดสอบโดยไม่ใช้ Service

```text
node tools/check-developer-authoring.mjs <absolute-core-dist-index.js> docs/examples/ai-template-authoring
```

ใช้แพ็กเกจที่ติดตั้งจากartifactที่ระบุในbaseline ไม่ใช้distเก่าจากcheckoutโดยไม่ตรวจรุ่น.
คำสั่งนี้ตรวจtemplate,prepare,composeและnegative cases; ยังไม่render.
หากมีruntime/native/font/PythonของCoreพร้อม ให้เพิ่มoutput directoryเป็นargumentที่3.
สคริปต์จะสร้างbaseline.pdf,expanded.pdfและdraw JSONในoutputนั้น.
ภาพsolidสีน้ำเงินสร้างในหน่วยความจำเป็นRGB resourceสำหรับทดสอบCore;
นี่ไม่ใช่request shapeสำหรับHTTPupload.

```text
node tools/check-developer-authoring.mjs <core-dist-index.js> <example-directory> <output-directory>
python tools/check-developer-authoring-pdf.py <output-directory>
```

Pythoncheckerต้องมีpypdf. Renderเครื่องที่ไม่มีnative dependencyไม่ผ่าน
ต้องรายงานNOT_RUN/ข้อผิดพลาด ไม่สรุปจากcomposeว่าภาพผ่าน.
ตัวอย่างการrenderภาพPDFเพื่อดู:

```text
pdftoppm -scale-to 1200 -png <output-directory>/baseline.pdf <output-directory>/baseline
pdftoppm -scale-to 1200 -png <output-directory>/expanded.pdf <output-directory>/expanded
```

เปิดครบทุกหน้าทั้งสองเล่ม ตรวจตาราง/หัวซ้ำ/ข้อความ/เลขหน้า/แนวภาพ.
อย่าสรุปว่าลิงก์ถูกจากข้อความสีน้ำเงิน ต้องตรวจannotationปลายทางหรือเปิดกดจริง.

## 3. ตัวอย่างเดิมที่ใช้ร่วมกัน

| Example | Definition / Request | ครอบคลุม |
| --- | --- | --- |
| requirements | [template](../../examples/ai-template-authoring/requirements-template.json) / [request](../../examples/ai-template-authoring/requirements-request.json) | Area, new-page, global/section/local/item, ตารางและpage field |
| grouped | [template](../../examples/ai-template-authoring/grouped-template.json) / [request](../../examples/ai-template-authoring/grouped-request.json) | กลุ่มบริษัท/สมาชิก, group/item, empty group, keepStart |

ตรวจสองคู่เดิมด้วย:

```text
node tools/check-ai-authoring-examples.mjs <absolute-core-dist-index.js>
```

ไม่เปลี่ยนตัวอย่างเก่าให้กลายเป็นmonolithic template; เลือกไฟล์ตามความสามารถที่จะเรียน.
Property referenceครอบคลุมมากกว่าตัวอย่างเหล่านี้ อย่าใช้รายการตัวอย่างเป็นรายการ
ความสามารถทั้งหมด. ส่วนที่ไม่ได้renderในรอบเอกสารระบุในverification.

## 4. Acceptance สำหรับ Templateที่ใช้จริง

1. ประกาศschemaตรงข้อมูล ไม่มีUNKNOWN_VARIABLEที่ไม่ได้อธิบาย.
2. แหล่งข้อมูลPDF/JSONมีcoverage mapping ไม่ตกหมวดที่JSONไม่ได้ใส่มา.
3. เพิ่ม/ลดarrayแล้วจำนวนแถว/สมาชิกถูกต้อง รวมกรณีempty.
4. แก้globalหนึ่งค่าแล้วทุกตำแหน่งที่ควรอ้างร่วมเปลี่ยนตาม.
5. เพิ่มบท/ข้อความก่อนบทแล้วสารบัญ/เลขหน้า/ลิงก์เปลี่ยนตาม.
6. รูปไม่บิด ไม่เหลือช่องว่างผิดคาด; ตารางใช้ความกว้างและสัดส่วนตามต้นแบบ.
7. ข้อความยาวข้ามหน้าต้องไม่หาย/ซ้ำ/ทับband; ไม่ย่อข้อความเพื่อให้ผ่าน.
8. ไม่มีการpublishโดยอัตโนมัติ; full taskต้องถึงPDFที่ตรวจครบก่อนรายงานสำเร็จ.
