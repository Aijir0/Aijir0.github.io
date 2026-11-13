// Pluie de confettis cernés d'encre (rectangles, ronds, losanges), absente si le mouvement réduit est demandé.
(function (A) {
  'use strict';
  const COLORS = ['var(--rose)', 'var(--soleil)', 'var(--piscine)', 'var(--menthe)', 'var(--orange)', 'var(--pomme)'];
  const FORMES = ['2px', '50%', '2px 50%'];
  A.confetti = (nombre = 70) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < nombre; i++) {
      const el = document.createElement('i');
      el.className = 'confetti';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.background = COLORS[i % COLORS.length];
      el.style.borderRadius = FORMES[i % FORMES.length];
      el.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 220)}px`);
      el.style.setProperty('--rot', `${Math.round(Math.random() * 1080 - 540)}deg`);
      el.style.setProperty('--d', `${(1.6 + Math.random() * 1.1).toFixed(2)}s`);
      el.style.animationDelay = `${(Math.random() * 0.4).toFixed(2)}s`;
      frag.appendChild(el);
      setTimeout(() => el.remove(), 3300);
    }
    document.body.appendChild(frag);
  };
})(window.Arcade = window.Arcade || {});
