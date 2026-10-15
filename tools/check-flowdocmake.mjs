import {Client} from '../../flowdoc-service/node_modules/@modelcontextprotocol/client/dist/index.mjs';
import {StdioClientTransport} from '../../flowdoc-service/node_modules/@modelcontextprotocol/client/dist/stdio.mjs';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {homedir} from 'node:os';
import assert from 'node:assert/strict';
const plugin=process.argv[2]??JSON.parse(readFileSync(join(homedir(),'.codex/flowdocmake.local.json'),'utf8')).pluginRoot;
const manifest=JSON.parse(readFileSync(join(plugin,'.codex-plugin/plugin.json'),'utf8'));
const client=new Client({name:'flowdocmake-verification',version:'0.1.0'});
const wiring=JSON.parse(readFileSync(join(plugin,'.mcp.json'),'utf8')).mcpServers.flowdocmake;
const transport=new StdioClientTransport({...wiring,command:process.execPath,stderr:'pipe'});
try{
 await client.connect(transport);
 const tools=(await client.listTools()).tools;
 assert(!tools.some(t=>/publish/.test(t.name)));
 for(const name of ['get_flowdocmake_context','get_authoring_contract','create_template_draft','update_template_draft','validate_template','preview_template_draft','get_preview_status','save_preview_pdf','create_preview_upload','upload_preview_image','finalize_preview_upload'])assert(tools.some(t=>t.name===name),name);
 const result=await client.callTool({name:'get_flowdocmake_context',arguments:{}});
 const context=JSON.parse(result.content[0].text);
 const output=resolve('artifacts/flowdocmake');mkdirSync(output,{recursive:true});
 writeFileSync(join(output,'preflight.json'),JSON.stringify(context,null,2));
 assert(context.ready,JSON.stringify(context));
 assert.equal(context.packageVersion,manifest.version,'Installed manifest and running package differ');
 assert.equal(context.documentation.packageVersion,manifest.version,'Guide snapshot is from another package');
 console.log(JSON.stringify({ready:context.ready,packageVersion:context.packageVersion,runtime:context.runtime,toolCount:tools.length,guide:context.guide}));
}finally{await client.close();await transport.close();}
