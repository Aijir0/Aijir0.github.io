import { directionForKey } from './movement.js';
import { STATES, startSession, pauseSession, resumeSession, restartSession, steerSession, updateSession } from './session.js';

// Une seule installation par page ; recommencer ne crée ni RAF ni écouteur.
export function mountGame(game, renderer, doc = document, win = window) {
  const $ = id => doc.getElementById(id), canvas = $('game');
  let previousTime = null, frameId, disposed = false;
  const bindings = [];
  function on(target, type, listener) { target.addEventListener(type, listener); bindings.push([target, type, listener]); }
  const text = (id, value) => { if ($(id).textContent !== value) $(id).textContent = value; };
  function sync() {
    $('score').value = String(game.score).padStart(4, '0');
    $('remaining').value = game.remaining.size; $('lives').value = game.lives;
    for (const type of ['beer', 'coffee']) {
      const time = game.effects[type];
      $(`${type}-effect`).hidden = time <= 0;
      text(`${type}-time`, `${(Math.ceil(time * 10) / 10).toFixed(1).replace('.', ',')} s`);
      $(`${type}-bar`).max = game.rules.bonuses[type].duration; $(`${type}-bar`).value = time;
    }
    $('effects-empty').hidden = game.effects.beer > 0 || game.effects.coffee > 0;
    text('bonus-message', game.bonusMessage);
    const running = [STATES.PLAY, STATES.COUNTDOWN].includes(game.phase);
    $('play').disabled = ![STATES.HOME, STATES.PAUSE].includes(game.phase);
    text('play', game.phase === STATES.HOME ? 'Démarrer' : 'Reprendre');
    $('pause').disabled = !running; $('restart').disabled = false;
    $('game-overlay').hidden = game.phase === STATES.PLAY;
    if ($('next-map')) $('next-map').hidden = game.phase !== STATES.WON;
    const views = {
      [STATES.HOME]: ['À VOUS DE JOUER', `${game.rules.lives} vies. Un défi.`, `Bière : fantômes à manger pendant ${game.rules.bonuses.beer.duration} s. Café : vitesse +${Math.round((game.rules.bonuses.coffee.speedMultiplier - 1) * 100)} % pendant ${game.rules.bonuses.coffee.duration} s. Ces bonus sont facultatifs et cumulables.`, 'Prêt. Cliquez sur Démarrer.'],
      [STATES.COUNTDOWN]: [game.notice.toUpperCase(), String(Math.max(1, Math.ceil(game.countdown))), 'Choisissez déjà votre direction. Les fantômes attendent le départ.', `${game.notice} dans ${Math.max(1, Math.ceil(game.countdown))}…`],
      [STATES.PAUSE]: ['PARTIE SUSPENDUE', 'Pause.', 'Cliquez sur Reprendre ou appuyez sur Espace dans la carte.', 'En pause. Une reprise explicite est nécessaire.'],
      [STATES.LOST]: ['FIN DE PARTIE', 'Le bureau a gagné.', `${game.score} points. Recommencez pour retenter votre chance.`, `Défaite. Score : ${game.score} points.`],
      [STATES.WON]: ['TOUR DU BUREAU TERMINÉ', 'Bien joué !', `${game.score} points, ${game.lives} vie(s) restante(s). Tous les points sont ramassés.`, `Victoire ! Score : ${game.score} points.`],
      [STATES.PLAY]: ['', '', '', 'Évitez les fantômes. Espace ou Échap pour mettre en pause.'],
    };
    const [label, title, message, status] = views[game.phase];
    text('overlay-label', label); text('overlay-title', title); text('overlay-text', message); text('game-status', status);
  }
  function suspend() { pauseSession(game); previousTime = null; sync(); }
  function launchOrResume() {
    if (doc.hidden) return;
    if (game.phase === STATES.HOME) startSession(game); else resumeSession(game);
    previousTime = null; canvas.focus({ preventScroll: true }); sync();
  }
  on(canvas, 'pointerdown', () => canvas.focus({ preventScroll: true }));
  // Le retour du focus ne reprend jamais la partie à lui seul.
  on(canvas, 'blur', suspend);
  // Un appui garde le focus de la carte pour ne pas déclencher sa pause.
  for (const [id, direction] of [['move-up', 'haut'], ['move-left', 'gauche'], ['move-down', 'bas'], ['move-right', 'droite']]) {
    const button = $(id);
    if (!button) continue;
    on(button, 'pointerdown', event => {
      event.preventDefault();
      if (doc.hidden) return;
      canvas.focus({ preventScroll: true });
      steerSession(game, direction);
    });
    on(button, 'click', event => {
      if (event.detail !== 0 || doc.hidden) return;
      steerSession(game, direction);
    });
  }
  on(win, 'blur', suspend);
  on(doc, 'visibilitychange', () => { if (doc.hidden) suspend(); });
  on($('play'), 'click', launchOrResume);
  on($('pause'), 'click', suspend);
  on($('restart'), 'click', () => {
    restartSession(game); previousTime = null;
    if (doc.hidden) pauseSession(game);
    canvas.focus({ preventScroll: true }); sync();
  });
  on(canvas, 'keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const direction = directionForKey(event.key);
    if (direction || event.code === 'Space' || event.key === 'Escape') event.preventDefault();
    if (doc.hidden || event.repeat) return;
    if (event.code === 'Space') {
      if ([STATES.PLAY, STATES.COUNTDOWN].includes(game.phase)) suspend(); else launchOrResume();
    } else if (event.key === 'Escape') suspend();
    else if (direction) steerSession(game, direction);
  });
  function frame(time) {
    if (disposed) return;
    if ([STATES.PLAY, STATES.COUNTDOWN].includes(game.phase)) {
      if (previousTime !== null) {
        const elapsed = (time - previousTime) / 1000;
        if (elapsed > game.rules.maxFrameGap) suspend(); else updateSession(game, elapsed);
      }
      previousTime = [STATES.PLAY, STATES.COUNTDOWN].includes(game.phase) ? time : null;
    } else previousTime = null;
    sync(); renderer.draw(game, game.phase === STATES.PLAY);
    frameId = win.requestAnimationFrame(frame);
  }
  sync(); frameId = win.requestAnimationFrame(frame);
  return { dispose() {
    disposed = true; win.cancelAnimationFrame(frameId);
    for (const [target, type, listener] of bindings) target.removeEventListener(type, listener);
  } };
}
