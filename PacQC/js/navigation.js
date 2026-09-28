import { DIRECTIONS, cellKey, isWalkable, ghostNeighbor, portalDestination } from './topology.js';
export { ghostNeighbor } from './topology.js';

export function routeNeighbor(map, tile, direction, leaving = false) {
  const next = ghostNeighbor(map, tile, direction, leaving);
  return next ? portalDestination(map, next) : null;
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
  // Graphe dirigé inversé : entrer dans A mène à B, pas à A.
  const incoming = new Map();
  map.rows.forEach((row, y) => [...row].forEach((cell, x) => {
    if (!(leaving ? '.PG='.includes(cell) : isWalkable(map, x, y))) return;
    for (const direction of Object.keys(DIRECTIONS)) {
      const next = routeNeighbor(map, { x, y }, direction, leaving);
      if (!next) continue;
      const key = cellKey(next.x, next.y);
      if (!incoming.has(key)) incoming.set(key, []);
      incoming.get(key).push({ x, y });
    }
  }));
  const distances = new Map([[cellKey(target.x, target.y), 0]]), queue = [target];
  for (const tile of queue) {
    const distance = distances.get(cellKey(tile.x, tile.y));
    for (const next of incoming.get(cellKey(tile.x, tile.y)) || []) {
      const key = cellKey(next.x, next.y);
      if (!distances.has(key)) { distances.set(key, distance + 1); queue.push(next); }
    }
  }
  return distances;
}
