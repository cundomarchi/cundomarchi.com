# cundomarchi.com

Sitio de Cundo Marchi en **Next.js 16 + TypeScript**, publicado en Vercel.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produccion
npm run typecheck
```

## Estructura

- `src/app/(en)` y `src/app/(es)/es`: rutas en ingles y espanol (cada una con su `<html lang>`).
- `src/app/global-not-found.tsx`: pagina 404.
- `src/app/(en)/mural/[slug]` y `src/app/(es)/es/mural/[slug]`: paginas de cada mural (SSG).
- `src/data/murals.ts`: textos, fotos y SEO de cada mural en los dos idiomas (tipos en `mural-types.ts`).
- `src/components/`: componentes compartidos (navegacion, analytics, JSON-LD, galeria de murales).
- `src/legacy/index.{en,es}.html`: markup de la home, todavia servido tal cual junto con `public/script.js`.
- `public/`: imagenes, fuentes, CSS y las paginas estaticas que aun no se migraron (servicios, privacidad).
- `tools/`: scripts de Python del sitio anterior (optimizar fotos, encuadres).

Las URLs publicadas (`/mural/<slug>.html`, `/services/*.html`) se conservan para no perder posicionamiento.
