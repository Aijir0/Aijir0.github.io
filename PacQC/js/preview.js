import { actors, directions, sprites } from './manifest.js';
import { loadImages, drawSprite, images } from './assets.js';
import { readSpriteSettings, storageKey } from './sprite-settings.js';

const $ = (id) => document.getElementById(id);
let settings = {}, audit = new Map();
try {
  settings = readSpriteSettings();
} catch { $('storage-status').textContent = 'Stockage local indisponible ou invalide. Les réglages restent utilisables et exportables.'; }

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(settings)); $('storage-status').textContent = 'Réglages enregistrés dans ce navigateur.'; }
  catch { $('storage-status').textContent = 'Enregistrement local impossible. Utilisez l’export des réglages.'; }
}
function option(value, label) { const item = document.createElement('option'); item.value = value; item.textContent = label; return item; }
let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
let clock = 0, last = 0, cadence = 3;
function updatePause() { $('pause').textContent = paused ? 'Reprendre les animations' : 'Mettre en pause'; $('pause').setAttribute('aria-pressed', String(paused)); }
updatePause();
$('pause').onclick = () => { paused = !paused; updatePause(); };
$('speed').oninput = (event) => { cadence = Number(event.target.value); $('speed-value').textContent = `${cadence} poses/s`; };

const cards = actors.map((actor) => {
  const card = document.createElement('article'); card.className = 'card';
  card.innerHTML = '<div class="card-top"><p></p><h3></h3></div><canvas width="280" height="150"></canvas><div class="card-bottom"><p class="filename"></p><p class="card-note"></p></div>';
  card.querySelector('.card-top p').textContent = actor.category;
  card.querySelector('h3').textContent = actor.label;
  card.querySelector('.card-note').textContent = actor.note;
  const canvas = card.querySelector('canvas'); canvas.setAttribute('aria-label', `Aperçu : ${actor.label}`);
  const state = { actor, canvas, direction: actor.directions ? Object.keys(actor.directions)[0] : null, start: 0, step: 0, filename: card.querySelector('.filename') };
  const controls = card.querySelector('.card-bottom');
  if (actor.directions) {
    const label = document.createElement('label'); label.append('Direction');
    const select = document.createElement('select'); select.setAttribute('aria-label', `Direction de ${actor.label}`);
    for (const key of Object.keys(actor.directions)) select.append(option(key, directions[key]));
    select.onchange = () => { state.direction = select.value; state.start = clock; state.step = 0; };
    label.append(select); controls.append(label);
  }
  if (actor.id === 'joueur' || actor.frames?.length > 1) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Pose suivante';
    button.setAttribute('aria-label', `Pose suivante : ${actor.label}`);
    button.onclick = () => { const current = frameIndex(state); paused = true; updatePause(); state.start = clock; state.step = current + 1; };
    controls.append(button); state.button = button;
  }
  $('gallery').append(card); return state;
});
function frames(state) { return state.actor.directions?.[state.direction] || state.actor.frames; }
function frameIndex(state) { return (Math.floor((clock - state.start) * cadence) + state.step) % frames(state).length; }
function currentId(state) { return frames(state)[frameIndex(state)]; }

