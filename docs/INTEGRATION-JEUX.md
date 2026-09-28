# Intégration locale de l’espace jeux

## État au 27 septembre 2026

L’interface est intégrée. **La protection réelle n’est pas mise en place. Ne pas publier cet ensemble comme un espace privé.** Le dépôt contient uniquement du HTML/CSS/JavaScript statique ; aucun serveur, middleware, workflow de déploiement ni authentification n’a été trouvé. Le README décrit GitHub Pages, qui sert des fichiers statiques et n’exécute pas ce contrôle d’accès serveur : https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

Le fichier `CNAME` contient `leomatrat.com` (avec un t), contrairement à `leomatra.com` dans la demande. Les liens internes sont relatifs, sans modification du domaine. Les tentatives de consultation des domaines via l’outil web n’ont pas abouti ; les réglages du compte hébergeur n’ont donc pas été inspectés.

## Essayer maintenant, sans mot de passe

Depuis la racine du dépôt, dans PowerShell :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\preview-games.ps1 -Port 8000
```

Ouvrir http://127.0.0.1:8000/index.html, cliquer sur **Espace jeux**, puis **voir la sélection**. Le message « accès privé non configuré » est attendu. Le formulaire reste désactivé tant que le service manque ; aucun mot de passe ne doit être saisi pour cet aperçu. Les cartes sont visibles en aperçu uniquement sur localhost / 127.0.0.1 / ::1. Les retours depuis les deux jeux fonctionnent également sur cette origine locale. Déconnexion reste désactivée : aucune session n’existe.

Ce serveur d’aperçu écoute uniquement l’interface locale, n’authentifie personne et ne doit pas être utilisé en production. Ctrl+C l’arrête. Il masque les chemins commençant par un point, mais ce n’est pas une protection des jeux. Un serveur statique générique ou GitHub Pages laisse leurs URL directes accessibles.

## Fichiers et choix

- `index.html`, `assets/css/main.css` : ancien bouton remplacé par « Espace jeux », cadenas Font Awesome déjà fourni localement par le site. Aucune bibliothèque ni icône ajoutée.
- `espace-jeux/index.html`, `selection.html`, `style.css`, `access.js` : formulaire étiqueté, soumission native par Entrée, états d’erreur, cartes adaptatives, retour au site, branchement de session et déconnexion. Palette crème/brun du site ; pas de chargement de ses scripts globaux ni de son curseur personnalisé dans les jeux.
- `jeu/index.html`, `jeu/style.css` : retour discret vers le menu. Titre réel conservé : **Scene Pixel Art**. Le moteur, les images et la musique sont inchangés ; URL `/jeu/index.html` conservée.
- `PacQC/index.html`, `css/game.css`, `js/controller.js`, `tests/session.test.js` : retour au menu et pavé tactile, avec préservation du focus du canvas et de la pause. Les règles, le rendu, les cadrages, les PNG et le dimensionnement grand écran restent inchangés. Le nom de carte « PackQC » suit la demande ; le jeu conserve sa marque interne « PacQC » et son dossier existant sensible à la casse.
- `scripts/preview-games.ps1` : aperçu du site entier, adapté du serveur local existant de PacQC.
- `tests/access.test.mjs` : tests de l’interface avec API simulée, exécutables avec Node (`node tests/access.test.mjs`).
- `.gitignore`, `.env.example` : préparation de configuration privée ; **aucun serveur ne lit encore ces variables**. Aucun secret réel créé.

Les aperçus réutilisent `jeu/imagesjeu/Fond.png` et la planche `PacQC/docs/controle-sprites.png`. Cette dernière est une planche des personnages, pas une capture de partie. Les modules PacQC résolvent déjà leurs sprites relativement à leur URL ; aucun déplacement ni duplication des 30 PNG n’était nécessaire. PacQC ne contient actuellement aucun système sonore. Le premier jeu conserve sa musique, son bouton et son volume. Ses commandes sont au clavier ; aucun support tactile de déplacement préexistant n’a été trouvé.

## Ce qui manque pour un vrai accès privé

Il faut un hébergement capable d’intercepter **chaque requête avant de servir un fichier**, avec stockage privé de secrets, stockage de sessions et limiteur de tentatives. GitHub Pages seul ne fournit pas ce mécanisme pour un mot de passe personnel. La solution la plus directe pour conserver `/jeu/index.html` consiste à servir ce même site depuis un hébergement avec un petit backend, sur le même domaine. Une autre possibilité est un stockage privé pour les jeux derrière une fonction serveur ; l’origine de stockage doit alors refuser tout accès public.

Avant toute mise en ligne :

1. Choisir et configurer cet hébergement serveur. Protéger `/jeu/`, `/PacQC/` et `/espace-jeux/selection.html`, leurs variantes sans slash, toutes les images, JS, CSS, audio, l’atelier et les pages de tests. Normaliser les URL avant décision (encodage, segments `..`, slashs, casse selon le serveur). Ne jamais permettre à un serveur statique de contourner ce contrôle.
2. Retirer les copies privées du site GitHub Pages, de l’origine `github.io`, des autres domaines, des caches et de tout artefact public. Un proxy devant le domaine seul ne suffit pas si l’origine reste ouverte. Si le dépôt est public, ses fichiers restent téléchargeables via GitHub : stocker les jeux dans un dépôt/artefact privé ; les copies déjà publiques ne peuvent pas être rendues rétroactivement secrètes.
3. Définir **vous-même**, dans le gestionnaire de secrets du futur hébergeur, le hash serveur du mot de passe (`GAMES_PASSWORD_HASH`, Argon2id par exemple) et un secret de session aléatoire (`GAMES_SESSION_SECRET`). `.env.example` contient seulement des valeurs fictives et les noms proposés. Ne pas utiliser un hash calculé ou vérifié dans le navigateur. Un éventuel `.env` local doit rester hors de la racine servie et ignoré par Git ; `.gitignore` n’empêche pas à lui seul un serveur web de publier un fichier.
4. Implémenter le contrat ci-dessous, cookies de session opaques `HttpOnly; Secure; SameSite=Lax; Path=/`, expiration absolue (exemple : 1 heure), rotation à la connexion, invalidation serveur à la déconnexion, vérification d’origine et jeton CSRF pour les POST. Stocker les sessions et compteurs côté serveur, partagés entre instances. Limiter les tentatives par origine fiable et globalement, avec fenêtre temporelle et réponse 429. Ne pas journaliser le mot de passe.
5. Pour une URL directe HTML non authentifiée, rediriger vers `/espace-jeux/index.html?next=/jeu/index.html` ou l’équivalent PacQC. Pour une ressource privée, refuser avec 401/403, sans livrer le fichier. Valider `next` côté serveur sur une liste locale autorisée ; la liste du navigateur n’est pas une mesure de sécurité serveur.
6. Empêcher la mise en cache publique des réponses privées et de session (`Cache-Control: private, no-store`), utiliser HTTPS, puis effectuer les vérifications réelles ci-dessous. Une déconnexion ou expiration interdit les nouvelles requêtes ; elle ne peut pas effacer des fichiers déjà téléchargés ni interrompre automatiquement un jeu déjà chargé hors ligne.

### Contrat prévu par l’interface (non implémenté)

Toutes les réponses API doivent être JSON et non mises en cache, sur la même origine :

| Route | Requête | Réponse attendue |
| --- | --- | --- |
| `GET /api/games/session` | Cookie éventuel | 200 `{ "authenticated": false, "csrfToken": "jeton-serveur" }`, ou `true` si session valide ; prévoir aussi un contexte CSRF anonyme |
| `POST /api/games/login` | JSON `{ "password": "…", "next": "/jeu/index.html" }`, en-tête `X-CSRF-Token` | 200 `{ "authenticated": true }` avec cookie ; 401 JSON si incorrect ; 429 JSON si limite atteinte |
| `POST /api/games/logout` | JSON `{}`, en-tête `X-CSRF-Token` | 200 JSON après invalidation serveur et expiration du cookie |

Le navigateur ne conserve ni le mot de passe ni un hash ni un témoin d’authentification en localStorage. La sélection masquée et l’aperçu localhost sont de simples comportements d’interface, jamais un contrôle d’accès. Le futur serveur doit être sûr même si `access.js` est désactivé ou modifié.

## Dépôt Git imbriqué

`git ls-files --stage PacQC` indique un **gitlink (mode 160000)**. `PacQC/.git` existe mais le site n’a pas de `.gitmodules`, et ce dépôt imbriqué n’a pas de remote déclaré. Un clone neuf / déploiement ne récupérera donc pas automatiquement les fichiers du jeu.

L’historique imbriqué et l’index Git ont été préservés. Les changements PacQC se consultent avec `git -C PacQC diff`, séparément de `git diff`. Avant livraison Git, il faudra soit transformer ce dossier en fichiers ordinaires du site après sauvegarde de son historique, soit configurer un vrai sous-module privé et un build capable de le récupérer. Ne pas simplement committer le gitlink actuel : cela ne publie pas les changements internes. Cette normalisation n’est pas nécessaire pour l’essai local, et n’a pas été effectuée implicitement.

## Vérifications

Réalisées localement :

- **60/60 tests PacQC** : logique, cadrage, bonus, collisions, pause et contrôleur. Test contrôleur enrichi pour directions tactiles, focus et absence de reprise implicite en pause.
- **10/10 tests interface avec API simulée** : service absent, cartes masquées sur origine publique, aperçu local explicite, session valide, reprise vers chaque jeu, refus des redirections externes, mauvaise saisie, succès, réponse 429, déconnexion et session absente/expirée. Aucun mot de passe réel utilisé.
- HTTP local : pages du site, formulaire, sélection et deux jeux servis ; API absente en 404 ; fichiers cachés refusés. Les **30 PNG** du manifeste sont servis en 200 avec signature PNG. Cela ne remplace pas le décodage visuel dans un navigateur.
- Le premier moteur et ses ressources n’ont pas été modifiés. Les nouveaux liens restent dans les sous-dossiers attendus.

Non réalisées : aucun navigateur pilotable n’était disponible (inventaire vide, création d’un navigateur intégré refusée). Il reste à observer les pages à 390 px, 1366 px et 1920 px, vérifier le cadenas, le débordement, les visages/fantômes/bonus, le chargement visuel des 30 sprites, les vrais événements clavier/tactiles, le redimensionnement, les retours au menu et le son du premier jeu. Ouvrir `/PacQC/tests.html` permet aussi de relancer les tests dans votre navigateur.

Après configuration serveur, tester avec un navigateur neuf : incorrect puis correct via Entrée, accès aux deux jeux, actualisation, session encore valide, expiration raccourcie en environnement de test, déconnexion puis retour arrière, accès direct à chaque jeu et chaque type de ressource sans cookie, limite de tentatives, refus des URL encodées de contournement et impossibilité d’accès via une origine publique alternative. Ces validations de sécurité ne sont pas remplacées par les simulations.

Aucun commit, push ou déploiement effectué.

Note sur l’audit des liens : 39 références locales vérifiées dans les cinq pages intégrées. Une référence préexistante manque sur la page d’accueil : `assets/js/trailing-cursor.js`. Cette anomalie extérieure aux jeux a été conservée.
