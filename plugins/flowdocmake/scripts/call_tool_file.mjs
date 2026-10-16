// Local argument/result files are task checkpoints, never template storage.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {homedir} from 'node:os';
import {pathToFileURL} from 'node:url';
const allowed=new Set(['get_font_catalog','get_draft_font_readiness','clone_template_draft','manage_document_task','get_flowdocmake_context','get_authoring_contract','create_template_draft','get_template_draft','update_template_draft','validate_template','preview_template_draft','get_preview_status','save_preview_pdf','get_preview_pdf','create_preview_upload','upload_preview_image','upload_preview_image_file','finalize_preview_upload','run_candidate_preview']);
const [tool,input,output]=process.argv.slice(2);
if(!allowed.has(tool)||!input||!output){console.error('Usage: node call_tool_file.mjs <draft-only tool name> <arguments.json> <new-result.json>');process.exit(1);}
const resultPath=resolve(output);
if(existsSync(resultPath)){console.error('Result already exists; read it before retrying, or choose a new checkpoint path.');process.exit(1);}
const config=JSON.parse(readFileSync(process.env.FLOWDOCMAKE_CONFIG??join(homedir(),'.codex/flowdocmake.local.json'),'utf8'));
const load=p=>import(pathToFileURL(join(config.serviceRoot,p)).href);
const {Client}=await load('node_modules/@modelcontextprotocol/client/dist/index.mjs');
const {StdioClientTransport}=await load('node_modules/@modelcontextprotocol/client/dist/stdio.mjs');
const wiring=JSON.parse(readFileSync(join(config.pluginRoot,'.mcp.json'),'utf8')).mcpServers.flowdocmake;
const args=JSON.parse(readFileSync(resolve(input),'utf8'));
const client=new Client({name:'flowdocmake-file-arguments',version:'0.1.1'}),transport=new StdioClientTransport({...wiring,command:process.execPath,env:{...process.env,...wiring.env},stderr:'pipe'});
try{
 await client.connect(transport);
 const response=await client.callTool({name:tool,arguments:args});
 // Persist the exact response before reporting success; never overwrite prior receipts.
 writeFileSync(resultPath,JSON.stringify(response,null,2)+'\n',{flag:'wx',mode:0o600});
 let parsed;try{parsed=JSON.parse(response.content.find(x=>x.type==='text')?.text??'{}');}catch{}
 const value=parsed?.value??parsed;
 const ok=!response.isError&&parsed?.ok!==false;
 console.log(JSON.stringify({tool,ok,resultPath,...Object.fromEntries(['ready','code','packageVersion','templateId','docKey','revision','fingerprint','jobId','status','path','byteSize','sha256'].filter(k=>value?.[k]!==undefined).map(k=>[k,value[k]])),...(!ok?{issues:parsed?.issues??response.content?.filter(x=>x.type==='text').map(x=>x.text).slice(0,1)}:{})}));
 if(!ok)process.exitCode=1;
}finally{await client.close();await transport.close();}
