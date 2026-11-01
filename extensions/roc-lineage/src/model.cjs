'use strict';
const KINDS=new Set(['session','task','context','skill','tool','artifact','check','message']);
const EVIDENCE=new Set(['recorded','reported','inferred']);
const STATUS=new Set(['started','completed','failed','info']);
const string=(x,max=500)=>typeof x==='string'&&x.length>0&&x.length<=max;

function parseTrace(text) {
  if(Buffer.byteLength(text,'utf8')>10*1024*1024) throw new Error('Trace exceeds 10 MiB; rotate the log.');
  const events=[],warnings=[];
  const lines=text.split('\n');
  for(let i=0;i<lines.length;i++) {
    if(!lines[i].trim()) continue;
    try {
      const e=JSON.parse(lines[i]);
      if(e.version!==1||!string(e.id,200)||!string(e.sessionId,200)||!string(e.source,100)||
         !string(e.label)||!KINDS.has(e.kind)||!EVIDENCE.has(e.evidence)||!STATUS.has(e.status)||
         !string(e.timestamp,80)||!Number.isFinite(Date.parse(e.timestamp))||
         (e.parentId!==undefined&&!string(e.parentId,200))||
         (e.path!==undefined&&!string(e.path,1000))) throw new Error('Invalid version 1 event');
      if(events.length>=10000) throw new Error('Event limit reached (10000)');
      // Keep only documented fields. Do not pass arbitrary imported properties into the webview.
      events.push(Object.fromEntries(['version','id','sessionId','source','timestamp','kind','label',
        'evidence','status','parentId','path'].filter(k=>e[k]!==undefined).map(k=>[k,e[k]])));
    } catch(err) { warnings.push(`Line ${i+1}: ${err.message}`); }
  }
  return {events,warnings};
}

function buildGraph(events) {
  const nodes=new Map(),roots=new Map();
  const key=e=>JSON.stringify([e.source,e.sessionId,e.id]);
  for(const e of events) {
    const session=JSON.stringify([e.source,e.sessionId]);
    if(!roots.has(session)) {
      const root={version:1,source:e.source,sessionId:e.sessionId,timestamp:e.timestamp,
        id:'@session',key:'session:'+session,label:`${e.source} · ${e.sessionId}`,
        kind:'session',evidence:'inferred',status:'info',synthetic:true};
      roots.set(session,root); nodes.set(root.key,root);
    }
    nodes.set(key(e),{...e,key:key(e),synthetic:false});
  }
  const edges=[];
  for(const n of nodes.values()) {
    if(n.synthetic) continue;
    const parent=n.parentId&&nodes.get(key({...n,id:n.parentId}));
    const root=roots.get(JSON.stringify([n.source,n.sessionId]));
    edges.push({from:parent&&parent.key!==n.key?parent.key:root.key,to:n.key,
      evidence:parent&&parent.key!==n.key?n.evidence:'inferred',
      relation:parent&&parent.key!==n.key?'event relationship':'session grouping'});
  }
  return {nodes:[...nodes.values()],edges};
}
module.exports={parseTrace,buildGraph};
