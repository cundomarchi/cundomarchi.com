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

  function updateConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    window.gtag('consent', 'update', {
      analytics_storage: value === 'granted' ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    var banner = document.getElementById('cookieConsent');
    if (banner) banner.remove();
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
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-labelledby', 'cookieConsentTitle');
    banner.innerHTML = lang === 'es'
      ? '<div><strong id="cookieConsentTitle">Privacidad y estadísticas</strong><p>Uso Google Analytics para entender qué páginas y murales resultan útiles. Las cookies de estadísticas son opcionales; la publicidad personalizada permanece desactivada. <a href="/es/privacy.html">Ver privacidad y cookies</a>.</p></div><div class="cookie-actions"><button type="button" data-consent="denied">Rechazar</button><button type="button" class="cookie-accept" data-consent="granted">Aceptar estadísticas</button></div>'
      : '<div><strong id="cookieConsentTitle">Privacy and analytics</strong><p>I use Google Analytics to understand which pages and murals are useful. Analytics cookies are optional; personalised advertising remains disabled. <a href="/privacy.html">View privacy and cookies</a>.</p></div><div class="cookie-actions"><button type="button" data-consent="denied">Reject</button><button type="button" class="cookie-accept" data-consent="granted">Accept analytics</button></div>';
    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-consent]');
      if (button) updateConsent(button.getAttribute('data-consent'));
    });
    document.body.appendChild(banner);
  }

  function addSettingsButton() {
    if (document.getElementById('cookieSettings')) return;
    var button = document.createElement('button');
    button.id = 'cookieSettings';
    button.className = 'cookie-settings';
    button.type = 'button';
    button.textContent = lang === 'es' ? 'Cookies' : 'Cookies';
    button.addEventListener('click', function () { showBanner(true); });
    document.body.appendChild(button);
  }

  function init() {
    if (saved === 'granted' || saved === 'denied') addSettingsButton();
    else showBanner(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
