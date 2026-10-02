/* =====================================================================
   COQUE RÉZOTOOLS — remplace site_config.js + ui_shell.js quand une
   calculette de tools/ est livrée sur inerweb.fr (pilote-fluides/rezotools/).
   Pose le titre, la barre de navigation entre calculettes et le retour
   vers la page RézoTools. La marque et la licence viennent de marque.js.
   Source : C:/git/Iner.web-tools-beta/rezotools/coque.js
   Livraison : node outils/livrer-rezotools.mjs
   ===================================================================== */
(function () {
  "use strict";
  var CALCULETTES = [
    ["pressure.html", "Pression"],
    ["temp.html", "Température"],
    ["power.html", "Puissance"],
    ["pouce-mm.html", "Pouce ↔ mm"],
    ["pincement.html", "Pincement"],
    ["air-power.html", "Puissance sur l’air"],
    ["airflow-grid.html", "Débit d’une grille"],
    ["water-flow.html", "Débit d’eau"],
    ["cop.html", "COP et coût"],
    ["reglette.html", "Réglette P/T"],
    ["diagnostic.html", "Diagnostic"],
    ["incondensables.html", "Incondensables"],
    ["identification.html", "Identifier un fluide"]
  ];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var ici = (location.pathname.split("/").pop() || "").toLowerCase();

  var h = document.getElementById("iw-header");
  if (h) {
    var sous = (h.getAttribute("data-subtitle") || "").replace(/^Outils atelier\s*—\s*/, "");
    h.className = "iw-header";
    h.innerHTML =
      '<div class="iw-header-center"><h1><a href="../" style="color:#fff;text-decoration:none">RézoTools</a></h1>' +
      (sous ? '<div class="iw-subtitle">' + esc(sous) + "</div>" : "") + "</div>";
  }

  var n = document.getElementById("iw-nav");
  if (n) {
    n.className = "iw-nav";
    n.setAttribute("aria-label", "Calculettes RézoTools");
    var html = '<a href="../">← Tous les outils</a>';
    CALCULETTES.forEach(function (c) {
      var actif = c[0] === ici;
      html += '<a href="' + c[0] + '"' + (actif ? ' class="active" aria-current="page"' : "") + ">" + esc(c[1]) + "</a>";
    });
    n.innerHTML = html;
  }

  var f = document.getElementById("iw-footer");
  if (f) {
    f.className = "iw-footer";
    f.innerHTML = '<p style="text-align:center;margin:1.5rem 0 .5rem">Valeurs d’ordre de grandeur pour l’atelier : en intervention, la documentation du constructeur fait foi. · <a href="https://inerweb.fr/">inerweb.fr</a></p>';
  }
})();
