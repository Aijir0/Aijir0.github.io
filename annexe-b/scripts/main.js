// Point d'entrée : trois vues (accueil, stands, jeu), navigation construite depuis le registre, joueurs, son, mode.
(function (A) {
  'use strict';
  const $ = A.$;
  const jeux = A.jeux();
  // Tuile « jeu mystère » : pas un jeu, elle en tire un au sort parmi ceux du registre.
  const SURPRISE = { id: 'random', icone: 'assets/icons/random.svg', titre: 'Surprends-moi !', sousTitre: 'Un jeu tiré au sort.', couleur: 'var(--papier)' };
  const moinsDeMouvement = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Retire une classe d'animation d'entrée une fois jouée, pour rendre la main aux états :hover/:active.
  function joue(el, classe, duree) {
    el.classList.remove(classe);
    void el.offsetWidth;
    el.classList.add(classe);
    setTimeout(() => el.classList.remove(classe), duree);
  }

  // ---------- Vues ----------
  function montrerStands({ focus = true } = {}) {
    clearInterval(A.state.timer);
    A.state.timer = null;
    A.state.currentGame = null;
    $('stage').hidden = true;
    $('hub').hidden = false;
    $('retourStands').hidden = true;
    $('lienSite').hidden = false;
    document.documentElement.style.removeProperty('--stand');
    window.scrollTo(0, 0);
    if (focus) $('hub').querySelector('.hub-titre').focus({ preventScroll: true });
  }

  function entrer() {
    const accueil = $('accueil');
    const ouvrir = () => {
      accueil.hidden = true;
      $('app').hidden = false;
      montrerStands();
      joue($('games'), 'entree', 900);
    };
    if (moinsDeMouvement()) return ouvrir();
    accueil.classList.add('sort');
    accueil.addEventListener('animationend', ouvrir, { once: true });
  }

  // ---------- Stands ----------
  function renderNav() {
    const nav = $('games');
    nav.innerHTML = [...jeux, SURPRISE].map((g, i) => `<button type="button" class="game ${g === SURPRISE ? 'random' : ''}" data-game="${g.id}" style="--card-accent:${g.couleur};--i:${i}"><span class="game-icon"><img src="${g.icone}" alt=""></span><span class="game-title">${A.insecables(g.titre)}</span><span class="game-sub">${A.insecables(g.sousTitre)}</span></button>`).join('');
    nav.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => chooseGame(b.dataset.game)));
  }

  function chooseGame(id) {
    if (id === SURPRISE.id) {
      id = A.sample(jeux).id;
      A.toast('Jeu mystère sélectionné !');
    }
    clearInterval(A.state.timer);
    A.state.timer = null;
    A.state.currentGame = id;
    const g = jeux.find((x) => x.id === id);
    document.documentElement.style.setProperty('--stand', g.couleur);
    $('stageTitle').textContent = A.insecables(g.titre);
    $('stageRules').textContent = A.insecables(g.regle);
    $('hub').hidden = true;
    $('stage').hidden = false;
    $('retourStands').hidden = false;
    $('lienSite').hidden = true;
    window.scrollTo(0, 0);
    const root = $('stageContent');
    root.innerHTML = '';
    g.init(root);
    joue($('stage'), 'entree', 450);
    $('stageTitle').focus({ preventScroll: true });
    // Le bouton retour du téléphone ramène aux stands au lieu de quitter le jeu.
    if (!history.state?.jeu) history.pushState({ jeu: true }, '');
  }

  $('entrer').addEventListener('click', entrer);
  $('retourStands').addEventListener('click', () => history.state?.jeu ? history.back() : montrerStands());
  window.addEventListener('popstate', () => { if (A.state.currentGame) montrerStands(); });

  // ---------- Joueurs ----------
  const players = A.state.players;
  function renderNames() {
    const root = $('namesList');
    root.innerHTML = players.map((p, i) => `<div class="name-pill">${A.esc(p)} <button type="button" data-index="${i}" aria-label="Retirer ${A.esc(p)}">×</button></div>`).join('');
    root.querySelectorAll('button').forEach((b) => b.onclick = () => {
      if (players.length <= 2) { A.toast('Au moins 2 joueurs pour la roulette'); return; }
      players.splice(Number(b.dataset.index), 1);
      savePlayers();
    });
  }
  function savePlayers() {
    A.storage.set('afterhours-players', players);
    $('playersCount').textContent = players.length + ' joueurs';
    renderNames();
    const g = jeux.find((x) => x.id === A.state.currentGame);
    if (g?.joueursModifies) g.joueursModifies($('stageContent'));
  }
  A.ouvrirJoueurs = () => { $('playersModal').hidden = false; renderNames(); $('nameInput').focus(); };
  function closePlayers() { $('playersModal').hidden = true; $('playersBtn').focus(); }

  $('playersBtn').addEventListener('click', A.ouvrirJoueurs);
  $('closeModal').addEventListener('click', closePlayers);
  $('playersModal').addEventListener('click', (e) => { if (e.target === $('playersModal')) closePlayers(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('playersModal').hidden) closePlayers(); });
  $('nameForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('nameInput').value.trim().replace(/\s+/g, ' ');
    if (!name) return;
    if (players.length >= 12) { A.toast('Maximum 12 joueurs sur la roue'); return; }
    if (players.some((p) => p.toLowerCase() === name.toLowerCase())) { A.toast('Prénom déjà présent'); return; }
    players.push(name);
    $('nameInput').value = '';
    savePlayers();
    $('nameInput').focus();
  });

  // ---------- Son ----------
  $('soundBtn').addEventListener('click', () => {
    A.state.sound = !A.state.sound;
    $('soundBtn').setAttribute('aria-pressed', String(A.state.sound));
    if (A.state.sound) A.beep(800, 0.08);
  });

  // ---------- Mode de jeu ----------
  $('playMode').addEventListener('change', () => {
    A.storage.set('afterhours-mode', A.mode());
    A.toast(A.mode() === 'sips' ? 'Petites gorgées toujours facultatives' : A.mode() === 'points' ? 'Mode points activé' : 'Mode gages activé');
  });
  const initialMode = A.storage.get('afterhours-mode', 'points');
  if (['points', 'challenges', 'sips'].includes(initialMode)) $('playMode').value = initialMode;

  $('playersCount').textContent = players.length + ' joueurs';
  if (history.state?.jeu) history.replaceState(null, ''); // page rechargée en plein jeu : on repart de l'accueil
  renderNav();
})(window.Arcade = window.Arcade || {});
