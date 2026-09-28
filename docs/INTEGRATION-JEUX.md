# Jeux publics sur GitHub Pages

Les deux jeux sont publics. L’hébergement GitHub Pages et le domaine actuel restent inchangés : **aucune migration, aucun mot de passe, aucun serveur d’authentification**.

## Parcours

Le joystick dans le pied de navigation du site ouvre directement `espace-jeux/selection.html`. Les cartes donnent accès à **Scene Pixel Art** (`jeu/index.html`) et **PacQC** (`PacQC/index.html`). Chaque jeu conserve son lien de retour au menu. Les URL directes fonctionnent sans restriction ; la sélection fonctionne aussi sans JavaScript, avec une vignette fixe.

`espace-jeux/index.html` contient la même sélection pour préserver l’entrée du dossier et les anciens favoris, sans redirection. Si le contenu des cartes change, maintenir ces deux petits fichiers HTML identiques.

Le formulaire, les messages de protection, la déconnexion, `access.js`, ses tests et `.env.example` ont été supprimés. Aucun cookie de session, appel d’API ou contrôle d’accès ne subsiste. Le `.gitignore` garde uniquement des exclusions générales de fichiers locaux privés. Le script PowerShell est un simple serveur de développement statique, pas un composant à installer sur GitHub Pages.

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

`PacQC` est toujours un dépôt imbriqué enregistré comme gitlink (mode 160000), sans `.gitmodules`. Ses changements préexistants et les cinq nouveaux PNG sont conservés. Aucun historique ni index Git n’a été modifié. Un simple commit du dépôt parent ne suffira pas à inclure les fichiers internes : avant publication, intégrer ce dossier comme fichiers ordinaires après sauvegarde de son historique, ou configurer un vrai sous-module récupérable par le build. Ce point de gestion du dépôt ne nécessite **aucun changement d’hébergeur**.

Aucun commit, push ni déploiement effectué.
