import { JsonLd } from "./JsonLd";
import { loadLegacyHome } from "@/lib/legacy";
import type { Lang } from "@/lib/site";

/**
 * Home con el markup y el script.js originales. Los <script> que vienen dentro
 * del HTML los ejecuta el navegador al leer la pagina, como antes.
 */
export function LegacyHome({ lang }: { lang: Lang }) {
  const { body, jsonLd } = loadLegacyHome(lang);
  return (
    <>
      {jsonLd.map((json, i) => (
        <JsonLd key={i} json={json} />
      ))}
      <div id="legacy-root" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
