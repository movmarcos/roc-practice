'use strict';
const api=acquireVsCodeApi();
const $=id=>document.getElementById(id);
const ns='http://www.w3.org/2000/svg';
let data={nodes:[],edges:[]},selected;
function svgElement(name,attrs={}){const e=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e;}
function choose(node){selected=node;$('details').textContent=JSON.stringify(node,null,2);$('open').hidden=!node.path||data.demo;}
function draw(){
  const filter=$('session').value;
  const nodes=data.nodes.filter(n=>!filter||JSON.stringify([n.source,n.sessionId])===filter);
  const keys=new Set(nodes.map(n=>n.key)),edges=data.edges.filter(e=>keys.has(e.from)&&keys.has(e.to));
  $('count').textContent=`${nodes.filter(n=>!n.synthetic).length} events`;
  $('graph').hidden=$('view').value!=='Graph';$('timeline').hidden=$('view').value!=='Timeline';
  $('timeline').replaceChildren();
  for(const n of nodes.filter(n=>!n.synthetic).sort((a,b)=>Date.parse(a.timestamp)-Date.parse(b.timestamp))){
    const button=document.createElement('button');button.className='event';
    button.textContent=n.label;const small=document.createElement('small');
    small.textContent=`${n.timestamp} · ${n.kind} · ${n.status} · ${n.evidence}`;
    button.append(small);button.onclick=()=>choose(n);$('timeline').append(button);
  }
  // Render bounded batches; the timeline remains available for the full trace.
  const visible=nodes.slice(0,250),visibleKeys=new Set(visible.map(n=>n.key));
  const positions=new Map(),depths=new Map();
  function depth(key,seen=new Set()){
    if(depths.has(key))return depths.get(key);
    if(seen.has(key)||seen.size>12)return 0;
    seen.add(key);const edge=edges.find(e=>e.to===key&&visibleKeys.has(e.from));
    const d=edge?Math.min(8,depth(edge.from,seen)+1):0;depths.set(key,d);return d;
  }
  const rows=new Map();for(const n of visible){const d=depth(n.key),r=rows.get(d)||0;rows.set(d,r+1);positions.set(n.key,{x:d*250+10,y:r*90+10});}
  const width=Math.max(700,...[...positions.values()].map(p=>p.x+240));
  const height=Math.max(400,...[...positions.values()].map(p=>p.y+85));
  const svg=svgElement('svg',{width,height,role:'img','aria-label':'Activity lineage; use timeline for full text access'});
  for(const edge of edges){const a=positions.get(edge.from),b=positions.get(edge.to);if(!a||!b)continue;
    const line=svgElement('path',{d:`M ${a.x+220} ${a.y+30} C ${a.x+240} ${a.y+30}, ${b.x-20} ${b.y+30}, ${b.x} ${b.y+30}`,class:'edge '+edge.evidence});
    const title=svgElement('title');title.textContent=edge.relation+' · '+edge.evidence;line.append(title);svg.append(line);}
  for(const n of visible){const p=positions.get(n.key),g=svgElement('g',{class:'node '+n.status,tabindex:0,role:'button','aria-label':n.label});
    g.append(svgElement('rect',{x:p.x,y:p.y,width:220,height:65,rx:5}));
    const label=svgElement('text',{x:p.x+10,y:p.y+24});label.textContent=n.label.length>28?n.label.slice(0,27)+'…':n.label;
    const meta=svgElement('text',{x:p.x+10,y:p.y+46,class:'meta'});meta.textContent=`${n.kind} · ${n.evidence} · ${n.status}`;
    g.append(label,meta);g.onclick=()=>choose(n);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(n);}};svg.append(g);}
  $('graph').replaceChildren(svg);
  if(nodes.length>250){const p=document.createElement('p');p.textContent='Graph shows the first 250 nodes. Select a session or use Timeline for all events.';$('graph').prepend(p);}
}
window.addEventListener('message',event=>{
  const message=event.data;if(message.type==='error'){$('notice').textContent=message.message;return;}
  if(message.type!=='trace')return;data=message;
  const old=$('session').value;$('session').replaceChildren(new Option('All sessions',''));
  for(const n of data.nodes.filter(n=>n.synthetic))$('session').add(new Option(n.label,JSON.stringify([n.source,n.sessionId])));
  $('session').value=old;if($('session').selectedIndex<0)$('session').selectedIndex=0;
  $('notice').textContent=(data.demo?'SYNTHETIC DEMO — not a captured AI run. ':'Local trace — capture coverage depends on the collector. ')+(data.warnings.length?`${data.warnings.length} malformed/incomplete event lines omitted. `:'')+'File reads do not prove influence on later choices.';
  draw();if(selected){const refreshed=data.nodes.find(n=>n.key===selected.key);if(refreshed)choose(refreshed);}
});
$('session').onchange=draw;$('view').onchange=draw;$('refresh').onclick=()=>api.postMessage({type:'refresh'});
$('open').onclick=()=>{if(selected)api.postMessage({type:'open',key:selected.key});};
api.postMessage({type:'ready'});
