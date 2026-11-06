# Plan de migration — de V2bis au site définitif

Statut : **proposé pour validation (phase 9, 6 novembre 2026)**. Rien n'est encore développé.
Références : `_refonte/DESIGN.md` (design system), `_refonte/SUIVI.md` (état et décisions).

---

## 1. État des lieux (constaté le 6 novembre 2026)

**Publication**
- GitHub Pages publie la branche `main` du dépôt `Aijir0/Aijir0.github.io` sous le domaine `leomatrat.com` (`CNAME`).
- La compilation se fait par Jekyll, dans son mode classique : pas de `_config.yml`, pas de `.nojekyll`, pas de workflow `.github/`.
- Jekyll ignore les chemins qui commencent par `_` ou `.`. Vérifié en ligne : `.Rhistory` renvoie 404. `_refonte/` et `_archive-visuelle/` ne sont donc jamais publiés.
- **Tout le reste est publié tel quel**, y compris des fichiers de travail. Constaté en ligne (HTTP 200) :

| Fichier publié | Problème |
| --- | --- |
| `CV/cvLaTeX.tex` | **Contient l'adresse postale de Léo.** |
| `docs/INTEGRATION-JEUX.md` | Document interne. |
| `tests/preview.test.mjs` | Fichier de test. |
| `README.md`, `Curseur.md` | Notes de travail. |
| `projet_annexe/semantic_scholar_search.py` | Script retiré du portfolio. |

- Le CV PDF public contient le téléphone et les courriels de trois référents (signalé en phase 8 ; Léo le mettra à jour plus tard).

**Accueil actuel** (`index.html`)
- Gabarit HTML5 UP : jQuery, `scrollex`, `scrolly`, `breakpoints`, `browser`, `util.js`, `main.js` et `assets/css/main.css`, avec ses sources Sass et les polices Font Awesome locales.
- Il charge en plus deux versions de Font Awesome depuis un CDN (5.15.4 et 6.0.0) et les icônes Flaticon.
- Deux ressources sont **déjà cassées en ligne** (404) :
  - `node_modules/accessibility-buttons/…`, car Jekyll exclut `node_modules` ;
  - `assets/js/trailing-cursor.js`, absent du dépôt.
- `package.json` ne déclare que `accessibility-buttons`, dont le dossier est suivi par Git (33 fichiers) mais jamais servi.

**Jeux et documents** (fonctionnels, autonomes, sans dépendance au gabarit)
- `/artefacts-2050/` : application compilée ; sa fiche est `game.json`.
- `/PacQC/` : JavaScript natif, avec ses tests.
- `/jeu/` : la Scène Pixel Art.
- `/espace-jeux/` et `/espace-jeux/selection.html` : menu des jeux ; `preview.js` est testé par `tests/preview.test.mjs`.
- `/projet_session/projet2.html`, `/presentation/rabb2.pdf`, `/CV/CVLeoM.pdf`.
- Attention : la vignette animée de `espace-jeux` (`PacQC/assets/front1…5.png`) et le jeu PacQC montrent encore le visage d'un collègue.

**Dépôt**
- La branche de travail `refonte-visuelle-2026` a 12 commits d'avance sur `main` local.
- `origin/main` a 2 commits que `main` local n'a pas : la fusion de la PR #4 et une nouvelle vignette `artefacts-2050/vignette.png`. Aucun conflit prévisible.
- Ni Ruby ni Jekyll n'est installé : on ne peut pas reproduire localement la compilation de GitHub Pages. Le serveur d'aperçu `scripts/preview-games.ps1` sert les fichiers bruts, y compris ceux que Jekyll exclurait.

## 2. Méthode recommandée

**Construire le site définitif à la racine, sur une branche, sans toucher aux jeux, puis publier en une seule fusion.**

1. **Une branche, un commit par étape.**
   - On continue sur `refonte-visuelle-2026`, après y avoir fusionné `origin/main`.
   - Chaque étape du § 5 est un commit vérifié, donc réversible séparément.
2. **Ajouter, puis remplacer, puis retirer.**
   - Le nouveau socle (`assets/site/`) cohabite d'abord avec l'ancien gabarit (`assets/css`, `assets/js`…).
   - L'ancien accueil est remplacé à l'étape 1.
   - Les fichiers obsolètes sont supprimés **en dernier** (étape 6), après une recherche prouvant qu'aucune page ne les référence, et sur accord de Léo.
3. **On transpose le prototype, sans le réécrire.**
   - `commun/base.css` et `v2bis/v2bis.css` sont fusionnés en une feuille unique, débarrassée des règles propres aux prototypes.
   - `signatures.js` et le petit script de l'index deviennent un module unique, sans dépendance.
   - Le HTML de V2bis est repris tel quel ; on corrige seulement les chemins et on retire les mentions de travail.
