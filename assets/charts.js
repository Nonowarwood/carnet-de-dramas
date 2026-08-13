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

  /* ---------------- Barres horizontales ----------------

     Deux dispositions :
     - sans vignette, le libellé est calé à droite contre la barre et la
       valeur se pose à sa pointe ;
     - avec vignette, le libellé et la valeur passent au-dessus de la barre,
       de part et d'autre. Les titres longs respirent, et plus rien ne
       déborde en bout de piste. */

  function barres(el, donnees, options) {
    options = options || {};
    var unite = options.unite || "";
    var dec = options.decimales || 0;
    var max = plafond(Math.max.apply(null, donnees.map(function (d) { return d.valeur; })));
    var avecImage = donnees.some(function (d) { return d.image; });

    function tip(d) {
      return echapper(d.detail || (d.label + " — " + fr(d.valeur, dec) + " " + unite));
    }

    var corps = donnees.map(function (d) {
      var pct = (d.valeur / max) * 100;
      var piste =
        '<span class="viz-row__track" style="--pct:' + pct + '%">' +
        '<span class="viz-row__bar" data-tip="' + tip(d) + '"></span>';

      if (!avecImage) {
        return (
          '<div class="viz-row">' +
          '<span class="viz-row__label">' + echapper(d.label) + "</span>" +
          piste +
          '<span class="viz-row__value">' + fr(d.valeur, dec) + "</span>" +
          "</span></div>"
        );
      }

      return (
        '<div class="viz-row viz-row--image">' +
        '<span class="viz-row__img">' +
        (d.image
          ? '<img src="' + echapper(d.image) + '" alt="" loading="lazy">'
          : "") +
        "</span>" +
        '<span class="viz-row__corps">' +
        '<span class="viz-row__entete">' +
        '<span class="viz-row__nom">' + echapper(d.label) + "</span>" +
        '<span class="viz-row__mesure">' + fr(d.valeur, dec) +
        (unite ? " " + echapper(unite) : "") + "</span>" +
        "</span>" +
        piste + "</span>" +
        "</span></div>"
      );
    }).join("");

    var axe = avecImage
      ? ""
      : '<p class="viz-axis mono"><span>0</span><span>' +
        fr(max, 0) + " " + echapper(unite) + "</span></p>";

    el.innerHTML =
      '<div class="viz-plot' + (avecImage ? " viz-plot--images" : "") +
      '" style="--viz-max:' + max + '">' + corps + "</div>" + axe +
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

  /* ---------------- Haltères ----------------

     Deux valeurs par ligne, reliées par un trait : la position de chaque
     point se lit en absolu, la longueur du trait donne l'écart. Seul
     l'écart est étiqueté — poser les deux valeurs sur 29 lignes noierait
     le graphique ; le détail passe par l'infobulle et le tableau. */

  function halteres(el, donnees, options) {
    options = options || {};
    var max = options.max || 10;
    // Sur un graphique de points, c'est la position qui encode la valeur, pas
    // une longueur partant de zéro : on peut donc resserrer l'échelle sur la
    // plage utile, à condition que les bornes soient écrites sur l'axe.
    var min = options.min || 0;
    var noms = options.series || ["A", "B"];

    function pct(v) { return ((v - min) / (max - min)) * 100; }

    var corps = donnees.map(function (d) {
      var a = pct(d.a), b = pct(d.b);
      var gauche = Math.min(a, b), largeur = Math.abs(b - a);
      var signe = d.a - d.b >= 0 ? "+" : "\u2212";

      return (
        '<div class="viz-row viz-row--halt">' +
        '<span class="viz-row__label">' + echapper(d.label) + "</span>" +
        '<span class="viz-halt">' +
        '<span class="viz-halt__lien" style="left:' + gauche + "%;width:" + largeur + '%"></span>' +
        '<span class="viz-halt__pt viz-halt__pt--b" style="left:' + b + '%" data-tip="' +
        echapper(noms[1] + " — " + fr(d.b, 1) + " / " + max) + '"></span>' +
        '<span class="viz-halt__pt viz-halt__pt--a" style="left:' + a + '%" data-tip="' +
        echapper(noms[0] + " — " + fr(d.a, 1) + " / " + max) + '"></span>' +
        "</span>" +
        '<span class="viz-halt__ecart mono">' + signe + fr(Math.abs(d.a - d.b), 1) + "</span>" +
        "</div>"
      );
    }).join("");

    var legende =
      '<div class="viz-legend mono">' +
      '<span class="viz-key"><i class="viz-key__pt viz-key__pt--a"></i>' + echapper(noms[0]) + "</span>" +
      '<span class="viz-key"><i class="viz-key__pt viz-key__pt--b"></i>' + echapper(noms[1]) + "</span>" +
      "</div>";

    el.innerHTML =
      legende +
      '<div class="viz-plot viz-plot--halt">' + corps + "</div>" +
      '<p class="viz-axis mono"><span>' + fr(min, 0) + " / " + max + "</span><span>" +
      fr(max, 0) + " / " + max + "</span></p>" +
      tableauDonnees([options.colonne || "Titre", noms[0], noms[1], "Écart"],
        donnees.map(function (d) {
          return [d.label, fr(d.a, 1), fr(d.b, 1),
                  (d.a - d.b >= 0 ? "+" : "\u2212") + fr(Math.abs(d.a - d.b), 1)];
        }));

    el.querySelectorAll(".viz-halt__pt").forEach(function (pt) {
      survol(pt, pt.getAttribute("data-tip"));
    });
  }

  window.Viz = { barres: barres, colonnes: colonnes, empilee: empilee, halteres: halteres };
})();
