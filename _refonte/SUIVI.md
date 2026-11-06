# Refonte visuelle — fichier de suivi

À lire en premier au début de chaque session (il tient lieu de `REFONTE_SUIVI.md`). Le dossier `_refonte/` n'est pas publié : Jekyll ignore les dossiers en `_`.

## Où en est-on (6 novembre 2026)

**Phase 2 terminée : trois prototypes d'accueil prêts, testés, en attente du choix de Léo.**
Ouvrir le comparatif : lancer `scripts/preview-games.ps1 -Port 8765`, puis http://127.0.0.1:8765/_refonte/prototypes/

Aucun fichier du site principal n'a été modifié. Rien n'a été poussé ni publié.

## Méthode convenue

- Une phase à la fois ; rien ne passe à la phase suivante sans validation de Léo.
- Pas de changement d'identité, d'architecture ou de composant majeur sans présentation préalable.
- Point de restauration Git avant chaque changement majeur ; l'ancien site reste en ligne jusqu'à validation finale.
- Vérification Playwright (desktop 1440 × 900, mobile 390 × 844) avant de déclarer une étape terminée.
- Skills : Taste Skill = direction artistique ; `animate` = motion ; Playwright = vérification. Pas de consultation redondante.

## Décisions validées

| Date | Décision |
| --- | --- |
| 2026-11-05 | Archive visuelle de l'existant : `_archive-visuelle/2026-11-05_avant-refonte/` (39 captures). |
| 2026-11-05 | Direction retenue : **A — « Note de breffage »**, interprétation contemporaine et chaleureuse, jamais une imitation d'administration. |
| 2026-11-05 | Vocation : site professionnel (lien du CV) ; public = recruteurs, employeurs, collaborateurs. |
| 2026-11-05 | Les réalisations interactives sont des réalisations à part entière, pas des annexes. |
| 2026-11-05 | **Atlas** (globe 3D) = futur projet distinct, « Hors-série » ; ne pas développer maintenant. |
| 2026-11-05 | Branche de travail : `refonte-visuelle-2026` (sauvegarde de départ : `9a3e4b7`). |
| 2026-11-06 | Validé provisoirement : concept « publication vivante », 4 signatures, 3 variantes, Atkinson Hyperlegible Next pour l'interface. |
| 2026-11-06 | Reportés : version anglaise, mode sombre. |
| 2026-11-06 | Espace jeux intégré à « Travaux », sans supprimer les anciennes URL. |

## Système commun des prototypes

- **Palette** : papier `#F5F2EA`, papier-2 `#ECE7DA`, encre `#1A1C1A`, encre-2 `#4A4A44`, vert `#1E4636` (structure), rouge `#A63D2A` (annotations uniquement), filet `#D9D3C4`. Tous les couples de texte passent l'AA (5,65 à 15,3).
- **Polices** (Google Fonts) : Newsreader (titres et lecture), Atkinson Hyperlegible Next (interface), Atkinson Hyperlegible Mono (dates, cotes).
- **Mouvement** : courbes `--ease-out` (0.23, 1, 0.32, 1) et `--ease-in-out` (0.77, 0, 0.175, 1) ; survols de 150 à 250 ms ; tracés et titres de 800 à 1100 ms, une seule fois ; `prefers-reduced-motion` = états finaux immédiats, View Transitions coupées.
- **Signatures** (`commun/base.css` + `commun/signatures.js`) :
  1. stylo rouge ;
  2. notes en marge reliées par un fil (dans la gouttière) ;
  3. sommaire vivant, avec barre de lecture et tiroir `<dialog>` sur mobile ;
  4. la figure devient la page (View Transitions entre documents, fiche Artéfacts 2050).
- **Extras par variante** :
  - V1 : bascule de lecture « 30 s / 3 min ».
  - V2 : figure annotée (graphique R), frise du parcours à l'échelle, index des travaux avec aperçu.
  - V3 : en-tête de note de service, renvois qui éclairent le titre visé, lexique, CV en « pièce jointe ».

## Arbitrages entre skills et demande (la demande de Léo prime)

- Taste Skill interdit les légendes d'images → **conservées** (grammaire éditoriale).
- Taste Skill interdit les révélations au défilement sur un site non technique → **autorisées mais rationnées** : une fois, au plus une par écran, absentes sous mouvement réduit.
- « Une section par écran » → appliqué au premier écran seulement.
- Ses scripts (tirage aléatoire de palette, vérificateurs) ne sont pas utilisés : ils contrediraient la palette validée et signaleraient comme fautes les choix éditoriaux ci-dessus. Vérification faite avec nos propres scripts Playwright.

