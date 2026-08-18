"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { CallbackModal } from "./CallbackModal";

export function Header() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(247,242,234,0.82)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Aslan"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover shadow-[0_0_0_1px_rgba(201,162,39,0.35)]"
              priority
            />
            <span className="display text-2xl font-semibold tracking-[0.08em] text-[var(--stone-deep)]">
              {t("brand")}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-[var(--stone)] md:flex">
            <Link href="/" className="transition hover:text-[var(--gold-deep)]">
              {t("nav.home")}
            </Link>
            <Link
              href="/hammams"
              className="transition hover:text-[var(--gold-deep)]"
            >
              {t("nav.hammams")}
            </Link>
            <Link
              href="/contacts"
              className="transition hover:text-[var(--gold-deep)]"
            >
              {t("nav.contacts")}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1 rounded-full border border-[var(--line)] bg-[rgba(255,252,247,0.7)] p-1 text-xs uppercase tracking-wide sm:flex">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={pathname}
                  locale={item}
                  className={`rounded-full px-2 py-1 transition ${
                    item === locale
                      ? "bg-[var(--gold)] text-[#2a220c]"
                      : "text-[var(--stone)] hover:text-[var(--gold-deep)]"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="btn-gold !px-3 !py-2 text-sm sm:!px-4"
              onClick={() => setOpen(true)}
            >
              {t("nav.request")}
            </button>
            <button
              type="button"
              className="btn-ghost !px-3 !py-2 md:hidden"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[var(--line)] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm text-[var(--stone)]">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                {t("nav.home")}
              </Link>
              <Link href="/hammams" onClick={() => setMenuOpen(false)}>
                {t("nav.hammams")}
              </Link>
              <Link href="/contacts" onClick={() => setMenuOpen(false)}>
                {t("nav.contacts")}
              </Link>
              <div className="flex flex-wrap gap-2 pt-2">
                {locales.map((item) => (
                  <Link
                    key={item}
                    href={pathname}
                    locale={item}
                    className={`rounded-full px-3 py-1 uppercase ${
                      item === locale
                        ? "bg-[var(--gold)] text-[#2a220c]"
                        : "border border-[var(--line)]"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      <CallbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
