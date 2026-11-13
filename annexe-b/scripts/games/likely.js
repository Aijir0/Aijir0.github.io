// Qui de nous ? Tout le monde pointe la personne qui correspond le plus.
Arcade.register({
  id: 'likely', ordre: 2, icone: 'assets/icons/likely.svg', couleur: 'var(--rose)',
  titre: 'Qui de nous ?',
  sousTitre: 'Vote en pointant du doigt.',
  regle: 'Lisez l’affirmation. À trois, chacun pointe la personne qui lui correspond le plus.',
  init: (root) => Arcade.promptCard(root, 'likely', {
    classe: 'panneau',
    tag: 'Le groupe décide',
    foot: '3, 2, 1… tout le monde pointe !',
    decor: '<img class="deco doigt" src="assets/icons/likely.svg" alt="">'
  })
});
