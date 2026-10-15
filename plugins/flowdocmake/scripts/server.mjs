import {readFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {assess} from './compatibility.mjs';
import {runCandidatePlan} from './candidate-workflow.mjs';
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
   const versions=JSON.parse(run('docker',['exec',config.container,'node','-e',"console.log(JSON.stringify({service:require('./package.json').version,core:require('./node_modules/@flowdoc/core/package.json').version}))"]));
   runtime={...versions,port,imageId:inspect.Image,identitySource:'local Docker container inspection, not HTTP contract'};
  }catch{}
  try{run(config.python,['-c','from pypdf import PdfReader; from PIL import Image']);run('pdftoppm',['-v']);pdf=true;}catch{}
  return {...assess({contract,runtime,pdf}),packageVersion,documentation:manifest,runtime,contract:{nodeModelVersions:contract?.nodeModelVersions,draftDefinitionVersion:contract?.draftDefinitionVersion,publicationEnabled:contract?.publicationEnabled},guide:resolve(root,'skills/flowdocmake/references/docs/developer/authoring/README.md'),workflow:resolve(root,'skills/flowdocmake/references/docs/domains/flowdoc-ai-template-authoring-guide.md')};
 } catch{return {ready:false,code:'LOCAL_CONFIGURATION_OR_GUIDE_ERROR'};}
}
serveStdio(()=>{
 const server=createAuthoringTools({baseUrl:config.url,token,previewDirectory:config.previewDirectory});
 server.registerTool('run_candidate_preview',{
  description:'Run or resume draft-only authoring mechanics from an absolute local plan JSON path. First use mode=check. Requires completed source inventory/coverage and explicit draftPolicy: new, preserve, or replace-if-conflict (only with owner-authorized replacement). Saves validation, exact mutation receipts, image uploads, preview and PDF in a checkpoint. Pending means call this same tool/plan again. pdf-ready still requires full visual/data/source comparison; never publishes or certifies completion.',
  inputSchema:z.object({planPath:z.string().min(1),mode:z.enum(['check','run']),waitMs:z.number().int().min(0).max(20000).optional()}).strict(),
  annotations:{readOnlyHint:false,destructiveHint:true,openWorldHint:false,idempotentHint:true}
 },async({planPath,mode,waitMs})=>{
  try{return {content:[{type:'text',text:JSON.stringify(await runCandidatePlan(planPath,{checkOnly:mode==='check',waitMs,configPath:process.env.FLOWDOCMAKE_CONFIG}))}]};}
  catch(e){return {isError:true,content:[{type:'text',text:JSON.stringify({ok:false,code:e.code??'CANDIDATE_WORKFLOW_FAILED',step:e.step,checkpoint:e.checkpoint,jobId:e.jobId,issues:e.issues,nextAction:e.nextAction??'Read the plan and checkpoint. Preserve receipts; do not change a pending mutation or publish.'})}]};}
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
 server.registerTool('get_flowdocmake_context',{description:'First call for flowdocmake: read-only connection, authentication, pinned guide integrity, exact local Service/Core 0.3.0 and PDF-reader preflight. Returns local guide paths. Do not mutate drafts unless ready=true.',annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false}},async()=>({content:[{type:'text',text:JSON.stringify(await preflight())}]}));
 return server;
});
