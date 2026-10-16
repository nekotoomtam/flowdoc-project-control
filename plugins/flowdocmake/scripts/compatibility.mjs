export const supported={service:'0.4.0',core:'0.4.0',coreArtifactSha256:'6e8b71976de35456eed8cdb88a3c42305947e20e900944e3108cb0cc5c36d7e8'};
export function assess({contract,runtime,pdf,expectedPort='3018'}) {
 if(!contract||JSON.stringify(contract.nodeModelVersions)!=='[18]'||contract.draftDefinitionVersion!==1||contract.publicationEnabled!==false||JSON.stringify(contract.schemaVersions)!=='[1,2]'||contract.fonts?.selection!=='exact-release-weight-style'||contract.fonts.syntheticFaces!==false||contract.fonts.automaticFallback!==false||contract.fonts.adminSeparate!==true)return {ready:false,code:'INCOMPATIBLE_CONTRACT'};
 if(!runtime||Object.entries(supported).some(([k,v])=>runtime[k]!==v)||!/^\d+$/.test(expectedPort)||Number(expectedPort)<1||Number(expectedPort)>65535||runtime.port!==expectedPort)return {ready:false,code:'RUNTIME_VERSION_UNKNOWN_OR_INCOMPATIBLE'};
 if(!pdf)return {ready:false,code:'PDF_READER_MISSING'};
 return {ready:true,code:'READY'};
}
