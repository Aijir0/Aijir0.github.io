// Visuels de la phase 7 : pixel art de PacQC et de la Scène Pixel Art (grille de pixels constante dans chaque image),
// globe d'Atlas (vraies côtes, projection orthographique), portrait recadré. Les originaux ne sont jamais modifiés.
// Prérequis : serveur local sur le port 8765 et PW = dossier node_modules/playwright (voir SUIVI.md).
// Usage : PW=<…/node_modules/playwright> node _refonte/outils/visuels-phase7.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const { chromium } = await import(pathToFileURL(path.join(process.env.PW, 'index.mjs')).href);
const ici = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(ici, '../prototypes/medias/projets');
const MEDIAS = path.resolve(ici, '../prototypes/medias');
const H = 'http://127.0.0.1:8765';

/* ---------- Toile de pixels : chaque image est dessinée en basse définition, puis agrandie d'un facteur entier ---------- */
class Toile {
  constructor(w, h, fond = null) { this.w = w; this.h = h; this.px = new Array(w * h).fill(fond); }
  set(x, y, c) { if (c && x >= 0 && y >= 0 && x < this.w && y < this.h) this.px[y * this.w + x] = c; }
  get(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.px[y * this.w + x] : null; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c); }
  carte(lignes, pal, x, y) { lignes.forEach((l, j) => [...l].forEach((ch, i) => this.set(x + i, y + j, pal[ch]))); }
  // Contour d'un pixel (4 voisins) : arrondit la silhouette, lisible sur fond clair.
  contour(lignes, x, y, c) {
    const plein = (i, j) => (lignes[j]?.[i] ?? '.') !== '.';
    for (let j = -1; j <= lignes.length; j++) for (let i = -1; i <= lignes[0].length; i++)
      if (!plein(i, j) && (plein(i + 1, j) || plein(i - 1, j) || plein(i, j + 1) || plein(i, j - 1))) this.set(x + i, y + j, c);
  }
  svg() {
    const r = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w;) {
      const c = this.px[y * this.w + x]; let n = 1;
      while (x + n < this.w && this.px[y * this.w + x + n] === c) n++;
      if (c) r.push(`<rect x="${x}" y="${y}" width="${n}" height="1" fill="${c}"/>`);
      x += n;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" shape-rendering="crispEdges">${r.join('')}</svg>`;
  }
}
const verifier = (nom, lignes) => lignes.forEach((l, i) => console.assert(l.length === lignes[0].length, `${nom} : ligne ${i} de ${l.length} pixels`));

/* ---------- Police bitmap grasse (fût de 2 pixels, capitales de 7 lignes), dessinée pour ces logos ---------- */
const G = (dy, ...l) => ({ dy, l });
const POLICE = {
  P: G(0, '#####.', '##..##', '##..##', '#####.', '##....', '##....', '##....'),
  a: G(2, '.####.', '....##', '.#####', '##..##', '.#####'),
  c: G(2, '.####', '##...', '##...', '##...', '.####'),
  Q: G(0, '.#####.', '##...##', '##...##', '##...##', '##...##', '##...##', '.#####.', '....###'),
  C: G(0, '.#####', '##....', '##....', '##....', '##....', '##....', '.#####'),
  S: G(0, '.#####', '##....', '##....', '.####.', '....##', '....##', '#####.'),
  E: G(0, '#####', '##...', '##...', '####.', '##...', '##...', '#####'),
  'È': G(-2, '.##..', '..##.', '#####', '##...', '##...', '####.', '##...', '##...', '#####'),
  N: G(0, '##...##', '###..##', '####.##', '##.####', '##..###', '##...##', '##...##'),
  I: G(0, '##', '##', '##', '##', '##', '##', '##'),
  X: G(0, '##...##', '##...##', '.##.##.', '..###..', '.##.##.', '##...##', '##...##'),
  L: G(0, '##...', '##...', '##...', '##...', '##...', '##...', '#####'),
  A: G(0, '.####.', '##..##', '##..##', '######', '##..##', '##..##', '##..##'),
  R: G(0, '#####.', '##..##', '##..##', '#####.', '##.##.', '##..##', '##..##'),
  T: G(0, '######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..'),
  ' ': G(0, '...'),
};
for (const [k, g] of Object.entries(POLICE)) verifier(`glyphe ${k}`, g.l);
const largeur = (t, s = 1) => [...t].reduce((n, ch, i) => n + (POLICE[ch].l[0].length + (i ? 1 : 0)) * s, 0);
// couleurs : une couleur, ou une fonction (index du caractère) → couleur
function texte(toile, t, x, y, couleur, s = 1) {
  let cx = x;
  [...t].forEach((ch, i) => {
    const g = POLICE[ch], c = typeof couleur === 'function' ? couleur(i) : couleur;
    g.l.forEach((l, j) => [...l].forEach((p, k) => { if (p === '#') toile.rect(cx + k * s, y + (g.dy + j) * s, s, s, c); }));
    cx += (g.l[0].length + 1) * s;
  });
  return cx - s;
}

