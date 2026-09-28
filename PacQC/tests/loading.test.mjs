// Test du vrai point d'entrée avec un adaptateur DOM/Canvas : pas un essai navigateur.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LEVELS, nextLevel } from '../js/map.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
class Element {
  constructor() { this.listeners = new Map(); this.textContent = ''; this.attributes = new Map(); }
  addEventListener(type, fn) { if (!this.listeners.has(type)) this.listeners.set(type, new Set()); this.listeners.get(type).add(fn); }
  removeEventListener(type, fn) { this.listeners.get(type)?.delete(fn); }
  emit(type, event = {}) { for (const fn of this.listeners.get(type) || []) fn(event); }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  focus() { globalThis.document.activeElement = this; }
  getBoundingClientRect() { return { width: 690, height: 750 }; }
}
const original = Object.fromEntries(['document','window','Image'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis,key)]));
const signatures = [];
try {
  globalThis.Image = class {
    async decode() {
      const bytes = readFileSync(new URL(this.src));
      assert.equal(bytes.subarray(1,4).toString(), 'PNG');
      this.naturalWidth = bytes.readUInt32BE(16); this.naturalHeight = bytes.readUInt32BE(20);
    }
  };
  for (const level of LEVELS) {
    const calls = [], frames = new Map(), elements = new Map(); let sequence = 0;
    const context = () => new Proxy({}, {get(target,key) { return target[key] ?? ((...args) => calls.push([key,...args.map(a=>typeof a === 'object'?'canvas':a)])); }});
    for (const [,id] of html.matchAll(/\bid="([^"]+)"/g)) elements.set(id,new Element());
    const links = LEVELS.map(l => { assert(html.includes(`href="?carte=${l.id}"`)); const link=new Element();link.dataset={map:l.id};return link; });
    const doc = new Element(), win = new Element();
    doc.hidden=false; doc.getElementById=id=>elements.get(id) || null;
    doc.querySelectorAll=selector=>{assert.equal(selector,'[data-map]');return links;};
    doc.createElement=tag=>{assert.equal(tag,'canvas');const el=new Element();el.getContext=()=>context();return el;};
    elements.get('game').getContext=()=>context();
    win.location={search:'?carte='+level.id};win.devicePixelRatio=1;
    win.requestAnimationFrame=fn=>{frames.set(++sequence,fn);return sequence;};win.cancelAnimationFrame=id=>frames.delete(id);
    globalThis.document=doc;globalThis.window=win;
    await import('../js/game.js?loading-test='+level.id);
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(elements.get('game-errors').textContent,'');
    assert.equal(elements.get('map-title').textContent,level.name+'.');
    assert.equal(elements.get('map-description').textContent,level.description);
    assert.equal(elements.get('next-map').href,'?carte='+nextLevel(level).id);
    assert.equal(links.filter(link=>link.attributes.get('aria-current')==='page')[0].dataset.map,level.id);
    assert.equal(elements.get('play').disabled,false);
    assert.equal(frames.size,1);
    signatures.push(JSON.stringify(calls)); // Vrais contours et marqueurs du renderer.
    if(level.modifier==='portals') assert(calls.some(c=>c[0]==='fillText'&&c[1]==='A') && calls.some(c=>c[0]==='fillText'&&c[1]==='B'));
    else assert(!calls.some(c=>c[0]==='fillText'&&c[1]==='A'));
    elements.get('restart').emit('click');
    assert.equal(elements.get('score').value,'0000');assert.equal(elements.get('lives').value,3);
    assert.equal(elements.get('map-title').textContent,level.name+'.');assert.equal(frames.size,1);
    const [id,frame]=frames.entries().next().value;frames.delete(id);frame(0); // Vrai rendu des sprites.
    assert.equal(frames.size,1);
  }
  assert.equal(new Set(signatures).size,3,'Les trois chargements doivent dessiner trois tracés différents');
  console.log('Chargement réel : 3 grilles et rendus distincts, marqueurs, liens, sprites PNG et redémarrage validés (DOM/Canvas simulés).');
} finally {
  for (const [key,descriptor] of Object.entries(original)) { if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key]; }
}
