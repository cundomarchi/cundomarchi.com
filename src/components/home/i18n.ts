import type { Lang } from "@/lib/site";

/** t("Home", "Inicio"): el texto segun el idioma de la pagina. */
export function translator(lang: Lang) {
  return <T>(en: T, es: T): T => (lang === "es" ? es : en);
}

/**
 * La home en espanol vive en /es/: sus enlaces internos llevan ese prefijo.
 * l("mural/tlaloc.html") -> "es/mural/tlaloc.html" (rutas relativas a <base href="/">).
 */
export function localizer(lang: Lang) {
  return (href: string) => (lang === "es" ? `es/${href}` : href);
}
