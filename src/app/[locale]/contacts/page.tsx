import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacts");

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 md:px-6">
      <h1 className="display text-5xl text-[var(--stone-deep)]">{t("title")}</h1>
      <p className="mt-4 text-lg text-[var(--stone)]">{t("subtitle")}</p>
      <div className="gold-rule my-8 w-28" />
      <div className="marble-panel rounded-3xl p-8">
        <p className="label">{t("email")}</p>
        <a
          href="mailto:blackleon1699@gmail.com"
          className="display text-3xl text-[var(--gold-deep)] transition hover:text-[var(--gold)]"
        >
          blackleon1699@gmail.com
        </a>
        <p className="mt-6 text-sm text-[var(--stone)]">{t("writeUs")}</p>
      </div>
    </section>
  );
}
