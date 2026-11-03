import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { baseMetadata, viewport } from "@/lib/metadata";

export const metadata = baseMetadata;
export { viewport };

export default function SpanishLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
