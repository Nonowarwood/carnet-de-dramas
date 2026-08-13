/* ===============================================================
   Fiche individuelle d'une série.

   La page est un simple gabarit : son titre et sa description sont
   figés à la génération, mais tout le contenu est rendu ici à partir
   de data.js. Une donnée modifiée se répercute donc sans régénérer
   quoi que ce soit.
   =============================================================== */

(function () {
  "use strict";

  var cible = document.body.getAttribute("data-serie");
  var hote = document.getElementById("serie");
  if (!hote) return;

  preparerConsensus(DRAMAS);

  var index = -1;
  DRAMAS.forEach(function (d, i) { if (slug(d.titre) === cible) index = i; });

  if (index === -1) {
    hote.innerHTML = '<p class="empty mono">' + t("fiche.introuvable") + "</p>";
    return;
  }

  var d = DRAMAS[index];
  var B = "../";

  /* ---------------- Blocs ---------------- */

  function infos() {
    var lignes = [
      [t("serie.vuEn"), moisEnClair(d.mois)],
      [t("serie.origine"), nomPays(d.pays)],
      [t("serie.diffusion"), d.annee + (d.chaine ? " &middot; " + esc(d.chaine) : "")],
      [t("serie.format"), formatEpisodes(d.episodes)],
      [t("serie.genres"), (d.genres || []).map(nomGenre).join(", ")],
    ];
    if (d.realisateur) lignes.push([t("serie.realisation"), d.realisateur]);

    return (
      '<dl class="serie__infos">' +
      lignes.map(function (l) {
        return "<dt class='mono'>" + l[0] + "</dt><dd>" + l[1] + "</dd>";
      }).join("") +
      "</dl>"
    );
  }

  function notes() {
    var mienne =
      d.note === null
        ? '<div class="serie__note"><span class="mono">' + t("fiche.maNote") + "</span>" +
          '<b class="serie__note-vide">' + t("fiche.pasNotee") + "</b></div>"
        : '<div class="serie__note"><span class="mono">' + t("fiche.maNote") + "</span>" +
          '<b>' + formatNote(d.note) + '<small>/5</small></b>' + jauge(d.note) + "</div>";

    var publique =
      d.consensus == null
        ? ""
        : '<div class="serie__note"><span class="mono">' + t("fiche.public") + "</span>" +
          "<b>" + arrondi(d.consensus, 1) + '<small>/10</small></b>' +
          '<span class="serie__sources mono">' +
          (d.noteMdl != null ? "<span>MDL " + formatNote(d.noteMdl) + "</span>" : "") +
          (d.noteViki != null
            ? "<span>Viki " + formatNote(d.noteViki) + " · " +
              t("serie.votes", d.votesViki.toLocaleString(langue())) + "</span>"
            : "") +
          "</span></div>";

    var ecart = "";
    if (d.note !== null && d.consensus != null) {
      var e = d.note * 2 - d.consensus;
      var valeur = (Math.round(Math.abs(e) * 10) / 10).toString().replace(".", ",");
      ecart =
        '<p class="serie__ecart mono">' +
        (Math.abs(e) < 0.25
          ? t("serie.consensus")
          : t(e >= 0 ? "serie.dessus" : "serie.dessous", valeur)) +
        "</p>";
    }

    return '<div class="serie__notes">' + mienne + publique + "</div>" + ecart;
  }

  function casting() {
    if (!d.roles || !d.roles.length) return "";
    return (
      '<section class="serie__section">' +
      '<h2 class="serie__titre-section mono">' + t("serie.roles") + "</h2>" +
      '<div class="casting">' +
      d.roles.map(function (r) {
        return (
          '<div class="casting__carte">' +
          '<img src="' + B + "assets/people/" + slug(r[0]) + '.jpg" alt="' + esc(r[0]) + '" loading="lazy">' +
          '<p class="casting__nom">' + esc(r[0]) + "</p>" +
          (r[1] ? '<p class="casting__role mono">' + esc(r[1]) + "</p>" : "") +
          "</div>"
        );
      }).join("") +
      "</div></section>"
    );
  }

  /* Proximité mesurée au nombre de genres partagés, l'année départageant. */
  function proches() {
    var voisines = DRAMAS
      .map(function (autre, i) {
        if (i === index) return null;
        var communs = (autre.genres || []).filter(function (g) {
          return (d.genres || []).indexOf(g) !== -1;
        });
        return communs.length ? { d: autre, i: i, n: communs.length, communs: communs } : null;
      })
      .filter(Boolean)
      .sort(function (a, b) { return b.n - a.n || (b.d.note || 0) - (a.d.note || 0); })
      .slice(0, 4);

    if (!voisines.length) return "";

    return (
      '<section class="serie__section">' +
      '<h2 class="serie__titre-section mono">' + t("serie.proches") + "</h2>" +
      '<div class="proches">' +
      voisines.map(function (v) {
        return (
          '<a class="proche" href="' + slug(v.d.titre) + '.html">' +
          '<img src="' + affiche(v.d, B) + '" alt="" loading="lazy">' +
          '<p class="proche__titre">' + esc(v.d.titre) + "</p>" +
          '<p class="proche__meta mono">' + esc(v.communs.map(nomGenre).join(", ")) + "</p>" +
          "</a>"
        );
      }).join("") +
      "</div></section>"
    );
  }

  function voisinage() {
    var avant = index > 0 ? DRAMAS[index - 1] : null;
    var apres = index < DRAMAS.length - 1 ? DRAMAS[index + 1] : null;

    function cote(s, sens, libelle) {
      if (!s) return "<span></span>";
      return (
        '<a class="serie-nav__lien serie-nav__lien--' + sens + '" href="' + slug(s.titre) + '.html">' +
        '<span class="mono">' + libelle + "</span>" +
        "<b>" + esc(s.titre) + "</b></a>"
      );
    }

    return (
      '<nav class="serie-nav">' +
      cote(avant, "prec", t("serie.avant")) +
      cote(apres, "suiv", t("serie.apres")) +
      "</nav>"
    );
  }

  /* ---------------- Assemblage ---------------- */

  var liens =
    '<a class="serie__lien mono" href="https://mydramalist.com' + esc(d.mdl) + '"' +
    ' target="_blank" rel="noopener">' + t("serie.fiche") + ' &#8599;</a>' +
    (d.critique
      ? '<a class="serie__lien serie__lien--fort mono" href="' + B + esc(d.critique) +
        '">' + t("fiche.maCritique") + " " + ICONES.fleche + "</a>"
      : "");

  hote.innerHTML =
    '<a class="backlink mono" href="' + B + 'visionnages.html">' + ICONES.flecheGauche +
    " " + t("nav.tousVisionnages") + "</a>" +

    '<header class="serie__entete">' +
    '<span class="serie__num mono">' + numero(index) + " / " + DRAMAS.length + "</span>" +
    '<h1 class="serie__titre">' + esc(d.titre) + "</h1>" +
    (d.mention ? '<p class="serie__mention mono">' + esc(nomMention(d.mention)) + "</p>" : "") +
    "</header>" +

    '<div class="serie">' +
    '<div class="serie__media">' +
    (affiche(d, B)
      ? '<img class="serie__affiche" src="' + affiche(d, B) + '" alt="Affiche de ' + esc(d.titre) + '">'
      : "") +
    '<div class="serie__liens">' + liens + "</div>" +
    "</div>" +
    '<div class="serie__corps">' +
    infos() +
    notes() +
    (texteSynopsis(d) ? '<p class="serie__synopsis">' + esc(texteSynopsis(d)) + "</p>" : "") +
    "</div>" +
    "</div>" +

    casting() +
    proches() +
    voisinage();

  if (window.Anim) window.Anim.rafraichir(hote);
})();
