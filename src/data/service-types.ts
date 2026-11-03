import type { Lang } from "@/lib/site";
import type { Photo } from "./mural-types";

export type QuoteRequest = "mural" | "live" | "workshop";

/** Secciones de una pagina de servicio, en el orden en que se muestran. */
export type ServiceSection =
  | { kind: "eyebrow"; text: string }
  | { kind: "categories"; items: { title: string; text: string }[] }
  /** Antes y despues: al tocarlos se abre el comparador deslizable (service-pages.js). */
  | {
      kind: "comparisons";
      items: { title: string; beforeLabel: string; afterLabel: string; before: Photo; after: Photo; caption: string }[];
    }
  | { kind: "live-event"; title: string; meta: string; figures: { img: Photo; caption?: string }[] }
  | { kind: "workshop-gallery"; label: string; images: Photo[] }
  | { kind: "cta"; eyebrow?: string; text: string; label: string; request: QuoteRequest };

export interface ServicePage {
  slug: string;
  lang: Lang;
  /** Slug de la misma pagina en el otro idioma. */
  alternateSlug: string;
  seo: {
    title: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    jsonLd: Record<string, unknown>[];
  };
  hero: { img: Photo; eyebrow: string; title: string; text: string };
  sections: ServiceSection[];
}
