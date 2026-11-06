// Contrôles complémentaires : contrastes, poids et stabilité, transition de figure, clavier, tiroir mobile.
// Usage : PW=<dossier node_modules/playwright> node _refonte/outils/controles-complementaires.mjs
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import fs from 'node:fs';
const { chromium } = await import(pathToFileURL(path.join(process.env.PW, 'index.mjs')).href);
const sortie = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../prototypes/captures/controles');
fs.mkdirSync(sortie, { recursive: true });
const base = 'http://127.0.0.1:8765/_refonte/prototypes/';
const res = {};

// 1. Contrastes WCAG des paires de couleurs utilisées pour du texte
const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
res.contrastes = Object.fromEntries([
  ['encre/papier', '#1a1c1a', '#f5f2ea'], ['encre-2/papier', '#4a4a44', '#f5f2ea'], ['encre-2/papier-2', '#4a4a44', '#ece7da'],
  ['vert/papier', '#1e4636', '#f5f2ea'], ['rouge/papier', '#a63d2a', '#f5f2ea'], ['papier/encre (boutons)', '#f5f2ea', '#1a1c1a'],
  ['papier/vert (survol)', '#f5f2ea', '#1e4636'], ['saumon/encre (barre mobile)', '#f0b9ac', '#1a1c1a'],
].map(([n, a, b]) => [n, ratio(a, b)]));

const nav = await chromium.launch({ channel: 'msedge' });

// 2. Poids transféré, décalage de mise en page (CLS) et LCP par variante
for (const v of ['v1-couverture/', 'v2-la-une/', 'v2bis/', 'v3-note-annotee/']) {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  let octets = 0;
  p.on('response', async r => { try { octets += (await r.body()).length; } catch {} });
  await p.addInitScript(() => {
    window.__cls = 0; window.__lcp = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await p.goto(base + v, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } });
  await p.waitForTimeout(800);
  const m = await p.evaluate(() => ({ cls: +window.__cls.toFixed(3), lcpMs: Math.round(window.__lcp) }));
  res['perf ' + v] = { ...m, poidsKo: Math.round(octets / 1024) };
  await ctx.close();
}

// 3. La figure devient la page : API disponible, capture en pleine transition
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + 'v2bis/', { waitUntil: 'networkidle' });
  res.viewTransitions = await p.evaluate(() => CSS.supports('view-transition-name: a') && 'onpagereveal' in window);
  await p.locator('.a-la-une a.lien', { hasText: 'Lire la fiche' }).click();
  await p.waitForTimeout(180);
  await p.screenshot({ path: path.join(sortie, 'transition-figure-180ms.png') });
  await p.waitForLoadState('networkidle'); await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(sortie, 'transition-figure-arrivee.png') });
  res.retourVersOrigine = await p.locator('[data-retour]').first().getAttribute('href');
  await ctx.close();
}

// 4. Clavier : lien d'évitement, ordre de tabulation, anneau de focus visible
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + 'v1-couverture/', { waitUntil: 'networkidle' });
  const ordre = [];
  for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); ordre.push(await p.evaluate(() => (document.activeElement.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30))); }
  res.ordreTabulation = ordre;
  await p.screenshot({ path: path.join(sortie, 'focus-clavier.png') });
  // Notes : le focus clavier sur un appel relie la note
  await p.locator('.appel').first().focus();
  await p.waitForTimeout(400);
  res.noteRelieeAuFocus = await p.evaluate(() => document.querySelector('.note.actif') !== null && document.querySelector('.fil-notes path.trace') !== null);
  await ctx.close();
}

// 5. Tiroir mobile : ouverture, focus piégé, Échap ferme et rend le focus
{
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(base + 'v2bis/', { waitUntil: 'networkidle' });
  await p.locator('[data-ouvre-tiroir]').click();
  await p.waitForTimeout(500);
  const ouvert = await p.evaluate(() => document.querySelector('.tiroir').open && document.querySelector('.tiroir').contains(document.activeElement));
  await p.keyboard.press('Escape');
  await p.waitForTimeout(450);
  const ferme = await p.evaluate(() => !document.querySelector('.tiroir').open && document.activeElement.matches('[data-ouvre-tiroir]'));
  await p.locator('[data-ouvre-tiroir]').click();
  await p.waitForTimeout(500);
  await p.locator('.tiroir a[href="#travaux"]').click();
  await p.waitForTimeout(900);
  const arrive = await p.evaluate(() => Math.round(document.getElementById('travaux').getBoundingClientRect().top));
  res.tiroirMobile = { ouvertEtFocusDedans: ouvert, echapFermeEtRendLeFocus: ferme, sectionAtteinteTop: arrive };
  await ctx.close();
}
await nav.close();
fs.writeFileSync(path.join(sortie, 'controles.json'), JSON.stringify(res, null, 2));
console.log(JSON.stringify(res, null, 2));
