import { actorPosition, cellKey } from './movement.js';

export const isHarmless = ghost => ['attente', 'retour', 'regeneration'].includes(ghost.mode);
export const isVulnerable = (game, ghost) => (game.effects?.beer || 0) > 0 && !isHarmless(ghost);
export const playerSpeed = game => game.rules.playerSpeed * (game.effects.coffee > 0 ? game.rules.bonuses.coffee.speedMultiplier : 1);

export function feedback(game, text, position, color) {
  game.feedback.push({ ...position, text, color, ttl: game.rules.bonuses.feedbackSeconds });
  game.feedback = game.feedback.slice(-8);
  game.bonusMessage = text;
}

export function activateBonus(game, type) {
  if (type === 'beer' && game.effects.beer <= 0) {
    for (const ghost of game.ghosts) ghost.fleeTurn = true;
  }
  game.effects[type] = game.rules.bonuses[type].duration;
  feedback(game, type === 'beer' ? `Bière · ${game.effects.beer} s` : `Café · +${Math.round((game.rules.bonuses.coffee.speedMultiplier - 1) * 100)} %`,
    actorPosition(game.player), type === 'beer' ? '#82e8ff' : '#ffc17b');
}

export function collectBonus(game) {
  if (game.player.next) return;
  const key = cellKey(game.player.tile.x, game.player.tile.y), bonus = game.bonuses.get(key);
  if (!bonus) return;
  game.bonuses.delete(key); activateBonus(game, bonus.type);
}

export function advanceEffects(game, seconds) {
  for (const type of ['beer', 'coffee']) game.effects[type] = Math.max(0, game.effects[type] - seconds);
  for (const item of game.feedback) item.ttl -= seconds;
  game.feedback = game.feedback.filter(item => item.ttl > 0);
  if (!game.feedback.length) game.bonusMessage = '';
}

export function eatGhost(game, ghost) {
  if (!isVulnerable(game, ghost)) return;
  ghost.mode = 'retour'; ghost.chasing = false; ghost.fleeTurn = false; ghost.target = ghost.home;
  game.score += game.rules.bonuses.beer.eatPoints;
  feedback(game, `+${game.rules.bonuses.beer.eatPoints}`, actorPosition(ghost), '#82e8ff');
}
