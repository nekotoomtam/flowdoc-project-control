// Documentation fixtures; never saves templates, calls an API, or publishes.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [entry,exampleRoot,outputRoot]=process.argv.slice(2);
assert(entry&&exampleRoot,'Usage: node check-developer-authoring.mjs <core-dist-index> <example-dir> [render-output-dir]');
const core=await import(pathToFileURL(path.resolve(entry)).href);
const definition=JSON.parse(fs.readFileSync(path.join(exampleRoot,'reference-template.json'),'utf8'));
const request=JSON.parse(fs.readFileSync(path.join(exampleRoot,'reference-request.json'),'utf8'));
const valid=core.validateTemplate(definition);assert(valid.ok,JSON.stringify(valid));
function compose(input){const p=core.prepareGeneration(valid.value,input);assert(p.ok,JSON.stringify(p));assert.deepEqual(p.warnings,[]);const d=core.composeDocument(valid.value,p.value);assert(d.ok,JSON.stringify(d));return d.value;}
const doc=compose(request);
const nodes=Object.values(doc.nodes);
assert.equal(nodes.filter(n=>n.type==='table-of-contents').length,1);
assert.equal(nodes.filter(n=>n.type==='text-block'&&n.props.toc).length,2);
assert.equal(nodes.filter(n=>n.type==='page-break').length,1);
const longer=structuredClone(request);longer.data.documentVersion='2.0';
longer.sections.main.data.details[0].data.requirements.push(...Array.from({length:45},(_,i)=>({code:'ADDED-'+i,description:'ข้อความเพิ่มเพื่อทดสอบการเลื่อนเลขหน้าของบทถัดไป '+i})));
const expanded=compose(longer);
assert(Object.values(expanded.nodes).some(n=>n.children?.some(c=>c.text==='ADDED-44')));
assert(Object.values(expanded.sections[0].footer.nodes).some(n=>n.children?.some(c=>c.text==='2.0')));
function reject(mut,stage='template'){const d=structuredClone(definition),r=structuredClone(request);mut(d,r);const v=core.validateTemplate(d);if(stage==='template'){assert(!v.ok,'Expected template rejection');return;}assert(v.ok,JSON.stringify(v));const p=core.prepareGeneration(v.value,r);if(stage==='prepare'){assert(!p.ok,'Expected data rejection');return;}assert(p.ok,JSON.stringify(p));const c=core.composeDocument(v.value,p.value);assert(!c.ok,'Expected composition rejection');}
reject(d=>d.areaFormats.chapter.fragment.nodes.chapter.props.toc.level=4);
reject(d=>d.sections[0].source.fragment.nodes.intro.props.textAlign='center');
reject(d=>d.sections[0].header.fragment.nodes.banner.props.fit='cover');
reject((d,r)=>r.sections.main.data.details[0].format='unknown','prepare');
reject((d,r)=>{delete r.data.projectName;d.globalSchema.fields.projectName.default='Does not bypass required';},'prepare');
reject((d,r)=>r.sections.main.data.details[2].data.anchor=r.sections.main.data.details[0].data.anchor,'compose');
const report={status:'PASS',checks:['template','prepare','compose','TOC graph','dynamic anchors','page-break','added rows','shared version binding','reject level 4','reject root alignment','reject image fit','reject unknown format','required before default','reject duplicate anchor'],render:'NOT_RUN'};
if(outputRoot){
 fs.mkdirSync(outputRoot,{recursive:true});
 const resources=await core.loadBundledResources({pythonExecutable:process.env.PYTHON??'python',tempRoot:process.env.TMPDIR??'/tmp'});assert(resources.ok,JSON.stringify(resources));
 const engine=await core.createPdfEngine(resources.value);assert(engine.ok,JSON.stringify(engine));
 const {createTextRuntime}=await import(new URL('./runtime/textRuntime.js',pathToFileURL(path.resolve(entry))));
 const {documentFlow}=await import(new URL('./layout/documentFlow.js',pathToFileURL(path.resolve(entry))));
 const imageId=request.data.headerBanner;
 const rgb=Buffer.alloc(1000*100*3);for(let i=0;i<rgb.length;i+=3){rgb[i]=23;rgb[i+1]=76;rgb[i+2]=122;}
 const images={[imageId]:{kind:'rgb',bytes:rgb,width:1000,height:100}};
 for(const [name,document] of [['baseline',doc],['expanded',expanded]]){
   const result=await engine.value.generatePdf(document,images);assert(result.ok,JSON.stringify(result));
   fs.writeFileSync(path.join(outputRoot,name+'.pdf'),result.value.bytes);
   const runtime=createTextRuntime(resources.value);let draw;try{draw=await documentFlow(document,runtime,images);}finally{await runtime.close();}
   fs.writeFileSync(path.join(outputRoot,name+'-draw.json'),JSON.stringify(draw));
   report[name]={pages:result.value.pageCount,bytes:result.value.bytes.length};
 }
 report.render='PASS';assert(report.expanded.pages>report.baseline.pages);
}
console.log(JSON.stringify(report,null,2));
