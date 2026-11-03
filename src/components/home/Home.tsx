import type { Lang } from "@/lib/site";
import { SiteHeader } from "./SiteHeader";
import { HomePage } from "./HomePage";
import { BioPage } from "./BioPage";
import { WorkPage } from "./WorkPage";
import { Lightbox } from "./Lightbox";
import { MuralPageOverlay } from "./MuralPageOverlay";
import { ServicesPage } from "./ServicesPage";
import { ShopPage } from "./ShopPage";
import { QuoteSection } from "./QuoteSection";
import { BrandsSection } from "./BrandsSection";
import { SiteFooter } from "./SiteFooter";
import { EditTools } from "./EditTools";
import { HomeRuntime } from "./HomeRuntime";

/**
 * La home es una sola pagina con varias "paginas" internas (inicio, bio,
 * portfolio, servicios, tienda) que script.js muestra y oculta.
 */
export function Home({ lang }: { lang: Lang }) {
  return (
    <>
      <SiteHeader lang={lang} />
      <HomePage lang={lang} />
      <BioPage lang={lang} />
      <WorkPage lang={lang} />
      <Lightbox lang={lang} />
      <MuralPageOverlay lang={lang} />
      <ServicesPage lang={lang} />
      <ShopPage lang={lang} />
      <QuoteSection lang={lang} />
      <BrandsSection lang={lang} />
      <SiteFooter lang={lang} />
      <EditTools lang={lang} />
      <HomeRuntime lang={lang} />
    </>
  );
}
