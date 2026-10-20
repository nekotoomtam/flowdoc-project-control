export const supported={service:'0.4.9',core:'0.4.7',coreArtifactSha256:'13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad'};
export function usesGroupLabels(definition){
 // Only declaration owners: never traverse schemas/defaults or sample business data.
 const formats=definition?.areaFormats;
 const owners=[...(formats&&typeof formats==='object'&&!Array.isArray(formats)?Object.values(formats):[]),
  ...(Array.isArray(definition?.sections)?definition.sections.filter(s=>s?.source?.kind==='authored').map(s=>s.source):[])];
 return owners.some(owner=>Array.isArray(owner?.rowGroups)&&owner.rowGroups.some(g=>g&&Object.hasOwn(g,'groupLabel')));
}
export function checkGroupLabelCapability(definition,contract){
 if(!usesGroupLabels(definition))return {ok:true};
 const c=contract?.groupLabelSpans;
 if(c?.version!==1||definition.nodeModelVersion!==19||(!Array.isArray(c.nodeModelVersions)||!c.nodeModelVersions.includes(19))||![1,2].includes(definition.schemaVersion)||(!Array.isArray(c.schemaVersions)||!c.schemaVersions.includes(definition.schemaVersion))||c.continuationSuffix!==' (ต่อ)'||c.fixed!=='formatSizing-v2'||c.diagnosticsVersion!==1||contract?.formatSizing?.version!==2)
  return {ok:false,code:'GROUP_LABEL_SPANS_UNSUPPORTED',issues:[{code:'GROUP_LABEL_SPANS_UNSUPPORTED',path:'groupLabel',message:'This Service does not advertise the required groupLabelSpans v1 contract; keep the definition intact and use a compatible candidate.'}],warnings:[]};
 return {ok:true};
}
export function assess({contract,runtime,pdf,expectedPort='3018'}) {
 if(!contract||JSON.stringify(contract.nodeModelVersions)!=='[18,19]'||contract.sectionInstances?.model!==19||contract.sectionInstances.input!=='array-by-id'||contract.sectionInstances.assembly!=='saved-definition'||contract.sectionInstances.stage!==3||contract.sectionInstances.coverArea!==true||contract.sectionInstances.scopedToc!==true||contract.draftDefinitionVersion!==1||contract.publicationEnabled!==false||JSON.stringify(contract.schemaVersions)!=='[1,2]'||contract.fonts?.selection!=='exact-release-weight-style'||contract.fonts.syntheticFaces!==false||contract.fonts.automaticFallback!==false||contract.fonts.adminSeparate!==true||contract.fonts.heightAdjustment?.methodId!=='thai-bo-baseline-top-v1'||contract.fonts.heightAdjustment.optIn!==true||contract.fonts.heightAdjustment.proposalTtlSeconds!==900||contract.fonts.heightAdjustment.precisionDecimals!==6||contract.fonts.heightAdjustment.layoutCheck!=='not_checked')return {ready:false,code:'INCOMPATIBLE_CONTRACT'};
 if(!contract.formatSizing||contract.formatSizing.version!==2||JSON.stringify(contract.formatSizing.nodeModelVersions)!=='[19]'||JSON.stringify(contract.formatSizing.fontSchemaVersions)!=='[1,2]'||JSON.stringify(contract.formatSizing.modes)!=='["auto","fixed"]'||JSON.stringify(contract.formatSizing.fixedContexts)!=='["section-flow-root"]'||contract.formatSizing.diagnosticsVersion!==1)return {ready:false,code:'INCOMPATIBLE_CONTRACT'};
 if(!runtime||Object.entries(supported).some(([k,v])=>runtime[k]!==v)||!/^\d+$/.test(expectedPort)||Number(expectedPort)<1||Number(expectedPort)>65535||runtime.port!==expectedPort)return {ready:false,code:'RUNTIME_VERSION_UNKNOWN_OR_INCOMPATIBLE'};
 if(!pdf)return {ready:false,code:'PDF_READER_MISSING'};
 return {ready:true,code:'READY'};
}
