import { drawSprite } from './assets.js';
import { actors } from './manifest.js';
import { playerPosition, actorPosition } from './movement.js';
import { DIFFICULTY } from './difficulty.js';
import { isVulnerable } from './bonuses.js';

const TILE = 30;
// Ces tailles et les réglages du manifeste n'interviennent jamais dans les collisions.
export const VISUALS = Object.freeze({ player: 36, ghost: 32, collectible: 6, bonus: 27 });
const playerFrames = actors.find(actor => actor.id === 'joueur').directions;
export function playerSprite(player, active) {
  const frames = playerFrames[player.facing];
  const frame = active && player.moving ? Math.floor(player.animationTime * DIFFICULTY.mouthRate) % frames.length : 0;
  return frames[frame];
}

export function ghostSprite(ghost) {
  return actors.find(actor => actor.id === ghost.id).directions[ghost.facing][0];
}

export function bonusSprite(type, time, rules = DIFFICULTY) {
  const frames = actors.find(actor => actor.id === (type === 'beer' ? 'biere' : 'cafe')).frames;
  return frames[Math.floor(time * rules.bonuses.swingRate) % frames.length];
}

export function ghostEffect(game, ghost) {
  if (['retour', 'regeneration'].includes(ghost.mode)) return { kind: 'return', alpha: .38 };
  if (!isVulnerable(game, ghost)) return { kind: 'normal', alpha: 1 };
  const beer = game.rules.bonuses.beer;
  const blinking = game.effects.beer <= beer.blinkLast;
  const dim = blinking && Math.floor(game.effects.beer * beer.blinkHz * 2) % 2 === 0;
  return { kind: 'vulnerable', alpha: dim ? .28 : 1 };
}

function ring(ctx, x, y, radius, color, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.shadowColor = color; ctx.shadowBlur = 9; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}

// Contours de l'union des cases murales, plutôt qu'un quadrillage de blocs séparés.
export function wallContours(map) {
  const edges = [], outgoing = new Map();
  function edge(x, y, nx, ny, direction) {
    const item = { x, y, nx, ny, direction, used: false };
    edges.push(item);
    const key = `${x},${y}`;
    if (!outgoing.has(key)) outgoing.set(key, []);
    outgoing.get(key).push(item);
  }
  const wall = (x, y) => map.rows[y]?.[x] === '#';
  map.rows.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell !== '#') return;
    if (!wall(x, y - 1)) edge(x, y, x + 1, y, 0);
    if (!wall(x + 1, y)) edge(x + 1, y, x + 1, y + 1, 1);
    if (!wall(x, y + 1)) edge(x + 1, y + 1, x, y + 1, 2);
    if (!wall(x - 1, y)) edge(x, y + 1, x, y, 3);
  }));
  const loops = [];
  for (const first of edges) {
    if (first.used) continue;
    const points = [];
    let current = first;
    while (current && !current.used) {
      current.used = true; points.push({ x: current.x, y: current.y });
      if (current.nx === first.x && current.ny === first.y) break;
      const candidates = outgoing.get(`${current.nx},${current.ny}`) || [];
      const order = [1, 0, 3, 2]; // Priorité au virage droit aux contacts diagonaux.
      const direction = current.direction;
      current = candidates.filter(item => !item.used).sort((a, b) =>
        order.indexOf((a.direction - direction + 4) % 4) - order.indexOf((b.direction - direction + 4) % 4))[0];
    }
    if (!current) throw new Error('Contour de mur ouvert.');
    loops.push(points.filter((point, i) => {
      const before = points[(i + points.length - 1) % points.length], after = points[(i + 1) % points.length];
      return (point.x - before.x) * (after.y - point.y) !== (point.y - before.y) * (after.x - point.x);
    }));
  }
  return loops;
}

