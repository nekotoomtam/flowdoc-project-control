# Authoring API และ MCP tools

ชุดเตรียม FlowDocMake0.3.1 ใช้ API/tools เดิมกับ Service/Core0.5.2 และตรึง
Core checksum ตาม compatibility profile; ข้อความ0.3.0/0.5.0 ด้านล่างระบุ
baseline ที่ติดตั้งเดิม ไม่ใช่คู่รุ่นของ bundle0.3.1 ใหม่ เครื่องมือสร้างงานยังเป็น
PDF-only; การขอ DOCX ใช้ Service โดยส่ง `Output-Format: DOCX` ตามสัญญาเดิม
Service ยังรับ Model18/19 ไม่รับ Model20 อ่าน [ผลตรวจและข้อจำกัด](verification.md#052-prerelease-verification--2026-10-27)

Section19 Stage3 ในชุด FlowDocMake 0.3.0 เพิ่ม `create_draft_section` → `POST /authoring/drafts/:id/sections`
รับ expectedRevision/pageLayoutId/idempotencyKey และ `import_draft_sections` →
`POST /authoring/drafts/:id/sections/import` รับ sourceTemplateId/sourceRevision/
sourceSectionIds/expectedRevision/beforeSectionId/idempotencyKey กับ globalFieldRenames
เมื่อชื่อชน. ต้องเป็นเจ้าของทั้งสอง draft; ปลายทาง revision0 ใช้ split-copy ได้.
ผลคืน sectionIdMap/inserted และ revision ใหม่; source ไม่ถูกลบ. Whole clone ของ19
คืน ID ใหม่เช่นกัน;18 คง semantics เดิม. ดู capabilities จาก contract ก่อนใช้:
ช่วง3 ประกาศ `stage:3`, `coverArea:true`, `scopedToc:true`: ปกใน Area ใช้ fixed
text roots ได้เฉพาะ flow หลักของ Section; preview เป็นผู้ตรวจ overflow จริง.
TOC ของ19ต้องมี props.scope kind section/document; preview ตรวจ scope หลังขยาย
ข้อมูลและคืนเลข/ลิงก์ของหน้าเป้าหมายจริง. Clone คง scope ตาม Section เจ้าของใหม่.
19จาก candidate เก่าที่ไม่ระบุ scope ต้องกำหนดชัดเจน;18คงเดิม ไม่แปลงอัตโนมัติ.

Authority Boundary: Project Control reference ของ local Area18 และ Section19 Stage3
บน FlowDocMake 0.3.0 / Service 0.5.0 / Core 0.5.0 ตาม [baseline](README.md).
ไม่มีการอนุญาต publish จากเอกสารนี้; ตรวจ live get_authoring_contract ก่อนใช้งาน.

## DOCX development transport

ส่วนนี้อธิบาย Service development DOCX candidate ไม่ใช่ความสามารถใหม่ของ
FlowDocMake0.3.0 tools หรือคำยืนยันว่าชุดติดตั้งถูกเปลี่ยนแล้ว.
ใช้ template และข้อมูลธุรกิจเดิมผ่าน `POST /documents` โดยเลือก header
`Output-Format: DOCX`; ใช้ได้กับโหมดปกติและ `Task-Mode: queue-v1` ของ candidate.
ละ header หรือส่ง PDF จะคง PDF. อย่าส่ง outputFormat เพิ่มใน template/data
หรือ arguments ของ authoring tools ที่ไม่ได้ประกาศรับมัน.

ผล DOCX ใช้ MIME `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
นามสกุล.docx, pageCount:null, fieldRefresh:required, wordVerified:false และ
buffered:true. เก็บ receipt/hash กับไฟล์จริงและรอ output เสร็จก่อนใช้งาน;
32MiB เป็น output cap ไม่ใช่เพดาน RAM ทั้งงาน. ถ้าความสามารถไม่รองรับต้องรายงาน
DOCX failure ไม่แทนด้วย PDF. ตรวจ fields/TOC และ native Word PDF แยกตาม
[verification boundary](verification.md#core048-development-and-docx-boundary).
Service development0.5.2 ตรึง Core0.5.2; ชุดติดตั้ง0.5.0 ไม่เปลี่ยนตามคู่มือ
อ่าน [คู่มือ Service](../../../../flowdoc-service/docs/usage.md)
และ vendor manifest ของ candidate ที่เรียกจริงก่อนใช้เส้นทางนี้.

## ชื่อไฟล์ใน Service/Core development0.5.2

ตั้ง `defaultFileName` ระดับ root ของ definition ข้าง `docKey` ได้ เช่น
`"defaultFileName":"CLIS"` การบันทึก/อ่าน/clone และ immutable version รักษาค่านี้
และค่านี้มีผลต่อ fingerprint แต่ไม่เปลี่ยนเนื้อหาหรือการจัดหน้า
สำหรับ `POST /documents` ส่งชื่อแทนที่ด้วย `fileName` ใน JSON ของ multipart
part `payload` ข้าง `data`/`sections` โดย `Doc-Key` ยังเป็น HTTP header เดิม

```json
{"fileName":"รายงาน CLIS 2602S","data":{},"sections":[]}
```

ตัวอย่างแสดงตำแหน่งชื่อ ต้องเติมข้อมูล Section ตามโครงจริง ชื่อไม่มีนามสกุล
ใช้ `Output-Format` เลือก PDF/DOCX ตามเดิม ลำดับคือชื่อที่ส่งมา → ค่าเริ่มต้น
ของโครง → `document` ช่องว่างล้วนถือว่าไม่กำหนด ชื่อถูก trim/NFC จำกัด200
Unicode code points และ240 UTF-8 bytes; ชื่อ request ก่อน trim จำกัด240 bytes
ไม่รับ non-string, controls/format characters, path, อักขระ/ชื่ออุปกรณ์ต้องห้าม
Windows, จุดท้ายชื่อ หรือ suffix `.pdf`/`.docx` ไม่แก้ชื่อผิดให้เงียบ ๆ

ค่าเริ่มต้นถูกตรึงเมื่อสร้าง task และชื่อจริงถูกตรึงเมื่อ seal ก่อนเข้าคิว
การแก้โครงภายหลังไม่เปลี่ยนชื่องานเก่า task/output/artifact metadata คืน
`fileName` ที่ไม่มีนามสกุล; attachment header มีนามสกุล ชื่อไทยใช้ UTF-8
`filename*` พร้อม ASCII fallback `document` ไม่เปลี่ยน UUID ของ storage
ต้องใช้ migration026 กับ candidate นี้

ค่าตัวอย่าง: override `CLIS Bangkok` + DOCX ได้ `CLIS Bangkok.docx`;
ไม่ส่ง override และ default `รายงาน CLIS` + PDF ได้ `รายงาน CLIS.pdf`;
ไม่กำหนดทั้งคู่ได้ `document.pdf` ไม่เติมนามสกุลที่สองให้ชื่อที่ส่งผิด

ตัวอย่างเตรียม payload จากข้อมูล Section19 ที่มีอยู่ โดยรันจาก Project Control:

```powershell
$sample = Get-Content docs/examples/clis-model19/request-20.json -Raw |
  ConvertFrom-Json -AsHashtable
$docKey = $sample.docKey # ใช้เป็น Doc-Key header ของ target ที่ลงโครงนี้ไว้แล้ว
$payload = @{
  fileName = 'รายงาน CLIS 2602S'
  data = $sample.data
  sections = $sample.sections
} | ConvertTo-Json -Depth 100
```

นี่เป็นการเตรียมข้อมูล ไม่สร้าง draft/เผยแพร่หรือเรียก API ต้องมีโครงและฟอนต์
ของ target ที่ตรงกันก่อนใช้ อย่าส่ง `$sample` ทั้งก้อนเป็น multipart payload:
`docKey`/`version` ของ legacy sample ไม่ใช่ root keys ที่ `/documents` รับ
payload root รับเฉพาะ `data`, `sections`, `meta`, `fileName` ตาม contract
ส่วน lookup ใช้ JSON `{taskId}` ไม่ส่ง fileName เพื่อเปลี่ยนชื่องานที่ seal แล้ว
ผล `/documents` เป็น multipart feedback+artifact ไม่ใช่ PDF/DOCX ล้วน;
ต้องแยก binary part ตรวจจำนวนไบต์/hash และรอ response จบก่อนถือว่าได้ไฟล์ครบ
ชื่อที่บันทึกบนเครื่องของ client อาจมาจาก outputPath ของ client เอง ไม่เปลี่ยน
เพียงเพราะ server ส่ง Content-Disposition ใหม่

ส่วนนี้เป็น direct Service API; อย่าเติม arguments ให้ MCP tool ที่ไม่ได้
ประกาศรับ ชุดติดตั้ง FlowDocMake0.3.0 และ compatibility profile0.5.0 ยังเดิม
Core20 เป็นการทดลองผ่าน Core โดยตรง; Service0.5.2 ยังรับ Model18/19
ชื่อไฟล์ไม่ได้เพิ่มความสามารถเรียก Section ซ้ำใน Service

## 1. วงจรชีวิต

create identity → get draft → เตรียม definition/request → validate → save →
preview exact revision → poll → save PDF → ตรวจ → แก้ draftหากจำเป็น.
Create ส่งเพียง name/docKey/idempotencyKey ไม่ส่ง definition.
Revision0 เป็น empty ไม่ preview; saveครั้งแรกได้revisionใหม่.
`state:"ready"` แปลว่ามี definition ไม่ได้แปลว่า PDFผ่านreview.
Draft definition.version คง1 ขณะที่ revisionเพิ่มตามการบันทึก.

เลือก target แยกจาก candidate ตาม [กติกา draft](draft-selection.md): งานสร้างใหม่
ไม่ต้องรักษา ID ของตัวอย่างเก่า; งานซ่อม ID เดิมรักษา ID เว้นแต่ผู้ใช้อนุญาตตัวแทน.
flowdocmake 0.1.2 เพิ่ม `run_candidate_preview({planPath,mode,waitMs?})` สำหรับ
ขั้นตอนเชิงกลพร้อม checkpoint ผ่าน MCP; ไม่ใช่ HTTP endpoint ใหม่ของ Service.
อ่านรูปแบบ plan และทางเดิน ownership/stale/pending ในกติกาข้างต้นก่อนใช้.

## 2. Common transport

HTTPใช้ Bearer credential ของ principalที่มีสิทธิ์; MCPจัดการ credentialฝั่งserver.
อย่าใส่tokenในtemplate/request/คู่มือ/log. เจ้าของdraft/uploadต้องตรงprincipal.
MCP argumentsเป็น strict object: fieldเกินหรือชนิดผิดอาจถูกปฏิเสธก่อนถึงService.
ปกติ responseเป็น `{ok:true,value:...,warnings:[]}` หรือ
`{ok:false,issues:[...],warnings:[...]}`. MCPห่อ JSONใน text contentและisError;
resource/saveอาจใช้รูปแบบเฉพาะตามด้านล่าง.

ทุก issue ให้เก็บ code,path,message และ nodeId/sectionId/areaId/areaEntryIndex/
format เมื่อมี ไม่ต้องคาดว่าทุก errorมีทุกfield.
Limitในcontractเป็นข้อมูลของdeployment ไม่ใช่ความสามารถไม่จำกัด.

## 3. Draft tools / HTTP mapping

| MCP tool | Arguments | HTTP |
| --- | --- | --- |
| get_authoring_contract | `{}` | GET /authoring/contract |
| create_template_draft | name,docKey,idempotencyKey | POST /authoring/drafts |
| get_template_draft | templateId | GET /authoring/drafts/:id |
| update_template_draft | templateId,expectedRevision,definition,idempotencyKey | PUT /authoring/drafts/:id |
| validate_template | definition,sampleRequest? | POST /authoring/validate |
| preview_template_draft | templateId,expectedRevision,sampleRequest,idempotencyKey | POST /authoring/drafts/:id/previews |
| get_preview_status | jobId | GET /authoring/previews/:jobId |

`templateId`/`jobId`เป็น UUIDในtools. nameยาว1–200และไม่blank.
docKeyตรง regex `^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$`.
idempotencyKey string1–200. expectedRevision เป็นinteger>=0สำหรับsave,
>=1สำหรับpreview และต้องตรงค่าปัจจุบัน. ไม่เพิ่มrevisionในdefinition.version.

create/getคืน templateId,docKey,name,revision,state,definition,fingerprint.
emptyมี definition/fingerprint:null. saveคืนข้อมูลdraftพร้อมdiff, diffLimit200,
diffTruncated; เป็นการส่ง definitionครบชุด ไม่ใช่JSONPatch.
validateคืน fingerprint/composed: falseถ้าไม่มีsampleRequest, trueเมื่อprepare+composeผ่าน.
validateยังไม่พิสูจน์layout และไม่ได้save.
previewคืน jobId,templateId,revision,fingerprint,status:queued และwarningsของrequest.
ใช้get_preview_statusตรวจ status/outputAvailable ไม่เดาว่าสร้างjobแล้วมีPDF.
สถานะหลัก queued/running/succeeded/failed; failedให้อ่านissuesของงาน.

## 4. Retry และ concurrent updates

- Requestที่ผลไม่แน่นอน: retryด้วย idempotencyKeyเดิมและpayloadเดิม.
- เปลี่ยนข้อมูล: ใช้keyใหม่; keyเดิมคนละpayloadเป็น IDEMPOTENCY_CONFLICT.
- STALE_CURRENT: get draftใหม่ ตรวจความต่างก่อนบันทึก อย่าเพิ่มเลขrevisionด้วยการเดา.
- Receiptของpreviewเดิมอาจคืนjobเก่าแม้PDFหมดอายุ; keyใหม่จึงสร้างpreviewใหม่.
- Previewตรึง definition/revision/fingerprint ณเวลารับงาน;
  แก้draftภายหลังไม่แก้PDFงานเก่า.
- ไม่มีlist/delete/publish toolในauthoringชุดนี้ อย่าแต่งชื่อtoolหรือแก้DBแทน.

## 5. Upload ภาพ

| Tool | Arguments |
| --- | --- |
| create_preview_upload | requestKey,items:[{key,source:"upload",mediaType,byteSize}] |
| upload_preview_image | uploadId,resourceId,data:base64 string |
| finalize_preview_upload | uploadId |

requestKeyตรง `^[A-Za-z0-9_-]{1,128}$`; itemsไม่ว่าง;
mediaTypeเป็น image/png หรือ image/jpeg; byteSizeเป็นpositive integerของbytesจริง.
ใช้ uploadId/resourceIdที่createคืนมา ห้ามเดาUUID. base64ไม่ใส่data-URL prefix.
อย่าคัดbase64ผ่านคำตอบโมเดลทีละบรรทัด ใช้การอ่านไฟล์และส่งค่าผ่านเครื่องมือที่รองรับ.
ก่อนpreviewต้องfinalizeสำเร็จ และimage fieldในsampleRequestอ้างresourceIdจริง.

```text
validate_template: {definition, sampleRequest: coreRequest}
preview_template_draft: {..., sampleRequest: {...coreRequest, uploadId}, ...}
```

uploadIdอยู่เฉพาะsampleRequestของpreview ไม่อยู่definitionและไม่ส่งให้Corevalidate.
Changed previewใช้fresh owned uploadตามcontract ไม่คาดว่าclaimเก่ายังใช้ได้.
MCPbase64เส้นทางมีขนาดจำกัดเล็กกว่าuploadผ่านHTTPบางเส้นทาง;
อ่านuploadLimits.base64Bytesจริงก่อนส่ง อย่าเทียบแค่fileBytes.
Snapshotที่ตรวจ: fileBytes50MiB, setBytes200MiB, base64Bytes1MiB;
ค่าจริงให้live contractเป็นหลัก ไม่ใช่คำรับรองว่าทุกภาพต่ำกว่าlimitจะrenderได้.

## 6. รับ PDF

`save_preview_pdf({jobId})` ดาวน์โหลดbinaryตรงไปยังMCP host แล้วคืน
`{ok:true,value:{path,byteSize,sha256,mimeType:"application/pdf"}}`.
เปิดpathที่คืนมา ไม่ประกอบPDFจากbase64ด้วยการพิมพ์เอง.
ไม่มีoutputPath argument; rootกำหนดฝั่งhostและแต่ละครั้งได้โฟลเดอร์ใหม่.
defaultอยู่ Downloads/FlowDoc-previews; hostตั้ง AUTHORING_PREVIEW_DIRได้.
เรียกซ้ำอาจมีหลายไฟล์ ไม่ใช่idempotent filesystem write.

`get_preview_pdf({jobId})` คืนresource link
`flowdoc-preview://<jobId>/pdf`; clientต้องอ่านMCPresource binaryได้.
HTTPbinaryคือ GET /authoring/previews/:jobId/pdf พร้อมauthorization.
ไม่อ่านresource linkเป็นไฟล์แล้วคัดข้อความเหมือนPDFข้อความ.
APIสำเร็จไม่ได้แปลว่าlocal saveสำเร็จ; ตรวจfilebytes/hashและเปิดPDFจริง.

## 7. Error reference และการแก้

| Error | สิ่งที่ต้องทำ |
| --- | --- |
| INVALID_TEMPLATE | ตรวจproperty/path/ตำแหน่งnode/graph/schema; ไม่ตัดข้อมูลเพื่อซ่อน |
| INVALID_DATA / TYPE_MISMATCH | ตรวจชนิดค่ากับschemaและdocKey/version |
| MISSING_REQUIRED | เติมค่าจากแหล่งยืนยันได้ หรือแก้schemaเมื่อจริงๆoptional |
| UNKNOWN_VARIABLE warning | ตรวจtypo/fieldที่ตกจากschema; ค่าอาจถูกignored |
| UNKNOWN_SECTION / UNKNOWN_FORMAT | ใช้Section.key/Format.keyที่ประกาศในเจ้าของถูกต้อง |
| STALE_CURRENT | อ่านrevisionใหม่และทบทวนการแก้พร้อมกัน |
| DRAFT_EMPTY | save definitionก่อนpreview |
| TEMPLATE_IDENTITY_CONFLICT | docKeyชน; อ่าน/เลือกidentityให้ถูก ไม่ลบของคนอื่น |
| IDEMPOTENCY_CONFLICT | เปลี่ยนkeyสำหรับlogical requestใหม่ |
| TEMPLATE_NOT_FOUND / UPLOAD_NOT_FOUND | ตรวจIDและเจ้าของprincipal; อย่าเลี่ยงสิทธิ์ |
| IMAGE_JOBS_UNAVAILABLE | ตรวจdeployment capability; ไม่ใช่schemaภาพไม่รองรับ |
| EMPTY_CONTENT | หลังcomposeไม่มีเนื้อหาที่ใช้ได้; []ผ่านtypeอาจยังออกPDFไม่ได้ |
| LAYOUT_FAILED | อ่านnode/page/บริบทและเก็บfailing input; validateไม่รับรองpagination |
| save/download failed | ตรวจjob availability/output TTL/สิทธิ์โฟลเดอร์; อย่าอ้างไฟล์สำเร็จ |

รายการไม่ใช่ทุกoperational errorของService; เก็บcodeจริงที่ได้รับและไม่แต่งความหมาย.
คำว่าunknown schemaจากตัวอย่างที่ไม่ครบไม่ใช่errorจากvalidator.

## 8. Publish boundary และการจบงาน

Authoring MCPไม่มีpublish toolและpublicationEnabled:falseในcontractที่ตรวจ.
งานเต็มจบเมื่อได้PDFและตรวจcoverage/ข้อความ/ภาพ/สารบัญ/ลิงก์ตามขอบเขตจริง.
การเผยแพร่ต้องผู้ใช้ยืนยันแยกต่างหากผ่านเส้นทางที่ได้รับอนุญาต.
อย่าส่งfinalว่ากำลังทำต่อเมื่อturnจบ; ใช้progressระหว่างทำและรายงานblockerจริง.

## คลังฟอนต์ (FlowDocMake 0.3.0; เริ่มใน Service/Core 0.4.0)

`get_font_catalog({cursor?,limit?:1..100,familyId?})` → GET /authoring/fonts;
คืน releases/nextCursor และ faces จริงพร้อมน้ำหนักสามค่า; retired ไม่เปิดเลือกเพิ่ม.
`get_draft_font_readiness({templateId,expectedRevision,sampleRequest?})` →
POST /authoring/drafts/:id/font-readiness ตรวจ draft ของเจ้าของใน revision เดียว;
ไม่มี sampleRequest ตรวจ styles; มี sampleRequest ตรวจ actual_input.
`clone_template_draft({templateId,sourceRevision,name,docKey,idempotencyKey})` →
POST /authoring/drafts/:id/clone; ใช้สิทธิ์จากต้นฉบับที่ Service ตรวจ ไม่ส่ง grant เอง.
save สำเร็จแยกจาก fontReadiness ready/blocked/incomplete; stale ต้องอ่านใหม่ก่อนแก้.
ขั้นเลือกฟอนต์อยู่ใน [TextStyle](layout.md#2-textstyle-และความสูงข้อความ).
ผู้ดูแลใช้ Service CLI/API ด้วย credential แยก; FlowDocMake ไม่ได้เครื่องมือนำเข้า/ออกใช้.

## ตัวช่วยความสูงฟอนต์ (FlowDocMake 0.3.0)

ใช้ pt จริงตามปกติ; เปลี่ยนฟอนต์ธรรมดาคง pt เดิม. ถ้าเจ้าของเลือกปรับความสูง ให้เรียก
`propose_font_height_adjustment({templateId,expectedRevision,styleId,targetFont,idempotencyKey})`
โดย targetFont เป็น `{kind:'library',releaseId,weight,style}` จากคลังที่มีสิทธิ์.
ข้อเสนอไม่แก้ draft: แสดง proposedFontSizePt กับ `layoutCheck:'not_checked'` ให้ผู้ใช้เลือกก่อน.
เมื่อเลือกใช้แล้วจึงเรียก `confirm_font_height_adjustment({templateId,proposalId,expectedRevision,idempotencyKey})`.
Service เปลี่ยน font+pt พร้อมกัน คง lineHeightPt และทุก node ที่ใช้ shared style เดียวกันได้รับผล.

ข้อเสนออายุ 15 นาที; stale/expired/profile เปลี่ยนต้องอ่านใหม่และขอเสนอใหม่. Retry คำขอเดิม
ใช้ key/body เดิมและได้ผลเดิม; key เดิมต่าง body ถูกปฏิเสธ. ยกเลิกคือไม่ confirm.
ไม่มี profile ใช้ pt ปกติต่อได้; schema1 Sarabun คืน unavailable ไม่แปลง schema อัตโนมัติ.
รุ่น retired ใช้ได้เฉพาะ exact tuple ที่ draft สืบทอดมา ไม่ให้สิทธิ์จาก family หรือ JSON ผู้ใช้.
Catalog heightProfile บอกผล review เบื้องต้น; availability จริงต้องผ่าน propose/confirm อีกครั้ง.
หลังยืนยันตรวจ readiness/preview ตามเดิม; ผลบันทึกไม่ใช่หลักฐาน PDF/ความเหมือนทางภาพ.

## Format sizing v2 (FlowDocMake 0.3.0)

Use `areaFormats[id].sizing`, never Area props or invocation data: omitted retains
legacy auto; `{mode:"auto"}` opts in; `{mode:"fixed",height:{value:100,unit:"pt"}}`
uses pt/mm. Model19, font schema1/2 only. Fixed requires a Section flow-root Area
and cannot contain TOC. Each `{format,data}` call owns an independent frame.
Each fixed call reserves min(declared maximum, current page remainder), even
when empty. Positive space renders fitting whole units; only zero remaining
space omits the frame. Fixed never moves or retries its omitted remainder.
Content stops at a whole line/image or protected table unit; tables close the
visible fragment. Later calls still run. Auto flows to the next page; explicit
auto can omit an image too tall for a fresh page, while legacy auto keeps its
existing failure. No automatic text/image shrink.

Require `formatSizing.version:2` and `diagnosticsVersion:1` in the live contract.
Version1 uses the prior whole-frame gate and is incompatible with FlowDocMake 0.3.0.
Partial success carries `FORMAT_CONTENT_OMITTED`, `FORMAT_FRAME_NOT_SHOWN` or
`FORMAT_IMAGE_NOT_SHOWN`, with Section/Area/Format and original entry index.
These are rendering warnings, not removed input: request/draft arrays remain
complete. Status and `save_preview_pdf` retain warnings, saved revision and
fingerprint. Successful partial PDF is not a complete reconstruction. A visible
reference/TOC to omitted content fails `LAYOUT_FAILED` with reason
`omitted-destination`; do not erase links or retry on guessed pages.
