# DESIGN.md — « Note de breffage, publication vivante »

Référence de design du site professionnel de Léo Matrat (leomatrat.com).
Statut : **en vigueur depuis la mise en ligne de la refonte (phase 11)**. Source : prototype validé `_refonte/prototypes/v2bis/` (phases 5 à 9).

**Lecture.** Les §§ 1 à 10 documentent l'existant **validé**. Depuis la phase 10, le mouvement (§ 7) est définitif : les propositions du laboratoire retenues y sont intégrées, et le § 11 ne garde que ce qui n'a pas été retenu.
Emplacement : racine du dépôt, exclu de la publication par `_config.yml`. Les renvois à `_refonte/…` (prototypes, laboratoire, outils de vérification) désignent la branche de travail locale `refonte-visuelle-2026`, non publiée.

Ce document décrit ce qui est **validé**. Pour une règle qui n'y figure pas, imiter le composant validé le plus proche plutôt qu'en inventer un nouveau.

---

## 1. Philosophie · Validé

Le site se lit comme une **note de breffage sur une personne** : les faits d'abord, les sources visibles, l'essentiel souligné à la main. C'est une interprétation contemporaine et chaleureuse d'un document de travail, jamais une imitation d'administration (ni sceau, ni sigle, ni gabarit gouvernemental).

Principes :
1. **La preuve avant la promesse.** Chaque compétence renvoie à l'endroit où la voir ; chaque projet dit ce qu'il est, sans résultat ni rôle non établis.
2. **Une voix par rôle.** Une police pour lire, une police pour manipuler (§ 3).
3. **L'annotation est le seul ornement.** Le rouge, le trait manuscrit, les appels de note et les filets suffisent. Pas de dégradés, d'ombres décoratives, de cartes empilées ni d'icônes d'ambiance.
4. **Publication vivante.** Le mouvement sert la lecture (repérage, lien entre une note et sa source, continuité d'une figure à sa page) et s'efface ensuite.
5. **Les réalisations sont des œuvres.** Jeux, analyse et présentation sont traités comme des pièces publiées : titre, année, nature, vignette, fiche.

Public visé : recruteurs, employeurs, collaborateurs. Ils doivent comprendre en 30 secondes qui est Léo, ce qu'il fait et où le voir, sur ordinateur comme sur téléphone.

## 2. Couleurs · Validé

| Jeton | Valeur | Rôle |
| --- | --- | --- |
| `--papier` | `#F5F2EA` | Fond de page. |
| `--papier-2` | `#ECE7DA` | Fond des cadres, encarts, blocs de recommandation. |
| `--encre` | `#1A1C1A` | Texte principal, filets de section, bouton principal. |
| `--encre-2` | `#4A4A44` | Texte secondaire : chapeaux, libellés, légendes, années. |
| `--vert` | `#1E4636` | **Structure et état** : seconde ligne de l'accroche, rubriques, lien survolé, jauge du sommaire, barres de la frise, sélection. |
| `--rouge` | `#A63D2A` | **Annotation uniquement** : trait de stylo, appels et fils de notes, repères sur une figure, contour de focus, mentions « à compléter ». |
| `--filet` | `#D9D3C4` | Séparateurs fins, contours des cadres. |
| bleu de Prusse | `#24507A` | **Repères de l'atlas uniquement** : type « j'y ai voyagé » (losange). |
| ocre | `#8A5A0F` | **Repères de l'atlas uniquement** : type « lieu de cœur » (anneau). |

Règles :
- Tous les couples texte/fond passent le niveau AA (de 5,65:1 à 15,3:1). Toute nouvelle couleur doit être mesurée.
- Le rouge ne sert jamais de fond large, de titre ou de bouton. S'il apparaît ailleurs qu'en annotation, c'est une erreur.
- Une information n'est jamais portée par la seule couleur (la frise a une légende en texte, les statuts ont un libellé).
- Les visuels de jeux gardent leurs propres palettes **à l'intérieur de leur cadre** (PacQC : nuit `#101419`, vert anis `#D9FB81` ; Scène : palette pixel). Elles ne débordent jamais sur l'interface.
- Bleu de Prusse et ocre sont réservés aux repères de l'atlas et à leur légende (le type « j'y ai habité » est en encre) : jamais de texte, de fond, de bouton ni de lien dans ces teintes. Leurs valeurs vivent dans `atlas/data/destinations.json`, sans variable CSS. Chaque repère a une forme propre à son type et un liseré papier (6,3:1 contre les terres vertes) ; contrastes contre le papier : 7,5:1 (bleu) et 5,3:1 (ocre). Le rouge n'y sert qu'au cercle de stylo autour du lieu ouvert.
- Pas de mode sombre pour l'instant (reporté). Le jeton `--vert-clair` du socle n'est pas utilisé : il sera retiré.

