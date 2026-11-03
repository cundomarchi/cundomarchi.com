import type { Lang } from "@/lib/site";
import { MenuToggle, DropdownToggle } from "./NavToggles";

const LABELS = {
  en: { home: "Home", bio: "Bio", work: "Portfolio", live: "Services", shop: "Shop", quote: "Get a Quote", lang: "🇺🇸 EN" },
  es: { home: "Inicio", bio: "Bio", work: "Portfolio", live: "Servicios", shop: "Tienda", quote: "Pedir presupuesto", lang: "🇪🇸 ES" },
} as const;

export interface SiteNavProps {
  lang: Lang;
  /** Adonde lleva el selector de idioma para ver esta misma pagina. */
  alternates: { en: string; es: string };
}

/** Barra de navegacion de las paginas internas (murales, 404, legales). */
export function SiteNav({ lang, alternates }: SiteNavProps) {
  const t = LABELS[lang];
  const home = lang === "es" ? "/es/" : "/";
  const links = (
    <>
      <a href={`${home}#home`}>{t.home}</a>
      <a href={`${home}#bio`}>{t.bio}</a>
      <a href={`${home}#work`}>{t.work}</a>
      <a href={`${home}#live`}>{t.live}</a>
      <a href={`${home}#shop`}>{t.shop}</a>
    </>
  );

  return (
    <nav className="mural-site-nav" aria-label="Primary navigation">
      <div className="wrap">
        <div className="menu-dropdown" style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <MenuToggle />
          <a href={`${home}#home`} aria-label="Home">
            <img
              src="/images/site/cmz_logo-400.png"
              srcSet="/images/site/cmz_logo-120.png 120w, /images/site/cmz_logo-400.png 400w"
              sizes="110px"
              alt="Cundo Marchi"
              width={400}
              height={167}
              className="nav-logo"
            />
          </a>
          <div className="full-menu">
            {links}
            <a href={`${home}#quote`}>{t.quote}</a>
          </div>
        </div>
        <div className="nav-links">{links}</div>
        <a href={`${home}#quote`} className="nav-cta">
          {t.quote}
        </a>
        <div className="nav-utils">
          <div className="lang-dropdown">
            <DropdownToggle label={t.lang} />
            <div className="lang-menu">
              <a href={alternates.en}>🇺🇸 English</a>
              <a href={alternates.es}>🇪🇸 Español</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
