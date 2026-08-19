/**
 * ================================================
 * INERWEB FLUIDE — CONFIGURATION CENTRALE v5.2
 * ================================================
 * Modifier UNIQUEMENT les valeurs ci-dessous.
 * Tout le reste (header, nav, footer) est généré
 * automatiquement par ui_shell.js.
 * ================================================
 */
var SITE_CONFIG = {

    // ========== IDENTITÉ APPLICATION ==========
    app: {
        nom: "InerWeb Fluide",
        version: "5.2",
        sous_titre: "Suite P\u00e9dagogique \u2014 Froid & CVC",
        description: "Outils interactifs pour l'enseignement professionnel du froid et de la climatisation",
        auteur: "F. Henninot",
        email: "",
        site_web: "",
        annee: 2026
    },

    // ========== LOGOS ==========
    // src: "" = emplacement vide (pointillés)
    // Pour activer un logo: mettre le chemin du fichier
    logos: {
        principal:    { src: "", alt: "Logo \u00e9tablissement", lien: "", hauteur: 45 },
        secondaire:   { src: "", alt: "Logo partenaire", lien: "", hauteur: 42 },
        inerweb_edu:  { src: "logo_inerweb_edu.png", alt: "InerWeb EDU", lien: "", hauteur: 42 }
    },

    // ========== ÉTABLISSEMENT ==========
    etablissement: {
        nom: "",
        type: "",
        ville: "",
        adresse: "",
        telephone: "",
        email: "",
        site_web: "",
        code_uai: ""
    },

    // ========== PARTENAIRES (index vitrine) ==========
    partenaires: [],

    // ========== FORMATIONS (index vitrine) ==========
    formations: [
        { niveau: "CAP", nom: "Installateur en Froid et Conditionnement d'Air", duree: "2 ans" },
        { niveau: "BAC PRO", nom: "MFER \u2014 Maintenance et Efficacit\u00e9 \u00c9nerg\u00e9tique", duree: "3 ans" }
    ],

    // ========== MODULES (nav + grille index) ==========
    modules: [
        { id: "mano",     nom: "Manom\u00e8tres",   icone: "\ud83c\udfaf", href: "manometres_v5.html",  desc: "BP/HP \u2022 35 fluides \u2022 SR/SC", couleur: "#2196f3" },
        { id: "reglette", nom: "R\u00e9glette P/T",  icone: "\ud83d\udccf", href: "reglette_v5.html",    desc: "Correspondance pression-temp\u00e9rature", couleur: "#00a86b" },
        { id: "diag",     nom: "Diagnostic & D\u00e9pannage", icone: "\ud83d\udd0d", href: "diagnostic_depannage_v5.html", desc: "Mesures + Sympt\u00f4mes \u2022 Guide complet", couleur: "#e53935" },
        { id: "aero",     nom: "A\u00e9raulique",   icone: "\ud83d\udca8", href: "aeraulique_v5.html",   desc: "Gaines \u2022 VMC DTU 68.3 \u2022 Psychro", couleur: "#4caf50" },
        { id: "charge",   nom: "Charge A2L",   icone: "\u26a1",       href: "charge_a2l_v5.html",   desc: "EN 378 \u2022 R32 \u2022 Volumes", couleur: "#ff9800" },
        { id: "retrofit", nom: "Retrofit",     icone: "\ud83d\udd04", href: "retrofit_v5.html",     desc: "N1/N2/N3 \u2022 F-Gas \u2022 Checklist", couleur: "#9c27b0" },
        { id: "incond",   nom: "Incondensables", icone: "\ud83e\uddea", href: "incondensables_v5.html", desc: "Test \u2022 D\u00e9tection \u2022 Analyse", couleur: "#c0392b" },
        { id: "ident",    nom: "Identification", icone: "\ud83d\udd2c", href: "identification_v5.html", desc: "Fluide inconnu \u2022 P/T \u2022 Match", couleur: "#8e44ad" },
        { id: "tools",    nom: "Outils Atelier", icone: "\ud83e\uddf0", href: "tools/index.html",          desc: "Conversions \u2022 Calculs \u2022 Terrain", couleur: "#00897b" },
        { id: "co2fgas", nom: "CO\u2082 & F-Gas", icone: "\ud83c\udf0d", href: "co2_fgas_v5.html",         desc: "GWP \u2022 Contr\u00f4les \u2022 CERFA BSD", couleur: "#1565c0" }
    ],

    // ========== VITRINE GLOBALE (toutes les pages) ==========
    // La vitrine apparaît sur CHAQUE page : colonne latérale sur desktop, panneau rétractable sur mobile.
    // Chaque "carte" est un bloc configurable. Types disponibles :
    //   texte   → titre + contenu texte + lien optionnel
    //   lien    → titre + url + label bouton
    //   image   → titre + src image + lien optionnel
    //   video   → titre + url YouTube embed
    //   taxe    → carte spéciale taxe d'apprentissage
    //   dons    → carte spéciale don de matériel
    //   stages  → carte spéciale stages/alternance
    //   html    → contenu HTML libre (iframe, widget, etc.)
    //   contact → titre + email + téléphone + texte
    vitrine: {
        // Titre du panneau vitrine
        titre: "\ud83c\udf93 InerWeb Fluide",

        // URL vidéo de présentation (index uniquement)
        video_url: "",

        // Tableau de cartes — ajoutez, supprimez, réordonnez librement
        cartes: [
            {
                type: "texte",
                titre: "\ud83d\udcd6 Application gratuite",
                contenu: "Cette suite p\u00e9dagogique est mise \u00e0 disposition gratuitement pour promouvoir les fili\u00e8res du froid et de la climatisation.",
                icone: ""
            },
            {
                type: "taxe",
                active: false,
                titre: "\ud83d\udcb0 Taxe d'apprentissage",
                annee: 2026,
                contenu: "Soutenez nos formations froid et clim",
                code_uai: "",
                plateforme: "SOLTéA",
                contact_email: "",
                contact_tel: "",
                bouton: "En savoir plus"
            },
            {
                type: "stages",
                active: false,
                titre: "\ud83c\udfaf Stages et alternance",
                contenu: "CAP et BAC PRO MFER",
                periodes: "",
                contact_email: "",
                bouton: "D\u00e9poser une offre"
            },
            {
                type: "dons",
                active: false,
                titre: "\ud83c\udf81 Don de mat\u00e9riel",
                contenu: "D\u00e9duction fiscale possible",
                types: ["Compresseurs", "Manom\u00e8tres", "Outillage", "Documentation"],
                contact_email: "",
                bouton: "Proposer un don"
            },
            // ---- EXEMPLES D'AUTRES CARTES ----
            // { type: "lien", titre: "📋 Parcoursup", url: "https://parcoursup.fr", bouton: "Candidater →" },
            // { type: "image", titre: "📸 Nos ateliers", src: "photo_atelier.jpg", lien: "" },
            // { type: "video", titre: "🎬 Présentation", url: "https://www.youtube.com/embed/XXXXX" },
            // { type: "contact", titre: "📧 Contact", email: "contact@lpp.fr", tel: "04 91 XX XX XX", contenu: "Secrétariat du lycée" },
            // { type: "html", titre: "📱 Suivez-nous", contenu: "<a href='https://instagram.com/xxx'>Instagram</a>" }
        ]
    },

    // ========== BANDEAU ACTIONS (sous la nav, toutes pages) ==========
    // Tableau de boutons. Vide = bandeau masqué.
    // Chaque entrée : { label, icone, action }
    //   action = "modal:nomModal"  → ouvre une modale existante dans la page
    //   action = "mailto:email"    → lien email
    //   action = "https://..."     → lien externe
    //   action = "page.html"       → lien interne
    // highlight: true → bordure accent (mise en valeur)
    bandeau_actions: [
        // Exemples (décommenter/modifier selon besoins) :
        // { label: "Mentions légales", icone: "\ud83d\udccb", action: "modal:legalModal" },
        // { label: "Devenir partenaire", icone: "\ud83e\udd1d", action: "modal:partnerModal" },
        // { label: "Taxe d'apprentissage", icone: "\ud83d\udcb0", action: "modal:taxeModal", highlight: true }
    ],

    // ========== LIENS LÉGAUX ==========
    legal: {
        mentions: "mentions_legales.html",
        confidentialite: "confidentialite.html",
        conditions: "conditions.html"
    }
};
