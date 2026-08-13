/* ---------------------------------------------------------------
   Rendu des fiches et des statistiques.
   Ne dépend d'aucune bibliothèque externe.
   --------------------------------------------------------------- */

/* Note sur 5 → « 4,5 » (virgule décimale française). */
function formatNote(n) {
  return String(n).replace(".", ",");
}

/* Barre de 5 étoiles remplie au prorata, demi-étoiles comprises. */
function etoiles(note) {
  const pct = (note / 5) * 100;
  return (
    '<span class="stars" role="img" aria-label="' +
    formatNote(note) +
    ' sur 5">' +
    '<span class="stars__off" aria-hidden="true">★★★★★</span>' +
    '<span class="stars__on" style="width:' +
    pct +
    '%" aria-hidden="true">★★★★★</span>' +
    "</span>"
  );
}

/* Échappement — les synopsis viennent d'une source externe. */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Chiffres clés affichés sur l'accueil. */
function calculerStats(liste) {
  const notes = liste.filter((d) => d.note !== null).map((d) => d.note);
  const moyenne = notes.reduce((a, b) => a + b, 0) / notes.length;
  const fans = liste.filter((d) => d.noteFans !== null).map((d) => d.noteFans);
  const moyenneFans = fans.reduce((a, b) => a + b, 0) / fans.length;

  return {
    total: liste.length,
    notes: notes.length,
    moyenne: moyenne,
    moyenneFans: moyenneFans,
    coupsDeCoeur: notes.filter((n) => n === 5).length,
  };
}

/* Ligne de métadonnées : pays · année · épisodes · genres. */
function ligneMeta(d, prefixe) {
  const bouts = [];
  const pays = PAYS[d.pays];
  if (pays) bouts.push(pays.drapeau + " " + pays.nom);
  if (d.annee) bouts.push(String(d.annee));
  if (d.episodes) bouts.push(d.episodes);
  if (d.genres && d.genres.length) bouts.push(d.genres.join(", "));
  if (prefixe) bouts.unshift(prefixe);
  return bouts.map(esc).join(" &middot; ");
}

/* Fiche détaillée (page « Visionnages »). */
function fiche(d, base) {
  base = base || "";
  const lienCritique = d.critique
    ? '<a class="fiche__critique" href="' +
      base +
      esc(d.critique) +
      '">Lire la critique &rarr;</a>'
    : "";

  const maNote =
    d.note === null
      ? '<span class="fiche__unrated">Pas encore notée</span>'
      : '<span class="fiche__score-label">Ma note</span>' +
        etoiles(d.note) +
        '<span class="rating-value">' +
        formatNote(d.note) +
        "/5</span>";

  const noteFans =
    d.noteFans === null
      ? ""
      : '<div class="fiche__fans"><span class="fiche__score-label">Fans</span>' +
        '<span class="rating-value">' +
        formatNote(d.noteFans) +
        "/10</span></div>";

  const synopsis = d.synopsis
    ? '<p class="fiche__synopsis">' + esc(d.synopsis) + "</p>"
    : '<p class="fiche__synopsis fiche__synopsis--vide">Fiche introuvable sur MyDramaList — à compléter.</p>';

  return (
    '<article class="fiche' +
    (d.note === null ? " fiche--unrated" : "") +
    '">' +
    '<div class="fiche__glyph" aria-hidden="true">' +
    d.emoji +
    "</div>" +
    '<div class="fiche__body">' +
    '<h3 class="fiche__title">' +
    esc(d.titre) +
    "</h3>" +
    '<p class="fiche__meta">' +
    ligneMeta(d, d.mention) +
    "</p>" +
    synopsis +
    '<div class="fiche__ratings">' +
    '<div class="fiche__mine">' +
    maNote +
    "</div>" +
    noteFans +
    lienCritique +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

/* Ligne compacte (accueil). */
function ligne(d, base) {
  base = base || "";
  const titre = d.critique
    ? '<a href="' + base + esc(d.critique) + '">' + esc(d.titre) + "</a>"
    : esc(d.titre);

  const droite =
    d.note === null
      ? "à noter"
      : etoiles(d.note) +
        '<span class="entry__score">' +
        formatNote(d.note) +
        "/5</span>";

  return (
    '<li class="entry' +
    (d.note === null ? " entry--unrated" : "") +
    '">' +
    '<span class="entry__glyph" aria-hidden="true">' +
    d.emoji +
    "</span>" +
    "<span>" +
    '<span class="entry__title">' +
    titre +
    "</span><br>" +
    '<span class="entry__sub">' +
    ligneMeta(d) +
    "</span>" +
    "</span>" +
    '<span class="entry__rating">' +
    droite +
    "</span>" +
    "</li>"
  );
}
