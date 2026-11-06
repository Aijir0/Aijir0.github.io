// Vérifie et capture les prototypes (desktop 1440×900, mobile 390×844) avec Microsoft Edge.
// Prérequis : serveur local `scripts/preview-games.ps1 -Port 8765` lancé, et le paquet `playwright`
// installé quelque part (PW = chemin de son dossier, sans téléchargement de navigateur).
// Usage : PW=<dossier node_modules/playwright> node _refonte/outils/verifier-prototypes.mjs [v1 v2 v3 fiche]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const { chromium } = await import(pathToFileURL(path.join(process.env.PW, 'index.mjs')).href);
const ici = path.dirname(fileURLToPath(import.meta.url));
const sortie = path.resolve(ici, '../prototypes/captures');
const base = 'http://127.0.0.1:8765/_refonte/prototypes/';

const PAGES = {
  v1: { url: 'v1-couverture/', sections: ['essentiel', 'parcours', 'travaux', 'competences', 'contact'] },
  v2: { url: 'v2-la-une/', sections: ['travaux', 'analyse', 'parcours', 'competences', 'contact'] },
  v3: { url: 'v3-note-annotee/', sections: ['parcours', 'travaux', 'competences', 'contact'] },
  v2bis: { url: 'v2bis/', sections: ['travaux', 'analyse', 'parcours', 'competences', 'contact'] },
  fiche: { url: 'fiche/artefacts-2050.html', sections: [] },
  'fiche-v2bis': { url: 'v2bis/artefacts-2050.html', sections: [] },
  'fiche-rr': { url: 'v2bis/researchrabbit.html', sections: [] },
  pistes: { url: 'pistes-visuels.html', sections: [] },
  'fiche-atlas': { url: 'v2bis/atlas.html', sections: [] },
  phase7: { url: 'phase7.html', sections: [] },
  phase8: { url: 'phase8.html', sections: [] },
  comparatif: { url: '', sections: [] },
};
const choix = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PAGES);
const FORMATS = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const rapport = {};
const navigateur = await chromium.launch({ channel: 'msedge' });
for (const nom of choix) {
  const { url, sections } = PAGES[nom];
  const dossier = path.join(sortie, nom);
  fs.mkdirSync(dossier, { recursive: true });
  for (const [format, options] of Object.entries(FORMATS)) {
    for (const mouvement of ['no-preference', 'reduce']) {
      const ctx = await navigateur.newContext({ ...options, locale: 'fr-CA', reducedMotion: mouvement });
      const page = await ctx.newPage();
      const erreurs = [];
      page.on('console', m => m.type() === 'error' && erreurs.push(m.text()));
      page.on('pageerror', e => erreurs.push('JS ' + e.message));
      page.on('response', r => r.status() >= 400 && erreurs.push(r.status() + ' ' + r.url()));
      await page.goto(base + url, { waitUntil: 'networkidle' });
      const f = (s) => path.join(dossier, `${format}${mouvement === 'reduce' ? '-mouvement-reduit' : ''}_${s}.png`);
      if (mouvement === 'reduce') {
        await page.waitForTimeout(400);
        await page.screenshot({ path: f('00-premier-ecran') });
        await ctx.close();
        continue;
      }
      await page.screenshot({ path: f('00a-pendant-animation') });
      await page.waitForTimeout(1800);
      await page.screenshot({ path: f('00-premier-ecran') });
      const mesures = await page.evaluate(async () => {
        await document.fonts.ready;
        // Les familles attendues sont celles que la page demande à Google Fonts.
        const familles = [...document.querySelectorAll('link[href*="fonts.googleapis.com/css"]')].flatMap(l => new URL(l.href).searchParams.getAll('family').map(x => x.split(':')[0]));
        const chargees = new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')));
        const polices = Object.fromEntries(familles.map(p => [p, chargees.has(p)]));
        const d = document.documentElement;
        const debord = [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > d.clientWidth + 1 && getComputedStyle(el).position !== 'fixed').slice(0, 5).map(el => el.tagName + '.' + el.className);
        const sansAlt = [...document.querySelectorAll('img:not([alt])')].length;
        const petitesCibles = [...document.querySelectorAll('a, button')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 24 && !el.closest('p, li, td, .note, figcaption, h3'); }).length;
        return { polices, defilementHorizontal: d.scrollWidth > d.clientWidth, debord, sansAlt, petitesCibles, hauteur: d.scrollHeight };
      });
      // Captures section par section (titre en haut de l'écran)
      for (const [i, id] of sections.entries()) {
        await page.evaluate(id => { const el = document.getElementById(id); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 8, behavior: 'instant' }); }, id);
        await page.waitForTimeout(1300);
        await page.screenshot({ path: f(`${String(i + 1).padStart(2, '0')}-${id}`) });
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(300);
      // Faire défiler toute la page une fois pour déclencher les tracés, puis capture complète
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 120)); } window.scrollTo({ top: 0, behavior: 'instant' }); });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: f('99-page-complete'), fullPage: true });
      // États interactifs
      const appel = page.locator('.appel').first();
      if (await appel.count()) {
        await appel.scrollIntoViewIfNeeded();
        await page.evaluate(() => scrollBy({ top: -200, behavior: 'instant' }));
        if (format === 'desktop') await appel.hover(); else await appel.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: f('etat-note-reliee') });
      }
      if (format === 'mobile' && await page.locator('[data-ouvre-tiroir]').count()) {
        await page.locator('[data-ouvre-tiroir]').click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: f('etat-sommaire-ouvert') });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
      if (await page.locator('[data-lecture="courte"]').count()) {
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.locator('[data-lecture="courte"]').click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: f('etat-lecture-30s'), fullPage: true });
      }
      rapport[`${nom}/${format}`] = { ...mesures, erreurs: [...new Set(erreurs)] };
      await ctx.close();
    }
  }
}
await navigateur.close();
const fichier = path.join(sortie, 'rapport-verification.json');
const ancien = fs.existsSync(fichier) ? JSON.parse(fs.readFileSync(fichier, 'utf8')) : {};
fs.writeFileSync(fichier, JSON.stringify({ ...ancien, ...rapport }, null, 2));
console.log(JSON.stringify(rapport, null, 2));
