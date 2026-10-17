# Layout, ภาพ, ตาราง, หัวท้าย และเลขหน้า

Authority Boundary: Project Control reference สำหรับ Area18 ตาม [baseline](README.md).
ค่าต่อไปนี้แยกค่าเริ่มต้นของ runtime ออกจากคำแนะนำในการออกแบบ.

## 1. หน่วย กระดาษ และพื้นที่

Length คือ `{value:number,unit:"pt"|"mm"}`; ห้าม number ลอย/`"10mm"`/`"100%"`.
1 inch=72pt=25.4mm; `pt = mm*72/25.4`.
Page ต้องระบุ size:"A4", orientation:"portrait" หรือ "landscape",
margin:{top,right,bottom,left} ครบ. ไม่มี default margin ใน schema.
Portrait 210×297mm; landscape 297×210mm. Margin >=0 และสองด้านรวมต้องน้อยกว่าหน้า.

```text
พื้นที่ body ตามแนวนอน = pageWidth − margin.left − margin.right
ความกว้างตาราง = sum(columns[].width)
ความกว้างข้อความใน cell = spanWidth − padding.left − padding.right
```

เช่น A4 portrait ขอบซ้ายขวา10mm → body190mm = 538.582677pt.
ตาราง530pt = 186.972222mm จึงแคบกว่า body ประมาณ3.03mm ไม่ใช่ renderer ทำผิด.
หากต้องการตาราง/กรอบภาพชิดแนวเดียวกัน ให้คำนวณจากฐานพื้นที่เดียวและใช้หน่วยเดียว
เช่นคอลัมน์30+125+35mm=190mm. นี่เป็น **ตัวอย่างการออกแบบ** ไม่ใช่ default ของระบบ.

Margin ไม่ใช่ padding ของ cell และไม่ใช่ช่องว่างที่ติดอยู่ในไฟล์ภาพ.
เมื่อเทียบต้นแบบให้แยกเส้นขอบตาราง พื้นที่ข้อความ และขอบสีจริงของภาพ.

## 2. TextStyle และความสูงข้อความ

เอกสารใหม่ใช้ schemaVersion=2: style ระบุ
`font:{kind:"library",releaseId:"UUID",weight:400,style:"normal"}` จาก `get_font_catalog`.
เลือก weight/style ที่มีจริงเท่านั้น; catalog คืน active และ default เป็นข้อมูลแนะนำ
ไม่แทน releaseId ที่บันทึกไว้. ใช้ `font:{kind:"unselected"}` เพื่อบันทึกค้างได้;
ต้องแก้ readiness ก่อน PDF. ฟอนต์ขาด/ตัวอักษรขาดไม่มี fallback หรือตัวหนา/เอียงสังเคราะห์.
`get_draft_font_readiness` ผูก expectedRevision และ sampleRequest เมื่อตรวจข้อความจริง;
ผลมี status, checkedScope, issues/path/styleIds/occurrences/remedy และ total/truncated.
คัดลอกเอกสาร retired ผ่าน `clone_template_draft` เพื่อคงสิทธิ์ tuple เดิมจาก Service;
นำ JSON มาเองไม่ได้สิทธิ์นั้น. schemaVersion=2 ไม่ใช้ฟิลด์ fontFamilyKey/fontWeight/fontStyle.

ตารางถัดไปสำหรับ schemaVersion=1 ของ Sarabun เดิม; fontSize/lineHeightPt ใช้ร่วมทั้งสอง schema.

| Field | ค่าที่รับ / Required |
| --- | --- |
| fontFamilyKey | `sarabun`, Required |
| fontWeight | normal/bold, Required |
| fontStyle | normal/italic, Optional; ปกติ normal |
| fontSize | `{value:positive number,unit:"pt"}`, Required |
| lineHeightPt | positive finite number, Required |

