import { DIRECTIONS, actorPosition, cellKey, neighbor } from './movement.js';
import { accessibleTarget, distanceField, ghostNeighbor } from './navigation.js';
import { isVulnerable, isHarmless } from './bonuses.js';

const same = (a, b) => a.x === b.x && a.y === b.y;
export function createGhosts(map, rules, seed) {
  if (!map.ghostHome || map.ghostHome.starts.length !== rules.ghosts.length) throw new Error('Départs des fantômes invalides.');
  const exit = map.ghostHome.exit;
  if (!same(accessibleTarget(map, exit), exit)) throw new Error('Sortie de réserve inaccessible.');
  const routes = distanceField(map, exit, true);
  return rules.ghosts.map((definition, index) => {
    const tile = map.ghostHome.starts[index];
    if (map.rows[tile.y]?.[tile.x] !== 'G' || !routes.has(cellKey(tile.x, tile.y))) throw new Error(`Départ inaccessible : ${definition.id}.`);
    return { ...definition, home: { ...tile }, recovery: 0, tile: { ...tile }, next: null, progress: 0, direction: null, facing: 'haut',
      mode: 'attente', chasing: false, fleeTurn: false, patrolIndex: index % map.patrol.length,
      randomState: (seed + (index + 1) * 2654435761) >>> 0, decisions: 0, target: null };
  });
}

function random(ghost) {
  ghost.randomState = (Math.imul(ghost.randomState, 1664525) + 1013904223) >>> 0;
  return ghost.randomState / 4294967296;
}

export function ghostTarget(game, ghost, rules) {
  const map = game.map;
  const position = actorPosition(game.player);
  if (position.y === map.tunnelRow) position.x = (position.x + map.width) % map.width;
  const player = accessibleTarget(map, position);
  if (ghost.id === 'pcq') {
    let target = player;
    for (let i = 0; i < rules.interceptTiles; i++) {
      const next = neighbor(map, target, game.player.facing);
      if (!next) break;
      target = next;
    }
    return accessibleTarget(map, target);
  }
  if (ghost.id === 'sagir') {
    const distance = distanceField(map, player).get(cellKey(ghost.tile.x, ghost.tile.y)) ?? Infinity;
    if (!ghost.chasing && distance <= rules.chaseEnterDistance) ghost.chasing = true;
    else if (ghost.chasing && distance >= rules.chaseLeaveDistance) ghost.chasing = false;
    if (ghost.chasing) return player;
    let target = accessibleTarget(map, map.patrol[ghost.patrolIndex]);
    if (same(ghost.tile, target)) {
      ghost.patrolIndex = (ghost.patrolIndex + 1) % map.patrol.length;
      target = accessibleTarget(map, map.patrol[ghost.patrolIndex]);
    }
    return target;
  }
  return player;
}