/* ---------- PacQC : personnage original (œil, ombré en deux tons), jamais le visage du jeu ---------- */
const PAC = [
  '....YYYYY....',
  '..YYYYYYYYY..',
  '.YYLLYYYYYYY.',
  '.YLYYYYeYYY..',
  'YYYYYYYYY....',
  'YYYYYYYY.....',
  'YYYYYYY......',
  'YYYYYYYY.....',
  'YYYYYYYYY....',
  '.YYYYYYYYYy..',
  '.yYYYYYYYYyy.',
  '..yyYYYYyyy..',
  '....yyyyy....',
];
// Tuque (bonnet québécois) tricotée à rayures, pompon rouge ; les deux dernières lignes (revers côtelé) chevauchent le haut de la tête.
const TUQUE = [
  '.....RRr.....',
  '....RRRRr....',
  '...nnnnnnN...',
  '..WWWWWWWWW..',
  '.RRRRRRRRRRr.',
  '.nnnnnnnnnnn.',
  '.nNnNnNnNnNn.',
];
verifier('PAC', PAC); verifier('TUQUE', TUQUE);
const PAL_PAC = { Y: '#ffcf3a', y: '#e3a01b', L: '#fff1ad', e: '#101419', R: '#d8432f', r: '#a83222', W: '#f3ede0', n: '#22305a', N: '#33467d' };
const avecTuque = (() => { const l = [...TUQUE.slice(0, 5)]; PAC.forEach((p, j) => l.push(j < 2 ? [...p].map((c, i) => TUQUE[5 + j][i] !== '.' ? TUQUE[5 + j][i] : c).join('') : p)); return l; })();

const NUIT = '#101419', ANIS = '#d9fb81', CREME = '#eef2f7', PASTILLE = '#f3e27a', BLEU = '#3b6fe0', BLEU_SOMBRE = '#1d3a8a';
const couleursNom = (pac, qc) => (i) => (i < 3 ? pac : qc);

// Cadre de borne : filet aux coins arrondis
function cadre(t, m, c) { t.rect(m + 1, m, t.w - 2 * m - 2, 1, c); t.rect(m + 1, t.h - m - 1, t.w - 2 * m - 2, 1, c); t.rect(m, m + 1, 1, t.h - 2 * m - 2, c); t.rect(t.w - m - 1, m + 1, 1, t.h - 2 * m - 2, c); }

