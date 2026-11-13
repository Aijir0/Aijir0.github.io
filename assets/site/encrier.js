// Petit encrier du pied de page : posé au bout du premier paragraphe, il saute (« pop ») avant d'ouvrir sa page.
(function () {
  'use strict';
  const lien = document.querySelector('.encrier');
  const pied = lien && lien.closest('.colophon');
  const paragraphe = pied && pied.querySelector('p');
  if (!paragraphe) return;

  // Cale l'encrier juste après le dernier caractère du paragraphe, posé sur la ligne de base.
  function placer() {
    const texte = paragraphe.lastChild;
    if (!texte || texte.nodeType !== 3 || !texte.length) return;
    const r = document.createRange();
    r.setStart(texte, texte.length - 1);
    r.setEnd(texte, texte.length);
    const fin = r.getBoundingClientRect();
    // Repère du positionnement absolu : l'ancêtre positionné, sinon le document.
    const ref = lien.offsetParent;
    const base = ref && ref !== document.body
      ? { x: ref.getBoundingClientRect().left + ref.clientLeft, y: ref.getBoundingClientRect().top + ref.clientTop }
      : { x: -window.scrollX, y: -window.scrollY };
    // Zone tactile de 44 px : remonte sur le texte au-dessus, ne descend que de 6 px sous la ligne.
    lien.style.left = `${Math.round(fin.right - base.x - 24)}px`;
    lien.style.top = `${Math.round(fin.bottom - base.y - 38)}px`;
    lien.classList.add('place');
  }
  placer();
  // Se recale si le paragraphe change (largeur, polices) ou si la page change de hauteur au-dessus (images).
  if (document.fonts) document.fonts.ready.then(placer);
  window.addEventListener('load', placer);
  if ('ResizeObserver' in window) {
    const suivi = new ResizeObserver(placer);
    suivi.observe(paragraphe);
    suivi.observe(document.body);
  } else window.addEventListener('resize', placer);

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
