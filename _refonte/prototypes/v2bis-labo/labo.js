// Laboratoire de motion design (phase 9) : réglages, panneau et comportements expérimentaux. Rien n'est validé.
// Chargé dans <head> sans « defer » : les attributs de <html> et les écouteurs de View Transitions
// doivent exister avant le premier rendu.
(() => {
  const DEFAUTS = { compo: '1', parallaxe: '2', transitions: '1', annotations: '1', frise: '1', manchette: '1' };
  const html = document.documentElement;
  const q = new URLSearchParams(location.search);
  let reglages = {};
  try { reglages = JSON.parse(sessionStorage.getItem('labo') || '{}'); } catch { /* stockage indisponible : réglages par défaut */ }
  for (const k in DEFAUTS) { if (q.has(k)) reglages[k] = q.get(k); if (!(k in reglages)) reglages[k] = DEFAUTS[k]; }
  try { sessionStorage.setItem('labo', JSON.stringify(reglages)); } catch { /* idem */ }
  for (const [k, v] of Object.entries(reglages)) html.dataset[k] = v;

  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accueil = /\/(index\.html)?$/.test(location.pathname);

  /* ---------- 1. La une se compose : dans le labo, à chaque chargement (dans le site : une fois par session) ---------- */
  if (accueil && reglages.compo === '1' && !reduit) {
    html.classList.add('compo-joue');
    const finir = () => html.classList.add('compo-fin');
    for (const ev of ['wheel', 'touchstart', 'keydown', 'pointerdown']) addEventListener(ev, finir, { once: true, passive: true });
    // Si la une est hors de l'écran (téléphone), sa découverte se joue quand elle y entre.
    document.addEventListener('DOMContentLoaded', () => {
      const une = document.querySelector('.a-la-une'); if (!une || une.getBoundingClientRect().top < innerHeight * 0.8) return;
      html.classList.add('compo-attente');
      const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { html.classList.remove('compo-attente'); io.disconnect(); } }, { threshold: 0.25 });
      io.observe(une);
    });
  }

  /* ---------- 3. La réalisation devient la page (View Transitions entre documents) ---------- */
  const FICHES = ['artefacts-2050.html', 'researchrabbit.html', 'atlas.html'];
  const nomFiche = (u) => FICHES.find(f => new URL(u, location.href).pathname.endsWith('/' + f));
  const visible = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect(), fig = el.closest('.apercu figure');
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && (!fig || fig.classList.contains('visible'));
  };
  // Sur l'accueil, l'élément qui représente une fiche : la vignette visible et son titre.
  function elementsPour(url) {
    const fiche = nomFiche(url); let fig = null, titre = null;
    for (const a of document.querySelectorAll('a[href]')) {
      if (nomFiche(a.href) !== fiche) continue;
      const une = a.closest('.a-la-une');
      const cadres = [a.querySelector('.cadre'), une?.querySelector('.cadre'),
        a.dataset.apercu != null ? document.querySelectorAll('.apercu figure')[+a.dataset.apercu]?.querySelector('.cadre') : null];
      fig ||= cadres.find(visible) || null;
      const t = a.querySelector('.t-titre') || une?.querySelector('h2');
      if (!titre && visible(t)) titre = t;
    }
    return { fig, titre };
  }
  function nommer({ fig, titre }, transition) {
    if (fig) fig.style.viewTransitionName = 'fig-hero';
    if (titre) titre.style.viewTransitionName = 'titre-hero';
    transition?.finished.finally(() => { if (fig) fig.style.viewTransitionName = ''; if (titre) titre.style.viewTransitionName = ''; });
  }
  const typeSuivant = (vt) => { try { if (sessionStorage.getItem('labo-vt') === 'suivant') vt.types.add('suivant'); } catch { /* sans stockage : glissement non typé */ } };
  addEventListener('pageswap', (e) => {
    if (!e.viewTransition || html.dataset.transitions !== '1') return;
    typeSuivant(e.viewTransition);
    const dest = e.activation?.entry?.url;
    if (dest && nomFiche(dest) && !nomFiche(location.href)) nommer(elementsPour(dest), e.viewTransition);
  });
  addEventListener('pagereveal', (e) => {
    if (!e.viewTransition || html.dataset.transitions !== '1') return;
    typeSuivant(e.viewTransition);
    try { sessionStorage.removeItem('labo-vt'); } catch { /* idem */ }
    const depuis = window.navigation?.activation?.from?.url;
    if (depuis && nomFiche(depuis) && !nomFiche(location.href)) nommer(elementsPour(depuis), e.viewTransition);
  });

  document.addEventListener('DOMContentLoaded', () => {
    panneau();
    if (reglages.transitions === '1') suivante();
    if (reglages.annotations === '1') annotations();
    if (reglages.frise === '1') frise();
    if (reglages.manchette === '1') manchette();
  });

  /* ---------- Panneau : chaque réglage recharge la page, pour rejouer l'entrée ---------- */
  function panneau() {
    const d = document.createElement('details');
    d.className = 'labo-panneau';
    const coche = (k, txt) => `<label><input type="checkbox" data-k="${k}" ${reglages[k] === '1' ? 'checked' : ''}> ${txt}</label>`;
    d.innerHTML = `<summary>Laboratoire de mouvement</summary><div class="corps">
      ${coche('compo', '1 · La une se compose')}
      <fieldset><legend>2 · Parallaxe</legend>${['0:aucune', '1:discrète', '2:marquée', '3:expressive'].map(s => { const [v, t] = s.split(':'); return `<label><input type="radio" name="px" data-k="parallaxe" value="${v}" ${reglages.parallaxe === v ? 'checked' : ''}> ${t}</label>`; }).join('')}</fieldset>
      ${coche('transitions', '3 · La réalisation devient la page')}
      ${coche('annotations', '4 · Annotations vivantes')}
      ${coche('frise', '5 · Frise qui se lit')}
      ${coche('manchette', '6 · Trait de lecture glissant')}
      <div class="actions-labo"><button type="button" data-rejouer>Rejouer l'entrée</button><a href="../labo/">Le laboratoire</a><a href="../v2bis/">V2bis sans effets</a></div>
    </div>`;
    if (sessionStorage.getItem('labo-ouvert') === '1') d.open = true;
    d.addEventListener('toggle', () => { try { sessionStorage.setItem('labo-ouvert', d.open ? '1' : '0'); } catch { /* idem */ } });
    d.addEventListener('change', (e) => {
      const k = e.target.dataset.k; if (!k) return;
      reglages[k] = e.target.type === 'checkbox' ? (e.target.checked ? '1' : '0') : e.target.value;
      try { sessionStorage.setItem('labo', JSON.stringify(reglages)); } catch { /* idem */ }
      location.replace(location.pathname + location.hash);
    });
    d.querySelector('[data-rejouer]').addEventListener('click', () => { scrollTo(0, 0); location.replace(location.pathname); });
    document.body.append(d);
  }

  /* ---------- 3 bis. « Réalisation suivante » au bas de chaque fiche ---------- */
  function suivante() {
    const ici = nomFiche(location.href); if (!ici) return;
    const titres = { 'artefacts-2050.html': 'Artéfacts 2050', 'researchrabbit.html': 'ResearchRabbit', 'atlas.html': 'Atlas' };
    const suiv = FICHES[(FICHES.indexOf(ici) + 1) % FICHES.length];
    const nav = document.createElement('nav');
    nav.className = 'labo-suivant'; nav.setAttribute('aria-label', 'Réalisation suivante');
    nav.innerHTML = `<p class="rubrique">Réalisation suivante</p><a href="${suiv}">${titres[suiv]} <span class="fleche" aria-hidden="true">→</span></a>`;
    nav.querySelector('a').addEventListener('click', () => { try { sessionStorage.setItem('labo-vt', 'suivant'); } catch { /* idem */ } });
    document.querySelector('.fiche-page main')?.append(nav);
  }

  /* ---------- 4. Cercles au stylo autour des zones commentées ---------- */
  function annotations() {
    const g = document.querySelector('.graphique'); if (!g) return;
    const W = 1041, H = 546;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'labo-annot'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('aria-hidden', 'true');
    // Tracé « à main levée » : une ellipse légèrement irrégulière qui dépasse son point de départ.
    const cercle = (cx, cy, rx, ry, graine) => {
      const pts = [], debut = -2.3 + graine, tours = Math.PI * 2 + 0.45;
      for (let i = 0; i <= 48; i++) {
        const t = debut + (tours * i) / 48, f = 1 + 0.05 * Math.sin(3 * t + graine * 5) + 0.05 * (i / 48);
        pts.push(`${(cx + rx * f * Math.cos(t)).toFixed(1)} ${(cy + ry * f * Math.sin(t)).toFixed(1)}`);
      }
      return `M${pts.join('L')}`;
    };
    const appels = [...g.querySelectorAll('.appel')];
    const chemins = appels.map((a, i) => {
      const cx = parseFloat(a.style.left) / 100 * W, cy = parseFloat(a.style.top) / 100 * H;
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', cercle(cx, cy, 82, 52, i * 0.7)); p.setAttribute('pathLength', '1');
      svg.append(p);
      new MutationObserver(() => p.classList.toggle('actif', a.classList.contains('actif'))).observe(a, { attributes: true, attributeFilter: ['class'] });
      return p;
    });
    g.querySelector('.trace-svg')?.after(svg);
    // Première lecture : après la tendance (1,1 s), les trois cercles se tracent l'un après l'autre.
    const io = new IntersectionObserver((entrees) => {
      if (!entrees.some(e => e.isIntersecting)) return;
      io.disconnect();
      chemins.forEach((p, i) => setTimeout(() => p.classList.add('vu'), reduit ? 0 : 1200 + i * 380));
    }, { threshold: 0.5 });
    io.observe(g);
  }

  /* ---------- 5. Frise : ordre chronologique, « aujourd'hui » du jour, barres en cours prolongées jusqu'à lui ---------- */
  function frise() {
    const cadre = document.querySelector('.frise-cadre'); if (!cadre) return;
    const d = new Date(), annee = d.getFullYear() + (d - new Date(d.getFullYear(), 0, 1)) / 31557600000;
    const maintenant = Math.min(annee, 2027).toFixed(3);
    cadre.style.setProperty('--maintenant', maintenant);
    const barres = [...cadre.querySelectorAll('.barre')];
    barres.forEach(b => { if (b.classList.contains('en-cours')) b.style.setProperty('--f', maintenant); });
    barres.sort((a, b) => parseFloat(a.style.getPropertyValue('--d')) - parseFloat(b.style.getPropertyValue('--d')))
      .forEach((b, i) => b.style.setProperty('--i', i));
    cadre.style.setProperty('--auj-delai', `${barres.length * 110 + 900}ms`);
    const li = document.createElement('li'); li.className = 'labo-auj'; li.textContent = "aujourd'hui"; li.setAttribute('aria-hidden', 'true');
    cadre.querySelector('.axe ol')?.append(li);
  }

  /* ---------- 6. Trait de lecture : suit la rubrique courante et s'allonge avec la progression ---------- */
  function manchette() {
    const ol = document.querySelector('.manchette .sommaire ol'); if (!ol) return;
    const trait = document.createElement('li'); trait.className = 'labo-trait'; trait.setAttribute('aria-hidden', 'true');
    ol.append(trait);
    const maj = () => {
      const a = ol.querySelector('a[aria-current="true"]');
      trait.classList.toggle('pret', !!a); if (!a) return;
      const p = parseFloat(a.style.getPropertyValue('--p')) || 0;
      trait.style.setProperty('--x', a.offsetLeft + 'px');
      trait.style.setProperty('--w', (a.offsetWidth * (0.18 + 0.82 * p)).toFixed(1));
    };
    new MutationObserver((recs) => { if (recs.some(m => m.target !== trait)) maj(); }).observe(ol, { attributes: true, subtree: true, attributeFilter: ['aria-current', 'style'] });
    maj();
  }
})();
