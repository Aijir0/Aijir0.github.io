# PacQC — La ronde du bureau

Prototype jouable de labyrinthe : quatre fantômes aux comportements distincts, trois vies, collectibles, bonus bière et café, score, pause, victoire et défaite. L’atelier de prévisualisation des sprites reste disponible. Interface française, Canvas 2D, JavaScript natif, aucune dépendance, aucun framework ni compilation.

## Démarrer sous Windows

Dans un terminal PowerShell :

```powershell
cd D:\PacQC
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\serve.ps1
```

Ouvrir **http://127.0.0.1:8000/** dans un navigateur récent. Laisser le terminal ouvert et arrêter avec **Ctrl+C**. Le serveur écoute uniquement sur l’ordinateur local. `-ExecutionPolicy Bypass` s’applique à ce processus, sans changer la stratégie du système.

Si le port est occupé :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\serve.ps1 -Port 8001
```

Puis ouvrir http://127.0.0.1:8001/. Ce petit serveur sert uniquement les fichiers pendant le développement ; il n’est pas nécessaire à l’hébergement du site.

Alternative, si Python est installé : `python -m http.server 8000 --bind 127.0.0.1` depuis ce dossier. Ne pas ouvrir `index.html` directement avec `file://` : les modules JavaScript et la lecture du rapport nécessitent HTTP.

## Jouer et tester la carte

Ouvrir **http://127.0.0.1:8000/**. L’atelier se trouve maintenant sur **http://127.0.0.1:8000/sprites.html** ; le lien en haut de chaque page permet de passer de l’une à l’autre.

1. Attendre le chargement, cliquer sur **Démarrer**. Un compte à rebours de **3 secondes** précède le départ. Utiliser les **flèches**, **WASD** ou **ZQSD** ; une pression suffit pour continuer à avancer. Vous pouvez choisir votre première direction pendant le compte à rebours. Relâcher une touche n’arrête pas le mouvement.
2. Demander un virage un peu avant une intersection : la demande reste mémorisée jusqu’au premier passage compatible. Une nouvelle direction remplace la précédente. Les répétitions automatiques des touches maintenues sont ignorées pour ne pas écraser une commande plus récente.
3. Pendant un déplacement entre deux cases, demander la direction opposée : le demi-tour doit être immédiat, sans saut de position. Avancer vers un mur : le personnage s’arrête au centre de la dernière case libre, bouche fermée.
4. Rejoindre l’ouverture latérale à mi-hauteur de la carte (ligne 12 de la grille, indices à partir de 0). Sortir à gauche et réapparaître à droite ; faire l’inverse et essayer un demi-tour au milieu du passage. La traversée prend le même temps qu’entre deux cases ordinaires.
5. Vérifier les images : droite/gauche/bas alternent leurs deux poses uniquement pendant le mouvement ; haut utilise toujours `dos.png`.
6. Ramasser les petits points : chacun donne **10 points**, disparaît et diminue le compteur. Repasser au même endroit ne rapporte rien. Les **271 points ordinaires** se trouvent dans les couloirs. Quatre anciennes cases de points accueillent les bonus, sans superposition. Les petits points rapportent **2 710 points de score**, auxquels s’ajoutent les captures de fantômes ; seuls les points ordinaires sont nécessaires à la victoire.
7. Cliquer sur **Pause**, ou appuyer sur **Espace** / **Échap** dans la carte. Cliquer hors du Canvas, changer d’onglet ou de fenêtre met aussi en pause, même pendant un compte à rebours. **Le retour du focus, un clic sur la carte ou une flèche ne reprend pas la partie.** Utiliser **Reprendre**, ou **Espace** quand la carte a le focus. Les flèches ne défilent pas la page dans le Canvas ; ailleurs, leur comportement normal est conservé.
8. **Recommencer** remet les trois vies, le score à zéro, les 271 points et les quatre bonus, les quatre fantômes dans la réserve et le joueur au départ, puis relance le compte à rebours. Tous les effets et retours visuels sont effacés. Répéter plusieurs fois : aucun dédoublement de vitesse ou d’animation ne doit apparaître.
9. Redimensionner la fenêtre : le Canvas conserve le ratio de la carte, sans étirement ni changement de vitesse. Sur écran étroit, les commandes passent sous la carte. Cette étape nécessite un clavier ; les commandes tactiles restent à venir.
10. Les réglages de l’atelier sont repris au chargement du jeu. Pour comparer, modifier un sprite dans l’atelier puis recharger le jeu. La taille et les décalages visuels ne changent jamais les collisions.

