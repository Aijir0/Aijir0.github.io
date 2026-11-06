# leomatrat.com

Site professionnel de Léo Matrat, « Note de breffage, publication vivante » : un portfolio éditorial (travaux, parcours, compétences) et des réalisations interactives.

## Structure

| Chemin | Contenu |
| --- | --- |
| `index.html` | Accueil : la une, les travaux, l'analyse, le parcours, les compétences, le contact |
| `travaux/<nom>/` | Fiches de réalisation : `artefacts-2050`, `researchrabbit`, `atlas` |
| `assets/site/` | `site.css` et `site.js` (feuille et script uniques, sans dépendance), `img/` (images du site), `icone.svg` |
| `artefacts-2050/`, `PacQC/`, `jeu/` | Les jeux, autonomes, à leurs URL historiques |
| `espace-jeux/` | Ancien menu des jeux, conservé pour les favoris et les liens « retour » des jeux |
| `projet_session/`, `presentation/`, `CV/`, `images/` | Documents et ressources historiques |
| `DESIGN.md` | Système de design : à lire avant toute modification visuelle |

## Aperçu local

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\preview-games.ps1 -Port 8000
```

Puis ouvrir http://127.0.0.1:8000/. Les chemins des pages commencent à la racine (`/assets/site/…`) : il faut donc servir le dépôt depuis sa racine.

## Publication (GitHub Pages et Jekyll)

- Le site est publié depuis la branche `main`, sous le domaine `leomatrat.com` (`CNAME`).
- `_config.yml` liste les fichiers de travail à ne pas publier (documentation, tests, scripts, sources du CV…). Les chemins qui commencent par `_` ou `.` ne sont jamais publiés.
- **Ne jamais ajouter de `.nojekyll` ni de workflow Pages** sans garder ces exclusions.
- Après une publication, vérifier que les fichiers exclus répondent 404 (par exemple `/DESIGN.md`, `/CV/cvLaTeX.tex`).
- Pour changer de version des styles ou du script, mettre à jour le paramètre `?v=` dans l'en-tête des pages.

## Tests

```powershell
node PacQC/tests/run.mjs          # moteur et cartes de PacQC
node tests/preview.test.mjs       # vignette animée du menu des jeux
```
