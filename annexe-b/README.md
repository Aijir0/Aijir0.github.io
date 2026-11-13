# annexe-b — mini-arcade de soirée (noindex, absente des menus et du sitemap)

- **Lancer** : double-clic sur `index.html` (marche en `file://`, hors ligne, sans build ni CDN).
- **Structure** : `styles/` (tokens → base → components → `games/*.css`), `scripts/data/` (contenu), `scripts/core/` (utils, stockage, état, audio, vibrations, confettis, carte de question), `scripts/games/` (un fichier par jeu ; `timed.js` porte Défi express et Catégories), `scripts/main.js` (vues et navigation construites depuis le registre), `assets/` (icônes SVG, Lilita One sous-ensemble + licence OFL).
- **Scripts classiques** (`defer`, pas de modules) : tout passe par l'objet global `window.Arcade`.
- **Ajouter des questions** : une ligne dans `scripts/data/prompts.js`, sous la clé du jeu.
- **Ajouter un jeu** : créer `scripts/games/mon-jeu.js` qui appelle
  `Arcade.register({ id, ordre, icone, couleur, titre, sousTitre, regle, init(root) })`
  et ajouter sa ligne `<script src="scripts/games/mon-jeu.js" defer>` dans `index.html`
  (en `file://`, un navigateur ne peut pas lister un dossier). La tuile et la vue se créent seules.
  Style propre facultatif : `styles/games/mon-jeu.css` + une ligne `<link>`. Couleur du stand : une variable de `tokens.css`.
- **Vibrations** : `Arcade.vibre()`, actives seulement quand le son est activé.
- **Objet caché du site** (petit encrier, pied de page de l'accueil) : supprimer le bloc
  `<!-- EASTER-EGG:START -->…<!-- EASTER-EGG:END -->` de `/index.html` et les fichiers
  `/assets/site/encrier.css` et `/assets/site/encrier.js`. Le jeu n'en dépend pas.
- Ce README est exclu de la publication (`_config.yml`).