const pac1 = () => { // 1. Borne : le personnage avale une ligne de pastilles jusqu'au nom
  const t = new Toile(80, 42, NUIT);
  cadre(t, 3, BLEU_SOMBRE);
  t.carte(PAC, PAL_PAC, 11, 14);
  for (const x of [26, 29]) t.set(x, 20, PASTILLE);
  texte(t, 'PacQC', 33, 17, couleursNom(CREME, ANIS));
  return t;
};
const pac2 = () => { // 2. Mascotte : le personnage en tuque, le nom dessous
  const t = new Toile(80, 42, ANIS);
  const x = 33, y = 5;
  t.contour(avecTuque, x, y, NUIT); t.carte(avecTuque, PAL_PAC, x, y);
  const w = largeur('PacQC'); texte(t, 'PacQC', Math.round((80 - w) / 2), 28, NUIT);
  return t;
};
const pac3 = () => { // 3. Labyrinthe : le nom tracé comme des murs de labyrinthe, le personnage dans le couloir
  const t = new Toile(160, 84, NUIT), m = new Toile(160, 84);
  const s = 3, w = largeur('PacQC', s), x0 = Math.round((160 - w) / 2), y0 = 17;
  texte(m, 'PacQC', x0, y0, (i) => (i < 3 ? 'p' : 'q'), s);
  const vide = (x, y) => !m.get(x, y);
  for (let y = 0; y < 84; y++) for (let x = 0; x < 160; x++) {
    const v = m.get(x, y); if (!v) continue;
    const h = vide(x - 1, y) || vide(x + 1, y), vv = vide(x, y - 1) || vide(x, y + 1);
    if (h && vv) continue;                                 // coin retiré : angle arrondi
    if (h || vv) t.set(x, y, v === 'p' ? BLEU : ANIS);
  }
  const cy = 58;
  t.rect(12, cy - 9, 136, 1, BLEU); t.rect(12, cy + 9, 136, 1, BLEU);
  t.set(11, cy - 8, BLEU); t.set(11, cy + 8, BLEU); t.set(148, cy - 8, BLEU); t.set(148, cy + 8, BLEU);
  t.rect(10, cy - 7, 1, 15, BLEU); t.rect(149, cy - 7, 1, 15, BLEU);
  t.carte(PAC, PAL_PAC, 28, cy - 6);
  for (let x = 46; x <= 136; x += 6) t.set(x, cy, PASTILLE);
  t.rect(141, cy - 1, 3, 3, PASTILLE);
  return t;
};

/* ---------- Scène Pixel Art : avatar d'après le portrait professionnel (images/port1.jpg) ----------
   Cheveux châtain foncé coiffés en volume, lunettes rondes à monture sombre, moustache et barbiche auburn,
   costume marine, chemise bleu clair sans cravate. 20 × 32 pixels, contour sélectif (teinte sombre de chaque matière). */
const AVATAR = [
  '.......DDDDDD.......',
  '.....DDHHHHHHDD.....',
  '....DHHhhHHHHHHD....',
  '...DHHhhHHHHHHHHD...',
  '...DHHHHHHHHHHHHD...',
  '...DHHHHHHHHSSHHD...',
  '...DHHHHHSSSSSSHD...',
  '...DHSbbSSSSbbSSD...',
  '...oSSGGSSSSGGSSo...',
  '...oSGSwGGGGSwGSo...',
  '...oSGESGSSGESGSo...',
  '...oSSGGSSSSGGSSo...',
  '...osSSSSssSSSSso...',
  '...osSSBBBBBBSSso...',
  '....osSSSmmSSSso....',
  '.....oSSBBBBSSo.....',
  '......obBBBBbo......',
  '......jCCssCCj......',
  '...jJJJJnCCnJJJJj...',
  '..jJJJJJnCCnJJJJJj..',
  '..jJjJJJnCCnJJJjJj..',
  '..jJjJJJnCCnJJJjJj..',
  '..jJjJJJJnnJJJJjJj..',
  '..jJjJJJJJJJJJJjJj..',
  '..oSjJJJJJJJJJJjSo..',
  '...jjJJJJJJJJJJjj...',
  '......jPPPPPPj......',
  '......jPPjjPPj......',
  '......jPPjjPPj......',
  '......jPPjjPPj......',
  '.....OOOO..OOOO.....',
  '.....qqqq..qqqq.....',
];
verifier('AVATAR', AVATAR);
const PAL_AVATAR = {
  D: '#2a1a10', H: '#4a2f1d', h: '#6e4c31', S: '#f2c7a5', s: '#dda184', o: '#a8664c', b: '#3a2416',
  G: '#3b3238', E: '#1d1d24', w: '#eaf3f8', B: '#8a5634', m: '#c0705e',
  C: '#d6e6f5', J: '#26325e', j: '#161d38', n: '#3a4a82', P: '#1d2440', O: '#3a2618', q: '#1a120c',
};

