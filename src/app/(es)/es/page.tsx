import type { Metadata } from "next";
import { LegacyHome } from "@/components/LegacyHome";

const title = "Cundo Marchi, Muralista y Artista Visual";
const description =
  "Muralista y artista visual argentino, pintando murales de gran escala en 5 continentes desde 2012. Murales, pintura en vivo y talleres, en todo el mundo.";

export const metadata: Metadata = {
  title: `${title} | Murales por Encargo`,
  description,
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "/es/",
    languages: { en: "/", es: "/es/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "Cundo Marchi",
    title,
    description,
    url: "/es/",
    locale: "es_AR",
    alternateLocale: "en_US",
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
    title,
    description,
    images: ["/images/site/og_image.jpg"],
  },
};

export default function HomePageEs() {
  return <LegacyHome lang="es" />;
}
