import type { Metadata } from "next";
import { getMuralPage, muralPath } from "@/data";
import type { Lang } from "./site";

export function muralMetadata(lang: Lang, slug: string): Metadata {
  const page = getMuralPage(lang, slug);
  if (!page) return {};
  const { seo } = page;
  const url = muralPath(lang, slug);
  const languages: Record<string, string> = {};
  if (getMuralPage("en", slug)) languages.en = muralPath("en", slug);
  if (getMuralPage("es", slug)) languages.es = muralPath("es", slug);
  if (languages.en) languages["x-default"] = languages.en;
  const images = seo.ogImage ? [{ url: seo.ogImage, alt: seo.ogImageAlt }] : undefined;

  return {
    title: seo.title,
    description: seo.description,
    robots: "index, follow, max-image-preview:large",
    alternates: { canonical: url, languages },
    openGraph: {
      type: seo.ogType === "website" ? "website" : "article",
      siteName: "Cundo Marchi",
      locale: lang === "es" ? "es_AR" : "en_US",
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}
