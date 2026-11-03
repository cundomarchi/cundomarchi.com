import Script from "next/script";
import type { ServicePage, ServiceSection } from "@/data/service-types";
import { servicePath } from "@/data";
import { Photo } from "../mural/Photo";
import { JsonLd } from "../JsonLd";
import { ServiceNav } from "./ServiceNav";

function Section({ section, home }: { section: ServiceSection; home: string }) {
  switch (section.kind) {
    case "eyebrow":
      return (
        <span className="eyebrow" style={{ marginTop: 46 }}>
          {section.text}
        </span>
      );
    case "categories":
      return (
        <div className="mural-categories-grid">
          {section.items.map((c) => (
            <div key={c.title} className="mural-card-intro">
              <h4>{c.title}</h4>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      );
    case "comparisons":
      return (
        <div className="service-comparisons">
          {section.items.map((c) => (
            <button
              key={c.title}
              type="button"
              className="mural-compare-preview service-compare-preview"
              data-before={c.before.src}
              data-after={c.after.src}
              data-title={c.title}
              data-before-label={c.beforeLabel}
              data-after-label={c.afterLabel}
            >
              <span className="mcp-imgs">
                <span className="mcp-img">
                  <Photo photo={c.before} />
                  <span className="mcp-tag">{c.beforeLabel}</span>
                </span>
                <span className="mcp-img">
                  <Photo photo={c.after} />
                  <span className="mcp-tag">{c.afterLabel}</span>
                </span>
              </span>
              <span className="mcp-caption">{c.caption}</span>
            </button>
          ))}
        </div>
      );
    case "live-event":
      return (
        <div className="live-event">
          <h3>{section.title}</h3>
          <p className="live-event-meta">{section.meta}</p>
          <div className="live-gallery">
            {section.figures.map((f) => (
              <figure key={f.img.src}>
                <Photo photo={f.img} />
                {f.caption && <figcaption>{f.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      );
    case "workshop-gallery":
      return (
        <div className="workshop-gallery">
          <p className="step-label">{section.label}</p>
          <div className="workshop-photo-row">
            {section.images.map((p) => (
              <div key={p.src} className="workshop-photo">
                <Photo photo={p} />
              </div>
            ))}
          </div>
        </div>
      );
    case "cta":
      return (
        <div className="service-page-cta">
          <div>
            {section.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
            <p>{section.text}</p>
          </div>
          <a className="btn-primary" href={`${home}?request=${section.request}#quote`}>
            {section.label}
          </a>
        </div>
      );
  }
}

export function ServiceView({ page }: { page: ServicePage }) {
  const home = page.lang === "es" ? "/es/" : "/";
  const other = page.lang === "es" ? "en" : "es";
  const alternates =
    page.lang === "es"
      ? { en: servicePath(other, page.alternateSlug), es: servicePath("es", page.slug) }
      : { en: servicePath("en", page.slug), es: servicePath(other, page.alternateSlug) };

  return (
    <>
      {page.seo.jsonLd.map((d, i) => (
        <JsonLd key={i} data={d} />
      ))}
      <ServiceNav lang={page.lang} alternates={alternates} />
      <main>
        <section className="service-detail-hero">
          <Photo photo={page.hero.img} />
          <div className="wrap service-detail-hero-copy">
            <span className="eyebrow">{page.hero.eyebrow}</span>
            <h1>{page.hero.title}</h1>
            <p>{page.hero.text}</p>
          </div>
        </section>
        <section className="service-detail-content">
          <div className="wrap">
            {page.sections.map((s, i) => (
              <Section key={i} section={s} home={home} />
            ))}
          </div>
        </section>
      </main>
      {/* Comparador antes/despues y cierre de menus. */}
      <Script src="/service-pages.js?v=2" strategy="afterInteractive" />
    </>
  );
}
