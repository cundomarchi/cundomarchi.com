import { readFileSync } from "node:fs";
import path from "node:path";
import type { Lang } from "./site";

/**
 * La home todavia es el HTML original (src/legacy/index.<lang>.html) con su
 * script.js. Aca se separa lo que Next maneja (head, JSON-LD) del cuerpo, que
 * se entrega tal cual para que todo el comportamiento siga funcionando.
 */
export interface LegacyDocument {
  body: string;
  jsonLd: string[];
}

const cache = new Map<string, LegacyDocument>();

export function loadLegacyDocument(name: string): LegacyDocument {
  const hit = cache.get(name);
  if (hit) return hit;

  const file = path.join(process.cwd(), "src", "legacy", name);
  const html = readFileSync(file, "utf8");

  const head = html.slice(0, html.indexOf("<body"));
  const jsonLd = [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => m[1].trim(),
  );

  const bodyStart = html.indexOf(">", html.indexOf("<body")) + 1;
  const bodyEnd = html.lastIndexOf("</body>");
  const body = html.slice(bodyStart, bodyEnd);

  const doc = { body, jsonLd };
  cache.set(name, doc);
  return doc;
}

export function loadLegacyHome(lang: Lang): LegacyDocument {
  return loadLegacyDocument(`index.${lang}.html`);
}
