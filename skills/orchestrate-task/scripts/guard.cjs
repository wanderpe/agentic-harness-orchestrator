#!/usr/bin/env node
'use strict';
// Read-only gate validator. Records remain assertions, not trusted attestations.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
function inside(root,relative){
 if(typeof relative!=='string'||!relative||path.isAbsolute(relative)||relative.includes('\\')||relative.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Unsafe relative path');
 const base=fs.realpathSync(root),resolved=path.resolve(base,relative);
 if(!resolved.startsWith(base+path.sep))throw Error('Path outside root');
 let cursor=base;for(const part of relative.split('/')){cursor=path.join(cursor,part);if(fs.lstatSync(cursor).isSymbolicLink())throw Error('Symlink path refused');}
 if(!fs.statSync(resolved).isFile())throw Error('Expected regular file');return resolved;
}
function fingerprint(root,scope){
 if(!Array.isArray(scope)||!scope.length||new Set(scope).size!==scope.length)throw Error('Unique nonempty scope required');
 return digest(JSON.stringify([...scope].sort().map(p=>{try{return[p,digest(fs.readFileSync(inside(root,p)))];}catch(e){
 // Missing/deleted paths fail closed; see runtime limits for deletion workflows.
 throw Error(`${p}: ${e.message}`);
 }})));
}
function inspect(root,state,gate){
 const errors=[],fail=m=>errors.push(m),word=v=>typeof v==='string'&&v.trim().length>0;
 const hash=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
 if(!['review','qa','release'].includes(gate))return{ok:false,errors:['Unknown gate']};
 if(!state||typeof state!=='object'||Array.isArray(state))return{ok:false,errors:['Checkpoint object required']};
 if(state.schemaVersion!=='2.0')fail('Unsupported checkpoint schema');
 if(!word(state.taskId))fail('Task identity missing');
 if(!['feature','hotfix','frontend','review'].includes(state.route))fail('Unknown route');
 if(!['low','standard','high'].includes(state.risk))fail('Unknown risk');
 if(!['implementation','review','release'].includes(state.completionScope))fail('Unknown completion scope');
 if(state.route==='review'&&gate!=='review')fail('Read-only review cannot advance to QA or release');
 if(gate==='release'&&state.completionScope!=='release')fail('Release is outside completion scope');
 let current;try{current=fingerprint(root,state.scope);}catch(e){fail(e.message);}
 if(!hash(state.contentIdentity)||current!==state.contentIdentity)fail('Source identity missing or stale');
 const version=state.artifactContractVersion||'1.0.0';
 if(!['1.0.0','2.0.0'].includes(version))fail('Unsupported artifact contract version');
 const contractFile=version==='1.0.0'?'artifact-contracts.legacy.json':'artifact-contracts.json';
 const contracts=JSON.parse(fs.readFileSync(path.join(__dirname,'../references',contractFile),'utf8')).artifacts;
 const artifacts=Array.isArray(state.artifacts)?state.artifacts:[];
 const required=state.route==='review'?[]:state.route==='hotfix'?['hotfix_context','hotfix_plan']:['task_context','implementation_plan'];
 if(state.risk==='high'&&state.route!=='review')required.push('architecture');
 if(gate==='qa'||gate==='release')required.push('code_review');
 if(gate==='release')required.push('qa');
 const requiredArtifacts=[];
 for(const type of required){
 const records=artifacts.filter(a=>a&&a.type===type),spec=contracts[type];
 if(records.length!==1){fail(`Exactly one artifact required: ${type}`);continue;}
 const a=records[0];requiredArtifacts.push(a);
 try{
 const file=inside(root,a.path),bytes=fs.readFileSync(file),text=bytes.toString('utf8');
 if(path.basename(file)!==spec.filename)fail(`Wrong artifact filename: ${type}`);
 if(!hash(a.sha256)||digest(bytes)!==a.sha256)fail(`Artifact hash mismatch: ${type}`);
 if(a.contentIdentity!==current)fail(`Stale artifact: ${type}`);
 for(const heading of spec.requiredHeadings){
 const sections=text.split(/^## +/m).slice(1).map(s=>{const n=s.indexOf('\n');return[n<0?s.trim():s.slice(0,n).trim(),n<0?'':s.slice(n+1).split(/^#{1,6} +/m)[0].trim()];});
 if(!sections.some(([h,b])=>h===heading&&b))fail(`Missing/nonempty heading required: ${type}/${heading}`);
 }
 if(spec.status){const statuses=text.split(/\r?\n/).filter(l=>l.startsWith(spec.status.field+':'));
 if(statuses.length!==1||statuses[0].trim()!==spec.status.field+': PASS')fail(`Artifact verdict is not PASS: ${type}`);}
 }catch(e){fail(`Artifact ${type}: ${e.message}`);}
 }
 const receipts=Array.isArray(state.handoffs)?state.handoffs:[];
 for(const a of requiredArtifacts){
 if(!receipts.some(h=>h&&h.to===gate&&h.artifactPath===a.path&&h.artifactSha256===a.sha256&&h.contentIdentity===current&&word(h.from)&&word(h.producer)&&word(h.receiver)&&word(h.acknowledgement)&&validTime(h.producedAt)&&validTime(h.acknowledgedAt)&&Date.parse(h.acknowledgedAt)>=Date.parse(h.producedAt)))fail(`Missing/stale receiving acknowledgement: ${a.type}`);
 }
 const checks=Array.isArray(state.checks)?state.checks:[];
 if(gate==='qa'||gate==='release'){
 for(const name of ['review',...(gate==='release'?['qa']:[])]){
 const c=checks.filter(c=>c&&c.name===name);
 if(c.length!==1||c[0].outcome!=='PASS'||c[0].contentIdentity!==current||!word(c[0].evidence)||!word(c[0].actor)||!validTime(c[0].observedAt))fail(`Missing/current PASS required: ${name}`);
 }
 }
 const criteria=state.acceptanceCriteria;
 if(!Array.isArray(criteria)||!criteria.length||criteria.some(c=>!word(c)))fail('Acceptance criteria missing');
 if(gate==='release'){
 if(!Array.isArray(state.requiredChecks)||!state.requiredChecks.length||state.requiredChecks.some(c=>!word(c))||new Set(state.requiredChecks).size!==state.requiredChecks.length)fail('Required checks must be explicit and unique');
 else for(const name of state.requiredChecks){const c=checks.filter(c=>c&&c.name===name);if(c.length!==1||c[0].outcome!=='PASS'||c[0].contentIdentity!==current||!word(c[0].evidence)||!word(c[0].actor)||!validTime(c[0].observedAt))fail(`Required check incomplete: ${name}`);}
 if(!Array.isArray(state.acceptanceResults)||!Array.isArray(criteria)||criteria.some(c=>{const matches=state.acceptanceResults.filter(r=>r&&r.criterion===c);return matches.length!==1||matches[0].outcome!=='PASS'||matches[0].contentIdentity!==current||!word(matches[0].evidence);}))fail('Acceptance criteria not fully verified');
 const a=state.approval,t=state.release;
 if(!t||!['commit','push','deploy','publish'].includes(t.operation)||!word(t.target))fail('Concrete release operation and target required');
 if(!a||!Array.isArray(a.scope)||!Array.isArray(state.scope)||a.contentIdentity!==current||!word(a.userStatement)||!word(a.provenance)||!validTime(a.observedAt)||!t||a.operation!==t.operation||a.target!==t.target||JSON.stringify([...a.scope].sort())!==JSON.stringify([...state.scope].sort()))fail('Missing/stale release authorization');
 }
 return{ok:errors.length===0,gate,contentIdentity:current||null,errors};
}
function validTime(t){return typeof t==='string'&&Number.isFinite(Date.parse(t));}
module.exports={fingerprint,inspect,digest,inside};
if(require.main===module){try{
 const [action,root,stateFile,gate]=process.argv.slice(2);
 if(!['fingerprint','check'].includes(action)||!root||!stateFile||(action==='check'&&!gate))throw Error('Usage: node guard.cjs fingerprint|check <workspace> <checkpoint.json> [review|qa|release]');
 const state=JSON.parse(fs.readFileSync(stateFile,'utf8'));
 const result=action==='fingerprint'?{contentIdentity:fingerprint(root,state.scope)}:inspect(root,state,gate);
 console.log(JSON.stringify(result,null,2));if(result.ok===false)process.exitCode=1;
 }catch(e){console.error(JSON.stringify({ok:false,errors:[e.message]}));process.exitCode=1;}}

