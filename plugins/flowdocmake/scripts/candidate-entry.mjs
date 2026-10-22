import {readFileSync,realpathSync} from 'node:fs';
import {isAbsolute,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {supported,candidate} from './compatibility-profile.mjs';

export function validateCandidateConfig(configPath,root){
 if(!candidate||!configPath||!isAbsolute(configPath))throw Error('Candidate requires explicit absolute FLOWDOCMAKE_CONFIG');
 const config=JSON.parse(readFileSync(configPath,'utf8'));
 if(!isAbsolute(config.pluginRoot??'')||realpathSync(config.pluginRoot)!==realpathSync(root))throw Error('Candidate pluginRoot mismatch');
 const url=new URL(config.url);
 if(url.protocol!=='http:'||!['127.0.0.1','[::1]'].includes(url.hostname)||url.username||url.password)throw Error('Candidate requires explicit loopback Service URL');
 if(!isAbsolute(config.serviceRoot??''))throw Error('Candidate requires absolute serviceRoot');
 const service=JSON.parse(readFileSync(join(config.serviceRoot,'package.json'),'utf8'));
 const core=JSON.parse(readFileSync(join(config.serviceRoot,'node_modules/@flowdoc/core/package.json'),'utf8'));
 const manifest=JSON.parse(readFileSync(join(config.serviceRoot,'vendor/manifest.json'),'utf8'));
 const pin=manifest.core??manifest;
 if(!/^[A-Za-z0-9._-]+\.tgz$/.test(pin.file??''))throw Error('Candidate vendor archive name invalid');
 const hash=createHash('sha256').update(readFileSync(join(config.serviceRoot,'vendor',pin.file))).digest('hex');
 if(service.version!==supported.service||core.version!==supported.core||pin.sha256!==supported.coreArtifactSha256||hash!==supported.coreArtifactSha256)throw Error('Candidate Service/Core archive identity mismatch');
 return config;
}
export async function startCandidate(){
 validateCandidateConfig(process.env.FLOWDOCMAKE_CONFIG,dirname(dirname(fileURLToPath(import.meta.url))));
 await import('./server-runtime.mjs');
}
