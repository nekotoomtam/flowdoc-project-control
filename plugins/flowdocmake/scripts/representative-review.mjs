import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
const hash=b=>createHash('sha256').update(b).digest('hex');
export function checkDeadline(task,now=Date.now()){
 const end=Date.parse(task.deadlineAt);
 if(!Number.isFinite(end))throw Object.assign(new Error('TRIAL_DEADLINE_REQUIRED'),{code:'TRIAL_DEADLINE_REQUIRED'});
 if(now>=end)throw Object.assign(new Error('TRIAL_TIME_LIMIT'),{code:'TRIAL_TIME_LIMIT'});
}
export function checkRepresentatives(report,coverage,source,definitionBytes,{countPages}={}){
 const errors=[],families=new Map();const need=(v,c)=>{if(!v)errors.push(c);};
 for(const p of coverage.parts??[]){
  need(Array.isArray(p.layoutFamilies)&&p.layoutFamilies.length>0&&p.layoutFamilies.every(f=>typeof f==='string'&&f.trim()),'LAYOUT_FAMILIES_REQUIRED');
  for(const f of p.layoutFamilies??[]){if(!families.has(f))families.set(f,new Set());for(const n of p.sourcePages??[])families.get(f).add(n);}
 }
 need(families.size>0,'LAYOUT_FAMILIES_REQUIRED');
 need(report?.sourceSha256===source.sha256,'REPRESENTATIVE_SOURCE_CHANGED');
 need(report?.definitionSha256===hash(definitionBytes),'REPRESENTATIVE_DEFINITION_CHANGED');
 let output,total=0;
 try{
  const checkpoint=JSON.parse(readFileSync(report.checkpointPath,'utf8'));output=checkpoint.output;
  const checked=checkpoint.calls?.['replacement-validate']?.args?.definition??checkpoint.calls?.validate?.args?.definition;
  const current=JSON.parse(definitionBytes.toString('utf8'));
  need(checked&&isDeepStrictEqual({...current,templateId:output?.templateId,docKey:checked.docKey,version:1},checked),'REPRESENTATIVE_RENDERED_DEFINITION_CHANGED');
  need(checkpoint.status?.status==='succeeded'&&output?.templateId&&output?.revision>0,'REPRESENTATIVE_PDF_REQUIRED');
  need(output.sha256===hash(readFileSync(output.path)),'REPRESENTATIVE_PDF_CHANGED');
  total=countPages(output.path);need(Number.isInteger(total)&&total>0,'REPRESENTATIVE_PDF_REQUIRED');
 }catch{errors.push('REPRESENTATIVE_PDF_REQUIRED');}
 const reps=Array.isArray(report?.representatives)?report.representatives:[];
 need(reps.length===families.size&&new Set(reps.map(r=>r.family)).size===families.size,'REPRESENTATIVE_FAMILY_COVERAGE');
 for(const [family,sourcePages] of families){
  const r=reps.find(r=>r.family===family);if(!r){errors.push('REPRESENTATIVE_MISSING:'+family);continue;}
  need(sourcePages.has(r.sourcePage),'REPRESENTATIVE_SOURCE_PAGE:'+family);
  need(Array.isArray(r.outputPages)&&r.outputPages.length>0&&r.outputPages.every(n=>Number.isInteger(n)&&n>=1&&n<=total),'REPRESENTATIVE_OUTPUT_PAGES:'+family);
  need(Array.isArray(r.differences)&&r.differences.length===0,'REPRESENTATIVE_DIFFERENCES:'+family);
  for(const k of ['font','columns','borders','spacing','pageRules','assets','alignment','headerFooter','content','structure']){
   const c=r.observations?.[k];need(c?.verdict==='pass'&&typeof c.source==='string'&&c.source.trim()&&typeof c.output==='string'&&c.output.trim(),'REPRESENTATIVE_COMPARISON:'+family+':'+k);
  }
  for(const k of ['sourceImage','outputImage'])try{need(readFileSync(r[k]).subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'REPRESENTATIVE_IMAGE:'+family+':'+k);}catch{errors.push('REPRESENTATIVE_IMAGE:'+family+':'+k);}
 }
 return {ok:errors.length===0,errors:[...new Set(errors)],families:[...families.keys()],output,boundary:'Declared evidence and file identity only, not visual certification. Inspect paired images and native semantics before expansion.'};
}
