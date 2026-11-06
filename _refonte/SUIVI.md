# Refonte visuelle — fichier de suivi

À lire en premier au début de chaque session (il tient lieu de `REFONTE_SUIVI.md`). Le dossier `_refonte/` n'est pas publié : Jekyll ignore les dossiers en `_`.

## Où en est-on (6 novembre 2026, correction des travaux validée)

**Phase 6 terminée ; correction des travaux (ResearchRabbit, retrait de la veille) validée par Léo. Prochaine étape : trancher les décisions ouvertes, puis `DESIGN.md` et la refonte définitive à partir de V2bis.**
Ouvrir le comparatif : lancer `scripts/preview-games.ps1 -Port 8765`, puis http://127.0.0.1:8765/_refonte/prototypes/
Avant / après : `v2bis-phase5/` (instantané de fin de phase 5) contre `v2bis/`.
Visuels des projets : http://127.0.0.1:8765/_refonte/prototypes/pistes-visuels.html

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
_refonte/prototypes/pistes-visuels.html   Pistes visuelles PacQC et Scène Pixel Art
_refonte/prototypes/v2bis/                V2bis : index.html, artefacts-2050.html, researchrabbit.html, v2bis.css (base retenue)
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
_refonte/outils/verifier-prototypes.mjs       Captures et mesures (pages : v1 v2 v3 v2bis fiche fiche-v2bis comparatif pistes)
_refonte/outils/verifier-liens.mjs           Liens et images internes (HTTP 200) et ancres, sur 10 pages
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

1. Visuels : PacQC (1, 2 ou 3) et Scène Pixel Art (1, 2 ou 3) ; ressemblance de l'avatar ; logos des pages de jeux (logotype PacQC, pastille de la Scène).
2. L'annonce Atlas : emplacement (couverture) et texte.
3. Le retrait du portrait : définitif, ou retour discret (contact, fiche) ?
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

## Prochaines étapes

1. Léo compare V2bis, V2 et V1, et tranche les décisions ouvertes ; il fournit les informations manquantes.
2. Phase suivante : finaliser la direction artistique avec Léo, puis rédiger `DESIGN.md` (tokens, typographie, composants, règles de motion) à partir de la version retenue.
3. Puis : accueil définitif → fiches des travaux → parcours et CV → intégration de l'espace jeux → contrôle qualité → bascule du site.
