// Atlas : globe 3D stylisé (three.js), rendu seulement quand quelque chose bouge.
// Les lieux viennent de data/destinations.json : ajouter un lieu = ajouter un objet à ce fichier.
// Sans WebGL, la liste des lieux s'affiche dans la page et ouvre le même panneau.
const racine = document.documentElement;
const canvas = document.getElementById('globe');
const panneau = document.getElementById('panneau');
const visionneuse = document.getElementById('visionneuse');
const boutonListe = document.getElementById('bouton-liste');
const blocListe = document.getElementById('liste');
const grappe = document.getElementById('grappe');
const calme = matchMedia('(prefers-reduced-motion: reduce)');
const etroit = matchMedia('(max-width: 640px)'); // même seuil que le volet du bas dans atlas.css
const PAPIER = '#f5f2ea', ENCRE = '#1a1c1a', ROUGE = '#a63d2a';
const $ = s => document.querySelector(s);
const el = (tag, props, ...enfants) => { const e = Object.assign(document.createElement(tag), props); e.append(...enfants); return e; };

async function charger(url) {
  const reponse = await fetch(url);
  if (!reponse.ok) throw new Error(`${url} : HTTP ${reponse.status}`);
  return reponse.json();
}

// Un lieu incomplet est écarté avec un avertissement, plutôt que de casser la page.
function lire(json) {
  const types = json.types ?? {}, vus = new Set();
  const lieux = (json.destinations ?? []).filter(l => {
    const valide = /^[a-z0-9-]+$/.test(l.id) && !vus.has(l.id) && l.nom && types[l.type]
      && Math.abs(l.lat) <= 90 && Math.abs(l.lng) <= 180;
    if (!valide) console.warn('Atlas : lieu ignoré (id, nom, type, lat ou lng invalide, ou id en double).', l);
    vus.add(l.id);
    return valide;
  });
  for (const l of lieux) {
    l.anecdotes = (l.anecdotes ?? []).filter(Boolean);
    l.photos = (l.photos ?? []).filter(p => {
      const valide = p?.fichier && p.alt?.trim();
      if (!valide) console.warn('Atlas : photo ignorée (fichier ou alt manquant).', l.id, p);
      return valide;
    });
  }
  return { types, lieux };
}

// Repère d'un type : forme et couleur, avec un liseré papier qui le détache des terres comme de l'océan.
// marge = 2 : le repère occupe la moitié du carré, le reste sert de zone de clic (44 px à l'écran).
// Un lieu emblématique reçoit en plus un anneau fin, à distance de la forme.
const formes = {
  disque: (g, m, r) => g.arc(m, m, r, 0, 2 * Math.PI),
  losange: (g, m, r) => { const d = r * 1.3; g.moveTo(m, m - d); g.lineTo(m + d, m); g.lineTo(m, m + d); g.lineTo(m - d, m); g.closePath(); },
  carre: (g, m, r) => g.rect(m - r * .9, m - r * .9, r * 1.8, r * 1.8),
};
function anneauEmbleme(g, m, u, couleur) {
  g.beginPath();
  g.arc(m, m, u * .46, 0, 2 * Math.PI);
  g.strokeStyle = PAPIER; g.lineWidth = u * .11; g.stroke();
  g.strokeStyle = couleur; g.lineWidth = u * .045; g.stroke();
}
function repere(type, px, marge = 1, emblematique = false) {
  const c = el('canvas', { width: px, height: px }), g = c.getContext('2d');
  const m = px / 2, u = px / marge * (emblematique && marge === 1 ? .8 : 1), r = u * .27;
  const trace = rr => { g.beginPath(); (formes[type.forme] ?? formes.disque)(g, m, rr); };
  if (emblematique) anneauEmbleme(g, m, u, type.couleur);
  g.fillStyle = PAPIER; trace(r + u * .1); g.fill();
  if (type.forme === 'anneau') { g.strokeStyle = type.couleur; g.lineWidth = r * .55; trace(r * .725); g.stroke(); }
  else { g.fillStyle = type.couleur; trace(r); g.fill(); }
  return c;
}
const symbole = (type, emblematique) => el('img', {
  src: emblematique ? type.iconeEmbleme : type.icone, alt: '', width: 18, height: 18, className: 'symbole',
});
const sansDoublon = l => (l.pays && l.pays !== l.nom ? l.pays : ''); // « Mali, Mali » : le pays n'apporte rien

