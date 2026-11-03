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
- `src/app/(en)/services/[slug]`, `src/app/(en)/privacy` (y sus versiones en `/es`): servicios y privacidad.
- `src/data/services.ts`: contenido de las paginas de servicios (tipos en `service-types.ts`).
- `src/data/murals.ts`: textos, fotos y SEO de cada mural en los dos idiomas (tipos en `mural-types.ts`).
- `src/components/`: componentes compartidos (navegacion, analytics, JSON-LD, galeria de murales).
- `src/components/home/`: la home (inicio, bio, portfolio, servicios, tienda, formulario) como componentes bilingues. El comportamiento (lightbox, carrusel, formulario, idioma, modo edicion) sigue en `public/script.js`, que `HomeRuntime` carga despues de que React monta la pagina.
- `public/`: imagenes, fuentes, CSS y los scripts del sitio original (`script.js`, `consent.js`, `service-pages.js`).
- `scripts/optimize-media.py`: deja livianas las fotos y videos nuevos (ver `COMO-USAR.md`).
- `tools/migrate/`: scripts que se usaron una vez para migrar el sitio HTML.

Las URLs publicadas (`/mural/<slug>.html`, `/services/*.html`) se conservan para no perder posicionamiento.
