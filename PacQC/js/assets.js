import { sourceFrame } from './sprite-framing.js';
import { sprites } from './manifest.js';

// Un seul cache et une seule promesse de chargement pour toute l'application.
export const images = new Map();
let pending;
export function loadImages(onProgress = () => {}) {
  if (pending) return pending;
  pending = (async () => {
    const entries = Object.entries(sprites);
    const errors = [];
    let cursor = 0, completed = 0;
    // Limite les décodages simultanés des PNG de grande taille.
    async function worker() {
      while (cursor < entries.length) {
        const [id, definition] = entries[cursor++];
        try {
          const image = new Image();
          image.decoding = 'async';
          image.src = definition.url;
          await image.decode();
          images.set(id, image);
        } catch {
          errors.push(definition.file);
        }
        onProgress(++completed, entries.length);
      }
    }
    await Promise.all(Array.from({ length: 3 }, worker));
    return { images, errors };
  })();
  return pending;
}

// Taille nominale = plus grand côté. Cadrage transparent au rendu, original intact.
// Les décalages sont exprimés en pixels pour une taille nominale de 64 px.
export function drawSprite(ctx, id, x, y, size, overrides = {}) {
  const image = images.get(id);
  if (!image) {
    ctx.save(); ctx.strokeStyle = '#ff867f'; ctx.lineWidth = 2;
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
    ctx.beginPath(); ctx.moveTo(x - 8, y - 8); ctx.lineTo(x + 8, y + 8);
    ctx.moveTo(x + 8, y - 8); ctx.lineTo(x - 8, y + 8); ctx.stroke(); ctx.restore();
    return;
  }
  const config = { ...sprites[id].display, ...overrides[id] };
  const [sx, sy, sw, sh] = sourceFrame(id, image.naturalWidth, image.naturalHeight);
  const ratio = size * config.scale / Math.max(sw, sh);
  const width = sw * ratio, height = sh * ratio;
  ctx.drawImage(image, sx, sy, sw, sh, x - width / 2 + config.offsetX * size / 64,
    y - height / 2 + config.offsetY * size / 64, width, height);
}
