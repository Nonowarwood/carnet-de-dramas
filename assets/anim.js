/* ===============================================================
   Couche d'animation.

   Tout est conditionné à `prefers-reduced-motion` : si le visiteur
   a demandé moins d'animations, les éléments sont simplement posés
   dans leur état final, sans transition ni observateur.
   =============================================================== */

(function () {
  "use strict";

  var SOBRE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Entrée de page ---------------- */

  function entreeDePage() {
    document.documentElement.classList.add("js");
    requestAnimationFrame(function () {
      document.body.classList.add("est-entree");
    });
  }

  /* ---------------- Sortie de page ----------------
     On retarde la navigation le temps du fondu, ce qui enchaîne les
     pages sans le clignotement blanc habituel. */

  function sortieDePage() {
    if (SOBRE) return;

    document.addEventListener("click", function (e) {
      var lien = e.target.closest && e.target.closest("a");
      if (!lien) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (lien.target === "_blank" || lien.hasAttribute("download")) return;

      var href = lien.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      if (lien.hostname && lien.hostname !== window.location.hostname) return;

      e.preventDefault();
      document.body.classList.add("est-sortie");
      setTimeout(function () { window.location.href = lien.href; }, 260);
    });

    // Retour arrière depuis le cache : on annule l'état de sortie.
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) document.body.classList.remove("est-sortie");
    });
  }

  /* ---------------- Révélation au défilement ---------------- */

  function revelations() {
    var cibles = document.querySelectorAll(".reveal:not(.est-visible)");
    if (!cibles.length) return;

    if (SOBRE || !("IntersectionObserver" in window)) {
      cibles.forEach(function (el) { el.classList.add("est-visible"); });
      return;
    }

    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        // Décalage en cascade entre voisins immédiats.
        var parent = entree.target.parentElement;
        var rang = parent ? Array.prototype.indexOf.call(parent.children, entree.target) : 0;
        entree.target.style.transitionDelay = Math.min(rang % 8, 7) * 55 + "ms";
        entree.target.classList.add("est-visible");
        observateur.unobserve(entree.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    cibles.forEach(function (el) { observateur.observe(el); });
  }

  /* Les listes rendues en JavaScript arrivent après coup. */
  function observerNouveaux(racine) {
    var cibles = (racine || document).querySelectorAll(".reveal:not(.est-visible)");
    if (SOBRE || !("IntersectionObserver" in window)) {
      cibles.forEach(function (el) { el.classList.add("est-visible"); });
      return;
    }
    revelations();
  }

  /* ---------------- Titres découpés en mots ---------------- */

  function decouperTitres() {
    document.querySelectorAll("[data-split]").forEach(function (titre) {
      if (SOBRE) { titre.classList.add("est-visible"); return; }
      var lignes = titre.innerHTML.split(/<br\s*\/?>/i);
      titre.innerHTML = lignes.map(function (ligne) {
        var mots = ligne.trim().split(/\s+/).map(function (mot, i) {
          return '<span class="mot"><span class="mot__i" style="transition-delay:' +
                 (i * 60) + 'ms">' + mot + "</span></span>";
        }).join(" ");
        return '<span class="ligne">' + mots + "</span>";
      }).join("");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { titre.classList.add("est-visible"); });
      });
    });
  }

  /* ---------------- Compteurs chiffrés ---------------- */

  function compteurs() {
    var cibles = document.querySelectorAll("[data-compte]");
    if (!cibles.length) return;

    function animer(el) {
      var final = parseFloat(el.getAttribute("data-compte"));
      var decimales = parseInt(el.getAttribute("data-decimales") || "0", 10);
      if (SOBRE) {
        el.textContent = final.toFixed(decimales).replace(".", ",");
        return;
      }
      var depart = performance.now();
      var duree = 1100;
      function pas(maintenant) {
        var t = Math.min(1, (maintenant - depart) / duree);
        // Sortie cubique : démarrage franc, arrivée douce.
        var e = 1 - Math.pow(1 - t, 3);
        el.textContent = (final * e).toFixed(decimales).replace(".", ",");
        if (t < 1) requestAnimationFrame(pas);
      }
      requestAnimationFrame(pas);
    }

    if (!("IntersectionObserver" in window)) {
      cibles.forEach(animer);
      return;
    }
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        animer(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    cibles.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------- Jauge de progression de lecture ---------------- */

  function progressionLecture() {
    var barre = document.querySelector(".scroll-progress__bar");
    if (!barre) return;

    var enAttente = false;
    function maj() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      barre.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
      enAttente = false;
    }
    window.addEventListener("scroll", function () {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(maj);
    }, { passive: true });
    maj();
  }

  /* ---------------- Barre qui s'efface vers le bas ---------------- */

  function barreEscamotable() {
    var barre = document.querySelector(".bar");
    if (!barre || document.body.classList.contains("ring-page")) return;

    var dernier = window.scrollY;
    var enAttente = false;

    function maj() {
      var y = window.scrollY;
      if (y > 140 && y > dernier) barre.classList.add("est-cachee");
      else barre.classList.remove("est-cachee");
      barre.classList.toggle("est-detachee", y > 12);
      dernier = y;
      enAttente = false;
    }
    window.addEventListener("scroll", function () {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(maj);
    }, { passive: true });
  }

  /* ---------------- Légère parallaxe des affiches ---------------- */

  function parallaxeMosaique() {
    var mosaique = document.querySelector(".mosaic");
    if (!mosaique || SOBRE) return;

    var enAttente = false;
    function maj() {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        mosaique.style.setProperty("--decalage", (y * 0.16) + "px");
      }
      enAttente = false;
    }
    window.addEventListener("scroll", function () {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(maj);
    }, { passive: true });
  }

  /* ---------------- Curseur d'indice sur le carrousel ---------------- */

  function curseurCarrousel() {
    var zone = document.querySelector(".ring");
    var curseur = document.querySelector(".curseur");
    if (!zone || !curseur || SOBRE) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    var x = 0, y = 0, cx = 0, cy = 0, actif = false;

    zone.addEventListener("pointerenter", function () {
      actif = true;
      curseur.classList.add("est-visible");
    });
    zone.addEventListener("pointerleave", function () {
      actif = false;
      curseur.classList.remove("est-visible");
    });
    zone.addEventListener("pointermove", function (e) { x = e.clientX; y = e.clientY; });
    zone.addEventListener("pointerdown", function () { curseur.classList.add("est-pressee"); });
    window.addEventListener("pointerup", function () { curseur.classList.remove("est-pressee"); });

    (function suivre() {
      // Poursuite amortie : le curseur traîne légèrement derrière la souris.
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      if (actif) curseur.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(suivre);
    })();
  }

  /* ---------------- Mise en route ---------------- */

  entreeDePage();
  sortieDePage();

  document.addEventListener("DOMContentLoaded", function () {
    decouperTitres();
    revelations();
    compteurs();
    progressionLecture();
    barreEscamotable();
    parallaxeMosaique();
    curseurCarrousel();
  });

  // Exposé pour les pages qui injectent leur contenu après coup.
  window.Anim = { rafraichir: observerNouveaux, sobre: SOBRE };
})();
