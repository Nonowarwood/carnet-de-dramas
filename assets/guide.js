/* ===============================================================
   Guide interactif.

   Une visite guidée pas à pas : un projecteur découpe la page autour
   de l'élément commenté, une bulle explique à quoi il sert. Le
   parcours se poursuit de page en page.

   Lancement : bouton « Guide » de l'en-tête, ou automatiquement à la
   toute première visite.
   =============================================================== */

(function () {
  "use strict";

  var MEMOIRE = "carnet:guide-vu";
  var RELAIS = "carnet:guide-suite";

  /* ---------------- Étapes, par page ---------------- */

  var PARCOURS = {
    accueil: [
      {
        cible: ".ring",
        titre: "Le mur d'affiches",
        texte:
          "Les trente séries que j'ai regardées, posées sur un cylindre. " +
          "Fais glisser à la souris, utilise la molette ou les flèches du clavier " +
          "pour le faire tourner.",
      },
      {
        cible: ".ring-caption",
        titre: "La série en façade",
        texte:
          "Le titre, le pays, l'année et ma note se mettent à jour selon " +
          "l'affiche qui arrive de face.",
      },
      {
        cible: ".ring-progress",
        titre: "Ta position",
        texte: "La barre orange indique où tu en es dans les trente titres.",
      },
      {
        cible: ".bar",
        titre: "La navigation",
        texte:
          "Le carnet rassemble les chiffres et les critiques, les visionnages " +
          "détaillent chaque série.",
        suite: { href: "carnet.html", page: "carnet", libelle: "Continuer sur Le carnet" },
      },
    ],

    carnet: [
      {
        cible: "#figures",
        titre: "Les chiffres clés",
        texte:
          "Ma moyenne personnelle sur 5, celle du public sur 10, et le nombre " +
          "de notes maximales que j'ai données.",
      },
      {
        cible: "#critiques",
        titre: "Les critiques",
        texte:
          "Les séries sur lesquelles j'ai écrit un vrai texte. Clique pour " +
          "lire la critique en entier.",
      },
      {
        cible: "#derniers",
        titre: "Les derniers visionnages",
        texte:
          "Les six dernières séries consignées. La jauge noire à droite, " +
          "c'est ma note sur cinq.",
        suite: {
          href: "visionnages.html",
          page: "visionnages",
          libelle: "Continuer sur Les visionnages",
        },
      },
    ],

    visionnages: [
      {
        cible: ".toolbar",
        titre: "Chercher et trier",
        texte:
          "La recherche fouille aussi les genres et les synopsis. Tu peux " +
          "trier par ma note, par celle du public, par année, ou filtrer par pays.",
      },
      {
        cible: ".fiche",
        titre: "Une fiche",
        texte:
          "Affiche, synopsis, ma note et la note du public. Le numéro à gauche " +
          "correspond à l'ordre dans lequel j'ai regardé les séries.",
      },
      {
        cible: ".fiche__stat--consensus",
        titre: "La note du public",
        texte:
          "Une moyenne de MyDramaList et de Viki. Les deux plateformes ne notent " +
          "pas sur la même échelle, alors chacune est recentrée sur sa propre " +
          "moyenne avant d'être combinée — sinon Viki, qui note très haut, " +
          "écraserait tout.",
      },
    ],

    critique: [
      {
        cible: ".article__meta",
        titre: "La fiche en un coup d'œil",
        texte: "Date d'écriture, origine, format, et les deux notes.",
      },
      {
        cible: ".callout",
        titre: "Les avertissements",
        texte:
          "Les blocs orange signalent les passages qui dévoilent l'intrigue. " +
          "Tu peux t'arrêter là si tu comptes regarder la série.",
      },
    ],
  };

  /* ---------------- État ---------------- */

  var etapes = [];
  var index = 0;
  var racine = null;
  var projecteur = null;
  var bulle = null;
  var elementActif = null;

  /* ---------------- Construction ---------------- */

  function construire() {
    racine = document.createElement("div");
    racine.className = "guide";
    racine.setAttribute("role", "dialog");
    racine.setAttribute("aria-modal", "true");
    racine.setAttribute("aria-label", "Guide du site");
    racine.innerHTML =
      '<div class="guide__voile"></div>' +
      '<div class="guide__projecteur"></div>' +
      '<div class="guide__bulle">' +
      '  <p class="guide__compteur mono"></p>' +
      '  <h2 class="guide__titre"></h2>' +
      '  <p class="guide__texte"></p>' +
      '  <div class="guide__pieds">' +
      '    <div class="guide__points"></div>' +
      '    <div class="guide__boutons">' +
      '      <button type="button" class="guide__btn" data-act="prec">Précédent</button>' +
      '      <button type="button" class="guide__btn guide__btn--plein" data-act="suiv"></button>' +
      "    </div>" +
      "  </div>" +
      '  <button type="button" class="guide__fermer" aria-label="Fermer le guide">' +
      '    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<path d="M2 2l8 8M10 2l-8 8"/></svg></button>' +
      "</div>";

    document.body.appendChild(racine);
    projecteur = racine.querySelector(".guide__projecteur");
    bulle = racine.querySelector(".guide__bulle");

    racine.querySelector(".guide__voile").addEventListener("click", fermer);
    racine.querySelector(".guide__fermer").addEventListener("click", fermer);
    racine.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "prec") aller(index - 1);
      else suivant();
    });
  }

  /* ---------------- Positionnement ---------------- */

  function placer() {
    var etape = etapes[index];
    var cible = document.querySelector(etape.cible);
    if (!cible) { suivant(); return; }

    elementActif = cible;
    var r = cible.getBoundingClientRect();
    var marge = 8;

    var haut = Math.max(4, r.top - marge);
    var gauche = Math.max(4, r.left - marge);
    var largeur = Math.min(window.innerWidth - 8, r.width + marge * 2);
    var hauteur = Math.min(window.innerHeight - 8, r.height + marge * 2);

    projecteur.style.top = haut + "px";
    projecteur.style.left = gauche + "px";
    projecteur.style.width = largeur + "px";
    projecteur.style.height = hauteur + "px";

    // La bulle se place sous la cible, ou au-dessus si le bas manque de place.
    var hBulle = bulle.offsetHeight || 220;
    var lBulle = bulle.offsetWidth || 340;
    var dessous = haut + hauteur + 14;
    var dessus = haut - hBulle - 14;
    var y = dessous + hBulle < window.innerHeight - 8 ? dessous : Math.max(8, dessus);
    var x = Math.min(
      Math.max(12, gauche + largeur / 2 - lBulle / 2),
      window.innerWidth - lBulle - 12
    );

    bulle.style.top = y + "px";
    bulle.style.left = x + "px";
  }

  /* ---------------- Rendu d'une étape ---------------- */

  function aller(n) {
    if (n < 0) return;
    if (n >= etapes.length) { fermer(); return; }
    index = n;

    var etape = etapes[index];
    var cible = document.querySelector(etape.cible);
    if (!cible) { aller(n + 1); return; }

    racine.querySelector(".guide__compteur").textContent =
      String(index + 1).padStart(2, "0") + " / " + String(etapes.length).padStart(2, "0");
    racine.querySelector(".guide__titre").textContent = etape.titre;
    racine.querySelector(".guide__texte").textContent = etape.texte;

    var suivantBtn = racine.querySelector('[data-act="suiv"]');
    if (etape.suite) suivantBtn.textContent = etape.suite.libelle;
    else suivantBtn.textContent = index === etapes.length - 1 ? "Terminer" : "Suivant";

    racine.querySelector('[data-act="prec"]').disabled = index === 0;

    racine.querySelector(".guide__points").innerHTML = etapes
      .map(function (_, i) {
        return '<span class="guide__point' + (i === index ? " est-actif" : "") + '"></span>';
      })
      .join("");

    // On amène la cible dans le champ avant de dessiner le projecteur.
    var r = cible.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight - 80) {
      cible.scrollIntoView({ block: "center", behavior: window.Anim && window.Anim.sobre ? "auto" : "smooth" });
      setTimeout(placer, 420);
    } else {
      placer();
    }
  }

  function suivant() {
    var etape = etapes[index];
    if (etape && etape.suite) {
      try { sessionStorage.setItem(RELAIS, etape.suite.page); } catch (e) {}
      window.location.href = etape.suite.href;
      return;
    }
    aller(index + 1);
  }

  /* ---------------- Ouverture / fermeture ---------------- */

  function ouvrir() {
    var page = document.body.getAttribute("data-page");
    etapes = PARCOURS[page] || [];
    if (!etapes.length) return;

    if (!racine) construire();
    document.body.classList.add("guide-ouvert");
    racine.classList.add("est-ouvert");
    aller(0);

    window.addEventListener("resize", placer);
    window.addEventListener("scroll", placer, { passive: true });
    document.addEventListener("keydown", auClavier);

    try { localStorage.setItem(MEMOIRE, "1"); } catch (e) {}
  }

  function fermer() {
    if (!racine) return;
    racine.classList.remove("est-ouvert");
    document.body.classList.remove("guide-ouvert");
    elementActif = null;
    window.removeEventListener("resize", placer);
    window.removeEventListener("scroll", placer);
    document.removeEventListener("keydown", auClavier);
    try { sessionStorage.removeItem(RELAIS); } catch (e) {}
  }

  function auClavier(e) {
    if (e.key === "Escape") fermer();
    else if (e.key === "ArrowRight") suivant();
    else if (e.key === "ArrowLeft") aller(index - 1);
    else return;
    e.preventDefault();
  }

  /* ---------------- Mise en route ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-guide]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); ouvrir(); });
    });

    var page = document.body.getAttribute("data-page");

    // Reprise du parcours après un changement de page.
    var suite = null;
    try { suite = sessionStorage.getItem(RELAIS); } catch (e) {}
    if (suite && suite === page) {
      setTimeout(ouvrir, 500);
      return;
    }

    // Première visite : on propose le guide sur la page d'entrée.
    var dejaVu = null;
    try { dejaVu = localStorage.getItem(MEMOIRE); } catch (e) {}
    if (!dejaVu && page === "accueil") setTimeout(ouvrir, 1800);
  });

  window.Guide = { ouvrir: ouvrir, fermer: fermer };
})();
