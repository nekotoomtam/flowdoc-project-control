// Local progress/evidence only. Never writes template storage or calls publish.
import {readFileSync,writeFileSync,existsSync,openSync,closeSync,unlinkSync,renameSync} from 'node:fs';
import {isAbsolute} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {checkCoverage} from './reference-coverage.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const fail=code=>{throw Object.assign(new Error(code),{code});};
const identity=o=>JSON.stringify([o?.sha256,o?.templateId,o?.revision,o?.path,o?.pageCount]);
export function classifyFailure(code){
 if(['AUTHORIZATION_FAILED','EXISTING_TEMPLATE_ID_REQUIRED','OWNERSHIP_CONFLICT'].includes(code))return {category:'blocked',nextAction:'Resolve credentials, target ownership or missing owner choice. Do not bypass permissions or publish.'};
 if(['WORKFLOW_BUSY','STALE_CURRENT','REVISION_CONFLICT','TASK_REVISION_CONFLICT','SERVICE_UNREACHABLE','SERVICE_ERROR'].includes(code))return {category:'retry',nextAction:'Read current state and receipts; retry safely. An uncertain mutation keeps identical arguments/key; stale candidates need a fresh run.'};
 if(['PREFLIGHT_NOT_READY','LOCAL_CONFIGURATION_OR_GUIDE_ERROR','GUIDE_INTEGRITY_FAILURE','TOOL_RESPONSE_UNREADABLE'].includes(code))return {category:'needs-diagnosis',nextAction:'Inspect the failing prerequisite/receipt before deciding whether external help is necessary.'};
 return {category:'needs-repair',nextAction:'Repair the owned input or unfinished comparison and continue. Preserve source content and prior receipts; changed candidates use a fresh run directory.'};
}
function summary(state){
 let current=true;try{if(state.output)current=hash(state.output.path)===state.output.sha256;}catch{current=false;}
 const parts=state.parts.map(p=>!current?{...p,status:'needs-review'}:p);
 return {...state,complete:current&&state.complete===true,pendingParts:parts.filter(p=>p.status!=='pass'),...(!current?{reviewErrors:['OUTPUT_BYTES_CHANGED']}:{}),boundary:'Declared review evidence only; the agent must actually inspect source/output pages and data. No visual correctness certification.'};
}
export function documentTask(args,{countPages}={}){
 const {action,taskPath}=args;
 if(!isAbsolute(taskPath??''))fail('ABSOLUTE_TASK_PATH_REQUIRED');
 if(action==='read')return summary(read(taskPath));
 const lockPath=taskPath+'.lock';let lock;
 try{lock=openSync(lockPath,'wx');}catch{fail('WORKFLOW_BUSY');}
 try{
  let state;
  if(action==='init'){
   if(existsSync(taskPath))fail('TASK_ALREADY_EXISTS');
   const inventory=read(args.inventoryPath),coverage=read(args.coveragePath);
   if(!checkCoverage(coverage,inventory.source,'source').ok||hash(inventory.source.path)!==inventory.source.sha256)fail('SOURCE_INSPECTION_REQUIRED');
   state={version:1,revision:0,source:inventory.source,complete:false,parts:coverage.parts.map(p=>({id:p.id,title:p.title,sourcePages:p.sourcePages,status:'pending',note:'Not yet implemented and compared'}))};
  }else{
   state=read(taskPath);
   if(args.expectedRevision!==state.revision)fail('TASK_REVISION_CONFLICT');
   if(action==='update'){
    if(!['pending','authoring','needs-repair','needs-review'].includes(args.status))fail('INVALID_PART_STATUS');
    const part=state.parts.find(p=>p.id===args.partId);if(!part)fail('UNKNOWN_PART');
    if(!args.note?.trim())fail('PART_NOTE_REQUIRED');
    Object.assign(part,{status:args.status,note:args.note});state.complete=false;
   }else if(action==='review'){
    const coverage=read(args.coveragePath),checkpoint=read(args.checkpointPath),output=checkpoint.output;
    if(!output||checkpoint.status?.status!=='succeeded'||hash(output.path)!==output.sha256)fail('SUCCEEDED_PDF_REQUIRED');
    if(!countPages)fail('PDF_READER_REQUIRED');
    const artifact={...output,pageCount:countPages(output.path)};
    const sourceOk=checkCoverage(coverage,state.source,'source').ok&&hash(state.source.path)===state.source.sha256;
    const partsOk=JSON.stringify(coverage.parts.map(p=>[p.id,p.sourcePages]))===JSON.stringify(state.parts.map(p=>[p.id,p.sourcePages]));
    if(!sourceOk||!partsOk)fail('TASK_SOURCE_PARTS_CHANGED');
    const same=identity(coverage.output)===identity(artifact);
    const result=checkCoverage(coverage,state.source,'delivery');
    state.output=artifact;state.reviewErrors=[...result.errors,...(same?[]:['REVIEW_ARTIFACT_MISMATCH'])];
    // All reviews are re-evaluated on every artifact binding; old passes never carry over implicitly.
    for(const part of state.parts){
     const r=coverage.parts.find(p=>p.id===part.id)?.review;
     const pass=same&&r&&r.content==='pass'&&r.layout==='pass'&&r.evidence?.trim()&&Array.isArray(r.differences)&&r.differences.length===0&&Array.isArray(r.outputPages)&&r.outputPages.length>0&&r.outputPages.every(n=>Number.isInteger(n)&&n>=1&&n<=artifact.pageCount);
     part.status=pass?'pass':same&&r?.differences?.length?'needs-repair':'needs-review';
     part.note=pass?r.evidence:JSON.stringify(r?.differences??['Comparison required for current PDF']);
    }
    state.complete=same&&result.ok;
   }else fail('INVALID_TASK_ACTION');
   state.revision++;
  }
  const temp=taskPath+'.'+randomUUID()+'.tmp';
  try{writeFileSync(temp,JSON.stringify(state,null,2)+'\n',{flag:'wx',mode:0o600});renameSync(temp,taskPath);}finally{if(existsSync(temp))unlinkSync(temp);}
  return summary(state);
 }finally{closeSync(lock);unlinkSync(lockPath);}
}
