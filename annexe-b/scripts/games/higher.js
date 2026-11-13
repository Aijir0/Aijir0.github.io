// Plus ou moins : deviner si la prochaine carte sera plus haute ou plus basse.
(function (A) {
  'use strict';
  let deck = [], current = null, streak = 0, score = 0, locked = false;

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
  function cardMarkup(card, id) {
    if (!card) return `<div class="playing-card back" id="${id}" aria-label="Carte cachée">✳</div>`;
    const red = card.s === '♥' || card.s === '♦';
    return `<div class="playing-card ${red ? 'red' : ''}" id="${id}" aria-label="Carte ${label(card)} ${card.s}"><div>${label(card)}</div><span>${card.s}</span></div>`;
  }

  function render(root) {
    if (!current) current = drawCard();
    root.innerHTML = `<div class="streak">🔥 Série : <b id="streak">${streak}</b><span>·</span> 🏆 Score : <b id="score">${score}</b></div><div class="card-hand"><div id="prevCard">${cardMarkup(current, 'currentCard')}</div><div id="nextCard">${cardMarkup(null, 'futureCard')}</div></div><p class="subline">La prochaine carte est-elle plus haute ou plus basse ?<br>As = carte la plus forte · Égalité = nouveau tirage.</p><div class="button-row"><button class="secondary" id="guessDown">↓ PLUS BASSE</button><button class="primary" id="guessUp">↑ PLUS HAUTE</button></div>${A.resultat()}`;
    A.$('guessDown').onclick = () => guess(root, 'down');
    A.$('guessUp').onclick = () => guess(root, 'up');
  }

  function guess(root, dir) {
    if (locked) return;
    locked = true;
    const next = drawCard();
    const correct = next.n === current.n ? null : (dir === 'up' ? next.n > current.n : next.n < current.n);
    A.$('nextCard').innerHTML = cardMarkup(next, 'futureCard');
    A.$('futureCard').classList.add('flip');
    if (correct === true) { streak++; score++; A.confetti(); A.beep(880, 0.1); }
    else if (correct === false) { streak = 0; A.beep(250, 0.23, 'triangle'); }
    else A.beep(500, 0.14);
    A.$('streak').textContent = streak;
    A.$('score').textContent = score;
    const res = A.$('gameResult');
    res.hidden = false;
    res.className = `result ${correct === true ? 'success' : correct === false ? 'fail' : ''}`;
    res.innerHTML = correct === true ? '✅ <strong>Bien joué !</strong> +1 point.'
      : correct === null ? '🟰 Égalité ! Le tirage est annulé.'
        : `❌ <strong>Raté !</strong> ${A.esc(A.feedbackText())}`;
    A.$('guessDown').disabled = A.$('guessUp').disabled = true;
    const b = document.createElement('button');
    b.className = 'primary';
    b.id = 'continueCards';
    b.textContent = 'CARTE SUIVANTE →';
    A.$('guessUp').parentElement.appendChild(b);
    b.onclick = () => { current = next; locked = false; render(root); };
  }

  A.register({
    id: 'higher', ordre: 4, icone: '🃏', couleur: '#81e8f5',
    titre: 'Plus ou moins',
    sousTitre: 'Devine la prochaine carte.',
    regle: 'La prochaine carte sera-t-elle plus haute ou plus basse ? Une égalité ne compte pas.',
    init: render
  });
})(window.Arcade = window.Arcade || {});
