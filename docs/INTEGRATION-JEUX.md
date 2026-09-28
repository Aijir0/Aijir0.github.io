# Jeux publics sur GitHub Pages

Les deux jeux sont publics. L’hébergement GitHub Pages et le domaine actuel restent inchangés : **aucune migration, aucun mot de passe, aucun serveur d’authentification**.

## Parcours

Le joystick dans le pied de navigation du site ouvre directement `espace-jeux/selection.html`. Les cartes donnent accès à **Scene Pixel Art** (`jeu/index.html`) et **PacQC** (`PacQC/index.html`). Chaque jeu conserve son lien de retour au menu. Les URL directes fonctionnent sans restriction ; la sélection fonctionne aussi sans JavaScript, avec une vignette fixe.

`espace-jeux/index.html` contient la même sélection pour préserver l’entrée du dossier et les anciens favoris, sans redirection. Si le contenu des cartes change, maintenir ces deux petits fichiers HTML identiques.

Le formulaire, les messages de protection, la déconnexion, `access.js`, ses tests et `.env.example` ont été supprimés. Aucun cookie de session, appel d’API ou contrôle d’accès ne subsiste. Le `.gitignore` garde uniquement des exclusions générales de fichiers locaux privés. Le script PowerShell est un simple serveur de développement statique, pas un composant à installer sur GitHub Pages.

## Cartes de PacQC

`PacQC/index.html` propose trois grilles indépendantes de 23 × 25 cases : `?carte=bureau` (référence sans modificateur), `?carte=ministere` (tracé asymétrique et portails A/B), `?carte=anneaux` (boucles concentriques et bandes d’accélération à +20 %). Les liens numériques `?carte=1`, `2` et `3` restent compatibles. Le nom, la grille et le modificateur proviennent de la même sélection. Changer de carte, y compris via « Carte suivante » après victoire, démarre une nouvelle partie ; Recommencer conserve la carte courante.

Les trois cartes sont validées au chargement : connectivité sans portails, aucun cul-de-sac ni bloc praticable de 2 × 2, réserve séparée, tunnels explicites et absence de superpositions. Le café se multiplie avec les bandes, avec un plafond de 7,5 cases/s. Voir [le README de PacQC](../PacQC/README.md) pour les coordonnées et les tests (`node PacQC/tests/run.mjs`, ou `PacQC/tests.html`). Les marqueurs sont dessinés depuis les données réelles. Aucun sprite n’a été remplacé. La vignette animée du menu général reste une illustration ; ce n’est pas un sélecteur de tracés.

L’atelier n’a plus de lien public et `PacQC/sprites.html` redirige vers le jeu. Scene Pixel Art reste testable, avec la mention « En chantier — en cours de construction, mais testable ».

## Icône du site

- Remplacer **`images/joystick.svg`** pour changer le joystick. C’est un dessin SVG original local, sous la licence du dépôt, sans dépendance externe.
- Son lien se trouve dans `index.html`, classe **`games-entry`**. Il n’affiche aucun texte ; `aria-label="Jeux"` conserve son nom accessible et `title="Jeux"` son infobulle.
- Sa taille est définie dans `assets/css/main.css` : **1,25 em × 1,25 em**, comme les autres icônes du pied de navigation. La couleur crème est inscrite dans le SVG.

## Vignette PacQC

Les réglages sont en tête de **`espace-jeux/preview.js`** :

- **`FRAME_PATHS`** : liste explicite des cinq chemins. Aucun tri alphabétique ni recherche automatique de fichiers.
- **`FRAME_DURATION_MS = 140`** : durée de chaque image en millisecondes. Le cycle complet dure 1,4 seconde.
- **`SEQUENCE = [0, 1, 2, 3, 4, 4, 3, 2, 1, 0]`** : indices de la liste, soit exactement **1 → 2 → 3 → 4 → 5 → 5 → 4 → 3 → 2 → 1**, en boucle.

Les fichiers réellement fournis sont déjà nommés `front1.png` à `front5.png`. Leur examen visuel donne cette correspondance :

| Position | Chemin dans la liste | Pose |
| --- | --- | --- |
| 1 | `../PacQC/assets/front1.png` | Inclinaison prononcée à gauche |
| 2 | `../PacQC/assets/front2.png` | Inclinaison légère à gauche |
| 3 | `../PacQC/assets/front3.png` | Position centrale |
| 4 | `../PacQC/assets/front4.png` | Inclinaison légère à droite |
| 5 | `../PacQC/assets/front5.png` | Inclinaison prononcée à droite |

Si les fichiers deviennent `1.png` à `5.png`, remplacer explicitement les cinq chemins dans cet ordre. Mettre aussi à jour l’image fixe sans JavaScript dans le bloc `noscript` de **chacun des deux HTML**, actuellement `front3.png`.

