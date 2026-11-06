# Intégrer « Artéfacts 2050 » au site

Ce document s'adresse à l'assistant (ou à la personne) qui travaille dans le dépôt du site web et ne connaît pas ce projet. Lis-le en entier avant de copier quoi que ce soit.

## 1. Ce qu'est le jeu

- « Artéfacts 2050 : un jeu d'effet papillon sur l'éducation » est un mini-jeu web en français (fr-CA) de moins de cinq minutes.
- Il sert d'introduction à cinq fiches de prospective sur l'éducation au Québec : une partie par fiche.
- Chaque partie compte six décisions à glisser (gauche ou droite). Quatre jauges réagissent tout de suite, et des « effets papillon » cachés se révèlent en 2050.
- La fin mène au bouton « Lire la fiche », qui renvoie vers le document de la fiche.
- Le site est statique : HTML, CSS et JavaScript, polices et contenu intégrés. Il n'utilise ni serveur, ni base de données, ni témoin (cookie), et ne fait aucune requête réseau.

## 2. Deux modes d'intégration : la décision ne t'appartient pas

**Le choix entre le mode A et le mode B revient à la personne responsable du projet.** Ne choisis pas à sa place : si la décision n'est pas écrite dans ta consigne, demande-la avant de copier quoi que ce soit.

### Mode A : le dépôt du site est privé

On peut y copier **le projet complet** (les sources), dans un dossier **à part**, hors du dossier public du site :

```
<dépôt du site>/
├── jeux-sources/
│   └── artefacts-2050/        ← projet complet (sources), JAMAIS servi tel quel
└── <dossier public du site>/  (public/, static/, www/… selon le site)
    └── jeux/
        └── artefacts-2050/    ← contenu de dist/ après npm run build
```

Fichiers et dossiers à copier dans `jeux-sources/artefacts-2050/` :

```
content/  public/  scripts/  src/  tests/
.gitignore  CLAUDE.md  INTEGRATION.md  README.md  game.json
index.html  package.json  package-lock.json  tsconfig.json  vite.config.ts
Main.dc.html  Papillon.dc.html   (maquettes de référence, facultatives)
```

Ne copie pas `node_modules/`, `dist/`, `captures/` ou `qr/` (régénérables), ni de document interne (`*.docx`). Le `.gitignore` du projet les exclut déjà.
Les deux maquettes `*.dc.html` chargent Google Fonts si on les ouvre : elles ne doivent jamais se trouver dans le dossier public.

### Mode B : le dépôt du site est public

On n'y met **que le résultat du build**. Les sources restent dans un dépôt séparé et privé, celui de ce projet.

```
<dossier public du site>/
└── jeux/
    └── artefacts-2050/   ← contenu de dist/ seulement
        ├── index.html
        ├── assets/        (JS, CSS, polices)
        ├── licences/      (licences OFL des polices : à garder)
        ├── game.json
        └── vignette.png
```

Pour mettre le jeu à jour, on reconstruit dans le dépôt des sources, puis on remplace le dossier `jeux/artefacts-2050/` en entier.

## 3. Reconstruire

Il faut Node 22.12 ou une version plus récente. Depuis le dossier des sources :

```sh
npm ci            # installe les versions exactes de package-lock.json
npm run build     # valide les 5 fiches, vérifie les types, produit dist/
npm run verifier  # facultatif : contrôle complet dans Edge (EDGE_PATH pour un autre Chromium)
```

Copie ensuite **le contenu** de `dist/` (pas le dossier lui-même) dans `jeux/artefacts-2050/`.
`dist/` est autonome : tous ses chemins sont relatifs (`./assets/…`). Il ne contient aucun chemin absolu et ne dépend d'aucun dossier parent.

Si le site est produit par un générateur (Astro, Hugo, Eleventy, Jekyll, Next…), place ces fichiers dans son dossier de fichiers statiques. Vérifie aussi que le générateur les copie tels quels, sans réécrire `index.html`.

## 4. Adresses et hébergement

- L'adresse du jeu est `<site>/jeux/artefacts-2050/`, et celle d'une fiche `<site>/jeux/artefacts-2050/?fiche=3`.
- Le jeu utilise un paramètre (`?fiche=N`), jamais de chemin : il n'a besoin d'aucune règle de réécriture, et le rafraîchissement ou l'ouverture directe d'une fiche fonctionne toujours.
- L'hébergeur doit seulement savoir **servir `index.html` quand on demande un dossier**, ce qui est le comportement par défaut presque partout.
- **Adresse sans barre oblique finale** (`<site>/jeux/artefacts-2050?fiche=3`) : elle fonctionne si l'hébergeur redirige `dossier` vers `dossier/` en gardant le `?fiche=N`. Apache (`DirectorySlash On`, par défaut), nginx (fichiers statiques), GitHub Pages et Cloudflare Pages le font d'eux-mêmes, et `npm run verifier` teste ce cas.
- Si l'adresse sans barre finale affiche une page sans style ou cassée, c'est que l'hébergeur sert la page sans rediriger. Il faut alors ajouter une redirection 301 de `/jeux/artefacts-2050` vers `/jeux/artefacts-2050/`, en conservant les paramètres :
  - Apache (`.htaccess`) : `RedirectMatch 301 ^/jeux/artefacts-2050$ /jeux/artefacts-2050/` (les paramètres sont conservés) ;
  - nginx : `location = /jeux/artefacts-2050 { return 301 /jeux/artefacts-2050/$is_args$args; }` ;
  - Netlify (`_redirects`) : `/jeux/artefacts-2050  /jeux/artefacts-2050/  301` ;
  - Vercel (`vercel.json`) : `"trailingSlash": true`.
