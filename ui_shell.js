/**
 * ================================================
 * INERWEB FLUIDE — UI SHELL v5.2
 * Header / Nav / Footer / Zoom / Accessibilité
 * ================================================
 * Charte "Plus d'orange" :
 *   Navy = structure, Orange = signature
 *   Menthe = nav, Turquoise = secondaire
 * ================================================
 */
(function() {
    'use strict';

    var C = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : {};
    var A = C.app || {};
    var L = C.logos || {};
    var M = C.modules || [];
    var LEG = C.legal || {};

    var VERSION = A.version || '5.2';
    var APP_NAME = A.nom || 'InerWeb Fluide';
    var AUTEUR = A.auteur || 'F. Henninot';
    var ANNEE = A.annee || new Date().getFullYear();

    /* Détection sous-dossier (tools/) */
    var pathParts = location.pathname.split('/');
    var pageName = pathParts.pop() || 'index.html';
    var parentDir = pathParts.pop() || '';
    var _isSubdir = (parentDir === 'tools');
    var _prefix = _isSubdir ? '../' : '';

    function currentPage() {
        return pageName;
    }

    function resolveHref(href) {
        if (!href) return '#';
        if (_isSubdir && !href.startsWith('http') && !href.startsWith('#')) {
            if (href.startsWith('tools/')) return href.replace('tools/', '');
            return _prefix + href;
        }
        return href;
    }

    function esc(s) {
        if (!s) return '';
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    // ========== STORAGE ==========
    function savePref(key, val) {
        try { localStorage.setItem('iw_' + key, JSON.stringify(val)); } catch(e) {}
    }
    function loadPref(key, fallback) {
        try {
            var v = localStorage.getItem('iw_' + key);
            return v !== null ? JSON.parse(v) : fallback;
        } catch(e) { return fallback; }
    }

    // ========== HEADER ==========
    function buildHeader(subtitle) {
        var el = document.getElementById('iw-header');
        if (!el) return;

        var logosHTML = '';
        ['principal', 'secondaire', 'inerweb_edu'].forEach(function(k) {
            var lg = L[k];
            if (!lg) return;
            var src = lg.src ? resolveHref(lg.src) : '';
            if (src) {
                var click = lg.lien ? ' onclick="window.open(\'' + esc(lg.lien) + '\',\'_blank\')"' : '';
                logosHTML += '<div class="iw-logo-slot"' + click + '><img src="' + esc(src) + '" alt="' + esc(lg.alt || '') + '" style="max-height:' + (lg.hauteur || 40) + 'px"></div>';
            } else {
                logosHTML += '<div class="iw-logo-slot empty"><span>' + esc(lg.alt || 'Logo') + '</span></div>';
            }
        });

        var sub = subtitle || A.sous_titre || '';

        el.className = 'iw-header';
        // Logo SVG InerWeb Fluide (version blanche pour fond navy)
        var logoSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="280" height="40" viewBox="0 0 400 50" style="vertical-align:middle">' +
            '<text fill="#ffffff" font-size="28px" x="4" y="34">\u2744\uFE0F</text>' +
            '<text fill="#ffffff" font-family="Trebuchet MS,sans-serif" font-size="26px" font-weight="bold" x="44" y="32">iner</text>' +
            '<text fill="#ffffff" font-family="Segoe Script,Brush Script MT,cursive" font-size="26px" x="94" y="32">Web</text>' +
            '<line stroke="#e8914a" stroke-width="2" x1="44" x2="150" y1="35" y2="35"/>' +
            '<rect fill="#e8914a" x="155" y="10" rx="5" ry="5" width="70" height="24"/>' +
            '<text fill="#ffffff" font-family="Segoe UI,sans-serif" font-size="14px" font-weight="bold" x="190" y="27" text-anchor="middle">Fluide</text>' +
            '</svg>';

        el.innerHTML =
            '<div class="iw-header-left">' + logosHTML + '</div>' +
            '<div class="iw-header-center">' +
                logoSVG + ' <span class="iw-version">v' + esc(VERSION) + '</span>' +
                (sub ? '<p class="iw-subtitle">' + sub + '</p>' : '') +
            '</div>' +
            '<div class="iw-header-right">' +
                '<strong>Auteur:</strong> ' + esc(AUTEUR) + '<br>' +
                '<strong>Licence:</strong> \u00C9ducative non commerciale' +
            '</div>';
    }

    // ========== NAV ==========
    function buildNav() {
        var el = document.getElementById('iw-nav');
        if (!el) return;

        el.className = 'iw-nav';
        var cp = currentPage();
        var indexHref = resolveHref('index.html');
        var isIndex = (cp === 'index.html');

        var html = '<a href="' + indexHref + '"' + (isIndex ? ' class="active"' : '') + '>\u2302 Accueil</a>';

        M.forEach(function(m) {
            if (!m.href || m.href.indexOf('#') >= 0) return;
            var href = resolveHref(m.href);
            var target = m.href.replace(/^.*\//, '');
            var isActive = (cp === target) ? ' class="active"' : '';
            html += '<a href="' + esc(href) + '"' + isActive + '>' + esc(m.nom) + '</a>';
        });

        el.innerHTML = html;
    }

    // ========== BANDEAU ACTIONS ==========
    function buildBandeau() {
        var actions = C.bandeau_actions || [];
        if (!actions.length) return; // Vide = pas de bandeau

        // Créer le bandeau après la nav
        var nav = document.getElementById('iw-nav');
        var target = nav || document.querySelector('.iw-nav');
        if (!target) return;

        var bar = document.createElement('div');
        bar.className = 'iw-bandeau-actions';

        var html = '';
        for (var i = 0; i < actions.length; i++) {
            var a = actions[i];
            var cls = 'iw-bandeau-btn' + (a.highlight ? ' highlight' : '');
            var icone = a.icone ? a.icone + ' ' : '';
            var action = a.action || '#';

            if (action.indexOf('modal:') === 0) {
                var modalId = action.replace('modal:', '');
                html += '<a href="#" class="' + cls + '" onclick="showModal(\'' + esc(modalId) + '\');return false;">' + icone + esc(a.label) + '</a>';
            } else if (action.indexOf('mailto:') === 0) {
                html += '<a href="' + esc(action) + '" class="' + cls + '">' + icone + esc(a.label) + '</a>';
            } else if (action.indexOf('http') === 0) {
                html += '<a href="' + esc(action) + '" class="' + cls + '" target="_blank">' + icone + esc(a.label) + '</a>';
            } else {
                html += '<a href="' + esc(resolveHref(action)) + '" class="' + cls + '">' + icone + esc(a.label) + '</a>';
            }
        }

        bar.innerHTML = html;
        target.parentNode.insertBefore(bar, target.nextSibling);
    }

    // ========== FOOTER ==========
    function buildFooter() {
        var el = document.getElementById('iw-footer');
        if (!el) return;

        el.className = 'iw-footer';
        el.innerHTML =
            '<div>\u00A9 ' + ANNEE + ' ' + esc(APP_NAME) + ' v' + esc(VERSION) +
            ' \u2014 ' + esc(AUTEUR) + ' \u2022 Licence \u00e9ducative non commerciale</div>' +
            '<div class="iw-footer-legal">' +
                '<a href="' + esc(resolveHref(LEG.mentions || 'mentions_legales.html')) + '">Mentions l\u00e9gales</a> \u2022 ' +
                '<a href="' + esc(resolveHref(LEG.confidentialite || 'confidentialite.html')) + '">Confidentialit\u00e9</a> \u2022 ' +
                '<a href="' + esc(resolveHref(LEG.conditions || 'conditions.html')) + '">Conditions</a>' +
            '</div>';
    }

    // ========== ZOOM ==========
    function buildZoom() {
        if (document.querySelector('.iw-zoom')) return;

        var z = document.createElement('div');
        z.className = 'iw-zoom';
        z.innerHTML =
            '<button onclick="iwZoom(-1)" title="R\u00e9duire">\u2212</button>' +
            '<button onclick="iwZoom(0)" title="Normal">\u25C9</button>' +
            '<button onclick="iwZoom(1)" title="Agrandir">+</button>';
        document.body.appendChild(z);
    }

    var _zoomLevel = 100;
    window.iwZoom = function(dir) {
        // Unified with a11y scaling
        if (dir === 0) applyFontScale(1);
        else applyFontScale(_fontScale + dir * 0.1);
    };

    // ========== ACCESSIBILITÉ ==========
    var _fontScale = loadPref('fontScale', 1);
    var _dysMode = loadPref('dysMode', false);

    function applyFontScale(scale) {
        _fontScale = Math.max(0.8, Math.min(1.6, scale));
        // Nettoyer tout ancien fontSize sur <html> (versions précédentes)
        document.documentElement.style.removeProperty('font-size');
        // Seule la variable CSS pilote le scaling
        document.documentElement.style.setProperty('--font-scale', _fontScale);
        savePref('fontScale', _fontScale);
        var display = document.getElementById('iwA11yScaleValue');
        if (display) display.textContent = Math.round(_fontScale * 100) + '%';
    }

    function applyDysMode(on) {
        _dysMode = !!on;
        document.body.classList.toggle('dys-mode', _dysMode);
        savePref('dysMode', _dysMode);
        var toggle = document.getElementById('iwA11yDysToggle');
        if (toggle) toggle.checked = _dysMode;
    }

    function buildA11yPanel() {
        if (document.querySelector('.iw-a11y-toggle')) return;

        var btn = document.createElement('button');
        btn.className = 'iw-a11y-toggle';
        btn.title = 'Accessibilit\u00e9';
        btn.setAttribute('aria-label', 'Ouvrir panneau accessibilit\u00e9');
        btn.innerHTML = '\u2699';
        btn.onclick = function() {
            var panel = document.getElementById('iwA11yPanel');
            var isOpen = panel.classList.toggle('open');
            btn.classList.toggle('open', isOpen);
            btn.innerHTML = isOpen ? '\u2715' : '\u2699';
        };
        document.body.appendChild(btn);

        var panel = document.createElement('div');
        panel.className = 'iw-a11y-panel';
        panel.id = 'iwA11yPanel';
        panel.innerHTML =
            '<div class="iw-a11y-title">' +
                '\u2699\uFE0F Accessibilit\u00e9' +
            '</div>' +

            '<div class="iw-a11y-row">' +
                '<span class="iw-a11y-label">Taille texte</span>' +
                '<div class="iw-a11y-size-controls">' +
                    '<button onclick="iwA11ySize(-0.1)" title="R\u00e9duire" aria-label="R\u00e9duire la taille">A\u2212</button>' +
                    '<span id="iwA11yScaleValue" class="iw-a11y-size-value">' + Math.round(_fontScale * 100) + '%</span>' +
                    '<button onclick="iwA11ySize(0.1)" title="Agrandir" aria-label="Agrandir la taille">A+</button>' +
                '</div>' +
            '</div>' +

            '<div class="iw-a11y-row" style="padding-top:0">' +
                '<span></span>' +
                '<button onclick="iwA11ySize(0)" style="' +
                    'font-size:0.75rem;padding:4px 10px;border-radius:6px;' +
                    'border:1px solid #d5dde5;background:#f8f7f4;color:#5a7080;' +
                    'cursor:pointer;transition:all 0.2s' +
                '">R\u00e9initialiser</button>' +
            '</div>' +

            '<hr style="border:none;border-top:1px solid #e8ddd2;margin:0.3rem 0">' +

            '<div class="iw-a11y-row">' +
                '<div>' +
                    '<span class="iw-a11y-label">Police adapt\u00e9e</span>' +
                    '<br><span style="font-size:0.7rem;color:#5a7080">Verdana + espacement</span>' +
                '</div>' +
                '<label class="iw-toggle">' +
                    '<input type="checkbox" id="iwA11yDysToggle" ' + (_dysMode ? 'checked' : '') + ' onchange="iwA11yDys(this.checked)">' +
                    '<span class="iw-toggle-slider"></span>' +
                '</label>' +
            '</div>' +

            '<div style="margin-top:0.5rem;padding:0.5rem;background:rgba(232,145,74,0.06);border-radius:8px;font-size:0.72rem;color:#5a7080;line-height:1.5">' +
                '\u2139\uFE0F La <strong>police adapt\u00e9e</strong> utilise Verdana avec un espacement \u00e9largi pour faciliter la lecture.' +
            '</div>';

        document.body.appendChild(panel);
    }

    window.iwA11ySize = function(delta) {
        if (delta === 0) applyFontScale(1);
        else applyFontScale(_fontScale + delta);
    };

    window.iwA11yDys = function(on) {
        applyDysMode(on);
    };

    // ========== FAVICON — Orange ========== */
    function addFavicon() {
        if (document.querySelector('link[rel="icon"]')) return;
        var link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = 'data:image/svg+xml,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
            '<circle cx="16" cy="16" r="15" fill="#0f2d52"/>' +
            '<circle cx="16" cy="16" r="12" fill="none" stroke="#e8914a" stroke-width="3"/>' +
            '<text x="16" y="22" text-anchor="middle" fill="#e8914a" font-size="16" font-weight="bold" font-family="Arial">F</text>' +
            '</svg>'
        );
        document.head.appendChild(link);
    }

    // ========== VITRINE GLOBALE ==========
    var VIT = C.vitrine || {};
    var _vitrineOpen = false;

    function buildVitrine() {
        // Ne pas dupliquer
        if (document.getElementById('iw-vitrine-panel')) return;
        var cartes = VIT.cartes || [];
        if (!cartes.length) return;

        var titre = VIT.titre || '\ud83c\udf93 Vitrine';

        // Construire les cartes HTML
        var cartesHTML = '';
        for (var i = 0; i < cartes.length; i++) {
            var c = cartes[i];
            // Skip cartes inactives (taxe, dons, stages)
            if (c.active === false) continue;
            cartesHTML += buildVitrineCarte(c);
        }
        if (!cartesHTML) return; // Aucune carte active

        // Panneau vitrine
        var panel = document.createElement('div');
        panel.id = 'iw-vitrine-panel';
        panel.className = 'iw-vitrine';
        panel.innerHTML =
            '<div class="iw-vitrine-header">' +
                '<span class="iw-vitrine-titre">' + titre + '</span>' +
            '</div>' +
            '<div class="iw-vitrine-handle" onclick="iwVitrineToggle()" title="Réduire la vitrine">' +
                '<span>\u203A</span>' +
            '</div>' +
            '<div class="iw-vitrine-body">' + cartesHTML + '</div>';

        // Onglet latéral (visible quand vitrine fermée)
        var tab = document.createElement('div');
        tab.id = 'iw-vitrine-tab';
        tab.className = 'iw-vitrine-tab';
        tab.onclick = function() { iwVitrineToggle(); };
        tab.innerHTML = '<span>\ud83c\udf93</span>';
        tab.title = 'Ouvrir la vitrine';

        document.body.appendChild(panel);
        document.body.appendChild(tab);

        // Par défaut: OUVERTE sur desktop large, fermée sur mobile
        if (window.innerWidth >= 1100) {
            iwVitrineToggle(true);
        }
    }

    function buildVitrineCarte(c) {
        var html = '<div class="iw-v-card iw-v-' + esc(c.type || 'texte') + '">';

        if (c.titre) {
            html += '<div class="iw-v-card-titre">' + c.titre + '</div>';
        }

        switch(c.type) {
            case 'texte':
                if (c.contenu) html += '<p class="iw-v-card-texte">' + c.contenu + '</p>';
                if (c.lien) html += '<a class="iw-v-btn" href="' + esc(c.lien) + '" target="_blank">' + esc(c.bouton || 'En savoir plus \u2192') + '</a>';
                break;

            case 'lien':
                if (c.contenu) html += '<p class="iw-v-card-texte">' + c.contenu + '</p>';
                if (c.url) html += '<a class="iw-v-btn" href="' + esc(c.url) + '" target="_blank">' + esc(c.bouton || 'Ouvrir \u2192') + '</a>';
                break;

            case 'image':
                if (c.src) {
                    var imgSrc = resolveHref(c.src);
                    html += '<img class="iw-v-img" src="' + esc(imgSrc) + '" alt="' + esc(c.titre || '') + '">';
                }
                if (c.lien) html += '<a class="iw-v-btn" href="' + esc(c.lien) + '" target="_blank">' + esc(c.bouton || 'Voir \u2192') + '</a>';
                break;

            case 'video':
                if (c.url) {
                    html += '<div class="iw-v-video"><iframe src="' + esc(c.url) + '" allowfullscreen></iframe></div>';
                }
                break;

            case 'taxe':
                html += '<p class="iw-v-card-texte">' + esc(c.contenu || 'Soutenez nos formations') + '</p>';
                if (c.code_uai) html += '<div class="iw-v-detail">Code UAI : <strong>' + esc(c.code_uai) + '</strong></div>';
                if (c.plateforme) html += '<div class="iw-v-detail">Via <strong>' + esc(c.plateforme) + '</strong></div>';
                if (c.contact_email) html += '<a class="iw-v-btn" href="mailto:' + esc(c.contact_email) + '">' + esc(c.bouton || '\ud83d\udce7 Contact') + '</a>';
                else if (c.bouton) html += '<span class="iw-v-btn-disabled">' + esc(c.bouton) + '</span>';
                break;

            case 'dons':
                if (c.types && c.types.length) {
                    html += '<p class="iw-v-card-texte iw-v-small">' + c.types.join(', ') + '</p>';
                }
                html += '<p class="iw-v-card-texte">' + esc(c.contenu || '') + '</p>';
                if (c.contact_email) html += '<a class="iw-v-btn" href="mailto:' + esc(c.contact_email) + '">' + esc(c.bouton || '\ud83d\udce7 Proposer') + '</a>';
                break;

            case 'stages':
                html += '<p class="iw-v-card-texte">' + esc(c.contenu || '') + '</p>';
                if (c.periodes) html += '<div class="iw-v-detail">P\u00e9riodes : ' + esc(c.periodes) + '</div>';
                if (c.contact_email) html += '<a class="iw-v-btn" href="mailto:' + esc(c.contact_email) + '">' + esc(c.bouton || 'D\u00e9poser une offre') + '</a>';
                break;

            case 'contact':
                if (c.contenu) html += '<p class="iw-v-card-texte">' + c.contenu + '</p>';
                if (c.email) html += '<div class="iw-v-detail">\ud83d\udce7 <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></div>';
                if (c.tel) html += '<div class="iw-v-detail">\ud83d\udcde ' + esc(c.tel) + '</div>';
                break;

            case 'html':
                if (c.contenu) html += '<div class="iw-v-html">' + c.contenu + '</div>';
                break;

            default:
                if (c.contenu) html += '<p class="iw-v-card-texte">' + esc(c.contenu) + '</p>';
        }

        html += '</div>';
        return html;
    }

    window.iwVitrineToggle = function(forceOpen) {
        var panel = document.getElementById('iw-vitrine-panel');
        var tab = document.getElementById('iw-vitrine-tab');
        if (!panel) return;

        if (typeof forceOpen === 'boolean') {
            _vitrineOpen = forceOpen;
        } else {
            _vitrineOpen = !_vitrineOpen;
        }

        panel.classList.toggle('open', _vitrineOpen);
        if (tab) tab.classList.toggle('hidden', _vitrineOpen);
        document.body.classList.toggle('iw-vitrine-active', _vitrineOpen);
    };

    // ========== META ==========
    function ensureMeta() {
        if (!document.querySelector('meta[name="author"]')) {
            var m = document.createElement('meta');
            m.name = 'author'; m.content = AUTEUR;
            document.head.appendChild(m);
        }
        if (!document.querySelector('meta[name="viewport"]')) {
            var v = document.createElement('meta');
            v.name = 'viewport'; v.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(v);
        }
    }

    // ========== INIT ==========
    function init() {
        var headerEl = document.getElementById('iw-header');
        var subtitle = headerEl ? headerEl.getAttribute('data-subtitle') : '';

        addFavicon();
        ensureMeta();
        buildHeader(subtitle);
        buildNav();
        buildBandeau();
        buildFooter();
        buildVitrine();
        buildZoom();
        buildA11yPanel();

        applyFontScale(_fontScale);
        applyDysMode(_dysMode);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
