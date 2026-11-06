// Phase 11 — transpose le prototype validé V2bis en site définitif, dans le répertoire de travail _site-definitif/
// (branche site-definitif, issue d'origin/main). Aucune réécriture manuelle : chaque remplacement vérifie son motif.
// Usage : PW=<…/node_modules/playwright> node _refonte/outils/construire-site.mjs   (serveur local sur 8765 pour la conversion d'image)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ici = path.dirname(fileURLToPath(import.meta.url));
const PROTO = path.resolve(ici, '../prototypes');
const SITE = path.resolve(ici, '../../_site-definitif');
const lire = (p) => fs.readFileSync(path.join(PROTO, p), 'utf8');
const ecrire = (p, t) => { fs.mkdirSync(path.dirname(path.join(SITE, p)), { recursive: true }); fs.writeFileSync(path.join(SITE, p), t); console.log('écrit', p); };
function remplacer(t, regles, nom) {
  for (const [a, b] of regles) {
    const ok = typeof a === 'string' ? t.includes(a) : a.test(t);
    if (!ok) throw new Error(`${nom} : motif absent → ${String(a).slice(0, 90)}`);
    t = typeof a === 'string' ? t.split(a).join(b) : t.replace(a, b);
  }
  return t;
}

/* ---------- Images : copies sous des noms définitifs ---------- */
const IMG = '/assets/site/img/';
const images = {
  'medias/projets/p7-pacqc-1-borne.png': 'pacqc.png',
  'medias/projets/p7-scene-2-place.png': 'scene-pixel-art.png',
  'medias/projets/researchrabbit-vignette.jpg': 'researchrabbit-vignette.jpg',
  'medias/projets/researchrabbit-document.jpg': 'researchrabbit-document.jpg',
  'medias/projets/p7-atlas-globe.svg': 'atlas-globe.svg',
  'medias/projets/p7-atlas-vignette.jpg': 'atlas-vignette.jpg',
  'medias/projets/p7-atlas-carte.jpg': 'atlas-carte.jpg',
  'medias/portrait-leo.jpg': 'portrait-leo.jpg',
};
fs.mkdirSync(path.join(SITE, 'assets/site/img'), { recursive: true });
for (const [de, vers] of Object.entries(images)) fs.copyFileSync(path.join(PROTO, de), path.join(SITE, 'assets/site/img', vers));
// Artéfacts 2050 : la vignette publiée (mise à jour par la PR #4) convertie en JPEG léger
{
  const { chromium } = await import(pathToFileURL(path.join(process.env.PW, 'index.mjs')).href);
  const b = await chromium.launch({ channel: 'msedge' }); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8765/_refonte/');
  const donnees = 'data:image/png;base64,' + fs.readFileSync(path.join(SITE, 'artefacts-2050/vignette.png')).toString('base64');
  const jpeg = await p.evaluate(async (src) => {
    const i = new Image(); i.src = src; await i.decode();
    const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight;
    c.getContext('2d').drawImage(i, 0, 0); return c.toDataURL('image/jpeg', 0.86).split(',')[1];
  }, donnees);
  fs.writeFileSync(path.join(SITE, 'assets/site/img/artefacts-2050.jpg'), Buffer.from(jpeg, 'base64'));
  await b.close();
}
const cheminsImages = [
  ['../medias/projets/p7-pacqc-1-borne.png', IMG + 'pacqc.png'],
  ['../medias/projets/p7-scene-2-place.png', IMG + 'scene-pixel-art.png'],
  ['../medias/projets/researchrabbit-vignette.jpg', IMG + 'researchrabbit-vignette.jpg'],
  ['../medias/projets/researchrabbit-document.jpg', IMG + 'researchrabbit-document.jpg'],
  ['../medias/projets/p7-atlas-globe.svg', IMG + 'atlas-globe.svg'],
  ['../medias/projets/p7-atlas-vignette.jpg', IMG + 'atlas-vignette.jpg'],
  ['../medias/projets/p7-atlas-carte.jpg', IMG + 'atlas-carte.jpg'],
  ['../medias/portrait-leo.jpg', IMG + 'portrait-leo.jpg'],
  ['../medias/artefacts-2050.jpg', IMG + 'artefacts-2050.jpg'],
];