- Next.js ne sert pas `index.html` d'un dossier de `public/`. Il faut une réécriture de `/jeux/artefacts-2050/` vers `/jeux/artefacts-2050/index.html`.
- Dans les liens et les QR codes, écris toujours l'adresse **avec** la barre finale.

## 5. Changer le slug (nom du dossier)

1. Dans `game.json`, change `"slug"`. C'est le seul endroit à modifier dans le projet : le jeu lui-même n'en dépend pas, et `npm run verifier` sert le jeu depuis `/jeux/<slug>/`.
2. Renomme le dossier `jeux/<slug>/` sur le site et mets à jour les liens qui y mènent.
3. Régénère les QR codes : `npm run qr -- <site>/jeux/<slug>/`.

## 6. Ce qu'il ne faut pas toucher

- **Les règles du moteur** (`src/engine/`) : 6 cartes, 4 jauges (départ à 50, bornes de 8 à 95), 2 axes cachés et 4 fins, papillons sur les cartes 1 à 3. Elles sont validées par les tests.
- **Le contenu des fiches** (`content/fiche-*.json`) : chaque texte a été écrit et calibré (longueurs, répartition des fins). Une correction de contenu passe par la personne responsable du projet.
- **Le design** (`src/styles/`, `src/ui/visuals.ts`) : couleurs, polices, contrastes et tailles des cibles sont contrôlés pour l'accessibilité.
- **Les fichiers construits** dans `jeux/artefacts-2050/` : on ne les modifie jamais à la main, on reconstruit.
- **Les licences** `licences/*-OFL.txt` : la licence des polices exige qu'elles accompagnent les fichiers de police.
- **La balise `<meta name="robots" content="noindex, nofollow">`** tant que le statut est `test` (voir la section 9).

## 7. Ce qu'il ne faut pas ajouter

- Aucune analytique, aucun pixel de suivi, aucun gestionnaire de balises, ni dans le jeu ni dans son dossier.
- Aucun CDN, aucune police distante (Google Fonts, Adobe Fonts…), aucun script ni aucune feuille de style externe.
- Aucun témoin (cookie), ni stockage local (`localStorage`, `sessionStorage`) qui garde des données de joueurs.
- Pas d'en-tête, de pied de page ou de bandeau du site injecté dans `index.html` : le jeu occupe tout l'écran, et sa mise en page est vérifiée sur mobile (360 à 480 px).
- Pas de collecte de renseignements personnels. Si un nom est un jour saisi, il reste facultatif (un pseudonyme convient) et en mémoire seulement, jamais envoyé ni stocké.

Si le site ajoute ce genre d'éléments à toutes ses pages (gabarit global, injection par l'hébergeur), exclus-en le dossier `jeux/artefacts-2050/`.

## 8. Ajouter ou retirer le jeu de la liste « jeux web » du site

Le site lit `jeux/artefacts-2050/game.json` :

```json
{
  "slug": "artefacts-2050",
  "titre": "Artéfacts 2050",
  "description": "…une phrase…",
  "vignette": "vignette.png",
  "langue": "fr-CA",
  "statut": "test",
  "ordre": 1
}
```

- **Lien du jeu** : `<site>/jeux/<slug>/`. **Image** : `<site>/jeux/<slug>/<vignette>` (1200 × 630, utilisable en `og:image`).
- **`ordre`** : la position dans la liste (le plus petit en premier).
- **Ajouter** : copie les fichiers (section 2), puis ajoute le jeu à la liste du site selon son mécanisme (lecture des `jeux/*/game.json`, ou entrée dans un fichier de données du site).
- **Retirer de la liste sans supprimer le jeu** : retire son entrée de la liste du site. Les liens et QR codes déjà diffusés continuent de fonctionner.
- **Supprimer complètement** : retire l'entrée, supprime `jeux/artefacts-2050/`, et retire l'adresse du sitemap si elle y figure. Les QR codes imprimés ne mèneront alors plus à rien.
- Tant que `statut` vaut `test`, la page de liste du site ne doit pas mettre le jeu en avant publiquement, sauf si la personne responsable le demande.

## 9. Passer de « test » à « public »

Le passage se fait **seulement** sur demande explicite de la personne responsable du projet, une fois les hypothèses validées par l'équipe et la publication approuvée.

1. Dans les sources :
   - `src/config.ts` : `export const NOINDEX = false;`
   - `game.json` : `"statut": "public"`
   - `src/config.ts` : vérifie que les 5 liens « Lire la fiche » (`LIENS_FICHES`) sont de vraies adresses et non `'#'`.
2. Lance `npm run build`, puis `npm run verifier` : il échoue si `NOINDEX` et `statut` ne concordent pas, et contrôle que la balise robots a disparu.
3. Remplace le contenu de `jeux/artefacts-2050/` par le nouveau `dist/`. Vérifie dans le code source de la page en ligne que `<meta name="robots"` n'apparaît plus.
4. **Sitemap** : ajoute `<site>/jeux/artefacts-2050/` (avec la barre finale) au sitemap du site. Les adresses `?fiche=N` sont facultatives.
5. **robots.txt** : ne bloque pas le dossier (`Disallow`). Pendant la phase de test non plus : un moteur doit pouvoir lire la balise noindex pour la respecter.

Pour revenir en test, fais l'inverse : `NOINDEX = true`, `"statut": "test"`, reconstruction, et retrait de l'adresse du sitemap.
