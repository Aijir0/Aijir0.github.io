// Léo Matrat — comportements du site (aucune dépendance). Chargé dans <head> sans « defer » : la classe d'entrée
// et les écouteurs de View Transitions doivent exister avant le premier rendu ; le reste attend DOMContentLoaded.

/* ===== 1. Socle : sommaire vivant, tiroir, notes reliées, tracés, retour ===== */
const reduit = matchMedia('(prefers-reduced-motion: reduce)');
const large = matchMedia('(min-width: 1100px)'); // même seuil que base.css

/* ---------- Sommaire vivant + barre de lecture mobile ---------- */
function sommaireVivant() {
  const liens = [...document.querySelectorAll('.sommaire a[href^="#"]')];
  if (!liens.length) return;
  const ids = [...new Set(liens.map(a => a.hash.slice(1)))];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  const titres = new Map(liens.map(a => [a.hash.slice(1), a.querySelector('.titre')?.textContent || a.textContent.trim()]));
  const libelle = document.querySelector('[data-section-courante]');
  const barre = document.querySelector('.barre-lecture');
  const prefixe = libelle?.dataset.prefixe ?? '§ '; // V2bis : pas de signe de paragraphe
  let attente = false;

  function maj() {
    attente = false;
    const repere = innerHeight * 0.35;
    let actif = -1, progression = 0;
    sections.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      if (r.top <= repere) { actif = i; progression = Math.min(1, Math.max(0, (repere - r.top) / r.height)); }
    });
    const id = actif >= 0 ? sections[actif].id : null;
    for (const a of liens) {
      const courant = a.hash.slice(1) === id;
      a.toggleAttribute('aria-current', courant);
      if (courant) { a.setAttribute('aria-current', 'true'); a.style.setProperty('--p', progression.toFixed(3)); }
    }
    document.querySelectorAll('.sommaire').forEach(nav => {
      const curseur = nav.querySelector('.curseur');
      if (!curseur) return;
      const a = id && nav.querySelector(`a[href="#${id}"]`);
      nav.classList.toggle('pret', !!a);
      if (a) curseur.style.setProperty('--y', a.offsetTop + 'px');
    });
    if (libelle) libelle.innerHTML = id
      ? `<span class="num">${prefixe}${actif + 1}/${sections.length}</span> ${titres.get(id)}`
      : (prefixe ? '<span class="num">§</span> ' : '') + 'Sommaire';
    if (barre) {
      const max = document.documentElement.scrollHeight - innerHeight;
      barre.style.setProperty('--p-page', max > 0 ? (scrollY / max).toFixed(3) : 0);
    }
  }
  const demander = () => { if (!attente) { attente = true; requestAnimationFrame(maj); } };
  addEventListener('scroll', demander, { passive: true });
  addEventListener('resize', demander);
  maj();
}

/* ---------- Tiroir du sommaire (mobile) : <dialog> natif, focus géré par le navigateur ---------- */
function tiroir() {
  const dlg = document.querySelector('.tiroir');
  if (!dlg) return;
  document.querySelectorAll('[data-ouvre-tiroir]').forEach(b => b.addEventListener('click', () => dlg.showModal()));
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('a, .fermer')) dlg.close();
  });
}

/* ---------- Notes en marge reliées ---------- */
function notesReliees() {
  const appels = [...document.querySelectorAll('.appel[aria-controls]')];
  if (!appels.length) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('fil-notes');
  svg.setAttribute('aria-hidden', 'true');
  const chemin = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  chemin.setAttribute('pathLength', '1');
  svg.append(chemin);
  document.body.append(svg);

  function relier(appel, note) {
    // Le fil part de la gouttière (jamais à travers le texte) puis rejoint la note.
    const a = appel.getBoundingClientRect(), n = note.getBoundingClientRect();
    const zone = appel.closest('.avec-marge')?.getBoundingClientRect();
    const x1 = (zone ? zone.right + 6 : a.right + 3) + scrollX;
    const y1 = a.top + a.height / 2 + scrollY, y2 = n.top + scrollY + 9;
    const x2 = n.left + scrollX - 3, xm = Math.max(x1, x2 - 14);
    chemin.setAttribute('d', `M${x1} ${y1}H${xm}V${y2}H${x2}`);
    chemin.classList.remove('trace');
    chemin.getBoundingClientRect(); // repart de zéro à chaque nouvelle note
    chemin.classList.add('trace');
  }
  function activer(appel, note, oui) {
    appel.classList.toggle('actif', oui);
    note.classList.toggle('actif', oui);
    if (oui && large.matches) relier(appel, note);
    else chemin.classList.remove('trace');
  }
  for (const appel of appels) {
    const note = document.getElementById(appel.getAttribute('aria-controls'));
    if (!note) continue;
    for (const el of [appel, note]) {
      el.addEventListener('pointerenter', () => large.matches && activer(appel, note, true));
      el.addEventListener('pointerleave', () => large.matches && activer(appel, note, false));
    }
    appel.addEventListener('focus', () => large.matches && activer(appel, note, true));
    appel.addEventListener('blur', () => large.matches && activer(appel, note, false));
    appel.addEventListener('click', () => {
      if (large.matches) return activer(appel, note, true);
      const ouvert = appel.getAttribute('aria-expanded') !== 'true';
      appel.setAttribute('aria-expanded', ouvert);
      appel.classList.toggle('actif', ouvert);
      note.classList.toggle('ouverte', ouvert);
    });
  }
  addEventListener('resize', () => chemin.classList.remove('trace'));
}