// ---------- Données, liste, légende ----------
let types = {}, lieux = [];
try {
  ({ types, lieux } = lire(await charger('data/destinations.json')));
} catch (erreur) {
  console.error('Atlas : destinations illisibles.', erreur);
}
for (const t of Object.values(types)) {
  t.icone = repere(t, 64).toDataURL();
  t.iconeEmbleme = repere(t, 64, 1, true).toDataURL();
}

function boutonLieu(l, avecPays) {
  const t = types[l.type];
  return el('button', { type: 'button', className: 'lieu' }, symbole(t, l.emblematique), el('span', { className: 'nom' }, l.nom),
    el('span', { className: 'visuellement-cache' }, `, ${t.libelle}${l.emblematique ? ', lieu emblématique' : ''}`),
    ...(avecPays ? [el('span', { className: 'pays' }, sansDoublon(l))] : []));
}
for (const l of lieux) {
  const b = boutonLieu(l, true);
  b.addEventListener('click', () => { ouvrir(l, b); fermerListe(); });
  blocListe.firstElementChild.append(el('li', {}, b));
}
if (!lieux.length) blocListe.firstElementChild.append(el('li', { className: 'vide' }, 'Aucun lieu pour l\'instant.'));

function fermerListe(rendreFocus) {
  if (blocListe.hidden) return;
  blocListe.hidden = true;
  boutonListe.setAttribute('aria-expanded', 'false');
  if (rendreFocus) boutonListe.focus();
}
boutonListe.addEventListener('click', () => {
  if (!blocListe.hidden) return fermerListe();
  fermerGrappe();
  blocListe.hidden = false;
  boutonListe.setAttribute('aria-expanded', 'true');
  blocListe.querySelector('button')?.focus();
});

const masques = new Set(); // types masqués par la légende
const legende = $('#legende');
for (const [cle, t] of Object.entries(types)) {
  if (!lieux.some(l => l.type === cle)) continue;
  const b = el('button', { type: 'button' }, symbole(t), t.libelle);
  b.setAttribute('aria-pressed', 'true');
  b.addEventListener('click', () => {
    const afficher = masques.has(cle);
    afficher ? masques.delete(cle) : masques.add(cle);
    b.setAttribute('aria-pressed', String(afficher));
    fermerGrappe();
    globe?.actualiser();
  });
  legende.append(b);
}
if (lieux.some(l => l.emblematique)) {
  const c = el('canvas', { width: 64, height: 64 });
  anneauEmbleme(c.getContext('2d'), 32, 64 * .8, ENCRE);
  legende.append(el('span', { className: 'legende-note' }, el('img', { src: c.toDataURL(), alt: '', width: 18, height: 18, className: 'symbole' }), 'Lieu emblématique'));
}
legende.hidden = !legende.childElementCount;

// ---------- Panneau d'un lieu ----------
let ouvert = null, retour = null, globe = null;

