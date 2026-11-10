'use strict';
// Build one bounded role packet. No worker launch, filesystem writes or authority grants.
const fs=require('node:fs'),path=require('node:path');
const catalog=require('../references/role-catalog.json');
const contracts=require('../references/artifact-contracts.json').artifacts;
const allowed=['interfaceDesign','multiStep','bug','tdd','independentRequired','independentAvailable'];
function packet(role,facts={}){
 if(!Object.hasOwn(catalog.roles,role))throw Error('Unknown delivery role');
 if(!facts||Array.isArray(facts)||typeof facts!=='object')throw Error('Facts must be an object');
 for(const [key,value]of Object.entries(facts))if(!allowed.includes(key)||typeof value!=='boolean')throw Error('Unsupported/nonboolean fact: '+key);
 const r=catalog.roles[role],names=[...r.skills];
 for(const [fact,skills]of Object.entries(r.conditionalSkills))if(facts[fact]===true)names.push(...skills);
 const blockers=[];
 if(role==='reviewer'&&facts.independentRequired===true&&facts.independentAvailable!==true)blockers.push('Required independent reviewer is unavailable; sequential self-review cannot satisfy this requirement.');
 const selectedSkills=[...new Set(names)].map(name=>{
 const skillPath=path.resolve(__dirname,'../..',name,'SKILL.md');if(!fs.existsSync(skillPath))throw Error('Bundled skill missing: '+name);
 return{name,path:skillPath};
 });
 const outputs=r.outputArtifacts.map(type=>{if(!contracts[type])throw Error('Unknown artifact type: '+type);return{type,...contracts[type]};});
 const {skills,conditionalSkills,outputArtifacts,...contract}=r;
 return structuredClone({role,...contract,selectedSkills,artifactContractVersion:require('../references/artifact-contracts.json').schemaVersion,outputs,ready:blockers.length===0,blockers,capabilities:'Advisory; actual host permissions and conversation authorization still apply.'});
}
module.exports={packet};
if(require.main===module){try{
 const [role,factsFile]=process.argv.slice(2);if(!role)throw Error('Usage: node role-packet.cjs <architect|implementer|reviewer|qa|release> [facts.json]');
 const result=packet(role,factsFile?JSON.parse(fs.readFileSync(factsFile,'utf8')):{});
 console.log(JSON.stringify(result,null,2));if(!result.ready)process.exitCode=1;
}catch(e){console.error(JSON.stringify({ready:false,error:e.message}));process.exitCode=1;}}
