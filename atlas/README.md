# Atlas

Globe 3D des lieux où j'ai vécu et voyagé : https://leomatrat.com/atlas/. Ce fichier n'est pas publié (exclu dans `_config.yml`).

## Ajouter un lieu

1. Ouvrir `data/destinations.json` et copier un lieu existant à la fin de « destinations ».
2. Changer `id` (minuscules et tirets, unique : c'est aussi l'adresse `#id`), `nom`, `pays`, `type` (`habite`, `voyage` ou `coeur`).
3. Mettre `lat` et `lng` à la précision de la ville (deux décimales suffisent), jamais d'une adresse.
4. Remplir au besoin `periode`, `resume`, `anecdotes`, `photos` ; un champ vide n'est pas affiché. `emblematique: true` cercle le repère.
5. Vérifier en local (`scripts/preview-games.ps1 -Port 8790`, puis http://127.0.0.1:8790/atlas/#id) : un lieu invalide est ignoré, avec un avertissement dans la console.

## Photos

1. Une fois : `cd tools` puis `npm install` (installe sharp, hors du site publié).
2. Mettre les originaux d'un lieu dans un dossier quelconque, hors du dépôt (HEIC : exporter d'abord en JPEG).
3. Lancer `node tools/atlas-photos.mjs <dossier> <id-du-lieu>` depuis la racine du dépôt.
4. Le script réduit à 1600 px au plus, convertit en WebP, efface toutes les métadonnées (position GPS comprise) et range dans `photos/<id>/`.
5. Coller le bloc qu'il affiche dans « photos » du lieu et écrire chaque texte alternatif (`alt`), obligatoire.

## Vie privée, avant de publier

- Ne publier que des lieux, des dates larges (une année, une saison) et des anecdotes que j'accepte de rendre publics.
- Jamais d'adresse de domicile ni de coordonnées plus précises que la ville.
- Pas de photo d'une personne reconnaissable sans son accord.
- Relire le texte alternatif et la légende : ils sont publics eux aussi.
- Le dépôt GitHub est public : un fichier commité reste dans l'historique même après suppression.
