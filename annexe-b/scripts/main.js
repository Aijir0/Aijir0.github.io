// Point d'entrée : navigation construite depuis le registre, scène, joueurs, son et mode de jeu.
(function (A) {
  'use strict';
  const $ = A.$;
  const jeux = A.jeux();
  // Tuile « jeu mystère » : pas un jeu, elle en tire un au sort parmi ceux du registre.
  const SURPRISE = { id: 'random', icone: '🎲', titre: 'Surprends-moi !', sousTitre: 'Un jeu tiré au sort.', couleur: '#d8ff76' };
  const num = (i) => String(i + 1).padStart(2, '0');

  function renderNav() {
    const nav = $('games');
    nav.innerHTML = [...jeux, SURPRISE].map((g, i) => `<button type="button" class="game ${g.id === A.state.currentGame ? 'active' : ''} ${g === SURPRISE ? 'random' : ''}" data-game="${g.id}" style="--card-accent:${g.couleur}" aria-pressed="${g.id === A.state.currentGame}"><span class="game-icon">${g.icone}</span><span class="game-title">${g.titre}</span><span class="game-sub">${g.sousTitre}</span><span class="game-number">${num(i)}</span></button>`).join('');
    nav.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => chooseGame(b.dataset.game, true)));
  }

  function chooseGame(id, scroll = false) {
    if (id === SURPRISE.id) {
      id = A.sample(jeux).id;
      A.toast('🎲 Jeu mystère sélectionné !');
    }
    clearInterval(A.state.timer);
    A.state.timer = null;
    A.state.currentGame = id;
    const g = jeux.find((x) => x.id === id);
    $('stageTitle').textContent = g.titre;
    $('stageRules').textContent = g.regle;
    document.querySelector('.stage-tag').textContent = `EN COURS · #${num(jeux.indexOf(g))}`;
    renderNav();
    const root = $('stageContent');
    root.innerHTML = '';
    g.init(root);
    if (scroll) $('stage').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Joueurs
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
    if (g.joueursModifies) g.joueursModifies($('stageContent'));
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

  // Son
  $('soundBtn').addEventListener('click', () => {
    A.state.sound = !A.state.sound;
    const btn = $('soundBtn');
    btn.setAttribute('aria-pressed', String(A.state.sound));
    btn.innerHTML = A.state.sound ? '🔊 <span class="hide-mobile">Sons activés</span>' : '🔇 <span class="hide-mobile">Sons désactivés</span>';
    if (A.state.sound) A.beep(800, 0.08);
  });

  // Mode de jeu
  $('playMode').addEventListener('change', () => {
    A.storage.set('afterhours-mode', A.mode());
    A.toast(A.mode() === 'sips' ? 'Petites gorgées toujours facultatives ✦' : A.mode() === 'points' ? 'Mode points activé 🏆' : 'Mode gages activé 😈');
  });
  const initialMode = A.storage.get('afterhours-mode', 'points');
  if (['points', 'challenges', 'sips'].includes(initialMode)) $('playMode').value = initialMode;

  $('playersCount').textContent = players.length + ' joueurs';
  chooseGame('wheel');
})(window.Arcade = window.Arcade || {});
