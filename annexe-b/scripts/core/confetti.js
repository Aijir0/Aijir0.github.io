// Pluie de confettis en CSS, absente si le mouvement réduit est demandé.
(function (A) {
  'use strict';
  const COLORS = ['#d8ff76', '#ff5ca5', '#81e8f5', '#ac83ff', '#ffb567'];
  A.confetti = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < 32; i++) {
      const el = document.createElement('i');
      el.className = 'confetti';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = '-20px';
      el.style.background = COLORS[i % COLORS.length];
      el.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 160)}px`);
      el.style.setProperty('--rot', `${Math.round(Math.random() * 900)}deg`);
      el.style.animationDelay = `${Math.random() * 0.45}s`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }
  };
})(window.Arcade = window.Arcade || {});
