/** Datos estructurados para Google. Acepta un objeto o JSON ya serializado. */
export function JsonLd({ json, data }: { json?: string; data?: unknown }) {
  const text = json ?? JSON.stringify(data);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: text.replace(/</g, "\\u003c") }} />;
}
