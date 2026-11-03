// Migracion unica: paginas de servicios publicadas -> src/data/services.ts
// Uso: node tools/migrate/extract-services.mjs [carpeta-con-las-paginas]
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const SRC = process.argv[2] || path.join(ROOT, "public");
const PAGES = [
  ["en", "murals", "murales", "mural"],
  ["en", "live-painting", "pintura-en-vivo", "live"],
  ["en", "workshops", "talleres", "workshop"],
  ["es", "murales", "murals", "mural"],
  ["es", "pintura-en-vivo", "live-painting", "live"],
  ["es", "talleres", "workshops", "workshop"],
];

const abs = (u) => (u ? "/" + u.replace(/^(\.\.\/)+/, "") : u);
const text = (el) => el?.text.replace(/\s+/g, " ").trim() ?? "";
const meta = (doc, sel) => doc.querySelector(sel)?.getAttribute("content");
function img(el) {
  const a = el.attributes;
  const o = { src: abs(a.src), alt: a.alt ?? "" };
  if (a.width) o.width = Number(a.width);
  if (a.height) o.height = Number(a.height);
  if (a.loading) o.loading = a.loading;
  if (a.fetchpriority) o.fetchPriority = a.fetchpriority;
  if (a.class) o.className = a.class;
  return o;
}

const out = [];
for (const [lang, slug, altSlug, request] of PAGES) {
  const file = path.join(SRC, lang === "es" ? "es/services" : "services", slug + ".html");
  const doc = parse(readFileSync(file, "utf8"));
  const hero = doc.querySelector(".service-detail-hero");
  const content = doc.querySelector(".service-detail-content .wrap");
  const sections = [];
  for (const el of content.childNodes) {
    if (el.nodeType !== 1) continue;
    const c = el.classList;
    if (c.contains("mural-categories-grid"))
      sections.push({ kind: "categories", items: el.querySelectorAll(".mural-card-intro").map((i) => ({ title: text(i.querySelector("h4")), text: text(i.querySelector("p")) })) });
    else if (c.contains("eyebrow")) sections.push({ kind: "eyebrow", text: text(el) });
    else if (c.contains("service-comparisons"))
      sections.push({
        kind: "comparisons",
        items: el.querySelectorAll(".service-compare-preview").map((b) => {
          const imgs = b.querySelectorAll("img");
          return {
            title: b.getAttribute("data-title"),
            beforeLabel: b.getAttribute("data-before-label"),
            afterLabel: b.getAttribute("data-after-label"),
            before: img(imgs[0]),
            after: img(imgs[1]),
            caption: text(b.querySelector(".mcp-caption")),
          };
        }),
      });
    else if (c.contains("live-event"))
      sections.push({
        kind: "live-event",
        title: text(el.querySelector("h3")),
        meta: text(el.querySelector(".live-event-meta")),
        figures: el.querySelectorAll("figure").map((f) => {
          const cap = f.querySelector("figcaption");
          return cap ? { img: img(f.querySelector("img")), caption: text(cap) } : { img: img(f.querySelector("img")) };
        }),
      });
    else if (c.contains("workshop-gallery"))
      sections.push({ kind: "workshop-gallery", label: text(el.querySelector(".step-label")), images: el.querySelectorAll("img").map(img) });
    else if (c.contains("service-page-cta")) {
      const eb = el.querySelector(".eyebrow");
      sections.push({ kind: "cta", eyebrow: eb ? text(eb) : undefined, text: text(el.querySelector("p")), label: text(el.querySelector(".btn-primary")), request });
    } else throw new Error(`${file}: seccion desconocida ${el.getAttribute("class")}`);
  }
  out.push({
    slug,
    lang,
    alternateSlug: altSlug,
    seo: {
      title: text(doc.querySelector("title")),
      description: meta(doc, 'meta[name="description"]'),
      ogTitle: meta(doc, 'meta[property="og:title"]'),
      ogDescription: meta(doc, 'meta[property="og:description"]'),
      ogImage: meta(doc, 'meta[property="og:image"]'),
      jsonLd: doc.querySelectorAll('script[type="application/ld+json"]').map((s) => JSON.parse(s.text)),
    },
    hero: {
      img: img(hero.querySelector("img")),
      eyebrow: text(hero.querySelector(".eyebrow")),
      title: text(hero.querySelector("h1")),
      text: text(hero.querySelector(".service-detail-hero-copy p")),
    },
    sections,
  });
}

writeFileSync(
  path.join(ROOT, "src/data/services.ts"),
  `// Paginas de servicios, en ingles y espanol.
// Generado una sola vez desde las paginas HTML del sitio anterior; de ahora en
// adelante se edita a mano.
import type { ServicePage } from "./service-types";

export const servicePages: ServicePage[] = ${JSON.stringify(out, null, 2)};
`,
);
console.log(out.length, "service pages");
