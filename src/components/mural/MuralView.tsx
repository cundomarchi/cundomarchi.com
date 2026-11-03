import type { MuralPage } from "@/data/mural-types";
import { getMuralPage, muralPath } from "@/data";
import { SiteNav } from "../SiteNav";
import { JsonLd } from "../JsonLd";
import { Photo } from "./Photo";
import { Gallery } from "./Gallery";
import { SITE_URL } from "@/lib/site";
import "./mural.css";

/**
 * Las paginas "detail" no traian JSON-LD en el HTML (lo agregaba mural-seo.js
 * en el navegador). Aca se arma en el servidor, asi Google lo ve siempre.
 */
function detailJsonLd(page: MuralPage) {
  const url = SITE_URL + muralPath(page.lang, page.slug);
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: page.title,
    artform: "Mural",
    inLanguage: page.lang,
    description: page.seo.description,
    image: page.seo.ogImage,
    url,
    mainEntityOfPage: url,
    copyrightHolder: { "@id": `${SITE_URL}/#person` },
    creator: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Cundo Marchi", url: `${SITE_URL}/` },
  };
}

/** "Leer esta pagina en <a>ingles</a>.": la frase con el enlace adentro. */
function LanguageLink({ link }: { link: MuralPage["languageLink"] }) {
  const sentence = link.sentence ?? link.label;
  const at = sentence.indexOf(link.label);
  return (
    <>
      {sentence.slice(0, at)}
      <a href={link.href}>{link.label}</a>
      {sentence.slice(at + link.label.length)}
    </>
  );
}

export function MuralView({ page }: { page: MuralPage }) {
  const home = page.lang === "es" ? "/es/" : "/";
  const other = page.lang === "es" ? "en" : "es";
  const alternate = getMuralPage(other, page.slug) ? muralPath(other, page.slug) : other === "es" ? "/es/" : "/";
  const alternates = page.lang === "es" ? { en: alternate, es: muralPath("es", page.slug) } : { en: muralPath("en", page.slug), es: alternate };
  const jsonLd = page.seo.jsonLd.length ? page.seo.jsonLd : [detailJsonLd(page)];

  return (
    <>
      {jsonLd.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      {/* Las paginas "detail" no tenian barra de navegacion: se respeta. */}
      {page.template === "standard" && <SiteNav lang={page.lang} alternates={alternates} />}
      {page.template === "detail" ? (
        <main className="wrap mural-detail">
          <a className="back-link" href={`${home}#work`}>
            ‹ {page.backLabel}
          </a>
          <span className="eyebrow" style={{ marginTop: 24 }}>
            Mural
          </span>
          <h1>{page.title}</h1>
          <p className="detail-meta">{page.meta}</p>
          <Photo photo={page.hero} />
          {page.body.map((p, i) => (
            <p key={i} className="detail-copy">
              {p}
            </p>
          ))}
          <Gallery blocks={page.blocks} />
          <div className="detail-actions">
            <a href={`${home}#quote`} className="btn-primary">
              {page.cta}
            </a>
            <p className="detail-language">
              <LanguageLink link={page.languageLink} />
            </p>
          </div>
        </main>
      ) : (
        <main className="wrap" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <a
            href={`${home}#work`}
            style={{ color: "var(--gray)", fontFamily: "var(--mono)", fontSize: 13, textDecoration: "none" }}
          >
            ‹ {page.backLabel}
          </a>
          <span className="eyebrow" style={{ marginTop: 24 }}>
            Mural
          </span>
          <h1 className="m-title">{page.title}</h1>
          <p className="m-meta">{page.meta}</p>
          <div className="pills" style={{ marginTop: 14 }}>
            {page.tags?.map((t) => (
              <span key={t} className="pill tag-outline">
                {t}
              </span>
            ))}
          </div>

          <Photo photo={page.hero} style={{ marginTop: 28 }} />

          <div className="m-body" style={{ marginTop: 32 }}>
            {page.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <Gallery blocks={page.blocks} />

          <div style={{ marginTop: 44 }}>
            <a href={`${home}#quote`} className="btn-primary">
              {page.cta}
            </a>
          </div>

          <p className="m-idioma">
            <LanguageLink link={page.languageLink} />
          </p>

          {page.prev && page.next && (
            <div className="m-nav">
              <a href={page.prev.href}>‹ {page.prev.title}</a>
              <a href={page.next.href}>{page.next.title} ›</a>
            </div>
          )}
        </main>
      )}
    </>
  );
}
