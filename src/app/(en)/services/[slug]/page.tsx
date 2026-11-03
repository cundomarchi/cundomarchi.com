import { notFound } from "next/navigation";
import { getServicePage, getServicePages } from "@/data";
import { ServiceView } from "@/components/service/ServiceView";
import { serviceMetadata } from "@/lib/service-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getServicePages("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  return serviceMetadata("en", (await params).slug);
}

export default async function ServicePage({ params }: Props) {
  const page = getServicePage("en", (await params).slug);
  if (!page) notFound();
  return <ServiceView page={page} />;
}