export function chooseGhostDirection(game, ghost, rules) {
  const leaving = ghost.mode === 'sortie' || ghost.mode === 'retour';
  let options = Object.keys(DIRECTIONS).filter(direction => ghostNeighbor(game.map, ghost.tile, direction, leaving));
  const forward = options.filter(direction => direction !== DIRECTIONS[ghost.direction]?.opposite);
  // Une activation de bière autorise un seul demi-tour stratégique au centre.
  // Ensuite : demi-tour uniquement dans une impasse, pour éviter les oscillations.
  const canFleeTurn = isVulnerable(game, ghost) && ghost.fleeTurn;
  if (!leaving && !canFleeTurn && forward.length) options = forward;
  if (!options.length) return null;
  ghost.decisions++;
  if (!leaving && isVulnerable(game, ghost)) {
    ghost.fleeTurn = false;
    const target = accessibleTarget(game.map, actorPosition(game.player));
    const distances = distanceField(game.map, target);
    options.sort((a, b) => {
      const aa = ghostNeighbor(game.map, ghost.tile, a), bb = ghostNeighbor(game.map, ghost.tile, b);
      return distances.get(cellKey(bb.x, bb.y)) - distances.get(cellKey(aa.x, aa.y))
        || Number(b === ghost.direction) - Number(a === ghost.direction);
    });
    return options[0];
  }
  if (!leaving && ghost.id === 'teams') {
    const weights = options.map(direction => direction === ghost.direction ? rules.teamsStraightWeight : 1);
    let choice = random(ghost) * weights.reduce((sum, value) => sum + value, 0);
    for (let i = 0; i < options.length; i++) { choice -= weights[i]; if (choice <= 0) return options[i]; }
    return options.at(-1);
  }
  ghost.target = ghost.mode === 'retour' ? ghost.home : (leaving ? game.map.ghostHome.exit : ghostTarget(game, ghost, rules));
  const distances = distanceField(game.map, ghost.target, leaving);
  // Continuer tout droit en cas d'égalité évite des zigzags inutiles.
  options.sort((a, b) => {
    const aa = ghostNeighbor(game.map, ghost.tile, a, leaving), bb = ghostNeighbor(game.map, ghost.tile, b, leaving);
    return (distances.get(cellKey(aa.x, aa.y)) ?? Infinity) - (distances.get(cellKey(bb.x, bb.y)) ?? Infinity)
      || Number(b === ghost.direction) - Number(a === ghost.direction);
  });
  return options[0];
}

export function updateGhost(game, ghost, seconds, roundTime, rules) {
  const trace = [];
  let time = 0;
  if (ghost.mode === 'attente') {
    const waiting = Math.min(seconds, Math.max(0, ghost.release - roundTime));
    const position = actorPosition(ghost);
    if (waiting > 0) trace.push({ start: 0, end: waiting, from: position, to: position, harmless: true });
    time = waiting;
    if (roundTime + seconds < ghost.release) return trace;
    ghost.mode = 'sortie';
  }
  while (time < seconds - 1e-10) {
    if (!ghost.next && ghost.mode === 'retour' && same(ghost.tile, ghost.home)) {
      ghost.mode = 'regeneration'; ghost.recovery = rules.bonuses.respawnDelay;
    }
    if (ghost.mode === 'regeneration') {
      const duration = Math.min(seconds - time, ghost.recovery), position = actorPosition(ghost);
      trace.push({ start: time, end: time + duration, from: position, to: position, harmless: true });
      ghost.recovery = Math.max(0, ghost.recovery - duration); time += duration;
      if (ghost.recovery > 1e-10) break;
      ghost.recovery = 0; ghost.mode = 'sortie'; ghost.direction = null;
      continue;
    }
    if (!ghost.next) {
      if (ghost.mode === 'sortie' && same(ghost.tile, game.map.ghostHome.exit)) ghost.mode = 'actif';
      ghost.direction = chooseGhostDirection(game, ghost, rules);
      if (!ghost.direction) break;
      ghost.facing = ghost.direction;
      ghost.next = ghostNeighbor(game.map, ghost.tile, ghost.direction, ['sortie', 'retour'].includes(ghost.mode));
      ghost.progress = 0;
    }
    const speed = ghost.mode === 'retour' ? rules.bonuses.returnSpeed : (ghost.mode === 'sortie' ? rules.exitSpeed : ghost.speed);
    const duration = Math.min(seconds - time, (1 - ghost.progress) / speed);
    const step = duration * speed, vector = DIRECTIONS[ghost.direction], from = actorPosition(ghost);
    trace.push({ start: time, end: time + duration, from, to: { x: from.x + vector.x * step, y: from.y + vector.y * step }, harmless: isHarmless(ghost) });
    ghost.progress += step; time += duration;
    if (ghost.progress >= 1 - 1e-9) { ghost.tile = ghost.next; ghost.next = null; ghost.progress = 0; }
  }
  if (time < seconds) {
    const position = actorPosition(ghost);
    trace.push({ start: time, end: seconds, from: position, to: position, harmless: isHarmless(ghost) });
  }
  return trace;
}