/* ---------- Stylo rouge et figures tracées : une seule fois, à l'entrée dans l'écran ---------- */
function traces() {
  const cibles = document.querySelectorAll('.stylo, .trace-svg, [data-trace]');
  if (reduit.matches || !('IntersectionObserver' in window)) {
    cibles.forEach(el => el.classList.add('trace'));
    return;
  }
  const io = new IntersectionObserver(entrees => {
    for (const e of entrees) if (e.isIntersecting) { e.target.classList.add('trace'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.5 });
  cibles.forEach(el => io.observe(el));
}

/* ---------- Fiche : « Retour au profil » revient en arrière quand on vient de l'accueil (position et image retrouvées) ---------- */
function retour() {
  if (!document.referrer) return;
  const r = new URL(document.referrer);
  if (r.origin !== location.origin || !/^\/(index\.html)?$/.test(r.pathname)) return;
  document.querySelectorAll('[data-retour]').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); history.back(); }));
}

/* ---------- Index des travaux : l'aperçu suit la ligne survolée ou ciblée au clavier ---------- */
function apercuIndex() {
  const lignes = document.querySelectorAll('.index [data-apercu]');
  const figures = document.querySelectorAll('.apercu figure');
  lignes.forEach(a => ['pointerenter', 'focus'].forEach(ev => a.addEventListener(ev, () => {
    lignes.forEach(x => x.toggleAttribute('data-actif', x === a));
    figures.forEach((f, i) => f.classList.toggle('visible', i === +a.dataset.apercu));
  })));
}

document.addEventListener('DOMContentLoaded', () => { sommaireVivant(); tiroir(); notesReliees(); traces(); retour(); apercuIndex(); });

/* ===== 2. Mouvement (DESIGN.md § 7) ===== */
(() => {
  const html = document.documentElement;
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accueil = /^\/(index\.html)?$/.test(location.pathname);
  const lire = (k) => { try { return sessionStorage.getItem(k); } catch { return null; } };
  const ecrire = (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* stockage indisponible : on rejoue, sans gravité */ } };

  /* ---------- 1. La une se compose : première visite de la session seulement, interrompue au premier geste ---------- */
  if (accueil && !reduit && !lire('lm-une')) {
    html.classList.add('compo');
    ecrire('lm-une', '1');
    const finir = () => html.classList.add('compo-fin');
    for (const ev of ['wheel', 'touchstart', 'keydown', 'pointerdown']) addEventListener(ev, finir, { once: true, passive: true });
  }

  /* ---------- 2. La réalisation devient la page : noms posés au clic, retrouvés au retour ---------- */
  // Une fiche de réalisation : /travaux/<nom>/ ; renvoie son nom.
  const fiche = (u) => (new URL(u, location.href).pathname.match(/^\/travaux\/([a-z0-9-]+)\/(index\.html)?$/) || [])[1];
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
  const suivant = (vt) => { if (lire('lm-vt') === 'suivant') vt.types?.add('suivant'); };
  addEventListener('pageswap', (e) => {
    if (!e.viewTransition) return;
    suivant(e.viewTransition);
    const dest = e.activation?.entry?.url;
    if (dest && fiche(dest) && !fiche(location.href)) nommer(cadrePour(dest), e.viewTransition);
  });
  addEventListener('pagereveal', (e) => {
    if (!e.viewTransition) return;
    suivant(e.viewTransition);
    try { sessionStorage.removeItem('lm-vt'); } catch { /* idem */ }
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
    document.querySelector('.fiche-suivante a')?.addEventListener('click', () => ecrire('lm-vt', 'suivant'));
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
