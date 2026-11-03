import type { Lang } from "@/lib/site";
import { muralPages } from "./murals";
import type { MuralPage } from "./mural-types";

export function getMuralPages(lang: Lang): MuralPage[] {
  return muralPages.filter((p) => p.lang === lang);
}

export function getMuralPage(lang: Lang, slug: string): MuralPage | undefined {
  return muralPages.find((p) => p.lang === lang && p.slug === slug);
}

/** URL publica de un mural (se conservan las direcciones .html ya indexadas). */
export function muralPath(lang: Lang, slug: string): string {
  return `${lang === "es" ? "/es" : ""}/mural/${slug}.html`;
}

import { servicePages } from "./services";
import type { ServicePage } from "./service-types";

export function getServicePages(lang: Lang): ServicePage[] {
  return servicePages.filter((p) => p.lang === lang);
}

export function getServicePage(lang: Lang, slug: string): ServicePage | undefined {
  return servicePages.find((p) => p.lang === lang && p.slug === slug);
}

export function servicePath(lang: Lang, slug: string): string {
  return `${lang === "es" ? "/es" : ""}/services/${slug}.html`;
}
