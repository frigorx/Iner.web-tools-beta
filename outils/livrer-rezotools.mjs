// Livre les calculettes de tools/ sur inerweb.fr : C:/git/pilote-fluides/rezotools/calculettes/
// Coque inerWeb (rezotools/coque.js) à la place de site_config.js + ui_shell.js,
// marque.js du site (logo, licence CC BY-NC-ND, bandeau de domaine et sceau).
// Les calculettes du moteur cerveau_v5.js ne sont PAS livrées (écarts mesurés, 02/10/2026).
// Usage : node outils/livrer-rezotools.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = join(dirname(fileURLToPath(import.meta.url)), "..");
const CIBLE = "C:/git/pilote-fluides/rezotools/calculettes";
const PAGES = ["pressure", "temp", "power", "pouce-mm", "pincement", "air-power", "airflow-grid", "water-flow", "cop"];

mkdirSync(CIBLE, { recursive: true });
copyFileSync(join(ICI, "theme.css"), join(CIBLE, "theme.css"));
copyFileSync(join(ICI, "theme_force.css"), join(CIBLE, "theme_force.css"));
copyFileSync(join(ICI, "tools/tools_common.js"), join(CIBLE, "tools_common.js"));
copyFileSync(join(ICI, "rezotools/coque.js"), join(CIBLE, "coque.js"));

const ENTETE = "<!-- FICHIER GÉNÉRÉ — ne pas modifier ici. Source : C:/git/Iner.web-tools-beta/tools/ ; node outils/livrer-rezotools.mjs -->\n";

for (const p of PAGES) {
  let h = readFileSync(join(ICI, "tools", p + ".html"), "utf8");
  const avant = h;
  h = h.replace(/[ \t]*<script src="\.\.\/site_config\.js"><\/script>\r?\n/, "")
       .replace(/<script src="\.\.\/ui_shell\.js" defer><\/script>/, '<script src="coque.js" defer></script>')
       .replaceAll('href="index.html"', 'href="../"')
       .replace('href="../theme.css"', 'href="theme.css"')
       .replace('href="../theme_force.css"', 'href="theme_force.css"')
       .replace(/<head>/, '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1" />')
       .replace(/<title>([^<]*)<\/title>/, (m, t) => "<title>" + t + " — RézoTools inerWeb</title>")
       .replace(/<\/body>/, '<script src="../../moteur/marque.js" data-cartouche="Fluide" data-licence="cc-by-nc-nd"></script>\n</body>');
  h = h.replace(/<!DOCTYPE html>/i, (m) => m + "\n" + ENTETE);
  for (const reste of ["site_config.js", "ui_shell.js", "../theme"]) {
    if (h.includes(reste)) throw new Error(p + " : « " + reste + " » non remplacé");
  }
  if (h === avant) throw new Error(p + " : rien n'a changé");
  writeFileSync(join(CIBLE, p + ".html"), h);
}
console.log("RézoTools : " + PAGES.length + " calculettes livrées dans " + CIBLE);