4. **Aucune nouvelle dépendance.**
   - Pas de générateur, de framework ni de bibliothèque d'animation.
   - Les polices restent chargées depuis Google Fonts. Les héberger dans le dépôt est possible plus tard, pour la confidentialité et la performance, mais ce n'est pas nécessaire.
   - Playwright reste un outil de vérification installé hors du dépôt.
5. **Les jeux ne sont pas réécrits.**
   - Leurs URL, leurs fichiers et leurs tests restent en place.
   - Seuls les points d'entrée changent : liens depuis les travaux, vignettes.
   - Toute modification d'un jeu (retirer le visage du collègue, corriger l'accent de « Scène ») est une étape distincte, sur accord.
6. **Publication protégée.**
   - Un `_config.yml` liste explicitement ce qui ne doit pas être publié (§ 4).
   - On ne crée **jamais** de `.nojekyll` ni de workflow Pages sans exclure `_refonte/` : sinon tout le dossier de travail serait publié.
   - Un script vérifie après chaque publication que les fichiers exclus renvoient 404 et que les pages utiles renvoient 200.
7. **Historique préservé.**
   - Une étiquette Git `site-avant-refonte` est posée sur `main` avant la fusion.
   - L'archive visuelle (`_archive-visuelle/`) et les prototypes (`_refonte/`) restent dans le dépôt, non publiés.
   - Retour arrière : annuler le commit de fusion sur `main` (`git revert -m 1`).

## 3. Carte des URL

| URL | Aujourd'hui | Après la refonte |
| --- | --- | --- |
| `/` | Accueil HTML5 UP | **Accueil V2bis** (une, travaux, analyse, parcours, compétences, contact) |
| `/travaux/artefacts-2050/` | — | Fiche de réalisation (nouvelle) |
| `/travaux/researchrabbit/` | — | Fiche de réalisation (nouvelle) |
| `/travaux/atlas/` | — | Fiche « Hors-série · En chantier » (nouvelle) ; `/atlas/` reste libre pour le futur globe |
| `/artefacts-2050/` | Jeu | **Inchangée** |
| `/PacQC/` et ses `?carte=…` | Jeu | **Inchangée** |
| `/jeu/` | Scène Pixel Art | **Inchangée** |
| `/espace-jeux/`, `/espace-jeux/selection.html` | Menu des jeux | **Conservées** (anciens favoris, liens « retour » des jeux) ; vignettes mises à jour à l'étape 4 |
| `/projet_session/projet2.html` | Rapport | **Inchangée** |
| `/presentation/rabb2.pdf` | Présentation | **Inchangée** |
| `/CV/CVLeoM.pdf` | CV | **Inchangée** (Léo remplacera le fichier au même chemin) |
| `/images/…` | Images | **Conservées** ; les nouvelles images vont dans `/assets/site/img/` |

Chemins : les nouvelles pages utilisent des chemins **relatifs à la racine** (`/assets/site/site.css`). Ils fonctionnent sur le domaine et dans le serveur d'aperçu, quel que soit le niveau de dossier.

## 4. Règles de publication (`_config.yml` proposé)

```yaml
# Publication GitHub Pages (Jekyll) : seul le site est publié.
# Les chemins commençant par « _ » ou « . » (_refonte, _archive-visuelle…) sont déjà ignorés par Jekyll.
exclude:
  - DESIGN.md
  - CLAUDE.md
  - README.md
  - Curseur.md
  - docs/
  - tests/
  - scripts/
  - projet_annexe/
  - CV/cvLaTeX.tex
  - CV/cv.png
  - package.json
  - package-lock.json
  - node_modules/
  - PacQC/README.md
  - PacQC/docs/
  - PacQC/tests/
  - PacQC/tests.html
  - PacQC/scripts/
  - PacQC/assets-audit.json
  - projet_session/projet.md
```

Points d'attention :
- La liste `exclude` remplace la liste par défaut de Jekyll : `node_modules/` doit donc y figurer explicitement.
- À décider par Léo : publier ou non le code R (`projet_session/code/code.R`, `projet2.Rmd`). C'est une preuve de compétence, mais aussi un fichier de travail.
- **Correctif urgent possible, indépendant de la refonte** : publier dès maintenant sur `main` un `_config.yml` réduit à `exclude: [CV/cvLaTeX.tex, docs/, tests/, README.md, Curseur.md, projet_annexe/, node_modules/]`, pour retirer l'adresse postale du site. Cela demande l'accord de Léo et une publication.
- Un fichier déjà indexé peut rester visible dans des caches ou des archives web après son retrait.

