import type { Metadata } from "next";
import { Home } from "@/components/home/Home";
import { JsonLd } from "@/components/JsonLd";
import { homeJsonLd } from "@/data/site-jsonld";

const description =
  "Argentinian muralist and visual artist painting large-scale murals across 5 continents since 2012. Murals, live painting and paint workshops, worldwide.";
const shareDescription =
  "Argentinian muralist painting large-scale murals across 5 continents since 2012. Murals, live painting and paint workshops, worldwide.";

export const metadata: Metadata = {
  title: "Cundo Marchi, Muralist & Visual Artist | Murals Worldwide",
  description,
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "/",
    languages: { en: "/", es: "/es/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "Cundo Marchi",
    title: "Cundo Marchi, Muralist & Visual Artist",
    description: shareDescription,
    url: "/",
    locale: "en_US",
    alternateLocale: "es_AR",
    images: [
      {
        url: "/images/site/og_image.jpg",
        width: 1200,
        height: 630,
        alt: "Large-scale mural of a face with a butterfly, painted by Cundo Marchi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cundo Marchi, Muralist & Visual Artist",
    description: shareDescription,
    images: ["/images/site/og_image.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <Home lang="en" />
    </>
  );
}
