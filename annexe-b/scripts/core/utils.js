// Petits outils partagés : sélection, échappement HTML, hasard, toast.
(function (A) {
  'use strict';
  A.$ = (id) => document.getElementById(id);
  A.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  A.sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
  A.shuffle = (list) => {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  // Espace insécable avant ? ! : ; » et après « : la ponctuation ne part jamais seule à la ligne.
  A.insecables = (s) => String(s).replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ');
  // Zone de résultat commune aux jeux, masquée tant qu'elle est vide.
  A.resultat = (message = '', extraClass = '') =>
    `<div class="result ${extraClass}" id="gameResult" role="status" ${message ? '' : 'hidden'}>${message}</div>`;

  let toastTimer;
  A.toast = (msg) => {
    const t = A.$('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1900);
  };
})(window.Arcade = window.Arcade || {});
