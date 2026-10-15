import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,mkdirSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {runCandidatePlan} from '../plugins/flowdocmake/scripts/candidate-workflow.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
function fixture(t,policy='new'){
 const dir=mkdtempSync(join(tmpdir(),'flowdocmake-workflow-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const json=(name,value)=>{const p=join(dir,name);writeFileSync(p,JSON.stringify(value));return p;};
 const source=join(dir,'source.pdf');writeFileSync(source,'%PDF-test');
 const layout=Object.fromEntries(['font','columns','borders','spacing','pageRules','assets','alignment','headerFooter'].map(k=>[k,'observed']));
 const coverage={source:{sha256:sha(readFileSync(source)),pageCount:1},reviewedSourcePages:[1],parts:[{id:'body',title:'Body',sourcePages:[1],dataSource:'source PDF',layout}]};
 const inventoryPath=json('inventory.json',{source:{...coverage.source,path:source}}),coveragePath=json('coverage.json',coverage);
 const candidateDirectory=join(dir,'candidate');mkdirSync(candidateDirectory);writeFileSync(join(candidateDirectory,'template.json'),JSON.stringify({schemaVersion:1,nodeModelVersion:18,templateId:'source',docKey:'source',version:1}));writeFileSync(join(candidateDirectory,'request.json'),JSON.stringify({docKey:'source',data:{text:'quoted "text"'}}));
 const plan={candidateDirectory,inventoryPath,coveragePath,workDirectory:join(dir,'output'),name:'Test',docKey:'fresh-test',draftPolicy:policy,...(policy==='new'?{}:{existingTemplateId:'old'})};
 const planPath=json('plan.json',plan),pdf=join(dir,'saved.pdf');writeFileSync(pdf,'%PDF-complete');
 const calls=[];let ownership=false,pending=false;
 const invoke=async(name,args)=>{calls.push({name,args});let value;
  if(name==='get_flowdocmake_context')return {ready:true};
  if(name==='get_template_draft')value={templateId:'old',docKey:'old-key',revision:4};
  if(name==='create_template_draft')value={templateId:'new',docKey:'fresh-test',revision:0};
  if(name==='update_template_draft'){if(ownership&&args.templateId==='old')return {ok:false,code:'OWNERSHIP_CONFLICT'};value={templateId:args.templateId,revision:args.expectedRevision+1};}
  if(name==='validate_template')value={valid:true};
  if(name==='preview_template_draft')value={jobId:'job',status:'queued'};
  if(name==='get_preview_status')value={status:pending?'running':'succeeded',warnings:[]};
  if(name==='save_preview_pdf')value={path:pdf,sha256:sha(readFileSync(pdf)),byteSize:13};
  return {ok:true,value};
 };
 return {dir,plan,planPath,json,calls,invoke,coverage,setOwnership:v=>ownership=v,setPending:v=>pending=v};
}
test('source inspection blocks mutations and draft policy must be explicit',async t=>{
 const f=fixture(t);f.coverage.reviewedSourcePages=[];f.json('coverage.json',f.coverage);
 await assert.rejects(runCandidatePlan(f.planPath,{invoke:f.invoke}),/SOURCE_INSPECTION_REQUIRED/);assert.equal(f.calls.length,0);
 f.coverage.reviewedSourcePages=[1];f.json('coverage.json',f.coverage);delete f.plan.draftPolicy;f.json('plan.json',f.plan);
 await assert.rejects(runCandidatePlan(f.planPath,{invoke:f.invoke}),/DRAFT_POLICY_REQUIRED/);assert.equal(f.calls.length,0);
});
test('preserve never forks on ownership conflict; authorized replacement forks exactly once',async t=>{
 const preserve=fixture(t,'preserve');preserve.setOwnership(true);
 await assert.rejects(runCandidatePlan(preserve.planPath,{invoke:preserve.invoke}),e=>e.code==='OWNERSHIP_CONFLICT');
 assert.equal(preserve.calls.filter(c=>c.name==='create_template_draft').length,0);
 const f=fixture(t,'replace-if-conflict');f.setOwnership(true);
 const r=await runCandidatePlan(f.planPath,{invoke:f.invoke});assert.equal(r.output.templateId,'new');assert.equal(r.reviewRequired,true);assert.equal(r.complete,false);
 const receipt=JSON.parse(readFileSync(join(f.plan.workDirectory,'candidate-checkpoint.json'),'utf8'));
 assert.equal(receipt.calls.save.args.definition.templateId,'old','replacement must not rewrite the failed original mutation intent');
 await runCandidatePlan(f.planPath,{invoke:f.invoke});
 assert.equal(f.calls.filter(c=>c.name==='create_template_draft').length,1);
 assert.equal(f.calls.filter(c=>c.name==='preview_template_draft').length,1);
 assert(!f.calls.some(c=>/publish|delete/.test(c.name)));
});
test('pending returns a continuation and resumes the same job; changed input cannot reuse checkpoint',async t=>{
 const f=fixture(t);f.setPending(true);const r=await runCandidatePlan(f.planPath,{invoke:f.invoke,waitMs:0});
 assert.equal(r.status,'pending');assert.equal(r.nextAction.tool,'run_candidate_preview');
 f.setPending(false);const done=await runCandidatePlan(f.planPath,{invoke:f.invoke,waitMs:0});assert.equal(done.status,'pdf-ready');
 assert.equal(f.calls.filter(c=>c.name==='create_template_draft').length,1);assert.equal(f.calls.filter(c=>c.name==='preview_template_draft').length,1);
 f.plan.docKey='different';f.json('plan.json',f.plan);await assert.rejects(runCandidatePlan(f.planPath,{invoke:f.invoke}),/CHECKPOINT_INPUT_CHANGED/);
});
test('stale revisions do not trigger replacement and exact substitutions preserve JSON quoting',async t=>{
 const f=fixture(t,'replace-if-conflict');f.plan.replacements=[{from:'quoted "text"',to:'new "value"',evidence:'source page1'}];f.json('plan.json',f.plan);
 const invoke=async(n,a)=>n==='update_template_draft'?{ok:false,code:'STALE_CURRENT'}:f.invoke(n,a);
 await assert.rejects(runCandidatePlan(f.planPath,{invoke}),e=>e.code==='STALE_CURRENT');assert(!f.calls.some(c=>c.name==='create_template_draft'));
 assert.equal(f.calls.find(c=>c.name==='validate_template').args.sampleRequest.data.text,'new "value"');
});

test('image aliases are replaced by uploaded resource IDs before sample validation',async t=>{
 const f=fixture(t);const image=join(f.plan.candidateDirectory,'banner.png');writeFileSync(image,'test image');
 writeFileSync(join(f.plan.candidateDirectory,'upload-files.json'),JSON.stringify([{id:'HEADER_BANNER',file:'banner.png'}]));
 writeFileSync(join(f.plan.candidateDirectory,'request.json'),JSON.stringify({docKey:'source',data:{banner:'HEADER_BANNER'}}));
 const invoke=async(name,args)=>{
  if(name==='create_preview_upload'){f.calls.push({name,args});return {ok:true,value:{uploadId:'upload',items:[{resourceId:'valid-resource-id'}]}};}
  if(name==='validate_template')assert.equal(args.sampleRequest.data.banner,'valid-resource-id');
  return f.invoke(name,args);
 };
 await runCandidatePlan(f.planPath,{invoke});
 assert(f.calls.findIndex(c=>c.name==='finalize_preview_upload')<f.calls.findIndex(c=>c.name==='validate_template'));
});
