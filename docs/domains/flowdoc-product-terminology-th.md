# นิยามศัพท์ผลิตภัณฑ์ FlowDoc

## จุดประสงค์

เอกสารนี้อธิบายศัพท์ฝั่ง product ที่มักสับสนข้าม Project Control, Core,
Backend, Editor และงานออกแบบ frontend ในอนาคต ใช้คู่กับ glossary หลักที่
`docs/GLOSSARY.md`

เป้าหมายคือช่วยให้ agent แปลคำกว้างให้เป็นคำแคบก่อนเริ่มทำงานจริง เอกสารนี้
เป็นขอบเขตการใช้คำ ไม่ใช่หลักฐานว่า behavior นั้นมีอยู่ ไม่ใช่ผล test และไม่ใช่
หลักฐานความพร้อมของ product

## ขอบเขตอำนาจ

เอกสารนี้เป็นคำอธิบายภาษาไทยของ canonical English terminology สำหรับการคุยงาน
และส่งต่อบริบท English term ID ยังเป็นตัวหลักสำหรับ record, code symbol, test,
contract และ evidence packet

ห้ามยกระดับ FlowDoc product truth จากนิยามศัพท์เพียงอย่างเดียว คำที่ชัดขึ้นช่วย
ลดความหลงทางได้ แต่ไม่ทำให้ Core, Backend, Editor, feature หรือ compatibility
claim กลายเป็น `current`

## เมื่อไหร่ต้องอ่าน

อ่านเอกสารนี้ก่อน:

- งาน redesign ของ Editor หรือ frontend;
- งาน product behavior ใน Core, Backend หรือ Editor;
- งาน API, schema, migration, mutation, transport, preview หรือ capability
  ที่ข้าม repository;
- การเขียน plan หรือ evidence ที่ใช้คำซ้ำหลายบริบท;
- การตัดสินใจว่าคำหนึ่งควร define, split, rename, deprecated, context-only
  หรือ blocked

ถ้าคำที่ผู้ใช้หรือ agent ใช้ยังตีความได้หลายทาง ให้แปลเป็น canonical term ที่
แคบที่สุดก่อน ถ้ายังไม่ชัด ให้บันทึกเป็น `UNKNOWN`, `RISK` หรือ `BLOCKER`
แทนการเดา

## Ambiguity disposition

คำกำกวมในรอบงาน FlowDoc ควรได้ disposition อย่างใดอย่างหนึ่ง:

- `define`: เก็บคำเดิมไว้ แต่ระบุ owner/context ให้ชัดในรอบงานนี้
- `split`: คำเดียวครอบหลายสิ่ง ให้แยกเป็นคำที่มี qualifier
- `rename`: ชื่อชนกับคำอื่นใน FlowDoc ให้เปลี่ยนเป็นชื่อ canonical ที่ชัดกว่า
- `deprecated`: ไม่ใช้กับงานใหม่ ใช้ได้เฉพาะเมื่ออ้างเอกสารเก่า
- `context-only`: ใช้ใน prose หรือ handoff ได้ แต่ไม่ใช้ใน code, schema,
  public API, evidence ID หรือ canonical record
- `blocked`: ยังเลือกคำที่ปลอดภัยไม่ได้จนกว่า owner, evidence หรือ behavior
  จะชัด

เมื่อเป็น `split` ให้เติม owner หรือ runtime เช่น `Project Control Node`,
`Core runtime node`, `Backend document record` หรือ `Editor draft`

## ศัพท์ Core

### Document Package

`Document package` คือ payload และ graph ของเอกสารที่ Core เป็นเจ้าของตาม schema
version Core เป็นผู้ parse, validate, migrate และ mutate

อย่าใช้คำนี้แทน Backend storage row, Editor draft, Project Control Document
record, Markdown document หรือ exported file

### Core Runtime Node

`Core runtime node` คือ item ภายใน Core document graph เช่น section, table,
block, inline หรือ item ตาม schema อื่น ๆ

อย่าย่อเหลือ `Node` ถ้า Project Control อยู่ในบริบทเดียวกัน เพราะใน Project
Control คำว่า `Node` หมายถึง topic record ใน navigation/system map

### Package Version

`package version` คือ version ของ Core package/schema family ที่ document
package หรือ migration target ใช้ ไม่ใช่ Backend service version, app release,
npm package version หรือ lifecycle ของ Project Control document

### Mutation Result

`mutation result` คือ response ที่ Core ผลิตจาก document operation ที่ยอมรับ
แล้ว อาจรวม changed package, rejected operation, revision facts, diagnostics
หรือ output ตาม Core contract

