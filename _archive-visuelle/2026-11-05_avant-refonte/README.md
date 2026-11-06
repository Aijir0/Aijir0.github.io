# Archive visuelle — avant refonte (5 novembre 2026)

État du site au commit `7451118` (branche `integration-artefacts-2050`), avant toute modernisation.
Le préfixe `_` du dossier parent le tient hors du site publié par GitHub Pages (Jekyll ignore ces dossiers).

- Captures Playwright avec Microsoft Edge, servies localement par `scripts/preview-games.ps1`.
- `desktop_*` : 1440 × 900. `mobile_*` : 390 × 844, à une densité de 2×.
- `00-premier-ecran` = ce qu'on voit à l'arrivée ; `01-page-complete` = page entière.
- `NN-section-*` = chaque section de l'accueil, ramenée en haut de l'écran.
- `etat-*` = états interactifs (épingle « destination », menu mobile ouvert).
- `console-et-erreurs.json` = erreurs console et réseau relevées pendant la capture.

| Dossier | Page |
| --- | --- |
| `01-accueil` | `index.html` (template HTML5 UP « Read Only ») |
| `02-espace-jeux` | `espace-jeux/selection.html` |
| `03-jeu-pixel-art` | `jeu/index.html` |
| `04-pacqc` | `PacQC/index.html` |
| `05-artefacts-2050` | `artefacts-2050/index.html` |
| `06-projet-session` | `projet_session/projet2.html` (export R Markdown) |
