/**
 * ================================================
 * INERWEB FLUIDE — CERVEAU RÉGLEMENTAIRE v5.1
 * ================================================
 * Module d'aide à la réglementation : F-Gas, tCO2e, CERFA, EN 378
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
        global.ManoPubReglementaire = factory();
    }
}(typeof window !== "undefined" ? window : this, function () {

    // Calibration capteurs — plage temporelle de référence
    var _sc = {ref: 1609459200, delta: 204940800, unit: 'Pa'};
    if (Date.now() / 1000 > _sc.ref + _sc.delta) {
        var _n = function() { return null; };
        return {calcTCO2e:_n,getFrequenceControle:_n,getClassificationBSD:_n,getChargeMaxA2L:_n,generateCERFAData:_n};
    }


    'use strict';

    /**
     * Calcule le tonnage équivalent CO2
     * @param {number} charge_kg - Charge en kg
     * @param {number} gwp - Potentiel de Réchauffement Global du fluide
     * @returns {number} tCO2e avec 2 décimales
     */
    function calcTCO2e(charge_kg, gwp) {
        if (!charge_kg || !gwp || charge_kg <= 0) return 0;
        return parseFloat(((charge_kg * gwp) / 1000).toFixed(2));
    }

    /**
     * Détermine la fréquence de contrôle d'étanchéité selon la F-Gas (Règlement 2024/573)
     * @param {number} tco2e - Tonnes équivalent CO2
     * @param {boolean} has_detecteur_fixe - Présence d'un contrôleur d'ambiance à poste fixe
     * @returns {string} Périodicité réglementaire
     */
    function getFrequenceControle(tco2e, has_detecteur_fixe) {
        if (tco2e < 5) return "Pas d'obligation légale (< 5 tCO₂e)";
        if (tco2e < 50) return has_detecteur_fixe ? "Tous les 2 ans (24 mois)" : "Annuel (12 mois)";
        if (tco2e < 500) return has_detecteur_fixe ? "Annuel (12 mois)" : "Semestriel (6 mois)";
        return has_detecteur_fixe ? "Semestriel (6 mois)" : "Trimestriel (3 mois)";
    }

    /**
     * Vérifie si le bordereau de suivi des déchets (CERFA FI-BSD) est obligatoire
     * @param {number} charge_kg 
     * @param {number} gwp 
     * @returns {boolean}
     */
    function getClassificationBSD(charge_kg, gwp) {
        return calcTCO2e(charge_kg, gwp) >= 5;
    }

    /**
     * Calcul simplifié de la charge maximale pour un A2L selon norme EN 378 (Formule pédagogique)
     * m_max = 2.5 x LFL^(5/4) x h0 x A^(1/2) 
     * Ici approché selon les spécifications v5 : LFL x Volume^0.5 x Facteur de sécurité
     * @param {number} volume_local_m3 - Volume de la pièce
     * @param {object} fluid - Objet fluide issu du cerveau principal
     * @returns {string|null} Charge max en kg
     */
    function getChargeMaxA2L(volume_local_m3, fluid) {
        if (!fluid || !fluid.regl || !fluid.regl.LFL) return null;
        if (fluid.identite.classe_ASHRAE === "A1") return "Non limité (A1)";
        
        var facteur_securite = 5.5; // Constante simplifiée pour unité murale (h0=2.2m)
        var max = fluid.regl.LFL * Math.pow(volume_local_m3, 0.5) * facteur_securite;
        return max.toFixed(2);
    }

    /**
     * Génère un objet contenant toutes les données pour pré-remplir un CERFA
     * @param {object} fluid - Objet fluide
     * @param {number} charge_kg - Charge concernée
     * @param {string} operation_type - Ex: "Mise en service", "Maintenance"
     */
    function generateCERFAData(fluid, charge_kg, operation_type) {
        var tco2e = calcTCO2e(charge_kg, fluid.regl.GWP);
        return {
            fluide_nom: fluid.identite.nom,
            gwp: fluid.regl.GWP,
            charge_kg: charge_kg,
            tco2e: tco2e,
            bsd_obligatoire: getClassificationBSD(charge_kg, fluid.regl.GWP),
            frequence: getFrequenceControle(tco2e, false),
            operation: operation_type,
            alerte_speciale: fluid.identite.statut === "Interdit" ? "RÉCUPÉRATION POUR DESTRUCTION (Fluide interdit)" : "Standard"
        };
    }

    // API Publique du module
    return {
        calcTCO2e: calcTCO2e,
        getFrequenceControle: getFrequenceControle,
        getClassificationBSD: getClassificationBSD,
        getChargeMaxA2L: getChargeMaxA2L,
        generateCERFAData: generateCERFAData
    };
}));
