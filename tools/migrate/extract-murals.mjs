// Migracion unica: lee las paginas de mural publicadas (public/mural y
// public/es/mural) y genera src/data/murals.ts con los mismos datos.
// Uso: node tools/migrate/extract-murals.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
// carpeta con las paginas originales (por defecto public/)
const SRC = process.argv[2] || path.join(ROOT, "public");
const REDIRECTS = new Set(["zeus", "bear-with-shades"]);

// rutas relativas al <base href="../"> del sitio viejo -> absolutas
const abs = (u) => {
  if (!u || /^(https?:|mailto:|#|\/)/.test(u)) return u;
  return "/" + u.replace(/^index\.html/, "").replace(/^es\/index\.html/, "es/");
};
const absSrcSet = (s) => s && s.split(",").map((p) => { const [u, w] = p.trim().split(/\s+/); return `${abs(u)} ${w}`; }).join(", ");

function styleObj(s) {
  if (!s) return undefined;
  const o = {};
  for (const decl of s.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const k = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    o[k] = decl.slice(i + 1).trim();
  }
  return o;
}

function img(el) {
  const a = el.attributes;
  const out = { src: abs(a.src), alt: a.alt ?? "" };
  if (a.width) out.width = Number(a.width);
  if (a.height) out.height = Number(a.height);
  if (a.srcset) out.srcSet = absSrcSet(a.srcset);
  if (a.sizes) out.sizes = a.sizes;
  if (a.loading) out.loading = a.loading;
  if (a.fetchpriority) out.fetchPriority = a.fetchpriority;
  if (a["data-key"]) out.dataKey = a["data-key"];
  if (a.class) out.className = a.class;
  if (a.style) out.style = styleObj(a.style);
  return out;
}

const text = (el) => el?.text.replace(/\s+/g, " ").trim() ?? "";
const meta = (doc, sel) => doc.querySelector(sel)?.getAttribute("content");

function figures(el) {
  return el.querySelectorAll("figure").map((f) => ({ img: img(f.querySelector("img")), caption: text(f.querySelector("figcaption")) }));
}

function parsePage(file, lang, slug) {
  const doc = parse(readFileSync(file, "utf8"));
  const main = doc.querySelector("main");
  const detail = main.classList.contains("mural-detail");
  const seo = {
    title: text(doc.querySelector("title")),
    description: meta(doc, 'meta[name="description"]'),
    ogTitle: meta(doc, 'meta[property="og:title"]'),
    ogDescription: meta(doc, 'meta[property="og:description"]'),
    ogImage: meta(doc, 'meta[property="og:image"]'),
    ogImageAlt: meta(doc, 'meta[property="og:image:alt"]'),
    ogType: meta(doc, 'meta[property="og:type"]'),
    jsonLd: doc.querySelectorAll('script[type="application/ld+json"]').map((s) => JSON.parse(s.text)),
  };
  for (const k of Object.keys(seo)) if (seo[k] === undefined) delete seo[k];

  const page = { slug, lang, template: detail ? "detail" : "standard", seo, title: text(main.querySelector("h1")) };
  const blocks = [];

  if (detail) {
    page.meta = text(main.querySelector(".detail-meta"));
    page.hero = img(main.querySelector(".detail-hero"));
    page.body = main.querySelectorAll(".detail-copy").map(text);
    for (const el of main.childNodes) {
      if (el.nodeType !== 1) continue;
      if (el.classList.contains("detail-ba")) blocks.push({ kind: "detail-ba", full: el.classList.contains("detail-ba--full"), figures: figures(el) });
      if (el.classList.contains("detail-gallery")) blocks.push({ kind: "detail-gallery", images: el.querySelectorAll("img").map(img) });
    }
    page.cta = text(main.querySelector(".detail-actions .btn-primary"));
    const lp = main.querySelector(".detail-language");
    const l = lp.querySelector("a");
    page.languageLink = { href: abs(l.getAttribute("href")), label: text(l), sentence: text(lp) };
  } else {
    page.meta = text(main.querySelector(".m-meta"));
    page.tags = main.querySelectorAll(".pills .pill").map(text);
    page.hero = img(main.querySelector(".m-hero"));
    page.body = main.querySelectorAll(".m-body p").map(text);
    for (const el of main.childNodes) {
      if (el.nodeType !== 1) continue;
      if (el.classList.contains("m-ba")) blocks.push({ kind: "ba", className: el.getAttribute("class"), figures: figures(el) });
      if (el.classList.contains("m-rows"))
        blocks.push({
          kind: "rows",
          fixed: el.classList.contains("m-rows--fixed"),
          rows: el.childNodes.filter((r) => r.nodeType === 1).map((r) =>
            r.classList.contains("m-ba")
              ? { kind: "ba", className: r.getAttribute("class"), style: styleObj(r.getAttribute("style")), figures: figures(r) }
              : {
                  kind: "row",
                  maxWidth: Number((r.getAttribute("style") || "").match(/max-width:(\d+)px/)?.[1]) || undefined,
                  images: r.querySelectorAll("img").map(img),
                },
          ),
        });
    }
    page.cta = text(main.querySelector(".btn-primary"));
    const idioma = main.querySelector(".m-idioma");
    const l = idioma.querySelector("a");
    page.languageLink = { href: abs(l.getAttribute("href")), label: text(l), sentence: text(idioma) };
    const [prev, next] = main.querySelectorAll(".m-nav a");
    page.prev = { href: abs(prev.getAttribute("href")), title: text(prev).replace(/^‹\s*/, "") };
    page.next = { href: abs(next.getAttribute("href")), title: text(next).replace(/\s*›$/, "") };
  }
  page.backLabel = text(main.querySelector("a")).replace(/^‹\s*/, "");
  page.blocks = blocks;
  return page;
}

const pages = [];
for (const [lang, dir] of [["en", "mural"], ["es", "es/mural"]]) {
  for (const f of readdirSync(path.join(SRC, dir)).sort()) {
    const slug = f.replace(/\.html$/, "");
    if (REDIRECTS.has(slug)) continue;
    pages.push(parsePage(path.join(SRC, dir, f), lang, slug));
  }
}

const out = `// Datos de las paginas de cada mural, en ingles y espanol.
// Generado una sola vez desde las paginas HTML del sitio anterior; de ahora en
// adelante se edita a mano.
import type { MuralPage } from "./mural-types";

export const muralPages: MuralPage[] = ${JSON.stringify(pages, null, 2)};
`;
writeFileSync(path.join(ROOT, "src/data/murals.ts"), out);
console.log(pages.length, "pages;", pages.filter((p) => p.template === "detail").length, "detail");