## 3. Typographie · Validé

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
- **Polices de secours aux métriques mesurées** : `"Newsreader repli"` (Georgia, romain et italique, avec des facteurs distincts) et `"Atkinson repli"` (Arial), réglés par `size-adjust` et `ascent-override`. Le passage aux polices web ne déplace plus le texte (sur téléphone, l'accroche gagnait une ligne, soit 37 px de saut). Toute nouvelle police doit recevoir son repli mesuré.
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

## 4. Grille, espacements, composition · Validé

- **Page** : largeur maximale `86rem`, gouttière `clamp(1rem, 4vw, 3rem)`.
- **Axe 5/7** (`--axe-grille: minmax(0,5fr) minmax(0,7fr)`, écart `clamp(2.5rem, 5vw, 4.5rem)`). Il structure la une (présentation / travail phare), l'en-tête de chaque section (titre / chapeau), l'index des travaux (liste / aperçu). Une nouvelle section reprend cet axe.
- Autres découpes validées : figure annotée 8/4 ; frise avec une colonne d'intitulés de `22rem`.
- **Rythme vertical** : section = filet `1px --encre` en tête, puis titre et chapeau, `2.5rem` avant le contenu ; `6.5rem` entre sections (`4.5rem` en étroit). À l'intérieur, séparation par filets `--filet`, pas par des boîtes.
- **Hiérarchie** : un seul `h1` par page (le nom ou le titre de la fiche) ; sections en `h2` ; une seule accroche ; un seul travail « à la une ».
- **Seuils** : `1100px` (large ou étroit : marge des notes, manchette, aperçu) et `640px` (téléphone). Pas de troisième seuil sans besoin démontré sur capture.
- **Tablette (641 à 1099 px)** : l'axe 5/7 revient dans la une (figure 7, texte 5, côte à côte) et dans chaque ligne de l'index (texte à gauche, vignette de 17rem à droite). Sinon les images passaient en pleine largeur, et la section Travaux mesurait 3 260 px à 1024 px.
- La règle « une section par écran » de Taste Skill ne s'applique qu'au premier écran.

## 5. Composants éditoriaux · Validé

| Composant | Rôle | Règles clés |
| --- | --- | --- |
| **En-tête** (`.tete`) | Nom en titre de revue, annonce du hors-série Atlas à droite | L'annonce reste discrète (globe de 4,25rem, une ligne) et mène à l'atlas (`/atlas/`). |
| **Manchette** (`.manchette`) | Sommaire collant, en bas de casse, liens « Atlas » et « CV en PDF » (le tiroir mobile reprend le lien Atlas) | Section courante marquée (`aria-current`) ; **un seul trait de lecture** vert glisse d'une rubrique à l'autre et s'allonge avec la lecture. Masquée en étroit. |
| **Barre de lecture et tiroir** | Navigation en étroit | Barre fixe en bas : section courante, progression rouge de 2px, lien CV. Le sommaire s'ouvre dans un `<dialog>`. |
| **Accroche** (`.manifeste`) | Positionnement | Deux lignes : romain, puis italique vert ; **un seul** trait de stylo. Texte validé : « Éclairer les décisions publiques / *par la recherche, la prospective et les données.* » |
| **Fiche signalétique** (`.identite`) | Qui, où, quoi | Portrait 4:5 à gauche et liste `dl` (En poste, En formation, Diplômé, Langues). En téléphone, libellé au-dessus de la valeur. |
| **À la une** (`.a-la-une`) | Un travail phare | Figure cliquable qui devient la fiche (transition de vue) ; rubrique, titre, chapeau, deux liens. |
| **Index des travaux et aperçu** | Toutes les réalisations | Ligne = titre, année ou statut (« En chantier », « À venir »), nature en une ligne. En large, l'aperçu suit le survol et le focus ; la nouvelle image se pose sur l'ancienne, et l'ancienne légende disparaît aussitôt. En tablette, la vignette est à droite de la ligne ; sur téléphone, sous la ligne. Vignettes au format 40:21. |
| **Figure annotée** | Lire un graphique | Appels numérotés posés sur la figure, notes de lecture à droite (8/4), tracé rouge de la tendance, **cercle au stylo** autour de la zone que commente chaque note (repassé à l'encre pleine au survol, au focus ou au toucher). La donnée ne bouge jamais. |
| **Frise** | Parcours | Deux registres (Expérience, Formation) sur une même échelle, **de 2020 à 2027** (`--debut`, `--axe`). Barre pleine : période ; flèche : en cours ; pointillé : dates non précisées ; gris : engagement associatif ou bénévole. Repère rouge « aujourd'hui » calculé chaque jour, auquel s'arrêtent les barres en cours. Légende en texte obligatoire. |
| **Tableau des preuves** | Compétences | Domaine, pratique, « où la voir » (liens vers les preuves). Devient une liste de fiches sous 640 px. |
| **Contact** | Agir | Courriel en très grand, sans coupure ; CV, LinkedIn, GitHub. |
| **Fiche de réalisation** | Page d'un travail | Retour, rubrique, `h1`, sous-titre italique, chapeau, figure, mémo `dl` (Objet, Date, Cadre, Outils, Rôle…), sections, accès, puis « Réalisation suivante » (Artéfacts 2050, ResearchRabbit, Atlas, en boucle). |
| **Boutons et liens** | Actions | `.bouton` : encre, coins de 2px, un seul bouton principal par zone. `.lien` : soulignement qui se trace au survol, flèche qui glisse de 3px. |
| **Notes en marge reliées** | Précisions | Appel en exposant ; en large, la note flotte dans la marge avec un fil rouge au survol ou au focus ; en étroit, elle s'ouvre dans le texte. |
| **Colophon** | Mentions | Polices, mention « site personnel ». |

Mentions de travail (`.a-completer`, `.a-valider`, `.proto-note`, `.piste-visuel`) : **réservées aux prototypes**. Aucune ne doit subsister dans le site publié (contrôle automatique au lot 7).

## 6. Photographies, figures et illustrations · Validé

- **Cadre commun** : fond `--papier-2`, contour `1px --filet`, aucun arrondi ni ombre. Légende en Newsreader italique sous la figure. Les légendes sont conservées volontairement (écart assumé avec Taste Skill).
- **Photographies** : réelles, en couleur naturelle, sans filtre. Le portrait professionnel est recadré en 4:5 depuis `images/port1.jpg`, avec un texte alternatif. Aucun visage généré, aucun visage de tiers sans accord.
- **Documents et graphiques** (`.cadre.document`) : graphique d'origine en niveaux de gris, fondu dans le papier (`multiply`). Les repères ajoutés sont rouges.
- **Visuels de jeux** : pixel art à l'échelle entière (aucun pixel étiré), grille constante dans une image, palette propre au jeu. Sources dans `_refonte/outils/visuels-phase7.mjs`. Jamais de visage de collègue, de sigle administratif ni de logo tiers (Teams…).
- **Illustration** : uniquement si elle porte une information. Exemple validé : le globe d'Atlas, avec côtes réelles (Natural Earth), un seul repère, rien d'inventé.
- **Formats** : JPEG pour les photos et captures, PNG pour le pixel art, SVG pour le vectoriel. Largeur maximale 1600px. Attributs `width` et `height` toujours présents. `loading="lazy"` partout sauf au premier écran.

## 7. Mouvement · Validé (définitif, phase 10)

Le mouvement a un rôle nommé, sinon il n'existe pas. Outils : CSS d'abord (transitions, animations, animations liées au défilement, View Transitions), puis quelques lignes de JavaScript natif (`v2bis/v2bis.js`). Aucune bibliothèque d'animation.

**Principe d'ensemble : une publication qui se compose, s'annote et garde la trace de la lecture.** Le premier contact est orchestré, puis la page se calme. Le contenu est lisible en environ une seconde, et rien ne retarde l'accès à l'information.

| Mouvement | Rôle | Valeurs |
| --- | --- | --- |
| **La une se compose** (première visite de la session) : filets tracés, rubriques posées, lignes du nom et de l'accroche qui montent, portrait « développé » (gris → couleur), figure découverte de gauche à droite, stylo en dernier | Entrée, plaisir de première visite | Filets 800ms `--ease-in-out` ; blocs 450 à 500ms `--ease-out`, décalés de 40 à 100ms ; lisible vers 1s, achevé vers 1,8s ; s'achève au premier geste ; sur téléphone, la une attend d'entrer dans l'écran |
| Entrée des visites suivantes de la session | Entrée | Fondus courts de 600ms (`.apparait`) |
| Révélation des titres de section (filet tracé, titre puis chapeau) | Transition entre sections | Une fois ; filet 900ms `--ease-in-out`, titre et chapeau 600 à 700ms `--ease-out`, décalés de 120ms |
| Révélation des images de l'index (tablette, téléphone) et de la figure de l'analyse | Arrivée de l'image, sans à-coup | Une fois ; `clip-path` du haut vers le bas, 900ms `--ease-in-out`, image qui se pose (`scale` de 1,06 à 1, 1400ms) |
| Trait de stylo, tracé de la tendance (après la révélation), cercles au stylo | Explication | 800ms, 1100ms (après 600ms), puis 650ms par cercle, décalés de 380ms |
| Barres de la frise, dans l'ordre chronologique, puis repère « aujourd'hui » | Explication | 900ms `--ease-in-out`, décalées de 110ms |
| Profondeur : l'image glisse de ±3 % dans son cadre au défilement | Profondeur | Grandes figures seulement (une, fiches) ; `translate` lié au défilement, `linear` ; **jamais** sur une vignette de liste ni sur une donnée |
| Survols : lien, couleur, flèche, zoom d'image de 1,025, marche de bouton de 1px ; appui sur bouton (`scale` 0,97) | Retour d'action | 120 à 250ms (400ms pour le zoom) ; survols réservés au pointeur fin |
| Aperçu de l'index (la nouvelle image se pose sur l'ancienne) | Changement d'état | Opacité 280ms, `scale` de 1,02 à 1 en 300ms ; légende en 220ms |
| Trait de lecture de la manchette | État | 300ms `--ease-in-out` |
| Nom de section de la barre de lecture (téléphone) | État | Glisse de 6px en 220ms `--ease-out` |
| Fil d'une note ; estompage des autres lignes de la frise au survol | Relation | 260ms ; 200ms |
| Tiroir mobile | Spatial | 380ms, `--ease-drawer` |
| La vignette devient l'image de la fiche (et l'inverse au retour) | Continuité spatiale | 500ms `--ease-in-out` ; page qui sort en 220ms, page qui entre en 420ms (10px) |
| Réalisation suivante | Continuité | Glissement latéral de 5 % en 420ms `--ease-in-out` |

