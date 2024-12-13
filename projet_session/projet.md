# Question de recherche et hypothèse

## Question de recherche
Comment les politiques publiques, mesurées par les dépenses sociales (% du PIB), influencent-elles les inégalités sociales dans les pays de l’OCDE ?

## Revue de littérature
1. **Impact des dépenses sociales sur les inégalités** : La littérature existante montre que des dépenses sociales plus élevées, notamment en matière de transferts monétaires et de subventions, réduisent significativement les taux de pauvreté et d’inégalités. Ces dépenses favorisent une meilleure redistribution des ressources, en particulier dans les pays à forte progressivité fiscale (OCDE, 2022 ; OCDE, 2024).
2. **Rôle des facteurs économiques** : Bien que les dépenses sociales soient un levier efficace, d’autres variables, comme le PIB par habitant et le taux de chômage, influencent également les inégalités. Le chômage, en particulier, exacerbe les disparités sociales en limitant l’accès à l’emploi et en augmentant la dépendance aux transferts publics (OCDE, 2023).
3. **Limites des politiques actuelles** : Les politiques universelles ou mal ciblées peuvent manquer d’efficacité pour les groupes les plus vulnérables. Des approches adaptées aux contextes nationaux sont nécessaires pour maximiser leur impact (OCDE, 2023).

## Hypothèse de recherche
Les politiques publiques, mesurées par les dépenses sociales (% du PIB), ont un effet significatif et négatif sur les inégalités sociales dans les pays de l’OCDE. Plus précisément :
- Une augmentation des dépenses sociales est associée à une réduction des inégalités, mesurées par le taux de pauvreté.
- Les effets des dépenses sociales sont amplifiés dans les pays avec des systèmes fiscaux progressifs.
- D'autres facteurs, comme le taux de chômage, aggravent les inégalités, tandis que le PIB par habitant a un effet modéré.

## Outils utilisés
1. **Elicit** : Cet outil m’a permis d’identifier des articles académiques clés en lien avec les dépenses sociales et les inégalités. Grâce à ses capacités de tri et de recherche ciblée, il a facilité l’accès à des sources fiables, réduisant le temps consacré à la revue de littérature.
2. **ChatGPT** : En complément, ChatGPT m’a aidé à formuler des résumés et à identifier des concepts clés dans les textes, garantissant une compréhension claire des arguments.
3. **NotebookLM** : Cet outil a été utilisé pour explorer les rapports de l’OCDE. Sa capacité à extraire des plans détaillés et à citer des passages pertinents a guidé ma recherche vers les sections les plus utiles.

## Conclusion
Cette approche structurée, soutenue par des outils numériques performants, a permis de formuler une hypothèse rigoureuse basée sur une compréhension approfondie de la littérature scientifique. L’analyse des données collectées permettra de valider ou d’affiner cette hypothèse, en éclairant le rôle des politiques publiques dans la réduction des inégalités.

---

# Collecte de données
Pour répondre à mon hypothèse, j'ai utilisé une approche méthodique pour identifier et collecter des données pertinentes. J'ai d'abord exploité la fonction de recherche sur le Web de ChatGPT, qui m'a permis d'identifier les banques de données disponibles sur le site de l'OCDE, notamment l'OECD Data Explorer.

## Étapes de la collecte
1. **Filtrage des données** : J'ai utilisé les filtres du site pour sélectionner les données correspondant à mes critères de recherche, notamment les niveaux d'inégalités de revenus et de pauvreté dans les pays de l'OCDE.
2. **Prévisualisation** : Avant de télécharger, j'ai vérifié les données pour m'assurer de leur pertinence par rapport à mon hypothèse.
3. **Téléchargement** : Une fois les données filtrées, je les ai exportées au format CSV, ce qui permet une analyse ultérieure facile dans des outils comme Excel ou R.

Ce processus m'a permis de collecter des données prétriées et fiables, directement exploitables pour répondre à mes objectifs de recherche.

---

# Analyse et visualisation des données

## Détails de l'approche
1. **Chargement des données** : J'ai importé les fichiers CSV contenant les données sur les inégalités, les dépenses sociales, le taux de chômage et le PIB par habitant. Chaque fichier a été nettoyé pour ne conserver que les colonnes pertinentes et les données à partir de l'année 2010.
2. **Nettoyage et fusion** :
   - J'ai renommé les colonnes pour une meilleure lisibilité.
   - Les données ont été fusionnées en un seul tableau basé sur les variables communes (pays et période).
   - Les valeurs manquantes ont été éliminées pour garantir l'intégrité des analyses.
3. **Analyse statistique** :
   - Une régression linéaire multiple a été réalisée pour évaluer l'impact combiné des dépenses sociales, du taux de chômage et du PIB par habitant sur les inégalités. Cela a permis d'identifier les variables les plus significatives.
4. **Visualisations** :
   - Des diagrammes de dispersion ont été créés pour représenter les relations entre les variables.
   - Une ligne de tendance (régression linéaire) a été ajoutée à chaque graphique pour mieux comprendre les corrélations.

## Visualisations produites
1. **Résumé du Modèle Linéaire** :
   - Ce graphique montre les résultats de ma régression linéaire.

   ![Résumé du Modèle Linéaire](images/Model.png)


2. **Relation entre dépenses sociales et inégalités** :
   - Ce graphique montre une corrélation négative, indiquant que des dépenses sociales plus élevées sont associées à des inégalités plus faibles.

   ![Relation entre dépenses sociales et inégalités](images/Relation1.png)

3. **Relation entre PIB par habitant et inégalités** :
   - Une tendance similaire est observée : un PIB par habitant plus élevé tend à réduire les inégalités.

   ![Relation entre PIB par habitant et inégalités](images/Relation2.png)


4. **Relation entre taux de chômage et inégalités** :
   - Une corrélation positive est visible, suggérant que des taux de chômage plus élevés augmentent les inégalités.

   ![Relation entre taux de chômage et inégalités](images/Relation3.png)

---

# Discussion

## Choix des outils utilisés
1. **Microsoft Planner** : Organisation des tâches et gestion des échéances.
2. **ChatGPT** : Recherche et rédaction.
3. **Elicit** : Recherche académique ciblée.
4. **NotebookLM** : Analyse de documents complexes.
5. **R et RStudio** : Analyse statistique et visualisation des données.

## Résultats principaux et interprétation
Les résultats montrent que les dépenses sociales ont un effet significatif et négatif sur les inégalités sociales. Cependant, des limites comme l’absence de variables fiscales spécifiques ou l’hétérogénéité contextuelle entre pays doivent être prises en compte.

## Recommandations pour des recherches futures
Les limites identifiées ouvrent des pistes pour des analyses complémentaires avec des bases de données plus détaillées.

En conclusion, les outils sélectionnés ont permis de répondre efficacement à la question de recherche tout en garantissant une méthodologie rigoureuse.
