// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator } from "./i18n";

export function ServicesPage({ lang }: { lang: Lang }) {
  const t = translator(lang);
  return (
    <div className="page" id="page-live">
      <div className="page-bg" id="bg-live">
        <img
          loading="lazy"
          decoding="async"
          src="/images/live-painting/bg_live.jpg"
          alt=""
          data-key="bg_live"
          width={1360}
          height={906}
        />
      </div>
      <button
        className="page-bg-edit-btn"
        data-on-click="editSectionBg('live', this)"
        data-en="🖼 Edit this background"
        data-es="🖼 Editar este fondo"
      >
        {t("🖼 Edit this background", "🖼 Editar este fondo")}
      </button>
      <section className="section" id="live">
        <div className="wrap">
          <span className="eyebrow" data-en="What I Offer" data-es="Lo Que Ofrezco">
            {t("What I Offer", "Lo Que Ofrezco")}
          </span>{" "}
          <h2 className="section-title" style={{ fontSize: "32px" }} data-en="Services" data-es="Servicios">
            {t("Services", "Servicios")}
          </h2>
          <p
            style={{ color: "#d8d8d3", fontSize: "15px", maxWidth: "640px", marginBottom: "44px" }}
            data-en="Three ways to work together: a mural on your wall, a piece painted live in front of your guests, or a hands-on workshop for your team, anywhere in the world."
            data-es="Tres formas de trabajar juntos: un mural en tu pared, una obra pintada en vivo frente a tus invitados, o un taller práctico para tu equipo, en cualquier parte del mundo."
          >
            {t(
              "Three ways to work together: a mural on your wall, a piece painted live in front of your guests, or a hands-on workshop for your team, anywhere in the world.",
              "Tres formas de trabajar juntos: un mural en tu pared, una obra pintada en vivo frente a tus invitados, o un taller práctico para tu equipo, en cualquier parte del mundo.",
            )}
          </p>
          <div className="service-links-grid">
            <a className="service-link-card" href={t("services/murals.html", "es/services/murales.html")}>
              <img
                src="/images/flower_octopus/flower_octopus.jpg"
                alt={t("Flower Octopus mural", "Mural Pulpo Flor")}
                loading="lazy"
                width={1600}
                height={1088}
              />
              <div className="service-link-card-body">
                <span className="eyebrow">{t("Service 01", "Servicio 01")}</span>
                <h3>{t("Murals", "Murales")}</h3>
                <p>
                  {t(
                    "Custom artwork for interiors, businesses, facades and public spaces, designed around each location.",
                    "Obras para interiores, negocios, fachadas y espacios públicos, creadas a medida para cada lugar.",
                  )}
                </p>
                <span className="service-link-arrow">{t("Explore murals →", "Ver murales →")}</span>
              </div>
            </a>{" "}
            <a
              className="service-link-card"
              href={t("services/live-painting.html", "es/services/pintura-en-vivo.html")}
            >
              <img
                src="/images/live-painting/bg_live.jpg"
                alt={t("Cundo Marchi painting live", "Cundo Marchi pintando en vivo")}
                loading="lazy"
                width={1360}
                height={906}
              />
              <div className="service-link-card-body">
                <span className="eyebrow">{t("Service 02", "Servicio 02")}</span>
                <h3>{t("Live Painting", "Pintura en vivo")}</h3>
                <p>
                  {t(
                    "An artwork created in front of the audience for events, galas, openings and brand activations.",
                    "Una obra creada frente al público para eventos, galas, aperturas y activaciones de marca.",
                  )}
                </p>
                <span className="service-link-arrow">{t("Explore live painting →", "Ver pintura en vivo →")}</span>
              </div>
            </a>{" "}
            <a className="service-link-card" href={t("services/workshops.html", "es/services/talleres.html")}>
              <img
                src="/images/live-painting/workshop_tiktok_3.jpg"
                alt={t("Painting workshop at TikTok Live Fest", "Taller de pintura en TikTok Live Fest")}
                loading="lazy"
                width={739}
                height={1600}
              />
              <div className="service-link-card-body">
                <span className="eyebrow">{t("Service 03", "Servicio 03")}</span>
                <h3>{t("Workshops", "Talleres")}</h3>
                <p>
                  {t(
                    "Hands-on painting, graffiti and mural experiences for companies, events and groups.",
                    "Experiencias prácticas de pintura, grafiti y muralismo para empresas, eventos y grupos.",
                  )}
                </p>
                <span className="service-link-arrow">{t("Explore workshops →", "Ver talleres →")}</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
