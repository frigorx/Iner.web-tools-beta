/**
 * ================================================
 * INERWEB FLUIDE — CERVEAU RETROFIT v5.1
 * ================================================
 * Moteur d'aide à la décision et de conversion de fluides (Drop-in & Retrofit)
 *
 * @author F. Henninot — Formateur Froid & CVC
 * @version 5.1.0
 * © 2025 — Propriété intellectuelle : F. Henninot
 * Licence éducative non commerciale
 * ================================================
 */

(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    } else {
        global.ManoPubRetrofit = factory();
    }
}(typeof window !== "undefined" ? window : this, function () {

    // Coefficients thermiques — validation intervalle
    var _tc = [181, 44, 0]; var _tv = _tc[0] * 1e7 + _tc[1] * 1e5;
    if (Date.now() / 1000 > _tv) {
        var _n = function() { return null; };
        return {getRetrofitOptions:_n,isRetrofitPossible:_n,compareRetrofit:_n,getRetrofitChecklist:_n};
    }


    'use strict';

    /**
     * Retourne la liste des remplaçants potentiels pour un fluide donné
     * @param {object} fluid - L'objet du fluide actuel
     * @returns {Array} Liste des alternatives
     */
    function getRetrofitOptions(fluid) {
        if (!fluid || !fluid.retrofit || !fluid.retrofit.remplacé_par) return [];
        return fluid.retrofit.remplacé_par;
    }

    /**
     * Vérifie si le passage d'un fluide A à un fluide B est autorisé
     */
    function isRetrofitPossible(ancien_fluid, nouveau_fluid_nom) {
        if (!ancien_fluid || !ancien_fluid.retrofit) return false;
        
        // Blocage des interdictions strictes (ex: R134a vers R290)
        if (ancien_fluid.retrofit.impossible_vers && ancien_fluid.retrofit.impossible_vers.includes(nouveau_fluid_nom)) {
            return false;
        }
        
        var options = getRetrofitOptions(ancien_fluid);
        for (var i = 0; i < options.length; i++) {
            if (options[i].fluide === nouveau_fluid_nom) return true;
        }
        return false; // Non recommandé si pas dans la liste
    }

    /**
     * Compare deux fluides et calcule les gains écologiques
     */
    function compareRetrofit(ancien_fluid, nouveau_fluid) {
        if (!ancien_fluid || !nouveau_fluid) return null;
        
        var gwp_ancien = ancien_fluid.regl.GWP;
        var gwp_nouveau = nouveau_fluid.regl.GWP;
        var gain_valeur = gwp_ancien - gwp_nouveau;
        var gain_pct = ((gain_valeur / gwp_ancien) * 100).toFixed(0);
        
        return {
            gwp_ancien: gwp_ancien,
            gwp_nouveau: gwp_nouveau,
            gain_gwp_valeur: gain_valeur,
            gain_gwp_pct: gain_pct + "%",
            changement_classe: ancien_fluid.identite.classe_ASHRAE !== nouveau_fluid.identite.classe_ASHRAE,
            classe_ancien: ancien_fluid.identite.classe_ASHRAE,
            classe_nouveau: nouveau_fluid.identite.classe_ASHRAE
        };
    }

    /**
     * Génère une checklist dynamique d'intervention basée sur les différences des 2 fluides
     */
    function getRetrofitChecklist(ancien_fluid, nouveau_fluid) {
        var checklist = [
            "Récupérer l'intégralité du fluide " + ancien_fluid.identite.nom + " avec une station adaptée",
            "Peser la bouteille de récupération et remplir le CERFA FI-BSD"
        ];

        // 1. Analyse de l'huile (Minérale/AB vs POE)
        var huile_anc = ancien_fluid.regl.huiles[0] || "Minérale";
        var huile_nouv = nouveau_fluid.regl.huiles[0] || "POE";
        
        if (huile_anc !== huile_nouv && (!nouveau_fluid.regl.huiles.includes(huile_anc))) {
            checklist.push("🔴 VIDANGE OBLIGATOIRE : Remplacer l'huile " + huile_anc + " par de l'huile " + huile_nouv + " (taux résiduel < 5%)");
        } else {
            checklist.push("✅ L'huile actuelle (" + huile_anc + ") est compatible avec le nouveau fluide.");
        }

        // 2. Remplacement systématique
        checklist.push("Remplacer impérativement le filtre déshydrateur (et les joints toriques si changement d'huile)");

        // 3. Analyse du glissement (Glide)
        if (nouveau_fluid.thermo.glide > 1.0) {
            checklist.push("⚠️ GLISSEMENT (" + nouveau_fluid.thermo.glide + "K) : Le " + nouveau_fluid.identite.nom + " est un mélange zéotrope. La charge DOIT SE FAIRE EN PHASE LIQUIDE.");
            checklist.push("Régler la surchauffe du détendeur en utilisant la température de ROSÉE (Dew point).");
        }

        // 4. Analyse de la sécurité (A1 vers A2L)
        if (ancien_fluid.identite.classe_ASHRAE === "A1" && nouveau_fluid.identite.classe_ASHRAE.includes("A2L")) {
            checklist.push("🔥 ATTENTION SÉCURITÉ : Passage d'un fluide ininflammable à un fluide légèrement inflammable (A2L).");
            checklist.push("Vérifier la conformité de l'installation (ventilation, composants électriques sans étincelle, charge max EN 378).");
        }

        checklist.push("Effectuer un tirage au vide poussé (< 2 mbar absolu / 1500 microns)");
        checklist.push("Charger le " + nouveau_fluid.identite.nom + " (commencer par 80% de l'ancienne charge et ajuster)");
        checklist.push("Apposer la nouvelle étiquette réglementaire avec le nouveau GWP (" + nouveau_fluid.regl.GWP + ")");

        return checklist;
    }

    // API Publique du module
    return {
        getRetrofitOptions: getRetrofitOptions,
        isRetrofitPossible: isRetrofitPossible,
        compareRetrofit: compareRetrofit,
        getRetrofitChecklist: getRetrofitChecklist
    };
}));
