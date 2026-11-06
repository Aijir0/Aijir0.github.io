// V2bis — mouvement propre à l'édition de fond (phase 10). Complète ../commun/signatures.js sans le modifier.
// Chargé dans <head> sans « defer » : la classe d'entrée et les écouteurs de View Transitions doivent exister
// avant le premier rendu. Tout le reste attend DOMContentLoaded. Sans JavaScript, la page est complète et immobile.
(() => {
  const html = document.documentElement;
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accueil = !!document.querySelector('link[href="v2bis.css"]') && /\/(index\.html)?$/.test(location.pathname);
  const lire = (k) => { try { return sessionStorage.getItem(k); } catch { return null; } };
  const ecrire = (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* stockage indisponible : on rejoue, sans gravité */ } };

  /* ---------- 1. La une se compose : première visite de la session seulement, interrompue au premier geste ---------- */
  if (accueil && !reduit && !lire('v2bis-une')) {
    html.classList.add('compo');
    ecrire('v2bis-une', '1');
    const finir = () => html.classList.add('compo-fin');
    for (const ev of ['wheel', 'touchstart', 'keydown', 'pointerdown']) addEventListener(ev, finir, { once: true, passive: true });
  }

  /* ---------- 2. La réalisation devient la page : noms posés au clic, retrouvés au retour ---------- */
  const FICHES = ['artefacts-2050.html', 'researchrabbit.html', 'atlas.html'];
  const fiche = (u) => FICHES.find(f => new URL(u, location.href).pathname.endsWith('/' + f));
  const visible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect(), fig = el.closest('.apercu figure');
    return r.width > 0 && r.bottom > 0 && r.top < innerHeight && (!fig || fig.classList.contains('visible'));
  };
  function cadrePour(url) {   // sur l'accueil : la vignette visible qui représente cette fiche
    const cible = fiche(url);
    for (const a of document.querySelectorAll('.a-la-une a, .index a[data-apercu]')) {
      if (fiche(a.href) !== cible) continue;
      const c = [a.querySelector('.cadre'), a.closest('.a-la-une')?.querySelector('.cadre'),
        a.dataset.apercu != null ? document.querySelectorAll('.apercu figure')[+a.dataset.apercu]?.querySelector('.cadre') : null].find(visible);
      if (c) return c;
    }
    return null;
  }
  const nommer = (el, vt) => { if (!el) return; el.style.viewTransitionName = 'fig-hero'; vt.finished.finally(() => { el.style.viewTransitionName = ''; }); };
  const suivant = (vt) => { if (lire('v2bis-vt') === 'suivant') vt.types?.add('suivant'); };
  addEventListener('pageswap', (e) => {
    if (!e.viewTransition) return;
    suivant(e.viewTransition);
    const dest = e.activation?.entry?.url;
    if (dest && fiche(dest) && !fiche(location.href)) nommer(cadrePour(dest), e.viewTransition);
  });
  addEventListener('pagereveal', (e) => {
    if (!e.viewTransition) return;
    suivant(e.viewTransition);
    try { sessionStorage.removeItem('v2bis-vt'); } catch { /* idem */ }
    const depuis = window.navigation?.activation?.from?.url;
    if (!depuis || !fiche(depuis) || fiche(location.href)) return;
    // Au retour d'une fiche, l'aperçu montre l'œuvre qu'on vient de quitter : l'image peut regagner sa place.
    const ligne = [...document.querySelectorAll('.index a[data-apercu]')].find(a => fiche(a.href) === fiche(depuis));
    if (ligne) {
      document.querySelectorAll('.index a[data-apercu]').forEach(a => a.toggleAttribute('data-actif', a === ligne));
      document.querySelectorAll('.apercu figure').forEach((f, i) => f.classList.toggle('visible', i === +ligne.dataset.apercu));
    }
    nommer(cadrePour(depuis), e.viewTransition);
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.fiche-suivante a')?.addEventListener('click', () => ecrire('v2bis-vt', 'suivant'));
    if (html.classList.contains('compo')) uneHorsEcran();
    revelations();
    annotations();
    frise();
    traitDeLecture();
    libelleMobile();
  });

  /* Sur téléphone, la une est sous la ligne de flottaison : sa découverte attend d'entrer dans l'écran */
  function uneHorsEcran() {
    const une = document.querySelector('.a-la-une');
    if (!une || une.getBoundingClientRect().top < innerHeight * 0.8 || !('IntersectionObserver' in window)) return;
    html.classList.add('compo-attente');
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { html.classList.remove('compo-attente'); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(une);
  }

  /* ---------- 3. Révélations au défilement : une fois, dès qu'un élément entre dans l'écran ---------- */
  function revelations() {
    const els = document.querySelectorAll('[data-revele]');
    if (reduit || !('IntersectionObserver' in window)) return els.forEach(el => el.classList.add('revele'));
    html.classList.add('revelations');
    // Une image masquée par clip-path n'a aucune surface visible : l'observateur ne la verrait jamais entrer.
    // On observe donc son parent (non masqué) et on révèle l'image.
    const cibles = new Map();
    els.forEach(el => cibles.set(el.classList.contains('revele-image') ? el.parentElement : el, el));
    const io = new IntersectionObserver((entrees) => {
      for (const e of entrees) if (e.isIntersecting) { cibles.get(e.target)?.classList.add('revele'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    cibles.forEach((_, cible) => io.observe(cible));
  }

  /* ---------- 4. Annotations vivantes : un cercle au stylo autour de la zone que commente chaque note ---------- */
  function annotations() {
    const g = document.querySelector('.graphique'); if (!g) return;
    const W = 1041, H = 546, NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'cercles'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('aria-hidden', 'true');
    // Tracé à main levée : ellipse un peu irrégulière qui dépasse son point de départ, comme un vrai trait de stylo.
    const cercle = (cx, cy, graine) => {
      const pts = [];
      for (let i = 0; i <= 48; i++) {
        const t = -2.3 + graine + ((Math.PI * 2 + 0.45) * i) / 48, f = 1 + 0.05 * Math.sin(3 * t + graine * 5) + 0.05 * (i / 48);
        pts.push(`${(cx + 82 * f * Math.cos(t)).toFixed(1)} ${(cy + 52 * f * Math.sin(t)).toFixed(1)}`);
      }
      return 'M' + pts.join('L');
    };
    const chemins = [...g.querySelectorAll('.appel')].map((a, i) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', cercle(parseFloat(a.style.left) / 100 * W, parseFloat(a.style.top) / 100 * H, i * 0.7));
      p.setAttribute('pathLength', '1');
      svg.append(p);
      new MutationObserver(() => p.classList.toggle('actif', a.classList.contains('actif'))).observe(a, { attributes: true, attributeFilter: ['class'] });
      return p;
    });
    g.querySelector('.trace-svg')?.after(svg);
    const montrer = () => chemins.forEach((p, i) => setTimeout(() => p.classList.add('vu'), reduit ? 0 : 1500 + i * 380));
    if (reduit || !('IntersectionObserver' in window)) return montrer();
    const io = new IntersectionObserver((e) => { if (e.some(x => x.isIntersecting)) { io.disconnect(); montrer(); } }, { threshold: 0.5 });
    io.observe(g);
  }

  /* ---------- 5. Frise : tracée dans l'ordre du temps, « aujourd'hui » calculé chaque jour ---------- */
  function frise() {
    const cadre = document.querySelector('.frise-cadre'); if (!cadre) return;
    const d = new Date(), annee = d.getFullYear() + (d - new Date(d.getFullYear(), 0, 1)) / 31557600000;
    const fin = parseFloat(getComputedStyle(cadre).getPropertyValue('--debut')) + parseFloat(getComputedStyle(cadre).getPropertyValue('--axe'));
    const maintenant = Math.min(annee, fin).toFixed(3);
    cadre.style.setProperty('--maintenant', maintenant);
    const barres = [...cadre.querySelectorAll('.barre')];
    barres.forEach(b => { if (b.classList.contains('en-cours')) b.style.setProperty('--f', maintenant); });
    barres.sort((a, b) => parseFloat(a.style.getPropertyValue('--d')) - parseFloat(b.style.getPropertyValue('--d')))
      .forEach((b, i) => b.style.setProperty('--i', i));
    cadre.style.setProperty('--auj-delai', `${barres.length * 110 + 900}ms`);
    const li = document.createElement('li');
    li.className = 'aujourdhui'; li.textContent = "aujourd'hui"; li.setAttribute('aria-hidden', 'true');
    cadre.querySelector('.axe ol')?.append(li);
    cadre.classList.add('avec-aujourdhui');
  }

  /* ---------- 6. Manchette : un seul trait suit la rubrique courante et s'allonge avec la lecture ---------- */
  function traitDeLecture() {
    const ol = document.querySelector('.manchette .sommaire ol'); if (!ol) return;
    const trait = document.createElement('li');
    trait.className = 'trait-lecture'; trait.setAttribute('aria-hidden', 'true');
    ol.append(trait);
    const maj = () => {
      const a = ol.querySelector('a[aria-current="true"]');
      trait.classList.toggle('pret', !!a); if (!a) return;
      const p = parseFloat(a.style.getPropertyValue('--p')) || 0;
      // Rectangles affichés, pas offsetLeft : une rubrique animée (transformée) devient son propre repère dans Chromium.
      const ra = a.getBoundingClientRect(), ro = ol.getBoundingClientRect();
      trait.style.setProperty('--x', (ra.left - ro.left).toFixed(1) + 'px');
      trait.style.setProperty('--w', (ra.width * (0.18 + 0.82 * p)).toFixed(1));
    };
    new MutationObserver((recs) => { if (recs.some(m => m.target !== trait)) maj(); })
      .observe(ol, { attributes: true, subtree: true, attributeFilter: ['aria-current', 'style'] });
    html.classList.add('avec-trait');
    maj();
  }

  /* ---------- 7. Barre de lecture mobile : le nom de la section change en glissant, pas d'un coup ---------- */
  function libelleMobile() {
    const lib = document.querySelector('[data-section-courante]'); if (!lib || reduit || !lib.animate) return;
    let avant = lib.textContent;
    new MutationObserver(() => {
      if (lib.textContent === avant) return;
      avant = lib.textContent;
      lib.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }).observe(lib, { childList: true, characterData: true, subtree: true });
  }
})();
