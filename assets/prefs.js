/* ===============================================================
   RÉGLAGES : langue et thème.

   Les préférences sont posées sur <html> avant le premier rendu par
   un court script en tête de page, pour éviter que le site
   n'apparaisse dans le mauvais thème avant de basculer. Ce fichier
   ne gère que le panneau et l'enregistrement.
   =============================================================== */

(function () {
  "use strict";

  var THEMES = [
    { cle: "defaut",   nom: "reg.themeDefaut",   detail: "reg.themeDefautD",   pastilles: ["#faf9f5", "#14120f", "#ff5c2b"] },
    { cle: "nolabels", nom: "reg.themeNolabels", detail: "reg.themeNolabelsD", pastilles: ["#f1eee6", "#1e2a4a", "#8b2318"] },
    { cle: "sombre",   nom: "reg.themeSombre",   detail: "reg.themeSombreD",   pastilles: ["#121110", "#f4f1ea", "#ff6b3d"] },
  ];

  var racine = null;

  function themeActif() {
    return document.documentElement.getAttribute("data-theme") || "defaut";
  }

  function appliquerTheme(cle) {
    if (cle === "defaut") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", cle);
  }

  /* ---------------- Construction ---------------- */

  function construire() {
    racine = document.createElement("div");
    racine.className = "reglages";
    racine.setAttribute("role", "dialog");
    racine.setAttribute("aria-modal", "true");
    racine.innerHTML =
      '<div class="reglages__voile"></div>' +
      '<div class="reglages__panneau">' +
      '  <div class="reglages__entete">' +
      '    <h2 class="reglages__titre"></h2>' +
      '    <button type="button" class="reglages__fermer">' +
      '      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<path d="M2 2l8 8M10 2l-8 8"/></svg></button>' +
      "  </div>" +
      '  <div class="reglages__groupe" data-groupe="langue"></div>' +
      '  <div class="reglages__groupe" data-groupe="theme"></div>' +
      '  <p class="reglages__note mono"></p>' +
      "</div>";

    document.body.appendChild(racine);
    racine.querySelector(".reglages__voile").addEventListener("click", fermer);
    racine.querySelector(".reglages__fermer").addEventListener("click", fermer);

    racine.addEventListener("click", function (e) {
      var b = e.target.closest("[data-langue]");
      if (b) {
        var p = prefs();
        p.langue = b.getAttribute("data-langue");
        enregistrerPrefs(p);
        // La langue touche tout le contenu rendu : on recharge la page,
        // ce qui reste plus sûr que de re-rendre chaque module à chaud.
        window.location.reload();
        return;
      }
      var th = e.target.closest("[data-theme-cle]");
      if (th) {
        var cle = th.getAttribute("data-theme-cle");
        var q = prefs();
        q.theme = cle;
        enregistrerPrefs(q);
        appliquerTheme(cle);
        peupler();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && racine.classList.contains("est-ouvert")) fermer();
    });
  }

  function peupler() {
    racine.querySelector(".reglages__titre").textContent = t("reg.titre");
    racine.querySelector(".reglages__note").textContent = t("reg.note");
    racine.setAttribute("aria-label", t("reg.titre"));
    racine.querySelector(".reglages__fermer").setAttribute("aria-label", t("reg.fermer"));

    var actuelle = langue();
    racine.querySelector('[data-groupe="langue"]').innerHTML =
      '<p class="reglages__legende mono">' + t("reg.langue") + "</p>" +
      '<div class="reglages__choix">' +
      Object.keys(LANGUES).map(function (l) {
        return (
          '<button type="button" class="reglages__option' +
          (l === actuelle ? " est-actif" : "") + '" data-langue="' + l + '">' +
          '<span class="reglages__code mono">' + LANGUES[l].court + "</span>" +
          "<b>" + LANGUES[l].nom + "</b>" +
          coche(l === actuelle) + "</button>"
        );
      }).join("") + "</div>";

    var actif = themeActif();
    racine.querySelector('[data-groupe="theme"]').innerHTML =
      '<p class="reglages__legende mono">' + t("reg.theme") + "</p>" +
      '<div class="reglages__choix">' +
      THEMES.map(function (th) {
        return (
          '<button type="button" class="reglages__option' +
          (th.cle === actif ? " est-actif" : "") + '" data-theme-cle="' + th.cle + '">' +
          '<span class="reglages__pastilles">' +
          th.pastilles.map(function (c) {
            return '<i style="background:' + c + '"></i>';
          }).join("") + "</span>" +
          "<span><b>" + t(th.nom) + "</b>" +
          '<small>' + t(th.detail) + "</small></span>" +
          coche(th.cle === actif) + "</button>"
        );
      }).join("") + "</div>";
  }

  function coche(actif) {
    return actif
      ? '<svg class="reglages__coche" viewBox="0 0 12 12" fill="none" stroke="currentColor" ' +
        'stroke-width="1.8"><path d="M1.5 6.5l3 3 6-7"/></svg>'
      : '<span class="reglages__coche"></span>';
  }

  function ouvrir() {
    if (!racine) construire();
    peupler();
    racine.classList.add("est-ouvert");
    document.body.classList.add("reglages-ouvert");
  }

  function fermer() {
    if (!racine) return;
    racine.classList.remove("est-ouvert");
    document.body.classList.remove("reglages-ouvert");
  }

  document.addEventListener("DOMContentLoaded", function () {
    appliquerLangue();
    document.querySelectorAll("[data-reglages]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); ouvrir(); });
    });
  });

  window.Reglages = { ouvrir: ouvrir, fermer: fermer };
})();
