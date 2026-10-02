# REPRISE — Iner.web-tools-beta

## ⭐ État au 02/10/2026 — RézoTools (chantier « Chat 3 », FINITIONS-INERWEB)

- **Moteur `cerveau_v5.js`** : verrou de date (01/07/2027) retiré ; saturation lue dans des **tables CoolProp**
  (bulle + rosée, 57 fluides) générées par `python outils/tables-coolprop.py` — ne jamais éditer le bloc
  `TABLES-COOLPROP` à la main. Antoine était faux de 7 à 31 % (R32, R404A, R407C, R1234yf, R600a).
  Contrôle : < 0,05 % contre CoolProp ; R-449A à < 1 % de la fiche Chemours. R514A absent de CoolProp (équation).
- **Diagnostic** : rosée pour la surchauffe, bulle pour le sous-refroidissement. Réglette v5, identification,
  incondensables passent par les tables.
- **Livraison sur inerweb.fr** : `node outils/livrer-rezotools.mjs` → `C:/git/pilote-fluides/rezotools/calculettes/`
  (13 calculettes, coque `rezotools/coque.js`, marque.js du site). En ligne : https://inerweb.fr/rezotools/
- **Reste** : `co2_fgas_v5` cite le règlement 517/2014 (abrogé par le 2024/573) → relecture sur source primaire
  avant toute livraison ; manomètres, charge A2L, aéraulique pas encore livrés. Le plan du site et le quartier
  (atelier `C:/git/quartier-technique`) pointent encore vers 7 pages GitHub Pages de ce dépôt : **ne pas le passer
  en privé** avant d'avoir livré ces pages et redirigé ces liens.

> ⚠️ **Fiche amorcée automatiquement le 30/08/2026.** Ce dépôt n'avait aucun point
> d'entrée : une session neuve ne pouvait pas savoir où il en était. Tout ce qui suit
> est **lu dans le dépôt**, rien n'est deviné. **À compléter par F. Henninot** :
> l'intention du projet, son état réel et ce qui reste ne peuvent pas se déduire de git.

## Repères

| | |
|---|---|
| Chemin | `C:\git\Iner.web-tools-beta` |
| Branche courante | `main` |
| Commits | 5 |
| Premier commit | 26/02/2026 |
| Dépôt distant | https://github.com/frigorx/Iner.web-tools-beta |
| Autres branches | — |

## Les derniers commits — l'histoire récente fait foi

- **19/08/2026** — La marque vient du site principal : une source, zero divergence
- **19/08/2026** — Signatures visibles : la marque inerweb.fr remplace le nom (les mentions legales gardent l'auteur)
- **19/08/2026** — Neutralisation, suite : derniere modale dormante et logo du lycee retires
- **19/08/2026** — Neutralisation : plus aucune identite d'etablissement dans les outils
- **26/02/2026** — Add files via upload

## Ce qu'il y a à la racine

- `admin.html`
- `aeraulique_v5.html`
- `cerveau_reglementaire.js`
- `cerveau_retrofit.js`
- `cerveau_v5.js`
- `charge_a2l_v5.html`
- `co2_fgas_v5.html`
- `conditions.html`
- `confidentialite.html`
- `diagnostic_depannage_v5.html`
- `identification_v5.html`
- `incondensables_v5.html`
- `index.html`
- `InerWeb-Fluide-v5.2-patch6b\`
- `InerwebTools.png`
- `logo_equatio.png`
- `logo_inerweb_edu.png`
- `logo_inerweb_fluide.html`

## À compléter

- [ ] **À quoi sert ce dépôt**, en une phrase.
- [ ] **Son état** : en production, en chantier, figé, abandonné ?
- [ ] **Ce qui reste à faire**, et ce qui attend une décision.
- [ ] **Les pièges** : ce qu'une session neuve casserait sans le savoir.
