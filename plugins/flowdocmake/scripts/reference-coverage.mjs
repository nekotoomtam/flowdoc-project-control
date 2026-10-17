import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
function pages(values,total){return Array.isArray(values)&&values.length>0&&values.every(x=>Number.isInteger(x)&&x>=1&&x<=total);}
export function checkCoverage(record,source,stage){
 const errors=[];
 const require=(value,code)=>{if(!value)errors.push(code);};
 require(record?.source?.sha256===source.sha256&&record?.source?.pageCount===source.pageCount,'SOURCE_MISMATCH');
 require(pages(record?.reviewedSourcePages,source.pageCount)&&new Set(record.reviewedSourcePages).size===source.pageCount,'SOURCE_PAGES_NOT_REVIEWED');
 const parts=Array.isArray(record?.parts)?record.parts:[];
 require(parts.length>0&&new Set(parts.map(p=>p.id)).size===parts.length,'PARTS_MISSING_OR_DUPLICATE');
 const covered=new Set();
 for(const p of parts){
  require(nonempty(p.id)&&nonempty(p.title)&&nonempty(p.dataSource),'PART_IDENTITY_OR_PROVENANCE_MISSING');
  require(pages(p.sourcePages,source.pageCount),'PART_SOURCE_PAGES_INVALID');
  for(const n of p.sourcePages??[])covered.add(n);
  for(const key of ['font','columns','borders','spacing','pageRules','assets','alignment','headerFooter'])require(nonempty(p.layout?.[key]),'LAYOUT_OBSERVATION_MISSING:'+p.id+':'+key);
 }
 require(covered.size===source.pageCount,'SOURCE_PART_COVERAGE_INCOMPLETE');
 if(record?.reuse){
  require(nonempty(record.reuse.templateId)&&Number.isInteger(record.reuse.revision),'REUSE_IDENTITY_MISSING');
  require(Array.isArray(record.reuse.comparisons)&&record.reuse.comparisons.length===parts.length,'REUSE_COMPARISON_INCOMPLETE');
  for(const p of parts){const c=record.reuse.comparisons?.find(c=>c.partId===p.id);require(c&&['reuse','adapt','replace','new'].includes(c.decision)&&nonempty(c.reason),'REUSE_DECISION_MISSING:'+p.id);}
 }
 if(stage==='delivery'){
  const output=record?.output;
  require(output&&nonempty(output.path)&&/^[a-f0-9]{64}$/.test(output.sha256)&&Number.isInteger(output.pageCount)&&output.pageCount>0&&nonempty(output.templateId)&&Number.isInteger(output.revision)&&output.revision>0,'OUTPUT_IDENTITY_MISSING');
  require(pages(record?.reviewedOutputPages,output?.pageCount)&&new Set(record.reviewedOutputPages).size===output?.pageCount,'OUTPUT_PAGES_NOT_REVIEWED');
  const outputCovered=new Set();
  for(const p of parts){const r=p.review;require(r&&pages(r.outputPages,output?.pageCount)&&r.content==='pass'&&r.layout==='pass'&&nonempty(r.evidence)&&Array.isArray(r.differences)&&r.differences.length===0,'PART_NOT_MATCHED:'+p.id);for(const n of r?.outputPages??[])outputCovered.add(n);}
  require(outputCovered.size===output?.pageCount,'OUTPUT_PART_COVERAGE_INCOMPLETE');
  for(const key of ['toc','links','pageLabels','allValues']){const v=record?.outputChecks?.[key];require(v==='pass'||(typeof v==='string'&&/^not-applicable: .+/.test(v)),'OUTPUT_CHECK_INCOMPLETE:'+key);}
  require(Array.isArray(record?.unresolved)&&record.unresolved.length===0,'UNRESOLVED_DIFFERENCES');
 }
 return {ok:errors.length===0,stage,errors:[...new Set(errors)],boundary:'Checks declared evidence coverage and identity only; does not certify visual or semantic correctness.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{
  const [stage,inventoryPath,recordPath]=process.argv.slice(2);if(!['source','delivery'].includes(stage))throw Error('Usage: node reference-coverage.mjs source|delivery inventory.json coverage.json');
  const inventory=JSON.parse(readFileSync(inventoryPath,'utf8')),record=JSON.parse(readFileSync(recordPath,'utf8'));
  const sha256=createHash('sha256').update(readFileSync(inventory.source.path)).digest('hex');
  if(sha256!==inventory.source.sha256)throw Error('Source PDF bytes changed');
  const result=checkCoverage(record,inventory.source,stage);
  if(stage==='delivery'&&result.ok&&createHash('sha256').update(readFileSync(record.output.path)).digest('hex')!==record.output.sha256){result.ok=false;result.errors.push('OUTPUT_BYTES_CHANGED');}
  console.log(JSON.stringify(result));if(!result.ok)process.exitCode=1;
 }catch(e){console.error(e.message);process.exitCode=1;}
}
