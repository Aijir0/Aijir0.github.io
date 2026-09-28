// Connexions communes à la validation, au joueur et aux fantômes.
export const DIRECTIONS = Object.freeze({
  droite: { x: 1, y: 0, opposite: 'gauche' }, gauche: { x: -1, y: 0, opposite: 'droite' },
  haut: { x: 0, y: -1, opposite: 'bas' }, bas: { x: 0, y: 1, opposite: 'haut' },
});
export const cellKey = (x, y) => `${x},${y}`;
export const isWalkable = (map, x, y) => '.P'.includes(map.rows[y]?.[x] ?? '#');
export function ghostNeighbor(map, tile, direction, leaving = false) {
  const vector = DIRECTIONS[direction];
  if (!vector) return null;
  const tunnel = map.tunnels?.find(edge => edge.from.x === tile.x && edge.from.y === tile.y && edge.direction === direction);
  const next = tunnel ? { ...tunnel.to } : { x: tile.x + vector.x, y: tile.y + vector.y };
  return (leaving ? '.PG='.includes(map.rows[next.y]?.[next.x] ?? '#') : isWalkable(map, next.x, next.y)) ? next : null;
}
export const neighbor = (map, tile, direction) => ghostNeighbor(map, tile, direction);
export function portalDestination(map, tile) {
  return map.portalLinks?.get(cellKey(tile.x, tile.y)) || tile;
}
// Appelé une seule fois après l'arrivée au centre. Aucun segment à travers les murs.
export function arrive(map, actor) {
  const key = cellKey(actor.tile.x, actor.tile.y);
  if (actor.portalLock && actor.portalLock !== key) actor.portalLock = null;
  const destination = map.portalLinks?.get(key);
  if (!destination || actor.portalLock === key) return false;
  actor.tile = { ...destination };
  actor.portalLock = cellKey(destination.x, destination.y);
  return true;
}
export function releasePortalLock(actor) {
  if (actor.next && actor.progress >= .5 - 1e-10 && actor.portalLock !== cellKey(actor.next.x, actor.next.y)) actor.portalLock = null;
}
