import { DIFFICULTY } from './difficulty.js';
import { cellKey } from './topology.js';

// Une zone occupe la case entière : changement de vitesse à mi-arête, sans saut.
export function terrainSpeed(map, actor, baseSpeed) {
  const tile = actor.next && actor.progress >= .5 - 1e-10 ? actor.next : actor.tile;
  const multiplier = map.speedCells?.has(cellKey(tile.x, tile.y)) ? DIFFICULTY.modifiers.zoneMultiplier : 1;
  return Math.min(baseSpeed * multiplier, DIFFICULTY.modifiers.maxSpeed);
}
export const distanceToBoundary = actor => (actor.progress < .5 - 1e-10 ? .5 : 1) - actor.progress;
