import { notFound } from "next/navigation";
import { getMuralPage, getMuralPages } from "@/data";
import { MuralView } from "@/components/mural/MuralView";
import { muralMetadata } from "@/lib/mural-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getMuralPages("es").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  return muralMetadata("es", (await params).slug);
}

export default async function MuralPage({ params }: Props) {
  const page = getMuralPage("es", (await params).slug);
  if (!page) notFound();
  return <MuralView page={page} />;
}
