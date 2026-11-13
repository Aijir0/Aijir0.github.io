# annexe-b — mini-arcade de soirée (non indexée, non publiée dans la navigation)

- **Lancer** : double-clic sur `index.html` (marche en `file://`, hors ligne, sans build ni CDN).
- **Structure** : `styles/` (tokens → base → components → `games/*.css`), `scripts/data/` (contenu), `scripts/core/` (outils partagés), `scripts/games/` (un fichier par jeu), `scripts/main.js` (navigation construite depuis le registre).
- **Scripts classiques** (`defer`, pas de modules) : tout passe par l'objet global `window.Arcade`.
- **Ajouter des questions** : une ligne dans `scripts/data/prompts.js`, sous la clé du jeu.
- **Ajouter un jeu** : créer `scripts/games/mon-jeu.js` qui appelle
  `Arcade.register({ id, ordre, icone, couleur, titre, sousTitre, regle, init(root) })`,
  puis l'inclure par une ligne `<script src="scripts/games/mon-jeu.js" defer></script>` dans `index.html`
  (un navigateur en `file://` ne peut pas découvrir seul les fichiers d'un dossier). La navigation se met à jour seule.
  S'il lui faut un style propre : `styles/games/mon-jeu.css` + une ligne `<link>`.
- **Questions tirées sans répétition** : `Arcade.nextPrompt(id)` lit `Arcade.prompts[id]`.
- **Objet caché sur le site** : voir la section ajoutée à l'étape 3.
- Ce README est exclu de la publication (`_config.yml`).
