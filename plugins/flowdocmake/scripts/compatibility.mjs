export const supported={service:'0.4.0',core:'0.4.0',coreArtifactSha256:'9acd7cc36f698b45c3a3a753e38fa9dd3e1f5b1510ad3ac433138d0b66fad0ca'};
export function assess({contract,runtime,pdf,expectedPort='3018'}) {
 if(!contract||JSON.stringify(contract.nodeModelVersions)!=='[18]'||contract.draftDefinitionVersion!==1||contract.publicationEnabled!==false||JSON.stringify(contract.schemaVersions)!=='[1,2]'||contract.fonts?.selection!=='exact-release-weight-style'||contract.fonts.syntheticFaces!==false||contract.fonts.automaticFallback!==false||contract.fonts.adminSeparate!==true)return {ready:false,code:'INCOMPATIBLE_CONTRACT'};
 if(!runtime||Object.entries(supported).some(([k,v])=>runtime[k]!==v)||!/^\d+$/.test(expectedPort)||Number(expectedPort)<1||Number(expectedPort)>65535||runtime.port!==expectedPort)return {ready:false,code:'RUNTIME_VERSION_UNKNOWN_OR_INCOMPATIBLE'};
 if(!pdf)return {ready:false,code:'PDF_READER_MISSING'};
 return {ready:true,code:'READY'};
}
