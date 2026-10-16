export const supported={service:'0.4.1',core:'0.4.1',coreArtifactSha256:'2504be5859057d64c5adae3778d190df7f8ffc71a456fcada2fd48ff4d7575bc'};
export function assess({contract,runtime,pdf,expectedPort='3018'}) {
 if(!contract||JSON.stringify(contract.nodeModelVersions)!=='[18]'||contract.draftDefinitionVersion!==1||contract.publicationEnabled!==false||JSON.stringify(contract.schemaVersions)!=='[1,2]'||contract.fonts?.selection!=='exact-release-weight-style'||contract.fonts.syntheticFaces!==false||contract.fonts.automaticFallback!==false||contract.fonts.adminSeparate!==true||contract.fonts.heightAdjustment?.methodId!=='thai-bo-baseline-top-v1'||contract.fonts.heightAdjustment.optIn!==true||contract.fonts.heightAdjustment.proposalTtlSeconds!==900||contract.fonts.heightAdjustment.precisionDecimals!==6||contract.fonts.heightAdjustment.layoutCheck!=='not_checked')return {ready:false,code:'INCOMPATIBLE_CONTRACT'};
 if(!runtime||Object.entries(supported).some(([k,v])=>runtime[k]!==v)||!/^\d+$/.test(expectedPort)||Number(expectedPort)<1||Number(expectedPort)>65535||runtime.port!==expectedPort)return {ready:false,code:'RUNTIME_VERSION_UNKNOWN_OR_INCOMPATIBLE'};
 if(!pdf)return {ready:false,code:'PDF_READER_MISSING'};
 return {ready:true,code:'READY'};
}
