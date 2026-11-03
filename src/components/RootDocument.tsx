import type { ReactNode } from "react";
import { Analytics } from "./Analytics";
import type { Lang } from "@/lib/site";

/**
 * Hay dos root layouts (ingles y espanol) para que <html lang> sea correcto
 * desde el servidor. Los dos comparten este documento.
 */
export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        {/* Las rutas relativas del HTML original (images/..., mural/...) se
            resuelven desde la raiz, igual que con el <base> del sitio viejo. */}
        <base href="/" />
        <link rel="stylesheet" href="/style.css?v=169" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
