import type { Metadata } from "next";
import { getServicePage, servicePath } from "@/data";
import type { Lang } from "./site";

export function serviceMetadata(lang: Lang, slug: string): Metadata {
  const page = getServicePage(lang, slug);
  if (!page) return {};
  const { seo } = page;
  const en = lang === "en" ? slug : page.alternateSlug;
  const es = lang === "es" ? slug : page.alternateSlug;
  return {
    title: seo.title,
    description: seo.description,
    robots: "index, follow, max-image-preview:large",
    alternates: {
      canonical: servicePath(lang, slug),
      languages: { en: servicePath("en", en), es: servicePath("es", es), "x-default": servicePath("en", en) },
    },
    openGraph: {
      type: "website",
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: servicePath(lang, slug),
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}
