// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator, localizer } from "./i18n";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = translator(lang);
  const l = localizer(lang);
  return (
    <nav>
      <div className="wrap">
        <div
          className="menu-dropdown"
          id="menuDropdown"
          style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }}
        >
          <button className="hamburger-btn" data-on-click="toggleFullMenu()" aria-label="Menu">
            <span className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <img
            src="/images/site/cmz_logo.png"
            alt="CMZ logo"
            className="nav-logo"
            data-on-click="showPage('home')"
            style={{ cursor: "pointer" }}
            width={1239}
            height={516}
            srcSet="/images/site/cmz_logo-120.png 120w, /images/site/cmz_logo-400.png 400w, /images/site/cmz_logo-700.png 700w, /images/site/cmz_logo-900.png 900w, /images/site/cmz_logo.png 1239w"
            sizes="110px"
          />
          <div className="full-menu" id="fullMenu">
            <a data-on-click="navGo('home')" data-en="Home" data-es="Inicio">
              {t("Home", "Inicio")}
            </a>{" "}
            <a data-on-click="navGo('bio')" data-en="Bio" data-es="Bio">
              Bio
            </a>{" "}
            <a data-on-click="navGo('work')" data-en="Portfolio" data-es="Portfolio">
              Portfolio
            </a>{" "}
            <a data-on-click="toggleServicesSubmenu(event)" data-en="Services ▾" data-es="Servicios ▾">
              {t("Services ▾", "Servicios ▾")}
            </a>{" "}
            <div className="full-menu-services">
              <a data-on-click="navGo('live')">{t("— All Services", "— Todos los servicios")}</a>{" "}
              <a href={t("services/murals.html", "es/services/murales.html")}>{t("— Murals", "— Murales")}</a>{" "}
              <a href={t("services/live-painting.html", "es/services/pintura-en-vivo.html")}>
                {t("— Live Painting", "— Pintura en vivo")}
              </a>{" "}
              <a href={t("services/workshops.html", "es/services/talleres.html")}>{t("— Workshops", "— Talleres")}</a>
            </div>{" "}
            <a data-on-click="navGo('shop')" data-en="Shop" data-es="Tienda">
              {t("Shop", "Tienda")}
            </a>{" "}
            <a href={l("#quote")} data-on-click="toggleFullMenu()" data-en="Get a Quote" data-es="Cotizar">
              {t("Get a Quote", "Cotizar")}
            </a>
          </div>
        </div>
        <div className="nav-links">
          <a data-on-click="showPage('home')" data-en="Home" data-es="Inicio">
            {t("Home", "Inicio")}
          </a>{" "}
          <a data-on-click="showPage('bio')" data-en="Bio" data-es="Bio">
            Bio
          </a>{" "}
          <a data-on-click="showPage('work')" data-en="Portfolio" data-es="Portfolio">
            Portfolio
          </a>{" "}
          <div className="nav-services">
            <a data-on-click="showPage('live')" data-en="Services" data-es="Servicios">
              {t("Services", "Servicios")} <span aria-hidden="true">▾</span>
            </a>{" "}
            <div className="nav-services-menu">
              <a href={t("services/murals.html", "es/services/murales.html")}>{t("Murals", "Murales")}</a>{" "}
              <a href={t("services/live-painting.html", "es/services/pintura-en-vivo.html")}>
                {t("Live Painting", "Pintura en vivo")}
              </a>{" "}
              <a href={t("services/workshops.html", "es/services/talleres.html")}>{t("Workshops", "Talleres")}</a>
            </div>
          </div>{" "}
          <a data-on-click="showPage('shop')" data-en="Shop" data-es="Tienda">
            {t("Shop", "Tienda")}
          </a>
        </div>{" "}
        <a href={l("#quote")} className="nav-cta" data-en="Get a Quote" data-es="Cotizar">
          {t("Get a Quote", "Cotizar")}
        </a>{" "}
        <div className="nav-utils">
          <div className="lang-dropdown" id="currencyDropdown" style={{ display: "none" }}>
            <button className="lang-current" id="currencyCurrentBtn" data-on-click="toggleCurrencyMenu()">
              USD <span className="lang-arrow">▾</span>
            </button>
            <div className="lang-menu" id="currencyMenu">
              <button data-on-click="setCurrency('USD')">$ USD</button>
              <button data-on-click="setCurrency('AUD')">A$ AUD</button>
              <button data-on-click="setCurrency('EUR')">€ EUR</button>
              <button data-on-click="setCurrency('ARS')">AR$ ARS</button>
            </div>
          </div>
          <div className="lang-dropdown" id="langDropdown">
            <button className="lang-current" id="langCurrentBtn" data-on-click="toggleLangMenu()">
              🇺🇸 EN <span className="lang-arrow">▾</span>
            </button>
            <div className="lang-menu" id="langMenu">
              <button data-on-click="setLang('en')">🇺🇸 English</button>
              <button data-on-click="setLang('es')">🇪🇸 Español</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