Courbes : `--ease-out` `cubic-bezier(.23,1,.32,1)`, `--ease-in-out` `cubic-bezier(.77,0,.175,1)`, `--ease-drawer` `cubic-bezier(.32,.72,0,1)`, `linear` pour ce qui suit le défilement. Jamais d'`ease-in` sur l'interface.

Règles :
- On anime `transform`, `translate`, `scale`, `opacity`, `clip-path` et le tracé SVG (`stroke-dashoffset`), plus `background-size` pour les soulignements. Seule exception : le filtre gris → couleur du portrait, sur une petite image et une seule fois.
- Rien n'est lié au défilement, sauf la jauge et le trait de lecture, la barre de progression et la profondeur légère des grandes figures.
- Aucune boucle automatique. Les révélations sont rationnées (titres de section, images, figure) et ne jouent qu'une fois.
- Une interaction fréquente reste sous 300ms. Ce qui se déclenche à répétition passe par des transitions (interruptibles).
- **Mouvement réduit** (`prefers-reduced-motion: reduce`) : ni composition, ni révélation, ni profondeur, ni transition de page. Les cercles et le repère sont là d'emblée, et seuls des fondus d'opacité de 200ms subsistent. Rien ne reste caché.
- Sans JavaScript, la page est complète et immobile.