Ces cinq PNG font tous **916 × 941 px** et contiennent déjà le fond du labyrinthe et le titre « Pac Québec ». Ils sont utilisés sans modification, sans détourage ni rotation ou translation ajoutée. Leur cadrage commun et leurs proportions sont conservés (`object-fit: contain`). La transparence éventuelle des futurs PNG sera également respectée. La vignette du premier jeu et tous les sprites utilisés pendant les parties sont inchangés.

Les cinq images sont chargées et décodées avant le démarrage. Les mêmes cinq éléments image sont conservés dans le cadre : seul leur état de visibilité change, jamais leur URL. Les répétitions aux extrémités donnent les pauses demandées. Le cadre réserve sa hauteur dès le premier affichage : **220 px sur ordinateur, 180 px sous 650 px**, comme l’aperçu précédent ; les images sont en position absolue. L’animation ne peut donc pas déplacer le bouton ou modifier la hauteur de la carte.

La page masquée et `pagehide` suspendent le minuteur ; le retour le reprend sans rattrapage accéléré. La préférence `prefers-reduced-motion` donne une image centrale fixe, y compris si elle change pendant la consultation. Si un chargement/décodage échoue, l’animation ne démarre pas : l’image centrale disponible, ou la première image disponible, reste fixe. Si toutes échouent, un libellé PacQC reste affiché ; aucune image échouée n’est insérée dans la page.

## Essai local

À la racine du dépôt :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\preview-games.ps1 -Port 8000
```

Ouvrir **http://127.0.0.1:8000/index.html**, puis cliquer sur le joystick. La sélection est également accessible à **http://127.0.0.1:8000/espace-jeux/selection.html**. Arrêt avec Ctrl+C. Utiliser HTTP plutôt qu’une ouverture `file://` pour les modules JavaScript.

## Vérifications

Réalisées :

- Examen des cinq poses et vérification de leurs dimensions identiques ; PNG originaux conservés.
- Tests automatisés de `tests/preview.test.mjs` : deux cycles exacts, attente du préchargement, cinq affectations d’URL seulement malgré les boucles, suspension/reprise, changement de préférence de mouvement, page masquée au démarrage, erreurs partielles (centre compris) et totales, nettoyage du minuteur. Exécuter avec `node tests/preview.test.mjs` si Node est installé.
- Contrôle des liens site → sélection → chacun des jeux → menu, des accès directs et du chargement HTTP des cinq PNG et du SVG.
- Contrôle CSS : dimensions réservées et images hors du flux à toutes les largeurs ; règles de carte sur une colonne sous 650 px. Aucun mécanisme de jeu modifié dans cette intervention.

Limite : aucun navigateur pilotable n’est disponible dans cette session (inventaire vide, navigateur intégré indisponible). Les contrôles précédents ne sont pas une validation visuelle sur appareil réel. À vérifier dans votre navigateur à 390 px puis 1366/1920 px : taille du joystick, reconnaissance de la tête, cycle fluide, boutons immobiles, retour d’onglet et préférence de réduction des animations. Dans l’onglet Réseau, filtrer `front` : cinq chargements initiaux, aucune nouvelle requête pendant les cycles. Un rafraîchissement de page peut naturellement charger à nouveau les fichiers. Tester aussi un PNG bloqué : un aperçu fixe doit rester visible.

## État Git à connaître avant une future publication

`PacQC` est désormais un dossier ordinaire du dépôt principal : son gitlink (mode 160000), dépourvu de `.gitmodules`, a été retiré de l’index et remplacé par ses 67 fichiers individuels. Cette conversion corrige l’erreur de checkout `No url found for submodule path 'PacQC' in .gitmodules`, sans modifier le workflow ni désactiver la récupération des sous-modules.

Avant conversion, une copie intégrale a été vérifiée par SHA-256 dans `D:\PacQC-backups\PacQC-20260928-000044` (160 fichiers, métadonnées Git comprises ; inventaire dans `manifest-sha256.csv`). Le `.git` imbriqué original est conservé dans `nested-git-original` sous ce même dossier de sauvegarde. Les quatre fichiers modifiés et les cinq PNG auparavant non suivis sont inclus dans l’index du dépôt principal, sans changement de leur contenu sur disque. Aucune configuration propre à PacQC n’était présente ; le réglage générique `submodule.active = .` est conservé.

Les chemins restent inchangés : `espace-jeux/selection.html` et `espace-jeux/index.html` ouvrent `../PacQC/index.html`, le jeu revient vers `../espace-jeux/selection.html`, et ses modules chargent les sprites depuis `PacQC/assets/`. Les fichiers HTML, CSS, JavaScript, les 30 sprites et les cinq images `front1.png` à `front5.png` sont inclus dans le dépôt principal.

Lors de la vérification distante, `origin/main` pointait sur `26d2ad7`. Les commits locaux `f534e83` et `11ba5d8` n’étaient pas encore publiés : un prochain push de `main` publiera également ces deux commits, puis la correction. La conversion est préparée dans l’index ; elle prendra effet sur GitHub Pages après commit et push.

Aucun commit, push ni déploiement effectué.
