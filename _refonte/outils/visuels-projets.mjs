// Visuels de projets (phase 6) : logotype PacQC, avatar pixel, vignettes 1600×840 (ratio 40/21 de la grille).
// Prérequis : serveur local sur le port 8765 et PW = dossier node_modules/playwright (voir SUIVI.md).
// Usage : PW=<…/node_modules/playwright> node _refonte/outils/visuels-projets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const { chromium } = await import(pathToFileURL(path.join(process.env.PW, 'index.mjs')).href);
const ici = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(ici, '../prototypes/medias/projets');
const H = 'http://127.0.0.1:8765';
fs.mkdirSync(OUT, { recursive: true });

/* ---------- Avatar pixel « inspiré de Léo » : cheveux bruns, lunettes rondes, barbe courte, veste marine, chemise bleu clair ----------
   16 × 24 pixels, dessiné à la main. Une lettre = une couleur ; « . » = transparent. */
const AVATAR = [
  '....KKKKKKKK....',
  '...KHHHHHHhHK...',
  '..KHHHhHHHHHHK..',
  '..KHHHHHHHHhHK..',
  '..KHSSHHHSSSHK..',
  '..KSSSSSSSSSSK..',
  '..KSGGSGGSGGSK..',
  '..KGEaGSSGEaGK..',
  '..KSGGSSSSGGSK..',
  '..KsSSSSSSSSsK..',
  '..KsBBSSSSBBsK..',
  '...KBBSKKSBBK...',
  '....KBBBBBBK....',
  '......KssK......',
  '...KJJJCCJJJK...',
  '..KJJJJCCJJJJK..',
  '..KJjJJCCJJjJK..',
  '..KJjJJJJJJjJK..',
  '..KsJJJJJJJJsK..',
  '...KJJJJJJJJK...',
  '....KPPPPPPK....',
  '....KPPKKPPK....',
  '....KPPKKPPK....',
  '...KOOOKKOOOK...',
];
const COULEURS = { K: '#1b1a22', H: '#3a2a20', h: '#5a4232', S: '#e8b28c', s: '#c98d68', G: '#55596a', E: '#141418', a: '#dbe9f3',
  B: '#43302a', J: '#22305a', j: '#18233f', C: '#bcd6ee', P: '#1e2436', O: '#3b2a1e' };
