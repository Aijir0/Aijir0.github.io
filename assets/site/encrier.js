// Petit encrier du pied de page : il saute (« pop ») avant d'ouvrir sa page.
(function () {
  'use strict';
  const lien = document.querySelector('.encrier');
  if (!lien) return;
  lien.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return; // ouverture dans un nouvel onglet : comportement normal
    e.preventDefault();
    const partir = () => { window.location.href = lien.href; };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return partir();
    lien.classList.add('pop');
    setTimeout(partir, 420);
  });
  // Retour arrière depuis la page ouverte : l'encrier réapparaît.
  window.addEventListener('pageshow', () => lien.classList.remove('pop'));
})();
