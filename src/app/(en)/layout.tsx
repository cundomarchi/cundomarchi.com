import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { baseMetadata, viewport } from "@/lib/metadata";

export const metadata = baseMetadata;
export { viewport };

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
