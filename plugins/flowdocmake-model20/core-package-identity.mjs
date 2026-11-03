import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
// Self-contained so the same read-only calculation can run in the real Docker
// runtime through its metadata probe. Dependency trees have a separate lock gate.
export function corePackageFilesSha256(root){
 const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto'),base=fs.realpathSync(root),files=[];
 function visit(dir,relative=''){
  for(const name of fs.readdirSync(dir).sort()){
   if(name==='node_modules')continue;
   const file=path.join(dir,name),key=relative?relative+'/'+name:name,stat=fs.lstatSync(file);
   if(stat.isSymbolicLink())throw Error('Internal Core package symlink');
   if(stat.isDirectory())visit(file,key);
   else if(stat.isFile())files.push([key,createHash('sha256').update(fs.readFileSync(file)).digest('hex')]);
   else throw Error('Unexpected Core package file');
  }
 }
 visit(base);files.sort(([a],[b])=>a<b?-1:a>b?1:0);
 return createHash('sha256').update(JSON.stringify(files)).digest('hex');
}
