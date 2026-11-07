# Publication de la refonte et retour arrière

**Publié le 6 novembre 2026 : `main` = `7a21297` (refonte), déploiement GitHub Pages réussi et contrôlé en ligne.** Version précédente : `dd3d1c0`, tag `sauvegarde-avant-publication-2026-11-06`.

| Élément | Valeur |
| --- | --- |
| Site public actuel | `origin/main` = `95750c5`, étiquette locale **`site-avant-refonte`** |
| Site définitif | branche locale **`site-definitif`** (`dfe6228`), dans le répertoire de travail `_site-definitif/`. Elle part de `95750c5` et n'a **pas** de branche amont, donc un `git push` sans destination explicite ne publie rien. |
| Travail de refonte | branche locale `refonte-visuelle-2026` : `_refonte/`, prototypes, suivi. **À ne jamais fusionner dans `main`** : le dépôt est public, donc son contenu deviendrait lisible sur GitHub. |
| Sauvegarde initiale | `9a3e4b7` (« Sauvegarde avant refonte visuelle ») |

## 1. À trancher avant la mise en ligne

1. **CV.** `CV/CVLeoM.pdf` est obsolète : maîtrise « en cours », pas de MBA, intitulé du poste différent, téléphone et courriels de trois référents en clair. Le site y renvoie depuis quatre boutons. Choisir l'une des options :
   - (a) Léo exporte depuis Canva un CV à jour et le place au même chemin, `_site-definitif/CV/CVLeoM.pdf` ;
   - (b) adopter le brouillon `_refonte/cv/CV-Leo-Matrat-brouillon-2026-11.pdf`, composé uniquement d'informations validées, sans téléphone ni références, en le copiant sur `_site-definitif/CV/CVLeoM.pdf` ;
   - (c) retirer temporairement les liens vers le CV.
   
   **Ne pas publier sans l'une de ces trois options.**
2. **Adresse postale dans le dépôt public.**
   - `CV/cvLaTeX.tex` est exclu du site par `_config.yml`, mais reste lisible sur GitHub tant qu'il est suivi.
   - Recommandation : `git rm CV/cvLaTeX.tex` dans `site-definitif` avant la fusion.
   - Le fichier restera dans l'historique Git. L'en effacer exigerait de réécrire l'historique : à n'envisager qu'avec l'accord explicite de Léo.
3. **Engagements.**
   - La consigne de la phase 11 ne cite que le Club Animé.
   - Nadeshicon et le Collectif de Québec pour la paix ont été ajoutés à la frise sur décision de Léo en phase 9.
   - Ils sont conservés ; à confirmer.

## 2. Publier (à faire par Léo, ou sur son ordre explicite)

```powershell
cd D:\Aijir0.github.io\_site-definitif
git fetch origin
git log -1 --format=%h origin/main          # doit afficher 95750c5 ; sinon fusionner origin/main et revérifier
git push origin site-definitif               # crée la branche sur GitHub (code visible, site inchangé)
git push origin site-avant-refonte           # facultatif : publie l'étiquette de retour arrière
```

Ensuite, sur GitHub :
1. Ouvrir une pull request `site-definitif` → `main` et relire le diff.
2. Fusionner, comme pour la PR #4. GitHub Pages reconstruit le site en une à deux minutes.

## 3. Contrôler en ligne (environ 10 minutes après, le temps que le cache se vide)

À vérifier, page par page :

| Doit répondre 200 | Doit répondre 404 |
| --- | --- |
| `/` | `/DESIGN.md` |
| `/travaux/artefacts-2050/`, `/travaux/researchrabbit/`, `/travaux/atlas/` | `/README.md` |
| `/artefacts-2050/`, `/PacQC/`, `/jeu/` | `/CV/cvLaTeX.tex` |
| `/espace-jeux/selection.html` | `/docs/INTEGRATION-JEUX.md` |
| `/projet_session/projet2.html`, `/presentation/rabb2.pdf` | `/tests/preview.test.mjs` |
| `/CV/CVLeoM.pdf` | `/scripts/preview-games.ps1` |
| `/assets/site/site.css`, `/favicon.ico` | `/projet_annexe/semantic_scholar_search.py`, `/_config.yml` |

Le script `_refonte/outils/verifier-site.mjs` peut aussi être pointé sur `https://leomatrat.com` : il faut alors remplacer `B`.

## 4. Retour arrière vers la version précédente (`dd3d1c0`)

Sans réécrire l'historique ni utiliser `--force` : on crée sur `main` un nouveau commit dont le contenu est celui du tag de sauvegarde, puis on l'envoie en avance simple.

```powershell
cd D:\Aijir0.github.io
git fetch origin
$c = git commit-tree "sauvegarde-avant-publication-2026-11-06^{tree}" -p origin/main -m "Retour à la version du 6 novembre 2026 (dd3d1c0)"
git push origin "$($c):refs/heads/main"
```

GitHub Pages republie en une à deux minutes. Pour revenir à la refonte ensuite : `git push origin <commit-de-refonte>:main` n'est plus une avance simple ; utiliser le même procédé avec `7a21297^{tree}`.
Dernier recours : l'archive `D:\Sauvegardes-Site-Web\leomatrat-com-dd3d1c0-2026-11-06.zip` (224 fichiers identiques au commit).
