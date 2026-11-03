// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
import { translator } from "./i18n";

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = translator(lang);
  return (
    <footer>
      <div className="social-icons">
        <a
          href="https://instagram.com/cundomarchi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
          </svg>
        </a>{" "}
        <a
          href="https://facebook.com/cundomarchi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          title="Facebook"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h3.5v-7.5h2.7l.5-3.5h-3.2V7.8c0-1 .3-1.7 1.7-1.7H15V3z"
            />
          </svg>
        </a>{" "}
        <a
          href="https://youtube.com/@cundomarchi"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          title="YouTube"
        >
          <svg viewBox="0 0 24 24" width="22" height="22">
            <rect x="2" y="5.5" width="20" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path fill="currentColor" d="M10 9.5v5l4.5-2.5z" />
          </svg>
        </a>{" "}
        <a href="mailto:cundomarchi@gmail.com" aria-label="Email" title="Email">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <rect x="2" y="4.5" width="20" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M3 6.5l9 7 9-7" />
          </svg>
        </a>
      </div>
      <div
        className="foot-note"
        data-en={"Cundo Marchi, Visual Artist & Urban Artist"}
        data-es="Cundo Marchi, Artista Visual y Urbano"
      >
        {t("Cundo Marchi, Visual Artist & Urban Artist", "Cundo Marchi, Artista Visual y Urbano")}
      </div>
      <div
        className="foot-note"
        style={{ marginTop: "8px" }}
        data-en="© 2026 Cundo Marchi. All Rights Reserved. Images may not be used without authorization."
        data-es="© 2026 Cundo Marchi. Todos los derechos reservados. Prohibido el uso de las imágenes sin autorización."
      >
        {t(
          "© 2026 Cundo Marchi. All Rights Reserved. Images may not be used without authorization.",
          "© 2026 Cundo Marchi. Todos los derechos reservados. Prohibido el uso de las imágenes sin autorización.",
        )}
      </div>
      <div className="foot-legal">
        <a href={t("/privacy.html", "/es/privacy.html")}>{t("Privacy & Cookies", "Privacidad y cookies")}</a>
      </div>
    </footer>
  );
}
