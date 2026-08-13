/* ===============================================================
   Rendu des fiches, jauges, statistiques et note de consensus.
   Aucune dépendance externe. Aucun emoji : les repères visuels
   sont des numéros en monospace et des icônes SVG.
   =============================================================== */

/* ---------------- Icônes ---------------- */

const ICONES = {
  plus:
    '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<path d="M6 1v10M1 6h10"/></svg>',
  fleche:
    '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5"/></svg>',
  flecheGauche:
    '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<path d="M11 6H1M5.5 1.5 1 6l4.5 4.5"/></svg>',
  flecheBas:
    '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<path d="M6 1v10M1.5 5.5 6 10l4.5-4.5"/></svg>',
};

/* ---------------- Utilitaires ---------------- */

/* 4.5 → « 4,5 » */
function formatNote(n) {
  return String(n).replace(".", ",");
}

/* Arrondi puis mise au format français. */
function arrondi(n, decimales) {
  var f = Math.pow(10, decimales);
  return formatNote(Math.round(n * f) / f);
}

/* « Mr. Plankton » → « mr-plankton » : sert à retrouver l'affiche. */
function slug(titre) {
  return titre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function affiche(d, base) {
  if (d.affiche === false) return null;
  return (base || "") + "assets/posters/" + slug(d.titre) + ".jpg";
}

/* Les synopsis viennent d'une source externe : on échappe. */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function numero(i) {
  return String(i + 1).padStart(2, "0");
}

/* ---------------- Jauge de note ---------------- */

function jauge(note) {
  var segments = "";
  for (var i = 1; i <= 5; i++) {
    var classe = "gauge__seg";
    if (note >= i) classe += " gauge__seg--on";
    else if (note >= i - 0.5) classe += " gauge__seg--half";
    segments += '<span class="' + classe + '"></span>';
  }
  return (
    '<span class="gauge" role="img" aria-label="' +
    formatNote(note) + ' sur 5">' + segments + "</span>"
  );
}

/* ===============================================================
   NOTE DE CONSENSUS

   Les plateformes ne notent pas sur la même échelle : Viki tourne
   autour de 9,5 (public de fans), MyDramaList autour de 8,4. Une
   moyenne brute mesurerait surtout cet écart de culture de notation.
   On centre donc chaque plateforme sur sa propre moyenne et son
   propre écart-type, on combine les scores centrés réduits, puis on
   ramène le résultat sur l'échelle MyDramaList — la seule qui
   couvre les 30 titres, donc la plus lisible comme référence.

   Viki est pondérée par son nombre de votes : une note assise sur
   6 000 votes pèse moins qu'une note assise sur 280 000.
   =============================================================== */

function momentsDe(valeurs) {
  var n = valeurs.length;
  if (!n) return { moyenne: 0, ecartType: 1, n: 0 };
  var moyenne = valeurs.reduce(function (a, b) { return a + b; }, 0) / n;
  var variance =
    valeurs.reduce(function (a, b) { return a + (b - moyenne) * (b - moyenne); }, 0) / n;
  return { moyenne: moyenne, ecartType: Math.sqrt(variance) || 1, n: n };
}

function preparerConsensus(liste) {
  var mdl = momentsDe(liste.filter(function (d) { return d.noteMdl != null; })
                           .map(function (d) { return d.noteMdl; }));
  var viki = momentsDe(liste.filter(function (d) { return d.noteViki != null; })
                            .map(function (d) { return d.noteViki; }));

  liste.forEach(function (d) {
    var scores = [], poids = [];

    if (d.noteMdl != null) {
      scores.push((d.noteMdl - mdl.moyenne) / mdl.ecartType);
      poids.push(1);
    }
    if (d.noteViki != null) {
      scores.push((d.noteViki - viki.moyenne) / viki.ecartType);
      // Saturation à 100 000 votes : au-delà, la confiance ne progresse plus.
      poids.push(Math.min(1, Math.log10(d.votesViki || 1) / 5));
    }

    if (!scores.length) {
      d.consensus = null;
      d.nbSources = 0;
      return;
    }

    var total = poids.reduce(function (a, b) { return a + b; }, 0);
    var z = scores.reduce(function (a, s, i) { return a + s * poids[i]; }, 0) / total;

    d.consensus = Math.max(0, Math.min(10, mdl.moyenne + z * mdl.ecartType));
    d.nbSources = scores.length;
  });

  return { mdl: mdl, viki: viki };
}

/* ---------------- Statistiques ---------------- */

function calculerStats(liste) {
  const notes = liste.filter((d) => d.note !== null).map((d) => d.note);
  const cons = liste.filter((d) => d.consensus != null).map((d) => d.consensus);
  const moyenne = notes.reduce((a, b) => a + b, 0) / notes.length;
  const moyenneConsensus = cons.reduce((a, b) => a + b, 0) / cons.length;

  return {
    total: liste.length,
    notes: notes.length,
    moyenne: moyenne,
    moyenneConsensus: moyenneConsensus,
    coupsDeCoeur: notes.filter((n) => n === 5).length,
    avecViki: liste.filter((d) => d.noteViki != null).length,
  };
}

/* ---------------- Métadonnées ---------------- */

const PAYS_COURT = { KR: "Corée du Sud", JP: "Japon", CN: "Chine" };

function ligneMeta(d, avecMention) {
  const bouts = [];
  if (avecMention && d.mention) bouts.push(d.mention);
  if (PAYS_COURT[d.pays]) bouts.push(PAYS_COURT[d.pays]);
  if (d.annee) bouts.push(String(d.annee));
  if (d.episodes) bouts.push(d.episodes);
  if (d.genres && d.genres.length) bouts.push(d.genres.join(" / "));
  return bouts.map(esc).join(" — ");
}

/* Détail des sources, affiché au survol du consensus. */
function detailSources(d) {
  var bouts = [];
  if (d.noteMdl != null) bouts.push("MyDramaList " + formatNote(d.noteMdl));
  if (d.noteViki != null) {
    bouts.push("Viki " + formatNote(d.noteViki) +
      " (" + d.votesViki.toLocaleString("fr-FR") + " votes)");
  }
  return bouts.join(" · ");
}

/* ---------------- Ligne d'index ---------------- */

function rangee(d, i, base) {
  base = base || "";
  const img = affiche(d, base);
  const vignette = img
    ? '<img class="row__thumb" src="' + img + '" alt="" loading="lazy">'
    : '<span class="row__thumb"></span>';

  const score =
    d.note === null
      ? '<span class="row__score mono">à noter</span>'
      : '<span class="row__score">' + jauge(d.note) +
        "<span>" + formatNote(d.note) + "</span></span>";

  const contenu =
    '<span class="row__num mono">' + numero(i) + "</span>" +
    vignette +
    "<span><span class='row__title'>" + esc(d.titre) + "</span>" +
    (d.mention ? '<span class="row__mention mono">' + esc(d.mention) + "</span>" : "") +
    "</span>" +
    '<span class="row__meta mono">' +
    (PAYS_COURT[d.pays] || "") + (d.annee ? " · " + d.annee : "") + "</span>" +
    '<span class="row__fans mono" title="' + esc(detailSources(d)) + '">' +
    (d.consensus == null ? "—" : "Public " + arrondi(d.consensus, 1)) +
    (d.nbSources > 1 ? '<span class="row__srcs">' + d.nbSources + "</span>" : "") +
    "</span>" +
    score;

  return d.critique
    ? '<a class="row" href="' + base + esc(d.critique) + '">' + contenu + "</a>"
    : '<div class="row">' + contenu + "</div>";
}

/* ---------------- Fiche détaillée ---------------- */

function fiche(d, i, base) {
  base = base || "";
  const img = affiche(d, base);

  const maNote =
    d.note === null
      ? '<div class="fiche__stat"><span class="mono">Pas encore notée</span></div>'
      : '<div class="fiche__stat"><span class="mono">Ma note</span>' +
        jauge(d.note) + "<b>" + formatNote(d.note) + "/5</b></div>";

  const consensus =
    d.consensus == null
      ? ""
      : '<div class="fiche__stat fiche__stat--consensus">' +
        '<span class="mono">Public</span><b>' + arrondi(d.consensus, 1) + "/10</b>" +
        '<span class="sources mono">' +
        (d.noteMdl != null ? "<span>MDL " + formatNote(d.noteMdl) + "</span>" : "") +
        (d.noteViki != null ? "<span>Viki " + formatNote(d.noteViki) + "</span>" : "") +
        "</span></div>";

  const lien = d.critique
    ? '<a class="fiche__link mono" href="' + base + esc(d.critique) + '">' +
      "Lire la critique " + ICONES.fleche + "</a>"
    : "";

  const synopsis = d.synopsis
    ? '<p class="fiche__synopsis">' + esc(d.synopsis) + "</p>"
    : '<p class="fiche__synopsis fiche__synopsis--vide">Synopsis à compléter.</p>';

  return (
    '<article class="fiche reveal">' +
    '<div class="fiche__num mono">' + numero(i) + "</div>" +
    "<div>" +
    (img && d.mdl
      ? '<a class="fiche__affiche" href="https://mydramalist.com' + esc(d.mdl) + '"' +
        ' target="_blank" rel="noopener" title="Voir ' + esc(d.titre) + ' sur MyDramaList">' +
        '<img class="fiche__poster" src="' + img + '" alt="Affiche de ' + esc(d.titre) + '" loading="lazy">' +
        '<span class="fiche__affiche-note mono">MyDramaList &#8599;</span></a>'
      : img
        ? '<img class="fiche__poster" src="' + img + '" alt="Affiche de ' + esc(d.titre) + '" loading="lazy">'
        : '<div class="fiche__poster"></div>') +
    "</div>" +
    "<div>" +
    '<h3 class="fiche__title">' + esc(d.titre) +
    (d.mention ? ' <span class="fiche__mention">' + esc(d.mention) + "</span>" : "") +
    "</h3>" +
    '<p class="fiche__meta mono">' + ligneMeta(d, false) + "</p>" +
    synopsis +
    '<div class="fiche__ratings">' + maNote + consensus + lien + "</div>" +
    "</div>" +
    "</article>"
  );
}
