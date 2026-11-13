// Roulette du chaos : la roue choisit un joueur et lui tire un défi.
(function (A) {
  'use strict';
  const COLORS = ['#ff72ac', '#b291fa', '#8cdce5', '#d9f08c', '#ffc47d', '#f89d9d', '#ada4f7', '#8fe1cb', '#e9a1d6', '#dfbfff', '#c7ec8e', '#f4c994'];
  let rotation = 0, busy = false, spinToken = null;

  function render(root) {
    const players = A.state.players;
    root.innerHTML = `<div class="wheel-wrap"><div class="wheel-pointer" aria-hidden="true"></div><div id="wheel" class="wheel" aria-label="Roulette des joueurs"></div><div class="wheel-center" aria-hidden="true"></div></div><p class="wheel-lede">${players.length} joueurs dans la roue · <a href="#" id="wheelEdit">Modifier les noms</a></p><div class="button-row"><button class="primary" id="spinBtn">🎰 LANCER LA ROULETTE</button></div>${A.resultat()}`;
    A.$('wheelEdit').onclick = (e) => { e.preventDefault(); A.ouvrirJoueurs(); };
    const wheel = A.$('wheel');
    const n = players.length, segment = 360 / n;
    wheel.style.background = `conic-gradient(${players.map((_, i) => `${COLORS[i % COLORS.length]} ${i * segment}deg ${(i + 1) * segment}deg`).join(',')})`;
    wheel.style.transform = `rotate(${rotation}deg)`;
    players.forEach((p, i) => {
      const label = document.createElement('div');
      label.className = 'wheel-label';
      label.textContent = p;
      label.style.transform = `translate(-50%,-50%) rotate(${(i + 0.5) * segment}deg) translateY(calc(var(--wheelSize) * -.37)) rotate(${-(i + 0.5) * segment}deg)`;
      wheel.appendChild(label);
    });

    A.$('spinBtn').addEventListener('click', () => {
      if (busy) return;
      busy = true;
      const chosen = Math.floor(Math.random() * players.length);
      const dest = (360 - ((chosen + 0.5) * segment)) % 360;
      const delta = (dest - (rotation % 360) + 360) % 360;
      rotation += 360 * 5 + delta;
      wheel.style.transform = `rotate(${rotation}deg)`;
      A.$('spinBtn').disabled = true;
      A.$('spinBtn').textContent = '✨ ÇA TOURNE…';
      A.$('gameResult').hidden = true;
      A.beep(590, 0.11);
      const token = Symbol();
      spinToken = token;
      setTimeout(() => {
        busy = false;
        if (spinToken !== token || A.state.currentGame !== 'wheel') return;
        const task = A.sample(A.wheelTasks);
        A.$('gameResult').innerHTML = `🎯 <strong>${A.esc(players[chosen])}</strong> !<br>${A.esc(task)}<br><small>Tout défi peut être refusé ou remplacé.</small>`;
        A.$('gameResult').hidden = false;
        A.$('spinBtn').disabled = false;
        A.$('spinBtn').textContent = '🔁 REJOUER';
        A.beep(850, 0.19);
        A.confetti();
      }, 4350);
    });
  }

  A.register({
    id: 'wheel', ordre: 1, icone: '🎰', couleur: '#ff5ca5',
    titre: 'Roulette du chaos',
    sousTitre: 'Le hasard a choisi sa cible.',
    regle: 'Appuie sur la roulette : elle choisit une personne et lui donne un défi amusant.',
    init: render,
    // La liste des joueurs a changé : on redessine la roue, sauf pendant qu'elle tourne.
    joueursModifies(root) {
      if (busy) return;
      rotation = 0;
      render(root);
    }
  });
})(window.Arcade = window.Arcade || {});
