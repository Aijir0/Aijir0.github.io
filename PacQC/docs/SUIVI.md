# Suivi — carte jouable

## Étape 04 — bière et café

- Quatre bonus fixes dans `LEVEL.bonusSpawns` : bières `(15,20)` et `(3,5)`, cafés `(9,20)` et `(19,5)`. Ces cases remplacent quatre points ordinaires : **271 points à collecter**, pour 2 710 points de score hors captures. Les 276 cases libres restent connectées. Bonus facultatifs, aucun chevauchement, validation au chargement.
- Bière : 8 s de vulnérabilité, fuite selon les distances de la grille, un seul demi-tour stratégique autorisé au prochain centre lors de l’activation ; 200 points par capture. Café : +25 % de vitesse pendant 6 s. Durées indépendantes, cumul possible, renouvellement au maximum sans empilement de puissance.
- Capture : retour réel et inoffensif à la case personnelle dans la réserve, à 6 cases/s ; repos de 2 s puis sortie à 3 cases/s, sans répéter le délai initial. Bière encore active à la sortie : vulnérabilité ; sinon comportement normal. Les modes `retour` et `regeneration` sont inoffensifs et non comestibles.
- Les PNG et le manifeste sont réutilisés. Balancement centre/droite/centre/gauche à 4 poses/s, halos bleus sur les fantômes vulnérables, clignotement pendant les 2 dernières secondes, halo orange du café, images translucides et libellés RETOUR/REPOS, textes flottants et jauges de durée.
- Pause : effets, animations et retours figés. Mort : effets supprimés, bonus consommés non replacés. Recommencer : tous les bonus et effets réinitialisés. Les paramètres sont dans `DIFFICULTY.bonuses`.
- La session découpe maintenant aussi aux centres du joueur et aux expirations ; les contacts internes sont rejoués jusqu’à leur instant exact. À égalité : expiration, ramassage, puis collision ; la victoire reste prioritaire au même instant. Le changement de vitesse ne repositionne jamais le joueur.

### Vérifications de l’étape 04

**57 / 57 tests réussis**, dont 19 nouveaux tests de bonus. Les attentes des tests existants ont été ajustées au nouvel objectif de 271 points ordinaires. Vérifiés : non-superposition, animation des deux bonus, coexistence/renouvellement, pause, café seul sans protection, expiration du café entre cases et près d’un mur / dans le tunnel, fuite des quatre fantômes, captures simultanées sans double crédit, collision juste avant / à / après expiration de la bière, renouvellement au même instant qu’un contact, retour depuis le tunnel, repos et sortie avec / sans bière, mort et redémarrage, victoire avec les quatre bonus non ramassés.

Aucun navigateur pilotable disponible : l’apparence réelle des halos, clignotements et jauges reste à confirmer dans le navigateur avec le parcours du README. Les tests de logique ne constituent pas une validation visuelle.

Contrôle d’intégration avec les vrais identifiants HTML et un Canvas simulé : démarrage réussi, dessin des six poses de bonus, ramassage du café puis de la bière, deux jauges actives simultanément et figées en pause, un seul RAF. Les nouvelles ressources répondent en HTTP 200 avec les bons types MIME. Les empreintes des 30 PNG sont inchangées.

### Suite proposée

1. Valider la lisibilité et ajuster les durées / placements / scores selon la sensation de jeu.
2. Optimiser des copies des PNG volumineux et ajouter les commandes tactiles.
3. Préparer l’intégration au site ultérieurement, sans déploiement à ce stade.

---

## Étape 03 — fantômes et partie complète

