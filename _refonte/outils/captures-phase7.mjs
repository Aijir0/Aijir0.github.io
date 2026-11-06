// Captures de la page de comparaison de la phase 7 : portrait A (fiche, intégré) et B (contact, simulé), annonce Atlas.
// Usage : PW=<…/node_modules/playwright> node _refonte/outils/captures-phase7.mjs
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const { chromium } = await import(pathToFileURL(path.join(process.env.PW, 'index.mjs')).href);
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../prototypes/captures/phase7');
const URL = 'http://127.0.0.1:8765/_refonte/prototypes/v2bis/';
const b = await chromium.launch({ channel: 'msedge' });
for (const [nom, w, h] of [['bureau', 1440, 900], ['mobile', 390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.locator('.tete').screenshot({ path: `${OUT}/atlas-${nom}.png` });
  await p.locator('.presentation').screenshot({ path: `${OUT}/portrait-a-${nom}.png` });
  // B : le portrait quitte la fiche et rejoint le contact, à gauche de l'adresse
  await p.evaluate(() => {
    document.querySelector('.identite .portrait').remove();
    document.querySelector('.identite').style.gridTemplateColumns = '1fr';
    const f = document.createElement('figure'); f.className = 'portrait portrait-contact';
    f.innerHTML = '<img src="../medias/portrait-leo.jpg" width="480" height="600" alt="Portrait de Léo Matrat">';
    document.querySelector('.contact').prepend(f);
    const s = document.createElement('style');
    s.textContent = `.contact{grid-template-columns:9rem minmax(0,1fr)!important;column-gap:2rem!important;align-items:end}
      .portrait-contact{grid-row:1/span 2}
      @media (max-width:640px){.contact{grid-template-columns:5.5rem minmax(0,1fr)!important;column-gap:1rem!important}.contact .courriel{white-space:normal;overflow-wrap:anywhere;font-size:1.45rem}.contact .autres{grid-column:1/-1}.portrait-contact{grid-row:auto}}`;
    document.head.append(s);
  });
  await p.waitForTimeout(300);
  await p.locator('#contact').screenshot({ path: `${OUT}/portrait-b-${nom}.png` });
  await p.close();
}
await b.close();
console.log('ok');
