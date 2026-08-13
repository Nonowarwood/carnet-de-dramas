# Carnet de dramas

Site statique recensant mes visionnages de dramas depuis janvier 2025, avec mes notes,
celles du public, et mes critiques.

En ligne : <https://nonowarwood.github.io/carnet-de-dramas/>

## Direction artistique

Grotesque serrée en gros corps, filets noirs pleine largeur, libellés en monospace
capitales espacées, accent orange `#ff5c2b` complété de lilas et de vert d'eau.
Aucun angle arrondi, aucun emoji : les repères visuels sont des numéros `01 → 30`
et des icônes SVG. Un seul thème, clair, assumé comme tel.

## Structure

```
index.html              Porte d'entrée : le carrousel cylindrique des 30 affiches
carnet.html             Chiffres clés, critiques, derniers visionnages, à voir
visionnages.html        Les 30 fiches, avec recherche, tri et filtre par pays
moi.html                « Ce que mes visionnages disent de moi » : le portrait chiffré
critiques/              Une page par critique
assets/data.js          Toutes les données de visionnage
assets/site.js          Icônes, jauges, note de consensus, rendu des fiches
assets/charts.js        Graphiques (barres, colonnes, barre empilée)
assets/anim.js          Révélations, compteurs, transitions de page
assets/guide.js         Visite guidée interactive
assets/style.css        Feuille de style unique, carrousel, graphiques et guide
assets/posters/         Affiches, nommées d'après le titre en minuscules-tirets
assets/people/          Portraits des acteurs, nommés d'après leur nom en minuscules-tirets
```

## La note du public

Deux sources alimentent la note affichée :

| Source | Couverture | Moyenne observée | Écart-type |
|--------|-----------|------------------|-----------|
| MyDramaList | 30 / 30 | 8,43 | 0,44 |
| Viki | 12 / 30 | 9,48 | 0,21 |

Les deux plateformes notent sur des échelles incomparables — plus d'un point
d'écart systématique, Viki étant alimentée par un public de fans qui note très
haut et très resserré. Une moyenne arithmétique mesurerait surtout cet écart de
culture de notation.

Chaque note est donc **centrée réduite sur sa propre plateforme**, les scores
obtenus sont combinés, puis le résultat est ramené sur l'échelle MyDramaList —
la seule qui couvre les 30 titres, donc la plus lisible comme référence. Viki
est pondérée par son nombre de votes (saturation à 100 000) : une note assise
sur 6 000 votes pèse moins qu'une note assise sur 280 000. Tout est dans
`preparerConsensus()`, dans `assets/site.js`.

Nautiljon avait été envisagé comme troisième source mais bloque les accès
automatisés (HTTP 403 sur toutes les voies testées), et ses notes agrégées ne
sont pas récupérables autrement sans risque de confusion avec celles du manhwa
ou d'une autre saison.

## Ajouter un drama

Tout se passe dans `assets/data.js`. Copier un bloc du tableau `DRAMAS` et compléter :

| Champ        | Description                                                    |
|--------------|----------------------------------------------------------------|
| `titre`      | Le titre tel que je le note                                    |
| `mention`    | Précision facultative (saisons vues, titre officiel différent…) |
| `pays`       | `"KR"`, `"JP"` ou `"CN"`                                       |
| `annee`      | Année de première diffusion                                    |
| `episodes`   | Texte libre, ex. `"16 ép."` ou `"Film"`                        |
| `genres`     | Tableau de genres                                              |
| `noteMdl`    | Moyenne MyDramaList, sur 10                                    |
| `noteViki`   | Moyenne Viki, sur 10 — facultatif                              |
| `votesViki`  | Nombre de votes Viki, sert à pondérer le consensus             |
| `episodesNb` | Nombre d'épisodes, en nombre (sert au calcul des heures)        |
| `dureeEp`    | Durée d'un épisode en minutes                                  |
| `chaine`     | Diffuseur d'origine                                            |
| `realisateur`| Réalisateur                                                    |
| `acteurs`    | Rôles principaux, dans l'ordre du générique                    |
| `mdl`        | Chemin de la fiche MyDramaList, ex. `"/758615-melo-movie"`      |
| `note`       | Ma note sur 5 (`null` si pas encore notée)                     |
| `mois`       | Mois de visionnage, au format `"AAAA-MM"`                       |
| `synopsis`   | Résumé en français                                             |

Déposer l'affiche dans `assets/posters/` sous le nom donné par le titre en
minuscules avec tirets — `Mr. Plankton` devient `mr-plankton.jpg`. C'est la
fonction `slug()` de `assets/site.js` qui fait la correspondance : aucun chemin
à écrire à la main.

La note Viki se récupère sur l'API publique, sans clé :

```sh
curl -s "https://api.viki.io/v4/search.json?app=100000a&term=TITRE" # -> id
curl -s "https://api.viki.io/v4/containers/ID.json?app=100000a"     # -> review_stats
```

## Ajouter une critique

