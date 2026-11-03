import {createHash} from 'node:crypto';
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>createHash('sha256').update(canonical(x)).digest('hex');
export const taskValue=v=>({async byteLength(){return Buffer.byteLength(JSON.stringify(v));},async kind(){return Array.isArray(v)?'array':v!==null&&typeof v==='object'?'object':'scalar';},async scalar(){return v;},async *properties(){for(const[k,x]of Object.entries(v))yield[k,taskValue(x)];},async *elements(){for(const x of v)yield taskValue(x);}});
export const assetId=sha=>`${sha.slice(0,8)}-${sha.slice(8,12)}-4${sha.slice(13,16)}-8${sha.slice(17,20)}-${sha.slice(20,32)}`;
export async function compose(core,template,request,parts){
 const checked=core.validateTemplate(template);if(!checked.ok)throw Error(JSON.stringify(checked));
 // Exercise the actual frozen Service image owner, including scoped shared
 // asset keys and byte/hash/media validation. Never fabricate available images.
 const {createTaskImageIndex}=await import('/candidate/dist/tasks/image-index.js');
 const findings=[];const images=createTaskImageIndex({files:parts.map(p=>({id:assetId(sha(p.pointer)),logical_path:p.pointer,media_type:p.type,state:'received',error_code:null,storage_key:p.sha256,stored_bytes:String(p.bytes),checksum:p.sha256})),
  pathFor:async key=>'/proof/assets/'+key,budgetBytes:64*1048576,onFinding:async finding=>findings.push(finding)});
 let normalized='';
 const r=await core.normalizeTaskInput(checked.value,taskValue(request),{write:async chunk=>{normalized+=chunk;},images});
 if(!r.ok)throw Error(JSON.stringify(r));
 const result=await core.composeTaskDocument(checked.value,taskValue(JSON.parse(normalized)));
 if(!result.ok)throw Error(JSON.stringify(result));const inventory=await images.finish();
 if(inventory.omittedPlacementCount||findings.length)throw Error('Image evidence incomplete '+JSON.stringify({inventory,findings}));
 return {document:result.value,inventory};
}
// Complete resolved graph facts with an explicit, narrow identity isomorphism.
// Text, styles, table cells/merges/repeats, bands, layout and provenance stay in
// the digest. Only model/template occurrence metadata and anchor scoping differ.
export function documentFacts({document,inventory},mapping,sourceModel,target=false){
 const assets=new Map(inventory.assets.map(a=>[a.assetId,a.sha256]));
 const owners=new Map(mapping.map((m,i)=>[target?'instance-'+m.instanceKey:m.sourceId,'slot'+i]));
 const idFields=new Set(['id','sectionId','rootIds','childIds','cellIds','rowIds','prefixRowIds','firstMemberRowId','cellId','sourceCellId']);
 const id=s=>{if(owners.has(s))return owners.get(s);for(const [from,to]of owners)if(typeof s==='string'&&s.startsWith('section-'+from+'~'))return 'section-'+to+'~'+s.slice(('section-'+from+'~').length);return s;};
 function anchor(s,owner){if(!target&&sourceModel===18)return JSON.stringify([owners.get(owner),s]);const [o,v]=JSON.parse(s);if(!owners.has(o))throw Error('Unmapped anchor owner');return JSON.stringify([owners.get(o),v]);}
 function value(x,key='',owner){
  if(Array.isArray(x))return x.map(v=>value(v,key,owner));
  if(x===null||typeof x!=='object')return idFields.has(key)?id(x):x;
  const out={};for(const [k,v]of Object.entries(x)){
   if(k==='resourceId'){if(!assets.has(v))throw Error('Unverified image resource');out[k]=assets.get(v);}
   else if(k==='anchorId')out[k]=anchor(v,owner);
   else if(k==='target'&&x.type==='reference')out[k]=anchor(v,owner);
   else out[k]=value(v,k,owner);
  }
  if(x.type==='table-of-contents'&&!target&&sourceModel===18)out.props.scope={kind:'document'};
  return out;
 }
 function graph(nodes,sourceMap){return Object.keys(nodes).sort().map(key=>{
  const node=nodes[key],source=sourceMap[key],owner=source?.sectionId;
  return [id(key),sha(value(node,'',owner)),sha(value(source,'',owner))];
 }).sort((a,b)=>a[0].localeCompare(b[0]));}
 const sections=document.sections.map(section=>{
  const {definitionId,sectionKey,instanceKey,header,footer,...rest}=section;
  return {...value(rest),...(header?{header:band(header)}:{}),...(footer?{footer:band(footer)}:{})};
 });
 function band(b){const {nodes,sourceMap,...rest}=b;return {definition:value(rest),graph:graph(nodes,sourceMap)};}
 return {schemaVersion:document.schemaVersion,docKey:document.template.docKey,version:document.template.version,book:document.book,styles:document.styles,
  rootIds:document.rootIds.map(id),sections,graph:graph(document.nodes,document.sourceMap),formatInstances:value(document.formatInstances??[])};
}
