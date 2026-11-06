# Occasions d'animation dans V2bis (skill find-animation-opportunities, phase 9)

Balayage de `_refonte/prototypes/v2bis/` (`index.html`, les trois fiches, `v2bis.css`, `../commun/base.css`, `../commun/signatures.js`).
Méthode : chaque candidat passe quatre contrôles (fréquence, rôle, durée, fonction). Les courbes utilisées sont celles du dépôt : `--ease-out`, `--ease-in-out`, `--ease-drawer`.

**Fréquences.** Un portfolio est rarement visité : un recruteur vient une à trois fois.
- L'accueil et les fiches relèvent donc de la catégorie « première visite / occasionnel », où l'on a droit au plaisir.
- Le sommaire, les survols de l'index et les notes sont utilisés des dizaines de fois au cours d'une visite. Ils restent rapides.

## 1. Occasions retenues

| # | Où | Aujourd'hui | Rôle | Fréquence | Mouvement proposé |
| --- | --- | --- | --- | --- | --- |
| 1 | Premier écran (`index.html`, `.tete`, `.manchette`, `.une`) | Chaque bloc apparaît seul : les lignes montent, puis fondu de 600ms. Rien ne relie les filets, le portrait et la figure. | Plaisir (première visite) et éviter une arrivée brutale | Première visite | **Composition orchestrée.** Les filets se tracent (`scaleX` de 0 à 1, 900ms, `--ease-in-out`). Le portrait se « développe » (`clip-path`, et `grayscale` de 1 à 0). La figure à la une se découvre (`clip-path` de gauche à droite, 1000ms) pendant que son image se resserre (`scale` de 1,08 à 1). Le stylo vient en dernier. Durée totale d'environ 1,8s, interrompue au premier geste, une fois par session. |
| 2 | Index des travaux vers une fiche (`index.html` lignes 81 à 92, fiches) | Seule la figure d'Artéfacts devient la page (nom fixe `fig-artefacts`). ResearchRabbit et Atlas changent de page sans continuité. | Continuité spatiale | Occasionnel | Le nom de transition est posé au clic sur la vignette visible et sur le titre (`pageswap`), puis retrouvé au retour (`pagereveal`). 450ms, `--ease-in-out`. Un lien « réalisation suivante » glisse latéralement (types de View Transitions). |
| 3 | Figure annotée (`index.html` lignes 98 à 118) | Les appels s'activent ; le tracé de tendance se dessine une fois. Rien ne désigne la zone du graphique dont parle la note. | Explication | Occasionnel | Un **cercle au stylo** se trace autour de la zone commentée quand la note s'active (`stroke-dashoffset` de 1 à 0, 450ms, `--ease-out`). À la première lecture, les trois cercles se tracent l'un après l'autre après la tendance. |
| 4 | Images des travaux et des fiches (`.a-la-une .cadre img`, `.t-vignette img`, figures des fiches, portrait) | Images fixes ; zoom de 1,025 au survol. | Profondeur, plaisir | Occasionnel | **Parallaxe dans le cadre** : l'image glisse de ±3 à ±10 % dans un cadre immobile. Animation CSS liée au défilement (`animation-timeline: view()`), donc sans JavaScript et hors du fil principal. Propriété `translate` seulement : le zoom au survol reste actif. Désactivée en mouvement réduit et sans prise en charge. |
| 5 | Frise (`.frise`) | Les barres se tracent dans l'ordre du document. | Explication, indication d'état | Occasionnel | Barres tracées **dans l'ordre chronologique**. Un repère « aujourd'hui », calculé à partir de la date du jour (il ne se périme donc pas), apparaît en rouge à la fin. Au survol, les autres barres s'estompent (opacité 0,3, 200ms). |
| 6 | Manchette (`.manchette .sommaire`) | Une jauge de 1px sous chaque rubrique. | Indication d'état | Dizaines de fois par visite | Un **trait unique glisse** d'une rubrique à l'autre (`translateX` et `scaleX`, 300ms, `--ease-in-out`). Il montre aussi la progression. Rapide et interruptible. |

Toutes ces animations n'animent que `transform`, `opacity`, `clip-path` ou `stroke-dashoffset`. En mouvement réduit, il ne reste que des fondus (pas de déplacement), ou rien.

## 2. Candidats écartés

- **Parallaxe ou animation du graphique de régression** (`.graphique img`). Écarté par le contrôle de **fonction** : ce sont des données que le lecteur lit ; elles ne bougent pas pour le style. Seules les annotations (tracé, cercles) s'animent.
- **Curseur personnalisé qui suit la souris** (l'ancien site chargeait `trailing-cursor.js`). Écarté par la **fréquence** (chaque mouvement de souris) et le **rôle** (aucun).
- **Défilement lissé détourné, de type Lenis.** Écarté par la **fonction** : il modifie le défilement natif, gêne le clavier, les lecteurs d'écran et le tactile, et ajoute une dépendance.
- **Inclinaison 3D des vignettes au survol.** Écarté par le **rôle** (décoration) ; `DESIGN.md` interdit l'inclinaison.
- **Compteurs animés** (années, 4 000 participants). Écarté par la **fonction** : des chiffres qui défilent sont plus longs à lire que des chiffres fixes.
- **Animation du tiroir et du sommaire à chaque clic.** Déjà rapide et juste ; rien à ajouter (utilisé des dizaines de fois).

## 3. Verdict

V2bis est déjà juste pour un usage fréquent. Ce qui lui manque relève du **budget de première visite** : une entrée qui compose la page, comme une une qu'on monte, et une continuité entre les travaux et leurs fiches. Ce sont les deux leviers les plus forts, dans cet ordre. Les annotations vivantes (3) sont la signature la plus propre au concept. La parallaxe (4) apporte de la profondeur, à doser.

La suite (choix, laboratoire, revue) est dans `_refonte/prototypes/labo/` et `_refonte/DESIGN.md` § 11.
