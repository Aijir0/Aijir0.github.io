// Note de breffage — comportements communs des prototypes (aucune dépendance).
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

/* ---------- Deux niveaux de lecture : 30 s / 3 min ---------- */
function niveauxDeLecture() {
  const boutons = document.querySelectorAll('[data-lecture]');
  boutons.forEach(b => b.addEventListener('click', () => {
    const avant = b.getBoundingClientRect().top;
    document.documentElement.dataset.lecture = b.dataset.lecture;
    boutons.forEach(x => x.setAttribute('aria-pressed', x.dataset.lecture === b.dataset.lecture));
    scrollBy(0, b.getBoundingClientRect().top - avant); // le bouton ne saute pas sous le doigt
    dispatchEvent(new Event('scroll'));
  }));
}

/* ---------- Renvois « → § 2 » : la cible s'éclaire brièvement à l'arrivée ---------- */
function renvois() {
  document.querySelectorAll('a.renvoi[href^="#"]').forEach(a => a.addEventListener('click', () => {
    const cible = document.getElementById(a.hash.slice(1))?.querySelector('h2');
    if (!cible) return;
    cible.classList.remove('eclaire');
    setTimeout(() => cible.classList.add('eclaire'), reduit.matches ? 0 : 450);
  }));
}

/* ---------- Fiche : le retour ramène au prototype d'origine ---------- */
function retour() {
  if (!document.referrer || new URL(document.referrer).origin !== location.origin) return;
  document.querySelectorAll('[data-retour]').forEach(a => { a.href = document.referrer; });
}

sommaireVivant(); tiroir(); notesReliees(); traces(); niveauxDeLecture(); renvois(); retour();
