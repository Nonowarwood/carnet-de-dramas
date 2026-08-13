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

/* Chemin de la fiche individuelle d'une série. */
function pageSerie(d, base) {
  return (base || "") + "series/" + slug(d.titre) + ".html";
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

/* ---------------- Mois de visionnage ---------------- */

const MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
                 "août", "septembre", "octobre", "novembre", "décembre"];

/* « 2025-09 » → « septembre 2025 » */
function moisEnClair(m) {
  if (!m) return "";
  var p = m.split("-");
  return MOIS_FR[parseInt(p[1], 10) - 1] + " " + p[0];
}

function anneeDe(m) { return (m || "").slice(0, 4); }

/* Tous les mois entre deux bornes, y compris ceux sans visionnage :
   un creux dans le rythme est une information, pas un trou à masquer. */
function moisEntre(debut, fin) {
  var out = [];
  var a = parseInt(debut.slice(0, 4), 10), m = parseInt(debut.slice(5), 10);
  var af = parseInt(fin.slice(0, 4), 10), mf = parseInt(fin.slice(5), 10);
  while (a < af || (a === af && m <= mf)) {
    out.push(a + "-" + String(m).padStart(2, "0"));
    m += 1;
    if (m > 12) { m = 1; a += 1; }
  }
  return out;
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
    moisEnClair(d.mois) + " · " + (PAYS_COURT[d.pays] || "") + "</span>" +
    '<span class="row__fans mono" title="' + esc(detailSources(d)) + '">' +
    (d.consensus == null ? "—" : "Public " + arrondi(d.consensus, 1)) +
    (d.nbSources > 1 ? '<span class="row__srcs">' + d.nbSources + "</span>" : "") +
    "</span>" +
    score;

  return '<a class="row" href="' + pageSerie(d, base) + '">' + contenu + "</a>";
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
    (img
      ? '<a class="fiche__affiche" href="' + pageSerie(d, base) + '"' +
        ' title="Voir la fiche de ' + esc(d.titre) + '">' +
        '<img class="fiche__poster" src="' + img + '" alt="Affiche de ' + esc(d.titre) + '" loading="lazy">' +
        '<span class="fiche__affiche-note mono">Voir la fiche</span></a>'
      : '<div class="fiche__poster"></div>') +
    "</div>" +
    "<div>" +
    '<h3 class="fiche__title"><a href="' + pageSerie(d, base) + '">' + esc(d.titre) + "</a>" +
    (d.mention ? ' <span class="fiche__mention">' + esc(d.mention) + "</span>" : "") +
    "</h3>" +
    '<p class="fiche__vu mono">Vu en ' + moisEnClair(d.mois) + "</p>" +
    '<p class="fiche__meta mono">' + ligneMeta(d, false) + "</p>" +
    synopsis +
    '<div class="fiche__ratings">' + maNote + consensus + lien + "</div>" +
    "</div>" +
    "</article>"
  );
}

/* ===============================================================
   PIED DE PAGE

   Rendu à partir des données plutôt qu'écrit en dur : il reste juste
   dès qu'un visionnage est ajouté.
   =============================================================== */

function piedDePage(base) {
  base = base || "";
  var stats = calculerStats(DRAMAS);

  var minutes = DRAMAS.reduce(function (a, d) { return a + d.episodesNb * d.dureeEp; }, 0);
  var episodes = DRAMAS.reduce(function (a, d) { return a + d.episodesNb; }, 0);
  var premier = DRAMAS[0];
  var dernier = DRAMAS[DRAMAS.length - 1];
  var mois = moisEntre(premier.mois, dernier.mois);
  var preferees = DRAMAS.filter(function (d) { return d.note === 5; });
  var pays = {};
  DRAMAS.forEach(function (d) { pays[d.pays] = true; });

  function ligne(cle, valeur) {
    return "<li><b>" + valeur + "</b> " + cle + "</li>";
  }

  function lien(href, texte) {
    return '<li><a href="' + base + href + '">' + texte + "</a></li>";
  }

  return (
    '<div class="pied__grille">' +

    '<div class="pied__bloc">' +
    '<p class="pied__titre mono">Le carnet</p>' +
    '<p class="pied__texte">Journal de visionnage tenu depuis janvier 2025. ' +
    "Chaque série y est notée sur cinq, résumée, et comparée à l'avis du public. " +
    "Quelques-unes ont droit à une vraie critique.</p>" +
    "</div>" +

    '<div class="pied__bloc">' +
    '<p class="pied__titre mono">En chiffres</p>' +
    '<ul class="pied__liste">' +
    ligne("séries", DRAMAS.length) +
    ligne("épisodes", episodes) +
    ligne("heures de visionnage", Math.round(minutes / 60)) +
    ligne("de moyenne sur 5", arrondi(stats.moyenne, 2)) +
    ligne("pays d'origine", Object.keys(pays).length) +
    "</ul></div>" +

    '<div class="pied__bloc">' +
    '<p class="pied__titre mono">Le dernier vu</p>' +
    '<p class="pied__vedette">' + esc(dernier.titre) + "</p>" +
    '<p class="pied__detail mono">' + (dernier.annee || "") +
    (dernier.note !== null ? " &middot; " + formatNote(dernier.note) + "/5" : "") + "</p>" +
    '<p class="pied__titre mono" style="margin-top:1.25rem">Notées 5 sur 5</p>' +
    '<p class="pied__detail">' +
    preferees.map(function (d) { return esc(d.titre); }).join("<br>") + "</p>" +
    "</div>" +

    '<div class="pied__bloc">' +
    '<p class="pied__titre mono">Parcourir</p>' +
    '<ul class="pied__liste pied__liste--liens">' +
    lien("index.html", "Le carrousel") +
    lien("carnet.html", "Le carnet") +
    lien("visionnages.html", "Les visionnages") +
    lien("moi.html", "Le portrait chiffré") +
    lien("critiques/melo-movie.html", "La critique de Melo Movie") +
    "</ul>" +
    '<p class="pied__titre mono" style="margin-top:1.25rem">Période couverte</p>' +
    '<p class="pied__detail">' + moisEnClair(premier.mois) + " &rarr; " +
    moisEnClair(dernier.mois) + "<br>" + mois.length + " mois</p>" +
    "</div>" +

    "</div>" +

    '<div class="pied__bas mono">' +
    "<span>Carnet personnel &mdash; Noah Guerbois</span>" +
    "<span>Notes du public&nbsp;: MyDramaList et Viki, recentrées avant moyenne</span>" +
    '<span>Affiches, durées et casting&nbsp;: <a href="https://mydramalist.com">MyDramaList</a></span>' +
    "</div>"
  );
}
