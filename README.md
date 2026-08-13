# Carnet de dramas

Site statique recensant mes visionnages de dramas depuis mars 2025, avec mes notes,
celles des fans, et mes critiques.

En ligne : <https://nonowarwood.github.io/carnet-de-dramas/>

## Direction artistique

Grotesque serrée en gros corps, filets noirs pleine largeur, libellés en monospace
capitales espacées, accent orange `#ff5c2b` complété de lilas et de vert d'eau.
Aucun angle arrondi, aucun emoji : les repères visuels sont des numéros `01 → 30`
et des icônes SVG. Un seul thème, clair, assumé comme tel.

## Structure

```
index.html              Accueil : mosaïque d'affiches, chiffres clés, critiques, derniers visionnages
visionnages.html        Les 30 fiches, avec recherche, tri et filtre par pays
carrousel.html          Les affiches disposées en cylindre 3D (CSS transforms, sans dépendance)
critiques/              Une page par critique
assets/data.js          Toutes les données (dramas + liste « à voir »)
assets/site.js          Icônes, jauges, rendu des fiches, statistiques
assets/style.css        Feuille de style unique, carrousel compris
assets/posters/         Affiches, nommées d'après le titre en minuscules-tirets
```

## Ajouter un drama

Tout se passe dans `assets/data.js`. Copier un bloc du tableau `DRAMAS` et compléter :

| Champ       | Description                                                     |
|-------------|-----------------------------------------------------------------|
| `titre`     | Le titre tel que je le note                                     |
| `mention`   | Précision facultative (saisons vues, titre officiel différent…)  |
| `pays`      | `"KR"`, `"JP"` ou `"CN"`                                        |
| `annee`     | Année de première diffusion                                     |
| `episodes`  | Texte libre, ex. `"16 ép."` ou `"Film"`                         |
| `genres`    | Tableau de genres                                               |
| `noteFans`  | Moyenne MyDramaList, sur 10                                     |
| `note`      | Ma note sur 5 (`null` si pas encore notée)                      |
| `periode`   | `"2025"` ou `"2026"` — les deux blocs de ma note d'origine       |
| `synopsis`  | Résumé en français                                              |
| `affiche`   | `false` uniquement si aucune affiche n'est disponible            |

Déposer l'affiche dans `assets/posters/` sous le nom donné par le titre en
minuscules avec tirets — `Mr. Plankton` devient `mr-plankton.jpg`. C'est la
fonction `slug()` de `assets/site.js` qui fait la correspondance : aucun chemin
à écrire à la main.

## Ajouter une critique

1. Dupliquer `critiques/melo-movie.html` et écrire le texte.
2. Dans `assets/data.js`, ajouter au drama concerné : `critique` (chemin vers la
   page), `critiqueDate` et `critiqueExtrait`.

L'accueil détecte automatiquement les dramas qui ont une critique.

## Carrousel

Les panneaux sont répartis sur un cercle avec `rotateY(i × pas) translateZ(rayon)`,
le conteneur tournant en sens inverse. Le dos des panneaux lointains reste visible
(`backface-visibility: visible`), ce qui produit les reflets inversés. Le rayon est
recalculé à chaque redimensionnement dans `dimensionner()`. Interactions : glisser,
molette, flèches du clavier, plus une rotation continue quand on ne touche à rien.

## Développement

Aucune dépendance, aucune étape de build :

```sh
python3 -m http.server 8000
```

## Sources

Données de visionnage : ma note Apple « Dramas i watched since 03/2025 ».
Métadonnées, notes des fans et affiches : [MyDramaList](https://mydramalist.com).
Les affiches sont des visuels promotionnels, repris ici dans un cadre éditorial.
