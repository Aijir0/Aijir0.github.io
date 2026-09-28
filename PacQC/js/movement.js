// Logique pure : aucune dépendance au DOM, au Canvas ou à la taille des sprites.
import { DIFFICULTY } from './difficulty.js';
export const DIRECTIONS = Object.freeze({
  droite: { x: 1, y: 0, opposite: 'gauche' },
  gauche: { x: -1, y: 0, opposite: 'droite' },
  haut: { x: 0, y: -1, opposite: 'bas' },
  bas: { x: 0, y: 1, opposite: 'haut' },
});
export const cellKey = (x, y) => `${x},${y}`;
export const SPEED = DIFFICULTY.playerSpeed;
export const POINTS = DIFFICULTY.points;
const EPSILON = 1e-9;

export function isWalkable(map, x, y) {
  return map.rows[y]?.[x] === '.' || map.rows[y]?.[x] === 'P';
}

export function neighbor(map, tile, direction) {
  const vector = DIRECTIONS[direction];
  if (!vector) return null;
  let x = tile.x + vector.x, y = tile.y + vector.y;
  if (y === map.tunnelRow && vector.y === 0) x = (x + map.width) % map.width;
  return isWalkable(map, x, y) ? { x, y } : null;
}

export function createMap(level) {
  const rows = [...level.rows], width = rows[0]?.length, height = rows.length;
  if (!width || rows.some(row => row.length !== width || /[^#.PG=]/.test(row))) {
    throw new Error('Grille invalide : dimensions ou symboles incorrects.');
  }
  const starts = [], collectibles = new Set();
  let walkable = 0, reserve = 0;
  rows.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell === 'P') starts.push({ x, y });
    if (cell === '.') collectibles.add(cellKey(x, y));
    if (cell === '.' || cell === 'P') walkable++;
    if (cell === 'G') reserve++;
    if ((y === 0 || y === height - 1 || ((x === 0 || x === width - 1) && y !== level.tunnelRow)) && cell !== '#') {
      throw new Error('Une ouverture existe en dehors du tunnel.');
    }
  }));
  if (starts.length !== 1) throw new Error('La grille doit contenir un seul départ.');
  const map = { rows, width, height, tunnelRow: level.tunnelRow, spawn: starts[0], collectibles, name: level.name, ghostHome: level.ghostHome, patrol: level.patrol };
  if (!isWalkable(map, 0, map.tunnelRow) || !isWalkable(map, width - 1, map.tunnelRow)) {
    throw new Error('Les deux entrées du tunnel doivent être accessibles.');
  }
  const visited = new Set([cellKey(map.spawn.x, map.spawn.y)]), queue = [map.spawn];
  for (const tile of queue) {
    for (const direction of Object.keys(DIRECTIONS)) {
      const next = neighbor(map, tile, direction);
      if (!next) continue;
      const key = cellKey(next.x, next.y);
      if (!visited.has(key)) { visited.add(key); queue.push(next); }
    }
  }
  if (visited.size !== walkable) throw new Error(`${walkable - visited.size} case(s) inaccessible(s).`);
  map.bonusSpawns = new Map();
  for (const bonus of level.bonusSpawns || []) {
    const key = cellKey(bonus.x, bonus.y);
    if (!['beer', 'coffee'].includes(bonus.type) || !visited.has(key) || !collectibles.has(key) || map.bonusSpawns.has(key)) {
      throw new Error(`Emplacement de bonus invalide ou superposé : ${key}.`);
    }
    map.bonusSpawns.set(key, { ...bonus }); collectibles.delete(key);
  }
  map.validation = { reachable: visited.size, collectibles: collectibles.size, reserve };
  return map;
}

export function createGame(map) {
  return {
    map, player: { tile: { ...map.spawn }, next: null, progress: 0, direction: null, facing: 'droite', requested: null, moving: false, animationTime: 0 },
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
  return p.next ? (1 - p.progress) / speed : (chooseDirection(game) ? 1 / speed : Infinity);
}

export function updateGame(game, seconds, rules = DIFFICULTY) {
  if (!Number.isFinite(seconds) || seconds < 0) throw new Error('Durée de déplacement invalide.');
  const p = game.player;
  const trace = { segments: [], collections: [], wonAt: null };
  let time = 0;
  if (game.won) { p.moving = false; return trace; }
  let distance = rules.playerSpeed * seconds;
  while (distance > EPSILON && !game.won) {
    if (!p.next) {
      const direction = chooseDirection(game);
      if (!direction) break;
      p.direction = direction; p.facing = direction;
      p.next = neighbor(game.map, p.tile, direction);
      p.progress = 0;
    }
    const step = Math.min(distance, 1 - p.progress);
    const from = playerPosition(game), duration = step / rules.playerSpeed, vector = DIRECTIONS[p.direction];
    trace.segments.push({ start: time, end: time + duration, from, to: { x: from.x + vector.x * step, y: from.y + vector.y * step } });
    time += duration;
    p.progress += step; distance -= step; p.animationTime += duration;
    if (p.progress >= 1 - EPSILON) {
      p.tile = p.next; p.next = null; p.progress = 0;
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
