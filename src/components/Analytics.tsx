import Script from "next/script";
import { GA_ID } from "@/lib/site";

/**
 * consent.js arranca Consent Mode v2 (analitica denegada hasta que la persona
 * elija) y despues se carga GA4. El orden importa: primero el consentimiento.
 */
export function Analytics() {
  return (
    <>
      <Script src="/consent.js" strategy="beforeInteractive" />
      <Script id="gtag-init" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
