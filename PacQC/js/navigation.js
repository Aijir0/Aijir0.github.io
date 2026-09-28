import { DIRECTIONS, cellKey, isWalkable, neighbor } from './movement.js';

export function ghostNeighbor(map, tile, direction, leaving = false) {
  if (!leaving) return neighbor(map, tile, direction);
  const vector = DIRECTIONS[direction];
  if (!vector) return null;
  let x = tile.x + vector.x, y = tile.y + vector.y;
  if (y === map.tunnelRow && vector.y === 0) x = (x + map.width) % map.width;
  return '.PG='.includes(map.rows[y]?.[x] ?? '!') ? { x, y } : null;
}

// Projection déterministe sur le graphe réellement accessible au joueur.
export function accessibleTarget(map, target) {
  if (!Number.isFinite(target?.x) || !Number.isFinite(target?.y)) return { ...map.spawn };
  let best = map.spawn, distance = Infinity;
  map.rows.forEach((row, y) => [...row].forEach((_, x) => {
    if (!isWalkable(map, x, y)) return;
    const d = (x - target.x) ** 2 + (y - target.y) ** 2;
    if (d < distance) { best = { x, y }; distance = d; }
  }));
  return best;
}

export function distanceField(map, target, leaving = false) {
  const distances = new Map([[cellKey(target.x, target.y), 0]]), queue = [target];
  for (const tile of queue) {
    const distance = distances.get(cellKey(tile.x, tile.y));
    for (const direction of Object.keys(DIRECTIONS)) {
      const next = ghostNeighbor(map, tile, direction, leaving);
      if (!next) continue;
      const key = cellKey(next.x, next.y);
      if (!distances.has(key)) { distances.set(key, distance + 1); queue.push(next); }
    }
  }
  return distances;
}
