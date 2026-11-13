// État partagé : joueurs, jeu en cours, paquets de questions, registre des jeux.
(function (A) {
  'use strict';
  const DEFAUT = ['Alex', 'Camille', 'Lou', 'Sam'];
  let players = A.storage.get('afterhours-players', DEFAUT);
  if (!Array.isArray(players)) players = DEFAUT;
  players = players.filter((v) => typeof v === 'string' && v.trim()).slice(0, 12);
  if (players.length < 2) players = ['Alex', 'Sam'];

  A.state = { players, currentGame: 'wheel', timer: null, sound: false };

  A.mode = () => A.$('playMode').value;
  A.feedbackText = () =>
    A.mode() === 'sips' ? 'Petite gorgée facultative (ou eau / rien).'
      : A.mode() === 'challenges' ? 'Choisis un mini-gage, ou passe.'
        : 'Aucun point ce tour-ci.';

  // Paquets mélangés : chaque question sort une fois avant que le paquet soit rebattu.
  const decks = {}, draws = {};
  A.nextPrompt = (kind) => {
    if (!decks[kind]?.length) decks[kind] = A.shuffle(A.prompts[kind]);
    draws[kind] = (draws[kind] || 0) + 1;
    return decks[kind].pop();
  };
  A.drawCount = (kind) => draws[kind] || 0;

  // Registre : chaque fichier de jeu appelle Arcade.register({...}) ; main.js construit la navigation.
  const jeux = [];
  A.register = (jeu) => { jeux.push(jeu); };
  A.jeux = () => jeux.slice().sort((a, b) => (a.ordre ?? Infinity) - (b.ordre ?? Infinity));
})(window.Arcade = window.Arcade || {});
