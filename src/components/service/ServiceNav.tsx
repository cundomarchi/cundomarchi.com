import type { Lang } from "@/lib/site";
import { getServicePages, servicePath } from "@/data";
import { DropdownToggle } from "../NavToggles";
import { ServicesMenuToggle, FullMenuToggle } from "./ServiceNavToggles";

const T = {
  en: { home: "Home", bio: "Bio", work: "Portfolio", services: "Services", all: "", shop: "Shop", quote: "Get a Quote", lang: "🇺🇸 EN" },
  es: { home: "Inicio", bio: "Bio", work: "Portfolio", services: "Servicios", all: "", shop: "Tienda", quote: "Cotizar", lang: "🇪🇸 ES" },
} as const;

/** Barra de las paginas de servicios: incluye el submenu con los tres servicios. */
export function ServiceNav({ lang, alternates }: { lang: Lang; alternates: { en: string; es: string } }) {
  const t = T[lang];
  const home = lang === "es" ? "/es/" : "/";
  const quote = `${home}?request=mural#quote`;
  const services = getServicePages(lang).map((p) => ({ href: servicePath(lang, p.slug), title: p.hero.title }));

  return (
    <nav className="site-nav">
      <div className="wrap">
        <div className="menu-dropdown" style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <FullMenuToggle />
          <a href={home}>
            <img src="/images/site/cmz_logo.png" alt="CMZ logo" className="nav-logo" width={1239} height={516} />
          </a>
          <div className="full-menu">
            <a href={home}>{t.home}</a>
            <a href={`${home}#bio`}>{t.bio}</a>
            <a href={`${home}#work`}>{t.work}</a>
            <ServicesMenuToggle href={`${home}#live`} label={`${t.services} ▾`} />
            <div className="full-menu-services">
              {services.map((s) => (
                <a key={s.href} href={s.href}>
                  — {s.title}
                </a>
              ))}
            </div>
            <a href={`${home}#shop`}>{t.shop}</a>
            <a href={quote}>{t.quote}</a>
          </div>
        </div>
        <div className="nav-links">
          <a href={home}>{t.home}</a>
          <a href={`${home}#bio`}>{t.bio}</a>
          <a href={`${home}#work`}>{t.work}</a>
          <div className="nav-services">
            <a href={`${home}#live`}>
              {t.services} <span aria-hidden="true">▾</span>
            </a>
            <div className="nav-services-menu">
              {services.map((s) => (
                <a key={s.href} href={s.href}>
                  {s.title}
                </a>
              ))}
            </div>
          </div>
          <a href={`${home}#shop`}>{t.shop}</a>
        </div>
        <a href={quote} className="nav-cta">
          {t.quote}
        </a>
        <div className="nav-utils">
          <div className="lang-dropdown">
            <DropdownToggle label={t.lang} ariaLabel={lang === "es" ? "Cambiar idioma" : "Change language"} arrow="▾" />
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
