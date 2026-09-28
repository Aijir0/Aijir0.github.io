import { DIFFICULTY } from './difficulty.js';
import { createGame, requestDirection, updateGame, timeToPlayerCenter, actorPosition } from './movement.js';
import { createGhosts, updateGhost } from './ghosts.js';
import { firstContact } from './collisions.js';
import { isHarmless, playerSpeed, collectBonus, advanceEffects, eatGhost } from './bonuses.js';

export const STATES = Object.freeze({ HOME: 'accueil', COUNTDOWN: 'compte-a-rebours', PLAY: 'partie', PAUSE: 'pause', LOST: 'defaite', WON: 'victoire' });

export function createSession(map, rules = DIFFICULTY, seed = Date.now() >>> 0) {
  return { ...createGame(map), rules, seed, phase: STATES.HOME, resumePhase: null,
    lives: rules.lives, countdown: 0, roundTime: 0, deaths: 0,
    bonuses: new Map(map.bonusSpawns), effects: { beer: 0, coffee: 0 }, feedback: [], bonusMessage: '',
    ghosts: createGhosts(map, rules, seed), notice: '' };
}

export function startSession(game) {
  if (game.phase !== STATES.HOME) return;
  game.countdown = game.rules.countdown; game.phase = STATES.COUNTDOWN; game.notice = 'Départ';
}
export function pauseSession(game) {
  if (![STATES.PLAY, STATES.COUNTDOWN].includes(game.phase)) return;
  game.resumePhase = game.phase; game.phase = STATES.PAUSE;
}
export function resumeSession(game) {
  if (game.phase !== STATES.PAUSE) return;
  game.phase = game.resumePhase; game.resumePhase = null;
}
export function restartSession(game) {
  const fresh = createSession(game.map, game.rules, game.seed);
  Object.assign(game, fresh); startSession(game);
}
export function steerSession(game, direction) {
  if ([STATES.PLAY, STATES.COUNTDOWN].includes(game.phase)) requestDirection(game, direction);
}

function loseLife(game) {
  game.lives--; game.deaths++; game.won = false;
  game.player = createGame(game.map).player;
  game.ghosts = createGhosts(game.map, game.rules, game.seed + game.deaths);
  game.roundTime = 0; game.resumePhase = null;
  game.effects = { beer: 0, coffee: 0 }; game.feedback = []; game.bonusMessage = '';
  if (!game.lives) { game.phase = STATES.LOST; game.countdown = 0; }
  else {
    game.phase = STATES.COUNTDOWN; game.countdown = game.rules.countdown;
    game.notice = 'Une vie perdue';
  }
}

function resolveNow(game) {
  // À un instant commun : expiration déjà appliquée, puis ramassage, puis contact.
  collectBonus(game);
  if (game.won) { game.phase = STATES.WON; game.player.moving = false; return; }
  const position = actorPosition(game.player);
  const player = [{ start: 0, end: 0, from: position, to: position }];
  for (const ghost of game.ghosts) {
    if (isHarmless(ghost)) continue;
    const p = actorPosition(ghost);
    const hit = firstContact(player, [{ start: 0, end: 0, from: p, to: p }], game.map, game.rules.playerRadius + game.rules.ghostRadius);
    if (hit === Infinity) continue;
    if (game.effects.beer > 0) eatGhost(game, ghost);
    else { loseLife(game); return; }
  }
}

function simulate(game, dt, speed) {
  // Les décisions des fantômes observent le même début d'intervalle en cas de rejeu.
  const ghosts = game.ghosts.map(ghost => updateGhost(game, ghost, dt, game.roundTime, game.rules));
  const player = updateGame(game, dt, { ...game.rules, playerSpeed: speed });
  let contact = Infinity;
  for (const trace of ghosts) {
    contact = Math.min(contact, firstContact(player.segments, trace.filter(part => !part.harmless), game.map,
      game.rules.playerRadius + game.rules.ghostRadius));
  }
  return { player, contact };
}

export function updateSession(game, seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new Error('Durée de partie invalide.');
  if (![STATES.COUNTDOWN, STATES.PLAY].includes(game.phase)) return;
  let remaining = seconds;
  if (game.phase === STATES.COUNTDOWN) {
    const elapsed = Math.min(remaining, game.countdown);
    game.countdown = Math.max(0, game.countdown - elapsed); remaining -= elapsed;
    if (game.countdown > 1e-9) return;
    game.countdown = 0; game.phase = STATES.PLAY;
  }
  while (remaining > 1e-10 && game.phase === STATES.PLAY) {
    resolveNow(game);
    if (game.phase !== STATES.PLAY) return;
    const speed = playerSpeed(game);
    const expiry = Math.min(...Object.values(game.effects).filter(time => time > 0), Infinity);
    const dt = Math.min(remaining, game.rules.fixedStep, expiry, timeToPlayerCenter(game, speed));
    const saved = { player: { ...game.player }, ghosts: game.ghosts.map(ghost => ({ ...ghost })), score: game.score, won: game.won };
    const result = simulate(game, dt, speed);
    let elapsed = dt;
    if (result.contact < dt - 1e-10) {
      // Rejouer jusqu'au contact exact avant de modifier son issue (mort ou capture).
      for (const item of result.player.collections) game.remaining.add(item.key);
      game.player = saved.player; game.ghosts = saved.ghosts; game.score = saved.score; game.won = saved.won;
      elapsed = Math.max(0, result.contact);
      simulate(game, elapsed, speed);
    }
    game.roundTime += elapsed; remaining = Math.max(0, remaining - elapsed);
    advanceEffects(game, elapsed);
    // Supprimer les résidus numériques au moment précis de l'expiration.
    for (const type of ['beer', 'coffee']) if (game.effects[type] < 1e-10) game.effects[type] = 0;
    resolveNow(game);
  }
}
