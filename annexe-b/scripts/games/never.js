// Je n’ai jamais : ceux qui l’ont déjà fait lèvent la main.
Arcade.register({
  id: 'never', ordre: 3, icone: '🔥', couleur: '#ffb567',
  titre: 'Je n’ai jamais',
  sousTitre: 'Des révélations innocentes… ou pas.',
  regle: 'Lisez la phrase. Ceux qui l’ont déjà fait lèvent la main, marquent un point ou jouent leur option.',
  init: (root) => Arcade.promptCard(root, 'never', 'AVOUE… OU PAS', 'Ceux qui l’ont déjà fait lèvent la main.')
});
