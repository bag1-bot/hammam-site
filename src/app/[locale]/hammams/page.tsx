import { getTranslations, setRequestLocale } from "next-intl/server";
import { CatalogSection } from "@/components/CatalogSection";
import { getPublishedHammams } from "@/lib/hammams";

export const dynamic = "force-dynamic";

export default async function HammamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");
  const hammams = await getPublishedHammams();

  return (
    <div className="pt-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h1 className="display text-4xl text-[var(--stone-deep)] md:text-5xl">
          {t("title")}
        </h1>
      </div>
      <CatalogSection hammams={hammams} />
    </div>
  );
}
