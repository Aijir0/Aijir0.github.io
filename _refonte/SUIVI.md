# Refonte visuelle — fichier de suivi

À lire en premier au début de chaque session (il tient lieu de `REFONTE_SUIVI.md`). Le dossier `_refonte/` n'est pas publié : Jekyll ignore les dossiers en `_`.

## Où en est-on (6 novembre 2026, fin de phase 5)

**Phase 5 terminée : V2bis créée, V1 et V2 corrigées sur les faits, pistes visuelles des projets proposées. En attente du choix de Léo.**
Ouvrir le comparatif : lancer `scripts/preview-games.ps1 -Port 8765`, puis http://127.0.0.1:8765/_refonte/prototypes/
Pistes des projets : http://127.0.0.1:8765/_refonte/prototypes/pistes-visuels.html

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
- **Nouveau** : signature avec portrait rond (byline) ; frise en deux registres (expérience, formation) avec un repère « Novembre 2026 » (desktop seulement) ; ligne « Hors champ » (natation, poésie).
- **Vignettes des travaux** : même cadre pour toutes (proportion 40/21, filet, légende en italique) ; chaque visuel garde sa propre identité.

## Arbitrages entre skills et demande (la demande de Léo prime)

- Taste Skill interdit les légendes d'images → **conservées** (grammaire éditoriale), mais rédigées en italique de lecture.
- Taste Skill interdit les révélations au défilement sur un site non technique → **autorisées mais rationnées** : une fois, au plus une par écran, absentes sous mouvement réduit.
- « Une section par écran » → appliqué au premier écran seulement.
- Ses scripts (tirage aléatoire de palette, vérificateurs) ne sont pas utilisés : ils contrediraient la palette validée et signaleraient comme fautes les choix éditoriaux ci-dessus.

## Pistes visuelles des projets (`pistes-visuels.html`, images dans `medias/pistes/`)

Fabriquées à partir des ressources réelles des jeux ; aucun original modifié, aucun logo remplacé.
- **PacQC** : A plan de carte ; B les quatre fantômes et le logo d'origine ; **C les trois cartes en plan (recommandée)**. Le joueur (visage d'une tierce personne) est masqué dans toutes les pistes. B est déconseillée devant un employeur public : sigles administratifs et logo Teams (marque déposée).
- **Scène Pixel Art** : **A détail du pavillon Charles-De Koninck agrandi ×2 (recommandée)** ; B la place avec le personnage ; C cartouche-titre en lettres pixel (Silkscreen), utilisable comme logo sur la page du jeu.
- V2bis utilise PacQC C et Scène A à titre d'essai, signalées « Visuel en piste, à valider ».

## Fichiers

```
_refonte/prototypes/index.html            Comparatif V2bis, V2, V1 (+ V3 en référence), critique des détails
_refonte/prototypes/pistes-visuels.html   Pistes visuelles PacQC et Scène Pixel Art
_refonte/prototypes/v2bis/                V2bis : index.html, artefacts-2050.html, v2bis.css
_refonte/prototypes/v1-couverture/        V1 « Couverture » (faits corrigés en phase 5)
_refonte/prototypes/v2-la-une/            V2 « La Une » (faits corrigés, vignettes miniatures corrigées en phase 5)
_refonte/prototypes/v3-note-annotee/      V3 « Note annotée » (référence, inchangée : faits non mis à jour)
_refonte/prototypes/fiche/                Fiche Artéfacts 2050 commune à V1, V2, V3
_refonte/prototypes/commun/               base.css, signatures.js (préfixe de la barre mobile réglable : data-prefixe)
_refonte/prototypes/medias/               Copies JPEG légères ; medias/pistes/ = visuels-pistes
_refonte/prototypes/captures/             Captures par page + rapport-verification.json + controles/
_refonte/outils/verifier-prototypes.mjs       Captures et mesures (pages : v1 v2 v3 v2bis fiche fiche-v2bis comparatif pistes)
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
- Ministère : dates du stage, date de début et intitulé du poste actuel.
- MBA en analytique d'affaires : établissement et date de début.
- Club Animé Québec : date de fin de la fonction de secrétaire.
- Maîtrise : mois de début en 2024 (la frise place le début au printemps, à titre indicatif).
- Année d'arrivée au Québec (note de V1).
- Niveau en allemand (cité sur l'ancien site, absent du CV).
- Fiche Artéfacts 2050 : rôle, outils, démarche, résultat, question (formulation proposée).
- L'adresse et le téléphone du CV LaTeX n'ont volontairement pas été repris.
- Le CV PDF lui-même n'a pas été mis à jour (hors périmètre).

## Décisions ouvertes (à trancher par Léo)

1. Composition à retenir : V2bis (recommandée), V2 ou V1.
2. Règles typographiques de V2bis (deux polices, chiffres en Newsreader, plus de chasse fixe) : à généraliser ou non.
3. L'accroche définitive.
4. Pistes visuelles : PacQC (A, B ou C) et Scène Pixel Art (A, B ou C) ; adoption du cartouche-titre comme logo de la Scène ; orthographe du nom (« Scène » avec accent).
5. La place de PacQC sur un site de recrutement (visage d'une tierce personne, sigles administratifs).
6. Mettre à jour V3 sur les faits, ou la laisser comme simple référence.

## Journal

- 2026-11-05 : archive visuelle, diagnostic, 3 directions, choix de la direction A, proposition de phase 1.
- 2026-11-06 : commits `0293cba` (socle + V1) et `3174285` (V2, V3, fiche, outils) ; comparatif, contrôles complémentaires, ce suivi (`09fd5a3`).
- 2026-11-06 (phase 5) : faits corrigés dans V1 et V2 ; critique visuelle ; V2bis et sa fiche ; pistes visuelles PacQC et Scène ; comparatif refait ; vérifications Playwright.

## Prochaines étapes

1. Léo compare V2bis, V2 et V1, et tranche les décisions ouvertes ; il fournit les informations manquantes.
2. Phase suivante : finaliser la direction artistique avec Léo, puis rédiger `DESIGN.md` (tokens, typographie, composants, règles de motion) à partir de la version retenue.
3. Puis : accueil définitif → fiches des travaux → parcours et CV → intégration de l'espace jeux → contrôle qualité → bascule du site.
