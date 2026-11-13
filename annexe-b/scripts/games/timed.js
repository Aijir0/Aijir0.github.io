// Jeux chronométrés (15 s) : Défi express (chrono géant) et Catégories (bombe à mèche).
// Même moteur de compte à rebours ; seul le visuel change.
(function (A) {
  'use strict';
  const DURATION = 15;

  const VISUELS = {
    dare: {
      tag: 'Top chrono · défi',
      autre: 'Autre défi',
      fin: ['Temps écoulé !', 'Le groupe décide si le défi est réussi.'],
      html: '<svg class="anneau" viewBox="0 0 120 124" aria-hidden="true"><rect class="couronne" x="51" y="1" width="18" height="11" rx="3"/><circle class="anneau-fond" cx="60" cy="66" r="52"/><circle class="anneau-reste" id="anneau" cx="60" cy="66" r="52" pathLength="100" transform="rotate(-90 60 66)"/></svg>',
      maj(frac) { A.$('anneau').style.strokeDashoffset = String(100 - frac * 100); }
    },
    categories: {
      tag: 'Un mot · pas de doublon',
      autre: 'Autre thème',
      fin: ['Buzzer !', 'On passe au joueur suivant.'],
      html: '<svg class="bombe" viewBox="0 0 200 200" aria-hidden="true"><path class="meche-fond" d="M144 68C160 52 146 34 164 24S184 16 184 8"/><path class="meche" id="meche" d="M144 68C160 52 146 34 164 24S184 16 184 8" pathLength="100"/><rect class="bouchon" x="121" y="65" width="30" height="22" rx="5" transform="rotate(45 136 76)"/><circle class="corps" cx="88" cy="124" r="62"/><path class="reflet" d="M48 112a42 42 0 0 1 26-34"/><g id="etincelle" transform="translate(184 8)"><path class="etincelle" d="M0-13 3.5-3.5 13 0 3.5 3.5 0 13-3.5 3.5-13 0-3.5-3.5z"/></g></svg>',
      maj(frac) {
        const meche = A.$('meche');
        meche.style.strokeDasharray = `${(frac * 100).toFixed(2)} 200`;
        const p = meche.getPointAtLength(frac * meche.getTotalLength());
        A.$('etincelle').setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      }
    }
  };

  function render(root, kind) {
    const v = VISUELS[kind];
    root.innerHTML = `<div class="prompt-wrap chrono-jeu ${kind}"><div class="prompt-card reveal" id="promptCard"><small>${v.tag}</small><div class="question" id="timedPrompt">${A.esc(A.insecables(A.nextPrompt(kind)))}</div></div><div class="chrono" id="chrono">${v.html}<div class="timer" id="timerDisplay">15</div><div class="result tampon" id="gameResult" role="status" hidden></div></div><div class="button-row duo"><button type="button" class="secondary" id="newChallenge">${v.autre}</button><button type="button" class="primary" id="timerStart">Démarrer</button></div></div>`;

    const chrono = A.$('chrono'), affichage = A.$('timerDisplay'), bouton = A.$('timerStart'), resultat = A.$('gameResult');
    let seconds = DURATION, running = false, timerEnd = 0, derniereSeconde = DURATION;
    const update = (remaining) => {
      const s = Math.ceil(Math.max(0, remaining));
      affichage.textContent = String(s).padStart(2, '0');
      v.maj(Math.max(0, remaining / DURATION));
      const panique = remaining <= 5 && remaining > 0;
      chrono.classList.toggle('low', panique);
      // Sous 5 s, chaque seconde qui tombe fait sursauter le chiffre.
      if (panique && s !== derniereSeconde) {
        affichage.classList.remove('tic');
        void affichage.offsetWidth;
        affichage.classList.add('tic');
        A.beep(980, 0.05);
        A.vibre(15);
      }
      derniereSeconde = s;
    };
    const reset = () => {
      clearInterval(A.state.timer);
      A.state.timer = null;
      seconds = DURATION;
      running = false;
      chrono.classList.remove('fini');
      update(DURATION);
      bouton.textContent = 'Démarrer';
      resultat.hidden = true;
    };
    resultat.onclick = () => { resultat.hidden = true; };
    update(DURATION);

    bouton.onclick = () => {
      if (running) {
        clearInterval(A.state.timer);
        running = false;
        seconds = Math.max(0, (timerEnd - Date.now()) / 1000);
        bouton.textContent = 'Reprendre';
        return;
      }
      if (seconds <= 0) reset();
      running = true;
      timerEnd = Date.now() + seconds * 1000;
      bouton.textContent = 'Pause';
      A.beep(630, 0.08);
      A.state.timer = setInterval(() => {
        if (A.state.currentGame !== kind) { clearInterval(A.state.timer); return; }
        seconds = Math.max(0, (timerEnd - Date.now()) / 1000);
        update(seconds);
        if (seconds <= 0) {
          clearInterval(A.state.timer);
          running = false;
          bouton.textContent = 'Recommencer';
          chrono.classList.add('fini');
          resultat.innerHTML = `<strong class="tampon-nom">${v.fin[0]}</strong><span class="tampon-defi">${v.fin[1]}</span>`;
          resultat.hidden = false;
          A.beep(230, 0.28, 'square');
          A.vibre([120, 60, 200]);
          if (kind === 'categories') A.confetti(50);
        }
      }, 60);
    };

    A.$('newChallenge').onclick = () => {
      reset();
      A.$('timedPrompt').textContent = A.insecables(A.nextPrompt(kind));
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
