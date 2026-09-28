# PacQC — Trois labyrinthes

Jeu Canvas 2D en français : quatre fantômes, trois vies, sprites personnalisés, score, bière et café, pause, victoire et défaite. JavaScript natif, sans dépendance ni compilation. Les PNG et leurs animations sont conservés. L’atelier reste dans les sources mais `sprites.html` redirige vers le jeu ; aucun lien public ne mène à l’atelier.

## Lancer localement

Depuis la racine du dépôt principal :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\preview-games.ps1 -Port 8000
```

Ouvrir **http://127.0.0.1:8000/PacQC/index.html**. Arrêter avec Ctrl+C. Les modules nécessitent HTTP, pas une ouverture `file://`. Depuis le dossier PacQC seul, `scripts/serve.ps1` fournit aussi un serveur local, mais les liens vers le menu du dépôt parent nécessitent le serveur à la racine.

## Trois cartes réellement distinctes

Chaque carte possède son identifiant et ses 25 lignes explicites dans `js/map.js`. Aucune grille n’est dérivée d’une autre. Toutes mesurent **23 × 25 cases** : le cadrage et les tailles des sprites restent identiques.

| Identifiant / URL | Tracé | Modificateur | Cases accessibles | Points ordinaires |
| --- | --- | --- | ---: | ---: |
| `bureau` / `?carte=bureau` | Ailes symétriques, boucles autour de la réserve, passages transversaux et petites boucles au sud | Aucun | 228 | 223 |
| `ministere` / `?carte=ministere` | Circuits asymétriques de tailles différentes, liaisons décalées, virages dans l’aile sud-est | Portails A ↔ B | 229 | 222 |
| `anneaux` / `?carte=anneaux` | Quatre anneaux rectangulaires concentriques, reliés à des positions décalées | Quatre segments d’accélération | 254 | 229 |

Les anciens liens `?carte=1`, `2` et `3` restent valides ; une valeur inconnue revient au bureau. La sélection charge la grille et le modificateur ensemble, puis affiche le nom, l’explication et le lien actif. Après une victoire, « Carte suivante » propose bureau → ministère → anneaux → bureau. **Changer de carte démarre une nouvelle partie**, avec score à zéro, trois vies et bonus restaurés. **Recommencer** relance la carte courante et conserve son modificateur.

Les labyrinthes ne contiennent ni impasse ni carré praticable de 2 × 2. Tous les passages et points sont accessibles, y compris sans les portails. Les croisements et intersections en T permettent de changer de circuit. Les murs et le rendu sont issus de la grille réelle ; aucune image de labyrinthe n’est utilisée par le sélecteur des cartes.

## Connexions, réserve et éléments spéciaux

Indices de grille à partir de 0. Symboles : `#` mur, `.` point, `P` départ, `G` réserve et `=` porte interdite au joueur.

- Tunnel commun : **(0,11) ↔ (22,11)**. Les deux arêtes orientées sont déclarées dans `tunnels`. Joueur, fantômes et recherche de chemin utilisent ces mêmes connexions. Le rendu et les collisions traversent le bord sans balayer la largeur du plateau.
- Réserve centrale : 25 cases, colonnes 9–13 et lignes 9–13 ; porte (11,8), sortie (11,7), quatre départs distincts. Aucun collectible ni bonus à l’intérieur.
- Départ joueur : (11,21) au bureau et dans les anneaux ; (11,19) au ministère.
- Quatre bonus par carte. Les bonus, portails et zones remplacent les points de leurs cases : aucun empilement avec un point ordinaire, un départ ou un autre élément spécial.

### Portails du ministère

**A (3,7)** et **B (17,21)** sont marqués par des cercles et des lettres. L’entrée au centre de l’un transporte instantanément à l’autre, sans changer la direction mémorisée. Le personnage peut s’arrêter si cette direction n’est pas praticable à l’arrivée.

Le verrou de destination empêche tout rebond immédiat. Il faut quitter physiquement la case d’arrivée, puis y revenir, pour réactiver le portail. Un demi-tour avant la limite de cette case ne suffit pas. Le verrou est propre à chaque personnage et réinitialisé après une mort ou un redémarrage.

Les fantômes utilisent les portails pendant les poursuites, les fuites et les retours vers leur réserve. Le calcul des distances utilise le graphe dirigé des destinations effectives. La téléportation crée deux positions disjointes dans les traces de déplacement : aucune collision fictive le long d’une diagonale entre A et B ; une collision à l’arrivée reste possible.

### Accélération des anneaux

Les bandes turquoise hachurées occupent quatre segments : (7,1)–(11,1), (3,13)–(3,17), (11,19)–(15,19), (15,9)–(15,13). Elles ne forcent aucune direction et laissent les intersections utilisables.

`DIFFICULTY.modifiers` centralise **zoneMultiplier = 1.2** et **maxSpeed = 7.5 cases/s**. Formule : `min(vitesse de base × café éventuel × zone éventuelle, plafond)`.

- Joueur normal : 5 cases/s ; sur une bande : 6.
- Café : ×1,25, soit 6,25 ; café + bande : ×1,50, soit 7,5.
- Fantômes : vitesse de leur mode ×1,20 sur une bande, plafond identique ; le café ne les affecte pas.
- Hors bande, la vitesse redevient immédiatement celle du personnage et de ses bonus.

La vitesse change à la frontière physique entre cases, à mi-chemin entre deux centres. Le déplacement découpe les segments à ces frontières ; ni déplacement instantané, ni désalignement, ni virage forcé. Une expiration du café est traitée à son instant exact.