/* ---------- Feuille de style unique : socle + V2bis + fiches, sans les règles de prototype ---------- */
let socle = lire('commun/base.css');
socle = remplacer(socle, [
  ['/* Note de breffage — socle commun des prototypes (tokens, typographie, signatures). */', '/* Léo Matrat — « Note de breffage, publication vivante ». Feuille unique du site (référence : DESIGN.md).\n   1. Socle (tokens, typographie, signatures)  2. Édition V2bis  3. Fiches de réalisation */'],
  [/\/\* ---------- Emplacement provisoire, toujours visible ---------- \*\/\n\.a-completer \{[\s\S]*?\n\}\n\.a-completer::before[^\n]*\n\.etiquette-proto[^\n]*\n/, ''],
  [/\.a-valider \{[^\n]*\n/, ''],
  [/\/\* Lecture en 30 secondes[^\n]*\n\[data-lecture="courte"\][^\n]*\n\.bascule-lecture \{[^\n]*\n\.bascule-lecture span[^\n]*\n\.bascule-lecture button \{[^\n]*\n\.bascule-lecture button\[aria-pressed="true"\][^\n]*\n/, ''],
  ['  --vert-clair: #dfe6dc;\n', ''],
], 'base.css');
let edition = lire('v2bis/v2bis.css');
edition = remplacer(edition, [
  [/\.a-completer \{ font: 500 \.78rem\/1\.4 var\(--sans\); \}\n/, ''],
  [/\.proto-note \{[^\n]*\n/, ''],
  [/\.une \.proto-note \{[^\n]*\n/, ''],
  [/\.piste-visuel \{[^\n]*\n/, ''],
  [/\.bascule-lecture button \{[^\n]*\n/, ''],
  [/\.a-completer \{ display: inline-block; \}\n/, ''],
  ['Comportements : v2bis.js.', 'Comportements : site.js.'],
  ["/* V2bis « La Une, édition de fond » — chargée après commun/base.css, qu'elle surcharge.", '/* « La Une, édition de fond » — surcharge le socle ci-dessus.'],
], 'v2bis.css');
const fiches = `
/* =====================================================================
   3. Fiches de réalisation (/travaux/…/) : en-tête « objet, date », figure, mémo, sections, accès
   ===================================================================== */
.fiche-page { max-width: 64rem; margin: 0 auto; padding: 0 var(--gouttiere) 2rem; }
.haut { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding: 1.4rem 0 1rem; border-bottom: 1px solid var(--encre); font: 500 .9375rem var(--sans); }
.haut a { text-decoration: none; padding: .45rem 0; margin: -.45rem 0; }
.titre-fiche { padding: 2.75rem 0 1.75rem; }
.titre-fiche h1 { margin: .5rem 0 .4rem; font-size: clamp(3rem, 7vw, 5.25rem); font-weight: 400; letter-spacing: -.035em; }
.titre-fiche h1 + .chapo { margin-top: .6rem; }
.titre-fiche .sous-titre { margin: 0 0 1rem; font: italic 400 clamp(1.4rem, 2.4vw, 1.9rem)/1.25 var(--serif); color: var(--encre-2); }
.memo { margin: 2rem 0 0; border-top: 1px solid var(--encre); }
.memo div { display: grid; grid-template-columns: 8rem minmax(0, 1fr); gap: 1rem; padding: .7rem 0; border-bottom: 1px solid var(--filet); }
.memo dt { font: 500 .8125rem/1.75 var(--sans); color: var(--encre-2); }
.memo dd { margin: 0; font-size: 1.0625rem; line-height: 1.45; }
.fiche-page section { padding-top: 3.25rem; }
.fiche-page h2 { margin-bottom: 1rem; font-size: 2rem; }
.liste-numerotee { list-style: none; margin: 0; padding: 0; counter-reset: n; }
.liste-numerotee li { counter-increment: n; display: grid; grid-template-columns: 2.5rem 1fr; padding: .75rem 0; border-top: 1px solid var(--filet); }
.liste-numerotee li::before { content: counter(n) "."; font: 400 1.1875rem var(--serif); color: var(--vert); }
.liste-numerotee strong { font-weight: 500; }
.acces { display: flex; flex-wrap: wrap; gap: 1rem 1.5rem; align-items: center; }
@media (max-width: 640px) {
  .memo div { grid-template-columns: 6rem minmax(0, 1fr); gap: .75rem; }
  .acces .bouton { width: 100%; justify-content: center; }
}

/* =====================================================================
   4. Finitions de la mise en ligne
   ===================================================================== */
/* Au doigt, les liens pris dans le texte (preuves, annonce Atlas, colophon) reçoivent une zone de contact
   d'environ 44 px, invisible : la mise en page et le soulignement ne bougent pas. */
@media (pointer: coarse) {
  .competences td:last-child .lien, .atlas-titre a, .colophon a { position: relative; }
  .competences td:last-child .lien::after, .atlas-titre a::after, .colophon a::after { content: ""; position: absolute; inset: -.7rem -.3rem; }
}
`;
ecrire('assets/site/site.css', socle + '\n/* =====================================================================\n   2. Édition V2bis « La Une, édition de fond »\n   ===================================================================== */\n' + edition + fiches);

/* ---------- En-tête commun : métadonnées, polices, feuille, script ---------- */
const DESCRIPTION = "Léo Matrat, étudiant en veille, recherche et prospective au ministère de l'Éducation du Québec et étudiant au MBA en analytique d'affaires à l'Université Laval : travaux, parcours et contact.";
const tete = ({ titre, description, chemin, image = 'partage.jpg' }) => `<!doctype html>
<html lang="fr-CA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${titre}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://leomatrat.com${chemin}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_CA">
  <meta property="og:site_name" content="Léo Matrat">
  <meta property="og:title" content="${titre}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://leomatrat.com${chemin}">
  <meta property="og:image" content="https://leomatrat.com${IMG}${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#f5f2ea">
  <link rel="icon" href="/assets/site/icone.svg" type="image/svg+xml">
  <script>document.documentElement.classList.add('js')</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600&display=swap">
  <link rel="stylesheet" href="/assets/site/site.css?v=20261106">
  <script src="/assets/site/site.js?v=20261106"></script>
</head>`;
const COLOPHON_ACCUEIL = `    <footer class="colophon">
      <div class="grille">
        <p>Composé en Newsreader et Atkinson Hyperlegible Next. Site personnel : il n'engage ni ne représente aucune organisation.</p>
        <p>© 2026 Léo Matrat · <a href="https://github.com/Aijir0">Code source</a></p>
      </div>
    </footer>`;
const FICHES = { 'artefacts-2050.html': '/travaux/artefacts-2050/', 'researchrabbit.html': '/travaux/researchrabbit/', 'atlas.html': '/travaux/atlas/' };
const liensCommuns = (t) => {
  for (const [a, b] of cheminsImages) t = t.split(a).join(b);
  t = t.split('../../../').join('/');
  for (const [a, b] of Object.entries(FICHES)) t = t.split(`href="${a}"`).join(`href="${b}"`);
  return t;
};

/* ---------- Accueil ---------- */
let accueil = lire('v2bis/index.html');
accueil = remplacer(accueil, [
  [/<!doctype html>[\s\S]*?<\/head>/, tete({ titre: 'Léo Matrat — veille, recherche, prospective et données', description: DESCRIPTION, chemin: '/' })],
  [/<!-- Prototype V2bis :[\s\S]*?-->\n/, ''],
  [/\s*<span class="piste-visuel">Visuel proposé, à valider<\/span>/g, ''],
  [' <span class="a-valider">niveaux à confirmer</span>', ''],
  [/ data-detail/g, ''],
  [/\s*<footer class="colophon">[\s\S]*?<\/footer>/, '\n' + COLOPHON_ACCUEIL],
  [/<script src="\.\.\/commun\/signatures\.js" defer><\/script>\n<script>[\s\S]*?<\/script>\n/, ''],
]);
accueil = liensCommuns(accueil);
ecrire('index.html', accueil);

/* ---------- Fiches ---------- */
const meta = {
  'artefacts-2050.html': { titre: 'Artéfacts 2050 — Léo Matrat', description: "Artéfacts 2050, jeu sérieux de prospective sur l'éducation au Québec : cinq fiches de prospective, six décisions de 2026 à 2045, environ cinq minutes de jeu.", image: 'artefacts-2050.jpg' },
  'researchrabbit.html': { titre: 'ResearchRabbit — Léo Matrat', description: "Présentation universitaire de ResearchRabbit, un outil d'exploration de la littérature scientifique, composée en LaTeX (Beamer) : origine, comparaison avec les outils courants, prise en main.", image: 'researchrabbit-document.jpg' },
  'atlas.html': { titre: 'Atlas, hors-série en chantier — Léo Matrat', description: "Atlas, futur globe interactif en 3D pour explorer les voyages de Léo Matrat : lieux visités, photographies, récits. Projet en chantier.", image: 'atlas-carte.jpg' },
};
for (const [f, dest] of Object.entries(FICHES)) {
  let t = lire('v2bis/' + f);
  t = remplacer(t, [
    [/<!doctype html>[\s\S]*?<\/head>/, tete({ ...meta[f], chemin: dest })],
    [/Prototype V2bis\./g, '© 2026 Léo Matrat.'],
    [/href="\.\/" data-retour/g, 'href="/" data-retour'],
    [/<script src="\.\.\/commun\/signatures\.js" defer><\/script>\n/, ''],
  ], f);
  if (f === 'artefacts-2050.html') t = remplacer(t, [
    [/\s*<div><dt>Rôle<\/dt><dd><span class="a-completer">[^<]*<\/span><\/dd><\/div>/, ''],
    [/\s*<div><dt>Outils<\/dt><dd><span class="a-completer">[^<]*<\/span><\/dd><\/div>/, ''],
    ['<section class="avec-marge" aria-labelledby="t-question">', '<section aria-labelledby="t-question">'],
    [/<p><span class="a-valider">(Comment faire sentir[^<]*)<\/span><button class="appel"[\s\S]*?à valider\.<\/span> \?/, '<p>$1 ?'],
    [/\s*<p><span class="a-completer">étapes de conception[^<]*<\/span><\/p>/, ''],
    ['<ol class="notes-prospective">', '<ol class="liste-numerotee">'],
  ], f);
  if (f === 'researchrabbit.html') t = remplacer(t, [['<ol class="parties">', '<ol class="liste-numerotee">']], f);
  if (f === 'atlas.html') t = remplacer(t, [
    [/\s*<p class="proto-note">[^<]*<\/p>/, ''],
    ['href="./#travaux"', 'href="/#travaux"'],
  ], f);
  t = liensCommuns(t);
  ecrire(dest.slice(1) + 'index.html', t);
}

/* ---------- Script unique : socle (signatures) + aperçu de l'index + mouvement de la phase 10 ---------- */
let sig = lire('commun/signatures.js');
sig = remplacer(sig, [
  ['// Note de breffage — comportements communs des prototypes (aucune dépendance).', "// Léo Matrat — comportements du site (aucune dépendance). Chargé dans <head> sans « defer » : la classe d'entrée\n// et les écouteurs de View Transitions doivent exister avant le premier rendu ; le reste attend DOMContentLoaded.\n\n/* ===== 1. Socle : sommaire vivant, tiroir, notes reliées, tracés, retour ===== */"],
  [/\/\* ---------- Deux niveaux de lecture[\s\S]*?\n\}\n\n/, ''],
  [/\/\* ---------- Renvois[\s\S]*?\n\}\n\n/, ''],
  [/\/\* ---------- Fiche : le retour ramène au prototype d'origine ---------- \*\/\nfunction retour\(\) \{[\s\S]*?\n\}\n/, `/* ---------- Fiche : « Retour au profil » revient en arrière quand on vient de l'accueil (position et image retrouvées) ---------- */
function retour() {
  if (!document.referrer) return;
  const r = new URL(document.referrer);
  if (r.origin !== location.origin || !/^\\/(index\\.html)?$/.test(r.pathname)) return;
  document.querySelectorAll('[data-retour]').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); history.back(); }));
}

/* ---------- Index des travaux : l'aperçu suit la ligne survolée ou ciblée au clavier ---------- */
function apercuIndex() {
  const lignes = document.querySelectorAll('.index [data-apercu]');
  const figures = document.querySelectorAll('.apercu figure');
  lignes.forEach(a => ['pointerenter', 'focus'].forEach(ev => a.addEventListener(ev, () => {
    lignes.forEach(x => x.toggleAttribute('data-actif', x === a));
    figures.forEach((f, i) => f.classList.toggle('visible', i === +a.dataset.apercu));
  })));
}
`],
  ['sommaireVivant(); tiroir(); notesReliees(); traces(); niveauxDeLecture(); renvois(); retour();', "document.addEventListener('DOMContentLoaded', () => { sommaireVivant(); tiroir(); notesReliees(); traces(); retour(); apercuIndex(); });"],
], 'signatures.js');
let mouvement = lire('v2bis/v2bis.js');
mouvement = remplacer(mouvement, [
  [/^\/\/ V2bis — mouvement propre[\s\S]*?\n\(\(\) => \{/, '/* ===== 2. Mouvement (DESIGN.md § 7) ===== */\n(() => {'],
  ["const accueil = !!document.querySelector('link[href=\"v2bis.css\"]') && /\\/(index\\.html)?$/.test(location.pathname);", "const accueil = /^\\/(index\\.html)?$/.test(location.pathname);"],
  ["const FICHES = ['artefacts-2050.html', 'researchrabbit.html', 'atlas.html'];\n  const fiche = (u) => FICHES.find(f => new URL(u, location.href).pathname.endsWith('/' + f));", "// Une fiche de réalisation : /travaux/<nom>/ ; renvoie son nom.\n  const fiche = (u) => (new URL(u, location.href).pathname.match(/^\\/travaux\\/([a-z0-9-]+)\\/(index\\.html)?$/) || [])[1];"],
  [/v2bis-une/g, 'lm-une'],
  [/v2bis-vt/g, 'lm-vt'],
], 'v2bis.js');
ecrire('assets/site/site.js', sig + '\n' + mouvement);

/* ---------- Icône et règles de publication ---------- */
ecrire('assets/site/icone.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="6" fill="#f5f2ea"/><text x="32" y="47" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="#1e4636">L</text><path d="M14 54c10-2 24 1 36-1" fill="none" stroke="#a63d2a" stroke-width="3" stroke-linecap="round"/></svg>\n');
ecrire('_config.yml', `# Publication GitHub Pages (Jekyll) : seul le site est publié.
# Les chemins commençant par « _ » ou « . » sont déjà ignorés par Jekyll.
# Ne jamais ajouter de .nojekyll ni de workflow Pages sans garder ces exclusions.
# La liste « exclude » remplace celle de Jekyll par défaut : node_modules y figure donc explicitement.
exclude:
  - DESIGN.md
  - README.md
  - Curseur.md
  - docs/
  - tests/
  - scripts/
  - projet_annexe/
  - CV/cvLaTeX.tex
  - CV/cv.png
  - node_modules/
  - package.json
  - package-lock.json
  - PacQC/README.md
  - PacQC/docs/
  - PacQC/tests/
  - PacQC/tests.html
  - PacQC/scripts/
  - PacQC/assets-audit.json
  - projet_session/projet.md
`);
console.log('construction terminée');