for (const [id, def] of Object.entries(sprites)) $('sprite-select').append(option(id, def.file));
function updateSettings() {
  const id = $('sprite-select').value;
  const config = settings[id] || sprites[id].display;
  for (const field of ['scale', 'offsetX', 'offsetY']) {
    $(field).value = config[field];
    document.querySelector(`output[for="${field}"]`).textContent = field === 'scale' ? `${Math.round(config[field] * 100)} %` : `${config[field]} px`;
  }
  const image = images.get(id), record = audit.get(sprites[id].file);
  $('sprite-info').textContent = image ? `${image.naturalWidth} × ${image.naturalHeight} px · ${record ? (record.transparentPixels || record.partialPixels ? 'transparence présente' : 'image opaque') : 'audit indisponible'} · repère nominal : 80 px` : 'Image indisponible';
}
$('sprite-select').onchange = updateSettings;
for (const field of ['scale', 'offsetX', 'offsetY']) $(field).oninput = () => {
  const id = $('sprite-select').value;
  settings[id] = { ...(settings[id] || sprites[id].display), [field]: Number($(field).value) };
  save(); updateSettings();
};
$('reset').onclick = () => { delete settings[$('sprite-select').value]; save(); updateSettings(); };
$('export').onclick = () => {
  const result = Object.fromEntries(Object.entries(sprites).map(([id, def]) => [id, settings[id] || def.display]));
  const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'reglages-sprites.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

function surface(canvas) {
  const width = canvas.clientWidth, height = canvas.clientHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  }
  const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const bg = $('background').value;
  ctx.fillStyle = bg === 'light' ? '#e6e9e7' : '#10161b'; ctx.fillRect(0, 0, width, height);
  if (bg === 'grid') {
    ctx.fillStyle = '#1c252d';
    for (let y = 0; y < height; y += 14) for (let x = 0; x < width; x += 14) if ((x / 14 + y / 14) % 2 === 0) ctx.fillRect(x, y, 14, 14);
  }
  return { ctx, width, height, text: bg === 'light' ? '#26313a' : '#a4afb9' };
}
function render(time) {
  if (!paused && !document.hidden && last) clock += Math.min((time - last) / 1000, .1);
  last = time;
  for (const state of cards) {
    const { ctx, width, height } = surface(state.canvas);
    const id = currentId(state);
    drawSprite(ctx, id, width / 2, height / 2, state.actor.id === 'point' ? 28 : 80, settings);
    const filename = sprites[id].file;
    if (state.filename.textContent !== filename) state.filename.textContent = filename;
    if (state.button) state.button.disabled = frames(state).length === 1;
  }
  const stage = surface($('stage'));
  cards.forEach((state, i) => {
    const x = stage.width * (i + .5) / cards.length;
    drawSprite(stage.ctx, currentId(state), x, 82, state.actor.id === 'point' ? 18 : 64, settings);
    stage.ctx.fillStyle = stage.text; stage.ctx.font = '12px Segoe UI, sans-serif'; stage.ctx.textAlign = 'center';
    stage.ctx.fillText(state.actor.label, x, 148);
  });
  const inspector = surface($('inspector'));
  const x = inspector.width / 2, y = inspector.height / 2;
  inspector.ctx.strokeStyle = '#8a9a75'; inspector.ctx.setLineDash([4, 4]); inspector.ctx.strokeRect(x - 40, y - 40, 80, 80); inspector.ctx.setLineDash([]);
  drawSprite(inspector.ctx, $('sprite-select').value, x, y, 80, settings);
  requestAnimationFrame(render);
}

async function showAudit() {
  try {
    const response = await fetch(new URL('../assets-audit.json', import.meta.url));
    if (!response.ok) throw new Error('Audit indisponible');
    const report = await response.json();
    audit = new Map(report.files.map((file) => [file.file, file]));
    const opaque = report.files.filter(file => !file.transparentPixels && !file.partialPixels);
    $('audit-summary').textContent = opaque.length
      ? `${opaque.length} fichiers sont opaques : ${opaque.map(file => file.file).join(', ')}. Leur fond intégré est conservé.`
      : `Les ${report.files.length} fichiers présentent une transparence effective. Les PNG sont affichés sans modification.`;
    for (const def of Object.values(sprites)) {
      const item = audit.get(def.file), row = document.createElement('tr');
      const values = item ? [item.file, `${item.width} × ${item.height}`, item.transparentPixels || item.partialPixels ? `${(item.transparentPixels / (item.width * item.height) * 100).toFixed(1)} % invisibles · alpha partiel : ${item.partialPixels.toLocaleString('fr-CA')} px` : 'Opaque · aucun canal alpha', `${(item.bytes / 1024 / 1024).toFixed(2)} Mio`] : [def.file, 'Non audité', '—', '—'];
      for (const value of values) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }
      $('inventory').append(row);
    }
  } catch { $('inventory').innerHTML = '<tr><td colspan="4">Audit indisponible. Relancez scripts/inspect-assets.ps1.</td></tr>'; }
}
const [, result] = await Promise.all([showAudit(), loadImages((done, total) => { $('status').textContent = `Chargement et décodage : ${done} / ${total}`; })]);
$('status').textContent = `${result.images.size} / ${Object.keys(sprites).length} images chargées · ${result.errors.length ? 'vérifiez les erreurs ci-dessous' : 'prêtes à prévisualiser'}`;
if (result.errors.length) {
  $('errors').hidden = false;
  $('errors').textContent = `Fichiers introuvables ou illisibles : ${result.errors.join(', ')}. Vérifiez les noms et rechargez la page.`;
}
updateSettings(); requestAnimationFrame(render);
