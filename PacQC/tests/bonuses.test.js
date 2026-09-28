import { LEVEL } from '../js/map.js';
import { DIFFICULTY } from '../js/difficulty.js';
import { createMap, actorPosition, isWalkable, requestDirection, cellKey } from '../js/movement.js';
import { createSession, startSession, updateSession, pauseSession, resumeSession, restartSession, STATES } from '../js/session.js';
import { activateBonus, playerSpeed, isVulnerable, isHarmless, eatGhost } from '../js/bonuses.js';
import { chooseGhostDirection } from '../js/ghosts.js';
import { ghostNeighbor } from '../js/navigation.js';
import { bonusSprite, ghostEffect } from '../js/renderer.js';

export function runBonusTests() {
  const results = [], map = createMap(LEVEL), rules = DIFFICULTY;
  const assert = (value, message = 'Assertion non satisfaite') => { if (!value) throw new Error(message); };
  const close = (a, b) => assert(Math.abs(a-b) < 1e-7, `${a} ≠ ${b}`);
  const test = (name, fn) => { try { fn(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: error.message }); } };
  function fresh(custom = rules) { const g=createSession(map,custom,42); startSession(g); updateSession(g,custom.countdown); for(const ghost of g.ghosts)ghost.release=1000; return g; }
  function place(ghost,x,y,direction='gauche') { Object.assign(ghost,{tile:{x,y},next:null,progress:0,direction,facing:direction,mode:'actif'}); }
  const same = (a,b) => a.x===b.x && a.y===b.y;

  test('Bonus : quatre cases accessibles distinctes, sans point ni départ superposé', () => {
    assert(map.bonusSpawns.size===4 && map.collectibles.size===271);
    for(const [key,bonus] of map.bonusSpawns) {
      assert(isWalkable(map,bonus.x,bonus.y) && !map.collectibles.has(key) && !same(bonus,map.spawn));
    }
    for(const bonus of [{type:'beer',x:0,y:0},{type:'coffee',x:11,y:11},{type:'beer',x:11,y:20},LEVEL.bonusSpawns[0]]) {
      let rejected=false;try{createMap({...LEVEL,bonusSpawns:[...LEVEL.bonusSpawns,bonus]});}catch{rejected=true;} assert(rejected);
    }
  });
  test('Balancement : centre, droite, centre, gauche pour les deux bonus', () => {
    for(const [type,prefix] of [['beer','bonus1'],['coffee','bonus2']]) {
      const actual=[0,1,2,3,4].map(i=>bonusSprite(type,i/rules.bonuses.swingRate));
      assert(actual.join(',')===[prefix,prefix+'_d',prefix,prefix+'_g',prefix].join(','));
    }
  });
  test('Ramassage réel du café : six secondes dès le centre, puis vitesse +25 %', () => {
    const game=fresh(); requestDirection(game,'gauche');updateSession(game,.4);
    close(game.effects.coffee,6);close(actorPosition(game.player).x,9);
    assert(!game.bonuses.has('9,20') && game.remaining.size===270 && game.score===10);
    updateSession(game,.08);close(actorPosition(game.player).x,8.5);close(game.effects.coffee,5.92);
  });
  test('Les deux effets sont simultanés ; un second ramassage restaure la durée sans empiler la puissance', () => {
    const game=fresh();activateBonus(game,'coffee');activateBonus(game,'beer');updateSession(game,1);
    close(game.effects.coffee,5);close(game.effects.beer,7);
    game.player.tile={x:9,y:20};updateSession(game,.1);
    close(game.effects.coffee,5.9);close(game.effects.beer,6.9);close(playerSpeed(game),6.25);
    game.player.tile={x:15,y:20};updateSession(game,.1);
    close(game.effects.beer,7.9);close(game.effects.coffee,5.8);close(playerSpeed(game),6.25);
  });
  test('Pause : durées, animations et retours visuels figés ; reprise sans rattrapage', () => {
    const game=fresh();activateBonus(game,'beer');activateBonus(game,'coffee');updateSession(game,.2);pauseSession(game);
    const snapshot=JSON.stringify(game);updateSession(game,50);assert(JSON.stringify(game)===snapshot);
    resumeSession(game);updateSession(game,.2);close(game.effects.beer,7.6);close(game.effects.coffee,5.6);
  });
  test('Expiration du café entre deux cases : position continue et vitesse normale retrouvée', () => {
    const game=fresh();requestDirection(game,'droite');updateSession(game,.05);
    close(actorPosition(game.player).x,11.25);activateBonus(game,'coffee');game.effects.coffee=.03;
    updateSession(game,.06);close(actorPosition(game.player).x,11.5875);close(actorPosition(game.player).y,20);
    close(game.effects.coffee,0);close(playerSpeed(game),5);
  });
  test('Expiration du café près d’un mur et dans le tunnel : aucun désalignement', () => {
    const wall=fresh();wall.player.tile={x:4,y:1};wall.player.next={x:5,y:1};wall.player.progress=.8;wall.player.direction='droite';wall.player.facing='droite';
    wall.effects.coffee=.01;updateSession(wall,.3);assert(same(wall.player.tile,{x:5,y:1}) && !wall.player.next);
    const tunnel=fresh();tunnel.player.tile={x:0,y:12};requestDirection(tunnel,'gauche');tunnel.effects.coffee=.03;
    updateSession(tunnel,.23);close(actorPosition(tunnel.player).x,21.8125);close(actorPosition(tunnel.player).y,12);
  });
  test('Le café seul ne protège pas des fantômes', () => {
    const game=fresh();activateBonus(game,'coffee');place(game.ghosts[0],11,20);updateSession(game,.01);
    assert(game.lives===2 && game.effects.coffee===0 && game.phase===STATES.COUNTDOWN);
  });
  test('Sous bière, les quatre fantômes choisissent le passage le plus éloigné du joueur', () => {
    const game=fresh();game.player.tile={x:1,y:5};activateBonus(game,'beer');
    for(const ghost of game.ghosts) {place(ghost,2,5);assert(chooseGhostDirection(game,ghost,rules)==='droite');}
  });
  test('Manger quatre fantômes simultanés rapporte 800 points une seule fois', () => {
    const game=fresh();activateBonus(game,'beer');for(const ghost of game.ghosts)place(ghost,11,20);
    updateSession(game,.01);assert(game.score===800 && game.lives===3 && game.ghosts.every(g=>g.mode==='retour'));
    updateSession(game,.01);assert(game.score===800 && game.lives===3);
  });
  test('Collision juste avant, exactement à et après l’expiration de la bière', () => {
    for(const [beer,expectedLives] of [[.52,3],[.51,2],[.50,2]]) {
      const game=fresh({...rules,fixedStep:1});game.player.tile={x:1,y:5};
      const ghost=game.ghosts[0];place(ghost,2,5);ghost.next={x:1,y:5};ghost.speed=1;
      game.effects.beer=beer;updateSession(game,.51);
      assert(game.lives===expectedLives,`Bière ${beer} : ${game.lives} vies`);
      if(expectedLives===3)assert(game.score===200 && game.ghosts[0].mode==='retour');
    }
  });
  test('Bière ramassée à l’expiration : renouvellement avant le contact au même instant', () => {
    const game=fresh({...rules,fixedStep:1});game.player.tile={x:14,y:20};requestDirection(game,'droite');
    const ghost=game.ghosts[0];place(ghost,14,20,'droite');ghost.next={x:15,y:20};ghost.progress=.69;ghost.speed=4;
    game.effects.beer=.2;updateSession(game,.2);
    assert(game.lives===3 && game.ghosts[0].mode==='retour' && !game.bonuses.has('15,20'));close(game.effects.beer,8);
  });
  test('Collision avant un bonus : aucun ramassage anticipé', () => {
    const game=fresh();game.player.tile={x:14,y:20};requestDirection(game,'droite');
    place(game.ghosts[0],15,20);updateSession(game,.2);
    assert(game.lives===2 && game.bonuses.has('15,20') && game.effects.beer===0);
  });
  test('Retour réel à la réserve, repos de deux secondes puis sortie vulnérable si la bière persiste', () => {
    const game=fresh();activateBonus(game,'beer');place(game.ghosts[0],11,8);eatGhost(game,game.ghosts[0]);
    let entered=null,left=null,active=false;const modes=new Set();
    for(let i=0;i<900;i++) {
      updateSession(game,1/120);const ghost=game.ghosts[0];modes.add(ghost.mode);
      if(ghost.next)assert(same(ghost.next,ghostNeighbor(map,ghost.tile,ghost.direction,['retour','sortie'].includes(ghost.mode))));
      if(ghost.mode==='regeneration') {assert(same(ghost.tile,ghost.home));if(entered===null)entered=game.roundTime;}
      if(entered!==null && ghost.mode==='sortie' && left===null)left=game.roundTime;
      if(ghost.mode==='actif') {active=true;assert(isVulnerable(game,ghost));break;}
    }
    assert(active && modes.has('retour') && modes.has('regeneration') && modes.has('sortie'));
    assert(Math.abs(left-entered-2)<1/60);assert(game.score===200 && game.lives===3);
  });
  test('Un fantôme en retour reste inoffensif après expiration de la bière et ne peut être remangé', () => {
    const game=fresh();activateBonus(game,'beer');place(game.ghosts[0],11,20);eatGhost(game,game.ghosts[0]);
    game.effects.beer=0;updateSession(game,.1);assert(game.lives===3 && game.score===200 && isHarmless(game.ghosts[0]));
    activateBonus(game,'beer');eatGhost(game,game.ghosts[0]);assert(game.score===200);
  });
  test('Retour depuis le tunnel, bière expirée : trajet légal puis réapparition normale', () => {
    const game=fresh();activateBonus(game,'beer');const ghost=game.ghosts[0];
    place(ghost,0,12);ghost.next={x:22,y:12};ghost.progress=.3;eatGhost(game,ghost);game.effects.beer=.1;
    let reappeared=false;
    for(let i=0;i<3600;i++) {
      updateSession(game,1/120);const current=game.ghosts[0];
      if(current.next)assert(same(current.next,ghostNeighbor(map,current.tile,current.direction,['retour','sortie'].includes(current.mode))));
      if(current.mode==='actif') {reappeared=true;assert(!isVulnerable(game,current));break;}
    }
    assert(reappeared && game.lives===3 && game.score===200 && game.effects.beer===0);
  });
  test('Mort : effets et retours visuels supprimés, bonus consommés conservés ; redémarrage : tout réinitialisé', () => {
    const game=fresh();game.player.tile={x:9,y:20};updateSession(game,.01);activateBonus(game,'beer');
    game.player.tile={x:1,y:5};game.effects.beer=.01;place(game.ghosts[0],2,5);game.ghosts[0].next={x:1,y:5};game.ghosts[0].speed=4;
    updateSession(game,.2);assert(game.lives===2 && game.effects.beer===0 && game.effects.coffee===0 && !game.feedback.length);
    assert(!game.bonuses.has('9,20'));restartSession(game);
    assert(game.bonuses.size===4 && game.effects.beer===0 && game.effects.coffee===0 && game.score===0 && game.lives===3);
  });
  test('Les bonus sont facultatifs : victoire avec les quatre bonus encore sur la carte', () => {
    const game=fresh();game.remaining=new Set(['12,20']);requestDirection(game,'droite');updateSession(game,.2);
    assert(game.phase===STATES.WON && game.bonuses.size===4 && game.remaining.size===0);
  });
  test('Halo vulnérable stable puis clignotant ; rendu distinct du retour ; fin de l’effet', () => {
    const game=fresh(),ghost=game.ghosts[0];place(ghost,1,5);activateBonus(game,'beer');
    assert(ghostEffect(game,ghost).kind==='vulnerable' && ghostEffect(game,ghost).alpha===1);
    game.effects.beer=1.9;const a=ghostEffect(game,ghost);game.effects.beer=1.7;const b=ghostEffect(game,ghost);
    assert(a.alpha!==b.alpha && a.kind==='vulnerable' && b.kind==='vulnerable');
    ghost.mode='retour';assert(ghostEffect(game,ghost).kind==='return');
    ghost.mode='actif';game.effects.beer=0;assert(ghostEffect(game,ghost).kind==='normal');
  });
  return results;
}