// Losange isométrique 2:1 (bords en escalier de 2 pixels pour 1)
const dansLosange = (x, y, cx, cy, r) => { const dx = x - cx + .5, dy = y - cy + .5; return Math.abs(dx) / 2 + Math.abs(dy) <= r; };
function losange(t, cx, cy, r, couleur) {
  for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - 2 * r); x <= cx + 2 * r; x++)
    if (dansLosange(x, y, cx, cy, r)) t.set(x, y, typeof couleur === 'function' ? couleur(x, y) : couleur);
}
function socle(t, cx, cy, r, ep, gauche, droite, dessus) { // un bloc : faces latérales puis dessus
  for (let k = ep; k >= 1; k--) losange(t, cx, cy + k, r, (x) => (x < cx ? gauche : droite));
  losange(t, cx, cy, r, dessus);
}
const ARBRE = [
  '...dGGGd...',
  '..GGllGGd..',
  '.GllllGGGd.',
  '.GlllGGGGd.',
  'dGGlGGGGGdd',
  'dGGGGGGGGdd',
  '.dGGGGGGdd.',
  '..ddGGddd..',
  '....dTd....',
  '....TTt....',
  '....TTt....',
  '...ttTtt...',
];
const PAL_ARBRE = { G: '#4f8a3a', l: '#78b552', d: '#2f5e25', T: '#7a5332', t: '#563821' };
const BANC = ['.KKKKKKK.', '.WWWWWWW.', 'KWWWWWWWK', '.K.....K.', '.K.....K.'];
const PAL_BANC = { K: '#3b2a1e', W: '#9a6838' };
const LAMPADAIRE = ['.y.', 'yYy', '.k.', '.k.', '.k.', '.k.', '.k.', '.k.', '.k.', '.k.', '.k.', 'kkk'];
const PAL_LAMPE = { y: '#e7c45a', Y: '#fff1ad', k: '#2b2f36' };
[['ARBRE', ARBRE], ['BANC', BANC], ['LAMPADAIRE', LAMPADAIRE]].forEach(([n, l]) => verifier(n, l));

function pavillon(t, cx, by, r, haut) { // bâtiment à toit plat, fenêtres en bandeaux
  for (let k = haut; k >= 0; k--) losange(t, cx, by - k, r, (x, y) => {
    const gauche = x < cx, base = gauche ? '#d9c39b' : '#bfa67c';
    const etage = k % 7 >= 2 && k % 7 <= 4 && k < haut - 1;
    const colonne = gauche ? ((cx - x) % 6 >= 2 && (cx - x) % 6 <= 4) : ((x - cx) % 6 >= 2 && (x - cx) % 6 <= 4);
    return etage && colonne ? (gauche ? '#3e5872' : '#2f455c') : base;
  });
  losange(t, cx, by - haut - 1, r, '#8c7c66');
  losange(t, cx, by - haut - 1, r - 1.5, '#a39279');
}

function scene1() { // 1. Le personnage seul, au centre, sur son carreau
  const t = new Toile(80, 42, '#e6dcc6');
  for (let y = 0; y < 42; y++) for (let x = 0; x < 80; x++) if ((x + y) % 2 === 0 && y > 30) t.set(x, y, '#dfd3b9');
  t.rect(0, 31, 80, 11, '#dfd3b9');
  losange(t, 40, 37, 4.5, '#6fae46'); losange(t, 40, 38, 4.5, (x) => (x < 40 ? '#5a9a3c' : '#4b8431')); losange(t, 40, 37, 4.5, '#6fae46');
  t.carte(AVATAR, PAL_AVATAR, 30, 6);
  return t;
}
function scene2() { // 2. Une petite place isométrique : pavillon, arbres, banc, lampadaire, et le personnage
  const t = new Toile(160, 84, '#cfe1e6');
  t.rect(0, 0, 160, 10, '#bcd6de');
  const cx = 80, cy = 50, r = 26;
  socle(t, cx, cy, r, 5, '#8a6a45', '#6f5436', (x, y) => {
    const dx = x - cx + .5, dy = y - cy + .5, u = dx / 2 + dy, v = dy - dx / 2;
    if (Math.max(Math.abs(u), Math.abs(v)) > r - 4) return ((x + y) % 3 ? '#6fae46' : '#5f9c3c');
    return (Math.floor((u + r) / 5) + Math.floor((v + r) / 5)) % 2 ? '#dcc79e' : '#cfb88b';
  });
  pavillon(t, 72, 45, 13, 29);
  t.carte(ARBRE, PAL_ARBRE, 105, 35);
  t.carte(ARBRE, PAL_ARBRE, 117, 43);
  t.carte(LAMPADAIRE, PAL_LAMPE, 63, 47);
  t.carte(BANC, PAL_BANC, 100, 54);
  t.carte(AVATAR, PAL_AVATAR, 82, 27);
  return t;
}
function scene3() { // 3. Le personnage et le titre en lettres pixel
  const t = new Toile(120, 63, '#1a1c1a');
  const gauche = 10;
  texte(t, 'SCÈNE', gauche + 1, 22, '#a63d2a'); texte(t, 'SCÈNE', gauche, 21, '#f5f2ea');
  texte(t, 'PIXEL ART', gauche + 1, 33, '#a63d2a'); texte(t, 'PIXEL ART', gauche, 32, '#e6d3a8');
  t.rect(78, 50, 34, 2, '#2f4a35'); t.rect(80, 52, 30, 1, '#243a29');
  t.carte(AVATAR, PAL_AVATAR, 85, 19);
  return t;
}

