// Mesures du laboratoire de motion design (phase 9) : V2bis contre V2bis-labo.
// Fluidité du défilement (processeur ralenti ×4 sur téléphone), CLS, LCP, mouvement réduit, clavier.
// Usage : PW=<…/node_modules/playwright> node _refonte/outils/mesures-labo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const { chromium } = await import(pathToFileURL(path.join(process.env.PW, 'index.mjs')).href);
const B = 'http://127.0.0.1:8765/_refonte/prototypes/';
const CAS = [
  ['V2bis', 'v2bis/'],
  ['Labo, parallaxe discrète', 'v2bis-labo/?compo=1&parallaxe=1&transitions=1&annotations=1&frise=1&manchette=1'],
  ['Labo, parallaxe marquée', 'v2bis-labo/?compo=1&parallaxe=2&transitions=1&annotations=1&frise=1&manchette=1'],
  ['Labo, parallaxe expressive', 'v2bis-labo/?compo=1&parallaxe=3&transitions=1&annotations=1&frise=1&manchette=1'],
];
const b = await chromium.launch({ channel: 'msedge' });
const resultats = [];

async function mesurer(nom, url, appareil) {
  const ctx = await b.newContext(appareil === 'téléphone'
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  if (appareil === 'téléphone') await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.addInitScript(() => {
    window.__cls = 0; window.__lcp = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await p.goto(B + url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  const lcp = await p.evaluate(() => Math.round(window.__lcp));
  // Défilement de toute la page par pas de 120 px, en relevant l'intervalle entre images (requestAnimationFrame).
  const images = await p.evaluate(async () => {
    const d = []; let t0 = performance.now(), fin = false;
    const boucle = (t) => { d.push(t - t0); t0 = t; if (!fin) requestAnimationFrame(boucle); };
    requestAnimationFrame(boucle);
    const max = document.documentElement.scrollHeight - innerHeight;
    for (let y = 0; y <= max; y += 120) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }
    fin = true; return d.slice(2);
  });
  const lentes = images.filter(x => x > 25).length;
  const cls = await p.evaluate(() => +window.__cls.toFixed(4));
  await ctx.close();
  return { nom, appareil, lcp, cls, images: images.length, lentes, pctLentes: +(100 * lentes / images.length).toFixed(1), median: +images.sort((a, b) => a - b)[Math.floor(images.length / 2)].toFixed(1) };
}

for (const appareil of ['ordinateur', 'téléphone']) for (const [nom, url] of CAS) resultats.push(await mesurer(nom, url, appareil));
console.table(resultats);

// Mouvement réduit : tout doit être visible sans attendre, sans composition ni parallaxe.
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(B + CAS[2][1], { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const caches = [...document.querySelectorAll('.une *, .tete *')].filter(e => { const s = getComputedStyle(e); return e.getClientRects().length && (parseFloat(s.opacity) < 0.99); }).map(e => e.className || e.tagName);
    const i = document.querySelector('.a-la-une .cadre img');
    return { compo: document.documentElement.classList.contains('compo-joue'), elementsTransparents: caches.slice(0, 5), parallaxe: getComputedStyle(i).animationName };
  });
  console.log('Mouvement réduit', JSON.stringify(r)); resultats.push({ reduit: r }); await ctx.close();
}
// Clavier : le focus sur un appel active son cercle ; le focus sur une ligne de l'index montre son aperçu.
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); await p.goto(B + CAS[2][1], { waitUntil: 'networkidle' }); await p.keyboard.press('Escape');
  await p.focus('.graphique .appel >> nth=0'); await p.waitForTimeout(300);
  const cercle = await p.evaluate(() => document.querySelector('.labo-annot path')?.classList.contains('actif'));
  await p.focus('a[data-apercu="2"]'); await p.waitForTimeout(300);
  const apercu = await p.evaluate(() => [...document.querySelectorAll('.apercu figure')].findIndex(f => f.classList.contains('visible')));
  console.log('Clavier', { cercleActifAuFocus: cercle, apercuSuitLeFocus: apercu === 2 }); resultats.push({ clavier: { cercle, apercu } }); await ctx.close();
}
await b.close();
const sortie = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../prototypes/labo/mesures.json');
fs.mkdirSync(path.dirname(sortie), { recursive: true });
fs.writeFileSync(sortie, JSON.stringify({ date: new Date().toISOString(), resultats }, null, 1));
