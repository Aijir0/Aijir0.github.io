# Créer votre site web avec GitHub Pages

Bienvenue ! Ce guide vous expliquera comment utiliser GitHub Pages pour créer votre propre site web personnel en utilisant un template HTML. Suivez attentivement chaque étape, même si vous n'êtes pas familier avec GitHub.
Faire un commit

## Modifications

Mes modifications sont indiquées par un emoji "✅" ou "❌" et l'utilisation d'un ~~texte barré~~.
- "✅" Correspond à une tâche effectuée
- "❌" Correspond à une tâche abandonnée

Mes futurs ajouts sont indiqués par un emoji "✍️".

## Prérequis

- Avoir un compte GitHub. Si vous n'en avez pas encore, créez-en un sur [github.com](https://github.com).
- Avoir Git installé sur votre ordinateur. Vous pouvez télécharger Git [ici](https://git-scm.com/downloads) si ce n’est pas déjà fait.
- Un éditeur de texte comme RStudio ou Visual Studio Code pour modifier le code HTML.

---

## ~~Étape 1: Créer un répertoire GitHub Pages~~ ✅

1. Connectez-vous à GitHub.
2. Cliquez sur **"Use this template"** (bouton vert en haut à droite).
3. Sélectionnez **Create a new repository**
4. Dans la section **Repository name**, entrez votre nom d'utilisateur suivi de `.github.io`. Par exemple, si votre nom d'utilisateur est `johndoe`, nommez le répertoire `johndoe.github.io`. Cela est essentiel pour que GitHub reconnaisse votre site.
5. Assurez-vous que le répertoire est **Public** et cliquez sur **Create repository**.

---

## ~~Étape 2: Cloner le répertoire sur votre ordinateur~~ ✅

Vous allez maintenant copier le répertoire sur votre machine pour pouvoir le modifier.

1. Sur la page de votre répertoire (par exemple, `https://github.com/johndoe/johndoe.github.io`), cliquez sur le bouton vert **Code**.
2. Copiez le lien du répertoire.
3. Ouvrez une fenêtre de terminal (ou Git Bash si vous êtes sur Windows) et tapez la commande suivante pour cloner le répertoire dans un dossier sur votre ordinateur :
   
   ```bash
   git clone https://github.com/username/username.github.io
   ```

   Remplacez `username` par votre propre nom d'utilisateur GitHub.

4. Accédez au répertoire cloné :

   ```bash
   cd username.github.io
   ```

---

## ~~Étape 3: Modifier le fichier HTML~~ ✅

Maintenant que vous avez cloné le répertoire sur votre machine, vous pouvez modifier le fichier HTML pour y ajouter vos informations personnelles.
Vous pouvez utiliser RStudio pour éditer le code HTML, ou tout autre éditeur de texte.
Ouvrez le fichier index.html dans votre éditeur de texte.
Il est bon de savoir que le nom du fichier index.html est important, car c'est le fichier qui sera affiché par défaut lorsque quelqu'un visite votre site.
Les navigateurs web cherchent automatiquement un fichier index.html dans le répertoire racine d'un site web.

### Modifications à apporter

#### ~~1. Le titre du site~~ ✅

Dans le fichier `index.html`, trouvez cette ligne :

```html
<title>Ce qui va apparaître dans la tab de votre site</title>
```

Remplacez le texte entre les balises `<title>` par le titre que vous souhaitez pour votre site. 1Ce texte apparaîtra dans l'onglet de votre navigateur.

#### ~~2. Votre nom et description~~ ✅

Dans la section `header` du fichier HTML, modifiez les éléments suivants :

- **Nom** : Remplacez `VOTRE NOM` par votre propre nom.

```html
<h1 id="logo"><a href="#">VOTRE NOM</a></h1>
```

- **Description** : Écrivez une courte description de vous-même.

```html
<p>
  Une courte description de vous<br />
  Continuer la courte description
</p>
```
~~Ajouter une option pour ouvrir cet espace de façon latéral : icône de menu hamburger.~~ ❌

#### ~~3. Votre photo~~ ✅

Remplacez l'image de profil par une image de vous. Pour cela, vous devez remplacer le fichier `portrait.png` dans le dossier `images` par votre propre image et vous assurer que le nom du fichier est identique.

```html
<img src="images/portrait.png" alt="" />
```

Si vous nommez l'image différemment, modifiez également la ligne ci-dessus avec le nouveau nom de fichier.

#### 4. ~~Sections de navigation~~ ✅

Vous pouvez modifier les sections suivantes dans la barre de navigation :

```html
<li><a href="#one" class="active">À propos</a></li>
<li><a href="#two">Mon travail</a></li>
<li><a href="#three">Mon CV</a></li>
<li><a href="#four">Contact</a></li>
```

Ces liens renvoient aux différentes sections de votre site. Vous pouvez modifier les noms des sections si vous le souhaitez.

#### 5. ~~Vos réseaux sociaux~~ ✅

Modifiez les liens des réseaux sociaux dans la section `footer` :

```html
<a href="https://x.com/MLB/" class="icon brands fa-twitter"><span class="label">Twitter</span></a>
<a href="#" class="icon brands fa-facebook-f"><span class="label">Facebook</span></a>
<a href="#" class="icon brands fa-linkedin"><span class="label">LinkedIn</span></a>
<a href="#" class="icon brands fa-github"><span class="label">Github</span></a>
```

Remplacez `href="#"` par le lien vers vos comptes de réseaux sociaux.

- ~~Ajouter pour l'icone courriel : copie de mon mail lors du clic.~~ ✅

- ~~Supprimer twitter et mettre instagram ?~~ ✅

#### 6. ~~Texte de la page d'accueil~~ ✅

Modifiez le texte dans la section suivante pour écrire quelque chose de personnel à propos de vous :

```html
<p>
  Faucibus sed lobortis aliquam lorem blandit. Lorem eu nunc metus
  col. Commodo id in arcu ante lorem ipsum sed accumsan erat
  praesent faucibus commodo ac mi lacus. 
</p>
```

#### 7. ~~Section « Mes réalisations »~~ ✅

Ajoutez vos propres projets ou réalisations dans la section `two` :

```html
<h3>Mes réalisations</h3>
<p>Décrivez ici vos travaux ou projets.</p>
```

#### 8. ~~Section « Me joindre »~~ ✅

Trouvez cette ligne et modifiez-la pour ajouter votre propre adresse e-mail :

```
<a href="mailto:your-email@example.com?subject=Sujet&body=Votre message ici." class="button primary">`
```

#### 9. Personnalisation supplémentaire

Vous pouvez personnaliser davantage le site en modifiant les couleurs, les polices, les images, etc. dans le fichier CSS `main.css`.

- ~~Utiliser [Bootstrap](https://getbootstrap.com/) pour m'aider avec les modifications~~ ❌

- ~~Ajouter un fond différent avec un voyage et une indication de la destination~~. ✅ 

- ~~Ajouter une musique NCS et une petite icône pour la couper à tout moment, l'icône doit descendre à mesure que l'utilisateur descend la page.~~ ❌

- ~~Améliorer et trouver une meilleure option d'accessibilité (taille de police, couleur daltonien et lecture de texte).~~ ❌ 

- ~~Ajout de Font Awesome et Flaticon pour l'utilisation d'icônes.~~ ✅

- ~~Modifier l'animation et la position de l'îcone pour le voyage.~~ ✅

- ~~Ajouter un timer pour le nombre de temps passé dans la fonction publique dans la section (MON CV)~~ ✅

- ~~Permettre au gens de cliquer sur l'image pour télécharger mon CV !~~ ✅

- Changer le script "Année et mois" et afficher que mois lorsque jours = 0 ✍️

- Ajouter une autre page avec une carte interactive retrançant des voyages et racontant quelques annecdotes. ✍️

## ~~ Étape 4: Pousser les modifications sur GitHub~~ ✅

Une fois que vous avez fait toutes les modifications, vous devez les envoyer sur GitHub pour que votre site soit mis à jour.

1. Dans votre terminal, tapez les commandes suivantes :

```bash
git add .
git commit -m "Mise à jour du site avec mes informations"
git push origin main
```

Cela enverra vos modifications sur GitHub.

---

## ~~ Étape 5: Activer GitHub Pages~~ ✅

1. Allez sur la page de votre répertoire sur GitHub.
2. Cliquez sur **Settings**.
3. Dans la barre latérale gauche, cliquez sur **Pages**.
4. Sous **Source**, sélectionnez **main** et **root**.
5. Cliquez sur **Save**. 

Votre site sera maintenant accessible à l'adresse `https://username.github.io`, où `username` est votre nom d'utilisateur GitHub.

---

### Félicitations ! 🥂

Vous avez maintenant un site web fonctionnel hébergé gratuitement sur GitHub Pages. Vous pouvez y ajouter plus de contenu et personnaliser votre site autant que vous le souhaitez.

---

N'hésitez pas à poser des questions si vous rencontrez des difficultés. Bonne chance !


## ~~Étape 6: Bonus! Ajouter un nom de domaine personnalisé~~ ✅

Ce guide explique comment lier votre site GitHub Pages à votre nom de domaine personnalisé en utilisant Namecheap. Dans cet exemple, nous utiliserons le domaine `votrenom.com` comme domaine personnalisé.

### Prérequis

1. Un répertoire GitHub avec un site GitHub Pages configuré (par exemple, `username.github.io` ou `organisation.github.io`).
2. Un nom de domaine personnalisé enregistré chez un fournisseur de nom de domaine comme Namecheap (par exemple, `votrenom.com`).

### ~~Étape 1 : Configurer les Enregistrements DNS sur Namecheap~~ ✅

Nous devons configurer les paramètres DNS sur Namecheap pour pointer votre domaine vers GitHub Pages.

1. **Connectez-vous à Namecheap :**
   - Allez sur [namecheap.com](https://www.namecheap.com) et connectez-vous à votre compte.

2. **Accéder à la Liste de Domaines :**
   - Depuis le tableau de bord, cliquez sur **Domain List** dans la barre latérale gauche.
   - Trouvez votre domaine (par exemple, `votrenom.com`) et cliquez sur **Manage**.

3. **Mettre à Jour les Paramètres DNS :**
   - Dans la section **DNS**, réglez **Nameservers** sur **Namecheap Basic DNS** si cela n'est pas déjà fait.

4. **Ajouter les Enregistrements DNS Suivants :**

   - Dans la page **Advanced DNS**, ajoutez cliquez sur `ADD NEW RECORD` et ajoutez les enregistrements suivants :

   | Type d'Enregistrement | Hôte           | Valeur                          | TTL  |
   |-----------------------|----------------|---------------------------------|------|
   | CNAME Record                 | www            | `username.github.io`            | Automatique |
   | A Record       | @              | `185.199.108.153`               | Automatique |
   | A Record       | @              | `185.199.109.153`               | Automatique |
   | A Record       | @              | `185.199.110.153`               | Automatique |
   | A Record       | @              | `185.199.111.153`               | Automatique |

   **Explication :**
   - L'enregistrement `CNAME` pointe `www.votrenom.com` vers votre site GitHub Pages.
   - Les enregistrements `A` garantissent que `votrenom.com` (sans `www`) pointe également vers le même site GitHub Pages.

5. **Enregistrer les Modifications** et attendez que les paramètres DNS se propagent. Cela peut prendre de quelques minutes à plusieurs heures.

### ~~Étape 2 : Configurer GitHub Pages pour un Domaine Personnalisé~~ ✅

1. **Accéder à Votre répertoire :**
   - Allez dans le répertoire GitHub qui héberge votre site GitHub Pages.

2. **Ouvrir les Paramètres du répertoire :**
   - Cliquez sur l’onglet **Settings** dans votre répertoire.

3. **Aller dans Pages :**
   - Dans la section **Code and automation**, trouvez le lien **Pages**.

4. **Définir le Domaine Personnalisé :**
   - Dans le champ **Custom domain**, entrez votre nom de domaine (par exemple, `www.votrenom.com`).

5. **Créer un Fichier `CNAME` (Optionnel mais Recommandé) :**
   - Dans le répertoire racine de votre répertoire, créez un fichier nommé `CNAME`. Vous pouvez le faire directement sur GitHub.
   - À l’intérieur du fichier `CNAME`, ajoutez votre nom de domaine personnalisé, par exemple :
     ```
     www.votrenom.com
     ```



### ~~Étape 3 : Vérifier la Configuration~~ ✅

1. **Visitez Votre Domaine :**
   - Ouvrez un navigateur et visitez `www.votrenom.com`. Il devrait afficher votre site GitHub Pages.
   - Essayez également de visiter `votrenom.com`, pour vous assurer que les deux domaines, avec et sans `www`, fonctionnent.

2. **Vérifier le HTTPS :**
   - Une fois que GitHub Pages configure le HTTPS (cela peut prendre quelques minutes), assurez-vous que votre site est accessible via HTTPS (`https://www.votrenom.com`).

### Dépannage

- **Temps de Propagation des DNS :** Les modifications des enregistrements DNS peuvent prendre du temps à se propager. Vous pouvez vérifier l'état DNS avec des outils en ligne comme [WhatsMyDNS](https://www.whatsmydns.net/).
- **Problèmes de HTTPS :** Si le HTTPS ne fonctionne pas, assurez-vous que l'option **Enforce HTTPS** est cochée dans les paramètres GitHub Pages et que les enregistrements DNS sont correctement configurés.

## Ressources

- [Documentation GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Configuration DNS sur Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/9776/2237/how-to-set-up-dns-records-for-your-domain-in-namecheap)

Voilà ! Vous avez réussi à lier votre site GitHub Pages au domaine personnalisé `votrenom.com`.

# Critères d'évaluation

- Site Web sur GitHub (30%)
    - Le site web est hébergé sur GitHub, et le répertoire est accessible.
    - Les commits sont visibles et montrent un suivi régulier du travail effectué.
- Respect des étapes et des modifications demandées (60%)
    - L'étudiant.e a suivi les étapes du ReadMe.
    - Les sections essentielles ont été complétées et modifiées correctement.
    - Le contenu du site est pertinent par rapport aux objectifs du projet.
- Personnalisation avancée (10%)
    - L'étudiant.e ont personnalisé leur site (changement de couleurs, utilisation d’un autre template, ajustements spécifiques à leurs besoins).
    - Les modifications vont au-delà des consignes de base, démontrant une initiative supplémentaire.