## Fichiers

```
_refonte/prototypes/index.html          Comparatif (vignettes, tableau, recommandation)
_refonte/prototypes/v1-couverture/      V1 « Couverture »
_refonte/prototypes/v2-la-une/          V2 « La Une »
_refonte/prototypes/v3-note-annotee/    V3 « Note annotée »
_refonte/prototypes/fiche/              Fiche Artéfacts 2050 (commune)
_refonte/prototypes/commun/             base.css (tokens + signatures), signatures.js
_refonte/prototypes/medias/             Copies JPEG légères (pixel-art, PacQC, Artéfacts)
_refonte/prototypes/captures/           Captures par page + rapport-verification.json + controles/
_refonte/outils/verifier-prototypes.mjs       Captures et mesures (desktop, mobile, mouvement réduit)
_refonte/outils/controles-complementaires.mjs Contrastes, poids, CLS, transition, clavier, tiroir
```

**Relancer les vérifications.** Il faut le serveur sur le port 8765 et Microsoft Edge installé (Chrome est absent de cette machine). Il faut aussi le paquet `playwright`, installé hors du dépôt, sans navigateur : `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright@1.48.2` dans un dossier temporaire. Puis :
`PW=<ce dossier>/node_modules/playwright node _refonte/outils/verifier-prototypes.mjs`

## Vérifications effectuées (6 novembre 2026)

- 3 variantes + fiche + comparatif, en desktop et en mobile : aucune erreur console, aucun défilement horizontal, les trois polices chargées.
- Captures : premier écran, section par section, page complète, mouvement réduit, note reliée, tiroir mobile, lecture 30 s.
- Décalage de mise en page (CLS) entre 0 et 0,011 ; premier affichage principal (LCP) inférieur à 320 ms en local ; 630 à 680 Ko par page.
- La transition de figure a été capturée en cours (V2 → fiche), et le retour ramène à la variante d'origine.
- Clavier : le lien d'évitement passe en premier, l'anneau de focus est visible, et le focus sur un appel de note relie la note.
- Tiroir mobile : le focus est piégé dedans, Échap ferme le tiroir et rend le focus au bouton, un lien mène à la section.

**Non vérifié** : Safari, Firefox (pas de View Transitions entre documents : la navigation reste normale), lecteur d'écran réel, appareil tactile réel, réseau lent.

## Contenus manquants (signalés « À compléter » ou « à valider » dans les prototypes)

- Accroche de positionnement (proposée : « Comprendre l'action publique, et la rendre lisible. »).
- Année d'arrivée au Québec et année de début du baccalauréat.
- Niveau en allemand (cité sur l'ancien site, absent du CV).
- Fiche Artéfacts 2050 : rôle, outils, démarche, résultat, question (formulation proposée).
- Ce qu'il est permis de dire du poste au Ministère : seules les formulations du CV ont été reprises.
- L'adresse et le téléphone du CV LaTeX n'ont volontairement pas été repris.

## Décisions ouvertes (à trancher par Léo)

1. Quelle composition retenir : V1, V2 ou V3 (recommandation : V2, allégée de « Vol. 1 · N° 1 », avec la bascule 30 s de V1 et l'en-tête Objet / Date de V3 pour les fiches).
2. Les signatures à garder, et les extras à conserver (frise, figure annotée, index avec aperçu, bascule 30 s, lexique).
3. L'accroche définitive.
4. La place de PacQC sur un site de recrutement (il montre le visage d'une tierce personne : vérifier son accord).

## Journal

- 2026-11-05 : archive visuelle, diagnostic, 3 directions, choix de la direction A, proposition de phase 1.
- 2026-11-06 : commits `0293cba` (socle + V1) et `3174285` (V2, V3, fiche, outils) ; comparatif, contrôles complémentaires, ce suivi (commit final de la session).

## Prochaines étapes

1. Léo compare les variantes et tranche les décisions ouvertes.
2. Phase 3 : `DESIGN.md` (tokens, composants, règles de motion) à partir de la variante retenue ; collecte des contenus manquants.
3. Puis : accueil définitif → fiches des travaux → parcours et CV → intégration de l'espace jeux → contrôle qualité → bascule du site.