## Commandes et règles conservées

Flèches, WASD ou ZQSD ; commandes tactiles sur mobile ; Espace pour pause/reprise et Échap pour pause. Cliquer sur le plateau pour lui donner le focus. Les virages attendent un centre, les demi-tours sont immédiats.

Le joueur commence avec trois vies. Chaque point vaut 10 ; bière : vulnérabilité des fantômes pendant 8 secondes, +200 par capture ; café : +25 % pendant 6 secondes. Les effets se cumulent ; reprendre un bonus renouvelle sa durée, sans empiler sa puissance. Les jauges, halos et animations personnalisées sont conservés.

CSI poursuit le joueur, PCQ anticipe quatre cases, SAGIR alterne patrouille et poursuite, Teams choisit ses directions avec un hasard reproductible. Les sorties sont progressives. Un fantôme capturé retourne à sa réserve, y reste deux secondes puis ressort.

Une mort conserve points et objets déjà ramassés, supprime les effets et relance les personnages avec un compte à rebours. Seul Recommencer ou changer de carte restaure tout. Le dernier point ordinaire termine la carte ; les bonus restent facultatifs. La pause gèle simulation et temporisateurs. Les collisions continues vérifient les croisements entre deux images.

## Validation et tests

`js/map-validation.js` valide au chargement les trois cartes : dimensions et alphabet, départ unique, accessibilité sans portails, degré minimal de deux, absence de bloc 2 × 2, plusieurs boucles, réserve fermée et connectée, porte et sorties, tunnel réciproque, portails distincts, zones rectilignes, patrouilles et absence de superpositions. Les trois identifiants et grilles doivent être distincts.

```powershell
node PacQC/tests/run.mjs
node PacQC/tests/loading.test.mjs
node tests/preview.test.mjs
```

Sans Node dans le PATH, ouvrir **http://127.0.0.1:8000/PacQC/tests.html**. Le même ensemble de tests est exécuté dans la page.

Le test Node supplémentaire `loading.test.mjs` exécute le vrai point d’entrée `game.js` sur les trois URL avec un DOM/Canvas simulé : trois dessins de grilles distincts, titres, liens actifs, modificateurs, fichiers PNG et redémarrage. Il ne remplace pas un test dans un navigateur.

Dernière vérification locale : **86 / 86 tests réussis**, test de chargement réussi sur les trois cartes et tests de vignette du menu réussis. `git diff --check` ne signale aucune erreur.

Les tests couvrent les validations positives et négatives, les anciens et nouveaux liens de sélection, le cycle des cartes, le redémarrage, les tunnels, les portails et leur verrouillage, les distances des fantômes, la collision à l’arrivée, les vitesses et leurs frontières, le café, les virages, les cadences, et une collecte complète sur chacune des trois cartes. Les tests existants de score, vies, animations, bonus, collision, contrôleur et cadrage sont conservés, avec les coordonnées adaptées aux nouvelles grilles.

Les tracés ont été examinés sur une planche générée depuis les données réelles. **Limite : aucun navigateur pilotable disponible dans cette session ; l’ouverture du navigateur intégré a échoué.** Il reste à tester visuellement le Canvas, le clavier réel et le tactile. Parcours manuel conseillé :

1. Choisir chacune des trois cartes ; vérifier titre, tracé, explication et marqueurs.
2. Au ministère, traverser A/B dans les deux sens, patienter sur l’arrivée puis sortir et revenir ; observer un fantôme emprunter la liaison.
3. Dans les anneaux, traverser une bande, tourner à son intersection, faire demi-tour et essayer avec le café. Vérifier la sortie de bande et l’expiration du café.
4. Vérifier poursuite, collision, perte de vie, pause, Recommencer et Carte suivante après victoire ; essayer aussi les accès directs avec les trois identifiants.
5. Comparer l’affichage mobile et bureau : sprites reconnaissables, contours sans espaces larges, portails et bandes lisibles.

## Organisation et réglages

| Fichier | Rôle |
| --- | --- |
| `js/map.js` | Trois grilles, identifiants, connexions, bonus, descriptions, sélection |
| `js/map-validation.js` | Validation des données et construction du graphe de jeu |
| `js/topology.js` | Voisinage, tunnels et téléportation, partagés entre personnages |
| `js/modifiers.js` | Vitesse du terrain et frontières des cases |
| `js/movement.js`, `navigation.js`, `ghosts.js` | Déplacements, distances et décisions |
| `js/session.js`, `bonuses.js`, `collisions.js` | Partie, vies, score, effets et contacts |
| `js/game.js`, `controller.js`, `renderer.js` | Chargement, interface, Canvas et marqueurs |
| `js/difficulty.js` | Vitesses, plafond, durées, vies et rayons de collision |
| `tests/maps.test.js`, `tests/run.mjs` | Régressions des trois cartes et lanceur Node |

Les images de `assets/`, le manifeste, le cadrage partagé et les réglages des sprites sont inchangés. À 30 px par case, les références visuelles restent 36 px pour le joueur, 32 pour les fantômes, 6 pour un point et 27 pour un bonus ; elles n’affectent pas les collisions. `scripts/inspect-assets.ps1` renouvelle l’audit des PNG après un remplacement volontaire.

Le code d’atelier `sprites.html` / `js/preview.js` reste conservé pour le développement, mais son URL publique redirige vers le jeu. Les chemins des modules et PNG sont relatifs et compatibles avec GitHub Pages. Aucun commit, push ou déploiement n’est effectué par cette intervention.
