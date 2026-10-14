// Documentation examples only; does not publish or render PDF.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const entry=process.argv[2];
assert(entry,'Pass the absolute path to the candidate Core package dist/index.js');
const {validateTemplate,prepareGeneration,composeDocument}=await import(pathToFileURL(path.resolve(entry)).href);
const base=fileURLToPath(new URL('../docs/examples/ai-template-authoring/',import.meta.url));
const reports=[];
for(const name of ['requirements','grouped']){
 const raw=fs.readFileSync(path.join(base,name+'-template.json'),'utf8');
 const request=JSON.parse(fs.readFileSync(path.join(base,name+'-request.json'),'utf8'));
 const valid=validateTemplate(raw);assert(valid.ok,JSON.stringify(valid));
 const compose=input=>{const p=prepareGeneration(valid.value,input);assert(p.ok,JSON.stringify(p));assert.deepEqual(p.warnings,[]);const d=composeDocument(valid.value,p.value);assert(d.ok,JSON.stringify(d));return d.value;};
 const document=compose(request);
 const text=d=>Object.values(d.nodes).flatMap(n=>n.children??[]).filter(n=>n.type==='text').map(n=>n.text);
 if(name==='requirements'){
  assert(text(document).includes('REQ-003'));assert.equal(Object.values(document.nodes).filter(n=>n.type==='page-break').length,1);
  const changed=structuredClone(request),rows=changed.sections.main.data.details[0].data.requirements;
  rows.push({code:'REQ-NEW',description:'ข้อความภาษาไทยสำหรับทดสอบ '.repeat(100)});
  assert.equal(text(compose(changed)).filter(t=>t==='REQ-NEW').length,1);
 }else{
  assert(text(document).includes('Company B'));assert(text(document).includes('empty'));
 }
 const empty=structuredClone(request);empty.sections.main.data.details=[];
 if(name==='requirements')compose(empty);
 else{const p=prepareGeneration(valid.value,empty);assert(p.ok);const d=composeDocument(valid.value,p.value);assert(!d.ok);assert(d.issues.some(i=>i.code==='EMPTY_CONTENT'));}
 const bad=structuredClone(request);bad.sections.main.data.details[0].format='not-owned';
 const rejected=prepareGeneration(valid.value,bad);assert(!rejected.ok);assert(rejected.issues.some(i=>i.code==='UNKNOWN_FORMAT'));
 const missing=structuredClone(request);delete missing.sections.main.data.details;
 const required=prepareGeneration(valid.value,missing);assert(!required.ok);assert(required.issues.some(i=>i.code==='MISSING_REQUIRED'));
 reports.push({name,status:'PASS',nodes:Object.keys(document.nodes).length,checks:['template','prepare','compose','empty-area','unknown-format','missing-area',name==='requirements'?'changed-long-data':'empty-group']});
}
console.log(JSON.stringify({status:'PASS',coreEntry:path.resolve(entry),reports,pdfRender:'NOT_RUN'},null,2));
