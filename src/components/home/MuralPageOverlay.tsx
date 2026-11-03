// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator } from "./i18n";

export function MuralPageOverlay({ lang }: { lang: Lang }) {
  const t = translator(lang);
  return (
    <div className="mural-page-overlay" id="muralPageOverlay" aria-hidden="true">
      <button className="mural-page-close" type="button" data-on-click="closeMuralPageOverlay()">
        ←{" "}
        <span data-en="Back to Portfolio" data-es="Volver al Portfolio">
          {t("Back to Portfolio", "Volver al Portfolio")}
        </span>
      </button>
      <div className="mural-page-languages" aria-label={t("Language", "Idioma")}>
        <button type="button" data-on-click="switchMuralOverlayLanguage('en')">
          🇺🇸 EN
        </button>
        <button type="button" data-on-click="switchMuralOverlayLanguage('es')">
          🇪🇸 ES
        </button>
      </div>
      <div
        className="mural-page-content"
        id="muralPageContent"
        role="dialog"
        aria-modal="true"
        aria-label={t("Mural details", "Detalle del mural")}
      ></div>
    </div>
  );
}