### Fantômes et vies

| Fantôme | Comportement | Vitesse (cases/s) | Début de sortie après le départ |
| --- | --- | --- | --- |
| CSI rouge | Poursuit la case accessible la plus proche de votre position | 3,65 | 0 s |
| PCQ bleu | Vise jusqu’à quatre cases devant vous, s’arrête à un mur et suit le tunnel | 3,50 | 2,5 s |
| SAGIR violet | Patrouille au sud-ouest ; poursuit à 6 cases de trajet ou moins, décroche à 9 cases ou plus | 3,40 | 5 s |
| Teams vert | Choisit au hasard les passages disponibles, avec une légère préférence pour continuer tout droit | 3,25 | 7,5 s |

Les fantômes traversent la porte centrale à **3 cases/s**, puis restent dans les couloirs, sauf lorsqu’ils retournent à la réserve après une capture. Ils choisissent leur direction aux centres des cases, utilisent les distances du graphe (tunnel compris) et évitent le demi-tour sauf dans une impasse ou lors de la première décision de fuite après activation de la bière. Leurs images `_b`, `_d`, `_g`, `_h` suivent le déplacement ; elles ne constituent pas une animation.

Pour tester les morts, ramasser quelques points puis laisser un fantôme vous toucher sans bière active. Le compteur doit passer de 3 à 2, même si plusieurs fantômes vous touchent simultanément. Tous les personnages retournent au départ, les points et objets déjà ramassés restent acquis, puis un compte à rebours relance la partie. Les effets des bonus sont supprimés ; les bonus déjà ramassés restent consommés. Les sorties progressives repartent de zéro à chaque vie. À zéro vie, **Défaite** ; plus aucun personnage ne bouge avant **Recommencer**. La collecte du dernier point ordinaire produit **Victoire** et fige la partie.

Les collisions examinent les segments parcourus par les personnages au cours de chaque mise à jour, pas seulement leurs positions finales : croisements rapides, virages et passage du tunnel sont couverts. Sans bière active, si un contact précède la dernière collecte, la vie est perdue et cette collecte n’est pas créditée. Si le dernier point est atteint avant le contact, la victoire l’emporte ; en cas d’égalité temporelle exacte, priorité à la victoire.

### Bonus et parcours de test rapide

| Bonus | Effet par défaut | Retour visuel |
| --- | --- | --- |
| Bière | Fantômes vulnérables pendant **8 s** ; **200 points** par fantôme mangé | Double halo bleu autour des fantômes ; clignotement pendant les **2 dernières secondes** |
| Café | Joueur **25 % plus rapide pendant 6 s** (6,25 cases/s au lieu de 5) ; aucune protection | Halo orange autour du joueur |

Les PNG des bonus se balancent selon **centre → droite → centre → gauche** à 4 poses/s. Les images originales des fantômes sont conservées sous leur effet de rendu. Les bonus actifs affichent chacun leur temps restant et une jauge. Un ramassage crée un cercle et un texte flottants, ainsi qu’un message sous les jauges.

Les deux effets peuvent être actifs ensemble. Reprendre le même bonus remet **uniquement sa durée** au maximum : deux cafés ne produisent jamais plus de +25 %. La pause suspend les durées, les balancements, les clignotements et le retour des fantômes. Une mort supprime les effets, mais ne replace pas les bonus consommés. Seul **Recommencer** restaure les quatre bonus.

Un fantôme vulnérable essaie de maximiser sa distance de trajet au joueur. Une activation de bière autorise un seul demi-tour au prochain centre ; renouveler une bière déjà active ne redonne pas ce demi-tour. Une fois mangé, le fantôme termine son segment puis prend un chemin légal vers **sa propre case de départ**, à **6 cases/s**. Il est translucide, marqué **RETOUR** et inoffensif pendant ce trajet. Il reste **2 secondes** dans la réserve, marqué **REPOS**, puis ressort à 3 cases/s sans répéter son délai de sortie initial. Il redevient vulnérable si la bière est encore active, sinon il reprend son comportement normal. Il ne peut pas être mangé une seconde fois pendant son retour ou son repos.