Pièges techniques connus :
- Une animation liée au défilement (`animation-timeline: view()`) se rapporte au plus proche conteneur de défilement : un cadre en `overflow: hidden` en est un, et fige l'animation. Utiliser `overflow: clip` sur les cadres.
- Un nom de View Transition doit être unique dans la page au moment de la capture : poser les noms au clic plutôt qu'en dur quand plusieurs éléments représentent la même œuvre.
- Avec une animation d'entrée à images-clés (`fill: both`) sur une propriété, une transition sur cette même propriété ne joue plus : séparer les propriétés (`translate`, `scale`, `transform`).
- Un élément masqué par `clip-path: inset(0 0 100% 0)` n'a aucune surface visible : `IntersectionObserver` ne le voit jamais entrer. Observer son parent.
- Une rubrique animée (transformée) devient son propre repère pour `offsetLeft` dans Chromium : mesurer les positions avec `getBoundingClientRect()`.
- Le masque d'une ligne qui monte déborde de `.2em` : faire partir le texte de `calc(100% + .4em)`, sinon le sommet des lettres dépasse au départ.
- Un défaut de mise en page peut être caché par une animation, car un élément transparent ne compte pas dans le CLS. Mesurer aussi en mouvement réduit (le CLS y était de 0,11 avant la phase 10).

