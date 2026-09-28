// Logique pure : aucune dépendance au DOM, au Canvas ou à la taille des sprites.
import { DIFFICULTY } from './difficulty.js';
import { DIRECTIONS, cellKey, neighbor, arrive, releasePortalLock } from './topology.js';
import { terrainSpeed, distanceToBoundary } from './modifiers.js';
export { DIRECTIONS, cellKey, isWalkable, neighbor } from './topology.js';
export { createMap } from './map-validation.js';
export const SPEED = DIFFICULTY.playerSpeed;
export const POINTS = DIFFICULTY.points;
const EPSILON = 1e-9;

export function createGame(map) {
  return {
    map, player: { tile: { ...map.spawn }, next: null, progress: 0, direction: null, facing: 'droite', requested: null, moving: false, animationTime: 0, portalLock: null },
    remaining: new Set(map.collectibles), score: 0, won: false,
  };
}

export function requestDirection(game, direction) {
  if (!DIRECTIONS[direction] || game.won) return;
  const player = game.player;
  player.requested = direction; // Conservée jusqu'à une prochaine demande, même si bloquée.
  if (player.next && DIRECTIONS[player.direction].opposite === direction) {
    // Retour immédiat sur la même arête, sans téléportation ni arrondi de position.
    [player.tile, player.next] = [player.next, player.tile];
    player.progress = 1 - player.progress;
    player.direction = direction;
    player.facing = direction;
  }
}

function chooseDirection(game) {
  const p = game.player;
  if (neighbor(game.map, p.tile, p.requested)) return p.requested;
  return neighbor(game.map, p.tile, p.direction) ? p.direction : null;
}

export function timeToPlayerCenter(game, speed) {
  const p = game.player;
  return p.next || chooseDirection(game) ? distanceToBoundary(p) / terrainSpeed(game.map, p, speed) : Infinity;
}

export function updateGame(game, seconds, rules = DIFFICULTY) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new Error('Durée de déplacement invalide.');
  const p = game.player;
  const trace = { segments: [], collections: [], wonAt: null };
  let time = 0;
  if (game.won) { p.moving = false; return trace; }
  while (time < seconds - EPSILON && !game.won) {
    if (!p.next) {
      const direction = chooseDirection(game);
      if (!direction) break;
      p.direction = direction; p.facing = direction;
      p.next = neighbor(game.map, p.tile, direction);
      p.progress = 0;
    }
    const speed = terrainSpeed(game.map, p, rules.playerSpeed);
    const step = Math.min((seconds - time) * speed, distanceToBoundary(p));
    const from = playerPosition(game), duration = step / speed, vector = DIRECTIONS[p.direction];
    trace.segments.push({ start: time, end: time + duration, from, to: { x: from.x + vector.x * step, y: from.y + vector.y * step } });
    time += duration;
    p.progress += step; p.animationTime += duration;
    releasePortalLock(p);
    if (p.progress >= 1 - EPSILON) {
      p.tile = p.next; p.next = null; p.progress = 0;
      if (arrive(game.map, p)) {
        const destination = playerPosition(game);
        trace.segments.push({ start: time, end: time, from: destination, to: destination });
      }
      if (game.remaining.delete(cellKey(p.tile.x, p.tile.y))) {
        game.score += rules.points;
        trace.collections.push({ key: cellKey(p.tile.x, p.tile.y), time });
        if (!game.remaining.size) { game.won = true; trace.wonAt = time; }
      }
    }
  }
  p.moving = !game.won && Boolean(p.next || chooseDirection(game));
  if (!p.moving) p.animationTime = 0;
  if (time < seconds || !trace.segments.length) {
    const position = playerPosition(game);
    trace.segments.push({ start: time, end: seconds, from: position, to: position });
  }
  return trace;
}

export function actorPosition(p) {
  const vector = DIRECTIONS[p.direction];
  // Le bord opposé est une case voisine : interpolation courte à travers le tunnel.
  return {
    x: p.tile.x + (p.next ? vector.x * p.progress : 0),
    y: p.tile.y + (p.next ? vector.y * p.progress : 0),
  };
}

export const playerPosition = game => actorPosition(game.player);

export function directionForKey(key) {
  return { ArrowRight: 'droite', ArrowLeft: 'gauche', ArrowUp: 'haut', ArrowDown: 'bas',
    w: 'haut', z: 'haut', a: 'gauche', q: 'gauche', s: 'bas', d: 'droite' }[key.length === 1 ? key.toLowerCase() : key] || null;
}
