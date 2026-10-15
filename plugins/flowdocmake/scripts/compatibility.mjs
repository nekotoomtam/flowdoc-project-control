export function assess({contract,runtime,pdf}) {
 if(!contract || JSON.stringify(contract.nodeModelVersions)!=='[18]' || contract.draftDefinitionVersion!==1 || contract.publicationEnabled!==false) return {ready:false,code:'INCOMPATIBLE_CONTRACT'};
 if(!runtime || runtime.service!=='0.3.0' || runtime.core!=='0.3.0' || runtime.port!=='3018') return {ready:false,code:'RUNTIME_VERSION_UNKNOWN_OR_INCOMPATIBLE'};
 if(!pdf) return {ready:false,code:'PDF_READER_MISSING'};
 return {ready:true,code:'READY'};
}
