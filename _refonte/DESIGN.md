# DESIGN.md — « Note de breffage, publication vivante »

Référence de design du site professionnel de Léo Matrat (leomatrat.com).
Statut : **proposé pour validation (phase 9, 6 novembre 2026)**. Source : prototype validé `_refonte/prototypes/v2bis/` (phases 5 à 9).
Emplacement : ce fichier sera déplacé à la racine du dépôt à l'étape 0 de la migration, puis exclu de la publication (voir `_refonte/PLAN-MIGRATION.md`).

Ce document décrit ce qui est **validé**. Pour une règle qui n'y figure pas, imiter le composant validé le plus proche plutôt qu'en inventer un nouveau.

---

## 1. Philosophie

Le site se lit comme une **note de breffage sur une personne** : les faits d'abord, les sources visibles, l'essentiel souligné à la main. C'est une interprétation contemporaine et chaleureuse d'un document de travail, jamais une imitation d'administration (ni sceau, ni sigle, ni gabarit gouvernemental).

Principes :
1. **La preuve avant la promesse.** Chaque compétence renvoie à l'endroit où la voir ; chaque projet dit ce qu'il est, sans résultat ni rôle non établis.
2. **Une voix par rôle.** Une police pour lire, une police pour manipuler (§ 3).
3. **L'annotation est le seul ornement.** Le rouge, le trait manuscrit, les appels de note et les filets suffisent. Pas de dégradés, d'ombres décoratives, de cartes empilées ni d'icônes d'ambiance.
4. **Publication vivante.** Le mouvement sert la lecture (repérage, lien entre une note et sa source, continuité d'une figure à sa page) et s'efface ensuite.
5. **Les réalisations sont des œuvres.** Jeux, analyse et présentation sont traités comme des pièces publiées : titre, année, nature, vignette, fiche.

Public visé : recruteurs, employeurs, collaborateurs. Ils doivent comprendre en 30 secondes qui est Léo, ce qu'il fait et où le voir, sur ordinateur comme sur téléphone.

## 2. Couleurs

| Jeton | Valeur | Rôle |
| --- | --- | --- |
| `--papier` | `#F5F2EA` | Fond de page. |
| `--papier-2` | `#ECE7DA` | Fond des cadres, encarts, blocs de recommandation. |
| `--encre` | `#1A1C1A` | Texte principal, filets de section, bouton principal. |
| `--encre-2` | `#4A4A44` | Texte secondaire : chapeaux, libellés, légendes, années. |
| `--vert` | `#1E4636` | **Structure et état** : seconde ligne de l'accroche, rubriques, lien survolé, jauge du sommaire, barres de la frise, sélection. |
| `--rouge` | `#A63D2A` | **Annotation uniquement** : trait de stylo, appels et fils de notes, repères sur une figure, contour de focus, mentions « à compléter ». |
| `--filet` | `#D9D3C4` | Séparateurs fins, contours des cadres. |

Règles :
- Tous les couples texte/fond passent le niveau AA (de 5,65:1 à 15,3:1). Toute nouvelle couleur doit être mesurée.
- Le rouge ne sert jamais de fond large, de titre ou de bouton. S'il apparaît ailleurs qu'en annotation, c'est une erreur.
- Une information n'est jamais portée par la seule couleur (la frise a une légende en texte, les statuts ont un libellé).
- Les visuels de jeux gardent leurs propres palettes **à l'intérieur de leur cadre** (PacQC : nuit `#101419`, vert anis `#D9FB81` ; Scène : palette pixel). Elles ne débordent jamais sur l'interface.
- Pas de mode sombre pour l'instant (reporté). Le jeton `--vert-clair` du socle n'est pas utilisé : il sera retiré.

## 3. Typographie

Deux familles, chargées depuis Google Fonts :

| Famille | Rôle | Exemples |
| --- | --- | --- |
| **Newsreader** (variable, `opsz` 6–72) | Tout ce qui **se lit** | Nom, titres, accroche, texte courant, chapeaux, légendes (italique), dates, **tous les chiffres**, titres d'œuvres. |
| **Atkinson Hyperlegible Next** | Tout ce qui **se manipule ou s'étiquette** | Navigation, boutons, liens d'action, rubriques, libellés de fiche (`dt`), notes de lecture, métadonnées. |

Règles :
- Atkinson Hyperlegible Next s'emploie **en bas de casse**, sans capitales espacées ni petites capitales décoratives.
- **Pas de chasse fixe**, sauf pour un vrai extrait de code (police système `ui-monospace`).
- **Les chiffres s'écrivent en Newsreader** (`lining-nums tabular-nums` pour les dates alignées). Le zéro barré d'Atkinson donnerait aux dates un air de terminal.
- Titres : `text-wrap: balance`. Paragraphes : `text-wrap: pretty`.
- Typographie française : espace insécable avant `: ; ? !` et à l'intérieur des guillemets « », tiret demi-cadratin pour les intervalles (2020 – 2024). À généraliser lors de la migration.

Échelle (valeurs validées) :

| Élément | Taille | Interligne, graisse |
| --- | --- | --- |
| Nom (titre de revue) | `clamp(3.4rem, 8.2vw, 7.75rem)`, 17vw sous 640 px | .92, 400, approche −0,035em |
| Accroche | `clamp(2.1rem, 3.2vw, 3.05rem)`, 2.15rem sous 640 px | 1.06, 400 ; seconde ligne en italique vert |
| Titre de section (h2) | `clamp(2.2rem, 3.3vw, 3rem)` | 1.08, 400 |
| Titre de la une | `clamp(1.9rem, 2.5vw, 2.5rem)` | 1.08 |
| Titre de fiche (h1) | `clamp(3rem, 7vw, 5.25rem)` | 400, approche −0,035em |
| Titre d'un travail (index) | `clamp(1.4rem, 1.9vw, 1.7rem)` | 1.15 |
| Texte courant | 1.1875rem | 1.55 |
| Chapeau | `clamp(1.25rem, 1.6vw, 1.45rem)` | 1.45, `--encre-2` |
| Chapeau de section | 1.25rem italique | 1.4, `--encre-2` |
| Légende (figcaption) | .95rem italique | 1.45 |
| Interface (navigation, boutons) | .9375rem | 500–600 |
| Rubrique, libellé | .8125rem | 600 (rubrique, vert) ou 500 (libellé, `--encre-2`) |

## 4. Grille, espacements, composition

- **Page** : largeur maximale `86rem`, gouttière `clamp(1rem, 4vw, 3rem)`.
- **Axe 5/7** (`--axe-grille: minmax(0,5fr) minmax(0,7fr)`, écart `clamp(2.5rem, 5vw, 4.5rem)`). Il structure la une (présentation / travail phare), l'en-tête de chaque section (titre / chapeau), l'index des travaux (liste / aperçu). Une nouvelle section reprend cet axe.
- Autres découpes validées : figure annotée 8/4 ; frise avec une colonne d'intitulés de `22rem`.
- **Rythme vertical** : section = filet `1px --encre` en tête, puis titre et chapeau, `2.5rem` avant le contenu ; `6.5rem` entre sections (`4.5rem` en étroit). À l'intérieur, séparation par filets `--filet`, pas par des boîtes.
- **Hiérarchie** : un seul `h1` par page (le nom ou le titre de la fiche) ; sections en `h2` ; une seule accroche ; un seul travail « à la une ».
- **Seuils** : `1100px` (large ou étroit : marge des notes, manchette, aperçu) et `640px` (téléphone). Pas de troisième seuil sans besoin démontré sur capture.
- La règle « une section par écran » de Taste Skill ne s'applique qu'au premier écran.

## 5. Composants éditoriaux

| Composant | Rôle | Règles clés |
| --- | --- | --- |
| **En-tête** (`.tete`) | Nom en titre de revue, annonce du hors-série Atlas à droite | L'annonce reste discrète (globe de 4,25rem, une ligne) et mène à la fiche Atlas. |
| **Manchette** (`.manchette`) | Sommaire collant, en bas de casse, lien « CV en PDF » | Section courante marquée (`aria-current`) et jauge de lecture verte. Masquée en étroit. |
| **Barre de lecture et tiroir** | Navigation en étroit | Barre fixe en bas : section courante, progression rouge de 2px, lien CV. Le sommaire s'ouvre dans un `<dialog>`. |
| **Accroche** (`.manifeste`) | Positionnement | Deux lignes : romain, puis italique vert ; **un seul** trait de stylo. Texte validé : « Éclairer les décisions publiques / *par la recherche, la prospective et les données.* » |
| **Fiche signalétique** (`.identite`) | Qui, où, quoi | Portrait 4:5 à gauche et liste `dl` (En poste, En formation, Diplômé, Langues). En téléphone, libellé au-dessus de la valeur. |
| **À la une** (`.a-la-une`) | Un travail phare | Figure cliquable qui devient la fiche (transition de vue) ; rubrique, titre, chapeau, deux liens. |
| **Index des travaux et aperçu** | Toutes les réalisations | Ligne = titre, année ou statut (« En chantier », « À venir »), nature en une ligne. En large, l'aperçu suit le survol et le focus ; en étroit, la vignette s'insère sous chaque ligne. Vignettes au format 40:21. |
| **Figure annotée** | Lire un graphique | Appels numérotés posés sur la figure, notes de lecture à droite (8/4), tracé rouge de la tendance. |
| **Frise** | Parcours | Deux registres (Expérience, Formation) sur une même échelle. Barre pleine : période ; flèche : en cours ; pointillé : dates non précisées ; gris : engagement associatif ou bénévole. Légende en texte obligatoire. |
| **Tableau des preuves** | Compétences | Domaine, pratique, « où la voir » (liens vers les preuves). Devient une liste de fiches sous 640 px. |
| **Contact** | Agir | Courriel en très grand, sans coupure ; CV, LinkedIn, GitHub. |
| **Fiche de réalisation** | Page d'un travail | Retour, rubrique, `h1`, sous-titre italique, chapeau, figure, mémo `dl` (Objet, Date, Cadre, Outils, Rôle…), sections, accès. |
| **Boutons et liens** | Actions | `.bouton` : encre, coins de 2px, un seul bouton principal par zone. `.lien` : soulignement qui se trace au survol, flèche qui glisse de 3px. |
| **Notes en marge reliées** | Précisions | Appel en exposant ; en large, la note flotte dans la marge avec un fil rouge au survol ou au focus ; en étroit, elle s'ouvre dans le texte. |
| **Colophon** | Mentions | Polices, mention « site personnel ». |

Mentions de travail (`.a-completer`, `.a-valider`, `.proto-note`, `.piste-visuel`) : **réservées aux prototypes**. Aucune ne doit subsister dans le site publié (contrôle automatique à l'étape 6).

## 6. Photographies, figures et illustrations

- **Cadre commun** : fond `--papier-2`, contour `1px --filet`, aucun arrondi ni ombre. Légende en Newsreader italique sous la figure. Les légendes sont conservées volontairement (écart assumé avec Taste Skill).
- **Photographies** : réelles, en couleur naturelle, sans filtre. Le portrait professionnel est recadré en 4:5 depuis `images/port1.jpg`, avec un texte alternatif. Aucun visage généré, aucun visage de tiers sans accord.
- **Documents et graphiques** (`.cadre.document`) : graphique d'origine en niveaux de gris, fondu dans le papier (`multiply`). Les repères ajoutés sont rouges.
- **Visuels de jeux** : pixel art à l'échelle entière (aucun pixel étiré), grille constante dans une image, palette propre au jeu. Sources dans `_refonte/outils/visuels-phase7.mjs`. Jamais de visage de collègue, de sigle administratif ni de logo tiers (Teams…).
- **Illustration** : uniquement si elle porte une information. Exemple validé : le globe d'Atlas, avec côtes réelles (Natural Earth), un seul repère, rien d'inventé.
- **Formats** : JPEG pour les photos et captures, PNG pour le pixel art, SVG pour le vectoriel. Largeur maximale 1600px. Attributs `width` et `height` toujours présents. `loading="lazy"` partout sauf au premier écran.

## 7. Mouvement

Le mouvement a un rôle nommé, sinon il n'existe pas. Outils : CSS d'abord, JavaScript natif si nécessaire. Aucune bibliothèque d'animation.

| Mouvement | Rôle | Valeurs |
| --- | --- | --- |
| Lignes du nom et de l'accroche qui montent | Entrée, une fois par chargement | 900ms, `--ease-out`, décalage de 90ms par ligne |
| Apparition des blocs de la une | Entrée | 600ms, `--ease-out`, translation de 8px |
| Trait de stylo sous un mot | Explication, une fois | 800ms, `--ease-in-out` |
| Tracés (tendance, barres de la frise) | Explication, à l'entrée dans l'écran, une fois | 900 à 1100ms, `--ease-in-out` |
| Survols : lien, couleur, flèche, zoom d'image de 1,025 | Retour d'action | 150 à 250ms (400ms pour le zoom), uniquement sur un pointeur fin |
| Aperçu de l'index | Changement d'état | Fondu de 220ms |
| Fil d'une note | Relation | 260ms |
| Tiroir mobile | Spatial | 380ms, `--ease-drawer` |
| La figure devient la page (View Transitions entre documents) | Continuité spatiale | 450ms, `--ease-in-out` ; page racine 250ms |

Courbes : `--ease-out` `cubic-bezier(.23,1,.32,1)`, `--ease-in-out` `cubic-bezier(.77,0,.175,1)`, `--ease-drawer` `cubic-bezier(.32,.72,0,1)`. Jamais d'`ease-in` sur l'interface.

Règles :
- Seuls `transform` et `opacity` s'animent, plus `background-size` pour les soulignements.
- Rien n'est lié au défilement, sauf la jauge du sommaire et la barre de progression (état, pas décor).
- Aucune boucle automatique. Les révélations au défilement sont rationnées : une par écran au plus, une seule fois.
- Une interaction fréquente reste sous 250ms. Ce qui est déclenché à répétition passe par des transitions (interruptibles), pas par des animations à étapes.
- **Mouvement réduit** (`prefers-reduced-motion: reduce`) : états finaux immédiats ; seuls des fondus d'opacité de 200ms subsistent ; View Transitions désactivées ; défilement non lissé. Rien ne reste caché.

## 8. Adaptation aux écrans

- **Large (≥ 1100px)** : axe 5/7, manchette collante, aperçu de l'index, notes en marge.
- **Étroit (< 1100px)** : une colonne ; la manchette laisse place à la barre de lecture et au tiroir ; vignettes insérées dans l'index ; notes ouvertes dans le texte ; frise sur une colonne.
- **Téléphone (≤ 640px)** : boutons pleine largeur, tableau des preuves en fiches, une année sur deux sur l'axe de la frise, libellés de fiche au-dessus des valeurs.
- Le premier écran mobile montre le nom, l'annonce Atlas en une ligne, l'accroche et le début de la fiche signalétique. Le CV reste accessible dans la barre de lecture.
- Aucun défilement horizontal. Cibles tactiles d'au moins 44px. Le courriel ne se coupe jamais au milieu.
- Largeurs à vérifier : 1440, 1024, 768 et 390px.

## 9. Accessibilité

- `lang="fr-CA"`, lien d'évitement, repères (`header`, `nav`, `main`, `footer`), un `h1` par page, titres dans l'ordre.
- Focus visible : contour rouge de 2px, décalé de 3px. Tout ce qui réagit au survol réagit aussi au focus (aperçu de l'index, notes reliées).
- Sommaire : `aria-current` sur la section courante. Tiroir : `<dialog>` modal, focus piégé, Échap ferme et rend le focus.
- Appels de note : vrais `<button>` avec `aria-controls` et `aria-expanded`.
- Textes alternatifs : descriptifs pour les images porteuses d'information, vides (`alt=""`) pour les vignettes doublées par un titre. Les SVG décoratifs portent `aria-hidden`.
- Contrastes AA mesurés (§ 2). Le site s'imprime proprement (styles d'impression : notes dépliées, adresses des liens).
- Mouvement réduit : voir § 7.

## 10. Gouvernance du design

Ordre d'autorité :
1. La demande explicite de Léo.
2. Le contenu et les fonctionnalités existants.
3. Ce `DESIGN.md`.
4. La direction artistique de la tâche en cours.
5. Les recommandations des skills.

Rôles des outils :
- **Taste Skill** : seule référence de direction artistique (jugement, critique, finitions). Ses règles générales cèdent devant les choix validés ici. Écarts assumés : légendes conservées, révélations rationnées, une section par écran au premier écran seulement, ses scripts de tirage et de vérification non utilisés.
- **Skills d'animation** (`animate`, `review-animations`…) : consultés pour une question de mouvement précise. Ils appliquent le § 7.
- **Playwright** : vérification du rendu réel (1440 et 390px au minimum, mouvement réduit compris). Rien n'est déclaré vérifié sans capture examinée.
- **UI UX Pro Max** et **Impeccable** : références et audit, sans autorité sur la direction.
- Un seul système de design : pas de bibliothèque de composants, de framework CSS ni de seconde palette.

Proposer une amélioration est encouragé, sous conditions :
- Une proposition indique le problème observé, l'idée, le gain attendu, son coût, et sa compatibilité avec ce document.
- Pour une tâche ciblée : au plus deux idées, présentées après le travail demandé.
- **Ne jamais appliquer sans l'accord de Léo** :
  - une nouvelle couleur, police, échelle ou un nouveau seuil ;
  - un nouveau composant ou une bibliothèque ;
  - une animation hors du § 7 ;
  - la modification d'un composant validé.
- Une idée acceptée met à jour ce document, en datant le changement.

## Historique

- 2026-11-06 : première version, tirée de V2bis (phases 5 à 9). À valider.
