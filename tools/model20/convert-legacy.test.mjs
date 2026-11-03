import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,readdir,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {convertLegacyBundle} from './convert-legacy.mjs';

const legacyCore=await import(pathToFileURL(process.env.LEGACY_CORE).href);
const targetCore=await import(pathToFileURL(process.env.TARGET_CORE).href);
const sdk={legacyCore,targetCore};
const base=JSON.parse(await readFile(new URL('./fixtures/legacy-base.json',import.meta.url),'utf8'));
function bundle(model=18){
 const t=structuredClone(base);t.examples=[];t.areaFormats={};t.globalSchema={type:'object',fields:{title:{type:'string',default:'ไทย 😀'}}};
 const section=(id,key)=>({id,key,inputSchema:{type:'object',fields:{text:{type:'string',default:'เดิม'}}},formats:{},source:{kind:'blank'}});
 t.sections=[section('first','หัว/ข้อ~หนึ่ง'),section('second','second')];
 if(model===19){t.nodeModelVersion=19;t.sections.forEach((s,i)=>{delete s.key;delete s.formats;s.id=`00000000-0000-4000-8000-00000000000${i+1}`;s.label=s.nameBase=`Section ${i+1}`;});}
 const entries=t.sections.map((s,i)=>({id:s.id,data:{text:String(i)}}));
 return {template:t,requestKind:'task',request:{data:{},sections:model===18?{[t.sections[0].key]:{data:{text:'0'}},second:{data:{text:'1'}}}:entries.reverse()},imageParts:[]};
}
const good=r=>{assert.equal(r.ok,true,JSON.stringify(r));return r.value;};
test('18 Unicode keys convert deterministically without mutating sources',async()=>{
 const b=bundle(),before=structuredClone(b),a=good(await convertLegacyBundle(b,sdk)),c=good(await convertLegacyBundle(b,sdk));
 assert.deepEqual(b,before);assert.deepEqual(a,c);assert.equal(a.template.nodeModelVersion,20);assert.equal(a.template.sections[0].label,'หัว/ข้อ~หนึ่ง');
 assert.deepEqual(a.request.sections.map(s=>s.data.text),['0','1']);assert.deepEqual(a.template.globalSchema,b.template.globalSchema);
 assert.notEqual(a.template.templateId,b.template.templateId);assert.equal(a.validation.imageBytesVerified,false);
});
test('19 emits definition order, not incoming array order',async()=>{
 const a=good(await convertLegacyBundle(bundle(19),sdk));assert.deepEqual(a.request.sections.map(s=>s.data.text),['0','1']);
});
test('generation requests and examples retain defaulted values',async()=>{
 const b=bundle();b.requestKind='generation';b.request.docKey=b.template.docKey;b.request.version=b.template.version;
 b.template.examples=[{name:'Example',request:structuredClone(b.request)}];
 const a=good(await convertLegacyBundle(b,sdk)),v=good(targetCore.validateTemplate(a.template));
 const p=good(targetCore.prepareGeneration(v,a.request));assert.equal(p.data.title,'ไทย 😀');assert.equal(a.template.examples.length,1);
});
test('escaped multipart pointers map by section identity',async()=>{
 const b=bundle();b.template.sections[0].inputSchema.fields.photo={type:'image'};b.request.sections[b.template.sections[0].key].data.photo={image:{upload:true}};
 b.imageParts=[{pointer:'/sections/หัว~1ข้อ~0หนึ่ง/data/photo/image',sha256:'a'.repeat(64),bytes:10}];
 const a=good(await convertLegacyBundle(b,sdk));assert.equal(a.imageParts[0].pointer,'/sections/0/data/photo/image');assert.equal(a.imageParts[0].sha256,b.imageParts[0].sha256);
});
test('origins become manifest provenance, not borrowed ownership',async()=>{
 const b=bundle(19);b.template.sections[0].origin={templateId:'other',revision:2,sectionId:'old'};
 const a=good(await convertLegacyBundle(b,sdk));assert.equal(a.template.sections[0].origin,undefined);assert.deepEqual(a.mapping[0].sourceOrigin,b.template.sections[0].origin);
});
test('malformed or unknown source data is refused, never discarded',async()=>{
 const b=bundle();b.request.sections.second.data.unknown='do not discard';const r=await convertLegacyBundle(b,sdk);assert.equal(r.ok,false);assert.equal(r.issues[0].code,'SOURCE_REQUEST_INVALID');
});
test('invalid/duplicate section input and pointer fail closed',async()=>{
 const b=bundle(19);b.request.sections.push(structuredClone(b.request.sections[0]));assert.equal((await convertLegacyBundle(b,sdk)).ok,false);
 const c=bundle();c.imageParts=[{pointer:'/sections/missing/data/photo'}];const r=await convertLegacyBundle(c,sdk);assert.equal(r.ok,false);assert.equal(r.issues[0].code,'IMAGE_POINTER_UNMAPPED');
});
test('18 global references without a reusable ownership proof are explicit unsupported',async()=>{
 const b=bundle();b.template.globalSchema.fields.ref={type:'link',default:{type:'reference',text:'Link',target:'where'}};
 const r=await convertLegacyBundle(b,sdk);assert.equal(r.ok,false);assert.equal(r.issues[0].code,'LEGACY_GLOBAL_REFERENCE_UNSUPPORTED');
});
test('19 scoped reference ownership maps to the new occurrence',async()=>{
 const b=bundle(19);b.template.sections[0].source={kind:'authored',repeats:[],fragment:{rootIds:['p'],nodes:{p:{id:'p',type:'text-block',role:{role:'paragraph'},props:{textStyleId:'body'},children:[{id:'r',type:'reference',text:'See',target:'anchor',targetSectionId:b.template.sections[1].id}]}}}};
 const a=good(await convertLegacyBundle(b,sdk)),r=a.template.sections[0].source.fragment.nodes.p.children[0];assert.equal(r.targetSectionId,undefined);assert.equal(r.targetInstanceKey,a.mapping[1].instanceKey);
});
test('18 cover and document-wide TOC survive conversion',async()=>{
 const b=bundle();b.template.sections[0].role='cover';b.template.sections[0].source={kind:'authored',repeats:[],fragment:{rootIds:[],nodes:{}}};
 b.template.sections[1].source={kind:'authored',repeats:[],fragment:{rootIds:['heading','toc'],nodes:{heading:{id:'heading',type:'text-block',role:{role:'paragraph'},props:{textStyleId:'body',anchorId:'heading',toc:{level:1}},children:[{id:'heading-text',type:'text',text:'Contents'}]},toc:{id:'toc',type:'table-of-contents',props:{textStyleId:'body'}}}}};
 const a=good(await convertLegacyBundle(b,sdk));assert.equal(a.template.sections[0].role,'cover');assert.deepEqual(a.template.sections[1].source.fragment.nodes.toc.props.scope,{kind:'document'});
});

