(function () {
  'use strict';

  var STORAGE_KEY = 'cmz_analytics_consent_v1';
  var lang = document.documentElement.lang === 'es' ? 'es' : 'en';
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  // Consent Mode v2: advertising stays disabled. Analytics storage is enabled
  // only after an explicit choice; until then Google receives no analytics
  // cookies and adapts measurement to the denied signal.
  window.gtag('consent', 'default', {
    analytics_storage: saved === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
  window.gtag('set', 'allow_google_signals', false);
  window.gtag('set', 'allow_ad_personalization_signals', false);

  // Own visits: open any page once with ?internal=1 on each browser/phone you
  // use (?internal=0 undoes it). From then on that browser's visits carry
  // traffic_type=internal and the GA4 "Internal Traffic" filter drops them.
  var internal = false;
  try {
    var q = window.location.search;
    if (/[?&]internal=1(&|$)/.test(q)) localStorage.setItem('cmz_internal', '1');
    if (/[?&]internal=0(&|$)/.test(q)) localStorage.removeItem('cmz_internal');
    internal = localStorage.getItem('cmz_internal') === '1';
  } catch (e) {}
  if (internal) window.gtag('set', { traffic_type: 'internal' });

  function updateConsent(value) {
    saved = value;
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    window.gtag('consent', 'update', {
      analytics_storage: value === 'granted' ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    var banner = document.getElementById('cookieConsent');
    if (banner) banner.remove();
    liberarEspacio();
    addSettingsButton();
  }

  function showBanner(force) {
    var current = document.getElementById('cookieConsent');
    if (current) current.remove();
    if (!force && (saved === 'granted' || saved === 'denied')) return;

    var banner = document.createElement('section');
    banner.id = 'cookieConsent';
    banner.className = 'cookie-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'cookieConsentTitle');
    banner.innerHTML = lang === 'es'
      ? '<div><strong id="cookieConsentTitle">Cookies</strong><p>Guardamos tu elección. Las cookies para medir visitas son opcionales. <a href="/es/privacy.html">Más información</a>.</p></div><div class="cookie-actions"><button type="button" data-consent="denied">Solo necesarias</button><button type="button" class="cookie-accept" data-consent="granted">Aceptar todas</button></div>'
      : '<div><strong id="cookieConsentTitle">Cookies</strong><p>We remember your choice. Cookies for measuring visits are optional. <a href="/privacy.html">Learn more</a>.</p></div><div class="cookie-actions"><button type="button" data-consent="denied">Necessary only</button><button type="button" class="cookie-accept" data-consent="granted">Accept all</button></div>';
    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-consent]');
      if (button) updateConsent(button.getAttribute('data-consent'));
    });
    document.body.appendChild(banner);
    reservarEspacio(banner);
  }

  // La franja esta fija al borde de abajo, asi que le sumo su alto al final de
  // la pagina: de otro modo le taparia el ultimo pedazo de foto.
  function reservarEspacio(banner) {
    var aplicar = function () {
      document.body.style.paddingBottom = banner.offsetHeight + 'px';
    };
    aplicar();
    if (window.ResizeObserver) new ResizeObserver(aplicar).observe(banner);
    else window.addEventListener('resize', aplicar);
  }

  function liberarEspacio() {
    document.body.style.paddingBottom = '';
  }

  function addSettingsButton() {
    if (document.getElementById('cookieSettings')) return;
    var button = document.createElement('button');
    button.id = 'cookieSettings';
    button.className = 'cookie-settings';
    button.type = 'button';
    button.textContent = lang === 'es' ? 'Cookies' : 'Cookies';
    button.addEventListener('click', function () { showBanner(true); });
    var pie = document.querySelector('.foot-legal');
    if (pie) pie.appendChild(button);
    else document.body.appendChild(button);
  }

  function init() {
    if (saved === 'granted' || saved === 'denied') addSettingsButton();
    else showBanner(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
