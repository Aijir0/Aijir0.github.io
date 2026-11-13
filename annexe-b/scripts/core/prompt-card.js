// Carte de question partagée par « Qui de nous ? », « Je n’ai jamais » et « Tu préfères ? ».
// Options : classe (univers du stand), tag, foot, decor (HTML décoratif), afficher(el, texte) pour une mise en forme propre.
(function (A) {
  'use strict';
  A.promptCard = (root, kind, { classe = '', tag, foot, decor = '', afficher }) => {
    root.innerHTML = `<div class="prompt-wrap ${classe}"><div class="prompt-card" id="promptCard">${decor}<small>${tag}</small><div class="question" id="question"></div><div class="prompt-foot">${foot}</div></div><p class="counter" id="questionCount"></p><div class="button-row"><button type="button" class="primary" id="nextQuestion">Question suivante</button></div></div>`;
    const question = A.$('question');
    const draw = () => {
      const texte = A.insecables(A.nextPrompt(kind));
      if (afficher) afficher(question, texte); else question.textContent = texte;
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
