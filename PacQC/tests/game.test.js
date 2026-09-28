import { LEVEL } from '../js/map.js';
import { createMap, createGame, requestDirection, updateGame, playerPosition, neighbor, isWalkable, cellKey, DIRECTIONS, SPEED, POINTS, directionForKey } from '../js/movement.js';
import { wallContours, playerSprite } from '../js/renderer.js';

export function runTests() {
  const results = [];
  const assert = (condition, message = 'Assertion non satisfaite') => { if (!condition) throw new Error(message); };
  const close = (a, b) => assert(Math.abs(a - b) < 1e-7, `${a} ≠ ${b}`);
  const test = (name, check) => { try { check(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: error.message }); } };
  const map = createMap(LEVEL);
  const at = (x, y) => { const game = createGame(map); game.player.tile = { x, y }; return game; };
  function samePosition(game, x, y) { const p = playerPosition(game); close(p.x, x); close(p.y, y); }
  function validPosition(game) {
    const p = game.player, pos = playerPosition(game);
    assert(isWalkable(map, p.tile.x, p.tile.y), 'Origine dans un mur');
    if (p.next) {
      const next = neighbor(map, p.tile, p.direction);
      assert(next && next.x === p.next.x && next.y === p.next.y, 'Arête invalide');
      assert(p.progress >= 0 && p.progress < 1, 'Progression hors case');
    }
    assert(Math.abs(pos.x - Math.round(pos.x)) < 1e-8 || Math.abs(pos.y - Math.round(pos.y)) < 1e-8, 'Désalignement');
  }
  test('Carte : 276 cases connectées, 271 objets, réserve de 15 cases exclue', () => {
    assert(map.validation.reachable === 276 && map.validation.collectibles === 271 && map.validation.reserve === 15);
    for (const key of map.collectibles) { const [x, y] = key.split(',').map(Number); assert(map.rows[y][x] === '.'); }
  });
  test('Une carte contenant un collectible isolé est refusée', () => {
    const rows = [...LEVEL.rows]; rows[2] = rows[2].slice(0, 10) + '.' + rows[2].slice(11);
    // Case (10,2) : voisins (9,2), (11,2), (10,1), (10,3).
    for (const [x, y] of [[9,2], [11,2], [10,1], [10,3]]) rows[y] = rows[y].slice(0,x) + '#' + rows[y].slice(x+1);
    let rejected = false;
    try { createMap({ ...LEVEL, rows }); } catch { rejected = true; }
    assert(rejected);
  });
  test('Toutes les arêtes sont réversibles ; seul le tunnel franchit le bord', () => {
    map.rows.forEach((row, y) => [...row].forEach((_, x) => {
      if (!isWalkable(map, x, y)) return;
      for (const [direction, vector] of Object.entries(DIRECTIONS)) {
        const next = neighbor(map, { x, y }, direction); if (!next) continue;
        const back = neighbor(map, next, vector.opposite);
        assert(back.x === x && back.y === y);
        if (Math.abs(next.x - x) > 1) assert(y === map.tunnelRow && next.y === y);
      }
    }));
  });
  test('Départ immobile et bouche fermée', () => {
    const game = createGame(map); updateGame(game, 3); samePosition(game, 11, 20);
    assert(!game.player.moving && playerSprite(game.player, true) === 'droite1');
  });
  test('Mur : arrêt au centre sans traversée, même sur un grand delta', () => {
    const game = at(1,1); requestDirection(game, 'haut'); updateGame(game, 10); samePosition(game,1,1);
    requestDirection(game,'droite'); updateGame(game, 10); samePosition(game,5,1);
    assert(!game.player.moving); assert(playerSprite(game.player,true) === 'droite1');
  });
  test('Virage anticipé : demande conservée après une case incompatible', () => {
    const game = at(1,5); requestDirection(game,'droite'); updateGame(game,.05);
    samePosition(game,1.25,5); requestDirection(game,'haut'); updateGame(game,.45);
    samePosition(game,3,4.5); assert(game.player.facing === 'haut'); validPosition(game);
  });
  test('La dernière direction demandée remplace le virage mémorisé', () => {
    const game = at(1,5); requestDirection(game,'droite'); updateGame(game,.05);
    requestDirection(game,'haut'); requestDirection(game,'droite'); updateGame(game,.45);
    samePosition(game,3.5,5); assert(game.player.facing === 'droite');
  });
  test('Demi-tour immédiat entre deux centres, position inchangée à la commande', () => {
    const game = at(1,5); requestDirection(game,'droite'); updateGame(game,.07);
    const before = playerPosition(game); requestDirection(game,'gauche');
    samePosition(game,before.x,before.y); assert(game.player.facing === 'gauche');
    updateGame(game,.03); samePosition(game,1.2,5); validPosition(game);
  });
  test('Demi-tour exact sur une intersection', () => {
    const game = at(1,5); requestDirection(game,'droite'); updateGame(game,.4);
    requestDirection(game,'gauche'); updateGame(game,.1); samePosition(game,2.5,5);
  });
  test('Tunnel dans les deux sens et demi-tour pendant la traversée', () => {
    const left = at(0,12); requestDirection(left,'gauche'); updateGame(left,.1);
    samePosition(left,-.5,12); requestDirection(left,'droite');
    const pos = playerPosition(left); close((pos.x+23)%23,22.5);
    updateGame(left,.1); samePosition(left,0,12);
    requestDirection(left,'gauche'); updateGame(left,.2); samePosition(left,22,12);
    const right = at(22,12); requestDirection(right,'droite'); updateGame(right,.2); samePosition(right,0,12);
    assert(right.score === POINTS && left.score === POINTS * 2);
  });
  test('Porte et réserve centrale infranchissables', () => {
    const game = at(11,8); requestDirection(game,'bas'); updateGame(game,5); samePosition(game,11,8);
    for (let y=10;y<=12;y++) for (let x=9;x<=13;x++) assert(!isWalkable(map,x,y));
  });
  test('Même trajet et même score à 30, 60 et 144 Hz et avec des durées irrégulières', () => {
    const drive = chunks => { const game = at(1,5); requestDirection(game,'droite'); for (const dt of chunks) updateGame(game,dt); return game; };
    const reference = drive([2.345]);
    for (const rate of [30,60,144]) {
      const chunks = Array(Math.floor(2.345*rate)).fill(1/rate); chunks.push(2.345-chunks.length/rate);
      const game = drive(chunks); samePosition(game,playerPosition(reference).x,5); assert(game.score===reference.score);
    }
    const irregular = drive([.12,.4,.003,.7,.9,.222]); samePosition(irregular,playerPosition(reference).x,5); assert(irregular.score===reference.score);
  });
  test('Collecte unique et remise à zéro indépendante', () => {
    const game=at(1,5); requestDirection(game,'droite'); updateGame(game,.2);
    requestDirection(game,'gauche'); updateGame(game,.2); const score=game.score;
    requestDirection(game,'droite'); updateGame(game,.2); assert(game.score===score);
    const fresh=createGame(map); assert(fresh.score===0 && fresh.remaining.size===271 && map.collectibles.size===271);
  });
  test('Flèches, WASD, ZQSD, majuscules ; touches étrangères ignorées', () => {
    for (const key of ['ArrowUp','w','W','z','Z']) assert(directionForKey(key)==='haut');
    for (const key of ['ArrowLeft','a','A','q','Q']) assert(directionForKey(key)==='gauche');
    for (const key of ['ArrowDown','s','S']) assert(directionForKey(key)==='bas');
    for (const key of ['ArrowRight','d','D']) assert(directionForKey(key)==='droite');
    assert(directionForKey('Tab')===null);
  });
  test('Sprites : bonnes directions, bouche animée en mouvement, dos toujours unique', () => {
    const game=at(1,5); requestDirection(game,'droite'); updateGame(game,.15);
    assert(playerSprite(game.player,true)==='droite2'); assert(playerSprite(game.player,false)==='droite1');
    requestDirection(game,'gauche'); assert(playerSprite(game.player,true)==='gauche2');
    game.player.facing='bas'; assert(playerSprite(game.player,true)==='face2');
    game.player.facing='haut'; for (const time of [0,.15,1,8]) { game.player.animationTime=time; assert(playerSprite(game.player,true)==='dos'); }
  });
  test('Contours muraux fermés et orthogonaux', () => {
    const loops = wallContours(map); assert(loops.length > 5);
    for (const loop of loops) { assert(loop.length>=4); loop.forEach((point,i) => {
      const next=loop[(i+1)%loop.length]; assert((point.x===next.x)!==(point.y===next.y));
      assert(point.x>=0 && point.x<=map.width && point.y>=0 && point.y<=map.height);
    }); }
  });
  test('20 000 pas avec commandes variées : aucun mur ni désalignement', () => {
    const game=createGame(map), directions=Object.keys(DIRECTIONS); let seed=12345;
    for(let i=0;i<20000;i++) {
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      if(i%9===0) requestDirection(game,directions[seed%4]);
      updateGame(game, [1/30,1/60,1/144,.07][(seed>>>8)%4]); validPosition(game);
    }
  });
  test('Parcours complet : 271 collectes, 2 710 points, réussite puis arrêt', () => {
    const game=createGame(map);
    let steps=0;
    while(game.remaining.size && steps<10000) {
      const start=game.player.tile, queue=[{tile:start,path:[]}], visited=new Set([cellKey(start.x,start.y)]);
      let route;
      for (const item of queue) {
        if (item.path.length && game.remaining.has(cellKey(item.tile.x,item.tile.y))) { route=item.path; break; }
        for(const direction of Object.keys(DIRECTIONS)) {
          const next=neighbor(map,item.tile,direction); if(!next)continue;
          const key=cellKey(next.x,next.y); if(visited.has(key))continue;
          visited.add(key); queue.push({tile:next,path:[...item.path,direction]});
        }
      }
      assert(route,'Objet inaccessible pendant la partie');
      for(const direction of route) { requestDirection(game,direction); updateGame(game,1/SPEED); validPosition(game); steps++; }
    }
    assert(game.won && game.remaining.size===0 && game.score===2710 && !game.player.moving);
    const before=playerPosition(game); requestDirection(game,'gauche'); updateGame(game,5); samePosition(game,before.x,before.y);
  });
  return results;
}
