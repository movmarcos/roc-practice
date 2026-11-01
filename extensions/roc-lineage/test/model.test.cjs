const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const modelPath = path.join(__dirname, '../src/model.cjs');
const model = fs.existsSync(modelPath) ? require(modelPath) : {};
const e = (overrides={}) => ({version:1,id:'call-1',sessionId:'s1',source:'demo',
  timestamp:'2030-01-01T12:00:00Z',kind:'tool',label:'Read',evidence:'recorded',status:'started',...overrides});

test('parses events and retains malformed line warnings', () => {
  assert.equal(typeof model.parseTrace, 'function');
  const r=model.parseTrace(JSON.stringify(e())+'\nnot-json\n');
  assert.equal(r.events.length,1); assert.equal(r.warnings.length,1);
});
test('rejects missing provenance and unknown event kind', () => {
  assert.equal(typeof model.parseTrace, 'function');
  assert.equal(model.parseTrace(JSON.stringify(e({evidence:null}))).events.length,0);
  assert.equal(model.parseTrace(JSON.stringify(e({kind:'thought-reading'}))).events.length,0);
});
test('updates tool status without conflating sessions', () => {
  assert.equal(typeof model.buildGraph, 'function');
  const g=model.buildGraph([e(),e({status:'completed'}),e({sessionId:'s2'})]);
  assert.equal(g.nodes.filter(n=>!n.synthetic).length,2);
  assert.equal(g.nodes.find(n=>n.sessionId==='s1'&&!n.synthetic).status,'completed');
});
test('links explicit parent; inferred grouping stays labelled', () => {
  assert.equal(typeof model.buildGraph, 'function');
  const g=model.buildGraph([e(),e({id:'file1',kind:'artifact',parentId:'call-1',label:'index.html'})]);
  assert.equal(g.edges.find(x=>x.to===g.nodes.find(n=>n.id==='file1').key).evidence,'recorded');
  assert.equal(g.edges.find(x=>x.to===g.nodes.find(n=>n.id==='call-1').key).evidence,'inferred');
});
test('does not turn reported evidence into recorded', () => {
  assert.equal(typeof model.buildGraph, 'function');
  const g=model.buildGraph([e(),e({id:'check',parentId:'call-1',evidence:'reported',kind:'check'})]);
  assert.equal(g.edges.find(x=>x.to===g.nodes.find(n=>n.id==='check').key).evidence,'reported');
});
test('bounds trace size', () => {
  assert.equal(typeof model.parseTrace, 'function');
  assert.throws(()=>model.parseTrace('x'.repeat(10*1024*1024+1)), /10 MiB/);
});
test('unknown parent creates no invented causal link', () => {
  assert.equal(typeof model.buildGraph, 'function');
  const g=model.buildGraph([e({parentId:'missing'})]);
  assert.ok(g.edges.every(x=>x.evidence==='inferred'));
});
test('session grouping never inherits file or parent metadata', () => {
  const g=model.buildGraph([e({kind:'context',path:'brief.md',parentId:'missing'})]);
  const root=g.nodes.find(n=>n.synthetic);
  assert.equal(root.path,undefined);assert.equal(root.parentId,undefined);
});