/* ---------- Rendu : la toile en SVG, agrandie d'un facteur entier, sans lissage ---------- */
const b = await chromium.launch({ channel: 'msedge' });
const page = await b.newPage();
await page.goto(`${H}/_refonte/`);
async function exporter(nom, t, k) {
  const W = t.w * k, Ht = t.h * k;
  await page.setViewportSize({ width: W, height: Ht });
  await page.setContent(`<body style="margin:0"><img style="display:block;width:${W}px;height:${Ht}px" src="data:image/svg+xml,${encodeURIComponent(t.svg())}">`);
  await page.waitForFunction(() => document.images[0].complete);
  await page.screenshot({ path: path.join(OUT, nom) });
}
const sorties = [
  ['p7-pacqc-1-borne.png', pac1(), 20], ['p7-pacqc-2-tuque.png', pac2(), 20], ['p7-pacqc-3-labyrinthe.png', pac3(), 10],
  ['p7-scene-1-personnage.png', scene1(), 20], ['p7-scene-2-place.png', scene2(), 10], ['p7-scene-3-titre.png', scene3(), 13],
];
for (const [nom, t, k] of sorties) await exporter(nom, t, k);
// Logos vectoriels (pixels exacts, aucune police) et avatar seul
fs.writeFileSync(path.join(OUT, 'p7-pacqc-logo-1.svg'), (() => { const t = new Toile(53, 15); t.carte(PAC, PAL_PAC, 0, 1); t.set(15, 7, PASTILLE); t.set(18, 7, PASTILLE); texte(t, 'PacQC', 22, 5, BLEU_SOMBRE); texte(t, 'PacQC', 21, 4, couleursNom(CREME, ANIS)); return t.svg(); })());
fs.writeFileSync(path.join(OUT, 'p7-pacqc-logo-2.svg'), (() => { const t = new Toile(36, 32); t.contour(avecTuque, 11, 1, NUIT); t.carte(avecTuque, PAL_PAC, 11, 1); texte(t, 'PacQC', 1, 23, NUIT); return t.svg(); })());
fs.writeFileSync(path.join(OUT, 'p7-avatar-leo.svg'), (() => { const t = new Toile(20, 32); t.carte(AVATAR, PAL_AVATAR, 0, 0); return t.svg(); })());

