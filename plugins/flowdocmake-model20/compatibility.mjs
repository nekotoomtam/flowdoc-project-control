import {supported,candidate} from './compatibility-profile.mjs';
import {corePackageFilesSha256} from './core-package-identity.mjs';
export {supported};
export const runtimeProbeScript="const fs=require('fs'),m=require('./vendor/manifest.json');if(!/^[a-zA-Z0-9_.-]+[.]tgz$/.test(m.file))throw Error('artifact');const actual=require('crypto').createHash('sha256').update(fs.readFileSync('./vendor/'+m.file)).digest('hex');if(actual!==m.sha256)throw Error('artifact');const tree=("+corePackageFilesSha256.toString()+")('./node_modules/@flowdoc/core');console.log(JSON.stringify({service:require('./package.json').version,core:require('./node_modules/@flowdoc/core/package.json').version,coreArtifactSha256:actual,corePackageFilesSha256:tree}))";
export function usesGroupLabels(definition){const formats=definition?.areaFormats;const owners=[...(formats&&typeof formats==='object'&&!Array.isArray(formats)?Object.values(formats):[]),...(Array.isArray(definition?.sections)?definition.sections.filter(s=>s?.source?.kind==='authored').map(s=>s.source):[])];return owners.some(owner=>Array.isArray(owner?.rowGroups)&&owner.rowGroups.some(g=>g&&Object.hasOwn(g,'groupLabel')));}
export function checkGroupLabelCapability(definition,contract){
 if(!usesGroupLabels(definition))return {ok:true};
 const c=contract?.groupLabelSpans;
 if(c?.version!==1||definition.nodeModelVersion!==20||JSON.stringify(c.nodeModelVersions)!=='[20]'||![1,2].includes(definition.schemaVersion)||!c.schemaVersions?.includes(definition.schemaVersion)||c.continuationSuffix!==' (ต่อ)'||c.fixed!=='formatSizing-v2'||c.diagnosticsVersion!==1||contract?.formatSizing?.version!==2)return {ok:false,code:'GROUP_LABEL_SPANS_UNSUPPORTED',issues:[{code:'GROUP_LABEL_SPANS_UNSUPPORTED',path:'groupLabel',message:'This candidate requires the model20 groupLabelSpans v1 contract; preserve the definition.'}],warnings:[]};
 return {ok:true};
}
export function assess({contract:c,runtime,pdf,expectedPort='3018'}){
 const s=c?.sectionDefinitions,f=c?.fonts,h=f?.heightAdjustment,z=c?.formatSizing;
 if(!c||JSON.stringify(c.nodeModelVersions)!=='[20]'||Object.hasOwn(c,'sectionInstances')||s?.model!==20||s.input!=='array-by-section-key'||s.instanceKey!=='required-unique-per-request'||s.assembly!=='request'||s.reuseDefinitions!==true||s.authoring!=='whole-definition'||s.createSection!==false||s.importSections!==false||s.cloneTemplate!==false||c.draftDefinitionVersion!==1||c.publicationEnabled!==false||JSON.stringify(c.schemaVersions)!=='[1,2]'||f?.selection!=='exact-release-weight-style'||f.syntheticFaces!==false||f.automaticFallback!==false||f.adminSeparate!==true||h?.methodId!=='thai-bo-baseline-top-v1'||h.optIn!==true||h.proposalTtlSeconds!==900||h.precisionDecimals!==6||h.layoutCheck!=='not_checked'||z?.version!==2||JSON.stringify(z.nodeModelVersions)!=='[20]'||JSON.stringify(z.fontSchemaVersions)!=='[1,2]'||JSON.stringify(z.modes)!=='["auto","fixed"]'||JSON.stringify(z.fixedContexts)!=='["section-flow-root"]'||z.diagnosticsVersion!==1)return {ready:false,code:'INCOMPATIBLE_CONTRACT'};
 if(!runtime||Object.entries(supported).some(([k,v])=>runtime[k]!==v)||runtime.corePackageFilesSha256!==candidate.corePackageFilesSha256||!/^\d+$/.test(expectedPort)||Number(expectedPort)<1||Number(expectedPort)>65535||runtime.port!==expectedPort)return {ready:false,code:'RUNTIME_VERSION_UNKNOWN_OR_INCOMPATIBLE'};
 if(!pdf)return {ready:false,code:'PDF_READER_MISSING'};
 return {ready:true,code:'READY'};
}