Depuis le départ `(11,20)`, indices de grille à partir de 0 :

1. Aller **deux cases à gauche** pour le café `(9,20)`. Vérifier le halo orange, la jauge de 6 s et l’accélération.
2. Faire demi-tour vers la **bière `(15,20)`**, quatre cases à droite du départ. Les deux jauges doivent coexister et les fantômes doivent porter leur halo bleu.
3. Toucher un fantôme vulnérable : +200, aucune vie perdue, puis trajet translucide vers la réserve, repos et sortie. Observer le clignotement de fin et attendre l’expiration : les fantômes redeviennent dangereux.
4. Les seconds exemplaires sont une bière en `(3,5)` et un café en `(19,5)`. Pour tester facilement le renouvellement en jeu, augmenter temporairement les durées dans la configuration, puis les ramasser après le premier exemplaire. Les tests automatiques vérifient déjà ce cas avec les durées par défaut.
5. Mettre en pause pendant un effet, attendre, reprendre : les compteurs doivent rester inchangés pendant la pause. Recommencer doit vider les jauges et restaurer les bonus.

L’expiration est traitée à son instant précis, même entre deux cases. À un instant commun, l’ordre est : **expiration, ramassage éventuel, collision** (la victoire conserve sa priorité à égalité). Ainsi, un contact exactement à la fin de la bière est dangereux, sauf si une nouvelle bière est ramassée au même instant. Le changement de vitesse du café ne modifie jamais la position, l’alignement ou les collisions.

### Régler la difficulté

Modifier **`js/difficulty.js`**, puis recharger : toutes les vitesses, délais de sortie, vies, durée du compte à rebours, portée d’interception, seuils de SAGIR, préférence aléatoire de Teams, rayons de collision et pas de simulation y sont centralisés. Vitesses et pas de simulation doivent rester strictement positifs. Les rayons par défaut sont 0,24 case pour le joueur et 0,25 pour un fantôme ; ils ne dépendent pas des PNG. Les positions de départ et les points de patrouille restent dans `js/map.js`.

La section **`DIFFICULTY.bonuses`** contient les durées, le multiplicateur du café, les points par capture, la vitesse de retour, le repos, la cadence du balancement, le clignotement et la durée des textes flottants. Les quatre positions sont dans **`LEVEL.bonusSpawns`**, validées contre la grille : aucune case murale, réserve, départ ou superposition n’est acceptée.

Les états sont **accueil → compte à rebours → partie**, avec **pause**, **défaite** ou **victoire**. Une mort avec des vies restantes revient au compte à rebours. La pause conserve son état d’origine et tous ses temporisateurs. Le hasard de Teams est initialisé au chargement, reproductible avec une graine donnée et remis à son état initial lors d’un redémarrage.

### Tests automatiques sans installation

Ouvrir **http://127.0.0.1:8000/tests.html** : le résultat attendu est **57 / 57 tests réussis**. Les 38 tests de carte, déplacement, fantômes, collision et session sont conservés, avec le nouvel objectif de 271 points ordinaires. Les **19 tests de bonus** couvrent les placements, balancements, cumuls, renouvellements, pauses, expirations entre cases / près d’un mur / dans un tunnel, contacts avant / à / après expiration, retour à la réserve et réapparition avec ou sans bière, mort, redémarrage et victoire sans bonus.

Ces tests de logique ont été exécutés avec succès. Ils ne remplacent pas la vérification manuelle du Canvas, du clavier réel, du focus et de l’affichage mobile : aucun navigateur pilotable n’était disponible dans l’environnement de développement.

Les valeurs attendues des tests correspondent aux paramètres de difficulté par défaut ; adapter ces attentes si vous modifiez volontairement les règles.

## Tester l’atelier des sprites