/* ---------- Atlas : globe orthographique, côtes réelles (Natural Earth 1:110 M via world-atlas), centré sur l'Atlantique nord ---------- */
const QUEBEC = [-71.2080, 46.8139];
await page.setViewportSize({ width: 400, height: 400 });
await page.setContent(`<script src="https://cdn.jsdelivr.net/npm/d3-array@3.2.4/dist/d3-array.min.js"></script><script src="https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/dist/d3-geo.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js"></script>`);
await page.waitForFunction(() => window.d3?.geoOrthographic && window.topojson);
const globe = await page.evaluate(async (quebec) => {
  const monde = await (await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json')).json();
  const proj = d3.geoOrthographic().rotate([42, -32]).scale(31).translate([0, 0]).clipAngle(90).precision(.8);
  const chemin = d3.geoPath(proj).digits(1);
  return { terres: chemin(topojson.feature(monde, monde.objects.land)), graticule: chemin(d3.geoGraticule().step([15, 15])()), quebec: proj(quebec).map(v => +v.toFixed(2)) };
}, QUEBEC);
const [qx, qy] = globe.quebec;
const globeSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-34 -34 68 68">
<circle r="31" fill="#f5f2ea"/><path d="${globe.graticule}" fill="none" stroke="#1e4636" stroke-opacity=".28" stroke-width=".35"/>
<path d="${globe.terres}" fill="#1e4636" fill-opacity=".85"/>
<circle r="31" fill="none" stroke="#1e4636" stroke-width=".9"/>
<circle cx="${qx}" cy="${qy}" r="3.4" fill="none" stroke="#a63d2a" stroke-width=".6"/><circle cx="${qx}" cy="${qy}" r="1.6" fill="#a63d2a"/>
</svg>`;
fs.writeFileSync(path.join(OUT, 'p7-atlas-globe.svg'), globeSVG);

// Vignette d'Atlas : page de carnet (papier pointé), globe, repère de Québec et ses coordonnées
await page.setViewportSize({ width: 800, height: 420 });
await page.setContent(`<!doctype html><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@500&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap">
<style>body{margin:0;width:800px;height:420px;overflow:hidden;position:relative;background:#ece7da radial-gradient(circle,#cfc7b4 1px,transparent 1.2px) 10px 10px/20px 20px}
.k{position:absolute;left:64px;top:126px;font:500 17px 'Atkinson Hyperlegible Next';color:#1e4636}
.t{position:absolute;left:58px;top:156px;font:italic 400 118px/1 Newsreader;color:#1a1c1a;letter-spacing:-.02em}
.g{position:absolute;left:432px;top:30px;width:360px;height:360px}
.q{position:absolute;font:italic 400 15px Newsreader;color:#a63d2a;white-space:nowrap}
.f{position:absolute;height:1px;background:#a63d2a}</style>
<div class="k">Hors-série · en chantier</div><div class="t">Atlas</div>
<img class="g" src="data:image/svg+xml,${encodeURIComponent(globeSVG)}">
<div class="f" style="left:416px;top:${30 + (qy + 34) * 360 / 68}px;width:${432 + (qx + 34) * 360 / 68 - 420}px"></div>
<div class="q" style="right:390px;top:${30 + (qy + 34) * 360 / 68 - 10}px">Québec</div>`);
await page.waitForLoadState('networkidle'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
await page.setViewportSize({ width: 800, height: 420 });
{ const c = await b.newContext({ viewport: { width: 800, height: 420 }, deviceScaleFactor: 2 }); const p = await c.newPage();
  await p.setContent(await page.content()); await p.waitForLoadState('networkidle'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(OUT, 'p7-atlas-vignette.jpg'), type: 'jpeg', quality: 86 }); // Variante sans texte pour la fiche Atlas (le titre est déjà au-dessus) : le globe recentré
  await p.evaluate(() => { document.querySelectorAll('.k,.t').forEach(e => e.remove()); document.body.style.transform = 'translateX(-190px)'; document.body.style.background = 'none'; document.documentElement.style.background = '#ece7da radial-gradient(circle,#cfc7b4 1px,transparent 1.2px) 10px 10px/20px 20px'; });
  await p.screenshot({ path: path.join(OUT, 'p7-atlas-carte.jpg'), type: 'jpeg', quality: 86 }); await c.close(); }

/* ---------- Portrait : recadrage buste 4:5 de images/port1.jpg (l'original reste intact) ---------- */
await page.setContent(`<img src="${H}/images/port1.jpg">`);
await page.waitForFunction(() => document.images[0].complete);
const portrait = await page.evaluate(() => {
  const i = document.images[0], c = document.createElement('canvas'); c.width = 480; c.height = 600;
  c.getContext('2d').drawImage(i, 92, 40, 496, 620, 0, 0, 480, 600);
  return c.toDataURL('image/jpeg', .85).split(',')[1];
});
fs.writeFileSync(path.join(MEDIAS, 'portrait-leo.jpg'), Buffer.from(portrait, 'base64'));

await b.close();
for (const f of fs.readdirSync(OUT).filter(f => f.startsWith('p7-'))) console.log(f.padEnd(28), Math.round(fs.statSync(path.join(OUT, f)).size / 1024), 'Ko');
console.log('portrait-leo.jpg'.padEnd(28), Math.round(fs.statSync(path.join(MEDIAS, 'portrait-leo.jpg')).size / 1024), 'Ko');
