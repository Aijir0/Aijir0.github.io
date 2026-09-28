import assert from 'node:assert/strict';
import { mountPreview, SEQUENCE, FRAME_DURATION_MS } from '../espace-jeux/preview.js';
class Events {
  listeners = new Map();
  addEventListener(type, fn) { if (!this.listeners.has(type)) this.listeners.set(type, new Set()); this.listeners.get(type).add(fn); }
  removeEventListener(type, fn) { this.listeners.get(type)?.delete(fn); }
  emit(type) { for (const fn of this.listeners.get(type) || []) fn(); }
}
async function setup({ missing = [], reduced = false, hidden = false } = {}) {
  const doc = new Events(), win = new Events(), preference = new Events();
  doc.hidden = hidden; preference.matches = reduced; win.matchMedia = () => preference;
  const timers = new Map(), requests = [], images = []; let serial = 0;
  const clock = { setTimeout(fn, ms) { assert.equal(ms, 140); timers.set(++serial, fn); return serial; }, clearTimeout(id) { timers.delete(id); } };
  class FakeImage {
    style = {}; setAttribute() {}
    set src(value) { this.path = value; requests.push(value); images.push(this); }
    async decode() {}
  }
  const target = { children: [], append(image) { this.children.push(image); }, querySelector() { return { remove() {} }; } };
  const controller = mountPreview(target, { doc, win, ImageClass: FakeImage, clock });
  assert.equal(timers.size, 0, 'Pas de démarrage avant préchargement');
  for (const [index, image] of images.entries()) {
    if (missing.includes(index)) image.onerror(); else await image.onload();
    if (index < 4) assert.equal(timers.size, 0);
  }
  await controller.ready;
  function tick() { assert.equal(timers.size, 1); const [id, fn] = [...timers][0]; timers.delete(id); fn(); }
  function visible() { return images.findIndex(image => image.style.visibility === 'visible'); }
  return { controller, doc, win, preference, timers, requests, target, tick, visible };
}
assert.equal(FRAME_DURATION_MS, 140);
const app = await setup();
const observed = [app.visible()];
for (let i = 0; i < 19; i++) { app.tick(); observed.push(app.visible()); }
assert.deepEqual(observed, [...SEQUENCE, ...SEQUENCE]);
assert.equal(app.requests.length, 5, 'Aucun rechargement pendant les boucles');
assert.equal(app.target.children.length, 5);
app.doc.hidden = true; app.doc.emit('visibilitychange'); assert.equal(app.timers.size, 0);
app.doc.hidden = false; app.doc.emit('visibilitychange'); assert.equal(app.timers.size, 1);
app.preference.matches = true; app.preference.emit('change'); assert.equal(app.timers.size, 0); assert.equal(app.visible(), 2);
app.preference.matches = false; app.preference.emit('change'); assert.equal(app.timers.size, 1);
app.win.emit('pagehide'); assert.equal(app.timers.size, 0);
app.win.emit('pageshow'); assert.equal(app.timers.size, 1);
app.controller.dispose(); assert.equal(app.timers.size, 0);
for (const options of [{ reduced: true }, { hidden: true }, { missing: [0] }, { missing: [2] }, { missing: [0, 1, 2, 3, 4] }]) {
  const variant = await setup(options);
  assert.equal(variant.timers.size, 0);
  if (options.missing?.length === 5) assert.equal(variant.target.children.length, 0);
  else assert.notEqual(variant.visible(), -1, 'Un aperçu fixe disponible reste visible');
  assert.equal(variant.requests.length, 5);
  variant.controller.dispose();
}
console.log('Vignette : séquence exacte sur deux cycles, préchargement, 5 requêtes uniques, pause/reprise, réduction des animations, erreurs partielles/totales et nettoyage validés.');