อย่าใช้คำนี้แทน UI action ของ Editor หรือ HTTP response ของ Backend เว้นแต่ว่า
response นั้นส่ง Core mutation result อยู่จริง

### Migration Package

`migration package` คือ output หรือ target payload ของ migration ที่ Core เป็น
เจ้าของ Backend อาจเป็นผู้ขนส่ง และ Editor อาจเป็นผู้ขอ แต่รูปร่าง package และ
semantic version boundary เป็นของ Core เว้นแต่ record ที่แคบกว่าระบุเป็นอย่างอื่น

## ศัพท์ Backend

### Backend Document Record

`Backend document record` คือ service/storage และ transport record ของ Backend
สำหรับเอกสารหนึ่งชุด อาจมี document id, title, revision, timestamp, capability
facts และ Core document package payload ปัจจุบัน

อย่าเรียกสิ่งนี้ว่า `Document package` เว้นแต่กำลังพูดถึงเฉพาะ Core payload ที่
ฝังอยู่ข้างใน

### Backend Revision

`Backend revision` คือ marker ฝั่ง service สำหรับ concurrency หรือ freshness
ไม่จำเป็นต้องเท่ากับ Core package version, Editor draft version หรือ Project
Control evidence revision

### Capability Response

`capability response` คือ Backend API response ที่บอก supported Core package
versions, document versions, migration targets หรือ service capability facts

อย่าใช้ capability response เป็นหลักฐานว่า route, UI path หรือ deployment ใช้งาน
ได้ เว้นแต่มี evidence แยกที่ตรวจ path นั้นแล้ว

### Storage Record

`storage record` คือ durable persistence state ของ Backend แยกจาก Project
Control Repository Registry และ local test fixtures

## ศัพท์ Editor และ Frontend

### Editor Draft

`Editor draft` คือ browser-local editable state ที่ derive จาก Backend document
record หรือ fixture อาจมี selection, working copy, local status, preview input
หรือ pending UI changes

Editor draft ไม่ใช่ canonical storage, ไม่ใช่ Core document package ด้วยตัวเอง
และไม่ใช่ Project Control truth

### Preview

คำชี้แจงการใช้งานวันที่ 6 กันยายน 2026: การพิมพ์ต่อเนื่องตรงบนกระดาษแบบ WYSIWYG
เป็นทางหลัก เคอร์เซอร์และการเลือกข้อความอยู่บนเอกสารขณะจัดหน้าใหม่ แก้ได้เฉพาะ
ค่าฟิลด์ที่นิยามไว้ และค่าตรงกันกับฟอร์มด้านซ้ายซึ่งเป็นตัวช่วย การเปิดกล่องกรอก
ลอยทับหน้าไม่ถือว่าผ่านการพิมพ์ตรงบนเอกสาร นี่คือเกณฑ์รับงาน ไม่ใช่หลักฐานว่า
ระบบปัจจุบันหรือการป้อนภาษาไทยผ่าน OS IME ทำได้แล้ว

`Preview` คือหน้าจำลองเอกสารที่โต้ตอบได้ใน Editor ผู้ใช้กดเลือกและแก้ข้อมูล
ทดลองที่อนุญาตบนตัวเอกสาร แล้วเห็นเอกสารปรับตามข้อมูล รวมถึง Structure Pattern
Entries ตามสิทธิ์ของ Slot ช่อง Form หรือ JSON ใช้ช่วยได้ แต่ใช้แทนการแก้บน
เอกสารด้วยแบบกรอกแยกและผลลัพธ์ที่ดูได้อย่างเดียวไม่ได้

Preview เปลี่ยนเฉพาะข้อมูลทดลองของ draft หรือ frozen version ไม่แก้โครงสร้าง
Build นิยามฟิลด์ กฎ Slot หรือ frozen version และไม่หมายถึงการแก้ทุกอย่างได้
อย่างอิสระแบบ Word

แยกคำแบบ `split`: Build ใช้สร้างโครงสร้าง, Preview ใช้ทดลองข้อมูลบนเอกสารจำลอง,
ส่วน `PDF output inspection` ใช้เรียกการเปิดดู PDF ที่ส่งออก การใช้ PDF.js
แสดง PDF, canvas ที่ดูได้อย่างเดียว หรือสร้าง PDF สำเร็จ ไม่ถือว่าทำ Preview
ครบ การส่งออก PDF เป็นอีกการกระทำหนึ่ง ไม่ใช่เงื่อนไขก่อนแก้ข้อมูลบนเอกสาร