test('18 empty document TOC is refused instead of silently losing its page',async()=>{
 const t=structuredClone(base);t.examples=[];t.sections[0].source={kind:'authored',repeats:[],fragment:{rootIds:['toc'],nodes:{toc:{id:'toc',type:'table-of-contents',props:{textStyleId:'body'}}}}};
 t.sections.push({id:'blank',key:'blank',inputSchema:{type:'object',fields:{}},formats:{},source:{kind:'blank'}});
 const request={docKey:t.docKey,sections:{'legacy-section':{data:{}},blank:{data:{}}}};
 const old=legacyCore.composeDocument(legacyCore.validateTemplate(t).value,legacyCore.prepareGeneration(legacyCore.validateTemplate(t).value,request).value);
 const flow=await import(new URL('./layout/documentFlow.js',pathToFileURL(process.env.LEGACY_CORE)));
 assert.equal((await flow.documentFlow(old.value,{})).pages.length,2);
 const r=await convertLegacyBundle({template:t,requestKind:'generation',request,imageParts:[]},sdk);
 assert.equal(r.ok,false);assert.equal(r.issues[0].code,'LEGACY_TOC_LAYOUT_UNPROVEN');
});

test('invalid legacy dynamic TOC heading is not repaired by conversion',async()=>{
 const b=bundle();b.template.sections[0].source={kind:'authored',repeats:[],fragment:{rootIds:['h'],nodes:{h:{id:'h',type:'text-block',role:{role:'paragraph'},props:{textStyleId:'body',anchorId:'h',toc:{level:1}},children:[{id:'hf',type:'field-ref',scope:'local',key:'text'}]}}}};
 b.template.sections[1].source={kind:'authored',repeats:[],fragment:{rootIds:['toc'],nodes:{toc:{id:'toc',type:'table-of-contents',props:{textStyleId:'body'}}}}};
 assert.equal((await convertLegacyBundle(b,sdk)).issues?.[0]?.code,'SOURCE_TEMPLATE_INVALID');
});
test('contract kinds, target identity and failed SDK validation are not guessed',async()=>{
 const b=bundle();delete b.requestKind;assert.equal((await convertLegacyBundle(b,sdk)).ok,false);
 const c=bundle();c.template.nodeModelVersion=20;assert.equal((await convertLegacyBundle(c,sdk)).ok,false);
});
test('unbound global upload and duplicate upload pointers are rejected',async()=>{
 const b=bundle();b.imageParts=[{pointer:'/data/unused/image'}];assert.equal((await convertLegacyBundle(b,sdk)).issues[0].code,'IMAGE_PART_UNBOUND');
 const c=bundle();c.template.globalSchema.fields.photo={type:'image'};c.request.data.photo={image:{upload:true}};c.imageParts=[{pointer:'/data/photo/image'},{pointer:'/data/photo/image'}];assert.equal((await convertLegacyBundle(c,sdk)).issues[0].code,'IMAGE_POINTER_DUPLICATE');
});
test('CLI dry run writes nothing; complete conversion cannot overwrite an output',async()=>{
 const root=await mkdtemp(join(tmpdir(),'model20-cli-'));
 try{
  const input=join(root,'source.json'),output=join(root,'converted'),raw=JSON.stringify(bundle());await writeFile(input,raw);
  const common=['convert-legacy-cli.mjs','--input',input,'--legacy-core',process.env.LEGACY_CORE,'--target-core',process.env.TARGET_CORE,'--output',output];
  const run=extra=>spawnSync(process.execPath,[...common,...extra],{cwd:new URL('.',import.meta.url),encoding:'utf8'});
  const dry=run(['--dry-run']);assert.equal(dry.status,0,dry.stderr);assert.equal(JSON.parse(dry.stdout).dryRun,true);assert.deepEqual(await readdir(root),['source.json']);
  const actual=run([]);assert.equal(actual.status,0,actual.stderr);const saved=JSON.parse(await readFile(join(output,'complete','bundle.json'),'utf8'));assert.equal(saved.template.nodeModelVersion,20);
  assert.equal(run([]).status,1);assert.equal(await readFile(input,'utf8'),raw);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('CLI invalid conversion creates no output directory',async()=>{
 const root=await mkdtemp(join(tmpdir(),'model20-cli-fail-'));
 try{
  const input=join(root,'source.json'),output=join(root,'converted');await writeFile(input,JSON.stringify({template:{nodeModelVersion:20},requestKind:'task',request:{},imageParts:[]}));
  const r=spawnSync(process.execPath,['convert-legacy-cli.mjs','--input',input,'--legacy-core',process.env.LEGACY_CORE,'--target-core',process.env.TARGET_CORE,'--output',output],{cwd:new URL('.',import.meta.url),encoding:'utf8'});
  assert.equal(r.status,2,r.stderr);assert.deepEqual(await readdir(root),['source.json']);
 }finally{await rm(root,{recursive:true,force:true});}
});
