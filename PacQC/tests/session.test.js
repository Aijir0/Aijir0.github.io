import { LEVEL } from '../js/map.js';
import { DIFFICULTY } from '../js/difficulty.js';
import { createMap, createGame, actorPosition, isWalkable, cellKey, DIRECTIONS } from '../js/movement.js';
import { accessibleTarget, ghostNeighbor } from '../js/navigation.js';
import { createGhosts, ghostTarget, chooseGhostDirection, updateGhost } from '../js/ghosts.js';
import { ghostSprite } from '../js/renderer.js';
import { firstContact } from '../js/collisions.js';
import { createSession, STATES, startSession, pauseSession, resumeSession, restartSession, steerSession, updateSession } from '../js/session.js';
import { mountGame } from '../js/controller.js';

export function runSessionTests() {
  const results = [], map = createMap(LEVEL), rules = DIFFICULTY;
  const assert = (value, message = 'Assertion non satisfaite') => { if (!value) throw new Error(message); };
  const close = (a, b) => assert(Math.abs(a - b) < 1e-7, `${a} ≠ ${b}`);
  const test = (name, check) => { try { check(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: error.message }); } };
  const same = (a, b) => a.x === b.x && a.y === b.y;
  const fresh = () => createSession(map, rules, 2026);
  const playing = () => { const game = fresh(); startSession(game); updateSession(game, rules.countdown); return game; };
  function place(ghost, x, y, direction = null) {
    Object.assign(ghost, { tile: { x, y }, next: null, progress: 0, direction, facing: direction || 'haut', mode: 'actif' });
  }
  const segment = (from, to, start = 0, end = 1) => ({ from, to, start, end });
  function forceContact(game) { for (const ghost of game.ghosts) place(ghost, game.player.tile.x, game.player.tile.y); updateSession(game, .01); }

  test('Accueil : trois vies, aucun déplacement ; départ avec compte à rebours', () => {
    const game = fresh(), before = JSON.stringify(game);
    updateSession(game, 20); assert(JSON.stringify(game) === before);
    assert(game.lives === 3 && game.phase === STATES.HOME);
    startSession(game); steerSession(game, 'droite'); updateSession(game, 2);
    assert(game.phase === STATES.COUNTDOWN && game.countdown === 1);
    assert(game.ghosts.every(g => g.mode === 'attente') && same(game.player.tile, map.spawn));
    updateSession(game, 1.1); assert(game.phase === STATES.PLAY); close(actorPosition(game.player).x, 11.5);
  });
  test('Sorties échelonnées depuis la réserve, sans téléportation', () => {
    const game = createGame(map), ghosts = createGhosts(map, rules, 2026), first = new Map();
    for (let tick = 0; tick < 1800; tick++) for (const ghost of ghosts) {
      const before = actorPosition(ghost); updateGhost(game, ghost, 1/120, tick/120, rules);
      const after = actorPosition(ghost);
      const dx = Math.min(Math.abs(after.x-before.x), Math.abs(Math.abs(after.x-before.x)-map.width));
      assert(Math.hypot(dx,after.y-before.y) <= Math.max(rules.exitSpeed,ghost.speed)/120 + 1e-7);
      if (Math.hypot(dx,after.y-before.y) > 1e-8 && !first.has(ghost.id)) first.set(ghost.id, tick/120);
    }
    for (const ghost of ghosts) { assert(ghost.mode === 'actif'); close(first.get(ghost.id), ghost.release); }
  });
  test('CSI cible la case du joueur ; PCQ vise quatre cases accessibles devant', () => {
    const game = fresh(); game.player.tile = { x: 1, y: 5 }; game.player.facing = 'droite';
    assert(same(ghostTarget(game, game.ghosts[0], rules), { x: 1, y: 5 }));
    assert(same(ghostTarget(game, game.ghosts[1], rules), { x: 5, y: 5 }));
    game.player.tile = { x: 5, y: 1 }; // Mur immédiatement devant.
    assert(same(ghostTarget(game, game.ghosts[1], rules), { x: 5, y: 1 }));
    game.player.tile = { x: 22, y: 12 };
    assert(same(ghostTarget(game, game.ghosts[1], rules), { x: 3, y: 12 }));
  });
  test('Toute cible hors carte, dans un mur ou dans la réserve est corrigée', () => {
    for (const target of [{x:-20,y:80},{x:200,y:-1},{x:0,y:0},{x:11,y:11},{x:NaN,y:1}]) {
      const result = accessibleTarget(map, target); assert(isWalkable(map,result.x,result.y));
    }
  });
  test('SAGIR patrouille, poursuit à proximité, puis décroche avec hystérésis', () => {
    const game = fresh(), ghost = game.ghosts[2]; place(ghost,1,5);
    game.player.tile={x:21,y:1}; let target=ghostTarget(game,ghost,rules);
    assert(!ghost.chasing && map.patrol.some(p=>same(accessibleTarget(map,p),target)));
    game.player.tile={x:5,y:5}; assert(same(ghostTarget(game,ghost,rules),game.player.tile) && ghost.chasing);
    game.player.tile={x:8,y:5}; ghostTarget(game,ghost,rules); assert(ghost.chasing);
    game.player.tile={x:12,y:5}; ghostTarget(game,ghost,rules); assert(!ghost.chasing);
  });
  test('Teams varie ses choix avec une séquence reproductible et sans demi-tour arbitraire', () => {
    const a=fresh(), b=fresh(), choices=new Set(); place(a.ghosts[3],3,5,'droite'); place(b.ghosts[3],3,5,'droite');
    for(let i=0;i<80;i++) {
      const direction=chooseGhostDirection(a,a.ghosts[3],rules);
      assert(direction===chooseGhostDirection(b,b.ghosts[3],rules));
      assert(direction!=='gauche'); choices.add(direction);
    }
    assert(choices.size>=2);
  });
  test('Les décisions sont prises aux centres ; demi-tour autorisé seulement dans une impasse', () => {
    const game=fresh(), ghost=game.ghosts[0]; place(ghost,2,5,'droite');
    updateGhost(game,ghost,.01,10,rules); const decisions=ghost.decisions, direction=ghost.direction;
    game.player.tile={x:1,y:1}; updateGhost(game,ghost,.01,10.01,rules);
    assert(ghost.decisions===decisions && ghost.direction===direction);
    place(ghost,1,23,'bas'); assert(chooseGhostDirection(game,ghost,rules)==='haut');
  });
  test('Fantômes : 48 000 pas légaux, alignés, réserve non réintégrée après sortie', () => {
    const game=fresh(), exited=new Set();
    for(let tick=0;tick<12000;tick++) for(const ghost of game.ghosts) {
      updateGhost(game,ghost,1/120,tick/120,rules);
      if(ghost.mode==='actif')exited.add(ghost.id);
      if(exited.has(ghost.id))assert(isWalkable(map,ghost.tile.x,ghost.tile.y));
      if(ghost.next)assert(same(ghost.next,ghostNeighbor(map,ghost.tile,ghost.direction,ghost.mode==='sortie')));
      const pos=actorPosition(ghost);
      assert(Math.abs(pos.x-Math.round(pos.x))<1e-7 || Math.abs(pos.y-Math.round(pos.y))<1e-7);
      assert(ghost.progress>=0 && ghost.progress<1);
    }
    assert(exited.size===4);
  });
  test('Chaque image de fantôme correspond au sens réel de déplacement', () => {
    const game=fresh();
    game.ghosts.forEach((ghost,index)=>{
      for(const [direction,suffix] of Object.entries({bas:'b',droite:'d',gauche:'g',haut:'h'})) {
        ghost.facing=direction; assert(ghostSprite(ghost)===`ennemi${index+1}_${suffix}`);
      }
    });
  });
  test('Le fantôme traverse le tunnel dans les deux sens', () => {
    const game=fresh(), ghost=game.ghosts[0];
    for(const [x,direction,expected] of [[0,'gauche',22],[22,'droite',0]]) {
      place(ghost,x,12,direction); game.player.tile={x:expected,y:12};
      updateGhost(game,ghost,1/ghost.speed,10,rules); assert(same(ghost.tile,{x:expected,y:12}));
    }
  });
  test('Collision balayée : croisement rapide, perpendiculaire et contact au repos', () => {
    const p=[segment({x:1,y:5},{x:3,y:5})], g=[segment({x:3,y:5},{x:1,y:5})];
    const hit=firstContact(p,g,map,.49); assert(hit>0 && hit<.5);
    assert(firstContact(p,[segment({x:2,y:4},{x:2,y:6})],map,.49)<.5);
    close(firstContact([segment({x:1,y:5},{x:1,y:5})],[segment({x:1,y:5},{x:1,y:5})],map,.49),0);
    assert(firstContact(p,[segment({x:1,y:7},{x:3,y:7})],map,.49)===Infinity);
  });
  test('Collision dans le tunnel et aucun faux balayage à travers toute la carte', () => {
    const p=[segment({x:0,y:12},{x:-1,y:12})], opposite=[segment({x:22,y:12},{x:23,y:12})];
    assert(firstContact(p,opposite,map,.49)<.5);
    assert(firstContact(p,[segment({x:11,y:12},{x:11,y:12})],map,.49)===Infinity);
    const turn=[segment({x:1,y:1},{x:2,y:1},0,.5),segment({x:2,y:1},{x:2,y:2},.5,1)];
    assert(firstContact(turn,[segment({x:1.5,y:1.5},{x:1.5,y:1.5})],map,.2)===Infinity);
  });
  test('Quatre contacts simultanés retirent une seule vie et conservent les points', () => {
    const game=playing(); game.remaining.delete('1,1'); game.score=10;
    forceContact(game); assert(game.lives===2 && game.deaths===1 && game.phase===STATES.COUNTDOWN);
    assert(game.score===10 && !game.remaining.has('1,1'));
    assert(same(game.player.tile,map.spawn) && game.player.direction===null);
    assert(game.ghosts.every((g,i)=>g.mode==='attente' && same(g.tile,map.ghostHome.starts[i])));
    updateSession(game,1); assert(game.lives===2 && game.countdown===2);
  });
  test('Trois morts produisent une défaite stable, sans vie négative', () => {
    const game=playing();
    for(let i=0;i<3;i++) { forceContact(game); if(i<2)updateSession(game,rules.countdown); }
    assert(game.lives===0 && game.phase===STATES.LOST);
    const before=JSON.stringify(game); updateSession(game,100); assert(JSON.stringify(game)===before);
  });
  test('Croisement à vitesse élevée dans une vraie session : une vie perdue', () => {
    const custom={...rules,playerSpeed:200,fixedStep:.04}; const game=createSession(map,custom,2026);
    startSession(game);updateSession(game,custom.countdown);game.player.tile={x:1,y:5};
    place(game.ghosts[0],3,5,'gauche');game.ghosts[0].next={x:2,y:5};game.ghosts[0].speed=200;
    steerSession(game,'droite');updateSession(game,.04);
    assert(game.lives===2 && game.phase===STATES.COUNTDOWN);
  });
  test('Pause du jeu et du compte à rebours : temps, sorties et positions figés', () => {
    const game=fresh(); startSession(game); updateSession(game,1.25); pauseSession(game);
    const before=JSON.stringify(game); updateSession(game,30); steerSession(game,'droite'); pauseSession(game);
    assert(JSON.stringify(game)===before); resumeSession(game); close(game.countdown,1.75);
    updateSession(game,1.85); pauseSession(game); const playingBefore=JSON.stringify(game);
    updateSession(game,40); assert(JSON.stringify(game)===playingBefore); resumeSession(game); assert(game.phase===STATES.PLAY);
  });
  test('Victoire au dernier collectible : score et simulation ensuite figés', () => {
    const game=playing(); game.remaining=new Set(['12,20']); game.score=2700;
    steerSession(game,'droite'); updateSession(game,.3);
    assert(game.phase===STATES.WON && game.score===2710 && game.remaining.size===0);
    const before=JSON.stringify(game); updateSession(game,30); assert(JSON.stringify(game)===before);
  });
  test('Un contact avant le dernier point empêche la victoire et annule la collecte tardive', () => {
    const custom={...rules, fixedStep:.3}; const game=createSession(map,custom,2026);
    startSession(game); updateSession(game,custom.countdown);
    game.remaining=new Set(['12,20']); game.score=2700;
    place(game.ghosts[0],12,20,'gauche'); game.ghosts[0].next={x:11,y:20};
    steerSession(game,'droite'); updateSession(game,.3);
    assert(game.lives===2 && !game.won && game.phase===STATES.COUNTDOWN);
    assert(game.score===2700 && game.remaining.has('12,20'));
  });
  test('Vingt redémarrages réinitialisent vies, score, objets, commandes, sorties et hasard', () => {
    const game=fresh(); restartSession(game); const expected=JSON.stringify(game);
    for(let i=0;i<20;i++) {
      updateSession(game,3.5); steerSession(game,'gauche'); game.remaining.delete('1,1'); game.score=900; game.lives=1; pauseSession(game);
      restartSession(game); assert(JSON.stringify(game)===expected);
    }
  });

  test('Contrôleur : pause sur onglet masqué, reprise explicite, un seul RAF après 20 redémarrages', () => {
    // Adaptateur DOM minimal : on teste les vrais écouteurs et la vraie boucle du contrôleur.
    class Target {
      constructor(){this.listeners=new Map();this.value='';this.textContent='';}
      addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
      removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
      emit(type,event={}){for(const fn of this.listeners.get(type)||[])fn(event);}
      focus(){doc.activeElement=this;this.emit('focus');}
    }
    const doc=new Target(), win=new Target(), elements=new Map(); doc.hidden=false;
    doc.getElementById=id=>{if(!elements.has(id))elements.set(id,new Target());return elements.get(id);};
    const queue=new Map();let sequence=0,time=0;
    win.requestAnimationFrame=fn=>{queue.set(++sequence,fn);return sequence;}; win.cancelAnimationFrame=id=>queue.delete(id);
    const frame=()=>{assert(queue.size===1,'RAF dupliqué');const [id,fn]=queue.entries().next().value;queue.delete(id);time+=1000/60;fn(time);};
    const game=fresh(), controller=mountGame(game,{draw(){}},doc,win), $=doc.getElementById;
    const listenerCount=()=>[...elements.values(),doc,win].reduce((total,e)=>total+[...e.listeners.values()].reduce((n,s)=>n+s.size,0),0);
    const baseline=listenerCount(); $('play').emit('click');frame();frame();
    doc.hidden=true;doc.emit('visibilitychange'); const frozen=game.countdown;
    doc.hidden=false;doc.emit('visibilitychange');win.emit('focus');$('game').emit('focus');
    let prevented=false;$('game').emit('keydown',{key:'ArrowRight',code:'ArrowRight',preventDefault(){prevented=true;}});
    for(let i=0;i<180;i++)frame();
    assert(prevented && game.phase===STATES.PAUSE && game.countdown===frozen);
    $('play').emit('click');frame();frame();assert(game.phase===STATES.COUNTDOWN && game.countdown<frozen);
    for(let i=0;i<20;i++){ $('restart').emit('click');frame();assert(queue.size===1 && listenerCount()===baseline && game.lives===3); }
    let touchPrevented=false;
    $('move-left').emit('pointerdown',{preventDefault(){touchPrevented=true;}});
    assert(touchPrevented && game.player.requested==='gauche' && doc.activeElement===$('game'));
    $('move-right').emit('pointerdown',{preventDefault(){}});
    assert(game.player.requested==='droite' && game.phase===STATES.COUNTDOWN);
    $('pause').emit('click');
    $('move-up').emit('pointerdown',{preventDefault(){}});
    assert(game.phase===STATES.PAUSE,'Le tactile ne reprend pas une partie en pause');
    controller.dispose();assert(queue.size===0 && listenerCount()===0);
  });
  return results;
}
