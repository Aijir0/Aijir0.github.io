// Vérifie que chaque lien interne des prototypes répond (HTTP 200) et que chaque ancre #id existe.
// Usage : PW=<…/node_modules/playwright> node _refonte/outils/verifier-liens.mjs
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(path.join(process.env.PW, 'index.mjs')).href);
const base = 'http://127.0.0.1:8765/_refonte/prototypes/';
const pages = ['', 'pistes-visuels.html', 'v1-couverture/', 'v2-la-une/', 'v3-note-annotee/', 'v2bis/', 'v2bis/artefacts-2050.html',
  'v2bis/researchrabbit.html', 'v2bis-phase5/', 'fiche/artefacts-2050.html'];
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage();
const vus = new Map(), casses = [];
for (const pg of pages) {
  await p.goto(base + pg, { waitUntil: 'domcontentloaded' });
  const { liens, ancres } = await p.evaluate(() => ({
    liens: [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith(location.origin) && !h.includes('#')),
    ancres: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.getElementById(h.slice(1))),
  }));
  ancres.forEach(a => casses.push(`${pg || 'comparatif'} : ancre ${a} introuvable`));
  for (const u of new Set(liens)) {
    if (!vus.has(u)) vus.set(u, (await p.request.get(u)).status());
    if (vus.get(u) !== 200) casses.push(`${pg || 'comparatif'} : ${vus.get(u)} ${u}`);
  }
}
await b.close();
console.log(`${vus.size} liens internes testés sur ${pages.length} pages.`);
console.log(casses.length ? casses.join('\n') : 'Aucun lien cassé.');