- Le prototype existant, sa carte, ses contrôles et son chargeur sont conservés. Les quatre fantômes utilisent maintenant leurs vraies directions dans le Canvas, avec la même traversée visuelle du tunnel que le joueur.
- Sortie par la porte centrale : CSI à 0 s, PCQ à 2,5 s, SAGIR à 5 s et Teams à 7,5 s après le compte à rebours. Les chemins de sortie sont validés ; la réserve et la porte restent interdites au joueur, puis aux fantômes une fois sortis.
- CSI poursuit la position du joueur ; PCQ avance sa cible de quatre cases libres dans la direction du joueur ; SAGIR patrouille au sud-ouest et utilise une hystérésis de 6/9 cases pour sa poursuite ; Teams tire ses directions au hasard avec une préférence légère pour continuer. Décisions aux centres, chemins les plus courts sur la grille, cibles projetées vers une case accessible, demi-tours seulement dans les impasses.
- `difficulty.js` centralise les paramètres ; `navigation.js` et `ghosts.js` portent les comportements. La logique de déplacement initiale expose désormais les trajectoires parcourues sans dépendre du rendu.
- `collisions.js` résout les contacts sur le mouvement relatif de segments temporels, y compris les copies aux bords du tunnel. Un croisement rapide ne peut pas sauter une collision. La première collision retire une seule vie. Les collectes postérieures au contact dans le même pas sont annulées ; le dernier point donne la victoire s’il est atteint avant ou exactement au contact.
- `session.js` gère accueil, compte à rebours, partie, pause, défaite et victoire. Trois vies, compte à rebours de 3 s, points conservés après une mort. Recommencer réinitialise aussi les intentions de mouvement, sorties, temporisateurs et hasard.
- `controller.js` installe les événements et un seul RAF. Ni les décès ni les redémarrages ne recréent la boucle. Perte de visibilité/focus : pause ; retour du focus ou touche directionnelle : aucune reprise automatique. Reprise explicite par bouton ou Espace.
- **Fichiers fournis actualisés** : les 16 PNG de fantômes ont été remplacés par des versions transparentes de 1254 × 1254. Nouvel audit : 30/30 présents, tous avec une transparence effective, environ 74,33 Mio. Les fichiers actuels sont utilisés sans modification ; les mentions de fonds opaques ci-dessous sont historiques.

### Vérifications de l’étape 03

**38 / 38 tests réussis** : 18 tests précédents et 20 nouveaux. Ils couvrent les comportements, les sorties progressives, 48 000 pas de fantômes sans mur traversé ni désalignement, les cibles invalides, les sprites directionnels, les tunnels, le balayage des collisions, un croisement à 200 cases/s, quatre contacts simultanés, la conservation du score, trois morts, la victoire et son ordre par rapport au contact, la pause des temporisateurs et 20 redémarrages. Le contrôleur réel est testé avec un DOM et un ordonnanceur RAF simulés : reprise explicite et un seul RAF / jeu d’écouteurs après 20 redémarrages.

Le navigateur pilotable reste indisponible : rendu visuel, événements du navigateur réel et ergonomie sont à confirmer via le parcours du README. Aucune validation visuelle n’est revendiquée.

Le démarrage complet de `game.js` a aussi été exécuté avec les identifiants réels d’`index.html`, un décodeur et un Canvas simulés : accueil, compte à rebours, partie et appels de dessin des sprites directionnels fonctionnent, avec un seul RAF en attente. Les nouvelles pages et ressources répondent en HTTP 200 avec les bons types MIME. Les empreintes des 30 PNG correspondent au nouvel audit ; aucun PNG n’a été modifié par cette étape.

### Prochaines étapes

1. Tester la sensation de jeu et ajuster les vitesses, délais de sortie et seuils dans `difficulty.js`.
2. Optimiser des copies des PNG volumineux, puis ajouter bonus et commandes tactiles.
3. Préparer l’intégration au site ultérieurement. Aucun déploiement ni modification d’un autre dépôt.

---

## Étape 02 — première carte

