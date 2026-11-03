"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/site";
import { SiteNav } from "./SiteNav";

const COPY = {
  en: {
    title: "This wall is still blank",
    text: "The page you were looking for is not here. It may have moved, or the link was mistyped.",
    home: "Go to the site",
    work: "See the murals",
    doc: "Page not found | Cundo Marchi",
  },
  es: {
    title: "Esta pared todavía está en blanco",
    text: "La página que buscabas no está acá. Puede que se haya movido, o que el link esté mal escrito.",
    home: "Ir al sitio",
    work: "Ver los murales",
    doc: "Página no encontrada | Cundo Marchi",
  },
} as const;

/** En espanol si el visitante navega en espanol o venia de /es/. */
export function NotFoundContent() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const es = navigator.language.toLowerCase().startsWith("es") || location.pathname.startsWith("/es/");
    if (!es) return;
    setLang("es");
    document.documentElement.lang = "es";
    document.title = COPY.es.doc;
  }, []);

  const t = COPY[lang];
  const home = lang === "es" ? "/es/" : "/";
  return (
    <>
      <SiteNav lang={lang} alternates={{ en: "/", es: "/es/" }} />
      <main className="nf-wrap">
        <p className="nf-code">404</p>
        <h1 className="nf-title">{t.title}</h1>
        <p className="nf-text">{t.text}</p>
        <div className="nf-links">
          <a href={home} className="btn-primary">
            {t.home}
          </a>
          <a href={`${home}#work`} className="nf-ghost">
            {t.work}
          </a>
        </div>
      </main>
    </>
  );
}
