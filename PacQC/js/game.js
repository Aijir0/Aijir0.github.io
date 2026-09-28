import { LEVELS, selectLevel, nextLevel } from './map.js';
import { validateLevels } from './map-validation.js';
import { createMap } from './movement.js';
import { createSession } from './session.js';
import { loadImages } from './assets.js';
import { sprites } from './manifest.js';
import { readSpriteSettings } from './sprite-settings.js';
import { createRenderer } from './renderer.js';
import { mountGame } from './controller.js';

const $ = id => document.getElementById(id);
async function start() {
  try {
    validateLevels(LEVELS);
    const level = selectLevel(window.location.search), levelIndex = LEVELS.indexOf(level);
    $('map-label').textContent = `CARTE 0${levelIndex + 1}`;
    $('map-title').textContent = level.name + '.';
    $('map-description').textContent = level.description;
    $('next-map').href = '?carte=' + nextLevel(level).id;
    $('next-map').textContent = 'Carte suivante : ' + nextLevel(level).name + ' (nouvelle partie)';
    document.title = 'PacQC — ' + level.name;
    document.querySelectorAll('[data-map]').forEach(link => {
      if (link.dataset.map === level.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const map = createMap(level), game = createSession(map);
    let settings = {};
    try { settings = readSpriteSettings(); } catch { /* Valeurs du manifeste si stockage indisponible. */ }
    const result = await loadImages((done, total) => { $('game-status').textContent = 'Chargement des images : ' + done + ' / ' + total; });
    const required = Object.keys(sprites);
    const missing = required.filter(id => !result.images.has(id));
    if (missing.length) throw new Error('Images indispensables introuvables ou illisibles : ' + missing.map(id => sprites[id].file).join(', ') + '. Rechargez après correction.');
    mountGame(game, createRenderer($('game'), map, settings));
  } catch (error) {
    $('game-errors').hidden = false; $('game-errors').textContent = error.message;
    $('game-status').textContent = 'Le jeu ne peut pas démarrer.';
    $('overlay-title').textContent = 'Un fichier à vérifier.';
    $('overlay-text').textContent = 'Consultez le message à côté de la carte, puis rechargez la page.';
  }
}
start();
