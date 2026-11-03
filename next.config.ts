import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // La home en espanol vive en /es/ (con barra): asi esta indexada.
  trailingSlash: true,
  // Las URLs publicadas e indexadas terminan en .html. Se conservan tal cual
  // para no perder posicionamiento en Google.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/es/index.html", destination: "/es/", permanent: true },
      // Murales que cambiaron de nombre: la direccion vieja sigue funcionando.
      { source: "/mural/zeus.html", destination: "/mural/hercules.html", permanent: true },
      { source: "/mural/bear-with-shades.html", destination: "/mural/california-bear.html", permanent: true },
      // La version sin .html de un mural lleva a la publicada.
      { source: "/mural/:slug([^.]+)/", destination: "/mural/:slug.html", permanent: true },
      { source: "/es/mural/:slug([^.]+)/", destination: "/es/mural/:slug.html", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/mural/:slug.html", destination: "/mural/:slug" },
        { source: "/es/mural/:slug.html", destination: "/es/mural/:slug" },
      ],
    };
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
