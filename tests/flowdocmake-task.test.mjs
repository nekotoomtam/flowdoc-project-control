import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {documentTask,classifyFailure} from '../plugins/flowdocmake/scripts/document-task.mjs';
test('task persists parts, rejects stale writers, binds review to current artifact and refuses incomplete delivery',t=>{
 const dir=mkdtempSync(join(tmpdir(),'flowdoc-task-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const json=(n,v)=>{const p=join(dir,n);writeFileSync(p,JSON.stringify(v));return p;};
 const pdf=join(dir,'source.pdf');writeFileSync(pdf,'source');
 const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
 const source={path:pdf,sha256:sha(pdf),pageCount:1};
 const part={id:'body',title:'Body',dataSource:'PDF',sourcePages:[1],layout:Object.fromEntries(['font','columns','borders','spacing','pageRules','assets','alignment','headerFooter'].map(k=>[k,'observed']))};
 const coverage={source,reviewedSourcePages:[1],parts:[part]};
 const inventoryPath=json('inventory.json',{source}),coveragePath=json('coverage.json',coverage),taskPath=join(dir,'task.json');
 let r=documentTask({action:'init',taskPath,inventoryPath,coveragePath});assert.equal(r.complete,false);assert.equal(r.pendingParts[0].status,'pending');
 r=documentTask({action:'update',taskPath,expectedRevision:r.revision,partId:'body',status:'needs-repair',note:'Repair real table columns'});
 assert.equal(documentTask({action:'read',taskPath}).pendingParts[0].note,'Repair real table columns');
 assert.throws(()=>documentTask({action:'update',taskPath,expectedRevision:0,partId:'body',status:'authoring',note:'x'}),/TASK_REVISION_CONFLICT/);
 assert.throws(()=>documentTask({action:'update',taskPath,expectedRevision:r.revision,partId:'body',status:'pass',note:'x'}),/INVALID_PART_STATUS/);
 const output=join(dir,'preview.pdf');writeFileSync(output,'output');
 const artifact={path:output,sha256:sha(output),pageCount:1,templateId:'owned',revision:7};
 const checkpointPath=json('checkpoint.json',{output:artifact,status:{status:'succeeded'}});
 r=documentTask({action:'review',taskPath,expectedRevision:r.revision,coveragePath,checkpointPath},{countPages:()=>1});
 assert.equal(r.complete,false);assert(r.reviewErrors.includes('OUTPUT_IDENTITY_MISSING'));
 coverage.output=artifact;coverage.reviewedOutputPages=[1];coverage.parts[0].review={outputPages:[1],content:'pass',layout:'pass',evidence:'sheet1.png inspected',differences:[]};
 coverage.outputChecks={toc:'not-applicable: no TOC',links:'not-applicable: no links',pageLabels:'pass',allValues:'pass'};coverage.unresolved=[];json('coverage.json',coverage);
 r=documentTask({action:'review',taskPath,expectedRevision:r.revision,coveragePath,checkpointPath},{countPages:()=>1});assert.equal(r.complete,true);
 assert.equal(documentTask({action:'read',taskPath}).complete,true);
 // Rebinding a new artifact invalidates all old passes even if coverage still names the old PDF.
 const next={...artifact,revision:8};json('checkpoint.json',{output:next,status:{status:'succeeded'}});
 r=documentTask({action:'review',taskPath,expectedRevision:r.revision,coveragePath,checkpointPath},{countPages:()=>1});
 assert.equal(r.complete,false);assert.equal(r.pendingParts[0].status,'needs-review');
 assert(r.reviewErrors.includes('REVIEW_ARTIFACT_MISMATCH'));
 // A changed PDF also invalidates a previously persisted completion on read.
 writeFileSync(output,'changed');assert.equal(documentTask({action:'read',taskPath}).complete,false);
});
test('repairable input/render errors and retryable work are distinguished from external blockers',()=>{
 for(const code of ['INVALID_TEMPLATE','RENDER_FAILED','SOURCE_INSPECTION_REQUIRED','CHECKPOINT_INPUT_CHANGED','CANDIDATE_WORKFLOW_FAILED'])assert.equal(classifyFailure(code).category,'needs-repair');
 for(const code of ['STALE_CURRENT','WORKFLOW_BUSY','SERVICE_UNREACHABLE'])assert.equal(classifyFailure(code).category,'retry');
 assert.equal(classifyFailure('AUTHORIZATION_FAILED').category,'blocked');
 assert.equal(classifyFailure('PREFLIGHT_NOT_READY').category,'needs-diagnosis');
});