## 5. Étapes

Chaque étape se termine par :
- les vérifications indiquées ;
- une capture examinée à 1440 et 390px ;
- un commit ;
- une ligne dans `SUIVI.md`.

### Étape 0 — Socle et publication protégée
- **Fichiers**
  - Création : `_config.yml`, `assets/site/site.css` (fusion de `base.css` et `v2bis.css`, sans `.proto-note` ni `.piste-visuel`, sans `--vert-clair` ni règles inutilisées), `assets/site/site.js` (`signatures.js` et le script de l'index), `assets/site/img/` (images issues de `_refonte/prototypes/medias/`).
  - Déplacement : `DESIGN.md` à la racine (exclu de la publication).
  - Étiquette : `site-avant-refonte` sur `main`.
- **Dépend de** : la validation de ce plan et de `DESIGN.md`.
- **Vérifications**
  - Une page témoin rendue avec la nouvelle feuille est identique à V2bis (capture côte à côte).
  - Simulation de la liste `exclude` par un script, puisque Jekyll n'est pas disponible localement.
  - Aucun fichier de `_refonte/` n'est référencé par une page publiée.

### Étape 1 — Accueil et navigation
- **Fichiers**
  - Remplacement : `index.html`, par le contenu de V2bis avec ses chemins réécrits.
  - Ajouts : `<title>`, description, balises Open Graph (titre, description, image de partage) et icône du site. **Pas de `noindex`.**
- **Dépend de** : l'étape 0.
- **Vérifications**
  - Sommaire vivant (bureau), barre de lecture et tiroir (mobile), lien d'évitement.
  - Aucune mention « à compléter » ou « à valider » ne reste visible : celles qui restent sont soit tranchées par Léo, soit retirées.
  - Liens et ancres ; aucune erreur dans la console ; aucun débordement.

### Étape 2 — Travaux et fiches de projets
- **Fichiers** : `travaux/artefacts-2050/index.html`, `travaux/researchrabbit/index.html`, `travaux/atlas/index.html`, et les vignettes dans `assets/site/img/`.
- **Dépend de** : l'étape 0 ; liens de l'index à l'étape 1.
- **Vérifications**
  - La transition « la figure devient la page » fonctionne entre l'accueil et la fiche Artéfacts.
  - Liens « Jouer », « Lire le rapport », « Consulter la présentation » ; retour au profil.
  - Rôle et outils d'Artéfacts 2050 fournis par Léo, ou mention retirée.
- **Décision à prendre** : le visuel final de PacQC et de la Scène (propositions de la phase 7).

### Étape 3 — Parcours professionnel et CV
- **Fichiers** : `index.html` (frise, compétences, contact) ; `CV/CVLeoM.pdf`, remplacé par Léo au même chemin quand il le souhaite.
- **Dépend de** : l'étape 1.
- **Vérifications**
  - La frise correspond aux faits validés (`SUIVI.md`) ; la légende est en texte.
  - Le lien du CV fonctionne (attribut `download`).
  - Les niveaux de langue sont confirmés, ou retirés.
- **Recommandation** : une version publique du CV sans téléphone ni courriels de référents.

### Étape 4 — Intégration des jeux
- **Fichiers**
  - `espace-jeux/index.html`, `espace-jeux/selection.html` et `espace-jeux/preview.js` : nouvelles vignettes et lien vers l'accueil.
  - Sur accord, et chacun dans un commit séparé : PacQC (visage du collègue, sigles, logo Teams) et `jeu/index.html` (« Scène » avec accent).
- **Dépend de** : l'étape 2 (visuels choisis) et les décisions de Léo sur PacQC.
- **Vérifications**
  - Les tests existants passent toujours : `node tests/preview.test.mjs` et `node PacQC/tests/run.mjs`.
  - Les liens retour des jeux mènent au menu, puis le menu à l'accueil.
  - Les URL directes des jeux et les `?carte=` fonctionnent.

### Étape 5 — Adaptation mobile et animations
- **Fichiers** : `assets/site/site.css` et `assets/site/site.js`, retouches seulement.
- **Dépend de** : les étapes 1 à 4.
- **Vérifications**
  - Captures à 1440, 1024, 768 et 390px.
  - Mouvement réduit : rien de caché, View Transitions désactivées.
  - Cibles tactiles d'au moins 44px ; aucun défilement horizontal.
  - Revue du mouvement avec le skill `review-animations`, selon le § 7 de `DESIGN.md`.

### Étape 6 — Contrôle qualité et publication
- **Fichiers**
  - Suppressions, sur accord : `assets/css/main.css`, `assets/sass/`, `assets/js/*` (jQuery…), `assets/webfonts/` (Font Awesome), `node_modules/`, `package.json`, `package-lock.json`. Chaque suppression est faite seulement après une recherche montrant qu'aucune page ne les référence.
  - Ajout éventuel : `404.html` aux couleurs du site.
- **Dépend de** : toutes les étapes précédentes.
- **Vérifications**
  - Vérificateur adapté aux pages racine : liens, images, ancres, polices, console, débordement, textes alternatifs, mentions de travail.
  - Contrastes ; poids des pages ; LCP et CLS.
  - Impression ; tests des jeux.
  - Grille de lecture « recruteur en 30 secondes » sur téléphone.
- **Publication** (action de Léo, ou sur son ordre explicite)
  1. Fusionner `origin/main` dans la branche.
  2. Poser l'étiquette `site-avant-refonte`.
  3. Fusionner la branche dans `main` (PR GitHub, comme la PR #4).
  4. Lancer, environ 10 minutes après, le script de contrôle en ligne : fichiers exclus en 404, pages utiles en 200.
  5. Retour arrière prêt.

## 6. Risques techniques

| Risque | Probabilité, gravité | Parade |
| --- | --- | --- |
| Adresse postale publiée (`CV/cvLaTeX.tex`) | **Déjà le cas**, grave | Exclusion dans `_config.yml`, au plus tôt (correctif indépendant possible) |
| Publication de `_refonte/` par l'ajout d'un `.nojekyll` ou d'un workflow | Faible, grave | Règle écrite ici et dans `DESIGN.md` ; contrôle en ligne après chaque publication |
| `exclude` mal interprété (pas de Jekyll local) | Moyenne, moyenne | Liste explicite ; contrôle en ligne ; correction rapide |
| Fichiers Markdown ou HTML avec un en-tête `---` traités par Jekyll (Liquid) | Faible | Les nouvelles pages n'ont pas d'en-tête ; recherche de `{{` et `{%` avant publication |
| Chemins relatifs du prototype (`../../../`) cassés après le déplacement | Élevée sans contrôle | Chemins relatifs à la racine ; vérificateur de liens et d'images |
| CSS ou JS en cache après publication (CDN de Pages, environ 10 minutes) | Moyenne, faible | Paramètre de version (`site.css?v=AAAAMMJJ`) |
| Visage du collègue encore visible dans le menu des jeux et dans PacQC | **Déjà le cas** | Étape 4, sur décision de Léo |
| Anciennes ancres de l'accueil (`/#…`) perdues | Faible, faible | Acceptable ; la page s'ouvre en haut |
| Mentions « à compléter » publiées par oubli | Moyenne, moyenne | Contrôle automatique à l'étape 6 |
| `noindex` des prototypes recopié dans le site | Moyenne, grave pour la visibilité | Retrait vérifié par le contrôle de l'étape 6 |
| Google Fonts indisponible ou lent | Faible | Polices de secours déclarées ; hébergement local possible plus tard |
| Divergence entre `main` et la branche | Faible (une vignette) | Fusion d'`origin/main` avant l'étape 0 |
| View Transitions non prises en charge (Firefox, Safari ancien) | Certaine, nulle | Amélioration progressive : la navigation reste normale |

## 7. Ordre d'exécution recommandé

1. **Correctif de confidentialité** (`_config.yml` minimal sur `main`), si Léo l'autorise. Il est indépendant du reste.
2. Étape 0 : socle, publication protégée, `DESIGN.md` à la racine.
3. Étape 1 : accueil et navigation.
4. Étape 2 : travaux et fiches. On tranche avant les visuels de PacQC et de la Scène.
5. Étape 3 : parcours et CV.
6. Étape 4 : jeux. On décide avant du sort du visage du collègue dans PacQC.
7. Étape 5 : passe mobile et mouvement.
8. Étape 6 : contrôle qualité, nettoyage sur accord, publication par Léo.

Les étapes 2 et 3 sont indépendantes l'une de l'autre et peuvent être inversées. L'étape 4 peut commencer dès que les visuels sont choisis.

## 8. Décisions à prendre avant le développement

1. Valider `DESIGN.md` et ce plan.
2. Autoriser, ou non, le correctif de confidentialité immédiat.
3. Visuels finaux de PacQC (Borne, Tuque ou Labyrinthe) et de la Scène (Personnage, Place ou Titre) ; portrait A, B ou les deux ; textes d'Atlas.
4. Publier, ou non, le code R du rapport.
5. Retirer le visage du collègue du jeu PacQC et de son aperçu (et comment).
6. Faits encore manquants (voir `SUIVI.md`) : rôle et outils pour Artéfacts 2050, niveaux de langue, Python, intitulé officiel du poste.
