// Carte de question partagée par « Qui de nous ? », « Je n’ai jamais » et « Tu préfères ? ».
(function (A) {
  'use strict';
  A.promptCard = (root, kind, tag, foot) => {
    root.innerHTML = `<div class="prompt-wrap"><div class="prompt-card" id="promptCard"><small>${tag}</small><p id="question"></p><div class="prompt-foot">${foot}</div></div><div class="counter" id="questionCount"></div><div class="button-row"><button class="primary" id="nextQuestion">✨ QUESTION SUIVANTE</button></div></div>`;
    const draw = () => {
      A.$('question').textContent = A.nextPrompt(kind);
      A.$('questionCount').textContent = `Question ${A.drawCount(kind)}`;
      const c = A.$('promptCard');
      c.classList.remove('reveal');
      void c.offsetWidth; // relance l'animation d'apparition
      c.classList.add('reveal');
      A.beep(630, 0.07);
    };
    draw();
    A.$('nextQuestion').addEventListener('click', draw);
  };
})(window.Arcade = window.Arcade || {});
