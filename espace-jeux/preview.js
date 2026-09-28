// Ordre visuel vérifié : gauche prononcée, gauche légère, centre,
// droite légère, droite prononcée. Liste explicite, jamais de tri de fichiers.
// Si vous adoptez 1.png…5.png, remplacez ici les cinq chemins dans cet ordre.
export const FRAME_PATHS = [
  '../PacQC/assets/front1.png',
  '../PacQC/assets/front2.png',
  '../PacQC/assets/front3.png',
  '../PacQC/assets/front4.png',
  '../PacQC/assets/front5.png',
];
export const FRAME_DURATION_MS = 140;
export const SEQUENCE = [0, 1, 2, 3, 4, 4, 3, 2, 1, 0];

export function mountPreview(target, {
  doc = document, win = window, ImageClass = Image,
  clock = window, duration = FRAME_DURATION_MS,
} = {}) {
  const preference = win.matchMedia('(prefers-reduced-motion: reduce)');
  let frames = [], timer = null, position = 0, complete = false;
  let disposed = false, pageActive = true;
  const delay = Number.isFinite(duration) && duration > 0 ? duration : FRAME_DURATION_MS;
  function stop() {
    if (timer !== null) clock.clearTimeout(timer);
    timer = null;
  }
  function show(index) {
    frames.forEach((image, i) => { if (image) image.style.visibility = i === index ? 'visible' : 'hidden'; });
  }
  function tick() {
    timer = null;
    position = (position + 1) % SEQUENCE.length;
    show(SEQUENCE[position]);
    timer = clock.setTimeout(tick, delay);
  }
  function sync() {
    stop();
    if (disposed || !frames.length) return;
    if (!complete || preference.matches) {
      show(frames[2] ? 2 : frames.findIndex(Boolean));
      return;
    }
    show(SEQUENCE[position]);
    if (!doc.hidden && pageActive) timer = clock.setTimeout(tick, delay);
  }
  const hide = () => { pageActive = false; stop(); };
  const reveal = () => { pageActive = true; sync(); };
  doc.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
  win.addEventListener('pagehide', hide);
  win.addEventListener('pageshow', reveal);
  // Un seul chargement et décodage par image. Les mêmes nœuds restent ensuite
  // dans le cadre : aucune réaffectation de src pendant les cycles.
  const ready = Promise.all(FRAME_PATHS.map(path => new Promise(resolve => {
    const image = new ImageClass();
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.style.visibility = 'hidden';
    image.onload = async () => {
      try { await image.decode(); resolve(image); } catch { resolve(null); }
    };
    image.onerror = () => resolve(null);
    image.src = new URL(path, import.meta.url).href;
  }))).then(loaded => {
    if (disposed) return;
    frames = loaded;
    complete = frames.every(Boolean);
    for (const image of frames) if (image) target.append(image);
    if (frames.some(Boolean)) target.querySelector('.preview-fallback')?.remove();
    sync();
  });
  return { ready, dispose() {
    disposed = true; stop();
    doc.removeEventListener('visibilitychange', sync);
    preference.removeEventListener('change', sync);
    win.removeEventListener('pagehide', hide);
    win.removeEventListener('pageshow', reveal);
  } };
}

if (typeof document !== 'undefined') {
  const target = document.getElementById('pac-preview');
  if (target) mountPreview(target);
}