console.assert(AVATAR.every(l => l.length === 16), 'avatar : chaque ligne doit faire 16 pixels');
const avatarSVG = (lignes = AVATAR) => {
  const r = [];
  lignes.forEach((l, y) => [...l].forEach((c, x) => { if (COULEURS[c]) r.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${COULEURS[c]}"/>`); }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 ${lignes.length}" shape-rendering="crispEdges">${r.join('')}</svg>`;
};
fs.writeFileSync(path.join(OUT, 'avatar-leo.svg'), avatarSVG());

/* ---------- PacQC : le personnage dessiné (cercle à bouche ouverte), jamais le visage du jeu ---------- */
const pac = (cx, cy, r, couleur = '#ffd23f', ouverture = 35) => {
  const a = ouverture * Math.PI / 180, x = cx + r * Math.cos(a), y1 = cy - r * Math.sin(a), y2 = cy + r * Math.sin(a);
  return `<path d="M${cx} ${cy}L${x.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 1 0 ${x.toFixed(2)} ${y2.toFixed(2)}Z" fill="${couleur}"/>`;
};
// Logotype : « PA » + le personnage à la place du C + trois pastilles + « QC » (vert anis du jeu).
const logoPacQC = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 120">
  <text x="0" y="96" font-family="Segoe UI, Arial, sans-serif" font-weight="900" font-size="112" letter-spacing="4" fill="#eef2f7">PA</text>
  ${pac(222, 58, 44)}
  <circle cx="290" cy="58" r="7" fill="#f3e27a"/><circle cx="318" cy="58" r="7" fill="#f3e27a"/>
  <text x="340" y="96" font-family="Segoe UI, Arial, sans-serif" font-weight="900" font-size="112" letter-spacing="4" fill="#d9fb81">QC</text>
</svg>`;
fs.writeFileSync(path.join(OUT, 'pacqc-logotype.svg'), logoPacQC);

const fantome = (x, y, t, c) => `<g transform="translate(${x} ${y}) scale(${t})"><path d="M0 22C0 9 9 0 22 0S44 9 44 22V46L37 40 30 46 22 40 14 46 7 40 0 46Z" fill="${c}"/>
  <circle cx="15" cy="20" r="6" fill="#fff"/><circle cx="31" cy="20" r="6" fill="#fff"/><circle cx="17" cy="21" r="3" fill="#101419"/><circle cx="33" cy="21" r="3" fill="#101419"/></g>`;

const b = await chromium.launch({ channel: 'msedge' });
const ctx = await b.newContext({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
const rendre = async (nom, html) => {
  const p = await ctx.newPage(); await p.setViewportSize({ width: 800, height: 420 });
  await p.setContent(`<!doctype html><style>*{box-sizing:border-box}body{margin:0;width:800px;height:420px;overflow:hidden}svg{display:block}</style>${html}`);
  await p.waitForLoadState('networkidle'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
  await p.screenshot({ path: path.join(OUT, nom), ...(nom.endsWith('.jpg') ? { type: 'jpeg', quality: 88 } : {}) }); await p.close();
};

// Plan réel d'une carte PacQC, joueur masqué (fond de la piste 3).
const page = await ctx.newPage();
const vide = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
await page.route(/PacQC\/assets\/(face|front|dos|droite|gauche|ennemi)\w*\.png/, r => r.fulfill({ contentType: 'image/png', body: vide }));
await page.goto(`${H}/PacQC/?carte=bureau`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
await page.evaluate(() => { document.getElementById('game-overlay').style.display = 'none'; });
const plan = 'data:image/png;base64,' + (await page.locator('#game').screenshot()).toString('base64');
await page.close();

const fondPac = '#101419';
// PacQC 1 — logotype seul : le C du nom devient le personnage
await rendre('pacqc-1-logotype.png', `<div style="width:800px;height:420px;background:${fondPac};display:grid;place-items:center">
  <div style="width:520px">${logoPacQC}</div></div>`);
// PacQC 2 — un couloir de labyrinthe : le personnage, les pastilles, un fantôme vert anis
await rendre('pacqc-2-couloir.png', `<div style="width:800px;height:420px;background:${fondPac}"><svg viewBox="0 0 800 420" width="800" height="420">
  <g fill="none" stroke="#3b82f6" stroke-width="3"><rect x="40" y="120" width="720" height="180" rx="22"/><rect x="58" y="138" width="684" height="144" rx="12"/></g>
  <g fill="none" stroke="#3b82f6" stroke-width="3" opacity=".35"><rect x="40" y="24" width="300" height="70" rx="14"/><rect x="380" y="24" width="380" height="70" rx="14"/><rect x="40" y="326" width="420" height="70" rx="14"/><rect x="500" y="326" width="260" height="70" rx="14"/></g>
  ${[0,1,2,3,4,5,6].map(i => `<circle cx="${340 + i * 52}" cy="210" r="7" fill="#f3e27a"/>`).join('')}<circle cx="704" cy="210" r="15" fill="#f3e27a"/>
  ${pac(268, 210, 46)}${fantome(98, 178, 1.45, '#d9fb81')}
  <g transform="translate(62 46) scale(.42)">${logoPacQC.replace(/<\/?svg[^>]*>/g, '')}</g></svg></div>`);
// PacQC 3 — le logotype posé sur le plan réel du jeu, assombri
await rendre('pacqc-3-plan.png', `<div style="position:relative;width:800px;height:420px;background:${fondPac} url(${plan}) center 40% / 800px auto no-repeat">
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,#101419f0,#101419b8 60%,#10141980)"></div>
  <div style="position:absolute;left:64px;top:50%;transform:translateY(-50%);width:440px">${logoPacQC}
  <p style="margin:22px 0 0;font:600 17px 'Segoe UI',sans-serif;letter-spacing:.5px;color:#a4afb9">Trois cartes · tracés validés automatiquement</p></div></div>`);

/* ---------- Scène Pixel Art : l'avatar, à une échelle de pixel constante ---------- */
const silk = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap">';
const titre = (t, sous, fond = '#1a1c1a', ombre = '#5a9a3c') => `<div style="background:${fond};color:#f5f2ea;padding:16px 20px 14px;box-shadow:6px 6px 0 ${ombre};font:400 34px/1 Silkscreen">${t}<div style="font:400 12px/1 Silkscreen;margin-top:10px;color:#e6d3a8">${sous}</div></div>`;
const avatarImg = (h, extra = '') => `<img src="data:image/svg+xml,${encodeURIComponent(avatarSVG())}" style="height:${h}px;image-rendering:pixelated;${extra}">`;
// Carreau isométrique en escalier de pixels (même échelle que l'avatar)
const carreau = (u) => { const r = []; for (let i = 0; i < 8; i++) { const w = (i < 4 ? i + 1 : 8 - i) * 4; r.push(`<rect x="${(16 - w) / 2 * u}" y="${i * u}" width="${w * u}" height="${u}" fill="${i < 4 ? '#6fae46' : '#5a9a3c'}"/>`); } return `<svg width="${16 * u}" height="${8 * u}" shape-rendering="crispEdges">${r.join('')}</svg>`; };
// Scène 1 — carte de personnage : l'avatar sur son carreau, le titre en lettres pixel
await rendre('scene-1-carte.png', `${silk}<div style="width:800px;height:420px;background:#e9dcbf;background-image:linear-gradient(#e2d2b0 2px,transparent 2px),linear-gradient(90deg,#e2d2b0 2px,transparent 2px);background-size:32px 32px;display:flex;align-items:center;justify-content:space-between;padding:0 92px 0 72px">
  ${titre('SCÈNE<br>PIXEL ART', 'QUÉBEC · EN CHANTIER')}
  <div style="display:grid;justify-items:center">${avatarImg(240, 'position:relative;z-index:1;margin-bottom:-22px')}${carreau(10)}</div></div>`);
// Scène 2 — dans la scène : décor flouté et assombri, avatar net au premier plan
await rendre('scene-2-scene.jpg', `${silk}<div style="position:relative;width:800px;height:420px;overflow:hidden">
  <div style="position:absolute;inset:-12px;background:url(${H}/jeu/imagesjeu/Fond.png) -80px -40px / 1500px auto no-repeat;filter:blur(2.5px) brightness(.72) saturate(.9)"></div>
  <div style="position:absolute;right:120px;bottom:34px">${avatarImg(264, 'filter:drop-shadow(0 6px 0 #00000055)')}</div>
  <div style="position:absolute;left:36px;bottom:36px">${titre('SCÈNE<br>PIXEL ART', 'QUÉBEC · EN CHANTIER', '#1a1c1a', '#a63d2a')}</div></div>`);
// Scène 3 — pastille : le buste de l'avatar dans un cadre pixel, utilisable comme logo
const buste = avatarSVG(AVATAR.slice(0, 17));
await rendre('scene-3-pastille.png', `${silk}<div style="width:800px;height:420px;background:#1a1c1a;display:flex;align-items:center;justify-content:center;gap:48px">
  <div style="background:#5a9a3c;padding:18px 18px 0;box-shadow:inset 0 0 0 6px #6fae46,8px 8px 0 #e6d3a8"><img src="data:image/svg+xml,${encodeURIComponent(buste)}" style="display:block;height:204px;image-rendering:pixelated"></div>
  <div style="color:#f5f2ea;font:400 44px/1.05 Silkscreen">SCÈNE<br>PIXEL ART<div style="font:400 14px/1 Silkscreen;margin-top:14px;color:#e6d3a8">QUÉBEC · EN CHANTIER</div></div></div>`);
/* ---------- ResearchRabbit : présentation universitaire (LaTeX Beamer), pas une application ---------- */
// 1. La vignette fournie par Léo (racine du dépôt), convertie en JPEG léger ; l'original n'est pas modifié.
{
  const p = await (await b.newContext({ viewport: { width: 1672, height: 941 } })).newPage();
  await p.goto(`${H}/_refonte/`); await p.setContent(`<body style="margin:0"><img src="${H}/vignette-researchrabbit.png" style="display:block;width:1672px;height:941px">`);
  await p.waitForLoadState('networkidle');
  await p.screenshot({ path: path.join(OUT, 'researchrabbit-vignette.jpg'), type: 'jpeg', quality: 84 });
  await p.close();
}
// 2. La vraie première page du PDF, posée comme un document sur le papier du site, la page « Plan » en dessous.
{
  const p = await ctx.newPage(); await p.setViewportSize({ width: 800, height: 420 });
  await p.goto(`${H}/_refonte/`);
  await p.setContent('<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>');
  await p.waitForFunction(() => window.pdfjsLib);
  const pages = await p.evaluate(async (url) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    const doc = await pdfjsLib.getDocument(url).promise, out = [];
    for (const n of [1, 2]) {
      const pg = await doc.getPage(n), v = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: 1200 / v.width });
      const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
      await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise; out.push(c.toDataURL('image/jpeg', .92));
    }
    return out;
  }, `${H}/presentation/rabb2.pdf`);
  const diapo = (src, css) => `<img src="${src}" style="position:absolute;width:520px;height:292.5px;outline:1px solid #d9d3c4;box-shadow:0 1px 0 #d9d3c4,0 14px 28px -18px #1a1c1a59;${css}">`;
  await p.setContent(`<!doctype html><style>body{margin:0;width:800px;height:420px;overflow:hidden;background:#ece7da}</style>
    <div style="position:relative;width:800px;height:420px">${diapo(pages[1], 'left:196px;top:38px')}${diapo(pages[0], 'left:150px;top:72px')}</div>`);
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(OUT, 'researchrabbit-document.jpg'), type: 'jpeg', quality: 86 });
  await p.close();
}
await b.close();
for (const f of fs.readdirSync(OUT)) console.log(f.padEnd(24), Math.round(fs.statSync(path.join(OUT, f)).size / 1024), 'Ko');