function roundedLoop(ctx, points) {
  const radius = 5;
  points.forEach((point, index) => {
    const previous = points[(index + points.length - 1) % points.length], next = points[(index + 1) % points.length];
    const x = point.x * TILE, y = point.y * TILE;
    const start = { x: x + Math.sign(previous.x - point.x) * radius, y: y + Math.sign(previous.y - point.y) * radius };
    const end = { x: x + Math.sign(next.x - point.x) * radius, y: y + Math.sign(next.y - point.y) * radius };
    if (index === 0) ctx.moveTo(start.x, start.y); else ctx.lineTo(start.x, start.y);
    ctx.quadraticCurveTo(x, y, end.x, end.y);
  });
  ctx.closePath();
}

export function createRenderer(canvas, map, settings) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponible dans ce navigateur.');
  const width = map.width * TILE, height = map.height * TILE;
  const layer = document.createElement('canvas'); layer.width = width * 2; layer.height = height * 2;
  const background = layer.getContext('2d'); background.scale(2, 2);
  background.fillStyle = '#050a13'; background.fillRect(0, 0, width, height);
  background.beginPath();
  for (const loop of wallContours(map)) roundedLoop(background, loop);
  background.fillStyle = '#0a1c3c'; background.fill('evenodd');
  background.strokeStyle = '#3479ff'; background.lineWidth = 2.1;
  background.lineJoin = 'round'; background.stroke();

  const reserve = [];
  for (const key of map.speedCells || []) {
    const [x, y] = key.split(',').map(Number);
    background.fillStyle = '#123f43'; background.fillRect(x * TILE, y * TILE, TILE, TILE);
    background.strokeStyle = '#56e6ce'; background.lineWidth = 2;
    // Marques sans flèche : aucune direction imposée par la zone.
    background.beginPath(); background.moveTo((x + .18) * TILE, (y + .8) * TILE);
    background.lineTo((x + .4) * TILE, (y + .2) * TILE);
    background.moveTo((x + .6) * TILE, (y + .8) * TILE);
    background.lineTo((x + .82) * TILE, (y + .2) * TILE); background.stroke();
  }
  for (const portal of map.portals || []) {
    const x = (portal.x + .5) * TILE, y = (portal.y + .5) * TILE;
    ring(background, x, y, 12, portal.id === 'A' ? '#dd91ff' : '#87cfff');
    background.fillStyle = '#ffffff'; background.font = 'bold 14px Segoe UI, sans-serif';
    background.textAlign = 'center'; background.fillText(portal.id, x, y + 5);
  }
  map.rows.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell === 'G') {
      background.fillStyle = '#171529'; background.fillRect(x * TILE, y * TILE, TILE, TILE); reserve.push({ x, y });
    }
    if (cell === '=') {
      background.strokeStyle = '#c590db'; background.lineWidth = 4; background.lineCap = 'round';
      background.beginPath(); background.moveTo((x + .12) * TILE, (y + .5) * TILE);
      background.lineTo((x + .88) * TILE, (y + .5) * TILE); background.stroke();
    }
  }));
  if (reserve.length) {
    const x = (Math.min(...reserve.map(p => p.x)) + Math.max(...reserve.map(p => p.x)) + 1) * TILE / 2;
    const y = (Math.min(...reserve.map(p => p.y)) + Math.max(...reserve.map(p => p.y)) + 1) * TILE / 2;
    background.fillStyle = '#a99ac1'; background.textAlign = 'center'; background.font = '10px Segoe UI, sans-serif';
    background.fillText('RÉSERVE', x, y - 30);
  }
  const dots = document.createElement('canvas'); dots.width = width * 2; dots.height = height * 2;
  const dotsCtx = dots.getContext('2d'); dotsCtx.scale(2, 2);
  let lastRemaining = null, lastCount = -1;
  return {
    draw(game, active) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const pixelWidth = Math.max(1, Math.round(rect.width * dpr)), pixelHeight = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) { canvas.width = pixelWidth; canvas.height = pixelHeight; }
      // Même facteur sur les deux axes ; centrage si les dimensions CSS sont arrondies.
      const scale = Math.min(pixelWidth / width, pixelHeight / height);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#050a13'; ctx.fillRect(0, 0, pixelWidth, pixelHeight);
      ctx.setTransform(scale, 0, 0, scale, (pixelWidth - width * scale) / 2, (pixelHeight - height * scale) / 2);
      ctx.drawImage(layer, 0, 0, width, height);
      if (lastRemaining !== game.remaining || lastCount !== game.remaining.size) {
        dotsCtx.clearRect(0, 0, width, height);
        for (const key of game.remaining) {
          const [x, y] = key.split(',').map(Number);
          drawSprite(dotsCtx, 'collectible', (x + .5) * TILE, (y + .5) * TILE, VISUALS.collectible, settings);
        }
        lastRemaining = game.remaining; lastCount = game.remaining.size;
      }
      ctx.drawImage(dots, 0, 0, width, height);
      for (const bonus of game.bonuses?.values() || []) {
        const x = (bonus.x + .5) * TILE, y = (bonus.y + .5) * TILE;
        ring(ctx, x, y, 12.5, bonus.type === 'beer' ? '#82e8ff' : '#ffc17b', .7);
        drawSprite(ctx, bonusSprite(bonus.type, game.roundTime, game.rules), x, y, VISUALS.bonus, settings);
      }
      const p = playerPosition(game), id = playerSprite(game.player, active);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, width, height); ctx.clip();
      if (game.effects?.coffee > 0) {
        for (const offset of p.y === map.tunnelRow ? [-map.width, 0, map.width] : [0]) {
          ring(ctx, (p.x + .5 + offset) * TILE, (p.y + .5) * TILE, 19, '#ffc17b');
        }
      }
      drawSprite(ctx, id, (p.x + .5) * TILE, (p.y + .5) * TILE, VISUALS.player, settings);
      // Copies aux bords : sortie et entrée continues, y compris pendant un demi-tour.
      if (p.y === map.tunnelRow) {
        drawSprite(ctx, id, (p.x + .5 - map.width) * TILE, (p.y + .5) * TILE, VISUALS.player, settings);
        drawSprite(ctx, id, (p.x + .5 + map.width) * TILE, (p.y + .5) * TILE, VISUALS.player, settings);
      }
      for (const ghost of game.ghosts || []) {
        const position = actorPosition(ghost), sprite = ghostSprite(ghost);
        const effect = ghostEffect(game, ghost);
        for (const offset of position.y === map.tunnelRow ? [-map.width, 0, map.width] : [0]) {
          const x = (position.x + .5 + offset) * TILE, y = (position.y + .5) * TILE;
          if (effect.kind === 'vulnerable') {
            ring(ctx, x, y, 18, '#82e8ff', effect.alpha);
            ring(ctx, x, y, 20, '#efffff', effect.alpha * .65);
          }
          ctx.save(); if (effect.kind === 'return') ctx.globalAlpha = effect.alpha;
          drawSprite(ctx, sprite, x, y, VISUALS.ghost, settings); ctx.restore();
          if (effect.kind === 'return') {
            ctx.fillStyle = '#d3eaff'; ctx.font = 'bold 7px Segoe UI, sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(ghost.mode === 'regeneration' ? 'REPOS' : 'RETOUR', x, y + 17);
          }
        }
      }
      for (const item of game.feedback || []) {
        const age = game.rules.bonuses.feedbackSeconds - item.ttl;
        const x = (item.x + .5) * TILE, y = (item.y + .5) * TILE;
        ring(ctx, x, y, 12 + age * 20, item.color, item.ttl / game.rules.bonuses.feedbackSeconds);
        ctx.save(); ctx.globalAlpha = Math.min(1, item.ttl * 2); ctx.textAlign = 'center';
        ctx.font = 'bold 12px Segoe UI, sans-serif'; ctx.lineWidth = 4; ctx.strokeStyle = '#050a13';
        ctx.strokeText(item.text, x, y - 20 - age * 12); ctx.fillStyle = item.color; ctx.fillText(item.text, x, y - 20 - age * 12); ctx.restore();
      }
      ctx.restore();
    },
  };
}
