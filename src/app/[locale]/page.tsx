import { setRequestLocale } from "next-intl/server";
import { CatalogSection } from "@/components/CatalogSection";
import { Hero } from "@/components/Hero";
import { getPublishedHammams } from "@/lib/hammams";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const hammams = await getPublishedHammams();

  return (
    <>
      <Hero />
      <CatalogSection hammams={hammams} />
    </>
  );
}
