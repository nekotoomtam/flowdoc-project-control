import {readFileSync,writeFileSync,mkdirSync,readdirSync,cpSync,existsSync,realpathSync} from 'node:fs';
import {resolve,join,dirname,relative} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const repo=resolve(import.meta.dirname,'..'),sourcePlugin=join(repo,'plugins/flowdocmake');
const args=process.argv.slice(2),options={};
for(let i=0;i<args.length;i+=2){if(!['--candidate-profile','--out','--core-archive'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--')||options[args[i]])throw Error('Invalid or duplicate build argument');options[args[i]]=args[i+1];}
let profile=null,plugin=sourcePlugin;
if(args.length){
 if(!options['--candidate-profile']||!options['--out']||!options['--core-archive'])throw Error('Candidate profile, output and reviewed Core archive required');
 profile=JSON.parse(readFileSync(resolve(options['--candidate-profile']),'utf8'));
 const reviewed=['flowdocmake-docx-i5-profile.json','flowdocmake-050-profile.json'].map(name=>JSON.parse(readFileSync(join(repo,'tests/fixtures',name),'utf8')));
 if(!reviewed.some(p=>JSON.stringify(profile)===JSON.stringify(p)))throw Error('Unknown candidate profile');
 if(createHash('sha256').update(readFileSync(resolve(options['--core-archive']))).digest('hex')!==profile.supported.coreArtifactSha256)throw Error('Reviewed Core archive hash mismatch');
 plugin=resolve(options['--out']);
 // Resolve the existing parent so junctions cannot redirect output into source/cache.
 const parent=realpathSync(dirname(plugin)),actual=join(parent,plugin.slice(dirname(plugin).length+1));
 const folded=actual.toLowerCase().replaceAll('\\','/'),repoPath=realpathSync(repo).toLowerCase().replaceAll('\\','/');
 if(existsSync(plugin)||folded===repoPath||folded.startsWith(repoPath+'/')||folded.includes('/plugins/cache/')||folded.includes('/plugins/flowdocmake'))throw Error('Candidate output must be a new isolated directory outside source and installed cache');
}
const roots=['docs/examples/clis-model19','docs/examples/section-area-contract-20261017','docs/developer/authoring','docs/examples/ai-template-authoring','docs/domains/flowdoc-ai-template-authoring-guide.md','docs/domains/flowdoc-area-document-transition-2026-10-14.md','docs/domains/flowdoc-template-authoring-tools-plan.md','tools/check-developer-authoring.mjs','tools/check-developer-authoring-pdf.py'];
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
const dirty=execFileSync('git',['status','--porcelain','--',...roots],{cwd:repo,encoding:'utf8'}).trim();
if(dirty)throw Error('Commit canonical guide sources before snapshotting');
if(profile){
 cpSync(sourcePlugin,plugin,{recursive:true});
 writeFileSync(join(plugin,'scripts/compatibility-profile.mjs'),`export const supported=Object.freeze(${JSON.stringify(profile.supported)});\nexport const candidate=Object.freeze(${JSON.stringify({id:profile.id,version:profile.version})});\n`);
 const meta=JSON.parse(readFileSync(join(plugin,'.codex-plugin/plugin.json'),'utf8'));
 writeFileSync(join(plugin,'.codex-plugin/plugin.json'),JSON.stringify({...meta,name:profile.id,version:profile.version},null,2)+'\n');
 writeFileSync(join(plugin,'scripts/server-runtime.mjs'),readFileSync(join(sourcePlugin,'scripts/server.mjs')));
 writeFileSync(join(plugin,'scripts/server.mjs'),"import {startCandidate} from './candidate-entry.mjs';\nawait startCandidate();\n");
 writeFileSync(join(plugin,'.mcp.json'),JSON.stringify({mcpServers:{[profile.id]:{command:'node',args:[join(plugin,'scripts/server.mjs')]}}},null,2)+'\n');
}
const files={};
function copy(path){
 const abs=join(repo,path);
 if(!/\.(md|json|mjs|py)$/.test(path)){for(const entry of readdirSync(abs,{withFileTypes:true}))copy(path+'/'+entry.name);return;}
 const target='skills/flowdocmake/references/'+path;
 const bytes=Buffer.from(readFileSync(abs,'utf8').replace(/\r\n/g,'\n'),'utf8');
 mkdirSync(dirname(join(plugin,target)),{recursive:true});writeFileSync(join(plugin,target),bytes);
 files[target]=createHash('sha256').update(bytes).digest('hex');
}
for(const root of roots)copy(root);
const packageVersion=JSON.parse(readFileSync(join(plugin,'.codex-plugin/plugin.json'),'utf8')).version;
writeFileSync(join(plugin,'snapshot.json'),JSON.stringify({packageVersion,guideRelease:'0.5.0',sourceCommit,files},null,2)+'\n');
if(profile){
 const inventory={};
 function walk(path=''){for(const entry of readdirSync(join(plugin,path),{withFileTypes:true})){const p=(path?path+'/':'')+entry.name;if(entry.isDirectory())walk(p);else inventory[p]=createHash('sha256').update(readFileSync(join(plugin,p))).digest('hex');}}
 walk();writeFileSync(join(plugin,'candidate-inventory.json'),JSON.stringify({profile,sourceCommit,files:inventory},null,2)+'\n');
}
console.log(JSON.stringify({sourceCommit,files:Object.keys(files).length}));