function ouvrir(lieu, declencheur, immediat) {
  const t = types[lieu.type];
  // Seuls le nom et le type sont obligatoires : tout champ vide est masqué.
  $('#panneau-titre').textContent = lieu.nom;
  $('#panneau-pays').textContent = sansDoublon(lieu);
  $('#panneau-pays').hidden = !sansDoublon(lieu);
  $('#panneau-type').replaceChildren(symbole(t, lieu.emblematique), lieu.emblematique ? `${t.libelle}, lieu emblématique` : t.libelle);
  $('#panneau-periode dd').textContent = lieu.periode ?? '';
  $('#panneau-periode').hidden = !lieu.periode;
  $('#panneau-resume').textContent = lieu.resume ?? '';
  $('#panneau-resume').hidden = !lieu.resume;
  $('#panneau-anecdotes ul').replaceChildren(...lieu.anecdotes.map(a => el('li', {}, a)));
  $('#panneau-anecdotes').hidden = !lieu.anecdotes.length;
  $('#panneau-photos ul').replaceChildren(...lieu.photos.map(p => {
    const b = el('button', { type: 'button', className: 'vignette' }, el('img', { src: `photos/${p.fichier}`, alt: p.alt, loading: 'lazy', decoding: 'async' }));
    b.setAttribute('aria-label', `Agrandir la photo : ${p.alt}`);
    b.addEventListener('click', () => agrandir(p));
    return el('li', {}, b, ...(p.legende ? [el('p', { className: 'legende-photo' }, p.legende)] : []));
  }));
  $('#panneau-photos').hidden = !lieu.photos.length;
  panneau.scrollTop = 0;

  fermerGrappe();
  if (!ouvert) retour = declencheur ?? null; // en passant d'un lieu à l'autre, on garde le premier déclencheur
  ouvert = lieu;
  panneau.classList.add('ouvert');
  racine.classList.add('avec-panneau');
  history.replaceState(null, '', `#${lieu.id}`);
  globe?.viser(lieu, immediat);
  if (!immediat) $('#panneau-titre').focus({ preventScroll: true }); // pas à l'arrivée par un lien direct
}

function fermer() {
  if (!ouvert) return;
  const focusDedans = panneau.contains(document.activeElement);
  ouvert = null;
  panneau.classList.remove('ouvert');
  racine.classList.remove('avec-panneau');
  history.replaceState(null, '', location.pathname + location.search);
  globe?.viser(null);
  // Le focus revient d'où l'on venait (lieu de la liste, ou à défaut le bouton « Liste des lieux »).
  if (focusDedans) (retour?.checkVisibility?.() ? retour : boutonListe).focus();
}
panneau.querySelector('.fermer').addEventListener('click', fermer);

// Repères regroupés : un petit menu des lieux, ouvert là où l'on a cliqué.
function ouvrirGrappe(liste, x, y) {
  $('#grappe-titre').textContent = `${liste.length} lieux ici`;
  grappe.querySelector('ul').replaceChildren(...liste.map(l => {
    const b = boutonLieu(l, false);
    b.addEventListener('click', () => ouvrir(l, null));
    return el('li', {}, b);
  }));
  grappe.hidden = false;
  grappe.style.left = `${Math.max(8, Math.min(x - 24, innerWidth - grappe.offsetWidth - 8))}px`;
  grappe.style.top = `${Math.max(8, Math.min(y + 16, innerHeight - grappe.offsetHeight - 8))}px`;
  grappe.querySelector('button').focus({ preventScroll: true });
}
function fermerGrappe() { grappe.hidden = true; }

function agrandir(photo) {
  const img = visionneuse.querySelector('img');
  img.src = `photos/${photo.fichier}`;
  img.alt = photo.alt;
  visionneuse.querySelector('figcaption').textContent = photo.legende ?? '';
  visionneuse.showModal(); // modal natif : focus piégé, Échap ferme, le focus revient à la vignette
}
visionneuse.querySelector('.fermer').addEventListener('click', () => visionneuse.close());
visionneuse.addEventListener('click', e => { if (e.target === visionneuse) visionneuse.close(); });

addEventListener('keydown', e => {
  if (e.key !== 'Escape' || visionneuse.open) return;
  if (!grappe.hidden) return fermerGrappe();
  if (!blocListe.hidden && !racine.classList.contains('sans-globe')) return fermerListe(true);
  fermer();
});

// L'adresse garde le lieu ouvert (#id) : un lien direct rouvre le même panneau.
function suivreAdresse(immediat) {
  const lieu = lieux.find(l => l.id === decodeURIComponent(location.hash.slice(1)));
  if (!lieu) return fermer();
  if (lieu !== ouvert) ouvrir(lieu, null, immediat);
}
addEventListener('hashchange', () => suivreAdresse(false));

