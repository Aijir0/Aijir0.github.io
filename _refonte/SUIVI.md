# Refonte visuelle — fichier de suivi

À lire en premier au début de chaque session (il tient lieu de `REFONTE_SUIVI.md`). Le dossier `_refonte/` n'est pas publié : Jekyll ignore les dossiers en `_`.

## Où en est-on (6 novembre 2026, fin de phase 11)

**Phase 11 terminée : le site définitif est construit et vérifié dans la branche locale `site-definitif` (répertoire `_site-definitif/`, servi sur http://127.0.0.1:8766/). Rien n'est poussé ni publié. La publication attend l'accord de Léo et deux décisions (CV, `CV/cvLaTeX.tex`) : voir `_refonte/PUBLICATION.md`.**
Laboratoire : http://127.0.0.1:8765/_refonte/prototypes/labo/ (comparaison : `labo/comparer.html`).
Ouvrir le comparatif : lancer `scripts/preview-games.ps1 -Port 8765`, puis http://127.0.0.1:8765/_refonte/prototypes/
Avant / après : `v2bis-phase9/` (fin de phase 9, avant la finition), `v2bis-phase8/` (fin de phase 8), `v2bis-phase7/` (fin de phase 7), `v2bis-phase6/` (fin de phase 6) et `v2bis-phase5/` (fin de phase 5) contre `v2bis/`.
Propositions de la phase 7 : http://127.0.0.1:8765/_refonte/prototypes/phase7.html (pistes des phases 5 et 6 : `pistes-visuels.html`).

Aucun fichier du site principal n'a été modifié. Rien n'a été poussé ni publié.

## Méthode convenue

- Une phase à la fois ; rien ne passe à la phase suivante sans validation de Léo.
- Pas de changement d'identité, d'architecture ou de composant majeur sans présentation préalable.
- Point de restauration Git avant chaque changement majeur ; l'ancien site reste en ligne jusqu'à validation finale.
- Vérification Playwright (desktop 1440 × 900, mobile 390 × 844) avant de déclarer une étape terminée.
- Skills : Taste Skill = direction artistique ; `animate` = motion ; Playwright = vérification. Pas de consultation redondante.
- Une itération de qualité plutôt que plusieurs retouches superficielles ; les versions précédentes restent intactes pour comparaison.

## Décisions validées

| Date | Décision |
| --- | --- |
| 2026-11-05 | Archive visuelle de l'existant : `_archive-visuelle/2026-11-05_avant-refonte/` (39 captures). |
| 2026-11-05 | Direction retenue : **A — « Note de breffage »**, interprétation contemporaine et chaleureuse, jamais une imitation d'administration. |
| 2026-11-05 | Vocation : site professionnel (lien du CV) ; public = recruteurs, employeurs, collaborateurs. |
| 2026-11-05 | Les réalisations interactives sont des réalisations à part entière, pas des annexes. |
| 2026-11-05 | **Atlas** (globe 3D) = futur projet distinct, « Hors-série » ; ne pas développer maintenant. |
| 2026-11-05 | Branche de travail : `refonte-visuelle-2026` (sauvegarde de départ : `9a3e4b7`). |
| 2026-11-06 | Validé provisoirement : concept « publication vivante », 4 signatures, Atkinson Hyperlegible Next pour l'interface. |
| 2026-11-06 | Reportés : version anglaise, mode sombre. |
| 2026-11-06 | Espace jeux intégré à « Travaux », sans supprimer les anciennes URL. |
| 2026-11-06 | Phase 5 : travail concentré sur V1 et V2 (préférence de Léo pour V2) ; V3 conservée comme référence, sans travail supplémentaire. |
| 2026-11-06 | Faits fournis par Léo : bac en science politique automne 2020 – hiver 2024 ; maîtrise en science politique terminée en mai 2026 ; MBA en analytique d'affaires en cours ; stage au ministère de l'Éducation terminé, emploi au Ministère en cours ; fonction de secrétaire du Club Animé Québec terminée. |
| 2026-11-06 | **Phase 6 : V2bis retenue comme base principale.** Pas de nouvelle exploration générale ni de retour sur l'architecture. |
| 2026-11-06 | Retirés de V2bis : l'avatar (portrait rond) et la biographie d'une ligne, remplacés par l'annonce du hors-série Atlas ; la bascule « 30 s / 3 min » (affichage scripté) ; le repère daté « Novembre 2026 » de la frise (il se périmerait). Le lien GitHub reste dans le contact. |
| 2026-11-06 | Faits complétés par Léo : poste actuel « Étudiant en veille, recherche et prospective » au ministère de l'Éducation du Québec (stage terminé, emploi étudiant en cours, dates du stage non affichées) ; pendant le stage, contribution à la programmation pluriannuelle des travaux de recherche du Ministère ; MBA en analytique d'affaires à l'Université Laval, en cours (dates non confirmées) ; secrétaire du Club Animé de septembre 2024 à mai 2025 (deux sessions universitaires). |
| 2026-11-06 | **Correction des travaux** : « Veille bibliographique automatisée » retirée de tous les prototypes (le script `projet_annexe/semantic_scholar_search.py` reste dans le dépôt) ; le PDF `presentation/rabb2.pdf` quitte le projet d'analyse (qui garde « Lire le rapport ») et devient une réalisation distincte, **ResearchRabbit — Présentation d'un outil de recherche scientifique** (travail universitaire, LaTeX Beamer sur Overleaf, 5 décembre 2024, 11 diapositives ; Léo est l'auteur de la présentation, pas du logiciel). |
| 2026-11-06 | **Validé** : la correction des travaux. Deux réalisations distinctes (analyse de données ; présentation ResearchRabbit) ; veille retirée des prototypes. Vignette **A** (composition bleue) dans la grille de V2bis, vignette **B** (vraie couverture du PDF, mise en scène documentaire) en tête de la fiche ResearchRabbit : l'une donne une identité reconnaissable, l'autre montre le document réel. |
| 2026-11-06 | **Phase 7 : V2bis est la référence visuelle définitive** ; direction « Note de breffage — publication vivante » confirmée. Pas de changement d'architecture ni de nouvelle exploration générale. |
| 2026-11-06 | Faits confirmés par Léo (phase 8) : au Ministère depuis décembre 2022, poste actuel « Étudiant en veille, recherche et prospective » ; stage terminé, emploi étudiant en cours ; pendant le stage, contribution notamment aux travaux de programmation pluriannuelle de la recherche. Ne pas présenter le stage comme un emploi terminé ; ne pas inventer ses dates. |
| 2026-11-06 | **Phase 8 tranchée par Léo** : accroche **A** « Éclairer les décisions publiques / par la recherche, la prospective et les données. » ; Nadeshicon (CA 2025 – 2026) et Collectif de Québec pour la paix (bénévole, 2026) **ajoutés** à la frise (côté événementiel et engagement) ; Citelum **conservé** ; le CV sera mis à jour par Léo plus tard. |
| 2026-11-06 | **Phase 10** : V2bis retenue définitivement ; plus de variantes ni de laboratoire. **Citelum (stage de 2018 – 2019) retiré du parcours** à la demande de Léo (remplace la décision « laisse Citelum » de la phase 8) ; la frise va désormais de 2020 à 2027. |
| 2026-11-06 | PacQC : plus de visage du collègue, de sigles administratifs ni de logo Teams ; un personnage dessiné et le nom « PacQC » intégré. Scène Pixel Art : un avatar pixel stylisé inspiré de Léo. |

## Système des prototypes

- **Palette** : papier `#F5F2EA`, papier-2 `#ECE7DA`, encre `#1A1C1A`, encre-2 `#4A4A44`, vert `#1E4636` (structure), rouge `#A63D2A` (annotations uniquement), filet `#D9D3C4`. Tous les couples de texte passent l'AA (5,65 à 15,3).
- **Mouvement** : courbes `--ease-out` (0.23, 1, 0.32, 1) et `--ease-in-out` (0.77, 0, 0.175, 1) ; survols de 150 à 250 ms ; tracés et titres de 800 à 1100 ms, une seule fois ; `prefers-reduced-motion` = états finaux immédiats, View Transitions coupées.
- **Signatures** (`commun/base.css` + `commun/signatures.js`) : stylo rouge ; notes reliées par un fil ; sommaire vivant (barre de lecture et tiroir `<dialog>` sur mobile) ; la figure devient la page (View Transitions entre documents).
- **V1, V2, V3** (phase 2) : trois polices (Newsreader, Atkinson Hyperlegible Next, Atkinson Hyperlegible Mono).

### V2bis « La Une, édition de fond » (phase 5) — règles propres (`v2bis/v2bis.css`)

- **Deux polices, un rôle chacune.** Newsreader pour tout ce qui se lit (nom, titres, texte, dates, légendes en italique). Atkinson Hyperlegible Next pour tout ce qui se manipule ou s'étiquette, en bas de casse. La chasse fixe est supprimée ; seul l'extrait de code garde une police à chasse fixe (police système).
- **Chiffres en Newsreader.** Atkinson Hyperlegible dessine un zéro barré, sans variante pour le retirer (testé : ss01 à ss05, cv01 à cv03, zero, salt). Il donnait aux années un air de terminal. Newsreader (Google Fonts) n'a ni petites capitales ni chiffres elzéviriens (testé).
- **Axe 5/7** : la une (présentation à gauche, travail phare à droite) fixe la grille ; chaque section reprend le même axe (titre à gauche, chapeau en italique à droite ; index et aperçu des travaux).
- **Pas de numérotation décorative** (§, 01…), pas de capitales espacées, pas de « Fig. » sous le portrait.
- **Flèches** : « ↗ » pour sortir du site, « ↓ » pour télécharger ; aucune autre.
- **Stylo rouge rationné** : un mot souligné (« lisible ») et la droite de régression.
- **Filets** : un filet d'encre par section, des filets clairs entre les lignes ; plus de filets verticaux ni de double filet.
- **Repris de V1** : accroche composée, fiche signalétique, lecture « 30 s / 3 min », tableau des compétences avec leurs preuves. **Repris de V2** : nom en titre, travail phare, index avec aperçu, figure annotée, frise. **Repris de V3** : en-tête « objet, date, durée » de la fiche.
- **Nouveau** : frise en deux registres (expérience, formation) ; ligne « Hors champ » (natation, poésie).
- **Phase 6** : à droite du nom, l'annonce de couverture « Hors-série · en chantier — Atlas, un globe interactif de mes voyages » (texte provisoire), avec un globe au trait vert et une route tracée une fois au stylo rouge (même grammaire que les annotations ; rien ne tourne). Sur mobile, réduite à une ligne de couverture. L'annonce n'est plus répétée dans le colophon. Le portrait n'apparaît plus nulle part sur la page.
- **Vignettes des travaux** : même cadre pour toutes (proportion 40/21, filet, légende en italique) ; chaque visuel garde sa propre identité.

## Arbitrages entre skills et demande (la demande de Léo prime)

- Taste Skill interdit les légendes d'images → **conservées** (grammaire éditoriale), mais rédigées en italique de lecture.
- Taste Skill interdit les révélations au défilement sur un site non technique → **autorisées mais rationnées** : une fois, au plus une par écran, absentes sous mouvement réduit.
- « Une section par écran » → appliqué au premier écran seulement.
- Ses scripts (tirage aléatoire de palette, vérificateurs) ne sont pas utilisés : ils contrediraient la palette validée et signaleraient comme fautes les choix éditoriaux ci-dessus.

## Visuels des projets, phase 6 (`pistes-visuels.html`, images dans `medias/projets/`)

Générés par `_refonte/outils/visuels-projets.mjs` (conservé : sources de l'avatar et du logotype, à retoucher puis relancer).
- **PacQC** : logotype SVG « PA + personnage à la place du C + QC » (identité d'origine : capitales grasses, « QC » vert anis `#D9FB81`, fond `#101419`). Propositions : 1 logotype seul ; **2 couloir de labyrinthe, personnage, pastilles, fantôme vert anis sans sigle (à l'essai dans V2bis)** ; 3 logotype sur le plan réel assombri. Le personnage reprend la forme du personnage d'arcade d'origine (marque déposée de Bandai Namco) : acceptable pour un jeu personnel non commercial, à garder en tête.
- **Scène Pixel Art** : avatar `avatar-leo.svg`, 16 × 24 pixels dessinés à la main (cheveux bruns, lunettes, barbe courte, veste marine, chemise bleu clair), toujours agrandi par multiples entiers sans lissage. Propositions : 1 fiche de personnage sur carreau isométrique ; **2 avatar net devant la scène floutée (à l'essai dans V2bis)** ; 3 pastille (buste en cadre pixel), utilisable comme logo. Titre en Silkscreen, intégré à l'image (aucune police chargée par le site).

## Visuels de la phase 7 (`phase7.html`, images `medias/projets/p7-*`)

Générés par `_refonte/outils/visuels-phase7.mjs` : chaque image de jeu est dessinée en basse définition sur une grille de pixels constante, puis agrandie d'un facteur entier (×20, ×13 ou ×10) ; aucune police chargée, alphabet pixel dessiné pour l'occasion (capitales de 7 pixels, fût de 2).
- **PacQC** : personnage original (œil, ombré en deux tons, 13 × 13 px). 1 **Borne** (personnage, deux pastilles, nom ; filet de borne ; recommandée pour la grille, **à l'essai dans V2bis**) ; 2 **Tuque** (mascotte en tuque rayée sur vert anis ; icône, page du jeu) ; 3 **Labyrinthe** (le nom tracé en murs, personnage dans le couloir ; affiche). Logos SVG `p7-pacqc-logo-1.svg` (horizontal) et `p7-pacqc-logo-2.svg` (empilé). Silhouette d'arcade déposée : réserve maintenue.
- **Scène Pixel Art** : nouvel avatar `p7-avatar-leo.svg`, 20 × 32 px, d'après `images/port1.jpg` (cheveux en volume, lunettes rondes, moustache et barbiche, costume marine, chemise bleu clair ; contour sélectif). 1 **Personnage** seul ; 2 **Place** isométrique (pavillon, arbres, banc, lampadaire ; recommandée, **à l'essai dans V2bis**) ; 3 **Titre** « SCÈNE PIXEL ART » en lettres pixel (écran de la page du jeu).
- **Atlas** : globe orthographique aux côtes réelles (Natural Earth 1:110 M via world-atlas, d3-geo au moment de la génération, aucun script sur la page), un seul repère sur Québec, rien d'inventé. `p7-atlas-globe.svg` (en-tête), `p7-atlas-vignette.jpg` (grille), `p7-atlas-carte.jpg` (fiche). Le titre de l'annonce mène à `v2bis/atlas.html` (« Hors-série · En chantier ») ; ligne « Atlas · À venir » en fin de Travaux.
- **Portrait** : `medias/portrait-leo.jpg` (recadrage 4:5 de `images/port1.jpg`, original intact). A **photo d'identité en tête de la fiche signalétique** (recommandée, **intégrée à V2bis**) ; B portrait au contact (simulé pour la capture : `outils/captures-phase7.mjs`). `images/portrait.png` est un selfie de voyage, non utilisé (piste possible pour Atlas, si Léo le souhaite).

## Phase 11 : site définitif (branche `site-definitif`)

**Méthode**
- La branche `site-definitif` part de l'état publié (`origin/main` = `95750c5`, étiquette locale `site-avant-refonte`). Elle vit dans un répertoire de travail séparé, `_site-definitif/`, exclu localement par `.git/info/exclude`.
- Elle n'a pas de branche amont : un `git push` sans destination ne publie rien.
- `_refonte/` n'y entre jamais. Le dépôt est public, et fusionner la branche de refonte rendrait le suivi et les prototypes lisibles sur GitHub.
- La transposition est automatisée par `_refonte/outils/construire-site.mjs` : il lit V2bis et écrit les pages, la feuille de style, le script, les images et `_config.yml`. Chaque remplacement vérifie son motif, et une reconstruction donne des fichiers identiques.

**Lots** (commits de `site-definitif`)
1. `2960505` Accueil : V2bis transposée. Une feuille de style unique `assets/site/site.css` (socle, édition, fiches), un script unique `assets/site/site.js` (socle, aperçu, mouvement), images dans `assets/site/img/`, chemins depuis la racine, métadonnées SEO et Open Graph, icône, `_config.yml`.
2. `557585a` Fiches sous `/travaux/artefacts-2050/`, `/travaux/researchrabbit/`, `/travaux/atlas/`.
3. Parcours et CV : rien à changer sur le site (faits déjà justes, Citelum absent). CV obsolète : brouillon fiable préparé (`_refonte/cv/CV-Leo-Matrat-brouillon-2026-11.pdf`, informations validées seulement), en attente de décision.
4. `e2ddb48` Jeux : aucun moteur touché. Tests `PacQC/tests/run.mjs` 86/86 et `tests/preview.test.mjs` réussis ; PacQC répond au clavier sur les trois cartes et au toucher ; la Scène répond au clavier ; Artéfacts 2050 répond au clic ; retours jeux → menu → nouvel accueil. Ajout de `favicon.ico` (les jeux sans icône déclarée provoquaient une erreur 404).
5. `a47ce30` Nettoyage :
   - retirés : ancien thème HTML5 UP (`assets/css`, `assets/js` avec jQuery, `assets/sass`, `assets/webfonts` avec Font Awesome), `node_modules/` (module d'accessibilité déjà cassé en ligne), `package.json` ; une recherche a d'abord vérifié qu'aucune page ne les chargeait ;
   - conservés : images et documents historiques ;
   - ajoutés : image de partage, `robots.txt`, `sitemap.xml`, `README.md` réécrit, `DESIGN.md` à la racine (exclu de la publication).
6. `dfe6228` Contrôles finaux :
   - zones tactiles invisibles d'environ 44 px pour les liens pris dans le texte (écran tactile) ;
   - au retour d'une fiche, l'aperçu bascule sans délai (plus d'image fantôme dans la transition) ; correction reportée aussi dans V2bis ;
   - « Retour au profil » revient en arrière dans l'historique quand on vient de l'accueil : la position de lecture et l'image sont retrouvées.

**Différences avec V2bis**
- Mentions de travail retirées :
  - « Visuel proposé, à valider » et « niveaux à confirmer » ;
  - note « Texte à valider » d'Atlas ;
  - lignes Rôle et Outils et paragraphe « à compléter » d'Artéfacts 2050 (non confirmés, donc retirés plutôt qu'inventés) ;
  - note « formulation à valider » sur la question d'Artéfacts (la question est gardée).
- Colophon : « © 2026 Léo Matrat · Code source ».
- Vignette d'Artéfacts tirée de la version publiée (PR #4), visuellement identique.
- Comparaison au pixel en mouvement réduit : l'accueil sur ordinateur a la même hauteur, avec 0,04 % de pixels différents, tous dans les zones des mentions retirées.

**Tests** (`_refonte/outils/verifier-site.mjs`, Edge par Playwright)
- **Pages :** 4 pages du site à 1440, 1024, 768 et 390 px, plus 6 pages de jeux et de documents. Aucune erreur JavaScript, aucun débordement.
- **Liens et images :** 24 ressources internes, aucune cassée. GitHub répond 200 ; LinkedIn répond 999 (blocage habituel des robots).
- **Métadonnées :** `lang`, titre, description, canonique, image de partage, un seul `h1`, pas de `noindex`, aucune mention de travail.
- **Accessibilité :** contrastes AA, focus visible sur 30 tabulations, rien de caché en mouvement réduit.
- **Mouvement :** captures en cours d'animation (entrée, ouverture d'une fiche, fiche suivante, retour avec position et image retrouvées).
- **Performances :**
  - ordinateur : LCP 176 ms, CLS 0,003 ;
  - téléphone avec processeur ralenti quatre fois : LCP 384 ms, CLS 0 ;
  - aucune image lente au défilement.
- **Publication simulée :** 151 fichiers publiés sur 179 suivis ; aucun fichier sensible ni de travail publié.

**Problèmes non résolus**
- CV obsolète (décision requise, bloquant pour la mise en ligne).
- `CV/cvLaTeX.tex` (adresse postale) toujours lisible dans le dépôt public.
- ~~Les 4 images du rapport R n'ont pas d'attribut `alt`~~ : corrigé dans `projet2.Rmd`, et provisoirement dans `projet2.html` (`dd3d1c0`).
- Dans le jeu PacQC et dans l'aperçu du menu des jeux, le visage du collègue est toujours présent (décision reportée, jeux non modifiés).
- ~~Le titre de la page de la Scène est sans accent~~ : corrigé (`dd3d1c0`).
- Rien n'a été essayé sur un vrai téléphone, ni dans Safari ou Firefox.
- Il n'y a pas de Jekyll local : les exclusions sont simulées, puis à vérifier en ligne.

**Corrections après la phase 11**
- `dd3d1c0`, publié sur `main` (avance simple, sans `--force`) :
  - accent de « Scène Pixel Art » ;
  - textes alternatifs des 4 graphiques du rapport R, dans `projet2.Rmd` et, provisoirement, dans `projet2.html` ;
  - titre du rapport : « Les dépenses sociales réduisent-elles la pauvreté dans les pays de l'OCDE ? ».
- `02b21ee` : `origin/main` fusionnée dans `site-definitif`, sans conflit. `site-definitif` est sauvegardée sur GitHub, sans être fusionnée dans `main`.
- **Engagements associatifs fusionnés** (V2bis, puis `site-definitif` reconstruite par `construire-site.mjs`) :
  - « Secrétaire, Club Animé Québec » et « Membre du conseil d'administration, Nadeshicon » deviennent une seule entrée : **« Club Animé Québec et Nadeshicon »**, avec pour description « Implication associative et évènementielle, de 2024 à 2026. ».
  - La barre est pleine pour le Club (septembre 2024 – mai 2025), puis pointillée pour Nadeshicon (dates non précisées), sur une seule ligne.
  - L'entrée est plus discrète que les formations et le poste au Ministère : classe `.discret`, titre en 1rem gris, description en .875rem, barre de 4 px au lieu de 8, ligne plus serrée.
  - Le nombre de participants et le titre de membre du conseil d'administration ne sont plus affichés. Le Collectif de Québec pour la paix est inchangé.
  - Contrôlé à 1440, 1024 et 390 px : une seule ligne, les deux segments jointifs, aucun débordement. `verifier-site.mjs` ne relève aucun problème.
  - Observé sur téléphone, sans lien avec cette correction : le libellé « aujourd'hui » chevauche « 2026 » sous l'axe de la frise.

**Sauvegarde avant publication (6 novembre 2026)**
- La version en ligne est `dd3d1c0` (`main`) : dernier déploiement GitHub Pages réussi, et 7 fichiers en ligne identiques octet pour octet à ce commit.
- Tag annoté `sauvegarde-avant-publication-2026-11-06` sur `dd3d1c0`, poussé sur GitHub. Le tag `site-avant-refonte` (`95750c5`) est conservé.
- Archive : `D:Sauvegardes-Site-Webleomatrat-com-dd3d1c0-2026-11-06.zip`, hors du dépôt. 224 fichiers, tous identiques au commit après extraction ; SHA-256 `f3578f1e5c1ded3328165af3cfe5b244984c382485e30d04635bc4b8003c2420`.
- Commit de la fusion associative sur `site-definitif` : `680bb1a`.

## Phase 10 : finition (V2bis)

**Défauts corrigés**
- **Tablette, de 641 à 1099 px.** La figure à la une et toutes les vignettes de l'index passaient en pleine largeur : la section Travaux mesurait 3 260 px à 1024 px. L'axe 5/7 revient dans la une et dans chaque ligne, avec le texte à gauche et la vignette de 17rem à droite.
- **Saut au chargement.** L'italique de Georgia, plus large, faisait gagner une ligne à l'accroche pendant le chargement des polices (37 px de saut sur téléphone). Le CLS atteignait 0,11 en mouvement réduit ; le défaut existait déjà et restait masqué par les fondus. Il est corrigé par des polices de secours aux métriques mesurées, romain et italique : la mise en page est désormais identique avant et après le chargement, et le CLS tombe à 0,001.
- **Sommets de lettres visibles** au départ de la montée de l'accroche, quand elle passe sur deux lignes : le masque déborde de .2em. Le texte part maintenant d'un peu plus bas.
- **Aperçu de l'index.** Le fondu croisé montrait une double image grise et deux légendes superposées. La nouvelle image se pose désormais sur l'ancienne, et l'ancienne légende disparaît aussitôt.
- Trois défauts introduits en cours de phase, repérés sur capture et corrigés :
  - la figure de l'analyse ne se révélait jamais (l'observateur ne voit pas un élément masqué par `clip-path`) ;
  - le trait de lecture restait sur la première rubrique (`offsetLeft` faussé par la transformation des rubriques) ;
  - une règle d'entrée réactivait le mouvement en mouvement réduit.
- **Barres « en cours » de la frise.** Elles s'arrêtaient à une date figée (2026,85). Elles s'arrêtent désormais à « aujourd'hui », calculé chaque jour.

**Mouvement retravaillé** (détail : § 7 de `DESIGN.md` ; code : `v2bis/v2bis.js` et le bloc « Phase 10 » de `v2bis.css`)
- **Entrée :** la une se compose à la première visite de la session (filets, rubriques, portrait développé, figure découverte, stylo). Elle est lisible en environ 1 s et s'interrompt au premier geste ; sur téléphone, la une attend d'être visible. Les visites suivantes gardent des fondus courts.
- **Révélations rationnées :** titres de section (filet tracé, titre, chapeau), images de l'index en tablette et téléphone, figure de l'analyse. La séquence est coordonnée : révélation, puis tendance, puis cercles au stylo.
- **Profondeur :** ±3 % sur la une et les figures des fiches seulement.
- **Navigation**
  - La vignette devient l'image de la fiche ; au retour, l'aperçu remontre l'œuvre quittée.
  - « Réalisation suivante » glisse latéralement.
  - Un trait de lecture unique dans la manchette.
  - Le nom de section glisse dans la barre de lecture (téléphone).
  - Les boutons marquent une marche au survol et s'enfoncent au clic.
- **Frise :** tracée dans l'ordre du temps, repère « aujourd'hui », estompage au survol.

**Contenu**
- Citelum est retiré de V2bis (frise). Les anciennes versions et archives le gardent : instantanés `v2bis-phase5` à `v2bis-phase9`, V1 à V3, `v2bis-labo`.
- Rien d'autre ne change : ResearchRabbit et ses deux vignettes, le MBA, le Ministère, Nadeshicon, le Collectif et les projets sont conservés.

**Optimisation**
- Aucune dépendance ajoutée ; le mouvement passe par CSS, View Transitions et environ 200 lignes de JavaScript natif.
- Animations liées au défilement hors du fil principal ; aucune boucle permanente.
- Le socle commun (`commun/`) n'est pas modifié, pour ne pas altérer les instantanés.

**Revue** (grilles d'`animate` et de `review-animations`)
- Réglages appliqués : remise à l'échelle de l'aperçu ramenée à 300 ms, transition vers la fiche ramenée à 500 ms.
- Exception assumée : le filtre gris → couleur du portrait.
- Verdict : favorable.

**Tests**
- **Audit Playwright :** 1440, 1024, 768 et 390 px, avec captures en cours d'animation (entrée à 120, 450, 600, 900, 1100 et 1700 ms ; révélations ; figure ; aperçu ; transitions vers la fiche, vers la fiche suivante et retour) ; aucune erreur JavaScript, aucun débordement.
- **Clavier :** le focus active l'aperçu et les cercles.
- **Mouvement réduit :** rien n'est caché.
- **Liens et images :** 98 testés sur 22 pages, aucun cassé.
- **Mesures** (`mesures-labo.mjs v2bis`) : aucune image lente au défilement, même sur téléphone ralenti quatre fois ; CLS de 0,003 sur ordinateur et 0 sur téléphone ; LCP de 188 ms (ordinateur) et 372 ms (téléphone), meilleurs qu'avant.

**Limites**
- Rien n'a été essayé sur un vrai téléphone, dans Safari ni dans Firefox. Firefox affiche la version calme, sans transitions entre pages ni profondeur.
- Le rythme de la composition se juge à l'œil.
- `review-animations` porte `disable-model-invocation` : ses critères ont été lus et appliqués, mais le skill n'a pas pu être lancé.

## Phase 8 : vérification éditoriale (`phase8.html`, `_refonte/cv/proposition-cv-2026-11.md`)

Sources rapprochées : indications de Léo ; CV PDF actuel (`CV/CVLeoM.pdf`, Canva, 28 septembre 2026, titre interne « Copie de Nouveau CV à modifier ») ; ancien CV LaTeX (`CV/cvLaTeX.tex`, décembre 2024, plus à jour) ; site en ligne ; contenus des projets (`artefacts-2050/game.json` et données du jeu, `projet_session/code/code.R`, `presentation/rabb2.pdf`, `PacQC/README.md` et tests).
- **Corrigé dans V2bis** : ordre « stage, puis poste » retiré (non établi) ; formulation de la programmation pluriannuelle alignée sur Léo ; Artéfacts « fiches » et non « notes », « environ cinq minutes », « des effets papillon », sources citées par le jeu ajoutées à la fiche ; « un jeu sérieux » (singulier) ; niveaux de langue non confirmés retirés (anglais : VEPT 63, d'après le CV actuel) ; lien « Analyse OCDE » pour Elicit et NotebookLM ; ResearchRabbit « exportée en PDF ».
- **Accroche** : A « Éclairer les décisions publiques / par la recherche, la prospective et les données. » (recommandée) ; B « Comprendre l'action publique, / anticiper ses choix, en mesurer les effets. » ; C « De la science politique à l'analytique d'affaires : / la recherche et les données au service des décisions. ». L'accroche actuelle reste en place jusqu'au choix.
- **CV** : le texte proposé ne reprend ni téléphone, ni adresse, ni courriels de référents. Le CV public expose le téléphone et les courriels de trois référents : version publique recommandée.

### ResearchRabbit
- PDF vérifié avec pdf.js : producteur pdfTeX-1.40.25, classe Beamer, « Présentation de Research Rabbit · Outils numériques de recherche », Léo Matrat, Université Laval, 5 décembre 2024 ; parties : introduction (origines, place dans la recherche), comparaison (Zotero, Mendeley, EndNote, Google Scholar, ResearchRabbit), prise en main. La fiche ne dit rien de plus.
- Deux vignettes, **validées dans leur usage actuel** : **A** la composition bleue (copie JPEG suivie par Git : `medias/projets/researchrabbit-vignette.jpg`), dans la grille de V2bis, légende « visuel du projet » (ce n'est pas la couverture du PDF) ; **B** la vraie première page posée sur le papier avec la diapositive « Plan » derrière (`researchrabbit-document.jpg`, suivie par Git, générée depuis le PDF), en tête de la fiche `v2bis/researchrabbit.html`.
- Original de A : **rangé dans `_refonte/sources/vignette-researchrabbit.png`** (1,4 Mo, suivi par Git ; rangement validé par Léo). Chemin mis à jour dans `outils/visuels-projets.mjs`. À la refonte définitive, une copie web légère ira dans `images/`.
- Non-publication : GitHub Pages compile le site avec Jekyll (pas de `.nojekyll`, pas de `_config.yml`, pas de workflow), et Jekyll exclut les dossiers en `_` ou en `.`. Constat sur le site en ligne : `.Rhistory`, suivi sur `main`, renvoie 404. **À préserver lors de la bascule** : ajouter un `.nojekyll` ou un workflow Pages publierait `_refonte/` ; dans ce cas, exclure `_refonte/` explicitement. Si la branche est poussée, le PNG reste visible dans le dépôt GitHub public (pas sur le site).
- Intégration dans la grille vérifiée (1440, 768, 390) : descriptif raccourci à « Présentation d'un outil de recherche, en LaTeX » pour tenir sur une ligne à 390 px, comme les lignes voisines ; recadrage 40 : 21 de la vignette sans perte d'information. Le bleu saturé reste l'élément le plus coloré de la liste, choix assumé.
- Bouton « Consulter la présentation » vers `presentation/rabb2.pdf`.
- Correction appliquée aussi à V1, V2, V3 et `v2bis-phase5/` (sans fiche propre : lien direct vers le PDF, ou vers la fiche de V2bis pour l'instantané).
- Contrôle des liens : `_refonte/outils/verifier-liens.mjs` (23 liens internes, ancres comprises, sur 10 pages : aucun lien cassé).

## Pistes visuelles des projets, phase 5 (écartées ; images dans `medias/pistes/`)

Fabriquées à partir des ressources réelles des jeux ; aucun original modifié, aucun logo remplacé.
- **PacQC** : A plan de carte ; B les quatre fantômes et le logo d'origine ; **C les trois cartes en plan (recommandée)**. Le joueur (visage d'une tierce personne) est masqué dans toutes les pistes. B est déconseillée devant un employeur public : sigles administratifs et logo Teams (marque déposée).
- **Scène Pixel Art** : **A détail du pavillon Charles-De Koninck agrandi ×2 (recommandée)** ; B la place avec le personnage ; C cartouche-titre en lettres pixel (Silkscreen), utilisable comme logo sur la page du jeu.
- Remplacées en phase 6 par les propositions ci-dessus.

## Fichiers

```
_refonte/prototypes/index.html            Comparatif V2bis, V2, V1 (+ V3 en référence), critique des détails
_refonte/prototypes/pistes-visuels.html   Pistes visuelles PacQC et Scène Pixel Art (phases 5 et 6)
_refonte/prototypes/phase7.html           Propositions de la phase 7 (PacQC, Scène, Atlas, portrait)
_refonte/prototypes/phase8.html           Bilan éditorial de la phase 8 (corrections, accroches, vérifications, CV)
_refonte/prototypes/v2bis-phase7/         Instantané de V2bis à la fin de la phase 7 (avant / après)
_refonte/cv/proposition-cv-2026-11.md     Texte proposé pour le CV (à reporter dans Canva ; CV actuel intact)
_refonte/DESIGN.md                        Design system proposé (sera déplacé à la racine, exclu de la publication)
_refonte/PLAN-MIGRATION.md                Plan de migration de V2bis vers le site définitif (lots 0 à 7)
_refonte/motion/01-opportunites.md        Occasions d'animation retenues et écartées (skill find-animation-opportunities)
_refonte/prototypes/labo/                 Laboratoire : direction, signatures classées, mesures, revue ; comparer.html (avec / sans)
_refonte/prototypes/v2bis-labo/           Copie expérimentale de V2bis : labo.css, labo.js (panneau de réglage)
_refonte/outils/mesures-labo.mjs          Fluidité, CLS, LCP, mouvement réduit, clavier (V2bis contre labo)
_refonte/prototypes/v2bis-phase8/         Instantané de V2bis à la fin de la phase 8 (avant / après)
_refonte/prototypes/v2bis-phase9/         Instantané de V2bis à la fin de la phase 9 (avant la finition)
_refonte/prototypes/v2bis/v2bis.js        Mouvement de V2bis (phase 10), chargé dans <head>
_refonte/prototypes/v2bis-phase6/         Instantané de V2bis à la fin de la phase 6 (avant / après)
_refonte/outils/visuels-phase7.mjs        Générateur phase 7 (moteur de pixels, alphabet, sprites, globe, portrait)
_refonte/outils/captures-phase7.mjs       Captures du portrait (A, B) et de l'annonce Atlas
_refonte/prototypes/v2bis/                V2bis : index.html, artefacts-2050.html, researchrabbit.html, atlas.html, v2bis.css (base retenue)
_refonte/prototypes/v2bis-phase5/         Instantané de V2bis à la fin de la phase 5 (avant / après)
_refonte/prototypes/medias/projets/       Visuels phase 6 (PacQC, Scène), avatar-leo.svg, pacqc-logotype.svg
_refonte/outils/visuels-projets.mjs       Générateur des visuels phase 6 (avatar et logotype en source)
_refonte/prototypes/v1-couverture/        V1 « Couverture » (faits corrigés en phase 5)
_refonte/prototypes/v2-la-une/            V2 « La Une » (faits corrigés, vignettes miniatures corrigées en phase 5)
_refonte/prototypes/v3-note-annotee/      V3 « Note annotée » (référence, inchangée : faits non mis à jour)
_refonte/prototypes/fiche/                Fiche Artéfacts 2050 commune à V1, V2, V3
_refonte/prototypes/commun/               base.css, signatures.js (préfixe de la barre mobile réglable : data-prefixe)
_refonte/prototypes/medias/               Copies JPEG légères ; medias/pistes/ = visuels-pistes
_refonte/prototypes/captures/             Captures par page + rapport-verification.json + controles/
_refonte/outils/verifier-prototypes.mjs       Captures et mesures (pages : v1 v2 v3 v2bis fiche fiche-v2bis fiche-rr fiche-atlas comparatif pistes phase7 phase8)
_refonte/outils/verifier-liens.mjs           Liens et images internes (HTTP 200) et ancres, sur 15 pages
_refonte/sources/                         Originaux fournis par Léo (non publiés) : vignette-researchrabbit.png
_refonte/outils/controles-complementaires.mjs Contrastes, poids, CLS, LCP, transition (V2bis), clavier (V1), tiroir (V2bis)
```

**Relancer les vérifications.** Il faut le serveur sur le port 8765 et Microsoft Edge (Chrome est absent de cette machine). Il faut aussi le paquet `playwright`, installé hors du dépôt, sans navigateur : `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright@1.48.2` dans un dossier temporaire. Puis :
`PW=<ce dossier>/node_modules/playwright node _refonte/outils/verifier-prototypes.mjs v2bis`
Les visuels-pistes ont été produits par un script jetable (captures du jeu PacQC avec le joueur masqué, recadrages de `jeu/imagesjeu/Fond.png`) ; il n'est pas conservé : les images suffisent.

## Vérifications effectuées

**Phase 2** : 3 variantes + fiche + comparatif, desktop et mobile, sans erreur ; contrastes, CLS, LCP, transition, clavier, tiroir contrôlés.

**Phase 5 (6 novembre 2026)** :
- V1, V2, V2bis, fiche V2bis, comparatif, pistes, en desktop et en mobile : aucune erreur console, aucun défilement horizontal, polices demandées toutes chargées, aucune image sans texte alternatif, aucune petite cible.
- Performances locales : V2bis CLS 0,001, LCP 220 ms, 536 Ko (une police de moins que V2 : 641 Ko).
- Transition de figure V2bis → fiche capturée en cours ; le retour ramène à V2bis. Tiroir mobile V2bis : focus piégé, Échap ferme et rend le focus.
- Défauts trouvés sur capture et corrigés : courriel coupé au milieu du mot, repère « aujourd'hui » qui traversait le texte sur mobile, triptyque PacQC rogné, libellés de fiche mal alignés, repères « À compléter » coupés en deux lignes, chiffres à zéro barré.

**Non vérifié** : Safari, Firefox (pas de View Transitions entre documents : la navigation reste normale), lecteur d'écran réel, appareil tactile réel, réseau lent.

## Contenus manquants (signalés « À compléter » ou « à valider » dans les prototypes)

- Accroche de positionnement (proposée : « Comprendre l'action publique, et la rendre lisible. »). Avec le MBA, une variante possible : « Lire l'action publique à travers ses données. »
- Texte de l'annonce Atlas (provisoire : « Atlas, un globe interactif de mes voyages »).
- MBA : dates de début et de fin non confirmées (la frise montre un pointillé entre la fin de la maîtrise et aujourd'hui, légendé « début non précisé »).
- Maîtrise : mois de début en 2024 (la frise place le début au printemps, à titre indicatif).
- Année d'arrivée au Québec (note de V1).
- Niveau en allemand (cité sur l'ancien site, absent du CV).
- Fiche Artéfacts 2050 : rôle, outils, démarche, résultat, question (formulation proposée).
- L'adresse et le téléphone du CV LaTeX n'ont volontairement pas été repris.
- Le CV PDF lui-même n'a pas été mis à jour (hors périmètre).

## Décisions ouvertes (à trancher par Léo)

0. Phase 11 : valider le site définitif (http://127.0.0.1:8766/) ; choisir pour le CV (a) export Canva à jour, (b) brouillon préparé ou (c) liens retirés ; retirer ou non `CV/cvLaTeX.tex` du dépôt public ; confirmer Nadeshicon et le Collectif dans la frise ; puis autoriser la publication (`PUBLICATION.md`). Restent : visage du collègue dans PacQC, accent de « Scène », intitulé officiel du poste, niveaux de langue.
1. PacQC : Borne, Tuque ou Labyrinthe pour la grille ; logo de la page du jeu. Scène : composition et ressemblance de l'avatar.
2. Atlas : texte de l'annonce et de la fiche (rédigés d'après la description de Léo).
3. Portrait : intégration A (fiche signalétique), B (contact), ou les deux.
4. L'accroche définitive.
5. Le jeu PacQC lui-même affiche encore le visage du collègue, les sigles et le logo Teams : hors périmètre des prototypes, à traiter avant de mettre PacQC en avant.
6. Orthographe du nom « Scène Pixel Art » (avec accent) sur la page du jeu.

## Journal

- 2026-11-05 : archive visuelle, diagnostic, 3 directions, choix de la direction A, proposition de phase 1.
- 2026-11-06 : commits `0293cba` (socle + V1) et `3174285` (V2, V3, fiche, outils) ; comparatif, contrôles complémentaires, ce suivi (`09fd5a3`).
- 2026-11-06 (phase 5) : faits corrigés dans V1 et V2 ; critique visuelle ; V2bis et sa fiche ; pistes visuelles PacQC et Scène ; comparatif refait ; vérifications Playwright (`f79ce7f`).
- 2026-11-06 (phase 6) : instantané `v2bis-phase5/` ; Atlas à la place de l'avatar ; retraits (bascule 30 s, repère daté, doublon du colophon) ; faits complétés dans V2bis, V1 et V2 ; visuels PacQC et Scène (générateur conservé) ; intégration à l'essai ; vérifications Playwright (`4891870`).
- 2026-11-06 (correction des travaux) : veille retirée, ResearchRabbit ajouté (fiche V2bis, deux vignettes), PDF détaché de l'analyse ; contrôle des liens ; vérifications Playwright (`00c3249`).
- 2026-11-06 (validation) : correction des travaux validée ; légende de la vignette A rectifiée, descriptif ResearchRabbit raccourci (V2bis, instantané, V2) ; liens et rendu revérifiés.

- 2026-11-06 (rangement) : original de la vignette ResearchRabbit déplacé dans `_refonte/sources/`, générateur mis à jour ; contrôle étendu aux images (50 liens et images, aucun cassé) ; non-publication vérifiée.
- 2026-11-06 (phase 7) : instantané `v2bis-phase6/` ; générateur pixel `visuels-phase7.mjs` ; PacQC (3 propositions, 2 logos), avatar d'après le portrait et 3 compositions de la Scène, globe d'Atlas aux côtes réelles et fiche `atlas.html`, portrait A intégré et B simulé ; page `phase7.html` ; contrôles liens et images (74, aucun cassé) et Playwright.
- 2026-11-06 (phase 8) : instantané `v2bis-phase7/` ; vérification des contenus source par source ; corrections factuelles dans V2bis ; trois accroches ; bilan `phase8.html` ; proposition de CV ; contrôles liens et images (80, aucun cassé) et Playwright.
- 2026-11-06 (phase 9) : instantané `v2bis-phase8/` ; accroche A et engagements Nadeshicon et Collectif ajoutés à V2bis (accent du « É » rétabli : le masque de ligne le rognait) ; analyse du site actuel (publication Jekyll, fichiers de travail publiés dont `CV/cvLaTeX.tex`, scripts déjà en 404, `origin/main` en avance d'une vignette) ; `DESIGN.md` et `PLAN-MIGRATION.md` ; contrôles liens et Playwright.
- 2026-11-06 (phase 9 élargie) : skills vérifiés (`find-animation-opportunities` et `animate` disponibles ; `review-animations` **absent**, revue faite avec la grille d'`animate`) ; opportunités et rejets consignés ; laboratoire avec six expériences (une composée, réalisation qui devient la page, annotations vivantes, parallaxe à trois intensités, frise et trait de lecture) ; piège corrigé (`overflow: hidden` fige `animation-timeline: view()`, d'où `overflow: clip`) ; mesures : aucune image lente (téléphone ×4), CLS ≤ 0,009, mouvement réduit et clavier conformes ; `DESIGN.md` § 11 et plan par lots.
- 2026-11-06 (phase 10) : instantané `v2bis-phase9/` ; audit à quatre largeurs (tablette, saut au chargement, masque des lignes, aperçu) ; Citelum retiré, frise de 2020 à 2027 ; mouvement définitif dans V2bis ; polices de secours mesurées ; revue ; tests Playwright, liens et mesures ; `DESIGN.md` § 7 définitif ; plan, lot 6.
- 2026-11-06 (phase 11) : étiquette `site-avant-refonte` ; branche `site-definitif` dans `_site-definitif/` ; lots 1 à 6 (`2960505` à `dfe6228`) ; brouillon de CV ; `PUBLICATION.md` ; vérification complète du site définitif.
- 2026-11-06 (après phase 11) : `dd3d1c0` publié sur `main` (accent, `alt`, titre du rapport) ; `site-definitif` fusionnée avec `main` et sauvegardée sur GitHub ; engagements Club Animé et Nadeshicon fusionnés en une entrée discrète.

## Prochaines étapes

1. Léo valide `DESIGN.md` et `PLAN-MIGRATION.md` (ou les amende) et tranche les décisions ouvertes.
2. Selon son accord : correctif de confidentialité sur `main`, puis étapes 0 à 6 du plan, une à la fois, chacune vérifiée et validée.
3. Publication par Léo (fusion dans `main`), puis contrôle en ligne.