- `index.html` devient le jeu ; l’atelier est conservé dans `sprites.html`. Chargeur, manifeste, dessin proportionnel et réglages locaux sont réutilisés. Aucun ennemi actif ni bonus sur cette carte.
- Grille originale de **23 × 25** dans `js/map.js`, avec **276 cases libres connectées, 275 collectibles et 15 cases de réserve**. Départ `(11,20)`, tunnel horizontal à la ligne 12 ; indices à partir de 0. La porte de la réserve est fermée au joueur. Validation de connectivité au démarrage.
- `js/movement.js` ne dépend ni du DOM ni des sprites : déplacement à 5 cases/s entre centres, direction demandée persistante, demi-tour immédiat sur le segment courant. Collecte au passage par les centres, 10 points par objet, réussite à 2 750 points.
- `js/renderer.js` transforme les frontières des cases murales en contours arrondis bleus. Fond sombre, réserve distincte, copies du sprite aux sorties du tunnel et facteur d’échelle uniforme. Tailles visuelles indépendantes des collisions.
- `js/game.js` gère flèches/WASD/ZQSD, pas fixe à 120 Hz alimenté par le temps réel, focus, pause et reprise. Pas de défilement par les flèches dans le Canvas. Pause lors d’une perte de focus, d’un onglet masqué ou d’une interruption de plus de 0,5 s. La bouche reste fermée à l’arrêt et en pause ; le dos garde sa seule image.
- **Évolution des fichiers fournis constatée avant cette étape** : `collectible.png` représente désormais un point jaune de **112 × 112**, 446 octets, avec transparence, à la place de l’ancienne icône ChatGPT. Le fichier actuel est utilisé tel quel. Audit régénéré ; **14 images transparentes et 16 opaques**, total **73,13 Mio**. Aucun PNG modifié par le développement. Le détail historique ci-dessous décrit les fichiers de l’étape 01.

### Vérification de cette étape

**18 / 18 tests de logique réussis** (`tests.html`, sources dans `tests/game.test.js`) : connectivité complète, rejet d’un objet isolé, voisinage réversible, murs, virage anticipé à travers une case incompatible, remplacement de commande, demi-tours entre cases et aux intersections, tunnel dans les deux sens et inversion pendant la traversée, réserve inaccessible, équivalence 30/60/144 Hz et durées irrégulières, collecte unique, remise à zéro, touches et poses. Un test effectue 20 000 pas avec commandes variées ; un autre termine réellement la carte avec 275 collectes et 2 750 points.

Les huit modules JavaScript ont été analysés sans erreur de syntaxe. Un contrôle d’intégration avec DOM, Canvas et décodeur simulés a validé le démarrage, le blocage du défilement par les flèches, 50 points après une seconde vers la droite, l’arrêt en pause, la remise à zéro et le facteur d’échelle uniforme. Les nouvelles pages, modules et feuilles de style répondent en HTTP 200 avec les bons types MIME ; les empreintes des 30 PNG correspondent à l’audit de début d’étape.

Le navigateur pilotable reste indisponible dans cette session : la validation visuelle, les interactions réelles, le focus et l’affichage mobile restent à réaliser avec le parcours du README. Les tests simulés ne prétendent pas couvrir ces éléments.

### Suite proposée

1. Valider la sensation de déplacement, la lisibilité des points et les tailles à l’écran avec cette première carte.
2. Optimiser les dérivés des grands PNG et décider du traitement des 16 fonds opaques des fantômes, sans toucher aux originaux.
3. Ajouter ensuite les ennemis et leurs règles de déplacement, puis les bonus, collisions avec ennemis et commandes tactiles.
4. Préparer ultérieurement l’intégration au site ; aucun déploiement ni intervention sur un autre dépôt à ce stade.

---

## Historique — étape 01

## État au 24 septembre 2026

Prévisualisation créée dans `D:\PacQC`, indépendante de tout dépôt distant. **30 fichiers attendus, 30 présents. Fichiers manquants : aucun.** PNG originaux inchangés ; les empreintes SHA-256 de l’audit permettent de le vérifier.

| Fichiers | Dimensions | Transparence mesurée |
| --- | --- | --- |
| droite1.png, droite2.png | 3153 × 3153 | Oui, alpha nul et partiel |
| gauche1.png | 3108 × 3108 | Oui, alpha nul et partiel |
| gauche2.png | 3055 × 3055 | Oui, alpha nul et partiel |
| face1.png | 2706 × 2706 | Oui, alpha nul et partiel |
| face2.png | 2875 × 2874 | Oui, alpha nul et partiel |
| dos.png | 2387 × 2386 | Oui, alpha nul et partiel |
| ennemi1_b/d/g/h.png | 1254 × 1254 | Non, aucun canal alpha |
| ennemi2_b/d/g/h.png | 1254 × 1254 | Non, aucun canal alpha |
| ennemi3_b/d/g/h.png | 1254 × 1254 | Non, aucun canal alpha |
| ennemi4_b/d/g/h.png | 1254 × 1254 | Non, aucun canal alpha |
| collectible.png | 1254 × 1254 | Non, aucun canal alpha |
| bonus1.png, bonus1_d.png, bonus1_g.png | 1254 × 1254 | Oui, alpha nul et partiel |
| bonus2.png, bonus2_d.png, bonus2_g.png | 1254 × 1254 | Oui, alpha nul et partiel |

