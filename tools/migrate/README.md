# Migracion a Next.js (scripts de una sola vez)

Estos scripts convirtieron el sitio HTML anterior en datos y componentes de
TypeScript. Ya se ejecutaron: los archivos que leian (las paginas `.html`
originales) estan en el historial de git. No hace falta volver a correrlos;
el contenido se edita directamente en `src/data/` y `src/components/`.

- `extract-murals.mjs` -> `src/data/murals.ts`
- `extract-services.mjs` -> `src/data/services.ts`
- `home-to-tsx.mjs` -> `src/components/home/*.tsx` y `src/data/world-map.ts`
