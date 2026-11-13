// Tu préfères ? Chacun choisit son camp puis le défend.
Arcade.register({
  id: 'rather', ordre: 6, icone: '🤔', couleur: '#ff777b',
  titre: 'Tu préfères ?',
  sousTitre: 'Deux choix, zéro bonne réponse.',
  regle: 'Choisissez votre camp en même temps, puis défendez votre réponse.',
  init: (root) => Arcade.promptCard(root, 'rather', 'CHOISIS TON CAMP', 'Expliquez vos choix. Il n’y a pas de mauvaise réponse.')
});