นิยามนี้ตามคำชี้แจงตูมวันที่ 5 กันยายน 2026 ใช้แทนนิยามที่เน้นดูผลอย่างเดียว
สำหรับงานถัดไป ไม่ใช่หลักฐานว่าทำงานได้แล้ว ดูตัวอย่างเกณฑ์รับงานใน
`flowdoc-preview-definition-correction-2026-09-05.md` และ Creator UX Contract
ที่ปรับแล้ว English terminology ยังคงเป็นตัวหลัก

### Build

คำชี้แจงการใช้งานวันที่ 6 กันยายน 2026: การเขียนเนื้อหาใช้การพิมพ์ต่อเนื่องตรงบน
เอกสาร ตัวควบคุมตามบริบทช่วยตั้งค่าโครงสร้าง การกรอกข้อความในฟอร์มข้างหน้าแล้ว
แสดงกระดาษที่แก้ตรงนั้นไม่ได้ ยังไม่ผ่านประสบการณ์หลัก ต้องแยกผลทดสอบกลไกออกจาก
การรับประสบการณ์ใช้งานเสมอ

`Build` คือการกำหนดโครงสร้าง ฟิลด์ sections, Structure Patterns, Slots และ
กฎหน้า ผู้ใช้เลือกส่วนที่เห็นบนเอกสารแล้วแก้โครงสร้างผ่านตัวควบคุมตามบริบท
Build กับ Preview เป็นคนละโหมดและแก้ข้อมูลคนละประเภท แม้แสดงหน้าคล้ายเอกสาร
เหมือนกัน ก็ไม่ทำให้ทั้งสองหน้ามีหน้าที่เดียวกัน

### Live Backend Mode

`live Backend mode` คือ Editor ถูกตั้งค่าให้เรียก Backend server จริง ปกติมัก
เป็น local loopback URL ใน smoke evidence ที่ยอมรับแล้ว

อย่าย่อเหลือ `live` โดยไม่บอก route, server, corpus, browser และ evidence
boundary

### Fixture Mode

`fixture mode` คือ Editor ใช้ local fixture data แทน live Backend ใช้ตรวจ UI และ
Core adapter ได้ แต่ไม่ได้พิสูจน์ Backend integration

### Outline Item

`outline item` คือ UI item ใน Editor ที่แทนโครงสร้างเอกสาร ถ้า item นั้นผูกกับ
Core data ให้เรียก backing value แยกเป็น `Core runtime node`

## ศัพท์ Document Structure

### Structure Pattern

`Structure Pattern` คือโครงย่อยของเอกสารที่คนสร้างกำหนดไว้เพื่อใช้ซ้ำในกรอบ
ที่ระบบควบคุมได้ โครงย่อยนี้มี layout, field definitions และพฤติกรรมการแสดงผล
แบบจำกัดสำหรับส่วนหนึ่งของ document structure

Structure Pattern ไม่ใช่ React component หรือ UI component และไม่ใช่ template
instance ที่คนสร้างเอาไปวางหลาย ๆ ชุดใน Build คนสร้างกำหนด pattern หนึ่งครั้ง
และวางหรือกำหนด `Structure Pattern Slot` ในโครงเอกสาร จากนั้น Preview หรือ
runtime data ในอนาคตจึงสร้าง `Structure Pattern Entry` ได้เป็นศูนย์ หนึ่ง หรือ
หลายรายการ ตามที่ published document version อนุญาต

ใช้ `Structure Pattern` เป็น product concept หลัก ส่วนชื่อ database แบบเก่า
ที่เป็น `component_*` ใช้เฉพาะเมื่อพูดถึง model v0.0.1 หรือ Backend foundation
ที่บันทึกไว้แล้ว และต้องแปลความหมายผ่านคำนี้

### Structure Pattern Slot

`Structure Pattern Slot` คือจุดหรือความสัมพันธ์ฝั่ง author-time ในโครงเอกสาร
ที่บอกว่า Structure Pattern หนึ่งตัวถูกอนุญาตให้ปรากฏตรงนี้ได้ Slot อยู่กับ
document draft หรือ frozen document version และอาจกำหนด order, local binding
scope, repeat allowance และ behavior อื่นที่อยู่ในกรอบของโครงสร้าง

Structure Pattern Slot ไม่ใช่จำนวนรายการจริงตอนใช้งาน อย่าอธิบาย Build ว่า
คนสร้างวาง `A A A` ของ pattern เดียวกัน เว้นแต่มี product decision ใหม่ที่
เปลี่ยนเรื่องนี้ ใน model ปัจจุบัน Build กำหนด slot ส่วน Preview หรือ runtime
data เป็นฝ่ายสร้าง entry

### Structure Pattern Entry

`Structure Pattern Entry` คือ occurrence หนึ่งรายการที่ถูกสร้างใน Preview หรือ
runtime จาก Structure Pattern Slot เช่น caller เพิ่มหลายรายการจาก slot ที่
repeat ได้ เมื่อ published document version อนุญาต

