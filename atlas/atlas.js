// Atlas : globe 3D stylisé (three.js), rendu seulement quand quelque chose bouge.
// En cas d'échec (WebGL absent, fichier manquant), la page montre la liste HTML des lieux.
const racine = document.documentElement;
const canvas = document.getElementById('globe');
const calme = matchMedia('(prefers-reduced-motion: reduce)');

try {
  const THREE = await import('./vendor/three.module.min.js');
  const reponse = await fetch('donnees/ne_110m_land.geojson');
  if (!reponse.ok) throw new Error(`Natural Earth : HTTP ${reponse.status}`);
  demarrer(THREE, await reponse.json());
  racine.classList.add('globe-pret');
} catch (erreur) {
  console.error('Atlas : globe indisponible.', erreur);
  racine.classList.add('sans-globe');
}

function demarrer(THREE, terres) {
  const D = Math.PI / 180;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); // lève une erreur sans WebGL
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const tan = Math.tan(15 * D); // demi-champ vertical

  // Carte équirectangulaire dessinée une fois : océan papier, graticule tous les 15°, terres en aplats verts.
  const L = Math.min(renderer.capabilities.maxTextureSize, 4096);
  const carte = document.createElement('canvas');
  carte.width = L; carte.height = L / 2;
  const c = carte.getContext('2d');
  const x = lon => (lon + 180) / 360 * L, y = lat => (90 - lat) / 360 * L;
  c.fillStyle = '#f5f2ea';
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

  const texture = new THREE.CanvasTexture(carte);
  texture.colorSpace = THREE.SRGBColorSpace;
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

  // État de la vue : point du globe face à la caméra, vitesses (degrés/ms), zoom.
  const etat = { lon: -45, lat: 28, vLon: 0, vLat: 0, zoom: 1, zoomCible: 1 };
  const ZOOM = [0.8, 2.2], INERTIE = 250, AUTO = 0.004, PAS = 10; // au-delà de 2,2, le tracé 1:110m devient anguleux
  let d0 = 5, interagi = false, raf = 0, avant = 0;

  const distance = () => 1 + (d0 - 1) / etat.zoom; // jamais sous 1 : on n'entre pas dans la sphère
  const borner = () => {
    etat.lat = Math.max(-80, Math.min(80, etat.lat));
    etat.lon = ((etat.lon + 180) % 360 + 360) % 360 - 180;
  };
  const auto = () => !interagi && !calme.matches;

  function rendre() {
    const r = distance(), p = (etat.lon + 180) * D, t = etat.lat * D;
    camera.position.set(-Math.cos(p) * Math.cos(t) * r, Math.sin(t) * r, Math.sin(p) * Math.cos(t) * r); // même repère que les UV de SphereGeometry
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  function cadrer() {
    const a = innerWidth / innerHeight;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = a;
    camera.updateProjectionMatrix();
    // Diamètre visé : 72 % de la hauteur, sans dépasser 88 % de la largeur (téléphone en portrait).
    d0 = 1 / Math.sin(Math.atan(Math.min(0.72, 0.88 * a) * tan));
    rendre();
  }

  function image(t) {
    const dt = Math.min(t - avant, 50);
    avant = t;
    if (auto()) etat.lon -= AUTO * dt; // sens de rotation de la Terre
    etat.lon += etat.vLon * dt;
    etat.lat += etat.vLat * dt;
    const f = Math.exp(-dt / INERTIE);
    etat.vLon *= f; etat.vLat *= f;
    if (Math.abs(etat.vLon) + Math.abs(etat.vLat) < 2e-4) etat.vLon = etat.vLat = 0;
    etat.zoom += (etat.zoomCible - etat.zoom) * (1 - Math.exp(-dt / 90));
    if (Math.abs(etat.zoomCible - etat.zoom) < 1e-3) etat.zoom = etat.zoomCible;
    borner();
    rendre();
    const bouge = auto() || etat.vLon || etat.vLat || etat.zoom !== etat.zoomCible;
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
    relancer();
  }

  // Souris, stylet et tactile : glisser pour tourner, pincer pour zoomer.
  const pointeurs = new Map();
  const ecart = () => { const [a, b] = pointeurs.values(); return Math.hypot(a.x - b.x, a.y - b.y); };
  let vitesse = { lon: 0, lat: 0 }, dernier = 0, pince = 0;

  canvas.addEventListener('pointerdown', e => {
    canvas.setPointerCapture(e.pointerId);
    pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    interagi = true;
    etat.vLon = etat.vLat = 0;
    vitesse = { lon: 0, lat: 0 };
    dernier = e.timeStamp;
    pince = pointeurs.size === 2 ? ecart() : 0;
    canvas.classList.add('saisi');
  });
  canvas.addEventListener('pointermove', e => {
    const p = pointeurs.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (pointeurs.size === 2) {
      const n = ecart();
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
    if (!calme.matches && e.timeStamp - dernier < 80) { etat.vLon = vitesse.lon; etat.vLat = vitesse.lat; } // inertie si le geste était encore en cours
    relancer();
  };
  canvas.addEventListener('pointerup', lacher);
  canvas.addEventListener('pointercancel', lacher);
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    zoomer(etat.zoomCible * Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0015)));
  }, { passive: false });

  // Clavier : flèches pour tourner (maintenir pour continuer), + et − pour zoomer.
  addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const sens = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
    if (sens && calme.matches) { etat.lon += sens[0] * PAS; etat.lat += sens[1] * PAS; borner(); }
    else if (sens) { etat.vLon = sens[0] * PAS / INERTIE; etat.vLat = sens[1] * PAS / INERTIE; } // l'inertie parcourt PAS degrés
    else if (e.key === '+' || e.key === '=') zoomer(etat.zoomCible * 1.25);
    else if (e.key === '-' || e.key === '_') zoomer(etat.zoomCible / 1.25);
    else return;
    e.preventDefault();
    interagi = true;
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
}
