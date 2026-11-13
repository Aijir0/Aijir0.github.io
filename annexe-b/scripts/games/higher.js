// Plus ou moins : deviner si la prochaine carte sera plus haute ou plus basse.
(function (A) {
  'use strict';
  let deck = [], current = null, streak = 0, score = 0, locked = false;

  // Symboles dessinés en SVG : identiques sur tous les téléphones (pas d'emoji).
  const SYMBOLES = {
    '♠': '<path d="M12 2C9 6 3.5 9.5 3.5 14a4.3 4.3 0 0 0 7.3 3.1L10 22h4l-.8-4.9A4.3 4.3 0 0 0 20.5 14C20.5 9.5 15 6 12 2z"/>',
    '♥': '<path d="M12 21C7 17 2.5 13.5 2.5 8.6A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9.5 2.6C21.5 13.5 17 17 12 21z"/>',
    '♦': '<path d="M12 2l7.5 10L12 22 4.5 12z"/>',
    '♣': '<circle cx="12" cy="7" r="4.3"/><circle cx="6.8" cy="13.6" r="4.3"/><circle cx="17.2" cy="13.6" r="4.3"/><path d="M10.6 13h2.8l1.6 9H9z"/>'
  };
  const NOMS = { '♠': 'pique', '♥': 'cœur', '♦': 'carreau', '♣': 'trèfle' };
  const symbole = (s) => `<svg viewBox="0 0 24 24" aria-hidden="true">${SYMBOLES[s]}</svg>`;
  const FLECHE = (sens) => `<svg class="fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="${sens === 'up' ? 'M12 20V4M5 11l7-7 7 7' : 'M12 4v16M5 13l7 7 7-7'}"/></svg>`;

  function freshDeck() {
    const d = [];
    for (const s of ['♠', '♥', '♦', '♣']) for (let n = 2; n <= 14; n++) d.push({ n, s });
    return A.shuffle(d);
  }
  function drawCard() {
    if (deck.length === 0) deck = freshDeck();
    return deck.pop();
  }
  const label = (c) => ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' })[c.n] || String(c.n);
  const nomCarte = (c) => `Carte ${label(c)} de ${NOMS[c.s]}`;
  const recto = (c) => `<span class="coin">${label(c)}${symbole(c.s)}</span><span class="valeur">${label(c)}</span><span class="symbole">${symbole(c.s)}</span><span class="coin bas">${label(c)}${symbole(c.s)}</span>`;
  const rouge = (c) => c.s === '♥' || c.s === '♦';

  // Carte posée face visible, ou carte à retourner (dos visible, face préparée au verso).
  const carte = (c, id) => `<div class="carte ${c ? 'revele' : ''}" id="${id}" role="img" aria-label="${c ? nomCarte(c) : 'Carte cachée'}"><div class="carte-faces"><div class="face dos"><span>AH</span></div><div class="face recto ${c && rouge(c) ? 'rouge' : ''}">${c ? recto(c) : ''}</div></div></div>`;

  function render(root) {
    if (!current) current = drawCard();
    root.innerHTML = `<div class="tapis"><div class="score-ligne"><span class="pastille">Série <b id="streak">${streak}</b></span><span class="pastille">Score <b id="score">${score}</b></span></div><div class="card-hand">${carte(current, 'currentCard')}${carte(null, 'futureCard')}</div><p class="subline">As = carte la plus forte · Égalité = nouveau tirage.</p></div>${A.resultat()}<div class="button-row duo" id="choix"><button type="button" class="secondary" id="guessDown">${FLECHE('down')}Plus basse</button><button type="button" class="primary" id="guessUp">${FLECHE('up')}Plus haute</button></div><div class="button-row" id="suite" hidden><button type="button" class="primary" id="continueCards">Carte suivante</button></div>`;
    A.$('guessDown').onclick = () => guess(root, 'down');
    A.$('guessUp').onclick = () => guess(root, 'up');
    A.$('continueCards').onclick = () => { current = nextCard; locked = false; render(root); };
  }

  let nextCard = null;
  function guess(root, dir) {
    if (locked) return;
    locked = true;
    const next = nextCard = drawCard();
    const correct = next.n === current.n ? null : (dir === 'up' ? next.n > current.n : next.n < current.n);
    const futur = A.$('futureCard');
    const face = futur.querySelector('.recto');
    face.innerHTML = recto(next);
    face.classList.toggle('rouge', rouge(next));
    futur.setAttribute('aria-label', nomCarte(next));
    futur.classList.add('revele');
    if (correct === true) { streak++; score++; A.confetti(); A.beep(880, 0.1); A.vibre(30); }
    else if (correct === false) { streak = 0; A.beep(250, 0.23, 'triangle'); A.vibre([60, 40, 60]); }
    else A.beep(500, 0.14);
    A.$('streak').textContent = streak;
    A.$('score').textContent = score;
    const res = A.$('gameResult');
    res.hidden = false;
    res.className = `result ${correct === true ? 'success' : correct === false ? 'fail' : ''}`;
    res.innerHTML = correct === true ? '<strong>Bien joué !</strong> +1 point.'
      : correct === null ? '<strong>Égalité !</strong> Le tirage est annulé.'
        : `<strong>Raté !</strong> ${A.esc(A.feedbackText())}`;
    A.$('choix').hidden = true;
    A.$('suite').hidden = false;
    A.$('continueCards').focus({ preventScroll: true });
  }

  A.register({
    id: 'higher', ordre: 4, icone: 'assets/icons/higher.svg', couleur: 'var(--piscine)',
    titre: 'Plus ou moins',
    sousTitre: 'Devine la prochaine carte.',
    regle: 'La prochaine carte sera-t-elle plus haute ou plus basse ? Une égalité ne compte pas.',
    init: render
  });
})(window.Arcade = window.Arcade || {});