## 8. Adaptation aux écrans · Validé

- **Large (≥ 1100px)** : axe 5/7, manchette collante, aperçu de l'index, notes en marge.
- **Étroit (< 1100px)** : la manchette laisse place à la barre de lecture et au tiroir ; notes ouvertes dans le texte ; frise sur une colonne.
- **Tablette (641 à 1099 px)** : la une et chaque ligne de l'index restent en deux colonnes (§ 4).
- **Téléphone (≤ 640px)** : boutons pleine largeur, tableau des preuves en fiches, une année sur deux sur l'axe de la frise, libellés de fiche au-dessus des valeurs.
- Le premier écran mobile montre le nom, l'annonce Atlas en une ligne, l'accroche et le début de la fiche signalétique. Le CV reste accessible dans la barre de lecture.
- Aucun défilement horizontal. Cibles tactiles d'au moins 44px. Le courriel ne se coupe jamais au milieu.
- Largeurs à vérifier : 1440, 1024, 768 et 390px.

## 9. Accessibilité · Validé

- `lang="fr-CA"`, lien d'évitement, repères (`header`, `nav`, `main`, `footer`), un `h1` par page, titres dans l'ordre.
- Focus visible : contour rouge de 2px, décalé de 3px. Tout ce qui réagit au survol réagit aussi au focus (aperçu de l'index, notes reliées).
- Sommaire : `aria-current` sur la section courante. Tiroir : `<dialog>` modal, focus piégé, Échap ferme et rend le focus.
- Appels de note : vrais `<button>` avec `aria-controls` et `aria-expanded`.
- Textes alternatifs : descriptifs pour les images porteuses d'information, vides (`alt=""`) pour les vignettes doublées par un titre. Les SVG décoratifs portent `aria-hidden`.
- Contrastes AA mesurés (§ 2). Le site s'imprime proprement (styles d'impression : notes dépliées, adresses des liens).
- Mouvement réduit : voir § 7.

## 10. Gouvernance du design · Validé (proposé en phase 9)

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
- Bibliothèques d'animation (GSAP, Motion) : aucune n'est nécessaire à ce jour ; CSS, animations liées au défilement, View Transitions et l'API Web Animations couvrent tous les besoins. Une bibliothèque ne s'ajoute que pour un besoin démontré et avec l'accord de Léo.

Proposer une amélioration est encouragé, sous conditions :
- Une proposition indique le problème observé, l'idée, le gain attendu, son coût, et sa compatibilité avec ce document.
- Pour une tâche ciblée : au plus deux idées, présentées après le travail demandé.
- **Ne jamais appliquer sans l'accord de Léo** :
  - une nouvelle couleur, police, échelle ou un nouveau seuil ;
  - un nouveau composant ou une bibliothèque ;
  - une animation hors du § 7 ;
  - la modification d'un composant validé.
- Une idée acceptée met à jour ce document, en datant le changement.

## 11. Laboratoire de mouvement · Clos (phase 10)

Le laboratoire de la phase 9 (`_refonte/prototypes/labo/`, `v2bis-labo/`) est conservé comme archive. Léo a demandé de ne plus explorer.

Intégré au § 7 :
- la composition de la une (une fois par session) ;
- la vignette qui devient l'image de la fiche et la réalisation suivante ;
- les cercles au stylo ;
- la frise chronologique avec « aujourd'hui » ;
- le trait de lecture ;
- une profondeur limitée à ±3 % sur les grandes figures.

Non retenu :
- le titre qui glisse vers le titre de la fiche (instantané agrandi peu net) ;
- les intensités de parallaxe « marquée » et « expressive » ;
- toute parallaxe sur les vignettes de liste.

## Historique

- 2026-11-09 : § 2 : bleu de Prusse et ocre, réservés aux repères de l'atlas.

- 2026-11-06 : phase 10 : mouvement définitif (§ 7), tablette (§§ 4 et 8), polices de secours mesurées (§ 3), frise de 2020 à 2027, pièges techniques complétés ; laboratoire clos (§ 11).

- 2026-11-06 : première version, tirée de V2bis (phases 5 à 9). À valider.
- 2026-11-06 : statuts « Validé » / « Expérimental » ; § 11 (laboratoire de mouvement) ; pièges techniques du mouvement.