La notation `b/d/g/h` résume quatre fichiers distincts. Le rapport JSON donne les noms exacts, dimensions, poids, nombres de pixels alpha et limites visibles pour chacun. Total : **77 358 855 octets**, soit **73,78 Mio**. Le fond blanc intégré a également été constaté visuellement sur `ennemi1_b.png`.

## Décisions

- Canvas 2D pour les aperçus ; HTML pour les contrôles et les informations accessibles. Manifeste et chargeur réutilisables pour le futur jeu.
- Directions et animations sont séparées. Les ennemis ont une image par direction, jamais une boucle sur leurs quatre fichiers. Le dos du joueur reste fixe.
- Bonus : centre, droite, centre, gauche. Bouche du personnage : alternance des deux poses de la direction choisie.
- Dessin proportionnel de l’image complète. Taille et décalages par fichier, sans altérer les PNG ; valeurs initiales neutres, validation visuelle encore nécessaire.
- Les fonds opaques sont préservés. Décider plus tard s’il faut des copies détourées ; ne pas supprimer automatiquement les blancs, qui appartiennent aussi aux yeux et aux logos.
- Originaux conservés pour cette étape. Leur poids et la mémoire de décodage justifieront des dérivés optimisés avant intégration au site.
- Aucun labyrinthe, déplacement, collision, score ou comportement ennemi à ce stade.

## Vérifications et limites

- Audit de dimensions et de chaque pixel alpha exécuté sur les 30 fichiers.
- Syntaxe des trois modules JavaScript validée ; manifeste : 30 sprites, 8 entités, une seule pose pour chaque direction des ennemis et pour le dos du joueur.
- Serveur local exécuté ; réponses HTTP et types MIME de la page, du CSS, des modules, du rapport et des PNG vérifiés.
- Chargeur testé avec un décodeur simulé : cache partagé, progression jusqu’à 30/30 et échec isolé signalé par son nom. Dessin testé sur les dimensions non carrées de `dos.png` : proportions conservées. Résolution des chemins vérifiée sous une URL de sous-dossier.
- Aucun navigateur pilotable disponible dans la session : rendu, interaction, export, persistance et affichage mobile restent à vérifier manuellement avec la procédure du README. Ne pas considérer la validation visuelle comme acquise.

## Prochaines étapes envisagées à la fin de l’étape 01

1. Valider visuellement directions, poses, tailles et centrage, puis retenir les réglages exportés.
2. Décider du traitement des 17 images opaques et produire, si souhaité, des dérivés légers distincts des originaux.
3. Définir la grille, les murs, les zones de départ et les règles du labyrinthe.
4. Développer ensuite déplacement, collecte, collisions et comportements ennemis, puis commandes tactiles.
5. Intégrer au site dans un sous-dossier et vérifier ses contraintes seulement lors de cette future étape.


## Étape 5 — Plateau et lisibilité

Plateau ajusté à la fenêtre, interface latérale et règles repliables. Cadrage alpha centralisé dans js/sprite-framing.js : union normalisée par animation et directions, marge de 2 pixels. Notification Teams conservée. Les 30 cadrages contiennent tous les pixels visibles de l’audit ; PNG intacts.

Tailles pour une case de 30 : visage 36, fantômes 32, bonus 27, points 6. Halos adaptés ; léger débord visuel assumé, physique inchangée. Atelier réutilisant le même cadrage. Après remplacement des PNG, refaire l’audit et actualiser les bornes ; dimensions différentes : repli sur image entière.

57 tests existants réussis, plus 3 tests de cadrage et rendu. Contrôle géométrique des fenêtres 1366×768, 1920×1080, 2560×1440 et planche controle-sprites.png inspectée. Aucun navigateur pilotable : prochaine vérification, jouer aux deux tailles et inspecter les animations, tunnels et règles dépliées.
