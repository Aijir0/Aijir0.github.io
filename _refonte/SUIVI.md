# Refonte visuelle — fichier de suivi

À lire en premier au début de chaque session. Le dossier `_refonte/` n'est pas publié (Jekyll ignore les dossiers en `_`).

## Méthode convenue

- Une phase à la fois ; rien ne passe à la phase suivante sans validation de Léo.
- Pas de changement d'identité, d'architecture ou de composant majeur sans présentation préalable.
- Point de restauration Git avant chaque changement majeur ; l'ancien site reste en ligne jusqu'à validation finale.
- Vérification Playwright (desktop 1440 × 900, mobile 390 × 844) avant de déclarer une étape terminée.
- Skills : Taste Skill = direction artistique ; `animate` / `find-animation-opportunities` = motion (phase motion seulement) ; Playwright = vérification. Pas de consultation redondante.

## Décisions validées

| Date | Décision |
| --- | --- |
| 2026-11-05 | Archive visuelle de l'existant : `_archive-visuelle/2026-11-05_avant-refonte/` (39 captures + diagnostic dans la conversation). |
| 2026-11-05 | Direction retenue : **A — « Note de breffage »**, interprétation contemporaine et chaleureuse, jamais une imitation d'administration. |
| 2026-11-05 | Vocation : site professionnel (lien du CV), public = recruteurs, employeurs, collaborateurs. |
| 2026-11-05 | Les réalisations interactives (Artéfacts 2050, PacQC, Scene Pixel Art) sont des réalisations à part entière, pas des annexes. |
| 2026-11-05 | **Atlas** (globe 3D, Three.js) = projet distinct futur, à ne pas développer maintenant ; prévoir son point d'entrée. |
| 2026-11-05 | Branche de travail : `refonte-visuelle-2026`. |

## Arbitrages entre skills et demande (la demande de Léo prime)

- Taste Skill interdit les légendes d'images → **conservées** : la figure légendée fait partie de la grammaire éditoriale.
- Taste Skill interdit les révélations au défilement sur un site non technique → **autorisées mais rationnées** : une fois, au plus une par écran, utiles à la lecture, absentes sous `prefers-reduced-motion`.
- « Une section par écran » → appliqué au premier écran seulement ; le reste suit un rythme de lecture éditorial.

## Proposition en attente de validation (phase 1)

Résumé de la proposition du 2026-11-05 (détail dans la conversation) :

- **Concept** : « la publication vivante » — le site emprunte la *grammaire* des publications de recherche (numérotation, figures, notes, sources, date de mise à jour), pas leur *costume* (aucun emblème, bleu gouvernemental ou bandeau officiel ; mention de non-affiliation au colophon).
- **Palette** : papier `#F5F2EA`, encre `#1A1C1A`, vert `#1E4636`, rouge annotation `#A63D2A`, filet `#D9D3C4`.
- **Typo** : Newsreader (titres et lecture) + sans-serif à choisir (Public Sans ou Atkinson Hyperlegible Next) + une mono discrète pour les métadonnées.
- **Architecture** : `/` (la note) · `/travaux/` + `/travaux/<projet>/` (fiches) · `/parcours/` (CV web + PDF) · contact en fin de page · `/atlas/` réservé (« Hors-série »). URL existantes des jeux conservées.
- **Signatures candidates** : sommaire vivant, notes en marge reliées, stylo rouge, figures qui deviennent pages (View Transitions), lecture en 30 s / 3 min, version imprimable.
- **Variantes d'accueil à prototyper** : V1 « Couverture », V2 « La Une », V3 « Note annotée ».

## Décisions ouvertes

Voir la liste numérotée de la proposition ; à reporter ici une fois tranchées.

## Prochaines étapes

1. Léo valide ou ajuste la proposition de phase 1 et répond aux décisions ouvertes.
2. Phase 2 : prototypes statiques des 3 variantes d'accueil dans `_refonte/prototypes/`, contenu réel, vérifiés avec Playwright.
3. Phase 3 : `DESIGN.md` (tokens, composants, règles de motion) à partir de la variante retenue.
4. Phases suivantes : accueil → fiches travaux → parcours/CV → intégration de l'espace jeux → contrôle qualité → bascule.
