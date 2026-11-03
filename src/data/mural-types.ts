import type { CSSProperties } from "react";
import type { Lang } from "@/lib/site";

/** Una foto, con las variantes de tamano que existan (srcSet). */
export interface Photo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  srcSet?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  /** Identificador de la foto: algunos ajustes de CSS apuntan a una foto concreta. */
  dataKey?: string;
  className?: string;
  style?: CSSProperties;
}

export interface Figure {
  img: Photo;
  caption: string;
}

/** Antes y despues lado a lado. */
export interface BeforeAfter {
  kind: "ba";
  className: string;
  style?: CSSProperties;
  figures: Figure[];
}

/** Dentro de las filas puede ir una fila de fotos o un antes/despues. */
export type RowItem = { kind: "row"; maxWidth?: number; images: Photo[] } | BeforeAfter;

/** Bloques de la galeria, en el orden en que aparecen debajo del texto. */
export type GalleryBlock =
  /** Antes y despues, lado a lado (plantilla estandar). */
  | BeforeAfter
  /** Filas justificadas: cada foto conserva su proporcion real. */
  | { kind: "rows"; fixed: boolean; rows: RowItem[] }
  /** Antes y despues de la plantilla "detail". */
  | { kind: "detail-ba"; full: boolean; figures: Figure[] }
  /** Grilla de fotos de la plantilla "detail". */
  | { kind: "detail-gallery"; images: Photo[] };

export interface PageLink {
  href: string;
  title: string;
}

export interface MuralPage {
  slug: string;
  lang: Lang;
  /** Dos disenos de pagina: el generado para la mayoria y el "detail" mas nuevo. */
  template: "standard" | "detail";
  seo: {
    title: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogImageAlt?: string;
    ogType?: string;
    jsonLd: Record<string, unknown>[];
  };
  title: string;
  /** Bandera, lugar, ano y medida, tal como se muestran debajo del titulo. */
  meta: string;
  tags?: string[];
  hero: Photo;
  body: string[];
  blocks: GalleryBlock[];
  cta: string;
  backLabel: string;
  languageLink: { href: string; label: string; sentence?: string };
  prev?: PageLink;
  next?: PageLink;
}
