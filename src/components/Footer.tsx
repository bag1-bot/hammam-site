"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-center md:px-6">
        <div className="gold-rule mb-4" />
        <p className="display text-xl text-[var(--stone-deep)]">{t("brand")}</p>
        <p className="text-sm text-[var(--stone)]">{t("footer.tagline")}</p>
        <p className="text-xs text-[var(--stone)]">
          © {year} Aslan. {t("footer.rights")}
        </p>
        <a
          href="mailto:blackleon1699@gmail.com"
          className="text-sm text-[var(--gold-deep)] transition hover:text-[var(--gold)]"
        >
          blackleon1699@gmail.com
        </a>
      </div>
    </footer>
  );
}
