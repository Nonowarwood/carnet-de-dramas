#!/usr/bin/env node
/* ===============================================================
   Génère une page par série dans series/.

   Les pages produites sont des gabarits : seuls le titre, la
   description et le slug y sont figés — le contenu est rendu au
   chargement par assets/serie.js à partir de data.js. Modifier une
   donnée ne demande donc aucune régénération ; il faut relancer ce
   script uniquement après avoir ajouté ou renommé une série.

       node outils/generer-series.js
   =============================================================== */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RACINE = path.join(__dirname, "..");
const DEST = path.join(RACINE, "series");

// data.js est du JavaScript nu : on l'évalue dans un bac à sable.
const bac = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(RACINE, "assets/data.js"), "utf8"), bac);
vm.runInContext(fs.readFileSync(path.join(RACINE, "assets/site.js"), "utf8"), bac);
const DRAMAS = vm.runInContext("DRAMAS", bac);
const slug = vm.runInContext("slug", bac);

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Description de partage : synopsis tronqué proprement sur un mot. */
function resume(d) {
  const base = d.synopsis || `${d.titre}, ${d.annee}.`;
  if (base.length <= 155) return base;
  const coupe = base.slice(0, 155);
  return coupe.slice(0, coupe.lastIndexOf(" ")) + "…";
}

const gabarit = (d, i) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.titre)} — Carnet de dramas</title>
<meta name="description" content="${esc(resume(d))}">
<meta property="og:title" content="${esc(d.titre)} — Carnet de dramas">
<meta property="og:description" content="${esc(resume(d))}">
<meta property="og:image" content="https://nonowarwood.github.io/carnet-de-dramas/assets/posters/${slug(d.titre)}.jpg">
<meta property="og:type" content="video.tv_show">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23000'/><rect x='7' y='7' width='18' height='18' fill='%23ff5c2b'/></svg>">
<link rel="stylesheet" href="../assets/style.css">
<script>document.documentElement.classList.add("js");</script>
</head>
<body data-page="serie" data-serie="${slug(d.titre)}">

<div class="scroll-progress"><div class="scroll-progress__bar"></div></div>

<header class="bar">
  <a class="bar__logo" href="../index.html">Dramas<sup>26</sup></a>
  <a class="bar__link" href="../carnet.html">Le carnet</a>
  <a class="bar__link" href="../visionnages.html">Les visionnages</a>
  <a class="bar__link bar__link--optionnel" href="../moi.html">Portrait</a>
  <span class="bar__spacer"></span>
  <button class="bar__guide" type="button" data-guide><span>?</span> Guide</button>
</header>

<main class="wrap" id="serie"></main>

<footer class="wrap pied" id="pied"></footer>

<script src="../assets/data.js"></script>
<script src="../assets/site.js"></script>
<script src="../assets/serie.js"></script>
<script>document.getElementById("pied").innerHTML = piedDePage("../");</script>
<script src="../assets/anim.js"></script>
<script src="../assets/guide.js"></script>

</body>
</html>
`;

fs.mkdirSync(DEST, { recursive: true });

const attendus = new Set();
DRAMAS.forEach((d, i) => {
  const nom = slug(d.titre) + ".html";
  attendus.add(nom);
  fs.writeFileSync(path.join(DEST, nom), gabarit(d, i));
});

// Une série renommée laisserait sinon sa page orpheline derrière elle.
const orphelines = fs.readdirSync(DEST)
  .filter((f) => f.endsWith(".html") && !attendus.has(f));
orphelines.forEach((f) => fs.unlinkSync(path.join(DEST, f)));

console.log(`${attendus.size} fiches écrites dans series/`);
if (orphelines.length) console.log(`${orphelines.length} page(s) orpheline(s) supprimée(s) : ${orphelines.join(", ")}`);