1. Ouvrir `sprites.html` et attendre **30 / 30 images chargées**. Les PNG représentent environ **74,33 Mio** ; le premier chargement peut être lent.
2. Dans « La distribution », sélectionner les quatre directions du collègue. Droite, gauche et bas alternent deux poses ; haut montre uniquement `dos.png` et désactive « Pose suivante ».
3. Changer la direction de chaque fantôme : `_b` = bas, `_d` = droite, `_g` = gauche, `_h` = haut. L’image reste fixe jusqu’au prochain changement de direction, quelle que soit la cadence.
4. Vérifier les bonus : centre → droite → centre → gauche. Mettre en pause, avancer pose par pose et reprendre. Le collectible reste fixe et plus petit dans la scène commune.
5. Essayer les fonds damier, sombre et clair. Les **30 PNG actuels possèdent de la transparence**, y compris les nouvelles versions des fantômes fournies depuis l’étape précédente. Aucun détourage automatique n’est appliqué. `collectible.png` (112 × 112) représente un point jaune sur fond transparent ; ces fichiers sont utilisés tels quels.
6. Dans les réglages, sélectionner un fichier, modifier taille et décalages. L’inspecteur montre ce fichier fixe ; la galerie et la scène appliquent son réglage lorsqu’il est affiché. Recharger pour contrôler la mémorisation. Réinitialiser restaure uniquement le fichier sélectionné.
7. Exporter les réglages : le navigateur télécharge `reglages-sprites.json`. L’export inclut les 30 fichiers. Il n’est pas importé automatiquement ; reporter les valeurs retenues dans `display` dans `js/manifest.js` pour les partager avec tous les visiteurs.
8. Réduire la fenêtre à une largeur de téléphone : la galerie passe à deux colonnes, les réglages s’empilent et la scène commune défile horizontalement.
9. Pour vérifier une erreur de chargement, bloquer une URL PNG dans les outils de développement du navigateur puis recharger : le fichier doit être nommé dans le message d’erreur et représenté par un repère barré. Désactiver le blocage et recharger.

La préférence système de réduction des animations met l’aperçu en pause au démarrage. Les contrôles sont accessibles au clavier.

## Organisation

```text
assets/                    PNG originaux, conservés sans modification
index.html                 carte jouable, score et commandes
sprites.html               atelier de prévisualisation préservé
tests.html                 résultats des tests de logique dans le navigateur
css/style.css              interface adaptative
css/game.css               présentation de la carte et du tableau de score
js/manifest.js             liste explicite des 30 fichiers, directions et séquences
js/assets.js               chargeur partagé, cache et dessin proportionnel
js/sprite-settings.js      lecture validée des réglages communs
js/preview.js              aperçu Canvas et réglages locaux
js/map.js                  grille lisible et données de la carte
js/movement.js             connectivité, déplacement, collecte et score (sans DOM)
js/renderer.js             murs arrondis, sprites et redimensionnement Canvas
js/difficulty.js           vitesses et paramètres de difficulté centralisés
js/navigation.js           voisinage des fantômes, distances et cibles accessibles
js/ghosts.js               sorties et comportements des quatre fantômes
js/bonuses.js              ramassage, durées, captures et retours visuels
js/collisions.js           contacts continus entre trajectoires
js/session.js              états de partie, vies, compte à rebours et redémarrage
js/controller.js           clavier, focus, interface et unique boucle d’animation
js/game.js                 chargement des ressources et montage de la partie
tests/game.test.js         18 tests de carte et de déplacement
tests/session.test.js      20 tests de fantômes, collisions, session et contrôleur
tests/bonuses.test.js      19 tests de bonus, expirations et retours des fantômes
assets-audit.json          dimensions, alpha, poids, limites visibles et SHA-256
scripts/inspect-assets.ps1 audit reproductible des PNG (Windows)
scripts/serve.ps1          serveur statique local (Windows)
docs/SUIVI.md              décisions, limites et prochaines étapes
```

Le rendu utilise le plus grand côté de l’image pour calculer sa taille nominale, avec le même facteur sur les deux axes. `scale` est un multiplicateur ; `offsetX` et `offsetY` sont des pixels à une taille nominale de 64 px (positifs vers la droite et le bas). Les marges transparentes sont retirées au rendu avec les bornes de `js/sprite-framing.js`. Chaque animation partage un cadrage normalisé commun, avec 2 pixels de sécurité : les poses ne sont pas recentrées indépendamment. Les PNG restent intacts. Après remplacement des images, refaire l’audit et actualiser ces bornes (retour à l’image entière si ses dimensions changent). Les valeurs initiales sont neutres (`1, 0, 0`), à ajuster après validation visuelle. Les réglages sont stockés sous la clé `pacqc.sprite-settings.v1` dans le navigateur, pour cette origine.