Structure Pattern Entry เป็นเรื่อง runtime/submission ไม่ใช่ขอบเขตของ
document-structure database model แรก นอกจากเป็น future domain ที่อ้างกลับมา
ยัง published document version

### Component

`component` ให้ถือว่าเป็น `split` โดยค่าเริ่มต้นใน FlowDoc ใช้ `UI component`
สำหรับ React หรือ frontend rendering unit ใช้ `Structure Pattern` สำหรับ
โครงย่อยเอกสารที่คนสร้างกำหนด ส่วน `component_*` ใช้เฉพาะชื่อ table เก่าหรือ
บริบท historical/v0.0.1 จนกว่าจะมี migration หรือ aliasing decision ภายหลัง

## ศัพท์ข้าม Repository

### Project Control Node

`Project Control Node` คือ topic record ถาวรใน Project Control navigation และ
system map มี truth state และอาจ link ไปยัง document, evidence, work และ
repository

อย่าใช้คำว่า `Node` เฉย ๆ ใน handoff ของ product implementation ถ้ามี Core
runtime node อยู่ในบริบทเดียวกัน

### Document Record

`Document record` คือ metadata ของ Project Control สำหรับ Markdown หรือเอกสาร
ถาวรอื่น ไม่ใช่ Core document package และไม่ใช่ Backend document record

### Evidence Packet

`evidence packet` คือ claim แบบมีขอบเขตพร้อม repository id, commit ที่แน่นอน,
path หรือ contract id, verification summary และ unknown ที่เหลือ รองรับเฉพาะ
claim ที่ระบุเท่านั้น

### Runtime

`runtime` ต้องมี qualifier เช่น `Core runtime`, `Backend runtime`, `Editor
runtime`, `browser runtime` หรือ owner อื่นที่ชัด ถ้าไม่ qualify ให้ถือว่า
`split` เป็นค่าเริ่มต้น

### Session

`session` ต้อง qualify เช่น `Editor browser session`, `Backend request session`,
`agent work session` หรือ owner อื่นที่ชัด มันไม่ใช่ durable document truth
เว้นแต่ repository-owned contract บอกไว้

### Snapshot

`snapshot` ต้องบอกว่าจับอะไร เช่น Core package snapshot, Backend storage
snapshot, Editor fixture snapshot, evidence snapshot หรือ Project Control
generated read-model snapshot

### Source และ Target

`source` และ `target` ต้องบอกแกนที่ใช้ เช่น source package version, target
package version, source repository, target repository, source document, target
route, source commit หรือ target commit

### Current, Ready, Compatible และ Live

`current`, `ready`, `compatible` และ `live` เป็น claim ที่ต้องมี evidence ต้อง
บอก scope และหลักฐานให้ชัด ถ้าไม่มี evidence ให้บันทึกเป็น `planned`, `risk`
หรือ `unknown`

## กฎสำหรับ Frontend Redesign

ก่อน redesign Editor หรือ frontend ในอนาคต ให้แปล vocabulary ของ UI ผ่าน glossary
นี้:

- ใช้ `Editor draft` สำหรับ browser-local working state
- ใช้ `Build` สำหรับการกำหนดโครงสร้างตามกรอบที่อนุญาต
- ใช้ `Preview` สำหรับเอกสารจำลองที่กดแก้ค่าทดลองบนเอกสารได้
- ใช้ `PDF output inspection` สำหรับการเปิดดูไฟล์ที่ส่งออก
- ใช้ `Outline item` สำหรับแถวหรือรายการโครงสร้างใน UI
- ใช้ `Structure Pattern` สำหรับโครงย่อย reusable ของเอกสารที่คนสร้างกำหนด
- ใช้ `Structure Pattern Slot` สำหรับจุดในโครงเอกสารฝั่ง author-time ที่จะ
  สร้าง entry ได้ในภายหลัง
- ใช้ `Structure Pattern Entry` สำหรับ occurrence ใน Preview หรือ runtime ที่
  เกิดจาก slot
- ใช้ `Core runtime node` เฉพาะเมื่อ backing Core graph item อยู่ใน scope
- ใช้ `Backend document record` สำหรับข้อมูลฝั่ง service
- ใช้ `Document package` สำหรับ Core payload
- ใช้ `Project Control Node` สำหรับ registry/map topic

ถ้า redesign ต้องใช้คำที่ยังไม่มีในเอกสารนี้ ให้เพิ่มคำนั้นในเอกสารนี้ หรือ
บันทึก terminology decision เป็น `blocked` ก่อนเริ่ม implementation
