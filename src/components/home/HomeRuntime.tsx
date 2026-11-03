"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/site";

declare global {
  interface Window {
    __forceLang?: Lang;
    __cmzHomeStarted?: boolean;
  }
}

/** Version de los scripts, para que el navegador no use una copia vieja. */
const SCRIPTS = ["/translations.js?v=1", "/script.js?v=140"];

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.body.appendChild(s);
  });
}

/**
 * script.js maneja todo el comportamiento de la home (paginas, lightbox,
 * carrusel, formulario, idioma, modo edicion). Se carga recien cuando React
 * termino de montar la pagina: si corriera antes, cambiaria el HTML que React
 * espera encontrar.
 *
 * Los componentes marcan los manejadores como data-on-click="showPage('bio')"
 * (React no acepta onclick como texto); aca se convierten en los atributos
 * onclick de siempre, que llaman a las funciones globales de script.js.
 */
export function HomeRuntime({ lang }: { lang: Lang }) {
  useEffect(() => {
    if (window.__cmzHomeStarted) return;
    window.__cmzHomeStarted = true;

    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.startsWith("data-on-")) el.setAttribute("on" + attr.name.slice(8), attr.value);
      }
    }
    // como en el sitio original: sin menu contextual (protege las fotos)
    document.body.oncontextmenu = () => false;
    if (lang === "es") window.__forceLang = "es";

    // script.js espera DOMContentLoaded y load, que ya pasaron: se ejecutan enseguida.
    const addDoc = document.addEventListener.bind(document);
    const addWin = window.addEventListener.bind(window);
    document.addEventListener = ((
      type: string,
      fn: EventListenerOrEventListenerObject,
      opts?: boolean | AddEventListenerOptions,
    ) => {
      if (type === "DOMContentLoaded")
        return void setTimeout(() =>
          typeof fn === "function" ? fn(new Event(type)) : fn.handleEvent(new Event(type)),
        );
      return addDoc(type, fn, opts);
    }) as typeof document.addEventListener;
    window.addEventListener = ((
      type: string,
      fn: EventListenerOrEventListenerObject,
      opts?: boolean | AddEventListenerOptions,
    ) => {
      if (type === "load" && document.readyState === "complete")
        return void setTimeout(() =>
          typeof fn === "function" ? fn(new Event(type)) : fn.handleEvent(new Event(type)),
        );
      return addWin(type, fn, opts);
    }) as typeof window.addEventListener;

    const restore = () => {
      document.addEventListener = addDoc;
      window.addEventListener = addWin;
    };
    SCRIPTS.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve())
      .catch((e) => console.error(e))
      .finally(restore);
  }, [lang]);

  return null;
}