Le chargeur décode au plus trois images en parallèle, signale chaque échec et laisse les autres sprites accessibles. Après correction d’un fichier manquant, recharger la page.

Le jeu réutilise ce même chargeur. Les 30 images sont désormais nécessaires, y compris les six poses de bonus. Tout fichier absent ou illisible est nommé dans l’erreur et empêche le démarrage.

## Carte et déplacement

La grille de `js/map.js` mesure **23 × 25 cases** : `#` = mur, `.` = point ordinaire (remplacé par un bonus sur les quatre positions de `bonusSpawns`), `P` = départ, `G` = réserve des fantômes, `=` = porte interdite au joueur. Le tunnel relie les extrémités de la ligne 12. Le départ se situe en colonne 11, ligne 20 (indices à partir de 0). La carte est validée par parcours en largeur au démarrage : toute case libre doit être accessible et les ouvertures extérieures sont limitées au tunnel.

Le déplacement est exprimé en cases, à **5 cases par seconde**. Le personnage circule sur les segments reliant les centres des cases libres. Un virage attend un centre ; un demi-tour inverse le segment en cours tout en conservant la position. Le rendu n’intervient pas dans ces décisions. Les contours des murs sont calculés depuis la grille, arrondis et dessinés en bleu, sans image de carte.

La boucle utilise le temps écoulé réel, découpé en sous-pas d’au plus 1/120 seconde et aux instants de ramassage / expiration. Un contact détecté à l’intérieur d’un intervalle provoque un rejeu jusqu’à l’instant exact du contact. Une interruption supérieure à une demi-seconde met en pause pour éviter un rattrapage brutal. Les tailles visuelles de référence sont dans `VISUALS` (`js/renderer.js`) : personnage 36 px, fantôme 32 px, collectible 6 px, bonus 27 px pour une case de 30 px. Les réglages par fichier s’appliquent ensuite. Le fond et les collectibles sont dessinés dans des Canvas intermédiaires pour éviter de recalculer toute la scène à chaque frame.

## Refaire l’audit

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\inspect-assets.ps1
```

Le script utilise `System.Drawing` fourni par Windows et réécrit seulement `assets-audit.json`. Il mesure les pixels entièrement transparents et partiellement transparents, pas seulement la présence théorique d’un canal alpha. Les limites visibles sont `[gauche, haut, droite exclusive, bas exclusif]`. L’inventaire affiché est un rapport enregistré : relancer le script après remplacement des PNG.

## Intégration ultérieure

Les ressources utilisent des chemins relatifs, et les modules résolvent les PNG à partir de leur propre URL. Copier `index.html`, `sprites.html`, `css/`, `js/`, `assets/` et `assets-audit.json` dans un même sous-dossier conservera cette organisation. `tests.html` et `tests/` sont facultatifs à l’hébergement. Aucun chemin `/assets/...` absolu, CDN, service externe ou backend applicatif n’est utilisé. Aucun dépôt Git n’a été initialisé et rien n’a été déployé.


## Affichage bureau et portable

Le plateau utilise presque toute la hauteur disponible, sans plafond de 690 px. Compteurs, commandes et durées sont dans le panneau latéral. Les règles se déplient et le panneau peut défiler indépendamment. Sous 760 px de largeur, il passe sous la carte.

Dimensions calculées pour la zone de contenu du navigateur à zoom 100 % : environ 673 × 732 px pour une fenêtre 1366 × 768, 960 × 1044 px en 1920 × 1080 et 1292 × 1404 px en 2560 × 1440. Visage : respectivement 35, 50 et 67 px de haut. Les collisions restent indépendantes de ces tailles.

Pour tester : lancer le serveur local, comparer les fenêtres portable et bureau, démarrer et redimensionner en jeu. Vérifier les quatre bords, le tunnel, les poses du visage, les lettres des fantômes et les halos des bonus. Déplier les règles : seul le panneau doit défiler sur bureau. Réinitialiser les anciens réglages dans l’atelier si nécessaire.

La [planche de contrôle](docs/controle-sprites.png) compare les sprites aux tailles portable/bureau puis agrandis. Elle a été produite avec System.Drawing : ce n’est pas une capture navigateur. La disposition est vérifiée par calcul ; la validation visuelle interactive reste à effectuer, aucun navigateur pilotable n’étant disponible ici.
