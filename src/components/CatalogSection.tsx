import { getTranslations } from "next-intl/server";
import { HammamCard, type HammamCardData } from "./HammamCard";

export async function CatalogSection({
  hammams,
}: {
  hammams: HammamCardData[];
}) {
  const t = await getTranslations("catalog");

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <div className="mb-10 max-w-2xl">
        <h2 className="display text-4xl text-[var(--stone-deep)] md:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-3 text-[var(--stone)]">{t("subtitle")}</p>
        <div className="gold-rule mt-6 w-28" />
      </div>

      {hammams.length === 0 ? (
        <p className="marble-panel rounded-3xl p-8 text-[var(--stone)]">
          {t("empty")}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hammams.map((hammam) => (
            <HammamCard key={hammam.id} hammam={hammam} />
          ))}
        </div>
      )}
    </section>
  );
}
