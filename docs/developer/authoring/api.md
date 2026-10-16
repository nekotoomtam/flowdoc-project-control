# Authoring API และ MCP tools

Authority Boundary: Project Control reference ของ local Area18 authoring Service.
ไม่มีการอนุญาต publish จากเอกสารนี้; ตรวจ live get_authoring_contract ก่อนใช้งาน.

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

## คลังฟอนต์ของ candidate 0.4.0

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

## ตัวช่วยความสูงฟอนต์ (development candidate หลัง 0.4.0)

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
