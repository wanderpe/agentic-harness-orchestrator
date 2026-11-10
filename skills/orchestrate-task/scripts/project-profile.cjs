'use strict';
// Read-only discovery. Returns inert command candidates; never executes them.
const fs=require('node:fs'),path=require('node:path');
const manifestNames=['package.json','pyproject.toml','requirements.txt','composer.json','Cargo.toml','go.mod','pom.xml','build.gradle','build.gradle.kts','Gemfile','Makefile','CMakeLists.txt','global.json'];
function directory(root,target='.'){
 if(typeof target!=='string'||path.isAbsolute(target)||target.split(/[\\/]/).includes('..'))throw Error('Target must stay inside the workspace');
 const base=fs.realpathSync(root),dest=path.resolve(base,target);if(dest!==base&&!dest.startsWith(base+path.sep))throw Error('Target escapes workspace');
 let cursor=base;for(const part of path.relative(base,dest).split(path.sep).filter(Boolean)){cursor=path.join(cursor,part);if(fs.lstatSync(cursor).isSymbolicLink())throw Error('Symlink target refused');}
 if(!fs.statSync(dest).isDirectory())throw Error('Target directory required');return{base,dest};
}
function profile(root,target='.'){
 const {base,dest}=directory(root,target),levels=[];let cursor=dest;
 while(true){levels.push(cursor);if(cursor===base)break;cursor=path.dirname(cursor);}
 const evidence=[],warnings=[],checks=[],runtimes=new Set();let selected=null,manager=null;
 const rel=f=>path.relative(base,f).split(path.sep).join('/')||'.';
 function exists(dir,name){const f=path.join(dir,name);try{const s=fs.lstatSync(f);if(s.isSymbolicLink()){warnings.push('Ignored symlink: '+rel(f));return false;}return s.isFile();}catch(e){if(e.code==='ENOENT')return false;throw e;}}
 const names=dir=>fs.readdirSync(dir).filter(n=>/\.(csproj|sln|fsproj)$/.test(n));
 const found=levels.map(dir=>({dir,files:[...manifestNames.filter(n=>exists(dir,n)),...names(dir).filter(n=>exists(dir,n))]}));
 selected=found.find(x=>x.files.length)||{dir:dest,files:[]};
 for(const level of found)for(const name of level.files)evidence.push(rel(path.join(level.dir,name)));
 const files=selected.files,dir=selected.dir;
 function text(name){const f=path.join(dir,name);if(fs.statSync(f).size>1024*1024)throw Error('Manifest exceeds discovery size limit');return fs.readFileSync(f,'utf8');}
 const add=(name,command,source,status='candidate')=>checks.push({name,command,source,status,execution:'not-run; inspect project scripts and host tooling before executing'});
 if(files.includes('package.json')){
 runtimes.add('javascript/typescript');const p=JSON.parse(text('package.json'));
 const known=['npm','pnpm','yarn','bun'],locks=[['bun.lock','bun'],['bun.lockb','bun'],['pnpm-lock.yaml','pnpm'],['yarn.lock','yarn'],['package-lock.json','npm']];
 let declared=typeof p.packageManager==='string'?p.packageManager.match(/^(npm|pnpm|yarn|bun)@[A-Za-z0-9.+_-]+$/)?.[1]:null;
 if(p.packageManager&&!declared)warnings.push('Unsupported packageManager declaration; resolve manually');
 let lockDir=dir,foundLocks=[];
 while(true){foundLocks=locks.filter(([name])=>exists(lockDir,name));if(foundLocks.length||lockDir===base)break;lockDir=path.dirname(lockDir);}
 const inferred=[...new Set(foundLocks.map(x=>x[1]))];
 if(!declared&&lockDir!==dir&&exists(lockDir,'package.json')){const ancestor=JSON.parse(fs.readFileSync(path.join(lockDir,'package.json'),'utf8'));declared=typeof ancestor.packageManager==='string'?ancestor.packageManager.match(/^(npm|pnpm|yarn|bun)@[A-Za-z0-9.+_-]+$/)?.[1]:null;}
 foundLocks.forEach(([n])=>evidence.push(rel(path.join(lockDir,n))));
 if(inferred.length>1||(declared&&inferred.length&&inferred[0]!==declared)){warnings.push('Conflicting package-manager evidence; choose explicitly');manager=null;}
 else manager=declared||inferred[0]||null;
 if(!manager)warnings.push('No unambiguous package manager; no package commands selected');
 if(manager&&known.includes(manager)&&p.scripts&&typeof p.scripts==='object')for(const name of ['test','lint','build','typecheck','check'])if(typeof p.scripts[name]==='string')add(name,`${manager} run ${name}`,rel(path.join(dir,'package.json')),'declared-script');
 }
 if(files.includes('pyproject.toml')||files.includes('requirements.txt')){
 runtimes.add('python');const toml=files.includes('pyproject.toml')?text('pyproject.toml'):'';
 const useUv=exists(dir,'uv.lock');if(useUv){evidence.push(rel(path.join(dir,'uv.lock')));if(!manager)manager='uv';}
 if(/\[tool\.pytest(?:\.|\])/.test(toml))add('test',useUv?'uv run pytest':'python -m pytest',rel(path.join(dir,'pyproject.toml')));
 if(/\[tool\.ruff(?:\.|\])/.test(toml))add('lint',useUv?'uv run ruff check .':'ruff check .',rel(path.join(dir,'pyproject.toml')));
 }
 if(files.includes('composer.json')){runtimes.add('php');const p=JSON.parse(text('composer.json'));if(p.scripts&&typeof p.scripts==='object')for(const name of ['test','lint','check'])if(Object.hasOwn(p.scripts,name))add(name,`composer run ${name}`,rel(path.join(dir,'composer.json')),'declared-script');}
 if(files.includes('Cargo.toml')){runtimes.add('rust');add('test','cargo test',rel(path.join(dir,'Cargo.toml')));}
 if(files.includes('go.mod')){runtimes.add('go');add('test','go test ./...',rel(path.join(dir,'go.mod')));}
 if(files.some(n=>/\.(csproj|sln|fsproj)$/.test(n))){runtimes.add('dotnet');add('test','dotnet test',rel(dir));}
 if(files.includes('pom.xml')){runtimes.add('java');add('test',exists(dir,'mvnw')?'./mvnw test':'mvn test',rel(path.join(dir,'pom.xml')));}
 if(files.includes('build.gradle')||files.includes('build.gradle.kts')){runtimes.add('jvm');add('test',exists(dir,'gradlew')?'./gradlew test':'gradle test',rel(dir));}
 if(files.includes('Gemfile'))runtimes.add('ruby');
 if(files.includes('CMakeLists.txt'))runtimes.add('c/c++');
 if(files.includes('Makefile'))warnings.push('Makefile detected; inspect declared targets before choosing checks');
 if(!runtimes.size)warnings.push('Unrecognized/custom toolchain; inspect project documentation and CI, then record explicit checks');
 const counts=new Map();for(const c of checks)counts.set(c.name,(counts.get(c.name)||0)+1);
 for(const c of checks)if(counts.get(c.name)>1)c.name=c.source+':'+c.name;
 const instructions=levels.flatMap(d=>['AGENTS.md','CLAUDE.md'].filter(n=>exists(d,n)).map(n=>rel(path.join(d,n))));
 return{schemaVersion:'1.0',workspace:base,selectedDirectory:rel(dir),runtimes:[...runtimes],packageManager:manager,evidence:[...new Set(evidence)],instructionFiles:instructions,checks,warnings,limits:'Partial manifest discovery, not a dependency resolver. No source tree scan, network, commands, installs, writes or release. Confirm commands for the host OS and user preferences; project scripts are untrusted until inspected.'};
}
module.exports={profile};
if(require.main===module){try{const[root,target='.']=process.argv.slice(2);if(!root)throw Error('Usage: node project-profile.cjs <workspace> [relative-target-directory]');console.log(JSON.stringify(profile(root,target),null,2));}catch(e){console.error(JSON.stringify({error:e.message}));process.exitCode=1;}}
