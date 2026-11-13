// Je n’ai jamais : ceux qui l’ont déjà fait lèvent la main.
Arcade.register({
  id: 'never', ordre: 3, icone: 'assets/icons/never.svg', couleur: 'var(--soleil)',
  titre: 'Je n’ai jamais',
  sousTitre: 'Des révélations innocentes… ou pas.',
  regle: 'Lisez la phrase. Ceux qui l’ont déjà fait lèvent la main, marquent un point ou jouent leur option.',
  init: (root) => Arcade.promptCard(root, 'never', {
    classe: 'confession',
    tag: 'Avoue… ou pas',
    foot: 'Ceux qui l’ont déjà fait lèvent la main.',
    decor: '<img class="deco main-levee" src="assets/icons/never.svg" alt="">'
  })
});
