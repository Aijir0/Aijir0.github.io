// Tu préfères ? Deux tickets, un « OU » au milieu : chacun choisit son camp puis le défend.
Arcade.register({
  id: 'rather', ordre: 6, icone: 'assets/icons/rather.svg', couleur: 'var(--menthe)',
  titre: 'Tu préfères ?',
  sousTitre: 'Deux choix, zéro bonne réponse.',
  regle: 'Choisissez votre camp en même temps, puis défendez votre réponse.',
  init: (root) => Arcade.promptCard(root, 'rather', {
    classe: 'duel',
    tag: 'Choisis ton camp',
    foot: 'Expliquez vos choix. Il n’y a pas de mauvaise réponse.',
    // « A OU B ? » devient deux tickets ; une phrase sans « OU » reste sur un seul ticket.
    afficher(el, texte) {
      const [a, b] = texte.replace(/\s*\?$/, '').split(' OU ');
      el.innerHTML = b
        ? `<span class="ticket ticket-a">${Arcade.esc(a)}</span><span class="ou">ou</span><span class="ticket ticket-b">${Arcade.esc(b)}</span>`
        : `<span class="ticket ticket-a">${Arcade.esc(texte)}</span>`;
    }
  })
});
