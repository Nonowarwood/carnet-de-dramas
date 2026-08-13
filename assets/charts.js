/* ===============================================================
   Graphiques — HTML et CSS, sans bibliothèque.

   Règles appliquées partout :
   - une seule teinte par graphique à série unique (la longueur porte
     la magnitude, la couleur ne redit pas la même chose)
   - marques fines, extrémité arrondie à 4 px côté valeur, carrée
     côté ligne de base
   - grille en filet d'un pas au-dessus de la surface, jamais en
     pointillés
   - le texte ne porte jamais la couleur de la série
   - infobulle au survol, et tableau de données dépliable sous chaque
     graphique : la couleur n'est jamais le seul canal
   =============================================================== */

(function () {
  "use strict";

  /* ---------------- Infobulle partagée ---------------- */

  var bulle = null;

  function infobulle() {
    if (bulle) return bulle;
    bulle = document.createElement("div");
    bulle.className = "viz-tip";
    bulle.setAttribute("role", "status");
    document.body.appendChild(bulle);
    return bulle;
  }

  function survol(el, texte) {
    el.addEventListener("pointerenter", function () {
      var t = infobulle();
      t.textContent = texte;
      t.classList.add("est-visible");
    });
    el.addEventListener("pointermove", function (e) {
      var t = infobulle();
      var largeur = t.offsetWidth;
      var x = Math.min(Math.max(8, e.clientX - largeur / 2), window.innerWidth - largeur - 8);
      t.style.transform = "translate3d(" + x + "px," + (e.clientY - t.offsetHeight - 14) + "px,0)";
    });
    el.addEventListener("pointerleave", function () {
      if (bulle) bulle.classList.remove("est-visible");
    });
  }

  /* ---------------- Utilitaires ---------------- */

  function fr(n, dec) {
    return n.toFixed(dec || 0).replace(".", ",");
  }

  function echapper(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Échelle arrondie au palier supérieur, pour des repères lisibles. */
  function plafond(max) {
    if (max <= 5) return Math.ceil(max);
    var pas = Math.pow(10, Math.floor(Math.log10(max)));
    if (max / pas < 2) pas = pas / 2;
    else if (max / pas < 5) pas = pas;
    else pas = pas * 2;
    return Math.ceil(max / pas) * pas;
  }

  function tableauDonnees(entetes, lignes) {
    return (
      '<details class="viz-table">' +
      "<summary>Voir les données</summary>" +
      "<table><thead><tr>" +
      entetes.map(function (h) { return "<th>" + echapper(h) + "</th>"; }).join("") +
      "</tr></thead><tbody>" +
      lignes.map(function (l) {
        return "<tr>" + l.map(function (c, i) {
          return (i ? "<td>" : "<th scope='row'>") + echapper(c) + (i ? "</td>" : "</th>");
        }).join("") + "</tr>";
      }).join("") +
      "</tbody></table></details>"
    );
  }

  /* ---------------- Barres horizontales ---------------- */

  function barres(el, donnees, options) {
    options = options || {};
    var unite = options.unite || "";
    var dec = options.decimales || 0;
    var max = plafond(Math.max.apply(null, donnees.map(function (d) { return d.valeur; })));
    // Une colonne d'images n'apparaît que si au moins une entrée en fournit une.
    var avecImage = donnees.some(function (d) { return d.image; });

    var corps = donnees.map(function (d) {
      var pct = (d.valeur / max) * 100;
      return (
        '<div class="viz-row">' +
        // Vignette et libellé forment un seul groupe calé contre la barre,
        // sinon l'image flotte loin du texte quand le libellé est court.
        '<span class="viz-row__tete">' +
        (avecImage
          ? '<span class="viz-row__img">' +
            (d.image ? '<img src="' + echapper(d.image) + '" alt="" loading="lazy">' : "") +
            "</span>"
          : "") +
        '<span class="viz-row__label">' + echapper(d.label) + "</span></span>" +
        // --pct pilote à la fois la longueur de la barre et la position de
        // l'étiquette de valeur, qui reste ainsi collée à la pointe.
        '<span class="viz-row__track" style="--pct:' + pct + '%">' +
        '<span class="viz-row__bar" data-tip="' +
        echapper(d.detail || (d.label + " — " + fr(d.valeur, dec) + " " + unite)) + '"></span>' +
        '<span class="viz-row__value">' + fr(d.valeur, dec) + "</span>" +
        "</span></div>"
      );
    }).join("");

    el.innerHTML =
      '<div class="viz-plot' + (avecImage ? " viz-plot--images" : "") +
      '" style="--viz-max:' + max + '">' + corps + "</div>" +
      '<p class="viz-axis mono"><span>0</span><span>' + fr(max, 0) + " " + echapper(unite) + "</span></p>" +
      tableauDonnees([options.colonne || "Élément", options.mesure || "Valeur"],
        donnees.map(function (d) { return [d.label, fr(d.valeur, dec) + " " + unite]; }));

    el.querySelectorAll(".viz-row__bar").forEach(function (b) {
      survol(b, b.getAttribute("data-tip"));
    });
  }

  /* ---------------- Colonnes ---------------- */

  function colonnes(el, donnees, options) {
    options = options || {};
    var unite = options.unite || "";
    var max = plafond(Math.max.apply(null, donnees.map(function (d) { return d.valeur; })));

    var corps = donnees.map(function (d) {
      var pct = (d.valeur / max) * 100;
      return (
        '<div class="viz-col">' +
        '<span class="viz-col__track" style="--pct:' + pct + '%">' +
        '<span class="viz-col__bar" data-tip="' +
        echapper(d.detail || (d.label + " — " + fr(d.valeur) + " " + unite)) + '"></span>' +
        '<span class="viz-col__value">' + fr(d.valeur) + "</span>" +
        "</span>" +
        '<span class="viz-col__label mono">' + echapper(d.label) + "</span>" +
        "</div>"
      );
    }).join("");

    el.innerHTML =
      '<div class="viz-cols">' + corps + "</div>" +
      tableauDonnees([options.colonne || "Année", options.mesure || "Titres"],
        donnees.map(function (d) { return [d.label, fr(d.valeur) + " " + unite]; }));

    el.querySelectorAll(".viz-col__bar").forEach(function (b) {
      survol(b, b.getAttribute("data-tip"));
    });
  }

  /* ---------------- Barre empilée ---------------- */

  function empilee(el, donnees, options) {
    options = options || {};
    var total = donnees.reduce(function (a, d) { return a + d.valeur; }, 0);

    var segments = donnees.map(function (d, i) {
      var pct = (d.valeur / total) * 100;
      return (
        '<span class="viz-seg" style="width:' + pct + '%;--seg:var(--serie-' + (i + 1) + ')"' +
        ' data-tip="' + echapper(d.label + " — " + d.valeur + " titres, " + fr(pct, 0) + " %") + '">' +
        (pct > 12 ? '<span class="viz-seg__in">' + fr(pct, 0) + " %</span>" : "") +
        "</span>"
      );
    }).join("");

    // Légende obligatoire dès deux séries : l'identité ne repose jamais
    // sur la seule couleur.
    var legende = donnees.map(function (d, i) {
      return '<span class="viz-key"><i style="background:var(--serie-' + (i + 1) + ')"></i>' +
             echapper(d.label) + ' <b>' + d.valeur + "</b></span>";
    }).join("");

    el.innerHTML =
      '<div class="viz-stack">' + segments + "</div>" +
      '<div class="viz-legend mono">' + legende + "</div>" +
      tableauDonnees(["Pays", "Titres", "Part"],
        donnees.map(function (d) {
          return [d.label, String(d.valeur), fr((d.valeur / total) * 100, 0) + " %"];
        }));

    el.querySelectorAll(".viz-seg").forEach(function (s) {
      survol(s, s.getAttribute("data-tip"));
    });
  }

  window.Viz = { barres: barres, colonnes: colonnes, empilee: empilee };
})();
