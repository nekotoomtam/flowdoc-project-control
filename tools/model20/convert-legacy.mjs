import {createHash} from 'node:crypto';

// Offline boundary: callers supply two explicit SDKs. No product runtime imports,
// network/storage access or database writes belong in this converter.
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.hasOwn(x,k);
const canonical=x=>JSON.stringify(x,(_,v)=>object(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const digest=x=>createHash('sha256').update(canonical(x)).digest('hex');
const uuid=x=>{const h=digest(x).slice(0,32).split('');h[12]='5';h[16]='8';const s=h.join('');return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;};
const memory=v=>({async byteLength(){return Buffer.byteLength(JSON.stringify(v));},async kind(){return Array.isArray(v)?'array':object(v)?'object':'scalar';},async scalar(){return v;},async *properties(){for(const [k,x]of Object.entries(v))yield[k,memory(x)];},async *elements(){for(const x of v)yield memory(x);}});
class Refusal extends Error{constructor(code,path,details){super(code);this.issue={code,path,...(details?{details}: {})};}}
const refuse=(code,path,details)=>{throw new Refusal(code,path,details);};
function visit(x,f,path=''){
 if(x===null||typeof x!=='object')return;f(x,path);
 for(const [k,v]of Object.entries(x))visit(v,f,path+'/'+k);
}
function plainJson(x){
 const seen=new Set();function check(v){
  if(v===null||['string','boolean'].includes(typeof v))return;
  if(typeof v==='number'&&Number.isFinite(v))return;
  if(typeof v!=='object'||seen.has(v)||(!Array.isArray(v)&&Object.getPrototypeOf(v)!==Object.prototype&&Object.getPrototypeOf(v)!==null))refuse('INVALID_BUNDLE','');
  seen.add(v);for(const value of Object.values(v))check(value);seen.delete(v);
 }check(x);
}
async function checkRequest(core,validated,request,kind,path){
 if(kind==='generation'){
  const r=core.prepareGeneration(validated,request);
  if(!r.ok||r.warnings.length)refuse('SOURCE_REQUEST_INVALID',path,r.ok?r.warnings:r.issues);
  return [];
 }
 const warnings=[],placements=[];
 // Shape/default traversal only. Image bytes, availability and legal provenance
 // are deliberately not certified by substituting an adapter resource here.
 const r=await core.normalizeTaskInput(validated,memory(request),{
  write:async()=>{},onWarning:async w=>warnings.push(w),
  images:{collect:async(_value,c)=>{placements.push(c.pointer+'/image');},seal:async()=>{},resolve:async c=>({kind:'task-image',version:1,availability:'unavailable',reason:'IMAGE_SOURCE_MISSING',findingId:uuid(c.pointer)})}
 });
 if(!r.ok||warnings.length)refuse('SOURCE_REQUEST_INVALID',path,r.ok?warnings:r.issues);
 return placements;
}

export async function convertLegacyBundle(bundle,{legacyCore,targetCore}){
 try{
  plainJson(bundle);
  if(!object(bundle)||!['generation','task'].includes(bundle.requestKind)||!object(bundle.request)||!Array.isArray(bundle.imageParts??[]))refuse('INVALID_BUNDLE','');
  const source=bundle.template,model=source?.nodeModelVersion;
  if(![18,19].includes(model))refuse('LEGACY_MODEL_REQUIRED','template.nodeModelVersion');
  const validated=legacyCore.validateTemplate(source);
  if(!validated.ok)refuse('SOURCE_TEMPLATE_INVALID','template',validated.issues);
  if(model===18)visit(bundle,(x,path)=>{if(x.type==='reference')refuse('LEGACY_GLOBAL_REFERENCE_UNSUPPORTED',path);});
  if(model===18){
   // Model18 preserves the page of an empty document TOC;20 may omit it.
   // Only a guaranteed authored root heading proves document contents nonempty
   // for the request AND every example. Dynamic/repeated/nested evidence is
   // intentionally unsupported here rather than materializing a second graph.
   const nonempty=source.sections.some(s=>s.role!=='cover'&&s.source?.kind==='authored'&&s.source.repeats.length===0&&(s.source.fragment.rootIds??[]).some(id=>{
    const n=s.source.fragment.nodes[id];return n?.type==='text-block'&&n.props?.toc&&n.children.some(c=>c.type==='text'&&c.text.trim().length>0);
   }));
   if(!nonempty)visit(source,(x,path)=>{if(x.type==='table-of-contents')refuse('LEGACY_TOC_LAYOUT_UNPROVEN','template'+path);});
  }
  const sourcePlacements=new Set(await checkRequest(legacyCore,validated.value,bundle.request,bundle.requestKind,'request'));
  const template=structuredClone(source),sourceTemplateDigest=digest(source);
  const mapping=source.sections.map((s,i)=>({sourceId:s.id,...(model===18?{sourceKey:s.key}:{}),
   definitionId:uuid([sourceTemplateDigest,'section',s.id]),sectionKey:`S${String(i+1).padStart(4,'0')}`,instanceKey:`I${String(i+1).padStart(4,'0')}`,
   ...(s.origin?{sourceOrigin:structuredClone(s.origin)}:{})}));
  const ids=new Map(mapping.map(m=>[m.sourceId,m]));
  // Font schema and node model are separate contracts. Preserve schema1 font
  // keys; only a rights-backed font import may produce schema2 release IDs.
  template.nodeModelVersion=20;template.templateId=uuid([sourceTemplateDigest,'template20']);
  template.sections.forEach((s,i)=>{
   const m=mapping[i];s.id=m.definitionId;s.sectionKey=m.sectionKey;
   s.label=s.label??s.key;s.nameBase=s.nameBase??s.label;
   delete s.key;delete s.formats;delete s.origin;
  });
  function rewrite(x){visit(x,(v,path)=>{
   if(v.type==='table-of-contents'&&model===18)v.props.scope={kind:'document'};
   if(v.type==='reference'&&own(v,'targetSectionId')){
    const m=ids.get(v.targetSectionId);if(!m)refuse('REFERENCE_OWNER_UNMAPPED',path);
    v.targetInstanceKey=m.instanceKey;delete v.targetSectionId;
   }
  });}
  function request(raw,kind){
   const out=structuredClone(raw);
   out.sections=source.sections.map((s,i)=>{
    const e=model===18?(raw.sections?.[s.key]??{}):raw.sections.find(e=>e.id===s.id);
    const result={...structuredClone(e),sectionKey:mapping[i].sectionKey,instanceKey:mapping[i].instanceKey,data:structuredClone(e.data??{})};delete result.id;return result;
   });
   if(kind==='generation'){out.docKey=template.docKey;if(own(raw,'version'))out.version=template.version;}
   rewrite(out);return out;
  }
  template.examples=source.examples.map(e=>({...structuredClone(e),request:request(e.request,'generation')}));
  rewrite(template);
  const convertedRequest=request(bundle.request,bundle.requestKind);
  const imageParts=(bundle.imageParts??[]).map((part,i)=>{
   if(!object(part)||typeof part.pointer!=='string'||!part.pointer.startsWith('/')||/~(?:[^01]|$)/.test(part.pointer))refuse('IMAGE_POINTER_UNMAPPED',`imageParts[${i}]`);
   const tokens=part.pointer.slice(1).split('/').map(s=>s.replaceAll('~1','/').replaceAll('~0','~'));
   if(tokens[0]==='sections'){
    let index;if(model===18)index=source.sections.findIndex(s=>s.key===tokens[1]);
    else if(/^(0|[1-9][0-9]*)$/.test(tokens[1]))index=source.sections.findIndex(s=>s.id===bundle.request.sections[Number(tokens[1])]?.id);
    if(index===undefined||index<0)refuse('IMAGE_POINTER_UNMAPPED',`imageParts[${i}]`);tokens[1]=String(index);
   }else if(tokens[0]!=='data')refuse('IMAGE_POINTER_UNMAPPED',`imageParts[${i}]`);
   if(!sourcePlacements.has(part.pointer))refuse('IMAGE_PART_UNBOUND',`imageParts[${i}]`);
   return {...structuredClone(part),pointer:'/'+tokens.map(s=>s.replaceAll('~','~0').replaceAll('/','~1')).join('/')};
  });
  if(new Set(imageParts.map(p=>p.pointer)).size!==imageParts.length)refuse('IMAGE_POINTER_DUPLICATE','imageParts');
  const target=targetCore.validateTemplate(template);
  if(!target.ok)refuse('TARGET_TEMPLATE_INVALID','template',target.issues);
  await checkRequest(targetCore,target.value,convertedRequest,bundle.requestKind,'target.request');
  return {ok:true,value:{template,request:convertedRequest,requestKind:bundle.requestKind,imageParts,mapping,
   sourceDigest:digest(bundle),sourceTemplateDigest,targetDigest:digest({template,request:convertedRequest,imageParts}),
   validation:{sourceModel:model,targetModel:20,shapeAndDefaultsVerified:true,imageBytesVerified:false,fontRightsVerified:false}}};
 }catch(e){if(e instanceof Refusal)return {ok:false,issues:[e.issue]};throw e;}
}