1. Dupliquer `critiques/melo-movie.html` et écrire le texte.
2. Dans `assets/data.js`, ajouter au drama concerné : `critique` (chemin vers la
   page), `critiqueDate` et `critiqueExtrait`.

Le carnet détecte automatiquement les dramas qui ont une critique.

## La page portrait

`moi.html` agrège les 30 fiches en sept sections indépendantes : le temps passé, le
rythme de visionnage, les acteurs récurrents, les années de production, les
diffuseurs, les origines et les genres. Le temps est calculé série par série
(`episodesNb × dureeEp`), pas estimé.

La section « rythme » s'appuie sur le champ `mois` et affiche tous les mois de la
période, y compris ceux sans visionnage : un creux est une information, pas un trou
à masquer.

Les graphiques sont en HTML et CSS, sans bibliothèque (`assets/charts.js`). Règles
suivies : une seule teinte par graphique à série unique — la longueur porte déjà la
magnitude ; marques de 24 px maximum, extrémité arrondie à 4 px côté valeur et
carrée côté ligne de base ; grille en filet solide ; le texte ne porte jamais la
couleur de la série ; infobulle au survol et tableau de données dépliable sous
chaque graphique, pour que la couleur ne soit jamais le seul canal d'information.

La palette des graphiques est validée pour les daltonismes sur fond blanc
(protanopie, deutéranopie, tritanopie — ΔE OKLab ≥ 8 entre paires adjacentes,
≥ 15 en vision normale, contraste ≥ 3:1) :

| Section | Teinte |
|---|---|
| Le temps | `#e2551f` |
| Les acteurs | `#2a5fd6` |
| Les années | `#6b4fd8` |
| Les diffuseurs | `#0f8a6a` |
| Les genres | `#c9308a` |

Les graphiques du temps et des acteurs portent une vignette par ligne : l'affiche
pour les séries, le portrait pour les acteurs. Il suffit de passer une clé `image`
dans les données d'une barre pour que la colonne apparaisse.

La section des genres se termine par un index typographique : chaque genre porté par
au moins deux séries a sa ligne, les genres croisés une seule fois sont regroupés en
fin de bloc. Le nom du genre renvoie vers `visionnages.html?genre=…`, ce qui
présélectionne le filtre correspondant. Ce filtre n'expose que les genres présents
dans au moins trois séries — en dessous, il ne servirait à rien.

À noter : MyDramaList ne recense que le **diffuseur d'origine**, pas le studio de
production. La section « diffuseurs » mesure donc qui a diffusé, pas qui a produit,
et le dit explicitement.

Les portraits d'acteurs viennent des vignettes de casting des fiches de séries : les
pages « personne » de MyDramaList renvoient 403 aux accès automatisés.

## Carrousel

Les panneaux sont répartis sur un cercle avec `rotateY(i × pas) translateZ(rayon)`,
le conteneur tournant en sens inverse. Le dos des panneaux lointains reste visible
(`backface-visibility: visible`), ce qui produit les reflets inversés. Le rayon est
recalculé à chaque redimensionnement. Interactions : glisser, molette, flèches du
clavier, plus une rotation continue quand on ne touche à rien.

Les panneaux sont posés dans le sens antihoraire (`rotateY(-i × pas)`) : combiné à
une rotation croissante, cela fait défiler les affiches **de gauche à droite** tout
en parcourant la liste dans l'ordre, de 01 à 30.

## Guide interactif

Le guide ne s'ouvre **que sur demande**, par le bouton « Guide » de l'en-tête. Le
parcours est décrit dans `PARCOURS`, au début de `assets/guide.js` : une entrée par
page, chaque étape désignant un sélecteur, un titre et un texte. Une étape peut
porter une clé `suite` pour enchaîner sur une autre page — le relais passe par
`sessionStorage`, et le guide reprend tout seul à l'arrivée.

## Animations

Tout est dans `assets/anim.js` et conditionné à `prefers-reduced-motion` : si le
visiteur a demandé moins d'animations, les éléments sont posés directement dans
leur état final. Les états initiaux sont conditionnés à la classe `js` posée en
tête de document, donc la page reste entièrement lisible sans JavaScript.

## Pied de page

Rendu par `piedDePage()` (`assets/site.js`) à partir des données, donc juste par
construction : nombre de séries, d'épisodes, d'heures, moyenne, pays, dernière série
vue, titres notés 5 sur 5, et la période couverte. Chaque page l'appelle dans son
`<footer id="pied">` en passant son préfixe de chemin. Le carrousel d'accueil en est
la seule exception : il occupe l'écran entier et ne défile pas.

## Développement

Aucune dépendance, aucune étape de build :

```sh
python3 -m http.server 8000
```

## Sources

Données de visionnage : ma note Apple « Dramas i watched since 03/2025 ».
Métadonnées, notes et affiches : [MyDramaList](https://mydramalist.com) et
[Viki](https://www.viki.com). Les affiches sont des visuels promotionnels,
repris ici dans un cadre éditorial.
