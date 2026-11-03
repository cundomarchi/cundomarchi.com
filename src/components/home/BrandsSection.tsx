// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator } from "./i18n";

export function BrandsSection({ lang }: { lang: Lang }) {
  const t = translator(lang);
  return (
    <section className="section brands">
      <div className="wrap">
        <span
          className="eyebrow"
          style={{ textAlign: "center", display: "block" }}
          data-en="Brands I've Worked With"
          data-es="Marcas con las que Trabajé"
        >
          {t("Brands I've Worked With", "Marcas con las que Trabajé")}
        </span>{" "}
        <div className="brands-row">
          <span className="brand-logo">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/fume_vapes.png"
              alt="Fume Vapes"
              width={240}
              height={240}
            />
          </span>{" "}
          <span className="brand-logo">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/tigre_municipio.png"
              alt="Tigre Municipio"
              width={293}
              height={125}
            />
          </span>{" "}
          <span className="brand-logo">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/chiquita_banana.png"
              alt="Chiquita Banana"
              width={198}
              height={240}
            />
          </span>{" "}
          <span className="brand-logo">
            <img loading="lazy" decoding="async" src="/images/site/tiktok.png" alt="TikTok" width={423} height={143} />
          </span>{" "}
          <span className="brand-logo">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/municipio_de_san_fernando.png"
              alt="Municipio de San Fernando"
              width={411}
              height={240}
            />
          </span>{" "}
          <span className="brand-logo">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/inac_hospitality.png"
              alt="INAC Hospitality"
              width={240}
              height={240}
            />
          </span>{" "}
          <span className="brand-logo">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/meeting_of_styles_sweden.png"
              alt="Meeting of Styles Sweden"
              width={360}
              height={240}
            />
          </span>{" "}
          <span className="brand-logo">
            <img loading="lazy" decoding="async" src="/images/site/farola.png" alt="Farola" width={448} height={240} />
          </span>{" "}
          <span className="brand-logo">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/hotel_sayab.png"
              alt="Hotel Sayab"
              width={395}
              height={238}
            />
          </span>{" "}
          <span className="brand-logo">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/norths_devils.png"
              alt="Norths Devils"
              width={267}
              height={228}
            />
          </span>{" "}
          <span className="brand-logo">
            <img
              loading="lazy"
              decoding="async"
              src="/images/site/sleep_in_heaven.png"
              alt="Sleep in Heaven"
              width={768}
              height={686}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
