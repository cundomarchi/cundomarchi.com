// Migracion unica: convierte el cuerpo de src/legacy/index.{en,es}.html en
// componentes TSX bilingues (src/components/home/*). Recorre las dos versiones
// a la vez: donde el texto o un atributo cambia, genera t("en", "es").
// Uso: node tools/migrate/home-to-tsx.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const OUT = path.join(ROOT, "src/components/home");
mkdirSync(OUT, { recursive: true });

const load = (f) => parse(readFileSync(path.join(ROOT, "src/legacy", f), "utf8"), { comment: true }).querySelector("body");
const EN = load("index.en.html");
const ES = load("index.es.html");
const bodyKids = (b) => b.childNodes.filter((c) => c.nodeType === 1 && c.tagName !== "SCRIPT");

const decode = (s) => parse(`<i>${s}</i>`).querySelector("i").text;

const ATTR = {
  class: "className", for: "htmlFor", srcset: "srcSet", fetchpriority: "fetchPriority", tabindex: "tabIndex",
  readonly: "readOnly", maxlength: "maxLength", minlength: "minLength", autocomplete: "autoComplete",
  autoplay: "autoPlay", playsinline: "playsInline", crossorigin: "crossOrigin", enctype: "encType",
  "accept-charset": "acceptCharset", contenteditable: "contentEditable", spellcheck: "spellCheck",
  colspan: "colSpan", rowspan: "rowSpan", allowfullscreen: "allowFullScreen", referrerpolicy: "referrerPolicy",
  inputmode: "inputMode", novalidate: "noValidate", datetime: "dateTime", hreflang: "hrefLang", viewbox: "viewBox",
};
const BOOL = new Set(["disabled", "required", "hidden", "multiple", "checked", "selected", "readonly", "novalidate", "autoplay", "muted", "loop", "playsinline", "allowfullscreen", "open"]);
const NUM = new Set(["tabindex", "maxlength", "minlength", "rows", "cols", "colspan", "rowspan"]);
const VOID = new Set(["img", "input", "br", "hr", "meta", "link", "source", "area", "col", "embed", "track", "wbr"]);
const BLOCK = new Set(["div", "section", "nav", "footer", "header", "main", "article", "aside", "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "form", "figure", "figcaption", "table", "tr", "td", "th", "thead", "tbody", "select", "option", "label", "svg", "g", "path", "rect", "circle", "button", "textarea", "input", "img"]);
const DROP_WS_IN = new Set(["ul", "ol", "select", "svg", "g", "table", "tr", "thead", "tbody"]);

const q = (s) => JSON.stringify(s);
const t = (en, es) => (en === es ? q(en) : `t(${q(en)}, ${q(es)})`);

/** Optimiza hrefs: "mural/x.html" -> "es/mural/x.html" se escribe como l("mural/x.html"). */
function attrExpr(name, en, es) {
  if (es === undefined || en === es) return null;
  if (name === "href" && es === "es/" + en) return `l(${q(en)})`;
  return t(en, es);
}

function styleExpr(s) {
  const o = {};
  for (const decl of s.split(";")) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    let k = decl.slice(0, i).trim();
    const v = decl.slice(i + 1).trim();
    if (!k) continue;
    if (!k.startsWith("--")) k = k.replace(/^-ms-/, "ms-").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    o[k] = v;
  }
  const parts = Object.entries(o).map(([k, v]) => `${/^[a-zA-Z]+$/.test(k) ? k : q(k)}: ${q(v)}`);
  return `{{ ${parts.join(", ")} }}`;
}

function attrs(x, y, inSvg, extra = {}) {
  const out = [];
  const ea = x.attributes, sa = y?.attributes ?? ea;
  for (const [k0, v] of Object.entries(ea)) {
    const k = k0.toLowerCase();
    // rutas de imagen absolutas: React precarga algunas fotos en el <head>,
    // antes del <base>, y en /es/ una ruta relativa apuntaria a /es/images/...
    const fix = (val) => (val !== undefined && ["src", "srcset", "data-src", "poster"].includes(k) ? val.replace(/(^|,\s*)images\//g, "$1/images/") : val);
    const ve = fix(v), vs = fix(sa[k0]);
    if (k.startsWith("on")) {
      // los manejadores en linea los activa HomeRuntime (ver ahi por que)
      out.push(`data-on-${k.slice(2)}=${braceOrStr(ve, vs)}`);
      continue;
    }
    if (k === "style") {
      if (vs !== undefined && vs !== ve) out.push(`style={lang === "es" ? ${styleExpr(vs).slice(1, -1)} : ${styleExpr(ve).slice(1, -1)}}`);
      else out.push(`style=${styleExpr(ve)}`);
      continue;
    }
    if (extra.skip?.has(k)) continue;
    let name = ATTR[k] ?? k;
    if (inSvg && !k.startsWith("data-") && !k.startsWith("aria-") && k.includes("-")) name = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (x.tagName === "INPUT" && k === "value") name = "defaultValue";
    if (x.tagName === "INPUT" && k === "checked") { out.push("defaultChecked"); continue; }
    if (BOOL.has(k) && ve === "") { out.push(name); continue; }
    if (NUM.has(k) && /^\d+$/.test(ve) && (vs === undefined || vs === ve)) { out.push(`${name}={${ve}}`); continue; }
    if ((k === "width" || k === "height") && /^\d+$/.test(ve) && !inSvg && (vs === undefined || vs === ve)) { out.push(`${name}={${ve}}`); continue; }
    out.push(`${name}=${braceOrStr(ve, vs, k)}`);
  }
  if (extra.add) out.push(...extra.add);
  return out.length ? " " + out.join(" ") : "";
}

function braceOrStr(en, es, name) {
  const e = attrExpr(name, en, es);
  if (e) return `{${e}}`;
  return /["{}\n]|&/.test(en) ? `{${q(en)}}` : `"${en}"`;
}

function textJsx(raw, rawEs) {
  const en = decode(raw), es = rawEs === undefined ? en : decode(rawEs);
  const lead = /^\s/.test(en), trail = /\s$/.test(en);
  const ce = en.replace(/\s+/g, " ").trim(), cs = es.replace(/\s+/g, " ").trim();
  let core;
  if (ce !== cs) core = `{${t(ce, cs)}}`;
  else core = /[{}<>&"']/.test(ce) || /^\s|\s$/.test(ce) ? `{${q(ce)}}` : ce;
  return (lead ? '{" "}' : "") + core + (trail ? '{" "}' : "");
}

const isBlockEl = (n) => n && n.nodeType === 1 && BLOCK.has(n.tagName.toLowerCase());

let worldMap = null;

function children(x, y, depth, inSvg) {
  const cx = x.childNodes, cy = y?.childNodes;
  const aligned = cy && cx.length === cy.length && cx.every((c, i) => c.nodeType === cy[i].nodeType && (c.nodeType !== 1 || c.tagName === cy[i].tagName));
  if (y && !aligned) {
    // la estructura cambia entre idiomas (pasa en un solo parrafo): se generan las dos
    const pad = "  ".repeat(depth);
    return `\n${pad}{lang === "es" ? (\n${pad}  <>${children(y, null, depth + 2, inSvg)}</>\n${pad}) : (\n${pad}  <>${children(x, null, depth + 2, inSvg)}</>\n${pad})}`;
  }
  const tag = x.tagName?.toLowerCase();
  let s = "";
  cx.forEach((c, i) => {
    const d = aligned ? cy[i] : undefined;
    if (c.nodeType === 3) {
      if (!c.rawText.trim()) {
        const prev = cx[i - 1], next = cx[i + 1];
        if (DROP_WS_IN.has(tag) || inSvg) return;
        if ((!prev || isBlockEl(prev) || prev.nodeType === 8) && (!next || isBlockEl(next) || next.nodeType === 8)) return;
        // al principio o al final de un bloque, el espacio no se ve
        if ((!prev || !next) && BLOCK.has(tag)) return;
        s += '{" "}';
        return;
      }
      s += textJsx(c.rawText, d?.rawText);
      return;
    }
    if (c.nodeType === 8) {
      s += `\n${"  ".repeat(depth)}{/* ${c.rawText.trim().replace(/\*\//g, "* /")} */}`;
      return;
    }
    s += "\n" + "  ".repeat(depth) + element(c, d, depth, inSvg);
  });
  if (cx.some((c) => c.nodeType !== 3)) s += "\n" + "  ".repeat(Math.max(depth - 1, 0));
  return s;
}

function element(x, y, depth, inSvg = false) {
  const tag = x.tagName.toLowerCase();
  const svg = inSvg || tag === "svg";
  if (tag === "svg" && x.getAttribute("id") === "worldMapSvg") {
    worldMap = x;
    return `<WorldMap ariaLabel={${t(x.getAttribute("aria-label"), y?.getAttribute("aria-label") ?? x.getAttribute("aria-label"))}} />`;
  }
  let extra = {};
  if (tag === "select") {
    const opt = x.querySelectorAll("option").find((o) => o.hasAttribute("selected"));
    if (opt) extra.add = [`defaultValue=${braceOrStr(opt.getAttribute("value") ?? opt.text)}`];
  }
  if (tag === "option") extra.skip = new Set(["selected"]);
  if (tag === "textarea") {
    const v = x.text;
    return `<textarea${attrs(x, y, svg, { add: v ? [`defaultValue={${q(v)}}`] : [] })} />`;
  }
  const a = attrs(x, y, svg, extra);
  if (VOID.has(tag) || (!x.childNodes.length && svg)) return `<${tag}${a} />`;
  if (!x.childNodes.length) return `<${tag}${a}></${tag}>`;
  return `<${tag}${a}>${children(x, y, depth + 1, svg)}</${tag}>`;
}

// ---------- secciones ----------
const NAMES = {
  NAV: "SiteHeader", "page-home": "HomePage", "page-bio": "BioPage", "page-work": "WorkPage", lightbox: "Lightbox",
  muralPageOverlay: "MuralPageOverlay", "page-live": "ServicesPage", "page-shop": "ShopPage", quote: "QuoteSection",
  brands: "BrandsSection", FOOTER: "SiteFooter",
};
const en = bodyKids(EN), es = bodyKids(ES);
if (en.length !== es.length) throw new Error("las dos versiones no tienen las mismas secciones");

const groups = [];
let tools = null;
en.forEach((x, i) => {
  const key = NAMES[x.id] ?? NAMES[x.tagName] ?? (x.classList?.contains("brands") ? NAMES.brands : null);
  if (key) groups.push({ name: key, nodes: [[x, es[i]]] });
  else {
    if (!tools) groups.push((tools = { name: "EditTools", nodes: [] }));
    tools.nodes.push([x, es[i]]);
  }
});

const header = (name, body, usesT, usesL, extraImports = "") => `// Generado desde el HTML original de la home (tools/migrate/home-to-tsx.mjs).
// De ahora en adelante se edita a mano.
import type { Lang } from "@/lib/site";
${usesT || usesL ? `import { ${[usesT && "translator", usesL && "localizer"].filter(Boolean).join(", ")} } from "./i18n";\n` : ""}${extraImports}
export function ${name}({ lang }: { lang: Lang }) {
${usesT ? "  const t = translator(lang);\n" : ""}${usesL ? "  const l = localizer(lang);\n" : ""}  return (
${body}
  );
}
`;

const index = [];
for (const g of groups) {
  worldMap = null;
  const parts = g.nodes.map(([x, y]) => "    " + element(x, y, 3) + (x.nextSibling?.nodeType === 8 ? "" : ""));
  let body = parts.length > 1 ? `    <>\n${parts.map((p) => "  " + p).join("\n")}\n    </>` : parts[0];
  const usesT = /\bt\(/.test(body), usesL = /\bl\(/.test(body);
  const imp = worldMap ? `import { WorldMap } from "./WorldMap";\n` : "";
  if (worldMap) writeWorldMap(worldMap);
  const usesLang = /\blang\b/.test(body.replace(/\blang=/g, "")) || usesT || usesL;
  let code = header(g.name, body, usesT, usesL, imp);
  if (!usesLang) code = code.replace("export function " + g.name + "({ lang }: { lang: Lang })", "export function " + g.name + "(_props: { lang: Lang })");
  writeFileSync(path.join(OUT, g.name + ".tsx"), code);
  index.push(g.name);
}

function writeWorldMap(svg) {
  const paths = svg.querySelectorAll("path").map((p) => {
    const o = { className: p.getAttribute("class"), d: p.getAttribute("d") };
    if (p.getAttribute("data-country")) o.country = p.getAttribute("data-country");
    return o;
  });
  const g = svg.querySelector("g");
  writeFileSync(
    path.join(ROOT, "src/data/world-map.ts"),
    `// Contornos del mapa del mundo de la bio. Los paises con data-country se resaltan.
export interface MapShape {
  className: string;
  d: string;
  country?: string;
}

export const MAP_VIEWBOX = ${q(svg.getAttribute("viewBox"))};
export const MAP_GROUP_CLASS = ${q(g?.getAttribute("class") ?? "")};

export const mapShapes: MapShape[] = ${JSON.stringify(paths)};
`,
  );
}

console.log("componentes:", index.join(", "));

