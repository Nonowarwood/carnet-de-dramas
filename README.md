# Carnet de dramas

Site statique recensant mes visionnages de dramas depuis mars 2025, avec mes notes,
celles des fans, et mes critiques.

## Structure

```
index.html              Accueil : chiffres clés, critiques, derniers visionnages, à voir
visionnages.html        Liste complète avec recherche, tri et filtre par pays
critiques/              Une page par critique
assets/data.js          Toutes les données (dramas + liste « à voir »)
assets/site.js          Rendu des fiches et calcul des statistiques
assets/style.css        Feuille de style (thème sombre et clair automatiques)
```

## Ajouter un drama

Tout se passe dans `assets/data.js`. Copier un bloc existant du tableau `DRAMAS` et
compléter les champs :

| Champ       | Description                                                     |
|-------------|-----------------------------------------------------------------|
| `emoji`     | L'emoji associé au titre                                        |
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

## Ajouter une critique

1. Dupliquer `critiques/melo-movie.html` et écrire le texte.
2. Dans `assets/data.js`, ajouter au drama concerné :
   `critique` (chemin vers la page), `critiqueDate` et `critiqueExtrait`.

L'accueil détecte automatiquement les dramas qui ont une critique.

## Développement

Aucune dépendance, aucune étape de build. Ouvrir `index.html` dans un navigateur,
ou servir le dossier :

```sh
python3 -m http.server 8000
```

## Sources

Données de visionnage : ma note Apple « Dramas i watched since 03/2025 ».
Métadonnées et notes des fans : [MyDramaList](https://mydramalist.com).
