// Roulette du chaos : roue de loterie de foire qui choisit un joueur et lui tire un défi.
(function (A) {
  'use strict';
  const COULEURS = ['var(--rose)', 'var(--soleil)', 'var(--piscine)', 'var(--menthe)', 'var(--orange)', 'var(--papier)'];
  const DUREE = 4200;                 // ms, identique à la transition de .roue-disque
  const R = 166;                      // rayon des cases, repère SVG -170..170
  const TEXTE_FIN = 148, TEXTE_DEBUT = 34; // zone des prénoms, le long du rayon
  const AMPOULES = 24;
  let rotation = 0, busy = false, spinToken = null;

  const pt = (deg, r) => {
    const a = deg * Math.PI / 180;
    return `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`;
  };

  function cadreSvg() {
    let bulbes = '', reflets = '';
    for (let i = 0; i < AMPOULES; i++) {
      const a = i * 2 * Math.PI / AMPOULES, x = (200 + 184 * Math.sin(a)).toFixed(1), y = (200 - 184 * Math.cos(a)).toFixed(1);
      bulbes += `<circle class="ampoule" cx="${x}" cy="${y}" r="7.5"/>`;
      reflets += `<circle cx="${(x - 2.2).toFixed(1)}" cy="${(y - 2.2).toFixed(1)}" r="2.2"/>`;
    }
    return `<svg class="ampoules" viewBox="0 0 400 400" aria-hidden="true"><circle cx="207" cy="208" r="198" fill="var(--encre)"/><circle cx="200" cy="200" r="198" fill="var(--encre)"/><circle cx="200" cy="200" r="171" fill="none" stroke="var(--soleil)" stroke-width="3"/><g>${bulbes}</g><g fill="#fff" opacity=".85">${reflets}</g></svg>`;
  }

  const AIGUILLE = '<svg class="aiguille" viewBox="0 0 40 60" aria-hidden="true"><path d="M12 19a11 11 0 1 1 22 0L23 59z" fill="var(--encre)"/><path d="M9 16a11 11 0 1 1 22 0L20 56z" fill="var(--soleil)" stroke="var(--encre)" stroke-width="3" stroke-linejoin="round"/><circle cx="20" cy="14" r="4" fill="var(--encre)"/></svg>';

  function disqueSvg(players) {
    const n = players.length, seg = 360 / n;
    let cases = '', picots = '', noms = '';
    players.forEach((p, i) => {
      let c = COULEURS[i % COULEURS.length];
      if (i === n - 1 && c === COULEURS[0]) c = COULEURS[2]; // jamais deux cases voisines de même couleur
      cases += `<path d="M0 0L${pt(i * seg, R)}A${R} ${R} 0 0 1 ${pt((i + 1) * seg, R)}Z" style="fill:${c}"/>`;
      picots += `<circle class="picot" r="4.5" transform="rotate(${i * seg}) translate(0 ${-(R - 10)})"/>`;
      // Prénom le long du rayon ; sur la moitié gauche, retourné pour rester lisible.
      const milieu = (i + 0.5) * seg, gauche = milieu > 180;
      noms += `<text transform="rotate(${gauche ? milieu + 90 : milieu - 90})" x="${gauche ? -TEXTE_FIN : TEXTE_FIN}" text-anchor="${gauche ? 'start' : 'end'}" dominant-baseline="central">${A.esc(p)}</text>`;
    });
    return `<svg viewBox="-170 -170 340 340" aria-hidden="true">${cases}${picots}${noms}</svg>`;
  }

  // Taille de chaque prénom : la plus grande qui tient en longueur et dans la largeur de sa case. Jamais coupé.
  function ajusterNoms(svg, n) {
    const demiAngle = Math.sin(Math.min(180 / n, 90) * Math.PI / 180);
    const dispo = TEXTE_FIN - TEXTE_DEBUT;
    svg.querySelectorAll('text').forEach((t) => {
      t.removeAttribute('textLength');
      t.style.fontSize = '30px';
      const l30 = t.getComputedTextLength() || t.textContent.length * 16;
      let fs = 30;
      const tient = (f) => {
        const l = l30 * f / 30;
        return l <= dispo && f <= 1.6 * (TEXTE_FIN - l) * demiAngle;
      };
      while (fs > 13 && !tient(fs)) fs--;
      t.style.fontSize = fs + 'px';
      if (l30 * fs / 30 > dispo) { t.setAttribute('textLength', dispo); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
    });
  }

  // L'aiguille claque à chaque case qui passe dessous.
  function suivreAiguille(disque, aiguille, seg, token) {
    let precedente = null, dernierClac = 0;
    const tick = (now) => {
      if (spinToken !== token || !disque.isConnected) return;
      const m = new DOMMatrixReadOnly(getComputedStyle(disque).transform);
      const angle = Math.atan2(m.b, m.a) * 180 / Math.PI;
      const sous = Math.floor((((-angle) % 360) + 360) % 360 / seg);
      if (precedente !== null && sous !== precedente) {
        aiguille.animate([
          { transform: 'translateX(-50%) rotate(0deg)' },
          { transform: 'translateX(-50%) rotate(-28deg)', offset: 0.25 },
          { transform: 'translateX(-50%) rotate(0deg)' }
        ], { duration: 170, easing: 'ease-out' });
        if (now - dernierClac > 45) { A.beep(1500, 0.025, 'square'); A.vibre(6); dernierClac = now; }
      }
      precedente = sous;
      if (busy) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function render(root) {
    const players = A.state.players, n = players.length, seg = 360 / n;
    root.innerHTML = `<div class="roue-zone"><div class="roue-cadre" id="roueCadre" data-etat="repos">${cadreSvg()}<div class="roue" id="roue"><div class="roue-disque" id="wheel">${disqueSvg(players)}</div></div><div class="roue-moyeu" aria-hidden="true"></div>${AIGUILLE}<div class="result tampon" id="gameResult" role="status" hidden></div></div></div><p class="wheel-lede">${n} joueurs dans la roue · <a href="#" id="wheelEdit">Modifier les noms</a></p><div class="button-row"><button type="button" class="primary" id="spinBtn">Lancer la roue</button></div>`;
    A.$('wheelEdit').onclick = (e) => { e.preventDefault(); A.ouvrirJoueurs(); };

    const cadre = A.$('roueCadre'), disque = A.$('wheel'), aiguille = cadre.querySelector('.aiguille');
    const resultat = A.$('gameResult'), spinBtn = A.$('spinBtn');
    disque.style.transform = `rotate(${rotation}deg)`;
    const svg = disque.querySelector('svg');
    ajusterNoms(svg, n);
    document.fonts?.ready.then(() => svg.isConnected && ajusterNoms(svg, n));

    resultat.onclick = () => { resultat.hidden = true; };

    const lancer = () => {
      if (busy) return;
      busy = true;
      const chosen = Math.floor(Math.random() * n);
      const dest = (360 - ((chosen + 0.5) * seg)) % 360;
      const delta = (dest - (rotation % 360) + 360) % 360;
      rotation += 360 * 5 + delta;
      disque.style.transform = `rotate(${rotation}deg)`;
      spinBtn.disabled = true;
      spinBtn.textContent = 'Ça tourne…';
      resultat.hidden = true;
      cadre.dataset.etat = 'tourne';
      A.beep(590, 0.11);
      const token = Symbol();
      spinToken = token;
      suivreAiguille(disque, aiguille, seg, token);
      const attente = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 500 : DUREE + 150;
      setTimeout(() => {
        busy = false;
        if (spinToken !== token || A.state.currentGame !== 'wheel') return;
        resultat.innerHTML = `<span class="tampon-titre">À toi de jouer</span><strong class="tampon-nom">${A.esc(players[chosen])}</strong><span class="tampon-defi">${A.esc(A.insecables(A.sample(A.wheelTasks)))}</span><small>Tout défi peut être refusé ou remplacé.</small>`;
        resultat.hidden = false;
        cadre.dataset.etat = 'gagne';
        cadre.classList.remove('secousse');
        void cadre.offsetWidth;
        cadre.classList.add('secousse');
        setTimeout(() => { if (cadre.dataset.etat === 'gagne') cadre.dataset.etat = 'repos'; }, 1800);
        spinBtn.disabled = false;
        spinBtn.textContent = 'Relancer';
        A.beep(850, 0.19);
        A.vibre([40, 30, 80]);
        A.confetti();
      }, attente);
    };
    spinBtn.addEventListener('click', lancer);
    A.$('roue').addEventListener('click', lancer);
  }

  A.register({
    id: 'wheel', ordre: 1, icone: 'assets/icons/wheel.svg', couleur: 'var(--pomme)',
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
