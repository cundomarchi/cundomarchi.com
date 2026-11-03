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
    ];
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
