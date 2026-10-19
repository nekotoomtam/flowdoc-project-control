import {registerTaskTools} from './task-tools.mjs';
import {registerFontHeightTools} from './font-height-tools.mjs';
import {readFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {assess,usesGroupLabels,checkGroupLabelCapability} from './compatibility.mjs';
import {runCandidatePlan} from './candidate-workflow.mjs';
import {documentTask,classifyFailure} from './document-task.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const packageVersion=JSON.parse(readFileSync(join(root,'.codex-plugin/plugin.json'),'utf8')).version;
const config=JSON.parse(readFileSync(process.env.FLOWDOCMAKE_CONFIG??join(homedir(),'.codex','flowdocmake.local.json'),'utf8'));
const token=readFileSync(config.credentialFile,'utf8').match(/^AUTHORING_TOKEN=(.+)$/m)?.[1].trim();
if(!token) throw Error('FlowDoc authoring credential missing');
const load=p=>import(pathToFileURL(join(config.serviceRoot,p)).href);
const {createAuthoringTools}=await load('dist/tools/authoring.js');
const {serveStdio}=await load('node_modules/@modelcontextprotocol/server/dist/stdio.mjs');
const z=createRequire(join(config.serviceRoot,'package.json'))('zod/v4');
const run=(file,args)=>execFileSync(file,args,{encoding:'utf8',timeout:15000,windowsHide:true,stdio:['ignore','pipe','pipe']}).trim();
async function preflight(){
 try {
  const manifest=JSON.parse(readFileSync(join(root,'snapshot.json'),'utf8'));
  for(const [path,hash] of Object.entries(manifest.files)) if(createHash('sha256').update(readFileSync(join(root,path))).digest('hex')!==hash) return {ready:false,code:'GUIDE_INTEGRITY_FAILURE'};
  let response;
  try {response=await fetch(new URL('/authoring/contract',config.url),{headers:{authorization:'Bearer '+token},redirect:'error',signal:AbortSignal.timeout(10000)});} catch{return {ready:false,code:'SERVICE_UNREACHABLE'};}
  if(response.status===401||response.status===403)return {ready:false,code:'AUTHORIZATION_FAILED'};
  if(!response.ok)return {ready:false,code:'SERVICE_ERROR',status:response.status};
  const body=await response.json(),contract=body.value;
  let runtime=null,pdf=false;
  try {
   const inspect=JSON.parse(run('docker',['inspect',config.container]))[0];
   const ports=Object.values(inspect.NetworkSettings.Ports).flat().filter(Boolean);
   const port=ports.find(p=>p.HostIp==='127.0.0.1'&&p.HostPort===new URL(config.url).port)?.HostPort;
   const versions=JSON.parse(run('docker',['exec',config.container,'node','-e',"const fs=require('fs'),m=require('./vendor/manifest.json');if(!/^[a-zA-Z0-9_.-]+[.]tgz$/.test(m.file))throw Error('artifact');const actual=require('crypto').createHash('sha256').update(fs.readFileSync('./vendor/'+m.file)).digest('hex');if(actual!==m.sha256)throw Error('artifact');console.log(JSON.stringify({service:require('./package.json').version,core:require('./node_modules/@flowdoc/core/package.json').version,coreArtifactSha256:actual}))"]));
   runtime={...versions,port,imageId:inspect.Image,identitySource:'local Docker container inspection, not HTTP contract'};
  }catch{}
  try{run(config.python,['-c','from pypdf import PdfReader; from PIL import Image']);run('pdftoppm',['-v']);pdf=true;}catch{}
  return {...assess({contract,runtime,pdf,expectedPort:new URL(config.url).port}),packageVersion,documentation:manifest,runtime,contract:{groupLabelSpans:contract?.groupLabelSpans,formatSizing:contract?.formatSizing,sectionInstances:contract?.sectionInstances,nodeModelVersions:contract?.nodeModelVersions,draftDefinitionVersion:contract?.draftDefinitionVersion,publicationEnabled:contract?.publicationEnabled},guide:resolve(root,'skills/flowdocmake/references/docs/developer/authoring/README.md'),workflow:resolve(root,'skills/flowdocmake/references/docs/domains/flowdoc-ai-template-authoring-guide.md')};
 } catch{return {ready:false,code:'LOCAL_CONFIGURATION_OR_GUIDE_ERROR'};}
}
serveStdio(()=>{
 const server=createAuthoringTools({baseUrl:config.url,token,previewDirectory:config.previewDirectory,fetch:async(url,init)=>{
  const definition=init?.body&&JSON.parse(init.body).definition;
  if(usesGroupLabels(definition)){
   const r=await fetch(new URL('/authoring/contract',config.url),{headers:{authorization:'Bearer '+token},redirect:'error',signal:AbortSignal.timeout(10000)});
   if(!r.ok)return Response.json({ok:false,code:r.status===401||r.status===403?'AUTHORIZATION_FAILED':'SERVICE_ERROR',warnings:[]},{status:r.status});
   const result=checkGroupLabelCapability(definition,(await r.json()).value);
   if(!result.ok)return Response.json(result,{status:422});
  }
  return fetch(url,init);
 }});
 registerFontHeightTools(server,{z,config,token});
 registerTaskTools(server,{z,config,authoringToken:token});
 server.registerTool('manage_document_task',{
  description:'Persist per-part unfinished authoring/review work separately from immutable preview runs. init from completed source inventory and coverage; read on resumption; update one part with expectedRevision; review binds coverage to a succeeded preview checkpoint and the real PDF. Only review can mark pass/complete. Does not mutate drafts or certify visual truth. A changed PDF requires fresh comparison. Use a thread Goal only when authorized by the user; this tool does not schedule work.',
  inputSchema:z.object({action:z.enum(['init','read','update','review']),taskPath:z.string().min(1),timeLimitMinutes:z.number().int().min(1).max(120).optional(),expectedRevision:z.number().int().min(0).optional(),inventoryPath:z.string().optional(),coveragePath:z.string().optional(),checkpointPath:z.string().optional(),partId:z.string().optional(),status:z.enum(['pending','authoring','needs-repair','needs-review']).optional(),note:z.string().optional()}).strict(),
  annotations:{readOnlyHint:false,destructiveHint:false,openWorldHint:false}
 },async args=>{
  try{return {content:[{type:'text',text:JSON.stringify(documentTask(args,{countPages:path=>Number(run(config.python,['-c','from pypdf import PdfReader; import sys; print(len(PdfReader(sys.argv[1]).pages))',path]))}))}]};}
  catch(e){const code=e.code??'TASK_INPUT_INVALID';return {isError:true,content:[{type:'text',text:JSON.stringify({ok:false,code,...classifyFailure(code)})}]};}
 });
 server.registerTool('run_candidate_preview',{
  description:'Run/resume draft-only mechanics from absolute planPath. First mode=check. Requires stage=representatives or full, taskPath with unexpired deadline, source inspection and explicit draftPolicy. Full requires representativeReviewPath with paired PNG evidence and passing comparisons for every observed layout family, bound to current definition and a real succeeded PDF. Expiry returns TRIAL_TIME_LIMIT: pause Goal. Pending means resume same plan. PDF-ready still needs full review. Never publishes or certifies visual truth.',
  inputSchema:z.object({planPath:z.string().min(1),mode:z.enum(['check','run']),waitMs:z.number().int().min(0).max(20000).optional()}).strict(),
  annotations:{readOnlyHint:false,destructiveHint:true,openWorldHint:false,idempotentHint:true}
 },async({planPath,mode,waitMs})=>{
  try{return {content:[{type:'text',text:JSON.stringify(await runCandidatePlan(planPath,{checkOnly:mode==='check',waitMs,configPath:process.env.FLOWDOCMAKE_CONFIG}))}]};}
  catch(e){const code=e.code??'CANDIDATE_WORKFLOW_FAILED';return {isError:true,content:[{type:'text',text:JSON.stringify({ok:false,code,...classifyFailure(code),step:e.step,checkpoint:e.checkpoint,jobId:e.jobId,issues:e.issues,detail:e.nextAction})}]};}
 });
 server.registerTool('upload_preview_image_file',{description:'Upload an original local PNG/JPEG file directly as binary to an owned preview upload item. Use after create_preview_upload; preserves bytes and avoids base64 limits. No publication.',inputSchema:z.object({uploadId:z.string().uuid(),resourceId:z.string().uuid(),path:z.string().min(1)}).strict(),annotations:{readOnlyHint:false,destructiveHint:false,openWorldHint:false}},async({uploadId,resourceId,path})=>{
  try{
   const {statSync}=await import('node:fs');
   const size=statSync(path).size;if(size<1||size>52428800)throw Error();
   const bytes=readFileSync(path);if(bytes.length!==size)throw Error();
   const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
   const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
   if(!png&&!jpeg)throw Error();
   const response=await fetch(new URL(`/authoring/uploads/${uploadId}/items/${resourceId}/content`,config.url),{method:'PUT',headers:{authorization:'Bearer '+token,'content-type':png?'image/png':'image/jpeg'},body:bytes,redirect:'error',signal:AbortSignal.timeout(60000)});
   const result=await response.json();return {content:[{type:'text',text:JSON.stringify(result)}],isError:!response.ok||result.ok===false};
  }catch{return {content:[{type:'text',text:JSON.stringify({ok:false,code:'IMAGE_FILE_UPLOAD_FAILED'})}],isError:true};}
 });
 server.registerTool('get_flowdocmake_context',{description:'First call for flowdocmake: read-only connection, authentication, pinned guide integrity, exact configured candidate Service/Core and pinned Core artifact and PDF-reader preflight. Returns local guide paths. Do not mutate drafts unless ready=true.',annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false}},async()=>({content:[{type:'text',text:JSON.stringify(await preflight())}]}));
 return server;
});
