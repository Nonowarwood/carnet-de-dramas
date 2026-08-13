/* ===============================================================
   Rendu des fiches, jauges et statistiques.
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

/* « Mr. Plankton » → « mr-plankton » : sert à retrouver l'affiche. */
function slug(titre) {
  return titre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* Chemin de l'affiche, ou null si le drama n'en a pas. */
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

/* Numéro d'ordre sur deux chiffres. */
function numero(i) {
  return String(i + 1).padStart(2, "0");
}

/* ---------------- Jauge de note ---------------- */

/* Cinq segments : pleins, à moitié, ou vides. */
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
    formatNote(note) +
    ' sur 5">' + segments + "</span>"
  );
}

/* ---------------- Statistiques ---------------- */

function calculerStats(liste) {
  const notes = liste.filter((d) => d.note !== null).map((d) => d.note);
  const fans = liste.filter((d) => d.noteFans !== null).map((d) => d.noteFans);
  const moyenne = notes.reduce((a, b) => a + b, 0) / notes.length;
  const moyenneFans = fans.reduce((a, b) => a + b, 0) / fans.length;

  return {
    total: liste.length,
    notes: notes.length,
    moyenne: moyenne,
    moyenneFans: moyenneFans,
    coupsDeCoeur: notes.filter((n) => n === 5).length,
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
    '<span class="row__fans mono">' +
    (d.noteFans === null ? "—" : "Fans " + formatNote(d.noteFans)) + "</span>" +
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

  const noteFans =
    d.noteFans === null
      ? ""
      : '<div class="fiche__stat"><span class="mono">Fans</span><b>' +
        formatNote(d.noteFans) + "/10</b></div>";

  const lien = d.critique
    ? '<a class="fiche__link mono" href="' + base + esc(d.critique) + '">' +
      "Lire la critique " + ICONES.fleche + "</a>"
    : "";

  const synopsis = d.synopsis
    ? '<p class="fiche__synopsis">' + esc(d.synopsis) + "</p>"
    : '<p class="fiche__synopsis fiche__synopsis--vide">Fiche introuvable sur MyDramaList — à compléter.</p>';

  return (
    '<article class="fiche">' +
    '<div class="fiche__num mono">' + numero(i) + "</div>" +
    "<div>" +
    (img
      ? '<img class="fiche__poster" src="' + img + '" alt="Affiche de ' + esc(d.titre) + '" loading="lazy">'
      : '<div class="fiche__poster"></div>') +
    "</div>" +
    "<div>" +
    '<h3 class="fiche__title">' + esc(d.titre) +
    (d.mention ? ' <span class="fiche__mention">' + esc(d.mention) + "</span>" : "") +
    "</h3>" +
    '<p class="fiche__meta mono">' + ligneMeta(d, false) + "</p>" +
    synopsis +
    '<div class="fiche__ratings">' + maNote + noteFans + lien + "</div>" +
    "</div>" +
    "</article>"
  );
}
