import {readFileSync,writeFileSync,mkdirSync,readdirSync,copyFileSync} from 'node:fs';
import {resolve,join,dirname,relative} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const repo=resolve(import.meta.dirname,'..'),plugin=join(repo,'plugins/flowdocmake');
const roots=['docs/examples/section-area-contract-20261017','docs/developer/authoring','docs/examples/ai-template-authoring','docs/domains/flowdoc-ai-template-authoring-guide.md','docs/domains/flowdoc-area-document-transition-2026-10-14.md','docs/domains/flowdoc-template-authoring-tools-plan.md','tools/check-developer-authoring.mjs','tools/check-developer-authoring-pdf.py'];
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
const dirty=execFileSync('git',['status','--porcelain','--',...roots],{cwd:repo,encoding:'utf8'}).trim();
if(dirty)throw Error('Commit canonical guide sources before snapshotting');
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
writeFileSync(join(plugin,'snapshot.json'),JSON.stringify({packageVersion,guideRelease:'0.4.3',sourceCommit,files},null,2)+'\n');
console.log(JSON.stringify({sourceCommit,files:Object.keys(files).length}));
