// Contrôle final du site définitif (phase 11), servi depuis _site-definitif/ sur le port 8766.
// Usage : PW=<…/node_modules/playwright> node _refonte/outils/verifier-site.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
const { chromium } = await import(pathToFileURL(path.join(process.env.PW, 'index.mjs')).href);
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../_site-definitif');
const B = 'http://127.0.0.1:8766';
const PAGES = ['/', '/travaux/artefacts-2050/', '/travaux/researchrabbit/', '/travaux/atlas/'];
const AUTRES = ['/PacQC/', '/jeu/', '/artefacts-2050/', '/espace-jeux/', '/espace-jeux/selection.html', '/projet_session/projet2.html'];
const LARGEURS = [[1440, 900], [1024, 768], [768, 1024], [390, 844]];
const pb = []; const note = (m) => { pb.push(m); console.log('  ✗ ' + m); };
const b = await chromium.launch({ channel: 'msedge' });

/* 1. Rendu des pages du site à quatre largeurs ; pages des jeux et documents à deux */
for (const url of [...PAGES, ...AUTRES]) for (const [w, h] of PAGES.includes(url) ? LARGEURS : [[1440, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && err.push(m.text()));
  await p.goto(B + url, { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  const r = await p.evaluate((site) => {
    const vis = (e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
    // Exception WCAG 2.5.8 : un lien pris dans une phrase ou une cellule de texte n'est pas compté.
    const enLigne = (e) => e.matches('a') && e.closest('p, td, dd, li') && getComputedStyle(e).display === 'inline';
    const petites = site ? [...document.querySelectorAll('a[href], button')].filter(vis).filter(e => !enLigne(e)).filter(e => { const x = e.getBoundingClientRect(); return x.width > 0 && (x.height < 24 || x.width < 24); }).map(e => (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 20)) : [];
    return { debord: document.documentElement.scrollWidth - innerWidth, sansAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length, petites };
  }, PAGES.includes(url));
  if (err.length) note(`${url} @${w} : erreurs ${JSON.stringify(err)}`);
  if (r.debord > 0) note(`${url} @${w} : défilement horizontal de ${r.debord}px`);
  if (r.sansAlt) note(`${url} @${w} : ${r.sansAlt} image(s) sans attribut alt`);
  if (r.petites.length) note(`${url} @${w} : cibles de moins de 24px ${JSON.stringify(r.petites)}`);
  await p.close();
}
console.log('1. Rendu : terminé');

/* 2. Liens internes, ancres, images ; liens externes listés */
{
  const p = await b.newPage(); const vus = new Map(), externes = new Set();
  for (const url of PAGES) {
    await p.goto(B + url, { waitUntil: 'domcontentloaded' });
    const { liens, ancres, ext } = await p.evaluate(() => ({
      liens: [...[...document.querySelectorAll('a[href]')].map(a => a.href), ...[...document.querySelectorAll('img')].map(i => i.currentSrc || i.src), ...[...document.querySelectorAll('link[rel~="icon"], link[rel="stylesheet"], script[src]')].map(e => e.href || e.src), document.querySelector('meta[property="og:image"]')?.content.replace('https://leomatrat.com', location.origin)].filter(h => h && h.startsWith(location.origin)).map(h => h.split('#')[0]),
      ancres: [...document.querySelectorAll('a[href*="#"]')].map(a => new URL(a.href)).filter(u => u.pathname === location.pathname && u.hash.length > 1 && !document.getElementById(u.hash.slice(1))).map(u => u.hash),
      ext: [...document.querySelectorAll('a[href^="http"]')].map(a => a.href).filter(h => !h.startsWith(location.origin)),
    }));
    ancres.forEach(a => note(`${url} : ancre ${a} introuvable`)); ext.forEach(e => externes.add(e));
    for (const u of new Set(liens)) { if (!vus.has(u)) vus.set(u, (await p.request.get(u)).status()); if (vus.get(u) !== 200) note(`${url} : ${vus.get(u)} ${u}`); }
  }
  console.log(`2. Liens : ${vus.size} ressources internes testées ; liens externes : ${[...externes].join(', ')}`);
  await p.close();
}

/* 3. Métadonnées, titres, mentions de travail */
for (const url of PAGES) {
  const p = await b.newPage(); await p.goto(B + url, { waitUntil: 'domcontentloaded' });
  const m = await p.evaluate(() => ({
    lang: document.documentElement.lang, titre: document.title, desc: document.querySelector('meta[name="description"]')?.content || '',
    canon: document.querySelector('link[rel="canonical"]')?.href, og: !!document.querySelector('meta[property="og:image"]'), h1: document.querySelectorAll('h1').length,
    noindex: !!document.querySelector('meta[name="robots"][content*="noindex"]'),
    travail: document.querySelectorAll('.a-completer, .a-valider, .proto-note, .piste-visuel').length + (/à compléter|à valider|prototype/i.test(document.body.innerText) ? 1 : 0),
  }));
  if (m.lang !== 'fr-CA' || !m.titre || m.desc.length < 50 || !m.canon || !m.og || m.h1 !== 1 || m.noindex || m.travail) note(`${url} : métadonnées ${JSON.stringify(m)}`);
  await p.close();
}
console.log('3. Métadonnées : terminé');

/* 4. Contrastes du texte visible (AA) */
for (const url of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); await p.goto(B + url, { waitUntil: 'networkidle' });
  const faibles = await p.evaluate(() => {
    const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
    const fond = (e) => { for (; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length === 3 || (c[3] ?? 1) > .9) return c.slice(0, 3); } return [245, 242, 234]; };
    const out = [];
    for (const e of document.querySelectorAll('body *')) {
      if (!e.childNodes.length || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
      if (!e.getClientRects().length || e.closest('.cadre, svg, .barre-lecture')) continue;
      const s = getComputedStyle(e); if (parseFloat(s.opacity) < 1) continue;
      const l1 = lum(rgb(s.color)), l2 = lum(fond(e)), ratio = (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05);
      const grand = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && +s.fontWeight >= 700);
      if (ratio < (grand ? 3 : 4.5)) out.push(`${e.tagName}.${e.className} ${ratio.toFixed(2)}`);
    }
    return out.slice(0, 6);
  });
  faibles.forEach(f => note(`${url} : contraste ${f}`)); await p.close();
}
console.log('4. Contrastes : terminé');

/* 5. Clavier : chaque élément focalisable de l'accueil montre un contour visible */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(B + '/', { waitUntil: 'networkidle' });
  const sans = [];
  for (let i = 0; i < 30; i++) {
    await p.keyboard.press('Tab');
    const f = await p.evaluate(() => { const e = document.activeElement, s = getComputedStyle(e); return { t: (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 24), o: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 }; });
    if (!f.o) sans.push(f.t);
  }
  if (sans.length) note(`clavier : focus sans contour visible ${JSON.stringify(sans)}`);
  console.log('5. Clavier : 30 tabulations contrôlées'); await p.close();
}

/* 6. Mouvement réduit : rien de caché après défilement complet */
for (const url of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); await p.goto(B + url, { waitUntil: 'networkidle' });
  const caches = await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
    return [...document.querySelectorAll('main *')].filter(e => e.getClientRects().length && !e.closest('.apercu') && !e.closest('svg.cercles')).filter(e => { const s = getComputedStyle(e); return parseFloat(s.opacity) < .99 || (s.clipPath !== 'none' && s.clipPath !== 'inset(0px)'); }).map(e => e.tagName + '.' + e.className).slice(0, 5);
  });
  if (caches.length) note(`${url} : en mouvement réduit, éléments cachés ${JSON.stringify(caches)}`); await p.close();
}
console.log('6. Mouvement réduit : terminé');

