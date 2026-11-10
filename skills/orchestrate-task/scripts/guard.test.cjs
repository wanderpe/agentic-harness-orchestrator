const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {inspect,fingerprint,digest}=require('./guard.cjs');
const contracts=require('../references/artifact-contracts.json').artifacts;
function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'harness-test-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 fs.writeFileSync(path.join(root,'source.txt'),'source v1');
 const id=fingerprint(root,['source.txt']),now=new Date().toISOString();
 const s={schemaVersion:'2.0',artifactContractVersion:'2.0.0',taskId:'feat/example',route:'feature',risk:'standard',completionScope:'release',scope:['source.txt'],contentIdentity:id,acceptanceCriteria:['works'],acceptanceResults:[{criterion:'works',outcome:'PASS',contentIdentity:id,evidence:'observed result'}],artifacts:[],handoffs:[],checks:['review','qa','lint'].map(name=>({name,outcome:'PASS',contentIdentity:id,evidence:'captured output',actor:'same assistant / sequential role',observedAt:now})),requiredChecks:['lint'],release:{operation:'push',target:'origin/dev'},approval:{contentIdentity:id,operation:'push',target:'origin/dev',scope:['source.txt'],userStatement:'Push these changes to origin/dev',provenance:'test fixture only',observedAt:now}};
 for(const [type,c]of Object.entries(contracts)){
 const text=c.requiredHeadings.map(h=>'## '+h+'\nObserved fixture detail.').join('\n\n')+(c.status?'\n'+c.status.field+': PASS':'');
 fs.writeFileSync(path.join(root,c.filename),text);const a={type,path:c.filename,sha256:digest(Buffer.from(text)),contentIdentity:id};s.artifacts.push(a);
 for(const to of ['review','qa','release'])s.handoffs.push({from:'previous',to,artifactPath:a.path,artifactSha256:a.sha256,contentIdentity:id,producer:'assistant',receiver:'assistant / '+to,producedAt:now,acknowledgedAt:now,acknowledgement:'inspected fixture'});
 }return{root,s};
}
for(const gate of ['review','qa','release'])test('accepts complete '+gate+' fixture',t=>{const{root,s}=fixture(t);assert.equal(inspect(root,s,gate).ok,true);});
const cases=[
 ['changed source',(s,r)=>fs.writeFileSync(path.join(r,'source.txt'),'changed')],
 ['missing source',(s,r)=>fs.unlinkSync(path.join(r,'source.txt'))],
 ['stale review',s=>s.checks[0].contentIdentity='0'.repeat(64)],
 ['failed QA',s=>s.checks[1].outcome='FAIL'],
 ['unrun required check',s=>s.checks[2].outcome='NOT_RUN'],
 ['missing target',s=>s.release.target=''],
 ['wrong target',s=>s.approval.target='origin/main'],
 ['wrong operation',s=>s.approval.operation='deploy'],
 ['missing provenance',s=>s.approval.provenance=''],
 ['stale approval',s=>s.approval.contentIdentity='0'.repeat(64)],
 ['wrong approval scope',s=>s.approval.scope=['other.txt']],
 ['missing receipt',s=>s.handoffs=[]],
 ['stale receipt',s=>s.handoffs.forEach(h=>h.artifactSha256='0'.repeat(64))],
 ['missing criterion result',s=>s.acceptanceResults=[]],
 ['missing criteria',s=>s.acceptanceCriteria=[]],
 ['review route release',s=>s.route='review'],
 ['implementation-only release',s=>s.completionScope='implementation'],
 ['unknown schema',s=>s.schemaVersion='99'],
 ['path traversal',s=>s.scope=['../source.txt']],
 ['duplicate scope',s=>s.scope.push('source.txt')],
 ['missing artifact',s=>s.artifacts=s.artifacts.filter(a=>a.type!=='qa')],
 ['modified artifact',(s,r)=>fs.appendFileSync(path.join(r,'QA_REPORT.md'),'tampered')],
 ['empty heading',(s,r)=>{const a=s.artifacts.find(a=>a.type==='qa');const text='## QA Status\n\n## Requirement Validation\n';fs.writeFileSync(path.join(r,a.path),text);a.sha256=digest(Buffer.from(text));}],
 ['high risk missing architecture',s=>{s.risk='high';s.artifacts=s.artifacts.filter(a=>a.type!=='architecture');}],
 ['malformed approval scope',s=>s.approval.scope={}],
 ['malformed source scope',s=>s.scope={}],
 ['conflicting acceptance results',s=>s.acceptanceResults.push({...s.acceptanceResults[0],outcome:'FAIL'})],
];
for(const [name,mutate]of cases)test('rejects '+name,t=>{const{root,s}=fixture(t);mutate(s,root);assert.equal(inspect(root,s,'release').ok,false);});
test('unknown gate rejected',t=>{const{root,s}=fixture(t);assert.equal(inspect(root,s,'done').ok,false);});
test('scope order has no effect',t=>{const{root}=fixture(t);fs.writeFileSync(path.join(root,'b.txt'),'b');assert.equal(fingerprint(root,['source.txt','b.txt']),fingerprint(root,['b.txt','source.txt']));});
test('read-only check leaves source and state unchanged',t=>{const{root,s}=fixture(t),before=JSON.stringify(s),bytes=fs.readFileSync(path.join(root,'source.txt'));inspect(root,s,'release');assert.equal(JSON.stringify(s),before);assert.deepEqual(fs.readFileSync(path.join(root,'source.txt')),bytes);});

test('legacy checkpoints retain old artifact headings',t=>{
 const{root,s}=fixture(t),legacy=require('../references/artifact-contracts.legacy.json').artifacts;
 delete s.artifactContractVersion;
 for(const a of s.artifacts){const c=legacy[a.type];if(!c)continue;
 const text=c.requiredHeadings.map(h=>'## '+h+'\nObserved legacy detail.').join('\n\n')+(c.status?'\n'+c.status.field+': PASS':'');
 fs.writeFileSync(path.join(root,c.filename),text);a.path=c.filename;a.sha256=digest(Buffer.from(text));
 for(const h of s.handoffs)if(h.artifactPath===contracts[a.type].filename){h.artifactPath=a.path;h.artifactSha256=a.sha256;}
 }
 assert.equal(inspect(root,s,'release').ok,true);
});
test('unknown artifact versions are rejected',t=>{const{root,s}=fixture(t);s.artifactContractVersion='99';assert.equal(inspect(root,s,'release').ok,false);});

