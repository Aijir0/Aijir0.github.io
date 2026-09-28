import { DIRECTIONS, cellKey, isWalkable, neighbor, ghostNeighbor } from './topology.js';

export function createMap(level) {
  const fail = message => { throw new Error(`${level.id || 'Carte'} : ${message}`); };
  const rows = [...level.rows], width = rows[0]?.length, height = rows.length;
  if (!width || width < 3 || width > 31 || height < 3 || height > 31 || rows.some(row => row.length !== width || /[^#.PG=]/.test(row))) fail('dimensions ou types de cases invalides');
  if (!level.id || !['none', 'portals', 'speed'].includes(level.modifier)) fail('identifiant ou modificateur invalide');
  const map = { ...level, rows, width, height, collectibles: new Set(), bonusSpawns: new Map(), portalLinks: new Map(), speedCells: new Set() };
  const starts = [], passages = [], reserves = [], doors = [];
  rows.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell === 'P') starts.push({ x, y });
    if (cell === '.') map.collectibles.add(cellKey(x, y));
    if (isWalkable(map, x, y)) passages.push({ x, y });
    if (cell === 'G') reserves.push({ x, y });
    if (cell === '=') doors.push({ x, y });
    if ((x === 0 || x === width - 1 || y === 0 || y === height - 1) && cell !== '#' &&
      !level.tunnels?.some(edge => edge.from.x === x && edge.from.y === y)) fail('ouverture hors tunnel');
  }));
  if (starts.length !== 1) fail('un seul départ joueur requis');
  map.spawn = starts[0];
  const validTile = p => p && Number.isInteger(p.x) && Number.isInteger(p.y) && isWalkable(map, p.x, p.y);
  if (level.tunnels?.length !== 2) fail('deux connexions explicites de tunnel requises');
  for (const edge of level.tunnels) {
    const vector = DIRECTIONS[edge.direction];
    if (!validTile(edge.from) || !validTile(edge.to) || !vector || vector.y !== 0 || edge.from.y !== level.tunnelRow || edge.to.y !== level.tunnelRow ||
      !((edge.from.x === 0 && edge.to.x === width - 1 && edge.direction === 'gauche') || (edge.from.x === width - 1 && edge.to.x === 0 && edge.direction === 'droite')) ||
      !level.tunnels.some(back => back.from.x === edge.to.x && back.from.y === edge.to.y && back.to.x === edge.from.x && back.to.y === edge.from.y && back.direction === vector.opposite)) fail('tunnel invalide ou non réciproque');
  }
  // Parcours physique : les portails ne doivent jamais réparer une carte déconnectée.
  const visited = new Set([cellKey(map.spawn.x, map.spawn.y)]), queue = [map.spawn];
  for (const tile of queue) for (const direction of Object.keys(DIRECTIONS)) {
    const next = neighbor(map, tile, direction);
    if (next && !visited.has(cellKey(next.x, next.y))) { visited.add(cellKey(next.x, next.y)); queue.push(next); }
  }
  if (visited.size !== passages.length) fail('passages inaccessibles sans portails');
  let edges = 0, intersections = 0;
  for (const tile of passages) {
    const degree = Object.keys(DIRECTIONS).filter(dir => neighbor(map, tile, dir)).length;
    if (degree < 2) fail(`cul-de-sac en ${cellKey(tile.x, tile.y)}`);
    edges += degree; if (degree > 2) intersections++;
    if ([[1, 0], [0, 1], [1, 1]].every(([dx, dy]) => isWalkable(map, tile.x + dx, tile.y + dy))) fail(`bloc praticable 2 × 2 en ${cellKey(tile.x, tile.y)}`);
  }
  const cycles = edges / 2 - passages.length + 1;
  if (cycles < 3) fail('au moins trois boucles requises');
  const home = level.ghostHome;
  if (!validTile(home?.exit) || home?.starts?.length !== 4 || new Set(home.starts.map(p => cellKey(p.x, p.y))).size !== 4 || !reserves.length || doors.length !== 1) fail('réserve, porte ou départs fantômes invalides');
  const door = doors[0], around = Object.values(DIRECTIONS).map(d => ({ x: door.x + d.x, y: door.y + d.y }));
  if (around.filter(p => isWalkable(map, p.x, p.y)).length !== 1 || !around.some(p => p.x === home.exit.x && p.y === home.exit.y) || !around.some(p => rows[p.y]?.[p.x] === 'G')) fail('porte sans accès unique à la sortie ou à la réserve');
  const homeQueue = [door], homeSeen = new Set([cellKey(door.x, door.y)]);
  for (const tile of homeQueue) for (const dir of Object.keys(DIRECTIONS)) {
    const next = ghostNeighbor(map, tile, dir, true);
    if (!next || !'G='.includes(rows[next.y][next.x])) continue;
    const key = cellKey(next.x, next.y);
    if (!homeSeen.has(key)) { homeSeen.add(key); homeQueue.push(next); }
  }
  if (reserves.some(p => !homeSeen.has(cellKey(p.x, p.y))) || home.starts.some(p => rows[p.y]?.[p.x] !== 'G' || !homeSeen.has(cellKey(p.x, p.y)))) fail('réserve déconnectée');
  for (const tile of reserves) if (Object.values(DIRECTIONS).some(d => isWalkable(map, tile.x + d.x, tile.y + d.y))) fail('réserve ouverte hors porte');
  if (!level.patrol?.length || level.patrol.some(p => !validTile(p))) fail('patrouille invalide');
  const occupied = new Set([cellKey(map.spawn.x, map.spawn.y), cellKey(home.exit.x, home.exit.y), ...level.tunnels.map(e => cellKey(e.from.x, e.from.y))]);
  const claim = tile => {
    const key = cellKey(tile.x, tile.y);
    if (!validTile(tile) || occupied.has(key)) fail(`élément spécial invalide ou superposé : ${key}`);
    occupied.add(key); map.collectibles.delete(key); return key;
  };
  if ((level.portals?.length || 0) !== (level.modifier === 'portals' ? 2 : 0)) fail('paire de portails incohérente');
  if (level.modifier === 'portals') {
    const [a, b] = level.portals;
    if (!a.id || !b.id || a.id === b.id || Math.abs(a.x - b.x) + Math.abs(a.y - b.y) < 8 || [a,b].some(p => p.x <= 0 || p.x >= width - 1 || p.y <= 0 || p.y >= height - 1)) fail('portails non distincts ou trop proches');
    map.portalLinks.set(claim(a), { x: b.x, y: b.y }); map.portalLinks.set(claim(b), { x: a.x, y: a.y });
  }
  if (level.modifier !== 'speed' && level.speedZones?.length) fail('accélération interdite sur cette carte');
  if (level.modifier === 'speed' && !level.speedZones?.length) fail('zones d’accélération manquantes');
  for (const zone of level.speedZones || []) {
    const { from, to } = zone;
    if (!validTile(from) || !validTile(to) || (from.x !== to.x && from.y !== to.y) || (from.x === to.x && from.y === to.y)) fail('segment d’accélération invalide');
    const dx = Math.sign(to.x - from.x), dy = Math.sign(to.y - from.y);
    let x = from.x, y = from.y;
    while (true) { map.speedCells.add(claim({ x, y })); if (x === to.x && y === to.y) break; x += dx; y += dy; }
  }
  for (const bonus of level.bonusSpawns || []) {
    if (!['beer', 'coffee'].includes(bonus.type)) fail('type de bonus invalide');
    map.bonusSpawns.set(claim(bonus), { ...bonus });
  }
  map.validation = { reachable: visited.size, collectibles: map.collectibles.size, reserve: reserves.length, cycles, intersections };
  return map;
}

export function validateLevels(levels) {
  if (levels.length !== 3 || new Set(levels.map(l => l.id)).size !== 3 || new Set(levels.map(l => l.rows.join('\n'))).size !== 3) throw new Error('Trois identifiants et trois grilles distinctes requis');
  return levels.map(createMap);
}
