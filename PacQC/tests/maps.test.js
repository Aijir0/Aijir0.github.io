import { LEVEL, MINISTRY_LEVEL, RINGS_LEVEL, LEVELS, selectLevel, nextLevel } from '../js/map.js';
import { createMap, validateLevels } from '../js/map-validation.js';
import { createGame, requestDirection, updateGame, actorPosition } from '../js/movement.js';
import { DIRECTIONS, cellKey, neighbor, arrive, isWalkable } from '../js/topology.js';
import { distanceField, routeNeighbor } from '../js/navigation.js';
import { createSession, restartSession, startSession, updateSession, STATES } from '../js/session.js';
import { updateGhost, chooseGhostDirection } from '../js/ghosts.js';
import { firstContact } from '../js/collisions.js';
import { terrainSpeed } from '../js/modifiers.js';
import { activateBonus, playerSpeed } from '../js/bonuses.js';
import { DIFFICULTY } from '../js/difficulty.js';

export function runMapTests() {
  const results = [], assert = (ok, message = 'Assertion non satisfaite') => { if (!ok) throw Error(message); };
  const close = (a,b) => assert(Math.abs(a-b) < 1e-7, `${a} ≠ ${b}`);
  const test = (name, check) => { try { check(); results.push({name,passed:true}); } catch (e) { results.push({name,passed:false,error:e.message}); } };
  const rejects = fn => { let rejected = false; try { fn(); } catch { rejected = true; } assert(rejected, 'Carte invalide acceptée'); };
  const edit = (level,x,y,cell) => { const rows = [...level.rows]; rows[y] = rows[y].slice(0,x) + cell + rows[y].slice(x+1); return {...level,rows}; };
  const place = (actor,x,y,direction='droite') => Object.assign(actor,{tile:{x,y},next:null,progress:0,direction,facing:direction,requested:direction,portalLock:null});
  const stationary = (x,y,duration) => [{start:0,end:duration,from:{x,y},to:{x,y}}];

  test('Trois grilles indépendantes, ni copies, ni miroirs, ni rotations', () => {
    const maps = validateLevels(LEVELS); assert(maps.length === 3);
    for (let i=0;i<LEVELS.length;i++) for(let j=i+1;j<LEVELS.length;j++) {
      const a=LEVELS[i].rows.map(row=>row.replace('P','.')), b=LEVELS[j].rows.map(row=>row.replace('P','.')).join('\n');
      for(const rows of [a,[...a].reverse(),a.map(row=>[...row].reverse().join('')),[...a].reverse().map(row=>[...row].reverse().join(''))]) assert(rows.join('\n')!==b);
      // 90° et 270° inverseraient les dimensions 23 × 25.
      assert(maps[i].width===23 && maps[i].height===25);
    }
  });
  test('Sélection par identifiant et ancien numéro, repli sûr, cycle des transitions', () => {
    LEVELS.forEach((level,i) => { assert(selectLevel('?carte='+level.id)===level); assert(selectLevel('?carte='+(i+1))===level); assert(nextLevel(level)===LEVELS[(i+1)%3]); });
    assert(selectLevel('?carte=inconnu')===LEVEL && selectLevel('?carte=0')===LEVEL);
    assert(selectLevel('?carte=ministere').modifier==='portals' && selectLevel('?carte=anneaux').modifier==='speed');
  });
  for(const level of LEVELS) test(`${level.id} : réseau connecté, mince, sans impasse et sans superposition`, () => {
    const map=createMap(level);
    assert(map.validation.cycles>=3 && map.validation.intersections>=6);
    for(let y=0;y<map.height;y++) for(let x=0;x<map.width;x++) if(isWalkable(map,x,y)) {
      assert(Object.keys(DIRECTIONS).filter(d=>neighbor(map,{x,y},d)).length>=2);
      assert(![[1,0],[0,1],[1,1]].every(([dx,dy])=>isWalkable(map,x+dx,y+dy)));
    }
    for(const key of [...map.portalLinks.keys(),...map.speedCells,...map.bonusSpawns.keys()]) assert(!map.collectibles.has(key));
    const distances=distanceField(map,map.spawn); assert(distances.size===map.validation.reachable,'Passage inaccessible avec modificateur');
  });
  test('Validation : dimensions, symboles, départs et grilles dupliquées refusés', () => {
    rejects(()=>createMap({...LEVEL,rows:LEVEL.rows.slice(1)})); rejects(()=>createMap(edit(LEVEL,2,1,'?')));
    rejects(()=>createMap(edit(LEVEL,2,1,'P'))); rejects(()=>validateLevels([LEVEL,LEVEL,RINGS_LEVEL]));
  });
  test('Validation : impasse, bloc 2 × 2 et zone isolée refusés', () => {
    rejects(()=>createMap(edit(LEVEL,2,2,'.'))); // branche d'une case
    rejects(()=>createMap(edit(edit(LEVEL,2,2,'.'),3,2,'.')));
    rejects(()=>createMap(edit(LEVEL,3,3,'.')));
  });
  test('Validation : tunnels, réserve, portails, bonus et zones incohérents refusés', () => {
    rejects(()=>createMap({...LEVEL,tunnels:[LEVEL.tunnels[0]]}));
    rejects(()=>createMap({...LEVEL,ghostHome:{...LEVEL.ghostHome,exit:{x:1,y:1}}}));
    rejects(()=>createMap(edit(LEVEL,8,11,'.')));
    rejects(()=>createMap({...MINISTRY_LEVEL,portals:[{id:'A',...MINISTRY_LEVEL.bonusSpawns[0]},MINISTRY_LEVEL.portals[1]]}));
    rejects(()=>createMap({...MINISTRY_LEVEL,portals:[MINISTRY_LEVEL.portals[0],MINISTRY_LEVEL.portals[0]]}));
    rejects(()=>createMap({...RINGS_LEVEL,portals:MINISTRY_LEVEL.portals}));
    rejects(()=>createMap({...RINGS_LEVEL,speedZones:[{from:{x:7,y:1},to:{x:7,y:3}}]}));
    rejects(()=>createMap({...LEVEL,bonusSpawns:[...LEVEL.bonusSpawns,LEVEL.bonusSpawns[0]]}));
  });
  test('Portails : aller, verrouillage au repos, sortie et retour, sans balayage diagonal', () => {
    const map=createMap(MINISTRY_LEVEL), game=createGame(map); place(game.player,3,6,'bas');
    const trace=updateGame(game,.2); assert(cellKey(game.player.tile.x,game.player.tile.y)==='17,21');
    assert(!arrive(map,game.player)); assert(game.player.portalLock==='17,21');
    assert(trace.segments.every(s=>Math.hypot(s.to.x-s.from.x,s.to.y-s.from.y)<=.5+1e-9));
    assert(firstContact(trace.segments,stationary(10,14,.2),map,.49)===Infinity);
    close(firstContact(trace.segments,stationary(17,21,.2),map,.49),.2);
    requestDirection(game,'gauche');updateGame(game,.2);assert(game.player.portalLock===null);
    requestDirection(game,'droite');updateGame(game,.2);assert(cellKey(game.player.tile.x,game.player.tile.y)==='3,7');
  });
  test('Portails : demi-tour avant/après sortie physique de la case d’arrivée', () => {
    for(const [duration,teleports] of [[.04,false],[.12,true]]) {
      const map=createMap(MINISTRY_LEVEL),game=createGame(map);place(game.player,3,6,'bas');updateGame(game,.2);
      requestDirection(game,'gauche');updateGame(game,duration);requestDirection(game,'droite');updateGame(game,duration);
      assert(game.player.tile.x===(teleports?3:17));
    }
  });
  test('Portails : distance dirigée, choix de poursuite, traversée par un fantôme', () => {
    const map=createMap(MINISTRY_LEVEL), game=createSession(map), ghost=game.ghosts[0];
    place(game.player,17,21);place(ghost,3,6,'bas');ghost.mode='actif';
    assert(distanceField(map,{x:17,y:21}).get('3,6')===1);
    assert(chooseGhostDirection(game,ghost,game.rules)==='bas');
    const trace=updateGhost(game,ghost,1/ghost.speed,10,game.rules);
    assert(ghost.tile.x===17 && ghost.tile.y===21 && ghost.portalLock==='17,21');
    assert(trace.every(s=>Math.hypot(s.to.x-s.from.x,s.to.y-s.from.y)<=.5+1e-9));
  });
  test('Portails : collision réelle à l’arrivée et absence de collecte sur les portails', () => {
    const map=createMap(MINISTRY_LEVEL),game=createSession(map);startSession(game);updateSession(game,game.rules.countdown);
    place(game.player,3,6,'bas');for(const g of game.ghosts)g.release=1000;
    const ghost=game.ghosts[0];place(ghost,17,21,'droite');ghost.mode='actif';ghost.speed=0.001;
    updateSession(game,.2);assert(game.lives===2 && game.phase===STATES.COUNTDOWN && game.score===0);
  });
  test('Accélération : +20 %, café multiplicatif et plafond commun', () => {
    const game=createSession(createMap(RINGS_LEVEL));place(game.player,7,1);
    close(terrainSpeed(game.map,game.player,playerSpeed(game)),6);activateBonus(game,'coffee');
    close(terrainSpeed(game.map,game.player,playerSpeed(game)),7.5);
    close(terrainSpeed(game.map,game.player,100),DIFFICULTY.modifiers.maxSpeed);
    const ghost=game.ghosts[0];place(ghost,7,1);close(terrainSpeed(game.map,ghost,ghost.speed),ghost.speed*1.2);
  });
  test('Accélération : entrée/sortie exacte aux demi-cases, demi-tour et cadences', () => {
    const map=createMap(RINGS_LEVEL);
    const drive=chunks=>{const g=createGame(map);place(g.player,6,1);for(const dt of chunks)updateGame(g,dt);return g;};
    const whole=drive([1.2]), split=drive(Array(144).fill(1.2/144));
    close(actorPosition(whole.player).x,actorPosition(split.player).x);assert(whole.score===split.score);
    const g=drive([.1]);close(actorPosition(g.player).x,6.5);updateGame(g,.1);close(actorPosition(g.player).x,7.1);
    requestDirection(g,'gauche');updateGame(g,.1);close(actorPosition(g.player).x,6.5);updateGame(g,.1);close(actorPosition(g.player).x,6);
  });
  test('Accélération : virage permis, vitesse normale retrouvée, fantômes alignés', () => {
    const map=createMap(RINGS_LEVEL),game=createSession(map);place(game.player,15,10,'bas');
    requestDirection(game,'droite');updateGame(game,1/6);requestDirection(game,'droite');updateGame(game,.2);
    const p=actorPosition(game.player);assert(p.x>15 && p.y===11);
    close(terrainSpeed(map,game.player,5),5);
    const ghost=game.ghosts[0];place(ghost,7,1);ghost.mode='actif';place(game.player,12,1);
    updateGhost(game,ghost,.1,10,game.rules);close(actorPosition(ghost).x,7+ghost.speed*1.2*.1);
    assert(actorPosition(ghost).y===1);
  });
  for(const level of LEVELS) test(`${level.id} : redémarrage conserve grille/modificateur et restaure la session`, () => {
    const map=createMap(level),g=createSession(map);g.score=100;g.lives=1;g.player.portalLock='test';g.remaining.clear();activateBonus(g,'coffee');
    restartSession(g);assert(g.map===map && g.map.id===level.id && g.lives===3 && g.score===0 && g.player.portalLock===null && g.effects.coffee===0);
    assert(g.remaining.size===map.collectibles.size && g.bonuses.size===4 && g.phase===STATES.COUNTDOWN);
  });
  for(const level of LEVELS) test(`${level.id} : poursuites prolongées, virages et déplacements légaux`, () => {
    const game=createSession(createMap(level),DIFFICULTY,321),dirs=Object.keys(DIRECTIONS);let seed=123;
    for(let tick=0;tick<2400;tick++) {
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      if(tick%7===0)requestDirection(game,dirs[(seed>>>16)%4]);
      updateGame(game,1/30);
      for(const ghost of game.ghosts)updateGhost(game,ghost,1/30,tick/30,game.rules);
      for(const actor of [game.player,...game.ghosts]) {
        const p=actorPosition(actor);assert(Number.isFinite(p.x)&&Number.isFinite(p.y));
        assert(Math.abs(p.x-Math.round(p.x))<1e-7||Math.abs(p.y-Math.round(p.y))<1e-7);
        assert(actor.progress>=0&&actor.progress<1);
        if(actor===game.player||actor.mode==='actif') {
          assert(isWalkable(game.map,actor.tile.x,actor.tile.y));
          if(actor.next)assert(JSON.stringify(neighbor(game.map,actor.tile,actor.direction))===JSON.stringify(actor.next));
        }
      }
    }
    assert(game.ghosts.every(g=>g.mode==='actif'));
  });
  test('Accélération : expiration du café dans une vraie session sans saut', () => {
    const game=createSession(createMap(RINGS_LEVEL));startSession(game);updateSession(game,game.rules.countdown);
    for(const ghost of game.ghosts)ghost.release=1000;
    place(game.player,7,1);activateBonus(game,'coffee');game.effects.coffee=.03;
    updateSession(game,.06);close(actorPosition(game.player).x,7+.03*7.5+.03*6);
    close(game.effects.coffee,0);assert(actorPosition(game.player).y===1);
  });
  for(const level of LEVELS) test(`${level.id} : collecte complète avec connexions réelles et modificateur actif`, () => {
    const map=createMap(level),game=createGame(map);let steps=0;
    while(game.remaining.size && steps<5000) {
      const queue=[{tile:game.player.tile,path:[]}],seen=new Set([cellKey(game.player.tile.x,game.player.tile.y)]);let route;
      for(const item of queue) {
        if(item.path.length && game.remaining.has(cellKey(item.tile.x,item.tile.y))){route=item.path;break;}
        for(const dir of Object.keys(DIRECTIONS)) {const next=routeNeighbor(map,item.tile,dir);if(!next)continue;const key=cellKey(next.x,next.y);if(!seen.has(key)){seen.add(key);queue.push({tile:next,path:[...item.path,dir]});}}
      }
      assert(route,'Objet inaccessible via le graphe réel');
      for(const dir of route) {
        requestDirection(game,dir);
        // Deux demi-arêtes : respecte le changement de terrain au milieu.
        updateGame(game,.5/terrainSpeed(map,game.player,5));
        updateGame(game,.5/terrainSpeed(map,game.player,5));steps++;
      }
    }
    assert(game.won && game.score===map.collectibles.size*10);
  });
  return results;
}
