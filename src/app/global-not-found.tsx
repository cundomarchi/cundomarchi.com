import type { Metadata } from "next";
import "./not-found.css";
import { NotFoundContent } from "@/components/NotFoundContent";
import { Analytics } from "@/components/Analytics";

export const metadata: Metadata = {
  title: "Page not found | Cundo Marchi",
  robots: "noindex, follow",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/style.css?v=169" />
      </head>
      <body>
        <NotFoundContent />
        <Analytics />
      </body>
    </html>
  );
}