ชื่อ style กำหนดเองได้ เช่น body/heading/tableHead ไม่ใช่ชื่อสงวน.
ไม่มี font fallback/line-height ค่าเริ่มต้นที่ให้ละฟิลด์ Required ได้.
12pt/20pt และ16pt/28pt เป็นค่าตั้งต้นตัวอย่างไทย ไม่ใช่ข้อบังคับหรือค่าของ renderer.
ใน area.5 ความสูงบรรทัดจริงรองรับ ink สูงกว่า lineHeightPt โดยใช้ค่าที่มากกว่า
ระหว่าง lineHeightPt และ ascent+descent. อักษรไทยซ้อนอาจทำให้จำนวนหน้าเพิ่ม.
อย่าตัดเครื่องหมายไทยเพื่อให้ความสูงกลับเท่าเดิม.

## 3. ภาพ: กรอบไม่เท่ากับขนาดภาพที่วาด

ให้ภาพต้นทางมีพิกเซล W×H และกรอบ Fw×Fh ในหน่วยเดียวกัน:

```text
scale = min(Fw/W, Fh/H)
drawWidth = W*scale
drawHeight = H*scale
ช่องว่างซ้ายขวาภายในกรอบ = (Fw-drawWidth)/2
ช่องว่างบนล่างภายในกรอบ = (Fh-drawHeight)/2
```

ภาพ1000×200 กรอบ190×22mm: ภาพจริง110×22mm เหลือด้านละ40mm.
ถ้าจะเต็มกว้าง190mm โดยไม่ crop ให้กรอบสูง38mm.
ภาพ1000×100 กรอบ190×22mm: ภาพจริง190×19mm เหลือบนล่างด้านละ1.5mm.
แม้ ratio ตรงกันแต่ asset มีขอบขาวในพิกเซล ก็ยังเห็นเนื้อภาพไม่เต็ม.
การเพิ่ม DPI ไม่แก้ ratio; crop/เลือก frame ตามสัดส่วนต่างหาก.

ตรวจตามลำดับ: pixel bounds ของ asset → ratio → frame → available width → align
→ margin/placement. ห้ามตั้ง property fit ที่ไม่มีใน schema.
ภาพใน cell ถูกจำกัดด้วย padded content width. Header image ถูกจำกัดด้วย band width.

## 4. PageBand declaration

Header/footer เป็นคนละ object ของแต่ละ Section ไม่มี inheritance ข้าม Section.

| Field | Required / ค่า |
| --- | --- |
| inputSchema | Required; object fields รับ string/image/link เท่านั้น |
| fragment | Required; roots เป็น text-block/image/line/columns |
| baseTextStyleId | Required; style จริง ใช้ lineHeightPt เป็นความสูงขั้นต่ำของ band |
| sizing | Optional; content โดยมีขั้นต่ำ base lineHeight |
| gap | Optional Length>=0; ช่องว่างระหว่าง band กับ body; ละแล้ว0 |
| placement | Optional; ใช้กรอบปกติเมื่อไม่ระบุ; ดูด้านล่าง |

Sizing:

- `{mode:"content",minHeight?,maxHeight?}`: ความสูงตามเนื้อหาอย่างน้อย
  base style lineHeight และ minHeight ถ้ามี; เกิน maxHeight เป็น error.
- `{mode:"fixed",height}`: height >= base style lineHeight; ถ้าเนื้อหาเกินกรอบ
  เป็น error ไม่ได้ย่อ font/ตัดภาพอัตโนมัติ.
- min/max เป็น Length ไม่ติดลบและไม่น้อยกว่า base lineHeight;
  minHeight ต้องไม่มากกว่า maxHeight.