// ---------- Globe ----------
try {
  const THREE = await import('./vendor/three.module.min.js');
  const terres = await charger('data/ne_110m_land.geojson');
  await document.fonts.load('600 38px Newsreader').catch(() => {}); // chiffres des regroupements
  globe = demarrer(THREE, terres);
  racine.classList.add('globe-pret');
} catch (erreur) {
  console.error('Atlas : globe indisponible.', erreur);
  racine.classList.add('sans-globe');
}
suivreAdresse(true);

function demarrer(THREE, terres) {
  const D = Math.PI / 180;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); // lève une erreur sans WebGL
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const tan = Math.tan(15 * D); // demi-champ vertical
  // Même repère que les UV de SphereGeometry : lng -180 en (-1, 0, 0), lng 90 en (0, 0, -1).
  const vecteur = (lat, lng, r = 1) => {
    const p = (lng + 180) * D, t = lat * D;
    return new THREE.Vector3(-Math.cos(p) * Math.cos(t) * r, Math.sin(t) * r, Math.sin(p) * Math.cos(t) * r);
  };

  // Carte équirectangulaire dessinée une fois : océan papier, graticule tous les 15°, terres en aplats verts.
  const L = Math.min(renderer.capabilities.maxTextureSize, 4096);
  const carte = el('canvas', { width: L, height: L / 2 });
  const c = carte.getContext('2d');
  const x = lon => (lon + 180) / 360 * L, y = lat => (90 - lat) / 360 * L;
  c.fillStyle = PAPIER;
  c.fillRect(0, 0, L, L / 2);
  c.strokeStyle = 'rgba(30, 70, 54, .2)';
  c.lineWidth = L / 1600;
  c.beginPath();
  for (let lon = -180; lon < 180; lon += 15) { c.moveTo(x(lon), 0); c.lineTo(x(lon), L / 2); }
  for (let lat = -75; lat <= 75; lat += 15) { c.moveTo(0, y(lat)); c.lineTo(L, y(lat)); }
  c.stroke();
  c.fillStyle = 'rgba(30, 70, 54, .86)';
  c.beginPath();
  for (const { geometry: g } of terres.features) {
    const polygones = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    for (const anneau of polygones.flat()) anneau.forEach(([lon, lat], i) => c[i ? 'lineTo' : 'moveTo'](x(lon), y(lat)));
  }
  c.fill('evenodd'); // un seul remplissage : pas de double opacité, trous respectés

  const toile = source => { const tx = new THREE.CanvasTexture(source); tx.colorSpace = THREE.SRGBColorSpace; return tx; };
  const texture = toile(carte);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshBasicMaterial({ map: texture })));

  // Lueur d'atmosphère : coque arrière un peu plus grande, opaque au bord du globe, nulle à l'extérieur.
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.1, 64, 32), new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, depthWrite: false,
    uniforms: { teinte: { value: new THREE.Color('#1e4636') } },
    vertexShader: `varying float v;
      void main() { vec4 p = modelViewMatrix * vec4(position, 1.0); v = dot(normalize(normalMatrix * normal), normalize(p.xyz)); gl_Position = projectionMatrix * p; }`,
    fragmentShader: `uniform vec3 teinte; varying float v;
      void main() { gl_FragColor = vec4(teinte, pow(clamp(v / 0.42, 0.0, 1.0), 2.5) * 0.3);
      #include <colorspace_fragment>
      }`,
  })));

  // Repères : un sprite par lieu, de taille constante à l'écran.
  const sprite = map => new THREE.Sprite(new THREE.SpriteMaterial({ map, sizeAttenuation: false, depthTest: false, transparent: true }));
  const texturesTypes = {};
  const reperes = lieux.map(l => {
    const cle = l.type + (l.emblematique ? '+' : '');
    const s = sprite(texturesTypes[cle] ??= toile(repere(types[l.type], 128, 2, l.emblematique)));
    s.position.copy(vecteur(l.lat, l.lng));
    s.userData.lieu = l;
    s.renderOrder = l.emblematique ? 2 : 1;
    scene.add(s);
    return s;
  });

  // Regroupements : pastille papier, cerclée d'encre, avec le nombre de lieux (chiffres en Newsreader).
  const SEUIL = 22; // px : en deçà, deux repères se chevauchent
  const grappes = [], materiauxNombre = {};
  const materiauNombre = n => materiauxNombre[n] ??= (() => {
    const t = el('canvas', { width: 128, height: 128 }), g = t.getContext('2d');
    g.beginPath(); g.arc(64, 64, 29, 0, 2 * Math.PI);
    g.fillStyle = PAPIER; g.fill();
    g.strokeStyle = ENCRE; g.lineWidth = 4.5; g.stroke();
    g.fillStyle = ENCRE; g.font = '600 38px Newsreader, Georgia, serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(String(n), 64, 66);
    return new THREE.SpriteMaterial({ map: toile(t), sizeAttenuation: false, depthTest: false, transparent: true });
  })();
  const nouvelleGrappe = () => {
    const s = new THREE.Sprite(materiauNombre(2));
    s.renderOrder = 3;
    s.scale.setScalar(taille(44));
    scene.add(s);
    return s;
  };

  // Cercle de stylo rouge (annotation) autour du lieu ouvert, tracé en 650 ms une fois la caméra arrivée.
  const dessinCercle = el('canvas', { width: 128, height: 128 }), gc = dessinCercle.getContext('2d');
  const texCercle = toile(dessinCercle);
  const cercle = sprite(texCercle);
  cercle.renderOrder = 4;
  scene.add(cercle);
  function tracerCercle(p) {
    gc.clearRect(0, 0, 128, 128);
    if (p > 0) {
      gc.strokeStyle = ROUGE; gc.lineWidth = 5; gc.lineCap = 'round';
      gc.beginPath();
      // Le trait dépasse un peu son point de départ et se resserre, comme un cercle fait à la main.
      for (let i = 0; i <= 64; i++) {
        const s = i / 64 * p, a = -2.3 + (2 * Math.PI + 0.5) * s, r = 50 - 5 * s;
        gc[i ? 'lineTo' : 'moveTo'](64 + r * Math.cos(a), 64 + r * Math.sin(a));
      }
      gc.stroke();
    }
    texCercle.needsUpdate = true;
  }

  // État de la vue : point du globe face à la caméra, vitesses (degrés/ms), zoom, décalage pour le panneau.
  const etat = { lon: -45, lat: 28, vLon: 0, vLat: 0, zoom: 1, zoomCible: 1 };
  const ZOOM = [0.8, 2.2], INERTIE = 250, AUTO = 0.004, PAS = 10; // au-delà de 2,2, le tracé 1:110m devient anguleux
  const decal = { x: 0, y: 0 }, decalCible = { x: 0, y: 0 };
  let d0 = 5, interagi = false, raf = 0, avant = 0, anim = null, trace = null, survol = null;

  const distance = () => 1 + (d0 - 1) / etat.zoom; // jamais sous 1 : on n'entre pas dans la sphère
  const borner = () => {
    etat.lat = Math.max(-80, Math.min(80, etat.lat));
    etat.lon = ((etat.lon + 180) % 360 + 360) % 360 - 180;
  };
  const auto = () => !interagi && !calme.matches;
  const adoucir = p => (p < .5 ? 4 * p ** 3 : 1 - (2 - 2 * p) ** 3 / 2); // accélère puis freine
  function taille(px) { return px * 2 * tan / innerHeight; } // échelle d'un sprite pour px pixels CSS
  const vue = new THREE.Vector3();
  const ecran = s => { const v = s.position.clone().project(camera); return [(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight]; };
  const noms = s => (s.userData.lieux ?? [s.userData.lieu]).map(l => l.nom).join(', ');
  const bulle = $('#infobulle');

  // Regroupe les repères visibles qui se chevauchent à l'écran (fusion des plus proches tant qu'il en reste).
  // Le lieu ouvert reste toujours seul, pour porter son cercle.
  function regrouper(visibles) {
    const groupes = visibles.filter(s => s.userData.lieu !== ouvert).map(s => ({ membres: [s], xy: ecran(s) }));
    for (;;) {
      let paire = null, dmin = SEUIL;
      for (let i = 0; i < groupes.length; i++) for (let j = i + 1; j < groupes.length; j++) {
        const d = Math.hypot(groupes[i].xy[0] - groupes[j].xy[0], groupes[i].xy[1] - groupes[j].xy[1]);
        if (d < dmin) { dmin = d; paire = [i, j]; }
      }
      if (!paire) break;
      const [a, b] = [groupes[paire[0]], groupes[paire[1]]], n = a.membres.length + b.membres.length;
      a.xy = a.xy.map((v, k) => (v * a.membres.length + b.xy[k] * b.membres.length) / n);
      a.membres.push(...b.membres);
      groupes.splice(paire[1], 1);
    }
    let n = 0;
    for (const { membres } of groupes) {
      if (membres.length < 2) continue;
      const g = grappes[n] ?? (grappes[n] = nouvelleGrappe());
      n++;
      g.material = materiauNombre(membres.length);
      g.position.set(0, 0, 0);
      for (const s of membres) { s.visible = false; g.position.add(s.position); }
      g.position.normalize();
      g.userData.lieux = membres.map(s => s.userData.lieu).sort((a, b) => a.nom.localeCompare(b.nom, 'fr')); // ordre stable
      g.visible = true;
    }
    for (let i = n; i < grappes.length; i++) grappes[i].visible = false;
  }

  function rendre() {
    const r = distance();
    camera.position.copy(vecteur(etat.lat, etat.lon, r));
    camera.lookAt(0, 0, 0);
    camera.setViewOffset(innerWidth, innerHeight, decal.x, decal.y, innerWidth, innerHeight);
    camera.updateMatrixWorld();
    // Un repère n'est visible que du côté de la caméra : au-delà de l'horizon (cos = 1/r), il est masqué.
    vue.copy(camera.position).normalize();
    const visibles = reperes.filter(s => (s.visible = !masques.has(s.userData.lieu.type) && s.position.dot(vue) > 1 / r + 0.03));
    regrouper(visibles);
    const choisi = ouvert && reperes.find(s => s.userData.lieu === ouvert);
    cercle.visible = !!choisi?.visible;
    if (choisi) cercle.position.copy(choisi.position);
    renderer.render(scene, camera);
    if (survol?.visible) {
      const [bx, by] = ecran(survol);
      bulle.textContent = noms(survol);
      bulle.style.translate = `${bx}px ${by}px`;
    }
    bulle.hidden = !survol?.visible;
  }

  function cibleDecalage() {
    decalCible.x = decalCible.y = 0;
    if (!ouvert) return;
    // Le lieu se centre dans l'espace libre : à gauche du panneau, ou au-dessus du volet sur téléphone.
    if (etroit.matches) decalCible.y = panneau.offsetHeight / 2;
    else decalCible.x = panneau.offsetWidth / 2;
  }

  function cadrer() {
    const a = innerWidth / innerHeight;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = a;
    camera.updateProjectionMatrix();
    // Diamètre visé : 72 % de la hauteur, sans dépasser 88 % de la largeur (téléphone en portrait).
    d0 = 1 / Math.sin(Math.atan(Math.min(0.72, 0.88 * a) * tan));
    for (const s of [...reperes, ...grappes]) s.scale.setScalar(taille(44));
    cercle.scale.setScalar(taille(48));
    cibleDecalage();
    Object.assign(decal, decalCible);
    fermerGrappe();
    rendre();
  }

  function image(t) {
    const dt = Math.min(t - avant, 50);
    avant = t;
    if (anim) {
      const p = Math.max(0, Math.min((t - anim.t0) / anim.duree, 1)), e = adoucir(p);
      etat.lon = anim.lon + anim.dLon * e;
      etat.lat = anim.lat + anim.dLat * e;
      if (p === 1) anim = null;
    }
    if (trace && !anim) {
      trace.debut ??= t;
      const p = Math.min((t - trace.debut) / 650, 1);
      tracerCercle(adoucir(p));
      if (p === 1) trace = null;
    }
    if (auto()) etat.lon -= AUTO * dt; // sens de rotation de la Terre
    etat.lon += etat.vLon * dt;
    etat.lat += etat.vLat * dt;
    const f = Math.exp(-dt / INERTIE);
    etat.vLon *= f; etat.vLat *= f;
    if (Math.abs(etat.vLon) + Math.abs(etat.vLat) < 2e-4) etat.vLon = etat.vLat = 0;
    etat.zoom += (etat.zoomCible - etat.zoom) * (1 - Math.exp(-dt / 90));
    if (Math.abs(etat.zoomCible - etat.zoom) < 1e-3) etat.zoom = etat.zoomCible;
    for (const k of ['x', 'y']) {
      decal[k] += (decalCible[k] - decal[k]) * (1 - Math.exp(-dt / 110));
      if (Math.abs(decalCible[k] - decal[k]) < 0.5) decal[k] = decalCible[k];
    }
    borner();
    rendre();
    const bouge = auto() || anim || trace || etat.vLon || etat.vLat || etat.zoom !== etat.zoomCible
      || decal.x !== decalCible.x || decal.y !== decalCible.y;
    raf = bouge && !document.hidden ? requestAnimationFrame(image) : 0;
  }
  function relancer() {
    if (raf || document.hidden) return;
    avant = performance.now();
    raf = requestAnimationFrame(image);
  }
  function zoomer(cible, direct) {
    etat.zoomCible = Math.max(ZOOM[0], Math.min(ZOOM[1], cible));
    if (direct || calme.matches) etat.zoom = etat.zoomCible;
    interagi = true;
    fermerGrappe();
    relancer();
  }

  // La caméra pivote pour centrer le lieu ; la vue glisse pour laisser la place au panneau.
  function viser(lieu, immediat) {
    cibleDecalage();
    anim = null;
    trace = null;
    tracerCercle(lieu && calme.matches ? 1 : 0); // mouvement réduit : le cercle est là d'emblée
    if (lieu) {
      interagi = true;
      etat.vLon = etat.vLat = 0;
      const dLon = ((lieu.lng - etat.lon) % 360 + 540) % 360 - 180; // chemin le plus court
      const dLat = Math.max(-80, Math.min(80, lieu.lat)) - etat.lat;
      if (immediat || calme.matches) { etat.lon += dLon; etat.lat += dLat; }
      else anim = { lon: etat.lon, lat: etat.lat, dLon, dLat, t0: performance.now(), duree: Math.min(500 + Math.hypot(dLon, dLat) * 4, 1300) };
      if (!calme.matches) trace = { debut: null };
    }
    if (immediat || calme.matches) Object.assign(decal, decalCible);
    relancer();
  }

  // Sélection par raycasting sur les repères et regroupements visibles ; s'ils se touchent, le plus proche du pointeur l'emporte.
  const rayon = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function viseSous(px, py) {
    ndc.set(px / innerWidth * 2 - 1, 1 - py / innerHeight * 2);
    rayon.setFromCamera(ndc, camera);
    const ecart = s => { const [a, b] = ecran(s); return Math.hypot(a - px, b - py); };
    const cibles = [...reperes, ...grappes].filter(s => s.visible);
    return rayon.intersectObjects(cibles).map(i => i.object).sort((a, b) => ecart(a) - ecart(b))[0] ?? null;
  }
  function survoler(e) {
    const s = e.pointerType === 'mouse' ? viseSous(e.clientX, e.clientY) : null;
    if (s === survol) return;
    survol = s;
    canvas.classList.toggle('sur-repere', !!s);
    rendre();
  }

  // Souris, stylet et tactile : glisser pour tourner, pincer pour zoomer, toucher un repère pour l'ouvrir.
  const pointeurs = new Map();
  const ecartDoigts = () => { const [a, b] = pointeurs.values(); return Math.hypot(a.x - b.x, a.y - b.y); };
  let vitesse = { lon: 0, lat: 0 }, dernier = 0, pince = 0, geste = null;

  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId);
    pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointeurs.size === 1) geste = { x: e.clientX, y: e.clientY, clic: true };
    else geste.clic = false;
    interagi = true;
    anim = null;
    fermerGrappe();
    etat.vLon = etat.vLat = 0;
    vitesse = { lon: 0, lat: 0 };
    dernier = e.timeStamp;
    pince = pointeurs.size === 2 ? ecartDoigts() : 0;
  });
  canvas.addEventListener('pointermove', e => {
    const p = pointeurs.get(e.pointerId);
    if (!p) return survoler(e);
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (geste.clic && Math.hypot(e.clientX - geste.x, e.clientY - geste.y) > 6) {
      geste.clic = false;
      canvas.classList.add('saisi');
    }
    if (geste.clic) return;
    if (pointeurs.size === 2) {
      const n = ecartDoigts();
      if (pince) zoomer(etat.zoomCible * n / pince, true);
      pince = n;
      return;
    }
    const k = 2 * (distance() - 1) * tan / innerHeight / D; // degrés par pixel : le point saisi suit le doigt
    const dLon = -dx * k, dLat = dy * k, dt = Math.max(e.timeStamp - dernier, 1);
    dernier = e.timeStamp;
    etat.lon += dLon; etat.lat += dLat;
    vitesse = { lon: 0.8 * dLon / dt + 0.2 * vitesse.lon, lat: 0.8 * dLat / dt + 0.2 * vitesse.lat };
    borner();
    relancer();
  });
  const lacher = e => {
    if (!pointeurs.delete(e.pointerId)) return;
    pince = 0;
    if (pointeurs.size) return;
    canvas.classList.remove('saisi');
    if (geste.clic && e.type === 'pointerup') {
      const s = viseSous(e.clientX, e.clientY);
      if (s?.userData.lieux) ouvrirGrappe(s.userData.lieux, e.clientX, e.clientY);
      else if (s) ouvrir(s.userData.lieu, null);
      else { fermer(); fermerListe(); } // clic dans le vide
    } else if (!calme.matches && e.timeStamp - dernier < 80) { // inertie si le geste était encore en cours
      etat.vLon = vitesse.lon; etat.vLat = vitesse.lat;
    }
    relancer();
  };
  canvas.addEventListener('pointerup', lacher);
  canvas.addEventListener('pointercancel', lacher);
  canvas.addEventListener('pointerleave', () => { if (!pointeurs.size) survoler({ pointerType: 'aucun' }); });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    zoomer(etat.zoomCible * Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0015)));
  }, { passive: false });

  // Clavier : flèches pour tourner (maintenir pour continuer), + et − pour zoomer. Inactif dans les panneaux et menus.
  addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest?.('#panneau, #liste, #grappe, dialog')) return;
    const sens = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
    if (sens && calme.matches) { etat.lon += sens[0] * PAS; etat.lat += sens[1] * PAS; borner(); }
    else if (sens) { etat.vLon = sens[0] * PAS / INERTIE; etat.vLat = sens[1] * PAS / INERTIE; } // l'inertie parcourt PAS degrés
    else if (e.key === '+' || e.key === '=') zoomer(etat.zoomCible * 1.25);
    else if (e.key === '-' || e.key === '_') zoomer(etat.zoomCible / 1.25);
    else return;
    e.preventDefault();
    interagi = true;
    anim = null;
    fermerGrappe();
    relancer();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return relancer();
    cancelAnimationFrame(raf);
    raf = 0;
  });
  calme.addEventListener('change', relancer);
  addEventListener('resize', cadrer);
  cadrer();
  relancer();
  return { viser, actualiser: relancer };
}
