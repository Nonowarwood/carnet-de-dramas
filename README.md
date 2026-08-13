# Carnet de dramas

Site statique recensant mes visionnages de dramas depuis mars 2025, avec mes notes,
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
critiques/              Une page par critique
assets/data.js          Toutes les données (dramas + liste « à voir »)
assets/site.js          Icônes, jauges, note de consensus, rendu des fiches
assets/anim.js          Révélations, compteurs, transitions de page, curseur
assets/guide.js         Visite guidée interactive
assets/style.css        Feuille de style unique, carrousel et guide compris
assets/posters/         Affiches, nommées d'après le titre en minuscules-tirets
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
| `note`       | Ma note sur 5 (`null` si pas encore notée)                     |
| `periode`    | `"2025"` ou `"2026"` — les deux blocs de ma note d'origine      |
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

## Carrousel

Les panneaux sont répartis sur un cercle avec `rotateY(i × pas) translateZ(rayon)`,
le conteneur tournant en sens inverse. Le dos des panneaux lointains reste visible
(`backface-visibility: visible`), ce qui produit les reflets inversés. Le rayon est
recalculé à chaque redimensionnement. Interactions : glisser, molette, flèches du
clavier, plus une rotation continue quand on ne touche à rien.

## Guide interactif

Bouton « Guide » de l'en-tête, ou ouverture automatique à la première visite. Le
parcours est décrit dans `PARCOURS`, au début de `assets/guide.js` : une entrée par
page, chaque étape désignant un sélecteur, un titre et un texte. Une étape peut
porter une clé `suite` pour enchaîner sur une autre page — le relais passe par
`sessionStorage`, et le guide reprend tout seul à l'arrivée.

## Animations

Tout est dans `assets/anim.js` et conditionné à `prefers-reduced-motion` : si le
visiteur a demandé moins d'animations, les éléments sont posés directement dans
leur état final. Les états initiaux sont conditionnés à la classe `js` posée en
tête de document, donc la page reste entièrement lisible sans JavaScript.

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