Placement แบบ page คือ
`{mode:"page",left:Length,right:Length,offset:Length}` โดยทุกระยะ>=0.
กำหนดแนวกรอบหัวท้ายจากขอบกระดาษแยกจาก body margin: width=pageWidth-left-right;
headerเริ่มที่offsetจากขอบบน, footerจบที่offsetจากขอบล่าง.
หากไม่ระบุplacement ใช้แนวซ้ายขวาbody และขอบบน/ล่างหลังหักmargin.
body top=max(innerTop,headerTop+headerHeight+gap);
body bottom=min(innerBottom,footerTop-gap).
พื้นที่ band/gap ที่กันไว้รวมกันห้ามเกิน40%ของความสูงหน้าในmargin
และbandต้องไม่ออกนอกกระดาษ มิฉะนั้น LAYOUT_FAILED.
นี่ไม่ใช่การวาง node แบบ absolute ทั่วไป. ตรวจ collision ด้วย preview ก่อนรับงาน.
อย่าใช้เพื่อซ่อนปัญหาข้อความทับหัวกระดาษ.

Columns แบ่งพื้นที่ที่เหลือหลังหัก gap ตามสัดส่วน weight.
เช่น weights1/2/1 และ gap0 → 25%/50%/25% ของ band.
สูงเท่ากับคอลัมน์ที่สูงที่สุด; child ภายในแต่ละคอลัมน์เรียงแนวตั้ง.
textAlign:center คือกลางคอลัมน์ที่ได้รับ ไม่ใช่กลาง band หรือกลางกระดาษเสมอ.
ดู [หลักการจัดแนวและตำแหน่งเลขหน้า](reference-mapping.md#4-การจัดแนวต้องระบุพื้นที่อ้างอิง)
ก่อนเลือก weight และลำดับเส้น/ข้อความใน footer.
คำว่า weight ไม่ใช่ pt. ระบุ image frame ให้ไม่เกินความกว้างคอลัมน์นั้น.

## 5. Header/footer mode กับ cover

all แสดงทุกหน้าใน Section; first เฉพาะหน้าแรกของ Section;
continuation เฉพาะหน้าถัดจากหน้าแรก; none ไม่แสดง.
role:cover ไม่แสดง bands และไม่นับเป็นหัวข้อในสารบัญ; coverต้องจบในหนึ่งหน้า
หากล้นเป็นlayout error ไม่ใช่การแตกcoverเป็นหลายหน้า.
ถ้าต้องการภาพบน cover ให้ใส่ image ใน authored body ของ cover.
อย่าสับสน source.kind:blank กับ role:cover หรือ page-break.

## 6. เลขหน้า

| numbering | พฤติกรรม |
| --- | --- |
| ไม่ระบุใน body | continue + visibility show |
| ไม่ระบุใน cover | exclude + visibility hide |
| `{mode:"continue",visibility?}` | นับต่อ |
| `{mode:"restart",startAt?,visibility?}` | เริ่มใหม่; startAt default1, positive safe integer |
| `{mode:"exclude",visibility?}` | ไม่ร่วมเลขหน้าที่นับ; current page field ใน band ใช้ไม่ได้ |

visibility hide ไม่ใช่ exclude: ซ่อนการแสดงกับไม่ร่วมการนับเป็นคนละเรื่อง.
cover ห้าม visibility show. หมายเลขที่ผู้อ่านเห็นไม่จำเป็นต้องตรงกับ index หน้า PDF.
`system-page-field` current/total ใช้ความกว้างช่องที่ประกาศเพื่อจัดหน้า;
เผื่อเลขหลายหลัก. ลิงก์ไปหน้าให้ใช้ anchor ไม่ใช้ตัวเลขที่เขียนค้างจากต้นฉบับ.

ตัวอย่าง footer กลาง:

```json
{"id":"page-label","type":"text-block","role":{"role":"paragraph"},
 "props":{"textStyleId":"body","textAlign":"center","pageFieldLayout":"compact"},
 "children":[{"id":"page-word","type":"text","text":"หน้า "},
 {"id":"page-current","type":"system-page-field","field":"current","width":{"value":24,"unit":"pt"}},
 {"id":"page-separator","type":"text","text":" / "},
 {"id":"page-total","type":"system-page-field","field":"total","width":{"value":24,"unit":"pt"}}]}
```

## 7. ตารางและการแบ่งหน้า

Cell padding default4pt ต่อด้าน ไม่ใช่4mm. ลด padding ทำให้ข้อความมีพื้นที่มากขึ้น
แต่ต้องเทียบความอ่านง่าย ไม่ใช้ค่าติดลบ. ไม่มีความสูง row แบบ arbitrary ในสัญญานี้.
Repeated header ต้องประกาศหัวตารางจริงเป็น row แรกและ headerRowCount:1.
Group keepStart รักษาจุดเริ่มกลุ่ม ไม่ได้สั่งเก็บทั้งกลุ่มในหน้าเดียว.

Page-break ต้องมาจากความหมาย เช่นเริ่มบทใหม่ ไม่ใช่ทุก6บรรทัดเพราะตัวอย่างหนึ่งพอดี.
การแบ่งข้อความเป็น chunks ใน request ทำให้ผู้ส่งข้อมูลต้องรับผิดชอบ layout มากขึ้น;
อย่ารับรองว่าเป็นโครงยืดหยุ่นก่อนทดสอบกับข้อความสั้น/ยาว/เพิ่มแถว.
หากพบ continuation ทับ band ให้เก็บ failing definition/request/page/error เป็น
หลักฐาน renderer defect แยกจากข้อผิดพลาดการตั้งค่า ไม่ทำให้ workaround เป็นข้อกำหนดระบบ.

## 8. เกณฑ์ตรวจความตรงต้นแบบ

ดู [แนวทางเลือกโครงจากต้นแบบ](reference-mapping.md) สำหรับตารางจัดแนวไม่มีกรอบ
เส้นคั่น ช่องลงชื่อ ความขัดแย้งระหว่าง PDF/JSON และเกณฑ์ตรวจข้อมูลต้นทาง.

ตรวจขอบและสัดส่วนด้วยภาพ ไม่ใช่แค่จำนวนหน้า: ตารางเริ่ม/จบแนวเดียวกันไหม,
คอลัมน์ถูกสัดส่วนไหม, header image เต็มส่วนที่ตั้งใจไหม, cell paddingถูกไหม,
หัวตารางซ้ำไหม, บทขึ้นหน้าใหม่ตามกฎไหม, เลขหน้าตรงสารบัญ/ลิงก์ไหม.
ระบุความต่างที่ตั้งใจและข้อจำกัดแยกกัน. Renderสำเร็จไม่ได้แปลว่ารูปแบบผ่าน.

## Format sizing v1 (development candidate)

Use `areaFormats[id].sizing`, never Area props or invocation data: omitted retains
legacy auto; `{mode:"auto"}` opts in; `{mode:"fixed",height:{value:100,unit:"pt"}}`
uses pt/mm. Model19, font schema1/2 only. Fixed requires a Section flow-root Area
and cannot contain TOC. Each `{format,data}` call owns an independent frame.
A fitting frame reserves its full height, including empty content. A frame that
does not fit the current page is not shown, consumes no space and is not moved.
Content stops at a whole line/image or protected table unit; tables close the
visible fragment. Later calls still run. Auto flows to the next page; explicit
auto can omit an image too tall for a fresh page, while legacy auto keeps its
existing failure. No automatic text/image shrink.

Inspect `formatSizing` in the live authoring contract before using this feature.
Partial success carries `FORMAT_CONTENT_OMITTED`, `FORMAT_FRAME_NOT_SHOWN` or
`FORMAT_IMAGE_NOT_SHOWN`, with Section/Area/Format and original entry index.
These are rendering warnings, not removed input: request/draft arrays remain
complete. Status and `save_preview_pdf` retain warnings, saved revision and
fingerprint. Successful partial PDF is not a complete reconstruction. A visible
reference/TOC to omitted content fails `LAYOUT_FAILED` with reason
`omitted-destination`; do not erase links or retry on guessed pages.
