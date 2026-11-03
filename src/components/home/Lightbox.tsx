// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator } from "./i18n";

export function Lightbox({ lang }: { lang: Lang }) {
  const t = translator(lang);
  return (
    <div className="lightbox-overlay" id="lightbox">
      <div className="lightbox-box">
        <button className="lightbox-back" data-on-click="closeLightbox()">
          ←{" "}
          <span data-en="Back to Portfolio" data-es="Volver al Portfolio">
            {t("Back to Portfolio", "Volver al Portfolio")}
          </span>
        </button>
        <button className="lightbox-nav left" data-on-click="lightboxLeft()">
          ‹
        </button>
        <button className="lightbox-nav right" data-on-click="lightboxRight()">
          ›
        </button>
        <div id="lightbox-media"></div>
        <div className="lb-thumbs" id="lb-thumbs"></div>
        <div className="lightbox-body">
          <div className="pills" id="lb-pills"></div>
          <h3 id="lb-title"></h3>
          <p className="meta" id="lb-meta"></p>{" "}
          <span
            className="eyebrow"
            id="lb-story-label"
            style={{ marginTop: "24px" }}
            data-en="The Story"
            data-es="La Historia"
          >
            {t("The Story", "La Historia")}
          </span>{" "}
          <p className="desc" id="lb-desc"></p>{" "}
          <a
            className="lb-full-link"
            id="lb-full-link"
            href="#"
            data-en="See the full mural page →"
            data-es="Ver la ficha completa del mural →"
          >
            {t("See the full mural page →", "Ver la ficha completa del mural →")}
          </a>
        </div>
      </div>
    </div>
  );
}
