// Jeux chronométrés (15 s) : Défi express et Catégories partagent le même compte à rebours.
(function (A) {
  'use strict';
  const DURATION = 15;

  function render(root, kind) {
    const isDare = kind === 'dare';
    root.innerHTML = `<div class="prompt-wrap"><div class="prompt-card reveal" id="promptCard"><small>${isDare ? 'TOP CHRONO · DÉFI' : 'UN MOT · PAS DE DOUBLON'}</small><p id="timedPrompt">${A.esc(A.nextPrompt(kind))}</p><div class="prompt-foot">${isDare ? 'Vous avez 15 secondes.' : '15 secondes pour donner un mot.'}</div></div><div class="timer" id="timerDisplay">15</div><div class="timer-track" aria-hidden="true"><div class="timer-progress" id="timerProgress"></div></div><div class="button-row"><button class="primary" id="timerStart">▶ DÉMARRER</button><button class="secondary" id="newChallenge">↻ AUTRE ${isDare ? 'DÉFI' : 'THÈME'}</button></div>${A.resultat()}</div>`;

    let seconds = DURATION, running = false, timerEnd = 0;
    const update = (remaining) => {
      A.$('timerDisplay').textContent = String(Math.ceil(Math.max(0, remaining))).padStart(2, '0');
      A.$('timerProgress').style.width = `${Math.max(0, remaining / DURATION * 100)}%`;
      A.$('timerDisplay').classList.toggle('low', remaining <= 5);
      A.$('timerProgress').classList.toggle('low', remaining <= 5);
    };
    const reset = () => {
      clearInterval(A.state.timer);
      A.state.timer = null;
      seconds = DURATION;
      running = false;
      update(DURATION);
      A.$('timerStart').textContent = '▶ DÉMARRER';
      A.$('gameResult').hidden = true;
    };

    A.$('timerStart').onclick = () => {
      if (running) {
        clearInterval(A.state.timer);
        running = false;
        seconds = Math.max(0, (timerEnd - Date.now()) / 1000);
        A.$('timerStart').textContent = '▶ REPRENDRE';
        return;
      }
      if (seconds <= 0) seconds = DURATION;
      running = true;
      timerEnd = Date.now() + seconds * 1000;
      A.$('timerStart').textContent = '⏸ PAUSE';
      A.beep(630, 0.08);
      A.state.timer = setInterval(() => {
        if (A.state.currentGame !== kind) { clearInterval(A.state.timer); return; }
        seconds = Math.max(0, (timerEnd - Date.now()) / 1000);
        update(seconds);
        if (seconds <= 0) {
          clearInterval(A.state.timer);
          running = false;
          A.$('timerStart').textContent = '↻ RECOMMENCER';
          A.$('gameResult').innerHTML = isDare
            ? '⏱️ <strong>Temps écoulé !</strong> Le groupe décide si le défi est réussi.'
            : '💥 <strong>Buzzer !</strong> On passe au joueur suivant.';
          A.$('gameResult').hidden = false;
          A.beep(230, 0.28, 'square');
        }
      }, 60);
    };

    A.$('newChallenge').onclick = () => {
      reset();
      A.$('timedPrompt').textContent = A.nextPrompt(kind);
      const c = A.$('promptCard');
      c.classList.remove('reveal');
      void c.offsetWidth; // relance l'animation d'apparition
      c.classList.add('reveal');
      A.beep(690, 0.07);
    };
  }

  A.register({
    id: 'dare', ordre: 5, icone: 'assets/icons/dare.svg', couleur: 'var(--orange)',
    titre: 'Défi express',
    sousTitre: '15 secondes pour briller.',
    regle: 'Un défi, un compte à rebours. Le groupe juge si le défi est réussi.',
    init: (root) => render(root, 'dare')
  });
  A.register({
    id: 'categories', ordre: 7, icone: 'assets/icons/categories.svg', couleur: 'var(--peche)',
    titre: 'Catégories',
    sousTitre: 'Trouve des mots avant le buzzer.',
    regle: 'À tour de rôle, donnez un mot lié au thème. Aucun doublon, et seulement 15 secondes par tour.',
    init: (root) => render(root, 'categories')
  });
})(window.Arcade = window.Arcade || {});
