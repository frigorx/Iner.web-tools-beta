// Outils Atelier — fonctions communes (v5.1)
(function(){
  'use strict';

  window.iwTools = window.iwTools || {};

  function parseNumber(v){
    if(v === null || v === undefined) return NaN;
    if(typeof v !== 'string') v = String(v);
    v = v.trim().replace(/\s+/g,'');
    if(!v) return NaN;
    // Accepter virgule française
    v = v.replace(',', '.');
    // Retirer caractères non numériques de base
    v = v.replace(/[^0-9.+\-eE]/g, '');
    var n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  }

  function fmt(n, digits){
    if(!Number.isFinite(n)) return '—';
    var d = (digits === undefined) ? 2 : digits;
    // Éviter -0.00
    var v = Math.abs(n) < 1e-12 ? 0 : n;
    return v.toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  }

  async function copyText(text){
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch(e){
      // fallback
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch(_) {}
      document.body.removeChild(ta);
      return true;
    }
  }

  function setText(id, text){
    var el = document.getElementById(id);
    if(el) el.textContent = text;
  }

  function setHTML(id, html){
    var el = document.getElementById(id);
    if(el) el.innerHTML = html;
  }

  window.iwTools.parseNumber = parseNumber;
  window.iwTools.fmt = fmt;
  window.iwTools.copyText = copyText;
  window.iwTools.setText = setText;
  window.iwTools.setHTML = setHTML;
})();
