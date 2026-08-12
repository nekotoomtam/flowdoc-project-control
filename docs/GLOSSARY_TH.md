# อภิธานศัพท์ Flowdoc

คำอธิบายภาษาไทยนี้ใช้ ID เดียวกับอภิธานศัพท์ภาษาอังกฤษ ไม่สร้างตัวตนคำศัพท์ภาษาไทยแยกต่างหาก และไม่ได้ยืนยันสถานะของ product repository

## Node

`node` คือหัวข้อถาวรในต้นไม้นำทางหลัก มี Node แม่หลักได้หนึ่งตัว หรือเป็นรากของต้นไม้

## Truth State

`truth-state` บอกสถานะของข้อความเกี่ยวกับ Node ว่าเป็น `current`, `planned`, `risk` หรือ `unknown` โดย `current` ต้องมี Evidence รองรับ และห้ามอนุมานจาก Work

## Work State

`work-state` บอกสถานะของงานชั่วคราวว่าเป็น `queued`, `in-progress`, `blocked` หรือ `in-review` ซึ่งแยกจาก Truth State

## Document

`document` คือ metadata ของ Markdown ถาวร มีบทบาท ขอบเขตอำนาจ lifecycle และอาจมี repository reference ที่ตรึง commit

## Evidence

`evidence` เชื่อมคำกล่าวขอบเขตจำกัดกับ commit ที่แน่นอนและ path หรือ contract ID ที่ตรวจได้ ไม่ได้ยืนยันว่าสิ่งอื่นใน commit เดียวกันถูกตรวจแล้ว

## Repository Registry

`repository-registry` ระบุ repository ที่อนุมัติด้วย HTTPS remote, checkout alias, default branch และ ownership summary โดยไม่เก็บ path checkout เฉพาะเครื่อง

## Focus Stack Map

`focus-stack-map` คือมุมนำทางแบบอ่านอย่างเดียวที่แสดง Node บรรพบุรุษ Node ปัจจุบัน และ Node ลูก

## Summary Inspector

`summary-inspector` คือแถบสรุปแบบอ่านอย่างเดียวสำหรับ summary, status และ reference ที่เลือกของ Node

## Full Detail Modal

`full-detail-modal` คือหน้าต่างซ้อนสำหรับรายละเอียด Node โดยไม่แทนที่ตำแหน่งปัจจุบันบนแผนผัง