/* 7. Performances : LCP, CLS (normal et réduit), images lentes au défilement (téléphone, processeur ×4) */
for (const [nom, opts] of [['ordinateur', { viewport: { width: 1440, height: 900 } }], ['téléphone ×4', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }], ['réduit', { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }]]) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  if (nom.includes('×4')) await (await ctx.newCDPSession(p)).send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.addInitScript(() => { window.__cls = 0; window.__lcp = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); });
  await p.goto(B + '/', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  // LCP lu avant tout défilement : chez un vrai visiteur, la mesure s'arrête au premier geste.
  const r = await p.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(4) }));
  const lentes = await p.evaluate(async () => { const d = []; let t0 = performance.now(), fin = false; const f = (t) => { d.push(t - t0); t0 = t; if (!fin) requestAnimationFrame(f); }; requestAnimationFrame(f);
    for (let y = 0; y <= document.documentElement.scrollHeight - innerHeight; y += 120) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); } fin = true; return d.slice(2).filter(x => x > 25).length + '/' + (d.length - 2); });
  r.cls = await p.evaluate(() => +window.__cls.toFixed(4));
  console.log(`7. Performances (${nom}) : LCP ${r.lcp} ms, CLS ${r.cls}, images lentes ${lentes}`);
  if (r.cls > 0.05 || r.lcp > 2500) note(`performances ${nom} : ${JSON.stringify(r)}`); await ctx.close();
}
const poids = execSync('git ls-files -z', { cwd: SITE }).toString().split('\0').filter(f => /^(index\.html|assets\/site\/)/.test(f)).reduce((n, f) => n + fs.statSync(path.join(SITE, f)).size, 0);
console.log(`   Poids de l'accueil et de ses ressources propres : ${Math.round(poids / 1024)} Ko`);

/* 8. Simulation de la publication : fichiers suivis par Git, moins les exclusions Jekyll et _config.yml */
{
  const suivis = execSync('git ls-files -z', { cwd: SITE }).toString().split('\0').filter(Boolean);
  const exclure = fs.readFileSync(path.join(SITE, '_config.yml'), 'utf8').split('\n').filter(l => /^\s+- /.test(l)).map(l => l.trim().slice(2));
  const publie = suivis.filter(f => !f.split('/').some(s => /^[_.#~]/.test(s)) && !exclure.some(x => x.endsWith('/') ? f.startsWith(x) : f === x));
  const sensibles = ['CV/cvLaTeX.tex', 'DESIGN.md', 'README.md', 'docs/INTEGRATION-JEUX.md', 'tests/preview.test.mjs', 'projet_annexe/semantic_scholar_search.py', 'scripts/preview-games.ps1', 'Curseur.md', 'PacQC/README.md'];
  sensibles.filter(s => publie.includes(s)).forEach(s => note(`publication : ${s} serait publié`));
  if (suivis.some(f => f.startsWith('_refonte'))) note('dépôt : des fichiers de _refonte/ sont suivis dans la branche du site');
  const liquide = publie.filter(f => /\.(html|md|xml|txt|css|js)$/.test(f)).filter(f => fs.readFileSync(path.join(SITE, f), 'utf8').startsWith('---'));
  if (liquide.length) note(`publication : fichiers avec en-tête Jekyll ${liquide.join(', ')}`);
  console.log(`8. Publication simulée : ${publie.length} fichiers publiés sur ${suivis.length} suivis ; exclus : ${suivis.length - publie.length}`);
  console.log('   Toujours visibles dans le dépôt GitHub public : ' + ['CV/cvLaTeX.tex', 'CV/CVLeoM.pdf'].filter(f => suivis.includes(f)).join(', '));
}
await b.close();
console.log(pb.length ? `\n${pb.length} problème(s) relevé(s).` : '\nAucun problème relevé.');
