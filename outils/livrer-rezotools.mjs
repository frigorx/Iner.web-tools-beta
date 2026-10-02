// Livre les calculettes sur inerweb.fr : C:/git/pilote-fluides/rezotools/calculettes/
// Coque inerWeb (rezotools/coque.js) à la place de site_config.js + ui_shell.js,
// marque.js du site (logo, licence CC BY-NC-ND, bandeau de domaine et sceau).
// Moteur cerveau_v5.js : tables CoolProp depuis le 02/10/2026 (outils/tables-coolprop.py).
// co2_fgas_v5 n'est PAS livrée : elle cite le règlement 517/2014, abrogé par le 2024/573.
// Usage : node outils/livrer-rezotools.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = join(dirname(fileURLToPath(import.meta.url)), "..");
const CIBLE = "C:/git/pilote-fluides/rezotools/calculettes";

// [source, sortie, titre propre ou null]
const PAGES = ["pressure", "temp", "power", "pouce-mm", "pincement", "air-power", "airflow-grid", "water-flow", "cop"]
  .map((p) => ["tools/" + p + ".html", p + ".html", null])
  .concat([
    ["reglette_v5.html", "reglette.html", "Réglette pression-température"],
    ["diagnostic_depannage_v5.html", "diagnostic.html", "Diagnostic et dépannage"],
    ["incondensables_v5.html", "incondensables.html", "Test d’incondensables"],
    ["identification_v5.html", "identification.html", "Identifier un fluide"],
  ]);

mkdirSync(CIBLE, { recursive: true });
for (const [src, dst] of [["theme.css", "theme.css"], ["theme_force.css", "theme_force.css"],
  ["tools/tools_common.js", "tools_common.js"], ["rezotools/coque.js", "coque.js"], ["cerveau_v5.js", "cerveau_v5.js"]]) {
  copyFileSync(join(ICI, src), join(CIBLE, dst));
}

const ENTETE = "<!-- FICHIER GÉNÉRÉ — ne pas modifier ici. Source : C:/git/Iner.web-tools-beta ; node outils/livrer-rezotools.mjs -->\n";

for (const [source, sortie, titre] of PAGES) {
  let h = readFileSync(join(ICI, source), "utf8");
  const avant = h;
  h = h.replace(/[ \t]*<script src="(\.\.\/)?site_config\.js"><\/script>\r?\n?/, "")
       .replace(/<script src="(\.\.\/)?ui_shell\.js"( defer)?><\/script>/, (m, a, d) => '<script src="coque.js"' + (d || "") + "></script>")
       .replaceAll('href="index.html"', 'href="../"')
       .replaceAll('href="../theme', 'href="theme')
       .replace(/<title>([^<]*)<\/title>/, (m, t) => "<title>" + (titre || t) + " — RézoTools inerWeb</title>")
       .replace(/<\/body>/, '<script src="../../moteur/marque.js" data-cartouche="Fluide" data-licence="cc-by-nc-nd"></script>\n</body>');
  if (!/name="viewport"/.test(h)) h = h.replace(/<head>/, '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1" />');
  h = h.replace(/<!DOCTYPE html>/i, (m) => m + "\n" + ENTETE);
  for (const reste of ["site_config.js", "ui_shell.js", "../theme"]) {
    if (h.includes(reste)) throw new Error(sortie + " : « " + reste + " » non remplacé");
  }
  if (!h.includes("coque.js")) throw new Error(sortie + " : coque absente");
  if (h === avant) throw new Error(sortie + " : rien n'a changé");
  writeFileSync(join(CIBLE, sortie), h);
}
console.log("RézoTools : " + PAGES.length + " calculettes livrées dans " + CIBLE);
