// Draft-only mechanics. Source inspection and PDF review remain agent duties.
import {readFileSync,writeFileSync,mkdirSync,existsSync,copyFileSync,constants,openSync,closeSync,unlinkSync} from 'node:fs';
import {join,resolve,isAbsolute} from 'node:path';
import {homedir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {checkCoverage} from './reference-coverage.mjs';
import {checkDeadline,checkRepresentatives} from './representative-review.mjs';
import {execFileSync} from 'node:child_process';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const hash=v=>createHash('sha256').update(v).digest('hex');
function failure(code,details={}){return Object.assign(new Error(code),{code,...details});}
function substitute(value,from,to){
 if(typeof value==='string')return value.replaceAll(from,to);
 if(Array.isArray(value))return value.map(v=>substitute(v,from,to));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,substitute(v,from,to)]));
 return value;
}
function prepare(planPath,countPages){
 const plan=read(planPath),inventory=read(plan.inventoryPath),coverage=read(plan.coveragePath);
 if(!checkCoverage(coverage,inventory.source,'source').ok||hash(readFileSync(inventory.source.path))!==inventory.source.sha256)throw failure('SOURCE_INSPECTION_REQUIRED');
 if(!['representatives','full'].includes(plan.stage))throw failure('PLAN_STAGE_REQUIRED');
 if(!plan.taskPath)throw failure('TRIAL_DEADLINE_REQUIRED');
 const task=read(plan.taskPath);checkDeadline(task);
 if(task.source?.sha256!==inventory.source.sha256)throw failure('TASK_SOURCE_PARTS_CHANGED');
 if(!['new','preserve','replace-if-conflict'].includes(plan.draftPolicy))throw failure('DRAFT_POLICY_REQUIRED');
 if(plan.draftPolicy!=='new'&&!plan.existingTemplateId)throw failure('EXISTING_TEMPLATE_ID_REQUIRED');
 for(const key of ['docKey','name','workDirectory','candidateDirectory'])if(!plan[key])throw failure('PLAN_FIELD_REQUIRED',{field:key});
 const directory=resolve(plan.candidateDirectory),definition=read(join(directory,'template.json'));
 if(plan.stage==='full'){
  if(!plan.representativeReviewPath)throw failure('REPRESENTATIVES_REQUIRED');
  const gate=checkRepresentatives(read(plan.representativeReviewPath),coverage,inventory.source,readFileSync(join(directory,'template.json')),{countPages});
  if(!gate.ok)throw failure('REPRESENTATIVES_REQUIRED',{issues:gate.errors});
 }
 let request=read(join(directory,'request.json'));
 if(![1,2].includes(definition.schemaVersion)||![18,19].includes(definition.nodeModelVersion))throw failure('SUPPORTED_MODEL_REQUIRED');
 for(const change of plan.replacements??[]){
  if(!change.from||!change.to||!change.evidence)throw failure('REPLACEMENT_EVIDENCE_REQUIRED');
  const replaced=substitute(request,change.from,change.to);
  if(JSON.stringify(request)===JSON.stringify(replaced))throw failure('REPLACEMENT_SOURCE_NOT_FOUND');request=replaced;
 }
 const assets=existsSync(join(directory,'upload-files.json'))?read(join(directory,'upload-files.json')):[];
 const assetHashes=assets.map(a=>({id:a.id,hash:hash(readFileSync(resolve(directory,a.file)))}));
 return {plan,inventory,coverage,directory,definition,request,assets,identity:hash(JSON.stringify({plan,source:inventory.source.sha256,definition,request,assets:assetHashes}))};
}
async function connect(configPath){
 const config=read(configPath??process.env.FLOWDOCMAKE_CONFIG??join(homedir(),'.codex/flowdocmake.local.json'));
 const load=p=>import(pathToFileURL(join(config.serviceRoot,p)).href);
 const {Client}=await load('node_modules/@modelcontextprotocol/client/dist/index.mjs');
 const {StdioClientTransport}=await load('node_modules/@modelcontextprotocol/client/dist/stdio.mjs');
 const wiring=read(join(config.pluginRoot,'.mcp.json')).mcpServers.flowdocmake;
 const client=new Client({name:'flowdocmake-candidate-workflow',version:'0.1.2'}),transport=new StdioClientTransport({...wiring,command:process.execPath,env:{...process.env,...wiring.env,...(configPath?{FLOWDOCMAKE_CONFIG:configPath}:{})},stderr:'pipe'});
 try{await client.connect(transport);}catch(e){await transport.close();throw e;}
 return {invoke:(name,args)=>client.callTool({name,arguments:args}),close:async()=>{await client.close();await transport.close();}};
}
export async function runCandidatePlan(planPath,{checkOnly=false,waitMs=15000,invoke,configPath,countPages,log=()=>{}}={}){
 if(typeof planPath!=='string'||!isAbsolute(planPath))throw failure('ABSOLUTE_PLAN_PATH_REQUIRED');
 const pdfPages=countPages??(path=>{const cfg=read(configPath??process.env.FLOWDOCMAKE_CONFIG??join(homedir(),'.codex/flowdocmake.local.json'));return Number(execFileSync(cfg.python,['-c','from pypdf import PdfReader; import sys; print(len(PdfReader(sys.argv[1]).pages))',path],{encoding:'utf8',windowsHide:true,timeout:15000}));});
 const prepared=prepare(resolve(planPath),pdfPages),{plan,inventory,coverage,directory,definition,assets,identity}=prepared;
 let request=prepared.request;
 if(checkOnly)return {ok:true,status:'checked',validation:'local-input-only',coreValidationRun:false,complete:false,nextAction:'Run mode=run for Core validation. Local checks do not establish template grammar correctness.',sourcePages:inventory.source.pageCount,parts:coverage.parts.length,assets:assets.length,draftPolicy:plan.draftPolicy,planHash:identity,mutated:false};
 const out=resolve(plan.workDirectory);mkdirSync(out,{recursive:true});const checkpoint=join(out,'candidate-checkpoint.json'),lockPath=join(out,'candidate.lock');
 let lock;try{lock=openSync(lockPath,'wx');}catch{throw failure('WORKFLOW_BUSY',{checkpoint,nextAction:'Wait for the active call; do not remove its lock.'});}
 let connection;
 try{
  const state=existsSync(checkpoint)?read(checkpoint):{planHash:identity,key:randomUUID(),calls:{},source:inventory.source};
  if(state.planHash!==identity)throw failure('CHECKPOINT_INPUT_CHANGED',{checkpoint,nextAction:'Preserve this run; use a fresh workDirectory for changed inputs.'});
  const save=()=>writeFileSync(checkpoint,JSON.stringify(state,null,2)+'\n',{mode:0o600});save();
  if(!invoke){connection=await connect(configPath);invoke=connection.invoke;}
  async function call(step,tool,args,cache=true){
   checkDeadline(read(plan.taskPath));
   const old=state.calls[step];
   if(cache){
    if(old&&JSON.stringify(old.args)!==JSON.stringify(args))throw failure('MUTATION_PAYLOAD_CHANGED',{step,checkpoint});
    if(old?.value)return old.value;
    state.calls[step]={...old,tool,args:structuredClone(args)};save();
   }
   const response=await invoke(tool,args);
   let parsed=response;
   if(response.content){try{parsed=JSON.parse(response.content.find(x=>x.type==='text')?.text??'{}');}catch{throw failure('TOOL_RESPONSE_UNREADABLE',{step,checkpoint});}}
   if(response.isError||parsed.ok===false){
    state.failure={step,response};save();
    throw failure(parsed.code??parsed.issues?.[0]?.code??'AUTHORING_FAILED',{step,checkpoint,issues:parsed.issues,nextAction:'Inspect the failing receipt. Retry uncertain requests with this unchanged plan.'});
   }
   const value=parsed.value??parsed;if(cache){state.calls[step].value=value;delete state.failure;save();}
   log({step,ok:true,templateId:value.templateId,revision:value.revision,jobId:value.jobId,status:value.status});return value;
  }
  const context=await call('context','get_flowdocmake_context',{},false);if(!context.ready)throw failure(context.code??'PREFLIGHT_NOT_READY',{checkpoint});state.context=context;save();
  async function create(step){return call(step,'create_template_draft',{name:plan.name,docKey:plan.docKey,idempotencyKey:state.key+'-'+step});}
  let draft;
  if(plan.draftPolicy==='new')draft=await create('create');
  else draft=await call('original','get_template_draft',{templateId:plan.existingTemplateId});
  // Core's image scalar requires a resource ID, not the candidate's local alias.
  // Persist upload receipts before validating the exact sample used for preview.
  let upload;
  if(assets.length){
   upload=await call('upload','create_preview_upload',{requestKey:state.key+'-images',items:assets.map((a,i)=>({key:'asset'+i,source:'upload',mediaType:a.file.toLowerCase().endsWith('.png')?'image/png':'image/jpeg',byteSize:readFileSync(resolve(directory,a.file)).length}))});
   for(let i=0;i<assets.length;i++)await call('image'+i,'upload_preview_image_file',{uploadId:upload.uploadId,resourceId:upload.items[i].resourceId,path:resolve(directory,assets[i].file)});
   await call('finalize','finalize_preview_upload',{uploadId:upload.uploadId});
   for(let i=0;i<assets.length;i++)request=substitute(request,assets[i].id,upload.items[i].resourceId);
  }
  async function saveDraft(selected,prefix){
   definition.templateId=selected.templateId;definition.docKey=request.docKey=selected.docKey;definition.version=1;
   await call(prefix+'validate','validate_template',{definition,sampleRequest:request});
   return call(prefix+'save','update_template_draft',{templateId:selected.templateId,expectedRevision:selected.revision,definition,idempotencyKey:state.key+'-'+prefix+'save'});
  }
  let saved;
  if(state.calls.replacement?.value){draft=state.calls.replacement.value;saved=await saveDraft(draft,'replacement-');}
  else try{saved=await saveDraft(draft,'');}catch(e){
   if(e.code!=='OWNERSHIP_CONFLICT'||plan.draftPolicy!=='replace-if-conflict')throw e;
   state.replacesTemplateId=draft.templateId;save();draft=await create('replacement');saved=await saveDraft(draft,'replacement-');
  }
  const job=await call('preview','preview_template_draft',{templateId:draft.templateId,expectedRevision:saved.revision,sampleRequest:{...request,...(upload?{uploadId:upload.uploadId}:{})},idempotencyKey:state.key+'-preview'});
  const deadline=Date.now()+Math.min(Math.max(waitMs,0),20000);
  for(;;){
   state.status=await call('status','get_preview_status',{jobId:job.jobId},false);save();
   if(state.status.status==='succeeded')break;
   if(state.status.status==='failed')throw failure('RENDER_FAILED',{checkpoint,jobId:job.jobId,issues:state.status.errors,nextAction:'Preserve the failed input; repair the candidate in a new run without truncating source.'});
   if(Date.now()>=deadline)return {ok:true,status:'pending',complete:false,checkpoint,templateId:draft.templateId,revision:saved.revision,jobId:job.jobId,nextAction:{tool:'run_candidate_preview',arguments:{planPath:resolve(planPath),mode:'run'}}};
   await new Promise(r=>setTimeout(r,Math.min(2000,Math.max(0,deadline-Date.now()))));
  }
  const pdf=await call('pdf','save_preview_pdf',{jobId:job.jobId}),copy=join(out,'preview.pdf');
  if(!existsSync(copy))copyFileSync(pdf.path,copy,constants.COPYFILE_EXCL);
  if(hash(readFileSync(copy))!==pdf.sha256)throw failure('OUTPUT_BYTES_CHANGED',{checkpoint});
  state.output={...pdf,path:copy,templateId:draft.templateId,revision:saved.revision};save();
  return {ok:true,status:'pdf-ready',complete:false,reviewRequired:true,checkpoint,output:state.output,warnings:state.status.warnings??[],nextAction:{instruction:'Render and inspect every output page against the source; finish delivery coverage before claiming completion.'}};
 }finally{try{await connection?.close();}finally{closeSync(lock);unlinkSync(lockPath);}}
}
