'use strict';
const vscode=require('vscode');
const crypto=require('node:crypto');
const path=require('node:path');
const fs=require('node:fs/promises');
const {parseTrace,buildGraph}=require('./model.cjs');

function activate(context) {
  async function open(demo=false) {
    const chosen=demo?[vscode.Uri.joinPath(context.extensionUri,'samples','demo.jsonl')]:
      await vscode.window.showOpenDialog({canSelectMany:false,filters:{'Lineage trace':['jsonl']},
        defaultUri:vscode.workspace.workspaceFolders?.[0]&&
          vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri,'.roc','trace.jsonl')});
    if(!chosen?.length) return;
    const uri=chosen[0];
    const panel=vscode.window.createWebviewPanel('rocLineage',demo?'ROC Lineage · Synthetic demo':'ROC Lineage',
      vscode.ViewColumn.One,{enableScripts:true,localResourceRoots:[vscode.Uri.joinPath(context.extensionUri,'media')]});
    const nonce=crypto.randomBytes(24).toString('hex');
    const asset=name=>panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri,'media',name));
    panel.webview.html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${panel.webview.cspSource}; script-src 'nonce-${nonce}';">
      <link rel="stylesheet" href="${asset('style.css')}"></head><body>
      <header><div class="brand">ROC <span>LINEAGE</span></div><h1>Follow the work.</h1>
      <p>Recorded activity, reported claims and inferred relationships remain distinct.</p></header>
      <nav><button id="refresh">Refresh</button><label>Session <select id="session"><option value="">All sessions</option></select></label>
      <label>View <select id="view"><option>Graph</option><option>Timeline</option></select></label><span id="count"></span></nav>
      <p id="notice" role="status">Loading local trace…</p><main><section id="graph" aria-label="Lineage graph"></section>
      <section id="timeline" hidden aria-label="Event timeline"></section><aside><h2>Event details</h2><p id="details">Select an event.</p><button id="open" hidden>Open project file</button>
      <p class="legend">● Recorded · ◇ Reported · ⋯ Inferred<br>Edges show event relationships, not proof of model influence.</p></aside></main>
      <script nonce="${nonce}" src="${asset('view.js')}"></script></body></html>`;
    let state={nodes:[],edges:[]},disposed=false;
    async function refresh() {
      try {
        const stat=await vscode.workspace.fs.stat(uri);
        if(stat.size>10*1024*1024) throw new Error('Trace exceeds 10 MiB; rotate the log.');
        const {events,warnings}=parseTrace(Buffer.from(await vscode.workspace.fs.readFile(uri)).toString('utf8'));
        state=buildGraph(events);
        if(!disposed) await panel.webview.postMessage({type:'trace',...state,warnings,demo});
      } catch(error) { if(!disposed) await panel.webview.postMessage({type:'error',message:String(error.message)}); }
    }
    const messages=panel.webview.onDidReceiveMessage(async message=>{
      if(message?.type==='ready'||message?.type==='refresh') return refresh();
      if(message?.type!=='open'||!vscode.workspace.isTrusted||demo) return;
      const node=state.nodes.find(n=>n.key===message.key);
      if(!node?.path) return;
      const root=vscode.workspace.workspaceFolders?.find(f=>f.uri.scheme==='file');
      if(!root) return;
      try {
        if(path.isAbsolute(node.path)||node.path.split(/[\\/]/).includes('..')) throw new Error('Path outside project');
        const base=await fs.realpath(root.uri.fsPath);
        const candidate=await fs.realpath(path.resolve(base,node.path));
        const relative=path.relative(base,candidate);
        if(relative==='..'||relative.startsWith('..'+path.sep)||path.isAbsolute(relative)) throw new Error('Path outside project');
        await vscode.window.showTextDocument(vscode.Uri.file(candidate));
      } catch(error) { vscode.window.showWarningMessage('ROC: Cannot open project file: '+error.message); }
    });
    const watcher=vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.joinPath(uri,'..'),path.basename(uri.path)));
    let timer;
    const schedule=()=>{clearTimeout(timer); timer=setTimeout(refresh,150);};
    watcher.onDidChange(schedule); watcher.onDidCreate(schedule); watcher.onDidDelete(schedule);
    panel.onDidDispose(()=>{disposed=true;clearTimeout(timer);watcher.dispose();messages.dispose();});
  }
  context.subscriptions.push(vscode.commands.registerCommand('rocLineage.open',()=>open()),
    vscode.commands.registerCommand('rocLineage.demo',()=>open(true)));
}
module.exports={activate};
